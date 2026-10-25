import { afterAll, describe, expect, test } from 'bun:test'
import { join } from 'node:path'
import { rmSync } from 'node:fs'
import {
  REVIEW_C0_SCHEMA_VERSION, REVIEW_V3_EXECUTION_SCHEMA,
  type Actor, type CanonicalPlan, type ReviewCaseV2,
  type RunEvidenceIdentity, type V3ExecutionProposal, type SourceIdentity,
} from '@profer/shared'
import { createAggregate, readAggregate, submitCommand, writeAggregate } from './case-store-v2'
import { executionProposalId } from './review-v3-execution-contract'
import { admitV3TechnicalRun, recordV3TechnicalProposal } from './review-v3-technical-ledger'
import type { V3VerifiedHostReceipt } from './review-v3-execution-contract'

const root = join(import.meta.dir, '../../../../../../work/tmp', `review-v3-c2-ledger-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const sha = 'a'.repeat(64)
const plan: CanonicalPlan = {
  schemaVersion: REVIEW_C0_SCHEMA_VERSION, planId: 'prepared-policy',
  fingerprint: sha, templateId: 'template-1', templateVersion: '2', moduleDigests: [sha],
  bindings: [{
    checkKey: 'R01', targetKey: 'target-1', objectKey: 'object-1',
    subjectId: 'subject-1', applicability: 'applicable',
    sourceVersionIds: ['doc-v1'], conditionFingerprint: sha,
  }],
}
function evidence(id: string, caseRevision: number): RunEvidenceIdentity {
  return {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, runId: `run-${id}`,
    caseId: id, caseRevision, planFingerprint: sha, templateVersion: '2',
    inputManifestHash: sha, sourceVersionIds: ['doc-v1'], checkKeys: ['R01'],
    attemptId: 'owner-attempt-01', ownerGeneration: 1,
  }
}
async function seed(id: string) {
  const now = '2026-10-19T00:00:00Z'
  const state: ReviewCaseV2 = {
    id, title: 'Verified Plan technical-only journal', templateId: 'template-1', templateVersion: 2,
    objectType: 'document', caseFields: {},
    subjects: [{ id: 'subject-1', type: 'item', title: 'Applicant claim',
      fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' }],
    documents: [{
      documentId: 'd1', versionId: 'doc-v1', contentHash: sha, byteHash: sha,
      role: 'application', fileName: 'real-input.txt', mimeType: 'text/plain',
      sizeBytes: 12, assetPath: 'source-docs/doc-v1/original.txt', parseRevision: 1,
      parseStatus: 'parsed', blocks: [{blockId:'block-1',text:'real text',kind:'text',location:{kind:'paragraph',index:0}}],
      usage: 'registered', active: true,
    }], stage: 'draft', revision: 0, createdAt: now, updatedAt: now,
  }
  await createAggregate(id,state)
  const initial=readAggregate(id)!
  initial.canonicalPlan={...plan}
  // Fixture only. Production binding must go through C's published verifier;
  // no test fixture constitutes an attested/official Plan.
  const {writeAggregate}=await import('./case-store-v2')
  writeAggregate(initial)
}
function checkEvent(run: RunEvidenceIdentity, sequence: number, hostReceiptId = 'host-check-1'): V3ExecutionProposal {
  const body = {
    schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence,
    permissionGrantId: 'main-grant-1', kind: 'check' as const,
    hostReceiptId, check: {
      checkKey: 'R01', targetKey: 'target-1', objectKey: 'object-1',
      subjectId: 'subject-1', status: 'accepted' as const,
    },
  }
  return {...body, eventId:executionProposalId(body)}
}
function terminal(run: RunEvidenceIdentity, sequence: number): V3ExecutionProposal {
  const body = {
    schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence,
    permissionGrantId:'main-grant-1', kind:'terminal' as const,
    hostReceiptId:'host-end-1',
    terminal:{status:'completed-technical' as const},
  }
  return {...body,eventId:executionProposalId(body)}
}
const host = () => {
  const receipts = new Map<string, V3VerifiedHostReceipt>()
  receipts.set('host-check-1', {
    kind: 'check', permissionGrantId: 'main-grant-1',
    check: { checkKey: 'R01', targetKey: 'target-1', objectKey: 'object-1',
      subjectId: 'subject-1', status: 'accepted' },
  })
  receipts.set('host-end-1', {
    kind: 'terminal', permissionGrantId: 'main-grant-1',
    terminalStatus: 'completed-technical',
  })
  return { permissionGrantId: 'main-grant-1', grantActive: true, receipts }
}

describe('C2 Main-only technical journal: durable evidence, never a BusinessDecision',()=>{
  test('Main attestation required, CAS admission and idempotent replay',async()=>{
    const id='c2-ledger-1'
    await seed(id)
    const run=evidence(id,1)
    // A missing mandatory Main attestor throws synchronously before a
    // Promise is returned; assert that actual contract, not .rejects.
    expect(() => admitV3TechnicalRun(id,{
      requestId:'run-admit-01', expectedRevision:0, actor, payload:run,
    },undefined as never)).toThrow('attestation')
    const first=await admitV3TechnicalRun(id,{
      requestId:'run-admit-01',expectedRevision:0,actor,payload:run,
    },()=>{})
    expect(first.ok).toBe(true)
    const second=await admitV3TechnicalRun(id,{
      requestId:'run-admit-01',expectedRevision:0,actor,payload:run,
    },()=>{})
    expect(second.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(0)
    expect(readAggregate(id)?.decisions).toHaveLength(0)
    const initial=readAggregate(id)!
    const ev=checkEvent(run,1)
    const appended=await recordV3TechnicalProposal(id,{
      requestId:ev.eventId,expectedRevision:1,actor,payload:ev,
    },()=>host())
    expect(appended.ok).toBe(true)
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(1)
    const repeat=await recordV3TechnicalProposal(id,{
      requestId:ev.eventId,expectedRevision:1,actor,payload:ev,
    },()=>host())
    expect(repeat.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.revision).toBe(2)
    // Same requestId replay is the existing durable receipt, not a new
    // transaction/revision. Only the first Host event adds one receipt.
    expect(readAggregate(id)?.receiptLog).toHaveLength(initial.receiptLog.length+1)
    expect(readAggregate(id)?.decisions).toHaveLength(0)
    const end=terminal(run,2)
    const final=await recordV3TechnicalProposal(id,{
      requestId:end.eventId,expectedRevision:2,actor,payload:end,
    },()=>host())
    expect(final.ok).toBe(true)
    const recorded=readAggregate(id)!
    expect(recorded.v3TechnicalExecution?.terminalStatus).toBe('completed-technical')
    expect(recorded.v3TechnicalExecution?.events.map(e=>e.sequence)).toEqual([1,2])
    expect(recorded.caseV2.revision).toBe(3)
    expect(recorded.decisions).toHaveLength(0)
    expect(recorded.observations).toHaveLength(0)
    const forged=checkEvent(run,3,'host-check-1')
    const denied=await recordV3TechnicalProposal(id,{
      requestId:forged.eventId,expectedRevision:3,actor,payload:forged,
    },()=>host())
    expect(denied.ok).toBe(false)
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(recorded))
  })
  test('cannot admit false Plan, current source or unsupported manifest without Main attestation',async()=>{
    const id='c2-ledger-prep-2'
    await seed(id)
    const run=evidence(id,1)
    const forged={...run,planFingerprint:'b'.repeat(64)}
    const out=await admitV3TechnicalRun(id,{
      requestId:'prepare-bad-fingerprint-01',expectedRevision:0,actor,payload:forged,
    },()=>{})
    expect(out.ok).toBe(false)
    const missing=await admitV3TechnicalRun(id,{
      requestId:'prepare-wrong-revision-02',expectedRevision:0,actor,
      payload:{...run,caseRevision:9},
    },()=>{})
    expect(missing.ok).toBe(false)
    const unavailable=await admitV3TechnicalRun(id,{
      requestId:'prepare-no-main-proof-03',expectedRevision:0,actor,payload:run,
    },()=>{throw new Error('not attested physical Plan/Owner')})
    expect(unavailable.ok).toBe(false)
    expect(readAggregate(id)?.v3TechnicalExecution).toBeUndefined()
  })
  test('forged Host, changed event, grant revoke and unrelated business edit fail closed',async()=>{
    const id='c2-ledger-proofs-3'
    await seed(id)
    const run=evidence(id,1)
    const prepared=await admitV3TechnicalRun(id,{
      requestId:'prepare-proofs-01',expectedRevision:0,actor,payload:run,
    },()=>{})
    expect(prepared.ok).toBe(true)
    const event=checkEvent(run,1)
    for(const [suffix,proof] of [
      ['missing',()=>({...host(),receipts:new Map()})],
      ['revoked',()=>({...host(),grantActive:false})],
      ['bad-grant',()=>({...host(),permissionGrantId:'other-grant'})],
    ] as const){
      const outcome=await recordV3TechnicalProposal(id,{
        requestId:event.eventId,expectedRevision:1,actor,payload:event,
      },proof)
      expect(outcome.ok).toBe(false)
    }
    const fake={...event,eventId:'f'.repeat(64)}
    const counterfeit=await recordV3TechnicalProposal(id,{
      requestId:fake.eventId,expectedRevision:1,actor,payload:fake,
    },()=>host())
    expect(counterfeit.ok).toBe(false)
    const other=await submitCommand(id,{
      type:'HumanEditedSourceAfterTechnicalStart',requestId:'unrelated-biz',
      expectedRevision:1,actor,payload:{},
    },()=>({summary:'Changing business after Run admission',mutate:draft=>{
      draft.caseV2.title='Changed after admission'
    }}))
    expect(other.ok).toBe(true)
    const stale=await recordV3TechnicalProposal(id,{
      requestId:event.eventId,expectedRevision:2,actor,payload:event,
    },()=>host())
    expect(stale.ok).toBe(false)
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(0)
  })
  test('non-identical command requestId cannot take ownership of a Host eventId', async () => {
    const id = 'c2-ledger-request-mismatch'
    await seed(id)
    const run = evidence(id, 1)
    expect((await admitV3TechnicalRun(id, {
      requestId: 'request-identity-admit', expectedRevision: 0, actor, payload: run,
    }, () => {})).ok).toBe(true)
    const event = checkEvent(run, 1)
    const denied = await recordV3TechnicalProposal(id, {
      requestId: 'different-request-id', expectedRevision: 1, actor, payload: event,
    }, () => host())
    expect(denied.ok).toBe(false)
    if (!denied.ok) expect(denied.message).toContain('requestId')
    expect(readAggregate(id)?.receiptLog.filter(r =>
      r.type === 'RecordV3TechnicalProposal')).toHaveLength(0)
  })

  test('unreceipted business mutations and forged source versions cannot bypass frozen input digest', async () => {
    const id = 'c2-ledger-tamper-4'
    await seed(id)
    const run = evidence(id, 1)
    expect((await admitV3TechnicalRun(id, {
      requestId:'admit-tamper-01',expectedRevision:0,actor,payload:run,
    },()=>{})).ok).toBe(true)
    const before = readAggregate(id)!
    expect(before.v3TechnicalExecution?.frozenInputDigest).toMatch(/^[a-f0-9]{64}$/)
    // An out-of-band writer tampers with policy-sensitive business data, but
    // does not bump revision or append a Receipt. Pure receipt scanning would
    // incorrectly accept this Host proposal; the frozen digest must detect it.
    before.caseV2.documents[0]!.contentHash = 'b'.repeat(64)
    writeAggregate(before)
    const attempt = checkEvent(run, 1)
    const denied = await recordV3TechnicalProposal(id, {
      requestId:attempt.eventId,expectedRevision:1,actor,payload:attempt,
    },()=>host())
    expect(denied.ok).toBe(false)
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(0)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
    expect(readAggregate(id)?.decisions).toHaveLength(0)
  })

  test('corrupt ledger missing exact CAS receipts is quarantined before any new proposal', async () => {
    const id = 'c2-ledger-corrupt-5'
    await seed(id)
    const run = evidence(id, 1)
    expect((await admitV3TechnicalRun(id,{
      requestId:'admit-corrupt-01',expectedRevision:0,actor,payload:run,
    },()=>{})).ok).toBe(true)
    const injected = readAggregate(id)!
    const fake = checkEvent(run, 1)
    injected.v3TechnicalExecution!.events.push({
      sequence: 1, eventId: fake.eventId,
      proposal: fake, committedAt: '2026-10-19T00:00:00Z',
    })
    // Simulated inconsistent disk copy: event exists but Receipt missing.
    writeAggregate(injected)
    const next = checkEvent(run,2)
    const denied = await recordV3TechnicalProposal(id,{
      requestId:next.eventId,expectedRevision:1,actor,payload:next,
    },()=>host())
    expect(denied.ok).toBe(false)
    if (!denied.ok) expect(denied.message).toContain('缺少对应 CAS 回执')
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(1)
    expect(readAggregate(id)?.caseV2.revision).toBe(1)
  })

  test('even a matching forged Host receipt cannot override stored physical byteHash', async () => {
    const id = 'c2-ledger-wrong-physical-6'
    await seed(id)
    const run = evidence(id, 1)
    expect((await admitV3TechnicalRun(id, {
      requestId:'admit-physical-01',expectedRevision:0,actor,payload:run,
    },()=>{})).ok).toBe(true)
    const fakeSource: SourceIdentity = {
      schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId: id, materialId: 'd1',
      documentVersionId: 'doc-v1', rawSha256: 'b'.repeat(64),
      parseRevision: 'parse-1', blockId: 'block-1',
      location: {kind:'paragraph',locator:'p1'},
    }
    const body = {
      schemaVersion: REVIEW_V3_EXECUTION_SCHEMA, run, sequence: 1,
      permissionGrantId:'main-grant-1',kind:'read' as const,
      hostReceiptId:'host-forged-physical',
      read:{source:fakeSource,extent:'block' as const},
    }
    const event: V3ExecutionProposal = {...body,eventId:executionProposalId(body)}
    const result = await recordV3TechnicalProposal(id,{
      requestId:event.eventId,expectedRevision:1,actor,payload:event,
    },()=>{
      const receipts = new Map<string,V3VerifiedHostReceipt>([[
        'host-forged-physical', {
          kind:'read',permissionGrantId:'main-grant-1',
          source:fakeSource,extent:'block',
        },
      ]])
      return {permissionGrantId:'main-grant-1',grantActive:true,receipts}
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('SHA256')
    expect(readAggregate(id)?.v3TechnicalExecution?.events).toHaveLength(0)
  })

})
