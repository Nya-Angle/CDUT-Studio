import { useState } from 'react'
import type { TemplateVersion } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import JSZip from 'jszip'
import { toast } from 'sonner'
import { draftT01FromBrief, type T01BriefDraft } from './review-v3-t01-brief-authoring'
import { exampleT01PackFiles, T01_STANDARD_EXAMPLES, type T01StandardScenario } from './review-v3-t01-example-packs'
import { T01_SCENARIOS } from './review-v3-t01-business-presets'
import {draftT01ViaAuthorizedModel,type T01ModelDraftInvoke} from './review-v3-t01-model-draft-port'

interface Props { onDraft:(draft:TemplateVersion)=>void; modelDraftInvoke?:T01ModelDraftInvoke }
/**
 * Accessible in the existing TemplateWizardPanel. Nothing is published or
 * installed by natural-language input or downloading example material files.
 */
export function ReviewV3T01AuthoringLaunchpad({onDraft,modelDraftInvoke}:Props):JSX.Element {
  const [brief,setBrief]=useState('')
  const [proposal,setProposal]=useState<T01BriefDraft|null>(null)
  const [example,setExample]=useState<T01StandardScenario>('student')
  const [busy,setBusy]=useState(false)
  const [modelBusy,setModelBusy]=useState(false)
  const analyze=():void=>{
    try {
      const draft=draftT01FromBrief(brief,'t01-brief-'+Date.now().toString(36),
        new Date().toISOString())
      setProposal(draft)
    } catch(error) {
      setProposal(null)
      toast.error('需求无法起草：'+(error instanceof Error?error.message:String(error)))
    }
  }
  const modelDraft=async():Promise<void>=>{
    if(!modelDraftInvoke||!brief.trim())return
    setModelBusy(true)
    try{
      setProposal(await draftT01ViaAuthorizedModel(brief,'t01-model-'+Date.now().toString(36),
        new Date().toISOString(),modelDraftInvoke))
    }catch(error){
      setProposal(null)
      toast.error('模型起草失败：'+(error instanceof Error?error.message:String(error)))
    }finally{setModelBusy(false)}
  }
  const download=async():Promise<void>=>{
    setBusy(true)
    try{
      const zip=new JSZip()
      for(const file of exampleT01PackFiles(example))zip.file(file.path,file.content)
      const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'})
      const url=URL.createObjectURL(blob)
      const link=document.createElement('a')
      link.href=url;link.download='t01-'+example+'-acceptance.zip';link.click()
      setTimeout(()=>URL.revokeObjectURL(url),1000)
    }catch(error){toast.error('示例材料导出失败：'+(error instanceof Error?error.message:String(error)))}
    finally{setBusy(false)}
  }
  return (
    <section className="mt-3 grid gap-3 rounded-lg border bg-muted/20 p-3 lg:grid-cols-2" aria-label="从需求起草与业务验收材料">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">从自然语言起草模板</h3>
        <p className="text-xs text-muted-foreground">支持从明确写出的对象、字段、必交材料、人数/金额上下限及流程生成可编辑草稿。明确的数值审核门槛会成为待确认规则，不会变成阻止违规值录入的表单限制；含糊制度不会被猜成确定性规则。</p>
        <textarea aria-label="模板需求自然语言" className="min-h-28 w-full rounded border bg-background p-2 text-xs"
          placeholder={'模板名称：实验室申请\n审核对象：组织\n字段：组织名称、负责人、参加人数（1-20人）、使用日期、用途\n必交材料：实验计划书\n流程：自动核对→初审→终审\n规则：人数不得超过20'}
          value={brief} onChange={event=>{setBrief(event.target.value);setProposal(null)}}/>
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={analyze} disabled={!brief.trim()}>提取明确要求</Button>{modelDraftInvoke&&<Button size="sm" disabled={!brief.trim()||modelBusy} onClick={()=>void modelDraft()}>{modelBusy?'模型起草中…':'使用已授权模型起草'}</Button>}</div>
        {proposal && <div className="space-y-2 rounded border bg-background p-2 text-xs" role="status">
          <p className="font-medium">草稿：{proposal.template.name} · {proposal.template.fields.length} 字段 · {proposal.template.materialSlots.length} 材料槽</p>
          <ul className="list-disc space-y-1 pl-4">{proposal.extracted.map((text,i)=><li key={i}>{text}</li>)}</ul>
          <p className="font-medium">发布前需确认：</p>
          <ul className="list-disc space-y-1 pl-4 text-amber-700 dark:text-amber-300">{proposal.questions.map((text,i)=><li key={i}>{text}</li>)}</ul>
          <Button size="sm" onClick={()=>onDraft(proposal.template)}>送入模板编辑器</Button>
        </div>}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">六类真实文件验收案例包</h3>
        <p className="text-xs text-muted-foreground">各包含虚构政策、可上传的 UTF-8 原件（正常/违规/缺材料三案）、模板草稿与预期矩阵。可交给真实材料解析、规则与人工流程联测，但下载成功不等于审核成功。</p>
        <div className="flex flex-wrap gap-2">
          <select aria-label="选择验收材料业务" className="rounded border bg-background px-2 py-1.5 text-xs" value={example}
            onChange={event=>setExample(event.target.value as T01StandardScenario)}>
            {T01_STANDARD_EXAMPLES.map(id=><option key={id} value={id}>{T01_SCENARIOS.find(s=>s.id===id)?.label??id}</option>)}
          </select>
          <Button size="sm" variant="outline" disabled={busy} onClick={()=>void download()}>{busy?'导出中…':'下载 ZIP 材料包'}</Button>
        </div>
        <p className="text-xs text-muted-foreground">ZIP 内三个案卷的原件分目录保留，包含材料槽标识和预期差异；学生身份、制度、审批均明确为模拟。</p>
      </div>
    </section>
  )
}
