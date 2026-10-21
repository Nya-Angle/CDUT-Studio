/**
 * D4 50 套候选目录必须整体可读：单个候选缺件只让它自己不可用，
 * 不能把 LOCAL_D4_LIST_V3 整套目录拖垮，也不允许用空选择冒充真实对象。
 * G01-I 的受控学籍选择来自冻结 A-prime 资产 fixtures/selections.json 的 two 分支。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { Actor, D2ScenarioSelection, D2TrustedStudentSnapshotV1, ReviewCaseV2 } from '@profer/shared'
import { REVIEW_IPC_CHANNELS } from '@profer/shared'
import { setMainWindow } from '../main-window-state'
import { loadD4UnifiedCatalog, loadD4UnifiedWorkspace, type D4UnifiedEntry } from './review-d4-catalog'
import { buildLocalD4Templates, installC11NativeD4TechnicalPlan, listLocalD4Templates, localD4Selection } from './review-v3-main-d4-local-plan'
import { attachD2RuntimePlan, makeD2CandidateShell, verifyD2InstalledPlan } from './review-d2-runtime'
import { createAggregate, readAggregate } from './case-store-v2'
import { saveAuthoringCandidateDraft } from './template-store'

const home = mkdtempSync(join(tmpdir(), 'cdut-d4-local-plan-'))
process.env.PROFER_CONFIG_DIR = home
afterAll(() => { setMainWindow(null); rmSync(home, { recursive: true, force: true }) })

const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }
const sourceRoot = resolve(import.meta.dir, '../../../../../..')
const readSource = <T>(relative: string): T =>
  JSON.parse(readFileSync(join(sourceRoot, relative), 'utf8')) as T

/** 与 Main 真实入口一致的受控调用环境：只允许主窗口主框架事件。 */
const handlers = (globalThis.__proferElectronTestHooks as typeof globalThis.__proferElectronTestHooks & {
  ipcMainHandlers: Map<string, (...args: unknown[]) => unknown>
}).ipcMainHandlers
const frame = { id: 1 }
const sender = { id: 307, mainFrame: frame, isDestroyed: () => false }
const event = { sender, senderFrame: frame }

const g01iEntry = (): D4UnifiedEntry => {
  const entry = loadD4UnifiedCatalog().templates.find(item => item.templateId === 'g01-student-identity-correction')
  if (!entry) throw new Error('目录缺少 G01-I 候选')
  return entry
}

describe('D4 候选目录整体可读（50/50）', () => {
  test('LOCAL_D4_LIST_V3 返回全部 50 套候选，且每套都带真实冻结选择', () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    installC11NativeD4TechnicalPlan()
    const list = handlers.get(REVIEW_IPC_CHANNELS.LOCAL_D4_LIST_V3)!(event) as ReturnType<typeof listLocalD4Templates>
    expect(list).toHaveLength(50)
    expect(list.filter(item => item.selectionIssue)).toEqual([])
    // 缺件时旧实现返回 targets:[]，这里逐套确认没有空选择冒充。
    expect(list.filter(item => item.selection.targets.length === 0)).toEqual([])
    expect(list.filter(item => !item.name.trim())).toEqual([])
    // 目录本身仍是 50 套（G01 5 / G02 3 / G03 10 / G04 8 / G05 6 / G06 9 / G07 7 / G08 2）
    const domains = list.reduce<Record<string, number>>((counts, item) => {
      counts[item.domain] = (counts[item.domain] ?? 0) + 1
      return counts
    }, {})
    expect(domains).toEqual({ G01: 5, G02: 3, G03: 10, G04: 8, G05: 6, G06: 9, G07: 7, G08: 2 })
    console.log('LOCAL_D4_LIST_V3 可用候选：' + list.length + '/50；带真实选择：' +
      list.filter(item => item.selection.targets.length > 0).length + '/50')
  })

  test('G01-I 使用冻结 two 分支：两个学籍字段各一个 Subject', () => {
    const g01i = listLocalD4Templates().find(item => item.templateId === 'g01-student-identity-correction')!
    expect(g01i.controlledStudentFixture).toBeTrue()
    expect(g01i.selectionIssue).toBeUndefined()
    expect(g01i.selection.templateId).toBe('g01-student-identity-correction')
    expect(g01i.selection.version).toBe(2)
    expect(g01i.selection.scenarios).toEqual(['s01', 's02', 's07'])
    expect(g01i.selection.targets.map(target => ({
      kind: target.kind, studentId: target.studentId, fieldKey: target.fieldKey,
      intent: target.intent, objectKey: target.objectKey,
    }))).toEqual([
      { kind: 'student-field', studentId: 'synthetic-1', fieldKey: 'full-name', intent: 'correction', objectKey: 'synthetic-1/full-name' },
      { kind: 'student-field', studentId: 'synthetic-1', fieldKey: 'credential-id', intent: 'correction', objectKey: 'synthetic-1/credential-id' },
    ])
  })

  test('受控学籍候选缺 selections.json 时如实报缺，不退化成空选择', () => {
    // d4-g01-build/A 是冻结目录内合法路径，但没有 fixtures/selections.json。
    const missing = 'docs/design/review-agent/acceptance/d4-g01-build/A'
    expect(() => localD4Selection(g01iEntry(), missing)).toThrow('D4_SELECTION_MISSING')
  })

  test('单个候选损坏只影响自身，其余候选照常返回', () => {
    const entries = loadD4UnifiedCatalog().templates
    const broken: D4UnifiedEntry = {
      ...g01iEntry(), templateId: 'g01-broken-candidate', templateVersion: 9,
      workspacePath: 'docs/design/review-agent/acceptance/d4-g01-build/Z/workspace/workspace.json',
    }
    const list = buildLocalD4Templates([...entries, broken])
    expect(list).toHaveLength(51)
    const unavailable = list.find(item => item.templateId === 'g01-broken-candidate')!
    expect(unavailable.selectionIssue).toBeTruthy()
    expect(unavailable.selectionIssue).toContain('workspace.json')
    expect(unavailable.selection.targets).toEqual([])
    // 其余 50 套完全不受影响。
    expect(list.filter(item => !item.selectionIssue)).toHaveLength(50)
    expect(list.filter(item => !item.selectionIssue && item.selection.targets.length > 0)).toHaveLength(50)
  })
})

describe('D4 受控学籍候选可以固定出非零技术计划', () => {
  const caseV2 = (id: string): ReviewCaseV2 => {
    const now = new Date().toISOString()
    return {
      id, templateId: 'g01-student-identity-correction', templateVersion: 2,
      title: 'G01-I 受控合成学籍更正', objectType: 'document',
      caseFields: {}, subjects: [], documents: [],
      stage: 'draft', revision: 0, createdAt: now, updatedAt: now,
    }
  }

  test('attachD2RuntimePlan 得到非零 checks，且 verifyD2InstalledPlan 无错', async () => {
    const entry = g01iEntry()
    const workspace = loadD4UnifiedWorkspace(entry)
    const snapshot = readSource<D2TrustedStudentSnapshotV1>(
      'docs/design/review-agent/acceptance/d4-g01-build/I/fixtures/controlled-registry.json')
    const selection = readSource<{ two: D2ScenarioSelection }>(
      'docs/design/review-agent/acceptance/d4-g01-build/I/fixtures/selections.json').two
    // 与 Main 入口一致：先登记受控候选壳，再把选择编译进同一案卷事务。
    saveAuthoringCandidateDraft(makeD2CandidateShell(workspace, entry.templateId, entry.templateVersion))
    const caseId = 'd4-g01i-plan-case'
    await createAggregate(caseId, caseV2(caseId))
    const result = await attachD2RuntimePlan({
      caseId, requestId: 'local-d4-g01i', actor,
      expectedRevision: readAggregate(caseId)!.caseV2.revision,
      workspace, selection, trustedStudentSnapshot: snapshot,
    })
    if (!result.ok) throw new Error(result.code + ': ' + result.message)
    const aggregate = readAggregate(caseId)!
    const plan = aggregate.d2RuntimePlan!
    expect(plan.schemaVersion).toBe(2)
    expect(plan.mapping.length).toBeGreaterThan(0)
    expect(plan.mapping.length).toBe(plan.rules.length)
    expect(plan.fingerprint).toHaveLength(64)
    expect(plan.trustedStudentSnapshot).toMatchObject({ studentId: 'synthetic-1', enrollmentStatus: 'enrolled' })
    // 两个字段各自实例化，且全部按受控快照判定为适用。
    expect([...new Set(plan.mapping.map(item => item.subjectId))].sort())
      .toEqual(['student-id', 'student-name'])
    expect(plan.mapping.filter(item => item.applicability === 'applicable').length).toBeGreaterThan(0)
    expect(plan.mapping.some(item => item.applicability === 'not-applicable')).toBeFalse()
    expect(verifyD2InstalledPlan(aggregate)).toEqual([])
    console.log('G01-I 固定计划：checks=' + plan.mapping.length + '，fingerprint=' + plan.fingerprint)
  })

  test('LOCAL_D4_ATTACH_PLAN_V3 真实入口：原生草稿案卷固定非零 checks 并回传指纹', async () => {
    handlers.clear()
    setMainWindow({ isDestroyed: () => false, webContents: sender } as never)
    installC11NativeD4TechnicalPlan()
    const entry = g01iEntry()
    const selection = readSource<{ two: D2ScenarioSelection }>(
      'docs/design/review-agent/acceptance/d4-g01-build/I/fixtures/selections.json').two
    // 与生产一致：原生工作台建案时模板未绑定（pending-template-v3@0），attach 时一并绑定。
    const caseId = 'd4-g01i-native-case'
    const now = new Date().toISOString()
    const type = 'CreateNativeWorkspaceCaseV3'
    await createAggregate(caseId, {
      ...caseV2(caseId), templateId: 'pending-template-v3', templateVersion: 0,
    }, {
      requestId: 'native-' + caseId, type, payloadHash: 'native-create-' + caseId,
      revision: 0, at: now, summary: '创建原生草稿案卷', actor,
    })
    const handler = handlers.get(REVIEW_IPC_CHANNELS.LOCAL_D4_ATTACH_PLAN_V3)!
    const result = await handler(event, {
      caseId, d4: { selection, useControlledStudentFixture: true },
    }) as { caseId: string; templateId: string; templateVersion: number; checks: number; fingerprint: string }
    expect(result).toMatchObject({
      caseId, templateId: 'g01-student-identity-correction', templateVersion: entry.templateVersion,
    })
    expect(result.checks).toBeGreaterThan(0)
    expect(result.fingerprint).toHaveLength(64)
    const aggregate = readAggregate(caseId)!
    expect(aggregate.d2RuntimePlan!.mapping.length).toBe(result.checks)
    expect(aggregate.caseV2.templateId).toBe('g01-student-identity-correction')
    expect(verifyD2InstalledPlan(aggregate)).toEqual([])
    console.log('LOCAL_D4_ATTACH_PLAN_V3 checks=' + result.checks + '，fingerprint=' + result.fingerprint)
  })
})
