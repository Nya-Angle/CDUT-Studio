import { describe, expect, test } from 'bun:test'
import {
  CMainRemovalConsentGate,
  type CMainRemovalCommitContext,
  type CMainRemovalObservedConsent,
} from './review-v3-main-removal-consent'

const before = 'a'.repeat(64), after = 'b'.repeat(64)
function fixture() {
  const ctx:CMainRemovalCommitContext = {
    caseId:'case-1', requestId:'up-1', currentCaseRevision:7,
    identity:{
      principalId:'trusted-main-reviewer', sessionId:'native-main-session-7',
      windowId:'native-window-1',frameId:'physical-frame-7',
      ownerId:'owner-7',ownerGeneration:3,authorityEpoch:'grant-7',
    },
    acknowledgement:{
      previousFingerprint:before,nextFingerprint:after,
      acknowledgedRemovedIdentities:['["check-1","subject:s","obj","s",["v1"]]'],
    },
    computedRemovedIdentities:['["check-1","subject:s","obj","s",["v1"]]'],
    reason:'I confirm removal after examining the source',
  }
  let observed:CMainRemovalObservedConsent|undefined = {
    schemaVersion:'review-v3-main-human-removal-consent/1',
    approvalId:'main-human-observed-1',caseId:ctx.caseId,
    requestId:ctx.requestId,expectedRevision:ctx.currentCaseRevision,
    ...ctx.identity,
    previousFingerprint:before,nextFingerprint:after,
    acknowledgedRemovedIdentities:[...ctx.computedRemovedIdentities],
    reason:ctx.reason,observedAtMs:Date.now(),
  }
  const observer={getObservedMainHumanConsent:()=>observed}
  const gate=new CMainRemovalConsentGate(observer)
  return {ctx,gate,observer,clear:()=>{observed=undefined},
    edit:(fn:(v:CMainRemovalObservedConsent)=>CMainRemovalObservedConsent)=>{
      if(!observed)throw Error('observation missing')
      observed=fn(observed)
    },
  }
}
describe('C-MAIN-REMOVAL-R01 independent one-use Main human physical witness',()=>{
  test('approved deletion is consumed once; physical approval ID never authorizes another Case transaction',()=>{
    const f=fixture()
    f.gate.consumeAtCommit(f.ctx)
    expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow('APPROVAL_ALREADY_USED_OR_INVALID')
    // Even if a different request is observed with the same physical ID it
    // cannot revive that Main human click as an entirely new transaction.
    f.edit(c=>({...c,requestId:'up-2'}))
    expect(()=>f.gate.consumeAtCommit({...f.ctx,requestId:'up-2'}))
      .toThrow('APPROVAL_ALREADY_USED_OR_INVALID')
  })
  test('uninstall/reinstall of the SAME Main observer retains one-use tombstone',()=>{
    const f=fixture()
    f.gate.consumeAtCommit(f.ctx)
    f.gate.close()
    const reinstalled=new CMainRemovalConsentGate(f.observer)
    expect(()=>reinstalled.consumeAtCommit(f.ctx))
      .toThrow('APPROVAL_ALREADY_USED_OR_INVALID')
  })
  test('absent observer, invalid source, missing observation or closed registry is always deny',()=>{
    expect(()=>new CMainRemovalConsentGate({} as never))
      .toThrow('PHYSICAL_HUMAN_OBSERVER_INVALID')
    const g=new CMainRemovalConsentGate(undefined)
    const f=fixture()
    expect(()=>g.consumeAtCommit(f.ctx)).toThrow('MAIN_OBSERVER_NOT_INSTALLED')
    f.clear()
    expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow('PHYSICAL_HUMAN_CONFIRMATION_MISSING')
    f.gate.close()
    expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow('GATE_CLOSED')
  })
  test('Case revision, physical actor, source fingerprints and obligation identities are exact',()=>{
    for(const tweak of [
      (c:CMainRemovalObservedConsent)=>({...c,expectedRevision:c.expectedRevision+1}),
      (c:CMainRemovalObservedConsent)=>({...c,principalId:'fake-client'}),
      (c:CMainRemovalObservedConsent)=>({...c,frameId:'new-physical-frame'}),
      (c:CMainRemovalObservedConsent)=>({...c,ownerGeneration:c.ownerGeneration+1}),
      (c:CMainRemovalObservedConsent)=>({...c,authorityEpoch:'revoked-grant'}),
      (c:CMainRemovalObservedConsent)=>({...c,previousFingerprint:after}),
      (c:CMainRemovalObservedConsent)=>({...c,nextFingerprint:before}),
      (c:CMainRemovalObservedConsent)=>({...c,acknowledgedRemovedIdentities:[]}),
      (c:CMainRemovalObservedConsent)=>({...c,reason:'UI had other words'}),
    ]){
      const f=fixture()
      f.edit(tweak)
      expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow(/^C_MAIN_REMOVAL_CONSENT_/)
    }
  })
  test('expired, future and noninteger human observation time are all invalid',()=>{
    for(const observedAtMs of [Date.now()-6*60*1000,Date.now()+30_000,NaN]){
      const f=fixture()
      f.edit(c=>({...c,observedAtMs}))
      expect(()=>f.gate.consumeAtCommit(f.ctx))
        .toThrow('HUMAN_CONFIRMATION_EXPIRED_OR_INVALID')
    }
  })
  test('no FIFO/LRU eviction of consumed one-use confirmations at capacity',()=>{
    const f=fixture()
    for(let i=0;i<4096;i++){
      f.edit(c=>({...c,approvalId:'physical-confirm-'+i}))
      f.gate.consumeAtCommit(f.ctx)
    }
    f.edit(c=>({...c,approvalId:'overflow-4097'}))
    expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow('CAPACITY_EXHAUSTED_CLOSED')
    expect(()=>f.gate.consumeAtCommit(f.ctx)).toThrow('GATE_CLOSED')
  })
})
