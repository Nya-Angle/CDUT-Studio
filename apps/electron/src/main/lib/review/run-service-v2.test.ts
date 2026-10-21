/**
 * V2 运行编排单测（M3：持久化/续跑跳过/取消 K18）
 * 隔离：PROFER_CONFIG_DIR 唯一临时目录。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewCaseV2, RuleSpec, TemplateVersion } from '@profer/shared'
import { cancelRunV2, computeRunInputHash, runReviewCaseV2 } from './run-service-v2'
import type { NodeExecutor } from './review-run-graph'
import { getRunV2, listRunsV2, readArtifact, saveArtifact } from './run-store-v2'
import { ensureBuiltinTemplateDrafts } from './builtin-templates'
import { getTemplate as getTemplateStored, saveDraft as saveDraftStored } from './template-store'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-runv2-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const template = (() => {
  ensureBuiltinTemplateDrafts({ getTemplate: getTemplateStored, saveDraft: saveDraftStored })
  return getTemplateStored('document-checklist-v2', 1)!
})()

const caseV2: ReviewCaseV2 = {
  id: 'case-runv2-1', templateId: 'document-checklist-v2', templateVersion: 1, title: '测试案卷',
  objectType: 'document', caseFields: {}, subjects: [], documents: [], stage: 'submitted',
  revision: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}

import type { NodeKind } from './review-run-graph'
const ALL_KINDS: NodeKind[] = ['register', 'parse', 'ocr', 'extract', 'bind', 'plan', 'check', 'calculate', 'verify', 'summarize', 'task']
const done = async (_n: Parameters<NodeExecutor>[0], hash: string) => ({ status: 'done' as const, inputHash: hash })
const okExecutors: Record<NodeKind, NodeExecutor> = Object.fromEntries(ALL_KINDS.map((kind) => [kind, done])) as Record<NodeKind, NodeExecutor>

describe('runReviewCaseV2（M3 编排）', () => {
  const autoCheckTemplate: TemplateVersion = { ...template, stages: [{ id: 'auto-check', name: '自动核验', kind: 'auto-check', executorRole: 'system' }] }
  test('材料读取状态是运行输出，不让本次运行因自身覆盖更新变成过期', () => {
    const document = { documentId: 'd', versionId: 'd-v1', contentHash: 'h', role: 'application' as const, fileName: '申请.md', mimeType: 'text/markdown', sizeBytes: 1, assetPath: 'd.md', parseRevision: 1, parseStatus: 'parsed' as const, usage: 'registered' as const, blocks: [] }
    const before = computeRunInputHash({ ...caseV2, documents: [document] }, [], [])
    const afterRead = computeRunInputHash({ ...caseV2, documents: [{ ...document, usage: 'read' as const, unusedReason: '已由审核节点读取' }] }, [], [])
    expect(afterRead).toBe(before)
    expect(computeRunInputHash({ ...caseV2, documents: [{ ...document, parseRevision: 2 }] }, [], [])).not.toBe(before)
  })
  test('同一批材料仅展示顺序变化不应让已完成运行变成过期', () => {
    const first = { documentId: 'd1', versionId: 'd1-v1', contentHash: 'h1', role: 'application' as const, fileName: '申报.md', mimeType: 'text/markdown', sizeBytes: 1, assetPath: 'd1.md', parseRevision: 1, parseStatus: 'parsed' as const, usage: 'registered' as const, blocks: [] }
    const second = { ...first, documentId: 'd2', versionId: 'd2-v1', contentHash: 'h2', fileName: '细则.md' }
    const forward = computeRunInputHash({ ...caseV2, documents: [first, second] }, [], [])
    const reversed = computeRunInputHash({ ...caseV2, documents: [second, first] }, [], [])
    expect(reversed).toBe(forward)
  })
  test('同一案卷的一次运行纳入所有分项标准并分别计算覆盖', async () => {
    const sectionedTemplate: TemplateVersion = {
      ...template,
      templateId: 'sectioned-run-template',
      sections: [
        { id: 'study', name: '学业表现', order: 0, required: true, criteria: [{ id: 'credit-check', title: '学分核验', requirement: '核对学分', execution: 'manual', targetScope: 'subject' }] },
        { id: 'service', name: '志愿服务', order: 1, required: true, criteria: [{ id: 'hour-check', title: '时长核验', requirement: '核对服务时长', execution: 'manual', targetScope: 'subject' }] },
      ],
    }
    const sectionedCase: ReviewCaseV2 = {
      ...caseV2, id: 'case-runv2-sections', templateId: sectionedTemplate.templateId,
      subjects: [
        { id: 'study-item', type: 'item', title: '课程学业表现', sectionId: 'study', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
        { id: 'service-item', type: 'item', title: '志愿服务记录', sectionId: 'service', fields: {}, sourceRefs: [], correction: 'user-confirmed', status: 'identified' },
      ],
    }
    const run = await runReviewCaseV2(sectionedCase, sectionedTemplate, okExecutors, { runId: 'r-one-run-multiple-sections' })

    expect(run.inputManifest.effectiveRuleIds).toEqual(['section-study-credit-check', 'section-service-hour-check'])
    expect(run.coverage.plannedChecks).toBe(2)
  })

  test('workspace-only 有效规则同时成为运行清单与 coverage 分母', async () => {
    const workspaceRules: RuleSpec[] = [1, 2, 3].map((index) => ({
      id: `workspace-rule-${index}`, policyVersionId: 'workspace:pack@v1', title: `规则 ${index}`,
      when: { field: 'declaredScore', op: 'exists' }, requirement: '需要人工核对',
      targetScope: 'case', execution: 'manual', onFail: 'manual-review', onUnknown: 'pending',
      sourceRefIds: [], priority: index, confirmation: 'unconfirmed',
    }))
    const withRules = { ...caseV2, id: 'case-runv2-workspace-rules', reviewRules: workspaceRules }
    const checkExecutors: typeof okExecutors = {
      ...okExecutors,
      check: async (_node, hash) => ({ status: 'done', inputHash: hash, artifact: { sourceIds: [withRules.id], checks: workspaceRules.map((rule) => ({
        checkId: `check-${rule.id}-case-case`, ruleId: rule.id, status: 'awaiting-confirmation',
        reason: rule.requirement, target: { scope: 'case', subjectIds: [] }, sourceRefs: [], executedBy: 'manual', executedAt: new Date().toISOString(),
      })) } }),
    }
    const run = await runReviewCaseV2(withRules, template, checkExecutors, { runId: 'r-workspace-rules' })
    expect(run.inputManifest.effectiveRuleIds).toEqual(workspaceRules.map((rule) => rule.id))
    expect(run.inputManifest.effectiveRuleSetHash).toMatch(/^[a-f0-9]{64}$/)
    expect(run.coverage.plannedChecks).toBe(3)
    expect(run.coverage.pendingChecks).toBe(3)
  })

  test('Given 正常执行 When 运行 Then completed 且检查点落盘（可读回）', async () => {
    const events: string[] = []
    const run = await runReviewCaseV2(caseV2, template, okExecutors, { runId: 'r-ok', onEvent: (event) => events.push(event.kind) })
    expect(run.status).toBe('completed')
    expect(run.checkpoints.length).toBeGreaterThan(0)
    expect(run.completedAt).toBeString()
    expect(events).toContain('node-completed')
    // 落盘可读回
    const persisted = getRunV2(caseV2.id, 'r-ok')!
    expect(persisted.status).toBe('completed')
    expect(listRunsV2(caseV2.id)).toHaveLength(1)
  })

  test('Given 已完成运行 When 同 hash 续跑 Then done 节点跳过不重做（A11）', async () => {
    let parseCalls = 0
    const counting: typeof okExecutors = { ...okExecutors, parse: async (node, hash) => { parseCalls += 1; return okExecutors.parse(node, hash) } }
    await runReviewCaseV2(caseV2, template, okExecutors, { runId: 'r-resume' })
    const resumed = await runReviewCaseV2(caseV2, template, counting, { runId: 'r-resume-2', resumeRunId: 'r-resume' })
    expect(resumed.status).toBe('completed')
    expect(parseCalls).toBe(0) // 全部节点跳过
  })

  test('Given 输入变化 When 续跑旧运行 Then 拒绝（防混版，K06）', async () => {
    const changed = { ...caseV2, subjects: [{ id: 's-new', type: 'item', title: 'x', fields: {}, sourceRefs: [], correction: 'ai-extracted', status: 'identified' }] } as ReviewCaseV2
    await expect(runReviewCaseV2(changed, template, okExecutors, { runId: 'r-x', resumeRunId: 'r-resume' })).rejects.toThrow('不能在旧运行上续跑')
  })

  test('Given 执行前取消 When 运行 Then cancelled 且不产生完成事件（K18）', async () => {
    cancelRunV2('r-cancel')
    const run = await runReviewCaseV2(caseV2, template, okExecutors, { runId: 'r-cancel' })
    expect(run.status).toBe('cancelled')
    const persisted = getRunV2(caseV2.id, 'r-cancel')!
    expect(persisted.status).toBe('cancelled')
    expect(persisted.completedAt).toBeUndefined()
  })

  test('Given 后续节点尚在运行 When 读取运行文件 Then 前一节点检查点和产物已经落盘', async () => {
    let checked = false
    const executors: typeof okExecutors = {
      ...okExecutors,
      register: async (_node, hash) => ({ status: 'done', inputHash: hash, artifact: { sourceIds: [], summary: '已登记' } }),
      parse: async (_node, hash) => {
        const checkpoint = getRunV2(caseV2.id, 'r-midway')!.checkpoints.find(c => c.nodeId.endsWith('-register'))!
        expect(checkpoint.status).toBe('done')
        expect(checkpoint.outputRef).toBe(`artifacts/${checkpoint.nodeId}.json`)
        expect(readArtifact(caseV2.id, 'r-midway', checkpoint.nodeId)).toBeDefined()
        checked = true
        return { status: 'done', inputHash: hash }
      },
    }
    const run = await runReviewCaseV2(caseV2, autoCheckTemplate, executors, { runId: 'r-midway' })
    expect(checked).toBe(true)
    expect(run.status).toBe('completed')
  })

  test('Given OCR 产物丢失 When 续跑至新运行 Then 重做 OCR 和下游且保留可复用产物', async () => {
    const artifacts = { ...okExecutors }
    for (const kind of ALL_KINDS) {
      artifacts[kind] = async (_node, hash) => ({ status: 'done', inputHash: hash, artifact: { sourceIds: [], summary: kind } })
    }
    const initial = await runReviewCaseV2(caseV2, autoCheckTemplate, artifacts, { runId: 'r-missing' })
    const ocrCheckpoint = initial.checkpoints.find((checkpoint) => checkpoint.nodeId.endsWith('-ocr'))!
    rmSync(join(CONFIG_DIR, 'review-cases', caseV2.id, 'runs-v2', 'r-missing', ocrCheckpoint.outputRef!))
    const calls = { parse: 0, ocr: 0, extract: 0 }
    const counting = { ...artifacts }
    for (const kind of ['parse', 'ocr', 'extract'] as const) {
      counting[kind] = async (node, hash) => { calls[kind]++; return artifacts[kind](node, hash) }
    }
    const run = await runReviewCaseV2(caseV2, autoCheckTemplate, counting, { runId: 'r-missing-resumed', resumeRunId: 'r-missing' })
    expect(calls).toEqual({ parse: 0, ocr: 1, extract: 1 })
    expect(run.checkpoints).toHaveLength(initial.checkpoints.length)
    expect(readArtifact<{ runId: string }>(caseV2.id, run.id, 'node-auto-check-register')?.runId).toBe(run.id)
    expect(readArtifact(caseV2.id, run.id, 'node-auto-check-ocr')).toBeDefined()
    expect(run.status).toBe('completed')
  })

  test('Given 产物指纹损坏 When 同运行续跑 Then 重新执行对应节点', async () => {
    const artifacts: typeof okExecutors = { ...okExecutors, ocr: async (_node, hash) => ({ status: 'done', inputHash: hash, artifact: { sourceIds: [], summary: 'OCR' } }) }
    const initial = await runReviewCaseV2(caseV2, autoCheckTemplate, artifacts, { runId: 'r-corrupt' })
    const ocrCheckpoint = initial.checkpoints.find((checkpoint) => checkpoint.nodeId.endsWith('-ocr'))!
    saveArtifact(caseV2.id, 'r-corrupt', ocrCheckpoint.nodeId, { runId: 'r-corrupt', nodeId: ocrCheckpoint.nodeId, schemaRevision: 2, dependencyHash: '损坏的指纹', sourceIds: [] })
    let calls = 0
    const run = await runReviewCaseV2(caseV2, autoCheckTemplate, { ...artifacts, ocr: async (node, hash) => { calls++; return artifacts.ocr(node, hash) } }, { runId: 'r-corrupt', resumeRunId: 'r-corrupt' })
    expect(calls).toBe(1)
    expect(run.status).toBe('completed')
  })
})
