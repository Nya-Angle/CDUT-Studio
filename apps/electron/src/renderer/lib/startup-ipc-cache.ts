import type { AgentWorkspace } from '@profer/shared'
import type { AppSettings } from '../../types'

const STARTUP_CACHE_TTL_MS = 2000

let settingsCache: { promise: Promise<AppSettings>; expiresAt: number } | null = null
let workspacesCache: { promise: Promise<AgentWorkspace[]>; expiresAt: number } | null = null

/**
 * 合并首屏挂载期高频重复的 getSettings() IPC 调用。
 * 在 2 秒启动窗口内复用同一次主进程查询，避免 6+ 个 Initializer 重复读盘。
 */
export function getSettingsCoalesced(): Promise<AppSettings> {
  const now = Date.now()
  if (settingsCache && now < settingsCache.expiresAt) {
    return settingsCache.promise
  }
  const promise = window.electronAPI.getSettings().catch((err) => {
    settingsCache = null
    throw err
  })
  settingsCache = { promise, expiresAt: now + STARTUP_CACHE_TTL_MS }
  return promise
}

/**
 * 合并首屏挂载期重复的 listAgentWorkspaces() IPC 调用。
 */
export function listAgentWorkspacesCoalesced(): Promise<AgentWorkspace[]> {
  const now = Date.now()
  if (workspacesCache && now < workspacesCache.expiresAt) {
    return workspacesCache.promise
  }
  const promise = window.electronAPI.listAgentWorkspaces().catch((err) => {
    workspacesCache = null
    throw err
  })
  workspacesCache = { promise, expiresAt: now + STARTUP_CACHE_TTL_MS }
  return promise
}

/**
 * 在首帧渲染完成且主线程空闲后错峰执行非首屏初始化任务，削平启动内存尖峰。
 */
export function scheduleDeferredStartupTask(task: () => void, minDelayMs: number): () => void {
  let cancelled = false
  let idleId: number | null = null
  const timerId = window.setTimeout(() => {
    if (cancelled) return
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(() => {
        if (!cancelled) task()
      }, { timeout: 1000 })
    } else {
      task()
    }
  }, minDelayMs)

  return () => {
    cancelled = true
    window.clearTimeout(timerId)
    const win = window as Window & { cancelIdleCallback?: (id: number) => void }
    if (idleId !== null && typeof win.cancelIdleCallback === 'function') {
      win.cancelIdleCallback(idleId)
    }
  }
}
