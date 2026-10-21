/**
 * T07 评分 Main 服务（Local-L04 桥接层）。
 *
 * 职责只有三件事：
 * 1. 从 Main 侧可信信息派生评委/组织者 actor（绝不采用 Renderer 声称的身份）；
 * 2. 读出 T07State 并投影成评分视图（评委只看自己任务与脱敏材料）；
 * 3. 应用 T07Action 并持久化，要求 expectedRevision 匹配。
 *
 * 不重写 T07 的业务算法：分配、回避、评分、排名、同分与冻结全部调用
 * `review-v3-t07-rating-workflow` 的既有纯函数。
 */
import { readBatchStateV2 } from './batch-store'
import { getTemplate } from './template-store'
import { createT07RoundFromPublishedTemplate } from './review-v3-t07-round-setup'
import {
  applyT07Action, projectT07View, currentT07Round, computeT07Ranking,
  type T07Action, type T07Actor, type T07SafeCaseMaterial, type T07State, type T07View,
} from './review-v3-t07-rating-workflow'
import {
  initT07State, readT07State, writeT07State, type T07PersistedState,
} from './review-v3-t07-state-store'

/** Renderer 只能声明「我是哪个角色」，身份本身由 Main 绑定。 */
export interface T07MainActorClaim {
  /** 组织者模式：本机审核员；评委模式：本机评委标识（不得冒充他人） */
  role: 'judge' | 'organizer'
  reviewerId?: string
}

/**
 * Main 派生可信 actor。
 *
 * 取值约束：
 * - organizer 恒为本地审核员 `local-reviewer`（本机唯一可信组织者身份）；
 * - judge 必须显式给出 reviewerId，且只能是本机声明的评委标识——
 *   这是「本地评委」语义，不是学校身份或他人代理，不能凭此获得校方权限。
 */
export function deriveT07Actor(claim: T07MainActorClaim | undefined): T07Actor {
  if (!claim || (claim.role !== 'judge' && claim.role !== 'organizer')) {
    throw new Error('T07_ACTOR_REQUIRED')
  }
  if (claim.role === 'organizer') {
    return { actorId: 'local-reviewer', role: 'organizer', actorSource: 'local' }
  }
  const reviewerId = claim.reviewerId?.trim()
  if (!reviewerId) throw new Error('T07_JUDGE_ID_REQUIRED')
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(reviewerId)) throw new Error('T07_JUDGE_ID_INVALID')
  return { actorId: reviewerId, role: 'judge', actorSource: 'local' }
}

export interface T07StateView {
  revision: number
  view: T07View
  updatedAt: string
}

/** 读取并投影评分视图。 */
export function getT07View(batchId: string, claim: T07MainActorClaim | undefined,
  safeMaterials: T07SafeCaseMaterial[] = []): T07StateView {
  const actor = deriveT07Actor(claim)
  const persisted = readT07State(batchId)
  if (!persisted) throw new Error('T07_STATE_NOT_INITIALIZED')
  return {
    revision: persisted.revision,
    updatedAt: persisted.updatedAt,
    view: projectT07View(persisted.state, actor, safeMaterials),
  }
}

/**
 * 建立某个批次的评分轮次（首次初始化）。
 *
 * 只有组织者可建轮次，且必须尚无既有状态——已存在时拒绝，避免静默重置评分。
 * 这是「建轮次」而不是「重开」：T07 的 reopen 只对已冻结轮次有效。
 */
export function initT07MainState(input: {
  batchId: string
  claim: T07MainActorClaim | undefined
  state: T07State
}): T07StateView {
  const actor = deriveT07Actor(input.claim)
  if (actor.role !== 'organizer') throw new Error('T07_ORGANIZER_REQUIRED')
  // Renderer 参数 state 为旧 IPC 兼容项，不作为真实评分轮次的数据来源。
  const batch = readBatchStateV2(input.batchId)?.batch
  if (!batch) throw new Error('T07_BATCH_NOT_FOUND')
  const template = getTemplate(batch.templateId, batch.templateVersion)
  const trustedState = createT07RoundFromPublishedTemplate(batch, template)
  const persisted = initT07State(input.batchId, trustedState, 0)
  return {
    revision: persisted.revision,
    updatedAt: persisted.updatedAt,
    view: projectT07View(persisted.state, actor, []),
  }
}

export interface T07ApplyResult {
  revision: number
  view: T07View
  ranking: ReturnType<typeof computeT07Ranking>
}

/**
 * 应用一个评分动作。
 *
 * `state` 首次创建时传 expectedRevision=0；之后必须与磁盘修订号一致。
 * 动作合法性完全由 T07 的 `applyT07Action` 判定（含回避、缺评门控、同分裁决）。
 */
export function applyT07MainAction(input: {
  batchId: string
  claim: T07MainActorClaim | undefined
  action: T07Action
  expectedRevision: number
  /** 首次初始化时提供；已存在时忽略（禁止静默重置评分） */
  initialState?: T07State
  safeMaterials?: T07SafeCaseMaterial[]
  naEligible?: (caseId: string, dimensionId: string) => boolean
}): T07ApplyResult {
  const actor = deriveT07Actor(input.claim)
  const existing = readT07State(input.batchId)
  if (!existing) throw new Error('T07_STATE_NOT_INITIALIZED')

  const base = existing.state
  if (base.batchId !== input.batchId) throw new Error('T07_BATCH_MISMATCH')

  const next = applyT07Action(base, input.action, {
    actor,
    at: new Date().toISOString(),
    ...(input.naEligible ? { naEligible: input.naEligible } : {}),
  })

  const persisted: T07PersistedState = writeT07State(input.batchId, next, input.expectedRevision)

  return {
    revision: persisted.revision,
    view: projectT07View(next, actor, input.safeMaterials ?? []),
    ranking: computeT07Ranking(next),
  }
}

/** 供 Main 内部消费者：当前轮次的匿名标签与分配情况（不含票面内容）。 */
export function readT07RoundSummary(batchId: string): {
  round: number; caseCount: number; assignmentCount: number; voted: number; finalized: boolean
} | undefined {
  const persisted = readT07State(batchId)
  if (!persisted) return undefined
  const round = currentT07Round(persisted.state)
  return {
    round: round.number,
    caseCount: persisted.state.cases.length,
    assignmentCount: round.assignments.length,
    voted: round.votes.length,
    finalized: Boolean(round.finalized),
  }
}
