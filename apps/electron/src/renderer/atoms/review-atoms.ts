/**
 * 内容审核专区 - Jotai 状态
 *
 * 设计约定（docs/plans/2026-10-02-content-review-demo-implementation.md D8）：
 * - 案卷数据由主进程持久化，这里只保存界面状态（当前案卷、选中问题卡、联动焦点等）
 * - reviewFocusAtom 是三栏联动的唯一驱动：写它 → 左/中两栏 useEffect 滚动高亮
 */

import { atom } from 'jotai'
import type {
  ReviewCase,
  ReviewCaseSummary,
  ReviewFinding,
  ReviewRun,
  ReviewAssistantMessage,
  ReviewModelGatewayStatus,
  RuleOutlineItem,
  ReviewItem,
  EvidenceDocument,
  ReviewSourceAnchor,
  ReviewDocumentBlock,
  SourceDocument,
  FindingSeverity,
  CaseAggregateV2,
  ReviewRunV2,
  ReviewWorkspaceCaseRef,
  TemplateVersion,
  SourceRef,
} from '@profer/shared'

// ===== 数据状态 =====

/** 审核区工作页：管理入口只挂载一次，切页保留正在填写的表单。 */
export type ReviewWorkspaceSection = 'workbench' | 'case-v2' | 'templates' | 'batches' | 'local-candidates'
export const reviewWorkspaceSectionAtom = atom<ReviewWorkspaceSection>('workbench')

/**
 * 案卷内存缓存（M0/H05）：按 caseId 存取，异步回写只动对应案卷。
 * 异步完成 A 时即使用户已切到 B，也只更新 A 的条目——不再用调用前快照覆盖"当前案卷"。
 */
export const reviewCasesByIdAtom = atom<Record<string, ReviewCase>>({})

/** 每案最近运行是否与当前输入同版（M0/H09：false=过期，仅历史参考） */
export const reviewRunStaleByCaseAtom = atom<Record<string, boolean>>({})

/** 每案最近一次运行（M0/H05：A 的运行回 A，替代原全局单例） */
export const reviewRunsByCaseAtom = atom<Record<string, ReviewRun | null>>({})

/** 每案任务进行中标记（M0/H05：运行/大纲/识别按案隔离，切走不丢守卫） */
export interface ReviewCaseTasks {
  outline: boolean
  items: boolean
  running: boolean
}

export interface ReviewExecutionViewState {
  status: 'idle' | 'preparing' | 'running' | 'awaiting-input' | 'completed' | 'partial' | 'failed' | 'cancelled'
  stage?: 'rules' | 'materials' | 'extract' | 'evidence' | 'checks' | 'summary'
  message?: string
  documents?: { completed: number; total: number }
  checks?: { completed: number; total: number }
  error?: string
}

/** 产品级审核状态：三栏和上下文条只读取这一份视图状态。 */
export const reviewExecutionByCaseAtom = atom<Record<string, ReviewExecutionViewState>>({})

export const reviewTasksByCaseAtom = atom<Record<string, ReviewCaseTasks>>({})

/** 当前选中案卷 ID（选择与异步任务 ID 分离：慢返回不把界面切回旧案） */
export const selectedCaseIdAtom = atom<string | null>(null)

/** V2 作为辅助审核业务事实来源；按 workspace caseId 映射并缓存。 */
export const reviewWorkspaceAggregatesByCaseAtom = atom<Record<string, CaseAggregateV2 | null>>({})
export const reviewWorkspaceAggregateAtom = atom((get) => {
  const caseId = get(selectedCaseIdAtom)
  return caseId ? get(reviewWorkspaceAggregatesByCaseAtom)[caseId] ?? null : null
})
export const reviewWorkspaceCaseRefAtom = atom((get): ReviewWorkspaceCaseRef | null => {
  const caseId = get(selectedCaseIdAtom)
  const aggregate = caseId ? get(reviewWorkspaceAggregatesByCaseAtom)[caseId] : null
  return caseId && aggregate ? { workspaceCaseId: caseId, aggregateV2Id: aggregate.caseV2.id } : null
})
export const reviewWorkspaceRunsByCaseAtom = atom<Record<string, ReviewRunV2 | null>>({})
export const reviewWorkspaceExtractedObservationsByCaseAtom = atom<Record<string, Array<Record<string, unknown>>>>({})
export const reviewWorkspaceRunStaleByCaseAtom = atom<Record<string, boolean>>({})
export const reviewWorkspaceTemplatesByCaseAtom = atom<Record<string, TemplateVersion | null>>({})
export const reviewWorkspaceTemplateAtom = atom((get) => {
  const caseId = get(selectedCaseIdAtom)
  return caseId ? get(reviewWorkspaceTemplatesByCaseAtom)[caseId] ?? null : null
})
export const reviewWorkspaceRunAtom = atom((get) => {
  const caseId = get(selectedCaseIdAtom)
  return caseId ? get(reviewWorkspaceRunsByCaseAtom)[caseId] ?? null : null
})
export const reviewWorkspaceRunStaleAtom = atom((get) => {
  const caseId = get(selectedCaseIdAtom)
  return caseId ? get(reviewWorkspaceRunStaleByCaseAtom)[caseId] ?? false : false
})
export const reviewWorkspaceExtractedObservationsAtom = atom((get) => {
  const caseId = get(selectedCaseIdAtom)
  return caseId ? get(reviewWorkspaceExtractedObservationsByCaseAtom)[caseId] ?? [] : []
})

function emptyTasks(): ReviewCaseTasks {
  return { outline: false, items: false, running: false }
}

/**
 * 当前打开的案卷（可写派生：读 = 缓存[选中ID]；写 = 写入缓存并选中该案卷）。
 * 三栏组件照旧读写此 atom；控制器在异步路径直接操作按案映射。
 */
export const reviewCaseAtom = atom(
  (get) => {
    const id = get(selectedCaseIdAtom)
    return id ? (get(reviewCasesByIdAtom)[id] ?? null) : null
  },
  (get, set, next: ReviewCase | null) => {
    if (!next) {
      set(selectedCaseIdAtom, null)
      return
    }
    set(reviewCasesByIdAtom, { ...get(reviewCasesByIdAtom), [next.id]: next })
    if (get(selectedCaseIdAtom) !== next.id) set(selectedCaseIdAtom, next.id)
  },
)

/** 已存储案卷列表 */
export const reviewCaseListAtom = atom<ReviewCaseSummary[]>([])

/** 当前案卷最近一次审核运行（可写派生：写 = 写入选中案卷的运行槽位） */
export const reviewRunAtom = atom(
  (get) => {
    const id = get(selectedCaseIdAtom)
    return id ? (get(reviewRunsByCaseAtom)[id] ?? null) : null
  },
  (get, set, next: ReviewRun | null) => {
    const id = get(selectedCaseIdAtom)
    if (!id) return
    set(reviewRunsByCaseAtom, { ...get(reviewRunsByCaseAtom), [id]: next })
  },
)

/** 审核运行进行中标记（当前案卷视图；控制器按 caseId 写 reviewTasksByCaseAtom） */
export const reviewRunningAtom = atom(
  (get) => {
    const id = get(selectedCaseIdAtom)
    return id ? (get(reviewTasksByCaseAtom)[id] ?? emptyTasks()).running : false
  },
  (get, set, running: boolean) => {
    const id = get(selectedCaseIdAtom)
    if (!id) return
    set(reviewTasksByCaseAtom, {
      ...get(reviewTasksByCaseAtom),
      [id]: { ...emptyTasks(), ...get(reviewTasksByCaseAtom)[id], running },
    })
  },
)

export const reviewExecutionAtom = atom((get): ReviewExecutionViewState => {
  const id = get(selectedCaseIdAtom)
  return id ? (get(reviewExecutionByCaseAtom)[id] ?? { status: 'idle' }) : { status: 'idle' }
})

/** 模型出口自检结果 */
export const reviewGatewayStatusAtom = atom<ReviewModelGatewayStatus | null>(null)

/** 各异步任务的进行中标记（当前案卷视图） */
export const reviewBusyAtom = atom(
  (get) => {
    const id = get(selectedCaseIdAtom)
    const tasks = id ? get(reviewTasksByCaseAtom)[id] : undefined
    return { outline: tasks?.outline ?? false, items: tasks?.items ?? false }
  },
  (get, set, busy: { outline: boolean; items: boolean }) => {
    const id = get(selectedCaseIdAtom)
    if (!id) return
    set(reviewTasksByCaseAtom, {
      ...get(reviewTasksByCaseAtom),
      [id]: { ...emptyTasks(), ...get(reviewTasksByCaseAtom)[id], ...busy },
    })
  },
)

/** 当前案卷最近运行是否过期（M0/H09 只读派生） */
export const reviewRunStaleAtom = atom((get) => {
  const id = get(selectedCaseIdAtom)
  return id ? (get(reviewRunStaleByCaseAtom)[id] ?? false) : false
})

// ===== 联动状态 =====

export interface ReviewFocus {
  /** 触发联动的问题卡 ID */
  findingId: string
  /** 左栏蓝色高亮目标（逐条可切换，存当前条） */
  ruleAnchor?: ReviewSourceAnchor
  /** 中栏红/黄高亮目标（申报侧） */
  subjectAnchor?: ReviewSourceAnchor
  /** 证明侧锚点（可缺） */
  evidenceAnchor?: ReviewSourceAnchor
  /**
   * 对照侧锚点（可缺，P2/D17 跨文件比对）：
   * 命中的块用同色高亮，让"两处矛盾"在中栏同时可见。
   */
  counterpartAnchor?: ReviewSourceAnchor
  /** 严重度决定高亮颜色 */
  severity: FindingSeverity
  /** 每次点击 +1，驱动 useEffect 重复响应同一定位 */
  nonce: number
}

/** 三栏联动焦点（点击问题卡时写入） */
export const reviewFocusAtom = atom<ReviewFocus | null>(null)

/** V2 原生来源定位；使用 SourceRef 坐标，不伪造 V1 ReviewFinding。 */
export const reviewSourceFocusAtom = atom<{ ref: SourceRef; purpose: 'rule' | 'application' | 'evidence'; nonce: number; originPendingActionKey?: string } | null>(null)
/** Right-panel action asks the corresponding center-panel subject card to open its editor. */
export const reviewAdjudicationEditorSubjectAtom = atom<string | null>(null)

/** 当前选中的问题卡 ID */
export const selectedFindingIdAtom = atom<string | null>(null)

/** 助手抽屉打开状态（Ctrl+Shift+A 切换） */
export const reviewAssistantOpenAtom = atom<boolean>(false)

/** 助手对话历史（按案卷隔离：key = caseId） */
export const reviewAssistantThreadsAtom = atom<Record<string, ReviewAssistantMessage[]>>({})

/** 助手回答进行中 */
export const reviewAssistantPendingAtom = atom<boolean>(false)

// ===== 派生 atoms =====

/** 当前案卷规则包大纲（demo 场景单规则包） */
export const currentRuleOutlineAtom = atom((get) => {
  const reviewCase = get(reviewCaseAtom)
  return reviewCase?.rulePacks[0]?.outline ?? []
})

/** 当前案卷申报条目 */
export const currentItemsAtom = atom((get) => {
  return get(reviewCaseAtom)?.items ?? []
})

/** 当前案卷证明 */
export const currentEvidencesAtom = atom<EvidenceDocument[]>((get) => {
  return get(reviewCaseAtom)?.evidences ?? []
})

/** 当前案卷全部文档 */
export const currentDocumentsAtom = atom<SourceDocument[]>((get) => {
  return get(reviewCaseAtom)?.documents ?? []
})

/** 按角色取文档 */
export const documentsByRoleAtom = atom((get) => {
  const docs = get(currentDocumentsAtom)
  return {
    rule: docs.filter((d) => d.role === 'rule'),
    application: docs.filter((d) => d.role === 'application'),
    evidence: docs.filter((d) => d.role === 'evidence'),
  }
})

/** 选中问题卡对象 */
export const selectedFindingAtom = atom<ReviewFinding | null>((get) => {
  const run = get(reviewRunAtom)
  const id = get(selectedFindingIdAtom)
  if (!run || !id) return null
  return run.findings.find((f) => f.id === id) ?? null
})

/** 问题卡排序：红在前，黄的在后（组内按 ID 稳定排序） */
export const sortedFindingsAtom = atom<ReviewFinding[]>((get) => {
  const run = get(reviewRunAtom)
  if (!run) return []
  const order: Record<string, number> = { red: 0, yellow: 1 }
  return [...run.findings].sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9) || a.id.localeCompare(b.id))
})

// ===== 锚点解析工具（纯函数，供三栏组件共用） =====

/** 在文档中查找锚点对应的块 */
export function findBlockByAnchor(
  documents: SourceDocument[],
  anchor: ReviewSourceAnchor | undefined,
): { document: SourceDocument; block: ReviewDocumentBlock } | undefined {
  if (!anchor) return undefined
  const document = documents.find((d) => d.id === anchor.documentId)
  if (!document) return undefined
  const block = anchor.blockId ? document.blocks.find((b) => b.id === anchor.blockId) : undefined
  if (block) return { document, block }
  // 块级降级：退回文档第一个块（仍算"仅定位到此文件/页"）
  const first = document.blocks[0]
  return first ? { document, block: first } : undefined
}

/** 申报条目 → 中栏卡片视图模型（供列表渲染与联动定位） */
export interface ItemCardView {
  item: ReviewItem
  /** 该条目的发现（红/黄） */
  findings: ReviewFinding[]
  /** 绑定的证据 */
  evidences: EvidenceDocument[]
}

// ===== T6 追加（只加不改：三栏 UI 落地时补充的界面状态） =====

/** 左栏规则定位（点击大纲条目时写入） */
export const reviewRuleLocateAtom = atom<{ anchors: ReviewSourceAnchor[]; nonce: number } | null>(null)

/** 全局错误提示 */
export const reviewErrorAtom = atom<string | null>(null)

/** 当前可见栏（窄窗口单栏模式） */
export const reviewActivePaneAtom = atom<'left' | 'center' | 'right'>('left')
