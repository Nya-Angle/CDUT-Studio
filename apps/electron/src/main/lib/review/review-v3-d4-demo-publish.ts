/**
 * 把 50 套 D4 冻结候选发布为**演示用**业务模板（TemplateVersion）。
 *
 * 背景与边界（请勿混淆）：
 * - D4 目录的 `publication: candidate-held` 表示「未取得校方正式批准」，这一事实不改；
 * - 本项目当前处于演示阶段：模板内容来自互联网公开材料的技术化重写，
 *   因此允许把候选发布为可执行模板，供拖入材料后真正跑通审核；
 * - 发布时**不生成任何校方政策引用**（policyVersionIds/policyRefs 为空），
 *   模板名只用业务名称（不含项目编号、不含“演示/测试”字样），判据一律标为 semantic，
 *   即结果必须人工复核，不能被当成学校正式结论。
 *
 * 也就是说：这不是"伪造校方批准"，而是把候选资产变成**可运行的模板**。
 */
import type { TemplateVersion, TemplateCriterionSpec, ReviewAuthoringWorkspaceV1 } from '@profer/shared'
import { loadD4UnifiedCatalog, loadD4UnifiedWorkspace, type D4UnifiedEntry } from './review-d4-catalog'
import { saveDraft, publishTemplate, getTemplate } from './template-store'

/**
 * 去掉 D4 冻结定义里的编号前缀（如「G02-T01｜」「G06-T09 」「G04-」），
 * 用户在模板库里应该看到业务名称，而不是内部编号。
 */
function stripCodePrefix(name: string): string {
  return name
    .replace(/^G\d{2}(?:[-–— ]?T?\d{1,3})?[｜|:：\-–—\s]*/i, '')
    // 去掉内部研发术语括注（研究性技术预审、R1 迁移技术候选等）
    .replace(/[（(][^（）()]*(技术预审|技术候选)[^（）()]*[）)]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

interface D4ModuleTask {
  id: string
  title: string
  requirement: string
  completion?: string
}
interface D4Module {
  moduleId: string
  version: number
  name: string
  tasks: D4ModuleTask[]
}

/** 把一份 D4 冻结工作区转换成演示用 TemplateVersion（判据全语义、无政策引用）。 */
/** 转换产物使用独立命名空间，避免占用 D4 冻结作者键（TAR-01）。 */
export const D4_DEMO_TEMPLATE_ID_PREFIX = 'd4demo-'

export function derivedDemoTemplateId(templateId: string): string {
  return `${D4_DEMO_TEMPLATE_ID_PREFIX}${templateId}`
}

export function isDerivedDemoTemplateId(templateId: string): boolean {
  return templateId.startsWith(D4_DEMO_TEMPLATE_ID_PREFIX)
}

export function demoTemplateFromD4(entry: D4UnifiedEntry, workspace: ReviewAuthoringWorkspaceV1): TemplateVersion {
  const definition = workspace.definitions.templates[0]!
  const modules = (workspace.definitions.modules ?? []) as unknown as D4Module[]
  const moduleById = new Map(modules.map((module) => [module.moduleId, module]))
  const createdAt = new Date().toISOString()
  // 只消费模板显式引用的模块（TAR-02）：不再把 workspace 定义全集平铺。
  // 场景限定保留为分项说明与要求前缀，供人工复核时判定是否适用，而不是静默套用。
  const references = (definition.modules ?? []) as Array<{ id?: string; moduleId: string; version?: number; scenario?: string }>
  const sections = references.flatMap((reference, index) => {
    const module = moduleById.get(reference.moduleId)
    if (!module) return []
    const scenario = reference.scenario?.trim()
    const scenarioNote = scenario ? `【适用场景：${scenario}；不适用时按人工待核处理】` : ''
    return [{
      id: reference.id ?? `${reference.moduleId}@${reference.version ?? module.version}`,
      name: scenario ? `${module.name}（场景 ${scenario}）` : module.name,
      description: scenario ? `原始模板仅在场景 ${scenario} 引用本模块。` : undefined,
      order: index,
      // 分项是否必填由人工判断；不因候选资产而强制用户先录事项
      required: false,
      criteria: (module.tasks ?? []).map((task): TemplateCriterionSpec => ({
        id: task.id,
        title: task.title.slice(0, 60),
        requirement: scenarioNote ? `${scenarioNote}${task.requirement}` : task.requirement,
        // 判据为语义执行，必须人工复核，不冒充确定性规则
        execution: 'semantic',
        targetScope: 'case',
      } as TemplateCriterionSpec)),
    }]
  })

  // 用户看到的就是业务名称：不带任何项目编号或"演示/测试"前缀
  const displayTitle = stripCodePrefix(definition.name)
  return {
    // 派生身份：原 D4 冻结 ID 仍归技术预审路径，演示版不占用它。
    templateId: derivedDemoTemplateId(entry.templateId),
    version: entry.templateVersion,
    catalogKind: 'reference',
    sourceNote: `D4_DERIVED_DEMO:${entry.templateId}@${entry.templateVersion}；有损演示转换，不得替代原始 D4 技术计划`,
    schemaVersion: 2,
    name: displayTitle,
    displayName: { template: displayTitle },
    objectType: 'document',
    status: 'draft',
    createdAt,
    fields: [
      // 演示模板保留一个可选标题字段，便于用户建案时有可辨识名称
      { key: 'title', label: '事项名称', kind: 'text', required: false, visibility: 'public', scope: 'case' },
    ],
    sections,
    materialSlots: [],
    // 演示模板不引用任何校方政策版本
    policyVersionIds: [],
    policyRefs: [],
    stages: [{ id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
  } as TemplateVersion
}

export interface D4PublishResult {
  published: Array<{ templateId: string; version: number; sections: number; criteria: number }>
  renamed: Array<{ templateId: string; version: number; sections: number; criteria: number }>
  skipped: Array<{ templateId: string; version: number; reason: string }>
  failed: Array<{ templateId: string; version: number; reason: string }>
}

/**
 * 发布全部 50 套演示模板。已发布（且不是演示前缀）的模板不覆盖，避免覆盖用户自己的正式模板。
 */
export function publishD4Templates(): D4PublishResult {
  const catalog = loadD4UnifiedCatalog()
  const result: D4PublishResult = { published: [], renamed: [], skipped: [], failed: [] }
  for (const entry of catalog.templates) {
    const templateId = derivedDemoTemplateId(entry.templateId)
    try {
      const latest = getTemplate(templateId)
      // TAR-11：只有「已发布 + 名称干净」才跳过；干净名称的 draft 仍需发布。
      if (latest && latest.status === 'published' && isCleanName(latest.name)) {
        result.skipped.push({ templateId, version: latest.version, reason: '已发布且名称正常' })
        continue
      }
      const needsRename = Boolean(latest && !isCleanName(latest.name))
      const workspace = loadD4UnifiedWorkspace(entry)
      const base = demoTemplateFromD4(entry, workspace)
      // 新命名空间从冻结版本号起算；已有派生版本则递增，绝不改写历史版本。
      const version = latest ? latest.version + 1 : entry.templateVersion
      const template = { ...base, version }
      saveDraft(template)
      publishTemplate(templateId, version)
      const record = {
        templateId,
        version,
        sections: template.sections?.length ?? 0,
        criteria: (template.sections ?? []).reduce((sum, section) => sum + section.criteria.length, 0),
      }
      if (needsRename) result.renamed.push(record)
      else result.published.push(record)
    } catch (error) {
      result.failed.push({
        templateId,
        version: entry.templateVersion,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return result
}

/** 名称是否已经是干净的业务名（不带项目编号、不带"演示/测试"字样）。 */
export function isCleanName(name: string): boolean {
  return !/^G\d{2}/i.test(name) && !name.includes('【演示】') && !name.includes('演示')
    && !name.includes('测试') && !name.includes('技术预审') && !name.includes('技术候选')
}

export const publishD4DemoTemplates = publishD4Templates
