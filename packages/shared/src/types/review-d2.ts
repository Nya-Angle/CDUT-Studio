/**
 * D2 作者态条件/业务对象 → 现有 Pi RuleSpec 的技术预审运行契约。
 * 仅证明执行范围与出处；不构成学校制度授权或最终审批。
 */
import type { ReviewSubject, RuleSpec } from './review-v2'

/** 固定 D4 候选的最小客户端入口，不提供模板编辑/发布权限。 */
export interface D4ClientTemplate {
  templateId: string
  version: number
  domain: string
  name: string
  workspaceGitBlobSha: string
  primary: string[]
  conditions: string[]
  selection: D2ScenarioSelection
  controlledStudentFixture: boolean
  /** 缺件/损坏时该候选的不可用原因；非空表示不可选，selection 只是空占位，不是真实选择。 */
  selectionIssue?: string
}
export interface D4ClientSelection {
  selection: D2ScenarioSelection
  /** 仅启用随包 G01-I 合成学籍快照；不接受 Renderer 提交的学籍事实。 */
  useControlledStudentFixture?: boolean
}

export type D2TargetKind = 'campus-card' | 'archive-item' | 'archive-operation' | 'student-field' | 'generic-object' | 'custom-object'

/** Explicit case-side condition selection; NOT a trusted school record or policy authorization. */
export interface D2ObjectConditionV1 {
  id: string
  applicability: 'applicable' | 'not-applicable' | 'unknown'
  sourceId: string
  sourceVersionId: string
  /** Definitive branch choices require a reviewer-confirmed selection, not LLM inference. */
  decidedBy: 'reviewer' | 'undetermined'
}

/** 同一档案件每个操作必须拥有独立 objectKey/subjectId。 */
export interface D2TargetBinding {
  objectKey: string
  subjectId: string
  title: string
  kind: D2TargetKind
  /** Namespaced bounded generic type, e.g. g03-resource-slot or g08-lost-item. */
  businessType?: string
  scenarioSource?: {sourceId:string;sourceVersionId:string;decidedBy:'reviewer'}
  /** Explicit per-object primary scenario (generic-object only). */
  scenario?: string
  /** All declared additive condition axes must appear, including unknown/false ones. */
  conditions?: D2ObjectConditionV1[]
  itemId?: string
  operation?: 'read' | 'copy' | 'excerpt' | 'borrow' | 'certified_copy'
  /** Optional stable per-request operation identity; disambiguates same-kind operations. */
  operationId?: string
  /** Synthetic G01-I student / registry identity: never derived from applicant caseFields. */
  studentId?: string
  /** A particular requested correction field; one distinct Subject per field. */
  fieldKey?: string
  intent?: string
  /** Applicant-declared status is NOT authoritative; use an independent controlled snapshot. */
  enrollmentStatus?: string
}
/** Controlled fixture boundary for technical tests. This is NOT an official school registry adapter. */
export interface D2TrustedStudentSnapshotV1 {
  schemaVersion: 1
  sourceKind: 'controlled-synthetic'
  studentId: string
  sourceId: string
  snapshotVersionId: string
  status: 'current' | 'revoked'
  enrollmentStatus: string
  /** Values keyed by field name. Must be passed through an explicit reviewer-controlled channel. */
  fields: Record<string, string>
}

/** A scoped Check is instantiated only for matching target field + request intent.
 * Enrollment condition is resolved from the separate controlled snapshot or UNKNOWN. */
export interface D2StudentScopeV1 {
  fieldKeys: string[]
  intents: string[]
  enrollmentStatuses?: string[]
}

export interface D2ScenarioSelection {
  templateId: string
  version: number
  /** 有情景的模板必须显式选择，不得把未知默认为 false。 */
  scenario?: string
  /** Multiple concurrently true synthetic branch axes; explicit, not inferred from caseFields. */
  scenarios?: string[]
  /** 仅供校园卡等「模块实例无 objectKey」的分支对象绑定。 */
  scenarioObjectKey?: string
  targets: D2TargetBinding[]
}
export interface D2RuleBinding {
  checkId: string
  ruleId: string
  objectKey?: string
  subjectId?: string
  sourceIds: string[]
  /** 记录制度候选/跨校参考尚未获本案授权；Pi 只能返回待确认。 */
  authority: 'request-scope' | 'unverified-policy'
  /** Runtime selection of a student-field responsibility, never inferred from prose. */
  applicability?: 'applicable' | 'not-applicable' | 'unknown'
  /** Exact allowed evidence labels on THIS target, not a global evidence whitelist. */
  evidenceCoverage?: { fieldKey: string; supportsFacts: string[] }
  /** Structured execution gate; never inferred from task prose. */
  gate?: D2ExecutionGateV1
}
/** Three-valued, fail-closed checks over confirmed human evidence/observations. */
export type D2GatePredicateV1 =
  | { kind: 'confirmed-observation'; fieldKey: string; equals: string }
  | { kind: 'evidence-any'; supportsFacts: string[] }
  | { kind: 'case-stage'; stages: import('./review-v2').CaseStage[] }
  | { kind: 'trusted-registry-field'; fieldKey: string; equals: string }
export type D2GateExpressionV1 =
  | D2GatePredicateV1
  | { kind: 'all'; conditions: D2GateExpressionV1[] }
  | { kind: 'any'; conditions: D2GateExpressionV1[] }
  | { kind: 'not'; condition: D2GateExpressionV1 }
/** Applicant material cannot be labelled missing before a verified trigger and due stage. */
export interface D2ExecutionGateV1 {
  when?: D2GateExpressionV1
  material?: {
    provider: 'applicant' | 'authority'
    dueStages: import('./review-v2').CaseStage[]
    /** Alternative accepted fact labels, linked by a reviewer to THIS check's target. */
    alternatives: string[]
  }
}
export interface D2RuntimePlan {
  schemaVersion: 1 | 2 | 3
  /** Optional independent, controlled synthetic fixture, hashed into the fixed technical plan. */
  trustedStudentSnapshot?: D2TrustedStudentSnapshotV1
  mode: 'technical-pre-review'
  publicationAllowed: false
  workspaceId: string
  revision: number
  templateId: string
  templateVersion: number
  scenario?: string
  scenarios?: string[]
  authoringDigest: string
  previewFingerprint: string
  targets: D2TargetBinding[]
  subjects: ReviewSubject[]
  rules: RuleSpec[]
  mapping: D2RuleBinding[]
  /** 覆盖作者态、选择的情景、对象边界、RuleSpec 内容及来源绑定。 */
  fingerprint: string
}
