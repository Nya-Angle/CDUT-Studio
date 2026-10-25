/**
 * CenterPanel — 中栏「申请与证明」
 *
 * 结构：
 * - 头部：栏目名 + 条目统计（N 条 / M 份证明）
 * - 申报事项区：开始审核时自动识别 → 条目卡列表
 *   每张条目卡：标题 / 类别 badge / 申报分数 / 日期 / 组织方 + 关联证据缩略名 + 该条 findings 的红/黄圆点
 *   + 卡下方直接渲染该条目的申报原文行（SourceBlockView dense）
 *   点击条目卡 → 写 reviewFocusAtom 定位其申报行（severity 取该条最高严重度）
 * - 证明区：每份证据一张卡（文件名 + recognizedFacts + parseStatus badge + 关联条目名）。
 *   按 T6 简化决定（决策日志 #16）：不渲染 SVG 原图，以识别事实与状态徽标为准。
 */

import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { Award, Check, Eye, Layers, Link2, Pencil, Unlink2, X } from 'lucide-react'
import type {
  CaseAggregateV2,
  EvidenceDocument,
  EvidenceParseStatus,
  FindingSeverity,
  ReviewFinding,
  ReviewItem,
  FieldValue,
  TemplateVersion,
} from '@profer/shared'
import {
  currentEvidencesAtom,
  currentItemsAtom,
  documentsByRoleAtom,
  findBlockByAnchor,
  reviewRunAtom,
  reviewCaseAtom,
  reviewWorkspaceAggregateAtom,
  reviewWorkspaceExtractedObservationsAtom,
  reviewWorkspaceRunStaleAtom,
  reviewWorkspaceRunAtom,
  reviewWorkspaceTemplateAtom,
  reviewAdjudicationEditorSubjectAtom,
} from '@/atoms/review-atoms'
import { cn } from '@/lib/utils'
import type { ReviewActions } from './use-review-actions'
import { SourceBlockView } from './SourceBlockView'
import { ReviewV3SourceNavigator } from './ReviewV3SourceNavigator'
import { ReviewV3F06EvidenceWorkbench } from './ReviewV3F06EvidenceWorkbench'
import { useReviewWorkspaceActions } from './use-review-workspace-actions'
import { ReviewActionDialog } from './ReviewActionDialog'
import { Button } from '@profer/ui/primitives/button'
import { ConfirmDialog } from '@profer/ui/primitives/confirm-dialog'
import { MaterialDropZone } from './MaterialDropZone'
import {
  MaterialAppendStrip,
  MaterialInsertionLine,
  MoveReviewDocumentButtons,
  RemoveReviewDocumentButton,
  ReviewMaterialDragHandle,
  ReviewMaterialDropZone,
  ReviewMaterialLaneActions,
  ReviewMaterialLaneTargets,
  ROLE_NAMES,
  animateMaterialRow,
  isNativeManagedCase,
  readReviewMaterialDrag,
  resolveActiveMaterialVersionId,
  useMaterialDrag,
  useMaterialReclassify,
  useMaterialRowDropTarget,
  type ReviewMaterialDragData,
} from './ReviewMaterialControls'
import { FilePreviewDialog } from '@/components/file-browser/FilePreviewDialog'
import { currentMaterialRecognizedFacts } from './review-material-facts'

interface ReviewItemDraft {
  title: string
  category: string
  level: string
  declaredScore: string
  activityDate: string
  organizer: string
}

interface CenterPanelProps {
  actions: ReviewActions
}

export function CenterPanel({ actions }: CenterPanelProps): React.ReactElement {
  const items = useAtomValue(currentItemsAtom)
  const evidences = useAtomValue(currentEvidencesAtom)
  const documentsByRole = useAtomValue(documentsByRoleAtom)
  const run = useAtomValue(reviewRunAtom)
  const reviewCase = useAtomValue(reviewCaseAtom)
  const aggregate = useAtomValue(reviewWorkspaceAggregateAtom)
  const extractedObservations = useAtomValue(reviewWorkspaceExtractedObservationsAtom)
  const workspaceRunStale = useAtomValue(reviewWorkspaceRunStaleAtom)
  const workspaceRun = useAtomValue(reviewWorkspaceRunAtom)
  const workspaceTemplate = useAtomValue(reviewWorkspaceTemplateAtom)
  const workspaceActions = useReviewWorkspaceActions()
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null)
  const [itemDraft, setItemDraft] = React.useState<ReviewItemDraft | null>(null)
  const [savingItemId, setSavingItemId] = React.useState<string | null>(null)
  const [sourcePreview, setSourcePreview] = React.useState<{ path: string; fileName: string } | null>(null)
  const nativeCase = isNativeManagedCase(aggregate)
  const { drag: activeDrag, end: endDrag } = useMaterialDrag()
  const { reclassify: handleMaterialReclassify, blockedReason: materialBlockedReason, dialog: materialReclassifyDialog } = useMaterialReclassify({ aggregate, actions })
  /** 选择代次：预览路径是异步返回；切案或新请求后旧响应必须丢弃，不能串案。 */
  const previewGeneration = React.useRef(0)

  // 组件卸载（离开工作台）时取消拖动瞬态，避免残留插入线/投放目标
  React.useEffect(() => () => { endDrag() }, [endDrag])

  React.useEffect(() => {
    previewGeneration.current += 1
    endDrag() // 切案即取消拖动瞬态，不把旧案材料拖到新案
    setSourcePreview(null)
    setEditingItemId(null)
    setItemDraft(null)
  }, [reviewCase?.id])

  const previewDocument = React.useCallback(async (documentId: string, fileName: string): Promise<void> => {
    const caseSnapshot = aggregate?.caseV2
    const versionId = resolveActiveMaterialVersionId(aggregate, documentId)
    if (!caseSnapshot || !versionId) {
      toast.error('找不到案卷中保存的原件')
      return
    }
    const generation = ++previewGeneration.current
    try {
      const path = await window.reviewAPI.getWorkspaceDocumentPreviewPath({ caseId: caseSnapshot.id, documentVersionId: versionId })
      if (generation !== previewGeneration.current) return // 切案/新预览已开始：丢弃过期异步响应
      if (!path) throw new Error('找不到案卷中保存的原件')
      setSourcePreview({ path, fileName })
    } catch (error) {
      if (generation !== previewGeneration.current) return
      toast.error(error instanceof Error ? error.message : String(error))
    }
  }, [aggregate])

  /** 同栏拖动排序：沿用 REORDER_DOCUMENTS（原生已分流到 V3 事务），失败不动列表。 */
  const handleMaterialReorder = React.useCallback(async (role: import('@profer/shared').SourceDocument['role'], fromVersionId: string, insertIndex: number): Promise<void> => {
    const docs = (aggregate?.caseV2.documents ?? []).filter((doc) => doc.active !== false && doc.role === role)
    const fromIndex = docs.findIndex((doc) => doc.versionId === fromVersionId)
    if (fromIndex < 0) return
    const ids = docs.map((doc) => doc.documentId)
    const target = insertIndex > fromIndex ? insertIndex - 1 : insertIndex
    if (target === fromIndex) return
    const next = [...ids]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(target, 0, moved!)
    const caseId = aggregate?.caseV2.id
    if (!caseId) return
    try {
      if (await actions.reorderDocuments(role, next)) {
        animateMaterialRow(fromVersionId)
        toast.success('材料顺序已更新')
      } else {
        toast.error('调整材料顺序失败，请查看页面提示')
      }
    } catch (error) {
      toast.error(`调整材料顺序失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }, [aggregate, actions])

  const renderedBlockIds = new Set(items.map((item) => item.anchor.blockId))

  /** 按条目聚合 findings（联动圆点 + 最高严重度用） */
  const findingsByItemId = React.useMemo(() => {
    const map = new Map<string, ReviewFinding[]>()
    if (!run) return map
    for (const finding of run.findings) {
      const list = map.get(finding.itemId)
      if (list) list.push(finding)
      else map.set(finding.itemId, [finding])
    }
    return map
  }, [run])

  /** 点击条目卡：写 focus 定位申报行（severity 取该条最高严重度；无发现时按黄=待确认处理） */
  const handleItemClick = (item: ReviewItem): void => {
    const itemFindings = findingsByItemId.get(item.id) ?? []
    const severity: FindingSeverity = itemFindings.some((f) => f.severity === 'red') ? 'red' : 'yellow'
    actions.focusFinding({
      id: `item-focus-${item.id}`,
      itemId: item.id,
      kind: 'info-incomplete',
      severity,
      title: item.title,
      detail: '',
      suggestion: 'manual-review',
      suggestionText: '',
      subjectAnchor: item.anchor,
      ruleAnchors: [],
      ruleItemIds: [],
      generatedBy: 'fixture',
    }, { select: false })
  }

  const beginEditingItem = (item: ReviewItem): void => {
    setEditingItemId(item.id)
    setItemDraft({
      title: item.title,
      category: item.category,
      level: item.level ?? '',
      declaredScore: String(item.declaredScore),
      activityDate: item.activityDate ?? '',
      organizer: item.organizer ?? '',
    })
  }

  const cancelEditingItem = (): void => {
    setEditingItemId(null)
    setItemDraft(null)
  }

  const saveEditedItem = async (item: ReviewItem): Promise<void> => {
    if (!itemDraft || savingItemId) return
    const score = Number(itemDraft.declaredScore)
    if (!itemDraft.title.trim() || !itemDraft.category.trim() || !itemDraft.declaredScore.trim() || !Number.isFinite(score) || score < 0) {
      toast.error('请填写事项名称、类别和有效的非负分值')
      return
    }
    setSavingItemId(item.id)
    try {
      const ok = await actions.updateReviewItem({
        itemId: item.id,
        title: itemDraft.title,
        category: itemDraft.category,
        declaredScore: score,
        level: itemDraft.level,
        activityDate: itemDraft.activityDate,
        organizer: itemDraft.organizer,
      })
      if (!ok) {
        toast.error('保存申报事项失败，请查看页面提示')
        return
      }
      toast.success('申报事项已修正，审核结果需要重新审核')
      cancelEditingItem()
    } finally {
      setSavingItemId(null)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto scrollbar-thin">
      {/* 头部：栏目名 + 统计 */}
      <header className="shrink-0 border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">申请与证明</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {items.length} 条 / {documentsByRole.evidence.length} 份证明
        </p>
      </header>

      <ReviewV3SourceNavigator purpose="application" />
      <ReviewV3SourceNavigator purpose="evidence" />

      {/* 申报文件只在中栏管理，和左栏审核依据、下方证明材料分开导入。 */}
      <section className="shrink-0 border-b border-border/40 px-3 py-3"
        onDragOver={(event) => { if (activeDrag) { event.preventDefault(); event.dataTransfer.dropEffect = 'move' } }}
        onDrop={(event) => {
          const moved = readReviewMaterialDrag(event)
          if (!moved) return
          event.preventDefault(); event.stopPropagation(); endDrag()
          void handleMaterialReclassify({ ...moved, fromRole: activeDrag?.fromRole ?? 'rule' }, 'application')
        }}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <p className="text-xs font-semibold  text-muted-foreground">申报材料</p>
          <ReviewMaterialLaneActions role="application" documentIds={documentsByRole.application.map((document) => document.id)} actions={actions} />
        </div>
        <ReviewMaterialLaneTargets blockedReason={materialBlockedReason} onTarget={(role) => { if (activeDrag) void handleMaterialReclassify(activeDrag, role) }} />
        <div className="mt-2">
          <ReviewMaterialDropZone role="application" hasDocuments={documentsByRole.application.length > 0} actions={actions} onMaterialDrop={(drag) => handleMaterialReclassify(drag, 'application')} />
        </div>
        {documentsByRole.application.length === 0 ? (
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            添加申报表或其他待审核文件；开始审核时会自动识别申报事项。
          </p>
        ) : (
          <div className="mt-2 space-y-1">
            {documentsByRole.application.map((document, index) => (
              <MaterialCompactRow
                key={document.id}
                role="application"
                index={index}
                document={document}
                caseId={aggregate?.caseV2.id}
                versionId={resolveActiveMaterialVersionId(aggregate, document.id)}
                native={nativeCase}
                documentIds={documentsByRole.application.map((source) => source.id)}
                actions={actions}
                onPreview={() => void previewDocument(document.id, document.fileName)}
                onReclassify={handleMaterialReclassify}
                onReorder={(fromVersionId, insertIndex) => void handleMaterialReorder('application', fromVersionId, insertIndex)}
              />
            ))}
            <MaterialAppendStrip role="application" count={documentsByRole.application.length} onInsert={(fromVersionId, insertIndex) => void handleMaterialReorder('application', fromVersionId, insertIndex)} />
          </div>
        )}
      </section>

      {workspaceTemplate?.materialSlots?.length ? (
        <section className="shrink-0 border-b border-border/40 px-3 py-2">
          <details className="rounded-lg border border-border/50 bg-card/60">
            <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-foreground">
              {workspaceTemplate.name} · 模板材料要求（{workspaceTemplate.materialSlots.length}）
            </summary>
            <ul className="space-y-3 border-t border-border/50 px-3 py-2">
              {workspaceTemplate.materialSlots.map((slot) => {
                const sectionName = workspaceTemplate.sections?.find((section) => section.id === slot.sectionId)?.name
                const slotDocuments = (aggregate?.caseV2.documents ?? []).filter((document) => document.active !== false && document.materialSlotId === slot.id)
                return (
                  <li key={slot.id} className="rounded-md border border-border/50 p-2">
                    <p className="text-xs leading-5 text-muted-foreground">
                      <span className="font-medium text-foreground">{sectionName ? `${sectionName} · ` : ''}{slot.name}</span>
                      {slot.minCount > 0 ? ` · 至少 ${slot.minCount} 份` : ' · 可选'}
                      {slot.purpose ? ` · ${slot.purpose}` : ''}
                    </p>
                    {slotDocuments.length > 0 && <p className="mt-1 truncate text-xs text-muted-foreground" title={slotDocuments.map((document) => document.fileName).join('、')}>
                      已添加 {slotDocuments.length} 份：{slotDocuments.map((document) => document.fileName).join('、')}
                    </p>}
                    {aggregate && <div className="mt-2">
                      <MaterialDropZone
                        caseId={aggregate.caseV2.id}
                        slotId={slot.id}
                        hasSlots
                        slotLabel={slot.name}
                        onRegistered={() => { void workspaceActions.refresh() }}
                      />
                    </div>}
                  </li>
                )
              })}
            </ul>
          </details>
        </section>
      ) : null}

      {/* 申报事项（开始审核时自动识别） */}
      <section className="shrink-0 px-3 py-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="text-xs font-semibold  text-muted-foreground">
            申报事项
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-xs text-muted-foreground">
            导入待审材料后，系统会在开始审核时自动识别申报事项。
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const itemFindings = findingsByItemId.get(item.id) ?? []
              const evidenceNames = item.evidenceDocumentIds
                .map((documentId) => documentsByRole.evidence.find((doc) => doc.id === documentId)?.fileName)
                .filter((name): name is string => Boolean(name))
              const itemBlock = findBlockByAnchor(documentsByRole.application, item.anchor)

              return (
                <div id={`review-subject-${encodeURIComponent(item.id)}`} key={item.id} className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                  {/* 条目卡主体（整卡可点击定位） */}
                  <div className="mb-1 flex items-center justify-between gap-2 px-1">
                    <p className="text-xs font-semibold text-muted-foreground">申报 · {item.status === 'confirmed' ? '已确认' : item.status === 'ignored' ? '已忽略' : 'AI 识别'}</p>
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1">
                        <Button type="button" size="sm" className="h-6 gap-1 px-2 text-xs" disabled={savingItemId === item.id} onClick={() => void saveEditedItem(item)}><Check size={12} />保存</Button>
                        <Button type="button" size="sm" variant="ghost" className="h-6 gap-1 px-1.5 text-xs" disabled={savingItemId === item.id} onClick={cancelEditingItem}><X size={12} />取消</Button>
                      </div>
                    ) : (
                      <Button type="button" size="sm" variant="ghost" className="h-6 gap-1 px-1.5 text-xs" disabled={!!editingItemId} aria-label={`修正申报事项：${item.title}`} title="修正 AI 识别结果" onClick={() => beginEditingItem(item)}><Pencil size={11} />修正</Button>
                    )}
                  </div>
                  {editingItemId === item.id && itemDraft ? (
                    <div className="space-y-2 rounded-lg bg-muted/30 p-2">
                      <label className="grid gap-1 text-xs text-muted-foreground">事项名称
                        <input autoFocus maxLength={160} value={itemDraft.title} onChange={(event) => setItemDraft({ ...itemDraft, title: event.target.value })} className="rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-xs text-muted-foreground">类别
                          <input maxLength={80} value={itemDraft.category} onChange={(event) => setItemDraft({ ...itemDraft, category: event.target.value })} className="min-w-0 rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                        </label>
                        <label className="grid gap-1 text-xs text-muted-foreground">申报分值
                          <input type="number" min="0" step="any" value={itemDraft.declaredScore} onChange={(event) => setItemDraft({ ...itemDraft, declaredScore: event.target.value })} className="min-w-0 rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                        </label>
                        <label className="grid gap-1 text-xs text-muted-foreground">等级
                          <input maxLength={100} value={itemDraft.level} onChange={(event) => setItemDraft({ ...itemDraft, level: event.target.value })} className="min-w-0 rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                        </label>
                        <label className="grid gap-1 text-xs text-muted-foreground">活动日期
                          <input maxLength={80} value={itemDraft.activityDate} onChange={(event) => setItemDraft({ ...itemDraft, activityDate: event.target.value })} className="min-w-0 rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                        </label>
                      </div>
                      <label className="grid gap-1 text-xs text-muted-foreground">组织方 / 颁发单位
                        <input maxLength={200} value={itemDraft.organizer} onChange={(event) => setItemDraft({ ...itemDraft, organizer: event.target.value })} className="rounded border border-input bg-background px-2 py-1.5 text-xs text-foreground" />
                      </label>
                      <p className="text-xs leading-4 text-muted-foreground">保存后保留申报原文和证明关联；修改会使旧审核结果过期。</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="flex w-full flex-col gap-1.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-foreground/[0.03] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      title="定位到申报原文行"
                    >
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{item.title}</span>
                        {itemFindings.map((finding) => (
                          <span key={finding.id} title={finding.title} className={cn('size-2 shrink-0 rounded-full', finding.severity === 'red' ? 'bg-red-500' : 'bg-amber-400')} />
                        ))}
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 font-medium text-blue-600 dark:text-blue-400">{item.category}</span>
                        <span className="tabular-nums">申报 {item.declaredScore} 分</span>
                        {item.activityDate && <span className="tabular-nums">{item.activityDate}</span>}
                        {item.level && <span>{item.level}</span>}
                        {item.organizer && <span className="truncate">{item.organizer}</span>}
                      </span>
                      {evidenceNames.length > 0 && <span className="truncate text-xs text-muted-foreground">关联证明：{evidenceNames.join('、')}</span>}
                    </button>
                  )}

                  {/* 该条目的申报原文行（联动高亮落点） */}
                  {itemBlock && (
                    <div className="mt-1.5 rounded-md bg-muted/40 p-1">
                      <SourceBlockView document={itemBlock.document} block={itemBlock.block} dense />
                    </div>
                  )}
                  {aggregate && (
                    <div className="mt-2 space-y-1.5 border-t border-border/50 pt-2">
                      <p className="px-1 text-xs font-semibold text-muted-foreground">核验 · 材料识别结果</p>
                      {[...aggregate.observations.filter((observation) => observation.subjectId === item.id).map((observation) => observation as unknown as Record<string, unknown>), ...extractedObservations.filter((observation) => observation.subjectId === item.id)]
                        .reduce<Array<Record<string, unknown>>>((list, observation) => {
                          const fieldKey = String(observation.fieldKey ?? '')
                          const existingIndex = list.findIndex((candidate) => candidate.fieldKey === fieldKey)
                          if (existingIndex >= 0 && observation.extractedBy !== 'user') return list
                          if (existingIndex >= 0) list[existingIndex] = observation
                          else list.push(observation)
                          return list
                        }, [])
                        .map((observation, index) => (
                          <WorkspaceObservationCard
                            key={`${String(observation.fieldKey)}-${String(observation.createdAt ?? index)}`}
                            observation={observation}
                            aggregate={aggregate}
                            template={workspaceTemplate}
                            onConfirm={(value, reason) => workspaceActions.confirmObservation(observation, value, reason)}
                          />
                        ))}
                      <details className="rounded-lg border border-border/50 px-2.5 py-1.5">
                        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">··· 高级处理</summary>
                        <ManualFactEntry
                          subjectId={item.id}
                          subjectTitle={item.title}
                          subjectFields={aggregate.caseV2.subjects.find((subject) => subject.id === item.id)?.fields ?? {}}
                          template={workspaceTemplate}
                          aggregate={aggregate}
                          onSave={(fieldKey, value, sourceVersionId, reason) => workspaceActions.confirmObservation({ subjectId: item.id, fieldKey, value, sourceRefs: sourceVersionId ? [{ documentVersionId: sourceVersionId }] : [] }, value, reason)}
                        />
                      </details>
                    </div>
                  )}
                  {aggregate?.caseV2.subjects.find((subject) => subject.id === item.id) && (
                    <SubjectAdjudicationCard
                      aggregate={aggregate}
                      subject={aggregate.caseV2.subjects.find((subject) => subject.id === item.id)!}
                      template={workspaceTemplate}
                      canEdit={!!workspaceRun && !workspaceRunStale}
                      actions={workspaceActions}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 未被条目卡引用的原文仍可见：识别失败与漏项不能使待审文件从界面消失。 */}
      {documentsByRole.application.map((document) => {
        const blocks = (document.parseStatus === 'failed' ? [] : document.blocks).filter((block) => !renderedBlockIds.has(block.id))
        if (blocks.length === 0 && !document.parseError) return null
        return (
          <section key={document.id} className="shrink-0 px-3 pb-3">
            <details className="rounded-lg border border-border/50 bg-muted/20 px-2.5 py-2">
              <summary className="cursor-pointer text-xs font-medium">待审原文 · {document.fileName}（{blocks.length} 段）</summary>
              <div className="mt-2 rounded-lg bg-muted/40 p-2">
                {blocks.map((block) => (
                  <SourceBlockView key={block.id} document={document} block={block} dense />
                ))}
                {document.parseError && <p className="text-xs text-amber-600">{document.parseError}</p>}
              </div>
            </details>
          </section>
        )
      })}

      {/* 证明区 */}
      <section className="shrink-0 px-3 pb-4"
        onDragOver={(event) => { if (activeDrag) { event.preventDefault(); event.dataTransfer.dropEffect = 'move' } }}
        onDrop={(event) => {
          const moved = readReviewMaterialDrag(event)
          if (!moved) return
          event.preventDefault(); event.stopPropagation(); endDrag()
          void handleMaterialReclassify({ ...moved, fromRole: activeDrag?.fromRole ?? 'rule' }, 'evidence')
        }}
      >
        <span id="review-evidence-section" />
        <div className="flex items-center justify-between gap-2 px-1 pb-2">
          <p className="text-xs font-semibold  text-muted-foreground">证明材料</p>
          <ReviewMaterialLaneActions role="evidence" documentIds={documentsByRole.evidence.map((document) => document.id)} actions={actions} />
        </div>
        <ReviewMaterialLaneTargets blockedReason={materialBlockedReason} onTarget={(role) => { if (activeDrag) void handleMaterialReclassify(activeDrag, role) }} />
        <div className="mb-2">
          <ReviewMaterialDropZone role="evidence" hasDocuments={documentsByRole.evidence.length > 0} actions={actions} onMaterialDrop={(drag) => handleMaterialReclassify(drag, 'evidence')} />
        </div>
        {aggregate && (
          <details className="mb-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium">
              V3 证明归属与多主体关联（以真实原件版本为准）
            </summary>
            <ReviewV3F06EvidenceWorkbench />
          </details>
        )}
        <div className="space-y-2">
          {documentsByRole.evidence.map((document, index) => {
            const evidence = evidences.find((candidate) => candidate.documentId === document.id)
            const versionId = resolveActiveMaterialVersionId(aggregate, document.id)
            const currentFacts = nativeCase && aggregate && versionId
              ? currentMaterialRecognizedFacts(aggregate, versionId, extractedObservations, workspaceRunStale || !workspaceRun)
              : []
            const linkedItemTitles = items
              .filter((item) => item.evidenceDocumentIds.includes(document.id))
              .map((item) => item.title)
            return (
              <div key={document.id}>
                <MaterialCompactRow
                  role="evidence"
                  index={index}
                  document={document}
                  caseId={aggregate?.caseV2.id}
                  versionId={versionId}
                  native={nativeCase}
                  documentIds={documentsByRole.evidence.map((source) => source.id)}
                  actions={actions}
                  facts={nativeCase
                    ? currentFacts.slice(0, 3).map(fact => `${businessFieldLabel(fact.fieldKey, workspaceTemplate)}：${fact.value}（${fact.confirmed ? '已确认' : '待核实'}）`).join('；')
                    : evidence?.parseStatus === 'recognized' ? evidence.recognizedFacts : undefined}
                  linkedItemTitles={linkedItemTitles}
                  onPreview={() => void previewDocument(document.id, document.fileName)}
                  onReclassify={handleMaterialReclassify}
                  onReorder={(fromVersionId, insertIndex) => void handleMaterialReorder('evidence', fromVersionId, insertIndex)}
                  extra={aggregate ? (
                    <details className="mt-1 rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                        原文与关联（{document.parseStatus === 'failed' ? 0 : document.blocks.length} 段）
                      </summary>
                      <div className="mt-1 rounded-lg bg-muted/40 p-2">
                        {(document.parseStatus === 'failed' ? [] : document.blocks).map((block) => (
                          <SourceBlockView key={block.id} document={document} block={block} dense />
                        ))}
                        {document.parseError && <p className="text-xs text-amber-600">{document.parseError}</p>}
                      </div>
                      <div className="mt-2 border-t border-border/50 pt-2">
                        <EvidenceLinkControls aggregate={aggregate} documentVersionId={document.id + '-v1'} actions={workspaceActions} />
                      </div>
                    </details>
                  ) : undefined}
                />
              </div>
            )
          })}
          <MaterialAppendStrip role="evidence" count={documentsByRole.evidence.length} onInsert={(fromVersionId, insertIndex) => void handleMaterialReorder('evidence', fromVersionId, insertIndex)} />
        </div>
      </section>
      {materialReclassifyDialog}
      {workspaceRunStale && (
        <p className="mx-3 mb-3 rounded-lg border border-amber-500/40 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          人工事实或证明关联已修改，当前审核结果已过期；请重新审核后再形成决定。
        </p>
      )}
    </div>
  )
}

function SubjectAdjudicationCard({
  aggregate,
  subject,
  template,
  canEdit,
  actions,
}: {
  aggregate: CaseAggregateV2
  subject: CaseAggregateV2['caseV2']['subjects'][number]
  template: TemplateVersion | null
  canEdit: boolean
  actions: ReturnType<typeof useReviewWorkspaceActions>
}): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const editorSubject = useAtomValue(reviewAdjudicationEditorSubjectAtom)
  const setEditorSubject = useSetAtom(reviewAdjudicationEditorSubjectAtom)
  const records = aggregate.adjudications ?? []
  const supersededIds = new Set(records.flatMap((record) => record.supersedesAdjudicationId ? [record.supersedesAdjudicationId] : []))
  const current = records.filter((record) => record.subjectId === subject.id && !supersededIds.has(record.id)).sort((a, b) => a.at.localeCompare(b.at)).at(-1)
  const [editing, setEditing] = React.useState(false)
  const [reason, setReason] = React.useState('')
  const [values, setValues] = React.useState<Record<string, string>>(() => initialSubjectValues(subject.fields, current?.finalFields))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dialogOutcome, setDialogOutcome] = React.useState<'accepted' | 'rejected' | null>(null)
  const specs = editableSubjectFields(subject.fields, template)

  React.useEffect(() => {
    if (editorSubject !== subject.id) return
    setValues(initialSubjectValues(subject.fields, current?.finalFields))
    setReason('')
    setEditing(true)
    setEditorSubject(null)
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }, [editorSubject, subject.id, subject.fields, current?.id, current?.finalFields, setEditorSubject])

  const submit = async (outcome: 'accepted' | 'rejected' | 'modified', finalFields?: Record<string, FieldValue>, why?: string): Promise<void> => {
    if (!canEdit || busy) return
    if (!why) { setDialogOutcome(outcome === 'modified' ? 'accepted' : outcome); return }
    const explanation = why
    setBusy(true)
    setError(null)
    try {
      await actions.adjudicateSubject({ subjectId: subject.id, outcome, finalFields, reason: explanation.trim() })
      setEditing(false)
      setReason('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  const saveModified = async (): Promise<void> => {
    if (!reason.trim()) { setError('请填写修改认定理由'); return }
    const finalFields: Record<string, FieldValue> = {}
    for (const field of specs) {
      const value = values[field.key]
      if (value === undefined) continue
      const previous = current?.finalFields?.[field.key] ?? subject.fields[field.key]
      const converted = parseFieldValue(field.kind, value, previous)
      if (converted) finalFields[field.key] = converted
    }
    if (!Object.keys(finalFields).length) { setError('当前模板没有可编辑的最终认定字段'); return }
    await submit('modified', finalFields, reason)
  }

  return (
    <section ref={rootRef} className="mt-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold">最终认定</p>
        {current ? <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs text-green-700 dark:text-green-400">{current.outcome === 'accepted' ? '认可' : current.outcome === 'modified' ? '已修改' : '不予认定'}</span> : <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">待处理</span>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">申报：{displaySubjectFields(subject.fields, template)}</p>
      {current?.outcome === 'accepted' && <p className="mt-1 text-xs">认定：与申报内容一致</p>}
      {current?.outcome === 'rejected' && <p className="mt-1 text-xs text-destructive">认定：不予认定（最终分值 0）</p>}
      {current?.outcome === 'modified' && current.finalFields && <p className="mt-1 text-xs">认定：{displaySubjectFields(current.finalFields, template)}</p>}
      {current && <p className="mt-1 text-xs text-muted-foreground">理由：{current.reason}</p>}
      {!editing ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" disabled={!canEdit || busy} onClick={() => void submit('accepted')} className="rounded border px-2 py-1 text-xs disabled:opacity-40">按核验结果认定</button>
          <button type="button" disabled={!canEdit || busy || specs.length === 0} onClick={() => { setValues(initialSubjectValues(subject.fields, current?.finalFields)); setEditing(true); setError(null) }} className="rounded border px-2 py-1 text-xs disabled:opacity-40">调整认定</button>
          <button type="button" disabled={!canEdit || busy} onClick={() => void submit('rejected')} className="rounded border border-destructive/40 px-2 py-1 text-xs text-destructive disabled:opacity-40">不予认定</button>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {specs.map((field) => <label key={field.key} className="block text-xs">{field.label}
            {field.kind === 'enum' && field.options.length > 0 ? <select value={values[field.key] ?? ''} onChange={(event) => setValues((old) => ({ ...old, [field.key]: event.target.value }))} className="mt-1 h-8 w-full rounded border bg-background px-2">{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input type={field.kind === 'number' ? 'number' : field.kind === 'date' ? 'date' : 'text'} value={values[field.key] ?? ''} onChange={(event) => setValues((old) => ({ ...old, [field.key]: event.target.value }))} className="mt-1 h-8 w-full rounded border bg-background px-2" />}
          </label>)}
          <textarea value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-14 w-full resize-y rounded border bg-background px-2 py-1.5 text-xs" placeholder="修改理由（必填）" aria-label="修改认定理由" />
          {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-1.5"><button type="button" disabled={!canEdit || busy || !reason.trim()} onClick={() => void saveModified()} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50">保存认定</button><button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded border px-2 py-1 text-xs">取消</button></div>
        </div>
      )}
      {dialogOutcome && <ReviewActionDialog
        title={dialogOutcome === 'accepted' ? '确认最终认定' : '不予认定'}
        fields={[{ key: 'reason', label: '认定理由', defaultValue: dialogOutcome === 'accepted' ? '核对材料后确认申报事项' : '依据当前材料不予认定', multiline: true }]}
        onClose={() => setDialogOutcome(null)}
        onSubmit={async ({ reason: explanation }) => submit(dialogOutcome, undefined, explanation!.trim())}
      />}
    </section>
  )
}

function editableSubjectFields(fields: Record<string, FieldValue>, template: TemplateVersion | null): Array<{ key: string; label: string; kind: FieldValue['kind']; options: Array<{ value: string; label: string }> }> {
  const templateFields = (template?.fields ?? []).filter((field) => field.scope !== 'case' && ['text', 'number', 'date', 'enum', 'multi', 'boolean'].includes(field.kind))
  const allowed = new Map(templateFields.map((field) => [field.key, { key: field.key, label: field.label, kind: field.kind, options: field.options ?? [] }]))
  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.has(key) && ['text', 'number', 'date', 'enum', 'multi', 'boolean'].includes(value.kind)) allowed.set(key, { key, label: businessFieldLabel(key, template), kind: value.kind, options: [] })
  }
  return [...allowed.values()]
}

function initialSubjectValues(fields: Record<string, FieldValue>, finalFields?: Record<string, FieldValue>): Record<string, string> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fieldValueText(finalFields?.[key] ?? value)]))
}

function fieldValueText(value: FieldValue): string {
  if ('value' in value) return Array.isArray(value.value) ? value.value.join('、') : String(value.value ?? '')
  return ''
}

function parseFieldValue(kind: FieldValue['kind'], value: string, previous?: FieldValue): FieldValue | undefined {
  if (kind === 'number') {
    const number = Number(value)
    return Number.isFinite(number) ? { kind, value: number, ...((previous?.kind === 'number' && previous.unit) ? { unit: previous.unit } : {}) } : undefined
  }
  if (kind === 'multi') return { kind, value: value.split(/[，,、]/).map((item) => item.trim()).filter(Boolean) }
  if (kind === 'boolean') return { kind, value: value === 'true' }
  if (kind === 'date') return { kind, value }
  if (kind === 'enum') return { kind, value }
  return kind === 'text' ? { kind, value } : undefined
}

function displaySubjectFields(fields: Record<string, FieldValue>, template: TemplateVersion | null): string {
  const entries = Object.entries(fields).filter(([, value]) => !['object', 'rows', 'attachment'].includes(value.kind)).slice(0, 4)
  return entries.map(([key, value]) => `${businessFieldLabel(key, template)} ${fieldValueText(value)}`).join(' / ') || '暂无可展示字段'
}

function businessFieldLabel(key: string, template: TemplateVersion | null): string {
  const configured = template?.fields.find((field) => field.key === key)?.label
  if (configured) return configured
  return ({ level: '获奖等级', declaredScore: '申报分值', score: '申报分值', activityDate: '活动日期', organizer: '主办单位', category: '事项类别', title: '事项名称' } as Record<string, string>)[key] ?? '补充信息'
}

function displayValue(raw: unknown): string {
  if (raw && typeof raw === 'object' && 'value' in raw) return String((raw as { value: unknown }).value ?? '')
  return raw == null ? '' : String(raw)
}

function ManualFactEntry({
  subjectId,
  subjectTitle,
  subjectFields,
  template,
  aggregate,
  onSave,
}: {
  subjectId: string
  subjectTitle: string
  subjectFields: Record<string, FieldValue>
  template: TemplateVersion | null
  aggregate: CaseAggregateV2
  onSave(fieldKey: string, value: string, sourceVersionId: string, reason: string): Promise<void>
}): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [fieldKey, setFieldKey] = React.useState('')
  const [value, setValue] = React.useState('')
  const [sourceVersionId, setSourceVersionId] = React.useState(aggregate.caseV2.documents.find((doc) => doc.role === 'evidence')?.versionId ?? '')
  const [reason, setReason] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const fields = editableSubjectFields(subjectFields, template)
  const selectedField = fields.find((field) => field.key === fieldKey)
  const save = async (): Promise<void> => {
    if (!fieldKey.trim() || !value.trim() || !reason.trim()) return
    setBusy(true)
    try {
      await onSave(fieldKey.trim(), value.trim(), sourceVersionId, reason.trim())
      setOpen(false); setFieldKey(''); setValue(''); setReason('')
    } catch (error) {
      console.error(`[审核工作台] 手工录入 ${subjectTitle} 事实失败`, error)
    } finally { setBusy(false) }
  }
  return (
    <div className="pt-1">
      {!open ? <button onClick={() => setOpen(true)} className="rounded border px-2 py-1 text-xs hover:bg-background">手工录入事实</button> : (
        <div className="space-y-1.5 rounded-lg border bg-background p-2">
          <p className="text-xs font-medium">为“{subjectTitle}”添加人工核实事实</p>
          <label className="block text-xs">事实类型<select value={fieldKey} onChange={(event) => { setFieldKey(event.target.value); setValue('') }} className="mt-1 h-8 w-full rounded border bg-background px-2" aria-label="事实类型"><option value="">请选择事实类型</option>{fields.map((field) => <option key={field.key} value={field.key}>{field.label}</option>)}</select></label>
          <label className="block text-xs">核验结果{selectedField?.kind === 'enum' && selectedField.options.length > 0
            ? <select value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 h-8 w-full rounded border bg-background px-2">{selectedField.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            : <input value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 h-8 w-full rounded border px-2" placeholder="填写核验结果" aria-label="核验结果" />}</label>
          <select value={sourceVersionId} onChange={(event) => setSourceVersionId(event.target.value)} className="h-7 w-full rounded border bg-background px-2" aria-label="事实来源材料">
            <option value="">不关联材料来源</option>
            {aggregate.caseV2.documents.map((doc) => <option key={doc.versionId} value={doc.versionId}>{doc.fileName}</option>)}
          </select>
          <input value={reason} onChange={(event) => setReason(event.target.value)} className="h-7 w-full rounded border px-2" placeholder="核实理由（必填）" aria-label="核实理由" />
          <div className="flex gap-1.5">
            <button disabled={busy || !fieldKey.trim() || !value.trim() || !reason.trim()} onClick={() => void save()} className="rounded bg-primary px-2 py-1 text-primary-foreground disabled:opacity-50">保存事实</button>
            <button disabled={busy} onClick={() => setOpen(false)} className="rounded border px-2 py-1">取消</button>
          </div>
        </div>
      )}
    </div>
  )
}

function WorkspaceObservationCard({
  observation,
  aggregate,
  template,
  onConfirm,
}: {
  observation: Record<string, unknown>
  aggregate: CaseAggregateV2
  template: TemplateVersion | null
  onConfirm(value: unknown, reason: string): Promise<void>
}): React.ReactElement {
  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState(displayValue(observation.value))
  const [reason, setReason] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const subjectId = String(observation.subjectId ?? '')
  const fieldKey = String(observation.fieldKey ?? '事实')
  const fieldLabel = businessFieldLabel(fieldKey, template)
  const refs = Array.isArray(observation.sourceRefs) ? observation.sourceRefs : []
  const sourceNames = refs.flatMap((raw) => {
    if (!raw || typeof raw !== 'object' || !('documentVersionId' in raw)) return []
    const doc = aggregate.caseV2.documents.find((item) => item.versionId === String((raw as { documentVersionId: unknown }).documentVersionId))
    return doc ? [doc.fileName] : []
  })
  const confirmed = observation.confirmed === true || observation.extractedBy === 'user'
  const run = async (nextValue: unknown, nextReason: string): Promise<void> => {
    setBusy(true)
    try {
      await onConfirm(nextValue, nextReason)
      setEditing(false)
      setReason('')
    } catch (error) {
      console.error('[审核工作台] 保存事实失败', error)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="rounded-lg bg-muted/35 px-2.5 py-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{fieldLabel} · 材料识别结果</span>
        <span className={cn('rounded px-1.5 py-0.5 text-xs', confirmed ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400')}>
          {confirmed ? '人工确认' : `待确认${typeof observation.confidence === 'number' ? ` · ${Math.round(observation.confidence * 100)}%` : ''}`}
        </span>
      </div>
      {!editing ? <p className="mt-1 text-foreground">{displayValue(observation.value) || '未识别'}</p> : (
        <div className="mt-1.5 space-y-1.5">
          <input className="h-7 w-full rounded border bg-background px-2" value={value} onChange={(event) => setValue(event.target.value)} aria-label={`${fieldLabel}核验结果`} />
          <input className="h-7 w-full rounded border bg-background px-2" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="更正理由（必填）" aria-label="更正理由" />
          <div className="flex gap-1.5">
            <button disabled={busy || !reason.trim()} onClick={() => void run(value, reason)} className="rounded bg-primary px-2 py-1 text-primary-foreground disabled:opacity-50">保存更正</button>
            <button disabled={busy} onClick={() => setEditing(false)} className="rounded border px-2 py-1">取消</button>
          </div>
        </div>
      )}
      {sourceNames.length > 0 && <p className="mt-1 text-muted-foreground">来源：{[...new Set(sourceNames)].join('、')}</p>}
      {!confirmed && !editing && (
        <div className="mt-1.5 flex gap-1.5">
          <button disabled={busy} onClick={() => void run(observation.value, '审核员核对原始材料后确认该识别结果')} className="rounded border px-2 py-1 text-xs hover:bg-background disabled:opacity-50">识别正确</button>
          <button disabled={busy} onClick={() => { setValue(displayValue(observation.value)); setEditing(true) }} className="rounded border px-2 py-1 text-xs hover:bg-background disabled:opacity-50">识别有误</button>
        </div>
      )}
    </div>
  )
}

function EvidenceLinkControls({
  aggregate,
  documentVersionId,
  actions,
}: {
  aggregate: CaseAggregateV2
  documentVersionId: string
  actions: ReturnType<typeof useReviewWorkspaceActions>
}): React.ReactElement {
  const [subjectId, setSubjectId] = React.useState(aggregate.caseV2.subjects[0]?.id ?? '')
  const [busy, setBusy] = React.useState(false)
  const links = aggregate.evidenceLinks.filter((link) => link.documentVersionId === documentVersionId)
  const doc = aggregate.caseV2.documents.find((item) => item.versionId === documentVersionId)
  const titles = new Map(aggregate.caseV2.subjects.map((subject) => [subject.id, subject.title]))
  const update = async (input: Parameters<typeof actions.transitionEvidenceLink>[0]): Promise<void> => {
    setBusy(true)
    try { await actions.transitionEvidenceLink(input) } catch (error) { console.error('[审核工作台] 更新证明关联失败', error) } finally { setBusy(false) }
  }
  return (
    <div className="mt-1 rounded-lg border border-border/50 bg-card px-2.5 py-2 text-xs">
      {links.map((link) => (
        <div key={link.id} className="flex items-center justify-between gap-2 py-1">
          <span className="min-w-0 truncate">{titles.get(link.subjectId) ?? link.subjectId} · {link.supportsFact} <span className="text-muted-foreground">({link.status === 'candidate' ? '待确认' : link.status === 'confirmed' ? '已确认' : '已取消'})</span></span>
          {link.status !== 'rejected' && <button disabled={busy} title={link.status === 'candidate' ? '确认关联' : '取消关联'} onClick={() => void update({ id: link.id, documentVersionId, subjectId: link.subjectId, supportsFact: link.supportsFact, status: link.status === 'candidate' ? 'confirmed' : 'rejected' })} className="shrink-0 rounded border p-1 hover:bg-muted disabled:opacity-50">{link.status === 'candidate' ? <Link2 size={13} /> : <Unlink2 size={13} />}</button>}
        </div>
      ))}
      <div className="mt-1 flex gap-1.5">
        <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="min-w-0 flex-1 rounded border bg-background px-1.5 py-1" aria-label="关联到申报事项">
          {aggregate.caseV2.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.title}</option>)}
        </select>
        <button disabled={busy || !subjectId || !doc} onClick={() => void update({ documentVersionId, subjectId, supportsFact: doc?.fileName ?? '人工关联证明', status: 'confirmed' })} className="inline-flex shrink-0 items-center gap-1 rounded border px-2 py-1 hover:bg-muted disabled:opacity-50"><Link2 size={12} />添加证明</button>
      </div>
    </div>
  )
}

/**
 * 紧凑材料行：手柄 + 文件名（可预览）+ 真实解析状态 + 更多菜单。
 * 不显示旧 EvidenceDocument.unrecognized 默认徽标（该字段未回写，不能当作“AI 未读/未识别”）。
 */
function MaterialCompactRow({
  role, index, document, caseId, versionId, native, documentIds, actions,
  facts, linkedItemTitles, onPreview, onReclassify, onReorder, extra,
}: {
  role: import('@profer/shared').SourceDocument['role']
  index: number
  document: import('@profer/shared').SourceDocument
  caseId?: string
  versionId?: string
  native: boolean
  documentIds: string[]
  actions: ReviewActions
  facts?: string
  linkedItemTitles?: string[]
  onPreview: () => void
  onReclassify: (drag: ReviewMaterialDragData, role: import('@profer/shared').SourceDocument['role']) => Promise<void>
  onReorder: (fromVersionId: string, insertIndex: number) => void
  extra?: React.ReactNode
}): React.ReactElement {
  const drop = useMaterialRowDropTarget({ role, index, onInsert: onReorder })
  const status = document.parseStatus === 'failed' ? '解析失败' : document.parseStatus === 'partial' ? '部分解析' : '已解析'
  return (
    <div
      data-material-row={document.id}
      data-material-role={role}
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
      onDrop={drop.onDrop}
    >
      <MaterialInsertionLine visible={drop.insertion} />
      <div className="flex min-w-0 items-center gap-1 rounded-md bg-muted/40 px-1.5 py-1">
        {native && caseId && versionId
          ? <ReviewMaterialDragHandle caseId={caseId} documentVersionId={versionId} fileName={document.fileName} role={role} />
          : null}
        <button type="button" onClick={onPreview} className="min-w-0 flex-1 truncate text-left text-xs hover:text-primary" title={`预览原件：${document.fileName}`}>{document.fileName}</button>
        <span className={document.parseStatus === 'failed' ? 'shrink-0 text-[11px] text-amber-600' : 'shrink-0 text-[11px] text-muted-foreground'}>{status}</span>
        <MoveReviewDocumentButtons
          role={role}
          documentIds={documentIds}
          documentId={document.id}
          actions={actions}
          fileName={document.fileName}
          native={native}
          onPreview={onPreview}
          onReclassify={native && caseId && versionId ? (nextRole) => onReclassify({ caseId, documentVersionId: versionId }, nextRole) : undefined}
          removeSlot={<RemoveReviewDocumentButton document={document} actions={actions} />}
        />
      </div>
      {facts && <p className="mt-1 line-clamp-2 px-1 text-[11px] leading-4 text-muted-foreground">{facts}</p>}
      {linkedItemTitles?.length ? <p className="mt-0.5 truncate px-1 text-[11px] text-muted-foreground">关联条目：{linkedItemTitles.join('、')}</p> : null}
      {extra}
    </div>
  )
}
