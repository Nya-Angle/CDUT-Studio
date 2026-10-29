/**
 * 智联万站主调度服务（YanhuExpressManager）
 *
 * 职责（见规格书 4.3 / 4.4 / 4.6）：
 *   - 管理 `WebContentsView` 实例池：多标签新建 / 关闭 / 排序 / 激活切换；
 *   - 惰性恢复：重启后仅实例化激活标签，其余置休眠，点击时唤醒；
 *   - 内存休眠守护：闲置且超阈值的后台标签释放底层 WebContents，仅保留元数据；
 *   - 安全网关：主框架导航 / 新窗口 / 地址栏三处统一裁决，放行任意 http/https 网页地址，
 *     仅非网页协议（mailto / javascript / file 等）转内置拦截页；
 *   - 主题跟随：底色防白闪 + 网页媒体仿真；
 *   - 复用「特区账户」分区（persist:cdut-auth-zone）实现免密畅游；
 *   - 底层静默 CDP 总线：为二期 AI 自动化预留。
 *
 * 边界声明：本服务不向前端暴露任何调试入口；登录态复用由分区 Session 自然承载，
 * 不主动嗅探或解密内网 Cookie。
 */

import { join } from 'node:path'
import { BrowserWindow, Menu, View, WebContentsView, clipboard, ipcMain, session as electronSession, shell, type Session, type WebContents } from 'electron'
import {
  buildYanhuBlockedUrl,
  isYanhuBlockedUrl,
  parseCertInterstitialSentinel,
  parseYanhuBlockedTarget,
  YANHU_EXPRESS_IPC_CHANNELS,
  WQXT_CLASSROOM_HOSTNAME,
  type YanhuBrowserScope,
  type YanhuConsoleEntry,
  type YanhuCreateTabInput,
  type YanhuLoadedResource,
  type YanhuNavigateInput,
  type YanhuNetworkEntry,
  type YanhuScopeInput,
  type YanhuTabItem,
  type YanhuTabsState,
  type YanhuUrlChangedEvent,
  type YanhuViewLayout,
} from '@profer/shared'
import { CDUT_AUTH_CERT_SESSION_ID, CDUT_AUTH_PARTITION } from '../cdut-auth-manager'
import {
  allowDomainTemporarily,
  buildSecurityInterstitialHtml,
  getCertBlockedRecord,
  revokeTabGrants,
  wipeSessionGrants,
} from '../../security/cert-blacklist'
import { resolveYanhuCertBlockTarget } from './yanhu-cert-interstitial'
import {
  YANHU_DORMANT_IDLE_MS,
  YANHU_DORMANT_MAX_BACKGROUND,
  WQXT_HOME_URL,
  YANHU_HOME_URL,
  YANHU_WINDOW_OPEN_COALESCE_MS,
  hasOneTimeTicket,
  isYanhuSsoAppUrl,
  resolveYanhuViewBackground,
  stripOneTimeTicket,
} from './yanhu-constants'
import { isCdutDomain, isWebUrl, yanhuDomainGatekeeper } from './yanhu-domain-gatekeeper'
import { wqxtTabsStore, yanhuTabsStore, type YanhuTabsStore } from './yanhu-tabs-store'
import { yanhuFingerprintEngine } from './yanhu-fingerprint-engine'
import { yanhuDevToolsHub } from './yanhu-devtools-hub'
import { syncThemeToWebContents, yanhuThemeService } from './yanhu-theme-service'
import { yanhuDiagnosticConsole } from './yanhu-diagnostic-console'
import { stripStaleRuiShuCookies } from './yanhu-cookie-utils'
import { yanhuDomDistillationEngine, type YanhuRawElement } from './yanhu-dom-distillation'
import { logYanhuEvent } from './yanhu-event-log'
import {
  buildWqxtLivingRoomCleanerScript,
  isWqxtWatermarkRequestUrl,
} from './wqxt-livingroom-cleaner'
import {
  buildCrossFrameDrainScript,
  normalizeCrossFrameDrain,
  yanhuStabilizationWatcher,
  type CrossFrameDrainOptions,
  type CrossFrameDrainResult,
  type QuiescenceOptions,
  type QuiescenceResult,
  type StabilizationProbe,
} from './yanhu-stabilization'

/** 标签运行时记录 */
interface YanhuTabRecord {
  id: string
  item: YanhuTabItem
  /** 休眠标签为 null（仅保留元数据） */
  view: WebContentsView | null
  /** 被拦截的外链目标；非空表示当前展示内置拦截卡片 */
  blockedTarget: string | null
  /** 被拦截前所在页面 URL（供「返回上一页」恢复） */
  blockedPreviousUrl: string | null
  /** 被动 400 自愈：当前是否已对 healedUrl 执行过一次摘除签名重试（防死循环） */
  healAttempted: boolean
  /** 触发自愈的导航 URL；成功后复位，避免同一失败 URL 被反复重试 */
  healedUrl: string | null
  /** 本次主框架实际请求的目标 URL（含重定向目标），供证书阻断登记比对与插页重载 */
  lastRequestedUrl: string | null
  /** 最近一次真实落地的页面 URL（不含 data: / chrome-error），供「返回安全页面」精确回退 */
  lastCommittedUrl: string | null
  /** 当前展示证书安全插页时的上下文；null 表示不在插页态 */
  certInterstitial: YanhuCertInterstitialState | null
}

/** 证书安全插页运行时上下文 */
interface YanhuCertInterstitialState {
  /** 被阻断目标的主机名（小写） */
  hostname: string
  /** 用户实际请求的完整目标 URL（含路径与查询参数） */
  targetUrl: string
  /** 「返回安全页面」的落点；null 时回退办事大厅首页 */
  returnUrl: string | null
}

/** 已应用的布局快照 */
interface AppliedLayout {
  rendererInstanceId: string
  layoutSourceRevision: number
  revision: number
  visible: boolean
  viewportBounds: { x: number; y: number; width: number; height: number }
  pageBounds: { x: number; y: number; width: number; height: number }
}

/**
 * 单作用域标签状态桶。
 *
 * 智联万站与 AI 问渠学堂共享同一 CDUT 认证分区、Session 守卫与诊断控制台，
 * 但各自持有独立的标签拓扑、落盘文件与默认/保底入口。
 */
interface YanhuScopeState {
  tabs: Map<string, YanhuTabRecord>
  tabOrder: string[]
  activeTabId: string
  initialized: boolean
  store: YanhuTabsStore
  homeUrl: string
  homeTitle: string
}

const MIN_USABLE_BOUNDS = 4

/** 将绝对路径解析为页面可加载的 yanhu 内置拦截页校验（非哨兵返回 null） */
function blockedTargetOf(url: string): string | null {
  return isYanhuBlockedUrl(url) ? parseYanhuBlockedTarget(url) : null
}

/**
 * 判定导航/加载异常是否为 Chromium「主动打断」(ERR_ABORTED / 错误码 -3)。
 *
 * 用户快速切换标签、点击书签或重定向链被新导航接管时，上一轮 `loadURL` 的 Promise
 * 会以 -3 拒绝。这属于正常并发接管而非故障，若照常告警会造成终端噪声与前端误判，故予以降噪。
 */
function isNavigationAborted(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const { code, errno } = err as { code?: unknown; errno?: unknown }
  return code === 'ERR_ABORTED' || errno === -3
}

/** 跨域（OOPIF）框架树节点（自 CDP Page.getFrameTree 扁平化而来） */
interface CrossFrameInfo {
  frameId: string
  parentId?: string
  url: string
  securityOrigin?: string
}

/** 扁平化 CDP `Page.getFrameTree` 结果为线性框架清单（保留父子关系） */
function flattenFrameTree(frameTree: unknown): CrossFrameInfo[] {
  const out: CrossFrameInfo[] = []
  const walk = (node: unknown, parentId?: string): void => {
    if (!node || typeof node !== 'object') return
    const record = node as { frame?: Record<string, unknown>; childFrames?: unknown[] }
    const frame = record.frame
    const frameId = frame && typeof frame.id === 'string' ? frame.id : undefined
    if (frameId) {
      out.push({
        frameId,
        parentId: typeof frame?.parentId === 'string' ? frame.parentId : parentId,
        url: typeof frame?.url === 'string' ? frame.url : '',
        securityOrigin: typeof frame?.securityOrigin === 'string' ? frame.securityOrigin : undefined,
      })
    }
    const children = Array.isArray(record.childFrames) ? record.childFrames : []
    for (const child of children) walk(child, frameId ?? parentId)
  }
  walk(frameTree)
  return out
}

/** 解析 URL 的安全源（非法 URL 返回空串） */
function safeOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

/**
 * 生成「合成（非受信任）回车」脚本。
 *
 * 派发到当前聚焦元素，仅触发页面自身的 keydown/keypress/keyup 监听（用于下拉筛选、联想词选定等），
 * 但**不会**触发浏览器对 `<form>` 的隐式提交——从根本上杜绝「填表时回车误提交」的不可逆事故。
 */
export function buildSyntheticEnterScript(): string {
  return `(() => {
    const el = (document.activeElement && document.activeElement !== document.body) ? document.activeElement : null;
    if (!el) return { ok: false };
    const ke = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true };
    try { el.dispatchEvent(new KeyboardEvent('keydown', ke)); } catch (e) {}
    try { el.dispatchEvent(new KeyboardEvent('keypress', ke)); } catch (e) {}
    try { el.dispatchEvent(new KeyboardEvent('keyup', ke)); } catch (e) {}
    return { ok: true, tag: (el.tagName || '').toLowerCase() };
  })()`
}

/**
 * 生成「一次性 SSO 票据无痕清洗」页面脚本。
 *
 * 在顶层与全部子 frame 中执行 `history.replaceState`，剥离 URL 中的 `ticket` / `qzticket`
 * 一次性凭据。该操作不产生新的导航记录、不触发重新加载，纯地址栏净化，因此即使用户或
 * AI 随后刷新页面，也不会再复用已消费的废票（白屏根因）。
 */
export function buildOneTimeTicketSanitizeScript(): string {
  return `(() => {
    let changed = false;
    const seen = [];
    const sanitize = (win) => {
      if (!win) return;
      try {
        if (seen.indexOf(win) >= 0) return;
        seen.push(win);
        const href = win.location && win.location.href;
        if (!href || !/[?&](ticket|qzticket)=/i.test(href)) return;
        const u = new URL(href);
        for (const k of Array.from(u.searchParams.keys())) {
          const lk = k.toLowerCase();
          if (lk === 'ticket' || lk === 'qzticket') { u.searchParams.delete(k); changed = true; }
        }
        if (changed) win.history.replaceState(null, '', u.href);
      } catch (e) {}
    };
    sanitize(window);
    try {
      const frames = Array.from(document.querySelectorAll('frame, iframe'));
      for (const f of frames) {
        try { sanitize(f.contentWindow); } catch (e) {}
      }
    } catch (e) {}
    return { changed: changed };
  })()`
}

export class YanhuExpressManager {
  private owner: BrowserWindow | null = null
  private hostView: View | null = null
  private session: Session | null = null

  /** 两套互相隔离的标签状态桶（共享 Session / 宿主 / 布局） */
  private readonly scopes: Record<YanhuBrowserScope, YanhuScopeState> = {
    'yanhu-express': {
      tabs: new Map(),
      tabOrder: [],
      activeTabId: '',
      initialized: false,
      store: yanhuTabsStore,
      homeUrl: YANHU_HOME_URL,
      homeTitle: '办事大厅',
    },
    wqxt: {
      tabs: new Map(),
      tabOrder: [],
      activeTabId: '',
      initialized: false,
      store: wqxtTabsStore,
      homeUrl: WQXT_HOME_URL,
      homeTitle: 'AI 问渠学堂',
    },
  }
  /** 当前激活作用域（渲染端唯一可见、IPC 缺省作用对象） */
  private activeScope: YanhuBrowserScope = 'yanhu-express'

  /** 以下 getter 让既有方法体无需逐处改写：读写始终落在当前激活作用域 */
  private get scopeState(): YanhuScopeState {
    return this.scopes[this.activeScope]
  }
  private get tabs(): Map<string, YanhuTabRecord> {
    return this.scopeState.tabs
  }
  private get tabOrder(): string[] {
    return this.scopeState.tabOrder
  }
  private set tabOrder(value: string[]) {
    this.scopeState.tabOrder = value
  }
  private get activeTabId(): string {
    return this.scopeState.activeTabId
  }
  private set activeTabId(value: string) {
    this.scopeState.activeTabId = value
  }
  private get initialized(): boolean {
    return this.scopeState.initialized
  }
  private set initialized(value: boolean) {
    this.scopeState.initialized = value
  }
  private get homeUrl(): string {
    return this.scopeState.homeUrl
  }
  private get homeTitle(): string {
    return this.scopeState.homeTitle
  }
  private get tabsStore(): YanhuTabsStore {
    return this.scopeState.store
  }

  /** 用户当前是否停留在智联万站子页面（决定原生视图可见性） */
  private presented = false
  private lastLayout: AppliedLayout | null = null
  private sessionGuarded = false
  /** 当前处于 HTML5 全屏的标签 ID（null 表示未全屏） */
  private htmlFullscreenTabId: string | null = null

  /** 同源同路径窗口打开的合并台账：key = origin+pathname -> { tabId, at } */
  private readonly recentWindowOpenTabs = new Map<string, { tabId: string; at: number }>()

  /** 待下载视频文件名为 URL -> 定制文件名映射 */
  private readonly pendingDownloads = new Map<string, string>()

  constructor() {
    ipcMain.on('yanhu-download-video', (event, payload?: { url?: string; filename?: string }) => {
      if (!payload?.url) return
      const wc = event.sender
      this.triggerVideoDownload(wc, payload.url, payload.filename)
    })
  }

  /** 主进程 -> 渲染进程广播 */
  private send(channel: string, payload: unknown): void {
    if (!this.owner || this.owner.isDestroyed()) return
    this.owner.webContents.send(channel, payload)
  }

  /** 绑定主窗口（主进程启动时调用一次） */
  public setOwnerWindow(window: BrowserWindow): void {
    this.owner = window
    // 窗口全屏态变化后重排：Windows 下 setFullScreen(true) 的尺寸过渡是异步的，
    // 若在 enter-html-full-screen 回调内同步读取 contentBounds 可能拿到旧尺寸，需在
    // enter/leave-full-screen 后再次重排；用户用系统快捷键退出全屏时也在此复位状态。
    window.on('enter-full-screen', () => this.applyLayoutToActive())
    window.on('leave-full-screen', () => {
      this.htmlFullscreenTabId = null
      this.applyLayoutToActive()
    })
    window.on('resize', () => {
      if (this.htmlFullscreenTabId) this.applyLayoutToActive()
    })
  }

  /** 退出 WebContents 侧 HTML5 全屏并复位主窗口全屏态 */
  private exitHtmlFullscreen(): void {
    if (!this.htmlFullscreenTabId) return
    this.htmlFullscreenTabId = null
    if (this.owner && !this.owner.isDestroyed() && this.owner.isFullScreen()) {
      try {
        this.owner.setFullScreen(false)
      } catch {
        // 窗口可能已销毁
      }
    }
  }

  /** 解析智联万站专属分区（复用特区账户，实现免密共享） */
  private getSession(): Session {
    if (!this.session) {
      this.session = electronSession.fromPartition(CDUT_AUTH_PARTITION)
      yanhuFingerprintEngine.configureSession(this.session)
      this.installSessionGuards(this.session)
      yanhuDiagnosticConsole.attachSession(this.session)
    }
    return this.session
  }

  /** 会话级权限与安全守卫（每个会话仅安装一次） */
  private installSessionGuards(ses: Session): void {
    if (this.sessionGuarded) return
    try {
      ses.setPermissionRequestHandler((_contents, permission, callback) => {
        // 放行剪贴板（教务/办事大厅常见复制场景）与 HTML5 全屏（课堂教学页播放器真全屏）
        if (
          permission === 'clipboard-read' ||
          permission === 'clipboard-sanitized-write' ||
          permission === 'fullscreen'
        ) {
          callback(true)
          return
        }
        callback(false)
      })
    } catch (err) {
      console.warn('[智联万站] 安装会话权限守卫失败:', err)
    }

    // 第二道防线：被动捕获瑞数网关 HTTP 400（陈旧 *P 签名被判定篡改），
    // 静默摘除该域下的陈旧签名后自动重试一次，实现毫秒级自愈。
    //
    // 注意：此处刻意使用 `onHeadersReceived` 而非 `onResponseStarted`——Electron 对
    // 同一 Session 的每个 webRequest 事件仅保留「最后一个」监听器，而诊断控制台
    // （yanhuDiagnosticConsole.attachSession）已在 onResponseStarted 上安装网络报文
    // 抓取监听；若在此复用该事件将直接覆盖诊断日志，故改用独立事件以避免冲突。
    try {
      ses.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
        this.handleMainFrameResponse(details)
        callback({ cancel: false })
      })
    } catch (err) {
      console.warn('[智联万站] 安装瑞数 400 自愈守卫失败:', err)
    }

    // 问渠学堂课堂教学页：网络层直接取消平铺水印图片请求（/pptnote/v1/get/course/watermark）。
    // 该 Session 此前未使用 onBeforeRequest（诊断控制台占用的是 onResponseStarted），不存在监听器覆盖。
    try {
      ses.webRequest.onBeforeRequest({ urls: ['*://*.wqxt.cdut.edu.cn/*'] }, (details, callback) => {
        callback({ cancel: isWqxtWatermarkRequestUrl(details.url) })
      })
    } catch (err) {
      console.warn('[AI 问渠学堂] 安装水印拦截守卫失败:', err)
    }

    // 全部守卫安装流程结束后再置位：若中途抛错，标记不落地，后续调用可重试安装，避免守卫永久缺失
    // 问渠学堂课堂教学视频下载守卫：自动识别并注入定制文件名
    try {
      ses.on('will-download', (_event, item) => {
        const url = item.getURL()
        const chain = item.getURLChain()
        let filename = this.pendingDownloads.get(url)
        if (!filename && chain) {
          for (const u of chain) {
            if (this.pendingDownloads.has(u)) {
              filename = this.pendingDownloads.get(u)
              break
            }
          }
        }
        if (!filename) {
          try {
            const u = new URL(url)
            const qName = u.searchParams.get('wqxt_filename')
            if (qName) filename = decodeURIComponent(qName)
          } catch {}
        }
        if (filename) {
          item.setSaveDialogOptions({
            defaultPath: filename,
          })
        }
        item.once('done', () => {
          this.pendingDownloads.delete(url)
          const clean = url.split('?')[0]
          if (clean) this.pendingDownloads.delete(clean)
        })
      })
    } catch (err) {
      console.warn('[AI 问渠学堂] 安装视频下载守卫失败:', err)
    }

    this.sessionGuarded = true
  }

  /**
   * 主框架响应裁决：命中瑞数网关 400 时触发一次性自愈；正常响应则复位自愈标记。
   *
   * 采用「URL + 单次尝试」双重防死循环：同一失败 URL 在被摘除签名并重载后若仍返回
   * 400，则不再重试；一旦出现任意 < 400 的主框架响应即复位，允许后续再遇故障时自愈。
   */
  private handleMainFrameResponse(details: Electron.OnHeadersReceivedListenerDetails): void {
    if (details.resourceType !== 'mainFrame') return
    if (typeof details.webContentsId !== 'number') return
    const tab = this.findTabByWebContentsId(details.webContentsId)
    if (!tab) return

    if (details.statusCode === 400) {
      if (!isCdutDomain(details.url)) return
      if (tab.healAttempted && tab.healedUrl === details.url) return
      tab.healAttempted = true
      tab.healedUrl = details.url
      void this.healStaleSignature(tab, details.url)
      return
    }

    if (details.statusCode < 400) {
      tab.healAttempted = false
      tab.healedUrl = null
    }
  }

  /** 依据 webContentsId 反查标签记录（用于网络层事件定位标签，跨作用域查找） */
  private findTabByWebContentsId(webContentsId: number): YanhuTabRecord | null {
    for (const scope of Object.values(this.scopes)) {
      for (const tab of scope.tabs.values()) {
        const wc = tab.view?.webContents
        if (wc && !wc.isDestroyed() && wc.id === webContentsId) return tab
      }
    }
    return null
  }

  /**
   * 被动自愈：摘除触发 400 的域名下陈旧 *P 签名，并按「是否携带一次性 SSO 票据」分流恢复。
   *
   * 安全红线（事故复盘结论）：**严禁对带 `ticket=` 一次性票据的 URL 裸 reload**——
   * 票据已被消费，重载必然重新走 SSO，且极易渲染出无标题空白页（即「白屏 + 只剩空框架」）。
   * 因此：
   *   - 无 ticket：摘除签名后 reload（原自愈意图，安全）；
   *   - 带 ticket：**不 reload**，转为明确的错误态提示，由用户从办事大厅重新进入。
   */
  private async healStaleSignature(tab: YanhuTabRecord, url: string): Promise<void> {
    let hostname: string
    try {
      hostname = new URL(url).hostname
    } catch {
      return
    }
    let removed = 0
    try {
      removed = await stripStaleRuiShuCookies(this.getSession(), hostname)
    } catch {
      // 忽略清理异常
    }

    // 一次性票据判定统一走 yanhu-constants 的 hasOneTimeTicket（同时覆盖 ticket 与 qzticket）；
    // 此前只用 /[?&]ticket=/ 会漏判 qzticket，导致携带一次性票据的地址被误判为可裸重载而白屏。
    const ticketConsumed = hasOneTimeTicket(url)
    logYanhuEvent('self-heal-400', {
      tabId: tab.id,
      host: hostname,
      url,
      removedPCookies: removed,
      action: ticketConsumed ? 'blocked-reload' : 'reload',
    })

    if (ticketConsumed) {
      // 一次性票据已消费：裸重载只会白屏，改为明确错误态，交由用户重新进入
      yanhuDiagnosticConsole.log({
        category: 'system',
        level: 'warn',
        badge: 'SELF.HEAL',
        badgeClass: 'badge-system',
        title: `检测到 ${hostname} 响应 HTTP 400；该地址携带一次性 SSO 票据，已拒绝盲重载以避免白屏，请从办事大厅重新进入`,
        url,
      })
      tab.item.loading = false
      tab.item.error = {
        errorCode: 400,
        errorDescription: '登录票据已失效，已停止自动重载以避免白屏。请返回办事大厅重新进入该功能。',
        failedUrl: url,
      }
      this.applyLayoutToActive()
      this.emitTabs()
      this.persist()
      return
    }

    yanhuDiagnosticConsole.log({
      category: 'system',
      level: 'warn',
      badge: 'SELF.HEAL',
      badgeClass: 'badge-system',
      title: `检测到 ${hostname} 响应 HTTP 400，已摘除 ${removed} 个陈旧瑞数 *P 签名并触发自动重试`,
      url,
    })
    const wc = tab.view?.webContents
    if (wc && !wc.isDestroyed()) {
      try {
        wc.reload()
      } catch {
        // 忽略
      }
    }
  }

  /** 确保宿主 View 已挂载到主窗口 contentView */
  private ensureHostView(): View {
    if (!this.owner || this.owner.isDestroyed()) throw new Error('主窗口尚未就绪，无法初始化智联万站。')
    if (!this.hostView) {
      const host = new View()
      host.setVisible(false)
      this.owner.contentView.addChildView(host)
      this.hostView = host
    }
    return this.hostView
  }

  /** 预加载脚本绝对路径（开发与打包同构：与 main.cjs 同目录） */
  private preloadPath(): string {
    return join(__dirname, 'yanhu-preload.cjs')
  }

  // ===== 生命周期 =====

  /**
   * 初始化或从落盘拓扑恢复。
   *
   * 首次（无落盘）：创建激活的默认首页标签（智联万站 → 办事大厅；问渠学堂 → 在线课程中心）。
   * 恢复：仅实例化激活标签，其余置休眠，点击时惰性唤醒。
   */
  public initOrRestore(input?: YanhuScopeInput): YanhuTabsState {
    this.switchScope(input?.scope)
    if (this.initialized) return this.buildState()
    this.ensureHostView()
    this.getSession()
    this.initialized = true

    const stored = this.tabsStore.load()
    for (const item of stored.tabs) {
      // 恢复时把哨兵拦截页复位为当前作用域的默认首页，避免加载无效协议
      const safeUrl = blockedTargetOf(item.url) ? this.homeUrl : item.url
      const record: YanhuTabRecord = {
        id: item.id,
        item: { ...item, url: safeUrl, isDormant: true, loading: false },
        view: null,
        blockedTarget: null,
        blockedPreviousUrl: null,
        healAttempted: false,
        healedUrl: null,
        lastRequestedUrl: null,
        lastCommittedUrl: null,
        certInterstitial: null,
      }
      this.tabs.set(item.id, record)
      this.tabOrder.push(item.id)
    }
    if (this.tabOrder.length === 0) {
      const created = this.createTabRecord(this.homeUrl, this.homeTitle)
      this.tabs.set(created.id, created)
      this.tabOrder.push(created.id)
    }

    const activeId = this.tabs.has(stored.activeTabId) ? stored.activeTabId : (this.tabOrder[0] ?? '')
    this.activeTabId = activeId
    // 仅实例化激活标签
    const active = this.tabs.get(activeId)
    if (active) this.instantiateTab(active)
    this.applyLayoutToActive()
    this.emitTabs()
    return this.buildState()
  }

  /** 读取当前激活的浏览器作用域（'yanhu-express' | 'wqxt'） */
  public getActiveScope(): YanhuBrowserScope {
    return this.activeScope
  }

  /** 呈现视图（渲染端挂载子页面时调用），并按需切换作用域 */
  public showView(input?: YanhuScopeInput): YanhuTabsState {
    this.switchScope(input?.scope)
    if (!this.initialized) {
      this.initOrRestore({ scope: this.activeScope })
    } else {
      // 二次切回时该作用域此前已被 switchScope 释放全部视图，initOrRestore 会因
      // initialized === true 提前返回，必须在此惰性唤醒激活标签，否则网页视口全空（白屏）
      const active = this.tabs.get(this.activeTabId)
      if (active && !active.view && !active.blockedTarget) {
        this.instantiateTab(active, { restoring: false })
      }
    }
    this.presented = true
    this.applyLayoutToActive()
    this.emitTabs()
    return this.buildState()
  }

  /**
   * 切换浏览器作用域。
   *
   * 切走前先落盘旧作用域最新拓扑，随后释放旧作用域全部底层视图（保留元数据置休眠），
   * 确保非激活作用域不再产生事件、也不长期占用两份 WebContents。
   * 回到旧作用域时由 showView 惰性唤醒激活标签。
   */
  private switchScope(scope?: YanhuBrowserScope): void {
    if (!scope || scope === this.activeScope) return
    // 切换作用域前退出可能残留的 HTML5 全屏
    this.exitHtmlFullscreen()
    // 落盘旧作用域最新 URL / 标题，避免释放视图后丢失最后状态
    this.persist()
    for (const tab of this.scopeState.tabs.values()) {
      if (tab.view) this.releaseTabView(tab.id)
    }
    this.hideAllTabViews()
    this.activeScope = scope
    this.recentWindowOpenTabs.clear()
    this.applyLayoutToActive()
  }

  /**
   * 唤起「智联万站 · 实时底层诊断控制台」。
   *
   * 仅供隐藏特权指令 `/development-DevTool-MCC` 通过 IPC 安全调用；
   * 正常打开智联万站时绝不弹窗打扰（见规格书 6.2 主进程静默加固）。
   */
  public openDiagnosticConsole(): void {
    try {
      yanhuDiagnosticConsole.open()
    } catch (err) {
      console.warn('[智联万站] 唤起诊断控制台失败:', err)
    }
  }

  /** 隐藏视图（离开子页面时调用；保留标签与底层视图存活） */
  public hideView(): void {
    this.exitHtmlFullscreen()
    this.presented = false
    this.applyLayoutToActive()
    this.persist()
  }

  /** 彻底销毁（登出等场景）：释放全部底层视图与宿主 */
  public dispose(): void {
    this.exitHtmlFullscreen()
    // 必须逐作用域切换后再销毁：disposeTabView 通过 this.tabs 查表，仅遍历会漏掉非激活作用域
    for (const scope of ['yanhu-express', 'wqxt'] as const) {
      this.activeScope = scope
      for (const id of [...this.tabOrder]) this.disposeTabView(id)
      this.tabs.clear()
      this.tabOrder = []
      this.activeTabId = ''
      this.initialized = false
    }
    this.activeScope = 'yanhu-express'
    // 全部标签已销毁：清空该会话下的证书临时放行（仅内存态）
    wipeSessionGrants(CDUT_AUTH_CERT_SESSION_ID)
    if (this.hostView && this.owner && !this.owner.isDestroyed()) {
      try {
        this.owner.contentView.removeChildView(this.hostView)
      } catch {
        // 宿主可能已销毁
      }
    }
    this.hostView = null
    this.presented = false
    this.lastLayout = null
    this.recentWindowOpenTabs.clear()
  }

  // ===== 标签记录 =====

  private createTabRecord(url: string, title = '新标签页'): YanhuTabRecord {
    const now = Date.now()
    const id = `yanhu-tab-${now}-${Math.random().toString(36).slice(2, 8)}`
    const item: YanhuTabItem = {
      id,
      title,
      url,
      favicon: '',
      createdAt: now,
      lastActiveAt: now,
      zoomFactor: 1,
      isDormant: false,
      loading: false,
      canGoBack: false,
      canGoForward: false,
    }
    return {
      id,
      item,
      view: null,
      blockedTarget: null,
      blockedPreviousUrl: null,
      healAttempted: false,
      healedUrl: null,
      lastRequestedUrl: null,
      lastCommittedUrl: null,
      certInterstitial: null,
    }
  }

  /**
   * 实例化标签底层 WebContentsView 并挂载全部事件（幂等）。
   *
   * `restoring`（默认 true）表示这是**进程重启恢复**路径。此时若标签指向
   * 「票据型 SSO 受保护应用页」，直接重载其 URL 会被网关踢去 CAS 换票，换票返回后 SPA
   * 常常只渲染出空壳（只剩框架、内容空白）；故改为回到站内入口。
   *
   * 显式传 false 的两条路径：① createTab（用户/模型主动新建标签，URL 是刚拿到的有效目标）；
   * ② navigate / 休眠唤醒（用户明确要回到该页面）。两者均按原 URL 加载，不做站内入口回退。
   */
  private instantiateTab(tab: YanhuTabRecord, options: { restoring?: boolean } = {}): void {
    const restoring = options.restoring !== false
    if (tab.view) {
      tab.item.isDormant = false
      return
    }
    const host = this.ensureHostView()
    const view = new WebContentsView({
      webPreferences: {
        partition: CDUT_AUTH_PARTITION,
        preload: this.preloadPath(),
        nodeIntegration: false,
        // 瑞数 5/6 动态 VM 包含严格的多 Realm / iframe 原型链交叉检验（对比 window 与 iframe.contentWindow 的 Object/Function 等）。
        // 当 contextIsolation 为 true 时，Electron 会在 V8 注入 Realm 代理包装与 sandbox_bundle 粘合层，
        // 导致跨 Realm 原型比对异常，瑞数判定为沙箱环境并令服务端 WAF 响应 HTTP 400 空包（白屏根因）；
        // 设为 false + nodeIntegration: false + sandbox: true，可在彻底隔绝 Node 特权的同时提供 100% 纯净的原生 Chromium Realm。
        contextIsolation: false,
        sandbox: true,
        webSecurity: true,
        // 原生视图可见性由主进程显式控制，关闭节流避免隐藏时合成空纹理
        backgroundThrottling: false,
      },
    })
    view.setBackgroundColor(resolveYanhuViewBackground(yanhuThemeService.resolveCurrentIsDark()))
    host.addChildView(view)
    view.setVisible(false)
    tab.view = view
    tab.item.isDormant = false

    this.attachTabListeners(tab)
    yanhuThemeService.registerView(view)
    yanhuDiagnosticConsole.attachWebContents(view.webContents)

    // 主题媒体仿真（指纹与反反调试已由 Preload 权威注入，普通浏览保持 0 调试器介入）
    void syncThemeToWebContents(view.webContents, yanhuThemeService.resolveCurrentIsDark())

    const desired = tab.item.url || this.homeUrl
    // 一次性票据绝不再发（废票重发必然被踢回 CAS）
    const cleaned = stripOneTimeTicket(desired)
    // 票据型 SSO 应用页在恢复路径上重载必然换票、极易只剩空壳 → 回站内入口，重新走正常入口流程
    const target = restoring && isYanhuSsoAppUrl(cleaned) ? this.homeUrl : cleaned
    if (target !== desired) {
      logYanhuEvent('restore-fallback', { tabId: tab.id, from: desired, to: target })
      tab.item.url = target
      tab.item.title = this.homeTitle
      tab.item.isDormant = false
    }
    void this.loadWithFreshSignature(view.webContents, target)
  }

  /** 释放标签底层视图但保留元数据（休眠） */
  private releaseTabView(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab || !tab.view) return
    this.disposeTabView(tabId)
    tab.item.isDormant = true
  }

  /** 彻底销毁标签底层视图资源 */
  private disposeTabView(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return
    if (this.htmlFullscreenTabId === tabId) this.exitHtmlFullscreen()
    // 授权撤销必须先于 view 判空：休眠标签同样已脱离浏览上下文，不能漏撤
    revokeTabGrants(CDUT_AUTH_CERT_SESSION_ID, tabId)
    tab.certInterstitial = null
    tab.lastRequestedUrl = null
    tab.lastCommittedUrl = null
    if (!tab.view) return
    const view = tab.view
    tab.view = null
    yanhuDevToolsHub.release(tabId)
    yanhuDomDistillationEngine.release(tabId)
    yanhuThemeService.unregisterView(view)
    try {
      this.hostView?.removeChildView(view)
    } catch {
      // 宿主可能已销毁
    }
    try {
      if (!view.webContents.isDestroyed()) view.webContents.close()
    } catch {
      // 已销毁
    }
  }

  private attachTabListeners(tab: YanhuTabRecord): void {
    const view = tab.view
    if (!view) return
    const wc = view.webContents

    // 主框架导航起点：记录本次真实请求目标（data: 等内部页面不覆盖）
    wc.on('did-start-navigation', (_event, url, _isInPlace, isMainFrame) => {
      if (isMainFrame && isWebUrl(url)) tab.lastRequestedUrl = url
    })

    // 主框架导航：统一走安全网关（证书插页哨兵优先拦截）
    wc.on('will-navigate', (event, url) => {
      const certSentinel = parseCertInterstitialSentinel(url)
      if (certSentinel) {
        event.preventDefault()
        this.handleCertInterstitialSentinel(tab, certSentinel)
        return
      }
      // 问渠学堂课堂原视频下载拦截：禁止跨域视频流直接进行主框架整页导航，转为主进程原生下载
      if (this.isVideoDownloadUrl(url)) {
        event.preventDefault()
        this.triggerVideoDownload(wc, url)
        return
      }
      const allowed = yanhuDomainGatekeeper.isAllowed(url)
      logYanhuEvent('will-navigate', { tabId: tab.id, url, allowed, via: 'main' })
      if (allowed) return
      event.preventDefault()
      this.blockTab(tab, url)
    })

    // 重定向同样受网关约束；同步刷新请求目标，保证服务端 301/302 跳到证书异常站点时
    // 阻断登记比对的是最终目标而非起始地址
    wc.on('will-redirect', (event, url) => {
      const certSentinel = parseCertInterstitialSentinel(url)
      if (certSentinel) {
        event.preventDefault()
        this.handleCertInterstitialSentinel(tab, certSentinel)
        return
      }
      // 问渠学堂课堂原视频下载拦截：禁止跨域视频流直接进行主框架整页导航，转为主进程原生下载
      if (this.isVideoDownloadUrl(url)) {
        event.preventDefault()
        return
      }
      if (isWebUrl(url)) tab.lastRequestedUrl = url
      const allowed = yanhuDomainGatekeeper.isAllowed(url)
      logYanhuEvent('will-navigate', { tabId: tab.id, url, allowed, via: 'redirect' })
      if (allowed) return
      event.preventDefault()
      this.blockTab(tab, url)
    })

    // 新窗口一律不外弹：http/https 转内嵌新标签，非网页协议转内置拦截页
    wc.setWindowOpenHandler(({ url }) => {
      const certSentinel = parseCertInterstitialSentinel(url)
      if (certSentinel) {
        this.handleCertInterstitialSentinel(tab, certSentinel)
        return { action: 'deny' }
      }
      // 问渠学堂课堂原视频下载拦截：禁止跨域视频流直接进行主框架整页导航，转为主进程原生下载
      if (this.isVideoDownloadUrl(url)) {
        this.triggerVideoDownload(wc, url)
        return { action: 'deny' }
      }
      if (yanhuDomainGatekeeper.isAllowed(url)) {
        this.openTabFromWindow(tab, url)
      } else {
        this.blockTab(tab, url)
      }
      return { action: 'deny' }
    })

    // DOM 就绪：问渠课堂首次/整页加载后补偿净化（Preload 已在 document-start 注入，此处兜底）
    wc.on('dom-ready', () => {
      this.applyWqxtCleanerIfNeeded(tab)
    })

    wc.on('did-start-loading', () => {
      tab.item.loading = true
      tab.item.error = null // 开始加载时重置错误状态
      // 页面开始加载：标记无视感知 BID 缓存失效，下次读取时全量重建
      yanhuDomDistillationEngine.markDirty(tab.id)
      this.send(YANHU_EXPRESS_IPC_CHANNELS.ON_LOADING_CHANGED, { tabId: tab.id, loading: true })
      this.emitTabs()
    })

    wc.on('did-stop-loading', () => {
      tab.item.loading = false
      this.send(YANHU_EXPRESS_IPC_CHANNELS.ON_LOADING_CHANGED, { tabId: tab.id, loading: false })
      this.recomputeNavigation(tab)
      this.emitTabs()
      this.persist()
    })

    wc.on('did-navigate', () => {
      // 记录最近一次真实落地的页面：证书失败后 Chromium 可能把 URL 改成 chrome-error://，
      // 只有这里留存的地址才能作为「返回安全页面」的可信落点
      const committedUrl = wc.getURL()
      if (isWebUrl(committedUrl)) tab.lastCommittedUrl = committedUrl
      yanhuDomDistillationEngine.markDirty(tab.id)
      this.recomputeNavigation(tab)
      logYanhuEvent('did-navigate', { tabId: tab.id, url: tab.item.url })
      this.sanitizeOneTimeTicket(tab)
      this.applyWqxtCleanerIfNeeded(tab)
      this.emitUrlChanged(tab)
      this.emitTabs()
      this.persist()
    })

    wc.on('did-navigate-in-page', () => {
      yanhuDomDistillationEngine.markDirty(tab.id)
      this.recomputeNavigation(tab)
      logYanhuEvent('did-navigate-in-page', { tabId: tab.id, url: tab.item.url })
      this.sanitizeOneTimeTicket(tab)
      this.applyWqxtCleanerIfNeeded(tab)
      this.emitUrlChanged(tab)
      this.emitTabs()
    })

    wc.on('page-title-updated', () => {
      this.recomputeNavigation(tab)
      this.emitTabs()
    })

    wc.on('page-favicon-updated', (_event, favicons) => {
      const first = Array.isArray(favicons) ? favicons.find((f) => !!f) : undefined
      if (first) {
        tab.item.favicon = first
        this.emitTabs()
      }
    })

    wc.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      // 忽略非主框架与用户主动取消（-3 ERR_ABORTED）
      if (!isMainFrame || errorCode === -3) return

      // 证书类失败：-200 段为 Chromium ERR_CERT_*；-2 为会话 verifyProc 拒绝泄露链后
      // 返回的 net::ERR_FAILED。是否展示插页最终由「该主机存在真实阻断登记」决定。
      if ((errorCode <= -200 || errorCode === -2) && this.tryLoadCertInterstitial(tab)) return

      tab.item.loading = false
      tab.item.error = {
        errorCode,
        errorDescription: errorDescription || '网络连接异常',
        failedUrl: validatedURL || tab.item.url,
      }
      this.send(YANHU_EXPRESS_IPC_CHANNELS.ON_LOADING_CHANGED, { tabId: tab.id, loading: false })
      this.applyLayoutToActive()
      this.emitTabs()
    })

    wc.on('destroyed', () => {
      // 视图被外部销毁（渲染进程崩溃等）时复位为休眠，避免脏引用
      tab.certInterstitial = null
      if (this.htmlFullscreenTabId === tab.id) this.exitHtmlFullscreen()
      if (this.tabs.get(tab.id)?.view === view) {
        tab.view = null
        tab.item.isDormant = true
        yanhuDevToolsHub.release(tab.id)
        yanhuDomDistillationEngine.release(tab.id)
        yanhuThemeService.unregisterView(view)
      }
    })

    // HTML5 真全屏：网页内 requestFullscreen 被 Chromium 放行后，让原生视图铺满整个
    // 主窗口内容区，并驱动窗口进入系统全屏；退出时同步还原内缩布局。
    wc.on('enter-html-full-screen', () => {
      this.htmlFullscreenTabId = tab.id
      if (this.owner && !this.owner.isDestroyed() && !this.owner.isFullScreen()) {
        try {
          this.owner.setFullScreen(true)
        } catch {
          // 窗口可能已销毁
        }
      }
      this.applyLayoutToActive()
    })

    wc.on('leave-html-full-screen', () => {
      if (this.htmlFullscreenTabId === tab.id) this.htmlFullscreenTabId = null
      if (this.owner && !this.owner.isDestroyed() && this.owner.isFullScreen()) {
        try {
          this.owner.setFullScreen(false)
        } catch {
          // 窗口可能已销毁
        }
      }
      this.applyLayoutToActive()
    })

    this.recomputeNavigation(tab)
  }

  /**
   * 问渠学堂页面净化补偿注入（幂等）。
   *
   * Preload 已在 document-start 注入；此处覆盖 SPA 路由切换（选择页 → 教学页）以及
   * Preload 不可用的极端场景。脚本内部按 hostname / 路由自检，并复用已挂载的实例。
   */
  /** 判定是否为问渠课堂视频下载/直链导航 */
  public isVideoDownloadUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false
    try {
      const u = new URL(url)
      const host = u.hostname.toLowerCase()
      if (host === 'play.wqxt.cdut.edu.cn' || host.endsWith('.wqxt.cdut.edu.cn')) {
        return (
          u.pathname.endsWith('.mp4') ||
          u.pathname.includes('/play/') ||
          u.searchParams.has('wqxt_filename')
        )
      }
      return false
    } catch {
      return false
    }
  }

  /** 短时间内的重复下载触发抑制台账（cleanUrl -> timestamp） */
  private readonly recentTriggeredDownloads = new Map<string, number>()

  /** 触发 WebContents 级别的原生视频下载（不触发整页导航，保留合法 Referer） */
  public triggerVideoDownload(wc: WebContents, url: string, filename?: string): void {
    if (!wc || wc.isDestroyed()) return
    const targetUrl = url.trim()
    const cleanUrl = targetUrl.split('?')[0] || targetUrl
    const now = Date.now()
    const lastAt = this.recentTriggeredDownloads.get(cleanUrl) || 0
    if (now - lastAt < 8000) return
    this.recentTriggeredDownloads.set(cleanUrl, now)
    let resolvedFilename = filename?.trim()
    if (!resolvedFilename) {
      try {
        const u = new URL(targetUrl)
        const qName = u.searchParams.get('wqxt_filename')
        if (qName) resolvedFilename = decodeURIComponent(qName)
      } catch {}
    }
    if (resolvedFilename) {
      this.pendingDownloads.set(targetUrl, resolvedFilename)
      const clean = targetUrl.split('?')[0]
      if (clean) this.pendingDownloads.set(clean, resolvedFilename)
    }
    wc.downloadURL(targetUrl)
  }

  private applyWqxtCleanerIfNeeded(tab: YanhuTabRecord): void {
    const wc = tab.view?.webContents
    if (!wc || wc.isDestroyed()) return
    let hostname: string
    try {
      hostname = new URL(wc.getURL()).hostname.toLowerCase()
    } catch {
      return
    }
    if (hostname !== WQXT_CLASSROOM_HOSTNAME) return
    void wc.executeJavaScript(buildWqxtLivingRoomCleanerScript()).catch(() => {
      // 页面尚未就绪或已销毁，忽略
    })
  }

  /** 依据当前页面刷新标签的 URL / 标题 / 前进后退能力（被拦截时保持哨兵 URL） */
  private recomputeNavigation(tab: YanhuTabRecord): void {
    const wc = tab.view?.webContents
    if (!wc || wc.isDestroyed()) {
      tab.item.canGoBack = false
      tab.item.canGoForward = false
      return
    }
    if (!tab.blockedTarget && !tab.certInterstitial) {
      const currentUrl = wc.getURL()
      // 落盘前剔除一次性票据：废票一旦被持久化，下次唤醒重发必然被踢回 CAS（空壳根因）
      if (currentUrl && !currentUrl.startsWith('chrome-error://')) tab.item.url = stripOneTimeTicket(currentUrl)
      const title = wc.getTitle()
      if (title) tab.item.title = title
    }
    try {
      tab.item.canGoBack = wc.navigationHistory.canGoBack()
      tab.item.canGoForward = wc.navigationHistory.canGoForward()
    } catch {
      tab.item.canGoBack = false
      tab.item.canGoForward = false
    }
  }

  /**
   * 一次性 SSO 票据无痕清洗（导航落地后即时执行）。
   *
   * CAS / 青果票据为一次性凭证：留在地址栏中，一旦被用户手动刷新或 AI 误触 `yanhu_reload`
   * 复用，必然被网关踢回 SSO，返回后 SPA 常常只渲染出「只剩空框架的白屏」。
   * 此处以 `history.replaceState` 就地剥离票据：不产生新导航、不重新加载，
   * 从根源规避任何刷新白屏，并防止一次性凭据随 URL 历史 / 落盘泄露。
   */
  private sanitizeOneTimeTicket(tab: YanhuTabRecord): void {
    const wc = tab.view?.webContents
    if (!wc || wc.isDestroyed()) return
    const currentUrl = wc.getURL()
    if (!hasOneTimeTicket(currentUrl)) return
    // 同步净化元数据，确保后续 persist / emit 不再残留票据
    tab.item.url = stripOneTimeTicket(currentUrl)
    void wc.executeJavaScript(buildOneTimeTicketSanitizeScript()).catch(() => {
      // 地址栏净化失败不影响正常浏览
    })
    logYanhuEvent('ticket-sanitize', { tabId: tab.id, url: currentUrl })
  }

  private emitUrlChanged(tab: YanhuTabRecord): void {
    const payload: YanhuUrlChangedEvent = {
      tabId: tab.id,
      url: tab.item.url,
      title: tab.item.title,
      canGoBack: tab.item.canGoBack ?? false,
      canGoForward: tab.item.canGoForward ?? false,
    }
    this.send(YANHU_EXPRESS_IPC_CHANNELS.ON_URL_CHANGED, payload)
  }

  // ===== 拦截 =====

  /** 将标签切换为内置拦截页态（隐藏底层视图，交由渲染层展示 YanhuBlockedPage） */
  private blockTab(tab: YanhuTabRecord, targetUrl: string): void {
    const previous = tab.view?.webContents.getURL() || tab.item.url
    tab.blockedPreviousUrl = previous && !isYanhuBlockedUrl(previous) ? previous : this.homeUrl
    tab.blockedTarget = targetUrl
    tab.item.url = buildYanhuBlockedUrl(targetUrl)
    tab.item.title = '无法访问该网站'
    tab.item.loading = false
    try {
      tab.view?.webContents.stop()
    } catch {
      // 忽略
    }
    this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    logYanhuEvent('blocked', { tabId: tab.id, url: targetUrl, previous: tab.blockedPreviousUrl })
    console.log('[智联万站] 已阻断非网页协议访问:', targetUrl)
  }

  /** 从拦截页返回上一页（恢复被拦截前页面） */
  public returnFromBlocked(tabId?: string): YanhuTabsState {
    const tab = this.resolveTab(tabId)
    if (!tab || !tab.blockedTarget) return this.buildState()
    const restoreUrl = tab.blockedPreviousUrl || this.homeUrl
    tab.blockedTarget = null
    tab.blockedPreviousUrl = null
    tab.item.url = restoreUrl
    tab.item.error = null
    // 休眠标签返回上一页时需惰性唤醒；已唤醒标签必须真正驱动导航，
    // 否则仅元数据恢复、底层视图仍停留在被 stop 的空白/错误态（页面脱节）。
    if (!tab.view) {
      this.instantiateTab(tab, { restoring: false })
    } else if (!tab.view.webContents.isDestroyed()) {
      tab.item.loading = true
      void this.loadWithFreshSignature(tab.view.webContents, restoreUrl)
    }
    this.recomputeNavigation(tab)
    this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  // ===== 证书安全插页 =====

  /**
   * 尝试为主框架证书类失败加载 eMudhra 泄露链安全插页。
   *
   * 仅当本次请求目标主机存在阻断登记（会话 verifyProc 拒绝泄露链证书时写入）时返回 true，
   * 否则交回通用网络错误处理。插页态下 `tab.item.error` 保持 null，
   * 从而底层视图继续可见（见 applyLayoutToActive 的可见性判定）。
   */
  private tryLoadCertInterstitial(tab: YanhuTabRecord): boolean {
    const wc = tab.view?.webContents
    if (!wc || wc.isDestroyed()) return false

    const target = resolveYanhuCertBlockTarget(
      tab.lastRequestedUrl ?? tab.item.url,
      (hostname) => getCertBlockedRecord(CDUT_AUTH_CERT_SESSION_ID, hostname),
    )
    if (!target) return false

    // 重载目标必须是本次真实请求 URL：阻断登记中的 url 是 verifyProc 构造的
    // `https://<hostname>/` 伪地址，丢失了路径与查询参数。
    const targetUrl = tab.lastRequestedUrl && isWebUrl(tab.lastRequestedUrl) ? tab.lastRequestedUrl : target.record.url
    // 「返回安全页面」落点取失败前最近一次真实落地的页面；与阻断目标同主机时回退首页
    let returnUrl: string | null = null
    if (tab.lastCommittedUrl && isWebUrl(tab.lastCommittedUrl)) {
      try {
        if (new URL(tab.lastCommittedUrl).hostname.toLowerCase() !== target.hostname) {
          returnUrl = tab.lastCommittedUrl
        }
      } catch {
        returnUrl = null
      }
    }

    tab.certInterstitial = { hostname: target.hostname, targetUrl, returnUrl }
    tab.item.loading = false
    tab.item.error = null
    tab.item.url = targetUrl
    tab.item.title = '连接已被安全策略拦截'

    const html = buildSecurityInterstitialHtml(targetUrl, {
      issuerName: target.record.issuerName,
      subjectName: target.record.subjectName,
    })
    // 主进程 loadURL 不触发 will-navigate；data: 协议不触网，安全插页由此渲染。
    void wc.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`).catch(() => undefined)

    logYanhuEvent('cert-blocked', { tabId: tab.id, hostname: target.hostname, url: targetUrl })
    yanhuDiagnosticConsole.log({
      category: 'network',
      level: 'warn',
      badge: 'CERT.BLOCK',
      badgeClass: 'badge-console-warn',
      title: `已拦截 ${target.hostname} 的泄露链证书，展示安全警告插页`,
      details: `证书主题: ${target.record.subjectName || '未知'}\n签发者: ${target.record.issuerName || '未知'}`,
      url: targetUrl,
    })
    this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return true
  }

  /**
   * 处理证书插页按钮哨兵回投（will-navigate / will-redirect / setWindowOpenHandler 三通道拦截）。
   * allow：登记标签页级内存态临时放行并重新加载真实目标；
   * back：显式加载 returnUrl（无则当前作用域默认首页），不走 goBack 以免回到被阻断条目形成插页循环。
   */
  private handleCertInterstitialSentinel(tab: YanhuTabRecord, action: 'allow' | 'back'): void {
    const state = tab.certInterstitial
    if (!state) return
    // 先复位插页态：允许重载路径上的事件正常回写 URL / 标题
    tab.certInterstitial = null

    const wc = tab.view?.webContents
    if (!wc || wc.isDestroyed()) return

    const nextUrl = action === 'allow' ? state.targetUrl : (state.returnUrl ?? this.homeUrl)
    if (action === 'allow') {
      allowDomainTemporarily(CDUT_AUTH_CERT_SESSION_ID, tab.id, state.hostname)
    }
    logYanhuEvent(action === 'allow' ? 'cert-allow' : 'cert-back', {
      tabId: tab.id,
      hostname: state.hostname,
      url: nextUrl,
    })

    tab.item.url = nextUrl
    tab.item.loading = true
    tab.item.error = null
    void this.loadWithFreshSignature(wc, nextUrl)
    this.emitTabs()
    this.persist()
  }

  // ===== 标签操作 =====

  public getTabsState(): YanhuTabsState {
    if (!this.initialized) return this.initOrRestore()
    return this.buildState()
  }

  public createTab(input: YanhuCreateTabInput = {}): YanhuTabsState {
    if (!this.initialized) this.initOrRestore()
    const rawUrl = input.url && input.url.trim() ? input.url.trim() : this.homeUrl
    // 与 navigate 保持同一入口语义：裸域名自动补全 https，无法规范化的输入转拦截页
    const decision = yanhuDomainGatekeeper.resolveAddressInput(rawUrl) ?? { allowed: false, url: rawUrl }
    const targetUrl = decision.url

    const record = this.createTabRecord(this.homeUrl, '新标签页')
    this.tabs.set(record.id, record)
    this.tabOrder.push(record.id)
    logYanhuEvent('tab-create', { tabId: record.id, url: targetUrl, activate: input.activate !== false })

    if (!decision.allowed) {
      // 非网页协议新建：直接呈现拦截卡片
      record.blockedTarget = targetUrl
      record.blockedPreviousUrl = this.tabs.get(this.activeTabId)?.item.url ?? this.homeUrl
      record.item.url = buildYanhuBlockedUrl(targetUrl)
      record.item.title = '无法访问该网站'
      record.item.isDormant = false
    } else {
      record.item.url = targetUrl
      // 新建标签：URL 是刚刚拿到的有效目标，按原样加载（不做 SSO 恢复回退）
      this.instantiateTab(record, { restoring: false })
    }

    if (input.activate !== false) this.setActive(record.id)
    this.enforceDormancy()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  /** 解析窗口打开的合并键：同源同路径（忽略 query / hash 差异，如一次性 ticket）即视为同一目标 */
  private windowOpenKey(url: string): string {
    try {
      const parsed = new URL(url)
      return `${parsed.origin}${parsed.pathname}`
    } catch {
      return url
    }
  }

  /**
   * 合并式「窗口打开新建标签」。
   *
   * 页面一次交互可能因三连击 / 自动重试触发多次 `window.open`（例如 SSO 深链带一次性 ticket），
   * 若每次都新建标签会产出多个重复 / 残缺标签页（首个带 ticket，其余丢失参数）。
   * 此处以「origin + pathname」为键做短窗口合并：命中既有标签则直接激活，绝不重复新建。
   */
  private openTabFromWindow(source: YanhuTabRecord, url: string): void {
    const key = this.windowOpenKey(url)
    const now = Date.now()
    // 清理过期台账，避免 Map 无界增长
    for (const [k, entry] of this.recentWindowOpenTabs) {
      if (now - entry.at > YANHU_WINDOW_OPEN_COALESCE_MS) this.recentWindowOpenTabs.delete(k)
    }
    const prev = this.recentWindowOpenTabs.get(key)
    if (prev && prev.tabId !== source.id && this.tabs.has(prev.tabId)) {
      console.log('[智联万站] 合并重复窗口打开，激活既有标签:', prev.tabId, url)
      this.activateTab(prev.tabId)
      return
    }
    const before = new Set(this.tabs.keys())
    this.createTab({ url, activate: true })
    const createdId = this.tabOrder.find((id) => !before.has(id))
    if (createdId) this.recentWindowOpenTabs.set(key, { tabId: createdId, at: now })
  }

  public activateTab(tabId: string): YanhuTabsState {
    if (!this.initialized) this.initOrRestore()
    const tab = this.tabs.get(tabId)
    if (!tab) return this.buildState()
    if (tab.blockedTarget) {
      this.setActive(tabId)
      this.emitTabs()
      return this.buildState()
    }
    // 惰性唤醒休眠标签：按用户预期恢复原页面（restoring:false），
    // 「回站内入口」的票据保护仅保留给进程重启恢复路径（见 instantiateTab 注释）。
    if (!tab.view) this.instantiateTab(tab, { restoring: false })
    this.setActive(tabId)
    this.enforceDormancy()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  public closeTab(tabId: string): YanhuTabsState {
    const tab = this.tabs.get(tabId)
    if (!tab) return this.buildState()
    const index = this.tabOrder.indexOf(tabId)
    this.disposeTabView(tabId)
    this.tabs.delete(tabId)
    this.tabOrder = this.tabOrder.filter((id) => id !== tabId)
    logYanhuEvent('tab-close', { tabId })

    if (this.activeTabId === tabId) {
      if (this.tabOrder.length === 0) {
        // 关闭最后一个标签 → 重置为当前作用域默认首页
        const fresh = this.createTabRecord(this.homeUrl, this.homeTitle)
        this.tabs.set(fresh.id, fresh)
        this.tabOrder.push(fresh.id)
        this.activeTabId = fresh.id
        this.instantiateTab(fresh)
      } else {
        const nextId = this.tabOrder[index] ?? this.tabOrder[index - 1] ?? ''
        this.activeTabId = nextId
        const next = this.tabs.get(nextId)
        // 关闭触发的相邻标签唤醒属于用户主动操作，必须保留其原页面（带票据的 SSO 应用页不被重置）
        if (next && !next.view && !next.blockedTarget) {
          this.instantiateTab(next, { restoring: false })
        }
      }
    }
    this.applyLayoutToActive()
    this.enforceDormancy()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  public closeOtherTabs(tabId: string): YanhuTabsState {
    const keep = this.tabs.get(tabId)
    if (!keep) return this.buildState()
    for (const id of [...this.tabOrder]) {
      if (id !== tabId) {
        this.disposeTabView(id)
        this.tabs.delete(id)
      }
    }
    this.tabOrder = [tabId]
    this.activeTabId = tabId
    if (!keep.view && !keep.blockedTarget) this.instantiateTab(keep, { restoring: false })
    this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  public closeRightTabs(tabId: string): YanhuTabsState {
    const index = this.tabOrder.indexOf(tabId)
    if (index === -1) return this.buildState()
    const toClose = this.tabOrder.slice(index + 1)
    for (const id of toClose) {
      this.disposeTabView(id)
      this.tabs.delete(id)
    }
    this.tabOrder = this.tabOrder.slice(0, index + 1)
    if (!this.tabs.has(this.activeTabId)) {
      this.activeTabId = tabId
      const tab = this.tabs.get(tabId)
      if (tab && !tab.view && !tab.blockedTarget) this.instantiateTab(tab, { restoring: false })
    }
    this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  public reorderTabs(orderedTabIds: string[]): YanhuTabsState {
    const known = orderedTabIds.filter((id) => this.tabs.has(id))
    // 补齐未在有序列表中出现的标签，保证不丢标签
    for (const id of this.tabOrder) if (!known.includes(id)) known.push(id)
    this.tabOrder = known
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  // ===== 导航 =====

  public navigate(input: YanhuNavigateInput): YanhuTabsState {
    const tab = this.resolveTab(input.tabId)
    if (!tab) return this.buildState()
    const decision = yanhuDomainGatekeeper.resolveAddressInput(input.url)
    if (!decision) return this.buildState()

    // 已处于拦截态或证书插页态：先退出该状态再裁决
    tab.blockedTarget = null
    tab.blockedPreviousUrl = null
    tab.certInterstitial = null

    if (!decision.allowed) {
      this.blockTab(tab, decision.url)
      return this.buildState()
    }

    // 先落库目标 URL 再实例化视图：instantiateTab 会按 tab.item.url 发起首次加载，
    // 否则休眠标签会先按旧 URL 加载一次（多余导航 + 标题闪回），随后才被真实目标覆盖。
    tab.item.url = decision.url
    tab.item.loading = true
    if (!tab.view) {
      // 新视图由 instantiateTab 按目标 URL 加载（restoring:false：显式导航按用户/模型指定地址加载）
      this.instantiateTab(tab, { restoring: false })
    } else {
      const navigatingView = tab.view
      if (!navigatingView.webContents.isDestroyed()) {
        void this.loadWithFreshSignature(navigatingView.webContents, decision.url)
      }
    }
    if (this.activeTabId === tab.id) this.applyLayoutToActive()
    this.emitTabs()
    return this.buildState()
  }

  /**
   * 第一道防线：主动入场清洗 + 加载。
   *
   * 在真正发起顶层导航前，先剔除目标校内域下陈旧的瑞数 *P 签名，确保首包不携带任何
   * 前序页面遗留的失效签名，从源头杜绝瑞数网关 HTTP 400 与随后的白屏死锁。
   */
  private async loadWithFreshSignature(wc: WebContents, target: string): Promise<void> {
    logYanhuEvent('load-url', { url: target, reason: 'fresh-signature' })
    await this.maybeStripStaleSignature(target)
    if (wc.isDestroyed()) return
    try {
      await wc.loadURL(target)
    } catch (err) {
      // -3 ERR_ABORTED 属于前序导航被新导航打断或重定向接管，并非致命故障，不报警告
      if (isNavigationAborted(err)) return
      console.warn('[智联万站] 页面加载失败:', target, err)
    }
  }

  /** 目标为校内独立系统域名时，剔除其陈旧瑞数 *P 签名（保留会话 O 与 JSESSIONID） */
  private async maybeStripStaleSignature(target: string): Promise<void> {
    if (!isCdutDomain(target)) return
    let hostname: string
    try {
      hostname = new URL(target).hostname
    } catch {
      return
    }
    try {
      const removed = await stripStaleRuiShuCookies(this.getSession(), hostname)
      if (removed > 0) {
        yanhuDiagnosticConsole.log({
          category: 'system',
          level: 'info',
          badge: 'SIG.EVICT',
          badgeClass: 'badge-system',
          title: `入场清洗：已剔除 ${hostname} 下 ${removed} 个陈旧瑞数 *P 签名，避免首包 HTTP 400`,
          url: target,
        })
      }
    } catch {
      // 忽略清理异常
    }
  }

  /**
   * 以净化后的同源 URL 安全加载（供工具层「票据剥离刷新」使用）。
   *
   * 与 `navigate` 不同，本方法不做地址栏网关裁决（调用方已确保 URL 与当前页面同源且已剥离
   * 一次性票据），仅按当前会话加载并走「入场清洗 + 新鲜瑞数签名」，避免带废票裸刷新白屏。
   */
  public async loadUrl(tabId: string | undefined, url: string): Promise<YanhuTabsState> {
    const tab = this.resolveTab(tabId)
    if (!tab) return this.buildState()
    tab.blockedTarget = null
    tab.blockedPreviousUrl = null
    tab.certInterstitial = null
    if (!tab.view) this.instantiateTab(tab)
    tab.item.url = url
    tab.item.loading = true
    const view = tab.view
    if (view && !view.webContents.isDestroyed()) {
      await this.loadWithFreshSignature(view.webContents, url)
    }
    if (this.activeTabId === tab.id) this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  public goBack(tabId?: string): YanhuTabsState {
    const tab = this.resolveTab(tabId)
    if (tab?.blockedTarget) return this.returnFromBlocked(tab.id)
    // 插页态下后退等价于「返回安全页面」，避免历史中的 data URL / 失败条目把界面留在插页态
    if (tab?.certInterstitial) {
      this.handleCertInterstitialSentinel(tab, 'back')
      return this.buildState()
    }
    try {
      const wc = tab?.view?.webContents
      if (wc && !wc.isDestroyed() && wc.navigationHistory.canGoBack()) wc.navigationHistory.goBack()
    } catch {
      // 忽略
    }
    return this.buildState()
  }

  public goForward(tabId?: string): YanhuTabsState {
    const tab = this.resolveTab(tabId)
    try {
      const wc = tab?.view?.webContents
      if (wc && !wc.isDestroyed() && wc.navigationHistory.canGoForward()) wc.navigationHistory.goForward()
    } catch {
      // 忽略
    }
    return this.buildState()
  }

  public reload(tabId?: string, reason = 'user'): YanhuTabsState {
    const tab = this.resolveTab(tabId)
    if (tab?.blockedTarget) return this.returnFromBlocked(tab.id)
    const wc = tab?.view?.webContents
    if (wc && !wc.isDestroyed()) {
      logYanhuEvent('reload', { tabId: tab?.id, url: wc.getURL(), reason })
      // 归还 Cookie 管理权给 Chromium：原生 reload 保证瑞数动态签名时序完整，内层子框架并发请求携带全凭证
      wc.reload()
    }
    return this.buildState()
  }

  /** 一键自愈：摘除陈旧瑞数签名 + 剥离已消费票据后重新加载（供故障诊断卡片调用） */
  public async retryTabWithClean(tabId?: string): Promise<YanhuTabsState> {
    const tab = this.resolveTab(tabId)
    if (!tab) return this.buildState()
    tab.item.error = null
    const liveUrl =
      tab.view && !tab.view.webContents.isDestroyed() ? tab.view.webContents.getURL() : ''
    // chrome-error:// 是失败页自身地址，不可作为重载目标
    const source = liveUrl && !liveUrl.startsWith('chrome-error://') ? liveUrl : tab.item.url
    const cleanUrl = stripOneTimeTicket(source || this.homeUrl)
    tab.item.url = cleanUrl
    tab.item.loading = true
    if (!tab.view) {
      // 休眠或无底层视图时惰性唤醒：按净化后的地址重新加载
      this.instantiateTab(tab, { restoring: false })
    } else if (!tab.view.webContents.isDestroyed()) {
      logYanhuEvent('reload', { tabId: tab.id, url: cleanUrl, reason: 'retry-clean' })
      // 入场清洗（stripStaleRuiShuCookies）+ 新鲜签名加载，避免携带陈旧 *P 再次 400
      await this.loadWithFreshSignature(tab.view.webContents, cleanUrl)
    }
    if (this.activeTabId === tab.id) this.applyLayoutToActive()
    this.emitTabs()
    this.persist()
    return this.buildState()
  }

  /**
   * 弹出标签栏原生上下文菜单（Menu.popup）。
   *
   * 原生菜单由操作系统绘制，恒悬浮于 WebContentsView 之上，因此无需隐藏网页视图
   * 即可完整可见，从根本上消除自绘菜单遮挡与视口黑白闪烁。
   */
  public showTabContextMenu(tabId?: string): void {
    const owner = this.owner
    if (!owner || owner.isDestroyed()) return
    const tab = this.resolveTab(tabId)
    if (!tab) return
    const resolvedTabId = tab.id
    const targetUrl = parseYanhuBlockedTarget(tab.item.url) ?? tab.item.url

    const template: Electron.MenuItemConstructorOptions[] = [
      { label: '重新加载', click: () => this.reload(resolvedTabId) },
      { label: '复制链接', click: () => clipboard.writeText(targetUrl) },
      { type: 'separator' },
      { label: '关闭其他标签', click: () => this.closeOtherTabs(resolvedTabId) },
      { label: '关闭右侧标签', click: () => this.closeRightTabs(resolvedTabId) },
      { type: 'separator' },
      { label: '关闭标签', click: () => this.closeTab(resolvedTabId) },
    ]

    Menu.buildFromTemplate(template).popup({ window: owner })
  }

  /** 在系统默认浏览器打开（仅限 http/https） */
  public async openExternal(url: string): Promise<void> {
    try {
      const parsed = new URL(url)
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        await shell.openExternal(url)
      }
    } catch (err) {
      console.warn('[智联万站] 打开系统浏览器失败:', err)
    }
  }

  // ===== 布局与主题 =====

  /** 应用 renderer 测得布局（含晚到 IPC 的代际防抖） */
  public updateBounds(layout: YanhuViewLayout): void {
    if (!layout || !Number.isSafeInteger(layout.layoutSourceRevision)) return
    const prev = this.lastLayout
    if (prev) {
      const isNewRenderer = prev.rendererInstanceId !== layout.rendererInstanceId
      if (!isNewRenderer && layout.layoutSourceRevision < prev.layoutSourceRevision) return
      if (
        !isNewRenderer &&
        layout.layoutSourceRevision === prev.layoutSourceRevision &&
        Number.isSafeInteger(layout.revision) &&
        layout.revision <= prev.revision
      ) {
        return
      }
    }
    this.lastLayout = {
      rendererInstanceId: layout.rendererInstanceId,
      layoutSourceRevision: layout.layoutSourceRevision,
      revision: layout.revision,
      visible: layout.visible,
      viewportBounds: { ...layout.viewportBounds },
      pageBounds: { ...layout.pageBounds },
    }
    this.applyLayoutToActive()
  }

  /** 依据已存布局把宿主与网页视图摆放到正确位置 */
  private applyLayoutToActive(): void {
    const host = this.hostView
    const owner = this.owner
    if (!host || !owner || owner.isDestroyed()) return

    const layout = this.lastLayout
    if (!layout) {
      host.setVisible(false)
      this.hideAllTabViews()
      return
    }

    const zoom = owner.webContents.getZoomFactor()
    const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
    const viewport = {
      x: Math.round(layout.viewportBounds.x * scale),
      y: Math.round(layout.viewportBounds.y * scale),
      width: Math.max(0, Math.round(layout.viewportBounds.width * scale)),
      height: Math.max(0, Math.round(layout.viewportBounds.height * scale)),
    }
    const page = {
      x: Math.max(0, Math.round(layout.pageBounds.x * scale)),
      y: Math.max(0, Math.round(layout.pageBounds.y * scale)),
      width: Math.max(0, Math.round(layout.pageBounds.width * scale)),
      height: Math.max(0, Math.round(layout.pageBounds.height * scale)),
    }
    const hostBounds = {
      x: viewport.x + page.x,
      y: viewport.y + page.y,
      width: page.width,
      height: page.height,
    }

    const active = this.tabs.get(this.activeTabId)
    // HTML5 全屏期间铺满主窗口内容区：以 owner.getContentBounds() 为准，避免渲染层
    // 尚未响应窗口全屏时沿用旧的内缩矩形导致侧边栏/标题栏露出。
    const contentBounds =
      active && this.htmlFullscreenTabId === active.id ? owner.getContentBounds() : null
    const targetHostBounds = contentBounds
      ? { x: 0, y: 0, width: contentBounds.width, height: contentBounds.height }
      : hostBounds
    const targetPageBounds = contentBounds
      ? { x: 0, y: 0, width: contentBounds.width, height: contentBounds.height }
      : { x: 0, y: 0, width: page.width, height: page.height }
    const usable =
      viewport.width > MIN_USABLE_BOUNDS &&
      viewport.height > MIN_USABLE_BOUNDS &&
      page.width > MIN_USABLE_BOUNDS &&
      page.height > MIN_USABLE_BOUNDS
    const visible =
      layout.visible &&
      this.presented &&
      usable &&
      owner.isVisible() &&
      !!active &&
      !active.blockedTarget &&
      !active.item.error

    if (visible) host.setBounds(targetHostBounds)

    // 防御性隐藏非激活作用域的残留视图（正常情况下 switchScope 已释放）
    for (const [scopeName, scope] of Object.entries(this.scopes)) {
      if (scopeName === this.activeScope) continue
      for (const tab of scope.tabs.values()) {
        try {
          tab.view?.setVisible(false)
        } catch {
          // 视图可能已销毁
        }
      }
    }

    for (const tab of this.tabs.values()) {
      if (!tab.view) continue
      const shouldShow = visible && tab.id === this.activeTabId
      try {
        if (tab.view.getVisible() !== shouldShow) tab.view.setVisible(shouldShow)
        if (shouldShow) {
          tab.view.setBounds(targetPageBounds)
        }
      } catch {
        // 视图可能已销毁
      }
    }

    if (host.getVisible() !== visible) host.setVisible(visible)
    if (visible && active?.view && !active.view.webContents.isDestroyed()) {
      try {
        active.view.webContents.invalidate()
      } catch {
        // 忽略
      }
    }
  }

  private hideAllTabViews(): void {
    for (const tab of this.tabs.values()) {
      try {
        tab.view?.setVisible(false)
      } catch {
        // 忽略
      }
    }
  }

  /** 同步主题：底色防白闪 + 网页媒体仿真 */
  public async syncTheme(_isDark: boolean): Promise<void> {
    for (const tab of this.tabs.values()) {
      if (!tab.view || tab.view.webContents.isDestroyed()) continue
      yanhuThemeService.applyViewBackground(tab.view)
      await syncThemeToWebContents(tab.view.webContents, yanhuThemeService.resolveCurrentIsDark())
    }
  }

  // ===== 内存休眠守护 =====

  /** 后台标签过多且闲置超时时，释放其底层 WebContents（仅保留元数据） */
  private enforceDormancy(): void {
    const instantiatedBackground = [...this.tabs.values()].filter(
      (tab) => tab.view && tab.id !== this.activeTabId,
    )
    if (instantiatedBackground.length <= YANHU_DORMANT_MAX_BACKGROUND) return
    const now = Date.now()
    const candidates = instantiatedBackground
      .filter((tab) => now - tab.item.lastActiveAt > YANHU_DORMANT_IDLE_MS)
      .sort((a, b) => a.item.lastActiveAt - b.item.lastActiveAt)
    let released = 0
    while (
      released < instantiatedBackground.length - YANHU_DORMANT_MAX_BACKGROUND &&
      candidates.length > 0
    ) {
      const tab = candidates.shift()
      if (!tab) break
      this.releaseTabView(tab.id)
      released += 1
    }
    if (released > 0) {
      console.log(`[智联万站] 已休眠 ${released} 个闲置后台标签，回收底层 WebContents`)
    }
  }

  // ===== 状态装配 =====

  private resolveTab(tabId?: string): YanhuTabRecord | null {
    if (tabId) return this.tabs.get(tabId) ?? null
    return this.tabs.get(this.activeTabId) ?? null
  }

  private setActive(tabId: string): void {
    const tab = this.tabs.get(tabId)
    if (!tab) return
    for (const other of this.tabs.values()) {
      if (other.id !== tabId) {
        try {
          other.view?.setVisible(false)
        } catch {
          // 忽略
        }
      }
    }
    this.activeTabId = tabId
    tab.item.lastActiveAt = Date.now()
    this.applyLayoutToActive()
  }

  private buildState(): YanhuTabsState {
    const tabs: YanhuTabItem[] = this.tabOrder
      .map((id) => this.tabs.get(id))
      .filter((tab): tab is YanhuTabRecord => !!tab)
      .map((tab) => ({ ...tab.item }))
    return { tabs, activeTabId: this.activeTabId }
  }

  private emitTabs(): void {
    this.send(YANHU_EXPRESS_IPC_CHANNELS.ON_TABS_CHANGED, this.buildState())
  }

  /** 持久化拓扑（哨兵拦截 URL 复位为当前作用域默认首页，避免落盘无效协议） */
  private persist(): void {
    // 未完成初始化或拓扑为空时绝不落盘，避免竞态把用户已保存的标签清空
    if (!this.initialized || this.tabOrder.length === 0) return
    const state = this.buildState()
    const sanitized: YanhuTabsState = {
      activeTabId: state.activeTabId,
      tabs: state.tabs.map((tab) => ({
        ...tab,
        url: blockedTargetOf(tab.url) ? this.homeUrl : tab.url,
      })),
    }
    this.tabsStore.save(sanitized)
  }

  // ===== CDP 静默能力（为二期 AI 预留，按需附着） =====

  private async ensureCdpAttached(tab: YanhuTabRecord): Promise<void> {
    if (!tab.view || tab.view.webContents.isDestroyed()) return
    if (!yanhuDevToolsHub.has(tab.id)) {
      await yanhuDevToolsHub.attach(tab.id, tab.view.webContents)
    }
  }

  public async cdpGetDom(tabId?: string, depth?: number): Promise<unknown> {
    const tab = this.resolveTab(tabId)
    if (!tab) return null
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.getDomTree(tab.id, depth)
  }

  /** 全框架无障碍树（穿透 iframe/frameset，为纯文本 Agent 提供语义数据底座） */
  public async getFullAXTree(tabId?: string): Promise<unknown> {
    const tab = this.resolveTab(tabId)
    if (!tab) return null
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.getFullAXTree(tab.id)
  }

  public async cdpGetSource(tabId?: string): Promise<string> {
    const tab = this.resolveTab(tabId)
    if (!tab) return ''
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.getPageSource(tab.id)
  }

  public async cdpGetLoadedResources(tabId?: string): Promise<YanhuLoadedResource[]> {
    const tab = this.resolveTab(tabId)
    if (!tab) return []
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.getLoadedResources(tab.id)
  }

  public cdpGetNetworkLogs(tabId?: string, filterRegex?: string): YanhuNetworkEntry[] {
    const tab = this.resolveTab(tabId)
    if (!tab) return []
    return yanhuDevToolsHub.getNetworkLogs(tab.id, filterRegex)
  }

  public cdpGetConsoleLogs(tabId?: string): YanhuConsoleEntry[] {
    const tab = this.resolveTab(tabId)
    if (!tab) return []
    return yanhuDevToolsHub.getConsoleLogs(tab.id)
  }

  public async cdpExecuteScript(tabId: string | undefined, expression: string): Promise<unknown> {
    const tab = this.resolveTab(tabId)
    if (!tab) throw new Error('目标标签不存在')
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.executeScript(tab.id, expression)
  }

  // ===== 桌宠「砚小龙」运行时支撑能力（供无障碍浏览器工具层消费） =====

  /** 当前激活标签 ID */
  public getActiveTabId(): string {
    return this.activeTabId
  }

  /** 解析目标标签 ID（缺省回落当前激活标签） */
  public resolveTabId(tabId?: string): string | null {
    return this.resolveTab(tabId)?.id ?? null
  }

  /** 读取目标标签的 URL 与标题（缺省作用于当前激活标签） */
  public getTabMeta(tabId?: string): { url: string; title: string } | null {
    const tab = this.resolveTab(tabId)
    if (!tab) return null
    return { url: tab.item.url, title: tab.item.title }
  }

  /**
   * 读取目标标签底层文档的**真实 URL**（未做一次性票据剥离，已休眠 / 不存在返回空串）。
   *
   * `getTabMeta` 为落盘安全已剥离票据，无法反映当前文档实际地址；本方法直取 `webContents.getURL()`，
   * 供刷新类工具在发起导航前判定是否携带废票，从源头阻断「带失效票据裸重载导致白屏」。
   */
  public getTabLiveUrl(tabId?: string): string {
    const wc = this.getTabWebContents(tabId)
    if (!wc) return ''
    try {
      return wc.getURL()
    } catch {
      return ''
    }
  }

  /** 读取目标标签底层 WebContents（已休眠/不存在返回 null） */
  public getTabWebContents(tabId?: string): WebContents | null {
    const tab = this.resolveTab(tabId)
    if (!tab?.view || tab.view.webContents.isDestroyed()) return null
    return tab.view.webContents
  }

  /**
   * 捕获目标标签的原生视口截图（视觉截图辅助感知的底层支撑）。
   *
   * 直接使用 Electron `webContents.capturePage()` 获取视口物理像素图，返回 JPEG Base64
   * （质量 72，兼顾清晰度与上下文体积），并给出 DIP / 物理像素双尺寸，
   * 供双平面平行坐标锚定引擎（`yanhu-visual-anchor`）换算视觉归一化坐标。
   */
  public async captureViewport(tabId?: string): Promise<{
    dataUrl: string
    dipWidth: number
    dipHeight: number
    pixelWidth: number
    pixelHeight: number
  } | null> {
    const tab = this.resolveTab(tabId)
    if (!tab?.view || tab.view.webContents.isDestroyed()) return null
    const wc = tab.view.webContents
    let image: Awaited<ReturnType<WebContents['capturePage']>>
    try {
      image = await wc.capturePage()
    } catch {
      return null
    }
    if (image.isEmpty()) return null
    const size = image.getSize()
    let bounds = { width: size.width, height: size.height }
    try {
      const b = tab.view.getBounds()
      if (b.width > 0 && b.height > 0) bounds = { width: b.width, height: b.height }
    } catch {
      /* 退回物理像素尺寸 */
    }
    const dataUrl = `data:image/jpeg;base64,${image.toJPEG(72).toString('base64')}`
    return {
      dataUrl,
      dipWidth: Math.max(1, Math.round(bounds.width)),
      dipHeight: Math.max(1, Math.round(bounds.height)),
      pixelWidth: size.width,
      pixelHeight: size.height,
    }
  }

  /**
   * 在页面主上下文中求值表达式（依赖 CDP Runtime.evaluate，附带 CDP 附着）。
   * 单次表达式上限 64,000 字符由 DevToolsHub 把关。
   */
  public async evalInPage(tabId: string | undefined, expression: string): Promise<unknown> {
    const tab = this.resolveTab(tabId)
    if (!tab) throw new Error('目标标签不存在')
    await this.ensureCdpAttached(tab)
    return yanhuDevToolsHub.executeScript(tab.id, expression)
  }

  /**
   * 跨域（OOPIF）子框架 DOM 采集：现代内嵌第三方表单（支付 / 问卷 / 统一认证）常以跨域 iframe 呈现，
   * 页面脚本访问其 `contentWindow.document` 会抛 SecurityError 而彻底失明。此处改走 CDP：
   *   1. `Page.getFrameTree` 枚举全部子框架；
   *   2. 对**安全源不同**的跨域框架以 `Page.createIsolatedWorld` 建立独立执行上下文，运行同一采集脚本；
   *   3. 逐帧经 `DOM.getFrameOwner` + `DOM.getBoxModel` 自内向外累加各级 iframe 偏移，
   *      把子框架局部坐标投影为根视口绝对坐标，使硬件级点击可直接命中。
   *
   * 仅采集与主框架安全源不同的子框架，避免与页面脚本的同源采集重复。
   */
  public async collectCrossOriginFrameElements(
    tabId: string | undefined,
    collectorScript: string,
  ): Promise<{ elements: YanhuRawElement[]; dataTables: string[] }> {
    const empty = { elements: [] as YanhuRawElement[], dataTables: [] as string[] }
    const tab = this.resolveTab(tabId)
    if (!tab) return empty
    await this.ensureCdpAttached(tab)

    let frames: CrossFrameInfo[] = []
    try {
      const tree = await yanhuDevToolsHub.send(tab.id, 'Page.getFrameTree')
      frames = flattenFrameTree(tree.frameTree)
    } catch {
      return empty
    }
    if (frames.length === 0) return empty

    const top = frames.find((frame) => !frame.parentId)
    const topOrigin = safeOrigin(top?.securityOrigin || top?.url || '')
    const elements: YanhuRawElement[] = []
    const dataTables: string[] = []
    let ordinal = 0

    for (const frame of frames) {
      if (!frame.parentId) continue
      const origin = safeOrigin(frame.securityOrigin || frame.url || '')
      // 仅处理跨域框架：同源框架已由页面脚本自行穿透，重复采集会造成 BID 冗余
      if (!origin || origin === topOrigin) continue
      ordinal += 1
      try {
        const offset = await this.resolveFrameOffset(tab.id, frame, frames)
        const world = await yanhuDevToolsHub.send(tab.id, 'Page.createIsolatedWorld', {
          frameId: frame.frameId,
          worldName: 'yanhu-oopif',
          grantUniveralAccess: false,
        })
        const contextId = typeof world.executionContextId === 'number' ? world.executionContextId : null
        if (contextId === null) continue
        const evaluated = await yanhuDevToolsHub.send(tab.id, 'Runtime.evaluate', {
          expression: collectorScript,
          contextId,
          returnByValue: true,
          awaitPromise: true,
        })
        const payload = (evaluated.result as { value?: unknown } | undefined)?.value as
          | { elements?: unknown; dataTables?: unknown }
          | null
        if (!payload || !Array.isArray(payload.elements)) continue
        const framePath = `xframe:${ordinal}`
        for (const raw of payload.elements) {
          const el = raw as YanhuRawElement
          if (!el || typeof el !== 'object') continue
          const bounds = el.bounds ?? { x: 0, y: 0, width: 0, height: 0 }
          elements.push({
            ...el,
            framePath,
            bounds: {
              x: Math.round(bounds.x + offset.x),
              y: Math.round(bounds.y + offset.y),
              width: Math.round(bounds.width),
              height: Math.round(bounds.height),
            },
          })
        }
        if (Array.isArray(payload.dataTables)) {
          for (const table of payload.dataTables) if (typeof table === 'string') dataTables.push(table)
        }
      } catch {
        // 单个框架采集失败不影响其余框架
      }
    }
    return { elements, dataTables }
  }

  /** 逐级累加框架在其父视口中的偏移，投影为根视口绝对坐标（跨域穿透兜底） */
  private async resolveFrameOffset(
    tabId: string,
    frame: CrossFrameInfo,
    frames: readonly CrossFrameInfo[],
  ): Promise<{ x: number; y: number }> {
    let x = 0
    let y = 0
    let current: CrossFrameInfo | undefined = frame
    let guard = 0
    while (current && current.parentId && guard < 16) {
      const parentFrameId: string = current.parentId
      try {
        const owner = await yanhuDevToolsHub.send(tabId, 'DOM.getFrameOwner', { frameId: current.frameId })
        const backendNodeId = typeof owner.backendNodeId === 'number' ? owner.backendNodeId : null
        if (backendNodeId !== null) {
          const box = await yanhuDevToolsHub.send(tabId, 'DOM.getBoxModel', { backendNodeId })
          const content = (box.model as { content?: unknown } | undefined)?.content
          if (Array.isArray(content) && content.length >= 2) {
            x += Number(content[0]) || 0
            y += Number(content[1]) || 0
          }
        }
      } catch {
        // 单级偏移解析失败时停止累加，保留已得偏移
        break
      }
      current = frames.find((candidate) => candidate.frameId === parentFrameId)
      guard += 1
    }
    return { x, y }
  }

  /**
   * 派发真实硬件级物理点击（High-Fidelity Click Pipeline）。
   *
   * 补齐 `mouseMoved` 预热（触发 :hover 与动态事件绑定）、真实按键微延迟脉冲（拒绝 0ms
   * 机器瞬发被风控拦截）与释放，使 `event.isTrusted === true`，可在内核级触发原生导航 /
   * 表单默认行为。当 CDP 交互不可用时抛出异常，由工具层回退至原生 `element.click()`。
   */
  public async dispatchHumanClick(
    tabId: string | undefined,
    x: number,
    y: number,
    options: { doubleClick?: boolean; dwellMs?: number } = {},
  ): Promise<void> {
    const tab = this.resolveTab(tabId)
    if (!tab) throw new Error('目标标签不存在')
    await this.ensureCdpAttached(tab)

    const targetX = Math.round(x)
    const targetY = Math.round(y)
    const clickCount = options.doubleClick ? 2 : 1
    const dwellMs = Math.max(30, Math.min(options.dwellMs ?? 40, 100))

    // 1. 预热鼠标滑过 (mouseMoved)：触发 :hover 伪类与动态事件监听挂载
    await yanhuDevToolsHub.send(tab.id, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetX,
      y: targetY,
    })
    await new Promise((resolve) => setTimeout(resolve, dwellMs))

    const press = async (): Promise<void> => {
      // 2. 物理按下 (mousePressed)
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: targetX,
        y: targetY,
        button: 'left',
        clickCount,
      })
      // 3. 物理按压接触驻留（人类按键自然驻留，杜绝 0ms 瞬发）
      await new Promise((resolve) => setTimeout(resolve, 50))
      // 4. 物理抬起 (mouseReleased)
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: targetX,
        y: targetY,
        button: 'left',
        clickCount,
      })
    }

    await press()
    if (options.doubleClick) {
      await new Promise((resolve) => setTimeout(resolve, 80))
      await press()
    }
  }

  /**
   * 派发真实文本流输入（High-Fidelity Fill & PressEnter Pipeline）。
   *
   * ① CDP 物理点击聚焦 → ② 可选全选 + Backspace 清空 → ③ `Input.insertText` 驱动
   * Chromium 原生文本输入管道 → ④ 可选回车：默认派发**合成**回车（仅触发页面 JS 监听，
   * 不触发原生表单提交）；仅 `allowFormSubmit=true` 时才下发原生受信任回车真正提交表单。
   */
  public async dispatchHumanTextInput(
    tabId: string | undefined,
    x: number,
    y: number,
    text: string,
    options: { clearFirst?: boolean; pressEnter?: boolean; allowFormSubmit?: boolean } = {},
  ): Promise<void> {
    const tab = this.resolveTab(tabId)
    if (!tab) throw new Error('目标标签不存在')
    await this.ensureCdpAttached(tab)

    // 1. 物理点击聚焦：触发原生 focus 事件与光标闪烁
    await this.dispatchHumanClick(tabId, x, y)
    await new Promise((resolve) => setTimeout(resolve, 50))

    // 2. 清空输入框内容（全选 + Backspace 真实键码）
    if (options.clearFirst) {
      const isMac = process.platform === 'darwin'
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
        type: 'rawKeyDown',
        modifiers: isMac ? 4 : 2, // Cmd (Mac) 或 Ctrl (Win)
        windowsVirtualKeyCode: 65, // 'A'
        key: 'a',
        code: 'KeyA',
      })
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
        type: 'keyUp',
        modifiers: isMac ? 4 : 2, // 与按下时保持一致，确保修饰键正确释放
        windowsVirtualKeyCode: 65,
        key: 'a',
        code: 'KeyA',
      })
      await new Promise((resolve) => setTimeout(resolve, 30))
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
        type: 'rawKeyDown',
        windowsVirtualKeyCode: 8, // Backspace
        key: 'Backspace',
        code: 'Backspace',
      })
      await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
        type: 'keyUp',
        windowsVirtualKeyCode: 8,
        key: 'Backspace',
        code: 'Backspace',
      })
      await new Promise((resolve) => setTimeout(resolve, 30))
    }

    // 3. 真实文本流注入 (Input.insertText)：原汁原味触发内部 input 事件
    if (text.length > 0) {
      await yanhuDevToolsHub.send(tab.id, 'Input.insertText', { text })
      await new Promise((resolve) => setTimeout(resolve, 40))
    }

    // 4. 回车收口（关键安全语义）：默认只派发**合成（非受信任）**回车——可触发页面自身的
    //    keydown/keypress/keyup 监听（下拉筛选、联想选定等），但**不会**触发浏览器对 <form> 的
    //    隐式提交。实测事故：在表单内的搜索框上发原生回车，导致「请假申请」被直接提交并白屏。
    //    仅当调用方显式 allowFormSubmit=true 时，才下发 CDP 原生受信任回车以真正提交表单。
    if (options.pressEnter) {
      if (options.allowFormSubmit === true) {
        await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
          type: 'rawKeyDown',
          windowsVirtualKeyCode: 13,
          nativeVirtualKeyCode: 13,
          key: 'Enter',
          code: 'Enter',
          text: '\r',
          unmodifiedText: '\r',
        })
        await new Promise((resolve) => setTimeout(resolve, 30))
        await yanhuDevToolsHub.send(tab.id, 'Input.dispatchKeyEvent', {
          type: 'keyUp',
          windowsVirtualKeyCode: 13,
          nativeVirtualKeyCode: 13,
          key: 'Enter',
          code: 'Enter',
        })
      } else {
        // 合成（非受信任）回车：只触发页面 JS 监听，不触发原生表单提交
        try {
          await this.evalInPage(tab.id, buildSyntheticEnterScript())
        } catch {
          // 合成回车失败不影响已完成的文本写入
        }
      }
    }
  }

  // ===== 确定性同步与因果感知（供工具层稳态与因果引擎消费） =====

  /** 网络平面：读取目标标签当前在途业务请求数（缺省作用于激活标签） */
  public getInflightRequestCount(tabId?: string): number {
    const tab = this.resolveTab(tabId)
    return tab ? yanhuDevToolsHub.getInflightCount(tab.id) : 0
  }

  /** 网络平面：读取目标标签最近一次网络活动时间戳（缺省作用于激活标签） */
  public getNetworkActivityAt(tabId?: string): number {
    const tab = this.resolveTab(tabId)
    return tab ? yanhuDevToolsHub.getNetworkActivityAt(tab.id) : 0
  }

  /** 标签拓扑：当前标签总数（新标签页因果贯通判定用） */
  public getTabCount(): number {
    return this.tabOrder.length
  }

  /** 构建标签的双平面稳态探针（网络平面取自 CDP 总线，DOM 平面走跨 Frame 排空脚本） */
  private createStabilizationProbe(tabId: string): StabilizationProbe {
    return {
      inflightCount: () => yanhuDevToolsHub.getInflightCount(tabId),
      lastNetworkActivityAt: () => yanhuDevToolsHub.getNetworkActivityAt(tabId),
      drainCrossFrame: (options: CrossFrameDrainOptions) => this.drainCrossFrame(tabId, options),
    }
  }

  /** 执行一次跨 Frame DOM 排空探测（脚本异常安全降级为「静止无突变」） */
  private async drainCrossFrame(tabId: string, options: CrossFrameDrainOptions): Promise<CrossFrameDrainResult> {
    try {
      return normalizeCrossFrameDrain(await this.evalInPage(tabId, buildCrossFrameDrainScript(options)))
    } catch {
      return { settled: true, mutated: false, mutations: 0, frames: 0, elapsedMs: 0 }
    }
  }

  /**
   * 因果探测：首个跨 Frame DOM 突变即提前返回，否则等待至观察窗截止（No-Op 判定用）。
   */
  public async probeCrossFrameActivity(tabId: string | undefined, windowMs: number): Promise<CrossFrameDrainResult> {
    const tab = this.resolveTab(tabId)
    if (!tab) return { settled: true, mutated: false, mutations: 0, frames: 0, elapsedMs: 0 }
    return this.drainCrossFrame(tab.id, { minMs: 0, maxMs: windowMs, quietMs: 0, resolveOnFirstMutation: true })
  }

  /**
   * 双平面自适应静止等待：网络流在途清零 + 跨 Frame DOM 排空 + 滑动窗口静默确认。
   * 完全由网络与渲染管线自适应，无需用户配置任何延时。
   */
  public async awaitStable(tabId: string | undefined, options: QuiescenceOptions = {}): Promise<QuiescenceResult> {
    const tab = this.resolveTab(tabId)
    if (!tab) {
      return { settled: true, timedOut: false, elapsedMs: 0, inflight: 0, frames: 0, mutations: 0, lastActivityAt: 0 }
    }
    return yanhuStabilizationWatcher.waitForQuiescence(this.createStabilizationProbe(tab.id), options)
  }

  /**
   * 等待页面停止加载并进入双平面静止态（供工具层 waitForNavigation / 导航后收口使用）。
   *
   * 先按底层 WebContents 的加载态等待 `did-stop-loading`，随后以网络流与跨 Frame DOM 排空
   * 自适应确认静默；任一平面活跃即延后结算，硬超时兜底不阻塞。
   */
  public async waitForIdle(tabId: string | undefined, timeoutMs = 3000): Promise<void> {
    const tab = this.resolveTab(tabId)
    const wc = tab?.view?.webContents
    if (!tab || !wc || wc.isDestroyed()) return
    if (wc.isLoading()) {
      await new Promise<void>((resolve) => {
        let settled = false
        const finish = (): void => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          wc.removeListener('did-stop-loading', finish)
          resolve()
        }
        const timer = setTimeout(finish, timeoutMs)
        wc.once('did-stop-loading', finish)
      })
    }
    await this.awaitStable(tab.id, {
      timeoutMs: Math.max(400, Math.min(timeoutMs, 4000)),
      windowMs: 400,
    })
  }
}

/** 全局单例 */
export const yanhuExpressManager = new YanhuExpressManager()