/**
 * hierarchical-graphrag-retriever.ts — 分层认知检索器与粒度分析
 *
 * 职责（离线教学速课堂 GraphRAG 增强检索链路）：
 *   在既有经典混合检索（hybrid-retriever.ts，保持 100% 不动）之外，提供单开独立的
 *   分层图谱检索：把全域切块视为图节点，融合知识图谱边与有界共现边，经 Leiden
 *   聚类得到三层社群（level 0 考点 / level 1 章节模块 / level 2 课程宏观思想）。
 *
 * 检索策略：
 *   - 常规 query：按「词法相关度 + 社群归属」综合打分，返回 chunk 级结果；
 *   - 宏观意图 query（命中 思想/演变/概述/全局/总结/主线/体系 等词）：额外把
 *     level-2 社群摘要作为条目返回（sectionId 形如 `community::L2::n`）。
 *
 * 严格红线：
 *   - 纯本地内存算法，零 SQLite、零重型数据库；只读既有索引与图谱缓存；
 *   - 绝不伪造原文；任一步骤异常均安全兜底为 `SEARCH_FAILED`。
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
import { buildHierarchicalCommunities, type CommunityNode, type WeightedEdge } from './hierarchical-graphrag'

// ===== 检索参数常量 =====

/** 默认返回切块数 */
const DEFAULT_TOP_K = 5
/** 有界共现边：跨文档概念共现的边数硬上限（防组合爆炸） */
const MAX_COOCCURRENCE_EDGES = 2000
/** 显著性剪枝输出的黄金事实字符上限 */
const EXCERPT_MAX_CHARS = 500
/** 宏观意图触发词（命中即追加 level-2 社群摘要条目） */
const MACRO_INTENT_WORDS = ['思想', '演变', '概述', '全局', '总结', '主线', '体系']
/** 宏观社群条目的来源文档名 */
const MACRO_DOCUMENT_NAME = '课程宏观思想'

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
 * 与 hybrid-retriever.ts 保持同一套轻量方案（此处为本地实现，不改动既有文件）。
 */
function tokenize(text: string): string[] {
  const lower = text.toLowerCase()
  const tokens: string[] = []
  for (const word of lower.match(/[a-z0-9]{2,}/g) ?? []) {
    if (!STOP_WORDS.has(word)) tokens.push(word)
  }
  for (const greek of lower.match(/[\u0370-\u03ff]{1,2}/g) ?? []) {
    if (!STOP_WORDS.has(greek)) tokens.push(greek)
  }
  const han = lower.match(/[\u4e00-\u9fa5]/g) ?? []
  for (let i = 0; i < han.length; i++) {
    const single = han[i]!
    if (!STOP_WORDS.has(single)) tokens.push(single)
    if (i + 1 < han.length) tokens.push(`${single}${han[i + 1]}`)
  }
  return tokens
}

// ===== 图谱边读取 =====

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

/** 解析 sectionId 的章节序号（用于同文档相邻切块排序） */
function sectionOrder(sectionId: string): number {
  const match = /-s(\d+)$/.exec(sectionId)
  return match ? Number(match[1]) : 0
}

/** 全局唯一记录化边（去重，避免重复权重累积） */
function createEdgeCollector(): {
  edges: WeightedEdge[]
  add: (a: string, b: string, weight: number) => void
} {
  const edges: WeightedEdge[] = []
  const seen = new Set<string>()
  const add = (a: string, b: string, weight: number): void => {
    if (!a || !b || a === b) return
    const key = a < b ? `${a}|${b}` : `${b}|${a}`
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ source: a, target: b, weight })
  }
  return { edges, add }
}

/**
 * 构建 section 级图边：知识图谱边 + 有界共现边（同文档相邻章节 + 跨文档概念共现）。
 * 有界共现边受 MAX_COOCCURRENCE_EDGES 约束，避免百万字规模下的组合爆炸。
 */
function buildChunkEdges(sessionId: string, chunks: StudyRetrievalChunk[]): WeightedEdge[] {
  const collector = createEdgeCollector()
  const { edges, add } = collector

  // 边源 1：既有知识图谱边（sectionId 级）
  for (const edge of readGraphEdges(sessionId)) {
    add(edge.sourceSectionId, edge.targetSectionId, 1.0)
  }

  // 边源 2：同文档相邻章节（体现线性叙事结构）
  const byDocument = new Map<string, StudyRetrievalChunk[]>()
  for (const chunk of chunks) {
    const list = byDocument.get(chunk.documentId) ?? []
    list.push(chunk)
    byDocument.set(chunk.documentId, list)
  }
  for (const list of byDocument.values()) {
    list.sort((a, b) => sectionOrder(a.sectionId) - sectionOrder(b.sectionId))
    for (let i = 1; i < list.length; i++) {
      add(list[i - 1]!.sectionId, list[i]!.sectionId, 0.8)
    }
  }

  // 边源 3：跨文档概念共现（仅在边数未触顶时补充，稀有概念优先）
  if (edges.length < MAX_COOCCURRENCE_EDGES) {
    const termIndex = new Map<string, string[]>()
    for (const chunk of chunks) {
      const terms = new Set(tokenize(`${chunk.title} ${chunk.summary}`))
      for (const term of terms) {
        const list = termIndex.get(term) ?? []
        list.push(chunk.sectionId)
        termIndex.set(term, list)
      }
    }
    for (const ids of termIndex.values()) {
      if (ids.length < 2 || ids.length > 8) continue
      for (let i = 0; i < ids.length && edges.length < MAX_COOCCURRENCE_EDGES; i++) {
        for (let j = i + 1; j < ids.length && edges.length < MAX_COOCCURRENCE_EDGES; j++) {
          add(ids[i]!, ids[j]!, 0.5)
        }
      }
      if (edges.length >= MAX_COOCCURRENCE_EDGES) break
    }
  }

  return edges
}

// ===== 显著性剪枝 =====

/** 按句末标点 / 换行切句 */
function splitSentences(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .split(/(?<=[。！？!?；;])|\n{2,}/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/** 提取与 query 最相关的关键句，拼接为 300~500 字黄金事实摘要 */
function buildExcerpt(chunk: StudyRetrievalChunk, queryTerms: string[]): string {
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

// ===== 分层认知检索器 =====

/** 社群归属信息（按 level 汇总） */
interface CommunityIndex {
  /** sectionId → level 1 社群编号 */
  level1Of: Map<string, number>
  /** level 1 社群编号 → 成员标题词元集合（社群归属打分依据） */
  level1Terms: Map<number, Set<string>>
  /** level 2 宏观社群 */
  level2: CommunityNode[]
}

/** 依据分层社群结果构建检索所需的社群索引 */
function buildCommunityIndex(
  chunks: StudyRetrievalChunk[],
  communities: CommunityNode[],
): CommunityIndex {
  const chunkById = new Map<string, StudyRetrievalChunk>()
  for (const chunk of chunks) chunkById.set(chunk.sectionId, chunk)

  const level1Of = new Map<string, number>()
  const level1Members = new Map<number, string[]>()
  const level2: CommunityNode[] = []

  for (const community of communities) {
    if (community.level === 1) {
      const number = Number(community.id.split('::')[1] ?? '0')
      for (const member of community.memberEntities) {
        level1Of.set(member, number)
        const list = level1Members.get(number) ?? []
        list.push(member)
        level1Members.set(number, list)
      }
    } else if (community.level === 2) {
      level2.push(community)
    }
  }

  const level1Terms = new Map<number, Set<string>>()
  for (const [number, members] of level1Members) {
    const terms = new Set<string>()
    for (const sectionId of members) {
      const chunk = chunkById.get(sectionId)
      if (chunk) for (const term of tokenize(chunk.title)) terms.add(term)
    }
    level1Terms.set(number, terms)
  }

  return { level1Of, level1Terms, level2 }
}

/** 分层认知检索器 */
export class HierarchicalGraphRagRetriever {
  /** 会话 → { 轻量指纹, 切块, 社群索引 } 缓存（图边构建与 Leiden 聚类只做一次） */
  private cache = new Map<
    string,
    { fingerprint: string; chunks: StudyRetrievalChunk[]; communityIndex: CommunityIndex }
  >()

  /** 失效指定会话（或全部）的分层索引缓存 */
  invalidate(sessionId?: string): void {
    if (sessionId) this.cache.delete(sessionId)
    else this.cache.clear()
  }

  /**
   * 获取（必要时重建）分层社群索引。
   * 图边构建 + Leiden 聚类 + 社群索引是重计算，按轻量指纹缓存，避免每题重跑。
   */
  private getArtifacts(
    sessionId: string,
  ): { chunks: StudyRetrievalChunk[]; communityIndex: CommunityIndex } {
    const fingerprint = getStudyIndexFingerprint(sessionId)
    const cached = this.cache.get(sessionId)
    if (cached && cached.fingerprint === fingerprint) return cached

    const chunks = listStudyRetrievalChunks(sessionId)
    const edges = buildChunkEdges(sessionId, chunks)
    const communities = buildHierarchicalCommunities({
      nodes: chunks.map((chunk) => ({ id: chunk.sectionId, title: chunk.title })),
      edges,
    })
    const communityIndex = buildCommunityIndex(chunks, communities)

    const artifacts = { fingerprint, chunks, communityIndex }
    this.cache.set(sessionId, artifacts)
    return artifacts
  }

  /**
   * 分层图谱检索。
   *
   * @param sessionId 速课堂会话标识
   * @param query 检索查询词或学生的具体提问
   * @param options 可选：限定文档与返回条数
   */
  search(
    sessionId: string,
    query: string,
    options: { targetDocumentId?: string; topK?: number } = {},
  ): StudySearchKnowledgeResult {
    const topK = Math.max(1, Math.min(MAX_STUDY_RETRIEVAL_TOP_K, options.topK ?? DEFAULT_TOP_K))
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return { success: false, items: [], error: 'EMPTY_QUERY' }

    try {
      const { chunks, communityIndex: index } = this.getArtifacts(sessionId)
      if (chunks.length === 0) return { success: true, items: [] }

      const uniqueTerms = [...new Set(tokenize(trimmedQuery))]
      if (uniqueTerms.length === 0) return { success: true, items: [] }

      // 2. 常规 query：词法相关度 + 社群归属综合打分
      const scoped = options.targetDocumentId
        ? chunks.filter((chunk) => chunk.documentId === options.targetDocumentId)
        : chunks
      const ranked = scoped
        .map((chunk) => ({ chunk, score: scoreChunk(chunk, uniqueTerms, index) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)

      const items: StudySearchResultItem[] = ranked.map(({ chunk, score }) => ({
        documentId: chunk.documentId,
        documentFileName: chunk.fileName,
        sectionId: chunk.sectionId,
        sectionTitle: chunk.title,
        score: Math.round(score * 10_000) / 10_000,
        matchedExcerpt: buildExcerpt(chunk, uniqueTerms),
        ...(chunk.pageRange ? { pageRange: chunk.pageRange } : {}),
      }))

      // 3. 宏观意图：额外把 level-2 社群摘要作为条目返回
      const macroItems = MACRO_INTENT_WORDS.some((word) => trimmedQuery.includes(word))
        ? buildMacroCommunityItems(index.level2, uniqueTerms)
        : []

      return { success: true, items: [...macroItems, ...items] }
    } catch (error) {
      console.warn('[速课堂检索] 分层图谱检索失败:', error)
      return { success: false, items: [], error: 'SEARCH_FAILED' }
    }
  }
}

/** 单切块的「词法相关度 × 社群归属」综合打分 */
function scoreChunk(
  chunk: StudyRetrievalChunk,
  uniqueTerms: string[],
  index: CommunityIndex,
): number {
  const titleTerms = new Set(tokenize(chunk.title))
  const bodyTerms = new Set(tokenize(`${chunk.summary} ${chunk.content}`))

  let titleHits = 0
  let bodyHits = 0
  for (const term of uniqueTerms) {
    if (titleTerms.has(term)) titleHits++
    else if (bodyTerms.has(term)) bodyHits++
  }
  const lexical = (titleHits + bodyHits * 0.6) / uniqueTerms.length

  // 社群归属：命中社群成员标题词元越多，归属感越强
  const communityNumber = index.level1Of.get(chunk.sectionId)
  const communityTerms = communityNumber !== undefined ? index.level1Terms.get(communityNumber) : undefined
  let communityBoost = 0
  if (communityTerms) {
    let hits = 0
    for (const term of uniqueTerms) if (communityTerms.has(term)) hits++
    communityBoost = hits / uniqueTerms.length
  }

  return lexical * 0.7 + communityBoost * 0.3
}

/** 把 level-2 宏观社群转为检索条目（摘要即社群 summary，绝不编造） */
function buildMacroCommunityItems(
  level2Communities: CommunityNode[],
  uniqueTerms: string[],
): StudySearchResultItem[] {
  return level2Communities.map((community, position) => {
    const terms = new Set(tokenize(`${community.title} ${community.summary}`))
    let hits = 0
    for (const term of uniqueTerms) if (terms.has(term)) hits++
    const relevance = uniqueTerms.length > 0 ? hits / uniqueTerms.length : 0
    return {
      documentId: 'macro-community',
      documentFileName: MACRO_DOCUMENT_NAME,
      sectionId: `community::L2::${position}`,
      sectionTitle: community.title,
      score: Math.round((0.5 + relevance * 0.5) * 10_000) / 10_000,
      matchedExcerpt: community.summary,
    }
  })
}

// ===== 单例 =====

let singleton: HierarchicalGraphRagRetriever | null = null

/** 获取分层图谱检索器单例 */
export function getHierarchicalGraphRagRetriever(): HierarchicalGraphRagRetriever {
  if (!singleton) singleton = new HierarchicalGraphRagRetriever()
  return singleton
}
