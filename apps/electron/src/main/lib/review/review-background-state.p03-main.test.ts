/**
 * P03-MAIN-S01: State must never report acceptance just because V2 run is
 * persisted as 'running'. No real Pi/Electron/renderer is started here.
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { REVIEW_IPC_CHANNELS, type ReviewRunV2 } from '@profer/shared'
import { registerReviewIpc } from './review-ipc'
import { summarizeBackgroundPiReviewState } from './review-background-state'

const dir = mkdtempSync(join(tmpdir(), 'review-p03-main-status-'))
process.env.PROFER_CONFIG_DIR = dir
afterAll(() => rmSync(dir, { recursive: true, force: true }))

const run = (status: ReviewRunV2['status'], id = 'run-pi-test', caseId = 'sample') => ({ id, caseId, status })
const yes = () => true
const no = () => false

describe('P03-MAIN-S01 read-only Pi business state', () => {
  test('no Pi run is not-started; ordinary V2 run cannot become a Pi ACK', () => {
    expect(summarizeBackgroundPiReviewState('sample', [], yes)).toEqual({ caseId: 'sample', phase: 'not-started' })
    expect(summarizeBackgroundPiReviewState('sample', [run('running', 'normal-run')], yes).phase).toBe('not-started')
    expect(summarizeBackgroundPiReviewState('sample', [run('running', 'run-pi-other', 'different')], yes).phase).toBe('not-started')
  })

  test('persisted running and queued MUST NOT grant page-leave ACK', () => {
    expect(summarizeBackgroundPiReviewState('sample', [run('running')], no).phase).toBe('preparing')
    expect(summarizeBackgroundPiReviewState('sample', [run('queued')], yes).phase).toBe('preparing')
  })

  test('only actual onRunOwned acknowledgement becomes accepted', () => {
    expect(summarizeBackgroundPiReviewState('sample', [run('running')], yes)).toEqual({
      caseId: 'sample', runId: 'run-pi-test', runStatus: 'running', phase: 'accepted',
    })
  })

  test('pending business interaction is distinct from completed review', () => {
    expect(summarizeBackgroundPiReviewState('sample', [run('awaiting-input')], no).phase).toBe('needs-attention')
    expect(summarizeBackgroundPiReviewState('sample', [run('awaiting-decision')], no).phase).toBe('needs-attention')
    expect(summarizeBackgroundPiReviewState('sample', [run('completed')], no).phase).toBe('finished')
  })

  test('partial/cancel/fail/paused remain incomplete, never approved', () => {
    for (const status of ['partially-completed', 'cancelled', 'failed', 'paused'] as const) {
      expect(summarizeBackgroundPiReviewState('sample', [run(status)], yes).phase).toBe('incomplete')
    }
  })

  test('终态失败必须带出可诊断原因（失败可追踪）', () => {
    const reason = '模型请求 95 秒无任何数据返回（渠道：AMD Radeon，模型：GLM-5.3-Flash），本轮审核已中止。'
    const failed = summarizeBackgroundPiReviewState(
      'sample',
      [{ ...run('failed'), error: reason, completedAt: '2026-10-21T00:00:00Z' }],
      yes,
    )
    expect(failed.phase).toBe('incomplete')
    expect(failed.error).toBe(reason)
    // 运行中/已完成不带 error 字段，避免把内部细节泄漏成常态字段
    expect(summarizeBackgroundPiReviewState('sample', [run('running')], yes).error).toBeUndefined()
    expect(summarizeBackgroundPiReviewState('sample', [run('completed')], yes).error).toBeUndefined()
  })

  test('snapshot never returns owner sessionId, assignmentId or raw transcript', () => {
    const state = summarizeBackgroundPiReviewState('sample', [{ ...run('completed'), completedAt: '2026-10-13T00:00:00Z' }], no)
    expect(state.completedAt).toBe('2026-10-13T00:00:00Z')
    expect('sessionId' in state).toBe(false)
    expect('assignmentId' in state).toBe(false)
    expect('messages' in state).toBe(false)
  })

  test('real Review IPC registers read-only channel and rejects invalid and unknown case IDs', () => {
    const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
      ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
    }).ipcMainHandlers
    handlers.clear()
    registerReviewIpc()
    const fn = handlers.get(REVIEW_IPC_CHANNELS.GET_BACKGROUND_PI_REVIEW_STATE_V2)
    expect(fn).toBeDefined()
    expect(() => fn!({}, '../../bad')).toThrow('非法 caseId')
    expect(() => fn!({}, 'missing-case')).toThrow('案卷不存在或尚未初始化')
  })
})
