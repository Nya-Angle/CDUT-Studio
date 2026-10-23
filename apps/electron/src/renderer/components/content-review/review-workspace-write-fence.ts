/**
 * One write generation per (Jotai store, caseId), shared by Controller and
 * Workspace Hook. Rendering is an eventually consistent Main-owned projection;
 * a returned older IPC request must not overwrite a newer local projection.
 *
 * The gate is VIEW-ONLY. Never used to cancel, approve or authorize Pi runs.
 */
import type { createStore } from 'jotai'

type JotaiStore = ReturnType<typeof createStore>
const generations = new WeakMap<JotaiStore, Map<string, number>>()

function forStore(store: JotaiStore): Map<string, number> {
  let byCase = generations.get(store)
  if (!byCase) {
    byCase = new Map<string, number>()
    generations.set(store, byCase)
  }
  return byCase
}

/** Call BEFORE sending an async read or mutation, not after it returns. */
export function beginWorkspaceCaseWrite(store: JotaiStore, caseId: string): () => boolean {
  const byCase = forStore(store)
  const generation = (byCase.get(caseId) ?? 0) + 1
  byCase.set(caseId, generation)
  return () => byCase.get(caseId) === generation
}

/** A page leaving invalidates its pending requests, not the Main background run. */
export function invalidateWorkspaceCaseWrites(store: JotaiStore, caseId: string): void {
  const byCase = forStore(store)
  byCase.set(caseId, (byCase.get(caseId) ?? 0) + 1)
}
