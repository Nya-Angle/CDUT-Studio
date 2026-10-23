/**
 * AUTH-06: every legacy high-impact V2 write must pass the same trusted Main
 * window + main-frame check as the C0/T05/F13 channels before any domain write.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { REVIEW_IPC_CHANNELS, type ReviewCaseV2, type TemplateVersion } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { createAggregate, readAggregate } from './case-store-v2'
import { ensureInitialTask, recordStageDecision } from './stage-workflow'
import { registerReviewIpc } from './review-ipc'
import { deriveLocalSupplementResolverActor } from './review-ipc-actor-guard'

const root = join(import.meta.dir, '../../../../../../work/tmp', `review-ipc-legacy-sender-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
afterAll(() => { setMainWindow(null); rmSync(root, { recursive: true, force: true }) })

const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers
const frame = { id: 1 }
const sender = { id: 901, mainFrame: frame, isDestroyed: () => false }
const trusted = { sender, senderFrame: frame }

const LEGACY_WRITES = [
  REVIEW_IPC_CHANNELS.RECORD_WORKSPACE_DISPOSITION_V2,
  REVIEW_IPC_CHANNELS.OPEN_WORKSPACE_SUPPLEMENT_V2,
  REVIEW_IPC_CHANNELS.ACKNOWLEDGE_WORKSPACE_MATERIAL_V2,
  REVIEW_IPC_CHANNELS.DECIDE_WORKSPACE_CASE_V2,
  REVIEW_IPC_CHANNELS.RECORD_WORKSPACE_SUBJECT_ADJUDICATION_V2,
  REVIEW_IPC_CHANNELS.RECORD_STAGE_DECISION_V2,
  REVIEW_IPC_CHANNELS.RESOLVE_SUPPLEMENT_V2,
  REVIEW_IPC_CHANNELS.CAST_RATING_V2,
  REVIEW_IPC_CHANNELS.RESOLVE_APPEAL_V2,
] as const

function invoke(channel: string, event: unknown): unknown {
  const handler = handlers.get(channel)
  if (!handler) throw new Error(`Missing IPC test handler: ${channel}`)
  return handler(event, {
    caseId: 'legacy-sender-case',
    command: { requestId: 'r1', actor: { actorId: 'forged', actorSource: 'local', role: 'reviewer' }, expectedRevision: 0, payload: {} },
    templateId: 't', version: 1,
  })
}

describe('AUTH-06 legacy write sender boundary', () => {
  test('all legacy high-impact writes reject a forged window and a subframe before writing', () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    registerReviewIpc()
    for (const channel of LEGACY_WRITES) {
      expect(() => invoke(channel, { sender: { ...sender }, senderFrame: frame })).toThrow('SENDER_UNTRUSTED')
      expect(() => invoke(channel, { sender, senderFrame: { id: 2 } })).toThrow('SENDER_UNTRUSTED')
    }
  })
})

describe('T07 评分权威：批次案卷拒绝旧 CAST_RATING', () => {
  test('已进入批次的案卷不能再用旧 CAST_RATING 平行记分', () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    registerReviewIpc()
    const { createBatchV2 } = require('./batch-store') as typeof import('./batch-store')
    createBatchV2({
      id: 'batch-cast-guard', name: '批次评分', templateId: 't', templateVersion: 1,
      policyVersionLock: [], caseIds: ['batched-cast-case'], createdAt: new Date().toISOString(),
    })
    const handler = handlers.get(REVIEW_IPC_CHANNELS.CAST_RATING_V2)
    expect(handler).toBeDefined()
    expect(() => handler!(trusted, {
      caseId: 'batched-cast-case',
      command: { requestId: 'r1', actor: { actorId: 'local', actorSource: 'local', role: 'judge' },
        expectedRevision: 0, payload: {} },
    })).toThrow('评分必须走 T07 评分通道')
  })
})

describe('RUN-43 续交确认走真实 IPC 入参校验', () => {
  test('非法 resumeInterrupted 在启动任何执行前被拒绝', async () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    registerReviewIpc()
    const handler = handlers.get(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2)
    expect(handler).toBeDefined()
    await expect(Promise.resolve(handler!(trusted, { caseId: 'resume-flag-case', resumeInterrupted: 'yes' })))
      .rejects.toThrow('审核续交确认参数非法')
  })
})

describe('RUN-17 补件判定人由 Main 派生', () => {
  const aggregate = {
    supplements: [
      { id: 'sup-teacher', originTaskId: 'task-teacher' },
      { id: 'sup-reviewer', originTaskId: 'task-reviewer' },
      { id: 'sup-pinned', originTaskId: 'task-pinned' },
      { id: 'sup-none' },
    ],
    tasks: [
      { id: 'task-teacher', assigneeRole: 'teacher' },
      { id: 'task-reviewer', assigneeRole: 'reviewer' },
      { id: 'task-pinned', assigneeRole: 'teacher', assigneeActorId: 'local-teacher-2' },
    ],
  } as unknown as import('@profer/shared').CaseAggregateV2

  test('teacher origin 派生本地 teacher；renderer 自填角色不参与', () => {
    expect(deriveLocalSupplementResolverActor(aggregate, 'sup-teacher')).toEqual({ actorId: 'local-teacher', actorSource: 'local', role: 'teacher' })
    expect(deriveLocalSupplementResolverActor(aggregate, 'sup-reviewer')).toEqual({ actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' })
    expect(deriveLocalSupplementResolverActor(aggregate, 'sup-pinned')).toMatchObject({ actorId: 'local-teacher-2', role: 'teacher' })
    expect(deriveLocalSupplementResolverActor(aggregate, 'sup-none')).toEqual({ actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' })
    expect(deriveLocalSupplementResolverActor(undefined, 'sup-teacher')).toMatchObject({ actorSource: 'local', role: 'reviewer' })
  })
})

describe('RUN-17 teacher 阶段补件经普通 IPC 可判定', () => {
  test('renderer 声明 reviewer，但 Main 按 origin task 派生本地 teacher 并完成判定', async () => {
    const caseId = 'run17-teacher-supplement'
    const teacherActor = { actorId: 'local-teacher', actorSource: 'local' as const, role: 'teacher' as const }
    const template = {
      templateId: 'run17', version: 1, schemaVersion: 2, name: 'RUN-17', objectType: 'person',
      displayName: { template: '' }, fields: [], materialSlots: [], policyVersionIds: [],
      stages: [{ id: 'final', name: '终审', kind: 'manual-review', executorRole: 'teacher' }],
      outputs: [], status: 'published', createdAt: '',
    } as unknown as TemplateVersion
    const caseV2 = {
      id: caseId, templateId: 'run17', templateVersion: 1, title: 'RUN-17', objectType: 'person',
      caseFields: {}, subjects: [], documents: [], stage: 'submitted', revision: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } as ReviewCaseV2
    await createAggregate(caseId, caseV2)
    const task = await ensureInitialTask(caseId, template, teacherActor)
    expect(task.ok).toBeTrue()
    const opened = await recordStageDecision(caseId, {
      requestId: 'run17-open', actor: teacherActor, expectedRevision: readAggregate(caseId)!.caseV2.revision,
      payload: { action: 'return-for-supplement', taskId: task.ok ? task.entity!.id : '', reason: '缺件', supplementRequiredElements: ['原件'], supplementReason: '请补原件' },
    }, template)
    expect(opened.ok).toBeTrue()
    const aggregate = readAggregate(caseId)!
    const supplementId = aggregate.supplements[0]!.id
    const handler = handlers.get(REVIEW_IPC_CHANNELS.RESOLVE_SUPPLEMENT_V2)
    if (!handler) throw new Error('missing handler')
    const result = await handler(trusted, {
      caseId,
      command: {
        requestId: 'run17-resolve', actor: { actorId: 'forged', actorSource: 'local', role: 'reviewer' },
        expectedRevision: aggregate.caseV2.revision,
        payload: { supplementId, outcome: 'satisfied', reason: '原件齐全' },
      },
    }) as { ok: boolean }
    expect(result.ok).toBeTrue()
    expect(readAggregate(caseId)!.supplements[0]!.status).toBe('satisfied')
  })
})
