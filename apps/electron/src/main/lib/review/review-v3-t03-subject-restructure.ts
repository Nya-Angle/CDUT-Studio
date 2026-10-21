/**
 * T03 F05/A05: actual domain transformations for split/merge/re-attribution.
 *
 * These are pure, source-preserving proposals for the single native Case CAS
 * writer. No partial sequence of IPC writes: subject retirement, new candidates,
 * evidence relinking and review staleness must commit as ONE transaction.
 */
import type {
  CaseAggregateV2, EvidenceLink, FieldValue, Observation, ReviewRunV2, ReviewSubject, SourceRef,
} from '@profer/shared'
import { planT03Recheck, projectT03Facts, type T03RecheckImpact } from './review-v3-t03-fact-workflow'

export interface T03RestructureProposal {
  kind: 'split' | 'merge'
  operationId: string
  caseId: string
  expectedRevision: number
  /** Original subjects become ignored only once the single CAS command succeeds. */
  retireSubjectIds: string[]
  retireEvidenceLinkIds: string[]
  proposedSubjects: ReviewSubject[]
  /** All new observations are unconfirmed even when copied from previously confirmed input. */
  proposedObservations: Observation[]
  /** All migrated links are candidate; their new ownership must be confirmed. */
  proposedEvidenceLinks: EvidenceLink[]
  blockedReasons: string[]
  impact: T03RecheckImpact
}

export interface T03SplitPart {
  id: string
  title: string
  fieldKeys: string[]
  /** Explicit old link IDs: no guessing from a shared certificate or matching names. */
  evidenceLinkIds: string[]
  /** Optional explicit original anchors for this new subject (not all old anchors). */
  sourceRefs?: SourceRef[]
}

function activeRef(ref: SourceRef, aggregate: CaseAggregateV2): boolean {
  return ref.caseId === aggregate.caseV2.id &&
    aggregate.caseV2.documents.some(doc =>
      doc.versionId === ref.documentVersionId && doc.active !== false && doc.parseRevision === ref.parseRevision)
}
function uniqueRefs(refs: readonly SourceRef[]): SourceRef[] {
  return [...new Map(refs.map(ref => [JSON.stringify(ref), ref])).values()]
}
function freshObservation(
  observation: Observation,
  targetSubjectId: string,
  operationId: string,
  index: number,
  now: string,
): Observation {
  return {
    id: 't03-' + operationId + '-obs-' + index,
    subjectId: targetSubjectId,
    fieldKey: observation.fieldKey,
    value: observation.value,
    sourceRefs: [...observation.sourceRefs],
    extractedBy: 'user',
    confirmed: false,
    supersedesObservationId: observation.id,
    createdAt: now,
  }
}
function freshLink(
  link: EvidenceLink,
  targetSubjectId: string,
  operationId: string,
  index: number,
): EvidenceLink {
  return {
    ...link,
    id: 't03-' + operationId + '-link-' + index,
    subjectId: targetSubjectId,
    status: 'candidate',
    linkedBy: 'user',
  }
}
function subjectById(aggregate: CaseAggregateV2, id: string): ReviewSubject {
  const subject = aggregate.caseV2.subjects.find(item => item.id === id && item.status !== 'ignored')
  if (!subject) throw new Error('找不到有效原始事项：' + id)
  return subject
}
function ensureNewIds(aggregate: CaseAggregateV2, ids: readonly string[]): void {
  if (ids.some(id => !id.trim()) || ids.length !== new Set(ids).size ||
    ids.some(id => aggregate.caseV2.subjects.some(subject => subject.id === id))) {
    throw new Error('拆并后主体 ID 必须是全新且互不重复的标识')
  }
}
function currentObservations(aggregate: CaseAggregateV2, sourceSubjectIds: readonly string[]): Observation[] {
  // A later AI hypothesis may not displace a still-valid human confirmation.
  // Fall back to the latest candidate only when this field has no current confirmation.
  return projectT03Facts(aggregate)
    .filter(row => sourceSubjectIds.includes(row.subjectId))
    .flatMap(row => {
      const picked = row.current ?? row.history[row.history.length - 1]
      return picked ? [picked] : []
    })
}
function operationChecks(aggregate: CaseAggregateV2, operationId: string): void {
  if (!operationId.trim()) throw new Error('拆并操作必须有稳定 requestId')
  if (aggregate.caseV2.stage === 'decided' || aggregate.caseV2.stage === 'archived') {
    throw new Error('已决定或归档案卷不能直接重写主体；请使用正式复核流程')
  }
}

/**
 * Split an incorrectly fused subject into two or more explicitly attributed
 * entities. Every field and non-rejected evidence link needs an explicit owner.
 * Unassigned/conflicting material blocks commit rather than being lost.
 */
export function proposeT03SubjectSplit(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2 | null,
  input: { operationId: string; subjectId: string; parts: T03SplitPart[]; now?: string },
): T03RestructureProposal {
  operationChecks(aggregate, input.operationId)
  const origin = subjectById(aggregate, input.subjectId)
  if (input.parts.length < 2) throw new Error('拆分至少需要两个目标事项')
  ensureNewIds(aggregate, input.parts.map(part => part.id))
  const oldLinks = aggregate.evidenceLinks.filter(link =>
    link.subjectId === origin.id && link.status !== 'rejected')
  const latest = currentObservations(aggregate, [origin.id])
  const allFields = new Set([...Object.keys(origin.fields), ...latest.map(ob => ob.fieldKey)])
  const assignedFields = input.parts.flatMap(part => part.fieldKeys)
  const assignedLinks = input.parts.flatMap(part => part.evidenceLinkIds)
  const blockedReasons: string[] = []
  for (const key of allFields) {
    if (assignedFields.filter(field => field === key).length !== 1) blockedReasons.push('字段未唯一归属：' + key)
  }
  for (const link of oldLinks) {
    if (assignedLinks.filter(id => id === link.id).length !== 1) blockedReasons.push('证明未唯一归属：' + link.id)
  }
  if (assignedLinks.some(id => !oldLinks.some(link => link.id === id))) blockedReasons.push('存在无效证明关联 ID')
  const now = input.now ?? new Date().toISOString()
  const proposedSubjects: ReviewSubject[] = []
  const proposedObservations: Observation[] = []
  const proposedEvidenceLinks: EvidenceLink[] = []
  for (const part of input.parts) {
    const valueFields: Record<string, FieldValue> = {}
    for (const key of part.fieldKeys) if (origin.fields[key]) valueFields[key] = origin.fields[key]!
    // Only evidence explicitly assigned to this part can become its source.
    // Copying all original subject refs into every split part would fabricate ownership.
    const assignedLinks = oldLinks.filter(link => part.evidenceLinkIds.includes(link.id))
    const linkRefs: SourceRef[] = assignedLinks.flatMap(link => {
      const doc = aggregate.caseV2.documents.find(item =>
        item.versionId === link.documentVersionId && item.active !== false)
      if (!doc) return []
      const ref: SourceRef = link.blockRef && activeRef(link.blockRef, aggregate)
        ? link.blockRef
        : { caseId: aggregate.caseV2.id, documentVersionId: doc.versionId,
            parseRevision: doc.parseRevision, location: { kind: 'file' } }
      return [ref]
    })
    const sources = uniqueRefs([
      ...(part.sourceRefs ?? []).filter(ref => activeRef(ref, aggregate)),
      ...latest.filter(ob => part.fieldKeys.includes(ob.fieldKey)).flatMap(ob => ob.sourceRefs)
        .filter(ref => activeRef(ref, aggregate)),
      ...linkRefs,
    ])
    if (!sources.length) blockedReasons.push('新事项缺少可核验来源：' + part.id)
    if ((part.sourceRefs ?? []).some(ref => !activeRef(ref, aggregate)))
      blockedReasons.push('新事项包含失效来源：' + part.id)
    proposedSubjects.push({
      id: part.id, title: part.title, type: origin.type, sectionId: origin.sectionId,
      fields: valueFields, sourceRefs: sources, correction: 'user-confirmed', status: 'identified',
    })
    for (const ob of latest.filter(ob => part.fieldKeys.includes(ob.fieldKey))) {
      if (!ob.sourceRefs.length || ob.sourceRefs.some(ref => !activeRef(ref, aggregate)))
        blockedReasons.push('拆分事实缺少当前有效来源：' + ob.fieldKey)
      proposedObservations.push(freshObservation(ob, part.id, input.operationId, proposedObservations.length, now))
    }
    for (const link of oldLinks.filter(link => part.evidenceLinkIds.includes(link.id))) {
      if (!aggregate.caseV2.documents.some(doc =>
        doc.versionId === link.documentVersionId && doc.active !== false)) {
        blockedReasons.push('证明使用了已失效原件：' + link.id)
        continue
      }
      proposedEvidenceLinks.push(freshLink(link, part.id, input.operationId, proposedEvidenceLinks.length))
    }
  }
  return {
    kind: 'split', operationId: input.operationId, caseId: aggregate.caseV2.id,
    expectedRevision: aggregate.caseV2.revision,
    retireSubjectIds: [origin.id],
    retireEvidenceLinkIds: oldLinks.map(link => link.id),
    proposedSubjects, proposedObservations, proposedEvidenceLinks,
    blockedReasons,
    impact: planT03Recheck(aggregate, run, {
      subjectIds: [origin.id], fieldKeys: [...allFields],
      evidenceLinkIds: oldLinks.map(link => link.id),
    }),
  }
}

/**
 * Merge duplicate subjects to a NEW identity. Conflicting field values are
 * intentionally absent from the new subject until the user resolves them.
 */
export function proposeT03SubjectMerge(
  aggregate: CaseAggregateV2,
  run: ReviewRunV2 | null,
  input: { operationId: string; subjectIds: string[]; newSubjectId: string; title: string; now?: string },
): T03RestructureProposal {
  operationChecks(aggregate, input.operationId)
  if (new Set(input.subjectIds).size < 2) throw new Error('合并至少需要两个不同事项')
  ensureNewIds(aggregate, [input.newSubjectId])
  const originals = input.subjectIds.map(id => subjectById(aggregate, id))
  const first = originals[0]!
  const oldLinks = aggregate.evidenceLinks.filter(link =>
    input.subjectIds.includes(link.subjectId) && link.status !== 'rejected')
  const latest = currentObservations(aggregate, input.subjectIds)
  const fields: Record<string, FieldValue> = {}
  const blockedReasons: string[] = []
  const keys = new Set(originals.flatMap(subject => Object.keys(subject.fields)))
  for (const ob of latest) keys.add(ob.fieldKey)
  for (const key of keys) {
    // An explicit correction is newer than the originally submitted fields.
    // Compare the effective value per subject, not both historical versions.
    const options = originals.flatMap(subject => {
      const observation = latest.find(ob => ob.subjectId === subject.id && ob.fieldKey === key)
      return observation ? [observation.value] : subject.fields[key] ? [subject.fields[key]!] : []
    })
    if (new Set(options.map(value => JSON.stringify(value))).size > 1) {
      blockedReasons.push('合并字段存在冲突，必须人工确认：' + key)
    } else if (options[0]) fields[key] = options[0]
  }
  const sources = uniqueRefs(originals.flatMap(subject => subject.sourceRefs)
    .filter(ref => activeRef(ref, aggregate)))
  if (!sources.length && !latest.some(ob => ob.sourceRefs.some(ref => activeRef(ref, aggregate)))) {
    blockedReasons.push('合并事项缺少当前有效原件来源')
  }
  const now = input.now ?? new Date().toISOString()
  for (const ob of latest) {
    if (!ob.sourceRefs.length || ob.sourceRefs.some(ref => !activeRef(ref, aggregate)))
      blockedReasons.push('合并事实缺少当前有效来源：' + ob.fieldKey)
  }
  const proposedObservations = latest.map((ob, i) =>
    freshObservation(ob, input.newSubjectId, input.operationId, i, now))
  const distinctLinks = new Map<string, EvidenceLink>()
  for (const link of oldLinks) {
    if (!aggregate.caseV2.documents.some(doc =>
      doc.versionId === link.documentVersionId && doc.active !== false)) continue
    const signature = JSON.stringify([link.documentVersionId, link.supportsFact, link.blockRef ?? null])
    if (!distinctLinks.has(signature)) distinctLinks.set(signature, link)
  }
  const proposedEvidenceLinks = [...distinctLinks.values()].map((link, i) =>
    freshLink(link, input.newSubjectId, input.operationId, i))
  if (new Set(originals.map(subject => subject.sectionId)).size > 1)
    blockedReasons.push('跨分项事项不能直接合并')
  if (new Set(originals.map(subject => subject.type)).size > 1)
    blockedReasons.push('不同类型的事项不能直接合并')
  const proposedSubjects: ReviewSubject[] = [{
    id: input.newSubjectId, title: input.title, type: first.type,
    sectionId: first.sectionId, fields, sourceRefs: sources,
    correction: 'user-confirmed', status: 'identified',
  }]
  return {
    kind: 'merge', operationId: input.operationId, caseId: aggregate.caseV2.id,
    expectedRevision: aggregate.caseV2.revision,
    retireSubjectIds: [...input.subjectIds],
    retireEvidenceLinkIds: oldLinks.map(link => link.id),
    proposedSubjects, proposedObservations, proposedEvidenceLinks,
    blockedReasons,
    impact: planT03Recheck(aggregate, run, {
      subjectIds: input.subjectIds,
      fieldKeys: [...new Set([...keys, ...latest.map(ob => ob.fieldKey)])],
      evidenceLinkIds: oldLinks.map(link => link.id),
    }),
  }
}
