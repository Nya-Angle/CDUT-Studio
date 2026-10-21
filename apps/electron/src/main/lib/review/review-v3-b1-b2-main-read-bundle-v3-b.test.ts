import { afterAll, describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'
import { ReviewB2SourceVersionAdapter } from './review-source-version-adapter-v3-b2'
import { ReviewB2ArchiveVault } from './review-import-checkpoint-v3-b2'
import { ReviewB2InputLedger } from './review-import-ledger-v3-b2'
import {
  readB20CurrentCandidateBundle,
  type B20ReadAuthorExpectation, type B20MainReadScope,
  type B20CurrentMainReadAuthority, type B20ReadOnlySources,
} from './review-v3-b1-b2-main-read-bundle-v3-b'
import { type B19SourceSelection } from './review-v3-b1-b2-candidate-source-bridge'
import {
  saveB1AuthorRevision, readB1AuthorRevision, freezeB1Candidate,
} from './review-template-author-store-v3-b1'
import { type B1AuthorDocument } from './review-template-plan-adapter-v3-b1'

const configBefore=process.env.PROFER_CONFIG_DIR
const root=mkdtempSync(join(tmpdir(),'review-b20-main-read-bundle-'))
process.env.PROFER_CONFIG_DIR=root
afterAll(()=>{
  if(configBefore===undefined)delete process.env.PROFER_CONFIG_DIR
  else process.env.PROFER_CONFIG_DIR=configBefore
  rmSync(root,{recursive:true,force:true})
})
const sha=(b:Buffer)=>createHash('sha256').update(b).digest('hex')
const ctx:B20MainReadScope={
  senderId:17,frameId:4,ownerId:'real-owner',ownerGeneration:8,
  caseCandidateId:'candidate-b20',principalId:'main-authorized-user',
  sessionId:'main-session',authorityEpoch:42,
}
const crc=(buf:Buffer):number=>{
  let c=0xffffffff
  for(const n of buf){
    c^=n
    for(let j=0;j<8;j++)c=c&1?(0xedb88320^(c>>>1)):(c>>>1)
  }
  return (c^0xffffffff)>>>0
}
function zip(files:readonly {name:string;text:string}[]):Buffer{
  let offset=0
  const local:Buffer[]=[],central:Buffer[]=[]
  for(const entry of files){
    const n=Buffer.from(entry.name),bytes=Buffer.from(entry.text),sum=crc(bytes)
    const h=Buffer.alloc(30),c=Buffer.alloc(46)
    h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4)
    h.writeUInt16LE(0x800,6);h.writeUInt32LE(sum,14)
    h.writeUInt32LE(bytes.length,18);h.writeUInt32LE(bytes.length,22)
    h.writeUInt16LE(n.length,26)
    c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(0x0314,4)
    c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8)
    c.writeUInt32LE(sum,16);c.writeUInt32LE(bytes.length,20)
    c.writeUInt32LE(bytes.length,24);c.writeUInt16LE(n.length,28)
    c.writeUInt32LE(0x81a40000,38);c.writeUInt32LE(offset,42)
    local.push(h,n,bytes);central.push(c,n)
    offset+=h.length+n.length+bytes.length
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50,0)
  end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10)
  end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16)
  return Buffer.concat([...local,directory,end])
}
let n=0
function document(templateId:string,versionA:string,versionB:string):B1AuthorDocument{
  return {
    schemaVersion:'review-b1/1',templateId,templateVersion:'1',
    name:'Synthetic evidence candidate',purpose:'No school policy',
    status:'candidate-held',
    fields:[],
    sources:[
      {sourceId:'source-a',kind:'user-declared',documentVersionId:versionA,
        locator:'original:A',recordedBy:'main-authorized-user'},
      {sourceId:'source-b',kind:'user-declared',documentVersionId:versionB,
        locator:'original:B',recordedBy:'main-authorized-user'},
    ],
    targets:[{targetKey:'target',objectKey:'lab-room',subjectId:'student-1',
      scenario:'technical only',fieldValues:{}}],
    modules:[{moduleId:'author-defined',version:'1',dependsOn:[],checks:[
      {checkKey:'check-a',requirement:'A source',responsibility:'Human',
        sourceIds:['source-a'],targetKeys:['target'],condition:{kind:'always'}},
      {checkKey:'check-b',requirement:'B source',responsibility:'Human',
        sourceIds:['source-b'],targetKeys:['target'],condition:{kind:'always'}},
      {checkKey:'check-both',requirement:'Both',responsibility:'Human',
        sourceIds:['source-a','source-b'],targetKeys:['target'],condition:{kind:'always'}},
    ]}],
    stages:[{stageId:'manual',role:'human',mode:'manual'}],
    outputs:[{outputId:'evidence',kind:'preview'}],
  }
}
type Fixture=Awaited<ReturnType<typeof fixture>>
async function fixture(){
  const label='bundle-'+(++n),templateId='b20-'+n
  const staging=new ReviewB2StagingService()
  const parser=new ReviewB2SourceVersionAdapter(staging)
  const vault=new ReviewB2ArchiveVault(staging,join(root,label,'archive'))
  const ledger=new ReviewB2InputLedger(vault,staging,join(root,label,'ledger'))
  const picker='native-handle-'+label
  const stored=vault.saveAndStage(ctx,{physicalArchiveKey:picker,
    requestId:'archive-'+label,
    bytes:zip([{name:'same.txt',text:'First source block'},
      {name:'second.txt',text:'Second independent source'}])})
  const archiveId=stored.checkpoint.archiveId
  const initial=ledger.getOrCreate(ctx,archiveId)
  for(const file of initial.files){
    if(file.status!=='needs-user-confirmation')continue
    const current=ledger.snapshot(ctx,archiveId)
    ledger.decide(ctx,archiveId,current.revision,'accept-'+label+'-'+file.index,
      {entryIndex:file.index,status:'accepted',role:'supporting',subjectId:'student-1',
        rawSha256:file.rawSha256!},
      {principalId:ctx.principalId,authorize:()=>true})
  }
  const candidates=stored.preview.candidates
  const parsed=await Promise.all(candidates.map(c=>parser.parse(ctx,c)))
  const author=document(templateId,candidates[0]!.documentVersionId,candidates[1]!.documentVersionId)
  const saved=saveB1AuthorRevision(author,0,ctx.principalId)
  const frozen=freezeB1Candidate(templateId,1)
  const expected:B20ReadAuthorExpectation={templateId,revision:saved.revision,
    revisionDigest:saved.digest,frozenFingerprint:frozen.descriptor.canonicalPlan.fingerprint}
  const select=(index:number,sourceId:string,checkKey:string):B19SourceSelection=>({
    checkKey,targetKey:'target',sourceId,
    candidateId:candidates[index]!.candidateId,
    parseRevision:parsed[index]!.parseRevision,
    blockId:parsed[index]!.blocks[0]!.blockId,
    requiredRole:'supporting',archiveId,entryIndex:index,
  })
  const selectors=[
    select(0,'source-a','check-a'),select(1,'source-b','check-b'),
    select(0,'source-a','check-both'),select(1,'source-b','check-both'),
  ]
  const authority:B20CurrentMainReadAuthority={
    currentScope:()=>structuredClone(ctx),
    currentSelections:()=>structuredClone(selectors),
    nativeArchiveKey:(_,key)=>key===archiveId?picker:null,
  }
  const sources:B20ReadOnlySources={staging,parser,vault,ledger}
  return {label,templateId,picker,archiveId,author,saved,frozen,expected,authority,
    sources,selectors,parsed,candidates,select}
}
function read(f:Fixture){
  return readB20CurrentCandidateBundle(f.expected,{authority:f.authority,sources:f.sources})
}
describe('B R20 actual persistent B1 author + physical B2 + B19 Main-read dependency bundle',()=>{
  test('R20-01 saved revision, full history, immutable frozen and actual ZIP/parser/receipts join without publishing',async()=>{
    const f=await fixture()
    const result=read(f)
    expect(result.schemaVersion).toBe('review-v3-b20-main-read-bundle/1')
    expect(result.authorRevision).toBe(1)
    expect(result.authorRevisionDigest).toBe(f.saved.digest)
    expect(result.frozenFingerprint).toBe(f.frozen.descriptor.canonicalPlan.fingerprint)
    expect(result.frozenDescriptor).toEqual(f.frozen.descriptor)
    expect(result.candidateProvenance.bindings).toHaveLength(3)
    expect(result.candidateProvenance.bindings.every(b=>b.state==='linked-candidate')).toBe(true)
    expect(result.candidateOnly).toBe(true)
    expect(result.publicationAllowed).toBe(false)
    expect(result.businessWriteAllowed).toBe(false)
    expect(result.schoolPolicyVerified).toBe(false)
    expect(result.authorityInstalledByB).toBe(false)
    expect('principalId' in result).toBe(false)
    expect('physicalArchiveKey' in result).toBe(false)
    expect('schoolIssuer' in result).toBe(false)
    expect(read(f)).toEqual(result)
    expect(readB1AuthorRevision(f.templateId)).toEqual(f.saved)
  })
  test('R20-02 current unsaved text never enters the frozen Plan; new saved revision invalidates old frozen expectation',async()=>{
    const f=await fixture()
    const dirty=structuredClone(f.author)
    dirty.modules[0]!.checks[0]!.requirement='Uncommitted edited requirement'
    expect(read(f).frozenDescriptor.bindingDetails[0]!.requirement).toBe('A source')
    const next=saveB1AuthorRevision(dirty,1,ctx.principalId)
    expect(next.parentDigest).toBe(f.saved.digest)
    expect(()=>read(f)).toThrow('B_R20_AUTHOR_REVISION_CONFLICT')
    expect(readB1AuthorRevision(f.templateId,1)?.document.modules[0]!.checks[0]!.requirement)
      .toBe('A source')
    const latest=freezeB1Candidate(f.templateId,2)
    expect(latest.revision).toBe(2)
    const stillOld={...f.expected,revision:2,revisionDigest:next.digest}
    expect(()=>readB20CurrentCandidateBundle(stillOld,{authority:f.authority,sources:f.sources}))
      .toThrow('B_R20_FROZEN_AUTHOR_MISMATCH')
  })
  test('R20-03 damaged parent revision or missing parent cannot be bypassed with a valid-looking latest snapshot',async()=>{
    const f=await fixture()
    const revised=structuredClone(f.author)
    revised.purpose='Revised and saved to retain distinct immutable Plan identity'
    const next=saveB1AuthorRevision(revised,1,ctx.principalId)
    const frozen=freezeB1Candidate(f.templateId,2)
    const expectation={...f.expected,revision:next.revision,revisionDigest:next.digest,
      frozenFingerprint:frozen.descriptor.canonicalPlan.fingerprint}
    const first=join(root,'review-v3-author-candidate',f.templateId,'revisions','1.json')
    const original=readFileSync(first,'utf8')
    const bad=JSON.parse(original)
    bad.document.purpose='corrupted origin'
    writeFileSync(first,JSON.stringify(bad))
    expect(()=>readB20CurrentCandidateBundle(expectation,
      {authority:f.authority,sources:f.sources})).toThrow('B1_HISTORY_BROKEN')
    rmSync(first)
    expect(()=>readB20CurrentCandidateBundle(expectation,
      {authority:f.authority,sources:f.sources})).toThrow('B1_HISTORY_BROKEN_MISSING_PARENT')
  })
  test('R20-04 forged frozen JSON, deleted file, different template and wrong digest fail closed',async()=>{
    const f=await fixture()
    const frozenFile=join(root,'review-v3-author-candidate',f.templateId,'frozen',
      f.expected.frozenFingerprint+'.json')
    const pristine=readFileSync(frozenFile,'utf8')
    const malicious=JSON.parse(pristine)
    malicious.descriptor.bindingDetails[0].requirement='fake authorized policy'
    writeFileSync(frozenFile,JSON.stringify(malicious))
    expect(()=>read(f)).toThrow('B1_FROZEN_DIGEST_MISMATCH')
    writeFileSync(frozenFile,pristine)
    expect(()=>readB20CurrentCandidateBundle({...f.expected,revisionDigest:'a'.repeat(64)},
      {authority:f.authority,sources:f.sources})).toThrow('B_R20_AUTHOR_REVISION_CONFLICT')
    expect(()=>readB20CurrentCandidateBundle({...f.expected,templateId:'other-template'},
      {authority:f.authority,sources:f.sources})).toThrow('B_R20_CURRENT_AUTHOR_MISSING')
    rmSync(frozenFile)
    expect(()=>read(f)).toThrow('B_R20_FROZEN_CANDIDATE_MISSING')
  })
  test('R20-05 Main authority, Owner/frame and selection registry are required, no default allow',async()=>{
    const f=await fixture()
    expect(()=>readB20CurrentCandidateBundle(f.expected,{}))
      .toThrow('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{sources:f.sources}))
      .toThrow('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{authority:f.authority}))
      .toThrow('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentScope:()=>null},
    })).toThrow('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentScope:()=>({...ctx,frameId:-1})},
    })).toThrow('B_R20_MAIN_TRUST_DEPENDENCY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>null},
    })).toThrow('B_R20_SOURCE_REGISTRY_NOT_INSTALLED')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,nativeArchiveKey:()=>null},
    })).toThrow('B_R20_NATIVE_PICKER_PROVENANCE_NOT_INSTALLED')
  })
  test('R20-06 native key counterfeit, cross-archive entry, wrong Subject and role cannot link',async()=>{
    const f=await fixture()
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,nativeArchiveKey:()=> 'fake-picker'},
    })).toThrow('B_R19_NATIVE_ARCHIVE_KEY_MISMATCH')
    const cross=f.selectors.map(x=>({...x}))
    cross[0]!.entryIndex=1
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>cross},
    })).toThrow('B_R19_ZIP_STAGED_ENTRY_IDENTITY_MISMATCH')
    const wrongRole=f.selectors.map(x=>({...x}))
    wrongRole[0]!.requiredRole='application'
    const result=readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>wrongRole},
    })
    expect(result.candidateProvenance.bindings[0]!.state).toBe('needs-human-confirmation')
    const wrongSubject={...f.author,targets:[{...f.author.targets[0]!,subjectId:'other-subject'}]}
    saveB1AuthorRevision(wrongSubject,1,ctx.principalId)
    expect(()=>read(f)).toThrow('B_R20_AUTHOR_REVISION_CONFLICT')
  })
  test('R20-07 stale parser revision, missing block, missing selector, revoked Owner fail safely',async()=>{
    const f=await fixture()
    const old=f.selectors.map(x=>({...x}))
    old[0]!.parseRevision='previous-revision'
    const stale=readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>old},
    })
    expect(stale.candidateProvenance.bindings[0]!.state).toBe('stale')
    const fake=f.selectors.map(x=>({...x}))
    fake[0]!.blockId='forged-block'
    expect(readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>fake},
    }).candidateProvenance.bindings[0]!.state).toBe('stale')
    const empty=readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>[]},
    })
    expect(empty.candidateProvenance.bindings.every(b=>b.state==='unknown')).toBe(true)
    f.sources.staging.revoke(ctx)
    expect(()=>read(f)).toThrow('B2_OWNER_INVALID_OR_REVOKED')
  })
  test('R20-08 Main scope epoch/window/owner rebound after source reads is rejected',async()=>{
    const f=await fixture()
    let calls=0
    const authority={...f.authority,
      currentScope:()=>{
        calls++
        return calls===1?ctx:{...ctx,authorityEpoch:43}
      },
    }
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority,
    })).toThrow('B_R20_MAIN_SCOPE_CHANGED_DURING_READ')
    calls=0
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...authority,currentScope:()=>{
        calls++; return calls===1?ctx:{...ctx,frameId:99}
      }},
    })).toThrow('B_R20_MAIN_SCOPE_CHANGED_DURING_READ')
    expect(()=>readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentScope:()=>({...ctx,caseCandidateId:'foreign'})},
    })).toThrow()
  })
  test('R20-09 tampered real ZIP bytes or confirmed InputLedger receipt never mint linked Check',async()=>{
    const f=await fixture()
    const ledgerFile=join(root,f.label,'ledger',f.archiveId,'ledger.json')
    const cleanLedger=readFileSync(ledgerFile,'utf8')
    const mutation=JSON.parse(cleanLedger)
    mutation.mutations[0].confirmedRole='application'
    writeFileSync(ledgerFile,JSON.stringify(mutation))
    expect(()=>read(f)).toThrow('B2_LEDGER_CORRUPT')
    writeFileSync(ledgerFile,cleanLedger)
    const archiveFile=join(root,f.label,'archive',f.archiveId,'archive.zip')
    const clean=readFileSync(archiveFile)
    writeFileSync(archiveFile,Buffer.from('changed original bytes'))
    expect(()=>read(f)).toThrow(/B2_ARCHIVE_/)
    writeFileSync(archiveFile,clean)
    expect(read(f).candidateProvenance.bindings.every(b=>b.state==='linked-candidate')).toBe(true)
  })
  test('R20-10 physical original same filename/bytes different native handle cannot inherit frozen identity',async()=>{
    const f=await fixture()
    const other=f.sources.vault.saveAndStage(ctx,{
      physicalArchiveKey:'completely-different-picker',
      requestId:'new-physical-key',bytes:zip([
        {name:'same.txt',text:'First source block'},
        {name:'second.txt',text:'Second independent source'},
      ]),
    })
    expect(other.preview.candidates[0]!.rawSha256).toBe(f.candidates[0]!.rawSha256)
    expect(other.preview.candidates[0]!.documentVersionId).not.toBe(f.candidates[0]!.documentVersionId)
    const p=await f.sources.parser.parse(ctx,other.preview.candidates[0]!)
    const forged=f.selectors.map(x=>({...x}))
    forged[0]={...forged[0]!,candidateId:other.preview.candidates[0]!.candidateId,
      parseRevision:p.parseRevision,blockId:p.blocks[0]!.blockId}
    expect(readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>forged},
    }).candidateProvenance.bindings[0]!.state).toBe('stale')
  })
  test('R20-11 previous audit retained for affected source only; unrelated Check stays linked',async()=>{
    const f=await fixture()
    const previous=read(f).candidateProvenance
    const modified=f.selectors.map(x=>({...x}))
    modified[0]!.parseRevision='old-parse'
    modified[2]!.parseRevision='old-parse'
    const latest=readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:{...f.authority,currentSelections:()=>modified},
    },previous)
    expect(latest.candidateProvenance.invalidatedPriorEvidence).toHaveLength(2)
    expect(latest.candidateProvenance.bindings.find(x=>x.checkKey==='check-b')?.state)
      .toBe('linked-candidate')
    expect(previous.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
    const forged=structuredClone(previous)
    forged.bindings[0]!.sources[0]!.receiptHash='a'.repeat(64)
    expect(()=>readB20CurrentCandidateBundle(f.expected,
      {authority:f.authority,sources:f.sources},forged)).toThrow('B_R19_PRIOR_SNAPSHOT_UNTRUSTED')
  })
  test('R20-12 invalid external expectation/publisher claim cannot bypass persistent source',async()=>{
    const f=await fixture()
    expect(()=>readB20CurrentCandidateBundle({
      ...f.expected,frozenFingerprint:'falsified',
    },{authority:f.authority,sources:f.sources})).toThrow('B_R20_FROZEN_EXPECTATION_REQUIRED')
    const spoofed={...f.authority,currentScope:()=>({...ctx,
      schoolPublisher:'forged-renderer-publisher',
      sourceIdentity:{rawSha256:'0'.repeat(64)},
    } as B20MainReadScope)}
    const result=readB20CurrentCandidateBundle(f.expected,{
      sources:f.sources,authority:spoofed,
    })
    expect(result.schoolPolicyVerified).toBe(false)
    expect(result.publicationAllowed).toBe(false)
    expect('schoolPublisher' in result).toBe(false)
    expect('sourceIdentity' in result).toBe(false)
    expect(sha(Buffer.from('First source block'))).toBe(f.candidates[0]!.rawSha256)
  })
})
