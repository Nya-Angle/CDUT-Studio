/**
 * 智联万站独立 Preload —— 最早时序防侦测加固
 *
 * 该脚本被 `WebContentsView` 以 `preload` 选项加载，在页面任何脚本执行前运行，
 * 将指纹伪装脚本注入**主世界**（`webFrame.executeJavaScript` 作用于页面主世界）。
 *
 * 与主进程 CDP `Page.addScriptToEvaluateOnNewDocument` 互为兜底：
 *   - CDP 注入是权威的 document-start 时序（先于任何内联/外链脚本）；
 *   - 本 Preload 注入保证即使 CDP 不可用（调试器被占用等）也不留指纹破绽。
 *
 * 安全边界：本 Preload **不向页面暴露任何特权 API**，只做单向环境伪装与内部事件监听。
 */

import { ipcRenderer, webFrame } from 'electron'
import { buildYanhuFingerprintScript } from './yanhu-fingerprint-script'
import { buildWqxtLivingRoomCleanerScript } from './wqxt-livingroom-cleaner'

function applyYanhuFingerprint(): void {
  try {
    // 注入到页面主世界（非隔离世界），确保 navigator / window.chrome 等被真实覆盖
    void webFrame.executeJavaScript(buildYanhuFingerprintScript()).catch(() => {
      // 页面可能尚未就绪或已销毁，忽略
    })
  } catch (err) {
    // 绝不能因注入异常影响页面加载
    console.warn('[智联万站·Preload] 指纹注入失败:', err)
  }
}

function applyWqxtCleaner(): void {
  try {
    // 脚本自检 hostname：非问渠课堂页面直接返回，对智联万站零影响
    void webFrame.executeJavaScript(buildWqxtLivingRoomCleanerScript()).catch(() => {
      // 页面可能尚未就绪或已销毁，忽略
    })
  } catch (err) {
    // 绝不能因注入异常影响页面加载
    console.warn('[AI 问渠学堂·Preload] 页面净化脚本注入失败:', err)
  }
}

function applyWqxtDownloadBridge(): void {
  try {
    if (typeof window === 'undefined') return
    // 仅在顶层窗口挂载桥接，避免子 iframe 重复监听并向主进程同时发送多个相同下载请求
    if (window.top !== window) return
    const w = window as any
    if (w.__profer_wqxt_download_bridge_installed) return
    w.__profer_wqxt_download_bridge_installed = true

    window.addEventListener('message', (event) => {
      // 仅接收来自当前主窗口自身的合法下载指令，过滤跨帧或非本窗干扰
      if (event.source !== window) return
      if (
        event &&
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === '__profer_wqxt_download'
      ) {
        const url = typeof event.data.url === 'string' ? event.data.url : ''
        const filename = typeof event.data.filename === 'string' ? event.data.filename : undefined
        if (url) {
          ipcRenderer.send('yanhu-download-video', { url, filename })
        }
      }
    })
  } catch (err) {
    console.warn('[AI 问渠学堂·Preload] 下载桥接监听失败:', err)
  }
}

applyYanhuFingerprint()
applyWqxtCleaner()
applyWqxtDownloadBridge()
