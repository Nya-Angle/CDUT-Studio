/**
 * 模板资产契约回归（TAR-01/02/10/11/14/18）。
 * 隔离：PROFER_CONFIG_DIR 指向唯一临时目录。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { loadD4UnifiedCatalog, loadD4UnifiedWorkspace } from './review-d4-catalog'
import { D4_DEMO_TEMPLATE_ID_PREFIX, demoTemplateFromD4, derivedDemoTemplateId, isDerivedDemoTemplateId } from './review-v3-d4-demo-publish'
import { BUILTIN_TEMPLATES_V2 } from './builtin-templates'
import { validateTemplate } from './template-store'
import { canonicalContentHash, getPolicy, savePolicyDraft } from './policy-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-template-asset-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

describe('TAR-01/02 D4 派生身份与场景保真', () => {
  test('演示转换使用派生 ID，不占用冻结作者键', () => {
    const entry = loadD4UnifiedCatalog().templates[0]!
    const workspace = loadD4UnifiedWorkspace(entry)
    const demo = demoTemplateFromD4(entry, workspace)
    expect(demo.templateId).toBe(`${D4_DEMO_TEMPLATE_ID_PREFIX}${entry.templateId}`)
    expect(demo.templateId).not.toBe(entry.templateId)
    expect(isDerivedDemoTemplateId(demo.templateId)).toBeTrue()
    expect(derivedDemoTemplateId('g01-archive-utilization')).toBe('d4demo-g01-archive-utilization')
    expect(demo.sourceNote).toContain('D4_DERIVED_DEMO:')
    // 只消费模板显式引用的模块，不再平铺 workspace.definitions.modules 全集
    const references = workspace.definitions.templates[0]!.modules
    expect(demo.sections?.length).toBe(references.length)
    // 每个分项都对应显式引用，未引用的定义模块不会进入演示模板
    const referenceIds = new Set(references.map((ref) => ref.id ?? ref.moduleId))
    expect(demo.sections!.every((section) => referenceIds.has(section.id))).toBeTrue()
    // 场景限定被保留为可核对文本，而不是静默套用
    const withScenario = workspace.definitions.templates[0]!.modules.filter((ref) => ref.scenario)
    expect(withScenario.length).toBeGreaterThan(0)
    const scenarioSection = demo.sections?.find((section) => section.name.includes('场景'))
    expect(scenarioSection).toBeDefined()
    expect(scenarioSection!.criteria[0]!.requirement).toContain('【适用场景：')
  })
})

describe('TAR-14 联合 rule ID 唯一性', () => {
  test('分项与要求拼接后碰撞必须在发布前报错', () => {
    const template = BUILTIN_TEMPLATES_V2[0]!
    const collided = {
      ...template,
      sections: [
        { id: 'a-b', name: '分项一', order: 0, required: false, criteria: [{ id: 'c', title: 't1', requirement: 'r1', execution: 'semantic' as const, targetScope: 'case' as const }] },
        { id: 'a', name: '分项二', order: 1, required: false, criteria: [{ id: 'b-c', title: 't2', requirement: 'r2', execution: 'semantic' as const, targetScope: 'case' as const }] },
      ],
    }
    expect(validateTemplate(collided).some((issue) => issue.level === 'error' && issue.message.includes('规则 ID 冲突'))).toBeTrue()
    expect(validateTemplate({ ...template, sections: collided.sections.slice(0, 1) }).some((issue) => issue.message.includes('规则 ID 冲突'))).toBeFalse()
  })
})

describe('TAR-18 政策 ID 路径边界', () => {
  test('路径穿越/点号 ID 不得创建或读取政策', () => {
    const content = '第一条 测试'
    const base = { version: 1, title: 't', contentHash: canonicalContentHash(content), content,
      origin: { kind: 'owner-statement' as const, text: '本地测试录入', enteredBy: 'local-user', enteredAt: new Date().toISOString() },
      confirmations: [], status: 'draft' as const, createdAt: new Date().toISOString(), compiledRules: [] }
    for (const policyId of ['../outside', 'a/b', 'has.dot', '']) {
      expect(() => savePolicyDraft({ ...base, policyId })).toThrow()
      expect(getPolicy(policyId)).toBeUndefined()
    }
  })
})
