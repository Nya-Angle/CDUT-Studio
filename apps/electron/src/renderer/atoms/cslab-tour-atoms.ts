/**
 * cslab-tour-atoms — 新手引导向 CDUT Science 工作台下发的一次性指令
 *
 * 工作台内部持有 openAssetInPane / openPlotInPane 等复杂逻辑，引导层不重复实现；
 * 通过 atom 下发指令、工作台执行后回写 ack，避免跨组件 ref 与 DOM 模拟点击。
 */

import { atom } from 'jotai'

export type CsLabTourCommand =
  | { id: number; kind: 'open-table-at-index'; index: number }
  | { id: number; kind: 'open-asset-by-title'; title: string }
  | { id: number; kind: 'open-plot'; plotId: string }
  | { id: number; kind: 'open-academic-search'; query: string }
  | { id: number; kind: 'close-drawer' }
  | { id: number; kind: 'refresh-assets' }

export interface CsLabTourAck {
  id: number
  ok: boolean
  error?: string
}

/** 待执行指令（null 表示空闲） */
export const cslabTourCommandAtom = atom<CsLabTourCommand | null>(null)

/** 工作台执行结果（引导层按 id 匹配） */
export const cslabTourAckAtom = atom<CsLabTourAck | null>(null)
