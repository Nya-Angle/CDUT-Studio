/**
 * P03-S02: Main-side acknowledgement seam for a prepared direct Pi review.
 *
 * This is NOT a second runner or task store. The caller provides the existing
 * agent-service runAgent() as execute(input, onRunOwned), and the actual Agent
 * promise remains owned by Main after the admission ACK is returned.
 *
 * No IPC is exposed here: session ownership / desktop / Pocket guards must
 * exist before an external entry point can call this function.
 */
import type { AgentSendInput } from '@profer/shared'
import {
  finishPiReviewRunV2,
  getPiReviewBindingForSession,
  type PiReviewBinding,
} from './pi-case-review-service'
import { findActivePiReviewAssignment, revokeAssignment } from './review-agent-assignment'
import { getRunV2 } from './run-store-v2'

export type ReviewAdmissionReceipt = Readonly<{
  caseId: string
  sessionId: string
  runId: string
  assignmentId: string
}>

export type OwnedReviewExecutor = (input: AgentSendInput, onRunOwned: () => void) => Promise<void>

/** Process-local duplicate admission fence, NOT another persisted task ledger. */
const runningAssignments = new Set<string>()
/** Process-local verified ACK; never an alternative persisted run ledger. */
const admittedByCase = new Map<string, PiReviewBinding>()

function forgetAdmitted(binding: PiReviewBinding): void {
  const admitted = admittedByCase.get(binding.caseId)
  if (admitted?.runId === binding.runId && admitted.assignmentId === binding.assignmentId) {
    admittedByCase.delete(binding.caseId)
  }
}

/** Persisted 'running' does not prove the orchestrator granted ownership. */
export function isPiReviewRunAdmitted(caseId: string, runId: string): boolean {
  const binding = admittedByCase.get(caseId)
  return !!binding && binding.runId === runId && isCurrent(binding)
}

function isCurrent(binding: PiReviewBinding): boolean {
  const current = getPiReviewBindingForSession(binding.sessionId)
  return current?.caseId === binding.caseId
    && current?.runId === binding.runId
    && current?.assignmentId === binding.assignmentId
    && current?.sessionId === binding.sessionId
}

function closeIfCurrent(binding: PiReviewBinding, error: string): void {
  if (!isCurrent(binding)) return
  finishPiReviewRunV2(binding, { status: 'failed', error })
}

/**
 * Returns as soon as the real Orchestrator grants the run token; the Agent
 * continues in Main after this Promise resolves. Merely having a V2 "running"
 * row is not acceptance. Caller must have already prepared run+assignment.
 */
export function admitPreparedPiReviewTurn(
  input: AgentSendInput,
  binding: PiReviewBinding,
  execute: OwnedReviewExecutor,
): Promise<ReviewAdmissionReceipt> {
  if (input.sessionId !== binding.sessionId || input.agentRuntime !== 'pi'
    || input.triggeredBy !== 'user' || !input.uuid) {
    return Promise.reject(new Error('审核受理参数与可信 Pi 用户轮次不一致'))
  }
  const assignment = findActivePiReviewAssignment(binding.sessionId)
  // Bind lookup and permission check have different semantics: only an
  // admission needs proof that its V2 run is still currently running.
  if (getRunV2(binding.caseId, binding.runId)?.status !== 'running'
    || !isCurrent(binding) || !assignment || assignment.id !== binding.assignmentId
    || assignment.turnId !== input.uuid || assignment.activeRunId !== binding.runId) {
    return Promise.reject(new Error('审核指派已失效，不能启动后台审核'))
  }
  if (input.onRunOutcome) {
    return Promise.reject(new Error('审核收尾必须由 Main 统一绑定，不能接收外部 onRunOutcome'))
  }
  if (runningAssignments.has(binding.assignmentId)) {
    return Promise.reject(new Error('该审核指派已经受理或正在启动；不得重复启动'))
  }
  runningAssignments.add(binding.assignmentId)

  let resolveAdmission!: (value: ReviewAdmissionReceipt) => void
  let rejectAdmission!: (error: Error) => void
  const admitted = new Promise<ReviewAdmissionReceipt>((resolve, reject) => {
    resolveAdmission = resolve
    rejectAdmission = reject
  })
  let owned = false
  let finished = false
  let terminalReported = false
  let terminalWriteFailure: unknown

  const reportSettlementError = (stage: string, error: unknown): void => {
    // Explicit diagnostic. Never log input.userMessage, model transcript or
    // credentials. Failing a durable write must NOT be reported as success.
    console.error(`[审核后台] ${stage}失败: case=${binding.caseId}, run=${binding.runId}, assignment=${binding.assignmentId}`, error)
  }

  const closeSafely = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    try {
      closeIfCurrent(binding, message || 'Agent 未获得执行权')
    } catch (writeError) {
      terminalWriteFailure = writeError
      reportSettlementError('V2 运行状态持久化', writeError)
    }
  }

  const finishExecution = (executionError?: unknown): void => {
    finished = true
    try {
      if (executionError !== undefined) {
        closeSafely(executionError)
      } else if (!owned) {
        closeSafely(new Error('Agent 未获得执行权，启动已结束'))
      } else if (terminalWriteFailure !== undefined) {
        closeSafely(new Error('可信运行回调持久化失败'))
      } else if (!terminalReported && getRunV2(binding.caseId, binding.runId)?.status === 'running') {
        closeSafely(new Error('Agent 未产生可信的完成回调'))
      }
    } catch (error) {
      reportSettlementError('运行状态收尾', error)
    } finally {
      try {
        // The assignment layer quarantines this ID BEFORE attempting disk I/O.
        // If write fails the persistent state stays unconfirmed, but tools
        // remain denied for this Main process (and terminal V2 runs on reboot).
        revokeAssignment(binding.assignmentId)
      } catch (error) {
        reportSettlementError('指派撤销未持久化（已进程内隔离）', error)
      } finally {
        // These fences MUST be released even if finish/revoke throws.
        runningAssignments.delete(binding.assignmentId)
        forgetAdmitted(binding)
      }
      if (!owned) {
        const error = executionError ?? terminalWriteFailure ?? new Error('Agent 未获得执行权，启动已结束')
        rejectAdmission(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }

  // The Main process owns and OBSERVES both the executor's rejection and its
  // settlement callback. No discarded .then() chain may surface as an
  // unhandledRejection or keep an admission promise pending.
  void Promise.resolve().then(() => execute({
    ...input,
    onRunOutcome: (outcome) => {
      try {
        const persisted = getRunV2(binding.caseId, binding.runId)
        const active = admittedByCase.get(binding.caseId)
        const ownsThisRun = active?.runId === binding.runId && active.assignmentId === binding.assignmentId
        // The tool may have already completed V2. A late callback must not
        // reopen a terminal run or mutate a newer assignment.
        if (ownsThisRun && (!persisted || persisted.status === 'running' || persisted.status === 'queued')) {
          if (!persisted || !isCurrent(binding)) throw new Error('无法确认当前审核轮次及 V2 持久运行状态')
          finishPiReviewRunV2(binding, outcome)
          const after = getRunV2(binding.caseId, binding.runId)
          if (!after || after.status === 'running' || after.status === 'queued') {
            throw new Error('V2 终态未成功持久化，不能视为已完成')
          }
        }
        terminalReported = true
      } catch (error) {
        terminalWriteFailure = error
        reportSettlementError('可信运行回调落盘', error)
        // 回调已报告终态但落盘失败时，不能等 executor Promise 后续收尾
        // 才拒止工具；旧磁盘 running 在这段窗口内不再具有授权效力。
        try {
          revokeAssignment(binding.assignmentId)
        } catch (revokeError) {
          reportSettlementError('终态未确认后的指派撤销未持久化（已进程内隔离）', revokeError)
        } finally {
          forgetAdmitted(binding)
        }
      }
    },
  }, () => {
    if (finished || owned) return
    if (!isCurrent(binding)) return
    owned = true
    admittedByCase.set(binding.caseId, binding)
    resolveAdmission({ caseId: binding.caseId, sessionId: binding.sessionId,
      runId: binding.runId, assignmentId: binding.assignmentId })
  })).then(
    () => finishExecution(),
    (error: unknown) => finishExecution(error),
  ).catch((error: unknown) => {
    // Defensive last resort if a future settlement branch adds new throws.
    reportSettlementError('最终 Promise 收尾', error)
    runningAssignments.delete(binding.assignmentId)
    forgetAdmitted(binding)
    if (!owned) rejectAdmission(error instanceof Error ? error : new Error(String(error)))
  })
  return admitted
}
