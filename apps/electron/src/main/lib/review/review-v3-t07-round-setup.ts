/** 从锁定的批次和正式发布的模板建立评分轮次，禁止使用演示量表代替业务规则。 */
import type { ReviewBatch, RubricSpec, TemplateVersion } from '@profer/shared'
import type { T07State } from './review-v3-t07-rating-workflow'

function checkedRubric(rubric: RubricSpec | undefined): RubricSpec {
  if (!rubric || !Array.isArray(rubric.dimensions) || rubric.dimensions.length === 0) {
    throw new Error('批次绑定的模板未发布评分量表，请先在模板中配置并发布')
  }
  if (!Number.isInteger(rubric.totalPrecision) || rubric.totalPrecision < 0 || rubric.totalPrecision > 6) {
    throw new Error('模板评分量表的总分精度无效')
  }
  if (rubric.missingStrategy !== 'block' && rubric.missingStrategy !== 'exclude') {
    throw new Error('模板未设置有效的缺评处理策略')
  }
  if (rubric.minEffectiveJudges !== undefined &&
    (!Number.isInteger(rubric.minEffectiveJudges) || rubric.minEffectiveJudges < 1)) {
    throw new Error('模板最低有效评委数必须是正整数')
  }
  const dimensionIds = new Set<string>()
  let totalWeight = 0
  for (const dimension of rubric.dimensions) {
    if (!dimension.id?.trim() || dimensionIds.has(dimension.id) ||
      !Number.isFinite(dimension.min) || !Number.isFinite(dimension.max) || dimension.min > dimension.max ||
      !Number.isFinite(dimension.weight) || dimension.weight < 0) {
      throw new Error('模板评分维度存在重复标识、无效区间或权重')
    }
    dimensionIds.add(dimension.id)
    totalWeight += dimension.weight
  }
  if (totalWeight <= 0) throw new Error('模板评分维度的总权重必须大于零')
  if (rubric.scaleConversion &&
    (!Number.isFinite(rubric.scaleConversion.fromMax) || rubric.scaleConversion.fromMax <= 0 ||
      !Number.isFinite(rubric.scaleConversion.toMax) || rubric.scaleConversion.toMax <= 0)) {
    throw new Error('模板评分换算量尺无效')
  }
  return structuredClone(rubric)
}

export function createT07RoundFromPublishedTemplate(batch: ReviewBatch, template: TemplateVersion | undefined): T07State {
  if (!template || template.status !== 'published' ||
    template.templateId !== batch.templateId || template.version !== batch.templateVersion) {
    throw new Error('无法取得与批次锁定版本一致的已发布模板，评分轮次未建立')
  }
  if (batch.caseIds.length === 0 || new Set(batch.caseIds).size !== batch.caseIds.length ||
    batch.caseIds.some((id) => !id.trim())) {
    throw new Error('批次没有有效案卷，或案卷列表存在重复和空值')
  }
  const rubric = checkedRubric(template.rubric)
  return {
    batchId: batch.id,
    // RubricSpec 没有独立版本号；以发布模板版本锁定本轮量表身份。
    rubricVersion: template.version,
    rubric,
    cases: batch.caseIds.map((caseId, index) => ({
      caseId,
      blindLabel: `匿名项目 ${String(index + 1).padStart(3, '0')}`,
    })),
    rounds: [{ number: 1, assignments: [], votes: [], divergenceReasons: {}, tieOrders: {} }],
  }
}
