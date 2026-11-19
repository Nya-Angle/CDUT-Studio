import { ipcMain, type IpcMainInvokeEvent } from 'electron'

type IpcHandler = (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown

/**
 * 为重型业务子系统注册惰性 IPC 代理。
 *
 * 启动时仅登记轻量的占位处理器，不加载对应子系统的源码与第三方依赖；
 * 仅当渲染进程首次调用该域的任意 IPC 通道时，才同步/异步加载子系统并透明转发本次请求。
 */
export function registerLazyIpcDomain(
  channels: readonly string[],
  loadAndRegister: () => void | Promise<void>,
): void {
  let loaded = false
  let loadingPromise: Promise<void> | null = null
  const capturedHandlers = new Map<string, IpcHandler>()

  const ensureLoaded = async (): Promise<void> => {
    if (loaded) return
    if (loadingPromise) {
      await loadingPromise
      return
    }

    loadingPromise = (async () => {
      for (const ch of channels) {
        ipcMain.removeHandler(ch)
      }

      const originalHandle = ipcMain.handle.bind(ipcMain)
      ipcMain.handle = ((channel: string, listener: IpcHandler) => {
        capturedHandlers.set(channel, listener)
        return originalHandle(channel, listener)
      }) as typeof ipcMain.handle

      try {
        await loadAndRegister()
        loaded = true
      } finally {
        ipcMain.handle = originalHandle
      }
    })()

    try {
      await loadingPromise
    } finally {
      if (!loaded) {
        loadingPromise = null
      }
    }
  }

  for (const channel of channels) {
    ipcMain.handle(channel, async (event: IpcMainInvokeEvent, ...args: unknown[]) => {
      await ensureLoaded()
      const realHandler = capturedHandlers.get(channel)
      if (!realHandler) {
        throw new Error(`[LazyIPC] 通道 "${channel}" 在子系统加载后未注册处理器`)
      }
      return realHandler(event, ...args)
    })
  }
}
