/**
 * T10 — 单案产品导航摘要。
 * 只投影当前 V3 案卷 / Run / 模板 / 待办，绝不建立另一套持久状态或业务决定。
 */
import * as React from 'react'
import { useAtomValue } from 'jotai'
import { ArrowRight, ClipboardList, FileStack, ListChecks } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import {
  reviewCaseAtom,
  reviewExecutionAtom,
  reviewRunningAtom,
  reviewWorkspaceAggregateAtom,
  reviewWorkspaceExtractedObservationsAtom,
  reviewWorkspaceRunAtom,
  reviewWorkspaceRunStaleAtom,
  reviewWorkspaceTemplateAtom,
  reviewWorkspaceSectionAtom,
} from '@/atoms/review-atoms'
import { reviewV2AggregateAtom } from './V2CasePanel'
import { buildReviewWorkspaceViewModel } from './review-workspace-view-model'

const STAGES: Record<string, string> = {
  draft: '草稿', submitted: '已提交', reviewing: '审核中',
  'awaiting-supplement': '等待补件', 'waiting-supplement': '等待补件',
  'needs-attention': '待处理', 'ready-for-decision': '可决定',
  decided: '已形成决定', archived: '已归档',
}
interface Props {
  onOpenReview: () => void
  onOpenMaterials: () => void
  onOpenTasks: () => void
  onOpenTemplates: () => void
  onOpenBusiness: () => void
}

function StatusItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }): React.ReactElement {
  return <div className="flex min-w-0 items-center gap-2 text-xs">
    <span className="shrink-0 text-muted-foreground">{icon}</span>
    <span className="shrink-0 text-muted-foreground">{label}</span>
    <span className="min-w-0 truncate font-medium text-foreground" title={value}>{value}</span>
  </div>
}

export function ReviewV3T10WorkspaceOverview({
  onOpenReview, onOpenMaterials, onOpenTasks, onOpenTemplates, onOpenBusiness,
}: Props): React.ReactElement {
  const legacy = useAtomValue(reviewCaseAtom)
  const nativeAggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const businessAggregate = useAtomValue(reviewV2AggregateAtom)
  const section = useAtomValue(reviewWorkspaceSectionAtom)
  // 较早版本的案卷可能尚无原生 ReviewCase 投影。业务面板激活时显示它正在办理的真实聚合，
  // 不把另一份当前选中案卷的 Run 或来源混到旧案卷上。
  const aggregate = section === 'case-v2' ? (businessAggregate ?? nativeAggregate) : nativeAggregate
  const nativeRun = useAtomValue(reviewWorkspaceRunAtom)
  const runStale = useAtomValue(reviewWorkspaceRunStaleAtom)
  const extracted = useAtomValue(reviewWorkspaceExtractedObservationsAtom)
  const template = useAtomValue(reviewWorkspaceTemplateAtom)
  const execution = useAtomValue(reviewExecutionAtom)
  const running = useAtomValue(reviewRunningAtom)

  const caseV2 = aggregate?.caseV2
  const matchesSelected = !caseV2 || caseV2.id === legacy?.id
  const run = matchesSelected ? nativeRun : null
  const view = aggregate ? buildReviewWorkspaceViewModel(aggregate, run, matchesSelected && runStale, matchesSelected ? extracted : [], matchesSelected ? template : null) : null
  const documents = caseV2?.documents.filter((document) => document.active !== false).length ?? legacy?.documents.length ?? 0
  const pending = view?.pendingActions.length ?? 0
  const pendingChecks = view?.pendingActions.filter((action) => action.kind === 'check' || action.kind === 'supplement').length ?? 0
  const templateName = caseV2?.templateId === 'pending-template-v3'
    ? '尚未绑定审核模板'
    : matchesSelected && template ? `${template.name} · v${template.version}`
      : matchesSelected && legacy?.reviewTemplate ? `${legacy.reviewTemplate.templateId} · v${legacy.reviewTemplate.version}`
        : caseV2 ? `${caseV2.templateId} · v${caseV2.templateVersion}` : '未选择'
  const executing = matchesSelected && (running || execution.status === 'running' || execution.status === 'preparing')
  const checkLabel = executing ? '正在运行'
    : runStale && matchesSelected ? '结果已过期，请重审'
      : run ? `${run.checks.length} 项已记录 · ${pendingChecks} 项需处理`
        : '尚无审核记录'
  const stageLabel = caseV2 ? (STAGES[caseV2.stage] ?? caseV2.stage) : '尚无业务案卷'

  let nextLabel = '选择或新建案卷'
  let nextDetail = '先打开一个审核项目，材料、检查和办理会跟随同一案卷。'
  let goNext = onOpenReview
  if (caseV2 || legacy) {
    if (caseV2?.stage === 'decided') {
      nextLabel = '查看本案办理记录'
      nextDetail = '查看决定、历史和报告；已完成决定不表示每项 AI 发现均被确认。'
      goNext = onOpenBusiness
    } else if (caseV2?.templateId === 'pending-template-v3') {
      nextLabel = '配置本案模板'
      nextDetail = '本案还没有绑定已核验的审核方案，不能将草稿当成正式规则。'
      goNext = onOpenTemplates
    } else if (documents === 0) {
      nextLabel = '添加申请与证明材料'
      nextDetail = '先登记真实原件，再进行来源核验和规则检查。'
      goNext = onOpenMaterials
    } else if (executing) {
      nextLabel = '查看审核执行进度'
      nextDetail = '执行进度与结果保留在当前案卷。'
      goNext = onOpenTasks
    } else if (!run || runStale) {
      nextLabel = runStale && matchesSelected ? '按当前材料重新审核' : '进入审核工作台'
      nextDetail = matchesSelected ? '在当前案卷核对材料并启动审核。' : '当前办理的是历史案卷，请先在审核工作台选择对应案卷。'
      goNext = matchesSelected ? onOpenTasks : onOpenReview
    } else if (pending > 0) {
      nextLabel = `处理待确认事项（${pending}）`
      nextDetail = view?.pendingActions[0]?.title ?? '核对原件、处理问题或登记补件。'
      goNext = onOpenTasks
    } else {
      nextLabel = '查看业务办理与决定'
      nextDetail = '自动检查完成不等于正式决定；请由有权的本地人员处理。'
      goNext = onOpenBusiness
    }
  }

  return <section aria-label="当前案卷概览" className="shrink-0 border-b border-border/60 bg-card/30 px-4 py-2.5">
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-2">
        <StatusItem icon={<FileStack size={14}/>} label="材料" value={`${documents} 份已登记`} />
        <StatusItem icon={<ListChecks size={14}/>} label="检查" value={checkLabel}/>
        <StatusItem icon={<ClipboardList size={14}/>} label="业务" value={stageLabel}/>
      </div>
      <span className="min-w-0 max-w-full truncate text-[11px] text-muted-foreground" title={templateName}>
        审核模板：{templateName}{run && !runStale ? ` · Run ${run.id.slice(0,10)}` : ''}
      </span>
    </div>
    <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-md bg-background/65 px-2.5 py-1.5">
      <p className="min-w-0 flex-1 truncate text-xs" title={nextDetail}>
        <span className="font-medium text-foreground">下一步：{nextLabel}</span>
        <span className="ml-2 text-muted-foreground">{nextDetail}</span>
      </p>
      <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs" onClick={goNext}>
        前往处理 <ArrowRight size={12}/>
      </Button>
    </div>
  </section>
}
