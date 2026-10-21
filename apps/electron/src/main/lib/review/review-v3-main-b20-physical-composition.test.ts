/**
 * C-R10: actual registered Electron IPC + actual B1/B2/B19/B20 originals +
 * Main-side physical ZIP repick; no school issuer or technical-only mock B20.
 */
import {afterAll,describe,expect,test} from 'bun:test'
import {createHash} from 'node:crypto'
import {mkdtempSync,writeFileSync,renameSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {REVIEW_IPC_CHANNELS} from '@profer/shared'
import {setMainWindow} from '../main-window-state'
import {registerReviewIpc} from './review-ipc'
import {ReviewB2StagingService} from './review-intake-adapter-v3-b2'
import {ReviewB2SourceVersionAdapter} from './review-source-version-adapter-v3-b2'
import {ReviewB2ArchiveVault} from './review-import-checkpoint-v3-b2'
import {ReviewB2InputLedger} from './review-import-ledger-v3-b2'
import {saveB1AuthorRevision,freezeB1Candidate,readB1AuthorRevision}
  from './review-template-author-store-v3-b1'
import type {B1AuthorDocument} from './review-template-plan-adapter-v3-b1'
import type {B19SourceSelection} from './review-v3-b1-b2-candidate-source-bridge'
import {
  CMainNativeArchiveRegistry,
  type CMainPhysicalArchiveScope,
} from './review-v3-main-native-archive-registry'
import {
  installCMainV3PhysicalB20Sources,
  CMainB20NumericEpoch,
} from './review-v3-main-b20-physical-composition'
import {CMainB20CurrentRegistry}
  from './review-v3-main-b20-current-registry'
import type {CMainB20ReadIdentity} from './review-v3-main-b20-trusted-candidate-read'

const root=mkdtempSync(join(tmpdir(),'c-r10-real-physical-b20-'))
const previous=process.env.PROFER_CONFIG_DIR
process.env.PROFER_CONFIG_DIR=root
afterAll(()=>{
  setMainWindow(null)
  if(previous===undefined)delete process.env.PROFER_CONFIG_DIR
  else process.env.PROFER_CONFIG_DIR=previous
  rmSync(root,{recursive:true,force:true})
})
const hash=(x:Buffer|string)=>createHash('sha256').update(x).digest('hex')
const crc=(bytes:Buffer)=>{
  let c=0xffffffff
  for(const n of bytes){c^=n;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1}
  return(c^0xffffffff)>>>0
}
function zip(files:{name:string;text:string}[]):Buffer{
  const parts:Buffer[]=[],central:Buffer[]=[]
  let off=0
  for(const f of files){
    const name=Buffer.from(f.name),bytes=Buffer.from(f.text),sum=crc(bytes)
    const a=Buffer.alloc(30),b=Buffer.alloc(46)
    a.writeUInt32LE(0x04034b50,0);a.writeUInt16LE(20,4)
    a.writeUInt16LE(0x800,6);a.writeUInt32LE(sum,14)
    a.writeUInt32LE(bytes.length,18);a.writeUInt32LE(bytes.length,22)
    a.writeUInt16LE(name.length,26)
    b.writeUInt32LE(0x02014b50,0);b.writeUInt16LE(0x0314,4)
    b.writeUInt16LE(20,6);b.writeUInt16LE(0x800,8)
    b.writeUInt32LE(sum,16);b.writeUInt32LE(bytes.length,20)
    b.writeUInt32LE(bytes.length,24);b.writeUInt16LE(name.length,28)
    b.writeUInt32LE(0x81a40000,38);b.writeUInt32LE(off,42)
    parts.push(a,name,bytes);central.push(b,name);off+=a.length+name.length+bytes.length
  }
  const dir=Buffer.concat(central),end=Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50,0)
  end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10)
  end.writeUInt32LE(dir.length,12);end.writeUInt32LE(off,16)
  return Buffer.concat([...parts,dir,end])
}
const handlers=(globalThis.__proferElectronTestHooks as
  typeof globalThis.__proferElectronTestHooks & {
    ipcMainHandlers:Map<string,(...args:unknown[])=>unknown>
  }).ipcMainHandlers
const frame={processId:777,routingId:3}
const sender={id:91,mainFrame:frame,isDestroyed:()=>false}
const main={isDestroyed:()=>false,webContents:sender}
const event={sender,senderFrame:frame}
const repick=(request:unknown)=>{
  const handler=handlers.get(REVIEW_IPC_CHANNELS.B20_NATIVE_REPICK_V3)
  if(!handler)throw Error('Missing real native picker handler')
  return Promise.resolve(handler(event,request))
}
const invoke=(request:unknown={templateId:'cR10demo'})=>{
  const handler=handlers.get(REVIEW_IPC_CHANNELS.B20_CANDIDATE_READ_V3)
  if(!handler)throw Error('Missing real IPC handler')
  return Promise.resolve(handler(event,request))
}
let number=0
async function setup(){
  const id=++number,templateId='cr10real'+id,caseCandidateId='cr10case'+id
  const path=join(root,'original'+id+'.zip')
  const bytes=zip([{name:'one.txt',text:'Original A '+id},
    {name:'two.txt',text:'Original B '+id}])
  writeFileSync(path,bytes)
  const physicalKey='c-main-real-private-original-'+id
  const staging=new ReviewB2StagingService()
  const parser=new ReviewB2SourceVersionAdapter(staging)
  const vault=new ReviewB2ArchiveVault(staging,join(root,'archives'+id))
  const ledger=new ReviewB2InputLedger(vault,staging,join(root,'ledgers'+id))
  const ctx={senderId:91,frameId:3,ownerId:'main-owner',
    ownerGeneration:4,caseCandidateId}
  const saved=vault.saveAndStage(ctx,{physicalArchiveKey:physicalKey,
    requestId:'physical-original-'+id,bytes})
  const checkpoint=saved.checkpoint
  const initial=ledger.getOrCreate(ctx,checkpoint.archiveId)
  for(const file of initial.files){
    if(file.status!=='needs-user-confirmation')continue
    ledger.decide(ctx,checkpoint.archiveId,
      ledger.snapshot(ctx,checkpoint.archiveId).revision,'approve-'+id+'-'+file.index,
      {entryIndex:file.index,status:'accepted',role:'supporting',
        subjectId:'subject-one',rawSha256:file.rawSha256!},
      {principalId:'local-reviewer',authorize:()=>true})
  }
  const parsed=await Promise.all(saved.preview.candidates.map(x=>parser.parse(ctx,x)))
  const author:B1AuthorDocument={
    schemaVersion:'review-b1/1',templateId,templateVersion:'1',
    name:'R10 exact real zip',purpose:'Technical only',
    status:'candidate-held',fields:[],
    sources:saved.preview.candidates.map((x,n)=>({
      sourceId:'source-'+n,kind:'user-declared' as const,
      documentVersionId:x.documentVersionId,locator:'native:'+n,
      recordedBy:'local-reviewer',
    })),
    targets:[{targetKey:'target',objectKey:'document',subjectId:'subject-one',
      scenario:'candidate only',fieldValues:{}}],
    modules:[{moduleId:'physical',version:'1',dependsOn:[],
      checks:saved.preview.candidates.map((_,n)=>({
        checkKey:'check-'+n,requirement:'Real source '+n,
        responsibility:'Human',sourceIds:['source-'+n],
        targetKeys:['target'],condition:{kind:'always' as const},
      }))}],
    stages:[{stageId:'manual',role:'human',mode:'manual'}],
    outputs:[{outputId:'preview',kind:'preview'}],
  }
  const savedAuthor=saveB1AuthorRevision(author,0,'local-reviewer')
  const frozen=freezeB1Candidate(templateId,1)
  const pinned={templateId,revision:savedAuthor.revision,
    revisionDigest:savedAuthor.digest,
    frozenFingerprint:frozen.descriptor.canonicalPlan.fingerprint}
  const selections:B19SourceSelection[]=saved.preview.candidates.map((x,n)=>({
    checkKey:'check-'+n,targetKey:'target',sourceId:'source-'+n,
    candidateId:x.candidateId,parseRevision:parsed[n]!.parseRevision,
    blockId:parsed[n]!.blocks[0]!.blockId,requiredRole:'supporting',
    archiveId:checkpoint.archiveId,entryIndex:n,
  }))
  let active=true,grantEpoch='main-epoch-4',currentPath=path,physicalReads=0
  const identity=():CMainB20ReadIdentity=>({
    principalId:'local-reviewer',
    sessionId:'local-main-webcontents:91',
    windowId:'main-webcontents:91',frameId:'777:3',
    ownerId:'main-owner',ownerGeneration:4,
    authorityEpoch:grantEpoch,caseCandidateId,
  })
  const scope=():CMainPhysicalArchiveScope=>({...identity()})
  const picker=new CMainNativeArchiveRegistry({
    currentScope:()=>active?scope():undefined,
    assertCurrentArchive:(s,x)=>{
      const cp=vault.inspect(ctx,x.archiveId)
      if(!active||s.authorityEpoch!==grantEpoch||
         x.archiveSha256!==cp.archiveSha256||
         x.archiveByteLength!==cp.byteLength)
        throw new Error('CURRENT_B_VAULT_OR_OWNER_INVALID')
    },
    pickZipPath:()=>currentPath,
  })
  const archiveExpectation={archiveId:checkpoint.archiveId,
    archiveSha256:checkpoint.archiveSha256,
    archiveByteLength:checkpoint.byteLength}
  const entry={
    bSources:{staging,parser,vault,ledger},
    currentCandidate:(principal:string,tid:string)=>active&&principal==='local-reviewer'&&
      tid===templateId?{caseCandidateId,grant:{
        ownerId:'main-owner',generation:4,authorityEpoch:grantEpoch,
      }}:undefined,
    canReadCandidate:(principal:string,tid:string,cid:string)=>active&&
      principal==='local-reviewer'&&tid===templateId&&cid===caseCandidateId,
    currentPinnedAuthor:(cid:string,tid:string)=>active&&cid===caseCandidateId&&
      tid===templateId?pinned:undefined,
    currentSelections:()=>{physicalReads++;return structuredClone(selections)},
    nativePicker:picker,
    currentMainIssuedOriginalKey:(_:CMainB20ReadIdentity,archiveId:string)=>
      archiveId===checkpoint.archiveId?physicalKey:null,
    assertLiveCMainIdentity:(id:CMainB20ReadIdentity)=>{
      const now=identity()
      if(!active||id.principalId!==now.principalId||
         id.sessionId!==now.sessionId||id.windowId!==now.windowId||
         id.frameId!==now.frameId||id.caseCandidateId!==now.caseCandidateId||
         id.ownerId!==now.ownerId||
         id.ownerGeneration!==now.ownerGeneration||
         id.authorityEpoch!==now.authorityEpoch)
        throw Error('C_REAL_MAIN_IDENTITY_REVOKED')
    },
  }
  return {path,bytes,templateId,checkpoint,author,ctx,staging,vault,ledger,parser,
    picker,entry,pinned,selections,physicalKey,archiveExpectation,reads:()=>physicalReads,
    select:()=>picker.pickForBVault(archiveExpectation,physicalKey,
      checkpoint.physicalArchiveKeyDigest),
    expire:()=>{active=false},rotate:()=>{grantEpoch='main-epoch-5'},
    repoint:(p:string)=>{currentPath=p},
    revokePicker:()=>picker.revoke(),
  }
}
describe('C R10 real C Main registered IPC × B R23 B1/B2/B19/B20 physical composition',()=>{
  test('real saved and frozen B1, actual ZIP CRC + accepted ledger, native physical repick, two C Main reads',async()=>{
    handlers.clear();setMainWindow(main as never);registerReviewIpc()
    const f=await setup()
    const dispose=installCMainV3PhysicalB20Sources(f.entry)
    try{
      await expect(repick({templateId:f.templateId,archiveId:f.checkpoint.archiveId}))
        .resolves.toMatchObject({status:'picked-for-candidate-only',
          publicationAllowed:false,businessWriteAllowed:false})
      const value=await invoke({templateId:f.templateId}) as Record<string,unknown>
      expect(value).toMatchObject({
        templateId:f.templateId,caseCandidateId:f.ctx.caseCandidateId,
        state:'candidate-held',displayOnly:true,publicationAllowed:false,
        schoolPolicyVerified:false,businessWriteAllowed:false,
      })
      expect(f.reads()).toBe(3)
      const source=value.candidateProvenance as {bindings:{state:string}[]}
      expect(source.bindings).toHaveLength(2)
      expect(source.bindings.every(x=>x.state==='linked-candidate')).toBe(true)
      for(const secret of ['physicalKey','physicalArchiveKey','nativeKey',
        'schoolIssuer','principalId','senderId','frameId'])
        expect(JSON.stringify(value)).not.toContain('c-main-real-private-original-'+f.ctx.caseCandidateId)
      expect(value).not.toHaveProperty('physicalArchiveKey')
      expect(value).not.toHaveProperty('schoolIssuer')
    }finally{dispose();f.picker.close()}
  })
  test('cold Main has no native picked key and cannot inherit B Vault even with valid author',async()=>{
    const f=await setup()
    const dispose=installCMainV3PhysicalB20Sources(f.entry)
    try{await expect(invoke({templateId:f.templateId}))
      .rejects.toThrow('CURRENT_NATIVE_REPICK_REQUIRED')}
    finally{dispose();f.picker.close()}
  })
  test('same filename and SHA but different physical original inode is not current provenance',async()=>{
    const f=await setup()
    f.select()
    const dispose=installCMainV3PhysicalB20Sources(f.entry)
    try{
      await invoke({templateId:f.templateId})
      const copy=join(root,'same-content-copy'+number+'.zip')
      writeFileSync(copy,f.bytes);renameSync(copy,f.path)
      await expect(invoke({templateId:f.templateId}))
        .rejects.toThrow('PHYSICAL_ORIGINAL_REPLACED')
    }finally{dispose();f.picker.close()}
  })
  test('epoch rotation, current principal revoke and actual saved author version drift deny',async()=>{
    const f=await setup();f.select()
    const dispose=installCMainV3PhysicalB20Sources(f.entry)
    try{
      await invoke({templateId:f.templateId})
      f.rotate()
      await expect(invoke({templateId:f.templateId})).rejects
        .toThrow(/MAIN_CONTEXT_REVOKED|CURRENT_NATIVE_REPICK_REQUIRED/)
    }finally{dispose();f.picker.close()}
    const g=await setup();g.select()
    const off=installCMainV3PhysicalB20Sources(g.entry)
    try{
      const changed=structuredClone(g.author)
      changed.purpose='Revised B1 candidate'
      saveB1AuthorRevision(changed,1,'local-reviewer')
      await expect(invoke({templateId:g.templateId}))
        .rejects.toThrow('B_R20_AUTHOR_REVISION_CONFLICT')
      g.expire()
      await expect(invoke({templateId:g.templateId}))
        .rejects.toThrow(/MAIN_IDENTITY_NOT_INSTALLED|C_REAL_MAIN_IDENTITY_REVOKED/)
    }finally{off();g.picker.close()}
  })
  test('private B original digest mismatch rejects OS key association',async()=>{
    const f=await setup()
    expect(()=>f.picker.pickForBVault(f.archiveExpectation,'fake-original-key',
      f.checkpoint.physicalArchiveKeyDigest))
      .toThrow('B_VAULT_PHYSICAL_ORIGIN_KEY_INVALID')
    expect(()=>f.picker.resolveNativeArchiveKey(f.archiveExpectation))
      .toThrow('CURRENT_NATIVE_REPICK_REQUIRED')
  })
  test('OS picker refuses Renderer physical paths/unknown archive and never opens arbitrary file',async()=>{
    const f=await setup()
    const dispose=installCMainV3PhysicalB20Sources(f.entry)
    try{
      await expect(repick({templateId:f.templateId,
        archiveId:f.checkpoint.archiveId,path:'/tmp/attacker.zip'}))
        .rejects.toThrow('B20_REPICK_RENDERER_CREDENTIAL_OR_PATH_CLAIM')
      await expect(repick({templateId:f.templateId,archiveId:'f'.repeat(40)}))
        .rejects.toThrow('ARCHIVE_NOT_IN_CURRENT_C_MAIN_SELECTIONS')
      await expect(invoke({templateId:f.templateId}))
        .rejects.toThrow('CURRENT_NATIVE_REPICK_REQUIRED')
    }finally{dispose();f.picker.close()}
  })
  test('real Main-local current candidate registration+native repick is the single B20 runtime source',async()=>{
    const f=await setup()
    const current=(templateId:string)=>{
      const grant=f.entry.currentCandidate('local-reviewer',templateId)?.grant
      if(!grant)return undefined
      const identity:CMainB20ReadIdentity={
        principalId:'local-reviewer',
        sessionId:'local-main-webcontents:91',
        windowId:'main-webcontents:91',frameId:'777:3',
        caseCandidateId:f.ctx.caseCandidateId,
        ownerId:grant.ownerId,ownerGeneration:grant.generation,
        authorityEpoch:grant.authorityEpoch,
      }
      return {identity,grant,numeric:{senderId:91,frameId:3}}
    }
    const host={
      current,
      mayRead:(id:CMainB20ReadIdentity,tid:string)=>
        tid===f.templateId&&id.principalId==='local-reviewer',
      currentNativeScope:()=>current(f.templateId)?.identity,
      mainIssuedPhysicalKey:(_:CMainB20ReadIdentity,archiveId:string)=>
        archiveId===f.checkpoint.archiveId?f.physicalKey:null,
      nativePickZipPath:()=>f.path,
    }
    const registry=new CMainB20CurrentRegistry(host,f.entry.bSources)
    expect(()=>registry.registerFromTrustedMain({
      templateId:f.templateId,caseCandidateId:f.ctx.caseCandidateId,
      expected:f.pinned,selections:[
        {...f.selections[0]!,sourceId:'forged-source-not-in-author'},
      ],
    })).toThrow('B19_SELECTION_NOT_IN_FROZEN_AUTHOR')
    registry.registerFromTrustedMain({
      templateId:f.templateId,caseCandidateId:f.ctx.caseCandidateId,
      expected:f.pinned,selections:f.selections,
    })
    expect(()=>registry.registerFromTrustedMain({
      templateId:f.templateId,caseCandidateId:f.ctx.caseCandidateId,
      expected:f.pinned,selections:f.selections,
    })).toThrow('REGISTRATION_EXISTS_REVOKE_FIRST')
    const uninstall=registry.install()
    try{
      await expect(repick({templateId:f.templateId,
        archiveId:f.checkpoint.archiveId}))
        .resolves.toMatchObject({status:'picked-for-candidate-only'})
      const preview=await invoke({templateId:f.templateId}) as {
        candidateProvenance:{bindings:{state:string}[]}
      }
      expect(preview.candidateProvenance.bindings.every(b=>b.state==='linked-candidate'))
        .toBe(true)
      registry.revoke(f.templateId)
      await expect(invoke({templateId:f.templateId}))
        .rejects.toThrow('MAIN_IDENTITY_NOT_INSTALLED')
    }finally{uninstall();registry.close()}
  })
  test('monotonic local numeric epoch is independent of string C epoch and revocation closed',()=>{
    const epoch=new CMainB20NumericEpoch()
    const scope:CMainB20ReadIdentity={
      principalId:'local-reviewer',sessionId:'trusted-session',
      windowId:'main-window',frameId:'777:3',caseCandidateId:'c1',
      ownerId:'owner-one',ownerGeneration:9,authorityEpoch:'string-not-number',
    }
    const first=epoch.create(scope,{senderId:91,frameId:3})
    expect(first).toMatchObject({senderId:91,frameId:3,
      authorityEpoch:1,ownerGeneration:9})
    expect(epoch.create(scope,{senderId:91,frameId:3}).authorityEpoch).toBe(1)
    const next=epoch.create({...scope,authorityEpoch:'revoked-epoch'},{
      senderId:91,frameId:3,
    })
    expect(next.authorityEpoch).toBe(2)
    epoch.invalidate()
    expect(epoch.create(scope,{senderId:91,frameId:3}).authorityEpoch).toBe(3)
    epoch.close()
    expect(()=>epoch.create(scope,{senderId:91,frameId:3}))
      .toThrow('NUMERIC_EPOCH_CLOSED')
  })
})
