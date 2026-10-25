/**
 * 六套完整业务示例：逐套发布模板 → 建真实案卷 → 出真实 Run。
 *
 * 这不是「导入真实 ZIP」的验收（那需要桌面会话），而是证明六个示例包自带的模板
 * 能走完 Main 的发布与运行链路，而不是只能在界面上做表单试算。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 'six-examples-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { T01_STANDARD_EXAMPLES, createT01ExamplePack } = await import(
  '../../../renderer/components/content-review/review-v3-t01-example-packs'
)
const { saveDraft, publishTemplate } = await import('./template-store')
const { createCaseFromTemplate } = await import('./application-service')
const { runTemplateRuleReview } = await import('./review-v3-main-template-run')

const actor = { actorId: 'local-reviewer', actorSource: 'local' as const, role: 'reviewer' as const }

describe('六套业务示例的模板可走真实运行链路', () => {
  for (const scenario of T01_STANDARD_EXAMPLES) {
    test(`${scenario}：发布示例模板并产出真实 Run`, async () => {
      const pack = createT01ExamplePack(scenario)
      const template = structuredClone(pack.template)
      // 包内模板是草稿形态；发布前清空任何候选态标记，模拟负责人确认后发布
      const templateId = `example-${scenario}`
      const confirmedAt = new Date().toISOString()
      // 示例里的数值门槛是「待负责人确认」的规则，不是可直接执行的规则。
      // 这里模拟负责人在模板编辑器中确认这些门槛，再发布（与真实流程一致）。
      const sections = (template.sections ?? []).map((section) => ({
        ...section,
        criteria: (section.criteria ?? []).map((criterion) => {
          const constraint = (criterion as { deterministicConstraint?: Record<string, unknown> }).deterministicConstraint
          if (!constraint || (constraint as { ownerStatement?: unknown }).ownerStatement) return criterion
          return {
            ...criterion,
            deterministicConstraint: {
              ...constraint,
              ownerStatement: {
                kind: 'owner-statement',
                text: '负责人确认：示例门槛按示例制度执行',
                enteredBy: 'local-template-owner',
                enteredAt: confirmedAt,
              },
            },
          } as never
        }),
      }))
      const draft = { ...template, templateId, version: 1, status: 'draft' as const, sections }
      saveDraft(draft as never)
      publishTemplate(templateId, 1)

      const good = pack.cases.find((item) => item.id === 'conforming')!
      const caseId = `case-example-${scenario}`
      // 必填分项需要至少一条事项（真实用户在建案时也会逐条录入）
      const subjects = (draft.sections ?? [])
        .filter((section) => section.required)
        .map((section, index) => ({
          id: `${section.id}-subject-${index + 1}`,
          title: `${section.name}示例事项`,
          type: 'item' as const,
          sectionId: section.id,
          fieldValues: {},
        }))
      const created = await createCaseFromTemplate(templateId, 1, {
        title: `${scenario} 示例案卷`,
        fieldValues: good.fields as never,
        subjects,
      } as never, actor, caseId)
      expect(created.ok).toBe(true)

      const run = runTemplateRuleReview({ caseId })
      expect(run.runId).toContain('run-tpl-')
      // 关键：示例模板必须真的产出检查项，而不是空跑
      expect(run.checks.length).toBeGreaterThan(0)
      expect(run.ruleIds.length).toBeGreaterThan(0)

      // 反例：示例包自带「不符合」样例，必须被判定为不合规（或至少不能判合规）
      const bad = pack.cases.find((item) => item.id === 'violating')
      if (bad) {
        const badCaseId = `case-example-${scenario}-bad`
        const badCreated = await createCaseFromTemplate(templateId, 1, {
          title: `${scenario} 反例案卷`,
          fieldValues: bad.fields as never,
          subjects,
        } as never, actor, badCaseId)
        expect(badCreated.ok).toBe(true)
        const badRun = runTemplateRuleReview({ caseId: badCaseId })
        const compliantCount = badRun.checks.filter((check) => check.status === 'compliant').length
        const enforced = badRun.checks.filter((check) => check.status === 'non-compliant').length
        // 要么有明确不合规，要么全部停在待确认——绝不允许「全部合规」蒙混过关
        expect(enforced > 0 || compliantCount === 0).toBe(true)
      }
    })
  }
})
