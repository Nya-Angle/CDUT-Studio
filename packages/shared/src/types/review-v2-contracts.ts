/**
 * V2 应用契约补全（N1a，docs/design/review-agent/07 §2 拟实现合同）
 *
 * 本文件是 07 §2.1 契约表的落点：新概念独立成接口；对既有类型只做可选字段扩展
 * （旧 JSON 兼容读取，缺失的新能力标为未知/待配置，不得补默认"已确认"）。
 * 命令外壳扩展与错误码见文末；新设计哈希用 SHA-256，旧 SHA-1 记录带 algorithm 标识。
 */

import type { Actor, Appeal, BusinessDecision, EvidenceLink, FieldSpec, Observation, ReviewAppErrorCode, ReviewCaseV2, RoleId, SourceLocation, SupplementRequest, SubjectAdjudication } from './review-v2'

// ===== 政策仓库（07 §2.1 PolicyRef/PolicyVersion；05 §2.1 误判 8：模板必须有对应政策） =====

/** 政策来源：文件原件或负责人声明（后者记录录入人，不伪装校规原文） */
export type PolicyOrigin =
  | { kind: 'document'; documentVersionId: string }
  | { kind: 'owner-statement'; text: string; enteredBy: string; enteredAt: string }

/** 政策版本：不可变；引用必须精确到 ID+版本+内容 hash */
export interface PolicyRecord {
  policyId: string
  version: number
  title: string
  /** 规范化内容 SHA-256（模板引用校验一致性） */
  contentHash: string
  content: string
  origin: PolicyOrigin
  status: 'draft' | 'published' | 'deprecated'
  publishedAt?: string
  /** 确认记录：谁在何时确认了本版政策 */
  confirmations: Array<{ actorId: string; role: RoleId; at: string; note?: string }>
  /** G02/G12：结构化规则（负责人录入或文档条款编译），coverage/检查计划的分母来源 */
  compiledRules?: import('./review-v2').RuleSpec[]
}

/** 模板对政策的精确引用（替代仅 policyId + 硬编码 version=1） */
export interface PolicyRef {
  policyId: string
  version: number
  contentHash: string
}

// ===== 字段与数值（07 §2.1 FieldSpec/FieldValue） =====

/** 字段作用域：案卷级或事项级（防止学年/分值成为通用强制字段） */
export type FieldScope = 'case' | 'subject'

/** 字段规格补充（全部可选，向后兼容既有模板 JSON） */
export interface FieldSpecV2 {
  scope?: FieldScope
  /** 枚举可选项（kind='enum' 时应提供） */
  options?: Array<{ value: string; label: string }>
  /** 默认值与显示提示 */
  defaultValue?: unknown
  displayHint?: string
  readOnly?: boolean
  /** 校验规则（发布时校验类型正确） */
  validation?: Array<{ kind: 'min' | 'max' | 'pattern' | 'required-when'; value?: string; when?: unknown }>
}

/** 规范十进制数值：金额/评分以文本+单位存储（禁止二进制浮点充当精确计算） */
export interface DecimalValue {
  /** 规范十进制文本（如 "10.00"），不允许 NaN/Infinity/科学计数法 */
  value: string
  unit?: string
}

export type FieldValueV2 =
  | { kind: 'decimal'; value: string; unit?: string }
  | { kind: 'unknown' }

// ===== 规则计算（07 §2.1/§5.1：有限算子，不执行用户 JS） =====

/** 有限计算表达（deterministic 规则唯一合法形态；未实现算子不得发布为 deterministic） */
export type CalculationSpec =
  | { op: 'sum' | 'max'; from: string; groupBy?: string[]; cap?: { value: string; unit?: string }; allocation?: 'score-desc-then-key' }
  | { op: 'single'; from: string }
  | { op: 'dedupe-select-highest'; from: string; dedupeBy: string[]; aggregate: 'sum' | 'max'; cap?: { value: string; unit?: string }; allocation?: 'score-desc-then-key' }
  | { op: 'weighted-sum'; items: Array<{ from: string; weight: number }>; precision: number }
  | { op: 'scale-convert'; from: string; fromMax: number; toMax: number; precision: number }

/** 规则要求约束 AST（applicability when 之外"检查什么"的部分） */
export type RequirementSpec =
  | { kind: 'condition'; ast: unknown }
  | { kind: 'calculation'; calc: CalculationSpec }
  | { kind: 'semantic'; standard: string; outputEnum?: string[] }
  | { kind: 'manual'; instruction: string }

// ===== 文档版本与来源（07 §2.1 DocumentVersion/SourceRef） =====

/** 文档版本补充：原件字节身份与版本链 */
export interface DocumentVersionV2 {
  /** 原件字节 SHA-256（与解析内容 hash 区分；迁移找不到原件标 unavailable） */
  byteHash?: string
  byteHashUnavailableReason?: string
  /** 逻辑材料被替换：旧版不再参与新审核，但历史保留 */
  supersedesVersionId?: string
  active?: boolean
  /** 主进程受控相对键（review-cases/{caseId}/source-docs/{versionId}/），renderer 不凭任意路径访问 */
  assetKey?: string
  parseEngine?: string
  parseEngineVersion?: string
  ocrEngine?: string
  ocrEngineVersion?: string
  /** 分页/表格索引已建立（未建立=页级/文件级精度上限） */
  pageIndexed?: boolean
  tableIndexed?: boolean
}

/** 来源位置补充：页级降级与 OCR 矩形（07 §6.3 坐标规范） */
export type SourceLocationV2 =
  | { kind: 'pdf-page'; page: number }
  | { kind: 'ocr-rect'; page: number; rect: { x: number; y: number; w: number; h: number }; coordinateSystem: 'unrotated-page' }
  | { kind: 'slide'; index: number }
  | { kind: 'image-rect'; rect: { x: number; y: number; w: number; h: number } }

/** SourceRef 精度（引用核验分层，07 §5.4） */
export type SourcePrecision = 'block' | 'page' | 'paragraph' | 'sheet-cell' | 'file'

// ===== 任务与计划（07 §2.1 WorkflowTask/CheckPlanEntry） =====

/** 阶段任务："谁下一步做什么"（case.stage 只是业务状态机，不是任务队列） */
export interface WorkflowTask {
  id: string
  caseId: string
  stageId: string
  /** 业务轮次（退回/补件/申诉创建新轮次，不删除历史） */
  round: number
  assigneeRole: RoleId
  assigneeActorId?: string
  status: 'open' | 'in-progress' | 'submitted' | 'completed' | 'cancelled'
  prerequisiteTaskId?: string
  /** 任务创建时的业务输入版本（决定依据） */
  inputRevision: number
  dueAt?: string
  createdAt: string
  completedAt?: string
}

/** 检查计划条目：覆盖分母的唯一来源（不从 AI 问题反推，07 §5.3） */
export interface CheckPlanEntry {
  /** 稳定键：规则版本+目标（同一计划内稳定，跨政策版本区分） */
  checkKey: string
  ruleId: string
  ruleVersion: number
  target: { scope: 'subject' | 'group' | 'case'; subjectIds: string[]; groupKey?: string }
  /** 适用性三值：false 生成带依据的不适用结果（不算缺执行） */
  applicability: 'true' | 'false' | 'unknown'
  applicabilityReason?: string
  requiredInputs: string[]
  execution: 'deterministic' | 'semantic' | 'manual'
}

// ===== 运行输入快照（07 §2.1/§3.4：R04 该过期的才过期） =====

/** 运行输入快照：所有语义输入的规范化快照（聊天/备注不入） */
export interface RunInputSnapshot {
  /** 规范化快照 SHA-256（固定键序、集合按稳定 ID 排序） */
  hash: string
  hashAlgorithm: 'sha-256' | 'sha-1-legacy'
  templateRef: { templateId: string; version: number }
  policyRefs: PolicyRef[]
  caseFields: Record<string, unknown>
  subjects: Array<{ id: string; fields: Record<string, unknown>; status: string; correction: string }>
  documents: Array<{ versionId: string; byteHash?: string; contentHash: string; parseRevision: number; active: boolean }>
  observations: Array<{ id: string; fieldKey: string; value: unknown; confirmed: boolean }>
  evidenceLinks: Array<{ id: string; status: string }>
  /** 冻结的检查计划（plan 与产物引用） */
  plan: CheckPlanEntry[]
  executionProfile?: {
    channelId?: string
    model?: string
    protocol?: string
    parseEngineVersion?: string
    ocrEngineVersion?: string
    toolSchemaVersion?: string
  }
}

// ===== 业务对象补充（07 §2.1 Decision/Rubric/Appeal/助手/集成） =====

/** 决定性质：终审决定 vs 阶段决定（报告取最终投影，不取时间最后一条） */
export type DecisionFinality = 'final' | 'stage'

/** 更正关系 */
export interface DecisionAmendment {
  amendsDecisionId?: string
  finality?: DecisionFinality
  taskId?: string
  round?: number
}

/** 申诉复核结论（06 §5.4：明确业务语义，替代歧义英文 upheld/overturned） */
export type AppealResolution = 'maintain-original' | 'amend-original' | 'withdrawn'

/** 评分配置补充（07 §7.2：A14 完整语义） */
export interface RubricV2 {
  minEffectiveJudges?: number
  /** N/A 策略：排除后是否重新归一 */
  naStrategy?: 'exclude' | 'exclude-renormalize'
  /** 原始量尺 → 展示量尺转换（D11：1-5 加权 4.10 → 映射 5 → 82.00） */
  scaleConversion?: { fromMax: number; toMax: number }
  divergenceThreshold?: number
  tieBreaker?: 'shared-rank' | 'by-dimension' | 'owner-decides'
  quota?: number
  /** 定稿快照引用（变更只能重开新轮次） */
  finalizedSnapshotHash?: string
}

/** 助手线程（07 §2.1：持久历史 + 可点引用） */
export interface AssistantThread {
  id: string
  caseId: string
  runId?: string
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; refs?: Array<{ sourceRefHash: string; label: string }>; at: string }>
}

/** 修改草案：候选 patch（用户审阅后逐项命令应用，不直接改业务） */
export interface DraftPatch {
  id: string
  caseId: string
  target: { kind: 'field' | 'observation' | 'link' | 'rule-draft'; id: string }
  oldValue: unknown
  newValue: unknown
  reason: string
  sourceRefs: Array<{ sourceRefHash: string }>
  baseInputHash: string
  status: 'proposed' | 'applied' | 'rejected' | 'stale'
}

/** 集成能力档案（07 §7.3：workflowOwner 本地/校方） */
export interface IntegrationProfile {
  system: string
  capabilities: Array<'identity' | 'read-tasks' | 'verify-material' | 'push-decision' | 'receipt-query'>
  workflowOwner: 'local' | 'school'
  identitySource: 'local' | 'mock' | 'school'
}

// ===== 命令外壳扩展（07 §3.1） =====

export type ReviewCommandTargetKind = 'case' | 'template-draft' | 'policy-draft' | 'batch'

/** 扩展命令外壳：目标资源化（caseId 强制版保留兼容，新命令用 target） */
export interface ReviewCommandV2<TPayload> {
  requestId: string
  target: { kind: ReviewCommandTargetKind; id: string }
  expectedRevision: number
  actor: Actor
  type: string
  payload: TPayload
}

/** 新增错误码（07 §3.1：不能只抛一个无法区分的字符串） */
export type ReviewAppErrorCodeV2 = ReviewAppErrorCode | 'REQUEST_ID_COLLISION' | 'STALE_INPUT' | 'INVALID_TRANSITION' | 'DEPENDENCY_UNRESOLVED'

// ===== 稳定键纯函数（07 §5.3：checkKey/findingKey） =====

/** 规范化字符串（固定键序由调用方保证：此处只做拼接） */
export function makeCheckKey(ruleId: string, ruleVersion: number, target: { scope: string; groupKey?: string; subjectIds?: string[] }): string {
  const targetPart = target.scope === 'group' && target.groupKey ? `group:${target.groupKey}` : target.scope === 'subject' ? `subjects:${[...(target.subjectIds ?? [])].sort().join(',')}` : 'case'
  return `${ruleId}@${ruleVersion}|${targetPart}`
}

/** findingKey：checkKey+问题类别+事实定位（跨运行可继承人工意见的唯一前提） */
export function makeFindingKey(checkKey: string, category: string, sourceRefHash: string): string {
  return `${checkKey}|${category}|${sourceRefHash}`
}

/** 规范十进制文本校验（07 §5.1：禁止 NaN/Infinity/科学计数法） */
export function isValidDecimalText(text: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(text) && text.length > 0
}

/** 字段作用域默认值（未声明时按事项级兼容旧模板） */
export function fieldScopeOf(spec: Pick<FieldSpec, 'key'> & Partial<FieldSpecV2>): FieldScope {
  return spec.scope ?? 'subject'
}

export type { SourceLocation, ReviewAppErrorCode }

// ===== 案卷聚合与命令结果（N1c/N1d：主进程与渲染层共用形态） =====

export interface CommandReceipt {
  requestId: string
  type: string
  payloadHash: string
  revision: number
  at: string
  summary: string
  /** 操作者（08 设计：时间线可辨人工/AI；旧记录缺省按"未记录"呈现） */
  actor?: Actor
  /** 命令的可信指派来源（C1：ReviewAgentAssignment.id；人工操作缺省） */
  assignmentId?: string
  /** 发起会话（Agent 操作可追溯完整身份；短码仅显示用） */
  sessionId?: string
}

/** 单案业务聚合（state.v2.json 形态；07 §3.3） */
export interface RatingEntryV2 {
  id: string
  caseId: string
  stageId: string
  actor: string
  scores: Record<string, number | 'N/A'>
  at: string
  round: number
}

/** C1 source-current-validity audit entry. Original values/refs/receipts remain durable. */
export interface SourceValidityRevocation {
  documentVersionId: string
  reason: 'archive' | 'replace'
  at: string
  observationIds: string[]
  previouslyConfirmedObservationIds: string[]
  evidenceLinkIds: string[]
  previouslyConfirmedEvidenceLinkIds: string[]
}

/** C-owned reversible Case archive, separate from destroying historical data. */
export interface CaseArchiveRecordV3 {
  previousStage: import('./review-v2').CaseStage
  archivedAt: string
  archivedBy: string
  reason: string
  /** Restoring never silently reactivates old Run/Decision status. */
  restoredAt?: string
  restoredBy?: string
  restoreReason?: string
}

export interface CaseAggregateV2 {
  caseV2: ReviewCaseV2
  /** Latest reversible archive checkpoint. Every transition retains a Receipt. */
  caseArchive?: CaseArchiveRecordV3
  /** Prior fully restored archive cycles; never replace historical provenance. */
  caseArchiveHistory?: CaseArchiveRecordV3[]
  observations: Observation[]
  /** Current-applicability revocation ledger; absent in legacy aggregates. */
  sourceValidityRevocations?: SourceValidityRevocation[]
  evidenceLinks: EvidenceLink[]
  dispositions: Array<{
    findingKey: string
    disposition: string
    actor: string
    reason: string
    at: string
    /** 阶段 3：处置绑定到不可变运行输入；不同输入下旧处置自然变为历史记录。 */
    runId?: string
    inputHash?: string
    actorSource?: import('./review-v2').ActorSource
    role?: import('./review-v2').RoleId
  }>
  tasks: WorkflowTask[]
  decisions: BusinessDecision[]
  supplements: SupplementRequest[]
  appeals: Appeal[]
  receiptLog: CommandReceipt[]
  /**
   * C2's Main-only technical proposal journal. These records are NOT
   * ReviewRunV2, formal CheckResult, ReadReceipt, or BusinessDecision.
   * Authoritative execution remains gated on physical Host/source admission.
   */
  v3TechnicalExecution?: {
    run: import('./review-v3-c0').RunEvidenceIdentity
    /** Frozen non-journal aggregate input; business mutation invalidates it. */
    frozenInputDigest: string
    admittedAtRevision: number
    events: Array<{
      sequence: number
      eventId: string
      proposal: import('./review-v3-execution').V3ExecutionProposal
      committedAt: string
    }>
    terminalStatus?: import('./review-v3-execution').V3TechnicalTerminal
  }
  /**
   * C-owned irreversible Run-wide PHYSICAL Host admission fences.
   * Stored in this same Case CAS transaction+Receipt, never in A SDK journal.
   * Every historical runId remains prohibited across PID/attempt/generation.
   */
  v3HostRunFences?: Array<{
    schemaVersion: 'review-v3-host-run-fence/1'
    run: import('./review-v3-c0').RunEvidenceIdentity
    requestId: string
    operatorPrincipalId: string
    reason: string
    fencedAt: string
  }>
  /** C2 Main-only, sealed immutable Run evidence (not ReviewRunV2 shadow). */
  v3ReviewRun?: import('./review-v3-run').ReviewRunRecordV3
  /** 事项最终认定（可选，兼容既有 state.v2.json）。 */
  adjudications?: SubjectAdjudication[]
  /** Bound immutable Dev-B CanonicalPlan; upgrades preserve earlier plans. */
  canonicalPlan?: import('./review-v3-c0').CanonicalPlan
  canonicalPlanHistory?: import('./review-v3-c0').CanonicalPlan[]
  /** D2 技术预审任务固定快照；不授予正式学校发布/审批权限。 */
  d2RuntimePlan?: import('./review-d2').D2RuntimePlan
  /** 独立评分（G06：唯一票，事务内查重） */
  ratings?: RatingEntryV2[]
}

/** 普通审核工作台到业务聚合的内部映射；当前迁移期统一使用同一 caseId。 */
export interface ReviewWorkspaceCaseRef {
  workspaceCaseId: string
  aggregateV2Id: string
}

export type CommandErrorCode =
  | 'VERSION_CONFLICT' | 'NOT_FOUND' | 'VALIDATION_FAILED' | 'REQUEST_ID_COLLISION' | 'INVALID_TRANSITION' | 'DEPENDENCY_UNRESOLVED' | 'STALE_INPUT'
  | 'AGENT_DECISION_DISABLED'

export type ReviewCommandResult<TEntity = unknown> =
  | { ok: true; receipt: CommandReceipt; aggregate: CaseAggregateV2; entity?: TEntity }
  | { ok: false; code: CommandErrorCode; message: string; currentRevision?: number }

export type BatchAutomationMode = 'assist' | 'auto-return' | 'auto-approve'

/** Per-batch explicit local authorization. Not a school-side approval credential. */
export interface BatchAutomationPolicy {
  mode: BatchAutomationMode
  grantedBy: string
  grantedAt: string
  /** Incremented whenever an authorized user changes policy, including revocation. */
  revision: number
  templateId: string
  templateVersion: number
}

/** Outcome of a real V2 transaction, never a raw AI opinion. */
export interface BatchAutomationReceipt {
  caseId: string
  runId: string
  action: 'pass' | 'return'
  status: 'applied' | 'blocked' | 'failed' | 'conflict'
  message: string
  at: string
  requestId: string
  policyRevision: number
}

export interface BatchAutomationReport {
  batchId: string
  policyRevision: number
  results: BatchAutomationReceipt[]
  applied: number
  blocked: number
  failed: number
  conflicts: number
}

/** 批次运行状态（N5：batch-store 持久化形态，renderer 可读） */
export interface BatchStateV2 {
  batch: import('./review-v2').ReviewBatch
  status: 'draft' | 'queued' | 'running' | 'finalized' | 'reopened'
  cases: Array<{ caseId: string; status: 'queued' | 'running' | 'done' | 'failed' | 'paused'; error?: string }>
  finalizedSnapshotHash?: string
  finalizedAt?: string
  round: number
  reopenedFromBatchId?: string
  automation?: BatchAutomationPolicy
  automationReceipts?: BatchAutomationReceipt[]
}
