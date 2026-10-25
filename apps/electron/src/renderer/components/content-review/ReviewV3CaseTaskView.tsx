/**
 * 普通用户的「材料与审核」案卷页。
 *
 * 材料导入完成后的唯一落点：只显示材料清单、自动识别状态和一个主按钮。
 * 自动识别由 Main 的 readLocalNativeProductV3 给出；唯一高置信建议在 20 秒倒计时
 * 结束后自动应用为本案审核任务，含糊时才要求用户点一下选择。
 * 旧的方案试跑工作台降级为「高级」入口，不再作为默认落点。
 */
import * as React from 'react'
import { Button } from '@profer/ui/primitives/button'
import type { CaseAggregateV2, D4ClientSelection, D4ClientTemplate } from '@profer/shared'
import type { C11MainLocalProductRead } from '../../../main/lib/review/review-v3-main-local-product-intake'
import { humanizeReviewError } from './review-error-text'
import { ReviewV3UnifiedRun } from './ReviewV3UnifiedRun'

interface Props {
  caseId: string
  /** 高级入口：打开原有的方案试跑工作台。 */
  onOpenAdvanced?: () => void
  onOpenCase?: () => void
}

interface InstalledPlan {
  templateId: string
  checks: number
}

/** 路由状态翻译成用户看得懂的一句话。 */
function routeLabel(read: C11MainLocalProductRead | null): { tone: 'idle' | 'wait' | 'ok' | 'warn'; text: string } {
  const route = read?.read.route
  if (!read) return { tone: 'idle', text: '正在读取本案材料…' }
  switch (route?.status) {
    case 'default-selected': return { tone: 'ok', text: '已根据材料自动匹配到审核方案' }
    case 'countdown': return { tone: 'wait', text: `已匹配到一套审核方案，${Math.max(1, Math.ceil((route.remainingMs ?? 0) / 1000))} 秒后自动采用；你也可以直接选择其他方案` }
    case 'manually-selected': return { tone: 'ok', text: '已选择审核方案' }
    case 'unmatched': return { tone: 'warn', text: '没有自动匹配到现成方案，请从下面选一套，或用「高级」自定义' }
    case 'awaiting-evidence': return { tone: 'warn', text: '材料还没准备好，请先导入申请材料' }
    default: return { tone: 'warn', text: '材料涉及多个业务或归属不明确，请手动选择审核方案' }
  }
}

export function ReviewV3CaseTaskView({ caseId, onOpenAdvanced, onOpenCase }: Props): JSX.Element {
  const [aggregate, setAggregate] = React.useState<CaseAggregateV2 | null>(null)
  const [read, setRead] = React.useState<C11MainLocalProductRead | null>(null)
  const [templates, setTemplates] = React.useState<D4ClientTemplate[]>([])
  const [plan, setPlan] = React.useState<InstalledPlan | null>(null)
  const [chosenId, setChosenId] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [notice, setNotice] = React.useState('')
  const [error, setError] = React.useState('')
  // 异步回读必须绑定发起时的案卷；旧案结果不得渲染进新案。
  const caseRef = React.useRef(caseId)
  caseRef.current = caseId
  const epochRef = React.useRef(0)

  const load = React.useCallback(async (): Promise<void> => {
    const target = caseId
    if (!target) return
    const seq = ++epochRef.current
    const [fresh, product] = await Promise.all([
      window.reviewAPI.getAggregateV2(target),
      window.reviewAPI.readLocalNativeProductV3(target).catch((cause) => {
        // 自动识别失败不能挡住材料展示；原因如实保留。
        setError(humanizeReviewError(cause))
        return null
      }),
    ])
    if (seq !== epochRef.current || caseRef.current !== target) return
    setAggregate(fresh ?? null)
    if (product) setRead(product)
    const installed = fresh?.d2RuntimePlan
    setPlan(installed
      ? { templateId: installed.templateId, checks: installed.mapping.length }
      : null)
  }, [caseId])

  React.useEffect(() => {
    setRead(null); setPlan(null); setNotice(''); setError(''); setChosenId('')
    if (!caseId) return
    void load().catch((cause) => setError(humanizeReviewError(cause)))
  }, [caseId, load])

  React.useEffect(() => {
    void window.reviewAPI.listD4Templates().then(setTemplates).catch(() => { /* 目录不可用时仍可手动输入 */ })
  }, [])

  // 倒计时到点后重新读取；由 Main 决定是否已正式采用，界面不自行改判。
  React.useEffect(() => {
    const route = read?.read.route
    if (route?.status !== 'countdown') return
    const timer = setTimeout(() => {
      void load().catch((cause) => setError(humanizeReviewError(cause)))
    }, Math.min(Math.max(route.remainingMs ?? 0, 800), 20_000) + 120)
    return () => clearTimeout(timer)
  }, [read, load])

  const applyPlan = React.useCallback(async (templateId: string): Promise<void> => {
    const template = templates.find((item) => item.templateId === templateId)
    if (!template) throw new Error('这套审核方案在本机已不可用，请重新选择')
    if (template.selectionIssue) throw new Error('这套方案缺少必要的对象与场景数据，不能使用：' + template.selectionIssue)
    const d4: D4ClientSelection = {
      selection: template.selection,
      ...(template.controlledStudentFixture ? { useControlledStudentFixture: true } : {}),
    }
    const ack = await window.reviewAPI.attachD4TechnicalPlanV3({ caseId, d4 })
    setPlan({ templateId: ack.templateId, checks: ack.checks })
    setNotice(`已采用「${template.name || ack.templateId}」，共 ${ack.checks} 项检查。`)
  }, [caseId, templates])

  // 唯一高置信建议：自动采用，不需要用户再点一次。
  React.useEffect(() => {
    const route = read?.read.route
    if (plan || busy || route?.status !== 'default-selected' || !route.chosen) return
    const chosen = route.chosen
    setBusy(true)
    void applyPlan(chosen.templateId)
      .catch((cause) => setError(humanizeReviewError(cause)))
      .finally(() => setBusy(false))
  }, [read, plan, busy, applyPlan])

  const applyChosen = async (): Promise<void> => {
    if (!chosenId) { setError('请先选择一套审核方案'); return }
    setBusy(true); setError(''); setNotice('')
    try {
      await applyPlan(chosenId)
      await load()
    } catch (cause) {
      setError(humanizeReviewError(cause))
    } finally {
      setBusy(false)
    }
  }

  const documents = aggregate?.caseV2.documents.filter((doc) => doc.active !== false) ?? []
  const status = routeLabel(read)
  const selectable = templates.filter((item) => !item.selectionIssue)
  const tone = {
    idle: 'bg-muted/50 text-muted-foreground',
    wait: 'bg-primary/10 text-foreground',
    ok: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    warn: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
  }[status.tone]

  return <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-5">
    <header className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold">{aggregate?.caseV2.title ?? '当前案卷'}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          材料只保存在本机案卷；开始审核时会按材料内容自动识别申报事项。
        </p>
      </div>
      {onOpenCase && <Button size="sm" variant="outline" disabled={busy} onClick={onOpenCase}>打开案卷办理</Button>}
    </header>

    <section className="rounded-xl bg-card p-4 shadow-sm" aria-label="本案材料">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">材料</h3>
        <span className="text-xs text-muted-foreground">{documents.length} 份</span>
      </div>
      {documents.length === 0
        ? <p className="mt-2 text-xs text-muted-foreground">还没有材料。回到「从材料开始审核」把文件拖进来即可。</p>
        : <ul className="mt-2 space-y-1 text-xs">
          {documents.map((doc) => <li key={doc.versionId} className="flex items-center justify-between gap-2 rounded-md bg-foreground/[0.03] px-2 py-1.5">
            <span className="min-w-0 flex-1 truncate" title={doc.fileName}>{doc.fileName}</span>
            <span className="shrink-0 text-muted-foreground">
              {doc.role === 'application' ? '申请材料' : doc.role === 'evidence' ? '证明材料' : doc.role === 'rule' ? '依据' : '附件'}
              {' · '}
              {doc.parseStatus === 'parsed' ? '已解析' : doc.parseStatus === 'pending' ? '待解析' : doc.parseStatus === 'partial' ? '部分解析' : '解析失败'}
            </span>
          </li>)}
        </ul>}
    </section>

    <section className={`rounded-xl p-3 text-sm ${tone}`} aria-live="polite">
      <p className="font-medium">{plan ? `审核方案已就绪：${plan.templateId} · ${plan.checks} 项检查` : status.text}</p>
      {notice && <p className="mt-1 text-xs">{notice}</p>}
    </section>

    {!plan && <section className="rounded-xl bg-card p-4 shadow-sm" aria-label="选择审核方案">
      <label className="block text-xs text-muted-foreground">审核方案
        <select className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
          value={chosenId} onChange={(event) => setChosenId(event.target.value)}>
          <option value="">{selectable.length ? '从可用方案中选择…' : '本机暂无可用方案'}</option>
          {selectable.map((item) => <option key={item.templateId} value={item.templateId}>{item.domain} · {item.name}</option>)}
        </select>
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={busy || !chosenId} onClick={() => void applyChosen()}>使用这套方案</Button>
        {onOpenAdvanced && <Button size="sm" variant="ghost" onClick={onOpenAdvanced}>高级：自定义方案</Button>}
      </div>
    </section>}

    <ReviewV3UnifiedRun
      caseId={caseId}
      stage={aggregate?.caseV2.stage ?? 'draft'}
      documentCount={documents.length}
      technicalPlan={!!plan}
      canRun={!!plan}
      onUpdated={load}
    />

    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
  </div>
}
