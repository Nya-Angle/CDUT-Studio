/**
 * CSLab 结构分析编排（纯函数）
 *
 * 把 CIF/POSCAR/XYZ 文本解析、空间群判定、等价原子展开、Wyckoff 与密度计算
 * 收敛到单一入口，供主进程与 Worker 共用。
 */

import type {
  CsLabCrystalAnalysis,
  CsLabCrystalAtom,
  CsLabCrystalStructure,
  CsLabStructureFormat,
  CsLabStructureParseResult,
  CsLabWyckoffSite,
} from '../types/cslab-vesta-types'
import { CSLAB_ATOMIC_MASSES } from './cslab-scattering-data'
import { parseCif } from './cslab-cif'
import { parsePoscar } from './cslab-poscar'
import { parseXyz } from './cslab-xyz'
import {
  buildCrystalStructure,
  expandAtoms,
  siteSymmetryOrder,
} from './cslab-symmetry'

/** 按格式解析结构文本。 */
export function parseStructureText(
  text: string,
  format: CsLabStructureFormat,
): CsLabStructureParseResult {
  if (format === 'cif') {
    const document = parseCif(text)
    return {
      format: 'cif',
      cell: document.cell,
      spaceGroupHm: document.spaceGroupHm,
      spaceGroupNumber: document.spaceGroupNumber,
      symmetryOperations: document.symmetryOperations,
      atoms: document.atoms,
      warnings: document.warnings,
    }
  }
  if (format === 'poscar') return parsePoscar(text)
  return parseXyz(text)
}

/** 解析并构建完整晶体结构。 */
export function buildStructureFromText(
  text: string,
  format: CsLabStructureFormat,
): CsLabCrystalStructure {
  return buildCrystalStructure(parseStructureText(text, format))
}

/** 化学式（按首次出现顺序，占据率保留两位小数）。 */
export function formatCrystalFormula(atoms: readonly CsLabCrystalAtom[]): string {
  const counts = new Map<string, number>()
  for (const atom of atoms) {
    counts.set(
      atom.element,
      (counts.get(atom.element) ?? 0) + (Number.isFinite(atom.occupancy) ? atom.occupancy : 1),
    )
  }
  return [...counts.entries()]
    .map(([element, count]) => {
      const rounded =
        Math.abs(count - Math.round(count)) < 0.01 ? Math.round(count) : Math.round(count * 100) / 100
      return `${element}${rounded === 1 ? '' : rounded}`
    })
    .join(' ')
}

/** 密度（g/cm³）；任一元素缺少原子质量时返回 undefined。 */
export function computeCrystalDensity(
  atoms: readonly CsLabCrystalAtom[],
  cellVolume: number,
): number | undefined {
  if (!(cellVolume > 0)) return undefined
  let mass = 0
  for (const atom of atoms) {
    const atomicMass = CSLAB_ATOMIC_MASSES[atom.element]
    if (atomicMass === undefined) return undefined
    mass += atomicMass * atom.occupancy
  }
  // 1 Å³ = 1e-24 cm³；N_A = 6.02214076e23
  return mass / (0.602214076 * cellVolume)
}

function buildWyckoffSites(structure: CsLabCrystalStructure): CsLabWyckoffSite[] {
  return structure.atoms.map((atom) => {
    const expanded = expandAtoms({ ...structure, atoms: [atom] })
    return {
      label: atom.label,
      element: atom.element,
      wyckoff: atom.wyckoff,
      multiplicity: expanded.length,
      siteSymmetry: `${siteSymmetryOrder(structure, atom.fractional)}`,
      fractional: atom.fractional,
    }
  })
}

/** 分析已构建的晶体结构。 */
export function analyzeCrystalStructure(
  structure: CsLabCrystalStructure,
  tolerance?: number,
): CsLabCrystalAnalysis {
  const expanded = expandAtoms(structure, { tolerance })
  const warnings = [...structure.warnings]
  if (expanded.length === 0) warnings.push('没有展开出任何原子，请检查占位坐标与空间群')
  const density = computeCrystalDensity(expanded, structure.cell.volume)
  if (density === undefined) warnings.push('部分元素缺少原子质量，密度未计算')

  return {
    structure,
    atomCount: structure.atoms.length,
    expandedAtomCount: expanded.length,
    formula: formatCrystalFormula(expanded),
    cellVolume: structure.cell.volume,
    density,
    wyckoff: buildWyckoffSites(structure),
    warnings,
  }
}

/** 从文本一键完成结构分析。 */
export function analyzeCrystalText(
  text: string,
  format: CsLabStructureFormat,
  tolerance?: number,
): CsLabCrystalAnalysis {
  return analyzeCrystalStructure(buildStructureFromText(text, format), tolerance)
}
