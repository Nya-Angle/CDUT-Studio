/**
 * 当前案卷唯一有效规则集。
 * 模板政策规则提供默认基线，案卷级审核规则可按 id 覆盖；执行、coverage、报告和决定守门都应消费此结果。
 */
import { createHash } from 'node:crypto'
import type { CaseAggregateV2, RuleSpec, TemplateVersion } from '@profer/shared'
import { canonicalContentHash, getPolicy } from './policy-store'
import {
  resolveF03PolicyRules,
  type F03RuleEntry, type F03RuleSource, type F03Resolution,
  type F03ClaimLink, type F03PriorityDecision,
} from './f03-policy-resolution'

export type EffectiveRuleOrigin = F03RuleSource

export interface EffectiveRule extends F03RuleEntry {}

type AggregateRuleSource = Pick<CaseAggregateV2, 'caseV2'>

/**
 * F03 只读汇总：政策按独立来源进入候选，不让同名条款被后加载的政策覆盖。
 * 具名优先关系的可信持久化由 Main 负责；未接线前冲突只能待确认。
 */
export function resolveEffectiveRuleReport(
  aggregate: AggregateRuleSource,
  template: TemplateVersion,
  options: { claims?: readonly F03ClaimLink[]; decisions?: readonly F03PriorityDecision[]; asOfDate?: string } = {},
): F03Resolution {
  const entries: EffectiveRule[] = []
  const visitedRefs = new Set<string>()

  for (const ref of template.policyRefs ?? []) {
    const refKey = JSON.stringify([ref.policyId, ref.version, ref.contentHash])
    if (visitedRefs.has(refKey)) continue
    visitedRefs.add(refKey)
    const policy = getPolicy(ref.policyId, ref.version)
    // 已发布模板必须使用已发布且 hash 固定的政策版本；损坏引用不得被当作空规则。
    if (template.status === 'published' &&
        (!policy || policy.status !== 'published' || policy.contentHash !== ref.contentHash)) {
      throw new Error(`F03_POLICY_REF_INVALID: ${ref.policyId}@${ref.version}`)
    }
    if (policy && policy.contentHash !== ref.contentHash) throw new Error(`F03_POLICY_HASH_MISMATCH: ${ref.policyId}@${ref.version}`)
    if (policy && canonicalContentHash(policy.content) !== ref.contentHash) {
      throw new Error(`F03_POLICY_CONTENT_TAMPERED: ${ref.policyId}@${ref.version}`)
    }
    const origin = policy?.origin
    const provenanceValid = origin?.kind === 'document' ? !!origin.documentVersionId?.trim() :
      origin?.kind === 'owner-statement' ? !!origin.text?.trim() && !!origin.enteredBy?.trim() &&
        !Number.isNaN(Date.parse(origin.enteredAt)) : false
    const confirmationsValid = !!policy?.confirmations?.some(confirmation => confirmation.actorId?.trim() &&
      !Number.isNaN(Date.parse(confirmation.at)))
    if (template.status === 'published' && (!provenanceValid || !confirmationsValid)) {
      throw new Error(`F03_POLICY_PROVENANCE_INVALID: ${ref.policyId}@${ref.version}`)
    }
    for (const rule of policy?.compiledRules ?? []) {
      if (template.status === 'published' && rule.policyVersionId !== `${ref.policyId}@${ref.version}`) {
        throw new Error(`F03_POLICY_RULE_VERSION_MISMATCH: ${ref.policyId}@${ref.version}:${rule.id}`)
      }
      // 草稿、无有效来源/确认记录的内容可用于起草，但不能以已确认规则参与确定性运行。
      const trusted = policy?.status === 'published' && provenanceValid && confirmationsValid
      entries.push({ rule: trusted ? rule : { ...rule, confirmation: 'unconfirmed' },
        origin: { kind: 'policy', policyId: ref.policyId, version: ref.version } })
    }
  }

  // 分项要求是模板版本的一部分。每条要求生成一条计划检查，所有分项仍属于同一个案卷运行。
  for (const section of [...(template.sections ?? [])].sort((a, b) => a.order - b.order)) {
    ;(section.criteria ?? []).forEach((criterion, index) => {
      const ruleId = `section-${section.id}-${criterion.id}`
      const rule: RuleSpec = {
        id: ruleId,
        policyVersionId: `template:${template.templateId}@${template.version}`,
        title: criterion.title,
        sectionId: section.id,
        when: { all: [] },
        requirement: criterion.requirement,
        targetScope: criterion.targetScope,
        execution: criterion.execution,
        ...(criterion.dataCheck ? { dataCheck: criterion.dataCheck } : {}),
        ...(criterion.execution === 'semantic' ? { semanticOutputEnum: ['compliant', 'non-compliant'] } : {}),
        onFail: 'manual-review',
        onUnknown: 'needs-confirmation',
        sourceRefIds: [],
        priority: section.order * 1000 + index + 1,
        confirmation: 'confirmed',
      }
      entries.push({ rule, origin: { kind: 'template', templateId: template.templateId, version: template.version } })
    })
  }

  // 同一规则身份的案卷修正可以覆盖；不同政策版本或来源的同名规则
  // 必须同时保留，后者不能借助 reviewRules 隐式废止正式政策。
  for (const rule of aggregate.caseV2.reviewRules ?? []) {
    const workspacePack = rule.policyVersionId.match(/^workspace:(.+)@[^@]+$/)?.[1]
    const matched = entries.findIndex(item => item.rule.id === rule.id && item.rule.policyVersionId === rule.policyVersionId)
    if (matched >= 0) entries.splice(matched, 1)
    entries.push({ rule, origin: { kind: 'workspace', ...(workspacePack ? { rulePackId: workspacePack } : {}) } })
  }

  return resolveF03PolicyRules(entries, options)
}

/** 既有 Run/coverage 消费者继续共享唯一规则投影，不建立第二套规则库。 */
export function resolveEffectiveRules(aggregate: AggregateRuleSource, template: TemplateVersion): EffectiveRule[] {
  return resolveEffectiveRuleReport(aggregate, template).rules
}

export function hashEffectiveRuleSet(rules: EffectiveRule[]): string {
  const canonical = rules.map(({ rule, origin }) => ({ id: rule.id, rule, origin }))
  return createHash('sha256').update(JSON.stringify(canonical), 'utf-8').digest('hex')
}
