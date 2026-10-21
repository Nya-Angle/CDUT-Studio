/**
 * CSLab Origin 级绘画面板状态（Jotai）
 */

import { atom } from 'jotai'
import type { CsLabFitResult, CsLabPlotDocument } from '@profer/shared'

export interface CsLabPlotSelection {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 当前窗格正在编辑的绘图文档。 */
export const cslabPlotDocumentAtom = atom<CsLabPlotDocument | null>(null)

/** 画布框选 ROI（数据坐标）。 */
export const cslabPlotSelectionAtom = atom<CsLabPlotSelection | null>(null)

/** 拟合执行中。 */
export const cslabFitBusyAtom = atom<boolean>(false)

/** 最近一次拟合结果。 */
export const cslabFitResultAtom = atom<CsLabFitResult | null>(null)

/** 拟合抽屉是否打开。 */
export const cslabFitDrawerOpenAtom = atom<boolean>(false)
