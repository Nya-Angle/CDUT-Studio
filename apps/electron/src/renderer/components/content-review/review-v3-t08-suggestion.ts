/**
 * T08 reviewed application model. AI opinions are prose, not trusted field
 * commands. The reviewer must explicitly choose an existing template field
 * and author the replacement value before a Main-owned UpdateFields command.
 */
import type { CaseAggregateV2, FieldSpec, FieldValue, TemplateVersion } from '@profer/shared'

export interface T08FieldTarget {
  id: string
  label: string
  scope: 'case' | 'subject'
  subjectId?: string
  field: FieldSpec
  before?: FieldValue
}

const editableKinds = new Set<FieldSpec['kind']>(['text', 'number', 'date', 'enum', 'multi', 'boolean'])

export function getT08FieldTargets(aggregate: CaseAggregateV2, template: TemplateVersion | null): T08FieldTarget[] {
  if (!template || template.templateId !== aggregate.caseV2.templateId ||
    template.version !== aggregate.caseV2.templateVersion) return []
  const targets: T08FieldTarget[] = []
  for (const field of template.fields) {
    if (field.readOnly || !editableKinds.has(field.kind)) continue
    if (field.scope === 'case') {
      targets.push({ id: 'case:' + field.key, label: '案卷 · ' + field.label, scope: 'case',
        field, before: aggregate.caseV2.caseFields[field.key] })
    } else {
      for (const subject of aggregate.caseV2.subjects) {
        if (field.sectionId && subject.sectionId !== field.sectionId) continue
        targets.push({ id: 'subject:' + subject.id + ':' + field.key,
          label: subject.title + ' · ' + field.label, scope: 'subject', subjectId: subject.id,
          field, before: subject.fields[field.key] })
      }
    }
  }
  return targets
}

export function showT08FieldValue(value?: FieldValue): string {
  if (!value) return '未填写'
  if (value.kind === 'attachment') return '附件 ' + value.documentVersionId
  if (value.kind === 'multi') return value.value.join('、')
  if (value.kind === 'object' || value.kind === 'rows') return JSON.stringify(value.value)
  return String(value.value)
}

export function parseT08FieldDraft(field: FieldSpec, text: string): FieldValue {
  const value = text.trim()
  if (!editableKinds.has(field.kind)) throw new Error('该字段类型不支持助手直接应用')
  if (!value) throw new Error('请填写明确的新值；空值不能代替删除字段')
  switch (field.kind) {
    case 'number': {
      const num = Number(value)
      if (!Number.isFinite(num)) throw new Error('需要有效数字')
      if (field.min !== undefined && num < field.min) throw new Error('数字小于模板最小值 ' + field.min)
      if (field.max !== undefined && num > field.max) throw new Error('数字大于模板最大值 ' + field.max)
      return { kind: 'number', value: num, ...(field.unit ? { unit: field.unit } : {}) }
    }
    case 'boolean':
      if (value !== 'true' && value !== 'false') throw new Error('布尔字段只能选择是或否')
      return { kind: 'boolean', value: value === 'true' }
    case 'date':
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + 'T00:00:00Z')) ||
        new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) !== value)
        throw new Error('请输入真实日期 YYYY-MM-DD')
      return { kind: 'date', value }
    case 'enum':
      if (field.options?.length && !field.options.some((option) => option.value === value))
        throw new Error('选项不属于模板允许的值')
      return { kind: 'enum', value }
    case 'multi':
      return { kind: 'multi', value: [...new Set(value.split(/[,，、\n]+/).map((item) => item.trim()).filter(Boolean))] }
    default:
      return { kind: 'text', value }
  }
}

export function makeT08FieldUpdate(target: T08FieldTarget, value: FieldValue): {
  caseFieldValues?: Record<string, string>
  subjectFieldValues?: Array<{ subjectId: string; values: Record<string, string> }>
} {
  if (value.kind !== target.field.kind) throw new Error('字段类型与模板不匹配')
  // Main's current updateFieldsC0 does not pass a template to updateFields().
  // Its fallback turns ALL input into {kind:'text', value:String(raw)}.
  // Until L wires typed template validation, only genuine text can be safely saved.
  if (value.kind !== 'text') throw new Error('该字段需先接入 Main 的模板类型写入服务；不能将数字或日期错误保存为文本')
  if (target.scope === 'case') return { caseFieldValues: { [target.field.key]: value.value } }
  if (!target.subjectId) throw new Error('事项 ID 缺失')
  return { subjectFieldValues: [{ subjectId: target.subjectId, values: { [target.field.key]: value.value } }] }
}
