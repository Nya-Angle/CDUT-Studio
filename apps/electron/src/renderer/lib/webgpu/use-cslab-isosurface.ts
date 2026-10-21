/**
 * CSLab 等值面 Hook
 *
 * 300ms 防抖 + requestAnimationFrame 合并；WebGPU 优先，失败自动回退到 CPU Worker。
 */

import * as React from 'react'
import type { CsLabIsoMesh, CsLabVolumeGrid } from '@profer/shared'
import { cslabWorkers } from '@/lib/cslab/cslab-worker-client'
import { extractIsosurfaceWebGpu } from './webgpu-isosurface'

export interface UseCsLabIsosurfaceInput {
  grid: CsLabVolumeGrid | null
  isovalue: number
  enabled: boolean
}

export interface UseCsLabIsosurfaceResult {
  positive: CsLabIsoMesh | null
  negative: CsLabIsoMesh | null
  backend: 'webgpu' | 'cpu' | null
  busy: boolean
  error: string | null
}

export function useCsLabIsosurface(input: UseCsLabIsosurfaceInput): UseCsLabIsosurfaceResult {
  const { grid, isovalue, enabled } = input
  const [positive, setPositive] = React.useState<CsLabIsoMesh | null>(null)
  const [negative, setNegative] = React.useState<CsLabIsoMesh | null>(null)
  const [backend, setBackend] = React.useState<'webgpu' | 'cpu' | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const sequence = React.useRef(0)

  React.useEffect(() => {
    if (!enabled || !grid) {
      setPositive(null)
      setNegative(null)
      setBackend(null)
      setError(null)
      return
    }

    const current = sequence.current + 1
    sequence.current = current
    let cancelled = false
    let frame = 0

    const run = async (): Promise<void> => {
      if (cancelled) return
      setBusy(true)
      setError(null)
      const magnitude = Math.abs(isovalue)

      try {
        const [gpuPositive, gpuNegative] = await Promise.all([
          extractIsosurfaceWebGpu(grid, magnitude),
          extractIsosurfaceWebGpu(grid, -magnitude),
        ])
        if (cancelled) return
        if (gpuPositive && gpuNegative) {
          setPositive(gpuPositive)
          setNegative(gpuNegative)
          setBackend('webgpu')
          return
        }

        const [cpuPositive, cpuNegative] = await Promise.all([
          cslabWorkers.isosurface(grid, magnitude),
          cslabWorkers.isosurface(grid, -magnitude),
        ])
        if (cancelled) return
        setPositive(cpuPositive)
        setNegative(cpuNegative)
        setBackend('cpu')
      } catch (failure) {
        if (cancelled) return
        setError(failure instanceof Error ? failure.message : String(failure))
        setPositive(null)
        setNegative(null)
        setBackend(null)
      } finally {
        if (!cancelled) setBusy(false)
      }
    }

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(() => {
        void run()
      })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [enabled, grid, isovalue])

  return { positive, negative, backend, busy, error }
}
