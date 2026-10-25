/**
 * cdut-ai-class-manager.ts — AI 速课堂专属工作区与会话管理（主进程）
 *
 * 职责：
 *   1. 保证速课堂专属工作区（slug: cdut-ai-class）就绪，实现与全局 Agent 会话的物理隔离；
 *   2. 提供速课堂会话 CRUD，创建时自动锁定并绑定内部导师预设，彻底内化预设逻辑，
 *      杜绝「未选择预设 / 会话不存在」报错；
 *   3. 提供「资料树图谱按需生成」：根据用户在前端弹窗选定的模式（本地极速 / 智能精炼 /
 *      全量深度），生成跨文档知识关联，产出 KnowledgeGraphEdge[] 并缓存落盘；恒定由用户
 *      主动触发，绝不在文件变更或会话加载时自动偷跑消耗 Token。
 *
 * 设计原则：所有模型调用失败均静默降级为本地启发式关联，绝不抛出阻断界面。
 */

import { join, resolve } from 'node:path'
import { existsSync, rmSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { app } from 'electron'
import type { ProviderType } from '@profer/shared'
import {
  BUILTIN_PRESET_STANDARD,
  CDUT_AI_CLASS_WORKSPACE_NAME,
  CDUT_AI_CLASS_WORKSPACE_SLUG,
  type AgentPreset,
  type AgentWorkspace,
  type AiClassSessionSummary,
  type KnowledgeGraphData,
  type KnowledgeGraphEdge,
  type KnowledgeGraphGenerationMode,
  type KnowledgeRelationType,
  type StudyDocumentOutline,
  type StudyDocumentSection,
  type StudyDocumentType,
  type StudyGraphCostEstimate,
  type StudyGraphProgressEvent,
} from '@profer/shared'
import { getAdapter } from '@profer/core'
import {
  createAgentWorkspace,
  listAgentWorkspaces,
  updateAgentWorkspace,
} from '../agent-workspace-manager'
import {
  createAgentSession,
  deleteAgentSession,
  getAgentSessionMeta,
  listAgentSessions,
  updateAgentSessionMeta,
} from '../agent-session-manager'
import { createAgentPreset, listAgentPresets } from '../agent-preset-manager'
import {
  saveMindmap,
  saveFlashcardDeck,
  saveQuiz,
  saveTabs,
  getMindmap,
  createHomeTab,
} from '../study/study-session-store'
import { createInitialFsrs } from '../study/fsrs-scheduler'
import { ingestStudyDocuments, listStudyDocuments } from '../study/study-document-indexer'
import {
  assertStudyId,
  getStudyMaterialsRootDir,
  getStudySessionDir,
  getStudySessionsRootDir,
} from '../config-paths'
import { readJsonFileSafe, writeJsonFileAtomic } from '../safe-file'
import { listChannels, decryptApiKey, isCommercialMode } from '../channel-manager'
import { getTeamAuthWithRefresh } from '../auth-service'
import { getFetchFn } from '../proxy-fetch'
import { getEffectiveProxyUrl } from '../proxy-settings-service'
import { isCommercialBuild } from '../build-target'
import { isOfficialManagedChannel } from '../official-channel'
import { getSettings } from '../settings-service'

// ===== 常量 =====

/** 速课堂工作区展示名（与 shared 契约保持一致） */
const AI_CLASS_WORKSPACE_NAME = CDUT_AI_CLASS_WORKSPACE_NAME
/** 速课堂工作区创建期临时名（确保 slugify 得到 cdut-ai-class） */
const AI_CLASS_WORKSPACE_SEED_NAME = 'CDUT AI Class'
/** 速课堂内部导师预设名（界面上不暴露，仅内部锁定绑定） */
const AI_CLASS_PRESET_NAME = 'AI速课堂导师'
/** 图谱关联边上限 */
const MAX_EDGES = 24
/** 模型调用最大 token */
const GRAPH_MAX_TOKENS = 3000
/** 模型并发批处理上限（限制并发数为 4，防止触发渠道限流） */
const MODEL_CONCURRENCY = 4
/** 单批注入的章节数量（防止单次上下文爆炸） */
const SECTIONS_PER_BATCH = 40
/** 单文档内部大章骨架边上限（防止单文件长文的内部边挤占跨文档映射） */
const MAX_INTRA_EDGES_PER_DOC = 10

// ===== 成本估算公式常量（对应实施方案第三节动态测算规范） =====

/** 每百万 Token 参考单价（人民币，以主流大模型约 1.5 元计） */
const PRICE_PER_MILLION_CNY = 1.5
/** 智能精炼：本地噪音过滤后保留的有效切块比例（约 60%） */
const SMART_KEEP_RATIO = 0.6
/** 智能精炼：单 Chunk 平均输入 1200 + 输出 400 Tokens */
const SMART_TOKENS_PER_CHUNK = 1_600
/** 全量精读：单 Chunk 平均输入 1500 + 输出 600 Tokens */
const FULL_TOKENS_PER_CHUNK = 2_100
/** 智能精炼预估费用下限（元） */
const SMART_COST_FLOOR = 0.01
/** 全量精读预估费用下限（元） */
const FULL_COST_FLOOR = 0.02
/** ai_smart 模式噪音段落识别（教材前言 / 致谢 / 版权 / 目录等套话） */
const NOISE_SECTION_PATTERN = /前言|序言|致谢|谢辞|版权|声明|目录|封面|扉页|参考文献|编后|出版说明/

/** 走 Anthropic 协议 proxy 的供应商（代管模式用 /v1/proxy/messages，其余 /v1/proxy/chat） */
const ANTHROPIC_PROXY_PROVIDERS = new Set<ProviderType>([
  'anthropic', 'anthropic-compatible', 'kimi-api', 'kimi-coding',
  'minimax', 'xiaomi', 'xiaomi-token-plan', 'zhipu-coding',
])

/** 一次性 JSON 补全的请求协议族 */
type CompletionProtocol = 'google' | 'openai-responses' | 'openai-chat' | 'anthropic'

/**
 * 依据渠道 Provider 解析请求协议族。
 *
 * 红线：绝不能按请求 URL 判定——商业代理模式下 URL 会被改写为 `/v1/proxy/chat`
 * 或 `/v1/proxy/messages`，`includes('/chat/completions')` 会恒为 false，
 * 导致 OpenAI 协议渠道被误注入 Anthropic 的顶层 `system` 字段而 400。
 */
function resolveCompletionProtocol(provider: ProviderType): CompletionProtocol {
  if (provider === 'google') return 'google'
  if (provider === 'openai-responses' || provider === 'xai') return 'openai-responses'
  if (ANTHROPIC_PROXY_PROVIDERS.has(provider)) return 'anthropic'
  return 'openai-chat'
}

/** 关联类型 → 微标签 */
const RELATION_LABELS: Record<KnowledgeRelationType, string> = {
  prerequisite: '前置',
  exercise: '题型',
  extension: '延伸',
  reference: '关联',
}

// ===== 工作区与会话 =====

/**
 * 确保速课堂专属工作区存在并返回。
 *
 * 通过「创建期种子名 → 重命名为中文展示名」两步法，既保证物理目录 slug 恒为
 * `cdut-ai-class`，又让工作区在界面上以「AI速课堂」可读呈现。
 */
export function ensureAiClassWorkspace(): AgentWorkspace {
  const existing = listAgentWorkspaces().find(
    (ws) => ws.slug === CDUT_AI_CLASS_WORKSPACE_SLUG || ws.name === AI_CLASS_WORKSPACE_NAME,
  )
  if (existing) return existing

  const created = createAgentWorkspace(AI_CLASS_WORKSPACE_SEED_NAME, { type: 'personal' })
  try {
    return updateAgentWorkspace(created.id, { name: AI_CLASS_WORKSPACE_NAME })
  } catch (error) {
    // 展示名重名时保留种子名，不影响隔离与使用
    console.warn('[AI速课堂] 工作区重命名失败，保留默认名:', error)
    return created
  }
}

/** 确保速课堂内部导师预设存在（幂等，按工作区范围检索） */
function ensureAiClassPreset(workspaceSlug: string): AgentPreset {
  const existing = listAgentPresets(workspaceSlug).find(
    (preset) => preset.scope === 'workspace' && preset.name === AI_CLASS_PRESET_NAME,
  )
  if (existing) return existing
  return createAgentPreset(workspaceSlug, {
    name: AI_CLASS_PRESET_NAME,
    description: 'AI 速课堂内部导师预设：专注带教与靶向提分，预设逻辑已内化，无需手动切换。',
    basePresetId: BUILTIN_PRESET_STANDARD,
  })
}

/** 列出速课堂历史课堂简报（按最近活跃降序） */
export function listAiClassSessions(): AiClassSessionSummary[] {
  const workspace = ensureAiClassWorkspace()
  return listAgentSessions()
    .filter((session) => session.workspaceId === workspace.id)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((session) => ({
      sessionId: session.id,
      courseName: session.title || '新课堂',
      createdAt: session.createdAt,
      lastActiveAt: session.updatedAt,
      documentCount: listStudyDocuments(session.id).length,
    }))
}

/**
 * 新建速课堂会话：自动归属专属工作区并锁定内部导师预设，返回课堂简报。
 */
export function createAiClassSession(courseName: string): AiClassSessionSummary {
  const workspace = ensureAiClassWorkspace()
  const preset = ensureAiClassPreset(workspace.slug)
  const title = courseName.trim() || '未命名课堂'
  const session = createAgentSession(
    title,
    undefined,
    workspace.id,
    undefined,
    'pi',
    false,
    preset.id,
  )
  return {
    sessionId: session.id,
    courseName: session.title || title,
    createdAt: session.createdAt,
    lastActiveAt: session.updatedAt,
    documentCount: 0,
  }
}

/** 演示课堂名称（新手引导专用，按标题幂等复用） */
const DEMO_AI_CLASS_NAME = '演示课堂 · 红楼梦精读'
/** 演示资料 ASCII 文件名（避免 Windows/macOS 打包编码差异） */
const DEMO_NOVEL_FILE_NAME = 'hongloumeng-quan-shu.txt'

/** 演示资料搜索结果 */
export interface EnsureDemoAiClassResult {
  session: AiClassSessionSummary
  created: boolean
  documentIngested: boolean
  novelPath: string | null
}

/**
 * 解析演示《红楼梦》全文路径。
 *
 * 优先环境变量与开发态 resources，其次兼容仓库根目录原始中文文件；
 * 全部缺失时返回 null，由调用方如实降级，绝不伪造导入成功。
 */
function resolveDemoNovelPath(): string | null {
  const appPath = typeof app?.getAppPath === 'function' ? app.getAppPath() : process.cwd()
  const candidates = [
    process.env.CDUT_DEMO_NOVEL_PATH,
    app?.isPackaged ? join(process.resourcesPath, 'demo', DEMO_NOVEL_FILE_NAME) : null,
    join(appPath, 'resources', 'demo', DEMO_NOVEL_FILE_NAME),
    join(appPath, '..', '..', '《红楼梦》全书.txt'),
    join(process.cwd(), '《红楼梦》全书.txt'),
  ].filter((candidate): candidate is string => Boolean(candidate))
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

/**
 * 确保「演示课堂 · 红楼梦精读」会话与《红楼梦》资料就绪。
 *
 * 幂等：会话优先按标题匹配；标题被首轮自动改名服务覆盖后，退化为按
 * 「已挂载《红楼梦》资料的速课堂会话」匹配，命中即复用、绝不重建。
 * 资料按文件名判重；ingestStudyDocuments 内部会 await 落盘 index.json 与
 * document.md，返回前再做一次 listStudyDocuments 硬校验。
 *
 * 并发保护：in-flight Promise 复用，避免快速重播/双击触发重复建会话。
 */
export function ensureDemoAiClassSession(): Promise<EnsureDemoAiClassResult> {
  ensureDemoInFlight ??= runEnsureDemoAiClassSession().finally(() => {
    ensureDemoInFlight = null
  })
  return ensureDemoInFlight
}

let ensureDemoInFlight: Promise<EnsureDemoAiClassResult> | null = null

async function runEnsureDemoAiClassSession(): Promise<EnsureDemoAiClassResult> {
  const sessions = listAiClassSessions()
  const existing =
    sessions.find((session) => session.courseName === DEMO_AI_CLASS_NAME)
    // 兜底：首轮回复触发自动改名后标题不再匹配，改按已挂载《红楼梦》资料定位演示课堂
    ?? sessions.find((session) =>
      listStudyDocuments(session.sessionId).some(
        (document) => document.fileName === DEMO_NOVEL_FILE_NAME,
      ),
    )
  const session = existing ?? createAiClassSession(DEMO_AI_CLASS_NAME)
  const created = !existing
  lockDemoSessionTitle(session.sessionId)

  const novelPath = resolveDemoNovelPath()
  if (!novelPath) {
    console.warn('[AI速课堂] 未找到演示《红楼梦》全文，跳过资料挂载')
    return { session, created, documentIngested: false, novelPath: null }
  }

  const hasNovel = listStudyDocuments(session.sessionId).some(
    (document) => document.fileName === DEMO_NOVEL_FILE_NAME,
  )
  if (!hasNovel) {
    await ingestStudyDocuments(session.sessionId, [novelPath])
  }

  // 刷盘硬校验：确认索引目录已可枚举到该资料
  const ingested = listStudyDocuments(session.sessionId).some(
    (document) => document.fileName === DEMO_NOVEL_FILE_NAME,
  )
  seedDemoAiClassArtifacts(session.sessionId)
  const refreshed = listAiClassSessions().find((item) => item.sessionId === session.sessionId)
  return {
    session: refreshed ?? session,
    created,
    documentIngested: ingested,
    novelPath,
  }
}

/**
 * 锁定演示课堂标题：首轮回复后 orchestrator 的自动改名不得覆盖演示课堂名，
 * 否则二次重播按标题幂等匹配会失败并重复建课堂。已锁定或会话缺失时静默跳过。
 */
function lockDemoSessionTitle(sessionId: string): void {
  try {
    const meta = getAgentSessionMeta(sessionId)
    if (!meta || meta.titleLockedAt) return
    updateAgentSessionMeta(sessionId, { titleLockedAt: Date.now() })
  } catch (error) {
    console.warn('[AI速课堂] 锁定演示课堂标题失败:', sessionId, error)
  }
}

/** 删除速课堂会话（索引瞬时摘除 + 物理磁盘后台异步清理专属资料与工件） */
export function deleteAiClassSession(sessionId: string): void {
  deleteAgentSession(sessionId, { backgroundDiskCleanup: true })
  setImmediate(() => {
    try {
      const rootMaterials = resolve(getStudyMaterialsRootDir())
      const materialsDir = resolve(rootMaterials, assertStudyId(sessionId, '会话标识'))
      if (materialsDir.startsWith(`${rootMaterials}/`) || materialsDir.startsWith(`${rootMaterials}\\`)) {
        if (existsSync(materialsDir)) rmSync(materialsDir, { recursive: true, force: true })
      }
    } catch (err) {
      console.warn('[AI速课堂] 清理学习资料目录失败:', sessionId, err)
    }
    try {
      const rootSessions = resolve(getStudySessionsRootDir())
      const sessionDataDir = resolve(rootSessions, assertStudyId(sessionId, '会话标识'))
      if (sessionDataDir.startsWith(`${rootSessions}/`) || sessionDataDir.startsWith(`${rootSessions}\\`)) {
        if (existsSync(sessionDataDir)) rmSync(sessionDataDir, { recursive: true, force: true })
      }
    } catch (err) {
      console.warn('[AI速课堂] 清理会话工件目录失败:', sessionId, err)
    }
  })
}

// ===== 静默模型编排：一次性 JSON 补全 =====

/**
 * 一次性补全默认硬超时（毫秒）：90 秒熔断，杜绝网络悬挂导致 Promise 无限 Pending。
 *
 * 该值是**单次 HTTP 请求尝试**的超时；重试时每个尝试独立计时，最坏总耗时不超过 2 × 90 = 180 秒。
 */
export const ONE_SHOT_COMPLETION_TIMEOUT_MS = 90_000

/** 一次性补全调用选项（渠道继承 / 超时覆盖 / 外部取消） */
export interface OneShotCompletionOptions {
  /** 显式指定渠道 ID（优先于全局 settings.agentChannelId） */
  channelId?: string
  /** 显式指定模型 ID（优先于全局 settings.agentModelId） */
  modelId?: string
  /** 请求硬超时（毫秒），缺省 90 秒（单次请求尝试超时，重试时每个尝试独立计时） */
  timeoutMs?: number
  /** 单次补全的最大输出 tokens；缺省沿用图谱额度 GRAPH_MAX_TOKENS */
  maxOutputTokens?: number
  /** 外部取消信号（触发后立即中断底层 fetch） */
  signal?: AbortSignal
}

/** 一次性补全自动扩容重试上限 */
const MAX_ONE_SHOT_OUTPUT_TOKENS = 32_768

/** 一次性补全响应检查结果 */
export interface CompletionResponseInspection {
  /** 提取出的正文；无正文时为 null */
  text: string | null
  /** 供应商终止原因（finish_reason / stop_reason / finishReason / incomplete_details.reason） */
  finishReason: string | null
  /** 正文有效字符数 */
  textChars: number
  /** 思考链字符数（仅诊断，绝不作为正文） */
  reasoningChars: number
}

/** 把未知值安全收窄为普通对象 */
function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

/** 把未知值安全收窄为对象数组 */
function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.map(asRecord).filter((item): item is Record<string, unknown> => item !== null)
    : []
}

/** 安全拼接 OpenAI 风格 content（字符串 / 内容块数组 / null / undefined） */
function collectOpenAIContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map((part) => {
      if (typeof part === 'string') return part
      const record = asRecord(part)
      if (!record) return ''
      return typeof record.text === 'string' ? record.text : ''
    })
    .join('')
}

/** 统计思考字段字符数（各家网关命名不一，仅用于诊断） */
function countReasoningChars(message: Record<string, unknown> | null): number {
  if (!message) return 0
  let total = 0
  for (const field of ['reasoning_content', 'reasoning', 'thinking'] as const) {
    const value = message[field]
    if (typeof value === 'string') total += value.length
  }
  return total
}

/**
 * 按协议从非流式响应中提取正文与终止原因。
 *
 * 标题场景继续使用 `parseTitleResponse`；本函数服务一次性 JSON 补全，
 * 必须同时满足：正文多形态拼接、思考块隔离、终止原因透出、畸形响应不抛异常。
 */
export function inspectCompletionResponse(
  protocol: CompletionProtocol,
  data: unknown,
): CompletionResponseInspection {
  const record = asRecord(data)
  if (!record) return { text: null, finishReason: null, textChars: 0, reasoningChars: 0 }

  if (protocol === 'google') {
    const candidate = asRecordArray(record.candidates)[0]
    const content = asRecord(candidate?.content)
    const text = asRecordArray(content?.parts)
      // Gemini 思考片段带 thought: true，绝不能混入正文
      .filter((part) => part.thought !== true)
      .map((part) => (typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim()
    return {
      text: text || null,
      finishReason: typeof candidate?.finishReason === 'string' ? candidate.finishReason : null,
      textChars: text.length,
      reasoningChars: 0,
    }
  }

  if (protocol === 'openai-responses') {
    const outputText = typeof record.output_text === 'string' ? record.output_text.trim() : ''
    const collected = asRecordArray(record.output)
      .flatMap((item) => asRecordArray(item.content))
      .map((part) => (part.type === 'output_text' && typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim()
    const text = outputText || collected
    const incomplete = asRecord(record.incomplete_details)
    const finishReason =
      typeof incomplete?.reason === 'string'
        ? incomplete.reason
        : typeof record.status === 'string'
          ? record.status
          : null
    return {
      text: text || null,
      finishReason,
      textChars: text.length,
      reasoningChars: 0,
    }
  }

  if (protocol === 'anthropic') {
    const blocks = asRecordArray(record.content)
    const text = blocks
      .filter((block) => block.type === 'text' && typeof block.text === 'string')
      .map((block) => block.text as string)
      .join('')
      .trim()
    const reasoningChars = blocks
      .filter((block) => block.type === 'thinking' && typeof block.thinking === 'string')
      .reduce((total, block) => total + (block.thinking as string).length, 0)
    return {
      text: text || null,
      finishReason: typeof record.stop_reason === 'string' ? record.stop_reason : null,
      textChars: text.length,
      reasoningChars,
    }
  }

  // openai-chat
  const choice = asRecordArray(record.choices)[0]
  const message = asRecord(choice?.message)
  const text = collectOpenAIContent(message?.content).trim()
  return {
    text: text || null,
    finishReason: typeof choice?.finish_reason === 'string' ? choice.finish_reason : null,
    textChars: text.length,
    reasoningChars: countReasoningChars(message),
  }
}

/** 终止原因是否为输出长度截断 */
function isLengthFinishReason(reason: string | null): boolean {
  return !!reason && /^(length|max_tokens|max_output_tokens)$/i.test(reason)
}

/** 终止原因是否为内容安全拦截 */
function isContentFilterFinishReason(reason: string | null): boolean {
  return !!reason && /content_filter|safety|blocked/i.test(reason)
}

/** 空正文错误文案 */
function buildEmptyResponseError(reason: string | null, retried: boolean): string {
  const retryNote = retried ? '，已自动扩容重试仍无结果' : ''
  const guidance = isContentFilterFinishReason(reason)
    ? '请调整所选资料范围或更换渠道后重试。'
    : '请更换渠道或模型后重试。'
  return `模型响应未包含正文内容（终止原因：${reason ?? '未知'}）${retryNote}，${guidance}`
}

/** 输出截断错误文案 */
function buildTruncatedResponseError(reason: string | null, tokens: number): string {
  return `模型输出达到长度上限被截断（终止原因：${reason ?? 'length'}，当前上限 ${tokens} tokens），请减少题目 / 卡片数量、降低难度，或更换支持更长输出的模型后重试。`
}

/**
 * 一次性的非流式模型调用（复用 generateTitle 的渠道 / 鉴权 / 适配器链路）。
 *
 * 渠道继承优先级：显式 options.channelId / modelId → 全局 settings；
 * 两者皆无时抛出可读错误。请求强制硬超时熔断（默认单次 90 秒），超时后中断
 * 底层 fetch 并抛出明确原因；空正文 / 输出截断时自动扩容重试一次。
 * 所有失败路径均抛出携带可读文案的异常，由调用方决定静默降级（图谱推演）
 * 还是直接呈现（学习工件生成）。
 */
export async function oneShotJsonCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: OneShotCompletionOptions = {},
): Promise<string> {
  const settings = getSettings()
  const channelId = options.channelId || settings.agentChannelId
  const modelId = options.modelId || settings.agentModelId
  if (!channelId || !modelId) {
    throw new Error('尚未配置模型渠道：请先在「设置 → 渠道」中选择默认渠道与模型。')
  }
  const channel = listChannels().find((candidate) => candidate.id === channelId)
  if (!channel) {
    throw new Error(`渠道不存在或已被删除（${channelId}），请在设置中检查渠道配置。`)
  }

  let apiKey: string
  let proxyBaseUrl = ''
  if ((isCommercialBuild() || isCommercialMode()) && isOfficialManagedChannel(channel)) {
    const auth = await getTeamAuthWithRefresh()
    if (!auth) {
      throw new Error('团队账号登录已过期，请重新登录后再试。')
    }
    const proxyPath = ANTHROPIC_PROXY_PROVIDERS.has(channel.provider) ? '/v1/proxy/messages' : '/v1/proxy/chat'
    proxyBaseUrl = `${auth.baseUrl}${proxyPath}`
    apiKey = auth.proxyToken || auth.token
  } else {
    apiKey = decryptApiKey(channelId)
  }

  const adapter = getAdapter(channel.provider)
  const req = adapter.buildTitleRequest({
    baseUrl: proxyBaseUrl || channel.baseUrl,
    apiKey,
    modelId,
    prompt: userPrompt,
  })
  if (proxyBaseUrl) req.url = proxyBaseUrl

  const protocol = resolveCompletionProtocol(channel.provider)
  let bodyObj: Record<string, unknown>
  try {
    bodyObj = JSON.parse(req.body) as Record<string, unknown>
  } catch {
    bodyObj = { model: modelId }
  }

  // 严格按渠道 Provider 协议注入 system prompt 与响应约束，杜绝 400 报错
  if (protocol === 'google') {
    bodyObj['contents'] = [{ role: 'user', parts: [{ text: userPrompt }] }]
    bodyObj['systemInstruction'] = { parts: [{ text: systemPrompt }] }
    delete bodyObj['max_tokens']
    delete bodyObj['system']
    delete bodyObj['messages']
  } else if (protocol === 'openai-responses') {
    bodyObj['model'] = modelId
    bodyObj['instructions'] = systemPrompt
    bodyObj['input'] = [{ role: 'user', content: userPrompt }]
    bodyObj['temperature'] = 0
    delete bodyObj['max_tokens']
    delete bodyObj['system']
    delete bodyObj['messages']
  } else if (protocol === 'openai-chat') {
    bodyObj['model'] = modelId
    bodyObj['temperature'] = 0
    bodyObj['messages'] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]
    // 本地 Ollama 运行时普遍不支持 OpenAI 的 response_format，仅云端渠道启用
    if (channel.provider !== 'ollama') bodyObj['response_format'] = { type: 'json_object' }
    delete bodyObj['system']
  } else {
    // Anthropic 原生与兼容通道（/messages）
    bodyObj['model'] = modelId
    bodyObj['temperature'] = 0
    bodyObj['system'] = systemPrompt
    bodyObj['messages'] = [{ role: 'user', content: userPrompt }]
    delete bodyObj['response_format']
  }

  /** 按当前尝试额度写入协议对应的输出上限字段 */
  const applyMaxOutputTokens = (tokens: number): void => {
    if (protocol === 'google') {
      bodyObj['generationConfig'] = {
        maxOutputTokens: tokens,
        temperature: 0,
        responseMimeType: 'application/json',
      }
    } else if (protocol === 'openai-responses') {
      bodyObj['max_output_tokens'] = tokens
    } else {
      bodyObj['max_tokens'] = tokens
    }
  }

  const timeoutMs = Math.max(1_000, options.timeoutMs ?? ONE_SHOT_COMPLETION_TIMEOUT_MS)
  const maxOutputTokens = Math.max(1_000, options.maxOutputTokens ?? GRAPH_MAX_TOKENS)
  const externalSignal = options.signal
  const startedAt = Date.now()
  console.info(`[AI速课堂] 静默推演开始: channel=${channel.name || channelId} model=${modelId} timeout=${timeoutMs}ms maxTokens=${maxOutputTokens}`)

  let firstFailure: string | null = null

  try {
    const fetchFn = getFetchFn(await getEffectiveProxyUrl())
    // 最多两次尝试：首次按请求额度，空正文 / 截断时扩容一次
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (externalSignal?.aborted) throw new Error('生成已取消。')

      const attemptTokens =
        attempt === 0
          ? maxOutputTokens
          : Math.min(maxOutputTokens * 2, MAX_ONE_SHOT_OUTPUT_TOKENS)
      applyMaxOutputTokens(attemptTokens)
      req.body = JSON.stringify(bodyObj)

      // 每次尝试独立计时，避免首次耗时挤占重试窗口
      const controller = new AbortController()
      let attemptTimedOut = false
      const timer = setTimeout(() => {
        attemptTimedOut = true
        controller.abort()
      }, timeoutMs)
      const onExternalAbort = (): void => controller.abort()
      if (externalSignal?.aborted) controller.abort()
      else externalSignal?.addEventListener('abort', onExternalAbort, { once: true })

      try {
        const resp = await fetchFn(req.url, {
          method: 'POST',
          headers: req.headers,
          body: req.body,
          signal: controller.signal,
        })
        if (!resp.ok) {
          const errText = await resp.text().catch(() => 'unknown')
          const httpError = new Error(`模型请求失败（HTTP ${resp.status}）：${errText.slice(0, 200)}`)
          // 首次请求的 HTTP 错误不重试；重试遇到鉴权错误必须优先暴露
          if (attempt === 0 || resp.status === 401 || resp.status === 403) throw httpError
          // 其他重试错误（如部分模型不支持更高 max_tokens 的 400）回抛首次失败原因
          throw new Error(firstFailure ?? httpError.message)
        }

        const data: unknown = await resp.json()
        const inspection = inspectCompletionResponse(protocol, data)
        const truncated = isLengthFinishReason(inspection.finishReason)
        if (inspection.text && !truncated) return inspection.text

        const failure = truncated
          ? buildTruncatedResponseError(inspection.finishReason, attemptTokens)
          : buildEmptyResponseError(inspection.finishReason, attempt > 0)

        if (attempt === 0 && !externalSignal?.aborted) {
          firstFailure = failure
          console.warn(
            `[AI速课堂] 一次性补全异常: channel=${channel.name || channelId} model=${modelId} protocol=${protocol} finish=${inspection.finishReason ?? 'unknown'} textChars=${inspection.textChars} reasoningChars=${inspection.reasoningChars}`,
          )
          continue
        }
        throw new Error(failure)
      } catch (error) {
        if (externalSignal?.aborted) throw new Error('生成已取消。')
        if (attemptTimedOut) {
          throw new Error(`模型请求超时（${Math.round(timeoutMs / 1000)} 秒）已熔断，请检查网络或更换渠道后重试。`)
        }
        throw error instanceof Error ? error : new Error(String(error))
      } finally {
        clearTimeout(timer)
        externalSignal?.removeEventListener('abort', onExternalAbort)
      }
    }

    // 理论上不可达：两次尝试均未返回正文时给出首次失败原因
    throw new Error(firstFailure ?? '模型返回结果为空，请重试。')
  } finally {
    console.info(`[AI速课堂] 静默推演结束: 耗时 ${Date.now() - startedAt}ms`)
  }
}

// ===== 跨资料关联推演 =====

/** 宽松解析模型返回的 JSON（容忍 markdown 围栏 / 前后噪声） */
function parseJsonLenient(text: string): unknown {
  let trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '')
  }
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

/** 从模型输出中提炼合法关联边（严格校验文档与章节存在性） */
function coerceEdges(
  raw: unknown,
  documents: StudyDocumentOutline[],
  allowIntraDocument = false,
): KnowledgeGraphEdge[] {
  if (!raw || typeof raw !== 'object') return []
  const list = (raw as { edges?: unknown }).edges
  if (!Array.isArray(list)) return []
  const sectionIndex = new Map<string, Set<string>>()
  for (const doc of documents) {
    sectionIndex.set(doc.documentId, new Set(doc.sections.map((s) => s.sectionId)))
  }
  const edges: KnowledgeGraphEdge[] = []
  const seen = new Set<string>()
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const edge = item as Record<string, unknown>
    const sourceDocId = typeof edge.sourceDocId === 'string' ? edge.sourceDocId : ''
    const targetDocId = typeof edge.targetDocId === 'string' ? edge.targetDocId : ''
    const sourceSectionId = typeof edge.sourceSectionId === 'string' ? edge.sourceSectionId : ''
    const targetSectionId = typeof edge.targetSectionId === 'string' ? edge.targetSectionId : ''
    if (!sourceDocId || !targetDocId) continue
    // 跨文档场景禁止自连；单文档内部骨架推演时允许同文档跨章节连接
    if (!allowIntraDocument && sourceDocId === targetDocId) continue
    if (sourceSectionId === targetSectionId) continue
    if (!sectionIndex.get(sourceDocId)?.has(sourceSectionId)) continue
    if (!sectionIndex.get(targetDocId)?.has(targetSectionId)) continue
    const key = `${sourceSectionId}->${targetSectionId}`
    if (seen.has(key)) continue
    seen.add(key)
    const relationRaw = typeof edge.relationType === 'string' ? edge.relationType : ''
    const relationType: KnowledgeRelationType = (['prerequisite', 'exercise', 'extension', 'reference'] as const)
      .includes(relationRaw as KnowledgeRelationType)
      ? (relationRaw as KnowledgeRelationType)
      : 'reference'
    edges.push({
      edgeId: randomUUID(),
      sourceDocId,
      sourceSectionId,
      targetDocId,
      targetSectionId,
      relationType,
      label: typeof edge.label === 'string' && edge.label.trim() ? edge.label.trim() : RELATION_LABELS[relationType],
      ...(typeof edge.description === 'string' && edge.description.trim() ? { description: edge.description.trim() } : {}),
    })
    if (edges.length >= MAX_EDGES) break
  }
  return edges
}

/** 常见标题停用词与泛化前缀（避免不同章节仅因“第X章”、“概述”等虚词产生误连） */
const TITLE_STOPWORDS = new Set([
  '第', '章', '节', '篇', '部', '目', '课', '讲',
  '的', '了', '在', '是', '与', '和', '及', '或', '等', '之',
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '简', '介', '概', '述', '总', '结', '思', '考', '复', '习',
  '第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十',
  '简介', '概述', '总结', '思考', '复习', '练习', '习题', '讨论', '附录',
  'the', 'and', 'for', 'with', 'chapter', 'section', 'part', 'unit',
])

/** 中文/英文标题的分词集合（过滤虚词/章节停用词，保留高辨识度实体与词素） */
function titleTokens(title: string): Set<string> {
  const tokens = new Set<string>()
  const lower = title.toLowerCase()
  for (const word of lower.match(/[a-z0-9]{2,}/g) ?? []) {
    if (!TITLE_STOPWORDS.has(word)) tokens.add(word)
  }
  const han = lower.match(/[\u4e00-\u9fa5]/g) ?? []
  for (let i = 0; i < han.length; i++) {
    const char = han[i]!
    if (!TITLE_STOPWORDS.has(char)) {
      tokens.add(char)
    }
    if (i + 1 < han.length) {
      const bi = `${char}${han[i + 1]}`
      if (!TITLE_STOPWORDS.has(bi)) {
        tokens.add(bi)
      }
    }
  }
  return tokens
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const token of a) if (b.has(token)) inter++
  return inter / (a.size + b.size - inter)
}

/** 判断文档是否为题集 / 习题类（用于启发式关系类型推断） */
function looksLikeExercise(doc: StudyDocumentOutline): boolean {
  if (doc.fileType === 'xlsx') return true
  return /习题|练习|题库|试卷|真题|题集|作业|test|exercise|quiz/i.test(doc.fileName)
}

/**
 * 本地启发式关联：当静默模型不可用 / 无产出时兜底，保证资料树始终有可用拓扑。
 * 依据章节标题词元相似度，为「后者文档」的章节寻找「前者文档」中最相近的前置章节。
 */
function buildHeuristicEdges(documents: StudyDocumentOutline[]): KnowledgeGraphEdge[] {
  const edges: KnowledgeGraphEdge[] = []
  for (let i = 0; i < documents.length; i++) {
    for (let j = i + 1; j < documents.length; j++) {
      const earlier = documents[i]!
      const later = documents[j]!
      const relationType: KnowledgeRelationType = looksLikeExercise(later) ? 'exercise' : 'reference'
      for (const laterSection of later.sections) {
        const laterTokens = titleTokens(laterSection.title)
        let best: { sectionId: string; score: number } | null = null
        for (const earlierSection of earlier.sections) {
          const score = jaccard(laterTokens, titleTokens(earlierSection.title))
          if (score > 0.12 && (!best || score > best.score)) {
            best = { sectionId: earlierSection.sectionId, score }
          }
        }
        if (best) {
          edges.push({
            edgeId: randomUUID(),
            sourceDocId: earlier.documentId,
            sourceSectionId: best.sectionId,
            targetDocId: later.documentId,
            targetSectionId: laterSection.sectionId,
            relationType,
            label: RELATION_LABELS[relationType],
          })
          if (edges.length >= MAX_EDGES) return edges
        }
      }
    }
  }
  return edges
}

/** 章节引用（批处理与 Prompt 构造的最小单元） */
interface SectionRef {
  documentId: string
  fileName: string
  fileType: StudyDocumentType
  section: StudyDocumentSection
}

/** ai_smart 模式：判定是否为应被过滤的噪音段落（前言 / 致谢 / 目录等套话） */
function isNoiseSection(section: StudyDocumentSection): boolean {
  return NOISE_SECTION_PATTERN.test(`${section.title}${section.summary}`)
}

/** 依据模式收集需要送入模型的章节引用（ai_smart 先本地过滤噪音） */
function collectSectionRefs(
  documents: StudyDocumentOutline[],
  mode: KnowledgeGraphGenerationMode,
): SectionRef[] {
  const refs: SectionRef[] = []
  for (const doc of documents) {
    for (const section of doc.sections) {
      if (mode === 'ai_smart' && isNoiseSection(section)) continue
      refs.push({ documentId: doc.documentId, fileName: doc.fileName, fileType: doc.fileType, section })
    }
  }
  return refs
}

/** 构造紧凑 Prompt（仅发送章节标题与摘要，防止上下文爆炸） */
function buildPromptFromRefs(refs: SectionRef[]): string {
  const lines: string[] = []
  let currentDocId = ''
  for (const ref of refs) {
    if (ref.documentId !== currentDocId) {
      currentDocId = ref.documentId
      lines.push(`### Document documentId=${ref.documentId} | ${ref.fileName} (${ref.fileType})`)
    }
    lines.push(`- sectionId=${ref.section.sectionId} | ${ref.section.title} | ${ref.section.summary}`)
  }
  return lines.join('\n')
}

/** 把数组按固定大小切分为批次 */
function batchArray<T>(items: T[], size: number): T[][] {
  const batches: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size))
  }
  return batches
}

/** 受限并发执行（并发数上限防止触发渠道限流） */
async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const runnerCount = Math.min(limit, items.length)
  const runners = Array.from({ length: runnerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index]!)
    }
  })
  await Promise.all(runners)
  return results
}

/** 图谱推演进度上报器（sessionId 由 generateKnowledgeGraph 统一注入） */
type GraphProgressReporter = (progress: Omit<StudyGraphProgressEvent, 'sessionId'>) => void

/** 安全上报推演进度（无回调时静默） */
function emitGraphProgress(
  reporter: GraphProgressReporter | undefined,
  current: number,
  total: number,
  phase: string,
): void {
  if (!reporter) return
  const safeTotal = Math.max(1, total)
  const clamped = Math.min(current, safeTotal)
  reporter({
    current: clamped,
    total: safeTotal,
    percent: Math.round((clamped / safeTotal) * 100),
    phase,
  })
}

/** 合并多组边并按 sectionId 去重（保留最先出现者，受上限约束） */
function mergeUniqueEdges(groups: KnowledgeGraphEdge[][], cap: number): KnowledgeGraphEdge[] {
  const merged: KnowledgeGraphEdge[] = []
  const seen = new Set<string>()
  for (const group of groups) {
    for (const edge of group) {
      const key = `${edge.sourceSectionId}->${edge.targetSectionId}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(edge)
      if (merged.length >= cap) return merged
    }
  }
  return merged
}

/**
 * 云端 AI 模式：按批次并发调用配置模型抽取关联边，并逐批上报进度。
 * 任意批次失败静默跳过；全部失败返回空数组，由调用方降级为本地启发式。
 */
async function runModelEdgeBatches(
  refs: SectionRef[],
  documents: StudyDocumentOutline[],
  allowIntraDocument: boolean,
  systemPrompt: string,
  userIntro: string,
  reporter?: GraphProgressReporter,
  phase = '正在推演知识网络',
): Promise<KnowledgeGraphEdge[]> {
  if (refs.length === 0) return []
  const batches = batchArray(refs, SECTIONS_PER_BATCH)
  const total = batches.length
  let done = 0
  const groups = await runWithConcurrency(batches, MODEL_CONCURRENCY, async (batch) => {
    // 图谱推演保持静默降级语义：单批失败（含超时熔断）不阻断整体，全部失败退回本地启发式
    let output: string | null = null
    try {
      output = await oneShotJsonCompletion(
        systemPrompt,
        `${userIntro}\n\n${buildPromptFromRefs(batch)}\n\nOutput the relation edges as JSON.`,
      )
    } catch (error) {
      console.warn('[AI速课堂] 图谱批次推演失败，跳过该批次:', error)
    }
    done += 1
    emitGraphProgress(reporter, done, total, phase)
    if (!output) return []
    return coerceEdges(parseJsonLenient(output), documents, allowIntraDocument)
  })
  return mergeUniqueEdges(groups, MAX_EDGES)
}

const GRAPH_SYSTEM_PROMPT = [
  'You are a knowledge graph specialist. Given the chapter outlines of multiple study documents, analyze cross-document conceptual relationships.',
  'Language Convention: Generate relation labels and descriptions matching the language of the source documents. Generate final responses in the same language used by the user, defaulting to English otherwise.',
  'Output strictly valid JSON with the following schema:',
  '{"edges":[{"sourceDocId":"..","sourceSectionId":"..","targetDocId":"..","targetSectionId":"..","relationType":"prerequisite|exercise|extension|reference","label":"concise label","description":"one-sentence rationale"}]}',
  'Rules:',
  '- Connect sections between distinct documents; self-loops are omitted; sectionId must be chosen from the provided outline.',
  '- Use "prerequisite" for preparatory material; "exercise" for practice problems corresponding to concepts; "extension" for advanced topics; "reference" for related citations.',
  '- Keep relationships concise and reliable, up to 24 edges.',
].join('\n')

const INTRA_GRAPH_SYSTEM_PROMPT = [
  'You are a knowledge graph specialist. Given the sequential chapter outline of a single comprehensive study document, deduce pedagogical progression between chapters.',
  'Language Convention: Generate relation labels and descriptions matching the language of the source documents. Generate final responses in the same language used by the user, defaulting to English otherwise.',
  'Output strictly valid JSON with the following schema:',
  '{"edges":[{"sourceDocId":"..","sourceSectionId":"..","targetDocId":"..","targetSectionId":"..","relationType":"prerequisite|extension|reference","label":"concise label","description":"one-sentence rationale"}]}',
  'Rules:',
  '- Connect sequential sections within the same document to reflect pedagogical progression; self-loops are omitted; sectionId must be chosen from the provided outline.',
  '- Use "prerequisite" for sequential progressions; "extension" for conceptual expansions; "reference" for supporting sections.',
  '- Keep relationships concise and reliable, up to 10 edges.',
].join('\n')

/**
 * 单文档内部大章骨架（纯本地启发式，零额外 Token）：
 * 按顺序为每个章节在后续窗口内寻找最相近的章节作为「前置递进」桥接，
 * 找不到相近章节时退化为相邻章节连线，保证单文件长文也呈现连贯的章节脉络。
 */
function buildIntraHeuristicEdges(doc: StudyDocumentOutline): KnowledgeGraphEdge[] {
  const sections = doc.sections
  const tokens = sections.map((section) => titleTokens(section.title))
  const WINDOW = 12
  const edges: KnowledgeGraphEdge[] = []
  for (let i = 0; i < sections.length && edges.length < MAX_INTRA_EDGES_PER_DOC; i++) {
    const source = sections[i]!
    let best: { index: number; score: number } | null = null
    for (let j = i + 1; j < Math.min(sections.length, i + 1 + WINDOW); j++) {
      const score = jaccard(tokens[i]!, tokens[j]!)
      if (score > 0.12 && (!best || score > best.score)) best = { index: j, score }
    }
    const targetIndex = best ? best.index : i + 1 < sections.length ? i + 1 : -1
    if (targetIndex < 0) break
    const target = sections[targetIndex]!
    edges.push({
      edgeId: randomUUID(),
      sourceDocId: doc.documentId,
      sourceSectionId: source.sectionId,
      targetDocId: doc.documentId,
      targetSectionId: target.sectionId,
      relationType: 'prerequisite',
      label: RELATION_LABELS.prerequisite,
    })
  }
  return edges
}

/**
 * 场景 1（单文档）：推演文档内部大章之间的先后演进逻辑。
 * local_fast 纯本地启发式；AI 模式走模型推演，失败时降级为启发式。
 */
async function buildIntraDocumentGraph(
  document: StudyDocumentOutline,
  mode: KnowledgeGraphGenerationMode,
  reporter?: GraphProgressReporter,
): Promise<KnowledgeGraphEdge[]> {
  if (mode === 'local_fast') {
    emitGraphProgress(reporter, 1, 1, '正在梳理大章演进脉络')
    return buildIntraHeuristicEdges(document)
  }
  const refs = collectSectionRefs([document], mode)
  const edges = await runModelEdgeBatches(
    refs,
    [document],
    true,
    INTRA_GRAPH_SYSTEM_PROMPT,
    'Below is the sequential chapter outline of a single study document:',
    reporter,
    '正在推演大章演进脉络',
  )
  if (edges.length > 0) return edges
  return buildIntraHeuristicEdges(document)
}

/**
 * 场景 2（多文档）：分层全息推演。
 *   Layer 1：各文档内部大章骨架（本地启发式，零额外 Token）；
 *   Layer 2：跨文档知识点映射（教材理论 ↔ 试题考点；AI 模式走模型，失败降级启发式）。
 */
async function buildHierarchicalMultiDocumentGraph(
  documents: StudyDocumentOutline[],
  mode: KnowledgeGraphGenerationMode,
  reporter?: GraphProgressReporter,
): Promise<KnowledgeGraphEdge[]> {
  const intraEdges: KnowledgeGraphEdge[] = []
  for (const doc of documents) intraEdges.push(...buildIntraHeuristicEdges(doc))

  let crossEdges: KnowledgeGraphEdge[] = []
  if (mode === 'local_fast') {
    emitGraphProgress(reporter, 1, 1, '正在推演分层知识网络')
    crossEdges = buildHeuristicEdges(documents)
  } else {
    try {
      const refs = collectSectionRefs(documents, mode)
      crossEdges = await runModelEdgeBatches(
        refs,
        documents,
        false,
        GRAPH_SYSTEM_PROMPT,
        'Below are the chapter outlines of multiple study documents:',
        reporter,
        '正在推演分层知识网络',
      )
    } catch (error) {
      console.warn('[AI速课堂] 分层图谱云端推演失败，降级为启发式关联:', error)
    }
    if (crossEdges.length === 0) crossEdges = buildHeuristicEdges(documents)
  }

  // 跨文档映射优先保留，再补充各文档内部骨架
  return mergeUniqueEdges([crossEdges, intraEdges], MAX_EDGES)
}

/**
 * 动态测算当前会话三档生成模式的 Token 与费用预估（供弹窗看板展示）。
 *
 * 对应实施方案第三节：
 *   - 方案二（智能精炼）：有效切块数 = ⌈总切块 × 0.6⌉，单价 1600 Token/块；
 *   - 方案三（全量精读）：全量切块数，单价 2100 Token/块。
 */
export function estimateGraphGenerationCost(sessionId: string): StudyGraphCostEstimate {
  const documents = listStudyDocuments(sessionId)
  const totalDocuments = documents.length
  const totalChars = documents.reduce((sum, doc) => sum + doc.totalChars, 0)
  const totalChunks = documents.reduce((sum, doc) => sum + doc.totalSections, 0)

  const smartChunks = Math.ceil(totalChunks * SMART_KEEP_RATIO)
  const fullChunks = totalChunks

  const smartTokens = smartChunks * SMART_TOKENS_PER_CHUNK
  const fullTokens = fullChunks * FULL_TOKENS_PER_CHUNK

  const round2 = (value: number): number => Math.round(value * 100) / 100
  const clampSeconds = (value: number, min: number, max: number): number =>
    Math.round(Math.min(max, Math.max(min, value)))

  return {
    totalDocuments,
    totalChars,
    totalChunks,
    smart: {
      tokens: smartTokens,
      costCny: round2(Math.max(SMART_COST_FLOOR, (smartTokens / 1_000_000) * PRICE_PER_MILLION_CNY)),
      estimatedSeconds: clampSeconds(12 + smartChunks * 0.5, 15, 25),
    },
    full: {
      tokens: fullTokens,
      costCny: round2(Math.max(FULL_COST_FLOOR, (fullTokens / 1_000_000) * PRICE_PER_MILLION_CNY)),
      estimatedSeconds: clampSeconds(25 + fullChunks * 1.0, 40, 70),
    },
  }
}

/**
 * 按用户选定模式生成分层全息知识图谱并返回完整图谱数据。
 *
 * 恒定由前端弹窗确认后主动触发（不再静默偷跑消耗 Token）：
 *   - local_fast：纯本地 Jaccard 启发式关联，0 Token，秒级完成；
 *   - ai_smart  ：本地过滤约 40% 噪音段落后，并发调用模型抽取核心考点关联；
 *   - ai_full   ：全量分块并发调用模型穷尽抽取微观实体与关系。
 *
 * 分层推演（并发 4 批，逐批广播进度）：
 *   - 单文件（documents.length === 1）：buildIntraDocumentGraph，推演大章之间的递进因果逻辑；
 *   - 多文件（documents.length >= 2）：buildHierarchicalMultiDocumentGraph，各文档内部骨架 + 跨文档知识映射。
 * 模型失败或无产出时自动降级为本地启发式关联，永不阻断界面。
 */
export async function generateKnowledgeGraph(
  sessionId: string,
  mode: KnowledgeGraphGenerationMode = 'ai_smart',
  onProgress?: (event: StudyGraphProgressEvent) => void,
): Promise<KnowledgeGraphData> {
  const documents = listStudyDocuments(sessionId)
  let edges: KnowledgeGraphEdge[] = []

  const reporter: GraphProgressReporter | undefined = onProgress
    ? (progress) => onProgress({ sessionId, ...progress })
    : undefined

  if (documents.length >= 1) {
    if (documents.length === 1) {
      // 场景 1：单文档内部大章与知识群因果推演
      edges = await buildIntraDocumentGraph(documents[0]!, mode, reporter)
    } else {
      // 场景 2：多文档分层全息推演（各文档内部骨架 + 跨文档知识映射）
      edges = await buildHierarchicalMultiDocumentGraph(documents, mode, reporter)
    }

    // 推演完成信号（100%）
    emitGraphProgress(reporter, 1, 1, '知识网络构建完成')

    try {
      // 写入前确保目录存在（getStudySessionDir 默认纯路径解析、无创建副作用）
      const cachePath = join(getStudySessionDir(sessionId, { create: true }), 'knowledge-graph.json')
      writeJsonFileAtomic(cachePath, { documents: [], edges, updatedAt: Date.now() })
    } catch (error) {
      console.warn('[AI速课堂] 图谱缓存写入失败:', error)
    }
  }

  return { documents, edges, updatedAt: Date.now() }
}

/** 读取已缓存的图谱关联边（无缓存返回空数组，供界面首帧快速渲染） */
export function readCachedGraphEdges(sessionId: string): KnowledgeGraphEdge[] {
  try {
    const cachePath = join(getStudySessionDir(sessionId), 'knowledge-graph.json')
    const cached = readJsonFileSafe<{ edges?: KnowledgeGraphEdge[] }>(cachePath)
    return Array.isArray(cached?.edges) ? cached.edges : []
  } catch {
    return []
  }
}

/**
 * 新手引导：为演示课堂预置精良的思维导图、抽认卡与自测题工件（首创即落盘）。
 */
function seedDemoAiClassArtifacts(sessionId: string): void {
  try {
    const existing = getMindmap(sessionId)
    if (existing) return

    const now = Date.now()
    const mindmapId = 'demo-honglou-mindmap'
    const flashcardDeckId = 'demo-honglou-flashcards'
    const quizSessionId = 'demo-honglou-quiz'

    // 1. 思维导图
    saveMindmap(sessionId, {
      id: mindmapId,
      title: '《红楼梦》前五回核心架构与伏线网络',
      sourceDocs: [DEMO_NOVEL_FILE_NAME],
      createdAt: now,
      root: {
        id: 'root',
        label: '《红楼梦》前五回纲领',
        children: [
          {
            id: 'c1',
            label: '神话源起与宿命',
            notes: '女娲补天遗石 / 绛珠仙草与神瑛侍者还泪之约',
            children: [
              { id: 'c1-1', label: '大荒山无稽崖青埂峰' },
              { id: 'c1-2', label: '太虚幻境与警幻仙姑' },
            ],
          },
          {
            id: 'c2',
            label: '现实根基：贾府与四大家族',
            notes: '门子葫芦案引出贾、史、王、薛四大家族护官符',
            children: [
              { id: 'c2-1', label: '贾不假白玉为堂金做马' },
              { id: 'c2-2', label: '阿房宫三百里住不下金陵一个史' },
            ],
          },
          {
            id: 'c3',
            label: '主线人物命运伏线',
            notes: '第五回太虚幻境金陵十二钗图册判词与红楼梦引子十二支曲',
            children: [
              { id: 'c3-1', label: '玉带林中挂，金簪雪里埋' },
              { id: 'c3-2', label: '凡鸟偏从末世来，都知爱慕此生才' },
            ],
          },
        ],
      },
    })

    // 2. 抽认卡
    saveFlashcardDeck(sessionId, {
      id: flashcardDeckId,
      title: '《红楼梦》核心考点抽认卡',
      difficulty: 'medium',
      mode: 'standard',
      createdAt: now,
      cards: [
        {
          id: 'fc-1',
          front: '《红楼梦》中「护官符」所指的四大家族分别是什么？',
          back: '贾（贾不假）、史（保龄侯）、王（统领县官）、薛（珍珠如土）。',
          topic: '四大家族',
          fsrs: createInitialFsrs(),
        },
        {
          id: 'fc-2',
          front: '「玉带林中挂，金簪雪里埋」分别暗示了哪两位主角的命运？',
          back: '林黛玉（玉带林倒读）与薛宝钗（雪里埋金簪）。',
          topic: '金陵判词',
          fsrs: createInitialFsrs(),
        },
        {
          id: 'fc-3',
          front: '第五回中贾宝玉游览太虚幻境时，警幻仙子引导他看的是什么册子？',
          back: '《金陵十二钗正册》、《金陵十二钗副册》、《金陵十二钗又副册》。',
          topic: '太虚图册',
          fsrs: createInitialFsrs(),
        },
      ],
    })

    // 3. 自测练习
    saveQuiz(sessionId, {
      id: quizSessionId,
      title: '《红楼梦》前五回精读自测卷',
      totalQuestions: 2,
      difficulty: 'medium',
      completed: false,
      score: 0,
      estimatedTheta: 0,
      createdAt: now,
      questions: [
        {
          id: 'q-1',
          type: 'single',
          question: '「都道是金玉良姻，俺只念木石前盟」中的「木石前盟」指的是谁与谁的渊源？',
          options: [
            { key: 'A', text: '神瑛侍者与绛珠仙草（贾宝玉与林黛玉）' },
            { key: 'B', text: '贾宝玉与薛宝钗' },
            { key: 'C', text: '甄士隐与贾雨村' },
            { key: 'D', text: '贾琏与王熙凤' },
          ],
          answer: ['A'],
          explanation: '前世为灵河岸上神瑛侍者以甘露灌溉绛珠仙草，今世以眼泪偿还。',
          sourceTrace: '《红楼梦》第一回至第五回判词与曲子',
        },
        {
          id: 'q-2',
          type: 'single',
          question: '林黛玉初进贾府时，王熙凤出场的典型动作与特征是什么？',
          options: [
            { key: 'A', text: '未见其人，先闻其声：「我来迟了，不曾迎接远客！」' },
            { key: 'B', text: '悄悄从屏风后走出，低头垂泪' },
            { key: 'C', text: '严厉斥责丫鬟婆子失礼' },
            { key: 'D', text: '手捧茶盘侍立在贾母身侧' },
          ],
          answer: ['A'],
          explanation: '曹雪芹以此极写凤姐在贾府的特殊地位与张扬个性。',
          sourceTrace: '《红楼梦》第三回金陵城起复贾雨村 荣国府收养林黛玉',
        },
      ],
    })

    // 4. 保存 Tabs
    saveTabs(sessionId, [
      createHomeTab(),
      { id: 'tab-mm', type: 'mindmap', title: '思维导图', closable: true, data: { mindmapId } },
      { id: 'tab-fc', type: 'flashcard', title: '抽认卡', closable: true, data: { flashcardDeckId } },
      { id: 'tab-qz', type: 'quiz', title: '自测练习', closable: true, data: { quizSessionId } },
    ], 'home')
  } catch (error) {
    console.warn('[AI速课堂] 预置演示工件失败:', sessionId, error)
  }
}
