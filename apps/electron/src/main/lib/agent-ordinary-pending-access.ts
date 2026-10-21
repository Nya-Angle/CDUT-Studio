import { assertOrdinaryAgentSession } from './agent-session-manager'

/** Main's pending-request snapshots are ordinary-UI data; internal review prompts stay private. */
export function filterOrdinaryPendingRequests<T extends { sessionId: string }>(requests: readonly T[]): T[] {
  return requests.filter((request) => {
    try {
      assertOrdinaryAgentSession(request.sessionId)
      return true
    } catch {
      return false
    }
  })
}

/** Validate the request's trusted Main-side owner BEFORE mutating an approval/AskUser/ExitPlan. */
export function assertOrdinaryPendingRequestId(
  requestId: string,
  requests: readonly { requestId: string; sessionId: string }[],
): void {
  const pending = requests.find((request) => request.requestId === requestId)
  if (pending) assertOrdinaryAgentSession(pending.sessionId)
}
