import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'
import { reviewV3MaterialIssuesForPhase, reviewV3SubmissionMaterialIssues } from './review-v3-submission-material-gate'

function template(patch:Partial<TemplateVersion['materialSlots'][number]>={}):TemplateVersion {
  return {
    templateId:'material-conditions',version:1,schemaVersion:2,
    name:'有条件材料申请',objectType:'document',displayName:{template:'有条件材料申请'},
    status:'published',createdAt:'2026-10-24T00:00:00Z',
    fields:[],sections:[],policyVersionIds:[],stages:[],outputs:[],
    materialSlots:[{
      id:'authorization',name:'监护人授权书',purpose:'条件要求的授权',
      acceptedKinds:['pdf'],requiredAt:'submission',minCount:1,maxCount:2,
      requiredWhen:{field:'isMinor',op:'eq',value:true},
      requiredElements:[],allowReuseAcrossSubjects:false,
      ...patch,
    }],
  }
}
function aggregate(fields:Record<string,unknown>,docs:Array<{slot:string,name:string,status?:string}>=[]):CaseAggregateV2 {
  return {
    caseV2:{
      id:'case-conditional',templateId:'material-conditions',templateVersion:1,
      caseFields:fields,documents:docs.map((doc,index)=>({
        versionId:'version-'+index,documentId:'doc-'+index,
        materialSlotId:doc.slot,fileName:doc.name,parseStatus:doc.status??'parsed',
        active:true,
      })),
    },
  } as unknown as CaseAggregateV2
}
describe('V3 conditional material submission gate',()=>{
  test('a false template-specific condition excludes a required slot',()=>{
    expect(reviewV3SubmissionMaterialIssues(aggregate({isMinor:{kind:'boolean',value:false}}),template())).toEqual([])
  })
  test('unknown condition asks for confirmation, not imaginary missing evidence',()=>{
    const issues=reviewV3SubmissionMaterialIssues(aggregate({}),template())
    expect(issues).toHaveLength(1)
    expect(issues[0]?.kind).toBe('applicability-unknown')
  })
  test('applicable true condition counts only active compatible material',()=>{
    const fields={isMinor:{kind:'boolean',value:true}}
    expect(reviewV3SubmissionMaterialIssues(aggregate(fields),template())[0]?.kind).toBe('missing')
    const wrong=aggregate(fields,[{slot:'authorization',name:'未签字.docx'}])
    expect(reviewV3SubmissionMaterialIssues(wrong,template())[0]?.kind).toBe('missing')
    const valid=aggregate(fields,[{slot:'authorization',name:'已签字.pdf'}])
    expect(reviewV3SubmissionMaterialIssues(valid,template())).toEqual([])
  })
  test('failed parsing cannot make a required slot count as complete',()=>{
    const agg=aggregate({isMinor:{kind:'boolean',value:true}},[
      {slot:'authorization',name:'损坏.pdf',status:'failed'},
    ])
    expect(reviewV3SubmissionMaterialIssues(agg,template())[0]?.kind).toBe('missing')
  })
  test('decision-only slots do not block submission',()=>{
    const t=template({requiredAt:'decision',requiredWhen:undefined})
    expect(reviewV3SubmissionMaterialIssues(aggregate({}),t)).toEqual([])
  })
  test('decision-only material does not block submission but blocks native approval',()=>{
    const t=template({requiredAt:'decision',requiredWhen:undefined})
    const agg=aggregate({})
    expect(reviewV3SubmissionMaterialIssues(agg,t)).toEqual([])
    expect(reviewV3MaterialIssuesForPhase(agg,t,'decision')[0]?.kind).toBe('missing')
    const attached=aggregate({},[{slot:'authorization',name:'签字确认.pdf'}])
    expect(reviewV3MaterialIssuesForPhase(attached,t,'decision')).toEqual([])
  })
  test('conditional decision-only requirement stays unknown without confirmed facts',()=>{
    const t=template({requiredAt:'decision'})
    const missing=reviewV3MaterialIssuesForPhase(aggregate({}),t,'decision')
    expect(missing[0]?.kind).toBe('applicability-unknown')
    const waived=reviewV3MaterialIssuesForPhase(
      aggregate({isMinor:{kind:'boolean',value:false}}),t,'decision')
    expect(waived).toEqual([])
  })

  test('enforces the template maximum independently of unrelated attachments',()=>{
    const agg=aggregate({isMinor:{kind:'boolean',value:true}},[
      {slot:'authorization',name:'一.pdf'},
      {slot:'authorization',name:'二.pdf'},
      {slot:'authorization',name:'三.pdf'},
      {slot:'other',name:'附件.docx'},
    ])
    expect(reviewV3SubmissionMaterialIssues(agg,template())[0]?.kind).toBe('too-many')
  })
})
