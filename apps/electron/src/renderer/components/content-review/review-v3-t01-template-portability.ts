/** T01 portable no-code template draft: data only, never an approval or policy signature. */
import type { TemplateVersion } from '@profer/shared'
import { resetT01ImportedConfirmations } from './review-v3-t01-typed-criteria'

export interface T01TemplateEnvelope {
  format:'review-t01-template/1'
  template:TemplateVersion
}
export function exportT01Template(template:TemplateVersion):string {
  // V2 TemplateVersion contains configuration only, never applicant materials,
  // local credential, actor or Case/Run state.
  const {publishedAt: _publishedAt, ...configuration}=template
  return JSON.stringify({format:'review-t01-template/1',template:{...configuration,status:'draft'}},null,2)
}
const isObj = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)
const nonEmpty = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0
const FIELD_KINDS = new Set(['text', 'number', 'date', 'enum', 'multi', 'boolean', 'object', 'rows', 'attachment'])
const EXECUTIONS = new Set(['deterministic', 'semantic', 'manual'])
const TARGET_SCOPES = new Set(['subject', 'group', 'case'])
const STAGE_KINDS = new Set(['auto-check', 'manual-review', 'independent-rating', 'supplement-wait', 'summary', 'finalize', 'handoff'])

/**
 * TAR-19：导入只做顶层判断会把结构错误推迟到保存/运行期。
 * 这里按运行时真正消费的节点做一次深验；错误带字段路径，便于作者修正。
 * 数值约束保留描述，但 ownerStatement 由 resetT01ImportedConfirmations 清空。
 */
function assertImportedTemplateShape(t: Record<string, unknown>): void {
  if (!Array.isArray(t.fields) || !Array.isArray(t.materialSlots) || !Array.isArray(t.stages) || !Array.isArray(t.outputs)) {
    throw Error('T01_IMPORT_TEMPLATE_INVALID')
  }
  t.fields.forEach((field, index) => {
    if (!isObj(field) || !nonEmpty(field.key) || !nonEmpty(field.label) || typeof field.required !== 'boolean'
        || !FIELD_KINDS.has(String(field.kind))) {
      throw Error(`T01_IMPORT_FIELDS_INVALID: 第 ${index + 1} 个字段缺少 key/label/kind/required 或类型非法`)
    }
    if (field.scope !== undefined && field.scope !== 'case' && field.scope !== 'subject') {
      throw Error(`T01_IMPORT_FIELDS_INVALID: 字段 ${String(field.key)} 的作用域非法`)
    }
    if (field.sectionId !== undefined && !nonEmpty(field.sectionId)) {
      throw Error(`T01_IMPORT_FIELDS_INVALID: 字段 ${String(field.key)} 的分项 ID 为空`)
    }
  })
  t.materialSlots.forEach((slot, index) => {
    if (!isObj(slot) || !nonEmpty(slot.id) || !nonEmpty(slot.name)
        || !Number.isSafeInteger(slot.minCount) || (slot.minCount as number) < 0
        || !Number.isSafeInteger(slot.maxCount) || (slot.maxCount as number) < 0
        || !Array.isArray(slot.acceptedKinds)) {
      throw Error(`T01_IMPORT_SLOTS_INVALID: 第 ${index + 1} 个材料槽缺少 id/name/minCount/maxCount/acceptedKinds`)
    }
    if (slot.requiredAt !== undefined && slot.requiredAt !== 'submission' && slot.requiredAt !== 'decision') {
      throw Error(`T01_IMPORT_SLOTS_INVALID: 材料槽 ${String(slot.id)} 的 requiredAt 非法`)
    }
  })
  if (t.sections !== undefined) {
    if (!Array.isArray(t.sections)) throw Error('T01_IMPORT_TEMPLATE_INVALID')
    t.sections.forEach((section, index) => {
      if (!isObj(section) || !nonEmpty(section.id) || !nonEmpty(section.name)
          || !Number.isSafeInteger(section.order) || !Array.isArray(section.criteria)) {
        throw Error(`T01_IMPORT_SECTIONS_INVALID: 第 ${index + 1} 个分项结构非法`)
      }
      section.criteria.forEach((criterion, criterionIndex) => {
        if (!isObj(criterion) || !nonEmpty(criterion.id) || !nonEmpty(criterion.title)
            || !nonEmpty(criterion.requirement) || !EXECUTIONS.has(String(criterion.execution))
            || !TARGET_SCOPES.has(String(criterion.targetScope))) {
          throw Error(`T01_IMPORT_SECTIONS_INVALID: 分项 ${String(section.id)} 第 ${criterionIndex + 1} 条要求结构非法`)
        }
        const constraint = criterion.deterministicConstraint
        if (constraint !== undefined) {
          if (!isObj(constraint) || constraint.schemaVersion !== 1 || constraint.kind !== 'field-number-limit'
              || !nonEmpty(constraint.fieldKey) || constraint.fieldScope !== 'case'
              || !['lte', 'gte'].includes(String(constraint.operator))
              || typeof constraint.threshold !== 'number' || !Number.isFinite(constraint.threshold)) {
            throw Error(`T01_IMPORT_CRITERIA_INVALID: 分项 ${String(section.id)} 的数值条件格式非法`)
          }
        }
      })
    })
  }
  t.stages.forEach((stage, index) => {
    if (!isObj(stage) || !nonEmpty(stage.id) || !nonEmpty(stage.name) || !STAGE_KINDS.has(String(stage.kind))
        || !nonEmpty(stage.executorRole)) {
      throw Error(`T01_IMPORT_STAGES_INVALID: 第 ${index + 1} 个阶段结构非法`)
    }
  })
  t.outputs.forEach((output, index) => {
    if (!isObj(output) || !nonEmpty(output.id) || !nonEmpty(output.kind) || !nonEmpty(output.audience)) {
      throw Error(`T01_IMPORT_OUTPUTS_INVALID: 第 ${index + 1} 个输出结构非法`)
    }
  })
}

export function importT01Template(raw:string,templateId:string,createdAt:string):TemplateVersion {
  let payload:unknown
  try { payload=JSON.parse(raw) }
  catch { throw Error('T01_IMPORT_JSON') }
  if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('T01_IMPORT_INVALID')
  const packet=payload as Partial<T01TemplateEnvelope>
  if(packet.format!=='review-t01-template/1'||!packet.template||typeof packet.template!=='object')throw Error('T01_IMPORT_FORMAT')
  const t=packet.template as unknown as Record<string,unknown>
  if(t.schemaVersion!==2||typeof t.name!=='string'||!t.name.trim()||
    !Array.isArray(t.fields)||!Array.isArray(t.materialSlots)||
    !Array.isArray(t.stages)||!t.stages.length||
    !Array.isArray(t.outputs)||!Array.isArray(t.policyVersionIds)||
    !['person','organization','project','document','transaction','custom'].includes(String(t.objectType)))
      throw Error('T01_IMPORT_TEMPLATE_INVALID')
  assertImportedTemplateShape(t)
  // 外部文件对本机政策/发布状态的声明一律不继承：重新核对来源与版本是用户动作。
  return resetT01ImportedConfirmations({
    ...(t as unknown as TemplateVersion),templateId,version:1,createdAt,status:'draft',catalogKind:'custom',
    policyVersionIds:[],policyRefs:[],executionScope:undefined,publishedAt:undefined,
    sourceNote:[
      typeof t.sourceNote==='string'?t.sourceNote:'',
      '外部导入草稿：政策引用已清空；发布前核实制度版本与来源。',
    ].filter(Boolean).join(' '),
  })
}
