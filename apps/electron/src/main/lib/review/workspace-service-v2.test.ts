import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor } from '@profer/shared'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { getCase, saveCase } from './case-store'
import { ensureBuiltinTemplateDrafts } from './builtin-templates'
import { getTemplate as getTemplateStored, publishTemplate, saveDraft as saveDraftStored } from './template-store'
import { createAggregate, readAggregate } from './case-store-v2'
import { ensureWorkspaceAggregateV2, syncWorkspaceProjectionV2 } from './workspace-service-v2'
import { correctObservation, setEvidenceLink } from './application-service'
import { acknowledgeWorkspaceMaterialV2 } from './workspace-business-service-v2'
import { removeDocumentsFromCase, reorderDocumentsInCase } from './case-import'
import { registerMaterial } from './material-service'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-workspace-v2-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const reviewer: Actor = { actorId: 'reviewer-test', actorSource: 'local', role: 'reviewer' }

describe('单一工作台案卷映射到 V2 聚合', () => {
  test('首次打开时以同一 caseId 建立聚合，并投影材料、申报项与来源', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    saveCase(legacy)

    const aggregate = await ensureWorkspaceAggregateV2(legacy.id)
    expect(aggregate.caseV2.id).toBe(legacy.id)
    expect(aggregate.caseV2.subjects).toHaveLength(legacy.items.length)
    expect(aggregate.caseV2.documents).toHaveLength(legacy.documents.length)
    expect(aggregate.caseV2.subjects[0]?.sourceRefs[0]?.caseId).toBe(legacy.id)
    expect(aggregate.caseV2.subjects[0]?.sourceRefs[0]?.documentVersionId).toBe(`${legacy.items[0]?.anchor.documentId}-v1`)
    expect(readAggregate(legacy.id)?.receiptLog[0]?.actor?.actorSource).toBe('system')
  })

  test('同步新申报输入时保留人工事实与操作回执', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    saveCase(legacy)
    const initial = await ensureWorkspaceAggregateV2(legacy.id)
    const subjectId = legacy.items[0]!.id
    const corrected = await correctObservation(legacy.id, {
      requestId: 'workspace-manual-correction',
      actor: reviewer,
      expectedRevision: initial.caseV2.revision,
      payload: { subjectId, fieldKey: 'level', value: { kind: 'text', value: '人工确认等级' }, sourceRefs: [], reason: '核对原件后修正' },
    })
    expect(corrected.ok).toBeTrue()

    const nextLegacy = { ...legacy, items: legacy.items.map((item, index) => index === 0 ? { ...item, title: '更新后的申报事项' } : item) }
    saveCase(nextLegacy)
    const synced = await syncWorkspaceProjectionV2(legacy.id)
    expect(synced.caseV2.subjects[0]?.title).toBe('更新后的申报事项')
    expect(synced.observations.some((observation) => observation.value.kind === 'text' && observation.value.value === '人工确认等级')).toBeTrue()
    expect(synced.receiptLog.some((receipt) => receipt.type === 'CorrectObservation')).toBeTrue()
  })

  test('同步 V1 投影时保留 V2 工作台直接登记的新材料版本', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = { ...buildDemoCase(), id: 'workspace-v2-only-material-case' }
    saveCase(legacy)
    let aggregate = await ensureWorkspaceAggregateV2(legacy.id)
    const sourcePath = join(CONFIG_DIR, 'workbench-only-proof.html')
    writeFileSync(sourcePath, '<html><body><p>工作台补录材料</p></body></html>')

    const registered = await registerMaterial(legacy.id, {
      requestId: 'workspace-v2-only-material', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { sourcePath, role: 'evidence', materialSlotId: 'certificates' },
    })
    if (!registered.ok) throw new Error(registered.message)
    const versionId = registered.entity!.versionId

    aggregate = await syncWorkspaceProjectionV2(legacy.id)
    expect(aggregate.caseV2.documents.find((document) => document.versionId === versionId)).toMatchObject({
      fileName: 'workbench-only-proof.html', parseStatus: 'parsed', active: true,
    })
    expect(aggregate.caseV2.documents.filter((document) => document.versionId === versionId)).toHaveLength(1)
  })

  test('辅助审核页保存的模板版本与手写规则会和文件依据一起投影到审核输入', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    const chosenTemplate = getTemplateStored('scholarship-v2')
    expect(chosenTemplate).toBeDefined()
    const manualRules = [{ id: 'local-rule-1', title: '核对活动时间', requirement: '确认活动日期处于本次申报周期内。' }]
    saveCase({ ...legacy, reviewTemplate: { templateId: chosenTemplate!.templateId, version: chosenTemplate!.version }, manualRules })

    const aggregate = await ensureWorkspaceAggregateV2(legacy.id)

    expect(aggregate.caseV2.templateId).toBe(chosenTemplate!.templateId)
    expect(aggregate.caseV2.templateVersion).toBe(chosenTemplate!.version)
    expect(aggregate.caseV2.reviewRules?.some((rule) => rule.id === `manual:${legacy.id}:local-rule-1`)).toBeTrue()
    expect(aggregate.caseV2.reviewRules?.some((rule) => rule.sourceRefIds.some((sourceId) => sourceId.endsWith('-v1')))).toBeTrue()

    const synced = await syncWorkspaceProjectionV2(legacy.id)
    expect(synced.caseV2.templateId).toBe(chosenTemplate!.templateId)
    expect(synced.caseV2.reviewRules?.some((rule) => rule.id === `manual:${legacy.id}:local-rule-1`)).toBeTrue()
  })

  test('旧版空规则综测案卷升级到有整案检查的新版本并保留旧运行引用', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const current = getTemplateStored('comprehensive-assessment-v2', 3)!
    const stale = { ...current, version: 2, name: '学生综合测评（完整版）', sections: [], materialSlots: current.materialSlots.map(({ sectionId: _sectionId, ...slot }) => slot), policyRefs: undefined, status: 'draft' as const }
    saveDraftStored(stale)
    publishTemplate(stale.templateId, stale.version)

    const source = buildDemoCase()
    const legacy = { ...source, reviewTemplate: { templateId: stale.templateId, version: stale.version } }
    saveCase(legacy)
    const aggregate = await ensureWorkspaceAggregateV2(legacy.id)

    expect(getCase(legacy.id)?.reviewTemplate).toEqual({ templateId: current.templateId, version: current.version })
    expect(aggregate.caseV2.templateId).toBe(current.templateId)
    expect(aggregate.caseV2.templateVersion).toBe(current.version)
    expect(aggregate.caseV2.subjects).toHaveLength(legacy.items.length)
  })

  test('重新投影新申报材料时保留已读状态、确认的证明关联与人工事实', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    saveCase(legacy)
    let aggregate = await ensureWorkspaceAggregateV2(legacy.id)
    const subjectId = legacy.items[0]!.id
    const evidenceDocument = aggregate.caseV2.documents.find((document) => document.role === 'evidence')!
    const applicationDocument = aggregate.caseV2.documents.find((document) => document.role === 'application')!

    const acknowledged = await acknowledgeWorkspaceMaterialV2(legacy.id, {
      requestId: 'projection-material-read', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { documentVersionId: applicationDocument.versionId, action: 'read', reason: '已核对申报材料' },
    })
    expect(acknowledged.ok).toBeTrue()
    aggregate = readAggregate(legacy.id)!
    expect(aggregate.caseV2.documents.find((document) => document.versionId === applicationDocument.versionId)?.manualReadReceipt)
      .toMatchObject({ actorId: reviewer.actorId, reason: '已核对申报材料' })
    const candidate = await setEvidenceLink(legacy.id, {
      requestId: 'projection-evidence-candidate', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { documentVersionId: evidenceDocument.versionId, subjectIds: [subjectId], supportsFact: '获奖等级', linkedBy: 'user' },
    })
    expect(candidate.ok).toBeTrue()
    aggregate = readAggregate(legacy.id)!
    const linkId = aggregate.evidenceLinks.find((link) => link.subjectId === subjectId)!.id
    const confirmed = await setEvidenceLink(legacy.id, {
      requestId: 'projection-evidence-confirm', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { evidenceLinkId: linkId, documentVersionId: evidenceDocument.versionId, subjectIds: [subjectId], supportsFact: '获奖等级', linkedBy: 'user', status: 'confirmed' },
    })
    expect(confirmed.ok).toBeTrue()

    const newApplication = { ...legacy.documents.find((document) => document.role === 'application')!, id: 'new-application', fileName: '补充申报说明.txt' }
    saveCase({ ...legacy, documents: [...legacy.documents, newApplication], items: legacy.items.map((item, index) => index === 0 ? { ...item, title: '更新后的申报事项' } : item) })
    const synced = await syncWorkspaceProjectionV2(legacy.id)

    expect(synced.caseV2.subjects[0]?.title).toBe('更新后的申报事项')
    expect(synced.caseV2.documents.find((document) => document.versionId === applicationDocument.versionId)?.usage).toBe('read')
    expect(synced.evidenceLinks.find((link) => link.id === linkId)?.status).toBe('confirmed')
    expect(synced.receiptLog.some((receipt) => receipt.type === 'AcknowledgeWorkspaceMaterial')).toBeTrue()
    expect(synced.receiptLog.some((receipt) => receipt.type === 'SetEvidenceLink')).toBeTrue()
  })

  test('从证明栏移除材料时清理当前关联并保留不可用的版本与历史关联', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    saveCase(legacy)
    let aggregate = await ensureWorkspaceAggregateV2(legacy.id)
    const subjectId = legacy.items[0]!.id
    const evidenceDocument = legacy.documents.find((document) => document.role === 'evidence')!
    const linked = await setEvidenceLink(legacy.id, {
      requestId: 'remove-proof-link-create', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { documentVersionId: `${evidenceDocument.id}-v1`, subjectIds: [subjectId], supportsFact: '证明获奖情况', linkedBy: 'user' },
    })
    expect(linked.ok).toBeTrue()
    aggregate = readAggregate(legacy.id)!
    const linkId = aggregate.evidenceLinks.find((link) => link.documentVersionId === `${evidenceDocument.id}-v1`)!.id
    const confirmed = await setEvidenceLink(legacy.id, {
      requestId: 'remove-proof-link-confirm', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { evidenceLinkId: linkId, documentVersionId: `${evidenceDocument.id}-v1`, subjectIds: [subjectId], supportsFact: '证明获奖情况', linkedBy: 'user', status: 'confirmed' },
    })
    expect(confirmed.ok).toBeTrue()

    const removed = await removeDocumentsFromCase({ caseId: legacy.id, role: 'evidence', documentIds: [evidenceDocument.id] })
    aggregate = readAggregate(legacy.id)!
    expect(removed.documents.some((document) => document.id === evidenceDocument.id)).toBeFalse()
    expect(removed.archivedDocuments?.some((document) => document.id === evidenceDocument.id)).toBeTrue()
    expect(removed.evidences.some((evidence) => evidence.documentId === evidenceDocument.id)).toBeFalse()
    expect(removed.items.every((item) => !item.evidenceDocumentIds.includes(evidenceDocument.id))).toBeTrue()
    expect(aggregate.caseV2.documents.find((document) => document.versionId === `${evidenceDocument.id}-v1`)).toMatchObject({ active: false, usage: 'unread' })
    expect(aggregate.evidenceLinks.find((link) => link.id === linkId)?.status).toBe('rejected')
    expect(aggregate.receiptLog.some((receipt) => receipt.summary.includes('同步申报输入与材料'))).toBeTrue()
  })

  test('重排证明材料后 V1 与 V2 保持同一来源顺序', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const legacy = buildDemoCase()
    saveCase(legacy)
    await ensureWorkspaceAggregateV2(legacy.id)
    const expectedOrder = legacy.documents.filter((document) => document.role === 'evidence').map((document) => document.id).reverse()
    expect(expectedOrder.length).toBeGreaterThan(1)

    const reordered = await reorderDocumentsInCase({ caseId: legacy.id, role: 'evidence', documentIds: expectedOrder })
    const aggregate = readAggregate(legacy.id)!
    expect(reordered.documents.filter((document) => document.role === 'evidence').map((document) => document.id)).toEqual(expectedOrder)
    expect(aggregate.caseV2.documents.filter((document) => document.role === 'evidence').map((document) => document.documentId)).toEqual(expectedOrder)
  })

  test('审核依据按约束结构化编译，未确认内容仍保持人工检查', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const demo = buildDemoCase()
    const unconfirmed = { ...demo, rulePacks: demo.rulePacks.map((pack) => ({ ...pack, confirmed: false })) }
    saveCase(unconfirmed)
    const manual = await ensureWorkspaceAggregateV2(unconfirmed.id)
    expect(manual.caseV2.reviewRules?.length).toBeGreaterThan(0)
    expect(manual.caseV2.reviewRules?.every((rule) => rule.execution === 'manual' && rule.confirmation === 'unconfirmed')).toBeTrue()

    saveCase({ ...unconfirmed, rulePacks: unconfirmed.rulePacks.map((pack) => ({ ...pack, confirmed: true })) })
    const confirmed = await syncWorkspaceProjectionV2(unconfirmed.id)
    expect(confirmed.caseV2.reviewRules?.every((rule) => rule.confirmation === 'confirmed')).toBeTrue()
    expect(confirmed.caseV2.reviewRules?.some((rule) => rule.execution === 'deterministic')).toBeTrue()
    expect(confirmed.caseV2.reviewRules?.some((rule) => rule.execution === 'manual')).toBeTrue()
    expect(confirmed.caseV2.reviewRules?.[0]?.sourceRefIds[0]).toEndWith('-v1')
  })

  test('C1 native CurrentCase ignores stale V1 projection even on colliding caseId', async () => {
    const legacy = { ...buildDemoCase(), id: 'native-v2-no-legacy-writer' }
    saveCase(legacy)
    const seed = await ensureWorkspaceAggregateV2(legacy.id)
    const nativeId = 'native-v2-authority-collision'
    const native = {
      ...seed.caseV2, id: nativeId, title: 'Native authoritative title',
      subjects: [], documents: [], reviewRules: [], stage: 'draft' as const, revision: 0,
    }
    // A real collision starts with an old V1 shadow. A native Case written
    // afterwards must neither project it into current business state nor let
    // legacy writers change that shadow any further.
    saveCase({ ...legacy, id: nativeId, title: 'Stale V1 title' })
    await createAggregate(nativeId, native, {
      requestId: `create-${nativeId}`, type: 'CreateCaseFromTemplate', payloadHash: 'native-hash',
      revision: 0, at: new Date().toISOString(), summary: 'native', actor: reviewer,
    })
    expect(() => saveCase({ ...legacy, id: nativeId, title: 'Invalid late shadow' }))
      .toThrow('原生审核案卷禁止')
    const first = await ensureWorkspaceAggregateV2(nativeId)
    const second = await syncWorkspaceProjectionV2(nativeId)
    expect(first.caseV2.title).toBe('Native authoritative title')
    expect(second.caseV2.title).toBe('Native authoritative title')
    expect(second.caseV2.subjects).toEqual([])
    expect(second.receiptLog).toHaveLength(1)
  })

  test('C1 archive cascades to confirmed Observation and prevents reconfirmation on retired source', async () => {
    const legacy = { ...buildDemoCase(), id: 'archived-source-current-validity-c1' }
    saveCase(legacy)
    let aggregate = await ensureWorkspaceAggregateV2(legacy.id)
    const subjectId = aggregate.caseV2.subjects[0]!.id
    const version = aggregate.caseV2.documents.find((doc) => doc.role === 'evidence')!
    const manual = await correctObservation(legacy.id, {
      requestId: 'c1-correct-old-source', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: {
        subjectId, fieldKey: 'declaredScore', value: { kind: 'number', value: 4 },
        sourceRefs: [{ caseId: legacy.id, documentVersionId: version.versionId,
          parseRevision: version.parseRevision, location: { kind: 'file' } }],
        reason: '曾核对原件',
      },
    })
    expect(manual.ok).toBeTrue()
    const oldId = manual.ok ? manual.entity!.id : ''
    const originalDoc = legacy.documents.find((doc) => `${doc.id}-v1` === version.versionId)!
    await removeDocumentsFromCase({ caseId: legacy.id, role: 'evidence', documentIds: [originalDoc.id] })
    aggregate = readAggregate(legacy.id)!
    const oldFact = aggregate.observations.find((obs) => obs.id === oldId)!
    expect(oldFact.value).toEqual({ kind: 'number', value: 4 })
    expect(oldFact.sourceRefs[0]?.documentVersionId).toBe(version.versionId)
    expect(oldFact.confirmed).toBe(false)
    expect(aggregate.sourceValidityRevocations?.find((item) => item.documentVersionId === version.versionId)
      ?.previouslyConfirmedObservationIds).toContain(oldId)
    expect(aggregate.receiptLog.some((r) => r.requestId === 'c1-correct-old-source')).toBeTrue()
    const rejected = await setEvidenceLink(legacy.id, {
      requestId: 'c1-reconfirm-old', actor: reviewer, expectedRevision: aggregate.caseV2.revision,
      payload: { documentVersionId: version.versionId, subjectIds: [subjectId],
        supportsFact: 'old score', linkedBy: 'user' },
    })
    expect(rejected.ok).toBeFalse()
    if (!rejected.ok) expect(rejected.code).toBe('STALE_INPUT')
  })
})
