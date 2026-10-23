/**
 * D4 50 套模板逐套实挂 Plan 回归。
 *
 * 「50 套可用」不能只看目录能列出、selection 非空——必须每套都真的能
 * 建案 → 编译 → 安装非零 D2 技术计划，否则该套对用户是不可用的。
 * 本测试对全部 50 套逐一走真实 attachD2RuntimePlan。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 'attach50-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { listLocalD4Templates } = await import('./review-v3-main-d4-local-plan')
const { loadD4UnifiedCatalog, loadD4UnifiedWorkspace, resolveD4SourcePath } = await import('./review-d4-catalog')
const { attachD2RuntimePlan } = await import('./review-d2-runtime')
const { saveAuthoringCandidateDraft, getTemplate, isAuthoringCandidateDraft } = await import('./template-store')
const { makeD2CandidateShell } = await import('./review-d2-runtime')
const { readFileSync } = await import('node:fs')
const { createNativeWorkspaceCaseV3 } = await import('./native-workspace-case-v3')

describe('D4 50 套逐套实挂 Plan', () => {
  test('每套都能安装非零技术计划', async () => {
    const list = listLocalD4Templates()
    const catalog = loadD4UnifiedCatalog()
    const results: Array<{ id: string; ok: boolean; checks: number; err?: string }> = []
    const reviewer = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }
    const base = (p: string) => p.replace(/\/workspace(?:\/workspace)?\.json$/, '')

    for (const t of list) {
      const entry = catalog.templates.find(e => e.templateId === t.templateId && e.templateVersion === t.version)
      if (!entry) { results.push({ id: t.templateId, ok: false, checks: 0, err: 'catalog 无条目' }); continue }
      const workspace = loadD4UnifiedWorkspace(entry)
      let snapshot: unknown
      if (t.templateId === 'g01-student-identity-correction') {
        const dir = base(entry.workspacePath)
        snapshot = JSON.parse(readFileSync(resolveD4SourcePath(dir + '/fixtures/controlled-registry.json'), 'utf8'))
      }
      const current = getTemplate(t.templateId, t.version)
      if (current && !isAuthoringCandidateDraft(t.templateId, t.version)) {
        results.push({ id: t.templateId, ok: false, checks: 0, err: '已发布/被占用' }); continue
      }
      if (!current) saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, t.templateId, t.version))
      let caseId = ''
      try {
        // 必须先建真实原生未绑定案卷，attach 才有聚合可写
        const created = await createNativeWorkspaceCaseV3({
          title: 'plan50 ' + t.templateId, type: '综合测评', applicant: 'E2E',
          academicYear: '2026', domainPackId: 'comprehensive-assessment', reviewTemplate: null,
        }, { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' })
        caseId = created.aggregate.caseV2.id
      } catch (e) {
        results.push({ id: t.templateId, ok: false, checks: 0, err: '建案失败: ' + String((e as Error).message).slice(0, 80) }); continue
      }
      try {
        const r = await attachD2RuntimePlan({
          caseId, requestId: 'r-' + t.templateId, actor: reviewer, expectedRevision: 0,
          workspace, selection: t.selection, trustedStudentSnapshot: snapshot as never,
        })
        results.push({ id: t.templateId, ok: r.ok, checks: r.ok ? (r.aggregate.d2RuntimePlan?.mapping.length ?? 0) : 0,
          err: r.ok ? undefined : `${r.code}: ${r.message}` })
      } catch (e) {
        results.push({ id: t.templateId, ok: false, checks: 0, err: String((e as Error).message).slice(0, 120) })
      }
    }

    const ok = results.filter(r => r.ok && r.checks > 0)
    const failed = results.filter(r => !r.ok || r.checks === 0)
    if (failed.length) {
      console.error('未通过：', failed.map(f => `${f.id} -> ${f.err ?? 'checks=0'}`).join('\n'))
    }
    expect(results.length).toBe(50)
    expect(failed).toHaveLength(0)
    // 每套的检查项都必须为正数，防止空 Plan 冒充可用
    for (const r of ok) expect(r.checks).toBeGreaterThan(0)
  }, 120_000)
})
