/**
 * Dev-C C2-R04 — ONE Main-local authority for C2 proposal, dedicated Pi and
 * independently observed physical Host receipts.
 *
 * This is NOT a production Electron/IPC/Provider entrypoint. The trusted
 * publisher, Owner registry, physical Host observer and SDK builder remain
 * privileged, externally injected dependencies that MUST be wired and
 * independently attested before real Gate E. Synthetic inputs are test only.
 *
 * Closing this assembly revokes EVERY exposed entrypoint, including callbacks
 * already captured by the ledger before an asynchronous transaction.
 */
import {
  C0ContractError, type Actor, type CaseAggregateV2,
  type ReviewCommandResult, type RunEvidenceIdentity,
} from '@profer/shared'
import {
  fenceC2HostRunDurably, isC2RunDurablyFenced,
  type C2MainAuthorizeRunFence,
} from './review-v3-durable-host-fence'
import {
  createC2MainTrustedRunPort,
  type C2MainTrustedInputs,
} from './review-v3-main-trust-port'
import {
  C2MainPiAgentSessionFactory,
  type C2MainPiFactoryDependencies,
  type C2MainPiRequest,
} from './review-v3-main-pi-factory'
import {
  C2MainPhysicalHostReceiptRegistry,
  type C2MainPhysicalHostSource,
} from './review-v3-main-host-receipt-registry'

export interface C2MainTrustedAssemblyAuthority
  extends C2MainPhysicalHostSource {
  readonly trustedOrigin: string
  /** Independent B published immutable policy verifier, never staging. */
  assertPublishedPlan: C2MainTrustedInputs['assertPublishedPlan']
  /** Builds a new V3-only session; MUST NOT open a Provider connection here. */
  createFreshSession: C2MainPiFactoryDependencies['createFreshSession']
}

type TechnicalPort = ReturnType<typeof createC2MainTrustedRunPort>

/** Does not create or expose credentials, network fetch, IPC or Agent tools. */
export class C2MainTrustedExecutionAssembly {
  private closed = false
  private readonly registry: C2MainPhysicalHostReceiptRegistry
  private readonly pi: C2MainPiAgentSessionFactory
  private readonly technical: TechnicalPort

  constructor(authority: C2MainTrustedAssemblyAuthority) {
    if (!authority || typeof authority.assertPublishedPlan !== 'function' ||
        typeof authority.getCurrentOwner !== 'function' ||
        typeof authority.getObservedPhysicalReceipt !== 'function' ||
        typeof authority.createFreshSession !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED',
        'One privileged Main Plan/Owner/Host/Pi authority is required')
    }
    const inputs: C2MainPhysicalHostSource = {
      getCurrentOwner: run => this.closed ? undefined : authority.getCurrentOwner(run),
      getObservedPhysicalReceipt: id =>
        this.closed ? undefined : authority.getObservedPhysicalReceipt(id),
    }
    const published: C2MainTrustedInputs['assertPublishedPlan'] = (aggregate, run) => {
      this.requireOpen()
      return authority.assertPublishedPlan(aggregate, run)
    }
    this.registry = new C2MainPhysicalHostReceiptRegistry(inputs, {
      isRunFenced: isC2RunDurablyFenced,
    })
    this.pi = new C2MainPiAgentSessionFactory({
      trustedOrigin: authority.trustedOrigin,
      assertPublishedPlan: published,
      getCurrentOwner: inputs.getCurrentOwner,
      createFreshSession: input => {
        this.requireOpen()
        return authority.createFreshSession(input)
      },
    })
    this.technical = createC2MainTrustedRunPort({
      assertPublishedPlan: published,
      getCurrentOwner: inputs.getCurrentOwner,
      getPhysicalHostReceipt: id =>
        this.closed ? undefined : this.registry.getPhysicalHostReceipt(id),
    })
  }

  private requireOpen(): void {
    if (this.closed) throw new C0ContractError('RECOVERY_REQUIRED',
      'C2 Main authority disposed; a cold registry cannot be rehydrated')
  }

  /** Only a callback ID observed by a separate privileged Host observer. */
  rememberObservedHostReceipt(id: string): void {
    this.requireOpen()
    this.registry.rememberObservedReceipt(id)
  }

  /** Explicit Run revoke; all prior IDs are tombstoned within this process. */
  invalidateRun(run: RunEvidenceIdentity): void {
    this.requireOpen()
    this.registry.invalidateRun(run)
  }

  /**
   * C-only durable Run invalidation. The Case CAS+Receipt is committed FIRST.
   * Never use an A technical proposal/SDK transport receipt as the authorizer.
   * If CAS fails, the in-memory registry is not signed as durably revoked.
   */
  async invalidateRunDurably(run: RunEvidenceIdentity, command:{
    requestId:string;actor:Actor;expectedRevision:number;
    payload:{run:RunEvidenceIdentity;reason:string}
  }, authorize:C2MainAuthorizeRunFence):Promise<ReviewCommandResult> {
    this.requireOpen()
    if(command.payload.run.caseId!==run.caseId || command.payload.run.runId!==run.runId)
      throw new C0ContractError('RECOVERY_REQUIRED','fence command targets different Run')
    const result=await fenceC2HostRunDurably(run.caseId,command,authorize)
    if(result.ok) this.registry.invalidateRun(run)
    return result
  }

  /** Inert SDK factory, after C run admission and physical original checks. */
  createPi(input: C2MainPiRequest) {
    this.requireOpen()
    return this.pi.create(input)
  }

  admit(...args: Parameters<TechnicalPort['admit']>) {
    this.requireOpen()
    return this.technical.admit(...args)
  }

  record(...args: Parameters<TechnicalPort['record']>) {
    this.requireOpen()
    return this.technical.record(...args)
  }

  seal(...args: Parameters<TechnicalPort['seal']>) {
    this.requireOpen()
    return this.technical.seal(...args)
  }

  /** Idempotent shutdown. Never rebuild Host receipts from journal events. */
  close(): void {
    if (this.closed) return
    this.closed = true
    this.registry.close()
  }
}
