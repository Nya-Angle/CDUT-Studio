import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { ReviewB2SourceVersionAdapter } from './review-source-version-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger } from './review-import-ledger-v3-b2'
import {
  buildB19CandidateSourceBindings, type B19CandidateSnapshot,
  type B19SourceSelection,
} from './review-v3-b1-b2-candidate-source-bridge'
import { compileReviewB1Plan, type B1AuthorDocument } from './review-template-plan-adapter-v3-b1'

const root=mkdtempSync(join(tmpdir(),'review-v3-b-r19-'))
afterAll(()=>rmSync(root,{recursive:true,force:true}))
const ctx:B2MainContext={senderId:21,frameId:3,ownerId:'trusted-main',
  ownerGeneration:5,caseCandidateId:'case-r19'}
const crc32=(data:Buffer):number=>{
  let crc=0xffffffff
  for(const n of data) {
    crc^=n
    for(let i=0;i<8;i++)crc=crc&1 ? (0xedb88320^(crc>>>1)) : crc>>>1
  }
  return (crc^0xffffffff)>>>0
}
function zip(files: {name:string;value:string}[]):Buffer {
  const locals:Buffer[]=[],centers:Buffer[]=[]
  let offset=0
  for(const file of files){
    const name=Buffer.from(file.name),raw=Buffer.from(file.value)
    const local=Buffer.alloc(30),center=Buffer.alloc(46),crc=crc32(raw)
    local.writeUInt32LE(0x04034b50,0)
    local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6)
    local.writeUInt32LE(crc,14);local.writeUInt32LE(raw.length,18)
    local.writeUInt32LE(raw.length,22);local.writeUInt16LE(name.length,26)
    center.writeUInt32LE(0x02014b50,0)
    center.writeUInt16LE(0x0314,4);center.writeUInt16LE(20,6)
    center.writeUInt16LE(0x800,8);center.writeUInt32LE(crc,16)
    center.writeUInt32LE(raw.length,20);center.writeUInt32LE(raw.length,24)
    center.writeUInt16LE(name.length,28);center.writeUInt32LE(0x81a40000,38)
    center.writeUInt32LE(offset,42)
    locals.push(local,name,raw);centers.push(center,name)
    offset+=local.length+name.length+raw.length
  }
  const central=Buffer.concat(centers),eocd=Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50,0)
  eocd.writeUInt16LE(files.length,8);eocd.writeUInt16LE(files.length,10)
  eocd.writeUInt32LE(central.length,12);eocd.writeUInt32LE(offset,16)
  return Buffer.concat([...locals,central,eocd])
}
let count=0
function fixture() {
  const name='f-'+(++count)
  const staging=new ReviewB2StagingService()
  const parser=new ReviewB2SourceVersionAdapter(staging)
  const vault=new ReviewB2ArchiveVault(staging,join(root,name,'archive'))
  const ledgerDir=join(root,name,'ledger')
  const ledger=new ReviewB2InputLedger(vault,staging,ledgerDir)
  return {staging,parser,vault,ledger,ledgerDir}
}
const inputs=[
  {name:'same.txt',value:'A physical line\nA second line'},
  {name:'other.txt',value:'B independent physical line'},
]
type Setup=ReturnType<typeof fixture>
async function imported(f:Setup, request:string, physical:string, values=inputs) {
  const saved=f.vault.saveAndStage(ctx,{
    requestId:request,physicalArchiveKey:physical,bytes:zip(values),
  })
  const archiveId=saved.checkpoint.archiveId
  const initial=f.ledger.getOrCreate(ctx,archiveId)
  for(const file of initial.files){
    if(file.status!=='needs-user-confirmation')continue
    const current=f.ledger.snapshot(ctx,archiveId)
    f.ledger.decide(ctx,archiveId,current.revision,'confirm-'+request+'-'+file.index,{
      entryIndex:file.index,status:'accepted',role:'supporting',
      subjectId:'student-1',rawSha256:file.rawSha256!,
    },{principalId:'actual-main-principal',authorize:(_,principal)=>
      principal==='actual-main-principal'})
  }
  const candidates=saved.preview.candidates
  const parsed=await Promise.all(candidates.map(async c=>f.parser.parse(ctx,c)))
  const select=(index:number,source:string,check:string):B19SourceSelection=>({
    checkKey:check,targetKey:'target-1',sourceId:source,
    candidateId:candidates[index]!.candidateId,
    parseRevision:parsed[index]!.parseRevision,blockId:parsed[index]!.blocks[0]!.blockId,
    requiredRole:'supporting',archiveId,entryIndex:index,
  })
  return {archiveId,candidates,parsed,select,physical}
}
function author(first:string,second:string):B1AuthorDocument {
  return {
    schemaVersion:'review-b1/1',templateId:'r19-custom',templateVersion:'1',
    name:'Candidate source test',purpose:'Synthetic technical check lineage',
    status:'candidate-held',
    sources:[
      {sourceId:'s-a',kind:'user-declared',documentVersionId:first,
        locator:'author-declaration:a',recordedBy:'candidate-author'},
      {sourceId:'s-b',kind:'user-declared',documentVersionId:second,
        locator:'author-declaration:b',recordedBy:'candidate-author'},
    ],
    fields:[],targets:[{targetKey:'target-1',objectKey:'object-1',
      subjectId:'student-1',scenario:'technical only',fieldValues:{}}],
    modules:[{moduleId:'core',version:'1',dependsOn:[],checks:[
      {checkKey:'check-a1',requirement:'a1',responsibility:'Human',
        sourceIds:['s-a'],targetKeys:['target-1'],condition:{kind:'always'}},
      {checkKey:'check-a2',requirement:'a2',responsibility:'Human',
        sourceIds:['s-a'],targetKeys:['target-1'],condition:{kind:'always'}},
      {checkKey:'check-b',requirement:'b',responsibility:'Human',
        sourceIds:['s-b'],targetKeys:['target-1'],condition:{kind:'always'}},
      {checkKey:'check-both',requirement:'both',responsibility:'Human',
        sourceIds:['s-a','s-b'],targetKeys:['target-1'],condition:{kind:'always'}},
    ]}],
    stages:[{stageId:'human',role:'reviewer',mode:'manual'}],
    outputs:[{outputId:'result',kind:'review'}],
  }
}
const selections=(entry:Awaited<ReturnType<typeof imported>>) => [
  entry.select(0,'s-a','check-a1'),entry.select(0,'s-a','check-a2'),
  entry.select(1,'s-b','check-b'),entry.select(0,'s-a','check-both'),
  entry.select(1,'s-b','check-both'),
]
function compile(f:Setup,entry:Awaited<ReturnType<typeof imported>>,
  old?:B19CandidateSnapshot, selection=selections(entry), document=author(
    entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId)) {
  return buildB19CandidateSourceBindings(ctx,document,compileReviewB1Plan(document),
    selection,{...f,trustedArchiveScopes:[{archiveId:entry.archiveId,
      physicalArchiveKey:entry.physical}],previous:old})
}
describe('B R19 actual ZIP -> Main stage -> parser -> InputLedger -> B1 Check×target',()=>{
  test('R19-01 real accepted receipts link two physical source versions to four obligations, never PASS/published',async()=>{
    const f=fixture(),entry=await imported(f,'one','native-1')
    const result=compile(f,entry)
    expect(result.bindings).toHaveLength(4)
    expect(result.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
    expect(result.bindings.find(x=>x.checkKey==='check-both')?.sources).toHaveLength(2)
    expect(result.bindings.every(x=>x.sources.every(s=>
      s.receiptHash?.length===64 && s.ledgerHash?.length===64 &&
      s.proposalHash?.length===64 && s.readExtent?.fullDocumentProven===false))).toBe(true)
    expect(result.candidateOnly).toBe(true)
    expect(result.publicationAllowed).toBe(false)
    expect(result.businessWriteAllowed).toBe(false)
    expect(result.schoolPolicyVerified).toBe(false)
    expect(compile(f,entry)).toEqual(result)
    expect(result.planFingerprint).toBe(compileReviewB1Plan(author(
      entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId))
      .canonicalPlan.fingerprint)
  })
  test('R19-02 missing and partial sources remain UNKNOWN; do not drop a Check',async()=>{
    const f=fixture(),entry=await imported(f,'missing','native-missing')
    const result=compile(f,entry,undefined,[entry.select(1,'s-b','check-b')])
    expect(result.bindings).toHaveLength(4)
    expect(result.bindings.filter(x=>x.state==='unknown')).toHaveLength(3)
    expect(result.bindings.find(x=>x.checkKey==='check-b')?.state).toBe('linked-candidate')
  })
  test('R19-03 same filename and same bytes different native physical archive cannot reuse source version',async()=>{
    const f=fixture(),first=await imported(f,'same-1','physical-A')
    const second=await imported(f,'same-2','physical-B')
    expect(first.candidates[0]!.rawSha256).toBe(second.candidates[0]!.rawSha256)
    expect(first.candidates[0]!.documentVersionId).not.toBe(second.candidates[0]!.documentVersionId)
    const prior=compile(f,first)
    const wrong=compile(f,second,prior,selections(second),
      author(first.candidates[0]!.documentVersionId,first.candidates[1]!.documentVersionId))
    expect(wrong.bindings.every(x=>x.state==='stale')).toBe(true)
    const migrated=compile(f,second,prior)
    expect(migrated.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
    expect(migrated.invalidatedPriorEvidence).toHaveLength(5)
    expect(migrated.invalidatedPriorEvidence.every(x=>x.reason==='source-version-changed')).toBe(true)
    expect(prior.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
  })
  test('R19-04 changing source A invalidates three Check×source links, leaves B-only Check intact',async()=>{
    const f=fixture(),first=await imported(f,'delta-1','original-handle')
    const changed=await imported(f,'delta-2','changed-handle',[
      {name:'same.txt',value:'new evidence text'},
      inputs[1]!,
    ])
    const old=compile(f,first)
    const newAuthor=author(changed.candidates[0]!.documentVersionId,
      first.candidates[1]!.documentVersionId)
    const choice=[
      changed.select(0,'s-a','check-a1'),changed.select(0,'s-a','check-a2'),
      first.select(1,'s-b','check-b'),changed.select(0,'s-a','check-both'),
      first.select(1,'s-b','check-both'),
    ]
    const result=buildB19CandidateSourceBindings(ctx,newAuthor,compileReviewB1Plan(newAuthor),
      choice,{...f,previous:old,trustedArchiveScopes:[
        {archiveId:first.archiveId,physicalArchiveKey:first.physical},
        {archiveId:changed.archiveId,physicalArchiveKey:changed.physical},
      ]})
    expect(result.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
    expect(result.invalidatedPriorEvidence).toHaveLength(3)
    expect(result.invalidatedPriorEvidence.every(x=>x.sourceId==='s-a')).toBe(true)
    expect(result.bindings.find(x=>x.checkKey==='check-b')?.sources[0]?.receiptHash)
      .toBe(old.bindings.find(x=>x.checkKey==='check-b')?.sources[0]?.receiptHash)
  })
  test('R19-05 wrong Subject/role, unconfirmed ledger and fake archive key stay blocked',async()=>{
    const f=fixture(),entry=await imported(f,'subjects','physical-subject')
    const doc=author(entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId)
    const mismatch=selections(entry);mismatch[0]={...mismatch[0]!,requiredRole:'application'}
    expect(compile(f,entry,undefined,mismatch).bindings[0]?.state).toBe('needs-human-confirmation')
    doc.targets[0]!.subjectId='different-student'
    expect(compile(f,entry,undefined,selections(entry),doc).bindings.every(x=>
      x.state==='needs-human-confirmation')).toBe(true)
    const c=fixture()
    const saved=c.vault.saveAndStage(ctx,{requestId:'not-confirmed',physicalArchiveKey:'not-confirmed',
      bytes:zip([inputs[0]!])})
    const candidate=saved.preview.candidates[0]!
    const parsed=await c.parser.parse(ctx,candidate)
    const a=author(candidate.documentVersionId,'unprovided-b')
    const s:B19SourceSelection={
      checkKey:'check-a1',targetKey:'target-1',sourceId:'s-a',
      candidateId:candidate.candidateId,parseRevision:parsed.parseRevision,
      blockId:parsed.blocks[0]!.blockId,requiredRole:'supporting',
      archiveId:saved.checkpoint.archiveId,entryIndex:0,
    }
    c.ledger.getOrCreate(ctx,saved.checkpoint.archiveId)
    const result=buildB19CandidateSourceBindings(ctx,a,compileReviewB1Plan(a),[s],{
      ...c,trustedArchiveScopes:[{archiveId:saved.checkpoint.archiveId,
        physicalArchiveKey:'not-confirmed'}],
    })
    expect(result.bindings[0]!.state).toBe('needs-human-confirmation')
    expect(()=>buildB19CandidateSourceBindings(ctx,a,compileReviewB1Plan(a),[s],{
      ...c,trustedArchiveScopes:[{archiveId:saved.checkpoint.archiveId,
        physicalArchiveKey:'forged-key'}],
    })).toThrow('B_R19_NATIVE_ARCHIVE_KEY_MISMATCH')
  })
  test('R19-06 forged cross-entry, parser block and stale parseRevision cannot pass',async()=>{
    const f=fixture(),entry=await imported(f,'forgery','physical-forgery')
    const cross=selections(entry);cross[0]={...cross[0]!,entryIndex:1}
    expect(()=>compile(f,entry,undefined,cross)).toThrow('B_R19_ZIP_STAGED_ENTRY_IDENTITY_MISMATCH')
    const parse=selections(entry);parse[0]={...parse[0]!,parseRevision:'obsolete-parse'}
    expect(compile(f,entry,undefined,parse).bindings[0]!.sources[0]!.state).toBe('stale')
    const block=selections(entry);block[0]={...block[0]!,blockId:'invented-block'}
    expect(compile(f,entry,undefined,block).bindings[0]!.sources[0]!.state).toBe('stale')
    const duplicate=selections(entry);duplicate.push(duplicate[0]!)
    expect(()=>compile(f,entry,undefined,duplicate)).toThrow('B_R19_SELECTION_INVALID_OR_DUPLICATE')
  })
  test('R19-07 unrelated Case/owner/generation and revoked owner never mint evidence',async()=>{
    const f=fixture(),entry=await imported(f,'owner','physical-owner')
    const doc=author(entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId)
    for(const changed of [
      {...ctx,caseCandidateId:'foreign-case'},
      {...ctx,ownerId:'foreign-owner'},
      {...ctx,ownerGeneration:6},
    ]){
      expect(()=>buildB19CandidateSourceBindings(changed,doc,compileReviewB1Plan(doc),
        selections(entry),{...f,trustedArchiveScopes:[{archiveId:entry.archiveId,
          physicalArchiveKey:entry.physical}]})).toThrow()
    }
    f.staging.revoke(ctx)
    expect(()=>compile(f,entry)).toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
  test('R19-08 real archive bytes and persisted input receipt tamper block recomputation',async()=>{
    const f=fixture(),entry=await imported(f,'tamper','physical-tamper')
    const ledgerPath=join(f.ledgerDir,entry.archiveId,'ledger.json')
    const pristine=readFileSync(ledgerPath,'utf8')
    const altered=JSON.parse(pristine)
    altered.mutations[0].confirmedSubjectId='attacker'
    writeFileSync(ledgerPath,JSON.stringify(altered))
    expect(()=>compile(f,entry)).toThrow('B2_LEDGER_CORRUPT')
    writeFileSync(ledgerPath,pristine)
    const archivePath=join(root,'f-'+count,'archive',entry.archiveId,'archive.zip')
    const bytes=readFileSync(archivePath)
    writeFileSync(archivePath,Buffer.from('forged zip bytes'))
    expect(()=>compile(f,entry)).toThrow(/B2_ARCHIVE_/)
    writeFileSync(archivePath,bytes)
    expect(compile(f,entry).bindings.every(x=>x.state==='linked-candidate')).toBe(true)
  })
  test('R19-09 direct Main-staged original + real parser is not falsely promoted without ledger receipt',async()=>{
    const f=fixture()
    const candidate=f.staging.stage(ctx,f.staging.grant(ctx).token,{
      requestId:'direct',physicalSourceKey:'native-direct',
      fileName:'direct.txt',bytes:Buffer.from('real direct original'),
      role:'supporting',subjectId:'student-1',
    })
    const parsed=await f.parser.parse(ctx,candidate)
    const doc=author(candidate.documentVersionId,'unprovided-b')
    const result=buildB19CandidateSourceBindings(ctx,doc,compileReviewB1Plan(doc),[{
      checkKey:'check-a1',targetKey:'target-1',sourceId:'s-a',
      candidateId:candidate.candidateId,parseRevision:parsed.parseRevision,
      blockId:parsed.blocks[0]!.blockId,requiredRole:'supporting',
    }],f)
    expect(result.bindings[0]?.state).toBe('needs-human-confirmation')
    expect(result.bindings[0]?.sources[0]?.readExtent?.source.rawSha256).toBe(candidate.rawSha256)
  })
  test('R19-10 forged frozen author, removed Check, or prior audit change is never silently accepted',async()=>{
    const f=fixture(),entry=await imported(f,'author','physical-author')
    const old=compile(f,entry)
    const doc=author(entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId)
    const frozen=compileReviewB1Plan(doc)
    doc.sources[0]!.recordedBy='tampered-author'
    expect(()=>buildB19CandidateSourceBindings(ctx,doc,frozen,selections(entry),{
      ...f,trustedArchiveScopes:[{archiveId:entry.archiveId,physicalArchiveKey:entry.physical}],
    })).toThrow('B1_FROZEN_DIGEST_MISMATCH')
    const bad=structuredClone(old)
    bad.bindings[0]!.sources[0]!.receiptHash='0'.repeat(64)
    expect(()=>compile(f,entry,bad)).toThrow('B_R19_PRIOR_SNAPSHOT_UNTRUSTED')
    const revised=author(entry.candidates[0]!.documentVersionId,
      entry.candidates[1]!.documentVersionId)
    revised.modules[0]!.checks=revised.modules[0]!.checks.filter(x=>x.checkKey!=='check-a2')
    const remaining=selections(entry).filter(x=>x.checkKey!=='check-a2')
    const result=compile(f,entry,old,remaining,revised)
    expect(result.invalidatedPriorEvidence.some(x=>x.reason==='binding-removed-or-changed')).toBe(true)
    expect(result.bindings).toHaveLength(3)
    expect(old.bindings).toHaveLength(4)
  })
})


describe('B R19 conservative ledger and author semantics',()=>{
  test('R19-11 skipped or rejected files retain original bytes but never become linked evidence',async()=>{
    const f=fixture()
    const input=f.vault.saveAndStage(ctx,{
      requestId:'refused-files',physicalArchiveKey:'refusal-native-picker',
      bytes:zip(inputs),
    })
    const archiveId=input.checkpoint.archiveId
    const initial=f.ledger.getOrCreate(ctx,archiveId)
    f.ledger.decide(ctx,archiveId,0,'skip-entry',{
      entryIndex:0,status:'skipped',reason:'Applicant excluded this file',
    },{principalId:'main-principal',authorize:()=>true})
    f.ledger.decide(ctx,archiveId,1,'reject-entry',{
      entryIndex:1,status:'rejected',reason:'Unverified applicant origin',
    },{principalId:'main-principal',authorize:()=>true})
    const parsed=await Promise.all(input.preview.candidates.map(c=>f.parser.parse(ctx,c)))
    const doc=author(input.preview.candidates[0]!.documentVersionId,
      input.preview.candidates[1]!.documentVersionId)
    const picks:B19SourceSelection[]=[
      {checkKey:'check-a1',targetKey:'target-1',sourceId:'s-a',
       candidateId:input.preview.candidates[0]!.candidateId,
       parseRevision:parsed[0]!.parseRevision,blockId:parsed[0]!.blocks[0]!.blockId,
       requiredRole:'supporting',archiveId,entryIndex:0},
      {checkKey:'check-b',targetKey:'target-1',sourceId:'s-b',
       candidateId:input.preview.candidates[1]!.candidateId,
       parseRevision:parsed[1]!.parseRevision,blockId:parsed[1]!.blocks[0]!.blockId,
       requiredRole:'supporting',archiveId,entryIndex:1},
    ]
    const result=buildB19CandidateSourceBindings(ctx,doc,compileReviewB1Plan(doc),picks,{
      ...f,trustedArchiveScopes:[{archiveId,physicalArchiveKey:'refusal-native-picker'}],
    })
    expect(result.bindings.find(b=>b.checkKey==='check-a1')?.state).toBe('needs-human-confirmation')
    expect(result.bindings.find(b=>b.checkKey==='check-b')?.state).toBe('needs-human-confirmation')
    expect(result.bindings.every(b=>b.state!=='linked-candidate')).toBe(true)
    expect(f.ledger.snapshot(ctx,archiveId).files.map(x=>x.status)).toEqual(['skipped','rejected'])
    expect(initial.files.every(x=>x.status==='needs-user-confirmation')).toBe(true)
  })
  test('R19-12 old input receipts cannot re-authorize across a new Main generation',async()=>{
    const f=fixture(),entry=await imported(f,'generation','native-generation')
    const newCtx={...ctx,ownerGeneration:ctx.ownerGeneration+1}
    const fresh=f.vault.saveAndStage(newCtx,{
      requestId:'generation',physicalArchiveKey:'native-generation',bytes:zip(inputs),
    })
    const parsed=await Promise.all(fresh.preview.candidates.map(c=>f.parser.parse(newCtx,c)))
    const doc=author(fresh.preview.candidates[0]!.documentVersionId,
      fresh.preview.candidates[1]!.documentVersionId)
    const selected:B19SourceSelection[]=[{
      checkKey:'check-a1',targetKey:'target-1',sourceId:'s-a',
      candidateId:fresh.preview.candidates[0]!.candidateId,
      parseRevision:parsed[0]!.parseRevision,blockId:parsed[0]!.blocks[0]!.blockId,
      requiredRole:'supporting',archiveId:entry.archiveId,entryIndex:0,
    }]
    const snapshot=buildB19CandidateSourceBindings(newCtx,doc,compileReviewB1Plan(doc),
      selected,{...f,trustedArchiveScopes:[{archiveId:entry.archiveId,
        physicalArchiveKey:'native-generation'}]})
    expect(snapshot.bindings[0]!.sources[0]!.reason).toBe('HISTORIC_INPUT_RECEIPT_REAUTH_REQUIRED')
    expect(snapshot.bindings[0]!.state).toBe('needs-human-confirmation')
    expect(f.ledger.snapshot(ctx,entry.archiveId).mutations[0]!.ownerGeneration).toBe(ctx.ownerGeneration)
  })
  test('R19-13 evidence-linked candidate does not override unknown author applicability',async()=>{
    const f=fixture(),entry=await imported(f,'unknown-condition','unknown-native')
    const doc=author(entry.candidates[0]!.documentVersionId,entry.candidates[1]!.documentVersionId)
    doc.fields=[{key:'declared',label:'Applicant claim',type:'text',required:false,sourceId:'s-a'}]
    doc.modules[0]!.checks[0]!.condition={
      kind:'field-equals',fieldKey:'declared',equals:'yes',
    }
    const result=compile(f,entry,undefined,selections(entry),doc)
    expect(result.bindings[0]!.applicability).toBe('unknown')
    expect(result.bindings[0]!.sources[0]!.state).toBe('linked-candidate')
    expect(result.bindings[0]!.state).toBe('unknown')
    expect(result.bindings[1]!.state).toBe('linked-candidate')
  })
})
