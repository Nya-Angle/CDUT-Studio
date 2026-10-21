/** 材料优先：先建立同一原生案卷，再交给现有 Main 路由与审核操作。 */
import * as React from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'

interface Props { onCreated: (caseId: string) => void }

export function ReviewV3QuickIntake({ onCreated }: Props): JSX.Element {
  const [busy, setBusy] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [applicant, setApplicant] = React.useState('')
  const [error, setError] = React.useState('')
  const [notice, setNotice] = React.useState('')

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
    return created.id
  }, [applicant, title])

  const startWithPaths = React.useCallback(async (paths: Array<{path: string;name: string}>): Promise<void> => {
    if (busy || paths.length === 0) return
    setBusy(true); setError(''); setNotice('正在保存材料到本机案卷…')
    let caseId = ''
    try {
      caseId = await createCase(paths[0]!.name.replace(/\.[^.]+$/, '') || '本地材料审核')
      const failures: string[] = []
      let accepted = 0
      for (const file of paths) {
        try {
          const registered = await window.reviewAPI.registerMaterialPathV2({
            caseId, sourcePath: file.path, role: 'application', fileName: file.name,
          })
          if (!registered) throw new Error('Main 未确认文件版本')
          accepted++
        } catch (cause) {
          failures.push(`${file.name}：${cause instanceof Error ? cause.message : String(cause)}`)
        }
      }
      if (!accepted) throw new Error(`没有成功导入的材料。${failures.join('；')}`)
      setNotice(`已导入 ${accepted}/${paths.length} 份材料，开始根据原件匹配审核模板。`)
      if (failures.length) {
        setError(`部分材料未导入，需要补充：${failures.join('；')}`)
        toast.error(`有 ${failures.length} 份材料未导入，请补充`, {description:failures.join('；').slice(0,220)})
      }
      onCreated(caseId)
    } catch (cause) {
      setError(`材料导入未完成${caseId ? `（已建立草稿 ${caseId}）` : ''}：${cause instanceof Error ? cause.message : String(cause)}`)
      setNotice('')
    } finally {
      setBusy(false)
    }
  }, [busy, createCase, onCreated])

  const onDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault(); setDragging(false)
    const files = Array.from(event.dataTransfer.files ?? [])
    if (!files.length) return
    const paths: Array<{path:string;name:string}> = []
    const missing: string[] = []
    for (const file of files) {
      try {
        const path = window.electronAPI.getPathForFile(file)
        if (path) paths.push({ path, name: file.name })
        else missing.push(file.name)
      } catch { missing.push(file.name) }
    }
    if (missing.length) {
      setError(`这些文件没有可读取的本机路径：${missing.join('、')}。为避免漏件，已取消本次导入；请改用系统文件选择器。`)
      return
    }
    if (paths.length) await startWithPaths(paths)
  }

  const pickFiles = async (): Promise<void> => {
    if (busy) return
    setBusy(true); setError(''); setNotice('正在打开系统文件选择器…')
    let caseId = ''
    try {
      // 使用审核本身的原件导入事务，避免把聊天附件的 base64 副本当成审核原件。
      caseId = await createCase(title.trim() || '新建材料审核')
      const result = await window.reviewAPI.importDocument({ caseId, role: 'application' })
      if (result.canceled) { setNotice('已取消选择；空白草稿保留在本机案卷列表'); return }
      if (!result.documents.length) throw new Error('未导入有效文件')
      const failed = result.failures.map((item) => `${item.fileName}：${item.message}`)
      if (failed.length) {
        setError(`以下文件失败：${failed.join('；')}`)
        toast.error(`有 ${failed.length} 份材料未导入`, {description:failed.join('；').slice(0,220)})
      }
      setNotice(`已导入 ${result.documents.length} 份原件；开始匹配审核业务。`)
      onCreated(caseId)
    } catch (cause) {
      setError(`导入失败${caseId ? `（草稿 ${caseId} 已保存）` : ''}：${cause instanceof Error ? cause.message : String(cause)}`)
      setNotice('')
    } finally { setBusy(false) }
  }

  return <section aria-label="从材料开始审核" className="mx-auto w-full max-w-3xl space-y-3 rounded-xl border border-primary/30 bg-card p-5 shadow-sm">
    <div>
      <h2 className="text-base font-semibold">从材料开始审核</h2>
      <p className="mt-1 text-sm text-muted-foreground">拖入申请书、证明或其它原件。软件先保存真实材料，然后根据内容匹配审核方案；不必先学习模板分类。</p>
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label className="space-y-1 text-xs">案卷名称（可留空）<input className="w-full rounded border bg-background px-2 py-2 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="默认取第一份文件名称" /></label>
      <label className="space-y-1 text-xs">申请人（可稍后核实）<input className="w-full rounded border bg-background px-2 py-2 text-sm" value={applicant} onChange={(event) => setApplicant(event.target.value)} placeholder="不知道时标记为待核实" /></label>
    </div>
    <div role="button" tabIndex={0} aria-label="拖入文件开始材料审核" onDragOver={(event) => {event.preventDefault();setDragging(true)}} onDragLeave={(event) => {event.preventDefault();setDragging(false)}} onDrop={(event) => void onDrop(event)}
      onClick={() => void pickFiles()} onKeyDown={(event) => {if (event.key==='Enter' || event.key===' ') void pickFiles()}}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-5 py-8 text-center ${dragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60'} ${busy ? 'pointer-events-none opacity-60' : ''}`}>
      <Upload size={24} className="text-primary" />
      <p className="font-medium">{busy ? '正在准备审核材料…' : '把材料拖到这里，或点击选择文件'}</p>
      <p className="text-xs text-muted-foreground">支持多文件；原件只保存在当前本机案卷，失败文件会逐一提示</p>
    </div>
    {notice && <p role="status" className="text-xs text-muted-foreground">{notice}</p>}
    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    <Button size="sm" variant="outline" disabled={busy} onClick={() => void pickFiles()}>选择材料开始审核</Button>
  </section>
}
