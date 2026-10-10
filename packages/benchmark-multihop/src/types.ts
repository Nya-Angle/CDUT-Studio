/**
 * MultiHop-RAG 评测数据集与指标类型契约
 *
 * 与官方数据集（Hugging Face: yixuantt/MultiHopRAG）字段保持同构：
 *   - 查询集 `MultiHopRAG.json`：query / answer / question_type / evidence_list；
 *   - 语料集 `corpus.json`：title / body / author / published_at / source / category / url。
 *
 * 本文件为独立评测程序私有契约，绝不依赖主程序内部类型。
 */

/** 四大题型（与官方数据集字段取值对齐） */
export type MultiHopQuestionType = 'inference' | 'comparison' | 'temporal' | 'null'

/** 单条证据事实（对应官方 evidence_list 元素） */
export interface MultiHopEvidence {
  /** 该证据支撑的事实描述 */
  fact: string
  /** 证据所属语料来源（官方为出版方名称 / 本程序内部为语料 key） */
  source: string
  /** 证据所属语料标题 */
  title: string
  /** 证据发布日期 */
  published_at: string
  /** 证据作者 */
  author: string
}

/** 单条多跳查询 */
export interface MultiHopQuery {
  id: string
  query: string
  answer: string
  question_type: MultiHopQuestionType
  /** 该查询的全部支撑证据（null query 为空数组） */
  evidence_list: MultiHopEvidence[]
}

/** 单篇语料文档 */
export interface MultiHopCorpusDoc {
  /** 语料稳定标识（用于回传检索命中的文档映射） */
  key: string
  title: string
  body: string
  author: string
  published_at: string
  source: string
  category: string
}

/** 完整评测数据集 */
export interface MultiHopDataset {
  /** 数据集来源标识（embedded-sample / huggingface 等） */
  origin: string
  /** 数据集展示名 */
  label: string
  /** 是否为内置离线样例 */
  embedded: boolean
  corpus: MultiHopCorpusDoc[]
  queries: MultiHopQuery[]
}

// ===== 评测结果契约 =====

/** 单题评测明细 */
export interface QueryEvaluation {
  id: string
  query: string
  questionType: MultiHopQuestionType
  /** 该题为 null query（无支撑语料）时为 true */
  isNullQuery: boolean
  /** 金标证据语料 key 集合 */
  goldKeys: string[]
  /** 检索命中的语料 key 序列（按排名去重） */
  retrievedKeys: string[]
  /** Hit@4（null query 为 null，不参评） */
  hitAt4: number | null
  /** Hit@10 */
  hitAt10: number | null
  /** 首个相关语料的倒数排名（MRR） */
  mrr: number | null
  /** 平均精度 MAP@10 */
  mapAt10: number | null
  /** 金标证据在 Top-4 中的召回比例（连续口径） */
  recallAt4: number | null
  /** 金标证据在 Top-10 中的召回比例（连续口径） */
  recallAt10: number | null
  /** 答案是否被检索证据覆盖（严格口径：归一化整串包含）；null query 为 null */
  answerCoveredStrict: boolean | null
  /** 答案关键信息单元的加权覆盖率（0~1）；null query 为 null */
  answerCoverageToken: number | null
  /** 全部金标证据是否均被召回（多跳证据链完整性） */
  fullEvidenceRecall: boolean | null
  /** 该查询检索结果中的最高分（无结果为 0），用于 null query 拒答判定 */
  topScore: number
  /** null query 是否被判为「正确拒答」；非 null query 恒为 null */
  refusalCorrect: boolean | null
  /** 单题检索耗时（毫秒） */
  latencyMs: number
  error?: string
}

/** 单一引擎的聚合指标 */
export interface EngineSummary {
  engine: string
  /** 参与检索指标计算的题目数（已排除 null query） */
  scoredQueries: number
  /** null query 数量（仅统计，不参与检索指标） */
  nullQueries: number
  hitAt4: number
  hitAt10: number
  mrr: number
  mapAt10: number
  /** 金标证据召回率·Top-4（连续口径） */
  recallAt4: number
  /** 金标证据召回率·Top-10（连续口径） */
  recallAt10: number
  /** 答案证据覆盖率·严格口径（归一化整串包含） */
  answerCoverageStrict: number
  /** 答案证据覆盖率·加权口径（关键信息单元加权召回） */
  answerCoverageToken: number
  /** 多跳证据链完整召回率 */
  fullEvidenceRecall: number
  /** Null Query 正确拒答率（无 null query 时为 0，展示层据 nullQueries 判 N/A） */
  refusalRate: number
  /** Null Query 误召回率 = 1 - 正确拒答率 */
  falseRecallRate: number
  avgLatencyMs: number
}

/** 金标证据解析审计（自证数据可信度） */
export interface EvidenceAudit {
  /** 非 null 查询的证据条目总数 */
  totalEvidence: number
  /** 成功回溯到语料文档的证据条目数 */
  resolvedEvidence: number
  /** 证据标题解析成功率（resolved / total） */
  resolutionRate: number
  /** 存在"部分证据未解析"的查询数（会导致金标集合缩小、指标虚高） */
  queriesWithPartialGold: number
  /** 未解析的证据标题样例（最多 20 条） */
  unresolvedSamples: string[]
}

/** 单次完整评测报告 */
export interface EvaluationReport {
  datasetOrigin: string
  datasetLabel: string
  totalQueries: number
  corpusSize: number
  engines: EngineSummary[]
  perEngineResults: Record<string, QueryEvaluation[]>
  /** 金标证据解析审计 */
  evidenceAudit: EvidenceAudit
  startedAt: number
  finishedAt: number
}
