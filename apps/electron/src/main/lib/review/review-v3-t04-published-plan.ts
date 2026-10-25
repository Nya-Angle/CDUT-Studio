/**
 * T04 R01: pure published-template -> frozen C0 Plan + explicit Rule/Operation ledger.
 *
 * The caller (trusted Main) verifies the actual published TemplateVersion,
 * policy provenance, material versions and confirmed observations. Nothing
 * here can publish a template, invent sources or write a Case/Run/Decision.
 */
import { createHash } from 'node:crypto'
import {
  REVIEW_C0_SCHEMA_VERSION, assertC0CanonicalPlan,
  type CanonicalPlan, type PlanBinding, type RuleSpec, type TemplateVersion,
} from '@profer/shared'
import {
  compileT04Operation, conditionT04,
  type T04Item, type T04Operation, type T04PlanCheck, type T04Value,
} from './review-v3-t04-rules-scoring'

const materialField = (slotId: string): string => '__t04_material_count__:' + slotId
const nonempty = (v: string): boolean => typeof v === 'string' && v.trim().length > 0
const canonical = (v: unknown): string => {
  if (v === undefined || v === null) return 'null'
  if (typeof v !== 'object') return JSON.stringify(v)
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']'
  const record = v as Record<string, unknown>
  return '{' + Object.keys(record).sort().map(k => JSON.stringify(k) + ':' + canonical(record[k])).join(',') + '}'
}
const digest = (v: unknown): string => createHash('sha256').update(canonical(v), 'utf8').digest('hex')
const reject = (message: string): never => { throw new Error('T04_PUBLISHED_PLAN_INVALID: ' + message) }
const identity = (policyVersionId: string, ruleId: string): string => JSON.stringify([policyVersionId, ruleId])

/**
 * A T01/owner-confirmed typed constraint from the immutable published ledger.
 * This is NOT derived from FieldSpec.max or unstructured requirement text.
 * Main must authenticate and bind this descriptor to the published version.
 */
export type T04PublishedConstraint = {
  templateId: string
  templateVersion: number
  ruleId: string
  policyVersionId: string
  confirmedBy: string
  confirmedAt: string
  /** Same logical policy limit across versions; T04 conflict resolution requires a named decision. */
  claimKey?: string
  constraint:
    | { kind: 'field-maximum'; fieldKey: string; maximum: string; unit?: string }
    | { kind: 'field-minimum'; fieldKey: string; minimum: string; unit?: string }
}

/** Main-verified case/subject snapshot. Absence is NOT zero or a missing file. */
export type T04PublishedTarget = {
  scope: 'case' | 'subject' | 'group'
  targetKey: string
  objectKey: string
  subjectId: string
  fields: Record<string, T04Value>
  /** Current valid DocumentVersion ids; no policy or source strings inserted here. */
  sourceVersionIds: string[]
  /** Explicit empty + confirmed means Main established a missing required slot. */
  materialSlots: Record<string, { documentVersionIds: string[]; confirmed: boolean }>
}

export type T04PublishedPlanInput = {
  template: TemplateVersion
  effectiveRules: RuleSpec[]
  /** Immutable, explicitly approved clause ledger supplied by T01/owner. */
  constraints: T04PublishedConstraint[]
  targets: T04PublishedTarget[]
  phase: 'submission' | 'decision'
  /**
   * 业务判断日（YYYY-MM-DD），由调用方显式给出并封进 Plan 指纹。
   * 绝不从机器时钟推导；缺省时带有效期规则由 T04 保持 pending。
   */
  asOfDate?: string
}

export type T04PublishedRuleBinding = {
  binding: PlanBinding
  rule: RuleSpec
  operation: T04Operation
  policyVersionId: string
}
export type T04PublishedPlanOutput = {
  plan: CanonicalPlan
  bindings: T04PublishedRuleBinding[]
  /** Ready-to-evaluate proposals. Main must verify target/source membership. */
  checks: T04PlanCheck[]
  bindingLedgerHash: string
}

function materialRule(template: TemplateVersion, slot: TemplateVersion['materialSlots'][number], rank: number): RuleSpec {
  return {
    id: 'required-material-' + slot.id,
    policyVersionId: 'template:' + template.templateId + '@' + template.version,
    title: slot.name + '：必交材料',
    when: slot.requiredWhen ?? { all: [] },
    requirement: '至少提交 ' + slot.minCount + ' 份有效的' + slot.name,
    targetScope: 'case',
    execution: 'deterministic',
    onFail: 'supplement',
    onUnknown: 'needs-confirmation',
    sourceRefIds: [],
    priority: 1000000 + rank,
    confirmation: 'confirmed',
  }
}

/**
 * Material and policy checks are all represented; uncompiled/semantic rules
 * stay awaiting-confirmation. C0 fingerprint seals the complete rule ledger,
 * chosen operations, target values, condition, versions and material receipt.
 */
export function compilePublishedTemplateReviewPlan(input: T04PublishedPlanInput): T04PublishedPlanOutput {
  const { template, effectiveRules, constraints, targets, phase, asOfDate } = input
  if (template.status !== 'published' || !nonempty(template.templateId) ||
      !Number.isSafeInteger(template.version) || template.version < 1 ||
      !targets.length || !['submission', 'decision'].includes(phase)) {
    return reject('Published template, phase and at least one target are required')
  }
  // 判断日必须是显式合法日期；不接受时间戳、相对日期或机器时间兜底。
  if (asOfDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(asOfDate))
    return reject('asOfDate must be an explicit YYYY-MM-DD business date')
  const fieldDefinitions = new Map(template.fields.map(f => [f.key, f]))
  if (fieldDefinitions.size !== template.fields.length ||
      template.fields.some(f => !nonempty(f.key) || f.key.startsWith('__t04_material_count__:')))
    return reject('Invalid or reserved template field')
  const slots = new Map(template.materialSlots.map(s => [s.id, s]))
  if (slots.size !== template.materialSlots.length || template.materialSlots.some(s =>
      !nonempty(s.id) || !Number.isSafeInteger(s.minCount) || s.minCount < 0))
    return reject('Invalid material slot')
  const rules = [...effectiveRules]
  for (const [i, slot] of template.materialSlots.entries())
    if (slot.minCount > 0) rules.push(materialRule(template, slot, i))
  const ruleByIdentity = new Map(rules.map(r => [identity(r.policyVersionId, r.id), r]))
  if (ruleByIdentity.size !== rules.length ||
      rules.some(r => !nonempty(r.id) || !nonempty(r.policyVersionId)))
    return reject('Missing or duplicated effective rule identity')

  const typed = new Map<string, T04PublishedConstraint>()
  for (const c of constraints) {
    const key = identity(c.policyVersionId, c.ruleId)
    const rule = ruleByIdentity.get(key)
    if (typed.has(key) || c.templateId !== template.templateId || c.templateVersion !== template.version ||
        !nonempty(c.confirmedBy) || !nonempty(c.confirmedAt) ||
        (c.claimKey !== undefined && !nonempty(c.claimKey)) || !rule ||
        rule.execution !== 'deterministic' || rule.confirmation !== 'confirmed' ||
        !['field-maximum', 'field-minimum'].includes(c.constraint.kind))
      return reject('Confirmed typed constraint must match a deterministic published RuleSpec: ' + key)
    const f = fieldDefinitions.get(c.constraint.fieldKey)
    if (!f || f.kind !== 'number' || f.scope && f.scope !== rule.targetScope ||
        !/^-?\d+(?:\.\d{1,6})?$/.test(c.constraint.kind === 'field-maximum' ? c.constraint.maximum : c.constraint.minimum) ||
        (c.constraint.unit && f.unit && c.constraint.unit !== f.unit))
      return reject('Field maximum has incompatible field, scope, numeric value or unit: ' + key)
    typed.set(key, c)
  }

  const targetKeys = new Set<string>()
  for (const target of targets) {
    const key = JSON.stringify([target.targetKey, target.objectKey, target.subjectId])
    if (targetKeys.has(key) || !nonempty(target.targetKey) || !nonempty(target.objectKey) ||
        !nonempty(target.subjectId) || !['case', 'group', 'subject'].includes(target.scope) ||
        new Set(target.sourceVersionIds).size !== target.sourceVersionIds.length ||
        target.sourceVersionIds.some(id => !nonempty(id)) ||
        Object.keys(target.fields).some(f => f.startsWith('__t04_material_count__:')))
      return reject('Missing/duplicate target identity, forged reserved field or invalid source version')
    targetKeys.add(key)
    for (const [slotId, state] of Object.entries(target.materialSlots)) {
      if (!slots.has(slotId) || !Array.isArray(state.documentVersionIds) ||
          new Set(state.documentVersionIds).size !== state.documentVersionIds.length ||
          state.documentVersionIds.some(id => !nonempty(id)) || typeof state.confirmed !== 'boolean')
        return reject('Unverified material slot snapshot: ' + slotId)
      if (state.documentVersionIds.some(id => !target.sourceVersionIds.includes(id)))
        return reject('Material version not in target source-version manifest: ' + slotId)
    }
  }

  const bindings: T04PublishedRuleBinding[] = []
  const checks: T04PlanCheck[] = []
  const planBindings: PlanBinding[] = []
  for (const rule of rules.sort((a,b) =>
    a.priority - b.priority || identity(a.policyVersionId,a.id).localeCompare(identity(b.policyVersionId,b.id)))) {
    const materialSlotId = rule.id.startsWith('required-material-') &&
      rule.policyVersionId === 'template:' + template.templateId + '@' + template.version
      ? rule.id.slice('required-material-'.length) : null
    const constraint = typed.get(identity(rule.policyVersionId, rule.id))
    const operation: T04Operation = materialSlotId !== null && slots.has(materialSlotId)
      ? { kind: 'material-min-count', field: materialField(materialSlotId), minimum: slots.get(materialSlotId)!.minCount }
      : constraint
        ? constraint.constraint.kind === 'field-minimum'
          ? { kind: 'value-minimum', field: constraint.constraint.fieldKey, minimum: constraint.constraint.minimum,
              ...(constraint.constraint.unit ? { unit:constraint.constraint.unit } : {}) }
          : { kind: 'value-limit', field: constraint.constraint.fieldKey, maximum: constraint.constraint.maximum,
              ...(constraint.constraint.unit ? { unit:constraint.constraint.unit } : {}) }
        : compileT04Operation(rule)
    const selected = targets.filter(t => t.scope === rule.targetScope)
    if (!selected.length) return reject('Rule has no matching target scope: ' + rule.id)
    for (const target of selected) {
      const fieldValues: Record<string, T04Value> = {...target.fields}
      for (const slot of template.materialSlots) {
        const state = target.materialSlots[slot.id]
        fieldValues[materialField(slot.id)] = {
          value: state ? state.documentVersionIds.length : null,
          confirmed: state?.confirmed ?? false,
        }
      }
      const item: T04Item = { id:target.subjectId, fields:fieldValues }
      const applicability = conditionT04(rule.when, item)
      const binding: PlanBinding = {
        checkKey: 't04-' + digest(identity(rule.policyVersionId,rule.id)).slice(0,24),
        targetKey:target.targetKey,
        objectKey:target.objectKey,
        subjectId:target.subjectId,
        applicability: applicability === 'true' ? 'applicable' : applicability === 'false' ? 'not-applicable' : 'unknown',
        sourceVersionIds: [...target.sourceVersionIds].sort(),
        conditionFingerprint: digest({when:rule.when,fields:fieldValues,phase,
          sourceVersionIds:[...target.sourceVersionIds].sort()}),
      }
      // A decision-phase slot is not yet required at submission; it must be
      // checked again on a fresh snapshot at decision time.
      if (materialSlotId && slots.get(materialSlotId)?.requiredAt === 'decision' && phase === 'submission')
        binding.applicability = 'not-applicable'
      planBindings.push(binding)
      bindings.push({binding,rule,operation,policyVersionId:rule.policyVersionId})
      checks.push({binding,rule,operation,items:[item],
        ...(constraint?.claimKey ? {policyClaimKey:constraint.claimKey} : {}),
        ...(asOfDate ? {asOfDate} : {})})
    }
  }
  const bindingLedgerHash = digest(bindings.map(x=>({
    binding:x.binding,rule:x.rule,operation:x.operation,policyVersionId:x.policyVersionId,
  })))
  const moduleDigests = [
    digest({template}),
    digest({rules, typedConstraints:constraints, bindingLedgerHash}),
  ]
  const fingerprint = digest({schemaVersion:REVIEW_C0_SCHEMA_VERSION,templateId:template.templateId,
    templateVersion:String(template.version),moduleDigests,bindingLedgerHash,phase,
    ...(asOfDate ? {asOfDate} : {})})
  const plan: CanonicalPlan = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    planId:'plan-' + fingerprint.slice(0,28),
    fingerprint,
    templateId:template.templateId,
    templateVersion:String(template.version),
    moduleDigests,
    bindings:planBindings,
  }
  assertC0CanonicalPlan(plan)
  return {plan,bindings,checks,bindingLedgerHash}
}
