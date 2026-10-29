/**
 * 智联万站常量与基础契约
 *
 * 职责：集中定义默认入口、域名白名单正则、指纹伪装 UA / Client Hints、
 * 惰性休眠阈值、持久化路径与主题兜底样式，供主进程各服务模块共享。
 *
 * 范围声明：本模块只提供纯常量与纯函数，不产生任何副作用（不创建窗口、不写盘）。
 */

import { join } from 'node:path'
import { WQXT_DEFAULT_HOME_URL, YANHU_DEFAULT_HOME_URL } from '@profer/shared'
import { getConfigDir } from '../../config-paths'

/** 智联万站默认入口：砚湖易办（校内办事大厅升级版），与 @profer/shared 常量保持同源 */
export const YANHU_HOME_URL = YANHU_DEFAULT_HOME_URL

/** AI 问渠学堂默认/保底入口：成都理工大学在线课程中心 */
export const WQXT_HOME_URL = WQXT_DEFAULT_HOME_URL

/** 模拟的真实桌面 Chrome 版本（对齐 Chromium 133 稳定版） */
export const YANHU_CHROME_VERSION = '133.0.0.0'
/** Chrome 主版本号（Client Hints 使用） */
export const YANHU_CHROME_MAJOR = '133'

const IS_MAC = process.platform === 'darwin'

/**
 * 网络层 User-Agent：按宿主平台生成与真实桌面 Chrome 133 完全一致的描述串。
 * 严禁暴露 Electron / Profer 标识。
 */
export const YANHU_USER_AGENT = IS_MAC
  ? `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${YANHU_CHROME_VERSION} Safari/537.36`
  : `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${YANHU_CHROME_VERSION} Safari/537.36`

/**
 * Client Hints 请求头：与 User-Agent 双重对齐，避免站点通过 sec-ch-ua 交叉校验识破。
 * 注意：sec-ch-ua 的取值是带引号的完整字面量（含引号），序列化时不可再包一层引号。
 */
export const YANHU_CLIENT_HINTS: Readonly<Record<string, string>> = {
  'sec-ch-ua': `"Not(A:Brand";v="99", "Google Chrome";v="${YANHU_CHROME_MAJOR}", "Chromium";v="${YANHU_CHROME_MAJOR}"`,
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': IS_MAC ? '"macOS"' : '"Windows"',
}

/**
 * 校内域匹配正则（**不参与放行裁决**）。
 *
 * 智联万站的放行范围已放开为「任意 http/https」，本正则仅供校内专属逻辑复用：
 * 瑞数 *P 签名清洗、教务主框架路由、证书豁免等。
 *
 * 严格匹配 `cdut.edu.cn` 本身及其任意子域，且必须为 http/https；端口可选。
 * 例如 `evil-cdut.edu.cn.phishing.com` 因顶级域不落 `.cdut.edu.cn` 而必然不匹配。
 */
export const CDUT_DOMAIN_REGEX = /^https?:\/\/([a-zA-Z0-9-]+\.)*cdut\.edu\.cn(:\d+)?(\/.*)?$/i

/** 一次性 SSO 票据查询参数名（大小写不敏感）：`ticket` 为 CAS 标准票据，`qzticket` 为青果网关票据 */
export const YANHU_ONE_TIME_TICKET_KEYS = ['ticket', 'qzticket'] as const

/** 判定 URL 是否携带一次性 SSO 票据（`ticket` / `qzticket`） */
export function hasOneTimeTicket(rawUrl: string): boolean {
  return /[?&](ticket|qzticket)=/i.test(rawUrl)
}

/**
 * 剔除 URL 中的一次性 SSO 票据参数（`ticket` / `qzticket`）。
 *
 * CAS 票据为**一次性凭证**：一旦被消费，再用它发起导航必然被网关重定向回 CAS 重新登录，
 * 换取新票返回后 SPA（如 xsqjapp）常常无法完成引导，只渲染出空壳框架——即"只剩框架、内容空白"。
 * 因此票据型 URL 在**落盘持久化 / 休眠唤醒重载 / 任何手动或 AI 触发的刷新**前必须剔除票据。
 */
export function stripOneTimeTicket(rawUrl: string): string {
  if (!rawUrl) return rawUrl
  try {
    const parsed = new URL(rawUrl)
    let changed = false
    for (const key of Array.from(parsed.searchParams.keys())) {
      if ((YANHU_ONE_TIME_TICKET_KEYS as readonly string[]).includes(key.toLowerCase())) {
        parsed.searchParams.delete(key)
        changed = true
      }
    }
    return changed ? parsed.toString() : rawUrl
  } catch {
    return rawUrl
  }
}

/**
 * 是否为「票据型 SSO 受保护应用页」的 URL。
 *
 * 这类页面正常必须由办事大厅注入一次性票据后进入；在**休眠唤醒 / 进程重启恢复**时直接重载其 URL，
 * 会被网关踢去 CAS 换票，返回后 SPA 常常只渲染出空壳（实测：只剩一个空框架、内容全白）。
 * 故恢复这类标签时改为回到站内入口，由用户或模型重新走正常入口流程。
 */
export function isYanhuSsoAppUrl(rawUrl: string): boolean {
  if (!rawUrl) return false
  return /\/xsfw\/sys\//i.test(rawUrl) || /\/jsxsd\//i.test(rawUrl)
}

/** 后台标签休眠阈值：后台标签总数超过该值时，闲置超时的后台标签释放底层 WebContents */
export const YANHU_DORMANT_MAX_BACKGROUND = 10
/** 后台标签闲置多长时间后可被回收（30 分钟） */
export const YANHU_DORMANT_IDLE_MS = 30 * 60 * 1000
/** 单个标签的宽度估算（供休眠阈值与 UI 一致性参考，单位 px） */
export const YANHU_SOFT_TAB_LIMIT = 30

/**
 * 同源同路径「窗口重复打开」合并窗口（毫秒）。
 *
 * 页面一次交互常因三连击 / 自动重试引发多次 `window.open`；窗口内命中同一
 * `origin + pathname` 时不再新建标签，改为激活既有标签，根除多开重复 / 残缺标签。
 */
export const YANHU_WINDOW_OPEN_COALESCE_MS = 1500

/**
 * 智联万站持久化目录与标签拓扑文件路径。
 *
 * @returns ~/.cdutai/yanhu-express/tabs.json
 */
export function getYanhuTabsPath(): string {
  return join(getConfigDir(), 'yanhu-express', 'tabs.json')
}

/**
 * AI 问渠学堂标签拓扑文件路径（与智联万站互相隔离）。
 *
 * @returns ~/.cdutai/yanhu-express/wqxt-tabs.json
 */
export function getWqxtTabsPath(): string {
  return join(getConfigDir(), 'yanhu-express', 'wqxt-tabs.json')
}

/**
 * 智联万站事件审计日志路径。
 *
 * @returns ~/.cdutai/yanhu-express/events.log
 *
 * 用于把「导航 / 重新加载 / loadURL / 400 自愈」等会改变页面状态的关键事件落盘，
 * 让「白屏 / 意外跳转」这类无痕事故下次可精确定位触发源。
 */
export function getYanhuEventsLogPath(): string {
  return join(getConfigDir(), 'yanhu-express', 'events.log')
}

/** 事件日志体积上限（字节）：超过后滚动为 events.log.1，避免无界增长 */
export const YANHU_EVENTS_LOG_MAX_BYTES = 2 * 1024 * 1024

/** 智联万站拓扑文件格式版本 */
export const YANHU_TABS_STORE_VERSION = 1

/** 主题兜底：网页 `prefers-color-scheme` 仿真失败时注入的细滚动条样式（深色） */
export const YANHU_DARK_SCROLLBAR_CSS = `
  html { color-scheme: dark; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, .42); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(161, 161, 170, .62); }
`

/** 主题兜底：网页 `prefers-color-scheme` 仿真失败时注入的细滚动条样式（浅色） */
export const YANHU_LIGHT_SCROLLBAR_CSS = `
  html { color-scheme: light; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(113, 113, 122, .42); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(113, 113, 122, .62); }
`

/** 深色模式下底层 WebContentsView 底色（与 CDUT 专区背景一致的深邃色，防白闪） */
export const YANHU_DARK_VIEW_BACKGROUND = '#09090b'
/** 浅色模式下底层 WebContentsView 底色（纯白） */
export const YANHU_LIGHT_VIEW_BACKGROUND = '#ffffff'

/** 依据明暗返回底层视图底色 */
export function resolveYanhuViewBackground(isDark: boolean): string {
  return isDark ? YANHU_DARK_VIEW_BACKGROUND : YANHU_LIGHT_VIEW_BACKGROUND
}
