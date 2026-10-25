import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, CheckResult, ReviewRunV2 } from '@profer/shared'
import { assessT03RunAction, type T03TrustedRunEvidence } from './review-v3-core-t03-run-gate'

const document = {
  documentId: 'doc-lab', versionId: 'version-1', contentHash: 'sha-1',
  active: true, parseRevision: 1, parseStatus: 'parsed',
}
function aggregate(overrides: Record<string, unknown> = {}): CaseAggregateV2 {
  return {
    caseV2: {
      id: 'case-lab', templateId: 'lab', templateVersion: 1,
      documents: [document], revision: 4, stage: 'reviewing',
      subjects: [], caseFields: {},
    },
    supplements: [], decisions: [], tasks: [],
    ...overrides,
  } as unknown as CaseAggregateV2
}
function check(
  id: string,
  status: CheckResult['status'] = 'compliant',
  reason = '经明确证据核验',
): CheckResult {
  return {
    checkId: id, ruleId: 'rule-'+id, target: { scope: 'case', subjectIds: [] },
    status, reason, sourceRefs: [], executedBy: 'deterministic',
    executedAt: '2026-10-21T00:00:00.000Z',
  }
}
function run(
  checks: CheckResult[] = [check('people')],
  overrides: Record<string, unknown> = {},
): ReviewRunV2 {
  return {
    id: 'run-real-lab-01', caseId: 'case-lab', templateId: 'lab', templateVersion: 1,
    inputManifest: {
      hash: 'input-hash-1', templateVersion: 1, policyVersions: [],
      documentVersions: [document],
      observationIds: [], evidenceLinkIds: [],
    },
    status: 'completed', checks, opinions: [], checkpoints: [],
    coverage: {
      documents: [], plannedChecks: checks.length, completedChecks: checks.length,
      effectiveVerdicts: checks.filter((c) => c.status === 'compliant' || c.status === 'non-compliant').length,
      pendingChecks: 0,
    },
    diagnostics: [], startedAt: '2026-10-21T00:00:00.000Z',
    ...overrides,
  } as ReviewRunV2
}
const evidence = (patch: Partial<T03TrustedRunEvidence> = {}): T03TrustedRunEvidence =>
  ({ inputSnapshotFresh: true, ...patch })
const gate = (
  action: 'stage-pass' | 'final-reject' | 'return-for-supplement' | 'return-to-previous-stage',
  reviewRun: ReviewRunV2 | undefined = run(),
  data: CaseAggregateV2 = aggregate(),
  proof: T03TrustedRunEvidence | undefined = evidence(),
) => assessT03RunAction({ aggregate: data, run: reviewRun, action, evidence: proof })

describe('V3 R01 T03 Run evidence gate (pure business contract)', () => {
  test('real completed matching Run may stage-pass with effective compliant checks', () => {
    const result = gate('stage-pass')
    expect(result.allowed).toBe(true)
    expect(result.runCurrent).toBe(true)
    expect(result.blockers).toEqual([])
  })

  test('21-person non-compliance may be rejected or returned but not silently passed', () => {
    const invalid = run([check('headcount', 'non-compliant', '人数 21 超过 20')])
    expect(gate('stage-pass', invalid).allowed).toBe(false)
    expect(gate('stage-pass', invalid).nonCompliantCheckIds).toEqual(['headcount'])
    expect(gate('final-reject', invalid).allowed).toBe(true)
    expect(gate('return-to-previous-stage', invalid).allowed).toBe(true)
  })

  test('only Main-confirmed template exception can permit stage-pass of non-compliant result', () => {
    const invalid = run([check('headcount', 'non-compliant')])
    expect(gate('stage-pass', invalid, aggregate(), evidence({
      exceptions: [{
        checkId: 'headcount', authority: 'template-allowed-exception',
        policyVersionId: 'policy@1', actorId: 'trusted-local-teacher',
        reason: '已核验模板中的具名例外',
      }],
    })).allowed).toBe(true)
    expect(gate('stage-pass', invalid, aggregate(), evidence({
      exceptions: [{
        checkId: 'headcount', authority: 'template-allowed-exception',
        policyVersionId: '', actorId: 'teacher', reason: '',
      }],
    })).allowed).toBe(false)
  })

  test('new, replaced, deleted, or hash-changed document versions stale the Run', () => {
    const added = aggregate({ caseV2: { ...aggregate().caseV2, documents: [
      document, { ...document, versionId: 'version-2', contentHash: 'sha-2' },
    ] } })
    const replaced = aggregate({ caseV2: { ...aggregate().caseV2, documents: [
      { ...document, versionId: 'version-2', contentHash: 'sha-2' },
    ] } })
    const changed = aggregate({ caseV2: { ...aggregate().caseV2, documents: [
      { ...document, contentHash: 'changed-sha' },
    ] } })
    for (const data of [added, replaced, changed]) {
      const result = gate('stage-pass', run(), data)
      expect(result.allowed).toBe(false)
      expect(result.blockers.join()).toContain('原件')
    }
  })

  test('a different documentId cannot reuse an old versionId and hash', () => {
    const moved = aggregate({ caseV2: { ...aggregate().caseV2, documents: [
      { ...document, documentId: 'another-document-id' },
    ] } })
    expect(gate('stage-pass', run(), moved).allowed).toBe(false)
  })

  test('effective verdict counter must match actual compliant and non-compliant checks', () => {
    const bad = run([check('people')], { coverage: {
      documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 0, pendingChecks: 0,
    } })
    expect(gate('stage-pass', bad).allowed).toBe(false)
  })

  test('full snapshot validation is Main-owned: observation, field, parse revisions also stale Run', () => {
    expect(gate('stage-pass', run(), aggregate(), evidence({ inputSnapshotFresh: false })).allowed).toBe(false)
    // 显式 undefined 会被默认参数替换，因此直接调用被测函数来表达「Main 没有提供输入快照」
    expect(assessT03RunAction({ aggregate: aggregate(), run: run(), action: 'stage-pass', evidence: undefined }).allowed).toBe(false)
    expect(assessT03RunAction({ aggregate: aggregate(), run: run(), action: 'stage-pass' }).allowed).toBe(false)
  })

  test('Run identity and template version must agree with case', () => {
    const different = run(undefined, { caseId: 'other-case' })
    expect(gate('stage-pass', different).allowed).toBe(false)
    const legacyFake = run(undefined, { id: 'run@rev-4' })
    expect(gate('stage-pass', legacyFake).allowed).toBe(false)
    expect(gate('final-reject', run(undefined, { templateVersion: 9 })).allowed).toBe(false)
  })

  test('frozen CanonicalPlan requires Main-recorded fingerprint and complete binding check IDs', () => {
    const data = aggregate({ canonicalPlan: {
      schemaVersion: 1, planId: 'plan-real', fingerprint: 'plan-hash',
      templateId: 'lab', templateVersion: '1',
      moduleDigests: [], bindings: [],
    } })
    expect(gate('stage-pass', run(), data).allowed).toBe(false)
    expect(gate('stage-pass', run(), data, evidence({
      runPlanFingerprint: 'other-plan', expectedCheckIds: ['people'],
    })).allowed).toBe(false)
    expect(gate('stage-pass', run(), data, evidence({
      runPlanFingerprint: 'plan-hash', expectedCheckIds: ['unknown-check'],
    })).allowed).toBe(false)
    expect(gate('stage-pass', run(), data, evidence({
      runPlanFingerprint: 'plan-hash', expectedCheckIds: ['people'],
    })).allowed).toBe(true)
  })

  test('zero-check Run or missing/duplicate checks cannot become all-clear by default', () => {
    expect(gate('stage-pass', run([])).allowed).toBe(false)
    expect(gate('stage-pass', run([]), aggregate(), evidence({ manualOnlyTemplate: true })).allowed).toBe(true)
    expect(gate('stage-pass', run([check('dup'), check('dup')])).allowed).toBe(false)
    expect(gate('stage-pass', run([check('people')], {
      coverage: { documents: [], plannedChecks: 2, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 1 },
    })).allowed).toBe(false)
  })

  test('pending, unexecuted, failed, and partially-completed cannot stage-pass', () => {
    for (const status of ['awaiting-confirmation','awaiting-supplement','not-executed','execution-failed'] as const) {
      expect(gate('stage-pass', run([check('c1', status)])).allowed).toBe(false)
    }
    expect(gate('stage-pass', run([check('people')], { status: 'partially-completed' })).allowed).toBe(false)
  })

  test('a pending check with a genuine human disposition can pass without changing immutable Run', () => {
    const pending = run([check('c1', 'awaiting-confirmation')], {
      coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 0, pendingChecks: 1 },
    })
    const data = aggregate({ dispositions: [{
      findingKey: 'c1', runId: 'run-real-lab-01',
      disposition: 'human-confirmed-compliant',
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
      reason: '根据实际原件已具名核验符合', at: '2026-10-21T00:00:00.000Z',
    }] })
    expect(gate('stage-pass', pending, data).allowed).toBe(true)
    const staleDisposition = aggregate({ dispositions: [{
      ...data.dispositions[0], runId: 'older-run',
    }] })
    expect(gate('stage-pass', pending, staleDisposition).allowed).toBe(false)
  })

  test('not-applicable requires an explicit reason; an open supplement is still blocking', () => {
    expect(gate('stage-pass', run([check('n/a', 'not-applicable', '')])).allowed).toBe(false)
    expect(gate('stage-pass', run(), aggregate({ supplements: [{ id: 'sup-1', status: 'responded' }] })).allowed).toBe(false)
  })

  test('missing first Run permits a supplement request, not approval or final rejection', () => {
    // 同上：默认参数会把 undefined 变成 run()，直接调用才能表达「还没有第一次 Run」
    const noRun = (action: 'stage-pass' | 'final-reject' | 'return-for-supplement' | 'return-to-previous-stage') =>
      assessT03RunAction({ aggregate: aggregate(), run: undefined, action })
    expect(noRun('return-for-supplement').allowed).toBe(true)
    expect(noRun('stage-pass').allowed).toBe(false)
    expect(noRun('final-reject').allowed).toBe(false)
  })

  test('input order alone is irrelevant; full version/hash set is authoritative', () => {
    const second = { ...document, documentId: 'doc-extra', versionId: 'version-2', contentHash: 'sha-2' }
    const data = aggregate({ caseV2: { ...aggregate().caseV2, documents: [second, document] } })
    const originalRun = run(undefined, { inputManifest: {
      ...run().inputManifest, documentVersions: [document, second],
    } })
    expect(gate('stage-pass', originalRun, data).allowed).toBe(true)
  })

  test('Main can select only latest verifiably current Run, never a stale historical candidate', async () => {
    const { selectT03CurrentRun } = await import('./review-v3-core-t03-run-gate')
    const old = run(undefined, { id: 'run-old' })
    const changed = run(undefined, { id: 'run-stale', inputManifest: {
      ...run().inputManifest, documentVersions: [{ ...document, contentHash: 'obsolete-hash' }],
    } })
    const selected = selectT03CurrentRun({
      aggregate: aggregate(),
      runs: [old, changed],
      prove: () => evidence(),
    })
    expect(selected?.id).toBe('run-old')
    const missingProof = selectT03CurrentRun({
      aggregate: aggregate(), runs: [old], prove: () => undefined,
    })
    expect(missingProof).toBeUndefined()
  })

})
