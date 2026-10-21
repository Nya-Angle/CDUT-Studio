/**
 * CSLab 理论粉末 XRD（PXRD）模拟（纯函数）
 *
 * 运动学近似：
 * I(hkl) ∝ |F(hkl)|² · M(hkl) · Lp(θ)
 *
 * - Cromer-Mann 中性原子形状因子；
 * - 空间群多重度（Laue 类 + Friedel 对）；
 * - Lorentz-极化因子与 Pseudo-Voigt 仪器展宽。
 *
 * 不支持 Rietveld 精修、吸收校正、异常散射与择优取向；结果仅用于峰位对照。
 */

import type {
  CsLabPxrdOptions,
  CsLabPxrdPattern,
  CsLabPxrdPeak,
  CsLabCrystalAtom,
  CsLabCrystalStructure,
  CsLabSymmetryOperation,
} from '../types/cslab-vesta-types'
import { CSLAB_XRAY_WAVELENGTHS, dSpacing, enumerateReflections, twoThetaFromD } from './cslab-crystal'
import { pseudoVoigt } from './cslab-fitting'
import {
  CSLAB_ATOMIC_NUMBERS,
  CSLAB_CROMER_MANN,
} from './cslab-scattering-data'
import { expandAtoms, systematicAbsence } from './cslab-symmetry'

export interface CsLabFormFactorResult {
  value: number
  missingCoefficients: boolean
}

/** 中性原子 X 射线形状因子 f(s)，s = sinθ/λ（Å⁻¹）。 */
export function atomicFormFactor(element: string, s: number): CsLabFormFactorResult {
  const coefficients = CSLAB_CROMER_MANN[element]
  if (!coefficients) {
    const atomicNumber = CSLAB_ATOMIC_NUMBERS[element]
    return {
      value: atomicNumber ?? 0,
      missingCoefficients: true,
    }
  }
  const [a1, a2, a3, a4, c, b1, b2, b3, b4] = coefficients
  const s2 = s * s
  const value =
    a1 * Math.exp(-b1 * s2) +
    a2 * Math.exp(-b2 * s2) +
    a3 * Math.exp(-b3 * s2) +
    a4 * Math.exp(-b4 * s2) +
    c
  return { value, missingCoefficients: false }
}

function reciprocalIndices(
  h: number,
  k: number,
  l: number,
  operation: CsLabSymmetryOperation,
): [number, number, number] {
  // h' = R^{-T} h；对整数正交矩阵结果仍为整数。
  const rotation = operation.rotation
  const determinant =
    rotation[0]![0]! * (rotation[1]![1]! * rotation[2]![2]! - rotation[1]![2]! * rotation[2]![1]!) -
    rotation[0]![1]! * (rotation[1]![0]! * rotation[2]![2]! - rotation[1]![2]! * rotation[2]![0]!) +
    rotation[0]![2]! * (rotation[1]![0]! * rotation[2]![1]! - rotation[1]![1]! * rotation[2]![0]!)
  // 逆矩阵（整数）
  const inverse = [
    [
      (rotation[1]![1]! * rotation[2]![2]! - rotation[1]![2]! * rotation[2]![1]!) / determinant,
      (rotation[0]![2]! * rotation[2]![1]! - rotation[0]![1]! * rotation[2]![2]!) / determinant,
      (rotation[0]![1]! * rotation[1]![2]! - rotation[0]![2]! * rotation[1]![1]!) / determinant,
    ],
    [
      (rotation[1]![2]! * rotation[2]![0]! - rotation[1]![0]! * rotation[2]![2]!) / determinant,
      (rotation[0]![0]! * rotation[2]![2]! - rotation[0]![2]! * rotation[2]![0]!) / determinant,
      (rotation[0]![2]! * rotation[1]![0]! - rotation[0]![0]! * rotation[1]![2]!) / determinant,
    ],
    [
      (rotation[1]![0]! * rotation[2]![1]! - rotation[1]![1]! * rotation[2]![0]!) / determinant,
      (rotation[0]![1]! * rotation[2]![0]! - rotation[0]![0]! * rotation[2]![1]!) / determinant,
      (rotation[0]![0]! * rotation[1]![1]! - rotation[0]![1]! * rotation[1]![0]!) / determinant,
    ],
  ]
  // R^{-T}：先逆再转置
  return [
    inverse[0]![0]! * h + inverse[1]![0]! * k + inverse[2]![0]! * l,
    inverse[0]![1]! * h + inverse[1]![1]! * k + inverse[2]![1]! * l,
    inverse[0]![2]! * h + inverse[1]![2]! * k + inverse[2]![2]! * l,
  ].map((value) => Math.round(value)) as [number, number, number]
}

function reflectionOrbit(
  h: number,
  k: number,
  l: number,
  operations: readonly CsLabSymmetryOperation[],
): Array<[number, number, number]> {
  const set = new Set<string>()
  const add = (a: number, b: number, c: number): void => {
    set.add(`${a},${b},${c}`)
    set.add(`${-a},${-b},${-c}`)
  }
  add(h, k, l)
  for (const operation of operations) {
    const [a, b, c] = reciprocalIndices(h, k, l, operation)
    add(a, b, c)
  }
  return [...set]
    .map((key) => key.split(',').map(Number) as [number, number, number])
    .sort((left, right) => left[0] - right[0] || left[1] - right[1] || left[2] - right[2])
}

/** 反射多重度：Laue 类等价反射 + Friedel 对。 */
export function reflectionMultiplicity(
  h: number,
  k: number,
  l: number,
  operations: readonly CsLabSymmetryOperation[],
): number {
  return reflectionOrbit(h, k, l, operations).length
}

/** Lorentz-极化因子（粉末衍射）。 */
export function lorentzPolarization(twoTheta: number): number {
  const theta = (twoTheta * Math.PI) / 360
  const sin = Math.sin(theta)
  const cos = Math.cos(theta)
  if (sin <= 0 || cos <= 0) return 0
  const cos2 = Math.cos(2 * theta)
  return (1 + cos2 * cos2) / (sin * sin * cos)
}

interface StructureFactorResult {
  amplitude: number
  usedFallback: boolean
}

function structureFactor(
  atoms: readonly CsLabCrystalAtom[],
  h: number,
  k: number,
  l: number,
  s: number,
): StructureFactorResult {
  let real = 0
  let imaginary = 0
  let usedFallback = false
  for (const atom of atoms) {
    const form = atomicFormFactor(atom.element, s)
    if (form.missingCoefficients) usedFallback = true
    const thermal = atom.bIso !== undefined ? Math.exp(-atom.bIso * s * s) : 1
    const phase = 2 * Math.PI * (h * atom.fractional[0] + k * atom.fractional[1] + l * atom.fractional[2])
    const weight = atom.occupancy * form.value * thermal
    real += weight * Math.cos(phase)
    imaginary += weight * Math.sin(phase)
  }
  return { amplitude: Math.hypot(real, imaginary), usedFallback }
}

/** 生成理论 PXRD 谱线与峰表。 */
export function simulatePxrd(
  structure: CsLabCrystalStructure,
  options: CsLabPxrdOptions = {},
): CsLabPxrdPattern {
  const wavelengthAngstrom = options.wavelengthAngstrom ?? CSLAB_XRAY_WAVELENGTHS['Cu-Kα']
  const minTwoTheta = options.minTwoTheta ?? 5
  const maxTwoTheta = options.maxTwoTheta ?? 90
  const fwhmDeg = options.fwhmDeg ?? 0.12
  const eta = options.eta ?? 0.5
  const maxIndex = Math.max(1, Math.min(12, Math.round(options.maxIndex ?? 8)))
  const stepDeg = Math.max(0.005, Math.min(0.1, options.stepDeg ?? 0.02))
  const zeroShift = options.zeroShiftDeg ?? 0

  if (!(wavelengthAngstrom > 0)) throw new Error('X 射线波长必须为正数')
  if (!(maxTwoTheta > minTwoTheta)) throw new Error('2θ 区间非法')

  const warnings: string[] = []
  const atoms = expandAtoms(structure)
  if (atoms.length === 0) warnings.push('结构中没有可用原子，无法计算结构因子')

  const reflections = enumerateReflections(structure.cell, {
    maxIndex,
    wavelengthAngstrom,
    minTwoTheta,
    maxTwoTheta,
    limit: 50000,
  })
  if (reflections.length === 0) warnings.push('在给定 2θ 区间内没有可用反射')

  let usedFallback = false
  const rawPeaks: Array<CsLabPxrdPeak & { rawIntensity: number }> = []
  const seenOrbits = new Set<string>()

  for (const reflection of reflections) {
    const { h, k, l, d, twoTheta } = reflection
    const absence = systematicAbsence(h, k, l, structure.spaceGroup)
    if (absence.extinct) continue

    const orbit = reflectionOrbit(h, k, l, structure.operations)
    const orbitKey = orbit[0]?.join(',') ?? `${h},${k},${l}`
    if (seenOrbits.has(orbitKey)) continue
    seenOrbits.add(orbitKey)

    const s = 1 / (2 * d)
    const factor = structureFactor(atoms, h, k, l, s)
    if (factor.usedFallback) usedFallback = true

    const multiplicity = orbit.length
    const lp = lorentzPolarization(twoTheta)
    const rawIntensity = factor.amplitude * factor.amplitude * multiplicity * lp
    if (!(rawIntensity > 1e-12)) continue

    rawPeaks.push({
      h,
      k,
      l,
      d,
      twoTheta: twoTheta + zeroShift,
      multiplicity,
      structureFactor: factor.amplitude,
      intensity: 0,
      relativeIntensity: 0,
      rawIntensity,
    })
  }

  const maximum = rawPeaks.reduce((max, peak) => Math.max(max, peak.rawIntensity), 0)
  if (maximum <= 0) warnings.push('所有反射强度为零，请检查原子占据率与元素符号')

  const peaks: CsLabPxrdPeak[] = rawPeaks
    .map((peak) => {
      const relative = maximum > 0 ? (peak.rawIntensity / maximum) * 100 : 0
      return {
        h: peak.h,
        k: peak.k,
        l: peak.l,
        d: peak.d,
        twoTheta: peak.twoTheta,
        multiplicity: peak.multiplicity,
        structureFactor: peak.structureFactor,
        intensity: peak.rawIntensity,
        relativeIntensity: relative,
      }
    })
    .sort((left, right) => left.twoTheta - right.twoTheta)

  if (usedFallback) {
    warnings.push('部分元素缺少 Cromer-Mann 系数，已使用原子序数近似，强度不可靠')
  }

  const x: number[] = []
  const y: number[] = []
  const count = Math.min(20000, Math.ceil((maxTwoTheta - minTwoTheta) / stepDeg) + 1)
  for (let i = 0; i < count; i += 1) {
    const angle = minTwoTheta + i * stepDeg
    x.push(angle)
    let value = 0
    for (const peak of peaks) {
      if (peak.relativeIntensity <= 0) continue
      if (Math.abs(angle - peak.twoTheta) > fwhmDeg * 20) continue
      value += pseudoVoigt(angle, peak.twoTheta, peak.relativeIntensity, fwhmDeg, eta)
    }
    y.push(value)
  }

  return {
    peaks,
    curve: { x, y },
    wavelengthAngstrom,
    options: {
      ...options,
      wavelengthAngstrom,
      minTwoTheta,
      maxTwoTheta,
      fwhmDeg,
      eta,
      maxIndex,
      stepDeg,
      zeroShiftDeg: zeroShift,
    },
    warnings,
  }
}

/** 由晶胞直接估算某 2θ 的 d 值（供 UI 标注复用）。 */
export function dFromTwoTheta(twoTheta: number, wavelengthAngstrom: number): number {
  const theta = (twoTheta * Math.PI) / 360
  const sine = Math.sin(theta)
  if (!(sine > 0)) return Number.NaN
  return wavelengthAngstrom / (2 * sine)
}

/** 供测试与 UI 复用的 2θ 换算。 */
export function reflectionTwoTheta(
  structure: CsLabCrystalStructure,
  h: number,
  k: number,
  l: number,
  wavelengthAngstrom: number,
): number {
  return twoThetaFromD(dSpacing(structure.cell, h, k, l), wavelengthAngstrom)
}
