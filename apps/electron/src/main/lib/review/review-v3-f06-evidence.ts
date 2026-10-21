/**
 * F06 证明链只读投影与人工绑定预检。
 *
 * 业务真值仍是 CaseAggregateV2 / SetEvidenceLink；此处只解释现有版本、
 * 候选来源和多对多关系，不根据文件名/同名主体自动确定归属或计分。
 */
import type { CaseAggregateV2, DocumentVersion, EvidenceLink, SourceRef } from '@profer/shared'

export interface F06ExtractedFact {
  subjectId: string
  fieldKey: string
  sourceRefs?: SourceRef[]
}

export type F06LinkValidity = 'current' | 'retired' | 'missing-document' | 'stale-source'

export interface F06LinkedFact {
  link: EvidenceLink
  validity: F06LinkValidity
}

export interface F06EvidenceGroup {
  document: DocumentVersion
  links: F06LinkedFact[]
  /** 模型或提取器只产生提议，绝不直接确认为主体身份。 */
  suggestions: Array<{ subjectId: string; supportsFact: string; sourceRef: SourceRef }>
  /** 内容哈希相同不代表重复申报，更不代表可以跨主体自动复用。 */
  sameContentVersionIds: string[]
  ambiguousSubjectIds: string[]
  currentConfirmedCount: number
  unassigned: boolean
}

function nonEmptyHash(document: DocumentVersion): string | null {
  return document.contentHash?.trim() || null
}

function currentDocument(aggregate: CaseAggregateV2, versionId: string): DocumentVersion | undefined {
  return aggregate.caseV2.documents.find(document => document.versionId === versionId)
}

/** 证据引用过期不能继续计为当前有效证明，但保留历史链接。 */
export function f06LinkValidity(aggregate: CaseAggregateV2, link: EvidenceLink): F06LinkValidity {
  const document = currentDocument(aggregate, link.documentVersionId)
  if (!document) return 'missing-document'
  if (document.active === false) return 'retired'
  if (link.blockRef && (link.blockRef.caseId !== aggregate.caseV2.id ||
    link.blockRef.documentVersionId !== document.versionId ||
    link.blockRef.parseRevision !== document.parseRevision)) return 'stale-source'
  return 'current'
}

/** 一个案卷中的所有证明版本均可见，包括尚未绑定与已经退役的版本。 */
export function projectF06Evidence(
  aggregate: CaseAggregateV2,
  extracted: readonly F06ExtractedFact[] = [],
): F06EvidenceGroup[] {
  const subjects = new Map(aggregate.caseV2.subjects.map(subject => [subject.id, subject.title]))
  const documentVersions = aggregate.caseV2.documents
  const titles = new Map<string, string[]>()
  for (const subject of aggregate.caseV2.subjects) {
    titles.set(subject.title.trim(), [...(titles.get(subject.title.trim()) ?? []), subject.id])
  }

  return documentVersions.filter(document => document.role === 'evidence' ||
    aggregate.evidenceLinks.some(link => link.documentVersionId === document.versionId) ||
    extracted.some(fact => fact.sourceRefs?.some(ref => ref.documentVersionId === document.versionId)))
    .map(document => {
      const links = aggregate.evidenceLinks
        .filter(link => link.documentVersionId === document.versionId)
        .map(link => ({ link, validity: f06LinkValidity(aggregate, link) }))
      const suggestions: F06EvidenceGroup['suggestions'] = []
      const seen = new Set<string>()
      if (document.active !== false) for (const fact of extracted) {
        if (!subjects.has(fact.subjectId) || !fact.fieldKey.trim()) continue
        const ref = fact.sourceRefs?.find(source => source.caseId === aggregate.caseV2.id &&
          source.documentVersionId === document.versionId && source.parseRevision === document.parseRevision &&
          !!source.location)
        if (!ref) continue
        const key = JSON.stringify([fact.subjectId, fact.fieldKey.trim()])
        if (seen.has(key) || links.some(item => item.link.subjectId === fact.subjectId &&
          item.link.supportsFact === fact.fieldKey.trim())) continue
        seen.add(key)
        suggestions.push({ subjectId: fact.subjectId, supportsFact: fact.fieldKey.trim(), sourceRef: ref })
      }

      const candidateSubjects = new Set([
        ...links.filter(item => item.link.status === 'candidate' && item.validity === 'current')
          .map(item => item.link.subjectId),
        ...suggestions.map(item => item.subjectId),
      ])
      // 同名主体也必须显式区分 ID；绝不以姓名或文件名推断归属。
      const ambiguous = new Set<string>()
      for (const subjectId of candidateSubjects) {
        const homonyms = titles.get(subjects.get(subjectId) ?? '') ?? []
        if (homonyms.length > 1) homonyms.forEach(id => ambiguous.add(id))
        else if (candidateSubjects.size > 1) ambiguous.add(subjectId)
      }
      const hash = nonEmptyHash(document)
      return {
        document,
        links,
        suggestions,
        sameContentVersionIds: hash ? documentVersions.filter(other =>
          other.versionId !== document.versionId && nonEmptyHash(other) === hash)
          .map(other => other.versionId) : [],
        ambiguousSubjectIds: [...ambiguous],
        currentConfirmedCount: links.filter(item => item.link.status === 'confirmed' && item.validity === 'current').length,
        unassigned: !links.some(item => item.validity === 'current' && item.link.status !== 'rejected') &&
          suggestions.length === 0,
      }
    })
}

export interface F06AssignmentPreview {
  documentVersionId: string
  supportsFact: string
  subjectIdsToCreate: string[]
  existing: EvidenceLink[]
  rejected: EvidenceLink[]
  errors: string[]
}

/**
 * 单次 SetEvidenceLink 已支持一个事实对应多个主体的 CAS 事务。
 * 不跨越拒绝历史重建相同三元组；如需推翻拒绝，应单独明确复核旧链接。
 */
export function previewF06Assignment(
  aggregate: CaseAggregateV2,
  input: { documentVersionId: string; subjectIds: readonly string[]; supportsFact: string },
): F06AssignmentPreview {
  const document = currentDocument(aggregate, input.documentVersionId)
  const supportsFact = input.supportsFact.trim()
  const subjectIds = [...new Set(input.subjectIds)]
  const validSubjects = new Set(aggregate.caseV2.subjects.map(subject => subject.id))
  const errors: string[] = []
  if (!document) errors.push('原件版本不存在')
  else if (document.active === false) errors.push('旧原件已退役，不能新增当前绑定')
  if (!supportsFact) errors.push('请填写证明支持的事实')
  if (!subjectIds.length) errors.push('请明确勾选至少一个目标主体')
  if (subjectIds.some(id => !validSubjects.has(id))) errors.push('目标主体已变化，请重新选择')
  const existing = aggregate.evidenceLinks.filter(link =>
    link.documentVersionId === input.documentVersionId &&
    link.supportsFact === supportsFact && subjectIds.includes(link.subjectId))
  const rejected = existing.filter(link => link.status === 'rejected')
  if (rejected.length) errors.push('已有人工拒绝的同一绑定；须先单独复核旧记录，不可静默复活')
  return {
    documentVersionId: input.documentVersionId,
    supportsFact,
    subjectIdsToCreate: subjectIds.filter(id => !existing.some(link => link.subjectId === id)),
    existing,
    rejected,
    errors,
  }
}

export function describeF06Location(ref?: SourceRef): string {
  if (!ref) return '仅关联原件版本（尚无块级定位）'
  switch (ref.location.kind) {
    case 'pdf-rect': return `第 ${ref.location.page} 页 · 有坐标范围`
    case 'sheet-cell': return `${ref.location.sheet}!${ref.location.column}${ref.location.row}`
    case 'paragraph': return `第 ${ref.location.index} 段`
    case 'text-range': return `字符 ${ref.location.start}–${ref.location.end}`
    case 'file': return '仅文件级定位'
  }
}
