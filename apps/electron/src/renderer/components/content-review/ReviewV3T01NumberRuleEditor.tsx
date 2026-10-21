/** T01 numeric-rule authoring: structured, explicitly owner-confirmed, never a Run. */
import { useState } from 'react'
import type { FieldSpec, TemplateCriterionSpec } from '@profer/shared'
import {
  confirmT01NumberLimit, readT01NumberLimit, setT01NumberLimit,
  type T01NumberLimit,
} from './review-v3-t01-typed-criteria'

interface Props {
  criterion: TemplateCriterionSpec
  fields: FieldSpec[]
  onChange: (next: TemplateCriterionSpec) => void
}

export function ReviewV3T01NumberRuleEditor({ criterion, fields, onChange }: Props): JSX.Element {
  const [reviewer, setReviewer] = useState('')
  const [source, setSource] = useState('')
  const numberFields = fields.filter(field => field.kind === 'number' && field.scope === 'case')
  const current = readT01NumberLimit(criterion)
  const selectedField = numberFields.find(field => field.key === current?.fieldKey)
  const update = (patch: Partial<Pick<T01NumberLimit, 'fieldKey' | 'operator' | 'threshold' | 'unit'>>): void => {
    if (!current) return
    // Any semantic change invalidates the previous owner's confirmation.
    const { ownerStatement: _previous, ...constraint } = current
    onChange(setT01NumberLimit(criterion, { ...constraint, ...patch }))
  }
  if (!current) {
    return numberFields.length > 0 ? (
      <button type="button" className="rounded border bg-background px-2 py-1 text-xs"
        onClick={() => {
          const field = numberFields[0]!
          onChange(setT01NumberLimit(criterion, {
            schemaVersion: 1, kind: 'field-number-limit', fieldKey: field.key,
            fieldScope: 'case', operator: 'lte',
            threshold: field.max ?? 0, ...(field.unit ? { unit: field.unit } : {}),
          }))
        }}>改用案卷数值规则（确定性、需负责人确认）</button>
    ) : <p className="text-xs text-muted-foreground">请先添加一个案卷级数字字段，才能配置数值检查。</p>
  }
  return <div className="mt-2 rounded-md border bg-background p-3 text-xs">
    <p className="font-medium">已配置的确定性规则：基于案卷数字字段，非表单最大值校验</p>
    <div className="mt-2 grid gap-2 md:grid-cols-3">
      <label>核验字段
        <select aria-label="确定性数值字段" className="mt-1 w-full rounded border px-2 py-1" value={current.fieldKey}
          onChange={event => {
            const field = numberFields.find(f => f.key === event.target.value)
            if (field) update({fieldKey:field.key,unit:field.unit})
          }}>
          {numberFields.map(field => <option value={field.key} key={field.key}>{field.label}（{field.key}）</option>)}
        </select>
      </label>
      <label>比较关系
        <select aria-label="确定性比较关系" className="mt-1 w-full rounded border px-2 py-1" value={current.operator}
          onChange={event => update({operator:event.target.value as T01NumberLimit['operator']})}>
          <option value="lte">小于等于（≤）</option>
          <option value="gte">大于等于（≥）</option>
        </select>
      </label>
      <label>阈值（{selectedField?.unit ?? '数值'}）
        <input aria-label="确定性阈值" type="number" className="mt-1 w-full rounded border px-2 py-1"
          value={Number.isFinite(current.threshold) ? String(current.threshold) : ''}
          onChange={event => update({threshold:event.target.value === '' ? NaN : Number(event.target.value)})}/>
      </label>
    </div>
    {current.ownerStatement ? (
      <p className="mt-2 text-emerald-700">负责人已确认：{current.ownerStatement.enteredBy} · {current.ownerStatement.text}</p>
    ) : <p className="mt-2 text-amber-700">尚未由负责人确认。可以保存草稿，但发布前必须确认依据。</p>}
    {current.operator === 'gte' && <p className="mt-2 text-amber-700 dark:text-amber-300">下限规则暂可起草与保存，Main/T04 尚未提供正式下限算子；发布校验将提示暂缓。</p>}
    <div className="mt-2 grid gap-2 md:grid-cols-2">
      <label>负责人 / 确认者
        <input aria-label="规则确认者" className="mt-1 w-full rounded border px-2 py-1" value={reviewer}
          placeholder="本地负责人的显示名" onChange={event=>setReviewer(event.target.value)}/>
      </label>
      <label>依据原文（仅填写真实负责人明确要求）
        <input aria-label="规则依据原文" className="mt-1 w-full rounded border px-2 py-1" value={source}
          placeholder="例如：本次实验室使用申请人数不得超过20人"
          onChange={event=>setSource(event.target.value)}/>
      </label>
    </div>
    <button type="button" className="mt-2 rounded border px-2 py-1 disabled:opacity-50"
      disabled={!reviewer.trim() || !source.trim() || !Number.isFinite(current.threshold) || !selectedField}
      onClick={() => onChange(confirmT01NumberLimit(criterion, {
        kind: 'owner-statement', text: source.trim(), enteredBy: reviewer.trim(), enteredAt: new Date().toISOString(),
      }))}>明确确认并锁定此版规则依据</button>
    <p className="mt-2 text-muted-foreground">更改规则文字、字段或阈值，以及从旧模板派生新版本时，原确认会失效。作者确认只是本地声明，可信身份与实际 CheckResult 仍由 Main/Run 核验。</p>
  </div>
}
