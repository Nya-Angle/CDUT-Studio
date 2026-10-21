import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { registerReviewIpc } from './review-ipc'

const root = join(import.meta.dir, '../../../../../../work/tmp', `review-ipc-poc-${Date.now()}`, 'configuration')
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(dirname(root), { recursive: true, force: true }))

const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers

function invoke(channel: string, input: unknown): unknown {
  const handler = handlers.get(channel)
  if (!handler) throw new Error(`Missing IPC test handler: ${channel}`)
  return handler({}, input)
}

describe('20 号 QA：真实 renderer V2 IPC 路径穿越拒绝', () => {
  test('registerReviewIpc 的 CREATE_CASE_V2、读取及批次创建均拒绝恶意输入，配置目录外不新增文件', async () => {
    handlers.clear()
    registerReviewIpc()
    const caseId = '../../path-poc'
    expect(() => invoke(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, {
      caseId, templateId: 'published-synthetic-template', version: 1,
      payload: { title: 'synthetic', fieldValues: {}, subjects: [] },
      actor: { actorId: 'qa', actorSource: 'local', role: 'reviewer' },
    })).toThrow('非法 caseId')
    expect(() => invoke(REVIEW_IPC_CHANNELS.GET_AGGREGATE_V2, caseId)).toThrow('非法 caseId')
    expect(() => invoke(REVIEW_IPC_CHANNELS.LIST_RUNS_V2, caseId)).toThrow('非法 caseId')
    expect(() => invoke(REVIEW_IPC_CHANNELS.GET_RUN_V2, { caseId: 'safe-case', runId: '../../run-poc' }))
      .toThrow('非法 runId')
    expect(() => invoke(REVIEW_IPC_CHANNELS.GET_RUN_V2, { caseId, runId: 'safe-run' }))
      .toThrow('非法 caseId')
    expect(() => invoke(REVIEW_IPC_CHANNELS.CREATE_BATCH_V2, {
      batch: { id: 'safe-batch', name: 'qa', templateId: 't', templateVersion: 1,
        policyVersionLock: [], caseIds: ['safe-case', caseId], createdAt: '2026-10-11T00:00:00Z' },
    })).toThrow('非法 caseId')
    await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.RUN_REVIEW_V2, caseId))).rejects.toThrow('非法 caseId')
    expect(existsSync(join(dirname(root), 'path-poc'))).toBeFalse()
    expect(existsSync(join(root, 'review-batches', 'safe-batch'))).toBeFalse()
  })
})
