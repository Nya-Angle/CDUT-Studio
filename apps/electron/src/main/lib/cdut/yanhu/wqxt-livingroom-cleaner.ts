/**
 * AI 问渠学堂 · 课堂教学页净化脚本（纯模块，零外部依赖）
 *
 * 该模块由两处消费：
 *   1. `yanhu-preload.ts`：在 document-start 最早时序注入主世界，防首帧闪烁；
 *   2. `yanhu-express-manager.ts`：`dom-ready` / 导航落地后补偿注入，覆盖 SPA 路由切换。
 *
 * 设计红线：
 *   - **零外部特权导入**（不 import `electron`，也不 import `@profer/shared`）。Preload 由独立的
 *     `build:yanhu-preload` esbuild 命令打包，任何外部导入都会把无关代码卷入 `dist/yanhu-preload.cjs`；
 *     唯一允许的内部依赖是同目录的 `wqxt-livingroom-upgrader`（其自身仅内联 Base64 常量）；
 *   - 只物理移除指定节点本身，绝不删除其父容器；
 *   - 全程 try/catch 兜底，绝不因注入失败影响页面加载。
 */

import { buildWqxtUpgradeRuntimeScript } from './wqxt-livingroom-upgrader'

/** AI 问渠学堂课堂域名（与 @profer/shared 的 WQXT_CLASSROOM_HOSTNAME 保持一致） */
export const WQXT_CLEANER_HOSTNAME = 'classroom.wqxt.cdut.edu.cn'

/** 课堂教学页注入样式节点 ID */
export const WQXT_LIVINGROOM_STYLE_ID = '__profer-wqxt-livingroom-css'

/**
 * 课堂教学页必须完全屏蔽的 7 类目标节点（严格命中目标节点本身，不删父容器）。
 *
 * 第 5、6 项为并列选择器：
 *   - `p.list_title[data-v-623bb81c]` 是「猜你喜欢」标题（`prune()` 另有文本兜底）；
 *   - `div.items-wrapper[data-v-623bb81c]` 是右侧推荐课程列表项容器（仅移除该节点）；
 *   - `.cmc-base.cmc-expand` 为平铺水印层，连同其 `.expand-mask` 子树整体移除。
 *
 * 第 7 项为「问题反馈」悬浮按钮（`div.feedback-wrapper`），三种变体合并且仅移除节点本身。
 */
export const WQXT_LIVINGROOM_HIDE_SELECTORS: readonly string[] = [
  'div.header-wrapper-cdlg',
  'div.relative-info-left',
  'div.custom-footer',
  'div.another-course-wrapper',
  'p.list_title[data-v-623bb81c], p.list_title:has(+ div.items-wrapper), div.items-wrapper[data-v-623bb81c], :not(.another-course-wrapper) > div.items-wrapper:has(> .item > .image-wrapper > img.course_img)',
  'div.cmc-base.cmc-expand:has(> .expand-mask), div.cmc-base.cmc-expand > .expand-mask, div.expand-mask[style*="/pptnote/v1/get/course/watermark"]',
  'div.feedback-wrapper, div.feedback-wrapper[data-v-7689e353], div.feedback-wrapper[title="问题反馈"]',
]

/** 判定网络请求是否为课堂教学页平铺水印资源（`/pptnote/v1/get/course/watermark`） */
export function isWqxtWatermarkRequestUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  try {
    const parsed = new URL(rawUrl)
    if (parsed.hostname.toLowerCase() !== WQXT_CLEANER_HOSTNAME) return false
    return parsed.pathname.includes('/pptnote/v1/get/course/watermark')
  } catch {
    return false
  }
}

/**
 * 构建课堂教学页净化脚本源码字符串。
 *
 * 关键工程约束：
 *   1. **hostname 命中即初始化**：即便首次停留在课堂选择页，也立即挂载 `MutationObserver` 与
 *      History / popstate / hashchange 钩子；SPA 内跳转教学页时同帧完成拦截，无 1~2 帧闪现。
 *   2. **防死循环**：`ensureStyle()` 要求已存在即 return，绝不重复改写 `<style>` 的 textContent
 *      （改写文本子节点本身会触发 childList 变更，导致 Observer 微任务级死循环）；`prune()`
 *      仅在 querySelectorAll 实际命中节点时才写 DOM。
 *   3. 切回课堂选择页时移除注入样式，且仅在本次文档内确实物理移除过节点时执行一次 reload，
 *      恢复被移除的选课顶栏；reload 后脚本状态归零，不存在刷新循环。
 */
export function buildWqxtLivingRoomCleanerScript(): string {
  const selectorsJson = JSON.stringify(WQXT_LIVINGROOM_HIDE_SELECTORS)
  // 升级器先于净化器执行：`refresh()` 内可直接调用 `sync()`；二次注入命中早退分支时，
  // 前置的升级器 IIFE 仍会幂等刷新 UI，不会因 `__proferWqxtCleaner` 已存在而失效。
  return `${buildWqxtUpgradeRuntimeScript()}
;(function () {
  'use strict';
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (location.hostname.toLowerCase() !== ${JSON.stringify(WQXT_CLEANER_HOSTNAME)}) return;

    var CSS_ID = ${JSON.stringify(WQXT_LIVINGROOM_STYLE_ID)};
    var SELECTORS = ${selectorsJson};
    var CSS_TEXT = SELECTORS.join(',') + '{display:none !important;visibility:hidden !important;pointer-events:none !important;}';

    var existing = window.__proferWqxtCleaner;
    if (existing && typeof existing.refresh === 'function') {
      existing.refresh();
      return;
    }

    var everCleaned = false;
    var observer = null;

    function isLivingRoom() {
      var path = location.pathname.replace(/\\/+$/, '');
      var hash = location.hash || '';
      var hashPath = hash.replace(/^#\\/?/, '').split('?')[0].replace(/\\/+$/, '');
      if (path !== '/livingroom' && hashPath !== 'livingroom') return false;
      var query = location.search || (hash.indexOf('?') === -1 ? '' : hash.slice(hash.indexOf('?')));
      return /[?&]course_id=\\d+/i.test(query);
    }

    /** 幂等：已存在绝不重写 textContent，避免自触发 MutationObserver 死循环 */
    function ensureStyle() {
      if (document.getElementById(CSS_ID)) return;
      var parent = document.head || document.documentElement;
      if (!parent) return;
      var style = document.createElement('style');
      style.id = CSS_ID;
      style.textContent = CSS_TEXT;
      parent.appendChild(style);
    }

    function removeStyle() {
      var style = document.getElementById(CSS_ID);
      if (style && style.parentNode) style.parentNode.removeChild(style);
    }

    /** 「猜你喜欢」标题兜底：结构选择器命不中时，按 Vue 作用域属性或文本物理移除该 <p> */
    function pruneGuessTitles() {
      var titles;
      try { titles = document.querySelectorAll('p.list_title'); } catch (e) { return; }
      for (var i = 0; i < titles.length; i++) {
        var title = titles[i];
        if (!title || !title.parentNode) continue;
        var text = (title.textContent || '').trim();
        if (!title.hasAttribute('data-v-623bb81c') && text !== '猜你喜欢') continue;
        try {
          title.remove();
        } catch (e) {
          try { title.parentNode.removeChild(title); } catch (e2) {}
        }
        everCleaned = true;
      }
    }

    /** 仅在命中节点时写 DOM；严格删除节点本身，保留父容器 */
    function prune() {
      for (var i = 0; i < SELECTORS.length; i++) {
        var nodes;
        try { nodes = document.querySelectorAll(SELECTORS[i]); } catch (e) { continue; }
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (!node || !node.parentNode) continue;
          try {
            node.remove();
          } catch (e) {
            try { node.parentNode.removeChild(node); } catch (e2) {}
          }
          everCleaned = true;
        }
      }
      pruneGuessTitles();
    }

    function refresh() {
      if (isLivingRoom()) {
        ensureStyle();
        prune();
        try {
          if (window.__proferWqxtUpgrader) window.__proferWqxtUpgrader.sync();
        } catch (e) {}
        return;
      }
      try {
        if (window.__proferWqxtUpgrader) window.__proferWqxtUpgrader.destroy();
      } catch (e) {}
      removeStyle();
      if (everCleaned) {
        // 一次性轻刷新：被物理移除的选课顶栏由站点重新渲染；reload 后脚本状态归零
        everCleaned = false;
        try { location.reload(); } catch (e) {}
      }
    }

    try {
      observer = new MutationObserver(function () { refresh(); });
      observer.observe(document, { childList: true, subtree: true, characterData: true });
    } catch (e) {
      observer = null;
    }

    // History 路由钩子：SPA pushState / replaceState 后同步刷新；仅包装一次并原样转发参数与返回值
    try {
      var wrapHistory = function (key) {
        var original = history[key];
        if (typeof original !== 'function' || original.__proferWqxtWrapped) return;
        var wrapped = function () {
          var result = original.apply(this, arguments);
          refresh();
          return result;
        };
        wrapped.__proferWqxtWrapped = true;
        history[key] = wrapped;
      };
      wrapHistory('pushState');
      wrapHistory('replaceState');
    } catch (e) {}

    try { window.addEventListener('popstate', refresh, true); } catch (e) {}
    try { window.addEventListener('hashchange', refresh, true); } catch (e) {}

    window.__proferWqxtCleaner = {
      refresh: refresh,
      prune: prune,
      disconnect: function () {
        if (observer) observer.disconnect();
        removeStyle();
      }
    };

    refresh();
  } catch (e) {}
})();`
}
