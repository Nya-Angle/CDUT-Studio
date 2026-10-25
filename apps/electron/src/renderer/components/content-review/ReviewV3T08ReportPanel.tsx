/** T08/F16 report workbench. Only Main-projected reports cross this component boundary. */
import * as React from 'react'
import type {
  T08Audience, T08ReportArchiveSummary, T08ReportExportFormat,
  T08ReportProjection, T08ReportSnapshot, T08ReportExportReceipt,
} from '@profer/shared'

interface Props { caseId: string; currentRunId?: string }

const formats: Array<{ value: T08ReportExportFormat; label: string }> = [
  { value: 'md', label: 'Markdown 报告' },
  { value: 'json', label: 'JSON 结构化报告' },
  { value: 'xlsx', label: 'XLSX 检查与来源表' },
  { value: 'html', label: 'HTML 可打印版' },
  { value: 'pdf', label: 'PDF（可检索文字）' },
  { value: 'bundle', label: '只读交接 ZIP（含哈希清单）' },
]

function isArchivedProjection(value: T08ReportProjection | T08ReportSnapshot): value is T08ReportSnapshot {
  return 'reportId' in value && 'snapshotHash' in value
}

function receiptNotice(receipt: T08ReportExportReceipt): string {
  if (receipt.status === 'cancelled') {
    return '已保留不可变报告档案 ' + receipt.reportId + '，但你取消了外部保存；未将其标记为已导出。档案位置：' + receipt.archivePath
  }
  return '报告已保存：' + receipt.filePath + '。档案 ID：' + receipt.reportId + '；快照哈希：' + receipt.snapshotHash
}

const reportKindLabels = {
  preliminary: '初审报告',
  'supplement-needed': '待补件初审报告',
  decided: '已决定报告（非校方签发）',
  historical: '历史报告',
} as const

export function ReviewV3T08ReportPanel({ caseId, currentRunId }: Props): React.ReactElement {
  const [runs, setRuns] = React.useState<Array<{ id: string; status: string; startedAt: string }>>([])
  const [selectedRunId, setSelectedRunId] = React.useState(currentRunId ?? '')
  const [audience, setAudience] = React.useState<T08Audience>('student')
  const [allowedAudiences, setAllowedAudiences] = React.useState<T08Audience[]>([])
  const [format, setFormat] = React.useState<T08ReportExportFormat>('md')
  const [projection, setProjection] = React.useState<T08ReportProjection | T08ReportSnapshot | null>(null)
  const [archives, setArchives] = React.useState<T08ReportArchiveSummary[]>([])
  const [selectedArchiveId, setSelectedArchiveId] = React.useState('')
  const [viewingArchive, setViewingArchive] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [previewError, setPreviewError] = React.useState('')
  const [notice, setNotice] = React.useState('')

  const refreshArchives = React.useCallback(async (): Promise<void> => {
    if (!caseId) { setArchives([]); return }
    try {
      setArchives(await window.reviewAPI.listT08ReportArchivesV3(caseId))
    } catch (error) {
      setNotice('报告档案列表读取失败：' + (error instanceof Error ? error.message : String(error)))
    }
  }, [caseId])

  React.useEffect(() => {
    setProjection(null)
    setPreviewError('')
    setNotice('')
    setViewingArchive(false)
    setSelectedRunId(currentRunId ?? '')
    setAllowedAudiences([])
    if (!caseId) { setRuns([]); setArchives([]); return }
    let active = true
    void Promise.all([
      window.reviewAPI.listRunsV2(caseId),
      window.reviewAPI.listT08ReportArchivesV3(caseId),
      window.reviewAPI.getT08ReportAudiencesV3(caseId),
    ]).then(([history, saved, audiences]) => {
      if (!active) return
      setRuns(history.map((run) => ({ id: run.id, status: run.status, startedAt: run.startedAt })))
      setArchives(saved)
      setAllowedAudiences(audiences)
      setAudience(audiences[0] ?? 'student')
      if (!currentRunId) setSelectedRunId(history[0]?.id ?? '')
      setSelectedArchiveId(saved.find((item) => item.valid)?.reportId ?? '')
    }).catch((error) => {
      if (active) setPreviewError('历史记录加载失败：' + (error instanceof Error ? error.message : String(error)))
    })
    return () => { active = false }
  }, [caseId, currentRunId])

  React.useEffect(() => {
    if (!caseId || !selectedRunId || viewingArchive || !allowedAudiences.includes(audience)) {
      if (!viewingArchive) setProjection(null)
      return
    }
    let active = true
    setProjection(null)
    setPreviewError('')
    void window.reviewAPI.getT08ReportPreviewV3({ caseId, runId: selectedRunId, audience })
      .then((value) => { if (active) setProjection(value) })
      .catch((error) => {
        if (active) {
          setProjection(null)
          setPreviewError('无法生成受控报告预览：' + (error instanceof Error ? error.message : String(error)))
        }
      })
    return () => { active = false }
  }, [caseId, selectedRunId, audience, allowedAudiences, viewingArchive])

  const report = projection?.report ?? null
  const archivedProjection = projection && isArchivedProjection(projection) ? projection : null
  const archived = archivedProjection !== null
  const archivePath = archivedProjection ? archives.find((item) => item.reportId === archivedProjection.reportId)?.archivePath : undefined
  const archiveDetails = archivedProjection ? archives.find((item) => item.reportId === archivedProjection.reportId) : undefined

  const openArchive = async (): Promise<void> => {
    if (!caseId || !selectedArchiveId) return
    setBusy(true)
    setNotice('')
    try {
      const snapshot = await window.reviewAPI.getT08ReportArchiveV3({ caseId, reportId: selectedArchiveId })
      setProjection(snapshot)
      setSelectedRunId(snapshot.runId)
      setAudience(snapshot.audience)
      setViewingArchive(true)
      setPreviewError('')
      setNotice('已打开不可变报告档案 ' + snapshot.reportId + '；显示的是当时保存的报告内容，不会用当前案卷重新拼装。')
    } catch (error) {
      setPreviewError('归档报告无法验证或打开：' + (error instanceof Error ? error.message : String(error)))
    } finally { setBusy(false) }
  }

  const exportFile = async (): Promise<void> => {
    if (!projection || !report || !caseId) return
    setBusy(true)
    setNotice('')
    try {
      const receipt = archived
        ? await window.reviewAPI.exportT08ReportArchiveV3({ caseId, reportId: archivedProjection!.reportId, format })
        : await window.reviewAPI.exportT08ReportV3({
          caseId, runId: projection.runId, audience: projection.audience, format,
          expectedProjectionHash: projection.projectionHash,
        })
      setNotice(receiptNotice(receipt))
      if (!archived) {
        const snapshot = await window.reviewAPI.getT08ReportArchiveV3({ caseId, reportId: receipt.reportId })
        setProjection(snapshot)
        setSelectedArchiveId(snapshot.reportId)
        setViewingArchive(true)
      }
      await refreshArchives()
    } catch (error) {
      setNotice('报告导出未完成：' + (error instanceof Error ? error.message : String(error)) + '。若档案已创建，可在报告档案列表中重新打开。')
      await refreshArchives()
    } finally { setBusy(false) }
  }

  const copy = async (): Promise<void> => {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report.markdown)
      setNotice('已复制当前受众投影的 Markdown；复制不代表正式签发或外部送达。')
    } catch (error) {
      setNotice('复制失败：' + (error instanceof Error ? error.message : String(error)))
    }
  }

  return <section className="space-y-3 text-xs" aria-label="案卷报告">
    {!caseId
      ? <p className="rounded border border-border p-3 text-muted-foreground">请先打开一份原生案卷。</p>
      : <>
        <div className="space-y-2 rounded-md bg-muted/50 p-2 leading-5">
          <strong className="block">T08 / F16 报告工作台</strong>
          <p className="text-muted-foreground">报告内容由 Main 从所选 Run、模板版本和关联决定生成。技术检查、模型意见与业务决定分别呈现；导出只读，不会写入或替代决定。</p>
          <p className="text-muted-foreground">本地会话只能查看申请人版；审核人和组织者版需要另行核验学校身份及本案授权，切换受众并不能获取权限。</p>
          {projection && <>
            <p>案卷：{projection.caseTitle} · 生成时 revision {projection.caseRevision}</p>
            <p>Run：{projection.runId} · {report?.status} · {report?.rows.length ?? 0} 条报告记录</p>
            <p>报告性质：{projection.reportKind ? reportKindLabels[projection.reportKind] : '旧版报告（未记录性质）'}</p>
            <p>受众：{projection.audience} · 输入：{projection.inputHash.slice(0, 16)}…</p>
            <p>关联决定：{projection.decisionIds.length} 条 · {projection.historical ? '历史/过期' : '当前输入'}</p>
            {archived
              ? <p>报告档案：{archivedProjection!.reportId} · 快照哈希 {archivedProjection!.snapshotHash.slice(0, 16)}…</p>
              : <p>预览指纹：{projection.projectionHash.slice(0, 16)}…；导出前 Main 会重新计算并拒绝过期预览。</p>}
            {projection.historical && <p className="text-amber-700 dark:text-amber-400">该报告是历史或过期输入的只读记录，不代表案卷当前状态。</p>}
            {archiveDetails?.noLongerCurrent && <p className="text-amber-700 dark:text-amber-400">归档后已有更新的审核 Run；本报告不再代表当前审核输入。</p>}
            {!!archiveDetails?.amendedByDecisionIds?.length && <p className="text-amber-700 dark:text-amber-400">归档关联决定后来被更正：{archiveDetails.amendedByDecisionIds.join('、')}。原始报告仍按生成时内容保留。</p>}
            {archived && archivePath && <p>本地档案位置：{archivePath}</p>}
            {archived && archiveDetails && <p>本机另存为记录：{archiveDetails.localSaveRecords?.length ?? 0} 次（成功、取消和失败均仅代表本机操作，不代表外部送达）。</p>}
            {archiveDetails?.localSaveError && <p role="alert" className="text-destructive">保存记录校验异常：{archiveDetails.localSaveError}</p>}
          </>}
        </div>

        <label className="block space-y-1">选择运行
          <select className="w-full rounded border border-border bg-background p-2" value={selectedRunId}
            onChange={(event) => { setViewingArchive(false); setProjection(null); setSelectedRunId(event.target.value) }}>
            {runs.map((run) => <option value={run.id} key={run.id}>{run.id} / {run.status} / {run.startedAt}</option>)}
          </select>
        </label>
        <label className="block space-y-1">报告受众
          <select className="w-full rounded border border-border bg-background p-2" value={audience} disabled={allowedAudiences.length === 0}
            onChange={(event) => { setViewingArchive(false); setProjection(null); setAudience(event.target.value as T08Audience) }}>
            {allowedAudiences.includes('student') && <option value="student">学生 / 申请人（公开投影）</option>}
            {allowedAudiences.includes('reviewer') && <option value="reviewer">审核人（内部核对）</option>}
            {allowedAudiences.includes('organizer') && <option value="organizer">组织者（内部核对）</option>}
          </select>
        </label>
        <label className="block space-y-1">导出格式
          <select className="w-full rounded border border-border bg-background p-2" value={format}
            onChange={(event) => setFormat(event.target.value as T08ReportExportFormat)}>
            {formats.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !report} onClick={() => void exportFile()}
            className="rounded bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50">导出并归档</button>
          <button type="button" disabled={!report} onClick={() => void copy()}
            className="rounded border border-border px-3 py-2 disabled:opacity-50">复制 MD</button>
        </div>

        <div className="space-y-2 rounded border border-border p-2">
          <strong>历史报告档案</strong>
          <label className="block space-y-1">选择已归档报告
            <select className="w-full rounded border border-border bg-background p-2" value={selectedArchiveId}
              onChange={(event) => setSelectedArchiveId(event.target.value)}>
              <option value="">选择一个档案</option>
              {archives.map((item) => <option value={item.reportId} key={item.reportId} disabled={!item.valid}>
                {item.createdAt} · {item.runId} · {item.audience} · {item.amendedByDecisionIds?.length ? '决定已更正' : item.noLongerCurrent ? '旧运行' : '存档'} · {item.valid ? '可验证' : '损坏'}
              </option>)}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy || !selectedArchiveId || !archives.some((item) => item.reportId === selectedArchiveId && item.valid)}
              onClick={() => void openArchive()} className="rounded border border-border px-3 py-2 disabled:opacity-50">打开归档报告</button>
            {viewingArchive && <button type="button" disabled={busy} onClick={() => { setViewingArchive(false); setProjection(null) }}
              className="rounded border border-border px-3 py-2">返回当前预览</button>}
          </div>
        </div>

        {previewError && <p role="alert" className="rounded border border-destructive/40 p-2 text-destructive">{previewError}</p>}
        {notice && <p role="status" className="rounded border border-border p-2 text-muted-foreground">{notice}</p>}
        {report && <details open className="rounded border border-border">
          <summary className="cursor-pointer p-2">报告预览（{report.rows.length} 条记录）</summary>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words border-t border-border bg-muted/30 p-3 text-[11px]">{report.markdown}</pre>
        </details>}
      </>}
  </section>
}
