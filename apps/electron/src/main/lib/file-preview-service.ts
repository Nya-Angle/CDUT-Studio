/**
 * 文件预览服务 — 内联预览支持
 *
 * 提供文件路径解析、PDF 预览 HTML 生成、DOCX 转 HTML 等功能，
 * 供 PreviewPanel 内联面板使用。
 */

import { basename, join, dirname, extname, resolve } from 'node:path'
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { createHash } from 'node:crypto'
import type { OfficePreviewResult } from '@profer/shared'
import { parseOfficeBuffer } from '@profer/core/office-engine'
import { getConfigDir } from './config-paths'
const PDFJS_PACKAGE = 'pdfjs-dist'

/** 文件大小限制：50MB */
const MAX_FILE_SIZE = 50 * 1024 * 1024

// ─── 临时文件 ───

function getPreviewTmpDir(): string {
  const dir = join(tmpdir(), 'profer-preview')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

function writeTempHtml(html: string): string {
  const tmpDir = getPreviewTmpDir()
  const contentHash = createHash('md5').update(html).digest('hex').slice(0, 16)
  const tmpFile = join(tmpDir, `preview-${contentHash}.html`)
  if (!existsSync(tmpFile)) {
    writeFileSync(tmpFile, html, 'utf-8')
  }
  return tmpFile
}

/** 清理所有临时预览文件 */
export function cleanPreviewTmpDir(): number {
  const dir = join(tmpdir(), 'profer-preview')
  if (!existsSync(dir)) return 0
  let count = 0
  try {
    for (const f of readdirSync(dir)) {
      try { unlinkSync(join(dir, f)); count++ } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return count
}

// ─── 路径解析 ───

/** 展开当前用户的 shell 风格 home 缩写；不猜测 ~other-user。 */
export function expandHomeDirectory(filePath: string): string {
  if (filePath === '~') return homedir()
  if (filePath.startsWith('~/') || filePath.startsWith('~\\')) {
    return resolve(homedir(), ...filePath.slice(2).split(/[\\/]+/))
  }
  return filePath
}

/**
 * 在目录中递归搜索指定文件名
 */
function searchFileInDir(dir: string, targetName: string, maxDepth = 8): string | null {
  const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.next', '__pycache__', '.venv', 'build', '.cache', 'target'])
  let scanned = 0
  const MAX_SCANNED = 500

  function walk(current: string, depth: number): string | null {
    if (depth > maxDepth || scanned > MAX_SCANNED) return null
    try {
      const entries = readdirSync(current, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isFile() && entry.name === targetName) {
          return join(current, entry.name)
        }
      }
      for (const entry of entries) {
        if (entry.isDirectory() && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          scanned++
          const found = walk(join(current, entry.name), depth + 1)
          if (found) return found
        }
      }
    } catch { /* permission denied etc */ }
    return null
  }

  return walk(dir, 0)
}

/** 相对路径 fallback 搜索的常用用户目录 */
function searchCommonDirs(filePath: string): string | null {
  const home = homedir()
  const commonDirs = [
    join(home, 'Desktop'),
    join(home, 'Documents'),
    join(home, 'Downloads'),
  ]
  for (const dir of commonDirs) {
    const candidate = resolve(dir, filePath)
    if (existsSync(candidate)) return candidate
  }
  return null
}

// ─── 全局目录收集（相对路径 fallback 用）───

/** 全局搜索目录缓存 */
let _globalSearchDirsCache: { dirs: string[]; ts: number } | null = null
/** 缓存 TTL：30 秒，平衡实时性与性能 */
const GLOBAL_SEARCH_CACHE_TTL = 30_000

/**
 * 收集所有潜在的搜索目录：
 * - 所有工作区的 agent-workspaces 子目录
 * - agent-sessions.json 中所有会话的 attachedDirectories
 *
 * 用于相对路径在 basePaths 中找不到时的全局 fallback 搜索。
 * 结果会缓存 30 秒以避免每次文件路径解析都读取磁盘。
 */
function collectGlobalSearchDirs(): string[] {
  const now = Date.now()
  if (_globalSearchDirsCache && (now - _globalSearchDirsCache.ts) < GLOBAL_SEARCH_CACHE_TTL) {
    return _globalSearchDirsCache.dirs
  }

  const dirs = new Set<string>()

  try {
    const configDir = getConfigDir()

    // 1. 收集所有工作区目录
    const workspacesDir = join(configDir, 'agent-workspaces')
    if (existsSync(workspacesDir)) {
      try {
        for (const wsName of readdirSync(workspacesDir)) {
          const wsPath = join(workspacesDir, wsName)
          try {
            if (statSync(wsPath).isDirectory() && !wsName.startsWith('.')) {
              dirs.add(wsPath)
              // 也收集工作区下的子目录（各个 session 目录）
              for (const sessionDir of readdirSync(wsPath)) {
                const sessionPath = join(wsPath, sessionDir)
                try {
                  if (statSync(sessionPath).isDirectory() && !sessionDir.startsWith('.')) {
                    dirs.add(sessionPath)
                  }
                } catch { /* skip */ }
              }
            }
          } catch { /* skip */ }
        }
      } catch { /* skip */ }
    }

    // 2. 收集 agent-sessions.json 中的 attachedDirectories 和 forkSourceDir
    const indexPath = join(configDir, 'agent-sessions.json')
    if (existsSync(indexPath)) {
      try {
        const raw = readFileSync(indexPath, 'utf-8')
        const index = JSON.parse(raw) as {
          sessions?: Array<{
            attachedDirectories?: string[]
            forkSourceDir?: string
          }>
        }
        for (const session of index.sessions ?? []) {
          if (session.attachedDirectories) {
            for (const d of session.attachedDirectories) {
              if (d && existsSync(d)) dirs.add(d)
            }
          }
          if (session.forkSourceDir && existsSync(session.forkSourceDir)) {
            dirs.add(session.forkSourceDir)
          }
        }
      } catch { /* JSON 解析失败不影响功能 */ }
    }
  } catch { /* 全局搜索目录收集失败时降级为空列表 */ }

  const result = Array.from(dirs)
  _globalSearchDirsCache = { dirs: result, ts: now }
  return result
}

/**
 * 解析待预览的文件路径
 * - 绝对路径：直接 resolve，不存在时 fallback 搜索
 * - 相对路径：依次尝试 basePaths，返回第一个存在的；都不存在则 fallback 搜索
 *
 * opts.skipGlobalSearch=true 时跳过一切同步递归目录搜索（collectGlobalSearchDirs / searchFileInDir），
 * 只做 basePaths 直接拼接、home、常用用户目录的 existsSync 快速判断。
 * 供 FilePathChip 批量预检使用，避免批量 IPC 触发多次同步全局目录遍历阻塞主进程。
 */
export function resolveTargetPath(filePath: string, basePaths?: string[], opts?: { skipGlobalSearch?: boolean }): string {
  const expandedPath = expandHomeDirectory(filePath)
  if (expandedPath.startsWith('/') || /^[A-Za-z]:[\\/]/.test(expandedPath)) {
    const direct = resolve(expandedPath)
    if (existsSync(direct)) return direct
    const name = basename(direct)
    if (!opts?.skipGlobalSearch) {
      if (basePaths) {
        for (const base of basePaths) {
          if (!base) continue
          const found = searchFileInDir(base, name)
          if (found) return found
        }
      }
      const awIdx = expandedPath.indexOf('agent-workspaces')
      if (awIdx !== -1) {
        const wsRoot = expandedPath.slice(0, awIdx + 'agent-workspaces'.length)
        if (existsSync(wsRoot)) {
          const found = searchFileInDir(wsRoot, name)
          if (found) return found
        }
      }
    }
    return direct
  }
  if (basePaths && basePaths.length > 0) {
    const firstSegment = filePath.split('/')[0]
    if (firstSegment) {
      for (const base of basePaths) {
        if (!base) continue
        if (basename(base) === firstSegment) {
          const candidate = resolve(dirname(base), filePath)
          if (existsSync(candidate)) return candidate
        }
      }
    }
    for (const base of basePaths) {
      if (!base) continue
      const candidate = resolve(base, filePath)
      if (existsSync(candidate)) return candidate
    }
    const home = homedir()
    const homeCandidate = resolve(home, filePath)
    if (existsSync(homeCandidate)) return homeCandidate
    // 相对路径在 basePaths 和 home 都找不到时，搜常用用户目录（Desktop/Documents/Downloads）
    const commonFound = searchCommonDirs(filePath)
    if (commonFound) return commonFound
    // 全局 fallback：在所有已知工作区和附加目录中搜索（按文件名，递归 2 层）
    const gName = basename(filePath)
    if (opts?.skipGlobalSearch) {
      // 预检快速查找：在 basePaths 内做浅层递归（深度 3），把工作区/授权目录内
      // 子目录中的文件识别为「已存在」，避免裸文件名引用几乎全部落到「待查找」；
      // 不做跨工作区全局搜索（那部分延迟到点击时完整解析），避免批量预检阻塞主进程
      for (const base of basePaths) {
        if (!base) continue
        const found = searchFileInDir(base, gName, 3)
        if (found) return found
      }
    } else {
      const globalDirs = collectGlobalSearchDirs()
      // 先尝试直接拼接（快路径）
      for (const dir of globalDirs) {
        const candidate = resolve(dir, filePath)
        if (existsSync(candidate)) return candidate
      }
      // 再尝试在全局目录中按文件名搜索（默认深度 8，与绝对路径分支/下方 264 行一致；
      // 受 searchFileInDir 内 MAX_SCANNED=500 + 跳过 node_modules/.git 等硬上限约束，
      // 深度 3 会漏掉 apps/electron/src/main/lib/xxx 这类第 5 层的裸文件名）
      for (const dir of globalDirs) {
        const foundInDir = searchFileInDir(dir, gName)
        if (foundInDir) return foundInDir
      }
    }
    return resolve(basePaths[0]!, filePath)
  }
  const homeCandidate = resolve(homedir(), filePath)
  if (existsSync(homeCandidate)) return homeCandidate
  const rootCandidate = resolve('/', filePath)
  if (existsSync(rootCandidate)) return rootCandidate
  const commonFound = searchCommonDirs(filePath)
  if (commonFound) return commonFound
  // 全局 fallback：在所有已知工作区和附加目录中搜索
  // 预检模式（skipGlobalSearch）下跳过，只保留上面的快速 existsSync 判断
  if (!opts?.skipGlobalSearch) {
    const name = basename(filePath)
    const globalDirs = collectGlobalSearchDirs()
    for (const dir of globalDirs) {
      const candidate = resolve(dir, filePath)
      if (existsSync(candidate)) return candidate
    }
    for (const dir of globalDirs) {
      const foundInDir = searchFileInDir(dir, name)
      if (foundInDir) return foundInDir
    }
  }
  return resolve(filePath)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── 导出：内联预览 API ───

/** 解析文件路径并读取内容（供内联文本/代码预览使用） */
export interface FilePreviewVersion {
  /** 内容版本：mtime+size 可快速判断外部写入，hash 用于同时间戳写入的保险。 */
  revision: string
  mtimeMs: number
  size: number
  hash: string
}

function buildFilePreviewVersion(filePath: string, content: Buffer | string, stat: { mtimeMs: number; size: number }): FilePreviewVersion {
  return {
    revision: `${stat.mtimeMs}:${stat.size}`,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    hash: createHash('sha256').update(content).digest('hex'),
  }
}

export function resolveAndReadFile(filePath: string, basePaths?: string[]): { resolvedPath: string; content: string; version: FilePreviewVersion } | null {
  const safePath = resolveTargetPath(filePath, basePaths)
  if (!existsSync(safePath)) return null
  try {
    const st = statSync(safePath)
    if (st.size > MAX_FILE_SIZE) return null
    const content = readFileSync(safePath, 'utf-8')
    return { resolvedPath: safePath, content, version: buildFilePreviewVersion(safePath, content, st) }
  } catch {
    return null
  }
}

/** 仅解析文件路径（不读取内容），供图片等用 cdut-file:// 协议加载的场景使用 */
export function resolveFilePath(filePath: string, basePaths?: string[], opts?: { skipGlobalSearch?: boolean }): string | null {
  const safePath = resolveTargetPath(filePath, basePaths, opts)
  return existsSync(safePath) ? safePath : null
}

/** 常见图片扩展名 → MIME 映射（用于 readFileAsDataUrl 组装 data URL） */
const IMAGE_MIME_MAP: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
}

/**
 * 读取文件为 base64 data URL（供移动端预览图片等二进制文件）。
 * 桌面端图片预览走 cdut-file:// 自定义协议 URL，移动端无法加载该协议，
 * 必须把内容直接以 data URL 形式经 WS 传输给客户端渲染。
 * 复用 resolveTargetPath 的绝对/相对路径解析与 MAX_FILE_SIZE 体积限制。
 */
export function readFileAsDataUrl(filePath: string, basePaths?: string[]): { resolvedPath: string; dataUrl: string; version: FilePreviewVersion } | null {
  const safePath = resolveTargetPath(filePath, basePaths)
  if (!existsSync(safePath)) return null
  try {
    const st = statSync(safePath)
    if (st.size > MAX_FILE_SIZE) return null
    const ext = basename(safePath).split('.').pop()?.toLowerCase() ?? ''
    const mime = IMAGE_MIME_MAP[ext] ?? 'application/octet-stream'
    const buffer = readFileSync(safePath)
    return { resolvedPath: safePath, dataUrl: `data:${mime};base64,${buffer.toString('base64')}`, version: buildFilePreviewVersion(safePath, buffer, st) }
  } catch {
    return null
  }
}

export interface PreparePdfPreviewOptions {
  /**
   * 只栅格化这些页（1 基）。
   *
   * 逐页截图（审核材料登记、Agent 单页核验）只需要目标页；若不限定，查看器会在
   * 每次加载时先把整份文档全量栅格化一遍，再渲染目标页。26 页的真实 PDF 实测
   * 单次全量栅格化约 34 秒，逐页串行截图会放大成几十倍等待（历史「登记卡住」根因）。
   */
  pages?: number[]
}

/** 为内联 PDF 预览生成临时 HTML 文件（使用 cdut-file:// 加载 PDF，无体积膨胀） */
export async function preparePdfPreview(filePath: string, basePaths?: string[], options: PreparePdfPreviewOptions = {}): Promise<{ resolvedPath: string; tmpHtmlUrl: string } | null> {
  const safePath = resolveTargetPath(filePath, basePaths)
  if (!existsSync(safePath)) return null
  const st = statSync(safePath)
  if (st.size > MAX_FILE_SIZE) return null

  let fileUrl: string
  let pdfScriptUrl: string
  let pdfWorkerUrl: string
  let standardFontDataUrl: string
  let registerFilePath: (path: string) => string
  // 去重并保留调用方顺序：只渲染显式要求的页，未要求则空数组表示整份文档。
  const initialPages = [...new Set((options.pages ?? []).filter((page) => Number.isInteger(page) && page >= 1))]
  try {
    const { registerProferDirectoryPath, registerProferFilePath } = await import('./local-file-protocol')
    registerFilePath = registerProferFilePath
    fileUrl = registerProferFilePath(safePath)
    pdfScriptUrl = registerProferFilePath(require.resolve(`${PDFJS_PACKAGE}/build/pdf.min.mjs`))
    pdfWorkerUrl = registerProferFilePath(require.resolve(`${PDFJS_PACKAGE}/build/pdf.worker.min.mjs`))
    const pdfPackageDir = dirname(require.resolve(`${PDFJS_PACKAGE}/package.json`))
    standardFontDataUrl = `${registerProferDirectoryPath(join(pdfPackageDir, 'standard_fonts'))}/`
  } catch (err) {
    console.error('[file-preview] preparePdfPreview asset resolution failed:', err)
    return null
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: transparent; overflow: auto; padding: 16px; scroll-behavior: smooth; }
  #c { display: flex; flex-direction: column; align-items: center; gap: 16px; width: fit-content; min-width: 100%; }
  .page-wrapper { position: relative; margin: 0 auto; box-shadow: 0 4px 16px rgba(0,0,0,0.16); border-radius: 4px; overflow: visible; background: #fff; }
  .page-wrapper canvas { display: block; border-radius: 4px; }
  .overlay-layer { position: absolute; inset: 0; pointer-events: none; z-index: 10; }
  .bbox-spotlight {
    position: absolute;
    border-radius: 6px;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(59, 130, 246, 0.18));
    border: 2px solid rgba(245, 158, 11, 0.92);
    box-shadow:
      0 0 0 4px rgba(245, 158, 11, 0.24),
      0 8px 24px -4px rgba(245, 158, 11, 0.35),
      inset 0 0 12px rgba(255, 255, 255, 0.35);
    animation: cdutSpotlightPulse 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    transform-origin: center center;
  }
  .bbox-spotlight-badge {
    position: absolute;
    top: -24px;
    left: -2px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    color: #fff;
    font: 600 11px/1.4 system-ui, -apple-system, sans-serif;
    white-space: nowrap;
    box-shadow: 0 4px 10px rgba(234, 88, 12, 0.35);
    letter-spacing: 0.02em;
  }
  @keyframes cdutSpotlightPulse {
    0% {
      opacity: 0;
      transform: scale(0.96);
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.65), 0 4px 12px rgba(245, 158, 11, 0.25);
    }
    12% {
      opacity: 1;
      transform: scale(1.012);
      box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.28), 0 10px 28px rgba(245, 158, 11, 0.45);
    }
    26% {
      opacity: 0.92;
      transform: scale(0.996);
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 6px 16px rgba(245, 158, 11, 0.3);
    }
    42% {
      opacity: 1;
      transform: scale(1.008);
      box-shadow: 0 0 0 7px rgba(245, 158, 11, 0.25), 0 10px 26px rgba(245, 158, 11, 0.4);
    }
    75% {
      opacity: 0.9;
      transform: scale(1);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16), 0 6px 16px rgba(245, 158, 11, 0.25);
    }
    100% {
      opacity: 0;
      transform: scale(0.99);
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0), 0 0 0 rgba(245, 158, 11, 0);
    }
  }
  .loading { color: #888; font: 12px/1.5 system-ui; padding: 40px; text-align: center; width: 100%; }
  .error { color: #f87171; font: 12px/1.5 system-ui; padding: 20px; text-align: center; width: 100%; }
  .page-info { color: #888; font: 11px/1.5 system-ui; text-align: center; padding: 4px; width: 100%; }
</style>
</head><body>
  <div class="loading" id="c">正在加载 PDF...</div>
  <script type="module">
    const container = document.getElementById('c');
    const fileUrl = ${JSON.stringify(fileUrl)};
    const pdfScriptUrl = ${JSON.stringify(pdfScriptUrl)};
    const pdfWorkerUrl = ${JSON.stringify(pdfWorkerUrl)};
    const standardFontDataUrl = ${JSON.stringify(standardFontDataUrl)};
    // 空数组表示不限定，按整份文档渲染；非空时只渲染这些页，避免逐页截图时反复全量栅格化。
    const initialPages = ${JSON.stringify(initialPages)};
    const STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
    let stepIdx = 2;
    let pdfDoc = null;
    let isRendered = false;
    let pendingHighlight = null;
    let spotlightTimer = null;

    function notifyZoom() {
      window.parent.postMessage({ type: 'pdf-zoom-changed', zoom: Math.round(STEPS[stepIdx] * 100) }, '*');
    }

    function clearSpotlights() {
      if (spotlightTimer) {
        clearTimeout(spotlightTimer);
        spotlightTimer = null;
      }
      document.querySelectorAll('.bbox-spotlight').forEach((el) => el.remove());
    }

    function applyHighlight(payload) {
      if (!payload) return;
      // 三态语义：① 未渲染完毕 → 入队 pendingHighlight，首次渲染后冲刷补偿并回执；
      if (!isRendered) {
        pendingHighlight = payload;
        return;
      }
      const pageNum = Math.max(1, Number(payload.page) || 1);
      const wrapper = container.querySelector('.page-wrapper[data-page="' + pageNum + '"]');
      // ② 已渲染但页码越界（如模型幻觉输出 12 页文档的 p99）→ 立即失败回执，
      //    交由父级即时释放高亮请求 Atom，杜绝 pendingHighlight 永不冲刷导致的宽限死等。
      if (!wrapper) {
        if (payload.requestId) {
          window.parent.postMessage({ type: 'pdf-highlight-rendered', requestId: payload.requestId, ok: false, error: 'page-not-found' }, '*');
        }
        return;
      }

      const overlay = wrapper.querySelector('.overlay-layer');
      if (!overlay) {
        // 防御性分支：wrapper 与 overlay 在 renderPages 中同生共死，正常不会命中；
        // 一旦命中按页码越界同语义立即失败回执。
        if (payload.requestId) {
          window.parent.postMessage({ type: 'pdf-highlight-rendered', requestId: payload.requestId, ok: false, error: 'page-not-found' }, '*');
        }
        return;
      }

      clearSpotlights();
      const bbox = Array.isArray(payload.bbox) && payload.bbox.length >= 4 ? payload.bbox : null;
      const spotlight = document.createElement('div');
      spotlight.className = 'bbox-spotlight';

      if (bbox) {
        const padX = 0.008;
        const padY = 0.005;
        const x0 = Math.max(0, Math.min(0.98, Number(bbox[0]) - padX));
        const y0 = Math.max(0, Math.min(0.98, Number(bbox[1]) - padY));
        const x1 = Math.max(x0 + 0.02, Math.min(1, Number(bbox[2]) + padX));
        const y1 = Math.max(y0 + 0.015, Math.min(1, Number(bbox[3]) + padY));
        spotlight.style.left = (x0 * 100).toFixed(2) + '%';
        spotlight.style.top = (y0 * 100).toFixed(2) + '%';
        spotlight.style.width = ((x1 - x0) * 100).toFixed(2) + '%';
        spotlight.style.height = ((y1 - y0) * 100).toFixed(2) + '%';
      } else {
        spotlight.style.left = '4%';
        spotlight.style.top = '4%';
        spotlight.style.width = '92%';
        spotlight.style.height = '14%';
      }

      const badgeText = payload.label || payload.blockId || ('第 ' + pageNum + ' 页');
      if (badgeText) {
        const badge = document.createElement('div');
        badge.className = 'bbox-spotlight-badge';
        badge.textContent = '📍 ' + badgeText;
        spotlight.appendChild(badge);
      }

      overlay.appendChild(spotlight);

      // ③ 绘制成功回执：父级 DiffTabContent 收到匹配 requestId 的回执后即释放高亮请求 Atom，
      //    替代旧的「180ms 盲目清空」竞态路径（首次/慢速加载时聚光灯不再丢失）。
      if (payload.requestId) {
        window.parent.postMessage({ type: 'pdf-highlight-rendered', requestId: payload.requestId, ok: true }, '*');
      }

      requestAnimationFrame(() => {
        spotlight.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      });

      spotlightTimer = setTimeout(() => {
        spotlight.remove();
        spotlightTimer = null;
      }, 2850);
    }

    async function renderPages(pageNumbers) {
      if (!pdfDoc) return;
      container.innerHTML = '';
      const userScale = STEPS[stepIdx];
      const dpr = window.devicePixelRatio || 1;
      for (const i of pageNumbers) {
        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: userScale * dpr });
        const wrapper = document.createElement('div');
        wrapper.className = 'page-wrapper';
        wrapper.dataset.page = String(i);
        wrapper.style.width = (vp.width / dpr) + 'px';
        wrapper.style.height = (vp.height / dpr) + 'px';

        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        canvas.style.width = (vp.width / dpr) + 'px';
        canvas.style.height = (vp.height / dpr) + 'px';
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

        const overlay = document.createElement('div');
        overlay.className = 'overlay-layer';

        wrapper.appendChild(canvas);
        wrapper.appendChild(overlay);
        container.appendChild(wrapper);
      }
      const info = document.createElement('div');
      info.className = 'page-info';
      info.textContent = '共 ' + pdfDoc.numPages + ' 页';
      container.appendChild(info);
      isRendered = true;
      notifyZoom();

      if (pendingHighlight) {
        const toRun = pendingHighlight;
        pendingHighlight = null;
        applyHighlight(toRun);
      }
    }

    async function renderAll() { return renderPages(Array.from({ length: pdfDoc?.numPages || 0 }, (_, i) => i + 1)); }

    window.addEventListener('message', async (e) => {
      if (e.data?.type === 'pdf-zoom') {
        if (e.data.direction === 'in' && stepIdx < STEPS.length - 1) { stepIdx++; renderAll(); }
        if (e.data.direction === 'out' && stepIdx > 0) { stepIdx--; renderAll(); }
      }
      // 抓手平移：由外层预览视口转发指针位移，驱动 iframe 内部滚动（滚动条保持不动）。
      // dx/dy 为「抓取位移」（向右拖 dx>0 表示内容应向右移动），
      // 因此滚动量取负：scrollLeft 减小 = 视口左移 = 内容向右移动。
      if (e.data?.type === 'pdf-scroll') {
        window.scrollBy({ left: -(Number(e.data.dx) || 0), top: -(Number(e.data.dy) || 0), behavior: 'auto' });
      }
      if (e.data?.type === 'pdf-navigate-highlight') {
        applyHighlight(e.data);
      }
      // 隐藏 Agent renderer 使用此窄消息协议逐页渲染；普通人类预览不会发送它。
      if (e.data?.type === 'agent-preview:select-pdf-page') {
        const page = Number(e.data.page);
        if (!Number.isInteger(page) || page < 1 || !pdfDoc || page > pdfDoc.numPages) return;
        // 已经只渲染了目标页（initialPages 限定）时无需重复栅格化，直接回报完成。
        const wrappers = container.querySelectorAll('.page-wrapper');
        const alreadySolePage = wrappers.length === 1 && wrappers[0].dataset.page === String(page);
        if (!alreadySolePage) await renderPages([page]);
        window.parent.postMessage({ type: 'agent-preview:pdf-page-rendered', page }, '*');
      }
    });

    try {
      const pdfjsLib = await import(pdfScriptUrl);
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      pdfDoc = await pdfjsLib.getDocument({
        url: fileUrl,
        standardFontDataUrl,
      }).promise;
      if (initialPages.length > 0) {
        await renderPages(initialPages.filter((page) => Number.isInteger(page) && page >= 1 && page <= pdfDoc.numPages));
      } else {
        await renderAll();
      }
      window.parent.postMessage({ type: 'agent-preview:pdf-ready', pageCount: pdfDoc.numPages }, '*');
    } catch (err) {
      container.innerHTML = '<div class="error">PDF 加载失败: ' + err.message + '<\\/div>';
    }
  <\/script>
<\/body><\/html>`
  const tmpHtmlPath = writeTempHtml(html)
  const tmpHtmlUrl = registerFilePath(tmpHtmlPath)
  return { resolvedPath: safePath, tmpHtmlUrl }
}

function renderOfficeBlocksHtml(filePath: string, text: string, kind: OfficePreviewResult['kind']): string {
  const title = escapeHtml(basename(filePath))
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  const body = paragraphs.length > 0
    ? paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`).join('')
    : '<div class="office-empty">没有可提取的文本内容</div>'
  return `<div class="office-preview office-preview-${kind}"><div class="office-preview-title">${title}</div>${body}</div>`
}

/** 将 DOCX 文件转换为 HTML（由 @profer/core/office-engine 驱动） */
export async function convertDocxToHtml(filePath: string, basePaths?: string[]): Promise<{ resolvedPath: string; html: string } | null> {
  const safePath = resolveTargetPath(filePath, basePaths)
  if (!existsSync(safePath)) return null
  try {
    const st = statSync(safePath)
    if (st.size > MAX_FILE_SIZE) return null
    const parsed = parseOfficeBuffer(readFileSync(safePath), safePath, { includeAnchors: false })
    return {
      resolvedPath: safePath,
      html: renderOfficeBlocksHtml(filePath, parsed.markdown, 'spreadsheet'),
    }
  } catch (err) {
    console.error('[file-preview] convertDocxToHtml 解析失败:', err)
    return null
  }
}

/** 将 XLSX/PPTX 转成 HTML 预览（由 @profer/core/office-engine 驱动） */
export async function convertOfficeToHtml(filePath: string, basePaths?: string[]): Promise<OfficePreviewResult | null> {
  const safePath = resolveTargetPath(filePath, basePaths)
  if (!existsSync(safePath)) return null

  try {
    const st = statSync(safePath)
    if (st.size > MAX_FILE_SIZE) return null

    const ext = extname(safePath).toLowerCase()
    if (ext !== '.xlsx' && ext !== '.pptx') return null
    const parsed = parseOfficeBuffer(readFileSync(safePath), safePath, { includeAnchors: false })
    const kind: OfficePreviewResult['kind'] = ext === '.pptx' ? 'presentation' : 'spreadsheet'
    const text = parsed.ast.pages.flatMap((p) => p.blocks.map((b) => b.text)).join('\n').trim()
    return {
      resolvedPath: safePath,
      kind,
      html: renderOfficeBlocksHtml(filePath, parsed.markdown, kind),
      text,
    }
  } catch (err) {
    console.error('[file-preview] convertOfficeToHtml 解析失败:', err)
    return null
  }
}
