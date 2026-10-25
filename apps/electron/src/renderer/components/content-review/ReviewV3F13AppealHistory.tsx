import { useMemo } from 'react'
import type { CaseAggregateV2 } from '@profer/shared'
import { buildF13AppealHistory } from './review-v3-f13-appeal-history'

const decisionText: Record<string, string> = {
  pass: '通过', 'partial-pass': '部分通过', reject: '驳回', return: '退回', withdraw: '撤回',
}

/** 申诉历史始终从当前唯一案卷读取；旧决定和证据版本只展示，不暗中改写。 */
export function ReviewV3F13AppealHistory({ aggregate }: { aggregate: CaseAggregateV2 }): JSX.Element {
  const items = useMemo(() => buildF13AppealHistory(aggregate), [aggregate])
  if (items.length === 0) return <p className="text-muted-foreground">暂无申诉。</p>

  return (
    <ol className="space-y-2" aria-label="申诉及独立复审历史">
      {items.map(({ appeal, original, amendment, reviewTask, reviewReceipt, withdrawalReceipt, evidence, statusLabel, outcomeLabel, warnings, originalSuperseded }) => (
        <li key={appeal.id} className="space-y-1 rounded-md border bg-background p-2">
          <div className="flex flex-wrap justify-between gap-1">
            <strong>{statusLabel} · {appeal.id}</strong>
            <span className="text-muted-foreground">{new Date(appeal.createdAt).toLocaleString()}</span>
          </div>
          <p>提交人：{appeal.appellant.actorId}（{appeal.appellant.actorSource}）</p>
          <p>申诉理由：{appeal.statement}</p>
          <p>原决定：{original
            ? `${decisionText[original.result] ?? original.result} · ${original.id} · ${original.reason}`
            : appeal.againstDecisionId}
            {originalSuperseded ? '（已被后续决定更正）' : ''}</p>
          {evidence.length > 0 && <p>所附证据：{evidence.map(({ id, document }) =>
            `${document?.fileName ?? '原件版本缺失'}（${id}${document?.active === false ? '，旧版' : ''}）`).join('、')}</p>}
          {reviewTask && <p className="text-muted-foreground">复审任务：{reviewTask.id} · {reviewTask.assigneeRole}
            {reviewTask.assigneeActorId ? ` / ${reviewTask.assigneeActorId}` : ' / 未指派具体人员'} · {reviewTask.status}</p>}
          <p className="font-medium">处理结果：{outcomeLabel}</p>
          {reviewReceipt && <p className="text-muted-foreground">复核回执：{reviewReceipt.actor?.actorId ?? '未知操作人'} · {new Date(reviewReceipt.at).toLocaleString()} · {reviewReceipt.summary}</p>}
          {withdrawalReceipt && <p className="text-muted-foreground">撤回回执：{withdrawalReceipt.actor?.actorId ?? '未知操作人'} · {new Date(withdrawalReceipt.at).toLocaleString()}</p>}
          {amendment && <p>更正后决定：{decisionText[amendment.result] ?? amendment.result} · {amendment.id} · {amendment.reason}
            （{amendment.actor.actorId}，依据运行 {amendment.basedOnRunId}）</p>}
          {warnings.map((warning, index) => <p role="note" className="text-amber-700 dark:text-amber-300" key={`${appeal.id}-${index}`}>待核对：{warning}</p>)}
        </li>
      ))}
    </ol>
  )
}
