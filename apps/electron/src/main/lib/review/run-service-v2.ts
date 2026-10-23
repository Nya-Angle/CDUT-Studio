/**
 * V2 运行编排服务（M3 收尾，设计 03 §6/§11.1 M3）
 *
 * - startRunV2：创建运行（不可变输入 manifest）→ 执行运行图 → 每节点落盘（检查点持久化）
 * - resumeRunV2：从磁盘检查点恢复，done+同 hash 跳过（A11/A18）
 * - cancelRunV2：进程内取消注册表；取消后不启动新节点（K18），落盘 cancelled
 * - 事件经 onEvent 回调（M5 IPC 接线时转发渲染层）
 */

import { createHash } from 'node:crypto'
import type { CheckpointRecord, ReviewCaseV2, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { executeRunGraph, planRunGraph, type NodeArtifact, type NodeExecutor, type NodeKind, type RunEvent } from './review-run-graph'
import { getRunV2, readArtifact, saveArtifact, saveRunV2 } from './run-store-v2'
import { readAggregate } from './case-store-v2'
import { hashEffectiveRuleSet, resolveEffectiveRules } from './effective-rules'

/** 进程内取消注册表（单机桌面应用：跨进程取消无需持久化标记） */
const cancelledRunIds = new Set<string>()

export function cancelRunV2(runId: string): void {
  cancelledRunIds.add(runId)
}

export function isRunCancelled(runId: string): boolean {
  return cancelledRunIds.has(runId)
}

/** 输入 manifest 哈希：模板版本 + 文档版本 + 主体/观察内容（不可变输入指纹，03 §7） */
export function computeRunInputHash(
  caseV2: ReviewCaseV2,
  observationSnapshot: Array<Record<string, unknown>>,
  evidenceSnapshot: Array<Record<string, unknown>>,
  documentOrder?: string[],
): string {
  // N2b（07 §3.4）：输入包含 caseFields、解析修订与真实观察/绑定快照（修正误判 3：旧 hash 缺 caseFields）
  const material = JSON.stringify({
    templateId: caseV2.templateId,
    templateVersion: caseV2.templateVersion,
    caseFields: caseV2.caseFields,
    reviewRules: caseV2.reviewRules ?? [],
    // usage / unusedReason are run outputs; changing them must not invalidate their own input snapshot.
    // Material order is a presentation/workflow concern. Legacy projection and V2
    // hydration can reorder the same documents without changing their contents;
    // that must not make a just-finished run unusable. The manifest still records
    // the user-facing order separately for display/debugging.
    documents: [...caseV2.documents]
      .sort((left, right) => documentOrder
        ? (documentOrder.indexOf(left.versionId) - documentOrder.indexOf(right.versionId))
        : left.versionId.localeCompare(right.versionId))
      .map((document) => ({ id: document.versionId, hash: document.contentHash, parseRevision: document.parseRevision, parseStatus: document.parseStatus, active: document.active !== false })),
    subjects: caseV2.subjects.map((subject) => ({ id: subject.id, sectionId: subject.sectionId, fields: subject.fields, status: subject.status })),
    observations: observationSnapshot,
    evidenceLinks: evidenceSnapshot,
  })
  return createHash('sha256').update(material, 'utf-8').digest('hex')
}

function effectiveRuleDependencies(rules: Array<{ rule: import('@profer/shared').RuleSpec }>): Array<{ ruleId: string; fieldKeys: string[] }> {
  return rules.map(({ rule }) => {
    const fields = new Set<string>()
    const visit = (condition: import('@profer/shared').ConditionAST): void => {
      if ('all' in condition) condition.all.forEach(visit)
      else if ('any' in condition) condition.any.forEach(visit)
      else if ('not' in condition) visit(condition.not)
      else fields.add('field' in condition ? condition.field : condition.fact)
    }
    visit(rule.when)
    for (const field of rule.calculation?.deduplicateBy ?? []) fields.add(field)
    if (rule.calculation?.valueFrom) fields.add(rule.calculation.valueFrom)
    const constraint = rule.workspaceConstraint
    if (constraint?.kind === 'score-value' || constraint?.kind === 'max-score') fields.add('declaredScore')
    if (constraint?.kind === 'date-range') fields.add('activityDate')
    if (constraint?.kind === 'amount-limit') fields.add('amount')
    if (constraint?.kind === 'level-mapping') fields.add('level')
    if (rule.execution === 'semantic') fields.add('*')
    return { ruleId: rule.id, fieldKeys: [...fields].sort() }
  })
}

export interface StartRunOptions {
  runId?: string
  initiatedBy?: ReviewRunV2['initiatedBy']
  observationSnapshot?: Array<Record<string, unknown>>
  evidenceSnapshot?: Array<Record<string, unknown>>
  /** 续跑：沿用既有运行文件的检查点 */
  resumeRunId?: string
  onEvent?: (event: RunEvent) => void
  cancelled?: () => boolean
  /** 外部取消信号（08 设计：取消穿透到模型请求网络层） */
  signal?: AbortSignal
}

/**
 * 执行 V2 运行：持久化-优先（每个节点完成后整份落盘，崩溃可续）。
 * executors 由调用方装配（业务工具集 × 节点类型），本服务只管编排与持久化。
 */
export async function runReviewCaseV2(
  caseV2: ReviewCaseV2,
  template: TemplateVersion,
  executors: Record<NodeKind, NodeExecutor>,
  options: StartRunOptions = {},
): Promise<ReviewRunV2> {
  const persisted = readAggregate(caseV2.id)
  if (caseV2.stage === 'archived' || persisted?.caseV2.stage === 'archived') {
    throw new Error('案卷已经归档，不允许启动或续跑审核')
  }
  // An archived+restored Case has a new revision; an old pre-archive snapshot
  // must not start a Run based on evidence from its previous life.
  if (persisted?.caseArchive && persisted.caseV2.revision !== caseV2.revision) {
    throw new Error('案卷已发生归档/恢复操作，旧快照禁止执行')
  }
  const runId = options.runId ?? options.resumeRunId ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const observationSnapshot = options.observationSnapshot ?? []
  const evidenceSnapshot = options.evidenceSnapshot ?? []
  const inputHash = computeRunInputHash(caseV2, observationSnapshot, evidenceSnapshot)
  const effectiveRules = resolveEffectiveRules({ caseV2 }, template)
  const nodes = planRunGraph(template)
  for (const node of nodes) {
    node.inputHash = createHash('sha256').update(JSON.stringify({ inputHash, nodeId: node.id, dependencies: node.dependsOn })).digest('hex')
  }
  let checkpoints: CheckpointRecord[] = nodes.map((node) => ({ nodeId: node.id, inputHash: node.inputHash!, status: 'pending' as const, attempts: 0 }))

  // 续跑：恢复检查点（done+同 hash 跳过）
  if (options.resumeRunId) {
    const previous = getRunV2(caseV2.id, options.resumeRunId)
    if (!previous) throw new Error(`续跑目标运行不存在: ${options.resumeRunId}`)
    // 输入指纹一致性：manifest 变了就不允许在旧运行上续（结果混版，K06）
    if (previous.inputManifest.hash !== inputHash && previous.checkpoints.some((checkpoint) => checkpoint.status === 'done')) {
      throw new Error('案卷输入在运行后已变化，不能在旧运行上续跑（请发起新运行）')
    }
    const previousById = new Map(previous.checkpoints.map((checkpoint) => [checkpoint.nodeId, checkpoint]))
    const reusableIds = new Set<string>()
    // 校验真实产物和依赖；任一产物失效后，其下游必须重新执行。
    for (const node of nodes) {
      const checkpoint = previousById.get(node.id)
      if (!checkpoint) continue
      node.attempts = checkpoint.attempts
      const artifact = checkpoint.outputRef ? readArtifact<NodeArtifact>(caseV2.id, previous.id, node.id) : undefined
      const validArtifact = !checkpoint.outputRef || !!(artifact && artifact.schemaRevision === 2 && artifact.runId === previous.id && artifact.nodeId === node.id && artifact.dependencyHash === node.inputHash)
      const reusable = checkpoint.status === 'done' && checkpoint.inputHash === node.inputHash && validArtifact && node.dependsOn.every(id => reusableIds.has(id))
      if (reusable) {
        node.status = 'done'
        reusableIds.add(node.id)
        if (artifact && runId !== previous.id) saveArtifact(caseV2.id, runId, node.id, { ...artifact, runId })
      }
      checkpoints = checkpoints.map(current => current.nodeId === node.id
        ? (reusable ? { ...checkpoint } : { ...current, attempts: checkpoint.attempts })
        : current)
    }
  }

  const run: ReviewRunV2 = {
    id: runId,
    caseId: caseV2.id,
    templateId: template.templateId,
    templateVersion: template.version,
    inputManifest: {
      hash: inputHash,
      templateVersion: template.version,
      policyVersions: (template.policyRefs?.map((ref) => ({ policyVersionId: ref.policyId, version: ref.version })) ?? template.policyVersionIds.map((policyVersionId) => ({ policyVersionId, version: 1 }))),
      documentVersions: caseV2.documents.map((document) => ({ documentId: document.documentId, versionId: document.versionId, contentHash: document.contentHash })),
      observationIds: observationSnapshot.map((item) => String(item.id ?? '')).filter(Boolean),
      evidenceLinkIds: evidenceSnapshot.map((item) => String(item.id ?? '')).filter(Boolean),
      effectiveRuleIds: effectiveRules.map((item) => item.rule.id),
      effectiveRuleSetHash: hashEffectiveRuleSet(effectiveRules),
      effectiveRuleDependencies: effectiveRuleDependencies(effectiveRules),
    },
    status: 'running',
    checkpoints,
    checks: [],
    opinions: [],
    coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
    diagnostics: [],
    startedAt: new Date().toISOString(),
    initiatedBy: options.initiatedBy,
  }
  saveRunV2(run)

  const outcome = await executeRunGraph(
    nodes,
    executors,
    {
      cancelled: () => {
        const current = readAggregate(caseV2.id)
        return (options.cancelled?.() ?? false) || isRunCancelled(runId) ||
          current?.caseV2.stage === 'archived' ||
          (!!current?.caseArchive && current.caseV2.revision !== (persisted?.caseV2.revision ?? caseV2.revision))
      },
      now: () => new Date().toISOString(),
      runId,
      onEvent: options.onEvent, // N2b：即时事件（不再等整图结束——修正误判 1）
      writeArtifact: (nodeId, artifact) => {
        // 每节点产物即时落盘（崩溃可续，R03）
        saveArtifact(caseV2.id, runId, nodeId, artifact)
      },
      writeCheckpoint: (checkpoint) => {
        // 先保存产物，再保存完成/等待/失败检查点，最后广播事件。
        run.checkpoints = run.checkpoints.map(current => current.nodeId === checkpoint.nodeId ? checkpoint : current)
        saveRunV2(run)
      },
    },
  )

  const currentAtFinish = readAggregate(caseV2.id)
  const interruptedByArchive = currentAtFinish?.caseV2.stage === 'archived' ||
    (!!currentAtFinish?.caseArchive && currentAtFinish.caseV2.revision !== (persisted?.caseV2.revision ?? caseV2.revision))
  run.status = interruptedByArchive ? 'cancelled' : outcome.status
  if (interruptedByArchive) run.diagnostics.push('案卷曾归档或恢复：旧运行只保留历史，不能成为当前有效审核')
  // checks/opinions/coverage 由节点产物装配（07 §4.2：不从工具内存数组推测——修正误判 1）
  const artifacts = run.checkpoints
    .filter((checkpoint) => checkpoint.outputRef)
    .map((checkpoint) => readArtifact<Record<string, unknown>>(caseV2.id, runId, checkpoint.nodeId))
    .filter((artifact): artifact is Record<string, unknown> => !!artifact)
  run.checks = artifacts.flatMap((artifact) => (artifact.checks as Array<never>) ?? [])
  run.opinions = artifacts.flatMap((artifact) => (artifact.opinions as Array<never>) ?? [])
  run.agentActivity = [...new Set(artifacts.flatMap((artifact) => Array.isArray(artifact.capabilityCalls)
    ? artifact.capabilityCalls.filter((item): item is string => typeof item === 'string')
    : []))].slice(0, 100)
  run.modelUsage = [...new Map(artifacts.flatMap((artifact) => Array.isArray(artifact.modelUsage)
    ? artifact.modelUsage.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => [JSON.stringify(item), item] as const)
    : [])).values()] as NonNullable<ReviewRunV2['modelUsage']>
  // coverage 与 executor 共用本次 EffectiveRuleSet（材料账本 + 检查账本含组展开）。
  {
    const { combineCoverage } = await import('./coverage-ledger')
    const policyRules = effectiveRules.map((item) => item.rule)
    const groupValues: Record<string, string[]> = {}
    for (const artifact of artifacts) {
      const groups = artifact.groups as Record<string, string[]> | undefined
      if (groups) for (const [ruleId, values] of Object.entries(groups)) groupValues[ruleId] = values
    }
    const sectionSubjectIds = Object.fromEntries((template.sections ?? []).map((section) => [
      section.id,
      caseV2.subjects.filter((subject) => subject.sectionId === section.id).map((subject) => subject.id),
    ]))
    const summary = combineCoverage(caseV2.documents, policyRules, caseV2.subjects.map((subject) => subject.id), run.checks as never, groupValues, sectionSubjectIds)
    run.coverage = {
      documents: summary.documents,
      plannedChecks: summary.plannedChecks,
      completedChecks: summary.completedChecks,
      effectiveVerdicts: summary.effectiveVerdicts,
      pendingChecks: summary.pendingChecks,
    }
    if (!summary.allClearVerdictAllowed) run.diagnostics = [...run.diagnostics, ...summary.blockers.map((blocker) => `coverage: ${blocker}`)]
  }
  run.completedAt = run.status === 'completed' ? new Date().toISOString() : undefined
  saveRunV2(run)
  cancelledRunIds.delete(runId)
  return run
}
