import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { REVIEW_IPC_CHANNELS, type ReviewCaseV2, type TemplateVersion } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { registerReviewIpc } from './review-ipc'
import { createAggregate, readAggregate } from './case-store-v2'
import { saveDraft, publishTemplate } from './template-store'

const root = join(import.meta.dir, '../../../../../../work/tmp', `v3-c0-ipc-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers
const frame = { id: 1 }
const sender = { id: 91, mainFrame: frame, isDestroyed: () => false }
const event = { sender, senderFrame: frame }
const actor = { actorId: 'renderer-custom-id', actorSource: 'local', role: 'reviewer' }
const spoof = { actorId: 'spoof', actorSource: 'school', role: 'teacher' }
const caseId = 'v3-c0-local-case'
function invoke(channel: string, input: unknown, ev: unknown = event): unknown {
  const handler = handlers.get(channel)
  if (!handler) throw new Error(`Missing handler ${channel}`)
  return handler(ev, input)
}
function command(requestId: string, expectedRevision: number, payload: unknown, claimedActor: unknown = actor) {
  return { requestId, expectedRevision, actor: claimedActor, payload }
}
afterAll(() => { setMainWindow(null); rmSync(root, { recursive: true, force: true }) })

describe('C0 four actual Main IPC handler boundaries (synthetic harness)', () => {
  test('four forged school-teacher commands fail without any Receipt/revision change', async () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    registerReviewIpc()
    const c: ReviewCaseV2 = {
      id: caseId, templateId: 't', templateVersion: 1, title: 'synthetic', objectType: 'person',
      caseFields: {}, subjects: [{ id: 's1', type: 'item', title: 'item', fields: {}, sourceRefs: [],
        correction: 'user-confirmed', status: 'identified' }], documents: [{
        documentId: 'd1', versionId: 'd1', contentHash: 'a'.repeat(64),
        role: 'evidence', fileName: 'c0-harness-evidence.txt',
        mimeType: 'text/plain', sizeBytes: 1, assetPath: 'source-docs/d1/c0-harness-evidence.txt',
        parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'registered', active: true,
      }],
      stage: 'draft', revision: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    await createAggregate(caseId, c)
    const before = JSON.stringify(readAggregate(caseId))
    const inputs = [
      [REVIEW_IPC_CHANNELS.CREATE_CASE_V2, { caseId: 'v3-c0-spoof-case', templateId: 't', version: 1,
        payload: { title: 'synthetic', fieldValues: {}, subjects: [] }, actor: spoof }],
      [REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, { caseId, command: command('sp1', 0, { caseFieldValues: { x: 'y' } }, spoof) }],
      [REVIEW_IPC_CHANNELS.CORRECT_OBSERVATION_V2, { caseId, command: command('sp2', 0, {
        subjectId: 's1', fieldKey: 'x', value: { kind: 'text', value: 'y' }, sourceRefs: [], reason: 'r',
      }, spoof) }],
      [REVIEW_IPC_CHANNELS.SET_EVIDENCE_LINK_V2, { caseId, command: command('sp3', 0, {
        documentVersionId: 'd1', subjectIds: ['s1'], supportsFact: 'x', linkedBy: 'user',
      }, spoof) }],
    ] as const
    for (const [channel, input] of inputs) expect(() => invoke(channel, input)).toThrow('ACTOR_UNTRUSTED')
    expect(() => invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('local-role-spoof', 0, { caseFieldValues: {} },
        { actorId: 'someone', actorSource: 'local', role: 'teacher' }),
    })).toThrow('ACTOR_UNTRUSTED')
    expect(JSON.stringify(readAggregate(caseId))).toBe(before)
  })

  test('synthetic legitimate local create, idempotency and changed payload collision', async () => {
    const t: TemplateVersion = {
      templateId: 'c0-template-test', version: 1, schemaVersion: 2,
      name: 'C0 synthetic', objectType: 'person', displayName: { template: 'case' },
      fields: [], materialSlots: [], policyVersionIds: [],
      stages: [{ id: 'end', name: 'End', kind: 'finalize', executorRole: 'reviewer' }],
      outputs: [], status: 'draft', createdAt: new Date().toISOString(),
    }
    saveDraft(t)
    publishTemplate(t.templateId, t.version)
    const input = { caseId: 'v3-c0-created', templateId: t.templateId, version: 1,
      payload: { title: 'Case', fieldValues: {}, subjects: [] }, actor }
    const one = await invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, input) as { ok: boolean; receipt: { actor: { actorSource: string; actorId: string } } }
    expect(one.ok).toBeTrue()
    expect(one.receipt.actor).toMatchObject({ actorSource: 'local', actorId: 'local-reviewer' })
    const before = JSON.stringify(readAggregate(input.caseId))
    const two = await invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, input) as { ok: boolean }
    expect(two.ok).toBeTrue()
    expect(JSON.stringify(readAggregate(input.caseId))).toBe(before)
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, {
      ...input, payload: { title: 'Different', fieldValues: {}, subjects: [] },
    }))).rejects.toThrow('REQUEST_ID_COLLISION')
    expect(JSON.stringify(readAggregate(input.caseId))).toBe(before)
    // A matching payload against a different template version is NOT an
    // idempotent replay. Legacy V2 receipt hash alone cannot distinguish it.
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, {
      ...input, version: 2,
    }))).rejects.toThrow('REQUEST_ID_COLLISION')
    expect(JSON.stringify(readAggregate(input.caseId))).toBe(before)

    const concurrent = { ...input, caseId: 'v3-c0-concurrent-create' }
    const [a, b] = await Promise.all([
      invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, concurrent),
      invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, concurrent),
    ]) as [{ ok: boolean }, { ok: boolean }]
    expect(a.ok && b.ok).toBeTrue()
    expect(readAggregate(concurrent.caseId)!.receiptLog).toHaveLength(1)
  })

  test('legitimate local three writes, duplicate request, stale CAS, scope and sender reject', async () => {
    const first = await invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('f1', 0, { caseFieldValues: { label: 'hello' } }),
    }) as { ok: boolean; receipt: { actor: { actorId: string; actorSource: string } } }
    expect(first.ok).toBeTrue()
    expect(first.receipt.actor).toMatchObject({ actorId: 'local-reviewer', actorSource: 'local' })
    const replay = await invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('f1', 0, { caseFieldValues: { label: 'hello' } }),
    }) as { ok: boolean }
    expect(replay.ok).toBeTrue()
    expect(readAggregate(caseId)!.caseV2.revision).toBe(1)

    const corrected = await invoke(REVIEW_IPC_CHANNELS.CORRECT_OBSERVATION_V2, {
      caseId, command: command('o1', 1, { subjectId: 's1', fieldKey: 'name',
        value: { kind: 'text', value: 'corrected' }, sourceRefs: [], reason: 'manual' }),
    }) as { ok: boolean }
    expect(corrected.ok).toBeTrue()
    const linked = await invoke(REVIEW_IPC_CHANNELS.SET_EVIDENCE_LINK_V2, {
      caseId, command: command('l1', 2, { documentVersionId: 'd1', subjectIds: ['s1'],
        linkedBy: 'user', supportsFact: 'synthetic' }),
    }) as { ok: boolean }
    expect(linked.ok).toBeTrue()
    const snapshot = JSON.stringify(readAggregate(caseId))
    expect(await invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('f1', 3, { caseFieldValues: { label: 'different' } }),
    })).toMatchObject({ ok: false, code: 'REQUEST_ID_COLLISION' })
    expect(await invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('stale', 0, { caseFieldValues: {} }),
    })).toMatchObject({ ok: false, code: 'VERSION_CONFLICT' })
    expect(() => invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, { caseId,
      command: { ...command('scope', 3, {}), caseId: 'other' } })).toThrow('CASE_SCOPE_FORBIDDEN')
    expect(() => invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('frame', 3, {}),
    }, { sender, senderFrame: { id: 2 } })).toThrow('SENDER_UNTRUSTED')
    expect(() => invoke(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, {
      caseId, command: command('window', 3, {}),
    }, { sender: { ...sender }, senderFrame: frame })).toThrow('SENDER_UNTRUSTED')
    expect(JSON.stringify(readAggregate(caseId))).toBe(snapshot)
    expect(readAggregate(caseId)!.receiptLog).toHaveLength(3)
  })
})
