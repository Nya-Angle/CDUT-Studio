/** P06-E06 实机反例：真实 Orchestrator 必须把权限回调送入 Pi Adapter。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { SDKMessage } from '@profer/shared'
import { PiAgentAdapter, type PiAgentQueryOptions } from './adapters/pi-agent-adapter'

const profile = mkdtempSync(join(tmpdir(), 'p06-pi-permission-wiring-'))
process.env.PROFER_CONFIG_DIR = profile
afterAll(() => rmSync(profile, { recursive: true, force: true }))
// 与 Main 的模块初始化顺序一致，避免从 class 入口反向引入 service 单例循环。
await import('./agent-service')
const { AgentOrchestrator } = await import('./agent-orchestrator')
const { AgentEventBus } = await import('./agent-event-bus')
const { createAgentSession } = await import('./agent-session-manager')
const { createChannel } = await import('./channel-manager')
const { permissionService } = await import('./agent-permission-service')
const channel = createChannel({ name: '合成权限渠道', provider: 'deepseek', baseUrl: 'https://example.invalid', apiKey: 'synthetic-key', enabled: true,
  models: [{ id: 'synthetic-model', name: '合成模型', enabled: true }] })

class WitnessAdapter extends PiAgentAdapter {
  calls = 0
  captured?: PiAgentQueryOptions
  action: (options: PiAgentQueryOptions) => Promise<void> = async () => {}
  override async *query(options: PiAgentQueryOptions): AsyncIterable<SDKMessage> {
    this.calls++; this.captured = options
    await this.action(options)
    yield { type: 'result', subtype: 'success', session_id: 'synthetic-sdk-session', result: '合成执行结束' } as SDKMessage
  }
}
const callbacks = { onError() {}, onComplete() {}, onTitleUpdated() {} }
const options = { signal: new AbortController().signal, toolUseID: 'synthetic-write-call' }

describe('P06 普通 Pi 权限真实接线', () => {
  test('auto Write 确实进入现有权限 pending，人工拒绝传回 Adapter', async () => {
    const session = createAgentSession('合成 auto 权限', channel.id, undefined, 'synthetic-model', 'pi')
    const adapter = new WitnessAdapter(), orchestrator = new AgentOrchestrator(adapter, new AgentEventBus())
    let denied = false
    adapter.action = async input => {
      if (!input.canUseTool) return
      const pending = input.canUseTool('Write', { file_path: 'synthetic.txt', content: '合成内容' }, options)
      const request = permissionService.getPendingRequests().find(r => r.sessionId === session.id)
      expect(request?.toolName).toBe('Write')
      permissionService.respondToPermission(request!.requestId, 'deny', false)
      denied = (await pending).behavior === 'deny'
    }
    await orchestrator.sendMessage({ sessionId: session.id, channelId: channel.id, modelId: 'synthetic-model', agentRuntime: 'pi',
      triggeredBy: 'user', uuid: randomUUID(), userMessage: '合成 Write 权限验证', permissionModeOverride: 'auto' }, callbacks)
    expect(adapter.calls).toBeGreaterThan(0)
    expect(typeof adapter.captured?.canUseTool).toBe('function')
    expect(denied).toBeTrue()
    expect(permissionService.getPendingRequests().some(r => r.sessionId === session.id)).toBeFalse()
  })

  test('同一真实查询的回调支持 Read、plan 拒止和运行中恢复 bypass', async () => {
    const session = createAgentSession('合成模式热切换', channel.id, undefined, 'synthetic-model', 'pi')
    const adapter = new WitnessAdapter(), orchestrator = new AgentOrchestrator(adapter, new AgentEventBus())
    let readAllowed = false, planDenied = false, recovered = false
    adapter.action = async input => {
      if (!input.canUseTool) return
      readAllowed = (await input.canUseTool('Read', { file_path: 'synthetic.txt' }, options)).behavior === 'allow'
      await orchestrator.updateSessionPermissionMode(session.id, 'plan')
      planDenied = (await input.canUseTool('Write', { file_path: 'synthetic.txt', content: '合成内容' }, options)).behavior === 'deny'
      await orchestrator.updateSessionPermissionMode(session.id, 'bypassPermissions')
      recovered = (await input.canUseTool('Write', { file_path: 'synthetic.txt', content: '合成内容' }, options)).behavior === 'allow'
    }
    await orchestrator.sendMessage({ sessionId: session.id, channelId: channel.id, modelId: 'synthetic-model', agentRuntime: 'pi',
      triggeredBy: 'user', uuid: randomUUID(), userMessage: '合成模式切换验证', permissionModeOverride: 'auto' }, callbacks)
    expect(adapter.calls).toBeGreaterThan(0)
    expect(readAllowed).toBeTrue()
    expect(planDenied).toBeTrue()
    expect(recovered).toBeTrue()
  })
})
