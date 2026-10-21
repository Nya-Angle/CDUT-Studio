import { expect, test } from 'bun:test'
import { suggestT06ApplicantFromFolder, suggestT06GroupTemplate } from './review-v3-t06-template-route'
import { planT06PhysicalImport, previewT06PhysicalImport } from './review-v3-t06-physical-intake'

const source = {
  selectionId: 'trusted-selection', previewFingerprint: 'trusted-sha', sourceKind: 'zip' as const,
  entries: [
    { entryId: 'a', relativePath: '活动场地申请/申请.pdf', byteLength: 10 },
    { entryId: 'b', relativePath: '公共邮箱申请/申请.pdf', byteLength: 10 },
  ],
}
const templates = [
  { templateId: 'venue-application', version: 3, name: '活动场地申请' },
  { templateId: 'public-mail', version: 1, name: '公共邮箱申请' },
]

test('T06 对有唯一目录线索的混合业务逐案建议不同已发布模板', () => {
  const preview = previewT06PhysicalImport(source)
  const first = suggestT06GroupTemplate(preview.groups[0]!, templates)
  const second = suggestT06GroupTemplate(preview.groups[1]!, templates)
  expect(first?.templateId).toBe('venue-application')
  expect(second?.templateId).toBe('public-mail')

  const planned = planT06PhysicalImport(preview, {
    'group:活动场地申请': { action: 'create', title: '场地', applicant: '甲', templateId: first?.templateId, templateVersion: first?.version },
    'group:公共邮箱申请': { action: 'create', title: '邮箱', applicant: '乙', templateId: second?.templateId, templateVersion: second?.version },
  }, { requestId: 'mixed', batchName: '混合批次', knownCaseIds: [] })
  expect(planned.errors).toEqual([])
  expect(planned.request?.groups.map(group => group.templateId)).toEqual(['venue-application', 'public-mail'])
})

test('T06 未知或含糊目录不会静默猜模板', () => {
  const unknown = { groupId: 'x', name: '其他材料', entries: [{ entryId: 'x', relativePath: '其他材料/a.pdf', byteLength: 12 }], unassigned: false }
  expect(suggestT06GroupTemplate(unknown, templates)).toBeUndefined()
  const preview = previewT06PhysicalImport({ ...source, entries: [source.entries[0]!] })
  const result = planT06PhysicalImport(preview, {
    'group:活动场地申请': { action: 'create', title: '案卷', applicant: '甲' },
  }, { requestId: 'x', batchName: 'b', knownCaseIds: [] })
  expect(result.request).toBeUndefined()
  expect(result.errors.some(error => error.includes('模板'))).toBe(true)
})

test('T06 只自动填写明确标注的申请人，不把业务文件夹名称当身份', () => {
  expect(suggestT06ApplicantFromFolder('G02-T01_申请人=张三')).toBe('张三')
  expect(suggestT06ApplicantFromFolder('公共邮箱申请')).toBeUndefined()
})
