/**
 * MultiHop-RAG 评测指标计算
 *
 * 检索层（严格对齐官方 MultiHop-RAG 检索评测口径）：
 *   - Hit@4  / Hit@10 ：Top-k 内是否命中任意金标证据文档；
 *   - MRR             ：首个金标证据文档的倒数排名；
 *   - MAP@10          ：Top-10 平均精度均值（多跳证据集）。
 *
 * 问答层（模型无关的离线代理指标，如实标注）：
 *   - Answer Coverage（严格口径 Strict）：归一化后整串包含，作为历史对照基线；
 *   - Answer Coverage（加权口径 Token）：日期 / 数字 / 实体 / 实词的**加权关键信息单元召回**，
 *     能识别「答案的关键信息是否散落在证据片段中」，不再因自由文本长句而假低；
 *   - Full Evidence Recall              ：全部金标证据文档是否均被召回（多跳证据链完整性）。
 *   说明：真正的问答准确率（Accuracy / Exact Match）需要由大模型生成作答后才能判定，
 *   离线运行器不编造该数值。
 */

/** 文本归一化：小写并剔除非字母数字字符（保留 CJK），用于标题匹配与严格覆盖率判定 */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^0-9a-z\u4e00-\u9fff]+/g, '')
}

// ===== 检索指标 =====

/** 单题检索命中结果 */
export interface RetrievalScore {
  hitAt4: number
  hitAt10: number
  mrr: number
  mapAt10: number
}

/**
 * 计算单题检索指标。
 *
 * @param rankedDocIds 检索命中的文档标识序列（按相关性降序、已去重）
 * @param goldDocIds   金标证据文档标识集合
 */
export function scoreRetrieval(rankedDocIds: string[], goldDocIds: string[]): RetrievalScore {
  const goldSet = new Set(goldDocIds)
  if (goldSet.size === 0) return { hitAt4: 0, hitAt10: 0, mrr: 0, mapAt10: 0 }

  const top10 = rankedDocIds.slice(0, 10)
  let hitAt4 = 0
  let hitAt10 = 0
  let firstRelevantRank = 0
  let averagePrecision = 0
  let relevantSeen = 0

  for (let index = 0; index < top10.length; index++) {
    const isRelevant = goldSet.has(top10[index] ?? '')
    if (isRelevant) {
      hitAt10 = 1
      if (index < 4) hitAt4 = 1
      if (firstRelevantRank === 0) firstRelevantRank = index + 1
      relevantSeen += 1
      averagePrecision += relevantSeen / (index + 1)
    }
  }

  const denominator = Math.min(goldSet.size, 10)
  return {
    hitAt4,
    hitAt10,
    mrr: firstRelevantRank > 0 ? 1 / firstRelevantRank : 0,
    mapAt10: denominator > 0 ? averagePrecision / denominator : 0,
  }
}

/** 数值求均值（空数组返回 0） */
export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/** 数值中位数（空数组返回 0） */
export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 1) return sorted[mid] as number
  return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
}

/**
 * Null Query「正确拒答」判定（数据自校准，无需人工阈值）。
 *
 * 判定基准：以该引擎在**全部非 null 查询**上的 top-1 检索分中位数为参考强度。
 *   - null query 检索不到任何结果（top-1 分为 0），或 top-1 检索分**严格低于**该参考强度
 *     → 视为「正确拒答」（系统没有对不存在的事实给出可信证据）；
 *   - 反之视为「误召回」（对不存在的事实给出了不低于半数真题强度的证据）。
 *
 * 说明：该指标是模型无关的检索层代理口径，用于弥补 null query 无金标证据、无法计算
 * Hit/MRR/MAP 的空白；不等同于大模型级「拒答准确率」。
 */
export function computeNullRefusalFlags(nullTopScores: number[], referenceTopScores: number[]): boolean[] {
  const threshold = median(referenceTopScores)
  return nullTopScores.map((score) => score <= 0 || score < threshold)
}

// ===== 答案覆盖率：严格口径 + 加权关键单元口径 =====

/** 全角 → 半角（含全角空格） */
function toHalfWidth(text: string): string {
  return text
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, ' ')
}

/** 月份缩写 → 两位月份数字 */
const MONTH_INDEX: Record<string, string> = {
  january: '01', jan: '01', february: '02', feb: '02', march: '03', mar: '03',
  april: '04', apr: '04', may: '05', june: '06', jun: '06', july: '07', jul: '07',
  august: '08', aug: '08', september: '09', sep: '09', sept: '09',
  october: '10', oct: '10', november: '11', nov: '11', december: '12', dec: '12',
}
const MONTH_WORDS = new Set(Object.keys(MONTH_INDEX))

/** 覆盖率专用停用词（英文虚词 + 中文虚词），不参与关键单元与匹配 */
const COVERAGE_STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'or', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'as', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its', 'this', 'that', 'these', 'those',
  'he', 'she', 'they', 'we', 'you', 'his', 'her', 'their', 'our', 'your', 'not', 'no', 'do', 'did',
  'does', 'has', 'have', 'had', 'than', 'then', 'when', 'which', 'who', 'whom', 'what', 'where',
  'how', 'why', 'all', 'any', 'both', 'each', 'more', 'most', 'other', 'some', 'such', 'only',
  'own', 'same', 'so', 'too', 'very', 'can', 'will', 'would', 'should', 'could', 'about', 'into',
  'the', '的', '了', '和', '与', '及', '或', '是', '在', '对', '为', '中', '上', '下', '里',
  '把', '被', '请', '我', '你', '他', '她', '它', '这', '那', '有', '无', '不', '也', '就', '都', '会', '能',
])

/** 两位补零 */
function pad2(value: string | number): string {
  return String(value).padStart(2, '0')
}

/** 把常见日期写法统一为无分隔符的 YYYYMMDD（便于词元级匹配） */
function canonicalizeDates(text: string): string {
  let out = text
  // YYYY-MM-DD / YYYY/MM/DD
  out = out.replace(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/g, (_m, y, mo, d) => `${y}${pad2(mo)}${pad2(d)}`)
  // Month D, YYYY
  out = out.replace(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s+(\d{4})\b/g,
    (_m, mon, d, y) => `${y}${MONTH_INDEX[mon as string] ?? '01'}${pad2(d)}`,
  )
  // D Month YYYY
  out = out.replace(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s*,?\s+(\d{4})\b/g,
    (_m, d, mon, y) => `${y}${MONTH_INDEX[mon as string] ?? '01'}${pad2(d)}`,
  )
  return out
}

/** 把「数字 + 数量级单位」展开为整数（1.4 billion → 1400000000），并统一百分比写法 */
function normalizeNumbers(text: string): string {
  let out = text.replace(/(\d+(?:\.\d+)?)\s*(?:%|percent|per\s+cent)/g, '$1')
  const scale: Record<string, number> = { thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12, bn: 1e9 }
  out = out.replace(/\b(\d+(?:\.\d+)?)\s*(thousand|million|billion|trillion|bn)\b/g, (_m, num, unit) => {
    const factor = scale[unit as string]
    if (!factor) return _m
    const value = Number(num) * factor
    return Number.isFinite(value) ? String(Math.round(value)) : _m
  })
  // 千分位逗号
  return out.replace(/\b\d{1,3}(?:,\d{3})+\b/g, (m) => m.replace(/,/g, ''))
}

/**
 * 轻量英文词形还原。
 * 关键点：答案与证据走**同一套**变换，即使规则不完美也保持一致，不会引入系统偏差。
 */
function lemmatize(word: string): string {
  if (!/^[a-z]+$/.test(word) || word.length <= 4) return word
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (word.endsWith('sses')) return word.slice(0, -2)
  if (word.endsWith('ss') || word.endsWith('us') || word.endsWith('is')) return word
  if (word.endsWith('s')) return word.slice(0, -1)
  if (word.endsWith('ing')) return word.slice(0, -3)
  if (word.endsWith('ed')) return word.slice(0, -2)
  return word
}

/** 覆盖率词元化：归一化 → 日期/数字统一 → 去停用词 → 轻量词形还原（中文取 bigram） */
function coverageTokens(text: string): string[] {
  let normalized = toHalfWidth(text).toLowerCase()
  normalized = normalizeNumbers(normalized)
  normalized = canonicalizeDates(normalized)
  const tokens: string[] = []
  for (const word of normalized.match(/[a-z0-9]+/g) ?? []) {
    if (COVERAGE_STOP_WORDS.has(word)) continue
    if (word.length < 2 && !/\d/.test(word)) continue
    tokens.push(lemmatize(word))
  }
  for (const run of normalized.match(/[\u4e00-\u9fff]+/g) ?? []) {
    if (run.length === 1) {
      tokens.push(run)
      continue
    }
    for (let i = 0; i < run.length - 1; i++) tokens.push(run.slice(i, i + 2))
  }
  return tokens
}

/** 单个关键信息单元：tokens 需全部命中才计为覆盖 */
export interface CoverageKeyUnit {
  tokens: string[]
  /** 权重：日期 / 数字 / 命名实体 = 3，普通实词 = 1 */
  weight: number
  raw: string
}

/** 从金标答案中抽取加权关键信息单元 */
export function extractKeyUnits(answer: string): CoverageKeyUnit[] {
  const lower = toHalfWidth(answer).toLowerCase()
  const units: CoverageKeyUnit[] = []
  const seen = new Set<string>()
  const push = (tokens: string[], weight: number, raw: string): void => {
    const unique = [...new Set(tokens)]
    if (unique.length === 0) return
    const key = unique.join('\u0001')
    if (seen.has(key)) return
    seen.add(key)
    units.push({ tokens: unique, weight, raw })
  }

  // 1) 日期（含被月份写法归一后的 YYYYMMDD）
  const dateSource = canonicalizeDates(normalizeNumbers(lower))
  for (const match of dateSource.match(/\b\d{8}\b/g) ?? []) push([match], 3, match)

  // 2) 数字 / 金额 / 百分比
  for (const match of dateSource.match(/\b\d+(?:\.\d+)?\b/g) ?? []) {
    if (match.length >= 4 || match.includes('.')) push([match], 3, match)
  }

  // 3) 命名实体（用原始大小写判定；排除月份词）
  for (const match of toHalfWidth(answer).match(/\b[A-Z][A-Za-z0-9]*(?:[ -][A-Z][A-Za-z0-9]*)*\b/g) ?? []) {
    const raw = match.trim()
    if (raw.length < 2 || MONTH_WORDS.has(raw.toLowerCase())) continue
    push(coverageTokens(raw), 3, raw)
  }

  // 4) 其余实词
  for (const token of coverageTokens(lower)) push([token], 1, token)

  return units
}

/** 判定金标答案是否被检索到的证据文本覆盖（严格口径：归一化后整串包含） */
export function isAnswerCovered(answer: string, evidenceText: string): boolean {
  const normalizedAnswer = normalizeText(answer)
  if (!normalizedAnswer) return false
  return normalizeText(evidenceText).includes(normalizedAnswer)
}

/** 双口径答案覆盖结果 */
export interface AnswerCoverage {
  /** 严格口径：归一化整串包含（历史基线，易被短答案刷分） */
  strict: boolean
  /** 加权口径：关键信息单元加权召回率（0~1） */
  token: number
}

/**
 * 计算答案覆盖的双口径结果。
 *
 * 加权口径：把金标答案拆为「日期 / 数字 / 命名实体 / 实词」四类加权单元，
 * 每类单元在证据词元集合中**全部命中**才计分，最终取加权召回率。
 * 相比整串包含，它能正确处理「答案信息分散在证据中」「自由文本长句」的情形。
 */
export function computeAnswerCoverage(answer: string, evidenceText: string): AnswerCoverage {
  const strict = isAnswerCovered(answer, evidenceText)
  const units = extractKeyUnits(answer)
  if (units.length === 0) return { strict, token: strict ? 1 : 0 }

  const evidenceTokens = new Set(coverageTokens(evidenceText))
  let totalWeight = 0
  let hitWeight = 0
  for (const unit of units) {
    totalWeight += unit.weight
    if (unit.tokens.every((token) => evidenceTokens.has(token))) hitWeight += unit.weight
  }
  return { strict, token: totalWeight > 0 ? hitWeight / totalWeight : 0 }
}
