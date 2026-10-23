/**
 * Dev-B B4 R13: prevents a technical rule-ID/title coincidence from being
 * upgraded to "historical business obligations preserved". This validator
 * reads frozen D4 Check evidence only; policy, Gold and semantic parity remain
 * explicitly outside its power.
 */
import type { B4Archive, B4ArchiveTemplate } from './review-v3-b4-obligation-lineage'

export interface B4RuleAnchor {
  ruleId: string
  headingLine: number
  heading: string
  firstBodyLine: number
  firstBodyExcerpt: string
  mappedCheckIds: string[]
  candidateCheckCount: number
  sourceIds: string[]
  sourceApplicability: 'UNKNOWN_NOT_APPROVED'
  risk: 'PRIORITY_SCOPE_CONDITION_AUTHORITY' | 'NORMAL_SEMANTIC_REVIEW'
  status: 'RULE_ID_ANCHOR_ONLY_SEMANTICS_NOT_VALIDATED' | 'MISSING_TECHNICAL_RULE_ANCHOR'
  semanticValidated: false
  schoolAuthorityVerified: false
}
export interface B4RuleAnchorTemplate {
  domain:string
  templateId:string
  rawOriginalSha256:string
  originalRuleCount:number
  workspaceCheckCount:number
  ruleAnchors:B4RuleAnchor[]
  semanticAudit:'PENDING_PER_RULE_CONDITION_OBJECT_AUTHORITY'
  publicationAllowed:false
}
export interface B4RuleAnchorLedger {
  schemaVersion:'review-v3-b4-raw-rule-to-check-audit/1'
  baseSourceGitSHA:string
  evidenceMethod:string
  publicationAllowed:false
  policyApproval:'NOT_VERIFIED'
  independentGold:'NOT_AUTHORIZED_OR_NOT_RUN'
  templates:B4RuleAnchorTemplate[]
}
const fail=(why:string):never=>{throw new Error('B4_RULE_DIFF_'+why)}
export function validateB4RuleAnchorLedger(
  ledger:B4RuleAnchorLedger, archives:Readonly<Record<string,B4Archive>>,
):{templateCount:number;rawRules:number;checkAnchorEdges:number;highRiskRules:number;semanticApproved:0;publicationAllowed:false}{
  if(!ledger||ledger.schemaVersion!=='review-v3-b4-raw-rule-to-check-audit/1' ||
    ledger.baseSourceGitSHA!=='b68443b23293b4714e61a3b81383d3d3a56434fc' ||
    ledger.publicationAllowed!==false || ledger.policyApproval!=='NOT_VERIFIED' ||
    ledger.independentGold!=='NOT_AUTHORIZED_OR_NOT_RUN' ||
    !Array.isArray(ledger.templates)||ledger.templates.length!==3)fail('HEADER')
  let total=0,edges=0,highRisk=0
  const ids=new Set<string>()
  for(const item of ledger.templates){
    const archive=archives[item.domain]
    const target:B4ArchiveTemplate|undefined=archive?.templates.find(t=>t.templateId===item.templateId)
    if(!target)throw new Error('B4_RULE_DIFF_TEMPLATE')
    if(ids.has(item.templateId)||archive?.frozenSourceGitSha!==ledger.baseSourceGitSHA ||
      target.sourceSha256!==item.rawOriginalSha256 ||
      target.obligations.length!==item.workspaceCheckCount ||
      item.publicationAllowed!==false ||
      item.semanticAudit!=='PENDING_PER_RULE_CONDITION_OBJECT_AUTHORITY' ||
      !Array.isArray(item.ruleAnchors)||item.ruleAnchors.length!==item.originalRuleCount)fail('TEMPLATE')
    ids.add(item.templateId)
    const byId=new Map(target.obligations.map(x=>[x.checkId,x]))
    const rules=new Set<string>(),usedChecks=new Set<string>()
    for(const rule of item.ruleAnchors){
      const n=Number(rule.ruleId.replace(/^R-/,''))
      if(!/^R-\d{2}$/.test(rule.ruleId)||n<1||n>item.originalRuleCount ||
        rules.has(rule.ruleId) || !Number.isSafeInteger(rule.headingLine)||rule.headingLine<1 ||
        rule.firstBodyLine!==rule.headingLine+1 ||
        !rule.heading.startsWith('### '+rule.ruleId+'｜') ||
        rule.semanticValidated!==false||rule.schoolAuthorityVerified!==false||
        rule.sourceApplicability!=='UNKNOWN_NOT_APPROVED' ||
        !['NORMAL_SEMANTIC_REVIEW','PRIORITY_SCOPE_CONDITION_AUTHORITY'].includes(rule.risk)||
        rule.status!=='RULE_ID_ANCHOR_ONLY_SEMANTICS_NOT_VALIDATED'||
        !Array.isArray(rule.mappedCheckIds)||rule.mappedCheckIds.length!==rule.candidateCheckCount ||
        rule.candidateCheckCount<1)fail('RULE')
      rules.add(rule.ruleId)
      if(rule.risk==='PRIORITY_SCOPE_CONDITION_AUTHORITY')highRisk++
      const sourceIds:string[]=[]
      for(const id of rule.mappedCheckIds){
        if(usedChecks.has(id))fail('DUPLICATE_EDGE')
        const check=byId.get(id)
        if(!check)throw new Error('B4_RULE_DIFF_CHECK_RULE_MISMATCH')
        if(check.bindingState!=='WORKSPACE_BOUND' ||
          (item.domain==='G04'?check.taskId!==('r'+rule.ruleId.slice(2)):
            !check.taskTitle?.startsWith(rule.ruleId+'｜')))fail('CHECK_RULE_MISMATCH')
        usedChecks.add(id);sourceIds.push(...check.sourceIds)
        edges++
      }
      if(JSON.stringify(sourceIds)!==JSON.stringify(rule.sourceIds))fail('SOURCE_EDGE')
      total++
    }
    for(let n=1;n<=item.originalRuleCount;n++)
      if(!rules.has('R-'+String(n).padStart(2,'0')))fail('MISSING_SOURCE_RULE')
  }
  if(total!==107 || ids.size!==3)fail('COVERAGE')
  return {templateCount:ids.size,rawRules:total,checkAnchorEdges:edges,highRiskRules:highRisk,
    semanticApproved:0,publicationAllowed:false}
}
