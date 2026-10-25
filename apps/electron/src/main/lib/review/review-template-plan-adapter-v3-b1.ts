/**
 * Review V3 Dev-B B1: provenance-preserving, side-effect-free author -> Plan adapter.
 * No CaseAggregate/ReviewRun/Decision writes, no policy authority escalation.
 * C0/1 is the wire contract; the richer immutable descriptor is a Dev-B sidecar.
 */
import { createHash } from 'node:crypto'
import {
  REVIEW_C0_SCHEMA_VERSION, assertC0CanonicalPlan,
  type CanonicalPlan, type PlanApplicability,
} from '@profer/shared'

const id = /^[A-Za-z][A-Za-z0-9._:/-]{0,127}$/
const nonempty = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0
const valid = (value: string): boolean => id.test(value)
const unique = (values: readonly string[]): boolean => values.length === new Set(values).size
const stable = (value: unknown): string => {
  if (value === undefined) return 'null'
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']'
  const record = value as Record<string, unknown>
  return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stable(record[key])).join(',') + '}'
}
const digest = (x: unknown): string => createHash('sha256').update(stable(x), 'utf8').digest('hex')
const reject = (code: string, message: string): never => { throw new Error(code + ': ' + message) }

export type B1FieldType = 'text' | 'number' | 'date' | 'boolean' | 'enum' | 'evidence'
export interface B1Field {
  key: string
  label: string
  type: B1FieldType
  required: boolean
  enumValues?: string[]
  sourceId: string
  subjectScoped?: boolean
}
export type B1Condition =
  | { kind: 'always' }
  | { kind: 'field-equals'; fieldKey: string; equals: string | number | boolean }
export interface B1Obligation {
  checkKey: string
  requirement: string
  sourceIds: string[]
  targetKeys: string[]
  condition: B1Condition
  /** Never infer approval from this string. */
  responsibility: string
}
export interface B1Module {
  moduleId: string
  version: string
  dependsOn: string[]
  checks: B1Obligation[]
}
export interface B1Source {
  sourceId: string
  kind: 'user-declared' | 'policy-candidate'
  documentVersionId: string
  locator: string
  /** Provenance is not a school publication signature. */
  recordedBy: string
}
export interface B1Target {
  targetKey: string
  objectKey: string
  subjectId: string
  scenario: string
  /** Values are confirmed inputs; missing/undefined means unknown. */
  fieldValues: Record<string, string | number | boolean | null>
}
export interface B1AuthorDocument {
  schemaVersion: 'review-b1/1'
  templateId: string
  templateVersion: string
  name: string
  purpose: string
  fields: B1Field[]
  sources: B1Source[]
  targets: B1Target[]
  modules: B1Module[]
  stages: Array<{ stageId: string; role: string; mode: 'manual' | 'technical' }>
  outputs: Array<{ outputId: string; kind: string }>
  /** A candidate can be compiled and previewed but not published by this code. */
  status: 'candidate-held'
}
export interface B1BindingDetails {
  checkKey: string
  targetKey: string
  objectKey: string
  subjectId: string
  responsibility: string
  requirement: string
  sourceIds: string[]
  sourceVersionIds: string[]
  condition: B1Condition
  applicability: PlanApplicability
}
export interface ImmutablePlanDescriptorB1 {
  descriptorVersion: 'review-b1/1'
  publicationAllowed: false
  authorDigest: string
  canonicalPlan: CanonicalPlan
  sourceLedger: B1Source[]
  bindingDetails: B1BindingDetails[]
  fieldDefinitions: B1Field[]
  stages: B1AuthorDocument['stages']
  outputs: B1AuthorDocument['outputs']
}

function moduleOrder(modules: readonly B1Module[]): B1Module[] {
  const map = new Map(modules.map((m) => [m.moduleId, m]))
  if (map.size !== modules.length) reject('B1_DUPLICATE_MODULE', 'Repeated module ID')
  const state = new Map<string, number>()
  const ordered: B1Module[] = []
  const visit = (name: string): void => {
    if (!map.has(name)) reject('B1_DEPENDENCY_MISSING', name)
    if (state.get(name) === 1) reject('B1_DEPENDENCY_CYCLE', name)
    if (state.get(name) === 2) return
    state.set(name, 1)
    const module = map.get(name)!
    if (!valid(module.moduleId) || !nonempty(module.version) || !Array.isArray(module.dependsOn) ||
        !unique(module.dependsOn)) reject('B1_MODULE_INVALID', name)
    for (const dep of [...module.dependsOn].sort()) visit(dep)
    state.set(name, 2)
    ordered.push(module)
  }
  for (const name of [...map.keys()].sort()) visit(name)
  return ordered
}

export function evaluateB1Condition(
  condition: B1Condition, fields: Readonly<Record<string, string | number | boolean | null>>,
): PlanApplicability {
  if (condition.kind === 'always') return 'applicable'
  if (condition.kind !== 'field-equals') reject('B1_CONDITION_UNSUPPORTED', 'Unknown condition')
  if (!nonempty(condition.fieldKey) || !(['string', 'number', 'boolean'].includes(typeof condition.equals))) {
    reject('B1_CONDITION_INVALID', 'Condition key/value incomplete')
  }
  const actual = fields[condition.fieldKey]
  if (actual === undefined || actual === null || actual === '') return 'unknown'
  return actual === condition.equals ? 'applicable' : 'not-applicable'
}

/** Fail closed on omissions, mismatched provenance or unsupported DSL. */
export function compileReviewB1Plan(author: B1AuthorDocument): ImmutablePlanDescriptorB1 {
  if (!author || author.schemaVersion !== 'review-b1/1' || author.status !== 'candidate-held' ||
      !valid(author.templateId) || !nonempty(author.templateVersion) ||
      !nonempty(author.name) || !nonempty(author.purpose) ||
      !Array.isArray(author.modules) || !author.modules.length ||
      !Array.isArray(author.targets) || !author.targets.length ||
      !Array.isArray(author.sources) || !author.sources.length ||
      !Array.isArray(author.fields) || !Array.isArray(author.stages) || !author.stages.length ||
      !Array.isArray(author.outputs) || !author.outputs.length) {
    reject('B1_AUTHOR_INVALID', 'Incomplete author declaration, status or structure')
  }
  if (author.stages.some((s) => !valid(s.stageId) || !nonempty(s.role) || !['manual','technical'].includes(s.mode)) ||
      !unique(author.stages.map((s) => s.stageId)) ||
      author.outputs.some((o) => !valid(o.outputId) || !nonempty(o.kind)) ||
      !unique(author.outputs.map((o) => o.outputId))) reject('B1_WORKFLOW_INVALID', 'Stage/output invalid')
  const sourceMap = new Map(author.sources.map((s) => [s.sourceId, s]))
  if (sourceMap.size !== author.sources.length || author.sources.some((s) =>
    !valid(s.sourceId) || !nonempty(s.documentVersionId) || !nonempty(s.locator) ||
    !nonempty(s.recordedBy) || !['user-declared','policy-candidate'].includes(s.kind)
  )) reject('B1_SOURCE_INVALID', 'Untraceable/duplicate source')
  const fieldMap = new Map(author.fields.map((f) => [f.key, f]))
  if (fieldMap.size !== author.fields.length || author.fields.some((f) =>
    !valid(f.key) || !nonempty(f.label) || !sourceMap.has(f.sourceId) ||
    !['text','number','date','boolean','enum','evidence'].includes(f.type) || typeof f.required !== 'boolean' ||
    (f.type === 'enum' && (!f.enumValues?.length || !unique(f.enumValues))) ||
    (f.type !== 'enum' && f.enumValues !== undefined)
  )) reject('B1_FIELD_INVALID', 'Field/source/type unsupported')
  // An author cannot simulate a provenance-backed evidence slot as a user-entered
  // string. Real evidence conditions are resolved only by the later trusted
  // MaterialCandidate + SourceIdentity consumer. Missing => unknown, not PASS.
  const matchesFieldType = (field: B1Field, value: string | number | boolean | null): boolean => {
    if (value === null) return true
    switch (field.type) {
      case 'text': return typeof value === 'string'
      case 'date': return typeof value === 'string' &&
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) &&
        !Number.isNaN(Date.parse(value + 'T00:00:00Z')) &&
        new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value
      case 'enum': return typeof value === 'string' && Boolean(field.enumValues?.includes(value))
      case 'number': return typeof value === 'number' && Number.isFinite(value)
      case 'boolean': return typeof value === 'boolean'
      case 'evidence': return false
    }
    return false
  }
  const targetMap = new Map(author.targets.map((t) => [t.targetKey, t]))
  if (targetMap.size !== author.targets.length || !unique(author.targets.map((t) => t.objectKey)) ||
      !unique(author.targets.map((t) => t.subjectId)) ||
      author.targets.some((t) => !valid(t.targetKey) || !nonempty(t.objectKey) ||
        !valid(t.subjectId) || !nonempty(t.scenario) || !t.fieldValues ||
        Object.entries(t.fieldValues).some(([key,value]) => {
          const field = fieldMap.get(key)
          return !field || !matchesFieldType(field, value)
        })
      )) reject('B1_TARGET_INVALID', 'Duplicate/unsupported object or Subject')
  const ordered = moduleOrder(author.modules)
  const details: B1BindingDetails[] = []
  const used = new Set<string>()
  const keys = new Set<string>()
  for (const module of ordered) {
    if (!Array.isArray(module.checks) || !module.checks.length) reject('B1_MODULE_EMPTY', module.moduleId)
    for (const check of module.checks) {
      if (!valid(check.checkKey) || !nonempty(check.requirement) || !nonempty(check.responsibility) ||
          !Array.isArray(check.sourceIds) || !check.sourceIds.length || !unique(check.sourceIds) ||
          !check.sourceIds.every((sourceId) => sourceMap.has(sourceId)) ||
          !Array.isArray(check.targetKeys) || !check.targetKeys.length || !unique(check.targetKeys) ||
          !check.condition || !['always','field-equals'].includes(check.condition.kind)) {
        reject('B1_OBLIGATION_INVALID', String(check.checkKey))
      }
      if (keys.has(check.checkKey)) reject('B1_CHECK_COLLISION', check.checkKey)
      keys.add(check.checkKey)
      if (check.condition.kind === 'field-equals') {
        const field = fieldMap.get(check.condition.fieldKey)
        if (!field) throw new Error('B1_CONDITION_SOURCE_MISSING: '+check.checkKey)
        if (field.type === 'evidence' || !matchesFieldType(field, check.condition.equals)) {
          reject('B1_CONDITION_TYPE_MISMATCH', check.checkKey)
        }
      }
      const sourceVersionIds = check.sourceIds.map((sourceId) => sourceMap.get(sourceId)!.documentVersionId)
      for (const targetKey of check.targetKeys) {
        const target = targetMap.get(targetKey)
        if (!target) throw new Error('B1_TARGET_NOT_FOUND: ' + targetKey)
        used.add(targetKey)
        details.push({
          checkKey: check.checkKey, targetKey, objectKey: target.objectKey,
          subjectId: target.subjectId, responsibility: check.responsibility,
          requirement: check.requirement, sourceIds: [...check.sourceIds],
          sourceVersionIds: [...sourceVersionIds], condition: structuredClone(check.condition),
          applicability: evaluateB1Condition(check.condition, target.fieldValues),
        })
      }
    }
  }
  if (used.size !== author.targets.length) reject('B1_UNUSED_TARGET', 'Unmapped target would disappear')
  // Module source, dependency edges, and check content are all fingerprinted.
  const moduleDigests = ordered.map((module) => digest(module))
  const authorDigest = digest(author)
  const planSeed = { authorDigest, moduleDigests, details }
  const fingerprint = digest(planSeed)
  const canonicalPlan: CanonicalPlan = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION,
    planId: 'plan-' + fingerprint.slice(0, 28),
    fingerprint, templateId: author.templateId, templateVersion: author.templateVersion,
    moduleDigests,
    bindings: details.map((binding) => ({
      checkKey: binding.checkKey, targetKey: binding.targetKey, objectKey: binding.objectKey,
      subjectId: binding.subjectId, applicability: binding.applicability,
      sourceVersionIds: [...binding.sourceVersionIds],
      conditionFingerprint: digest({
        condition: binding.condition,
        fields: targetMap.get(binding.targetKey)!.fieldValues,
        sourceVersionIds: binding.sourceVersionIds,
      }),
    })),
  }
  assertC0CanonicalPlan(canonicalPlan)
  return {
    descriptorVersion: 'review-b1/1', publicationAllowed: false, authorDigest,
    canonicalPlan, bindingDetails: details, sourceLedger: structuredClone(author.sources),
    fieldDefinitions: structuredClone(author.fields), stages: structuredClone(author.stages),
    outputs: structuredClone(author.outputs),
  }
}

export interface B1PlanDiff {
  added: string[]
  removed: string[]
  changed: string[]
  requiresAck: string[]
  oldFingerprint: string
  nextFingerprint: string
}
const bindingKey = (x: { checkKey: string; targetKey: string }): string => x.checkKey + '::' + x.targetKey
export function diffReviewB1Plans(previous: ImmutablePlanDescriptorB1, next: ImmutablePlanDescriptorB1): B1PlanDiff {
  if (previous.canonicalPlan.templateId !== next.canonicalPlan.templateId) {
    reject('B1_TEMPLATE_MISMATCH', 'Cannot upgrade across templateId')
  }
  const before = new Map(previous.canonicalPlan.bindings.map((v) => [bindingKey(v), digest(v)]))
  const after = new Map(next.canonicalPlan.bindings.map((v) => [bindingKey(v), digest(v)]))
  return {
    added: [...after.keys()].filter((x) => !before.has(x)).sort(),
    removed: [...before.keys()].filter((x) => !after.has(x)).sort(),
    changed: [...before.keys()].filter((x) => after.has(x) && before.get(x) !== after.get(x)).sort(),
    requiresAck: [...before.keys()].filter((x) => !after.has(x)).sort(),
    oldFingerprint: previous.canonicalPlan.fingerprint,
    nextFingerprint: next.canonicalPlan.fingerprint,
  }
}
/** ACK is checked by Dev-B preview; Dev-C still owns authorized InstallPlan CAS. */
export function requireReviewB1UpgradeAck(
  previous: ImmutablePlanDescriptorB1,
  next: ImmutablePlanDescriptorB1,
  acknowledgedRemovedBindingKeys: readonly string[],
): B1PlanDiff {
  const changes = diffReviewB1Plans(previous, next)
  if (!unique(acknowledgedRemovedBindingKeys) ||
      changes.requiresAck.some((key) => !acknowledgedRemovedBindingKeys.includes(key))) {
    reject('B1_DELETED_CHECK_ACK_REQUIRED', changes.requiresAck.join(', '))
  }
  return changes
}
export function verifyReviewB1Descriptor(
  author: B1AuthorDocument, descriptor: ImmutablePlanDescriptorB1,
): void {
  const expected = compileReviewB1Plan(author)
  if (stable(expected) !== stable(descriptor)) reject('B1_FROZEN_DIGEST_MISMATCH', 'Author, source, module or Plan was modified')
}
/** P06 scenarios cannot be converted by guessing a new target or dropping obligations. */
export function adaptLegacyP06Plan(raw: unknown): never {
  throw new Error('UNSUPPORTED_PLAN_MAPPING: Legacy P06 archive/scenario has no proved lossless C0 multi-target mapping; preserve original bytes: ' + digest(raw))
}
