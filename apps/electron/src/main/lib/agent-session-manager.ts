/**
 * Agent 会话管理器
 *
 * 负责 Agent 会话的 CRUD 操作和消息持久化。
 * - 会话索引：~/.proma/agent-sessions.json（轻量元数据）
 * - 消息存储：~/.proma/agent-sessions/{id}.jsonl（JSONL 格式，逐行追加）
 *
 * 照搬 conversation-manager.ts 的模式。
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, unlinkSync, rmSync, renameSync, readdirSync, cpSync, copyFileSync, createReadStream, createWriteStream, statSync, openSync, closeSync, fsyncSync, type WriteStream, type Dirent } from 'node:fs'
import { createInterface } from 'node:readline'
import { writeJsonFileAtomic, readJsonFileSafe } from './safe-file'
import { randomUUID } from 'node:crypto'
import { isAbsolute, join, relative, resolve, dirname } from 'node:path'
import {
  getAgentSessionsIndexPath,
  getAgentSessionsDir,
  getAgentSessionMessagesPath,
  getPiHarnessEventsPath,
  getAgentSessionWorkspacePath,
  getAgentWorkspacePath,
  getPiCheckpointsDir,
  getSdkConfigDir,
  getStudyMaterialsRootDir,
  getStudySessionsRootDir,
} from './config-paths'
import { getAgentWorkspace, ensureDefaultWorkspace } from './agent-workspace-manager'
import { assertEnabledModelForChannel } from './agent-model-selection'
import { copyForkWorkspaceFiles } from './agent-fork-workspace-copy'
import { copyForkFile, buildForkProjectKey, renameForkFile, removeForkPath } from './fork-file-ops'
import { listAgentPresets, normalizeSessionPresetId, presetReferenceForId } from './agent-preset-manager'
import { copySettledPiHarnessEventsForFork } from './pi-harness/pi-harness-store'
import { forkPiSessionArtifact } from './pi-session-fork'
import { isRecoveredEphemeralTransportError } from './error-patterns'
import { adoptPiFileCheckpoints, loadPiFileCheckpoint, restorePiFileCheckpoint, prunePiFileCheckpoints, removePiFileCheckpoints } from './pi-file-checkpoint'

// 在模块加载时一次性设置 SDK 配置目录，避免在 forkSession 等异步调用中临时修改/恢复
// process.env 导致的并发安全问题（异步操作的 await 间隙其他代码可能读到错误值）。
//
// ⚠️ 必须【无条件】强制覆盖，不能用 `if (!process.env.CLAUDE_CONFIG_DIR)` 守卫：
// getSdkConfigDir 的设计目标就是「与用户 Claude Code CLI 的配置隔离」。若用户装了
// Claude Code CLI（或 shell/CI 里）本就设了 CLAUDE_CONFIG_DIR，旧守卫会跳过覆盖 →
// 进程内的 sdk.forkSession（只读 process.env，不像 orchestrator query 子进程那样显式传参）
// 会去读用户/CLI 的配置目录，导致 dev/生产/CLI 三方 SDK 会话数据互相污染、fork 报
// "Session not found"。这里强制指向 Profer 隔离目录，检测到外部不同值时打 warn 以便排查。
{
  const proferSdkConfigDir = getSdkConfigDir()
  const ambientConfigDir = process.env.CLAUDE_CONFIG_DIR
  if (ambientConfigDir && ambientConfigDir !== proferSdkConfigDir) {
    console.warn(
      `[Agent 会话] 检测到外部 CLAUDE_CONFIG_DIR=${ambientConfigDir}（可能来自 Claude Code CLI / shell / CI），` +
      `已强制覆盖为 Profer 隔离目录: ${proferSdkConfigDir}（配置隔离，避免 SDK 会话数据串目录）`,
    )
  }
  process.env.CLAUDE_CONFIG_DIR = proferSdkConfigDir
}
import {
  normalizeAgentRuntime,
  type AgentSessionMeta,
  type AgentSessionOwner,
  isReviewOwnedAgentSession,
  isVisibleAgentSession,
  type AgentMessage,
  type SDKMessage,
  type SDKUserMessage,
  type ForkSessionInput,
  type AgentMessageSearchResult,
  type AgentSessionReferenceSearchInput,
  type AgentSessionReferenceSearchResult,
  type SessionHealth,
  type AgentRuntime,
  type RewindSessionResult,
  SESSION_BLOB_REFS_FIELD,
  SESSION_BLOB_MISSING_FIELD,
  readSessionBlobRefs,
} from '@profer/shared'
import { getConversationMessages } from './conversation-manager'
import { isUserInputMessage, extractUserText } from '@profer/session-core'

const activeForkSessionIds = new Set<string>()
let agentSessionActiveChecker: ((sessionId: string) => boolean) | undefined

/** 由 agent-service 注入运行时活跃状态，避免 manager 反向依赖 orchestrator。 */
export function setAgentSessionActiveChecker(checker: ((sessionId: string) => boolean) | undefined): void {
  agentSessionActiveChecker = checker
}

export function isAgentSessionForking(sessionId: string): boolean {
  return activeForkSessionIds.has(sessionId)
}

interface PersistedAssistantMessage {
  type?: string
  role?: string
  content?: string
  message?: { content?: Array<{ type?: string; text?: string }> }
  error?: { message?: string; errorType?: string }
  errorCode?: string
  _errorCode?: string
}

function getPersistedAssistantError(message: unknown): { errorCode?: string; errorText?: string } | null {
  if (!message || typeof message !== 'object') return null
  const assistant = message as PersistedAssistantMessage
  const isAssistantError = assistant.type === 'assistant' && (assistant.error || assistant._errorCode)
  const isLegacyStatusError = assistant.role === 'status' && assistant.errorCode
  if (!isAssistantError && !isLegacyStatusError) return null
  const errorText = assistant.error?.message ?? assistant.message?.content
    ?.filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text!)
    .join('\n') ?? assistant.content
  return { errorCode: assistant._errorCode ?? assistant.error?.errorType ?? assistant.errorCode, errorText }
}
import {
  getGraphJsonlPath,
  parseEventsFromJsonl,
  serializeEvent,
} from '@profer/project-core'
// GPT Image 生图工具仅在 Chat 模式可用，Agent 模式不需要清理逻辑

/**
 * 会话索引文件格式
 */
interface AgentSessionsIndex {
  /** 配置版本号 */
  version: number
  /** 会话元数据列表 */
  sessions: AgentSessionMeta[]
  /** Deleted internal-review IDs; never exposed as ordinary sessions after owner metadata is removed. */
  reviewOwnerDeletionTombstones?: string[]
}

/** 当前索引版本 */
const INDEX_VERSION = 1

/**
 * 会话索引的内存缓存。
 *
 * Agent 运行期间会多次读取和更新会话元数据。索引随历史会话增长后，反复同步
 * readFile + JSON.parse 会直接阻塞主进程；用 mtime 和 size 校验可保留外部修改感知。
 */
type AgentIndexCache = {
  data: AgentSessionsIndex
  mtimeMs: number
  size: number
  /** Read-only derived membership; rebuilt from the SAME verified index snapshot. */
  reviewOwnerIds: ReadonlySet<string>
  deletedReviewOwnerIds: ReadonlySet<string>
}
let indexCache: AgentIndexCache | null = null

/**
 * P06-FIX-01: irreversible ID-only deny journal, independent of the rolling
 * agent-sessions.json / .tmp / .bak snapshots. Owner creation writes this
 * fence BEFORE committing the owner metadata; a stale .bak can then lose
 * metadata but never silently reclassify a review owner as ordinary.
 *
 * No case IDs, transcripts, tasks, runtime fields or SDK content are stored.
 * Entries must never be garbage-collected without a separately proven policy.
 */
const REVIEW_OWNER_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
type ReviewOwnerFenceCache = { path: string; mtimeMs: number; size: number; ids: ReadonlySet<string> }
let reviewOwnerFenceCache: ReviewOwnerFenceCache | null = null

function ownerFencePath(): string {
  return join(dirname(getAgentSessionsIndexPath()), 'review-owner-ids.log')
}

function readOwnerFences(): ReadonlySet<string> {
  const path = ownerFencePath()
  let stat: ReturnType<typeof statSync>
  try {
    stat = statSync(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      reviewOwnerFenceCache = null
      return new Set()
    }
    throw new Error('审核会话身份安全记录不可读取', { cause: error })
  }
  if (!stat.isFile()) throw new Error('审核会话身份安全记录不是普通文件')
  if (reviewOwnerFenceCache?.path === path && reviewOwnerFenceCache.mtimeMs === stat.mtimeMs && reviewOwnerFenceCache.size === stat.size) {
    return reviewOwnerFenceCache.ids
  }
  const contents = readFileSync(path, 'utf8')
  // A torn append or unrecognized schema cannot be interpreted as "no owners".
  if (contents && !contents.endsWith('\n')) throw new Error('审核会话身份安全记录存在不完整条目')
  const ids = new Set<string>()
  for (const line of contents.split('\n')) {
    if (!line) continue
    if (!REVIEW_OWNER_UUID.test(line)) throw new Error('审核会话身份安全记录存在非法条目')
    ids.add(line.toLowerCase())
  }
  reviewOwnerFenceCache = { path, mtimeMs: stat.mtimeMs, size: stat.size, ids }
  return ids
}

function persistReviewOwnerFences(ids: readonly string[]): void {
  if (!ids.length) return
  const known = readOwnerFences()
  const missing = [...new Set(ids.map(id => id.toLowerCase()))].filter(id => !known.has(id))
  if (!missing.length) return
  if (missing.some(id => !REVIEW_OWNER_UUID.test(id))) throw new Error('审核会话身份 ID 格式非法')
  const path = ownerFencePath()
  const fd = openSync(path, 'a', 0o600)
  try {
    writeFileSync(fd, missing.map(id => id + '\n').join(''), 'utf8')
    fsyncSync(fd)
  } finally {
    closeSync(fd)
    reviewOwnerFenceCache = null
  }
  const persisted = readOwnerFences()
  if (missing.some(id => !persisted.has(id))) throw new Error('审核会话身份安全记录未持久化')
}


function cacheIndex(data: AgentSessionsIndex): void {
  try {
    const stat = statSync(getAgentSessionsIndexPath())
    indexCache = {
      data, mtimeMs: stat.mtimeMs, size: stat.size,
      reviewOwnerIds: new Set(data.sessions.filter(isReviewOwnedAgentSession).map((session) => session.id)),
      deletedReviewOwnerIds: new Set(data.reviewOwnerDeletionTombstones ?? []),
    }
  } catch {
    // 无法确认磁盘版本时绝不复用内存数据，交给下次读取走恢复路径。
    indexCache = null
  }
}

/** UPDATE_SESSION_AGENT_RUNTIME 需要原子回滚的 runtime-owned 元数据快照。 */
export interface AgentRuntimeMetaSnapshot {
  agentRuntime: AgentRuntime
  codexFastMode?: boolean
  sdkSessionId?: string
  piSessionFile?: string
  piEntryBindings?: Record<string, string>
  piFileCheckpoints?: Record<string, string>
  forkSourceDir?: string
  forkSourceSdkSessionId?: string
  resumeAtMessageUuid?: string
}

export function snapshotAgentRuntimeMeta(meta: AgentSessionMeta): AgentRuntimeMetaSnapshot {
  return {
    agentRuntime: normalizeAgentRuntime(meta.agentRuntime),
    codexFastMode: meta.codexFastMode,
    sdkSessionId: meta.sdkSessionId,
    piSessionFile: meta.piSessionFile,
    piEntryBindings: meta.piEntryBindings,
    piFileCheckpoints: meta.piFileCheckpoints,
    forkSourceDir: meta.forkSourceDir,
    forkSourceSdkSessionId: meta.forkSourceSdkSessionId,
    resumeAtMessageUuid: meta.resumeAtMessageUuid,
  }
}

/**
 * 直接替换 runtime-owned 字段，绕过 updateAgentSessionMeta 的 runtime 切换清理规则。
 * 仅用于 updateSettings 失败后的回滚，避免回滚本身再次清空 SDK/fork/resume 元数据。
 */
export function restoreAgentRuntimeMeta(id: string, snapshot: AgentRuntimeMetaSnapshot): AgentSessionMeta {
  const index = readIndex()
  const idx = index.sessions.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error(`Agent 会话不存在: ${id}`)

  const existing = index.sessions[idx]!
  const restored: AgentSessionMeta = {
    ...existing,
    agentRuntime: snapshot.agentRuntime,
    codexFastMode: snapshot.codexFastMode,
    sdkSessionId: snapshot.sdkSessionId,
    piSessionFile: snapshot.piSessionFile,
    piEntryBindings: snapshot.piEntryBindings,
    piFileCheckpoints: snapshot.piFileCheckpoints,
    forkSourceDir: snapshot.forkSourceDir,
    forkSourceSdkSessionId: snapshot.forkSourceSdkSessionId,
    resumeAtMessageUuid: snapshot.resumeAtMessageUuid,
    updatedAt: Date.now(),
  }
  index.sessions[idx] = restored
  writeIndex(index)
  return restored
}

/**
 * 在存储边界统一补全 runtime：历史/非法值绝不进入 Pi，均回退 Claude。
 * 此处只更新内存对象，不在读取阶段改写用户索引；下一次正常元数据写入会自然持久化。
 */
function normalizeSessionRuntime(session: AgentSessionMeta): AgentSessionMeta {
  const agentRuntime = normalizeAgentRuntime(session.agentRuntime)
  return session.agentRuntime === agentRuntime ? session : { ...session, agentRuntime }
}

/** 移除 Agent 知识库下线前遗留的 session allowlist，不影响 Chat 消息中的同名字段。 */
function removeLegacyAgentKnowledgeReferences(session: AgentSessionMeta): AgentSessionMeta {
  if (!Object.prototype.hasOwnProperty.call(session, 'knowledgeReferences')) return session
  const { knowledgeReferences: _removed, ...withoutKnowledgeReferences } = session as AgentSessionMeta & { knowledgeReferences?: unknown }
  return withoutKnowledgeReferences
}

/**
 * 读取会话索引文件
 */
function readIndex(): AgentSessionsIndex {
  const indexPath = getAgentSessionsIndexPath()

  if (indexCache) {
    try {
      const stat = statSync(indexPath)
      if (stat.mtimeMs === indexCache.mtimeMs && stat.size === indexCache.size) {
        return indexCache.data
      }
    } catch {
      indexCache = null
    }
  }

  const data = readJsonFileSafe<AgentSessionsIndex>(indexPath)
  if (data) {
    if (typeof data.version !== 'number' || !Array.isArray(data.sessions)
      || (data.reviewOwnerDeletionTombstones !== undefined && !Array.isArray(data.reviewOwnerDeletionTombstones))) {
      throw new Error('Agent 会话索引结构无效，不能按空普通会话恢复')
    }
    let removedLegacyKnowledgeReferences = false
    const sessions = Array.isArray(data.sessions)
      ? data.sessions.map((session) => {
          const normalized = normalizeSessionRuntime(session)
          const cleaned = removeLegacyAgentKnowledgeReferences(normalized)
          if (cleaned !== normalized) removedLegacyKnowledgeReferences = true
          return cleaned
        })
      : []
    const normalized: AgentSessionsIndex = { ...data, sessions }
    // Upgrade existing live owners and ID-only deletion tombstones before
    // granting ANY ordinary access derived from a recovered index snapshot.
    // If the fence is not durable, fail closed instead of trusting the .bak.
    persistReviewOwnerFences([
      ...sessions.filter(isReviewOwnedAgentSession).map(s => s.id),
      ...(normalized.reviewOwnerDeletionTombstones ?? []),
    ])
    let cacheNormalized = true
    if (removedLegacyKnowledgeReferences) {
      try {
        writeJsonFileAtomic(indexPath, normalized)
        console.info('[Agent 会话] 已清理下线前遗留的知识库引用字段')
      } catch (error) {
        cacheNormalized = false
        console.warn('[Agent 会话] 清理遗留知识库引用字段失败，将在下次读取时重试:', error)
      }
    }
    if (cacheNormalized) cacheIndex(normalized)
    return normalized
  }
  // A fresh profile has no index files. Broken existing files, however, are
  // never equivalent to a fresh empty ordinary index.
  if ([indexPath, indexPath + '.tmp', indexPath + '.bak'].some(existsSync)) {
    throw new Error('Agent 会话索引损坏且无法恢复，已拒绝普通会话访问')
  }
  return { version: INDEX_VERSION, sessions: [] }
}

/**
 * 写入会话索引文件
 */
function writeIndex(index: AgentSessionsIndex): void {
  const indexPath = getAgentSessionsIndexPath()

  try {
    writeJsonFileAtomic(indexPath, index)
    cacheIndex(index)
  } catch (error) {
    // 调用方可能已原地修改缓存对象；写入失败后不能继续返回未落盘数据。
    indexCache = null
    console.error('[Agent 会话] 写入索引文件失败:', error)
    throw new Error('写入 Agent 会话索引失败')
  }
}

/**
 * 为委派子会话创建 agent-sessions.json 索引条目。
 *
 * 协作 MCP 工具（由平台层提供）创建子 SDK 会话后，需调用此函数将元数据
 * 写入 Profer 的 agent-sessions.json，否则侧栏无法发现和显示该子会话。
 */
export function createDelegatedChildSessionMeta(params: {
  childSessionId: string
  parentSessionId: string
  sourceDelegationId: string
  title: string
  channelId?: string
  modelId?: string
  workspaceId?: string
  delegationRole?: string
  delegationGoal?: string
  permissionMode?: import('@profer/shared').ProferPermissionMode
}): AgentSessionMeta {
  const index = readIndex()
  const now = Date.now()

  // 检查是否已存在（幂等）
  if (index.reviewOwnerDeletionTombstones?.includes(params.childSessionId)) {
    throw new Error('已删除的内部审核会话 ID 不可重新用作普通会话')
  }
  const existing = index.sessions.find((s) => s.id === params.childSessionId)
  if (existing) {
    return updateAgentSessionMeta(params.childSessionId, {
      parentSessionId: params.parentSessionId,
      sourceDelegationId: params.sourceDelegationId,
      delegationStatus: 'running',
      delegationRole: params.delegationRole,
      delegationGoal: params.delegationGoal,
      permissionMode: params.permissionMode,
    })
  }

  const meta: AgentSessionMeta = {
    id: params.childSessionId,
    title: params.title || '委派子会话',
    channelId: params.channelId,
    modelId: params.modelId,
    workspaceId: params.workspaceId,
    parentSessionId: params.parentSessionId,
    sourceDelegationId: params.sourceDelegationId,
    delegationStatus: 'running',
    delegationRole: params.delegationRole,
    delegationGoal: params.delegationGoal,
    permissionMode: params.permissionMode,
    createdAt: now,
    updatedAt: now,
  }

  index.sessions.push(meta)
  writeIndex(index)

  console.log(`[协作] 已创建委派子会话索引: ${meta.title} (${meta.id})`)
  return meta
}

/**
 * 获取会话列表（按 updatedAt 降序）
 *
 * @param includeArchived 是否包含已归档会话；默认 false（高频侧边栏刷新只拉活跃）
 */
export function listAgentSessions(includeArchived = false): AgentSessionMeta[] {
  const index = readIndex()
  return index.sessions
    .filter((s) => includeArchived || !s.archived)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * 已归档 Agent 会话数量（轻量计数，不排序、不返回 meta）
 */
export function countArchivedAgentSessions(): number {
  const index = readIndex()
  let count = 0
  for (const s of index.sessions) {
    if (s.archived && isVisibleAgentSession(s)) count += 1
  }
  return count
}

/**
 * 获取单个会话的元数据
 */
export function getAgentSessionMeta(id: string): AgentSessionMeta | undefined {
  const index = readIndex()
  return index.sessions.find((s) => s.id === id)
}

/** Persistent ID-only ownership fence: protects late IPC/events after internal meta deletion. */
export function isReviewOwnedOrDeletedAgentSessionId(sessionId: string): boolean {
  if (!sessionId) return false
  try {
    // The monotonic ID-only journal survives a stale .bak or lost metadata.
    if (readOwnerFences().has(sessionId.toLowerCase())) return true
    const index = readIndex()
    // readIndex verifies the cache's on-disk mtime and size. Never keep a
  // separately-lived Set: every successful index write and external reload
  // rebuilds these IDs from the corresponding authoritative snapshot.
  const lookup = indexCache?.data === index ? indexCache : null
  if (lookup) return lookup.reviewOwnerIds.has(sessionId) || lookup.deletedReviewOwnerIds.has(sessionId)
  // When the index cannot be safely cached, retain the original security check.
    return isReviewOwnedAgentSession(index.sessions.find((session) => session.id === sessionId))
      || (index.reviewOwnerDeletionTombstones?.includes(sessionId) ?? false)
  } catch (error) {
    // If the index or deny journal is damaged/inaccessible, an unknown ID
    // cannot be safely *proved* ordinary. Deny its ordinary entry points.
    console.warn('[Agent 会话] 身份索引不可确认，拒绝普通访问:', error)
    return true
  }
}

/**
 * 收集其他会话仍在引用的 Pi 文件检查点路径。
 *
 * 正常分叉会迁移基线到自己的目录；这里仍保护旧版/迁移失败时遗留的跨会话引用，
 * 防止源会话常规回收把分叉侧的回退点静默删掉。这些路径仍计入所在会话的体积/数量预算。
 *
 * @param excludeSessionId 正在做回收的会话；它自己的引用由调用方显式传入
 */
export function collectForeignCheckpointPaths(excludeSessionId: string): Set<string> {
  const referenced = new Set<string>()
  for (const session of readIndex().sessions) {
    if (session.id === excludeSessionId) continue
    for (const checkpointPath of Object.values(session.piFileCheckpoints ?? {})) referenced.add(checkpointPath)
  }
  return referenced
}

function isPathWithin(root: string, candidate: string): boolean {
  const relativePath = relative(resolve(root), resolve(candidate))
  return Boolean(relativePath)
    && relativePath !== '..'
    && !relativePath.startsWith('../')
    && !relativePath.startsWith('..\\')
    && !isAbsolute(relativePath)
}

/**
 * 获取删除指定会话时应一并处理的会话 ID，顺序为子会话到父会话。
 * 仅将带 sourceDelegationId 的协作委派子会话纳入级联删除，避免误删普通会话。
 */
export function getAgentSessionDeletionOrder(id: string): string[] {
  const sessions = readIndex().sessions
  const childrenByParentId = new Map<string, AgentSessionMeta[]>()
  for (const session of sessions) {
    if (!session.parentSessionId || !session.sourceDelegationId) continue
    const children = childrenByParentId.get(session.parentSessionId) ?? []
    children.push(session)
    childrenByParentId.set(session.parentSessionId, children)
  }

  const visited = new Set<string>()
  const order: string[] = []
  const visit = (sessionId: string): void => {
    if (visited.has(sessionId)) return
    visited.add(sessionId)
    for (const child of childrenByParentId.get(sessionId) ?? []) visit(child.id)
    order.push(sessionId)
  }
  visit(id)
  return order
}

/**
 * 创建新会话
 */
export function createAgentSession(
  title?: string,
  channelId?: string,
  workspaceId?: string,
  modelId?: string,
  agentRuntime: AgentRuntime = 'pi',
  draft = false,
  presetId?: string,
  owner?: AgentSessionOwner,
): AgentSessionMeta {
  const index = readIndex()
  const now = Date.now()

  // 预设与沙箱工作区化：未指定工作区时自动绑定默认沙箱工作区（杜绝无工作区漂移）
  const effectiveWorkspace = workspaceId ? getAgentWorkspace(workspaceId) : ensureDefaultWorkspace()
  const effectiveWorkspaceId = effectiveWorkspace?.id ?? workspaceId
  const presetWorkspaceSlug = effectiveWorkspace?.slug

  // 先统一计算规范化后的 ID，再用同一个 ID 构建稳定引用。
  // 不能把原始 presetId 传给 presetReferenceForId：旧会话/快捷入口未传
  // presetId 时，前者会回退为 standard，而后者会得到空引用，发送校验就会
  // 错误地报 AGENT_PRESET_REQUIRED。
  const normalizedPresetId = normalizeSessionPresetId(presetWorkspaceSlug, presetId)
  // 未显式指定或默认值已被清除时，自动选择当前工作区首个仍启用的预设。
  // 只有工作区确实没有任何可用预设时才保留空值，让 UI 展示配置提示。
  const effectivePresetId = normalizedPresetId || listAgentPresets(presetWorkspaceSlug)
    .find((preset) => preset.enabledInWorkspace !== false)?.id || ''
  const meta: AgentSessionMeta = {
    id: randomUUID(),
    title: title || '新 Agent 会话',
    channelId,
    modelId,
    workspaceId: effectiveWorkspaceId,
    agentRuntime: normalizeAgentRuntime(agentRuntime),
    ...(owner ? { owner: structuredClone(owner) } : {}),
    ...(effectivePresetId ? { presetId: effectivePresetId, presetReference: presetReferenceForId(presetWorkspaceSlug, effectivePresetId) } : {}),
    ...(draft ? { draft: true } : {}),
    createdAt: now,
    updatedAt: now,
  }

  if (owner?.kind === 'review-case') {
    // Must be durable before the index write; otherwise .bak fallback could
    // expose an already-created internal owner through ordinary IPC.
    persistReviewOwnerFences([meta.id])
  }
  index.sessions.push(meta)
  writeIndex(index)

  // 确保消息目录存在
  getAgentSessionsDir()

  // 创建 session 级别子文件夹并初始化 .claude / .context（独立会话归入 default 工作区沙箱）
  const targetWorkspaceSlug = presetWorkspaceSlug ?? 'default'
  const sessionDir = getAgentSessionWorkspacePath(targetWorkspaceSlug, meta.id)

  // 初始化 .claude/settings.json（plansDirectory → .context）
  const claudeDir = join(sessionDir, '.claude')
  if (!existsSync(claudeDir)) mkdirSync(claudeDir, { recursive: true })
  const settingsPath = join(claudeDir, 'settings.json')
  let sdkSettings: Record<string, unknown> = {}
  try {
    sdkSettings = JSON.parse(readFileSync(settingsPath, 'utf-8'))
  } catch { /* 文件不存在或解析失败 */ }
  let needsWrite = false
  if (sdkSettings.plansDirectory !== '.context') {
    sdkSettings.plansDirectory = '.context'
    needsWrite = true
  }
  if (sdkSettings.skipWebFetchPreflight !== true) {
    sdkSettings.skipWebFetchPreflight = true
    needsWrite = true
  }
  if (needsWrite) {
    writeFileSync(settingsPath, JSON.stringify(sdkSettings, null, 2))
  }

  // 初始化 .context/ 目录
  const contextDir = join(sessionDir, '.context')
  if (!existsSync(contextDir)) mkdirSync(contextDir, { recursive: true })

  console.log(`[Agent 会话] 已创建会话: ${meta.title} (${meta.id})`)
  return meta
}

/**
 * Trusted Main-only factory. Ownership is embedded in the same atomic index
 * write as creation, so no observable temporary ordinary session exists.
 * No ordinary desktop/Pocket create handler accepts the owner argument.
 */
export function createReviewOwnedAgentSession(input: {
  caseId: string
  title: string
  channelId: string
  modelId?: string
  workspaceId?: string
  presetId?: string
}): AgentSessionMeta {
  if (!input.caseId || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(input.caseId)
    || input.caseId.includes('..')) {
    throw new Error('审核会话必须绑定有效案卷 ID')
  }
  if (!input.channelId?.trim()) throw new Error('审核会话必须明确指定渠道')
  return createAgentSession(input.title, input.channelId, input.workspaceId, input.modelId, 'pi', false,
    input.presetId ?? 'review-operator', { kind: 'review-case', caseId: input.caseId })
}

/** Fail closed for ordinary external/session UI entry points. */
export function assertOrdinaryAgentSession(sessionId: string): void {
  if (isReviewOwnedOrDeletedAgentSessionId(sessionId)) {
    throw new Error('内部审核会话不可通过普通 Agent 入口访问')
  }
}

/** 同一项目只保留一个未归档的隐藏草稿会话。函数没有异步间隙，可防止快速重复点击。 */
export function ensureProjectDraftAgentSession(
  workspaceId: string,
  channelId?: string,
  modelId?: string,
  agentRuntime: AgentRuntime = 'pi',
): AgentSessionMeta {
  const existing = listAgentSessions(true).find((session) =>
    session.workspaceId === workspaceId && session.draft && !session.archived,
  )
  if (!existing) {
    return createAgentSession(undefined, channelId, workspaceId, modelId, agentRuntime, true)
  }

  // SDK 的用户输入以 type: 'user' 持久化；Agent 错误为 assistant/system 消息，不能据此晋升草稿。
  if (getAgentSessionSDKMessages(existing.id).some((message) => message.type === 'user')) {
    return updateAgentSessionMeta(existing.id, { draft: false })
  }

  return existing
}

/**
 * 读取会话的所有消息
 */
export function getAgentSessionMessages(id: string): AgentMessage[] {
  const filePath = getAgentSessionMessagesPath(id)

  if (!existsSync(filePath)) {
    return []
  }

  try {
    const raw = readFileSync(filePath, 'utf-8')
    const lines = raw.split('\n').filter((line) => line.trim())
    const parsedMessages: AgentMessage[] = []
    for (const line of lines) {
      try {
        parsedMessages.push(JSON.parse(line) as AgentMessage)
      } catch {
        // 单行损坏不丢整文件：跳过坏行继续解析后续
        console.warn(`[Agent 会话] 跳过损坏的消息行 (${id})`)
      }
    }
    // 瞬时断流错误卡只在「之后已恢复」时才丢弃；会话尾部的失败必须保留可见。
    return parsedMessages.filter((message, index) => {
      const assistantError = getPersistedAssistantError(message)
      if (!assistantError) return true
      const recoveredLater = parsedMessages.slice(index + 1).some((later) => {
        if (later.role !== 'assistant') return false
        return getPersistedAssistantError(later) === null
      })
      return !isRecoveredEphemeralTransportError(
        recoveredLater,
        assistantError.errorCode,
        assistantError.errorText,
      )
    })
  } catch (error) {
    console.error(`[Agent 会话] 读取消息文件失败 (${id}):`, error)
    return []
  }
}

/**
 * 追加一条消息到会话的 JSONL 文件
 */
export function appendAgentMessage(id: string, message: AgentMessage): void {
  const filePath = getAgentSessionMessagesPath(id)

  try {
    const line = JSON.stringify(message) + '\n'
    appendFileSync(filePath, line, 'utf-8')

    // 追加消息时更新 updatedAt，若已归档则自动恢复活跃
    const index = readIndex()
    const idx = index.sessions.findIndex((s) => s.id === id)
    if (idx !== -1) {
      const session = index.sessions[idx]!
      session.updatedAt = Date.now()
      if (session.archived) session.archived = false
      writeIndex(index)
    }
  } catch (error) {
    console.error(`[Agent 会话] 追加消息失败 (${id}):`, error)
    throw new Error('追加 Agent 消息失败')
  }
}

/** 单条 SDKMessage 序列化后最大长度（UTF-16 code units，超出则截断内容） */
/** 落盘规则：单条消息序列化后的字符上限。写入路径与存量迁移共用此常量。 */
export const MAX_SDK_MESSAGE_LENGTH = 256 * 1024 // ~256K chars
/** 截断后保留的预览文本长度 */
const TRUNCATED_PREVIEW_LENGTH = 2000

/**
 * 按落盘规则收敛一条**已序列化**的会话行；未超限则原样返回。
 *
 * 写入路径（`appendSDKMessages` / `serializeSDKMessageForStorage`）与存量迁移
 * （`oversized-session-migration`）共用这一个入口。此前同一套规则散在两处内联，
 * 正是「各自漏一处」的温床——补 4 个覆盖缺口时已吃过一次这个亏。
 */
export function sanitizeSerializedSessionLine(line: string, sessionId?: string): string {
  if (line.length <= MAX_SDK_MESSAGE_LENGTH) return line

  let message: SDKMessage
  try {
    message = JSON.parse(line) as SDKMessage
  } catch {
    // 损坏行不在这里处理（迁移侧会记为 skipped）；原样返回，避免二次破坏
    return line
  }

  const sanitized = JSON.stringify(sanitizeOversizedMessage(message, line.length))
  if (sanitized.length > MAX_SDK_MESSAGE_LENGTH) {
    console.warn(
      `[Agent 会话] 消息截断后仍超限 (${(sanitized.length / 1024).toFixed(0)}K chars)${sessionId ? `, session=${sessionId}` : ''}`,
    )
  }
  return sanitized
}

// ===== 大载荷外部化（把载荷搬出 JSONL 行，而不是删掉） =====

/**
 * 消息级引用表字段名。放在消息顶层，不影响任何已有字段。
 * 为什么不把字段本身换成对象：那会把类型从 string 变成联合类型，
 * 老版本读到新数据会渲染成 `[object Object]` 甚至崩；
 * 保持 string（值为片段）则老代码只是显示得短一点——降级而非崩坏。
 */
const BLOB_REFS_FIELD = SESSION_BLOB_REFS_FIELD
/** 还原失败时记录缺失引用，供上层提示「原文不可用」 */
const BLOB_REFS_MISSING_FIELD = SESSION_BLOB_MISSING_FIELD

/** 第一级：行内保留的片段长度（与截断预览同长） */
const INLINE_PREVIEW_CHARS = TRUNCATED_PREVIEW_LENGTH
/**
 * 第一级可抽取下限。短于片段长度的字符串抽了等于没抽（片段就是全文），因此第一级不碰。
 * 同时也是第一级「抽不动了」的终止条件：候选已按长度降序，遇到不达下限的就必然全部不达标。
 */
const FIRST_TIER_MIN_CHARS = INLINE_PREVIEW_CHARS
/**
 * 第二级片段长度：第一级抽完仍超限时，把中等字符串也抽走，只留更短的片段。
 *
 * 存在一个真实形态会让第一级无解：**一个工具返回大量（约 150~200 条以上）结构化记录，
 * 每条带一个约 1500 字符的字段**，而整条消息里没有任何字符串超过 2000。
 * 真机的委派列表工具已出现过 25 条记录的实例（每条 resultSummary 3K~12K），
 * 规模再大一个数量级即命中——见工作包 design.md 第 11 节。
 *
 * 抽走之后原文仍在 blob，不丢数据；代价只是片段更短，折叠态可读性下降。
 */
const SHORT_PREVIEW_CHARS = 200
const SECOND_TIER_MIN_CHARS = 512
/** 遍历深度上限，防止异常结构导致栈过深 */
const MAX_BLOB_WALK_DEPTH = 12

interface StoredBlobRef {
  /** 相对消息根的对象路径，如 `tool_use_result.content.0.text` */
  path: string
  hash: string
  chars: number
  bytes: number
}

interface ExtractableString {
  path: string
  length: number
}

/** 路径 tokenizer：`a.b[0].c` → ['a','b',0,'c'] */
function tokenizeBlobPath(path: string): (string | number)[] {
  const tokens: (string | number)[] = []
  const pattern = /([^.[\]]+)|\[(\d+)\]/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(path)) !== null) {
    tokens.push(match[2] !== undefined ? Number(match[2]) : match[1]!)
  }
  return tokens
}

function getStringAtPath(root: unknown, path: string): string | undefined {
  let node: unknown = root
  for (const token of tokenizeBlobPath(path)) {
    if (typeof token === 'number') {
      if (!Array.isArray(node)) return undefined
      node = node[token]
    } else {
      if (!isPlainRecord(node)) return undefined
      node = node[token]
    }
  }
  return typeof node === 'string' ? node : undefined
}

function setStringAtPath(root: unknown, path: string, value: string): boolean {
  const tokens = tokenizeBlobPath(path)
  if (tokens.length === 0) return false
  let node: unknown = root
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i]!
    if (typeof token === 'number') {
      if (!Array.isArray(node)) return false
      node = node[token]
    } else {
      if (!isPlainRecord(node)) return false
      node = node[token]
    }
  }
  const last = tokens[tokens.length - 1]!
  if (typeof last === 'number') {
    if (!Array.isArray(node)) return false
    node[last] = value
    return true
  }
  if (!isPlainRecord(node)) return false
  node[last] = value
  return true
}

/**
 * 递归收集超过 `minChars` 的字符串及其路径（不进入引用表自身，跳过已抽过的路径）。
 * 已抽过的路径必须跳过：第一级留下的片段（2000 字）仍 ≥ 第二级下限，
 * 不跳就会被第二级再抽一遍，把片段也搬走。
 */
function collectExtractableStrings(
  value: unknown,
  path: string,
  out: ExtractableString[],
  minChars: number,
  skipPaths: Set<string>,
  depth = 0,
): void {
  if (depth > MAX_BLOB_WALK_DEPTH) return

  if (typeof value === 'string') {
    if (value.length > minChars && !skipPaths.has(path)) out.push({ path, length: value.length })
    return
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      collectExtractableStrings(value[i], `${path}[${i}]`, out, minChars, skipPaths, depth + 1)
    }
    return
  }
  if (!isPlainRecord(value)) return

  for (const [key, child] of Object.entries(value)) {
    if (key === BLOB_REFS_FIELD || key === BLOB_REFS_MISSING_FIELD) continue
    collectExtractableStrings(child, path ? `${path}.${key}` : key, out, minChars, skipPaths, depth + 1)
  }
}

/**
 * 把消息连同引用表一起序列化。
 *
 * 判定预算时【必须】带上引用表：否则循环会在「消息刚好落回上限」时停下，
 * 而附加上引用表后又挠出去几十条引用的大小，最终校验失败导致整个外部化被丢弃。
 */
function serializeMessageWithRefs(message: Record<string, unknown>, refs: StoredBlobRef[]): string {
  return refs.length === 0 ? JSON.stringify(message) : JSON.stringify({ ...message, [BLOB_REFS_FIELD]: refs })
}

/**
 * 按给定片段长度与下限，从最大的字符串开始抽，直到（含引用表）落回行预算内。
 * 返回是否达标，以及达标时可直接落盘的序列化结果。
 */
function extractUntilUnderBudget(
  message: Record<string, unknown>,
  refs: StoredBlobRef[],
  extractedPaths: Set<string>,
  fragmentChars: number,
  minChars: number,
): { converged: boolean; serialized: string } {
  let serialized = serializeMessageWithRefs(message, refs)
  if (serialized.length <= MAX_SDK_MESSAGE_LENGTH) return { converged: true, serialized }

  const candidates: ExtractableString[] = []
  collectExtractableStrings(message, '', candidates, minChars, extractedPaths)
  if (candidates.length === 0) return { converged: false, serialized }
  candidates.sort((a, b) => b.length - a.length)

  for (const candidate of candidates) {
    if (serialized.length <= MAX_SDK_MESSAGE_LENGTH) return { converged: true, serialized }

    const value = getStringAtPath(message, candidate.path)
    if (typeof value !== 'string' || value.length <= minChars) break

    const { hash, bytes } = writeBlobSync(value)
    if (!setStringAtPath(message, candidate.path, value.slice(0, fragmentChars))) break
    extractedPaths.add(candidate.path)
    refs.push({ path: candidate.path, hash, chars: value.length, bytes })
    serialized = serializeMessageWithRefs(message, refs)
  }

  return { converged: serialized.length <= MAX_SDK_MESSAGE_LENGTH, serialized }
}

/**
 * 把超限行里的超大字符串搬到 blob，行内只留片段 + 引用。
 *
 * 规则（用户 2026-09-17 确认）：
 * 1. 行未超限 → 原样返回，**一个字节都不动**
 * 2. 超了 → 从最大字符串开始抽，原位留前 2000 字片段，再量一次，还超就继续抽
 * 3. 抽不动了（候选已不足片段长度）或 blob 写失败 → 退回截断兜底
 *
 * 为什么「从最大开始抽」：抽一个 12 MB 的字符串就解决问题，不需要动其他字段，干预面最小。
 */
export function externalizeSerializedSessionLine(line: string, sessionId?: string): string {
  if (line.length <= MAX_SDK_MESSAGE_LENGTH) return line

  let message: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(line)
    if (!isPlainRecord(parsed)) return sanitizeSerializedSessionLine(line, sessionId)
    message = parsed
  } catch {
    return sanitizeSerializedSessionLine(line, sessionId)
  }

  const refs: StoredBlobRef[] = []
  const extractedPaths = new Set<string>()
  try {
    // 第一级：只抽明显的大字符串（≥ 2000），片段长度也是 2000
    let { converged, serialized } = extractUntilUnderBudget(
      message, refs, extractedPaths, INLINE_PREVIEW_CHARS, FIRST_TIER_MIN_CHARS,
    )

    // 第二级：第一级无解时（典型形态：一条消息里全是中等字符串，无一超过 2000）
    // 把中等字符串也抽走，只留更短的片段——原文仍在 blob，不丢数据
    if (!converged) {
      ;({ converged, serialized } = extractUntilUnderBudget(
        message, refs, extractedPaths, SHORT_PREVIEW_CHARS, SECOND_TIER_MIN_CHARS,
      ))
    }

    // 达标且确实搬走了东西 → 直接用（serialized 已含引用表，无需再拼一次）
    if (converged && refs.length > 0) return serialized

    // 两级都抽不动（没有超过 512 的字符串）或抽完仍超限 → 交给截断兜底
    return sanitizeSerializedSessionLine(line, sessionId)
  } catch (error) {
    // blob 写失败不能让写入失败：退回截断，保住行上限
    console.warn(`[Agent 会话] 载荷外部化失败，退回截断${sessionId ? ` session=${sessionId}` : ''}:`, error)
    return sanitizeSerializedSessionLine(line, sessionId)
  }
}

/**
 * 从一条**已序列化**的会话行里读出引用表。
 * 供存量迁移统计「本次搬了多少载荷」使用；解析失败返回空数组（不抛异常）。
 * 复用 shared 的 readSessionBlobRefs，避免同一形状在两处各自实现。
 */
export function readSerializedBlobRefs(line: string): StoredBlobRef[] {
  try {
    return readSessionBlobRefs(JSON.parse(line)) as StoredBlobRef[]
  } catch {
    return []
  }
}

/**
 * 把一条消息里的引用一次性还原为原文，返回原始形状。
 *
 * 这是对外**唯一**的还原入口：消费方不需要知道路径与哈希的存在。
 * blob 缺失或哈希不匹配时保留片段并记入 `_proferBlobsMissing`，绝不抛异常
 * ——任何「读历史数据可能崩」的设计都不该上线。
 */
export async function resolveMessageBlobs(message: SDKMessage): Promise<SDKMessage> {
  const rawRefs = (message as unknown as Record<string, unknown>)[BLOB_REFS_FIELD]
  if (!Array.isArray(rawRefs) || rawRefs.length === 0) return message

  const clone = JSON.parse(JSON.stringify(message)) as Record<string, unknown>
  const refs = clone[BLOB_REFS_FIELD] as StoredBlobRef[]
  delete clone[BLOB_REFS_FIELD]

  const missing: string[] = []
  for (const ref of refs) {
    const content = await readBlob(ref.hash)
    if (content === null) {
      missing.push(ref.path)
      continue
    }
    if (!setStringAtPath(clone, ref.path, content)) missing.push(ref.path)
  }

  if (missing.length > 0) clone[BLOB_REFS_MISSING_FIELD] = missing
  return clone as unknown as SDKMessage
}

import { readBlob, writeBlobSync } from './blob-store'
import { invalidateConversationIndex } from './context-rag/conversation-index'

/**
 *
 * 每条 SDKMessage 单独一行 JSON。读取时通过 `type` 字段区分新旧格式。
 * 超过 256K chars 的消息会被自动截断以防止存储膨胀。
 */
export function appendSDKMessages(id: string, messages: SDKMessage[]): void {
  // 注意：这里不再丢弃「瞬时断流」错误卡。丢弃必须在读取时结合「之后是否已恢复」判断
  // （见 dropRecoveredEphemeralTransportErrors）——写入时就丢掉，会让一次最终失败的
  // 网络错误在历史里彻底消失，用户看到的是「Agent Running 一闪就什么都没有了」。
  const persistentMessages = messages
  if (persistentMessages.length === 0) return

  const filePath = getAgentSessionMessagesPath(id)

  try {
    const lines = persistentMessages
      .map((m) => externalizeSerializedSessionLine(JSON.stringify(m), id))
      .join('\n') + '\n'
    appendFileSync(filePath, lines, 'utf-8')
  } catch (error) {
    console.error(`[Agent 会话] 追加 SDKMessage 失败 (${id}):`, error)
    throw new Error('追加 SDKMessage 失败')
  }
}

/** 递归收敛 tool_use_result 时的最大深度，防止异常结构导致栈过深 */
const MAX_TOOL_RESULT_SANITIZE_DEPTH = 8

/**
 * 逐级收紧时的字符串阈值下限。
 * 低于它就不再继续收紧，避免把正常长度的内容也切碎。
 */
const MIN_SANITIZE_STRING_THRESHOLD = 4000

/** 逐级收紧的最大轮数（128K → 32K → 8K → 4K） */
const MAX_SANITIZE_ATTEMPTS = 4

/** 仅普通对象（排除数组与 null），供结构化载荷遍历使用 */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 递归收敛结构化的工具结果载荷。
 *
 * Pi runtime 会把 tool_result 的完整 details 作为顶层 `tool_use_result` 落盘
 * （见 pi-message-adapter.ts），它与 message.content 等量，实测单条最大约 12 MB
 * （整页 HTML、PDF 的 base64、内嵌图片）。这里用与 message.content 同一套规则处理：
 * 超过阈值的字符串截断为预览 + 说明。
 *
 * 渲染侧只有 parseAgentImageAttachmentDetails 会读它，而该函数提取的是
 * localPath / filename / mediaType 这类路径型标记，不依赖超长字符串，因此截断安全。
 */
function sanitizeToolResultPayload(
  payload: unknown,
  truncationThreshold: number,
  truncationNote: string,
  depth = 0,
): unknown {
  if (depth > MAX_TOOL_RESULT_SANITIZE_DEPTH) return payload
  if (typeof payload === 'string') {
    return payload.length > truncationThreshold
      ? payload.slice(0, TRUNCATED_PREVIEW_LENGTH) + truncationNote
      : payload
  }
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeToolResultPayload(item, truncationThreshold, truncationNote, depth + 1))
  }
  if (!isPlainRecord(payload)) return payload

  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(payload)) {
    sanitized[key] = sanitizeToolResultPayload(value, truncationThreshold, truncationNote, depth + 1)
  }
  return sanitized
}

/**
 * 按给定字符串阈值就地收敛一份消息副本（调用方保证 clone 是可安全修改的深拷贝）。
 * 处理四类膨胀源：超长 text block、超大 tool_result、内嵌 base64 图片、
 * 以及顶层 tool_use_result 副本（message.content 的等量拷贝）。
 */
function applyOversizedSanitization(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone: any,
  truncationNote: string,
  truncationThreshold: number,
): SDKMessage {
  // 顶层 tool_use_result 是 tool_result 正文的完整副本，必须与 message.content 同规则处理，
  // 否则即使正文被截断，整行依然超限（实测 161/250 条巨型行涉此，72 条仅副本就超限）。
  if (clone.tool_use_result !== undefined) {
    clone.tool_use_result = sanitizeToolResultPayload(clone.tool_use_result, truncationThreshold, truncationNote)
  }
  if (clone.toolUseResult !== undefined) {
    clone.toolUseResult = sanitizeToolResultPayload(clone.toolUseResult, truncationThreshold, truncationNote)
  }

  const content = clone.message?.content
  if (Array.isArray(content)) {
    for (let i = 0; i < content.length; i++) {
      const block = content[i]
      if (!block || typeof block !== 'object') continue

      // 截断超长 text block
      if (block.type === 'text' && typeof block.text === 'string' && block.text.length > truncationThreshold) {
        block.text = block.text.slice(0, TRUNCATED_PREVIEW_LENGTH) + truncationNote
      }

      // 截断超大 tool_result
      if (block.type === 'tool_result') {
        if (typeof block.content === 'string' && block.content.length > truncationThreshold) {
          block.content = block.content.slice(0, TRUNCATED_PREVIEW_LENGTH) + truncationNote
        }
        if (Array.isArray(block.content)) {
          block.content = block.content.map((item: Record<string, unknown>) => {
            // 剥离 base64 图片数据。两种结构并存：Anthropic 风格 { source: { data } }
            // 与 Pi 风格 { data } —— 后者此前漏处理，实测约 95 MB 未收敛。
            if (item?.type === 'image') {
              const source = item.source as Record<string, unknown> | undefined
              const data = typeof item.data === 'string'
                ? item.data
                : typeof source?.data === 'string'
                  ? String(source.data)
                  : undefined
              if (data) {
                return { type: 'image', _truncated: true, _originalLength: data.length }
              }
            }
            // 嵌套在数组里的 text block 此前不受限，同样按阈值截断
            if (item?.type === 'text' && typeof item.text === 'string' && item.text.length > truncationThreshold) {
              return { ...item, text: item.text.slice(0, TRUNCATED_PREVIEW_LENGTH) + truncationNote }
            }
            return item
          })
        }
      }
    }
  }

  // 截断 error.message
  if (clone.error && typeof clone.error === 'object' && typeof clone.error.message === 'string' && clone.error.message.length > truncationThreshold) {
    clone.error.message = clone.error.message.slice(0, TRUNCATED_PREVIEW_LENGTH) + truncationNote
  }

  return clone as SDKMessage
}

/**
 * 截断超大 SDKMessage 的内容，保留元数据结构。
 *
 * 字符串的“原文长度”与“序列化长度”可能严重不等：含大量控制字符的内容会被 JSON
 * 转义为 \\uXXXX（最多膨胀 6 倍，实测 49K 原文 → 279K JSON）。所以这里不以原文长度
 * 一次定稿，而是按**实际序列化结果**逐级收紧阈值，直到落入上限或到达下限。
 */
function sanitizeOversizedMessage(msg: SDKMessage, originalLength: number): SDKMessage {
  const truncationNote = `\n[内容已截断: 原始 ${(originalLength / 1024).toFixed(0)}K chars 超出存储限制]`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const original: any = JSON.parse(JSON.stringify(msg))
  let threshold = MAX_SDK_MESSAGE_LENGTH / 2
  let result = applyOversizedSanitization(JSON.parse(JSON.stringify(original)), truncationNote, threshold)

  for (let attempt = 1; attempt < MAX_SANITIZE_ATTEMPTS; attempt++) {
    if (JSON.stringify(result).length <= MAX_SDK_MESSAGE_LENGTH) return result
    if (threshold <= MIN_SANITIZE_STRING_THRESHOLD) return result
    threshold = Math.max(MIN_SANITIZE_STRING_THRESHOLD, Math.floor(threshold / 4))
    result = applyOversizedSanitization(JSON.parse(JSON.stringify(original)), truncationNote, threshold)
  }

  return result
}

/** 桌面端 Agent 会话懒加载单页消息数（首次只取尾部，触顶/按钮加载更早） */
export const DESKTOP_AGENT_PAGE_SIZE = 60

/** 解析单行 SDKMessage（兼容旧 AgentMessage 格式）；损坏行返回 null 不中断 */
function parseSDKMessageLine(line: string, id: string): SDKMessage | null {
  try {
    const parsed = JSON.parse(line)
    // 旧格式检测：AgentMessage 有 `role` 字段，SDKMessage 有 `type` 字段
    if ('role' in parsed && !('type' in parsed)) {
      return convertLegacyMessage(parsed as AgentMessage)
    }
    return parsed as SDKMessage
  } catch {
    // 单行损坏不丢整文件：跳过坏行继续解析后续
    console.warn(`[Agent 会话] 跳过损坏的 SDKMessage 行 (${id})`)
    return null
  }
}

/** 该消息是否代表「本轮已恢复/继续产出」——用于判定瞬时断流是否真的已被恢复 */
function isRecoverySignal(message: SDKMessage): boolean {
  if (message.type === 'assistant') return getPersistedAssistantError(message) === null
  return message.type === 'result'
}

/**
 * 丢弃「已恢复」的瞬时断流错误卡。
 *
 * 会话尾部仍处于失败状态的错误卡必须保留：否则失败在界面上没有任何可见痕迹
 * （表现为「Agent Running 一闪就什么都没有了」）。只有该错误之后确实还有正常产出
 * （干净 assistant 消息 / result）时，才按原设计把它从历史里去掉。
 */
function dropRecoveredEphemeralTransportErrors(messages: SDKMessage[]): SDKMessage[] {
  if (messages.length === 0) return messages
  let dropped = false
  const kept: SDKMessage[] = []
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]!
    const assistantError = message.type === 'assistant' ? getPersistedAssistantError(message) : null
    if (
      assistantError &&
      isRecoveredEphemeralTransportError(
        messages.slice(i + 1).some((later) => isRecoverySignal(later)),
        assistantError.errorCode,
        assistantError.errorText,
      )
    ) {
      dropped = true
      continue
    }
    kept.push(message)
  }
  return dropped ? kept : messages
}

/**
 * 读取会话的 SDKMessage（兼容旧 AgentMessage 格式）
 *
 * 旧格式（有 `role` 字段）会被转换为近似的 SDKMessage。
 * 新格式（有 `type` 字段）直接返回。
 *
 * 分页模式（传 opts.tail）：只解析尾部窗口内的行，避免全量 JSON.parse 的内存分配
 * 风暴（切大会话时主进程 GC 卡顿的根因之一），返回 SDKMessagePage；
 * 无 opts 时保持旧行为返回全量数组（重试/分叉/回退等需要完整历史的调用方）。
 */
export function getAgentSessionSDKMessages(id: string): SDKMessage[]
export function getAgentSessionSDKMessages(id: string, opts: { tail?: number; before?: number }): SDKMessagePage
export function getAgentSessionSDKMessages(
  id: string,
  opts?: { tail?: number; before?: number },
): SDKMessage[] | SDKMessagePage {
  const filePath = getAgentSessionMessagesPath(id)
  const emptyPage: SDKMessagePage = { messages: [], total: 0, startIndex: 0, endIndex: -1, hasMore: false }

  if (!existsSync(filePath)) {
    return opts ? emptyPage : []
  }

  try {
    const raw = readFileSync(filePath, 'utf-8')
    const lines = raw.split('\n').filter((line) => line.trim())

    // 分页模式：只解析窗口内的行
    if (opts && (opts.tail !== undefined || opts.before !== undefined)) {
      const total = lines.length
      const pageSize = opts.tail ?? DESKTOP_AGENT_PAGE_SIZE
      const before = opts.before !== undefined ? Math.max(0, Math.min(opts.before, total)) : total
      const startLine = Math.max(0, before - pageSize)
      const messages: SDKMessage[] = []
      for (let i = startLine; i < before; i++) {
        const parsed = parseSDKMessageLine(lines[i]!, id)
        if (parsed) messages.push(parsed)
      }
      return {
        messages: dropRecoveredEphemeralTransportErrors(messages),
        total,
        startIndex: startLine,
        endIndex: before - 1,
        hasMore: startLine > 0,
      }
    }

    // 全量模式（旧行为）
    const messages: SDKMessage[] = []
    for (const line of lines) {
      const parsed = parseSDKMessageLine(line, id)
      if (parsed) messages.push(parsed)
    }
    return dropRecoveredEphemeralTransportErrors(messages)
  } catch (error) {
    console.error(`[Agent 会话] 读取 SDKMessage 文件失败 (${id}):`, error)
    return opts ? emptyPage : []
  }
}

/**
 * 将旧的 AgentMessage 转换为近似的 SDKMessage（向后兼容）
 *
 * 不需要完美还原，只需在 UI 中可读即可。
 */
function convertLegacyMessage(legacy: AgentMessage): SDKMessage {
  if (legacy.role === 'user') {
    return {
      type: 'user',
      message: {
        content: [{ type: 'text', text: legacy.content }],
      },
      parent_tool_use_id: null,
      // 附加元数据供渲染器使用
      _legacy: true,
      _createdAt: legacy.createdAt,
    } as unknown as SDKMessage
  }

  if (legacy.role === 'assistant') {
    return {
      type: 'assistant',
      message: {
        content: [{ type: 'text', text: legacy.content }],
        model: legacy.model,
      },
      parent_tool_use_id: null,
      _legacy: true,
      _createdAt: legacy.createdAt,
    } as unknown as SDKMessage
  }

  if (legacy.role === 'status') {
    // 错误消息转换为 assistant error 格式
    return {
      type: 'assistant',
      message: {
        content: [{ type: 'text', text: legacy.content }],
      },
      parent_tool_use_id: null,
      error: { message: legacy.content, errorType: legacy.errorCode },
      _legacy: true,
      _createdAt: legacy.createdAt,
      _errorCode: legacy.errorCode,
      _errorTitle: legacy.errorTitle,
      _errorDetails: legacy.errorDetails,
      _errorCanRetry: legacy.errorCanRetry,
      _errorActions: legacy.errorActions,
    } as unknown as SDKMessage
  }

  // 其他类型，作为 system 消息返回
  return {
    type: 'system',
    subtype: 'init',
    _legacy: true,
    _createdAt: legacy.createdAt,
  } as unknown as SDKMessage
}

/**
 * 更新会话元数据
 */
export function updateAgentSessionMeta(
  id: string,
  updates: Partial<Pick<AgentSessionMeta, 'title' | 'titleAutoGeneratedAt' | 'titleRefineAttempts' | 'titleLockedAt' | 'channelId' | 'modelId' | 'sdkSessionId' | 'piSessionFile' | 'piEntryBindings' | 'piFileCheckpoints' | 'agentRuntime' | 'codexFastMode' | 'openAIThinkingLevel' | 'agentEffort' | 'studyTeachingMode' | 'workspaceId' | 'pinned' | 'archived' | 'draft' | 'attachedDirectories' | 'attachedFiles' | 'forkSourceDir' | 'explorationParentSessionId' | 'explorationSourceMessageId' | 'explorationSourceLabel' | 'explorationTitleInitializedAt' | 'forkSourceSdkSessionId' | 'resumeAtMessageUuid' | 'stoppedByUser' | 'autoQueueSendEnabled' | 'permissionMode' | 'completedButUnconfirmed' | 'sourceAutomationId' | 'automationGraduated' | 'parentSessionId' | 'rootSessionId' | 'sourceDelegationId' | 'delegationRole' | 'delegationStatus' | 'delegationDepth' | 'delegationGoal' | 'lastAnalyzedTurn' | 'presetId' | 'pptCapabilityActive' | 'activatedToolGroups' | 'lastInterruptReason' | 'lastInterruptLabel' | 'lastInterruptAt' | 'presetReference' | 'lastContextMode' | 'cslabLabId'>>,
): AgentSessionMeta {
  const index = readIndex()
  const idx = index.sessions.findIndex((s) => s.id === id)

  if (idx === -1) {
    throw new Error(`Agent 会话不存在: ${id}`)
  }

  const existing = index.sessions[idx]!
  if (Object.prototype.hasOwnProperty.call(updates, 'owner')) {
    throw new Error('业务会话 owner 不可通过普通元数据更新修改')
  }
  // 新引用是唯一跨作用域解析依据；旧调用传裸 presetId 时按会话工作区补齐兼容引用。
  if (updates.presetId !== undefined && updates.presetReference === undefined) {
    const workspaceSlug = existing.workspaceId ? getAgentWorkspace(existing.workspaceId)?.slug : undefined
    updates = { ...updates, presetReference: presetReferenceForId(workspaceSlug, updates.presetId) }
  }
  // 非手动归档操作时，若会话已归档则自动恢复为活跃（仅更新 stoppedByUser 不触发解归档）
  const isStoppedByUserOnly = Object.keys(updates).every((k) => k === 'stoppedByUser')
  const autoUnarchive = existing.archived && !('archived' in updates) && !isStoppedByUserOnly
  const previousRuntime = normalizeAgentRuntime(existing.agentRuntime)
  const nextRuntime = updates.agentRuntime === undefined
    ? previousRuntime
    : normalizeAgentRuntime(updates.agentRuntime)
  const runtimeChanged = updates.agentRuntime !== undefined && nextRuntime !== previousRuntime
  const stalePiCheckpoints = runtimeChanged ? Object.values(existing.piFileCheckpoints ?? {}) : []
  const updated: AgentSessionMeta = {
    ...existing,
    ...updates,
    revision: (existing.revision ?? 0) + 1,
    agentRuntime: nextRuntime,
    // Claude 与 Pi 的会话、fork 与 rewind 元数据均不可互用；运行时发生实际切换时由存储层统一失效。
    ...(runtimeChanged
      ? {
          sdkSessionId: undefined,
          piSessionFile: undefined,
          piEntryBindings: undefined,
          piFileCheckpoints: undefined,
          forkSourceSdkSessionId: undefined,
          forkSourceDir: undefined,
          resumeAtMessageUuid: undefined,
        }
      : {}),
    ...(autoUnarchive ? { archived: false } : {}),
    updatedAt: Date.now(),
  }

  index.sessions[idx] = updated
  writeIndex(index)

  if (stalePiCheckpoints.length > 0) {
    try {
      const keepPaths = collectForeignCheckpointPaths(id)
      prunePiFileCheckpoints(getPiCheckpointsDir(), id, { keepPaths })
    } catch (error) {
      console.warn(`[Agent 会话] 切换运行时后回收 Pi 文件检查点失败 (${id}):`, error)
    }
  }

  console.log(`[Agent 会话] 已更新会话: ${updated.title} (${updated.id})`)
  return updated
}

/**
 * 删除会话
 */
export function deleteAgentSession(id: string, options?: { backgroundDiskCleanup?: boolean }): void {
  // 会话删除后立即释放会话历史 RAG 的内存索引，避免陈旧 chunk 占用与误命中。
  invalidateConversationIndex(id)
  const index = readIndex()
  const idx = index.sessions.findIndex((s) => s.id === id)

  if (idx === -1) {
    console.warn(`[Agent 会话] 会话不存在，跳过删除: ${id}`)
    return
  }

  const removed = index.sessions.splice(idx, 1)[0]!

  // 历史版本的 fork 可能仍直接引用源会话的 checkpoint。先迁移这些精确引用，
  // 迁移失败则摘除 mapping；索引落盘前绝不删除源 cwd，旧版 cwd 内 checkpoint 才有机会被搬走。
  const sourceCheckpointRoot = join(getPiCheckpointsDir(), id)
  const legacySourceCheckpointRoot = removed.workspaceId
    ? getAgentWorkspace(removed.workspaceId)
      ? join(getAgentSessionWorkspacePath(getAgentWorkspace(removed.workspaceId)!.slug, id), '.cdutai-pi-checkpoints')
      : undefined
    : undefined
  const isSourceCheckpoint = (checkpointPath: string): boolean =>
    Object.values(removed.piFileCheckpoints ?? {}).includes(checkpointPath)
    || isPathWithin(sourceCheckpointRoot, checkpointPath)
    || (legacySourceCheckpointRoot ? isPathWithin(legacySourceCheckpointRoot, checkpointPath) : false)

  try {
    const bySession = new Map<string, Array<{ entryId: string; checkpointPath: string }>>()
    for (const session of index.sessions) {
      for (const [entryId, checkpointPath] of Object.entries(session.piFileCheckpoints ?? {})) {
        if (!isSourceCheckpoint(checkpointPath)) continue
        const entries = bySession.get(session.id) ?? []
        entries.push({ entryId, checkpointPath })
        bySession.set(session.id, entries)
      }
    }
    for (const [targetSessionId, entries] of bySession) {
      const adopted = adoptPiFileCheckpoints({
        rootDir: getPiCheckpointsDir(),
        targetSessionId,
        paths: entries.map((entry) => entry.checkpointPath),
      })
      const targetIndex = index.sessions.findIndex((session) => session.id === targetSessionId)
      if (targetIndex < 0) continue
      const target = index.sessions[targetIndex]!
      const checkpoints = { ...(target.piFileCheckpoints ?? {}) }
      for (const { entryId, checkpointPath } of entries) {
        const migrated = adopted.adopted[checkpointPath]
        if (migrated) checkpoints[entryId] = migrated
        else delete checkpoints[entryId]
      }
      index.sessions[targetIndex] = {
        ...target,
        ...(Object.keys(checkpoints).length > 0 ? { piFileCheckpoints: checkpoints } : { piFileCheckpoints: undefined }),
        updatedAt: Date.now(),
      }
    }
  } catch (error) {
    // 删除本身仍可继续，但绝不保留悬空映射：本次未能读取/迁移时摘掉所有已识别的源引用。
    console.warn(`[Agent 会话] 迁移源会话 Pi 文件检查点失败，将清除旧引用 (${id}):`, error)
    for (let sessionIndex = 0; sessionIndex < index.sessions.length; sessionIndex += 1) {
      const session = index.sessions[sessionIndex]!
      const checkpoints = Object.fromEntries(
        Object.entries(session.piFileCheckpoints ?? {}).filter(([, checkpointPath]) => !isSourceCheckpoint(checkpointPath)),
      )
      if (Object.keys(checkpoints).length === Object.keys(session.piFileCheckpoints ?? {}).length) continue
      index.sessions[sessionIndex] = {
        ...session,
        ...(Object.keys(checkpoints).length > 0 ? { piFileCheckpoints: checkpoints } : { piFileCheckpoints: undefined }),
        updatedAt: Date.now(),
      }
    }
  }
  // Commit the tombstone atomically with index deletion. A removed owner must never
  // look like an unknown ordinary ID to queued/replayed desktop or remote events.
  if (isReviewOwnedAgentSession(removed)) {
    index.reviewOwnerDeletionTombstones = [
      ...new Set([...(index.reviewOwnerDeletionTombstones ?? []), id]),
    ]
  }
  writeIndex(index)

  const doCleanup = (): void => {
    // 删除消息与任务图文件。任务图和会话消息均属于该 Profer session，删除必须清理。
    for (const [label, filePath] of [
      ['消息', getAgentSessionMessagesPath(id)],
      ['任务图', getGraphJsonlPath(getAgentSessionsDir(), id)],
      ['Pi Harness 账本', getPiHarnessEventsPath(id)],
    ] as const) {
      if (!existsSync(filePath)) continue
      try {
        unlinkSync(filePath)
      } catch (error) {
        console.warn(`[Agent 会话] 删除${label}文件失败 (${id}):`, error)
      }
    }

    // 清理 session 工作目录（支持指定工作区及独立会话 default 沙箱）
    const targetSlug = removed.workspaceId ? getAgentWorkspace(removed.workspaceId)?.slug : 'default'
    if (targetSlug) {
      try {
        const sessionDir = getAgentSessionWorkspacePath(targetSlug, id)
        if (existsSync(sessionDir)) {
          removeForkPath(sessionDir)
          console.log(`[Agent 会话] 已清理 session 工作目录: ${sessionDir}`)
        }
      } catch (error) {
        console.warn(`[Agent 会话] 清理 session 工作目录失败 (${id}):`, error)
      }
    }

    // 新版检查点位于配置目录，删除会话后必须显式清理；旧版 cwd 内快照已随工作区删除。
    try {
      removePiFileCheckpoints(getPiCheckpointsDir(), id)
    } catch (error) {
      console.warn(`[Agent 会话] 清理 Pi 文件检查点失败 (${id}):`, error)
    }

    // 清理速课堂专属学习资料与会话工件目录（若存在）
    try {
      const studyMaterialsDir = join(getStudyMaterialsRootDir(), id)
      if (existsSync(studyMaterialsDir)) {
        rmSync(studyMaterialsDir, { recursive: true, force: true })
      }
      const studySessionsDir = join(getStudySessionsRootDir(), id)
      if (existsSync(studySessionsDir)) {
        rmSync(studySessionsDir, { recursive: true, force: true })
      }
    } catch (error) {
      console.warn(`[Agent 会话] 清理速课堂专属目录失败 (${id}):`, error)
    }

    console.log(`[Agent 会话] 已删除会话: ${removed.title} (${removed.id})`)

    // 清理 SDK 关联数据（file-history 和 projects 下的 session JSONL）
    // ⚠️ 只清理本会话自己的 sdkSessionId，绝不能清理 forkSourceSdkSessionId：
    // 后者指向的是**源会话仍在使用**的 SDK session（fork 只是引用它做回退定位，
    // 并不拥有它的副本 — fork 自己的数据存在 forkResult.sessionId 即 sdkSessionId 下）。
    // 若一并删除，会在「删除某个 fork 会话」或「fork 中途失败触发回滚」时连带摧毁
    // 源会话的 SDK JSONL 和 file-history，使源会话变成无法 resume 的孤儿。
    // 源会话自身被删除时，它自己的 sdkSessionId 会走这里正常清理，不会泄漏。
    const sdkSessionIds = [removed.sdkSessionId].filter(Boolean) as string[]
    if (sdkSessionIds.length > 0) {
      const sdkConfigDir = getSdkConfigDir()

      const fileHistoryDir = join(sdkConfigDir, 'file-history')
      for (const sid of sdkSessionIds) {
        const histDir = join(fileHistoryDir, sid)
        if (existsSync(histDir)) {
          try {
            rmSync(histDir, { recursive: true, force: true })
            console.log(`[Agent 会话] 已清理 file-history: ${sid}`)
          } catch (e) {
            console.warn(`[Agent 会话] 清理 file-history 失败 (${sid}):`, e)
          }
        }
      }

      // Pi session 文件由 Pi SessionManager 写入独立目录；按 JSONL header 的精确 ID 删除，
      // 禁止按文件名片段匹配以避免误删另一会话。
      if (normalizeAgentRuntime(removed.agentRuntime) === 'pi') {
        for (const sid of sdkSessionIds) {
          const piSessionFile = findPiSessionJsonl(sid)
          if (!piSessionFile) continue
          try {
            unlinkSync(piSessionFile)
            console.log(`[Agent 会话] 已清理 Pi session 文件: ${piSessionFile}`)
          } catch (e) {
            console.warn('[Agent 会话] 清理 Pi session 文件失败:', e)
          }
        }
      }

      const projectsDir = join(sdkConfigDir, 'projects')
      if (existsSync(projectsDir)) {
        try {
          for (const hashDir of readdirSync(projectsDir)) {
            const projPath = join(projectsDir, hashDir)
            for (const sid of sdkSessionIds) {
              const sessionFile = join(projPath, `${sid}.jsonl`)
              if (existsSync(sessionFile)) {
                try {
                  unlinkSync(sessionFile)
                  console.log(`[Agent 会话] 已清理 SDK session 文件: ${sessionFile}`)
                } catch (e) {
                  console.warn('[Agent 会话] 清理 SDK session 文件失败:', e)
                }
              }
            }
            try {
              if (readdirSync(projPath).length === 0) rmSync(projPath, { recursive: true })
            } catch { /* ignore */ }
          }
        } catch { /* ignore */ }
      }
    }
  }

  if (options?.backgroundDiskCleanup) {
    setImmediate(() => {
      try {
        doCleanup()
      } catch (err) {
        console.warn(`[Agent 会话] 后台异步清理磁盘数据失败 (${id}):`, err)
      }
    })
  } else {
    doCleanup()
  }
}

/**
 * 删除指定工作区（项目）下的全部会话（索引条目 + 消息/任务图文件 + session 工作目录 + SDK 关联数据）。
 *
 * 供删除工作区时级联清理使用：正常流程由 ipc DELETE_WORKSPACE handler 先行处理
 * （含停止运行中 Agent、清理权限/提问状态等运行时资源），此函数作为 manager 层防御性兜底，
 * 防止其他调用路径删除工作区后残留孤儿会话 —— 孤儿会话会让移动端把 workspaceId
 * 归纳成“幽灵项目”显示（electronapi-stub 的 list_workspaces 回退路径）。
 *
 * @returns 删除的会话数量
 */
export function deleteAgentSessionsByWorkspace(workspaceId: string): number {
  const index = readIndex()
  const affected = index.sessions.filter((s) => s.workspaceId === workspaceId)
  if (affected.length === 0) return 0
  for (const session of affected) {
    deleteAgentSession(session.id)
  }
  console.log(`[Agent 会话] 已级联删除工作区 ${workspaceId} 的 ${affected.length} 个会话`)
  return affected.length
}

/**
 * 扫描所有会话，检测孤儿记录和文件系统不一致。
 *
 * 检测项：
 * - agent-sessions/<id>.jsonl 缺失 → UI 无法展示历史消息
 * - SDK JSONL 缺失 → 无法 resume，每次打开都触发 session-not-found 恢复
 * - 工作区目录缺失 → Agent 无 cwd，首次运行会重建但丢失上下文文件
 *
 * @returns 所有会话的健康状态列表，按严重程度排序（孤儿在前）
 */
export function findOrphanSessions(): SessionHealth[] {
  const index = readIndex()
  const results: SessionHealth[] = []

  for (const session of index.sessions) {
    // Desktop health dialog is an ordinary Agent surface, not an internal case inventory.
    if (isReviewOwnedAgentSession(session)) continue
    const health: SessionHealth = {
      sessionId: session.id,
      title: session.title,
      hasProferJsonl: false,
      hasPiHarnessJsonl: false,
      hasSdkJsonl: false,
      hasWorkspaceDir: false,
      isOrphan: false,
    }

    // 检查 Profer JSONL。Harness sidecar 缺失仅表示历史会话可从空 snapshot 降级，不是孤儿条件。
    health.hasProferJsonl = existsSync(getAgentSessionMessagesPath(session.id))
    health.hasPiHarnessJsonl = existsSync(getPiHarnessEventsPath(session.id))

    // 检查 runtime 对应的原生 session JSONL。Claude 与 Pi 的持久化目录和文件名规则不同。
    if (session.sdkSessionId) {
      health.hasSdkJsonl = normalizeAgentRuntime(session.agentRuntime) === 'pi'
        ? findPiSessionJsonl(session.sdkSessionId) !== undefined
        : findSdkSessionJsonl(session.sdkSessionId) !== undefined
    }

    // 检查工作区目录
    if (session.workspaceId) {
      const ws = getAgentWorkspace(session.workspaceId)
      if (ws) {
        const dir = getAgentSessionWorkspacePath(ws.slug, session.id)
        health.hasWorkspaceDir = existsSync(dir)
      }
    }

    // 判定孤儿
    const reasons: string[] = []
    if (!health.hasProferJsonl && !health.hasSdkJsonl) {
      reasons.push('Profer 和 SDK JSONL 均缺失')
    } else if (session.sdkSessionId && !health.hasSdkJsonl) {
      reasons.push('SDK JSONL 缺失（无法 resume，每次打开都会触发 session-not-found 恢复）')
    }
    if (!health.hasWorkspaceDir && session.workspaceId) {
      reasons.push('工作区目录缺失')
    }

    if (reasons.length > 0) {
      health.isOrphan = true
      health.orphanReason = reasons.join('；')
    }

    results.push(health)
  }

  // 孤儿排在前面
  results.sort((a, b) => {
    if (a.isOrphan !== b.isOrphan) return a.isOrphan ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  return results
}

/**
 * 迁移 Agent 会话到另一个工作区
 * 操作步骤：
 * 1. 验证会话和目标工作区存在
 * 2. 源 == 目标 → no-op
 * 3. 移动会话工作目录到目标工作区
 * 4. 更新元数据（workspaceId + 清空 sdkSessionId）
 * 5. JSONL 消息文件保持原位（全局目录）
 */
export function moveSessionToWorkspace(sessionId: string, targetWorkspaceId: string): AgentSessionMeta {
  const index = readIndex()
  const idx = index.sessions.findIndex((s) => s.id === sessionId)
  if (idx === -1) {
    throw new Error(`Agent 会话不存在: ${sessionId}`)
  }

  const session = index.sessions[idx]!

  // 源 == 目标 → 直接返回
  if (session.workspaceId === targetWorkspaceId) return session

  const targetWs = getAgentWorkspace(targetWorkspaceId)
  if (!targetWs) {
    throw new Error(`目标工作区不存在: ${targetWorkspaceId}`)
  }

  // 移动工作目录（如果源工作区存在）
  if (session.workspaceId) {
    const sourceWs = getAgentWorkspace(session.workspaceId)
    if (sourceWs) {
      const srcDir = join(getAgentWorkspacePath(sourceWs.slug), sessionId)
      if (existsSync(srcDir)) {
        const destDir = join(getAgentWorkspacePath(targetWs.slug), sessionId)
        // 清理已存在的空目标目录，防止 renameSync 抛出 ENOTEMPTY/EEXIST
        if (existsSync(destDir)) {
          try {
            const contents = readdirSync(destDir)
            if (contents.length === 0) {
              rmSync(destDir, { recursive: true })
              console.log(`[Agent 会话] 已清理空目标目录: ${destDir}`)
            } else {
              // 目标目录非空，合并：先移除目标，再移动源
              rmSync(destDir, { recursive: true })
              console.log(`[Agent 会话] 已清理非空目标目录（以源目录为准）: ${destDir}`)
            }
          } catch (cleanupError) {
            console.warn(`[Agent 会话] 清理目标目录失败，跳过目录迁移:`, cleanupError)
          }
        }
        try {
          renameSync(srcDir, destDir)
        } catch (renameErr) {
          // 跨文件系统（EXDEV）时 renameSync 会失败，回退到 copy + delete
          if ((renameErr as NodeJS.ErrnoException).code === 'EXDEV') {
            console.log(`[Agent 会话] 跨设备移动，使用复制+删除: ${srcDir} → ${destDir}`)
            cpSync(srcDir, destDir, { recursive: true })
            rmSync(srcDir, { recursive: true, force: true })
          } else {
            throw renameErr
          }
        }
        console.log(`[Agent 会话] 已移动工作目录: ${srcDir} → ${destDir}`)
      }
    }
  }

  // 确保目标工作区下有 session 目录
  getAgentSessionWorkspacePath(targetWs.slug, sessionId)

  // 更新元数据
  const updated: AgentSessionMeta = {
    ...session,
    workspaceId: targetWorkspaceId,
    sdkSessionId: undefined, // SDK 上下文与工作区 cwd 绑定，必须清空
    updatedAt: Date.now(),
  }
  index.sessions[idx] = updated
  writeIndex(index)

  console.log(`[Agent 会话] 已迁移会话到工作区: ${updated.title} → ${targetWs.name}`)
  return updated
}

/**
 * 迁移 Chat 对话记录到 Agent 会话
 *
 * 读取 Chat 对话的消息，转换为 AgentMessage 格式，
 * 追加到目标 Agent 会话的 JSONL 文件中。
 *
 * 仅迁移 user 和 assistant 角色的消息文本内容，
 * 工具活动、推理、附件等 Chat 特有字段不迁移。
 */
export function migrateChatToAgentSession(conversationId: string, agentSessionId: string): void {
  const chatMessages = getConversationMessages(conversationId)

  if (chatMessages.length === 0) {
    console.log(`[Agent 会话] Chat 对话无消息，跳过迁移 (${conversationId})`)
    return
  }

  let count = 0
  for (const cm of chatMessages) {
    // 仅迁移 user 和 assistant 消息
    if (cm.role !== 'user' && cm.role !== 'assistant') continue
    if (!cm.content.trim()) continue

    const agentMsg: AgentMessage = {
      id: randomUUID(),
      role: cm.role,
      content: cm.content,
      createdAt: cm.createdAt,
      model: cm.role === 'assistant' ? cm.model : undefined,
    }

    appendAgentMessage(agentSessionId, agentMsg)
    count++
  }

  console.log(`[Agent 会话] 已迁移 ${count} 条消息到 Agent 会话 (${conversationId} → ${agentSessionId})`)
}

/**
 * 分叉 Pi Agent 会话。
 *
 * Pi 的 session 是 append-only tree。分叉必须由 SessionManager 导出目标 branch，
 * 不能只复制 Profer 的展示 JSONL，否则下一轮 resume 仍会看到被截断的上下文。
 */
async function forkPiAgentSession(sourceMeta: AgentSessionMeta, input: ForkSessionInput): Promise<AgentSessionMeta> {
  const targetUuid = input.upToMessageUuid
  if (!targetUuid) throw new Error('Pi 分叉需要指定一条已完成的 assistant 消息')
  const forkPoint = resolvePiForkPoint(sourceMeta, targetUuid)
  if (!forkPoint) throw new Error('该 Pi 历史消息尚无可用的 entry ID 映射，无法安全分叉；请在当前版本中继续一次 Pi 对话后再试')
  if (!sourceMeta.piSessionFile || !existsSync(sourceMeta.piSessionFile)) {
    throw new Error('未找到 Pi session artifact，无法安全分叉')
  }

  // 未显式换模型时继承源会话模型；即使源渠道后来被删除/停用，也允许复制
  // 已存在的 Pi artifact。只有用户主动选择新模型时才需要重新校验渠道能力。
  const forkModelId = input.modelId !== undefined
    ? assertEnabledModelForChannel({
        channelId: sourceMeta.channelId,
        modelId: input.modelId,
        runtime: 'pi',
        purpose: '分叉 Pi Agent 会话',
      })
    : sourceMeta.modelId
  // 自动分配的工作区与手动选择等价：元数据缺 workspaceId 或工作区已被删除时，
  // 统一落回默认沙箱，绝不把分叉目录解析成 undefined（否则底层会退化到进程启动目录）。
  const workspace = (sourceMeta.workspaceId ? getAgentWorkspace(sourceMeta.workspaceId) : undefined)
    ?? ensureDefaultWorkspace()
  const sourceDir = getAgentSessionWorkspacePath(workspace.slug, sourceMeta.id)
  const newMeta = createAgentSession(
    `${sourceMeta.title} (fork)`,
    sourceMeta.channelId,
    workspace.id,
    forkModelId,
    'pi',
  )
  const destDir = getAgentSessionWorkspacePath(workspace.slug, newMeta.id)

  try {
    const sessionDir = join(getSdkConfigDir(), 'sessions', 'pi')
    const forkedManager = await forkPiSessionArtifact({
      sourceSessionFile: sourceMeta.piSessionFile,
      sessionDir,
      sourceDir,
      destinationDir: destDir,
      entryId: forkPoint.entryId,
    })
    const piSessionFile = forkedManager.getSessionFile()
    if (!piSessionFile || !existsSync(piSessionFile)) throw new Error('Pi 分叉 artifact 校验失败')
    if (forkPoint.interruptedText) {
      // 被中断的 assistant 消息没有可恢复的 Pi message entry，不能将其伪装为分叉点。
      // 以最近的完整 entry 建 branch，并把已展示文字作为隐藏上下文追加到新 session。
      forkedManager.appendCustomMessageEntry(
        'profer-interrupted-assistant-context',
        `上一轮助手回复被用户手动暂停。以下是暂停前已展示的内容；请将其视为已有上下文，不要重复输出，除非用户要求：\n\n${forkPoint.interruptedText}`,
        false,
        { sourceAssistantUuid: targetUuid },
      )
    }
    // 新 branch 只包含分叉点之前的 entry；不能把源树后续 turn 的映射带入 metadata。
    const branchBindings = Object.fromEntries(
      Object.entries(sourceMeta.piEntryBindings ?? {})
        .filter(([, mappedEntryId]) => Boolean(forkedManager.getEntry(mappedEntryId))),
    )
    // 检查点以 Pi entry id 为键（而 bindings 是 uuid → entry id），
    // 只继承新 branch 中实际存在的 entry，再迁移到分叉会话自己的检查点目录。
    const keptEntryIds = new Set(Object.values(branchBindings))
    const inheritedCheckpoints = Object.fromEntries(
      Object.entries(sourceMeta.piFileCheckpoints ?? {})
        .filter(([entryId]) => keptEntryIds.has(entryId)),
    )
    const branchCheckpoints = adoptInheritedCheckpoints(sourceMeta.id, newMeta.id, inheritedCheckpoints)

    const explorationMeta = input.explorationSourceLabel ? {
      explorationParentSessionId: sourceMeta.id,
      explorationSourceMessageId: targetUuid,
      explorationSourceLabel: input.explorationSourceLabel,
    } : {}
    updateAgentSessionMeta(newMeta.id, {
      sdkSessionId: forkedManager.getSessionId(),
      piSessionFile,
      piEntryBindings: branchBindings,
      ...(Object.keys(branchCheckpoints).length > 0 && { piFileCheckpoints: branchCheckpoints }),
      forkSourceDir: sourceDir,
      ...explorationMeta,
    })
    newMeta.sdkSessionId = forkedManager.getSessionId()
    newMeta.piSessionFile = piSessionFile
    newMeta.piEntryBindings = branchBindings
    if (Object.keys(branchCheckpoints).length > 0) newMeta.piFileCheckpoints = branchCheckpoints
    Object.assign(newMeta, explorationMeta)

    // 中断消息分叉保留当前磁盘现场（用户手动暂停时的真实状态），不做基线还原。
    const baselineCheckpointPath = forkPoint.interruptedText
      ? undefined
      : resolveForkBaselineCheckpoint(sourceMeta, targetUuid)

    if (sourceDir && destDir) {
      const copyResult = copyForkWorkspaceFiles(sourceDir, destDir)
      if (copyResult.failedCount > 0) {
        console.warn(`[Agent 会话] Pi fork 工作区有 ${copyResult.failedCount} 个条目未复制:`, copyResult.failedPaths)
      }
      // 先复制当前工作区，再按分叉点完成态还原，避免后续轮次写入的文件被带进新分支。
      if (baselineCheckpointPath && existsSync(baselineCheckpointPath)) {
        try {
          const restored = restorePiFileCheckpoint(loadPiFileCheckpoint(baselineCheckpointPath), destDir)
          if (restored.incomplete) {
            console.warn('[Agent 会话] 分叉点工作区基线仅部分还原，可能存在后续轮次残留:', restored.skipped)
          }
        } catch (error) {
          console.warn('[Agent 会话] 还原分叉点工作区基线失败，保留当前副本:', error)
        }
      }
    }
    await copyForkStoredSDKMessages({
      sourceSessionId: sourceMeta.id,
      destSessionId: newMeta.id,
      upToMessageUuid: targetUuid,
      sourceDir,
      destDir,
    })
    copySettledPiHarnessEventsForFork(sourceMeta.id, newMeta.id, resolveForkTimestamp(targetUuid, getAgentSessionSDKMessages(sourceMeta.id)))
    return newMeta
  } catch (error) {
    // 尚未对外返回的新 session 可安全清理，避免留下会被侧栏打开的半成品。
    try { deleteAgentSession(newMeta.id) } catch { /* 保留原始错误 */ }
    throw error
  }
}

interface PiForkPoint {
  entryId: string
  interruptedText?: string
}

/**
 * 把分叉会话继承到的基线搬到它自己的检查点目录，并返回重写后的 entry → 路径映射。
 *
 * 直接跨会话引用源会话目录里的基线是危险的：源会话下一轮的常规回收（它只认自己的映射）
 * 或删除源会话都会把分叉侧的回退点打掉。迁移后每个会话只引用自己的基线，
 * 回收/删除语义完全局部化；个别条目迁移失败时暂存原引用，删除源会话时会再次迁移或明确摘除。
 */
function adoptInheritedCheckpoints(
  sourceSessionId: string,
  targetSessionId: string,
  inherited: Record<string, string>,
): Record<string, string> {
  const paths = Object.values(inherited)
  if (paths.length === 0) return {}
  try {
    const { adopted, failed } = adoptPiFileCheckpoints({
      rootDir: getPiCheckpointsDir(),
      targetSessionId,
      paths,
    })
    if (failed.length > 0) {
      console.warn(`[Agent 会话] 分叉会话 ${targetSessionId} 有 ${failed.length} 份基线未迁移，仍引用源会话 ${sourceSessionId}`)
    }
    return Object.fromEntries(
      Object.entries(inherited).map(([entryId, checkpointPath]) => [entryId, adopted[checkpointPath] ?? checkpointPath]),
    )
  } catch (error) {
    console.warn('[Agent 会话] 迁移分叉会话基线失败，保留源会话引用:', error)
    return inherited
  }
}

/**
 * 已完成 assistant 消息可直接作为 Pi tree branch leaf。手动暂停的 partial 消息
 * 没有 entry binding 时，退回到它之前最近的完整 assistant entry，并在新分支写入
 * 可供模型读取的隐藏文本上下文，避免把 aborted Pi message 当成可 resume 的节点。
 */
function resolvePiForkPoint(sourceMeta: AgentSessionMeta, targetUuid: string): PiForkPoint | undefined {
  const bindings = sourceMeta.piEntryBindings ?? {}
  const directEntryId = bindings[targetUuid]
  if (directEntryId) return { entryId: directEntryId }

  const messages = getAgentSessionSDKMessages(sourceMeta.id)
  const targetIndex = messages.findIndex((message) => getStoredMessageUuid(message) === targetUuid)
  if (targetIndex < 0) return undefined

  const target = messages[targetIndex]
  if (target?.type !== 'assistant') return undefined
  const interruptedText = extractTextFromSDKMessage(target)
  if (!interruptedText) return undefined

  for (let index = targetIndex - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (!message) continue
    const entryId = bindings[getStoredMessageUuid(message) ?? '']
    if (entryId) return { entryId, interruptedText }
  }
  return undefined
}

/**
 * 求分叉点“完成态”对应的文件基线。
 *
 * 每轮快照在该轮用户提问发出前创建，并绑定到该轮产生的 entry，
 * 所以 entry(第 N 轮) 对应的是第 N 轮开始前，而不是结束态。
 * 分叉点（第 N 轮回复）的完成态 = 下一次用户提问开始时的快照；
 * 分叉点位于最后一轮时，当前磁盘就是完成态，返回 undefined 表示无需还原。
 * 若下一轮没有产生任何 entry（提问后立即取消），无法安全重建，同样不回退。
 */
function resolveForkBaselineCheckpoint(
  sessionMeta: AgentSessionMeta,
  targetUuid: string,
): string | undefined {
  const checkpoints = sessionMeta.piFileCheckpoints
  if (!checkpoints) return undefined
  const messages = getAgentSessionSDKMessages(sessionMeta.id)
  const targetIndex = messages.findIndex((message) => getStoredMessageUuid(message) === targetUuid)
  if (targetIndex < 0) return undefined

  const isRealUserMessage = (message: SDKMessage): boolean =>
    message.type === 'user' && isUserInputMessage(message as SDKUserMessage)
  const nextUserIndex = messages.findIndex((message, index) => index > targetIndex && isRealUserMessage(message))
  if (nextUserIndex < 0) return undefined

  const bindings = sessionMeta.piEntryBindings ?? {}
  for (let index = nextUserIndex; index < messages.length; index += 1) {
    const message = messages[index]
    if (!message) continue
    // 已经走到再下一条用户提问，说明下一轮没有产生可绑定 entry，放弃还原。
    if (index > nextUserIndex && isRealUserMessage(message)) break
    const entryId = bindings[getStoredMessageUuid(message) ?? '']
    if (entryId && checkpoints[entryId]) return checkpoints[entryId]
  }
  return undefined
}

function extractTextFromSDKMessage(message: SDKMessage): string {
  const content = (message as { message?: { content?: Array<{ type?: string; text?: string }> } }).message?.content
  if (!Array.isArray(content)) return ''
  return content
    .filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text!)
    .join('\n')
    .trim()
}

/**
 * 回退 Pi Agent 会话（同一会话内截断到指定 assistant 消息）。
 *
 * Pi 的 session 是 append-only tree，但 Profer 每次 sendMessage 都会重新
 * `SessionManager.open()` 会话文件，leaf 指针 = 文件中最后一个 entry。因此
 * 不能只改内存 leaf，必须**物理截断 JSONL**：保留 header + root→目标 entry
 * 的主路径（getBranch），丢弃其余 entry（含未激活分支与目标之后的 turn）。
 * 截断后下一次 resume 用同一个 piSessionFile/sdkSessionId，SDK 从目标处继续。
 */
function cleanUserRequestText(raw: string): string {
  const match = raw.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/)
  if (match && typeof match[1] === 'string') return match[1].trim()
  return raw
}

/**
 * 撤销本轮及以后的所有对话（及其附属的文件更改）
 *
 * 目标定义：
 * 从指定的目标消息所在轮次（以用户提问为起点）开始，彻底撤销本轮及之后的所有轮次。
 * 1. 恢复文件至本轮发起前的干净检查点；
 * 2. 物理截断 Pi session，丢弃本轮及后续 entries；
 * 3. 截断展示 JSONL（使用 truncateSDKMessagesBefore 排除本轮提问及其后所有消息）；
 * 4. 提取被撤销的用户提问文本（undoneUserText），以便前端自动回填输入框。
 */
export async function rewindPiSession(
  sessionId: string,
  targetMessageUuid: string,
  meta?: AgentSessionMeta,
): Promise<RewindSessionResult> {
  const sessionMeta = meta ?? getAgentSessionMeta(sessionId)
  if (!sessionMeta) {
    throw new Error(`未找到会话元数据: ${sessionId}`)
  }
  const piSessionFile = sessionMeta.piSessionFile
  if (!piSessionFile || !existsSync(piSessionFile)) {
    throw new Error('未找到 Pi session artifact，无法撤销')
  }

  const bindings = sessionMeta.piEntryBindings ?? {}
  const messages = getAgentSessionSDKMessages(sessionId)
  const targetIndex = messages.findIndex((message) => getStoredMessageUuid(message) === targetMessageUuid)
  if (targetIndex < 0) {
    throw new Error(`撤销失败：未找到目标消息 ${targetMessageUuid}`)
  }

  // 1. 定位本轮对话的用户提问消息（User Message）
  let userMessageIndex = targetIndex
  const targetMsg = messages[targetIndex]
  if (targetMsg && isUserInputMessage(targetMsg as SDKUserMessage)) {
    userMessageIndex = targetIndex
  } else {
    // 若传入的是 assistant 或 system 消息，向前回溯找到该 turn 发起的 user 消息
    for (let i = targetIndex - 1; i >= 0; i--) {
      const prevMsg = messages[i]
      if (prevMsg && isUserInputMessage(prevMsg as SDKUserMessage)) {
        userMessageIndex = i
        break
      }
    }
  }

  const userMessage = messages[userMessageIndex]
  const userMessageUuid = (userMessage ? getStoredMessageUuid(userMessage) : undefined) || targetMessageUuid

  // 2. 提取被撤销的用户输入文本
  let undoneUserText: string | undefined
  if (userMessage && isUserInputMessage(userMessage as SDKUserMessage)) {
    const raw = extractUserText(userMessage as SDKUserMessage) ?? ''
    undoneUserText = cleanUserRequestText(raw)
  }

  // 3. 寻找发起本轮提问前的文件检查点
  // 在本轮对话中（从 userMessageIndex 往后直到下一个用户提问或会话结束），
  // 产生的 assistant 消息绑定的 checkpoint 就是在提问发出瞬间创建的快照（piTurnCheckpoint）。
  let checkpointPath: string | undefined
  for (let i = userMessageIndex; i < messages.length; i++) {
    const msg = messages[i]
    if (!msg) continue
    const uuid = getStoredMessageUuid(msg)
    const entryId = uuid ? bindings[uuid] : undefined
    if (entryId && sessionMeta.piFileCheckpoints?.[entryId]) {
      checkpointPath = sessionMeta.piFileCheckpoints[entryId]
      break
    }
  }

  // 4. 定位 Pi session 中需要保留的最后一条 entry（即本轮提问之前的最后一条有效 entry）
  let lastKeptEntryId: string | undefined
  // 收集本轮提问之前所有 assistant/user 消息绑定的候选 entryId（按倒序排，优先最近一条）
  const candidateEntryIds: string[] = []
  for (let i = userMessageIndex - 1; i >= 0; i--) {
    const msg = messages[i]
    if (!msg) continue
    const uuid = getStoredMessageUuid(msg)
    const mappedEntryId = uuid ? bindings[uuid] : undefined
    if (mappedEntryId && !candidateEntryIds.includes(mappedEntryId)) {
      candidateEntryIds.push(mappedEntryId)
    }
  }
  if (candidateEntryIds.length > 0) {
    lastKeptEntryId = candidateEntryIds[0]
  }

  // 5. 物理截断 Pi session 文件：保留 header + root→lastKeptEntryId 的主路径；
  // 若 lastKeptEntryId 不存在（撤销的是会话第一轮），则保留 entries 为空，只保留 header
  const sdk = await import('@earendil-works/pi-coding-agent')
  type PiSessionManagerInstance = ReturnType<typeof sdk.SessionManager.open>
  const sessionDir = join(getSdkConfigDir(), 'sessions', 'pi')
  // 自动分配的工作区与手动选择等价：历史元数据缺 workspaceId（或工作区已删除）时
  // 统一落回默认沙箱，不能因此拒绝合法的文件回退。
  const missingWorkspaceId = !sessionMeta.workspaceId
  const workspace = (sessionMeta.workspaceId ? getAgentWorkspace(sessionMeta.workspaceId) : undefined)
    ?? ensureDefaultWorkspace()
  const sourceDir = getAgentSessionWorkspacePath(workspace.slug, sessionMeta.id)

  // 查找包含指定 entry 的 Pi 会话文件
  const findSessionFileContainingEntry = (entryId: string): { file: string; manager: PiSessionManagerInstance } | null => {
    // 优先尝试当前绑定的主文件
    try {
      if (existsSync(piSessionFile)) {
        const mgr = sdk.SessionManager.open(piSessionFile, sessionDir, sourceDir)
        if (mgr.getEntry(entryId)) {
          return { file: piSessionFile, manager: mgr }
        }
      }
    } catch {
      // 忽略打开失败
    }

    // 若主文件没有该 entry（如因 focus turn 写入了其他 session 文件），扫描 sessions/pi 目录下的相关文件
    if (existsSync(sessionDir)) {
      try {
        const files = readdirSync(sessionDir)
        for (const f of files) {
          if (!f.endsWith('.jsonl')) continue
          const fullPath = join(sessionDir, f)
          if (fullPath === piSessionFile) continue
          try {
            const content = readFileSync(fullPath, 'utf-8')
            if (content.includes(`"id":"${entryId}"`)) {
              const mgr = sdk.SessionManager.open(fullPath, sessionDir, sourceDir)
              if (mgr.getEntry(entryId)) {
                return { file: fullPath, manager: mgr }
              }
            }
          } catch {
            // 忽略读取单个文件失败
          }
        }
      } catch (err) {
        console.warn(`[Agent 会话] 扫描候选 Pi session 文件异常:`, err)
      }
    }
    return null
  }

  let activePiSessionFile = piSessionFile
  let manager: PiSessionManagerInstance | undefined
  let validKeptEntryId: string | undefined

  if (lastKeptEntryId) {
    // 先检查首选 entry
    const match = findSessionFileContainingEntry(lastKeptEntryId)
    if (match) {
      activePiSessionFile = match.file
      manager = match.manager
      validKeptEntryId = lastKeptEntryId
    } else {
      // 若首选 entry 丢失（例如被聚焦执行分支隔离），向前回溯寻找最近一条仍存在的 entry
      for (let i = 1; i < candidateEntryIds.length; i++) {
        const fallbackId = candidateEntryIds[i]
        if (!fallbackId) continue
        const fallbackMatch = findSessionFileContainingEntry(fallbackId)
        if (fallbackMatch) {
          activePiSessionFile = fallbackMatch.file
          manager = fallbackMatch.manager
          validKeptEntryId = fallbackId
          console.warn(`[Agent 会话] 目标 entry (${lastKeptEntryId}) 未找到，向前降级至前序有效 entry (${fallbackId})`)
          break
        }
      }
    }
  }

  // 若仍未获取到 manager，打开默认 piSessionFile
  if (!manager) {
    try {
      if (existsSync(activePiSessionFile)) {
        manager = sdk.SessionManager.open(activePiSessionFile, sessionDir, sourceDir)
      }
    } catch (err) {
      console.warn(`[Agent 会话] 打开主 Pi session 文件异常:`, err)
    }
  }

  let keptEntries: ReturnType<PiSessionManagerInstance['getBranch']> = []
  if (manager && validKeptEntryId) {
    try {
      keptEntries = manager.getBranch(validKeptEntryId)
    } catch (err) {
      console.warn(`[Agent 会话] 获取 Pi entry branch 失败 (${validKeptEntryId}):`, err)
      keptEntries = []
    }
  } else if (lastKeptEntryId && !validKeptEntryId) {
    console.warn(`[Agent 会话] Pi session 中所有候选 entry 均未在记录中找到，将重置为初始状态并正常截断消息历史: sessionId=${sessionId}`)
  }

  const header = manager?.getHeader()
  const newContent = manager && header
    ? [header, ...keptEntries]
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .map((entry) => JSON.stringify(entry))
        .join('\n') + '\n'
    : undefined

  // 6. 执行工作区文件快照回滚
  let fileRewind: RewindSessionResult['fileRewind']
  if (!checkpointPath) {
    fileRewind = { canRewind: false, error: '该轮对话没有文件检查点（可能未发生文件修改或为早期会话）' }
  } else {
    let restored: ReturnType<typeof restorePiFileCheckpoint> | undefined
    try {
      const cwd = getAgentSessionWorkspacePath(workspace.slug, sessionId)
      restored = restorePiFileCheckpoint(loadPiFileCheckpoint(checkpointPath), cwd)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[Agent 会话] Pi 文件恢复不可用，将只回退对话: ${message}`)
      fileRewind = { canRewind: false, error: message }
    }
    if (restored) {
      if (restored.failed) {
        const message = restored.skipped.map((item) => `${item.path}: ${item.reason}`).join('；') || '无法安全恢复文件检查点'
        console.warn(`[Agent 会话] Pi 文件恢复不安全，已保留对话历史: ${message}`)
        throw new Error(`文件恢复不可用，已取消撤销操作: ${message}`)
      }
      fileRewind = {
        canRewind: true,
        filesChanged: restored.changed,
        ...(restored.skipped.length > 0 && { skippedFiles: restored.skipped.map((item) => item.path) }),
        ...(restored.incomplete && { incomplete: true }),
      }
    }
  }

  // 7. 先写临时文件再原子替换，避免回退过程中进程退出留下半截 Pi transcript。
  if (newContent) {
    const tempSessionFile = `${activePiSessionFile}.rewind-${process.pid}-${Date.now()}.tmp`
    try {
      writeFileSync(tempSessionFile, newContent, 'utf-8')
      renameSync(tempSessionFile, activePiSessionFile)
    } finally {
      if (existsSync(tempSessionFile)) unlinkSync(tempSessionFile)
    }
    console.log(`[Agent 会话] Pi session 已截断: sessionId=${sessionId}, file=${activePiSessionFile}, 保留 ${keptEntries.length} 条 entry`)
  }

  // 8. 截断展示 JSONL 消息（严格排除目标 User 消息及其后的所有内容）
  const kept = truncateSDKMessagesBefore(sessionId, userMessageUuid)

  // 9. 清理 piEntryBindings 和 piFileCheckpoints
  const keptEntryIds = new Set(keptEntries.map((entry) => entry.id))
  const keptBindings = Object.fromEntries(
    Object.entries(bindings).filter(([, mappedEntryId]) => keptEntryIds.has(mappedEntryId)),
  )
  const keptCheckpoints = Object.fromEntries(
    Object.entries(sessionMeta.piFileCheckpoints ?? {}).filter(([mappedEntryId]) => keptEntryIds.has(mappedEntryId)),
  )

  try {
    const keepPaths = new Set(Object.values(keptCheckpoints))
    for (const foreign of collectForeignCheckpointPaths(sessionId)) keepPaths.add(foreign)
    prunePiFileCheckpoints(getPiCheckpointsDir(), sessionId, { keepPaths })
  } catch (error) {
    console.warn('[Agent 会话] 回收 Pi 文件检查点失败:', error)
  }

  const newSdkSessionId = manager?.getSessionId?.()
  updateAgentSessionMeta(sessionId, {
    piEntryBindings: keptBindings,
    piFileCheckpoints: keptCheckpoints,
    resumeAtMessageUuid: undefined,
    piSessionFile: activePiSessionFile,
    ...(newSdkSessionId ? { sdkSessionId: newSdkSessionId } : {}),
    // 历史会话缺 workspaceId 时，本次已按默认沙箱完成回退，顺带补齐元数据，
    // 避免后续每次 fork/rewind 都重复猜测同一工作区。
    ...(missingWorkspaceId ? { workspaceId: workspace.id } : {}),
  })

  return {
    remainingMessages: kept.length,
    undoneUserText,
    fileRewind,
  }
}

interface CopyForkStoredSDKMessagesInput {
  sourceSessionId: string
  destSessionId: string
  upToMessageUuid?: string
  sourceDir?: string
  destDir?: string
}

/** 流式复制源会话展示 JSONL 到分叉会话，按目标 UUID 截断并改写路径。 */
async function copyForkStoredSDKMessages({
  sourceSessionId,
  destSessionId,
  upToMessageUuid,
  sourceDir,
  destDir,
}: CopyForkStoredSDKMessagesInput): Promise<number> {
  const sourcePath = getAgentSessionMessagesPath(sourceSessionId)
  if (!existsSync(sourcePath)) return 0

  const destPath = getAgentSessionMessagesPath(destSessionId)
  const out = createWriteStream(destPath, { flags: 'a', encoding: 'utf-8' })
  let copiedCount = 0

  try {
    for await (const msg of readStoredSDKMessages(sourcePath)) {
      await writeJsonlLine(out, serializeSDKMessageForStorage(msg, sourceDir, destDir))
      copiedCount += 1

      if (upToMessageUuid && getStoredMessageUuid(msg) === upToMessageUuid) {
        break
      }
    }
    await endWriteStream(out)
  } catch (err) {
    out.destroy()
    throw err
  }

  return copiedCount
}

async function* readStoredSDKMessages(filePath: string): AsyncGenerator<SDKMessage> {
  const rl = createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    if (!line.trim()) continue
    try {
      const parsed = JSON.parse(line)
      if ('role' in parsed && !('type' in parsed)) {
        yield convertLegacyMessage(parsed as AgentMessage)
      } else {
        yield parsed as SDKMessage
      }
    } catch (err) {
      console.warn(`[Agent 会话] 跳过无法解析的 SDKMessage 行 (${filePath}):`, err)
    }
  }
}

function getStoredMessageUuid(msg: SDKMessage): string | undefined {
  return 'uuid' in msg ? (msg as { uuid?: string }).uuid : undefined
}

function serializeSDKMessageForStorage(
  msg: SDKMessage,
  sourceDir?: string,
  destDir?: string,
): string {
  let serialized = JSON.stringify(msg)
  if (sourceDir && destDir) {
    serialized = rewriteSourceToDest(serialized, sourceDir, destDir)
  }
  if (serialized.length <= MAX_SDK_MESSAGE_LENGTH) return serialized

  let externalized = externalizeSerializedSessionLine(serialized)
  if (sourceDir && destDir) {
    externalized = rewriteSourceToDest(externalized, sourceDir, destDir)
  }
  return externalized
}

async function writeJsonlLine(stream: WriteStream, line: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    stream.write(line + '\n', (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function endWriteStream(stream: WriteStream): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    stream.once('error', reject)
    stream.end(resolve)
  })
}

/**
 * 分叉 Agent 会话（SDK 原生 fork）
 *
 * 直接调用 SDK 的 forkSession() 独立函数完成 JSONL 复制和 UUID 重映射，
 * 新会话立即获得 sdkSessionId，无需延迟到首次发消息。
 *
 * forkSourceDir 记录源会话的工作目录，仅作为元数据参考保留。
 * SDK session JSONL 已在 fork 创建时复制到新会话的 project-hash 目录下，
 * orchestrator 无需在运行时切换 cwd。
 *
 * process.env.CLAUDE_CONFIG_DIR 已在模块加载时设置，无需在此处临时修改。
 *
 * @returns 新创建的会话元数据
 */
export async function forkAgentSession(input: ForkSessionInput): Promise<AgentSessionMeta> {
  const { sessionId } = input
  const sourceMeta = getAgentSessionMeta(sessionId)
  if (!sourceMeta) {
    throw new Error(`源 Agent 会话不存在: ${sessionId}`)
  }
  if (agentSessionActiveChecker?.(sessionId)) {
    throw new Error('Agent 正在运行，完成后再分叉')
  }
  if (activeForkSessionIds.has(sessionId)) {
    throw new Error('该会话正在创建分叉，请稍候再试')
  }

  activeForkSessionIds.add(sessionId)
  try {
    return await forkAgentSessionUnlocked(sourceMeta, input)
  } finally {
    activeForkSessionIds.delete(sessionId)
  }
}

async function forkAgentSessionUnlocked(sourceMeta: AgentSessionMeta, input: ForkSessionInput): Promise<AgentSessionMeta> {
  return forkPiAgentSession(sourceMeta, input)
}

/**
 * 将一段字符串中所有出现的 sourceDir 替换为 destDir。
 *
 * 用于 fork 会话时把历史中嵌入的源会话绝对路径迁移到新会话目录。
 * 处理 JSON 字符串中可能出现的两种编码形式：
 * 1. 原始路径（如 /Users/a/b）
 * 2. JSON 字符串编码后的形式（路径中的 `/` JSON 标准下不会转义，所以通常与 1 一致；
 *    但保留对反斜杠的处理以兼容 Windows 路径）
 *
 * sourceDir 和 destDir 都会规范化去除末尾斜杠，避免不同形式导致漏替换。
 */
function rewriteSourceToDest(content: string, sourceDir: string, destDir: string): string {
  const normalizedSource = sourceDir.replace(/[\\/]+$/, '')
  const normalizedDest = destDir.replace(/[\\/]+$/, '')
  if (!normalizedSource || normalizedSource === normalizedDest) return content
  let rewritten = content.split(normalizedSource).join(normalizedDest)
  // Windows 路径在 JSON 中会被转义为双反斜杠，单独处理一次
  if (normalizedSource.includes('\\')) {
    const sourceEscaped = normalizedSource.replace(/\\/g, '\\\\')
    const destEscaped = normalizedDest.replace(/\\/g, '\\\\')
    rewritten = rewritten.split(sourceEscaped).join(destEscaped)
  }
  return rewritten
}

/**
 * 改写 SDK JSONL 文件中所有出现的源目录路径为目标目录路径。
 *
 * 使用原子写入（临时文件 + rename）避免进程崩溃时截断 JSONL。
 * 文件不存在或读写失败时抛出异常，由调用方（forkAgentSession）统一回滚。
 */
function rewritePathsInJsonlFile(filePath: string, sourceDir: string, destDir: string): void {
  const content = readFileSync(filePath, 'utf-8')
  const rewritten = rewriteSourceToDest(content, sourceDir, destDir)
  if (rewritten !== content) {
    const tmpPath = filePath + '.tmp.' + Date.now()
    writeFileSync(tmpPath, rewritten, 'utf-8')
    renameForkFile(tmpPath, filePath)
  }
}

/**
 * 复制并截断 Graph JSONL 到 fork 会话。
 *
 * Graph 事件存储为 {sessionId}-graph.jsonl，fork 后新会话有新的 sessionId，
 * 如果不显式复制，新会话的 loadGraph() 找不到文件，任务图始终为空。
 *
 * 截断逻辑：以 fork 目标消息的 _createdAt 为截止时间戳，
 * 只复制该时间点之前的图事件，保证 fork 会话只看到 fork 点的任务状态。
 */
/** Resolve a branch boundary from the persisted display message timestamp. */
function resolveForkTimestamp(upToMessageUuid: string | undefined, sourceMessages: SDKMessage[]): number {
  if (!upToMessageUuid) return Date.now()
  const target = sourceMessages.find((message) => 'uuid' in message && (message as { uuid?: string }).uuid === upToMessageUuid) as (SDKMessage & { _createdAt?: unknown }) | undefined
  return typeof target?._createdAt === 'number' ? target._createdAt : Date.now()
}

function copyTruncatedGraphJsonl(
  sourceSessionId: string,
  destSessionId: string,
  upToMessageUuid: string | undefined,
  sourceMessages: SDKMessage[],
): void {
  try {
    const sourcePath = join(getAgentSessionsDir(), `${sourceSessionId}-graph.jsonl`)
    if (!existsSync(sourcePath)) return

    const graphContent = readFileSync(sourcePath, 'utf-8')
    const allEvents = parseEventsFromJsonl(graphContent)
    if (allEvents.length === 0) return

    // 确定 fork 截止时间戳：取 fork 目标消息的 _createdAt
    let forkTimestamp = Date.now()
    if (upToMessageUuid) {
      const targetMsg = sourceMessages.find(
        (m) => 'uuid' in m && (m as { uuid?: string }).uuid === upToMessageUuid,
      )
      if (targetMsg && typeof (targetMsg as Record<string, unknown>)._createdAt === 'number') {
        forkTimestamp = (targetMsg as Record<string, unknown>)._createdAt as number
      }
    }

    // 只保留 fork 点之前创建的图事件
    const truncatedEvents = allEvents.filter((e) => e.timestamp <= forkTimestamp)
    if (truncatedEvents.length === 0) return

    const destPath = join(getAgentSessionsDir(), `${destSessionId}-graph.jsonl`)
    const dir = dirname(destPath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    const lines = truncatedEvents.map((e) => serializeEvent(e)).join('\n') + '\n'
    writeFileSync(destPath, lines, 'utf-8')
    console.log(
      `[Agent 会话] 已复制 Graph JSONL 到 fork 会话 ` +
      `(${truncatedEvents.length}/${allEvents.length} 个事件, 截止时间戳=${forkTimestamp})`,
    )
  } catch (err) {
    console.warn(`[Agent 会话] 复制 Graph JSONL 到 fork 会话失败:`, err)
  }
}

/**
 * 改写 SDKMessage 中所有嵌入的源目录路径为目标目录路径。
 *
 * 通过 JSON 序列化 → 字符串替换 → 反序列化实现深度替换，
 * 覆盖 user/assistant/tool_use/tool_result 等任意嵌套结构中的绝对路径字段。
 * 失败时返回原消息，保证 fork 整体不被打断。
 */
function rewritePathsInSDKMessage(msg: SDKMessage, sourceDir: string, destDir: string): SDKMessage {
  try {
    const json = JSON.stringify(msg)
    const rewritten = rewriteSourceToDest(json, sourceDir, destDir)
    if (rewritten === json) return msg
    return JSON.parse(rewritten) as SDKMessage
  } catch (err) {
    console.warn(`[Agent 会话] 改写 SDKMessage 路径失败，使用原消息:`, err)
    return msg
  }
}

/**
 * 截断展示 JSONL 消息（排除目标消息及其之后的所有消息）。
 * 适用于「撤销本轮」操作：将目标用户提问及之后的所有回复全部从消息流中移除。
 *
 * @param id 会话 ID
 * @param beforeUuid 截断起点消息 UUID（不包含此条消息）
 * @returns 截断后保留的消息列表
 */
export function truncateSDKMessagesBefore(id: string, beforeUuid: string): SDKMessage[] {
  const messages = getAgentSessionSDKMessages(id)
  const cutIndex = messages.findIndex(
    (m) => 'uuid' in m && (m as { uuid?: string }).uuid === beforeUuid,
  )
  if (cutIndex < 0) {
    throw new Error(`[Agent 会话] 截断失败: 未找到 uuid=${beforeUuid}, sessionId=${id}`)
  }
  const kept = messages.slice(0, cutIndex)

  const filePath = getAgentSessionMessagesPath(id)
  const content = kept.map((m) => JSON.stringify(m)).join('\n') + (kept.length > 0 ? '\n' : '')
  writeFileSync(filePath, content, 'utf-8')

  console.log(`[Agent 会话] 消息已截断（排除本轮及之后）: sessionId=${id}, 保留 ${kept.length}/${messages.length} 条`)
  return kept
}

/**
 * 截断 Agent 会话的 SDK 消息到指定 UUID（inclusive）
 *
 * 保留 uuid 匹配消息及之前的所有消息，删除之后的消息。
 * 通过 writeFileSync 全量重写 JSONL 文件。
 *
 * @returns 截断后保留的消息列表
 */
export function truncateSDKMessages(id: string, upToUuidInclusive: string): SDKMessage[] {
  const messages = getAgentSessionSDKMessages(id)
  const cutIndex = messages.findIndex(
    (m) => 'uuid' in m && (m as { uuid?: string }).uuid === upToUuidInclusive,
  )
  if (cutIndex < 0) {
    throw new Error(`[Agent 会话] 截断失败: 未找到 uuid=${upToUuidInclusive}, sessionId=${id}`)
  }
  const kept = messages.slice(0, cutIndex + 1)

  const filePath = getAgentSessionMessagesPath(id)
  const content = kept.map((m) => JSON.stringify(m)).join('\n') + (kept.length > 0 ? '\n' : '')
  writeFileSync(filePath, content, 'utf-8')

  console.log(`[Agent 会话] 消息已截断: sessionId=${id}, 保留 ${kept.length}/${messages.length} 条`)
  return kept
}

/**
 * 从 SDK session JSONL 中查找指定 assistant message 之后最近的 user message UUID
 *
 * SDK session JSONL（~/.proma/sdk-config/projects/...）中的消息都带有 uuid，
 * 但 Profer 自己构造的 user message 没有 uuid。此函数直接读取 SDK 的 JSONL
 * 来解析 rewindFiles 所需的 user message UUID。
 *
 * 对于 fork 会话：Profer JSONL 中的 UUID 来自**源会话**（fork 时直接复制），
 * 而 forked SDK JSONL 中的 UUID 已被重映射。因此 fork 会话需要搜索**源**
 * SDK JSONL 来匹配 assistant UUID。通过 forkSourceSdkSessionId 参数指定。
 *
 * @param sdkSessionId SDK session UUID
 * @param assistantMessageUuid 要回退到的 assistant message UUID
 * @param projectDir SDK 项目目录路径（session 运行时的 cwd）
 * @param forkSourceSdkSessionId 源会话 SDK session ID（fork 会话时传入）
 * @returns user message UUID，找不到时返回 undefined
 */
export function resolveUserUuidFromSDK(
  sdkSessionId: string,
  assistantMessageUuid: string,
  projectDir?: string,
  forkSourceSdkSessionId?: string,
): string | undefined {
  // 优先搜索当前 session JSONL
  let sessionFilePath = findSdkSessionJsonl(sdkSessionId, projectDir)

  // 当前 session JSONL 中未找到 assistant UUID（作为消息 .uuid 字段）时，尝试源会话（fork 场景）
  let usingSourceSession = false
  if (sessionFilePath && forkSourceSdkSessionId) {
    try {
      const lines = readFileSync(sessionFilePath, 'utf-8').split('\n').filter(Boolean)
      const hasUuidAsField = lines.some((line) => {
        try {
          const m = JSON.parse(line)
          return m.uuid === assistantMessageUuid
        } catch { return false }
      })
      if (!hasUuidAsField) {
        // Profer JSONL 中的 UUID 来自源会话，forked JSONL 中已重映射
        const sourceFilePath = findSdkSessionJsonl(forkSourceSdkSessionId, projectDir)
        if (sourceFilePath) {
          console.log(`[Agent 会话] resolveUserUuid: fork 会话 UUID 不匹配（非 .uuid 字段），切换到源会话 ${forkSourceSdkSessionId}`)
          sessionFilePath = sourceFilePath
          usingSourceSession = true
        }
      }
    } catch { /* fall through to main logic */ }
  } else if (!sessionFilePath && forkSourceSdkSessionId) {
    // 当前 session JSONL 完全找不到，直接尝试源会话
    sessionFilePath = findSdkSessionJsonl(forkSourceSdkSessionId, projectDir)
    if (sessionFilePath) {
      usingSourceSession = true
      console.log(`[Agent 会话] resolveUserUuid: 当前 JSONL 未找到，使用源会话 ${forkSourceSdkSessionId}`)
    }
  }

  if (!sessionFilePath) {
    console.warn(`[Agent 会话] 未找到 SDK session JSONL: sdkSessionId=${sdkSessionId}`)
    return undefined
  }

  // 读取并解析 SDK JSONL
  try {
    const lines = readFileSync(sessionFilePath, 'utf-8').split('\n').filter(Boolean)
    const messages = lines.map((l) => JSON.parse(l) as Record<string, unknown>)

    // 找到 assistant message 的位置
    const assistantIdx = messages.findIndex((m) => m.uuid === assistantMessageUuid)
    if (assistantIdx < 0) {
      console.warn(`[Agent 会话] SDK JSONL 中未找到 assistant uuid=${assistantMessageUuid}${usingSourceSession ? ' (源会话)' : ''}`)
      return undefined
    }

    // rewindFiles(userMessageId) 恢复文件到该 user message 发送时的快照状态。
    // 回退到某个 assistant turn = 恢复到"该 turn 完成后"的文件状态
    // = 下一轮用户消息发送时的快照（因为快照记录的是 user 消息发出时的文件状态，
    //   而 assistant turn 完成后到下一条 user 消息之间没有其他文件变化）。
    //
    // 策略：向后找第一条非 tool_result 的 user message。
    // 如果找不到（最后一个 turn），返回 '__LAST_TURN__' 特殊标记 —— 因为当前文件系统
    // 已经是最后一个 turn 完成后的状态，不需要文件回退。

    const isRealUserMessage = (m: Record<string, unknown>): boolean => {
      if (m.type !== 'user' || !m.uuid) return false
      const content = (m.message as { content?: Array<{ type: string }> } | undefined)?.content
      const hasToolResult = Array.isArray(content) && content.some((b) => b.type === 'tool_result')
      return !hasToolResult
    }

    // 向后找下一条真实 user message
    for (let i = assistantIdx + 1; i < messages.length; i++) {
      const m = messages[i]!
      if (isRealUserMessage(m)) {
        console.log(`[Agent 会话] 解析到下一轮 user uuid=${m.uuid} (assistant uuid=${assistantMessageUuid}${usingSourceSession ? ', 源会话' : ''})`)
        return m.uuid as string
      }
    }

    // 最后一个 turn — 当前文件系统已是该 turn 完成后的状态，无需文件回退
    console.log(`[Agent 会话] 最后一个 turn，无需文件回退 (assistant uuid=${assistantMessageUuid})`)
    return '__LAST_TURN__'
  } catch (err) {
    console.warn(`[Agent 会话] 读取 SDK session JSONL 失败:`, err)
    return undefined
  }
}

/**
 * 在 SDK 项目目录中查找指定 session 的 JSONL 文件。
 *
 * @param sdkSessionId SDK session ID
 * @param projectDir 项目目录（可选，优先在此目录的哈希下查找）
 * @returns JSONL 文件路径，找不到返回 undefined
 */
function findSdkSessionJsonl(sdkSessionId: string, _projectDir?: string): string | undefined {
  const sdkConfigDir = getSdkConfigDir()

  // 遍历所有项目目录查找匹配的 session JSONL
  // （SDK 的目录命名规则与 Profer 不完全一致，直接遍历最可靠）
  const projectsDir = join(sdkConfigDir, 'projects')
  if (existsSync(projectsDir)) {
    for (const dir of readdirSync(projectsDir)) {
      const candidate = join(projectsDir, dir, `${sdkSessionId}.jsonl`)
      if (existsSync(candidate)) return candidate
    }
  }

  return undefined
}

/** Pi SessionManager 将 session ID 写入 JSONL 首行 header，而文件名带时间前缀。
 * 读取 header 做精确匹配，避免损坏/截短 ID 时把其他会话误 resume 或误删除。 */
function findPiSessionJsonl(sdkSessionId: string): string | undefined {
  const piSessionDir = join(getSdkConfigDir(), 'sessions', 'pi')
  if (!existsSync(piSessionDir)) return undefined

  const matches: string[] = []
  const scanDirectory = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const candidate = join(directory, entry.name)
      if (entry.isDirectory()) {
        scanDirectory(candidate)
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith('.jsonl')) continue
      try {
        const headerLine = readFileSync(candidate, 'utf-8').split('\n', 1)[0]
        const header = headerLine ? JSON.parse(headerLine) as { type?: unknown; id?: unknown } : undefined
        if (header?.type === 'session' && header.id === sdkSessionId) matches.push(candidate)
      } catch {
        // 损坏或非 Pi 的 JSONL 不参与匹配。
      }
    }
  }
  scanDirectory(piSessionDir)

  // 正常 UUID 不应重复；遇到重复文件时拒绝恢复/删除，避免任意选择一个产生跨会话混淆。
  return matches.length === 1 ? matches[0] : undefined
}

/**
 * 直接从 SDK JSONL 的 file-history-snapshot 恢复文件到指定 user message 时的状态。
 *
 * 绕过 SDK 的 rewindFiles API（避免分支加载问题），直接：
 * 1. 读取 SDK JSONL 中的所有 file-history-snapshot
 * 2. 构建目标 user message 时的文件状态表
 * 3. 从 file-history 备份目录恢复文件
 *
 * 对于 fork 出的会话：resolveUserUuidFromSDK 已从源 SDK JSONL 解析出源空间的 user UUID，
 * 因此 userMessageUuid 可能在源 JSONL 中而非 forked JSONL 中。当在当前 JSONL 中找不到
 * 目标 UUID 时，自动 fallback 到源会话的 JSONL 和 file-history 备份。
 *
 * @param sdkSessionId  SDK session ID
 * @param userMessageUuid  目标 user message UUID（恢复到此时的文件状态）
 * @param cwd  会话工作目录（文件的基准路径）
 * @param projectDir  项目目录（可选，用于定位 SDK JSONL）
 * @param forkSourceSdkSessionId  源会话 SDK session ID（可选，fork 会话回退时使用）
 * @param attachedDirectories  附加的外部目录列表（绝对路径，SDK 会将这些目录下的文件以绝对路径记录在 snapshot 中）
 */
export function rewindFilesFromSnapshot(
  sdkSessionId: string,
  userMessageUuid: string,
  cwd: string,
  projectDir?: string,
  forkSourceSdkSessionId?: string,
  attachedDirectories?: string[],
): { canRewind: boolean; error?: string; filesChanged?: string[]; insertions?: number; deletions?: number } {
  const sdkConfigDir = getSdkConfigDir()

  // 1. 查找 SDK session JSONL（优先当前 session，找不到目标 UUID 时 fallback 到源会话）
  let sessionFilePath = findSdkSessionJsonl(sdkSessionId, projectDir)
  let effectiveSdkSessionId = sdkSessionId
  let isForkFallback = false

  // 2. 读取所有消息，构建到目标 user message 为止的文件状态
  try {
    let messages: Record<string, unknown>[] = []
    if (sessionFilePath) {
      const lines = readFileSync(sessionFilePath, 'utf-8').split('\n').filter(Boolean)
      messages = lines.map((l) => JSON.parse(l) as Record<string, unknown>)
    }

    // 找到目标 user message 的位置
    let targetIdx = messages.findIndex((m) => m.uuid === userMessageUuid)

    // Fork 场景：userMessageUuid 来自源会话（resolveUserUuidFromSDK 已做过 fallback），
    // 在 forked JSONL 中找不到 → 直接切换到源会话 JSONL
    if (targetIdx < 0 && forkSourceSdkSessionId) {
      console.log(`[Agent 会话] rewindFilesFromSnapshot: 目标 UUID 在当前 JSONL 中未找到，切换到源会话 ${forkSourceSdkSessionId}`)
      const sourceFilePath = findSdkSessionJsonl(forkSourceSdkSessionId, projectDir)
      if (!sourceFilePath) {
        return { canRewind: false, error: '未找到源会话 SDK session JSONL（fork 回退需要源会话数据）' }
      }
      const sourceLines = readFileSync(sourceFilePath, 'utf-8').split('\n').filter(Boolean)
      messages = sourceLines.map((l) => JSON.parse(l) as Record<string, unknown>)
      targetIdx = messages.findIndex((m) => m.uuid === userMessageUuid)
      effectiveSdkSessionId = forkSourceSdkSessionId
      isForkFallback = true

      if (targetIdx < 0) {
        return { canRewind: false, error: `源会话 SDK JSONL 中也未找到 user message uuid=${userMessageUuid}` }
      }
      console.log(`[Agent 会话] rewindFilesFromSnapshot: 在源会话中找到目标 UUID (idx=${targetIdx})`)
    } else if (targetIdx < 0) {
      return { canRewind: false, error: `SDK JSONL 中未找到 user message uuid=${userMessageUuid}` }
    }

    // 查找目标 user message 对应的 snapshot（isSnapshotUpdate: false 且 messageId 匹配）
    // SDK 的 file-history-snapshot 有两种：
    // - isSnapshotUpdate: false — user message 发出时的完整文件追踪状态
    // - isSnapshotUpdate: true — assistant 工具修改文件前的增量备份
    // 只使用 user message snapshot 来构建目标时刻的文件状态。
    const fileState = new Map<string, string | null>()
    let targetSnapshotFound = false

    for (const m of messages) {
      if (m.type !== 'file-history-snapshot') continue
      if (m.isSnapshotUpdate) continue
      const snapshot = m.snapshot as {
        messageId?: string
        trackedFileBackups?: Record<string, { backupFileName: string | null }>
      } | undefined
      if (snapshot?.messageId === userMessageUuid && snapshot.trackedFileBackups) {
        for (const [filePath, info] of Object.entries(snapshot.trackedFileBackups)) {
          fileState.set(filePath, info.backupFileName)
        }
        targetSnapshotFound = true
      }
    }

    // 同时收集 target snapshot 对应的增量更新（isSnapshotUpdate: true 且 snapshot.messageId 匹配）
    // 这些记录了 target user message 那轮 assistant 操作前的文件备份
    if (targetSnapshotFound) {
      for (const m of messages) {
        if (m.type !== 'file-history-snapshot' || !m.isSnapshotUpdate) continue
        const snapshot = m.snapshot as {
          messageId?: string
          trackedFileBackups?: Record<string, { backupFileName: string | null }>
        } | undefined
        if (snapshot?.messageId === userMessageUuid && snapshot.trackedFileBackups) {
          // 增量更新可能记录了更多被追踪的文件，但不覆盖已有状态
          for (const [filePath, info] of Object.entries(snapshot.trackedFileBackups)) {
            if (!fileState.has(filePath)) {
              fileState.set(filePath, info.backupFileName)
            }
          }
        }
      }
    }

    // 处理 target 之后新创建的文件（它们在 target 时不存在，需要删除）
    for (let i = targetIdx + 1; i < messages.length; i++) {
      const m = messages[i]!
      if (m.type !== 'file-history-snapshot') continue

      const snapshot = m.snapshot as {
        trackedFileBackups?: Record<string, { backupFileName: string | null }>
      } | undefined
      if (!snapshot?.trackedFileBackups) continue

      for (const [filePath, info] of Object.entries(snapshot.trackedFileBackups)) {
        // 如果这个文件在 target 时不存在（没被追踪），且 backupFileName 为 null（新创建的），标记删除
        if (!fileState.has(filePath) && info.backupFileName === null) {
          fileState.set(filePath, null) // null = 文件应该不存在
        }
      }
    }

    if (fileState.size === 0) {
      if (!targetSnapshotFound) {
        console.log(`[Agent 会话] rewindFilesFromSnapshot: 目标消息无文件快照记录`)
        return { canRewind: false, error: '目标消息无文件快照记录（会话可能在启用文件检查点前创建）' }
      }
      console.log(`[Agent 会话] rewindFilesFromSnapshot: 快照存在但无文件变化`)
      return { canRewind: true, filesChanged: [] }
    }

    // 3. 恢复文件（fork 会话使用源会话的 file-history 备份）
    const fileHistoryDir = join(sdkConfigDir, 'file-history', effectiveSdkSessionId)
    const filesChanged: string[] = []

    const resolvedCwd = resolve(cwd)
    // 预计算允许写入的目录列表（cwd + attachedDirectories）
    const allowedDirs = [resolvedCwd, ...(attachedDirectories || []).map((d) => resolve(d))]

    for (const [filePath, backupFileName] of fileState) {
      // SDK 对 cwd 内文件使用相对路径，对 additionalDirectories 内文件使用绝对路径
      const isAbsolute = filePath.startsWith('/')
      const fullPath = isAbsolute ? resolve(filePath) : resolve(cwd, filePath)

      // 路径安全检查：文件必须位于 cwd 或 attachedDirectories 之内
      const isInAllowedDir = allowedDirs.some((dir) => fullPath.startsWith(dir + '/') || fullPath === dir)
      if (!isInAllowedDir) {
        console.warn(`[Agent 会话] rewindFiles: 拒绝路径越界 ${filePath}`)
        continue
      }

      if (backupFileName === null) {
        // 文件在 target 时不存在 → 删除
        if (existsSync(fullPath)) {
          try {
            unlinkSync(fullPath)
            filesChanged.push(filePath)
            console.log(`[Agent 会话] rewindFiles: 删除 ${filePath}`)
          } catch (err) {
            console.warn(`[Agent 会话] rewindFiles: 删除失败 ${filePath}:`, err)
          }
        }
      } else {
        // 文件在 target 时存在 → 用备份恢复
        const backupPath = resolve(fileHistoryDir, backupFileName)
        // backupPath 越界检查
        if (!backupPath.startsWith(resolve(fileHistoryDir) + '/') && backupPath !== resolve(fileHistoryDir)) {
          console.warn(`[Agent 会话] rewindFiles: 拒绝备份路径越界 ${backupFileName}`)
          continue
        }
        if (!existsSync(backupPath)) {
          console.warn(`[Agent 会话] rewindFiles: 备份文件不存在 ${backupPath}`)
          continue
        }
        try {
          const backupContent = readFileSync(backupPath)
          // 确保目录存在
          const dir = dirname(fullPath)
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
          writeFileSync(fullPath, backupContent)
          filesChanged.push(filePath)
          console.log(`[Agent 会话] rewindFiles: 恢复 ${filePath} ← ${backupFileName}${isForkFallback ? ' (from source session)' : ''}`)
        } catch (err) {
          console.warn(`[Agent 会话] rewindFiles: 恢复失败 ${filePath}:`, err)
        }
      }
    }

    console.log(`[Agent 会话] rewindFilesFromSnapshot 完成: ${filesChanged.length} 个文件已恢复${isForkFallback ? ' (fork fallback)' : ''}`)
    return { canRewind: true, filesChanged }
  } catch (err) {
    return { canRewind: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * 自动归档超过指定天数未更新的 Agent 会话
 *
 * 置顶会话不会被归档。
 *
 * @param daysThreshold 天数阈值
 * @returns 本次归档的会话数量
 */
export function autoArchiveAgentSessions(daysThreshold: number): number {
  const index = readIndex()
  const threshold = Date.now() - daysThreshold * 86_400_000
  let count = 0

  for (const session of index.sessions) {
    if (!isReviewOwnedAgentSession(session) && !session.pinned && !session.archived && session.updatedAt < threshold) {
      session.archived = true
      count++
    }
  }

  if (count > 0) {
    writeIndex(index)
    console.log(`[Agent 会话] 自动归档 ${count} 个会话（阈值: ${daysThreshold} 天）`)
  }

  return count
}

/**
 * 清理所有会话中不存在的附加目录和附加文件
 * @returns 清理的条目总数
 */
export function cleanupStaleAttachedPaths(): number {
  const index = readIndex()
  let count = 0

  // 附加路径清理属于启动维护，不是用户对会话内容的更新。
  // 保留 updatedAt，避免旧会话被批量顶到侧栏最前并显示成“刚刚”。
  for (const session of index.sessions) {
    if (session.attachedDirectories?.length) {
      const valid = session.attachedDirectories.filter((d) => existsSync(d))
      if (valid.length < session.attachedDirectories.length) {
        count += session.attachedDirectories.length - valid.length
        session.attachedDirectories = valid.length > 0 ? valid : undefined
      }
    }

    if (session.attachedFiles?.length) {
      const valid = session.attachedFiles.filter((f) => existsSync(f))
      if (valid.length < session.attachedFiles.length) {
        count += session.attachedFiles.length - valid.length
        session.attachedFiles = valid.length > 0 ? valid : undefined
      }
    }
  }

  if (count > 0) {
    writeIndex(index)
    console.log(`[Agent 会话] 清理了 ${count} 个不存在的附加路径`)
  }

  return count
}

/**
 *
 * 按行流式读取每个会话的 JSONL 文件，命中即早退。兼容旧 AgentMessage 和新 SDKMessage 格式。
 * 每个会话最多返回 1 条匹配，总计达到 maxResults 即停止扫描后续会话。
 *
 * @param query 搜索关键词
 * @returns 匹配结果列表
 */
export async function searchAgentSessionMessages(query: string): Promise<AgentMessageSearchResult[]> {
  if (!query || query.length < 2) return []

  const index = readIndex()
  const results: AgentMessageSearchResult[] = []
  const queryLower = query.toLowerCase()
  const maxResults = 30

  for (const session of index.sessions) {
    if (results.length >= maxResults) break
    if (!isVisibleAgentSession(session)) continue

    const filePath = getAgentSessionMessagesPath(session.id)
    if (!existsSync(filePath)) continue

    const hit = await findFirstMatchInAgentJsonl(filePath, queryLower, query.length)
    if (hit) {
      results.push({
        sessionId: session.id,
        sessionTitle: session.title,
        messageId: hit.messageId,
        role: hit.role,
        snippet: hit.snippet,
        matchStart: hit.matchStart,
        matchLength: query.length,
        archived: session.archived,
      })
    }
  }

  return results
}

/**
 * 在单个 Agent 会话 JSONL 中按行流式查找第一条匹配。
 *
 * Agent 消息存在两种历史格式（旧 AgentMessage 与新 SDKMessage），都要兼容。
 */
async function findFirstMatchInAgentJsonl(
  filePath: string,
  queryLower: string,
  queryLength: number
): Promise<{ messageId: string; role: AgentMessageSearchResult['role']; snippet: string; matchStart: number } | null> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' })
  const rl = createInterface({ input: stream, crlfDelay: Infinity })

  try {
    for await (const line of rl) {
      if (!line.trim()) continue
      let parsed: {
        role?: string
        id?: string
        uuid?: string
        content?: unknown
        message?: { role?: string; id?: string; content?: Array<{ type: string; text?: string }> }
      }
      try {
        parsed = JSON.parse(line)
      } catch {
        continue
      }

      const rawRole = parsed.role ?? parsed.message?.role ?? 'assistant'
      // 收窄到 AgentMessageSearchResult.role 允许的联合类型；不在白名单的退化为 assistant
      const role: AgentMessageSearchResult['role'] =
        rawRole === 'user' || rawRole === 'assistant' || rawRole === 'tool' || rawRole === 'status'
          ? rawRole
          : 'assistant'
      const messageId = parsed.id ?? parsed.uuid ?? parsed.message?.id ?? ''

      let textContent = ''
      if (typeof parsed.content === 'string') {
        textContent = parsed.content
      } else if (Array.isArray(parsed.message?.content)) {
        textContent = parsed.message.content
          .filter((b) => b.type === 'text' && b.text)
          .map((b) => b.text!)
          .join('\n')
      }
      if (!textContent) continue

      const contentLower = textContent.toLowerCase()
      const matchIndex = contentLower.indexOf(queryLower)
      if (matchIndex === -1) continue

      const snippetStart = Math.max(0, matchIndex - 40)
      const snippetEnd = Math.min(textContent.length, matchIndex + queryLength + 40)
      const snippet = (snippetStart > 0 ? '...' : '') +
        textContent.slice(snippetStart, snippetEnd) +
        (snippetEnd < textContent.length ? '...' : '')
      const matchStart = matchIndex - snippetStart + (snippetStart > 0 ? 3 : 0)

      return { messageId, role, snippet, matchStart }
    }
    return null
  } finally {
    rl.close()
    stream.destroy()
  }
}

function extractTextFromPersistedMessage(parsed: unknown): string {
  if (!parsed || typeof parsed !== 'object') return ''
  const record = parsed as {
    content?: unknown
    message?: { content?: Array<{ type: string; text?: string }> }
  }

  if (typeof record.content === 'string') {
    return record.content
  }

  if (Array.isArray(record.message?.content)) {
    return record.message.content
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text!)
      .join('\n')
  }

  return ''
}

function createSnippet(text: string, matchIndex: number, matchLength: number): string {
  const snippetStart = Math.max(0, matchIndex - 48)
  const snippetEnd = Math.min(text.length, matchIndex + matchLength + 48)
  return (snippetStart > 0 ? '...' : '') +
    text.slice(snippetStart, snippetEnd) +
    (snippetEnd < text.length ? '...' : '')
}

function findSessionMessageSnippet(sessionId: string, query: string): string | undefined {
  if (!query || query.length < 2) return undefined

  const filePath = getAgentSessionMessagesPath(sessionId)
  if (!existsSync(filePath)) return undefined

  const queryLower = query.toLowerCase()
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const lines = raw.split('\n').filter((line) => line.trim())

    for (const line of lines) {
      const textContent = extractTextFromPersistedMessage(JSON.parse(line))
      if (!textContent) continue

      const matchIndex = textContent.toLowerCase().indexOf(queryLower)
      if (matchIndex === -1) continue

      return createSnippet(textContent, matchIndex, query.length)
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * 搜索当前工作区可引用的 Agent 会话。
 *
 * 仅返回当前工作区、未归档、非当前会话的结果；无关键词时返回最近更新的会话。
 */
export function searchAgentSessionReferences(input: AgentSessionReferenceSearchInput): AgentSessionReferenceSearchResult[] {
  const workspaceId = input?.workspaceId?.trim()
  if (!workspaceId) return []

  const query = (input?.query ?? '').trim()
  const queryLower = query.toLowerCase()
  const requestedLimit = Number.isFinite(input?.limit) ? input.limit! : 20
  const limit = Math.min(Math.max(requestedLimit, 1), 50)

  const candidates = listAgentSessions()
    .filter((session) => session.workspaceId === workspaceId)
    .filter((session) => !session.archived)
    .filter((session) => isVisibleAgentSession(session))
    .filter((session) => session.id !== input?.excludeSessionId)

  const results: AgentSessionReferenceSearchResult[] = []

  for (const session of candidates) {
    if (results.length >= limit) break

    if (!queryLower) {
      results.push({
        sessionId: session.id,
        title: session.title,
        updatedAt: session.updatedAt,
        matchSource: 'recent',
      })
      continue
    }

    if (session.title.toLowerCase().includes(queryLower)) {
      results.push({
        sessionId: session.id,
        title: session.title,
        updatedAt: session.updatedAt,
        matchSource: 'title',
      })
      continue
    }

    const snippet = findSessionMessageSnippet(session.id, query)
    if (snippet) {
      results.push({
        sessionId: session.id,
        title: session.title,
        updatedAt: session.updatedAt,
        snippet,
        matchSource: 'message',
      })
    }
  }

  return results
}

/**
 * 按完整 turn 边界对会话消息做惰性分页（供移动端传输层懒加载）。
 *
 * 为什么按 turn 而非严格条数：渲染层 groupIntoTurns 依赖完整消息序列判定组边界
 * （assistant + user(tool_result) 会跨多条合成一个 turn）。若在中途硬切，客户端分组
 * 会断层/重复。因此：先按目标条数切出近似窗口，再将窗口起点向前扩展到所属用户输入
 * 边界，保证每页都是若干完整的用户输入起始的 turn。
 *
 * 首帧与续页统一算法：
 *   tailExclusive = before ?? total
 *   startRaw       = max(0, tailExclusive - targetMessages)
 *   start          = startRaw 向前扩展到所属 turn 的 user-input 边界
 *   page           = messages[start, tailExclusive)
 *   hasMore        = start > 0
 *
 * @param messages 完整有序 SDKMessage 数组（getAgentSessionSDKMessages 结果）
 * @param opts.before 游标：只取索引 < before 的更早消息。缺省 = 取最新窗口（会话尾部）。
 *                    移动端拿到某页 startIndex 后，补更早时传 before = 该 startIndex。
 * @param opts.targetMessages 近似条数（缺省 10）。切出约这么多条后向前补到完整 turn 边界。
 */
export interface SDKMessagePage {
  messages: SDKMessage[]
  total: number
  startIndex: number
  endIndex: number
  hasMore: boolean
}

export interface PaginateSDKMessagesOptions {
  before?: number
  targetMessages?: number
}

export function paginateSDKMessages(
  messages: SDKMessage[],
  opts: PaginateSDKMessagesOptions = {},
): SDKMessagePage {
  const { before, targetMessages = 10 } = opts
  const total = messages.length
  if (total === 0) {
    return { messages: [], total: 0, startIndex: 0, endIndex: -1, hasMore: false }
  }

  // 尾部上界（exclusive）
  const tailExclusive =
    before !== undefined && before >= 0 && before <= total ? before : total

  // 统一切窗口起点的原始位置（首帧取最新 N 条；续页取 before 前 N 条）
  let startIndex = Math.max(0, tailExclusive - targetMessages)
  // 向前扩展到本页所属 turn 的 user-input 边界。原先向后跳到下一条用户输入会
  // 永久丢弃 startRaw 与该输入之间的 assistant/tool 事件，且会使上划历史的页间出现缺口。
  // 若该页开头属于会话最早的无 user 前缀，保持从 0 开始，保证所有持久化事件可达。
  for (let i = startIndex; i > 0; i--) {
    const msg = messages[i]
    if (msg && msg.type === 'user' && isUserInputMessage(msg as SDKUserMessage)) {
      startIndex = i
      break
    }
    if (i === 1) startIndex = 0
  }

  return {
    messages: messages.slice(startIndex, tailExclusive),
    total,
    startIndex,
    endIndex: tailExclusive - 1,
    hasMore: startIndex > 0,
  }
}
