/**
 * D1 Agent-first 作者态工作区本地 JSON 操作入口（仅制作/候选预览）。
 *
 * bun apps/electron/scripts/review-authoring-v1.ts validate <workspace.json>
 * bun apps/electron/scripts/review-authoring-v1.ts candidate <workspace.json> <templateId> <version>
 * bun apps/electron/scripts/review-authoring-v1.ts diff <before.json> <after.json>
 * PROFER_CONFIG_DIR=/tmp/review-d1 bun apps/electron/scripts/review-authoring-v1.ts candidate-save <workspace.json> <templateId> <version>
 * PROFER_CONFIG_DIR=/tmp/review-d1 bun apps/electron/scripts/review-authoring-v1.ts save <workspace.json> <expectedRevision> <actor>
 * PROFER_CONFIG_DIR=/tmp/review-d1 bun apps/electron/scripts/review-authoring-v1.ts read <workspaceId> [revision]
 *
 * 这里不会发布审核模板，候选输出不能直接用作校规；actor 为审计标签而非身份认证。
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ReviewAuthoringWorkspaceV1 } from '@profer/shared'
import {
  compileReviewAuthoringCandidateV1, validateReviewAuthoringV1, verifyReviewAuthoringManifestV1,
} from '../src/main/lib/review/review-authoring-v1'
import { getTemplate, saveAuthoringCandidateDraft } from '../src/main/lib/review/template-store'
import {
  diffReviewAuthoringRevisionsV1, getReviewAuthoringRevisionV1, saveReviewAuthoringRevisionV1,
} from '../src/main/lib/review/review-authoring-store-v1'

const load = (path: string): ReviewAuthoringWorkspaceV1 => JSON.parse(readFileSync(resolve(path), 'utf8')) as ReviewAuthoringWorkspaceV1
const print = (value: unknown): void => console.log(JSON.stringify(value, null, 2))

function main(): void {
  const [operation, first, second, third] = process.argv.slice(2)
  if (!first) throw new Error('缺少作者态工作区或标识；请查阅脚本头部用法')
  if (operation === 'read') {
    if (!process.env.PROFER_CONFIG_DIR) throw new Error('read 必须显式使用隔离 PROFER_CONFIG_DIR')
    const record = getReviewAuthoringRevisionV1(first, second ? Number(second) : undefined)
    if (!record) throw new Error('作者态修订不存在')
    print(record)
    return
  }
  const workspace = load(first)
  if (operation === 'validate') {
    const issues = validateReviewAuthoringV1(workspace)
    print({ ok: issues.length === 0, workspaceId: workspace.workspaceId, revision: workspace.revision, issues })
    if (issues.length) process.exitCode = 1
    return
  }
  if (operation === 'candidate') {
    if (!second || !third) throw new Error('candidate 必须指定 templateId 与版本')
    print(compileReviewAuthoringCandidateV1(workspace, second, Number(third)))
    return
  }
  if (operation === 'diff') {
    if (!second) throw new Error('diff 需要两个作者态 JSON 文件')
    print(diffReviewAuthoringRevisionsV1(workspace, load(second)))
    return
  }
  if (operation === 'candidate-save') {
    if (!process.env.PROFER_CONFIG_DIR) throw new Error('candidate-save 必须显式使用隔离 PROFER_CONFIG_DIR')
    if (!second || !third) throw new Error('candidate-save 必须指定模板 ID 和版本')
    const candidate = compileReviewAuthoringCandidateV1(workspace, second, Number(third))
    const checks = verifyReviewAuthoringManifestV1(candidate.template, candidate.manifest, workspace)
    if (checks.length) throw new Error('候选映射不一致：' + checks.join('；'))
    if (getTemplate(candidate.template.templateId, candidate.template.version)) {
      throw new Error('候选目标版本已存在，不能覆盖或改变发布资格')
    }
    const saved = saveAuthoringCandidateDraft(candidate.template)
    print({ saved: true, templateId: saved.templateId, version: saved.version, publicationEligible: false })
    return
  }

  if (operation === 'save') {
    if (!process.env.PROFER_CONFIG_DIR) throw new Error('save 必须显式使用隔离 PROFER_CONFIG_DIR')
    if (!second || !third || !/^\d+$/.test(second)) throw new Error('save 需要 expectedRevision 和操作者标签')
    const record = saveReviewAuthoringRevisionV1(workspace, Number(second), third)
    print({ saved: true, workspaceId: record.workspace.workspaceId, revision: record.workspace.revision, digest: record.digest, parentDigest: record.parentDigest ?? null })
    return
  }
  throw new Error('不支持的 D1 作者态命令：' + operation)
}

try { main() }
catch (error) {
  console.error('[D1 作者态] ' + (error instanceof Error ? error.message : String(error)))
  process.exitCode = 1
}
