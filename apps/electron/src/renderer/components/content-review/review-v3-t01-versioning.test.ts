import { describe, expect, test } from 'bun:test'
import { createT01Scenario } from './review-v3-t01-business-presets'
import { confirmT01NumberLimit, readT01NumberLimit, reconcileT01OwnerConfirmations } from './review-v3-t01-typed-criteria'
import { copyT01TemplateConfiguration, forkT01TemplateVersion } from './review-v3-t01-versioning'

const owner = {
  kind: 'owner-statement' as const, text: '本地负责人明确确认人数不得超过20',
  enteredBy: '模拟负责人', enteredAt: '2026-10-21T01:00:00.000Z',
}
function signed() {
  const template = createT01Scenario('laboratory', 'source-template', '2026-10-21T00:00:00.000Z')
  template.sections![0]!.criteria[0] = confirmT01NumberLimit(template.sections![0]!.criteria[0]!, owner)
  return template
}

describe('F02 数值规则确认与模板版本', () => {
  test('派生不可变发布版时复用配置，但不可复用旧签认', () => {
    const published = { ...signed(), status: 'published' as const, publishedAt: '2026-10-21T02:00:00.000Z' }
    const draft = forkT01TemplateVersion(published, 2, '2026-10-22T00:00:00.000Z')
    expect(draft).toMatchObject({ templateId: published.templateId, version: 2, status: 'draft' })
    expect(draft.publishedAt).toBeUndefined()
    expect(readT01NumberLimit(draft.sections![0]!.criteria[0]!)?.ownerStatement).toBeUndefined()
    expect(readT01NumberLimit(published.sections![0]!.criteria[0]!)?.ownerStatement).toEqual(owner)
    expect(() => forkT01TemplateVersion(published, 1, '2026-10-22T00:00:00.000Z')).toThrow('T01_VERSION_NOT_NEWER')
  })
  test('复制为新模板也不能继承原版本签认', () => {
    const template = signed()
    const copy = copyT01TemplateConfiguration(template, 'my-own-template', '2026-10-22T00:00:00.000Z')
    expect(copy).toMatchObject({ templateId: 'my-own-template', version: 1, catalogKind: 'custom', status: 'draft' })
    expect(readT01NumberLimit(copy.sections![0]!.criteria[0]!)?.ownerStatement).toBeUndefined()
  })
  test('修改审核要求或字段含义时旧签认失效；只调换无关配置不失效', () => {
    const before = signed()
    const changedRequirement = structuredClone(before)
    changedRequirement.sections![0]!.criteria[0]!.requirement = '申请人数不得超过15'
    const invalid = reconcileT01OwnerConfirmations(before, changedRequirement)
    expect(readT01NumberLimit(invalid.sections![0]!.criteria[0]!)?.ownerStatement).toBeUndefined()

    const changedField = structuredClone(before)
    changedField.fields.find(field => field.key === 'peopleCount')!.label = '设备数量'
    const invalidField = reconcileT01OwnerConfirmations(before, changedField)
    expect(readT01NumberLimit(invalidField.sections![0]!.criteria[0]!)?.ownerStatement).toBeUndefined()

    const changedDescription = { ...before, description: '仅编辑模板说明' }
    expect(reconcileT01OwnerConfirmations(before, changedDescription)).toBe(changedDescription)
  })
  test('新确认可以存活于同一规则的作者确认操作', () => {
    const before = createT01Scenario('laboratory', 'local', '2026-10-21T00:00:00.000Z')
    const after = structuredClone(before)
    after.sections![0]!.criteria[0] = confirmT01NumberLimit(after.sections![0]!.criteria[0]!, owner)
    expect(readT01NumberLimit(reconcileT01OwnerConfirmations(before, after).sections![0]!.criteria[0]!)?.ownerStatement).toEqual(owner)
  })
})
