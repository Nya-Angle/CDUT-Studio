import {describe,expect,test} from 'bun:test'
import {
  CMainNativeRemovalObserver,
  type CMainNativeRemovalPrompt,
} from './review-v3-main-native-removal-observer'
import { CMainRemovalConsentGate, type CMainRemovalCommitContext } from './review-v3-main-removal-consent'

const before='a'.repeat(64),after='b'.repeat(64)
const one=JSON.stringify(['check-one','subject:s1','file','s1',['v1','v2']])
const two=JSON.stringify(['check-two','subject:s2','notice','s2',['v2']])
const ctx=():CMainRemovalCommitContext=>({
  caseId:'case51',requestId:'req51',currentCaseRevision:5,
  identity:{principalId:'local-reviewer',sessionId:'main-91',
    windowId:'window-1',frameId:'123:4',ownerId:'owner1',
    ownerGeneration:2,authorityEpoch:'real-main-epoch-2'},
  acknowledgement:{previousFingerprint:before,nextFingerprint:after,
    acknowledgedRemovedIdentities:[one,two]},
  computedRemovedIdentities:[one,two],
  reason:'Human reviewed the exact two deleted obligations',
})

describe('C-MAIN-HUMAN-R02 physical Main OS dialog from native CAS',()=>{
  test('complete Check×target×object×subject×version-set is visible, independent OS approval used exactly once',()=>{
    let seen:CMainNativeRemovalPrompt|undefined
    const observer=new CMainNativeRemovalObserver(prompt=>{seen=prompt;return true})
    const gate=new CMainRemovalConsentGate(observer)
    const input=ctx()
    observer.observeAtCommit(input)
    expect(seen?.detail).toContain(one)
    expect(seen?.detail).toContain(two)
    expect(seen?.detail).toContain(before)
    expect(seen?.detail).toContain(after)
    expect(seen?.detail).toContain('确认理由')
    const id=observer.getObservedMainHumanConsent('case51','req51')?.approvalId
    expect(typeof id).toBe('string')
    gate.consumeAtCommit(input)
    expect(()=>gate.consumeAtCommit(input)).toThrow('APPROVAL_ALREADY_USED_OR_INVALID')
    gate.close()
    expect(()=>new CMainRemovalConsentGate(observer).consumeAtCommit(input))
      .toThrow('APPROVAL_ALREADY_USED_OR_INVALID')
    expect(()=>observer.observeAtCommit(input)).toThrow('REQUEST_REUSED_OR_CAPACITY')
  })
  test('no physical approval, closed dialog or missing physical source prevents deletion',()=>{
    const observer=new CMainNativeRemovalObserver(()=>false)
    const gate=new CMainRemovalConsentGate(observer)
    expect(()=>observer.observeAtCommit(ctx())).toThrow('HUMAN_CANCELLED')
    expect(()=>gate.consumeAtCommit(ctx())).toThrow('PHYSICAL_HUMAN_CONFIRMATION_MISSING')
    expect(()=>observer.observeAtCommit(ctx())).toThrow('REQUEST_REUSED_OR_CAPACITY')
    const fresh=new CMainNativeRemovalObserver(()=>true)
    fresh.close()
    expect(()=>fresh.observeAtCommit(ctx())).toThrow('CLOSED_OR_REENTRANT')
    expect(fresh.getObservedMainHumanConsent('case51','req51')).toBeUndefined()
  })
  test('rejects altered obligations, invalid JSON identity, missing owner, very long lists BEFORE dialog',()=>{
    let dialogs=0
    const f=new CMainNativeRemovalObserver(()=>{dialogs++;return true})
    const altered={...ctx(),acknowledgement:{...ctx().acknowledgement,
      acknowledgedRemovedIdentities:[one]}}
    expect(()=>f.observeAtCommit(altered)).toThrow('COMPLETE_CURRENT_CAS_OBLIGATION_REQUIRED')
    expect(()=>f.observeAtCommit({...ctx(),identity:{...ctx().identity,ownerId:''}}))
      .toThrow('COMPLETE_CURRENT_CAS_OBLIGATION_REQUIRED')
    expect(()=>f.observeAtCommit({...ctx(),computedRemovedIdentities:['not-json',two]}))
      .toThrow('COMPLETE_CURRENT_CAS_OBLIGATION_REQUIRED')
    const many=Array.from({length:400},(_,n)=>
      JSON.stringify(['check-'+n,'subject:s1','document','s1',['v'+n]]))
    const huge={...ctx(),requestId:'big',computedRemovedIdentities:many,
      acknowledgement:{...ctx().acknowledgement,acknowledgedRemovedIdentities:many}}
    expect(()=>f.observeAtCommit(huge)).toThrow('FULL_OBLIGATION_LIST_TOO_LARGE_TO_SHOW')
    expect(dialogs).toBe(0)
  })
  test('Main Owner or real Case revision drift makes physically observed token invalid at final CAS',()=>{
    const observer=new CMainNativeRemovalObserver(()=>true)
    const gate=new CMainRemovalConsentGate(observer)
    observer.observeAtCommit(ctx())
    expect(()=>gate.consumeAtCommit({...ctx(),identity:{...ctx().identity,authorityEpoch:'revoked'}}))
      .toThrow('MAIN_PRINCIPAL_OWNER_FRAME_OR_REVISION_CHANGED')
    expect(()=>gate.consumeAtCommit({...ctx(),currentCaseRevision:6}))
      .toThrow('MAIN_PRINCIPAL_OWNER_FRAME_OR_REVISION_CHANGED')
    gate.consumeAtCommit(ctx())
  })
  test('native reentrant confirmation cannot confirm a second request while first modal is open',()=>{
    let observer:CMainNativeRemovalObserver
    observer=new CMainNativeRemovalObserver(()=>{
      expect(()=>observer.observeAtCommit({...ctx(),requestId:'other-request'}))
        .toThrow('CLOSED_OR_REENTRANT')
      return true
    })
    observer.observeAtCommit(ctx())
    new CMainRemovalConsentGate(observer).consumeAtCommit(ctx())
  })
})
