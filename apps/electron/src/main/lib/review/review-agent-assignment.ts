/**
 * 审核操作可信指派（08 设计 §2.2：显式指派是 Agent 写权限的唯一来源）
 *
 * - 指派由 UI 按钮（或 IPC）创建：绑定 sessionId/turnId/案卷或模板/动作范围/工作角色
 * - Agent 工具每次调用携带 assignmentId；服务端校验存在、未撤销、范围匹配、案卷绑定
 * - 建案型指派在建案成功后绑定 caseId（一次指派只服务一个案卷）
 * - 撤销后新写入被拒；已完成动作保留时间线
 * - 轮次校验：仅用户发起轮（triggeredBy='user'）可创建指派；automation/goal/delegation 不获写权限
 * - 落盘：review-agent-assignments.json（轻量 JSON，无数据库）
 */
import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { writeJsonFileAtomic } from '../safe-file'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'
import { getRunV2, isInterruptedRunV2 } from './run-store-v2'

/** 指派允许的动作范围（C1：操作类全量；C2 增加决定类动作受代批开关二次约束） */
export type ReviewAssignmentAction =
  | 'list' | 'create-case' | 'register-material' | 'submit-case' | 'start-run' | 'get-run-status' | 'cancel-run' | 'export-report'
  | 'submit-result' | 'decide-stage' | 'resolve-supplement' | 'respond-supplement'

/** 可信指派（落盘形态） */
export interface ReviewAgentAssignment {
  id: string
  /** 发起会话完整 ID（显示短码由 UI 派生；校验用完整值） */
  sessionId: string
  /** 用户发起指派的轮次消息 ID（归属到轮，审计可溯） */
  turnId: string
  /** 指派的目标案卷（建案型指派初始缺省，建案成功后绑定） */
  caseId?: string
  /** 建案型指派允许的模板（模板+版本锁定；防止拿指派开任意模板的案） */
  templateId?: string
  templateVersion?: number
  /** 允许的动作范围（工具调用动作必须在此范围内） */
  actions: ReviewAssignmentAction[]
  /** 当前 Pi 会话直接审核的运行；由宿主创建与绑定，模型不能指定。 */
  activeRunId?: string
  /** 被授权的工作角色（工具 actor.role 由此决定，不由模型自由声明） */
  workRole: 'reviewer' | 'student'
  /** 指派发起者（人工授权人，与代操作 AI 分开记录） */
  grantedBy: { actorId: string; sessionId: string }
  createdAt: string
  /** 授权到期时间（ISO）。到期后即便未撤销也不得继续写。 */
  expiresAt?: string
  /**
   * 轮次绑定策略（AUTH-07）：
   * - 'single-turn'：只允许 turnId 记录的那一轮使用（默认，新指派一律如此）
   * - 'multi-turn'：显式长期授权，必须有 expiresAt，否则视为配置错误
   */
  turnPolicy?: 'single-turn' | 'multi-turn'
  /** 案卷可见范围（AUTH-09）：缺省等于 caseId 单一案卷 */
  caseVisibility?: { caseIds: string[] }
  revokedAt?: string
  /** 撤销审计：谁、何时、为什么（不持久化失败时也要留下意图） */
  revokeReason?: string
}

const ASSIGNMENTS_FILE = 'review-agent-assignments.json'
/**
 * 撤销意图独立落盘（AUTH-08）。它先于主账本写入：即使主账本写盘失败
 * （ENOSPC/EACCES）或进程随后崩溃，重启后仍能读到“该 grant 必须被拒绝”，
 * 从而把 fail-closed 变成持久事实，而不是只活在内存 Set 里。
 */
const REVOCATIONS_FILE = 'review-agent-assignment-revocations.json'

/**
 * Process-local revocation intent. In case the disk write fails, the grant
 * remains denied for every Main tool/lookup in this process. This is NOT
 * evidence that the revocation reached persistent storage.
 */
const pendingRevocations = new Set<string>()

function isLiveDirectPiRun(assignment: ReviewAgentAssignment): boolean {
  if (!assignment.activeRunId) return true // ordinary delegated assignments
  if (!assignment.caseId) return false
  try {
    // Even after process restart, a terminal or missing V2 run must never
    // resurrect a grant whose revokedAt write failed.
    return !isInterruptedRunV2(assignment.caseId, assignment.activeRunId)
      && getRunV2(assignment.caseId, assignment.activeRunId)?.status === 'running'
  } catch {
    return false
  }
}

function assignmentsPath(): string {
  return join(getConfigDir(), ASSIGNMENTS_FILE)
}

function revocationsPath(): string {
  return join(getConfigDir(), REVOCATIONS_FILE)
}

interface RevocationIntent { assignmentId: string; at: string; reason?: string }

/** 读取持久撤销意图。文件损坏时 fail-closed：返回 null 表示不可信。 */
function readRevocationIntents(): RevocationIntent[] | null {
  const path = revocationsPath()
  if (!existsSync(path)) return []
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as { revocations?: RevocationIntent[] }
    if (!parsed || !Array.isArray(parsed.revocations)) return null
    return parsed.revocations.filter((item) => typeof item?.assignmentId === 'string')
  } catch {
    return null
  }
}

/** 记录持久撤销意图；失败即抛错（调用方不得声称撤销已成功）。 */
function recordRevocationIntent(assignmentId: string, reason?: string): void {
  const existing = readRevocationIntents()
  if (existing === null) throw new Error('撤销意图账本损坏，拒绝继续授权；请人工修复后再操作')
  if (existing.some((item) => item.assignmentId === assignmentId)) return
  existing.push({ assignmentId, at: new Date().toISOString(), ...(reason ? { reason } : {}) })
  writeJsonFileAtomic(revocationsPath(), { revocations: existing })
}

/** 持久撤销 + 进程内隔离，两者都算已撤销。 */
function isDurablyRevoked(assignmentId: string, durable: RevocationIntent[] | null): boolean {
  if (pendingRevocations.has(assignmentId)) return true
  // 账本不可读时不能证明“未撤销”，按已撤销处理。
  if (durable === null) return true
  return durable.some((item) => item.assignmentId === assignmentId)
}

function readAll(): ReviewAgentAssignment[] {
  const path = assignmentsPath()
  if (!existsSync(path)) return []
  // Missing file is a fresh profile. A present but corrupt/unreadable file
  // is NOT an empty authorization ledger: fail closed and never overwrite it.
  const parsed = JSON.parse(readFileSync(path, 'utf-8')) as { assignments?: ReviewAgentAssignment[] }
  if (!parsed || !Array.isArray(parsed.assignments)) {
    throw new Error('审核指派文件结构损坏，禁止继续授权')
  }
  return parsed.assignments
}

function writeAll(assignments: ReviewAgentAssignment[]): void {
  // A previous revoke may have failed with EACCES/ENOSPC. Any subsequent
  // successful write MUST make that pending deny durable as well, otherwise
  // an unrelated grant could preserve a stale authorized row across restart.
  const persisted = assignments.map((assignment) => pendingRevocations.has(assignment.id) && !assignment.revokedAt
    ? { ...assignment, revokedAt: new Date().toISOString() }
    : assignment)
  // Atomic replacement: ENOSPC must never truncate the last valid ledger.
  writeJsonFileAtomic(assignmentsPath(), { assignments: persisted })
  // Only clear process-local quarantine after the complete file was committed.
  for (const assignment of persisted) {
    if (assignment.revokedAt) pendingRevocations.delete(assignment.id)
  }
}

export interface CreateAssignmentInput {
  sessionId: string
  turnId: string
  /** 案卷型指派：直接绑定已有案卷 */
  caseId?: string
  /** 建案型指派：锁定模板与版本（建案后绑定 caseId） */
  templateId?: string
  templateVersion?: number
  actions: ReviewAssignmentAction[]
  workRole?: 'reviewer' | 'student'
  grantedByActorId?: string
  /** 显式长期授权到期时间；只有它才允许跨轮复用 */
  expiresAt?: string
}

/** 创建指派（UI「交给 Agent」按钮走这里；sessionId/turnId 必须来自用户真实轮次） */
export function createAssignment(input: CreateAssignmentInput): ReviewAgentAssignment {
  if (!input.sessionId || !input.turnId) throw new Error('指派必须绑定会话与用户轮次（显式指派）')
  if (!Array.isArray(input.actions) || input.actions.length === 0) throw new Error('指派动作范围不能为空')
  if (!input.caseId && !input.templateId) throw new Error('指派必须指定案卷或模板（二选一）')
  if (input.workRole && input.workRole !== 'reviewer' && input.workRole !== 'student') throw new Error('工作角色仅限 reviewer/student（teacher/judge 等决定角色不开放 Agent 代操作）')
  const assignment: ReviewAgentAssignment = {
    id: `asg-${randomUUID().slice(0, 8)}`,
    sessionId: input.sessionId,
    turnId: input.turnId,
    ...(input.caseId ? { caseId: input.caseId } : {}),
    ...(input.templateId ? { templateId: input.templateId, templateVersion: input.templateVersion ?? 1 } : {}),
    actions: [...new Set(input.actions)],
    workRole: input.workRole ?? 'reviewer',
    grantedBy: { actorId: input.grantedByActorId ?? 'local-user', sessionId: input.sessionId },
    createdAt: new Date().toISOString(),
    // AUTH-07：默认只授权发起那一轮；跨轮必须显式长期 grant（带 expiresAt）。
    turnPolicy: 'single-turn',
    ...(input.caseId ? { caseVisibility: { caseIds: [input.caseId] } } : {}),
    ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
  }
  const all = readAll()
  all.push(assignment)
  writeAll(all)
  return assignment
}

/** 撤销指派：撤销后新写入被拒（已完成动作保留时间线） */
export function revokeAssignment(assignmentId: string, reason?: string): boolean {
  // Intend to deny BEFORE any read/write that can fail (EACCES, ENOSPC, JSON).
  pendingRevocations.add(assignmentId)
  // 先落持久撤销意图：主账本后续写失败时，重启仍会拒绝该 grant。
  recordRevocationIntent(assignmentId, reason)
  const all = readAll()
  const target = all.find((item) => item.id === assignmentId)
  if (!target || target.revokedAt) {
    // An unknown ID has no grant to re-enable, and a persisted revocation is
    // already durable. Neither needs a process-local pending marker.
    pendingRevocations.delete(assignmentId)
    return false
  }
  target.revokedAt = new Date().toISOString()
  if (reason) target.revokeReason = reason
  // On write failure the pending marker MUST survive: do not pretend that
  // revokedAt was persisted. The exception is observed by the Main caller.
  // The durable intent above already guarantees restart-time denial.
  writeAll(all)
  pendingRevocations.delete(assignmentId)
  return true
}

/** 建案后绑定 caseId（建案型指派转成案卷型；一次指派不能开多案） */
export function bindCaseToAssignment(assignmentId: string, caseId: string): ReviewAgentAssignment {
  const all = readAll()
  const target = all.find((item) => item.id === assignmentId)
  if (!target) throw new Error(`指派不存在: ${assignmentId}`)
  if (target.revokedAt) throw new Error('指派已撤销，不能绑定案卷')
  if (target.caseId && target.caseId !== caseId) throw new Error('该指派已绑定其他案卷，不能复用建案')
  target.caseId = caseId
  writeAll(all)
  return target
}

/** 将宿主创建的直接 Pi 审核运行绑定到指派；每个指派只能绑定一个运行。 */
export function bindRunToAssignment(assignmentId: string, runId: string): ReviewAgentAssignment {
  if (!runId) throw new Error('审核运行 ID 不能为空')
  const all = readAll()
  const target = all.find((item) => item.id === assignmentId)
  if (!target) throw new Error(`指派不存在: ${assignmentId}`)
  if (target.revokedAt) throw new Error('指派已撤销，不能绑定审核运行')
  if (target.activeRunId && target.activeRunId !== runId) throw new Error('该指派已绑定其他审核运行')
  target.activeRunId = runId
  writeAll(all)
  return target
}

/** 指派校验结果 */
export interface AssignmentCheck {
  ok: boolean
  code?: 'ASSIGNMENT_NOT_FOUND' | 'ASSIGNMENT_REVOKED' | 'ACTION_NOT_ALLOWED' | 'CASE_MISMATCH' | 'TURN_NOT_USER'
    | 'TURN_MISMATCH' | 'TURN_UNVERIFIED' | 'ASSIGNMENT_EXPIRED'
  message?: string
  assignment?: ReviewAgentAssignment
}

/**
 * 工具调用前校验：指派存在、未撤销、动作在范围内、案卷匹配。
 * sessionId 必须与指派一致（其他会话不能冒用指派 ID）。
 * turnTriggeredBy 必须是 'user'（automation/goal/delegation 轮次不获写权限）。
 */
export function checkAssignment(input: {
  assignmentId: string
  sessionId: string
  action: ReviewAssignmentAction
  turnTriggeredBy?: 'user' | 'automation' | 'delegation' | 'goal'
  /** 当前真实轮次 ID（Main 注入）；用于拒绝跨轮复用旧 grant（AUTH-07） */
  turnId?: string
  /** true 时缺少 turnId 即拒绝，写操作应始终传 true */
  requireTurnMatch?: boolean
}): AssignmentCheck {
  let durable: RevocationIntent[] | null = null
  try {
    durable = readRevocationIntents()
  } catch {
    durable = null
  }
  if (isDurablyRevoked(input.assignmentId, durable)) {
    return { ok: false, code: 'ASSIGNMENT_REVOKED', message: '该指派已被撤销（含未成功写主账本的持久撤销意图）；请重新指派' }
  }
  let assignment: ReviewAgentAssignment | undefined
  try {
    assignment = readAll().find((item) => item.id === input.assignmentId)
  } catch {
    return { ok: false, code: 'ASSIGNMENT_REVOKED', message: '审核指派账本不可可信读取，已拒绝操作' }
  }
  if (!assignment) return { ok: false, code: 'ASSIGNMENT_NOT_FOUND', message: `指派不存在: ${input.assignmentId}` }
  if (assignment.sessionId !== input.sessionId) return { ok: false, code: 'ASSIGNMENT_NOT_FOUND', message: '指派不属于当前会话' }
  if (assignment.revokedAt) return { ok: false, code: 'ASSIGNMENT_REVOKED', message: `指派已被撤销（${assignment.revokedAt}）；已完成动作保留在时间线` }
  if (assignment.expiresAt && Date.parse(assignment.expiresAt) <= Date.now()) {
    return { ok: false, code: 'ASSIGNMENT_EXPIRED', message: `指派已过期（${assignment.expiresAt}），请重新授权` }
  }
  // AUTH-07：普通 grant 只服务发起它的那一轮。跨轮复用必须显式长期授权。
  const turnPolicy = assignment.turnPolicy ?? 'single-turn'
  if (turnPolicy === 'multi-turn' && !assignment.expiresAt) {
    return { ok: false, code: 'ASSIGNMENT_EXPIRED', message: '长期指派缺少到期时间，配置无效，已拒绝' }
  }
  if (turnPolicy === 'single-turn') {
    if (!input.turnId) {
      if (input.requireTurnMatch) {
        return { ok: false, code: 'TURN_UNVERIFIED', message: '缺少可信当前轮次 ID，无法证明与授权轮次一致，已拒绝' }
      }
    } else if (input.turnId !== assignment.turnId) {
      return { ok: false, code: 'TURN_MISMATCH', message: `指派仅授权轮次 ${assignment.turnId}，当前轮次 ${input.turnId} 无写权限` }
    }
  }
  if (!isLiveDirectPiRun(assignment)) {
    return { ok: false, code: 'ASSIGNMENT_REVOKED', message: '直接 Pi 审核运行已结束或无可信运行记录，旧指派不能再操作' }
  }
  if (input.turnTriggeredBy && input.turnTriggeredBy !== 'user') {
    return { ok: false, code: 'TURN_NOT_USER', message: `仅用户发起的轮次可执行审核写操作（当前轮次来源: ${input.turnTriggeredBy}）` }
  }
  if (!assignment.actions.includes(input.action)) {
    return { ok: false, code: 'ACTION_NOT_ALLOWED', message: `指派未授权动作: ${input.action}（授权范围: ${assignment.actions.join('、')}）` }
  }
  return { ok: true, assignment }
}

/** 列出会话的有效指派（UI 展示 + 工具发现） */
export function listAssignments(sessionId?: string): ReviewAgentAssignment[] {
  const durable = readRevocationIntents()
  const all = readAll().map((item) => isDurablyRevoked(item.id, durable) && !item.revokedAt
    ? { ...item, revokedAt: new Date().toISOString() }
    : item)
  const filtered = sessionId ? all.filter((item) => item.sessionId === sessionId) : all
  return filtered.map((item) => ({ ...item }))
}

/** 读取会话最近一条有效的直接审核指派。 */
export function findActivePiReviewAssignment(sessionId: string): ReviewAgentAssignment | undefined {
  // createAssignment appends to disk. Millisecond timestamps can tie
  // during consecutive runs; use persisted insertion order, newest first.
  return readAll().reverse().find((item) => item.sessionId === sessionId
    && !item.revokedAt && !pendingRevocations.has(item.id)
    && item.caseId
    && item.activeRunId
    && item.actions.includes('submit-result'))
}

/** 由指派构造工具 actor（role 来自指派工作角色，不由模型声明；actorId 保留完整会话身份） */
export function actorOfAssignment(assignment: ReviewAgentAssignment): { actorId: string; actorSource: 'agent'; role: 'reviewer' | 'student' } {
  return { actorId: `agent-${assignment.sessionId}`, actorSource: 'agent', role: assignment.workRole }
}

/**
 * 案卷读取范围校验（AUTH-09）。
 * 写权限有 caseId 门禁，读权限过去没有：Agent 未获授权也能列/读任意案卷摘要。
 * 这里给出与写一致的可见性合同，供工具层在每次读之前调用。
 */
export interface CaseReadScopeCheck {
  ok: boolean
  code?: 'CASE_NOT_VISIBLE' | 'READ_SCOPE_UNVERIFIED'
  message?: string
  caseIds: string[]
}

export function checkCaseReadScope(input: {
  /** 缺省表示无指派：只能浏览“本地操作者自有范围”，由调用方决定是否放行 */
  assignment?: ReviewAgentAssignment
  /** 显式只读浏览开关（UI 本地所有者浏览） */
  localOwnerBrowsing?: boolean
}): CaseReadScopeCheck {
  if (!input.assignment) {
    if (input.localOwnerBrowsing) return { ok: true, caseIds: [] }
    return { ok: false, code: 'READ_SCOPE_UNVERIFIED', message: '读取案卷需要指派或显式本地所有者浏览范围', caseIds: [] }
  }
  if (input.assignment.revokedAt || pendingRevocations.has(input.assignment.id)) {
    return { ok: false, code: 'READ_SCOPE_UNVERIFIED', message: '指派已撤销，读取范围失效', caseIds: [] }
  }
  const caseIds = input.assignment.caseVisibility?.caseIds
    ?? (input.assignment.caseId ? [input.assignment.caseId] : [])
  return { ok: true, caseIds }
}

/** 判断某个案卷是否在可见范围内（空范围=不可见，除非本地所有者浏览）。 */
export function isCaseVisible(scope: CaseReadScopeCheck, caseId: string, localOwnerBrowsing = false): boolean {
  if (!scope.ok) return false
  if (localOwnerBrowsing && scope.caseIds.length === 0) return true
  return scope.caseIds.includes(caseId)
}
