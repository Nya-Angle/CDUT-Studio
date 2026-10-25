/**
 * OFF-05：离线补件附件必须保留原文件名并绑定补件槽位。
 * 使用真实 Case 聚合与真实材料事务（V2 模板案卷 + 原生案卷两种通道）。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, TemplateVersion } from '@profer/shared'

const root = join(import.meta.dir, '../../../../../../work/tmp', `t09-asset-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
mkdirSync(root, { recursive: true })
afterAll(() => rmSync(root, { force: true, recursive: true }))

const { saveDraft, publishTemplate } = await import('./template-store')
const { createCaseFromTemplate } = await import('./application-service')
const { readAggregate } = await import('./case-store-v2')
const { createNativeWorkspaceCaseV3 } = await import('./native-workspace-case-v3')
const { getTemplate } = await import('./template-store')
const { registerT09StudentAsset } = await import('./review-v3-t09-asset-registration')
const { t09AssetTempRoot } = await import('./review-v3-t09-main-service')

const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

const template: TemplateVersion = {
  templateId: 't09-slot-template', version: 1, schemaVersion: 2, name: '补件槽模板',
  objectType: 'person', displayName: { template: 'x' }, status: 'draft', createdAt: '',
  fields: [],
  sections: [],
  materialSlots: [{
    id: 'proof-slot', name: '补充证明', purpose: '核验补件', acceptedKinds: ['text', 'pdf'],
    minCount: 1, maxCount: 2, requiredElements: [], allowReuseAcrossSubjects: false,
  }],
  policyVersionIds: [], policyRefs: [], outputs: [],
  stages: [{ id: 'end', name: '结束', kind: 'finalize', executorRole: 'reviewer' }],
}

describe('T09 补件附件身份（OFF-05）', () => {
  saveDraft(template)
  publishTemplate(template.templateId, 1)

  test('模板案卷：附件保留原名并写入补件槽，revision 只推进一次', async () => {
    const caseId = 't09-slot-v2-case'
    await createCaseFromTemplate(template.templateId, 1, { title: '补件案卷', fieldValues: {}, subjects: [] }, actor, caseId)
    const before = readAggregate(caseId)!
    const result = await registerT09StudentAsset({
      caseId,
      displayName: '补充证明材料.pdf',
      bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]),
      materialSlotId: 'proof-slot',
    })
    const after = readAggregate(caseId)!
    const document = after.caseV2.documents.find((item) => item.versionId === result.versionId)!
    expect(document.fileName).toBe('补充证明材料.pdf')
    expect(document.materialSlotId).toBe('proof-slot')
    expect(document.role).toBe('evidence')
    expect(after.caseV2.revision).toBe(before.caseV2.revision + 1)
    expect(result.revision).toBe(after.caseV2.revision)
  })

  test('非法补件槽被拒绝且不落材料/不推进 revision', async () => {
    const caseId = 't09-slot-invalid-case'
    await createCaseFromTemplate(template.templateId, 1, { title: '非法槽案卷', fieldValues: {}, subjects: [] }, actor, caseId)
    const before = readAggregate(caseId)!
    await expect(registerT09StudentAsset({
      caseId,
      displayName: '越界材料.pdf',
      bytes: new Uint8Array([1, 2, 3]),
      materialSlotId: 'not-a-slot',
    })).rejects.toThrow('材料槽不存在')
    const after = readAggregate(caseId)!
    expect(after.caseV2.documents).toHaveLength(before.caseV2.documents.length)
    expect(after.caseV2.revision).toBe(before.caseV2.revision)
  })

  test('原生案卷：同一 helper 保留文件名与槽位', async () => {
    const created = await createNativeWorkspaceCaseV3(
      { title: '原生补件案卷', type: '综合测评', applicant: '丁', academicYear: '2026' }, actor)
    const caseId = created.view.id
    const aggregate = readAggregate(caseId)!
    // 原生案卷绑定的是内置模板；用其真实槽位，不能凭空断言别的模板的槽。
    const nativeTemplate = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
    const slotId = nativeTemplate?.materialSlots[0]?.id
    const result = await registerT09StudentAsset({
      caseId,
      displayName: '离线补充说明.txt',
      bytes: new Uint8Array([0x74, 0x65, 0x73, 0x74]),
      ...(slotId ? { materialSlotId: slotId } : {}),
    })
    const document = readAggregate(caseId)!.caseV2.documents.find((item) => item.versionId === result.versionId)!
    expect(document.fileName).toBe('离线补充说明.txt')
    if (slotId) expect(document.materialSlotId).toBe(slotId)
    expect(existsSync(t09AssetTempRoot())).toBe(true)
  })
})
