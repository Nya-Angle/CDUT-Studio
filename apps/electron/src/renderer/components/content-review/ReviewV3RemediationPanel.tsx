import * as React from 'react'
import type { CaseAggregateV2, DocumentVersion, MaterialSlotSpec } from '@profer/shared'

type Role = DocumentVersion['role']
const roles: Array<{ id: Role; label: string }> = [
  { id: 'application', label: '申报材料' }, { id: 'evidence', label: '证明材料' },
  { id: 'rule', label: '审核依据' }, { id: 'attachment', label: '其他附件' },
]

/** A recorded human proposal is never treated as an AI-approved Check or policy. */
export function ReviewV3RemediationPanel({caseId,aggregate,slots,onUpdated}:{
  caseId:string;aggregate:CaseAggregateV2;slots:MaterialSlotSpec[];
  onUpdated:()=>Promise<void>
}):React.ReactElement {
  const documents=aggregate.caseV2.documents.filter(doc=>doc.active!==false)
  const [version,setVersion]=React.useState('')
  const [role,setRole]=React.useState<Role>('attachment')
  const [slot,setSlot]=React.useState('')
  const [reason,setReason]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const [message,setMessage]=React.useState('')
  const [error,setError]=React.useState('')
  const selected=documents.find(doc=>doc.versionId===version)
  const pending=(aggregate.remediationRecords??[]).filter(item=>item.status==='proposed')
  const completed=(aggregate.remediationRecords??[]).filter(item=>item.status==='applied')
  React.useEffect(()=>{setVersion('');setRole('attachment');setSlot('');setReason('');setMessage('');setError('')},[caseId])
  const propose=async()=>{
    if(!selected||busy)return
    setBusy(true);setError('');setMessage('')
    try{
      const outcome=await window.reviewAPI.proposeNativeRemediationV3({
        caseId,requestId:'f05-propose-'+crypto.randomUUID(),
        expectedRevision:aggregate.caseV2.revision,
        documentVersionId:selected.versionId,role,reason:reason.trim(),
        ...(slot?{materialSlotId:slot}:{}),
      })
      if(!outcome.ok)throw new Error(outcome.message)
      await onUpdated()
      setMessage('纠错建议已保存到案卷，尚未修改材料或审核结论。请复核后点击执行。')
    }catch(cause){setError(cause instanceof Error?cause.message:String(cause))}
    finally{setBusy(false)}
  }
  const apply=async(proposal:NonNullable<CaseAggregateV2['remediationRecords']>[number])=>{
    if(busy)return
    const d2=proposal.planKind==='d2'
    const canonical=proposal.planKind==='canonical'
    if(!window.confirm(canonical
      ? '确认更改材料分类？旧正式计划和结果会保存为历史，本案退回草稿并需重新建立审核方案，不再沿用正式结论。'
      : d2
        ? '本次操作将撤回旧 D2 技术任务包、使旧审核与待办失效，并要求重新固定计划和重新运行。历史仍保留。确定继续？'
        : '确认纠正这份材料的类别/槽位并使旧审核运行失效？'))return
    setBusy(true);setError('');setMessage('')
    try{
      const fresh=await window.reviewAPI.getAggregateV2(caseId)
      if(!fresh)throw new Error('当前案卷已不可用')
      const outcome=await window.reviewAPI.applyNativeRemediationV3({
        caseId,requestId:'f05-apply-'+crypto.randomUUID(),
        expectedRevision:fresh.caseV2.revision,proposalId:proposal.id,
        ...(d2?{
          acknowledgedD2Fingerprint:proposal.planFingerprint,
          rebuildAcknowledgement:'我确认旧技术预审计划及审核结果失效',
        }:canonical?{
          acknowledgedCanonicalFingerprint:proposal.planFingerprint,
          rebuildAcknowledgement:'我确认旧正式审核计划及结果失效',
        }:{}),
      })
      if(!outcome.ok)throw new Error(outcome.message)
      await onUpdated()
      setMessage(canonical
        ? '纠错已保存，旧正式计划及结果归档；本案已退回未绑定草稿，请重新选审核方案开展新一轮技术初审。'
        : d2
        ? outcome.recovery?.status==='rebuilt'
          ? '纠错已保存，旧 D2 任务包进入历史，新技术方案已从原受控来源重新编译；请启动新一轮 Pi 初审。'
          : '纠错已保存，旧 D2 任务包进入历史；原方案尚不能安全恢复（'+(outcome.recovery?.reason??'需重新选择')+'），请重新安装技术方案后再运行。'
        : '纠错已持久保存，旧输入失效；请重新运行 Pi，再处理人工决定和新报告。')
    }catch(cause){setError(cause instanceof Error?cause.message:String(cause))}
    finally{setBusy(false)}
  }
  return <section aria-label="人工纠错与复审" className="space-y-3 rounded-lg border border-amber-400/40 bg-amber-500/[0.04] p-4">
    <h2 className="text-base font-semibold">人工纠错 · 计划重建 · 必要复审</h2>
    <p className="text-xs text-muted-foreground">建议先入案卷留痕，再由审核人明确执行。原件字节不变；纠错后旧 Run 和旧人工认定不能用于当前结论，T08 历史报告不覆盖。</p>
    {documents.length>0&&<div className="grid gap-2 md:grid-cols-2">
      <label className="text-xs">待纠错原件
        <select aria-label="待纠错原件" className="mt-1 w-full rounded border border-border bg-background p-2" value={version}
          onChange={e=>{const next=documents.find(doc=>doc.versionId===e.target.value);setVersion(e.target.value);setRole(next?.role??'attachment');setSlot(next?.materialSlotId??'')}}>
          <option value="">选择真实材料版本</option>
          {documents.map(doc=><option key={doc.versionId} value={doc.versionId}>{doc.fileName} · {doc.versionId.slice(-8)}</option>)}
        </select>
      </label>
      <label className="text-xs">纠正为类别
        <select aria-label="纠正为类别" className="mt-1 w-full rounded border border-border bg-background p-2" value={role} onChange={e=>{setRole(e.target.value as Role);setSlot('')}}>
          {roles.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <label className="text-xs">纠正为材料槽位
        <select aria-label="纠正为材料槽位" className="mt-1 w-full rounded border border-border bg-background p-2" value={slot} onChange={e=>setSlot(e.target.value)}>
          <option value="">不绑定槽位</option>
          {slots.filter(item=>!item.acceptedRoles?.length||item.acceptedRoles.includes(role)).map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="text-xs">纠错理由（至少 5 字）
        <textarea aria-label="纠错理由" className="mt-1 w-full rounded border border-border bg-background p-2" value={reason} maxLength={1000} onChange={e=>setReason(e.target.value)} placeholder="例如：这份扫描件实际证明申请条件，不是申请主件"/>
      </label>
    </div>}
    <button type="button" className="rounded bg-primary px-3 py-2 text-xs text-primary-foreground disabled:opacity-50" disabled={!selected||reason.trim().length<5||busy} onClick={()=>void propose()}>记录纠错建议（暂不修改）</button>
    {pending.map(item=><div key={item.id} className="rounded border border-border bg-background p-3 text-xs">
      <p>待执行 · {item.documentVersionId.slice(-12)} · {item.beforeRole} → {item.nextRole} {item.nextMaterialSlotId?'/ '+item.nextMaterialSlotId:''}</p>
      <p className="mt-1">原因：{item.reason}</p>
      <p className="mt-1 text-muted-foreground">计划：{item.planKind}{item.planFingerprint?' · '+item.planFingerprint.slice(0,12):''}</p>
      <button type="button" className="mt-2 rounded border border-primary px-3 py-1.5 disabled:opacity-50" disabled={busy} onClick={()=>void apply(item)}>确认并执行纠错</button>
      {item.planKind==='canonical'&&<p className="mt-1 text-amber-700">执行后将撤回旧正式计划；原件、旧计划和历史结论保留，但当前案卷需重新建立技术审核方案。</p>}
    </div>)}
    {completed.length>0&&<p className="text-xs text-muted-foreground">历史已执行纠错 {completed.length} 项；旧任务包与报告可查阅，但不得用于当前决定。</p>}
    {message&&<p role="status" className="text-xs">{message}</p>}
    {error&&<p role="alert" className="text-xs text-red-600">{error}</p>}
  </section>
}
