/**
 * Dev-C C1: native-first Case creation and READ-ONLY V1 workbench projection.
 * state.v2.json is the sole authority; no case.json or case.v2.json is created.
 * A displayed legacy shape is NEVER a second writer or a published Plan.
 */
import { createHash, randomUUID } from 'node:crypto'
import type {
  Actor, CaseAggregateV2, DocumentVersion, ReviewCase, ReviewCaseType,
  ReviewCaseV2, SourceDocument, UpdateCaseSettingsRequest, UpdateReviewItemRequest, ReviewItem, CreateNativeReviewItemV3Request,
} from '@profer/shared'
import { createAggregate, payloadHash, readAggregate, submitCommand, CommandValidationError } from './case-store-v2'
import { mapDomainToTemplate } from './migration'
import { ensureBuiltinTemplateDrafts } from './builtin-templates'
import { getTemplate, saveDraft } from './template-store'
import { registerMaterial } from './material-service'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'
import { isKnownDomainPack, resolveDomainPack } from '@profer/shared'

export const NATIVE_CREATE_RECEIPT_V3 = 'CreateNativeWorkspaceCaseV3'
const PENDING_TEMPLATE = 'pending-template-v3'
const MAIN_ACTOR: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const TYPES: ReadonlySet<string> = new Set(['综合测评', '活动申请', '自定义审核'])
const txt = (value: string) => ({ kind: 'text' as const, value })
const value = (input: ReviewCaseV2, key: string): string | undefined => {
  const field = input.caseFields[key]
  return field?.kind === 'text' ? field.value : undefined
}

export type NativeCreateWorkspaceInputV3 = {
  title: string
  type: ReviewCaseType
  applicant: string
  /**
   * 适用学年。
   *
   * 通用 V3 草稿案卷（非综测等按学年组织评审的业务）不强制提供；
   * 需要学年的领域仍必须给出，由 requireAcademicYearForDomain 统一判定。
   * 缺省时不会自动编造学年。
   */
  academicYear?: string
  domainPackId?: string
  reviewTemplate?: { templateId: string; version: number } | null
}

/**
 * 哪些领域包的业务本身按学年组织评审。
 *
 * 综测细则逐学年发布，学年是业务主键的一部分；通用技术预审（D4/D2 候选、
 * 自定义模板草稿）与学年无关，不应被迫填写。
 */
const ACADEMIC_YEAR_DOMAINS: ReadonlySet<string> = new Set(['comprehensive-assessment'])

/** 该领域是否必须提供学年（缺省领域包视为不强制）。 */
export function domainRequiresAcademicYear(domain: string | undefined): boolean {
  return domain !== undefined && ACADEMIC_YEAR_DOMAINS.has(domain)
}

export function isNativeWorkspaceCaseV3(aggregate: CaseAggregateV2 | undefined): boolean {
  const state = aggregate?.caseV2
  if (!state || !Array.isArray(aggregate?.receiptLog) ||
      aggregate.receiptLog[0]?.type !== NATIVE_CREATE_RECEIPT_V3 ||
      aggregate.receiptLog[0]?.revision !== 0 ||
      typeof state.id !== 'string' || !state.id ||
      typeof state.title !== 'string' || !Array.isArray(state.documents) ||
      !Array.isArray(state.subjects) || !state.caseFields ||
      typeof state.caseFields !== 'object' || Array.isArray(state.caseFields)) return false
  if (!state.documents.every(document => document && typeof document.documentId === 'string' &&
      typeof document.versionId === 'string' && typeof document.fileName === 'string' &&
      ['rule', 'application', 'evidence', 'attachment'].includes(document.role) &&
      Array.isArray(document.blocks) && document.blocks.every(block =>
        block && typeof block.blockId === 'string' && typeof block.text === 'string'))) return false
  if (!state.subjects.every(subject => subject && typeof subject.id === 'string' &&
      typeof subject.title === 'string' && subject.fields &&
      typeof subject.fields === 'object' && !Array.isArray(subject.fields) &&
      Array.isArray(subject.sourceRefs) &&
      subject.sourceRefs.every(ref => ref && typeof ref.caseId === 'string' &&
        typeof ref.documentVersionId === 'string' && Number.isSafeInteger(ref.parseRevision) &&
        ref.location && typeof ref.location.kind === 'string'))) return false
  const draft = state.nativeWorkspaceDraft
  if (!draft) return true
  return !!draft && typeof draft === 'object' && !Array.isArray(draft) &&
    Array.isArray(draft.manualRules) &&
    draft.manualRules.every(rule => rule && typeof rule.id === 'string' &&
      typeof rule.title === 'string' && typeof rule.requirement === 'string') &&
    (draft.subjectDocumentVersionIds === undefined ||
      (Array.isArray(draft.subjectDocumentVersionIds) &&
        draft.subjectDocumentVersionIds.every(id => typeof id === 'string')))
}

export function nativeWorkspaceProjectionV3(aggregate: CaseAggregateV2 | undefined): ReviewCase | undefined {
  if (!isNativeWorkspaceCaseV3(aggregate) || !aggregate) return undefined
  const state = aggregate.caseV2
  if (state.stage === 'archived' || !Number.isSafeInteger(state.revision) ||
      typeof state.title !== 'string' || !Array.isArray(state.documents) ||
      !Array.isArray(state.subjects)) return undefined
  const type = value(state, 'legacyReviewType')
  const applicant = value(state, 'applicant')
  // 学年对通用 V3 草稿案卷可为空：投影降级为空串，而不是让整份旧兼容投影失效。
  const academicYear = value(state, 'academicYear') ?? ''
  const domainPackId = value(state, 'legacyDomainPackId')
  if (!type || !TYPES.has(type) || applicant === undefined ||
      !domainPackId || !state.id) return undefined
  // V1's three columns have no 'attachment' role. Never mislabel a native
  // attachment as verified evidence; it remains visible in the V2 ledger.
  const current = state.documents.filter(document => document.active !== false && document.role !== 'attachment')
  const archived = state.documents.filter(document => document.active === false && document.role !== 'attachment')
  const asDocument = (doc: DocumentVersion): SourceDocument => ({
    id: doc.documentId,
    fileName: doc.fileName,
    role: doc.role as SourceDocument['role'],
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes,
    parseStatus: doc.parseStatus === 'pending' ? 'partial' : doc.parseStatus,
    ...(doc.parseError ? { parseError: doc.parseError } : {}),
    blocks: doc.blocks.map(block => ({
      id: block.blockId,
      text: block.text,
      kind: block.kind === 'image' ? 'image' : block.kind === 'table' ? 'table-cell'
        : block.format === 'heading' ? 'heading' : block.format === 'list-item' ? 'list-item' : 'paragraph',
      page: block.location?.kind === 'pdf-rect' ? block.location.page : 1,
      ...(block.table ? { table: block.table } : {}),
      ...(block.imageAlt ? { imageAlt: block.imageAlt } : {}),
      ...(block.imageAssetPath ? { imageAssetPath: block.imageAssetPath } : {}),
    })),
    origin: 'upload',
    // DocumentVersion has no creation timestamp; use the durable material
    // receipt where available instead of inventing a per-block provenance.
    importedAt: aggregate.receiptLog.find(receipt =>
      receipt.type === 'RegisterMaterial' && receipt.summary.includes(doc.versionId))?.at ?? state.createdAt,
  })
  const documents = current.map(asDocument)
  const items: ReviewItem[] = state.subjects.flatMap(subject => {
    // A V1 item is only representable when a real V2 source, exact version
    // and an explicit numeric score/category exist. Never fabricate an anchor
    // or reinterpret unknown value as zero points.
    const score = subject.fields.declaredScore
    const category = subject.fields.category
    if (subject.type !== 'item' || score?.kind !== 'number' ||
        category?.kind !== 'text' || !category.value.trim()) return []
    const source = subject.sourceRefs.find(ref => ref.caseId === state.id &&
      current.some(doc => doc.versionId === ref.documentVersionId && doc.parseRevision === ref.parseRevision))
    if (!source) return []
    const doc = current.find(item => item.versionId === source.documentVersionId)!
    // An exact parser block ID is already verified by C Main when a human
    // item is created. Preserve it even if the parser cannot provide page/
    // paragraph geometry (SourceRef remains explicitly file-level).
    const pinned = subject.fields.nativeSourceBlockId
    const pinnedBlockId = pinned?.kind === 'text' ? pinned.value : undefined
    // TS cannot preserve narrowing of a mutable SourceRef union through
    // the .find() callback; capture the verified paragraph locator once.
    const paragraphIndex = source.location.kind === 'paragraph'
      ? source.location.index : undefined
    const block = pinnedBlockId
      ? doc.blocks.find(entry => entry.blockId === pinnedBlockId)
      : paragraphIndex !== undefined
        ? doc.blocks.find(entry => entry.location?.kind === 'paragraph' &&
          entry.location.index === paragraphIndex)
        : undefined
    const anchor: ReviewItem['anchor'] = {
      documentId: doc.documentId,
      ...(block ? { blockId: block.blockId } : {}),
      ...(source.location.kind === 'pdf-rect' ? { page: source.location.page } : {}),
      precision: block ? 'block' : source.location.kind === 'pdf-rect' ? 'page' : 'document',
    }
    const str = (key: string): string | undefined => {
      const field = subject.fields[key]
      return field?.kind === 'text' || field?.kind === 'date' ? field.value : undefined
    }
    return [{
      id: subject.id, title: subject.title, category: category.value,
      declaredScore: score.value, ...(str('level') ? { level: str('level') } : {}),
      ...(str('activityDate') ? { activityDate: str('activityDate') } : {}),
      ...(str('organizer') ? { organizer: str('organizer') } : {}),
      anchor, evidenceDocumentIds: [], status: subject.status,
      identifiedBy: subject.correction === 'user-confirmed' ? 'manual' : 'ai',
    } satisfies ReviewItem]
  })
  // Version-pinned selection prevents an old documentId from automatically
  // selecting its new, as-yet-unreviewed physical bytes.
  const savedSelection = state.nativeWorkspaceDraft?.subjectDocumentVersionIds
  const subjectDocumentIds = savedSelection?.flatMap(versionId => {
    const document = current.find(doc => doc.versionId === versionId && doc.role === 'application')
    return document ? [document.documentId] : []
  })
  const rulePacks = current.filter(doc => doc.role === 'rule').map(doc => ({
    id: `native-pack-${doc.versionId}`,
    documentId: doc.documentId,
    name: doc.fileName.replace(/\.[^.]+$/, ''),
    publisher: '',
    academicYear,
    version: doc.versionId,
    outline: [],
    confirmed: false,
  }))
  const hasBoundTemplate = state.templateId !== PENDING_TEMPLATE && state.templateVersion > 0
  return {
    id: state.id, title: state.title, type: type as ReviewCaseType, applicant, academicYear,
    createdAt: state.createdAt, updatedAt: state.updatedAt,
    documents, archivedDocuments: archived.map(asDocument), rulePacks,
    items, evidences: current.filter(doc => doc.role === 'evidence').map(doc => ({
      documentId: doc.documentId, recognizedFacts: '', parseStatus: 'unrecognized' as const,
      linkedItemIds: [],
    })), isDemo: false,
    domainPackId: domainPackId as ReviewCase['domainPackId'],
    ...(hasBoundTemplate ? { reviewTemplate: { templateId: state.templateId, version: state.templateVersion } } : {}),
    ...(state.nativeWorkspaceDraft?.manualRules ? { manualRules: state.nativeWorkspaceDraft.manualRules.map(rule => ({ ...rule })) } : {}),
    ...(savedSelection !== undefined ? { subjectDocumentIds } : {}),
    revision: state.revision,
  }
}

function resolvedTemplate(domain: string, explicit?: { templateId: string; version: number }) {
  ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
  if (explicit) {
    if (!explicit.templateId || !Number.isSafeInteger(explicit.version) || explicit.version < 1)
      throw new CommandValidationError('VALIDATION_FAILED', '审核模板版本非法')
    const selected = getTemplate(explicit.templateId, explicit.version)
    if (!selected || selected.status !== 'published')
      throw new CommandValidationError('VALIDATION_FAILED', '只能选择已发布模板；候选与草稿不能作为正式绑定')
    return selected
  }
  const mapped = mapDomainToTemplate(domain).templateId
  // Custom/unmapped domains remain genuinely unbound, not silently assigned
  // the comprehensive-assessment policy. No official Plan is installed.
  const selected = mapped ? getTemplate(mapped) : undefined
  // A template draft/reference candidate is NOT an installed published Plan.
  return selected?.status === 'published' ? selected : undefined
}

/** Main generates its own identity; V2 CAS+creation receipt commits first. */
export async function createNativeWorkspaceCaseV3(input: NativeCreateWorkspaceInputV3, actor: Actor = MAIN_ACTOR, authorizeAtCommit?: () => void):
  Promise<{ aggregate: CaseAggregateV2; view: ReviewCase }> {
  if (!input || typeof input !== 'object' || !TYPES.has(input.type) ||
      typeof input.title !== 'string' || input.title.length === 0 ||
      typeof input.applicant !== 'string' || !input.applicant.trim() ||
      (input.academicYear !== undefined && typeof input.academicYear !== 'string') ||
      (input.domainPackId !== undefined && typeof input.domainPackId !== 'string')) {
    throw new CommandValidationError('VALIDATION_FAILED', '新建案卷缺少标题、类型或申请人')
  }
  if (actor.actorSource !== 'local' || actor.role !== 'reviewer')
    throw new CommandValidationError('VALIDATION_FAILED', '只有受信本地审核人可建案')
  if (!isKnownDomainPack(input.domainPackId))
    throw new CommandValidationError('VALIDATION_FAILED', '未知审核领域不能静默回退综测并创建正式业务案卷')
  const domain = resolveDomainPack(input.domainPackId).id
  const academicYear = input.academicYear?.trim() ?? ''
  // 综测等按学年组织评审的业务仍必须提供学年；通用技术预审不强制，也不编造。
  if (domainRequiresAcademicYear(domain) && !academicYear) {
    throw new CommandValidationError('VALIDATION_FAILED', '该审核领域按学年组织评审，必须填写适用学年')
  }
  const template = input.reviewTemplate === null ? undefined : resolvedTemplate(domain, input.reviewTemplate)
  const caseId = `case-${randomUUID().replace(/-/g, '')}`
  const now = new Date().toISOString()
  const state: ReviewCaseV2 = {
    id: caseId, templateId: template?.templateId ?? PENDING_TEMPLATE,
    templateVersion: template?.version ?? 0,
    title: input.title.trim() || '未命名案卷', objectType: template?.objectType ?? 'document',
    caseFields: {
      applicant: txt(input.applicant.trim()),
      ...(academicYear ? { academicYear: txt(academicYear) } : {}),
      legacyReviewType: txt(input.type), legacyDomainPackId: txt(domain),
    },
    subjects: [], documents: [], stage: 'draft', revision: 0, createdAt: now, updatedAt: now,
  }
  const receipt = {
    requestId: `native-create-${caseId}`, type: NATIVE_CREATE_RECEIPT_V3,
    payloadHash: payloadHash(NATIVE_CREATE_RECEIPT_V3, {
      title: state.title, type: input.type, applicant: input.applicant.trim(),
      academicYear, domainPackId: domain,
      templateId: state.templateId, templateVersion: state.templateVersion,
    }), revision: 0, at: now, summary: 'Main 原生建案，未发布任何校方政策或正式 Plan', actor,
  }
  await createAggregate(caseId, state, receipt, authorizeAtCommit)
  const aggregate = readAggregate(caseId)!
  const view = nativeWorkspaceProjectionV3(aggregate)
  if (!view) throw new Error('原生案卷已建立但兼容视图未能生成；请从 V2 列表恢复')
  return { aggregate, view }
}

/** No V1 updateCase/saveCase; native settings share the existing durable ledger. */
export async function updateNativeWorkspaceSettingsV3(
  caseId: string, input: UpdateCaseSettingsRequest, actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
): Promise<ReviewCase> {
  const original = readAggregate(caseId)
  if (!isNativeWorkspaceCaseV3(original) || !original)
    throw new CommandValidationError('NOT_FOUND', '案卷不是原生工作台案卷')
  if (original.canonicalPlan || original.d2RuntimePlan)
    throw new CommandValidationError('INVALID_TRANSITION', '正式 Plan 已绑定；仅允许显式升版与确认')
  const inputRules = input.manualRules
  let checkedRules: NonNullable<ReviewCaseV2['nativeWorkspaceDraft']>['manualRules'] | undefined
  if (inputRules !== undefined) {
    if (!Array.isArray(inputRules) || inputRules.length > 100)
      throw new CommandValidationError('VALIDATION_FAILED', '手写规则必须是 100 条以内的列表')
    const ids = new Set<string>()
    checkedRules = inputRules.map((rule, index) => {
      if (!rule || typeof rule !== 'object' || typeof rule.id !== 'string' ||
          !/^[a-zA-Z0-9_-]{1,100}$/.test(rule.id) || ids.has(rule.id) ||
          typeof rule.title !== 'string' || !rule.title.trim() || rule.title.length > 160 ||
          typeof rule.requirement !== 'string' || !rule.requirement.trim() || rule.requirement.length > 8000)
        throw new CommandValidationError('VALIDATION_FAILED', `第 ${index + 1} 条手写规则无效`)
      ids.add(rule.id)
      return { id: rule.id, title: rule.title.trim(), requirement: rule.requirement.trim() }
    })
  }
  let selectedVersions: string[] | undefined
  if (input.subjectDocumentIds !== undefined) {
    if (!Array.isArray(input.subjectDocumentIds) ||
        input.subjectDocumentIds.some(id => typeof id !== 'string' || !id) ||
        new Set(input.subjectDocumentIds).size !== input.subjectDocumentIds.length)
      throw new CommandValidationError('VALIDATION_FAILED', '待审主体文档列表无效或重复')
    // Map the legacy document ID into its current exact physical V2 version.
    // This is a draft scope, NOT a CanonicalPlan source authorization.
    selectedVersions = input.subjectDocumentIds.map(documentId => {
      const document = original.caseV2.documents.find(doc =>
        doc.documentId === documentId && doc.role === 'application' && doc.active !== false)
      if (!document) throw new CommandValidationError('STALE_INPUT', '待审主体材料不存在、已换版或角色不合法')
      return document.versionId
    })
  }
  if (input.title !== undefined && (typeof input.title !== 'string' || !input.title.trim()))
    throw new CommandValidationError('VALIDATION_FAILED', '标题不能为空')
  if (input.type !== undefined && !TYPES.has(input.type))
    throw new CommandValidationError('VALIDATION_FAILED', '案卷类型非法')
  if (input.domainPackId !== undefined && typeof input.domainPackId !== 'string')
    throw new CommandValidationError('VALIDATION_FAILED', '审核领域非法')
  if (!isKnownDomainPack(input.domainPackId))
    throw new CommandValidationError('VALIDATION_FAILED', '未知审核领域不能静默回退综测')
  const domain = resolveDomainPack(input.domainPackId ?? value(original.caseV2, 'legacyDomainPackId')).id
  // 切到按学年组织评审的领域时，案卷必须已有学年；否则会留下不自洽的案卷
  // （通用草稿可以没有学年，综测案卷不行）。不自动编造，交由调用方补填。
  if (domainRequiresAcademicYear(domain) && !value(original.caseV2, 'academicYear')) {
    throw new CommandValidationError('VALIDATION_FAILED',
      '该审核领域按学年组织评审，请先为案卷填写适用学年后再切换领域')
  }
  const template = input.reviewTemplate === undefined && input.domainPackId === undefined
    ? undefined : resolvedTemplate(domain, input.reviewTemplate ?? undefined)
  const output = await submitCommand(caseId, {
    type: 'UpdateNativeWorkspaceSettingsV3',
    requestId: `native-settings-${randomUUID().replace(/-/g, '')}`,
    expectedRevision: original.caseV2.revision,
    actor, payload: {
      title: input.title, type: input.type, domainPackId: domain,
      manualRules: checkedRules ?? null, subjectDocumentVersionIds: selectedVersions ?? null,
      templateChange: input.reviewTemplate !== undefined || input.domainPackId !== undefined,
      templateId: template?.templateId ?? PENDING_TEMPLATE, templateVersion: template?.version ?? 0,
      objectType: template?.objectType ?? 'document',
    },
  }, snapshot => {
    authorizeAtCommit?.()
    if (!isNativeWorkspaceCaseV3(snapshot)) throw new CommandValidationError('INVALID_TRANSITION', '案卷权威已改变')
    if (snapshot.canonicalPlan || snapshot.d2RuntimePlan)
      throw new CommandValidationError('INVALID_TRANSITION', '审核计划已冻结')
    if (snapshot.caseV2.stage !== 'draft')
      throw new CommandValidationError('INVALID_TRANSITION', '只有草稿阶段可修改本地工作台规则及材料范围')
    if ((checkedRules !== undefined || selectedVersions !== undefined) &&
        (snapshot.observations.some(item => item.confirmed) ||
          snapshot.evidenceLinks.some(item => item.status === 'confirmed')))
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '存在已确认事实或证据，请先完成显式撤销与重新审核')
    if (selectedVersions && selectedVersions.some(versionId =>
      !snapshot.caseV2.documents.some(doc => doc.versionId === versionId &&
        doc.role === 'application' && doc.active !== false)))
      throw new CommandValidationError('STALE_INPUT', '材料在提交前已换版或归档，请重新选择')
    return { summary: '修改原生案卷草稿设置（不产生校方政策与正式 Plan）', mutate: draft => {
      if (input.title !== undefined) draft.caseV2.title = input.title.trim()
      if (input.type !== undefined) draft.caseV2.caseFields.legacyReviewType = txt(input.type)
      if (input.domainPackId !== undefined) draft.caseV2.caseFields.legacyDomainPackId = txt(domain)
      if (checkedRules !== undefined || selectedVersions !== undefined) {
        const old = draft.caseV2.nativeWorkspaceDraft
        draft.caseV2.nativeWorkspaceDraft = {
          manualRules: checkedRules ?? old?.manualRules ?? [],
          ...(selectedVersions !== undefined
            ? { subjectDocumentVersionIds: [...selectedVersions] }
            : old?.subjectDocumentVersionIds !== undefined
              ? { subjectDocumentVersionIds: [...old.subjectDocumentVersionIds] } : {}),
        }
      }
      if (input.reviewTemplate !== undefined || input.domainPackId !== undefined) {
        draft.caseV2.templateId = template?.templateId ?? PENDING_TEMPLATE
        draft.caseV2.templateVersion = template?.version ?? 0
        draft.caseV2.objectType = template?.objectType ?? 'document'
      }
    } }
  })
  if (!output.ok) throw new CommandValidationError(output.code, output.message)
  const projected = nativeWorkspaceProjectionV3(output.aggregate)
  if (!projected) throw new Error('原生设置已保存但兼容读取失败')
  return projected
}

export interface NativeMaterialRegistrationOptions {
  /**
   * 用户可见的原文件名。批量入库/离线回件先用临时文件中转，
   * 若不显式传入，材料身份会被临时文件名（UUID 前缀）污染。
   */
  fileName?: string
  /** 显式替换目标（按版本号验证），与 V2 拖拽登记保持同一契约。 */
  replacesVersionIds?: string[]
}

/** Native material intake uses the existing C-owned physical-byte V2 service. */
export async function registerNativeWorkspaceMaterialV3(
  caseId: string, sourcePath: string, role: SourceDocument['role'], actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
  /**
   * 可选材料槽绑定。
   *
   * 模板可用 materialSlots 约束「提交前必须有哪些材料」，但原生案卷此前
   * 完全没有把槽位透传下去——结果任何带必需槽的模板永远无法提交
   * （提交时按槽位核对 active 材料数，槽位恒为 0）。这里补上透传。
   */
  materialSlotId?: string,
  options: NativeMaterialRegistrationOptions = {},
): Promise<SourceDocument> {
  const current = readAggregate(caseId)
  if (!isNativeWorkspaceCaseV3(current) || !current || current.caseV2.stage === 'archived')
    throw new CommandValidationError('INVALID_TRANSITION', '案卷不存在、已归档或不是原生 V2 案卷')
  authorizeAtCommit?.()
  const result = await registerMaterial(caseId, {
    requestId: `native-register-${randomUUID().replace(/-/g, '')}`,
    actor, expectedRevision: current.caseV2.revision,
    payload: {
      sourcePath, role,
      ...(materialSlotId ? { materialSlotId } : {}),
      ...(options.fileName ? { fileName: options.fileName } : {}),
      ...(options.replacesVersionIds?.length ? { replacesVersionIds: options.replacesVersionIds } : {}),
    },
  }, authorizeAtCommit)
  if (!result.ok) throw new CommandValidationError(result.code, result.message)
  const doc = result.entity
  const view = nativeWorkspaceProjectionV3(result.aggregate)
  const found = view?.documents.find(candidate => candidate.id === doc?.documentId)
  if (!found) throw new Error('原生材料已写入但只读兼容投影失败，请通过 V2 材料列表查看')
  return found
}

export async function removeNativeWorkspaceDocumentsV3(
  caseId: string, role: SourceDocument['role'], documentIds?: string[], actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
): Promise<ReviewCase> {
  if (documentIds !== undefined && (!Array.isArray(documentIds) ||
      documentIds.some(id => typeof id !== 'string' || !id) ||
      new Set(documentIds).size !== documentIds.length))
    throw new CommandValidationError('VALIDATION_FAILED', '移除材料 ID 非法或重复')
  const original = readAggregate(caseId)
  if (!isNativeWorkspaceCaseV3(original) || !original)
    throw new CommandValidationError('NOT_FOUND', '原生案卷不存在')
  const result = await submitCommand(caseId, {
    requestId: `native-remove-${randomUUID().replace(/-/g, '')}`,
    expectedRevision: original.caseV2.revision, actor,
    type: 'ArchiveNativeWorkspaceDocumentsV3',
    payload: { role, documentIds: documentIds ?? null },
  }, (snapshot, payload) => {
    authorizeAtCommit?.()
    if (!isNativeWorkspaceCaseV3(snapshot))
      throw new CommandValidationError('INVALID_TRANSITION', '原生案卷权威已经变化')
    const applicable = snapshot.caseV2.documents.filter(d => d.active !== false && d.role === role &&
      (payload.documentIds === null || payload.documentIds.includes(d.documentId)))
    if (applicable.length === 0 || (payload.documentIds !== null &&
        applicable.length !== payload.documentIds.length))
      throw new CommandValidationError('VALIDATION_FAILED', '材料不存在、版本已失效或角色不匹配')
    const retiring = new Set(applicable.map(d => d.versionId))
    return { summary: '原生材料批量归档：保留物理原件及所有历史来源', mutate: draft => {
      draft.caseV2.documents = draft.caseV2.documents.map(d =>
        retiring.has(d.versionId) ? { ...d, active: false, usage: 'unread' as const } : d)
      revokeCurrentSourceValidity(draft, retiring, 'archive')
    } }
  })
  if (!result.ok) throw new CommandValidationError(result.code, result.message)
  const view = nativeWorkspaceProjectionV3(result.aggregate)
  if (!view) throw new Error('归档已写入，兼容视图未能恢复')
  return view
}

export async function reorderNativeWorkspaceDocumentsV3(
  caseId: string, role: SourceDocument['role'], documentIds: string[], actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
): Promise<ReviewCase> {
  if (!Array.isArray(documentIds) || documentIds.some(id => typeof id !== 'string' || !id) ||
      new Set(documentIds).size !== documentIds.length)
    throw new CommandValidationError('VALIDATION_FAILED', '材料顺序无效或存在重复')
  const original = readAggregate(caseId)
  if (!isNativeWorkspaceCaseV3(original) || !original)
    throw new CommandValidationError('NOT_FOUND', '原生案卷不存在')
  const outcome = await submitCommand(caseId, {
    requestId: `native-reorder-${randomUUID().replace(/-/g, '')}`,
    expectedRevision: original.caseV2.revision, actor,
    type: 'ReorderNativeWorkspaceDocumentsV3', payload: { role, documentIds },
  }, (snapshot, payload) => {
    authorizeAtCommit?.()
    const active = snapshot.caseV2.documents.filter(d => d.active !== false && d.role === role)
    if (active.length !== payload.documentIds.length ||
        active.some(d => !payload.documentIds.includes(d.documentId)))
      throw new CommandValidationError('VALIDATION_FAILED', '顺序必须覆盖当前角色的所有有效材料')
    const byId = new Map(active.map(d => [d.documentId, d]))
    const desired = payload.documentIds.map(id => byId.get(id)!)
    return { summary: '调整原生材料显示次序，不更改任何物理身份', mutate: draft => {
      let i = 0
      draft.caseV2.documents = draft.caseV2.documents.map(d =>
        d.active !== false && d.role === role ? desired[i++]! : d)
    } }
  })
  if (!outcome.ok) throw new CommandValidationError(outcome.code, outcome.message)
  const view = nativeWorkspaceProjectionV3(outcome.aggregate)
  if (!view) throw new Error('材料顺序已写入，兼容投影失败')
  return view
}

/** Edit an EXISTING anchored native subject; never invent source provenance. */
export async function updateNativeWorkspaceReviewItemV3(
  caseId: string, input: UpdateReviewItemRequest, actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
): Promise<ReviewCase> {
  if (!input || input.caseId !== caseId ||
      typeof input.itemId !== 'string' || !input.itemId ||
      typeof input.title !== 'string' || !input.title.trim() || input.title.length > 160 ||
      typeof input.category !== 'string' || !input.category.trim() || input.category.length > 80 ||
      typeof input.declaredScore !== 'number' || !Number.isFinite(input.declaredScore) ||
      input.declaredScore < 0 || input.declaredScore > 1_000_000)
    throw new CommandValidationError('VALIDATION_FAILED', '审核事项字段或案卷 ID 无效')
  for (const [key, val, limit] of [
    ['level', input.level, 100], ['activityDate', input.activityDate, 80],
    ['organizer', input.organizer, 200],
  ] as const) {
    if (val !== undefined && (typeof val !== 'string' || val.length > limit))
      throw new CommandValidationError('VALIDATION_FAILED', `申报事项 ${key} 字段不合法`)
  }
  const existing = readAggregate(caseId)
  if (!isNativeWorkspaceCaseV3(existing) || !existing)
    throw new CommandValidationError('NOT_FOUND', '原生工作台案卷不存在')
  const output = await submitCommand(caseId, {
    type: 'CorrectNativeWorkspaceReviewItemV3',
    requestId: `native-item-${randomUUID().replace(/-/g, '')}`,
    expectedRevision: existing.caseV2.revision, actor,
    payload: {
      itemId: input.itemId, title: input.title.trim(), category: input.category.trim(),
      declaredScore: input.declaredScore, level: input.level?.trim() || null,
      activityDate: input.activityDate?.trim() || null,
      organizer: input.organizer?.trim() || null,
    },
  }, (snapshot, payload) => {
    authorizeAtCommit?.()
    if (!isNativeWorkspaceCaseV3(snapshot) || snapshot.canonicalPlan || snapshot.d2RuntimePlan ||
        snapshot.caseV2.stage !== 'draft')
      throw new CommandValidationError('INVALID_TRANSITION', '正式计划已冻结或案卷不在可编辑草稿阶段')
    if (snapshot.observations.some(entry => entry.subjectId === payload.itemId && entry.confirmed))
      throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '该事项有已确认事实，需要显式撤销后再修正')
    const candidate = snapshot.caseV2.subjects.find(item => item.id === payload.itemId)
    if (!candidate || candidate.type !== 'item')
      throw new CommandValidationError('NOT_FOUND', '原生申报事项不存在')
    const projected = nativeWorkspaceProjectionV3(snapshot)
    if (!projected?.items.some(item => item.id === payload.itemId))
      throw new CommandValidationError('STALE_INPUT', '申报事项未绑定当前可追溯原件，不能凭空修正')
    return { summary: `用户修正原生事项 ${payload.itemId}，无任何校方审批或 AI 事实确认`,
      mutate: draft => {
        const item = draft.caseV2.subjects.find(subject => subject.id === payload.itemId)!
        item.title = payload.title
        item.fields.category = txt(payload.category)
        item.fields.declaredScore = { kind: 'number', value: payload.declaredScore }
        if (payload.level) item.fields.level = txt(payload.level)
        else delete item.fields.level
        if (payload.activityDate) item.fields.activityDate = { kind: 'date', value: payload.activityDate }
        else delete item.fields.activityDate
        if (payload.organizer) item.fields.organizer = txt(payload.organizer)
        else delete item.fields.organizer
        item.correction = 'user-confirmed'
        item.status = 'confirmed'
      },
    }
  })
  if (!output.ok) throw new CommandValidationError(output.code, output.message)
  const view = nativeWorkspaceProjectionV3(output.aggregate)
  if (!view) throw new Error('原生事项更正已写入，但只读兼容视图不可用')
  return view
}

/**
 * Human-created native Subject against parser-registered bytes already owned
 * by this Case. Renderer inputs select existing source IDs; they never mint
 * DocumentVersion, block, SourceIdentity, role or authoritative Actor.
 */
export async function createNativeReviewItemV3(
  input: CreateNativeReviewItemV3Request,
  actor: Actor = MAIN_ACTOR,
  authorizeAtCommit?: () => void,
): Promise<ReviewCase> {
  if (!input || typeof input !== 'object' ||
      typeof input.caseId !== 'string' ||
      typeof input.requestId !== 'string' || !/^[a-zA-Z0-9:_-]{8,100}$/.test(input.requestId) ||
      !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0 ||
      typeof input.documentVersionId !== 'string' || !input.documentVersionId ||
      (input.sourceBlockId !== undefined &&
        (typeof input.sourceBlockId !== 'string' || !input.sourceBlockId)) ||
      typeof input.title !== 'string' || !input.title.trim() || input.title.length > 160 ||
      typeof input.category !== 'string' || !input.category.trim() || input.category.length > 80 ||
      typeof input.declaredScore !== 'number' || !Number.isFinite(input.declaredScore) ||
      input.declaredScore < 0 || input.declaredScore > 1_000_000)
    throw new CommandValidationError('VALIDATION_FAILED', '原生人工事项的来源/请求/字段无效')
  for (const [key, val, limit] of [
    ['level', input.level, 100], ['activityDate', input.activityDate, 80],
    ['organizer', input.organizer, 200],
  ] as const) {
    if (val !== undefined && (typeof val !== 'string' || val.length > limit))
      throw new CommandValidationError('VALIDATION_FAILED', `人工事项 ${key} 字段无效`)
  }
  if (actor.actorSource !== 'local' || actor.role !== 'reviewer')
    throw new CommandValidationError('VALIDATION_FAILED', '原生事项只允许可信本地审核人登记')

  // Stable ID across a lost reply and an identical retry; its opaque request
  // ID has no security meaning beyond collision/idempotency enforcement.
  const subjectId = `manual-${createHash('sha256').update(
    JSON.stringify([input.caseId, input.requestId])).digest('hex').slice(0, 24)}`
  const result = await submitCommand(input.caseId, {
    type: 'CreateNativeReviewItemV3',
    requestId: input.requestId,
    expectedRevision: input.expectedRevision, actor,
    payload: {
      documentVersionId: input.documentVersionId,
      sourceBlockId: input.sourceBlockId ?? null,
      title: input.title.trim(), category: input.category.trim(),
      declaredScore: input.declaredScore, level: input.level?.trim() || null,
      activityDate: input.activityDate?.trim() || null,
      organizer: input.organizer?.trim() || null, subjectId,
    },
  }, (aggregate, payload) => {
    authorizeAtCommit?.()
    if (!isNativeWorkspaceCaseV3(aggregate) || aggregate.caseV2.stage !== 'draft' ||
        aggregate.canonicalPlan || aggregate.d2RuntimePlan)
      throw new CommandValidationError('INVALID_TRANSITION', '案卷不在可编辑草稿阶段，或正式 Plan 已冻结')
    const source = aggregate.caseV2.documents.find(document =>
      document.versionId === payload.documentVersionId &&
      document.role === 'application' && document.active !== false)
    if (!source || !Number.isSafeInteger(source.parseRevision) || source.parseRevision < 0)
      throw new CommandValidationError('STALE_INPUT', '只有本案当前有效、角色为申报材料的真实版本可以建立事项')
    const block = payload.sourceBlockId === null ? undefined :
      source.blocks.find(entry => entry.blockId === payload.sourceBlockId)
    if (payload.sourceBlockId !== null && !block)
      throw new CommandValidationError('STALE_INPUT', '解析块不属于当前原件版本，拒绝凭空创建定位')
    if (aggregate.caseV2.subjects.some(subject => subject.id === subjectId))
      throw new CommandValidationError('REQUEST_ID_COLLISION', '人工事项 ID 已被占用')
    return {
      summary: `人工登记来源明确的草稿事项 ${subjectId}（不代表系统已核验申报事实）`,
      mutate: draft => {
        draft.caseV2.subjects.push({
          id: subjectId, type: 'item', title: payload.title,
          fields: {
            title: txt(payload.title), category: txt(payload.category),
            declaredScore: { kind: 'number', value: payload.declaredScore },
            ...(payload.sourceBlockId ? { nativeSourceBlockId: txt(payload.sourceBlockId) } : {}),
            ...(payload.level ? { level: txt(payload.level) } : {}),
            ...(payload.activityDate ? { activityDate: { kind: 'date', value: payload.activityDate } } : {}),
            ...(payload.organizer ? { organizer: txt(payload.organizer) } : {}),
          },
          sourceRefs: [{
            caseId: input.caseId, documentVersionId: source.versionId,
            parseRevision: source.parseRevision,
            location: block?.location ?? { kind: 'file' },
          }],
          correction: 'user-confirmed', status: 'identified',
        })
      },
    }
  })
  if (!result.ok) throw new CommandValidationError(result.code, result.message)
  const view = nativeWorkspaceProjectionV3(result.aggregate)
  if (!view) throw new Error('人工事项已写入，但原生三栏投影不可读')
  // A successful replay returns the old durable receipt without a second write.
  if (!view.items.some(item => item.id === subjectId))
    throw new Error('持久回执与事项内容不一致，请刷新并按原请求 ID 核验')
  return view
}
