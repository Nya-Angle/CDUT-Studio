/**
 * C-R09: irreversible per-Case Host Run-wide fence.
 *
 * This is NOT an A technical tombstone: the fence is committed in the SAME
 * C Case aggregate CAS+Receipt, under the physical case disk transaction.
 * A cold Main may read the fence without reconstructing any Host receipt.
 * A separate REAL Main operator and Owner/grant verifier must authorize.
 */
import {createHash} from 'node:crypto'
import {
  assertC0RunEvidenceIdentity, C0ContractError,
  type Actor, type CaseAggregateV2, type ReviewCommandResult,
  type RunEvidenceIdentity,
} from '@profer/shared'
import {CommandValidationError,payloadHash,readAggregate,submitCommand} from './case-store-v2'

export type C2MainAuthorizeRunFence =
  (aggregate:CaseAggregateV2,run:RunEvidenceIdentity,reason:string)=>void
export interface C2MainFencePayload {
  run:RunEvidenceIdentity
  reason:string
}
const refuse=(detail:string):never=>{throw new C0ContractError('RECOVERY_REQUIRED',detail)}
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
function records(aggregate:CaseAggregateV2):NonNullable<CaseAggregateV2['v3HostRunFences']>{
  const r=aggregate.v3HostRunFences
  if(r===undefined)return []
  if(!Array.isArray(r)||r.length>4096)return refuse('Host Run fence ledger malformed/capacity')
  const seen=new Set<string>()
  for(const item of r){
    if(!item||item.schemaVersion!=='review-v3-host-run-fence/1'||
       !item.run||!item.requestId||!item.operatorPrincipalId||
       !item.reason||!Number.isFinite(Date.parse(item.fencedAt))){
      return refuse('Host Run fence record malformed')
    }
    assertC0RunEvidenceIdentity(item.run)
    if(item.run.caseId!==aggregate.caseV2.id||
       seen.has(item.run.runId))return refuse('Host Run fence case or run identity corrupt')
    const matching=aggregate.receiptLog.filter(receipt=>
      receipt.type==='FenceV3HostRun' &&
      receipt.requestId===item.requestId &&
      receipt.payloadHash===payloadHash('FenceV3HostRun',{
        run:item.run,reason:item.reason,
      }) && receipt.actor?.actorId===item.operatorPrincipalId)
    if(matching.length!==1)return refuse('Host Run fence lacks unique authoritative Case Receipt')
    seen.add(item.run.runId)
  }
  return r
}
/** Case-wide Run ID cannot be revived by new PID, grant, generation or attempt. */
export function assertC2HostRunNotFenced(
  aggregate:CaseAggregateV2,run:RunEvidenceIdentity,
):void {
  assertC0RunEvidenceIdentity(run)
  if(run.caseId!==aggregate.caseV2.id)return refuse('Run/Case mismatch')
  if(records(aggregate).some(item=>item.run.runId===run.runId))
    return refuse('Durable Run-wide Host fence: recovery required, no late receipts')
}
/** Main registry read side. Corrupt Case or corrupt fence fails closed. */
export function isC2RunDurablyFenced(run:RunEvidenceIdentity):boolean {
  assertC0RunEvidenceIdentity(run)
  const aggregate=readAggregate(run.caseId)
  if(!aggregate)return refuse('Case missing or not parseable during Host admission')
  if(!aggregate.caseV2||aggregate.caseV2.id!==run.caseId||
     !Array.isArray(aggregate.receiptLog))
    return refuse('Case aggregate untrusted during Host admission')
  return records(aggregate).some(item=>item.run.runId===run.runId)
}
/** C-only privileged operator must revoke and attest the current physical
 * Owner/Host situation. This call NEVER kills PID, clears lock or redispatches.
 */
export function fenceC2HostRunDurably(
  caseId:string,
  command:{requestId:string;actor:Actor;expectedRevision:number;payload:C2MainFencePayload},
  authorize:C2MainAuthorizeRunFence,
):Promise<ReviewCommandResult> {
  if(typeof authorize!=='function')return Promise.reject(
    new C0ContractError('ACTOR_UNTRUSTED','Independent C Main operator authorization required'))
  return submitCommand(caseId,{...command,type:'FenceV3HostRun'},(aggregate,payload)=>{
    const run=payload?.run
    const reason=payload?.reason
    if(!run||typeof reason!=='string'||reason.trim()!==reason||
       reason.length<5||reason.length>512)
      throw new CommandValidationError('VALIDATION_FAILED','C Main Host fence requires exact Run/reason')
    assertC0RunEvidenceIdentity(run)
    if(run.caseId!==caseId)
      throw new CommandValidationError('VALIDATION_FAILED','Fence cannot address another Case')
    const prior=records(aggregate)
    if(prior.length>=4096)
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED','Durable fence capacity exhausted')
    if(prior.some(item=>item.run.runId===run.runId))
      throw new CommandValidationError('INVALID_TRANSITION','Old Run ID already durably fenced')
    const historical=aggregate.v3TechnicalExecution?.run??aggregate.v3ReviewRun?.run
    if(!historical||historical.runId!==run.runId||
       hash(historical)!==hash(run))
      throw new CommandValidationError('STALE_INPUT','Only exact persisted physical Run can be fenced')
    // This is an independently installed C Main observer, not Renderer actor.
    authorize(aggregate,run,reason)
    if(!command.actor||!command.actor.actorId)
      throw new CommandValidationError('VALIDATION_FAILED','Current Main operator principal missing')
    return {
      summary:'C Main durable Host Run invalidation; no Provider replay or school ACK',
      mutate:draft=>{
        draft.v3HostRunFences=[
          ...prior.map(item=>structuredClone(item)),
          {schemaVersion:'review-v3-host-run-fence/1',
            run:structuredClone(run),requestId:command.requestId,
            operatorPrincipalId:command.actor.actorId,
            reason,fencedAt:new Date().toISOString()},
        ]
      },
    }
  })
}
