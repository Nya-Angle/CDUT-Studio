/**
 * B1 返修：导入草案的“补录必需分项”必须经 Main C0 授权命令落盘，
 * 且与普通建案/提交共用同一份已发布模板校验。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { REVIEW_C0_SCHEMA_VERSION, type TemplateVersion } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 'c0subject-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { saveDraft, publishTemplate, getTemplate } = await import('./template-store')
const { createCaseFromTemplate, upsertCaseSubject } = await import('./application-service')
const { readAggregate, payloadHash } = await import('./case-store-v2')
const { upsertCaseSubjectC0 } = await import('./review-c0-case-service')
const { submitCaseV2 } = await import('./stage-workflow')
const { registerMaterial } = await import('./material-service')

/** 提交审核要求至少一份已登记原件；用真实材料事务登记，不手写聚合。 */
async function addEvidenceMaterial(caseId: string): Promise<void> {
  const sourcePath = join(configDir, `evidence-${caseId}.txt`)
  writeFileSync(sourcePath, '证明材料')
  const current = readAggregate(caseId)!
  const result = await registerMaterial(caseId, {
    requestId: `seed-evidence-${caseId}`, actor,
    expectedRevision: current.caseV2.revision,
    payload: { sourcePath, role: 'evidence' },
  })
  expect(result.ok).toBe(true)
}

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

const template: TemplateVersion = {
  templateId: 'c0-subject-intake', version: 1, schemaVersion: 2, name: '分项补录模板',
  objectType: 'person', displayName: { template: 'x' }, status: 'draft', createdAt: '',
  fields: [
    { key: 'amount', label: '申报金额', kind: 'number', required: true, visibility: 'public', scope: 'case' },
    { key: 'projectName', label: '项目名称', kind: 'text', required: true, visibility: 'public', scope: 'subject' },
  ],
  sections: [{
    id: 'decl', name: '申报项目', order: 0, required: true,
    criteria: [{ id: 'c1', title: '金额核对', requirement: '核对申报金额', execution: 'semantic', targetScope: 'case' }],
  }],
  materialSlots: [],
  policyVersionIds: [], policyRefs: [], outputs: [],
  stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
}

/** 构造 Main 授权命令：真实 IPC 由 bindC0LocalCaseCommand 生成这些字段。 */
function authorized(caseId: string, action: 'UPSERT_CASE_SUBJECT_V2' | 'UPDATE_FIELDS_V2', requestId: string, expectedRevision: number, payload: unknown) {
  return {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId, requestId, expectedRevision,
    principal: {
      principalId: 'local-reviewer', sessionId: 'local-main:2',
      source: 'local', assurance: 'local-device', role: 'reviewer',
      scope: { caseIds: [caseId], actions: [action] },
    },
    payload, payloadHash: payloadHash('UpsertCaseSubject', payload),
  }
}

describe('导入草案补录必需分项（C0 真实写入路径）', () => {
  saveDraft(template)
  publishTemplate(template.templateId, 1)

  test('Given 缺必填字段与必需分项的入库草案 When Main 补录 Then 同一案卷可提交且持久化', async () => {
    const caseId = 'c0-subject-case'
    const created = await createCaseFromTemplate(template.templateId, 1, {
      title: '补录案卷', fieldValues: {}, subjects: [],
    }, actor, caseId, { allowIncompleteIntake: true })
    expect(created.ok).toBe(true)
    if (!created.ok) throw new Error('建案失败')
    const templateVersion = getTemplate(template.templateId, 1)!
    await addEvidenceMaterial(caseId)
    const beforeFill = readAggregate(caseId)!
    const filled = await (await import('./application-service')).updateFields(caseId, {
      requestId: 'fill-amount', actor, expectedRevision: beforeFill.caseV2.revision,
      payload: { caseFieldValues: { amount: 5000 } },
    }, templateVersion)
    expect(filled.ok).toBe(true)
    const current = readAggregate(caseId)!
    const added = await upsertCaseSubjectC0(authorized(
      caseId, 'UPSERT_CASE_SUBJECT_V2', 'add-subject', current.caseV2.revision,
      { title: '项目一', sectionId: 'decl', fieldValues: { projectName: '数学建模' } },
    ) as never)
    expect(added.ok).toBe(true)
    // 重新读盘：分项与字段真实持久化，而不是只存在返回值里
    const persisted = readAggregate(caseId)!
    expect(persisted.caseV2.subjects).toHaveLength(1)
    expect(persisted.caseV2.subjects[0]!.sectionId).toBe('decl')
    expect(persisted.caseV2.subjects[0]!.fields.projectName).toEqual({ kind: 'text', value: '数学建模' })
    const submitted = await submitCaseV2(caseId)
    expect(submitted.ok).toBe(true)
    expect(readAggregate(caseId)!.caseV2.stage).toBe('submitted')
  })

  test('Given 已提交案卷 When 补录分项 Then 拒绝（不能绕过阶段门禁）', async () => {
    const caseId = 'c0-subject-submitted'
    await createCaseFromTemplate(template.templateId, 1, {
      title: '已提交案卷', fieldValues: { amount: 1 },
      subjects: [{ id: 's1', title: '项目一', type: 'item', sectionId: 'decl', fieldValues: { projectName: 'x' } }],
    }, actor, caseId)
    await addEvidenceMaterial(caseId)
    const submitted = await submitCaseV2(caseId)
    expect(submitted.ok).toBe(true)
    const current = readAggregate(caseId)!
    const rejected = await upsertCaseSubjectC0(authorized(
      caseId, 'UPSERT_CASE_SUBJECT_V2', 'late-subject', current.caseV2.revision,
      { title: '项目二', sectionId: 'decl', fieldValues: { projectName: 'y' } },
    ) as never)
    expect(rejected.ok).toBe(false)
    expect(rejected.ok ? '' : rejected.message).toContain('仅草案阶段')
  })

  test('Given 越权 scope（仅 UPDATE_FIELDS_V2） When 补录分项 Then C0 授权拒绝', async () => {
    const caseId = 'c0-subject-scope'
    await createCaseFromTemplate(template.templateId, 1, {
      title: '越权案卷', fieldValues: { amount: 1 }, subjects: [],
    }, actor, caseId, { allowIncompleteIntake: true })
    const current = readAggregate(caseId)!
    expect(() => upsertCaseSubjectC0(authorized(
      caseId, 'UPDATE_FIELDS_V2', 'scope-subject', current.caseV2.revision,
      { title: '项目一', sectionId: 'decl', fieldValues: { projectName: 'z' } },
    ) as never)).toThrow('CASE_SCOPE_FORBIDDEN')
  })

  test('Given 缺少必填事项字段 When 补录 Then 拒绝且不落半条事项', async () => {
    const caseId = 'c0-subject-missing-field'
    await createCaseFromTemplate(template.templateId, 1, {
      title: '缺字段案卷', fieldValues: { amount: 1 }, subjects: [],
    }, actor, caseId, { allowIncompleteIntake: true })
    const current = readAggregate(caseId)!
    const rejected = await upsertCaseSubject(caseId, {
      requestId: 'missing-field', actor, expectedRevision: current.caseV2.revision,
      payload: { title: '项目一', sectionId: 'decl', fieldValues: {} },
    }, getTemplate(template.templateId, 1))
    expect(rejected.ok).toBe(false)
    expect(rejected.ok ? '' : rejected.message).toContain('项目名称')
    expect(readAggregate(caseId)!.caseV2.subjects).toHaveLength(0)
  })
})
