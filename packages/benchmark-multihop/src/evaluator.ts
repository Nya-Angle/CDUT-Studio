/**
 * evaluator.ts — MultiHop-RAG 评测执行引擎
 *
 * 编排「语料注入 → 双引擎检索 → 指标统计」全流程，产出结构化评测报告。
 * 检索层与问答层指标口径详见 metrics.ts 顶部说明。
 */

import { computeAnswerCoverage, computeNullRefusalFlags, mean, normalizeText, scoreRetrieval } from './metrics'
import type { BenchmarkRunner, EngineType, IngestMapping } from './runner'
import type {
  EngineSummary,
  EvaluationReport,
  EvidenceAudit,
  MultiHopDataset,
  MultiHopQuery,
  QueryEvaluation,
} from './types'

/** 评测进度事件 */
export interface ProgressEvent {
  phase: string
  engine: string
  engineIndex: number
  engineCount: number
  completed: number
  total: number
}

/** 评测选项 */
export interface EvaluationOptions {
  engines: EngineType[]
  topK: number
  concurrency: number
  onProgress?: (event: ProgressEvent) => void
}

/** 默认评测选项 */
export const DEFAULT_EVALUATION_OPTIONS: Omit<EvaluationOptions, 'onProgress'> = {
  engines: ['classic', 'graphrag'],
  topK: 10,
  concurrency: 4,
}

/** 解析语料标题 → key 的索引（用于把证据标题回溯为语料 key） */
function buildTitleKeyIndex(dataset: MultiHopDataset): Map<string, string> {
  const map = new Map<string, string>()
  for (const doc of dataset.corpus) {
    map.set(normalizeText(doc.title), doc.key)
  }
  return map
}

/** 单条查询的金标证据语料 key 集合 */
function resolveGoldKeys(query: MultiHopQuery, titleIndex: Map<string, string>): string[] {
  const keys = new Set<string>()
  for (const evidence of query.evidence_list) {
    const key = titleIndex.get(normalizeText(evidence.title))
    if (key) keys.add(key)
  }
  return [...keys]
}

/**
 * 审计金标证据标题能否回溯到语料文档。
 *
 * 关键意义：若部分证据标题解析失败，该查询的金标集合会被动缩小（甚至变空），
 * 从而让 Hit/MRR/MAP 被**系统性抬高**。必须先自证解析成功率，结论才可对外背书。
 */
function buildEvidenceAudit(dataset: MultiHopDataset, titleIndex: Map<string, string>): EvidenceAudit {
  let totalEvidence = 0
  let resolvedEvidence = 0
  let queriesWithPartialGold = 0
  const unresolvedSamples: string[] = []
  for (const query of dataset.queries) {
    if (query.question_type === 'null') continue
    let resolved = 0
    for (const evidence of query.evidence_list) {
      totalEvidence += 1
      if (titleIndex.has(normalizeText(evidence.title))) {
        resolved += 1
        resolvedEvidence += 1
      } else if (unresolvedSamples.length < 20) {
        unresolvedSamples.push(`${query.id} · ${evidence.title}`)
      }
    }
    if (resolved < query.evidence_list.length) queriesWithPartialGold += 1
  }
  return {
    totalEvidence,
    resolvedEvidence,
    resolutionRate: totalEvidence > 0 ? resolvedEvidence / totalEvidence : 0,
    queriesWithPartialGold,
    unresolvedSamples,
  }
}

/** 并发受限的 map */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const size = Math.max(1, Math.min(concurrency, items.length))
  const runners = Array.from({ length: size }, async () => {
    while (true) {
      const index = cursor++
      if (index >= items.length) return
      const item = items[index] as T
      results[index] = await worker(item, index)
    }
  })
  await Promise.all(runners)
  return results
}

/** 评测单词查询（调用主程序检索接口并换算指标） */
async function evaluateQuery(
  runner: BenchmarkRunner,
  sessionId: string,
  query: MultiHopQuery,
  goldKeys: string[],
  docIdToKey: Map<string, string>,
  engine: EngineType,
  topK: number,
): Promise<QueryEvaluation> {
  const isNullQuery = query.question_type === 'null' || goldKeys.length === 0
  const startedAt = performance.now()
  try {
    const result = await runner.search(sessionId, query.query, engine, topK)
    const latencyMs = Math.round(performance.now() - startedAt)
    const topScore = result.items.reduce((max, item) => Math.max(max, item.score), 0)

    // 文档级检索：按排名对 documentId 去重后映射回语料 key
    const seen = new Set<string>()
    const rankedKeys: string[] = []
    for (const item of result.items) {
      if (seen.has(item.documentId)) continue
      seen.add(item.documentId)
      const key = docIdToKey.get(item.documentId)
      if (key) rankedKeys.push(key)
    }

    if (isNullQuery) {
      return {
        id: query.id,
        query: query.query,
        questionType: query.question_type,
        isNullQuery: true,
        goldKeys,
        retrievedKeys: rankedKeys,
        hitAt4: null,
        hitAt10: null,
        mrr: null,
        mapAt10: null,
        recallAt4: null,
        recallAt10: null,
        answerCoveredStrict: null,
        answerCoverageToken: null,
        fullEvidenceRecall: null,
        topScore,
        refusalCorrect: null,
        latencyMs,
      }
    }

    const score = scoreRetrieval(rankedKeys, goldKeys)
    const evidenceText = result.items.map((item) => item.matchedExcerpt).join('\n')
    const retrievedSet = new Set(rankedKeys)
    const coverage = computeAnswerCoverage(query.answer, evidenceText)
    return {
      id: query.id,
      query: query.query,
      questionType: query.question_type,
      isNullQuery: false,
      goldKeys,
      retrievedKeys: rankedKeys,
      hitAt4: score.hitAt4,
      hitAt10: score.hitAt10,
      mrr: score.mrr,
      mapAt10: score.mapAt10,
      recallAt4: score.recallAt4,
      recallAt10: score.recallAt10,
      answerCoveredStrict: coverage.strict,
      answerCoverageToken: coverage.token,
      fullEvidenceRecall: goldKeys.every((key) => retrievedSet.has(key)),
      topScore,
      refusalCorrect: null,
      latencyMs,
    }
  } catch (error) {
    return {
      id: query.id,
      query: query.query,
      questionType: query.question_type,
      isNullQuery,
      goldKeys,
      retrievedKeys: [],
      hitAt4: isNullQuery ? null : 0,
      hitAt10: isNullQuery ? null : 0,
      mrr: isNullQuery ? null : 0,
      mapAt10: isNullQuery ? null : 0,
      recallAt4: isNullQuery ? null : 0,
      recallAt10: isNullQuery ? null : 0,
      answerCoveredStrict: isNullQuery ? null : false,
      answerCoverageToken: isNullQuery ? null : 0,
      fullEvidenceRecall: isNullQuery ? null : false,
      topScore: 0,
      refusalCorrect: null,
      latencyMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/** 汇总单一引擎的聚合指标 */
function summarize(engine: string, results: QueryEvaluation[]): EngineSummary {
  const scored = results.filter((item) => !item.isNullQuery && item.hitAt10 !== null)
  const nullResults = results.filter((item) => item.isNullQuery)

  // Null Query 拒答判定：以本引擎全部非 null 查询的 top-1 分中位数为参考强度
  const refusalFlags = computeNullRefusalFlags(
    nullResults.map((item) => item.topScore),
    scored.map((item) => item.topScore),
  )
  nullResults.forEach((item, index) => {
    item.refusalCorrect = refusalFlags[index] ?? false
  })
  const refusalRate = refusalFlags.length > 0 ? mean(refusalFlags.map((flag) => (flag ? 1 : 0))) : 0

  return {
    engine,
    scoredQueries: scored.length,
    nullQueries: nullResults.length,
    hitAt4: mean(scored.map((item) => item.hitAt4 ?? 0)),
    hitAt10: mean(scored.map((item) => item.hitAt10 ?? 0)),
    mrr: mean(scored.map((item) => item.mrr ?? 0)),
    mapAt10: mean(scored.map((item) => item.mapAt10 ?? 0)),
    recallAt4: mean(scored.map((item) => item.recallAt4 ?? 0)),
    recallAt10: mean(scored.map((item) => item.recallAt10 ?? 0)),
    answerCoverageStrict: mean(scored.map((item) => (item.answerCoveredStrict ? 1 : 0))),
    answerCoverageToken: mean(scored.map((item) => item.answerCoverageToken ?? 0)),
    fullEvidenceRecall: mean(scored.map((item) => (item.fullEvidenceRecall ? 1 : 0))),
    refusalRate,
    falseRecallRate: refusalFlags.length > 0 ? 1 - refusalRate : 0,
    avgLatencyMs: mean(results.map((item) => item.latencyMs)),
  }
}

/**
 * 执行完整评测：注入语料 → 逐引擎检索 → 汇总指标 → 回收会话。
 */
export async function runEvaluation(
  runner: BenchmarkRunner,
  dataset: MultiHopDataset,
  options: EvaluationOptions,
): Promise<EvaluationReport> {
  const startedAt = Date.now()
  const sessionId = await runner.createSession()
  try {
    options.onProgress?.({
      phase: '正在注入语料并建立索引',
      engine: '',
      engineIndex: 0,
      engineCount: options.engines.length,
      completed: 0,
      total: dataset.queries.length,
    })

    const mappings: IngestMapping[] = await runner.ingest(
      sessionId,
      dataset.corpus.map((doc) => ({ key: doc.key, title: doc.title, content: doc.body })),
    )
    const docIdToKey = new Map(mappings.map((item) => [item.documentId, item.key]))

    const titleIndex = buildTitleKeyIndex(dataset)
    const goldKeysByQuery = new Map<string, string[]>(
      dataset.queries.map((query) => [query.id, resolveGoldKeys(query, titleIndex)]),
    )

    const perEngineResults: Record<string, QueryEvaluation[]> = {}
    const engines: EngineSummary[] = []

    for (let engineIndex = 0; engineIndex < options.engines.length; engineIndex++) {
      const engine = options.engines[engineIndex] as EngineType
      let completed = 0
      const results = await mapWithConcurrency(dataset.queries, options.concurrency, async (query) => {
        const goldKeys = goldKeysByQuery.get(query.id) ?? []
        const evaluation = await evaluateQuery(
          runner,
          sessionId,
          query,
          goldKeys,
          docIdToKey,
          engine,
          options.topK,
        )
        completed += 1
        options.onProgress?.({
          phase: '正在执行双引擎检索比对',
          engine,
          engineIndex,
          engineCount: options.engines.length,
          completed,
          total: dataset.queries.length,
        })
        return evaluation
      })
      perEngineResults[engine] = results
      engines.push(summarize(engine, results))
    }

    return {
      datasetOrigin: dataset.origin,
      datasetLabel: dataset.label,
      totalQueries: dataset.queries.length,
      corpusSize: dataset.corpus.length,
      engines,
      perEngineResults,
      evidenceAudit: buildEvidenceAudit(dataset, titleIndex),
      startedAt,
      finishedAt: Date.now(),
    }
  } finally {
    await runner.reset(sessionId)
  }
}
