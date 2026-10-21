/**
 * 智联万站 · 专属门禁工具集（YanhuBrowserTools）
 * 这是「砚小龙」运行时唯一可用的工具源，共 14 项浏览器专属能力。
 * 所有工具严格不对外部通用 Agent 暴露，语义上等价于“只在上网，不碰本机”。
 * 工具采用供应商无关的统一 ToolDefinition 契约（JSON Schema 风格），
 * 供 `buildYanhuBrowserTools(tabResolver)` 装配为可投递给大模型的工具清单。
 * 执行层统一由 `yanhuExpressManager` 驱动底层 WebContentsView 与 CDP 总线。
 */

import { isYanhuBlockedUrl, type YanhuBidNode, type YanhuDistilledPage, type YanhuNetworkEntry } from '@profer/shared'
import type { ToolDefinition } from '@profer/core'
import { yanhuExpressManager } from './yanhu-express-manager'
import { isCdutDomain } from './yanhu-domain-gatekeeper'
import { hasOneTimeTicket, stripOneTimeTicket } from './yanhu-constants'
import { logYanhuEvent } from './yanhu-event-log'
import {
  HybridAdaptiveDispatcher,
  yanhuDeadlockGuard,
  type CausalObservation,
  type CausalSnapshot,
  type HybridDispatcherAdapter,
} from './yanhu-stabilization'
import {
  buildYanhuCollectorScript,
  formatBidLine,
  normalizeStateString,
  yanhuDomDistillationEngine,
  YANHU_ACCESSIBLE_NAME_SNIPPET,
  YANHU_POPUP_SELECTORS,
  type BidNodeRecord,
  type YanhuCollectedPage,
} from './yanhu-dom-distillation'
import {
  buildVisualSnapScript,
  buildVisualSnapshot,
  getVisualSnapshot,
  setVisualSnapshot,
  visualToDip,
  visualToPixel,
  VISUAL_SNAP_RADIUS_PX,
  type VisualAnchorSnapshot,
  type VisualLandmark,
} from './yanhu-visual-anchor'

/** 单个工具的执行回调 */
export interface YanhuToolExecutionResult {
  content: string
  isError?: boolean
}

/** 单个门禁工具的完整描述（定义 + 胶囊标签 + 执行器） */
export interface YanhuBrowserTool {
  definition: ToolDefinition
  /** 生成微胶囊标签（如「👆 点击 [3] 成绩查询」） */
  label: (args: Record<string, unknown>) => string
  /** 执行器 */
  execute: (args: Record<string, unknown>) => Promise<YanhuToolExecutionResult>
  /** 是否为开发者级工具 */
  developer?: boolean
}

// ===== 单轮 Token 预算硬上限（防止单次工具输出撑爆上下文） =====

/** `yanhu_read_page` 缺省 Token 预算（弹性扩容至 2500，避免页面靠后深层元素被过早腰斩） */
export const DEFAULT_READ_PAGE_TOKENS = 2500
/** `yanhu_read_page` 显式请求时的 Token 上限 */
export const MAX_READ_PAGE_TOKENS = 6000
/** `yanhu_eval_script` 返回内容字符上限 */
const EVAL_SCRIPT_MAX_CHARS = 500
/** `yanhu_inspect_element` 内联 HTML 字符上限 */
const INSPECT_HTML_MAX_CHARS = 300
/** `yanhu_inspect_element` 总输出字符上限 */
const INSPECT_OUTPUT_MAX_CHARS = 600
/** 网络日志单条 URL 字符上限 */
const NETWORK_URL_MAX_CHARS = 120
/** 网络日志总字符硬熔断 */
const NETWORK_TOTAL_MAX_CHARS = 1000

/**
 * 读页缓存有效期（毫秒）。
 *
 * 缓存用于消除「同一时刻连续读」的重复采集；但若页面通过 XHR / 定时器**异步自更新**而未触发
 * 导航或交互事件，长期命中缓存会永远返回陈旧快照并被误判为「页面无变化」。故设短 TTL 兜底。
 * 超时后强制重新采集，兼顾性能与正确性。 */
const YANHU_READ_CACHE_TTL_MS = 1500

// ===== 拟人化操作节流（Human-like Action Throttler）：防教务系统高频触发注销 =====

/** 两次交互动作之间的恒定物理间隔（毫秒）——严格固定，杜绝高频连击被判定为机器爬虫 */
export const YANHU_ACTION_MIN_INTERVAL_MS = 500

/** 最近一次交互动作时间戳（模块级，跨工具共享） */
let lastYanhuActionTime = 0

/**
 * 「重复点击」判定窗口（毫秒）。
 *
 * 同一标签内对**同一 BID** 的再次点击，若模型所见的页面渲染内容自上次点击起完全未变，
 * 则判定为无意义重复点击并拦截——URL / 框架常常都不变，只有渲染内容变，故判定必须基于内容指纹。 */
export const YANHU_REPEAT_CLICK_WINDOW_MS = 60_000

/** 重置节流时钟（仅供单测隔离使用） */
export function resetYanhuActionThrottle(): void {
  lastYanhuActionTime = 0
}

/**
 * 自适应安全间隔控制器（动静分离节流）。
 *
 * 纯表单内部控件操作（fill / select / set_date / 局部点击）不产生全页网络请求，成理 WAF
 * 不检测纯前端 JS 变化，故施加 **0ms** 间隔直接放行，彻底消灭「本地填一项先等 500ms」的负优化；
 * 仅可能触发全页加载的网络导航操作（navigate / reload）保留恒定 500ms 物理间隔。
 * 杜绝高频连击被教务系统判定为机器而注销登录态。 */
export async function enforceYanhuHumanInterval(
  isLocalAction = false,
  nowFn: () => number = Date.now,
): Promise<void> {
  if (isLocalAction) return
  const now = nowFn()
  const elapsed = now - lastYanhuActionTime
  if (elapsed < YANHU_ACTION_MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, YANHU_ACTION_MIN_INTERVAL_MS - elapsed))
  }
  lastYanhuActionTime = nowFn()
}

/** 动作执行后的 DOM 稳态观察窗（毫秒）：等待局部重绘与事件派发完成 */
const YANHU_ACTION_SETTLE_MS = 300
/** DOM 稳态观察窗硬超时（毫秒）：无论如何不超过该上限，杜绝死等 */
const YANHU_ACTION_SETTLE_MAX_MS = 500

/** 危险操作（注销 / 退出登录）名称特征：命中即由底层硬拦截，保护当前会话 */
const YANHU_DANGEROUS_ACTION_RE = /(安全退出|退出登录|退出系统|注销|Logout|返回登录)/i

/** 工具层短路熔断提示（连续重复空读且无有效交互时） */
const YANHU_CIRCUIT_BREAK_NOTICE =
  '【熔断拦截】当前页面与上一状态完全一致且未执行任何交互操作，禁止重复刷新读取！请直接使用已有 [BID] 执行点击、选择等操作，或向用户汇报结果。';

/**
 * 生成页面脚本：基于 DOM Mutation / 样式突变观察局部展开，一旦静默即提前返回。
 *
 * 相比盲目 `waitForIdle` 死等整页导航超时，本脚本保证至少 300ms、至多 500ms 的稳态观察窗。
 * 检测到折叠菜单 / 卡片展开等局部突变后于静默 120ms 立即返回，兼顾响应速度与重绘完整性。 */
function buildDomSettleScript(): string {
  return `(() => {
    return new Promise((resolve) => {
      const started = Date.now();
      const MIN = ${YANHU_ACTION_SETTLE_MS}, MAX = ${YANHU_ACTION_SETTLE_MAX_MS}, QUIET = 120;
      let done = false, lastMutation = 0, obs = null;
      const finish = () => {
        if (done) return;
        done = true;
        try { if (obs) obs.disconnect(); } catch (e) {}
        resolve({ settled: true, elapsed: Date.now() - started });
      };
      try {
        obs = new MutationObserver(() => { lastMutation = Date.now(); });
        obs.observe(document.documentElement || document, {
          childList: true, subtree: true, attributes: true,
          attributeFilter: ['style', 'class', 'hidden', 'aria-hidden', 'open'],
        });
      } catch (e) {}
      const tick = () => {
        if (done) return;
        const now = Date.now();
        if (now - started >= MAX) return finish();
        if (now - started >= MIN && now - lastMutation >= QUIET) return finish();
        setTimeout(tick, 50);
      };
      setTimeout(tick, MIN);
    });
  })()`
}

/** 执行动作后的 DOM 稳态微等待（脚本异常时回退为固定观察窗） */
async function waitForDomSettle(tabId: string): Promise<void> {
  try {
    await yanhuExpressManager.evalInPage(tabId, buildDomSettleScript())
  } catch {
    await new Promise((resolve) => setTimeout(resolve, YANHU_ACTION_SETTLE_MS))
  }
}

/** 生成仅重载教务主框架核心内容区（mainFrame）的脚本，保护外层导航框架不丢失 */
function buildMainFrameReloadScript(): string {
  return `(() => {
    try {
      const mf = document.querySelector('frame[name="mainFrame"], iframe[name="mainFrame"], frame#mainFrame, iframe#mainFrame');
      if (mf) {
        const frameWin = mf.contentWindow || (window.frames && window.frames['mainFrame']);
        if (frameWin && frameWin.location && typeof frameWin.location.reload === 'function') {
          frameWin.location.reload();
          return { ok: true };
        }
      }
    } catch (e) {}
    return { ok: false };
  })()`
}

/**
 * 页面无变化时的短路提示：
 *
 * 关键修复：不再只回传前 8 项（历史缺陷会导致「看不到 BID > 8 的控件 → 反复盲猜 → 12 轮空转」）。
 * 而是输出**当前全部**可交互控件的紧凑索引，并由调用方按 token 预算截断，保证模型始终持有完整台账。 */
export function buildUnchangedNotice(page: YanhuDistilledPage): string {
  const lines = [
    '=== [PageDigest: 页面无变化] ===',
    '当前页面与上一次观察完全一致（含各控件当前值），未发生跳转或内容刷新。请核对下方台账后继续推进，不要再盲目调用 yanhu_read_page！',
  ]
  // 逐条输出与全量 PageDigest **同口径**的完整行（含 value / options / 遮挡标记）。
  //
  // 历史缺陷：这里曾只输出「[bid] role "name"」，把各控件**当前值**全部丢掉。于是长表单填写过程中
  // （绝大多数 read_page 都走「无变化」短路）模型完全无法核对「我刚填的值到底进没进去」，
  // 进而怀疑自己的历史操作是否真的发生过、甚至怀疑环境是模拟的——这属于工具层的信息缺失，
  // 不是模型的问题。现与全量摘要共用同一格式化器，保证任何时候都能自证状态。
  if (page.nodes.length > 0) {
    lines.push(`当前可用控件索引（共 ${page.nodes.length} 项，含当前值）：`)
    for (const node of page.nodes) {
      lines.push(`- ${formatBidLine(node)}`)
    }
  } else {
    lines.push('当前页面未识别到任何可交互控件。')
  }
  lines.push(
    '提示：若目标控件不在上方索引中，说明它未被识别为独立可交互元素；可尝试点击其所在容器 [BID]，或使用 yanhu_scroll / yanhu_get_network_logs 进一步排查。请勿重复空读。',
  )
  return lines.join('\n')
}

/** 静态资源后缀（图片 / 字体 / 媒体 / 样式脚本，一律从网络日志中过滤） */
const YANHU_NETWORK_STATIC_RE =
  /\.(png|jpe?g|gif|webp|svg|ico|bmp|woff2?|ttf|eot|otf|mp4|mp3|webm|ogg|wav|css|js|map)$/i

/**
 * 净化并硬熔断网络日志（纯函数，便于单测）。
 *
 * - 丢弃 `data:` 协议、静态资源（图片/字体/媒体/样式脚本）与 favicon。
 * - 单条 URL 超长截断。
 * - 逐行累加到 total 字符上限即停，彻底杜绝对大模型的 Base64 / 静态资源噪声轰炸。 */
export function sanitizeYanhuNetworkLogs(
  entries: readonly YanhuNetworkEntry[],
  options: { maxLines?: number; maxUrlChars?: number; maxTotalChars?: number } = {},
): string {
  const maxLines = options.maxLines && options.maxLines > 0 ? options.maxLines : 30
  const maxUrlChars = options.maxUrlChars && options.maxUrlChars > 0 ? options.maxUrlChars : NETWORK_URL_MAX_CHARS
  const maxTotalChars = options.maxTotalChars && options.maxTotalChars > 0 ? options.maxTotalChars : NETWORK_TOTAL_MAX_CHARS
  const lines: string[] = []
  let total = 0
  for (const entry of entries.slice(-maxLines)) {
    const url = typeof entry.url === 'string' ? entry.url : ''
    if (!url || url.startsWith('data:')) continue
    const path = url.split('?')[0]?.split('#')[0] ?? url
    if (YANHU_NETWORK_STATIC_RE.test(path)) continue
    if (/favicon/i.test(path)) continue
    const shown = url.length > maxUrlChars ? `${url.slice(0, maxUrlChars)}…` : url
    const duration = entry.timing?.durationMs != null ? `${entry.timing.durationMs}ms ` : ''
    const line = `${entry.method || 'GET'} ${entry.status ?? '-'} ${duration}${shown}`
    if (total + line.length + 1 > maxTotalChars) {
      lines.push('…（已按 token 预算截断）。')
      break
    }
    lines.push(line)
    total += line.length + 1
  }
  if (lines.length === 0) {
    return entries.length === 0 ? '暂无网络日志。' : '（网络日志均为静态资源/data协议，已省略）'
  }
  return lines.join('\n')
}

/**
 * 剥离模型偶发抄入的装饰符（反引号 / 引号）与首尾空白。
 *
 * 历史故障：提示词中以反引号包裹 URL 作为示例，模型把反引号一并抄进入参，
 * 产生 `"url": "`https://...`"` 这样的非法地址，导航拿到脏值后必然失败。
 * 仅在「整串被同一对符号包裹，且内部不含该符号」时才剥离，绝不误伤合法内容。
 */
export function stripDecorators(
  value: string,
  symbols: readonly (readonly [string, string])[] = [],
): string {
  let out = value.trim()
  const pairs: ReadonlyArray<readonly [string, string]> = [['`', '`'], ...symbols]
  for (const [open, close] of pairs) {
    if (out.length > 1 && out.startsWith(open) && out.endsWith(close)) {
      const inner = out.slice(1, -1)
      if (!inner.includes(open) && !inner.includes(close)) {
        out = inner.trim()
        break
      }
    }
  }
  return out
}

/** URL 类入参的额外汇总符号：模型除反引号外也常把整串地址加引号 */
export const URL_DECORATORS = [['"', '"'], ["'", "'"], ['“', '”'], ['‘', '’']] as const

/** 解析入参整数（容忍模型把数字写成 `87` / "87" 这类带装饰符的字符串） */
export function asInt(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : fallback
  const text = stripDecorators(typeof value === 'string' ? value : '', URL_DECORATORS)
  if (!text) return fallback
  const n = Number(text)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

/** 安全读取字符数 */
function asStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

/** 归一化页面采集回执（防御式，拒绝非法结构） */
function normalizeCollected(raw: unknown): YanhuCollectedPage {
  if (!raw || typeof raw !== 'object') return { url: '', title: '', elements: [] }
  const candidate = raw as Partial<YanhuCollectedPage>
  return {
    url: typeof candidate.url === 'string' ? candidate.url : '',
    title: typeof candidate.title === 'string' ? candidate.title : '',
    elements: Array.isArray(candidate.elements) ? candidate.elements : [],
    dataTables: Array.isArray(candidate.dataTables)
      ? candidate.dataTables.filter((table): table is string => typeof table === 'string')
      : undefined,
    textDigest: typeof candidate.textDigest === 'string' ? candidate.textDigest : undefined,
    textSample: typeof candidate.textSample === 'string' ? candidate.textSample : undefined,
    unrendered:
      candidate.unrendered && typeof candidate.unrendered.count === 'number'
        ? {
            count: candidate.unrendered.count,
            regions: Array.isArray(candidate.unrendered.regions)
              ? candidate.unrendered.regions.filter((r): r is string => typeof r === 'string')
              : [],
          }
        : undefined,
  }
}

/**
 * 生成页面内元素定位器前置脚本。
 *
 * 通过「标题 + 可访问名 + 边界中心距离」三元匹配，规避动态 class / XPath 脆弱性。
 *
 * 名称推导与采集端共用 {@link YANHU_ACCESSIBLE_NAME_SNIPPET}，保证 BID 语义与定位完全对称；
 * 且当「名称全不匹配」时**绝不盲猜坐标最近者**（仅折叠 / 历史回退的放宽模式才允许坐标兜底），
 * 从根源根除「静默点错控件」——点错一个「退课」远比点不中更危险。 */
function buildFinderPrelude(record: YanhuBidNode, options: { relaxed?: boolean } = {}): string {
  const tag = JSON.stringify(record.tag)
  const name = JSON.stringify(record.name)
  const targetFrame = JSON.stringify(record.framePath || '')
  const cx = Math.round(record.bounds.x + record.bounds.width / 2)
  const cy = Math.round(record.bounds.y + record.bounds.height / 2)
  const relaxed = options.relaxed === true
  return `
    ${YANHU_ACCESSIBLE_NAME_SNIPPET}
    const __tag = ${tag}, __name = ${name}, __cx = ${cx}, __cy = ${cy}, __targetFrame = ${targetFrame}, __relaxed = ${relaxed ? 'true' : 'false'};
    const __normName = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    const __nameMatches = (text) => {
      if (!__name) return true;
      const a = __normName(text), b = __normName(__name);
      if (!a) return false;
      return a === b || (a.indexOf(b) >= 0 && b.length > 0) || (b.indexOf(a) >= 0 && a.length > 0);
    };
    const __find = () => {
      let bestNamed = null, bestNamedScore = Infinity, bestAny = null, bestAnyScore = Infinity;
      const scanDoc = (doc, framePath, offsetX, offsetY, depth) => {
        if (!doc || depth > 6) return;
        try {
          const root = doc.body || doc.documentElement || doc;
          const list = Array.from(root.querySelectorAll ? root.querySelectorAll(__tag) : []);
          for (const el of list) {
            const r = el.getBoundingClientRect();
            if (!__relaxed && (r.width <= 0 || r.height <= 0)) continue;
            const ecx = offsetX + r.left + r.width / 2;
            const ecy = offsetY + r.top + r.height / 2;
            const d = Math.abs(ecx - __cx) + Math.abs(ecy - __cy);
            const frameOk = !__targetFrame || framePath === __targetFrame;
            const score = d + (frameOk ? 0 : 20000);
            if (__nameMatches(__yanhuDeriveName(el, el.ownerDocument || doc))) {
              if (score < bestNamedScore) { bestNamedScore = score; bestNamed = el; }
            } else if (score < bestAnyScore) { bestAnyScore = score; bestAny = el; }
          }
        } catch (e) {}

        try {
          const frameEls = Array.from(doc.querySelectorAll ? doc.querySelectorAll('frame, iframe') : []);
          for (let i = 0; i < frameEls.length; i++) {
            const f = frameEls[i];
            let fr = { left: 0, top: 0 };
            try { fr = f.getBoundingClientRect(); } catch {}
            const fName = f.getAttribute('name') || f.getAttribute('id') || ('frame_' + i);
            const nextPath = framePath ? (framePath + '/' + fName) : fName;
            try {
              // 三级鲁棒穿透：contentDocument -> contentWindow.document -> defaultView.frames[name | i].document
              const frameWin = f.contentWindow;
              const view = doc.defaultView;
              const subDoc =
                f.contentDocument ||
                (frameWin && frameWin.document) ||
                (view && view.frames && (
                  (view.frames[fName] && view.frames[fName].document) ||
                  (view.frames[i] && view.frames[i].document)
                ));
              if (subDoc) scanDoc(subDoc, nextPath, offsetX + (fr.left || 0), offsetY + (fr.top || 0), depth + 1);
            } catch (e) {}
          }
        } catch (e) {}
      };

      scanDoc(document, '', 0, 0, 0);
      // 优先返回名称匹配者；无名称匹配时仅在放宽模式下按坐标兜底，否则拒绝盲点
      if (bestNamed) return bestNamed;
      if (__relaxed) return bestAny;
      return null;
    };
  `
}

/** 生成祖先容器自动解封 + 瞬时居中的公共脚本片段（供 click / fill / select 复用） */
function buildUnsealHelpers(): string {
  return `
    const __unseal = (el) => {
      try {
        let node = el, depth = 0;
        while (node && node.nodeType === 1 && depth < 8) {
          const tag = (node.tagName || '').toLowerCase();
          const cls = (node.className && typeof node.className === 'string') ? node.className : '';
          const id = node.id || '';
          const hay = (cls + ' ' + id).toLowerCase();
          if (tag === 'details' && !node.open) { try { node.open = true; } catch (e) {} }
          if (/(^|\\s)(collapse|collapsed|accordion)(\\s|$)/.test(hay) && !/(^|\\s)show(\\s|$)/.test(hay)) {
            try { node.classList.remove('collapsing'); node.classList.add('show'); } catch (e) {}
            if (id) {
              try {
                const doc = node.ownerDocument;
                const trigger = doc.querySelector('[data-bs-toggle="collapse"][href="#' + id + '"], [data-toggle="collapse"][href="#' + id + '"], [aria-controls="' + id + '"]');
                if (trigger && typeof trigger.click === 'function') trigger.click();
              } catch (e) {}
            }
          }
          if (/(^|\\s)tab-pane(\\s|$)/.test(hay) && !/(^|\\s)(active|show)(\\s|$)/.test(hay)) {
            if (id) {
              try {
                const doc = node.ownerDocument;
                const trigger = doc.querySelector('[data-bs-toggle="tab"][href="#' + id + '"], [data-toggle="tab"][href="#' + id + '"], [role="tab"][aria-controls="' + id + '"]');
                if (trigger && typeof trigger.click === 'function') trigger.click();
              } catch (e) {}
            }
            try { node.classList.add('active'); node.classList.add('show'); } catch (e) {}
          }
          let style = null;
          try { style = node.ownerDocument.defaultView.getComputedStyle(node); } catch (e) {}
          if (style && style.display === 'none') {
            try { node.style.display = ''; } catch (e) {}
            try { if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') node.setAttribute('aria-hidden', 'false'); } catch (e) {}
          }
          node = node.parentElement;
          depth += 1;
        }
      } catch (e) {}
    };
    const __center = (el) => {
      try { el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }); return; } catch (e) {}
      try { el.scrollIntoView(); } catch (e) {}
    };
  `
}

/**
 * 生成底层强触达脚本（Force Trigger Engine）。
 *
 * 定位（折叠目标放宽尺寸过滤）→ 祖先容器递归解封 → scrollIntoView 瞬时居中 →
 * 完整 DOM 合成事件 → jQuery 事件穿透 → href 兜底导航。 */
export function buildForceTriggerScript(record: YanhuBidNode, options: { doubleClick?: boolean } = {}): string {
  const relaxed = finderRelaxed(record)
  return `(() => {
    ${buildFinderPrelude(record, { relaxed })}
    ${buildUnsealHelpers()}
    const __fireMouse = (el, type) => {
      try {
        const r = el.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
        const cx = Math.round(r.left + r.width / 2);
        const cy = Math.round(r.top + r.height / 2);
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const Ctor = type.indexOf('pointer') === 0 ? (win.PointerEvent || win.MouseEvent) : win.MouseEvent;
        if (!Ctor) return;
        el.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, composed: true, view: win, clientX: cx, clientY: cy, button: 0 }));
      } catch (e) {}
    };
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found', syncMutations: 0, stateChanged: false };
    // 先执行解封 + 瞬时居中
    __unseal(el);
    __center(el);
    // 控件状态签名：捕获 checked / selectedIndex / value / aria-* / className
    const __stateSig = (node) => {
      try {
        const tag = (node.tagName || '').toLowerCase();
        const parts = [tag];
        if (tag === 'input' || tag === 'select' || tag === 'textarea') {
          parts.push(String(node.value != null ? node.value : ''));
          parts.push(node.checked ? '1' : '0');
          parts.push(String(node.selectedIndex != null ? node.selectedIndex : ''));
        }
        const g = (n) => (node.getAttribute ? (node.getAttribute(n) || '') : '');
        parts.push(g('aria-expanded'), g('aria-selected'), g('aria-checked'));
        parts.push(String(node.className && typeof node.className === 'string' ? node.className : ''));
        return parts.join('|');
      } catch (e) { return ''; }
    };
    const __before = __stateSig(el);
    // 同步突变监听：对顶层与全部子 frame 文档挂载 MutationObserver
    let __syncObs = [];
    try {
      const __seenDocs = [];
      const __collectObs = (doc, depth) => {
        if (!doc || depth > 6) return;
        for (let i = 0; i < __seenDocs.length; i++) { if (__seenDocs[i] === doc) return; }
        __seenDocs.push(doc);
        try {
          const target = doc.documentElement || doc.body || doc;
          if (target && typeof MutationObserver === 'function') {
            const o = new MutationObserver(function () {});
            o.observe(target, { childList: true, subtree: true, attributes: true, characterData: true });
            __syncObs.push(o);
          }
        } catch (e) {}
        let frames = [];
        try { frames = doc.querySelectorAll ? Array.from(doc.querySelectorAll('frame, iframe')) : []; } catch (e) { frames = []; }
        for (let i = 0; i < frames.length; i++) {
          try {
            const sub = frames[i].contentDocument || (frames[i].contentWindow && frames[i].contentWindow.document);
            if (sub) __collectObs(sub, depth + 1);
          } catch (e) {}
        }
      };
      __collectObs(document, 0);
    } catch (e) { __syncObs = []; }
    const __takeSyncMutations = () => {
      let count = 0;
      for (let i = 0; i < __syncObs.length; i++) {
        try {
          const recs = __syncObs[i].takeRecords();
          if (recs) count += recs.length;
          __syncObs[i].disconnect();
        } catch (e) {}
      }
      return count;
    };
    __fireMouse(el, 'pointerdown');
    __fireMouse(el, 'mousedown');
    try { if (typeof el.focus === 'function') el.focus(); } catch (e) {}
    __fireMouse(el, 'pointerup');
    __fireMouse(el, 'mouseup');
    // 单次点击语义（关键修复）：仅派发**一次** click 事件（带坐标的合成 MouseEvent 优先；
    // dispatchEvent 抛错时才回退原生 el.click()）。历史缺陷曾同时派发「合成 MouseEvent +
    // 单次点击防重派发
    let __clickDispatched = false;
    try {
      const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
      const cr = el.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
      const ccx = Math.round(cr.left + cr.width / 2);
      const ccy = Math.round(cr.top + cr.height / 2);
      el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: win, clientX: ccx, clientY: ccy, button: 0 }));
      __clickDispatched = true;
    } catch (e) {
      try { if (typeof el.click === 'function') { el.click(); __clickDispatched = true; } } catch (e2) {}
    }
    ${options.doubleClick === true
      ? `if (__clickDispatched) { __fireMouse(el, 'dblclick'); }`
      : ''}
    let navigated = false;
    try {
      const tag = (el.tagName || '').toLowerCase();
      // 仅在 click 未被派发成功时才启用 href 兜底
      if (tag === 'a' && !el.__yanhuForceTriggered && !__clickDispatched) {
        const href = el.getAttribute ? (el.getAttribute('href') || '') : '';
        const target = el.getAttribute ? (el.getAttribute('target') || '') : '';
        const inForm = el.closest ? !!el.closest('form') : false;
        if (href && !inForm && href.charAt(0) !== '#' && href.indexOf('javascript:') !== 0 && /^https?:/i.test(href)) {
          el.__yanhuForceTriggered = true;
          const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
          try {
            if (!target || target === '_self') {
              win.location.assign(href);
              navigated = true;
            } else if (target !== '_blank' && target !== '_top' && target !== '_parent') {
              // 命名框架：仅驱动目标框架导航，绝不顶掉 location.assign 撕毁外层 frameset
              const topW = win.top || win;
              const fr = topW.document.querySelector('frame[name="' + target + '"], iframe[name="' + target + '"], frame#' + target + ', iframe#' + target + '');
              const fwin = fr && (fr.contentWindow || (topW.frames && topW.frames[target]));
              if (fwin && fwin.location) { fwin.location.assign(href); navigated = true; }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
    // 单选 / 复选框级联强触发（关键修复）：合成点击虽会激活浏览器原生勾选行为，但在金智 EMAP /
    // Vue 响应式表单中，「请假性质」单选的 change 处理器常挂在 jQuery 事件委托链上，仅靠原生
    // 激活行为无法可靠拉起二级联动（事假 / 病假）。此处显式补充 input + change + jQuery change，
    // 并对同表单同名单选组一并触发
    try {
      const __cTag = (el.tagName || '').toLowerCase();
      const __cType = ((el.getAttribute && el.getAttribute('type')) || '').toLowerCase();
      const __cRole = ((el.getAttribute && el.getAttribute('role')) || '').toLowerCase();
      const __cIsInputChoice = __cTag === 'input' && (__cType === 'radio' || __cType === 'checkbox');
      if (__cIsInputChoice || __cRole === 'radio' || __cRole === 'checkbox') {
        try { if (__cIsInputChoice) el.checked = true; } catch (e) {}
        const __cWin = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        try { el.dispatchEvent(new __cWin.Event('input', { bubbles: true, cancelable: true })); } catch (e) {}
        try { el.dispatchEvent(new __cWin.Event('change', { bubbles: true, cancelable: true })); } catch (e) {}
        try {
          const __cJq = __cWin.$ || __cWin.jQuery;
          if (__cJq) {
            __cJq(el).trigger('change');
            // 同名组联动仅限最近表单作用域
            if (el.name) {
              const __cScope = el.form || (el.closest && el.closest('form')) || el.ownerDocument || document;
              __cJq(__cScope).find('input[name="' + String(el.name).replace(/"/g, '') + '"]').trigger('change');
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
    const stateChanged = __stateSig(el) !== __before;
    return { ok: true, navigated: navigated, syncMutations: __takeSyncMutations(), stateChanged: stateChanged };
  })()`
}

/**
 * 可输入控件的 `input[type]` 白名单（文本类）。
 * 勾选框 / 单选 / 提交按钮 / 文件 / 取色 / 滑块等一律不算「可填写」，由工具层直接拒绝。 */
const EDITABLE_INPUT_TYPES = [
  'text',
  'search',
  'password',
  'email',
  'tel',
  'url',
  'number',
  'date',
  'datetime-local',
  'month',
  'week',
  'time',
  '',
]

/**
 * 生成「填写目标校验」脚本（确定性守卫）。
 *
 * 在真正写入前判定该 BID 指向的元素是否真的可输入：非输入框（下拉 / 勾选框 / 按钮 / 链接）
 * 会被就地判出并带 tag/type/role 诊断，避免把文本灌进错误控件、更避免降级脚本触发 `Illegal invocation`。
 * 判定完全由代码完成，不依赖模型自觉。 */
function buildFillTargetGuardScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const tag = (el.tagName || '').toLowerCase();
    const type = ((el.getAttribute && el.getAttribute('type')) || 'text').toLowerCase();
    const role = ((el.getAttribute && el.getAttribute('role')) || '').toLowerCase();
    const editableInput = tag === 'input' && ${JSON.stringify(EDITABLE_INPUT_TYPES)}.indexOf(type) >= 0;
    const editable = editableInput || tag === 'textarea' || !!el.isContentEditable;
    // 只读判定：只读控件的值由页面自带控件（日历 / 时间选择器 / 树选择）驱动，
    // CDP 物理输入对它完全无效，工具层据此跳过注定失败的尝试。
    const readOnly = el.readOnly === true || (el.hasAttribute ? el.hasAttribute('readonly') : false);
    return { ok: true, editable: editable, readOnly: readOnly, tag: tag, type: type, role: role };
  })()`
}

/** 依据守卫诊断生成「非输入框」的结构化拒绝文案（并给出确定的替代工具） */
function buildNonEditableFillMessage(
  bid: number,
  record: YanhuBidNode,
  guard: { tag?: string; type?: string; role?: string },
): string {
  const desc = `[BID: ${bid}] ${record.role} "${record.name}"（${guard.tag || 'element'}${guard.type && guard.type !== '' ? `/${guard.type}` : ''}）`
  if (guard.tag === 'select' || guard.role === 'combobox' || guard.role === 'listbox') {
    return `填写失败：${desc} 是下拉控件而不是输入框。请改用 yanhu_select（原生 select）或用 yanhu_click 展开后点击选项。`
  }
  if (guard.type === 'checkbox' || guard.type === 'radio') {
    return `填写失败：${desc} 是勾选控件而不是输入框。请改用 yanhu_click 切换其选中状态。`
  }
  return `填写失败：${desc} 不是可输入控件。请改用 yanhu_click 点击它，或用 yanhu_read_page 重新确认目标 BID。`
}

/**
 * 生成降级回退填写脚本（CDP 坐标不可用时使用）。
 *
 * 复用采集端同一套定位器，以原生 value setter 写入并派发完整 `input` / `change` 事件链，
 * 可选派发回车键（合成键盘事件无法触发表单原生提交，仅作页面侧监听兜底）。
 *
 * 自我保护：脚本自身也做可输入校验，非输入框直接返回 `not-editable`。
 * 绝不执行 `HTMLInputElement.prototype.value` 的 setter（否则在 select 上会抛 Illegal invocation）。 */
function buildLegacyFillScript(
  record: YanhuBidNode,
  value: string,
  clearFirst: boolean,
  pressEnter: boolean,
): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    ${buildUnsealHelpers()}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const tag = (el.tagName || '').toLowerCase();
    const type = ((el.getAttribute && el.getAttribute('type')) || 'text').toLowerCase();
    const editableInput = tag === 'input' && ${JSON.stringify(EDITABLE_INPUT_TYPES)}.indexOf(type) >= 0;
    if (!(editableInput || tag === 'textarea' || !!el.isContentEditable)) {
      return { ok: false, reason: 'not-editable', tag: tag, type: type };
    }
    __unseal(el);
    __center(el);
    // ===== 第四道防线：完备合成事件链（Vue / React 响应式解耦修复）=====
    // 现代框架的 v-model / onChange 常依赖 pointer/mouse 序列与焦点态，缺任一环都可能导致
    // 框架内部状态未同步而被回滚。统一下发完备事件链：
    // PointerDown -> MouseDown -> Focus -> Value Setter -> Input -> Change -> PointerUp/MouseUp -> Blur
    const __winRef = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    const __downOpts = { bubbles: true, cancelable: true, composed: true, button: 0, buttons: 1 };
    const __upOpts = { bubbles: true, cancelable: true, composed: true, button: 0, buttons: 0 };
    try {
      const Ptr = __winRef.PointerEvent || (typeof PointerEvent !== 'undefined' ? PointerEvent : null);
      if (Ptr) el.dispatchEvent(new Ptr('pointerdown', __downOpts));
    } catch (e) {}
    try { el.dispatchEvent(new __winRef.MouseEvent('mousedown', __downOpts)); } catch (e) {}
    try { el.focus(); } catch (e) {}
    const isField = tag === 'input' || tag === 'textarea';
    const prev = isField ? String(el.value != null ? el.value : '') : String(el.textContent || '');
    // 幂等护栏：非清空模式下目标已包含该值即直接判成功，绝不重复追加
    // （防止 CDP 主路径已写入、却因回读校验误判失败而降级重写，导致文本重复）
    if (!${clearFirst ? 'true' : 'false'} && prev.indexOf(${JSON.stringify(value)}) >= 0) {
      return { ok: true, value: prev, skipped: true };
    }
    const next = ${clearFirst ? 'true' : 'false'} ? ${JSON.stringify(value)} : prev + ${JSON.stringify(value)};
    if (isField) {
      const proto = tag === 'textarea' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) desc.set.call(el, next); else el.value = next;
    } else {
      // 富文本编辑器（contenteditable）协议
      let inserted = false;
      try {
        const rdoc = el.ownerDocument || document;
        const rsel = rdoc.getSelection ? rdoc.getSelection() : null;
        if (${clearFirst ? 'true' : 'false'}) {
          try {
            const all = rdoc.createRange();
            all.selectNodeContents(el);
            if (rsel) { rsel.removeAllRanges(); rsel.addRange(all); }
            rdoc.execCommand('delete', false, null);
          } catch (e) {}
        }
        try {
          const caret = rdoc.createRange();
          caret.selectNodeContents(el);
          caret.collapse(false);
          if (rsel) { rsel.removeAllRanges(); rsel.addRange(caret); }
        } catch (e) {}
        inserted = rdoc.execCommand ? rdoc.execCommand('insertText', false, ${JSON.stringify(value)}) : false;
      } catch (e) { inserted = false; }
      if (!inserted) {
        // 兜底：以 Range 原位插入文本节点，同样绝不整体覆写子节点
        try {
          const rdoc = el.ownerDocument || document;
          const rng = rdoc.createRange();
          rng.selectNodeContents(el);
          if (${clearFirst ? 'true' : 'false'}) rng.deleteContents(); else rng.collapse(false);
          const tn = rdoc.createTextNode(${JSON.stringify(value)});
          rng.insertNode(tn);
          rng.setStartAfter(tn);
          rng.collapse(true);
          const rsel = rdoc.getSelection ? rdoc.getSelection() : null;
          if (rsel) { rsel.removeAllRanges(); rsel.addRange(rng); }
        } catch (e) {}
      }
    }
    // 表单事件单发语义：原生 input / change 各派发一次即可（jQuery .on 绑定的是原生监听器，
    // 表单事件单发语义
    let __evtDispatched = false;
    try {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      __evtDispatched = true;
    } catch (e) {}
    if (!__evtDispatched) {
      try {
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const jq = win.$ || win.jQuery;
        if (jq) { jq(el).trigger('input'); jq(el).trigger('change'); }
      } catch (e) {}
    }
    ${pressEnter
      ? `const ke = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true };
    el.dispatchEvent(new KeyboardEvent('keydown', ke));
    el.dispatchEvent(new KeyboardEvent('keypress', ke));
    el.dispatchEvent(new KeyboardEvent('keyup', ke));`
      : ''}
    // 事件链收尾：PointerUp -> MouseUp -> Blur，与前置 PointerDown/MouseDown 形成闭环
    try {
      const Ptr = __winRef.PointerEvent || (typeof PointerEvent !== 'undefined' ? PointerEvent : null);
      if (Ptr) el.dispatchEvent(new Ptr('pointerup', __upOpts));
    } catch (e) {}
    try { el.dispatchEvent(new __winRef.MouseEvent('mouseup', __upOpts)); } catch (e) {}
    try { if (typeof el.blur === 'function') el.blur(); } catch (e) {}
    return { ok: true, tag: tag, type: type };
  })()`
}

/**
 * 生成输入框写入校验脚本：复用同一定位器回读目标控件当前值。
 *
 * 用于甄别 CDP 硬件文本流是否真正落入目标输入框——若定位到别处，焦点会落到其他元素，
 * `Input.insertText` 将写入错误位置，工具却会误报成功（静默错填）。校验失败即降级回退。 */
function buildFillVerificationScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const cur = el.isContentEditable ? (el.textContent || '') : (el.value != null ? String(el.value) : '');
    return { ok: true, value: cur };
  })()`
}

/**
 * 生成「原生 select 选择」脚本。
 *
 * 返回 `isNativeSelect` 诊断字段：非原生 `<select>` 一律不再误报「选项不存在」，
 * 而是把控制权交给工具层的确定性降级路径（展开自定义下拉 → 精确点选）。
 * 原生下拉匹配失败时一并回传 **真实可用选项文本**，供代码直接给出确定答案，杜绝模型盲试。 */
function buildNativeSelectScript(record: YanhuBidNode, target: string): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    ${buildUnsealHelpers()}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    __unseal(el);
    __center(el);
    const tag = (el.tagName || '').toLowerCase();
    const isNative = tag === 'select' && !!el.options && typeof el.selectedIndex === 'number';
    if (!isNative) {
      return {
        ok: false,
        isNativeSelect: false,
        reason: 'not-native-select',
        tag: tag,
        role: ((el.getAttribute && el.getAttribute('role')) || '').toLowerCase(),
      };
    }
    try { el.focus(); } catch (e) {}
    const target = ${JSON.stringify(target)};
    const opts = Array.from(el.options || []);
    const opt = opts.find(function (o) { return o.value === target || (o.textContent || '').trim() === target; });
    if (!opt) {
      return {
        ok: false,
        isNativeSelect: true,
        reason: 'option-not-found',
        tag: tag,
        options: opts.map(function (o) { return (o.textContent || '').trim(); })
          .filter(function (t) { return !!t; })
          .slice(0, 30),
      };
    }
    // 同步原生选中态：显式设置 opt.selected 与 selectedIndex，避免依赖属性判断的老旧 JSP 脚本读到旧值
    el.value = opt.value;
    opt.selected = true;
    try { el.selectedIndex = opt.index; } catch (e) {}
    let evtOk = false;
    try {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      evtOk = true;
    } catch (e) {}
    if (!evtOk) {
      try {
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const jq = win.$ || win.jQuery;
        if (jq) { jq(el).trigger('change'); }
      } catch (e) {}
    }
    try { if (typeof el.blur === 'function') el.blur(); } catch (e) {}
    return { ok: true, isNativeSelect: true, value: opt.value };
  })()`
}

/**
 * 生成「JQWidgets DropDownList 专属 API 极速点选」脚本。
 *
 * 针对金智 EMAP / 成理学工请假表单深度优化。
 * 当目标为 JQWidgets 下拉（class 包含 jqx-dropdownlist 或存在 $.fn.jqxDropDownList）时，
 * 直接通过 getItems() 遍历权威选项列表，命中目标文本（如「事假」）后调用 selectIndex()，
 * 随后同步控件内部的 <input type="hidden"> 并派发 change 事件。
 *
 * 优势：零等待、免展开动画延迟、完全绕开浮层定位与视口裁剪问题，耗时 < 2ms、100% 确定性。 */
export function buildJqxSelectScript(record: YanhuBidNode, target: string): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    const jq = win.$ || win.jQuery;
    if (!jq) return { ok: false, reason: 'no-jquery' };
    const target = ${JSON.stringify(target)};
    const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    try {
      const $el = jq(el);
      if (typeof $el.jqxDropDownList === 'function') {
        const items = $el.jqxDropDownList('getItems');
        if (Array.isArray(items) && items.length > 0) {
          let match = items.find(function (it) {
            const l = norm(it.label || it.html || it.text);
            const v = norm(it.value);
            return l === target || v === target;
          });
          if (!match) {
            match = items.find(function (it) {
              const l = norm(it.label || it.html || it.text);
              return l && (l.indexOf(target) >= 0 || target.indexOf(l) >= 0);
            });
          }
          if (match && typeof match.index === 'number') {
            $el.jqxDropDownList('selectIndex', match.index);
            $el.trigger('change');
            $el.trigger('select');
            // 同步表单真实接收提交值的隐藏 input，并触发原生与 jQuery 变更
            try {
              const hidden = el.querySelector('input[type="hidden"]');
              if (hidden && match.value != null) {
                hidden.value = match.value;
                hidden.dispatchEvent(new Event('input', { bubbles: true }));
                hidden.dispatchEvent(new Event('change', { bubbles: true }));
              }
            } catch (e) {}
            return {
              ok: true,
              via: 'jqx-api',
              text: norm(match.label || match.html || match.text) || target,
              value: match.value,
            };
          }
        }
      }
    } catch (e) {}
    return { ok: false, reason: 'not-jqx-or-unmatched' };
  })()`
}



/**
 * 生成「EMAP / JQWidgets 树形 / 级联选择器专属 API 极速点选」脚本（阶梯 2.5）。
 *
 * 「出校去向」这类控件是 `jqxDropDownButton` + `jqxTree`（或 EMAP `emapDropdownTree`）组合，
 * 不是单级 `jqxDropDownList`，因此 `buildJqxSelectScript` 覆盖不到，只能退化为脆弱的 DOM 点选：
 *   - 树节点是事件委托型 plain div，模拟点击经常被控件忽略；
 *   - 即使点中也不同步隐藏域与 EMAP 表单模型，校验依旧报「不能为空」。
 * 本通道直接走控件原生 API（getItems -> selectItem -> setContent -> close），
 * 并把值同步回 `input[type=hidden]` 与 emapForm 模型，毫秒级、确定性完成。
 */
export function buildEmapTreeSelectScript(record: YanhuBidNode, target: string): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    const jq = win.$ || win.jQuery;
    if (!jq) return { ok: false, reason: 'no-jquery' };
    const target = ${JSON.stringify(target)};
    const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    try {
      const $el = jq(el);
      // 1. 定位树控件宿主：自身 / 内部 / aria-owns 指向的浮层面板 / 页面上唯一可见的树
      //
      // 实测结构（金智 EMAP 学生请假表单「出校去向」）：
      //   <div xtype="tree" role="button" aria-owns="dropDownButtonPopupcontent_485920" id="content_485920">
      //   <div class="... jqx-dropdownbutton-popup ..." id="dropDownButtonPopupcontent_485920">
      //     <div class="dropdown-tree" id="tree_485920"></div>
      // 因此树容器既可能在 aria-owns 指向的面板内，也可能自带 .dropdown-tree / #tree_ 特征。
      let $tree = jq();
      let $dropdown = jq();
      if ($el.hasClass('jqx-tree') || $el.hasClass('jqx-tree-dropdown')) $tree = $el;
      if ($el.hasClass('jqx-dropdownbutton')) $dropdown = $el;
      if (!$dropdown.length) {
        $dropdown = $el.closest('.jqx-dropdownbutton');
        if (!$dropdown.length) $dropdown = $el.find('.jqx-dropdownbutton');
      }
      if (!$tree.length) {
        const $owner = $el.closest('[aria-owns]');
        const ownsId =
          ($owner.length ? $owner.attr('aria-owns') : '') ||
          ($el.attr ? ($el.attr('aria-owns') || '') : '') ||
          ($dropdown.length ? $dropdown.attr('aria-owns') : '');
        const candidates = [];
        if (ownsId) {
          const $panel = jq('#' + ownsId);
          candidates.push($panel.find('.jqx-tree'));
          candidates.push($panel.find('[class*="dropdown-tree"]'));
          candidates.push($panel.find('[id^="tree_"]'));
        }
        candidates.push($el.find('.jqx-tree'));
        candidates.push($el.find('[class*="dropdown-tree"]'));
        candidates.push($el.find('[id^="tree_"]'));
        candidates.push($el.siblings('.jqx-tree, [class*="dropdown-tree"], [id^="tree_"]'));
        candidates.push(jq('.jqx-tree:visible'));
        candidates.push(jq('[class*="dropdown-tree"]:visible'));
        candidates.push(jq('.jqx-tree'));
        for (let ci = 0; ci < candidates.length; ci++) {
          const $cand = candidates[ci];
          if ($cand && $cand.length > 0 && typeof $cand.jqxTree === 'function') { $tree = $cand; break; }
        }
      }
      if (!$tree.length) return { ok: false, reason: 'tree-not-found' };

      // 2. jqxTree 原生 API：遍历 getItems 精确匹配后 selectItem
      if ($tree && $tree.length && typeof $tree.jqxTree === 'function') {
        const items = $tree.jqxTree('getItems');
        if (Array.isArray(items) && items.length > 0) {
          const labelOf = (it) => norm(it.label || it.title || it.html || it.text);
          let match = null;
          for (let i = 0; i < items.length; i++) {
            const it = items[i];
            if (labelOf(it) === target || norm(it.value || it.id) === target) { match = it; break; }
          }
          if (!match) {
            for (let i = 0; i < items.length; i++) {
              const l = labelOf(items[i]);
              if (l && (l.indexOf(target) >= 0 || target.indexOf(l) >= 0)) { match = items[i]; break; }
            }
          }
          if (match) {
            try { $tree.jqxTree('selectItem', match.element); } catch (e) {}
            try { $tree.trigger('select', { item: match, element: match.element }); } catch (e) {}
            try { $tree.trigger('itemClick', { item: match, element: match.element }); } catch (e) {}
            const labelText = labelOf(match) || target;
            const rawValue = match.value != null ? match.value : (match.id != null ? match.id : labelText);
            // 更新下拉按钮的显示内容并收起弹层
            if ($dropdown && $dropdown.length && typeof $dropdown.jqxDropDownButton === 'function') {
              try { $dropdown.jqxDropDownButton('setContent', labelText); } catch (e) {}
              try { $dropdown.jqxDropDownButton('close'); } catch (e) {}
            }
            // 同步表单真实接收提交值的隐藏域（EMAP 以隐藏域承载实际提交数据）
            try {
              const scope = $el.closest('[data-name], .bh-form-group, [emap-role="input-wrap"]');
              const root = scope && scope.length ? scope : ($el.parent().length ? $el.parent() : $el);
              const name = $el.attr('data-name') || scope.attr('data-name') || '';
              let $hidden = name ? root.find('input[type="hidden"][name="' + name + '"]') : jq();
              if (!$hidden.length) $hidden = root.find('input[type="hidden"]');
              $hidden.each(function () {
                this.value = rawValue;
                try { this.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
                try { this.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
                try { jq(this).trigger('change'); } catch (e) {}
              });
            } catch (e) {}
            // 同步 EMAP 表单模型（校验与提交读取的是它，不是 DOM）
            try {
              const $form = $el.closest('[emap-role="form"]');
              const dataName = $el.attr('data-name') || ($el.closest('[data-name]').attr('data-name') || '');
              if ($form.length && typeof $form.emapForm === 'function' && dataName) {
                const payload = {};
                payload[dataName] = rawValue;
                $form.emapForm('setValue', payload);
              }
            } catch (e) {}
            return { ok: true, via: 'emap-tree-api', text: labelText, value: rawValue };
          }
          return { ok: false, reason: 'tree-item-unmatched' };
        }
      }
    } catch (e) {}
    return { ok: false, reason: 'not-tree-or-unmatched' };
  })()`
}

/**
 * 生成「树形选项点击后的收口」脚本。
 *
 * 点击树节点只完成「选中视觉」，控件本身仍需要一次收口动作才会真正生效：
 * 触发 select / itemClick、更新下拉按钮显示内容、收起弹层、同步隐藏域与 emapForm 模型。
 * 缺少这一步时，点得再准也会被表单校验判成「未填写」（历史事故的最后一环）。
 */
export function buildTreeItemCommitScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    const jq = win.$ || win.jQuery;
    if (!jq) return { ok: false, reason: 'no-jquery' };
    const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    try {
      const $el = jq(el);
      const labelText = norm(el.textContent).slice(0, 60);
      // 1. 向上找到树容器（含 body 下的 portal 弹层）
      let $tree = $el.closest('.jqx-tree');
      if (!$tree.length) $tree = $el.closest('.jqx-tree-dropdown');
      if (!$tree.length) {
        let $visible = jq('.jqx-tree:visible');
        if (!$visible.length) $visible = jq('.jqx-tree');
        if ($visible.length === 1) $tree = $visible;
      }
      const $item = $el.closest('li, .jqx-tree-item, [role="treeitem"], .bh-tree-node');
      // 只有**确实触达了树 / 下拉控件**才算收口成功。
      // 否则会给原生 <option> 等无关元素也贴上「已触发树形控件收口」，把模型误导成
      // 「这个 option 是树节点」（历史事故：模型据此认定 BID 18 是树控件并绕了十几轮）。
      let didSomething = false;
      if ($tree.length && typeof $tree.jqxTree === 'function' && $item.length) {
        try { $tree.jqxTree('selectItem', $item[0]); } catch (e) {}
        try { $tree.trigger('select', { element: $item[0] }); } catch (e) {}
        try { $tree.trigger('itemClick', { element: $item[0] }); } catch (e) {}
        didSomething = true;
      }
      // 2. 收口下拉按钮并同步表单值
      let closed = false;
      let $dropdown = $tree.length ? $tree.closest('.jqx-dropdownbutton') : jq();
      if (!$dropdown.length) $dropdown = jq('.jqx-dropdownbutton:visible').first();
      if ($dropdown.length && typeof $dropdown.jqxDropDownButton === 'function') {
        if (labelText) { try { $dropdown.jqxDropDownButton('setContent', labelText); } catch (e) {} }
        try { $dropdown.jqxDropDownButton('close'); closed = true; } catch (e) {}
        didSomething = true;
      }
      try {
        const scope = $dropdown.length ? $dropdown : $el;
        const name = scope.attr('data-name') || $el.closest('[data-name]').attr('data-name') || '';
        let $hidden = name ? scope.find('input[type="hidden"][name="' + name + '"]') : jq();
        if (!$hidden.length) $hidden = scope.find('input[type="hidden"]');
        if ($hidden.length > 0) didSomething = true;
        $hidden.each(function () {
          if (labelText) this.value = labelText;
          try { this.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
          try { this.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        });
      } catch (e) {}
      try {
        const $form = $el.closest('[emap-role="form"]');
        const dataName = $el.closest('[data-name]').attr('data-name') || '';
        if ($form.length && typeof $form.emapForm === 'function' && dataName) {
          const payload = {};
          payload[dataName] = labelText;
          $form.emapForm('setValue', payload);
          didSomething = true;
        }
      } catch (e) {}
      if (!didSomething) return { ok: false, reason: 'not-tree-item' };
      return { ok: true, via: 'tree-commit', closed: closed };
    } catch (e) {}
    return { ok: false, reason: 'commit-failed' };
  })()`
}

/**
 * 生成「展开自定义下拉」脚本。
 *
 * 派发**完整鼠标事件序列**（pointerdown + mousedown + pointerup + mouseup + click）；当目标节点是
 * 容器（如 `.bh-pull-down`）时，改为向内渗透点击真正的触发器（输入框 / 下拉箭头 / 图标），
 * 并在面板仍未展开时自适应回落到容器本体与 jQuery `trigger('click')`。
 *
 * 自适应性保障「既不漏开、也不开-关-开抖动」：仅在判定面板确实未展开时才追加兜底点击。 */
export function buildOpenDropdownScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    ${buildUnsealHelpers()}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    __unseal(el);
    __center(el);
    try { el.focus(); } catch (e) {}

    const __docs = () => {
      const list = [document];
      try {
        const frames = Array.from(document.querySelectorAll('frame, iframe'));
        for (let i = 0; i < frames.length; i++) {
          try {
            const d = frames[i].contentDocument || (frames[i].contentWindow && frames[i].contentWindow.document);
            if (d) list.push(d);
          } catch (e) {}
        }
      } catch (e) {}
      return list;
    };
    // 浮层是否已真实展开：覆盖通用框架与 JQWidgets / aria-owns 显式所有权绑定。
    // 关键：现场浮层外壳以 listBox... / innerListBox... 命名，容器自身无 role="listbox"（仅选项有 role="option"），
    // 优先依据 Combobox 的 aria-owns 定位浮层
    const __panelOpen = () => {
      const ariaOwns = el.getAttribute ? (el.getAttribute('aria-owns') || '') : '';
      const docs = __docs();
      if (ariaOwns) {
        for (let di = 0; di < docs.length; di++) {
          try {
            const owned = docs[di].getElementById(ariaOwns);
            if (owned) {
              const st = (owned.ownerDocument.defaultView || window).getComputedStyle(owned);
              if (st && st.display !== 'none' && st.visibility !== 'hidden' && parseFloat(st.opacity || '1') > 0) {
                const r = owned.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) return true;
              }
            }
          } catch (e) {}
        }
      }
      const popupSels = ['.bh-pull-down-list', '.bh-select-dropdown', '.bh-dropdown-menu', '[class*="dropdown"]', '[class*="popper"]', '[class*="popover"]', '[class*="picker"]', '[role="listbox"]', '[id*="innerListBox"]', '[id*="listBoxContent"]', '.jqx-listbox', '.jqx-dropdownlist-popup'];
      for (let di = 0; di < docs.length; di++) {
        for (let si = 0; si < popupSels.length; si++) {
          let list = [];
          try { list = Array.from(docs[di].querySelectorAll(popupSels[si])); } catch (e) { list = []; }
          for (let i = 0; i < list.length; i++) {
            const n = list[i];
            let st = null;
            try { st = (n.ownerDocument.defaultView || window).getComputedStyle(n); } catch (e) {}
            if (st && (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') <= 0)) continue;
            let r = { width: 0, height: 0 };
            try { r = n.getBoundingClientRect(); } catch (e) {}
            if (r.width > 0 && r.height > 0) return true;
          }
        }
      }
      return false;
    };
    const __fireAll = (target) => {
      try {
        const win = (target.ownerDocument && target.ownerDocument.defaultView) || window;
        const r = target.getBoundingClientRect ? target.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
        const opts = { bubbles: true, cancelable: true, composed: true, view: win, clientX: Math.round(r.left + r.width / 2), clientY: Math.round(r.top + r.height / 2), button: 0 };
        const Ptr = win.PointerEvent || win.MouseEvent;
        if (Ptr) target.dispatchEvent(new Ptr('pointerdown', opts));
        target.dispatchEvent(new win.MouseEvent('mousedown', opts));
        if (Ptr) target.dispatchEvent(new Ptr('pointerup', opts));
        target.dispatchEvent(new win.MouseEvent('mouseup', opts));
        target.dispatchEvent(new win.MouseEvent('click', opts));
        return true;
      } catch (e) { return false; }
    };
    // 语义判定真实触发器
    const __isTriggerLike = (n) => {
      const tag = (n.tagName || '').toLowerCase();
      const role = ((n.getAttribute && n.getAttribute('role')) || '').toLowerCase();
      return tag === 'input' || tag === 'select' || tag === 'button' || tag === 'a' ||
        role === 'combobox' || role === 'button' || n.isContentEditable === true;
    };
    let primary = __isTriggerLike(el) ? el : null;
    if (!primary && el.querySelector) {
      primary = el.querySelector('input:not([type="hidden"]), select, [role="combobox"], [class*="arrow"], [class*="caret"], [class*="icon"], [class*="trigger"]');
    }
    if (!primary) primary = el;

    // 复合 combobox（如 JQWidgets）优先向内渗透至最贴近监听器的箭头 / 包装器：
    // JQWidgets 的展开监听挂在 #dropdownlistWrapper 与 #dropdownlistArrow 内部节点上，
    // 内部箭头/图标检索
    let innerArrow = null;
    if (el.querySelector) {
      innerArrow = el.querySelector('[id*="dropdownlistArrow"], [class*="icon-arrow"], [class*="arrow"], [class*="caret"], [id*="dropdownlistWrapper"]');
    }

    // 派发顺序：命中内部箭头时优先派发它，避免箭头 + 宿主双重派发造成开-关-开抖动
    if (innerArrow) {
      __fireAll(innerArrow);
      if (!__panelOpen() && primary !== innerArrow) __fireAll(primary);
    } else {
      __fireAll(primary);
      if (primary !== el && !__panelOpen()) __fireAll(el);
    }

    // jQuery / JQWidgets 权威 API 穿透：仅在原生派发均未展开时才启用，避免重复 click 造成开-关-开抖动
    if (!__panelOpen()) {
      try {
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const jq = win.$ || win.jQuery;
        if (jq) {
          const $el = jq(el);
          if (typeof $el.jqxDropDownList === 'function') $el.jqxDropDownList('open');
          jq(primary).trigger('click');
          if (innerArrow) jq(innerArrow).trigger('mousedown').trigger('mouseup').trigger('click');
          if (primary !== el && !__panelOpen()) jq(el).trigger('click');
        }
      } catch (e) {}
    }
    return { ok: true, opened: __panelOpen() };
  })()`
}

/**
 * 自定义下拉选项的确定性候选选择器（精确覆盖主流组件库）。
 *
 * 刻意只覆盖「选项 / 面板」语义的节点，避免大范围扫描后误点页面其他区域。
 * 关键：不再把选项限定为 `li`——金智 EMAP / BH-UI / JQWidgets 的选项大量使用 `div`
 * （如 `div.jqx-listitem-element`、`div.bh-pull-down-item`），历史缺陷正是因 `* li` 限定而直接漏判。 */
export const CUSTOM_OPTION_SELECTORS = [
  '[role="option"]',
  '[role="menuitem"]',
  '[role="treeitem"]',
  // 金智轻应用 (EMAP / BH-UI / JQWidgets) 专属下拉结构
  '.bh-pull-down-list li',
  '.bh-pull-down-list div',
  '.bh-pull-down-item',
  '.jqx-listitem-element',
  '.jqx-listitem-state-normal',
  '.jqx-item',
  'div[id*="innerListBox"] [role="option"]',
  'div[id*="innerListBox"] .jqx-listitem-element',
  'div[id*="listBoxContent"] div',
  'div[id*="innerListBox"] div',
  '.bh-dropdown-menu li',
  '.bh-dropdown-menu div',
  '.bh-select-dropdown li',
  '.bh-select-dropdown div',
  '.bh-select-dropdown [class*="item"]',
  '.bh-picker-item',
  // 通用框架类目
  '[class*="pull-down"] li',
  '[class*="pull-down"] div',
  '[class*="pull-down"] [class*="item"]',
  '[class*="dropdown-item"]',
  '[class*="dropdown"] li',
  '[class*="dropdown"] div',
  '.el-select-dropdown__item',
  '.ant-select-item-option',
  '.van-picker-column__item',
  '.van-picker__option',
  '.ivu-select-item',
  '.arco-select-option',
  '[class*="popper"] li',
  '[class*="popper"] div',
  '[class*="popper"] [class*="item"]',
  '[class*="options"] li',
  '[class*="options"] div',
]

/**
 * 浮动面板根节点选择器。
 *
 * 采用采集端导出的**单一真源**（{@link YANHU_POPUP_SELECTORS}）：面板内点选选项与采集端
 * 「浮层内叶子选项纳管」必须用同一份清单，否则两端判定漂移。 */
const CUSTOM_POPUP_SELECTORS = YANHU_POPUP_SELECTORS

/**
 * 生成「读取目标控件当前显示文本」脚本（供下拉 / 树选择等控件的**选中后校验**使用）。
 *
 * 复用与采集端完全相同的定位器与显示文本口径（自身直接文本 → 首个叶子后代 → value），
 * 因此「工具看到的显示值」与「台账里的 value」永远一致。
 */
function buildRecordDisplayTextScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false };
    const own = __yanhuOwnText(el);
    const text = own || __yanhuFirstLeafText(el, 40) || (el.value != null ? String(el.value) : '');
    return { ok: true, text: (text || '').replace(/\\s+/g, ' ').trim().slice(0, 60) };
  })()`
}

/**
 * 目标控件的显示文本是否已经反映本次选中。
 *
 * 判定口径（宽进）：
 *   1. 显示文本里已包含被点选的选项文本 → 生效（含「本来就已选中」的幂等重选）；
 *   2. 否则只要显示文本发生了变化 → 视为生效（部分控件显示的是编码而非文本）；
 *   3. 两者都不满足 → **未生效**，必须如实报错，绝不能谎报成功。
 */
function isSelectionApplied(before: string | null, after: string | null, pickedText: string): boolean {
  if (before === null || after === null) return true // 状态不可读时不误判
  const target = pickedText.replace(/\s+/g, ' ').trim()
  if (target && after.includes(target)) return true
  return after !== before
}

/**
 * 生成「目标控件子树结构摘要」脚本（选中失败时的自诊断证据）。
 *
 * 树形 / 级联选择器往往把真正可点的节点藏在内层（如 a.node_name），而台账只能给出外层容器。
 * 失败时回传一层压缩的 DOM 结构（标签 / 类 / id / role / 自身文本 / 视口矩形 / 是否带 onclick），
 * 供模型换目标重试，也让日志自带可复现的证据。
 */
function buildSubtreeDigestScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const el = __find();
    if (!el) return { ok: false };
    const lines = [];
    const walk = (node, depth, prefix) => {
      if (!node || depth > 3 || lines.length >= 20) return;
      const tag = (node.tagName || '').toLowerCase();
      let cls = '';
      if (node.className && typeof node.className === 'string') {
        const parts = node.className.trim().split(/\\s+/).slice(0, 2);
        cls = parts.length > 0 && parts[0] ? '.' + parts.join('.') : '';
      }
      const id = node.id ? '#' + node.id : '';
      const roleAttr = node.getAttribute ? (node.getAttribute('role') || '') : '';
      const role = roleAttr ? '[role=' + roleAttr + ']' : '';
      let extra = '';
      try {
        const r = node.getBoundingClientRect();
        if (r && r.width > 0) {
          extra += ' (' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + ')';
        }
      } catch (e) {}
      if (node.onclick) extra += ' [onclick]';
      if (node.isContentEditable) extra += ' [editable]';
      const own = __yanhuOwnText(node);
      const label = own ? ' "' + own.slice(0, 24) + '"' : '';
      lines.push(prefix + tag + id + cls + role + label + extra);
      const kids = node.children || [];
      for (let i = 0; i < kids.length && lines.length < 20; i++) walk(kids[i], depth + 1, prefix + '  ');
    };
    walk(el, 0, '');
    return { ok: true, digest: lines.join('\\n').slice(0, 1200) };
  })()`
}

/** 读取目标控件的子树结构摘要（诊断用，失败路径才会调用） */
async function readSubtreeDigest(tabId: string, record: YanhuBidNode): Promise<string> {
  try {
    const state = (await yanhuExpressManager.evalInPage(tabId, buildSubtreeDigestScript(record))) as
      | { ok?: boolean; digest?: string }
      | null
    if (!state || state.ok !== true) return ''
    return state.digest ?? ''
  } catch {
    return ''
  }
}

/** 读取目标控件当前显示文本（不可读时返回 null，调用方跳过校验而绝不误判） */
async function readSelectionState(tabId: string, record: YanhuBidNode): Promise<string | null> {
  try {
    const state = (await yanhuExpressManager.evalInPage(tabId, buildRecordDisplayTextScript(record))) as
      | { ok?: boolean; text?: string }
      | null
    if (!state || state.ok !== true) return null
    return state.text ?? ''
  } catch {
    return null
  }
}

/**
 * 生成「在已展开面板中点选选项」脚本（异步轮询探针）。
 *
 * 在候选集中按文本精确匹配（次选包含匹配，取最短文本以排除容器聚合项），命中即**单次点击**。
 * 匹配失败返回 `option-not-found`，由工具层给出确定引导，绝不盲点无关区域。
 *
 * 关键设计：
 * 1. 候选扫描**递归穿透全部子 frame / iframe**（复用采集端同构的三级鲁棒穿透思路），
 *    使嵌套在业务 iframe（如金智 EMAP 轻应用）内的下拉面板同样可被精确定位点击。
 * 2. **异步轮询探针**：浮层展开动画（opacity / slideDown）与 XHR 选项回填常存在 100~300ms 时序差，
 *    同步瞬时查找会直接误判「选项不存在」。此处以 50ms 间隔轮询、最长等待 800ms，自适应等待渲染完成。 */
export function buildPickCustomOptionScript(target: string): string {
  return `(() => {
    return new Promise((resolve) => {
      const target = ${JSON.stringify(target)};
      const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
      const selectors = ${JSON.stringify(CUSTOM_OPTION_SELECTORS)};
      const popupSelectors = ${JSON.stringify(CUSTOM_POPUP_SELECTORS)};
      const POLL_MS = 50;
      const TIMEOUT_MS = 800;
      const start = Date.now();
      const seen = [];
      const exact = [];
      const loose = [];
      // 已渲染（可见）的候选文本清单：匹配失败时回传给模型，避免其在看不到浮层的情况下
      // 靠猜选项名反复空转（历史故障：模型连试「武侯区 / 锦江区 / 青羊区」多轮均失败）。
      const available = [];

      const isVisible = (el) => {
        try {
          const st = (el.ownerDocument.defaultView || window).getComputedStyle(el);
          if (st && (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') <= 0)) return false;
        } catch (e) {}
        try {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        } catch (e) { return false; }
      };
      const isAriaOption = (el) => {
        // 注意：必须写成三元回退。写成 el.getAttribute && el.getAttribute(...) 时，
        // 在缺少该方法的宿主上会得到 undefined，随后 .toLowerCase() 直接抛错（测试桩上已真实踩到）。
        const role = (el.getAttribute ? (el.getAttribute('role') || '') : '').toLowerCase();
        return role === 'option' || role === 'menuitem' || role === 'treeitem';
      };
      /** 是否「聚合容器」：文本由所有子节点拼接而成，绝不是可点选项 */
      const isAggregateContainer = (el) =>
        !isAriaOption(el) && !!(el.children && el.children.length > 0);
      const consider = (el) => {
        if (!el || seen.indexOf(el) >= 0) return;
        seen.push(el);
        if (!isVisible(el)) return;
        const text = norm(el.textContent);
        if (!text) return;
        const aggregate = isAggregateContainer(el);
        // 回传清单只收叶子 / ARIA 选项：避免把「请选择... 香港特别行政区」这类聚合名当作可选项展示
        if (!aggregate && available.indexOf(text) < 0 && available.length < 40) available.push(text);
        if (text === target) exact.push({ el: el, len: text.length });
        // 子串匹配必须排除聚合容器（历史事故 / 虚假成功）：
        // 「请选择... 香港特别行政区」这种容器的文本包含目标，曾被当作选项点中，
        // 工具回报「已选择 -> 香港特别行政区」而控件毫无变化——用户只能人工发现「你似乎没点中」。
        else if (!aggregate && text.indexOf(target) >= 0) loose.push({ el: el, len: text.length });
      };
      // 语义明确的「真选项」（ARIA 授权声明）：不受渲染位置影响，绝不会与页面杂项混淆
      const ARIA_OPTION_SELECTORS = ['[role="option"]', '[role="menuitem"]', '[role="treeitem"]'];
      /** 在给定根节点内扫描选项（类名选择器 + 叶子文本兜底，覆盖树形 / 级联列等自定义结构） */
      const scanWithin = (root) => {
        for (let i = 0; i < selectors.length; i++) {
          let list = [];
          try { list = Array.from(root.querySelectorAll(selectors[i])); } catch (e) { list = []; }
          for (let j = 0; j < list.length; j++) consider(list[j]);
        }
        let leaves = [];
        try { leaves = Array.from(root.querySelectorAll('*')); } catch (e) { leaves = []; }
        for (let li = 0; li < leaves.length; li++) {
          const leaf = leaves[li];
          if (leaf.children && leaf.children.length > 0) continue;
          consider(leaf);
        }
      };
      const collect = (doc, depth) => {
        if (!doc || depth > 6) return;
        // ===== 选项必须来自「已展开的浮层」=====
        // 历史缺陷：曾在**全文档**范围按类名扫候选（.jqx-item / [class*=dropdown] div 等过于泛化），
        // 浮层未真正打开时会把页面上的无关元素当成选项回传——回执里出现过
        // 「已渲染的可用选项（共 4 项）：没有数据 / 事假 / 10 / 请选择...」这种彻底误导的结果，
        // 模型据此又乱选一轮。现改为：有可见浮层就**只在浮层内**找；浮层内一无所获时，
        // 才退回「ARIA 语义选项」的全文档扫描（语义明确，不会误收页面杂项）；
        // 两者皆无 → 回传 0 选项，由工具层引导「先点击展开」，绝不再撒谎。
        let popups = [];
        try { popups = Array.from(doc.querySelectorAll(popupSelectors.join(','))); } catch (e) { popups = []; }
        for (let pi = 0; pi < popups.length; pi++) {
          if (isVisible(popups[pi])) scanWithin(popups[pi]);
        }
        if (available.length === 0) {
          for (let i = 0; i < ARIA_OPTION_SELECTORS.length; i++) {
            let list = [];
            try { list = Array.from(doc.querySelectorAll(ARIA_OPTION_SELECTORS[i])); } catch (e) { list = []; }
            for (let j = 0; j < list.length; j++) consider(list[j]);
          }
        }
        let frames = [];
        try { frames = doc.querySelectorAll ? Array.from(doc.querySelectorAll('frame, iframe')) : []; } catch (e) { frames = []; }
        for (let i = 0; i < frames.length; i++) {
          try {
            const f = frames[i];
            const sub = f.contentDocument || (f.contentWindow && f.contentWindow.document);
            if (sub) collect(sub, depth + 1);
          } catch (e) {}
        }
      };
      const clickOption = (pick) => {
        let cx = 0, cy = 0;
        try {
          const rect = pick.getBoundingClientRect();
          cx = Math.round(rect.left + rect.width / 2);
          cy = Math.round(rect.top + rect.height / 2);
        } catch (e) {}
        try {
          const win = (pick.ownerDocument && pick.ownerDocument.defaultView) || window;
          const opts = { bubbles: true, cancelable: true, composed: true, view: win, clientX: cx, clientY: cy, button: 0 };
          const Ptr = win.PointerEvent || win.MouseEvent;
          if (Ptr) pick.dispatchEvent(new Ptr('pointerdown', opts));
          pick.dispatchEvent(new win.MouseEvent('mousedown', opts));
          if (Ptr) pick.dispatchEvent(new Ptr('pointerup', opts));
          pick.dispatchEvent(new win.MouseEvent('mouseup', opts));
          // 单次点击语义：仅派发一次 click（含副作用的组件不会被重复触发两次以上）
          pick.dispatchEvent(new win.MouseEvent('click', opts));
        } catch (e) {
          try { if (typeof pick.click === 'function') pick.click(); } catch (e2) {}
        }
        // 回传被点选项的视口中心：若控件拒绝合成事件，主进程据此升级为 CDP 硬件级真实点击
        return { text: norm(pick.textContent).slice(0, 40), x: cx, y: cy };
      };

      const check = () => {
        seen.length = 0;
        exact.length = 0;
        loose.length = 0;
        available.length = 0;
        collect(document, 0);
        const pool = exact.length > 0 ? exact : loose;
        if (pool.length > 0) {
          pool.sort(function (a, b) { return a.len - b.len; });
          const clicked = clickOption(pool[0].el);
          return resolve({ ok: true, matched: pool.length, text: clicked.text, x: clicked.x, y: clicked.y });
        }
        if (Date.now() - start < TIMEOUT_MS) {
          setTimeout(check, POLL_MS);
        } else {
          resolve({ ok: false, reason: 'option-not-found', matched: 0, options: available.slice() });
        }
      };

      check();
    });
  })()`
}

/**
 * 生成「CI4A 语义单选 / 复选组多态点选」脚本。
 *
 * 抹平前端组件形态差异：当模型对单选组（`role="radio"` / `input[type=radio]`）调用 yanhu_select，
 * 或对单选项本体调用时，在自身 / 同级 / 祖先容器内检索单选候选，按可访问名精确匹配目标文本，
 * 命中即以**完整事件序列**（pointerdown + mousedown + focus + pointerup + mouseup + click + input
 * + change + jQuery change）点选，确保 Vue `v-model` 与 jQuery `change` 联动、金智级联逻辑立即激活。
 *
 * 契约：命中返回 `{ ok: true, ci4a: 'radio', text }`；未命中返回 `{ ok: false, ci4a: ... }`。
 * 由工具层无缝回落至「原生 select / 自定义下拉」确定性路径，绝不误报成功。 */
function buildSemanticOptionClickScript(record: YanhuBidNode, target: string): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    const __ci4aTarget = ${JSON.stringify(target)};
    const __ci4aNorm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    const el = __find();
    if (!el) return { ok: false, ci4a: 'not-found' };
    const __ci4aIsChoice = (n) => {
      const t = (n.tagName || '').toLowerCase();
      const ty = ((n.getAttribute && n.getAttribute('type')) || '').toLowerCase();
      const ro = ((n.getAttribute && n.getAttribute('role')) || '').toLowerCase();
      return ro === 'radio' || ro === 'checkbox' || (t === 'input' && (ty === 'radio' || ty === 'checkbox'));
    };
    let scope = null;
    // 作用域收窄：仅保留「单选组 / 表单项」语义容器，移除 form / ul / ol / li ——
    // 后者会把同一表单内名称巧合相同的无关单选/复选纳入候选池，造成误点并提前返回成功。
    try { scope = el.closest ? el.closest('fieldset, [role="radiogroup"], [role="group"], .bh-form-item, .form-item, .el-form-item, .ant-form-item') : null; } catch (e) { scope = null; }
    if (!scope) scope = el.parentElement || el.ownerDocument || document;
    const CHOICE_QUERY = 'input[type="radio"], input[type="checkbox"], [role="radio"], [role="checkbox"]';
    let pool = [];
    try { pool = scope.querySelectorAll ? Array.from(scope.querySelectorAll(CHOICE_QUERY)) : []; } catch (e) { pool = []; }
    if (__ci4aIsChoice(el) && pool.indexOf(el) < 0) pool = [el].concat(pool);
    if (pool.length === 0) return { ok: false, ci4a: 'no-group' };
    const __ci4aNameOf = (n) => {
      try {
        const lb = n.closest ? n.closest('label') : null;
        if (lb && lb.textContent) return __ci4aNorm(lb.textContent);
        const id = n.id || '';
        if (id && n.ownerDocument && n.ownerDocument.querySelector) {
          const f = n.ownerDocument.querySelector('label[for="' + id + '"]');
          if (f && f.textContent) return __ci4aNorm(f.textContent);
        }
        if (n.labels && n.labels.length > 0 && n.labels[0].textContent) return __ci4aNorm(n.labels[0].textContent);
        let sib = n.nextElementSibling;
        while (sib) { const st = __ci4aNorm(sib.textContent); if (st) return st; sib = sib.nextElementSibling; }
        const p = n.parentElement;
        if (p) return __ci4aNorm(p.textContent);
      } catch (e) {}
      return '';
    };
    let pick = null;
    for (let i = 0; i < pool.length; i++) { if (__ci4aNorm(__ci4aNameOf(pool[i])) === __ci4aTarget) { pick = pool[i]; break; } }
    if (!pick) {
      for (let i = 0; i < pool.length; i++) {
        const t = __ci4aNorm(__ci4aNameOf(pool[i]));
        if (t && t.indexOf(__ci4aTarget) >= 0) { pick = pool[i]; break; }
      }
    }
    if (!pick) return { ok: false, ci4a: 'option-not-found', options: pool.map(__ci4aNameOf).filter(Boolean).slice(0, 30) };
    try { if (pick.scrollIntoView) pick.scrollIntoView({ block: 'center', inline: 'center' }); } catch (e) {}
    const win = (pick.ownerDocument && pick.ownerDocument.defaultView) || window;
    const __ci4aFire = (type) => {
      try {
        const r = pick.getBoundingClientRect ? pick.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
        const Ctor = type.indexOf('pointer') === 0 ? (win.PointerEvent || win.MouseEvent) : win.MouseEvent;
        if (!Ctor) return;
        pick.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, composed: true, view: win, clientX: Math.round(r.left + r.width / 2), clientY: Math.round(r.top + r.height / 2), button: 0 }));
      } catch (e) {}
    };
    __ci4aFire('pointerdown');
    __ci4aFire('mousedown');
    try { if (typeof pick.focus === 'function') pick.focus(); } catch (e) {}
    __ci4aFire('pointerup');
    __ci4aFire('mouseup');
    try {
      if (typeof pick.click === 'function') pick.click();
      else pick.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: win, button: 0 }));
    } catch (e) {}
    // 框架响应式变更：原生 input / change + jQuery change，激活 Vue v-model 与金智级联逻辑
    try {
      pick.dispatchEvent(new Event('input', { bubbles: true }));
      pick.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) {}
    try {
      const jq = win.$ || win.jQuery;
      if (jq) jq(pick).trigger('change');
    } catch (e) {}
    return { ok: true, ci4a: 'radio', text: __ci4aNorm(__ci4aNameOf(pick)) || __ci4aTarget };
  })()`
}

/**
 * 生成第二阶梯（CDP 硬件级仿真）所需的根视口坐标定位脚本。
 *
 * 复用采集端同一套定位器（标题 + 可访问名 + 边界中心距离），先祖先解封与 `scrollIntoView`
 * 保障可视性，再自内向外累加各级 frame 的 BoundingRect，把叶子框架内的点投影为根视口 CSS 像素。 */
export function buildHardwareClickTargetScript(record: YanhuBidNode): string {
  return `(() => {
    ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
    ${buildUnsealHelpers()}
    const el = __find();
    if (!el) return { ok: false, reason: 'not-found' };
    __unseal(el);
    __center(el);
    // 吸顶遮挡绕过
    const __stickyBypass = (target) => {
      try {
        const tdoc = target.ownerDocument || document;
        if (!tdoc.elementFromPoint) return;
        const view = tdoc.defaultView || window;
        for (let pass = 0; pass < 3; pass++) {
          const rect = target.getBoundingClientRect ? target.getBoundingClientRect() : null;
          if (!rect || rect.width <= 0 || rect.height <= 0) return;
          const probeX = rect.left + rect.width / 2;
          const probeY = rect.top + Math.min(6, Math.max(1, rect.height / 4));
          let hit = null;
          try { hit = tdoc.elementFromPoint(probeX, probeY); } catch (e) { return; }
          const covered = hit && hit !== target && !(target.contains && target.contains(hit)) && !(hit.contains && hit.contains(target));
          if (!covered) return;
          // 内容向下位移
          const delta = 48 + Math.round(rect.height);
          let adjusted = false;
          let node = target.parentElement;
          let guard = 0;
          while (node && guard < 20) {
            let cs = null;
            try { cs = view.getComputedStyle ? view.getComputedStyle(node) : null; } catch (e) { cs = null; }
            const oy = cs ? cs.overflowY : '';
            const scrollable = (oy === 'auto' || oy === 'scroll' || oy === 'overlay') && node.scrollHeight > node.clientHeight + 1;
            if (scrollable) {
              const before = node.scrollTop;
              node.scrollTop = Math.max(0, before - delta);
              if (node.scrollTop !== before) adjusted = true;
              break;
            }
            node = node.parentElement;
            guard += 1;
          }
          if (!adjusted) {
            try {
              const beforeY = view.scrollY || 0;
              view.scrollBy(0, -delta);
              if ((view.scrollY || 0) === beforeY) return;
            } catch (e) { return; }
          }
        }
      } catch (e) {}
    };
    __stickyBypass(el);
    let cx = 0, cy = 0;
    try {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    } catch (e) { return { ok: false, reason: 'rect-failed' }; }
    // 多层 Frame 递归绝对投影：自内向外累加各级 frame 在父视口中的偏移
    let doc = el.ownerDocument;
    let depth = 0;
    while (doc && depth < 8) {
      const fw = doc.defaultView;
      if (!fw || fw === window) break;
      let fe = null;
      try { fe = fw.frameElement; } catch (e) { fe = null; }
      if (!fe) break;
      const fr = fe.getBoundingClientRect();
      cx += fr.left; cy += fr.top;
      doc = fe.ownerDocument;
      depth += 1;
    }
    // Hit-Test 命中穿透校验与修正：中心点若被浮层覆盖，回退至元素矩形内的候选采样点
    let hitOk = true;
    let fx = cx, fy = cy;
    try {
      const topW = window.top || window;
      const topDoc = topW.document;
      if (topDoc && topDoc.elementFromPoint) {
        let expect = el;
        let d2 = 0, d2doc = el.ownerDocument;
        while (d2doc && d2 < 8) {
          const f = d2doc.defaultView;
          if (!f || f === topW) break;
          let fe2 = null;
          try { fe2 = f.frameElement; } catch (e) { fe2 = null; }
          if (!fe2) break;
          expect = fe2;
          d2doc = fe2.ownerDocument;
          d2 += 1;
        }
        const r0 = el.getBoundingClientRect();
        const offX = cx - (r0.left + r0.width / 2);
        const offY = cy - (r0.top + r0.height / 2);
        const samples = [
          [r0.left + r0.width / 2, r0.top + r0.height / 2],
          [r0.left + r0.width * 0.25, r0.top + r0.height * 0.25],
          [r0.left + r0.width * 0.75, r0.top + r0.height * 0.75],
          [r0.left + r0.width * 0.25, r0.top + r0.height * 0.75],
          [r0.left + r0.width * 0.75, r0.top + r0.height * 0.25],
        ];
        let found = false;
        for (let i = 0; i < samples.length; i++) {
          const px = samples[i][0] + offX, py = samples[i][1] + offY;
          let hit = null;
          try { hit = topDoc.elementFromPoint(Math.round(px), Math.round(py)); } catch (e) { hit = null; }
          const isSelf = !hit || hit === el || hit === expect ||
            (el.contains && el.contains(hit)) || (expect.contains && expect.contains(hit));
          if (isSelf) { fx = px; fy = py; found = true; break; }
        }
        if (!found) hitOk = false;
      }
    } catch (e) { hitOk = true; }
    // 跨 Frame 原生导航兜底：记录 <a target="frameName"> 的联动目标与目标框架起点 URL
    let nav = null;
    try {
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'a') {
        const href = el.getAttribute ? (el.getAttribute('href') || '') : '';
        const target = el.getAttribute ? (el.getAttribute('target') || '') : '';
        const win = (el.ownerDocument && el.ownerDocument.defaultView) || window;
        const base = (win && win.location) ? win.location.href : location.href;
        if (href && /^https?:/i.test(href) && target && target !== '_self' && target !== '_blank') {
          let from = '';
          try {
            const topW = window.top || window;
            const fr = topW.document.querySelector('frame[name="' + target + '"], iframe[name="' + target + '"], frame#' + target + ', iframe#' + target + '');
            const fwin = fr && (fr.contentWindow || (topW.frames && topW.frames[target]));
            from = (fwin && fwin.location) ? fwin.location.href : '';
          } catch (e) {}
          let absolute = href;
          try { absolute = new URL(href, base).href; } catch (e) {}
          nav = { frameName: target, href: absolute, from: from };
        }
      }
    } catch (e) { nav = null; }
    return { ok: true, x: Math.round(fx), y: Math.round(fy), hitOk: hitOk, nav: nav };
  })()`
}

/** 跨 Frame 原生导航双保险脚本：仅当目标框架仍停留于起点时才兜底导航，避免重复加载 */
function buildEnsureNavigationScript(nav: { frameName: string; href: string; from: string }): string {
  return `(() => {
    try {
      const target = ${JSON.stringify(nav.frameName)};
      const dest = ${JSON.stringify(nav.href)};
      const from = ${JSON.stringify(nav.from)};
      const topW = window.top || window;
      const fr = topW.document.querySelector('frame[name="' + target + '"], iframe[name="' + target + '"], frame#' + target + ', iframe#' + target + '');
      const fwin = fr && (fr.contentWindow || (topW.frames && topW.frames[target]));
      if (!fwin || !fwin.location) return { ok: false, reason: 'frame-not-found' };
      let current = '';
      try { current = fwin.location.href; } catch (e) { current = ''; }
      if (from && current && current !== from) return { ok: true, assigned: false };
      if (current === dest) return { ok: true, assigned: false };
      fwin.location.assign(dest);
      return { ok: true, assigned: true };
    } catch (e) { return { ok: false, reason: 'error' }; }
  })()`
}

/** 动作后的双平面稳态收口（网络流静止 + 跨 Frame DOM 排空；脚本异常回退固定观察窗） */
async function settleAfterAction(tabId: string): Promise<void> {
  try {
    await yanhuExpressManager.awaitStable(tabId, { windowMs: 300, timeoutMs: 1500 })
  } catch {
    await waitForDomSettle(tabId)
  }
}

/**
 * 因果 DAG 跨平面观察器：并行监听 DOM 突变 / 网络在途 / URL 变更 / 标签拓扑四类因果边，
 * 命中任一即提前返回，避免固定延时；观察窗内零命中即判定 No-Op（供上层升级至 CDP 硬件级）。 */
async function observeYanhuCausality(tabId: string, baseline: CausalSnapshot, windowMs: number): Promise<CausalObservation> {
  const probePromise = yanhuExpressManager
    .probeCrossFrameActivity(tabId, windowMs)
    .catch(() => ({ settled: true, mutated: false, mutations: 0, frames: 0, elapsedMs: 0 }))
  const domState: { drain: { mutated: boolean } | null } = { drain: null }
  probePromise.then((drain) => {
    domState.drain = drain
  })

  const deadline = Date.now() + windowMs
  let networkStarted = false
  let urlChanged = false
  let newTab = false
  while (Date.now() < deadline) {
    if (domState.drain?.mutated) break
    if (yanhuExpressManager.getInflightRequestCount(tabId) > baseline.inflight) {
      networkStarted = true
      break
    }
    if (yanhuExpressManager.getNetworkActivityAt(tabId) > baseline.networkActivityAt) {
      networkStarted = true
      break
    }
    if (yanhuExpressManager.getTabCount() > baseline.tabCount) {
      newTab = true
      break
    }
    const meta = yanhuExpressManager.getTabMeta(tabId)
    if (meta && meta.url && meta.url !== baseline.url) {
      urlChanged = true
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 60))
  }

  let mutated = domState.drain?.mutated === true
  if (!mutated && !networkStarted && !urlChanged && !newTab) {
    const drain = domState.drain ?? (await probePromise)
    mutated = drain.mutated
  }

  const evidence: string[] = []
  if (mutated) evidence.push('因果边命中：跨 Frame DOM 发生突变')
  if (networkStarted) evidence.push('因果边命中：网络请求在途 / 新增')
  if (urlChanged) evidence.push('因果边命中：主框架 URL 变更')
  if (newTab) evidence.push('因果边命中：检测到新标签页创建')
  if (evidence.length === 0) evidence.push(`观察窗 ${windowMs}ms 内零因果边（判定 No-Op）`)
  return { mutated, networkStarted, urlChanged, newTab, evidence }
}

/** 装配主进程侧的两阶梯自适应分派宿主 */
function createHybridDispatcherAdapter(): HybridDispatcherAdapter {
  return {
    async dispatchSynthetic(tabId, record, options) {
      try {
        const result = (await yanhuExpressManager.evalInPage(
          tabId,
          buildForceTriggerScript(record, { doubleClick: options.doubleClick === true }),
        )) as { ok?: boolean; syncMutations?: number; stateChanged?: boolean } | null
        const ok = !!result && result.ok === true
        const rawSync = result?.syncMutations
        const syncMutations =
          typeof rawSync === 'number' && Number.isFinite(rawSync) ? Math.max(0, Math.trunc(rawSync)) : 0
        return { ok, syncMutations, stateChanged: result?.stateChanged === true }
      } catch {
        return { ok: false, syncMutations: 0, stateChanged: false }
      }
    },
    async dispatchHardware(tabId, record, options) {
      try {
        const located = (await yanhuExpressManager.evalInPage(tabId, buildHardwareClickTargetScript(record))) as
          | {
              ok?: boolean
              x?: number
              y?: number
              hitOk?: boolean
              nav?: { frameName: string; href: string; from: string } | null
            }
          | null
        if (!located || located.ok !== true || typeof located.x !== 'number' || typeof located.y !== 'number') {
          // 跨域（OOPIF）框架内控件无法被页面脚本定位，改用采集期已投影的根视口绝对坐标直接点击
          return dispatchCrossOriginRecordClick(tabId, record, options.doubleClick === true)
        }
        // 命中穿透校验：中心点被浮层遮挡（hitOk=false）时拒绝硬件点击，避免点中遮罩层
        if (located.hitOk === false) return false
        await yanhuExpressManager.dispatchHumanClick(tabId, located.x, located.y, {
          doubleClick: options.doubleClick === true,
        })
        // 跨 Frame 原生导航双保险：若 frameset 联动未生效，由主进程直接驱动目标框架导航
        const nav = located.nav
        if (nav && nav.frameName && nav.href) {
          try {
            await yanhuExpressManager.evalInPage(tabId, buildEnsureNavigationScript(nav))
          } catch {
            // 兜底脚本异常不影响点击结果。
          }
        }
        return true
      } catch {
        return false
      }
    },
    snapshot(tabId): CausalSnapshot {
      return {
        url: yanhuExpressManager.getTabMeta(tabId)?.url ?? '',
        inflight: yanhuExpressManager.getInflightRequestCount(tabId),
        networkActivityAt: yanhuExpressManager.getNetworkActivityAt(tabId),
        tabCount: yanhuExpressManager.getTabCount(),
      }
    },
    observeCausality: (tabId, baseline, windowMs) => observeYanhuCausality(tabId, baseline, windowMs),
    awaitQuiescence: (tabId, options) => yanhuExpressManager.awaitStable(tabId, options),
    resolveActiveTabId: () => yanhuExpressManager.getActiveTabId(),
  }
}

/** 全局共享的两阶梯自适应分派器（懒装配，保证单测中可热替换底层管理器方法） */
let sharedHybridDispatcher: HybridAdaptiveDispatcher | null = null
function getHybridDispatcher(): HybridAdaptiveDispatcher {
  if (!sharedHybridDispatcher) {
    sharedHybridDispatcher = new HybridAdaptiveDispatcher(createHybridDispatcherAdapter())
  }
  return sharedHybridDispatcher
}

/**
 * 解析 BID 为标定记录。
 *
 * 优先命中当前索引；若当前索引因 markDirty 失效，则自动回退到历史回退池（stale 记录），
 * 从而消除「点击 -> BID 失效 -> 重读 -> 再点击」的固定冗余交互，不向模型抛出「BID 失效」。
 * 仅当该 BID 从未被标定时才给出明确引导。 */
function requireBid(tabId: string, bid: number): BidNodeRecord {
  const record = yanhuDomDistillationEngine.resolveBidWithFallback(tabId, bid)
  if (!record) {
    // 未知 BID 回传可用台账
    const available = yanhuDomDistillationEngine.listBidsWithFallback(tabId)
    const listing = available
      .slice(0, 40)
      .map((node) => `[${node.bid}] ${node.role} "${node.name}"`)
      .join('\n')
    const hint = listing ? `当前可用 BID：\n${listing}` : '当前页面尚无标定记录，请先调用 yanhu_read_page 观察页面。'
    throw new Error(`BID ${bid} 不存在。${hint}`)
  }
  return record
}

/**
 * 生成定位器的放宽判定标志。
 *
 * 仅「历史回退记录」（页面已重绘、当前索引失效但上一轮标定仍可用）需要放宽尺寸过滤。
 * 折叠态记录已不再产生（渲染红线：未渲染元素不分配 BID），故不再作为放宽依据。
 */
function finderRelaxed(record: YanhuBidNode): boolean {
  return (record as BidNodeRecord).stale === true
}

/** 判定记录是否来自跨域（OOPIF）子框架（采集期以 `xframe:` 前缀标记） */
function isCrossOriginFrameRecord(record: YanhuBidNode): boolean {
  return typeof record.framePath === 'string' && record.framePath.startsWith('xframe:')
}

/**
 * 跨域框架控件的硬件点击兜底。
 *
 * 页面脚本无法穿透跨域 iframe，故无法就地定位；改用采集期由 CDP 已投影为根视口的绝对坐标。
 * 直接以 `Input.dispatchMouseEvent` 派发物理点击，使内嵌第三方表单控件同样可被真实命中。 */
async function dispatchCrossOriginRecordClick(
  tabId: string,
  record: YanhuBidNode,
  doubleClick: boolean,
): Promise<boolean> {
  if (!isCrossOriginFrameRecord(record)) return false
  const { x, y, width, height } = record.bounds
  if (width <= 0 || height <= 0) return false
  try {
    await yanhuExpressManager.dispatchHumanClick(
      tabId,
      Math.round(x + width / 2),
      Math.round(y + height / 2),
      { doubleClick },
    )
    return true
  } catch {
    return false
  }
}

/**
 * 计算当前标签的环境状态指纹（供 DeadlockGuard 判定「环境是否被反复拉回相同」）。
 *
 * 指纹本身已由 {@link computePageFingerprint} 剔除框架随机动态 ID，且为 base36 哈希串，
 * 故直接使用原值——此前对哈希串再套 {@link normalizeStateString}（面向 HTML 属性文本的正则）
 * 属空操作，已移除以免误导。 */
function currentStateHash(tabId: string): string {
  return yanhuDomDistillationEngine.getDeliveredFingerprint(tabId) ?? ''
}

/**
 * 交互动作的前置死锁防护（DeadlockGuard 拦截器）。
 *
 * 命中乒乓振荡（Period-2 交替死锁）或动作已被动态遮罩时，返回熔断回执；否则登记本步并返回 null。 */
function guardAgainstDeadlock(tabId: string, bid: number, actionName: string): YanhuToolExecutionResult | null {
  const verdict = yanhuDeadlockGuard.evaluate(tabId, currentStateHash(tabId), bid, actionName)
  if (!verdict.deadlock) return null
  const pattern = verdict.cyclePattern ? `（振荡周期：${verdict.cyclePattern}）` : ''
  return {
    content: `【死锁防护拦截】检测到针对 [BID: ${bid}] 的交替振荡点击${pattern}，页面未产生有效推进。已触发动作空间遮罩，请勿继续点击该按钮，请改用其他控件或先读取页面。`,
    isError: true,
  }
}

/**
 * 生成本次操作后「紧随其后的可交互字段」精简提示（出参自包含状态反馈）。
 *
 * 工具成功后直接回传后续紧邻字段的 [BID] 台账，模型无需再花一整个 LLM 往返 read_page 验证。
 * 即可在一个思考轮次内批量推进整张表单，从源头消灭「填一次 → 读一次」的 50% 冗余轮次。 */
function buildNextFieldHint(tabId: string, currentBid: number): string {
  const nodes = yanhuDomDistillationEngine.listBidsWithFallback(tabId)
  if (nodes.length === 0) return ''
  const idx = nodes.findIndex((node) => node.bid === currentBid)
  const rest = idx >= 0 ? nodes.slice(idx + 1) : nodes
  const next = rest.filter((node) => !node.collapsed).slice(0, 4)
  if (next.length === 0) return ''
  return `后续字段：${next.map((node) => `[BID: ${node.bid}] \"${node.name}\"`).join("、")}。`
}

/**
 * 语义重定位：页面局部重绘后控件仍在页面中，但整体 BID 台账已重新编号。
 *
 * 依据「角色 + 可访问名 + 标签」三项语义身份在新索引中找回同一控件；同名多个时以旧坐标
 * 的曼哈顿中心距离消歧，取最近者。找不到则返回 null（绝不盲猜，宁可报错也不点错控件）。
 */
export function relocateBySemantics(tabId: string, record: YanhuBidNode): BidNodeRecord | null {
  const cx = record.bounds.x + record.bounds.width / 2
  const cy = record.bounds.y + record.bounds.height / 2
  let best: BidNodeRecord | null = null
  let bestDistance = Infinity
  for (const node of yanhuDomDistillationEngine.listBidsWithFallback(tabId)) {
    if (node.bid === record.bid) continue
    if (node.role !== record.role || node.name !== record.name) continue
    if (record.tag && node.tag !== record.tag) continue
    const distance =
      Math.abs(node.bounds.x + node.bounds.width / 2 - cx) +
      Math.abs(node.bounds.y + node.bounds.height / 2 - cy)
    if (distance < bestDistance) {
      bestDistance = distance
      best = node
    }
  }
  return best
}

/**
 * 定位失败后的自愈闭环：强制重建一次页面索引（绕开 TTL 缓存），再按语义身份找回同一控件。
 *
 * 解决历史高频故障「BID 台账过期 → 点击 / 填写定位失败 → 模型被迫再读一次页面拿新 BID → 重试」。
 * 直接在工具层完成重定位并把新编号回传（或就地重试），把两轮 LLM 往返压缩为一次。
 */
async function reidentifyAfterRedraw(tabId: string, record: YanhuBidNode): Promise<BidNodeRecord | null> {
  try {
    await distillCurrent(tabId)
  } catch {
    return null
  }
  return relocateBySemantics(tabId, record)
}

/** 生成「控件已重新编号」的回执片段（点击 / 填写自愈失败时回传，让模型一个往返就能改写 BID） */
function buildReidentifiedHint(relocated: BidNodeRecord | null): string {
  if (!relocated) {
    return '页面重绘后亦未能按「角色 + 名称」找回同一控件，请调用 yanhu_read_page 复核当前 [BID] 台账。'
  }
  return `该控件在页面重绘后编号已刷新为 [BID: ${relocated.bid}]（${relocated.role} "${relocated.name}"），请直接改用新编号。`
}

/** 蒸馏当前页面（供 read_page 复用；带 TTL 缓存，导航 / 交互后由 markDirty 触发重建） */
async function distillCurrent(tabId: string): Promise<YanhuDistilledPage> {
  const cached = yanhuDomDistillationEngine.getCached(tabId)
  if (cached && Date.now() - cached.timestamp <= YANHU_READ_CACHE_TTL_MS) return cached
  const collectorScript = buildYanhuCollectorScript()
  const collected = normalizeCollected(await yanhuExpressManager.evalInPage(tabId, collectorScript))
  // 跨域（OOPIF）子框架补充采集：页面脚本无法穿越 contentWindow.document 的跨域盲区，改由 CDP 补齐
  try {
    const oopif = await yanhuExpressManager.collectCrossOriginFrameElements(tabId, collectorScript)
    if (oopif.elements.length > 0) {
      collected.elements = collected.elements.concat(oopif.elements)
    }
    if (oopif.dataTables.length > 0) {
      collected.dataTables = [...(collected.dataTables ?? []), ...oopif.dataTables]
    }
  } catch {
    // 跨域采集失败不影响主框架页面感知
  }
  let axNodes: unknown[] = []
  try {
    const ax = await yanhuExpressManager.getFullAXTree(tabId)
    axNodes = Array.isArray(ax) ? ax : []
  } catch {
    axNodes = []
  }
  return yanhuDomDistillationEngine.distill(tabId, collected, axNodes)
}

/**
 * 从当前蒸馏页构建视觉地标集合。
 *
 * 选取「可见、未被遮挡、位于视口内、具备可读名称」的控件作为地标基准点，
 * 其视觉归一化坐标 u/v ∈ [0,1000]² 与 DOM DIP 坐标一一对应，供单应性矩阵求解。
 */
export function buildPageLandmarks(
  page: YanhuDistilledPage,
  dipWidth: number,
  dipHeight: number,
): VisualLandmark[] {
  const out: VisualLandmark[] = []
  if (dipWidth <= 0 || dipHeight <= 0) return out
  for (const node of page.nodes) {
    if (node.isOccluded) continue
    if (!node.name) continue
    const b = node.bounds
    if (!b || b.width <= 0 || b.height <= 0) continue
    const cx = b.x + b.width / 2
    const cy = b.y + b.height / 2
    if (cx < 0 || cy < 0 || cx > dipWidth || cy > dipHeight) continue
    out.push({
      u: Math.round((cx / dipWidth) * 1000),
      v: Math.round((cy / dipHeight) * 1000),
      x: Math.round(cx),
      y: Math.round(cy),
      label: node.name.slice(0, 24),
    })
    if (out.length >= 64) break
  }
  return out
}

/** 页面信息是否极度稀疏（文本 / 数据表格不足），用于视觉截图的隐式自动兜底判定 */
export function isVisuallySparsePage(page: YanhuDistilledPage): boolean {
  const hasTables = Array.isArray(page.dataTables) && page.dataTables.length > 0
  return page.nodes.length < 5 && !hasTables
}

/**
 * 截取视口并建立双平面标定快照（写入按标签缓存的快照，供 `yanhu_click_visual` 复用）。
 */
async function captureVisualSnapshot(
  tabId: string,
): Promise<{ snapshot: VisualAnchorSnapshot; dataUrl: string } | null> {
  const shot = await yanhuExpressManager.captureViewport(tabId)
  if (!shot) return null
  const page = await distillCurrent(tabId)
  const landmarks = buildPageLandmarks(page, shot.dipWidth, shot.dipHeight)
  const snapshot = buildVisualSnapshot({
    dipWidth: shot.dipWidth,
    dipHeight: shot.dipHeight,
    pixelWidth: shot.pixelWidth,
    pixelHeight: shot.pixelHeight,
    landmarks,
  })
  setVisualSnapshot(tabId, snapshot)
  return { snapshot, dataUrl: shot.dataUrl }
}

/** 把标定快照渲染为模型可读的文本块（地标对照表） */
function formatVisualSnapshot(snapshot: VisualAnchorSnapshot): string {
  const lines: string[] = []
  lines.push('[视觉标定 · 双平面平行坐标锚定]')
  lines.push(
    `视口 DIP: ${snapshot.dipWidth}×${snapshot.dipHeight} | 截图像素: ${snapshot.pixelWidth}×${snapshot.pixelHeight} | 地标: ${snapshot.landmarks.length} | 单应性: ${snapshot.homography ? '已求解' : '纯缩放回退'}`,
  )
  if (snapshot.landmarks.length > 0) {
    lines.push('地标对照（视觉归一化 u,v ∈ [0,1000] → DOM DIP x,y）：')
    for (const lm of snapshot.landmarks) {
      lines.push(`  u=${lm.u},v=${lm.v} → x=${lm.x},y=${lm.y}${lm.label ? ` "${lm.label}"` : ''}`)
    }
  }
  lines.push('若需点击视觉目标，请使用 yanhu_click_visual 传入 u,v（0~1000 归一化坐标）。')
  return lines.join('\n')
}

/** 判定是否为宽字符（CJK / 全角标点等），用于 Token 估算加权 */
function isWideChar(code: number): boolean {
  return (code >= 0x1100 && code <= 0x115f)
    || (code >= 0x2e80 && code <= 0xa4cf)
    || (code >= 0xac00 && code <= 0xd7a3)
    || (code >= 0xf900 && code <= 0xfaff)
    || (code >= 0xfe30 && code <= 0xfe6f)
    || (code >= 0xff00 && code <= 0xff60)
    || (code >= 0xffe0 && code <= 0xffe6)
}

/**
 * 截断至 Token 预算。
 *
 * 采用加权估算：CJK / 全角字符按 1 token/字，西文与其他按 0.25 token/字。
 * 此前统一按「1 token ≈ 4 字符」会严重低估中文，导致实际输出远超预算。
 */
function capByTokens(text: string, maxTokens?: number): string {
  if (!maxTokens || maxTokens <= 0) return text
  let budget = maxTokens
  let end = text.length
  for (let i = 0; i < text.length; i++) {
    budget -= isWideChar(text.charCodeAt(i)) ? 1 : 0.25
    if (budget < 0) { end = i; break }
  }
  return end >= text.length ? text : `${text.slice(0, end)}\n…（PageDigest 已按 maxTokens 截断）`
}

/**
 * 装配「砚小龙」专属门禁工具集。
 *
 * @param tabResolver 返回当前目标标签 ID 的解析器（通常为激活标签）
 */
export function buildYanhuBrowserTools(
  tabResolver: () => string,
  options: { enableVision?: boolean } = {},
): YanhuBrowserTool[] {
  const tools: YanhuBrowserTool[] = []
  /** 工具层熔断标记：记录「上一次 read_page 报告页面无变化」所属的标签 ID（按标签隔离，杜绝跨标签误熔断） */
  let unchangedBreakerTabId: string | null = null
  /** 重复点击护栏台账：`${tabId}:${bid}` -> 上次点击时的「已投递页面指纹」与时间戳 */
  const recentClicks = new Map<string, { at: number; fingerprint: string }>()
  /** 记录一次有效交互动作（click/select/fill/scroll/navigate 等），解除熔断并刷新观察基准 */
  const markInteraction = (): void => {
    unchangedBreakerTabId = null
  }
  /**
   * 组装「操作成功 + 后续紧邻字段」的自包含出参：
   *
   * 纯值写入类动作（fill / select / set_date）成功后直接回带下一批字段的 [BID] 台账。
   * 引导模型在一个轮次内批量推进整张表单，无需再为每个字段耗一次 read_page 往返。
   */
  const withNextFields = (tabId: string, bid: number, base: string): string => {
    const hint = buildNextFieldHint(tabId, bid)
    return `${base}${hint ? ` ${hint}` : ''}无需再次 read_page 验证，请继续推进下一表单项！`
  }

  // 1. yanhu_read_page — 观察页面
  tools.push({
    definition: {
      name: 'yanhu_read_page',

      description: `读取并理解当前页面：返回经四级蒸馏后的极简 PageDigest（含 [BID] 交互映射与表格降噪快照）。每次发生加载、跳转或交互后，必须优先调用本工具观察最新状态。`,
      parameters: {
        type: 'object',
        properties: {
          maxTokens: { type: "number", description: "返回文本 Token 上限（缺省不限制）" },
        },
      },
    },
    label: () => `⚡ 正在读取页面`,
    execute: async (args) => {
      const tabId = tabResolver()
            // 工具层短路熔断
      const cached = yanhuDomDistillationEngine.getCached(tabId)
      if (unchangedBreakerTabId === tabId) {
        const indexText = cached ? `\n${buildUnchangedNotice(cached)}` : ''
        return { content: `${YANHU_CIRCUIT_BREAK_NOTICE}${indexText}`, isError: true }
      }
      const requested = asInt(args.maxTokens, 0)
      const budget = requested > 0 ? Math.min(requested, MAX_READ_PAGE_TOKENS) : DEFAULT_READ_PAGE_TOKENS
      const page = await distillCurrent(tabId)
      const { unchanged, diffText } = yanhuDomDistillationEngine.recordDelivery(tabId, page)
      // 全要素指纹一致：页面完全无变化时短路回传组件索引（受 token 预算约束），阻断巨型 PageDigest 重复重放
      if (unchanged) {
        unchangedBreakerTabId = tabId
        return { content: capByTokens(buildUnchangedNotice(page), budget) }
      }
      unchangedBreakerTabId = null
      // Git-Diff 局部增量
      if (diffText) return { content: diffText }
      const digest = capByTokens(page.digestText, budget)
      // 隐式视觉兜底：页面文本极度稀疏（可交互节点 < 5 且无数据表格）且已开启视觉感知时，
      // 自动截取视口并附带地标锚点标定块，实现「页面看不清 → 自动视觉自愈」的透明兜底。
      if (options.enableVision && isVisuallySparsePage(page)) {
        const captured = await captureVisualSnapshot(tabId)
        if (captured) {
          return { content: `${digest}\n\n${formatVisualSnapshot(captured.snapshot)}` }
        }
      }
      return { content: digest }
    },
  })

  // 2. yanhu_click — 点击
  tools.push({
    definition: {
      name: 'yanhu_click',
      description:
        `点击页面上编号为 [BID] 的控件。优先使用硬件级 CDP 鼠标事件，失败时回退到原生 click()。点击后建议再次调用 yanhu_read_page 验证结果。`,
      parameters: {
        type: 'object',
        properties: {
          bid: { type: "number", description: "目标控件的数字编号 BID" },
          doubleClick: { type: 'boolean', description: '是否双击' },
          waitForNavigation: { type: "boolean", description: "点击后等待页面加载完成（默认 false）" },
        },
        required: ['bid'],
      },
    },
    label: (args) => `👆 点击 [${asInt(args.bid)}]`,
    execute: async (args) => {
      const tabId = tabResolver()
      const bid = asInt(args.bid)
      const record = requireBid(tabId, bid)
      // 危险操作底层硬拦截：注销 / 退出登录不得由模型误触，直接保护当前会话。
      if (YANHU_DANGEROUS_ACTION_RE.test(record.name)) {
        return {
          content: `【安全拦截】该操作为注销/退出系统，已由底层自动拦截以保护当前会话。`,
          isError: true,
        }
      }
      // 死锁防护前置拦截：命中乒乓振荡或动作空间遮罩，立即熔断，终止模型 20 步空转。
      const deadlock = guardAgainstDeadlock(tabId, bid, `click`)
      if (deadlock) return deadlock
      // 动静分离节流：表单内部局部点击不产生全页请求。
      await enforceYanhuHumanInterval(true)
      // 确定性护栏（基于「渲染内容指纹」而非 URL/框架）：同一控件在页面内容毫无变化时被重复点击，
      // 说明上一次点击没有产生任何可见效果，再点一次也不会有效果——直接拦截，终止模型空转。
      const clickKey = `${tabId}:${bid}`
      const deliveredFingerprint = yanhuDomDistillationEngine.getDeliveredFingerprint(tabId)
      const previousClick = recentClicks.get(clickKey)
      if (
        deliveredFingerprint &&
        previousClick &&
        previousClick.fingerprint === deliveredFingerprint &&
        Date.now() - previousClick.at <= YANHU_REPEAT_CLICK_WINDOW_MS
      ) {
        const seconds = Math.max(1, Math.round((Date.now() - previousClick.at) / 1000))
        return {
          content: `【重复点击拦截】[BID: ${bid}] "${record.name}" 于 ${seconds} 秒前已点击过，且此后页面**渲染内容完全没有变化**（URL / 框架不变并不代表没变，此处按内容指纹判定）。重复点击不会产生新效果：请改用 yanhu_select / yanhu_fill，或点击其它 [BID]，亦可先 yanhu_read_page 复核当前状态。`,
          isError: true,
        }
      }
      // 确定性交互总线：合成事件注入 -> 因果 DAG 探测 -> 无因果自动升降级 CDP 硬件 -> 双平面静止决算
      const dispatch = await getHybridDispatcher().dispatch(tabId, record, {
        doubleClick: args.doubleClick === true,
        waitForNavigation: args.waitForNavigation === true,
      })
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      if (dispatch.outcome === 'terminal-failed') {
        // 自愈重定位：控件通常仍在页面中，只是局部重绘后 BID 台账整体重新编号。
        // 先按语义身份找回同一控件并就地重试一次；仍失败才回报，且回执带上刷新后的编号，
        // 让模型一个往返就能修正，而不是「失败 → read_page → 再点」白白多烧两轮 LLM 调用。
        const relocated = await reidentifyAfterRedraw(tabId, record)
        if (relocated) {
          const retry = await getHybridDispatcher().dispatch(tabId, relocated, {
            doubleClick: args.doubleClick === true,
            waitForNavigation: args.waitForNavigation === true,
          })
          yanhuDomDistillationEngine.markDirty(tabId)
          markInteraction()
          if (retry.outcome !== 'terminal-failed') {
            return {
              content: `已点击 [BID: ${bid} → ${relocated.bid}] ${relocated.role} "${relocated.name}"（${retry.method}）。该控件在页面重绘后编号已刷新，后续请使用 [BID: ${relocated.bid}]。`,
            }
          }
        }
        // 只读文本输入框（日历 / 时间控件）直接点击本就无因果反应，给出确定的替代路径而非让模型乱试
        const readonlyHint =
          record.tag === 'input'
            ? '该控件是文本输入框：教务系统的日期 / 时间控件多由页面自带的只读文本框承载，直接点击不产生因果反应，请改用 yanhu_fill 直接写入值，或点击其相邻的「选择时间 / 日历」入口。'
            : ''
        return {
          content: `点击失败：未能在页面中定位或触发 [BID: ${bid}]（${record.role} "${record.name}"）。因果链：${dispatch.evidence.join(' → ')}。${buildReidentifiedHint(relocated)}${readonlyHint}`,
          isError: true,
        }
      }
      // 仅在点击「确实生效」时才登记护栏台账，保证失败重试不被误拦
      if (deliveredFingerprint) recentClicks.set(clickKey, { at: Date.now(), fingerprint: deliveredFingerprint })
      const collapsedNote = record.collapsed ? `（折叠容器已自动解封）` : ``
      const note = record.isOccluded ? `（注意：该控件此前疑似被浮层遮挡）` : ``
      const escalatedNote = dispatch.escalated ? '（合成事件被拦截，已自动升级至 CDP 硬件级点击）' : ''
      const newTabNote = dispatch.newTab
        ? `（检测到新标签页创建，已自动等待新页面稳定，当前激活：${dispatch.activeTabId}）`
        : ''
      // 树形选项点击后的收口：点击只完成「选中视觉」，控件还需一次收口动作
      // （触发 select / itemClick、更新下拉按钮内容、收起弹层、同步隐藏域与 emapForm 模型）才会真正生效。
      // 缺少这一步时，点得再准也会被表单校验判成「未填写」——这是「出校去向」顽疾的最后一环。
      let treeCommitNote = ''
      if (record.role === 'option' || record.role === 'treeitem') {
        try {
          const commit = (await yanhuExpressManager.evalInPage(tabId, buildTreeItemCommitScript(record))) as
            | { ok?: boolean; via?: string }
            | null
          if (commit?.ok === true && commit.via === 'tree-commit') {
            treeCommitNote = '（已触发树形控件收口：select / close + 同步隐藏域）'
          }
        } catch {}
      }
      return {
        content: `已点击 [BID: ${bid}] ${record.role} \"${record.name}\"（${dispatch.method}）${collapsedNote}${note}${escalatedNote}${newTabNote}${treeCommitNote}。请调用 yanhu_read_page 验证结果。`,
      }
    },
  })

  // 3. yanhu_fill — 填写
  tools.push({
    definition: {
      name: 'yanhu_fill',
      description:
        `向编号为 [BID] 的输入框（input / textarea / contenteditable）填写文本，自动触发 input 与 change 事件。仅对可输入控件有效——下拉 / 勾选框 / 按钮请改用 yanhu_select / yanhu_click（工具会直接拒绝并给出建议）。pressEnter 默认只派发合成回车（供下拉筛选 / 联想选定，绝不会提交表单）；仅当确实要提交表单时才显式设置 allowFormSubmit=true。`,
      parameters: {
        type: 'object',
        properties: {
          bid: { type: 'number', description: '目标输入框的 BID' },
          value: { type: 'string', description: '要写入的文本' },
          clearFirst: { type: "boolean", description: "写入前是否清空" },
          pressEnter: { type: "boolean", description: "写入后是否触发回车（默认仅合成回车，不会提交表单）" },
          allowFormSubmit: {
            type: 'boolean',
            description:
              "是否允许回车触发浏览器原生表单提交（默认 false）。仅在明确需要提交表单时设为 true。",
          },
        },
        required: ['bid', 'value'],
      },
    },
    label: (args) => `⌨ 填写 [${asInt(args.bid)}]`,
    execute: async (args) => {
      const tabId = tabResolver()
      const bid = asInt(args.bid)
      const record = requireBid(tabId, bid)
      // 动静分离节流置于 BID 解析之后：本地值写入 0ms 放行，非目标 BID 亦不白白等待物理间隔
      await enforceYanhuHumanInterval(true)
      const value = stripDecorators(asStr(args.value))
      if (!value) return { content: `填写失败：待写入内容为空。`, isError: true }
      const clearFirst = args.clearFirst !== false
      const pressEnter = args.pressEnter === true
      // 安全默认：绝不允许回车触发原生表单提交，除非调用方显式开启。
      const allowFormSubmit = args.allowFormSubmit === true
      // 确定性守卫：先判定目标是否真的可输入，非输入框直接结构化拒绝（不把决定权交给模型）。
      const guard = (await yanhuExpressManager.evalInPage(tabId, buildFillTargetGuardScript(record))) as
        | { ok?: boolean; editable?: boolean; readOnly?: boolean; tag?: string; type?: string; role?: string }
        | null
      if (!guard || guard.ok !== true) {
        // 定位失败自愈：页面重绘后该控件可能已被重新编号，重建索引并回传新 BID，
        // 模型下一轮直接用新编号即可，无需再花一整轮 read_page。
        const relocated = await reidentifyAfterRedraw(tabId, record)
        return {
          content: `填写失败：未能在页面中定位到 [BID: ${bid}]。${buildReidentifiedHint(relocated)}`,
          isError: true,
        }
      }
      if (guard.editable !== true) {
        return { content: buildNonEditableFillMessage(bid, record, guard), isError: true }
      }

      // 首选：CDP 硬件物理输入（真实聚焦 + 原生文本 insertText + 可选回车）
      //
      // 只读控件（日历 / 时间选择器 / 树选择的承载输入框）直接跳过这一通道：它的值由页面自带控件
      // 驱动，物理输入对它 100% 无效，先跑一遍等于白白多付一次「聚焦 + 输入 + 回读校验」的往返。
      let filled = false
      if (guard.readOnly !== true) {
        try {
          const located = (await yanhuExpressManager.evalInPage(tabId, buildHardwareClickTargetScript(record))) as
            | { ok?: boolean; x?: number; y?: number; hitOk?: boolean }
            | null
          if (
            located &&
            located.ok === true &&
            located.hitOk !== false &&
            typeof located.x === 'number' &&
            typeof located.y === 'number'
          ) {
            await yanhuExpressManager.dispatchHumanTextInput(tabId, located.x, located.y, value, {
              clearFirst,
              pressEnter,
              allowFormSubmit,
            })
            filled = true
            // 写入校验：回读目标输入框当前值，确认文本真正落到目标控件（杜绝静默错填）
            const check = (await yanhuExpressManager.evalInPage(tabId, buildFillVerificationScript(record))) as
              | { ok?: boolean; value?: string }
              | null
            if (!check || check.ok !== true) {
              filled = false
            } else if (value.length > 0 && String(check.value ?? '').indexOf(value) < 0) {
              filled = false
            }
          }
        } catch {
          filled = false
        }
      }

      // 降级回退：CDP 坐标不可用时退回纯 JS 原生 value setter + 完整事件链（回车为合成事件，天然不会提交表单）。
      if (!filled) {
        const result = (await yanhuExpressManager.evalInPage(
          tabId,
          buildLegacyFillScript(record, value, clearFirst, pressEnter),
        )) as { ok?: boolean } | null
        if (!result || result.ok !== true) {
          return { content: `填写失败：未能定位到 [BID: ${bid}] 输入框。`, isError: true }
        }
      }
      // 隐式等待：双平面稳态收口，确认局部重绘、事件派发与关联网络请求均已完成
      await settleAfterAction(tabId)
      yanhuDomDistillationEngine.markDirty(tabId)
      const enterNote = pressEnter ? `并回车` : ``
      const safeNote = pressEnter && !allowFormSubmit ? `（已派发合成回车，未触发原生表单提交）` : ``
      const readOnlyNote =
        guard.readOnly === true
          ? `（只读控件：已走 JS 原生 setter + 完整事件链，未做物理输入；若页面控件未响应，请改用其自带的日期 / 选择器入口）`
          : ``
      return {
        content: withNextFields(
          tabId,
          bid,
          `已向 [BID: ${bid}] "${record.name}" 填写内容${enterNote}。${safeNote}${readOnlyNote}`,
        ),
      }
    },
  })

  // 4. yanhu_select — 下拉选择
  tools.push({
    definition: {
      name: 'yanhu_select',
      description:
        `操作编号为 [BID] 的下拉框：原生 select 直接赋值并派发 change；自定义下拉框将自动展开并点击文本匹配项（无需模型手动展开点选）。`,
      parameters: {
        type: 'object',
        properties: {
          bid: { type: 'number', description: '目标下拉框的 BID' },
          valueOrText: { type: "string", description: "选项的 value 或显示文本" },
        },
        required: ['bid', 'valueOrText'],
      },
    },
    label: (args) => `🔽 选择 [${asInt(args.bid)}]`,
    execute: async (args) => {
      const tabId = tabResolver()
      const bid = asInt(args.bid)
      const record = requireBid(tabId, bid)
      // 死锁防护前置拦截：命中乒乓振荡或动作空间遮罩，立即熔断，终止模型 20 步空转。
      const deadlock = guardAgainstDeadlock(tabId, bid, `select`)
      if (deadlock) return deadlock
      // 动静分离节流置于 BID 解析之后：本地值写入 0ms 放行，非目标 BID 亦不白白等待物理间隔
      await enforceYanhuHumanInterval(true)
      const target = stripDecorators(asStr(args.valueOrText))

      // 阶梯 0（CI4A 语义多态）：目标为单选 / 复选组时，按可访问名精准点选并触发响应式变更，
      // 抹平前端组件形态差异（金智 EMAP / Vue 单选组「无名控件」在 yanhu_select 下亦可直接命中）。
      const ci4a = (await yanhuExpressManager.evalInPage(tabId, buildSemanticOptionClickScript(record, target))) as
        | { ok?: boolean; ci4a?: string; text?: string }
        | null
      if (ci4a?.ok === true && ci4a.ci4a === 'radio') {
        await settleAfterAction(tabId)
        yanhuDomDistillationEngine.markDirty(tabId)
        markInteraction()
        return {
          content: withNextFields(
            tabId,
            bid,
            `已选择 [BID: ${bid}] "${record.name}" -> ${ci4a.text ?? target}（CI4A 语义单选匹配，已自动触发响应式变更）。`,
          ),
        }
      }

      // 第一阶梯（确定性）：原生 <select> 直接赋值
      const native = (await yanhuExpressManager.evalInPage(tabId, buildNativeSelectScript(record, target))) as
        | {
            ok?: boolean
            reason?: string
            isNativeSelect?: boolean
            tag?: string
            options?: string[]
          }
        | null
      if (!native) {
        return { content: `选择失败：未能在页面中定位到 [BID: ${bid}]。`, isError: true }
      }
      if (native.ok === true) {
        await settleAfterAction(tabId)
        yanhuDomDistillationEngine.markDirty(tabId)
        markInteraction()
        return { content: withNextFields(tabId, bid, `已选择 [BID: ${bid}] "${record.name}" -> ${target}（原生下拉）。`) }
      }
      if (native.reason === 'not-found') {
        return { content: `选择失败：未能在页面中定位到 [BID: ${bid}]。`, isError: true }
      }
      if (native.reason === 'option-not-found' && native.isNativeSelect === true) {
        // 代码直接给出真实可用选项清单，模型无需盲试其它 BID
        const list = (native.options ?? []).slice(0, 20).join(' / ')
        return {
          content: `选择失败：[BID: ${bid}] 原生下拉中不存在选项「${target}」。可用选项：${list || '（无）'}。`,
          isError: true,
        }
      }

      // 第二阶梯（核心新增）：JQWidgets / EMAP 专属 API 极速通道
      // 金智 EMAP 基于 jQuery + JQWidgets，getItems() / selectIndex() 为原生权威 API。
      // 零动画等待、免浮层定位，率先命中即返回，避免后续不可靠的 DOM 猜测。
      if (native.reason === "not-native-select") {
        const jqxResult = (await yanhuExpressManager.evalInPage(tabId, buildJqxSelectScript(record, target))) as
          | { ok?: boolean; text?: string; via?: string }
          | null
        // 必须以脚本显式回传的「jqx-api」成功标记为准，杜绝任何泛化 { ok: true } 被误判为命中
        if (jqxResult?.ok === true && jqxResult.via === 'jqx-api') {
          await settleAfterAction(tabId)
          yanhuDomDistillationEngine.markDirty(tabId)
          markInteraction()
          return {
            content: withNextFields(
              tabId,
              bid,
              `已选择 [BID: ${bid}] "${record.name}" -> ${jqxResult.text ?? target}（JQWidgets 专属极速通道，已自动同步值并触发级联）。`,
            ),
          }
        }

        // 阶梯 2.5：EMAP / JQWidgets **树形 / 级联**选择器专属 API 极速通道。
        // 「出校去向」这类控件是 jqxDropDownButton + jqxTree，不属 jqxDropDownList，上面的通道覆盖不到；
        // 直接走控件原生 API 后同步隐藏域与 emapForm 模型，确定性完成，不再退化到脆弱的 DOM 点选。
        // 点选前先记录目标控件的显示文本，供「选中后校验」使用（见下方 isSelectionApplied）。
        const beforeState = await readSelectionState(tabId, record)
        const runTreeChannel = async () =>
          (await yanhuExpressManager.evalInPage(tabId, buildEmapTreeSelectScript(record, target))) as
            | { ok?: boolean; text?: string; via?: string; reason?: string }
            | null
        let treeResult = await runTreeChannel()
        let panelOpened = false
        if (treeResult?.ok !== true || treeResult.via !== 'emap-tree-api') {
          // 树控件通常**在被展开时才初始化**（EMAP 懒加载），因此点开面板后再试一次。
          await yanhuExpressManager.evalInPage(tabId, buildOpenDropdownScript(record))
          await settleAfterAction(tabId)
          panelOpened = true
          treeResult = await runTreeChannel()
        }
        if (treeResult?.ok === true && treeResult.via === 'emap-tree-api') {
          await settleAfterAction(tabId)
          const treeText = treeResult.text ?? target
          const treeAfterState = await readSelectionState(tabId, record)
          if (isSelectionApplied(beforeState, treeAfterState, treeText)) {
            yanhuDomDistillationEngine.markDirty(tabId)
            markInteraction()
            return {
              content: withNextFields(
                tabId,
                bid,
                `已选择 [BID: ${bid}] "${record.name}" -> ${treeText}（EMAP/JQWidgets 树形极速通道，已同步隐藏域与表单模型并触发级联）。`,
              ),
            }
          }
        }

        // 第三阶梯（确定性降级）：自定义下拉 -> 单次展开 -> 面板内精确点击。
        // 注意：面板若已在阶梯 2.5 点开，这里**绝不能重复点击**——重复点击会把面板收起，
        // 后面就什么选项也点不到了。
        if (!panelOpened) {
          await yanhuExpressManager.evalInPage(tabId, buildOpenDropdownScript(record))
          await settleAfterAction(tabId)
        }
        const picked = (await yanhuExpressManager.evalInPage(tabId, buildPickCustomOptionScript(target))) as
          | { ok?: boolean; text?: string; reason?: string; options?: string[]; x?: number; y?: number }
          | null
        if (picked?.ok === true) {
          await settleAfterAction(tabId)
          const pickedText = picked.text ?? target
          let afterState = await readSelectionState(tabId, record)
          let escalated = false
          if (!isSelectionApplied(beforeState, afterState, pickedText)) {
            // 第二阶梯：合成事件被控件拒绝时，升级为 CDP 硬件级真实点击（与 yanhu_click 同一套思路）。
            // 历史事故：树形 / 级联选择器对 dispatchEvent 完全无反应，而工具一路回报「已选择」。
            if (typeof picked.x === 'number' && typeof picked.y === 'number' && (picked.x !== 0 || picked.y !== 0)) {
              try {
                await yanhuExpressManager.dispatchHumanClick(tabId, picked.x, picked.y, { doubleClick: false })
                escalated = true
                await settleAfterAction(tabId)
                afterState = await readSelectionState(tabId, record)
              } catch {
                escalated = false
              }
            }
          }
          if (!isSelectionApplied(beforeState, afterState, pickedText)) {
            // 关键：点中了「文本相同的元素」≠ 目标控件的值真的被设置。
            // 历史事故：工具连续多轮回报「已选择 -> 香港特别行政区」，而控件显示始终是「请选择...」，
            // 模型据此反复重试、最后撞熔断。宁可如实报错，也绝不谎报成功。
            const digest = await readSubtreeDigest(tabId, record)
            yanhuDomDistillationEngine.markDirty(tabId)
            markInteraction()
            return {
              content:
                `选择失败：[BID: ${bid}] 已点选「${pickedText}」，但目标控件显示未发生变化` +
                `（当前显示："${afterState ?? ''}"）——合成事件与 CDP 硬件级点击均未被该控件接受（树形 / 级联选择器常见）。\n` +
                `请先 yanhu_click 其可见入口，再直接 yanhu_click 面板中的选项行 [BID]。\n` +
                `若面板内同样点不动，请如实告知学生该字段需要在页面上手动选择，不要反复重试同一路径。` +
                (digest ? `\n目标控件结构（诊断参考）：\n${digest}` : ``),
              isError: true,
            }
          }
          yanhuDomDistillationEngine.markDirty(tabId)
          markInteraction()
          const escalateNote = escalated ? `（合成事件未被接受，已自动升级至 CDP 硬件级点击）` : ``
          return {
            content: withNextFields(
              tabId,
              bid,
              `已选择 [BID: ${bid}] "${record.name}" -> ${pickedText}（自定义下拉，已自动展开并点选）${escalateNote}。`,
            ),
          }
        }
        // 失败回执必须自带「已渲染的可用选项」，否则浮层不进 PageDigest 时模型只能靠猜选项名
        // 反复空转（历史故障：连试「武侯区 / 锦江区 / 青羊区」多轮全败，白烧数十万 Token）。
        const rendered = Array.isArray(picked?.options) ? picked.options : []
        if (rendered.length === 0) {
          return {
            content:
              `选择失败：[BID: ${bid}]（${native.tag || 'element'}）不是原生下拉，且其下拉面板没有渲染出任何可选项——` +
              `通常是「面板未真正展开」或「上一级级联尚未生效」。请先用 yanhu_click 打开该控件，` +
              `或先确认上一级（如 省 / 市）已真正选中后，再重试 yanhu_select；不要盲目猜选项名。`,
            isError: true,
          }
        }
        return {
          content:
            `选择失败：[BID: ${bid}] 不是原生下拉，其面板中也没有「${target}」。` +
            `已渲染的可用选项（共 ${rendered.length} 项）：${rendered.join(' / ')}。` +
            `请从上述选项中选择一个作为 valueOrText 重试（若其中某项已带 [BID]，也可直接 yanhu_click）。`,
          isError: true,
        }
      }
      return { content: `选择失败：[BID: ${bid}] 无法完成选择。`, isError: true }
    },
  })

// 6. yanhu_scroll — 滚动
  tools.push({
    definition: {
      name: 'yanhu_scroll',
      description: `平滑滚动当前页面视口。`,
      parameters: {
        type: 'object',
        properties: {
          direction: { type: 'string', enum: ['up', 'down', 'top', 'bottom'], description: '滚动方向' },
          distance: { type: 'number', description: '滚动距离（像素，默认一个视口高度）' },
        },
        required: ['direction'],
      },
    },
    label: (args) => `🖱 滚动页面（${asStr(args.direction, 'down')}）`,
    execute: async (args) => {
      const tabId = tabResolver()
      const direction = asStr(args.direction, 'down')
      const distance = asInt(args.distance, 0)
      const script = `(() => {
        let targetWin = window;
        let targetDoc = document;
        try {
          const mf = document.querySelector('frame[name="mainFrame"], iframe[name="mainFrame"], frame#mainFrame, iframe#mainFrame');
          if (mf) {
            // 三级鲁棒穿透：contentWindow -> window.frames[name] -> 原 window 兜底
            const frameWin = mf.contentWindow;
            targetWin = frameWin || (window.frames && window.frames['mainFrame']) || targetWin;
            targetDoc = mf.contentDocument || (frameWin && frameWin.document) || (targetWin && targetWin.document) || targetDoc;
          } else if (window.frames && window.frames['mainFrame']) {
            targetWin = window.frames['mainFrame'];
            targetDoc = targetWin.document || targetDoc;
          }
        } catch (e) {}

        const h = targetWin.innerHeight || 800;
        const d = ${distance} > 0 ? ${distance} : h;
        const dir = ${JSON.stringify(direction)};
        const root = targetDoc.body || targetDoc.documentElement;
        const maxScroll = root ? root.scrollHeight : 999999;

        if (dir === 'top') targetWin.scrollTo({ top: 0, behavior: 'smooth' });
        else if (dir === 'bottom') targetWin.scrollTo({ top: maxScroll, behavior: 'smooth' });
        else if (dir === 'up') targetWin.scrollBy({ top: -d, behavior: 'smooth' });
        else targetWin.scrollBy({ top: d, behavior: 'smooth' });

        return { ok: true, y: Math.round(targetWin.scrollY || 0) };
      })()`
      await yanhuExpressManager.evalInPage(tabId, script)
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      return { content: `页面已向${direction}滚动，请再次调用 yanhu_read_page 观察新内容。` }
    },
  })

  // 7. yanhu_navigate — 导航
  tools.push({
    definition: {
      name: 'yanhu_navigate',
      description: `在当前标签导航到指定 URL。支持任意 http/https 网站；仅非网页协议（mailto / javascript / file 等）会被拦截。`,
      parameters: {
        type: 'object',
        properties: { url: { type: 'string', description: '目标 URL' } },
        required: ['url'],
      },
    },
    label: (args) => `🧭 导航：${asStr(args.url)}`,
    execute: async (args) => {
      const tabId = tabResolver()
      const url = stripDecorators(asStr(args.url), URL_DECORATORS)
      if (!url) return { content: `导航失败：URL 为空。`, isError: true }
      // 网络导航级操作
      await enforceYanhuHumanInterval()

      // 多层框架智能承接
      const meta = yanhuExpressManager.getTabMeta(tabId)
      const currentUrl = meta?.url || ''
      if (
        // 教务主框架内路由仅对校内地址生效：框架内 location.assign 属于子框架导航，不经过 will-navigate
        // 顶层守卫
        isCdutDomain(url) &&
        currentUrl.includes('/jsxsd/framework/xsMainV') &&
        !url.includes('/jsxsd/framework/xsMainV') &&
        (url.includes('/jsxsd/') || url.endsWith('.do') || url.endsWith('.htmlx'))
      ) {
        const routeScript = `(() => {
          try {
            const mf = document.querySelector('frame[name="mainFrame"], iframe[name="mainFrame"], frame#mainFrame, iframe#mainFrame');
            if (mf) {
              const fw = mf.contentWindow || (window.frames && window.frames['mainFrame']);
              if (fw && fw.location) {
                fw.location.assign(${JSON.stringify(url)});
                return { ok: true, redirectedInFrame: true };
              }
            }
          } catch (e) {}
          return { ok: false };
        })()`
        let routeOk = false
        try {
          const routeResult = (await yanhuExpressManager.evalInPage(tabId, routeScript)) as { ok?: boolean } | null
          routeOk = routeResult?.ok === true
        } catch {
          routeOk = false
        }
        if (routeOk) {
          yanhuDomDistillationEngine.markDirty(tabId)
          markInteraction()
          await yanhuExpressManager.waitForIdle(tabId, 8000)
          return { content: `已在教务主框架 mainFrame 内平滑载入目标页面：${url}（外层导航框架完整保持）。请调用 yanhu_read_page 观察结果。` }
        }
        return {
          content:
            `【拦截提示】当前页面为多层嵌套框架系统（教务主框架 xsMainV 等），包含 leftFrame 导航与 mainFrame 核心内容区。内部功能页面均在 IFrame / Frame 中加载。` +
            `若强行跳转会导致框架撕裂。您应当直接点击页面上的 [BID] 菜单项来进入对应功能。\n`,
          isError: true,
        }
      }

      yanhuExpressManager.navigate({ tabId, url })
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      await yanhuExpressManager.waitForIdle(tabId, 8000)
      const afterMeta = yanhuExpressManager.getTabMeta(tabId)
      if (afterMeta && isYanhuBlockedUrl(afterMeta.url)) {
        return { content: `导航被安全网关拦截：${url} 不是可访问的 http/https 网页地址。`, isError: true }
      }
      return { content: `已导航至 ${url}（当前：${afterMeta?.url ?? url}）。` }
    },
  })

  // 8-10. 后退 / 前进 / 刷新
  tools.push({
    definition: { name: "yanhu_go_back", description: "返回上一页。", parameters: { type: "object", properties: {} } },
    label: () => `◀ 返回上一页`,
    execute: async () => {
      const tabId = tabResolver()
      yanhuExpressManager.goBack(tabId)
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      await yanhuExpressManager.waitForIdle(tabId)
      return { content: `已返回上一页。` }
    },
  })
  tools.push({
    definition: { name: "yanhu_go_forward", description: "前进到下一页。", parameters: { type: "object", properties: {} } },
    label: () => `▶ 前进下一页`,
    execute: async () => {
      const tabId = tabResolver()
      yanhuExpressManager.goForward(tabId)
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      await yanhuExpressManager.waitForIdle(tabId)
      return { content: `已前进到下一页。` }
    },
  })
  tools.push({
    definition: { name: "yanhu_reload", description: "刷新当前页面。", parameters: { type: "object", properties: {} } },
    label: () => '🔄 刷新页面',
    execute: async () => {
      const tabId = tabResolver()
      // 网络导航级操作
      await enforceYanhuHumanInterval()
      // 一次性 SSO 票据净化刷新（白屏根除红线）：带 ticket / qzticket 的地址严禁走 reload——
      // 票据净化
      const liveUrl = yanhuExpressManager.getTabLiveUrl(tabId) || yanhuExpressManager.getTabMeta(tabId)?.url || ''
      if (hasOneTimeTicket(liveUrl)) {
        const cleanUrl = stripOneTimeTicket(liveUrl)
        logYanhuEvent('reload', { tabId, url: liveUrl, reason: 'tool-ticket-sanitized' })
        await yanhuExpressManager.loadUrl(tabId, cleanUrl)
        yanhuDomDistillationEngine.markDirty(tabId)
        markInteraction()
        await yanhuExpressManager.waitForIdle(tabId, 8000)
        return { content: `页面已通过安全净化地址刷新（已剥离一次性 SSO 票据，防止白屏）。` }
      }
      // 框架页智能刷新保护：教务主框架 xsMainV 下不执行破坏性全局重载。
      // 仅重载核心内容区（mainFrame），保护外层导航框架与会话不丢失。
      if (liveUrl.includes('xsMainV')) {
        const result = (await yanhuExpressManager.evalInPage(tabId, buildMainFrameReloadScript())) as
          | { ok?: boolean }
          | null
        if (result && result.ok === true) {
          logYanhuEvent('reload', { tabId, url: liveUrl, reason: 'tool-mainframe' })
          yanhuDomDistillationEngine.markDirty(tabId)
          markInteraction()
          await yanhuExpressManager.waitForIdle(tabId, 8000)
          return { content: `已刷新核心内容区（mainFrame），外层教务导航框架已保护。` }
        }
      }
      yanhuExpressManager.reload(tabId, 'tool')
      yanhuDomDistillationEngine.markDirty(tabId)
      markInteraction()
      await yanhuExpressManager.waitForIdle(tabId, 8000)
      return { content: `页面已刷新。` }
    },
  })

  // 11. yanhu_eval_script【开发者级】
  tools.push({
    developer: true,
    definition: {
      name: 'yanhu_eval_script',
      description:
        `【开发者级】在当前页面主上下文中执行 JavaScript 表达式并返回结果。仅当没有任何 yanhu_* 工具能完成任务时作为最后的保底手段使用。`,
      parameters: {
        type: 'object',
        properties: { expression: { type: "string", description: "要执行的 JS 表达式" } },
        required: ['expression'],
      },
    },
    label: () => '⚡ 执行页面脚本',
    execute: async (args) => {
      // 参数别名容错：模型偶尔会用 script / code / js 代替规范名 expression（工具入参属系统边界，需容错）
      const expression = asStr(args.expression) || asStr(args.script) || asStr(args.code) || asStr(args.js)
      if (!expression) return { content: `执行失败：表达式为空。`, isError: true }
      try {
        const value = await yanhuExpressManager.evalInPage(tabResolver(), expression)
        let serialized: string
        try {
          // 注意：JSON.stringify(undefined) 运行时返回 undefined（TS 签名却声明为 string），
          // 无返回值表达式兜底
          serialized = value === undefined ? 'undefined' : JSON.stringify(value, null, 2)
          if (typeof serialized !== 'string') serialized = String(serialized)
        } catch {
          serialized = String(value)
        }
        if (serialized.length > EVAL_SCRIPT_MAX_CHARS) {
          serialized = `${serialized.slice(0, EVAL_SCRIPT_MAX_CHARS)}\n…（已按 token 预算截断）`
        }
        return { content: `脚本执行结果：\n${serialized}` }
      } catch (err) {
        return { content: `脚本执行异常：${err instanceof Error ? err.message : String(err)}`, isError: true }
      }
    },
  })

  // 12. yanhu_inspect_element【开发者级】
  tools.push({
    developer: true,
    definition: {
      name: "yanhu_inspect_element",
      description: `【开发者级】输出指定 [BID] 对应 DOM 节点的 outerHTML、盒模型边界与关键计算样式。`,
      parameters: {
        type: "object",
        properties: { bid: { type: "number", description: "目标控件的 BID" } },
        required: ["bid"],
      },
    },
    label: (args) => `🔍 检查 [${asInt(args.bid)}]`,
    execute: async (args) => {
      const tabId = tabResolver()
      const record = requireBid(tabId, asInt(args.bid))
      const script = `(() => {
        ${buildFinderPrelude(record, { relaxed: finderRelaxed(record) })}
        const el = __find();
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          html: (el.outerHTML || '').replace(/data:[^"']{80,}/g, 'data:…').slice(0, ${INSPECT_HTML_MAX_CHARS}),
          rect: { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) },
          style: {
            display: style.display, visibility: style.visibility, position: style.position,
            zIndex: style.zIndex, color: style.color, backgroundColor: style.backgroundColor,
            pointerEvents: style.pointerEvents,
          },
        };
      })()`
      const result = await yanhuExpressManager.evalInPage(tabId, script)
      if (!result) return { content: `未能在页面中定位 [BID: ${record.bid}]。`, isError: true }
      const text = JSON.stringify(result, null, 2)
      return {
        content:
          text.length > INSPECT_OUTPUT_MAX_CHARS
            ? `${text.slice(0, INSPECT_OUTPUT_MAX_CHARS)}\n…（已按 token 预算截断）`
            : text,
      }
    },
  })

  // 13. yanhu_get_network_logs【开发者级】
  tools.push({
    developer: true,
    definition: {
      name: "yanhu_get_network_logs",
      description: `【开发者级】读取页面最近捕获的 HTTP 报文流（URL、状态码、耗时、方法）。`,
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "返回条数上限（默认 30）" },
          filterRegex: { type: "string", description: "按 URL 过滤的正则" },
        },
      },
    },
    label: () => '📡 读取网络日志',
    execute: async (args) => {
      // 显式 limit=0 应视为「未指定」回落到默认 30；负数同样回落，避免 slice 语义异常
      const requestedLimit = asInt(args.limit, 0)
      const limit = requestedLimit > 0 ? requestedLimit : 30
      const entries = yanhuExpressManager.cdpGetNetworkLogs(tabResolver(), asStr(args.filterRegex) || undefined)
      return { content: sanitizeYanhuNetworkLogs(entries, { maxLines: limit }) }
    },
  })

  // 14. yanhu_get_console_logs【开发者级】
  tools.push({
    developer: true,
    definition: {
      name: "yanhu_get_console_logs",
      description: `【开发者级】读取页面捕获的原生 console 输出与 JS 运行时异常日志。`,
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "返回条数上限（默认 50）" },
          level: { type: "string", description: "日志级别（error, warning, info 等）" },
        },
      },
    },
    label: () => `🖥 读取控制台日志`,
    execute: async (args) => {
      const entries = yanhuExpressManager.cdpGetConsoleLogs(tabResolver())
      const level = asStr(args.level)
      const filtered = level ? entries.filter((e) => e.type === level) : entries
      const sliced = filtered.slice(-50)
      if (sliced.length === 0) return { content: '暂无控制台日志。' }
      return { content: sliced.map((e) => `[${e.type}] ${e.text}`).join('\n') }
    },
  })

  // 15. yanhu_tab_actions —。标签拓扑
  tools.push({
    definition: {
      name: 'yanhu_tab_actions',
      description: '管理智联万站内的标签：新建、关闭或切换标签。',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['create', 'close', 'switch'], description: '操作类型' },
          url: { type: 'string', description: '新建标签时的目标 URL' },
          tabId: { type: 'string', description: '关闭 / 切换标签时的目标标签 ID' },
        },
        required: ['action'],
      },
    },
    label: (args) => `🗂 标签操作（${asStr(args.action)}）`,
    execute: async (args) => {
      const action = asStr(args.action)
      if (action === 'create') {
        const targetUrl = stripDecorators(asStr(args.url), URL_DECORATORS)
        // 确定性去重：已存在完全相同 URL 的标签时直接激活它，绝不重复新建。
        if (targetUrl) {
          const existing = yanhuExpressManager.getTabsState().tabs.find((tab) => tab.url === targetUrl)
          if (existing) {
            const state = yanhuExpressManager.activateTab(existing.id)
            return {
              content: `已存在相同页面的标签（${existing.id}），已切换过去，未重复新建。当前激活：${state.activeTabId}。`,
            }
          }
        }
        const state = yanhuExpressManager.createTab({ url: targetUrl || undefined, activate: true })
        return { content: `已新建标签，当前。${state.tabs.length} 个标签，激活：${state.activeTabId}。` }
      }
      const tabId = asStr(args.tabId) || tabResolver()
      if (action === 'close') {
        // 显式指定了不存在的标签时给出明确错误，避免误导模型已成功关闭
        if (!yanhuExpressManager.getTabMeta(tabId)) {
          return { content: `未找到标签 ${tabId}，无法关闭。`, isError: true }
        }
        const state = yanhuExpressManager.closeTab(tabId)
        return { content: `已关闭标签 ${tabId}，剩。${state.tabs.length} 个。` }
      }
      if (action === 'switch') {
        if (!yanhuExpressManager.getTabMeta(tabId)) {
          return { content: `未找到标签 ${tabId}，无法切换。`, isError: true }
        }
        const state = yanhuExpressManager.activateTab(tabId)
        return { content: `已切换到标签 ${state.activeTabId}。` }
      }
      return { content: `未知标签操作：${action}`, isError: true }
    },
  })

  // 15/16. 视觉截图辅助感知工具（仅当用户在设置中开启 enableVision 时才向模型挂载）
  if (options.enableVision) {
    // 16. yanhu_capture_visual — 截取视口并建立双平面标定
    tools.push({
      definition: {
        name: 'yanhu_capture_visual',
        description:
          '截取当前网页视口，建立「视觉图像平面 ↔ DOM 物理平面」双平面平行坐标标定，返回 4~8 个地标基准点的坐标对照表（供 yanhu_click_visual 换算）。当页面包含复杂图形 / 验证码 / Canvas 排课表，或 PageDigest 返回大量 [Occluded]、文本极度稀疏、无法用 [BID] 定位时调用。截图本身只用于界面预览，不进入对话上下文（需要把截图一并交给模型核对时，显式传 includeImage=true）。',
        parameters: {
          type: 'object',
          properties: {
            includeImage: {
              type: 'boolean',
              description: '是否在结果中附带视口截图 Base64（默认 false，仅返回地标标定块以节省上下文）',
            },
          },
        },
      },
      label: () => '👁 视觉截图与坐标标定',
      execute: async (args) => {
        const tabId = tabResolver()
        const captured = await captureVisualSnapshot(tabId)
        if (!captured) {
          return { content: '截图失败：当前标签无可用视口（可能已休眠或正在加载中）。', isError: true }
        }
        const base = formatVisualSnapshot(captured.snapshot)
        if (args.includeImage === true) {
          return { content: `${base}\n\n[视口截图 dataURL]\n${captured.dataUrl}` }
        }
        return { content: base }
      },
    })

    // 17. yanhu_click_visual — 视觉归一化坐标精确点击（含 DOM 磁吸对齐）
    tools.push({
      definition: {
        name: 'yanhu_click_visual',
        description:
          '按视觉归一化坐标 u,v ∈ [0,1000]² 精确点击页面上无法通过 [BID] 定位的图形 / Canvas / 纯图片 / 验证码区域。坐标由 yanhu_capture_visual 的标定快照经单应性矩阵映射为 DOM DIP 坐标，并自动做半径 12px 的 DOM 磁吸对齐后派发物理点击。',
        parameters: {
          type: 'object',
          properties: {
            u: { type: 'number', description: '视觉归一化横坐标（0~1000）' },
            v: { type: 'number', description: '视觉归一化纵坐标（0~1000）' },
          },
          required: ['u', 'v'],
        },
      },
      label: (args) => `👆 视觉点击 (${asInt(args.u, 0)}, ${asInt(args.v, 0)})`,
      execute: async (args) => {
        const tabId = tabResolver()
        const snapshot = getVisualSnapshot(tabId)
        if (!snapshot) {
          return {
            content: '尚未建立视觉标定：请先调用 yanhu_capture_visual 截屏并建立地标对照。',
            isError: true,
          }
        }
        const rawU = asInt(args.u, -1)
        const rawV = asInt(args.v, -1)
        if (rawU < 0 || rawU > 1000 || rawV < 0 || rawV > 1000) {
          return { content: '参数 u / v 必须为 0~1000 的整数（视觉归一化坐标）。', isError: true }
        }
        const dip = visualToDip(snapshot, rawU, rawV)
        // DOM 磁吸对齐：半径 ε 内探测真实 DOM 并吸附到可交互控件几何中心
        let targetX = dip.x
        let targetY = dip.y
        let hitTag = ''
        let hitName = ''
        let snapped = false
        try {
          const res = (await yanhuExpressManager.evalInPage(
            tabId,
            buildVisualSnapScript(dip.x, dip.y, VISUAL_SNAP_RADIUS_PX),
          )) as { ok?: boolean; x?: number; y?: number; snapped?: boolean; hit?: { tag?: string; name?: string } | null } | null
          if (res && res.ok) {
            if (typeof res.x === 'number' && typeof res.y === 'number') {
              targetX = res.x
              targetY = res.y
            }
            snapped = res.snapped === true
            if (res.hit) {
              hitTag = res.hit.tag ?? ''
              hitName = res.hit.name ?? ''
            }
          }
        } catch {
          /* 磁吸失败退回原始 DIP 坐标 */
        }
        await enforceYanhuHumanInterval(true)
        await yanhuExpressManager.dispatchHumanClick(tabId, Math.round(targetX), Math.round(targetY))
        yanhuDomDistillationEngine.markDirty(tabId)
        markInteraction()
        const pixel = visualToPixel(snapshot, rawU, rawV)
        const hitText = hitTag ? `，吸附命中 <${hitTag}>${hitName ? `「${hitName}」` : ''}` : ''
        return {
          content: `已执行视觉点击：视觉(${rawU},${rawV}) ≈ 像素(${pixel.x},${pixel.y}) → DIP(${Math.round(targetX)},${Math.round(targetY)})${snapped ? '（已 DOM 磁吸对齐）' : ''}${hitText}。请调用 yanhu_read_page 验证结果。`,
        }
      },
    })
  }

  // 统一错误兜底：任何非 read_page 的工具一旦执行出错立即释放读屏熔断
  const markToolError = (): void => {
    unchangedBreakerTabId = null
  }
  for (const tool of tools) {
    if (tool.definition.name === 'yanhu_read_page') continue
    const originalExecute = tool.execute
    tool.execute = async (args) => {
      try {
        const result = await originalExecute(args)
        if (result.isError) markToolError()
        return result
      } catch (err) {
        // 异常路径同样释放熔断：requireBid / evalInPage 等抛出异常时，若不释放会导致
        // read_page 死锁兜底
        markToolError()
        throw err
      }
    }
  }

  return tools
}

/** 工具执行后的胶囊标签生成器（供运行时生成微胶囊标签） */
export function createYanhuToolLabeler(
  tools: readonly YanhuBrowserTool[],
): (toolName: string, args: Record<string, unknown>) => string {
  const index = new Map(tools.map((tool) => [tool.definition.name, tool]))
  return (toolName, args) => {
    const tool = index.get(toolName)
    return tool ? tool.label(args) : toolName
  }
}


