import { afterAll, expect, test } from 'bun:test'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { registerReviewIpc } from './review-ipc'

// 与既有审核 IPC 测试一致：独立配置根，旧导出反例不会触碰真实用户目录。
const root = join(import.meta.dir, '../../../../../../work/tmp', `review-v3-t08-ipc-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root

const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers
const frame = { id: 51 }
const sender = { id: 751, mainFrame: frame, isDestroyed: () => false }
const event = { sender, senderFrame: frame }

function invoke(channel: string, input: unknown, source: unknown = event): unknown {
  const handler = handlers.get(channel)
  if (!handler) throw new Error('IPC missing: ' + channel)
  return handler(source, input)
}

afterAll(() => {
  setMainWindow(null)
  rmSync(root, { recursive: true, force: true })
})

test('F02 IPC：五条真实报告入口拒绝 Renderer 伪造内部受众，且校验主窗口来源', async () => {
  handlers.clear()
  setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
  registerReviewIpc()

  expect(invoke(REVIEW_IPC_CHANNELS.GET_T08_REPORT_AUDIENCES_V3, 'case-f02-ipc')).toEqual(['student'])
  const requestedInternal = { caseId: 'case-f02-ipc', runId: 'run-f02-ipc', audience: 'organizer',
    principal: { source: 'school', role: 'school-admin', assurance: 'verified-school' },
  }
  expect(() => invoke(REVIEW_IPC_CHANNELS.GET_T08_REPORT_PREVIEW_V3, requestedInternal))
    .toThrow('REPORT_ACCESS_DENIED')
  await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.EXPORT_T08_REPORT_V3, {
    ...requestedInternal, format: 'md', expectedProjectionHash: 'fabricated',
  }))).rejects.toThrow('REPORT_ACCESS_DENIED')
  expect(invoke(REVIEW_IPC_CHANNELS.LIST_T08_REPORT_ARCHIVES_V3, 'case-f02-ipc')).toEqual([])
  expect(() => invoke(REVIEW_IPC_CHANNELS.GET_T08_REPORT_ARCHIVE_V3, {
    caseId: 'case-f02-ipc', reportId: 'internal-archive',
  }, { sender: { ...sender }, senderFrame: frame })).toThrow('SENDER_UNTRUSTED')
  await expect(Promise.resolve(invoke(REVIEW_IPC_CHANNELS.EXPORT_T08_REPORT_ARCHIVE_V3, {
    caseId: 'case-f02-ipc', reportId: '../other-case', format: 'md',
  }))).rejects.toThrow()
})

test('F02 IPC：旧 EXPORT_REPORT_V2 与五路报告同一边界，伪造窗口/子帧在写盘前拒绝', () => {
  handlers.clear()
  setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
  registerReviewIpc()

  const caseId = 'case-f02-legacy-export'
  const reportDir = join(root, 'review-cases', caseId, 'reports')
  // 与上面五条真实报告入口一致：伪造 sender / 非主 frame 都必须先被来源守卫拒绝。
  expect(() => invoke(REVIEW_IPC_CHANNELS.EXPORT_REPORT_V2, caseId,
    { sender: { ...sender }, senderFrame: frame })).toThrow('SENDER_UNTRUSTED')
  expect(() => invoke(REVIEW_IPC_CHANNELS.EXPORT_REPORT_V2, caseId,
    { sender, senderFrame: { id: 52 } })).toThrow('SENDER_UNTRUSTED')
  // 拒绝发生在访问导出服务之前：案卷 reports/ 未被创建，也就没有报告落盘。
  expect(existsSync(reportDir)).toBe(false)
  // 旧入口只接受 caseId，Renderer 无法借这个通道夹带 actor/audience 抬升受众。
  expect(() => invoke(REVIEW_IPC_CHANNELS.EXPORT_REPORT_V2, {
    caseId, audience: 'organizer', actor: { actorId: 'forged', actorSource: 'local', role: 'reviewer' },
  })).toThrow('参数 caseId 非法')
  expect(existsSync(reportDir)).toBe(false)
  // 可信来源才会进入服务；此处案卷不存在，得到业务错误而非来源拒绝，证明守卫先于服务。
  expect(() => invoke(REVIEW_IPC_CHANNELS.EXPORT_REPORT_V2, caseId)).toThrow(/案卷聚合不存在/)
  expect(existsSync(reportDir)).toBe(false)
})
