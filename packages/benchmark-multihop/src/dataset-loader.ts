/**
 * dataset-loader.ts — 数据集加载器
 *
 * 支持两类数据源：
 *   - 内置离线样例：随包携带，开箱秒测（详见 dataset.ts）；
 *   - 官方全集：一键从 Hugging Face `yixuantt/MultiHopRAG` 拉取并本地缓存，
 *     与内置样例字段同构，可直接参与同一套评测流程。
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMBEDDED_SAMPLE } from './dataset'
import type { MultiHopCorpusDoc, MultiHopDataset, MultiHopEvidence, MultiHopQuery, MultiHopQuestionType } from './types'

/** 官方数据集文件地址（Hugging Face resolve 端点） */
const HF_BASE = 'https://huggingface.co/datasets/yixuantt/MultiHopRAG/resolve/main'
const HF_QUERIES_URL = `${HF_BASE}/MultiHopRAG.json`
const HF_CORPUS_URL = `${HF_BASE}/corpus.json`

/** 本地缓存目录（包内 data/） */
function cacheDir(): string {
  return join(import.meta.dir, '..', 'data')
}

/** 官方数据集本地缓存文件路径 */
function officialCachePath(): string {
  return join(cacheDir(), 'official-multihoprag.json')
}

/** 加载内置离线样例 */
export function loadEmbeddedDataset(): MultiHopDataset {
  return EMBEDDED_SAMPLE
}

/** 是否已缓存官方全集 */
export function hasCachedOfficialDataset(): boolean {
  return existsSync(officialCachePath())
}

/** 读取已缓存的官方全集；未缓存返回 null */
export function loadCachedOfficialDataset(): MultiHopDataset | null {
  const path = officialCachePath()
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as MultiHopDataset
  } catch {
    return null
  }
}

/** 题型取值归一化（兼容官方带后缀的命名） */
function normalizeQuestionType(raw: unknown): MultiHopQuestionType {
  const value = String(raw ?? '').toLowerCase()
  if (value.includes('temporal')) return 'temporal'
  if (value.includes('comparison')) return 'comparison'
  if (value.includes('null')) return 'null'
  if (value.includes('inference')) return 'inference'
  return 'inference'
}

/** 把官方原始查询数据规整为内部结构 */
function normalizeQueries(raw: unknown[]): MultiHopQuery[] {
  return raw.map((item, index) => {
    const record = (item ?? {}) as Record<string, unknown>
    const rawEvidence = Array.isArray(record.evidence_list) ? record.evidence_list : []
    const evidence_list: MultiHopEvidence[] = rawEvidence.map((entry) => {
      const ev = (entry ?? {}) as Record<string, unknown>
      return {
        fact: String(ev.fact ?? ''),
        source: String(ev.source ?? ''),
        title: String(ev.title ?? ''),
        published_at: String(ev.published_at ?? ''),
        author: String(ev.author ?? ''),
      }
    })
    return {
      id: `hf-${index + 1}`,
      query: String(record.query ?? ''),
      answer: String(record.answer ?? ''),
      question_type: normalizeQuestionType(record.question_type),
      evidence_list,
    }
  })
}

/** 把官方原始语料数据规整为内部结构 */
function normalizeCorpus(raw: unknown[]): MultiHopCorpusDoc[] {
  return raw.map((item, index) => {
    const record = (item ?? {}) as Record<string, unknown>
    const url = typeof record.url === 'string' && record.url.length > 0 ? record.url : ''
    return {
      key: url || `news-${index + 1}`,
      title: String(record.title ?? `news-${index + 1}`),
      body: String(record.body ?? ''),
      author: String(record.author ?? ''),
      published_at: String(record.published_at ?? ''),
      source: String(record.source ?? ''),
      category: String(record.category ?? ''),
    }
  })
}

/** 下载官方全集并写入本地缓存 */
export async function downloadOfficialDataset(
  onPhase?: (phase: string) => void,
): Promise<MultiHopDataset> {
  onPhase?.('正在下载官方查询集 MultiHopRAG.json …')
  const queriesResponse = await fetch(HF_QUERIES_URL)
  if (!queriesResponse.ok) throw new Error(`下载查询集失败：HTTP ${queriesResponse.status}`)
  const rawQueries = (await queriesResponse.json()) as unknown[]

  onPhase?.('正在下载官方语料集 corpus.json …')
  const corpusResponse = await fetch(HF_CORPUS_URL)
  if (!corpusResponse.ok) throw new Error(`下载语料集失败：HTTP ${corpusResponse.status}`)
  const rawCorpus = (await corpusResponse.json()) as unknown[]

  onPhase?.('正在规整并缓存数据集 …')
  const dataset: MultiHopDataset = {
    origin: 'huggingface:yixuantt/MultiHopRAG',
    label: '官方全集 MultiHop-RAG（2556 题）',
    embedded: false,
    corpus: normalizeCorpus(rawCorpus),
    queries: normalizeQueries(rawQueries),
  }

  const dir = cacheDir()
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(officialCachePath(), JSON.stringify(dataset), 'utf-8')
  return dataset
}

/** 是否已存在官方缓存；存在则直接读取，否则实时下载 */
export async function loadOrDownloadOfficialDataset(
  onPhase?: (phase: string) => void,
): Promise<MultiHopDataset> {
  const cached = loadCachedOfficialDataset()
  if (cached) return cached
  return downloadOfficialDataset(onPhase)
}
