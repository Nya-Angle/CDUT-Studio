/**
 * 案卷存储
 *
 * 内容审核专区的本地持久化层：`getConfigDir()/review-cases/{caseId}/`。
 * - `case.json` 案卷本体（原子写：先写 `.tmp` 再 rename 覆盖）
 * - `runs/{runId}.json` 审核运行记录（同样原子写）
 *
 * 安全约束：caseId / runId 直接参与路径拼接，必须先过 `assertSafeId`
 * （只允许 [a-zA-Z0-9_-]），否则视为路径穿越攻击直接 throw。
 */

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewCase, ReviewCaseSummary, ReviewRun } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { readAggregate } from './case-store-v2'
import { nativeWorkspaceProjectionV3 } from './native-workspace-case-v3'

/** 演示案卷固定 ID（载入/重审/报告锚定同一个 ID） */
export const DEMO_CASE_ID = 'demo-zhangsan-2026'

/** 安全 ID 白名单：字母数字 + 连字符 + 下划线，杜绝路径穿越 */
const SAFE_ID_RE = /^[a-zA-Z0-9_-]+$/

/**
 * 校验案卷/运行 ID 是否安全。
 *
 * @throws ID 含路径分隔符、点号等任何非法字符时抛出中文错误
 */
export function assertSafeId(id: string): void {
  if (typeof id !== 'string' || id.length === 0 || !SAFE_ID_RE.test(id)) {
    throw new Error(`无效的 ID: ${JSON.stringify(String(id))}（仅允许字母、数字、连字符与下划线）`)
  }
}

/** 案卷存储根目录（getConfigDir 会自动创建配置目录） */
export function getReviewCasesDir(): string {
  const dir = join(getConfigDir(), 'review-cases')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

/** 案卷目录：{review-cases}/{caseId}/ */
function getCaseDir(caseId: string): string {
  assertSafeId(caseId)
  return join(getReviewCasesDir(), caseId)
}

/** 案卷本体路径 */
function getCaseFilePath(caseId: string): string {
  return join(getCaseDir(caseId), 'case.json')
}

/** 运行记录目录（只读语义：不建目录，供读取路径使用，避免幽灵目录） */
function getRunsDirReadOnly(caseId: string): string {
  return join(getCaseDir(caseId), 'runs')
}

/** 运行记录目录（写语义：写入前确保目录存在） */
function ensureRunsDir(caseId: string): string {
  const dir = getRunsDirReadOnly(caseId)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

/**
 * 原子写 JSON：写 `{目标}.tmp` 再 rename 覆盖目标。
 *
 * 中断只会留下 `.tmp` 残片，绝不出现写了一半的 `case.json`。
 */
function writeJsonAtomic(filePath: string, data: unknown): void {
  const tmpPath = `${filePath}.tmp`
  writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmpPath, filePath)
}

/** 读取 JSON；文件缺失返回 undefined，损坏记 warn 并返回 undefined（不吞栈） */
function readJsonFile<T>(filePath: string): T | undefined {
  if (!existsSync(filePath)) return undefined
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as T
  } catch (error) {
    console.warn(`[审核专区] 案卷文件解析失败，已跳过: ${filePath}`, error)
    return undefined
  }
}

/** 列出 runs/ 下可解析的运行文件名（仅 .json，字典序） */
function listRunFileNames(caseId: string): string[] {
  const runsDir = getRunsDirReadOnly(caseId)
  if (!existsSync(runsDir)) return []
  try {
    return readdirSync(runsDir)
      .filter((name) => name.endsWith('.json'))
      .sort()
  } catch (error) {
    console.warn(`[审核专区] 读取运行目录失败: ${runsDir}`, error)
    return []
  }
}

/**
 * 取某案卷最近一次运行的状态。
 *
 * 「最近」按 runs/ 目录下文件名字典序最大者（runId 形如 `run-{时间戳}-{随机}`，
 * 时间戳定长所以字典序即时间序）。读不到任何运行 → undefined。
 */
function readLastRunStatus(caseId: string): ReviewRun['status'] | undefined {
  const names = listRunFileNames(caseId)
  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i]!
    const run = readJsonFile<ReviewRun>(join(getRunsDirReadOnly(caseId), name))
    if (run && typeof run.status === 'string') return run.status
  }
  return undefined
}

/**
 * 列出全部已存储案卷（摘要，不含重文档）。
 *
 * 读不到 / 解析失败的案卷逐个 console.warn 后跳过，不让单个坏文件拖垮列表。
 */
export function listCases(): ReviewCaseSummary[] {
  const root = getReviewCasesDir()
  let entries: string[]
  try {
    entries = readdirSync(root)
  } catch (error) {
    console.warn(`[审核专区] 读取案卷目录失败: ${root}`, error)
    return []
  }

  const summaries: ReviewCaseSummary[] = []
  for (const name of entries) {
    // 跳过非目录与临时文件
    if (name.endsWith('.tmp')) continue
    // Old three-column selector remains a READ-ONLY projection for genuine
    // native-first Cases, never a stale V1 shadow nor a second business writer.
    let reviewCase: ReviewCase | undefined
    let nativeAggregate: ReturnType<typeof readAggregate>
    try {
      if (isLegacyProjectionAllowed(name)) {
        const caseFile = join(root, name, 'case.json')
        if (!existsSync(caseFile)) continue
        reviewCase = readJsonFile<ReviewCase>(caseFile)
      } else {
        nativeAggregate = readAggregate(name)
        reviewCase = nativeWorkspaceProjectionV3(nativeAggregate)
      }
    } catch { continue }
    if (!reviewCase || reviewCase.id !== name) continue

    // ASSET-06：三栏兼容投影会刻意隐藏 attachment 等角色；管理列表不能拿
    // “当前可显示数”冒充案卷真实有效材料数。原生案卷直接数聚合。
    const activeDocumentCount = nativeAggregate
      ? nativeAggregate.caseV2.documents.filter((document) => document.active !== false).length
      : (reviewCase.documents?.length ?? 0)

    summaries.push({
      id: reviewCase.id,
      title: reviewCase.title,
      type: reviewCase.type,
      applicant: reviewCase.applicant,
      academicYear: reviewCase.academicYear,
      updatedAt: reviewCase.updatedAt,
      isDemo: reviewCase.isDemo,
      documentCount: activeDocumentCount,
      lastRunStatus: readLastRunStatus(reviewCase.id),
      // 列表展示领域标签（未标注的历史案卷由 UI 回落缺省包名）
      domainPackId: reviewCase.domainPackId,
    })
  }

  // updatedAt 倒序：最近更新的案卷排前面
  summaries.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0))
  return summaries
}

/** 读取单个案卷；不存在或不可读返回 undefined */
export function getCase(caseId: string): ReviewCase | undefined {
  assertSafeId(caseId)
  // No legacy shadow is ever returned for native-first Case; the returned
  // object is a read-only in-memory compatibility shape from state.v2.json.
  if (!isLegacyProjectionAllowed(caseId)) {
    const projected = nativeWorkspaceProjectionV3(readAggregate(caseId))
    return projected?.id === caseId ? projected : undefined
  }
  const filePath = getCaseFilePath(caseId)
  if (!existsSync(filePath)) return undefined

  const reviewCase = readJsonFile<ReviewCase>(filePath)
  if (!reviewCase) {
    console.warn(`[审核专区] 案卷读取失败（文件损坏）: ${filePath}`)
    return undefined
  }
  return reviewCase
}

/**
 * A native-first V2 aggregate is never writable through legacy case.json.
 * Historical migrated legacy cases retain their compatibility updates.
 * A corrupt or unreadable V2 state always fails closed.
 */
function isLegacyProjectionAllowed(caseId: string): boolean {
  const statePath = join(getCaseDir(caseId), 'state.v2.json')
  if (!existsSync(statePath)) return true
  const state = readAggregate(caseId)
  // Malformed-but-valid JSON also fails closed. Never trust a cast-only store.
  if (!state || !state.caseV2 || !Array.isArray(state.receiptLog)) return false
  // Even a migrated Case is read-only while its native aggregate is archived.
  return state.caseV2.stage !== 'archived' &&
    state.receiptLog.some(receipt => receipt?.type === 'EnsureReviewWorkspaceAggregate')
}

function assertWritableLegacyProjection(caseId: string): void {
  if (!isLegacyProjectionAllowed(caseId)) {
    throw new Error('原生审核案卷禁止通过旧版案卷写入口修改；请使用可信 V2 业务命令')
  }
}

/** 保存案卷（原子写；目录不存在则创建） */
export function saveCase(reviewCase: ReviewCase): void {
  assertWritableLegacyProjection(reviewCase.id)
  const filePath = getCaseFilePath(reviewCase.id)
  mkdirSync(getCaseDir(reviewCase.id), { recursive: true })
  try {
    writeJsonAtomic(filePath, reviewCase)
  } catch (error) {
    console.error(`[审核专区] 保存案卷失败: ${filePath}`, error)
    throw new Error(`保存案卷失败: ${reviewCase.id}`)
  }
}

// ===== M0/H05：逐案串行写 + 修订号 + 定向 patch =====

/** 每案写队列：同一案卷的读改写串行执行，消除「A/B 同时读 v0 → 后写者丢前者字段」的竞态 */
const caseWriteQueues = new Map<string, Promise<unknown>>()

/**
 * 在案卷写队列中串行执行一个异步任务。
 * 队列按 caseId 独立：不同案卷并行、同案卷严格顺序。
 */
function enqueueCaseWrite<T>(caseId: string, task: () => Promise<T> | T): Promise<T> {
  const previous = caseWriteQueues.get(caseId) ?? Promise.resolve()
  const next = previous.then(task, task)
  // 队尾吞错不影响后续任务（任务自身负责抛错语义）
  caseWriteQueues.set(
    caseId,
    next.catch(() => undefined),
  )
  return next
}

/** 更新冲突错误（渲染层据此提示「案卷已更新，请刷新后重试」） */
export class CaseRevisionConflictError extends Error {
  constructor(
    public readonly caseId: string,
    public readonly expectedRevision: number,
    public readonly currentRevision: number,
  ) {
    super(`案卷修订冲突: ${caseId} 期望 revision=${expectedRevision}，当前 revision=${currentRevision}`)
    this.name = 'CaseRevisionConflictError'
  }
}

/**
 * 定向更新案卷（M0/H05）：
 * 在该案卷的写队列内「读最新 → 校验 expectedRevision → 应用 patch → revision+1 原子写回」。
 *
 * - patch 返回 null 表示本次无需变更（不动 revision 不写盘）。
 * - expectedRevision 缺省视为 0：仅当盘上 revision 也是 0/缺省时接受（旧格式案卷首次写回）；
 *   已带 revision 的案卷必须显式传入调用方持有的值，防止用调用前快照覆盖新字段。
 * - 主进程内部既有调用点（大纲/识别/导入/设置）读取即写，统一传「读到的 revision」由队列保证新鲜；
 *   跨进程的乐观并发校验由渲染层随后续批次接入 expectedRevision 完成。
 */
export function updateCase(
  caseId: string,
  patch: (latest: ReviewCase) => ReviewCase | null,
  options: { expectedRevision?: number; reason?: string } = {},
): Promise<ReviewCase> {
  assertSafeId(caseId)
  return enqueueCaseWrite(caseId, () => {
    // Queued updates and direct saves obey the same native write barrier.
    assertWritableLegacyProjection(caseId)
    const latest = getCase(caseId)
    if (!latest) throw new Error(`案卷不存在: ${caseId}`)
    const currentRevision = latest.revision ?? 0
    if (options.expectedRevision !== undefined && options.expectedRevision !== currentRevision) {
      throw new CaseRevisionConflictError(caseId, options.expectedRevision, currentRevision)
    }
    const patched = patch(latest)
    if (!patched) return latest
    const updated: ReviewCase = {
      ...patched,
      revision: currentRevision + 1,
      updatedAt: new Date().toISOString(),
    }
    saveCase(updated)
    if (options.reason) console.log(`[审核专区] 案卷已更新(rev=${updated.revision}): ${caseId} — ${options.reason}`)
    return updated
  })
}

/**
 * 审核输入指纹（M0/H06）：对影响审核判定的业务输入做稳定内容哈希。
 *
 * 覆盖：领域包（评分参数）、规则包（含大纲内容与确认态）、文档（含块文本与解析状态）、
 * 申报事项（字段值/等级/日期/分数）、证明识别结果、待审主体文档集合。
 * 刻意排除：updatedAt/createdAt/revision 等元数据——同数量下改日期、等级、替换文件也能被检出。
 */
export function computeCaseInputHash(reviewCase: ReviewCase): string {
  const fingerprint = {
    domainPackId: reviewCase.domainPackId ?? 'comprehensive-assessment',
    reviewTemplate: reviewCase.reviewTemplate ?? null,
    manualRules: (reviewCase.manualRules ?? []).map((rule) => ({ id: rule.id, title: rule.title, requirement: rule.requirement })),
    subjectDocumentIds: reviewCase.subjectDocumentIds ?? null,
    rulePacks: reviewCase.rulePacks.map((pack) => ({
      id: pack.id,
      version: pack.version,
      academicYear: pack.academicYear,
      confirmed: pack.confirmed,
      outline: pack.outline.map((item) => ({ id: item.id, category: item.category, title: item.title, summary: item.summary, anchors: item.anchors })),
    })),
    documents: reviewCase.documents.map((doc) => ({
      id: doc.id,
      role: doc.role,
      fileName: doc.fileName,
      parseStatus: doc.parseStatus,
      blocks: doc.blocks.map((block) => block.text),
    })),
    items: reviewCase.items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      level: item.level ?? null,
      declaredScore: item.declaredScore,
      activityDate: item.activityDate ?? null,
      organizer: item.organizer ?? null,
      evidenceDocumentIds: item.evidenceDocumentIds,
      status: item.status,
    })),
    evidences: reviewCase.evidences.map((evidence) => ({
      documentId: evidence.documentId,
      recognizedFacts: evidence.recognizedFacts,
      recognizedLevel: evidence.recognizedLevel ?? null,
      parseStatus: evidence.parseStatus,
      linkedItemIds: evidence.linkedItemIds,
    })),
  }
  // 稳定序列化：对象键序固定（构造顺序确定），无需额外排序
  return createHash('sha1').update(JSON.stringify(fingerprint), 'utf-8').digest('hex')
}

/** 删除案卷（整目录 rm -rf；不存在时静默） */
export function deleteCase(caseId: string): void {
  const dir = getCaseDir(caseId)
  if (!existsSync(dir)) return
  // The original V1 delete removed the entire shared directory, including
  // the authoritative V2 aggregate, Receipts and retained evidence. Until a
  // C-owned archive/tombstone transaction exists, deleting such a Case from
  // legacy IPC is forbidden, even for a migrated V1 Case or corrupt V2 state.
  if (existsSync(join(dir, 'state.v2.json'))) {
    throw new Error('已有 V2 业务案卷禁止通过旧版删除入口清除；请使用正式案卷归档流程')
  }
  try {
    rmSync(dir, { recursive: true, force: true })
    console.log(`[审核专区] 已删除案卷: ${caseId}`)
  } catch (error) {
    console.error(`[审核专区] 删除案卷失败: ${caseId}`, error)
    throw new Error(`删除案卷失败: ${caseId}`)
  }
}

/** 保存一次审核运行（原子写 runs/{runId}.json） */
export function saveRun(caseId: string, run: ReviewRun): void {
  assertSafeId(run.id)
  const filePath = join(ensureRunsDir(caseId), `${run.id}.json`)
  try {
    writeJsonAtomic(filePath, run)
  } catch (error) {
    console.error(`[审核专区] 保存运行记录失败: ${filePath}`, error)
    throw new Error(`保存运行记录失败: ${run.id}`)
  }
}

/** 列出某案卷的全部运行记录（按 runId 字典序，即时间序升序） */
export function listRuns(caseId: string): ReviewRun[] {
  const names = listRunFileNames(caseId)
  const runs: ReviewRun[] = []
  for (const name of names) {
    const run = readJsonFile<ReviewRun>(join(getRunsDirReadOnly(caseId), name))
    if (run && typeof run.id === 'string') runs.push(run)
    else console.warn(`[审核专区] 运行记录不可读，已跳过: ${name}`)
  }
  return runs
}

/**
 * 载入演示案卷。
 *
 * 首次调用把 fixture 复制进案卷目录（此后运行期只读案卷目录）；
 * 已存在则直接读盘返回，保证 demo 的 ID/锚点跨会话稳定。
 */
export function loadDemoCase(): ReviewCase {
  const existing = getCase(DEMO_CASE_ID)
  if (existing) return existing

  const demoCase = buildDemoCase()
  saveCase(demoCase)
  console.log(`[审核专区] 已载入演示案卷: ${demoCase.id}（文档 ${demoCase.documents.length} / 条目 ${demoCase.items.length}）`)
  return demoCase
}
