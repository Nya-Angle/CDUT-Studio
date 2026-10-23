/**
 * 审核应用服务（N1c，docs/design/review-agent/07 §3.2 命令清单的 N1 子集）
 *
 * 首批命令（每条都校验发布依赖/字段作用域/确认锁）：
 * - CreateCaseFromTemplate：模板已发布 + 政策依赖齐全；生成案卷级字段（scope=case）
 * - UpdateFields：按字段 scope 写 caseFields 或 subject.fields（ Observation 联动由 N2 扩展）
 * - CorrectObservation：人工确认值不被 AI 覆盖；supersedes 链保留（复用 evidence-service）
 * - SetEvidenceLink：绑定目标/共享范围校验（复用 evidence-service）
 * AI 工具不能直接调用这些命令的人工动作；actor 来源按命令传入（本地模式 local）。
 */

import type { Actor, CommandReceipt, EvidenceLink, FieldSpec, FieldValue, Observation, ReviewCaseV2, ReviewSubject, TemplateVersion } from '@profer/shared'
import { buildEvidenceLinks, recordObservation, transitionEvidenceLink } from './evidence-service'
import { getTemplate } from './template-store'
import { validatePolicyRef } from './policy-store'
import { CommandValidationError, createAggregate, payloadHash, readAggregate, submitCommand } from './case-store-v2'
import { assertSafeReviewStorageId } from './review-storage-id'
import type { CaseAggregateV2, ReviewCommandResult } from '@profer/shared'

// ===== CreateCaseFromTemplate =====

export interface CreateCasePayload {
  title: string
  fieldValues: Record<string, unknown>
  subjects: Array<{ id: string; title: string; type: 'item' | 'clause' | 'project' | 'budget-line' | 'custom'; sectionId?: string; fieldValues?: Record<string, unknown> }>
}

function fieldValueOf(spec: TemplateVersion['fields'][number], raw: unknown): FieldValue {
  switch (spec.kind) {
    case 'number': return { kind: 'number', value: Number(raw) }
    case 'date': return { kind: 'date', value: String(raw) }
    case 'boolean': return { kind: 'boolean', value: raw === true || raw === 'true' || raw === 1 }
    case 'enum': return { kind: 'enum', value: String(raw ?? '') }
    case 'multi': return { kind: 'multi', value: Array.isArray(raw) ? raw.map(String) : [String(raw ?? '')] }
    case 'object': return { kind: 'object', value: (raw && typeof raw === 'object' ? raw : {}) as Record<string, FieldValue> }
    case 'rows': return { kind: 'rows', value: Array.isArray(raw) ? raw as Array<Record<string, FieldValue>> : [] }
    case 'attachment': return { kind: 'attachment', documentVersionId: String(raw ?? '') }
    default: return { kind: 'text', value: String(raw ?? '') }
  }
}

/**
 * 批量物理分案（T06）等“先入库、后补录”的入口需要先建案：
 * - 仍拒绝未知字段、类型错误与不存在的分项（不能把错录入当合法）；
 * - 只允许暂缺“必填案卷字段/必需分项”，并由 submitCaseV2 在提交审核前统一阻断。
 * 缺省 false，普通建案保持原有的完整校验。
 */
export interface CreateCaseOptions {
  allowIncompleteIntake?: boolean
}

/**
 * 原始输入的类型门禁（RUN-38 返修）：
 * - 只对“确实不可转换”的形状拒绝（对象/数组塞进标量、非数字塞进数字等）；
 * - 允许历史契约中的标量规范化（数值字符串进 number、'true' 进 boolean、标量进 text/multi）；
 * - 选项/日期格式仍由既有校验继续检查，不用这里替代业务校验。
 */
export function rawFieldTypeIssue(spec: FieldSpec, value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const kind = typeof value
  switch (spec.kind) {
    case 'text':
      return ['string', 'number', 'boolean'].includes(kind) ? undefined : '必须是文本值，不能是对象或数组'
    case 'number': {
      const parsed = kind === 'number' ? value as number : kind === 'string' ? Number(value) : Number.NaN
      return Number.isFinite(parsed) ? undefined : '必须是有效数字'
    }
    case 'boolean':
      return (kind === 'boolean' || value === 'true' || value === 'false' || value === 1 || value === 0)
        ? undefined : '必须是布尔值'
    case 'date': {
      if (kind !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value as string)) return '必须是有效日期（YYYY-MM-DD）'
      return Number.isFinite(Date.parse(value as string)) ? undefined : '日期无法解析'
    }
    case 'enum':
      return ['string', 'number'].includes(kind) ? undefined : '必须是选项值'
    case 'multi':
      if (!Array.isArray(value) && kind !== 'string') return '必须是多选数组或单个选项'
      if (Array.isArray(value) && value.some((item) => typeof item !== 'string' && typeof item !== 'number')) {
        return '多选条目必须是文本或数字'
      }
      return undefined
    case 'object':
      return (kind === 'object' && !Array.isArray(value)) ? undefined : '必须是对象'
    case 'rows':
      return (Array.isArray(value) && value.every((item) => item && typeof item === 'object' && !Array.isArray(item)))
        ? undefined : '必须是行对象数组'
    case 'attachment':
      return kind === 'string' && (value as string).trim() ? undefined : '必须是附件版本号'
    default:
      return undefined
  }
}

function validateSectionSubjects(template: TemplateVersion, payload: CreateCasePayload, allowMissingRequiredSections = false): void {
  const sections = template.sections ?? []
  const sectionById = new Map(sections.map((section) => [section.id, section]))
  const counts = new Map(sections.map((section) => [section.id, 0]))
  const subjectIds = new Set<string>()

  for (const subject of payload.subjects) {
    if (!subject.id || subjectIds.has(subject.id)) throw new CommandValidationError('VALIDATION_FAILED', '申报事项 ID 缺失或重复')
    if (!subject.title.trim()) throw new CommandValidationError('VALIDATION_FAILED', '申报事项名称不能为空')
    subjectIds.add(subject.id)
    const section = subject.sectionId ? sectionById.get(subject.sectionId) : undefined
    if (sections.length > 0 && !section) throw new CommandValidationError('VALIDATION_FAILED', `事项「${subject.title}」未归入有效审核分项`)
    if (subject.sectionId && !section) throw new CommandValidationError('VALIDATION_FAILED', `事项「${subject.title}」归属的审核分项不存在`)
    if (section) counts.set(section.id, (counts.get(section.id) ?? 0) + 1)

    const values = subject.fieldValues ?? {}
    const allowedFields = template.fields.filter((field) =>
      (field.scope ?? 'subject') === 'subject' && (!field.sectionId || field.sectionId === subject.sectionId),
    )
    const allowedKeys = new Set(allowedFields.map((field) => field.key))
    for (const [key, value] of Object.entries(values)) {
      if (!allowedKeys.has(key)) throw new CommandValidationError('VALIDATION_FAILED', `${section ? `分项「${section.name}」` : '申报事项'}不接受字段 ${key}`)
      if (value === '' || value === null || value === undefined || (typeof value === 'string' && !value.trim())) continue
      const field = allowedFields.find((candidate) => candidate.key === key)!
      const typeIssue = rawFieldTypeIssue(field, value)
      if (typeIssue) throw new CommandValidationError('VALIDATION_FAILED', `${section?.name ? `${section.name}：` : ''}${field.label}${typeIssue}`)
      if (field.kind === 'number' && !Number.isFinite(typeof value === 'number' ? value : Number(value))) {
        throw new CommandValidationError('VALIDATION_FAILED', `${section?.name ? `${section.name}：` : ''}${field.label}必须是有效数字`)
      }
      if (field.kind === 'date' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value))) {
        throw new CommandValidationError('VALIDATION_FAILED', `${section?.name ? `${section.name}：` : ''}${field.label}必须是有效日期`)
      }
      if (field.kind === 'enum' && field.options?.length && !field.options.some((option) => option.value === String(value))) {
        throw new CommandValidationError('VALIDATION_FAILED', `${section?.name ? `${section.name}：` : ''}${field.label}不在可选范围内`)
      }
    }
    for (const field of allowedFields) {
      const value = values[field.key]
      if (field.required && (value === undefined || value === null || value === '' || (typeof value === 'string' && !value.trim()))) {
        throw new CommandValidationError('VALIDATION_FAILED', `${section ? `分项「${section.name}」` : '申报事项'}缺少必填字段：${field.label}`)
      }
    }
  }

  const missingSections = sections.filter((section) => section.required && (counts.get(section.id) ?? 0) === 0)
  if (!allowMissingRequiredSections && missingSections.length > 0) {
    throw new CommandValidationError('VALIDATION_FAILED', `案卷缺少必需分项：${missingSections.map((section) => section.name).join('、')}`)
  }
}

/** 从模板创建案卷：模板已发布 + 政策依赖校验 + 字段作用域分流（07 §3.2） */
export async function createCaseFromTemplate(
  templateId: string,
  version: number,
  payload: CreateCasePayload,
  actor: Actor,
  caseId: string,
  options: CreateCaseOptions = {},
): Promise<ReviewCommandResult<ReviewCaseV2>> {
  assertSafeReviewStorageId(caseId, 'caseId')
  const template = getTemplate(templateId, version)
  if (!template) throw new CommandValidationError('NOT_FOUND', `模板不存在: ${templateId}@${version}`)
  if (template.status !== 'published') throw new CommandValidationError('VALIDATION_FAILED', '只有已发布模板可创建真实案卷')
  for (const ref of template.policyRefs ?? []) {
    const check = validatePolicyRef(ref)
    if (!check.ok) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', check.reason ?? '政策依赖不完整')
  }
  const allowIncomplete = options.allowIncompleteIntake === true
  validateSectionSubjects(template, payload, allowIncomplete)
  const caseSpecs = template.fields.filter((field) => (field.scope ?? 'subject') === 'case')
  const caseFieldKeys = new Set(caseSpecs.map((field) => field.key))
  const unexpectedCaseKeys = Object.keys(payload.fieldValues).filter((key) => !caseFieldKeys.has(key))
  if (unexpectedCaseKeys.length > 0) throw new CommandValidationError('VALIDATION_FAILED', `案卷字段不在模板中：${unexpectedCaseKeys.join('、')}`)
  const caseValues = Object.fromEntries(Object.entries(payload.fieldValues).filter(([key]) => caseFieldKeys.has(key)))
  const caseFieldIssues = validateFieldValuesV2(template, 'case', caseValues, new Set(caseSpecs.map((field) => field.key)))
  if (caseFieldIssues.length > 0) throw new CommandValidationError('VALIDATION_FAILED', caseFieldIssues.map((issue) => `${issue.key}: ${issue.reason}`).join('；'))
  // 字段作用域：case 字段进 caseFields；subject 缺失值留给事项表单
  const caseFields: Record<string, FieldValue> = {}
  for (const spec of template.fields) {
    if ((spec.scope ?? 'subject') !== 'case') continue
    if (payload.fieldValues[spec.key] === undefined || payload.fieldValues[spec.key] === null || payload.fieldValues[spec.key] === '' || (typeof payload.fieldValues[spec.key] === 'string' && !(payload.fieldValues[spec.key] as string).trim())) {
      // 批量入库允许先建“待补”案卷；提交审核前由 submitCaseV2 统一阻断。
      if (spec.required && !allowIncomplete) throw new CommandValidationError('VALIDATION_FAILED', `缺少必填案卷字段: ${spec.label}（${spec.key}）`)
      continue
    }
    caseFields[spec.key] = fieldValueOf(spec, payload.fieldValues[spec.key])
  }
  const now = new Date().toISOString()
  const caseV2: ReviewCaseV2 = {
    id: caseId,
    templateId: template.templateId,
    templateVersion: template.version,
    title: payload.title,
    objectType: template.objectType,
    caseFields,
    subjects: payload.subjects.map((subject) => ({
      id: subject.id,
      type: subject.type,
      title: subject.title,
      ...(subject.sectionId ? { sectionId: subject.sectionId } : {}),
      fields: Object.fromEntries(
        template.fields
          .filter((spec) => (spec.scope ?? 'subject') === 'subject' && (!spec.sectionId || spec.sectionId === subject.sectionId) && subject.fieldValues?.[spec.key] !== undefined)
          .map((spec) => [spec.key, fieldValueOf(spec, subject.fieldValues![spec.key])]),
      ),
      sourceRefs: [],
      correction: 'user-confirmed',
      status: 'identified',
    })),
    documents: [],
    stage: 'draft',
    revision: 0,
    createdAt: now,
    updatedAt: now,
  }
  const receipt: CommandReceipt = { requestId: `create-${caseId}`, type: 'CreateCaseFromTemplate', payloadHash: payloadHash('CreateCaseFromTemplate', payload), revision: 0, at: now, summary: `案卷已创建（${template.name}）`, actor }
  await createAggregate(caseId, caseV2, receipt)
  const aggregate = readAggregate(caseId)!
  return { ok: true, receipt, aggregate, entity: aggregate.caseV2 }
}

// ===== G03：字段类型与作用域校验（模板 schema 驱动） =====

/**
 * 判断已落库的 FieldValue 是否仍是“空”。
 * 0 与 false 是有效业务值，不能按 truthiness 误判为缺失。
 */
export function isFieldValueEmpty(value: FieldValue | undefined): boolean {
  if (!value) return true
  switch (value.kind) {
    case 'text':
    case 'date':
    case 'enum': return !String(value.value ?? '').trim()
    case 'number': return typeof value.value !== 'number' || !Number.isFinite(value.value)
    case 'boolean': return typeof value.value !== 'boolean'
    case 'multi':
    case 'rows': return !Array.isArray(value.value) || value.value.length === 0
    case 'object': return !value.value || Object.keys(value.value).length === 0
    case 'attachment': return !value.documentVersionId
    default: return false
  }
}

/**
 * 案卷当前仍缺哪些“提交审核前必须补齐”的模板输入。
 *
 * 批量物理分案允许先建案再补录，但“已入库”不等于“可提交审核”。
 * 这里与建案校验共用同一模板定义，避免门禁各自解释必填性。
 */
export function collectMissingIntakeInputs(
  template: TemplateVersion,
  caseV2: Pick<ReviewCaseV2, 'caseFields' | 'subjects'>,
): string[] {
  const missing: string[] = []
  for (const field of template.fields) {
    if ((field.scope ?? 'subject') !== 'case' || !field.required) continue
    if (isFieldValueEmpty(caseV2.caseFields[field.key])) missing.push(`案卷字段「${field.label}」`)
  }
  const sections = template.sections ?? []
  for (const section of sections) {
    if (!section.required) continue
    if (!caseV2.subjects.some((subject) => subject.sectionId === section.id)) missing.push(`必需分项「${section.name}」`)
  }
  for (const subject of caseV2.subjects) {
    for (const field of template.fields) {
      if ((field.scope ?? 'subject') !== 'subject' || !field.required) continue
      if (field.sectionId && field.sectionId !== subject.sectionId) continue
      if (isFieldValueEmpty(subject.fields[field.key])) missing.push(`事项「${subject.title}」字段「${field.label}」`)
    }
  }
  return missing
}

export interface FieldValidationIssue {
  key: string
  reason: string
}

/**
 * 按模板 FieldSpec 校验输入值：
 * - 未知 key / 作用域不符拒绝（防止越权写 subject 字段进 case）
 * - number 须可解析为有限数、date 须 ISO 日期、enum 须在选项内
 * - required 缺失拒绝（仅对显式传入 undefined/空串判缺，未传键不触发）
 */
export function validateFieldValuesV2(
  template: TemplateVersion,
  scope: 'case' | 'subject',
  values: Record<string, unknown>,
  providedKeys: Set<string>,
): FieldValidationIssue[] {
  const issues: FieldValidationIssue[] = []
  const specs = template.fields.filter((spec) => (spec.scope ?? 'case') === scope)
  for (const [key, value] of Object.entries(values)) {
    const spec = specs.find((candidate) => candidate.key === key)
    if (!spec) {
      issues.push({ key, reason: (scope === 'case' ? '案卷' : '事项') + '字段不在模板中: ' + key })
      continue
    }
    if (value === undefined || value === null || value === '') {
      if (spec.required && providedKeys.has(key)) issues.push({ key, reason: '必填字段缺失' })
      continue
    }
    const typeIssue = rawFieldTypeIssue(spec, value)
    if (typeIssue) issues.push({ key, reason: typeIssue })
    if (spec.kind === 'number') {
      const parsed = typeof value === 'number' ? value : Number(value)
      if (!Number.isFinite(parsed)) issues.push({ key, reason: '数字字段值不是有限数' })
    } else if (spec.kind === 'date') {
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value)) issues.push({ key, reason: '日期字段须为 ISO 日期（YYYY-MM-DD）' })
    } else if (spec.kind === 'enum') {
      const options = spec.options ?? []
      if (options.length > 0 && !options.map((option) => option.value).includes(String(value))) issues.push({ key, reason: `枚举值不在选项内: ${String(value)}` })
    }
  }
  return issues
}

/** 将输入值规范化为 FieldValue（保持类型 kind 与数值精度） */
/**
 * 按 FieldSpec.kind 生成 FieldValue。
 *
 * 与建案时的 `fieldValueOf` 必须同源：此前这里只处理 number，
 * 日期/布尔/枚举/多选/附件在**更新**时全被降级成 text，
 * 造成同一字段建案时是 date、更新后变 text 的类型漂移。
 */
export function toFieldValueV2(spec: { kind: string }, value: unknown): FieldValue {
  return fieldValueOf({ kind: spec.kind } as TemplateVersion['fields'][number], value)
}

// ===== UpdateFields =====

export interface UpdateFieldsPayload {
  caseFieldValues?: Record<string, unknown>
  subjectFieldValues?: Array<{ subjectId: string; values: Record<string, unknown> }>
}

export function updateFields(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: UpdateFieldsPayload }, template?: TemplateVersion): Promise<ReviewCommandResult<undefined>> {
  return submitCommand<UpdateFieldsPayload, undefined>(caseId, { ...command, type: 'UpdateFields' }, (aggregate, payload) => {
    if (aggregate.caseV2.stage === 'archived') throw new CommandValidationError('INVALID_TRANSITION', '已归档案卷不可修改')
    if (template) {
      const caseIssues = validateFieldValuesV2(template, 'case', payload.caseFieldValues ?? {}, new Set(Object.keys(payload.caseFieldValues ?? {})))
      if (caseIssues.length > 0) throw new CommandValidationError('VALIDATION_FAILED', caseIssues.map((issue) => `${issue.key}: ${issue.reason}`).join('；'))
      for (const subjectUpdate of payload.subjectFieldValues ?? []) {
        const subjectIssues = validateFieldValuesV2(template, 'subject', subjectUpdate.values, new Set(Object.keys(subjectUpdate.values)))
        if (subjectIssues.length > 0) throw new CommandValidationError('VALIDATION_FAILED', subjectIssues.map((issue) => `${subjectUpdate.subjectId}.${issue.key}: ${issue.reason}`).join('；'))
      }
    }
    return {
      summary: `更新 ${Object.keys(payload.caseFieldValues ?? {}).length} 个案卷字段 / ${payload.subjectFieldValues?.length ?? 0} 个事项`,
      mutate: (draft) => {
        for (const [key, value] of Object.entries(payload.caseFieldValues ?? {})) {
          const spec = template?.fields.find((candidate) => candidate.key === key)
          draft.caseV2.caseFields[key] = toFieldValueV2(spec ?? { kind: 'text' }, value)
        }
        for (const subjectUpdate of payload.subjectFieldValues ?? []) {
          const subject = draft.caseV2.subjects.find((candidate) => candidate.id === subjectUpdate.subjectId)
          if (!subject) throw new CommandValidationError('NOT_FOUND', `事项不存在: ${subjectUpdate.subjectId}`)
          for (const [key, value] of Object.entries(subjectUpdate.values)) {
            const spec = template?.fields.find((candidate) => candidate.key === key)
            subject.fields[key] = toFieldValueV2(spec ?? { kind: 'text' }, value)
            subject.correction = 'user-confirmed'
          }
        }
      },
    }
  })
}

// ===== CorrectObservation =====

export interface CorrectObservationPayload {
  subjectId: string
  fieldKey: string
  value: FieldValue
  sourceRefs: Observation['sourceRefs']
  reason: string
}

/** 人工更正：confirmed=true，原值进 supersedes 链（A05/U02） */
export function correctObservation(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: CorrectObservationPayload },
): Promise<ReviewCommandResult<Observation>> {
  return submitCommand<CorrectObservationPayload, Observation>(caseId, { ...command, type: 'CorrectObservation' }, (aggregate, payload) => {
    if (!payload.reason.trim()) throw new CommandValidationError('VALIDATION_FAILED', '更正必须附理由（保留更正历史）')
    const currentVersions = new Set(aggregate.caseV2.documents.filter((document) => document.active !== false).map((document) => document.versionId))
    if (payload.sourceRefs.some((ref) => ref.caseId !== caseId || !currentVersions.has(ref.documentVersionId))) {
      throw new CommandValidationError('STALE_INPUT', '更正引用了不存在、跨案或已归档的材料版本')
    }
    if (aggregate.sourceValidityRevocations?.length && payload.sourceRefs.length === 0) {
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '材料换版后重新确认事实必须指向当前原件')
    }
    return {
      summary: `更正事实 ${payload.subjectId}.${payload.fieldKey}`,
      mutate: (draft) => {
        draft.observations = recordObservation(draft.observations, {
          subjectId: payload.subjectId,
          fieldKey: payload.fieldKey,
          value: payload.value,
          sourceRefs: payload.sourceRefs,
          extractedBy: 'user',
          confirmed: true,
        })
        return draft.observations[draft.observations.length - 1]!
      },
    }
  })
}

// ===== SetEvidenceLink =====

export interface SetEvidenceLinkPayload {
  documentVersionId: string
  subjectIds: string[]
  supportsFact: string
  linkedBy: 'ai' | 'user'
  /** Existing link transition for the single-case reviewer workspace. */
  evidenceLinkId?: string
  status?: 'confirmed' | 'rejected'
}

export function setEvidenceLink(caseId: string, command: { requestId: string; actor: Actor; expectedRevision: number; payload: SetEvidenceLinkPayload }): Promise<ReviewCommandResult<EvidenceLink[]>> {
  return submitCommand<SetEvidenceLinkPayload, EvidenceLink[]>(caseId, { ...command, type: 'SetEvidenceLink' }, (aggregate, payload) => {
    if (payload.evidenceLinkId) {
      if (!payload.status) throw new CommandValidationError('VALIDATION_FAILED', '证明关联状态缺失')
      const existingLink = aggregate.evidenceLinks.find((link) => link.id === payload.evidenceLinkId)
      if (!existingLink) throw new CommandValidationError('NOT_FOUND', '证明关联不存在')
      if (payload.status === 'confirmed' && !aggregate.caseV2.documents.some((document) =>
        document.versionId === existingLink.documentVersionId && document.active !== false)) {
        throw new CommandValidationError('STALE_INPUT', '已归档的证据不得重新确认为当前证据')
      }
      return {
        summary: `审核员${payload.status === 'confirmed' ? '确认' : '取消'}证明关联 ${payload.evidenceLinkId}`,
        mutate: (draft) => {
          draft.evidenceLinks = transitionEvidenceLink(draft.evidenceLinks, payload.evidenceLinkId!, payload.status!)
          return draft.evidenceLinks
        },
      }
    }
    if (!payload.supportsFact.trim()) throw new CommandValidationError('VALIDATION_FAILED', '绑定必须说明支持的事实')
    if (!aggregate.caseV2.documents.some((document) =>
      document.versionId === payload.documentVersionId && document.active !== false)) {
      throw new CommandValidationError('STALE_INPUT', '证据版本不存在或已归档')
    }
    if (!payload.subjectIds.length || payload.subjectIds.some((id) => !aggregate.caseV2.subjects.some((subject) => subject.id === id))) {
      throw new CommandValidationError('VALIDATION_FAILED', '证据关联目标不存在或为空')
    }
    return {
      summary: `绑定证据 ${payload.documentVersionId} → ${payload.subjectIds.length} 个事项`,
      mutate: (draft) => {
        const links = buildEvidenceLinks(draft.evidenceLinks, payload)
        draft.evidenceLinks = links
        return links
      },
    }
  })
}

/** 提交/开审前必须满足的材料槽（与 submitCaseV2 保持同一解释）。 */
export function collectMissingSubmissionSlots(
  template: TemplateVersion,
  documents: ReviewCaseV2['documents'],
): string[] {
  const missing: string[] = []
  for (const slot of template.materialSlots ?? []) {
    if ((slot.requiredAt ?? 'submission') !== 'submission') continue
    const active = documents.filter((document) => document.materialSlotId === slot.id && document.active !== false).length
    if (active < slot.minCount) missing.push(`${slot.name}（需 ${slot.minCount}，现有 ${active}）`)
  }
  return missing
}

// ===== UpsertCaseSubject（导入草稿补录必需分项） =====

/**
 * 普通用户补录/编辑申报事项的唯一写入口。
 *
 * 目的：T06 批量入库可以先建“待补”草案，但必须有产品内可到达的方式补齐
 * required section 与事项必填字段，随后同一案卷能正常 submit——不能要求用户
 * 手改 JSON，也不能只返回 warning。
 *
 * 约束：
 * - 仅 draft 阶段可补录（已提交案卷走阶段办理/补件，不在入库补录里绕过门禁）；
 * - 模板必须仍是已发布版本，字段类型/作用域/分项归属都以该版本为准；
 * - 更新既有事项时只覆盖显式提供的字段，其余字段保留并继续参与必填校验；
 * - 走 V2 CAS/回执事务，重复 requestId 幂等。
 */
export interface UpsertCaseSubjectPayload {
  subjectId?: string
  title: string
  type?: ReviewSubject['type']
  sectionId?: string
  fieldValues?: Record<string, unknown>
}

function isProvidedRaw(value: unknown): boolean {
  return !(value === undefined || value === null || value === '' || (typeof value === 'string' && !value.trim()))
}

export function upsertCaseSubject(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: UpsertCaseSubjectPayload },
  template?: TemplateVersion,
): Promise<ReviewCommandResult<ReviewSubject>> {
  return submitCommand<UpsertCaseSubjectPayload, ReviewSubject>(caseId, { ...command, type: 'UpsertCaseSubject' }, (aggregate, payload) => {
    if (aggregate.caseV2.stage === 'archived') throw new CommandValidationError('INVALID_TRANSITION', '已归档案卷不可修改')
    if (aggregate.caseV2.stage !== 'draft') {
      throw new CommandValidationError('INVALID_TRANSITION', '仅草案阶段可补录申报事项；已提交案卷请通过阶段办理或补件流程处理')
    }
    if (!template) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '案卷模板不可用，不能校验申报事项')
    if (template.status !== 'published') throw new CommandValidationError('INVALID_TRANSITION', '案卷绑定的模板版本尚未发布，不能写入申报事项')
    const sections = template.sections ?? []
    const section = payload.sectionId ? sections.find((item) => item.id === payload.sectionId) : undefined
    if (payload.sectionId && !section) throw new CommandValidationError('VALIDATION_FAILED', `审核分项不存在：${payload.sectionId}`)
    if (sections.length > 0 && !section) throw new CommandValidationError('VALIDATION_FAILED', '申报事项必须归入有效审核分项')
    if (!payload.title?.trim()) throw new CommandValidationError('VALIDATION_FAILED', '申报事项名称不能为空')
    const existing = payload.subjectId
      ? aggregate.caseV2.subjects.find((subject) => subject.id === payload.subjectId)
      : undefined
    if (payload.subjectId && !existing) throw new CommandValidationError('NOT_FOUND', `申报事项不存在：${payload.subjectId}`)
    const values = payload.fieldValues ?? {}
    const allowed = template.fields.filter((field) =>
      (field.scope ?? 'subject') === 'subject' && (!field.sectionId || field.sectionId === payload.sectionId))
    for (const [key, value] of Object.entries(values)) {
      const spec = allowed.find((field) => field.key === key)
      if (!spec) throw new CommandValidationError('VALIDATION_FAILED', `分项不接受字段 ${key}`)
      if (!isProvidedRaw(value)) continue
      const typeIssue = rawFieldTypeIssue(spec, value)
      if (typeIssue) throw new CommandValidationError('VALIDATION_FAILED', `${spec.label}${typeIssue}`)
      if (spec.kind === 'enum' && spec.options?.length &&
          !spec.options.some((option) => option.value === String(value))) {
        throw new CommandValidationError('VALIDATION_FAILED', `${spec.label}不在可选范围内`)
      }
    }
    for (const spec of allowed) {
      if (!spec.required) continue
      if (isProvidedRaw(values[spec.key])) continue
      if (existing && existing.fields[spec.key] && !isFieldValueEmpty(existing.fields[spec.key])) continue
      throw new CommandValidationError('VALIDATION_FAILED', `缺少必填字段：${spec.label}`)
    }
    return {
      summary: existing ? `更新申报事项 ${existing.title}` : `新增申报事项 ${payload.title.trim()}`,
      mutate: (draft) => {
        const changes: Record<string, FieldValue> = {}
        for (const [key, value] of Object.entries(values)) {
          if (!isProvidedRaw(value)) continue
          const spec = allowed.find((field) => field.key === key)!
          changes[key] = fieldValueOf(spec, value)
        }
        if (existing) {
          draft.caseV2.subjects = draft.caseV2.subjects.map((subject) => subject.id === existing.id
            ? {
                ...subject,
                title: payload.title.trim(),
                type: payload.type ?? subject.type,
                ...(payload.sectionId ? { sectionId: payload.sectionId } : {}),
                fields: { ...subject.fields, ...changes },
                correction: 'user-confirmed',
              }
            : subject)
          return draft.caseV2.subjects.find((subject) => subject.id === existing.id)!
        }
        const created: ReviewSubject = {
          id: payload.subjectId?.trim() || `subject-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          type: payload.type ?? 'item',
          title: payload.title.trim(),
          ...(payload.sectionId ? { sectionId: payload.sectionId } : {}),
          fields: changes,
          sourceRefs: [],
          correction: 'user-confirmed',
          status: 'identified',
        }
        draft.caseV2.subjects = [...draft.caseV2.subjects, created]
        return created
      },
    }
  })
}

// ===== 查询 =====

export function getCaseV2Aggregate(caseId: string): CaseAggregateV2 | undefined {
  return readAggregate(caseId)
}
