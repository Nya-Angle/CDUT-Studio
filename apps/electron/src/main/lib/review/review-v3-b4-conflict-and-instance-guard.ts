/**
 * Dev-B R24: evidence boundary for historical originals and high-risk checks.
 * Frozen D4 source identity, live school authorization, and technical candidate
 * predicates are THREE DIFFERENT assertions. This module grants none of them.
 */
import { createHash } from 'node:crypto'
import {
  validateB4HighRiskEvidence, type B4HighRiskSourceEvidence,
} from './review-v3-b4-high-risk-semantic-evidence'
import {
  validateB4TechnicalArchive, sumB4Technical, type B4Archive,
} from './review-v3-b4-obligation-lineage'

const D4_SHA = 'b68443b23293b4714e61a3b81383d3d3a56434fc'
const hex64 = /^[a-f0-9]{64}$/
const hex40 = /^[a-f0-9]{40}$/
const fail = (code: string): never => { throw new Error('B4_R24_' + code) }

export interface B4ConflictedOriginalPin {
  templateId: string
  frozenD4SHA: string
  frozenSourceVersion: string
  frozenSourceSha256: string
}
/** The bytes must be independently obtained, not reconstructed from an old digest. */
export interface B4ObservedOriginal {
  bytes: Uint8Array
  /** Identifies the source of these bytes; not a school authorization. */
  provenance: string
  /** Optional actual Git blob pin. Never supply a workspace.json blob here. */
  expectedOriginalGitBlob?: string
}
export interface B4OriginalConflictFinding {
  templateId: string
  frozenSourceVersion: string
  frozenSourceSha256: string
  observedSourceSha256: string | null
  observedGitBlob: string | null
  observedProvenance: string | null
  distinctObservedVersion: string | null
  state: 'RAW_NOT_AVAILABLE' | 'FROZEN_BYTES_MATCH_CANDIDATE_ONLY' |
    'DIFFERENT_VERSION_QUARANTINED'
  canReplaceFrozenOriginal: false
  publicationAllowed: false
  schoolPolicyVerified: false
}
/**
 * A recorded older hash (including a Library observation) is not original
 * bytes. Call with undefined when the bytes are unavailable *now*.
 */
export function inspectB4OriginalVersion(
  pin: B4ConflictedOriginalPin,
  observed?: B4ObservedOriginal,
): B4OriginalConflictFinding {
  if (!pin || !/^[a-z0-9-]{2,128}$/.test(pin.templateId) ||
      pin.frozenD4SHA !== D4_SHA || !pin.frozenSourceVersion?.trim() ||
      !hex64.test(pin.frozenSourceSha256)) fail('BAD_FROZEN_PIN')
  const output: B4OriginalConflictFinding = {
    templateId: pin.templateId, frozenSourceVersion: pin.frozenSourceVersion,
    frozenSourceSha256: pin.frozenSourceSha256,
    observedSourceSha256: null, observedGitBlob: null,
    observedProvenance: null, distinctObservedVersion: null,
    state: 'RAW_NOT_AVAILABLE', canReplaceFrozenOriginal: false,
    publicationAllowed: false, schoolPolicyVerified: false,
  }
  if (observed === undefined) return output
  if (!(observed.bytes instanceof Uint8Array) || observed.bytes.byteLength === 0 ||
      !observed.provenance?.trim() ||
      (observed.expectedOriginalGitBlob !== undefined &&
       !hex40.test(observed.expectedOriginalGitBlob))) fail('BAD_RAW_EVIDENCE')
  const byteHash = createHash('sha256').update(observed.bytes).digest('hex')
  const gitHash = createHash('sha1')
    .update('blob ' + String(observed.bytes.byteLength) + '\0')
    .update(observed.bytes).digest('hex')
  if (observed.expectedOriginalGitBlob !== undefined &&
      observed.expectedOriginalGitBlob !== gitHash) fail('GIT_BLOB_MISMATCH')
  return {
    ...output, observedSourceSha256: byteHash, observedGitBlob: gitHash,
    observedProvenance: observed.provenance,
    distinctObservedVersion: 'sha256:' + byteHash,
    state: byteHash === pin.frozenSourceSha256
      ? 'FROZEN_BYTES_MATCH_CANDIDATE_ONLY' : 'DIFFERENT_VERSION_QUARANTINED',
  }
}

export type B4HighRiskDomain = 'G03' | 'G04' | 'G06'
export const B4_REQUIRED_DIMENSIONS: Readonly<Record<B4HighRiskDomain, readonly string[]>> = {
  G03: ['scope_item_id', 'physical_venue_zone', 'time_interval', 'authorized_issuer'],
  G04: ['person_uid', 'target_lab_uid', 'scope_kind', 'action', 'policy_snapshot_id'],
  G06: ['release_action_id', 'channel_id', 'claim_id', 'asset_id', 'publication_version'],
}
export interface B4RiskInstance {
  key: string
  /** The full instance tuple: never substitute a case-wide approval. */
  dimensions: Record<string, string | null | undefined>
  observedCondition: 'true' | 'false' | 'unknown'
  /** Human-readable test input only; cannot supply school permissions. */
  evidence?: {
    forInstanceKey: string
    dimensions: Record<string, string | null | undefined>
    rawSourceSha256: string
  }
}
export interface B4RiskInstanceFinding {
  instanceKey: string
  candidatePredicate: 'applicable' | 'not-applicable' | 'unknown'
  reason: 'INSTANCE_EVIDENCE_MATCHES_CANDIDATE' | 'KNOWN_FALSE_EXACT_INSTANCE' |
    'NO_EXACT_INSTANCE_EVIDENCE' | 'INCOMPLETE_SCOPE' |
    'WRONG_OBJECT_EVIDENCE' | 'STALE_SOURCE_VERSION' | 'UNKNOWN_CONDITION'
  rawRuleMappedToFrozenChecks: true
  historicalInstanceSemanticsPreserved: false
  schoolAuthorityVerified: false
  publicationAllowed: false
}
export interface B4HighRiskInstanceAudit {
  domain: B4HighRiskDomain
  templateId: string
  ruleId: string
  sourceSha256: string
  checkedDimensions: string[]
  findings: B4RiskInstanceFinding[]
  semanticValidated: false
  publicationAllowed: false
}

/**
 * The archived clause-to-Check trace is validated first, but its scope fields
 * do not prove any real-world object-level rule. Distinct objects MUST bring
 * distinct, exact candidate evidence. No evidence => UNKNOWN even when the
 * supplied boolean looks favourable. A false predicate is only a technical
 * not-applicable when it is backed by matching candidate evidence.
 */
export function inspectB4HighRiskInstanceEvidence(
  proof: B4HighRiskSourceEvidence,
  archives: Readonly<Record<string, B4Archive>>,
  selected: { domain: B4HighRiskDomain; templateId: string; ruleId: string },
  instances: readonly B4RiskInstance[],
): B4HighRiskInstanceAudit {
  validateB4HighRiskEvidence(proof, archives)
  const rule = proof.items.find(item =>
    item.domain === selected.domain && item.templateId === selected.templateId &&
    item.original.ruleId === selected.ruleId)
  if (!rule) throw new Error('B4_R24_RULE_NOT_IN_PINNED_EVIDENCE')
  const dimensions = B4_REQUIRED_DIMENSIONS[selected.domain]
  if (JSON.stringify(rule.technical.expectedReviewDimensions) !== JSON.stringify(dimensions) ||
      JSON.stringify(rule.technical.dimensionsNotEvidencedInArchivedCheckFields) !== JSON.stringify(dimensions) ||
      rule.disposition.authorityVerified !== false ||
      rule.disposition.applicabilityVerified !== false ||
      rule.disposition.independentGold !== false ||
      rule.disposition.authorMayPublish !== false) fail('SEMANTIC_EVIDENCE_NOT_CLOSED')
  if (!Array.isArray(instances) || instances.length < 2 || instances.length > 100 ||
      instances.some(x => !x || typeof x.key !== 'string' || !x.key.trim() ||
        !['true', 'false', 'unknown'].includes(x.observedCondition) ||
        !x.dimensions || typeof x.dimensions !== 'object' ||
        Array.isArray(x.dimensions)) ||
      new Set(instances.map(x => x.key)).size !== instances.length) fail('BAD_INSTANCES')
  const findings: B4RiskInstanceFinding[] = instances.map(x => {
    const complete = dimensions.every(d =>
      typeof x.dimensions[d] === 'string' && x.dimensions[d]!.trim().length > 0)
    const e = x.evidence
    let reason: B4RiskInstanceFinding['reason']
    let candidatePredicate: B4RiskInstanceFinding['candidatePredicate'] = 'unknown'
    if (!complete) reason = 'INCOMPLETE_SCOPE'
    else if (!e) reason = 'NO_EXACT_INSTANCE_EVIDENCE'
    else if (e.forInstanceKey !== x.key ||
             dimensions.some(d => e.dimensions?.[d] !== x.dimensions[d])) reason = 'WRONG_OBJECT_EVIDENCE'
    else if (e.rawSourceSha256 !== rule.rawSha256) reason = 'STALE_SOURCE_VERSION'
    else if (x.observedCondition === 'unknown') reason = 'UNKNOWN_CONDITION'
    else {
      candidatePredicate = x.observedCondition === 'true' ? 'applicable' : 'not-applicable'
      reason = x.observedCondition === 'true'
        ? 'INSTANCE_EVIDENCE_MATCHES_CANDIDATE' : 'KNOWN_FALSE_EXACT_INSTANCE'
    }
    return {
      instanceKey: x.key, candidatePredicate, reason,
      rawRuleMappedToFrozenChecks: true,
      historicalInstanceSemanticsPreserved: false,
      schoolAuthorityVerified: false, publicationAllowed: false,
    }
  })
  return {
    ...selected, sourceSha256: rule.rawSha256,
    checkedDimensions: [...dimensions], findings,
    semanticValidated: false, publicationAllowed: false,
  }
}


export interface B4FrozenScopeGap {
  domain: string
  templateId: string
  checkId: string
  reason: 'OBJECT_AND_CASE_SCOPE_NOT_ESTABLISHED'
}
export interface B4FrozenSourceGap {
  domain: string
  templateId: string
  checkId: string
  sourceId: string
  documentVersionId: string
  locator: string
  reason: 'SOURCE_APPLICABILITY_UNKNOWN'
}
/**
 * Actual frozen D4 metadata gaps, not policy evaluation. All 8 pinned domains
 * are required; neither an author-supplied CASE scope nor an assumed FALSE
 * can make the fixed 34/4163 unresolved entries disappear.
 */
export function auditB4FrozenUnknownCoverage(
  archives: Readonly<Record<string, B4Archive>>,
): {
  sourceGaps: B4FrozenSourceGap[]
  scopeGaps: B4FrozenScopeGap[]
  candidateTemplates: 50
  frozenChecks: 3875
  publicationAllowed: false
} {
  const expected = ['G01','G02','G03','G04','G05','G06','G07','G08']
  if (!archives || Object.keys(archives).length !== 8 ||
      expected.some(x => !archives[x] || archives[x]!.domain !== x ||
        archives[x]!.frozenSourceGitSha !== D4_SHA)) fail('FROZEN_DOMAIN_SET')
  const combined = sumB4Technical(expected.map(d => validateB4TechnicalArchive(archives[d])))
  if (combined.domains !== 8 || combined.templates !== 50 ||
      combined.checks !== 3875 || combined.unscoped !== 34 ||
      combined.unknown !== 4163) fail('FROZEN_GAP_DRIFT')
  const sourceGaps: B4FrozenSourceGap[] = []
  const scopeGaps: B4FrozenScopeGap[] = []
  for (const domain of expected) {
    const archive = archives[domain]!
    for (const template of archive.templates) {
      for (const check of template.obligations) {
        if (!check.genericScope && !check.caseScopeJustification)
          scopeGaps.push({ domain, templateId: template.templateId, checkId: check.checkId,
            reason: 'OBJECT_AND_CASE_SCOPE_NOT_ESTABLISHED' })
        for (const source of check.sources) {
          if (source.sourceApplicability === 'unknown') {
            if (!source.documentVersionId || !source.locator)
              throw new Error('B4_R24_UNKNOWN_WITHOUT_PROVENANCE')
            sourceGaps.push({
              domain, templateId: template.templateId, checkId: check.checkId,
              sourceId: source.sourceId, documentVersionId: source.documentVersionId,
              locator: source.locator, reason: 'SOURCE_APPLICABILITY_UNKNOWN',
            })
          }
        }
      }
    }
  }
  if (sourceGaps.length !== 4163 || scopeGaps.length !== 34 ||
      scopeGaps.some(x => x.domain !== 'G01')) fail('GAP_DETAIL_DRIFT')
  return {
    sourceGaps, scopeGaps, candidateTemplates: 50, frozenChecks: 3875,
    publicationAllowed: false,
  }
}
