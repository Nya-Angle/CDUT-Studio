/**
 * D1 作者态草稿的本地不可变修订记录。
 * revision 和发布 TemplateVersion.version 是两条独立轴；不复写历史草稿，也不发布模板。
 */
import { createHash } from 'node:crypto'
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewAuthoringWorkspaceV1 } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { validateReviewAuthoringV1 } from './review-authoring-v1'

const SAFE_ID = /^[a-z][a-z0-9-]{0,79}$/
const hash = (value: unknown): string => createHash('sha256').update(JSON.stringify(value)).digest('hex')

export interface ReviewAuthoringRevisionV1 {
  workspace: ReviewAuthoringWorkspaceV1
  authorId: string
  recordedAt: string
  digest: string
  parentDigest?: string
}

function root(id: string): string {
  if (!SAFE_ID.test(id)) throw new Error('作者态工作区 ID 不合法')
  return join(getConfigDir(), 'review-authoring-v1', id)
}
const filename = (id: string, revision: number): string => join(root(id), 'revisions', revision + '.json')

function validateEnvelope(record: ReviewAuthoringRevisionV1): void {
  if (!record || !record.workspace || record.digest !== hash(record.workspace)) {
    throw new Error('作者态历史修订内容摘要不匹配')
  }
  const problems = validateReviewAuthoringV1(record.workspace)
  if (problems.length) throw new Error('作者态历史修订数据校验失败：' + problems.join('；'))
}

/**
 * 读取历史修订必须核对 1..N 的完整父摘要链：遗漏、断链、伪造 parentDigest
 * 均拒绝读取与继续写入。仅防本地非预期篡改，不提供外部攻击者级别的数字签名。
 */
export function getReviewAuthoringRevisionV1(id: string, revision?: number): ReviewAuthoringRevisionV1 | undefined {
  const dir = join(root(id), 'revisions')
  if (!existsSync(dir)) return undefined
  const revisions = readdirSync(dir).filter((value) => /^[1-9]\d*\.json$/.test(value))
    .map((name) => Number(name.slice(0, -5))).filter((n) => Number.isSafeInteger(n))
    .sort((a, b) => a - b)
  const selected = revision ?? revisions.at(-1)
  if (!selected || !revisions.includes(selected)) return undefined
  let previous: ReviewAuthoringRevisionV1 | undefined
  for (let current = 1; current <= selected; current++) {
    if (!revisions.includes(current)) throw new Error('AUTHORING_HISTORY_BROKEN: 历史修订缺失：' + id + '@' + current)
    let record: ReviewAuthoringRevisionV1
    try { record = JSON.parse(readFileSync(filename(id, current), 'utf8')) as ReviewAuthoringRevisionV1 }
    catch { throw new Error('AUTHORING_HISTORY_BROKEN: 历史修订不可读取或 JSON 损坏：' + id + '@' + current) }
    validateEnvelope(record)
    if (record.workspace.workspaceId !== id || record.workspace.revision !== current) {
      throw new Error('AUTHORING_HISTORY_BROKEN: 历史修订所属工作区或修订号不匹配：' + id + '@' + current)
    }
    if (current === 1 ? record.parentDigest !== undefined : record.parentDigest !== previous?.digest) {
      throw new Error('AUTHORING_HISTORY_BROKEN: 父版本摘要链不匹配：' + id + '@' + current)
    }
    previous = record
  }
  return previous
}

/**
 * 由独立 revision 文件追加保存；用 wx+lock 拒绝覆盖历史与竞态。
 * 缺少 expectedRevision 时不允许静默创建新的作者态版本。
 */
export function saveReviewAuthoringRevisionV1(
  workspace: ReviewAuthoringWorkspaceV1,
  expectedRevision: number,
  authorId: string,
): ReviewAuthoringRevisionV1 {
  if (!SAFE_ID.test(workspace.workspaceId)) throw new Error('作者态工作区 ID 不合法')
  if (!authorId.trim()) throw new Error('保存作者态必须注明操作者')
  const dir = root(workspace.workspaceId)
  mkdirSync(join(dir, 'revisions'), { recursive: true })
  const lock = join(dir, 'edit.lock')
  const fd = openSync(lock, 'wx')
  try {
    const prior = getReviewAuthoringRevisionV1(workspace.workspaceId)
    const current = prior?.workspace.revision ?? 0
    if (current !== expectedRevision || workspace.revision !== expectedRevision + 1) {
      throw new Error('AUTHORING_REVISION_CONFLICT: 当前修订号为 ' + current)
    }
    const problems = validateReviewAuthoringV1(workspace)
    if (problems.length) throw new Error('AUTHORING_INVALID: ' + problems.join('；'))
    const record: ReviewAuthoringRevisionV1 = {
      workspace: structuredClone(workspace), authorId, recordedAt: new Date().toISOString(),
      digest: hash(workspace), ...(prior ? { parentDigest: prior.digest } : {}),
    }
    // 同一版本永远不覆盖；系统崩溃后写入成功的 revision 已是不可变历史。
    writeFileSync(filename(workspace.workspaceId, workspace.revision), JSON.stringify(record, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' })
    return record
  } finally {
    closeSync(fd)
    unlinkSync(lock)
  }
}

/** 显式显示草稿改动：审核责任及来源发生变更均归入内容差异。 */
export function diffReviewAuthoringRevisionsV1(before: ReviewAuthoringWorkspaceV1, after: ReviewAuthoringWorkspaceV1): {
  oldRevision: number
  newRevision: number
  changedModules: string[]
  changedTemplates: string[]
  changedSources: string[]
  changedBindings: string[]
  changedSharedModuleLocks: string[]
} {
  if (before.workspaceId !== after.workspaceId) throw new Error('不能比较不同作者态工作区')
  const changed = <T>(left: T[], right: T[], key: (item: T) => string): string[] => {
    const l = new Map(left.map((item) => [key(item), hash(item)]))
    const r = new Map(right.map((item) => [key(item), hash(item)]))
    return [...new Set([...l.keys(), ...r.keys()])].filter((item) => l.get(item) !== r.get(item)).sort()
  }
  return {
    oldRevision: before.revision, newRevision: after.revision,
    changedModules: changed(before.definitions.modules, after.definitions.modules, (mod) => mod.moduleId + '@' + mod.version),
    changedTemplates: changed(before.definitions.templates, after.definitions.templates, (template) => template.templateId + '@' + template.version),
    changedSources: changed(before.sources, after.sources, (source) => source.sourceId),
    changedBindings: changed(before.sourceBindings, after.sourceBindings, (link) => link.checkId),
    changedSharedModuleLocks: changed(before.sharedModuleLocks ?? [], after.sharedModuleLocks ?? [],
      (lock) => lock.moduleId + '@' + lock.version),
  }
}
