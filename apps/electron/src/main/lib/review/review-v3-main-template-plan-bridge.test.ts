/**
 * A15 S2 的四案例：已发布模板的负责人确认数值规则 → T04 可执行计划 → CheckResult。
 *
 * 18 → compliant、21 → non-compliant、未知 → pending、缺材料 → 待补件。
 * 全部来自同一个 RuleSpec + 同一个编译器，不特判「实验室」。
 */
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 's2bridge-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { saveDraft, publishTemplate } = await import('./template-store')
const { adaptT01ConstraintsToT04, compileTemplatePlanForCase } = await import('./review-v3-main-template-plan-bridge')
const { evaluateT04Plan } = await import('./review-v3-t04-rules-scoring')
const { resolveEffectiveRules } = await import('./effective-rules')

const templateId = 'a15-s2-lab'
const owner = { kind: 'owner-statement' as const, text: '本机负责人确认：人数不超过 20', enteredBy: 'local-organizer', enteredAt: '2026-10-21T00:00:00Z' }

function buildTemplate(): TemplateVersion {
  return {
    templateId, version: 1, schemaVersion: 2, name: '实验室使用申请（S2）',
    objectType: 'organization', displayName: { template: '{{organizationName}} 申请' },
    status: 'draft', createdAt: '',
    fields: [
      { key: 'organizationName', label: '组织名称', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'applicantCount', label: '使用人数', kind: 'number', required: true, visibility: 'public', scope: 'case' },
    ],
    sections: [{
      id: 'lab', name: '实验室使用', order: 0, required: true,
      criteria: [{
        id: 'headcount', title: '人数不超上限', requirement: '使用人数不得超过 20 人',
        execution: 'deterministic', targetScope: 'case',
        deterministicConstraint: {
          schemaVersion: 1, kind: 'field-number-limit', fieldKey: 'applicantCount',
          fieldScope: 'case', operator: 'lte', threshold: 20, unit: '人', ownerStatement: owner,
        },
      }],
    }],
    materialSlots: [{ id: 'lab-use-plan', name: '实验室使用计划书', minCount: 1, requiredAt: 'submission' }],
    policyVersionIds: [], policyRefs: [], outputs: [],
    stages: [
      { id: 'initial-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review' },
      { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher' },
    ],
  } as unknown as TemplateVersion
}

function caseWith(count: number | null, withPlan: boolean, confirmed = true): CaseAggregateV2 {
  const documents = withPlan
    ? [{ documentId: 'doc-1', versionId: 'ver-1', fileName: 'lab.docx', role: 'evidence',
      materialSlotId: 'lab-use-plan', active: true, parseStatus: 'parsed', parseRevision: 1, byteHash: 'h' }]
    : []
  // 只有人工确认的 Observation 才是已核实事实；申报表单值本身不算。
  const observations = count !== null && confirmed
    ? [{ id: 'obs-count', subjectId: 'case-s2', fieldKey: 'applicantCount',
        value: { kind: 'number', value: count },
        sourceRefs: [{ caseId: 'case-s2', documentVersionId: 'ver-1', parseRevision: 1, location: { kind: 'file' } }],
        extractedBy: 'user' as const, confirmed: true, createdAt: '2026-10-21T00:00:00Z' }]
    : []
  return {
    caseV2: {
      id: 'case-s2', revision: 3, templateId, templateVersion: 1, stage: 'submitted',
      caseFields: count === null ? {} : {
        applicantCount: { kind: 'number', value: count },
        organizationName: { kind: 'text', value: '地球物理学院' },
      },
      documents, subjects: [],
    },
    tasks: [], decisions: [], supplements: [], dispositions: [], receiptLog: [],
    observations, evidenceLinks: [],
  } as unknown as CaseAggregateV2
}

beforeAll(() => {
  saveDraft(buildTemplate())
  publishTemplate(templateId, 1)
})

function checksFor(count: number | null, withPlan = true, confirmed = true, asOfDate?: string) {
  const published = buildTemplate()
  published.status = 'published'
  const aggregate = caseWith(count, withPlan, confirmed)
  const result = compileTemplatePlanForCase({ aggregate, template: published, ...(asOfDate ? { asOfDate } : {}) })
  if (!result.compiled) throw new Error('编译失败：' + result.unresolved.map((u) => u.reason).join('；'))
  return { result, proposals: evaluateT04Plan(result.compiled.plan, result.compiled.checks) }
}

describe('A15 S2 四案例', () => {
  test('18 人 → 人数检查 compliant', () => {
    const { proposals } = checksFor(18)
    const headcount = proposals.find((item) => item.ruleId.includes('headcount'))!
    expect(headcount.outcome.status).toBe('compliant')
  })

  test('21 人 → 人数检查 non-compliant（不被表单拦截，走规则判定）', () => {
    const { proposals } = checksFor(21)
    const headcount = proposals.find((item) => item.ruleId.includes('headcount'))!
    expect(headcount.outcome.status).toBe('non-compliant')
  })

  test('RUN-34：仅有申报值、无人工作为事实确认 → pending，不得直接 compliant', () => {
    const { proposals } = checksFor(18, true, false)
    const headcount = proposals.find((item) => item.ruleId.includes('headcount'))!
    expect(headcount.outcome.status).toBe('awaiting-confirmation')
  })

  test('人数未知 → pending，不当作 0', () => {
    const { proposals } = checksFor(null)
    const headcount = proposals.find((item) => item.ruleId.includes('headcount'))!
    expect(['awaiting-confirmation', 'not-applicable']).toContain(headcount.outcome.status)
    expect(headcount.outcome.status).not.toBe('compliant')
  })

  test('缺计划书 → 材料检查非 compliant 且不虚构来源', () => {
    const { proposals } = checksFor(18, false)
    const material = proposals.find((item) => item.ruleId.includes('required-material'))!
    expect(material.outcome.status).not.toBe('compliant')
    expect(material.sourceVersionIds.length).toBe(0)
  })


  test('RUN-33：subject/group 规则有真实目标，不再因只有 case 目标而编译失败', () => {
    const template = buildTemplate()
    template.status = 'published'
    const criteria = template.sections![0]!.criteria
    criteria.push({
      id: 'subject-rule', title: '主体规则', requirement: '主体字段需核对',
      execution: 'deterministic', targetScope: 'subject', when: { all: [] },
      sourceRefIds: [], priority: 10, onFail: 'supplement', onUnknown: 'needs-confirmation',
      confirmation: 'confirmed',
    } as unknown as (typeof criteria)[number])
    criteria.push({
      id: 'group-rule', title: '分项规则', requirement: '分项需核对',
      execution: 'deterministic', targetScope: 'group', when: { all: [] },
      sourceRefIds: [], priority: 11, onFail: 'supplement', onUnknown: 'needs-confirmation',
      confirmation: 'confirmed',
    } as unknown as (typeof criteria)[number])
    const aggregate = caseWith(18, true)
    ;(aggregate.caseV2.subjects as unknown[]).push({
      id: 'subj-1', type: 'item', title: '事项一', sectionId: 'lab',
      fields: { applicantCount: { kind: 'number', value: 18 } }, sourceRefs: [],
      correction: 'user-confirmed', status: 'confirmed',
    })
    const result = compileTemplatePlanForCase({ aggregate, template })
    expect(result.unresolved).toHaveLength(0)
    expect(result.compiled).toBeDefined()
    const scopes = new Set(result.compiled!.plan.bindings.map((binding) => binding.targetKey.split(':')[0]))
    expect([...scopes].sort()).toEqual(['case', 'group', 'subject'])
  })

  test('RUN-37：asOfDate 显式封进检查与计划指纹，缺省不偷用机器时间', () => {
    const withDate = checksFor(18, true, true, '2026-10-21')
    expect(withDate.result.compiled!.checks.every((check) => check.asOfDate === '2026-10-21')).toBeTrue()
    const without = checksFor(18, true, true)
    expect(without.result.compiled!.checks.every((check) => check.asOfDate === undefined)).toBeTrue()
    expect(withDate.result.compiled!.plan.fingerprint).not.toBe(without.result.compiled!.plan.fingerprint)
  })

  test('RUN-40：审核员忽略的原件不进入材料槽计数与来源清单', () => {
    const template = buildTemplate()
    template.status = 'published'
    const aggregate = caseWith(18, true)
    ;(aggregate.caseV2.documents[0] as unknown as { unusedReason: string }).unusedReason = '[审核员忽略] 重复上传'
    const result = compileTemplatePlanForCase({ aggregate, template })
    const caseTarget = result.compiled!.plan.bindings.find((binding) => binding.targetKey.startsWith('case:'))!
    expect(caseTarget.sourceVersionIds).toEqual([])
    const material = evaluateT04Plan(result.compiled!.plan, result.compiled!.checks)
      .find((item) => item.ruleId.includes('required-material'))!
    expect(material.outcome.status).not.toBe('compliant')
  })

  test('gte 下限规则编译为 field-minimum，不能误用上限算子', () => {
    const template = buildTemplate()
    ;(template.sections![0]!.criteria[0] as unknown as { deterministicConstraint: { operator: string } })
      .deterministicConstraint.operator = 'gte'
    const aggregate = caseWith(18, true)
    const effective = resolveEffectiveRules(aggregate, template).map((entry) => entry.rule)
    const { constraints, unresolved } = adaptT01ConstraintsToT04(template, effective)
    expect(constraints).toHaveLength(1)
    expect(constraints[0]?.constraint).toMatchObject({ kind: 'field-minimum', fieldKey: 'applicantCount', minimum: '20' })
    expect(unresolved).toHaveLength(0)
  })

  test('真实 T01 编辑器 owner-statement 能编译并保留签认来源', () => {
    const template = buildTemplate()
    template.status = 'published'
    const typed = template.sections![0]!.criteria[0] as unknown as {
      deterministicConstraint: { ownerStatement: unknown }
    }
    typed.deterministicConstraint.ownerStatement = {
      kind: 'owner-statement', text: '负责人确认人数上限为 20 人',
      enteredBy: 'local-organizer', enteredAt: '2026-10-21T00:00:00Z',
    }
    const result = compileTemplatePlanForCase({ aggregate: caseWith(18, true), template })
    expect(result.unresolved).toHaveLength(0)
    expect(result.constraints[0]?.confirmedBy).toBe('local-organizer')
    expect(result.compiled).toBeDefined()
  })

  test('未确认的约束不进入正式计划', () => {
    const template = buildTemplate()
    delete (template.sections![0]!.criteria[0] as unknown as { deterministicConstraint: { ownerStatement?: unknown } })
      .deterministicConstraint.ownerStatement
    const aggregate = caseWith(18, true)
    const effective = resolveEffectiveRules(aggregate, template).map((entry) => entry.rule)
    const { constraints, unresolved } = adaptT01ConstraintsToT04(template, effective)
    expect(constraints).toHaveLength(0)
    expect(unresolved[0]?.reason).toContain('尚未确认')
  })
})
