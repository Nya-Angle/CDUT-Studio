/** F17 只生成经人工确认后送交现有 Main UpdateFields 的类型化 payload。 */
import type { FieldValue } from '@profer/shared'
import type { T08FieldTarget } from './review-v3-t08-suggestion'

export function makeF17FieldPatch(target: T08FieldTarget, value: FieldValue): {
  caseFieldValues?: Record<string, unknown>
  subjectFieldValues?: Array<{ subjectId: string; values: Record<string, unknown> }>
} {
  if (value.kind !== target.field.kind) throw new Error('字段类型与已发布模板不匹配')
  if (value.kind === 'attachment' || value.kind === 'object' || value.kind === 'rows')
    throw new Error('该字段不能由助手草案修改')
  if (value.kind === 'multi' && !value.value.length) throw new Error('多选字段至少需要一个有效选项')
  const raw = value.value
  if (target.scope === 'case') return { caseFieldValues: { [target.field.key]: raw } }
  if (!target.subjectId) throw new Error('缺少要修改的事项 ID')
  return { subjectFieldValues: [{ subjectId: target.subjectId, values: { [target.field.key]: raw } }] }
}
