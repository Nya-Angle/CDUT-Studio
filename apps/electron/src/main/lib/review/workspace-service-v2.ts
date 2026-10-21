/**
 * 三栏审核工作台与 V2 案卷聚合的内部映射。
 * 当前迁移期沿用同一 caseId；V1 表单输入只作为系统投影写入 V2，人工事实、处置与决定始终留在聚合中。
 */
import { createHash } from 'node:crypto'
import type { CaseAggregateV2, CommandReceipt, FieldValue, ReviewCase, ReviewCaseV2, RuleSpec } from '@profer/shared'
import { getCase, updateCase } from './case-store'
import { createAggregate, readAggregate, submitCommand } from './case-store-v2'
import { documentToVersion, itemToSubject, mapDomainToTemplate, migrateCaseToV2 } from './migration'
import { getTemplate, saveDraft } from './template-store'
import { ensureBuiltinTemplateDrafts } from './builtin-templates'
import { buildEvidenceLinks } from './evidence-service'
import { compileWorkspaceRule } from './workspace-rule-compiler'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'

const SYSTEM_ACTOR = { actorId: 'review-workspace-sync', actorSource: 'system', role: 'system' } as const
const ensureFlights = new Map<string, Promise<CaseAggregateV2>>()

function text(value: string): FieldValue {
  return { kind: 'text', value }
}

function projectedCase(v1: ReviewCase, current: ReviewCaseV2): ReviewCaseV2 {
  const mapping = mapDomainToTemplate(v1.domainPackId)
  if (!mapping.templateId) throw new Error(mapping.note ?? `审核领域未映射到 V2 模板: ${v1.domainPackId ?? '(默认)'}`)
  const selectedTemplateId = v1.reviewTemplate?.templateId ?? mapping.templateId
  const selectedTemplateVersion = v1.reviewTemplate?.version
    ?? (current.templateId === selectedTemplateId ? current.templateVersion : undefined)
  const template = getTemplate(selectedTemplateId, selectedTemplateVersion)
  if (!template) throw new Error(`V2 模板不存在或未初始化: ${selectedTemplateId}`)

  const previousSubjects = new Map(current.subjects.map((subject) => [subject.id, subject]))
  const subjects = v1.items.map((item) => {
    const subject = itemToSubject(item)
    const previous = previousSubjects.get(subject.id)
    return {
      ...previous,
      ...subject,
      // V1 owns current declared values; V2-only fields remain available after a source refresh.
      fields: { ...previous?.fields, ...subject.fields },
      sourceRefs: subject.sourceRefs.map((ref) => ({ ...ref, caseId: v1.id })),
    }
  })
  const sourceRules: RuleSpec[] = v1.rulePacks.flatMap((pack) => pack.outline.map((outline, index) => compileWorkspaceRule(pack, outline, index + 1)))
  const manualRules: RuleSpec[] = (v1.manualRules ?? []).map((rule, index) => ({
    id: `manual:${v1.id}:${rule.id}`,
    policyVersionId: `case-manual:${v1.id}@1`,
    title: rule.title,
    when: { field: 'title', op: 'exists' },
    requirement: rule.requirement,
    targetScope: 'subject',
    execution: 'semantic',
    onFail: 'manual-review',
    onUnknown: 'needs-confirmation',
    sourceRefIds: [],
    priority: sourceRules.length + index + 1,
    confirmation: 'confirmed',
    semanticOutputEnum: ['compliant', 'non-compliant', 'awaiting-confirmation'],
  }))
  const reviewRules = [...sourceRules, ...manualRules]
  const previousDocuments = new Map(current.documents.map((document) => [document.versionId, document]))
  const projectDocument = (document: ReviewCase['documents'][number]) => {
    const version = documentToVersion(document)
    const slotted = mapping.templateId !== 'comprehensive-assessment-v2'
      ? version
      : document.role === 'application' ? { ...version, materialSlotId: 'application-form' }
        : document.role === 'evidence' ? { ...version, materialSlotId: 'certificates' }
          : version
    const previous = previousDocuments.get(slotted.versionId)
    return previous ? {
      ...previous,
      ...slotted,
      // V1 refreshes source metadata; human material handling and version lineage belong to V2.
      usage: previous.usage,
      ...(previous.unusedReason ? { unusedReason: previous.unusedReason } : {}),
      ...(previous.active !== undefined ? { active: previous.active } : {}),
      ...(previous.supersedesVersionId ? { supersedesVersionId: previous.supersedesVersionId } : {}),
    } : slotted
  }
  const projectedActiveDocuments = v1.documents.map(projectDocument)
  const activeVersionIds = new Set(projectedActiveDocuments.map((document) => document.versionId))
  const archivedDocuments = (v1.archivedDocuments ?? [])
    .map((document) => {
      const projected = projectDocument(document)
      const previous = previousDocuments.get(projected.versionId)
      return {
        ...projected,
        ...(previous?.supersedesVersionId ? { supersedesVersionId: previous.supersedesVersionId } : {}),
        active: false,
        usage: 'unread' as const,
        unusedReason: '审核员已从当前审核材料中移除',
      }
    })
    .filter((document) => !activeVersionIds.has(document.versionId))
  // The legacy V1 case is only a projection of its own uploads. Versions created
  // directly in the V2 workbench (for example, a repaired/reparsed source file)
  // have no V1 document row and must survive every later projection sync.
  const legacyVersionIds = new Set([
    ...v1.documents,
    ...(v1.archivedDocuments ?? []),
  ].map((document) => `${document.id}-v1`))
  const v2OnlyDocuments = current.documents.filter((document) => !legacyVersionIds.has(document.versionId))
  return {
    ...current,
    templateId: template.templateId,
    templateVersion: template.version,
    title: v1.title,
    caseFields: {
      ...current.caseFields,
      applicant: text(v1.applicant),
      academicYear: text(v1.academicYear),
    },
    subjects,
    reviewRules,
    documents: [...projectedActiveDocuments, ...archivedDocuments, ...v2OnlyDocuments],
  }
}

function projectionFingerprint(caseV2: ReviewCaseV2): string {
  const { title, templateId, templateVersion, caseFields, subjects, documents, reviewRules } = caseV2
  return JSON.stringify({ title, templateId, templateVersion, caseFields, subjects, documents, reviewRules })
}

async function initializeAggregate(caseId: string): Promise<CaseAggregateV2> {
  // First-use path must work even if the separate V2 setup panel has never been opened.
  ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
  const existing = readAggregate(caseId)
  // Native V2 cases are authoritative even when no V1 case.json exists.
  if (existing) return existing
  const legacy = getCase(caseId)
  if (!legacy) throw new Error(`辅助审核案卷不存在: ${caseId}`)

  const migration = migrateCaseToV2(legacy)
  if (!migration.caseV2) throw new Error(migration.note || `案卷无法映射到 V2: ${caseId}`)
  const projected = projectedCase(legacy, migration.caseV2)
  projected.revision = 0
  projected.stage = projected.documents.length > 0 ? 'submitted' : 'draft'
  const receipt: CommandReceipt = {
    requestId: `workspace-init-${caseId}`,
    type: 'EnsureReviewWorkspaceAggregate',
    payloadHash: createHash('sha256').update(`${caseId}|${projectionFingerprint(projected)}`).digest('hex'),
    revision: 0,
    at: new Date().toISOString(),
    summary: '辅助审核工作台已映射到单案业务聚合',
    actor: SYSTEM_ACTOR,
  }
  await createAggregate(caseId, projected, receipt)
  const aggregate = readAggregate(caseId)
  if (!aggregate) throw new Error(`V2 案卷聚合写入失败: ${caseId}`)
  return aggregate
}

/** 创建或读取工作台当前案卷的唯一 V2 聚合，并同步 V1 输入投影。 */
export async function ensureWorkspaceAggregateV2(caseId: string): Promise<CaseAggregateV2> {
  let flight = ensureFlights.get(caseId)
  if (!flight) {
    flight = initializeAggregate(caseId).finally(() => ensureFlights.delete(caseId))
    ensureFlights.set(caseId, flight)
  }
  await flight
  return syncWorkspaceProjectionV2(caseId)
}

/** 将工作台已有的申报字段、事项和文件版本投影到同 ID 的 V2 聚合，不触碰人工业务记录。 */
export async function syncWorkspaceProjectionV2(caseId: string): Promise<CaseAggregateV2> {
  ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
  let current = readAggregate(caseId) ?? await initializeAggregate(caseId)
  // A native aggregate never takes incoming V1 projections; archived cases
  // also never reopen just because a legacy UI reads an old case.json.
  if (current.caseV2.stage === 'archived' ||
      !current.receiptLog.some((receipt) => receipt.type === 'EnsureReviewWorkspaceAggregate')) return current
  if (!current.d2RuntimePlan && !current.canonicalPlan) {
    await upgradeLegacyComprehensiveTemplateAssignment(caseId)
  }

  // 乐观并发冲突时重新读取并重试；不会用旧快照覆盖另一条人工操作。
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const legacy = getCase(caseId)
    if (!legacy) throw new Error(`辅助审核案卷不存在: ${caseId}`)
    const legacyProjection = projectedCase(legacy, current.caseV2)
    // A bound Plan owns the Subject×Rule identity. V1 input editing cannot
    // silently replace its frozen template, target map or rule inventory.
    const projection: ReviewCaseV2 = current.d2RuntimePlan || current.canonicalPlan
      ? { ...legacyProjection,
          templateId: current.caseV2.templateId, templateVersion: current.caseV2.templateVersion,
          subjects: current.caseV2.subjects, reviewRules: current.caseV2.reviewRules }
      : legacyProjection
    const archivedVersionIds = new Set((legacy.archivedDocuments ?? []).map((document) => `${document.id}-v1`))
    if (projectionFingerprint(projection) === projectionFingerprint(current.caseV2)) return current
    const digest = createHash('sha256').update(projectionFingerprint(projection)).digest('hex')
    const result = await submitCommand(caseId, {
      requestId: `workspace-sync-${digest.slice(0, 32)}`,
      actor: SYSTEM_ACTOR,
      expectedRevision: current.caseV2.revision,
      type: 'SyncReviewWorkspaceProjection',
      payload: { digest },
    }, () => ({
      summary: `同步申报输入与材料（${projection.subjects.length} 项 / ${projection.documents.length} 份）`,
      mutate: (draft) => {
        draft.caseV2 = { ...projection, revision: draft.caseV2.revision, updatedAt: draft.caseV2.updatedAt }
        // Archive revocation belongs to the SAME CAS+Receipt as V1 projection.
        // Keep historical values, link identities, source refs and receipts.
        revokeCurrentSourceValidity(draft, archivedVersionIds, 'archive')
        // 来自 V1 识别的关联先作为 AI 候选；审核员可在工作台确认、拒绝或改绑。
        for (const item of legacy.items) {
          const versionIds = item.evidenceDocumentIds.map((documentId) => `${documentId}-v1`)
          for (const documentVersionId of versionIds) {
            if (!draft.caseV2.documents.some((document) => document.versionId === documentVersionId && document.active !== false)) continue
            draft.evidenceLinks = buildEvidenceLinks(draft.evidenceLinks, {
              documentVersionId,
              subjectIds: [item.id],
              supportsFact: item.title,
              linkedBy: item.identifiedBy === 'manual' ? 'user' : 'ai',
            })
          }
        }
      },
    }))
    if (result.ok) return result.aggregate
    if (result.code !== 'VERSION_CONFLICT') throw new Error(`${result.code}: ${result.message}`)
    current = readAggregate(caseId) ?? current
  }
  throw new Error(`案卷聚合同步冲突，请刷新后重试: ${caseId}`)
}

/**
 * Early releases published comprehensive-assessment-v2@2 as a thin, rule-empty
 * compatibility template. Keep that published version for old runs, but move the
 * affected live case to the new built-in v3 before projecting or starting another run.
 */
async function upgradeLegacyComprehensiveTemplateAssignment(caseId: string): Promise<void> {
  const legacy = getCase(caseId)
  const selected = legacy?.reviewTemplate
  if (!legacy || selected?.templateId !== 'comprehensive-assessment-v2' || selected.version !== 2) return
  const oldTemplate = getTemplate(selected.templateId, selected.version)
  const currentTemplate = getTemplate(selected.templateId)
  if (!oldTemplate || (oldTemplate.sections ?? []).some((item) => item.criteria.length > 0)) return
  if (!currentTemplate || currentTemplate.version !== 3 || currentTemplate.status !== 'published'
    || !(currentTemplate.sections ?? []).some((item) => item.criteria.length > 0)) return

  await updateCase(caseId, (fresh) => {
    if (fresh.reviewTemplate?.templateId !== selected.templateId || fresh.reviewTemplate.version !== selected.version) return null
    return { ...fresh, reviewTemplate: { templateId: currentTemplate.templateId, version: currentTemplate.version } }
  }, { reason: `升级空规则内置综测模板 v2 → v${currentTemplate.version}（保留历史运行）` })
}

/** 测试与查询使用的纯投影构造。 */
export function projectWorkspaceCaseV2(v1: ReviewCase, current: ReviewCaseV2): ReviewCaseV2 {
  return projectedCase(v1, current)
}
