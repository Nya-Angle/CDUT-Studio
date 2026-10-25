/**
 * 审核提示词的字段契约（从历史 Dev 分支定向移植）。
 *
 * 问题背景：`pi-case-review-service` 在**事后**用 `template.fields.find(...)`
 * 校验模型提交的 fieldKey，不符就抛错。但提示词从未**事前**告知模型哪些
 * fieldKey 合法，字段型模板下模型只能靠猜，猜错即被拒、白耗轮次。
 *
 * 本模块只做一件事：把模板已声明的 FieldSpec 如实列进提示词。
 * 它不判断业务、不增删字段、不改变任何授权语义——字段仍是唯一真值，
 * 这里只是把既有真值提前告诉模型。
 */
import type { TemplateVersion } from '@profer/shared'

/**
 * 生成「可提交事实字段」段落。
 *
 * - 模板无字段时（如 D2 技术预审候选壳）：明确要求 observations 省略或为空，
 *   并禁止模型为对象键/场景/材料名等自造 fieldKey。
 * - 模板有字段时：逐条列出 key / kind / 作用域，并要求引文与 blockId 真实。
 */
export function piObservationFieldContract(
  template: Pick<TemplateVersion, 'fields'>,
  caseId: string,
): string {
  const fields = template.fields
  if (!fields.length) {
    return [
      '【可提交事实字段】本模板没有声明任何 FieldSpec：review_submit_result 的 observations 必须省略或为 []。',
      '不要为对象键、场景、条件、材料名、claim_item 等自动创造 fieldKey；这些属于固定 Plan 或检查理由，不是 Observation。',
    ].join('\n')
  }
  return [
    '【可提交事实字段】仅允许以下模板已声明的 FieldSpec（字段 ID、类型、作用域均须精确匹配）：',
    ...fields.map((field) => {
      const scope = field.scope === 'case'
        ? `case（subjectId 必须是 ${caseId}）`
        : 'subject（subjectId 必须属于本案、匹配分项）'
      return `- ${field.key} | ${field.kind} | ${scope}${field.sectionId ? ` | sectionId=${field.sectionId}` : ''} | ${field.label}`
    }),
    '任何 observations 必须有真实 material documentVersionId、blockId 与准确引文，未经用户确认只能为事实候选；禁止添加任何未列出的 fieldKey。',
  ].join('\n')
}
