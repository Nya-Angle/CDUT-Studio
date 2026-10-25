/**
 * D2 structured condition/material semantics. This is NOT a policy authority engine:
 * only current, active material links explicitly confirmed by a reviewer and
 * confirmed observations on the exact target can enable definitive findings.
 * Absence or parse failure is UNKNOWN, never FALSE.
 */
import type {
  CaseAggregateV2, D2ExecutionGateV1, D2GateExpressionV1, D2RuleBinding,
  CheckStatus,
} from '@profer/shared'

export type D2Tri = 'true' | 'false' | 'unknown'
const FIELD = /^[a-zA-Z][a-zA-Z0-9:._-]{0,119}$/
const STAGES = new Set([
  'draft','submitted','reviewing','awaiting-supplement','awaiting-review',
  'awaiting-rating','awaiting-final','decided','archived',
])
function exactKeys(value: Record<string,unknown>, keys: string[], at: string, errors: string[]) {
  for(const k of Object.keys(value))if(!keys.includes(k))errors.push(at+' unsupported key '+k)
}
function expressionIssues(expr: D2GateExpressionV1, depth: number, errors: string[]) {
  if(depth>12){errors.push('D2_GATE_DEPTH');return}
  if(!expr||typeof expr!=='object'){errors.push('D2_GATE_EXPRESSION_INVALID');return}
  if(expr.kind==='all'||expr.kind==='any'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','conditions'],expr.kind,errors)
    if(!Array.isArray(expr.conditions)||!expr.conditions.length||expr.conditions.length>32){
      errors.push('D2_GATE_EMPTY_OR_EXCESSIVE_CHILDREN');return
    }
    for(const sub of expr.conditions)expressionIssues(sub,depth+1,errors)
  }else if(expr.kind==='not'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','condition'],'not',errors)
    expressionIssues(expr.condition,depth+1,errors)
  }else if(expr.kind==='confirmed-observation'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','fieldKey','equals'],expr.kind,errors)
    if(!FIELD.test(expr.fieldKey??'')||typeof expr.equals!=='string'||!expr.equals.trim()||expr.equals.length>200){
      errors.push('D2_GATE_BAD_OBSERVATION')
    }
  }else if(expr.kind==='trusted-registry-field'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','fieldKey','equals'],expr.kind,errors)
    if(!FIELD.test(expr.fieldKey??'')||typeof expr.equals!=='string'||!expr.equals.trim()||expr.equals.length>200)
      errors.push('D2_GATE_BAD_TRUSTED_REGISTRY_FIELD')
  }else if(expr.kind==='evidence-any'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','supportsFacts'],expr.kind,errors)
    if(!Array.isArray(expr.supportsFacts)||!expr.supportsFacts.length||expr.supportsFacts.length>32||
      expr.supportsFacts.some(s=>typeof s!=='string'||!FIELD.test(s))||
      new Set(expr.supportsFacts).size!==expr.supportsFacts.length){
      errors.push('D2_GATE_BAD_EVIDENCE_ALTERNATIVES')
    }
  }else if(expr.kind==='case-stage'){
    exactKeys(expr as unknown as Record<string,unknown>,['kind','stages'],expr.kind,errors)
    if(!Array.isArray(expr.stages)||!expr.stages.length||expr.stages.some(s=>!STAGES.has(s))){
      errors.push('D2_GATE_BAD_CASE_STAGES')
    }
  }else errors.push('D2_GATE_UNKNOWN_EXPRESSION')
}
export function validateD2ExecutionGate(gate: D2ExecutionGateV1): string[]{
  const errors:string[]=[]
  if(!gate||typeof gate!=='object'||Array.isArray(gate))return ['D2_GATE_INVALID']
  exactKeys(gate as unknown as Record<string,unknown>,['when','material'],'gate',errors)
  if(!gate.when&&!gate.material)errors.push('D2_GATE_EMPTY')
  if(gate.when)expressionIssues(gate.when,0,errors)
  if(gate.material){
    const m=gate.material
    exactKeys(m as unknown as Record<string,unknown>,['provider','dueStages','alternatives'],'material',errors)
    if(m.provider!=='applicant'&&m.provider!=='authority')errors.push('D2_GATE_BAD_PROVIDER')
    if(!Array.isArray(m.dueStages)||!m.dueStages.length||m.dueStages.some(s=>!STAGES.has(s)))errors.push('D2_GATE_BAD_DUE_STAGES')
    if(!Array.isArray(m.alternatives)||!m.alternatives.length||m.alternatives.length>32||
      m.alternatives.some(x=>typeof x!=='string'||!FIELD.test(x))||
      new Set(m.alternatives).size!==m.alternatives.length)errors.push('D2_GATE_BAD_MATERIAL_ALTERNATIVES')
  }
  return errors
}
const triNot=(a:D2Tri):D2Tri=>a==='unknown'?'unknown':a==='true'?'false':'true'
const triAll=(values:D2Tri[]):D2Tri=>values.includes('false')?'false':values.every(v=>v==='true')?'true':'unknown'
const triAny=(values:D2Tri[]):D2Tri=>values.includes('true')?'true':values.every(v=>v==='false')?'false':'unknown'
function checkedEvidence(
  aggregate:CaseAggregateV2,subjectId:string|undefined,
  labels:string[],citedDocumentIds:readonly string[],
):boolean {
  if(!subjectId || !citedDocumentIds.length)return false
  return aggregate.evidenceLinks.some(link=>
    link.status==='confirmed'&&link.linkedBy==='user'&&link.subjectId===subjectId&&
    labels.includes(link.supportsFact)&&citedDocumentIds.includes(link.documentVersionId)&&
    aggregate.caseV2.documents.some(doc=>doc.versionId===link.documentVersionId&&doc.active!==false))
}
/** Only confirmed facts establish false; missing facts and source parsing do not. */
export function evaluateD2GateExpression(
  expr:D2GateExpressionV1,aggregate:CaseAggregateV2,
  subjectId:string|undefined,documentIds:readonly string[],
):D2Tri {
  if(expr.kind==='all')return triAll(expr.conditions.map(e=>evaluateD2GateExpression(e,aggregate,subjectId,documentIds)))
  if(expr.kind==='any')return triAny(expr.conditions.map(e=>evaluateD2GateExpression(e,aggregate,subjectId,documentIds)))
  if(expr.kind==='not')return triNot(evaluateD2GateExpression(expr.condition,aggregate,subjectId,documentIds))
  if(expr.kind==='case-stage')return expr.stages.includes(aggregate.caseV2.stage)?'true':'false'
  if(expr.kind==='evidence-any')return checkedEvidence(aggregate,subjectId,expr.supportsFacts,documentIds)?'true':'unknown'
  if(expr.kind==='trusted-registry-field'){
    const plan=aggregate.d2RuntimePlan
    const target=plan?.targets.find(t=>t.subjectId===subjectId&&t.kind==='student-field')
    const snapshot=plan?.trustedStudentSnapshot
    if(!target||!snapshot||snapshot.status!=='current'||snapshot.sourceKind!=='controlled-synthetic'||
      snapshot.studentId!==target.studentId||!snapshot.sourceId||!snapshot.snapshotVersionId)return 'unknown'
    const value=snapshot.fields[expr.fieldKey]
    return typeof value==='string' ? (value===expr.equals?'true':'false') : 'unknown'
  }
  // A confirmed, user-origin observation with current SourceRef on THIS target.
  // Never use self-declared caseFields, AI guesses or old/retired versions as authority.
  if(!subjectId)return 'unknown'
  const facts=aggregate.observations.filter(f=>f.subjectId===subjectId&&f.fieldKey===expr.fieldKey&&
    f.confirmed&&f.extractedBy==='user'&&f.sourceRefs?.some(ref=>
      documentIds.includes(ref.documentVersionId)&&
      aggregate.caseV2.documents.some(doc=>doc.versionId===ref.documentVersionId&&doc.active!==false)))
  if(!facts.length)return 'unknown'
  const values=new Set(facts.map(f=>f.value.kind==='text'?String(f.value.value):''))
  if(values.size!==1||values.has(''))return 'unknown'
  return values.has(expr.equals)?'true':'false'
}
export function validateD2GuardSubmission(
  aggregate:CaseAggregateV2,mapping:D2RuleBinding,
  status:CheckStatus,documentIds:readonly string[],
):string|undefined {
  if(mapping.applicability==='unknown'&&status!=='awaiting-confirmation')
    return 'D2_STUDENT_APPLICABILITY_UNKNOWN: 受控学籍条件未知，只能待核'
  if(mapping.applicability==='not-applicable')
    return ['not-applicable','awaiting-confirmation'].includes(status) ? undefined :
      'D2_STUDENT_NOT_APPLICABLE: 已核条件不触发该字段责任'
  if(mapping.applicability==='applicable'&&status==='not-applicable')
    return 'D2_STUDENT_APPLICABLE: 该字段责任已触发，不能标记不适用'

  const target=aggregate.d2RuntimePlan?.targets.find(t=>t.kind==='generic-object'&&t.objectKey===mapping.objectKey)
  if(target&&['compliant','non-compliant'].includes(status)){
    const facts=mapping.evidenceCoverage?.supportsFacts??[]
    if(!facts.length||!aggregate.evidenceLinks.some(link=>
      link.status==='confirmed'&&link.linkedBy==='user'&&link.subjectId===mapping.subjectId&&
      facts.includes(link.supportsFact)&&documentIds.includes(link.documentVersionId)&&
      aggregate.caseV2.documents.some(doc=>doc.versionId===link.documentVersionId&&doc.active!==false)))
      return 'D2_GENERIC_EVIDENCE_SCOPE_MISSING: 本对象未绑定对应事实的有效材料版本'
  }
  const gate=mapping.gate
  if(!gate)return undefined
  const issues=validateD2ExecutionGate(gate)
  if(issues.length)return 'D2_GATE_INVALID: '+issues.join('; ')
  const cond=gate.when?evaluateD2GateExpression(gate.when,aggregate,mapping.subjectId,documentIds):'true'
  if(cond==='unknown'&&status!=='awaiting-confirmation')
    return 'D2_GATE_UNKNOWN: 条件或所需可信证据不明，不能变成不适用/缺件/符合'
  if(cond==='false'&&!['not-applicable','awaiting-confirmation'].includes(status))
    return 'D2_GATE_FALSE: 已确认不触发该业务责任，不能生成符合/缺件'
  if(cond==='true'&&status==='not-applicable')
    return 'D2_GATE_TRUE: 已确认适用的业务责任不能标记不适用'
  if(cond!=='true'||!gate.material)return undefined
  const material=gate.material
  const due=material.dueStages.includes(aggregate.caseV2.stage)
  const satisfied=checkedEvidence(aggregate,mapping.subjectId,material.alternatives,documentIds)
  if(!due&&['non-compliant','awaiting-supplement'].includes(status))
    return 'D2_MATERIAL_NOT_DUE: 当前阶段尚不能索取该材料或判申请人缺件'
  if(material.provider==='authority'&&['non-compliant','awaiting-supplement'].includes(status))
    return 'D2_MATERIAL_AUTHORITY_OWNED: 有权部门待签批不得变成申请人缺件'
  // A reviewer-confirmed material link is not a signed decision by the competent
  // department. Until an authenticated authority actor workflow exists, even a
  // well-scoped document cannot turn an AI pre-review into a legal approval.
  if(material.provider==='authority'&&status==='compliant')
    return 'D2_MATERIAL_AUTHORITY_DECISION_REQUIRED: 缺少有权部门独立可信审批，不能从材料或AI结论推定已批准'
  if(status==='compliant'&&!satisfied)
    return 'D2_MATERIAL_ALTERNATIVE_UNVERIFIED: 合法材料替代需在当前对象存在审核员确认的精确证据绑定'
  if(satisfied&&['non-compliant','awaiting-supplement'].includes(status))
    return 'D2_MATERIAL_ALREADY_SUPPORTED: 有有效的替代证明，不得机械判缺件'
  return undefined
}
