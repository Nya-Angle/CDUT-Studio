/**
 * 启动引导检查单测（M5：幂等注入/发布统计/可迁移清单）
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import { runBootCheckV2 } from './boot-check'
import { ALL_DEFAULT_TEMPLATES_V2, ensureBuiltinTemplateDrafts } from './builtin-templates'
import { getTemplate as getTemplateStored, saveDraft as saveDraftStored } from './template-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-boot-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('runBootCheckV2（M5）', () => {
  test('Given 首次启动 When 检查 Then 注入当前默认模板并提示发布', () => {
    const result = runBootCheckV2()
    expect(result.templatesSeeded).toBeGreaterThanOrEqual(ALL_DEFAULT_TEMPLATES_V2.length)
    // 当前默认综测 v3 内置模板在播种时会自动完成技术模板发布。
    expect(result.templatesPublished).toBeGreaterThanOrEqual(1)
    expect(result.notes.some((note) => note.includes('尚无已发布模板'))).toBeFalse()
  })

  test('Given 二次启动 When 检查 Then 幂等（不再注入）', () => {
    const result = runBootCheckV2()
    expect(result.templatesSeeded).toBe(0)
  })

  test('Given V1 案卷无 v2 文件 When 检查 Then 列入可迁移', () => {
    const caseDir = join(CONFIG_DIR, 'review-cases', 'case-mig-1')
    mkdirSync(caseDir, { recursive: true })
    writeFileSync(join(caseDir, 'case.json'), JSON.stringify({ id: 'case-mig-1', title: 'x' }), 'utf-8')
    const result = runBootCheckV2()
    expect(result.migratableCases).toContain('case-mig-1')
    expect(result.notes.some((note) => note.includes('可迁移'))).toBeTrue()
  })

  test('Given 内置草稿已存在 When ensureBuiltinTemplateDrafts Then 不覆盖', () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    // 只允许编辑仍为 draft 的模板；已发布历史模板不能作为可覆盖草稿。
    const editable = ALL_DEFAULT_TEMPLATES_V2.find((it) =>
      getTemplateStored(it.templateId, it.version)?.status === 'draft',
    )!
    expect(editable).toBeDefined()
    const t = getTemplateStored(editable.templateId, editable.version)!
    saveDraftStored({ ...t, name: '用户改过的名字' })
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    expect(getTemplateStored(editable.templateId, editable.version)!.name).toBe('用户改过的名字')
  })
})
