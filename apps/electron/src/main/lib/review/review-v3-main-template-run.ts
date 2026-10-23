/**
 * 已发布模板计划的正式安装与 Run 写入（ARCH-CLOSURE-R01 D1 / §4.3）。
 *
 * 只做 Main 该做的事：
 * 1. 从**真实已发布** TemplateVersion 与案卷已确认字段编译冻结计划；
 * 2. 用 T04 既有 `evaluateT04Plan` 得出确定性结论，再经 `toT04CheckResult`
 *    转成正式 `CheckResult`；
 * 3. 通过既有 `run-store-v2` writer 写入**真实 ReviewRunV2**，把计划指纹、
 *    原件版本、规则集合冻结进 `inputManifest`。
 *
 * 不做的事：
 * - 不新建 PlanStore/RunStore/规则引擎；
 * - 不接受渲染层传入的 Plan、Check 或 Run；
 * - 存在未映射约束（如 `gte`）时直接拒绝，不拿不完整计划跑审核。
 */
import { createHash } from 'node:crypto'
import type { Actor, CaseAggregateV2, CheckResult, ReviewRunV2, SourceRef, TemplateVersion } from '@profer/shared'
import { CommandValidationError, readAggregate } from './case-store-v2'
import { getTemplate } from './template-store'
import { saveRunV2, listRunsV2 } from './run-store-v2'
import { computeRunInputHash } from './run-service-v2'
import { compileTemplatePlanForCase } from './review-v3-main-template-plan-bridge'
import { evaluateT04Plan } from './review-v3-t04-rules-scoring'
import { reconcileF07PublishedPlan } from './review-v3-f07-plan-coverage'

const MAIN_ACTOR: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

export interface TemplateRuleRunResult {
  runId: string
  planFingerprint: string
  /** 与 Run.inputManifest.hash 一致，供调用方在不重新读取时关联补件 */
  inputHash: string
  checks: CheckResult[]
  status: 'completed' | 'partially-completed'
  ruleIds: string[]
}

/** 由当前有效原件构造可核对的来源引用（缺原件就是空，绝不虚构）。 */
function sourceRefsOf(aggregate: CaseAggregateV2): SourceRef[] {
  return (aggregate.caseV2.documents ?? [])
    .filter((document) => document.active !== false && !(document.unusedReason ?? '').startsWith('[审核员忽略]'))
    .map((document) => ({
      caseId: aggregate.caseV2.id,
      documentVersionId: document.versionId,
      parseRevision: document.parseRevision ?? 0,
      location: { kind: 'file' } as SourceRef['location'],
    }))
}

/** 计划指纹需要涵盖计划本体与规则集，避免同模板不同规则共用指纹。 */
function fingerprintOf(planFingerprint: string, ruleIds: readonly string[]): string {
  return createHash('sha256')
    .update(`${planFingerprint}|${[...ruleIds].sort().join(',')}`)
    .digest('hex')
}

/**
 * 安装计划并生成真实 Run。
 *
 * 同一案卷可多次运行（例如补件后），历史 Run 一律保留、不改写。
 */
export function runTemplateRuleReview(input: {
  caseId: string
  phase?: 'submission' | 'decision'
  initiatedBy?: Actor
  /** 业务判断日（YYYY-MM-DD），由调用方显式提供；缺省不偷用机器时间。 */
  asOfDate?: string
}): TemplateRuleRunResult {
  const aggregate = readAggregate(input.caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷不存在')
  if (aggregate.d2RuntimePlan) {
    throw new CommandValidationError('AGENT_DECISION_DISABLED', 'D2 技术预审案卷不得使用正式业务规则计划')
  }
  const template: TemplateVersion | undefined = getTemplate(
    aggregate.caseV2.templateId, aggregate.caseV2.templateVersion,
  )
  if (!template) throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '模板不存在')
  if (template.status !== 'published') {
    throw new CommandValidationError('INVALID_TRANSITION', '只有已发布模板可以生成正式审核运行')
  }

  const phase = input.phase ?? 'submission'
  const bridge = compileTemplatePlanForCase({
    aggregate, template, phase, ...(input.asOfDate ? { asOfDate: input.asOfDate } : {}),
  })
  if (!bridge.compiled) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED',
      `模板规则尚不能编译为可执行计划：${bridge.unresolved.map((item) => `${item.ruleId}（${item.reason}）`).join('；')}`)
  }
  const { plan, checks, bindings } = bridge.compiled
  if (bindings.length === 0) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '已发布模板尚无可执行检查，不能记录空运行')
  }
  const ruleIds = bindings.map((item) => item.rule.id)

  const executedAt = new Date().toISOString()
  // RUN-40：审核员显式忽略的原件不得继续充当材料/来源；与 readiness 同一前缀口径。
  const active = (aggregate.caseV2.documents ?? []).filter((document) =>
    document.active !== false && !(document.unusedReason ?? '').startsWith('[审核员忽略]'))
  const proposals = evaluateT04Plan(plan, checks)
  if (proposals.length !== plan.bindings.length) {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', 'T04 实际检查数量与冻结计划不一致')
  }
  // 逐条核对 Check×target×object×subject + Run 原件版本，而非将全案原件复制给每条检查。
  const reconciled = reconcileF07PublishedPlan({
    plan, bindings,
    results: proposals.map((proposal, index) => ({ binding: plan.bindings[index]!, proposal })),
    documents: active, verifiedSources: sourceRefsOf(aggregate),
    caseId: aggregate.caseV2.id, recordedAt: executedAt,
  })
  const results: CheckResult[] = reconciled.checks

  const compliant = results.filter((item) => item.status === 'compliant').length
  const nonCompliant = results.filter((item) => item.status === 'non-compliant').length
  const pending = results.filter((item) =>
    item.status === 'awaiting-confirmation' || item.status === 'awaiting-supplement').length
  const failed = results.filter((item) => item.status === 'execution-failed' || item.status === 'not-executed').length

  const planFingerprint = fingerprintOf(plan.fingerprint, ruleIds)
  const run: ReviewRunV2 = {
    id: `run-tpl-${Date.now().toString(36)}-${createHash('sha256').update(planFingerprint + executedAt).digest('hex').slice(0, 8)}`,
    caseId: aggregate.caseV2.id,
    templateId: template.templateId,
    templateVersion: template.version,
    inputManifest: {
      // 输入哈希沿用既有权威算法，保证 T05 的 Run 新鲜度判定可直接复用
      hash: computeRunInputHash(
        aggregate.caseV2,
        (aggregate.observations ?? []) as unknown as Array<Record<string, unknown>>,
        (aggregate.evidenceLinks ?? []) as unknown as Array<Record<string, unknown>>,
      ),
      templateVersion: template.version,
      policyVersions: (template.policyRefs ?? []).map((ref) => ({ policyVersionId: ref.policyId, version: ref.version })),
      documentVersions: active.map((document) => ({
        documentId: document.documentId,
        versionId: document.versionId,
        contentHash: document.byteHash ?? document.versionId,
      })),
      observationIds: (aggregate.observations ?? []).map((item) => item.id),
      evidenceLinkIds: (aggregate.evidenceLinks ?? []).map((item) => item.id),
      effectiveRuleIds: ruleIds,
      effectiveRuleSetHash: createHash('sha256').update([...ruleIds].sort().join(',')).digest('hex'),
      planFingerprint,
    },
    status: pending > 0 || failed > 0 || reconciled.blockers.length > 0 ? 'partially-completed' : 'completed',
    checkpoints: [{
      nodeId: 'template-rule-plan', inputHash: planFingerprint,
      status: 'done', attempts: 1,
    }],
    checks: results,
    opinions: [],
    coverage: reconciled.coverage,
    diagnostics: [
      `模板规则计划：${ruleIds.length} 条规则，${results.length} 项检查`,
      `计划指纹：${planFingerprint}`,
      `业务判断日：${input.asOfDate ?? '未指定（带有效期规则将保持待确认）'}`,
      ...reconciled.blockers.map((reason) => `覆盖阻断：${reason}`),
    ],
    startedAt: executedAt,
    completedAt: executedAt,
    initiatedBy: input.initiatedBy ?? MAIN_ACTOR,
  }
  saveRunV2(run)
  return {
    runId: run.id, planFingerprint, inputHash: run.inputManifest.hash,
    checks: results, status: run.status as 'completed' | 'partially-completed', ruleIds,
  }
}

/** 读取某案卷最近一次模板规则运行（供界面与台账核对）。 */
export function latestTemplateRuleRun(caseId: string): ReviewRunV2 | undefined {
  const runs = listRunsV2(caseId).filter((run) => run.id.startsWith('run-tpl-'))
  return runs.at(-1)
}
