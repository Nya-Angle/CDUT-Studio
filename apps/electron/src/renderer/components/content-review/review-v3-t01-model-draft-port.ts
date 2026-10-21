/**
 * T01 typed model-authoring port: template semantics belong to T01;
 * model invocation/credentials and Main IPC belong to Local-L.
 */
import type {TemplateVersion} from '@profer/shared'
import {draftT01FromBrief,type T01BriefDraft} from './review-v3-t01-brief-authoring'
import {importT01Template} from './review-v3-t01-template-portability'

export type T01ModelDraftInvoke=(prompt:{system:string;user:string})=>Promise<string>
const safeArray=(value:unknown):string[]=>Array.isArray(value)?
  value.filter((x):x is string=>typeof x==='string'&&x.trim().length>0).slice(0,30):[]

export function makeT01ModelDraftPrompt(brief:string):{system:string;user:string}{
  if(!brief.trim())throw Error('T01_BRIEF_REQUIRED')
  const seed=draftT01FromBrief(brief,'t01-model-proposal','2026-10-21T00:00:00.000Z')
  return {
    system:[
      '你为本地通用审核软件起草 TemplateVersion v2 模板配置。',
      '只从用户要求提取字段、材料、流程、评分与适用条件；不创造正式制度/来源。',
      '阈值、日期、角色权限、优先级或依据不明时放入 questions，不准猜测。',
      '不要输出 Case、ReviewRun、已批准决定、凭据或模型渠道信息。',
      '返回严格 JSON 对象，键为 template、extracted、questions。',
      'template 必须沿用起点的全部必需结构，schemaVersion=2、status=draft。',
      '字段类型限 text/number/date/boolean/enum，流程节点用已有 WorkflowStageSpec。',
      'policyVersionIds=[]，不得生成可发布的正式政策引用。',
      '没有确认的结构化计算不允许伪装为 deterministic。',
      '严禁输出 Markdown 围栏或额外解释。',
    ].join('\n'),
    user:'用户原始要求：\n'+brief+'\n\n合法的可编辑模板起点：\n'+JSON.stringify(seed.template)+
      '\n\n现有待确认问题：\n'+seed.questions.join('\n'),
  }
}
export function parseT01ModelDraftResponse(raw:string,templateId:string,createdAt:string):T01BriefDraft{
  const cleaned=raw.trim().replace(/^\x60{3}(?:json)?\s*/i,'').replace(/\s*\x60{3}$/,'')
  let payload:unknown
  try{payload=JSON.parse(cleaned)}catch{throw Error('T01_MODEL_JSON_INVALID')}
  if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('T01_MODEL_OBJECT_REQUIRED')
  const data=payload as Record<string,unknown>
  if(!data.template||typeof data.template!=='object'||Array.isArray(data.template))throw Error('T01_MODEL_TEMPLATE_REQUIRED')
  const imported=importT01Template(JSON.stringify({format:'review-t01-template/1',template:data.template}),templateId,createdAt)
  const template:TemplateVersion={
    ...imported,policyVersionIds:[],policyRefs:undefined,publishedAt:undefined,
    catalogKind:'custom',status:'draft',
    sourceNote:'模型生成的未确认模板草案；全部制度、字段和权限必须由负责人确认后才可发布。',
  }
  return {template,extracted:safeArray(data.extracted),
    questions:[...new Set([...safeArray(data.questions),'请核实政策原文、版本、阈值、角色权限与适用范围。'])],
    supportedBy:'authorized-model-draft'}
}
export async function draftT01ViaAuthorizedModel(
  brief:string,templateId:string,createdAt:string,invoke:T01ModelDraftInvoke,
):Promise<T01BriefDraft>{
  return parseT01ModelDraftResponse(await invoke(makeT01ModelDraftPrompt(brief)),templateId,createdAt)
}
