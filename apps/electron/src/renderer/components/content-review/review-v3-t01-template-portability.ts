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
export function importT01Template(raw:string,templateId:string,createdAt:string):TemplateVersion {
  const payload:unknown=JSON.parse(raw)
  if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('T01_IMPORT_INVALID')
  const packet=payload as Partial<T01TemplateEnvelope>
  if(packet.format!=='review-t01-template/1'||!packet.template||typeof packet.template!=='object')throw Error('T01_IMPORT_FORMAT')
  const t=packet.template
  if(t.schemaVersion!==2||typeof t.name!=='string'||!t.name.trim()||
    !Array.isArray(t.fields)||!Array.isArray(t.materialSlots)||
    !Array.isArray(t.stages)||!t.stages.length||
    !Array.isArray(t.outputs)||!Array.isArray(t.policyVersionIds)||
    !['person','organization','project','document','transaction','custom'].includes(t.objectType))
      throw Error('T01_IMPORT_TEMPLATE_INVALID')
  return resetT01ImportedConfirmations({
    ...t,templateId,version:1,createdAt,status:'draft',catalogKind:'custom',
    sourceNote:[t.sourceNote,'外部导入草稿：发布前核实制度版本与来源。'].filter(Boolean).join(' '),
    publishedAt:undefined,
  })
}
