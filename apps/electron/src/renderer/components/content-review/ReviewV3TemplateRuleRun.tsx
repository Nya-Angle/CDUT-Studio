/**
 * 已发布模板规则检查入口（ARCH-CLOSURE-R01 S2/S4）。
 *
 * 用户点一次按钮，Main 用真实已发布模板与案卷已确认字段编译冻结计划、
 * 跑 T04 确定性检查并写入真实 ReviewRunV2；界面只展示 Main 返回的结果，
 * 不构造任何 Plan / Check / Run。
 */
import * as React from 'react'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'

interface RuleRunResult {
  runId: string
  planFingerprint: string
  status: 'completed' | 'partially-completed'
  ruleIds: string[]
  checks: Array<{ checkId: string; ruleId: string; status: string; reason: string }>
}

const statusLabel: Record<string, string> = {
  compliant: '符合',
  'non-compliant': '不符合',
  'awaiting-confirmation': '待确认',
  'awaiting-supplement': '待补件',
  'not-applicable': '不适用',
  'not-executed': '未执行',
  'execution-failed': '执行失败',
}

export function ReviewV3TemplateRuleRun({ caseId }: { caseId: string }): JSX.Element {
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<RuleRunResult | null>(null)
  const [error, setError] = React.useState('')

  const run = React.useCallback(async (): Promise<void> => {
    if (!caseId) return
    setBusy(true); setError('')
    try {
      const value = await window.reviewAPI.runTemplateRuleReview({ caseId })
      setResult(value as RuleRunResult)
      toast.success(`规则检查完成：${value.checks.length} 项`)
    } catch (cause) {
      // 模板规则未确认或不可编译时如实报出，不降级成「通过」
      setError(cause instanceof Error ? cause.message : String(cause))
      setResult(null)
    } finally { setBusy(false) }
  }, [caseId])

  return (
    <section aria-label="已发布模板规则检查" className="space-y-2 rounded-lg border border-border/60 p-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={busy || !caseId} onClick={() => void run()}>
          按模板规则检查
        </Button>
        <span className="text-muted-foreground">
          使用本案卷已发布模板的负责人确认规则，结果写入真实审核运行
        </span>
      </div>

      {error && (
        <p className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-amber-900">{error}</p>
      )}

      {result && (
        <div className="space-y-1">
          <p className="text-muted-foreground">
            运行 {result.runId} · 状态 {result.status === 'completed' ? '已完成' : '部分完成'} ·
            计划 {result.planFingerprint.slice(0, 12)}…
          </p>
          <ul className="space-y-1">
            {result.checks.map((check) => (
              <li key={check.checkId} className="flex flex-wrap items-baseline gap-2">
                <span className={
                  check.status === 'compliant' ? 'font-medium text-emerald-700'
                    : check.status === 'non-compliant' ? 'font-medium text-rose-700'
                      : 'font-medium text-amber-700'
                }>
                  {statusLabel[check.status] ?? check.status}
                </span>
                <span className="text-muted-foreground">{check.ruleId}</span>
                <span>{check.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
