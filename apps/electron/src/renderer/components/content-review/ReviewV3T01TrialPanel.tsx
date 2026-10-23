/**
 * T01 no-code configuration trial mounted inside the existing template editor.
 * Purely local form checks: not a Run, decision, score or real material parser.
 */
import { useMemo, useState } from 'react'
import type { TemplateVersion } from '@profer/shared'
import { trialT01Template, exampleT01TrialInput, type T01TrialValue } from './review-v3-t01-business-presets'

interface Props { template: TemplateVersion }
export function ReviewV3T01TrialPanel({ template }: Props): JSX.Element {
  const [values, setValues] = useState<Record<string,T01TrialValue>>({})
  const [counts, setCounts] = useState<Record<string,number>>({})
  const [showResults, setShowResults] = useState(false)
  const result=useMemo(()=>trialT01Template(template,values,counts),[template,values,counts])
  const caseFields=template.fields.filter(f=>f.scope==='case')
  const setField=(id:string,value:T01TrialValue):void=>{
    setValues(old=>({...old,[id]:value}));setShowResults(false)
  }
  const setMaterial=(id:string,value:number):void=>{
    setCounts(old=>({...old,[id]:value}));setShowResults(false)
  }
  return (
    <section className="mt-3 rounded-lg border border-border bg-muted/30 p-3" aria-label="模板配置试跑">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold">配置试跑：填一份模拟申请</h4>
          <p className="mt-1 text-xs text-muted-foreground">检查必填字段、数值范围、材料份数和业务阶段；不调用真实 AI、不读取证明、不产生审批结论。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded border bg-background px-3 py-1.5 text-xs" onClick={()=>{
            const demo=exampleT01TrialInput(template);setValues(demo.values);setCounts(demo.materialCounts);setShowResults(true)
          }}>载入虚构样例并检查</button>
          <button type="button" className="rounded border bg-background px-3 py-1.5 text-xs" onClick={()=>{setValues({});setCounts({});setShowResults(false)}}>清空模拟数据</button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {caseFields.map(field=><label className="text-xs" key={field.key}>
          {field.label}{field.required?' *':''}{field.kind==='number'&&field.max!==undefined?'（上限 '+field.max+'）':''}
          {field.kind==='boolean'
            ? <select className="mt-1 w-full rounded border bg-background px-2 py-1.5" value={values[field.key]===undefined?'':String(values[field.key])}
                onChange={event=>setField(field.key,event.target.value===''?undefined:event.target.value==='true')}>
                <option value="">未填写</option><option value="true">是</option><option value="false">否</option></select>
            : field.kind==='enum'
              ? <select className="mt-1 w-full rounded border bg-background px-2 py-1.5" value={String(values[field.key]??'')}
                onChange={event=>setField(field.key,event.target.value||undefined)}>
                <option value="">未填写</option>{(field.options??[]).map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select>
              : <input aria-label={'模拟'+field.label} className="mt-1 w-full rounded border bg-background px-2 py-1.5"
                type={field.kind==='number'?'number':field.kind==='date'?'date':'text'}
                min={field.kind==='number'?field.min:undefined} max={field.kind==='number'?field.max:undefined}
                value={values[field.key]===undefined?'':String(values[field.key])}
                onChange={event=>setField(field.key,event.target.value===''?undefined:field.kind==='number'?Number(event.target.value):event.target.value)} />}
        </label>)}
        {caseFields.length===0&&<p className="text-xs text-muted-foreground">此模板没有案卷级字段；配置事项级字段需要在实际案卷内完成。</p>}
      </div>
      <h5 className="mt-3 text-xs font-semibold">模拟上传材料数量</h5>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {template.materialSlots.map(slot=><label key={slot.id} className="flex items-center justify-between gap-2 rounded bg-background p-2 text-xs">
          <span>{slot.name}（至少 {slot.minCount}，最多 {slot.maxCount}）</span>
          <input type="number" min={0} step={1} value={counts[slot.id]??0} className="w-20 rounded border px-2 py-1"
            aria-label={'模拟'+slot.name+'份数'} onChange={event=>setMaterial(slot.id,Number(event.target.value))}/>
        </label>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">业务流程：{template.stages.map(stage=>stage.name).join(' → ')}{template.rubric?' · 有评分量表':' · 无评分量表'}</p>
        <button type="button" className="rounded border border-primary px-3 py-1.5 text-xs font-medium text-primary" onClick={()=>setShowResults(true)}>检查这份模拟申请</button>
      </div>
      {showResults&&<div role="status" className="mt-3 rounded border bg-background p-3 text-xs">
        <p className="font-semibold">{result.status==='incomplete'?'模拟申请尚不能进入人工审核':'模拟字段及材料形式齐备，可交人工审核'}</p>
        <p className="mt-1 text-muted-foreground">必填字段 {result.coveredFields}/{result.totalRequiredFields}；审核检查项 {result.checksForReview} 项（尚未执行）</p>
        {result.issues.length>0&&<ul className="mt-2 list-disc space-y-1 pl-5">{result.issues.map((issue,i)=><li key={i}>{issue}</li>)}</ul>}
        <p className="mt-2 text-muted-foreground">{result.note}</p>
      </div>}
    </section>
  )
}
