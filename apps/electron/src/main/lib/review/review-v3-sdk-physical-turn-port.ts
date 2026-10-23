/**
 * Dev-A A4-R07: a Main-owned *single physical SDK call* witness gate.
 *
 * This adapter is usable only when an in-process Pi SDK/Provider integration
 * actually reports per-request start + terminal/receipt from its native hook.
 * Pi SDKMessage, assistant UUID and passive agent_end are not such hooks.
 * No native hook is wired here: production must inject the real one explicitly.
 *
 * This does not own C ReviewRun/ACK or create a Provider receipt.
 */
import {
  assertC0RunEvidenceIdentity, C0ContractError, type RunEvidenceIdentity,
} from '@profer/shared'
import type {
  V3AMainSDKTurnPort, V3ASDKMode, V3ATurnInterruption, V3ATurnHostOutcome,
} from './review-v3-main-sdk-turn-bridge'

export interface V3APhysicalTurnInput {
  readonly run: RunEvidenceIdentity
  readonly dispatchId: string
  readonly mode: V3ASDKMode
  readonly signal?: AbortSignal
}

/**
 * The only trusted callback surface. A Main-owned SDK integration must invoke
 * these methods directly from Pi's native per-provider-request lifecycle.
 * Do not fabricate these callbacks by parsing any SDKMessage or model text.
 */
export interface V3ANativeProviderWitness {
  requestStarted(nativeRequestId: string): void
  requestFinished(event: {
    readonly nativeRequestId: string
    /** Stable completion identity independently observed from the native SDK. */
    readonly nativeReceiptId: string
    readonly status: 'completed' | V3ATurnInterruption
  }): void
}

export interface V3ANativeSingleRequestEngine {
  /**
   * Must disable SDK native retry and image-fallback requery for this call.
   * A second physical request is permanently rejected by the witness below,
   * including when a Provider throws or a user abort occurs.
   */
  invoke(input: V3APhysicalTurnInput,
    witness: V3ANativeProviderWitness): Promise<void>
}

const deny = (detail: string): never => {
  throw new C0ContractError('RECOVERY_REQUIRED', detail)
}
const validId = (id: unknown): id is string =>
  typeof id === 'string' && id.trim().length > 0 && id.length <= 512

/**
 * Strict trust boundary for a future real native Pi hook. This class never
 * manufactures a receipt, counts streamed messages, or retries the engine.
 */
export class V3APhysicalSDKTurnPort implements V3AMainSDKTurnPort {
  constructor(private readonly engine: V3ANativeSingleRequestEngine) {
    if (!engine || typeof engine.invoke !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED',
        'Native in-process SDK Provider hook required')
    }
  }

  async nextTurn(input: V3APhysicalTurnInput): Promise<V3ATurnHostOutcome> {
    assertC0RunEvidenceIdentity(input.run)
    if (!['direct','hidden','graph','batch'].includes(input.mode)) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN','Unsupported SDK Host execution mode')
    }
    if (!validId(input.dispatchId)) {
      throw new C0ContractError('CONTRACT_INVALID',
        'Main persistent dispatch identity required')
    }
    if (input.signal?.aborted) {
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN',
        'Main cancelled before native SDK call')
    }
    let active=true
    let nativeRequestId: string | undefined
    let result: {
      nativeRequestId: string
      nativeReceiptId: string
      status: 'completed' | V3ATurnInterruption
    } | undefined
    let unsafe=false

    const witness: V3ANativeProviderWitness={
      requestStarted: id=>{
        if (!active || nativeRequestId || result || !validId(id)) {
          unsafe=true
          deny('Multiple, late or missing native Provider request identities')
        }
        nativeRequestId=id
      },
      requestFinished: event=>{
        if (!active || !nativeRequestId || result ||
          !event || event.nativeRequestId!==nativeRequestId ||
          !validId(event.nativeReceiptId) ||
          event.nativeReceiptId===input.dispatchId ||
          !['completed','cancelled','timed-out','failed'].includes(event.status)) {
          unsafe=true
          deny('Missing, duplicated or mismatched native Provider completion')
        }
        result={
          nativeRequestId:event.nativeRequestId,
          nativeReceiptId:event.nativeReceiptId,
          status:event.status,
        }
      },
    }

    try {
      // A thrown/aborted invoke leaves the upstream dispatch fence in-flight:
      // a caller cannot infer no Provider side effect occurred.
      await this.engine.invoke(input,witness)
    } finally {
      active=false
    }
    // The completion is set by an injected witness callback. TypeScript
    // cannot prove that the awaited engine invoked that callback, so narrow
    // the captured result explicitly rather than using an unsafe non-null !.
    const observed=result as typeof result | {
      nativeRequestId:string
      nativeReceiptId:string
      status:'completed' | V3ATurnInterruption
    }
    if (unsafe || !observed || !nativeRequestId ||
        observed.nativeRequestId!==nativeRequestId) {
      return deny('Native SDK Provider receipt provenance unavailable')
    }
    if (input.signal?.aborted) {
      return deny('Main aborted after native SDK Provider dispatch')
    }
    if (observed.status==='completed') {
      return {
        kind:'completed-turn',run:input.run,
        dispatchId:input.dispatchId,receiptId:observed.nativeReceiptId,
      }
    }
    return {
      kind:'interrupted',status:observed.status,run:input.run,
      dispatchId:input.dispatchId,
    }
  }
}
