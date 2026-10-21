/**
 * 通用建案学年解耦回归。
 *
 * 学年是综测等「按学年组织评审」业务的主键，不是所有 V3 案卷的必填项：
 * 通用技术预审（D4/D2 候选、自定义模板草稿）与学年无关，不应被迫填写，
 * 且缺省时不得自动编造。旧兼容投影在学年缺失时降级为空串而不整体失效。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 'ay-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { createNativeWorkspaceCaseV3, nativeWorkspaceProjectionV3, domainRequiresAcademicYear } =
  await import('./native-workspace-case-v3')
const { readAggregate } = await import('./case-store-v2')

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

describe('学年按领域解耦', () => {
  test('领域判定', () => {
    expect(domainRequiresAcademicYear('comprehensive-assessment')).toBe(true)
    expect(domainRequiresAcademicYear('contract-review')).toBe(false)
    expect(domainRequiresAcademicYear(undefined)).toBe(false)
  })

  test('非综测通用草稿可省略学年', async () => {
    const created = await createNativeWorkspaceCaseV3({
      title: '通用技术预审', type: '自定义审核', applicant: 'E2E',
      domainPackId: 'contract-review', reviewTemplate: null,
    }, actor)
    expect(created.aggregate.caseV2.caseFields.academicYear).toBeUndefined()
    // 旧兼容投影仍可用，学年降级为空串
    const projection = nativeWorkspaceProjectionV3(created.aggregate)
    expect(projection?.academicYear).toBe('')
    expect(projection?.title).toBe('通用技术预审')
  })

  test('综测仍必须提供学年', async () => {
    await expect(createNativeWorkspaceCaseV3({
      title: '综测案卷', type: '综合测评', applicant: 'E2E',
      domainPackId: 'comprehensive-assessment', reviewTemplate: null,
    }, actor)).rejects.toThrow('必须填写适用学年')
  })

  test('综测提供学年后正常建案，既有读取不回归', async () => {
    const created = await createNativeWorkspaceCaseV3({
      title: '综测案卷', type: '综合测评', applicant: 'E2E',
      academicYear: '2026', domainPackId: 'comprehensive-assessment', reviewTemplate: null,
    }, actor)
    expect((created.aggregate.caseV2.caseFields.academicYear as { value: string }).value).toBe('2026')
    const reread = readAggregate(created.aggregate.caseV2.id)
    expect(nativeWorkspaceProjectionV3(reread)?.academicYear).toBe('2026')
  })
})

describe('切换领域时的学年一致性', () => {
  test('通用草稿切到综测：无学年则拒绝', async () => {
    const { updateNativeWorkspaceSettingsV3 } = await import('./native-workspace-case-v3')
    const created = await createNativeWorkspaceCaseV3({
      title: '通用草稿', type: '自定义审核', applicant: 'E2E',
      domainPackId: 'contract-review', reviewTemplate: null,
    }, actor)
    await expect(updateNativeWorkspaceSettingsV3(created.aggregate.caseV2.id, {
      caseId: created.aggregate.caseV2.id, domainPackId: 'comprehensive-assessment',
    }, actor)).rejects.toThrow('请先为案卷填写适用学年')
  })

  test('通用草稿切到综测：已有学年则允许', async () => {
    const { updateNativeWorkspaceSettingsV3 } = await import('./native-workspace-case-v3')
    // 建案时若有学年，后续切领域不被误拦
    const created = await createNativeWorkspaceCaseV3({
      title: '通用草稿带学年', type: '自定义审核', applicant: 'E2E', academicYear: '2026',
      domainPackId: 'contract-review', reviewTemplate: null,
    }, actor)
    const updated = await updateNativeWorkspaceSettingsV3(created.aggregate.caseV2.id, {
      caseId: created.aggregate.caseV2.id, domainPackId: 'comprehensive-assessment',
    }, actor)
    expect(updated.id).toBe(created.aggregate.caseV2.id)
  })
})
