/**
 * F03｜普通 Pi Run 的冻结计划身份与当前性校验。
 *
 * 只读取现有 Template/D2/Case；不新建 Plan/Run 真值账。C0 技术执行
 * 另有权威 RunEvidenceIdentity，不能把普通 Pi Run 冒充成 C0 执行回执。
 */
import { createHash } from 'node:crypto'
import type { CaseAggregateV2, CheckResult, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { getTemplate } from './template-store'
import { compileTemplatePlanForCase } from './review-v3-main-template-plan-bridge'
import { verifyD2InstalledPlan } from './review-d2-runtime'

type Manifest = ReviewRunV2['inputManifest']

const same = (left: unknown, right: unknown): boolean => JSON.stringify(left) === JSON.stringify(right)

/** T04 的运行指纹包括真实 C0 Plan 指纹以及编译后的规则实例集。 */
export function publishedPlanRunFingerprint(fingerprint: string, ruleIds: readonly string[]): string {
  return createHash('sha256').update(fingerprint + '|' + [...ruleIds].sort().join(',')).digest('hex')
}

export function snapshotRunCheckBindings(checks: readonly CheckResult[]): NonNullable<Manifest['plannedCheckBindings']> {
  return checks.map(({ checkId, ruleId, target }) => ({ checkId, ruleId, target: structuredClone(target) }))
}

/** 真实 D2 任务包无 C0 PlanId；已发布模板使用编译器生成的原始 PlanId。 */
export function snapshotFrozenRunPlan(
  aggregate: CaseAggregateV2, template: TemplateVersion,
): { frozenPlan: NonNullable<Manifest['frozenPlan']>; planFingerprint: string } | undefined {
  if (aggregate.canonicalPlan) {
    throw new Error('C0_CANONICAL_RUN_REQUIRED: 已绑定 C0 Plan 的案卷必须走可信技术 Run，普通 Pi Run 不能替代')
  }
  if (aggregate.d2RuntimePlan) {
    const problems = verifyD2InstalledPlan(aggregate)
    if (problems.length) throw new Error('D2_FIXED_PLAN_MISMATCH: ' + problems.join('；'))
    return {
      frozenPlan: { kind: 'd2-technical', fingerprint: aggregate.d2RuntimePlan.fingerprint,
        mapping: structuredClone(aggregate.d2RuntimePlan.mapping) },
      planFingerprint: aggregate.d2RuntimePlan.fingerprint,
    }
  }
  if (template.status !== 'published') return undefined
  const bridge = compileTemplatePlanForCase({ aggregate, template, phase: 'submission' })
  if (!bridge.compiled || bridge.compiled.bindings.length === 0) {
    throw new Error('T04_FROZEN_PLAN_MISSING: 已发布模板未能编译完整检查计划：' +
      bridge.unresolved.map((item) => item.ruleId + '：' + item.reason).join('；'))
  }
  const { plan, bindings } = bridge.compiled
  return {
    frozenPlan: { kind: 'published-template', planId: plan.planId,
      fingerprint: plan.fingerprint, bindings: structuredClone(plan.bindings) },
    planFingerprint: publishedPlanRunFingerprint(plan.fingerprint, bindings.map((item) => item.rule.id)),
  }
}

/**
 * 供续审、Pi 回写、人工处置、决定与报告的现有当前性消费者复用。
 * 返回原因而非静默选取旧成功 Run；旧 run-pi/run-tpl 缺证明时只能历史读取。
 */
export function runPlanBindingBlockers(aggregate: CaseAggregateV2, run: ReviewRunV2): string[] {
  const problems: string[] = []
  if (aggregate.canonicalPlan) return ['C0 已冻结计划只能由可信技术 Run 身份证明，普通 V2 Run 不具备该授权']
  const needsProof = run.id.startsWith('run-pi-') || run.id.startsWith('run-tpl-') || !!aggregate.d2RuntimePlan
  if (!needsProof) return problems // 旧 V1/V2 迁移运行维持原有兼容策略。

  if (run.caseId !== aggregate.caseV2.id || run.templateId !== aggregate.caseV2.templateId ||
      run.templateVersion !== aggregate.caseV2.templateVersion ||
      run.inputManifest.templateVersion !== aggregate.caseV2.templateVersion) {
    problems.push('Run 案卷/模板身份与当前业务案卷不一致')
  }
  const currentDocuments = new Map(aggregate.caseV2.documents.map((item) => [item.versionId, item]))
  const manifestDocuments = run.inputManifest.documentVersions
  if (currentDocuments.size !== aggregate.caseV2.documents.length ||
      new Set(manifestDocuments.map((item) => item.versionId)).size !== manifestDocuments.length ||
      manifestDocuments.length !== currentDocuments.size || manifestDocuments.some((item) => {
        const current = currentDocuments.get(item.versionId)
        return !current || current.documentId !== item.documentId || current.contentHash !== item.contentHash
      })) {
    problems.push('Run 原件版本清单与当前案卷身份不一致')
  }

  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template) return ['当前模板版本不存在']
  let expected: ReturnType<typeof snapshotFrozenRunPlan>
  try {
    expected = snapshotFrozenRunPlan(aggregate, template)
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)]
  }
  if (expected) {
    if (!run.inputManifest.frozenPlan || !same(run.inputManifest.frozenPlan, expected.frozenPlan) ||
        run.inputManifest.planFingerprint !== expected.planFingerprint) {
      problems.push('运行未绑定当前冻结 PlanId/指纹/Check×目标×来源版本')
    }
  } else if (run.inputManifest.frozenPlan) {
    problems.push('当前不存在该运行声称的冻结计划')
  }

  // Pi 写回只能改变 Check 的判断与依据，不得改动冻结的检查身份或对象。
  if (run.id.startsWith('run-pi-')) {
    const frozen = run.inputManifest.plannedCheckBindings
    const actual = snapshotRunCheckBindings(run.checks)
    // Pi 分批提交会把占位 Check 移到结果列表尾部；顺序不是身份。
    const ordered = (entries: NonNullable<Manifest['plannedCheckBindings']>) =>
      [...entries].sort((a, b) => a.checkId.localeCompare(b.checkId))
    if (!frozen || frozen.length === 0 ||
        new Set(frozen.map((item) => item.checkId)).size !== frozen.length ||
        new Set(actual.map((item) => item.checkId)).size !== actual.length ||
        !same(ordered(actual), ordered(frozen))) {
      problems.push('Pi Run 的 Check×目标与创建时冻结的检查清单不一致')
    }
  }

  const sources = new Set(manifestDocuments.map((item) => item.versionId))
  if (run.checks.some((check) => check.sourceRefs.some((ref) =>
    !sources.has(ref.documentVersionId) ||
    currentDocuments.get(ref.documentVersionId)?.active === false))) {
    problems.push('Run 检查引用了不属于本次输入快照的来源版本')
  }
  return problems
}
