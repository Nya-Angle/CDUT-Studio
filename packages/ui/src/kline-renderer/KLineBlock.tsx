/**
 * Standalone K-Line Block Wrapper Component (`@profer/ui/kline-renderer`)
 *
 * Designed to be rendered:
 * 1. Directly inside chat message streams (` ```kline ` or ` ```kline-live ` blocks)
 * 2. Inside rich-text/Markdown previews
 * 3. Directly mounted in any client panel via `<KLineBlock symbol="600519.SH" />`
 */

import * as React from 'react'
import { Maximize2, Code, Copy, Check, Sparkles, Radio } from 'lucide-react'
import type { KLineCognitiveDigest, KLineDSLSpec } from '@profer/shared'
import { cn } from '../lib/cn.ts'
import { KLineRenderer } from './KLineRenderer'
import { KLineFullscreenModal } from './KLineFullscreenModal'

export interface KLineBlockProps {
  /** Raw fenced code block content (JSON / YAML / CSV) */
  code?: string
  /** Structured spec override */
  spec?: Partial<KLineDSLSpec>
  /** Direct stock/crypto symbol mount (e.g. "600519.SH", "NVDA", "BTCUSDT") */
  symbol?: string
  /** Timeframe interval override */
  interval?: string
  /** Height of the inline chart canvas */
  height?: number
  /** Whether the parent LLM response is still streaming */
  isStreaming?: boolean
  /** Callback when fullscreen modal overlay opens/closes */
  onOverlayLifecycleChange?: (active: boolean) => void
  /** Additional className */
  className?: string
}

export function KLineBlock({
  code,
  spec,
  symbol,
  interval,
  height = 420,
  onOverlayLifecycleChange,
  className,
}: KLineBlockProps): React.ReactElement {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showRawSource, setShowRawSource] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)
  const [copiedDigest, setCopiedDigest] = React.useState(false)
  const [latestDigest, setLatestDigest] = React.useState<KLineCognitiveDigest | null>(null)

  const handleCopySource = React.useCallback(async () => {
    const textToCopy =
      code ||
      JSON.stringify(
        spec || { mode: 'live', symbol: symbol || '600519.SH', interval: interval || '1m' },
        null,
        2
      )
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 1800)
    } catch {
      // ignore
    }
  }, [code, spec, symbol, interval])

  const handleCopyCognitiveDigest = React.useCallback(async () => {
    if (!latestDigest) return
    try {
      await navigator.clipboard.writeText(latestDigest.llmPromptMarkdown)
      setCopiedDigest(true)
      setTimeout(() => setCopiedDigest(false), 1800)
    } catch {
      // ignore
    }
  }, [latestDigest])

  return (
    <div
      className={cn(
        'group relative my-3 rounded-xl overflow-hidden border border-slate-800/90 bg-[#090d16] shadow-md transition-all',
        className
      )}
    >
      {/* Block Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 bg-[#0f1624] text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            QUANT K-LINE ENGINE
          </span>
          {latestDigest && (
            <span className="font-mono text-[11px] text-slate-400 truncate max-w-[260px]">
              {latestDigest.symbol} · {latestDigest.interval} · POC{' '}
              {latestDigest.volumeProfile.pocPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Copy AI Cognitive Summary for LLM follow-up */}
          {latestDigest && (
            <button
              type="button"
              onClick={handleCopyCognitiveDigest}
              title="复制 AI 认知编码摘要 (可直接粘贴给大模型进行深度盘面推演)"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-[11px] text-amber-300/90 hover:text-amber-200 transition-colors"
            >
              {copiedDigest ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {copiedDigest ? '已复制认知摘要' : '复制AI盘面摘要'}
              </span>
            </button>
          )}

          {/* Toggle Raw DSL Source */}
          {code && (
            <button
              type="button"
              onClick={() => setShowRawSource((v) => !v)}
              title={showRawSource ? '返回交互式 K 线图' : '查看原始 DSL 源码'}
              className={cn(
                'p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors',
                showRawSource && 'bg-slate-800 text-sky-300'
              )}
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Raw DSL */}
          <button
            type="button"
            onClick={handleCopySource}
            title="复制 K 线配置源码"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Expand Fullscreen Workstation */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            title="打开全屏极高频量化工作台"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Interactive K-Line Renderer OR Raw DSL Code */}
      {showRawSource && code ? (
        <pre className="p-4 max-h-[420px] overflow-auto font-mono text-xs text-slate-300 bg-[#070a10] leading-relaxed">
          <code>{code}</code>
        </pre>
      ) : (
        <KLineRenderer
          code={code}
          spec={spec}
          symbol={symbol}
          interval={interval}
          height={height}
          onCognitiveDigestChange={setLatestDigest}
          className="border-0 rounded-none shadow-none"
        />
      )}

      {/* Fullscreen Workstation Modal */}
      <KLineFullscreenModal
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        code={code}
        spec={spec}
        symbol={symbol}
        interval={interval}
        onOverlayLifecycleChange={onOverlayLifecycleChange}
      />
    </div>
  )
}
