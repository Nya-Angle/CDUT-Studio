/**
 * AiClassGraphGenerateModal — AI 速课堂资料树「开始生成」方案选择弹窗
 *
 * 面向完全不懂计算机的普通用户：以通俗文案 + 动态测算展示三档生成方案。
 *   - 方案一：纯本地极速生成（0 Token、秒开、完全免费）；
 *   - 方案二：云端 AI 智能精炼建库（推荐，微量 Token、高性价比）；
 *   - 方案三：云端 AI 全量深度精读建库（终极精度）。
 *
 * 顶部看板展示已解析资料份数、纯文本总字数与知识切块数；
 * 选中态呈现立体微发光边框；底部【取消】与【开始生成】。
 * 状态全量走 Jotai（弹窗开关、估算缓存与当前模式）。
 */

import * as React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Cpu, Loader2, Sparkles, Wand2, Zap } from 'lucide-react'
import type { KnowledgeGraphGenerationMode } from '@profer/shared'
import { Dialog, DialogContent, DialogTitle } from '@profer/ui/primitives/dialog'
import { cn } from '@/lib/utils'
import {
  studyDocumentsAtom,
  studyGraphCostEstimateAtom,
  studyGraphModalOpenAtom,
  studyGraphModeAtom,
} from '@/atoms/study-atoms'

interface AiClassGraphGenerateModalProps {
  sessionId: string
  /** 用户确认后回调，携带选定模式 */
  onConfirm: (mode: KnowledgeGraphGenerationMode) => void
  /** 是否正在生成（生成中禁用确认） */
  updating: boolean
}

/** 千分位/万单位 Token 展示 */
function formatTokens(tokens: number): string {
  if (tokens >= 10_000) return `${(tokens / 10_000).toFixed(1)} 万`
  return tokens.toLocaleString('zh-CN')
}

/** 字符数 → 万字 */
function formatChars(chars: number): string {
  if (chars >= 10_000) return `${(chars / 10_000).toFixed(1)} 万字`
  return `${chars} 字`
}

interface ModeCard {
  mode: KnowledgeGraphGenerationMode
  title: string
  badge: string
  tags: string
  description: string
  /** 消耗与耗时文案（动态或静态） */
  costText: string
  timeText: string
  accent: string
  ring: string
  icon: React.ReactNode
}

export function AiClassGraphGenerateModal({
  sessionId,
  onConfirm,
  updating,
}: AiClassGraphGenerateModalProps): React.ReactElement {
  const documents = useAtomValue(studyDocumentsAtom)
  const [open, setOpen] = useAtom(studyGraphModalOpenAtom)
  const [estimate, setEstimate] = useAtom(studyGraphCostEstimateAtom)
  const [mode, setMode] = useAtom(studyGraphModeAtom)

  // 打开弹窗时动态测算成本（每次打开都重新拉取，确保数据实时）
  React.useEffect(() => {
    if (!open || !sessionId) return
    let alive = true
    window.electronAPI.cdutAiClass
      .estimateGraphCost(sessionId)
      .then((result) => {
        if (alive) setEstimate(result)
      })
      .catch((error) => console.warn('[AI速课堂] 测算生成成本失败:', error))
    return () => {
      alive = false
    }
  }, [open, sessionId, setEstimate])

  // 弹窗关闭时重置选中模式为默认推荐值
  React.useEffect(() => {
    if (!open) setMode('ai_smart')
  }, [open, setMode])

  const cardData: ModeCard[] = React.useMemo(() => {
    const smartTokens = estimate ? formatTokens(estimate.smart.tokens) : '—'
    const smartCost = estimate ? `¥${estimate.smart.costCny.toFixed(2)}` : '¥0.00'
    const smartSeconds = estimate ? `${estimate.smart.estimatedSeconds}` : '15 ~ 25'
    const fullTokens = estimate ? formatTokens(estimate.full.tokens) : '—'
    const fullCost = estimate ? `¥${estimate.full.costCny.toFixed(2)}` : '¥0.00'
    const fullSeconds = estimate ? `${estimate.full.estimatedSeconds}` : '40 ~ 70'

    return [
      {
        mode: 'local_fast',
        title: '纯本地极速生成',
        badge: '日常快速浏览',
        tags: '零网络消耗 · 瞬间完成 · 完全免费',
        description:
          '所有分析完全在您自己的电脑 CPU 上完成，不需要连接云端大模型，完全不消耗您的任何 API 额度。系统将快速根据各章节标题与关键词的关联度，自动梳理出前后章节脉络。',
        costText: '0 Token（¥0.00）',
        timeText: '约 1 秒内（极速秒开）',
        accent: 'text-emerald-600 dark:text-emerald-400',
        ring: 'ring-emerald-500/40 border-emerald-500/50',
        icon: <Zap size={16} />,
      },
      {
        mode: 'ai_smart',
        title: '云端 AI 智能精炼建库',
        badge: '推荐 · 考前突击',
        tags: 'AI 精选考点 · 高性价比 · 微量消耗',
        description:
          '系统会先在本地自动剔除教材前言、致谢、目录等无用套话，只把核心考点章节发送给您配置的 AI 深度思考，推演不同课件/资料之间的“前置必学知识”与“高频对应考题”。',
        costText: `约 ${smartTokens} Tokens · 参考 ${smartCost} 元`,
        timeText: `约 ${smartSeconds} 秒`,
        accent: 'text-violet-600 dark:text-violet-400',
        ring: 'ring-violet-500/40 border-violet-500/50',
        icon: <Wand2 size={16} />,
      },
      {
        mode: 'ai_full',
        title: '云端 AI 全量深度精读建库',
        badge: '终极精度 · 学术研读',
        tags: '无死角拆解 · 终极精度 · 深度解析',
        description:
          '调用您配置的 AI 对每一份资料的每一个段落进行字斟句酌的全量精读，提取极其细微的专业术语、定理与跨学科概念，建立最密集的立体知识网络。',
        costText: `约 ${fullTokens} Tokens · 参考 ${fullCost} 元`,
        timeText: `约 ${fullSeconds} 秒`,
        accent: 'text-sky-600 dark:text-sky-400',
        ring: 'ring-sky-500/40 border-sky-500/50',
        icon: <Cpu size={16} />,
      },
    ]
  }, [estimate])

  // 顶部数据看板自适应：单文件长文突出「大章数 + 总字数」，多文件突出「份数 + 章节数」
  const totalSections = documents.reduce((sum, doc) => sum + doc.totalSections, 0)
  const totalChars = estimate?.totalChars ?? documents.reduce((sum, doc) => sum + doc.totalChars, 0)
  const boardSummary =
    documents.length <= 1
      ? `1 份长篇资料 · ${totalSections} 个核心章节 · ${formatChars(totalChars)}`
      : `${documents.length} 份学习资料 · ${totalSections} 个章节 · ${formatChars(totalChars)}`

  const handleConfirm = (): void => {
    setOpen(false)
    onConfirm(mode)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideClose
        className="grid max-h-[90vh] w-[min(720px,92vw)] max-w-none gap-0 overflow-y-auto rounded-3xl border-border/60 bg-card p-0 shadow-2xl"
      >
        <DialogTitle className="sr-only">构建资料树与知识网络</DialogTitle>

        {/* 标题区 */}
        <div className="relative flex flex-col gap-1 border-b border-border/50 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={17} />
            </span>
            <h2 className="text-base font-semibold tracking-tight text-foreground">构建资料树与知识网络</h2>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            已为您完成资料的纯文本转换与知识切块，请选择适合您的生成方式：
          </p>
          <p className="mt-1 text-[11px] font-medium text-primary/90">{boardSummary}</p>
          {/* 顶部数据看板 */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">已解析资料</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {documents.length} 份
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">纯文本总字数</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                约 {formatChars(estimate?.totalChars ?? 0)}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground">知识切块数</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                约 {estimate?.totalChunks ?? 0} 个单元
              </p>
            </div>
          </div>
        </div>

        {/* 方案卡片 */}
        <div className="flex flex-col gap-2.5 px-6 py-4">
          {cardData.map((card) => {
            const selected = mode === card.mode
            return (
              <button
                key={card.mode}
                type="button"
                onClick={() => setMode(card.mode)}
                className={cn(
                  'flex flex-col gap-2 rounded-2xl border bg-card px-4 py-3 text-left transition-all',
                  'hover:shadow-md',
                  selected ? `shadow-lg ring-2 ${card.ring}` : 'border-border/60',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('flex size-7 items-center justify-center rounded-lg bg-muted/50', card.accent)}>
                    {card.icon}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{card.title}</span>
                  <span className={cn('rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium', card.accent)}>
                    {card.badge}
                  </span>
                  {selected ? (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      已选择
                    </span>
                  ) : null}
                </div>
                <p className={cn('text-[10px] font-medium tracking-wide', card.accent)}>{card.tags}</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{card.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                  <span className="text-foreground/80">
                    消耗：<span className="font-medium text-foreground">{card.costText}</span>
                  </span>
                  <span className="text-foreground/80">
                    耗时：<span className="font-medium text-foreground">{card.timeText}</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-end gap-2 border-t border-border/50 px-6 py-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={updating || documents.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {updating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            <span>开始生成</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
