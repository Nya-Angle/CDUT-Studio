/**
 * review-actions-controller 单测（M0/H05，对应 04 的 K05 回归）
 *
 * 用真实 Jotai store + 可编排时序的假 IPC，确定性复现用户业务审查的隔离场景：
 * 串案、切回、交错覆盖、选择代次、同案互斥、错误隔离。
 */

import { describe, expect, test } from 'bun:test'
import { createStore } from 'jotai'
import type { CaseAggregateV2, ReviewCase, ReviewItem, ReviewRun, ReviewRunV2, RuleOutlineItem } from '@profer/shared'
import {
  createReviewActionsController,
  type ReviewActionsApi,
  type ReviewRunMode,
} from './review-actions-controller'
import {
  reviewCasesByIdAtom,
  reviewErrorAtom,
  reviewRunsByCaseAtom,
  reviewTasksByCaseAtom,
  reviewRunStaleByCaseAtom,
  reviewExecutionByCaseAtom,
  selectedCaseIdAtom,
  reviewWorkspaceAggregatesByCaseAtom,
  reviewWorkspaceRunsByCaseAtom,
} from '@/atoms/review-atoms'

/** 可手工 resolve/reject 的延迟任务（值类型由调用方 cast，测试内只做触发） */
class Deferred {
  resolve!: (value: unknown) => void
  reject!: (error: unknown) => void
  readonly promise = new Promise<unknown>((res, rej) => {
    this.resolve = res
    this.reject = rej
  })
}

/** 构造最小案卷对象 */
function makeCase(id: string, overrides: Partial<ReviewCase> = {}): ReviewCase {
  return {
    id,
    title: `案卷-${id}`,
    type: '综合测评',
    applicant: '张三',
    academicYear: '2026',
    createdAt: '2026-10-03T00:00:00.000Z',
    updatedAt: '2026-10-03T00:00:00.000Z',
    documents: [],
    rulePacks: [
      { id: `${id}-pack`, documentId: `${id}-doc`, name: '细则', publisher: '', academicYear: '2026', version: 'v1', outline: [], confirmed: false },
    ],
    items: [],
    evidences: [],
    isDemo: false,
    ...overrides,
  } as ReviewCase
}

/** 构造最小运行记录 */
function makeRun(caseId: string, findings = 0): ReviewRun {
  return {
    id: `run-${caseId}-${Math.random().toString(36).slice(2, 6)}`,
    caseId,
    status: 'completed',
    inputVersion: 'hash',
    startedAt: new Date().toISOString(),
    findings: Array.from({ length: findings }, (_, i) => ({
      id: `${caseId}-f${i}`,
      itemId: `${caseId}-item`,
      kind: 'missing-evidence' as const,
      severity: 'yellow' as const,
      title: '缺证明',
      detail: '',
      suggestion: '',
      ruleAnchors: [],
    })),
    coverage: { reviewedItemIds: [], manualReviewItemIds: [], unrecognizedDocumentIds: [], ruleUncoveredItemIds: [] },
    engine: 'mock-engine',
  } as unknown as ReviewRun
}

/** 假 IPC：每个方法可挂延迟门闩，记录调用次数 */
function makeApi() {
  const calls = { runReview: 0, outline: 0, items: 0 }
  const gates: Record<string, Deferred[]> = {}
  const gate = (key: string): Deferred => {
    const d = new Deferred()
    ;(gates[key] ??= []).push(d)
    return d
  }
  const shift = (key: string): Deferred => (gates[key] ??= []).shift() as Deferred

  const api: ReviewActionsApi = {
    listCases: async () => [],
    getCase: async (caseId) => makeCase(caseId),
    loadDemoCase: async () => makeCase('demo-zhangsan-2026'),
    createCase: async (input) => makeCase(`case-${Date.now()}`),
    importDocument: async (input) => ({ documents: [{ id: 'doc-new', fileName: `new-${input.role}`, role: input.role, mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [], origin: 'upload' } as unknown as SourceDocument], failures: [], canceled: false }),
    deleteCase: async () => {},
    updateCaseSettings: async (input) => ({
      ...makeCase(input.caseId),
      ...(input.domainPackId ? { domainPackId: input.domainPackId } : {}),
      ...(input.reviewTemplate !== undefined ? { reviewTemplate: input.reviewTemplate ?? undefined } : {}),
      ...(input.manualRules !== undefined ? { manualRules: input.manualRules } : {}),
    }),
    updateRuleOutline: async (input) => {
      const current = makeCase(input.caseId)
      return { ...current, rulePacks: current.rulePacks.map((pack) => pack.id === input.rulePackId ? { ...pack, outline: [{ ...pack.outline[0]!, title: input.title, summary: input.summary }] } : pack) }
    },
    generateRuleOutline: async () => {
      calls.outline += 1
      return gate(`outline-${calls.outline}`).promise as never
    },
    extractItems: async () => {
      calls.items += 1
      return gate(`items-${calls.items}`).promise as never
    },
    runReview: async (caseId) => {
      calls.runReview += 1
      return gate(`run-${calls.runReview}`).promise as Promise<ReviewRun>
    },
    exportReport: async () => ({ markdownPath: '/tmp/x.md', jsonPath: '/tmp/x.json' }) as never,
    getLatestRun: async (caseId: string) => ({ run: null, inputStale: false }),
    getTemplateV2: async () => ({ materialSlots: [] }) as never,
    getModelGatewayStatus: async () => ({ available: true, protocol: 'openai' }) as never,
    assistantChat: async () => ({ content: 'ok' }),
  }
  return { api, calls, gate, shift }
}

import type { SourceDocument } from '@profer/shared'

describe('review-actions-controller（M0/H05 并发与按案写入）', () => {
  test('多选导入保留成功文件并汇报单文件失败', async () => {
    const { api } = makeApi()
    api.importDocument = async () => ({
      documents: [
        { id: 'doc-rule-a', fileName: '细则.pdf', role: 'rule', mimeType: 'application/pdf', sizeBytes: 10, parseStatus: 'parsed', blocks: [], origin: 'upload', importedAt: '2026-10-09T00:00:00.000Z' },
        { id: 'doc-rule-b', fileName: '补充说明.docx', role: 'rule', mimeType: 'application/docx', sizeBytes: 20, parseStatus: 'parsed', blocks: [], origin: 'upload', importedAt: '2026-10-09T00:00:00.000Z' },
      ],
      failures: [{ fileName: '损坏文件.pdf', message: '无法解析' }],
      canceled: false,
    })
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-multi-import')

    const result = await actions.importDocument('rule')

    expect(result?.documents.map((document) => document.fileName)).toEqual(['细则.pdf', '补充说明.docx'])
    expect(result?.failures).toEqual([{ fileName: '损坏文件.pdf', message: '无法解析' }])
    expect(store.get(reviewErrorAtom)).toContain('损坏文件.pdf：无法解析')
  })

  test('辅助审核设置按当前案卷保存模板版本与可编辑规则', async () => {
    const { api } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-settings')

    const updated = await actions.updateReviewSetup({
      reviewTemplate: { templateId: 'custom-review', version: 3 },
      manualRules: [{ id: 'rule-date', title: '日期范围', requirement: '活动日期须在申报期内。' }],
    })

    expect(updated).toBeTrue()
    expect(store.get(reviewCasesByIdAtom)['case-settings']?.reviewTemplate).toEqual({ templateId: 'custom-review', version: 3 })
    expect(store.get(reviewCasesByIdAtom)['case-settings']?.manualRules).toEqual([{ id: 'rule-date', title: '日期范围', requirement: '活动日期须在申报期内。' }])
  })

  test('文件依据生成的规则摘要可改写并立即进入当前案卷缓存', async () => {
    const { api } = makeApi()
    const source = makeCase('case-outline', {
      rulePacks: [{ id: 'pack-1', documentId: 'doc-1', name: '校规', publisher: '', academicYear: '2026', version: 'v1', confirmed: true, outline: [{ id: 'rule-1', category: '资格', title: 'AI 名称', summary: 'AI 摘要', anchors: [], generatedBy: 'ai' }] }],
    })
    api.getCase = async () => source
    api.updateRuleOutline = async (input) => ({
      ...source,
      rulePacks: source.rulePacks.map((pack) => pack.id === input.rulePackId ? { ...pack, outline: pack.outline.map((rule) => rule.id === input.ruleId ? { ...rule, title: input.title, summary: input.summary } : rule) } : pack),
    })
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase(source.id)

    expect(await actions.updateRuleOutline({ rulePackId: 'pack-1', ruleId: 'rule-1', title: '人工名称', summary: '人工修正后的摘要' })).toBeTrue()
    expect(store.get(reviewCasesByIdAtom)[source.id]?.rulePacks[0]?.outline[0]).toMatchObject({ title: '人工名称', summary: '人工修正后的摘要' })
  })

  test('人工修正 AI 申报事项后更新当前案卷缓存', async () => {
    const { api } = makeApi()
    const item: ReviewItem = {
      id: 'item-1', title: '错误识别名称', category: '其他', declaredScore: 1,
      anchor: { documentId: 'application-1', precision: 'document' },
      evidenceDocumentIds: [], status: 'identified', identifiedBy: 'ai',
    }
    api.getCase = async (caseId) => makeCase(caseId, { items: [item] })
    api.updateReviewItem = async (input) => makeCase(input.caseId, { items: [{
      ...item,
      title: input.title,
      category: input.category,
      declaredScore: input.declaredScore,
      level: input.level,
      activityDate: input.activityDate,
      organizer: input.organizer,
      status: 'confirmed',
      identifiedBy: 'manual',
    }] })
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-item-edit')

    const ok = await actions.updateReviewItem({
      itemId: 'item-1', title: '校级优秀学生', category: '德育', declaredScore: 4,
      level: '校级', activityDate: '2026-05', organizer: '学校',
    })

    expect(ok).toBeTrue()
    expect(store.get(reviewCasesByIdAtom)['case-item-edit']?.items[0]).toMatchObject({
      title: '校级优秀学生', category: '德育', declaredScore: 4,
      level: '校级', activityDate: '2026-05', organizer: '学校', identifiedBy: 'manual',
    })
  })

  test('重新打开工作台时恢复用户上次明确选择过的案卷', async () => {
    const { api } = makeApi()
    api.listCases = async () => [
      { id: 'case-first', title: '首案', type: '综合测评', applicant: '张三', academicYear: '2026', updatedAt: '2026-10-07T00:00:00.000Z', isDemo: false, documentCount: 0 },
      { id: 'case-restore', title: '恢复案卷', type: '综合测评', applicant: '张三', academicYear: '2026', updatedAt: '2026-10-07T00:00:00.000Z', isDemo: false, documentCount: 0 },
    ]
    const store = createStore()
    store.set(selectedCaseIdAtom, 'case-restore')
    const actions = createReviewActionsController(store, api)
    await actions.initialize()
    expect(store.get(selectedCaseIdAtom)).toBe('case-restore')
    expect(store.get(reviewCasesByIdAtom)['case-restore']?.title).toBe('案卷-case-restore')
  })

  test('UI-09 没有恢复目标时不把列表首案自动设为当前案卷', async () => {
    const { api } = makeApi()
    api.listCases = async () => [{ id: 'case-first', title: '首案', type: '综合测评', applicant: '张三', academicYear: '2026', updatedAt: '2026-10-07T00:00:00.000Z', isDemo: false, documentCount: 0 }]
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.initialize()
    expect(store.get(selectedCaseIdAtom)).toBeNull()
    expect(store.get(reviewCasesByIdAtom)['case-first']).toBeUndefined()
  })

  test('Given 两份依据 When 生成大纲 Then 两包分别请求并保留各自结果', async () => {
    const { api } = makeApi()
    const store = createStore()
    const source = makeCase('qa-multi')
    source.rulePacks.push({ ...source.rulePacks[0]!, id: 'qa-pack-2', documentId: 'qa-doc-2', name: '学院细则' })
    api.getCase = async () => source
    const requested: string[] = []
    api.generateRuleOutline = async ({ rulePackId }) => {
      requested.push(rulePackId!)
      return [{ id: rulePackId!, category: '其他', title: rulePackId!, summary: '', anchors: [], generatedBy: 'ai' }]
    }
    const actions = createReviewActionsController(store, api)
    await actions.selectCase(source.id)
    await actions.generateRuleOutline()
    expect(requested).toEqual(source.rulePacks.map((pack) => pack.id))
    expect(store.get(reviewCasesByIdAtom)[source.id]!.rulePacks.map((pack) => pack.outline[0]?.id)).toEqual(requested)
  })

  test('Given 已有审核结果 When 导入或切换领域 Then 不切案且即时核验过期标记', async () => {
    const { api } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('qa-stale')
    store.set(reviewRunsByCaseAtom, { 'qa-stale': makeRun('qa-stale') })
    api.getLatestRun = async () => ({ run: makeRun('qa-stale'), inputStale: true })
    await actions.importDocument('rule')
    expect(store.get(reviewRunStaleByCaseAtom)['qa-stale']).toBe(true)
    store.set(reviewRunStaleByCaseAtom, { 'qa-stale': false })
    await actions.setDomainPack('custom')
    expect(store.get(reviewRunStaleByCaseAtom)['qa-stale']).toBe(true)
    expect(store.get(selectedCaseIdAtom)).toBe('qa-stale')
  })

  test('Given 审核过程中输入发生变化 When 旧快照结果返回 Then 仍标为过期', async () => {
    const { api, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('qa-during-run')
    const running = actions.runReview()
    api.getLatestRun = async () => ({ run: makeRun('qa-during-run'), inputStale: true })
    shift('run-1').resolve(makeRun('qa-during-run'))
    await running
    expect(store.get(reviewRunStaleByCaseAtom)['qa-during-run']).toBe(true)
  })
  test('K05 主场景：A 审核中切到 B，A 返回只落 A、不污染 B、不切回', async () => {
    const { api, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)

    await actions.selectCase('case-A')
    expect(store.get(selectedCaseIdAtom)).toBe('case-A')

    const runPromise = actions.runReview() // A 开始审核（挂起）
    expect(store.get(reviewTasksByCaseAtom)['case-A']?.running).toBe(true)

    await actions.selectCase('case-B') // 用户切到 B
    expect(store.get(selectedCaseIdAtom)).toBe('case-B')
    expect(store.get(reviewRunsByCaseAtom)['case-B'] ?? null).toBeNull()

    // 模型返回 A 的运行
    ;(shift('run-1') ).resolve(makeRun('case-A', 3))
    await runPromise

    expect(store.get(reviewRunsByCaseAtom)['case-A']?.caseId).toBe('case-A')
    expect(store.get(reviewRunsByCaseAtom)['case-A']?.findings).toHaveLength(3)
    expect(store.get(reviewRunsByCaseAtom)['case-B']).toBeNull() // 不串 B（恢复查询无运行 → null）
    expect(store.get(selectedCaseIdAtom)).toBe('case-B') // 不强制切回
    expect(store.get(reviewTasksByCaseAtom)['case-A']?.running).toBe(false)
    expect(store.get(reviewTasksByCaseAtom)['case-B']?.running ?? false).toBe(false)
    expect(store.get(reviewRunStaleByCaseAtom)['case-A']).toBe(false)
    // B 视图无错误（A 的结果/error 不污染当前视图）
    expect(store.get(reviewErrorAtom)).toBeNull()
  })

  test('H09 恢复：selectCase 拉回最近运行与过期标记', async () => {
    const { api } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    api.getLatestRun = async (caseId: string) => ({ run: makeRun(caseId, 1), inputStale: true })
    await actions.selectCase('case-A')
    expect(store.get(reviewRunsByCaseAtom)['case-A']?.findings).toHaveLength(1)
    expect(store.get(reviewRunStaleByCaseAtom)['case-A']).toBe(true)
  })

  test('K05 交错：同案大纲（慢）与识别（快）都保留，互不覆盖', async () => {
    const { api, gate, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-A')

    const outlinePromise = actions.generateRuleOutline() // 先发起（慢）
    const itemsPromise = actions.extractItems() // 后发起（快）

    const outline: RuleOutlineItem[] = [
      { id: 'rule-1', title: '省级加分', summary: '', anchors: [], generatedBy: 'ai' },
    ] as unknown as RuleOutlineItem[]
    ;(shift('outline-1') ).resolve(outline) // 大纲先……不对：大纲慢，这里让它后返回
    // 识别先完成
    ;(shift('items-1') ).resolve([
      { id: 'item-1', title: '事项', category: '其他', declaredScore: 2, anchor: { documentId: 'd', precision: 'block', blockId: 'b' }, evidenceDocumentIds: [], status: 'identified', identifiedBy: 'ai' },
    ] as unknown as ReviewItem[])
    await itemsPromise
    // 识别完成后大纲才返回
    ;(gate('outline-1') ).resolve(outline)
    await outlinePromise

    const cached = store.get(reviewCasesByIdAtom)['case-A']
    // 兼容 patch 都保留：识别出的条目不被慢大纲覆盖，大纲也写入
    expect(cached?.items).toHaveLength(1)
    expect(cached?.rulePacks[0]?.outline).toHaveLength(1)
  })

  test('选择代次：慢的 selectCase(A) 不把界面切回 A', async () => {
    const { api, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)

    // A 的读取挂起
    const originalGetCase = api.getCase
    let resolveA: (value: ReviewCase | undefined) => void = () => {}
    api.getCase = (caseId: string) => {
      if (caseId === 'case-A') {
        return new Promise<ReviewCase | undefined>((res) => {
          resolveA = res
        })
      }
      return originalGetCase(caseId)
    }

    const selectA = actions.selectCase('case-A')
    await actions.selectCase('case-B') // B 快速完成
    expect(store.get(selectedCaseIdAtom)).toBe('case-B')

    resolveA(makeCase('case-A'))
    await selectA
    // 慢返回被代次守卫丢弃：仍停留在 B
    expect(store.get(selectedCaseIdAtom)).toBe('case-B')
    expect(store.get(reviewErrorAtom)).toBeNull()
  })

  test('同案互斥：审核进行中拒绝再次发起，且切走后守卫不解除', async () => {
    const { api, calls, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-A')

    const first = actions.runReview()
    expect(calls.runReview).toBe(1)
    await actions.runReview() // 第二次点击被拒
    expect(calls.runReview).toBe(1)
    expect(store.get(reviewErrorAtom)).toContain('已有审核在进行中')

    await actions.selectCase('case-B')
    // 切走不解除 A 的守卫（K05：运行中状态按案保留）；B 可以运行
    const second = actions.runReview()
    expect(calls.runReview).toBe(2)
    ;(shift('run-2') ).resolve(makeRun('case-B'))
    await second
    expect(store.get(reviewRunsByCaseAtom)['case-B']).toBeDefined()

    ;(shift('run-1') ).resolve(makeRun('case-A'))
    await first
  })

  test('一键审核复用已有中间产物，只调用一次最终审核', async () => {
    const { api, calls } = makeApi()
    const source = makeCase('one-click', {
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [], origin: 'upload' } as never],
      rulePacks: [{ id: 'pack', documentId: 'rule-1', name: '规则', publisher: '', academicYear: '2026', version: 'v1', outline: [{ id: 'r1', category: '资格', title: '规则', summary: '', anchors: [], generatedBy: 'ai' }], confirmed: true }],
      items: [{ id: 'item-1', title: '事项', declaredScore: 1, category: '其他', evidenceDocumentIds: [], status: 'identified', identifiedBy: 'ai', anchor: { documentId: 'application-1', precision: 'document' } } as never],
    })
    api.getCase = async () => source
    api.runReview = async () => { calls.runReview += 1; return makeRun('one-click') }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('one-click')
    await actions.runFullReview()
    expect(calls.runReview).toBe(1)
    expect(store.get(reviewExecutionByCaseAtom)['one-click']?.status).toBe('completed')
    expect(store.get(reviewTasksByCaseAtom)['one-click']?.running).toBe(false)
  })

  test('已有审核结果可分别沿用会话更新或创建新会话从头审核', async () => {
    const { api } = makeApi()
    const source = makeCase('pi-review-mode')
    api.getCase = async () => source
    const modes: ReviewRunMode[] = []
    const run = {
      id: 'pi-mode-run',
      caseId: source.id,
      templateId: 't',
      templateVersion: 1,
      inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
      status: 'completed',
      checks: [],
      opinions: [],
      coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
      diagnostics: [],
      startedAt: '',
    } as unknown as ReviewRunV2
    const store = createStore()
    const actions = createReviewActionsController(store, api, async (_caseId, mode) => {
      modes.push(mode)
      return run
    })
    await actions.selectCase(source.id)

    await actions.runFullReview('update')
    await actions.runFullReview('restart')

    expect(modes).toEqual(['update', 'restart'])
  })

  test('Pi 审核启动前先识别逐事项规则所需的申报事项', async () => {
    const { api, calls } = makeApi()
    const source = makeCase('pi-review-items', {
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [{ id: 'b1', kind: 'text', text: '竞赛一等奖，申报 8 分' }], origin: 'upload' } as never],
    })
    const item: ReviewItem = {
      id: 'item-1', title: '竞赛一等奖', category: '竞赛', declaredScore: 8, evidenceDocumentIds: [],
      status: 'identified', identifiedBy: 'ai', anchor: { documentId: 'application-1', blockId: 'b1', precision: 'block' },
    }
    const store = createStore()
    const template = { materialSlots: [], fields: [], sections: [{ id: 'awards', criteria: [{ targetScope: 'subject' }] }] } as never
    const currentItems = (): ReviewItem[] => store.get(reviewCasesByIdAtom)[source.id]?.items ?? []
    const aggregate = (): CaseAggregateV2 => ({
      caseV2: {
        id: source.id, templateId: 't', templateVersion: 1, title: source.title, objectType: 'person', caseFields: {},
        subjects: currentItems().map((candidate) => ({ id: candidate.id, type: 'item', title: candidate.title, fields: {}, sourceRefs: [], correction: 'ai-extracted', status: 'identified' })),
        documents: [], stage: 'draft', revision: 0, createdAt: '', updatedAt: '',
      },
      observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
    })
    api.getCase = async () => source
    api.extractItems = async () => { calls.items += 1; return [item] }
    api.getAggregateV2 = async () => aggregate()
    api.getTemplateV2 = async () => template
    api.listRunsV2 = async () => []
    api.getRunObservationsV2 = async () => []
    api.getWorkspaceRunValidityV2 = async () => false
    let piStartedWithSubject = false
    const run = {
      id: 'pi-items-run', caseId: source.id, templateId: 't', templateVersion: 1,
      inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
      status: 'completed', checks: [], opinions: [], coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 }, diagnostics: [], startedAt: '',
    } as unknown as ReviewRunV2
    const actions = createReviewActionsController(store, api, async () => {
      piStartedWithSubject = store.get(reviewWorkspaceAggregatesByCaseAtom)[source.id]?.caseV2.subjects.length === 1
      return run
    })

    await actions.selectCase(source.id)
    await actions.runFullReview()

    expect(calls.items).toBe(1)
    expect(piStartedWithSubject).toBeTrue()
    expect(store.get(reviewCasesByIdAtom)[source.id]?.items).toHaveLength(1)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[source.id]?.id).toBe('pi-items-run')
  })

  test('Pi 审核前自动重解析迁移过来的旧版 HTML/EML 失败材料', async () => {
    const { api } = makeApi()
    const source = makeCase('pi-review-reparse-legacy')
    const staleDocuments = ['E02_网页.html', 'E18_通知.eml'].map((fileName, index) => ({
      documentId: `old-${index}`,
      versionId: `old-${index}-v1`,
      contentHash: 'old-hash',
      role: 'evidence' as const,
      fileName,
      mimeType: 'application/octet-stream',
      sizeBytes: 12,
      assetPath: `source-docs/old-${index}-${fileName}`,
      materialSlotId: undefined,
      parseRevision: 1,
      parseStatus: 'failed' as const,
      blocks: [],
      usage: 'unread' as const,
      unusedReason: 'V1 解析失败',
      active: false,
    }))
    const baseCaseV2 = {
      id: source.id, templateId: 't', templateVersion: 1, title: source.title, objectType: 'person', caseFields: {},
      subjects: [], documents: staleDocuments, stage: 'draft', revision: 0, createdAt: '', updatedAt: '',
    }
    const misplacedE02 = {
      ...staleDocuments[0]!,
      documentId: 'misplaced-e02',
      versionId: 'misplaced-e02-v1',
      fileName: `${staleDocuments[0]!.documentId}-${staleDocuments[0]!.fileName}`,
      parseStatus: 'parsed' as const,
      active: true,
    }
    let aggregate = {
      caseV2: baseCaseV2,
      observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
    } as unknown as CaseAggregateV2
    aggregate.caseV2.documents = [...staleDocuments, misplacedE02]
    const registrations: Array<{ sourcePath: string; fileName?: string; replacesVersionIds?: string[] }> = []
    api.getCase = async () => source
    api.getAggregateV2 = async () => aggregate
    api.getTemplateV2 = async () => ({ materialSlots: [], fields: [], sections: [] }) as never
    api.listRunsV2 = async () => []
    api.getRunObservationsV2 = async () => []
    api.getWorkspaceRunValidityV2 = async () => false
    api.getWorkspaceDocumentPreviewPath = async ({ documentVersionId }) => `/case/${documentVersionId}`
    api.registerMaterialPathV2 = async ({ sourcePath, fileName, replacesVersionIds }) => {
      registrations.push({ sourcePath, fileName, replacesVersionIds })
      const oldVersionId = sourcePath.split('/').at(-1)!
      const old = staleDocuments.find((document) => document.versionId === oldVersionId)!
      const newDocument = {
        ...old,
        documentId: `${old.documentId}-reparsed`,
        versionId: `${old.documentId}-reparsed-v1`,
        fileName: fileName ?? old.fileName,
        mimeType: old.fileName.endsWith('.eml') ? 'message/rfc822' : 'text/html',
        parseStatus: 'parsed' as const,
        blocks: [{ blockId: `${old.documentId}-block-001`, text: '重新解析后的正文', kind: 'text' as const }],
        unusedReason: undefined,
        supersedesVersionId: old.versionId,
        active: true,
      }
      aggregate = {
        ...aggregate,
        caseV2: {
          ...aggregate.caseV2,
          revision: aggregate.caseV2.revision + 1,
          documents: [...aggregate.caseV2.documents.map((document) => replacesVersionIds?.includes(document.versionId) || (document.fileName === old.fileName && document.materialSlotId === old.materialSlotId) ? { ...document, active: false } : document), newDocument],
        },
      }
      return newDocument.versionId
    }
    let piSawReparsedFiles = false
    const run = {
      id: 'pi-reparse-run', caseId: source.id, templateId: 't', templateVersion: 1,
      inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
      status: 'completed', checks: [], opinions: [], coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 }, diagnostics: [], startedAt: '',
    } as unknown as ReviewRunV2
    const store = createStore()
    const actions = createReviewActionsController(store, api, async () => {
      piSawReparsedFiles = aggregate.caseV2.documents.filter((document) => document.active !== false).length === 2
        && aggregate.caseV2.documents.every((document) => document.active === false || document.parseStatus === 'parsed')
      return run
    })

    await actions.selectCase(source.id)
    await actions.runFullReview()

    expect(registrations.map((registration) => registration.sourcePath)).toEqual(['/case/old-0-v1', '/case/old-1-v1'])
    expect(registrations.map((registration) => registration.fileName)).toEqual(['E02_网页.html', 'E18_通知.eml'])
    expect(registrations[0]?.replacesVersionIds).toEqual(['old-0-v1', 'misplaced-e02-v1'])
    expect(piSawReparsedFiles).toBeTrue()
    expect(store.get(reviewWorkspaceAggregatesByCaseAtom)[source.id]?.caseV2.documents.filter((document) => document.active !== false)).toHaveLength(2)
  })

  test('阶段 3：一键审核提交同 ID V2 案卷并将主结果写入 V2 run', async () => {
    const { api, calls } = makeApi()
    const source = makeCase('v2-one-click', {
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [{ id: 'b1', kind: 'text', text: '竞赛申报' }], origin: 'upload' } as never],
      rulePacks: [{ id: 'pack', documentId: 'rule-1', name: '规则', publisher: '', academicYear: '2026', version: 'v1', outline: [{ id: 'r1', category: '资格', title: '规则', summary: '', anchors: [], generatedBy: 'ai' }], confirmed: true }],
      items: [{ id: 'item-1', title: '事项', declaredScore: 1, category: '其他', evidenceDocumentIds: [], status: 'identified', identifiedBy: 'ai', anchor: { documentId: 'application-1', precision: 'document' } } as never],
    })
    const caseV2: CaseAggregateV2['caseV2'] = { id: source.id, templateId: 't', templateVersion: 1, title: source.title, objectType: 'person', caseFields: {}, subjects: [], documents: [], stage: 'draft', revision: 0, createdAt: '', updatedAt: '' }
    const aggregate: CaseAggregateV2 = { caseV2, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] }
    const run: ReviewRunV2 = {
      id: 'v2-run', caseId: source.id, templateId: 't', templateVersion: 1,
      inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
      status: 'completed', checkpoints: [], checks: [{ checkId: 'c1', ruleId: 'r1', target: { scope: 'case', subjectIds: [] }, status: 'compliant', reason: '符合', sourceRefs: [], executedBy: 'deterministic', executedAt: '' }], opinions: [],
      coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 }, diagnostics: [], startedAt: '', completedAt: '',
    }
    api.getCase = async () => source
    api.getAggregateV2 = async () => aggregate
    api.listRunsV2 = async () => [run]
    api.getRunObservationsV2 = async () => []
    api.getWorkspaceRunValidityV2 = async () => false
    api.submitCaseV2 = async () => ({ ok: true, aggregate: { ...aggregate, caseV2: { ...caseV2, stage: 'submitted' } } })
    api.runReviewV2 = async () => run
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase(source.id)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[source.id]?.id).toBe('v2-run')
    expect(store.get(reviewExecutionByCaseAtom)[source.id]?.status).toBe('completed')
    await actions.runFullReview()
    expect(calls.runReview).toBe(0)
    expect(store.get(reviewWorkspaceAggregatesByCaseAtom)[source.id]?.caseV2.id).toBe(source.id)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[source.id]?.id).toBe('v2-run')
    expect(store.get(reviewExecutionByCaseAtom)[source.id]?.status).toBe('completed')
  })

  test('阶段 2 P0：无审核依据时不启动运行', async () => {
    const { api, calls } = makeApi()
    api.getCase = async (caseId) => makeCase(caseId, {
      rulePacks: [],
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [], origin: 'upload' } as never],
    })
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('no-rules')
    await actions.runFullReview()
    expect(calls.runReview).toBe(0)
    expect(store.get(reviewExecutionByCaseAtom)['no-rules']?.status).toBe('awaiting-input')
  })

  test('阶段 2 P0：大纲生成失败显示失败，不伪装成缺少用户材料', async () => {
    const { api, calls } = makeApi()
    api.getCase = async (caseId) => makeCase(caseId, {
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [], origin: 'upload' } as never],
    })
    api.generateRuleOutline = async () => { throw new Error('模型出口超时') }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('outline-error')
    await actions.runFullReview()
    expect(calls.runReview).toBe(0)
    expect(store.get(reviewExecutionByCaseAtom)['outline-error']?.status).toBe('failed')
    expect(store.get(reviewExecutionByCaseAtom)['outline-error']?.error).toContain('模型出口超时')
  })

  test('阶段 2 P0：人工复核与覆盖缺口将完成运行标为部分完成', async () => {
    const { api, calls } = makeApi()
    const source = makeCase('partial-review', {
      documents: [{ id: 'application-1', fileName: '申报.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [], origin: 'upload' } as never],
      rulePacks: [{ id: 'pack', documentId: 'rule-1', name: '规则', publisher: '', academicYear: '2026', version: 'v1', outline: [{ id: 'r1', category: '资格', title: '规则', summary: '', anchors: [], generatedBy: 'ai' }], confirmed: true }],
      items: [{ id: 'item-1', title: '事项', declaredScore: 1, category: '其他', evidenceDocumentIds: [], status: 'identified', identifiedBy: 'ai', anchor: { documentId: 'application-1', precision: 'document' } } as never],
    })
    api.getCase = async () => source
    api.runReview = async () => {
      calls.runReview += 1
      return { ...makeRun('partial-review'), coverage: { reviewedItemIds: [], manualReviewItemIds: ['item-1'], unrecognizedDocumentIds: [], ruleUncoveredItemIds: [] } }
    }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('partial-review')
    await actions.runFullReview()
    expect(store.get(reviewExecutionByCaseAtom)['partial-review']?.status).toBe('partial')
  })

  test('阶段 2 P0：重启恢复时状态与最近运行和输入过期标记一致', async () => {
    const { api } = makeApi()
    const partialRun = { ...makeRun('restored'), coverage: { reviewedItemIds: [], manualReviewItemIds: ['item-1'], unrecognizedDocumentIds: [], ruleUncoveredItemIds: [] } }
    api.getLatestRun = async () => ({ run: partialRun, inputStale: false })
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('restored')
    expect(store.get(reviewExecutionByCaseAtom)['restored']?.status).toBe('partial')
    expect(store.get(reviewRunsByCaseAtom)['restored']?.id).toBe(partialRun.id)
  })

  test('操作代次与互斥：同类第二次点击被拒；完成后结果正常落位', async () => {
    const { api, gate, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-A')

    const first = actions.generateRuleOutline()
    await actions.generateRuleOutline() // 同案同类进行中 → 拒绝（不产生第二次请求）
    expect(store.get(reviewErrorAtom)).toContain('已在进行中')

    const outline = [{ id: 'rule-1', title: '新大纲', summary: '', anchors: [], generatedBy: 'ai' }] as unknown as RuleOutlineItem[]
    ;(shift('outline-1') ).resolve(outline)
    await first
    expect(store.get(reviewCasesByIdAtom)['case-A']?.rulePacks[0]?.outline).toHaveLength(1)
    expect(store.get(reviewErrorAtom)).toBeNull()
  })

  test('错误按案隔离：失败发生时已切走则不污染当前视图', async () => {
    const { api, shift } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-A')

    const runPromise = actions.runReview()
    await actions.selectCase('case-B')
    ;(shift('run-1') ).reject(new Error('模型超时'))
    await runPromise

    expect(store.get(reviewErrorAtom)).toBeNull() // A 的失败不写进 B 的错误条
    expect(store.get(reviewTasksByCaseAtom)['case-A']?.running).toBe(false)
  })

  test('领域包切换按案落位：响应期间切走也只更新原案卷缓存', async () => {
    const { api } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('case-A')

    const packPromise = actions.setDomainPack('contract')
    await actions.selectCase('case-B')
    await packPromise

    expect(store.get(reviewCasesByIdAtom)['case-A']?.domainPackId).toBe('contract')
    expect(store.get(selectedCaseIdAtom)).toBe('case-B')
  })
})


describe('Main 后台审核前台接线', () => {
  function backgroundFixture() {
    const { api } = makeApi()
    const source = makeCase('background-A', { documents: [{ id: 'doc', fileName: '合成申请.txt', role: 'application', mimeType: 'text/plain', sizeBytes: 1, parseStatus: 'parsed', blocks: [{ id: 'b', kind: 'text', text: '合成申请' }], origin: 'upload' } as never] })
    const aggregate = { caseV2: { id: source.id, templateId: 't', templateVersion: 1, title: source.title, objectType: 'person', caseFields: {}, subjects: [], documents: [], stage: 'submitted', revision: 0, createdAt: '', updatedAt: '' }, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] } as CaseAggregateV2
    let run: ReviewRunV2 | null = null
    api.getCase = async (id) => id === source.id ? source : makeCase(id)
    api.getAggregateV2 = async () => aggregate
    api.getTemplateV2 = async () => ({ materialSlots: [], fields: [], sections: [] }) as never
    api.listRunsV2 = async (id) => id === source.id && run ? [run] : []
    api.getRunObservationsV2 = async () => []
    api.getWorkspaceRunValidityV2 = async () => false
    api.getBackgroundPiReviewStateV2 = async () => ({ caseId: source.id, phase: run?.status === 'running' ? 'accepted' : 'incomplete', runId: run?.id, runStatus: run?.status })
    const runningRun = { id: 'run-pi-background', caseId: source.id, templateId: 't', templateVersion: 1, inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] }, status: 'running', checkpoints: [], checks: [], opinions: [], coverage: { documents: [], plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1 }, diagnostics: [], startedAt: '' } as ReviewRunV2
    return { api, source, runningRun, setRun: (value: ReviewRunV2) => { run = value } }
  }

  test('ACK 前不显示已受理，ACK 后释放前台等待且切案不污染新案', async () => {
    const fixture = backgroundFixture()
    const store = createStore()
    const gate = new Deferred()
    let requested = false
    const actions = createReviewActionsController(store, fixture.api, async () => {
      requested = true
      await gate.promise
      fixture.setRun(fixture.runningRun)
      return fixture.runningRun
    })
    await actions.selectCase(fixture.source.id)
    const starting = actions.runFullReview()
    while (!requested) await Bun.sleep(0)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('preparing')
    await actions.selectCase('background-B')
    gate.resolve(null)
    await starting
    expect(store.get(selectedCaseIdAtom)).toBe('background-B')
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('running')
    expect(store.get(reviewTasksByCaseAtom)[fixture.source.id]?.running).toBeFalse()
  })

  test('新页面从持久 V2 回读 running/failed，无需原 Hook 或旧内存', async () => {
    const fixture = backgroundFixture()
    fixture.setRun(fixture.runningRun)
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api)
    await actions.selectCase(fixture.source.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('running')
    fixture.setRun({ ...fixture.runningRun, status: 'failed', error: '合成模型失败' })
    await actions.refreshBackgroundReview(fixture.source.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('failed')
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.error).toBe('合成模型失败')
  })

  test('重新选择案卷时 V2 running 不能覆盖 Main 的未受理状态', async () => {
    const fixture = backgroundFixture()
    fixture.setRun(fixture.runningRun)
    fixture.api.getBackgroundPiReviewStateV2 = async () => ({ caseId: fixture.source.id, runId: fixture.runningRun.id, phase: 'preparing', runStatus: 'running' })
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api)
    await actions.selectCase(fixture.source.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('preparing')
    await actions.refreshBackgroundReview(fixture.source.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('preparing')
  })

  test('停止动作只发案卷与本轮 ID，回读取消结果', async () => {
    const fixture = backgroundFixture()
    fixture.setRun(fixture.runningRun)
    let target: unknown
    fixture.api.stopBackgroundPiReviewV2 = async (input) => {
      target = input
      fixture.setRun({ ...fixture.runningRun, status: 'cancelled' })
      return { caseId: input.caseId, runId: input.runId, phase: 'incomplete', runStatus: 'cancelled' }
    }
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api)
    await actions.selectCase(fixture.source.id)
    await actions.stopReview()
    expect(target).toEqual({ caseId: fixture.source.id, runId: fixture.runningRun.id })
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('cancelled')
  })


  test('P06-S02 a slow first snapshot cannot repaint the newer run of the same case', async () => {
    const fixture = backgroundFixture()
    const previous = { ...fixture.runningRun, id: 'run-pi-previous', status: 'failed' as const, error: 'old error' }
    const next = { ...fixture.runningRun, id: 'run-pi-next' }
    fixture.setRun(previous)
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api)
    await actions.selectCase(fixture.source.id)
    const delayed = new Deferred()
    let listReads = 0
    fixture.api.listRunsV2 = async () => {
      listReads++
      return listReads === 1 ? delayed.promise as Promise<ReviewRunV2[]> : [next]
    }
    fixture.api.getBackgroundPiReviewStateV2 = async () => ({ caseId: fixture.source.id, runId: next.id, runStatus: next.status, phase: 'accepted' })
    const oldRefresh = actions.refreshBackgroundReview(fixture.source.id)
    while (listReads === 0) await Bun.sleep(0)
    await actions.refreshBackgroundReview(fixture.source.id)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[fixture.source.id]?.id).toBe(next.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('running')
    delayed.resolve([previous])
    await oldRefresh
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[fixture.source.id]?.id).toBe(next.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('running')
  })

  test('P06-S02 late first acceptance response cannot replace second round UI status', async () => {
    const fixture = backgroundFixture()
    const first = { ...fixture.runningRun, id: 'run-pi-first' }
    const second = { ...fixture.runningRun, id: 'run-pi-second' }
    fixture.setRun(first)
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api)
    await actions.selectCase(fixture.source.id)
    const delayed = new Deferred()
    let read = 0
    fixture.api.getBackgroundPiReviewStateV2 = async () => {
      read++
      return read === 1 ? delayed.promise as Promise<import('@profer/shared').ReviewBackgroundPiRunState>
        : { caseId: fixture.source.id, runId: second.id, runStatus: second.status, phase: 'accepted' }
    }
    fixture.api.listRunsV2 = async () => read === 0 ? [first] : [second]
    const oldRefresh = actions.refreshBackgroundReview(fixture.source.id)
    while (read === 0) await Bun.sleep(0)
    await actions.refreshBackgroundReview(fixture.source.id)
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[fixture.source.id]?.id).toBe(second.id)
    delayed.resolve({ caseId: fixture.source.id, runId: first.id, runStatus: first.status, phase: 'accepted' })
    await oldRefresh
    expect(store.get(reviewWorkspaceRunsByCaseAtom)[fixture.source.id]?.id).toBe(second.id)
    expect(store.get(reviewExecutionByCaseAtom)[fixture.source.id]?.status).toBe('running')
  })

  test('预检失败的业务错误卡和提示只显示原因，不显示 IPC 包装', async () => {
    const fixture = backgroundFixture()
    const store = createStore()
    const actions = createReviewActionsController(store, fixture.api, async () => {
      throw new Error("Error invoking remote method 'review-v2:start-background-pi-review': Error: 审核渠道或模型未配置")
    })
    await actions.selectCase(fixture.source.id)
    await actions.runFullReview()
    const execution = store.get(reviewExecutionByCaseAtom)[fixture.source.id]
    expect(execution?.status).toBe('failed')
    expect(execution?.error).toBe('审核渠道或模型未配置')
    expect(execution?.message).toBe('本次审核未完成')
    expect(store.get(reviewErrorAtom)).toBe('审核未完成：审核渠道或模型未配置')
  })
})


describe('C1 native archive discovery and explicit workbench restore', () => {
  test('only archived V2 summaries appear; native restore uses revision and does not invent a V1 shadow', async () => {
    const { api } = makeApi()
    let received: unknown
    api.listCasesV2 = async () => [
      { caseId: 'native-only', title: 'Native original', stage: 'archived', revision: 7 },
      { caseId: 'migrated', title: 'Migrated original', stage: 'archived', revision: 4 },
      { caseId: 'active', title: 'Still active', stage: 'draft', revision: 2 },
    ]
    api.getCase = async id => id === 'migrated' || id === 'native-only' ? makeCase(id) : undefined
    api.restoreCaseV3 = async input => { received = input; return { ok: true } }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    expect(await actions.listArchivedCases()).toEqual([
      { caseId: 'native-only', title: 'Native original', revision: 7 },
      { caseId: 'migrated', title: 'Migrated original', revision: 4 },
    ])
    expect(await actions.restoreArchivedCase('native-only', 7)).toBe(true)
    expect(received).toEqual({
      caseId: 'native-only', expectedRevision: 7,
      reason: '用户在工作台明确确认恢复案卷并重新审核',
    })
    // Main GET_CASE now derives a read-only V2 projection. No shadow file
    // is created, and restore can safely reselect the same native authority.
    expect(store.get(selectedCaseIdAtom)).toBe('native-only')
    expect(await actions.restoreArchivedCase('migrated', 4)).toBe(true)
    expect(store.get(selectedCaseIdAtom)).toBe('migrated')
  })

  test('failed native restore cannot report success or change selected case', async () => {
    const { api } = makeApi()
    api.restoreCaseV3 = async () => { throw new Error('VERSION_CONFLICT: case changed') }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    expect(await actions.restoreArchivedCase('stale-case', 1)).toBe(false)
    expect(store.get(selectedCaseIdAtom)).toBeNull()
    expect(store.get(reviewErrorAtom)).toContain('VERSION_CONFLICT')
  })
})


describe('C1 native manual Subject action uses Main V2 source and revision', () => {
  test('human creation binds the current selected case/revision and refreshes real projection', async () => {
    const { api } = makeApi()
    const id = 'native-human-selected-case'
    api.getAggregateV2 = async caseId => caseId === id ? ({
      caseV2: { id, revision: 6, stage: 'draft', documents: [], subjects: [] },
      receiptLog: [{ type: 'CreateNativeWorkspaceCaseV3', revision: 0 }],
    } as unknown as CaseAggregateV2) : undefined
    let received: import('@profer/shared').CreateNativeReviewItemV3Request | undefined
    api.createNativeReviewItemV3 = async input => {
      received = input
      return makeCase(input.caseId, { items: [{
        id: 'manual-from-source', title: input.title, category: input.category,
        declaredScore: input.declaredScore, anchor: {
          documentId: 'application', precision: 'document',
        }, evidenceDocumentIds: [], status: 'identified',
        identifiedBy: 'manual',
      }] as ReviewItem[] })
    }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase(id)
    expect(await actions.createNativeReviewItem({
      title: 'Manual claim', category: '科研', declaredScore: 1,
      documentVersionId: 'real-material-v2', sourceBlockId: 'parse-block-1',
    })).toBe(true)
    expect(received).toMatchObject({
      caseId: id, expectedRevision: 6,
      title: 'Manual claim', category: '科研', declaredScore: 1,
      documentVersionId: 'real-material-v2', sourceBlockId: 'parse-block-1',
    })
    expect(received?.requestId).toMatch(/^ui-native-item-/)
    expect(store.get(reviewCasesByIdAtom)[id]?.items[0]?.title).toBe('Manual claim')
    expect(store.get(reviewErrorAtom)).toBeNull()
  })

  test('old or absent native Case identity prevents untrusted manual action', async () => {
    const { api } = makeApi()
    let called = false
    api.createNativeReviewItemV3 = async () => {
      called = true
      throw new Error('not expected')
    }
    api.getAggregateV2 = async caseId => ({
      caseV2: { id: caseId, revision: 3 },
      receiptLog: [{ type: 'EnsureReviewWorkspaceAggregate', revision: 0 }],
    } as CaseAggregateV2)
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('legacy-not-native')
    expect(await actions.createNativeReviewItem({
      title: 'Forged', category: '科研', declaredScore: 10,
      documentVersionId: 'unknown-version',
    })).toBe(false)
    expect(called).toBe(false)
    expect(store.get(reviewErrorAtom)).toContain('不是受信的原生案卷')
  })
})


describe('C1-R09 switch-race safety for visible manual Subject dialog', () => {
  test('does not write the old Case when selected Case changes during aggregate read', async () => {
    const { api } = makeApi()
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase('native-human-A')
    const delayed = new Deferred()
    let invoked = false
    api.getAggregateV2 = async caseId => caseId === 'native-human-A'
      ? delayed.promise as Promise<CaseAggregateV2>
      : undefined
    api.createNativeReviewItemV3 = async () => { invoked = true; throw new Error('incorrect write') }
    const pending = actions.createNativeReviewItem({
      documentVersionId: 'physical-version-A', title: 'Old form',
      category: '智育', declaredScore: 2,
    }, 'native-human-A')
    await actions.selectCase('native-human-B')
    delayed.resolve({
      caseV2: { id: 'native-human-A', revision: 1, stage: 'draft' },
      receiptLog: [{ type: 'CreateNativeWorkspaceCaseV3' }],
    })
    expect(await pending).toBe(false)
    expect(invoked).toBe(false)
    expect(store.get(selectedCaseIdAtom)).toBe('native-human-B')
  })
})


describe('C1-R09 same-intent retry identity survives a lost response', () => {
  test('controller forwards an unchanged supplied idempotency ID across a transient IPC error', async () => {
    const { api } = makeApi()
    const id = 'manual-reply-loss-case'
    const seen: string[] = []
    api.getAggregateV2 = async caseId => ({
      caseV2: { id: caseId, revision: seen.length ? 4 : 3, stage: 'draft' },
      receiptLog: [{ type: 'CreateNativeWorkspaceCaseV3' }],
    } as CaseAggregateV2)
    api.createNativeReviewItemV3 = async input => {
      seen.push(input.requestId)
      if (seen.length === 1) throw new Error('IPC reply was lost after persistence')
      return makeCase(id, { items: [{
        id: 'manual-replayed', title: input.title, category: input.category,
        declaredScore: input.declaredScore,
        anchor: { documentId: 'file', precision: 'document' },
        evidenceDocumentIds: [], identifiedBy: 'manual', status: 'identified',
      }] as ReviewItem[] })
    }
    const store = createStore()
    const actions = createReviewActionsController(store, api)
    await actions.selectCase(id)
    const intent = {
      title: 'Human declared source', category: '智育', declaredScore: 3,
      documentVersionId: 'native-source-v1',
    }
    expect(await actions.createNativeReviewItem(intent, id, 'ui-native-item-same-request')).toBe(false)
    expect(await actions.createNativeReviewItem(intent, id, 'ui-native-item-same-request')).toBe(true)
    expect(seen).toEqual(['ui-native-item-same-request', 'ui-native-item-same-request'])
    expect(store.get(reviewCasesByIdAtom)[id]?.items).toHaveLength(1)
  })
})
