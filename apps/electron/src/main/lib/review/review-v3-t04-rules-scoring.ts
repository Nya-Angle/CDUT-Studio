/**
 * T04: deterministic rule evaluation for one immutable V3 Plan.
 * This is a pure proposal adapter: Main remains the only Case/Run writer.
 * Numeric inputs must be human-confirmed facts, not model-suggested scores.
 */
import type { CanonicalPlan, CheckResult, ConditionAST, PlanBinding, RuleSpec, SourceRef, TriState } from '@profer/shared'
import { evaluateCondition } from './deterministic-engine'

export type T04Value = {
  value: string | number | boolean | null
  confirmed: boolean
  unit?: string
  sourceRefIds?: string[]
}
export type T04Item = { id: string; fields: Record<string, T04Value> }
export type T04Status = 'compliant' | 'non-compliant' | 'not-applicable' | 'awaiting-confirmation' | 'awaiting-supplement'
export type T04Operation =
  | { kind: 'group-score'; calculation: NonNullable<RuleSpec['calculation']>; precision?: number }
  | { kind: 'weighted-sum'; terms: Array<{ field: string; weight: string }>; precision?: number }
  | { kind: 'amount-cap'; amountField: string; currencyField: string; cap: string; currency: string; precision?: number }
  | { kind: 'date-range'; field: string; from?: string; until?: string }
  | { kind: 'value-limit'; field: string; maximum: string; unit?: string }
  | { kind: 'value-minimum'; field: string; minimum: string; unit?: string }
  | { kind: 'material-min-count'; field: string; minimum: number }
  | { kind: 'value-equals'; field: string; expected: string; unit?: string }
  | { kind: 'mutual-exclusion'; groupField: string; selectionField?: string }
  | { kind: 'level-mapping'; field: string; scoreField: string; levels: Record<string, string> }
  | { kind: 'unresolved'; reason: string }
export type T04PolicyClaim = { key: string; rule: RuleSpec; operation: T04Operation }
export type T04PolicyDecision = {
  key: string
  selectedRuleId: string
  /** Required when multiple policy versions reuse the same local rule id. */
  selectedPolicyVersionId?: string
  confirmedBy: string
  reason: string
}
export type T04ResolvedClaims = {
  selected: T04PolicyClaim[]
  blocked: Array<{ key: string; ruleIds: string[]; reason: string }>
  excluded: Array<{ key: string; ruleId: string; policyVersionId: string; selectedRuleId: string; selectedPolicyVersionId: string }>
}
export interface T04Outcome {
  status: T04Status
  result: string | null
  reason: string
  detailLines: string[]
  sourceRefIds: string[]
  missingFields: string[]
  allocation?: Array<{ itemId: string; counted: string; reason: string }>
  /** 确认的每组独立封顶后再合计展示值。 */
  groupResults?: Array<{ groupKey: string; result: string; allocation: NonNullable<T04Outcome['allocation']> }>
  /** For incomplete currency sets these are estimates for the known subset only. */
  knownSubtotal?: string
  excess?: string
}
export type T04PlanCheck = {
  binding: PlanBinding
  rule: RuleSpec
  operation: T04Operation
  items: T04Item[]
  policyClaimKey?: string
  /** The caller's explicit evaluation date; never the machine clock. */
  asOfDate?: string
}
export type T04PlanProposal = {
  planFingerprint: string
  checkKey: string
  targetKey: string
  objectKey: string
  ruleId: string
  policyVersionId: string
  sourceVersionIds: string[]
  outcome: T04Outcome
}

const SCALE = 1000000n // up to six decimal places; no binary float aggregation
const pow10 = (x: number): bigint => 10n ** BigInt(x)
export function decimalT04(input: string | number): bigint {
  const raw = String(input)
  if (!/^-?\d+(?:\.\d{1,6})?$/.test(raw)) throw new Error('T04_DECIMAL_INVALID: ' + raw)
  const negative = raw.startsWith('-')
  const unsigned = negative ? raw.slice(1) : raw
  const [whole, fraction = ''] = unsigned.split('.')
  const n = BigInt(whole!) * SCALE + BigInt(fraction.padEnd(6, '0'))
  return negative ? -n : n
}
export function formatT04(value: bigint, precision = 2, mode: 'half-up' | 'half-even' | 'truncate' = 'half-up'): string {
  if (!Number.isInteger(precision) || precision < 0 || precision > 6) throw new Error('T04_PRECISION_INVALID')
  const divisor = pow10(6 - precision)
  const sign = value < 0n ? '-' : ''
  const abs = value < 0n ? -value : value
  let result = abs / divisor
  const remainder = abs % divisor
  if (mode !== 'truncate' &&
      (remainder * 2n > divisor || (remainder * 2n === divisor && (mode === 'half-up' || result % 2n === 1n)))) result++
  const factor = pow10(precision)
  const whole = result / factor
  const fractional = precision ? '.' + String(result % factor).padStart(precision, '0') : ''
  return (result === 0n ? '' : sign) + String(whole) + fractional
}
const unique = (values: string[]): string[] => [...new Set(values)].sort()
const field = (item: T04Item, key: string): T04Value | undefined => item.fields[key]
const known = (entry: T04Value | undefined): entry is T04Value & {value: string | number | boolean} =>
  !!entry && entry.confirmed && entry.value !== null && entry.value !== ''
const sources = (items: T04Item[], rule: RuleSpec): string[] =>
  unique([...rule.sourceRefIds, ...items.flatMap(item => Object.values(item.fields).flatMap(x => x.sourceRefIds ?? []))])
const pending = (reason: string, items: T04Item[], rule: RuleSpec, missingFields: string[] = []): T04Outcome =>
  ({status: 'awaiting-confirmation', result: null, reason, detailLines: [reason], sourceRefIds: sources(items, rule), missingFields: unique(missingFields)})
const complete = (status: T04Status, result: string | null, reason: string, lines: string[], items: T04Item[], rule: RuleSpec): T04Outcome =>
  ({status, result, reason, detailLines: lines, sourceRefIds: sources(items, rule), missingFields: []})

function strictDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const year = Number(value.slice(0, 4)), month = Number(value.slice(5, 7)), day = Number(value.slice(8, 10))
  if (year < 100 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const d = new Date(0)
  d.setUTCFullYear(year, month - 1, day)
  return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day
}

/** Preserve AND/OR/NOT three-value behavior, including exact date-only comparisons. */
export function conditionT04(ast: ConditionAST, item: T04Item): TriState {
  if ('all' in ast) {
    const results = ast.all.map(x => conditionT04(x, item))
    return results.includes('false') ? 'false' : results.includes('unknown') ? 'unknown' : 'true'
  }
  if ('any' in ast) {
    const results = ast.any.map(x => conditionT04(x, item))
    return results.includes('true') ? 'true' : results.includes('unknown') ? 'unknown' : 'false'
  }
  if ('not' in ast) {
    const x = conditionT04(ast.not, item)
    return x === 'unknown' ? 'unknown' : x === 'true' ? 'false' : 'true'
  }
  const key = 'field' in ast ? ast.field : ast.fact
  const x = field(item, key)
  if (!x || !x.confirmed) return 'unknown'
  if (ast.op === 'exists') return x.value === null || x.value === '' ? 'false' : 'true'
  if (!known(x)) return 'unknown'
  if (typeof x.value === 'string' && typeof ast.value === 'string' &&
      /^\d{4}-\d{2}-\d{2}/.test(x.value)) {
    if (!strictDate(x.value) || !strictDate(ast.value)) return 'unknown'
    if (ast.op === 'gt') return x.value > ast.value ? 'true' : 'false'
    if (ast.op === 'gte') return x.value >= ast.value ? 'true' : 'false'
    if (ast.op === 'lt') return x.value < ast.value ? 'true' : 'false'
    if (ast.op === 'lte') return x.value <= ast.value ? 'true' : 'false'
  }
  return evaluateCondition(ast, ref => {
    const value = field(item, ref.field ?? ref.fact ?? '')
    return {known: known(value), value: value?.value}
  })
}

/** An authored, confirmed RuleSpec can be compiled without inventing a new shared RuleSpec variant. */
export function compileT04Operation(rule: RuleSpec): T04Operation {
  if (rule.calculation) return {kind: 'group-score', calculation: rule.calculation}
  const x = rule.workspaceConstraint
  if (!x) return {kind: 'unresolved', reason: 'RuleSpec 未提供可执行约束；when 只表示适用性'}
  if (x.kind === 'max-score' && typeof x.value === 'number')
    return {kind: 'group-score', calculation: {valueFrom: 'declaredScore', aggregate: 'sum', cap: {value: String(x.value), unit: 'point'}, allocation: 'score-desc-then-subject-id'}}
  if (x.kind === 'amount-limit' && typeof x.value === 'number')
    return {kind: 'value-limit', field: 'amount', maximum: String(x.value)}
  if (x.kind === 'date-range' && (x.dateFrom || x.dateTo))
    return {kind: 'date-range', field: 'activityDate', ...(x.dateFrom ? {from: x.dateFrom} : {}), ...(x.dateTo ? {until: x.dateTo} : {})}
  if (x.kind === 'score-value' && typeof x.value === 'number' && x.appliesWhen)
    return {kind: 'value-equals', field: 'declaredScore', expected: String(x.value), unit: 'point'}
  if (x.kind === 'mutual-exclusion' && x.exclusionGroup)
    return {kind: 'mutual-exclusion', groupField: x.exclusionGroup}
  if (x.kind === 'level-mapping' && x.levels && Object.keys(x.levels).length)
    return {kind: 'level-mapping', field: 'level', scoreField: 'declaredScore', levels: Object.fromEntries(Object.entries(x.levels).map(([key,value]) => [key, String(value)]))}
  return {kind: 'unresolved', reason: '未实现的结构化约束需人工确认，不能编译为通过'}
}

/**
 * Same logical policy claim can be supplied by multiple published sources.
 * Different operator or numeric cap must be explicitly resolved by a human,
 * never by iteration order or the latest policy version.
 */
export function resolveT04PolicyClaims(claims: T04PolicyClaim[], decisions: T04PolicyDecision[] = []): T04ResolvedClaims {
  const groups = new Map<string, T04PolicyClaim[]>()
  for (const claim of claims) groups.set(claim.key, [...(groups.get(claim.key) ?? []), claim])
  const selected: T04PolicyClaim[] = [], blocked: T04ResolvedClaims['blocked'] = [], excluded: T04ResolvedClaims['excluded'] = []
  for (const [key, group] of groups) {
    const byRule = new Map(group.map(claim => [claim.rule.policyVersionId + '::' + claim.rule.id, claim]))
    const ordered = [...byRule.values()].sort((a,b) => (a.rule.policyVersionId + '::' + a.rule.id).localeCompare(b.rule.policyVersionId + '::' + b.rule.id))
    const uniqueDefinitions = unique(ordered.map(x => JSON.stringify({operation:x.operation, when:x.rule.when, exceptions:x.rule.exceptions ?? []})))
    const matching = (decision:T04PolicyDecision):T04PolicyClaim[] =>
      ordered.filter(x=>x.rule.id===decision.selectedRuleId &&
        (decision.selectedPolicyVersionId===undefined||x.rule.policyVersionId===decision.selectedPolicyVersionId))
    const decision = decisions.find(x => x.key === key && x.confirmedBy.trim() && x.reason.trim() && matching(x).length===1)
    if (uniqueDefinitions.length > 1 && !decision) {
      blocked.push({key, ruleIds: ordered.map(x => x.rule.policyVersionId+'::'+x.rule.id), reason: '多依据同一约束不一致，缺少具名优先关系确认'})
      continue
    }
    const chosen = decision ? matching(decision)[0]! : ordered[0]!
    selected.push(chosen)
    for (const x of ordered) if (x !== chosen) excluded.push({
      key, ruleId:x.rule.id, policyVersionId:x.rule.policyVersionId,
      selectedRuleId:chosen.rule.id, selectedPolicyVersionId:chosen.rule.policyVersionId,
    })
  }
  return {selected, blocked, excluded}
}

/** Per-item eligibility uses the existing RuleSpec condition; unknown cannot disappear. */
function eligible(rule: RuleSpec, items: T04Item[]): {accepted:T04Item[]; missing:string[]; excluded:string[]} {
  const accepted:T04Item[] = [], missing:string[] = [], excluded:string[] = []
  for (const item of items) {
    const ok = conditionT04(rule.when, item)
    const exceptions = (rule.exceptions ?? []).map(x => conditionT04(x.when, item))
    if (ok === 'unknown' || exceptions.includes('unknown')) {missing.push(item.id + ':when/exception'); continue}
    if (ok === 'false' || exceptions.includes('true')) {excluded.push(item.id); continue}
    accepted.push(item)
  }
  return {accepted,missing,excluded}
}

/** Group only on real, confirmed field keys; never merge unknown keys into one group. */
export function partitionT04Items(rule:RuleSpec,items:T04Item[]):{
  groups:Array<{key:string;items:T04Item[]}>;
  unknownItems:string[];
} {
  const grouped=new Map<string,T04Item[]>(),unknownItems:string[]=[]
  const keys=rule.groupBy??[]
  for(const item of items) {
    const values:string[]=[]
    let missing=false
    for(const key of keys) {
      const v=field(item,key)
      if(!known(v)){missing=true;break}
      values.push(String(v.value))
    }
    if(missing){unknownItems.push(item.id);continue}
    const key=keys.length?JSON.stringify(values):'all'
    grouped.set(key,[...(grouped.get(key)??[]),item])
  }
  return {groups:[...grouped].sort(([a],[b])=>a.localeCompare(b))
    .map(([key,group])=>({key,items:group.sort((a,b)=>a.id.localeCompare(b.id))})),
    unknownItems:unknownItems.sort()}
}

function exclusive(rule:RuleSpec,op:Extract<T04Operation,{kind:'mutual-exclusion'}>,items:T04Item[]):T04Outcome {
  const groups=new Map<string,string[]>(),missing:string[]=[]
  for(const item of items) {
    const x=field(item,op.groupField)
    if(!known(x)) {missing.push(item.id+':'+op.groupField);continue}
    if(op.selectionField) {
      const flag=field(item,op.selectionField)
      if(!known(flag)||typeof flag.value!=='boolean'){missing.push(item.id+':'+op.selectionField);continue}
      if(!flag.value)continue
    }
    const key=String(x.value)
    groups.set(key,[...(groups.get(key)??[]),item.id])
  }
  if(missing.length)return pending('互斥组归属或选择状态未确认',items,rule,missing)
  const conflicts=[...groups].filter(([,ids])=>ids.length>1)
  const details=[...groups].sort(([a],[b])=>a.localeCompare(b))
    .map(([key,ids])=>key+': '+ids.sort().join(','))
  return complete(conflicts.length?'non-compliant':'compliant',null,
    conflicts.length?'同一互斥组出现多项被选择，必须处理':'互斥检查通过',details,items,rule)
}

function groupScore(rule: RuleSpec, op: Extract<T04Operation,{kind:'group-score'}>, items:T04Item[]):T04Outcome {
  const c=op.calculation, precision=op.precision ?? 2
  if (!Number.isInteger(precision) || precision < 0 || precision > 6)
    return pending('计分保留位数必须是 0–6 的整数',items,rule)
  let cap:bigint | undefined
  try { if (c.cap) {cap=decimalT04(c.cap.value); if (cap < 0n) throw Error('negative cap')} }
  catch {return pending('规则上限不是可用的非负十进制值',items,rule)}
  type Candidate = { item:T04Item; value:bigint; key:string }
  const entries:Candidate[] = [], missing:string[]=[]
  let commonUnit:string | undefined
  for (const item of items) {
    const value=field(item,c.valueFrom)
    if (!known(value)) {missing.push(item.id+':'+c.valueFrom);continue}
    if (value.unit && c.cap?.unit && value.unit !== c.cap.unit) {missing.push(item.id+':unit');continue}
    if (value.unit && commonUnit && value.unit !== commonUnit) {missing.push(item.id+':unit');continue}
    if (value.unit) commonUnit=value.unit
    const keys:string[]=[]
    for (const k of c.deduplicateBy ?? []) {
      const x=field(item,k)
      if (!known(x)) missing.push(item.id+':'+k)
      else keys.push(String(x.value))
    }
    try {
      if (typeof value.value !== 'string' && typeof value.value !== 'number') throw Error('not decimal')
      const n=decimalT04(value.value)
      if (n < 0n) throw Error('negative')
      entries.push({item,value:n,key:JSON.stringify(keys)})
    } catch {missing.push(item.id+':'+c.valueFrom)}
  }
  if (missing.length) return pending('计分数据/去重键/单位未确认，不将未知视为 0',items,rule,missing)
  if (!entries.length) return complete('not-applicable',null,'没有适用的计分事项',[],items,rule)
  const kept:Candidate[]=[], dropped:Candidate[]=[]
  if (c.deduplicateBy?.length) {
    const byKey=new Map<string,Candidate>()
    for (const entry of entries) {
      const old=byKey.get(entry.key)
      if (!old || entry.value>old.value || (entry.value===old.value && entry.item.id<old.item.id)) byKey.set(entry.key,entry)
    }
    for (const entry of entries) (byKey.get(entry.key)===entry ? kept : dropped).push(entry)
  } else kept.push(...entries)
  kept.sort((a,b)=>a.value===b.value?a.item.id.localeCompare(b.item.id):(a.value>b.value?-1:1))
  if (c.select==='single' && kept.length!==1)
    return pending('single 规则出现多个有效候选，不能擅自计分',items,rule)
  if (c.select==='highest-eligible-score' && !c.deduplicateBy?.length) dropped.push(...kept.splice(1))
  if (c.aggregate==='max' && kept.length>1) dropped.push(...kept.splice(1))
  const raw=kept.reduce((sum,x)=>sum+x.value,0n)
  const total=cap!==undefined && raw>cap?cap:raw
  let remaining=total
  const exact:Array<{entry:Candidate;counted:bigint}>=[]
  for (const entry of kept) {
    const counted=entry.value<remaining?entry.value:remaining
    remaining-=counted
    exact.push({entry,counted})
  }
  // 小数精度以下的剩余计分单位按最大余数分配，同余数再按分值与 ID 排序。
  // 保证展示明细之和严格等于展示总分，避免各行独立舍入丢失尾差。
  const displayUnit=pow10(6-precision)
  const totalUnits=decimalT04(formatT04(total,precision))/displayUnit
  const units=exact.map(x=>x.counted/displayUnit)
  let extra=totalUnits-units.reduce((sum,x)=>sum+x,0n)
  const remainders=exact.map((x,i)=>({i,remainder:x.counted%displayUnit}))
    .sort((a,b)=>a.remainder===b.remainder
      ? (exact[a.i]!.entry.value===exact[b.i]!.entry.value
        ? exact[a.i]!.entry.item.id.localeCompare(exact[b.i]!.entry.item.id)
        : exact[a.i]!.entry.value>exact[b.i]!.entry.value?-1:1)
      : a.remainder>b.remainder?-1:1)
  for (const x of remainders) {if (extra===0n) break;units[x.i]=units[x.i]!+1n;extra--}
  const allocation:T04Outcome['allocation']=exact.map((x,i)=>({
    itemId:x.entry.item.id,counted:formatT04(units[i]!*displayUnit,precision),
    reason:x.counted===x.entry.value?'全额计入':'组上限截断',
  }))
  for (const entry of dropped) allocation.push({itemId:entry.item.id,counted:formatT04(0n,precision),reason:'同键择高/择单项未计入'})
  allocation.sort((a,b)=>a.itemId.localeCompare(b.itemId))
  const detail=['规则 '+rule.id+'，政策版本 '+rule.policyVersionId,'候选原值 '+formatT04(raw,precision),'组计入 '+formatT04(total,precision),
    ...allocation.map(x=>x.itemId+': '+x.counted+'（'+x.reason+'）')]
  return {...complete('compliant',formatT04(total,precision),'规则组计分已完成',detail,items,rule),allocation}
}

function weighted(rule:RuleSpec,op:Extract<T04Operation,{kind:'weighted-sum'}>,items:T04Item[]):T04Outcome {
  if (items.length!==1) return pending('权重公式要求一个确定的目标对象',items,rule)
  const item=items[0]!, missing:string[]=[]
  let weights=0n,score=0n
  const detail:string[]=[]
  try {
    for(const term of op.terms) {
      const x=field(item,term.field)
      if (!known(x)|| (typeof x.value!=='number'&&typeof x.value!=='string')) {missing.push(term.field);continue}
      const w=decimalT04(term.weight),v=decimalT04(x.value)
      if(w<0n||v<0n)throw Error('weight/value negative')
      weights+=w
      score+=v*w
      detail.push(term.field+'='+String(x.value)+' × '+term.weight)
    }
    if(missing.length)return pending('权重项缺失或未确认，不把缺失视为零',items,rule,missing)
    if(weights!==SCALE) return pending('权重总和不为 1，需确认模板配置',items,rule)
    // exact half-up rounding at 6 decimal places before final display
    const scaled=(score+SCALE/2n)/SCALE
    return complete('compliant',formatT04(scaled,op.precision??2),'加权计算完成',detail,items,rule)
  } catch {return pending('权重/分值非法，需人工确认',items,rule)}
}

function amount(rule:RuleSpec,op:Extract<T04Operation,{kind:'amount-cap'}>,items:T04Item[]):T04Outcome {
  let cap:bigint
  try {cap=decimalT04(op.cap);if(cap<0n)throw Error('negative')}catch{return pending('货币限额配置无效',items,rule)}
  const precision=op.precision??2,missing:string[]=[]
  let sum=0n
  const detail:string[]=[]
  for(const item of items) {
    const x=field(item,op.amountField),currency=field(item,op.currencyField)
    if(!known(x)||!known(currency)||currency.value!==op.currency|| (x.unit&&x.unit!==op.currency)) {
      missing.push(item.id+':amount/currency')
      continue
    }
    try {
      if(typeof x.value!=='string'&&typeof x.value!=='number')throw Error('not number')
      const n=decimalT04(x.value)
      if(n<0n)throw Error('negative')
      sum+=n
      detail.push(item.id+': '+formatT04(n,precision)+' '+op.currency)
    } catch {missing.push(item.id+':'+op.amountField)}
  }
  const counted=sum>cap?cap:sum,excess=sum>cap?sum-cap:0n
  const knownSubtotal=formatT04(sum,precision)
  const result=formatT04(counted,precision)
  const base=complete(missing.length?'awaiting-confirmation':'compliant',missing.length?null:result,
    missing.length?'仅已确认同币种小计，含待确认金额':'同币种限额计算完成',
    [...detail,'已知小计 '+knownSubtotal,'上限 '+formatT04(cap,precision),'已知超额 '+formatT04(excess,precision)],items,rule)
  return {...base,missingFields:unique(missing),knownSubtotal,excess:formatT04(excess,precision)}
}

function dateRange(rule:RuleSpec,op:Extract<T04Operation,{kind:'date-range'}>,items:T04Item[]):T04Outcome {
  if((op.from&&!strictDate(op.from))||(op.until&&!strictDate(op.until)))
    return pending('规则日期边界非法或含不明确时区',items,rule)
  const missing:string[]=[],failed:string[]=[],lines:string[]=[]
  for(const item of items) {
    const x=field(item,op.field)
    if(!known(x)||typeof x.value!=='string'||!strictDate(x.value)) {missing.push(item.id+':'+op.field);continue}
    const pass=(!op.from||x.value>=op.from)&&(!op.until||x.value<=op.until)
    lines.push(item.id+': '+x.value+' → '+(pass?'范围内':'范围外'))
    if(!pass)failed.push(item.id)
  }
  if(missing.length)return pending('部分日期未确认或非无时区纯日期',items,rule,missing)
  return complete(failed.length?'non-compliant':'compliant',null,
    failed.length?'超出日期范围: '+failed.join(','):'全部日期在含首尾边界的范围内',lines,items,rule)
}

function valueLimit(rule:RuleSpec,op:Extract<T04Operation,{kind:'value-limit'}>,items:T04Item[]):T04Outcome {
  let maximum:bigint
  try {maximum=decimalT04(op.maximum)}catch{return pending('数值上限配置不合法',items,rule)}
  const failed:string[]=[],missing:string[]=[],lines:string[]=[]
  for(const item of items) {
    const v=field(item,op.field)
    if(!known(v)||(op.unit&&v.unit!==op.unit)) {missing.push(item.id+':'+op.field);continue}
    try {
      if(typeof v.value!=='string'&&typeof v.value!=='number')throw Error('non-decimal')
      const value=decimalT04(v.value)
      lines.push(item.id+': '+String(v.value)+' <= '+op.maximum)
      if(value>maximum)failed.push(item.id)
    }catch {missing.push(item.id+':'+op.field)}
  }
  if(missing.length)return pending('比较数值/单位未知',items,rule,missing)
  return complete(failed.length?'non-compliant':'compliant',null,failed.length?'超出上限: '+failed.join(','):'全部值符合上限',lines,items,rule)
}

/** 与上限比较相对称的下限操作；由具名已确认的类型化规则接入，不猜自然语言。 */
function valueMinimum(rule:RuleSpec,op:Extract<T04Operation,{kind:'value-minimum'}>,items:T04Item[]):T04Outcome {
  let minimum:bigint
  try {minimum=decimalT04(op.minimum)}catch{return pending('数值下限配置不合法',items,rule)}
  const failed:string[]=[],missing:string[]=[],lines:string[]=[]
  for(const item of items) {
    const v=field(item,op.field)
    if(!known(v)||(op.unit&&v.unit&&v.unit!==op.unit)) {missing.push(item.id+':'+op.field);continue}
    try {
      if(typeof v.value!=='string'&&typeof v.value!=='number')throw Error('non-decimal')
      const value=decimalT04(v.value)
      lines.push(item.id+': '+String(v.value)+' >= '+op.minimum)
      if(value<minimum)failed.push(item.id)
    }catch {missing.push(item.id+':'+op.field)}
  }
  if(missing.length)return pending('比较数值/单位未知',items,rule,missing)
  return complete(failed.length?'non-compliant':'compliant',null,
    failed.length?'低于下限: '+failed.join(','):'全部值达到下限',lines,items,rule)
}

/** Counts originate from Main-verified active DocumentVersions, not freeform text. */
function materialMinCount(rule:RuleSpec,op:Extract<T04Operation,{kind:'material-min-count'}>,items:T04Item[]):T04Outcome {
  if(!Number.isSafeInteger(op.minimum)||op.minimum<0) return pending('材料数量规则非法',items,rule)
  const missing:string[]=[],insufficient:string[]=[],lines:string[]=[]
  for(const item of items) {
    const value=field(item,op.field)
    if(!known(value) || typeof value.value!=='number' ||
       !Number.isSafeInteger(value.value) || value.value<0) {
      missing.push(item.id+':'+op.field)
      continue
    }
    lines.push(item.id+': '+value.value+' / 至少 '+op.minimum+' 份有效材料')
    if(value.value<op.minimum)insufficient.push(item.id)
  }
  if(missing.length)return pending('材料登记状态尚未确认，不能假定零份或齐全',items,rule,missing)
  return complete(insufficient.length?'awaiting-supplement':'compliant',null,
    insufficient.length?'缺少必交材料: '+insufficient.join(','):'已登记有效材料达到最低数量',
    lines,items,rule)
}

function equalsValue(rule:RuleSpec,op:Extract<T04Operation,{kind:'value-equals'}>,items:T04Item[]):T04Outcome {
  let expected:bigint
  try {expected=decimalT04(op.expected)}catch{return pending('固定分值配置不合法',items,rule)}
  const failed:string[]=[],missing:string[]=[],detail:string[]=[]
  for(const item of items) {
    const v=field(item,op.field)
    if(!known(v)||(op.unit&&v.unit&&v.unit!==op.unit)) {missing.push(item.id+':'+op.field);continue}
    try {
      if(typeof v.value!=='string'&&typeof v.value!=='number')throw Error('not numeric')
      const value=decimalT04(v.value)
      detail.push(item.id+': '+String(v.value)+' == '+op.expected)
      if(value!==expected)failed.push(item.id)
    }catch {missing.push(item.id+':'+op.field)}
  }
  if(missing.length)return pending('固定分值未知',items,rule,missing)
  return complete(failed.length?'non-compliant':'compliant',null,failed.length?'固定分值不一致':'固定分值匹配',detail,items,rule)
}

function mapping(rule:RuleSpec,op:Extract<T04Operation,{kind:'level-mapping'}>,items:T04Item[]):T04Outcome {
  const missing:string[]=[],lines:string[]=[],failed:string[]=[]
  for(const item of items) {
    const level=field(item,op.field),score=field(item,op.scoreField)
    if(!known(level)||!known(score)) {missing.push(item.id+':level/score');continue}
    try {
      const expected=op.levels[String(level.value)]
      if(expected===undefined)throw Error('no level')
      const good=decimalT04(expected)===decimalT04(String(score.value))
      lines.push(item.id+': '+String(level.value)+' 应为 '+expected+'，实为 '+String(score.value))
      if(!good)failed.push(item.id)
    }catch {missing.push(item.id+':level/score')}
  }
  if(missing.length)return pending('等级映射未知，待核对',items,rule,missing)
  return complete(failed.length?'non-compliant':'compliant',null,failed.length?'等级分值不一致':'等级分值一致',lines,items,rule)
}

/** Evaluate one confirmed rule. Applicability and exceptions precede arithmetic. */
export function evaluateT04Rule(rule:RuleSpec,operation:T04Operation,items:T04Item[]):T04Outcome {
  if(rule.confirmation!=='confirmed')return pending('政策规则尚未确认或存在冲突：'+rule.id,items,rule)
  if(rule.execution!=='deterministic')return pending('该规则不是确定性执行类型：'+rule.id,items,rule)
  if(operation.kind==='unresolved')return pending(operation.reason,items,rule)
  const split=eligible(rule,items)
  if(split.missing.length)return pending('适用条件/例外有未知事实，不能静默排除',items,rule,split.missing)
  if(split.accepted.length===0)return complete('not-applicable',null,'所有对象均不适用或命中例外',split.excluded,items,rule)
  if(operation.kind==='group-score' && rule.groupBy?.length) {
    const grouped=partitionT04Items(rule,split.accepted)
    if(grouped.unknownItems.length) return pending('分组键尚未确认，不能合并不同对象的计分上限',
      split.accepted,rule,grouped.unknownItems.map(id=>id+':groupBy'))
    const evaluated=grouped.groups.map(group=>({key:group.key,outcome:groupScore(rule,operation,group.items)}))
    const incomplete=evaluated.find(x=>x.outcome.status!=='compliant'||x.outcome.result===null)
    if(incomplete) return pending('分组 '+incomplete.key+' 计算未完成：'+incomplete.outcome.reason,
      split.accepted,rule,incomplete.outcome.missingFields)
    const precision=operation.precision??2
    const total=evaluated.reduce((sum,x)=>sum+decimalT04(x.outcome.result!),0n)
    const details=evaluated.flatMap(x=>['组 '+x.key+'，计入 '+x.outcome.result,...x.outcome.detailLines])
    return {...complete('compliant',formatT04(total,precision),'按确认的分组分别封顶并汇总',details,split.accepted,rule),
      allocation:evaluated.flatMap(x=>x.outcome.allocation??[]),
      groupResults:evaluated.map(x=>({groupKey:x.key,result:x.outcome.result!,allocation:x.outcome.allocation??[]}))}
  }
  switch(operation.kind) {
    case 'group-score':return groupScore(rule,operation,split.accepted)
    case 'weighted-sum':return weighted(rule,operation,split.accepted)
    case 'amount-cap':return amount(rule,operation,split.accepted)
    case 'date-range':return dateRange(rule,operation,split.accepted)
    case 'value-limit':return valueLimit(rule,operation,split.accepted)
    case 'value-minimum':return valueMinimum(rule,operation,split.accepted)
    case 'material-min-count':return materialMinCount(rule,operation,split.accepted)
    case 'value-equals':return equalsValue(rule,operation,split.accepted)
    case 'mutual-exclusion':return exclusive(rule,operation,split.accepted)
    case 'level-mapping':return mapping(rule,operation,split.accepted)
  }
}

/**
 * Evaluate ONLY bindings already present in the immutable CanonicalPlan.
 * Binding→rule/inputs mapping is supplied by the authoritative caller;
 * this code neither creates a Plan nor assumes a rule id from checkKey.
 * SourceVersionIds and target membership are verified by C Main on consumption.
 */
export function evaluateT04Plan(
  plan:CanonicalPlan,checks:T04PlanCheck[],decisions:T04PolicyDecision[]=[],
):T04PlanProposal[] {
  const identity=(x:PlanBinding):string => JSON.stringify([x.checkKey,x.targetKey,x.objectKey,x.subjectId])
  const byKey=new Map(checks.map(c=>[identity(c.binding),c]))
  const allowed=new Set(plan.bindings.map(identity))
  if(byKey.size!==checks.length||allowed.size!==plan.bindings.length||byKey.size!==allowed.size)
    throw new Error('T04_BINDING_SET_MISMATCH')
  const claims=checks.filter(c=>c.policyClaimKey).map(c=>({key:c.policyClaimKey!,rule:c.rule,operation:c.operation}))
  const resolution=resolveT04PolicyClaims(claims,decisions)
  const blocked=new Set(resolution.blocked.map(x=>x.key))
  const excluded=new Set(resolution.excluded.map(x=>x.policyVersionId+'::'+x.ruleId))
  return plan.bindings.map(binding=>{
    const check=byKey.get(identity(binding))
    if (!check || !allowed.has(identity(binding))) throw new Error('T04_CHECK_BINDING_MISSING: '+binding.checkKey)
    if(check.binding.targetKey!==binding.targetKey||check.binding.objectKey!==binding.objectKey||
       check.binding.subjectId!==binding.subjectId)throw new Error('T04_BINDING_TARGET_MISMATCH: '+binding.checkKey)
    let outcome:T04Outcome
    if(binding.applicability==='unknown')outcome=pending('Plan 已将适用性标为 unknown',check.items,check.rule)
    else if(binding.applicability==='not-applicable')
      outcome=complete('not-applicable',null,'Plan 已确认不适用',[],check.items,check.rule)
    else if(check.policyClaimKey&&blocked.has(check.policyClaimKey))
      outcome=pending('多政策限额冲突，须具名确定优先规则',check.items,check.rule)
    else if(excluded.has(check.rule.policyVersionId+'::'+check.rule.id))
      outcome=complete('not-applicable',null,'相同约束已有具名优先政策，当前规则不计入',[],check.items,check.rule)
    else if((check.rule.effectiveFrom||check.rule.effectiveUntil) &&
      (!check.asOfDate||!strictDate(check.asOfDate)||
       (check.rule.effectiveFrom&&!strictDate(check.rule.effectiveFrom))||
       (check.rule.effectiveUntil&&!strictDate(check.rule.effectiveUntil))))
      outcome=pending('规则有效日期缺失/不明确，不能凭系统时间判断',check.items,check.rule)
    else if(check.asOfDate &&
      ((check.rule.effectiveFrom&&check.asOfDate<check.rule.effectiveFrom)||
       (check.rule.effectiveUntil&&check.asOfDate>check.rule.effectiveUntil)))
      outcome=complete('not-applicable',null,'指定日期不在规则有效期内',[],check.items,check.rule)
    else outcome=evaluateT04Rule(check.rule,check.operation,check.items)
    return {
      planFingerprint:plan.fingerprint,checkKey:binding.checkKey,targetKey:binding.targetKey,objectKey:binding.objectKey,
      ruleId:check.rule.id,policyVersionId:check.rule.policyVersionId,
      sourceVersionIds:[...binding.sourceVersionIds],outcome,
    }
  })
}


/**
 * Presentation adapter for the existing ReviewRunV2 CheckResult contract.
 * Main supplies the verified SourceRef objects, true target and execution time;
 * neither policy source-id strings nor model citations are invented here.
 */
export function toT04CheckResult(
  proposal:T04PlanProposal,
  target:CheckResult['target'],
  verifiedSources:SourceRef[],
  executedAt:string,
):CheckResult {
  const outcome=proposal.outcome
  return {
    checkId:'t04:'+JSON.stringify([proposal.checkKey,proposal.targetKey,proposal.objectKey]),
    ruleId:proposal.ruleId,
    target,
    status:outcome.status,
    reason:outcome.reason,
    sourceRefs:[...verifiedSources],
    ...(outcome.result!==null ? {calculation:{
      inputs:[], result:outcome.result, detailLines:[...outcome.detailLines],
    }} : {}),
    executedBy:'deterministic',
    executedAt,
  }
}
