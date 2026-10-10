/**
 * study-benchmark-server.ts — AI 速课堂「隐蔽评测服务」
 *
 * 职责：
 *   在 Electron 主进程内静默拉起一个仅监听 `127.0.0.1` 的轻量 HTTP 服务，为外部
 *   独立评测程序（`bun run benchmark:ui`）提供资料注入、双引擎检索比对与超时回收能力。
 *
 * 安全红线：
 *   - 仅绑定回环地址 `127.0.0.1`，绝不对外网暴露；
 *   - 每次启动生成一次性随机 Token，所有请求必须携带 `Authorization: Bearer <token>`；
 *   - 端口与 Token 写入本地运行时文件（`~/.cdutai/study-benchmark-runtime.json`）供本机直连；
 *   - 常规用户端零感知：无任何菜单、按钮或界面入口；
 *   - 任何异常均被隔离，绝不影响主程序稳定性。
 *
 * 端点（前缀 /v1）：
 *   GET  /health                 健康探活
 *   POST /v1/session             创建评测隔离会话
 *   POST /v1/session/ingest      注入纯文本语料（返回 key → documentId 映射）
 *   POST /v1/search              执行双引擎检索比对
 *   POST /v1/session/reset       回收评测会话（物理清理临时索引）
 */

import { randomBytes, randomUUID } from 'node:crypto'
import { existsSync, rmSync } from 'node:fs'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import type { StudySearchKnowledgeResult, StudySearchResultItem } from '@profer/shared'
import { getStudyBenchmarkRuntimePath, getStudySessionDir } from '../config-paths'
import { writeJsonFileAtomic } from '../safe-file'
import {
  ingestStudyRawDocuments,
  MAX_STUDY_RETRIEVAL_TOP_K,
  type StudyRawDocumentInput,
} from './study-document-indexer'
import { searchStudyRouted, type StudyRetrievalEngineType } from './study-retrieval-router'

/** 仅监听本机回环地址 */
const LOOPBACK_HOST = '127.0.0.1'
/** 请求体硬上限（评测语料批量注入场景，64MB 足够） */
const MAX_BODY_BYTES = 64 * 1024 * 1024
/** 评测会话标识校验（与速课堂 STUDY_ID_RE 保持一致，杜绝路径穿越） */
const SESSION_ID_RE = /^[A-Za-z0-9_-]+$/
/** 文档级归并时的切块过取倍数：每篇资料平均预留多少个切块名额 */
const DOC_CHUNK_OVERFETCH = 8

/**
 * 切块级检索结果 → 文档级归并。
 *
 * 按首次出现顺序对 documentId 去重，保留每篇得分最高的切块（即首次出现的那条），
 * 再截取前 documentBudget 篇。使 top-k 语义严格等于「文档数」，
 * 与官方 MultiHop-RAG 的文档级检索评测口径对齐，避免切块级截断压缩召回。
 */
function aggregateToDocuments(
  raw: StudySearchKnowledgeResult,
  documentBudget: number,
): StudySearchKnowledgeResult {
  const order: string[] = []
  const best = new Map<string, StudySearchResultItem>()
  for (const item of raw.items) {
    if (best.has(item.documentId)) continue
    order.push(item.documentId)
    best.set(item.documentId, item)
  }
  const items = order.slice(0, documentBudget).map((id) => best.get(id) as StudySearchResultItem)
  return {
    success: raw.success,
    items,
    ...(raw.error ? { error: raw.error } : {}),
  }
}

/** 运行时握手信息（端口 + 一次性 Token） */
interface BenchmarkRuntime {
  host: string
  port: number
  token: string
  startedAt: number
}

let server: Server | null = null
let runtime: BenchmarkRuntime | null = null
/** 已创建的评测隔离会话，便于统一回收 */
const benchmarkSessions = new Set<string>()

/** 当前运行时握手信息（未启动时为 null） */
export function getStudyBenchmarkRuntime(): BenchmarkRuntime | null {
  return runtime
}

/** 读取并校验 JSON 请求体 */
async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buf = chunk as Buffer
    total += buf.length
    if (total > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE')
    chunks.push(buf)
  }
  if (chunks.length === 0) return {}
  const text = Buffer.concat(chunks).toString('utf-8')
  if (!text.trim()) return {}
  return JSON.parse(text) as Record<string, unknown>
}

/** 统一 JSON 响应 */
function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

/** 校验请求是否携带合法 Token */
function isAuthorized(req: IncomingMessage): boolean {
  if (!runtime) return false
  const header = req.headers.authorization ?? ''
  const expected = `Bearer ${runtime.token}`
  if (header.length !== expected.length) return false
  // 定长比较，避免因长度差异提前返回（本地回环场景足够）
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= header.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

/** 清理评测隔离会话目录 */
function resetBenchmarkSession(sessionId: string): boolean {
  if (!SESSION_ID_RE.test(sessionId)) return false
  benchmarkSessions.delete(sessionId)
  try {
    const dir = getStudySessionDir(sessionId)
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
    return true
  } catch (error) {
    console.warn('[速课堂评测] 回收评测会话失败:', error)
    return false
  }
}

/** 处理单个请求 */
async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', `http://${LOOPBACK_HOST}`)
  const path = url.pathname
  const method = req.method ?? 'GET'

  if (path === '/health' && method === 'GET') {
    sendJson(res, 200, { ok: true, service: 'study-benchmark', version: 1 })
    return
  }

  if (!isAuthorized(req)) {
    sendJson(res, 401, { success: false, error: 'UNAUTHORIZED' })
    return
  }

  if (path === '/v1/session' && method === 'POST') {
    const sessionId = `bm_${randomUUID()}`
    benchmarkSessions.add(sessionId)
    sendJson(res, 200, { success: true, sessionId })
    return
  }

  if (path === '/v1/session/ingest' && method === 'POST') {
    const body = await readJsonBody(req)
    const sessionId = String(body.sessionId ?? '')
    if (!SESSION_ID_RE.test(sessionId)) {
      sendJson(res, 400, { success: false, error: 'INVALID_SESSION' })
      return
    }
    benchmarkSessions.add(sessionId)
    const documents = Array.isArray(body.documents) ? (body.documents as StudyRawDocumentInput[]) : []
    const valid = documents.filter(
      (doc) => doc && typeof doc.key === 'string' && typeof doc.title === 'string' && typeof doc.content === 'string',
    )
    const mappings = ingestStudyRawDocuments(sessionId, valid)
    sendJson(res, 200, { success: true, indexed: mappings.length, mappings })
    return
  }

  if (path === '/v1/search' && method === 'POST') {
    const body = await readJsonBody(req)
    const sessionId = String(body.sessionId ?? '')
    const query = String(body.query ?? '')
    if (!SESSION_ID_RE.test(sessionId)) {
      sendJson(res, 400, { success: false, error: 'INVALID_SESSION' })
      return
    }
    const engine: StudyRetrievalEngineType = body.engine === 'graphrag' ? 'graphrag' : 'classic'
    const rawTopK = typeof body.topK === 'number' && Number.isFinite(body.topK) ? Math.floor(body.topK) : 10
    // top-k 语义为「文档数」：多取切块后归并成文档，避免切块级截断压缩召回
    const documentBudget = Math.max(1, Math.min(MAX_STUDY_RETRIEVAL_TOP_K, rawTopK))
    const chunkBudget = Math.min(
      MAX_STUDY_RETRIEVAL_TOP_K,
      Math.max(documentBudget, documentBudget * DOC_CHUNK_OVERFETCH),
    )
    const targetDocumentId = typeof body.targetDocumentId === 'string' ? body.targetDocumentId : undefined
    const raw = searchStudyRouted(sessionId, query, engine, {
      ...(targetDocumentId ? { targetDocumentId } : {}),
      topK: chunkBudget,
    })
    sendJson(res, 200, { success: true, engine, result: aggregateToDocuments(raw, documentBudget) })
    return
  }

  if ((path === '/v1/session/reset' || path === '/v1/session') && (method === 'POST' || method === 'DELETE')) {
    const body: Record<string, unknown> =
      method === 'DELETE'
        ? await readJsonBody(req).catch((): Record<string, unknown> => ({}))
        : await readJsonBody(req)
    const sessionId = String(body.sessionId ?? url.searchParams.get('sessionId') ?? '')
    const success = resetBenchmarkSession(sessionId)
    sendJson(res, success ? 200 : 400, { success })
    return
  }

  sendJson(res, 404, { success: false, error: 'NOT_FOUND' })
}

/**
 * 启动隐蔽评测服务（幂等）。
 * 仅监听 127.0.0.1 的动态端口，并把端口与一次性 Token 落盘供本机评测程序读取。
 */
export async function startStudyBenchmarkServer(): Promise<BenchmarkRuntime> {
  if (runtime && server) return runtime

  const token = randomBytes(24).toString('hex')
  const httpServer = createServer((req, res) => {
    void handleRequest(req, res).catch((error) => {
      console.warn('[速课堂评测] 请求处理异常:', error)
      try {
        sendJson(res, 500, { success: false, error: 'INTERNAL_ERROR' })
      } catch {
        /* 响应已结束，忽略 */
      }
    })
  })

  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject)
    httpServer.listen(0, LOOPBACK_HOST, () => {
      httpServer.off('error', reject)
      resolve()
    })
  })
  // 不因该服务而阻止进程退出
  httpServer.unref()

  const address = httpServer.address()
  const port = typeof address === 'object' && address ? address.port : 0
  runtime = { host: LOOPBACK_HOST, port, token, startedAt: Date.now() }
  server = httpServer

  try {
    writeJsonFileAtomic(getStudyBenchmarkRuntimePath(), {
      host: runtime.host,
      port: runtime.port,
      token: runtime.token,
    })
  } catch (error) {
    console.warn('[速课堂评测] 写入运行时握手文件失败:', error)
  }
  console.log(`[速课堂评测] 隐蔽评测服务已在 ${LOOPBACK_HOST}:${port} 静默启动`)
  return runtime
}

/** 停止隐蔽评测服务并回收全部评测会话（进程退出兜底）。 */
export function stopStudyBenchmarkServer(): void {
  if (server) {
    try {
      server.close()
    } catch {
      /* 忽略关闭异常 */
    }
    server = null
  }
  runtime = null
  // 清理运行时握手文件，避免评测程序读到已失效的端口
  try {
    const runtimePath = getStudyBenchmarkRuntimePath()
    if (existsSync(runtimePath)) rmSync(runtimePath, { force: true })
  } catch {
    /* 忽略清理异常 */
  }
  for (const sessionId of [...benchmarkSessions]) resetBenchmarkSession(sessionId)
}
