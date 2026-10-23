/** 原生案卷材料槽透传回归：带必需槽的模板必须能被提交。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 'slot-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { createNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3 } =
  await import('./native-workspace-case-v3')
const { readAggregate } = await import('./case-store-v2')
const { saveDraft, publishTemplate } = await import('./template-store')
const { submitCaseV2 } = await import('./stage-workflow')

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

describe('原生案卷材料槽', () => {
  test('按槽位登记后，带必需槽的模板可提交', async () => {
    const templateId = 'slot-template'
    saveDraft({
      templateId, version: 1, schemaVersion: 2, name: '材料槽模板',
      objectType: 'document', displayName: { template: '{{x}}' }, status: 'draft', createdAt: '',
      fields: [], sections: [], policyVersionIds: [], policyRefs: [], outputs: [],
      materialSlots: [{ id: 'plan', name: '实验计划', minCount: 1, requiredAt: 'submission' }],
      stages: [{ id: 'first', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
    } as never)
    publishTemplate(templateId, 1)

    const created = await createNativeWorkspaceCaseV3({
      title: '槽位案卷', type: '自定义审核', applicant: 'E2E',
      domainPackId: 'contract-review', reviewTemplate: { templateId, version: 1 },
    }, actor)
    const caseId = created.aggregate.caseV2.id

    const file = join(configDir, 'plan.txt')
    writeFileSync(file, '实验计划正文', 'utf8')

    // 不带槽位：提交必须被拒
    await registerNativeWorkspaceMaterialV3(caseId, file, 'evidence', undefined, undefined, undefined)
    await expect(submitCaseV2(caseId)).rejects.toThrow('缺少必需材料')

    // 带槽位：登记后应满足
    await registerNativeWorkspaceMaterialV3(caseId, file, 'evidence', undefined, undefined, 'plan')
    const docs = readAggregate(caseId)!.caseV2.documents.filter((doc) => doc.active !== false)
    expect(docs.some((doc) => doc.materialSlotId === 'plan')).toBe(true)
    const submitted = await submitCaseV2(caseId)
    expect(submitted.ok).toBe(true)
  })
})
