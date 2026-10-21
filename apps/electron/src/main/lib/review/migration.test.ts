/**
 * M1 迁移与契约单测（K06/K14 迁移面）
 * 隔离：PROFER_CONFIG_DIR 唯一临时目录；内置模板先落盘再迁移。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { saveCase } from './case-store'
import { ensureBuiltinTemplateDrafts } from './builtin-templates'
import { getTemplate as getTemplateStored, saveDraft as saveDraftStored } from './template-store'
import { getCaseV2, mapDomainToTemplate, migrateCaseToV2 } from './migration'
import { resolveModelSelection } from '@profer/shared'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-migrate-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('V1→V2 迁移（M1）', () => {
  test('Given 综测 demo 案卷 When 迁移 Then V2 可读且分数转字段、fixture 保留', () => {
    ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
    const v1 = buildDemoCase()
    saveCase(v1)
    const result = migrateCaseToV2(v1)
    expect(result.migrated).toBeTrue()
    const v2 = getCaseV2(v1.id)!
    expect(v2.templateId).toBe('comprehensive-assessment-v2')
    expect(v2.templateVersion).toBe(getTemplateStored('comprehensive-assessment-v2')!.version)
    expect(v2.subjects.length).toBe(v1.items.length)
    expect(v2.subjects[0]!.fields.declaredScore!.kind).toBe('number')
    expect(v2.documents.length).toBe(v1.documents.length)
    // 迁移可重复：再迁移返回既有 V2（revision 不重置）
    const again = migrateCaseToV2(v1)
    expect(again.caseV2?.revision).toBe(v2.revision)
  })

  test('Given 未知领域包 When 迁移 Then 不默认综测并记注记（H14 延续）', () => {
    expect(mapDomainToTemplate('mystery-pack').templateId).toBe('')
    expect(mapDomainToTemplate('mystery-pack').note).toContain('未知领域包')
  })

  test('Given 缺省领域包 When 迁移 Then 按缺省综测语义兼容并注明', () => {
    const mapping = mapDomainToTemplate(undefined)
    expect(mapping.templateId).toBe('comprehensive-assessment-v2')
    expect(mapping.note).toContain('缺省')
  })
})

// ===== 主体动作契约（03 §7） =====
describe('命令契约（M1）', () => {
  test('Given expectedRevision 过期 When 校验 Then 返回 VERSION_CONFLICT 与当前版', () => {
    const conflict = resolveConflictHelper(5, 7)
    expect(conflict?.code).toBe('VERSION_CONFLICT')
    expect(conflict?.currentRevision).toBe(7)
  })

  test('Given 一致修订号 When 校验 Then 通过（null）', () => {
    expect(resolveConflictHelper(7, 7)).toBeNull()
  })
})

import { assertExpectedRevision, type ReviewAppCommand } from '@profer/shared'
function resolveConflictHelper(expected: number, current: number) {
  return assertExpectedRevision({ expectedRevision: expected } as ReviewAppCommand<unknown>, current)
}

// ===== 模型显式选择（K16 纯函数面） =====
describe('resolveModelSelection（M1/H16）', () => {
  const channels = [
    { id: 'chan-a', enabled: true, models: ['m1', 'm2'], protocol: 'openai' },
    { id: 'chan-b', enabled: false, models: ['m3'], protocol: 'openai' },
  ]
  test('Given 有效选择 When 解析 Then 返回渠道与模型', () => {
    expect(resolveModelSelection(channels, { channelId: 'chan-a', model: 'm2' }).model).toBe('m2')
  })
  test('Given 渠道被删除/禁用/模型不在列表 When 解析 Then 抛可呈现错误', () => {
    expect(() => resolveModelSelection(channels, { channelId: 'chan-x', model: 'm1' })).toThrow('不存在或已删除')
    expect(() => resolveModelSelection(channels, { channelId: 'chan-b', model: 'm3' })).toThrow('已禁用')
    expect(() => resolveModelSelection(channels, { channelId: 'chan-a', model: 'm9' })).toThrow('不在渠道可用列表')
  })
})
