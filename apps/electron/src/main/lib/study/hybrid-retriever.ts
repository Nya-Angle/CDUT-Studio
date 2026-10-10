/**
 * hybrid-retriever.ts — AI 速课堂「全域跨文档高精度混合检索引擎」
 *
 * 职责：
 *   在 1~10 份文档、百万字级规模下，打通所有文档的切块，提供毫秒级跨文件黄金事实定位。
 *
 * 严格红线约束：
 *   - 纯本地运行，零 SQLite、零重型数据库，全部内存 Map/Set 结构；
 *   - 零磁盘写操作，读取既有索引与图谱缓存；
 *   - 内存常驻可控，全域检索耗时毫秒级。
 *
 * 核心算法（对应实施方案第四节 Domain 2 & 3）：
 *   1. 全域倒排索引：遍历 listStudyRetrievalChunks(sessionId)，为所有切块建立词元倒排表
 *      （记录词元、切块、词频 TF、文档频率 DF、切块长度）；
 *   2. 三路召回：
 *      - 路 1：BM25 词频倒排（精准锁定公式符号、定理编号、专有名词）；
 *      - 路 2：语义 / 关键词主题相关度（捕捉跨文档意图与宏观概念）；
 *      - 路 3：知识图谱 1-Hop 拓扑扩散（命中节点自动激活关联前置 / 题型切块）；
 *   3. RRF 互惠排名无量纲融合：RRF(d) = Σ 1 / (60 + rank)；
 *   4. 上下文显著性剪枝：提取命中切块中与 Query 最相关的关键句（300~500 字黄金事实）。
 */

import { join } from 'node:path'
import type {
  KnowledgeGraphEdge,
  StudySearchKnowledgeResult,
  StudySearchResultItem,
} from '@profer/shared'
import { getStudySessionDir } from '../config-paths'
import { readJsonFileSafe } from '../safe-file'
import { listStudyRetrievalChunks, getStudyIndexFingerprint, MAX_STUDY_RETRIEVAL_TOP_K, type StudyRetrievalChunk } from './study-document-indexer'

// ===== 检索参数常量 =====

/** BM25 词频饱和系数 */
const BM25_K1 = 1.5
/** BM25 长度归一化系数 */
const BM25_B = 0.75
/** RRF 平滑常数（业界标准 60） */
const RRF_K = 60
/** 默认返回切块数 */
const DEFAULT_TOP_K = 5
/** 显著性剪枝输出的黄金事实字符上限 */
const EXCERPT_MAX_CHARS = 500

// ===== 词元过滤 =====

/** 中文 / 英文常见停用词（检索噪音，直接剔除） */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'or', 'to', 'in', 'on', 'is', 'are', 'was', 'were', 'be', 'been',
  'for', 'with', 'as', 'by', 'at', 'from', 'that', 'this', 'these', 'those', 'it', 'its',
  '的', '了', '和', '与', '及', '或', '是', '在', '对', '为', '中', '上', '下', '里', '把', '被',
  '请', '我', '你', '他', '她', '它', '这', '那', '有', '无', '不', '也', '就', '都', '会', '能',
])

/**
 * 词元化：兼容中文（单字 + 相邻 bigram）与英文 / 数字 / 希腊字母 / 公式变量。
 * 例：`拉格朗日中值定理` → 拉 / 格 / … / 拉格 / 格朗 / …；`x^2` → x / 2。
 */
function tokenize(text: string): string[] {
  const lower = text.toLowerCase()
  const tokens: string[] = []
  // 拉丁 / 数字词
  for (const word of lower.match(/[a-z0-9]{2,}/g) ?? []) {
    if (!STOP_WORDS.has(word)) tokens.push(word)
  }
  // 希腊字母（公式变量 / 定理符号）
  for (const greek of lower.match(/[\u0370-\u03ff]{1,2}/g) ?? []) {
    if (!STOP_WORDS.has(greek)) tokens.push(greek)
  }
  // 中文字符
  const han = lower.match(/[\u4e00-\u9fa5]/g) ?? []
  for (let i = 0; i < han.length; i++) {
    const single = han[i]!
    if (!STOP_WORDS.has(single)) tokens.push(single)
    if (i + 1 < han.length) tokens.push(`${single}${han[i + 1]}`)
  }
  return tokens
}

// ===== 倒排索引结构 =====

/** 索引化的切块（含词频、长度与原文） */
interface IndexedChunk {
  chunk: StudyRetrievalChunk
  length: number
  termFreq: Map<string, number>
}

/** 全域倒排索引（单会话维度） */
interface GlobalCorpusIndex {
  chunks: IndexedChunk[]
  /** 词元 → 文档频率 */
  docFreq: Map<string, number>
  /** 平均切块长度 */
  avgLength: number
  /** sectionId → 切块（含 chunk 元数据） */
  bySectionId: Map<string, IndexedChunk>
}

/** 构建全域倒排索引 */
function buildGlobalCorpusIndex(sessionId: string): GlobalCorpusIndex {
  const rawChunks = listStudyRetrievalChunks(sessionId)
  const chunks: IndexedChunk[] = []
  const docFreq = new Map<string, number>()
  const bySectionId = new Map<string, IndexedChunk>()
  let totalLength = 0

  for (const chunk of rawChunks) {
    const text = chunk.content || chunk.summary || chunk.title
    const termFreq = new Map<string, number>()
    const words = tokenize(text)
    for (const word of words) termFreq.set(word, (termFreq.get(word) ?? 0) + 1)
    for (const term of termFreq.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1)
    const indexed: IndexedChunk = { chunk, length: Math.max(1, words.length), termFreq }
    chunks.push(indexed)
    bySectionId.set(chunk.sectionId, indexed)
    totalLength += indexed.length
  }

  return {
    chunks,
    docFreq,
    avgLength: chunks.length > 0 ? totalLength / chunks.length : 1,
    bySectionId,
  }
}

// ===== 图谱 1-Hop 拓扑扩散 =====

/** 读取当前会话图谱缓存边（无缓存返回空数组） */
function readGraphEdges(sessionId: string): KnowledgeGraphEdge[] {
  try {
    const cachePath = join(getStudySessionDir(sessionId), 'knowledge-graph.json')
    const cached = readJsonFileSafe<{ edges?: KnowledgeGraphEdge[] }>(cachePath)
    return Array.isArray(cached?.edges) ? cached.edges : []
  } catch {
    return []
  }
}

/** 由图谱边构建 sectionId 邻接表（双向） */
function buildAdjacency(edges: KnowledgeGraphEdge[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>()
  const link = (a: string, b: string): void => {
    if (!a || !b || a === b) return
    if (!adjacency.has(a)) adjacency.set(a, new Set())
    adjacency.get(a)!.add(b)
  }
  for (const edge of edges) {
    link(edge.sourceSectionId, edge.targetSectionId)
    link(edge.targetSectionId, edge.sourceSectionId)
  }
  return adjacency
}

// ===== 三路召回打分 =====

/** 路 1：BM25 词频倒排打分 */
function scoreBm25(index: GlobalCorpusIndex, queryTerms: string[]): Map<string, number> {
  const scores = new Map<string, number>()
  const totalChunks = index.chunks.length
  for (const chunk of index.chunks) {
    let score = 0
    for (const term of queryTerms) {
      const tf = chunk.termFreq.get(term)
      if (!tf) continue
      const df = index.docFreq.get(term) ?? 0
      const idf = Math.log(1 + (totalChunks - df + 0.5) / (df + 0.5))
      const denom = tf + BM25_K1 * (1 - BM25_B + (BM25_B * chunk.length) / index.avgLength)
      score += idf * ((tf * (BM25_K1 + 1)) / denom)
    }
    if (score > 0) scores.set(chunk.chunk.sectionId, score)
  }
  return scores
}

/** 路 2：语义 / 关键词主题相关度打分（标题权重最高） */
function scoreSemantic(index: GlobalCorpusIndex, queryTerms: string[]): Map<string, number> {
  const uniqueTerms = [...new Set(queryTerms)]
  const scores = new Map<string, number>()
  if (uniqueTerms.length === 0) return scores
  for (const chunk of index.chunks) {
    const titleTerms = new Set(tokenize(chunk.chunk.title))
    const summaryTerms = new Set(tokenize(`${chunk.chunk.summary} ${chunk.chunk.content}`))
    let titleHit = 0
    let summaryHit = 0
    for (const term of uniqueTerms) {
      if (titleTerms.has(term)) titleHit++
      if (summaryTerms.has(term)) summaryHit++
    }
    const coverage = summaryHit / uniqueTerms.length
    const titleOverlap = titleHit / uniqueTerms.length
    const score = coverage * 0.5 + titleOverlap * 0.35 + (summaryHit > 0 ? 0.15 : 0)
    if (score > 0) scores.set(chunk.chunk.sectionId, score)
  }
  return scores
}

/** 依据打分表生成排名序列（降序，仅保留有分者） */
function rankByScore(scores: Map<string, number>): string[] {
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([sectionId]) => sectionId)
}

// ===== 显著性剪枝 =====

/** 按句号 / 问号 / 换行切句 */
function splitSentences(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .split(/(?<=[。！？!?；;])|\n{2,}/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/**
 * 上下文显著性剪枝：提取与 Query 最相关的关键句（去除客套过渡），
 * 按原文顺序拼接为 300~500 字黄金事实摘要。
 */
function pruneToExcerpt(chunk: StudyRetrievalChunk, queryTerms: string[]): string {
  const text = chunk.content || chunk.summary
  const sentences = splitSentences(text)
  if (sentences.length === 0) return chunk.summary || chunk.title
  const termSet = new Set(queryTerms)
  const scored = sentences.map((sentence, order) => {
    const tokens = new Set(tokenize(sentence))
    let hits = 0
    for (const term of termSet) if (tokens.has(term)) hits++
    return { order, sentence, hits }
  })
  // 命中句优先；若整体无命中，则退化为保留开头连续片段
  const matched = scored.filter((item) => item.hits > 0)
  const selected = matched.length > 0 ? matched.sort((a, b) => b.hits - a.hits) : scored.slice(0, 4)
  selected.sort((a, b) => a.order - b.order)

  const parts: string[] = []
  let used = 0
  for (const item of selected) {
    if (used >= EXCERPT_MAX_CHARS) break
    const remain = EXCERPT_MAX_CHARS - used
    const piece = item.sentence.length > remain ? item.sentence.slice(0, remain) : item.sentence
    parts.push(piece)
    used += piece.length
  }
  const excerpt = parts.join('')
  return excerpt.length >= 80 ? excerpt : (chunk.summary || text).slice(0, EXCERPT_MAX_CHARS)
}

// ===== 全域检索器 =====

/** 全域跨文档混合检索器 */
export class GlobalStudyRetriever {
  /** 会话 → { 轻量指纹, 倒排索引 } 缓存（仅指纹变化时重建） */
  private cache = new Map<string, { fingerprint: string; index: GlobalCorpusIndex }>()

  /**
   * 获取（必要时重建）指定会话的全域索引。
   * 先以轻量指纹（目录 stat，不读取切块内容）判断缓存是否可用，
   * 避免每次检索都全量读取索引文件并重新分词。
   */
  private getIndex(sessionId: string): GlobalCorpusIndex {
    const fingerprint = getStudyIndexFingerprint(sessionId)
    const cached = this.cache.get(sessionId)
    if (cached && cached.fingerprint === fingerprint) return cached.index
    const index = buildGlobalCorpusIndex(sessionId)
    this.cache.set(sessionId, { fingerprint, index })
    return index
  }

  /** 失效指定会话（或全部）的索引缓存 */
  invalidate(sessionId?: string): void {
    if (sessionId) this.cache.delete(sessionId)
    else this.cache.clear()
  }

  /**
   * 全域跨文档高精度混合检索。
   * 三路召回 → RRF 融合 → 显著性剪枝，返回全域 Top-K 黄金事实切块。
   */
  searchHybrid(
    sessionId: string,
    query: string,
    options: { targetDocumentId?: string; topK?: number } = {},
  ): StudySearchKnowledgeResult {
    const topK = Math.max(1, Math.min(MAX_STUDY_RETRIEVAL_TOP_K, options.topK ?? DEFAULT_TOP_K))
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return { success: false, items: [], error: 'EMPTY_QUERY' }

    try {
      const index = this.getIndex(sessionId)
      if (index.chunks.length === 0) return { success: true, items: [] }

      const queryTerms = tokenize(trimmedQuery)
      if (queryTerms.length === 0) return { success: true, items: [] }

      // 指定单文档检索时，先裁剪出目标文档切块集合（图谱扩散仍可在全域邻接上进行）
      const allowedSectionIds = options.targetDocumentId
        ? new Set(
            index.chunks
              .filter((chunk) => chunk.chunk.documentId === options.targetDocumentId)
              .map((chunk) => chunk.chunk.sectionId),
          )
        : null

      // 路 1：BM25
      const bm25Rank = rankByScore(scoreBm25(index, queryTerms))
      // 路 2：语义主题相关度
      const semanticRank = rankByScore(scoreSemantic(index, queryTerms))

      // 路 3：图谱 1-Hop 拓扑扩散（以前两路 Top 命中的节点为种子）
      const seeds = [...bm25Rank.slice(0, 5), ...semanticRank.slice(0, 5)]
      const adjacency = buildAdjacency(readGraphEdges(sessionId))
      const graphRank: string[] = []
      const graphSeen = new Set<string>()
      for (const seed of seeds) {
        for (const neighbor of adjacency.get(seed) ?? []) {
          if (graphSeen.has(neighbor)) continue
          graphSeen.add(neighbor)
          graphRank.push(neighbor)
        }
      }

      // RRF 互惠排名融合
      const rrf = new Map<string, number>()
      const accumulate = (rankList: string[]): void => {
        rankList.forEach((sectionId, idx) => {
          if (!index.bySectionId.has(sectionId)) return
          if (allowedSectionIds && !allowedSectionIds.has(sectionId)) return
          rrf.set(sectionId, (rrf.get(sectionId) ?? 0) + 1 / (RRF_K + idx + 1))
        })
      }
      accumulate(bm25Rank)
      accumulate(semanticRank)
      accumulate(graphRank)

      if (rrf.size === 0) return { success: true, items: [] }

      const rankedSectionIds = [...rrf.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, topK)

      const items: StudySearchResultItem[] = rankedSectionIds.map(([sectionId, score]) => {
        const indexed = index.bySectionId.get(sectionId)!
        const chunk = indexed.chunk
        return {
          documentId: chunk.documentId,
          documentFileName: chunk.fileName,
          sectionId: chunk.sectionId,
          sectionTitle: chunk.title,
          score: Math.round(score * 10_000) / 10_000,
          matchedExcerpt: pruneToExcerpt(chunk, queryTerms),
          ...(chunk.pageRange ? { pageRange: chunk.pageRange } : {}),
        }
      })

      return { success: true, items }
    } catch (error) {
      console.warn('[速课堂检索] 全域混合检索失败:', error)
      return { success: false, items: [], error: 'SEARCH_FAILED' }
    }
  }
}

// ===== 单例 =====

let singleton: GlobalStudyRetriever | null = null

/** 获取全域跨文档混合检索器单例 */
export function getGlobalStudyRetriever(): GlobalStudyRetriever {
  if (!singleton) singleton = new GlobalStudyRetriever()
  return singleton
}
