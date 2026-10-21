import { describe, expect, test } from 'bun:test'
import { createT01Scenario } from './review-v3-t01-business-presets'
import { exportT01Template, importT01Template } from './review-v3-t01-template-portability'
import {
  collectT01ConfirmedNumericChecks,
  collectT01RequiredMaterials,
  confirmT01NumberLimit,
  readT01NumberLimit,
  setT01NumberLimit,
  validateT01TypedCriteria,
} from './review-v3-t01-typed-criteria'

const draft = () => createT01Scenario('laboratory','a15-criteria','2026-10-21T00:00:00.000Z')
const owner = {kind:'owner-statement' as const,text:'本次模拟实验室申请参加人数不得超过20人',enteredBy:'模拟模板负责人',enteredAt:'2026-10-21T01:00:00.000Z'}
const withConfirmedLimit = () => {
  const template = draft()
  template.sections![0]!.criteria[0] = confirmT01NumberLimit(template.sections![0]!.criteria[0]!, owner)
  return template
}

describe('T01 author-confirmed numeric rule contract', () => {
  test('A15 limit is a declared numeric rule, not a form maximum or invented policy', () => {
    const template = draft()
    const criterion = template.sections![0]!.criteria[0]!
    expect(template.fields.find(field => field.key==='peopleCount')?.max).toBeUndefined()
    expect(criterion.execution).toBe('deterministic')
    expect(readT01NumberLimit(criterion)).toMatchObject({
      schemaVersion:1,kind:'field-number-limit',fieldScope:'case',
      fieldKey:'peopleCount',operator:'lte',threshold:20,
    })
    expect(validateT01TypedCriteria(template).join(' ')).toContain('负责人确认')
    expect(() => collectT01ConfirmedNumericChecks(template)).toThrow('T01_RULES_NOT_CONFIRMED')
  })

  test('owner confirmation creates a serializable, source-versioned T04 handoff', () => {
    const template = withConfirmedLimit()
    expect(validateT01TypedCriteria(template)).toEqual([])
    expect(collectT01ConfirmedNumericChecks(template)).toEqual([expect.objectContaining({
      templateId:'a15-criteria',templateVersion:1,criterionId:'count',
      ruleId:'section-eligibility-count',policyVersionId:'template-owner:a15-criteria@1',
      constraint:expect.objectContaining({fieldKey:'peopleCount',threshold:20,ownerStatement:owner}),
    })])
    expect(collectT01RequiredMaterials(template)).toEqual([
      expect.objectContaining({slotId:'plan',minCount:1,requiredAt:'submission'}),
    ])
    const imported = importT01Template(exportT01Template(template),'copy-a15','2026-10-21T02:00:00.000Z')
    expect(imported.status).toBe('draft')
    expect(readT01NumberLimit(imported.sections![0]!.criteria[0]!)?.threshold).toBe(20)
    expect(readT01NumberLimit(imported.sections![0]!.criteria[0]!)?.ownerStatement).toBeUndefined()
    expect(validateT01TypedCriteria(imported).join(' ')).toContain('负责人确认')
    expect(() => collectT01ConfirmedNumericChecks(imported)).toThrow('T01_RULES_NOT_CONFIRMED')
  })

  test('changing numeric bounds erases old owner confirmation and requires re-signing', () => {
    const template = withConfirmedLimit()
    const old = template.sections![0]!.criteria[0]!
    const replacement = setT01NumberLimit(old, {
      schemaVersion:1,kind:'field-number-limit',fieldKey:'peopleCount',
      fieldScope:'case',operator:'lte',threshold:15,unit:'人',
    })
    template.sections![0]!.criteria[0] = replacement
    expect(readT01NumberLimit(replacement)?.ownerStatement).toBeUndefined()
    expect(validateT01TypedCriteria(template).join(' ')).toContain('负责人确认')
    expect(() => collectT01ConfirmedNumericChecks(template)).toThrow()
  })

  test('rules are reusable for unrelated case-level numeric fields, not hardcoded to lab', () => {
    const template = draft()
    template.templateId = 'generic-project'
    template.fields = [{key:'projectBudget',label:'项目预算',kind:'number',required:true,scope:'case',visibility:'public',unit:'元'}]
    const c = template.sections![0]!.criteria[0]!
    template.sections![0]!.criteria[0] = confirmT01NumberLimit(setT01NumberLimit(c, {
      schemaVersion:1,kind:'field-number-limit',fieldKey:'projectBudget',
      fieldScope:'case',operator:'lte',threshold:10000,unit:'元',
    }),owner)
    expect(collectT01ConfirmedNumericChecks(template)[0]?.constraint).toMatchObject({
      fieldKey:'projectBudget',threshold:10000,
    })
  })

  test('reject dangling field, contradictory execution, unknown numeric value and missing clause', () => {
    const template = withConfirmedLimit()
    const criterion = template.sections![0]!.criteria[0]!
    template.sections![0]!.criteria[0] = {
      ...criterion, deterministicConstraint: {
        ...readT01NumberLimit(criterion)!,fieldKey:'unknown',threshold:NaN,
      },
    } as typeof criterion
    expect(validateT01TypedCriteria(template).join(' ')).toContain('案卷级数字字段')
    expect(validateT01TypedCriteria(template).join(' ')).toContain('比较符或阈值无效')
    template.sections![0]!.criteria[0] = { ...criterion,execution:'manual' }
    expect(validateT01TypedCriteria(template).join(' ')).toContain('执行方式')
    template.sections![0]!.criteria[0] = { ...criterion, deterministicConstraint:undefined } as typeof criterion
    expect(validateT01TypedCriteria(template).join(' ')).toContain('尚未配置')
  })
})
