/**
 * B3 conservative intake route planner. A route suggestion never creates a Case.
 * Main must verify the referenced staged candidates and template authorization;
 * only Dev-C's Case command can apply a selected route.
 */
import { createHash } from 'node:crypto'
import {
  type B2MainContext, type B2MaterialCandidate, ReviewB2StagingService,
} from './review-intake-adapter-v3-b2'

export interface B3RouteSuggestion {
  templateId: string
  templateVersion: string
  /** Not inferred authorization. Trusted catalog must supply status. */
  availability: 'authorized-for-technical-selection' | 'candidate-held'
  confidence: number
  evidence: Array<{ materialCandidateId: string; rawSha256: string; reason: string }>
  /** Supplied by conservative classifier; no role guessing or hidden Subject. */
  caseCandidateId: string
}
export interface B3RoutingInput {
  startedAtMs: number
  nowMs: number
  automaticSelectionEnabled: boolean
  userInterrupted: boolean
  userChoseTemplateId?: string
  userChoseTemplateVersion?: string
  materialCandidates: B2MaterialCandidate[]
  suggestions: B3RouteSuggestion[]
}
export interface B3RouteState {
  status: 'awaiting-evidence' | 'unmatched' | 'countdown' | 'needs-user-confirmation' | 'manually-selected' | 'default-selected'
  remainingMs: number
  chosen?: { templateId: string; templateVersion: string }
  reason: string
}
const SHA = /^[a-f0-9]{64}$/
const validTime = (x: number): boolean => Number.isFinite(x) && x >= 0
const confident = (score: number): boolean => Number.isFinite(score) && score >= 0.95 && score <= 1
/**
 * This only chooses a technical template suggestion; no CurrentCase is created.
 * Any multiple business type, unclear case/Subject/role or unresolved file stays manual.
 */
export function planB3ConservativeRouting(input: B3RoutingInput): B3RouteState {
  if (!input || !validTime(input.startedAtMs) || !validTime(input.nowMs) ||
      input.nowMs < input.startedAtMs ||
      !Array.isArray(input.materialCandidates) || !Array.isArray(input.suggestions)) {
    throw new Error('B3_ROUTING_INVALID')
  }
  const remainingMs = Math.max(0, 20_000 - (input.nowMs - input.startedAtMs))
  const materials = new Map(input.materialCandidates.map(m=>[m.candidateId,m]))
  if (materials.size!==input.materialCandidates.length || input.materialCandidates.length===0) {
    return {status:'awaiting-evidence',remainingMs,reason:'No unique valid staged files'}
  }
  if (input.userChoseTemplateId) {
    if (!input.userChoseTemplateVersion) return {
      status:'needs-user-confirmation',remainingMs,reason:'Manual template version is required',
    }
    return {status:'manually-selected',remainingMs,chosen:{
      templateId:input.userChoseTemplateId,templateVersion:input.userChoseTemplateVersion,
    },reason:'Manual selection; Dev-C must still authorize and create Case'}
  }
  if (input.userInterrupted || !input.automaticSelectionEnabled) return {
    status:'needs-user-confirmation',remainingMs,reason:'User interrupted or auto-selection disabled',
  }
  const owners = new Set(input.materialCandidates.map(m=>m.ownerId+'::'+m.ownerGeneration))
  const scopes = new Set(input.materialCandidates.map(m=>m.caseCandidateId))
  if (owners.size!==1 || scopes.size!==1 || input.materialCandidates.some(m=>
    m.status!=='accepted' || m.role==='unassigned' || !m.subjectId?.trim() || !SHA.test(m.rawSha256))) return {
    status:'needs-user-confirmation',remainingMs,
    reason:'File role, subject or owner scope ambiguous',
  }
  if (input.suggestions.length===0) return {
    status:'unmatched',remainingMs:0,
    reason:'No evidenced template match; user must confirm a business category or author a held candidate',
  }
  // Even if every file has a technically valid role, more than one applicant
  // or more than one Subject is a business decision, never an auto route.
  const applications=input.materialCandidates.filter(m=>m.role==='application')
  if (applications.length!==1 ||
      new Set(input.materialCandidates.map(m=>m.subjectId)).size!==1) return {
    status:'needs-user-confirmation',remainingMs,
    reason:'Multiple application owners, Subjects or no application require manual business confirmation',
  }
  const unique = new Set(input.suggestions.map(s=>s.templateId+'@'+s.templateVersion))
  const evidenceValid = (suggestion:B3RouteSuggestion):boolean => {
    // Every staged source must be accounted for, not just a convenient first
    // attachment. A missing/extra/duplicate physical source is not a match.
    if (!Array.isArray(suggestion.evidence) ||
        suggestion.evidence.length!==materials.size ||
        suggestion.caseCandidateId!==input.materialCandidates[0]!.caseCandidateId) return false
    const covered=new Set<string>()
    return suggestion.evidence.every(e=>{
      if (!e || covered.has(e.materialCandidateId)) return false
      covered.add(e.materialCandidateId)
      const material=materials.get(e.materialCandidateId)
      return Boolean(material && e.rawSha256===material.rawSha256 && e.reason?.trim())
    })
  }
  if (unique.size!==1 || input.suggestions.length!==1 ||
      input.suggestions.some(s=> !confident(s.confidence) ||
        s.availability !== 'authorized-for-technical-selection' || !evidenceValid(s))) return {
    status:'needs-user-confirmation',remainingMs,
    reason:'Non-unique, low confidence, unsupported evidence or unauthorized candidate',
  }
  if (remainingMs>0) return {
    status:'countdown',remainingMs,reason:'Single evidenced, technically authorized suggestion; user may interrupt',
  }
  const only=input.suggestions[0]!
  return {status:'default-selected',remainingMs:0,
    chosen:{templateId:only.templateId,templateVersion:only.templateVersion},
    reason:'Technical route selected, not a Case/Run/administrative decision',
  }
}

/** Catalog originates from the embedding Main; Renderer labels are never an ACL. */
export interface B3ManualCatalogEntry {
  templateId: string
  templateVersion: string
  name: string
  availability: B3RouteSuggestion['availability']
}
/** Caller cannot inject a startedAtMs or reset a user cancellation via UI refresh. */
export interface B3OwnerRouteInput extends Omit<
  B3RoutingInput, 'startedAtMs' | 'nowMs' | 'userInterrupted'
> {
  userInterrupted?: boolean
  manualCatalog: readonly B3ManualCatalogEntry[]
}

/**
 * Main-only technical B3 route session. It never issues a Case command.
 * Main must derive ctx from its current authenticated sender/window, supply
 * its authorized catalog, and revalidate before any C business transaction.
 */
export class ReviewB3OwnerBoundRouteSession {
  private scope: string | null = null
  private sourceFingerprint: string | null = null
  private startedAtMs = 0
  private previousNowMs = 0
  private interrupted = false
  constructor(
    private readonly staging: ReviewB2StagingService,
    private readonly now: () => number = Date.now,
  ) {}

  evaluate(ctx: B2MainContext, input: B3OwnerRouteInput): B3RouteState {
    this.staging.assertStillGranted(ctx)
    const time = this.now()
    if (!validTime(time) || (this.scope!==null && time<this.previousNowMs))
      throw new Error('B3_ROUTING_CLOCK_INVALID')
    if (!input || !Array.isArray(input.materialCandidates) ||
        !Array.isArray(input.suggestions) || !Array.isArray(input.manualCatalog))
      throw new Error('B3_ROUTING_INVALID')

    const scope=JSON.stringify([
      ctx.ownerId,ctx.ownerGeneration,ctx.caseCandidateId,ctx.senderId,ctx.frameId,
    ])
    if (this.scope!==null && scope!==this.scope)
      throw new Error('B3_ROUTING_SESSION_SCOPE_CHANGED')

    // A caller must account for the ENTIRE Main-staged case set. Without
    // this check, simply hiding a second application in the Renderer request
    // could turn a multi-case intake into a false high-confidence default.
    const currentCandidateIds=this.staging.listScopedCandidateIds(ctx)
    const suppliedCandidateIds=input.materialCandidates.map(item=>item?.candidateId)
    if(new Set(suppliedCandidateIds).size!==suppliedCandidateIds.length ||
       suppliedCandidateIds.length!==currentCandidateIds.length ||
       currentCandidateIds.some(id=>!suppliedCandidateIds.includes(id))) {
      throw new Error('B3_ROUTING_INCOMPLETE_STAGED_SET')
    }
    // An arbitrary Renderer candidate cannot impersonate a different staged
    // physical document, role, Subject, version or owner generation.
    const checked=input.materialCandidates.map(item=>{
      const actual=this.staging.getCandidate(ctx,item.candidateId)
      const keys: readonly (keyof B2MaterialCandidate)[]=[
        'candidateId','caseCandidateId','materialId','documentVersionId',
        'rawSha256','byteLength','fileName','physicalSourceKey','role',
        'subjectId','ownerId','ownerGeneration','requestId','status',
      ]
      if(keys.some(key=>actual[key]!==item[key]))
        throw new Error('B3_ROUTING_STAGED_IDENTITY_MISMATCH')
      // The canonical B2 record is not enough if byte custody was corrupted:
      // read current physical bytes again, not a UI SHA display field.
      const bytes=this.staging.read(ctx,item.candidateId)
      if(bytes.length!==actual.byteLength ||
         createHash('sha256').update(bytes).digest('hex')!==actual.rawSha256)
        throw new Error('B3_ROUTING_ORIGINAL_BYTES_MISMATCH')
      return actual
    })
    const catalogKeys=new Set<string>()
    const allowedCatalog=new Set<string>()
    for(const option of input.manualCatalog) {
      if(!option || !option.templateId?.trim() || !option.templateVersion?.trim() ||
         !option.name?.trim() ||
         !['authorized-for-technical-selection','candidate-held'].includes(option.availability))
        throw new Error('B3_ROUTING_CATALOG_INVALID')
      const id=JSON.stringify([option.templateId,option.templateVersion])
      if(catalogKeys.has(id)) throw new Error('B3_ROUTING_CATALOG_DUPLICATE')
      catalogKeys.add(id)
      if(option.availability==='authorized-for-technical-selection')allowedCatalog.add(id)
    }
    // Classifier-reported availability is NEVER a grant. Only the embedding
    // Main-supplied current catalog can admit a proposed automatic template.
    const checkedSuggestions=input.suggestions.map(suggestion=>{
      const key=JSON.stringify([suggestion?.templateId,suggestion?.templateVersion])
      return {
        ...suggestion,
        availability:allowedCatalog.has(key)&&
          suggestion?.availability==='authorized-for-technical-selection'
          ? 'authorized-for-technical-selection' as const : 'candidate-held' as const,
      }
    })
    const fingerprint=createHash('sha256').update(JSON.stringify([
      checked.map(({candidateId,documentVersionId,rawSha256,role,subjectId,ownerGeneration})=>
        [candidateId,documentVersionId,rawSha256,role,subjectId,ownerGeneration]),
      checkedSuggestions,
      input.manualCatalog.map(({templateId,templateVersion,availability})=>
        [templateId,templateVersion,availability]),
    ])).digest('hex')
    if(this.sourceFingerprint!==fingerprint) {
      this.sourceFingerprint=fingerprint
      this.startedAtMs=time
    }
    if(input.userInterrupted) this.interrupted=true
    this.scope=scope
    this.previousNowMs=time

    if(input.userChoseTemplateId || input.userChoseTemplateVersion) {
      const approved=input.manualCatalog.some(option=>
        option.templateId===input.userChoseTemplateId &&
        option.templateVersion===input.userChoseTemplateVersion &&
        option.availability==='authorized-for-technical-selection')
      if(!approved) return {
        status:'needs-user-confirmation',
        remainingMs:Math.max(0,20_000-(time-this.startedAtMs)),
        reason:'Manual template not in the current technically allowed catalog',
      }
    }
    const result=planB3ConservativeRouting({
      ...input, materialCandidates:checked, suggestions:checkedSuggestions,
      startedAtMs:this.startedAtMs,nowMs:time,
      userInterrupted:this.interrupted,
    })
    this.staging.assertStillGranted(ctx)
    return result
  }
}
