import {describe,test,expect} from 'bun:test'
import {ReviewB2StagingService} from './review-intake-adapter-v3-b2'
import {readB30AllCurrentMaterials} from './review-v3-b30-current-materials-read'
import type {B20MainReadScope} from './review-v3-b1-b2-main-read-bundle-v3-b'
const scope:B20MainReadScope={
 principalId:'trusted-main-principal',sessionId:'trusted-main-session',
 authorityEpoch:1,senderId:10,frameId:2,ownerId:'owner-b',
 ownerGeneration:3,caseCandidateId:'case-1',
}
describe('B R30 entire current material universe, original bytes and Owner',()=>{
 test('enumerates all direct and independent ZIP entry originals, no first-file shortcut',()=>{
  const staging=new ReviewB2StagingService()
  let n=0
  for(const role of ['application','supporting','supporting'] as const){
   const i=n++,token=staging.grant(scope).token
   staging.stage(scope,token,{requestId:'req-'+i,fileName:'source'+i+'.pdf',
     physicalSourceKey:i===0?'picker-1':'zip-source-'+i,
     bytes:Buffer.from('original-'+i),role,subjectId:'student-A'})
  }
  const read=readB30AllCurrentMaterials(()=>scope,staging)
  expect(read.allStagedCount).toBe(3)
  expect(read.applicationCount).toBe(1)
  expect(read.archivedZipEntryCount).toBe(2)
  expect(new Set(read.sources.map(x=>x.candidateId)).size).toBe(3)
  expect(read.sources.every(x=>x.rawBytesRechecked)).toBe(true)
  expect(read.publicationAllowed).toBe(false)
  expect(read.authoritativeMainIdentityIssuedByB).toBe(false)
 })
 test('change of trusted Main epoch during list is rejected',()=>{
  const staging=new ReviewB2StagingService()
  const token=staging.grant(scope).token
  staging.stage(scope,token,{requestId:'1',fileName:'1.pdf',
    physicalSourceKey:'picker-1',bytes:Buffer.from('real'),role:'application',
    subjectId:'student-A'})
  let calls=0
  expect(()=>readB30AllCurrentMaterials(()=>{
    calls++
    return calls===1?scope:{...scope,authorityEpoch:4}
  },staging)).toThrow('B_R30_SCOPE_CHANGED_DURING_SOURCE_READ')
 })
 test('revoked Owner and absent trusted Main cannot read physical original',()=>{
  const staging=new ReviewB2StagingService()
  expect(()=>readB30AllCurrentMaterials(()=>null,staging))
    .toThrow('B_R30_C_MAIN_SCOPE_NOT_INSTALLED')
  staging.revoke(scope)
  expect(()=>readB30AllCurrentMaterials(()=>scope,staging))
    .toThrow('B2_OWNER_INVALID_OR_REVOKED')
 })
})
