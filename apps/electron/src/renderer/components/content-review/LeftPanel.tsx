/**
 * LeftPanel — 左栏「审核依据」
 *
 * 结构：
 * - 顶部：当前审核依据和规则内容
 * - 头部：栏目名 + 规则文档名
 * - 规则文档全文（SourceBlockView 列表，只读；问题卡/大纲定位的蓝色高亮落点）
 * - AI 规则大纲区：生成按钮（busy 时 spinner）→ RuleOutlineList
 * - 底部：规则包元数据（发布单位 / 适用学年 / 版本）
 */

import * as React from 'react'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'
import { BookOpen, FileText, LoaderCircle, ShieldCheck, Trash2, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@profer/ui/primitives/dialog'
import {
  documentsByRoleAtom,
  reviewCaseAtom,
  reviewRuleLocateAtom,
  reviewWorkspaceTemplateAtom,
} from '@/atoms/review-atoms'
import type { ReviewActions } from './use-review-actions'
import { RuleOutlineList } from './RuleOutlineList'
import { SourceBlockView } from './SourceBlockView'
import { ReviewV3SourceNavigator } from './ReviewV3SourceNavigator'
import { MoveReviewDocumentButtons, RemoveReviewDocumentButton, ReviewMaterialLaneActions } from './ReviewMaterialControls'

interface LeftPanelProps {
  actions: ReviewActions
}

export function LeftPanel({ actions }: LeftPanelProps): React.ReactElement {
  const reviewCase = useAtomValue(reviewCaseAtom)
  const documentsByRole = useAtomValue(documentsByRoleAtom)
  const ruleLocate = useAtomValue(reviewRuleLocateAtom)
  const template = useAtomValue(reviewWorkspaceTemplateAtom)
  const documentDetails = React.useRef(new Map<string, HTMLDetailsElement>())
  const [manualRules, setManualRules] = React.useState<import('@profer/shared').ManualReviewRule[]>([])
  const [manualDialogOpen, setManualDialogOpen] = React.useState(false)
  const [manualTitle, setManualTitle] = React.useState('')
  const [manualRequirement, setManualRequirement] = React.useState('')
  const [savingManual, setSavingManual] = React.useState(false)
  const [draggingRules, setDraggingRules] = React.useState(false)
  const [importingDroppedRules, setImportingDroppedRules] = React.useState(false)
  const manualRulesCaseId = React.useRef<string | null>(null)
  const ruleDragCounter = React.useRef(0)

  const ruleDocuments = documentsByRole.rule
  const rulePacks = reviewCase?.rulePacks ?? []

  React.useEffect(() => {
    if (manualRulesCaseId.current === reviewCase?.id) return
    manualRulesCaseId.current = reviewCase?.id ?? null
    setManualRules(reviewCase?.manualRules ?? [])
  }, [reviewCase?.id])

  const saveManualRules = async (next: import('@profer/shared').ManualReviewRule[], successText: string): Promise<boolean> => {
    setSavingManual(true)
    try {
      const ok = await actions.updateReviewSetup({ manualRules: next })
      if (ok) {
        setManualRules(next)
        toast.success(successText)
      } else {
        toast.error('保存手写依据失败，请查看页面提示')
      }
      return ok
    } finally {
      setSavingManual(false)
    }
  }

  const addManualBasis = async (): Promise<void> => {
    if (!manualTitle.trim() || !manualRequirement.trim()) {
      toast.error('请填写依据名称和具体要求')
      return
    }
    const next = [...manualRules, {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: manualTitle.trim(),
      requirement: manualRequirement.trim(),
    }]
    if (await saveManualRules(next, '手写审核依据已添加')) {
      setManualTitle('')
      setManualRequirement('')
      setManualDialogOpen(false)
    }
  }

  const saveOutlineItem = async (packId: string, input: { id: string; title: string; summary: string }): Promise<boolean> => {
    const ok = await actions.updateRuleOutline({ rulePackId: packId, ruleId: input.id, title: input.title, summary: input.summary })
    if (ok) toast.success('规则摘要已更新')
    else toast.error('保存规则摘要失败，请查看页面提示')
    return ok
  }

  const importDroppedRules = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()
    setDraggingRules(false)
    ruleDragCounter.current = 0
    if (!reviewCase || importingDroppedRules) return

    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return

    const paths: string[] = []
    for (const file of files) {
      try {
        const path = window.electronAPI.getPathForFile(file)
        if (path) paths.push(path)
      } catch { /* 无法取得本地路径的拖入项会在下方提示 */ }
    }
    if (paths.length === 0) {
      toast.error('无法读取拖入文件的本地路径，请点击“上传依据”选择文件')
      return
    }

    setImportingDroppedRules(true)
    let imported = 0
    try {
      for (const path of paths) {
        if (await actions.importDocumentFromPath('rule', path)) imported += 1
      }
      if (imported > 0) toast.success(`已添加 ${imported} 份审核依据文件`)
      if (imported < paths.length) toast.error(`${paths.length - imported} 份文件未能导入，请查看页面提示`)
    } finally {
      setImportingDroppedRules(false)
    }
  }

  React.useEffect(() => {
    if (!ruleLocate) return
    const target = ruleLocate.anchors.find((anchor) => documentDetails.current.has(anchor.documentId))
    if (target) documentDetails.current.get(target.documentId)!.open = true
  }, [ruleLocate?.nonce])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto scrollbar-thin">
      {/* 头部 */}
      <header className="shrink-0 border-b border-border/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <BookOpen size={16} className="shrink-0 text-blue-500" />
            <h2 className="truncate text-sm font-semibold text-foreground">审核依据</h2>
          </div>
          <ReviewMaterialLaneActions role="rule" documentIds={ruleDocuments.map((document) => document.id)} actions={actions} onAddManual={() => setManualDialogOpen(true)} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText size={12} className="shrink-0" />
          <span className="truncate">{ruleDocuments.length} 份文件 · {manualRules.length} 条手写依据</span>
        </p>
      </header>

      <ReviewV3SourceNavigator purpose="rule" />

      {template && (template.sections ?? []).some((section) => section.criteria.length > 0) && (
        <section className="shrink-0 px-3 pt-3">
          <details className="rounded-lg border border-primary/20 bg-primary/[0.025]">
            <summary className="cursor-pointer px-3 py-2 text-xs font-semibold">
              {template.name} · 审核标准（{(template.sections ?? []).reduce((sum, section) => sum + section.criteria.length, 0)}）
            </summary>
            <div className="space-y-2 border-t border-border/50 px-3 py-2">
              {(template.sections ?? []).slice().sort((a, b) => a.order - b.order).map((section) => section.criteria.length > 0 && (
                <div key={section.id}>
                  <p className="mb-1 text-xs font-medium">{section.name}</p>
                  <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
                    {section.criteria.map((criterion) => (
                      <li key={criterion.id}>
                        <span className="font-medium text-foreground">{criterion.title}</span>
                        {criterion.requirement ? `：${criterion.requirement}` : ''}
                        <span className="ml-1 text-[10px]">({criterion.execution === 'semantic' ? 'Agent' : criterion.execution === 'deterministic' ? '程序' : '人工'})</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </details>
        </section>
      )}

      {/* 规则文档全文（SourceBlockView 列表，只读；蓝色高亮定位落点） */}
      {ruleDocuments.map((ruleDocument) => {
        const blocks = ruleDocument.parseStatus === 'failed' ? [] : ruleDocument.blocks
        return (
          <section key={ruleDocument.id} className="shrink-0 px-3 py-3">
            <div className="flex items-center gap-1 pb-2">
              <p className="min-w-0 flex-1 truncate px-1 text-xs font-semibold text-muted-foreground" title={ruleDocument.fileName}>
                依据原文 · {ruleDocument.fileName}
              </p>
              <MoveReviewDocumentButtons role="rule" documentIds={ruleDocuments.map((document) => document.id)} documentId={ruleDocument.id} actions={actions} />
              <RemoveReviewDocumentButton document={ruleDocument} actions={actions} />
            </div>
            <details ref={(element) => {
              if (element) documentDetails.current.set(ruleDocument.id, element)
              else documentDetails.current.delete(ruleDocument.id)
            }} className="rounded-lg border border-border/60 bg-card p-1 shadow-sm">
              <summary className="cursor-pointer rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50">查看原文（{blocks.length} 段）</summary>
              <div className="mt-1 max-h-[48vh] space-y-0.5 overflow-y-auto scrollbar-thin">
                {blocks.map((block) => (
                  <SourceBlockView key={block.id} document={ruleDocument} block={block} />
                ))}
              </div>
            </details>
            {ruleDocument.parseError && <p className="mt-2 text-xs text-amber-600">{ruleDocument.parseError}</p>}
          </section>
        )
      })}
      <div
        role="region"
        aria-label="拖入审核依据文件"
        onDragEnter={(event) => { event.preventDefault(); event.stopPropagation(); ruleDragCounter.current += 1; setDraggingRules(true) }}
        onDragOver={(event) => { event.preventDefault(); event.stopPropagation() }}
        onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); ruleDragCounter.current = Math.max(0, ruleDragCounter.current - 1); if (ruleDragCounter.current === 0) setDraggingRules(false) }}
        onDrop={(event) => void importDroppedRules(event)}
        className={[
          'mx-3 mt-3 flex shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed px-3 text-center transition-colors',
          ruleDocuments.length === 0 && manualRules.length === 0 ? 'min-h-20 py-4' : 'min-h-12 py-2',
          draggingRules ? 'border-primary bg-primary/5 text-primary' : 'border-border/70 text-muted-foreground',
          importingDroppedRules ? 'opacity-70' : '',
        ].join(' ')}
      >
        {importingDroppedRules ? <LoaderCircle size={15} className="shrink-0 animate-spin" /> : <Upload size={15} className="shrink-0" />}
        <div className="min-w-0">
          <p className="text-xs font-medium">{importingDroppedRules ? '正在导入依据文件…' : draggingRules ? '松手添加为审核依据' : '将文件拖到这里添加审核依据'}</p>
          {!draggingRules && !importingDroppedRules && <p className="mt-0.5 text-xs">也可点击上方“上传依据”选择文件；手写要求请点“添加依据”</p>}
        </div>
      </div>

      {manualRules.length > 0 && (
        <section className="shrink-0 px-3 py-2">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold  text-muted-foreground">手写审核依据</p>
            <span className="text-xs text-muted-foreground">本案可编辑</span>
          </div>
          <div className="space-y-2">
            {manualRules.map((rule, index) => (
              <details key={rule.id} className="group rounded-lg border border-border/60 bg-card">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{rule.title || `手写依据 ${index + 1}`}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">展开查看 / 编辑</span>
                </summary>
                <div className="border-t border-border/50 p-2.5">
                  <input aria-label={`手写依据 ${index + 1} 名称`} value={rule.title} maxLength={160} disabled={savingManual} onChange={(event) => setManualRules((current) => current.map((item) => item.id === rule.id ? { ...item, title: event.target.value } : item))} className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs font-medium" />
                  <textarea aria-label={`手写依据 ${index + 1} 内容`} value={rule.requirement} maxLength={8000} rows={4} disabled={savingManual} onChange={(event) => setManualRules((current) => current.map((item) => item.id === rule.id ? { ...item, requirement: event.target.value } : item))} className="mt-1.5 w-full resize-y rounded border border-input bg-background px-2 py-1.5 text-xs leading-5" />
                  <div className="mt-1.5 flex justify-end gap-1.5">
                    <button type="button" disabled={savingManual} onClick={() => void saveManualRules(manualRules.filter((item) => item.id !== rule.id), '手写依据已删除')} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"><Trash2 size={11} />删除</button>
                    <button type="button" disabled={savingManual || !rule.title.trim() || !rule.requirement.trim()} onClick={() => void saveManualRules(manualRules, '手写依据已保存')} className="rounded bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50">保存修改</button>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 规则摘要先由审核员对照原文确认，再用于 V2 语义检查。 */}
      <section className="shrink-0 px-3 pb-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="text-xs font-semibold  text-muted-foreground">
            规则摘要
          </p>
        </div>
        {rulePacks.length === 0 && <RuleOutlineList outline={[]} onLocate={actions.locateRuleAnchor} />}
        {rulePacks.map((pack) => (
          <div key={pack.id} className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="truncate text-xs font-medium">{pack.name} · {pack.version}</p>
              <span className={pack.confirmed ? 'shrink-0 text-xs text-green-600 dark:text-green-400' : 'shrink-0 text-xs text-amber-600 dark:text-amber-400'}>{pack.confirmed ? '已确认' : '待对照原文确认'}</span>
            </div>
            <RuleOutlineList outline={pack.outline} onLocate={actions.locateRuleAnchor} onUpdate={(input) => saveOutlineItem(pack.id, input)} />
            {pack.outline.length > 0 && !pack.confirmed && (
              <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-2.5">
                <p className="text-xs leading-4 text-muted-foreground">对照上方原文检查 AI 提取的规则摘要。确认后，这些规则将用于本次审核。</p>
                <button type="button" onClick={() => void actions.confirmRulePack(pack.id)} className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <ShieldCheck size={13} />确认审核依据
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* 底部：规则包元数据 */}
      {rulePacks.length + manualRules.length > 0 && (
        <footer className="mt-auto shrink-0 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
          <p>适用学年：{reviewCase?.academicYear}</p>
          <p className="mt-0.5">共 {rulePacks.length + manualRules.length} 份审核依据；AI 摘要可手动修订。</p>
        </footer>
      )}
      <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>手写审核依据</DialogTitle>
            <DialogDescription>写明需要检查的要求。保存后会和已上传文件、审核模板一起用于本案。</DialogDescription>
          </DialogHeader>
          <label className="grid gap-1.5 text-xs font-medium">依据名称
            <input autoFocus value={manualTitle} onChange={(event) => setManualTitle(event.target.value)} maxLength={160} placeholder="例如：学院补充要求" className="rounded-md border border-input bg-background px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1.5 text-xs font-medium">审核要求
            <textarea value={manualRequirement} onChange={(event) => setManualRequirement(event.target.value)} maxLength={8000} rows={8} placeholder="写清楚审核条件、例外情况和需要核对的内容" className="resize-y rounded-md border border-input bg-background px-3 py-2 text-sm font-normal leading-6" />
          </label>
          <DialogFooter>
            <button type="button" onClick={() => setManualDialogOpen(false)} className="rounded px-3 py-2 text-sm hover:bg-muted">取消</button>
            <button type="button" disabled={savingManual || !manualTitle.trim() || !manualRequirement.trim()} onClick={() => void addManualBasis()} className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">{savingManual ? '保存中…' : '添加依据'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
