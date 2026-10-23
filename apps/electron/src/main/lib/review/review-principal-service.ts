/**
 * 审核业务统一 Principal（AUTH-01 / AUTH-18）
 *
 * 设计边界（不可越线）：
 * - 本模块只在 Main 内运行；Renderer 传来的 actor/role 永远不是凭证。
 * - 本机目前没有校方身份签发通道，因此所有本地 Principal 一律显式标注
 *   `SIMULATED_NOT_SCHOOL_AUTHORIZED`，不得对外表述为学校审批记录。
 * - 真实学校身份只能来自经过验证的 SchoolPort（assurance='verified-school'）；
 *   缺失时如实返回 `BLOCKED_EXTERNAL`，而不是伪造。
 * - 这里不新增第二套业务账本：Principal 是内存/瞬时合同，业务事实仍写 CaseAggregate。
 */
import type { Principal } from '@profer/shared'

/** 主体来源标签（审计与报告必须区分，不得把模拟角色写成“人”） */
export type PrincipalAssuranceLabel =
  | 'LOCAL_SIMULATION'
  | 'LOCAL_OPERATOR'
  | 'VERIFIED_SCHOOL_PERSON'
  | 'AGENT'
  | 'SYSTEM'

/** 本机试办的固定标识：出现在审计、报告与导出中 */
export const SIMULATED_NOT_SCHOOL_AUTHORIZED = 'SIMULATED_NOT_SCHOOL_AUTHORIZED' as const

/** 外部校方授权状态：本地实现永远不能把它提升为 SCHOOL_GRANTED */
export type ExternalAuthorizationState = 'NONE_LOCAL_ONLY' | 'BLOCKED_EXTERNAL' | 'SCHOOL_GRANTED'

/** Main 签发的业务主体：Principal 的扩展视图（附加来源与外部授权事实） */
export interface ReviewPrincipal extends Principal {
  assuranceLabel: PrincipalAssuranceLabel
  /** 是否由校方（而非本机）签发；本地恒为 false */
  schoolAuthorized: boolean
  externalAuthorization: ExternalAuthorizationState
  issuedAt: string
  /** 授权到期时间（ISO）；缺失表示随会话/进程结束 */
  expiresAt?: string
}

export type PrincipalErrorCode =
  | 'ROLE_ESCALATION'
  | 'SCOPE_FORBIDDEN'
  | 'PRINCIPAL_EXPIRED'
  | 'SCHOOL_AUTH_MISSING'

export class PrincipalError extends Error {
  readonly code: PrincipalErrorCode
  constructor(code: PrincipalErrorCode, message: string) {
    super(message)
    this.name = 'PrincipalError'
    this.code = code
  }
}

/** 本地角色 → 审计标签。reviewer 是本机操作者，teacher/judge/student 是模拟角色。 */
export function assuranceLabelFor(role: Principal['role'], source: Principal['source']): PrincipalAssuranceLabel {
  if (source === 'school') return 'VERIFIED_SCHOOL_PERSON'
  if (role === 'system') return 'SYSTEM'
  if (role === 'reviewer') return 'LOCAL_OPERATOR'
  return 'LOCAL_SIMULATION'
}

/** 允许本机自称为业务角色；教师/评委/校方管理员不在其中（必须外部授权） */
const LOCALLY_ISSUABLE_ROLES: ReadonlySet<Principal['role']> = new Set(['reviewer', 'student', 'system'])

export interface IssueLocalPrincipalInput {
  role: Principal['role']
  caseIds: string[]
  actions: string[]
  sessionId: string
  principalId?: string
  institutionId?: string
  ttlMs?: number
}

/**
 * 由 Main 签发本地 Principal。
 * - 教师/评委/校方管理员直接拒绝（ROLE_ESCALATION），避免 Renderer 任意 claim 升级。
 * - 签发结果显式携带 SIMULATED_NOT_SCHOOL_AUTHORIZED 与 BLOCKED_EXTERNAL。
 */
export function issueLocalPrincipal(input: IssueLocalPrincipalInput): ReviewPrincipal {
  if (!LOCALLY_ISSUABLE_ROLES.has(input.role)) {
    throw new PrincipalError(
      'ROLE_ESCALATION',
      `本机不能签发 ${input.role} 主体：教师/评委/校方权限必须由学校授权端口签发（当前 BLOCKED_EXTERNAL）`,
    )
  }
  if (!input.sessionId) throw new PrincipalError('SCOPE_FORBIDDEN', 'Principal 必须绑定 Main 会话')
  if (!Array.isArray(input.caseIds) || input.caseIds.length === 0) {
    throw new PrincipalError('SCOPE_FORBIDDEN', 'Principal 必须绑定至少一个案卷范围')
  }
  if (!Array.isArray(input.actions) || input.actions.length === 0) {
    throw new PrincipalError('SCOPE_FORBIDDEN', 'Principal 必须绑定动作范围')
  }
  const issuedAt = new Date().toISOString()
  return {
    principalId: input.principalId ?? `local-${input.role}`,
    source: 'local',
    role: input.role,
    sessionId: input.sessionId,
    assurance: 'local-device',
    scope: {
      caseIds: [...new Set(input.caseIds)],
      actions: [...new Set(input.actions)],
      ...(input.institutionId ? { institutionId: input.institutionId } : {}),
    },
    assuranceLabel: assuranceLabelFor(input.role, 'local'),
    schoolAuthorized: false,
    externalAuthorization: 'BLOCKED_EXTERNAL',
    issuedAt,
    ...(input.ttlMs && input.ttlMs > 0 ? { expiresAt: new Date(Date.now() + input.ttlMs).toISOString() } : {}),
  }
}

/**
 * 业务写事务提交前重核（不只依赖 UI 取能力时的检查）。
 * 任何一次写入都必须过这里，且过期即拒绝。
 */
export function assertPrincipalAllows(
  principal: ReviewPrincipal | undefined,
  requirement: { caseId?: string; action?: string; now?: number },
): void {
  if (!principal) throw new PrincipalError('SCOPE_FORBIDDEN', '缺少 Main 签发的主体，拒绝业务写入')
  if (principal.source !== 'local' && principal.assurance !== 'verified-school') {
    throw new PrincipalError('SCHOOL_AUTH_MISSING', '校方主体缺少可验证 assurance，拒绝写入')
  }
  const now = requirement.now ?? Date.now()
  if (principal.expiresAt && Date.parse(principal.expiresAt) <= now) {
    throw new PrincipalError('PRINCIPAL_EXPIRED', `主体授权已过期（${principal.expiresAt}），请重新签发`)
  }
  if (requirement.caseId && !principal.scope.caseIds.includes(requirement.caseId)) {
    throw new PrincipalError('SCOPE_FORBIDDEN', `主体未授权案卷 ${requirement.caseId}`)
  }
  if (requirement.action && !principal.scope.actions.includes(requirement.action)) {
    throw new PrincipalError('SCOPE_FORBIDDEN', `主体未授权动作 ${requirement.action}`)
  }
}

/**
 * 拒绝 Renderer 任意 claim 升级为 teacher/judge/audience 等业务角色。
 * 返回值只用于“是否本地允许”，调用方必须用 Main 签发结果覆盖，而不是信任入参。
 */
export function assertNoRendererRoleEscalation(claim: unknown): Principal['role'] {
  const role = (claim as { role?: unknown } | undefined)?.role
  if (role === undefined || role === null) return 'reviewer'
  if (typeof role !== 'string' || !LOCALLY_ISSUABLE_ROLES.has(role as Principal['role'])) {
    throw new PrincipalError(
      'ROLE_ESCALATION',
      `拒绝 Renderer 声明的角色 ${String(role)}：教师/评委/校方身份必须外部授权（BLOCKED_EXTERNAL）`,
    )
  }
  return role as Principal['role']
}

export interface AuditPrincipalLine {
  label: PrincipalAssuranceLabel
  /** 报告/日志可直接展示的中文说明 */
  display: string
  /** 是否为已认证的真实自然人（本地模拟恒为 false） */
  realPerson: boolean
  /** 学校授权状态（本地恒为 BLOCKED_EXTERNAL / NONE_LOCAL_ONLY） */
  externalAuthorization: ExternalAuthorizationState
  simulationMarker: typeof SIMULATED_NOT_SCHOOL_AUTHORIZED | null
}

/**
 * 审计/报告投影：AUTH-18 要求把 LOCAL_SIMULATION 与真实人员区分开，
 * 不能把本地角色标签直接写成“教师已审核”。
 */
export function describePrincipalForAudit(principal: ReviewPrincipal): AuditPrincipalLine {
  const label = principal.assuranceLabel
  const display = label === 'VERIFIED_SCHOOL_PERSON'
    ? `${principal.principalId}（校方已认证${principal.role}）`
    : label === 'LOCAL_OPERATOR'
      ? `${principal.principalId}（本机操作者，非校方认证）`
      : label === 'LOCAL_SIMULATION'
        ? `${principal.principalId}（本机模拟${principal.role}，非校方人员）`
        : `${principal.principalId}（${label}）`
  return {
    label,
    display,
    realPerson: label === 'VERIFIED_SCHOOL_PERSON',
    externalAuthorization: principal.externalAuthorization,
    simulationMarker: label === 'VERIFIED_SCHOOL_PERSON' ? null : SIMULATED_NOT_SCHOOL_AUTHORIZED,
  }
}
