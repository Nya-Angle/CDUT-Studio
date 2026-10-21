/**
 * CSLab 曲线拟合 Worker
 */

import { fitPeaks, smoothSeries } from '@profer/shared'
import type {
  CsLabFittingRequest,
  CsLabWorkerResponse,
} from '../lib/cslab/cslab-worker-protocol'

interface WorkerScope {
  onmessage: ((event: MessageEvent<CsLabFittingRequest>) => void) | null
  postMessage(message: unknown): void
}

const scope = self as unknown as WorkerScope

scope.onmessage = (event) => {
  const request = event.data
  const respond = (response: CsLabWorkerResponse): void => scope.postMessage(response)

  try {
    if (request.kind === 'fit') {
      respond({ id: request.id, ok: true, result: fitPeaks(request.request) })
      return
    }
    if (request.kind === 'smooth') {
      const y = smoothSeries(request.request)
      respond({
        id: request.id,
        ok: true,
        result: { x: request.request.x.slice(0, y.length), y },
      })
      return
    }
  } catch (error) {
    respond({
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
