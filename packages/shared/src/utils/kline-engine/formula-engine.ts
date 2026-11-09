/**
 * Profer KLine Engine — 通达信 / 麦语言风格向量化指标公式编译器与增量求值引擎
 *
 * 核心设计亮点：
 * 1. 编译流水线：源码 -> 词法分析（支持中文标识符、字符串字面量、修饰符） -> Pratt 算符优先语法分析 -> AST。
 * 2. 一切皆序列（Vectorized Float64Array）：标量与序列运算自动广播。
 * 3. O(N) 单调双端队列（Monotonic Deque）实现 HHV / LLV 滑动窗口极值，彻底消灭传统滑窗 O(N*K) 退化。
 * 4. 绘图指令分离：STICKLINE / DRAWTEXT / DRAWICON 生成结构化绘图指令供 Canvas2D / WebGPU 渲染层消费。
 * 5. 未来函数静态审计：自动识别 ZIG / BACKSET / REFX / TROUGHBARS / PEAKBARS 并向用户输出告警。
 */

import type {
  FormulaDrawingInstruction,
  FormulaEvaluationResult,
  FormulaLineOutput,
  KLineColumnarArrays,
} from './types'

type Token =
  | { kind: 'num'; value: number }
  | { kind: 'str'; value: string }
  | { kind: 'id'; value: string }
  | { kind: 'op'; value: string }
  | { kind: 'punct'; value: string }

export type FormulaAstNode =
  | { kind: 'num'; value: number }
  | { kind: 'str'; value: string }
  | { kind: 'id'; name: string }
  | { kind: 'unary'; op: string; expr: FormulaAstNode }
  | { kind: 'binary'; op: string; left: FormulaAstNode; right: FormulaAstNode }
  | { kind: 'call'; name: string; args: FormulaAstNode[] }

export interface ParsedFormulaStatement {
  name: string
  isOutput: boolean
  expr: FormulaAstNode
  modifiers: string[]
}

const FUTURE_FUNCTIONS = new Set([
  'ZIG',
  'BACKSET',
  'REFX',
  'REFXV',
  'TROUGH',
  'TROUGHBARS',
  'PEAK',
  'PEAKBARS',
  'FLATZIG',
])

const COLOR_MAP: Record<string, string> = {
  COLORRED: '#ef4444',
  COLORGREEN: '#10b981',
  COLORBLUE: '#3b82f6',
  COLORYELLOW: '#eab308',
  COLORCYAN: '#06b6d4',
  COLORMAGENTA: '#d946ef',
  COLORWHITE: '#f8fafc',
  COLORGRAY: '#94a3b8',
  COLORORANGE: '#f97316',
}

const DEFAULT_PALETTE = ['#f59e0b', '#38bdf8', '#c084fc', '#34d399', '#fb7185', '#60a5fa']

/** 词法分析器：支持数字、单双引号字符串、中英文变量名、赋值符 (:= / :) 与比较逻辑符 */
export function lexFormula(source: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = source.length

  while (i < n) {
    const ch = source[i]!
    if (/\s/.test(ch)) {
      i++
      continue
    }
    // 跳过 { ... } 通达信注释或 // 行注释
    if (ch === '{') {
      const close = source.indexOf('}', i + 1)
      i = close >= 0 ? close + 1 : n
      continue
    }
    if (ch === '/' && source[i + 1] === '/') {
      const nl = source.indexOf('\n', i + 2)
      i = nl >= 0 ? nl + 1 : n
      continue
    }
    // 字符串字面量
    if (ch === "'" || ch === '"') {
      const quote = ch
      let j = i + 1
      let val = ''
      while (j < n && source[j] !== quote) {
        val += source[j]
        j++
      }
      tokens.push({ kind: 'str', value: val })
      i = j + 1
      continue
    }
    // 数字字面量
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(source[i + 1] ?? ''))) {
      let j = i
      while (j < n && /[\d.]/.test(source[j]!)) j++
      tokens.push({ kind: 'num', value: parseFloat(source.slice(i, j)) })
      i = j
      continue
    }
    // 双字符运算符
    const two = source.slice(i, i + 2)
    if (two === ':=' || two === '>=' || two === '<=' || two === '<>' || two === '!=' || two === '==' || two === '&&' || two === '||') {
      tokens.push({ kind: two === ':=' ? 'punct' : 'op', value: two })
      i += 2
      continue
    }
    // 单字符标点与运算符
    if (':;,()'.includes(ch)) {
      tokens.push({ kind: 'punct', value: ch })
      i++
      continue
    }
    if ('+-*/><='.includes(ch)) {
      tokens.push({ kind: 'op', value: ch })
      i++
      continue
    }
    // 标识符（支持字母、数字、下划线及中文）
    if (/[A-Za-z_\u4e00-\u9fa5]/.test(ch)) {
      let j = i + 1
      while (j < n && /[\w\u4e00-\u9fa5]/.test(source[j]!)) j++
      const rawId = source.slice(i, j).toUpperCase()
      if (rawId === 'AND' || rawId === 'OR' || rawId === 'NOT') {
        tokens.push({ kind: 'op', value: rawId })
      } else {
        tokens.push({ kind: 'id', value: rawId })
      }
      i = j
      continue
    }
    i++
  }

  return tokens
}

/** 运算符左绑定优先级表（Pratt Binding Power） */
const BINDING_POWER: Record<string, number> = {
  OR: 10,
  '||': 10,
  AND: 20,
  '&&': 20,
  '>': 30,
  '<': 30,
  '>=': 30,
  '<=': 30,
  '=': 30,
  '==': 30,
  '<>': 30,
  '!=': 30,
  '+': 40,
  '-': 40,
  '*': 50,
  '/': 50,
}

function isStyleModifierToken(name: string): boolean {
  if (name === 'NODRAW' || name === 'COLORSTICK' || name === 'VOLSTICK' || name === 'CIRCLEDOT' || name === 'POINTDOT' || name === 'STICK') {
    return true
  }
  if (name.startsWith('COLOR') || name.startsWith('LINETHICK')) {
    return true
  }
  return false
}

/** Pratt 算符优先语法分析器：将通达信公式源码编译为语句 AST 数组 */
export function parseFormula(source: string): ParsedFormulaStatement[] {
  const tokens = lexFormula(source)
  let pos = 0

  const peek = (): Token | undefined => tokens[pos]
  const next = (): Token | undefined => tokens[pos++]

  function parseExpr(rbp = 0): FormulaAstNode {
    const tk = next()
    if (!tk) return { kind: 'num', value: NaN }

    let left: FormulaAstNode
    if (tk.kind === 'num') {
      left = { kind: 'num', value: tk.value }
    } else if (tk.kind === 'str') {
      left = { kind: 'str', value: tk.value }
    } else if (tk.kind === 'punct' && tk.value === '(') {
      left = parseExpr(0)
      if (peek()?.kind === 'punct' && peek()?.value === ')') next()
    } else if (tk.kind === 'op' && (tk.value === '-' || tk.value === '+' || tk.value === 'NOT')) {
      left = { kind: 'unary', op: tk.value, expr: parseExpr(60) }
    } else if (tk.kind === 'id') {
      if (peek()?.kind === 'punct' && peek()?.value === '(') {
        next() // 消费 '('
        const args: FormulaAstNode[] = []
        if (!(peek()?.kind === 'punct' && peek()?.value === ')')) {
          while (pos < tokens.length) {
            args.push(parseExpr(0))
            if (peek()?.kind === 'punct' && peek()?.value === ',') {
              next()
            } else {
              break
            }
          }
        }
        if (peek()?.kind === 'punct' && peek()?.value === ')') next()
        left = { kind: 'call', name: tk.value, args }
      } else {
        left = { kind: 'id', name: tk.value }
      }
    } else {
      left = { kind: 'num', value: NaN }
    }

    while (pos < tokens.length) {
      const cur = peek()
      if (!cur || cur.kind !== 'op') break
      const bp = BINDING_POWER[cur.value] ?? 0
      if (bp <= rbp) break
      next()
      const right = parseExpr(bp)
      left = { kind: 'binary', op: cur.value, left, right }
    }

    return left
  }

  const statements: ParsedFormulaStatement[] = []
  while (pos < tokens.length) {
    if (peek()?.kind === 'punct' && peek()?.value === ';') {
      next()
      continue
    }

    let name = ''
    let isOutput = true
    const first = tokens[pos]
    const second = tokens[pos + 1]
    if (first?.kind === 'id' && second?.kind === 'punct' && (second.value === ':' || second.value === ':=')) {
      name = first.value
      isOutput = second.value === ':'
      pos += 2
    }

    const expr = parseExpr(0)
    const modifiers: string[] = []

    // 解析尾部逗号分隔的修饰符，例如 `, COLORRED, LINETHICK2, NODRAW`
    while (peek()?.kind === 'punct' && peek()?.value === ',') {
      next() // 消费 ','
      const modTk = peek()
      if (modTk?.kind === 'id' && isStyleModifierToken(modTk.value)) {
        modifiers.push(modTk.value)
        next()
      } else {
        break
      }
    }

    if (peek()?.kind === 'punct' && peek()?.value === ';') {
      next()
    }

    statements.push({ name, isOutput, expr, modifiers })
  }

  return statements
}

// ===== O(N) 向量化序列算子库 =====

function createNanSeries(len: number): Float64Array {
  return new Float64Array(len).fill(NaN)
}

function scalarOf(series: Float64Array | undefined, fallback = 1): number {
  if (!series || series.length === 0) return fallback
  for (let i = series.length - 1; i >= 0; i--) {
    const v = series[i]!
    if (Number.isFinite(v)) return v
  }
  return fallback
}

/**
 * 单调双端队列（Monotonic Deque）实现 O(N) 滑动窗口极值（HHV / LLV）：
 * 无论窗口长度 period 是 5 还是 5000，每个元素最多入队一次、出队一次，时间复杂度严格 O(N)。
 */
export function slidingWindowExtrema(
  series: Float64Array,
  period: number,
  mode: 'max' | 'min',
): Float64Array {
  const n = series.length
  const out = createNanSeries(n)
  const k = Math.max(1, Math.round(period))
  if (n === 0) return out

  const dequeIdx = new Int32Array(n)
  let head = 0
  let tail = 0

  for (let i = 0; i < n; i++) {
    const val = series[i]!
    if (!Number.isFinite(val)) continue

    // 移除滑出窗口左边界的索引
    while (head < tail && dequeIdx[head]! <= i - k) {
      head++
    }
    // 维护单调性
    while (head < tail) {
      const backVal = series[dequeIdx[tail - 1]!]!
      const shouldPop = mode === 'max' ? backVal <= val : backVal >= val
      if (shouldPop) tail--
      else break
    }
    dequeIdx[tail++] = i
    if (i >= 0 && head < tail) {
      out[i] = series[dequeIdx[head]!]!
    }
  }
  return out
}

const VECTOR_FUNCTIONS: Record<string, (...args: Float64Array[]) => Float64Array> = {
  REF: (x, nArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const offset = Math.max(0, Math.round(scalarOf(nArr, 1)))
    if (!x) return out
    for (let i = offset; i < len; i++) {
      out[i] = x[i - offset]!
    }
    return out
  },

  MA: (x, nArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const period = Math.max(1, Math.round(scalarOf(nArr, 5)))
    if (!x || len === 0) return out
    let sum = 0
    let validCount = 0
    for (let i = 0; i < len; i++) {
      const v = x[i]!
      if (Number.isFinite(v)) {
        sum += v
        validCount++
      }
      if (i >= period) {
        const old = x[i - period]!
        if (Number.isFinite(old)) {
          sum -= old
          validCount--
        }
      }
      if (i >= period - 1 && validCount === period) {
        out[i] = sum / period
      }
    }
    return out
  },

  EMA: (x, nArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const period = Math.max(1, scalarOf(nArr, 12))
    if (!x || len === 0) return out
    const alpha = 2 / (period + 1)
    let prev = NaN
    for (let i = 0; i < len; i++) {
      const v = x[i]!
      if (!Number.isFinite(v)) continue
      prev = Number.isFinite(prev) ? alpha * v + (1 - alpha) * prev : v
      out[i] = prev
    }
    return out
  },

  SMA: (x, nArr, mArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const nPeriod = Math.max(1, scalarOf(nArr, 14))
    const mWeight = Math.max(0.0001, scalarOf(mArr, 1))
    if (!x || len === 0) return out
    let prev = NaN
    for (let i = 0; i < len; i++) {
      const v = x[i]!
      if (!Number.isFinite(v)) continue
      prev = Number.isFinite(prev) ? (mWeight * v + (nPeriod - mWeight) * prev) / nPeriod : v
      out[i] = prev
    }
    return out
  },

  HHV: (x, nArr) => slidingWindowExtrema(x ?? new Float64Array(0), scalarOf(nArr, 20), 'max'),
  LLV: (x, nArr) => slidingWindowExtrema(x ?? new Float64Array(0), scalarOf(nArr, 20), 'min'),

  STD: (x, nArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const period = Math.max(2, Math.round(scalarOf(nArr, 20)))
    if (!x || len < period) return out
    const ma = VECTOR_FUNCTIONS.MA!(x, nArr)
    for (let i = period - 1; i < len; i++) {
      const mean = ma[i]!
      if (!Number.isFinite(mean)) continue
      let sq = 0
      for (let j = i - period + 1; j <= i; j++) {
        const diff = x[j]! - mean
        sq += diff * diff
      }
      out[i] = Math.sqrt(sq / (period - 1))
    }
    return out
  },

  SUM: (x, nArr) => {
    const len = x?.length ?? 0
    const out = createNanSeries(len)
    const period = Math.max(0, Math.round(scalarOf(nArr, 5)))
    if (!x || len === 0) return out
    let sum = 0
    for (let i = 0; i < len; i++) {
      const v = Number.isFinite(x[i]!) ? x[i]! : 0
      sum += v
      if (period > 0 && i >= period) {
        const old = Number.isFinite(x[i - period]!) ? x[i - period]! : 0
        sum -= old
      }
      if (period === 0 || i >= period - 1) {
        out[i] = sum
      }
    }
    return out
  },

  IF: (cond, a, b) => {
    const len = cond?.length ?? 0
    const out = createNanSeries(len)
    if (!cond || !a || !b) return out
    for (let i = 0; i < len; i++) {
      out[i] = cond[i]! ? a[i]! : b[i]!
    }
    return out
  },

  IFF: (cond, a, b) => VECTOR_FUNCTIONS.IF!(cond, a, b),

  CROSS: (a, b) => {
    const len = a?.length ?? 0
    const out = new Float64Array(len)
    if (!a || !b) return out
    for (let i = 1; i < len; i++) {
      out[i] = a[i - 1]! <= b[i - 1]! && a[i]! > b[i]! ? 1 : 0
    }
    return out
  },

  COUNT: (cond, nArr) => {
    const len = cond?.length ?? 0
    const out = new Float64Array(len)
    const period = Math.max(1, Math.round(scalarOf(nArr, 5)))
    if (!cond) return out
    let c = 0
    for (let i = 0; i < len; i++) {
      if (cond[i]! > 0) c++
      if (i >= period && cond[i - period]! > 0) c--
      out[i] = c
    }
    return out
  },

  EVERY: (cond, nArr) => {
    const period = Math.max(1, Math.round(scalarOf(nArr, 3)))
    const cnt = VECTOR_FUNCTIONS.COUNT!(cond, nArr)
    return cnt.map((v) => (v >= period ? 1 : 0))
  },

  EXIST: (cond, nArr) => {
    const cnt = VECTOR_FUNCTIONS.COUNT!(cond, nArr)
    return cnt.map((v) => (v >= 1 ? 1 : 0))
  },

  BARSLAST: (cond) => {
    const len = cond?.length ?? 0
    const out = createNanSeries(len)
    if (!cond) return out
    let lastTrue = -1
    for (let i = 0; i < len; i++) {
      if (cond[i]! > 0) lastTrue = i
      if (lastTrue >= 0) out[i] = i - lastTrue
    }
    return out
  },

  ABS: (x) => (x ? x.map(Math.abs) : new Float64Array(0)),
  MAX: (a, b) => (a && b ? a.map((v, i) => Math.max(v, b[i]!)) : new Float64Array(0)),
  MIN: (a, b) => (a && b ? a.map((v, i) => Math.min(v, b[i]!)) : new Float64Array(0)),
}

function parseModifiers(
  modifiers: string[],
  defaultColor: string,
): Pick<FormulaLineOutput, 'color' | 'lineWidth' | 'style' | 'nodraw'> {
  let color = defaultColor
  let lineWidth = 1.5
  let style: FormulaLineOutput['style'] = 'solid'
  let nodraw = false

  for (const mod of modifiers) {
    if (mod === 'NODRAW') {
      nodraw = true
    } else if (mod === 'COLORSTICK') {
      style = 'colorstick'
    } else if (mod === 'VOLSTICK') {
      style = 'volstick'
    } else if (mod === 'CIRCLEDOT') {
      style = 'circledot'
    } else if (mod === 'POINTDOT') {
      style = 'pointdot'
    } else if (COLOR_MAP[mod]) {
      color = COLOR_MAP[mod]!
    } else if (/^COLOR[0-9A-F]{6}$/.test(mod)) {
      color = `#${mod.slice(5)}`
    } else if (/^LINETHICK([1-9])$/.test(mod)) {
      lineWidth = parseInt(mod.slice(9), 10)
    }
  }

  return { color, lineWidth, style, nodraw }
}

/**
 * 执行通达信公式编译与向量化求值
 */
export function evaluateFormula(source: string, bars: KLineColumnarArrays): FormulaEvaluationResult {
  const len = bars.length
  if (!source.trim() || len === 0) {
    return { lines: [], drawings: [], futureFunctionWarnings: [], diagnostics: [] }
  }

  const statements = parseFormula(source)
  const env: Record<string, Float64Array> = {
    O: bars.open,
    OPEN: bars.open,
    H: bars.high,
    HIGH: bars.high,
    L: bars.low,
    LOW: bars.low,
    C: bars.close,
    CLOSE: bars.close,
    V: bars.volume,
    VOL: bars.volume,
    AMOUNT: bars.amount,
  }

  const broadcastScalar = (val: number): Float64Array => new Float64Array(len).fill(val)
  const lines: FormulaLineOutput[] = []
  const drawings: FormulaDrawingInstruction[] = []
  const futureFunctionWarnings: string[] = []
  const diagnostics: string[] = []

  const evalNode = (node: FormulaAstNode, currentModifiers: string[]): Float64Array | null => {
    switch (node.kind) {
      case 'num':
        return broadcastScalar(node.value)
      case 'str':
        return broadcastScalar(0)
      case 'id': {
        if (env[node.name]) return env[node.name]!
        diagnostics.push(`未定义标识符: ${node.name}`)
        return createNanSeries(len)
      }
      case 'unary': {
        const inner = evalNode(node.expr, currentModifiers) ?? createNanSeries(len)
        if (node.op === '-') return inner.map((v) => -v)
        if (node.op === 'NOT') return inner.map((v) => (v ? 0 : 1))
        return inner
      }
      case 'binary': {
        const l = evalNode(node.left, currentModifiers) ?? createNanSeries(len)
        const r = evalNode(node.right, currentModifiers) ?? createNanSeries(len)
        const out = new Float64Array(len)
        for (let i = 0; i < len; i++) {
          const a = l[i]!
          const b = r[i]!
          switch (node.op) {
            case '+':
              out[i] = a + b
              break
            case '-':
              out[i] = a - b
              break
            case '*':
              out[i] = a * b
              break
            case '/':
              out[i] = Math.abs(b) > 1e-12 ? a / b : NaN
              break
            case '>':
              out[i] = a > b ? 1 : 0
              break
            case '<':
              out[i] = a < b ? 1 : 0
              break
            case '>=':
              out[i] = a >= b ? 1 : 0
              break
            case '<=':
              out[i] = a <= b ? 1 : 0
              break
            case '=':
            case '==':
              out[i] = Math.abs(a - b) < 1e-9 ? 1 : 0
              break
            case '<>':
            case '!=':
              out[i] = Math.abs(a - b) >= 1e-9 ? 1 : 0
              break
            case 'AND':
            case '&&':
              out[i] = a !== 0 && !Number.isNaN(a) && b !== 0 && !Number.isNaN(b) ? 1 : 0
              break
            case 'OR':
            case '||':
              out[i] = (a !== 0 && !Number.isNaN(a)) || (b !== 0 && !Number.isNaN(b)) ? 1 : 0
              break
            default:
              out[i] = NaN
          }
        }
        return out
      }
      case 'call': {
        if (FUTURE_FUNCTIONS.has(node.name) && !futureFunctionWarnings.includes(node.name)) {
          futureFunctionWarnings.push(node.name)
        }
        // 绘图函数拦截：不产生普通数值曲线，而是生成 FormulaDrawingInstruction
        if (node.name === 'STICKLINE') {
          const cond = evalNode(node.args[0] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const p1 = evalNode(node.args[1] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const p2 = evalNode(node.args[2] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const width = scalarOf(evalNode(node.args[3] ?? { kind: 'num', value: 2 }, currentModifiers) ?? undefined, 2)
          const empty = scalarOf(evalNode(node.args[4] ?? { kind: 'num', value: 0 }, currentModifiers) ?? undefined, 0) > 0
          const modStyle = parseModifiers(currentModifiers, '#ef4444')
          drawings.push({
            kind: 'stickline',
            cond,
            price1: p1,
            price2: p2,
            width,
            empty,
            color: modStyle.color,
          })
          return null
        }
        if (node.name === 'DRAWTEXT') {
          const cond = evalNode(node.args[0] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const price = evalNode(node.args[1] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const textArg = node.args[2]
          const text = textArg?.kind === 'str' ? textArg.value : textArg?.kind === 'id' ? textArg.name : 'SIGNAL'
          const modStyle = parseModifiers(currentModifiers, '#f59e0b')
          drawings.push({
            kind: 'drawtext',
            cond,
            price,
            text,
            color: modStyle.color,
          })
          return null
        }
        if (node.name === 'DRAWICON') {
          const cond = evalNode(node.args[0] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const price = evalNode(node.args[1] ?? { kind: 'num', value: 0 }, currentModifiers) ?? createNanSeries(len)
          const iconType = scalarOf(evalNode(node.args[2] ?? { kind: 'num', value: 1 }, currentModifiers) ?? undefined, 1)
          drawings.push({
            kind: 'drawicon',
            cond,
            price,
            iconType,
          })
          return null
        }

        const fn = VECTOR_FUNCTIONS[node.name]
        if (!fn) {
          diagnostics.push(`未知函数: ${node.name}()`)
          return createNanSeries(len)
        }
        const evaluatedArgs = node.args.map((a) => evalNode(a, currentModifiers) ?? createNanSeries(len))
        return fn(...evaluatedArgs)
      }
    }
  }

  for (const stmt of statements) {
    const val = evalNode(stmt.expr, stmt.modifiers)
    if (!val) continue
    if (stmt.name) {
      env[stmt.name] = val
    }
    if (stmt.isOutput) {
      const paletteColor = DEFAULT_PALETTE[lines.length % DEFAULT_PALETTE.length]!
      const styleMeta = parseModifiers(stmt.modifiers, paletteColor)
      const outName = stmt.name || `LINE${lines.length + 1}`
      // 自动推断该曲线属于主图叠加（接近收盘价尺度）还是副图（如 DIF/DEA/MACD/RSI/KDJ）
      const isSubIndicator =
        /^(DIF|DEA|MACD|K|D|J|RSI|CCI|WR|BIAS|OBV|VOL|VPIN|OFI)\b/i.test(outName) ||
        styleMeta.style === 'colorstick' ||
        styleMeta.style === 'volstick'

      lines.push({
        name: outName,
        data: val,
        ...styleMeta,
        targetPane: isSubIndicator ? 'sub' : 'main',
      })
    }
  }

  return {
    lines,
    drawings,
    futureFunctionWarnings,
    diagnostics,
  }
}
