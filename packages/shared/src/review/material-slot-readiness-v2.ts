import type { CaseAggregateV2, ConditionAST, DocumentVersion, MaterialSlotSpec } from '../types'

export type MaterialSlotStatusV2 = 'compliant' | 'awaiting-supplement' | 'awaiting-confirmation' | 'not-applicable'
export interface MaterialSlotAssessmentV2 {
  slotId: string
  status: MaterialSlotStatusV2
  count: number
  assignedCount: number
  reason: string
}

type TriState = 'true' | 'false' | 'unknown'

function rawField(value: unknown): unknown {
  if (!value || typeof value !== 'object') return undefined
  const candidate = value as Record<string, unknown>
  if (candidate.kind === 'attachment' && typeof candidate.documentVersionId === 'string') return candidate.documentVersionId
  if ('value' in candidate) return candidate.value
  return undefined
}

function equalValue(left: unknown, right: unknown): boolean {
  if (typeof left === 'number' && typeof right === 'number') return left === right
  if (typeof left === 'boolean' && typeof right === 'boolean') return left === right
  return String(left ?? '').trim() === String(right ?? '').trim()
}

function knownValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

function fieldValue(
  key: string,
  aggregate: CaseAggregateV2,
  subjectId?: string,
  isFact = false,
): unknown {
  if (isFact) {
    const matching = aggregate.observations.filter((item) =>
      item.fieldKey === key && item.confirmed && (!subjectId || item.subjectId === subjectId))
    if (!matching.length) return undefined
    const values = matching.map((item) => rawField(item.value))
    return values.every((value) => equalValue(value, values[0])) ? values[0] : undefined
  }
  const subject = subjectId ? aggregate.caseV2.subjects.find((item) => item.id === subjectId) : undefined
  if (subject && key in subject.fields) return rawField(subject.fields[key])
  if (key in aggregate.caseV2.caseFields) return rawField(aggregate.caseV2.caseFields[key])
  const values = aggregate.caseV2.subjects.flatMap((item) => key in item.fields ? [rawField(item.fields[key])] : [])
  if (!values.length || !values.every((value) => equalValue(value, values[0]))) return undefined
  return values[0]
}

function conditionValue(condition: ConditionAST, aggregate: CaseAggregateV2, subjectId?: string): TriState {
  if ('all' in condition) {
    const values = condition.all.map((item) => conditionValue(item, aggregate, subjectId))
    return values.includes('false') ? 'false' : values.includes('unknown') ? 'unknown' : 'true'
  }
  if ('any' in condition) {
    const values = condition.any.map((item) => conditionValue(item, aggregate, subjectId))
    return values.includes('true') ? 'true' : values.includes('unknown') ? 'unknown' : 'false'
  }
  if ('not' in condition) {
    const value = conditionValue(condition.not, aggregate, subjectId)
    return value === 'unknown' ? 'unknown' : value === 'true' ? 'false' : 'true'
  }
  const actual = fieldValue('field' in condition ? condition.field : condition.fact, aggregate, subjectId, 'fact' in condition)
  const op = condition.op
  if (op === 'exists') {
    if (actual !== undefined) return knownValue(actual) ? 'true' : 'false'
    return 'unknown'
  }
  if (actual === undefined) return 'unknown'
  const expected = condition.value
  if (op === 'eq') return equalValue(actual, expected) ? 'true' : 'false'
  if (op === 'neq') return equalValue(actual, expected) ? 'false' : 'true'
  if (op === 'in') {
    if (!Array.isArray(expected)) return 'unknown'
    return expected.some((item) => equalValue(actual, item)) ? 'true' : 'false'
  }
  const left = typeof actual === 'number' ? actual : Number(actual)
  const right = typeof expected === 'number' ? expected : Number(expected)
  if (Number.isFinite(left) && Number.isFinite(right)) {
    if (op === 'gt') return left > right ? 'true' : 'false'
    if (op === 'gte') return left >= right ? 'true' : 'false'
    if (op === 'lt') return left < right ? 'true' : 'false'
    if (op === 'lte') return left <= right ? 'true' : 'false'
  }
  if (typeof actual === 'string' && typeof expected === 'string') {
    if (op === 'gt') return actual > expected ? 'true' : 'false'
    if (op === 'gte') return actual >= expected ? 'true' : 'false'
    if (op === 'lt') return actual < expected ? 'true' : 'false'
    if (op === 'lte') return actual <= expected ? 'true' : 'false'
  }
  return 'unknown'
}

function slotApplicability(aggregate: CaseAggregateV2, slot: MaterialSlotSpec): TriState {
  if (!slot.requiredWhen) return 'true'
  const subjects = aggregate.caseV2.subjects.filter((subject) =>
    !slot.sectionId || subject.sectionId === slot.sectionId)
  if (!subjects.length) return conditionValue(slot.requiredWhen, aggregate)
  const values = subjects.map((subject) => conditionValue(slot.requiredWhen!, aggregate, subject.id))
  return values.includes('true') ? 'true' : values.includes('unknown') ? 'unknown' : 'false'
}

function materialKind(document: DocumentVersion): MaterialSlotSpec['acceptedKinds'][number] | undefined {
  const name = document.fileName.toLowerCase()
  const mime = document.mimeType.toLowerCase()
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''
  if (ext === '.pdf' || mime.includes('pdf')) return 'pdf'
  if (mime.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'].includes(ext)) return 'image'
  if (ext === '.zip' || mime.includes('zip')) return 'zip'
  if (['.xls', '.xlsx', '.xlsm', '.xltx', '.xltm', '.et', '.ett', '.ods', '.csv'].includes(ext) ||
      mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') return 'sheet'
  if (['.doc', '.docx', '.docm', '.dot', '.dotx', '.dotm', '.ppt', '.pptx', '.pptm', '.potx', '.potm', '.ppsx', '.ppsm', '.rtf', '.odt', '.odp'].includes(ext) ||
      mime.includes('word') || mime.includes('presentation') || mime.includes('opendocument')) return 'office'
  if (['.txt', '.md', '.json', '.html', '.htm', '.eml'].includes(ext) || mime.startsWith('text/')) return 'text'
  return undefined
}

export function assessMaterialSlotV2(
  aggregate: CaseAggregateV2,
  slot: MaterialSlotSpec,
): MaterialSlotAssessmentV2 {
  const assigned = aggregate.caseV2.documents.filter((document) =>
    document.active !== false && document.materialSlotId === slot.id)
  const acceptedKinds = slot.acceptedKinds ?? []
  const acceptedRoles = slot.acceptedRoles ?? []
  const roleAccepted = acceptedRoles.length === 0
    ? assigned
    : assigned.filter((document) => acceptedRoles.includes(document.role))
  const accepted = acceptedKinds.length === 0
    ? roleAccepted
    : roleAccepted.filter((document) => {
      const kind = materialKind(document)
      return kind !== undefined && acceptedKinds.includes(kind)
    })
  const applicability = slotApplicability(aggregate, slot)
  if (applicability === 'false') return {
    slotId: slot.id, status: 'not-applicable', count: accepted.length, assignedCount: assigned.length,
    reason: `材料槽「${slot.name}」按模板条件不适用。`,
  }
  if (applicability === 'unknown') return {
    slotId: slot.id, status: 'awaiting-confirmation', count: accepted.length, assignedCount: assigned.length,
    reason: `材料槽「${slot.name}」的适用条件尚不能确认；请核实模板要求涉及的字段或事实。`,
  }
  const minimum = Number.isSafeInteger(slot.minCount) && slot.minCount >= 0 ? slot.minCount : 1
  const maximum = Number.isSafeInteger(slot.maxCount) && slot.maxCount >= 0 ? slot.maxCount : Number.MAX_SAFE_INTEGER
  if (assigned.length > maximum) return {
    slotId: slot.id, status: 'awaiting-confirmation', count: accepted.length, assignedCount: assigned.length,
    reason: `材料槽「${slot.name}」已登记 ${assigned.length} 份，超过模板允许的最多 ${maximum} 份；请先核对版本和重复件。`,
  }
  if (accepted.length < minimum) return {
    slotId: slot.id, status: 'awaiting-supplement', count: accepted.length, assignedCount: assigned.length,
    reason: assigned.length > accepted.length
      ? `材料槽「${slot.name}」需要至少 ${minimum} 份符合类别和文件类型的材料，当前只有 ${accepted.length} 份可用（已绑定 ${assigned.length} 份；${[
        roleAccepted.length < assigned.length ? '材料类别不匹配' : '',
        accepted.length < roleAccepted.length ? '文件类型不匹配' : '',
      ].filter(Boolean).join('且') || '材料不可用'}）。`
      : `材料槽「${slot.name}」缺少材料：需要至少 ${minimum} 份，当前 ${accepted.length} 份。`,
  }
  return {
    slotId: slot.id, status: 'compliant', count: accepted.length, assignedCount: assigned.length,
    reason: `材料槽「${slot.name}」材料数量与文件类型满足模板要求。`,
  }
}
