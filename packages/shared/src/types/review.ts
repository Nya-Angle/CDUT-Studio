/**
 * 内容审核专区 - 共享类型与 IPC 通道契约
 *
 * 对应设计文档：docs/design/2026-10-01-cdut-studio-content-review-demo.md（§9 四个内部契约）
 * 实施决策：docs/plans/2026-10-02-content-review-demo-implementation.md（D2/D3/D5）
 *
 * 核心概念：
 * - SourceDocument：原始文件 + 结构化块（带稳定锚点 ID），三栏定位的唯一来源
 * - ReviewCase：案卷（依据包 + 申报事项 + 证明 + 关联）
 * - RulePack / RuleOutline：审核依据与 AI 生成的规则大纲
 * - ReviewRun / Finding：一次审核运行的发现（问题卡）
 */

// 领域包（P1/D14）经 review 统一出口，保证 `from '@profer/shared'` 单入口
import type { ReviewDomainPackId } from './review-domain-packs'
import type { NormalizedBBox } from './pdf'
export * from './review-domain-packs'

// ===== 定位锚点 =====

/** 锚点定位精度（降级顺序：块 > 页 > 文件） */
export type ReviewAnchorPrecision = 'block' | 'page' | 'document'

/** 来源位置引用：指向 SourceDocument.blocks 的稳定锚点 */
export interface ReviewSourceAnchor {
  /** 来源文档 ID */
  documentId: string
  /** 结构化块 ID（block 级精度时必填） */
  blockId?: string
  /** 页码（1 起，PDF/分页文档用） */
  page?: number
  /** 定位精度（解析器给不到块时显式降级，不伪造精确位置） */
  precision: ReviewAnchorPrecision
}

// ===== 来源文档 =====

/** 结构化块类型 */
export type ReviewBlockKind = 'heading' | 'paragraph' | 'table-cell' | 'list-item' | 'image' | 'line'

/** 文档中的结构化块：三栏高亮定位的最小单元 */
export interface ReviewDocumentBlock {
  /** 稳定 ID（案卷内唯一，形如 "blk-xxxx"） */
  id: string
  kind: ReviewBlockKind
  /** 块文本内容（图片块为空字符串，走 alt 描述） */
  text: string
  /** 1 起页码；无分页概念文档为 1 */
  page: number
  /** 表格单元格补充坐标（sheet/行/列），非表格块缺省 */
  table?: { row: number; column: number; sheet?: string }
  /** 图片块的描述（SVG 证明材料用） */
  imageAlt?: string
  /**
   * 图片/扫描件的原件在案卷内的相对路径（相对案卷目录）。
   *
   * 不内联 base64：避免 case.json 被大图撑爆；审核时按需读取并转 data URL 送 Vision。
   */
  imageAssetPath?: string
  /**
   * 归一化边界框 [x0, y0, x1, y1]（0~1，左上角原点）。
   * 由高精 PDF 解析引擎产出，用于三栏联动的几何定位高亮；纯文本切块缺省。
   */
  bbox?: NormalizedBBox
  /** 全文线性阅读顺序序号（0 起）；仅高精解析路径提供 */
  readingOrder?: number
  /** 解析置信度 0.0 ~ 1.0；仅高精解析路径提供 */
  confidence?: number
}

/** 解析状态 */
export type ReviewParseStatus = 'parsed' | 'partial' | 'failed'

/** 来源文档：依据 / 申报表 / 证明 共用同一结构 */
export interface SourceDocument {
  id: string
  /** 原始文件名（展示用） */
  fileName: string
  /** 案卷内的相对角色 */
  role: 'rule' | 'application' | 'evidence'
  mimeType: string
  /** 原始文件字节大小 */
  sizeBytes: number
  parseStatus: ReviewParseStatus
  /** 解析失败/部分失败的原因（不吞异常） */
  parseError?: string
  /** 结构化块（按文档顺序） */
  blocks: ReviewDocumentBlock[]
  /** 来源标记：demo 案卷固定为 fixture */
  origin: 'upload' | 'fixture' | 'school-system'
  /** 导入时间（ISO） */
  importedAt: string
}

/** 多文件导入结果；失败项按文件返回，已成功的材料不会回滚。 */
export interface ImportDocumentsResult {
  documents: SourceDocument[]
  failures: Array<{ fileName: string; message: string }>
  canceled: boolean
}

/** 材料导入的逐文件进度；扫描 PDF 会额外报告页检查和图像渲染阶段。 */
export interface ReviewImportProgressEvent {
  requestId: string
  caseId: string
  role: SourceDocument['role']
  phase: 'selecting' | 'file-start' | 'extracting-text' | 'scanning-pdf' | 'rendering-pdf' | 'file-complete' | 'file-failed' | 'batch-complete' | 'cancelled'
  fileName?: string
  fileIndex?: number
  fileCount?: number
  completedFiles?: number
  page?: number
  totalPages?: number
  message?: string
}

// ===== 规则包与大纲 =====

/**
 * AI 规则大纲条目类别。
 *
 * 放宽为 string（D15）：领域包可定义自己的类别（如合同的"付款条件/违约责任"）；
 * 内置综测场景沿用 BUILTIN_RULE_OUTLINE_CATEGORIES，展示层对未知类别按原字符串处理。
 */
export type RuleOutlineCategory = string

/** 内置（综测）规则类别：AI 提取时的建议取值，非强制 */
export const BUILTIN_RULE_OUTLINE_CATEGORIES = [
  '准入条件',
  '指标分类',
  '等级分值',
  '材料要求',
  '时间范围',
  '上限',
  '互斥',
  '例外',
] as const

/** 规则大纲条目：AI 从依据材料提取，带原文锚点 */
export interface RuleOutlineItem {
  id: string
  category: RuleOutlineCategory
  /** 规则标题（如 "学科竞赛获奖分值"） */
  title: string
  /** 规则要点摘要 */
  summary: string
  /** 结构化的可比对参数（上限/分值/互斥等，供确定性核对） */
  constraint?: RuleConstraint
  /** 原文锚点（左栏蓝色高亮目标） */
  anchors: ReviewSourceAnchor[]
  /** 来源：AI 提取还是演示预置 */
  generatedBy: 'ai' | 'fixture' | 'manual'
}

/** 规则的可计算约束（AI 不可靠时由模拟引擎消费） */
export interface RuleConstraint {
  kind:
    | 'max-score'
    | 'score-value'
    | 'mutual-exclusion'
    | 'date-range'
    | 'required-evidence'
    | 'level-mapping'
    /** 必备条款（合同/文档审批：依据方要求必须存在的条款） */
    | 'required-clause'
    /** 金额/数值限额（报销等场景，语义同 max-score 但对象是金额） */
    | 'amount-limit'
  /** 数值参数（分值/上限） */
  value?: number
  /** 等级映射（如 A 级 → 3 分） */
  levels?: Record<string, number>
  /** 互斥组（同组规则不可同时计分） */
  exclusionGroup?: string
  /** 日期范围（ISO） */
  dateFrom?: string
  dateTo?: string
  /** 必需证明类型 */
  requiredEvidenceTypes?: string[]
  /** 等级关键词 → 标准等级（用于冲突比对） */
  levelKeywords?: Record<string, string>
  /** 固定分值适用范围；没有明确适用条件时不得按固定分值自动判定。 */
  appliesWhen?: { field: string; equals?: string | number; includes?: string }
}

/** 规则包：一份依据材料 + 其提取的大纲 */
export interface RulePack {
  id: string
  /** 依据文档 ID */
  documentId: string
  /** 规则名称（如 综测细则） */
  name: string
  /** 发布单位 */
  publisher: string
  /** 适用学年 */
  academicYear: string
  version: string
  outline: RuleOutlineItem[]
  /** 用户确认状态 */
  confirmed: boolean
}

// ===== 申报事项与证明 =====

/** 申报事项状态 */
export type ReviewItemStatus = 'identified' | 'confirmed' | 'ignored'

/** 申报事项：中栏的可审核条目 */
export interface ReviewItem {
  id: string
  /** AI/用户可读的事项名（如 "挑战杯省赛二等奖"） */
  title: string
  /** 指标类别（德育/智育/体育/美育/劳育/其他） */
  category: string
  /** 申报等级（如有） */
  level?: string
  /** 申报分数 */
  declaredScore: number
  /** 活动日期（ISO，可缺） */
  activityDate?: string
  /** 组织方/颁发单位 */
  organizer?: string
  /** 原始申报文本锚点（中栏红/黄高亮目标） */
  anchor: ReviewSourceAnchor
  /** 关联证据文档 ID 列表 */
  evidenceDocumentIds: string[]
  status: ReviewItemStatus
  /** 来源：AI 识别 / 演示预置 / 手工录入 */
  identifiedBy: 'ai' | 'fixture' | 'manual'
}

/** 证明识别状态 */
export type EvidenceParseStatus = 'recognized' | 'unclear' | 'unrecognized'

/** 证明材料：中栏证据卡 */
export interface EvidenceDocument {
  documentId: string
  /** AI 识别出的事实摘要（证书名、等级、日期） */
  recognizedFacts: string
  /** 提取到的等级（用于与申报等级比对） */
  recognizedLevel?: string
  /** 识别状态（看不清 → unclear，进人工复核） */
  parseStatus: EvidenceParseStatus
  /** 关联到的申报事项 */
  linkedItemIds: string[]
}

// ===== 审核运行与发现 =====

/** 问题严重度（红/黄） */
export type FindingSeverity = 'red' | 'yellow'

/**
 * 问题类型。
 *
 * 放宽为 string（D15）：领域包定义各自的类型（合同的"条款缺失/违约责任不明"）；
 * BUILTIN_FINDING_KINDS 为内置取值与展示回落依据，未知类型标签按原字符串展示、严重度回落 yellow。
 */
export type FindingKind = string

/** 内置问题类型（综测场景 + 通用） */
export const BUILTIN_FINDING_KINDS = [
  'level-conflict',          // 申报等级与证明等级冲突
  'missing-evidence',        // 缺证明
  'score-over-limit',        // 超上限
  'mutual-exclusion',        // 互斥重复计分
  'date-out-of-range',       // 日期越界
  'unclear-evidence',        // 证明看不清
  'info-incomplete',         // 信息不全
  'rule-unmatched',          // 规则未覆盖
  'cross-document-mismatch', // 待审文件之间互相矛盾（P2/D17）
  'other',                   // 领域包未覆盖的兜底类型
] as const

/** 建议处理 */
export type FindingSuggestion = 'fix-declaration' | 'supplement-evidence' | 'manual-review' | 'modify-score'

/** 审核发现（右栏问题卡） */
export interface ReviewFinding {
  id: string
  /** 关联申报事项 */
  itemId: string
  kind: FindingKind
  severity: FindingSeverity
  /** 问题标题（如 "申报等级与证书等级冲突"） */
  title: string
  /** 详细说明（为什么判） */
  detail: string
  /** 修改/补件建议 */
  suggestion: FindingSuggestion
  suggestionText: string
  /** 申报侧锚点（中栏高亮目标） */
  subjectAnchor: ReviewSourceAnchor
  /** 证明侧锚点（可缺：缺件时不伪造坐标） */
  evidenceAnchor?: ReviewSourceAnchor
  /**
   * 对照侧锚点（P2/D17）：跨文件比对时的另一方位置（另一份待审文件/被比对条款）。
   * 联动时中栏同时高亮 subjectAnchor 与 counterpartAnchor 两处。
   */
  counterpartAnchor?: ReviewSourceAnchor
  /** 依据条款锚点列表（左栏蓝色高亮目标，逐条可切换） */
  ruleAnchors: ReviewSourceAnchor[]
  /** 引用的规则大纲条目 ID */
  ruleItemIds: string[]
  /** 建议分数（规则分值明确时才给，否则 undefined → 待确认） */
  suggestedScore?: number
  /** 结果来源标记 */
  generatedBy: 'ai' | 'mock-engine' | 'fixture'
}

/** 运行状态 */
export type ReviewRunStatus = 'running' | 'completed' | 'failed'

/** 一次审核运行 */
export interface ReviewRun {
  id: string
  caseId: string
  status: ReviewRunStatus
  /** 输入版本（案卷内容哈希，重审可对比） */
  inputVersion: string
  /**
   * 输入指纹（M0/H06）：对影响审核判定的业务输入做内容哈希，与 inputVersion 同值。
   * 用于「运行结果是否对应案卷当前输入」的过期判断；
   * 不是文件数/事项数或 updatedAt 的拼接（同数量下改日期/等级/替换文件也能检出）。
   */
  inputHash?: string
  startedAt: string
  completedAt?: string
  /** 全部发现 */
  findings: ReviewFinding[]
  /** 覆盖摘要 */
  coverage: {
    reviewedItemIds: string[]
    manualReviewItemIds: string[]
    unrecognizedDocumentIds: string[]
    ruleUncoveredItemIds: string[]
    /**
     * 未处理材料账本（M0/H01）：已登记但本次未能纳入检查的文件及原因
     * （图片超单请求上限、模型不支持视觉、扫描件无文本层、解析失败等）。
     * 有该清单时 UI 必须展示，且完整符合结论不成立。
     */
    unprocessedMaterials?: Array<{ documentId: string; fileName: string; reason: string }>
  }
  /** 结果来源 */
  engine: 'ai' | 'mock-engine'
  /** 失败原因 */
  error?: string
}

/** 最近运行查询结果（M0/H09：恢复 + 输入过期标记） */
export interface ReviewLatestRunResult {
  run: ReviewRun | null
  /** true = 最近运行的输入指纹与案卷当前输入不一致（材料/规则/领域已改动），结果仅作历史参考 */
  inputStale: boolean
}

// ===== 案卷 =====

/** 审核类型 */
export type ReviewCaseType = '综合测评' | '活动申请' | '自定义审核'

/** 案卷级手写规则；与上传的审核依据并存，编辑只影响当前案卷。 */
export interface ManualReviewRule {
  id: string
  title: string
  requirement: string
}

/** 案卷（demo 核心聚合根） */
export interface ReviewCase {
  id: string
  title: string
  type: ReviewCaseType
  applicant: string
  academicYear: string
  createdAt: string
  updatedAt: string
  /** 来源文档（依据 + 申报 + 证明） */
  documents: SourceDocument[]
  /** 已从当前审核材料中移除的文件；保留记录用于 V2 来源追溯。 */
  archivedDocuments?: SourceDocument[]
  /** 规则包 */
  rulePacks: RulePack[]
  /** 申报事项 */
  items: ReviewItem[]
  /** 证明识别结果 */
  evidences: EvidenceDocument[]
  /** 演示案卷标记 */
  isDemo: boolean
  /**
   * 审核领域包 ID（P1/D14）：决定规则类别、问题类型与 prompt 模板。
   * 缺省视为 'comprehensive-assessment'（兼容既有案卷）。
   */
  domainPackId?: ReviewDomainPackId
  /** 当前案卷固定使用的已发布模板版本；未设置时按领域包选择默认模板。 */
  reviewTemplate?: { templateId: string; version: number }
  /** 用户针对当前案卷补充的可编辑规则。 */
  manualRules?: ManualReviewRule[]
  /**
   * 待审主体文档 ID 列表（P2/D16）：支持多份待审文件（多份合同/多份申报）。
   * 缺省时回落为「role === 'application' 的全部文档」。
   */
  subjectDocumentIds?: string[]
  /**
   * 案卷修订号（M0/H05）：每次主进程写回 +1，单调递增。
   * 渲染层按 caseId 缓存案卷时用它判断新旧；V1 兼容字段，缺省视为 0。
   */
  revision?: number
}

/** 案卷列表项（不含重文档内容，列表展示用） */
export interface ReviewCaseSummary {
  id: string
  title: string
  type: ReviewCaseType
  applicant: string
  academicYear: string
  updatedAt: string
  isDemo: boolean
  /** 文档数量（依据/申报/证明） */
  documentCount: number
  /** 最近一次运行状态（从未运行为 undefined） */
  lastRunStatus?: ReviewRunStatus
  /** 领域包 ID（列表展示领域标签用） */
  domainPackId?: ReviewDomainPackId
}

// ===== 审核助手 =====

/** 助手消息 */
export interface ReviewAssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  /** 回答引用的来源（问题卡/规则/条目 ID） */
  references?: string[]
  /** 无可用渠道时的静态解答标记 */
  degraded?: boolean
}

// ===== 预审报告导出 =====

export interface ReviewReportData {
  caseId: string
  caseTitle: string
  generatedAt: string
  academicYear: string
  applicant: string
  rulePacks: Array<{ name: string; publisher: string; academicYear: string; version: string }>
  runs: ReviewRun[]
  /** 人工处理记录（demo 中为空占位） */
  manualNotes: string[]
}

// ===== 多模态内容（Vision 通路，D13） =====

/** OpenAI 兼容的文本内容部件 */
export interface ReviewTextContentPart {
  type: 'text'
  text: string
}

/** OpenAI 兼容的图片内容部件（data URL 或 http(s) URL） */
export interface ReviewImageContentPart {
  type: 'image_url'
  image_url: { url: string }
}

/**
 * 消息内容部件。字符串 = 纯文本（既有行为）；数组 = 多模态（图片随文本一起送模型）。
 * 结构化为 OpenAI 兼容格式，本地私有出口（ollama）复用同一形状。
 */
export type ReviewContentPart = ReviewTextContentPart | ReviewImageContentPart

// ===== 模型出口白名单（全局核心：双出口收敛） =====

/** 审核专区允许的模型出口类型 */
export const REVIEW_MODEL_PROVIDERS = ['openai', 'deepseek', 'custom', 'ollama'] as const

/** 审核专区拒绝的出口类型时给出的解释文案 */
export const REVIEW_MODEL_PROVIDER_REJECTED_NOTICE =
  '内容审核专区仅允许 OpenAI 兼容接口与本地模型私有接口两种模型出口（安全合规收敛），当前渠道类型不在白名单内。'

// ===== IPC 通道常量 =====

export const REVIEW_IPC_CHANNELS = {
  /** 载入演示案卷（首次复制进配置目录，之后读存储） */
  LOAD_DEMO_CASE: 'review:load-demo-case',
  /** 列出已存储案卷 */
  LIST_CASES: 'review:list-cases',
  /** 列出某案卷的全部历史运行 */
  LIST_RUNS: 'review:list-runs',
  /** 读取单个案卷 */
  GET_CASE: 'review:get-case',
  /** 创建空案卷 */
  CREATE_CASE: 'review:create-case',
  /** 多选导入文件到案卷（逐文件返回解析结果与失败项） */
  IMPORT_DOCUMENT: 'review:import-document',
  /** 多文件导入进度事件，按 requestId 关联到发起导入的界面。 */
  IMPORT_DOCUMENT_PROGRESS: 'review:import-document-progress',
  /** 开发版自动化验收：使用受控路径直接导入，避开原生文件选择框。 */
  IMPORT_DOCUMENT_FROM_PATH: 'review:import-document-from-path',
  /** 从当前案卷审核输入中移除材料（原件保留在案卷目录） */
  REMOVE_DOCUMENTS: 'review:remove-documents',
  /** 更新同角色材料的审核顺序 */
  REORDER_DOCUMENTS: 'review:reorder-documents',
  /** 删除案卷 */
  DELETE_CASE: 'review:delete-case',
  /** Restore a native archived Case through a Main-trusted, CAS-backed command. */
  RESTORE_CASE_V3: 'review-v3:restore-case',
  /** C Main candidate author latest-revision READ ONLY. No implied publication. */
  AUTHOR_READ_LATEST_V3: 'review-v3:author-read-latest',
  /** Local-only B1 author workbench; never a school-published rule. */
  AUTHOR_SAVE_LOCAL_V3: 'review-v3:author-save-local',
  AUTHOR_PREVIEW_LOCAL_V3: 'review-v3:author-preview-local',
  AUTHOR_FREEZE_LOCAL_V3: 'review-v3:author-freeze-local',
  /** Real Main-scoped native Case physical B2/B30 materials + B3 candidate routing. */
  LOCAL_PRODUCT_CURRENT_V3: 'review-v3:local-product-current',
  LOCAL_PRODUCT_INTERRUPT_V3: 'review-v3:local-product-interrupt',
  LOCAL_PRODUCT_MANUAL_CHOICE_V3: 'review-v3:local-product-manual-choice',
  LOCAL_PRODUCT_UNMATCHED_V3: 'review-v3:local-product-unmatched',
  /** Existing D4 candidate workspaces -> one native Case's technical ReviewPlan. */
  LOCAL_D4_LIST_V3: 'review-v3:local-d4-list',
  LOCAL_D4_ATTACH_PLAN_V3: 'review-v3:local-d4-attach-plan',
  LOCAL_B1_ATTACH_PLAN_V3: 'review-v3:local-b1-attach-plan',
  /** C Main-only current B20 physical candidate preview; never a published Plan. */
  B20_CANDIDATE_READ_V3: 'review-v3:b20-candidate-read',
  /** User requests Main to show native ZIP picker for one CURRENT B20 selected archive. */
  B20_NATIVE_REPICK_V3: 'review-v3:b20-native-repick',
  /** C Main formal published-Plan upgrade through native Case CAS/Receipt. */
  UPGRADE_CANONICAL_PLAN_V3: 'review-v3:upgrade-canonical-plan',
  /** 更新案卷设置（领域包 / 标题 / 类型 / 待审主体文档） */
  UPDATE_CASE_SETTINGS: 'review:update-case-settings',
  /** 手动修改从依据文件生成的单条规则摘要。 */
  UPDATE_RULE_OUTLINE: 'review:update-rule-outline',
  /** 人工修正一条 AI 识别的申报事项。 */
  UPDATE_REVIEW_ITEM: 'review:update-review-item',
  /** Local reviewer declares an item against an already registered exact source version. */
  CREATE_NATIVE_REVIEW_ITEM_V3: 'review-v3:create-native-review-item',
  /** 安全解析案卷图像块的本地预览路径。 */
  GET_IMAGE_PREVIEW_PATH: 'review:get-image-preview-path',
  /** 获取 V2 案卷已登记原件的只读预览路径。 */
  GET_WORKSPACE_DOCUMENT_PREVIEW_PATH: 'review-v2:get-document-preview-path',
  CONFIRM_RULE_PACK: 'review:confirm-rule-pack',
  /** 生成规则大纲（左栏） */
  GENERATE_RULE_OUTLINE: 'review:generate-rule-outline',
  /** 识别可审核条目（中栏） */
  EXTRACT_ITEMS: 'review:extract-items',
  /** 执行审核运行（右栏） */
  RUN_REVIEW: 'review:run-review',
  /** 查询运行状态 */
  GET_RUN: 'review:get-run',
  LATEST_RUN: 'review:get-latest-run',
  // ===== V2（通用审核 Agent，M5 接线） =====
  LIST_TEMPLATES_V2: 'review-v2:list-templates',
  LIST_TEMPLATE_VERSIONS_V2: 'review-v2:list-template-versions',
  GET_TEMPLATE_V2: 'review-v2:get-template',
  PUBLISH_TEMPLATE_V2: 'review-v2:publish-template',
  RUN_REVIEW_V2: 'review-v2:run-review',
  /** 从真实 Pi 会话启动按案卷授权的直接审核运行。 */
  PREPARE_PI_REVIEW_V2: 'review-v2:prepare-pi-review',
  GET_PI_REVIEW_SESSION_V2: 'review-v2:get-pi-review-session',
  /** Main V2 ledger plus actual Pi execution-ownership ACK; read-only business state. */
  GET_BACKGROUND_PI_REVIEW_STATE_V2: 'review-v2:get-background-pi-review-state',
  START_BACKGROUND_PI_REVIEW_V2: 'review-v2:start-background-pi-review',
  STOP_BACKGROUND_PI_REVIEW_V2: 'review-v2:stop-background-pi-review',
  /** 发送失败时结束直接审核运行并撤销本轮授权。 */
  ABORT_PI_REVIEW_V2: 'review-v2:abort-pi-review',
  LIST_RUNS_V2: 'review-v2:list-runs',
  GET_RUN_V2: 'review-v2:get-run',
  CANCEL_RUN_V2: 'review-v2:cancel-run',
  MIGRATE_CASE_V2: 'review-v2:migrate-case',
  BOOT_CHECK_V2: 'review-v2:boot-check',
  // ===== N1d：V2 应用命令（07 §3.2 首批） =====
  SEED_FIXTURE_V2: 'review-v2:seed-fixture',
  CREATE_CASE_V2: 'review-v2:create-case',
  GET_AGGREGATE_V2: 'review-v2:get-aggregate',
  UPDATE_FIELDS_V2: 'review-v2:update-fields',
  /** 导入草案补录/编辑申报事项（必需分项）；Main 用已发布模板校验并 CAS 落盘。 */
  UPSERT_CASE_SUBJECT_V2: 'review-v2:upsert-case-subject',
  CORRECT_OBSERVATION_V2: 'review-v2:correct-observation',
  GET_RUN_OBSERVATIONS_V2: 'review-v2:get-run-observations',
  EXPORT_REPORT_V2: 'review-v2:export-report',
  ASSIGNMENT_CREATE_V2: 'review-v2:assignment-create',
  ASSIGNMENT_REVOKE_V2: 'review-v2:assignment-revoke',
  ASSIGNMENT_LIST_V2: 'review-v2:assignment-list',
  CASE_TIMELINE_V2: 'review-v2:case-timeline',
  SET_EVIDENCE_LINK_V2: 'review-v2:set-evidence-link',
  // ===== N3b：业务闭环命令 =====
  ENSURE_INITIAL_TASK_V2: 'review-v2:ensure-initial-task',
  RECORD_STAGE_DECISION_V2: 'review-v2:record-stage-decision',
  RESOLVE_SUPPLEMENT_V2: 'review-v2:resolve-supplement',
  RESPOND_SUPPLEMENT_V2: 'review-v2:respond-supplement',
  RECORD_WORKSPACE_DISPOSITION_V2: 'review-v2:record-workspace-disposition',
  OPEN_WORKSPACE_SUPPLEMENT_V2: 'review-v2:open-workspace-supplement',
  ACKNOWLEDGE_WORKSPACE_MATERIAL_V2: 'review-v2:acknowledge-workspace-material',
  DECIDE_WORKSPACE_CASE_V2: 'review-v2:decide-workspace-case',
  RECORD_WORKSPACE_SUBJECT_ADJUDICATION_V2: 'review-v2:record-workspace-subject-adjudication',
  GET_WORKSPACE_RUN_VALIDITY_V2: 'review-v2:get-workspace-run-validity',
  CAST_RATING_V2: 'review-v2:cast-rating',
  /** T07 评分视图读取（actor 由 Main 派生，Renderer 只声明角色） */
  T07_GET_VIEW: 'review-v3:t07-get-view',
  /** T07 评分动作（分配/回避/评分/同分/冻结/重开），要求 expectedRevision */
  T07_APPLY_ACTION: 'review-v3:t07-apply-action',
  /** T07 建立评分轮次（仅组织者、仅首次） */
  T07_INIT_STATE: 'review-v3:t07-init-state',
  /** 未匹配业务候选 → 可编辑模板草稿（只做脚手架，不发布、不虚构政策） */
  FALLBACK_TEMPLATE_DRAFT_V3: 'review-v3:fallback-template-draft',
  /** 把 50 套 D4 冻结候选发布为演示模板（无校方政策引用，判据全语义） */
  D4_DEMO_PUBLISH_V3: 'review-v3:d4-demo-publish',
  /** 已发布模板规则运行（编译冻结计划 → T04 检查 → 真实 ReviewRunV2） */
  TEMPLATE_RULE_RUN_V3: 'review-v3:template-rule-run',
  /** T01 受控模型起草（渠道与凭据留在 Main，渲染层只给 prompt 文本） */
  T01_MODEL_DRAFT: 'review-v3:t01-model-draft',
  /** T06 物理来源选择（Main 弹真实 OS 选择器，返回不透明 entryId） */
  T06_PICK_PHYSICAL_SOURCE: 'review-v3:t06-pick-physical-source',
  /** T06 物理入库提交（建案 + 逐原件入库 + 批次回执，requestId 幂等） */
  T06_COMMIT_PHYSICAL_IMPORT: 'review-v3:t06-commit-physical-import',
  /** 只读案卷存储诊断（坏/可恢复案卷不静默消失，ASSET-12） */
  LIST_CASE_STORAGE_ISSUES_V3: 'review-v3:list-case-storage-issues',
  /** T05 可信阶段能力投影（只读；不构成授权） */
  T05_STAGE_CAPABILITY: 'review-v3:t05-stage-capability',
  /** T05 可信阶段决定（Main 重核身份/Run/准备度后原子写入） */
  T05_RECORD_STAGE_DECISION: 'review-v3:t05-record-stage-decision',
  /** T02 暂存来源只读预览（Main 派生 B2 ctx；不产生 DocumentVersion） */
  T02_STAGED_INVENTORY_V3: 'review-v3:t02-staged-inventory',
  /** T09 签发学生离线应答包 */
  T09_ISSUE_STUDENT: 'review-v3:t09-issue-student',
  /** T09 从真实 T07 轮次签发匿名评委任务（本地声明，非学校认证） */
  T09_ISSUE_JUDGE: 'review-v3:t09-issue-judge',
  /** T09 预览离线回件（只校验不写入） */
  T09_PREVIEW_REPLY: 'review-v3:t09-preview-reply',
  /** T09 导入离线回件（附件先登记原件，再原子答复补件） */
  T09_IMPORT_REPLY: 'review-v3:t09-import-reply',
  RUN_BATCH_V2: 'review-v2:run-batch',
  SUBMIT_APPEAL_V2: 'review-v2:submit-appeal',
  RESOLVE_APPEAL_V2: 'review-v2:resolve-appeal',
  /** F13 本机申诉提交/独立复核/撤回；真实 Actor 在 Main 派生。 */
  F13_SUBMIT_LOCAL_APPEAL: 'review-v3:f13-submit-local-appeal',
  F13_REVIEW_LOCAL_APPEAL: 'review-v3:f13-review-local-appeal',
  F13_WITHDRAW_LOCAL_APPEAL: 'review-v3:f13-withdraw-local-appeal',
  // ===== N4b：模板向导 =====
  CREATE_POLICY_V2: 'review-v2:create-policy',
  SAVE_TEMPLATE_DRAFT_V2: 'review-v2:save-template-draft',
  LIST_ARCHIVED_TEMPLATES_V2: 'review-v2:list-archived-templates',
  REORDER_TEMPLATES_V2: 'review-v2:reorder-templates',
  REMOVE_TEMPLATE_V2: 'review-v2:remove-template',
  RESTORE_TEMPLATE_V2: 'review-v2:restore-template',
  // ===== N5b：批次管理 =====
  CREATE_BATCH_V2: 'review-v2:create-batch',
  GET_BATCH_V2: 'review-v2:get-batch',
  LIST_BATCHES_V2: 'review-v2:list-batches',
  BATCH_ACTION_V2: 'review-v2:batch-action',
  BATCH_GROUP_PREVIEW_V2: 'review-v2:batch-group-preview',
  BATCH_GROUP_APPLY_V2: 'review-v2:batch-group-apply',
  BATCH_AUTO_PROCESS_V2: 'review-v2:batch-auto-process',
  LIST_CASES_V2: 'review-v2:list-cases',
  SUBMIT_CASE_V2: 'review-v2:submit-case',
  PICK_REGISTER_MATERIAL_V2: 'review-v2:pick-register-material',
  REGISTER_MATERIAL_PATH_V2: 'review-v2:register-material-path',
  /** 助手对话 */
  ASSISTANT_CHAT: 'review:assistant-chat',
  /** 导出预审报告 */
  EXPORT_REPORT: 'review:export-report',
  /** 查询当前可用模型出口（网关自检） */
  GET_MODEL_GATEWAY_STATUS: 'review:get-model-gateway-status',
  /** 查询/保存审核模块独立使用的 Agent 渠道与模型。 */
  GET_MODULE_SETTINGS_V2: 'review-v2:get-module-settings',
  SAVE_MODULE_SETTINGS_V2: 'review-v2:save-module-settings',
} as const

export type ReviewIpcChannel = (typeof REVIEW_IPC_CHANNELS)[keyof typeof REVIEW_IPC_CHANNELS]

/** Business state of the review run, not a school approval outcome. */
export type ReviewBackgroundPiRunPhase =
  | 'not-started' | 'preparing' | 'accepted' | 'needs-attention' | 'finished' | 'incomplete'

export interface ReviewBackgroundPiRunState {
  caseId: string
  phase: ReviewBackgroundPiRunPhase
  runId?: string
  /** Persisted V2 ledger status; 'running' alone never means accepted. */
  runStatus?: import('./review-v2').RunV2Status
  completedAt?: string
  /**
   * 终态失败/中断的可诊断原因（仅在 phase 为 incomplete/needs-attention 时给出）。
   * 失败必须可追踪：只给 phase 而不给原因，界面无法区分「模型慢」与「链路挂死」。
   */
  error?: string
}

/** Main 创建内部会话和指派；前台不传 session、目录或执行回调。 */
export interface ReviewBackgroundPiStartRequest {
  caseId: string
  mode?: 'update' | 'restart'
  /**
   * 用户显式确认「继续上次检查点（新回合）」。
   * 冷启动中断的回合没有耐久 effect journal；未显式确认时 Main 必须失败关闭，
   * 不得自动按原 RunId 重放未知的模型/Provider 请求。
   */
  resumeInterrupted?: boolean
}

// ===== IPC 请求/响应载荷 =====

/** 网关自检结果 */
export interface ReviewModelGatewayStatus {
  /** 是否有可用出口 */
  available: boolean
  /** 出口协议类型 */
  protocol: 'openai-compatible' | 'local-private' | 'none'
  /** 渠道名（展示用） */
  channelName?: string
  /** 模型 ID */
  modelId?: string
  /** 不可用原因 */
  reason?: string
}

/** 审核模块偏好。密钥仍保存在全局渠道配置里，这里只保存选择的渠道和模型 ID。 */
export interface ReviewModuleSettingsV2 {
  agentModelSelection: { channelId: string; modelId: string } | null
}

/** 请求：生成规则大纲 */
export interface GenerateRuleOutlineRequest {
  caseId: string
  rulePackId: string
}

/** 请求：识别可审核条目 */
export interface ExtractItemsRequest {
  caseId: string
}

/** 请求：执行审核 */
export interface RunReviewRequest {
  caseId: string
}

/** 请求：更新案卷设置 */
export interface UpdateCaseSettingsRequest {
  caseId: string
  /** 领域包 ID（切换后规则类别与问题类型随之变化） */
  domainPackId?: ReviewDomainPackId
  title?: string
  type?: ReviewCaseType
  /** 待审主体文档 ID 列表（P2 多待审文件） */
  subjectDocumentIds?: string[]
  /** 设置为 null 时回退到按审核类型匹配的默认模板。 */
  reviewTemplate?: { templateId: string; version: number } | null
  /** 全量替换本案手写规则；传空数组可清空。 */
  manualRules?: ManualReviewRule[]
}

/** 请求：编辑依据文件生成的规则摘要（来源锚点由主进程保留）。 */
export interface UpdateRuleOutlineRequest {
  caseId: string
  rulePackId: string
  ruleId: string
  title: string
  summary: string
}

/** 请求：人工修正 AI 识别的申报事项字段。来源锚点和材料关联由主进程保留。 */
export interface UpdateReviewItemRequest {
  caseId: string
  itemId: string
  title: string
  category: string
  declaredScore: number
  level?: string
  activityDate?: string
  organizer?: string
}

/**
 * Source-anchored native HUMAN declaration, not an AI fact or school decision.
 * requestId is an opaque idempotency key, never an identity credential.
 */
export interface CreateNativeReviewItemV3Request {
  caseId: string
  requestId: string
  expectedRevision: number
  documentVersionId: string
  /** Existing parsed block identity; when absent, location is explicitly file-level. */
  sourceBlockId?: string
  title: string
  category: string
  declaredScore: number
  level?: string
  activityDate?: string
  organizer?: string
}

/** 请求：助手对话 */
export interface AssistantChatRequest {
  caseId: string
  /** 本轮对话历史（含最新用户消息） */
  history: ReviewAssistantMessage[]
  /** 选中的问题卡 ID（可缺） */
  focusFindingId?: string
}

/** 请求：导出报告 */
export interface ExportReportRequest {
  caseId: string
}

/** 响应：导出报告（主进程返回保存路径） */
export interface ExportReportResult {
  /** 导出的 JSON 报告绝对路径 */
  jsonPath: string
  /** 导出的 Markdown 报告绝对路径 */
  markdownPath: string
}
