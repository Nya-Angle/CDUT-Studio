/**
 * P06-FIX-02: replays the confirmed failing cross-controller and competing
 * React Workspace Hook writers against a REAL shared Jotai store.
 * All responses are synthetic controllable IPC values; this is not Electron E2E.
 */
import { describe, expect, test } from 'bun:test'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore, Provider } from 'jotai'
import type { CaseAggregateV2, ReviewRunV2 } from '@profer/shared'
import { createReviewActionsController, type ReviewActionsApi } from './review-actions-controller'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import { beginWorkspaceCaseWrite, invalidateWorkspaceCaseWrites } from './review-workspace-write-fence'
import {
  selectedCaseIdAtom, reviewWorkspaceAggregatesByCaseAtom, reviewWorkspaceRunsByCaseAtom,
  reviewExecutionByCaseAtom, reviewWorkspaceExtractedObservationsByCaseAtom,
} from '@/atoms/review-atoms'

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
async function witness(condition: () => boolean): Promise<void> {
  for (let i = 0; i < 300; i++) {
    if (condition()) return
    await Bun.sleep(1)
  }
  throw new Error('Expected test IPC path was never reached')
}

function setup(caseId: string) {
  const aggregate = {
    caseV2: {
      id: caseId, templateId: 'synthetic', templateVersion: 1, title: '合成审核',
      objectType: 'person', caseFields: {}, subjects: [], documents: [],
      stage: 'submitted', revision: 1, createdAt: '', updatedAt: '',
    },
    observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [],
    supplements: [], appeals: [], receiptLog: [],
  } as unknown as CaseAggregateV2
  const base = {
    caseId, templateId: 'synthetic', templateVersion: 1, inputManifest: {
      hash: 'synthetic', templateVersion: 1, policyVersions: [],
      documentVersions: [], observationIds: [], evidenceLinkIds: [],
    },
    checkpoints: [], checks: [], opinions: [],
    coverage: { documents: [], plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1 },
    diagnostics: [], startedAt: '',
  }
  const old = { ...base, id: 'run-pi-old-'+caseId, status: 'failed' as const, error: 'old failure' } as ReviewRunV2
  const next = { ...base, id: 'run-pi-next-'+caseId, status: 'running' as const } as ReviewRunV2
  const api = {
    getAggregateV2: async () => aggregate,
    listRunsV2: async () => [next],
    getRunObservationsV2: async () => [],
    getWorkspaceRunValidityV2: async () => false,
    getTemplateV2: async () => ({ materialSlots: [], fields: [], sections: [] }),
    getBackgroundPiReviewStateV2: async () => ({ caseId, runId: next.id, runStatus: next.status, phase: 'accepted' as const }),
  } as unknown as ReviewActionsApi
  return { aggregate, old, next, api }
}

/** Render the real Hook within the SAME Jotai context as the Controller. */
function mountHook(store: ReturnType<typeof createStore>) {
  let result!: ReturnType<typeof useReviewWorkspaceActions>
  function Probe() {
    result = useReviewWorkspaceActions()
    return null
  }
  renderToString(React.createElement(Provider, { store }, React.createElement(Probe)))
  if (!result) throw new Error('Real Workspace Hook was not mounted')
  return result
}

describe('P06-FIX-02 shared Jotai commit identity', () => {
  test('same-store token is invalidated by another writer and only for its case', () => {
    const store = createStore()
    const old = beginWorkspaceCaseWrite(store, 'a')
    const other = beginWorkspaceCaseWrite(store, 'b')
    expect(old()).toBe(true)
    const next = beginWorkspaceCaseWrite(store, 'a')
    expect(old()).toBe(false)
    expect(next()).toBe(true)
    expect(other()).toBe(true)
    invalidateWorkspaceCaseWrites(store, 'a')
    expect(next()).toBe(false)
    expect(other()).toBe(true)
  })

  test('two Controller instances: unmounted old reader cannot restore failed run after new accepted run', async () => {
    const caseId = 'p06-remount'
    const { old, next, api } = setup(caseId)
    const store = createStore()
    const gate = deferred<ReviewRunV2[]>()
    let reads = 0
    api.listRunsV2 = async () => (++reads === 1 ? gate.promise : [next])
    const oldPage = createReviewActionsController(store, api)
    const late = oldPage.refreshBackgroundReview(caseId)
    await witness(() => reads >= 1)
    // Intentionally do NOT dispose the old controller: a newly mounted
    // controller must supersede it via the shared store/case generation.
    const newPage = createReviewActionsController(store, api)
    await newPage.refreshBackgroundReview(caseId)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
    expect(store.get(reviewExecutionByCaseAtom)[caseId]?.status).toBe('running')
    gate.resolve([old])
    await late
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
    expect(store.get(reviewExecutionByCaseAtom)[caseId]?.status).toBe('running')
  })

  test('unmount without replacement revokes old pending display reads', async () => {
    const caseId = 'p06-unmount-without-replacement'
    const { old, api } = setup(caseId)
    const store = createStore()
    const gate = deferred<ReviewRunV2[]>()
    let reads = 0
    api.listRunsV2 = async () => { reads++; return gate.promise }
    const page = createReviewActionsController(store, api)
    const late = page.refreshBackgroundReview(caseId)
    await witness(() => reads === 1)
    page.invalidateRefresh(caseId)
    gate.resolve([old])
    await late
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]).toBeUndefined()
    expect(store.get(reviewExecutionByCaseAtom)[caseId]).toBeUndefined()
  })

  test('real React/Jotai Workspace Hook refresh cannot commit a late cancelled snapshot after next Controller run', async () => {
    const caseId = 'p06-workspace-refresh'
    const { aggregate, old, next, api } = setup(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const gate = deferred<ReviewRunV2[]>()
    let reads = 0
    api.listRunsV2 = async () => (++reads === 1 ? gate.promise : [next])
    const previousWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: api } })
    try {
      const hook = mountHook(store)
      const late = hook.refresh()
      await witness(() => reads >= 1)
      const controller = createReviewActionsController(store, api)
      await controller.refreshBackgroundReview(caseId)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
      gate.resolve([old])
      await late
      expect(reads).toBeGreaterThanOrEqual(2)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
      expect(store.get(reviewExecutionByCaseAtom)[caseId]?.status).toBe('running')
      expect(store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]?.caseV2.id).toBe(aggregate.caseV2.id)
    } finally {
      Object.assign(globalThis, { window: previousWindow })
    }
  })

  test('real Workspace Hook apply captures token before mutation IPC and cannot overwrite newer run or observations', async () => {
    const caseId = 'p06-workspace-apply'
    const { aggregate, next, api } = setup(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const gate = deferred<{ ok: true; aggregate: CaseAggregateV2 }>()
    let writes = 0
    const remote = {
      ...api,
      correctObservationV2: async () => { writes++; return gate.promise },
    }
    const previousWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: remote } })
    try {
      const hook = mountHook(store)
      const late = hook.confirmObservation({ subjectId: 'synthetic-subject', fieldKey: 'name', sourceRefs: [] }, 'synthetic-value')
      await witness(() => writes === 1)
      const controller = createReviewActionsController(store, api)
      await controller.refreshBackgroundReview(caseId)
      const latestAggregate = { ...aggregate, caseV2: { ...aggregate.caseV2, revision: 2 } }
      store.set(reviewWorkspaceAggregatesByCaseAtom, {
        ...store.get(reviewWorkspaceAggregatesByCaseAtom), [caseId]: latestAggregate,
      })
      const observations = [{ synthetic: 'new-round' }]
      store.set(reviewWorkspaceExtractedObservationsByCaseAtom, {
        ...store.get(reviewWorkspaceExtractedObservationsByCaseAtom), [caseId]: observations,
      })
      gate.resolve({ ok: true, aggregate })
      await late
      expect(writes).toBe(1)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
      expect(store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]?.caseV2.revision).toBe(2)
      expect(store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId]).toEqual(observations)
    } finally {
      Object.assign(globalThis, { window: previousWindow })
    }
  })
})
