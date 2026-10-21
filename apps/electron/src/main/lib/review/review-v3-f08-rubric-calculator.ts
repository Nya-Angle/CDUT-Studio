/**
 * F08：评委量表的纯数值内核。F15 管理评委身份、分配、回避和定稿；
 * 此处只接受上游已核验的人工作答与 N/A 条件，绝不写入评分或案卷。
 * 所有加权、均值和百分制转换都用六位定点整数执行。
 */
import type { RubricSpec } from '@profer/shared'
import { decimalT04, formatT04 } from './review-v3-t04-rules-scoring'

const SCALE = 1000000n

export type F08RubricVote = {
  voteId: string
  /** 必须由可信人工评分服务核对，不能用模型建议冒充。 */
  humanConfirmed: boolean
  scores: Array<{ dimensionId: string; score: number | string | null; na: boolean }>
  /** T04/Main 已确认 naWhen 为 true 的维度 ID，不以 N/A 字面值推断。 */
  confirmedNaDimensionIds?: string[]
}
export type F08RubricCalculation = {
  status: 'ready' | 'awaiting-confirmation'
  total: string | null
  convertedTotal: string | null
  effectiveJudges: number
  dimensions: Array<{ dimensionId: string; average: string | null; voters: number }>
  perJudge: Array<{ voteId: string; total: string | null; excludedDimensions: string[]; blockers: string[] }>
  divergence: string | null
  blockers: string[]
}

/** 整数除法按绝对值 half-up 舍入；负值亦不依赖 JS 浮点。 */
function divideRounded(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new Error('F08_DIVISOR_INVALID')
  const negative = numerator < 0n
  const absolute = negative ? -numerator : numerator
  const value = (absolute + denominator / 2n) / denominator
  return negative ? -value : value
}

function parseNumber(input: string | number): bigint | null {
  try { return decimalT04(input) } catch { return null }
}

export function calculateF08Rubric(
  rubric: RubricSpec, votes: F08RubricVote[], expectedVoteIds: string[] = [],
): F08RubricCalculation {
  const precision = rubric.totalPrecision
  const dimensions = rubric.dimensions
  const configuredWeights = dimensions.map(d => parseNumber(d.weight))
  const validConfig = Number.isInteger(precision) && precision >= 0 && precision <= 6 &&
    dimensions.length > 0 && new Set(dimensions.map(d => d.id)).size === dimensions.length &&
    dimensions.every((d,i) => d.id.trim().length > 0 && Number.isFinite(d.min) &&
      Number.isFinite(d.max) && d.min <= d.max && configuredWeights[i] !== null && configuredWeights[i]! >= 0n) &&
    configuredWeights.some(w => w !== null && w > 0n) &&
    (rubric.minEffectiveJudges === undefined ||
      (Number.isSafeInteger(rubric.minEffectiveJudges) && rubric.minEffectiveJudges >= 1)) &&
    (!rubric.scaleConversion || (parseNumber(rubric.scaleConversion.fromMax) ?? 0n) > 0n &&
      (parseNumber(rubric.scaleConversion.toMax) ?? -1n) >= 0n)
  const rows = dimensions.map(d => ({ dimensionId: d.id, average: null as string | null, voters: 0 }))
  const empty = (blockers: string[]): F08RubricCalculation => ({ status:'awaiting-confirmation',
    total:null,convertedTotal:null,effectiveJudges:0,dimensions:rows,perJudge:[],divergence:null,blockers })
  if (!validConfig) return empty(['量表维度、权重、人数、精度或转换量尺配置无效'])
  if (new Set(votes.map(v=>v.voteId)).size !== votes.length ||
      new Set(expectedVoteIds).size !== expectedVoteIds.length ||
      votes.some(v=>!v.voteId.trim()) || expectedVoteIds.some(id=>!id.trim()))
    return empty(['评委评分唯一标识不合法或重复'])

  const blockers:string[] = []
  const expected = new Set(expectedVoteIds)
  if (expected.size && votes.some(v=>!expected.has(v.voteId)))
    return empty(['存在不属于当前分配的评分，不能参与汇总'])
  const missingIds = expectedVoteIds.filter(id=>!votes.some(v=>v.voteId===id))
  if (missingIds.length && rubric.missingStrategy==='block')
    blockers.push('存在未交评分：'+missingIds.join('、'))

  const validVoteTotals:bigint[] = []
  const valuesByDimension = new Map(dimensions.map(d=>[d.id,[] as bigint[]]))
  const perJudge:F08RubricCalculation['perJudge'] = []
  for (const vote of votes) {
    const problems:string[]=[]
    const excluded:string[]=[]
    const entries=new Map(vote.scores.map(s=>[s.dimensionId,s]))
    if (!vote.humanConfirmed) problems.push('尚未确认是真实人工评分')
    if (entries.size !== vote.scores.length || vote.scores.length !== dimensions.length ||
        vote.scores.some(s=>!dimensions.some(d=>d.id===s.dimensionId)))
      problems.push('维度重复、缺失或不属于当前量表')
    let weighted = 0n, weightBase = 0n
    const verifiedValues:Array<{id:string;value:bigint}>=[]
    for (const [i,d] of dimensions.entries()) {
      const entry=entries.get(d.id)
      if (!entry) continue
      if (entry.na) {
        if (entry.score !== null || !d.naWhen ||
            !vote.confirmedNaDimensionIds?.includes(d.id)) problems.push(d.id+' 的 N/A 未经条件核验')
        else if (rubric.naStrategy !== 'exclude' && rubric.naStrategy !== 'exclude-renormalize')
          problems.push(d.id+' 的 N/A 缺少可执行的分母策略')
        else excluded.push(d.id)
        continue
      }
      const score=entry.score === null ? null : parseNumber(entry.score)
      const min=parseNumber(d.min),max=parseNumber(d.max)
      if (score===null || min===null || max===null || score<min || score>max) {
        problems.push(d.id+' 的分数缺失或越界')
        continue
      }
      weighted+=score*configuredWeights[i]!
      weightBase+=configuredWeights[i]!
      verifiedValues.push({id:d.id,value:score})
    }
    if (weightBase===0n) problems.push('有效评分权重为零')
    if (problems.length) {
      blockers.push('评分 '+vote.voteId+'：'+problems.join('；'))
      perJudge.push({voteId:vote.voteId,total:null,excludedDimensions:excluded,blockers:problems})
      continue
    }
    const result=divideRounded(weighted,weightBase)
    validVoteTotals.push(result)
    verifiedValues.forEach(x=>valuesByDimension.get(x.id)!.push(x.value))
    perJudge.push({voteId:vote.voteId,total:formatT04(result,precision),excludedDimensions:excluded,blockers:[]})
  }
  const minJudges=rubric.minEffectiveJudges??1
  if(validVoteTotals.length<minJudges)
    blockers.push('有效评委 '+validVoteTotals.length+'/'+minJudges)
  for(const row of rows) {
    const values=valuesByDimension.get(row.dimensionId)!
    row.voters=values.length
    row.average=values.length ? formatT04(divideRounded(values.reduce((a,b)=>a+b,0n),BigInt(values.length)),precision) : null
  }
  const divergence=validVoteTotals.length>=2
    ? formatT04(validVoteTotals.reduce((a,b)=>a>b?a:b)-validVoteTotals.reduce((a,b)=>a<b?a:b),precision) : null
  if(divergence!==null && rubric.divergenceThreshold!==undefined) {
    const threshold=parseNumber(rubric.divergenceThreshold)
    if(threshold===null || threshold<0n) blockers.push('评委分歧阈值配置无效')
    else if(decimalT04(divergence)>threshold) blockers.push('评委分歧超过阈值，需独立复核')
  }
  if(blockers.length) return {status:'awaiting-confirmation',total:null,convertedTotal:null,
    effectiveJudges:validVoteTotals.length,dimensions:rows,perJudge,divergence,blockers}
  const average=divideRounded(validVoteTotals.reduce((a,b)=>a+b,0n),BigInt(validVoteTotals.length))
  const total=formatT04(average,precision)
  const convertedTotal=rubric.scaleConversion
    ? formatT04(divideRounded(average*decimalT04(rubric.scaleConversion.toMax),
      decimalT04(rubric.scaleConversion.fromMax)),precision) : null
  return {status:'ready',total,convertedTotal,effectiveJudges:validVoteTotals.length,
    dimensions:rows,perJudge,divergence,blockers:[]}
}
