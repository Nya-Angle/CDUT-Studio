import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, BatchGroupActionRequest, DocumentVersion, ReviewCaseV2, ReviewRunV2 } from '@profer/shared'
import { createAggregate, readAggregate, submitCommand } from './case-store-v2'
import { createBatchV2, readBatchStateV2, saveBatchStateV2, updateCaseStatus } from './batch-store'
import { getTemplate, publishTemplate, saveDraft } from './template-store'
import { computeRunInputHash } from './run-service-v2'
import { saveRunV2 } from './run-store-v2'
import { applyBatchGroupAction, previewBatchGroupAction } from './batch-group-action-service'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-bulk-action-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))
const reviewer: Actor = { actorId: 'reviewer-test', actorSource: 'local', role: 'reviewer' }
let counter = 0
const next = (label: string) => `${label}-${++counter}`
function ensureTemplate(): void {
  if (getTemplate('batch-b-test', 1)) return
  saveDraft({
    templateId: 'batch-b-test', version: 1, schemaVersion: 2, name: '人工集中处置验证',
    objectType: 'person', displayName: { template: '{{title}}' }, fields: [],
    materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [{ id: 'approval', kind: 'approval', audience: 'reviewer' }],
    status: 'draft', createdAt: '2026-01-01T00:00:00.000Z',
  })
  publishTemplate('batch-b-test', 1)
}
async function makeCase(status: 'non-compliant' | 'awaiting-supplement', source = true): Promise<{ caseId: string; run: ReviewRunV2 }> {
  ensureTemplate()
  const caseId = next('group-case')
  const doc: DocumentVersion = {
    documentId: 'doc-1', versionId: `${caseId}-doc-v1`, contentHash: 'doc-hash',
    role: 'evidence', fileName: '证明.pdf', mimeType: 'application/pdf', sizeBytes: 18,
    assetPath: 'doc.pdf', parseRevision: 1, parseStatus: 'parsed',
    blocks: [{ blockId: 'b1', text: '实际证明材料', kind: 'text' }], usage: 'read', active: true,
  }
  const caseV2: ReviewCaseV2 = {
    id: caseId, templateId: 'batch-b-test', templateVersion: 1,
    title: caseId, objectType: 'person', caseFields: {}, subjects: [], documents: [doc],
    stage: 'reviewing', revision: 0, createdAt: '2026-10-10T00:00:00Z', updatedAt: '2026-10-10T00:00:00Z',
  }
  await createAggregate(caseId, caseV2)
  const run: ReviewRunV2 = {
    id: `run-${caseId}`, caseId, templateId: 'batch-b-test', templateVersion: 1,
    inputManifest: {
      hash: computeRunInputHash(caseV2, [], []), templateVersion: 1, policyVersions: [],
      documentVersions: [{ documentId: doc.documentId, versionId: doc.versionId, contentHash: doc.contentHash }],
      observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['rule-a'],
    },
    status: 'completed', checkpoints: [], checks: [{
      checkId: 'check-a', ruleId: 'rule-a', target: { scope: 'case', subjectIds: [] },
      status, reason: '缺少证明',
      sourceRefs: source ? [{ caseId, documentVersionId: doc.versionId, parseRevision: 1, location: { kind: 'file' } }] : [],
      executedBy: 'semantic', executedAt: '2026-10-10T00:00:01Z',
    }], opinions: [],
    coverage: { documents: [{ documentVersionId: doc.versionId, status: 'read' }],
      plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 1 },
    diagnostics: [], startedAt: '2026-10-10T00:00:00Z', completedAt: '2026-10-10T00:00:02Z',
  }
  saveRunV2(run)
  return { caseId, run }
}
function makeBatch(caseIds: string[]): string {
  const batchId = next('group-batch')
  createBatchV2({
    id: batchId, name: batchId, templateId: 'batch-b-test', templateVersion: 1,
    policyVersionLock: [], caseIds, createdAt: '2026-10-10T00:00:00Z',
  })
  for (const caseId of caseIds) updateCaseStatus(batchId, caseId, 'done')
  const state = readBatchStateV2(batchId)!
  state.status = 'queued'
  saveBatchStateV2(state)
  return batchId
}
const groupKey = (status: string) => JSON.stringify(['rule-a', status, '缺少证明'])
const request = (batchId: string, caseIds: string[], action: BatchGroupActionRequest['action'], status: string): BatchGroupActionRequest =>
  ({ batchId, groupKey: groupKey(status), caseIds, action, reason: '审核员核对材料和校验依据后人工认定', ...(action === 'request-supplement' || action === 'final-return' ? { requiredElements: ['原始获奖等级证明'] } : {}) })

describe('B 阶段：人工集中处置预览与逐案 V2 事务', () => {
  test('双案可预览并确认问题，结果持久化且同操作重放幂等', async () => {
    const a = await makeCase('non-compliant'), b = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId,b.caseId])
    const req = request(batchId,[a.caseId,b.caseId],'confirm-issue','non-compliant')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(2)
    const input = { ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true as const }
    const first = await applyBatchGroupAction(input)
    expect(first.applied).toBe(2)
    expect(first.failed).toBe(0)
    expect(readAggregate(a.caseId)?.dispositions.at(-1)?.disposition).toBe('confirmed-issue')
    expect(readAggregate(b.caseId)?.dispositions.at(-1)?.disposition).toBe('confirmed-issue')
    const second = await applyBatchGroupAction(input)
    expect(second).toEqual(first)
    expect(readAggregate(a.caseId)?.dispositions).toHaveLength(1)
    expect(readAggregate(b.caseId)?.dispositions).toHaveLength(1)
  })

  test('人工选择的范围精确生效，不得私自修改组内其他案卷', async () => {
    const a = await makeCase('non-compliant'), b = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId,b.caseId])
    const req = request(batchId,[a.caseId],'escalate','non-compliant')
    const preview = previewBatchGroupAction(req)
    expect(preview.rows).toHaveLength(1)
    const result = await applyBatchGroupAction({ ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true })
    expect(result.applied).toBe(1)
    expect(readAggregate(a.caseId)?.dispositions).toHaveLength(1)
    expect(readAggregate(b.caseId)?.dispositions).toHaveLength(0)
  })

  test('相似文本不代表证据可信：缺失来源的案卷单独排除，另一案照常处理', async () => {
    const a = await makeCase('non-compliant'), b = await makeCase('non-compliant', false)
    const batchId = makeBatch([a.caseId,b.caseId])
    const req = request(batchId,[a.caseId,b.caseId],'confirm-issue','non-compliant')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(1)
    expect(preview.rows.find((r) => r.caseId === b.caseId)?.reason).toContain('来源')
    const result = await applyBatchGroupAction({ ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true })
    expect(result.applied).toBe(1)
    expect(result.excluded).toBe(1)
    expect(readAggregate(b.caseId)?.dispositions).toHaveLength(0)
  })

  test('预览后案卷变化必须拒绝整次提交，不能沿用旧预览写入', async () => {
    const a = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId])
    const req = request(batchId,[a.caseId],'confirm-issue','non-compliant')
    const preview = previewBatchGroupAction(req)
    const changed = await submitCommand(a.caseId, {
      requestId: next('manual-update'), actor: reviewer, expectedRevision: 0,
      type: 'ChangeCaseFacts', payload: { val: 'changed' },
    }, () => ({ summary: '人工作出修改', mutate: (aggregate) => { aggregate.caseV2.caseFields = { changed: { kind: 'text', value: 'new' } } } }))
    expect(changed.ok).toBeTrue()
    await expect(applyBatchGroupAction({
      ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true,
    })).rejects.toThrow('预览后')
    expect(readAggregate(a.caseId)?.dispositions).toHaveLength(0)
  })

  test('明确补件必须给补正要素，调用原单案补件事务并记录处置', async () => {
    const a = await makeCase('awaiting-supplement')
    const batchId = makeBatch([a.caseId])
    const req = request(batchId,[a.caseId],'request-supplement','awaiting-supplement')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(1)
    const result = await applyBatchGroupAction({
      ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true,
    })
    expect(result.applied).toBe(1)
    const agg = readAggregate(a.caseId)!
    expect(agg.caseV2.stage).toBe('awaiting-supplement')
    expect(agg.supplements[0]?.requiredElements).toContain('原始获奖等级证明')
    expect(agg.dispositions[0]?.disposition).toBe('supplement-requested')
  })

  test('已发现明确不符合的案卷不允许靠问题组直接正式通过', async () => {
    const a = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId])
    const req = request(batchId,[a.caseId],'final-pass','non-compliant')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(0)
    expect(preview.rows[0]?.reason).toContain('阻断')
  })

  test('人工解决问题后才允许正式通过，且最终调用既有通过事务', async () => {
    const a = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId])
    const resolved = request(batchId, [a.caseId], 'false-positive', 'non-compliant')
    const firstPreview = previewBatchGroupAction(resolved)
    expect((await applyBatchGroupAction({
      ...resolved, previewHash: firstPreview.previewHash, operationId: next('operation-id'), confirmed: true,
    })).applied).toBe(1)
    const passRequest = request(batchId, [a.caseId], 'final-pass', 'non-compliant')
    const passPreview = previewBatchGroupAction(passRequest)
    expect(passPreview.eligibleCount).toBe(1)
    const outcome = await applyBatchGroupAction({
      ...passRequest, previewHash: passPreview.previewHash, operationId: next('operation-id'), confirmed: true,
    })
    expect(outcome.applied).toBe(1)
    const agg = readAggregate(a.caseId)!
    expect(agg.caseV2.stage).toBe('decided')
    expect(agg.decisions.at(-1)?.result).toBe('pass')
    expect(agg.decisions.at(-1)?.actor.actorSource).toBe('local')
  })

  test('明确补正缺项时，人工正式退回通过现有业务决定服务写补件', async () => {
    const a = await makeCase('awaiting-supplement')
    const batchId = makeBatch([a.caseId])
    const req = request(batchId, [a.caseId], 'final-return', 'awaiting-supplement')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(1)
    const result = await applyBatchGroupAction({
      ...req, previewHash: preview.previewHash, operationId: next('operation-id'), confirmed: true,
    })
    expect(result.applied).toBe(1)
    const agg = readAggregate(a.caseId)!
    expect(agg.decisions.at(-1)?.result).toBe('return')
    expect(agg.caseV2.stage).toBe('awaiting-supplement')
    expect(agg.supplements.at(-1)?.requiredElements).toContain('原始获奖等级证明')
  })

  test('存在其他角色的未办任务时，不允许 reviewer 代替该角色批量操作', async () => {
    const a = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId])
    const command = await submitCommand(a.caseId, {
      requestId: next('setup-teacher-task'), actor: reviewer, expectedRevision: 0,
      type: 'SeedTeacherTask', payload: {},
    }, () => ({ summary: '测试教师待办', mutate: (aggregate) => {
      aggregate.tasks = [...aggregate.tasks, {
        id: 'teacher-task', caseId: a.caseId, stageId: 'teacher-review', round: 1,
        assigneeRole: 'teacher', status: 'open', inputRevision: 0, createdAt: '2026-10-10T00:00:00Z',
      }]
    } }))
    expect(command.ok).toBeTrue()
    const req = request(batchId, [a.caseId], 'confirm-issue', 'non-compliant')
    const preview = previewBatchGroupAction(req)
    expect(preview.eligibleCount).toBe(0)
    expect(preview.rows[0]?.reason).toContain('其他角色')
  })

  test('未确认操作、重复 ID 更改载荷、或非法选择范围均不能写入', async () => {
    const a = await makeCase('non-compliant')
    const batchId = makeBatch([a.caseId])
    const req = request(batchId,[a.caseId],'confirm-issue','non-compliant')
    const preview = previewBatchGroupAction(req)
    const opId = next('operation-id')
    await expect(applyBatchGroupAction({ ...req, previewHash: preview.previewHash, operationId: opId, confirmed: false as never })).rejects.toThrow('确认')
    const valid = { ...req, previewHash: preview.previewHash, operationId: opId, confirmed: true as const }
    expect((await applyBatchGroupAction(valid)).applied).toBe(1)
    await expect(applyBatchGroupAction({ ...valid, reason: '不同业务意见' })).rejects.toThrow('不同载荷')
    expect(() => previewBatchGroupAction({ ...req, caseIds: ['foreign'] })).not.toThrow()
    expect(previewBatchGroupAction({ ...req, caseIds: ['foreign'] }).eligibleCount).toBe(0)
  })
})
