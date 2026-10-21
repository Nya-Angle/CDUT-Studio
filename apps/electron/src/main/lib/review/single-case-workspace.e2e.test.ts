import { afterAll, describe, expect, mock, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, ReviewCase, ReviewCommandResult } from '@profer/shared'
import * as realGateway from './review-model-gateway'
import type { ReviewChatMessage, ReviewChatResult } from './review-model-gateway'

const CONFIG_DIR = mkdtempSync(join(tmpdir(), 'cdut-workspace-e2e-'))
const SOURCE_DIR = join(CONFIG_DIR, 'input')
mkdirSync(SOURCE_DIR, { recursive: true })
process.env.PROFER_CONFIG_DIR = CONFIG_DIR

let applicationDocumentId = ''
let applicationBlockId = ''
let applicationVersionId = ''
let caseUnderTest: ReviewCase | null = null
let reply = ''
const gatewayChannel = {
  id: 'workspace-e2e-channel', name: 'workspace E2E', provider: 'custom', baseUrl: 'http://127.0.0.1:1/v1', apiKey: '',
  models: [{ id: 'fixture-model', name: 'fixture-model', enabled: true }], enabled: true, createdAt: 0, updatedAt: 0,
}

function responseFor(messages: ReviewChatMessage[]): string {
  const system = String(messages.find((message) => message.role === 'system')?.content ?? '')
  if (system.includes('constraint')) {
    return JSON.stringify([
      { category: '等级分值', title: '竞赛等级对应分值', summary: '国家级一等奖 8 分，省级二等奖 4 分', constraint: { kind: 'level-mapping', levels: { '国家级一等奖': 8, '省级二等奖': 4 } }, anchors: [] },
      { category: '材料要求', title: '获奖证明', summary: '须提供获奖证书', constraint: { kind: 'required-evidence', requiredEvidenceTypes: ['获奖证书'] }, anchors: [] },
    ])
  }
  if (system.includes('请从待审文件中识别每一条可审核事项')) {
    return JSON.stringify([{
      title: '青禾竞赛', category: '智育', level: '国家级一等奖', declaredScore: 4,
      activityDate: '2026-05-01', organizer: '校团委', evidenceDocumentIds: [],
      anchor: { documentId: applicationDocumentId, blockId: applicationBlockId, precision: 'block' },
    }])
  }
  return reply
}

mock.module('./review-model-gateway', () => ({
  ...realGateway,
  resolveReviewGatewayChannel: () => ({ channel: gatewayChannel, apiKey: '' }),
  chatCompletion: async (_channel: unknown, messages: ReviewChatMessage[]): Promise<string> => responseFor(messages),
  chatCompletionWithMeta: async (_channel: unknown, messages: ReviewChatMessage[]): Promise<ReviewChatResult> => ({ text: responseFor(messages), imagesDropped: false }),
}))

const { createEmptyCase } = await import('./case-creation')
const { importDocumentFromPath, confirmRulePackInCase } = await import('./case-import')
const { extractItems, generateRuleOutline } = await import('./ai-review-service')
const { ensureBuiltinTemplateDrafts } = await import('./builtin-templates')
const { getTemplate, saveDraft } = await import('./template-store')
const { ensureWorkspaceAggregateV2, syncWorkspaceProjectionV2 } = await import('./workspace-service-v2')
const { readAggregate } = await import('./case-store-v2')
const { correctObservation, setEvidenceLink } = await import('./application-service')
const { registerMaterial } = await import('./material-service')
const { submitCaseV2, respondSupplementV2, resolveSupplementV2 } = await import('./stage-workflow')
const { openWorkspaceSupplementV2, acknowledgeWorkspaceMaterialV2, recordWorkspaceSubjectAdjudicationV2, decideWorkspaceCaseV2 } = await import('./workspace-business-service-v2')
const { assembleV2Executors } = await import('./v2-executor-factory')
const { runReviewCaseV2 } = await import('./run-service-v2')
const { readArtifact } = await import('./run-store-v2')

const actor: Actor = { actorId: 'workspace-e2e-reviewer', actorSource: 'local', role: 'reviewer' }
let requestId = 0
const commandId = (label: string): string => `workspace-${label}-${++requestId}`
function assertCommandSucceeded<TEntity>(result: ReviewCommandResult<TEntity>): asserts result is Extract<ReviewCommandResult<TEntity>, { ok: true }> {
  if (!result.ok) throw new Error(result.message)
}
const file = (name: string, text: string, directory = SOURCE_DIR): string => {
  mkdirSync(directory, { recursive: true })
  const path = join(directory, name)
  writeFileSync(path, text)
  return path
}

async function runCurrentCase(runId: string) {
  const aggregate = readAggregate(caseUnderTest!.id)!
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)!
  const client = {
    protocol: 'openai-chat',
    complete: async ({ prompt }: { prompt: string; system: string }) => {
      if (prompt.includes('任务：从下列案卷材料中抽取事实')) {
        return { content: JSON.stringify([{
          subjectId: aggregate.caseV2.subjects[0]!.id,
          fieldKey: 'level',
          value: '省级二等奖', // Deliberate misrecognition; the reviewer corrects it before the second run.
          sourceRefs: [{ documentVersionId: applicationVersionId, quote: '青禾竞赛' }],
          confidence: 0.71,
        }]) }
      }
      return { content: JSON.stringify({ opinion: '已完成规则核对，请审核员确认材料事实与最终认定。', checks: [] }) }
    },
  }
  const executors = await assembleV2Executors(aggregate, template, { client: client as never })
  return runReviewCaseV2(aggregate.caseV2, template, executors, {
    runId,
    observationSnapshot: aggregate.observations as unknown as Array<Record<string, unknown>>,
    evidenceSnapshot: aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>,
  })
}

describe('普通审核工作台单案完整链路', () => {
  afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

  test('从 V1 建卷到补件与人工认定，额外模板职责未覆盖时拒绝整案通过并持久恢复', async () => {
    ensureBuiltinTemplateDrafts({ getTemplate, saveDraft })
    caseUnderTest = createEmptyCase({ title: '青禾竞赛单案审核', type: '综合测评', applicant: '林小满', academicYear: '2025-2026' })
    let aggregate = await ensureWorkspaceAggregateV2(caseUnderTest.id)

    await importDocumentFromPath({ caseId: caseUnderTest.id, sourcePath: file('竞赛细则.txt', '国家级一等奖 8 分，省级二等奖 4 分。须提供获奖证书。'), role: 'rule' })
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    const rulePack = caseUnderTest.rulePacks[0]!
    await generateRuleOutline({ caseId: caseUnderTest.id, rulePackId: rulePack.id })
    await confirmRulePackInCase(caseUnderTest.id, rulePack.id)
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    expect(caseUnderTest.rulePacks[0]?.outline.map((item) => item.constraint?.kind)).toEqual(['level-mapping', 'required-evidence'])

    await importDocumentFromPath({ caseId: caseUnderTest.id, sourcePath: file('申报表.txt', '申报事项：青禾竞赛，国家级一等奖，申报 8 分。'), role: 'application' })
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    const application = caseUnderTest.documents.find((document) => document.role === 'application')!
    applicationDocumentId = application.id
    applicationBlockId = application.blocks[0]!.id
    applicationVersionId = `${application.id}-v1`
    const items = await extractItems(caseUnderTest.id)
    expect(items).toHaveLength(1)
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    aggregate = await syncWorkspaceProjectionV2(caseUnderTest.id)
    const subjectId = caseUnderTest.items[0]!.id
    expect(aggregate.caseV2.subjects.map((subject) => subject.id)).toContain(subjectId)

    // 新版综测模板对不同材料槽有独立必交门控；旧 E2E 只导入了 V1 申报表。
    // 先在 V2 中登记各槽的合成占位材料，验证真实提交门控而非绕开该约束。
    // 占位材料不包含具体获奖凭证，后续「获奖证书待补」仍应由业务规则发现。
    const activeTemplate = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)!
    for (const slot of activeTemplate.materialSlots.filter((slot) =>
      (slot.requiredAt ?? 'submission') === 'submission' && slot.minCount > 0,
    )) {
      for (let count = 0; count < slot.minCount; count++) {
        const current = readAggregate(caseUnderTest.id)!
        const registered = await registerMaterial(caseUnderTest.id, {
          requestId: commandId('submission-slot-' + slot.id),
          actor,
          expectedRevision: current.caseV2.revision,
          payload: {
            sourcePath: file(`材料槽-${slot.id}-${count}.txt`, '合成材料：仅用于测试材料槽已登记，不能证明获奖资格。'),
            role: 'evidence',
            materialSlotId: slot.id,
          },
        })
        assertCommandSucceeded(registered)
      }
    }

    const submitted = await submitCaseV2(caseUnderTest.id, actor)
    expect(submitted.ok).toBeTrue()
    const firstRun = await runCurrentCase(`${caseUnderTest.id}-run-1`)
    // 现有综测 v3 自带额外通用审核责任；V1 导入的两条显式规则不能因此丢失。
    expect(firstRun.coverage.plannedChecks).toBeGreaterThanOrEqual(2)
    expect((firstRun.inputManifest.effectiveRuleIds ?? []).filter((id) => id.includes('outline-ai-'))).toHaveLength(2)
    const firstChecks = firstRun.checks
    expect(firstChecks.find((check) => check.ruleId.endsWith('outline-ai-1'))?.status).toBe('non-compliant')
    const evidenceCheck = firstChecks.find((check) => check.status === 'awaiting-supplement')!
    aggregate = readAggregate(caseUnderTest.id)!
    const supplementResult = await openWorkspaceSupplementV2(caseUnderTest.id, {
      requestId: commandId('open-supplement'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { findingKey: evidenceCheck.checkId, runId: firstRun.id, inputHash: firstRun.inputManifest.hash, requiredElements: ['获奖证书'], reason: '当前案卷没有可核验的获奖证明' },
    })
    expect(supplementResult.ok).toBeTrue()
    assertCommandSucceeded(supplementResult)
    const supplementId = supplementResult.entity!.id

    const evidencePath = file('获奖证书.txt', '青禾竞赛获奖证书：国家级一等奖。')
    await importDocumentFromPath({ caseId: caseUnderTest.id, sourcePath: evidencePath, role: 'evidence' })
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    aggregate = await syncWorkspaceProjectionV2(caseUnderTest.id)
    const evidenceDocument = aggregate.caseV2.documents.find((document) => document.fileName === '获奖证书.txt')!
    const linked = await setEvidenceLink(caseUnderTest.id, {
      requestId: commandId('evidence-link'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { documentVersionId: evidenceDocument.versionId, subjectIds: [subjectId], supportsFact: '获奖等级', linkedBy: 'user' },
    })
    expect(linked.ok).toBeTrue()
    const extracted = readArtifact<{ observations?: Array<Record<string, unknown>> }>(caseUnderTest.id, firstRun.id, 'node-auto-check-extract')?.observations ?? []
    const aiLevel = extracted.find((item) => item.subjectId === subjectId && item.fieldKey === 'level')!
    aggregate = readAggregate(caseUnderTest.id)!
    const corrected = await correctObservation(caseUnderTest.id, {
      requestId: commandId('correct-level'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: {
        subjectId, fieldKey: 'level', value: { kind: 'text', value: '国家级一等奖' },
        sourceRefs: [{ caseId: caseUnderTest.id, documentVersionId: evidenceDocument.versionId, parseRevision: evidenceDocument.parseRevision, location: { kind: 'file' } }],
        reason: `核对${evidenceDocument.fileName}原件后修正识别结果（原识别：${aiLevel ? String((aiLevel.value as { value?: unknown })?.value ?? aiLevel.value) : '原审核未产出此项观察'}）`,
      },
    })
    expect(corrected.ok).toBeTrue()
    assertCommandSucceeded(corrected)
    aggregate = readAggregate(caseUnderTest.id)!
    const correctedScore = await correctObservation(caseUnderTest.id, {
      requestId: commandId('correct-score'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: {
        subjectId, fieldKey: 'declaredScore', value: { kind: 'number', value: 8 },
        sourceRefs: [{ caseId: caseUnderTest.id, documentVersionId: evidenceDocument.versionId, parseRevision: evidenceDocument.parseRevision, location: { kind: 'file' } }],
        reason: '核对获奖证书后确认应按国家级一等奖计 8 分',
      },
    })
    expect(correctedScore.ok).toBeTrue()
    assertCommandSucceeded(correctedScore)

    aggregate = readAggregate(caseUnderTest.id)!
    const replied = await respondSupplementV2(caseUnderTest.id, {
      requestId: commandId('respond-supplement'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { supplementId, note: '已补交获奖证书', documentVersionIds: [evidenceDocument.versionId] },
    })
    expect(replied.ok).toBeTrue()
    aggregate = readAggregate(caseUnderTest.id)!
    const resolved = await resolveSupplementV2(caseUnderTest.id, {
      requestId: commandId('resolve-supplement'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { supplementId, outcome: 'satisfied', reason: '已核验补交证书' },
    })
    expect(resolved.ok).toBeTrue()

    const replacementEvidence = file('补充说明.txt', '补充说明：证书为原件扫描件。')
    await importDocumentFromPath({ caseId: caseUnderTest.id, sourcePath: replacementEvidence, role: 'evidence' })
    caseUnderTest = (await import('./case-store')).getCase(caseUnderTest.id)!
    aggregate = await syncWorkspaceProjectionV2(caseUnderTest.id)
    expect(aggregate.caseV2.documents.find((document) => document.versionId === evidenceDocument.versionId)?.usage).toBe('read')
    expect(aggregate.evidenceLinks.some((link) => link.documentVersionId === evidenceDocument.versionId && link.status === 'confirmed')).toBeTrue()
    expect(aggregate.observations.some((observation) => observation.id === corrected.entity!.id)).toBeTrue()

    const secondRun = await runCurrentCase(`${caseUnderTest.id}-run-2`)
    expect(secondRun.checks.find((check) => check.ruleId.endsWith('outline-ai-1'))?.status).toBe('compliant')
    const levelCheck = secondRun.checks.find((check) => check.ruleId.endsWith('outline-ai-1'))!
    expect(levelCheck.basis?.observationIds).toContain(corrected.entity!.id)
    expect(levelCheck.basis?.observationIds).toContain(correctedScore.entity!.id)
    expect(levelCheck.basis?.evidenceLinkIds).toHaveLength(1)
    expect(levelCheck.sourceRefs.some((ref) => ref.documentVersionId === evidenceDocument.versionId)).toBeTrue()
    expect(secondRun.checks.every((check) => check.status === 'compliant')).toBeTrue()

    aggregate = readAggregate(caseUnderTest.id)!
    const adjudicated = await recordWorkspaceSubjectAdjudicationV2(caseUnderTest.id, {
      requestId: commandId('adjudicate'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { subjectId, outcome: 'accepted', reason: '等级、分值和获奖证明已核对一致', runId: secondRun.id, inputHash: secondRun.inputManifest.hash },
    })
    expect(adjudicated.ok).toBeTrue()
    assertCommandSucceeded(adjudicated)
    aggregate = readAggregate(caseUnderTest.id)!
    const decision = await decideWorkspaceCaseV2(caseUnderTest.id, {
      requestId: commandId('decision'), actor, expectedRevision: aggregate.caseV2.revision,
      payload: { result: 'pass', reason: '事项认定与审核规则一致', basedOnRunId: secondRun.id, inputHash: secondRun.inputManifest.hash },
    })
    // 当前综测模板还包含自动注入的通用审核责任。此次合成材料仅能证明
    // 两条 V1 依据规则完成，不能证明额外职责均已真正完成或具备正式通过条件。
    // 因此必须检查安全拒止，而不是为让旧 E2E 通过就关闭 readiness 门控。
    expect(decision.ok).toBeFalse()
    if (decision.ok) throw new Error('新增模板要求未完成时不应自动形成整案通过决定')
    expect(decision.code).toBe('DEPENDENCY_UNRESOLVED')
    expect(decision.message).toContain('阻断最终决定')

    // 模拟重启：人工事项认定持久保存，但无正式通过决定，待办继续保留。
    const restored = readAggregate(caseUnderTest.id)!
    expect(restored.caseV2.stage).not.toBe('decided')
    expect(restored.adjudications?.some((record) => record.id === adjudicated.entity!.id)).toBeTrue()
    expect(restored.decisions.some((entry) => entry.result === 'pass')).toBeFalse()
  })
})
