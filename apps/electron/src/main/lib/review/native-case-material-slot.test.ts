/** 原生案卷材料槽回归：少量缺件允许初审，最终决定仍由材料槽门控。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assessMaterialSlotV2, type MaterialSlotSpec, type TemplateVersion } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 'slot-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { createNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3, reclassifyNativeWorkspaceMaterialsV3 } =
  await import('./native-workspace-case-v3')
const { readAggregate } = await import('./case-store-v2')
const { saveDraft, publishTemplate } = await import('./template-store')
const { submitCaseV2, recordStageDecision, respondSupplementV2, resolveSupplementV2 } = await import('./stage-workflow')

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }
const templateId = 'slot-template'
const planSlot: MaterialSlotSpec = {
  id: 'plan', name: '实验计划', purpose: '核验实验计划材料', acceptedKinds: ['text'],
  acceptedRoles: ['evidence'], minCount: 1, maxCount: 1,
  requiredElements: [], allowReuseAcrossSubjects: false, requiredAt: 'submission',
}
const template = {
  templateId, version: 1, schemaVersion: 2, name: '材料槽模板',
  objectType: 'document', displayName: { template: '{{x}}' }, status: 'draft', createdAt: '',
  fields: [],
  sections: [{
    id: 'general', name: '一般检查', order: 1, required: false,
    criteria: [{ id: 'integrity', title: '材料可核验', requirement: '核对申报材料与审核要求', execution: 'semantic', targetScope: 'case' }],
  }],
  policyVersionIds: [], policyRefs: [], outputs: [],
  materialSlots: [planSlot],
  stages: [{ id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
} as never

async function createCase(title: string, selectedTemplateId: string = templateId): Promise<string> {
  const created = await createNativeWorkspaceCaseV3({
    title, type: '自定义审核', applicant: 'E2E',
    domainPackId: 'contract-review', reviewTemplate: { templateId: selectedTemplateId, version: 1 },
  }, actor)
  return created.aggregate.caseV2.id
}

describe('原生案卷材料槽', () => {
  test('少量必需材料缺件时允许初审并给出待补提示；槽位满足后不再提示缺件', async () => {
    saveDraft(template)
    publishTemplate(templateId, 1)
    const applicationFile = join(configDir, 'application.txt')
    const planFile = join(configDir, 'plan.txt')
    writeFileSync(applicationFile, '申请事项：实验项目', 'utf8')
    writeFileSync(planFile, '实验计划正文', 'utf8')

    const wrongRoleCaseId = await createCase('材料类别不匹配')
    await expect(registerNativeWorkspaceMaterialV3(wrongRoleCaseId, planFile, 'application', actor, undefined, 'plan'))
      .rejects.toThrow('材料类别')

    const missingCaseId = await createCase('少量缺件案卷')
    await registerNativeWorkspaceMaterialV3(missingCaseId, applicationFile, 'application', actor)
    await registerNativeWorkspaceMaterialV3(missingCaseId, planFile, 'evidence', actor)
    const missingSubmission = await submitCaseV2(missingCaseId)
    expect(missingSubmission.ok).toBe(true)
    if (!missingSubmission.ok) throw new Error(missingSubmission.message)
    expect(missingSubmission.receipt.summary).toContain('待补材料')
    expect(readAggregate(missingCaseId)?.caseV2.stage).toBe('submitted')

    const completeCaseId = await createCase('材料完整案卷')
    await registerNativeWorkspaceMaterialV3(completeCaseId, applicationFile, 'application', actor)
    await registerNativeWorkspaceMaterialV3(completeCaseId, planFile, 'evidence', actor, undefined, 'plan')
    expect(readAggregate(completeCaseId)?.caseV2.documents.some((document) =>
      document.active !== false && document.materialSlotId === 'plan')).toBe(true)
    const completeAggregate = readAggregate(completeCaseId)!
    const wrongRoleAggregate = {
      ...completeAggregate,
      caseV2: {
        ...completeAggregate.caseV2,
        documents: completeAggregate.caseV2.documents.map((document) =>
          document.materialSlotId === 'plan' ? { ...document, role: 'application' as const } : document),
      },
    }
    expect(assessMaterialSlotV2(wrongRoleAggregate, planSlot).status).toBe('awaiting-supplement')

    const completeSubmission = await submitCaseV2(completeCaseId)
    expect(completeSubmission.ok).toBe(true)
    if (!completeSubmission.ok) throw new Error(completeSubmission.message)
    expect(completeSubmission.receipt.summary).not.toContain('待补材料')

    // The legacy stage writer used run@rev even without a verified ReviewRun.
    // Native V3 must reject that writer rather than silently fabricate approval.
    const beforeDecision = readAggregate(completeCaseId)!
    const legacyDecision = await recordStageDecision(completeCaseId, {
      requestId: 'legacy-native-decision-blocked', actor,
      expectedRevision: beforeDecision.caseV2.revision,
      payload: {
        action: 'stage-pass',
        taskId: beforeDecision.tasks.find((task) => task.status === 'open')!.id,
        reason: '尝试走旧 V2 入口',
      },
    }, (await import('./template-store')).getTemplate(templateId, 1)!)
    expect(legacyDecision.ok).toBeFalse()
    if (!legacyDecision.ok) expect(legacyDecision.message).toContain('T05 可信阶段决定')
    expect(readAggregate(completeCaseId)?.decisions).toHaveLength(0)
  })


  test('模板能明确声明初审前关键材料，缺件阻断；其余槽位可延期到初审后补件', async () => {
    const strictId = 'slot-template-strict'
    const strictTemplate: TemplateVersion = {
      ...(template as TemplateVersion),
      templateId: strictId,
      materialSlots: [{ ...planSlot, initialReviewPolicy: 'block' }],
    }
    saveDraft(strictTemplate)
    publishTemplate(strictId, 1)
    const applicationFile = join(configDir, 'strict-application.txt')
    writeFileSync(applicationFile, '申请事项：实验项目', 'utf8')
    const strictCaseId = await createCase('初审关键材料缺失', strictId)
    await registerNativeWorkspaceMaterialV3(strictCaseId, applicationFile, 'application', actor)
    await expect(submitCaseV2(strictCaseId)).rejects.toThrow('初审前必须具备关键材料')
    expect(readAggregate(strictCaseId)?.caseV2.stage).toBe('draft')
    expect(readAggregate(strictCaseId)?.tasks).toHaveLength(0)
  })

  test('材料槽补件：仅有回复不能假称已满足；补齐且绑定正确槽位后才恢复来源任务', async () => {
    const applicationFile = join(configDir, 'supplement-application.txt')
    const proofFile = join(configDir, 'supplement-plan.txt')
    writeFileSync(applicationFile, '申请事项：真实实验项目', 'utf8')
    writeFileSync(proofFile, '实验计划及证明', 'utf8')
    const caseId = await createCase('材料槽真实补件核结')
    await registerNativeWorkspaceMaterialV3(caseId, applicationFile, 'application', actor)
    const submitted = await submitCaseV2(caseId)
    expect(submitted.ok).toBe(true)
    if (!submitted.ok) throw new Error(submitted.message)

    const { submitCommand, readAggregate: current } = await import('./case-store-v2')
    const initial = current(caseId)!
    const sourceTask = initial.tasks.find((task) => task.status === 'open')!
    const supplementId = 'sup-slot-' + caseId
    const requestSnapshot = initial.caseV2.documents.map((document) => document.versionId)
    const opened = await submitCommand(caseId, {
      requestId: 'slot-open-' + caseId,
      actor, expectedRevision: initial.caseV2.revision,
      type: 'TestOpenMaterialSlotSupplement', payload: {},
    }, () => ({
      summary: '构造 Main 已关联真实槽位的补件请求',
      mutate: (draft) => {
        draft.caseV2.stage = 'awaiting-supplement'
        draft.tasks = draft.tasks.map((task) => task.id === sourceTask.id
          ? { ...task, status: 'completed' as const } : task)
        draft.supplements.push({
          id: supplementId, caseId,
          originFindingKeys: ['system:material-slot:plan'],
          materialSlotId: 'plan',
          requiredElements: ['实验计划'], reason: '缺少实验计划',
          responsibleRole: 'student', status: 'open', responses: [],
          createdAt: new Date().toISOString(),
          originTaskId: sourceTask.id, originStageId: sourceTask.stageId,
          documentVersionIdsAtRequest: requestSnapshot,
        })
      },
    }))
    expect(opened.ok).toBeTrue()
    if (!opened.ok) return
    const student = { actorId: 'student-slot', actorSource: 'local' as const, role: 'student' as const }
    const noteOnly = await respondSupplementV2(caseId, {
      requestId: 'slot-note-' + caseId, actor: student,
      expectedRevision: opened.aggregate.caseV2.revision,
      payload: { supplementId, note: '我已经交过计划了' },
    })
    expect(noteOnly.ok).toBeTrue()
    if (!noteOnly.ok) return

    const denied = await resolveSupplementV2(caseId, {
      requestId: 'slot-deny-' + caseId, actor,
      expectedRevision: noteOnly.aggregate.caseV2.revision,
      payload: { supplementId, outcome: 'satisfied', reason: '仅凭说明误判为已齐全' },
    })
    expect(denied.ok).toBeFalse()
    if (!denied.ok) expect(denied.code).toBe('DEPENDENCY_UNRESOLVED')
    expect(current(caseId)!.supplements.find((item) => item.id === supplementId)?.status).toBe('responded')
    expect(current(caseId)!.caseV2.stage).toBe('awaiting-supplement')

    // The new evidence must be bound to the actual template slot; merely adding
    // an arbitrary attachment must not satisfy the supplement.
    await registerNativeWorkspaceMaterialV3(caseId, proofFile, 'evidence', actor, undefined, 'plan')
    const withProof = current(caseId)!
    const proof = withProof.caseV2.documents.find((document) =>
      document.fileName === 'supplement-plan.txt' && document.active !== false)!
    const proofReply = await respondSupplementV2(caseId, {
      requestId: 'slot-proof-' + caseId, actor: student,
      expectedRevision: withProof.caseV2.revision,
      payload: { supplementId, note: '上传补件计划', documentVersionIds: [proof.versionId] },
    })
    expect(proofReply.ok).toBeTrue()
    if (!proofReply.ok) return

    const accepted = await resolveSupplementV2(caseId, {
      requestId: 'slot-accept-' + caseId, actor,
      expectedRevision: proofReply.aggregate.caseV2.revision,
      payload: { supplementId, outcome: 'satisfied', reason: '核对材料类别和数量均已满足' },
    })
    expect(accepted.ok).toBeTrue()
    if (accepted.ok) {
      expect(accepted.aggregate.supplements.find((item) => item.id === supplementId)?.status).toBe('satisfied')
      expect(accepted.aggregate.caseV2.stage).toBe('reviewing')
      expect(accepted.aggregate.tasks.some((task) =>
        task.stageId === sourceTask.stageId && task.status === 'open')).toBeTrue()
    }
  })

  test('多件材料按模板改类为单次原子事务；不要求全局恰好一份申请件', async () => {
    const applicationFile = join(configDir, 'atomic-application.txt')
    const evidenceFile = join(configDir, 'atomic-evidence.txt')
    writeFileSync(applicationFile, '申请事项：实验项目', 'utf8')
    writeFileSync(evidenceFile, '证明正文', 'utf8')
    const caseId = await createCase('原子分类案卷')
    await registerNativeWorkspaceMaterialV3(caseId, applicationFile, 'application', actor)
    await registerNativeWorkspaceMaterialV3(caseId, evidenceFile, 'evidence', actor)
    const before = readAggregate(caseId)!
    const application = before.caseV2.documents.find((document) => document.fileName === 'atomic-application.txt')!
    const evidence = before.caseV2.documents.find((document) => document.fileName === 'atomic-evidence.txt')!
    const result = await reclassifyNativeWorkspaceMaterialsV3(caseId, [
      { documentVersionId: application.versionId, role: 'evidence' },
      { documentVersionId: evidence.versionId, role: 'rule' },
    ], actor)
    expect(result.documents.find((document) => document.id === evidence.documentId)?.role).toBe('rule')
    const afterAccepted = readAggregate(caseId)!
    expect(afterAccepted.caseV2.revision).toBe(before.caseV2.revision + 1)
    expect(afterAccepted.caseV2.documents.find((document) => document.versionId === application.versionId)?.role).toBe('evidence')
    expect(afterAccepted.caseV2.documents.filter((document) => document.active !== false).every((document) => document.role !== 'application')).toBe(true)
    expect(afterAccepted.caseV2.documents.map((document) => document.versionId)).toEqual(before.caseV2.documents.map((document) => document.versionId))
  })
})
