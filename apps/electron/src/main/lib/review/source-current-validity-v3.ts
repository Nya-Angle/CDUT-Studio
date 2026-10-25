/**
 * C1 / ARCH-003: current source applicability, separate from immutable evidence history.
 * Never delete original material, Observation value/sourceRefs, EvidenceLink or Receipt.
 * Revocations are in the same CaseAggregate CAS write as the material transition.
 */
import type { CaseAggregateV2, SourceValidityRevocation } from '@profer/shared'

/** Called AFTER the affected documents have been marked inactive inside a draft. */
export function revokeCurrentSourceValidity(
  draft: CaseAggregateV2,
  retiredVersionIds: ReadonlySet<string>,
  reason: SourceValidityRevocation['reason'],
): void {
  if (!retiredVersionIds.size) return
  const activeVersions = new Set(draft.caseV2.documents.filter((doc) => doc.active !== false).map((doc) => doc.versionId))
  const previousLinks = draft.evidenceLinks
  const retiredSubjects = new Set(previousLinks.filter((link) => retiredVersionIds.has(link.documentVersionId)).map((link) => link.subjectId))
  const revokedObservations = new Set<string>()
  const revokedLinks = new Set<string>()
  const confirmedObservations = new Set<string>()
  const confirmedLinks = new Set<string>()

  draft.observations = draft.observations.map((observation) => {
    if (!observation.confirmed) return observation
    // An unattested fact cannot silently stay confirmed after the case's source
    // set changed. Also reject mixed current/retired refs rather than retaining
    // a partially unsupported old confirmation.
    // A role/slot correction changes what a fact means in the case context.
    // Conservatively require all previously confirmed observations to be checked again.
    const referencesInvalid = reason === 'reclassify'
      ? true
      : observation.sourceRefs.length === 0
        ? (retiredSubjects.has(observation.subjectId) || retiredVersionIds.size > 0)
        : observation.sourceRefs.some((ref) =>
          ref.caseId !== draft.caseV2.id || !activeVersions.has(ref.documentVersionId))
    if (!referencesInvalid) return observation
    revokedObservations.add(observation.id)
    confirmedObservations.add(observation.id)
    return { ...observation, confirmed: false }
  })
  draft.evidenceLinks = previousLinks.map((link) => {
    if (!retiredVersionIds.has(link.documentVersionId) || link.status === 'rejected') return link
    revokedLinks.add(link.id)
    if (link.status === 'confirmed') confirmedLinks.add(link.id)
    return { ...link, status: 'rejected' as const }
  })

  // Preserve a separate audit trail describing the confirmation that existed
  // immediately before revocation. Historical receipts and source values remain.
  const at = new Date().toISOString()
  const existing = new Set((draft.sourceValidityRevocations ?? []).map((item) => item.documentVersionId))
  const additions: SourceValidityRevocation[] = [...retiredVersionIds].filter((id) => !existing.has(id)).map((id) => ({
    documentVersionId: id, reason, at,
    observationIds: [...revokedObservations],
    previouslyConfirmedObservationIds: [...confirmedObservations],
    evidenceLinkIds: previousLinks.filter((link) => link.documentVersionId === id && revokedLinks.has(link.id)).map((link) => link.id),
    previouslyConfirmedEvidenceLinkIds: previousLinks.filter((link) => link.documentVersionId === id && confirmedLinks.has(link.id)).map((link) => link.id),
  }))
  draft.sourceValidityRevocations = [...(draft.sourceValidityRevocations ?? []), ...additions]
}

/**
 * Readiness guard for aggregates produced by older binaries or malformed direct
 * writes. Both current and archived evidence may be displayed, but archived
 * evidence must never satisfy current decision eligibility.
 */
export function currentSourceValidityBlockers(aggregate: CaseAggregateV2): string[] {
  const active = new Set(aggregate.caseV2.documents.filter((doc) => doc.active !== false).map((doc) => doc.versionId))
  const blockers: string[] = []
  for (const link of aggregate.evidenceLinks) {
    if (link.status === 'confirmed' && !active.has(link.documentVersionId)) blockers.push(`evidence:${link.id}`)
  }
  for (const observation of aggregate.observations) {
    if (!observation.confirmed) continue
    if (observation.sourceRefs.some((ref) => ref.caseId !== aggregate.caseV2.id || !active.has(ref.documentVersionId))) {
      blockers.push(`observation:${observation.id}`)
    }
    if (!observation.sourceRefs.length && (aggregate.sourceValidityRevocations?.length ?? 0) > 0) {
      blockers.push(`unattributed-observation:${observation.id}`)
    }
  }
  return blockers
}
