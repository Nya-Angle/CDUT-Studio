/**
 * P05-S05 real loopback WS integration; synthetic sessions and private payloads only.
 * Local socket tests are NOT a real Pocket/Feishu device or production Relay E2E.
 */
import { afterAll, beforeAll, describe, expect, spyOn, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createServer as createNetServer } from 'node:net'
import { createServer as createHttpServer } from 'node:http'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import WebSocket, { WebSocketServer } from 'ws'
import type { AgentStreamPayload } from '@profer/shared'
import * as authService from '../auth-service'
import { createAgentSession, createReviewOwnedAgentSession, deleteAgentSession } from '../agent-session-manager'
import { createAgentWorkspace } from '../agent-workspace-manager'
import { getWorkspaceFilesDir } from '../config-paths'
import { agentEventBus } from '../agent-service'
import { handleRemoteRelayCommand, getRemoteServiceStatus, startRemoteService, stopRemoteService } from '../remote-service'
import { RemoteRelayClient } from '../remote-relay-client'

const dir = mkdtempSync(join(tmpdir(), 'p05-real-ws-'))
process.env.PROFER_CONFIG_DIR = dir
const token = 'p05-ws-token-' + randomUUID()
process.env.PROFER_REMOTE = '1'
process.env.PROFER_REMOTE_RELAY = '0'
process.env.PROFER_REMOTE_HOST = '127.0.0.1'
process.env.PROFER_REMOTE_TOKEN = token

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
async function until<T>(fn: () => T | undefined | false, ms = 6000): Promise<T> {
  const started = Date.now()
  while (Date.now() - started < ms) {
    const value = fn()
    if (value) return value
    await sleep(12)
  }
  throw new Error('Timed out waiting for loopback WS condition')
}
async function reservePort(): Promise<number> {
  const server = createNetServer()
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  await new Promise<void>((resolve) => server.close(() => resolve()))
  return port
}
type Frame = Record<string, unknown>
type SocketFixture = { socket: WebSocket; frames: Frame[]; send: (command: Record<string, unknown>) => void }
const clients: WebSocket[] = []
async function connect(port: number, candidate = token): Promise<SocketFixture> {
  const socket = new WebSocket('ws://127.0.0.1:' + port + '/ws?token=' + encodeURIComponent(candidate))
  clients.push(socket)
  const frames: Frame[] = []
  socket.on('message', (raw) => {
    try { frames.push(JSON.parse(String(raw)) as Frame) } catch { /* ignore */ }
  })
  await until(() => frames.find(x => x.kind === 'hello') || (socket.readyState === WebSocket.CLOSED ? { kind: 'closed' } : undefined))
  return { socket, frames, send: (obj) => socket.send(JSON.stringify(obj)) }
}
function emit(id: string, name: string, extra: Record<string, unknown> = {}) {
  agentEventBus.emit(id, {
    kind: 'profer_event', event: { type: 'run_idle', sessionId: id, p05Marker: name, ...extra },
  } as unknown as AgentStreamPayload)
}
let port = 0
let normalId = ''
let privateId = ''
let sharedFile = ''
beforeAll(async () => {
  const ws = createAgentWorkspace('P05 WS ' + randomUUID().slice(0, 9))
  const normal = createAgentSession('ordinary-loopback', 'mock', ws.id)
  const owner = createReviewOwnedAgentSession({
    caseId: 'p05-ws-' + randomUUID().slice(0, 9), title: 'private-loopback', channelId: 'mock', workspaceId: ws.id,
  })
  normalId = normal.id
  privateId = owner.id
  sharedFile = join(getWorkspaceFilesDir(ws.slug), 'shared-loopback.txt')
  mkdirSync(getWorkspaceFilesDir(ws.slug), { recursive: true })
  writeFileSync(sharedFile, 'shared-data')
  port = await reservePort()
  process.env.PROFER_REMOTE_PORT = String(port)
  startRemoteService()
  await until(() => getRemoteServiceStatus().running)
})
afterAll(async () => {
  for (const client of clients) {
    try { client.terminate() } catch { /* ignore */ }
  }
  stopRemoteService()
  rmSync(dir, { recursive: true, force: true })
})

describe('P05-S05 local WebSocket real socket isolation', () => {
  test('authenticated handshake and invalid token rejection use real sockets', async () => {
    const ok = await connect(port)
    expect(ok.frames[0]?.kind).toBe('hello')
    expect(typeof ok.frames[0]?.serverInstanceId).toBe('string')
    ok.socket.close()
    const unauthorized = new WebSocket('ws://127.0.0.1:' + port + '/ws?token=incorrect')
    clients.push(unauthorized)
    let closed = 0
    unauthorized.on('close', (code) => { closed = code })
    await until(() => closed || undefined)
    expect(closed).toBe(4001)
  })

  test('two viewers keep independent replay gates, and private owner events do not reach either', async () => {
    const a = await connect(port)
    const b = await connect(port)
    a.send({ type: 'resume_agent_events', requestId: 'ra', cursor: null })
    await until(() => a.frames.some(x => x.kind === 'agent_events_resumed'))
    emit(normalId, 'visible-multi')
    emit(privateId, 'hidden-multi')
    await until(() => a.frames.some(x => x.kind === 'agent_event' && JSON.stringify(x).includes('visible-multi')))
    expect(b.frames.some(x => x.kind === 'agent_event')).toBe(false)
    b.send({ type: 'resume_agent_events', requestId: 'rb', cursor: null })
    await until(() => b.frames.some(x => x.kind === 'agent_events_resumed'))
    expect(b.frames.some(x => x.kind === 'agent_event' && JSON.stringify(x).includes('visible-multi'))).toBe(true)
    for (const viewer of [a, b]) {
      expect(viewer.frames.some(x => JSON.stringify(x).includes('hidden-multi'))).toBe(false)
      viewer.socket.close()
    }
  })

  test('reconnect resumes ordered ordinary events and returns a completion acknowledgement', async () => {
    const first = await connect(port)
    first.send({ type: 'resume_agent_events', requestId: 'first', cursor: null })
    await until(() => first.frames.some(x => x.kind === 'agent_events_resumed'))
    emit(normalId, 'cursor-one')
    const seen = await until(() => first.frames.find(x => x.kind === 'agent_event' && JSON.stringify(x).includes('cursor-one')))
    const cursor = seen.eventId as number
    first.socket.close()
    emit(normalId, 'cursor-two')
    emit(privateId, 'cursor-private')
    const second = await connect(port)
    second.send({ type: 'resume_agent_events', requestId: 'resume', cursor })
    const ack = await until(() => second.frames.find(x => x.kind === 'agent_events_resumed' && x.requestId === 'resume'))
    expect(ack.requiresSnapshot).toBe(false)
    const received = second.frames.filter(x => x.kind === 'agent_event')
    expect(received.some(x => JSON.stringify(x).includes('cursor-two'))).toBe(true)
    expect(received.some(x => JSON.stringify(x).includes('cursor-private'))).toBe(false)
    expect(received.every(x => typeof x.eventId === 'number' && (x.eventId as number) > cursor)).toBe(true)
    second.socket.close()
  })

  test('old owner tombstone and nested owner ID are suppressed for live and reconnect', async () => {
    const a = await connect(port)
    a.send({ type: 'resume_agent_events', requestId: 'visible', cursor: null })
    await until(() => a.frames.some(x => x.kind === 'agent_events_resumed'))
    const before = a.frames.length
    emit(normalId, 'nested-hidden', { targetSessionId: privateId })
    await sleep(35)
    expect(a.frames.length).toBe(before)
    deleteAgentSession(privateId)
    emit(privateId, 'tombstone-event')
    emit(normalId, 'nested-deleted', { relatedSessionIds: [privateId] })
    await sleep(35)
    expect(a.frames.length).toBe(before)
    emit(normalId, 'ordinary-post-deletion')
    await until(() => a.frames.some(x => JSON.stringify(x).includes('ordinary-post-deletion')))
    a.socket.close()
  })

  test('invalid resume cursor requests fresh snapshot without replaying old events', async () => {
    const a = await connect(port)
    a.send({ type: 'resume_agent_events', requestId: 'invalid', cursor: -1 })
    const ack = await until(() => a.frames.find(x => x.kind === 'agent_events_resumed' && x.requestId === 'invalid'))
    expect(ack.requiresSnapshot).toBe(true)
    expect(a.frames.filter(x => x.kind === 'agent_event')).toEqual([])
    a.socket.close()
  })

  test('ordinary LAN viewer retains legacy active session file preview fallback', async () => {
    const a = await connect(port)
    a.send({ type: 'session_detail', sessionId: normalId, requestId: 'detail' })
    await until(() => a.frames.find(x => x.kind === 'command_result' && x.requestId === 'detail'))
    a.send({ type: 'resolve_and_read_file', filePath: sharedFile, requestId: 'file' })
    const file = await until(() => a.frames.find(x => x.kind === 'command_result' && x.requestId === 'file'))
    expect(file.ok).toBe(true)
    a.socket.close()
  })

  test('Relay stateless command boundary does not borrow sessionId from another viewer', async () => {
    expect((await handleRemoteRelayCommand(JSON.stringify({ type: 'session_detail', sessionId: normalId }))).ok).toBe(true)
    const inherited = await handleRemoteRelayCommand(JSON.stringify({ type: 'resolve_and_read_file', filePath: sharedFile }))
    expect(inherited).toEqual({ ok: false, error: '缺少 filePath 或 sessionId' })
    const explicit = await handleRemoteRelayCommand(JSON.stringify({ type: 'resolve_and_read_file', filePath: sharedFile, sessionId: normalId }))
    expect(explicit.ok).toBe(true)
    expect((await handleRemoteRelayCommand(JSON.stringify({ type: 'session_detail', sessionId: privateId }))).ok).toBe(false)
  })
})

describe('P05-S05 actual RelayClient loopback transport (mocked ticket only)', () => {
  test('real socket sends relay_auth and reconnects after server close without carrying old sink', async () => {
    const ticket = spyOn(authService, 'getRemoteRelayTicket').mockResolvedValue({ ticket: 'synthetic-ticket', expiresAt: Date.now() + 120_000 })
    const relayHttp = createHttpServer()
    const relayServer = new WebSocketServer({ server: relayHttp })
    await new Promise<void>((resolve, reject) => {
      relayHttp.once('error', reject)
      relayHttp.listen(0, '127.0.0.1', () => resolve())
    })
    const address = relayHttp.address()
    const relayPort = typeof address === 'object' && address ? address.port : 0
    const received: string[] = []
    const connections: WebSocket[] = []
    relayServer.on('connection', (socket) => {
      connections.push(socket)
      socket.on('message', (raw) => received.push(String(raw)))
    })
    const client = new RemoteRelayClient({
      url: 'ws://127.0.0.1:' + relayPort,
      onOpen: (sink) => { sink.send(JSON.stringify({ kind: 'hello', synthetic: true })) },
    })
    try {
      client.start()
      await until(() => received.some(x => x.includes('relay_auth')))
      expect(received.some(x => x.includes('synthetic-ticket'))).toBe(true)
      expect(received.some(x => x.includes('"hello"'))).toBe(true)
      connections[0]?.close()
      await until(() => connections.length >= 2, 9000)
      await until(() => received.filter(x => x.includes('relay_auth')).length >= 2)
      expect(client.getSink()?.isOpen()).toBe(true)
      client.stop()
      expect(client.getSink()).toBeNull()
    } finally {
      client.stop()
      for (const s of connections) s.terminate()
      await new Promise<void>((resolve) => relayServer.close(() => resolve()))
      await new Promise<void>((resolve) => relayHttp.close(() => resolve()))
      ticket.mockRestore()
    }
  })
})
