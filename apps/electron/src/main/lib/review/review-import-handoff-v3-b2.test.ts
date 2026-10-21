import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger } from './review-import-ledger-v3-b2'
import { proposeB2MaterialCandidates } from './review-import-handoff-v3-b2'

const dir=mkdtempSync(join(tmpdir(),'b2-handoff-'))
afterAll(()=>rmSync(dir,{recursive:true,force:true}))
const ctx:B2MainContext={ownerId:'trusted-owner',caseCandidateId:'candidate-3',
  ownerGeneration:1,senderId:11,frameId:2}
const crc=(s:Buffer):number=>{
  let c=~0
  for(const b of s){
    c^=b
    for(let i=0;i<8;i++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1)
  }
  return (c^~0)>>>0
}
function zip():Buffer{
  const name=Buffer.from('app.txt'),data=Buffer.from('original text evidence')
  const checksum=crc(data),local=Buffer.alloc(30),central=Buffer.alloc(46)
  local.writeUInt32LE(0x04034b50,0)
  local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6)
  local.writeUInt32LE(checksum,14);local.writeUInt32LE(data.length,18)
  local.writeUInt32LE(data.length,22);local.writeUInt16LE(name.length,26)
  central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(0x0314,4)
  central.writeUInt16LE(20,6);central.writeUInt16LE(0x800,8)
  central.writeUInt32LE(checksum,16);central.writeUInt32LE(data.length,20)
  central.writeUInt32LE(data.length,24);central.writeUInt16LE(name.length,28)
  central.writeUInt32LE(0x81a40000,38)
  const eocd=Buffer.alloc(22);eocd.writeUInt32LE(0x06054b50,0)
  eocd.writeUInt16LE(1,8);eocd.writeUInt16LE(1,10)
  eocd.writeUInt32LE(central.length+name.length,12)
  eocd.writeUInt32LE(local.length+name.length+data.length,16)
  return Buffer.concat([local,name,data,central,name,eocd])
}
describe('B-INT input proposal is distinct from C ApplyMaterial',()=>{
  test('confirmed raw file generates digest-bound input-only intent, never a C0 SourceIdentity',()=>{
    const staging=new ReviewB2StagingService()
    const vault=new ReviewB2ArchiveVault(staging,join(dir,'archive'))
    const ledger=new ReviewB2InputLedger(vault,staging,join(dir,'ledger'))
    const checkpoint=vault.saveAndStage(ctx,{
      physicalArchiveKey:'native-picked',requestId:'handoff',bytes:zip(),
    }).checkpoint
    const first=ledger.getOrCreate(ctx,checkpoint.archiveId)
    expect(proposeB2MaterialCandidates(ctx,vault,staging,ledger,checkpoint.archiveId)).toEqual([])
    const accepted=ledger.decide(ctx,checkpoint.archiveId,0,'ack-1',{
      entryIndex:0,status:'accepted',role:'application',subjectId:'student-1',
      rawSha256:first.files[0]!.rawSha256!,
    },{principalId:'real-main-owner',authorize:()=>true})
    const proposed=proposeB2MaterialCandidates(ctx,vault,staging,ledger,checkpoint.archiveId)
    expect(proposed).toHaveLength(1)
    expect(proposed[0]!.candidateKind).toBe('input-only-unapplied')
    expect(proposed[0]!.confirmingReceiptHash).toBe(accepted.receipt.receiptHash)
    expect(proposed[0]!.sourceLedgerHash).toBe(accepted.ledger.ledgerHash)
    expect(proposed[0]!.rawSha256).toBe(first.files[0]!.rawSha256!)
    expect(proposed[0]!.proposalHash).toMatch(/^[a-f0-9]{64}$/)
    expect('caseId' in proposed[0]!).toBe(false)
    expect('sourceIdentity' in proposed[0]!).toBe(false)
    const reopened=new ReviewB2InputLedger(vault,staging,join(dir,'ledger'))
    expect(proposeB2MaterialCandidates(ctx,vault,staging,reopened,checkpoint.archiveId))
      .toEqual(proposed)
    staging.revoke(ctx)
    expect(()=>proposeB2MaterialCandidates(ctx,vault,staging,reopened,checkpoint.archiveId))
      .toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
})
