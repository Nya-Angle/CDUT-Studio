/**
 * Unified Review V3: evaluating published-template deterministic checks must be
 * read-only. The real Pi admission owns the single persisted Run for a review.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'
import { REVIEW_V3_OTHER_MATERIAL_SLOT_ID } from '@profer/shared'

const configDir=mkdtempSync(join(tmpdir(),'v3-unified-run-'))
process.env.PROFER_CONFIG_DIR=configDir
afterAll(()=>rmSync(configDir,{recursive:true,force:true}))

const { evaluateTemplateRuleReview, runTemplateRuleReview } = await import('./review-v3-main-template-run')
const { listRunsV2 } = await import('./run-store-v2')
const { createNativeWorkspaceCaseV3 } = await import('./native-workspace-case-v3')
const { registerNativeWorkspaceMaterialV3 } = await import('./native-workspace-case-v3')
const { saveDraft, publishTemplate } = await import('./template-store')
const { preparePiReviewRunV2 } = await import('./pi-case-review-service')
const { getRunV2 } = await import('./run-store-v2')
const { saveRunV2 } = await import('./run-store-v2')
const { runPlanBindingBlockers } = await import('./review-v3-run-plan-binding')
const { isWorkspaceRunStaleV2 } = await import('./workspace-business-service-v2')
const { readAggregate } = await import('./case-store-v2')

const caseId='v3-unified-run-regression'
const template:TemplateVersion={
  templateId:'unified-plan-test',version:1,schemaVersion:2,
  name:'资料审查',objectType:'document',displayName:{template:'资料审查'},
  status:'published',createdAt:'2026-10-24T00:00:00Z',
  fields:[],policyVersionIds:[],policyRefs:[],sections:[],
  materialSlots:[{
    id:'required-evidence',name:'项目佐证',purpose:'证明材料',requiredAt:'submission',
    minCount:1,maxCount:5,acceptedKinds:['pdf','office','image'],requiredElements:[],
    allowReuseAcrossSubjects:false,
  }],
  stages:[{id:'review',name:'初审',kind:'manual-review',executorRole:'reviewer'}],
  outputs:[],
}
function aggregateFor(slotId?:string):CaseAggregateV2 {
  return {
    caseV2:{
      id:caseId,templateId:template.templateId,templateVersion:1,
      title:'测试案卷',objectType:'document',caseFields:{},subjects:[],
      documents:[{
        documentId:'doc-1',versionId:'doc-1-v1',contentHash:'abcdef',byteHash:'abcdef',
        active:true,role:'application',fileName:'申请书.pdf',mimeType:'application/pdf',
        materialSlotId:slotId,sizeBytes:123,assetPath:'source-docs/doc-1-v1/申请书.pdf',
        parseRevision:1,parseStatus:'parsed',blocks:[],usage:'registered',
      }],stage:'draft',revision:1,
      createdAt:'2026-10-24T00:00:00Z',updatedAt:'2026-10-24T00:00:00Z',
    },
    observations:[],evidenceLinks:[],tasks:[],decisions:[],supplements:[],
    appeals:[],dispositions:[],receiptLog:[],
  } as CaseAggregateV2
}

describe('V3 template checks in one Pi Run',()=>{
  test('native V3 rejects the old rule-only Run entry before any ledger write',async()=>{
    const created=await createNativeWorkspaceCaseV3({
      title:'禁止独立规则运行',type:'自定义审核',applicant:'本机申请人',domainPackId:'custom',
    })
    const nativeCaseId=created.aggregate.caseV2.id
    expect(()=>runTemplateRuleReview({caseId:nativeCaseId})).toThrow('原生 V3 请使用统一初审')
    expect(listRunsV2(nativeCaseId)).toHaveLength(0)
  })
  test('read-only evaluation never creates a second run-tpl-* ledger',()=>{
    const before=listRunsV2(caseId)
    const result=evaluateTemplateRuleReview({
      aggregate:aggregateFor(REVIEW_V3_OTHER_MATERIAL_SLOT_ID),template,
    })
    expect(result.checks.some(check=>check.ruleId==='required-material-required-evidence')).toBe(true)
    expect(result.checks.some(check=>check.status==='awaiting-supplement')).toBe(true)
    expect(listRunsV2(caseId)).toEqual(before)
  })
  test('unclassified input is unknown, not confirmed missing',()=>{
    const unknown=evaluateTemplateRuleReview({aggregate:aggregateFor(),template})
    const check=unknown.checks.find(x=>x.ruleId==='required-material-required-evidence')
    expect(check?.status).toBe('awaiting-confirmation')
    expect(unknown.checks.every(x=>x.status!=='compliant')).toBe(true)
    expect(listRunsV2(caseId)).toHaveLength(0)
  })
  test('classification changes the frozen plan fingerprint',()=>{
    const a=evaluateTemplateRuleReview({aggregate:aggregateFor(),template})
    const b=evaluateTemplateRuleReview({aggregate:aggregateFor(REVIEW_V3_OTHER_MATERIAL_SLOT_ID),template})
    expect(a.planFingerprint).not.toBe(b.planFingerprint)
  })
  test('F03：仅调整两份原件显示顺序不会误判冻结 Plan 已升版',()=>{
    const original=aggregateFor(REVIEW_V3_OTHER_MATERIAL_SLOT_ID)
    original.caseV2.documents.push({ ...original.caseV2.documents[0]!,
      documentId:'doc-2',versionId:'doc-2-v1',contentHash:'second-hash',fileName:'附件.pdf' })
    const reordered=structuredClone(original)
    reordered.caseV2.documents.reverse()
    const a=evaluateTemplateRuleReview({aggregate:original,template})
    const b=evaluateTemplateRuleReview({aggregate:reordered,template})
    expect(a.frozenPlan).toEqual(b.frozenPlan)
    expect(a.planFingerprint).toBe(b.planFingerprint)
  })
  test('a real Pi Run records the published T04 plan fingerprint instead of creating a sibling Run',async()=>{
    saveDraft({...template,status:'draft'})
    publishTemplate(template.templateId,template.version)
    const created=await createNativeWorkspaceCaseV3({
      title:'单轮计划指纹验收',type:'自定义审核',applicant:'本机申请人',
      domainPackId:'contract-review',
      reviewTemplate:{templateId:template.templateId,version:template.version},
    })
    const nativeCaseId=created.aggregate.caseV2.id
    const source=join(configDir,'pi-plan-source.txt')
    writeFileSync(source,'本地初审原件，尚未完成材料槽位分类')
    await registerNativeWorkspaceMaterialV3(nativeCaseId,source,'application')
    const prepared=preparePiReviewRunV2({caseId:nativeCaseId,sessionId:'single-plan-session',turnId:'single-plan-turn'})
    const run=getRunV2(nativeCaseId,prepared.runId)
    expect(run?.inputManifest.planFingerprint).toBeTruthy()
    expect(run?.inputManifest.frozenPlan?.kind).toBe('published-template')
    expect(run?.inputManifest.frozenPlan?.kind === 'published-template' ? run.inputManifest.frozenPlan.planId : '').toStartWith('plan-')
    expect(run?.inputManifest.plannedCheckBindings?.length).toBe(run?.checks.length)
    const current=readAggregate(nativeCaseId)!
    expect(runPlanBindingBlockers(current,run!)).toEqual([])
    expect(isWorkspaceRunStaleV2(current,run!.id)).toBe(false)
    expect(run?.id.startsWith('run-pi-')).toBe(true)
    expect(listRunsV2(nativeCaseId)).toHaveLength(1)

    // BDD F03：案卷材料/事实未变，伪造 PlanId、换源版本或挪用 Check 目标
    // 都不能再使旧 Run 成为人工处置及正式决定的有效依据。
    const swappedPlan=structuredClone(run!)
    if(swappedPlan.inputManifest.frozenPlan?.kind!=='published-template') throw Error('缺少计划')
    swappedPlan.inputManifest.frozenPlan.planId='plan-from-other-case'
    expect(runPlanBindingBlockers(current,swappedPlan).join('；')).toContain('冻结 PlanId')

    const swappedSource=structuredClone(run!)
    if(swappedSource.inputManifest.frozenPlan?.kind!=='published-template') throw Error('缺少计划')
    swappedSource.inputManifest.frozenPlan.bindings[0]!.sourceVersionIds=['from-another-case']
    expect(runPlanBindingBlockers(current,swappedSource).join('；')).toContain('来源版本')
    saveRunV2(swappedSource)
    expect(isWorkspaceRunStaleV2(current,run!.id)).toBe(true)
    saveRunV2(run!)
    expect(isWorkspaceRunStaleV2(current,run!.id)).toBe(false)

    const swappedTarget=structuredClone(run!)
    swappedTarget.checks[0]!.target.subjectIds=['foreign-subject']
    expect(runPlanBindingBlockers(current,swappedTarget).join('；')).toContain('Check×目标')

    const upgradedCanonical=structuredClone(current)
    upgradedCanonical.canonicalPlan={schemaVersion:'review-c0/1',planId:'new-frozen',
      fingerprint:'a'.repeat(64),templateId:template.templateId,templateVersion:'1',
      moduleDigests:[],bindings:[]}
    expect(runPlanBindingBlockers(upgradedCanonical,run!).join('；')).toContain('C0')
  })
})
