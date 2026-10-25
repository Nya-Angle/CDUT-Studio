import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, MaterialClassification, TemplateVersion } from '@profer/shared'
import { assessMaterialSlotV2 } from '@profer/shared'
import { createNativeWorkspaceCaseV3, reclassifyNativeWorkspaceMaterialV3, updateNativeWorkspaceSettingsV3 } from './native-workspace-case-v3'
import { readAggregate } from './case-store-v2'
import { registerMaterial } from './material-service'
import { saveDraft, publishTemplate, getTemplate } from './template-store'
import { applyAutomaticClassification, classifyNewNativeWorkspaceMaterial,
  highConfidenceDecision, admissibleAutomaticSlot, compatibleAiSlotRefinement,
  reclassifyForSelectedTemplate, CLASSIFICATION_AI_TIMEOUT_MS } from './material-auto-classification'

const root = join(import.meta.dir, '../../../../../../work/tmp', `auto-classify-2ab-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
mkdirSync(root, { recursive: true })
afterAll(() => rmSync(root, { force: true, recursive: true }))
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

async function createAttachment(name: string, text: string) {
  const created = await createNativeWorkspaceCaseV3({ title: name, type: '自定义审核', applicant: '测试用户',
    academicYear: '2026', domainPackId: 'custom' }, actor)
  const caseId = created.view.id
  const sourcePath = join(root, `${name}.txt`)
  writeFileSync(sourcePath, text, 'utf8')
  const initial = readAggregate(caseId)!
  const registered = await registerMaterial(caseId, {
    requestId: `registered-${name}`, actor, expectedRevision: initial.caseV2.revision,
    payload: { sourcePath, role: 'attachment' },
  })
  if (!registered.ok || !registered.entity) throw new Error('准备测试材料失败')
  return { caseId, document: registered.entity }
}

describe('2ab 基线：自动分拣仅在 C Main 入案', () => {
  test('高置信证书无需任何确认即可从 attachment 改为 evidence，并留下机器回执', async () => {
    const { caseId, document } = await createAttachment('获奖证书-高置信', '兹证明获得荣誉证书与获奖等级，颁发单位为主办方')
    let notified = 0
    await classifyNewNativeWorkspaceMaterial(caseId, document.documentId, document.versionId, actor,
      () => notified++)
    const current = readAggregate(caseId)!
    expect(current.caseV2.documents.find(item => item.versionId === document.versionId)?.role).toBe('evidence')
    expect(current.caseV2.documents.find(item => item.versionId === document.versionId)?.automaticClassification)
      .toMatchObject({ source: 'local-rules', role: 'evidence' })
    expect(current.receiptLog.map(entry => entry.type)).toContain('AutoClassifyNativeWorkspaceMaterialV3')
    expect(notified).toBe(1)
  })

  test('人工修正是不可覆盖的栅栏，不产生机器冒充人工记录', async () => {
    const { caseId, document } = await createAttachment('一份特殊附件', '没有材料身份的普通文本')
    await reclassifyNativeWorkspaceMaterialV3(caseId, {
      documentVersionId: document.versionId, role: 'application',
    }, actor)
    const before = JSON.stringify(readAggregate(caseId))
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId,
      { role: 'evidence', source: 'ai', reason: '迟到的模型' }, actor)).toBe(false)
    expect(JSON.stringify(readAggregate(caseId))).toBe(before)
    const current = readAggregate(caseId)!.caseV2.documents.find(item => item.versionId === document.versionId)!
    expect(current.classificationCorrection?.role).toBe('application')
    expect(current.automaticClassification).toBeUndefined()
  })

  test('用户拖动纠错已自动归类材料时撤销当前机器状态，保留不可变的历史回执', async () => {
    const { caseId, document } = await createAttachment('获奖证书-用户纠错', '荣誉证书 成绩单 兹证明')
    await classifyNewNativeWorkspaceMaterial(caseId, document.documentId, document.versionId, actor)
    expect(readAggregate(caseId)!.caseV2.documents.find(item => item.versionId === document.versionId)?.automaticClassification)
      .toBeDefined()
    await reclassifyNativeWorkspaceMaterialV3(caseId, {
      documentVersionId: document.versionId, role: 'application',
    }, actor)
    const snapshot = readAggregate(caseId)!
    const current = snapshot.caseV2.documents.find(item => item.versionId === document.versionId)!
    expect(current.role).toBe('application')
    expect(current.classificationCorrection?.role).toBe('application')
    expect(current.automaticClassification).toBeUndefined()
    expect(snapshot.receiptLog.map(item => item.type)).toContain('AutoClassifyNativeWorkspaceMaterialV3')
  })

  test('模型不能覆盖已自动分类的相同版本，也不能跨来源版本和模板应用', async () => {
    const { caseId, document } = await createAttachment('来源版本边界', '某些普通信息')
    const decision = { role: 'rule' as const, source: 'ai' as const, reason: '审核细则' }
    expect(await applyAutomaticClassification(caseId, document.documentId, 'other-version', decision, actor)).toBe(false)
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId,
      decision, actor, { templateId: 'wrong-template', version: 9 })).toBe(false)
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId, decision, actor)).toBe(true)
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId, decision, actor)).toBe(false)
  })

  test('文件早于模板上传：获奖证书与荣誉证书同义匹配，重选模板后自动补槽', async () => {
    const { caseId, document } = await createAttachment('获奖证书-选模板后补槽', '这是荣誉证书，颁发单位真实存在')
    await classifyNewNativeWorkspaceMaterial(caseId, document.documentId, document.versionId, actor)
    expect(readAggregate(caseId)!.caseV2.documents.find(item => item.versionId === document.versionId)?.materialSlotId)
      .toBeUndefined()
    const templateId = 'auto-proof-template'
    saveDraft({
      templateId, version: 1, schemaVersion: 2, name: '证书模板', objectType: 'document',
      displayName: { template: '{{x}}' }, status: 'draft', createdAt: '', fields: [],
      sections: [{ id: 'general', name: '通用', order: 1, required: false,
        criteria: [{ id: 'integrity', title: '材料核验', requirement: '核对原件', execution: 'semantic', targetScope: 'case' }] }],
      policyVersionIds: [], policyRefs: [], outputs: [],
      materialSlots: [{ id: 'award', name: '荣誉证书', purpose: '获奖证明', acceptedKinds: ['text'],
        acceptedRoles: ['evidence'], minCount: 1, maxCount: 10, requiredElements: [], allowReuseAcrossSubjects: false }],
      stages: [{ id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
    } as never)
    publishTemplate(templateId, 1)
    await updateNativeWorkspaceSettingsV3(caseId, {
      caseId, reviewTemplate: { templateId, version: 1 },
    }, actor)
    await reclassifyForSelectedTemplate(caseId, actor)
    const current = readAggregate(caseId)!.caseV2.documents.find(item => item.versionId === document.versionId)!
    expect(current.role).toBe('evidence')
    expect(current.materialSlotId).toBe('award')
    expect(current.classificationCorrection).toBeUndefined()
    const template = getTemplate(templateId, 1)!
    expect(assessMaterialSlotV2(readAggregate(caseId)!, template.materialSlots[0]!).status).toBe('compliant')
  })

  test('角色置信低不能直接应用；模型槽位只能绑定真实模板允许的种类和角色', () => {
    const weak: MaterialClassification = { status: 'ambiguous', source: 'local-rules', excerpts: [],
      candidates: [{ role: 'evidence', score: 10, reasons: ['证明'] }] }
    expect(highConfidenceDecision(weak)).toBeUndefined()
    expect(highConfidenceDecision({ ...weak, status: 'high' })?.role).toBe('evidence')
    expect(admissibleAutomaticSlot({ role: 'evidence', materialSlotId: 'unknown', source: 'ai', reason: 'test' },
      undefined, '证书.pdf')).toBeUndefined()
    const template = { materialSlots: [{
      id: 'proof', name: '获奖证书', purpose: '证明', acceptedKinds: ['pdf'], acceptedRoles: ['evidence'],
      minCount: 0, maxCount: 8, requiredElements: [], allowReuseAcrossSubjects: false,
    }] } as unknown as TemplateVersion
    const proof = { role: 'evidence' as const, materialSlotId: 'proof', source: 'ai' as const, reason: '已确认槽位属于模板' }
    expect(admissibleAutomaticSlot(proof, template, '奖状.pdf')).toBe('proof')
    expect(admissibleAutomaticSlot(proof, template, '奖状.exe')).toBeUndefined()
    expect(admissibleAutomaticSlot({ ...proof, role: 'application' }, template, '申请书.pdf')).toBeUndefined()
  })

  test('AI 仅在角色一致且给出真实槽位时补槽，不能把本地高置信证明材料变成申请表', () => {
    const result = { status: 'proposed' as const, role: 'evidence' as const,
      materialSlotId: 'award', rationale: '当前文件属于模板的获奖证明', submittedChars: 100 }
    expect(compatibleAiSlotRefinement('evidence', result)).toMatchObject({
      role: 'evidence', materialSlotId: 'award', source: 'ai',
    })
    expect(compatibleAiSlotRefinement('evidence', { ...result, role: 'application' })).toBeUndefined()
    expect(compatibleAiSlotRefinement('evidence', { ...result, materialSlotId: undefined })).toBeUndefined()
    expect(compatibleAiSlotRefinement('evidence', { ...result, status: 'unresolved' })).toBeUndefined()
  })

  test('模型只补槽不改类：旧机器结果可以被合法槽位细化，人工改类后迟到结果不得覆盖', async () => {
    const { caseId, document } = await createAttachment('获奖证书-等待槽位兜底', '获奖等级为二等奖，兹证明参赛有效')
    await classifyNewNativeWorkspaceMaterial(caseId, document.documentId, document.versionId, actor)
    const templateId = 'auto-slot-ai-refinement-template'
    saveDraft({
      templateId, version: 1, schemaVersion: 2, name: '专项成果审核', objectType: 'document',
      displayName: { template: '{{title}}' }, status: 'draft', createdAt: '', fields: [], sections: [],
      policyVersionIds: [], policyRefs: [], outputs: [],
      materialSlots: [{ id: 'competition', name: '专项成果附件', purpose: '收取赛事成果原件',
        acceptedKinds: ['text'], acceptedRoles: ['evidence'], minCount: 1, maxCount: 10,
        requiredElements: [], allowReuseAcrossSubjects: false }],
      stages: [{ id: 'review', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
    } as never)
    publishTemplate(templateId, 1)
    await updateNativeWorkspaceSettingsV3(caseId, { caseId, reviewTemplate: { templateId, version: 1 } }, actor)
    await reclassifyForSelectedTemplate(caseId, actor)
    expect(readAggregate(caseId)!.caseV2.documents[0]?.role).toBe('evidence')
    expect(readAggregate(caseId)!.caseV2.documents[0]?.materialSlotId).toBeUndefined()
    const decision = compatibleAiSlotRefinement('evidence', {
      status: 'proposed', role: 'evidence', materialSlotId: 'competition',
      rationale: '赛事成果原件属于本模板成果附件', submittedChars: 200,
    })!
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId,
      decision, actor, { templateId, version: 1 }, true)).toBeTrue()
    const refined = readAggregate(caseId)!.caseV2.documents[0]!
    expect(refined.role).toBe('evidence')
    expect(refined.materialSlotId).toBe('competition')
    expect(refined.automaticClassification?.source).toBe('ai')
    await reclassifyNativeWorkspaceMaterialV3(caseId, { documentVersionId: document.versionId,
      role: 'application' }, actor)
    expect(await applyAutomaticClassification(caseId, document.documentId, document.versionId,
      decision, actor, { templateId, version: 1 }, true)).toBeFalse()
    expect(readAggregate(caseId)!.caseV2.documents[0]?.role).toBe('application')
  })
})

describe('分类兜底超时', () => {
  test('两路短模型请求使用同一 30 秒上限（不重试、不提高并发）', () => {
    expect(CLASSIFICATION_AI_TIMEOUT_MS).toBe(30_000)
  })
})
