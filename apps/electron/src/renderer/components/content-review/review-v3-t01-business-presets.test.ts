import { describe, expect, test } from 'bun:test'
import { createT01Scenario, T01_SCENARIOS, trialT01Template, exampleT01TrialInput } from './review-v3-t01-business-presets'
import { validateTemplate } from '../../../main/lib/review/template-store'

const make=(id:Parameters<typeof createT01Scenario>[0])=>createT01Scenario(id,'t01-test-'+id,'2026-10-21T00:00:00.000Z')

describe('T01 configurable business templates',()=>{
  test('six standard business categories and independent A15 laboratory case are reusable drafts',()=>{
    expect(T01_SCENARIOS).toHaveLength(7)
    for(const scenario of T01_SCENARIOS){
      const template=make(scenario.id)
      expect(template.status).toBe('draft')
      expect(template.catalogKind).toBe('custom')
      expect(template.policyVersionIds).toEqual([])
      expect(template.fields.length).toBeGreaterThan(0)
      expect(template.materialSlots.length).toBeGreaterThan(0)
      expect(template.sections?.flatMap(s=>s.criteria).length).toBeGreaterThan(0)
      expect(template.stages.length).toBeGreaterThan(0)
      expect(validateTemplate(template).filter(i=>i.level==='error')).toEqual([])
    }
  })

  test('laboratory request is organization-based, no scoring, and initial->final local flow',()=>{
    const template=make('laboratory')
    expect(template.objectType).toBe('organization')
    expect(template.fields.some(f=>f.key==='academicYear')).toBe(false)
    expect(template.rubric).toBeUndefined()
    // 人数上限已是负责人确认的业务规则，表单层不得再用 max 拦截（21 人必须能建案）
    const peopleCount = template.fields.find(f=>f.key==='peopleCount')
    expect(peopleCount).toMatchObject({kind:'number',min:1})
    expect(peopleCount && 'max' in peopleCount).toBe(false)
    expect(template.stages.map(s=>s.kind)).toEqual(['auto-check','manual-review','manual-review'])
    expect(template.stages.map(s=>s.nextStageId)).toEqual(['first-review','final-review',undefined])
    expect(template.materialSlots.map(s=>s.id)).toContain('plan')
  })

  test('simulated form cannot proceed when fields or plan are absent',()=>{
    const output=trialT01Template(make('laboratory'),{}, {})
    expect(output.status).toBe('incomplete')
    expect(output.issues.some(issue=>issue.includes('申请计划附件'))).toBe(true)
    expect(output.issues.some(issue=>issue.includes('参加人数'))).toBe(true)
  })

  test('headcount 21 is captured for an actual T04 non-compliant check, not rejected by form max',()=>{
    const template=make('laboratory')
    const values={organization:'实验室协会',contact:'申请人',peopleCount:21,useDate:'2026-11-01',timePeriod:'14:00-16:00',purpose:'培训'}
    const exceeding=trialT01Template(template,values,{plan:1})
    expect(exceeding.status).toBe('ready-for-human-review')
    expect(exceeding.note).toContain('未执行制度规则')
    const accepted=trialT01Template(template,{...values,peopleCount:20},{plan:1})
    expect(accepted.status).toBe('ready-for-human-review')
    expect(accepted.checksForReview).toBe(3)
    expect(accepted.note).toContain('未执行制度规则')
  })

  test('judging sample requires rating without creating a fictitious reviewer grade',()=>{
    const template=make('judging')
    expect(template.objectType).toBe('project')
    expect(template.rubric?.minEffectiveJudges).toBe(2)
    expect(template.stages.some(s=>s.kind==='independent-rating')).toBe(true)
  })

  test('each simulated sample can be entered without a developer and remains unreviewed',()=>{
    for (const scenario of T01_SCENARIOS) {
      const template=make(scenario.id)
      const { values,materialCounts }=exampleT01TrialInput(template)
      const result=trialT01Template(template,values,materialCounts)
      expect(result.status).toBe('ready-for-human-review')
      expect(result.note).toContain('未执行制度规则')
    }
  })

  test('template configuration trials do not mutate authored template',()=>{
    const template=make('laboratory')
    const snapshot=JSON.stringify(template)
    trialT01Template(template,{peopleCount:100},{plan:100})
    expect(JSON.stringify(template)).toBe(snapshot)
  })
})
