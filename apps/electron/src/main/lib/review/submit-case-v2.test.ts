import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createCaseFromTemplate } from './application-service'
import { readAggregate, submitCommand } from './case-store-v2'
import { publishComprehensiveFixture } from './fixtures/comprehensive-fixture'
import { registerMaterial } from './material-service'
import { submitCaseV2 } from './stage-workflow'
import { getTemplate, publishTemplate, saveDraft } from './template-store'
import type { TemplateVersion } from '@profer/shared'

const config = mkdtempSync(join(tmpdir(), 'cdut-submit-case-test-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))
const actor = { actorId: 'reviewer', actorSource: 'local', role: 'reviewer' } as const
publishComprehensiveFixture({ getTemplate, saveDraft, publish: publishTemplate })
const material = join(config, 'evidence.txt')
writeFileSync(material, '虚构提交测试材料')

async function seed(caseId: string): Promise<void> {
  await createCaseFromTemplate('comprehensive-assessment-v2', 2, {
    title: '提交测试', fieldValues: { studentName: '测试学生', studentId: '001', academicYear: '2025-2026', applicant: '测试学生' }, subjects: [],
  }, actor, caseId)
  await registerMaterial(caseId, { requestId: 'register', actor, expectedRevision: 0, payload: { sourcePath: material, role: 'evidence', materialSlotId: 'application-form' } })
  await registerMaterial(caseId, { requestId: 'register-cert', actor, expectedRevision: 1, payload: { sourcePath: material, role: 'evidence', materialSlotId: 'certificates' } })
}

describe('提交案卷的原子事务', () => {
  test('有申报表但没有证明时仍可提交审核', async () => {
    await createCaseFromTemplate('comprehensive-assessment-v2', 2, {
      title: '缺证明测试', fieldValues: { studentName: '测试学生', studentId: '002', academicYear: '2025-2026', applicant: '测试学生' }, subjects: [],
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
    await expect(submitCaseV2('missing-application')).rejects.toThrow('缺少必需材料：综合测评申报表')
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
    await submitCommand('legacy', { requestId: 'legacy-submit', actor, expectedRevision: 1, type: 'SubmitCase', payload: {} }, () => ({
      summary: '模拟旧实现的中间状态', mutate: draft => { draft.caseV2.stage = 'submitted' },
    }))
    const result = await submitCaseV2('legacy')
    expect(result.ok).toBe(true)
    const after = readAggregate('legacy')!
    expect(after.tasks).toHaveLength(1)
    expect(after.caseV2.documents).toHaveLength(2)
    expect(after.caseV2.revision).toBe(3) // 双材料登记 r2 + 恢复提交合并一次 r3
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
