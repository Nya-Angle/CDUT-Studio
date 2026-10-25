import type { BatchManifestRow } from './review-v3-t06-batch-intake'
import type { T06GroupChoice, T06PhysicalPreview } from './review-v3-t06-physical-intake'

/**
 * CSV external ID / project ID may suggest a matching folder, but never gives
 * trusted identity automatically. Users must explicitly apply and inspect it.
 * Applicant names and file names are not considered unique identifiers.
 */
export function suggestT06PhysicalManifest(
  preview: T06PhysicalPreview, manifest: BatchManifestRow[],
  knownCaseIds: readonly string[],
): { suggestions: Record<string, T06GroupChoice>; unmatched: string[]; ambiguous: string[] } {
  const byExternalId = new Map<string, BatchManifestRow[]>()
  for (const row of manifest) {
    for (const id of [row.externalId.trim(), row.caseId.trim()]) {
      if (!id) continue
      const group = byExternalId.get(id) ?? []
      if (!group.some(x => x.line === row.line)) group.push(row)
      byExternalId.set(id, group)
    }
  }
  const suggestions: Record<string, T06GroupChoice> = {}
  const unmatched: string[] = [], ambiguous: string[] = []
  const usedRows = new Set<number>()
  const known = new Set(knownCaseIds)
  for (const group of preview.groups) {
    if (group.unassigned) { unmatched.push(group.name); continue }
    const matches = byExternalId.get(group.name) ?? []
    if (!matches.length) { unmatched.push(group.name); continue }
    if (matches.length !== 1 || usedRows.has(matches[0]!.line)) { ambiguous.push(group.name); continue }
    const row = matches[0]!
    if (row.caseId && known.has(row.caseId)) {
      suggestions[group.groupId] = { action: 'existing', caseId: row.caseId }
    } else if (row.applicant.trim()) {
      suggestions[group.groupId] = {
        action: 'create', title: row.title.trim() || group.name, applicant: row.applicant.trim(),
      }
    } else { unmatched.push(group.name); continue }
    usedRows.add(row.line)
  }
  return { suggestions, unmatched, ambiguous }
}
