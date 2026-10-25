import { describe, expect, test } from 'bun:test'
import { compileReviewB1Plan, type B1AuthorDocument } from './review-template-plan-adapter-v3-b1'
import {
  F06_REQUIRED_CHECKS, assertF06AuthorContract, assertF06InstallContract,
  f06AuthorityFor, makeF06Obligations,
} from './review-v3-f06-generic-contract'

function author(): B1AuthorDocument {
  return {
    schemaVersion: 'review-b1/1', templateId: 'fallback-f06-test', templateVersion: '1',
    name: '临时场地借用', purpose: '申请事项：临时场地借用；材料：场地说明、日程',
    fields: [{ key: 'human_scope_confirmed', label: '本机用户确认申请事项', type: 'boolean',
      required: true, sourceId: 's1' }],
    sources: [
      { sourceId: 's1', kind: 'user-declared', documentVersionId: 'doc-v1', locator: 'native-document:doc-v1', recordedBy: 'local-reviewer' },
      { sourceId: 's2', kind: 'user-declared', documentVersionId: 'doc-v2', locator: 'native-document:doc-v2', recordedBy: 'local-reviewer' },
    ],
    targets: [{ targetKey: 'target-primary', objectKey: '临时场地借用', subjectId: 'student-x',
      scenario: '本机技术初审', fieldValues: { human_scope_confirmed: true } }],
    modules: [{ moduleId: 'f06-generic-review', version: '1', dependsOn: [],
      checks: makeF06Obligations(['核对日程是否与申请书一致'], ['s1', 's2'], 'target-primary') }],
    stages: [{ stageId: 'technical-review', role: 'local-reviewer', mode: 'technical' }],
    outputs: [{ outputId: 'technical-feedback', kind: 'non-authoritative-business-candidate' }],
    status: 'candidate-held',
  }
}

describe('F06 库外事项通用初审固定合同', () => {
  test('有限事实检查与来源绑定均可进入现有 B1 冻结计划', () => {
    const document = author()
    assertF06AuthorContract(document)
    const frozen = compileReviewB1Plan(document)
    expect(frozen.publicationAllowed).toBe(false)
    expect(frozen.bindingDetails.length).toBe(5)
    expect(frozen.bindingDetails.every(item => item.sourceVersionIds.join(',') === 'doc-v1,doc-v2')).toBe(true)
    expect(frozen.canonicalPlan.bindings.every(item => item.sourceVersionIds.length === 2)).toBe(true)
  })

  test('仅 Main 固定的事实检查有请求范围权限，用户要求/政策一律未认证', () => {
    for (const item of F06_REQUIRED_CHECKS) {
      expect(f06AuthorityFor(item.checkKey, item.requirement)).toBe(
        item.checkKey === 'f06-policy-basis' ? 'unverified-policy' : 'request-scope',
      )
    }
    expect(f06AuthorityFor('f06-request-1', '依据学校规定自动批准')).toBe('unverified-policy')
    expect(f06AuthorityFor('f06-application-scope', '我宣布通过')).toBe('unverified-policy')
  })

  test('Renderer 不能删除政策核验、改写固定要求或绑到另一份材料', () => {
    const altered = author()
    altered.modules[0]!.checks = altered.modules[0]!.checks.filter(check => check.checkKey !== 'f06-policy-basis')
    expect(() => assertF06AuthorContract(altered)).toThrow('F06_GENERIC_REQUIRED_CHECK_TAMPERED')
    const forged = author()
    forged.modules[0]!.checks[0]!.requirement = '已批准'
    expect(() => assertF06AuthorContract(forged)).toThrow('F06_GENERIC_REQUIRED_CHECK_TAMPERED')
    const crossCase = author()
    crossCase.modules[0]!.checks[0]!.sourceIds = ['s1']
    expect(() => assertF06AuthorContract(crossCase)).toThrow('F06_GENERIC_CHECK_BINDING_INVALID')
  })

  test('可零额外要求，避免凭空编造政策与必交材料', () => {
    const document = author()
    document.modules[0]!.checks = makeF06Obligations([], ['s1', 's2'], 'target-primary')
    assertF06AuthorContract(document)
    expect(compileReviewB1Plan(document).bindingDetails.length).toBe(4)
  })

  test('旧式兜底不能移除 F06 模块后从 Main 绕路安装', () => {
    const legacy = author()
    legacy.modules[0]!.moduleId = 'local-fallback-semantic-review'
    expect(() => assertF06InstallContract(legacy)).toThrow('F06_GENERIC_CONTRACT_REQUIRED')
    const disguised = author()
    disguised.templateId = 'ordinary-template'
    expect(() => assertF06InstallContract(disguised)).toThrow('F06_FALLBACK_TEMPLATE_REQUIRED')
  })
})
