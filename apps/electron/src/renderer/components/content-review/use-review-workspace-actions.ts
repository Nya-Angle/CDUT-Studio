import { useCallback } from 'react'
import { useAtomValue, useStore } from 'jotai'
import { beginWorkspaceCaseWrite } from './review-workspace-write-fence'
import type { Actor, CaseAggregateV2, FieldValue, ReviewCommandV2 } from '@profer/shared'
import { resolveT03CorrectionRefs } from '../../../main/lib/review/review-v3-t03-fact-workflow'
import {
  reviewWorkspaceAggregatesByCaseAtom,
  reviewWorkspaceExtractedObservationsByCaseAtom,
  reviewWorkspaceRunStaleByCaseAtom,
  reviewWorkspaceRunsByCaseAtom,
  selectedCaseIdAtom,
} from '@/atoms/review-atoms'

const reviewer: Actor = { actorId: 'local-user', actorSource: 'local', role: 'reviewer' }

function fieldValue(value: unknown): FieldValue {
  if (value && typeof value === 'object' && 'kind' in value && 'value' in value) return value as FieldValue
  if (typeof value === 'number' && Number.isFinite(value)) return { kind: 'number', value }
  if (typeof value === 'boolean') return { kind: 'boolean', value }
  return { kind: 'text', value: value == null ? '' : String(value) }
}

export function useReviewWorkspaceActions(): {
  refresh(): Promise<CaseAggregateV2 | null>
  confirmObservation(observation: Record<string, unknown>, value?: unknown, reason?: string): Promise<void>
  transitionEvidenceLink(input: { id?: string; documentVersionId: string; subjectId: string; supportsFact: string; status: 'confirmed' | 'rejected' }): Promise<void>
  acknowledgeMaterial(input: { documentVersionId: string; action: 'read' | 'ignore'; reason: string }): Promise<void>
  recordDisposition(input: { findingKey: string; disposition: 'confirmed-issue' | 'human-confirmed-compliant' | 'false-positive' | 'waived' | 'escalated'; reason: string }): Promise<void>
  openSupplement(input: { findingKey: string; requiredElements: string[]; reason: string }): Promise<void>
  respondSupplement(supplementId: string): Promise<void>
  resolveSupplement(supplementId: string): Promise<void>
  decide(input: { result: 'pass' | 'partial-pass' | 'return' | 'reject'; reason: string; requiredElements?: string[]; supplementReason?: string }): Promise<void>
  adjudicateSubject(input: { subjectId: string; outcome: 'accepted' | 'rejected' | 'modified'; finalFields?: Record<string, FieldValue>; reason: string }): Promise<void>
} {
  const store = useStore()
  const caseId = useAtomValue(selectedCaseIdAtom)

  const refresh = useCallback(async (): Promise<CaseAggregateV2 | null> => {
    if (!caseId) return null
    const isLatest = beginWorkspaceCaseWrite(store, caseId)
    const [aggregate, runs, observations] = await Promise.all([
      window.reviewAPI.getAggregateV2(caseId),
      window.reviewAPI.listRunsV2(caseId),
      window.reviewAPI.getRunObservationsV2(caseId),
    ])
    const run = runs[0] ?? null
    if (!isLatest()) return null
    const stale = run ? await window.reviewAPI.getWorkspaceRunValidityV2({ caseId, runId: run.id }) : false
    if (!isLatest()) return null
    // All four related slots commit together after the last asynchronous read.
    store.set(reviewWorkspaceAggregatesByCaseAtom, { ...store.get(reviewWorkspaceAggregatesByCaseAtom), [caseId]: aggregate ?? null })
    store.set(reviewWorkspaceRunsByCaseAtom, { ...store.get(reviewWorkspaceRunsByCaseAtom), [caseId]: run })
    store.set(reviewWorkspaceExtractedObservationsByCaseAtom, { ...store.get(reviewWorkspaceExtractedObservationsByCaseAtom), [caseId]: observations })
    store.set(reviewWorkspaceRunStaleByCaseAtom, { ...store.get(reviewWorkspaceRunStaleByCaseAtom), [caseId]: stale })
    return aggregate ?? null
  }, [caseId, store])

  const command = useCallback((aggregate: CaseAggregateV2, input: { type: string; payload: unknown }): ReviewCommandV2<unknown> => ({
    requestId: `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    target: { kind: 'case' as const, id: aggregate.caseV2.id },
    expectedRevision: aggregate.caseV2.revision,
    actor: reviewer,
    ...input,
  }), [])

  const apply = useCallback(async (request: Promise<{ ok: boolean; aggregate?: CaseAggregateV2; message?: string } | undefined>): Promise<void> => {
    if (!caseId) return
    // Capture BEFORE the IPC resolves; capturing at apply(result) would let
    // a delayed old mutation steal the next round's display generation.
    const isLatest = beginWorkspaceCaseWrite(store, caseId)
    const result = await request
    if (!result) throw new Error('审核操作没有返回结果')
    if (!result.ok) throw new Error(result.message ?? '审核操作失败')
    if (!result.aggregate || !isLatest()) return
    const [runs, observations] = await Promise.all([
      window.reviewAPI.listRunsV2(caseId),
      window.reviewAPI.getRunObservationsV2(caseId),
    ])
    if (!isLatest()) return
    const run = runs[0] ?? null
    const stale = run ? await window.reviewAPI.getWorkspaceRunValidityV2({ caseId, runId: run.id }) : false
    if (!isLatest()) return
    store.set(reviewWorkspaceAggregatesByCaseAtom, { ...store.get(reviewWorkspaceAggregatesByCaseAtom), [caseId]: result.aggregate })
    store.set(reviewWorkspaceRunsByCaseAtom, { ...store.get(reviewWorkspaceRunsByCaseAtom), [caseId]: run })
    store.set(reviewWorkspaceExtractedObservationsByCaseAtom, { ...store.get(reviewWorkspaceExtractedObservationsByCaseAtom), [caseId]: observations })
    store.set(reviewWorkspaceRunStaleByCaseAtom, { ...store.get(reviewWorkspaceRunStaleByCaseAtom), [caseId]: stale })
  }, [caseId, store])

  const currentAggregate = useCallback(async (): Promise<CaseAggregateV2> => {
    const aggregate = caseId ? await window.reviewAPI.getAggregateV2(caseId) : undefined
    if (!aggregate) throw new Error('当前案卷业务记录不可用')
    return aggregate
  }, [caseId])

  const confirmObservation = useCallback(async (observation: Record<string, unknown>, value: unknown = observation.value, reason = '审核员核对材料后确认该事实') => {
    const aggregate = await currentAggregate()
    if (typeof observation.subjectId !== 'string' || typeof observation.fieldKey !== 'string') throw new Error('事实缺少事项或字段标识')
    await apply(window.reviewAPI.correctObservationV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'CorrectObservation',
      payload: {
        subjectId: observation.subjectId,
        fieldKey: observation.fieldKey,
        value: fieldValue(value),
        sourceRefs: resolveT03CorrectionRefs(aggregate, observation.sourceRefs ?? []),
        reason,
      },
    }) }))
  }, [apply, command, currentAggregate])

  const transitionEvidenceLink = useCallback(async (input: { id?: string; documentVersionId: string; subjectId: string; supportsFact: string; status: 'confirmed' | 'rejected' }) => {
    const aggregate = await currentAggregate()
    await apply(window.reviewAPI.setEvidenceLinkV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'SetEvidenceLink',
      payload: input.id
        ? { evidenceLinkId: input.id, status: input.status, documentVersionId: input.documentVersionId, subjectIds: [input.subjectId], supportsFact: input.supportsFact, linkedBy: 'user' }
        : { documentVersionId: input.documentVersionId, subjectIds: [input.subjectId], supportsFact: input.supportsFact, linkedBy: 'user' },
    }) }))
  }, [apply, command, currentAggregate])

  const acknowledgeMaterial = useCallback(async (input: { documentVersionId: string; action: 'read' | 'ignore'; reason: string }) => {
    const aggregate = await currentAggregate()
    await apply(window.reviewAPI.acknowledgeWorkspaceMaterialV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'AcknowledgeWorkspaceMaterial', payload: input,
    }) }))
  }, [apply, command, currentAggregate])

  const recordDisposition = useCallback(async (input: { findingKey: string; disposition: 'confirmed-issue' | 'human-confirmed-compliant' | 'false-positive' | 'waived' | 'escalated'; reason: string }) => {
    const aggregate = await currentAggregate()
    const run = store.get(reviewWorkspaceRunsByCaseAtom)[aggregate.caseV2.id]
    if (!run) throw new Error('没有可处置的审核运行')
    await apply(window.reviewAPI.recordWorkspaceDispositionV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'RecordWorkspaceFindingDisposition',
      payload: { ...input, runId: run.id, inputHash: run.inputManifest.hash },
    }) }))
  }, [apply, command, currentAggregate, store])

  const openSupplement = useCallback(async (input: { findingKey: string; requiredElements: string[]; reason: string }) => {
    const aggregate = await currentAggregate()
    const run = store.get(reviewWorkspaceRunsByCaseAtom)[aggregate.caseV2.id]
    if (!run) throw new Error('没有可关联的审核运行')
    await apply(window.reviewAPI.openWorkspaceSupplementV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'OpenWorkspaceSupplement',
      payload: { ...input, runId: run.id, inputHash: run.inputManifest.hash },
    }) }))
  }, [apply, command, currentAggregate, store])

  const respondSupplement = useCallback(async (supplementId: string) => {
    const aggregate = await currentAggregate()
    const supplement = aggregate.supplements.find((item) => item.id === supplementId)
    if (!supplement) throw new Error('补件请求不存在')
    const previous = new Set(supplement.documentVersionIdsAtRequest ?? [])
    const versions = aggregate.caseV2.documents.filter((doc) => doc.role === 'evidence' && doc.active !== false && !previous.has(doc.versionId)).map((doc) => doc.versionId)
    if (versions.length === 0) throw new Error('请先从左侧导入本次补件的新增证明材料')
    await apply(window.reviewAPI.respondSupplementV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'RespondSupplement',
      payload: { supplementId, note: '审核员在本地工作台导入了补充材料', documentVersionIds: versions },
    }) as unknown as Record<string, unknown> }))
  }, [apply, command, currentAggregate])

  const resolveSupplement = useCallback(async (supplementId: string) => {
    const aggregate = await currentAggregate()
    await apply(window.reviewAPI.resolveSupplementV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'ResolveSupplement',
      payload: { supplementId, outcome: 'satisfied', reason: '审核员核验补充材料后确认满足要求' },
    }) as unknown as Record<string, unknown> }))
  }, [apply, command, currentAggregate])

  const decide = useCallback(async (input: { result: 'pass' | 'partial-pass' | 'return' | 'reject'; reason: string; requiredElements?: string[]; supplementReason?: string }) => {
    const aggregate = await currentAggregate()
    const run = store.get(reviewWorkspaceRunsByCaseAtom)[aggregate.caseV2.id]
    if (!run) throw new Error('没有可关联的审核运行')
    await apply(window.reviewAPI.decideWorkspaceCaseV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'RecordWorkspaceBusinessDecision',
      payload: { ...input, basedOnRunId: run.id, inputHash: run.inputManifest.hash },
    }) }))
  }, [apply, command, currentAggregate, store])

  const adjudicateSubject = useCallback(async (input: { subjectId: string; outcome: 'accepted' | 'rejected' | 'modified'; finalFields?: Record<string, FieldValue>; reason: string }) => {
    const aggregate = await currentAggregate()
    const run = store.get(reviewWorkspaceRunsByCaseAtom)[aggregate.caseV2.id]
    if (!run) throw new Error('请先完成当前审核运行，再进行事项最终认定')
    await apply(window.reviewAPI.recordWorkspaceSubjectAdjudicationV2({ caseId: aggregate.caseV2.id, command: command(aggregate, {
      type: 'RecordWorkspaceSubjectAdjudication',
      payload: { ...input, runId: run.id, inputHash: run.inputManifest.hash },
    }) }))
  }, [apply, command, currentAggregate, store])

  return { refresh, confirmObservation, transitionEvidenceLink, acknowledgeMaterial, recordDisposition, openSupplement, respondSupplement, resolveSupplement, decide, adjudicateSubject }
}
