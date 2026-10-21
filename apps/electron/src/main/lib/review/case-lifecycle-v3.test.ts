import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor, ReviewRunV2 } from '@profer/shared'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'
import { getCase, listCases, saveCase, deleteCase } from './case-store'
import { readAggregate, submitCommand, writeAggregate } from './case-store-v2'
import { ensureWorkspaceAggregateV2, syncWorkspaceProjectionV2 } from './workspace-service-v2'
import { archiveReviewCaseV3, restoreReviewCaseV3 } from './case-lifecycle-v3'
import { preparePiReviewRunV2 } from './pi-case-review-service'
import { runReviewCaseV2 } from './run-service-v2'
import { saveRunV2 } from './run-store-v2'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c1-case-archive-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))
const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const intent = (id: string, revision: number, reason = '用户明确要求归档') => ({
  requestId: id, expectedRevision: revision, actor, payload: { reason },
})
async function seed(id: string) {
  saveCase({ ...buildDemoCase(), id, title: 'Proof retained' })
  return ensureWorkspaceAggregateV2(id)
}

describe('C1 authoritative reversible Case archive', () => {
  test('archive is exactly one Case CAS + Receipt; repeated same intent is replay, not erase', async () => {
    const id = 'v3-archive-cas-replay'
    const initial = await seed(id)
    const fileNames = initial.caseV2.documents.map(d => d.versionId)
    const c = intent('archive-1', initial.caseV2.revision)
    const first = await archiveReviewCaseV3(id, c)
    expect(first.ok).toBe(true)
    const saved = readAggregate(id)!
    expect(saved.caseV2.stage).toBe('archived')
    expect(saved.caseV2.revision).toBe(initial.caseV2.revision + 1)
    expect(saved.caseArchive).toMatchObject({
      previousStage: initial.caseV2.stage, archivedBy: actor.actorId, reason: c.payload.reason,
    })
    expect(saved.receiptLog.at(-1)).toMatchObject({
      type: 'ArchiveReviewCaseV3', requestId: 'archive-1', actor,
    })
    expect(saved.caseV2.documents.map(d => d.versionId)).toEqual(fileNames)
    expect(getCase(id)).toBeUndefined()
    expect(listCases().some(x => x.id === id)).toBe(false)
    expect(() => deleteCase(id)).toThrow('禁止通过旧版删除入口')
    const bytes = JSON.stringify(saved)
    const replay = await archiveReviewCaseV3(id, c)
    expect(replay.ok).toBe(true)
    expect(JSON.stringify(readAggregate(id))).toBe(bytes)
    const collision = await archiveReviewCaseV3(id, { ...c, payload: { reason: '故意改换同一 requestId 的载荷' } })
    expect(collision).toMatchObject({ ok: false, code: 'REQUEST_ID_COLLISION' })
    expect(JSON.stringify(readAggregate(id))).toBe(bytes)
  })

  test('archived Case blocks all normal business commands, legacy save and Pi/V2 Run', async () => {
    const id = 'v3-archive-no-resurrection'
    const initial = await seed(id)
    const a = await archiveReviewCaseV3(id, intent('archive-locked', initial.caseV2.revision))
    expect(a.ok).toBe(true)
    const snap = JSON.stringify(readAggregate(id))
    const blocked = await submitCommand(id, {
      requestId: 'mutate-while-archive', actor, expectedRevision: initial.caseV2.revision + 1,
      type: 'UpdateFields', payload: { label: 'forged' },
    }, () => ({ summary: 'must not run', mutate: draft => { draft.caseV2.title = 'WRONG' } }))
    expect(blocked).toMatchObject({ ok: false, code: 'INVALID_TRANSITION' })
    expect(() => saveCase({ ...buildDemoCase(), id, title: 'resurrect via V1' })).toThrow('原生审核案卷禁止')
    expect((await syncWorkspaceProjectionV2(id)).caseV2.stage).toBe('archived')
    await expect(runReviewCaseV2(readAggregate(id)!.caseV2, {} as never, {} as never))
      .rejects.toThrow('已经归档')
    expect(() => preparePiReviewRunV2({
      caseId: id, sessionId: 'synthetic-session', turnId: 'synthetic-turn',
    })).toThrow('已经归档')
    expect(JSON.stringify(readAggregate(id))).toBe(snap)
  })

  test('restore is CAS and never re-approves old stage; archive and restore retain both receipts', async () => {
    const id = 'v3-archive-restore-draft'
    const initial = await seed(id)
    const decided = { ...initial, caseV2: { ...initial.caseV2, stage: 'decided' as const } }
    writeAggregate(decided)
    const a = await archiveReviewCaseV3(id, intent('archive-decided', decided.caseV2.revision))
    expect(a.ok).toBe(true)
    const archived = readAggregate(id)!
    const stale = await restoreReviewCaseV3(id, intent('restore-stale', decided.caseV2.revision))
    expect(stale).toMatchObject({ ok: false, code: 'VERSION_CONFLICT' })
    expect(JSON.stringify(readAggregate(id))).toBe(JSON.stringify(archived))
    const restored = await restoreReviewCaseV3(id, intent('restore-1', archived.caseV2.revision, '用户确认恢复后重新审核'))
    expect(restored.ok).toBe(true)
    const now = readAggregate(id)!
    expect(now.caseV2.stage).toBe('draft')
    expect(now.caseV2.revision).toBe(archived.caseV2.revision + 1)
    expect(now.caseArchive).toMatchObject({
      previousStage: 'decided', restoredBy: actor.actorId,
      restoreReason: '用户确认恢复后重新审核',
    })
    expect(now.receiptLog.slice(-2).map(x => x.type)).toEqual(['ArchiveReviewCaseV3', 'RestoreReviewCaseV3'])
    expect(now.caseV2.documents.map(x => x.versionId)).toEqual(archived.caseV2.documents.map(x => x.versionId))
    expect(getCase(id)?.id).toBe(id)
    // A pre-archive decided snapshot must not resume after restore.
    await expect(runReviewCaseV2(decided.caseV2, {} as never, {} as never))
      .rejects.toThrow('旧快照禁止执行')
    const beforeReplay = JSON.stringify(now)
    const replay = await restoreReviewCaseV3(id, intent('restore-1', archived.caseV2.revision, '用户确认恢复后重新审核'))
    expect(replay.ok).toBe(true)
    expect(JSON.stringify(readAggregate(id))).toBe(beforeReplay)
    const second = await archiveReviewCaseV3(id, intent('archive-again', now.caseV2.revision))
    expect(second.ok).toBe(true)
    expect(readAggregate(id)?.receiptLog.slice(-3).map(x => x.type)).toEqual([
      'ArchiveReviewCaseV3', 'RestoreReviewCaseV3', 'ArchiveReviewCaseV3',
    ])
    expect(readAggregate(id)?.caseArchiveHistory).toHaveLength(1)
    expect(readAggregate(id)?.caseArchiveHistory?.[0]).toMatchObject({
      previousStage: 'decided', restoredBy: actor.actorId,
      restoreReason: '用户确认恢复后重新审核',
    })
  })

  test('active queued/running ReviewRun prevents archive until cancellation is durable', async () => {
    const id = 'v3-archive-refuses-running-run'
    const initial = await seed(id)
    const run = { id: 'case-run-still-running', caseId: id, startedAt: new Date().toISOString(), status: 'running' } as ReviewRunV2
    saveRunV2(run)
    const before = JSON.stringify(readAggregate(id))
    const blocked = await archiveReviewCaseV3(id, intent('archive-running', initial.caseV2.revision))
    expect(blocked).toMatchObject({ ok: false, code: 'INVALID_TRANSITION' })
    expect(JSON.stringify(readAggregate(id))).toBe(before)
    saveRunV2({ ...run, status: 'cancelled' })
    const archived = await archiveReviewCaseV3(id, intent('archive-running', initial.caseV2.revision))
    expect(archived.ok).toBe(true)
    expect(readAggregate(id)?.caseV2.stage).toBe('archived')
  })

  test('invalid actor/reason and untracked old archive cannot write without correct check', async () => {
    const id = 'v3-archive-invalid-command'
    const initial = await seed(id)
    const before = JSON.stringify(readAggregate(id))
    await expect(archiveReviewCaseV3(id, {
      ...intent('archive-invalid', initial.caseV2.revision),
      actor: { actorId: 'renderer-teacher', actorSource: 'agent', role: 'teacher' },
    })).rejects.toThrow('缺少可信人员')
    await expect(archiveReviewCaseV3(id,
      intent('archive-empty-reason', initial.caseV2.revision, ''))).rejects.toThrow('有效理由')
    expect(JSON.stringify(readAggregate(id))).toBe(before)
    writeAggregate({ ...initial, caseV2: { ...initial.caseV2, stage: 'archived' } })
    const corrupted = JSON.stringify(readAggregate(id))
    const result = await restoreReviewCaseV3(id, intent('invalid-restore', initial.caseV2.revision))
    expect(result).toMatchObject({ ok: false, code: 'INVALID_TRANSITION' })
    expect(JSON.stringify(readAggregate(id))).toBe(corrupted)
  })
})
