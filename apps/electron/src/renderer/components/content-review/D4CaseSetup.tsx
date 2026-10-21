import * as React from 'react'
import type { D4ClientSelection, D4ClientTemplate, D2TargetBinding } from '@profer/shared'

/** 受控候选的场景输入；只改变案卷选择，不改写冻结作者态。 */
export function D4CaseSetup({ onChange, suggestedTemplateId }: {
  onChange: (value: D4ClientSelection | undefined) => void
  suggestedTemplateId?:string
}): React.ReactElement {
  const [templates, setTemplates] = React.useState<D4ClientTemplate[]>([])
  const [templateId, setTemplateId] = React.useState('')
  const [draft, setDraft] = React.useState('')
  const [confirmed, setConfirmed] = React.useState(false)
  const [studentFixture, setStudentFixture] = React.useState(false)
  const [error, setError] = React.useState('')
  const template = templates.find(t => t.templateId === templateId)
  let selection: D4ClientSelection['selection'] | undefined
  try {
    const parsed = draft ? JSON.parse(draft) : undefined
    if (parsed && Array.isArray(parsed.targets) && parsed.targets.every((t: D2TargetBinding) => t && typeof t.title === 'string' && (!t.conditions || (Array.isArray(t.conditions) && t.conditions.every(c => c && typeof c.id === 'string' && typeof c.applicability === 'string'))))) selection = parsed
  } catch { /* 编辑时允许暂时不完整，禁止提交。 */ }

  React.useEffect(() => {
    let active = true
    void window.reviewAPI.listD4Templates().then(items => { if (active) setTemplates(items) })
      .catch(e => { if (active) setError(String(e)) })
    return () => { active = false }
  }, [])
  React.useEffect(()=>{
    if(!suggestedTemplateId||!templates.length)return
    const suggested=templates.find(t=>t.templateId===suggestedTemplateId)
    // 缺件的候选不可自动带入：如实保留为不可用，不伪造空选择。
    if(!suggested||suggested.selectionIssue)return
    setTemplateId(suggested.templateId)
    setDraft(JSON.stringify(suggested.selection,null,2))
    setConfirmed(false);setStudentFixture(false);setError('')
  },[suggestedTemplateId,templates])
  React.useEffect(() => {
    let value: D4ClientSelection | undefined
    try {
      const selected = JSON.parse(draft)
      if (confirmed && template && !template.selectionIssue && selected.templateId === template.templateId && selected.version === template.version && Array.isArray(selected.targets)) {
        value = { selection: selected, useControlledStudentFixture: studentFixture }
      }
    } catch { /* 非法 JSON 由提交状态直接提示。 */ }
    onChange(value)
  }, [draft, confirmed, studentFixture, template, onChange])

  const updateTarget = (index: number, patch: Partial<D2TargetBinding>): void => {
    if (!selection) return
    setDraft(JSON.stringify({ ...selection, targets: selection.targets.map((target, i) => i === index ? { ...target, ...patch } : target) }, null, 2))
    setConfirmed(false)
  }
  const addObject=():void=>{
    if(!selection)return
    const first=selection.targets.find(t=>t.kind==='generic-object')
    if(!first){setError('请先在完整场景 JSON 中定义一个业务对象及其来源');return}
    let n=selection.targets.length+1, objectKey='',subjectId=''
    do{objectKey=first.objectKey+'-new-'+n;subjectId=first.subjectId+'-new-'+n;n++}
    while(selection.targets.some(t=>t.objectKey===objectKey||t.subjectId===subjectId))
    const next:D2TargetBinding={...structuredClone(first),objectKey,subjectId,title:'待填写对象 '+(n-1)}
    setDraft(JSON.stringify({...selection,targets:[...selection.targets,next]},null,2))
    setConfirmed(false);setError('')
  }
  const removeObject=(index:number):void=>{
    if(!selection)return
    setDraft(JSON.stringify({...selection,targets:selection.targets.filter((_,i)=>i!==index)},null,2))
    setConfirmed(false)
  }
  return <div className="space-y-3 rounded-lg bg-muted/40 p-3 text-sm" data-testid="d4-case-setup">
    <p className="text-amber-700 dark:text-amber-300">选择方案并核对对象与场景后再开始审核。条件改变后请新建案卷。</p>
    <label className="block">D4 模板
      <select aria-label="审核方案模板" className="mt-1 h-9 w-full rounded-md border bg-background px-2" value={templateId} onChange={e => {
        const next = templates.find(t => t.templateId === e.target.value)
        setTemplateId(e.target.value); setDraft(next ? JSON.stringify(next.selection, null, 2) : ''); setConfirmed(false); setStudentFixture(false)
      }}>
        <option value="">选择受控 D4 候选（{templates.filter(t=>!t.selectionIssue).length}/{templates.length} 可用）…</option>
        {templates.map(t => <option key={t.templateId} value={t.templateId} disabled={!!t.selectionIssue}>
          {t.domain} · {t.templateId} · {t.name}{t.selectionIssue ? ' · 不可用（' + t.selectionIssue + '）' : ''}
        </option>)}
      </select>
    </label>
    {selection?.targets?.map((target, index) => <fieldset key={index} className="space-y-2 rounded-lg bg-background p-2">
      <legend className="px-1">对象 {index + 1} · {target.subjectId}</legend>
      <div className="flex items-center gap-2">
        <input aria-label={`对象 ${index+1} 名称`} className="min-w-0 flex-1 rounded border bg-background p-1.5" value={target.title} onChange={e=>updateTarget(index,{title:e.target.value})}/>
        <button type="button" className="rounded border px-2 py-1 text-xs" onClick={()=>removeObject(index)}>移除此对象</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">业务对象 ID<input aria-label={`对象 ${index+1} 标识`} className="mt-1 w-full rounded border bg-background p-1.5" value={target.objectKey} onChange={e=>updateTarget(index,{objectKey:e.target.value})}/></label>
        <label className="text-xs">审核主体 ID<input aria-label={`对象 ${index+1} 主体标识`} className="mt-1 w-full rounded border bg-background p-1.5" value={target.subjectId} onChange={e=>updateTarget(index,{subjectId:e.target.value})}/></label>
      </div>
      {target.kind === 'generic-object' && template && <>
        {template.primary.length > 0 && <label className="block">主场景（互斥）
          <select aria-label={`对象 ${index + 1} 主场景`} className="ml-2 rounded border bg-background p-1" value={target.scenario} onChange={e => updateTarget(index, { scenario: e.target.value })}>
            {template.primary.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </label>}
        <div className="grid grid-cols-2 gap-2">{target.conditions?.map((condition, ci) => <label key={condition.id}>{condition.id}
          <select aria-label={`对象 ${index + 1} 条件 ${condition.id}`} className="ml-1 rounded border bg-background p-1" value={condition.applicability} onChange={e => {
            const applicability = e.target.value as typeof condition.applicability
            updateTarget(index, { conditions: target.conditions!.map((c, i) => i === ci ? { ...c, applicability, decidedBy: applicability === 'unknown' ? 'undetermined' : 'reviewer' } : c) })
          }}>
            <option value="unknown">未知 · 待核</option><option value="applicable">适用</option><option value="not-applicable">不适用</option>
          </select>
        </label>)}</div>
      </>}
    </fieldset>)}
    {template && <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={addObject}>新增同类型审核对象</button>
      <span className="text-xs text-muted-foreground">当前 {selection?.targets.length??0} 个对象，各自独立编译检查任务</span>
    </div>}
    {template && <details><summary className="cursor-pointer">完整场景、对象类型与来源标识 JSON（高级编辑）</summary>
      <textarea aria-label="D4 场景 JSON" className="mt-2 h-48 w-full rounded border bg-background p-2 font-mono text-xs" value={draft} onChange={e => { setDraft(e.target.value); setConfirmed(false) }} />
    </details>}
    {template?.controlledStudentFixture && <label className="flex gap-2"><input type="checkbox" checked={studentFixture} onChange={e => { setStudentFixture(e.target.checked); setConfirmed(false) }} />使用随包提供的学籍快照（姓名与证件号分别校验）</label>}
    {template && <label className="flex gap-2"><input aria-label="确认 D4 对象和条件" type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />我已核对对象、场景、条件及其来源版本，按以上选择创建固定任务。</label>}
    {draft && !selection && <p role="alert" className="text-destructive">场景 JSON 格式不正确</p>}
    {template?.selectionIssue && <p role="alert" className="text-destructive">该候选缺少冻结选择文件，不能用于建案：{template.selectionIssue}</p>}
    {error && <p role="alert" className="text-destructive">{error}</p>}
  </div>
}
