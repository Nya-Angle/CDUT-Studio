/**
 * CSLab Web Worker 消息协议
 */

import type {
  CsLabFitRequest,
  CsLabPxrdOptions,
  CsLabSmoothRequest,
  CsLabStructureFormat,
  CsLabVolumeGrid,
} from '@profer/shared'

export type CsLabCrystallographyRequest =
  | { id: number; kind: 'analyze'; text: string; format: CsLabStructureFormat; tolerance?: number }
  | { id: number; kind: 'pxrd'; text: string; format: CsLabStructureFormat; options: CsLabPxrdOptions }
  | {
      id: number
      kind: 'supercell'
      text: string
      format: CsLabStructureFormat
      na: number
      nb: number
      nc: number
    }
  | {
      id: number
      kind: 'polyhedra'
      text: string
      format: CsLabStructureFormat
      centerElement: string
      neighborElements: string[]
      cutoff: number
    }
  | { id: number; kind: 'isosurface'; grid: CsLabVolumeGrid; isovalue: number }

export type CsLabFittingRequest =
  | { id: number; kind: 'fit'; request: CsLabFitRequest }
  | { id: number; kind: 'smooth'; request: CsLabSmoothRequest }

export type CsLabWorkerRequest = CsLabCrystallographyRequest | CsLabFittingRequest

export type CsLabWorkerResponse =
  | { id: number; ok: true; result: unknown }
  | { id: number; ok: false; error: string }
