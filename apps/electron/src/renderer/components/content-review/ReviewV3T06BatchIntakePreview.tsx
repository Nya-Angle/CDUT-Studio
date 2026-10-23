/** T06: explicit batch roster mapping onto existing cases, without writing Case or material state. */
import { useMemo, useState } from 'react'
import { Button } from '@profer/ui/primitives/button'
import type { BatchManifestRow } from './review-v3-t06-batch-intake'
import { parseBatchManifest, previewBatchAssignment } from './review-v3-t06-batch-intake'

export interface T06CaseOption {
  caseId: string
  title: string
  applicant?: string
}

export function ReviewV3T06BatchIntakePreview({
  availableCases, onApply,
}: {
  availableCases: T06CaseOption[]
  onApply: (caseIds: string[]) => void
}): JSX.Element {
  const [filename, setFilename] = useState('')
  const [rows, setRows] = useState<BatchManifestRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [overrides, setOverrides] = useState<Record<number, string>>({})
  const [excluded, setExcluded] = useState<Set<number>>(new Set())
  const [reading, setReading] = useState(false)
  const [applied, setApplied] = useState(false)

  const assignments = useMemo(
    () => previewBatchAssignment(rows, availableCases, overrides, excluded),
    [rows, availableCases, overrides, excluded],
  )
  const ready = assignments.filter((item) => item.status === 'ready')
  const pending = assignments.filter((item) => !['ready', 'excluded'].includes(item.status))
  const excludedCount = assignments.filter((item) => item.status === 'excluded').length

  // 已应用的名册一旦更改，必须撤销旧选择；否则父级可能以旧分案名单建批次。
  const invalidateApplied = (): void => {
    if (applied) onApply([])
    setApplied(false)
  }

  const loadFile = async (file: File | undefined): Promise<void> => {
    if (!file) return
    setReading(true)
    invalidateApplied()
    setFilename(file.name)
    setOverrides({})
    setExcluded(new Set())
    try {
      const parsed = parseBatchManifest(await file.text(), file.name)
      setRows(parsed.rows)
      setErrors(parsed.errors)
    } catch (cause) {
      setRows([])
      setErrors([cause instanceof Error ? cause.message : String(cause)])
    } finally {
      setReading(false)
    }
  }

  const skipRow = (line: number, checked: boolean): void => {
    setExcluded((current) => {
      const next = new Set(current)
      if (checked) next.add(line)
      else next.delete(line)
      return next
    })
    invalidateApplied()
  }

  return (
    <section className="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold">从批次清单分案</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            导入 CSV / TSV，按案卷 ID 精确匹配现有项目；无法匹配的记录逐项手动指定或排除。
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-muted">
          {reading ? '正在读取…' : '选择清单文件'}
          <input type="file" className="sr-only" accept=".csv,.tsv,text/csv,text/tab-separated-values"
            disabled={reading} onChange={(event) => {
              void loadFile(event.target.files?.[0])
              event.currentTarget.value = ''
            }} />
        </label>
      </div>

      <p className="text-[11px] text-muted-foreground">
        表头支持「案卷ID、申请编号、申报人、项目名称、材料文件」。姓名、学号和文件名只用于核对，不自动绑定到别人案卷。
        本步只导入分案清单，不上传原件，也不创建新案卷。
      </p>
      {filename && <p className="text-[11px] text-muted-foreground">当前清单：{filename} · {rows.length} 行</p>}
      {errors.map((error, index) => (
        <p key={index} className="text-xs text-destructive" role="alert">{error}</p>
      ))}
      {rows.length > 0 && (
        <>
          <p className="text-xs">
            <span className="text-emerald-700 dark:text-emerald-400">可纳入 {ready.length}</span>
            {' · '}待处理 {pending.length} · 已排除 {excludedCount}
          </p>
          <div className="max-h-64 overflow-auto rounded-md border border-border bg-background">
            <table className="w-full min-w-[550px] text-left text-[11px]">
              <thead className="sticky top-0 bg-muted text-muted-foreground">
                <tr>
                  <th className="p-2">行号 / 清单对象</th>
                  <th className="p-2">绑定到本模板案卷</th>
                  <th className="p-2">核对情况</th>
                  <th className="p-2 text-center">排除</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {assignments.map(({ row, caseId, status, detail }) => (
                  <tr key={row.line} className={status === 'excluded' ? 'opacity-60' : ''}>
                    <td className="p-2 align-top">
                      <div className="font-medium">第 {row.line} 行 · {row.applicant || row.title || row.externalId || row.caseId || '未命名对象'}</div>
                      {row.externalId && <div className="text-muted-foreground">外部编号：{row.externalId}</div>}
                      {row.files && <div className="max-w-[160px] truncate text-muted-foreground" title={row.files}>文件清单（未上传）：{row.files}</div>}
                    </td>
                    <td className="p-2 align-top">
                      <select
                        aria-label={'清单第 ' + row.line + ' 行绑定案卷'}
                        className="w-full max-w-[230px] rounded-md border border-input bg-background p-1.5"
                        value={caseId}
                        disabled={status === 'excluded'}
                        onChange={(event) => {
                          setOverrides((current) => ({ ...current, [row.line]: event.target.value }))
                          invalidateApplied()
                        }}
                      >
                        <option value="">未绑定（请选择）</option>
                        {availableCases.map((item) => (
                          <option key={item.caseId} value={item.caseId}>
                            {item.title} · {item.applicant || '未填写'} · {item.caseId}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={'p-2 align-top ' + (status === 'ready' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400')}>
                      {detail}
                    </td>
                    <td className="p-2 text-center align-top">
                      <input type="checkbox" checked={excluded.has(row.line)}
                        aria-label={'排除清单第 ' + row.line + ' 行'}
                        onChange={(event) => skipRow(row.line, event.target.checked)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">
              {pending.length ? '请先修正重复、错绑与未归属行，或逐行明确排除，再应用分案。'
                : applied ? '分案已应用；任何改绑、排除或更换清单均会撤销旧选择。' : '所有未排除的行均已确认。'}
            </p>
            <Button type="button" size="sm" variant="outline" disabled={pending.length > 0 || ready.length === 0}
              onClick={() => {
                onApply(ready.map((item) => item.caseId))
                setApplied(true)
              }}>
              {applied ? '已应用，可继续创建批次' : '应用分案结果'}
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
