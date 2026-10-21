import { afterAll, describe, expect, test } from 'bun:test'
import { join } from 'node:path'
import { rmSync } from 'node:fs'
import type { Actor, ReviewCaseV2 } from '@profer/shared'
import { createAggregate, readAggregate } from './case-store-v2'
import { correctObservation, setEvidenceLink } from './application-service'
import { archiveMaterialVersionV3 } from './material-lifecycle-v3'
import { isWorkspaceRunStaleV2 } from './workspace-business-service-v2'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `review-v3-archive-c1-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

describe('C1 native CaseAggregate material archive / Receipt', () => {
  test('real typed commands preserve old fact and receipt, revoke validity, allow exact replay', async () => {
    const caseId = 'native-c1-archive'
    const caseV2 = {
      id: caseId, title: 'Native single-writer', templateId: 't', templateVersion: 1,
      objectType: 'generic-object', stage: 'submitted', caseFields: {},
      subjects: [{ id: 'subject-1', title: 'Entry', type: 'item', fields: {},
        sourceRefs: [], correction: 'user-confirmed', status: 'identified' }],
      documents: [{ documentId: 'd', versionId: 'd-v1', contentHash: 'a'.repeat(64),
        role: 'evidence', fileName: 'proof.txt', mimeType: 'text/plain', sizeBytes: 1,
        assetPath: 'source-docs/d-v1/proof.txt', parseRevision: 1, parseStatus: 'parsed',
        blocks: [], usage: 'read', active: true, manualReadReceipt: {
          actorId: actor.actorId, reason: '核对原件', at: '2026-10-01T00:00:00Z',
        } }],
      revision: 0, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
    } as unknown as ReviewCaseV2
    await createAggregate(caseId, caseV2)
    const obs = await correctObservation(caseId, { requestId: 'fact-4', expectedRevision: 0, actor,
      payload: { subjectId: 'subject-1', fieldKey: 'declaredScore', value: { kind: 'number', value: 4 },
        sourceRefs: [{ caseId, documentVersionId: 'd-v1', parseRevision: 1, location: { kind: 'file' } }],
        reason: '原始材料确认分数' } })
    expect(obs.ok).toBe(true)
    const link = await setEvidenceLink(caseId, { requestId: 'bind-old', expectedRevision: 1, actor,
      payload: { documentVersionId: 'd-v1', subjectIds: ['subject-1'], supportsFact: 'score-4', linkedBy: 'user' } })
    expect(link.ok).toBe(true)
    const archive = await archiveMaterialVersionV3(caseId, { requestId: 'archive-old',
      expectedRevision: 2, actor, payload: { documentVersionId: 'd-v1', reason: '已替换原材料' } })
    expect(archive.ok).toBe(true)
    const final = readAggregate(caseId)!
    expect(final.caseV2.revision).toBe(3)
    expect(final.caseV2.documents[0]?.active).toBe(false)
    expect(final.caseV2.documents[0]?.manualReadReceipt?.reason).toBe('核对原件')
    expect(final.observations[0]?.value).toEqual({ kind: 'number', value: 4 })
    expect(final.observations[0]?.confirmed).toBe(false)
    expect(final.evidenceLinks[0]?.status).toBe('rejected')
    expect(final.sourceValidityRevocations?.[0]?.previouslyConfirmedObservationIds).toEqual([final.observations[0]!.id])
    expect(final.receiptLog.map((r) => r.type)).toEqual(['CorrectObservation','SetEvidenceLink','ArchiveMaterialVersion'])
    const replay = await archiveMaterialVersionV3(caseId, { requestId: 'archive-old',
      expectedRevision: 2, actor, payload: { documentVersionId: 'd-v1', reason: '已替换原材料' } })
    expect(replay.ok).toBe(true)
    expect(readAggregate(caseId)?.caseV2.revision).toBe(3)
    const second = await archiveMaterialVersionV3(caseId, { requestId: 'archive-again',
      expectedRevision: 3, actor, payload: { documentVersionId: 'd-v1', reason: '绕过已失效材料' } })
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.code).toBe('INVALID_TRANSITION')
    const badLink = await setEvidenceLink(caseId, { requestId: 'restore-old-link',
      expectedRevision: 3, actor, payload: { documentVersionId: 'd-v1',
        subjectIds: ['subject-1'], supportsFact: 'score-4', linkedBy: 'user' } })
    expect(badLink.ok).toBe(false)
    if (!badLink.ok) expect(badLink.code).toBe('STALE_INPUT')
    expect(isWorkspaceRunStaleV2(readAggregate(caseId)!, 'legacy-run-rev')).toBe(true)
  })
})
