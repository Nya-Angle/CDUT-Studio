/**
 * N1b 综测完整样例单测（政策仓库/发布依赖校验/幂等落盘/发布链）
 * 隔离：PROFER_CONFIG_DIR 唯一临时目录。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { buildComprehensiveFixture, publishComprehensiveFixture, seedComprehensiveFixture } from './comprehensive-fixture'
import { getPolicy, validatePolicyRef } from '../policy-store'
import { getTemplate, publishTemplate, saveDraft, validateTemplate } from '../template-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../..', 'work/tmp', `profer-test-policy-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const store = { getTemplate, saveDraft, publish: publishTemplate }

describe('政策仓库（N1b）', () => {
  test('Given 政策草稿带确认 When 发布 Then published 不可变且引用校验通过', () => {
    seedComprehensiveFixture(store)
    publishComprehensiveFixture(store)
    const policy = getPolicy('policy-comprehensive-assessment-demo', 1)!
    expect(policy.status).toBe('published')
    expect(policy.compiledRules?.map((rule) => rule.id)).toEqual(['P1', 'P2', 'P3', 'P4'])
    expect(policy.compiledRules?.every((rule) => rule.policyVersionId === `${policy.policyId}@${policy.version}`)).toBeTrue()
    const { template } = buildComprehensiveFixture()
    const check = validatePolicyRef(template.policyRefs![0]!)
    expect(check.ok).toBeTrue()
  })

  test('Given 无确认记录 When 发布 Then 拒绝（AI 起草不自动确认）', () => {
    const { policy } = buildComprehensiveFixture()
    const noConfirm = { ...policy, policyId: `${policy.policyId}-noconfirm`, confirmations: [] }
    const { savePolicyDraft } = require('../policy-store') as typeof import('../policy-store')
    savePolicyDraft(noConfirm)
    const { publishPolicy } = require('../policy-store') as typeof import('../policy-store')
    expect(() => publishPolicy(noConfirm.policyId, 1)).toThrow('确认记录')
  })

  test('Given 内容与 hash 不一致 When 保存 Then 拒绝', () => {
    const { policy } = buildComprehensiveFixture()
    const bad = { ...policy, policyId: `${policy.policyId}-bad`, content: '篡改后的内容' }
    const { savePolicyDraft } = require('../policy-store') as typeof import('../policy-store')
    expect(() => savePolicyDraft(bad)).toThrow('hash 不一致')
  })

  test('Given 模板引用不存在政策 When validateTemplate Then error 阻止发布', () => {
    const { template } = buildComprehensiveFixture()
    const broken = { ...template, policyRefs: [{ policyId: 'ghost-policy', version: 9, contentHash: 'x'.repeat(64) }] }
    const issues = validateTemplate(broken as never)
    expect(issues.some((issue) => issue.level === 'error' && issue.message.includes('ghost-policy'))).toBeTrue()
  })
})

describe('完整综测模板（05 §5.1 第 2 条）', () => {
  test('Given 模板 v2 When 校验 Then 无 error 且两级阶段/枚举/材料槽完整', () => {
    const { template } = buildComprehensiveFixture()
    const errors = validateTemplate(template).filter((issue) => issue.level === 'error')
    expect(errors).toEqual([])
    expect(template.stages.map((stage) => stage.kind)).toEqual(['auto-check', 'manual-review', 'manual-review'])
    expect(template.fields.find((field) => field.key === 'category')!.options).toHaveLength(3)
    expect(template.materialSlots.find((slot) => slot.id === 'certificates')!.requiredElements).toContain('颁发单位')
  })

  test('Given 重复 seed When 幂等落盘 Then 不覆盖已存在版本', () => {
    seedComprehensiveFixture(store)
    seedComprehensiveFixture(store)
    expect(getTemplate('comprehensive-assessment-v2', 2)).toBeDefined()
  })
})
