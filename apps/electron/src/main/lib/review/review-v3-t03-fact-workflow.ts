/**
 * T03 / F05-F06: case-scoped fact + evidence review projection.
 * Pure functions only: no duplicate CaseStore, no guessed source coordinates and
 * no direct mutation of persisted observations or historical ReviewRuns.
 */
import type { CaseAggregateV2, EvidenceLink, FieldValue, Observation, ReviewRunV2, SourceRef } from '@profer/shared'

export interface T03ExtractedFact {
  subjectId: string
  fieldKey: string
  value: FieldValue
  sourceRefs?: SourceRef[]
  confidence?: number
  /** Candidate identity is useful for displaying the original extraction, not an authorization. */
  id?: string
}

export interface T03FactRow {
  key: string
  subjectId: string
  subjectTitle: string
  fieldKey: string
  current: Observation | null
  candidates: T03ExtractedFact[]
  history: Observation[]
  sourceState: 'current' | 'stale' | 'unattributed'
  needsReview: boolean
  reasons: string[]
}

export interface T03EvidenceGroup {
  documentVersionId: string
  fileName: string
  active: boolean
  links: EvidenceLink[]
  /** Extracted facts with current document refs; not persisted or confirmed. */
  suggestions: Array<{ documentVersionId: string; subjectId: string; supportsFact: string; status: 'candidate' }>
  /** Multiple subject candidates on one document are not an identity decision. */
  ambiguousSubjectIds: string[]
}

const keyOf = (subjectId: string, fieldKey: string): string => JSON.stringify([subjectId, fieldKey])
const sameValue = (a: FieldValue, b: FieldValue): boolean => JSON.stringify(a) === JSON.stringify(b)

function sourceState(refs: readonly SourceRef[], caseId: string, documents: CaseAggregateV2['caseV2']['documents']): T03FactRow['sourceState'] {
  if (!refs.length) return 'unattributed'
  return refs.every(ref => {
    const doc = documents.find(doc => doc.versionId === ref.documentVersionId)
    return ref.caseId === caseId && !!doc && doc.active !== false && doc.parseRevision === ref.parseRevision
  }) ? 'current' : 'stale'
}

/**
 * Preserve a real extraction locator when a reviewer confirms a fact.
 * A legacy document-only selection can use a file locator, but an explicitly
 * stale revision or a cross-case reference must never be silently "upgraded".
 */
export function resolveT03CorrectionRefs(aggregate: CaseAggregateV2, rawRefs: unknown): SourceRef[] {
  if (!Array.isArray(rawRefs)) throw new Error('事实来源必须是原件引用列表')
  const refs = rawRefs.map((raw): SourceRef => {
    if (!raw || typeof raw !== 'object') throw new Error('事实来源缺少原件版本')
    const value = raw as Partial<SourceRef>
    if (typeof value.documentVersionId !== 'string') throw new Error('事实来源缺少原件版本')
    const doc = aggregate.caseV2.documents.find(item => item.versionId === value.documentVersionId)
    if (!doc || doc.active === false) throw new Error('事实引用的原件已停用或不存在，请重新选择当前原件')
    if ((value.caseId !== undefined && value.caseId !== aggregate.caseV2.id) ||
      (value.parseRevision !== undefined && value.parseRevision !== doc.parseRevision)) {
      throw new Error('事实来源属于其他案卷或旧解析版本，请重新核对来源')
    }
    const location = value.location ?? { kind: 'file' as const }
    if (!location || typeof location !== 'object' ||
      !['pdf-rect', 'sheet-cell', 'paragraph', 'text-range', 'file'].includes(location.kind)) {
      throw new Error('事实来源位置无效，请重新选择原件')
    }
    return {
      caseId: aggregate.caseV2.id,
      documentVersionId: doc.versionId,
      parseRevision: doc.parseRevision,
      location,
      ...(typeof value.quote === 'string' ? { quote: value.quote } : {}),
    }
  })
  return [...new Map(refs.map(ref => [JSON.stringify(ref), ref])).values()]
}

/**
 * Facts from the latest Run remain *candidates*, even when their values are identical.
 * The most recent still-current human confirmation is the displayed effective value.
 * Later AI extraction must not silently mask it. Historical rows are never discarded.
 */
export function projectT03Facts(aggregate: CaseAggregateV2, extracted: readonly T03ExtractedFact[] = []): T03FactRow[] {
  const byKey = new Map<string, { subjectId: string; fieldKey: string; history: Observation[]; candidates: T03ExtractedFact[] }>()
  const ensure = (subjectId: string, fieldKey: string) => {
    const key = keyOf(subjectId, fieldKey)
    let row = byKey.get(key)
    if (!row) {
      row = { subjectId, fieldKey, history: [], candidates: [] }
      byKey.set(key, row)
    }
    return row
  }
  for (const observation of aggregate.observations) ensure(observation.subjectId, observation.fieldKey).history.push(observation)
  for (const candidate of extracted) {
    if (candidate.subjectId && candidate.fieldKey) ensure(candidate.subjectId, candidate.fieldKey).candidates.push(candidate)
  }
  const subjects = new Map(aggregate.caseV2.subjects.map(subject => [subject.id, subject.title]))
  const docs = aggregate.caseV2.documents
  return [...byKey.entries()].map(([key, row]) => {
    // Break equal timestamps by append order, not lexical random IDs.
    const history = row.history
    // A later human correction supersedes an older confirmation even if the
    // new source subsequently expires. Never resurrect the superseded value.
    const lastHuman = [...history].reverse().find(ob => ob.confirmed && ob.extractedBy === 'user')
    const current = lastHuman && sourceState(lastHuman.sourceRefs, aggregate.caseV2.id, docs) === 'current'
      ? lastHuman : null
    const humanIndex = lastHuman ? history.lastIndexOf(lastHuman) : -1
    const candidates = [
      ...history.slice(humanIndex + 1).filter(ob => !ob.confirmed).map(ob => ({
        id: ob.id, subjectId: ob.subjectId, fieldKey: ob.fieldKey, value: ob.value,
        sourceRefs: ob.sourceRefs,
      })),
      ...row.candidates,
    ]
    const reasons: string[] = []
    if (!subjects.has(row.subjectId)) reasons.push('主体尚未归属')
    if (!current) reasons.push('尚无有效人工确认事实')
    if (current && candidates.some(c => !sameValue(c.value, current.value))) reasons.push('新提取值与已确认值不同')
    // Historical, already-superseded revisions remain visible in the audit
    // trail, but do not permanently contaminate the current review queue.
    if ((lastHuman && sourceState(lastHuman.sourceRefs, aggregate.caseV2.id, docs) === 'stale') ||
      candidates.some(c => sourceState(c.sourceRefs ?? [], aggregate.caseV2.id, docs) === 'stale')) {
      reasons.push('原件版本或解析修订已变化')
    }
    const links = aggregate.evidenceLinks.filter(link =>
      link.subjectId === row.subjectId && link.supportsFact === row.fieldKey && link.status !== 'rejected')
    if (links.some(link => {
      const doc = docs.find(doc => doc.versionId === link.documentVersionId)
      return !doc || doc.active === false
    })) reasons.push('已有证明关联指向旧原件')
    return {
      key, subjectId: row.subjectId, subjectTitle: subjects.get(row.subjectId) ?? row.subjectId,
      fieldKey: row.fieldKey, current, candidates, history,
      sourceState: current ? 'current' : lastHuman
        ? sourceState(lastHuman.sourceRefs, aggregate.caseV2.id, docs)
        : history.length ? sourceState(history[history.length - 1]!.sourceRefs, aggregate.caseV2.id, docs)
        : 'unattributed',
      needsReview: reasons.length > 0,
      reasons,
    }
  }).sort((a, b) => Number(b.needsReview) - Number(a.needsReview) ||
    a.subjectTitle.localeCompare(b.subjectTitle) || a.fieldKey.localeCompare(b.fieldKey))
}

export function projectT03Evidence(
  aggregate: CaseAggregateV2,
  extracted: readonly T03ExtractedFact[] = [],
): T03EvidenceGroup[] {
  const knownSubjects = new Set(aggregate.caseV2.subjects.map(subject => subject.id))
  return aggregate.caseV2.documents
    .filter(doc => doc.role === 'evidence' || aggregate.evidenceLinks.some(link => link.documentVersionId === doc.versionId) ||
      extracted.some(fact => fact.sourceRefs?.some(ref => ref.documentVersionId === doc.versionId)))
    .map(doc => {
      const links = aggregate.evidenceLinks.filter(link => link.documentVersionId === doc.versionId)
      const suggestions: T03EvidenceGroup['suggestions'] = []
      const seen = new Set<string>()
      if (doc.active !== false) for (const fact of extracted) {
        if (!knownSubjects.has(fact.subjectId) || !fact.sourceRefs?.some(ref =>
          ref.caseId === aggregate.caseV2.id && ref.documentVersionId === doc.versionId &&
          ref.parseRevision === doc.parseRevision)) continue
        const key = JSON.stringify([fact.subjectId, fact.fieldKey])
        if (seen.has(key) || links.some(link =>
          link.subjectId === fact.subjectId && link.supportsFact === fact.fieldKey)) continue
        seen.add(key)
        suggestions.push({
          documentVersionId: doc.versionId, subjectId: fact.subjectId,
          supportsFact: fact.fieldKey, status: 'candidate',
        })
      }
      const subjects = [...new Set([
        ...links.filter(link => link.status !== 'rejected').map(link => link.subjectId),
        ...suggestions.map(item => item.subjectId),
      ])]
      return {
        documentVersionId: doc.versionId, fileName: doc.fileName,
        active: doc.active !== false, links, suggestions,
        ambiguousSubjectIds: subjects.length > 1 && (suggestions.length > 0 || links.some(link => link.status === 'candidate')) ? subjects : [],
      }
    })
}

/** A suggested cross-subject link is ALWAYS a candidate, never a confirmed identity. */
export function proposedT03EvidenceLinks(
  documentVersionId: string,
  subjectIds: readonly string[],
  supportsFact: string,
  existing: readonly EvidenceLink[],
): Array<{ documentVersionId: string; subjectId: string; supportsFact: string; status: 'candidate' }> {
  return [...new Set(subjectIds)].filter(subjectId =>
    !existing.some(link => link.documentVersionId === documentVersionId &&
      link.subjectId === subjectId && link.supportsFact === supportsFact),
  ).map(subjectId => ({ documentVersionId, subjectId, supportsFact, status: 'candidate' as const }))
}

/** Typed corrections keep 0 distinct from a missing value. */
export function parseT03Correction(raw: string, previous: FieldValue): FieldValue {
  if (previous.kind === 'number') {
    if (!raw.trim()) throw new Error('数字不能为空；0 是有效数值')
    const value = Number(raw)
    if (!Number.isFinite(value)) throw new Error('请输入有效数字')
    return { kind: 'number', value, ...(previous.unit ? { unit: previous.unit } : {}) }
  }
  if (previous.kind === 'boolean') {
    if (raw !== 'true' && raw !== 'false') throw new Error('布尔值必须为 true 或 false')
    return { kind: 'boolean', value: raw === 'true' }
  }
  if (previous.kind === 'date') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
    if (!match) throw new Error('日期须为 YYYY-MM-DD')
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
    const actual = new Date(Date.UTC(year, month - 1, day))
    if (year < 100 || actual.getUTCFullYear() !== year || actual.getUTCMonth() !== month - 1 ||
      actual.getUTCDate() !== day) throw new Error('日期不在有效日历范围内')
    return { kind: 'date', value: raw.trim() }
  }
  if (previous.kind === 'enum') return { kind: 'enum', value: raw }
  if (previous.kind === 'text') return { kind: 'text', value: raw }
  // Compound/attachment corrections are edited in their corresponding field editor.
  throw new Error('该复合字段需要使用对应的结构化编辑器')
}

/** The run stays immutable; this identifies checks that require a NEW run. */
export interface T03RecheckImpact {
  affectedSubjectIds: string[]
  affectedCheckIds: string[]
  affectedRuleIds: string[]
  fullReviewRequired: boolean
  reasons: string[]
}
export function planT03Recheck(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2 | null,
  changes: { subjectIds?: readonly string[]; fieldKeys?: readonly string[]; documentVersionIds?: readonly string[]; evidenceLinkIds?: readonly string[] },
): T03RecheckImpact {
  const changedSubjects = new Set(changes.subjectIds ?? [])
  const fields = new Set(changes.fieldKeys ?? [])
  const docs = new Set(changes.documentVersionIds ?? [])
  const links = new Set(changes.evidenceLinkIds ?? [])
  for (const observation of aggregate.observations) {
    if (observation.sourceRefs.some(ref => docs.has(ref.documentVersionId))) {
      changedSubjects.add(observation.subjectId)
      fields.add(observation.fieldKey)
    }
  }
  for (const link of aggregate.evidenceLinks) {
    if (docs.has(link.documentVersionId) || links.has(link.id)) changedSubjects.add(link.subjectId)
  }
  const reasons: string[] = []
  const dependencies = run?.inputManifest.effectiveRuleDependencies
  const impactedRules = new Set<string>()
  if (dependencies) for (const dep of dependencies) {
    if (dep.fieldKeys.includes('*') || dep.fieldKeys.some(field => fields.has(field))) impactedRules.add(dep.ruleId)
  }
  const affectedChecks = (run?.checks ?? []).filter(check => {
    const subjectHit = changedSubjects.size === 0 || check.target.scope === 'case' ||
      check.target.subjectIds.some(id => changedSubjects.has(id))
    const sourceHit = check.sourceRefs.some(ref => docs.has(ref.documentVersionId)) ||
      check.basis?.sourceRefs.some(ref => docs.has(ref.documentVersionId)) ||
      check.basis?.evidenceLinkIds.some(id => links.has(id))
    const fieldHit = !dependencies || fields.size === 0 || impactedRules.has(check.ruleId)
    return Boolean(sourceHit || (subjectHit && fieldHit) ||
      check.basis?.observationIds.some(id => aggregate.observations.some(ob => ob.id === id &&
        changedSubjects.has(ob.subjectId) && (fields.size === 0 || fields.has(ob.fieldKey)))))
  })
  if (!run) reasons.push('暂无旧 Run；变更后需要首次审核')
  if (run && !dependencies) reasons.push('旧 Run 无规则字段依赖；按主体保守标记检查')
  if (docs.size) reasons.push('原件版本变化：旧 Run 不可改写，需按实际依赖启动新审核')
  return {
    affectedSubjectIds: [...changedSubjects].sort(),
    affectedCheckIds: affectedChecks.map(check => check.checkId),
    affectedRuleIds: [...new Set(affectedChecks.map(check => check.ruleId))].sort(),
    fullReviewRequired: !run || (!!run && !dependencies && changedSubjects.size === 0),
    reasons,
  }
}
