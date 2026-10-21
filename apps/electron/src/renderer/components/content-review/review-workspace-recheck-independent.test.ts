/**
 * P06-RECHECK independent R1 equivalents. These invoke actual React/Jotai Hook
 * and Controller producers, unlike the historical raw store.set() injection.
 * Synthetic IPC only; NEVER report as real Electron E05.
 */
import { describe, expect, test } from 'bun:test'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore, Provider } from 'jotai'
import type { CaseAggregateV2, ReviewRunV2 } from '@profer/shared'
import { createReviewActionsController, type ReviewActionsApi } from './review-actions-controller'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import { selectedCaseIdAtom, reviewWorkspaceRunsByCaseAtom, reviewExecutionByCaseAtom, reviewWorkspaceRunStaleByCaseAtom } from '@/atoms/review-atoms'

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}
async function until(check: () => boolean) {
  for (let i = 0; i < 300; i++) {
    if (check()) return
    await Bun.sleep(1)
  }
  throw new Error('R1 API invocation witness not reached')
}
function mount(store: ReturnType<typeof createStore>) {
  let result!: ReturnType<typeof useReviewWorkspaceActions>
  function Probe() { result = useReviewWorkspaceActions(); return null }
  renderToString(React.createElement(Provider, { store }, React.createElement(Probe)))
  if (!result) throw new Error('Hook mount not executed')
  return result
}
function fixture(caseId: string) {
  const aggregate = {
    caseV2: { id: caseId, templateId: 'synthetic', templateVersion: 1, title: 'Synthetic', objectType: 'person',
      caseFields: {}, subjects: [], documents: [], stage: 'submitted', revision: 1, createdAt: '', updatedAt: '' },
    observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
  } as unknown as CaseAggregateV2
  const base = {
    caseId, templateId: 'synthetic', templateVersion: 1,
    inputManifest: { hash: 'synthetic', templateVersion: 1, policyVersions: [],
      documentVersions: [], observationIds: [], evidenceLinkIds: [] },
    checkpoints: [], checks: [], opinions: [],
    coverage: { documents: [], plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1 },
    diagnostics: [], startedAt: '',
  }
  const old = { ...base, id: 'r1-old-'+caseId, status: 'cancelled' } as ReviewRunV2
  const fresh = { ...base, id: 'r1-new-'+caseId, status: 'running' } as ReviewRunV2
  const gate = deferred<ReviewRunV2[]>()
  let reads = 0
  const api = {
    getAggregateV2: async () => aggregate,
    listRunsV2: async () => (++reads === 1 ? gate.promise : [fresh]),
    getRunObservationsV2: async () => [],
    getWorkspaceRunValidityV2: async () => false,
    getTemplateV2: async () => ({ materialSlots: [], fields: [], sections: [] }),
    getBackgroundPiReviewStateV2: async () => ({ caseId, runId: fresh.id, runStatus: fresh.status, phase: 'accepted' as const }),
  } as unknown as ReviewActionsApi
  return { aggregate, old, fresh, gate, api, reads: () => reads }
}

describe('P06-RECHECK equivalent real writer witnesses', () => {
  test('old Hook refresh cannot commit after a newer real Controller request', async () => {
    const caseId = 'r1-hook-controller'
    const { old, fresh, gate, api, reads } = fixture(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const originalWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: api } })
    try {
      const oldHook = mount(store)
      const pending = oldHook.refresh()
      await until(() => reads() === 1)
      const latestController = createReviewActionsController(store, api)
      await latestController.refreshBackgroundReview(caseId)
      expect(reads()).toBe(2)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      gate.resolve([old])
      await pending
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      expect(store.get(reviewExecutionByCaseAtom)[caseId]?.status).toBe('running')
      console.log('R1_EQUIV_HOOK_CONTROLLER witness_reads='+reads()+' stale_rejected=true')
    } finally { Object.assign(globalThis, { window: originalWindow }) }
  })
  test('old Hook refresh cannot commit after a newer real Hook request', async () => {
    const caseId = 'r1-hook-hook'
    const { old, fresh, gate, api, reads } = fixture(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const originalWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: api } })
    try {
      const oldHook = mount(store)
      const first = oldHook.refresh()
      await until(() => reads() === 1)
      const newHook = mount(store)
      await newHook.refresh()
      expect(reads()).toBe(2)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      gate.resolve([old])
      await first
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      console.log('R1_EQUIV_HOOK_HOOK witness_reads='+reads()+' stale_rejected=true')
    } finally { Object.assign(globalThis, { window: originalWindow }) }
  })
  test('old Controller response cannot supersede a new real Workspace Hook writer', async () => {
    const caseId = 'r1-controller-hook'
    const { old, fresh, gate, api, reads } = fixture(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const originalWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: api } })
    try {
      const oldController = createReviewActionsController(store, api)
      const pending = oldController.refreshBackgroundReview(caseId)
      await until(() => reads() === 1)
      const newHook = mount(store)
      await newHook.refresh()
      expect(reads()).toBe(2)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      gate.resolve([old])
      await pending
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      // Workspace Hook owns the workspace projection, not executionByCase.
      // The delayed old Controller must NOT revive an old execution state.
      expect(store.get(reviewExecutionByCaseAtom)[caseId]).toBeUndefined()
      console.log('R1_EQUIV_CONTROLLER_HOOK witness_reads='+reads()+' stale_rejected=true')
    } finally { Object.assign(globalThis, { window: originalWindow }) }
  })

  test('old Hook delayed run-validity result cannot overwrite the later Controller projection', async () => {
    const caseId = 'r1-hook-delayed-validity'
    const { old, fresh, api } = fixture(caseId)
    const store = createStore()
    store.set(selectedCaseIdAtom, caseId)
    const validityGate = deferred<boolean>()
    let runReads = 0
    let validityReads = 0
    api.listRunsV2 = async () => (++runReads === 1 ? [old] : [fresh])
    api.getWorkspaceRunValidityV2 = async () => (++validityReads === 1 ? validityGate.promise : false)
    const originalWindow = globalThis.window
    Object.assign(globalThis, { window: { reviewAPI: api } })
    try {
      const oldHook = mount(store)
      const pending = oldHook.refresh()
      await until(() => validityReads === 1)
      const controller = createReviewActionsController(store, api)
      await controller.refreshBackgroundReview(caseId)
      expect(runReads).toBe(2)
      expect(validityReads).toBe(2)
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      expect(store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId]).toBe(false)
      validityGate.resolve(true)
      await pending
      expect(store.get(reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(fresh.id)
      expect(store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId]).toBe(false)
      expect(store.get(reviewExecutionByCaseAtom)[caseId]?.status).toBe('running')
      console.log('R1_EQUIV_DELAYED_VALIDITY validity_reads='+validityReads+' stale_rejected=true')
    } finally { Object.assign(globalThis, { window: originalWindow }) }
  })

})
