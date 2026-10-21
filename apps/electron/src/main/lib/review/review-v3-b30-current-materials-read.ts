/**
 * Dev-B R30: existing B2 Staging -> complete current source inventory for a
 * future C Main-authenticated read port. Enumerate ALL staged records, not
 * just first application or first ZIP. A source listing is not a Case.
 */
import { createHash } from 'node:crypto'
import { ReviewB2StagingService, type B2MaterialCandidate } from './review-intake-adapter-v3-b2'
import type { B20MainReadScope } from './review-v3-b1-b2-main-read-bundle-v3-b'
const sha=/^[a-f0-9]{64}$/
const fail=(reason:string):never=>{throw new Error('B_R30_'+reason)}
export interface B30SourceInventory {
 schemaVersion:'review-v3-b30-complete-source-inventory/1'
 candidateOnly:true;publicationAllowed:false;schoolPolicyVerified:false
 authoritativeMainIdentityIssuedByB:false
 caseCandidateId:string;ownerId:string;ownerGeneration:number
 /** Opaque identity only: no Principal/session/frame/Picker key crosses to Renderer. */
 scopeIdentitySha256:string
 allStagedCount:number;applicationCount:number;unassignedCount:number
 /** A grouping aid only; each ZIP entry remains an independent original. */
 archivedZipEntryCount:number
 sources:Array<{
  candidateId:string;materialId:string;documentVersionId:string
  rawSha256:string;byteLength:number;fileName:string
  role:B2MaterialCandidate['role'];subjectId:string|null
  archiveDerived:boolean;rawBytesRechecked:true
 }>
}
function scopeValid(x:B20MainReadScope|null):x is B20MainReadScope {
 return !!x&&typeof x.principalId==='string'&&x.principalId.trim()!==''&&
  typeof x.sessionId==='string'&&x.sessionId.trim()!==''&&
  typeof x.ownerId==='string'&&x.ownerId.trim()!==''&&
  typeof x.caseCandidateId==='string'&&x.caseCandidateId.trim()!==''&&
  Number.isSafeInteger(x.ownerGeneration)&&x.ownerGeneration>=0&&
  Number.isSafeInteger(x.authorityEpoch)&&x.authorityEpoch>=0&&
  Number.isSafeInteger(x.senderId)&&Number.isSafeInteger(x.frameId)&&
  x.senderId>=0&&x.frameId>=0
}
function same(a:B20MainReadScope,b:B20MainReadScope):boolean{
 return a.principalId===b.principalId&&a.sessionId===b.sessionId&&
 a.ownerId===b.ownerId&&a.caseCandidateId===b.caseCandidateId&&
 a.ownerGeneration===b.ownerGeneration&&a.authorityEpoch===b.authorityEpoch&&
 a.senderId===b.senderId&&a.frameId===b.frameId
}
/**
 * C provides readCurrentScope from the already installed trusted Main runtime;
 * it must not be a renderer body or a caller-invented approval.
 * NO await occurs: old grant/Owner/epoch cannot be carried through an IPC hop
 * without C checking again at its own response delivery boundary.
 */
export function readB30AllCurrentMaterials(
 readCurrentScope:()=>B20MainReadScope|null,
 staging:ReviewB2StagingService,
):B30SourceInventory {
 const start=readCurrentScope()
 if(!scopeValid(start))throw new Error('B_R30_C_MAIN_SCOPE_NOT_INSTALLED')
 staging.assertStillGranted(start)
 const ids=staging.listScopedCandidateIds(start)
 if(!Array.isArray(ids)||ids.length>500||
   new Set(ids).size!==ids.length)fail('INCOMPLETE_STAGING_REGISTRY')
 const sources:B30SourceInventory['sources']=[]
 for(const id of ids){
  const material=staging.getCandidate(start,id)
  const actual=staging.read(start,id)
  if(material.caseCandidateId!==start.caseCandidateId||
     material.ownerId!==start.ownerId||
     material.ownerGeneration!==start.ownerGeneration||
     material.status!=='accepted'||!sha.test(material.rawSha256)||
     actual.byteLength!==material.byteLength||
     createHash('sha256').update(actual).digest('hex')!==material.rawSha256)
   fail('PHYSICAL_BYTES_OR_CURRENT_OWNER_CONFLICT')
  sources.push({
    candidateId:material.candidateId,materialId:material.materialId,
    documentVersionId:material.documentVersionId,rawSha256:material.rawSha256,
    byteLength:material.byteLength,fileName:material.fileName,
    role:material.role,subjectId:material.subjectId,
    archiveDerived:material.physicalSourceKey.startsWith('zip-'),
    rawBytesRechecked:true,
  })
 }
 const end=readCurrentScope()
 if(!scopeValid(end)||!same(start,end))
   throw new Error('B_R30_SCOPE_CHANGED_DURING_SOURCE_READ')
 staging.assertStillGranted(end)
 return {schemaVersion:'review-v3-b30-complete-source-inventory/1',
   candidateOnly:true,publicationAllowed:false,schoolPolicyVerified:false,
   authoritativeMainIdentityIssuedByB:false,
   caseCandidateId:start.caseCandidateId,ownerId:start.ownerId,
   ownerGeneration:start.ownerGeneration,
   scopeIdentitySha256:createHash('sha256').update(JSON.stringify([
    start.principalId,start.sessionId,start.senderId,start.frameId,
    start.ownerId,start.ownerGeneration,start.caseCandidateId,start.authorityEpoch,
   ])).digest('hex'),
   allStagedCount:sources.length,
   applicationCount:sources.filter(x=>x.role==='application').length,
   unassignedCount:sources.filter(x=>x.role==='unassigned').length,
   archivedZipEntryCount:sources.filter(x=>x.archiveDerived).length,sources}
}
