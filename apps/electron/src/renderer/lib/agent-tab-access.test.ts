import { expect, test } from 'bun:test'
import { createStore } from 'jotai'
import type { BrowserViewState } from '@profer/shared'
import { agentSessionsAtom } from '@/atoms/agent-atoms'
import { tabsAtom } from '@/atoms/tab-atoms'
import { previewFileMapAtom } from '@/atoms/preview-atoms'
import { openFilePreviewTab, openFilePreviewTabAuthorized } from '@/components/diff/preview-opener'
import { reconcileBrowserTabs } from './browser-tab'
import type { AgentSessionMeta } from '@profer/shared'
import { canOpenOrdinaryWorkTab, ensureOrdinaryWorkTabOwner, markAgentSessionRevoked, resolveOrdinaryTabSession, selectRestorableAgentTabs } from './agent-tab-access'

const session = (id: string, extra: Partial<AgentSessionMeta> = {}): AgentSessionMeta => ({
  id, title: id, createdAt: 1, updatedAt: 1, agentRuntime: 'pi', ...extra,
} as AgentSessionMeta)
const ordinary = session('ordinary')
const archived = session('archived', { archived: true })
const draft = session('draft', { draft: true })
const internal = session('internal', { owner: { kind: 'review-case', caseId: 'case-a' } })
const otherWorkspace = session('team', { workspaceId: 'hidden-workspace' })
const snap = (id: string) => ({ id, sessionId: id, type: 'agent', title: id })

test('historical and legacy persisted tabs restore ordinary, archived and project draft but not internal owners', () => {
  const tabs = [snap('internal'), snap('ordinary'), snap('archived'), snap('draft'), snap('deleted'),
    snap('team'), { ...snap('ordinary'), id: '__preview__:ordinary:file' },
    { ...snap('internal'), type: 'browser', id: '__browser__:internal:t' }, null, { type: 'agent' }]
  const result = selectRestorableAgentTabs(tabs, [ordinary, archived, draft, internal, otherWorkspace], new Set())
  expect(result.map(t => t.id)).toEqual(['ordinary', 'archived', 'draft'])
})

test('restoration permits only sessions from visible workspaces and validates tab identity', () => {
  const tabs = [snap('team'), snap('ordinary'), { ...snap('ordinary'), id: 'internal' }]
  expect(selectRestorableAgentTabs(tabs, [ordinary, otherWorkspace], new Set(['hidden-workspace']))
    .map(t => t.id)).toEqual(['team', 'ordinary'])
})

test('Preview/Browser work tabs require an already known, ordinary owner', () => {
  expect(canOpenOrdinaryWorkTab([ordinary, internal], 'ordinary')).toBe(true)
  expect(canOpenOrdinaryWorkTab([ordinary, internal], 'internal')).toBe(false)
  expect(canOpenOrdinaryWorkTab([ordinary, internal], 'stale')).toBe(false)
})

test('late Main metadata denies internal, deleted, mismatched and failing ID lookups', async () => {
  expect(await resolveOrdinaryTabSession('internal', async () => internal)).toBeNull()
  expect(await resolveOrdinaryTabSession('missing', async () => null)).toBeNull()
  expect(await resolveOrdinaryTabSession('ordinary', async () => archived)).toBeNull()
  expect(await resolveOrdinaryTabSession('ordinary', async () => { throw Error('stale window') })).toBeNull()
  expect(await resolveOrdinaryTabSession('', async () => ordinary)).toBeNull()
})

test('reopen accepts Main-authorized ordinary archived session without trusting stale local cache', async () => {
  const restored = await resolveOrdinaryTabSession('archived', async (id) => id === 'archived' ? archived : null)
  expect(restored?.id).toBe('archived')
})

test('Preview opener cannot resurrect a hidden or deleted owner from a stale file event', () => {
  const store = createStore()
  store.set(agentSessionsAtom, [ordinary])
  expect(openFilePreviewTab(store, 'internal', { filePath: '/tmp/secret.png' })).toBe('')
  expect(openFilePreviewTab(store, 'deleted', { filePath: '/tmp/deleted.png' })).toBe('')
  expect(store.get(tabsAtom)).toHaveLength(0)
  const allowed = openFilePreviewTab(store, 'ordinary', { filePath: '/tmp/regular.png' })
  expect(allowed).toBe('/tmp/regular.png')
  expect(store.get(previewFileMapAtom).get('ordinary')).toEqual({ filePath: '/tmp/regular.png', readOnly: true })
  expect(store.get(tabsAtom)).toHaveLength(0)
})

test('Browser restore/push reconciliation refuses unknown review sessions without disrupting normal browser tabs', () => {
  const store = createStore()
  store.set(agentSessionsAtom, [ordinary])
  const makeState = (sessionId: string): BrowserViewState => ({
    sessionId, activeTabId: 'page-1',
    tabs: [{ tabId: 'page-1', url: 'https://example.com', title: 'Example' }],
  } as BrowserViewState)
  expect(reconcileBrowserTabs(store, makeState('internal'))).toBeNull()
  expect(store.get(tabsAtom)).toHaveLength(0)
  expect(reconcileBrowserTabs(store, makeState('ordinary'))).toBe('__browser__:ordinary:page-1')
  expect(store.get(tabsAtom).some(t => t.type === 'browser' && t.sessionId === 'ordinary')).toBe(true)
  expect(reconcileBrowserTabs(store, makeState('deleted'))).toBeNull()
  expect(store.get(tabsAtom).some(t => t.sessionId === 'deleted')).toBe(false)
})

test('early ordinary Preview/Browser event gets a single Main-authorized hydration fallback', async () => {
  const store = createStore()
  let lookups = 0
  const load = async (id: string) => {
    lookups += 1
    return id === ordinary.id ? ordinary : null
  }
  expect(store.get(agentSessionsAtom)).toHaveLength(0)
  const preview = await openFilePreviewTabAuthorized(store, 'ordinary', { filePath: '/tmp/early.png' },
    { activate: false }, () => true, load)
  expect(preview).toBe('/tmp/early.png')
  expect(store.get(previewFileMapAtom).get('ordinary')).toEqual({ filePath: '/tmp/early.png', readOnly: true })
  expect(lookups).toBe(1)
  expect(store.get(agentSessionsAtom).map(s => s.id)).toEqual(['ordinary'])
  const browser: BrowserViewState = {
    sessionId: 'ordinary', activeTabId: 't',
    tabs: [{ tabId: 't', url: 'https://example.org', title: 'Early Browser' }],
  } as BrowserViewState
  expect(reconcileBrowserTabs(store, browser)).toBe('__browser__:ordinary:t')
  expect(lookups).toBe(1)
})

test('early internal/removed and forged Main session metadata cannot open work tabs', async () => {
  const store = createStore()
  for (const [id, load] of [
    ['internal', async () => internal],
    ['gone', async () => null],
    ['mismatch', async () => ordinary],
    ['throwing', async (): Promise<AgentSessionMeta | null> => { throw new Error('closed window') }],
  ] as const) {
    const result = await openFilePreviewTabAuthorized(store, id, { filePath: '/tmp/denied.png' },
      {}, () => true, load)
    expect(result).toBe('')
  }
  expect(store.get(previewFileMapAtom).size).toBe(0)
  expect(store.get(agentSessionsAtom)).toEqual([])
  expect(store.get(tabsAtom)).toEqual([])
})

test('deletion during pending Main authorization revokes the queued normal work tab', async () => {
  const store = createStore()
  let resume!: (meta: AgentSessionMeta | null) => void
  const loading = new Promise<AgentSessionMeta | null>((resolve) => { resume = resolve })
  const pending = openFilePreviewTabAuthorized(store, 'ordinary', { filePath: '/tmp/late.png' },
    {}, () => true, () => loading)
  markAgentSessionRevoked(store, 'ordinary')
  resume(ordinary)
  expect(await pending).toBe('')
  expect(store.get(previewFileMapAtom).size).toBe(0)
  expect(store.get(agentSessionsAtom)).toHaveLength(0)
  expect(store.get(tabsAtom)).toHaveLength(0)
  store.set(agentSessionsAtom, [ordinary])
  expect(openFilePreviewTab(store, 'ordinary', { filePath: '/tmp/replayed.png' })).toBe('')
  expect(await ensureOrdinaryWorkTabOwner(store, 'ordinary', async () => ordinary)).toBe(false)
})

test('Main-authorized work tabs preserve archived and draft normal session compatibility', async () => {
  const store = createStore()
  expect(await ensureOrdinaryWorkTabOwner(store, 'archived', async () => archived)).toBe(true)
  expect(await ensureOrdinaryWorkTabOwner(store, 'draft', async () => draft)).toBe(true)
  expect(store.get(agentSessionsAtom).map(s => s.id).sort()).toEqual(['archived', 'draft'])
})
