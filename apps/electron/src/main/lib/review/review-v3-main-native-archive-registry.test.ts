import {afterAll,describe,expect,test} from 'bun:test'
import {mkdtempSync,writeFileSync,renameSync,rmSync,symlinkSync,linkSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import {
  CMainNativeArchiveRegistry,
  type CMainPhysicalArchiveScope,
  type CMainNativeArchiveExpectation,
} from './review-v3-main-native-archive-registry'

const root=mkdtempSync(join(tmpdir(),'c-main-picker-r01-'))
afterAll(()=>rmSync(root,{recursive:true,force:true}))
const hash=(v:Buffer)=>createHash('sha256').update(v).digest('hex')
let serial=0
function fixture(){
  const path=join(root,'archive-'+(++serial)+'.zip')
  const bytes=Buffer.from('PK\x03\x04real independent ZIP original '+serial)
  writeFileSync(path,bytes)
  let chosen=path,enabled=true,allowed=true,epoch=7,frame='321:4'
  const scope=():CMainPhysicalArchiveScope=>({
    principalId:'current-local-reviewer',sessionId:'main-current-session',
    windowId:'main-window',frameId:frame,ownerId:'owner51',
    ownerGeneration:epoch,authorityEpoch:'main-generation-'+epoch,
    caseCandidateId:'case51',
  })
  const expected:CMainNativeArchiveExpectation={
    archiveId:'vault-current-archive51',archiveSha256:hash(bytes),
    archiveByteLength:bytes.length,
  }
  const registry=new CMainNativeArchiveRegistry({
    currentScope:()=>enabled?scope():undefined,
    assertCurrentArchive:(s,e)=>{
      if(!allowed||s.caseCandidateId!=='case51'||s.ownerGeneration!==epoch||
         s.frameId!==frame||e.archiveId!==expected.archiveId||
         e.archiveSha256!==expected.archiveSha256||
         e.archiveByteLength!==expected.archiveByteLength)
        throw new Error('B_VAULT_CURRENT_GRANT_OR_ARCHIVE_REVOKED')
    },
    pickZipPath:()=>chosen,
  })
  return {path,bytes,expected,registry,rotate:()=>{epoch++},
    revoke:()=>{allowed=false},noMain:()=>{enabled=false},
    frameSwap:()=>{frame='other-frame'},
    select:(p:string)=>{chosen=p},wrongExpected:()=>({...expected,archiveSha256:'f'.repeat(64)})}
}
describe('C-MAIN-PICKER-R01 true physical original witness (not B vault)',()=>{
  test('OS-picked bytes are rehashed on every privileged read; same private key only within one live grant',()=>{
    const f=fixture()
    f.registry.pick(f.expected)
    const one=f.registry.resolveNativeArchiveKey(f.expected)
    expect(one.length).toBeGreaterThan(16)
    expect(f.registry.resolveNativeArchiveKey(f.expected)).toBe(one)
    expect(()=>f.registry.pick(f.expected)).toThrow('ARCHIVE_ALREADY_REGISTERED')
    f.registry.revoke()
    expect(()=>f.registry.resolveNativeArchiveKey(f.expected)).toThrow('CURRENT_NATIVE_REPICK_REQUIRED')
    f.registry.pick(f.expected)
    const two=f.registry.resolveNativeArchiveKey(f.expected)
    expect(two).not.toBe(one)
    f.registry.close()
    expect(()=>f.registry.resolveNativeArchiveKey(f.expected)).toThrow('REGISTRY_CLOSED')
  })
  test('wrong bytes, same-name replacement and same SHA copied into distinct physical inode never reuse trust',()=>{
    const f=fixture()
    const different=join(root,'different-'+serial+'.zip')
    writeFileSync(different,Buffer.from('PKdifferent original'))
    f.select(different)
    expect(()=>f.registry.pick(f.expected)).toThrow('PICKED_DIFFERENT_PHYSICAL_ORIGINAL')
    f.select(f.path);f.registry.pick(f.expected)
    const copy=join(root,'copy-'+serial+'.zip')
    writeFileSync(copy,f.bytes)
    renameSync(copy,f.path)
    // SHA256 is identical but st_dev/st_ino changed.
    expect(()=>f.registry.resolveNativeArchiveKey(f.expected)).toThrow('PHYSICAL_ORIGINAL_REPLACED')
  })
  test('symlink and multiply hardlinked physical sources are not accepted as native regular origin',()=>{
    const f=fixture()
    const link=join(root,'symlink-'+serial+'.zip')
    symlinkSync(f.path,link)
    f.select(link)
    expect(()=>f.registry.pick(f.expected)).toThrow('REGULAR_UNLINKED_ZIP_REQUIRED')
    const second=join(root,'hardlink-'+serial+'.zip')
    linkSync(f.path,second)
    f.select(f.path)
    expect(()=>f.registry.pick(f.expected)).toThrow('REGULAR_UNLINKED_ZIP_REQUIRED')
  })
  test('revoked Principal/Owner/grant, forged source SHA and lost Main window fail closed',()=>{
    const f=fixture()
    expect(()=>f.registry.pick(f.wrongExpected())).toThrow('B_VAULT_CURRENT_GRANT_OR_ARCHIVE_REVOKED')
    f.registry.pick(f.expected)
    f.rotate()
    expect(()=>f.registry.resolveNativeArchiveKey(f.expected))
      .toThrow('CURRENT_NATIVE_REPICK_REQUIRED')
    f.revoke()
    expect(()=>f.registry.pick(f.expected)).toThrow('B_VAULT_CURRENT_GRANT_OR_ARCHIVE_REVOKED')
    const g=fixture()
    g.noMain()
    expect(()=>g.registry.pick(g.expected)).toThrow('AUTHENTICATED_MAIN_SCOPE_REQUIRED')
  })
  test('native repick not possible after cold registry restart without a fresh OS selection',()=>{
    const f=fixture()
    f.registry.pick(f.expected)
    const cold=new CMainNativeArchiveRegistry({
      currentScope:()=>({
        principalId:'current-local-reviewer',sessionId:'main-current-session',
        windowId:'main-window',frameId:'321:4',ownerId:'owner51',
        ownerGeneration:7,authorityEpoch:'main-generation-7',caseCandidateId:'case51',
      }),
      assertCurrentArchive:()=>{},
      pickZipPath:()=>undefined,
    })
    expect(()=>cold.resolveNativeArchiveKey(f.expected)).toThrow('CURRENT_NATIVE_REPICK_REQUIRED')
    expect(()=>cold.pick(f.expected)).toThrow('USER_DID_NOT_SELECT_ORIGINAL')
  })
})
