import { describe, expect, test } from 'bun:test'
import { proposeT03SubjectMerge, proposeT03SubjectSplit } from './review-v3-t03-subject-restructure'
import type { CaseAggregateV2, ReviewRunV2 } from '@profer/shared'
import {
  parseT03Correction, planT03Recheck, projectT03Evidence, projectT03Facts, proposedT03EvidenceLinks,
  resolveT03CorrectionRefs,
} from './review-v3-t03-fact-workflow'

function fixture(): CaseAggregateV2 {
  const document = (id: string, active = true) => ({
    documentId: id, versionId: id, role: 'evidence', fileName: id, parseRevision: 1, active,
  })
  const ref = (id: string) => ({
    caseId: 'case1', documentVersionId: id, parseRevision: 1, location: { kind: 'file' },
  })
  return {
    caseV2: {
      id: 'case1', subjects: [{ id: 'alice', title: '张同学', type: 'item', status: 'identified', correction: 'user-confirmed', sourceRefs: [], fields: { score: {kind: 'number', value: 0} } }, { id: 'bob', title: '另一位张同学', type: 'item', status: 'identified', correction: 'user-confirmed', sourceRefs: [], fields: { score: {kind: 'number', value: 6} } }],
      documents: [document('certificate'), document('notice'), document('old', false)],
    },
    observations: [
      { id: 'human-0', subjectId: 'alice', fieldKey: 'score', value: { kind: 'number', value: 0 },
        sourceRefs: [ref('certificate')], extractedBy: 'user', confirmed: true, createdAt: '2026-10-01' },
      { id: 'ai-8', subjectId: 'alice', fieldKey: 'score', value: { kind: 'number', value: 8 },
        sourceRefs: [ref('certificate')], extractedBy: 'ai', confirmed: false, createdAt: '2026-10-02' },
      { id: 'human-old', subjectId: 'bob', fieldKey: 'score', value: { kind: 'number', value: 6 },
        sourceRefs: [ref('old')], extractedBy: 'user', confirmed: true, createdAt: '2026-10-03' },
    ],
    evidenceLinks: [
      { id: 'a1', documentVersionId: 'certificate', subjectId: 'alice', supportsFact: 'score', status: 'candidate', linkedBy: 'ai' },
      { id: 'b1', documentVersionId: 'certificate', subjectId: 'bob', supportsFact: 'score', status: 'candidate', linkedBy: 'ai' },
      { id: 'b2', documentVersionId: 'notice', subjectId: 'bob', supportsFact: 'score', status: 'confirmed', linkedBy: 'user' },
    ],
  } as unknown as CaseAggregateV2
}

describe('T03 real fact/evidence review', () => {
  test('0 remains the human-confirmed value; newer AI guess is review-only; old source confirmation expires', () => {
    const facts = projectT03Facts(fixture())
    const alice = facts.find(f => f.subjectId === 'alice')!
    const bob = facts.find(f => f.subjectId === 'bob')!
    expect(alice.current?.value).toEqual({ kind: 'number', value: 0 })
    expect(alice.needsReview).toBe(true)
    expect(alice.reasons).toContain('新提取值与已确认值不同')
    expect(bob.current).toBeNull()
    expect(bob.sourceState).toBe('stale')
    expect(parseT03Correction('0', { kind: 'number', value: 10 })).toEqual({ kind: 'number', value: 0 })
    expect(() => parseT03Correction('', { kind: 'number', value: 10 })).toThrow()
    expect(parseT03Correction('2024-02-29', { kind: 'date', value: '2023-02-01' })).toEqual({ kind: 'date', value: '2024-02-29' })
    expect(() => parseT03Correction('2023-02-29', { kind: 'date', value: '2023-02-01' })).toThrow()
  })
  test('A05: a superseded old confirmation cannot revive after a newer human revision goes stale', () => {
    const aggregate = fixture()
    aggregate.evidenceLinks = []
    aggregate.observations = [
      { id: 'old', subjectId: 'alice', fieldKey: 'score', value: { kind: 'number', value: 2 },
        sourceRefs: [{ caseId: 'case1', documentVersionId: 'certificate', parseRevision: 1, location: { kind: 'file' } }],
        extractedBy: 'user', confirmed: true, createdAt: '2026-10-01' },
      { id: 'correction', subjectId: 'alice', fieldKey: 'score', value: { kind: 'number', value: 0 },
        sourceRefs: [{ caseId: 'case1', documentVersionId: 'old', parseRevision: 1, location: { kind: 'file' } }],
        extractedBy: 'user', confirmed: true, supersedesObservationId: 'old', createdAt: '2026-10-03' },
    ]
    const stale = projectT03Facts(aggregate)[0]!
    expect(stale.current).toBeNull()
    expect(stale.sourceState).toBe('stale')
    expect(stale.history.map(item => item.id)).toEqual(['old', 'correction'])

    aggregate.observations.push({
      id: 'reconfirmed', subjectId: 'alice', fieldKey: 'score', value: { kind: 'number', value: 0 },
      sourceRefs: [{ caseId: 'case1', documentVersionId: 'certificate', parseRevision: 1, location: { kind: 'file' } }],
      extractedBy: 'user', confirmed: true, supersedesObservationId: 'correction', createdAt: '2026-10-04',
    })
    const fresh = projectT03Facts(aggregate)[0]!
    expect(fresh.current?.id).toBe('reconfirmed')
    expect(fresh.needsReview).toBe(false)
    expect(fresh.history).toHaveLength(3)
  })
  test('A05: confirmation preserves precise source positions and refuses old revisions', () => {
    const aggregate = fixture()
    const located = { caseId: 'case1', documentVersionId: 'certificate', parseRevision: 1,
      location: { kind: 'sheet-cell' as const, sheet: 'Sheet1', row: 2, column: 'B' }, quote: '等级：优秀' }
    expect(resolveT03CorrectionRefs(aggregate, [located])).toEqual([located])
    expect(resolveT03CorrectionRefs(aggregate, [{ documentVersionId: 'notice' }])[0]?.location).toEqual({ kind: 'file' })
    expect(() => resolveT03CorrectionRefs(aggregate, [{ ...located, parseRevision: 0 }])).toThrow('旧解析版本')
    expect(() => resolveT03CorrectionRefs(aggregate, [{ ...located, caseId: 'another' }])).toThrow('其他案卷')
    expect(() => resolveT03CorrectionRefs(aggregate, [{ documentVersionId: 'old' }])).toThrow('已停用')
  })
  test('same certificate across two people requires independent attribution, never auto-confirm', () => {
    const aggregate = fixture()
    const cert = projectT03Evidence(aggregate).find(e => e.documentVersionId === 'certificate')!
    expect(cert.ambiguousSubjectIds).toEqual(['alice', 'bob'])
    const links = proposedT03EvidenceLinks('notice', ['alice', 'bob', 'alice'], 'award',
      aggregate.evidenceLinks)
    expect(links).toHaveLength(2)
    expect(links.every(link => link.status === 'candidate')).toBe(true)
    const withRunCandidate = projectT03Evidence(aggregate, [{
      subjectId: 'alice', fieldKey: 'award', value: { kind: 'text', value: 'award' },
      sourceRefs: [{ caseId: 'case1', documentVersionId: 'notice', parseRevision: 1,
        location: { kind: 'file' } }],
    }]).find(doc => doc.documentVersionId === 'notice')!
    expect(withRunCandidate.suggestions).toEqual([{
      documentVersionId: 'notice', subjectId: 'alice', supportsFact: 'award', status: 'candidate',
    }])
    expect(withRunCandidate.ambiguousSubjectIds).toContain('bob')
    expect(withRunCandidate.ambiguousSubjectIds).toContain('alice')
  })
  test('correction/source retirement picks only dependent old checks, preserves immutable run', () => {
    const aggregate = fixture()
    const run = {
      inputManifest: { effectiveRuleDependencies: [
        { ruleId: 'score-rule', fieldKeys: ['score'] },
        { ruleId: 'date-rule', fieldKeys: ['eventDate'] },
      ] },
      checks: [
        { checkId: 'alice-score', ruleId: 'score-rule', target: { scope: 'subject', subjectIds: ['alice'] }, sourceRefs: [] },
        { checkId: 'bob-score', ruleId: 'score-rule', target: { scope: 'subject', subjectIds: ['bob'] }, sourceRefs: [] },
        { checkId: 'alice-date', ruleId: 'date-rule', target: { scope: 'subject', subjectIds: ['alice'] }, sourceRefs: [] },
      ],
    } as unknown as ReviewRunV2
    const impact = planT03Recheck(aggregate, run, { subjectIds: ['alice'], fieldKeys: ['score'] })
    expect(impact.affectedCheckIds).toEqual(['alice-score'])
    const retired = planT03Recheck(aggregate, run, { documentVersionIds: ['old'] })
    expect(retired.affectedSubjectIds).toContain('bob')
    expect(retired.affectedCheckIds).toContain('bob-score')
    expect(run.checks).toHaveLength(3)
  })
  test('split/merge proposes one atomic source-preserving change, leaves originals intact', () => {
    const aggregate = fixture()
    const split = proposeT03SubjectSplit(aggregate, null, {
      operationId: 'split-request-1', subjectId: 'alice', now: '2026-10-21',
      parts: [
        { id: 'alice-award', title: '获奖事项', fieldKeys: ['score'], evidenceLinkIds: ['a1'] },
        { id: 'alice-other', title: '其他事项', fieldKeys: [], evidenceLinkIds: [], sourceRefs: [
          { caseId: 'case1', documentVersionId: 'notice', parseRevision: 1, location: { kind: 'file' } },
        ] },
      ],
    })
    expect(split.blockedReasons).toEqual([])
    expect(split.proposedSubjects).toHaveLength(2)
    expect(split.proposedObservations.every(ob => !ob.confirmed)).toBe(true)
    expect(split.proposedEvidenceLinks[0]?.status).toBe('candidate')
    expect(aggregate.caseV2.subjects).toHaveLength(2)
    expect(aggregate.evidenceLinks.find(link => link.id === 'a1')?.status).toBe('candidate')
    const merge = proposeT03SubjectMerge(aggregate, null, {
      operationId: 'merge-request-1', subjectIds: ['alice', 'bob'],
      newSubjectId: 'same-entity', title: '核对后的同一事项', now: '2026-10-21',
    })
    expect(merge.blockedReasons).toContain('合并字段存在冲突，必须人工确认：score')
    expect(merge.proposedSubjects[0]!.fields.score).toBeUndefined()
    expect(merge.proposedEvidenceLinks.every(link => link.status === 'candidate')).toBe(true)
  })
  test('A05: merge cannot conceal conflicting confirmed observations behind equal subject fields', () => {
    const aggregate = fixture()
    aggregate.caseV2.subjects[1]!.fields.score = { kind: 'number', value: 0 }
    aggregate.observations[2] = {
      ...aggregate.observations[2]!, value: { kind: 'number', value: 6 },
      sourceRefs: [{ caseId: 'case1', documentVersionId: 'notice', parseRevision: 1, location: { kind: 'file' } }],
    }
    const merged = proposeT03SubjectMerge(aggregate, null, {
      operationId: 'merge-conflict', subjectIds: ['alice', 'bob'],
      newSubjectId: 'combined', title: '同一事项',
    })
    expect(merged.blockedReasons).toContain('合并字段存在冲突，必须人工确认：score')
    expect(merged.proposedSubjects[0]!.fields.score).toBeUndefined()
  })

})
