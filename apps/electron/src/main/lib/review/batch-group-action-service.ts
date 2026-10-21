/**
 * B slice: explicitly confirmed, per-case batch issue handling.
 * Preview is read-only; apply routes through existing V2 transaction services.
 * It cannot authorize autonomous AI decisions or external school approvals.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { assessDecisionReadiness, groupBatchIssues, triageBatchCase } from '@profer/shared'
import type { Actor, BatchGroupActionRequest, BatchGroupApplyRequest, BatchGroupApplyResult, BatchGroupPreview, BatchGroupPreviewRow, BatchTriageInput, ReviewRunV2 } from '@profer/shared'
import { getConfigDir } from '../config-paths'
import { readAggregate } from './case-store-v2'
import { readBatchStateV2 } from './batch-store'
import { listRunsV2, readArtifact } from './run-store-v2'
import { getTemplate } from './template-store'
import { isWorkspaceRunStaleV2, decideWorkspaceCaseV2, openWorkspaceSupplementV2, recordWorkspaceDispositionV2 } from './workspace-business-service-v2'

const localReviewer: Actor = { actorId: 'local-batch-reviewer', actorSource: 'local', role: 'reviewer' }
const liveOperations = new Set<string>()
const DISPOSITION_MAP = {
  'confirm-issue': 'confirmed-issue',
  'false-positive': 'false-positive',
  'human-confirmed-compliant': 'human-confirmed-compliant',
  'escalate': 'escalated',
} as const

function digest(value: unknown): string { return createHash('sha256').update(JSON.stringify(value)).digest('hex') }
function operationFile(batchId: string, operationId: string): string {
  // Never use user-controlled IDs as filesystem path components.
  return join(getConfigDir(), 'review-batch-operations', `${digest([batchId, operationId])}.json`)
}
function persist(path: string, obj: unknown): void {
  mkdirSync(join(getConfigDir(), 'review-batch-operations'), { recursive: true })
  const tmp = `${path}.${Math.random().toString(36).slice(2)}.tmp`
  writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8')
  renameSync(tmp, path)
}

function validateRequest(req: BatchGroupActionRequest): void {
  if (!req || typeof req.batchId !== 'string' || !req.batchId.trim()
    || typeof req.groupKey !== 'string' || !req.groupKey.trim()
    || !['confirm-issue','false-positive','human-confirmed-compliant','escalate','request-supplement','final-return','final-pass'].includes(req.action)
    || typeof req.reason !== 'string' || !req.reason.trim() || req.reason.length > 2000
    || !Array.isArray(req.caseIds) || req.caseIds.length === 0 || req.caseIds.length > 500
    || req.caseIds.some((id) => typeof id !== 'string' || !id.trim())
    || new Set(req.caseIds).size !== req.caseIds.length) {
    throw new Error('问题组处置参数无效；必须指定案卷、动作和具体理由')
  }
  if ((req.action === 'request-supplement' || req.action === 'final-return')
    && (!Array.isArray(req.requiredElements) || !req.requiredElements.length || req.requiredElements.some((x) => typeof x !== 'string' || !x.trim()))) {
    throw new Error('补件/退回必须列出明确的补正要素')
  }
  if (req.requiredElements && (req.requiredElements.length > 30 || req.requiredElements.some((x) => typeof x !== 'string' || x.length > 200))) {
    throw new Error('补件要素数量或长度超出上限')
  }
}

function latestRun(caseId: string): ReviewRunV2 | undefined {
  return [...listRunsV2(caseId)].sort((a,b) => (b.completedAt ?? b.startedAt).localeCompare(a.completedAt ?? a.startedAt))[0]
}

function collect(batchId: string) {
  const batch = readBatchStateV2(batchId)
  if (!batch) throw new Error('审核批次不存在')
  if (batch.status === 'finalized' || batch.status === 'running') throw new Error('正在运行或已定稿的批次不能批量处置')
  const inputs: BatchTriageInput[] = batch.cases.map((entry) => {
    const aggregate = readAggregate(entry.caseId)
    return {
      caseId: entry.caseId, entryStatus: entry.status,
      caseStage: aggregate?.caseV2.stage, run: latestRun(entry.caseId),
      batch: batch.batch,
    }
  })
  return { batch, inputs }
}

export function previewBatchGroupAction(request: BatchGroupActionRequest): BatchGroupPreview {
  validateRequest(request)
  const { batch, inputs } = collect(request.batchId)
  const group = groupBatchIssues(inputs).find((g) => g.key === request.groupKey)
  if (!group) throw new Error('问题组已失效或不再存在，请刷新批次')
  const rows: BatchGroupPreviewRow[] = request.caseIds.map((caseId) => {
    const base: BatchGroupPreviewRow = { caseId, title: caseId, eligible: false, reason: '', revision: null, runId: null, inputHash: null, findingKey: null, sourceCount: 0 }
    const agg = readAggregate(caseId)
    const input = inputs.find((x) => x.caseId === caseId)
    base.title = agg?.caseV2.title ?? caseId
    if (!group.caseIds.includes(caseId) || !input || !agg) { base.reason = '不属于当前有效问题组或案卷缺失'; return base }
    const occurrences = group.occurrences.filter((o) => o.caseId === caseId)
    if (occurrences.length !== 1) { base.reason = '本案对同一问题组命中多项检查，请单案分别处理'; return base }
    const occurrence = occurrences[0]!
    const run = input.run
    base.revision = agg.caseV2.revision
    base.runId = occurrence.runId
    base.inputHash = occurrence.inputHash
    base.findingKey = occurrence.checkId
    base.sourceCount = occurrence.sourceRefs.length
    if (!run || run.id !== occurrence.runId || isWorkspaceRunStaleV2(agg, run.id)) {
      base.reason = '案卷材料、事实或证明关联已变更，需要重新审核'; return base
    }
    if (run.caseId !== agg.caseV2.id || agg.caseV2.templateId !== batch.batch.templateId || agg.caseV2.templateVersion !== batch.batch.templateVersion) {
      base.reason = '案卷模板与批次锁不一致'; return base
    }
    const template = getTemplate(agg.caseV2.templateId, agg.caseV2.templateVersion)
    if (!template || template.status !== 'published') { base.reason = '没有有效发布模板'; return base }
    if (!template.stages.some((stage) => stage.executorRole === 'reviewer')) {
      base.reason = '模板未授权本地 reviewer 执行人工处置'; return base
    }
    if (agg.tasks.some((task) => task.status === 'open' && task.assigneeRole !== 'reviewer')) {
      base.reason = '当前阶段由其他角色处理，不能代其决定'; return base
    }
    if (agg.caseV2.stage === 'decided' || agg.caseV2.stage === 'archived' || agg.caseV2.stage === 'awaiting-supplement') {
      base.reason = '案卷已结束或正在补件'; return base
    }
    if (occurrence.sourceRefs.length === 0) { base.reason = '此问题缺少可追溯来源，不允许按组批量处置'; return base }
    if (occurrence.sourceRefs.some((ref) => ref.caseId !== caseId
      || !agg.caseV2.documents.some((doc) => doc.versionId === ref.documentVersionId && doc.parseRevision === ref.parseRevision && doc.active !== false))) {
      base.reason = '引用了不属于本案的证据或失效材料版本'; return base
    }
    const route = triageBatchCase(input).route
    if (route !== 'manual-review' && route !== 'auto-return-candidate') {
      base.reason = '本案当前不是需要处理的问题状态'; return base
    }
    const previous = [...agg.dispositions].reverse().find((d) => d.findingKey === occurrence.checkId && d.runId === run.id && d.inputHash === run.inputManifest.hash)
    if (request.action in DISPOSITION_MAP) {
      if (previous?.disposition === DISPOSITION_MAP[request.action as keyof typeof DISPOSITION_MAP]) {
        base.reason = '本项已有相同的人工处理记录'; return base
      }
    } else if (request.action === 'request-supplement' || request.action === 'final-return') {
      if (request.action === 'final-return' && (
        template.stages.filter((stage) => !stage.nextStageId).length !== 1
        || template.stages.find((stage) => !stage.nextStageId)?.executorRole !== 'reviewer'
        || (template.stages.length > 1 && !agg.tasks.some((task) => task.status === 'open' && task.stageId === template.stages.find((stage) => !stage.nextStageId)?.id))
      )) {
        base.reason = '当前角色或阶段不允许作出最终退回决定'; return base
      }
      if (occurrence.status !== 'awaiting-supplement' || route !== 'auto-return-candidate') {
        base.reason = '其他检查尚有阻断，或本项不是明确可补正的问题'; return base
      }
      if (agg.supplements.some((sup) => ['open','responded','insufficient'].includes(sup.status))) {
        base.reason = '已存在进行中的补件事项'; return base
      }
    } else if (request.action === 'final-pass') {
      const finalStage = template.stages.find((stage) => !stage.nextStageId)
      if (!finalStage || finalStage.executorRole !== 'reviewer'
        || (template.stages.length > 1 && !agg.tasks.some((task) => task.status === 'open' && task.stageId === finalStage.id))) {
        base.reason = '当前角色或阶段不允许作出最终通过决定'; return base
      }
      const artifact = readArtifact<{ observations?: Array<Record<string, unknown>> }>(caseId, run.id, 'node-auto-check-extract')
      const readiness = assessDecisionReadiness({ aggregate: agg, run, runStale: false, template, observations: artifact?.observations ?? [] })
      if (!readiness.ready) {
        base.reason = `仍有审批阻断：${readiness.blockers.slice(0,2).map((b) => b.message).join('；')}`; return base
      }
      if (run.checks.some((c) => ['non-compliant','awaiting-confirmation','awaiting-supplement'].includes(c.status)
        && ![...agg.dispositions].reverse().some((d) => d.findingKey === c.checkId
          && d.runId === run.id && d.inputHash === run.inputManifest.hash
          && ['false-positive','human-confirmed-compliant'].includes(d.disposition)))) {
        base.reason = '仍存在未人工核实为符合的异常检查'; return base
      }
    }
    base.eligible = true
    base.reason = '已通过当前只读预检；提交时仍由单案业务事务重新校验'
    return base
  })
  const previewHash = digest({ batchId: request.batchId, action: request.action, groupKey: request.groupKey,
    caseIds: request.caseIds, reason: request.reason.trim(), requiredElements: request.requiredElements ?? [], rows })
  return { batchId: request.batchId, groupKey: request.groupKey, action: request.action,
    previewHash, rows, eligibleCount: rows.filter((r) => r.eligible).length, advisoryOnly: true }
}

type PersistedOp = { inputHash: string; result: BatchGroupApplyResult; completed: boolean }

export async function applyBatchGroupAction(request: BatchGroupApplyRequest): Promise<BatchGroupApplyResult> {
  validateRequest(request)
  if (request.confirmed !== true) throw new Error('人工未明确确认批量处理范围')
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(request.operationId)) throw new Error('操作 ID 无效')
  if (!/^[0-9a-f]{64}$/.test(request.previewHash)) throw new Error('预览指纹无效')
  const path = operationFile(request.batchId, request.operationId)
  const inputHash = digest({ ...request, confirmed: true })
  const liveKey = `${request.batchId}:${request.operationId}`
  if (liveOperations.has(liveKey)) throw new Error('相同批量操作正在执行')
  if (existsSync(path)) {
    const saved = JSON.parse(readFileSync(path, 'utf8')) as PersistedOp
    if (saved.inputHash !== inputHash) throw new Error('操作 ID 已被不同载荷使用')
    if (!saved.completed) {
      // Crash recovery is intentionally non-replaying: the last local command
      // may have committed even if its batch-level receipt was not saved.
      const processed = new Set(saved.result.results.map((row) => row.caseId))
      for (const caseId of request.caseIds) {
        if (processed.has(caseId)) continue
        saved.result.results.push({ caseId, status: 'failed', message: '批量操作中断，写入状态未确认；请核对案卷审计记录后重新预览处理' })
        saved.result.failed++
      }
      saved.completed = true
      persist(path, saved)
    }
    return saved.result
  }
  liveOperations.add(liveKey)
  try {
    const preview = previewBatchGroupAction(request)
    if (preview.previewHash !== request.previewHash) throw new Error('预览后案卷或处理范围发生变化，请重新预览')
    const result: BatchGroupApplyResult = {
      batchId: request.batchId, operationId: request.operationId, action: request.action,
      previewHash: request.previewHash, results: [], applied: 0, excluded: 0, conflicts: 0, failed: 0,
    }
    // Write ahead before the first business mutation. After a crash, the saved
    // receipt states exactly which cases were confirmed applied and which were
    // interrupted. The caller must inspect it before creating another action.
    persist(path, { inputHash, result, completed: false } satisfies PersistedOp)
    for (const row of preview.rows) {
      if (!row.eligible || !row.runId || !row.inputHash || !row.findingKey || row.revision === null) {
        result.results.push({ caseId: row.caseId, status: 'excluded', message: row.reason })
        result.excluded++
        persist(path, { inputHash, result, completed: false } satisfies PersistedOp)
        continue
      }
      // Re-read the case for each write; preview is not a capability token.
      const agg = readAggregate(row.caseId)
      if (!agg || agg.caseV2.revision !== row.revision
        || isWorkspaceRunStaleV2(agg, row.runId) || readBatchStateV2(request.batchId)?.status !== 'queued') {
        result.results.push({ caseId: row.caseId, status: 'conflict', message: '提交前案卷版本、输入或批次状态改变' })
        result.conflicts++
        persist(path, { inputHash, result, completed: false } satisfies PersistedOp)
        continue
      }
      const requestId = `batch-${digest([request.operationId, row.caseId, request.action, row.findingKey]).slice(0,36)}`
      try {
        const common = { requestId, actor: localReviewer, expectedRevision: row.revision }
        const action = request.action
        const changed = action in DISPOSITION_MAP
          ? await recordWorkspaceDispositionV2(row.caseId, { ...common, payload: { findingKey: row.findingKey,
            disposition: DISPOSITION_MAP[action as keyof typeof DISPOSITION_MAP], reason: request.reason.trim(),
            runId: row.runId, inputHash: row.inputHash } })
          : action === 'request-supplement'
            ? await openWorkspaceSupplementV2(row.caseId, { ...common, payload: {
              findingKey: row.findingKey, runId: row.runId, inputHash: row.inputHash,
              requiredElements: request.requiredElements ?? [], reason: request.reason.trim() } })
            : await decideWorkspaceCaseV2(row.caseId, { ...common, payload: {
              result: action === 'final-pass' ? 'pass' : 'return', reason: request.reason.trim(),
              basedOnRunId: row.runId, inputHash: row.inputHash,
              ...(action === 'final-return'
                ? { requiredElements: request.requiredElements, supplementReason: request.reason.trim() } : {}),
            } })
        if (changed.ok) {
          result.results.push({ caseId: row.caseId, status: 'applied', message: '已通过现有 V2 单案事务保存', receiptId: changed.receipt.requestId })
          result.applied++
        } else {
          const conflict = changed.code === 'VERSION_CONFLICT' || changed.code === 'STALE_INPUT' || changed.code === 'REQUEST_ID_COLLISION'
          result.results.push({ caseId: row.caseId, status: conflict ? 'conflict' : 'failed', message: changed.message })
          if (conflict) result.conflicts++; else result.failed++
        }
      } catch (error) {
        result.results.push({ caseId: row.caseId, status: 'failed', message: error instanceof Error ? error.message : String(error) })
        result.failed++
      }
      persist(path, { inputHash, result, completed: false } satisfies PersistedOp)
    }
    persist(path, { inputHash, result, completed: true } satisfies PersistedOp)
    return result
  } finally {
    liveOperations.delete(liveKey)
  }
}
