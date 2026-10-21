/**
 * 公共兜底整链（Main 层）：未匹配候选 → 可编辑草稿 → 发布 → 真实审核运行。
 *
 * 断言重点：
 * - 草稿能经既有 template-store 保存并发布（不新建模板系统）；
 * - 发布的模板能建真实案卷并产出真实 ReviewRunV2；
 * - 语义判据在未人工确认时**不得**被判为 compliant（不能靠兜底伪造通过）。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 'fallbackchain-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { fallbackDraftFromB1 } = await import('./review-v3-fallback-template-draft')
const { saveDraft, publishTemplate, getTemplate } = await import('./template-store')
const { createCaseFromTemplate } = await import('./application-service')
const { runTemplateRuleReview } = await import('./review-v3-main-template-run')
const { listRunsV2 } = await import('./run-store-v2')

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

function b1Document() {
  return {
    schemaVersion: 'review-b1/1', templateId: 'unmatched-x', templateVersion: '1',
    name: '未匹配业务（兜底验证）', purpose: 'p',
    fields: [
      { key: 'organizationName', label: '组织名称', type: 'text', required: true, sourceId: 's1' },
      { key: 'purpose', label: '用途', type: 'text', required: false, sourceId: 's1' },
    ],
    sources: [{ sourceId: 's1', kind: 'user-declared', documentVersionId: 'doc-v1', locator: 'page:1', recordedBy: 'local-organizer' }],
    targets: [{ targetKey: 'case:1', objectKey: 'case:1', subjectId: 'c1', scenario: 'default', fieldValues: {} }],
    modules: [{
      moduleId: 'basic', version: '1', dependsOn: [],
      checks: [{ checkKey: 'need-review', requirement: '需要人工核对材料一致性', sourceIds: ['s1'], targetKeys: ['case:1'], condition: { kind: 'always' }, responsibility: 'reviewer' }],
    }],
    stages: [{ stageId: 'initial-review', role: 'reviewer', mode: 'manual' }],
    outputs: [{ outputId: 'feedback', kind: 'item-feedback' }],
    status: 'candidate-held',
  } as never
}

describe('公共兜底整链', () => {
  test('未匹配候选可保存为草稿并发布，随后建案产生真实 Run 且语义判据不自动通过', async () => {
    const templateId = 'fallback-chain-1'
    const built = fallbackDraftFromB1(b1Document(), templateId)

    // 1. 走既有 template-store 保存草稿
    const saved = saveDraft(built.template)
    expect(saved.status).toBe('draft')

    // 2. 走既有发布通道
    publishTemplate(templateId, built.template.version)
    const published = getTemplate(templateId, built.template.version)!
    expect(published.status).toBe('published')
    // 兜底草稿不得携带任何政策引用
    expect(published.policyVersionIds).toEqual([])
    expect(published.policyRefs).toEqual([])

    // 3. 用已发布模板建真实案卷
    const caseId = 'case-fallback-chain'
    const created = await createCaseFromTemplate(templateId, built.template.version, {
      title: '兜底链路案卷', fieldValues: { organizationName: '地球物理学院', purpose: '课程实验' }, subjects: [],
    } as never, actor, caseId)
    expect(created.ok).toBe(true)

    // 4. 真实审核运行
    const run = runTemplateRuleReview({ caseId })
    expect(run.runId).toContain('run-tpl-')
    expect(run.ruleIds.length).toBeGreaterThan(0)
    const stored = listRunsV2(caseId).find((item) => item.id === run.runId)!
    expect(stored.inputManifest.planFingerprint).toBe(run.planFingerprint)

    // 5. 关键：没有确定性约束的兜底模板，其判据不得被判为 compliant
    // 5. 关键：兜底草稿没有确定性约束，其判据必须停在 awaiting-confirmation，
    //    既不能判 compliant，也不能被当成执行失败（那是两类不同结论）
    expect(stored.checks.length).toBeGreaterThan(0)
    for (const check of stored.checks) {
      expect(check.status).toBe('awaiting-confirmation')
      expect(check.reason).toContain('不是确定性执行类型')
    }
  })
})
