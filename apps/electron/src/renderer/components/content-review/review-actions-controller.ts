/**
 * review-actions-controller — 内容审核动作编排（M0/H05）
 *
 * 从 use-review-actions 抽出的可测层：不依赖 React，接收 Jotai Store + IPC 子集。
 * 职责（对应设计 03 §11.1「并发与快照」与 04 K05）：
 * - 选择代次：selectCase 慢返回不得把界面切回旧案（K05 选择场景）
 * - 按案写入：异步结果只写对应 caseId 的槽位（casesById/runsByCase/tasksByCase），
 *   A 的运行回 A、即使用户正在 B；不再用调用前快照覆盖"当前案卷"（K05 串案场景）
 * - 同案操作代次：同类操作后发先生时，旧响应丢弃，不覆盖新结果（K05 交错场景）
 * - 同案互斥守卫：同案同操作进行中拒绝重复发起（运行/大纲/识别），切走不解除守卫
 * - 兼容合并：大纲与识别修改范围不同（rulePacks / items），回写时以缓存最新为基底定向合并，
 *   两者交错完成互不丢失（K05「兼容 patch 都保留」）
 *
 * 主进程存储侧的 expectedRevision/串行队列见 main/lib/review/case-store.ts updateCase。
 */

import type { createStore } from 'jotai'

/** Jotai 底层 Store（与 useStore 返回一致） */
type JotaiStore = ReturnType<typeof createStore>
import type {
  ExportReportResult,
  ImportDocumentsResult,
  ReviewAssistantMessage,
  ReviewCase,
  ReviewCaseSummary,
  ReviewCaseType,
  ReviewDomainPackId,
  UpdateCaseSettingsRequest,
  UpdateRuleOutlineRequest,
  ManualReviewRule,
  ReviewFinding,
  ReviewItem,
  ReviewModelGatewayStatus,
  ReviewRun,
  ReviewRunV2,
  ReviewBackgroundPiRunState,
  CaseAggregateV2,
  TemplateVersion,
  RuleOutlineItem,
  SourceDocument,
  UpdateReviewItemRequest,
} from '@profer/shared'
import {
  reviewAssistantPendingAtom,
  reviewRunStaleByCaseAtom,
  reviewAssistantThreadsAtom,
  reviewCasesByIdAtom,
  reviewCaseListAtom,
  reviewErrorAtom,
  reviewExecutionByCaseAtom,
  reviewWorkspaceAggregatesByCaseAtom,
  reviewWorkspaceExtractedObservationsByCaseAtom,
  reviewWorkspaceRunStaleByCaseAtom,
  reviewWorkspaceTemplatesByCaseAtom,
  reviewWorkspaceRunsByCaseAtom,
  reviewFocusAtom,
  reviewGatewayStatusAtom,
  reviewRunsByCaseAtom,
  reviewRuleLocateAtom,
  reviewTasksByCaseAtom,
  selectedCaseIdAtom,
  selectedFindingIdAtom,
} from '@/atoms/review-atoms'
import type { ReviewCaseTasks } from '@/atoms/review-atoms'
import type { ReviewExecutionViewState, ReviewFocus } from '@/atoms/review-atoms'
import { buildReviewWorkspaceViewModel } from './review-workspace-view-model'
import { beginWorkspaceCaseWrite, invalidateWorkspaceCaseWrites } from './review-workspace-write-fence'

/** focus/locate 联动 nonce（每次点击 +1 驱动 useEffect 重放） */
let focusNonce = 0
const LAST_SELECTED_CASE_KEY = 'cdut-studio.review.last-selected-case'

function readLastSelectedCaseId(): string | null {
  try { return typeof window === 'undefined' ? null : window.localStorage.getItem(LAST_SELECTED_CASE_KEY) } catch { return null }
}

function saveLastSelectedCaseId(caseId: string | null): void {
  try {
    if (typeof window === 'undefined') return
    if (caseId) window.localStorage.setItem(LAST_SELECTED_CASE_KEY, caseId)
    else window.localStorage.removeItem(LAST_SELECTED_CASE_KEY)
  } catch { /* 存储不可用时仍可在当前会话使用案卷。 */ }
}

/** 控制器依赖的 IPC 子集（结构化最小接口，测试注入假实现） */
export interface ReviewActionsApi {
  listCases(): Promise<ReviewCaseSummary[]>
  getCase(caseId: string): Promise<ReviewCase | undefined>
  loadDemoCase(): Promise<ReviewCase>
  createCase(input: {
    title: string
    type: ReviewCaseType
    applicant: string
    academicYear: string
    domainPackId?: ReviewDomainPackId
    reviewTemplate?: { templateId: string; version: number } | null
  }): Promise<ReviewCase>
  importDocument(input: { caseId: string; role: SourceDocument['role']; requestId?: string }): Promise<ImportDocumentsResult>
  importDocumentFromPath?(input: { caseId: string; sourcePath: string; role: SourceDocument['role']; requestId?: string }): Promise<SourceDocument>
  removeDocuments?(input: { caseId: string; role: SourceDocument['role']; documentIds?: string[] }): Promise<ReviewCase>
  reorderDocuments?(input: { caseId: string; role: SourceDocument['role']; documentIds: string[] }): Promise<ReviewCase>
  deleteCase(caseId: string): Promise<void>
  /** Native archive discovery is read-only and separate from the V1 compatibility list. */
  listCasesV2?(): Promise<Array<{ caseId: string; title: string; stage: string; revision: number }>>
  restoreCaseV3?(input: { caseId: string; expectedRevision: number; reason: string }): Promise<{ ok: boolean }>
  updateCaseSettings(input: UpdateCaseSettingsRequest): Promise<ReviewCase>
  updateRuleOutline?(input: UpdateRuleOutlineRequest): Promise<ReviewCase>
  updateReviewItem?(input: UpdateReviewItemRequest): Promise<ReviewCase>
  createNativeReviewItemV3?(input: import('@profer/shared').CreateNativeReviewItemV3Request): Promise<ReviewCase>
  confirmRulePack?(input: { caseId: string; rulePackId: string }): Promise<ReviewCase>
  generateRuleOutline(request: { caseId: string; rulePackId?: string }): Promise<RuleOutlineItem[]>
  extractItems(caseId: string): Promise<ReviewItem[]>
  runReview(caseId: string): Promise<ReviewRun>
  getLatestRun(caseId: string): Promise<{ run: ReviewRun | null; inputStale: boolean }>
  exportReport(caseId: string): Promise<ExportReportResult>
  getModelGatewayStatus(): Promise<ReviewModelGatewayStatus>
  assistantChat(input: {
    caseId: string
    history: ReviewAssistantMessage[]
    focusFindingId?: string
  }): Promise<{ content: string; references?: ReviewAssistantMessage['references']; degraded?: boolean }>
  /** 自动恢复/同步同 ID 的 V2 业务聚合；旧测试适配器可省略。 */
  migrateCaseV2?(caseId: string): Promise<unknown>
  getAggregateV2?(caseId: string): Promise<CaseAggregateV2 | undefined>
  listRunsV2?(caseId: string): Promise<ReviewRunV2[]>
  getRunObservationsV2?(caseId: string): Promise<Array<Record<string, unknown>>>
  getWorkspaceRunValidityV2?(input: { caseId: string; runId: string }): Promise<boolean>
  getTemplateV2?(templateId: string, version?: number): Promise<TemplateVersion | undefined>
  runReviewV2?(caseId: string): Promise<ReviewRunV2>
  getBackgroundPiReviewStateV2?(caseId: string): Promise<ReviewBackgroundPiRunState>
  stopBackgroundPiReviewV2?(input: { caseId: string; runId: string }): Promise<ReviewBackgroundPiRunState>
  getWorkspaceDocumentPreviewPath?(input: { caseId: string; documentVersionId: string }): Promise<string | null>
  registerMaterialPathV2?(input: { caseId: string; sourcePath: string; role: 'application' | 'evidence' | 'rule' | 'attachment'; materialSlotId?: string; fileName?: string; replacesVersionIds?: string[] }): Promise<string | undefined>
  submitCaseV2?(caseId: string): Promise<{ ok: boolean; aggregate?: CaseAggregateV2; message?: string } | undefined>
}

/** 新建案卷入参 */
export interface CreateCaseInput {
  title: string
  type: ReviewCaseType
  applicant: string
  academicYear: string
  domainPackId?: ReviewDomainPackId
  reviewTemplate?: { templateId: string; version: number } | null
}

function buildFocus(finding: ReviewFinding): ReviewFocus {
  focusNonce += 1
  return {
    findingId: finding.id,
    ruleAnchor: finding.ruleAnchors[0],
    subjectAnchor: finding.subjectAnchor,
    evidenceAnchor: finding.evidenceAnchor,
    counterpartAnchor: finding.counterpartAnchor,
    severity: finding.severity,
    nonce: focusNonce,
  }
}

/** 运行有任何关键覆盖缺口时只能显示为部分完成，不能形成“全部符合”。 */
function hasIncompleteReviewCoverage(run: ReviewRun): boolean {
  const coverage = run.coverage
  return (coverage.unprocessedMaterials?.length ?? 0) > 0
    || coverage.manualReviewItemIds.length > 0
    || coverage.unrecognizedDocumentIds.length > 0
    || coverage.ruleUncoveredItemIds.length > 0
}

function executionStateFromRun(run: ReviewRun | null, inputStale: boolean): ReviewExecutionViewState {
  if (!run) return { status: 'idle' }
  if (run.status === 'failed') {
    return { status: 'failed', stage: 'summary', message: '最近一次审核未完成', error: run.error ?? '审核运行失败' }
  }
  if (inputStale || hasIncompleteReviewCoverage(run)) {
    return { status: 'partial', stage: 'summary', message: inputStale ? '案卷输入已变化，需重新审核' : '审核部分完成，仍有待人工处理项' }
  }
  return { status: 'completed', stage: 'summary', message: '最近一次审核已完成' }
}

function executionStateFromWorkspace(aggregate: CaseAggregateV2 | null, run: ReviewRunV2 | null, inputStale: boolean, observations: Array<Record<string, unknown>>, template?: TemplateVersion | null): ReviewExecutionViewState | null {
  if (!run || !aggregate) return null
  if (run.status === 'running' || run.status === 'queued') return { status: 'running', stage: 'checks', message: '审核中，可切换页面' }
  if (run.status === 'cancelled') return { status: 'cancelled', stage: 'summary', message: '本次审核已停止，可重新审核' }
  if (run.status === 'failed') return { status: 'failed', stage: 'summary', message: '最近一次审核未完成', error: run.error ?? '审核运行失败' }
  if (run.status === 'awaiting-input') return { status: 'awaiting-input', stage: 'summary', message: '审核等待补充输入' }
  const view = buildReviewWorkspaceViewModel(aggregate, run, inputStale, observations, template)
  if (view.status === 'decided' || view.canDecide) return { status: 'completed', stage: 'summary', message: view.status === 'decided' ? '案卷已完成人工决定' : '审核完成，等待人工决定' }
  return { status: 'partial', stage: 'summary', message: `审核仍有 ${view.pendingActions.length} 项待处理动作` }
}

/** 导入角色的界面名称，用于状态与错误提示。 */
export const REVIEW_DOCUMENT_ROLE_LABELS: Record<SourceDocument['role'], string> = {
  rule: '审核依据（规则）',
  application: '待审文件',
  evidence: '证明材料',
}

export type ReviewRunMode = 'update' | 'restart'

/** Electron IPC 包装属于诊断信息，业务错误卡和底部提示使用同一可读原因。 */
function reviewErrorMessage(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).replace(/^Error invoking remote method '[^']+': (?:Error: )?/, '')
}

export function createReviewActionsController(
  store: JotaiStore,
  api: ReviewActionsApi,
  startPiReview?: (caseId: string, mode: ReviewRunMode) => Promise<ReviewRunV2>,
) {
  /** 选择代次：每次 selectCase/loadDemo/create 递增；慢返回若代次已变则丢弃 */
  let selectionGeneration = 0

  /** 所有进入/回读路径都以 Main 的真实 ACK 判定受理，账本 running 不能替代。 */
  const executionStateWithAdmission = async (
    aggregate: CaseAggregateV2 | null, run: ReviewRunV2 | null, inputStale: boolean,
    observations: Array<Record<string, unknown>>, template?: TemplateVersion | null,
  ): Promise<ReviewExecutionViewState | null> => {
    const state = executionStateFromWorkspace(aggregate, run, inputStale, observations, template)
    if (!run || !run.id.startsWith('run-pi-') || (run.status !== 'running' && run.status !== 'queued')) return state
    const background = api.getBackgroundPiReviewStateV2 ? await api.getBackgroundPiReviewStateV2(run.caseId) : null
    return background?.runId === run.id && background.phase === 'accepted'
      ? { status: 'running', stage: 'checks', message: '审核中，可切换页面' }
      : { status: 'preparing', message: '正在准备审核，请等待受理后再切换页面' }
  }
  /** 同案操作代次：key = `${caseId}:${kind}`，新发起递增；旧返回代次不符即丢弃 */
  const operationGenerations = new Map<string, number>()
  // Main owns the Pi run; shared store/case tokens fence only stale UI commits.

  const reportError = (scope: string, error: unknown, options: { caseId?: string } = {}): void => {
    console.error('[审核专区]', scope, error)
    const message = reviewErrorMessage(error)
    // 按案隔离：案卷已切走时错误只留日志，不污染当前案卷的错误条（K05）
    if (options.caseId === undefined || store.get(selectedCaseIdAtom) === options.caseId) {
      store.set(reviewErrorAtom, `${scope}：${message}`)
    }
  }

  const setError = (message: string | null, options: { caseId?: string } = {}): void => {
    if (options.caseId === undefined || store.get(selectedCaseIdAtom) === options.caseId) {
      store.set(reviewErrorAtom, message)
    }
  }

  /** 取当前选中案卷 ID */
  const currentCaseId = (): string | null => store.get(selectedCaseIdAtom)

  /** 每次输入变更与运行返回后查询主进程指纹，避免旧结论在当前页面继续冒充同版结果。 */
  const refreshRunValidity = async (caseId: string): Promise<void> => {
    try {
      const latest = await api.getLatestRun(caseId)
      store.set(reviewRunStaleByCaseAtom, { ...store.get(reviewRunStaleByCaseAtom), [caseId]: latest.inputStale })
    } catch (error) {
      if (store.get(reviewRunsByCaseAtom)[caseId]) {
        store.set(reviewRunStaleByCaseAtom, { ...store.get(reviewRunStaleByCaseAtom), [caseId]: true })
      }
      console.error('[审核专区] 核验运行输入版本失败', error)
    }
  }

  /** 当前 workspace caseId 与 V2 aggregateId 一致；选择/写入后从持久层重读。 */
  const refreshWorkspaceV2 = async (caseId: string): Promise<void> => {
    const isLatest = beginWorkspaceCaseWrite(store, caseId)
    if (api.migrateCaseV2) {
      await api.migrateCaseV2(caseId)
      if (!isLatest()) return
    }
    if (api.getAggregateV2) {
      const aggregate = await api.getAggregateV2(caseId)
      if (!isLatest()) return
      store.set(reviewWorkspaceAggregatesByCaseAtom, { ...store.get(reviewWorkspaceAggregatesByCaseAtom), [caseId]: aggregate ?? null })
      if (aggregate && api.getTemplateV2) {
        const template = await api.getTemplateV2(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
        if (!isLatest()) return
        store.set(reviewWorkspaceTemplatesByCaseAtom, { ...store.get(reviewWorkspaceTemplatesByCaseAtom), [caseId]: template ?? null })
      }
    }
    if (api.listRunsV2) {
      const runs = await api.listRunsV2(caseId)
      if (!isLatest()) return
      const latest = runs[0] ?? null
      store.set(reviewWorkspaceRunsByCaseAtom, { ...store.get(reviewWorkspaceRunsByCaseAtom), [caseId]: latest })
      if (latest && api.getWorkspaceRunValidityV2) {
        const stale = await api.getWorkspaceRunValidityV2({ caseId, runId: latest.id })
        if (!isLatest()) return
        store.set(reviewWorkspaceRunStaleByCaseAtom, { ...store.get(reviewWorkspaceRunStaleByCaseAtom), [caseId]: stale })
      } else if (!latest) {
        store.set(reviewWorkspaceRunStaleByCaseAtom, { ...store.get(reviewWorkspaceRunStaleByCaseAtom), [caseId]: false })
      }
    }
    if (api.getRunObservationsV2) {
      const observations = await api.getRunObservationsV2(caseId)
      if (!isLatest()) return
      store.set(reviewWorkspaceExtractedObservationsByCaseAtom, { ...store.get(reviewWorkspaceExtractedObservationsByCaseAtom), [caseId]: observations })
    }
    const tasks = store.get(reviewTasksByCaseAtom)[caseId]
    if (!tasks?.running && !tasks?.outline && !tasks?.items) {
      const state = await executionStateWithAdmission(
        store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId] ?? null,
        store.get(reviewWorkspaceRunsByCaseAtom)[caseId] ?? null,
        store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId] ?? false,
        store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId] ?? [],
        store.get(reviewWorkspaceTemplatesByCaseAtom)[caseId],
      )
      if (isLatest() && state) store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [caseId]: state })
    }
  }

  /** 选中案卷（带选择代次）：慢返回若期间已选其他案卷则整体丢弃 */
  const selectCaseInternal = async (caseId: string): Promise<boolean> => {
    const generation = ++selectionGeneration
    try {
      const reviewCase = await api.getCase(caseId)
      if (!reviewCase) {
        if (generation === selectionGeneration) {
          store.set(reviewErrorAtom, '该案卷不存在或已被删除，请刷新列表')
          await refreshCaseList()
        }
        return false
      }
      if (generation !== selectionGeneration) return false
      try {
        await refreshWorkspaceV2(caseId)
      } catch (error) {
        reportError('恢复单案业务记录失败', error)
      }
      if (generation !== selectionGeneration) return false
      // 只更新缓存与选中态：焦点/定位/选中卡等界面态清除，但按案任务守卫保留（切回可见"运行中"）
      store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [reviewCase.id]: reviewCase })
      store.set(selectedCaseIdAtom, reviewCase.id)
      saveLastSelectedCaseId(reviewCase.id)
      store.set(selectedFindingIdAtom, null)
      store.set(reviewFocusAtom, null)
      store.set(reviewRuleLocateAtom, null)
      // M0/H09：恢复该案卷最近一次运行与有效性（磁盘 runs 已有，此前重开显示"尚未运行"）
      try {
        const latest = await api.getLatestRun(caseId)
        if (generation === selectionGeneration) {
          store.set(reviewRunsByCaseAtom, { ...store.get(reviewRunsByCaseAtom), [caseId]: latest.run })
          store.set(reviewRunStaleByCaseAtom, { ...store.get(reviewRunStaleByCaseAtom), [caseId]: latest.inputStale })
          store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [caseId]: executionStateFromRun(latest.run, latest.inputStale) })
          const workspaceState = await executionStateWithAdmission(
            store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId] ?? null,
            store.get(reviewWorkspaceRunsByCaseAtom)[caseId] ?? null,
            store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId] ?? false,
            store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId] ?? [],
            store.get(reviewWorkspaceTemplatesByCaseAtom)[caseId],
          )
          if (generation === selectionGeneration && workspaceState) store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [caseId]: workspaceState })
        }
      } catch (restoreError) {
        console.error('[审核专区] 恢复最近运行失败', restoreError)
      }
      setError(null)
      return true
    } catch (error) {
      if (generation === selectionGeneration) reportError('切换案卷失败', error)
      return false
    }
  }

  async function refreshCaseList(): Promise<ReviewCaseSummary[]> {
    try {
      const cases = await api.listCases()
      store.set(reviewCaseListAtom, cases)
      return cases
    } catch (error) {
      reportError('读取案卷列表失败', error)
      return []
    }
  }

  /** 同案互斥守卫：同案同任务进行中返回 false（切走不解除守卫，K05） */
  const tryBeginTask = (caseId: string, kind: keyof ReviewCaseTasks): boolean => {
    const tasks = store.get(reviewTasksByCaseAtom)[caseId]
    if (tasks?.[kind]) return false
    store.set(reviewTasksByCaseAtom, {
      ...store.get(reviewTasksByCaseAtom),
      [caseId]: { outline: false, items: false, running: false, ...tasks, [kind]: true },
    })
    return true
  }

  const endTask = (caseId: string, kind: keyof ReviewCaseTasks): void => {
    const tasks = store.get(reviewTasksByCaseAtom)[caseId]
    store.set(reviewTasksByCaseAtom, {
      ...store.get(reviewTasksByCaseAtom),
      [caseId]: { outline: false, items: false, running: false, ...tasks, [kind]: false },
    })
  }

  /** 同案操作代次：发起时递增并返回本次代次 */
  const beginOperation = (caseId: string, kind: string): number => {
    const key = `${caseId}:${kind}`
    const generation = (operationGenerations.get(key) ?? 0) + 1
    operationGenerations.set(key, generation)
    return generation
  }

  const isCurrentOperation = (caseId: string, kind: string, generation: number): boolean =>
    operationGenerations.get(`${caseId}:${kind}`) === generation

  const setExecution = (caseId: string, state: ReviewExecutionViewState): void => {
    store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [caseId]: state })
  }

  const removeMaterialDocuments = async (role: SourceDocument['role'], documentIds?: string[]): Promise<boolean> => {
    const caseId = currentCaseId()
    if (!caseId) {
      setError('移除材料失败：请先选择案卷')
      return false
    }
    if (!api.removeDocuments) {
      setError('当前版本不支持移除材料，请重启应用后重试', { caseId })
      return false
    }
    try {
      await api.removeDocuments({ caseId, role, ...(documentIds ? { documentIds } : {}) })
      const refreshed = await api.getCase(caseId)
      if (refreshed) store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: refreshed })
      try {
        await refreshWorkspaceV2(caseId)
      } catch (refreshError) {
        console.error('[审核专区] 移除材料后刷新单案业务记录失败', refreshError)
      }
      await refreshCaseList()
      await refreshRunValidity(caseId)
      setError(null, { caseId })
      return true
    } catch (error) {
      reportError('移除材料失败', error, { caseId })
      return false
    }
  }

  return {
    /** On unmount / case switch, revoke pending display reads, not background Pi. */
    invalidateRefresh(caseId: string): void {
      invalidateWorkspaceCaseWrites(store, caseId)
    },
    /** 仅刷新本案 V2 投影，执行仍由 Main 持有。 */
    async refreshBackgroundReview(caseId: string): Promise<void> {
      await refreshWorkspaceV2(caseId)
    },

    async stopReview(): Promise<void> {
      const caseId = currentCaseId()
      const run = caseId ? store.get(reviewWorkspaceRunsByCaseAtom)[caseId] : null
      if (!caseId || !run || !api.stopBackgroundPiReviewV2) throw new Error('没有可停止的审核运行')
      await api.stopBackgroundPiReviewV2({ caseId, runId: run.id })
      await refreshWorkspaceV2(caseId)
    },
    async initialize(): Promise<void> {
      const cases = await refreshCaseList()
      // 页面重开后 selectedCaseIdAtom 是空的；恢复上次案卷（或首个案卷），
      // 否则上下文栏里的材料入口会一直处于 disabled 状态。
      const selectedId = store.get(selectedCaseIdAtom) ?? readLastSelectedCaseId()
      const target = cases.find((item) => item.id === selectedId) ?? cases[0]
      const cached = target ? store.get(reviewCasesByIdAtom)[target.id] : null
      if (target && (!cached || selectedId !== target.id)) await selectCaseInternal(target.id)
      else if (!target && selectedId) {
        store.set(selectedCaseIdAtom, null)
        saveLastSelectedCaseId(null)
      }
      try {
        const status = await api.getModelGatewayStatus()
        store.set(reviewGatewayStatusAtom, status)
      } catch (error) {
        console.error('[审核专区] 模型出口自检失败', error)
        store.set(reviewGatewayStatusAtom, { available: false, protocol: 'none', reason: '出口自检失败' })
      }
    },

    async loadDemoCase(): Promise<ReviewCase | null> {
      const generation = ++selectionGeneration
      try {
        let reviewCase: ReviewCase | undefined
        try {
          reviewCase = await api.loadDemoCase()
        } catch (error) {
          console.error('[审核专区] 载入演示案卷失败，回退读取已存储案卷', error)
          const cases = await api.listCases()
          const first = cases[0]
          reviewCase = first ? await api.getCase(first.id) : undefined
        }
        if (!reviewCase) {
          setError('未找到可载入的案卷（请检查演示数据）')
          return null
        }
        if (generation !== selectionGeneration) return null
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [reviewCase.id]: reviewCase })
        store.set(selectedCaseIdAtom, reviewCase.id)
        await refreshWorkspaceV2(reviewCase.id).catch((error) => reportError('恢复演示案卷业务记录失败', error))
        store.set(selectedFindingIdAtom, null)
        store.set(reviewFocusAtom, null)
        store.set(reviewRuleLocateAtom, null)
        await refreshCaseList()
        try {
          const latest = await api.getLatestRun(reviewCase.id)
          if (generation === selectionGeneration) {
            store.set(reviewRunsByCaseAtom, { ...store.get(reviewRunsByCaseAtom), [reviewCase.id]: latest.run })
            store.set(reviewRunStaleByCaseAtom, { ...store.get(reviewRunStaleByCaseAtom), [reviewCase.id]: latest.inputStale })
            store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [reviewCase.id]: executionStateFromRun(latest.run, latest.inputStale) })
            const workspaceState = await executionStateWithAdmission(
              store.get(reviewWorkspaceAggregatesByCaseAtom)[reviewCase.id] ?? null,
              store.get(reviewWorkspaceRunsByCaseAtom)[reviewCase.id] ?? null,
              store.get(reviewWorkspaceRunStaleByCaseAtom)[reviewCase.id] ?? false,
              store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[reviewCase.id] ?? [],
              store.get(reviewWorkspaceTemplatesByCaseAtom)[reviewCase.id],
            )
            if (workspaceState) store.set(reviewExecutionByCaseAtom, { ...store.get(reviewExecutionByCaseAtom), [reviewCase.id]: workspaceState })
          }
        } catch (restoreError) {
          console.error('[审核专区] 恢复演示案卷运行失败', restoreError)
        }
        setError(null)
        return reviewCase
      } catch (error) {
        reportError('载入演示案卷失败', error)
        return null
      }
    },

    refreshCaseList,

    selectCase: selectCaseInternal,

    async createCase(input: CreateCaseInput): Promise<ReviewCase | null> {
      const generation = ++selectionGeneration
      try {
        // CREATE_CASE 支持 domainPackId（缺省不写字段，主进程按综测包回落）
        const created = await api.createCase({
          title: input.title,
          type: input.type,
          applicant: input.applicant,
          academicYear: input.academicYear,
          ...(input.domainPackId ? { domainPackId: input.domainPackId } : {}),
          ...(input.reviewTemplate !== undefined ? { reviewTemplate: input.reviewTemplate } : {}),
        })
        await refreshWorkspaceV2(created.id).catch((error) => reportError('初始化单案业务记录失败', error))
        await refreshCaseList()
        if (generation !== selectionGeneration) return created
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [created.id]: created })
        store.set(selectedCaseIdAtom, created.id)
        setError(null)
        return created
      } catch (error) {
        reportError('新建案卷失败', error)
        return null
      }
    },

    async importDocument(role: SourceDocument['role'], requestId?: string): Promise<ImportDocumentsResult | null> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('导入材料失败：请先选择或新建案卷')
        return null
      }
      const roleLabel = REVIEW_DOCUMENT_ROLE_LABELS[role]
      try {
        const result = await api.importDocument({ caseId, role, ...(requestId ? { requestId } : {}) })
        if (result.documents.length === 0 && result.failures.length === 0) return result
        // 按案回写：导入期间用户可能切走，刷新数据仍写入原案卷槽位（不污染新案卷）
        if (result.documents.length > 0) {
          try {
            const refreshed = await api.getCase(caseId)
            if (refreshed) {
              store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: refreshed })
            }
            await refreshWorkspaceV2(caseId)
          } catch (refreshError) {
            console.error('[审核专区] 导入后刷新案卷失败', refreshError)
          }
          await refreshCaseList()
          await refreshRunValidity(caseId)
        }
        const issues = [
          ...result.failures.map((failure) => `${failure.fileName}：${failure.message}`),
          ...result.documents.filter((document) => document.parseStatus !== 'parsed').map((document) => `${document.fileName}解析${document.parseStatus === 'failed' ? '失败' : '不完整'}：${document.parseError ?? '原件已收录，可查看解析内容'}`),
        ]
        if (issues.length === 0) {
          setError(null, { caseId })
        } else {
          const preview = issues.slice(0, 3).join('；')
          setError(`导入${roleLabel}：已收录 ${result.documents.length} 份，另有 ${issues.length} 项需要处理：${preview}${issues.length > 3 ? '；…' : ''}`, { caseId })
        }
        return result
      } catch (error) {
        reportError(`${roleLabel}导入失败`, error, { caseId })
        return null
      }
    },

    async importDocumentFromPath(role: SourceDocument['role'], sourcePath: string, requestId?: string): Promise<SourceDocument | null> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('导入材料失败：请先选择或新建案卷')
        return null
      }
      if (!api.importDocumentFromPath) {
        setError('路径直导仅在开发版可用', { caseId })
        return null
      }
      try {
        const document = await api.importDocumentFromPath({ caseId, sourcePath, role, ...(requestId ? { requestId } : {}) })
        const refreshed = await api.getCase(caseId)
        if (refreshed) store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: refreshed })
        try {
          await refreshWorkspaceV2(caseId)
        } catch (refreshError) {
          console.error('[审核专区] 路径导入后刷新单案业务记录失败', refreshError)
        }
        await refreshCaseList()
        await refreshRunValidity(caseId)
        setError(document.parseStatus === 'parsed' ? null : `${document.fileName}解析${document.parseStatus === 'failed' ? '失败' : '不完整'}：${document.parseError ?? '原件已收录，可查看解析内容'}`, { caseId })
        return document
      } catch (error) {
        reportError('路径导入材料失败', error, { caseId })
        return null
      }
    },

    async removeDocument(documentId: string): Promise<boolean> {
      const caseId = currentCaseId()
      const document = caseId ? store.get(reviewCasesByIdAtom)[caseId]?.documents.find((candidate) => candidate.id === documentId) : undefined
      if (!document) {
        setError('移除材料失败：材料已不存在，请刷新案卷')
        return false
      }
      return removeMaterialDocuments(document.role, [documentId])
    },

    async clearDocuments(role: SourceDocument['role']): Promise<boolean> {
      return removeMaterialDocuments(role)
    },

    async reorderDocuments(role: SourceDocument['role'], documentIds: string[]): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId || !api.reorderDocuments) {
        setError('调整材料顺序失败：当前版本暂不支持，请刷新应用', { ...(caseId ? { caseId } : {}) })
        return false
      }
      try {
        const updated = await api.reorderDocuments({ caseId, role, documentIds })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        try {
          await refreshWorkspaceV2(caseId)
        } catch (refreshError) {
          console.error('[审核专区] 调整材料顺序后刷新单案业务记录失败', refreshError)
        }
        await refreshCaseList()
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('调整材料顺序失败', error, { caseId })
        return false
      }
    },

    async listArchivedCases(): Promise<Array<{ caseId: string; title: string; revision: number }>> {
      if (!api.listCasesV2) return []
      try {
        const cases = await api.listCasesV2()
        return cases.filter(c => c.stage === 'archived')
          .map(({ caseId, title, revision }) => ({ caseId, title, revision }))
      } catch (error) {
        reportError('读取归档案卷失败', error)
        return []
      }
    },

    async restoreArchivedCase(caseId: string, expectedRevision: number): Promise<boolean> {
      if (!api.restoreCaseV3) {
        setError('当前版本尚未支持原生案卷恢复')
        return false
      }
      try {
        const result = await api.restoreCaseV3({
          caseId, expectedRevision, reason: '用户在工作台明确确认恢复案卷并重新审核',
        })
        if (!result.ok) {
          setError('案卷恢复未完成，请刷新归档列表后重试')
          return false
        }
        await refreshCaseList()
        // Restoring the native business ledger never re-approves a previous
        // ReviewRun/Decision. Legacy migrated cases become selectable again;
        // native-only cases remain in the V2 aggregate list pending the C1
        // read-only three-column compatibility projection.
        if (await api.getCase(caseId)) await selectCaseInternal(caseId)
        setError(null)
        return true
      } catch (error) {
        reportError('恢复案卷失败', error)
        return false
      }
    },

    async deleteCase(caseId: string): Promise<boolean> {
      const isCurrent = currentCaseId() === caseId
      try {
        await api.deleteCase(caseId)
        if (isCurrent) {
          store.set(selectedCaseIdAtom, null)
          store.set(selectedFindingIdAtom, null)
          store.set(reviewFocusAtom, null)
          store.set(reviewRuleLocateAtom, null)
        }
        // 从缓存移除，避免幽灵条目
        const map = { ...store.get(reviewCasesByIdAtom) }
        delete map[caseId]
        store.set(reviewCasesByIdAtom, map)
        await refreshCaseList()
        setError(null)
        return true
      } catch (error) {
        reportError('删除案卷失败', error)
        return false
      }
    },

    async setDomainPack(packId: ReviewDomainPackId): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('切换领域包失败：请先选择案卷')
        return false
      }
      try {
        // 按案回写：响应期间切走也只更新原案卷缓存（H05 领域切换不串案）
        const updated = await api.updateCaseSettings({ caseId, domainPackId: packId })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [updated.id]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        await refreshCaseList()
        setError(null)
        return true
      } catch (error) {
        reportError('切换领域包失败', error, { caseId })
        return false
      }
    },

    async updateReviewSetup(input: Pick<UpdateCaseSettingsRequest, 'reviewTemplate' | 'manualRules'>): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('保存审核设置失败：请先选择案卷')
        return false
      }
      try {
        const updated = await api.updateCaseSettings({ caseId, ...input })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        await refreshCaseList()
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('保存审核设置失败', error, { caseId })
        return false
      }
    },

    async updateRuleOutline(input: Omit<UpdateRuleOutlineRequest, 'caseId'>): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId || !api.updateRuleOutline) {
        setError('保存规则摘要失败：当前客户端不支持该操作', { ...(caseId ? { caseId } : {}) })
        return false
      }
      try {
        const updated = await api.updateRuleOutline({ caseId, ...input })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('保存规则摘要失败', error, { caseId })
        return false
      }
    },

    async updateReviewItem(input: Omit<UpdateReviewItemRequest, 'caseId'>): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId || !api.updateReviewItem) {
        setError('修正申报事项失败：当前客户端不支持该操作', { ...(caseId ? { caseId } : {}) })
        return false
      }
      try {
        const updated = await api.updateReviewItem({ caseId, ...input })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        await refreshCaseList()
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('修正申报事项失败', error, { caseId })
        return false
      }
    },

    /** Human source-anchored declaration; never a model-confirmed fact/decision. */
    async createNativeReviewItem(input: Omit<import('@profer/shared').CreateNativeReviewItemV3Request,
      'caseId' | 'requestId' | 'expectedRevision'>, expectedCaseId?: string,
      retryRequestId?: string): Promise<boolean> {
      const caseId = currentCaseId()
      if (expectedCaseId && expectedCaseId !== caseId) {
        setError('添加人工事项失败：案卷已切换，请重新打开事项登记', { ...(caseId ? { caseId } : {}) })
        return false
      }
      if (!caseId || !api.createNativeReviewItemV3 || !api.getAggregateV2) {
        setError('添加人工事项失败：请先选择原生案卷并升级客户端')
        return false
      }
      try {
        const aggregate = await api.getAggregateV2(caseId)
        // The OS read can await. Do not retarget a captured form after
        // a user switches the selected Case during that interval.
        if (currentCaseId() !== caseId) {
          setError('添加人工事项失败：案卷已切换，请重新打开事项登记', { caseId })
          return false
        }
        if (!aggregate || aggregate.caseV2.id !== caseId ||
            aggregate.receiptLog[0]?.type !== 'CreateNativeWorkspaceCaseV3') {
          setError('添加人工事项失败：所选案卷不是受信的原生案卷', { caseId })
          return false
        }
        const updated = await api.createNativeReviewItemV3({
          caseId, expectedRevision: aggregate.caseV2.revision,
          requestId: retryRequestId ?? `ui-native-item-${globalThis.crypto.randomUUID()}`, ...input,
        })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        await refreshCaseList()
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('添加人工事项失败', error, { caseId })
        return false
      }
    },

    async confirmRulePack(rulePackId: string): Promise<boolean> {
      const caseId = currentCaseId()
      if (!caseId || !api.confirmRulePack) {
        setError('确认审核依据失败：当前客户端不支持该操作')
        return false
      }
      try {
        const updated = await api.confirmRulePack({ caseId, rulePackId })
        store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: updated })
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        setError(null, { caseId })
        return true
      } catch (error) {
        reportError('确认审核依据失败', error, { caseId })
        return false
      }
    },

    async generateRuleOutline(options?: { onlyMissing?: boolean }): Promise<void> {
      const selected = currentCaseId() ? store.get(reviewCasesByIdAtom)[currentCaseId() as string] : undefined
      const rulePack = selected?.rulePacks[0]
      if (!selected || !rulePack) {
        setError('生成规则大纲失败：当前案卷没有规则包')
        return
      }
      const caseId = selected.id
      if (!tryBeginTask(caseId, 'outline')) {
        setError('该案卷的大纲生成已在进行中', { caseId })
        return
      }
      const generation = beginOperation(caseId, 'outline')
      try {
        // 每份依据都有独立大纲；完整走过全部规则包，成功的包即时合并，失败不清空已有内容。
        const packs = options?.onlyMissing ? selected.rulePacks.filter((pack) => pack.outline.length === 0) : selected.rulePacks
        for (const pack of packs) {
          const rulePackId = pack.id
          const outline = await api.generateRuleOutline({ caseId, rulePackId })
          // 旧代次丢弃：期间用户再次发起的大纲已更新，晚返回不得覆盖（K05 交错）
          if (!isCurrentOperation(caseId, 'outline', generation)) {
            console.warn('[审核专区] 旧的大纲响应已丢弃（已有更新的请求完成）:', caseId)
            return
          }
          // 定向合并到缓存最新：只动目标规则包的 outline，不覆盖期间发生的其他字段变更
          const latest = store.get(reviewCasesByIdAtom)[caseId]
          if (latest) {
            store.set(reviewCasesByIdAtom, {
              ...store.get(reviewCasesByIdAtom),
              [caseId]: {
                ...latest,
                rulePacks: latest.rulePacks.map((pack) =>
                  pack.id === rulePackId ? { ...pack, outline, confirmed: false } : pack,
                ),
              },
            })
          }
          await refreshWorkspaceV2(caseId)
        }
        setError(null, { caseId })
      } catch (error) {
        if (isCurrentOperation(caseId, 'outline', generation)) {
          reportError('生成规则大纲失败', error, { caseId })
        }
        throw error
      } finally {
        await refreshRunValidity(caseId)
        endTask(caseId, 'outline')
      }
    },

    async extractItems(targetCaseId?: string): Promise<void> {
      const caseId = targetCaseId ?? currentCaseId()
      const selected = caseId ? store.get(reviewCasesByIdAtom)[caseId] : undefined
      if (!caseId || !selected) {
        setError('识别条目失败：尚未载入案卷')
        return
      }
      if (!tryBeginTask(caseId, 'items')) {
        setError('该案卷的条目识别已在进行中', { caseId })
        return
      }
      const generation = beginOperation(caseId, 'items')
      try {
        const items = await api.extractItems(caseId)
        if (!isCurrentOperation(caseId, 'items', generation)) {
          console.warn('[审核专区] 旧的识别响应已丢弃（已有更新的请求完成）:', caseId)
          return
        }
        // 定向合并：只动 items，不覆盖期间发生的大纲/导入变更（K05「兼容 patch 都保留」）
        const latest = store.get(reviewCasesByIdAtom)[caseId]
        if (latest) {
          store.set(reviewCasesByIdAtom, { ...store.get(reviewCasesByIdAtom), [caseId]: { ...latest, items } })
        }
        await refreshWorkspaceV2(caseId)
        await refreshRunValidity(caseId)
        setError(null, { caseId })
      } catch (error) {
        if (isCurrentOperation(caseId, 'items', generation)) {
          reportError('识别条目失败', error, { caseId })
        }
        throw error
      } finally {
        endTask(caseId, 'items')
      }
    },

    async runReview(): Promise<void> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('开始审核失败：尚未载入案卷')
        return
      }
      if (!tryBeginTask(caseId, 'running')) {
        setError('该案卷已有审核在进行中，请等待完成后再试', { caseId })
        return
      }
      try {
        const run: ReviewRun = await api.runReview(caseId)
        // 按案落位：A 的运行回 A——用户切到 B 也不串（K05 主场景）
        store.set(reviewRunsByCaseAtom, { ...store.get(reviewRunsByCaseAtom), [caseId]: run })
        await refreshRunValidity(caseId)
        if (run.error) {
          setError(`审核未完成：${run.error}`, { caseId })
        } else {
          setError(null, { caseId })
        }
      } catch (error) {
        reportError('开始审核失败', error, { caseId })
      } finally {
        endTask(caseId, 'running')
      }
    },

    async runFullReview(mode: ReviewRunMode = 'update'): Promise<void> {
      const caseId = currentCaseId()
      const selected = caseId ? store.get(reviewCasesByIdAtom)[caseId] : undefined
      if (!caseId || !selected) {
        setError('开始审核失败：请先新建或选择审核任务')
        return
      }
      if (!tryBeginTask(caseId, 'running')) {
        setError('该审核任务已有操作正在进行，请等待完成后再试', { caseId })
        return
      }
      const update = (state: ReviewExecutionViewState): void => setExecution(caseId, state)
      if (startPiReview) {
        try {
          update({ status: 'preparing', stage: 'materials', message: '正在准备审核材料，请等待受理后再切换页面' })
          await refreshWorkspaceV2(caseId)
          let aggregate = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]
          const template = store.get(reviewWorkspaceTemplatesByCaseAtom)[caseId]
          // V1 迁移会保留旧版解析失败记录，Pi 只读 V2 记录且不会重新运行导入解析器。
          // 对当时不支持、现在已支持的 HTML/EML 生成新材料版本，原失败版本继续留作追溯。
          const workspaceDocuments = aggregate?.caseV2.documents ?? []
          const legacyTextFailures = workspaceDocuments.filter((document) => {
            const extension = document.fileName.toLowerCase().split('.').at(-1)
            const hasUsableReplacement = workspaceDocuments.some((candidate) => candidate.active !== false
              && candidate.fileName === document.fileName
              && candidate.role === document.role
              && candidate.materialSlotId === document.materialSlotId
              && candidate.parseStatus !== 'failed'
              && candidate.blocks.length > 0)
            return !hasUsableReplacement
              && document.parseStatus === 'failed'
              && document.unusedReason === 'V1 解析失败'
              && (extension === 'html' || extension === 'htm' || extension === 'eml')
          }) ?? []
          if (legacyTextFailures.length > 0) {
            if (!api.getWorkspaceDocumentPreviewPath || !api.registerMaterialPathV2) {
              throw new Error('检测到旧版 HTML/EML 解析失败材料，但当前版本不支持自动重新解析。请重启到最新版本后重试。')
            }
            update({ status: 'preparing', stage: 'materials', message: `正在重新解析 ${legacyTextFailures.length} 份旧版 HTML/EML 材料` })
            for (const document of legacyTextFailures) {
              const sourcePath = await api.getWorkspaceDocumentPreviewPath({ caseId, documentVersionId: document.versionId })
              if (!sourcePath) throw new Error(`找不到 ${document.fileName} 的案卷原件，无法重新解析`)
              const misplacedCopies = aggregate?.caseV2.documents.filter((candidate) => candidate.role === document.role
                && candidate.materialSlotId === document.materialSlotId
                && candidate.fileName === `${document.documentId}-${document.fileName}`) ?? []
              const versionId = await api.registerMaterialPathV2({
                caseId,
                sourcePath,
                role: document.role,
                fileName: document.fileName,
                replacesVersionIds: [document.versionId, ...misplacedCopies.map((candidate) => candidate.versionId)],
                ...(document.materialSlotId ? { materialSlotId: document.materialSlotId } : {}),
              })
              if (!versionId) throw new Error(`${document.fileName} 重新解析失败，未能登记新材料版本`)
            }
            await refreshWorkspaceV2(caseId)
            aggregate = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]
            for (const document of legacyTextFailures) {
              const repaired = aggregate?.caseV2.documents
                .filter((candidate) => candidate.active !== false && candidate.fileName === document.fileName && candidate.role === document.role && candidate.materialSlotId === document.materialSlotId)
                .at(-1)
              if (!repaired || repaired.parseStatus === 'failed') {
                throw new Error(`${document.fileName} 重新解析后仍不可读，请检查原件格式或重新导出文件`)
              }
            }
          }
          const needsSubjects = !!aggregate?.caseV2.reviewRules?.some((rule) => rule.targetScope === 'subject')
            || !!template?.sections?.some((section) => section.criteria.some((criterion) => (criterion.targetScope ?? 'subject') === 'subject'))
          if (needsSubjects && (!aggregate || aggregate.caseV2.subjects.length === 0)) {
            const currentCase = store.get(reviewCasesByIdAtom)[caseId]
            const applicationCount = currentCase?.documents.filter((document) => document.role === 'application').length ?? 0
            if (applicationCount === 0) {
              update({ status: 'awaiting-input', stage: 'extract', message: '当前审核规则要求逐事项核验；请先添加申报材料，再识别申报事项。' })
              return
            }
            update({ status: 'preparing', stage: 'extract', message: '正在识别申报事项，识别后可在中栏修正' })
            await this.extractItems(caseId)
            const identifiedItems = store.get(reviewCasesByIdAtom)[caseId]?.items ?? []
            if (identifiedItems.length === 0) {
              update({ status: 'awaiting-input', stage: 'extract', message: '没有识别到申报事项；请检查申报材料或在审核前补充事项。' })
              return
            }
            await refreshWorkspaceV2(caseId)
            const refreshed = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]
            if (!refreshed?.caseV2.subjects.length) {
              update({ status: 'awaiting-input', stage: 'extract', message: '申报事项已识别，但尚未进入逐事项审核清单；请检查事项信息后重试。' })
              return
            }
          }
          update({ status: 'preparing', stage: 'checks', message: '正在等待审核受理，请稍候' })
          const run = await startPiReview(caseId, mode)
          await refreshWorkspaceV2(caseId)
          // Pi 会话也要像普通 V2 运行一样结束在明确状态。refreshWorkspaceV2 在
          // running 守卫期间不会覆盖执行状态，因此这里用刚返回的持久化运行结果收尾。
          store.set(reviewWorkspaceRunsByCaseAtom, { ...store.get(reviewWorkspaceRunsByCaseAtom), [caseId]: run })
          const workspaceAggregate = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId] ?? null
          const observations = store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId] ?? []
          const stale = store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId] ?? false
          const workspaceState = await executionStateWithAdmission(
            workspaceAggregate,
            run,
            stale,
            observations,
            store.get(reviewWorkspaceTemplatesByCaseAtom)[caseId],
          )
          update({
            ...(workspaceState ?? { status: 'partial' as const, stage: 'summary' as const, message: '审核结果状态不可用' }),
            documents: { completed: run.coverage.documents.filter((document) => document.status === 'read').length, total: run.coverage.documents.length },
            checks: { completed: run.coverage.completedChecks, total: run.coverage.plannedChecks },
          })
          setError(run.status === 'failed' ? `审核未完成：${run.error ?? '审核运行失败'}` : null, { caseId })
        } catch (error) {
          reportError('审核未完成', error, { caseId })
          update({ status: 'failed', stage: 'summary', message: '本次审核未完成', error: reviewErrorMessage(error) })
        } finally {
          endTask(caseId, 'running')
        }
        return
      }
      const current = (): ReviewCase => store.get(reviewCasesByIdAtom)[caseId] ?? selected
      try {
        if (current().rulePacks.length === 0) {
          update({ status: 'awaiting-input', stage: 'rules', message: '请先导入至少一份审核依据，再开始审核' })
          return
        }
        update({ status: 'preparing', stage: 'rules', message: '正在准备审核依据' })
        const hasOutlines = current().rulePacks.length > 0 && current().rulePacks.every((pack) => pack.outline.length > 0)
        if (!hasOutlines) {
          await this.generateRuleOutline({ onlyMissing: true })
          if (!current().rulePacks.every((pack) => pack.outline.length > 0)) {
            update({ status: 'awaiting-input', stage: 'rules', message: '请补充或确认审核依据后继续' })
            return
          }
        }
        const unconfirmedPacks = current().rulePacks.filter((pack) => !pack.confirmed)
        if (unconfirmedPacks.length > 0) {
          update({ status: 'awaiting-input', stage: 'rules', message: `请先在左栏对照原文确认 ${unconfirmedPacks.length} 份审核依据` })
          return
        }
        const applicationCount = current().documents.filter((document) => document.role === 'application').length
        if (applicationCount === 0) {
          update({ status: 'awaiting-input', stage: 'materials', message: '请先导入待审材料' })
          return
        }
        update({ status: 'preparing', stage: 'materials', message: `已准备 ${current().documents.length} 份材料`, documents: { completed: current().documents.length, total: current().documents.length } })
        if (current().items.length === 0) {
          update({ status: 'preparing', stage: 'extract', message: '正在识别申报事项', documents: { completed: applicationCount, total: applicationCount } })
          await this.extractItems(caseId)
          if ((current().items.length) === 0) {
            update({ status: 'awaiting-input', stage: 'extract', message: '未识别到可审核事项，请检查待审材料' })
            return
          }
        }
        update({ status: 'running', stage: 'checks', message: '正在核对申报事项与证明', documents: { completed: current().documents.length, total: current().documents.length } })
        if (api.runReviewV2) {
          await refreshWorkspaceV2(caseId)
          let aggregate = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId]
          if (!aggregate) throw new Error('单案业务记录尚未初始化')
          if ((aggregate.caseV2.stage === 'draft' || (aggregate.caseV2.stage === 'submitted' && aggregate.tasks.length === 0)) && api.submitCaseV2) {
            const submitted = await api.submitCaseV2(caseId)
            if (!submitted?.ok) throw new Error(submitted?.message ?? '案卷提交失败，请检查申报表与证明材料')
            aggregate = submitted.aggregate ?? aggregate
            store.set(reviewWorkspaceAggregatesByCaseAtom, { ...store.get(reviewWorkspaceAggregatesByCaseAtom), [caseId]: aggregate })
          }
          const v2Run = await api.runReviewV2(caseId)
          store.set(reviewWorkspaceRunsByCaseAtom, { ...store.get(reviewWorkspaceRunsByCaseAtom), [caseId]: v2Run })
          await refreshWorkspaceV2(caseId)
          const workspaceAggregate = store.get(reviewWorkspaceAggregatesByCaseAtom)[caseId] ?? aggregate
          const workspaceObservations = store.get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId] ?? []
          const v2Stale = store.get(reviewWorkspaceRunStaleByCaseAtom)[caseId] ?? false
          const workspaceState = await executionStateWithAdmission(workspaceAggregate, v2Run, v2Stale, workspaceObservations, store.get(reviewWorkspaceTemplatesByCaseAtom)[caseId])
          update({
            ...(workspaceState ?? { status: 'partial' as const, stage: 'summary' as const, message: '审核结果状态不可用' }),
            documents: { completed: v2Run.coverage.documents.filter((document) => document.status === 'read').length, total: v2Run.coverage.documents.length },
            checks: { completed: v2Run.coverage.completedChecks, total: v2Run.coverage.plannedChecks },
          })
          setError(v2Run.status === 'failed' ? `审核未完成：${v2Run.error ?? '审核运行失败'}` : null, { caseId })
        } else {
          const run = await api.runReview(caseId)
          store.set(reviewRunsByCaseAtom, { ...store.get(reviewRunsByCaseAtom), [caseId]: run })
          await refreshRunValidity(caseId)
          if (run.status === 'failed') {
            update({ status: 'failed', stage: 'checks', message: '审核未完成', error: run.error ?? '审核运行失败' })
          } else if (hasIncompleteReviewCoverage(run) || store.get(reviewRunStaleByCaseAtom)[caseId]) {
            update({ status: 'partial', stage: 'summary', message: '审核部分完成，仍有未处理材料、待人工复核或规则覆盖缺口', documents: { completed: current().documents.length - (run.coverage.unprocessedMaterials?.length ?? 0), total: current().documents.length } })
          } else {
            update({ status: 'completed', stage: 'summary', message: '审核完成', documents: { completed: current().documents.length, total: current().documents.length } })
          }
          setError(run.status === 'failed' ? `审核未完成：${run.error ?? '审核运行失败'}` : null, { caseId })
        }
      } catch (error) {
        update({ status: 'failed', message: '审核未完成', error: error instanceof Error ? error.message : String(error) })
        reportError('一键审核失败', error, { caseId })
      } finally {
        endTask(caseId, 'running')
      }
    },

    async exportReport(): Promise<ExportReportResult | null> {
      const caseId = currentCaseId()
      if (!caseId) {
        setError('导出报告失败：尚未载入案卷')
        return null
      }
      try {
        const result = await api.exportReport(caseId)
        setError(null, { caseId })
        return result
      } catch (error) {
        reportError('导出报告失败', error, { caseId })
        return null
      }
    },

    async assistantChat(history: ReviewAssistantMessage[]): Promise<void> {
      const caseId = currentCaseId()
      if (!caseId) return
      const focusFindingId = store.get(selectedFindingIdAtom) ?? undefined
      store.set(reviewAssistantPendingAtom, true)
      try {
        const reply = await api.assistantChat({ caseId, history, focusFindingId })
        const assistantMessage: ReviewAssistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.content,
          createdAt: new Date().toISOString(),
          references: reply.references,
          degraded: reply.degraded,
        }
        const threads = store.get(reviewAssistantThreadsAtom)
        const previous = threads[caseId] ?? []
        store.set(reviewAssistantThreadsAtom, { ...threads, [caseId]: [...previous, assistantMessage] })
        setError(null, { caseId })
      } catch (error) {
        reportError('助手回答失败', error, { caseId })
      } finally {
        store.set(reviewAssistantPendingAtom, false)
      }
    },

    locateRuleAnchor(anchors: NonNullable<ReviewFocus['ruleAnchor']>[]): void {
      focusNonce += 1
      store.set(reviewRuleLocateAtom, { anchors, nonce: focusNonce })
    },

    focusFinding(finding: ReviewFinding, options?: { select?: boolean }): void {
      // 仅真实问题卡进入选中态；中栏条目卡的合成定位不污染助手焦点（F14）
      if (options?.select !== false) store.set(selectedFindingIdAtom, finding.id)
      store.set(reviewFocusAtom, buildFocus(finding))
    },
  }
}
