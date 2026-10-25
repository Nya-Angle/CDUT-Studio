/**
 * Dev-A R21: Main-only sequential SDK execution. This makes the existing
 * direct/hidden/graph/batch physical turn bridge usable for a MULTI-TURN
 * technical workload. It does not implement a graph scheduler or Batch Case
 * finalizer and it cannot produce a formal C ReviewRun/Decision/ACK.
 *
 * Every step enters the existing durable Dispatch Fence -> real SDK bridge
 * -> Turn Budget; no retry, no self-proclaimed Provider success or shadow
 * turn journal. Callers must provide the Main-frozen starting Turn counter.
 */
import {C0ContractError} from '@profer/shared'
import type {V3ReviewToolCall} from './review-execution-event-adapter'
import type {V3ReviewOwnerAdapter} from './review-pi-owner-adapter'
import type {V3ATurnBudget,V3ATurnSnapshot} from './review-v3-execution-turn-budget'
import type {
  V3ASDKMode,V3ASDKTurnBridge,V3ATurnDriveResult,
} from './review-v3-main-sdk-turn-bridge'

export interface V3ATechnicalSequence {
  /** Declared by a trusted Main caller, never supplied as a Renderer credential. */
  readonly version:'v3-dev-a-technical-sequence/1'
  readonly expectedUsedTurns:number
  /** Consecutive physical Pi SDK turns for ONE frozen Run and Owner. */
  readonly modes:readonly V3ASDKMode[]
}
export type V3ATechnicalSequenceResult =
  | {readonly kind:'steps-completed';readonly executed:number;
     readonly budget:V3ATurnSnapshot}
  | {readonly kind:'terminal-proposal';readonly executed:number;
     readonly result:Extract<V3ATurnDriveResult,{kind:'terminal-proposal'}>}

/** Main-local progress hook. Exceptions STOP dispatch; they do not undo a physical turn. */
export interface V3ATechnicalSequenceHooks {
  beforeTurn?(step:Readonly<{index:number;mode:V3ASDKMode;usedTurns:number}>):void
  afterTurn?(step:Readonly<{index:number;mode:V3ASDKMode;usedTurns:number;
    kind:V3ATurnDriveResult['kind']}>):void
}

const activeSessions=new Set<string>()
function refuse(message:string):never{
  throw new C0ContractError('RECOVERY_REQUIRED',message)
}
/**
 * Actual immutable Run/Plan/Source/revoke/receipt checks remain inside the
 * existing Owner and SDK Bridge. This layer only coordinates sequential
 * advancement, never issues physical or business ACK independently.
 */
export class V3ATechnicalSequenceDriver {
  private busy=false
  constructor(
    private readonly owners:V3ReviewOwnerAdapter,
    private readonly turns:V3ATurnBudget,
    private readonly bridge:V3ASDKTurnBridge,
  ){}

  async execute(
    call:V3ReviewToolCall,plan:V3ATechnicalSequence,
    signal?:AbortSignal,hooks?:V3ATechnicalSequenceHooks,
  ):Promise<V3ATechnicalSequenceResult>{
    if(!call||call.tool!=='review_submit_result'||!call.sessionId||
      plan?.version!=='v3-dev-a-technical-sequence/1'||
      !Number.isSafeInteger(plan.expectedUsedTurns)||
      plan.expectedUsedTurns<0||plan.expectedUsedTurns>24||
      !Array.isArray(plan.modes)||plan.modes.length===0||
      plan.modes.length>24||
      Array.from({length:plan.modes.length},(_,i)=>i).some(i=>
        !Object.prototype.hasOwnProperty.call(plan.modes,i)||
        !['direct','hidden','graph','batch'].includes(plan.modes[i]??''))){
      throw new C0ContractError('CONTRACT_INVALID',
        'Invalid Main-frozen SDK sequence identity or modes')
    }
    if(signal?.aborted){
      throw new C0ContractError('CASE_SCOPE_FORBIDDEN',
        'Main cancelled technical sequence before physical invocation')
    }
    if(this.busy||activeSessions.has(call.sessionId)){
      refuse('Concurrent multi-turn technical sequence for Owner session')
    }
    this.busy=true
    activeSessions.add(call.sessionId)
    const frozenModes=[...plan.modes]
    let executed=0
    try{
      const authorized=()=>this.owners.assertAuthorized(
        call.sessionId,call.grantId,call.senderKey,call.principal,
        'review_submit_result')
      let lease=authorized()
      const initial=this.turns.snapshot(lease)
      if(initial.usedTurns!==plan.expectedUsedTurns){
        refuse('Main sequence starting counter is stale; inspect durable turn journal')
      }
      for(const mode of frozenModes){
        if(signal?.aborted){
          throw new C0ContractError('CASE_SCOPE_FORBIDDEN',
            'Main aborted technical sequence; no further SDK calls allowed')
        }
        lease=authorized()
        const before=this.turns.snapshot(lease)
        if(before.usedTurns!==plan.expectedUsedTurns+executed){
          refuse('Concurrent or stale Turn Budget between SDK sequence steps')
        }
        hooks?.beforeTurn?.({index:executed,mode,usedTurns:before.usedTurns})
        // All side effects, awaiting, receipt checks, CAS and cancellation
        // safety happen in this separately tested real SDK bridge.
        const outcome=await this.bridge.next(call,mode,signal)
        lease=authorized()
        const after=this.turns.snapshot(lease)
        if(outcome.kind==='terminal-proposal'){
          // An interrupted attempt or exhausted budget has an authoritative
          // A-only technical terminal; never loop into another Provider call.
          if(after.usedTurns<before.usedTurns||
            after.usedTurns>before.usedTurns+1){
            refuse('Terminal sequence contradicted durable Turn Budget')
          }
          hooks?.afterTurn?.({index:executed,mode,usedTurns:after.usedTurns,
            kind:outcome.kind})
          return {kind:'terminal-proposal',
            executed:executed+(after.usedTurns-before.usedTurns),
            result:outcome}
        }
        if(after.usedTurns!==before.usedTurns+1||
          outcome.turn.usedTurns!==after.usedTurns||
          outcome.turn.maxTurns!==after.maxTurns||
          outcome.turn.exhausted!==after.exhausted||
          after.exhausted){
          refuse('SDK sequence result differs from durable Turn Budget')
        }
        hooks?.afterTurn?.({index:executed,mode,usedTurns:after.usedTurns,
          kind:outcome.kind})
        executed++
      }
      lease=authorized()
      const finalBudget=this.turns.snapshot(lease)
      if(finalBudget.usedTurns!==plan.expectedUsedTurns+executed){
        refuse('Final SDK sequence Turn Budget changed before response')
      }
      return {kind:'steps-completed',executed,budget:finalBudget}
    }finally{
      this.busy=false
      activeSessions.delete(call.sessionId)
    }
  }
}
