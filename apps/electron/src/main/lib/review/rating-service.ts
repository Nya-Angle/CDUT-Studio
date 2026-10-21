/**
 * 独立评分服务（G06/G11，docs/design/review-agent/复查报告断点 3：重复计票/缺评/N-A 计算错误）
 *
 * - castRating：一个评委一次评分（同阶段同人重复 → INVALID_TRANSITION，唯一票）
 * - aggregateRatings：加权平均 + N-A 两种策略（block=存在 N/A 阻断；exclude=剔除维度并重归一化）
 *   + 缺评门控（effective judges < minEffectiveJudges 不能定稿/出平均分）
 * 评分经聚合命令事务落盘（ratings 数组），幂等键 = requestId
 */

import type { CaseAggregateV2, RatingEntryV2, RubricSpec } from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'

export type RatingEntry = RatingEntryV2

export interface AggregatedRatings {
  /** 每位评委按权重加权后的总分（缺失维度按策略处理） */
  perJudge: Array<{ actor: string; total: number; naDimensions: string[]; missingDimensions: string[] }>
  average: number | null
  effectiveJudges: number
  naCount: number
  missingCount: number
  /** 阻断原因（非空 = 不能定稿/公布平均） */
  blocked: string[]
}

/** 聚合评分（纯函数）：rubric 权重 + N-A 策略 + 缺评门控 */
export function aggregateRatings(ratings: RatingEntry[], rubric: RubricSpec, filterRound?: number): AggregatedRatings {
  // 轮次隔离：只汇总指定轮次（复查 §5.4：R1 的 j1 与 R2 的 j2 不得混算）
  const scoped = filterRound === undefined ? ratings : ratings.filter((rating) => rating.round === filterRound)
  const dimensions = rubric.dimensions
  const naStrategy = rubric.naStrategy ?? 'block'
  const blocked: string[] = []
  const perJudge: AggregatedRatings['perJudge'] = []
  let naCount = 0
  let missingCount = 0

  for (const rating of scoped) {
    const naDimensions: string[] = []
    const missingDimensions: string[] = []
    const invalidDimensions: string[] = []
    // 权重归一化基础：block 策略下 N/A 不重归一（直接阻断）；exclude 策略剔除后重归一
    let weightedSum = 0
    let weightBase = 0
    for (const dimension of dimensions) {
      const raw = rating.scores[dimension.id]
      if (raw === undefined) {
        missingDimensions.push(dimension.id)
        missingCount += 1
        continue
      }
      if (raw === 'N/A') {
        naDimensions.push(dimension.id)
        naCount += 1
        if (naStrategy === 'exclude' || naStrategy === 'exclude-renormalize') continue
        // block：N/A 视为不可评，阻断整体
        continue
      }
      if (!Number.isFinite(raw) || raw < dimension.min || raw > dimension.max) {
        invalidDimensions.push(dimension.id)
        continue
      }
      weightedSum += raw * dimension.weight
      weightBase += dimension.weight
      // block 策略：N/A 出现即阻断
      if (naStrategy === 'block' && naDimensions.length > 0) continue
    }
    if (naStrategy === 'block' && naDimensions.length > 0) {
      blocked.push(`评委 ${rating.actor} 存在 N/A 维度（${naDimensions.join('、')}），需人工裁定`)
      perJudge.push({ actor: rating.actor, total: Number.NaN, naDimensions, missingDimensions })
      continue
    }
    if (missingDimensions.length > 0 || invalidDimensions.length > 0) {
      if (missingDimensions.length) blocked.push(`评委 ${rating.actor} 缺评维度（${missingDimensions.join('、')}）`)
      if (invalidDimensions.length) blocked.push(`评委 ${rating.actor} 存在超出量表范围的维度（${invalidDimensions.join('、')}）`)
      perJudge.push({ actor: rating.actor, total: Number.NaN, naDimensions, missingDimensions })
      continue
    }
    const total = weightBase > 0 ? Number((weightedSum / weightBase).toFixed(rubric.totalPrecision ?? 2)) : Number.NaN
    perJudge.push({ actor: rating.actor, total, naDimensions, missingDimensions })
  }

  // 唯一票检查（同 actor 同阶段重复）
  const seen = new Set<string>()
  for (const rating of scoped) {
    const key = `${rating.stageId}:${rating.actor}:${rating.round}`
    if (seen.has(key)) blocked.push(`评委 ${rating.actor} 在 ${rating.stageId} 存在重复票（唯一票约束）`)
    seen.add(key)
  }

  const valid = perJudge.filter((entry) => Number.isFinite(entry.total))
  const minJudges = rubric.minEffectiveJudges ?? 1
  if (valid.length < minJudges) blocked.push(`有效评委 ${valid.length} 人，低于最低人数 ${minJudges}`)

  const average = blocked.length === 0 && valid.length > 0
    ? Number((valid.reduce((sum, entry) => sum + entry.total, 0) / valid.length).toFixed(rubric.totalPrecision ?? 2)) : null
  return { perJudge, average, effectiveJudges: valid.length, naCount, missingCount, blocked }
}

/** 提交评分（命令事务；唯一票约束在事务内校验） */
export function castRating(caseId: string, command: { requestId: string; actor: import('@profer/shared').Actor; expectedRevision: number; payload: { stageId: string; scores: Record<string, number | 'N/A'>; round?: number } }): Promise<unknown> {
  return submitCommand<{ stageId: string; scores: Record<string, number | 'N/A'>; round?: number }, RatingEntry>(caseId, { ...command, type: 'CastRating' }, (aggregate, payload) => {
    // 唯一票键含轮次（复查 §5.4：重开后同人有合法新票；同轮次重复才拒绝）
  const round = payload.round ?? 1
  const duplicate = aggregate.ratings?.some((rating) => rating.stageId === payload.stageId && rating.actor === command.actor.actorId && rating.round === round)
    if (duplicate) throw new CommandValidationError('INVALID_TRANSITION', '该评委在此阶段已提交过评分（唯一票）')
    for (const value of Object.values(payload.scores)) {
      if (value === 'N/A') continue
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new CommandValidationError('VALIDATION_FAILED', '评分必须是有限数值或 N/A')
    }
    return {
      summary: `评委 ${command.actor.actorId} 提交评分（${payload.stageId}）`,
      mutate: (draft: CaseAggregateV2) => {
        const entry: RatingEntry = { id: `rate-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, caseId: draft.caseV2.id, stageId: payload.stageId, actor: command.actor.actorId, scores: payload.scores, at: new Date().toISOString(), round: payload.round ?? 1 }
        draft.ratings = [...(draft.ratings ?? []), entry]
        return entry
      },
    }
  })
}
