/**
 * 敏感 Agent IPC 的主窗口来源校验。
 *
 * 不依赖 Electron 具体实现，主进程可注入真实窗口 getter，单测也可使用最小 fake。
 */
export interface IpcSenderLike {
  isDestroyed(): boolean
}

export interface MainWindowLike {
  isDestroyed(): boolean
  webContents: IpcSenderLike
}

export interface IpcEventLike {
  sender: IpcSenderLike
}

export type MainWindowGetter = () => MainWindowLike | null

/** sender 必须属于当前主窗口，且主窗口及 webContents 都仍然可用。 */
export function isMainWindowSender(event: IpcEventLike, getMainWindow: MainWindowGetter): boolean {
  const mainWindow = getMainWindow()
  if (!mainWindow || mainWindow.isDestroyed()) return false
  if (event.sender.isDestroyed() || mainWindow.webContents.isDestroyed()) return false
  return event.sender === mainWindow.webContents
}

/** 在 IPC handler 开始处拒绝非主窗口、已销毁 sender 或已销毁主窗口。 */
export function assertMainWindowSender(event: IpcEventLike, getMainWindow: MainWindowGetter): void {
  if (!isMainWindowSender(event, getMainWindow)) {
    throw new Error('仅允许 Profer 主窗口调用此 Agent IPC')
  }
}

/**
 * 主进程亲自创建并显式登记的可信次级窗口（科学助理独立窗口）。
 * 使用 WeakSet 避免持有窗口引用导致无法回收。
 */
const trustedSecondarySenders = new WeakSet<object>()

/** 登记可信次级窗口的 webContents；只有主进程创建的窗口才允许登记。 */
export function registerTrustedAgentSender(sender: IpcSenderLike): void {
  trustedSecondarySenders.add(sender as object)
}

/** sender 属于主窗口或已登记的可信次级窗口，且未销毁。 */
export function isTrustedAgentSender(event: IpcEventLike, getMainWindow: MainWindowGetter): boolean {
  if (isMainWindowSender(event, getMainWindow)) return true
  if (event.sender.isDestroyed()) return false
  return trustedSecondarySenders.has(event.sender as object)
}

/** 敏感 Agent IPC 的统一入口：主窗口或可信次级窗口。 */
export function assertTrustedAgentSender(event: IpcEventLike, getMainWindow: MainWindowGetter): void {
  if (!isTrustedAgentSender(event, getMainWindow)) {
    throw new Error('仅允许主窗口或科学助理窗口调用此 Agent IPC')
  }
}
