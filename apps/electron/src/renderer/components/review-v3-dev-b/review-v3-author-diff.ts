/**
 * Dev-B B1 author-side version comparison. This is a structural review aid,
 * not a substitute for C-owned InstallPlan/UpgradePlan and durable removal ACK.
 */
import type { B1AuthorDocument, B1Obligation } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'

export type B1AuthorChangeArea = 'business'|'source'|'field'|'target'|'module'|'check'|'stage'|'output'
export type B1AuthorChangeKind = 'added'|'removed'|'modified'
export interface B1AuthorChange {
  area:B1AuthorChangeArea
  kind:B1AuthorChangeKind
  key:string
}
export interface B1AuthorDiff {
  changes:B1AuthorChange[]
  deletedCheckKeys:string[]
  addedCheckKeys:string[]
  changedCheckKeys:string[]
  changed:boolean
}
const stable = (x:unknown):string => {
  if(x===undefined)return 'undefined'
  if(x===null || typeof x!=='object')return JSON.stringify(x)
  if(Array.isArray(x))return '['+x.map(stable).join(',')+']'
  const record=x as Record<string,unknown>
  return '{'+Object.keys(record).sort().map(key=>JSON.stringify(key)+':'+stable(record[key])).join(',')+'}'
}
const entries=<T>(items:readonly T[],key:(x:T)=>string):Map<string,T> => new Map(items.map(x=>[key(x),x]))
function compare<T>(area:B1AuthorChangeArea,left:Map<string,T>,right:Map<string,T>,out:B1AuthorChange[]):void{
  const keys=new Set([...left.keys(),...right.keys()])
  for(const key of [...keys].sort()){
    const before=left.get(key),after=right.get(key)
    if(before===undefined&&after!==undefined)out.push({area,kind:'added',key})
    else if(before!==undefined&&after===undefined)out.push({area,kind:'removed',key})
    else if(stable(before)!==stable(after))out.push({area,kind:'modified',key})
  }
}
const flattenChecks=(doc:B1AuthorDocument):Map<string,{moduleId:string;check:B1Obligation}>=>
  new Map(doc.modules.flatMap(module=>module.checks.map(check=>[
    check.checkKey,{moduleId:module.moduleId,check},
  ] as const)))
export function diffB1AuthorDocuments(saved:B1AuthorDocument|null,draft:B1AuthorDocument):B1AuthorDiff{
  const before=saved??({
    schemaVersion:'review-b1/1',status:'candidate-held',
    templateId:'',templateVersion:'',name:'',purpose:'',
    sources:[],fields:[],targets:[],modules:[],stages:[],outputs:[],
  } satisfies B1AuthorDocument)
  const changes:B1AuthorChange[]=[]
  if(before.templateId!==draft.templateId||before.templateVersion!==draft.templateVersion||
    before.name!==draft.name||before.purpose!==draft.purpose)
    changes.push({area:'business',kind:'modified',key:draft.templateId||'(new)'})
  compare('source',entries(before.sources,x=>x.sourceId),entries(draft.sources,x=>x.sourceId),changes)
  compare('field',entries(before.fields,x=>x.key),entries(draft.fields,x=>x.key),changes)
  compare('target',entries(before.targets,x=>x.targetKey),entries(draft.targets,x=>x.targetKey),changes)
  compare('module',entries(before.modules,x=>x.moduleId).size===0?new Map():
    entries(before.modules.map(x=>({moduleId:x.moduleId,version:x.version,dependsOn:x.dependsOn})),x=>x.moduleId),
    entries(draft.modules.map(x=>({moduleId:x.moduleId,version:x.version,dependsOn:x.dependsOn})),x=>x.moduleId),changes)
  compare('check',flattenChecks(before),flattenChecks(draft),changes)
  compare('stage',entries(before.stages,x=>x.stageId),entries(draft.stages,x=>x.stageId),changes)
  compare('output',entries(before.outputs,x=>x.outputId),entries(draft.outputs,x=>x.outputId),changes)
  const inArea=(kind:B1AuthorChangeKind)=>changes.filter(x=>x.area==='check'&&x.kind===kind).map(x=>x.key)
  return {changes,deletedCheckKeys:inArea('removed'),addedCheckKeys:inArea('added'),
    changedCheckKeys:inArea('modified'),changed:changes.length>0}
}
export function assertB1DraftRemovalAcknowledgments(
 saved:B1AuthorDocument|null,draft:B1AuthorDocument,confirmedKeys:readonly string[],
):void {
  const removed=diffB1AuthorDocuments(saved,draft).deletedCheckKeys
  if(removed.some(key=>!confirmedKeys.includes(key)))
    throw new Error('B1_AUTHOR_DELETE_CHECK_ACK_REQUIRED: '+removed.filter(key=>!confirmedKeys.includes(key)).join(','))
}
/** Prevent confirmation for a Check which was replaced after the prompt opened. */
export function assertB1CheckDeleteDialogCurrent(
  document:B1AuthorDocument,checkKey:string,expectedEpoch:number,currentEpoch:number,busy:boolean,
):void{
  if(busy)throw new Error('B1_AUTHOR_DELETE_BUSY')
  if(expectedEpoch!==currentEpoch)throw new Error('B1_AUTHOR_DELETE_DIALOG_STALE')
  if(!document.modules.some(m=>m.checks.some(check=>check.checkKey===checkKey)))
    throw new Error('B1_AUTHOR_DELETE_CHECK_NOT_FOUND')
}
