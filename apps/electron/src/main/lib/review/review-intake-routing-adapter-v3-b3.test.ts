/**
 * B3 保守路由：多份材料任意数量、多个模板候选排名后共用 20 秒倒计时，
 * 首位仅在倒计时结束后成为技术默认；跨主体、证据不全或未授权仍必须人工确认。
 */
import { describe, expect, test } from 'bun:test'
import type { B2MaterialCandidate } from './review-intake-adapter-v3-b2'
import { planB3ConservativeRouting, type B3RouteSuggestion } from './review-intake-routing-adapter-v3-b3'

const materials = [
  { candidateId:'application-1', caseCandidateId:'case-1', ownerId:'owner-1', ownerGeneration:1,
    status:'accepted', role:'application', subjectId:'subject-1', rawSha256:'a'.repeat(64) },
  { candidateId:'support-1', caseCandidateId:'case-1', ownerId:'owner-1', ownerGeneration:1,
    status:'accepted', role:'supporting', subjectId:'subject-1', rawSha256:'b'.repeat(64) },
] as unknown as B2MaterialCandidate[]

function suggestion(
  templateId: string, confidence: number, evidenceMaterials: B2MaterialCandidate[] = materials,
): B3RouteSuggestion {
  return { templateId, templateVersion:'1', availability:'authorized-for-technical-selection',
    confidence, caseCandidateId:'case-1',
    evidence:evidenceMaterials.map(material=>({ materialCandidateId:material.candidateId,
      rawSha256:material.rawSha256, reason:'原件中的业务对象与办理动作匹配' })) }
}
const base = {
  startedAtMs:1000, automaticSelectionEnabled:true, userInterrupted:false,
  materialCandidates:materials, suggestions:[suggestion('template-a',0.99),suggestion('template-b',0.96)],
}

describe('B3 multi-candidate conservative routing',()=>{
  test('多份申请原件与零份已识别申请原件都不由全局数量规则拒绝路由',()=>{
    for (const role of ['application','supporting'] as const) {
      const input = materials.map(item=>({...item,role}))
      const route=planB3ConservativeRouting({...base,nowMs:1000,materialCandidates:input})
      expect(route.status).toBe('countdown')
      expect(route.candidates?.length).toBe(2)
    }
  })
  test('multiple valid candidates are ranked and enter the same 20-second countdown',()=>{
    const route=planB3ConservativeRouting({...base,nowMs:1000})
    expect(route.status).toBe('countdown')
    expect(route.remainingMs).toBe(20_000)
    expect(route.candidates?.map(item=>item.templateId)).toEqual(['template-a','template-b'])
    expect(route.chosen).toBeUndefined()
  })
  test('the first ranked candidate becomes the default only after 20 seconds',()=>{
    const route=planB3ConservativeRouting({...base,nowMs:21_000})
    expect(route.status).toBe('default-selected')
    expect(route.chosen).toEqual({templateId:'template-a',templateVersion:'1'})
  })
  test('an unauthorized or incomplete candidate cannot become the default',()=>{
    const bad={...suggestion('template-b',0.99),availability:'candidate-held' as const}
    const route=planB3ConservativeRouting({...base,nowMs:21_000,suggestions:[bad]})
    expect(route.status).toBe('needs-user-confirmation')
    expect(route.chosen).toBeUndefined()
  })
  test('no evidenced candidates remains unmatched rather than picking a catalog default',()=>{
    const route=planB3ConservativeRouting({...base,nowMs:21_000,suggestions:[]})
    expect(route.status).toBe('unmatched')
    expect(route.chosen).toBeUndefined()
  })
  // 本地来源约束：跨主体不能自动路由；所有暂存原件都必须被同一证据集覆盖。
  test('multiple Subjects still require manual business confirmation',()=>{
    const crossSubject = materials.map((item,index)=>
      index===1?{...item,subjectId:'subject-2'}:item)
    const route=planB3ConservativeRouting({...base,nowMs:1000,materialCandidates:crossSubject})
    expect(route.status).toBe('needs-user-confirmation')
    expect(route.chosen).toBeUndefined()
  })
  test('evidence missing one staged source cannot auto-route',()=>{
    const partial=suggestion('template-a',0.99,materials.slice(0,1))
    const route=planB3ConservativeRouting({...base,nowMs:21_000,suggestions:[partial]})
    expect(route.status).toBe('needs-user-confirmation')
    expect(route.chosen).toBeUndefined()
  })
})
