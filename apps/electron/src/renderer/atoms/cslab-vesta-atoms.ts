/**
 * CSLab VESTA 级晶体工作台状态（Jotai）
 */

import { atom } from 'jotai'
import type {
  CsLabCrystalAnalysis,
  CsLabIsoMesh,
  CsLabPolyhedron,
  CsLabPxrdPattern,
} from '@profer/shared'

export interface CsLabSupercellState {
  na: number
  nb: number
  nc: number
}

/** 晶体结构分析结果。 */
export const cslabCrystalAnalysisAtom = atom<CsLabCrystalAnalysis | null>(null)

/** 超胞倍数。 */
export const cslabSupercellAtom = atom<CsLabSupercellState>({ na: 1, nb: 1, nc: 1 })

/** 理论 PXRD 谱线。 */
export const cslabPxrdPatternAtom = atom<CsLabPxrdPattern | null>(null)

/** 配位多面体列表。 */
export const cslabPolyhedraAtom = atom<CsLabPolyhedron[]>([])

/** 正相位等值面网格。 */
export const cslabIsoPositiveAtom = atom<CsLabIsoMesh | null>(null)

/** 负相位等值面网格。 */
export const cslabIsoNegativeAtom = atom<CsLabIsoMesh | null>(null)

/** 等值面后端标识。 */
export const cslabIsosurfaceBackendAtom = atom<'webgpu' | 'cpu' | null>(null)

/** 等值面提取中。 */
export const cslabIsosurfaceBusyAtom = atom<boolean>(false)

/** 等值面错误信息。 */
export const cslabIsosurfaceErrorAtom = atom<string | null>(null)
