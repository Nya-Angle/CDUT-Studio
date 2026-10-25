/**
 * 报告冻结快照与受众授权（T08/F16/EXPORT_REPORT_V2 共用的只读投影）
 *
 * 目的（RUN-02/21/31/32、JDG-12、UI-14/15、ASSET-10）：
 * - 选 Run 必须唯一且可解释：显式 runId > 决定绑定 Run > 最新 Run；排序带 id 兜底，
 *   不依赖 RunStore 的返回顺序。
 * - supersedes 只在同一 Run（同一输入哈希）内生效，跨 Run 的新裁定不能删除历史报告中的旧裁定。
 * - 报告受众由 Main 依据可信 actor 授予；Renderer 下拉不能自行提权。
 * - 导出内容绑定一个快照指纹（sha256），历史重导可核对“是否还是同一份快照”。
 * - 归档恢复代次（archiveCycle）随报告输出，恢复前的决定明确标注为历史。
 */
import { createHash } from 'node:crypto'
import type { BusinessDecision, CaseAggregateV2, ReviewRunV2, SubjectAdjudication } from '@profer/shared'

export type ReportAudience = 'student' | 'reviewer' | 'organizer'
export type ReportRunBasis = 'explicit' | 'decision' | 'latest'

export interface ReportRunSelection {
  run: ReviewRunV2 | null
  basis: ReportRunBasis | null
  /** true 表示该 Run 不是案卷最终决定的依据，报告只能作为历史/旁证使用 */
  historical: boolean
  reason: string
}

function byTimeThenId<T extends { at?: string; startedAt?: string; id: string }>(a: T, b: T): number {
  const left = a.at ?? a.startedAt ?? ''
  const right = b.at ?? b.startedAt ?? ''
  const diff = right.localeCompare(left)
  return diff !== 0 ? diff : b.id.localeCompare(a.id)
}

/** 最新业务决定：按时间排序后取最后一条，同一时刻用 id 兜底，避免依赖数组顺序。 */
export function latestReportDecision(decisions: BusinessDecision[]): BusinessDecision | null {
  return [...decisions].sort(byTimeThenId).at(-1) ?? null
}

/**
 * 选定报告 Run（RUN-02）。
 * 显式 runId 必须存在于该案卷的 Run 列表；决定绑定 Run 缺失时明确失败原因，不静默换用别的 Run。
 */
export function resolveReportRun(input: {
  runs: ReviewRunV2[]
  decisions: BusinessDecision[]
  requestedRunId?: string
}): ReportRunSelection {
  const { runs, decisions, requestedRunId } = input
  const decision = latestReportDecision(decisions)
  if (requestedRunId) {
    const run = runs.find((item) => item.id === requestedRunId) ?? null
    if (!run) return { run: null, basis: null, historical: false, reason: `所选运行 ${requestedRunId} 不属于该案卷或已不可用` }
    return {
      run,
      basis: 'explicit',
      historical: decision?.basedOnRunId !== run.id,
      reason: decision?.basedOnRunId === run.id
        ? '所选运行正是当前最终决定的依据运行'
        : '所选运行不是当前最终决定的依据，按历史/旁证快照导出',
    }
  }
  if (decision) {
    const run = runs.find((item) => item.id === decision.basedOnRunId) ?? null
    if (run) {
      return { run, basis: 'decision', historical: false, reason: '按当前最终决定绑定的运行导出' }
    }
    return {
      run: null,
      basis: null,
      historical: false,
      reason: `最终决定引用的运行 ${decision.basedOnRunId} 已不可用，拒绝改用其他运行代替`,
    }
  }
  const run = [...runs].sort(byTimeThenId)[0] ?? null
  return run
    ? { run, basis: 'latest', historical: false, reason: '案卷尚无最终决定，导出最新一次技术运行（不构成结论）' }
    : { run: null, basis: null, historical: false, reason: '该案卷还没有任何审核运行' }
}

export interface ReportAdjudicationSelection {
  current: SubjectAdjudication[]
  /** 被同一 Run 内后续裁定替代的历史记录数（跨 Run 的 supersedes 不计入） */
  supersededInRun: number
  /** 因属于其他 Run 而未参与本次报告的历史记录数 */
  excludedOtherRun: number
}

/**
 * 事项裁定的 Run 作用域投影（RUN-21）。
 * supersedes 只在本 Run（且输入哈希一致或未记录哈希）内解析；其他 Run 的裁定既不覆盖、
 * 也不被本 Run 报告采纳，因此重导历史 Run 不会丢当时存在的裁定。
 */
export function resolveReportAdjudications(input: {
  adjudications: SubjectAdjudication[]
  runId: string
  inputHash?: string
}): ReportAdjudicationSelection {
  const { adjudications, runId, inputHash } = input
  const sameRun = adjudications.filter((record) =>
    record.basedOnRunId === runId && (!inputHash || !record.inputHash || record.inputHash === inputHash))
  const superseded = new Set(sameRun.flatMap((record) =>
    record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
  const current = sameRun
    .filter((record) => !superseded.has(record.id))
    .sort((a, b) => a.subjectId.localeCompare(b.subjectId) || a.id.localeCompare(b.id))
  return {
    current,
    supersededInRun: sameRun.length - current.length,
    excludedOtherRun: adjudications.filter((record) => record.basedOnRunId !== runId).length,
  }
}

export interface ReportActor {
  actorSource?: string
  actorId?: string
  role?: string
}

export interface ReportAudienceGrant {
  requested: ReportAudience
  /** 实际允许输出的受众（未授权时降级为 student） */
  audience: ReportAudience
  granted: boolean
  reason: string
}

const AUDIENCE_RANK: Record<ReportAudience, number> = { student: 0, reviewer: 1, organizer: 2 }

/**
 * 报告受众授权（RUN-31 / UI-15）。
 * 只有 Main 传入的可信 actor 才能获得 reviewer/organizer 视图；Renderer 自报角色一律降级为学生版。
 */
export function resolveReportAudience(input: {
  requested: ReportAudience
  actor?: ReportActor | null
}): ReportAudienceGrant {
  const requested = input.requested
  const actor = input.actor
  if (!actor || !actor.actorSource || actor.actorSource === 'unknown') {
    return {
      requested,
      audience: 'student',
      granted: requested === 'student',
      reason: requested === 'student' ? '学生版无需额外授权' : '缺少 Main 可信操作者，内部视图未获授权，已降级为学生版',
    }
  }
  if (actor.actorSource === 'agent' || actor.actorSource === 'mock') {
    return {
      requested,
      audience: 'student',
      granted: requested === 'student',
      reason: `${actor.actorSource} 操作者不具备内部报告受众资格，已降级为学生版`,
    }
  }
  const role = (actor.role ?? '').trim()
  const allowedRank = role === 'organizer' ? AUDIENCE_RANK.organizer
    : role === 'reviewer' ? AUDIENCE_RANK.reviewer
      : AUDIENCE_RANK.student
  if (AUDIENCE_RANK[requested] <= allowedRank) {
    return { requested, audience: requested, granted: true, reason: `操作者角色 ${role || '未记录'} 获得 ${requested} 视图` }
  }
  return {
    requested,
    audience: 'student',
    granted: false,
    reason: `操作者角色 ${role || '未记录'} 不足以查看 ${requested} 视图，已降级为学生版`,
  }
}

export interface ReportCaseCycle {
  /** 已完成的归档轮次（含当前正在恢复的这一轮） */
  archiveCycle: number
  archivedAt?: string
  restoredAt?: string
  stage: string
}

/** 归档恢复代次（ASSET-10）：恢复后历史任务/决定仍保留，但必须能被报告识别为历史。 */
export function resolveReportCaseCycle(aggregate: CaseAggregateV2): ReportCaseCycle {
  const history = aggregate.caseArchiveHistory?.length ?? 0
  const archive = aggregate.caseArchive
  return {
    archiveCycle: history + (archive?.restoredAt ? 1 : 0),
    archivedAt: archive?.archivedAt,
    restoredAt: archive?.restoredAt,
    stage: aggregate.caseV2.stage,
  }
}

/** 决定是否早于最近一次恢复：早于恢复的决定只能作为历史记录展示。 */
export function isDecisionPreRestore(decision: { at: string }, cycle: ReportCaseCycle): boolean {
  return !!cycle.restoredAt && decision.at <= cycle.restoredAt
}

/** 报告快照指纹：同一案卷/运行/受众/投影内容必须得到同一指纹，历史重导可核对。 */
export function reportSnapshotDigest(projection: {
  caseId: string
  runId: string
  audience: ReportAudience
  json: string
}): string {
  return createHash('sha256')
    .update(JSON.stringify([projection.caseId, projection.runId, projection.audience, projection.json]), 'utf-8')
    .digest('hex')
}

/** 供 Renderer 展示的受众能力（仍需 Main 授予；此处只声明“可请求”，不是授权凭据）。 */
export function reportAudienceOptions(grant: ReportAudienceGrant): Array<{ audience: ReportAudience; enabled: boolean; reason: string }> {
  return (['student', 'reviewer', 'organizer'] as ReportAudience[]).map((audience) => ({
    audience,
    enabled: grant.granted && audience === grant.audience,
    reason: audience === grant.audience ? grant.reason : `需要 Main 授予 ${audience} 受众资格`,
  }))
}
