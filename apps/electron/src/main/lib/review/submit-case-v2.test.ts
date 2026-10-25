import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createCaseFromTemplate } from './application-service'
import { readAggregate, submitCommand } from './case-store-v2'
import { publishComprehensiveFixture } from './fixtures/comprehensive-fixture'
import { registerMaterial } from './material-service'
import { createNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3 } from './native-workspace-case-v3'
import { submitCaseV2 } from './stage-workflow'
import { getTemplate, publishTemplate, saveDraft } from './template-store'
import type { MaterialSlotSpec, TemplateVersion } from '@profer/shared'

const config = mkdtempSync(join(tmpdir(), 'cdut-submit-case-test-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))
const actor = { actorId: 'reviewer', actorSource: 'local', role: 'reviewer' } as const
publishComprehensiveFixture({ getTemplate, saveDraft, publish: publishTemplate })
const material = join(config, 'evidence.txt')
writeFileSync(material, '虚构提交测试材料')

async function seed(caseId: string): Promise<void> {
  await createCaseFromTemplate('comprehensive-assessment-v2', 2, {
    title: '提交测试', fieldValues: { studentName: '测试学生', studentId: '001', academicYear: '2025-2026', applicant: '测试学生' }, subjects: [{ id: 's-submit', title: '竞赛申报事项', type: 'item' as const, fieldValues: { category: 'competition', level: 'national-1', declaredScore: 8, activityDate: '2026-10-01', eventId: 'event-submit' } }],
  }, actor, caseId)
  await registerMaterial(caseId, { requestId: 'register', actor, expectedRevision: 0, payload: { sourcePath: material, role: 'application', materialSlotId: 'application-form' } })
  await registerMaterial(caseId, { requestId: 'register-cert', actor, expectedRevision: 1, payload: { sourcePath: material, role: 'evidence', materialSlotId: 'certificates' } })
}

describe('提交案卷的原子事务', () => {
  test('有申报表但没有证明时仍可提交审核', async () => {
    await createCaseFromTemplate('comprehensive-assessment-v2', 2, {
      title: '缺证明测试', fieldValues: { studentName: '测试学生', studentId: '002', academicYear: '2025-2026', applicant: '测试学生' }, subjects: [{ id: 's-submit', title: '竞赛申报事项', type: 'item' as const, fieldValues: { category: 'competition', level: 'national-1', declaredScore: 8, activityDate: '2026-10-01', eventId: 'event-submit' } }],
    }, actor, 'missing-evidence')
    await registerMaterial('missing-evidence', { requestId: 'register-application', actor, expectedRevision: 0, payload: { sourcePath: material, role: 'application', materialSlotId: 'application-form' } })
    const result = await submitCaseV2('missing-evidence')
    expect(result.ok).toBe(true)
    expect(readAggregate('missing-evidence')?.caseV2.stage).toBe('submitted')
  })

  test('没有申报表时仍被提交门槛阻断', async () => {
    await createCaseFromTemplate('comprehensive-assessment-v2', 2, {
      title: '无申报表测试', fieldValues: { studentName: '测试学生', studentId: '003', academicYear: '2025-2026', applicant: '测试学生' }, subjects: [],
    }, actor, 'missing-application')
    await registerMaterial('missing-application', { requestId: 'register-certificate', actor, expectedRevision: 0, payload: { sourcePath: material, role: 'evidence', materialSlotId: 'certificates' } })
    await expect(submitCaseV2('missing-application')).rejects.toThrow('缺少明确的申报材料')
  })

  test('Given 已登记材料且 revision 非零 When 提交 Then 状态和首任务一次落盘', async () => {
    await seed('normal')
    const before = readAggregate('normal')!
    const result = await submitCaseV2('normal')
    expect(result.ok).toBe(true)
    const after = readAggregate('normal')!
    expect(after.caseV2.stage).toBe('submitted')
    expect(after.caseV2.revision).toBe(before.caseV2.revision + 1)
    expect(after.tasks).toHaveLength(1)
    expect(after.tasks[0]!.stageId).toBe('auto-check')
    expect(after.receiptLog.at(-1)!.type).toBe('SubmitCase')
  })

  test('Given 旧实现留下 submitted 但无任务 When 恢复提交 Then 补任务且不重建案卷', async () => {
    await seed('legacy')
    await submitCommand('legacy', { requestId: 'legacy-submit', actor, expectedRevision: 2, type: 'SubmitCase', payload: {} }, () => ({
      summary: '模拟旧实现的中间状态', mutate: draft => { draft.caseV2.stage = 'submitted' },
    }))
    const beforeRecovery = readAggregate('legacy')!
    expect(beforeRecovery.caseV2.stage).toBe('submitted')
    expect(beforeRecovery.tasks).toHaveLength(0)
    const result = await submitCaseV2('legacy')
    expect(result.ok).toBe(true)
    const after = readAggregate('legacy')!
    expect(after.tasks).toHaveLength(1)
    expect(after.caseV2.documents).toHaveLength(2)
    // The simulated legacy write is itself a committed revision. Recovery must
    // atomically add exactly one task, without recreating either material.
    expect(after.caseV2.revision).toBe(beforeRecovery.caseV2.revision + 1)
    expect(after.receiptLog.at(-1)?.type).toBe('SubmitCase')
  })

  test('Given 提交重试 When 连续调用 Then 只有一个首任务和一次业务 revision', async () => {
    await seed('retry')
    const first = await submitCaseV2('retry')
    expect(first.ok).toBe(true)
    const revision = readAggregate('retry')!.caseV2.revision
    const second = await submitCaseV2('retry')
    expect(second.ok).toBe(true)
    expect(readAggregate('retry')!.caseV2.revision).toBe(revision)
    expect(readAggregate('retry')!.tasks).toHaveLength(1)
  })
})

describe('一个综测案卷包含多个独立审核分项', () => {
  const sectionedTemplate: TemplateVersion = {
    templateId: 'comprehensive-sections-test', version: 1, schemaVersion: 2, name: '分项综测测试', objectType: 'person',
    displayName: { template: '{{studentName}}' },
    fields: [
      { key: 'studentName', label: '学生姓名', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'credits', label: '学分', kind: 'number', required: true, visibility: 'public', scope: 'subject', sectionId: 'study' },
      { key: 'confirmed', label: '已确认', kind: 'boolean', required: false, visibility: 'public', scope: 'subject', sectionId: 'study' },
      { key: 'hours', label: '服务时长', kind: 'number', required: true, visibility: 'public', scope: 'subject', sectionId: 'service' },
    ],
    materialSlots: [], sections: [
      { id: 'study', name: '学业发展', order: 0, required: true, criteria: [{ id: 'credit-check', title: '学分核验', requirement: '核对学分材料', execution: 'semantic', targetScope: 'subject' }] },
      { id: 'service', name: '志愿服务', order: 1, required: true, criteria: [{ id: 'hour-check', title: '时长核验', requirement: '核对服务时长证明', execution: 'semantic', targetScope: 'subject' }] },
    ],
    policyVersionIds: [], stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }], outputs: [], status: 'draft', createdAt: new Date().toISOString(),
  }
  saveDraft(sectionedTemplate)
  publishTemplate(sectionedTemplate.templateId, sectionedTemplate.version)

  test('一个案卷创建后保留不同分项的字段与申报事项', async () => {
    const created = await createCaseFromTemplate(sectionedTemplate.templateId, 1, {
      title: '张同学综测', fieldValues: { studentName: '张同学' }, subjects: [
        { id: 'study-item', title: '课程学业表现', type: 'item', sectionId: 'study', fieldValues: { credits: 24, confirmed: 'false' } },
        { id: 'service-item', title: '志愿服务记录', type: 'item', sectionId: 'service', fieldValues: { hours: 32 } },
      ],
    }, actor, 'sectioned-review-case')
    if (!created.ok) throw new Error(created.message)
    const entity = created.entity
    if (!entity) throw new Error('案卷创建结果缺少实体')

    expect(entity.subjects.map((subject) => [subject.sectionId, subject.title])).toEqual([
      ['study', '课程学业表现'], ['service', '志愿服务记录'],
    ])
    expect(entity.subjects[0]?.fields.credits).toEqual({ kind: 'number', value: 24 })
    expect(entity.subjects[0]?.fields.confirmed).toEqual({ kind: 'boolean', value: false })
    expect(entity.subjects[1]?.fields.hours).toEqual({ kind: 'number', value: 32 })
  })

  test('缺少必需分项时拒绝创建，避免案卷漏项', async () => {
    await expect(createCaseFromTemplate(sectionedTemplate.templateId, 1, {
      title: '缺少志愿服务分项', fieldValues: { studentName: '张同学' }, subjects: [
        { id: 'study-only', title: '课程学业表现', type: 'item', sectionId: 'study', fieldValues: { credits: 24 } },
      ],
    }, actor, 'sectioned-review-missing-service')).rejects.toThrow('案卷缺少必需分项：志愿服务')
  })
})

describe('原生 V3 材料槽提交合同（PR272 block-only）', () => {
  const nativeActor = { actorId: 'native-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }
  const planSlot: MaterialSlotSpec = {
    id: 'plan', name: '实验计划', purpose: '核验实验计划材料', acceptedKinds: ['text'],
    acceptedRoles: ['evidence'], minCount: 1, maxCount: 1,
    requiredElements: [], allowReuseAcrossSubjects: false, requiredAt: 'submission',
  }
  const nativeTemplate: TemplateVersion = {
    templateId: 'slot-contract-native-test', version: 1, schemaVersion: 2, name: '材料槽合同测试',
    objectType: 'document', displayName: { template: '{{title}}' }, status: 'draft', createdAt: '',
    fields: [],
    sections: [{
      id: 'general', name: '一般检查', order: 1, required: false,
      criteria: [{ id: 'integrity', title: '材料可核验', requirement: '核对申报材料与审核要求', execution: 'semantic', targetScope: 'case' }],
    }],
    policyVersionIds: [], policyRefs: [], outputs: [],
    materialSlots: [planSlot],
    stages: [{ id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
  }
  saveDraft(nativeTemplate)
  publishTemplate(nativeTemplate.templateId, nativeTemplate.version)

  async function createNativeCase(title: string, templateId = nativeTemplate.templateId): Promise<string> {
    const created = await createNativeWorkspaceCaseV3({
      title, type: '自定义审核', applicant: 'E2E',
      domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 },
    }, nativeActor)
    return created.aggregate.caseV2.id
  }

  async function registerApplication(caseId: string, fileName: string): Promise<void> {
    const path = join(config, fileName)
    writeFileSync(path, '申请事项：实验项目')
    await registerNativeWorkspaceMaterialV3(caseId, path, 'application', nativeActor)
  }

  test('defer 槽位缺件时提交初审成功、stage=submitted 且回执记录待补材料', async () => {
    const caseId = await createNativeCase('defer 缺件')
    await registerApplication(caseId, 'native-defer-application.txt')
    const result = await submitCaseV2(caseId)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.receipt.summary).toContain('待补材料')
      expect(result.aggregate.caseV2.stage).toBe('submitted')
      expect(result.aggregate.tasks).toHaveLength(1)
    }
  })

  test('initialReviewPolicy=block 缺件时阻断并保留 draft 且不建首任务', async () => {
    const blockTemplateId = 'slot-contract-native-block-test'
    const blockTemplate: TemplateVersion = {
      ...nativeTemplate,
      templateId: blockTemplateId,
      materialSlots: [{ ...planSlot, initialReviewPolicy: 'block' }],
    }
    saveDraft(blockTemplate)
    publishTemplate(blockTemplateId, 1)
    const caseId = await createNativeCase('block 缺件', blockTemplateId)
    await registerApplication(caseId, 'native-block-application.txt')
    await expect(submitCaseV2(caseId)).rejects.toThrow('初审前必须具备关键材料')
    const after = readAggregate(caseId)!
    expect(after.caseV2.stage).toBe('draft')
    expect(after.tasks).toHaveLength(0)
  })

  test('超过模板槽位上限时阻断', async () => {
    const caseId = await createNativeCase('超限')
    await registerApplication(caseId, 'native-over-application.txt')
    for (const fileName of ['native-plan-a.txt', 'native-plan-b.txt']) {
      const path = join(config, fileName)
      writeFileSync(path, '实验计划正文')
      await registerNativeWorkspaceMaterialV3(caseId, path, 'evidence', nativeActor, undefined, 'plan')
    }
    await expect(submitCaseV2(caseId)).rejects.toThrow('材料数量超过模板上限')
  })
})
