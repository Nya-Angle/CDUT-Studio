/** Main 薄接线：真实 V2/会话/IPC，受控执行器；Electron A0 另行记录。 */
import { afterAll, describe, expect, mock, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AgentSendInput, TemplateVersion } from '@profer/shared'
import { DEFAULT_PRESET_ID, REVIEW_IPC_CHANNELS } from '@profer/shared'
import type { BrowserWindow, WebContents } from 'electron'
import type { ReviewPreuploadOperation, ReviewPreuploadScope } from './review-preupload-gate'
import * as reviewPreuploadGate from './review-preupload-gate'
import { AgentEventBus } from '../agent-event-bus'

const configDir = mkdtempSync(join(tmpdir(), 'review-main-bridge-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))
const executions: Array<{ input: AgentSendInput; owned(): void; crash(): void; end(status: 'completed' | 'failed' | 'stopped'): void }> = []
const sequence: string[] = []
const active = new Set<string>()
let stopGate: Promise<void> | null = null
// 测试专用 authority 视图：read 仍走 preload 的虚构许可，model 由用例单独拒绝；
// 这不是产品许可，也不改变生产 Main 无 authority 时 fail-closed 的默认。
const realPreuploadGate = { ...reviewPreuploadGate }
const gateCalls: Array<{ operation: ReviewPreuploadOperation; scope: Readonly<ReviewPreuploadScope> }> = []
let modelEgressGranted = true
mock.module('./review-preupload-gate', () => ({
  ...realPreuploadGate,
  assertReviewPreuploadAllowed(operation: ReviewPreuploadOperation, scope: ReviewPreuploadScope = {}) {
    gateCalls.push({ operation, scope: { ...scope } })
    sequence.push(operation)
    if (operation === 'model' && !modelEgressGranted) {
      throw new Error('REVIEW_PREUPLOAD_DENIED: ' + realPreuploadGate.REVIEW_PREUPLOAD_OFFLINE_NOTICE)
    }
    realPreuploadGate.assertReviewPreuploadAllowed(operation, scope)
  },
}))
mock.module('../agent-service', () => ({
  agentEventBus: new AgentEventBus(),
  runAgentHeadless: async () => { throw new Error('Unexpected headless run in review bridge test') },
  stopAgent: () => { throw new Error('Unexpected unbound stop in review bridge test') },
  isAgentSessionActive: (id: string) => active.has(id),
  runAgent: (input: AgentSendInput, _wc: WebContents, _promotion: unknown, owned: () => void) => new Promise<void>((resolve) => {
    sequence.push('runAgent')
    executions.push({ input, owned: () => { active.add(input.sessionId); owned() },
      // 模拟进程崩溃：真实执行器失联，但不会产生正常终态回调。
      crash: () => { active.delete(input.sessionId) },
      end: (status) => {
        input.onRunOutcome?.({ status, ...(status === 'failed' ? { error: '合成执行失败' } : {}) })
        active.delete(input.sessionId)
        resolve()
      } })
  }),
  stopAgentAndWait: async (id: string) => {
    if (stopGate) await stopGate
    executions.findLast((run) => run.input.sessionId === id)?.end('stopped')
  },
}))
const { startBackgroundPiReview, stopBackgroundPiReview } = await import('./review-pi-run-bridge')
const { createChannel, updateChannel } = await import('../channel-manager')
const { updateSettings } = await import('../settings-service')
const { createCaseFromTemplate } = await import('./application-service')
const { saveDraft, publishTemplate } = await import('./template-store')
const { getBackgroundPiReviewState } = await import('./review-background-state')
const { listAgentSessions, getAgentSessionMeta, updateAgentSessionMeta } = await import('../agent-session-manager')
const { ensureDefaultWorkspace } = await import('../agent-workspace-manager')
const { saveReviewModuleSettings } = await import('./module-settings-store')
const { getRunV2, isInterruptedRunV2, isResumableInterruptedRunV2, listRunsV2, markStaleRunsInterrupted, saveRunV2 } = await import('./run-store-v2')
const { getPiReviewBindingForSession } = await import('./pi-case-review-service')
const { createAssignment, bindRunToAssignment, findActivePiReviewAssignment, checkAssignment } = await import('./review-agent-assignment')
const { getConfigDir } = await import('../config-paths')
const { registerReviewIpc } = await import('./review-ipc')
const { setMainWindow } = await import('../main-window-state')
const windowContents = { isDestroyed: () => false, send() {} } as unknown as WebContents
const channel = createChannel({ name: '合成审核渠道', provider: 'deepseek', baseUrl: 'https://example.invalid', apiKey: 'synthetic-test-key', enabled: true,
  models: [{ id: 'synthetic-model', name: '合成模型', enabled: true }] })
updateSettings({ agentChannelId: channel.id, agentModelId: 'synthetic-model' })
// 夹具默认绑定显式审核选择；「未单独配置」分支由专门用例显式置空验证。
saveReviewModuleSettings({ agentModelSelection: { channelId: channel.id, modelId: 'synthetic-model' } })

async function fixture() {
  const id = `bridge-${randomUUID()}`
  const template: TemplateVersion = { templateId: id, version: 1, schemaVersion: 2, name: '合成后台接线', objectType: 'person', displayName: { template: '{{title}}' },
    fields: [], sections: [{ id: 'all', name: '核验', order: 0, required: false, criteria: [{ id: 'check', title: '内容检查', requirement: '核对材料中的申请内容', execution: 'semantic', targetScope: 'case' }] }],
    materialSlots: [], policyVersionIds: [], policyRefs: [], stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString() }
  saveDraft(template)
  publishTemplate(id, 1)
  const created = await createCaseFromTemplate(id, 1, { title: '合成案卷', fieldValues: {}, subjects: [] }, { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }, id)
  if (!created.ok) throw new Error(created.message)
  return id
}
async function pendingExecution() {
  const caseId = await fixture()
  const count = executions.length
  const admission = startBackgroundPiReview({ caseId }, windowContents)
  while (executions.length === count) await Bun.sleep(0)
  const execution = executions.at(-1)!
  return { caseId, admission, execution }
}

describe('后台 Main 入口与受理边界', () => {
  test('真实执行权之前保持 preparing，ACK 不泄漏内部 ID，Main 在页面无等待时继续收尾', async () => {
    const context = await pendingExecution()
    const before = getBackgroundPiReviewState(context.caseId)
    expect(before.phase).toBe('preparing')
    let settled = false
    void context.admission.then(() => { settled = true })
    await Bun.sleep(0)
    expect(settled).toBeFalse()
    context.execution.owned()
    const receipt = await context.admission
    expect(receipt.phase).toBe('accepted')
    expect('sessionId' in receipt).toBeFalse()
    expect('assignmentId' in receipt).toBeFalse()
    const meta = getAgentSessionMeta(context.execution.input.sessionId)!
    expect(meta.owner).toEqual({ kind: 'review-case', caseId: context.caseId })
    // 审核会话不显式指定工作区时，Main 统一绑定默认沙箱工作区（杜绝无工作区漂移）。
    expect(meta.workspaceId).toBe(ensureDefaultWorkspace().id)
    expect(meta.attachedDirectories).toHaveLength(1)
    context.execution.end('completed')
    await Bun.sleep(0)
    expect(getBackgroundPiReviewState(context.caseId).phase).toBe('incomplete')
    expect(getRunV2(context.caseId, receipt.runId!)?.status).toBe('partially-completed')
  })

  test('忙碌和重复启动不产生第二个运行或结束原运行', async () => {
    const context = await pendingExecution()
    await expect(startBackgroundPiReview({ caseId: context.caseId }, windowContents)).rejects.toThrow('正在启动或停止')
    context.execution.owned()
    const receipt = await context.admission
    await expect(startBackgroundPiReview({ caseId: context.caseId }, windowContents)).rejects.toThrow('已有审核正在进行')
    expect(getRunV2(context.caseId, receipt.runId!)?.status).toBe('running')
    context.execution.end('failed')
    await Bun.sleep(0)
    expect(getRunV2(context.caseId, receipt.runId!)?.error).toBe('合成执行失败')
  })

  test('F09：T04 新 Run 不遮挡更早的 Pi 部分完成轮次续审', async () => {
    const first = await pendingExecution()
    first.execution.owned()
    const receipt = await first.admission
    first.execution.end('completed')
    await Bun.sleep(0)
    const previous = getRunV2(first.caseId, receipt.runId!)!
    expect(previous.status).toBe('partially-completed')
    // 最终 pi-case-review-service 的新 Run 合同只写 semantic + not-executed；
    // 这里必须精确锁定该形态，不能再用 OR 兼容历史 execution-failed。
    const semanticPlaceholders = previous.checks.filter((check) => check.executedBy === 'semantic')
    expect(semanticPlaceholders.length).toBeGreaterThan(0)
    expect(semanticPlaceholders.every((check) => check.status === 'not-executed')).toBeTrue()
    expect(previous.checks.some((check) => check.executedBy === 'semantic'
      && check.status === 'execution-failed')).toBeFalse()

    // 另一个技术路径最近写入模板规则 Run，不等于 Pi 的最近可续审轮次。
    saveRunV2({ ...previous, id: 'run-t04-after-pi', status: 'completed',
      startedAt: '2099-01-01T00:00:00.000Z', completedAt: '2099-01-01T00:01:00.000Z' })
    const before = executions.length
    const continuation = startBackgroundPiReview({ caseId: first.caseId, mode: 'update' }, windowContents)
    while (executions.length === before) await Bun.sleep(0)
    const second = executions.at(-1)!
    second.owned()
    const continued = await continuation
    expect(continued.runId).toBe(receipt.runId)
    expect(second.input.sessionId).toBe(first.execution.input.sessionId)
    expect(getRunV2(first.caseId, receipt.runId!)?.status).toBe('running')
    second.end('completed')
    await Bun.sleep(0)
  })

  test('兼容：历史 execution-failed 占位仍可按原 RunId 续交', async () => {
    const context = await pendingExecution()
    context.execution.owned()
    const receipt = await context.admission
    context.execution.end('completed')
    await Bun.sleep(0)
    const current = getRunV2(context.caseId, receipt.runId!)!
    expect(current.status).toBe('partially-completed')
    expect(current.checks.some((check) => check.executedBy === 'semantic'
      && check.status === 'not-executed')).toBeTrue()

    // 独立历史夹具：模拟旧版本落盘的 execution-failed 占位。兼容分支必须保留，
    // 且仍沿用同一 RunId、冻结计划与来源版本续交，不能被新合同测试删除。
    saveRunV2({ ...current, checks: current.checks.map((check) => check.executedBy === 'semantic'
      ? { ...check, status: 'execution-failed' as const, reason: '旧版本未执行占位，可续交' }
      : check) })
    const historical = getRunV2(context.caseId, receipt.runId!)!
    expect(historical.checks.some((check) => check.executedBy === 'semantic'
      && check.status === 'execution-failed')).toBeTrue()
    // 此时占位数量已齐、无检查点，续交判定只能来自历史 execution-failed 兼容分支。
    expect(historical.coverage.plannedChecks).toBe(historical.checks.length)
    expect(historical.checkpoints).toHaveLength(0)
    const manifest = structuredClone(historical.inputManifest)

    const count = executions.length
    const continuation = startBackgroundPiReview({ caseId: context.caseId, mode: 'update' }, windowContents)
    while (executions.length === count) await Bun.sleep(0)
    const second = executions.at(-1)!
    second.owned()
    const continued = await continuation
    expect(continued.runId).toBe(receipt.runId)
    expect(second.input.sessionId).toBe(context.execution.input.sessionId)
    const resumed = getRunV2(context.caseId, receipt.runId!)!
    expect(resumed.status).toBe('running')
    expect(resumed.inputManifest).toEqual(manifest)
    second.end('completed')
    await Bun.sleep(0)
  })

  test('RUN-43：真实 Main IPC 未确认中断续交先拒止，确认后同一冻结 Plan/来源版本按原 RunId 续交', async () => {
    const context = await pendingExecution()
    context.execution.owned()
    const receipt = await context.admission
    const before = structuredClone(getRunV2(context.caseId, receipt.runId!)!)
    expect(before.status).toBe('running')
    expect(before.inputManifest.planFingerprint).toBeString()
    expect(before.inputManifest.frozenPlan?.kind).toBe('published-template')
    expect(before.checks.some((check) => check.executedBy === 'semantic'
      && check.status === 'not-executed')).toBeTrue()

    // 进程崩溃后 Main 启动恢复只能把遗留 running 标为中断，不能自动续跑。
    context.execution.crash()
    expect(markStaleRunsInterrupted(context.caseId)).toBe(1)
    const interrupted = getRunV2(context.caseId, receipt.runId!)!
    expect(interrupted.status).toBe('failed')
    expect(isResumableInterruptedRunV2(interrupted)).toBeTrue()
    expect(isInterruptedRunV2(context.caseId, receipt.runId!)).toBeTrue()
    expect(listRunsV2(context.caseId)).toHaveLength(1)

    const hooks = globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & { ipcMainHandlers: Map<string, (...args: any[]) => any> }
    hooks.ipcMainHandlers.clear()
    registerReviewIpc()
    setMainWindow({ isDestroyed: () => false, webContents: windowContents } as unknown as BrowserWindow)
    try {
      const handler = hooks.ipcMainHandlers.get(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2)!
      expect(handler).toBeDefined()

      // 未显式确认：Main IPC → bridge 必须在 SDK/执行器调用前拒绝。
      const callsBefore = executions.length
      await expect(Promise.resolve(handler({ sender: windowContents }, { caseId: context.caseId, mode: 'update' })))
        .rejects.toThrow('上次审核因应用重启中断')
      expect(executions).toHaveLength(callsBefore)
      expect(getRunV2(context.caseId, receipt.runId!)?.status).toBe('failed')
      expect(isInterruptedRunV2(context.caseId, receipt.runId!)).toBeTrue()

      // 显式确认 true：同一 RunId、同一冻结 Plan 与来源版本继续，不新建 Run。
      const accepted = handler({ sender: windowContents },
        { caseId: context.caseId, mode: 'update', resumeInterrupted: true }) as Promise<{ phase: string; runId?: string }>
      while (executions.length === callsBefore) await Bun.sleep(0)
      const resumedExecution = executions.at(-1)!
      resumedExecution.owned()
      const resumedReceipt = await accepted
      expect(resumedReceipt.phase).toBe('accepted')
      expect(resumedReceipt.runId).toBe(receipt.runId)
      expect(resumedExecution.input.sessionId).toBe(context.execution.input.sessionId)
      const resumed = getRunV2(context.caseId, receipt.runId!)!
      expect(resumed.status).toBe('running')
      expect(listRunsV2(context.caseId)).toHaveLength(1)
      expect(resumed.inputManifest).toEqual(before.inputManifest)
      expect(resumed.diagnostics.join('\n')).toContain('resume-interrupted')
      expect(resumed.diagnostics.join('\n')).toContain('新回合')
      resumedExecution.end('completed')
      await Bun.sleep(0)
    } finally {
      setMainWindow(null)
    }
  })

  test('停止只接受当前案卷/运行，错误身份不触发执行器，正确停止持久 cancelled', async () => {
    const context = await pendingExecution()
    context.execution.owned()
    const receipt = await context.admission
    await expect(stopBackgroundPiReview({ caseId: context.caseId, runId: 'run-pi-unknown' })).rejects.toThrow('运行已变化')
    const other = await fixture()
    await expect(stopBackgroundPiReview({ caseId: other, runId: receipt.runId! })).rejects.toThrow('运行已变化')
    expect(active.has(context.execution.input.sessionId)).toBeTrue()
    const state = await stopBackgroundPiReview({ caseId: context.caseId, runId: receipt.runId! })
    expect(state.runStatus).toBe('cancelled')
    expect(active.has(context.execution.input.sessionId)).toBeFalse()
    expect(getPiReviewBindingForSession(context.execution.input.sessionId)).toBeUndefined()
  })

  test('模型停用和非法请求在建内部会话前拒绝', async () => {
    const caseId = await fixture()
    const count = listAgentSessions(true).length
    updateChannel(channel.id, { enabled: false })
    await expect(startBackgroundPiReview({ caseId }, windowContents)).rejects.toThrow('停用')
    updateChannel(channel.id, { enabled: true })
    await expect(startBackgroundPiReview({ caseId: '../../bad' }, windowContents)).rejects.toThrow('非法 caseId')
    await expect(startBackgroundPiReview({ caseId, mode: 'bad' as 'update' }, windowContents)).rejects.toThrow('模式非法')
    expect(listAgentSessions(true)).toHaveLength(count)
  })

  test('START_BACKGROUND_PI_REVIEW_V2 仅授 read 不授 model：不到达执行器', async () => {
    const caseId = await fixture()
    const sessionCount = listAgentSessions(true).length
    const runCount = listRunsV2(caseId).length
    const executionCount = executions.length
    gateCalls.length = 0
    sequence.length = 0
    modelEgressGranted = false
    const hooks = globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & { ipcMainHandlers: Map<string, (...args: any[]) => any> }
    hooks.ipcMainHandlers.clear()
    registerReviewIpc()
    setMainWindow({ isDestroyed: () => false, webContents: windowContents } as unknown as BrowserWindow)
    try {
      const handler = hooks.ipcMainHandlers.get(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2)!
      const admission = Promise.resolve().then(() => handler({ sender: windowContents }, { caseId })) as Promise<unknown>
      let settled: 'pending' | 'resolved' | 'rejected' = 'pending'
      let rejection: unknown
      void admission.then(() => { settled = 'resolved' }, (error) => { settled = 'rejected'; rejection = error })
      for (let tick = 0; tick < 10 && settled === 'pending' && executions.length === executionCount; tick++) await Bun.sleep(0)
      // 若基线未接 model 门而把运行交出去，先释放执行器以便测试明确失败而不是悬空。
      if (executions.length > executionCount) {
        const leaked = executions.at(-1)!
        leaked.owned()
        await admission.catch(() => {})
        leaked.end('failed')
      }
      expect(executions).toHaveLength(executionCount)
      expect(String(settled)).toBe('rejected')
      expect(String(rejection)).toContain('REVIEW_PREUPLOAD_DENIED')
      const modelCall = gateCalls.find((call) => call.operation === 'model')
      expect(modelCall).toBeDefined()
      expect(modelCall!.scope).toEqual({ caseId, modelDestination: 'deepseek:https://example.invalid' })
      expect(gateCalls.some((call) => call.operation === 'read')).toBeTrue()
      expect(sequence).not.toContain('runAgent')
      expect(listAgentSessions(true)).toHaveLength(sessionCount)
      expect(listRunsV2(caseId)).toHaveLength(runCount)
    } finally {
      modelEgressGranted = true
      setMainWindow(null)
    }
  })

  test('有效 model 授权：精确 provider/baseUrl 目标过门后才进入执行器', async () => {
    const caseId = await fixture()
    const executionCount = executions.length
    gateCalls.length = 0
    sequence.length = 0
    modelEgressGranted = true
    const hooks = globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & { ipcMainHandlers: Map<string, (...args: any[]) => any> }
    hooks.ipcMainHandlers.clear()
    registerReviewIpc()
    setMainWindow({ isDestroyed: () => false, webContents: windowContents } as unknown as BrowserWindow)
    try {
      const handler = hooks.ipcMainHandlers.get(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2)!
      const admission = handler({ sender: windowContents }, { caseId }) as Promise<{ phase: string; runId?: string }>
      while (executions.length === executionCount) await Bun.sleep(0)
      const execution = executions.at(-1)!
      execution.owned()
      const receipt = await admission
      expect(receipt.phase).toBe('accepted')
      const modelCall = gateCalls.find((call) => call.operation === 'model')
      expect(modelCall).toBeDefined()
      expect(modelCall!.scope).toEqual({ caseId, modelDestination: 'deepseek:https://example.invalid' })
      const modelIndex = sequence.indexOf('model')
      const runIndex = sequence.indexOf('runAgent')
      expect(modelIndex).toBeGreaterThanOrEqual(0)
      expect(sequence.filter((event) => event === 'model')).toHaveLength(1)
      expect(runIndex).toBeGreaterThan(modelIndex)
      expect(sequence.slice(0, modelIndex).every((event) => event === 'read')).toBeTrue()
      execution.end('completed')
      await Bun.sleep(0)
    } finally {
      setMainWindow(null)
    }
  })

  test('预设不符合审核档案的旧 owner 不复用，防止加载普通工具配置', async () => {
    const context = await pendingExecution()
    context.execution.owned()
    await context.admission
    context.execution.end('completed')
    await Bun.sleep(0)
    updateAgentSessionMeta(context.execution.input.sessionId, { presetId: DEFAULT_PRESET_ID, presetReference: undefined })
    const count = executions.length
    const admission = startBackgroundPiReview({ caseId: context.caseId }, windowContents)
    while (executions.length === count) await Bun.sleep(0)
    const current = executions.at(-1)!
    current.owned()
    await admission
    expect(current.input.sessionId).not.toBe(context.execution.input.sessionId)
    const meta = getAgentSessionMeta(current.input.sessionId)!
    expect(meta.presetReference?.presetId ?? meta.presetId).toBe('review-operator')
    current.end('completed')
    await Bun.sleep(0)
  })

  test('审核独立模型优先，运行中改设置不改变当前执行输入', async () => {
    const selected = createChannel({ name: '独立合成渠道', provider: 'deepseek', baseUrl: 'https://example.invalid', apiKey: 'synthetic-key', enabled: true, models: [{ id: 'selected-model', name: '选定模型', enabled: true }] })
    saveReviewModuleSettings({ agentModelSelection: { channelId: selected.id, modelId: 'selected-model' } })
    const context = await pendingExecution()
    context.execution.owned()
    await context.admission
    // 运行中真的改一次设置：当前执行输入必须保持受理时的解析结果。
    saveReviewModuleSettings({ agentModelSelection: null })
    expect(context.execution.input.channelId).toBe(selected.id)
    expect(context.execution.input.modelId).toBe('selected-model')
    context.execution.end('completed')
    await Bun.sleep(0)
    // 恢复默认夹具选择，避免影响后续用例
    saveReviewModuleSettings({ agentModelSelection: { channelId: channel.id, modelId: 'synthetic-model' } })
  })

  test('审核未单独配置时沿用应用当前渠道和模型', async () => {
    saveReviewModuleSettings({ agentModelSelection: null })
    updateSettings({ agentChannelId: channel.id, agentModelId: 'synthetic-model' })
    const context = await pendingExecution()
    context.execution.owned()
    await context.admission
    expect(context.execution.input.channelId).toBe(channel.id)
    expect(context.execution.input.modelId).toBe('synthetic-model')
    context.execution.end('completed')
    await Bun.sleep(0)
    saveReviewModuleSettings({ agentModelSelection: { channelId: channel.id, modelId: 'synthetic-model' } })
  })


  test('P06-S01 newest active assignment wins an exact-millisecond tie', () => {
    const sessionId = 'p06-tie-' + randomUUID()
    const caseId = 'p06-case-' + randomUUID()
    const previous = createAssignment({ sessionId, turnId: 'old-turn', caseId, actions: ['submit-result'] })
    bindRunToAssignment(previous.id, 'run-pi-previous')
    const current = createAssignment({ sessionId, turnId: 'new-turn', caseId, actions: ['submit-result'] })
    bindRunToAssignment(current.id, 'run-pi-current')
    const file = join(getConfigDir(), 'review-agent-assignments.json')
    const data = JSON.parse(readFileSync(file, 'utf8')) as { assignments: Array<{ id: string; createdAt: string }> }
    for (const entry of data.assignments) {
      if (entry.id === previous.id || entry.id === current.id) entry.createdAt = '2026-10-13T00:00:00.000Z'
    }
    writeFileSync(file, JSON.stringify(data) + '\n')
    expect(findActivePiReviewAssignment(sessionId)?.id).toBe(current.id)
  })

  test('P06-S01 same case reused owner: old failure, stop and revoked grant cannot affect second run', async () => {
    const first = await pendingExecution()
    first.execution.owned()
    const firstAck = await first.admission
    const prior = getPiReviewBindingForSession(first.execution.input.sessionId)!
    first.execution.end('failed')
    await Bun.sleep(0)
    expect(checkAssignment({ assignmentId: prior.assignmentId, sessionId: prior.sessionId, action: 'submit-result' }).code).toBe('ASSIGNMENT_REVOKED')
    const count = executions.length
    const secondPromise = startBackgroundPiReview({ caseId: first.caseId, mode: 'update' }, windowContents)
    while (executions.length === count) await Bun.sleep(0)
    const second = executions.at(-1)!
    expect(second.input.sessionId).toBe(first.execution.input.sessionId)
    second.owned()
    const secondAck = await secondPromise
    expect(secondAck.runId).not.toBe(firstAck.runId)
    expect(secondAck.phase).toBe('accepted')
    await expect(stopBackgroundPiReview({ caseId: first.caseId, runId: firstAck.runId! })).rejects.toThrow('运行已变化')
    first.execution.input.onRunOutcome?.({ status: 'failed', error: '迟到旧轮失败' })
    expect(getRunV2(first.caseId, firstAck.runId!)?.error).toBe('合成执行失败')
    expect(getRunV2(first.caseId, secondAck.runId!)?.status).toBe('running')
    expect(active.has(second.input.sessionId)).toBeTrue()
    second.end('completed')
    await Bun.sleep(0)
    expect(getRunV2(first.caseId, secondAck.runId!)?.status).toBe('partially-completed')
  })

  test('P06-S01 stop must release before restart; late callback never mutates new owner', async () => {
    const first = await pendingExecution()
    first.execution.owned()
    const firstAck = await first.admission
    let release!: () => void
    stopGate = new Promise<void>((resolve) => { release = resolve })
    try {
      const stopping = stopBackgroundPiReview({ caseId: first.caseId, runId: firstAck.runId! })
      await expect(startBackgroundPiReview({ caseId: first.caseId, mode: 'restart' }, windowContents)).rejects.toThrow('正在启动或停止')
      expect(getRunV2(first.caseId, firstAck.runId!)?.status).toBe('running')
      release()
      expect((await stopping).runStatus).toBe('cancelled')
      expect(active.has(first.execution.input.sessionId)).toBeFalse()
    } finally {
      release()
      stopGate = null
    }
    const count = executions.length
    const secondPromise = startBackgroundPiReview({ caseId: first.caseId, mode: 'restart' }, windowContents)
    while (executions.length === count) await Bun.sleep(0)
    const second = executions.at(-1)!
    expect(second.input.sessionId).not.toBe(first.execution.input.sessionId)
    second.owned()
    const secondAck = await secondPromise
    expect(secondAck.runId).not.toBe(firstAck.runId)
    await expect(stopBackgroundPiReview({ caseId: first.caseId, runId: firstAck.runId! })).rejects.toThrow('运行已变化')
    first.execution.input.onRunOutcome?.({ status: 'failed', error: '迟到旧轮异常' })
    expect(getRunV2(first.caseId, firstAck.runId!)?.status).toBe('cancelled')
    expect(getRunV2(first.caseId, secondAck.runId!)?.status).toBe('running')
    expect(active.has(second.input.sessionId)).toBeTrue()
    second.end('completed')
    await Bun.sleep(0)
  })

  test('实际注册 IPC 拒绝非主窗口，旧 prepare/abort/指派入口不能操作新 owner', async () => {
    const hooks = globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & { ipcMainHandlers: Map<string, (...args: any[]) => any> }
    hooks.ipcMainHandlers.clear()
    registerReviewIpc()
    setMainWindow({ isDestroyed: () => false, webContents: windowContents } as unknown as BrowserWindow)
    const handlers = hooks.ipcMainHandlers
    expect(() => handlers.get(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2)!({ sender: { isDestroyed: () => false } }, {})).toThrow('仅允许')
    expect(() => handlers.get(REVIEW_IPC_CHANNELS.STOP_BACKGROUND_PI_REVIEW_V2)!({ sender: { isDestroyed: () => false } }, {})).toThrow('仅允许')
    const context = await pendingExecution()
    context.execution.owned()
    const receipt = await context.admission
    const binding = getPiReviewBindingForSession(context.execution.input.sessionId)!
    expect(() => handlers.get(REVIEW_IPC_CHANNELS.PREPARE_PI_REVIEW_V2)!({}, { caseId: context.caseId, sessionId: binding.sessionId, turnId: randomUUID() })).toThrow()
    expect(() => handlers.get(REVIEW_IPC_CHANNELS.ABORT_PI_REVIEW_V2)!({}, binding)).toThrow()
    expect(() => handlers.get(REVIEW_IPC_CHANNELS.ASSIGNMENT_REVOKE_V2)!({}, binding.assignmentId)).toThrow()
    expect(handlers.get(REVIEW_IPC_CHANNELS.GET_PI_REVIEW_SESSION_V2)!({}, context.caseId)).toBeNull()
    expect(handlers.get(REVIEW_IPC_CHANNELS.ASSIGNMENT_LIST_V2)!({})).not.toContainEqual(expect.objectContaining({ sessionId: binding.sessionId }))
    expect(getRunV2(context.caseId, receipt.runId!)?.status).toBe('running')
    context.execution.end('completed')
    await Bun.sleep(0)
    setMainWindow(null)
  })
})
