/**
 * CSLab 曲线拟合与信号处理（纯函数）
 *
 * - 高斯 / 洛伦兹 / Pseudo-Voigt 峰形；
 * - Levenberg-Marquardt 非线性最小二乘；
 * - 多项式与 AsLS 基线；
 * - Savitzky-Golay、移动平均、FFT 低通；
 * - 梯形积分、峰面积、FWHM、重心。
 *
 * 红线：拟合失败或未收敛必须如实返回 converged=false 与 warnings，不伪造结果。
 */

import type {
  CsLabBaselineKind,
  CsLabFitRequest,
  CsLabFitResult,
  CsLabFittedPeak,
  CsLabPeakProfileName,
  CsLabPeakSpec,
  CsLabSmoothRequest,
} from '../types/cslab-origin-types'

const LN2 = Math.LN2
const SQRT_2LN2 = Math.sqrt(2 * LN2)

export function gaussian(x: number, center: number, height: number, fwhm: number): number {
  if (!(fwhm > 0)) return 0
  const sigma = fwhm / (2 * SQRT_2LN2)
  const z = (x - center) / sigma
  return height * Math.exp(-0.5 * z * z)
}

export function lorentzian(x: number, center: number, height: number, fwhm: number): number {
  if (!(fwhm > 0)) return 0
  const half = fwhm / 2
  const z = (x - center) / half
  return height / (1 + z * z)
}

export function pseudoVoigt(
  x: number,
  center: number,
  height: number,
  fwhm: number,
  eta = 0.5,
): number {
  const clamped = Math.max(0, Math.min(1, eta))
  return clamped * lorentzian(x, center, height, fwhm) + (1 - clamped) * gaussian(x, center, height, fwhm)
}

/** 解析峰面积。 */
export function profileArea(
  profile: CsLabPeakProfileName,
  height: number,
  fwhm: number,
  eta = 0.5,
): number {
  const gaussianArea = height * fwhm * Math.sqrt(Math.PI / (4 * LN2))
  const lorentzArea = height * fwhm * (Math.PI / 2)
  if (profile === 'gaussian') return gaussianArea
  if (profile === 'lorentzian') return lorentzArea
  const clamped = Math.max(0, Math.min(1, eta))
  return clamped * lorentzArea + (1 - clamped) * gaussianArea
}

export function integrateTrapezoid(x: readonly number[], y: readonly number[]): number {
  const count = Math.min(x.length, y.length)
  if (count < 2) return 0
  let area = 0
  for (let i = 1; i < count; i += 1) {
    area += ((y[i - 1]! + y[i]!) / 2) * (x[i]! - x[i - 1]!)
  }
  return area
}

export function centroid(x: readonly number[], y: readonly number[]): number {
  const count = Math.min(x.length, y.length)
  let weighted = 0
  let total = 0
  for (let i = 0; i < count; i += 1) {
    const value = Math.max(0, y[i]!)
    weighted += x[i]! * value
    total += value
  }
  return total > 0 ? weighted / total : Number.NaN
}

/** 由离散曲线估算半高全宽（线性插值）。 */
export function fwhmFromCurve(x: readonly number[], y: readonly number[]): number {
  const count = Math.min(x.length, y.length)
  if (count < 3) return Number.NaN
  let peakIndex = 0
  for (let i = 1; i < count; i += 1) if (y[i]! > y[peakIndex]!) peakIndex = i
  const peak = y[peakIndex]!
  if (!(peak > 0)) return Number.NaN
  const half = peak / 2

  let left = Number.NaN
  for (let i = peakIndex; i > 0; i -= 1) {
    if (y[i - 1]! <= half) {
      const ratio = (half - y[i - 1]!) / (y[i]! - y[i - 1]!)
      left = x[i - 1]! + ratio * (x[i]! - x[i - 1]!)
      break
    }
  }
  let right = Number.NaN
  for (let i = peakIndex; i < count - 1; i += 1) {
    if (y[i + 1]! <= half) {
      const ratio = (half - y[i + 1]!) / (y[i]! - y[i + 1]!)
      right = x[i + 1]! + ratio * (x[i]! - x[i + 1]!)
      break
    }
  }
  if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.NaN
  return Math.abs(right - left)
}

function solveLinearSystem(matrix: number[][], rhs: number[]): number[] | null {
  const n = rhs.length
  const augmented = matrix.map((row, index) => [...row, rhs[index]!])
  for (let column = 0; column < n; column += 1) {
    let pivot = column
    for (let row = column + 1; row < n; row += 1) {
      if (Math.abs(augmented[row]![column]!) > Math.abs(augmented[pivot]![column]!)) pivot = row
    }
    if (Math.abs(augmented[pivot]![column]!) < 1e-12) return null
    if (pivot !== column) {
      const temp = augmented[pivot]!
      augmented[pivot] = augmented[column]!
      augmented[column] = temp
    }
    const divisor = augmented[column]![column]!
    for (let j = column; j <= n; j += 1) augmented[column]![j]! /= divisor
    for (let row = 0; row < n; row += 1) {
      if (row === column) continue
      const factor = augmented[row]![column]!
      if (factor === 0) continue
      for (let j = column; j <= n; j += 1) augmented[row]![j]! -= factor * augmented[column]![j]!
    }
  }
  return augmented.map((row) => row[n]!)
}

/** 多项式最小二乘基线（返回每个 x 处的基线值）。 */
export function polynomialBaseline(
  x: readonly number[],
  y: readonly number[],
  order: number,
): number[] {
  const degree = Math.max(0, Math.min(6, Math.round(order)))
  const columns = degree + 1
  const matrix = Array.from({ length: columns }, () => new Array<number>(columns).fill(0))
  const rhs = new Array<number>(columns).fill(0)

  for (let i = 0; i < x.length; i += 1) {
    const powers = new Array<number>(columns)
    powers[0] = 1
    for (let p = 1; p < columns; p += 1) powers[p] = powers[p - 1]! * x[i]!
    for (let row = 0; row < columns; row += 1) {
      rhs[row] = rhs[row]! + powers[row]! * y[i]!
      for (let column = 0; column < columns; column += 1) {
        matrix[row]![column]! += powers[row]! * powers[column]!
      }
    }
  }

  const coefficients = solveLinearSystem(matrix, rhs)
  if (!coefficients) return new Array<number>(x.length).fill(0)
  return x.map((value) => {
    let result = 0
    for (let p = 0; p < coefficients.length; p += 1) result += coefficients[p]! * value ** p
    return result
  })
}

/**
 * AsLS 非对称最小二乘基线（Eilers & Boelens）。
 *
 * 使用共轭梯度求解五对角惩罚系统，避免构造稠密矩阵。
 */
export function aslsBaseline(
  y: readonly number[],
  lambda = 1e6,
  p = 0.01,
  maxIterations = 12,
): number[] {
  const n = y.length
  if (n < 3) return new Array<number>(n).fill(0)

  const diag = new Array<number>(n).fill(6)
  diag[0] = 1
  diag[1] = 5
  diag[n - 2] = 5
  diag[n - 1] = 1
  if (n === 3) {
    diag[0] = 1
    diag[1] = 2
    diag[2] = 1
  }

  const off1 = new Array<number>(n - 1).fill(-4)
  if (n > 1) {
    off1[0] = -2
    off1[n - 2] = -2
  }
  const off2 = new Array<number>(Math.max(0, n - 2)).fill(1)

  /** 五对角对称正定矩阵的带状 Cholesky 求解。 */
  const solveBanded = (weights: readonly number[], rhs: readonly number[]): number[] => {
    const a0 = new Array<number>(n)
    const a1 = new Array<number>(Math.max(0, n - 1))
    const a2 = new Array<number>(Math.max(0, n - 2))
    for (let i = 0; i < n; i += 1) a0[i] = weights[i]! + lambda * diag[i]!
    for (let i = 0; i < n - 1; i += 1) a1[i] = lambda * off1[i]!
    for (let i = 0; i < n - 2; i += 1) a2[i] = lambda * off2[i]!

    const l0 = new Array<number>(n)
    const l1 = new Array<number>(Math.max(0, n - 1))
    const l2 = new Array<number>(Math.max(0, n - 2))

    for (let i = 0; i < n; i += 1) {
      let pivot = a0[i]!
      if (i >= 1) pivot -= l1[i - 1]! ** 2
      if (i >= 2) pivot -= l2[i - 2]! ** 2
      if (!(pivot > 1e-18)) pivot = 1e-18
      l0[i] = Math.sqrt(pivot)
      if (i + 1 < n) {
        let value = a1[i]!
        if (i >= 1) value -= l2[i - 1]! * l1[i - 1]!
        l1[i] = value / l0[i]!
      }
      if (i + 2 < n) {
        l2[i] = a2[i]! / l0[i]!
      }
    }

    const forward = new Array<number>(n)
    for (let i = 0; i < n; i += 1) {
      let value = rhs[i]!
      if (i >= 1) value -= l1[i - 1]! * forward[i - 1]!
      if (i >= 2) value -= l2[i - 2]! * forward[i - 2]!
      forward[i] = value / l0[i]!
    }

    const solution = new Array<number>(n)
    for (let i = n - 1; i >= 0; i -= 1) {
      let value = forward[i]!
      if (i + 1 < n) value -= l1[i]! * solution[i + 1]!
      if (i + 2 < n) value -= l2[i]! * solution[i + 2]!
      solution[i] = value / l0[i]!
    }
    return solution
  }

  let baseline = y.slice()

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const weights = y.map((value, index) => (value > baseline[index]! ? p : 1 - p))
    const rhs = y.map((value, index) => weights[index]! * value)
    baseline = solveBanded(weights, rhs)
  }

  return baseline
}

export interface LevenbergMarquardtOptions {
  maxIterations?: number
  tolerance?: number
  lower?: number[]
  upper?: number[]
  locked?: boolean[]
}

export interface LevenbergMarquardtResult {
  params: number[]
  iterations: number
  converged: boolean
  chiSquare: number
}

function clampParams(params: number[], lower?: number[], upper?: number[]): void {
  for (let i = 0; i < params.length; i += 1) {
    if (lower && lower[i] !== undefined) params[i] = Math.max(lower[i]!, params[i]!)
    if (upper && upper[i] !== undefined) params[i] = Math.min(upper[i]!, params[i]!)
  }
}

export function levenbergMarquardt(
  residualFn: (params: number[]) => number[],
  initial: number[],
  options: LevenbergMarquardtOptions = {},
): LevenbergMarquardtResult {
  const maxIterations = options.maxIterations ?? 200
  const tolerance = options.tolerance ?? 1e-8
  const params = initial.slice()
  clampParams(params, options.lower, options.upper)

  const evaluate = (candidate: number[]): { residual: number[]; chi: number } => {
    const residual = residualFn(candidate)
    const chi = residual.reduce((sum, value) => sum + value * value, 0)
    return { residual, chi }
  }

  let current = evaluate(params)
  let lambda = 1e-3
  let iterations = 0
  let converged = false

  for (; iterations < maxIterations; iterations += 1) {
    const residual = current.residual
    const freeIndices: number[] = []
    for (let i = 0; i < params.length; i += 1) {
      if (!options.locked?.[i]) freeIndices.push(i)
    }
    if (freeIndices.length === 0) {
      converged = true
      break
    }

    const jacobian: number[][] = Array.from({ length: residual.length }, () => new Array<number>(freeIndices.length).fill(0))
    for (let column = 0; column < freeIndices.length; column += 1) {
      const index = freeIndices[column]!
      const step = Math.max(1e-7, Math.abs(params[index]!) * 1e-6)
      const forward = params.slice()
      const backward = params.slice()
      forward[index]! += step
      backward[index]! -= step
      clampParams(forward, options.lower, options.upper)
      clampParams(backward, options.lower, options.upper)
      const residualForward = residualFn(forward)
      const residualBackward = residualFn(backward)
      for (let row = 0; row < residual.length; row += 1) {
        jacobian[row]![column] = (residualForward[row]! - residualBackward[row]!) / (2 * step)
      }
    }

    const normal = Array.from({ length: freeIndices.length }, () =>
      new Array<number>(freeIndices.length).fill(0),
    )
    const gradient = new Array<number>(freeIndices.length).fill(0)
    for (let a = 0; a < freeIndices.length; a += 1) {
      for (let b = 0; b < freeIndices.length; b += 1) {
        let sum = 0
        for (let row = 0; row < residual.length; row += 1) sum += jacobian[row]![a]! * jacobian[row]![b]!
        normal[a]![b] = sum
      }
      let sum = 0
      for (let row = 0; row < residual.length; row += 1) sum += jacobian[row]![a]! * residual[row]!
      gradient[a] = -sum
    }

    let accepted = false
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const damped = normal.map((row, index) => {
        const copy = row.slice()
        copy[index]! += lambda * Math.max(1e-12, normal[index]![index]!)
        return copy
      })
      const delta = solveLinearSystem(damped, gradient)
      if (!delta) {
        lambda *= 10
        continue
      }
      const candidate = params.slice()
      for (let i = 0; i < freeIndices.length; i += 1) {
        candidate[freeIndices[i]!]! += delta[i]!
      }
      clampParams(candidate, options.lower, options.upper)
      const next = evaluate(candidate)
      if (next.chi < current.chi) {
        const improvement = (current.chi - next.chi) / Math.max(1e-30, current.chi)
        for (let i = 0; i < params.length; i += 1) params[i] = candidate[i]!
        current = next
        lambda = Math.max(1e-12, lambda / 10)
        accepted = true
        if (improvement < tolerance) converged = true
        break
      }
      lambda *= 10
    }

    if (!accepted) break
    if (converged) break
  }

  return {
    params,
    iterations,
    converged,
    chiSquare: current.chi,
  }
}

function buildBaseline(
  kind: CsLabBaselineKind,
  x: readonly number[],
  y: readonly number[],
  polynomialOrder: number,
  asls: { lambda: number; p: number } | undefined,
): number[] {
  switch (kind) {
    case 'none':
      return new Array<number>(x.length).fill(0)
    case 'constant': {
      const minimum = y.reduce((min, value) => Math.min(min, value), y[0] ?? 0)
      return new Array<number>(x.length).fill(minimum)
    }
    case 'linear':
      return polynomialBaseline(x, y, 1)
    case 'polynomial':
      return polynomialBaseline(x, y, polynomialOrder)
    case 'asls':
      return aslsBaseline(y, asls?.lambda ?? 1e6, asls?.p ?? 0.01)
    default:
      return new Array<number>(x.length).fill(0)
  }
}

function profileValue(
  profile: CsLabPeakProfileName,
  x: number,
  center: number,
  height: number,
  fwhm: number,
  eta: number,
): number {
  if (profile === 'gaussian') return gaussian(x, center, height, fwhm)
  if (profile === 'lorentzian') return lorentzian(x, center, height, fwhm)
  return pseudoVoigt(x, center, height, fwhm, eta)
}

/** 多峰解叠拟合。 */
export function fitPeaks(request: CsLabFitRequest): CsLabFitResult {
  const warnings: string[] = []
  const { x, y, peaks, model, baseline: baselineKind } = request
  if (x.length !== y.length || x.length < 5) {
    throw new Error('拟合数据长度不一致或点数不足')
  }
  if (peaks.length === 0) throw new Error('至少需要一个初始峰')

  const fixedBaseline =
    baselineKind === 'constant' || baselineKind === 'linear'
      ? null
      : buildBaseline(baselineKind, x, y, request.polynomialOrder ?? 2, request.asls)

  const initial: number[] = []
  const lower: number[] = []
  const upper: number[] = []
  const locked: boolean[] = []
  const etas: number[] = []
  const xMin = x[0]!
  const xMax = x[x.length - 1]!
  const yMax = Math.max(...y)
  const yMin = Math.min(...y)

  // 基线初值（constant / linear 作为自由参数参与拟合）
  const initialBaseline = fixedBaseline
    ? fixedBaseline
    : baselineKind === 'constant'
      ? new Array<number>(x.length).fill(yMin)
      : polynomialBaseline(x, y, 1)
  const corrected = y.map((value, index) => value - initialBaseline[index]!)

  peaks.forEach((peak) => {
    const nearestIndex = x.reduce(
      (best, value, index) => (Math.abs(value - peak.center) < Math.abs(x[best]! - peak.center) ? index : best),
      0,
    )
    const estimatedHeight = peak.height ?? Math.max(1e-6, corrected[nearestIndex] ?? 0)
    const fwhm = peak.fwhm > 0 ? peak.fwhm : Math.max((xMax - xMin) / 50, 1e-6)
    initial.push(peak.center, estimatedHeight, fwhm)
    lower.push(xMin, 0, Math.max((xMax - xMin) / 100000, 1e-8))
    upper.push(xMax, Math.max(1, yMax * 10), xMax - xMin)
    locked.push(Boolean(peak.locked), Boolean(peak.locked), Boolean(peak.locked))
    etas.push(Math.max(0, Math.min(1, peak.eta ?? 0.5)))
  })

  const baselineOffset = peaks.length * 3
  if (baselineKind === 'constant') {
    initial.push(yMin)
    lower.push(yMin - Math.max(1, Math.abs(yMax - yMin)) * 10)
    upper.push(yMax + Math.max(1, Math.abs(yMax - yMin)) * 10)
    locked.push(false)
  } else if (baselineKind === 'linear') {
    initial.push(initialBaseline[0]!, 0)
    lower.push(yMin - Math.max(1, Math.abs(yMax - yMin)) * 10, -Math.max(1, Math.abs(yMax - yMin)) * 10)
    upper.push(yMax + Math.max(1, Math.abs(yMax - yMin)) * 10, Math.max(1, Math.abs(yMax - yMin)) * 10)
    locked.push(false, false)
  }

  const baselineAt = (params: number[], index: number): number => {
    if (fixedBaseline) return fixedBaseline[index]!
    if (baselineKind === 'constant') return params[baselineOffset]!
    return params[baselineOffset]! + params[baselineOffset + 1]! * x[index]!
  }

  const residualFn = (params: number[]): number[] => {
    const residual = new Array<number>(x.length).fill(0)
    for (let i = 0; i < x.length; i += 1) {
      let modelValue = baselineAt(params, i)
      for (let p = 0; p < peaks.length; p += 1) {
        modelValue += profileValue(
          model,
          x[i]!,
          params[p * 3]!,
          params[p * 3 + 1]!,
          params[p * 3 + 2]!,
          etas[p]!,
        )
      }
      residual[i] = modelValue - y[i]!
    }
    return residual
  }

  const result = levenbergMarquardt(residualFn, initial, {
    maxIterations: request.maxIterations,
    tolerance: request.tolerance,
    lower,
    upper,
    locked,
  })

  if (!result.converged) warnings.push('拟合达到迭代上限或无法继续下降，结果可能未完全收敛')

  const fitted: number[] = []
  const baseline = x.map((_value, index) => baselineAt(result.params, index))
  const fittedPeaks: CsLabFittedPeak[] = []
  const totalArea = peaks.reduce((sum, _peak, index) => {
    const height = Math.max(0, result.params[index * 3 + 1]!)
    const fwhm = Math.max(0, result.params[index * 3 + 2]!)
    return sum + profileArea(model, height, fwhm, etas[index]!)
  }, 0)

  for (let index = 0; index < peaks.length; index += 1) {
    const center = result.params[index * 3]!
    const height = Math.max(0, result.params[index * 3 + 1]!)
    const fwhm = Math.max(0, result.params[index * 3 + 2]!)
    const area = profileArea(model, height, fwhm, etas[index]!)
    fittedPeaks.push({
      center,
      height,
      fwhm,
      eta: etas[index]!,
      area,
      areaFraction: totalArea > 0 ? area / totalArea : 0,
      locked: Boolean(peaks[index]?.locked),
    })
    if (fwhm <= 0) warnings.push(`第 ${index + 1} 个峰半高宽非正，请检查初始值`)
  }

  const modelResidual = residualFn(result.params)
  for (let i = 0; i < x.length; i += 1) {
    // residualFn 返回 (模型 - 原始数据)，因此模型值 = 原始数据 + residual
    fitted.push(y[i]! + modelResidual[i]!)
  }

  const residual = y.map((value, index) => value - fitted[index]!)
  const mean = y.reduce((sum, value) => sum + value, 0) / y.length
  const totalVariance = y.reduce((sum, value) => sum + (value - mean) ** 2, 0)
  const residualVariance = residual.reduce((sum, value) => sum + value * value, 0)
  const rSquared = totalVariance > 0 ? 1 - residualVariance / totalVariance : 1
  const rmse = Math.sqrt(residualVariance / y.length)

  return {
    peaks: fittedPeaks,
    baseline,
    fitted,
    residual,
    rSquared,
    rmse,
    iterations: result.iterations,
    converged: result.converged,
    warnings,
  }
}

function movingAverage(y: readonly number[], window: number): number[] {
  const size = Math.max(1, Math.round(window))
  const half = Math.floor(size / 2)
  return y.map((_value, index) => {
    let sum = 0
    let count = 0
    for (let offset = -half; offset <= half; offset += 1) {
      const target = index + offset
      if (target < 0 || target >= y.length) continue
      sum += y[target]!
      count += 1
    }
    return count > 0 ? sum / count : 0
  })
}

function savitzkyGolay(y: readonly number[], window: number, order: number): number[] {
  const size = Math.max(3, Math.round(window) | 1)
  const degree = Math.max(0, Math.min(size - 1, Math.round(order)))
  const half = Math.floor(size / 2)
  return y.map((_value, index) => {
    const xs: number[] = []
    const ys: number[] = []
    for (let offset = -half; offset <= half; offset += 1) {
      const target = index + offset
      if (target < 0 || target >= y.length) continue
      xs.push(offset)
      ys.push(y[target]!)
    }
    if (xs.length <= degree) return y[index]!
    const baseline = polynomialBaseline(xs, ys, degree)
    const centerOffset = xs.indexOf(0)
    return baseline[centerOffset] ?? y[index]!
  })
}

function fftInPlace(real: Float64Array, imag: Float64Array): void {
  const n = real.length
  for (let i = 1, j = 0; i < n; i += 1) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      const tempReal = real[i]!
      real[i] = real[j]!
      real[j] = tempReal
      const tempImag = imag[i]!
      imag[i] = imag[j]!
      imag[j] = tempImag
    }
  }
  for (let length = 2; length <= n; length <<= 1) {
    const angle = (-2 * Math.PI) / length
    const wReal = Math.cos(angle)
    const wImag = Math.sin(angle)
    for (let start = 0; start < n; start += length) {
      let curReal = 1
      let curImag = 0
      for (let k = 0; k < length / 2; k += 1) {
        const even = start + k
        const odd = even + length / 2
        const tReal = real[odd]! * curReal - imag[odd]! * curImag
        const tImag = real[odd]! * curImag + imag[odd]! * curReal
        real[odd] = real[even]! - tReal
        imag[odd] = imag[even]! - tImag
        real[even]! += tReal
        imag[even]! += tImag
        const nextReal = curReal * wReal - curImag * wImag
        curImag = curReal * wImag + curImag * wReal
        curReal = nextReal
      }
    }
  }
}

function fftLowpass(y: readonly number[], cutoff: number): number[] {
  const n = y.length
  if (n < 4) return y.slice()
  let size = 1
  while (size < n) size <<= 1
  const real = new Float64Array(size)
  const imag = new Float64Array(size)
  for (let i = 0; i < n; i += 1) real[i] = y[i]!
  fftInPlace(real, imag)
  const limit = Math.max(1, Math.floor((Math.max(0.01, Math.min(1, cutoff)) * size) / 2))
  for (let i = 0; i < size; i += 1) {
    const frequency = i < size / 2 ? i : size - i
    if (frequency > limit) {
      real[i] = 0
      imag[i] = 0
    }
  }
  // 逆变换：共轭 -> FFT -> 共轭 / N
  for (let i = 0; i < size; i += 1) imag[i] = -imag[i]!
  fftInPlace(real, imag)
  const result = new Array<number>(n)
  for (let i = 0; i < n; i += 1) result[i] = real[i]! / size
  return result
}

export function smoothSeries(request: CsLabSmoothRequest): number[] {
  if (request.kind === 'moving-average') return movingAverage(request.y, request.window)
  if (request.kind === 'savgol') return savitzkyGolay(request.y, request.window, request.order ?? 2)
  return fftLowpass(request.y, request.cutoff ?? 0.25)
}

/** 供 PXRD 谱线生成复用的峰形值。 */
export function profileAt(
  profile: CsLabPeakProfileName,
  x: number,
  peak: Pick<CsLabPeakSpec, 'center' | 'fwhm' | 'eta'> & { height: number },
): number {
  return profileValue(profile, x, peak.center, peak.height, peak.fwhm, peak.eta ?? 0.5)
}
