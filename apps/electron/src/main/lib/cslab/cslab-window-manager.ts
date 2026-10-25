/**
 * CDUT Science 科学助理独立窗口（单例）
 *
 * 与主窗口共享同一份 preload，因此天然拥有 window.electronAPI 全量能力；
 * 窗口生命周期与主窗口联动，上下文经主进程 Map 中转，避免长提示词塞进 URL。
 */

import { app, BrowserWindow, screen, shell } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type {
  CsLabAgentContext,
  CsLabAgentWindowInput,
  CsLabAgentWindowRef,
} from '@profer/shared'
import { CSLAB_IPC_CHANNELS } from '@profer/shared'
import { VITE_DEV_SERVER_URL } from '../config-paths'
import { registerTrustedAgentSender } from '../ipc-sender-guard'
import { getPersistableMainWindowState } from '../main-window-lifecycle'
import { getMainWindow } from '../main-window-state'
import { getSettings, updateSettings } from '../settings-service'
import { getLab } from './cslab-manager'

const DEFAULT_WIDTH = 480
const MIN_WIDTH = 400
const MIN_HEIGHT = 560
const DEFAULT_HEIGHT = 800
const AGENT_WINDOW_TITLE = 'CDUT Science · 科学助理'

let agentWindow: BrowserWindow | null = null
let agentWindowId: string | null = null
let agentWindowLabId: string | null = null
/** 每个助理窗口最近一次上下文；渲染层挂载时兜底拉取，避免 did-finish-load 竞态丢消息。 */
const contextByWindowId = new Map<string, CsLabAgentContext>()

function makeWindowId(): string {
  return `science-agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getIconPath(): string | undefined {
  // 与 planning-window 一致：开发态由 build:resources 复制到 dist/resources。
  const resourcesDir = app.isPackaged ? process.resourcesPath : join(__dirname, 'resources')
  const filename =
    process.platform === 'darwin'
      ? 'icon.icns'
      : process.platform === 'win32'
        ? 'icon.ico'
        : 'icon.png'
  const iconPath = join(resourcesDir, filename)
  return existsSync(iconPath) ? iconPath : undefined
}

/** 默认窗口大小位置：全桌面（workArea）的左半部分 */
function getInitialBounds(): Electron.Rectangle {
  const main = getMainWindow()
  const hasMain = Boolean(main && !main.isDestroyed())
  const display = hasMain
    ? screen.getDisplayMatching(main!.getBounds())
    : screen.getPrimaryDisplay()
  const area = display.workArea

  // 严格要求：默认窗口大小位置彻底更改为全桌面的左半部分
  const width = Math.floor(area.width / 2)
  const height = area.height
  const x = area.x
  const y = area.y

  return { x, y, width, height }
}

function ensureWindowOnScreen(win: BrowserWindow): void {
  const bounds = win.getBounds()
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2
  const visible = screen.getAllDisplays().some((display) => {
    const area = display.workArea
    return (
      centerX >= area.x &&
      centerX <= area.x + area.width &&
      centerY >= area.y &&
      centerY <= area.y + area.height
    )
  })
  if (visible) return

  const area = screen.getPrimaryDisplay().workArea
  win.setPosition(
    area.x + Math.round((area.width - bounds.width) / 2),
    area.y + Math.round((area.height - bounds.height) / 2),
  )
}

function persistWindowState(win: BrowserWindow): void {
  const state = getPersistableMainWindowState(win)
  if (!state) return
  try {
    updateSettings({ scienceAgentWindowState: state })
  } catch (error) {
    console.error('[科学助理] 保存窗口状态失败:', error)
  }
}

function loadAgentWindow(
  win: BrowserWindow,
  labId: string,
  windowId: string,
  focusSessionId?: string,
): void {
  const focusQuery = focusSessionId ? `&focusSessionId=${encodeURIComponent(focusSessionId)}` : ''
  if (!app.isPackaged) {
    void win.loadURL(
      `${VITE_DEV_SERVER_URL}?window=science-agent&labId=${encodeURIComponent(labId)}&windowId=${encodeURIComponent(windowId)}${focusQuery}`,
    )
    return
  }
  void win.loadFile(join(__dirname, 'renderer', 'index.html'), {
    query: {
      window: 'science-agent',
      labId,
      windowId,
      ...(focusSessionId ? { focusSessionId } : {}),
    },
  })
}

/** 最小化状态下先 restore，避免 Windows 任务栏恢复失效。 */
function focusAgentWindow(win: BrowserWindow): void {
  if (win.isDestroyed()) return
  ensureWindowOnScreen(win)
  if (win.isMinimized()) win.restore()
  win.show()
  win.focus()
}

function pushContext(win: BrowserWindow, context: CsLabAgentContext): void {
  if (win.isDestroyed()) return
  const send = (): void => {
    if (win.isDestroyed()) return
    win.webContents.send(CSLAB_IPC_CHANNELS.ON_AGENT_CONTEXT, context)
  }
  if (win.webContents.isLoading()) {
    win.webContents.once('did-finish-load', send)
  } else {
    send()
  }
}

function createAgentWindow(
  labId: string,
  context?: CsLabAgentContext,
  focusSessionId?: string,
): BrowserWindow {
  const savedState = getSettings().scienceAgentWindowState
  const isMac = process.platform === 'darwin'
  const isWindows = process.platform === 'win32'
  const titleBarOptions = isMac
    ? {
        titleBarStyle: 'hiddenInset' as const,
        trafficLightPosition: { x: 14, y: 16 },
      }
    : isWindows
      ? { titleBarStyle: 'hidden' as const }
      : {}

  const windowId = makeWindowId()
  agentWindowId = windowId
  agentWindowLabId = labId
  contextByWindowId.clear()
  if (context) contextByWindowId.set(windowId, context)

  const win = new BrowserWindow({
    ...(savedState
      ? { x: savedState.x, y: savedState.y, width: savedState.width, height: savedState.height }
      : getInitialBounds()),
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    title: AGENT_WINDOW_TITLE,
    icon: getIconPath(),
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    ...titleBarOptions,
  })
  agentWindow = win
  registerTrustedAgentSender(win.webContents)

  // Electron 开发壳可能不稳定继承构造参数中的 Windows 图标，显式补设一次。
  if (isWindows) {
    const iconPath = getIconPath()
    if (iconPath) win.setIcon(iconPath)
  }

  ensureWindowOnScreen(win)
  loadAgentWindow(win, labId, windowId, focusSessionId)

  win.once('ready-to-show', () => {
    if (win.isDestroyed()) return
    if (savedState?.isMaximized) win.maximize()
    win.show()
    win.focus()
    // 初始上下文由渲染层挂载时通过 getCsLabAgentWindowContext 读取，
    // 这里不再重复推送，避免覆盖用户已输入的草稿。
  })

  let saveTimer: ReturnType<typeof setTimeout> | null = null
  const flushState = (): void => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    persistWindowState(win)
  }
  const scheduleStateSave = (): void => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveTimer = null
      persistWindowState(win)
    }, 500)
  }
  win.on('resize', scheduleStateSave)
  win.on('move', scheduleStateSave)
  win.on('maximize', scheduleStateSave)
  win.on('unmaximize', scheduleStateSave)
  win.on('close', flushState)

  win.webContents.on('will-navigate', (event, url) => {
    if (!app.isPackaged && url.startsWith(VITE_DEV_SERVER_URL)) return
    event.preventDefault()
    if (url.startsWith('http://') || url.startsWith('https://')) void shell.openExternal(url)
  })
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  win.on('closed', () => {
    if (agentWindow === win) agentWindow = null
    if (agentWindowId) contextByWindowId.delete(agentWindowId)
    agentWindowId = null
    agentWindowLabId = null
  })

  return win
}

/** 打开（或聚焦）科学助理窗口；切换实验室时重载渲染层。 */
export function openCsLabAgentWindow(input: CsLabAgentWindowInput): CsLabAgentWindowRef | null {
  if (!getLab(input.labId)) return null

  const existing = agentWindow
  if (existing && !existing.isDestroyed()) {
    if (agentWindowLabId !== input.labId) {
      if (agentWindowId) contextByWindowId.delete(agentWindowId)
      const windowId = makeWindowId()
      agentWindowId = windowId
      agentWindowLabId = input.labId
      if (input.context) contextByWindowId.set(windowId, input.context)
      loadAgentWindow(existing, input.labId, windowId, input.focusSessionId)
    } else if (input.context) {
      if (agentWindowId) contextByWindowId.set(agentWindowId, input.context)
      pushContext(existing, input.context)
    }
    focusAgentWindow(existing)
    return { windowId: agentWindowId ?? '', labId: input.labId }
  }

  createAgentWindow(input.labId, input.context, input.focusSessionId)
  return { windowId: agentWindowId ?? '', labId: input.labId }
}

/** 把上下文投递到助理窗口；窗口不存在时自动创建。 */
export function sendCsLabAgentContext(context: CsLabAgentContext): { delivered: boolean } {
  if (!getLab(context.labId)) return { delivered: false }

  const existing = agentWindow
  if (!existing || existing.isDestroyed()) {
    const ref = openCsLabAgentWindow({ labId: context.labId, context })
    return { delivered: Boolean(ref) }
  }

  if (agentWindowLabId !== context.labId) {
    const ref = openCsLabAgentWindow({ labId: context.labId, context })
    return { delivered: Boolean(ref) }
  }

  if (agentWindowId) contextByWindowId.set(agentWindowId, context)
  pushContext(existing, context)
  focusAgentWindow(existing)
  return { delivered: true }
}

/** 渲染层挂载时读取最近一次上下文（与事件推送互为兜底）。 */
export function getCsLabAgentWindowContext(windowId: string): CsLabAgentContext | null {
  return contextByWindowId.get(windowId) ?? null
}

/** 实验室被彻底删除后关闭其助理窗口，避免孤立窗口继续请求不存在的沙箱。 */
export function closeCsLabAgentWindowForLab(labId: string): void {
  if (!agentWindow || agentWindow.isDestroyed() || agentWindowLabId !== labId) return
  persistWindowState(agentWindow)
  agentWindow.destroy()
  agentWindow = null
  agentWindowId = null
  agentWindowLabId = null
  contextByWindowId.clear()
}

/** 应用退出或主窗口关闭时联动销毁。 */
export function destroyCsLabAgentWindow(): void {
  if (!agentWindow || agentWindow.isDestroyed()) {
    agentWindow = null
    agentWindowId = null
    agentWindowLabId = null
    contextByWindowId.clear()
    return
  }
  persistWindowState(agentWindow)
  agentWindow.destroy()
  agentWindow = null
  agentWindowId = null
  agentWindowLabId = null
  contextByWindowId.clear()
}
