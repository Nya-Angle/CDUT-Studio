/**
 * RUN-01/02/04/05/07/09/14/22 的唯一业务 Run 合同（Main 侧纯函数）。
 *
 * 本模块不写盘、不建 Run、不授予业务权限，只回答三个问题：
 * 1. 哪份 Run 是一次「用户审核动作」的权威业务 Run；
 * 2. 它是否已冻结了可比较的身份（attemptId / planFingerprint / input hash）；
 * 3. 诊断运行（模板规则预览、旧图高级诊断）能否冒充当前业务 Run。
 *
 * 关键规则（对应 RUN-04）：选择只从**最新业务 attempt** 开始。最新 attempt
 * 失败/执行中/取消时，绝不回退到更早的成功 Run；诊断 Run 既不成为当前，
 * 也不阻断同一案卷的业务 Run 选择。
 */
import { createHash } from 'node:crypto'
import type { CaseAggregateV2, CanonicalPlan, ReviewRunV2 } from '@profer/shared'
import {
  assessT03RunAction, type T03RunGateResult, type T03TrustedRunEvidence,
} from './review-v3-core-t03-run-gate'

export type RunAuthorityKind = 'business-attempt' | 'stage-evidence' | 'diagnostic'

/** Pi 后台是普通「统一审核」的业务 attempt 所有者。 */
export const BUSINESS_PI_PREFIX = 'run-pi-'
/** T04 模板规则运行只作为同一 attempt 的阶段证据，不能成为当前业务 Run。 */
export const TEMPLATE_STAGE_PREFIX = 'run-tpl-'
/** 显式诊断前缀，供高级/候选入口使用。 */
export const DIAGNOSTIC_PREFIX = 'run-diag-'

/**
 * 旧 V2 RunGraph（`run-*`）曾是可产生业务结果的引擎，但其 ID 也覆盖
 * `run-tpl-*`/`run-diag-*`；先按显式前缀排除，再视为 business-attempt。
 */
export function classifyRunAuthority(run: Pick<ReviewRunV2, 'id'>): RunAuthorityKind {
  if (run.id.startsWith(DIAGNOSTIC_PREFIX) || run.id.startsWith(TEMPLATE_STAGE_PREFIX)) return 'diagnostic'
  if (run.id.startsWith(BUSINESS_PI_PREFIX)) return 'business-attempt'
  return 'business-attempt'
}

export interface RunAuthorityDecision {
  run?: ReviewRunV2
  kind: RunAuthorityKind
  /** 稳定、可展示的原因码，不依赖渲染层猜测。 */
  reason: string
  /** 被最新失败/执行中 attempt 阻断时的 RunId（用于 UI 明示）。 */
  blockedByRunId?: string
  t03?: T03RunGateResult
}

/** 旧式 stage-decision 的合成 `run@rev` 不是真实 Run 身份。 */
export function isSyntheticRunId(runId: string): boolean {
  return runId.startsWith('run@rev') || runId.trim().length === 0
}

/**
 * 一次业务 attempt 的冻结身份。planFingerprint 缺失时明确返回 undefined，
 * 不拿 input hash 冒充计划指纹（RUN-08）。
 */
export interface FrozenAttemptIdentity {
  attemptId: string
  caseId: string
  templateId: string
  templateVersion: number
  inputHash: string
  planFingerprint: string
}

export function freezeAttemptIdentity(
  run: Pick<ReviewRunV2, 'caseId' | 'templateId' | 'templateVersion' | 'inputManifest'>,
): FrozenAttemptIdentity | undefined {
  const inputHash = run.inputManifest?.hash
  const planFingerprint = run.inputManifest?.planFingerprint
  if (!inputHash || !planFingerprint || isSyntheticRunId(run.caseId)) return undefined
  const attemptId = createHash('sha256').update(JSON.stringify([
    run.caseId, run.templateId, run.templateVersion, inputHash, planFingerprint,
  ])).digest('hex')
  return {
    attemptId,
    caseId: run.caseId,
    templateId: run.templateId,
    templateVersion: run.templateVersion,
    inputHash,
    planFingerprint,
  }
}

/** 两份 Run 是否属于同一冻结 attempt（同案/模板/输入/计划）。 */
export function isSameAttempt(left: ReviewRunV2, right: ReviewRunV2): boolean {
  const a = freezeAttemptIdentity(left)
  const b = freezeAttemptIdentity(right)
  return !!a && !!b && a.attemptId === b.attemptId
}

/**
 * 诊断隔离：诊断运行永远不得被当作当前业务 Run。
 * 返回 false 时调用方必须展示为诊断结果，而不是本轮审核结论。
 */
export function isCurrentBusinessRun(run: Pick<ReviewRunV2, 'id'>): boolean {
  return classifyRunAuthority(run) === 'business-attempt' && !isSyntheticRunId(run.id)
}

/** 从已冻结 CanonicalPlan 派生 Main 可信的 CheckId 清单（与 F07 同一公式）。 */
export function expectedCheckIdsFromPlan(plan: CanonicalPlan | undefined): string[] | undefined {
  if (!plan) return undefined
  return plan.bindings.map((binding) => 't04:' + JSON.stringify([
    binding.checkKey, binding.targetKey, binding.objectKey, binding.subjectId,
  ]))
}

/**
 * 由 Main 现有 freshness 判定构造 T03 证据，不接受渲染层声明。
 * `stale` 由调用方传入 `isWorkspaceRunStaleV2` 的结果。
 */
export function buildT03Evidence(input: {
  aggregate: CaseAggregateV2
  run: ReviewRunV2
  stale: boolean
}): T03TrustedRunEvidence {
  return {
    inputSnapshotFresh: !input.stale,
    ...(input.run.inputManifest?.planFingerprint
      ? { runPlanFingerprint: input.run.inputManifest.planFingerprint } : {}),
    ...(expectedCheckIdsFromPlan(input.aggregate.canonicalPlan)
      ? { expectedCheckIds: expectedCheckIdsFromPlan(input.aggregate.canonicalPlan) } : {}),
  }
}

/**
 * 选择当前权威业务 Run（RUN-02/04/09/14/22）。
 *
 * - 只看 `business-attempt`；诊断 Run 被忽略且不阻断；
 * - 取最新业务 attempt：若它不是 completed/partially-completed，返回
 *   `latest-attempt-*` 且不带 run —— 禁止回退旧成功；
 * - 最新 attempt 还必须通过 T03 的 Run 身份/输入/计划绑定核验。
 */
export function resolveCurrentBusinessRun(input: {
  aggregate: CaseAggregateV2
  runs: readonly ReviewRunV2[]
  stale: (run: ReviewRunV2) => boolean
}): RunAuthorityDecision {
  const attempts = input.runs
    .filter((run) => classifyRunAuthority(run) === 'business-attempt')
    .filter((run) => !isSyntheticRunId(run.id))
    .slice()
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt))

  const latest = attempts[0]
  if (!latest) return { kind: 'business-attempt', reason: 'no-business-run' }

  if (latest.status === 'queued' || latest.status === 'running') {
    return {
      kind: 'business-attempt', reason: 'latest-attempt-in-progress',
      blockedByRunId: latest.id,
    }
  }
  if (latest.status !== 'completed' && latest.status !== 'partially-completed') {
    return {
      kind: 'business-attempt', reason: `latest-attempt-${latest.status}`,
      blockedByRunId: latest.id,
    }
  }

  const t03 = assessT03RunAction({
    aggregate: input.aggregate,
    run: latest,
    action: 'final-reject',
    evidence: buildT03Evidence({ aggregate: input.aggregate, run: latest, stale: input.stale(latest) }),
  })
  if (!t03.runCurrent) {
    return {
      kind: 'business-attempt', reason: 'latest-attempt-not-current',
      blockedByRunId: latest.id, t03,
    }
  }
  return { kind: 'business-attempt', run: latest, reason: 'latest-attempt-current', t03 }
}

/**
 * T05 stage-pass 的额外严门禁（RUN-05）：必须是最新业务 Run、completed、
 * 且通过 T03 的完整 Check×target 绑定。partial 只能办理拒绝/退回，不能通过。
 */
export function assessStagePassWithT03(input: {
  aggregate: CaseAggregateV2
  run: ReviewRunV2 | undefined
  stale: boolean
}): T03RunGateResult {
  return assessT03RunAction({
    aggregate: input.aggregate,
    run: input.run,
    action: 'stage-pass',
    evidence: input.run
      ? buildT03Evidence({ aggregate: input.aggregate, run: input.run, stale: input.stale })
      : undefined,
  })
}

/**
 * 当前决定引用校验（RUN-14/22）：已形成的最终决定若引用了真实 RunId，
 * 该 Run 必须仍是本案业务 Run 或同一 attempt；否则只允许展示历史决定，
 * 不允许把它当作最新审核结论继续办理。
 */
export function decisionRunRelation(input: {
  decisionRunId: string | undefined
  currentRun: ReviewRunV2 | undefined
  runs: readonly ReviewRunV2[]
}): 'current' | 'same-attempt-history' | 'superseded' | 'missing-run' | 'unbound' {
  const { decisionRunId, currentRun, runs } = input
  if (!decisionRunId) return 'unbound'
  const decisionRun = runs.find((run) => run.id === decisionRunId)
  if (!decisionRun) return 'missing-run'
  if (currentRun && decisionRun.id === currentRun.id) return 'current'
  if (currentRun && isSameAttempt(decisionRun, currentRun)) return 'same-attempt-history'
  return 'superseded'
}

/**
 * RUN-43 中断续跑闸门：冷启动中断回合的模型/Provider 请求结果未知，且当前
 * 没有耐久 effect journal 能证明它们是否已生效，自动按原 RunId 续跑可能把
 * 未知 effect 重放一遍。默认失败关闭；只有用户显式确认「继续上次检查点
 * （新回合）」或明确选择「重新审核全部」才放行。
 */
export function interruptedResumeGate(input: {
  interruptedResumable: boolean
  resumeInterrupted?: boolean
  mode?: 'update' | 'restart'
}): { allowed: boolean; message?: string } {
  if (!input.interruptedResumable) return { allowed: true }
  if (input.resumeInterrupted === true) return { allowed: true }
  if (input.mode === 'restart') return { allowed: true }
  return {
    allowed: false,
    message: '上次审核因应用重启中断（检查点与已接受结果已保留）。自动续跑可能重复发起上次未确认的模型请求，已拒绝；请确认“继续上次检查点（新回合）”或选择“重新审核全部”。',
  }
}
