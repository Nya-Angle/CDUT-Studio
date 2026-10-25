/**
 * C Main 原生材料自动分类：登记后立即试算；难例才走已有 OCR 与单次短模型调用。
 * 全程不启动 Pi，不要求用户确认；异步结果必须以真实原件版本与模板版本 CAS 入案。
 */
import { randomUUID } from 'node:crypto'
import type { Actor, DocumentVersion, MaterialAiSuggestion, MaterialClassification, MaterialRole } from '@profer/shared'
import { classifyMaterialLocally, reviewV3SlotAcceptsFile } from '@profer/shared'
import { readAggregate, submitCommand, CommandValidationError } from './case-store-v2'
import { isNativeWorkspaceCaseV3 } from './native-workspace-case-v3'
import { getTemplate } from './template-store'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'
import { selectedImageBlocks, classifyMaterialWithExistingOcr } from './material-classification-ocr'
import { resolveReviewGatewayChannel } from './review-model-gateway'
import { withSingleTransientRetry } from './material-classification-retry'
import { suggestMaterialWithAi } from './material-classification-ai'

export type AutoClassifyDecision = {
  role: MaterialRole
  materialSlotId?: string
  source: NonNullable<DocumentVersion['automaticClassification']>['source']
  reason: string
}

/** 相关度并非概率：只用本地分类器明确分出高低的候选自动写入。 */
export function highConfidenceDecision(result: MaterialClassification, source: 'local-rules' | 'local-ocr' = 'local-rules'):
  AutoClassifyDecision | undefined {
  const candidate = result.candidates[0]
  if (result.status !== 'high' || !candidate) return undefined
  return {
    role: candidate.role,
    ...(candidate.slotId ? { materialSlotId: candidate.slotId } : {}),
    source: result.source === 'same-byte-confirmation' ? 'same-byte-confirmation' : source,
    reason: candidate.reasons.join('；').slice(0, 240) || '本地分类器明确匹配',
  }
}

/** AI 只补当前已确定角色对应的槽位，不得借槽位建议改变角色。 */
export function compatibleAiSlotRefinement(role: MaterialRole, ai: MaterialAiSuggestion): AutoClassifyDecision | undefined {
  if (ai.status !== 'proposed' || ai.role !== role || !ai.materialSlotId) return undefined
  return {
    role, materialSlotId: ai.materialSlotId, source: 'ai',
    reason: `保留本地已识别材料类别，仅补充 AI 槽位建议：${ai.rationale}`,
  }
}

/** 返回最终可接受的槽位：无效/格式不符/角色不符一律不绑定，不让模型绕过模板约束。 */
export function admissibleAutomaticSlot(
  decision: AutoClassifyDecision,
  template: ReturnType<typeof getTemplate>,
  fileName: string,
): string | undefined {
  if (!decision.materialSlotId) return undefined
  const slot = template?.materialSlots.find(item => item.id === decision.materialSlotId)
  return slot && reviewV3SlotAcceptsFile(slot, fileName) &&
    (!slot.acceptedRoles?.length || slot.acceptedRoles.includes(decision.role)) ? slot.id : undefined
}

/** 单一事实来源、版本及模板双栅栏：任何后到模型结果不能冲掉人的修改。 */
export async function applyAutomaticClassification(
  caseId: string, documentId: string, expectedVersionId: string,
  decision: AutoClassifyDecision, actor: Actor,
  expectedTemplate?: { templateId: string; version: number },
  allowPriorMachineResult = false,
): Promise<boolean> {
  if (!['rule', 'application', 'evidence'].includes(decision.role)) return false
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const initial = readAggregate(caseId)
    if (!initial || !isNativeWorkspaceCaseV3(initial) || initial.caseV2.stage !== 'draft' ||
        initial.canonicalPlan || initial.d2RuntimePlan) return false
    if (expectedTemplate && (initial.caseV2.templateId !== expectedTemplate.templateId ||
      initial.caseV2.templateVersion !== expectedTemplate.version)) return false
    const original = initial.caseV2.documents.find(item => item.documentId === documentId &&
      item.versionId === expectedVersionId && item.active !== false)
    if (!original || original.classificationCorrection || (original.automaticClassification && !allowPriorMachineResult)) return false
    const result = await submitCommand(caseId, {
      type: 'AutoClassifyNativeWorkspaceMaterialV3',
      requestId: `native-auto-classify-${randomUUID().replace(/-/g, '')}`,
      actor, expectedRevision: initial.caseV2.revision,
      payload: { documentId, expectedVersionId, decision, expectedTemplate },
    }, (snapshot, payload) => {
      if (!isNativeWorkspaceCaseV3(snapshot) || snapshot.caseV2.stage !== 'draft' ||
          snapshot.canonicalPlan || snapshot.d2RuntimePlan)
        throw new CommandValidationError('INVALID_TRANSITION', '案卷已进入不可自动改类阶段')
      if (payload.expectedTemplate && (snapshot.caseV2.templateId !== payload.expectedTemplate.templateId ||
        snapshot.caseV2.templateVersion !== payload.expectedTemplate.version))
        throw new CommandValidationError('STALE_INPUT', '模板版本已变化')
      const current = snapshot.caseV2.documents.find(item => item.documentId === payload.documentId &&
        item.versionId === payload.expectedVersionId && item.active !== false)
      if (!current || current.classificationCorrection || (current.automaticClassification && !allowPriorMachineResult))
        throw new CommandValidationError('STALE_INPUT', '原件已失效、人工已修订或已自动分类')
      const slotId = admissibleAutomaticSlot(payload.decision,
        getTemplate(snapshot.caseV2.templateId, snapshot.caseV2.templateVersion), current.fileName)
      const changed = current.role !== payload.decision.role || (current.materialSlotId ?? null) !== (slotId ?? null)
      // 模板重选可能重新发现槽位；如无变化，不能为了刷新建议无限递增 revision。
      if (current.automaticClassification && !changed)
        throw new CommandValidationError('INVALID_TRANSITION', '分类结果未发生变化')
      return {
        summary: `系统自动归类 ${current.versionId}：${payload.decision.role}/${slotId ?? '无槽位'}（${payload.decision.source}，非人工确认）`,
        mutate: draft => {
          draft.caseV2.documents = draft.caseV2.documents.map(item => item.versionId === payload.expectedVersionId ? {
            ...item,
            role: payload.decision.role,
            materialSlotId: slotId,
            ...(changed ? { usage: 'unread' as const } : {}),
            automaticClassification: {
              role: payload.decision.role,
              ...(slotId ? { materialSlotId: slotId } : {}),
              source: payload.decision.source,
              reason: payload.decision.reason.slice(0, 240),
              at: new Date().toISOString(),
            },
          } : item)
          if (changed) revokeCurrentSourceValidity(draft, new Set([current.versionId]), 'reclassify')
        },
      }
    })
    if (result.ok) return true
    if (result.code !== 'VERSION_CONFLICT') return false
  }
  return false
}

const backgroundQueue: Array<() => Promise<void>> = []
/** 分类兜底的短模型请求超时：本地判断不明确时的单次等待上限（不重试、不提高并发）。 */
export const CLASSIFICATION_AI_TIMEOUT_MS = 30_000

const pendingSlotRefinements = new Set<string>()
let running = 0
const MAX_PARALLEL = 2
function drain(): void {
  while (running < MAX_PARALLEL && backgroundQueue.length) {
    const job = backgroundQueue.shift()!
    running++
    void job().catch(error => {
      console.info('[审核专区] 材料自动分类已降级，原件保留:', error instanceof Error ? error.message : String(error))
    }).finally(() => { running--; drain() })
  }
}

/**
 * 角色已由本地规则/OCR 确定，不能因槽位未命中而停止后续分类。
 * 仅当模板确有兼容槽位时才后台调用已有 4 秒短模型；模型只能补槽位，
 * 不得更换已写入的角色，也不能绕过原件版本、模板版本或人工改类。
 */
function queueCompatibleSlotRefinement(input: {
  caseId: string; documentId: string; versionId: string; role: MaterialRole; fileName: string
  actor: Actor; expectedTemplate: { templateId: string; version: number }
  template: ReturnType<typeof getTemplate>; onApplied?: (caseId: string, documentId: string) => void
  excerpts?: readonly string[]
}): void {
  const compatible = input.template?.materialSlots.some(slot => reviewV3SlotAcceptsFile(slot, input.fileName)
    && (!slot.acceptedRoles?.length || slot.acceptedRoles.includes(input.role)))
  if (!compatible || !resolveReviewGatewayChannel()) return
  const key = `${input.caseId}:${input.versionId}:${input.expectedTemplate.templateId}@${input.expectedTemplate.version}`
  if (pendingSlotRefinements.has(key)) return
  pendingSlotRefinements.add(key)
  backgroundQueue.push(async () => {
    try {
      const current = readAggregate(input.caseId)?.caseV2.documents.find(doc =>
        doc.documentId === input.documentId && doc.versionId === input.versionId && doc.active !== false)
      if (!current || current.classificationCorrection || current.role !== input.role ||
        current.materialSlotId || !current.automaticClassification) return
      const ai = await withSingleTransientRetry(() => suggestMaterialWithAi(input.caseId, input.documentId, {
        expectedVersionId: input.versionId, additionalExcerpts: input.excerpts,
        skipOcr: true, fixedRole: input.role, timeoutMs: CLASSIFICATION_AI_TIMEOUT_MS,
      }), { onRetry: () => console.info('[审核专区] 分类槽位请求遇到瞬时错误，1 秒后重试一次（不记录文件名与正文）') })
      const decision = compatibleAiSlotRefinement(input.role, ai)
      if (!decision) return
      if (await applyAutomaticClassification(input.caseId, input.documentId, input.versionId,
        decision, input.actor, input.expectedTemplate, true)) {
        input.onApplied?.(input.caseId, input.documentId)
      }
    } finally {
      pendingSlotRefinements.delete(key)
    }
  })
  setTimeout(drain, 0)
}

/** 不等待 OCR/AI，单文件一项任务；模型请求严格短超时，失败不阻断导入。 */
export async function classifyNewNativeWorkspaceMaterial(
  caseId: string, documentId: string, versionId: string, actor: Actor,
  onApplied?: (caseId: string, documentId: string) => void,
  recheckAfterTemplateChange = false,
): Promise<void> {
  const snapshot = readAggregate(caseId)
  if (!snapshot || !isNativeWorkspaceCaseV3(snapshot) || snapshot.caseV2.stage !== 'draft' ||
      snapshot.canonicalPlan || snapshot.d2RuntimePlan) return
  const doc = snapshot.caseV2.documents.find(item => item.documentId === documentId &&
    item.versionId === versionId && item.active !== false)
  if (!doc || doc.classificationCorrection || (doc.automaticClassification && !recheckAfterTemplateChange)) return
  const expectedTemplate = { templateId: snapshot.caseV2.templateId, version: snapshot.caseV2.templateVersion }
  const template = getTemplate(expectedTemplate.templateId, expectedTemplate.version)
  const local = classifyMaterialLocally({ document: { ...doc, classificationCorrection: undefined }, template,
    confirmedExamples: snapshot.caseV2.documents.filter(item => item.active !== false &&
      item.classificationCorrection?.role !== 'attachment').map(item => ({
        byteHash: item.byteHash,
        ...(item.classificationCorrection ? { classificationCorrection: {
          ...item.classificationCorrection, role: item.classificationCorrection.role as MaterialRole,
        } } : {}),
      })),
  })
  const decision = highConfidenceDecision(local)
  if (decision) {
    if (await applyAutomaticClassification(caseId, documentId, versionId, decision, actor, expectedTemplate,
      recheckAfterTemplateChange)) {
      onApplied?.(caseId, documentId)
      if (!admissibleAutomaticSlot(decision, template, doc.fileName)) {
        queueCompatibleSlotRefinement({ caseId, documentId, versionId, role: decision.role,
          fileName: doc.fileName, actor, expectedTemplate, template, onApplied })
      }
    }
    return
  }
  // 已经由机器归类的角色只需要尝试新模板槽，不为它再次付费调用 OCR/AI。
  if (doc.automaticClassification) return
  backgroundQueue.push(async () => {
    const hadImages = selectedImageBlocks(doc).length > 0
    let excerpts: string[] = []
    if (hadImages) {
      try {
        const ocr = await classifyMaterialWithExistingOcr(caseId, documentId)
        if (ocr.documentVersionId !== versionId) return
        excerpts = ocr.classification?.excerpts ?? []
        const fromOcr = ocr.classification && highConfidenceDecision(ocr.classification, 'local-ocr')
        if (fromOcr) {
          if (await applyAutomaticClassification(caseId, documentId, versionId, fromOcr, actor, expectedTemplate)) {
            onApplied?.(caseId, documentId)
            if (!admissibleAutomaticSlot(fromOcr, template, doc.fileName)) {
              queueCompatibleSlotRefinement({ caseId, documentId, versionId, role: fromOcr.role,
                fileName: doc.fileName, actor, expectedTemplate, template, onApplied, excerpts })
            }
          }
          return
        }
      } catch (error) {
        console.info('[审核专区] 本地 OCR 不可用，进入模型短请求:', error instanceof Error ? error.message : String(error))
      }
    }
    if (!resolveReviewGatewayChannel()) return
    const ai = await withSingleTransientRetry(() => suggestMaterialWithAi(caseId, documentId, {
      expectedVersionId: versionId, additionalExcerpts: excerpts, skipOcr: hadImages, timeoutMs: CLASSIFICATION_AI_TIMEOUT_MS,
    }), { onRetry: () => console.info('[审核专区] 分类短请求遇到瞬时错误，1 秒后重试一次（不记录文件名与正文）') })
    if (ai.status !== 'proposed' || !ai.role) return
    const candidate: AutoClassifyDecision = {
      role: ai.role,
      ...(ai.materialSlotId ? { materialSlotId: ai.materialSlotId } : {}),
      source: 'ai', reason: ai.rationale,
    }
    if (await applyAutomaticClassification(caseId, documentId, versionId, candidate, actor, expectedTemplate))
      onApplied?.(caseId, documentId)
  })
  setTimeout(drain, 0)
}

/** 模板切换后仅重检机器状态和待分类附件，不触碰人工确认或已绑定材料。 */
export async function reclassifyForSelectedTemplate(
  caseId: string, actor: Actor, onApplied?: (caseId: string, documentId: string) => void,
): Promise<void> {
  const aggregate = readAggregate(caseId)
  if (!aggregate || !isNativeWorkspaceCaseV3(aggregate) || aggregate.caseV2.stage !== 'draft' ||
      aggregate.canonicalPlan || aggregate.d2RuntimePlan) return
  for (const doc of aggregate.caseV2.documents) {
    if (doc.active === false || doc.classificationCorrection || doc.materialSlotId ||
        (doc.role !== 'attachment' && !doc.automaticClassification)) continue
    try {
      // 同案 CAS 串行，避免一批模板槽位重检相互冲突；真正的 OCR/AI 仍由全局两路后台池并发执行。
      await classifyNewNativeWorkspaceMaterial(caseId, doc.documentId, doc.versionId, actor, onApplied, true)
    } catch (error) {
      console.info('[审核专区] 模板切换后的分类重检已跳过:', error instanceof Error ? error.message : String(error))
    }
  }
}
