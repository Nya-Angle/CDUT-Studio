/**
 * ContentReviewView — CDUT 专区「材料审核」子页面（三栏审核工作台主体）
 *
 * 作为 CdutZoneView 子页面内页挂载：统一顶栏（校徽 + 标题 + 关闭按钮）与窗口按钮宿主
 * 由外层 CdutZoneView（cdut-subview）统管，本组件不再声明自身的 WindowControlsHost 与拖拽层，
 * 避免同为 priority 20 争抢窗口按钮。
 *
 * 布局：工作台二级工具栏（模块导航 + 案卷摘要 + 出口徽标 + 操作按钮） +
 * 三栏（审核依据 | 申请与证明 | AI 审核员） + 助手抽屉 + 底部错误条。
 * 三栏宽度 flex-[3] / flex-[4] / flex-[3]，栏间 1px 分隔，各自独立滚动（overflow-y-auto）。
 * 窄窗口（<1100px）时只挂载当前栏，由顶部三按钮切换；切栏时重放已有定位。
 *
 * 交互：
 * - 挂载时 actions.initialize()：刷新案卷列表 + 模型出口自检（工具栏徽标）。
 *   不自动选中/载入案卷（首个案卷可能是用户自己的），入口在左栏「案卷管理」条；
 *   「载入演示案卷」按钮保留，由用户显式触发
 * - Ctrl+Shift+A（Mac: Cmd+Shift+A）：仅本视图挂载期间监听，toggle 审核助手抽屉
 * - 联动（D8）：问题卡点击 → reviewFocusAtom → SourceBlockView 滚动 + 闪高亮（见各栏组件）
 * - 根 div 保留 data-profer-navigation-region="content-review" + tabIndex={-1}（键盘导航焦点移交）
 */

import * as React from 'react'
import { toast } from 'sonner'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  Download,
  FileText,
  Gavel,
  Layers,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { ReviewFirstUseReadiness } from '@/components/onboarding/ReviewFirstUseReadiness'
import { humanizeReviewError } from './review-error-text'
import { isEditableTarget } from '@/lib/navigation-controller'
import {
  reviewActivePaneAtom,
  reviewAssistantOpenAtom,
  reviewCaseAtom,
  reviewErrorAtom,
  reviewGatewayStatusAtom,
  reviewWorkspaceSectionAtom,
  type ReviewWorkspaceSection,
} from '@/atoms/review-atoms'
import { channelsAtom } from '@/atoms/conversation-atoms'
import type { ReviewModelGatewayStatus } from '@profer/shared'
import { cn } from '@/lib/utils'
import { AssistantDrawer } from './AssistantDrawer'
import { CenterPanel } from './CenterPanel'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { reviewV2AggregateAtom, V2CasePanel } from './V2CasePanel'
import { ReviewV3T10WorkspaceOverview } from './ReviewV3T10WorkspaceOverview'
import { TemplateWizardPanel } from './TemplateWizardPanel'
import { ReviewV3LocalCandidateWorkbench } from './ReviewV3LocalCandidateWorkbench'
import { BatchPanel } from './BatchPanel'
import { ReviewV3T07Workbench } from './ReviewV3T07Workbench'
import { useReviewActions } from './use-review-actions'
import { ReviewV3QuickIntake } from './ReviewV3QuickIntake'

/** 窄屏单栏切换的栏目标识 */
type Pane = 'left' | 'center' | 'right'

/** 窄屏阈值：小于该宽度降级为单栏（与设计文档"窄窗口可切标签"一致） */
const NARROW_BREAKPOINT_PX = 1100

export function ContentReviewView(): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const gatewayStatus = useAtomValue(reviewGatewayStatusAtom)
  const errorMessage = useAtomValue(reviewErrorAtom)
  const section = useAtomValue(reviewWorkspaceSectionAtom)
  const setSection = useSetAtom(reviewWorkspaceSectionAtom)
  const setV2Aggregate = useSetAtom(reviewV2AggregateAtom)
  const businessAggregate = useAtomValue(reviewV2AggregateAtom)
  const channels = useAtomValue(channelsAtom)
  const activePane = useAtomValue(reviewActivePaneAtom)
  const setActivePane = useSetAtom(reviewActivePaneAtom)
  const assistantOpen = useSetAtom(reviewAssistantOpenAtom)

  const actions = useReviewActions()

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [narrow, setNarrow] = React.useState(false)
  const [quickCaseId, setQuickCaseId] = React.useState<string | null>(null)
  const [errorExpanded, setErrorExpanded] = React.useState(false)
  const [errorDismissed, setErrorDismissed] = React.useState<string | null>(null)
  const visibleError = errorMessage && errorMessage !== errorDismissed ? errorMessage : null
  const quickStart = React.useCallback((caseId: string): void => {
    setQuickCaseId(caseId)
    setV2Aggregate(null)
    setSection('local-candidates')
  }, [setSection, setV2Aggregate])

  // 与独立的 V2 办理模块共用同一份真实案卷；只读取现有 Main 聚合。
  const openBusinessCase = React.useCallback(async (): Promise<void> => {
    // 目标案卷只来自用户明确选中的案卷；已有聚合只有在同案时才可直接复用。
    // 绝不允许旧单例把当前办理对象反选回上一案（UI-01）。
    const targetId = reviewCase?.id ?? businessAggregate?.caseV2.id ?? null
    if (!targetId) {
      setV2Aggregate(null)
      setSection('case-v2')
      return
    }
    if (businessAggregate?.caseV2.id === targetId) {
      setSection('case-v2')
      return
    }
    setV2Aggregate(null)
    setSection('case-v2')
    try {
      const aggregate = await window.reviewAPI.openAggregateV2(targetId)
      if (aggregate?.caseV2.id === targetId) setV2Aggregate(aggregate)
      else toast.error('当前案卷的业务记录暂不可读取')
    } catch (error) {
      toast.error(`读取案卷办理记录失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }, [businessAggregate, reviewCase, setSection, setV2Aggregate])

  const openPane = React.useCallback((pane: Pane): void => {
    setActivePane(pane)
    setSection('workbench')
  }, [setActivePane, setSection])

  // 设置面板覆盖工作台而不卸载它；渠道变化时也需刷新出口徽标。
  React.useEffect(() => { void actions.initialize() }, [actions, channels])

  // 以审核工作区实际可用宽度判断单栏，而不是整窗宽度（UI-18）。
  React.useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const measure = (): void => setNarrow(node.clientWidth < NARROW_BREAKPOINT_PX)
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Ctrl+Shift+A / Cmd+Shift+A：仅本视图挂载期间生效，切换助手抽屉
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!event.shiftKey) return
      const isMac = navigator.platform.startsWith('Mac')
      const mod = isMac ? event.metaKey : event.ctrlKey
      if (!mod) return
      if (event.key.toLowerCase() !== 'a') return
      // 输入/文本域内不拦截（避免吞掉 Ctrl+A 全选）
      if (isEditableTarget(event.target)) return
      event.preventDefault()
      assistantOpen((previous) => !previous)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [assistantOpen])

  // 50 套 D4 候选 → 可执行模板：让拖入材料匹配到的模板可以真正用于业务审核
  const [demoPublishing, setDemoPublishing] = React.useState(false)
  const publishDemoTemplates = React.useCallback(async (): Promise<void> => {
    setDemoPublishing(true)
    try {
      const result = await window.reviewAPI.publishD4DemoTemplates()
      toast.success(`模板已发布 ${result.published.length} 套` +
        (result.renamed.length ? `，改名 ${result.renamed.length} 套` : '') +
        (result.skipped.length ? `，跳过 ${result.skipped.length} 套` : '') +
        (result.failed.length ? `，失败 ${result.failed.length} 套` : ''))
      if (result.failed.length) {
        toast.error(`发布会话失败：${result.failed[0]!.templateId}：${result.failed[0]!.reason}`)
      }
    } catch (error) {
      toast.error(`发布模板失败：${humanizeReviewError(error)}`)
    } finally {
      setDemoPublishing(false)
    }
  }, [])

  // 审核模型就绪提示：只在首次进入材料审核时出现，关闭后不再打扰
  const [reviewReadinessVisible, setReviewReadinessVisible] = React.useState<boolean>(() => {
    try { return window.localStorage.getItem('cdut.review.readinessAcknowledged') !== '1' } catch { return true }
  })
  const dismissReviewReadiness = React.useCallback((): void => {
    setReviewReadinessVisible(false)
    try { window.localStorage.setItem('cdut.review.readinessAcknowledged', '1') } catch { /* 忽略存储不可用 */ }
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-content-area outline-none"
      data-profer-navigation-region="content-review"
      tabIndex={-1}
    >
      {/* 首次进入材料审核时才提示配置审核模型：右侧浮层，不挤压主界面、不形成上下分栏 */}
      {reviewReadinessVisible && (
        <section aria-label="审核模型就绪检查"
          className="absolute inset-0 z-20 flex flex-col bg-background">
          <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-6 py-8">
            <header className="mb-4">
              <h2 className="text-xl font-semibold">让材料审核做好准备</h2>
              <p className="mt-1 text-sm text-muted-foreground">已有模型配置会自动读取；也可以先跳过，进入主界面后再到设置里配置。</p>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <ReviewFirstUseReadiness />
            </div>
            <footer className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs"
                onClick={() => dismissReviewReadiness()}>跳过，稍后设置</Button>
              <Button type="button" size="sm" className="h-8 text-xs" onClick={() => dismissReviewReadiness()}>
                完成，开始审核
              </Button>
            </footer>
          </div>
        </section>
      )}

      {/* 工作台专属二级工具栏：模块导航与操作动作合流，居于 CDUT 专区统一顶栏下方，
          享有完整容器宽度，物理上不会与右上角 Windows 窗口按钮重叠 */}
      <header className="relative z-10 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border/60 bg-card/60 px-4 py-2 titlebar-no-drag">
        {/* 左侧：二级导航 + 当前案卷摘要 */}
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <nav aria-label="审核工作页" className="flex shrink-0 flex-wrap items-center gap-1">
            {([
              ['home', '审核首页'],
              ['workbench', '材料与审核'],
              ['case-v2', '案卷办理'],
              ['local-candidates', '方案试跑'],
              ['templates', '审核模板'],
              ['batches', '批次管理'],
            ] as Array<[ReviewWorkspaceSection, string]>).map(([id, label]) => (
              <Button
                key={id}
                size="sm"
                variant={section === id ? 'secondary' : 'ghost'}
                className="h-7 px-2.5 text-xs font-medium"
                aria-pressed={section === id}
                onClick={() => id === 'case-v2' ? void openBusinessCase() : setSection(id)}
              >
                {label}
              </Button>
            ))}
            <Button type="button" size="sm" variant="ghost" className="h-7 px-2.5 text-xs font-medium"
              onClick={() => openPane('right')} title="在当前案卷查看需要核对的检查与人工待办">
              待办
            </Button>
          </nav>

          {reviewCase && (
            <div className="flex min-w-0 items-center gap-1.5 rounded-md bg-foreground/[0.04] px-2 py-1 text-xs text-muted-foreground">
              <FileText size={12} className="shrink-0 text-foreground/60" />
              <span className="max-w-[260px] truncate" title={reviewCase.title}>
                {reviewCase.title}{reviewCase.applicant ? ` · ${reviewCase.applicant}` : ''}
              </span>
            </div>
          )}
          {!reviewCase && businessAggregate && (
            <div className="max-w-[300px] truncate rounded-md bg-foreground/[0.04] px-2 py-1 text-xs text-muted-foreground" title={businessAggregate.caseV2.title}>
              {businessAggregate.caseV2.title}
            </div>
          )}
        </div>

        {/* 右侧：出口状态徽标 + 业务操作按钮 */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <GatewayBadge status={gatewayStatus} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs"
            disabled={!reviewCase && !businessAggregate}
            onClick={() => void openBusinessCase()}
          >
            <Download size={12} />
            <span>报告与交付</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            aria-label="打开审核助手（Ctrl+Shift+A）"
            title={`审核助手（${navigator.platform.startsWith('Mac') ? '⌘⇧A' : 'Ctrl+Shift+A'}）`}
            onClick={() => assistantOpen((previous) => !previous)}
          >
            <MessageCircle size={14} />
          </Button>
        </div>
      </header>

      {section !== 'home' && <ReviewV3T10WorkspaceOverview
        onOpenReview={() => openPane('left')}
        onOpenMaterials={() => openPane('center')}
        onOpenTasks={() => openPane('right')}
        onOpenTemplates={() => setSection('templates')}
        onOpenBusiness={() => void openBusinessCase()}
      />}

      {(section === 'templates' || section === 'local-candidates') && (
        <nav aria-label="模板工作区" className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-card/40 px-4 py-1.5 titlebar-no-drag">
          <Button type="button" data-testid="review-section-templates" size="sm" variant={section === 'templates' ? 'secondary' : 'ghost'} className="h-7 text-xs" onClick={() => setSection('templates')}>模板库与业务配置</Button>
          <Button type="button" data-testid="review-section-local-candidates" size="sm" variant={section === 'local-candidates' ? 'secondary' : 'ghost'} className="h-7 text-xs" onClick={() => setSection('local-candidates')}>审核方案与试跑</Button>
          <Button type="button" data-testid="review-publish-demo-templates" size="sm" variant="outline" className="h-7 text-xs"
            disabled={demoPublishing}
            onClick={() => void publishDemoTemplates()}>
            {demoPublishing ? '发布中…' : '发布 50 套模板'}
          </Button>

        </nav>
      )}

      {/* ===== 窄屏：顶部三按钮切换栏 ===== */}
      {narrow && section === 'workbench' && (
        <nav
          role="tablist"
          aria-label="工作台栏目"
          className="flex shrink-0 items-center gap-1 border-b border-border/60 bg-card/60 px-3 py-1.5 titlebar-no-drag"
        >
          <PaneTab label="审核依据" icon={<FileText size={13} />} active={activePane === 'left'} onClick={() => setActivePane('left')} />
          <PaneTab label="申请与证明" icon={<Layers size={13} />} active={activePane === 'center'} onClick={() => setActivePane('center')} />
          <PaneTab label="AI 审核员" icon={<Gavel size={13} />} active={activePane === 'right'} onClick={() => setActivePane('right')} />
        </nav>
      )}

      {/* ===== 审核首页：显式选择入口，不默认占用某个案卷 ===== */}
      <section aria-label="审核首页" className={cn('relative min-h-0 flex-1 overflow-auto px-4 py-6 titlebar-no-drag', section !== 'home' && 'hidden')}>
        <div className="mx-auto max-w-3xl space-y-4">
          <div>
            <h2 className="text-lg font-semibold">材料审核</h2>
            <p className="mt-1 text-sm text-muted-foreground">从材料开始，或继续当前案卷。模板配置与批次管理在下方独立入口。</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setSection('workbench')}
              className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4 text-left hover:border-primary/60">
              <p className="text-sm font-semibold">从材料开始审核</p>
              <p className="mt-1 text-xs text-muted-foreground">新建案卷或打开已有案卷，导入真实原件后匹配审核方案。</p>
            </button>
            <button type="button" disabled={!reviewCase && !businessAggregate} onClick={() => void openBusinessCase()}
              className="rounded-xl border p-4 text-left hover:border-primary/60 disabled:opacity-50">
              <p className="text-sm font-semibold">继续当前案卷</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{reviewCase ? `${reviewCase.title}${reviewCase.applicant ? ` · ${reviewCase.applicant}` : ''}` : businessAggregate ? businessAggregate.caseV2.title : '尚未选择案卷'}</p>
            </button>
            <button type="button" onClick={() => openPane('right')}
              className="rounded-xl border p-4 text-left hover:border-primary/60">
              <p className="text-sm font-semibold">查看当前案卷待办</p>
              <p className="mt-1 text-xs text-muted-foreground">检查、补件与人工决定都回到同一案卷的对应对象。</p>
            </button>
            <button type="button" onClick={() => setSection('batches')}
              className="rounded-xl border p-4 text-left hover:border-primary/60">
              <p className="text-sm font-semibold">批次管理</p>
              <p className="mt-1 text-xs text-muted-foreground">批量导入、评分与批次进度。</p>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">没有上次选择的案卷时，本页不会自动把列表首案设为当前案卷。</p>
        </div>
      </section>

      {/* ===== 三栏主体 ===== */}
      <main className={cn('relative flex min-h-0 flex-1 titlebar-no-drag', section !== 'workbench' && 'hidden')}>
        {!reviewCase && !businessAggregate ? (
          <div className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-8">
            <ReviewV3QuickIntake onCreated={quickStart} />
          </div>
        ) : <>
        <PaneWrapper
          pane="left"
          className="flex-[3]"
          narrow={narrow}
          active={activePane}
          showSeparator={!narrow}
        >
          <LeftPanel actions={actions} />
        </PaneWrapper>
        <PaneWrapper
          pane="center"
          className="flex-[4]"
          narrow={narrow}
          active={activePane}
          showSeparator={!narrow}
        >
          <CenterPanel actions={actions} />
        </PaneWrapper>
        <PaneWrapper pane="right" className="flex-[3]" narrow={narrow} active={activePane} showSeparator={false}>
          <RightPanel actions={actions} />
        </PaneWrapper>
        </>}
      </main>

      <section aria-label="当前案卷业务办理" className={cn('relative min-h-0 flex-1 overflow-auto py-3 titlebar-no-drag', section !== 'case-v2' && 'hidden')}>
        {section === 'case-v2' && (
          <V2CasePanel onCaseOpened={(caseId) => { void actions.selectCase(caseId) }} />
        )}
      </section>
      <section aria-label="审核模板编排" className={cn('relative min-h-0 flex-1 overflow-auto py-3 titlebar-no-drag', section !== 'templates' && 'hidden')}>
        <TemplateWizardPanel />
      </section>
      <section aria-label="本地候选模板作者工作台" className={cn('relative min-h-0 flex-1 overflow-auto py-3 titlebar-no-drag', section !== 'local-candidates' && 'hidden')}>
        {section === 'local-candidates' && <ReviewV3LocalCandidateWorkbench initialCaseId={quickCaseId ?? undefined} />}
      </section>
      <section aria-label="审核批次管理" className={cn('relative min-h-0 flex-1 overflow-auto py-3 titlebar-no-drag', section !== 'batches' && 'hidden')}>
        <BatchPanel
          active={section === 'batches'}
          onOpenProject={async (caseId) => {
            const aggregate = await window.reviewAPI.openAggregateV2(caseId)
            if (aggregate) {
              setV2Aggregate(aggregate)
              setSection('case-v2')
              return true
            }
            const opened = await actions.selectCase(caseId)
            if (opened) setSection('workbench')
            return opened
          }}
        />
        {/* T07 独立评委评分：挂在批次区下方；仅在批次页激活时挂载，避免隐藏页后台读取（UI-16） */}
        {section === 'batches' && (
          <div className="mt-4 border-t border-border/60 pt-3">
            <ReviewV3T07Workbench />
          </div>
        )}
      </section>

      {/* ===== 助手抽屉（fixed 到本视图根） ===== */}
      <AssistantDrawer actions={actions} />

      {/* ===== 底部错误条 ===== */}
      {visibleError && (
        <div
          role="alert"
          className="absolute inset-x-0 bottom-0 z-30 flex items-start gap-2 bg-red-500/10 px-4 py-2 text-xs text-red-700 dark:text-red-400"
        >
          <span className={cn('min-w-0 flex-1', errorExpanded ? 'whitespace-pre-wrap break-all' : 'truncate')} title={visibleError}>
            {visibleError}
          </span>
          <button type="button" className="shrink-0 underline" onClick={() => setErrorExpanded((value) => !value)}>
            {errorExpanded ? '收起' : '展开'}
          </button>
          <button type="button" className="shrink-0 underline" onClick={() => void navigator.clipboard?.writeText(visibleError)}>复制</button>
          <button type="button" className="shrink-0 underline" onClick={() => setErrorDismissed(visibleError)}>关闭</button>
        </div>
      )}
    </div>
  )
}

/** 模型出口状态徽标；无模型只表示未配置，演示模拟由运行徽标单独说明。 */
function GatewayBadge({ status }: { status: ReviewModelGatewayStatus | null }): React.ReactElement | null {
  if (!status) return null
  if (status.available) {
    const label = status.protocol === 'local-private' ? '本地私有出口' : 'OpenAI 兼容出口'
    return (
      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
        {label}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
      未配置审核模型
    </span>
  )
}

/** 窄屏单栏切换按钮 */
function PaneTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] transition-colors',
        active ? 'bg-surface-raised font-medium text-foreground shadow-sm ring-1 ring-surface-border/35' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

/** 三栏容器：宽屏时 flex 比例 + 1px 分隔线；窄屏时按当前栏显隐 */
function PaneWrapper({
  pane,
  className,
  narrow,
  active,
  showSeparator,
  children,
}: {
  pane: Pane
  className: string
  narrow: boolean
  active: Pane
  showSeparator: boolean
  children: React.ReactNode
}): React.ReactElement {
  const visible = !narrow || active === pane
  // 隐藏栏中的定位计时器会先结束；重新挂载后按保留的焦点滚动并高亮。
  if (!visible) return <></>
  return (
    <div
      className={cn(
        'min-w-0 flex-col overflow-hidden',
        showSeparator && 'border-r border-border/60',
        // 宽屏三栏比例；窄屏单栏占满
        narrow ? 'flex w-full flex-1' : `flex ${className}`,
      )}
    >
      {children}
    </div>
  )
}
