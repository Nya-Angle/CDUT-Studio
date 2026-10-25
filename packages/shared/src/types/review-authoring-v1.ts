/**
 * D1 审核作者态最小持久化契约（v1）：组织 Pi 审核责任，不规定工具执行步骤。
 * 与运行时 TemplateVersion / RuleSpec 分离；D1 的候选快照不具备正式发布权限。
 */
export type ReviewAuthoringSourceKindV1 =
  | 'synthetic'
  | 'user-request'
  | 'cross-school-reference'
  | 'policy-candidate'

/** 来源与制度效力必须分开；verifiedContent 不代表本案适用或有行政授权。 */
export interface ReviewAuthoringSourceV1 {
  sourceId: string
  kind: ReviewAuthoringSourceKindV1
  label: string
  reference?: {
    documentVersionId: string
    /** 可是 Markdown 标题/行号或原件条款定位；不是已核验的材料 SourceRef。 */
    locator: string
    excerpt?: string
  }
  verification: 'unverified' | 'content-checked'
  applicability: 'unknown' | 'reference-only' | 'request-scope'
  note: string
}

export interface ReviewAuthoringResponsibilityV1 {
  id: string
  title: string
  requirement: string
  completion: string
  limits?: string
}

export interface ReviewAuthoringParameterV1 {
  key: string
  description: string
  defaultValue?: string
}

/** 当前嵌套与参数能力来自 D0.5 已验证的执行无关组合模型。 */
export interface ReviewAuthoringUseV1 {
  id: string
  moduleId: string
  version: number
  scenario?: string
  objectKey?: string
  bindings?: Record<string, string>
}

export interface ReviewAuthoringModuleV1 {
  moduleId: string
  version: number
  name: string
  purpose: string
  scope: string
  limits: string
  source: { kind: 'synthetic' | 'user-request' | 'cross-school-reference'; note: string }
  tasks: ReviewAuthoringResponsibilityV1[]
  parameters?: ReviewAuthoringParameterV1[]
  references?: ReviewAuthoringUseV1[]
}

/** 每一业务模板仍定义一次独立审核目的，可选场景但不是每套模板的必填属性。 */
export interface ReviewAuthoringTemplateV1 {
  templateId: string
  version: number
  name: string
  purpose: string
  limits: string
  /** 搜索与路由元数据；仅用于候选检索，不构成审核规则。 */
  keywords?: string[]
  aliases?: string[]
  source: ReviewAuthoringModuleV1['source']
  scenarios?: string[]
  /** COMMON-02: primary choices are mutually exclusive per object; conditions are additive axes.
   * Every id must also be present in scenarios so the existing D3 preview can expand it. */
  genericScenarioAxes?: { primary: string[]; conditions: string[] }
  modules: ReviewAuthoringUseV1[]
  localTasks: ReviewAuthoringResponsibilityV1[]
}

/** 作用在实例路径，而非模块定义：同一模块在不同审核任务中可有不同合法依据。 */
export interface ReviewAuthoringSourceBindingV1 {
  checkId: string
  sourceIds: string[]
  /** 留给作者校验的适用性/例外说明，不等于执行型 ConditionAST。 */
  applicabilityNote?: string
  /** Optional executable fail-closed gate attached to this EXACT instance Check. */
  gate?: import('./review-d2').D2ExecutionGateV1
  /** Explicit per-requested-field Check selection; unused on legacy templates. */
  studentScope?: import('./review-d2').D2StudentScopeV1
  /** COMMON-01: one authored Check is instantiated for each matching generic business object. */
  genericScope?: { businessTypes: string[]; evidenceFacts: string[] }
  /** A deliberate exception to field scoping for a genuine case-level student rule. */
  caseScopeJustification?: string
}

/**
 * 可选的高级业务关系只能在拥有真实执行映射后生效。
 * D1 不强迫简单文本责任填 Claim/Evidence；如声明该块而运行编译器不能映射，必须阻断。
 */
export interface ReviewAuthoringAdvancedV1 {
  objectRoleKeys?: string[]
  claimKeys?: string[]
  evidenceRelations?: Array<{ claimKey: string; requiredSourceIds: string[] }>
}

export interface ReviewAuthoringWorkspaceV1 {
  schemaVersion: 1
  workspaceId: string
  /** 草稿修订号，不是已发布 TemplateVersion.version，更不能当作历史回滚。 */
  revision: number
  definitions: {
    modules: ReviewAuthoringModuleV1[]
    templates: ReviewAuthoringTemplateV1[]
  }
  sources: ReviewAuthoringSourceV1[]
  sourceBindings: ReviewAuthoringSourceBindingV1[]
  /**
   * D3 的不可变共享资产锁，只记录真正 reuse/import 的共享版本。
   * 未列出的 modules 是 workspace-local 草稿；不能用当前环境目录猜测身份。
   */
  sharedModuleLocks?: import('./review-d3').ReviewD3ModuleLock[]
  advanced?: ReviewAuthoringAdvancedV1
}

/** 解析快照中的真实规则映射。它是作者态 manifest，不替代 ReviewRun.inputManifest。 */
export interface ReviewAuthoringRuleMapV1 {
  checkId: string
  criterionId: string
  ruleId: string
  ruleDigest: string
  sourceIds: string[]
  sourceKinds: ReviewAuthoringSourceKindV1[]
}

export interface ReviewAuthoringManifestV1 {
  schemaVersion: 1
  workspaceId: string
  revision: number
  templateId: string
  templateVersion: number
  /** 作者态定义、来源与实例绑定的不可变内容摘要。 */
  authoringDigest: string
  previewFingerprint: string
  templateDigest: string
  effectiveRuleDigest: string
  mapping: ReviewAuthoringRuleMapV1[]
  status: 'review-candidate'
  /** 不得把本 manifest 或合成/参考来源当成行政发布凭证。 */
  publicationAllowed: false
}
