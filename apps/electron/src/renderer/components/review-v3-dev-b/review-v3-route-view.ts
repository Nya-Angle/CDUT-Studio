/** B3 renderer presentation only. Selections are technical proposals, never Case writes. */
import type {
  B3RouteState, B3ManualCatalogEntry,
} from '../../../main/lib/review/review-intake-routing-adapter-v3-b3'

export interface B3RouteView {
  heading: string
  guidance: string
  remainingSeconds: number
  eligible: B3ManualCatalogEntry[]
  held: B3ManualCatalogEntry[]
  suggested: B3ManualCatalogEntry | null
  canInterrupt: boolean
  /** No Renderer result can be promoted to formal Case creation. */
  authority: 'technical-candidate-only'
}
export function buildB3RouteView(
  state:B3RouteState,
  catalog:readonly B3ManualCatalogEntry[],
):B3RouteView {
  if(!state || !Array.isArray(catalog))throw new Error('B3_VIEW_INPUT_INVALID')
  const seen=new Set<string>()
  const eligible:B3ManualCatalogEntry[]=[]
  const held:B3ManualCatalogEntry[]=[]
  for(const item of catalog){
    if(!item || !item.templateId?.trim() || !item.templateVersion?.trim() ||
       !item.name?.trim())continue
    const key=JSON.stringify([item.templateId,item.templateVersion])
    if(seen.has(key))continue
    seen.add(key)
    if(item.availability==='authorized-for-technical-selection')eligible.push(item)
    else if(item.availability==='candidate-held')held.push(item)
  }
  const suggested=state.chosen
    ? eligible.find(item=>item.templateId===state.chosen?.templateId &&
      item.templateVersion===state.chosen?.templateVersion)??null
    : null
  const messages:Record<B3RouteState['status'],[string,string]>={
    'awaiting-evidence':['等待材料与审核主体','缺少足够且同案的真实材料，不能自动选择模板。'],
    'unmatched':['现有模板未匹配','当前材料未找到可验证的模板匹配。不会在倒计时后随意选取；请人工确认业务类别，或自建候选审核流程。'],
    'countdown':['确认材料类型','仅有一项满足技术条件的候选。倒计时结束前随时可以停止或手动选择。'],
    'needs-user-confirmation':['需要你确认审核业务','材料角色、来源、适用范围或模板资格尚不明确；不会自行建案。'],
    'manually-selected':['人工选择已记录为技术候选','最终使用前必须由 Main 重新校验模板权限和当前材料。'],
    'default-selected':['倒计时结束：技术候选已选定','这不是正式建案或政策批准；下一步仍需可信 Main 执行业务验证。'],
  }
  return {
    heading:messages[state.status][0], guidance:messages[state.status][1],
    remainingSeconds:Math.max(0,Math.ceil(state.remainingMs/1000)),
    eligible,held,suggested,
    canInterrupt:state.status==='countdown',
    authority:'technical-candidate-only',
  }
}
/** Text search never converts a held template into a selectable one. */
export function filterB3Catalog(
 options:readonly B3ManualCatalogEntry[],query:string,
):B3ManualCatalogEntry[]{
 const needle=query.trim().toLocaleLowerCase()
 return !needle?[...options]:options.filter(item=>
  [item.name,item.templateId,item.templateVersion].some(value=>
   value.toLocaleLowerCase().includes(needle)))
}
export function requireB3VisibleManualChoice(
  catalog:readonly B3ManualCatalogEntry[],
  templateId:string,templateVersion:string,
):{templateId:string;templateVersion:string} {
  const view=buildB3RouteView({status:'needs-user-confirmation',remainingMs:0,reason:''},catalog)
  if(!view.eligible.some(x=>x.templateId===templateId && x.templateVersion===templateVersion))
    throw new Error('B3_VIEW_TEMPLATE_NOT_TECHNICALLY_AVAILABLE')
  return {templateId,templateVersion}
}
