/**
 * T01 typed criteria：模板作者契约中“可机器判定的数值限制”的唯一校验源。
 *
 * 该模块必须同时被 Renderer（编辑器友好提示）与 Main（发布门禁）引用：
 * - Renderer 的拦截只是用户体验，不能当作可信发布校验；
 * - Main 必须在同一发布事务内重跑同一份校验（TAR-08）。
 */
import type { FieldSpec, TemplateCriterionSpec, TemplateVersion } from '../types/review-v2'

export interface T01OwnerStatement {
  kind: 'owner-statement'
  text: string
  enteredBy: string
  enteredAt: string
}

/** A check on a *confirmed* numeric case field; NOT an input-form max. */
export interface T01NumberLimit {
  schemaVersion: 1
  kind: 'field-number-limit'
  fieldKey: string
  fieldScope: 'case'
  operator: 'lte' | 'gte'
  threshold: number
  unit?: string
  ownerStatement?: T01OwnerStatement
}

export type T01CriterionWithConstraint = TemplateCriterionSpec & {
  deterministicConstraint?: T01NumberLimit
}

export function readT01NumberLimit(criterion: TemplateCriterionSpec): T01NumberLimit | undefined {
  const raw = (criterion as T01CriterionWithConstraint).deterministicConstraint
  return raw?.kind === 'field-number-limit' ? raw : undefined
}

export function validateT01TypedCriteria(template: TemplateVersion): string[] {
  const errors: string[] = []
  for (const section of template.sections ?? []) {
    for (const criterion of section.criteria) {
      const location = `分项「${section.name}」标准「${criterion.title}」`
      const raw = (criterion as T01CriterionWithConstraint).deterministicConstraint
      if (raw === undefined) {
        if (criterion.execution === 'deterministic' && !criterion.dataCheck) {
          errors.push(`${location} 尚未配置可执行的确定性规则`)
        }
        continue
      }
      if (!raw || raw.schemaVersion !== 1 || raw.kind !== 'field-number-limit') {
        errors.push(`${location} 的确定性条件格式无法识别`)
        continue
      }
      const field: FieldSpec | undefined = template.fields.find(item =>
        item.key === raw.fieldKey && item.kind === 'number' && (item.scope ?? 'subject') === raw.fieldScope,
      )
      if (!field || raw.fieldScope !== 'case' || criterion.targetScope !== 'case') {
        errors.push(`${location} 必须引用有效的案卷级数字字段`)
      }
      if (criterion.execution !== 'deterministic' || criterion.dataCheck) {
        errors.push(`${location} 的数值条件不能同时声明其他执行方式或工作簿检查`)
      }
      if (!['lte', 'gte'].includes(raw.operator) || typeof raw.threshold !== 'number' ||
          !Number.isFinite(raw.threshold)) {
        errors.push(`${location} 的比较符或阈值无效`)
      }
      const owner = raw.ownerStatement
      if (!owner || owner.kind !== 'owner-statement' || !owner.text?.trim() ||
          !owner.enteredBy?.trim() || !Number.isFinite(Date.parse(owner.enteredAt))) {
        errors.push(`${location} 需要负责人确认依据与署名，才能作为确定性规则发布`)
      }
    }
  }
  return errors
}

/** 导入/模型起草的数值约束不是已认证署名：保留描述、剥离负责人确认。 */
export function stripT01OwnerStatement(template: TemplateVersion): TemplateVersion {
  return {
    ...template,
    sections: template.sections?.map((section) => ({
      ...section,
      criteria: section.criteria.map((criterion) => {
        const { deterministicConstraint, ...rest } = criterion as T01CriterionWithConstraint
        return deterministicConstraint
          ? { ...rest, deterministicConstraint: { ...deterministicConstraint, ownerStatement: undefined } }
          : rest
      }),
    })),
  }
}

/** 模板当前是否声明了任何 authored 审核标准（分项内 requirement）。 */
export function countAuthoredCriteria(template: TemplateVersion): number {
  return (template.sections ?? []).reduce((total, section) => total + (section.criteria?.length ?? 0), 0)
}

/** 是否存在“自动检查”阶段；无标准的自动检查模板只是空承诺。 */
export function hasAutoCheckStage(template: TemplateVersion): boolean {
  return (template.stages ?? []).some((stage) => stage.kind === 'auto-check')
}
