/**
 * CSLab 主进程事件订阅 Hook
 *
 * 将摄取进度、资产变更、胶囊陈旧事件写入 Jotai，并回调工作台刷新数据。
 */

import { useEffect, useRef } from 'react'
import { useSetAtom } from 'jotai'
import type {
  CsLabCustomToolScan,
  CsLabDagJobsCancelledEvent,
  CsLabHpcJobEvent,
  CsLabHpcMfaRequest,
  CsLabPlotUpdatedEvent,
  CsLabStructureFocusedEvent,
  CsLabShareStatusEvent,
  CsLabVaultChangedEvent,
  CsLabZoteroStatusEvent,
  CsLabZoteroSyncedEvent,
} from '@profer/shared'
import {
  cslabHpcJobsAtom,
  cslabHpcMfaAtom,
  cslabIngestProgressAtom,
  cslabShareStatusAtom,
  cslabStaleCapsulesAtom,
  cslabToolDepsProgressAtom,
  cslabZoteroStatusAtom,
} from '@/atoms/cslab-atoms'

export interface CsLabEventHandlers {
  onAssetChanged?: () => void
  onStale?: (capsuleIds: string[]) => void
  onZoteroSynced?: (event: CsLabZoteroSyncedEvent) => void
  onZoteroStatus?: (event: CsLabZoteroStatusEvent) => void
  onVaultChanged?: (event: CsLabVaultChangedEvent) => void
  onDagJobsCancelled?: (event: CsLabDagJobsCancelledEvent) => void
  onToolsChanged?: (event: { labId: string; scan: CsLabCustomToolScan }) => void
  onShareStatus?: (event: CsLabShareStatusEvent) => void
  onHpcJob?: (event: CsLabHpcJobEvent) => void
  onHpcMfa?: (event: CsLabHpcMfaRequest) => void
  onPlotUpdated?: (event: CsLabPlotUpdatedEvent) => void
  onStructureFocused?: (event: CsLabStructureFocusedEvent) => void
}

export function useCsLabEvents(labId: string | null, handlers: CsLabEventHandlers = {}): void {
  const setProgress = useSetAtom(cslabIngestProgressAtom)
  const setStale = useSetAtom(cslabStaleCapsulesAtom)
  const setZoteroStatus = useSetAtom(cslabZoteroStatusAtom)
  const setToolProgress = useSetAtom(cslabToolDepsProgressAtom)
  const setShareStatus = useSetAtom(cslabShareStatusAtom)
  const setHpcJobs = useSetAtom(cslabHpcJobsAtom)
  const setHpcMfa = useSetAtom(cslabHpcMfaAtom)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!labId) return

    const offProgress = window.electronAPI.cslab.onIngestProgress((progress) => {
      if (progress.labId !== labId) return
      setProgress(progress)
    })

    const offAsset = window.electronAPI.cslab.onAssetChanged((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onAssetChanged?.()
    })

    const offStale = window.electronAPI.cslab.onCapsuleStale((event) => {
      if (event.labId !== labId) return
      setStale((previous) => {
        const next = new Set(previous)
        for (const id of event.capsuleIds) next.add(id)
        return next
      })
      handlersRef.current.onStale?.(event.capsuleIds)
    })

    const offZoteroSynced = window.electronAPI.cslab.onZoteroSynced((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onZoteroSynced?.(event)
    })

    const offZoteroStatus = window.electronAPI.cslab.onZoteroStatus((event) => {
      if (event.labId !== labId) return
      setZoteroStatus(event.status)
      handlersRef.current.onZoteroStatus?.(event)
    })

    const offToolProgress = window.electronAPI.cslab.onToolDepsProgress((progress) => {
      if (progress.labId !== labId) return
      setToolProgress(progress)
    })

    const offVaultChanged = window.electronAPI.cslab.onVaultChanged((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onVaultChanged?.(event)
    })

    const offDagJobsCancelled = window.electronAPI.cslab.onDagJobsCancelled((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onDagJobsCancelled?.(event)
    })

    const offToolsChanged = window.electronAPI.cslab.onToolsChanged((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onToolsChanged?.(event)
    })

    const offShareStatus = window.electronAPI.cslab.onShareStatus((event) => {
      if (event.labId !== labId) return
      setShareStatus(event)
      handlersRef.current.onShareStatus?.(event)
      if (event.status === 'online') handlersRef.current.onAssetChanged?.()
    })

    const offHpcJob = window.electronAPI.cslab.onHpcJob((event) => {
      if (event.labId !== labId) return
      setHpcJobs((previous) => {
        const next = previous.filter((job) => job.key !== event.job.key)
        next.unshift(event.job)
        return next.sort((left, right) => right.submittedAt - left.submittedAt)
      })
      handlersRef.current.onHpcJob?.(event)
    })

    const offHpcMfa = window.electronAPI.cslab.onHpcMfa((event) => {
      if (event.labId !== labId) return
      setHpcMfa(event)
      handlersRef.current.onHpcMfa?.(event)
    })

    const offPlotUpdated = window.electronAPI.cslab.onPlotUpdated((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onPlotUpdated?.(event)
    })

    const offStructureFocused = window.electronAPI.cslab.onStructureFocused((event) => {
      if (event.labId !== labId) return
      handlersRef.current.onStructureFocused?.(event)
    })

    return () => {
      offProgress()
      offAsset()
      offStale()
      offZoteroSynced()
      offZoteroStatus()
      offToolProgress()
      offVaultChanged()
      offDagJobsCancelled()
      offToolsChanged()
      offShareStatus()
      offHpcJob()
      offHpcMfa()
      offPlotUpdated()
      offStructureFocused?.()
    }
  }, [labId, setProgress, setStale, setToolProgress, setZoteroStatus, setShareStatus, setHpcJobs, setHpcMfa])
}
