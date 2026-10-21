/**
 * D2 Agent JSON 合约 CLI：
 * preview <workspace.json> <selection.json> <case.json>：只编译预览，不写入；
 * register <workspace.json> <selection.json>：登记不可发布的服务端候选草稿；
 * create <workspace.json> <selection.json> <caseId> <title> <actorId>：创建专用技术案卷并固定任务包；
 * attach <workspace.json> <selection.json> <caseId> <expectedRevision> <actorId>：修复已建草稿案卷的事务绑定。
 * 任何写操作必须显式设置 PROFER_CONFIG_DIR。
 */
import { readFileSync } from 'node:fs'
import type { D2ScenarioSelection, ReviewAuthoringWorkspaceV1, ReviewCaseV2 } from '@profer/shared'
import { compileD2RuntimePlan, attachD2RuntimePlan, createD2TechnicalCase, makeD2CandidateShell } from '../src/main/lib/review/review-d2-runtime'
import { saveAuthoringCandidateDraft } from '../src/main/lib/review/template-store'
import { readAggregate } from '../src/main/lib/review/case-store-v2'

const [command, workspacePath, selectionPath, target, revisionArg, actorId] = process.argv.slice(2)
const json = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T

async function main(): Promise<void> {
  if (!workspacePath || !selectionPath) throw new Error('用法：preview|register|create|attach <workspace.json> <selection.json> [case.json|caseId] [title|revision] [actorId]')
  const workspace = json<ReviewAuthoringWorkspaceV1>(workspacePath)
  const selection = json<D2ScenarioSelection>(selectionPath)
  if (command === 'preview') {
    if (!target) throw new Error('preview 缺少合成案卷 JSON 路径')
    const plan = compileD2RuntimePlan(workspace, selection, json<ReviewCaseV2>(target))
    process.stdout.write(JSON.stringify(plan, null, 2) + '\n')
    return
  }
  if (command === 'register' || command === 'create') {
    if (!process.env.PROFER_CONFIG_DIR) throw new Error(command + ' 必须明确指定 PROFER_CONFIG_DIR')
    if (command === 'register') {
      const draft = makeD2CandidateShell(workspace, selection.templateId, selection.version)
      saveAuthoringCandidateDraft(draft)
      process.stdout.write(JSON.stringify({ registered: true, templateId: draft.templateId, templateVersion: draft.version, publicationAllowed: false }, null, 2) + '\n')
      return
    }
    if (!target || !revisionArg?.trim() || !actorId?.trim()) throw new Error('create 缺少案卷 ID、案卷标题或操作者')
    const created = await createD2TechnicalCase({
      caseId: target, title: revisionArg, actor: { actorId, actorSource: 'local', role: 'reviewer' },
      workspace, selection,
    })
    if (!created.ok) throw new Error(created.code + ': ' + created.message)
    process.stdout.write(JSON.stringify({ created: true, caseId: target, revision: created.aggregate.caseV2.revision, fingerprint: created.entity?.fingerprint, publicationAllowed: false }, null, 2) + '\n')
    return
  }
  if (command === 'attach') {
    if (!process.env.PROFER_CONFIG_DIR) throw new Error('attach 必须明确指定 PROFER_CONFIG_DIR 以隔离受控案卷')
    if (!target || !revisionArg || !actorId?.trim()) throw new Error('attach 缺少案卷 ID、预期修订号或操作者')
    const version = Number(revisionArg)
    if (!Number.isSafeInteger(version) || version < 0) throw new Error('expectedRevision 非法')
    const aggregate = readAggregate(target)
    if (!aggregate) throw new Error('案卷不存在，不会自动创建或取得审批资格')
    const result = await attachD2RuntimePlan({
      caseId: target, requestId: 'd2-attach-' + target + '-rev-' + version,
      actor: { actorId, actorSource: 'local', role: 'reviewer' },
      expectedRevision: version, workspace, selection,
    })
    if (!result.ok) throw new Error(result.code + ': ' + result.message)
    process.stdout.write(JSON.stringify({ attached: true, caseId: target, revision: result.aggregate.caseV2.revision, fingerprint: result.entity?.fingerprint, publicationAllowed: false }, null, 2) + '\n')
    return
  }
  throw new Error('未知命令：' + String(command))
}
await main().catch((err) => {
  process.stderr.write(String(err instanceof Error ? err.message : err) + '\n')
  process.exitCode = 1
})
