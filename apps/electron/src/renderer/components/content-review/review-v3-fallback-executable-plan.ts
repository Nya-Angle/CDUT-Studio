/** 把经 Main 原件核验的未匹配 B1 初稿转换成可冻结的本地 Pi 审核计划。
 * 所有检查仍为语义/人工确认；不生成校方政策、自动通过或审批结论。
 */
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'
import type { B29UnmatchedAuthorDraft } from '../../../main/lib/review/review-v3-b3-unmatched-author-bootstrap'
import type { T01BriefDraft } from './review-v3-t01-brief-authoring'
import { makeF06Obligations } from '../../../main/lib/review/review-v3-f06-generic-contract'

export function proposedFallbackReviewMatter(proposal:T01BriefDraft,brief:string):string {
  const explicit=brief.match(/^\s*(?:申请事项|审核事项|业务名称|审核名称|模板名称)\s*[:：]\s*(\S[^\r\n]*)/m)?.[1]
  const matter=(explicit??proposal.template.name??'').trim().slice(0,240)
  return matter==='当前申请事项'?'':matter
}

export function proposedFallbackChecks(proposal:T01BriefDraft,_brief:string):string[] {
  const model=proposal.supportedBy==='authorized-model-draft'
  const statements=(model||proposal.extracted.some(item=>item.startsWith('草拟要求：'))
    ? (proposal.template.sections ?? []).flatMap(section=>section.criteria.map(item=>item.requirement.trim()))
    : [])
  const mandatory=(model||proposal.extracted.some(item=>item.startsWith('材料：'))
    ? proposal.template.materialSlots:[]).filter(item=>item.minCount>0)
    .map(item=>'核查是否实际提交「'+item.name+'」及内容是否符合申请目的；缺失或不清楚时标记待补件。')
  // 通用的事实/缺件/依据检查由固定 F06 合同提供，列表只列用户额外要求。
  // 未明确提出任何额外要求时也可开展有限初审，不能发明一套“默认校规”。
  return [...new Set([...statements,...mandatory].filter(Boolean))].slice(0,30)
}

export function executableFallbackAuthor(
  prepared:B29UnmatchedAuthorDraft,requirements:readonly string[],
  nativeDocuments:readonly {versionId:string;byteHash?:string;active?:boolean}[],
  reviewMatter:string,
  recordedBy='local-reviewer',
):B1AuthorDocument {
  if(!prepared||prepared.schemaVersion!=='review-v3-b29-unmatched-author-draft/1'||
    !prepared.document.sources.length||!prepared.sourceCandidates.length)
    throw new Error('缺少经过真实材料核验的公共兜底初稿')
  const cleaned=[...new Set(requirements.map(text=>text.trim()).filter(Boolean))]
  if(cleaned.length>30||cleaned.some(text=>text.length>2000))
    throw new Error('额外审核要求最多30条，每条不超过2000字')
  const matter=reviewMatter.trim()
  if(!matter||matter.length>240||matter==='当前申请事项')
    throw new Error('请明确本案真实申请事项（最多240字），不能使用笼统占位项')
  const initial=prepared.document
  if(initial.targets.length!==1||initial.targets[0]?.objectKey!==matter)
    throw new Error('公共兜底审核事项与 Main 原件快照不一致，请重新确认')
  const sourceVersions=new Map(prepared.sourceCandidates.map(item=>[
    item.candidateId,{
      matches:nativeDocuments.filter(doc=>doc.active!==false&&doc.byteHash===item.rawSha256),
      rawSha256:item.rawSha256,
    },
  ]))
  const sources=initial.sources.map(source=>{
    const candidateId=source.locator.startsWith('b2-candidate:')
      ?source.locator.slice('b2-candidate:'.length):''
    const matched=sourceVersions.get(candidateId)?.matches
    if(!matched||matched.length!==1)
      throw new Error('兜底来源未能与当前案卷真实原件一一对应，请先整理材料归属：'+source.sourceId)
    // B2候选 ID 只在暂存会话中有效，不能当作持久的案卷 DocumentVersion。
    // 通过原件 SHA 精确关联真正案卷版本，避免语义审核引用幽灵来源。
    return {...source,documentVersionId:matched[0]!.versionId,
      locator:'native-document:'+matched[0]!.versionId,recordedBy}
  })
  return {
    ...initial,
    templateVersion:'1',
    // 明确的本机人工确认只许可 Pi 审阅检查，不构成校方规则的事实确认。
    targets:initial.targets.map(target=>({
      ...target,fieldValues:{...target.fieldValues,human_scope_confirmed:true},
    })),
    sources,
    modules:[{
      moduleId:'f06-generic-review',version:'1',dependsOn:[],
      checks:makeF06Obligations(cleaned,initial.sources.map(source=>source.sourceId),
        initial.targets[0]!.targetKey),
    }],
    stages:[{stageId:'technical-review',role:'local-reviewer',mode:'technical'}],
    outputs:[{outputId:'technical-feedback',kind:'non-authoritative-business-candidate'}],
  }
}
