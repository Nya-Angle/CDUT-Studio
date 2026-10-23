import { describe, expect, test } from 'bun:test'
import {
  CMainB20TrustedCandidateRead,
  type CMainB20PinnedExpectation,
  type CMainB20ReadIdentity,
} from './review-v3-main-b20-trusted-candidate-read'

const expected: CMainB20PinnedExpectation = {
  templateId: 'template51', revision: 3,
  revisionDigest: 'a'.repeat(64), frozenFingerprint: 'b'.repeat(64),
}
const trusted: CMainB20ReadIdentity = {
  principalId: 'physical-Main-reviewer', sessionId: 'active-main-session',
  ownerId: 'owner-51', ownerGeneration: 7, windowId: 'main-12',
  frameId: 'process-17:route-3', authorityEpoch: 'main-grant-1',
  caseCandidateId: 'case-candidate-51',
}
function candidateBundle() {
  return {
    schemaVersion: 'review-v3-b20-main-read-bundle/1',
    candidateOnly: true, publicationAllowed: false,
    businessWriteAllowed: false, schoolPolicyVerified: false,
    authorityInstalledByB: false,
    templateId: expected.templateId, authorRevision: expected.revision,
    authorRevisionDigest: expected.revisionDigest,
    frozenFingerprint: expected.frozenFingerprint,
    authorStatus: 'candidate-held',
    ownerId: trusted.ownerId, ownerGeneration: trusted.ownerGeneration,
    caseCandidateId: trusted.caseCandidateId,
    frozenDescriptor: { canonicalPlan: { fingerprint: expected.frozenFingerprint } },
    candidateProvenance: {
      schemaVersion: 'review-v3-b1-b2-candidate-source/1',
      candidateOnly: true, publicationAllowed: false,
      businessWriteAllowed: false, schoolPolicyVerified: false,
      caseCandidateId: trusted.caseCandidateId,
      ownerId: trusted.ownerId, ownerGeneration: trusted.ownerGeneration,
      planFingerprint: expected.frozenFingerprint,
      bindings: [{checkKey:'check-1',state:'unknown',sources:[]}],
      invalidatedPriorEvidence: [], snapshotHash: 'c'.repeat(64),
    },
    /* These fields MUST NOT be reflected into a renderer preview. */
    principalId: 'internal-private-principal',
    nativePhysicalArchiveKey: 'private-native-file-key',
    sessionId: 'private-session',
    schoolIssuer: 'FORGED-ISSUER',
  }
}
function fixture() {
  let current: CMainB20ReadIdentity | undefined = structuredClone(trusted)
  let pinned: CMainB20PinnedExpectation | undefined = structuredClone(expected)
  let token: string | undefined = 'installation-token-1'
  let allowed = true
  let raw: ReturnType<typeof candidateBundle> = candidateBundle()
  let callCount = 0
  let onRead: (count: number) => void = () => {}
  const gate = new CMainB20TrustedCandidateRead({
    currentIdentity: () => current && structuredClone(current),
    currentInstallationToken: () => token,
    canRead: (id, template) => allowed &&
      id.principalId === 'physical-Main-reviewer' &&
      id.frameId === 'process-17:route-3' &&
      template === 'template51',
    getPinnedExpectation: (_id, template) =>
      template === 'template51' ? pinned && structuredClone(pinned) : undefined,
    readCurrentBundle: async () => {
      const copy = structuredClone(raw)
      onRead(++callCount)
      return copy
    },
  })
  return {
    gate, calls: () => callCount, onRead: (fn: (n:number) => void) => {onRead=fn},
    revoke: () => {allowed=false}, noFrame: () => {current=undefined},
    rotateOwner: () => {current={...trusted,ownerGeneration:8}},
    swapFrame: () => {current={...trusted,frameId:'new-frame'}},
    revokeInstall: () => {token=undefined},
    reinstallSameSource: () => {token='new-same-source-installation'},
    rotateSource: () => {pinned={...expected,revision:4}},
    mutate: (fn:(x:ReturnType<typeof candidateBundle>)=>void) => {fn(raw)},
  }
}
describe('C-MAIN-B20-R01 B-owned R20 real-read Main trust boundary (no IPC)', () => {
  test('only exact current B20 candidate is returned, redacting physical picker/Principal/Issuer', async () => {
    const f=fixture()
    const value=await f.gate.read('template51')
    expect(f.calls()).toBe(2)
    expect(value).toMatchObject({
      templateId:'template51',authorRevision:3,displayOnly:true,
      state:'candidate-held',candidateOnly:true,publicationAllowed:false,
      businessWriteAllowed:false,schoolPolicyVerified:false,
    })
    expect(value).not.toHaveProperty('nativePhysicalArchiveKey')
    expect(value).not.toHaveProperty('principalId')
    expect(value).not.toHaveProperty('schoolIssuer')
    const p=value.candidateProvenance as ReturnType<typeof candidateBundle>['candidateProvenance']
    expect(p.bindings[0]?.state).toBe('unknown')
    p.bindings.push({checkKey:'client-forged-check',state:'linked-candidate',sources:[]})
    const again=await f.gate.read('template51')
    expect((again.candidateProvenance as typeof p).bindings).toHaveLength(1)
  })
  test('no Main/Owner installation or wrong template refuses before any B read', async () => {
    expect(() => new CMainB20TrustedCandidateRead({} as never))
      .toThrow('TRUSTED_MAIN_AND_B20_DEPENDENCIES_REQUIRED')
    const f=fixture()
    await expect(f.gate.read('../traversal')).rejects.toThrow('TEMPLATE_SCOPE_INVALID')
    f.revokeInstall()
    await expect(f.gate.read('template51')).rejects.toThrow('MAIN_INSTALLATION_MISSING')
    expect(f.calls()).toBe(0)
    const g=fixture()
    g.noFrame()
    await expect(g.gate.read('template51')).rejects.toThrow('MAIN_IDENTITY_NOT_INSTALLED')
    const h=fixture()
    h.revoke()
    await expect(h.gate.read('template51')).rejects.toThrow('MAIN_ACL_REVOKED')
  })
  test('revoked same-object Main installation during first awaited source read is not revived', async () => {
    const f=fixture()
    f.onRead(n => {if(n===1)f.reinstallSameSource()})
    await expect(f.gate.read('template51'))
      .rejects.toThrow('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    expect(f.calls()).toBe(1)
  })
  test('swapped physical frame, rotated Owner generation or removed auth after await fail closed', async () => {
    const a=fixture();a.onRead(n=>{if(n===1)a.swapFrame()})
    await expect(a.gate.read('template51'))
      .rejects.toThrow('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    const b=fixture();b.onRead(n=>{if(n===2)b.rotateOwner()})
    await expect(b.gate.read('template51'))
      .rejects.toThrow('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    const c=fixture();c.onRead(n=>{if(n===1)c.revoke()})
    await expect(c.gate.read('template51')).rejects.toThrow('MAIN_ACL_REVOKED')
  })
  test('C Main source revision, digest and fingerprint must remain identical after awaited disk read', async () => {
    const f=fixture()
    f.onRead(n=>{if(n===1)f.rotateSource()})
    await expect(f.gate.read('template51'))
      .rejects.toThrow('MAIN_CONTEXT_REVOKED_AFTER_B20_READ')
    const g=fixture()
    g.mutate(b=>{b.authorRevision=2})
    await expect(g.gate.read('template51'))
      .rejects.toThrow('B20_BUNDLE_NOT_PINNED_TO_MAIN')
    const h=fixture()
    h.mutate(b=>{b.frozenDescriptor.canonicalPlan.fingerprint='d'.repeat(64)})
    await expect(h.gate.read('template51'))
      .rejects.toThrow('B20_FROZEN_DESCRIPTOR_MISMATCH')
  })
  test('candidate bundle cannot claim published policy, business write, or independent authorizer', async () => {
    for (const bad of [
      (x:ReturnType<typeof candidateBundle>)=>{x.publicationAllowed=true},
      (x:ReturnType<typeof candidateBundle>)=>{x.businessWriteAllowed=true},
      (x:ReturnType<typeof candidateBundle>)=>{x.schoolPolicyVerified=true},
      (x:ReturnType<typeof candidateBundle>)=>{x.authorityInstalledByB=true},
      (x:ReturnType<typeof candidateBundle>)=>{x.authorStatus='published' as never},
    ]) {
      const f=fixture()
      f.mutate(bad)
      await expect(f.gate.read('template51')).rejects.toThrow('B20_BUNDLE_NOT_PINNED_TO_MAIN')
    }
  })
  test('cross-case, rotated Owner, forged B19 receipt/provenance status cannot pass as current', async () => {
    for (const mutate of [
      (x:ReturnType<typeof candidateBundle>)=>{x.caseCandidateId='other-case'},
      (x:ReturnType<typeof candidateBundle>)=>{x.ownerGeneration=9},
      (x:ReturnType<typeof candidateBundle>)=>{x.candidateProvenance.caseCandidateId='other-case'},
      (x:ReturnType<typeof candidateBundle>)=>{x.candidateProvenance.publicationAllowed=true},
      (x:ReturnType<typeof candidateBundle>)=>{x.candidateProvenance.snapshotHash='forged'},
      (x:ReturnType<typeof candidateBundle>)=>{x.candidateProvenance.planFingerprint='f'.repeat(64)},
    ]) {
      const f=fixture(); f.mutate(mutate)
      await expect(f.gate.read('template51')).rejects.toThrow(/B20_(BUNDLE_NOT_PINNED_TO_MAIN|SOURCE_PROVENANCE_NOT_CURRENT)/)
    }
  })
  test('in-flight B20 source changes after first physical read are not returned', async () => {
    const f=fixture()
    f.onRead(n=>{if(n===1)f.mutate(b=>{b.candidateProvenance.snapshotHash='d'.repeat(64)})})
    await expect(f.gate.read('template51')).rejects.toThrow('B20_SOURCE_CHANGED_DURING_READ')
    expect(f.calls()).toBe(2)
  })
})
