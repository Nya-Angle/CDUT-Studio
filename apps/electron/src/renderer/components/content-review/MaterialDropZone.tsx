/**
 * 材料拖放/点击导入框（V2 案卷）
 *
 * - 虚线框：点击 = 系统文件对话框（可多选）；拖入 = 直接取本地路径登记
 * - 拖入路径经 webUtils.getPathForFile 获取（渲染层拿不到 File.path）
 * - 槽位守卫：模板含材料槽且未选槽位时先提示（与「登记材料」按钮一致）
 * - 登记走同一 IPC（PICK_REGISTER_MATERIAL_V2 的 handler 复用路径：registerMaterial 服务）
 */
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'

interface MaterialDropZoneProps {
  caseId: string
  slotId: string
  hasSlots: boolean
  slotLabel?: string
  onRegistered: (versionIds: string[]) => void
}

export function MaterialDropZone({ caseId, slotId, hasSlots, slotLabel, onRegistered }: MaterialDropZoneProps): JSX.Element {
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const dragCounter = useRef(0)

  const guard = useCallback((): string | null => {
    if (hasSlots && !slotId) return '请先在上方「材料槽」下拉中选择要登记到哪个槽位'
    return null
  }, [hasSlots, slotId])

  /** 复用登记 IPC：pick 通道支持传 sourcePath 吗？——不支持，走专用拖入登记（逐个 registerMaterial 由主进程完成） */
  const registerPaths = useCallback(async (paths: string[]): Promise<void> => {
    const versionIds: string[] = []
    for (const sourcePath of paths) {
      const versionId = await window.reviewAPI.registerMaterialPathV2({ caseId, sourcePath, role: 'evidence', materialSlotId: slotId || undefined })
      if (versionId) versionIds.push(versionId)
    }
    if (versionIds.length === 0) { toast.error('没有登记成功的材料'); return }
    toast.success(`已登记 ${versionIds.length} 份材料${slotId ? `至槽位 ${slotLabel ?? slotId}` : ''}`)
    onRegistered(versionIds)
  }, [caseId, slotId, slotLabel, onRegistered])

  const onDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    setDragging(false)
    dragCounter.current = 0
    const guardMsg = guard()
    if (guardMsg) { toast.error(guardMsg); return }
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return
    setBusy(true)
    try {
      const paths: string[] = []
      for (const file of files) {
        try {
          const p = window.electronAPI.getPathForFile(file)
          if (p) paths.push(p)
        } catch { /* 忽略无法取路径的项 */ }
      }
      if (paths.length === 0) { toast.error('无法获取拖入文件的本地路径（请改用点击选择）'); return }
      await registerPaths(paths)
    } catch (error) {
      toast.error(`登记失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setBusy(false)
    }
  }, [guard, registerPaths])

  const onPick = useCallback(async (): Promise<void> => {
    const guardMsg = guard()
    if (guardMsg) { toast.error(guardMsg); return }
    setBusy(true)
    try {
      const versionIds = await window.reviewAPI.pickRegisterMaterialV2({ caseId, role: 'evidence', materialSlotId: slotId || undefined })
      if (versionIds.length === 0) { toast.info('未选择文件'); return }
      toast.success(`已登记 ${versionIds.length} 份材料${slotId ? `至槽位 ${slotLabel ?? slotId}` : ''}`)
      onRegistered(versionIds)
    } catch (error) {
      toast.error(`登记失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setBusy(false)
    }
  }, [caseId, slotId, slotLabel, guard, onRegistered])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="导入材料：点击选择或拖入文件"
      onClick={() => void onPick()}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') void onPick() }}
      onDragEnter={(event) => { event.preventDefault(); dragCounter.current += 1; setDragging(true) }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => { event.preventDefault(); dragCounter.current -= 1; if (dragCounter.current <= 0) setDragging(false) }}
      onDrop={(event) => void onDrop(event)}
      className={[
        'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-5 text-center transition-colors',
        dragging ? 'border-primary bg-primary/5' : 'border-border/70 hover:border-primary/50 hover:bg-muted/30',
        busy ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <Upload size={18} className={dragging ? 'text-primary' : 'text-muted-foreground'} />
      <p className="text-sm font-medium">{busy ? '登记中…' : dragging ? '松手登记到案卷' : '点击选择或拖入材料文件'}</p>
      <p className="text-xs text-muted-foreground">支持多选；登记后自动计算哈希并进入材料列表</p>
    </div>
  )
}
