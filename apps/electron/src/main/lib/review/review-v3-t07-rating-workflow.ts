/**
 * T07: independent judging domain, without a second Case/Run/store.
 * L/Main persists the returned value as a versioned subrecord of the existing
 * batch/case aggregate, and supplies a trusted actor and timestamp.
 * UI never persists this state or supplies identity.
 */
import type { RubricSpec } from '@profer/shared'
import { decimalT04, formatT04 } from './review-v3-t04-rules-scoring'

export type T07Actor = { actorId: string; role: 'judge' | 'organizer'; actorSource: 'local' | 'mock' | 'school' }
export type T07Score = { dimensionId: string; score: number | null; na: boolean; comment?: string }
export type T07Case = { caseId: string; blindLabel: string }
export type T07Assignment = {
  id: string; caseId: string; reviewerId: string; rubricVersion: number
  status: 'assigned' | 'submitted' | 'recused' | 'missing'; reason?: string
}
export type T07Vote = {
  assignmentId: string; caseId: string; reviewerId: string; round: number
  scores: T07Score[]; publicFeedback: string; internalNotes?: string
  submittedAt: string
  /** Main only: durable offline reply actionId, written atomically with the vote. */
  offlineActionId?: string
}
export type T07RankingRow = {
  caseId: string; blindLabel: string; total: number | null; convertedTotal: number | null; rank: number | null
  selected: boolean | null; effectiveJudges: number; blockers: string[]
  dimensions: Array<{ dimensionId: string; average: number | null; voters: number }>
  divergence: number | null
}
export type T07Freeze = { by: string; at: string; round: number; ranking: T07RankingRow[] }
export type T07Round = {
  number: number; assignments: T07Assignment[]; votes: T07Vote[]
  revisionHistory?: Array<{ vote: T07Vote; by: string; at: string; reason: string }>
  divergenceReasons: Record<string, string>
  /** Organizer-defined priority order for each still-tied group; key: sorted case IDs joined by | */
  tieOrders: Record<string, string[]>
  reopenedFrom?: { round: number; by: string; at: string; reason: string }
  finalized?: T07Freeze
}
/** 不可覆写的动作事件：谁在何时做了什么，附动作后状态摘要，供完整回放。 */
export type T07ActionEvent = {
  /** 幂等动作 ID（离线回件复用 offlineActionId）；同一 ID 不得重复入账。 */
  actionId: string
  sequence: number
  at: string
  actorId: string
  role: T07Actor['role']
  actionType: T07Action['type']
  targetId?: string
  reason?: string
  /** 动作后状态摘要（FNV-1a），用于发现账本与状态不一致。 */
  stateDigest: string
}
export type T07State = {
  batchId: string; rubricVersion: number; rubric: RubricSpec
  cases: T07Case[]; rounds: T07Round[]
  /** Optional explicit dimension for 'by-dimension' ties. */
  tieDimensionId?: string
  /** 追加式动作账本；只增不改，冻结后仍保留。 */
  actionLog?: T07ActionEvent[]
}
export type T07Action =
  | { type: 'assign'; caseId: string; reviewerId: string; assignmentId: string }
  | { type: 'recuse'; assignmentId: string; reason: string }
  | { type: 'self-recuse'; assignmentId: string; reason: string }
  | { type: 'mark-missing'; assignmentId: string; reason: string }
  | { type: 'request-revision'; assignmentId: string; reason: string }
  | { type: 'submit'; assignmentId: string; scores: T07Score[]; publicFeedback: string; internalNotes?: string; offlineActionId?: string }
  | { type: 'resolve-divergence'; caseId: string; reason: string }
  | { type: 'set-tie-order'; caseIds: string[] }
  | { type: 'set-tie-dimension'; dimensionId: string }
  | { type: 'finalize' }
  | { type: 'reopen'; reason: string }
export type T07Context = {
  actor: T07Actor; at: string
  /** Evaluated by T04/Main against the case and rubric's naWhen, never by renderer. */
  naEligible?: (caseId: string, dimensionId: string) => boolean
}

export function currentT07Round(state: T07State): T07Round {
  const round = state.rounds[state.rounds.length - 1]
  if (!round) throw new Error('评分批次还没有轮次')
  return round
}
function assertOpen(round: T07Round): void {
  if (round.finalized) throw new Error('本轮评分已冻结，请由组织者授权重开')
}
/**
 * 与 F08 同一数值语义：六位十进制定点整数 + half-up，不用 JS 浮点 toFixed。
 * 差异会直接改变名次与名额，因此总分、维度均分、分歧与换算全部走这里。
 */
function fixed(value: number): bigint {
  // 入口已按六位小数规范化；此处仍显式截断，避免二进制尾数进入内核。
  return decimalT04(Number(value.toFixed(6)))
}
function divideRounded(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new Error('T07_DIVISOR_INVALID')
  const negative = numerator < 0n
  const absolute = negative ? -numerator : numerator
  const value = (absolute + denominator / 2n) / denominator
  return negative ? -value : value
}
/** 精确定点结果转为展示数值（字符串来源，避免二次浮点误差）。 */
function fixedNumber(value: bigint, precision: number): number {
  return Number(formatT04(value, precision))
}
function requireOrganizer(context: T07Context): void {
  if (context.actor.role !== 'organizer') throw new Error('该动作只能由评审组织者执行')
}
function requireCase(state: T07State, id: string): T07Case {
  const found = state.cases.find((entry) => entry.caseId === id)
  if (!found) throw new Error('案卷不属于当前评审批次')
  return found
}
function withRound(state: T07State, round: T07Round): T07State {
  return { ...state, rounds: [...state.rounds.slice(0, -1), round] }
}
/** 评分票变化后，旧分歧复核与包含该项目的同分裁定不得继续自动生效。 */
function invalidatedAdjudications(round: T07Round, caseId: string): Pick<T07Round, 'divergenceReasons' | 'tieOrders'> {
  const divergenceReasons = { ...round.divergenceReasons }
  delete divergenceReasons[caseId]
  return {
    divergenceReasons,
    tieOrders: Object.fromEntries(Object.entries(round.tieOrders)
      .filter(([key]) => !key.split('|').includes(caseId))),
  }
}
function checkSubmission(state: T07State, caseId: string, scores: T07Score[], context: T07Context): void {
  const rubric = state.rubric
  if (scores.length !== rubric.dimensions.length || new Set(scores.map((s) => s.dimensionId)).size !== scores.length) {
    throw new Error('请逐项提交量表全部维度，不能重复或漏填')
  }
  for (const dimension of rubric.dimensions) {
    const entry = scores.find((s) => s.dimensionId === dimension.id)
    if (!entry) throw new Error('缺少量表维度：' + dimension.name)
    if (entry.na) {
      if (entry.score !== null) throw new Error('N/A 维度不能同时给分')
      if (!dimension.naWhen || !context.naEligible?.(caseId, dimension.id)) {
        throw new Error('维度 ' + dimension.name + ' 未经适用条件确认，不能标 N/A')
      }
    } else if (entry.score === null || !Number.isFinite(entry.score) || entry.score < dimension.min || entry.score > dimension.max) {
      throw new Error('维度 ' + dimension.name + ' 必须在 ' + dimension.min + '–' + dimension.max + ' 范围内填写有效分数')
    } else if (!Number.isFinite(Number(entry.score.toFixed(6)))) {
      // 定点内核最多接受六位小数；入口先规范化，避免把不可表示的分数带进汇总。
      throw new Error('维度 ' + dimension.name + ' 的分数最多支持六位小数')
    }
  }
}
export function applyT07Action(state: T07State, action: T07Action, context: T07Context): T07State {
  const next = applyT07ActionCore(state, action, context)
  return appendActionEvent(state, next, action, context)
}

/**
 * 追加不可覆写动作事件。同一 actionId（含离线回件）只能入账一次，
 * 防止重复提交把同一票/同一裁定重复计入历史。
 */
function appendActionEvent(
  before: T07State, after: T07State, action: T07Action, context: T07Context,
): T07State {
  const previousLog = before.actionLog ?? []
  const sequence = previousLog.length + 1
  const targetId = 'assignmentId' in action ? action.assignmentId
    : 'caseId' in action ? action.caseId
    : 'caseIds' in action ? [...action.caseIds].sort().join('|')
    : action.type === 'set-tie-dimension' ? action.dimensionId : undefined
  const explicitId = action.type === 'submit' ? action.offlineActionId?.trim() : undefined
  const actionId = explicitId || 'act-' + sequence + '-' + digestOf({
    actionType: action.type, targetId: targetId ?? '', at: context.at,
    actorId: context.actor.actorId, sequence,
  })
  if (previousLog.some((entry) => entry.actionId === actionId)) {
    throw new Error('T07_ACTION_REPLAY: 该动作已入账，不能重复提交')
  }
  const event: T07ActionEvent = {
    actionId, sequence, at: context.at,
    actorId: context.actor.actorId, role: context.actor.role,
    actionType: action.type,
    ...(targetId ? { targetId } : {}),
    ...('reason' in action && action.reason?.trim() ? { reason: action.reason.trim() } : {}),
    stateDigest: digestOf({ state: after, logLength: sequence }),
  }
  return { ...after, actionLog: [...previousLog, event] }
}

/** 轻量稳定摘要（FNV-1a 64 位近似），仅用于账本自洽，不作密码学证明。 */
function digestOf(value: unknown): string {
  const text = JSON.stringify(value)
  let hash = 0xcbf29ce484222325n
  for (let i = 0; i < text.length; i++) {
    hash ^= BigInt(text.charCodeAt(i))
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn
  }
  return hash.toString(16).padStart(16, '0')
}

function applyT07ActionCore(state: T07State, action: T07Action, context: T07Context): T07State {
  if (context.actor.actorSource !== 'local' && context.actor.actorSource !== 'mock' && context.actor.actorSource !== 'school') {
    throw new Error('评分只接受可信人工主体')
  }
  const round = currentT07Round(state)
  if (action.type === 'reopen') {
    requireOrganizer(context)
    if (!round.finalized) throw new Error('只有已冻结的轮次才能重开')
    if (!action.reason.trim()) throw new Error('重开须记录理由')
    const assignments = round.assignments.filter((a) => !a.status.includes('recused') && a.status !== 'missing')
      .map((a) => ({ ...a, id: a.id + '-r' + (round.number + 1), status: 'assigned' as const }))
    return { ...state, rounds: [...state.rounds, {
      number: round.number + 1, assignments, votes: [], divergenceReasons: {}, tieOrders: {},
      reopenedFrom: { round: round.number, by: context.actor.actorId, at: context.at, reason: action.reason.trim() },
    }] }
  }
  assertOpen(round)
  if (action.type === 'assign') {
    requireOrganizer(context)
    requireCase(state, action.caseId)
    if (!action.reviewerId.trim() || !action.assignmentId.trim()) throw new Error('缺少评委或指派 ID')
    if (round.assignments.some((a) => a.id === action.assignmentId)) throw new Error('指派 ID 已存在')
    if (round.assignments.some((a) => a.caseId === action.caseId && a.reviewerId === action.reviewerId)) {
      throw new Error('本轮该评委已经分配过此案卷')
    }
    return withRound(state, { ...round, assignments: [...round.assignments, {
      id: action.assignmentId, caseId: action.caseId, reviewerId: action.reviewerId,
      rubricVersion: state.rubricVersion, status: 'assigned',
    }] })
  }
  if (action.type === 'recuse' || action.type === 'self-recuse' || action.type === 'mark-missing') {
    if (action.type !== 'self-recuse') requireOrganizer(context)
    else if (context.actor.role !== 'judge') throw new Error('只有对应评委能够自报回避')
    if (!action.reason.trim()) throw new Error('回避或标记缺评必须说明原因')
    const target = round.assignments.find((a) => a.id === action.assignmentId)
    // 已交卷后发现利益冲突也必须能够回避；旧票保存于修订历史，不能静默计入均分。
    if (!target || (target.status !== 'assigned' &&
      !(action.type !== 'mark-missing' && target.status === 'submitted'))) {
      throw new Error('该分配不可回避或标记缺评')
    }
    if (action.type === 'self-recuse' && target.reviewerId !== context.actor.actorId) {
      throw new Error('只能对本人分配的任务声明回避')
    }
    const revokedVote = round.votes.find((v) => v.assignmentId === target.id)
    return withRound(state, { ...round,
      ...(revokedVote ? invalidatedAdjudications(round, target.caseId) : {}),
      votes: revokedVote ? round.votes.filter((v) => v.assignmentId !== target.id) : round.votes,
      revisionHistory: revokedVote
        ? [...(round.revisionHistory ?? []), { vote: revokedVote, by: context.actor.actorId, at: context.at,
          reason: '利益回避：' + action.reason.trim() }] : round.revisionHistory,
      assignments: round.assignments.map((a) => a.id === target.id
        ? { ...a, status: action.type === 'mark-missing' ? 'missing' : 'recused', reason: action.reason.trim() } : a),
    })
  }
  if (action.type === 'request-revision') {
    requireOrganizer(context)
    if (!action.reason.trim()) throw new Error('退回改分必须写明理由')
    const target = round.assignments.find((a) => a.id === action.assignmentId && a.status === 'submitted')
    const vote = round.votes.find((v) => v.assignmentId === target?.id)
    if (!target || !vote) throw new Error('只有已提交且未冻结的评分可以退回重评')
    return withRound(state, { ...round,
      ...invalidatedAdjudications(round, target.caseId),
      assignments: round.assignments.map((a) => a.id === target.id ? { ...a, status: 'assigned' } : a),
      votes: round.votes.filter((v) => v.assignmentId !== target.id),
      revisionHistory: [...(round.revisionHistory ?? []), { vote, by: context.actor.actorId, at: context.at, reason: action.reason.trim() }],
    })
  }
  if (action.type === 'submit') {
    if (context.actor.role !== 'judge') throw new Error('只有被分配的评委能提交本人评分')
    const target = round.assignments.find((a) => a.id === action.assignmentId)
    if (!target || target.status !== 'assigned' || target.reviewerId !== context.actor.actorId ||
      target.rubricVersion !== state.rubricVersion || round.votes.some((v) => v.assignmentId === target.id)) {
      throw new Error('评分任务不属于当前评委或已提交、回避、过期')
    }
    checkSubmission(state, target.caseId, action.scores, context)
    const vote: T07Vote = {
      assignmentId: target.id, reviewerId: context.actor.actorId, caseId: target.caseId,
      round: round.number, scores: action.scores.map((score) => ({
        ...score,
        // 统一到六位定点可表示的数值，防止尾差改变总分。
        score: score.score === null ? null : Number(score.score.toFixed(6)),
      })),
      publicFeedback: action.publicFeedback.trim(), internalNotes: action.internalNotes?.trim(),
      submittedAt: context.at,
      ...(action.offlineActionId ? { offlineActionId: action.offlineActionId } : {}),
    }
    return withRound(state, { ...round, ...invalidatedAdjudications(round, target.caseId), votes: [...round.votes, vote],
      assignments: round.assignments.map((a) => a.id === target.id ? { ...a, status: 'submitted' } : a) })
  }
  if (action.type === 'resolve-divergence') {
    requireOrganizer(context); requireCase(state, action.caseId)
    if (!action.reason.trim()) throw new Error('分歧复核必须记录处理理由')
    return withRound(state, { ...round, divergenceReasons: { ...round.divergenceReasons, [action.caseId]: action.reason.trim() } })
  }
  if (action.type === 'set-tie-dimension') {
    requireOrganizer(context)
    const dimension = state.rubric.dimensions.find((d) => d.id === action.dimensionId)
    if (!dimension) throw new Error('同分维度不属于当前量表')
    if (state.rubric.tieBreaker !== 'by-dimension') {
      throw new Error('当前量表的同分策略不是按维度比较，无需指定维度')
    }
    return { ...state, tieDimensionId: dimension.id }
  }
  if (action.type === 'set-tie-order') {
    requireOrganizer(context)
    const ids = action.caseIds
    if (ids.length < 2 || new Set(ids).size !== ids.length) throw new Error('同分裁定必须列出互不重复的案卷')
    ids.forEach((id) => requireCase(state, id))
    const ranking = computeT07Ranking(state)
    const score = ranking.find((row) => row.caseId === ids[0])?.total
    const actualGroup = ranking.filter((row) => score !== null && row.total === score).map((row) => row.caseId)
    if (score === null || actualGroup.length !== ids.length || !actualGroup.every((id) => ids.includes(id))) {
      throw new Error('同分裁定必须且只能包含当前同分的全部案卷')
    }
    const key = [...ids].sort().join('|')
    return withRound(state, { ...round, tieOrders: { ...round.tieOrders, [key]: [...ids] } })
  }
  requireOrganizer(context)
  const rows = computeT07Ranking(state)
  if (rows.length === 0) throw new Error('评分批次没有案卷，不能定稿')
  const blocked = rows.some((row) => row.blockers.length > 0 || row.selected === null)
  if (blocked) throw new Error('存在缺评、未解决分歧、同分名额冲突或不完整量表，不能定稿')
  return withRound(state, { ...round, finalized: { by: context.actor.actorId, at: context.at, round: round.number, ranking: rows } })
}

export function computeT07Ranking(state: T07State): T07RankingRow[] {
  const round = currentT07Round(state)
  const rubric = state.rubric
  const minJudges = rubric.minEffectiveJudges ?? 1
  // 名额必须是「非负安全整数」；非法名额绝不产生「成功冻结的空名单」。
  const quotaInvalid = rubric.quota !== undefined &&
    (!Number.isSafeInteger(rubric.quota) || rubric.quota < 0)
  const rows: T07RankingRow[] = state.cases.map((entry) => {
    const asg = round.assignments.filter((a) => a.caseId === entry.caseId)
    const active = asg.filter((a) => a.status !== 'recused' && a.status !== 'missing')
    const votes = round.votes.filter((v) => active.some((a) => a.id === v.assignmentId))
    const validTotals: bigint[] = []
    const dims: T07RankingRow['dimensions'] = rubric.dimensions.map((d) => ({ dimensionId: d.id, average: null, voters: 0 }))
    const blockers: string[] = []
    if (quotaInvalid) blockers.push('模板名额配置无效（须为非负安全整数），不能产生入选名单')
    for (const vote of votes) {
      let sum = 0n; let weight = 0n; let blockedNA = false
      for (const d of rubric.dimensions) {
        const v = vote.scores.find((s) => s.dimensionId === d.id)
        if (!v || (v.na && rubric.naStrategy !== 'exclude' && rubric.naStrategy !== 'exclude-renormalize')) {
          blockers.push('存在待裁定的 N/A 或缺失维度')
          blockedNA = true
          continue
        }
        if (!v.na && v.score !== null) {
          // 与 F08 相同：分数与权重都按六位定点相乘后整数舍入，避免浮点尾差。
          sum += fixed(v.score) * fixed(d.weight)
          weight += fixed(d.weight)
        }
      }
      if (weight > 0n && !blockedNA) validTotals.push(divideRounded(sum, weight))
      else if (!blockedNA) blockers.push('有效评分权重为空')
    }
    for (const dim of dims) {
      const values = votes.flatMap((v) => v.scores
        .filter((s) => s.dimensionId === dim.dimensionId && !s.na && s.score !== null)
        .map((s) => fixed(s.score as number)))
      dim.voters = values.length
      dim.average = values.length
        ? fixedNumber(divideRounded(values.reduce((sum, v) => sum + v, 0n), BigInt(values.length)), rubric.totalPrecision)
        : null
    }
    if (validTotals.length < minJudges) blockers.push('有效评委 ' + validTotals.length + '/' + minJudges)
    if (rubric.missingStrategy === 'block' && active.some((a) => a.status !== 'submitted')) {
      blockers.push('还有未提交或已标缺评的分配，需替补或处理缺评策略')
    }
    const divergence = validTotals.length >= 2
      ? fixedNumber(validTotals.reduce((a, b) => a > b ? a : b) - validTotals.reduce((a, b) => a < b ? a : b), rubric.totalPrecision)
      : null
    if (divergence !== null && rubric.divergenceThreshold !== undefined &&
      divergence > rubric.divergenceThreshold && !round.divergenceReasons[entry.caseId]) {
      blockers.push('评委分歧超过阈值，等待组织者复核')
    }
    const average = validTotals.length
      ? divideRounded(validTotals.reduce((sum, v) => sum + v, 0n), BigInt(validTotals.length))
      : null
    const total = average === null ? null : fixedNumber(average, rubric.totalPrecision)
    const convertedTotal = average !== null && rubric.scaleConversion
      ? fixedNumber(divideRounded(average * fixed(rubric.scaleConversion.toMax), fixed(rubric.scaleConversion.fromMax)), rubric.totalPrecision)
      : null
    return { caseId: entry.caseId, blindLabel: entry.blindLabel, total, convertedTotal, rank: null,
      selected: false, effectiveJudges: validTotals.length, blockers, dimensions: dims, divergence }
  })
  // Scores are not rankable while their case is unresolved.
  const eligible = rows.filter((r) => !r.blockers.length && r.total !== null)
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0) || a.caseId.localeCompare(b.caseId))
  let rank = 0
  let previous: number | null = null
  for (let i = 0; i < eligible.length; i++) {
    const row = eligible[i]!
    if (row.total !== previous) rank = i + 1
    row.rank = rank; previous = row.total
  }
  const quota = rubric.quota
  let i = 0
  while (i < eligible.length) {
    let end = i + 1
    while (end < eligible.length && eligible[end]!.total === eligible[i]!.total) end++
    const group = eligible.slice(i, end)
    if (group.length > 1 && rubric.tieBreaker === 'by-dimension' && !state.tieDimensionId) {
      group.forEach((r) => r.blockers.push('按维度打破同分尚未指定维度'))
    } else if (group.length > 1 && rubric.tieBreaker === 'by-dimension' && state.tieDimensionId) {
      const dimScore = (r: T07RankingRow): number => r.dimensions.find((d) => d.dimensionId === state.tieDimensionId)?.average ?? Number.NEGATIVE_INFINITY
      group.sort((a, b) => dimScore(b) - dimScore(a))
      eligible.splice(i, group.length, ...group)
      // Same dimension values remain tied; do not decide by case ID.
      let lastDim: number | null = null; let lastRank = i + 1
      for (let j = 0; j < group.length; j++) {
        const d = dimScore(group[j]!)
        if (j && d !== lastDim) lastRank = i + j + 1
        group[j]!.rank = lastRank; lastDim = d
      }
    } else if (group.length > 1 && rubric.tieBreaker === 'owner-decides') {
      const order = round.tieOrders[group.map((r) => r.caseId).sort().join('|')]
      if (order && order.length === group.length && order.every((id) => group.some((r) => r.caseId === id))) {
        group.sort((a, b) => order.indexOf(a.caseId) - order.indexOf(b.caseId))
        eligible.splice(i, group.length, ...group)
        group.forEach((r, j) => { r.rank = i + j + 1 })
      } else group.forEach((r) => r.blockers.push('同分等待组织者裁定顺序'))
    }
    i = end
  }
  if (quota === undefined) eligible.forEach((r) => { r.selected = true })
  else {
    for (const row of eligible) row.selected = (row.rank ?? Number.POSITIVE_INFINITY) <= quota
    const boundary = eligible.filter((row) => {
      const rank = row.rank
      if (rank === null || rank > quota) return false
      return eligible.some((other) => other !== row && other.rank === rank) &&
        eligible.filter((other) => other.rank !== null && other.rank < rank).length < quota &&
        eligible.filter((other) => other.rank !== null && other.rank <= rank).length > quota
    })
    for (const row of boundary) { row.selected = null; row.blockers.push('同分跨越名额边界，需明确裁定') }
  }
  return rows.sort((a, b) => (a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY) || a.caseId.localeCompare(b.caseId))
}

/** Only safe projection enters a judge renderer / independent package. No roster, other votes, totals or real names. */
export type T07SafeCaseMaterial = { caseId: string; summary: string; documents: Array<{ id: string; title: string }>;
  /** Confirmed by T04/Main rule evaluation for this case and round. */
  naEligibleDimensionIds?: string[] }
export type T07JudgeView = {
  role: 'judge'; batchId: string; round: number; rubric: RubricSpec; finalized: boolean
  tasks: Array<{ assignmentId: string; caseId: string; blindLabel: string; status: T07Assignment['status'];
    summary: string; documents: Array<{ id: string; title: string }>; naEligibleDimensionIds: string[]; ownVote?: T07Vote }>
}
export type T07OrganizerView = {
  role: 'organizer'; state: T07State; ranking: T07RankingRow[]
}
export type T07View = T07JudgeView | T07OrganizerView
export function projectT07View(
  state: T07State, actor: T07Actor, safeMaterials: T07SafeCaseMaterial[] = [],
): T07View {
  const round = currentT07Round(state)
  if (actor.role === 'organizer') return { role: 'organizer', state, ranking: computeT07Ranking(state) }
  return {
    role: 'judge', batchId: state.batchId, round: round.number, rubric: state.rubric,
    finalized: Boolean(round.finalized),
    tasks: round.assignments.filter((a) => a.reviewerId === actor.actorId).map((a) => {
      const entry = requireCase(state, a.caseId)
      const safe = safeMaterials.find((m) => m.caseId === a.caseId)
      return {
        assignmentId: a.id, caseId: a.caseId, blindLabel: entry.blindLabel, status: a.status,
        summary: safe?.summary ?? '', documents: safe?.documents.map((d) => ({ id: d.id, title: d.title })) ?? [],
        naEligibleDimensionIds: safe?.naEligibleDimensionIds?.filter((id) => state.rubric.dimensions.some((d) => d.id === id && !!d.naWhen)) ?? [],
        ownVote: round.votes.find((v) => v.assignmentId === a.id),
      }
    }),
  }
}
