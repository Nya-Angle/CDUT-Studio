/** P04-S04 controlled Main pending-request permission boundary (no real Electron window). */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  createAgentSession,
  createReviewOwnedAgentSession,
  deleteAgentSession,
} from '../agent-session-manager'
import { filterOrdinaryPendingRequests, assertOrdinaryPendingRequestId } from '../agent-ordinary-pending-access'

const root = mkdtempSync(join(tmpdir(), 'p04-pending-'))
process.env.PROFER_CONFIG_DIR = root
afterAll(() => rmSync(root, { recursive: true, force: true }))

describe('P04-S04 pending prompt ordinary access', () => {
  test('ordinary snapshot filters live internal owners and deleted-owner tombstones', () => {
    const owner = createReviewOwnedAgentSession({ caseId: 'p04-pending', title: 'private', channelId: 'mock' })
    const ordinary = createAgentSession('ordinary', 'mock')
    const entries = [
      { requestId: 'private', sessionId: owner.id },
      { requestId: 'public', sessionId: ordinary.id },
    ]
    expect(filterOrdinaryPendingRequests(entries).map(item => item.requestId)).toEqual(['public'])
    deleteAgentSession(owner.id)
    expect(filterOrdinaryPendingRequests(entries).map(item => item.requestId)).toEqual(['public'])
  })

  test('approval route rejects internal request IDs before responding or changing permissions', () => {
    const owner = createReviewOwnedAgentSession({ caseId: 'p04-approval', title: 'private', channelId: 'mock' })
    const ordinary = createAgentSession('ordinary', 'mock')
    const entries = [{ requestId: 'internal', sessionId: owner.id },
      { requestId: 'normal', sessionId: ordinary.id }]
    expect(() => assertOrdinaryPendingRequestId('internal', entries)).toThrow('内部审核会话')
    expect(() => assertOrdinaryPendingRequestId('normal', entries)).not.toThrow()
    expect(() => assertOrdinaryPendingRequestId('not-found', entries)).not.toThrow()
    deleteAgentSession(owner.id)
    expect(() => assertOrdinaryPendingRequestId('internal', entries)).toThrow('内部审核会话')
  })
})
