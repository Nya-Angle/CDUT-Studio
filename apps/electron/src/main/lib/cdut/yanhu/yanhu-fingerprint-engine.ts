/**
 * 智联万站指纹伪装引擎（YanhuFingerprintEngine）
 *
 * 针对 CDUT 校内 CAS、办事大厅与青果教务（瑞数动态安全 WAF）实行「网络协议头」层伪装（见规格书 4.2）：
 *   - 会话层：User-Agent 对齐桌面 Chrome 133，注入 Client Hints 请求头；
 *   - 严禁篡改、正则匹配或剥离任何 Cookie：页面级 Cookie 与瑞数动态签名
 *     100% 交由 Chromium 原生网络栈与 WAF 运行时自行管理。
 *
 * 说明：`navigator.webdriver` 的原生抹除改由 Chromium C++ 引擎级启动开关
 * （`--disable-blink-features=AutomationControlled`）权威完成，替代易被探针通过
 * `Function.prototype.toString` / Realm 对比识破的 JS 原型链劫持与 CDP 主世界注入；
 * window.chrome / PDF 插件 / 语言等运行时层补齐由 `yanhu-preload.ts` 在最早时序注入主世界。
 */

import type { Session } from 'electron'
import {
  YANHU_CHROME_MAJOR,
  YANHU_CHROME_VERSION,
  YANHU_CLIENT_HINTS,
  YANHU_USER_AGENT,
} from './yanhu-constants'

const IS_MAC = process.platform === 'darwin'

/** 请求语言头（与 navigator.languages 对齐） */
export const YANHU_ACCEPT_LANGUAGES = 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'

/**
 * CDP `Emulation.setUserAgentOverride` 的 userAgentMetadata。
 * 该元数据会让 Chromium 自行生成与 UA 完全一致的 `sec-ch-ua*` 高熵提示。
 */
export const YANHU_USER_AGENT_METADATA = {
  brands: [
    { brand: 'Not(A:Brand', version: '99' },
    { brand: 'Google Chrome', version: YANHU_CHROME_MAJOR },
    { brand: 'Chromium', version: YANHU_CHROME_MAJOR },
  ],
  fullVersionList: [
    { brand: 'Not(A:Brand', version: '99.0.0.0' },
    { brand: 'Google Chrome', version: YANHU_CHROME_VERSION },
    { brand: 'Chromium', version: YANHU_CHROME_VERSION },
  ],
  fullVersion: YANHU_CHROME_VERSION,
  platform: IS_MAC ? 'macOS' : 'Windows',
  platformVersion: IS_MAC ? '14.7.1' : '15.0.0',
  architecture: IS_MAC ? 'arm' : 'x86',
  model: '',
  mobile: false,
  bitness: '64',
  wow64: false,
} as const

/** 静态资源后缀正则（用于判断校内子资源） */
export const STATIC_ASSET_REGEX = /\.(js|css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot)(\?.*)?$/i

/**
 * 静态资源请求类型白名单。
 *
 * 严格收敛至纯静态资源，严禁包含 `xhr` / `webSocket` 等业务请求类型：
 * 瑞数 WAF 校验业务 API 的 `*P` 签名，一旦从 `xhr` 剥离会导致未授权（界面误判「未登录」）与白屏。
 */
export const STATIC_RESOURCE_TYPES = new Set<string>(['stylesheet', 'script', 'image', 'font', 'media'])

/** 判定域名是否属于成理校内（含 cdut.edu.cn 主域与所有 *.cdut.edu.cn 子域） */
export function isCdutDomain(domain: string | undefined): boolean {
  return (
    typeof domain === 'string' &&
    (domain === 'cdut.edu.cn' || domain.endsWith('.cdut.edu.cn'))
  )
}

/**
 * 会话层身份伪装：设置 User-Agent 并注入 Client Hints 请求头。
 *
 * 核心设计原则（零网络黑魔法侵入）：
 *   - 仅对齐桌面 Chrome 133 的 User-Agent 与高熵 Client Hints；
 *   - 严禁在 onBeforeSendHeaders 中篡改、正则匹配或剥离任何 Cookie！
 *   - 页面级 Cookie 与瑞数动态签名 100% 由 Chromium 原生网络栈和 WAF 运行时自行管理，
 *     确保同步 AJAX、轮播图数据与单点登录凭据传输拥有绝对纯净的网络环境。
 */
export function applyYanhuSessionIdentity(ses: Session): void {
  try {
    ses.setUserAgent(YANHU_USER_AGENT, YANHU_ACCEPT_LANGUAGES)
  } catch (err) {
    console.warn('[智联万站] 设置 User-Agent 失败:', err)
  }

  try {
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
      const requestHeaders: Record<string, string> = { ...details.requestHeaders }
      requestHeaders['User-Agent'] = YANHU_USER_AGENT
      requestHeaders['Accept-Language'] = YANHU_ACCEPT_LANGUAGES
      // 无条件对齐 Client Hints，覆盖 Electron 内核自带的高版本提示，确保与 UA 一致
      for (const [key, value] of Object.entries(YANHU_CLIENT_HINTS)) {
        requestHeaders[key] = value
      }

      // 保证问渠播放与视频下载请求的 Referer 始终为合法的课堂源，防止 CDN 防盗链返回 403
      if (details.url.includes('wqxt.cdut.edu.cn')) {
        const currentRef = requestHeaders['Referer'] || requestHeaders['referer'] || ''
        if (!currentRef || currentRef.includes('play.wqxt.cdut.edu.cn')) {
          requestHeaders['Referer'] = 'https://classroom.wqxt.cdut.edu.cn/'
        }
      }

      callback({ requestHeaders })
    })
  } catch (err) {
    console.warn('[智联万站] 注入 Client Hints 请求头失败:', err)
  }
}

/**
 * 指纹伪装引擎（会话级）。
 *
 * 会话级配置幂等且全局唯一；运行时层（window.chrome / PDF 插件 / 语言等）
 * 由 `yanhu-preload.ts` 在最早时序负责注入主世界。
 */
export class YanhuFingerprintEngine {
  private readonly configuredSessions = new WeakSet<Session>()

  /** 配置会话身份（幂等） */
  public configureSession(ses: Session): void {
    if (this.configuredSessions.has(ses)) return
    this.configuredSessions.add(ses)
    applyYanhuSessionIdentity(ses)
  }
}

/** 全局单例 */
export const yanhuFingerprintEngine = new YanhuFingerprintEngine()
