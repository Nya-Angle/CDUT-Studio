import * as React from 'react'
import { atom, useAtomValue, useStore } from 'jotai'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Eye, GripVertical, LoaderCircle, MoreHorizontal, Plus, Trash2, Upload } from 'lucide-react'
import type { CaseAggregateV2, ReviewImportProgressEvent, SourceDocument } from '@profer/shared'
import { Button } from '@profer/ui/primitives/button'
import { ConfirmDialog } from '@profer/ui/primitives/confirm-dialog'
import { reviewCaseAtom } from '@/atoms/review-atoms'
import type { ReviewActions } from './use-review-actions'

const REVIEW_MATERIAL_DRAG_TYPE = 'application/x-review-material-version'

export interface ReviewMaterialDragData {
  caseId: string
  documentVersionId: string
}

export function readReviewMaterialDrag(event: React.DragEvent): ReviewMaterialDragData | null {
  const raw = event.dataTransfer.getData(REVIEW_MATERIAL_DRAG_TYPE)
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<ReviewMaterialDragData>
    return typeof value.caseId === 'string' && typeof value.documentVersionId === 'string'
      ? { caseId: value.caseId, documentVersionId: value.documentVersionId }
      : null
  } catch { return null }
}

export interface ReviewMaterialDragState extends ReviewMaterialDragData {
  fileName: string
  fromRole: SourceDocument['role']
}

interface MaterialDragSnapshot {
  drag: ReviewMaterialDragState | null
  /** 当前插入位置提示：某栏内第 index 个位置之前 */
  hint: { role: SourceDocument['role']; index: number } | null
}

/** 拖动瞬态（Jotai）：不落盘、不发 IPC；同一 Provider 下三栏共享。 */
const materialDragAtom = atom<ReviewMaterialDragState | null>(null)
const materialDropHintAtom = atom<MaterialDragSnapshot['hint']>(null)

/** 三栏共用：读取拖动/插入状态并拿到 begin/end/setHint handlers。 */
export function useMaterialDrag(): MaterialDragSnapshot & {
  begin: (state: ReviewMaterialDragState) => void
  end: () => void
  setHint: (hint: MaterialDragSnapshot['hint']) => void
} {
  const store = useStore()
  const drag = useAtomValue(materialDragAtom)
  const hint = useAtomValue(materialDropHintAtom)
  return {
    drag,
    hint,
    begin: React.useCallback((state: ReviewMaterialDragState) => {
      store.set(materialDragAtom, state)
      store.set(materialDropHintAtom, null)
    }, [store]),
    end: React.useCallback(() => {
      store.set(materialDragAtom, null)
      store.set(materialDropHintAtom, null)
    }, [store]),
    setHint: React.useCallback((next: MaterialDragSnapshot['hint']) => { store.set(materialDropHintAtom, next) }, [store]),
  }
}

/** 拖动手柄：常驻左侧；带跟随卡片（setDragImage），不改变材料版本身份。 */
export function ReviewMaterialDragHandle({
  caseId,
  documentVersionId,
  fileName,
  role,
}: ReviewMaterialDragData & { fileName: string; role: SourceDocument['role'] }): React.ReactElement {
  const previewNode = React.useRef<HTMLDivElement | null>(null)
  const { begin, end } = useMaterialDrag()
  return (
    <button type="button" draggable
      aria-label={`拖动材料：${fileName}（当前在${ROLE_NAMES[role]}；也可用操作菜单改类别或调整顺序）`}
      title="按住拖动：拖到其他材料栏更改类别，拖到同栏某行前方调整顺序"
      onDragStart={(event) => {
        const payload: ReviewMaterialDragData = { caseId, documentVersionId }
        event.dataTransfer.setData(REVIEW_MATERIAL_DRAG_TYPE, JSON.stringify(payload))
        event.dataTransfer.setData('text/plain', fileName)
        event.dataTransfer.effectAllowed = 'move'
        begin({ ...payload, fileName, fromRole: role })
        // 浏览器默认截取按钮本身，信息不足且抖动；这里给一张明确的材料卡作跟随预览。
        const node = document.createElement('div')
        node.textContent = `移动到其他栏 · ${fileName}`
        node.setAttribute('data-review-drag-preview', '')
        node.style.cssText = 'position:fixed;top:-200px;left:-200px;max-width:260px;padding:6px 10px;border-radius:8px;'
          + 'background:#fff;color:#111;border:1px solid rgba(0,0,0,.18);box-shadow:0 6px 18px rgba(0,0,0,.18);'
          + 'font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'
        document.body.appendChild(node)
        previewNode.current = node
        try { event.dataTransfer.setDragImage(node, 14, 14) } catch { /* 旧内核忽略跟随卡片 */ }
      }}
      onDragEnd={() => {
        end()
        previewNode.current?.remove()
        previewNode.current = null
      }}
      className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground/70 hover:bg-muted hover:text-foreground active:cursor-grabbing">
      <GripVertical size={14} />
    </button>
  )
}

/** 三栏投放目标：仅在拖动材料时出现一排明确目标；整块材料栏同样可接收。 */
export function ReviewMaterialLaneTargets({ onTarget, blockedReason }: {
  onTarget: (role: SourceDocument['role']) => void
  /** 正式 CanonicalPlan 等不可本地改类时，投放前就说明原因。 */
  blockedReason?: string | null
}): React.ReactElement | null {
  const { drag, end } = useMaterialDrag()
  if (!drag) return null
  return (
    <div role="group" aria-label="材料投放目标" data-review-lane-targets className="mb-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-primary/[0.04] p-1.5">
      <span className="px-1 text-[11px] text-muted-foreground">{blockedReason ? '不可改类' : '拖到目标栏'}</span>
      {ROLE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.value === drag.fromRole || Boolean(blockedReason)}
          data-review-lane-target={option.value}
          onDragOver={(event) => { event.preventDefault(); event.stopPropagation() }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            end()
            onTarget(option.value)
          }}
          onClick={() => onTarget(option.value)}
          className={[
            'rounded-md border px-2 py-1 text-[11px]',
            option.value === drag.fromRole ? 'cursor-not-allowed border-border bg-background opacity-40' : 'border-border bg-background hover:border-primary hover:text-primary',
          ].join(' ')}
        >{option.label}</button>
      ))}
      {blockedReason && <span className="px-1 text-[11px] text-amber-700 dark:text-amber-300">{blockedReason}</span>}
    </div>
  )
}

/** 同栏插入线：拖到某行前/后时显示。 */
export function MaterialInsertionLine({ visible }: { visible: boolean }): React.ReactElement {
  return (
    <div
      aria-hidden
      data-review-insertion-line
      className={['pointer-events-none rounded bg-primary transition-all duration-150', visible ? 'my-1 h-0.5 opacity-100' : 'my-0 h-0 opacity-0'].join(' ')}
    />
  )
}

/**
 * 行级投放：按指针位于该行上半/下半决定插入到行前或行后。
 * 只读几何信息，hover 期间不调用任何 IPC。
 */
export function useMaterialRowDropTarget(input: {
  role: SourceDocument['role']
  index: number
  onInsert: (fromVersionId: string, insertIndex: number) => void
}): {
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
  insertion: boolean
} {
  const { drag, hint, end, setHint } = useMaterialDrag()
  const sameLane = drag?.fromRole === input.role
  return {
    insertion: sameLane && hint?.role === input.role && hint.index === input.index,
    onDragOver: (event) => {
      if (!drag || !sameLane) return
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'move'
      const rect = event.currentTarget.getBoundingClientRect()
      setHint({ role: input.role, index: event.clientY < rect.top + rect.height / 2 ? input.index : input.index + 1 })
    },
    onDragLeave: () => { if (sameLane) setHint(null) },
    onDrop: (event) => {
      if (!drag || !sameLane) return
      event.preventDefault()
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      const insertIndex = event.clientY < rect.top + rect.height / 2 ? input.index : input.index + 1
      end()
      input.onInsert(drag.documentVersionId, insertIndex)
    },
  }
}

/** 列尾追加区：把材料拖到列表末尾（同栏）或整栏（跨栏由栏容器处理）。 */
export function MaterialAppendStrip({ role, count, onInsert }: {
  role: SourceDocument['role']
  count: number
  onInsert: (fromVersionId: string, insertIndex: number) => void
}): React.ReactElement {
  const drop = useMaterialRowDropTarget({ role, index: count, onInsert })
  return (
    <div
      data-review-append-strip
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
      onDrop={drop.onDrop}
      className="h-3"
    >
      <MaterialInsertionLine visible={drop.insertion} />
    </div>
  )
}

/**
 * 槽位入参语义（以 Main 真实合同为准，不发明新协议）：
 * - 非空字符串：请求该槽位；是否合法由 Main 校验（不在此 trim 改变身份）。
 * - undefined / 空串 / null：请求中省略该字段。Main 在 native 改类把省略转成 null（`input.materialSlotId ?? null`）
 *   并据此清空槽位；F05 apply 亦写入 `proposal.nextMaterialSlotId`，省略即清槽。
 *   因此“省略”= 清空当前槽位，不是“保持”。
 */
export function normalizeMaterialSlotInput(materialSlotId?: string | null): string | undefined {
  // 只判断“是否提供了槽位”，不裁切合法 ID 的字节（trim 会改变身份，Main 也未 trim）。
  return typeof materialSlotId === 'string' && materialSlotId !== '' ? materialSlotId : undefined
}

/** 直接改类请求；未提供槽位时不带该字段（Main 会按 null 清空槽位）。 */
export function buildReclassifyMaterialRequest(input: {
  caseId: string
  documentVersionId: string
  role: SourceDocument['role']
  materialSlotId?: string | null
}): { caseId: string; documentVersionId: string; role: SourceDocument['role']; materialSlotId?: string } {
  const materialSlotId = normalizeMaterialSlotInput(input.materialSlotId)
  return {
    caseId: input.caseId,
    documentVersionId: input.documentVersionId,
    role: input.role,
    ...(materialSlotId ? { materialSlotId } : {}),
  }
}

/** D2 冻结时的 F05 纠错提案请求；必须与直接改类携带同一槽位，否则提案按省略处理会清空槽位。 */
export function buildRemediationProposalRequest(input: {
  caseId: string
  expectedRevision: number
  documentVersionId: string
  role: SourceDocument['role']
  materialSlotId?: string | null
  reason: string
}): {
  caseId: string; requestId: string; expectedRevision: number
  documentVersionId: string; role: SourceDocument['role']; materialSlotId?: string; reason: string
} {
  const materialSlotId = normalizeMaterialSlotInput(input.materialSlotId)
  return {
    caseId: input.caseId,
    requestId: `drag-reclassify-propose-${crypto.randomUUID()}`,
    expectedRevision: input.expectedRevision,
    documentVersionId: input.documentVersionId,
    role: input.role,
    ...(materialSlotId ? { materialSlotId } : {}),
    reason: input.reason,
  }
}

/**
 * 三栏共用的材料改类路径：先直接 reclassify；若案卷已冻结 D2 技术计划，
 * 转既有 F05 纠错（propose → 用户确认 → apply，旧计划入历史、旧结果失效）；
 * 已冻结的技术/正式计划先明确撤回入历史，再修正材料；不继续沿用旧审核结果。
 */
export function useMaterialReclassify({ aggregate, actions }: {
  aggregate: CaseAggregateV2 | null
  actions: ReviewActions
}): {
  reclassify: (drag: { caseId: string; documentVersionId: string; fromRole?: SourceDocument['role']; materialSlotId?: string | null }, role: SourceDocument['role'], materialSlotId?: string | null) => Promise<void>
  blockedReason: string | null
  dialog: React.ReactElement
  busy: boolean
} {
  const [pending, setPending] = React.useState<null | {
    caseId: string
    documentVersionId: string
    role: SourceDocument['role']
    proposalId: string
    planFingerprint: string
    planKind: 'd2' | 'canonical'
    revision: number
  }>(null)
  const [busy, setBusy] = React.useState(false)
  const blockedReason = null

  // 当前选中案卷的实时引用：旧的异步回执不能把用户选回旧案。
  const activeCaseRef = React.useRef<string | undefined>(aggregate?.caseV2.id)
  activeCaseRef.current = aggregate?.caseV2.id
  const busyRef = React.useRef(false)
  busyRef.current = busy

  const reclassify = React.useCallback(async (drag: { caseId: string; documentVersionId: string; fromRole?: SourceDocument['role']; materialSlotId?: string | null }, role: SourceDocument['role'], materialSlotId?: string | null): Promise<void> => {
    const caseId = aggregate?.caseV2.id
    if (!caseId || drag.caseId !== caseId) {
      toast.error('材料来自其他案卷，无法在当前工作台改分类')
      return
    }
    if (busyRef.current) return // 写入中不重复提交
    // 同类别也要比较槽位：槽位变化同样需要真实写入，不能按角色相同吞掉。
    // 未提供槽位时请求省略该字段，Main 会清空槽位（不是保持）；因此只有“同角色且都未提供槽位”才可跳过。
    const nextSlot = normalizeMaterialSlotInput(materialSlotId)
    const currentSlot = aggregate?.caseV2.documents.find((doc) => doc.versionId === drag.documentVersionId)?.materialSlotId
    // 省略槽位在 Main 侧=清空；只有“同角色且槽位实际不变”才跳过。
    const slotUnchanged = nextSlot === undefined ? currentSlot == null : nextSlot === currentSlot
    if (drag.fromRole === role && slotUnchanged) return
    setBusy(true)
    try {
      if (aggregate?.canonicalPlan) throw new Error('已冻结计划需先进入留痕纠错流程')
      await window.reviewAPI.reclassifyNativeMaterialV3(buildReclassifyMaterialRequest({
        caseId, documentVersionId: drag.documentVersionId, role, materialSlotId: nextSlot,
      }))
      if (activeCaseRef.current === caseId) await actions.selectCase(caseId)
      animateMaterialRow(drag.documentVersionId)
      toast.success(`材料已改为${ROLE_NAMES[role]}`)
      return
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      const fresh = await window.reviewAPI.getAggregateV2(caseId)
      if (!fresh) { toast.error(`调整材料栏位失败：${reason}`); return }
      if (!fresh.d2RuntimePlan && !fresh.canonicalPlan) { toast.error(`调整材料栏位失败：${reason}`); return }
      try {
        // 既有 F05 纠错链：先留痕一条人工纠错提案（不改材料、不改结论）。
        const proposed = await window.reviewAPI.proposeNativeRemediationV3(buildRemediationProposalRequest({
          caseId,
          expectedRevision: fresh.caseV2.revision,
          documentVersionId: drag.documentVersionId,
          role,
          materialSlotId: nextSlot,
          reason: `人工将材料改为${ROLE_NAMES[role]}`,
        }))
        if (!proposed.ok) throw new Error(proposed.message || '纠错建议未保存')
        // 只认本次事务返回的提案：entity.id 或本次返回聚合中的同 ID 记录。
        const entityId = (proposed as { entity?: { id?: string } }).entity?.id
        const records = proposed.aggregate?.remediationRecords ?? []
        const record = entityId
          ? records.find((item) => item.id === entityId)
          : records.find((item) => item.status === 'proposed'
            && item.documentVersionId === drag.documentVersionId && item.nextRole === role)
        if (!record || !record.planFingerprint || !['d2','canonical'].includes(record.planKind))
          throw new Error('更改记录已保存，但没有取回本次记录；请到“人工纠错”面板继续')
        setPending({
          caseId, documentVersionId: drag.documentVersionId, role,
          proposalId: record.id, planFingerprint: record.planFingerprint,
          planKind: record.planKind as 'd2' | 'canonical',
          revision: proposed.aggregate.caseV2.revision,
        })
      } catch (cause) {
        toast.error(`调整材料栏位失败：${cause instanceof Error ? cause.message : String(cause)}`)
      }
    } finally {
      setBusy(false)
    }
  }, [aggregate, actions])

  const apply = React.useCallback(async (): Promise<void> => {
    if (!pending) return
    setBusy(true)
    try {
      const outcome = await window.reviewAPI.applyNativeRemediationV3({
        caseId: pending.caseId,
        requestId: `drag-reclassify-apply-${crypto.randomUUID()}`,
        expectedRevision: pending.revision,
        proposalId: pending.proposalId,
        ...(pending.planKind === 'canonical'
          ? { acknowledgedCanonicalFingerprint: pending.planFingerprint,
              rebuildAcknowledgement: '我确认旧正式审核计划及结果失效' }
          : { acknowledgedD2Fingerprint: pending.planFingerprint,
              rebuildAcknowledgement: '我确认旧技术预审计划及审核结果失效' }),
      })
      if (!outcome.ok) throw new Error(outcome.message || '执行纠错失败')
      setPending(null)
      if (activeCaseRef.current === pending.caseId) await actions.selectCase(pending.caseId)
      animateMaterialRow(pending.documentVersionId)
      if (pending.planKind === 'canonical') {
        toast.success('材料分类已更改，旧正式计划与结果已归档；请重新选择审核方案后开展技术初审')
      } else if (outcome.recovery?.status === 'rebuilt') {
        toast.success('材料分类已更改，审核方案已按原受控来源重新建立；旧结果失效，请启动新一轮审核')
      } else {
        toast.success('材料分类已更改，旧结果失效，原件和历史保留；请重新建立审核方案后复审')
        if (outcome.recovery?.reason) toast.warning(`审核方案暂未恢复：${outcome.recovery.reason}`)
      }
    } catch (error) {
      toast.error(`执行纠错失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setBusy(false)
    }
  }, [pending, actions])

  return {
    reclassify,
    blockedReason,
    busy,
    dialog: (
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => { if (!open) setPending(null) }}
        title="确认更改材料分类？"
        description={pending?.planKind === 'canonical'
          ? '更改后，旧正式计划和结果将归档，本案退回草稿；请重新选择方案开展技术初审。原件及历史保留。'
          : '更改后，本次审核结果与待办将失效。系统会尝试从原受控来源重建技术方案；若无法安全重建，需重新选择方案。材料原件和历史记录保留。'}
        confirmLabel="确认更改"
        loadingLabel="正在执行…"
        loading={busy}
        onConfirm={() => void apply()}
      />
    ),
  }
}

/** 落位过渡：写入后给目标行一次可见反馈；失败由调用方回滚并提示。 */
export function animateMaterialRow(versionId: string): void {
  const row = document.querySelector<HTMLElement>(`[data-material-row="${CSS.escape(versionId)}"]`)
  if (!row?.animate) return
  row.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.015)', backgroundColor: 'rgba(59,130,246,.12)' }, { transform: 'scale(1)' }],
    { duration: 260, easing: 'ease-out' },
  )
}

export async function reclassifyNativeMaterialRole(
  caseId: string,
  documentVersionId: string,
  role: SourceDocument['role'],
  actions: ReviewActions,
): Promise<void> {
  await window.reviewAPI.reclassifyNativeMaterialV3({ caseId, documentVersionId, role })
  await actions.selectCase(caseId)
}

/** 从 V2 聚合解析材料当前有效版本 ID；找不到返回 undefined，绝不臆造 `${documentId}-v1`。 */
export function resolveActiveMaterialVersionId(
  aggregate: { caseV2: { documents: Array<{ documentId: string; versionId: string; active?: boolean }> } } | null | undefined,
  documentId: string,
): string | undefined {
  return aggregate?.caseV2.documents.find((doc) => doc.active !== false && doc.documentId === documentId)?.versionId
}

/**
 * 原生案卷以 Main 的第一个创建回执识别，该回执 revision 为 0；案卷当前 revision 可继续增长。
 * 不能按版本 ID 命名猜测（原生版本 ID 同样是 `${documentId}-v1` 形态）。
 * 仅用于 UI 控件形态判定；Main 对每次 reclassify 独立校验。
 */
export function isNativeManagedCase(
  aggregate: { receiptLog?: Array<{ type?: string; revision?: number }> } | null | undefined,
): boolean {
  const created = aggregate?.receiptLog?.[0]
  return created?.type === 'CreateNativeWorkspaceCaseV3' && created.revision === 0
}

export const ROLE_NAMES: Record<SourceDocument['role'], string> = {
  rule: '审核依据',
  application: '申报材料',
  evidence: '证明材料',
}

const ROLE_OPTIONS: Array<{ value: SourceDocument['role']; label: string }> = [
  { value: 'application', label: '申报材料' },
  { value: 'evidence', label: '证明材料' },
  { value: 'rule', label: '审核依据' },
]

function createImportRequestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `review-import-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function importProgressLabel(progress: ReviewImportProgressEvent | null, fallback: string): string {
  if (!progress) return fallback
  const batch = progress.fileIndex && progress.fileCount ? `${progress.fileIndex}/${progress.fileCount} · ` : ''
  if (progress.phase === 'selecting') return '等待选择文件…'
  if (progress.phase === 'scanning-pdf' || progress.phase === 'rendering-pdf') return `${batch}检查 PDF ${progress.page ?? 0}/${progress.totalPages ?? 0} 页`
  if (progress.phase === 'extracting-text') return `${batch}正在解析：${progress.fileName ?? ''}`
  if (progress.phase === 'file-failed') return `${batch}导入失败：${progress.fileName ?? '文件'}`
  if (progress.phase === 'file-complete') return `${batch}已导入：${progress.fileName ?? '文件'}`
  return `${batch}${progress.message ?? fallback}`
}

function subscribeToImportProgress(callback: (event: ReviewImportProgressEvent) => void): (() => void) | undefined {
  // dev 下 renderer 可能先于 preload 热更新；旧 bridge 不提供进度订阅时仍允许正常上传。
  const subscribe = window.reviewAPI?.onImportProgress
  return typeof subscribe === 'function' ? subscribe(callback) : undefined
}

export function ReviewMaterialLaneActions({
  role,
  documentIds,
  actions,
  onAddManual,
}: {
  role: SourceDocument['role']
  documentIds: string[]
  actions: ReviewActions
  onAddManual?: () => void
}): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const [importing, setImporting] = React.useState(false)
  const [progress, setProgress] = React.useState<ReviewImportProgressEvent | null>(null)
  const activeRequestId = React.useRef<string | null>(null)
  const [clearOpen, setClearOpen] = React.useState(false)
  const [clearing, setClearing] = React.useState(false)
  const name = ROLE_NAMES[role]

  React.useEffect(() => subscribeToImportProgress((event) => {
    if (event.requestId === activeRequestId.current) setProgress(event)
  }), [])

  const importOne = async (): Promise<void> => {
    if (!reviewCase || importing) return
    const requestId = createImportRequestId()
    activeRequestId.current = requestId
    setProgress({ requestId, caseId: reviewCase.id, role, phase: 'selecting', message: '等待选择文件' })
    setImporting(true)
    try {
      const result = await actions.importDocument(role, requestId)
      if (result?.documents.length) toast.success(`已添加 ${result.documents.length} 份${name}`)
      if (result?.failures.length) toast.error(`${result.failures.length} 份文件导入失败：${result.failures.slice(0, 3).map((failure) => failure.fileName).join('、')}`)
    } catch (error) {
      toast.error(`${name}导入失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      activeRequestId.current = null
      setProgress(null)
      setImporting(false)
    }
  }

  const clearLane = async (): Promise<void> => {
    setClearing(true)
    try {
      if (await actions.clearDocuments(role)) {
        toast.success(`已从当前审核中清空${name}`)
        setClearOpen(false)
      } else {
        toast.error(`清空${name}失败，请查看页面提示`)
      }
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {role === 'rule' && onAddManual ? (
        <>
          <Button type="button" size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" disabled={!reviewCase || importing} title={reviewCase ? '手写一条审核依据' : '请先新建审核任务'} onClick={onAddManual}>
            <Plus size={12} />添加依据
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" disabled={!reviewCase || importing} title={importing ? importProgressLabel(progress, '等待选择…') : reviewCase ? '从本地选择依据文件' : '请先新建审核任务'} onClick={() => void importOne()}>
          {importing ? <LoaderCircle size={12} className="animate-spin" /> : <Plus size={12} />}
            {importing ? <span className="min-w-0 max-w-40 truncate">{importProgressLabel(progress, '等待选择…')}</span> : '上传依据'}
          </Button>
        </>
      ) : (
        <Button
          id={role === 'evidence' ? 'review-evidence-upload-button' : undefined}
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1 px-2 text-xs"
          disabled={!reviewCase || importing}
          title={importing ? importProgressLabel(progress, '正在导入…') : reviewCase ? `只添加到${name}` : '请先新建审核任务'}
          onClick={() => void importOne()}
        >
          {importing ? <LoaderCircle size={12} className="animate-spin" /> : <Plus size={12} />}
          {importing ? <span className="min-w-0 max-w-40 truncate">{importProgressLabel(progress, '等待选择…')}</span> : `添加${name}`}
        </Button>
      )}
      {documentIds.length > 0 && (
        <>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-1.5 text-xs text-muted-foreground hover:text-destructive"
            disabled={clearing}
            onClick={() => setClearOpen(true)}
          >
            清空
          </Button>
          <ConfirmDialog
            open={clearOpen}
            onOpenChange={setClearOpen}
            title={`清空${name}`}
            description={`确认从当前审核中移除全部 ${documentIds.length} 份${name}？关联内容会同步撤下，案卷原文件和历史记录会保留。`}
            confirmLabel="清空材料"
            loadingLabel="正在清空…"
            loading={clearing}
            onConfirm={() => void clearLane()}
          />
        </>
      )}
    </div>
  )
}

/** 中栏申报材料与证明材料的统一拖放导入框。 */
export function ReviewMaterialDropZone({
  role,
  hasDocuments,
  actions,
  onMaterialDrop,
}: {
  role: 'application' | 'evidence'
  hasDocuments: boolean
  actions: ReviewActions
  /** 已有材料拖入本投放区 = 人工改分类；绝不当作新文件导入。 */
  onMaterialDrop?: (drag: ReviewMaterialDragData) => Promise<void>
}): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const [dragging, setDragging] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [progress, setProgress] = React.useState<ReviewImportProgressEvent | null>(null)
  const activeRequestId = React.useRef<string | null>(null)
  const dragCounter = React.useRef(0)
  const label = role === 'application' ? '申报材料' : '证明材料'

  React.useEffect(() => subscribeToImportProgress((event) => {
    if (event.requestId === activeRequestId.current) setProgress(event)
  }), [])

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)
    dragCounter.current = 0
    // 已有材料的内部拖动优先于文件导入：误当新文件会复制原件并重复入库。
    const moved = readReviewMaterialDrag(event)
    if (moved) {
      try {
        if (onMaterialDrop) await onMaterialDrop(moved)
      } catch (error) {
        toast.error(`调整材料栏位失败：${error instanceof Error ? error.message : String(error)}`)
      }
      return
    }
    if (!reviewCase || importing) return
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return

    const paths: string[] = []
    for (const file of files) {
      try {
        const path = window.electronAPI.getPathForFile(file)
        if (path) paths.push(path)
      } catch { /* 无法读取本地路径的文件会在下方汇总提示 */ }
    }
    if (paths.length === 0) {
      toast.error('无法读取拖入文件的本地路径，请点击右上角按钮选择文件')
      return
    }

    setImporting(true)
    const requestId = createImportRequestId()
    activeRequestId.current = requestId
    setProgress({ requestId, caseId: reviewCase.id, role, phase: 'extracting-text', fileName: paths[0], message: `正在导入 ${paths.length} 份${label}` })
    let imported = 0
    try {
      for (const path of paths) {
        if (await actions.importDocumentFromPath(role, path, requestId)) imported += 1
      }
      if (imported > 0) toast.success(`已添加 ${imported} 份${label}`)
      if (imported < paths.length) toast.error(`${paths.length - imported} 份文件未能导入，请查看页面提示`)
    } finally {
      activeRequestId.current = null
      setProgress(null)
      setImporting(false)
    }
  }

  return (
    <div
      role="region"
      aria-label={`拖入${label}文件`}
      onDragEnter={(event) => { event.preventDefault(); event.stopPropagation(); dragCounter.current += 1; setDragging(true) }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation() }}
      onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); dragCounter.current = Math.max(0, dragCounter.current - 1); if (dragCounter.current === 0) setDragging(false) }}
      onDrop={(event) => void handleDrop(event)}
      className={[
        'flex shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed px-3 text-center transition-colors',
        hasDocuments ? 'min-h-12 py-2' : 'min-h-16 py-3',
        dragging ? 'border-primary bg-primary/5 text-primary' : 'border-border/70 text-muted-foreground',
        importing ? 'opacity-70' : '',
      ].join(' ')}
    >
      {importing ? <LoaderCircle size={15} className="shrink-0 animate-spin" /> : <Upload size={15} className="shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs font-medium">{importing ? importProgressLabel(progress, `正在导入${label}…`) : dragging ? `松手添加为${label}` : `将文件拖到这里添加${label}`}</p>
        {!dragging && !importing && <p className="mt-0.5 text-xs">支持一次拖入多个文件</p>}
      </div>
    </div>
  )
}

export function RemoveReviewDocumentButton({
  document,
  actions,
}: {
  document: Pick<SourceDocument, 'id' | 'fileName'>
  actions: ReviewActions
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [removing, setRemoving] = React.useState(false)

  const remove = async (): Promise<void> => {
    setRemoving(true)
    try {
      if (await actions.removeDocument(document.id)) {
        toast.success(`已移除：${document.fileName}`)
        setOpen(false)
      } else {
        toast.error('移除材料失败，请查看页面提示')
      }
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`删除材料 ${document.fileName}`}
        title={`移除 ${document.fileName}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={13} />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="移除这份材料？"
        description={`确认将「${document.fileName}」从当前审核中移除？关联内容会同步撤下，案卷原文件和历史记录会保留。`}
        confirmLabel="移除材料"
        loadingLabel="正在移除…"
        loading={removing}
        onConfirm={() => void remove()}
      />
    </>
  )
}

export function MoveReviewDocumentButtons({
  role,
  documentIds,
  documentId,
  actions,
  fileName,
  native = false,
  onReclassify,
  onPreview,
  removeSlot,
}: {
  role: SourceDocument['role']
  documentIds: string[]
  documentId: string
  actions: ReviewActions
  /** 供 aria/标题引用的文件名 */
  fileName?: string
  /** 原生案卷：菜单内提供键盘可操作的栏位选择；历史案卷只保留上下顺序 */
  native?: boolean
  onReclassify?: (role: SourceDocument['role']) => Promise<void>
  onPreview?: () => void
  /** 移除按钮（带确认框）收进同一个更多菜单，避免每行常驻一排控件 */
  removeSlot?: React.ReactNode
}): React.ReactElement {
  const [busy, setBusy] = React.useState(false)
  const index = documentIds.indexOf(documentId)
  const label = fileName ?? documentId
  const move = async (direction: -1 | 1): Promise<void> => {
    const targetIndex = index + direction
    if (busy || index < 0 || targetIndex < 0 || targetIndex >= documentIds.length) return
    const next = [...documentIds]
    ;[next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!]
    setBusy(true)
    try {
      if (await actions.reorderDocuments(role, next)) toast.success('材料顺序已更新')
      else toast.error('调整材料顺序失败，请查看页面提示')
    } finally {
      setBusy(false)
    }
  }

  const reclassify = async (nextRole: SourceDocument['role']): Promise<void> => {
    if (busy || !onReclassify || nextRole === role) return
    setBusy(true)
    try {
      await onReclassify(nextRole)
      toast.success(`已将材料移至${ROLE_NAMES[nextRole]}`)
    } catch (error) {
      toast.error(`调整材料栏位失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <details className="relative shrink-0" data-material-actions>
      <summary
        aria-label={`更多材料操作：${label}`}
        title="更多操作"
        className="flex size-7 cursor-pointer list-none items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
      ><MoreHorizontal size={14} /></summary>
      <div className="absolute right-0 z-20 mt-1 w-48 space-y-1 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
        {onPreview && (
          <button type="button" onClick={onPreview} className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs hover:bg-muted">
            <Eye size={12} />预览原件
          </button>
        )}
        {native && onReclassify && (
          <>
            <label className="block px-2 pt-1 text-[11px] text-muted-foreground" htmlFor={`review-material-role-${documentId}`}>
              材料栏位（当前：{ROLE_NAMES[role]}）
            </label>
            <select
              id={`review-material-role-${documentId}`}
              value={role}
              disabled={busy}
              onChange={(event) => void reclassify(event.target.value as SourceDocument['role'])}
              className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
            >
              {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </>
        )}
        <button type="button" disabled={busy || index <= 0} onClick={() => void move(-1)} className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs hover:bg-muted disabled:opacity-40">
          <ChevronUp size={12} />上移
        </button>
        <button type="button" disabled={busy || index < 0 || index >= documentIds.length - 1} onClick={() => void move(1)} className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs hover:bg-muted disabled:opacity-40">
          <ChevronDown size={12} />下移
        </button>
        {removeSlot && <div className="border-t border-border/60 pt-1">{removeSlot}</div>}
      </div>
    </details>
  )
}
