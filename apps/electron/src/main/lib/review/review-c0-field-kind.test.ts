/** 字段类型权威：已发布模板的 FieldSpec 决定 kind，未发布则拒绝写入。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { REVIEW_C0_SCHEMA_VERSION, type TemplateVersion } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 'c0kind-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { saveDraft, publishTemplate } = await import('./template-store')
const { createCaseFromTemplate } = await import('./application-service')
const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }
const { readAggregate } = await import('./case-store-v2')
const { updateFieldsC0 } = await import('./review-c0-case-service')
const { payloadHash } = await import('./case-store-v2')

/** 构造 Main 授权命令：真实 IPC 由 bindC0LocalCaseCommand 生成这些字段。 */
function authorized(caseId: string, requestId: string, expectedRevision: number, payload: unknown) {
  return {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId, requestId, expectedRevision,
    principal: {
      principalId: 'local-reviewer', sessionId: 'local-main:1',
      source: 'local', assurance: 'local-device', role: 'reviewer',
      scope: { caseIds: [caseId], actions: ['UPDATE_FIELDS_V2'] },
    },
    payload, payloadHash: payloadHash('UpdateFields', payload),
  }
}

const principal = { principalId: 'local-reviewer', role: 'reviewer' as const }

function template(templateId: string, status: 'draft' | 'published'): TemplateVersion {
  return {
    templateId, version: 1, schemaVersion: 2, name: '字段类型模板',
    objectType: 'organization', displayName: { template: 'x' }, status, createdAt: '',
    fields: [
      { key: 'applicantCount', label: '人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
      { key: 'usageDate', label: '日期', kind: 'date', required: true, visibility: 'public', scope: 'case' },
      { key: 'organizationName', label: '组织', kind: 'text', required: true, visibility: 'public', scope: 'case' },
    ],
    sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [], outputs: [],
    stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
  }
}

describe('字段类型权威', () => {
  test('已发布模板：数字与日期按真实 kind 写入，不再一律当文本', async () => {
    const templateId = 'c0-kind-published'
    saveDraft(template(templateId, 'draft'))
    publishTemplate(templateId, 1)
    const caseId = 'c0-kind-pub-case'
    const created = await createCaseFromTemplate(templateId, 1, {
      title: '类型案卷', fieldValues: { applicantCount: 18, usageDate: '2026-11-01', organizationName: '地球物理学院' }, subjects: [],
    } as never, actor, caseId)
    expect(created.ok).toBe(true)
    if (!created.ok) throw new Error('建案失败')
    const result = await updateFieldsC0(authorized(caseId, 'kind-1', created.aggregate.caseV2.revision,
      { caseFieldValues: { applicantCount: 18, usageDate: '2026-11-01', organizationName: '地球物理学院' } }) as never)
    expect(result.ok).toBe(true)
    const fields = readAggregate(caseId)!.caseV2.caseFields
    expect(fields.applicantCount).toMatchObject({ kind: 'number', value: 18 })
    expect(fields.usageDate).toMatchObject({ kind: 'date', value: '2026-11-01' })
    expect(fields.organizationName).toMatchObject({ kind: 'text', value: '地球物理学院' })
  })

  test('已发布模板：非法数字值被拒绝，不会静默存成文本', async () => {
    const templateId = 'c0-kind-invalid'
    saveDraft(template(templateId, 'draft'))
    publishTemplate(templateId, 1)
    const caseId = 'c0-kind-invalid-case'
    await createCaseFromTemplate(templateId, 1, {
      title: '非法值案卷',
      fieldValues: { applicantCount: 18, usageDate: '2026-11-01', organizationName: '地球物理学院' },
      subjects: [],
    } as never, actor, caseId)
    const current = readAggregate(caseId)!
    const bad = await updateFieldsC0(authorized(caseId, 'kind-bad', current.caseV2.revision,
      { caseFieldValues: { applicantCount: '不是数字' } }) as never)
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.code).toBe('VALIDATION_FAILED')
  })
})
