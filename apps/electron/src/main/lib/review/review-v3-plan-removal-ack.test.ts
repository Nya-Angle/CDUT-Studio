import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, CanonicalPlan, ReviewCaseV2 } from '@profer/shared'
import { bindCanonicalPlanV3, describeRemovedPlanBindings,
  upgradeCanonicalPlanV3, type CMainUpgradeRemovalAck,
} from './plan-binding-v3'
import { createAggregate, readAggregate } from './case-store-v2'

const root=join(import.meta.dir,'../../../../../../work/tmp',`v3-removed-check-cas-${Date.now()}`)
process.env.PROFER_CONFIG_DIR=root
afterAll(()=>rmSync(root,{recursive:true,force:true}))
const actor:Actor={actorId:'Main-verified-reviewer',actorSource:'local',role:'reviewer'}
const publishedOnlyForTechnicalFixture=(_p:CanonicalPlan)=>{}
let counter=0
const idNext=()=> 'c-check-removal-'+ ++counter
const basePlan=(n:number):CanonicalPlan=>({
  schemaVersion:'review-c0/1',planId:'published-immutable-'+n,
  fingerprint:String(n).repeat(64),templateId:'template-one',
  templateVersion:'1',moduleDigests:['test-offline-source'],
  bindings:[{
    checkKey:'check-a',targetKey:'subject:s1',objectKey:'evidence',
    subjectId:'s1',applicability:'applicable',sourceVersionIds:['v1'],
    conditionFingerprint:'condition-'+n,
  }],
})
const oldPlan=():CanonicalPlan=>{
  const plan=basePlan(1)
  plan.bindings.push({...plan.bindings[0]!,checkKey:'check-deleted',
    sourceVersionIds:['v1','v2']})
  return plan
}
const newPlan=()=>basePlan(2)
const exactAck=(before:CanonicalPlan,after:CanonicalPlan):CMainUpgradeRemovalAck=>({
  previousFingerprint:before.fingerprint,nextFingerprint:after.fingerprint,
  acknowledgedRemovedIdentities:describeRemovedPlanBindings(before,after),
})
async function seed():Promise<string> {
  const id=idNext()
  const caseRecord={
    id,title:'Physical Case pending upgrade',templateId:'template-one',
    templateVersion:1,objectType:'document',caseFields:{},subjects:[{
      id:'s1',type:'item',title:'One',fields:{},sourceRefs:[],
      correction:'user-confirmed',status:'identified',
    }],documents:['v1','v2'].map((v,i)=>({
      documentId:'d-'+v,versionId:v,contentHash:'a'.repeat(64),
      byteHash:'a'.repeat(64),role:'application',fileName:'source.txt',
      mimeType:'text/plain',sizeBytes:1,assetPath:v+'.txt',parseRevision:1,
      parseStatus:'parsed',blocks:[],usage:'read',active:true,
    })),stage:'reviewing',revision:0,
    createdAt:'2026-10-20T00:00:00Z',updatedAt:'2026-10-20T00:00:00Z',
  } as unknown as ReviewCaseV2
  await createAggregate(id,caseRecord)
  const initial=await bindCanonicalPlanV3(id,{
    requestId:'install',actor,expectedRevision:0,payload:oldPlan(),
  },publishedOnlyForTechnicalFixture)
  expect(initial.ok).toBe(true)
  return id
}
const upgrade=(id:string,requestId:string,opts:{
  previousFingerprint?:string;reason?:string;ack?:CMainUpgradeRemovalAck;
  currentActor?:Actor;revision?:number;allow?:boolean;plan?:CanonicalPlan;
  authorize?:boolean;
}={})=>{
  return upgradeCanonicalPlanV3(id,{
    requestId,actor:opts.currentActor??actor,expectedRevision:opts.revision??1,
    payload:{
      plan:opts.plan??newPlan(),previousFingerprint:opts.previousFingerprint??oldPlan().fingerprint,
      acknowledgement:opts.reason??'Human explicitly approves removal of obsolete Check',
      ...(opts.ack!==undefined?{removalAck:opts.ack}:{}),
    },
  },publishedOnlyForTechnicalFixture,
  opts.authorize===false?undefined:(_agg,authenticated,ack,identities)=>{
    if(opts.allow===false || authenticated.actorId!=='Main-verified-reviewer' ||
      ack.acknowledgedRemovedIdentities.length!==identities.length) {
      throw Error('C_MAIN_REMOVAL_PERMISSION_REVOKED')
    }
  })
}

describe('C B-CR-002-B formal removed-Check UpgradePlan CAS+Receipt',()=>{
  test('Main independently computes exact Check×target×object×subject×source set',()=>{
    const before=oldPlan(),after=newPlan()
    const removed=describeRemovedPlanBindings(before,after)
    expect(removed).toEqual([
      JSON.stringify(['check-deleted','subject:s1','evidence','s1',['v1','v2']]),
    ])
    expect(describeRemovedPlanBindings(after,after)).toEqual([])
    const changed=basePlan(2)
    changed.bindings[0]!.sourceVersionIds=['v2']
    expect(describeRemovedPlanBindings(before,changed)).toHaveLength(2)
  })
  test('UI confirmation without full formal removal ACK cannot write Case or Receipt',async()=>{
    const id=await seed()
    const denied=await upgrade(id,'ui-only')
    expect(denied.ok).toBe(false)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.canonicalPlanHistory).toBeUndefined()
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })
  test('fabricated removed identity, wrong fingerprints, and missing C Main approval reject',async()=>{
    const id=await seed(),before=oldPlan(),after=newPlan()
    const signed=exactAck(before,after)
    const wrong={...signed,acknowledgedRemovedIdentities:['forged Check']}
    expect((await upgrade(id,'wrong-list',{ack:wrong})).ok).toBe(false)
    expect((await upgrade(id,'wrong-next',{ack:{...signed,nextFingerprint:'f'.repeat(64)}})).ok).toBe(false)
    expect((await upgrade(id,'missing-main',{ack:signed,authorize:false})).ok).toBe(false)
    expect((await upgrade(id,'wrong-actor',{ack:signed,currentActor:{...actor,actorId:'Renderer-forged'}})).ok).toBe(false)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })
  test('Main approval revoked at CAS commit and outdated revision fail without mutation',async()=>{
    const id=await seed(),ack=exactAck(oldPlan(),newPlan())
    expect((await upgrade(id,'revoked',{ack,allow:false})).ok).toBe(false)
    expect((await upgrade(id,'stale',{ack,revision:0})).ok).toBe(false)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
  })
  test('exact Main consent adds ONE durable business Receipt and preserves old immutable Plan',async()=>{
    const id=await seed(),ack=exactAck(oldPlan(),newPlan())
    const good=await upgrade(id,'formal-upgrade',{ack})
    expect(good.ok).toBe(true)
    const written=readAggregate(id)!
    expect(written.canonicalPlan?.fingerprint).toBe(newPlan().fingerprint)
    expect(written.canonicalPlanHistory?.[0]?.bindings.map(b=>b.checkKey))
      .toEqual(['check-a','check-deleted'])
    expect(written.receiptLog).toHaveLength(2)
    expect(written.receiptLog[1]?.type).toBe('UpgradeCanonicalPlan')
    expect(written.receiptLog[1]?.summary).toContain('删除义务 1 项')
    expect(written.caseV2.revision).toBe(2)
    const repeated=await upgrade(id,'formal-upgrade',{ack,allow:false})
    expect(repeated.ok).toBe(true)
    expect(readAggregate(id)?.receiptLog).toHaveLength(2)
    const collision=await upgrade(id,'formal-upgrade',{ack,reason:'different acknowledgement'})
    expect(collision.ok).toBe(false)
    if(!collision.ok)expect(collision.code).toBe('REQUEST_ID_COLLISION')
  })
  test('old published-source verifier failure blocks deletion; no-removal upgrade keeps old reason ACK',async()=>{
    const id=await seed(),before=oldPlan(),next=newPlan(),ack=exactAck(before,next)
    const fail=await upgradeCanonicalPlanV3(id,{
      requestId:'unpublished-old',actor,expectedRevision:1,
      payload:{plan:next,previousFingerprint:before.fingerprint,
        acknowledgement:'Human approved',removalAck:ack},
    },(plan)=>{if(plan.fingerprint===before.fingerprint)throw Error('OLD_PUBLISHER_SOURCE_REVOKED')},
      ()=>{})
    expect(fail.ok).toBe(false)
    expect(readAggregate(id)?.receiptLog).toHaveLength(1)
    const another=await seed()
    const replace=oldPlan()
    replace.planId='published-immutable-3';replace.fingerprint='3'.repeat(64)
    replace.bindings=structuredClone(oldPlan().bindings)
    const noRemovals=await upgrade(another,'same-scope',{plan:replace})
    expect(noRemovals.ok).toBe(true)
    expect(readAggregate(another)?.receiptLog).toHaveLength(2)
  })
})
