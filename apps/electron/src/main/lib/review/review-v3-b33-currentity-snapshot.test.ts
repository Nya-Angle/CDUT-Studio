import { describe,expect,test } from 'bun:test'
import { ReviewB2StagingService } from './review-intake-adapter-v3-b2'
import { readB30AllCurrentMaterials } from './review-v3-b30-current-materials-read'
import { buildB33StableCurrentity,assertB33StillCurrent } from './review-v3-b33-currentity-snapshot'
import type { B20MainReadScope, B20CurrentCandidateRead } from './review-v3-b1-b2-main-read-bundle-v3-b'

const ctx:B20MainReadScope={principalId:'main-principal',sessionId:'real-main-session',
 senderId:100,frameId:8,ownerId:'real-owner',ownerGeneration:1,
 authorityEpoch:17,caseCandidateId:'real-case'}
const sha='e'.repeat(64)
function inventory(){
 const staging=new ReviewB2StagingService()
 for(const [i,role] of ['application','supporting','supporting'].entries()){
  const token=staging.grant(ctx).token
  staging.stage(ctx,token,{requestId:'req-'+i,fileName:'file-'+i+'.pdf',
   physicalSourceKey:i===0?'native-file-0':'zip-entry-'+i,
   bytes:Buffer.from('actual-physical-byte-'+i),
   role:role as 'application'|'supporting',subjectId:'subject-A'})
 }
 return readB30AllCurrentMaterials(()=>ctx,staging)
}
function input(){
 return {inventory:inventory(),candidate:null,route:{status:'unmatched' as const,
  remainingMs:0,reason:'No matching business type'},historical:null,recovery:null}
}
describe('B33 deterministic complete physical-material version, not a credential',()=>{
 test('same full staged bytes + owner/epoch + route yields stable readVersion, even after reordered list',()=>{
  const one=input(),two=structuredClone(one)
  two.inventory.sources.reverse()
  const a=buildB33StableCurrentity(one),b=buildB33StableCurrentity(two)
  expect(a.readVersion).toMatch(/^[a-f0-9]{64}$/)
  expect(a.readVersion).toBe(b.readVersion)
  expect(a.materialCount).toBe(3)
  expect(a.versionIsAuthorization).toBe(false)
  expect(a.publicationAllowed).toBe(false)
  expect(()=>assertB33StillCurrent(one,two)).not.toThrow()
 })
 test('a second ZIP entry removed, byte swapped, duplicate entry or 501 items cannot pass',()=>{
  const one=input(),missing=structuredClone(one)
  missing.inventory.sources.pop()
  expect(()=>buildB33StableCurrentity(missing)).toThrow('B_R33_INVENTORY_NOT_CURRENT')
  const changed=structuredClone(one)
  changed.inventory.sources[2]!.rawSha256='0'.repeat(64)
  expect(()=>assertB33StillCurrent(one,changed)).toThrow('B_R33_CURRENT_SOURCE_OR_OWNER_CHANGED')
  const duplicate=structuredClone(one)
  duplicate.inventory.sources[1]!.candidateId=duplicate.inventory.sources[0]!.candidateId
  expect(()=>buildB33StableCurrentity(duplicate)).toThrow('B_R33_MATERIAL_IDENTITY_OR_DUPLICATE')
  const huge=structuredClone(one)
  huge.inventory.sources=Array.from({length:501},(_,i)=>({
   ...one.inventory.sources[0]!,candidateId:'overflow-'+i,
  }))
  huge.inventory.allStagedCount=501
  expect(()=>buildB33StableCurrentity(huge)).toThrow('B_R33_INVENTORY_NOT_CURRENT')
 })
 test('role, Subject, source version and opaque Main scope each independently change stable version',()=>{
  const base=input()
  for(const mutate of [
   (i:ReturnType<typeof input>)=>{i.inventory.sources[0]!.role='supporting';i.inventory.applicationCount=0},
   (i:ReturnType<typeof input>)=>{i.inventory.sources[0]!.subjectId='different-student'},
   (i:ReturnType<typeof input>)=>{i.inventory.sources[2]!.documentVersionId='replaced-ZIP'},
   (i:ReturnType<typeof input>)=>{i.inventory.scopeIdentitySha256='c'.repeat(64)},
  ]){
    const other=structuredClone(base);mutate(other)
    // Semantically changed inputs either create a DIFFERENT stable digest,
    // or fail closed earlier on a malformed full-inventory ledger. They
    // can never be reused as the previous technical candidate version.
    const prior=buildB33StableCurrentity(base).readVersion
    let current:string|null=null,refused:string|null=null
    try{current=buildB33StableCurrentity(other).readVersion}
    catch(error){refused=error instanceof Error?error.message:String(error)}
    if(refused!==null)
      expect(refused).toMatch(/^B_R33_(INVENTORY_NOT_CURRENT|CURRENT_SOURCE_OR_OWNER_CHANGED)$/)
    else {
      expect(current).not.toBe(prior)
      expect(()=>assertB33StillCurrent(base,other)).toThrow('B_R33_CURRENT_SOURCE_OR_OWNER_CHANGED')
    }
  }
 })
 test('conservative technical route transition changes checksum, countdown remaining-only does not',()=>{
  const base=input()
  const other={...structuredClone(base),route:{status:'manually-selected' as const,
   reason:'Human confirmed',remainingMs:0,
   chosen:{templateId:'g02-t01',templateVersion:'1'}}}
  expect(()=>assertB33StillCurrent(base,other)).toThrow('B_R33_CURRENT_SOURCE_OR_OWNER_CHANGED')
  const countdown={...base,route:{status:'countdown' as const,remainingMs:19990,reason:'one candidate'}}
  const later={...countdown,route:{...countdown.route,remainingMs:15000}}
  expect(buildB33StableCurrentity(countdown).readVersion)
    .toBe(buildB33StableCurrentity(later).readVersion)
 })
 test('author/parser/check SourceIdentity changes cannot share version, stale linked source fails closed',()=>{
  const base=input(),source=base.inventory.sources[0]!
  const candidate={
   schemaVersion:'review-v3-b20-main-read-bundle/1',candidateOnly:true,
   publicationAllowed:false,businessWriteAllowed:false,schoolPolicyVerified:false,
   authorityInstalledByB:false,caseCandidateId:'real-case',ownerId:'real-owner',
   ownerGeneration:1,templateId:'user-candidate',authorRevision:2,
   authorRevisionDigest:sha,authorStatus:'candidate-held',frozenFingerprint:sha,
   frozenAuthorDigest:sha,frozenDescriptor:{canonicalPlan:{fingerprint:sha}},
   candidateProvenance:{
    schemaVersion:'review-v3-b1-b2-candidate-source/1',candidateOnly:true,
    publicationAllowed:false,businessWriteAllowed:false,schoolPolicyVerified:false,
    ownerId:'real-owner',ownerGeneration:1,caseCandidateId:'real-case',
    planFingerprint:sha,authorDigest:sha,snapshotHash:sha,
    invalidatedPriorEvidence:[],bindings:[{
      checkKey:'check-one',targetKey:'target-one',objectKey:'object-one',
      subjectId:'subject-A',applicability:'unknown',state:'linked-candidate',
      sources:[{sourceId:'source-1',state:'linked-candidate',reason:'candidate-technical',
        candidateId:source.candidateId,documentVersionId:source.documentVersionId,
        declaredDocumentVersionId:source.documentVersionId,
        rawSha256:source.rawSha256,materialId:source.materialId,
        role:source.role,subjectId:source.subjectId,parseRevision:'parse1',blockId:'block1',
        readExtent:{source:{blockId:'block1'}},receiptHash:sha,archiveId:null,
        entryIndex:null,ledgerHash:null,proposalHash:null,
      }],
    }],
   },
  } as unknown as B20CurrentCandidateRead
  const original={...base,candidate}
  const first=buildB33StableCurrentity(original)
  const parserChange=structuredClone(original)
  parserChange.candidate.candidateProvenance.bindings[0]!.sources[0]!.parseRevision='parse2'
  expect(buildB33StableCurrentity(parserChange).readVersion).not.toBe(first.readVersion)
  const sourceReplaced=structuredClone(original)
  sourceReplaced.inventory.sources[0]!.rawSha256='1'.repeat(64)
  expect(()=>buildB33StableCurrentity(sourceReplaced)).toThrow('B_R33_LINKED_SOURCE_NOT_CURRENT')
  const stolen=structuredClone(original)
  stolen.candidate.ownerGeneration=9
  expect(()=>buildB33StableCurrentity(stolen)).toThrow('B_R33_FROZEN_AUTHOR_OR_OWNER_CHANGED')
 })
})
