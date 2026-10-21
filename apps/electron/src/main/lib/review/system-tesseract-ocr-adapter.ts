/**
 * 系统级 Tesseract OCR 端口（真实引擎，零新依赖）
 *
 * 用系统安装的 tesseract CLI（本机 5.5.0，chi_sim+eng 已装）通过 child_process 调用，
 * TSV 输出解析为块级 OcrResult。与 TesseractOcrPort（tesseract.js WASM 线）实现同一
 * OcrPort 契约：available 探测不抛错、失败显式降级（材料记 unread，不冒充已读）。
 *
 * 选型说明：tesseract.js 需要随包 wasm/worker/语言包资源（M5 打包项），本机已有系统
 * tesseract 且语言包齐全，先以系统 CLI 真实引擎打通链路；打包分发时再评估随包方案。
 */
import { spawn } from 'node:child_process'
import type { OcrBlock, OcrRequest, OcrResult } from './ocr-port'

/** 探测系统 tesseract 可执行文件与 chi_sim 语言包（缓存结果，进程内只探一次） */
let cached: Promise<{ available: boolean; reason?: string }> | undefined

export function probeSystemTesseract(): Promise<{ available: boolean; reason?: string }> {
  return cached ??= probeAsync()
}

async function runTesseract(args: string[], options: { timeoutMs: number; signal?: AbortSignal }): Promise<{ code: number | null; out: string; err: string }> {
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      const error = new Error('OCR 已取消')
      error.name = 'AbortError'
      reject(error)
      return
    }
    const proc = spawn('tesseract', args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    let settled = false
    const finish = (callback: () => void): void => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      options.signal?.removeEventListener('abort', abort)
      callback()
    }
    const abort = (): void => {
      proc.kill('SIGTERM')
      const error = new Error('OCR 已取消')
      error.name = 'AbortError'
      finish(() => reject(error))
    }
    const timeout = setTimeout(() => {
      proc.kill('SIGTERM')
      finish(() => reject(new Error(`OCR 超时（${options.timeoutMs} ms）`)))
    }, options.timeoutMs)
    proc.stdout.on('data', (chunk: Buffer) => { out += chunk.toString('utf-8') })
    proc.stderr.on('data', (chunk: Buffer) => { err += chunk.toString('utf-8') })
    proc.on('error', (error) => finish(() => reject(new Error(`tesseract CLI 启动失败: ${error.message}`))))
    proc.on('close', (code) => finish(() => resolve({ code, out, err })))
    options.signal?.addEventListener('abort', abort, { once: true })
  })
}

async function probeAsync(): Promise<{ available: boolean; reason?: string }> {
  try {
    const version = await runTesseract(['--version'], { timeoutMs: 5000 })
    if (version.code !== 0 || !version.out.includes('tesseract')) return { available: false, reason: '系统未安装或无法启动 tesseract CLI' }
    const languages = await runTesseract(['--list-langs'], { timeoutMs: 5000 })
    if (languages.code !== 0) return { available: false, reason: '系统 tesseract 语言包探测失败' }
    if (!/(^|\n)chi_sim(\n|$)/.test(languages.out)) return { available: false, reason: '系统 tesseract 缺少 chi_sim 中文语言包' }
    return { available: true }
  } catch (error) {
    return { available: false, reason: error instanceof Error ? error.message : '系统 tesseract 探测失败' }
  }
}

export class SystemTesseractOcrPort {
  readonly available: boolean
  readonly unavailableReason?: string

  private constructor(status: { available: boolean; reason?: string }) {
    this.available = status.available
    this.unavailableReason = status.reason
  }

  /** 工厂：探测系统 CLI 与语言包（不抛错） */
  static async create(): Promise<SystemTesseractOcrPort> {
    return new SystemTesseractOcrPort(await probeSystemTesseract())
  }

  async recognize(request: OcrRequest): Promise<OcrResult> {
    if (!this.available) throw new Error(`OCR 不可用: ${this.unavailableReason ?? '未知原因'}`)
    const absolute = request.pageAssetPath.startsWith('/')
      ? request.pageAssetPath
      : ''
    if (!absolute) throw new Error(`OCR 输入必须是绝对路径: ${request.pageAssetPath}`)
    const language = request.language || 'chi_sim'

    // TSV 输出：level/page/block/par/line/word + bbox + conf + text（词级，真实坐标）
    const result = await runTesseract([absolute, 'stdout', '-l', language, 'tsv'], { timeoutMs: request.timeoutMs ?? 60_000, signal: request.signal })
    if (result.code !== 0 || !result.out) throw new Error(`tesseract 退出码 ${result.code}: ${result.err.slice(0, 200)}`)
    const tsv = result.out
    const blocks = parseTsv(tsv)
    if (blocks.length === 0) throw new Error('OCR 未识别出文本（图片可能为空或纯图形）')
    const width = blocks.reduce((max, block) => Math.max(max, block.rect.x + block.rect.w), 0)
    const height = blocks.reduce((max, block) => Math.max(max, block.rect.y + block.rect.h), 0)
    return { engine: 'tesseract-cli', engineVersion: '5', blocks, imageWidth: width, imageHeight: height }
  }

}

/** 解析 tesseract TSV 为块级结构（词级；过滤低置信噪声与空文本） */
export function parseTsv(tsv: string): OcrBlock[] {
  const lines = tsv.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length === 0) return []
  // 首行为表头：level page block par line word left top width height conf text
  const header = lines[0]!.split('\t')
  const idx = (name: string): number => header.indexOf(name)
  const col = { left: idx('left'), top: idx('top'), width: idx('width'), height: idx('height'), conf: idx('conf'), text: idx('text') }
  const blocks: OcrBlock[] = []
  for (const line of lines.slice(1)) {
    const cols = line.split('\t')
    const text = (cols[col.text] ?? '').trim()
    const conf = Number(cols[col.conf] ?? '-1')
    if (!text || conf < 30) continue
    const x = Number(cols[col.left] ?? 0)
    const y = Number(cols[col.top] ?? 0)
    const w = Number(cols[col.width] ?? 0)
    const h = Number(cols[col.height] ?? 0)
    blocks.push({ text, rect: { x, y, w, h }, confidence: Math.max(0, Math.min(1, conf / 100)) })
  }
  return blocks
}
