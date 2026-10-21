/**
 * server.ts — 独立轻量可视化测试程序入口
 *
 * 运行方式：`bun run benchmark:ui`（根目录）或 `bun run start`（本包目录）。
 *
 * 职责：
 *   - 提供现代可视化仪表盘（静态单页，零构建、零外部依赖）；
 *   - 通过 Server-Sent Events 实时推送双引擎评测进度；
 *   - 一键生成 Markdown / JSON / CSV 三种格式的评测报告；
 *   - 通过本机回环地址调度主程序内的隐蔽评测接口执行检索比对。
 *
 * 与主程序彻底解耦：本程序仅依赖主程序启动时写出的回环握手文件。
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { hasCachedOfficialDataset, loadCachedOfficialDataset, loadEmbeddedDataset, loadOrDownloadOfficialDataset } from './dataset-loader'
import { DEFAULT_EVALUATION_OPTIONS, runEvaluation } from './evaluator'
import { buildReportBundle, extractHighlights } from './report'
import { BenchmarkRunner, BenchmarkRuntimeNotFoundError, loadRuntimeInfo } from './runner'
import type { EvaluationReport, MultiHopDataset } from './types'

const HOST = '127.0.0.1'
const PORT = Number(process.env.CDUT_BENCH_UI_PORT ?? 7801)

/** 数据集摘要（不含逐条内容，供前端轻量展示） */
function summarizeDataset(dataset: MultiHopDataset): {
  origin: string
  label: string
  embedded: boolean
  corpusSize: number
  queryCount: number
} {
  return {
    origin: dataset.origin,
    label: dataset.label,
    embedded: dataset.embedded,
    corpusSize: dataset.corpus.length,
    queryCount: dataset.queries.length,
  }
}

/** 按来源加载数据集 */
async function resolveDataset(origin: string): Promise<MultiHopDataset> {
  if (origin === 'official') return loadOrDownloadOfficialDataset()
  return loadEmbeddedDataset()
}

/** 读取仪表盘静态页面 */
function dashboardHtml(): string {
  try {
    return readFileSync(join(import.meta.dir, '..', 'public', 'index.html'), 'utf-8')
  } catch {
    return '<!doctype html><meta charset="utf-8"><h1>仪表盘页面缺失</h1><p>未找到 public/index.html。</p>'
  }
}

/** 统一 JSON 响应 */
function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

/** SSE 事件帧编码 */
function sseFrame(encoder: TextEncoder, event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

const server = Bun.serve({
  hostname: HOST,
  port: PORT,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/' || url.pathname === '/index.html') {
      // 禁止缓存：看板为本地开发工具，界面改动需即时可见，避免浏览器读到旧页面
      return new Response(dashboardHtml(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
      })
    }

    // ===== 主程序连接状态 =====
    if (url.pathname === '/api/runtime' && request.method === 'GET') {
      try {
        const info = loadRuntimeInfo()
        const runner = new BenchmarkRunner(info)
        const available = await runner.health()
        return json({ connected: available, runtimeFilePath: info.runtimeFilePath, endpoint: `http://${info.host}:${info.port}` })
      } catch (error) {
        return json({
          connected: false,
          error: error instanceof BenchmarkRuntimeNotFoundError ? 'RUNTIME_NOT_FOUND' : 'UNKNOWN',
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    // ===== 数据集清单 =====
    if (url.pathname === '/api/datasets' && request.method === 'GET') {
      const embedded = summarizeDataset(loadEmbeddedDataset())
      const cached = loadCachedOfficialDataset()
      return json({
        embedded,
        official: {
          cached: hasCachedOfficialDataset(),
          summary: cached ? summarizeDataset(cached) : null,
        },
      })
    }

    // ===== 下载官方全集 =====
    if (url.pathname === '/api/datasets/download' && request.method === 'POST') {
      try {
        const dataset = await loadOrDownloadOfficialDataset()
        return json({ success: true, summary: summarizeDataset(dataset) })
      } catch (error) {
        return json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500)
      }
    }

    // ===== 执行评测（SSE 实时进度 + 结果） =====
    if (url.pathname === '/api/run' && request.method === 'POST') {
      let body: { dataset?: string; engines?: string[]; topK?: number; concurrency?: number } = {}
      try {
        body = (await request.json()) as typeof body
      } catch {
        body = {}
      }

      let dataset: MultiHopDataset
      try {
        dataset = await resolveDataset(body.dataset ?? 'embedded')
      } catch (error) {
        return json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500)
      }

      const engines = (Array.isArray(body.engines) && body.engines.length > 0
        ? body.engines
        : DEFAULT_EVALUATION_OPTIONS.engines) as Array<'classic' | 'graphrag'>
      const topK = typeof body.topK === 'number' ? body.topK : DEFAULT_EVALUATION_OPTIONS.topK
      const concurrency = typeof body.concurrency === 'number' ? body.concurrency : DEFAULT_EVALUATION_OPTIONS.concurrency

      const encoder = new TextEncoder()
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (event: string, data: unknown): void => controller.enqueue(sseFrame(encoder, event, data))
          try {
            const runner = BenchmarkRunner.fromRuntimeFile()
            if (!(await runner.health())) {
              send('error', { message: '无法连接主程序评测服务，请确认 CDUT Studio 桌面应用正在运行。' })
              controller.close()
              return
            }
            send('status', { message: '已连接主程序评测服务，开始执行评测…', dataset: summarizeDataset(dataset) })
            const report: EvaluationReport = await runEvaluation(runner, dataset, {
              engines,
              topK,
              concurrency,
              onProgress: (progress) => send('progress', progress),
            })
            send('done', { report, highlights: extractHighlights(report) })
          } catch (error) {
            send('error', { message: error instanceof Error ? error.message : String(error) })
          } finally {
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // ===== 报告导出 =====
    if (url.pathname === '/api/export' && request.method === 'POST') {
      try {
        const body = (await request.json()) as { report?: EvaluationReport; format?: string }
        if (!body.report) return json({ success: false, message: '缺少评测报告数据' }, 400)
        const bundle = buildReportBundle(body.report)
        const format = body.format ?? 'md'
        const content = format === 'json' ? bundle.json : format === 'csv' ? bundle.csv : bundle.markdown
        const contentType =
          format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/markdown'
        const extension = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'md'
        return new Response(content, {
          headers: {
            'Content-Type': `${contentType}; charset=utf-8`,
            'Content-Disposition': `attachment; filename="multihop-rag-report.${extension}"`,
          },
        })
      } catch (error) {
        return json({ success: false, message: error instanceof Error ? error.message : String(error) }, 500)
      }
    }

    return json({ success: false, error: 'NOT_FOUND' }, 404)
  },
})

console.log(`\n  MultiHop-RAG 可视化评测看板已启动：http://${server.hostname}:${server.port}\n`)
console.log('  提示：请保持 CDUT Studio 桌面应用处于运行状态，评测服务由其主进程静默提供。\n')
