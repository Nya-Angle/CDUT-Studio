import { useCallback, useEffect, useState } from 'react'
import { Clock3, FileClock, FolderOpen, RefreshCw } from 'lucide-react'
import type { ReviewCaseSummary, ReviewRun, ReviewRunV2 } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'

interface ProjectHistoryItem {
  caseId: string
  title: string
  applicant?: string
  academicYear?: string
  updatedAt: string
  documentCount: number
  templateId?: string
  templateVersion?: number
  hasLegacyCase: boolean
}

type HistoryRun =
  | { kind: 'agent'; id: string; startedAt: string; status: ReviewRunV2['status']; run: ReviewRunV2 }
  | { kind: 'automatic'; id: string; startedAt: string; status: ReviewRun['status']; run: ReviewRun }

const RUN_STATUS_LABEL: Record<string, string> = {
  queued: '排队中', running: '审核中', 'awaiting-input': '待补充', 'awaiting-decision': '待决定',
  paused: '已暂停', completed: '已完成', 'partially-completed': '部分完成', failed: '未完成', cancelled: '已取消',
}

const CHECK_STATUS_LABEL: Record<string, string> = {
  compliant: '符合', 'non-compliant': '不符合', 'awaiting-supplement': '待补件',
  'awaiting-confirmation': '待确认', 'not-applicable': '不适用', 'not-executed': '未执行', 'execution-failed': '执行失败',
}

function formatTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '时间未知' : date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function toProjectMap(cases: ReviewCaseSummary[], aggregates: Awaited<ReturnType<typeof window.reviewAPI.listCasesV2>>): ProjectHistoryItem[] {
  const projects = new Map<string, ProjectHistoryItem>()
  for (const item of cases) {
    projects.set(item.id, {
      caseId: item.id,
      title: item.title,
      applicant: item.applicant,
      academicYear: item.academicYear,
      updatedAt: item.updatedAt,
      documentCount: item.documentCount,
      hasLegacyCase: true,
    })
  }
  for (const item of aggregates) {
    const existing = projects.get(item.caseId)
    projects.set(item.caseId, {
      caseId: item.caseId,
      title: existing?.title ?? item.title,
      applicant: existing?.applicant,
      academicYear: existing?.academicYear,
      updatedAt: existing && existing.updatedAt > item.updatedAt ? existing.updatedAt : item.updatedAt,
      documentCount: existing?.documentCount ?? 0,
      templateId: item.templateId,
      templateVersion: item.templateVersion,
      hasLegacyCase: existing?.hasLegacyCase ?? false,
    })
  }
  return [...projects.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function ReviewHistoryPanel({ active, onOpenProject }: { active: boolean; onOpenProject: (caseId: string) => Promise<boolean> }): JSX.Element {
  const [projects, setProjects] = useState<ProjectHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const [cases, aggregates] = await Promise.all([window.reviewAPI.listCases(), window.reviewAPI.listCasesV2()])
      setProjects(toProjectMap(cases, aggregates))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (active) void refresh() }, [active, refresh])

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold"><FileClock size={18} className="text-primary" />审核历史</h2>
          <p className="mt-1 text-sm text-muted-foreground">按项目查看每次审核运行；新一轮审核会追加记录，保留此前结论。</p>
        </div>
        <Button type="button" size="sm" variant="outline" disabled={loading} onClick={() => void refresh()}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />刷新
        </Button>
      </header>

      {error && <p role="alert" className="mb-3 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">历史记录加载失败：{error}</p>}
      {loading && projects.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">正在加载审核项目…</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-10 text-center">
          <FolderOpen size={24} className="mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">还没有审核项目</p>
          <p className="mt-1 text-xs text-muted-foreground">新建项目并开始审核后，项目和每次运行都会出现在这里。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectHistoryRow key={project.caseId} project={project} onOpenProject={onOpenProject} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectHistoryRow({ project, onOpenProject }: { project: ProjectHistoryItem; onOpenProject: (caseId: string) => Promise<boolean> }): JSX.Element {
  const [runs, setRuns] = useState<HistoryRun[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRuns = async (force = false): Promise<void> => {
    if (loading || (!force && loaded)) return
    setLoading(true)
    setError(null)
    try {
      const [legacy, agent] = await Promise.all([
        window.reviewAPI.listRuns(project.caseId),
        window.reviewAPI.listRunsV2(project.caseId),
      ])
      const history: HistoryRun[] = [
        ...legacy.map((run) => ({ kind: 'automatic' as const, id: run.id, startedAt: run.startedAt, status: run.status, run })),
        ...agent.map((run) => ({ kind: 'agent' as const, id: run.id, startedAt: run.startedAt, status: run.status, run })),
      ]
      setRuns(history.sort((a, b) => b.startedAt.localeCompare(a.startedAt)))
      setLoaded(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoading(false)
    }
  }

  const runCount = loaded ? runs.length : undefined

  return (
    <details className="group rounded-xl border border-border/70 bg-card" onToggle={(event) => { if (event.currentTarget.open) void loadRuns(true) }}>
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <FolderOpen size={16} className="shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{project.title}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {[project.applicant, project.academicYear, project.templateId ? `${project.templateId} · v${project.templateVersion}` : undefined].filter(Boolean).join(' · ') || project.caseId}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex"><Clock3 size={12} />{formatTime(project.updatedAt)}</span>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{runCount === undefined ? '展开查看' : `${runCount} 次审核`}</span>
      </summary>
      <div className="border-t border-border/60 px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">项目 ID：{project.caseId}</p>
          {project.hasLegacyCase && <Button type="button" size="sm" variant="outline" className="h-7" onClick={() => void onOpenProject(project.caseId).then((opened) => { if (!opened) setError('无法打开项目，请从辅助审核刷新后重试。') })}><FolderOpen size={13} />打开项目</Button>}
        </div>
        {loading && <p className="py-3 text-center text-xs text-muted-foreground">正在读取运行记录…</p>}
        {error && <p role="alert" className="mb-2 rounded border border-destructive/30 px-2 py-1.5 text-xs text-destructive">{error}</p>}
        {!loading && loaded && runs.length === 0 && <p className="py-3 text-center text-xs text-muted-foreground">这个项目还没有审核运行记录。</p>}
        <div className="space-y-2">
          {runs.map((entry) => (
            <RunHistoryRow key={`${entry.kind}:${entry.id}`} entry={entry} />
          ))}
        </div>
      </div>
    </details>
  )
}

function RunHistoryRow({ entry }: { entry: HistoryRun }): JSX.Element {
  const v2 = entry.kind === 'agent' ? entry.run : null
  const v1 = entry.kind === 'automatic' ? entry.run : null
  const resultCount = v2 ? v2.checks.length + v2.opinions.length : v1?.findings.length ?? 0

  return (
    <details className="rounded-lg border border-border/60 bg-background">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 text-xs font-medium">{entry.kind === 'agent' ? 'Pi 审核' : '自动审核'} · {RUN_STATUS_LABEL[entry.status] ?? entry.status}</span>
        <span className="text-xs text-muted-foreground">{formatTime(entry.startedAt)}</span>
        <span className="text-xs text-muted-foreground">{resultCount} 项结果</span>
      </summary>
      <div className="space-y-2 border-t border-border/50 px-3 py-2 text-xs">
        <p className="text-muted-foreground">运行 ID：{entry.id}</p>
        {v2?.error && <p className="text-destructive">{v2.error}</p>}
        {v1?.error && <p className="text-destructive">{v1.error}</p>}
        {v2 && (
          <>
            <p>检查 {v2.coverage.completedChecks}/{v2.coverage.plannedChecks} 项 · 材料 {v2.inputManifest.documentVersions.length} 份</p>
            <ul className="space-y-1">
              {v2.checks.map((check) => <li key={check.checkId} className="rounded bg-muted/40 px-2 py-1">{CHECK_STATUS_LABEL[check.status] ?? check.status} · {check.ruleId}{check.reason ? `：${check.reason}` : ''}</li>)}
              {v2.opinions.map((opinion) => <li key={opinion.id} className="rounded bg-muted/40 px-2 py-1">{opinion.title}：{opinion.detail}</li>)}
            </ul>
          </>
        )}
        {v1 && (
          <>
            <p>{v1.engine === 'ai' ? 'AI 审核' : '模拟审核'} · {v1.findings.length} 个问题 · {v1.coverage.unprocessedMaterials?.length ?? 0} 份材料未处理</p>
            <ul className="space-y-1">
              {v1.findings.map((finding) => <li key={finding.id} className="rounded bg-muted/40 px-2 py-1">{finding.severity === 'red' ? '需处理' : '待确认'} · {finding.title}：{finding.detail}</li>)}
            </ul>
          </>
        )}
      </div>
    </details>
  )
}
