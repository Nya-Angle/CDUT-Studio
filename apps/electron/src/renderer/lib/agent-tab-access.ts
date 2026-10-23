import { isReviewOwnedAgentSession, type AgentSessionMeta } from '@profer/shared'
import type { TabItem } from '@/atoms/tab-atoms'
import { agentSessionsAtom } from '@/atoms/agent-atoms'
import { upsertAgentSession } from '@/lib/agent-session-list'
import { atom, getDefaultStore } from 'jotai'

type Store = ReturnType<typeof getDefaultStore>

/** Renderer-local revocations stop queued events after a delete notification. */
export const revokedAgentSessionIdsAtom = atom<ReadonlySet<string>>(new Set<string>())

export function markAgentSessionRevoked(store: Store, id: string): void {
  store.set(revokedAgentSessionIdsAtom, (previous) => new Set([...previous, id]))
}

/** Historical settings are untrusted. Only persisted, still-existing ordinary Agent sessions can restore. */
export function selectRestorableAgentTabs(
  snapshots: readonly unknown[],
  sessions: readonly AgentSessionMeta[],
  visibleWorkspaceIds: ReadonlySet<string>,
): TabItem[] {
  const byId = new Map(sessions.map((session) => [session.id, session]))
  return snapshots.filter((value): value is TabItem => {
    if (!value || typeof value !== 'object') return false
    const tab = value as Partial<TabItem>
    if (tab.type !== 'agent' || typeof tab.sessionId !== 'string'
      || typeof tab.id !== 'string' || tab.id !== tab.sessionId
      || typeof tab.title !== 'string') return false
    const session = byId.get(tab.sessionId)
    return !!session && !isReviewOwnedAgentSession(session)
      && (!session.workspaceId || visibleWorkspaceIds.has(session.workspaceId))
  })
}

/** Work tabs must not bootstrap a session from an ID or stale Browser/Preview payload. */
export function canOpenOrdinaryWorkTab(
  sessions: readonly AgentSessionMeta[],
  sessionId: string,
): boolean {
  const session = sessions.find((item) => item.id === sessionId)
  return !!session && !isReviewOwnedAgentSession(session)
}

/** The Main GET_SESSION_META endpoint hides internal owners and returns null for removed sessions. */
export async function resolveOrdinaryTabSession(
  sessionId: string,
  load: (id: string) => Promise<AgentSessionMeta | null>,
): Promise<AgentSessionMeta | null> {
  if (!sessionId.trim()) return null
  try {
    const session = await load(sessionId)
    return session?.id === sessionId && !isReviewOwnedAgentSession(session) ? session : null
  } catch {
    return null
  }
}

/**
 * Bounded compatibility fallback for an ordinary session whose browser/preview event
 * outran renderer metadata hydration. Main GET_SESSION_META is the authority.
 * Never authorize an unknown ID solely from a work-tab event/payload.
 */
export async function ensureOrdinaryWorkTabOwner(
  store: Store,
  sessionId: string,
  load: (id: string) => Promise<AgentSessionMeta | null>,
  isCurrent: () => boolean = () => true,
): Promise<boolean> {
  if (!isCurrent() || store.get(revokedAgentSessionIdsAtom).has(sessionId)) return false
  if (canOpenOrdinaryWorkTab(store.get(agentSessionsAtom), sessionId)) return true
  if (store.get(agentSessionsAtom).some((item) => item.id === sessionId)) return false
  const meta = await resolveOrdinaryTabSession(sessionId, load)
  if (!meta || !isCurrent() || store.get(revokedAgentSessionIdsAtom).has(sessionId)) return false
  // A newer local owner record must never be replaced by an older async Main response.
  if (store.get(agentSessionsAtom).some((item) => item.id === sessionId
    && isReviewOwnedAgentSession(item))) return false
  store.set(agentSessionsAtom, (previous) => upsertAgentSession(previous, meta))
  return canOpenOrdinaryWorkTab(store.get(agentSessionsAtom), sessionId)
}
