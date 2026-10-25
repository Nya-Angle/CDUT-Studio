/** Material-first intake. These roles are provisional until the chosen template defines its slots. */
import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'

type IntakeRole = 'application' | 'evidence' | 'rule' | 'attachment'
interface PendingPath { path:string; name:string; role:IntakeRole }
interface Props { onCreated: (caseId: string) => void }

export function ReviewV3QuickIntake({ onCreated }: Props): JSX.Element {
  const [busy, setBusy] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [applicant, setApplicant] = React.useState('')
  const [pendingPaths, setPendingPaths] = React.useState<PendingPath[]>([])
  // 建案成功但导入未完成时保留真实案卷入口：同屏可打开或继续导入，重试复用同一案卷，
  // 不再留下不可见的空草稿（UI-10）。
  const [recoveryCaseId, setRecoveryCaseId] = React.useState('')
  const [failedPaths, setFailedPaths] = React.useState<PendingPath[]>([])
  const [error, setError] = React.useState('')
  const [notice, setNotice] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const createCase = React.useCallback(async (fallbackTitle: string): Promise<string> => {
    // 这些仅是本地草稿的初始字段，不对申请主体做任何 AI 猜测或自动证据归属。
    const created = await window.reviewAPI.createCase({
      title: title.trim() || fallbackTitle,
      type: '自定义审核',
      applicant: applicant.trim() || '待核实申请人',
      academicYear: String(new Date().getFullYear()),
      reviewTemplate: null,
    })
    if (!created?.id) throw new Error('Main 未返回真实案卷 ID')
    setRecoveryCaseId(created.id)
    return created.id
  }, [applicant, title])

  const queueFiles = (files: File[]): void => {
    if (!files.length) return
    const paths: Array<{path:string;name:string}> = []
    const missing: string[] = []
    const seen = new Set<string>()
    for (const file of files) {
      try {
        const path = window.electronAPI.getPathForFile(file)
        if (!path) { missing.push(file.name); continue }
        if (seen.has(path)) continue
        seen.add(path)
        paths.push({ path, name: file.name })
      } catch { missing.push(file.name) }
    }
    if (missing.length) {
      setError('这些文件没有可读取的本机路径：' + missing.join('、') + '。为避免漏件，已取消本次选择，请改用系统文件选择器。')
      setPendingPaths([]);setNotice('')
      return
    }
    setError('')
    if (!paths.length) return
    setPendingPaths(paths.map(item => ({ ...item, role: 'attachment' })))
    setNotice('已读取 ' + paths.length + ' 份文件。导入时后台将自动分拣，识别不明时直接按原件保留，不需要逐份确认。')
  }

  const importPaths = React.useCallback(async (paths: PendingPath[]): Promise<void> => {
    if (busy || paths.length === 0) return
    setBusy(true); setError(''); setNotice('正在保存原件并建立本地案卷…')
    let caseId = ''
    try {
      caseId = recoveryCaseId || await createCase(paths[0]!.name.replace(/\.[^.]+$/, '') || '本地材料审核')
      const failures: PendingPath[] = []
      const failureText: string[] = []
      let accepted = 0
      for (const file of paths) {
        try {
          const registered = await window.reviewAPI.registerMaterialPathV2({
            caseId, sourcePath: file.path, role: file.role, fileName: file.name,
          })
          if (!registered) throw new Error('Main 未确认文件版本')
          accepted++
        } catch (cause) {
          failures.push(file)
          failureText.push(`${file.name}：${cause instanceof Error ? cause.message : String(cause)}`)
        }
      }
      if (!accepted) throw new Error(`没有成功导入的材料。${failureText.join('；')}`)
      // 已尝试的文件离开待导入队列；失败项单独保留，复用同一案卷重试（UI-11）。
      setPendingPaths([])
      setFailedPaths(failures)
      if (failures.length) {
        // 部分失败时停留在本页：逐文件失败清单与重试入口保持可见，不随跳页丢失。
        setError(`已导入 ${accepted}/${paths.length} 份，以下 ${failures.length} 份未导入，可重试：${failureText.join('；')}`)
        setNotice(`已成功导入 ${accepted} 份，案卷 ${caseId} 已保存。`)
        toast.error(`有 ${failures.length} 份材料未导入，请重试`)
        return
      }
      setNotice(`已导入 ${accepted}/${paths.length} 份原件。`)
      setFailedPaths([])
      setRecoveryCaseId('')
      onCreated(caseId)
    } catch (cause) {
      setError(`材料导入未完成${caseId ? `（案卷 ${caseId} 已保存，可在下方打开或重试）` : ''}：${cause instanceof Error ? cause.message : String(cause)}`)
      setNotice('')
    } finally { setBusy(false) }
  }, [busy, createCase, onCreated, recoveryCaseId])

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault(); event.stopPropagation()
    setDragging(false)
    queueFiles(Array.from(event.dataTransfer.files ?? []))
  }
  const pickFiles = (): void => {
    if (busy) return
    fileInputRef.current?.click()
  }

  return <section aria-label="从材料开始审核" className="mx-auto w-full max-w-3xl space-y-3 rounded-xl border border-primary/30 bg-card p-5 shadow-sm">
    <input ref={fileInputRef} type="file" multiple className="hidden" aria-label="选择审核材料"
      onChange={event => {
        queueFiles(Array.from(event.currentTarget.files ?? []))
        event.currentTarget.value = ''
      }} />
    <div>
      <h2 className="text-base font-semibold">从材料开始审核</h2>
      <p className="mt-1 text-sm text-muted-foreground">先导入真实原件，再根据事项匹配模板。模板决定本事项需要哪些材料，不会统一套用综测案卷的要求。</p>
      <p role="note" className="mt-2 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">请确认这些材料适合在当前设备和所选模型渠道中处理。导入不会因此受阻。</p>
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label className="space-y-1 text-xs">案卷名称（可留空）
        <input className="w-full rounded border bg-background px-2 py-2 text-sm" value={title}
          onChange={event => setTitle(event.target.value)} placeholder="默认取第一份文件名" />
      </label>
      <label className="space-y-1 text-xs">申请人（可稍后核实）
        <input className="w-full rounded border bg-background px-2 py-2 text-sm" value={applicant}
          onChange={event => setApplicant(event.target.value)} placeholder="不知道时标记为待核实" />
      </label>
    </div>
    <div role="button" tabIndex={0} aria-label="拖入文件开始材料审核"
      onDragEnter={event => {
        event.preventDefault(); event.stopPropagation()
        event.dataTransfer.dropEffect = 'copy'
        setDragging(true)
      }}
      onDragOver={event => {
        event.preventDefault(); event.stopPropagation()
        event.dataTransfer.dropEffect = 'copy'
        setDragging(true)
      }}
      onDragLeave={event => {
        event.preventDefault(); event.stopPropagation()
        setDragging(false)
      }}
      onDrop={onDrop} onClick={pickFiles}
      onKeyDown={event => {if (event.key==='Enter' || event.key===' ') pickFiles()}}
      className={'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-5 py-7 text-center '+
        (dragging?'border-primary bg-primary/10':'border-border hover:border-primary/60')+
        (busy?' pointer-events-none opacity-60':'')}>
      <Upload size={24} className="text-primary" />
      <p className="font-medium">{busy?'正在准备审核材料…':'把材料拖到这里，或点击选择文件'}</p>
      <p className="text-xs text-muted-foreground">支持任意数量材料。此时不用确定申请件数量，后续按匹配模板分类。</p>
    </div>
    {pendingPaths.length>0&&<div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">待导入原件 · {pendingPaths.length} 份</p>
        <button type="button" className="text-xs text-muted-foreground hover:text-foreground"
          disabled={busy} onClick={()=>{setPendingPaths([]);setNotice('');setError('')}}>清空</button>
      </div>
      <div className="max-h-56 space-y-1 overflow-y-auto">
        {pendingPaths.map((file,index)=><div key={file.path} className="flex items-center gap-2 rounded border border-border/70 px-2 py-1.5">
          <span className="min-w-0 flex-1 truncate text-xs" title={file.path}>{file.name}</span>
          <select aria-label={file.name+' 材料角色'} className="rounded border bg-background px-1.5 py-1 text-xs"
            disabled={busy} value={file.role}
            onChange={event=>setPendingPaths(current=>current.map((item,i)=>i===index
              ?{...item,role:event.target.value as IntakeRole}:item))}>
            <option value="application">可能的申报材料</option>
            <option value="evidence">可能的证明材料</option>
            <option value="rule">可能的规则依据</option>
            <option value="attachment">用途待定</option>
          </select>
          <button type="button" aria-label={'移除 '+file.name} disabled={busy}
            className="rounded p-1 text-muted-foreground hover:bg-muted" onClick={()=>setPendingPaths(current=>current.filter((_,i)=>i!==index))}>
            <X size={14}/>
          </button>
        </div>)}
      </div>
      <p className="text-xs text-muted-foreground">导入不代表材料分类已确认；用途待定的文件会先作为临时证明材料保存，匹配模板后仍可重新分类。一个事项可以有多份申报材料，是否需要申报主件由模板决定。</p>
      <Button size="sm" disabled={busy||pendingPaths.length===0}
        onClick={event=>{event.stopPropagation();void importPaths(pendingPaths)}}>
        {busy?'正在导入…':'确认材料并匹配模板'}
      </Button>
    </div>}
    {notice && <p role="status" className="text-xs text-muted-foreground">{notice}</p>}
    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    {recoveryCaseId && <div className="rounded-lg bg-amber-500/10 p-3 text-sm" role="status">
      <p>案卷已在本机保存：<code>{recoveryCaseId}</code>。材料导入尚未全部完成；可进入此案卷补传，或继续导入。重试复用同一案卷，不会再次创建空草稿。</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" disabled={busy} onClick={()=>onCreated(recoveryCaseId)}>打开已保存的案卷继续处理</Button>
        {failedPaths.length>0 && pendingPaths.length===0 && <Button size="sm" variant="outline" disabled={busy}
          onClick={()=>void importPaths(failedPaths)}>重试失败文件（{failedPaths.length}）</Button>}
      </div>
    </div>}
    <Button size="sm" variant="outline" disabled={busy} onClick={pickFiles}>
      {recoveryCaseId ? '继续导入材料' : '选择材料开始审核'}
    </Button>
  </section>
}
