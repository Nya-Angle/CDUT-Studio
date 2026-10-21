/**
 * Dev-B R33 — stable, read-only CURRENT product source identity.
 *
 * C Main must call this only with live, C-authenticated, same-Owner inputs
 * from its trusted actor/epoch registry. The resulting SHA256 is a comparison
 * checksum, NEVER a capability, a signature, a Principal or a Case writer.
 *
 * A current read must include the WHOLE B2 stage inventory, not a caller-
 * selected material subset, with B20/B19 parser receipts bound by exact
 * source version, material ID, byte SHA, subject and role.
 */
import { createHash } from 'node:crypto'
import type { B30SourceInventory } from './review-v3-b30-current-materials-read'
import type { B20CurrentCandidateRead } from './review-v3-b1-b2-main-read-bundle-v3-b'
import type { B3RouteState } from './review-intake-routing-adapter-v3-b3'
import type { B26Workbench } from './review-v3-b4-bulk-evidence-workbench'
import type { B23RecoveryPreflight } from './review-v3-b1-b2-recovery-preflight-v3-b'

const deny=(code:string):never=>{throw new Error('B_R33_'+code)}
const sha=/^[a-f0-9]{64}$/
const key=(...x:unknown[]):string=>JSON.stringify(x)
const hash=(x:unknown):string=>createHash('sha256').update(JSON.stringify(x)).digest('hex')

export interface B33CurrentInput {
 inventory:B30SourceInventory
 candidate:B20CurrentCandidateRead|null
 route:B3RouteState
 historical:B26Workbench|null
 recovery:B23RecoveryPreflight|null
 /** Stable identity of the C-owned current template catalog, if available. */
 catalogVersion?:string
}
export interface B33CurrentSnapshot {
 schemaVersion:'review-v3-b33-currentity/1'
 readVersion:string
 caseCandidateId:string
 materialCount:number
 checkTargetCount:number
 frozenSourceUnknown:number
 candidateOnly:true
 publicationAllowed:false
 businessWriteAllowed:false
 schoolPolicyVerified:false
 versionIsAuthorization:false
}
export function buildB33StableCurrentity(input:B33CurrentInput):B33CurrentSnapshot {
 if(!input||!input.inventory||!input.route||
    typeof input.route.status!=='string'||
    input.catalogVersion!==undefined&&
      (typeof input.catalogVersion!=='string'||!input.catalogVersion.trim()))
   deny('INPUT_NOT_CURRENT')
 const v=input.inventory
 if(v.schemaVersion!=='review-v3-b30-complete-source-inventory/1'||
    v.candidateOnly!==true||v.publicationAllowed!==false||
    v.schoolPolicyVerified!==false||
    v.authoritativeMainIdentityIssuedByB!==false||
    !sha.test(v.scopeIdentitySha256)||!v.caseCandidateId||
    !v.ownerId||!Number.isSafeInteger(v.ownerGeneration)||
    v.ownerGeneration<0||
    !Array.isArray(v.sources)||v.sources.length>500||
    v.allStagedCount!==v.sources.length||
    v.applicationCount!==v.sources.filter(x=>x.role==='application').length||
    v.unassignedCount!==v.sources.filter(x=>x.role==='unassigned').length||
    v.archivedZipEntryCount!==v.sources.filter(x=>x.archiveDerived).length)
   deny('INVENTORY_NOT_CURRENT')
 const byId=new Map<string,(typeof v.sources)[number]>()
 for(const x of v.sources){
   if(!x||!x.candidateId||!x.documentVersionId||
      !x.materialId||!x.fileName||!sha.test(x.rawSha256)||
      !Number.isSafeInteger(x.byteLength)||x.byteLength<1||
      !['application','supporting','unassigned'].includes(x.role)||
      x.rawBytesRechecked!==true||byId.has(x.candidateId))
     deny('MATERIAL_IDENTITY_OR_DUPLICATE')
   byId.set(x.candidateId,x)
 }
 const materialFacts=[...byId.values()].map(x=>[
  x.candidateId,x.materialId,x.documentVersionId,
  x.rawSha256,x.byteLength,x.fileName,x.role,x.subjectId,x.archiveDerived,
 ]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
 const c=input.candidate
 const checks:unknown[]=[]
 let currentAuthor:unknown=null
 if(c){
   const provenance=c.candidateProvenance
   if(c.schemaVersion!=='review-v3-b20-main-read-bundle/1'||
      c.candidateOnly!==true||c.publicationAllowed!==false||
      c.businessWriteAllowed!==false||c.schoolPolicyVerified!==false||
      c.authorityInstalledByB!==false||
      c.caseCandidateId!==v.caseCandidateId||c.ownerId!==v.ownerId||
      c.ownerGeneration!==v.ownerGeneration||
      !sha.test(c.frozenFingerprint)||!sha.test(c.authorRevisionDigest)||
      !provenance||provenance.schemaVersion!=='review-v3-b1-b2-candidate-source/1'||
      provenance.candidateOnly!==true||provenance.publicationAllowed!==false||
      provenance.businessWriteAllowed!==false||
      provenance.ownerId!==v.ownerId||
      provenance.ownerGeneration!==v.ownerGeneration||
      provenance.caseCandidateId!==v.caseCandidateId||
      provenance.planFingerprint!==c.frozenFingerprint||
      !sha.test(provenance.snapshotHash)||
      !Array.isArray(provenance.bindings))
      deny('FROZEN_AUTHOR_OR_OWNER_CHANGED')
   const bindings=new Set<string>()
   for(const b of provenance.bindings){
     const id=key(b.checkKey,b.targetKey,b.objectKey,b.subjectId)
     if(bindings.has(id)||!Array.isArray(b.sources))deny('DUPLICATE_CHECK_TARGET')
     bindings.add(id)
     const sources=new Set<string>()
     const facts:unknown[]=[]
     for(const s of b.sources){
       if(!s.sourceId||sources.has(s.sourceId))
         deny('DUPLICATE_SOURCE_ID')
       sources.add(s.sourceId)
       if(s.state==='linked-candidate'){
         const original=s.candidateId?byId.get(s.candidateId):undefined
         if(!original)throw new Error('B_R33_LINKED_SOURCE_MISSING_FROM_FULL_STAGING')
         if(original.rawSha256!==s.rawSha256||
            original.documentVersionId!==s.documentVersionId||
            original.materialId!==s.materialId||
            original.subjectId!==s.subjectId||
            original.role!==s.role||!s.parseRevision||
            !s.blockId||!s.readExtent||
            !sha.test(s.receiptHash??''))
           deny('LINKED_SOURCE_NOT_CURRENT')
       }
       facts.push([
         s.sourceId,s.state,s.reason,s.candidateId,
         s.documentVersionId,s.declaredDocumentVersionId,s.materialId,
         s.rawSha256,s.parseRevision,s.blockId,s.readExtent,
         s.archiveId,s.entryIndex,s.ledgerHash,s.receiptHash,
         s.proposalHash,s.role,s.subjectId,
       ])
     }
     facts.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
     checks.push([b.checkKey,b.targetKey,b.objectKey,b.subjectId,
       b.applicability,b.state,facts])
   }
   checks.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
   currentAuthor=[
     c.templateId,c.authorRevision,c.authorRevisionDigest,
     c.frozenFingerprint,c.frozenAuthorDigest,
     c.frozenDescriptor.canonicalPlan.fingerprint,
     provenance.snapshotHash,provenance.invalidatedPriorEvidence,
   ]
 }
 if(input.historical && (
   input.historical.schemaVersion!=='review-v3-b26-source-workbench/1'||
   input.historical.candidateOnly!==true||
   input.historical.publicationAllowed!==false||
   !sha.test(input.historical.snapshotSha256)||
   input.historical.counts.unknownSourceRefs!==4163||
   input.historical.counts.unscoped!==34))
   deny('HISTORICAL_FROZEN_SOURCE_INVALID')
 if(input.recovery && (
    input.recovery.schemaVersion!=='review-v3-b23-recovery-preflight/1'||
    input.recovery.candidateOnly!==true||
    input.recovery.businessWriteAllowed!==false))
   deny('RECOVERY_NOT_CURRENT_CANDIDATE')
 const identity=[
  'review-v3-b33-currentity/1',v.caseCandidateId,v.ownerId,v.ownerGeneration,
  v.scopeIdentitySha256,materialFacts,
  [input.route.status,input.route.chosen?.templateId??null,
   input.route.chosen?.templateVersion??null,
   input.route.reason],
  input.catalogVersion??null,currentAuthor,checks,
  input.historical?.snapshotSha256??null,
  input.recovery??null,
 ]
 return {
  schemaVersion:'review-v3-b33-currentity/1',
  readVersion:hash(identity),caseCandidateId:v.caseCandidateId,
  materialCount:materialFacts.length,checkTargetCount:checks.length,
  frozenSourceUnknown:input.historical?.counts.unknownSourceRefs??0,
  candidateOnly:true,publicationAllowed:false,businessWriteAllowed:false,
  schoolPolicyVerified:false,versionIsAuthorization:false,
 }
}
/**
 * C provides C-owned current read transaction. This function checks
 * stable data between two separately obtained snapshots, but it cannot
 * itself prove native Principal/grant or validate asynchronous IPC delivery.
 */
export function assertB33StillCurrent(before:B33CurrentInput,after:B33CurrentInput):void{
 const a=buildB33StableCurrentity(before)
 const b=buildB33StableCurrentity(after)
 if(a.readVersion!==b.readVersion)
  deny('CURRENT_SOURCE_OR_OWNER_CHANGED')
}
