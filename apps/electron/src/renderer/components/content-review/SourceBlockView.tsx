/**
 * SourceBlockView — 结构化原文块渲染器（左/中栏共用）
 *
 * 三栏联动（D8）的落点组件：
 * - 每个块渲染为一个带 data-block-id 的 DOM 节点，供定位查询
 * - 订阅 reviewFocusAtom：命中自己这块（blockId 相同）→ scrollIntoView 居中 + 闪高亮 2.5 秒
 * - 订阅 reviewRuleLocateAtom：左栏大纲点击 → 命中的块闪蓝色高亮（severity 不含 blue，故独立通道）
 * - 锚点精度降级（page/document）：命中时显示"仅定位到此文件/页"角标
 *
 * 高亮语义色：红=申报冲突、黄=待处理、蓝=依据原文（与设计文档 §"点击问题卡的联动规则"一致）。
 */

import * as React from 'react'
import { useAtomValue } from 'jotai'
import { FileText } from 'lucide-react'
import type {
  ReviewAnchorPrecision,
  ReviewDocumentBlock,
  ReviewSourceAnchor,
  SourceDocument,
} from '@profer/shared'
import { FilePreviewDialog } from '@/components/file-browser/FilePreviewDialog'
import { reviewCaseAtom, reviewFocusAtom, reviewRuleLocateAtom } from '@/atoms/review-atoms'
import { cn } from '@/lib/utils'

/** 高亮颜色（三色均带 ring 与圆角，过渡用 transition-all） */
const HIGHLIGHT_CLASSES: Record<'red' | 'yellow' | 'blue', string> = {
  red: 'bg-red-500/20 ring-1 ring-red-500/60',
  yellow: 'bg-amber-400/20 ring-1 ring-amber-500/60',
  blue: 'bg-blue-500/20 ring-1 ring-blue-500/60',
}

/** 高亮持续时间（毫秒） */
const HIGHLIGHT_DURATION_MS = 2500

/** 精度降级角标文案 */
function precisionLabel(precision: ReviewAnchorPrecision): string {
  if (precision === 'page') return '仅定位到此页'
  if (precision === 'document') return '仅定位到此文件'
  return ''
}

interface SourceBlockViewProps {
  /** 所属文档（提供 ID 与块 ID 匹配） */
  document: SourceDocument
  /** 要渲染的结构化块 */
  block: ReviewDocumentBlock
  /** 外部可强制指定的高亮色（缺省由组件订阅 focus 自行判定） */
  highlight?: 'red' | 'yellow' | 'blue' | null
  /** 外部可强制指定的锚点精度（用于降级角标；缺省取 block 级） */
  anchorPrecision?: ReviewAnchorPrecision
  /** 渲染密度：紧凑用于中栏原文行，普通用于左栏规则全文 */
  dense?: boolean
}

export function SourceBlockView({
  document,
  block,
  highlight,
  anchorPrecision,
  dense = false,
}: SourceBlockViewProps): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const focus = useAtomValue(reviewFocusAtom)
  const ruleLocate = useAtomValue(reviewRuleLocateAtom)
  const reviewCase = useAtomValue(reviewCaseAtom)

  // 派生：本块是否命中某条定位请求，以及命中哪一路（focus / 规则定位）。
  // 返回命中锚点本身，精度降级角标要读它的 precision。
  const focusHitAnchor = React.useMemo(() => {
    if (!focus) return undefined
    return hitAnchor(focus.subjectAnchor, document.id, block.id)
      ? focus.subjectAnchor
      : hitAnchor(focus.evidenceAnchor, document.id, block.id)
        ? focus.evidenceAnchor
        : hitAnchor(focus.counterpartAnchor, document.id, block.id)
          ? focus.counterpartAnchor
          : hitAnchor(focus.ruleAnchor, document.id, block.id)
            ? focus.ruleAnchor
            : undefined
  }, [block.id, document.id, focus])

  const ruleHitAnchor = React.useMemo(() => {
    if (!ruleLocate) return undefined
    return ruleLocate.anchors.find((anchor) => hitAnchor(anchor, document.id, block.id))
  }, [block.id, document.id, ruleLocate])

  // 临时高亮状态（2.5 秒后自动清除）
  const [activeHighlight, setActiveHighlight] = React.useState<'red' | 'yellow' | 'blue' | null>(null)
  const [precisionBadge, setPrecisionBadge] = React.useState<string | null>(null)
  const [imagePreview, setImagePreview] = React.useState<{ path: string; url: string; fileName: string } | null>(null)
  const [largeImageOpen, setLargeImageOpen] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (block.kind !== 'image' || !reviewCase?.id) {
      setImagePreview(null)
      return
    }
    let active = true
    const fileName = block.imageAssetPath?.split(/[\\/]/).pop() || document.fileName
    void window.reviewAPI.getImagePreviewPath({ caseId: reviewCase.id, documentId: document.id, blockId: block.id })
      .then(async (path) => {
        if (!path) return
        const url = await window.electronAPI.registerPreviewPath(path)
        if (active && url) setImagePreview({ path, url, fileName })
      })
      .catch((error) => console.warn('[审核专区] 图片缩略图加载失败', error))
    return () => { active = false }
  }, [block.id, block.imageAssetPath, block.kind, document.fileName, document.id, reviewCase?.id])

  // 焦点定位 + 高亮：focus nonce 变化 或 规则定位 nonce 变化 时触发。
  // 用拼接字符串做依赖键：任一 nonce 变化即重新执行（同块重复点击也能再次闪）。
  const triggerKey = `${focus?.nonce ?? 0}:${ruleLocate?.nonce ?? 0}:${focusHitAnchor ? 1 : 0}:${ruleHitAnchor ? 1 : 0}`

  React.useEffect(() => {
    if (!focusHitAnchor && !ruleHitAnchor) return

    // M0/H07：问题卡命中的"依据侧"锚点恒为蓝色（设计 §8：左栏校规定位始终蓝）；
    // 仅申报/证明侧锚点按问题严重度红/黄
    const hitIsRuleSide = focusHitAnchor !== undefined && focusHitAnchor === focus?.ruleAnchor
    const color: 'red' | 'yellow' | 'blue' = focusHitAnchor
      ? (hitIsRuleSide ? 'blue' : (focus?.severity ?? 'red'))
      : 'blue'
    // 命中的那个锚点（精度降级角标用它；两路都命中时以问题卡侧为准）
    const targetAnchor = focusHitAnchor ?? ruleHitAnchor

    // 1) 滚动到视口中央（scrollIntoView 在最近滚动容器内生效）。
    //    等一帧：若是首次挂载/切换可见栏，先让布局稳定再滚动
    const frame = requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    // 2) 闪高亮（2.5 秒后清除）
    setActiveHighlight(color)

    // 3) 精度降级角标：非 block 级锚点显示"仅定位到此文件/页"
    const precision = targetAnchor?.precision ?? anchorPrecision ?? 'block'
    setPrecisionBadge(precision === 'block' ? null : precisionLabel(precision))

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveHighlight(null)
      setPrecisionBadge(null)
      timerRef.current = null
    }, HIGHLIGHT_DURATION_MS)

    return () => {
      cancelAnimationFrame(frame)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    // triggerKey 是本 effect 的唯一触发信号（拼接字符串依赖，见上方注释）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey])

  // 卸载兜底：清理未完成的定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // 外部强制 highlight 优先于内部判定
  const effectiveHighlight = highlight !== undefined ? highlight : activeHighlight

  const text = block.text || block.imageAlt || ''

  return (
    <div
      ref={rootRef}
      data-block-id={block.id}
      data-source-document-id={document.id}
      className={cn(
        'relative rounded-md transition-all duration-200',
        dense ? 'px-2 py-1' : 'px-3 py-1.5',
        effectiveHighlight && HIGHLIGHT_CLASSES[effectiveHighlight],
      )}
    >
      {block.kind === 'heading' ? (
        <p className={cn('font-semibold text-foreground', dense ? 'text-sm' : 'text-sm')}>{text}</p>
      ) : block.kind === 'image' ? (
        <div className="flex items-start gap-2 text-sm leading-6 text-foreground/80">
          {imagePreview ? (
            <button type="button" onClick={() => setLargeImageOpen(true)} title="点击查看大图" aria-label={`预览图片：${imagePreview.fileName}`} className="shrink-0 overflow-hidden rounded border border-border/60 bg-background p-1 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <img src={imagePreview.url} alt={block.imageAlt || imagePreview.fileName} className="max-h-32 max-w-28 object-contain" />
            </button>
          ) : (
            <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded border border-border/60 bg-background text-muted-foreground"><FileText size={18} /></div>
          )}
          <span className="min-w-0 whitespace-pre-wrap break-words">{text || `图片 · ${block.page ? `第 ${block.page} 页` : document.fileName}`}</span>
          {imagePreview && <FilePreviewDialog open={largeImageOpen} filePath={imagePreview.path} fileName={imagePreview.fileName} onClose={() => setLargeImageOpen(false)} />}
        </div>
      ) : (
        <p
          className={cn(
            'whitespace-pre-wrap break-words text-foreground/80',
            dense ? 'font-mono text-xs leading-5' : 'text-sm leading-6',
            block.kind === 'list-item' && 'pl-3 relative before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-muted-foreground/50',
          )}
        >
          {text}
        </p>
      )}

      {/* 精度降级角标：解析器给不到块级坐标时明示"仅定位到此页/文件"（title 同步提示） */}
      {precisionBadge && (
        <span
          title={precisionBadge}
          className="absolute -top-2 right-1 rounded bg-muted px-1 py-0.5 text-xs leading-3 text-muted-foreground shadow-sm"
        >
          {precisionBadge}
        </span>
      )}
    </div>
  )
}

/** 判定锚点是否指向该文档的该块（块级精确匹配；缺 blockId 时按文档级命中） */
function hitAnchor(
  anchor: ReviewSourceAnchor | undefined,
  documentId: string,
  blockId: string,
): boolean {
  if (!anchor) return false
  if (anchor.documentId !== documentId) return false
  if (!anchor.blockId) return anchor.precision !== 'block'
  return anchor.blockId === blockId
}
