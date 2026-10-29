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
 * 安全边界：本 Preload **不向页面暴露任何特权 API**，只做单向环境伪装。
 */

import { webFrame } from 'electron'
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

applyYanhuFingerprint()
applyWqxtCleaner()
