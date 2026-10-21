/**
 * CSLab Worker 类型化 RPC 客户端
 *
 * 使用 Vite 的 `?worker` 导入，保证生产环境 file:// 下 Worker 路径稳定。
 */

import type {
  CsLabCrystalAnalysis,
  CsLabCrystalAtom,
  CsLabFitRequest,
  CsLabFitResult,
  CsLabIsoMesh,
  CsLabPolyhedron,
  CsLabPxrdOptions,
  CsLabPxrdPattern,
  CsLabSmoothRequest,
  CsLabStructureFormat,
  CsLabVolumeGrid,
} from '@profer/shared'
import CrystallographyWorker from '../../workers/cslab-crystallography.worker?worker'
import FittingWorker from '../../workers/cslab-fitting.worker?worker'
import type {
  CsLabCrystallographyRequest,
  CsLabFittingRequest,
  CsLabWorkerResponse,
} from './cslab-worker-protocol'

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never
type CsLabWorkerPayload = WithoutId<CsLabCrystallographyRequest | CsLabFittingRequest>

const TIMEOUT_MS = 30_000

class CsLabWorkerClient {
  private crystallography: Worker | null = null
  private fitting: Worker | null = null
  private pending = new Map<number, PendingRequest>()
  private nextId = 1

  private ensureCrystallography(): Worker {
    if (this.crystallography) return this.crystallography
    const worker = new CrystallographyWorker()
    this.bind(worker)
    this.crystallography = worker
    return worker
  }

  private ensureFitting(): Worker {
    if (this.fitting) return this.fitting
    const worker = new FittingWorker()
    this.bind(worker)
    this.fitting = worker
    return worker
  }

  private bind(worker: Worker): void {
    worker.onmessage = (event: MessageEvent<CsLabWorkerResponse>) => {
      const response = event.data
      const pending = this.pending.get(response.id)
      if (!pending) return
      clearTimeout(pending.timer)
      this.pending.delete(response.id)
      if (response.ok) pending.resolve(response.result)
      else pending.reject(new Error(response.error))
    }
    worker.onerror = (event) => {
      const message = event.message || 'Worker 运行时错误'
      for (const [id, pending] of this.pending) {
        clearTimeout(pending.timer)
        pending.reject(new Error(message))
        this.pending.delete(id)
      }
    }
  }

  private request<T>(worker: Worker, payload: CsLabWorkerPayload): Promise<T> {
    const id = this.nextId
    this.nextId += 1
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error('Worker 计算超时（30s）'))
      }, TIMEOUT_MS)
      this.pending.set(id, {
        resolve: (value) => resolve(value as T),
        reject,
        timer,
      })
      worker.postMessage({ ...payload, id })
    })
  }

  analyze(text: string, format: CsLabStructureFormat, tolerance?: number): Promise<CsLabCrystalAnalysis> {
    return this.request<CsLabCrystalAnalysis>(this.ensureCrystallography(), {
      kind: 'analyze',
      text,
      format,
      tolerance,
    })
  }

  simulatePxrd(
    text: string,
    format: CsLabStructureFormat,
    options: CsLabPxrdOptions,
  ): Promise<CsLabPxrdPattern> {
    return this.request<CsLabPxrdPattern>(this.ensureCrystallography(), {
      kind: 'pxrd',
      text,
      format,
      options,
    })
  }

  supercell(
    text: string,
    format: CsLabStructureFormat,
    na: number,
    nb: number,
    nc: number,
  ): Promise<CsLabCrystalAtom[]> {
    return this.request<CsLabCrystalAtom[]>(this.ensureCrystallography(), {
      kind: 'supercell',
      text,
      format,
      na,
      nb,
      nc,
    })
  }

  polyhedra(
    text: string,
    format: CsLabStructureFormat,
    centerElement: string,
    neighborElements: string[],
    cutoff: number,
  ): Promise<CsLabPolyhedron[]> {
    return this.request<CsLabPolyhedron[]>(this.ensureCrystallography(), {
      kind: 'polyhedra',
      text,
      format,
      centerElement,
      neighborElements,
      cutoff,
    })
  }

  isosurface(grid: CsLabVolumeGrid, isovalue: number): Promise<CsLabIsoMesh> {
    return this.request<CsLabIsoMesh>(this.ensureCrystallography(), {
      kind: 'isosurface',
      grid,
      isovalue,
    })
  }

  fit(request: CsLabFitRequest): Promise<CsLabFitResult> {
    return this.request<CsLabFitResult>(this.ensureFitting(), { kind: 'fit', request })
  }

  smooth(request: CsLabSmoothRequest): Promise<{ x: number[]; y: number[] }> {
    return this.request<{ x: number[]; y: number[] }>(this.ensureFitting(), {
      kind: 'smooth',
      request,
    })
  }

  dispose(): void {
    for (const [id, pending] of this.pending) {
      clearTimeout(pending.timer)
      pending.reject(new Error('Worker 已释放'))
      this.pending.delete(id)
    }
    this.crystallography?.terminate()
    this.fitting?.terminate()
    this.crystallography = null
    this.fitting = null
  }
}

let client: CsLabWorkerClient | null = null

function getClient(): CsLabWorkerClient {
  if (!client) client = new CsLabWorkerClient()
  return client
}

export const cslabWorkers = {
  analyze: (text: string, format: CsLabStructureFormat, tolerance?: number) =>
    getClient().analyze(text, format, tolerance),
  simulatePxrd: (text: string, format: CsLabStructureFormat, options: CsLabPxrdOptions = {}) =>
    getClient().simulatePxrd(text, format, options),
  supercell: (text: string, format: CsLabStructureFormat, na: number, nb: number, nc: number) =>
    getClient().supercell(text, format, na, nb, nc),
  polyhedra: (
    text: string,
    format: CsLabStructureFormat,
    centerElement: string,
    neighborElements: string[],
    cutoff: number,
  ) => getClient().polyhedra(text, format, centerElement, neighborElements, cutoff),
  isosurface: (grid: CsLabVolumeGrid, isovalue: number) => getClient().isosurface(grid, isovalue),
  fit: (request: CsLabFitRequest) => getClient().fit(request),
  smooth: (request: CsLabSmoothRequest) => getClient().smooth(request),
  dispose: () => {
    client?.dispose()
    client = null
  },
}
