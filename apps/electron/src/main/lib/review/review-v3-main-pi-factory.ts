/**
 * Dev-C C2-R03 — inert, dedicated Pi AgentSession construction authority.
 *
 * Does NOT start a model request, register IPC, read credentials, install
 * tools, patch the ordinary Agent, or assert a physical HTTP receipt.
 * Its returned structural spec is compatible with A4's Pi HTTP engine only
 * after an independently source-locked A/C integration and Gate E.
 */
import type { AgentSession } from '@earendil-works/pi-coding-agent'
import {
  assertC0RunEvidenceIdentity, C0ContractError,
  type CaseAggregateV2, type RunEvidenceIdentity,
} from '@profer/shared'
import { readAggregate } from './case-store-v2'
import {
  assertC2PhysicalOriginalBytes, type C2MainOwnerWitness,
} from './review-v3-main-trust-port'

type DedicatedPiSession = Pick<AgentSession, 'agent' | 'prompt' | 'subscribe' | 'dispose'>
export type C2MainPiMode = 'direct' | 'hidden' | 'graph' | 'batch'
export interface C2MainPiRequest {
  readonly run: RunEvidenceIdentity
  readonly dispatchId: string
  readonly mode: C2MainPiMode
  readonly signal?: AbortSignal
}
export interface C2MainPiCreatedSession {
  readonly session: DedicatedPiSession
  /** Derived from trusted Main Case/Plan/Source, never model or Renderer text. */
  readonly prompt: string
}
export interface C2MainPiFactoryDependencies {
  /** Exact pinned HTTPS origin chosen by privileged Main configuration. */
  readonly trustedOrigin: string
  /** The currently published, approved immutable Plan; candidate-held denies. */
  assertPublishedPlan(aggregate: CaseAggregateV2, run: RunEvidenceIdentity): void
  /** A Owner/Grant lookup after its own Main authorization and process-epoch checks. */
  getCurrentOwner(run: RunEvidenceIdentity): C2MainOwnerWitness | undefined
  /** Dedicated one-shot creation, never a shared user's existing AgentSession. */
  createFreshSession(input: C2MainPiRequest): Promise<C2MainPiCreatedSession>
}

const consumedAgents = new WeakSet<object>()
const consumedDispatches = new Set<string>()
const valid = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= 512
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const obj = value as Record<string, unknown>
  return '{' + Object.keys(obj).filter(key => obj[key] !== undefined).sort()
    .map(key => JSON.stringify(key) + ':' + canonical(obj[key])).join(',') + '}'
}
const deny = (message: string): never => {
  throw new C0ContractError('RECOVERY_REQUIRED', message)
}
const isSame = (a: unknown, b: unknown): boolean => canonical(a) === canonical(b)

function exactOrigin(value: string): string {
  let url: URL
  try { url = new URL(value) }
  catch { return deny('Main Pi provider origin is not a URL') }
  if (url.protocol !== 'https:' || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash || url.origin !== value.replace(/\/$/, '')) {
    return deny('Only an exact pinned HTTPS Provider origin is admissible')
  }
  return url.origin
}

/** Always re-read C-owned Case and physical bytes on both sides of await. */
function assertCurrent(
  deps: C2MainPiFactoryDependencies,
  run: RunEvidenceIdentity,
): C2MainOwnerWitness {
  const aggregate = readAggregate(run.caseId)
  if (!aggregate || aggregate.caseV2.stage !== 'reviewing' ||
      aggregate.caseV2.id !== run.caseId ||
      aggregate.canonicalPlan?.fingerprint !== run.planFingerprint ||
      aggregate.canonicalPlan.templateVersion !== run.templateVersion ||
      aggregate.d2RuntimePlan ||
      !aggregate.v3TechnicalExecution ||
      aggregate.v3TechnicalExecution.terminalStatus || aggregate.v3ReviewRun ||
      !isSame(aggregate.v3TechnicalExecution.run, run)) {
    return deny('Current admitted C Case/Plan/Run identity is not available')
  }
  deps.assertPublishedPlan(aggregate, run)
  if (run.sourceVersionIds.length === 0 ||
      new Set(run.sourceVersionIds).size !== run.sourceVersionIds.length) {
    return deny('Frozen original version set invalid')
  }
  for (const versionId of run.sourceVersionIds) {
    assertC2PhysicalOriginalBytes(aggregate, versionId)
  }
  const owner = deps.getCurrentOwner(run)
  if (!owner || !owner.active || !valid(owner.permissionGrantId) ||
      !isSame(owner.run, run) || owner.ownerGeneration !== run.ownerGeneration ||
      owner.inputManifestHash !== run.inputManifestHash) {
    return deny('Main Owner/grant/generation/input manifest has expired')
  }
  return owner
}

/**
 * New session builder only. A SDK HTTP wrapper still owns physical dispatch,
 * retry=0, SSE proof, native lifecycle and mandatory dispose after prompt.
 */
export class C2MainPiAgentSessionFactory {
  private readonly origin: string
  constructor(private readonly deps: C2MainPiFactoryDependencies) {
    if (!deps || typeof deps.createFreshSession !== 'function' ||
        typeof deps.getCurrentOwner !== 'function' ||
        typeof deps.assertPublishedPlan !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED', 'C Main Pi dependencies required')
    }
    this.origin = exactOrigin(deps.trustedOrigin)
  }

  async create(input: C2MainPiRequest): Promise<{
    session: DedicatedPiSession
    prompt: string
    trustedOrigin: string
  }> {
    assertC0RunEvidenceIdentity(input.run)
    if (!valid(input.dispatchId) ||
        !['direct', 'hidden', 'graph', 'batch'].includes(input.mode) ||
        input.signal?.aborted) {
      return deny('Main dispatch, mode or AbortSignal is invalid')
    }
    const dispatchKey = canonical([input.run, input.dispatchId])
    // A dispatch intent may have reached a Provider even when session creation
    // failed. Never silently create a second session under the same intent.
    if (consumedDispatches.has(dispatchKey)) return deny('Pi dispatch reused')
    consumedDispatches.add(dispatchKey)
    const before = assertCurrent(this.deps, input.run)
    const spec = await this.deps.createFreshSession({
      ...input, run: structuredClone(input.run),
    })
    const session = spec?.session
    const agent = session?.agent
    // Do not dispose an already-consumed agent: it may belong to a distinct
    // still-live physical dispatch, and disrupting it would hide evidence.
    if (!agent || typeof agent !== 'object' || consumedAgents.has(agent)) {
      return deny('Dedicated Pi agent missing or reused')
    }
    consumedAgents.add(agent)
    const rejectSession = (reason: string): never => {
      try { session.dispose() }
      finally { return deny(reason) }
    }
    if (typeof session.prompt !== 'function' ||
        typeof session.subscribe !== 'function' ||
        typeof session.dispose !== 'function' ||
        typeof agent.streamFunction !== 'function' ||
        agent.state?.isStreaming || typeof spec.prompt !== 'string' ||
        !spec.prompt.trim() || spec.prompt.length > 524288) {
      return rejectSession('Fresh inert Pi SDK session and trusted prompt required')
    }
    let after: C2MainOwnerWitness
    try { after = assertCurrent(this.deps, input.run) }
    catch (error) {
      session.dispose()
      throw error
    }
    if (input.signal?.aborted || before.permissionGrantId !== after.permissionGrantId ||
        !isSame(before, after)) {
      return rejectSession('Main Owner changed or request aborted while creating Pi session')
    }
    return { session, prompt: spec.prompt, trustedOrigin: this.origin }
  }
}
