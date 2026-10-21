import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, ReviewCaseV2 } from '@profer/shared'
import { emptyAggregate } from './case-store-v2'
import { currentSourceValidityBlockers, revokeCurrentSourceValidity } from './source-current-validity-v3'
import { computeRunInputHash } from './run-service-v2'

function fixture(): CaseAggregateV2 {
  const d = (versionId: string, active: boolean) => ({
    documentId: versionId, versionId, contentHash: 'a'.repeat(64),
    role: 'evidence' as const, fileName: versionId, mimeType: 'text/plain',
    sizeBytes: 3, assetPath: versionId, parseRevision: 1,
    parseStatus: 'parsed' as const, blocks: [], usage: 'read' as const, active,
  })
  const caseV2 = {
    id: 'current-validity-c1', templateId: 't1', templateVersion: 1,
    objectType: 'generic-object', title: 'Source cascade',
    caseFields: {}, subjects: [{ id: 's1', title: 'Item', type: 'item', fields: {},
      sourceRefs: [], correction: 'user-confirmed', status: 'confirmed' }],
    documents: [d('old', true), d('new', true)], stage: 'reviewing',
    revision: 4, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
  } as unknown as ReviewCaseV2
  const aggregate = emptyAggregate(caseV2)
  aggregate.observations = [
    { id: 'obs-old', subjectId: 's1', fieldKey: 'declaredScore', value: { kind: 'number', value: 4 },
      sourceRefs: [{ caseId: caseV2.id, documentVersionId: 'old', parseRevision: 1, location: { kind: 'file' } }],
      confirmed: true, extractedBy: 'user', createdAt: '2026-10-01T00:00:00Z' },
    { id: 'obs-new', subjectId: 's1', fieldKey: 'other', value: { kind: 'text', value: 'current' },
      sourceRefs: [{ caseId: caseV2.id, documentVersionId: 'new', parseRevision: 1, location: { kind: 'file' } }],
      confirmed: true, extractedBy: 'user', createdAt: '2026-10-01T00:00:00Z' },
  ]
  aggregate.evidenceLinks = [
    { id: 'link-old', documentVersionId: 'old', subjectId: 's1', supportsFact: 'score', status: 'confirmed', linkedBy: 'user' },
    { id: 'link-new', documentVersionId: 'new', subjectId: 's1', supportsFact: 'other', status: 'confirmed', linkedBy: 'user' },
  ]
  return aggregate
}

describe('C1 / ARCH-003 source-current-validity', () => {
  test('archive keeps original source/value but revokes current confirmation and link', () => {
    const caseRecord = fixture()
    const beforeHash = computeRunInputHash(caseRecord.caseV2, caseRecord.observations as unknown as Array<Record<string, unknown>>, caseRecord.evidenceLinks as unknown as Array<Record<string, unknown>>)
    caseRecord.caseV2.documents[0]!.active = false
    expect(currentSourceValidityBlockers(caseRecord)).toContain('observation:obs-old')
    expect(currentSourceValidityBlockers(caseRecord)).toContain('evidence:link-old')
    revokeCurrentSourceValidity(caseRecord, new Set(['old']), 'archive')
    expect(caseRecord.observations.find((x) => x.id === 'obs-old')).toMatchObject({
      confirmed: false, sourceRefs: [{ documentVersionId: 'old' }], value: { kind: 'number', value: 4 },
    })
    expect(caseRecord.observations.find((x) => x.id === 'obs-new')?.confirmed).toBe(true)
    expect(caseRecord.evidenceLinks.find((x) => x.id === 'link-old')?.status).toBe('rejected')
    expect(caseRecord.evidenceLinks.find((x) => x.id === 'link-new')?.status).toBe('confirmed')
    expect(caseRecord.sourceValidityRevocations?.[0]).toMatchObject({
      reason: 'archive', documentVersionId: 'old', previouslyConfirmedObservationIds: ['obs-old'],
      previouslyConfirmedEvidenceLinkIds: ['link-old'],
    })
    expect(currentSourceValidityBlockers(caseRecord)).toEqual([])
    const afterHash = computeRunInputHash(caseRecord.caseV2, caseRecord.observations as unknown as Array<Record<string, unknown>>, caseRecord.evidenceLinks as unknown as Array<Record<string, unknown>>)
    expect(afterHash).not.toBe(beforeHash)
    revokeCurrentSourceValidity(caseRecord, new Set(['old']), 'archive')
    expect(caseRecord.sourceValidityRevocations).toHaveLength(1)
  })
  test('an unattributed current confirmation fails closed when a material version is retired', () => {
    const caseRecord = fixture()
    caseRecord.observations.push({
      id: 'unattributed', subjectId: 's1', fieldKey: 'declaredScore', value: { kind: 'number', value: 9 },
      sourceRefs: [], extractedBy: 'user', confirmed: true, createdAt: '2026-10-01T00:00:00Z',
    })
    caseRecord.caseV2.documents[0]!.active = false
    revokeCurrentSourceValidity(caseRecord, new Set(['old']), 'replace')
    expect(caseRecord.observations.find((x) => x.id === 'unattributed')?.confirmed).toBe(false)
    expect(caseRecord.sourceValidityRevocations?.[0]?.previouslyConfirmedObservationIds).toContain('unattributed')
  })
  test('old writer without revocation metadata cannot pass the read-side guard', () => {
    const caseRecord = fixture()
    caseRecord.caseV2.documents[0]!.active = false
    expect(currentSourceValidityBlockers(caseRecord)).toContain('observation:obs-old')
  })
})
