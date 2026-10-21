/** T01 form editor for a simple declarative condition; no user code or JSON. */
import type { ConditionAST, FieldSpec } from '@profer/shared'

interface Props {
  value?: ConditionAST
  fields: FieldSpec[]
  onChange: (value: ConditionAST | undefined) => void
  label: string
}

export function ReviewV3T01ConditionEditor({ value, fields, onChange, label }: Props): JSX.Element {
  const simple=value&&'field' in value&&value.op==='eq'?value:undefined
  const options=fields.filter(field=>['text','number','date','boolean','enum'].includes(field.kind))
  const selected=options.find(f=>f.key===simple?.field)
  const update=(key:string,raw:string):void=>{
    const next=options.find(field=>field.key===key)
    if(!next) {onChange(undefined);return}
    let parsed: string|number|boolean=raw
    if(next.kind==='number') parsed=raw===''?0:Number(raw)
    if(next.kind==='boolean') parsed=raw==='true'
    onChange({field:key,op:'eq',value:parsed})
  }
  const raw=String(simple?.value??'')
  return <div className="flex flex-wrap items-center gap-2 text-xs">
    <label className="font-medium">{label}
      <select className="ml-2 rounded border bg-background px-2 py-1" value={simple?.field??''} onChange={e=>update(e.target.value,'')}>
        <option value="">始终按基础配置处理</option>
        {options.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}
      </select>
    </label>
    {selected&&(selected.kind==='boolean'||selected.kind==='enum'
      ? <select aria-label={label+'条件值'} className="rounded border bg-background px-2 py-1" value={raw} onChange={e=>update(selected.key,e.target.value)}>
          {selected.kind==='boolean'
            ? <><option value="true">是</option><option value="false">否</option></>
            : (selected.options??[]).map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      : <input aria-label={label+'条件值'} className="w-36 rounded border bg-background px-2 py-1"
          type={selected.kind==='number'?'number':selected.kind==='date'?'date':'text'}
          value={raw} placeholder="等于…" onChange={e=>update(selected.key,e.target.value)} />)}
    {value&&!simple&&<span className="text-muted-foreground">复杂条件已保留；在高级规则编排中修改</span>}
    {simple&&<span className="text-muted-foreground">当该字段等于指定值时适用；未填条件字段将等待确认</span>}
  </div>
}
