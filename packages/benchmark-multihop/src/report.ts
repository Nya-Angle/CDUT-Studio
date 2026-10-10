/**
 * report.ts — 国际学术规范级评测报告生成器
 *
 * 支持导出 Markdown（可读报告）、JSON（结构化全量数据）与 CSV（逐题明细）三种格式。
 */

import type { EngineSummary, EvaluationReport, QueryEvaluation } from './types'

/** 百分比格式化 */
function pct(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/** 保留四位小数 */
function fixed(value: number): string {
  return value.toFixed(4)
}

/** 按题型统计单一引擎的检索指标 */
function typeBreakdown(
  results: QueryEvaluation[],
): Array<{ type: string; count: number; hitAt10: number; mrr: number; mapAt10: number }> {
  const groups = new Map<string, QueryEvaluation[]>()
  for (const item of results) {
    if (item.isNullQuery) continue
    const list = groups.get(item.questionType) ?? []
    list.push(item)
    groups.set(item.questionType, list)
  }
  return [...groups.entries()].map(([type, items]) => ({
    type,
    count: items.length,
    hitAt10: items.length > 0 ? items.reduce((sum, item) => sum + (item.hitAt10 ?? 0), 0) / items.length : 0,
    mrr: items.length > 0 ? items.reduce((sum, item) => sum + (item.mrr ?? 0), 0) / items.length : 0,
    mapAt10: items.length > 0 ? items.reduce((sum, item) => sum + (item.mapAt10 ?? 0), 0) / items.length : 0,
  }))
}

/** 生成 Markdown 评测报告 */
export function renderMarkdownReport(report: EvaluationReport): string {
  const lines: string[] = []
  lines.push('# MultiHop-RAG 检索增强生成评测报告')
  lines.push('')
  lines.push(`- 数据集：${report.datasetLabel}（\`${report.datasetOrigin}\`）`)
  lines.push(`- 语料规模：${report.corpusSize} 篇文档`)
  lines.push(`- 查询总量：${report.totalQueries} 条（含四大题型：inference / comparison / temporal / null）`)
  lines.push(`- 评测时间：${new Date(report.startedAt).toLocaleString('zh-CN')} → ${new Date(report.finishedAt).toLocaleString('zh-CN')}`)
  lines.push(`- 对比引擎：${report.engines.map((engine) => engine.engine).join(' vs ')}`)
  lines.push('')

  lines.push('## 一、聚合指标总览')
  lines.push('')
  lines.push('| 引擎 | 参评题数 | Hit@4 | Hit@10 | MRR | MAP@10 | 覆盖率(严格) | 覆盖率(加权) | 多跳证据链完整率 | Null 拒答率 | 平均耗时(ms) |')
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const engine of report.engines) {
    const refusal = engine.nullQueries > 0 ? pct(engine.refusalRate) : 'N/A'
    lines.push(
      `| ${engine.engine} | ${engine.scoredQueries} | ${pct(engine.hitAt4)} | ${pct(engine.hitAt10)} | ` +
        `${fixed(engine.mrr)} | ${fixed(engine.mapAt10)} | ${pct(engine.answerCoverageStrict)} | ` +
        `${pct(engine.answerCoverageToken)} | ` +
        `${pct(engine.fullEvidenceRecall)} | ${refusal} | ${engine.avgLatencyMs.toFixed(1)} |`,
    )
  }
  lines.push('')
  lines.push('> 注：`null query`（答案不在语料中）不参与 Hit/MRR/MAP 指标，改以「正确拒答率」评估（口径见第三节）；真正的问答准确率需由大模型生成作答后判定，离线运行器如实不编造该数值。')
  lines.push('')

  lines.push('## 二、分题型检索指标')
  lines.push('')
  for (const engine of report.engines) {
    const results = report.perEngineResults[engine.engine] ?? []
    lines.push(`### ${engine.engine}`)
    lines.push('')
    lines.push('| 题型 | 题数 | Hit@10 | MRR | MAP@10 |')
    lines.push('| --- | ---: | ---: | ---: | ---: |')
    for (const row of typeBreakdown(results)) {
      lines.push(`| ${row.type} | ${row.count} | ${pct(row.hitAt10)} | ${fixed(row.mrr)} | ${fixed(row.mapAt10)} |`)
    }
    lines.push('')
  }

  lines.push('## 三、Null Query 拒答评估')
  lines.push('')
  lines.push('| 引擎 | Null 题数 | 正确拒答率 | 误召回率 |')
  lines.push('| --- | ---: | ---: | ---: |')
  for (const engine of report.engines) {
    if (engine.nullQueries === 0) {
      lines.push(`| ${engine.engine} | 0 | N/A | N/A |`)
      continue
    }
    lines.push(
      `| ${engine.engine} | ${engine.nullQueries} | ${pct(engine.refusalRate)} | ${pct(engine.falseRecallRate)} |`,
    )
  }
  lines.push('')
  lines.push('> **判定口径（数据自校准，无需人工阈值）**：以该引擎在全部非 null 查询上的 top-1 检索分中位数为参考强度；')
  lines.push('> null query 检索不到任何结果、或其 top-1 检索分**严格低于**该参考强度时，判为「正确拒答」，否则判为「误召回」。')
  lines.push('> 该指标为模型无关的检索层代理口径，用于弥补 null query 无金标证据、无法计算 Hit/MRR/MAP 的空白，不等同于大模型级拒答准确率。')
  lines.push('')

  const audit = report.evidenceAudit
  lines.push('## 四、金标证据解析审计')
  lines.push('')
  lines.push('| 指标 | 数值 |')
  lines.push('| --- | ---: |')
  lines.push(`| 证据条目总数 | ${audit.totalEvidence} |`)
  lines.push(`| 成功回溯语料的条目 | ${audit.resolvedEvidence} |`)
  lines.push(`| 解析成功率 | ${pct(audit.resolutionRate)} |`)
  lines.push(`| 存在部分证据未解析的查询数 | ${audit.queriesWithPartialGold} |`)
  lines.push('')
  lines.push('> 该审计用于自证数据可信度：若证据标题大量无法回溯到语料文档，对应查询的金标集合会被动缩小，')
  lines.push('> 从而**系统性抬高** Hit/MRR/MAP。解析成功率接近 100% 时，上表检索指标才可与官方基线直接比较。')
  if (audit.unresolvedSamples.length > 0) {
    lines.push('')
    lines.push('<details><summary>未解析证据样例（最多 20 条）</summary>')
    lines.push('')
    for (const sample of audit.unresolvedSamples) lines.push(`- ${sample}`)
    lines.push('')
    lines.push('</details>')
  }
  lines.push('')

  lines.push('## 五、指标口径说明')
  lines.push('')
  lines.push('- **Hit@4 / Hit@10**：Top-4 / Top-10 检索结果中是否包含任意金标证据文档。')
  lines.push('- **MRR**：首个金标证据文档排名的倒数。')
  lines.push('- **MAP@10**：Top-10 平均精度（多跳证据集）。')
  lines.push('- **覆盖率(严格)**：归一化后金标答案整串包含于检索证据中的比例（历史基线，易被短答案刷分）。')
  lines.push('- **覆盖率(加权)**：把金标答案拆为「日期 / 数字 / 命名实体 / 实词」四类加权单元，统计其在检索证据词元中的加权召回率，能正确反映自由文本答案的证据支撑度。')
  lines.push('- **多跳证据链完整率（Full Evidence Recall）**：一条查询的全部金标证据文档是否均被召回。')
  lines.push('- **Null 拒答率 / 误召回率**：对「答案不在语料中」的查询，系统是否给出了不可信证据（口径见第三节）。')
  lines.push('')

  return lines.join('\n')
}

/** 生成 JSON 报告 */
export function renderJsonReport(report: EvaluationReport): string {
  return JSON.stringify(report, null, 2)
}

/** CSV 单元格转义 */
function csvCell(value: unknown): string {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/** 生成逐题明细 CSV 报告 */
export function renderCsvReport(report: EvaluationReport): string {
  const header = [
    'engine',
    'id',
    'question_type',
    'query',
    'hit_at_4',
    'hit_at_10',
    'mrr',
    'map_at_10',
    'answer_covered_strict',
    'answer_coverage_token',
    'full_evidence_recall',
    'top_score',
    'refusal_correct',
    'latency_ms',
    'gold_keys',
    'retrieved_keys',
    'error',
  ]
  const rows: string[] = [header.join(',')]
  for (const engine of report.engines) {
    for (const item of report.perEngineResults[engine.engine] ?? []) {
      rows.push(
        [
          engine.engine,
          item.id,
          item.questionType,
          item.query,
          item.hitAt4 ?? '',
          item.hitAt10 ?? '',
          item.mrr ?? '',
          item.mapAt10 ?? '',
          item.answerCoveredStrict === null ? '' : item.answerCoveredStrict ? 1 : 0,
          item.answerCoverageToken === null ? '' : item.answerCoverageToken.toFixed(4),
          item.fullEvidenceRecall === null ? '' : item.fullEvidenceRecall ? 1 : 0,
          item.topScore,
          item.refusalCorrect === null ? '' : item.refusalCorrect ? 1 : 0,
          item.latencyMs,
          item.goldKeys.join('|'),
          item.retrievedKeys.join('|'),
          item.error ?? '',
        ]
          .map(csvCell)
          .join(','),
      )
    }
  }
  return rows.join('\n')
}

/** 报告导出文件集合 */
export interface ReportBundle {
  markdown: string
  json: string
  csv: string
}

/** 一次性生成三种格式的报告 */
export function buildReportBundle(report: EvaluationReport): ReportBundle {
  return {
    markdown: renderMarkdownReport(report),
    json: renderJsonReport(report),
    csv: renderCsvReport(report),
  }
}

/** 摘要指标（供前端看板消费） */
export interface ReportHighlight {
  engine: string
  scoredQueries: number
  nullQueries: number
  hitAt4: number
  hitAt10: number
  mrr: number
  mapAt10: number
  answerCoverageStrict: number
  answerCoverageToken: number
  fullEvidenceRecall: number
  refusalRate: number
  falseRecallRate: number
  avgLatencyMs: number
}

/** 提取前端看板所需的摘要 */
export function extractHighlights(report: EvaluationReport): ReportHighlight[] {
  return report.engines.map((engine: EngineSummary) => ({
    engine: engine.engine,
    scoredQueries: engine.scoredQueries,
    nullQueries: engine.nullQueries,
    hitAt4: engine.hitAt4,
    hitAt10: engine.hitAt10,
    mrr: engine.mrr,
    mapAt10: engine.mapAt10,
    answerCoverageStrict: engine.answerCoverageStrict,
    answerCoverageToken: engine.answerCoverageToken,
    fullEvidenceRecall: engine.fullEvidenceRecall,
    refusalRate: engine.refusalRate,
    falseRecallRate: engine.falseRecallRate,
    avgLatencyMs: engine.avgLatencyMs,
  }))
}
