/**
 * runner.ts — 主程序隐蔽评测接口客户端
 *
 * 通过本机回环地址直连 Electron 主进程内静默启动的评测服务，完成：
 *   - 评测隔离会话的创建与回收；
 *   - 纯文本语料批量注入（返回 key → documentId 映射）；
 *   - 双引擎（classic / graphrag）检索比对调用。
 *
 * 运行时握手信息读取顺序：环境变量 → 开发配置目录 → 正式配置目录。
 */

import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** 与主进程约定的检索引擎类型 */
export type EngineType = 'classic' | 'graphrag'

/** 注入语料入参 */
export interface IngestDocument {
  key: string
  title: string
  content: string
}

/** key → documentId 映射 */
export interface IngestMapping {
  key: string
  documentId: string
  totalSections: number
}

/** 单条检索结果条目（与主进程 StudySearchResultItem 同构） */
export interface SearchResultItem {
  documentId: string
  documentFileName: string
  sectionId: string
  sectionTitle: string
  score: number
  matchedExcerpt: string
  pageRange?: [number, number]
}

/** 检索结果 */
export interface SearchResult {
  success: boolean
  items: SearchResultItem[]
  error?: string
}

/** 运行时握手信息 */
export interface BenchmarkRuntimeInfo {
  host: string
  port: number
  token: string
  runtimeFilePath: string
}

/** 运行时文件未找到时抛出的专属错误 */
export class BenchmarkRuntimeNotFoundError extends Error {
  constructor(searched: string[]) {
    super(
      '未找到主程序评测服务运行时文件。请先启动 CDUT Studio 桌面应用，' +
        '评测服务会在主进程启动时静默监听本机回环端口。\n已检索路径：\n' +
        searched.map((item) => `  - ${item}`).join('\n'),
    )
    this.name = 'BenchmarkRuntimeNotFoundError'
  }
}

/** 解析候选运行时文件路径 */
function candidateRuntimePaths(): string[] {
  const candidates: string[] = []
  const explicit = process.env.CDUT_BENCH_RUNTIME
  if (explicit) candidates.push(explicit)
  const configOverride = process.env.PROFER_CONFIG_DIR
  if (configOverride) candidates.push(join(configOverride, 'study-benchmark-runtime.json'))
  candidates.push(join(homedir(), '.cdutai-dev', 'study-benchmark-runtime.json'))
  candidates.push(join(homedir(), '.cdutai', 'study-benchmark-runtime.json'))
  return candidates
}

/** 读取运行时握手信息 */
export function loadRuntimeInfo(): BenchmarkRuntimeInfo {
  const candidates = candidateRuntimePaths()
  for (const path of candidates) {
    if (!existsSync(path)) continue
    try {
      const raw = JSON.parse(readFileSync(path, 'utf-8')) as { host?: string; port?: number; token?: string }
      if (typeof raw.port === 'number' && typeof raw.token === 'string') {
        return {
          host: raw.host && raw.host.length > 0 ? raw.host : '127.0.0.1',
          port: raw.port,
          token: raw.token,
          runtimeFilePath: path,
        }
      }
    } catch {
      // 文件损坏则继续尝试下一个候选路径
    }
  }
  throw new BenchmarkRuntimeNotFoundError(candidates)
}

/** 主程序评测服务客户端 */
export class BenchmarkRunner {
  private readonly baseUrl: string
  private readonly token: string
  readonly runtimeFilePath: string

  constructor(info: BenchmarkRuntimeInfo) {
    this.baseUrl = `http://${info.host}:${info.port}`
    this.token = info.token
    this.runtimeFilePath = info.runtimeFilePath
  }

  /** 使用默认路径自动装配 */
  static fromRuntimeFile(): BenchmarkRunner {
    return new BenchmarkRunner(loadRuntimeInfo())
  }

  /** 探活：确认主程序评测服务可用 */
  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  /** 统一 POST 调用 */
  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`评测服务调用失败：${path} → HTTP ${response.status}`)
    }
    return (await response.json()) as T
  }

  /** 创建评测隔离会话 */
  async createSession(): Promise<string> {
    const data = await this.post<{ success: boolean; sessionId: string }>('/v1/session', {})
    return data.sessionId
  }

  /** 注入纯文本语料 */
  async ingest(sessionId: string, documents: IngestDocument[]): Promise<IngestMapping[]> {
    const data = await this.post<{ success: boolean; mappings: IngestMapping[] }>('/v1/session/ingest', {
      sessionId,
      documents,
    })
    return data.mappings ?? []
  }

  /** 执行一次检索 */
  async search(
    sessionId: string,
    query: string,
    engine: EngineType,
    topK = 10,
  ): Promise<SearchResult> {
    const data = await this.post<{ success: boolean; engine: EngineType; result: SearchResult }>('/v1/search', {
      sessionId,
      query,
      engine,
      topK,
    })
    return data.result
  }

  /** 回收评测隔离会话 */
  async reset(sessionId: string): Promise<void> {
    try {
      await this.post<{ success: boolean }>('/v1/session/reset', { sessionId })
    } catch {
      // 回收失败不影响结果返回
    }
  }
}
