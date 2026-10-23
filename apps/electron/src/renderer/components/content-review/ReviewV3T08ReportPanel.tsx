/** T08 report workbench: no Main write, no actor spoofing, and no mixed historical runs. */
import * as React from 'react'
import type { CaseAggregateV2, ReviewRunV2, TemplateVersion } from '@profer/shared'
import { makeT08CaseReport, type T08Audience, type T08CaseCycle, type T08RatingSnapshot, type T08Report } from './review-v3-t08-case-report'
import { renderT08ReportPdf } from './review-v3-t08-pdf'
import { encodeF16ReportBundle, encodeF16ReportWorkbook, f16TextBytes } from './review-v3-f16-report-delivery'

interface Props {
  aggregate: CaseAggregateV2 | null
  currentRun: ReviewRunV2 | null
  currentStale: boolean
  template: TemplateVersion | null
  /** Main 授予的受众能力；未提供时只允许学生版，避免 UI 下拉自行提权（RUN-31/UI-15） */
  audienceGrant?: { audience: T08Audience; granted: boolean; reason: string } | null
  /** 同一 T07 冻结轮次的评分快照；缺失时报告如实声明不含评分矩阵（JDG-12） */
  ratingSnapshot?: T08RatingSnapshot | null
  /** 归档恢复代次（ASSET-10） */
  cycle?: T08CaseCycle
}

function safeFilename(name: string): string {
  return name.replace(/[^\p{L}\p{N}._-]+/gu, '_').slice(0, 80)
}
function htmlReport(body: string): string {
  const encoded = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return '<!doctype html><html lang="zh"><meta charset="utf-8"><title>审核报告</title>' +
    '<style>body{font:14px/1.65 system-ui,sans-serif;max-width:850px;margin:40px auto;padding:0 24px;white-space:pre-wrap}'+
    '@page{size:A4;margin:18mm}@media print{body{margin:0;padding:0}}</style><body>'+encoded+'</body></html>'
}
function saveBlob(data: Blob, filename: string): void {
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

async function reportBundle(report: T08Report): Promise<Blob> {
  const workbook = await encodeF16ReportWorkbook(report)
  const pdf = renderT08ReportPdf(report.markdown, '审核报告 · ' + report.runId)
  const files = [
    { name: 'report.md', bytes: f16TextBytes(report.markdown) },
    { name: 'report.json', bytes: f16TextBytes(report.json) },
    { name: 'report.html', bytes: f16TextBytes(htmlReport(report.markdown)) },
    { name: 'report.xlsx', bytes: workbook },
    { name: 'report.pdf', bytes: pdf },
  ]
  const bytes = await encodeF16ReportBundle(report, files)
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return new Blob([buffer], { type: 'application/zip' })
}

export function ReviewV3T08ReportPanel({ aggregate, currentRun, currentStale, template, audienceGrant, ratingSnapshot, cycle }: Props): React.ReactElement {
  const [runs, setRuns] = React.useState<ReviewRunV2[]>([])
  const [selectedId, setSelectedId] = React.useState('')
  const [audience, setAudience] = React.useState<T08Audience>(audienceGrant?.granted ? audienceGrant.audience : 'student')
  const [format, setFormat] = React.useState<'md' | 'json' | 'xlsx' | 'html' | 'pdf' | 'bundle'>('md')
  const [busy, setBusy] = React.useState(false)
  const [notice, setNotice] = React.useState('')
  const caseId = aggregate?.caseV2.id ?? ''

  React.useEffect(() => {
    setRuns(currentRun ? [currentRun] : [])
    setSelectedId(currentRun?.id ?? '')
    setNotice('')
    if (!caseId) return
    let active = true
    void window.reviewAPI.listRunsV2(caseId).then((history) => {
      if (!active) return
      setRuns((previous) => [...new Map([...history, ...previous].map((run) => [run.id, run])).values()])
    }).catch((error) => {
      if (active) setNotice('历史运行列表暂不可用：' + String(error))
    })
    return () => { active = false }
  }, [caseId, currentRun?.id])

  const run = runs.find((item) => item.id === selectedId) ?? currentRun
  const grantedAudience = audienceGrant?.granted ? audienceGrant.audience : 'student'
  // 受 Main 授权的受众是上限：即使组件状态被改成 reviewer，也只能按授权投影。
  const effectiveAudience: T08Audience = audienceGrant?.granted ? audience : 'student'
  const isHistorical = !!run && (run.id !== currentRun?.id || currentStale)
  const report = React.useMemo(() => {
    if (!aggregate || !run) return null
    try {
      return makeT08CaseReport({
        aggregate, run, template, stale: isHistorical,
        audience: effectiveAudience,
        audienceGrant: audienceGrant ?? undefined,
        ratingSnapshot: ratingSnapshot ?? null,
        cycle,
      })
    }
    catch { return null }
  }, [aggregate, run, effectiveAudience, template, isHistorical, audienceGrant, ratingSnapshot, cycle])

  const exportFile = async (): Promise<void> => {
    if (!report) return
    setBusy(true)
    setNotice('')
    try {
      const filename = safeFilename(report.caseId + '-' + report.runId + '-' + report.audience)
      if (format === 'bundle') {
        saveBlob(await reportBundle(report), filename + '-delivery.zip')
      } else if (format === 'pdf') {
        const pdf = renderT08ReportPdf(report.markdown, '审核报告 · ' + report.runId)
        const buffer = new ArrayBuffer(pdf.length)
        new Uint8Array(buffer).set(pdf)
        saveBlob(new Blob([buffer], { type: 'application/pdf' }), filename + '.pdf')
      } else if (format === 'xlsx') {
        const workbook = await encodeF16ReportWorkbook(report)
        const buffer = new ArrayBuffer(workbook.length)
        new Uint8Array(buffer).set(workbook)
        saveBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename + '.xlsx')
      } else {
        const text = format === 'json' ? report.json : format === 'html' ? htmlReport(report.markdown) : report.markdown
        const mime = format === 'json' ? 'application/json' : format === 'html' ? 'text/html' : 'text/markdown'
        saveBlob(new Blob([text], { type: mime + ';charset=utf-8' }), filename + '.' + format)
      }
      setNotice(format === 'pdf' ? '已生成真实 PDF 文件并请求下载。此版本以图片页保留中文，不支持选中文字；请确认文件保存。' :
        format === 'html' ? '已请求保存可打印 HTML；打开后可打印为可检索文字的 PDF。' :
        format === 'bundle' ? '已请求下载只读交接 ZIP（含五种报告格式与 SHA-256 清单）；请确认文件保存。' :
          '已向系统提交文件下载，请确认保存结果。')
    } catch (error) {
      setNotice('导出未完成：' + (error instanceof Error ? error.message : String(error)))
    } finally { setBusy(false) }
  }
  const copy = async (): Promise<void> => {
    if (!report) return
    try { await navigator.clipboard.writeText(report.markdown); setNotice('已复制所选报告的 Markdown 文本。') }
    catch (error) { setNotice('复制失败：' + String(error)) }
  }

  return <section className="space-y-3 text-xs" aria-label="案卷报告">
    {!aggregate || !run || !report
      ? <p className="rounded border border-border p-3 text-muted-foreground">当前案卷还没有可用的审核运行。</p>
      : <>
        <div className="rounded-md bg-muted/50 p-2 leading-5">
          <strong className="block">所选运行 {run.id}</strong>
          <span>状态：{run.status} · 有效判断 {run.coverage.effectiveVerdicts}/{run.coverage.plannedChecks} · 待处理 {run.coverage.pendingChecks}</span>
          <span className="block">案卷：{report.caseId} · 受众：{report.audience}{report.audienceGranted ? '（Main 已授权）' : '（学生版）'} · 归档代次：{report.archiveCycle?.archiveCycle ?? 0}</span>
          <p className="text-muted-foreground">输出绑定该 Run 的 inputManifest；模型意见不等于正式决定。</p>
          {report.stale && <p className="text-amber-700 dark:text-amber-400">历史/过期运行：未冻结的当前案卷字段及补件不会混入该次报告。</p>}
        </div>
        <label className="block space-y-1">选择运行
          <select className="w-full rounded border border-border bg-background p-2" value={run.id} onChange={(event) => setSelectedId(event.target.value)}>
            {runs.map((entry) => <option value={entry.id} key={entry.id}>{entry.id} / {entry.status} / {entry.startedAt}</option>)}
          </select>
        </label>
        <label className="block space-y-1">查看角色
          <select className="w-full rounded border border-border bg-background p-2" value={effectiveAudience}
            onChange={(event) => setAudience(event.target.value as T08Audience)}>
            <option value="student">学生 / 申请人（不含内部意见）</option>
            <option value="reviewer" disabled={!audienceGrant?.granted || grantedAudience === 'student'}>审核人（需 Main 授权）</option>
            <option value="organizer" disabled={!audienceGrant?.granted || grantedAudience !== 'organizer'}>组织者（需 Main 授权）</option>
          </select>
          {!audienceGrant?.granted && <span className="block text-amber-700 dark:text-amber-400">内部受众需由主进程授予；当前仅可导出学生版，下拉不会提升权限。</span>}
          {report.audienceNotice && <span className="block text-muted-foreground">{report.audienceNotice}</span>}
        </label>
        <div className="space-y-1">
          <label htmlFor="t08-export-format">导出格式</label>
          <select id="t08-export-format" className="w-full rounded border border-border bg-background p-2" value={format} onChange={(event) => setFormat(event.target.value as typeof format)}>
            <option value="md">Markdown 报告</option>
            <option value="json">JSON 结构化交接</option>
            <option value="xlsx">XLSX 检查与来源表</option>
            <option value="html">HTML 打印版（可打印为 PDF）</option>
            <option value="pdf">PDF 文件（A4 分页，中文图片页）</option>
            <option value="bundle">只读交接 ZIP（报告 + 哈希清单）</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={() => void exportFile()} className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50">导出所选版本</button>
          <button type="button" onClick={() => void copy()} className="rounded border border-border px-3 py-2">复制 MD</button>
        </div>
        {notice && <p role="status" className="text-muted-foreground">{notice}</p>}
        <details>
          <summary className="cursor-pointer">预览报告（{report.rows.length} 条记录）</summary>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-2 text-[11px]">{report.markdown}</pre>
        </details>
      </>}
  </section>
}
