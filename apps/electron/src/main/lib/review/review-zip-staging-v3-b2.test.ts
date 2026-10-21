import { describe, expect, test } from 'bun:test'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { stageReviewB2TrustedZip } from './review-zip-staging-v3-b2'

const crcTable=Array.from({length:256},(_,i)=>{
  let c=i
  for(let n=0;n<8;n++)c=c&1?0xedb88320^(c>>>1):c>>>1
  return c>>>0
})
function crc32(b:Buffer):number {
  let crc=0xffffffff
  for(const n of b)crc=crcTable[(crc^n)&255]!^(crc>>>8)
  return (crc^0xffffffff)>>>0
}
function zip(names:string[]):Buffer{
  let offset=0
  const local:Buffer[]=[],center:Buffer[]=[]
  for(const name of names){
    const bytes=Buffer.from('test-'+name),file=Buffer.from(name)
    const l=Buffer.alloc(30),c=Buffer.alloc(46),crc=crc32(bytes)
    l.writeUInt32LE(0x04034b50,0);l.writeUInt16LE(20,4)
    l.writeUInt16LE(0x800,6);l.writeUInt32LE(crc,14)
    l.writeUInt32LE(bytes.length,18);l.writeUInt32LE(bytes.length,22)
    l.writeUInt16LE(file.length,26)
    c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(0x0314,4)
    c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8)
    c.writeUInt32LE(crc,16);c.writeUInt32LE(bytes.length,20);c.writeUInt32LE(bytes.length,24)
    c.writeUInt16LE(file.length,28);c.writeUInt32LE(0x81a40000,38);c.writeUInt32LE(offset,42)
    local.push(l,file,bytes);center.push(c,file)
    offset+=l.length+file.length+bytes.length
  }
  const size=Buffer.concat(center).length
  const tail=Buffer.alloc(22);tail.writeUInt32LE(0x06054b50,0)
  tail.writeUInt16LE(names.length,8);tail.writeUInt16LE(names.length,10)
  tail.writeUInt32LE(size,12);tail.writeUInt32LE(offset,16)
  return Buffer.concat([...local,...center,tail])
}
const ctx:B2MainContext={senderId:1,frameId:2,ownerId:'owner-1',ownerGeneration:1,caseCandidateId:'candidate-1'}
describe('B2 Main-only archive staging and per-file receipts',()=>{
  test('good files staged for explicit subject/role confirmation; unsafe child rejected independently',()=>{
    const store=new ReviewB2StagingService()
    const res=stageReviewB2TrustedZip(ctx,store,{
      physicalArchiveKey:'native-picked-archive-v1',requestId:'zip-req-1',
      bytes:zip(['app/a.txt','../bad.txt','evidence/b.txt']),
    })
    expect(res.importBatchKind).toBe('import')
    expect(res.checkpoint).toBe('staging-only')
    expect(res.candidates).toHaveLength(2)
    expect(res.receipts.map(x=>x.status)).toEqual([
      'needs-user-confirmation','rejected','needs-user-confirmation',
    ])
    for(const candidate of res.candidates){
      expect(candidate.role).toBe('unassigned')
      expect(candidate.subjectId).toBeNull()
      expect(candidate.rawSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(store.read(ctx,candidate.candidateId).toString()).toContain('test-')
    }
  })
  test('retry same zip and request is idempotent; changed archive/source with same request rejects',()=>{
    const store=new ReviewB2StagingService()
    const old={physicalArchiveKey:'native-1',requestId:'req-zip',bytes:zip(['same.txt'])}
    const first=stageReviewB2TrustedZip(ctx,store,old)
    const second=stageReviewB2TrustedZip(ctx,store,old)
    expect(second.candidates[0]?.candidateId).toBe(first.candidates[0]?.candidateId)
    expect(()=>stageReviewB2TrustedZip(ctx,store,{
      ...old,bytes:zip(['same.txt','new.txt']),
    })).toThrow('B2_REQUEST_ID_COLLISION')
  })
  test('same requestId with disjoint changed ZIP entry list is rejected atomically',()=>{
    const store=new ReviewB2StagingService()
    const first=stageReviewB2TrustedZip(ctx,store,{
      physicalArchiveKey:'native-disjoint',requestId:'same-import-request',
      bytes:zip(['first.txt']),
    })
    expect(first.candidates).toHaveLength(1)
    expect(()=>stageReviewB2TrustedZip(ctx,store,{
      physicalArchiveKey:'native-disjoint',requestId:'same-import-request',
      bytes:zip(['completely-new.txt']),
    })).toThrow('B2_REQUEST_ID_COLLISION')
    expect(store.read(ctx,first.candidates[0]!.candidateId).toString()).toBe('test-first.txt')
  })
  test('revoke denies further ZIP ingestion without CurrentCase mutation',()=>{
    const store=new ReviewB2StagingService()
    store.revoke(ctx)
    expect(()=>stageReviewB2TrustedZip(ctx,store,{
      physicalArchiveKey:'source-a',requestId:'req-a',bytes:zip(['a.txt']),
    })).toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
})
