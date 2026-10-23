/**
 * T01 author-side contract for typed template checks.
 *
 * 校验实现位于 @profer/shared/review/t01-typed-criteria：Main 发布事务必须调用
 * 同一份函数（TAR-08），这里只保留编辑器交互辅助与重导出。
 * T04 消费这些描述符构建 RuleSpec/PlanBinding 并对真实事实求值。
 */
import type { FieldSpec, TemplateCriterionSpec, TemplateVersion } from '@profer/shared'
import {
  readT01NumberLimit,
  stripT01OwnerStatement,
  validateT01TypedCriteria,
  type T01CriterionWithConstraint,
  type T01NumberLimit,
  type T01OwnerStatement,
} from '@profer/shared'

// TAR-08：校验逻辑属于 @profer/shared 单一源，Main 发布事务与编辑器共用。
export {
  readT01NumberLimit,
  validateT01TypedCriteria,
  type T01CriterionWithConstraint,
  type T01NumberLimit,
  type T01OwnerStatement,
}

export interface T01PublishedNumericCheck {
  templateId: string
  templateVersion: number
  sectionId: string
  criterionId: string
  ruleId: string
  title: string
  requirement: string
  targetScope: 'case'
  constraint: Omit<T01NumberLimit, 'ownerStatement'> & { ownerStatement: T01OwnerStatement }
  policyVersionId: string
  priority: number
}

export interface T01PublishedMaterialRequirement {
  templateId: string
  templateVersion: number
  slotId: string
  sectionId?: string
  minCount: number
  requiredAt: 'submission' | 'decision'
  requiredWhen?: import('@profer/shared').ConditionAST
}

export function setT01NumberLimit(
  criterion: TemplateCriterionSpec,
  constraint: Omit<T01NumberLimit, 'ownerStatement'>,
): TemplateCriterionSpec {
  return {
    ...criterion,
    execution: 'deterministic',
    dataCheck: undefined,
    deterministicConstraint: { ...constraint, ownerStatement: undefined },
  } as T01CriterionWithConstraint
}

export function confirmT01NumberLimit(
  criterion: TemplateCriterionSpec,
  source: T01OwnerStatement,
): TemplateCriterionSpec {
  const constraint = readT01NumberLimit(criterion)
  if (!constraint) throw new Error('T01_NUMBER_LIMIT_REQUIRED')
  if (!source.text.trim() || !source.enteredBy.trim() || !Number.isFinite(Date.parse(source.enteredAt))) {
    throw new Error('T01_OWNER_STATEMENT_REQUIRED')
  }
  return { ...criterion, deterministicConstraint: { ...constraint, ownerStatement: source } } as T01CriterionWithConstraint
}

/**
 * T01-to-T04 projection. Does not assert that Main has published, bound or run this
 * template. Main must load and verify the exact published version before installing.
 */
export function collectT01ConfirmedNumericChecks(template: TemplateVersion): T01PublishedNumericCheck[] {
  const errors = validateT01TypedCriteria(template)
  if (errors.length) throw new Error(`T01_RULES_NOT_CONFIRMED: ${errors.join('；')}`)
  return (template.sections ?? []).flatMap(section =>
    section.criteria.flatMap((criterion, index) => {
      const c = readT01NumberLimit(criterion)
      if (!c?.ownerStatement) return []
      return [{
        templateId: template.templateId,
        templateVersion: template.version,
        sectionId: section.id,
        criterionId: criterion.id,
        ruleId: `section-${section.id}-${criterion.id}`,
        title: criterion.title,
        requirement: criterion.requirement,
        targetScope: 'case' as const,
        constraint: { ...c, ownerStatement: c.ownerStatement },
        policyVersionId: `template-owner:${template.templateId}@${template.version}`,
        priority: section.order * 1000 + index + 1,
      }]
    }),
  )
}

/** Minimum-count material requirements for T04/Main to bind to real DocumentVersions. */
export function collectT01RequiredMaterials(template: TemplateVersion): T01PublishedMaterialRequirement[] {
  return template.materialSlots.filter(slot => slot.minCount > 0).map(slot => ({
    templateId: template.templateId,
    templateVersion: template.version,
    slotId: slot.id,
    ...(slot.sectionId ? { sectionId: slot.sectionId } : {}),
    minCount: slot.minCount,
    requiredAt: slot.requiredAt ?? 'submission',
    ...(slot.requiredWhen ? { requiredWhen: slot.requiredWhen } : {}),
  }))
}

/**
 * Imported/model-generated text is untrusted authoring input, never an already
 * authenticated owner-statement. Preserve the numeric clause, but require the
 * local template owner to inspect and confirm it before publication.
 */
export function resetT01ImportedConfirmations(template: TemplateVersion): TemplateVersion {
  return stripT01OwnerStatement(template)
}

/**
 * 作者改了规则含义或所引用字段后，清除旧签认；只改界面顺序不撤销确认。
 * 新确认仍由 confirmT01NumberLimit 显式产生，不能从编辑器输入猜出可信 Actor。
 */
export function reconcileT01OwnerConfirmations(previous: TemplateVersion, next: TemplateVersion): TemplateVersion {
  let changed = false
  const sections = next.sections?.map(section => ({
    ...section,
    criteria: section.criteria.map(criterion => {
      const current = readT01NumberLimit(criterion)
      if (!current?.ownerStatement) return criterion
      const before = previous.sections?.find(item => item.id === section.id)?.criteria.find(item => item.id === criterion.id)
      const former = before && readT01NumberLimit(before)
      const fieldBefore = previous.fields.find(item => item.key === current.fieldKey)
      const fieldAfter = next.fields.find(item => item.key === current.fieldKey)
      const sameField = fieldBefore && fieldAfter &&
        ['label', 'kind', 'scope', 'min', 'max', 'unit'].every(key =>
          fieldBefore[key as keyof FieldSpec] === fieldAfter[key as keyof FieldSpec])
      const sameRule = former && before &&
        before.title === criterion.title && before.requirement === criterion.requirement &&
        before.execution === criterion.execution && before.targetScope === criterion.targetScope &&
        former.kind === current.kind && former.schemaVersion === current.schemaVersion &&
        former.fieldKey === current.fieldKey && former.fieldScope === current.fieldScope &&
        former.operator === current.operator && former.threshold === current.threshold && former.unit === current.unit
      if (sameField && sameRule) return criterion
      changed = true
      return {
        ...criterion,
        deterministicConstraint: { ...current, ownerStatement: undefined },
      } as T01CriterionWithConstraint
    }),
  }))
  return changed ? { ...next, sections } : next
}
