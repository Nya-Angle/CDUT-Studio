/**
 * Dev-B R25: original-byte-observed clause slices -> exact frozen Check lineage
 * -> *candidate-only* per-rule/per-object condition witnesses.
 *
 * This never issues a school policy, authority, Gold, Case, Run or Check PASS.
 * Raw SHA receipts in R25 JSON were independently computed from full Library
 * files, not reconstructed from R14. CI rechecks the RAW witness against R14,
 * but cannot rehash private Library files without separately receiving bytes.
 */
import { createHash } from 'node:crypto'
import {
  validateB4HighRiskEvidence, type B4HighRiskSourceEvidence,
} from './review-v3-b4-high-risk-semantic-evidence'
import {
  validateB4RuleAnchorLedger, type B4RuleAnchorLedger,
} from './review-v3-b4-rule-source-diff'
import type { B4Archive } from './review-v3-b4-obligation-lineage'
import {
  inspectB4HighRiskInstanceEvidence, B4_REQUIRED_DIMENSIONS,
  type B4HighRiskDomain, type B4RiskInstance,
} from './review-v3-b4-conflict-and-instance-guard'

const frozen = 'b68443b23293b4714e61a3b81383d3d3a56434fc'
const hash = (s: string): string => createHash('sha256').update(s, 'utf8').digest('hex')
const sha64 = /^[a-f0-9]{64}$/
const deny = (reason: string): never => { throw new Error('B4_R25_' + reason) }
const domains: readonly B4HighRiskDomain[] = ['G03','G04','G06']

export interface B4R25RawClausePin {
  domain: B4HighRiskDomain
  templateId: string
  ruleId: string
  rawSourceSha256: string
  headingLine: number
  /** Independently computed from actual full raw original Markdown bytes. */
  rawExcerptSha256: string
  rawRuleBodyNonBlankLines: number
  /** R14 mistakenly included subsequent non-rule context for G06 R-34. */
  r14AdditionalNonRuleContextLines: number
}
export interface B4R25RawClauseEvidence {
  schemaVersion: 'review-v3-b4-r25-independent-raw-clause-pins/1'
  frozenD4GitSHA: string
  method: string
  publicationAllowed: false
  schoolPolicyVerified: false
  rawOriginals: Record<B4HighRiskDomain, {
    file: string; sha256: string; byteCount: number
  }>
  observedLaterVersions: Record<'G02' | 'G04' | 'G08', {
    templateId: string
    observedOldRawSha256: string
    nowRecoveredD4Sha256: string | null
    frozenByteStatus: 'RAW_VERIFIED_MATCH_CANDIDATE_ONLY' | 'RAW_NOT_AVAILABLE'
  }>
  clauses: B4R25RawClausePin[]
}
export interface B4R25RuleProof {
  domain: B4HighRiskDomain
  templateId: string
  ruleId: string
  rawSourceSha256: string
  rawExcerptSha256: string
  triggerLineSha256: string
  bindingSha256: string
  checkIds: string[]
  requiredDimensions: string[]
  sourceApplicability: 'UNKNOWN_NOT_APPROVED'
  rawClauseState: 'SOURCE_BODY_VERBATIM_HASH_MATCH_CANDIDATE_ONLY'
  r14Context: 'RULE_ONLY' | 'NON_RULE_CONTEXT_APPENDED'
  technicalPredicateImplemented: false
  semanticValidated: false
  publicationAllowed: false
}
export interface B4R25ClauseAudit {
  schemaVersion: 'review-v3-b4-r25-clause-audit/1'
  rules: 32
  independentlyRawBound: 32
  contextContamination: 1
  candidateOnly: true
  publicationAllowed: false
  schoolPolicyVerified: false
  proofs: B4R25RuleProof[]
}
/**
 * Exact, bounded mechanical crosscheck of the 32 real raw-source clause
 * witnesses, the R13 full 107-rule index, R14 32-risk excerpt and D4 Check
 * archive. The only R14 context spill is G06-T06/R-34; it is surfaced, never
 * silently counted as the rule's obligation.
 */
export function auditB4R25OriginalClauseBindings(
  raw: B4R25RawClauseEvidence,
  r13: B4RuleAnchorLedger,
  r14: B4HighRiskSourceEvidence,
  archives: Readonly<Record<string, B4Archive>>,
): B4R25ClauseAudit {
  validateB4RuleAnchorLedger(r13, archives)
  validateB4HighRiskEvidence(r14, archives)
  if (!raw || raw.schemaVersion !== 'review-v3-b4-r25-independent-raw-clause-pins/1' ||
      raw.frozenD4GitSHA !== frozen || raw.publicationAllowed !== false ||
      raw.schoolPolicyVerified !== false || !raw.method?.trim() ||
      !Array.isArray(raw.clauses) || raw.clauses.length !== 32 ||
      Object.keys(raw.rawOriginals ?? {}).length !== 3 ||
      Object.keys(raw.observedLaterVersions ?? {}).length !== 3 ||
      domains.some(d => !raw.rawOriginals[d] ||
        !sha64.test(raw.rawOriginals[d].sha256) ||
        raw.rawOriginals[d].byteCount < 1 ||
        !raw.rawOriginals[d].file)) deny('RAW_PROVENANCE_HEADER')

  const historical = raw.observedLaterVersions
  if (historical.G02?.templateId !== 'g02-t03-review' ||
      historical.G04?.templateId !== 'd4-g04-t06' ||
      historical.G08?.templateId !== 'g08-t03' ||
      historical.G02.nowRecoveredD4Sha256 !== 'e3d1d01555d49564931ac38892567ea23eab5ecd898afc3b67a8e4a26abe7380' ||
      historical.G04.nowRecoveredD4Sha256 !== 'd9c459f23bfdae097b6fa2a71700f0c10391bd9ffa63e8b387325db08cece0c2' ||
      historical.G08.nowRecoveredD4Sha256 !== null ||
      historical.G02.frozenByteStatus !== 'RAW_VERIFIED_MATCH_CANDIDATE_ONLY' ||
      historical.G04.frozenByteStatus !== 'RAW_VERIFIED_MATCH_CANDIDATE_ONLY' ||
      historical.G08.frozenByteStatus !== 'RAW_NOT_AVAILABLE' ||
      Object.values(historical).some(x => !sha64.test(x.observedOldRawSha256) ||
        x.observedOldRawSha256 === x.nowRecoveredD4Sha256)) deny('CONFLICT_VERSION_DRIFT')

  const index = new Map<string, B4R25RawClausePin>()
  for (const pin of raw.clauses) {
    if (!pin || !domains.includes(pin.domain) || !/^R-\d{2}$/.test(pin.ruleId) ||
        !pin.templateId?.trim() || !sha64.test(pin.rawExcerptSha256) ||
        !sha64.test(pin.rawSourceSha256) || pin.headingLine < 1 ||
        !Number.isSafeInteger(pin.rawRuleBodyNonBlankLines) ||
        pin.rawRuleBodyNonBlankLines < 1 ||
        !Number.isSafeInteger(pin.r14AdditionalNonRuleContextLines) ||
        pin.r14AdditionalNonRuleContextLines < 0) deny('CLAUSE_PIN_FORMAT')
    const id = pin.templateId + '/' + pin.ruleId
    if (index.has(id)) deny('DUPLICATE_RAW_CLAUSE')
    index.set(id, pin)
  }
  let spill = 0
  const proofs: B4R25RuleProof[] = []
  for (const row of r14.items) {
    const domain = row.domain as B4HighRiskDomain
    const id = row.templateId + '/' + row.original.ruleId
    const pin = index.get(id)
    const historicalAnchor = r13.templates.find(x => x.templateId === row.templateId)
      ?.ruleAnchors.find(x => x.ruleId === row.original.ruleId)
    if (!pin || !historicalAnchor)
      throw new Error('B4_R25_RAW_R13_R14_SOURCE_BINDING')
    if (
        pin.domain !== domain || pin.headingLine !== row.original.headingLine ||
        pin.rawSourceSha256 !== row.rawSha256 ||
        pin.rawSourceSha256 !== raw.rawOriginals[domain]?.sha256 ||
        historicalAnchor.headingLine !== row.original.headingLine ||
        historicalAnchor.heading !== row.original.heading ||
        JSON.stringify(historicalAnchor.mappedCheckIds) !== JSON.stringify(row.technical.checkIds) ||
        JSON.stringify(historicalAnchor.sourceIds) !== JSON.stringify(row.technical.sourceIds))
      deny('RAW_R13_R14_SOURCE_BINDING')

    const parts = row.original.excerpt.split('\n')
    const exceptional = domain === 'G06' && row.templateId === 'g06-t06' &&
      row.original.ruleId === 'R-34'
    const observedBodySha256 =
      hash(parts.slice(0, pin.rawRuleBodyNonBlankLines).join('\n'))
    if (pin.r14AdditionalNonRuleContextLines !== (exceptional ? 2 : 0) ||
        parts.length !== pin.rawRuleBodyNonBlankLines +
          pin.r14AdditionalNonRuleContextLines ||
        observedBodySha256 !== pin.rawExcerptSha256)
      throw new Error('B4_R25_RAW_CLAUSE_VERBATIM_MISMATCH_' + id +
        '_LINES_' + parts.length + '_EXPECTED_' +
        (pin.rawRuleBodyNonBlankLines + pin.r14AdditionalNonRuleContextLines) +
        '_OBSERVED_SHA_' + observedBodySha256 +
        '_PINNED_SHA_' + pin.rawExcerptSha256)
    if (exceptional) spill++
    const clauseParts = parts.slice(0, pin.rawRuleBodyNonBlankLines)
    const trigger = clauseParts.find(line => line.includes('触发条件'))
    if (!trigger || !trigger.trim())
      throw new Error('B4_R25_RAW_TRIGGER_NOT_EVIDENCED')
    if (row.technical.sourceEvidence.some(s =>
      s.applicability !== 'unknown' || !s.documentVersionId || !s.locator))
      deny('SOURCE_APPLICABILITY_PROMOTED')
    const wanted = B4_REQUIRED_DIMENSIONS[domain]
    if (JSON.stringify(row.technical.expectedReviewDimensions) !== JSON.stringify(wanted) ||
        JSON.stringify(row.technical.dimensionsNotEvidencedInArchivedCheckFields) !==
          JSON.stringify(wanted)) deny('INSTANCE_DIMENSION_NOT_PROVEN')
    const bindingInput = {
      domain, templateId: row.templateId, ruleId: row.original.ruleId,
      sourceSha256: row.rawSha256, excerptSha256: pin.rawExcerptSha256,
      triggerLineSha256: hash(trigger),
      checkIds: row.technical.checkIds, sourceIds: row.technical.sourceIds,
      requiredDimensions: wanted,
    }
    proofs.push({
      domain, templateId: row.templateId, ruleId: row.original.ruleId,
      rawSourceSha256: row.rawSha256, rawExcerptSha256: pin.rawExcerptSha256,
      triggerLineSha256: bindingInput.triggerLineSha256,
      bindingSha256: hash(JSON.stringify(bindingInput)),
      checkIds: [...row.technical.checkIds], requiredDimensions: [...wanted],
      sourceApplicability: 'UNKNOWN_NOT_APPROVED',
      rawClauseState: 'SOURCE_BODY_VERBATIM_HASH_MATCH_CANDIDATE_ONLY',
      r14Context: exceptional ? 'NON_RULE_CONTEXT_APPENDED' : 'RULE_ONLY',
      technicalPredicateImplemented: false,
      semanticValidated: false, publicationAllowed: false,
    })
  }
  if (proofs.length !== 32 || spill !== 1 || index.size !== 32) deny('CLAUSE_COVERAGE')
  return {
    schemaVersion: 'review-v3-b4-r25-clause-audit/1',
    rules: 32, independentlyRawBound: 32, contextContamination: 1,
    candidateOnly: true, publicationAllowed: false, schoolPolicyVerified: false,
    proofs,
  }
}

export interface B4R25RuleConditionReceipt {
  /** All four fields must come from an independently examined clause binding. */
  templateId: string
  ruleId: string
  rawExcerptSha256: string
  triggerLineSha256: string
  bindingSha256: string
}
export interface B4R25ObservedCondition {
  instance: B4RiskInstance
  clauseReceipt?: B4R25RuleConditionReceipt
}
export interface B4R25BoundFinding {
  instanceKey: string
  candidatePredicate: 'applicable' | 'not-applicable' | 'unknown'
  reason: 'CLAUSE_RECEIPT_MISSING' | 'WRONG_OR_STALE_CLAUSE_RECEIPT' |
    'TECHNICAL_CANDIDATE_ONLY' | 'INSTANCE_UNRESOLVED'
  cannotAuthorizeSchool: true
  semanticValidated: false
  publicationAllowed: false
}
/**
 * R24 matched the object and raw file; R25 additionally binds *which exact
 * original business condition/check source* was observed. R-14's evidence
 * cannot be reused to prove R-17 just because both share the original file.
 */
export function evaluateB4R25ClauseBoundConditions(
  raw: B4R25RawClauseEvidence,
  r13: B4RuleAnchorLedger,
  r14: B4HighRiskSourceEvidence,
  archives: Readonly<Record<string, B4Archive>>,
  selected: { domain: B4HighRiskDomain; templateId: string; ruleId: string },
  observations: readonly B4R25ObservedCondition[],
): { clause: B4R25RuleProof; findings: B4R25BoundFinding[];
  schoolPolicyVerified: false; publicationAllowed: false } {
  const audit = auditB4R25OriginalClauseBindings(raw, r13, r14, archives)
  const clause = audit.proofs.find(x =>
    x.domain === selected.domain && x.templateId === selected.templateId &&
    x.ruleId === selected.ruleId)
  if (!clause) throw new Error('B4_R25_RULE_NOT_PINNED')
  if (!Array.isArray(observations) ||
      observations.some(x => !x || !x.instance)) deny('INVALID_OBSERVATIONS')
  const older = inspectB4HighRiskInstanceEvidence(r14, archives, selected,
    observations.map(x => x.instance))
  const findings: B4R25BoundFinding[] = older.findings.map((prior, index) => {
    const receipt = observations[index]?.clauseReceipt
    const matches = !!receipt &&
      receipt.templateId === selected.templateId &&
      receipt.ruleId === selected.ruleId &&
      receipt.rawExcerptSha256 === clause.rawExcerptSha256 &&
      receipt.triggerLineSha256 === clause.triggerLineSha256 &&
      receipt.bindingSha256 === clause.bindingSha256
    const predicate = matches ? prior.candidatePredicate : 'unknown'
    return {
      instanceKey: prior.instanceKey, candidatePredicate: predicate,
      reason: !receipt ? 'CLAUSE_RECEIPT_MISSING' :
        !matches ? 'WRONG_OR_STALE_CLAUSE_RECEIPT' :
        predicate === 'unknown' ? 'INSTANCE_UNRESOLVED' :
          'TECHNICAL_CANDIDATE_ONLY',
      cannotAuthorizeSchool: true,
      semanticValidated: false, publicationAllowed: false,
    }
  })
  return { clause, findings, schoolPolicyVerified: false, publicationAllowed: false }
}
