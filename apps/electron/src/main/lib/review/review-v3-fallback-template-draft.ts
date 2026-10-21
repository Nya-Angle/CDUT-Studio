/**
 * 未匹配业务 → T01 可编辑模板草稿的最小桥接（M4 公共兜底 P1）。
 *
 * 背景：B29 的未匹配产出是 `B1AuthorDocument`（`candidateOnly:true`、
 * `publicationAllowed:false`、`schoolPolicyVerified:false`），而正式业务 Run
 * 需要**已发布**的 `TemplateVersion` + 负责人确认的确定性约束。仓库里此前
 * 没有这两者之间的转换，未匹配业务因此只能停在技术候选。
 *
 * 本模块只做**脚手架转换**，刻意不做的事：
 * - 不生成任何 `policyVersionIds` / `policyRefs`（不虚构学校政策）；
 * - 不生成 `deterministicConstraint`（不把技术候选的 requirement 当成确定性规则）；
 * - 所有判据一律 `execution:'semantic'`，必须由 T01 负责人逐项确认后才能发布；
 * - 产出 `status:'draft'`，不发布、不写 Case/Run。
 *
 * 也就是说：它把"有材料但没模板"的业务带到**可编辑起点**，发布与规则确认
 * 仍由既有 T01 入口与发布校验完成。
 */
import type { TemplateVersion, TemplateCriterionSpec, FieldSpec } from '@profer/shared'
import type { B1AuthorDocument, B1Field, B1Module } from './review-template-plan-adapter-v3-b1'

/** 模板版本号：scaffold 固定从 1 开始，升级走既有发布流程。 */
const DRAFT_VERSION = 1

function fieldKindOf(field: B1Field): FieldSpec['kind'] {
  switch (field.type) {
    case 'number': return 'number'
    case 'date': return 'date'
    case 'boolean': return 'boolean'
    case 'enum': return 'enum'
    // evidence 是材料引用，不是表单值；落到 text 且不参与判定
    case 'evidence':
    case 'text':
    default: return 'text'
  }
}

function fieldSpecOf(field: B1Field): FieldSpec {
  const kind = fieldKindOf(field)
  return {
    key: field.key,
    label: field.label,
    kind,
    required: field.required,
    // 候选来源不是可信政策，字段可见性先按公开处理，由负责人再调
    visibility: 'public',
    scope: field.subjectScoped ? 'subject' : 'case',
    ...(kind === 'enum' && field.enumValues?.length
      ? { options: field.enumValues.map((value) => ({ value, label: value })) }
      : {}),
  } as FieldSpec
}

/** 一个 B1 模块 → 一个审核分项；判据全部标为语义执行，等负责人确认。 */
function sectionOf(module: B1Module, order: number): {
  id: string
  name: string
  order: number
  required: boolean
  criteria: TemplateCriterionSpec[]
} {
  const criteria = (module.checks ?? []).map((check, index): TemplateCriterionSpec => ({
    id: check.checkKey,
    title: check.requirement.length > 40 ? `${check.requirement.slice(0, 40)}…` : check.requirement,
    requirement: check.requirement,
    // 技术候选的要求文本不是规则：必须由负责人确认后才能成为确定性判据
    execution: 'semantic',
    targetScope: 'case',
  } as TemplateCriterionSpec))
  return {
    id: module.moduleId,
    name: module.moduleId,
    order,
    required: false,
    criteria,
  }
}

/** B1 阶段 → 模板阶段；技术阶段不进入业务阶段链。 */
function stagesOf(document: B1AuthorDocument): TemplateVersion['stages'] {
  const manual = (document.stages ?? []).filter((stage) => stage.mode === 'manual')
  const mapped = manual.map((stage, index) => ({
    id: stage.stageId,
    name: stage.stageId,
    kind: 'manual-review' as const,
    executorRole: stage.role === 'teacher' ? 'teacher' as const : 'reviewer' as const,
    ...(index + 1 < manual.length ? { nextStageId: manual[index + 1]!.stageId } : {}),
  }))
  if (mapped.length > 0) return mapped as TemplateVersion['stages']
  // 没有手审阶段时给一个最小初审阶段，保证草稿可编辑、可发布
  return [{ id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }] as TemplateVersion['stages']
}

export interface FallbackDraftResult {
  template: TemplateVersion
  /** 真实来源候选（材料版本），供负责人核对；不进入 policyRefs */
  sourceCandidates: Array<{ documentVersionId: string; locator: string; rawSha256?: string }>
  /** 明确告知调用方这不是已发布模板 */
  notes: string[]
}

/**
 * 把未匹配作者草稿转换为可编辑模板草稿。
 *
 * @param document B29/B1 产出的候选作者文档
 * @param templateId 新草稿的模板 ID（由调用方决定，便于与候选区分）
 */
export function fallbackDraftFromB1(
  document: B1AuthorDocument,
  templateId: string,
): FallbackDraftResult {
  if (!templateId.trim()) throw new Error('缺少模板 ID')
  if (!document?.fields?.length) throw new Error('候选草稿没有字段，无法形成可编辑模板')
  const createdAt = new Date().toISOString()

  const template: TemplateVersion = {
    templateId,
    version: DRAFT_VERSION,
    schemaVersion: 2,
    name: document.name?.trim() || '未命名业务模板草稿',
    displayName: { template: document.name?.trim() || '{{title}}' },
    objectType: 'document',
    status: 'draft',
    createdAt,
    fields: document.fields.map(fieldSpecOf),
    sections: (document.modules ?? []).map((module, index) => sectionOf(module, index)),
    // 不从候选材料推断材料槽：负责人需要在编辑器里显式声明
    materialSlots: [],
    // 不虚构政策：候选来源只是证据，不是已发布政策
    policyVersionIds: [],
    policyRefs: [],
    stages: stagesOf(document),
    outputs: (document.outputs ?? []).map((output) => ({
      id: output.outputId, kind: 'item-feedback' as const, audience: 'reviewer' as const,
    })),
  } as TemplateVersion

  return {
    template,
    sourceCandidates: (document.sources ?? []).map((source) => ({
      documentVersionId: source.documentVersionId,
      locator: source.locator,
    })),
    notes: [
      '这是可编辑草稿，不是已发布模板，也不是可信政策',
      '所有判据均为语义执行，需负责人逐项确认后才可发布',
      '来源候选仅为证据，未写入 policyRefs',
    ],
  }
}
