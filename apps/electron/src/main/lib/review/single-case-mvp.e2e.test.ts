import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, ReviewRunV2, RuleOutlineItem, RulePack, TemplateVersion } from '@profer/shared'
import { createCaseFromTemplate, correctObservation, setEvidenceLink } from './application-service'
import { readAggregate, submitCommand } from './case-store-v2'
import { registerMaterial } from './material-service'
import { publishTemplate, saveDraft } from './template-store'
import { submitCaseV2, respondSupplementV2, resolveSupplementV2 } from './stage-workflow'
import { compileWorkspaceRule } from './workspace-rule-compiler'
import { assembleV2Executors } from './v2-executor-factory'
import { runReviewCaseV2 } from './run-service-v2'
import { readArtifact } from './run-store-v2'
import { acknowledgeWorkspaceMaterialV2, decideWorkspaceCaseV2, openWorkspaceSupplementV2, recordWorkspaceDispositionV2, recordWorkspaceSubjectAdjudicationV2 } from './workspace-business-service-v2'
import { buildReviewWorkspaceViewModel } from '../../../renderer/components/content-review/review-workspace-view-model'
import { exportCaseReport } from './report-export-v2-service'

const CONFIG_DIR = mkdtempSync(join(tmpdir(), 'cdut-single-case-mvp-'))
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const actor: Actor = { actorId: 'mvp-reviewer', actorSource: 'local', role: 'reviewer' }
const caseId = `single-case-mvp-${Date.now()}`
let requestNumber = 0
const nextRequest = (label: string): string => `${label}-${++requestNumber}`
const fixtureRoot = join(import.meta.dir, 'fixtures/mvp-single-case')
const fixture = (path: string): string => join(fixtureRoot, path)

const templateDraft: TemplateVersion = {
  templateId: 'single-case-mvp-e2e', version: 1, schemaVersion: 2, name: '单案 MVP 端到端测试', objectType: 'person',
  displayName: { template: '{{applicant}}' },
  fields: [
    { key: 'applicant', label: '申请人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
    { key: 'level', label: '最终认定等级', kind: 'enum', required: false, visibility: 'public', options: [{ value: '国家级一等奖', label: '国家级一等奖' }, { value: '省级二等奖', label: '省级二等奖' }, { value: '校级二等奖', label: '校级二等奖' }] },
    { key: 'declaredScore', label: '最终认定分值', kind: 'number', required: false, visibility: 'public' },
  ],
  materialSlots: [
    { id: 'application-form', name: '申报表', purpose: '申报事项', acceptedKinds: ['text'], minCount: 1, maxCount: 1, requiredElements: ['事项'], allowReuseAcrossSubjects: false, requiredAt: 'submission' },
    { id: 'certificates', name: '获奖证书', purpose: '事项证明', acceptedKinds: ['text'], minCount: 1, maxCount: 10, requiredElements: ['等级', '日期'], allowReuseAcrossSubjects: true, requiredAt: 'decision' },
  ],
  policyVersionIds: [], policyRefs: [],
  stages: [{ id: 'auto-check', name: '自动核对', kind: 'auto-check', executorRole: 'system', nextStageId: 'final-review' }, { id: 'final-review', name: '人工终审', kind: 'manual-review', executorRole: 'reviewer' }],
  outputs: [{ id: 'item-feedback', kind: 'item-feedback', audience: 'student' }],
  status: 'draft', createdAt: '2026-10-07T00:00:00.000Z',
}

const fakeClient = {
  protocol: 'openai-chat',
  complete: async ({ prompt }: { prompt: string; system: string }) => {
    if (prompt.includes('任务：从下列案卷材料中抽取')) {
      const versionId = prompt.match(/student-application\.txt（(doc-[^\s)]+-v\d+)）/)?.[1]
      const sourceAggregate = readAggregate(caseId)
      const sourceDocument = sourceAggregate?.caseV2.documents.find((document) => document.versionId === versionId)
        ?? sourceAggregate?.caseV2.documents.find((document) => document.role === 'application')
      const subjects = [
        { subjectId: 'subject-a', fieldKey: 'level', value: '国家级一等奖', itemLabel: '事项 A', quote: '申报国家级一等奖' },
        { subjectId: 'subject-b', fieldKey: 'level', value: '国家级一等奖', itemLabel: '事项 B', quote: '申报国家级一等奖' },
        { subjectId: 'subject-c', fieldKey: 'level', value: '校级二等奖', itemLabel: '事项 C', quote: '申报校级二等奖' },
      ]
      return { content: JSON.stringify(subjects.map(({ itemLabel, quote, ...observation }) => {
        const sourceBlock = sourceDocument?.blocks.find((block) => block.text.includes(itemLabel))
        return { ...observation, sourceRefs: [{ documentVersionId: sourceDocument?.versionId, blockId: sourceBlock?.blockId, quote }], confidence: 0.99 }
      })) }
    }
    return { content: JSON.stringify({ opinion: '模拟审核运行完成；请审核员逐项核定。', checks: [] }) }
  },
}

async function runCase(runId: string, template: TemplateVersion): Promise<ReviewRunV2> {
  const aggregate = readAggregate(caseId)!
  const executors = await assembleV2Executors(aggregate, template, { client: fakeClient as never })
  return runReviewCaseV2(aggregate.caseV2, template, executors, {
    runId,
    observationSnapshot: aggregate.observations as unknown as Array<Record<string, unknown>>,
    evidenceSnapshot: aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>,
  })
}

async function addMaterial(path: string, role: 'rule' | 'application' | 'evidence', materialSlotId?: string): Promise<void> {
  const aggregate = readAggregate(caseId)!
  await registerMaterial(caseId, { requestId: nextRequest('register'), actor, expectedRevision: aggregate.caseV2.revision, payload: { sourcePath: fixture(path), role, materialSlotId } })
}

describe('单案审核 MVP 全链路（真实存储与执行器，模型调用使用稳定模拟客户端）', () => {
  test('从材料导入、缺件补交、AI 事实更正到 partial-pass、报告导出和重启恢复', async () => {
    saveDraft(templateDraft)
    const template = publishTemplate(templateDraft.templateId, templateDraft.version)
    const created = await createCaseFromTemplate(template.templateId, template.version, {
      title: '虚构学生林小满综合测评', fieldValues: { applicant: '林小满' }, subjects: [
        { id: 'subject-a', title: '星火竞赛', type: 'item', fieldValues: { declaredScore: 8 } },
        { id: 'subject-b', title: '青禾竞赛', type: 'item', fieldValues: { declaredScore: 8 } },
        { id: 'subject-c', title: '晨星竞赛', type: 'item', fieldValues: { declaredScore: 2 } },
      ],
    }, actor, caseId)
    expect(created.ok).toBeTrue()

    await addMaterial('rules/comprehensive-rules.txt', 'rule')
    await addMaterial('application/student-application.txt', 'application', 'application-form')
    let aggregate = readAggregate(caseId)!
    const ruleDocument = aggregate.caseV2.documents.find((document) => document.role === 'rule')!
    const pack: RulePack = { id: 'mvp-rules', documentId: ruleDocument.documentId, name: '模拟综测规则', publisher: '测试', academicYear: '2025-2026', version: 'v1', confirmed: true, outline: [] }
    const levelOutline: RuleOutlineItem = { id: 'level-mapping', category: '等级分值', title: '等级对应分值', summary: '核对等级和申报分值', constraint: { kind: 'level-mapping', levels: { '国家级一等奖': 8, '省级二等奖': 4, '校级二等奖': 2 } }, anchors: [], generatedBy: 'fixture' }
    const evidenceOutline: RuleOutlineItem = { id: 'required-certificate', category: '材料要求', title: '获奖证书证明', summary: '每个事项须关联一份获奖证书', constraint: { kind: 'required-evidence', requiredEvidenceTypes: ['certificates'] }, anchors: [], generatedBy: 'fixture' }
    const rules = [compileWorkspaceRule(pack, levelOutline), compileWorkspaceRule(pack, evidenceOutline)]
    const ruleUpdate = await submitCommand(caseId, { requestId: nextRequest('rules'), actor, expectedRevision: aggregate.caseV2.revision, type: 'ConfirmWorkspaceRules', payload: {} }, (_current, _payload) => ({
      summary: '确认本次审核规则', mutate: (draft) => { draft.caseV2.reviewRules = rules },
    }))
    expect(ruleUpdate.ok).toBeTrue()

    aggregate = readAggregate(caseId)!
    const submitted = await submitCaseV2(caseId, actor)
    expect(submitted.ok).toBeTrue()
    expect(readAggregate(caseId)?.caseV2.stage).toBe('submitted')
    expect(readAggregate(caseId)?.caseV2.documents.some((document) => document.materialSlotId === 'certificates')).toBeFalse()

    const initialRun = await runCase(`${caseId}-run-1`, template)
    expect(initialRun.coverage.plannedChecks).toBe(6)
    expect(initialRun.inputManifest.effectiveRuleIds).toEqual(rules.map((rule) => rule.id))
    expect(initialRun.checks.filter((check) => check.status === 'awaiting-supplement')).toHaveLength(3)
    const initialExtract = readArtifact<{ observations?: Array<Record<string, unknown>> }>(caseId, initialRun.id, 'node-auto-check-extract')?.observations ?? []
    expect(initialExtract.filter((item) => item.fieldKey === 'level')).toHaveLength(3)
    const initialView = buildReviewWorkspaceViewModel(readAggregate(caseId)!, initialRun, false, initialExtract, template)
    expect(initialView.pendingActions.some((item) => item.kind === 'material-slot' && item.materialSlotId === 'certificates')).toBeTrue()
    expect(initialView.pendingActions.filter((item) => item.kind === 'fact')).toHaveLength(3)

    aggregate = readAggregate(caseId)!
    const supplement = await openWorkspaceSupplementV2(caseId, {
      requestId: nextRequest('open-slot-supplement'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { findingKey: 'material-slot:certificates', runId: initialRun.id, inputHash: initialRun.inputManifest.hash, requiredElements: ['获奖等级', '活动日期'], reason: '缺少逐事项的获奖证明' },
    })
    expect(supplement.ok).toBeTrue()
    const supplementId = supplement.ok ? supplement.entity!.id : ''

    await addMaterial('evidence/competition-certificate.txt', 'evidence', 'certificates')
    aggregate = readAggregate(caseId)!
    const evidenceDocument = aggregate.caseV2.documents.find((document) => document.materialSlotId === 'certificates')!
    const response = await respondSupplementV2(caseId, { requestId: nextRequest('respond'), actor, expectedRevision: aggregate.caseV2.revision, payload: { supplementId, note: '已补交模拟获奖证书', documentVersionIds: [evidenceDocument.versionId] } })
    expect(response.ok).toBeTrue()
    aggregate = readAggregate(caseId)!
    const resolved = await resolveSupplementV2(caseId, { requestId: nextRequest('resolve'), actor, expectedRevision: aggregate.caseV2.revision, payload: { supplementId, outcome: 'satisfied', reason: '已核验补交的证明' } })
    expect(resolved.ok).toBeTrue()

    for (const subjectId of ['subject-a', 'subject-b', 'subject-c']) {
      aggregate = readAggregate(caseId)!
      const linked = await setEvidenceLink(caseId, { requestId: nextRequest('evidence-link'), actor, expectedRevision: aggregate.caseV2.revision, payload: { documentVersionId: evidenceDocument.versionId, subjectIds: [subjectId], supportsFact: '获奖等级与日期', linkedBy: 'user' } })
      expect(linked.ok).toBeTrue()
    }
    for (const document of readAggregate(caseId)!.caseV2.documents) {
      aggregate = readAggregate(caseId)!
      const acknowledged = await acknowledgeWorkspaceMaterialV2(caseId, { requestId: nextRequest('material-read'), actor, expectedRevision: aggregate.caseV2.revision, payload: { documentVersionId: document.versionId, action: 'read', reason: '测试中已核对材料内容' } })
      expect(acknowledged.ok).toBeTrue()
    }

    for (const [subjectId, value] of [['subject-a', '国家级一等奖'], ['subject-b', '省级二等奖'], ['subject-c', '校级二等奖']] as const) {
      aggregate = readAggregate(caseId)!
      const source = initialExtract.find((item) => item.subjectId === subjectId && item.fieldKey === 'level')!
      const corrected = await correctObservation(caseId, {
        requestId: nextRequest('correct-fact'), actor, expectedRevision: aggregate.caseV2.revision,
        payload: { subjectId, fieldKey: 'level', value: { kind: 'enum', value }, sourceRefs: source.sourceRefs as never, reason: '审核员核对申报表与证明后确认等级' },
      })
      expect(corrected.ok).toBeTrue()
    }

    const finalRun = await runCase(`${caseId}-run-2`, template)
    expect(finalRun.inputManifest.hash).not.toBe(initialRun.inputManifest.hash)
    expect(finalRun.coverage.plannedChecks).toBe(6)
    expect(finalRun.checks.filter((check) => check.ruleId.endsWith('level-mapping')).map((check) => check.status)).toEqual(['compliant', 'non-compliant', 'compliant'])
    const finalExtract = readArtifact<{ observations?: Array<Record<string, unknown>> }>(caseId, finalRun.id, 'node-auto-check-extract')?.observations ?? []
    expect(finalExtract.filter((item) => item.fieldKey === 'level' && item.extractedBy === 'user')).toHaveLength(3)

    for (const check of finalRun.checks.filter((candidate) => candidate.status === 'non-compliant')) {
      aggregate = readAggregate(caseId)!
      const disposition = await recordWorkspaceDispositionV2(caseId, {
        requestId: nextRequest('resolve-check'), actor, expectedRevision: aggregate.caseV2.revision,
        payload: { findingKey: check.checkId, disposition: 'waived', reason: '审核员已在事项最终认定中处理此项差异；豁免不等于规则符合', runId: finalRun.id, inputHash: finalRun.inputManifest.hash },
      })
      expect(disposition.ok).toBeTrue()
    }

    const adjudications = [
      { subjectId: 'subject-a', outcome: 'accepted' as const, reason: '等级与 8 分申报一致' },
      { subjectId: 'subject-b', outcome: 'modified' as const, finalFields: { level: { kind: 'enum' as const, value: '省级二等奖' }, declaredScore: { kind: 'number' as const, value: 4 } }, reason: '证书只能支持省级二等奖，按规则改认 4 分' },
      { subjectId: 'subject-c', outcome: 'rejected' as const, reason: '本事项不纳入最终认定' },
    ]
    for (const input of adjudications) {
      aggregate = readAggregate(caseId)!
      const saved = await recordWorkspaceSubjectAdjudicationV2(caseId, { requestId: nextRequest('adjudicate'), actor, expectedRevision: aggregate.caseV2.revision, payload: { ...input, runId: finalRun.id, inputHash: finalRun.inputManifest.hash } })
      expect(saved.ok).toBeTrue()
    }

    aggregate = readAggregate(caseId)!
    const finalDecision = await decideWorkspaceCaseV2(caseId, { requestId: nextRequest('decision'), actor, expectedRevision: aggregate.caseV2.revision, payload: { result: 'partial-pass', reason: '按三项当前最终认定形成部分通过决定', basedOnRunId: finalRun.id, inputHash: finalRun.inputManifest.hash } })
    expect(finalDecision.ok).toBeTrue()
    if (!finalDecision.ok) throw new Error(finalDecision.message)
    expect(finalDecision.entity?.finalScores).toEqual([
      { subjectId: 'subject-a', value: '8', basisRunId: finalRun.id },
      { subjectId: 'subject-b', value: '4', basisRunId: finalRun.id },
      { subjectId: 'subject-c', value: '0', basisRunId: finalRun.id },
    ])

    const report = exportCaseReport(caseId)
    const reportText = readFileSync(report.file, 'utf8')
    expect(reportText).toContain('事项最终认定')
    expect(reportText).toContain('最终分值 4')
    expect(reportText).toContain('有效规则集哈希')
    expect(reportText).toContain('人工豁免（不代表规则符合）')

    const beforeRestart = buildReviewWorkspaceViewModel(finalDecision.aggregate, finalRun, false, finalExtract, template)
    const reloaded = readAggregate(caseId)!
    expect(reloaded.decisions.at(-1)?.result).toBe('partial-pass')
    expect(reloaded.adjudications).toHaveLength(3)
    expect(reloaded.supplements[0]?.status).toBe('satisfied')
    const afterRestart = buildReviewWorkspaceViewModel(reloaded, finalRun, false, finalExtract, template)
    expect(afterRestart.pendingActions).toEqual(beforeRestart.pendingActions)
    expect(afterRestart.resolvedActions).toEqual(beforeRestart.resolvedActions)
    expect(afterRestart.status).toBe(beforeRestart.status)
    expect(afterRestart.status).toBe('decided')
  })
})
