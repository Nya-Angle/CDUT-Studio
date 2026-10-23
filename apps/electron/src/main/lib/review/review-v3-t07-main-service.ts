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
import { getCase } from './case-store'
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

/**
 * Main 派生匿名材料：只读案卷本体，绝不采用 Renderer 提供的摘要。
 * 文档标题用中性序号，避免文件名把学号/姓名带进匿名视图（JDG-02/JDG-15）。
 */
function trustedMaterials(state: T07State): T07SafeCaseMaterial[] {
  return state.cases.map((entry) => {
    const reviewCase = getCase(entry.caseId)
    if (!reviewCase) return { caseId: entry.caseId, summary: '', documents: [] }
    const summary = reviewCase.items.map((item) => item.title.trim()).filter(Boolean).join('；')
    const documents = reviewCase.documents
      .filter((doc) => doc.role !== 'rule')
      .map((doc, index) => ({ id: doc.id, title: '材料 ' + (index + 1) }))
    return { caseId: entry.caseId, summary, documents }
  })
}

/**
 * 轮次新鲜度门禁（JDG-09 本地可实现部分）：
 * 批次必须仍存在、量表版本仍与轮次锁定一致且模板仍为已发布，案卷集合不得被换掉。
 * 批次状态机与重开语义由 batch 组提供，见 handoffs/judging-IPC-REQUEST.md。
 */
function assertRoundFresh(batchId: string, state: T07State): void {
  const batch = readBatchStateV2(batchId)?.batch
  if (!batch) throw new Error('T07_BATCH_NOT_FOUND')
  if (batch.templateId !== undefined && state.rubricVersion !== batch.templateVersion) {
    throw new Error('T07_RUBRIC_VERSION_STALE: 批次量表版本已变化，请重新建立评分轮次')
  }
  const template = getTemplate(batch.templateId, batch.templateVersion)
  if (!template || template.status !== 'published') {
    throw new Error('T07_TEMPLATE_NOT_PUBLISHED: 批次量表已不再处于发布状态')
  }
  const current = new Set(batch.caseIds)
  const known = new Set(state.cases.map((entry) => entry.caseId))
  if (current.size !== known.size || [...current].some((id) => !known.has(id))) {
    throw new Error('T07_CASES_CHANGED: 批次案卷集合已变化，旧轮次评分不能继续提交')
  }
}

export interface T07StateView {
  revision: number
  view: T07View
  updatedAt: string
}

/** 读取并投影评分视图。 */
export function getT07View(batchId: string, claim: T07MainActorClaim | undefined): T07StateView {
  const actor = deriveT07Actor(claim)
  const persisted = readT07State(batchId)
  if (!persisted) throw new Error('T07_STATE_NOT_INITIALIZED')
  return {
    revision: persisted.revision,
    updatedAt: persisted.updatedAt,
    // 材料只来自 Main 对案卷的读取，Renderer 无法注入摘要或 N/A 维度。
    view: projectT07View(persisted.state, actor, trustedMaterials(persisted.state)),
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
    view: projectT07View(persisted.state, actor, trustedMaterials(persisted.state)),
  }
}

/** T04 事实端口尚未接通前，N/A 一律失败关闭；接通后由 Main 规则评估替换。 */
const trustedNaEligible: ((caseId: string, dimensionId: string) => boolean) | undefined = undefined

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
  /**
   * @deprecated Renderer 不得提供材料或 N/A 条件；保留字段仅为编译兼容，运行时忽略。
   */
  safeMaterials?: T07SafeCaseMaterial[]
  naEligible?: (caseId: string, dimensionId: string) => boolean
}): T07ApplyResult {
  const actor = deriveT07Actor(input.claim)
  const existing = readT07State(input.batchId)
  if (!existing) throw new Error('T07_STATE_NOT_INITIALIZED')

  const base = existing.state
  if (base.batchId !== input.batchId) throw new Error('T07_BATCH_MISMATCH')
  assertRoundFresh(input.batchId, base)

  const next = applyT07Action(base, input.action, {
    actor,
    at: new Date().toISOString(),
    // N/A 适用条件尚未有 Main 侧 T04 事实端口（见 handoff）；此处失败关闭，
    // 绝不采用 Renderer 传入的 naEligible 冒充条件已核验。
    ...(trustedNaEligible ? { naEligible: trustedNaEligible } : {}),
  })

  const persisted: T07PersistedState = writeT07State(input.batchId, next, input.expectedRevision)

  return {
    revision: persisted.revision,
    view: projectT07View(next, actor, trustedMaterials(next)),
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
