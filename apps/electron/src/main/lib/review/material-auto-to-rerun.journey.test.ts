/**
 * Merged-path regression: native intake -> automatic role -> selected template
 * -> single Pi run -> human correction -> invalidated old run -> new Pi run.
 * Uses real stores, document tool and submission, with no external model stub.
 */
import { afterAll, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Actor, TemplateVersion } from '@profer/shared'

const config = mkdtempSync(join(tmpdir(), 'review-merged-journey-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))

const { createNativeWorkspaceCaseV3, updateNativeWorkspaceSettingsV3 } = await import('./native-workspace-case-v3')
const { readAggregate, submitCommand } = await import('./case-store-v2')
const { registerMaterial } = await import('./material-service')
const { classifyNewNativeWorkspaceMaterial, reclassifyForSelectedTemplate } = await import('./material-auto-classification')
const { proposeNativeRemediationV3, applyNativeRemediationV3 } = await import('./review-v3-remediation')
const { finishPiReviewRunV2, preparePiReviewRunV2 } = await import('./pi-case-review-service')
const { getRunV2, listRunsV2 } = await import('./run-store-v2')
const { isWorkspaceRunStaleV2 } = await import('./workspace-business-service-v2')
const { publishTemplate, saveDraft } = await import('./template-store')
const { planB3ConservativeRouting } = await import('./review-intake-routing-adapter-v3-b3')
const { buildReviewOpsTools } = await import('../adapters/pi-review-ops-tools')
const { loadD4UnifiedCatalog, loadD4UnifiedWorkspace } = await import('./review-d4-catalog')
const { makeD2CandidateShell, attachD2RuntimePlan, verifyD2InstalledPlan } = await import('./review-d2-runtime')
const { saveAuthoringCandidateDraft } = await import('./template-store')
const { localD4Selection, recoverD4PlanAfterRemediation } = await import('./review-v3-main-d4-local-plan')

const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const templateId = 'merged-auto-to-run-journey'
const template: TemplateVersion = {
  templateId, version: 1, schemaVersion: 2, name: '证书审核', objectType: 'document',
  displayName: { template: '证书审核' }, status: 'draft', createdAt: new Date().toISOString(),
  fields: [], policyVersionIds: [], policyRefs: [], outputs: [],
  materialSlots: [{ id: 'award', name: '荣誉证书', purpose: '获奖证明', requiredAt: 'submission',
    acceptedKinds: ['text'], acceptedRoles: ['evidence'], minCount: 1, maxCount: 10,
    requiredElements: [], allowReuseAcrossSubjects: false }],
  sections: [{ id: 'all', name: '事实核对', order: 1, required: false, criteria: [
    { id: 'check-1', title: '证书核对', requirement: '核对登记材料', execution: 'semantic', targetScope: 'case' },
  ] }],
  stages: [{ id: 'review', name: '初审', kind: 'manual-review', executorRole: 'reviewer' }],
}

function piTools(binding: { caseId: string; sessionId: string; assignmentId: string; runId: string }) {
  const sdk = { defineTool: <T>(tool: T): T => tool }
  const tools = buildReviewOpsTools(sdk as never, {
    sessionId: binding.sessionId, triggeredBy: 'user', allowedRoots: [config], directReviewBinding: binding,
  }) as unknown as Array<{ name: string; execute: (id: string, input: unknown) => Promise<{
    details?: Record<string, unknown>; isError?: boolean
  }> }>
  return (name: string) => {
    const tool = tools.find(item => item.name === name)
    if (!tool) throw new Error('missing Pi tool: ' + name)
    return tool.execute
  }
}

test('merged journey: attachment -> classified -> B3 template -> slot -> Pi -> human correction -> new run', async () => {
  saveDraft(template)
  publishTemplate(templateId, 1)
  const created = await createNativeWorkspaceCaseV3({
    title: '获奖证明案卷', type: '自定义审核', applicant: '本地用户', domainPackId: 'custom', reviewTemplate: null,
  }, actor)
  const caseId = created.aggregate.caseV2.id
  const file = join(config, '荣誉证书-2026.txt')
  writeFileSync(file, '兹证明获得荣誉证书与获奖等级，颁发单位为主办方，2026 年有效。')
  const registered = await registerMaterial(caseId, {
    requestId: 'merged-upload', actor, expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { sourcePath: file, role: 'attachment' },
  })
  expect(registered.ok).toBeTrue()
  if (!registered.ok) throw new Error(registered.message)
  const version = registered.entity!
  await classifyNewNativeWorkspaceMaterial(caseId, version.documentId, version.versionId, actor)
  let current = readAggregate(caseId)!
  expect(current.caseV2.documents[0]).toMatchObject({ role: 'evidence', versionId: version.versionId })
  expect(current.caseV2.documents[0]?.automaticClassification).toBeDefined()

  const materialCandidate = { candidateId: 'staged-1', caseCandidateId: 'staged-case', ownerId: 'local',
    ownerGeneration: 1, status: 'accepted', role: 'supporting', subjectId: 'student', rawSha256: 'a'.repeat(64) }
  const routing = planB3ConservativeRouting({
    startedAtMs: 1_000, nowMs: 21_000, automaticSelectionEnabled: true, userInterrupted: false,
    materialCandidates: [materialCandidate] as never,
    suggestions: [{ templateId, templateVersion: '1', availability: 'authorized-for-technical-selection',
      confidence: 0.98, caseCandidateId: 'staged-case', evidence: [
        { materialCandidateId: 'staged-1', rawSha256: 'a'.repeat(64), reason: '证书材料与模板符合' },
      ] }] as never,
  })
  expect(routing.chosen).toEqual({ templateId, templateVersion: '1' })
  await updateNativeWorkspaceSettingsV3(caseId, {
    caseId, reviewTemplate: { templateId: routing.chosen!.templateId, version: Number(routing.chosen!.templateVersion) },
  }, actor)
  await reclassifyForSelectedTemplate(caseId, actor)
  current = readAggregate(caseId)!
  expect(current.caseV2.documents[0]).toMatchObject({ role: 'evidence', materialSlotId: 'award' })
  expect(current.caseV2.documents[0]?.versionId).toBe(version.versionId)

  const first = preparePiReviewRunV2({ caseId, sessionId: 'merged-pi-session', turnId: 'turn-1' })
  const initialRun = getRunV2(caseId, first.runId)!
  expect(initialRun.inputManifest.frozenPlan?.kind).toBe('published-template')
  expect(listRunsV2(caseId)).toHaveLength(1)
  const binding = { caseId, sessionId: 'merged-pi-session', assignmentId: first.assignmentId, runId: first.runId }
  const doc = readAggregate(caseId)!.caseV2.documents[0]!
  const tool = piTools(binding)
  const read = await tool('review_read_documents')('merged-read', {
    documents: [{ documentVersionId: doc.versionId }],
  })
  expect(read.details?.acceptedCount).toBe(1)
  expect(JSON.stringify(read.details)).toContain('颁发单位')
  const result = await tool('review_submit_result')('merged-submit', {
    summary: '已依据当前分类完成第一次审核',
    checks: [{ ruleId: 'section-all-check-1', subjectIds: [], status: 'awaiting-confirmation',
      reason: '目前只确认文件存在', sourceRefs: [] }], finish: true,
  })
  expect(result.isError).not.toBe(true)
  expect(result.details?.status).toBe('completed')

  const proposed = await proposeNativeRemediationV3({ caseId, requestId: 'merged-propose', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { documentVersionId: doc.versionId, nextRole: 'application', reason: '用户确认这份文件是申请事项' },
  })
  expect(proposed.ok).toBeTrue()
  if (!proposed.ok) throw new Error(proposed.message)
  const applied = await applyNativeRemediationV3({ caseId, requestId: 'merged-apply', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision, payload: { proposalId: proposed.entity!.id },
  })
  expect(applied.ok).toBeTrue()
  current = readAggregate(caseId)!
  expect(current.caseV2.documents[0]).toMatchObject({ role: 'application', versionId: version.versionId })
  expect(current.caseV2.documents[0]?.automaticClassification).toBeUndefined()
  expect(current.caseV2.documents[0]?.classificationCorrection?.role).toBe('application')
  expect(isWorkspaceRunStaleV2(current, first.runId)).toBeTrue()
  expect(current.caseV2.templateId).toBe(templateId)
  const second = preparePiReviewRunV2({ caseId, sessionId: 'merged-pi-session', turnId: 'turn-2' })
  expect(second.runId).not.toBe(first.runId)
  expect(getRunV2(caseId, second.runId)?.status).toBe('running')
  expect(listRunsV2(caseId)).toHaveLength(2)
})

test('formal-plan correction: retire old fingerprint -> select new template -> Pi can start again', async () => {
  const formalTemplateId = 'merged-formal-rebuild-journey'
  saveDraft({ ...template, templateId: formalTemplateId })
  publishTemplate(formalTemplateId, 1)
  const created = await createNativeWorkspaceCaseV3({
    title: '正式计划修订案例', type: '自定义审核', applicant: '本地用户', domainPackId: 'custom',
    reviewTemplate: { templateId: formalTemplateId, version: 1 },
  }, actor)
  const caseId = created.view.id
  const file = join(config, '荣誉证书-正式重审.txt')
  writeFileSync(file, '荣誉证书 兹证明获得二等奖，申请所需原件。')
  const uploaded = await registerMaterial(caseId, {
    requestId: 'formal-upload', actor, expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { sourcePath: file, role: 'attachment' },
  })
  expect(uploaded.ok).toBeTrue()
  if (!uploaded.ok) throw new Error(uploaded.message)
  const doc = uploaded.entity!
  await classifyNewNativeWorkspaceMaterial(caseId, doc.documentId, doc.versionId, actor)
  expect(readAggregate(caseId)!.caseV2.documents[0]?.role).toBe('evidence')
  const first = preparePiReviewRunV2({ caseId, sessionId: 'formal-session', turnId: 'before-edit' })
  const oldRun = getRunV2(caseId, first.runId)!
  const binding = { caseId, sessionId: 'formal-session', runId: first.runId, assignmentId: first.assignmentId }
  await piTools(binding)('review_read_documents')('formal-read', { documents: [{ documentVersionId: doc.versionId }] })
  const submitted = await piTools(binding)('review_submit_result')('formal-submit', {
    summary: '第一轮审核记录', checks: [{ ruleId: 'section-all-check-1', subjectIds: [],
      status: 'awaiting-confirmation', reason: '需核对发证单位', sourceRefs: [] }], finish: true,
  })
  expect(submitted.details?.status).toBe('completed')
  const frozenFingerprint = 'a'.repeat(64)
  const seeded = await submitCommand(caseId, {
    requestId: 'seed-formal-plan-journey', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    type: 'SeedFormalPlanForJourneyTest', payload: {},
  }, () => ({ summary: '为正式计划撤回分支设置测试指纹', mutate: draft => {
    draft.canonicalPlan = { schemaVersion: 'review-c0/1', planId: 'journey-formal-1',
      fingerprint: frozenFingerprint, templateId: formalTemplateId, templateVersion: '1',
      moduleDigests: [], bindings: [] }
  } }))
  expect(seeded.ok).toBeTrue()
  const proposed = await proposeNativeRemediationV3({ caseId, requestId: 'formal-propose', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { documentVersionId: doc.versionId, nextRole: 'application', reason: '用户纠正原件应为申请材料' },
  })
  expect(proposed.ok).toBeTrue()
  if (!proposed.ok) throw new Error(proposed.message)
  const applied = await applyNativeRemediationV3({ caseId, requestId: 'formal-apply', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision, payload: {
      proposalId: proposed.entity!.id, acknowledgedCanonicalFingerprint: frozenFingerprint,
      rebuildAcknowledgement: '我确认旧正式审核计划及结果失效',
    },
  })
  expect(applied.ok).toBeTrue()
  let current = readAggregate(caseId)!
  expect(current.canonicalPlan).toBeUndefined()
  expect(current.canonicalPlanHistory?.at(-1)?.fingerprint).toBe(frozenFingerprint)
  expect(current.caseV2.templateId).toBe('pending-template-v3')
  expect(current.caseV2.documents[0]?.classificationCorrection?.role).toBe('application')
  expect(isWorkspaceRunStaleV2(current, oldRun.id)).toBeTrue()
  await updateNativeWorkspaceSettingsV3(caseId, {
    caseId, reviewTemplate: { templateId: formalTemplateId, version: 1 },
  }, actor)
  await reclassifyForSelectedTemplate(caseId, actor)
  current = readAggregate(caseId)!
  expect(current.caseV2.documents[0]?.role).toBe('application')
  expect(current.caseV2.templateId).toBe(formalTemplateId)
  const second = preparePiReviewRunV2({ caseId, sessionId: 'formal-session', turnId: 'after-edit' })
  expect(second.runId).not.toBe(first.runId)
  expect(getRunV2(caseId, second.runId)?.status).toBe('running')
})

test('actual D4 plan: automatic material role -> frozen technical plan -> Pi -> correction -> rebuild -> Pi', async () => {
  const entry = loadD4UnifiedCatalog().templates.find(item => item.templateId === 'g01-student-identity-correction')!
  const workspace = loadD4UnifiedWorkspace(entry)
  const selection = localD4Selection(entry, entry.workspacePath.replace(/\/workspace(?:\/workspace)?\.json$/, ''))
  const sourceRoot = resolve(import.meta.dir, '../../../../../..')
  const registryPath = join(sourceRoot, 'docs/design/review-agent/acceptance/d4-g01-build/I/fixtures/controlled-registry.json')
  const trustedStudentSnapshot = JSON.parse(readFileSync(registryPath, 'utf8'))
  saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, entry.templateId, entry.templateVersion))
  const created = await createNativeWorkspaceCaseV3({
    title: 'D4 真实自动分类改类重审', type: '自定义审核', applicant: '本地用户',
    domainPackId: 'contract-review', reviewTemplate: null,
  }, actor)
  const caseId = created.view.id
  const file = join(config, '荣誉证书-D4.txt')
  writeFileSync(file, '荣誉证书：兹证明本申请人获得二等奖。')
  const uploaded = await registerMaterial(caseId, { requestId: 'd4-upload', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { sourcePath: file, role: 'attachment' },
  })
  expect(uploaded.ok).toBeTrue()
  if (!uploaded.ok) throw new Error(uploaded.message)
  const doc = uploaded.entity!
  await classifyNewNativeWorkspaceMaterial(caseId, doc.documentId, doc.versionId, actor)
  expect(readAggregate(caseId)!.caseV2.documents[0]?.role).toBe('evidence')
  const attached = await attachD2RuntimePlan({ caseId, requestId: 'd4-attach', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    workspace, selection, trustedStudentSnapshot,
  })
  expect(attached.ok).toBeTrue()
  const withPlan = readAggregate(caseId)!
  const oldFingerprint = withPlan.d2RuntimePlan!.fingerprint
  expect(verifyD2InstalledPlan(withPlan)).toEqual([])
  const first = preparePiReviewRunV2({ caseId, sessionId: 'd4-journey-session', turnId: 'd4-start' })
  const binding = { caseId, sessionId: 'd4-journey-session', assignmentId: first.assignmentId, runId: first.runId }
  const read = await piTools(binding)('review_read_documents')('d4-read', {
    documents: [{ documentVersionId: doc.versionId }],
  })
  expect(read.details?.acceptedCount).toBe(1)
  finishPiReviewRunV2(binding, { status: 'completed' })
  const proposed = await proposeNativeRemediationV3({ caseId, requestId: 'd4-propose', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { documentVersionId: doc.versionId, nextRole: 'application', reason: '此材料实际属于申报主体材料' },
  })
  expect(proposed.ok).toBeTrue()
  if (!proposed.ok) throw new Error(proposed.message)
  const changed = await applyNativeRemediationV3({ caseId, requestId: 'd4-apply', actor,
    expectedRevision: readAggregate(caseId)!.caseV2.revision,
    payload: { proposalId: proposed.entity!.id, acknowledgedD2Fingerprint: oldFingerprint,
      rebuildAcknowledgement: '我确认旧技术预审计划及审核结果失效' },
  })
  expect(changed.ok).toBeTrue()
  const unbound = readAggregate(caseId)!
  expect(unbound.d2RuntimePlan).toBeUndefined()
  expect(unbound.caseV2.documents[0]?.role).toBe('application')
  const recovery = await recoverD4PlanAfterRemediation(caseId, oldFingerprint)
  expect(recovery.status).toBe('rebuilt')
  const restored = readAggregate(caseId)!
  expect(verifyD2InstalledPlan(restored)).toEqual([])
  expect(restored.caseV2.documents[0]?.role).toBe('application')
  expect(isWorkspaceRunStaleV2(restored, first.runId)).toBeTrue()
  const second = preparePiReviewRunV2({ caseId, sessionId: 'd4-journey-session', turnId: 'd4-rerun' })
  expect(second.runId).not.toBe(first.runId)
  expect(getRunV2(caseId, second.runId)?.status).toBe('running')
})
