import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
const home=mkdtempSync(join(tmpdir(),'review-v3-zip-durable-'))
afterAll(()=>rmSync(home,{recursive:true,force:true}))
const crcTable=Array.from({length:256},(_,i)=>{
  let c=i
  for(let n=0;n<8;n++)c=c&1?0xedb88320^(c>>>1):c>>>1
  return c>>>0
})
function crc32(b:Buffer):number{
  let c=0xffffffff
  for(const n of b)c=crcTable[(c^n)&255]!^(c>>>8)
  return(c^0xffffffff)>>>0
}
function makeZip(text:string):Buffer{
  const name=Buffer.from('evidence.txt'),raw=Buffer.from(text),crc=crc32(raw)
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0)
  local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6)
  local.writeUInt32LE(crc,14);local.writeUInt32LE(raw.length,18)
  local.writeUInt32LE(raw.length,22);local.writeUInt16LE(name.length,26)
  const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50,0)
  central.writeUInt16LE(0x0314,4);central.writeUInt16LE(20,6)
  central.writeUInt16LE(0x800,8);central.writeUInt32LE(crc,16)
  central.writeUInt32LE(raw.length,20);central.writeUInt32LE(raw.length,24)
  central.writeUInt16LE(name.length,28);central.writeUInt32LE(0x81a40000,38)
  const offset=local.length+name.length+raw.length
  const tail=Buffer.alloc(22);tail.writeUInt32LE(0x06054b50,0)
  tail.writeUInt16LE(1,8);tail.writeUInt16LE(1,10)
  tail.writeUInt32LE(central.length+name.length,12);tail.writeUInt32LE(offset,16)
  return Buffer.concat([local,name,raw,central,name,tail])
}
const ctx:B2MainContext={
  senderId:7,frameId:1,ownerId:'owner-main',ownerGeneration:1,caseCandidateId:'case-test',
}
describe('B2 durable input checkpoint is not a CurrentCase writer',()=>{
  test('fsynced ZIP original survives new adapter instance, remains needs-restaging',()=>{
    const staging=new ReviewB2StagingService()
    const vault=new ReviewB2ArchiveVault(staging,home)
    const archive={physicalArchiveKey:'native-picker-file-1',requestId:'r1',bytes:makeZip('proof bytes')}
    const {checkpoint,preview}=vault.saveAndStage(ctx,archive)
    expect(checkpoint.checkpointState).toBe('bytes-durable-needs-confirmation')
    expect(preview.receipts[0]!.status).toBe('needs-user-confirmation')
    expect(vault.inspect(ctx,checkpoint.archiveId)).toEqual(checkpoint)
    const newlyAuthenticated={...ctx,ownerGeneration:2}
    const nextStaging=new ReviewB2StagingService()
    const reopened=new ReviewB2ArchiveVault(nextStaging,home)
    const restage=reopened.prepareRestage(newlyAuthenticated,checkpoint.archiveId)
    expect(restage.status).toBe('needs-main-revalidation')
    expect('physicalArchiveKey' in restage.restage).toBe(false)
    expect(Buffer.from(restage.restage.bytes).equals(archive.bytes)).toBe(true)
    expect(restage.checkpoint.archiveSha256).toBe(checkpoint.archiveSha256)
    expect(nextStaging.previewImportBatch(newlyAuthenticated,[]).status).toBe('staged')
    const replay=reopened.saveAndStage(newlyAuthenticated,archive)
    expect(replay.preview.candidates).toHaveLength(1)
    expect(replay.preview.candidates[0]!.ownerGeneration).toBe(2)
  })
  test('duplicate request different archive bytes fails and previous checkpoint unchanged',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const input={physicalArchiveKey:'native-file-2',requestId:'collision-2',bytes:makeZip('original')}
    const first=vault.saveAndStage(ctx,input).checkpoint
    expect(()=>vault.saveAndStage(ctx,{...input,bytes:makeZip('modified')}))
      .toThrow('B2_ARCHIVE_REQUEST_ID_COLLISION')
    expect(vault.inspect(ctx,first.archiveId).archiveSha256).toBe(first.archiveSha256)
  })
  test('tampered bytes or JSON are detected, no silent reactivation',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const input={physicalArchiveKey:'native-file-3',requestId:'tamper-3',bytes:makeZip('original')}
    const checkpoint=vault.saveAndStage(ctx,input).checkpoint
    const stored=join(home,checkpoint.archiveId,'archive.zip')
    writeFileSync(stored,Buffer.from('spoofed-bytes'))
    expect(()=>vault.prepareRestage(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_CHECKPOINT_INTEGRITY')
  })
  test('cross-owner and revoked owner cannot recover archive without trusted Main context',()=>{
    const staging=new ReviewB2StagingService()
    const vault=new ReviewB2ArchiveVault(staging,home)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-file-4',requestId:'private-4',bytes:makeZip('private'),
    }).checkpoint
    expect(()=>vault.prepareRestage({...ctx,ownerId:'someone-else'},checkpoint.archiveId))
      .toThrow('B2_ARCHIVE_OWNER_SCOPE_MISMATCH')
    staging.revoke(ctx)
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
  test('tampered symlink archive refuses access rather than reading external file',()=>{
    const staging=new ReviewB2StagingService()
    // Keep deliberately poisoned archive.zip out of the shared capacity root.
    // The production vault must still reject it; unrelated test archives stay isolated.
    const isolated=join(home,'symlink-poison-isolated')
    const vault=new ReviewB2ArchiveVault(staging,isolated)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-file-link',requestId:'linked-5',bytes:makeZip('normal bytes'),
    }).checkpoint
    const stored=join(isolated,checkpoint.archiveId,'archive.zip')
    rmSync(stored)
    const outside=join(isolated,'out-of-scope.txt')
    writeFileSync(outside,makeZip('external bytes'))
    symlinkSync(outside,stored)
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_RECOVERY_REQUIRED')
  })

  test('forged child digest cannot be repaired by recomputing the unkeyed JSON checksum',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-byte-proof',requestId:'byte-proof-7',bytes:makeZip('verified original'),
    }).checkpoint
    const path=join(home,checkpoint.archiveId,'checkpoint.json')
    const tampered=JSON.parse(readFileSync(path,'utf8'))
    tampered.fileReceipts[0].rawSha256='0'.repeat(64)
    const {manifestSha256:_before,...plain}=tampered
    tampered.manifestSha256=createHash('sha256').update(JSON.stringify(plain)).digest('hex')
    writeFileSync(path,JSON.stringify(tampered))
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_CHECKPOINT_INTEGRITY')
  })
  test('forged rejected status cannot suppress an originally accepted file',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-reject-proof',requestId:'reject-proof-8',bytes:makeZip('unchanged original'),
    }).checkpoint
    const path=join(home,checkpoint.archiveId,'checkpoint.json')
    const tampered=JSON.parse(readFileSync(path,'utf8'))
    tampered.fileReceipts[0].status='rejected'
    tampered.fileReceipts[0].reason='SYMLINK'
    const {manifestSha256:_before,...plain}=tampered
    tampered.manifestSha256=createHash('sha256').update(JSON.stringify(plain)).digest('hex')
    writeFileSync(path,JSON.stringify(tampered))
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_CHECKPOINT_INTEGRITY')
  })
  test('tampered archived decoder limits cannot retroactively promote rejected child',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'strict-bound-policy',requestId:'strict-policy-10',
      bytes:makeZip('original must be rejected under locked size'),
    },{maxEntryBytes:3}).checkpoint
    const file=join(home,checkpoint.archiveId,'checkpoint.json')
    const tampered=JSON.parse(readFileSync(file,'utf8'))
    tampered.decodeLimits={maxEntryBytes:50*1024*1024}
    const {manifestSha256:_before,...plain}=tampered
    tampered.manifestSha256=createHash('sha256').update(JSON.stringify(plain)).digest('hex')
    writeFileSync(file,JSON.stringify(tampered))
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_CHECKPOINT_INTEGRITY')
  })
  test('stricter originally rejected entry cannot be promoted during restart',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-strict-proof',requestId:'strict-proof-9',
      bytes:makeZip('original longer than three bytes'),
    },{maxEntryBytes:3}).checkpoint
    expect(checkpoint.fileReceipts[0]!.reason).toBe('BOMB_OR_SIZE_LIMIT')
    expect(checkpoint.schemaVersion).toBe('review-b2-archive/2')
    expect(checkpoint.decodeLimits).toEqual({maxEntryBytes:3})
    const reopened=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    expect(reopened.inspect(ctx,checkpoint.archiveId).fileReceipts[0]!.status).toBe('rejected')
    const intent=reopened.prepareRestage({...ctx,ownerGeneration:2},checkpoint.archiveId)
    expect('physicalArchiveKey' in intent.restage).toBe(false)
  })

  test('same archive retry cannot alter the historical ZIP decode policy or child confirmation',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const item={physicalArchiveKey:'native-policy-replay',requestId:'policy-replay-11',
      bytes:makeZip('original exceeds strict maximum')}
    const locked=vault.saveAndStage(ctx,item,{maxEntryBytes:3}).checkpoint
    expect(locked.fileReceipts[0]!.status).toBe('rejected')
    expect(()=>vault.saveAndStage(ctx,item)).toThrow('B2_ARCHIVE_DECODE_PROFILE_CONFLICT')
    expect(()=>vault.saveAndStage(ctx,item,{maxEntryBytes:50*1024*1024}))
      .toThrow('B2_ARCHIVE_DECODE_PROFILE_CONFLICT')
    expect(vault.inspect(ctx,locked.archiveId)).toEqual(locked)
    const safeReplay=vault.saveAndStage(ctx,item,{maxEntryBytes:3})
    expect(safeReplay.checkpoint).toEqual(locked)
    expect(safeReplay.preview.receipts[0]!.status).toBe('rejected')
  })
  test('equivalent explicit default decompression policy preserves idempotent retry',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const input={physicalArchiveKey:'native-effective-default',requestId:'default-profile-16',
      bytes:makeZip('default replay')}
    const first=vault.saveAndStage(ctx,input)
    const second=vault.saveAndStage(ctx,input,{
      maxArchiveBytes:256*1024*1024,
      maxEntryBytes:50*1024*1024,
      maxTotalBytes:200*1024*1024,
      maxEntries:1000,
      maxCompressionRatio:100,
    })
    expect(second.checkpoint).toEqual(first.checkpoint)
    expect(second.preview.receipts).toEqual(first.preview.receipts)
  })
  test('global root capacity lock rejects another PID writer without orphan cleanup or mutations',()=>{
    const staging=new ReviewB2StagingService()
    const vault=new ReviewB2ArchiveVault(staging,home)
    const lock=join(home,'capacity.lock')
    writeFileSync(lock,'held-by-other-pid',{flag:'wx'})
    try {
      expect(()=>vault.saveAndStage(ctx,{
        physicalArchiveKey:'native-during-capacity-lock',requestId:'locked-root-12',
        bytes:makeZip('queued-not-written'),
      })).toThrow('B2_ARCHIVE_CAPACITY_LOCKED')
      expect(readFileSync(lock,'utf8')).toBe('held-by-other-pid')
    } finally { rmSync(lock) }
    const committed=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-during-capacity-lock',requestId:'locked-root-12',
      bytes:makeZip('queued-not-written'),
    }).checkpoint
    expect(vault.inspect(ctx,committed.archiveId)).toEqual(committed)
  })
  test('legacy /1 source is inspect-only and cannot be re-staged using an unknown size policy',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const input={physicalArchiveKey:'native-legacy-profile',requestId:'legacy-profile-13',
      bytes:makeZip('historical bytes')}
    const created=vault.saveAndStage(ctx,input).checkpoint
    const file=join(home,created.archiveId,'checkpoint.json')
    const old=JSON.parse(readFileSync(file,'utf8'))
    old.schemaVersion='review-b2-archive/1'
    delete old.decodeLimits
    const {manifestSha256:_old,...payload}=old
    old.manifestSha256=createHash('sha256').update(JSON.stringify(payload)).digest('hex')
    writeFileSync(file,JSON.stringify(old))
    expect(vault.inspect(ctx,created.archiveId).schemaVersion).toBe('review-b2-archive/1')
    expect(()=>vault.saveAndStage(ctx,input)).toThrow('B2_ARCHIVE_LEGACY_PROFILE_UNPINNED')
    const intent=vault.prepareRestage({...ctx,ownerGeneration:2},created.archiveId)
    expect(intent.status).toBe('needs-main-revalidation')
    expect('physicalArchiveKey' in intent.restage).toBe(false)
  })

  test('orphaned ZIP from crash never becomes a fresh silently trusted checkpoint',()=>{
    const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
    const input={physicalArchiveKey:'native-crash-orphan',requestId:'orphan-test-14',
      bytes:makeZip('original file recovered only by manual action')}
    const checkpoint=vault.saveAndStage(ctx,input).checkpoint
    rmSync(join(home,checkpoint.archiveId,'checkpoint.json'))
    expect(()=>vault.saveAndStage(ctx,input)).toThrow('B2_ARCHIVE_RECOVERY_REQUIRED')
    expect(readFileSync(join(home,checkpoint.archiveId,'archive.zip')).equals(input.bytes)).toBe(true)
    expect(()=>vault.inspect(ctx,checkpoint.archiveId)).toThrow('B2_ARCHIVE_RECOVERY_REQUIRED')
    expect(()=>readFileSync(join(home,'capacity.lock'))).toThrow()
  })
  test('root symlink is refused before writing or following it into another directory',()=>{
    const staging=new ReviewB2StagingService()
    const rootLink=join(home,'unsafe-root-link')
    symlinkSync(home,rootLink,'dir')
    try {
      const vault=new ReviewB2ArchiveVault(staging,rootLink)
      expect(()=>vault.saveAndStage(ctx,{
        physicalArchiveKey:'native-symlink-root',requestId:'root-link-15',
        bytes:makeZip('sensitive original'),
      })).toThrow('B2_ARCHIVE_UNSAFE_ROOT')
    } finally {rmSync(rootLink)}
  })

})

describe('B2 R18 restart reauthorization handshake never promotes old ZIP into Case',()=>{
 test('new owner generation and re-picked identical original produce fresh candidate only, receipts pinned',()=>{
   const one=new ReviewB2StagingService()
   const archive={physicalArchiveKey:'native-r18-original-a',requestId:'r18-restart-a',
     bytes:makeZip('recovered candidate bytes')}
   const first=new ReviewB2ArchiveVault(one,home).saveAndStage(ctx,archive)
   const nextCtx={...ctx,ownerGeneration:ctx.ownerGeneration+1}
   const second=new ReviewB2StagingService()
   const revived=new ReviewB2ArchiveVault(second,home)
   const received=revived.recoverAfterMainPicker(nextCtx,first.checkpoint.archiveId,{
     ...archive,physicalArchiveKey:'new-native-main-handle-at-restart',
   })
   expect(received.status).toBe('candidate-restaged-awaiting-owner-assignment')
   expect(received.priorReceiptsPreserved).toBe(true)
   expect(received.businessWriteAllowed).toBe(false)
   expect(received.checkpoint).toEqual(first.checkpoint)
   expect(received.preview.extracted).toEqual(first.checkpoint.fileReceipts)
   expect(received.preview.candidates).toHaveLength(1)
   expect(received.preview.candidates[0]!.candidateId).not.toBe(first.preview.candidates[0]!.candidateId)
   expect(received.preview.candidates[0]!.ownerGeneration).toBe(nextCtx.ownerGeneration)
   expect(received.preview.receipts[0]!.status).toBe('needs-user-confirmation')
   expect(received.preview.candidates[0]!.role).toBe('unassigned')
   expect(revived.inspect(nextCtx,first.checkpoint.archiveId)).toEqual(first.checkpoint)
 })
 test('recovery cannot use original generation, older generation, or a revoked owner',()=>{
   const archive={physicalArchiveKey:'native-r18-original-b',requestId:'r18-restart-b',
      bytes:makeZip('same original')}
   const first=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
     .saveAndStage(ctx,archive).checkpoint
   const staging=new ReviewB2StagingService()
   const reopened=new ReviewB2ArchiveVault(staging,home)
   for(const generation of [0,1]){
     expect(()=>reopened.recoverAfterMainPicker({...ctx,ownerGeneration:generation},first.archiveId,archive))
       .toThrow('B2_ARCHIVE_REVALIDATION_REQUIRES_FRESH_OWNER_GENERATION')
   }
   const later={...ctx,ownerGeneration:3}
   staging.revoke(later)
   expect(()=>reopened.recoverAfterMainPicker(later,first.archiveId,archive))
     .toThrow('B2_OWNER_INVALID_OR_REVOKED')
 })
 test('cannot replay historical checkpoint using changed bytes, request or unsigned key',()=>{
   const archive={physicalArchiveKey:'native-r18-original-c',requestId:'r18-restart-c',
     bytes:makeZip('historical content')}
   const old=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
     .saveAndStage(ctx,archive).checkpoint
   const staging=new ReviewB2StagingService()
   const reopened=new ReviewB2ArchiveVault(staging,home)
   const fresh={...ctx,ownerGeneration:2}
   for(const mutated of [
     {...archive,bytes:makeZip('replaced content')},
     {...archive,requestId:'changed-request'},
     {...archive,physicalArchiveKey:' '},
   ])expect(()=>reopened.recoverAfterMainPicker(fresh,old.archiveId,mutated))
     .toThrow('B2_ARCHIVE_RESELECTED_ORIGINAL_MISMATCH')
   expect(staging.previewImportBatch(fresh,[]).materialIds).toEqual([])
   expect(reopened.inspect(fresh,old.archiveId).fileReceipts).toEqual(old.fileReceipts)
 })
 test('locked compression policy survives a new Main picker; rejected children stay rejected',()=>{
   const archive={physicalArchiveKey:'native-r18-strict',requestId:'r18-strict-limit',
     bytes:makeZip('bytes longer than allowed')}
   const before=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
     .saveAndStage(ctx,archive,{maxEntryBytes:3}).checkpoint
   const replay=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
     .recoverAfterMainPicker({...ctx,ownerGeneration:4},before.archiveId,archive)
   expect(replay.preview.candidates).toHaveLength(0)
   expect(replay.preview.extracted[0]!.status).toBe('rejected')
   expect(replay.preview.extracted[0]!.reason).toBe('BOMB_OR_SIZE_LIMIT')
   expect(replay.checkpoint.decodeLimits).toEqual({maxEntryBytes:3})
 })
 test('legacy unpinned archive can still be inspected but may not restage with invented default limits',()=>{
   const archive={physicalArchiveKey:'native-r18-legacy',requestId:'r18-legacy',
     bytes:makeZip('legacy bytes')}
   const vault=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
   const original=vault.saveAndStage(ctx,archive).checkpoint
   const path=join(home,original.archiveId,'checkpoint.json')
   const json=JSON.parse(readFileSync(path,'utf8'))
   json.schemaVersion='review-b2-archive/1'
   delete json.decodeLimits
   const {manifestSha256:_old,...plain}=json
   json.manifestSha256=createHash('sha256').update(JSON.stringify(plain)).digest('hex')
   writeFileSync(path,JSON.stringify(json))
   const next=new ReviewB2ArchiveVault(new ReviewB2StagingService(),home)
   expect(next.inspect({...ctx,ownerGeneration:9},original.archiveId).schemaVersion)
     .toBe('review-b2-archive/1')
   expect(()=>next.recoverAfterMainPicker({...ctx,ownerGeneration:9},original.archiveId,archive))
     .toThrow('B2_ARCHIVE_LEGACY_PROFILE_UNPINNED')
 })
})
