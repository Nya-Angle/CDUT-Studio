/**
 * C: opt-in batch automation. Run checks first; then process ONLY fully validated
 * candidates via the existing serialized V2 business transaction.
 * No autonomous final rejections, fuzzy grouping, school identity spoofing,
 * cross-case decisions, or quota/rating shortcuts.
 */
import { createHash } from 'node:crypto'
import { triageBatchCase } from '@profer/shared'
import type { Actor, BatchAutomationReport, BatchAutomationReceipt, ReviewRunV2 } from '@profer/shared'
import { readAggregate } from './case-store-v2'
import { readBatchStateV2, saveBatchStateV2, finalizeBatch, assertBatchBusinessReadyForFinalization } from './batch-store'
import { checkAutoBatchAction, type AutoAction } from './batch-automation-gates'
import { listRunsV2, readArtifact } from './run-store-v2'
import { getTemplate } from './template-store'
import { decideWorkspaceCaseV2, isWorkspaceRunStaleV2 } from './workspace-business-service-v2'

const activeAutomation = new Set<string>()
function latestRun(caseId: string): ReviewRunV2 | undefined {
  return [...listRunsV2(caseId)].sort((a,b) => (b.completedAt ?? b.startedAt).localeCompare(a.completedAt ?? a.startedAt))[0]
}
function stableId(parts: unknown[]): string {
  return createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0,44)
}
function appendReceipt(batchId: string, receipt: BatchAutomationReceipt, expectedPolicyRevision: number): void {
  const state = readBatchStateV2(batchId)
  if (!state || state.automation?.revision !== expectedPolicyRevision) return
  if ((state.automationReceipts ?? []).some((entry) => entry.requestId === receipt.requestId && entry.status === receipt.status)) return
  state.automationReceipts = [...(state.automationReceipts ?? []), receipt]
  saveBatchStateV2(state)
}

export async function runBatchAutomation(batchId: string): Promise<BatchAutomationReport> {
  if (activeAutomation.has(batchId)) throw new Error('当前批次自动化处理正在进行')
  activeAutomation.add(batchId)
  try {
    const state = readBatchStateV2(batchId)
    if (!state) throw new Error('批次不存在')
    if (state.status !== 'queued') throw new Error('只有已完成运行队列的批次可以自动处理')
    const configured = state.automation
    if (!configured || configured.mode === 'assist') throw new Error('此批次尚未启用自动化策略')
    const revision = configured.revision
    const results: BatchAutomationReceipt[] = []
    for (const entry of state.cases) {
      if (entry.status !== 'done') continue
      const current = readBatchStateV2(batchId)
      if (!current || current.status !== 'queued' || current.automation?.revision !== revision
        || current.automation.mode === 'assist') break
      const aggregate = readAggregate(entry.caseId)
      const run = latestRun(entry.caseId)
      if (!aggregate || !run || aggregate.caseV2.stage === 'decided'
        || aggregate.caseV2.stage === 'archived' || aggregate.caseV2.stage === 'awaiting-supplement') continue
      const route = triageBatchCase({
        caseId: entry.caseId, entryStatus: entry.status, caseStage: aggregate.caseV2.stage,
        run, batch: current.batch,
      }).route
      const action: AutoAction | null = route === 'auto-pass-candidate' && configured.mode === 'auto-approve' ? 'pass'
        : route === 'auto-return-candidate' ? 'return' : null
      if (!action) continue
      const requestId = `batch-auto-${stableId([batchId, entry.caseId, run.id, action, revision])}`
      const actor: Actor = {
        actorId: `batch-auto:${encodeURIComponent(batchId)}:${revision}`,
        actorSource: 'system', role: 'reviewer',
      }
      let receipt: BatchAutomationReceipt
      try {
        const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
        if (!template || isWorkspaceRunStaleV2(aggregate, run.id)) throw new Error('当前案卷输入或补件回复已经变化，请重新审核')
        const artifact = readArtifact<{ observations?: Array<Record<string, unknown>> }>(entry.caseId, run.id, 'node-auto-check-extract')
        const gate = checkAutoBatchAction(current, aggregate, run, template, action, artifact?.observations ?? [])
        if (!gate.allowed) {
          receipt = { caseId: entry.caseId, runId: run.id, action, status: 'blocked', message: gate.reason,
            at: new Date().toISOString(), requestId, policyRevision: revision }
        } else {
          const changed = await decideWorkspaceCaseV2(entry.caseId, {
            requestId, actor, expectedRevision: aggregate.caseV2.revision,
            payload: {
              result: action, reason: gate.reason, basedOnRunId: run.id, inputHash: run.inputManifest.hash,
              ...(action === 'return' ? { requiredElements: gate.requiredElements, supplementReason: gate.reason } : {}),
            },
          })
          if (changed.ok) {
            receipt = { caseId: entry.caseId, runId: run.id, action, status: 'applied',
              message: `业务事务已记录：${changed.receipt.requestId}`, at: new Date().toISOString(),
              requestId, policyRevision: revision }
          } else {
            receipt = { caseId: entry.caseId, runId: run.id, action,
              status: ['VERSION_CONFLICT','STALE_INPUT'].includes(changed.code) ? 'conflict' : 'blocked',
              message: changed.message, at: new Date().toISOString(), requestId, policyRevision: revision }
          }
        }
      } catch (e) {
        receipt = { caseId: entry.caseId, runId: run.id, action, status: 'failed',
          message: e instanceof Error ? e.message : String(e), at: new Date().toISOString(),
          requestId, policyRevision: revision }
      }
      appendReceipt(batchId, receipt, revision)
      results.push(receipt)
    }
    return {
      batchId, policyRevision: revision, results,
      applied: results.filter((r) => r.status === 'applied').length,
      blocked: results.filter((r) => r.status === 'blocked').length,
      failed: results.filter((r) => r.status === 'failed').length,
      conflicts: results.filter((r) => r.status === 'conflict').length,
    }
  } finally {
    activeAutomation.delete(batchId)
  }
}

/** Finalize only when EVERY case has an auditable final business decision. */
export function finalizeCompletedBatch(batchId: string) {
  const state = readBatchStateV2(batchId)
  if (!state || state.status !== 'queued' || !state.automation || state.automation.mode === 'assist')
    throw new Error('批次状态不允许自动定稿')
  // The core finalizer has the authoritative shared gate; cannot be bypassed
  // through a raw 'finalize' IPC action or a different service caller.
  assertBatchBusinessReadyForFinalization(state)
  const { resolveFinalDecisionProjection } = require('./stage-workflow') as typeof import('./stage-workflow')
  const decisions = state.cases.map(({ caseId }) => {
    const aggregate = readAggregate(caseId)
    if (!aggregate || !['decided', 'archived'].includes(aggregate.caseV2.stage)
      || aggregate.supplements.some((sup) => ['open', 'responded', 'insufficient'].includes(sup.status)))
      throw new Error(`案卷未完成正式审批或仍待补件: ${caseId}`)
    const projection = resolveFinalDecisionProjection(aggregate.decisions)
    const final = projection.decision
    if (!projection.isFinal || !final) throw new Error(`案卷缺少可追溯的正式决定: ${caseId}`)
    return { caseId, decisionId: final.id, result: final.result, runId: final.basedOnRunId,
      basedOnRevision: final.basedOnRevision, actor: final.actor }
  })
  return finalizeBatch(batchId, {
    kind: 'audited-automation-batch', round: state.round, templateId: state.batch.templateId,
    templateVersion: state.batch.templateVersion, policyVersions: state.batch.policyVersionLock,
    automation: state.automation, decisions,
  })
}
