/**
 * B1 untrusted candidate import for a no-code author's explicit preview.
 * Only accepts our candidate-only export envelope. Never treats a JSON file,
 * its recordedBy, source IDs, Subject or policy-candidate as Main authority.
 * Valid structural declarations may still be incomplete drafts: C/Main must
 * revalidate identity/CAS and compiler rules on save/preview/freeze.
 */
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'

export const B1_AUTHOR_IMPORT_MAX_BYTES=2*1024*1024
const id=/^[A-Za-z][A-Za-z0-9._:/-]{0,127}$/
const safe=(v:unknown):v is string=>typeof v==='string'&&v.length<=16384
const nonempty=(v:unknown):v is string=>safe(v)&&v.trim().length>0
const rec=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)
const fail=(name:string):never=>{throw new Error('B1_IMPORT_'+name)}
const only=(v:Record<string,unknown>, allowed:readonly string[]):boolean=>
  Object.keys(v).every(k=>allowed.includes(k))
const array=(v:unknown,limit:number):v is unknown[]=>Array.isArray(v)&&v.length<=limit
const strings=(v:unknown,limit:number):v is string[]=>
  array(v,limit)&&v.every(x=>nonempty(x))
const unique=(items:string[]):boolean=>new Set(items).size===items.length
const validKey=(v:unknown):v is string=>nonempty(v)&&id.test(v)
/** Prevent nesting/JSON poison keys even in not-yet-recognized parts. */
function guardTree(x:unknown,depth=0,seen={nodes:0}):void {
  if(depth>24 || ++seen.nodes>18000)fail('COMPLEXITY')
  if(typeof x==='string'){if(!safe(x))fail('STRING_TOO_LARGE');return}
  if(typeof x==='number'){if(!Number.isFinite(x))fail('NUMBER_INVALID');return}
  if(x===null||typeof x==='boolean')return
  if(Array.isArray(x)){
    if(x.length>2000)fail('ARRAY_TOO_LARGE')
    for(const v of x)guardTree(v,depth+1,seen)
    return
  }
  if(!rec(x))throw new Error('B1_IMPORT_JSON_VALUE')
  for(const k of Object.keys(x)){
    if(['__proto__','prototype','constructor'].includes(k))fail('PROTOTYPE_KEY')
    guardTree(x[k],depth+1,seen)
  }
}
function validateCandidate(d:Record<string,unknown>):void {
  if(!only(d,['schemaVersion','status','templateId','templateVersion','name','purpose','sources','fields','targets','modules','stages','outputs'])||
    d.schemaVersion!=='review-b1/1'||d.status!=='candidate-held'||
    !validKey(d.templateId)||d.templateId.length>80||
    !nonempty(d.templateVersion)||!nonempty(d.name)||!nonempty(d.purpose)||
    !array(d.sources,128)||!array(d.fields,256)||!array(d.targets,256)||
    !array(d.modules,64)||!array(d.stages,128)||!array(d.outputs,128))fail('AUTHOR_STRUCTURE')
  // Each array was structurally checked before narrowing untrusted JSON.
  const sources=d.sources as unknown[]
  if(!sources.every(x=>rec(x)&&only(x,['sourceId','kind','documentVersionId','locator','recordedBy'])&&
    validKey(x.sourceId)&&['user-declared','policy-candidate'].includes(String(x.kind))&&
    nonempty(x.documentVersionId)&&nonempty(x.locator)&&nonempty(x.recordedBy)))fail('SOURCE_STRUCTURE')
  const fields=d.fields as unknown[]
  if(!fields.every(x=>rec(x)&&only(x,['key','label','type','required','enumValues','sourceId','subjectScoped'])&&
    validKey(x.key)&&nonempty(x.label)&&validKey(x.sourceId)&&
    ['text','number','date','boolean','enum','evidence'].includes(String(x.type))&&
    typeof x.required==='boolean'&&(x.subjectScoped===undefined||typeof x.subjectScoped==='boolean')&&
    (x.enumValues===undefined||strings(x.enumValues,128))))fail('FIELD_STRUCTURE')
  const targets=d.targets as unknown[]
  if(!targets.every(x=>rec(x)&&only(x,['targetKey','objectKey','subjectId','scenario','fieldValues'])&&
    validKey(x.targetKey)&&nonempty(x.objectKey)&&validKey(x.subjectId)&&nonempty(x.scenario)&&
    rec(x.fieldValues)&&Object.entries(x.fieldValues).every(([k,v])=>
      validKey(k)&&(v===null||typeof v==='string'||typeof v==='boolean'||
        (typeof v==='number'&&Number.isFinite(v))))))fail('TARGET_STRUCTURE')
  const modules=d.modules as unknown[]
  if(!modules.every(x=>rec(x)&&only(x,['moduleId','version','dependsOn','checks'])&&
    validKey(x.moduleId)&&nonempty(x.version)&&strings(x.dependsOn,64)&&
    array(x.checks,600)&&x.checks.every(c=>rec(c)&&
      only(c,['checkKey','requirement','sourceIds','targetKeys','condition','responsibility'])&&
      validKey(c.checkKey)&&nonempty(c.requirement)&&nonempty(c.responsibility)&&
      strings(c.sourceIds,128)&&strings(c.targetKeys,256)&&rec(c.condition)&&
      (c.condition.kind==='always' ? only(c.condition,['kind']) :
        c.condition.kind==='field-equals'&&only(c.condition,['kind','fieldKey','equals'])&&
        validKey(c.condition.fieldKey)&&['string','number','boolean'].includes(typeof c.condition.equals)))))fail('MODULE_CHECK_STRUCTURE')
  if(!(d.stages as unknown[]).every(x=>rec(x)&&only(x,['stageId','role','mode'])&&
    validKey(x.stageId)&&nonempty(x.role)&&['manual','technical'].includes(String(x.mode))))fail('STAGE_STRUCTURE')
  if(!(d.outputs as unknown[]).every(x=>rec(x)&&only(x,['outputId','kind'])&&
    validKey(x.outputId)&&nonempty(x.kind)))fail('OUTPUT_STRUCTURE')
  if(!unique(sources.map(x=>(x as {sourceId:string}).sourceId))||
    !unique(fields.map(x=>(x as {key:string}).key))||
    !unique(targets.map(x=>(x as {targetKey:string}).targetKey))||
    !unique(modules.map(x=>(x as {moduleId:string}).moduleId))||
    !unique((d.stages as unknown[]).map(x=>(x as {stageId:string}).stageId))||
    !unique((d.outputs as unknown[]).map(x=>(x as {outputId:string}).outputId))||
    !unique(modules.flatMap(x=>(x as {checks:{checkKey:string}[]}).checks.map(c=>c.checkKey))))fail('DUPLICATE_ID')
}
/** No Main receipt, no policy publisher and no trial values can be imported. */
export function parseB1AuthorCandidateImport(json:string):B1AuthorDocument {
  if(typeof json!=='string'||new TextEncoder().encode(json).byteLength>B1_AUTHOR_IMPORT_MAX_BYTES)
    fail('FILE_TOO_LARGE')
  let value:unknown
  try{value=JSON.parse(json)}catch{fail('INVALID_JSON')}
  guardTree(value)
  if(!rec(value))throw new Error('B1_IMPORT_UNTRUSTED_ENVELOPE')
  if(!only(value,['format','trustTier','publicationAllowed','candidate'])||
    value.format!=='review-b1-candidate-export/1'||
    value.trustTier!=='unverified-user-authoring'||value.publicationAllowed!==false||
    !rec(value.candidate))fail('UNTRUSTED_ENVELOPE')
  const candidate=value.candidate
  if(!rec(candidate))throw new Error('B1_IMPORT_UNTRUSTED_ENVELOPE')
  validateCandidate(candidate)
  const result=structuredClone(candidate) as unknown as B1AuthorDocument
  // Deliberately drop claims of the previous machine/user as author identity.
  for(const source of result.sources)source.recordedBy='imported-local-unverified'
  return result
}
/** Refuse to overwrite a newly edited screen with an old asynchronous import. */
export function assertB1ImportReplaceSafe(
  pendingEpoch:number,currentEpoch:number,inFlight:boolean,
):void {
  if(inFlight)fail('OPERATION_BUSY')
  if(pendingEpoch!==currentEpoch)fail('STALE_SCREEN')
}
