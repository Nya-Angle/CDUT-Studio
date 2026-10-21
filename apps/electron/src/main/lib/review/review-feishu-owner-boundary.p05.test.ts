/**
 * P05-S02 controlled Feishu owner isolation tests. No real Feishu network connection.
 */
import { afterAll, describe, expect, spyOn, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { AgentStreamPayload, FeishuChatBinding, FeishuMessageContext } from '@profer/shared'
import { createAgentSession, createReviewOwnedAgentSession, deleteAgentSession } from '../agent-session-manager'
import { createAgentWorkspace } from '../agent-workspace-manager'
import { getFeishuBotBindingsPath } from '../config-paths'
import { FeishuBridge } from '../feishu-bridge'
import { feishuBridgeManager } from '../feishu-bridge-manager'

const dir = mkdtempSync(join(tmpdir(), 'p05-feishu-'))
process.env.PROFER_CONFIG_DIR = dir
afterAll(() => rmSync(dir, { recursive: true, force: true }))

type BridgeInternals = {
  client: unknown
  lastInteractedUserOpenId: string | null
  chatBindings: Map<string, FeishuChatBinding>
  sessionToChat: Map<string, string>
  sessionBuffers: Map<string, { text: string; toolSummaries: Map<string, unknown>; startedAt: number }>
  loadBindings(): void
  handleStopCommand(ctx: FeishuMessageContext): Promise<void>
  handleNowCommand(ctx: FeishuMessageContext): Promise<void>
  handleModelCommand(ctx: FeishuMessageContext, arg: string): Promise<void>
  handleUserMessage(ctx: FeishuMessageContext, text: string): Promise<void>
  handleAgentPayload(sessionId: string, payload: AgentStreamPayload): void
  sendMessage(chatId: string, message: string): Promise<void>
  createSessionMirrorGroup(userId: string, name: string): Promise<string | null>
  updateSessionMirrorGroupName(sessionId: string, title: string): void
}
const internal = (bridge: FeishuBridge) => bridge as unknown as BridgeInternals
const fixture = () => {
  const id = randomUUID().slice(0, 10)
  const workspace = createAgentWorkspace('P05 Feishu ' + id)
  const owned = createReviewOwnedAgentSession({
    caseId: 'p05-feishu-' + id, title: 'private-' + id, channelId: 'mock', workspaceId: workspace.id,
  })
  const normal = createAgentSession('ordinary-' + id, 'mock', workspace.id)
  const bridge = new FeishuBridge({ id: 'p05-' + id, name: 'Test Bot', enabled: false, appId: '', appSecret: '' })
  const binding = (sessionId: string, chatId: string): FeishuChatBinding => ({
    chatId, botId: 'p05-' + id, userId: 'test-user', sessionId, workspaceId: workspace.id,
    channelId: 'mock', source: 'session-mirror', chatType: 'group', createdAt: Date.now(),
  })
  const ctx = (chatId: string) => ({ chatId, senderOpenId: 'test-user' } as FeishuMessageContext)
  return { bridge, owned, normal, binding, ctx }
}
describe('P05-S02 Feishu owner-boundary security', () => {
  test('restore from old persisted chat bindings skips live owner but preserves ordinary binding', () => {
    const { bridge, owned, normal, binding } = fixture()
    const botId = (bridge as unknown as { botConfig: { id: string } }).botConfig.id
    const path = getFeishuBotBindingsPath(botId)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, JSON.stringify([binding(owned.id, 'secret-chat'), binding(normal.id, 'normal-chat')]))
    const b = internal(bridge)
    b.loadBindings()
    expect(bridge.listBindings().map(x => x.chatId)).toEqual(['normal-chat'])
    expect(b.sessionToChat.has(owned.id)).toBe(false)
    expect(b.sessionToChat.get(normal.id)).toBe('normal-chat')
  })

  test('old binding to deleted owner remains suppressed after metadata deletion', () => {
    const { bridge, owned, normal, binding } = fixture()
    const b = internal(bridge)
    b.chatBindings.set('hidden', binding(owned.id, 'hidden'))
    b.chatBindings.set('normal', binding(normal.id, 'normal'))
    deleteAgentSession(owned.id)
    expect(bridge.listBindings().map(x => x.sessionId)).toEqual([normal.id])
    expect(bridge.getStatus().activeBindings).toBe(1)
  })

  test('binding updates cannot target hidden owner or mutate stale hidden binding', () => {
    const { bridge, owned, normal, binding } = fixture()
    const b = internal(bridge)
    b.chatBindings.set('normal', binding(normal.id, 'normal'))
    b.chatBindings.set('hidden', binding(owned.id, 'hidden'))
    expect(bridge.updateBinding({ chatId: 'normal', sessionId: owned.id })).toBeNull()
    expect(bridge.updateBinding({ chatId: 'hidden', workspaceId: 'new' })).toBeNull()
    expect(b.chatBindings.get('normal')?.sessionId).toBe(normal.id)
    expect(b.chatBindings.get('hidden')?.workspaceId).not.toBe('new')
    expect(bridge.updateBinding({ chatId: 'normal', sessionId: normal.id })?.sessionId).toBe(normal.id)
  })

  test('direct mirror creation / streaming cannot bind live or deleted owner, normal mirror still works', async () => {
    const { bridge, owned, normal } = fixture()
    const b = internal(bridge)
    b.client = {}
    b.lastInteractedUserOpenId = 'test-user'
    const create = spyOn(b, 'createSessionMirrorGroup').mockResolvedValue('synthetic-chat')
    try {
      await bridge.ensureSessionMirror({ ...owned, owner: undefined })
      await bridge.startSessionMirrorRun(owned)
      expect(create).not.toHaveBeenCalled()
      await bridge.ensureSessionMirror(normal)
      expect(create).toHaveBeenCalledTimes(1)
      expect(bridge.listBindings().map(x => x.sessionId)).toEqual([normal.id])
      deleteAgentSession(owned.id)
      await bridge.ensureSessionMirror(owned)
      expect(create).toHaveBeenCalledTimes(1)
    } finally { create.mockRestore() }
  })

  test('old hidden chat cannot stop run, start run from message, disclose /now or change model', async () => {
    const { bridge, owned, binding, ctx } = fixture()
    const b = internal(bridge)
    b.chatBindings.set('hidden', binding(owned.id, 'hidden'))
    const send = spyOn(b, 'sendMessage').mockResolvedValue(undefined)
    try {
      await b.handleStopCommand(ctx('hidden'))
      await b.handleUserMessage(ctx('hidden'), 'please run')
      await b.handleNowCommand(ctx('hidden'))
      await b.handleModelCommand(ctx('hidden'), '1 1')
      expect(send).toHaveBeenCalledTimes(4)
      expect(b.sessionBuffers.has(owned.id)).toBe(false)
      expect(b.chatBindings.get('hidden')?.sessionId).toBe(owned.id)
      expect(send.mock.calls.every(([, message]) => message.includes('当前会话不可用'))).toBe(true)
    } finally { send.mockRestore() }
  })

  test('Agent EventBus handler refuses private and tombstoned owner before updating mirrors or buffers', () => {
    const { bridge, owned, normal } = fixture()
    const b = internal(bridge)
    const rename = spyOn(b, 'updateSessionMirrorGroupName').mockImplementation(() => {})
    const payload = { kind: 'profer_event', event: { type: 'title_updated', title: 'Updated' } } as AgentStreamPayload
    try {
      b.handleAgentPayload(owned.id, payload)
      expect(rename).not.toHaveBeenCalled()
      b.handleAgentPayload(normal.id, payload)
      expect(rename).toHaveBeenCalledTimes(1)
      deleteAgentSession(owned.id)
      b.handleAgentPayload(owned.id, payload)
      expect(rename).toHaveBeenCalledTimes(1)
    } finally { rename.mockRestore() }
  })

  test('manager and bridge mirror guards do not dispatch to connected bridges for owner', async () => {
    const { bridge, owned, normal } = fixture()
    const manager = feishuBridgeManager as unknown as { bridges: Map<string, FeishuBridge> }
    const botId = 'p05-manager-' + randomUUID().slice(0, 8)
    manager.bridges.set(botId, bridge)
    const mirror = spyOn(bridge, 'ensureSessionMirror').mockResolvedValue(undefined)
    const start = spyOn(bridge, 'startSessionMirrorRun').mockResolvedValue(undefined)
    const stop = spyOn(bridge, 'stopSessionMirrorRun').mockImplementation(() => {})
    try {
      await feishuBridgeManager.ensureSessionMirror(owned)
      await feishuBridgeManager.startSessionMirrorRun(owned)
      feishuBridgeManager.stopSessionMirrorRun(owned.id)
      expect(mirror).not.toHaveBeenCalled()
      expect(start).not.toHaveBeenCalled()
      expect(stop).not.toHaveBeenCalled()
      feishuBridgeManager.stopSessionMirrorRun(normal.id)
      expect(stop).toHaveBeenCalledTimes(1)
    } finally { mirror.mockRestore(); start.mockRestore(); stop.mockRestore(); manager.bridges.delete(botId) }
  })
})
