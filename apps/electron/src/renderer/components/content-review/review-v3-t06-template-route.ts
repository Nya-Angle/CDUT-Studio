import type { T06PhysicalGroup } from './review-v3-t06-physical-intake'

export interface T06TemplateFieldOption {
  key: string
  label: string
  kind: string
  required: boolean
  scope?: 'case' | 'subject'
  options?: Array<{ value: string; label?: string }>
}
export interface T06TemplateSlotOption {
  id: string
  name: string
  minCount: number
  requiredAt?: 'submission' | 'decision'
}
export interface T06PublishedTemplateOption {
  templateId: string
  version: number
  name: string
  /** 只读模板元数据，用于在分案确认页填写必填案卷字段与绑定材料槽。 */
  fields?: T06TemplateFieldOption[]
  materialSlots?: T06TemplateSlotOption[]
}

/** 选中模板后需要用户确认的案卷级必填字段。 */
export function t06RequiredCaseFields(template: T06PublishedTemplateOption | undefined): T06TemplateFieldOption[] {
  return (template?.fields ?? []).filter((field) => (field.scope ?? 'subject') === 'case' && field.required)
}

/** 选中模板后必交的材料槽（只用于提示，不自动猜测文件归属）。 */
export function t06RequiredSubmissionSlots(template: T06PublishedTemplateOption | undefined): T06TemplateSlotOption[] {
  return (template?.materialSlots ?? []).filter((slot) => slot.minCount > 0 && (slot.requiredAt ?? 'submission') === 'submission')
}

/** 只提取文件夹明确写出的申请人字段；普通文件夹名不能当作真实申请人。 */
export function suggestT06ApplicantFromFolder(name: string): string | undefined {
  const match = name.match(/(?:^|[ _＿,，;；])(?:申请人|申请单位|提交人)\s*[:：=]\s*([^_＿,，;；|｜]+)/)
  return match?.[1]?.trim() || undefined
}

/**
 * 用已发布模板的名称/编号做保守预路由。
 * 只在资料路径有明确唯一命中时返回建议；无法从文件名证明业务类型时交给用户确认。
 * 这不是材料语义分类，后续可直接换成主审核入口的 B3 路由实现。
 */
export function suggestT06GroupTemplate(
  group: T06PhysicalGroup,
  templates: readonly T06PublishedTemplateOption[],
): T06PublishedTemplateOption | undefined {
  const context = [group.name, ...group.entries.map(item => item.relativePath)]
    .join(' ').normalize('NFKC').toLocaleLowerCase()
  const scores = templates.map(template => {
    const id = template.templateId.normalize('NFKC').toLocaleLowerCase()
    const name = template.name.normalize('NFKC').toLocaleLowerCase()
    const labels = name.split(/[\s/／|｜,，、:：()（）·—-]+/g).filter(item => item.length >= 3)
    return { template, score: (id.length >= 4 && context.includes(id) ? 4 : 0)
      + (name.length >= 3 && context.includes(name) ? 4 : 0)
      + labels.reduce((score, label) => score + (context.includes(label) ? 1 : 0), 0) }
  }).filter(item => item.score >= 2).sort((a, b) => b.score - a.score)
  return scores.length === 1 || (scores.length > 1 && scores[0]!.score > scores[1]!.score + 1)
    ? scores[0]!.template : undefined
}
