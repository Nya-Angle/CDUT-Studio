/**
 * Dev-A A3-R05: Main-only SDK turn callback bridge for a single Pi turn.
 * No SDK implementation, Renderer IPC, business ReviewRun writer or C ACK.
 * The injected port must be bound in Main to an actual SDK turn callback, not
 * to model text or Renderer JSON. All actions are checked at both await edges.
 */
import {
  C0ContractError, type RunEvidenceIdentity,
} from '@profer/shared'
import type { V3ReviewToolCall } from './review-execution-event-adapter'
import type { V3ReviewOwnerAdapter } from './review-pi-owner-adapter'
import {
  type AExecutionProposal, type ATechnicalStatus, type V3AProposalProducer,
} from './review-v3-execution-proposal-producer'
import {
  type V3ATurnSnapshot, type V3ATurnBudget,
} from './review-v3-execution-turn-budget'
import type {V3ASDKDispatchFence} from './review-v3-sdk-dispatch-fence'

/** Ignore object insertion order, but not any immutable Run identity value. */
function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  const record=value as Record<string,unknown>
  return '{' + Object.keys(record).filter(k=>record[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+':'+canonical(record[k])).join(',') + '}'
}

export type V3ASDKMode = 'direct' | 'hidden' | 'graph' | 'batch'

/** Process-local protection if Main accidentally constructs two bridges. */
const activeSDKOwnerSessions = new Set<string>()
export type V3ATurnInterruption = Extract<
  ATechnicalStatus, 'cancelled' | 'timed-out' | 'failed'
>
export type V3ATurnHostOutcome =
  | { kind: 'completed-turn'; receiptId: string; run: RunEvidenceIdentity;
      /** Main intent identity, echoed by the direct trusted runtime callback. */
      dispatchId: string }
  | { kind: 'interrupted'; status: V3ATurnInterruption; run: RunEvidenceIdentity;
      dispatchId: string }

/**
 * Only the Main-injected SDK Host is allowed to issue a completed-turn receipt.
 * The Run is echoed by Main's binding to prevent accepting a receipt from a
 * different attempt/generation. The bridge never interprets Pi text.
 */
export interface V3AMainSDKTurnPort {
  nextTurn(request: {
    readonly run: RunEvidenceIdentity
    /** Persisted before SDK invocation; not supplied by Pi model or Renderer. */
    readonly dispatchId: string
    readonly mode: V3ASDKMode
    /** Main lifecycle cancellation; a signal never self-attests a terminal. */
    readonly signal?: AbortSignal
  }): Promise<V3ATurnHostOutcome>
}

export type V3ATurnDriveResult =
  | { kind: 'recorded'; turn: V3ATurnSnapshot }
  | { kind: 'terminal-proposal'; status: V3ATurnInterruption | 'needs-resume';
      event: AExecutionProposal }

/** Main owns this instance and all its dependencies; never expose to IPC. */
export class V3ASDKTurnBridge {
  private busy = false

  constructor(
    private readonly owners: V3ReviewOwnerAdapter,
    private readonly turns: V3ATurnBudget,
    private readonly proposals: V3AProposalProducer,
    private readonly sdk: V3AMainSDKTurnPort,
    private readonly dispatch: V3ASDKDispatchFence,
  ) {
    if (!sdk || typeof sdk.nextTurn !== 'function' || !dispatch) {
      throw new C0ContractError('ACTOR_UNTRUSTED', 'Main-attested SDK callback required')
    }
  }

  private authorized(call: V3ReviewToolCall): RunEvidenceIdentity {
    const lease = this.owners.assertAuthorized(
      call.sessionId,call.grantId,call.senderKey,
      call.principal,'review_submit_result',
    )
    if (!lease.runEvidence || !lease.planSnapshot ||
        lease.runEvidence.runId !== lease.runId ||
        lease.runEvidence.attemptId !== lease.attemptId ||
        lease.runEvidence.ownerGeneration !== lease.generation ||
        lease.runEvidence.inputManifestHash !== lease.manifestHash ||
        lease.runEvidence.planFingerprint !== lease.planFingerprint) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH','Main frozen Run unavailable')
    }
    return lease.runEvidence
  }

  /** Replays a previously exhausted 24-turn technical terminal without rerunning SDK. */
  async closeExhausted(call: V3ReviewToolCall): Promise<AExecutionProposal> {
    if (call.tool !== 'review_submit_result') {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN','SDK turn needs submit capability')
    }
    const run=this.authorized(call)
    const lease=this.owners.assertAuthorized(
      call.sessionId,call.grantId,call.senderKey,
      call.principal,'review_submit_result',
    )
    if (!this.turns.exhausted(lease)) {
      throw new C0ContractError('CONTRACT_INVALID','24 turns have not been exhausted')
    }
    // C owns formal business completion. The Host supplies its own terminal
    // receipt and V3AProposalProducer fences the final grant at append time.
    const event=await this.proposals.terminal(call,'needs-resume')
    if (event.run.runId !== run.runId || event.run.attemptId !== run.attemptId) {
      throw new C0ContractError('RUN_IDENTITY_MISMATCH','Host terminal Run mismatch')
    }
    return event
  }

  /**
   * Exactly one Host attempt, with its durable result recorded only after a
   * second Main authorization check. A thrown SDK error is not a Host receipt.
   * It must be resolved by Main recovery, not silently billed or called PASS.
   */
  async next(call: V3ReviewToolCall, mode: V3ASDKMode,
    signal?: AbortSignal): Promise<V3ATurnDriveResult> {
    if (signal?.aborted) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN',
        'Main cancelled SDK execution before Host invocation')
    }
    if (call.tool !== 'review_submit_result' ||
        !['direct','hidden','graph','batch'].includes(mode)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN','Invalid trusted SDK turn mode')
    }
    if (this.busy || activeSDKOwnerSessions.has(call.sessionId)) {
      throw new C0ContractError('RECOVERY_REQUIRED',
        'Concurrent SDK turn on same Main Owner session')
    }
    this.busy=true
    activeSDKOwnerSessions.add(call.sessionId)
    let pendingSDK:Promise<V3ATurnHostOutcome>|undefined
    let abortWonWhilePending=false
    try {
      const frozen=this.authorized(call)
      const lease=this.owners.assertAuthorized(
        call.sessionId,call.grantId,call.senderKey,
        call.principal,'review_submit_result',
      )
      const alreadyTerminal=this.proposals.terminalCandidate(frozen)
      if (alreadyTerminal) {
        if (alreadyTerminal.kind === 'terminal' &&
            alreadyTerminal.terminal.status === 'needs-resume' &&
            alreadyTerminal.permissionGrantId === lease.grantId &&
            this.turns.exhausted(lease)) {
          return {kind:'terminal-proposal',status:'needs-resume',
            event:alreadyTerminal}
        }
        throw new C0ContractError('RUN_IDENTITY_MISMATCH',
          'Attempt already sealed; no further SDK Provider turn permitted')
      }
      if (this.turns.exhausted(lease)) {
        return {kind:'terminal-proposal',status:'needs-resume',
          event:await this.closeExhausted(call)}
      }
      // Durable BEFORE any SDK/Provider side effect. Unknown Provider outcome
      // after crash, thrown error or disk fault blocks redispatch of same Run.
      const intent=this.dispatch.claim(call)
      // A Provider/worker may ignore AbortSignal and never resolve. Return a
      // recovery-required error to Main promptly, WITHOUT releasing its active
      // SDK session lock until the actual SDK promise settles. The persisted
      // in-flight intent is not cleared and late results are never accepted.
      pendingSDK=Promise.resolve(this.sdk.nextTurn({
        run:structuredClone(frozen),dispatchId:intent.dispatchId,mode,signal,
      }))
      let received:V3ATurnHostOutcome
      if (signal) {
        let onAbort:(()=>void)|undefined
        const cancelled=new Promise<never>((_resolve,reject)=>{
          onAbort=()=>{
            abortWonWhilePending=true
            reject(new C0ContractError('RECOVERY_REQUIRED',
              'Main cancelled while SDK Provider result is unresolved'))
          }
          signal.addEventListener('abort',onAbort,{once:true})
          if(signal.aborted)onAbort()
        })
        try {
          received=await Promise.race([pendingSDK,cancelled])
        } finally {
          if(onAbort)signal.removeEventListener('abort',onAbort)
        }
      } else {
        received=await pendingSDK
      }
      if (signal?.aborted) {
        this.dispatch.lateDenied(frozen,intent.dispatchId)
        throw new C0ContractError('CASE_SCOPE_FORBIDDEN',
          'Main cancelled in-flight SDK turn; Host return rejected')
      }
      // A legitimate SDK result received after revoke/expiry/cold restart is
      // no longer permission to record a turn, propose an event or run again.
      let current:RunEvidenceIdentity
      try {current=this.authorized(call)}
      catch(error){
        this.dispatch.lateDenied(frozen,intent.dispatchId)
        throw error
      }
      if (!received || received.dispatchId !== intent.dispatchId) {
        // The Provider may have executed even when its result was attached
        // to a different Main dispatch. Leave the intent unresolved.
        throw new C0ContractError('RUN_IDENTITY_MISMATCH',
          'SDK callback does not match persisted Main dispatch identity')
      }
      if (canonical(received.run) !== canonical(frozen) ||
          canonical(current) !== canonical(frozen)) {
        throw new C0ContractError('RUN_IDENTITY_MISMATCH',
          'SDK Host receipt bound to a different immutable Run')
      }
      if (received.kind === 'interrupted') {
        if (!['cancelled','timed-out','failed'].includes(received.status)) {
          throw new C0ContractError('CONTRACT_INVALID','Unknown Host interruption')
        }
        const event=await this.proposals.terminal(call,received.status)
        this.dispatch.settle(call,intent.dispatchId,event.hostReceiptId)
        return {kind:'terminal-proposal',status:received.status,event}
      }
      if (received.kind !== 'completed-turn' ||
          typeof received.receiptId !== 'string' || !received.receiptId.trim()) {
        throw new C0ContractError('CONTRACT_INVALID','SDK Host turn receipt absent')
      }
      // Distinct physical Provider dispatches must never masquerade as an
      // idempotent replay with the same Main-observed SDK turn receipt.
      this.dispatch.assertUniqueReceipt(frozen,intent.dispatchId,received.receiptId)
      const turn=this.turns.recordCompletedTurn(call,received.receiptId)
      // The SDK work is durably counted, even if its 24th-turn terminal later
      // fails ENOSPC. Retrying terminal is safe; running SDK again is not.
      this.dispatch.settle(call,intent.dispatchId,received.receiptId)
      if (turn.exhausted) {
        return {kind:'terminal-proposal',status:'needs-resume',
          event:await this.closeExhausted(call)}
      }
      return {kind:'recorded',turn}
    } finally {
      const release=()=>{
        activeSDKOwnerSessions.delete(call.sessionId)
        this.busy=false
      }
      if(abortWonWhilePending && pendingSDK) {
        // Own both settle paths; do not leak an unhandled rejection when the
        // Provider fails after Main has already returned RECOVERY_REQUIRED.
        // Until then a second bridge for the same Owner session stays denied.
        void pendingSDK.then(release,release)
      } else {
        release()
      }
    }
  }
}
