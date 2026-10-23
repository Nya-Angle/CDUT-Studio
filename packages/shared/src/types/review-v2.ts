/**
 * 通用审核 Agent V2 数据契约（docs/design/review-agent/03 §3）
 *
 * 与 V1（review.ts）并存：V2 是模板化、可核验、可恢复审核的目标模型。
 * 不变量（03 §3 表）摘要：
 * - 发布版模板不可变；导出不含凭证/学生材料
 * - 未确认/冲突规则不能自动产生确定判定；不得默认首份生效
 * - 每个 CheckResult 对应一个计划检查；覆盖不从 finding 数量推导
 * - SourceRef 必须携带 caseId/documentVersionId/parseRevision + 明确位置；无准确坐标不得伪造
 * - BusinessDecision 独立于 AI 建议；更正追加新决定不覆盖旧记录
 */

import type { ReviewDomainPackId } from './review-domain-packs'

// ===== 通用基础 =====

/** 动态字段值：文本/数字/日期/枚举/多选/布尔/对象/重复行表/附件引用（02 §5.1） */
export type FieldValue =
  | { kind: 'text'; value: string }
  | { kind: 'number'; value: number; unit?: string }
  | { kind: 'date'; value: string }
  | { kind: 'enum'; value: string }
  | { kind: 'multi'; value: string[] }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'object'; value: Record<string, FieldValue> }
  | { kind: 'rows'; value: Array<Record<string, FieldValue>> }
  | { kind: 'attachment'; documentVersionId: string }

/** 字段定义（模板配置：必填/条件必填/范围/抽取提示/对外可见性） */
export interface FieldSpec {
  key: string
  label: string
  kind: FieldValue['kind']
  required: boolean
  conditionRequired?: ConditionAST
  unit?: string
  min?: number
  max?: number
  /** AI 抽取提示（自然语言，非 Prompt 注入代码） */
  extractionHint?: string
  /** 对外可见性：public = 学生可见；internal = 仅审核侧 */
  visibility: 'public' | 'internal'
  /** N1a（07 §2.1）：作用域 case/subject（缺省 subject 兼容旧模板） */
  scope?: 'case' | 'subject'
  /** subject 字段仅属于此审核分项；未填写时可用于所有分项。 */
  sectionId?: string
  /** 枚举可选项（kind='enum' 时应提供） */
  options?: Array<{ value: string; label: string }>
  defaultValue?: unknown
  displayHint?: string
  readOnly?: boolean
  validation?: Array<{ kind: 'min' | 'max' | 'pattern' | 'required-when'; value?: string; when?: unknown }>
}

/** 条件树（03 §4：有限算子，业务运算由注册算子执行，不 eval） */
export type ConditionAST =
  | { all: ConditionAST[] }
  | { any: ConditionAST[] }
  | { not: ConditionAST }
  | { field: string; op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'exists'; value?: unknown }
  | { fact: string; op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'exists'; value?: unknown }

/** 三值结果：unknown 不得当 false/0（03 §4） */
export type TriState = 'true' | 'false' | 'unknown'

// ===== 来源与文档 =====

/** 材料中的位置（五选一；无准确坐标用 file 级并说明） */
export type SourceLocation =
  | { kind: 'pdf-rect'; page: number; rect: { x: number; y: number; w: number; h: number } }
  | { kind: 'sheet-cell'; sheet: string; row: number; column: string }
  | { kind: 'paragraph'; index: number }
  | { kind: 'text-range'; start: number; end: number }
  | { kind: 'file' }

/** 统一来源引用（03 §3：必须带 caseId/documentVersionId/parseRevision） */
export interface SourceRef {
  caseId: string
  documentVersionId: string
  parseRevision: number
  location: SourceLocation
  /** 原文摘录（若解析器只提供 file 级位置，仍保留模型引用的短文本）。 */
  quote?: string
}

/** 文档版本（同名文件不同版本；原始文件不改写；解析状态与审核使用状态分开） */
export interface DocumentVersion {
  documentId: string
  versionId: string
  contentHash: string
  role: 'rule' | 'application' | 'evidence' | 'attachment'
  materialSlotId?: string
  fileName: string
  mimeType: string
  sizeBytes: number
  /** 原件相对路径（review-cases/{caseId}/source-docs/{versionId}/） */
  assetPath: string
  parseRevision: number
  parseStatus: 'pending' | 'parsed' | 'partial' | 'failed'
  parseError?: string
  /** 解析产物：文本块（带位置）与表格/图片资产索引（M2 扩展） */
  blocks: Array<{
    blockId: string
    text: string
    location?: SourceLocation
    kind: 'text' | 'image' | 'table'
    /** Office 文档的块级结构信息，保留标题、列表与表格单元格语义。 */
    format?: 'heading' | 'paragraph' | 'list-item' | 'table-cell' | 'ocr-text' | 'vision-text'
    ocr?: { imageBlockId: string; engine: string; confidence: number; rect: { x: number; y: number; w: number; h: number } }
    vision?: { imageBlockId: string; engine: string }
    table?: { row: number; column: number }
    imageAlt?: string
    imageAssetPath?: string
  }>
  /** 审核使用状态：登记≠已读（03 §6 材料账本） */
  usage: 'registered' | 'read' | 'partially-read' | 'unread'
  unusedReason?: string
  /** 审核员已明确确认打开并核对原件；可弥补解析失败材料没有机器可读文本的情况。 */
  manualReadReceipt?: { actorId: string; reason: string; at: string }
  /** N2c/G01：版本链（同名替换旧版不参与新审核）与原件字节身份 */
  active?: boolean
  supersedesVersionId?: string
  byteHash?: string
}

// ===== 模板与规则 =====

/** 材料槽（02 §5.2：名称/用途/条件/类型/数量/关键要素/复用） */
export interface MaterialSlotSpec {
  id: string
  name: string
  purpose: string
  requiredWhen?: ConditionAST
  acceptedKinds: Array<'pdf' | 'image' | 'office' | 'sheet' | 'text' | 'zip'>
  minCount: number
  /** 缺少材料在哪个生命周期阶段阻断；旧模板默认 submission。 */
  requiredAt?: 'submission' | 'decision'
  maxCount: number
  /** 关键要素：Agent 提取与人工检查的要点 */
  requiredElements: string[]
  allowReuseAcrossSubjects: boolean
  /** 该材料槽仅服务某个审核分项；未填写时为整份案卷共用。 */
  sectionId?: string
}

/** 有限的工作簿检查定义；模板只能选择固定操作，不接受脚本或任意公式。 */
export interface TemplateSheetCheckSpec {
  kind: 'sheet-sum-match' | 'sheet-unique-values'
  materialSlotId: string
  sheetName?: string
  firstDataRow: number
  valueColumn: string
  labelColumn?: string
  stopLabels?: string[]
  applicantFieldKey?: string
  quantityColumn?: string
  unitPriceColumn?: string
}

/** 模板中的一项审核标准；语义规则交给 Agent，人工规则进入同案待办。 */
export interface TemplateCriterionSpec {
  id: string
  title: string
  requirement: string
  execution: 'deterministic' | 'semantic' | 'manual'
  targetScope: 'subject' | 'group' | 'case'
  dataCheck?: TemplateSheetCheckSpec
}

/** 一个案卷内的审核分项。所有分项共享同一个 ReviewCase 与同一次运行。 */
export interface TemplateSectionSpec {
  id: string
  name: string
  description?: string
  order: number
  required: boolean
  criteria: TemplateCriterionSpec[]
}

/** 规则执行类型（03 §4：确定/语义/人工三路） */
export type RuleExecutionKind = 'deterministic' | 'semantic' | 'manual'

/** 规则规范（RuleSpec）：一条可执行检查的完整定义 */
export interface RuleSpec {
  id: string
  policyVersionId: string
  title: string
  /** 规则限定到同案中的审核分项；未填写时作用于整案。 */
  sectionId?: string
  /** 适用对象/条件 */
  when: ConditionAST
  /** 检查要求（确定性规则为条件树/计算定义；语义规则为标准描述） */
  requirement: string
  targetScope: 'subject' | 'group' | 'case'
  groupBy?: string[]
  execution: RuleExecutionKind
  /** 确定性规则：条件/聚合/上限/择高等结构化定义 */
  calculation?: {
    deduplicateBy?: string[]
    select?: 'highest-eligible-score' | 'sum' | 'single'
    valueFrom: string
    aggregate?: 'sum' | 'max'
    cap?: { value: string; unit: string }
    allocation?: 'score-desc-then-subject-id'
  }
  /** 语义规则：输出枚举 + 引用限制 */
  semanticOutputEnum?: string[]
  /** 检查结果不满足时的默认动作 */
  onFail: 'reject' | 'supplement' | 'modify' | 'manual-review'
  onUnknown: 'needs-confirmation' | 'pending'
  /** 来源与治理 */
  sourceRefIds: string[]
  priority: number
  /** 确认状态：未确认/冲突规则不能自动产生确定判定 */
  confirmation: 'unconfirmed' | 'confirmed' | 'conflict'
  confirmedBy?: string
  confirmedAt?: string
  effectiveFrom?: string
  effectiveUntil?: string
  exceptions?: Array<{ when: ConditionAST; note: string }>
  /** 由审核依据大纲编译的约束；旧版政策规则缺失时保持兼容。 */
  workspaceConstraint?: import('./review').RuleConstraint
  /** 模板提供的有限数据操作；不会执行模板中的代码。 */
  dataCheck?: TemplateSheetCheckSpec
}

/** 政策版本：一组规则 + 原始文档来源（不可变） */
export interface PolicyVersion {
  id: string
  version: number
  title: string
  /** 来源：文档条款或负责人直接要求（后者不伪造页码） */
  origin:
    | { kind: 'document'; documentVersionId: string }
    | { kind: 'owner-statement'; text: string; enteredBy: string; enteredAt: string }
  rules: RuleSpec[]
  publishedAt?: string
}

/** 流程阶段（02 §5.5：自动检查/人工复核/独立评分/补件等待/汇总/定稿/交接） */
export interface WorkflowStageSpec {
  id: string
  name: string
  kind: 'auto-check' | 'manual-review' | 'independent-rating' | 'supplement-wait' | 'summary' | 'finalize' | 'handoff'
  executorRole: RoleId
  enterWhen?: ConditionAST
  exitWhen?: ConditionAST
  deadlineDays?: number
  requiredApprovers?: number
  skippableReason?: string
  /** N1a：正常下一阶段/退回目标/流程 owner（stageId 已稳定） */
  nextStageId?: string
  returnToStageId?: string
  workflowOwner?: 'local' | 'school'
}

/** 评审量表（02 §5.4：维度/N/A 策略/权重） */
export interface RubricSpec {
  dimensions: Array<{ id: string; name: string; min: number; max: number; weight: number; naWhen?: ConditionAST }>
  totalPrecision: number
  missingStrategy: 'block' | 'exclude'
  tieBreaker?: 'shared-rank' | 'by-dimension' | 'owner-decides'
  /** N1a：最低有效人数/N/A 策略/量尺转换/分歧阈值/名额（07 §7.2） */
  minEffectiveJudges?: number
  naStrategy?: 'exclude' | 'exclude-renormalize'
  scaleConversion?: { fromMax: number; toMax: number }
  divergenceThreshold?: number
  quota?: number
}

/** 模板版本（发布版不可变；draft→published→deprecated） */
export interface TemplateVersion {
  templateId: string
  version: number
  schemaVersion: 2
  name: string
  /** 模板库展示说明；用于说明适用场景与初始化边界。 */
  description?: string
  /** 模板来源类别：项目内置、开源项目启发或用户自建。 */
  catalogKind?: 'builtin' | 'reference' | 'custom'
  /** 开源参考来源与使用边界，不代表采纳了其学校规则或分值。 */
  sourceNote?: string
  /** 审核对象类型（02 §5.1：个人/组织/项目/文件/交易/自定义） */
  objectType: 'person' | 'organization' | 'project' | 'document' | 'transaction' | 'custom'
  /** 主体展示名来源（学年不是全局必填） */
  displayName: { template: string }
  fields: FieldSpec[]
  materialSlots: MaterialSlotSpec[]
  /** 多分项审核配置；旧模板缺省表示整案审核。 */
  sections?: TemplateSectionSpec[]
  policyVersionIds: string[]
  /** N1b：精确政策引用（ID+版本+内容 hash；与 policyVersionIds 并存，发布校验以此为准） */
  policyRefs?: import('./review-v2-contracts').PolicyRef[]
  rubric?: RubricSpec
  stages: WorkflowStageSpec[]
  outputs: Array<{ id: string; kind: 'approval' | 'item-feedback' | 'supplement-list' | 'score-sheet' | 'roster' | 'rating-matrix'; audience: RoleId }>
  /** 默认能力开关：辅助审核 / 限定条件自动通过 */
  autoPassPolicy?: { enabled: boolean; conditions?: ConditionAST }
  status: 'draft' | 'published' | 'deprecated'
  /**
   * Main 发布时派生的执行范围（不接受作者自填）：
   * - rules：至少一条 authored 审核标准，可据此生成规则/检查；
   * - material-manual-only：没有任何审核标准，只能核对材料与人工办理。
   * 发布门禁据此区分“业务规则模板”和“仅材料完整性模板”。
   */
  executionScope?: 'rules' | 'material-manual-only'
  /** 兼容 V1 领域包词汇（展示标签/提示沿用） */
  domainPackId?: ReviewDomainPackId
  createdAt: string
  publishedAt?: string
}

// ===== 案卷与主体 =====

export type RoleId = 'student' | 'reviewer' | 'teacher' | 'judge' | 'organizer' | 'template-owner' | 'system'

/** 案卷阶段（02 §7） */
export type CaseStage =
  | 'draft' | 'submitted' | 'reviewing' | 'awaiting-supplement' | 'awaiting-review'
  | 'awaiting-rating' | 'awaiting-final' | 'decided' | 'archived'

/** 审核主体：事项/条款/项目/预算行（分数按需出现） */
export interface ReviewSubject {
  id: string
  type: 'item' | 'clause' | 'project' | 'budget-line' | 'custom'
  title: string
  /** 事项所属审核分项；同一案卷可包含多个分项。 */
  sectionId?: string
  fields: Record<string, FieldValue>
  sourceRefs: SourceRef[]
  /** 修正层：ai-extracted → user-confirmed（保留原值可回溯） */
  correction: 'ai-extracted' | 'user-confirmed'
  status: 'identified' | 'confirmed' | 'ignored'
}

/** 案卷 V2 */
export interface ReviewCaseV2 {
  id: string
  /** V1 兼容：沿用同一存储目录与 ID 规则 */
  templateId: string
  templateVersion: number
  title: string
  /** 外部映射（校方 ID，本地为空） */
  externalRef?: { system: string; externalId: string }
  objectType: TemplateVersion['objectType']
  /** 案卷级字段（申请人/周期等，按模板） */
  caseFields: Record<string, FieldValue>
  /**
   * C1 native three-column compatibility DRAFT state (never a published
   * PolicyVersion, CanonicalPlan, or signed BusinessDecision).
   * Current source scope is version-pinned so replaced documents are not
   * silently re-admitted through an old stable documentId.
   */
  nativeWorkspaceDraft?: {
    manualRules: Array<{ id: string; title: string; requirement: string }>
    subjectDocumentVersionIds?: string[]
  }
  subjects: ReviewSubject[]
  documents: DocumentVersion[]
  /** 从当前工作台审核依据生成的可追溯规则快照（迁移期与模板政策并行）。 */
  reviewRules?: RuleSpec[]
  stage: CaseStage
  /** 乐观并发：每次业务写入 +1（03 §7 expectedRevision） */
  revision: number
  createdAt: string
  updatedAt: string
  /** 提交者主体（本地模式为 local 身份） */
  submitter?: { actorId: string; actorSource: ActorSource }
}

// ===== 事实与证据 =====

/** 观察（材料事实）：缺失与零值不同；AI 提取与人工修正可回溯 */
export interface Observation {
  id: string
  subjectId: string
  fieldKey: string
  value: FieldValue
  sourceRefs: SourceRef[]
  /** 提取方式与确认状态 */
  extractedBy: 'ai' | 'user' | 'fixture'
  confirmed: boolean
  /** 替代关系：本条替代哪条旧观察（保留链） */
  supersedesObservationId?: string
  createdAt: string
}

/** 证据绑定：多对多；共享证书≠重复申报（R02 需求） */
export interface EvidenceLink {
  id: string
  documentVersionId: string
  blockRef?: SourceRef
  subjectId: string
  /** 本证据支持的事实陈述 */
  supportsFact: string
  status: 'candidate' | 'confirmed' | 'rejected'
  /** 复用范围：同一证据可用于哪些事实（重复计分由规则判，不在此判） */
  reuseScope?: string
  linkedBy: 'ai' | 'user'
}

// ===== 检查与发现 =====

export type CheckStatus =
  | 'compliant' | 'non-compliant' | 'awaiting-supplement' | 'awaiting-confirmation'
  | 'not-applicable' | 'not-executed' | 'execution-failed'

/** 检查结果：每个计划检查都有记录（03 §3 不变量） */
export interface CheckResult {
  checkId: string
  ruleId: string
  /** 目标：单主体 / 组 / 案卷级 */
  target: { scope: 'subject' | 'group' | 'case'; subjectIds: string[]; groupKey?: string }
  status: CheckStatus
  /** 状态理由（not-applicable 带条件理由；not-executed 带原因） */
  reason: string
  sourceRefs: SourceRef[]
  /** 本次结论实际使用的事实、证明关联和出处，可供审核员追溯。 */
  basis?: { observationIds: string[]; evidenceLinkIds: string[]; sourceRefs: SourceRef[] }
  /** 确定计算明细（数值规则） */
  calculation?: {
    inputs: Array<{ key: string; value: number; from: string }>
    result: string
    detailLines: string[]
  }
  executedBy: 'deterministic' | 'semantic' | 'manual'
  executedAt: string
}

/** 语义/人工意见与确定检查分开（03 §3：三路结果不混写） */
export interface AiOpinion {
  id: string
  checkId?: string
  kind: string
  severity: 'red' | 'yellow'
  title: string
  detail: string
  suggestion: 'fix-declaration' | 'supplement-evidence' | 'manual-review' | 'modify-score'
  suggestionText: string
  sourceRefs: SourceRef[]
  /** 引用核验状态（M0/H07 语义延续到 V2） */
  verification: 'verified' | 'file-level' | 'unverified'
  suggestionScore?: number
}

/** 人工处理状态（02 §7：忽略是有理由的处理，不自动成为符合） */
export type FindingDisposition = 'pending' | 'confirmed-issue' | 'human-confirmed-compliant' | 'false-positive' | 'supplement-requested' | 'waived' | 'escalated'

export interface FindingDispositionRecord {
  findingKey: string
  disposition: FindingDisposition
  actor: Actor
  reason: string
  at: string
}

/** 审核员对单个申报事项的最终认定；更正通过 supersedes 链追加，保留历史。 */
export interface SubjectAdjudication {
  id: string
  subjectId: string
  outcome: 'accepted' | 'rejected' | 'modified'
  finalFields?: Record<string, FieldValue>
  reason: string
  basedOnRunId: string
  inputHash: string
  actor: Actor
  at: string
  supersedesAdjudicationId?: string
}

// ===== 运行 =====

export type RunV2Status =
  | 'queued' | 'running' | 'awaiting-input' | 'awaiting-decision'
  | 'paused' | 'completed' | 'partially-completed' | 'failed' | 'cancelled'

/** 执行图节点状态（检查点最小单元，M3 扩展） */
export interface CheckpointRecord {
  nodeId: string
  inputHash: string
  status: 'pending' | 'running' | 'done' | 'failed' | 'waiting-input'
  outputRef?: string
  attempts: number
  lastError?: string
}

/** 运行 V2：已完成结果不可改；补件/修正新建运行（03 §3） */
export interface ReviewRunV2 {
  id: string
  caseId: string
  templateId: string
  templateVersion: number
  /** 不可变输入 manifest：模板/规则/文档版本/事实/绑定/评分设置（03 §7） */
  inputManifest: {
    hash: string
    templateVersion: number
    policyVersions: Array<{ policyVersionId: string; version: number }>
    documentVersions: Array<{ documentId: string; versionId: string; contentHash: string }>
    observationIds: string[]
    evidenceLinkIds: string[]
    effectiveRuleIds?: string[]
    effectiveRuleSetHash?: string
    /** 每条有效规则依赖的事实字段；语义规则使用 * 表示依赖材料中的事实。 */
    effectiveRuleDependencies?: Array<{ ruleId: string; fieldKeys: string[] }>
    /**
     * 本次运行冻结的已发布模板计划指纹（ARCH-CLOSURE-R01 D1）。
     * 旧运行没有该字段表示「未绑定计划」，不得据此推断计划已通过。
     */
    planFingerprint?: string
  }
  status: RunV2Status
  checkpoints: CheckpointRecord[]
  checks: CheckResult[]
  opinions: AiOpinion[]
  /** 覆盖两组分母（03 §6）：材料账本 + 检查账本 */
  coverage: {
    documents: Array<{ documentVersionId: string; status: DocumentVersion['usage']; reason?: string }>
    plannedChecks: number
    completedChecks: number
    effectiveVerdicts: number
    pendingChecks: number
  }
  /** 实际模型/解析版本与诊断用量（H16） */
  modelUsage?: Array<{ purpose: string; channel: string; model: string; protocol: string; tokens?: number; inputTokens?: number; outputTokens?: number; cacheReadInputTokens?: number; ms?: number }>
  parseVersions?: Array<{ documentId: string; parseRevision: number }>
  /** Pi 审核 Agent 本次按需调用的案卷能力摘要，用于界面复查其材料读取路径。 */
  agentActivity?: string[]
  diagnostics: string[]
  startedAt: string
  completedAt?: string
  error?: string
  /** 运行发起者（08 设计：时间线可辨人工/AI）；旧运行无此字段按"未记录"呈现 */
  initiatedBy?: Actor
}

// ===== 业务决定与任务 =====

/** 业务决定：AI 建议不是决定（02 §7） */
export interface BusinessDecision {
  id: string
  actor: Actor
  scope: { kind: 'subject' | 'case'; ids: string[] }
  stageId: string
  result: 'pass' | 'partial-pass' | 'return' | 'reject' | 'withdraw'
  /** 最终分值（教师终值；与 AI 建议/规则计算分分列） */
  finalScores?: Array<{ subjectId: string; value: string; basisRunId?: string }>
  reason: string
  basedOnRunId: string
  basedOnRevision: number
  at: string
  /** 决定性质与更正关系（N1a：终审/阶段；更正=追加关联） */
  finality?: 'final' | 'stage'
  amendsDecisionId?: string
  taskId?: string
  round?: number
}

/** 补件请求（A09：原因/期限/履行/取消；回复≠满足） */
export interface SupplementRequest {
  id: string
  caseId: string
  originFindingKeys: string[]
  materialSlotId?: string
  requiredElements: string[]
  reason: string
  responsibleRole: RoleId
  deadline?: string
  status: 'open' | 'responded' | 'satisfied' | 'insufficient' | 'cancelled'
  responses: Array<{ id: string; documentVersionIds: string[]; note: string; at: string; actor: string }>
  createdAt: string
  /** 本地审核员模拟补件时，用于只接收请求创建后新增的材料版本。 */
  documentVersionIdsAtRequest?: string[]
  /** G04：退回来源（核验通过后按原阶段回流任务） */
  originTaskId?: string
  originStageId?: string
}

/** 申诉/复审（A10：关联原决定，另起任务） */
export interface Appeal {
  id: string
  caseId: string
  againstDecisionId: string
  appellant: { actorId: string; actorSource: ActorSource }
  statement: string
  newEvidenceDocumentVersionIds: string[]
  status: 'submitted' | 'in-review' | 'upheld' | 'overturned' | 'withdrawn'
  /** 明确复核结论（N1a：maintain/amend/withdrawn；旧值迁移时人工确认） */
  resolution?: 'maintain-original' | 'amend-original' | 'withdrawn'
  reviewTaskId?: string
  reviewDecisionId?: string
  createdAt: string
}

// ===== 评委 =====

/** 评委分配与回避（A14：独立评分；评分包带 reviewerId） */
export interface JudgeAssignment {
  id: string
  caseId: string
  reviewerId: string
  rubricVersion: number
  /** 回避不等于缺评（缺评另由 missingStrategy 处理） */
  recused: boolean
  recuseReason?: string
  status: 'assigned' | 'submitted' | 'missing'
}

export interface JudgeRating {
  assignmentId: string
  reviewerId: string
  caseId: string
  rubricVersion: number
  scores: Array<{ dimensionId: string; score: number | null; na: boolean; comment?: string }>
  /** 对外反馈意见与内部评语分列（02 §5.6） */
  publicFeedback: string
  internalNotes?: string
  submittedAt?: string
}

// ===== 批次与交接 =====

/** 审核批次：锁定模板/规则版本（A12） */
export interface ReviewBatch {
  id: string
  name: string
  templateId: string
  templateVersion: number
  policyVersionLock: Array<{ policyVersionId: string; version: number }>
  caseIds: string[]
  createdAt: string
}

/** 交接回执：动作幂等 + 期望外部版本（A17/C02） */
export interface SyncReceipt {
  id: string
  actionId: string
  externalSystem: string
  caseId: string
  expectedExternalRevision?: number
  payloadHash: string
  status: 'pending' | 'awaiting-receipt' | 'accepted' | 'rejected' | 'conflict'
  externalReceipt?: { receivedAt: string; externalId?: string; message?: string }
}

// ===== 应用命令契约（M1：03 §7 应用命令与查询契约） =====

/** 操作者来源（08 设计 §2.3：'agent' = 本机通用 Agent 代操作，由用户显式指派；不冒充校方授权） */
export type ActorSource = 'local' | 'mock' | 'school' | 'agent' | 'system'

/** 命令执行主体（本地/模拟/校方认证/Agent 代操作四来源；本地手填身份不得冒充校方授权） */
export interface Actor {
  actorId: string
  actorSource: ActorSource
  role: RoleId
}

/** 修改类命令统一信封：幂等键 + 主体 + 乐观并发（03 §7） */
export interface ReviewAppCommand<TPayload> {
  requestId: string
  actor: Actor
  caseId: string
  /** 调用方持有的案卷修订号；冲突返回 VERSION_CONFLICT 与当前版 */
  expectedRevision: number
  payload: TPayload
}

export type ReviewAppErrorCode = 'VERSION_CONFLICT' | 'NOT_FOUND' | 'VALIDATION_FAILED' | 'CAPABILITY_UNAVAILABLE' | 'PERMISSION_DENIED'

export interface ReviewAppCommandResult<TEntity> {
  ok: true
  newRevision: number
  entity: TEntity
}

export interface ReviewAppCommandError {
  ok: false
  code: ReviewAppErrorCode
  message: string
  /** VERSION_CONFLICT 时携带当前修订号与差异摘要 */
  currentRevision?: number
  diffSummary?: string
}

/** 乐观并发校验（03 §7：冲突返回当前版，不覆盖整份旧快照） */
export function assertExpectedRevision(
  command: { expectedRevision: number },
  currentRevision: number,
): ReviewAppCommandError | null {
  if (command.expectedRevision !== currentRevision) {
    return {
      ok: false,
      code: 'VERSION_CONFLICT',
      message: `案卷已被其他操作更新（当前 revision=${currentRevision}），请刷新后重试`,
      currentRevision,
    }
  }
  return null
}

// ===== 模型选择与能力（M1/H16） =====

/** 能力来源：实测/声明/未知——不能仅从模型名称猜（03 §8） */
export interface ModelCapability {
  channel: string
  model: string
  protocol: string
  source: 'measured' | 'declared' | 'unknown'
  text: boolean
  vision: boolean
  structuredJson: boolean
  tools: boolean
  checkedAt?: string
}

/** 显式模型选择（K16：所选渠道被删/禁用时暂停需模型阶段，不静默改用别的渠道） */
export interface ModelSelection {
  channelId: string
  model: string
}

/** 纯函数：从渠道列表解析显式选择；未知/禁用渠道抛出可呈现错误（由调用方映射 CAPABILITY_UNAVAILABLE） */
export function resolveModelSelection(
  channels: Array<{ id: string; enabled: boolean; models: string[]; protocol: string }>,
  selection: ModelSelection,
): { channel: { id: string; protocol: string }; model: string } {
  const channel = channels.find((candidate) => candidate.id === selection.channelId)
  if (!channel) throw new Error(`所选模型渠道不存在或已删除: ${selection.channelId}`)
  if (!channel.enabled) throw new Error(`所选模型渠道已禁用: ${selection.channelId}`)
  if (channel.models.length > 0 && !channel.models.includes(selection.model)) {
    throw new Error(`所选模型不在渠道可用列表中: ${selection.model}`)
  }
  return { channel: { id: channel.id, protocol: channel.protocol }, model: selection.model }
}
