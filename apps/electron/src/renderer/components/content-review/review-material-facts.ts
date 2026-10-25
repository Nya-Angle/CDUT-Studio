import type { CaseAggregateV2 } from '@profer/shared'

export interface MaterialRecognizedFact {
  subjectId: string
  fieldKey: string
  value: string
  confirmed: boolean
}

/**
 * 仅按当前原件版本/解析版本的真实 SourceRef 投影识别事实，不更新旧 V1 EvidenceDocument。
 * 历史撤销事实与过期 Run 不得在当前证明材料行上冒充已识别/已确认。
 */
export function currentMaterialRecognizedFacts(
  aggregate: CaseAggregateV2,
  documentVersionId: string,
  extractedFromRun: readonly Record<string, unknown>[],
  runStale: boolean,
): MaterialRecognizedFact[] {
  const active = new Map(aggregate.caseV2.documents.filter(doc => doc.active !== false)
    .map(doc => [doc.versionId, doc]))
  if (!active.has(documentVersionId)) return []
  const revoked = new Set((aggregate.sourceValidityRevocations ?? [])
    .flatMap(entry => entry.observationIds))
  const current = [...aggregate.observations.filter(item => !revoked.has(item.id)),
    ...(!runStale ? extractedFromRun : [])]
  const result = new Map<string, MaterialRecognizedFact>()
  for (const item of current) {
    if (!item || typeof item !== 'object') continue
    const refs = Array.isArray(item.sourceRefs) ? item.sourceRefs : []
    if (!refs.length || !refs.every(ref => {
      if (!ref || typeof ref !== 'object') return false
      const source = ref as { caseId?: unknown; documentVersionId?: unknown; parseRevision?: unknown }
      const document = active.get(String(source.documentVersionId ?? ''))
      return source.caseId === aggregate.caseV2.id && !!document && source.parseRevision === document.parseRevision
    }) || !refs.some(ref => (ref as { documentVersionId?: unknown }).documentVersionId === documentVersionId)) continue
    const fieldKey = typeof item.fieldKey === 'string' ? item.fieldKey : ''
    const subjectId = typeof item.subjectId === 'string' ? item.subjectId : ''
    const rawValue = item.value
    const value = rawValue && typeof rawValue === 'object' && 'value' in rawValue
      ? String((rawValue as { value: unknown }).value ?? '') : String(rawValue ?? '')
    if (!fieldKey || !subjectId || !value.trim()) continue
    const confirmed = item.confirmed === true
    const key = `${subjectId}:${fieldKey}:${value}`
    const previous = result.get(key)
    if (!previous || (confirmed && !previous.confirmed)) {
      result.set(key, { subjectId, fieldKey, value: value.slice(0, 180), confirmed })
    }
  }
  return [...result.values()]
}
