/**
 * Published-template submission material gate. Only formal submission uses
 * this gate: early analysis may run with partially missing materials.
 *
 * Applicability comes from THIS template's requiredWhen condition; an unknown
 * condition is never silently treated as required or not required.
 */
import { reviewV3SlotAcceptsFile, type CaseAggregateV2, type TemplateVersion } from '@profer/shared'
import { conditionT04, type T04Item, type T04Value } from './review-v3-t04-rules-scoring'

export interface ReviewV3SubmissionMaterialIssue {
  slotId: string
  slotName: string
  kind: 'missing' | 'too-many' | 'applicability-unknown'
  message: string
}

/** Only case-confirmed values are usable here. No extraction/model guesses. */
function confirmedCaseFields(aggregate:CaseAggregateV2):Record<string,T04Value>{
  const fields:Record<string,T04Value>={}
  for(const [key,field] of Object.entries(aggregate.caseV2.caseFields??{})){
    if(!field||!('value' in field))continue
    const value=field.value
    if(typeof value==='string'||typeof value==='number'||typeof value==='boolean'){
      fields[key]={value,confirmed:typeof value!=='number'||Number.isFinite(value)}
    }
  }
  return fields
}

/** Phase-aware checks; submission and decision do not borrow each other's
 * requirements. Decision-stage checks are enforced at an approval transaction.
 */
export function reviewV3MaterialIssuesForPhase(
  aggregate:CaseAggregateV2,template:TemplateVersion,
  phase:'submission'|'decision',
):ReviewV3SubmissionMaterialIssue[]{
  const active=aggregate.caseV2.documents.filter(document=>document.active!==false)
  const target:T04Item={id:aggregate.caseV2.id,fields:confirmedCaseFields(aggregate)}
  const issues:ReviewV3SubmissionMaterialIssue[]=[]
  for(const slot of template.materialSlots??[]){
    if((slot.requiredAt??'submission')!==phase)continue
    const applicable=slot.requiredWhen?conditionT04(slot.requiredWhen,target):'true'
    if(applicable==='false')continue
    if(applicable==='unknown'){
      issues.push({
        slotId:slot.id,slotName:slot.name,kind:'applicability-unknown',
        message:slot.name+'：适用条件尚未确认，请补充对应业务字段，无法确定是否必交',
      })
      continue
    }
    const matches=active.filter(document=>document.materialSlotId===slot.id)
    const accepted=matches.filter(document=>reviewV3SlotAcceptsFile(slot,document.fileName)&&document.parseStatus!=='failed')
    const count=accepted.length
    if(count<slot.minCount){
      const invalid=matches.length-count
      issues.push({
        slotId:slot.id,slotName:slot.name,kind:'missing',
        message:slot.name+'（至少 '+slot.minCount+' 份，已核实 '+count+' 份'+(invalid?'；'+invalid+' 份格式不符或解析失败':'')+'）',
      })
    }
    if(Number.isSafeInteger(slot.maxCount)&&slot.maxCount>=0&&count>slot.maxCount){
      issues.push({
        slotId:slot.id,slotName:slot.name,kind:'too-many',
        message:slot.name+'（最多 '+slot.maxCount+' 份，当前 '+count+' 份）',
      })
    }
  }
  return issues
}

/** Preserve the submission-only contract for callers and existing test fixtures. */
export function reviewV3SubmissionMaterialIssues(
  aggregate:CaseAggregateV2,template:TemplateVersion,
):ReviewV3SubmissionMaterialIssue[]{
  return reviewV3MaterialIssuesForPhase(aggregate,template,'submission')
}
