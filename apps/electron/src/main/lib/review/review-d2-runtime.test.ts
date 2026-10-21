/**
 * D2 真实 Pi 案卷业务接口回归：合成材料/模型回执，不代表校方制度真实性。
 * 检查完整任务包、分支作用范围、档案逐操作与跨版本防混用。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Actor, D2ScenarioSelection, ReviewAuthoringWorkspaceV1, ReviewCaseV2 } from '@profer/shared'
import { previewDemo, type DemoState } from './semantic-module-demo'
import { compileD2RuntimePlan, createD2TechnicalCase, makeD2CandidateShell, attachD2RuntimePlan, verifyD2InstalledPlan, verifyD2PiRun } from './review-d2-runtime'
import { createAggregate, readAggregate } from './case-store-v2'
import { registerMaterial } from './material-service'
import { createCaseFromTemplate, setEvidenceLink } from './application-service'
import { saveAuthoringCandidateDraft, saveDraft, isAuthoringCandidateDraft, publishTemplate, getTemplate } from './template-store'
import { preparePiReviewRunV2, submitPiReviewResultV2 } from './pi-case-review-service'
import { getRunV2 } from './run-store-v2'
import { decideWorkspaceCaseV2 } from './workspace-business-service-v2'
import { recordStageDecision, resolveAppealV2 } from './stage-workflow'

const home = mkdtempSync(join(tmpdir(), 'cdut-d2-real-pi-'))
process.env.PROFER_CONFIG_DIR = home
const sourceRoot = join(home, 'sources')
mkdirSync(sourceRoot, { recursive: true })
afterAll(() => rmSync(home, { recursive: true, force: true }))

const actor: Actor = { actorId: 'd2-technical-reviewer', actorSource: 'local', role: 'reviewer' }
const demo = JSON.parse(readFileSync(resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures/d05-synthetic-state.json'), 'utf8')) as DemoState
const familyTarget = { objectKey: 'family-card', subjectId: 'd2-family', title: '家属卡持卡人', kind: 'campus-card' as const, scenario: 'family' }
const serviceTarget = { objectKey: 'service-card', subjectId: 'd2-service', title: '临时服务人员持卡人', kind: 'campus-card' as const, scenario: 'temporary-service' }
const archiveTargets = [
  { objectKey: 'item-1/read', subjectId: 'd2-archive-read', title: '档案一查阅', kind: 'archive-operation' as const, itemId: 'item-1', operation: 'read' as const },
  { objectKey: 'item-1/copy', subjectId: 'd2-archive-copy', title: '档案一复制', kind: 'archive-operation' as const, itemId: 'item-1', operation: 'copy' as const },
  { objectKey: 'item-1', subjectId: 'd2-archive-open', title: '档案一开放状态', kind: 'archive-item' as const, itemId: 'item-1' },
]
function authoring(): ReviewAuthoringWorkspaceV1 {
  const sourceBindings: ReviewAuthoringWorkspaceV1['sourceBindings'] = []
  for (const template of demo.templates) {
    for (const scenario of template.scenarios?.length ? template.scenarios : [undefined]) {
      const preview = previewDemo(demo, template.templateId, template.version, scenario)
      if (preview.blocked) throw new Error(preview.issues.join('；'))
      for (const task of preview.tasks) {
        const checkId = template.templateId + '@' + template.version + ':' + task.checkId
        if (sourceBindings.some((link) => link.checkId === checkId)) continue
        sourceBindings.push({ checkId, sourceIds: task.checkId === 'local/school-decision' ? ['school-policy-unverified'] : ['synthetic-source'] })
      }
    }
  }
  return {
    schemaVersion: 1, workspaceId: 'd2-synthetic', revision: 1,
    definitions: { modules: structuredClone(demo.modules) as ReviewAuthoringWorkspaceV1['definitions']['modules'], templates: structuredClone(demo.templates) as ReviewAuthoringWorkspaceV1['definitions']['templates'] },
    sources: [
      { sourceId: 'synthetic-source', kind: 'synthetic', label: '合成场景要求', verification: 'content-checked', applicability: 'request-scope', note: '只用于测试技术预审，不代表学校规定' },
      { sourceId: 'school-policy-unverified', kind: 'policy-candidate', label: '校方资格待核', verification: 'unverified', applicability: 'unknown', note: '真实校方制度尚未由有权部门确认' },
    ],
    sourceBindings,
  }
}
function selection(templateId: string, scenario?: string): D2ScenarioSelection {
  if (templateId === 'special-campus-card') return { templateId, version: 1, scenario, scenarioObjectKey: scenario === 'family' ? 'family-card' : 'service-card', targets: scenario === 'family' ? [familyTarget] : [serviceTarget] }
  if (templateId === 'archive-access') return { templateId, version: 1, targets: archiveTargets }
  return { templateId, version: 1, targets: [] }
}
function caseV2(id: string, templateId: string): ReviewCaseV2 {
  const now = new Date().toISOString()
  return { id, templateId, templateVersion: 1, title: 'D2 合成审核', objectType: 'document', caseFields: {}, subjects: [], documents: [], stage: 'draft', revision: 0, createdAt: now, updatedAt: now }
}
let serial = 0
async function setup(templateId: string, caseSelection: D2ScenarioSelection) {
  const suffix = String(++serial)
  const id = 'd2-case-' + suffix
  const workspace = authoring()
  saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, templateId, 1))
  const created = await createD2TechnicalCase({
    caseId: id, title: 'D2 合成审核', actor, workspace, selection: caseSelection,
  })
  if (!created.ok) throw new Error(created.message)
  const file = join(sourceRoot, suffix + '.txt')
  writeFileSync(file, '合成测试材料。查阅授权已由申请人提供；复制尚未确认；档案目录可见，开放状态未知；家庭关系材料可核对。')
  let agg = readAggregate(id)!
  const material = await registerMaterial(id, {
    requestId: 'register-' + suffix, actor, expectedRevision: agg.caseV2.revision,
    payload: { sourcePath: file, role: 'evidence' },
  })
  if (!material.ok) throw new Error(material.message)
  agg = readAggregate(id)!
  const doc = agg.caseV2.documents[0]!
  const block = doc.blocks.find((item) => item.kind !== 'image')!
  return {
    id, workspace, aggregate: agg, plan: created.entity!,
    sourceRef: { documentVersionId: doc.versionId, blockId: block.blockId, quote: '查阅授权已由申请人提供' },
  }
}

describe('D2 作者态到 Pi 有效审核规则（BDD）', () => {
  test('Agent JSON CLI 基于固定 workspace 与对象选择无副作用编译 Pi 计划', () => {
    const fixtureRoot = resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures')
    const inputPath = join(home, 'd2-cli-case.json')
    writeFileSync(inputPath, JSON.stringify(caseV2('d2-cli-case', 'archive-access')))
    const run = Bun.spawnSync({
      cmd: [
        process.execPath,
        resolve(import.meta.dir, '../../../../scripts/review-d2-plan.ts'),
        'preview',
        join(fixtureRoot, 'd2-workspace-synthetic.json'),
        join(fixtureRoot, 'd2-selection-archive.json'),
        inputPath,
      ],
      env: { ...process.env, PROFER_CONFIG_DIR: home },
    })
    expect(run.exitCode).toBe(0)
    if (run.exitCode !== 0) throw new Error(run.stderr.toString())
    const plan = JSON.parse(run.stdout.toString()) as { fingerprint: string; publicationAllowed: boolean; rules: Array<{ id: string }> }
    expect(plan.fingerprint).toHaveLength(64)
    expect(plan.rules).toHaveLength(3)
    expect(plan.publicationAllowed).toBeFalse()
  })

  test('不可发布候选只能走显式技术建案，普通正式入口继续拒绝未发布模板', async () => {
    const workspace = authoring()
    saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, 'text-review', 1))
    await expect(createCaseFromTemplate('text-review', 1, {
      title: '不应创建', fieldValues: {}, subjects: [],
    }, actor, 'd2-published-deny')).rejects.toThrow('只有已发布模板')
    const created = await createD2TechnicalCase({
      caseId: 'd2-proper-entry', title: '正常技术预审', actor,
      workspace, selection: selection('text-review'),
    })
    expect(created.ok).toBeTrue()
    expect(readAggregate('d2-proper-entry')?.d2RuntimePlan?.publicationAllowed).toBeFalse()
    saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, 'special-campus-card', 1))
    const corrupt = selection('special-campus-card')
    await expect(createD2TechnicalCase({
      caseId: 'd2-invalid-not-written', title: '错误情景', actor,
      workspace, selection: corrupt,
    })).rejects.toThrow('D2_SCENARIO_REQUIRED')
    expect(readAggregate('d2-invalid-not-written')).toBeUndefined()
  })

  test('Agent JSON CLI 注册候选并建立可运行案卷，不需要绕过正式建案服务', () => {
    const fixtureRoot = resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures')
    const script = resolve(import.meta.dir, '../../../../scripts/review-d2-plan.ts')
    const rootArgs = [
      join(fixtureRoot, 'd2-workspace-synthetic.json'),
      join(fixtureRoot, 'd2-selection-text.json'),
    ]
    const env = { ...process.env, PROFER_CONFIG_DIR: home }
    const registered = Bun.spawnSync({ cmd: [process.execPath, script, 'register', ...rootArgs], env })
    expect(registered.exitCode).toBe(0)
    if (registered.exitCode !== 0) throw new Error(registered.stderr.toString())
    const created = Bun.spawnSync({
      cmd: [process.execPath, script, 'create', ...rootArgs, 'd2-cli-created', 'CLI 技术审核', actor.actorId], env,
    })
    expect(created.exitCode).toBe(0)
    if (created.exitCode !== 0) throw new Error(created.stderr.toString())
    expect(readAggregate('d2-cli-created')?.d2RuntimePlan?.mapping).toHaveLength(1)
    expect(readAggregate('d2-cli-created')?.caseV2.title).toBe('CLI 技术审核')
  })

  test('没有固定 D2 任务包的候选案卷不能绕开技术建案直接运行 Pi', async () => {
    const workspace = authoring()
    saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, 'text-review', 1))
    const id = 'd2-no-fixed-plan'
    await createAggregate(id, caseV2(id, 'text-review'))
    expect(() => preparePiReviewRunV2({
      caseId: id, sessionId: 'd2-missing-plan-session', turnId: 'd2-missing-plan-turn',
    })).toThrow('D2_FIXED_PLAN_MISSING')
    expect(readAggregate(id)?.d2RuntimePlan).toBeUndefined()
  })

  test('D2 计划之外混入额外规则或申报主体应被独立覆盖校验拒止', () => {
    const ws = authoring()
    const plan = compileD2RuntimePlan(ws, selection('archive-access'), caseV2('d2-external-items', 'archive-access'))
    const aggregate = {
      caseV2: {
        ...caseV2('d2-external-items', 'archive-access'),
        caseFields: { d2PlanFingerprint: { kind: 'text' as const, value: plan.fingerprint } },
        reviewRules: structuredClone(plan.rules),
        subjects: structuredClone(plan.subjects),
      },
      d2RuntimePlan: structuredClone(plan),
      observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
    }
    const withRule = structuredClone(aggregate)
    withRule.caseV2.reviewRules.push({ ...plan.rules[0]!, id: 'external-undocumented-rule' })
    expect(verifyD2InstalledPlan(withRule).join('；')).toContain('未登记的外部规则')
    const withSubject = structuredClone(aggregate)
    withSubject.caseV2.subjects.push({ ...plan.subjects[0]!, id: 'external-undocumented-subject' })
    expect(verifyD2InstalledPlan(withSubject).join('；')).toContain('未登记的外部业务主体')
  })

  test('普通文本任务无需业务对象/高级 Claim 图即可编译为单一语义检查', () => {
    const plan = compileD2RuntimePlan(authoring(), selection('text-review'), caseV2('d2-syntactic', 'text-review'))
    expect(plan.rules).toHaveLength(1)
    expect(plan.rules[0]?.targetScope).toBe('case')
    expect(plan.mapping).toHaveLength(1)
    expect(plan.publicationAllowed).toBeFalse()
  })

  test('校园卡 family 分支只激活家属义务，保留不可自动确认为校规的本地责任', () => {
    const workspace = authoring()
    const family = compileD2RuntimePlan(workspace, selection('special-campus-card', 'family'), caseV2('d2-family-compile', 'special-campus-card'))
    const temporary = compileD2RuntimePlan(workspace, selection('special-campus-card', 'temporary-service'), caseV2('d2-temporary-compile', 'special-campus-card'))
    expect(family.rules.map((rule) => rule.requirement).join(' ')).toContain('关联教职工已故')
    expect(family.rules.map((rule) => rule.requirement).join(' ')).not.toContain('派遣协议')
    expect(temporary.rules.map((rule) => rule.requirement).join(' ')).toContain('派遣协议')
    expect(temporary.rules.map((rule) => rule.requirement).join(' ')).not.toContain('关联教职工已故')
    expect(family.mapping.filter((item) => item.subjectId === 'd2-family')).toHaveLength(2)
    expect(temporary.mapping.filter((item) => item.subjectId === 'd2-service')).toHaveLength(2)
    expect(family.rules.find((rule) => rule.confirmation === 'unconfirmed')).toBeDefined()
    expect(family.fingerprint).not.toBe(temporary.fingerprint)
  })

  test('未知情景不能假装不适用；复杂业务对象不允许悬空或串改操作', () => {
    const workspace = authoring()
    const card = caseV2('d2-card-invalid', 'special-campus-card')
    expect(() => compileD2RuntimePlan(workspace, selection('special-campus-card'), card)).toThrow('D2_SCENARIO_REQUIRED')
    expect(() => compileD2RuntimePlan(workspace, { ...selection('special-campus-card', 'family'), scenario: 'invalid' }, card)).toThrow('D2_SCENARIO_REQUIRED')
    expect(() => compileD2RuntimePlan(workspace, {
      templateId: 'special-campus-card', version: 1, scenario: 'family', targets: [],
    }, card)).toThrow('D2_SCENARIO_SCOPE_REQUIRED')
    expect(() => compileD2RuntimePlan(workspace, {
      ...selection('special-campus-card', 'family'),
      targets: [{ objectKey: 'family-card', subjectId: 'd2-family', title: '伪装成档案件', kind: 'archive-item', itemId: 'family-card' }],
    }, card)).toThrow('D2_SCENARIO_SCOPE_REQUIRED')
    const archive = caseV2('d2-archive-invalid', 'archive-access')
    const wrong = structuredClone(selection('archive-access'))
    wrong.targets[0]!.operation = 'copy'
    expect(() => compileD2RuntimePlan(workspace, wrong, archive)).toThrow('D2_TARGET_INVALID')
    const missing = structuredClone(selection('archive-access'))
    missing.targets = missing.targets.filter((it) => it.objectKey !== 'item-1/copy')
    expect(() => compileD2RuntimePlan(workspace, missing, archive)).toThrow('D2_SCOPE_MISSING')
  })

  test('档案 item-1/read 与 item-1/copy 真正生成隔离的 RuleSpec/ReviewSubject', () => {
    const plan = compileD2RuntimePlan(authoring(), selection('archive-access'), caseV2('d2-archive-compile', 'archive-access'))
    expect(plan.rules).toHaveLength(3)
    expect(plan.subjects).toHaveLength(3)
    const read = plan.mapping.find((item) => item.objectKey === 'item-1/read')!
    const copy = plan.mapping.find((item) => item.objectKey === 'item-1/copy')!
    expect(read.subjectId).not.toBe(copy.subjectId)
    expect(read.ruleId).not.toBe(copy.ruleId)
    expect(plan.rules.find((rule) => rule.id === read.ruleId)?.sectionId).not.toBe(plan.rules.find((rule) => rule.id === copy.ruleId)?.sectionId)
  })

  test('普通 Pi 的真实准备/工具回执完成技术检查，但不意味着学校审批资格', async () => {
    const info = await setup('text-review', selection('text-review'))
    expect(verifyD2InstalledPlan(info.aggregate)).toEqual([])
    const prepared = preparePiReviewRunV2({ caseId: info.id, sessionId: 'd2-pi-simple', turnId: 'd2-turn-simple' })
    expect(prepared.userMessage).toContain('D2 固定技术预审包')
    const receipt = submitPiReviewResultV2({
      binding: { assignmentId: prepared.assignmentId, sessionId: 'd2-pi-simple', caseId: info.id, runId: prepared.runId },
      triggeredBy: 'user',
      result: {
        summary: '根据测试原件得到技术预审回执，不产生校方批准。',
        checks: [{ ruleId: info.plan.mapping[0]!.ruleId, subjectIds: [], status: 'compliant', reason: '合成文本核对', sourceRefs: [info.sourceRef] }],
        finish: true,
      },
    })
    expect(receipt.rejected).toEqual([])
    expect(receipt.missingChecks).toEqual([])
    expect(receipt.status).toBe('completed')
    expect(verifyD2PiRun(readAggregate(info.id)!, getRunV2(info.id, prepared.runId)!).complete).toBeTrue()
    const current = readAggregate(info.id)!
    const decision = await decideWorkspaceCaseV2(info.id, {
      requestId: 'd2-forbidden-approval', actor, expectedRevision: current.caseV2.revision,
      payload: { result: 'pass', reason: '不应允许的校方批准', basedOnRunId: prepared.runId, inputHash: getRunV2(info.id, prepared.runId)!.inputManifest.hash },
    })
    expect(decision.ok).toBeFalse()
    if (!decision.ok) expect(decision.code).toBe('AGENT_DECISION_DISABLED')
    const stageDecision = await recordStageDecision(info.id, {
      requestId: 'd2-forbidden-stage', actor, expectedRevision: current.caseV2.revision,
      payload: { action: 'stage-pass', taskId: 'forged-stage-task', reason: '技术审核不能当成行政阶段通过' },
    }, getTemplate('text-review', 1)!)
    expect(stageDecision.ok).toBeFalse()
    if (!stageDecision.ok) expect(stageDecision.code).toBe('AGENT_DECISION_DISABLED')
    const appeal = await resolveAppealV2(info.id, {
      requestId: 'd2-forbidden-appeal', actor, expectedRevision: current.caseV2.revision,
      payload: { appealId: 'forged-appeal', resolution: 'amend-original', reason: '技术审核不能更正不存在的正式决定' },
    })
    expect(appeal.ok).toBeFalse()
    if (!appeal.ok) expect(appeal.code).toBe('AGENT_DECISION_DISABLED')
  })

  test('档案查阅的真实 SourceRef 不得覆盖复制：Pi 续交完成逐操作三项检查', async () => {
    const info = await setup('archive-access', selection('archive-access'))
    // 仅将查阅授权绑定到查阅主体，并由人工确认；复制不可继承该事实。
    const link = await setEvidenceLink(info.id, {
      requestId: 'd2-confirm-read', actor, expectedRevision: readAggregate(info.id)!.caseV2.revision,
      payload: {
        documentVersionId: info.sourceRef.documentVersionId, subjectIds: ['d2-archive-read'],
        supportsFact: 'd2:archive:read', linkedBy: 'user',
      },
    })
    if (!link.ok) throw new Error(link.message)
    const prepared = preparePiReviewRunV2({ caseId: info.id, sessionId: 'd2-pi-archive', turnId: 'd2-archive-turn' })
    const byKey = (key: string) => info.plan.mapping.find((entry) => entry.objectKey === key)!
    const binding = { assignmentId: prepared.assignmentId, sessionId: 'd2-pi-archive', caseId: info.id, runId: prepared.runId }
    const read = byKey('item-1/read')
    const copy = byKey('item-1/copy')
    const open = byKey('item-1')
    const first = submitPiReviewResultV2({
      binding, triggeredBy: 'user',
      result: {
        summary: '目前只核对查阅授权，复制与开放状态都待核。',
        checks: [{ ruleId: read.ruleId, subjectIds: [read.subjectId!], status: 'compliant', reason: '材料仅支持查阅', sourceRefs: [info.sourceRef] }],
        finish: true,
      },
    })
    expect(first.status).toBe('running')
    expect(first.missingChecks.some((text) => text.includes(copy.ruleId))).toBeTrue()
    expect(first.missingChecks.some((text) => text.includes(open.ruleId))).toBeTrue()
    const crossAuthorization = submitPiReviewResultV2({
      binding, triggeredBy: 'user',
      result: {
        summary: '尝试用查阅凭据替代复制授权，应被系统拒绝。',
        checks: [{ ruleId: copy.ruleId, subjectIds: [copy.subjectId!], status: 'compliant', reason: '不应通过', sourceRefs: [info.sourceRef] }],
        finish: true,
      },
    })
    expect(crossAuthorization.rejected.some((entry) => entry.reason.includes('逐操作'))).toBeTrue()
    expect(crossAuthorization.missingChecks.some((entry) => entry.includes(copy.ruleId))).toBeTrue()
    expect(verifyD2PiRun(readAggregate(info.id)!, getRunV2(info.id, prepared.runId)!).complete).toBeFalse()
    const second = submitPiReviewResultV2({
      binding, triggeredBy: 'user',
      result: {
        summary: '复制、档案开放需要有权人工确认，不挪用查阅权限。',
        checks: [
          { ruleId: copy.ruleId, subjectIds: [copy.subjectId!], status: 'awaiting-confirmation', reason: '查阅授权不能覆盖复制，复制权限缺失', sourceRefs: [] },
          { ruleId: open.ruleId, subjectIds: [open.subjectId!], status: 'awaiting-confirmation', reason: '目录可见但馆方开放状态未获确认', sourceRefs: [] },
        ],
        finish: true,
      },
    })
    expect(second.status).toBe('completed')
    expect(second.rejected).toEqual([])
    const run = getRunV2(info.id, prepared.runId)!
    expect(verifyD2PiRun(readAggregate(info.id)!, run)).toMatchObject({ complete: true, problems: [] })
    const scoped = run.checks.filter((check) => check.ruleId === copy.ruleId)
    expect(scoped).toHaveLength(1)
    expect(scoped[0]?.status).toBe('awaiting-confirmation')
    expect(scoped[0]?.target.subjectIds).toEqual([copy.subjectId!])
  })

  test('校园卡正式校规尚未认证时，即使 AI 提交符合结论也必须拒绝', async () => {
    const info = await setup('special-campus-card', selection('special-campus-card', 'family'))
    const prepared = preparePiReviewRunV2({ caseId: info.id, sessionId: 'd2-pi-family', turnId: 'd2-family-turn' })
    const binding = { assignmentId: prepared.assignmentId, sessionId: 'd2-pi-family', caseId: info.id, runId: prepared.runId }
    const pending = info.plan.mapping.find((item) => item.authority === 'unverified-policy')!
    const denied = submitPiReviewResultV2({
      binding, triggeredBy: 'user',
      result: { summary: '错误声称制度符合', checks: [{ ruleId: pending.ruleId, subjectIds: [familyTarget.subjectId], status: 'compliant', reason: '伪造政策判断', sourceRefs: [info.sourceRef] }], finish: true },
    })
    expect(denied.rejected.some((item) => item.reason.includes('尚未确认'))).toBeTrue()
    expect(denied.status).toBe('running')
    const valid = submitPiReviewResultV2({
      binding, triggeredBy: 'user',
      result: {
        summary: '家属卡仅作材料技术预审，校规资格继续待核。',
        checks: info.plan.mapping.map((item) => ({
          ruleId: item.ruleId, subjectIds: item.subjectId ? [item.subjectId] : [familyTarget.subjectId],
          status: 'awaiting-confirmation' as const, reason: '需授权部门根据适用校规与原件复核', sourceRefs: [],
        })), finish: true,
      },
    })
    expect(valid.rejected).toEqual([])
    expect(valid.status).toBe('completed')
    expect(verifyD2PiRun(readAggregate(info.id)!, getRunV2(info.id, prepared.runId)!)).toMatchObject({ complete: true, problems: [] })
  })

  test('冻结计划被改写或输入材料版本变化时拒绝旧 Pi 结果冒用', async () => {
    const info = await setup('text-review', selection('text-review'))
    const prepared = preparePiReviewRunV2({ caseId: info.id, sessionId: 'd2-pi-tamper', turnId: 'd2-tamper-turn' })
    const before = readAggregate(info.id)!
    const changed = structuredClone(before)
    changed.caseV2.reviewRules![0]!.requirement = '改写后的不可信责任'
    expect(verifyD2InstalledPlan(changed).some((text) => text.includes('RuleSpec'))).toBeTrue()
    const after = structuredClone(before)
    after.caseV2.documents[0]!.contentHash = 'altered-hash'
    const run = getRunV2(info.id, prepared.runId)!
    expect(verifyD2PiRun(after, run).complete).toBeFalse()
    expect(verifyD2PiRun(after, run).problems.join(' ')).toContain('输入哈希')
  })

  test('D2 安装资格来自服务端独立登记，删改 sourceNote 也不影响候选技术预审', async () => {
    const workspace = authoring()
    const candidate = makeD2CandidateShell(workspace, 'text-review', 1)
    delete candidate.sourceNote
    saveAuthoringCandidateDraft(candidate)
    expect(isAuthoringCandidateDraft('text-review', 1)).toBeTrue()
    const id = 'd2-note-independent'
    await createAggregate(id, caseV2(id, 'text-review'))
    const attached = await attachD2RuntimePlan({
      caseId: id, requestId: 'd2-no-note', actor,
      expectedRevision: readAggregate(id)!.caseV2.revision,
      workspace, selection: selection('text-review'),
    })
    expect(attached.ok).toBeTrue()
    expect(verifyD2InstalledPlan(readAggregate(id)!)).toEqual([])
    expect(() => publishTemplate('text-review', 1)).toThrow('发布资格')
  })

  test('候选壳始终是草稿，直接发布必须被服务端拒绝', () => {
    const workspace = authoring()
    const draft = makeD2CandidateShell(workspace, 'archive-access', 1)
    expect(draft.status).toBe('draft')
    expect(draft.outputs.some((output) => output.kind === 'approval')).toBeFalse()
    expect(() => publishTemplate('archive-access', 1)).toThrow('候选')
  })
  test('候选模板夹带额外 RuleSpec/政策/审批时，固定 D2 运行不能继续', async () => {
    const workspace = authoring()
    saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, 'text-review', 1))
    const created = await createD2TechnicalCase({
      caseId: 'd2-shell-tampered', title: '静态规则混入拒止', actor,
      workspace, selection: selection('text-review'),
    })
    expect(created.ok).toBeTrue()
    const modified = getTemplate('text-review', 1)!
    modified.sections = [{
      id: 'unauthorized', name: '额外的模板硬性要求', order: 0, required: true,
      criteria: [{ id: 'approval', title: '错误新增校方资格', requirement: '不得暗中混入', execution: 'semantic', targetScope: 'case' }],
    }]
    saveDraft(modified)
    const issues = verifyD2InstalledPlan(readAggregate('d2-shell-tampered')!)
    expect(issues.join('；')).toContain('候选模板壳被加入')
    expect(() => preparePiReviewRunV2({
      caseId: 'd2-shell-tampered', sessionId: 'd2-tamper-shell-session', turnId: 'd2-tamper-shell-turn',
    })).toThrow('D2_FIXED_PLAN_MISMATCH')
  })

})
