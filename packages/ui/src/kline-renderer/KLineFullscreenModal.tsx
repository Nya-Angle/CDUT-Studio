/**
 * Fullscreen Quantitative Workstation Modal for K-Line Renderer
 *
 * Allows expanding any inline chat K-Line block or client widget into a full-viewport
 * institutional workstation with side-by-side AI Cognitive Digest inspection.
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles, Copy, Check, TrendingUp } from 'lucide-react'
import type { KLineCognitiveDigest, KLineDSLSpec } from '@profer/shared'
import { KLineRenderer } from './KLineRenderer'

export interface KLineFullscreenModalProps {
  open: boolean
  onClose: () => void
  code?: string
  spec?: Partial<KLineDSLSpec>
  symbol?: string
  interval?: string
  onOverlayLifecycleChange?: (active: boolean) => void
}

export function KLineFullscreenModal({
  open,
  onClose,
  code,
  spec,
  symbol,
  interval,
  onOverlayLifecycleChange,
}: KLineFullscreenModalProps): React.ReactElement | null {
  const [digest, setDigest] = React.useState<KLineCognitiveDigest | null>(null)
  const [copiedDigest, setCopiedDigest] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    onOverlayLifecycleChange?.(true)
    return () => {
      onOverlayLifecycleChange?.(false)
    }
  }, [open, onOverlayLifecycleChange])

  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleCopyDigest = React.useCallback(async () => {
    if (!digest) return
    try {
      await navigator.clipboard.writeText(digest.llmPromptMarkdown)
      setCopiedDigest(true)
      setTimeout(() => setCopiedDigest(false), 1800)
    } catch {
      // ignore
    }
  }, [digest])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-md text-slate-100 animate-in fade-in duration-150">
      {/* Top Workstation Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-[#090d16]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>极高频量化微观结构工作台 (Lab-Grade K-Line & Microstructure Workstation)</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                WebGPU WGSL + 3-Layer Parity Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              支持滚轮焦点锚定缩放、拖拽平移、KDE核密度筹码小提琴、环形L2热力簿与通达信/Pine向量化指标实时编译
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {digest && (
            <button
              type="button"
              onClick={handleCopyDigest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-medium transition-colors"
            >
              {copiedDigest ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDigest ? '已复制 AI 认知摘要' : '复制 AI 认知摘要 (供大模型分析)'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="关闭全屏 (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Workstation Body */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Left: Primary K-Line Renderer */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <KLineRenderer
            code={code}
            spec={spec}
            symbol={symbol}
            interval={interval}
            height={Math.max(480, typeof window !== 'undefined' ? window.innerHeight - 170 : 640)}
            onCognitiveDigestChange={setDigest}
            className="flex-1"
          />
        </div>

        {/* Right: Real-Time AI Cognitive Encoder & Microstructure Telemetry Sidebar */}
        {digest && (
          <div className="w-full lg:w-80 xl:w-96 flex flex-col rounded-xl border border-slate-800/80 bg-[#0b101b] overflow-hidden shrink-0">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-[#0f1626]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>大模型认知语义编码器</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{digest.symbol}</span>
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/70">
                  <div className="text-[10px] text-slate-400">区间涨跌幅</div>
                  <div
                    className={`font-mono text-sm font-bold mt-0.5 ${
                      digest.periodChangePercent >= 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {digest.periodChangePercent >= 0 ? '+' : ''}
                    {digest.periodChangePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/70">
                  <div className="text-[10px] text-slate-400">ATR(14) 波动率</div>
                  <div className="font-mono text-sm font-bold text-sky-300 mt-0.5">
                    {digest.atr14.toFixed(3)}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/70">
                  <div className="text-[10px] text-slate-400">筹码峰 POC 中枢</div>
                  <div className="font-mono text-sm font-bold text-amber-300 mt-0.5">
                    {digest.volumeProfile.pocPrice.toFixed(2)}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/70">
                  <div className="text-[10px] text-slate-400">VPIN 知情交易毒性</div>
                  <div className="font-mono text-sm font-bold text-purple-300 mt-0.5">
                    {(digest.microstructureSummary.latestVpin * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Value Area */}
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70 space-y-1">
                <div className="text-[11px] font-medium text-slate-300">
                  70% 筹码价值中枢区间 (Value Area)
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>VAL: {digest.volumeProfile.valueAreaLow.toFixed(2)}</span>
                  <span>POC: {digest.volumeProfile.pocPrice.toFixed(2)}</span>
                  <span>VAH: {digest.volumeProfile.valueAreaHigh.toFixed(2)}</span>
                </div>
              </div>

              {/* Detected Price Action Patterns */}
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70 space-y-1.5">
                <div className="text-[11px] font-medium text-slate-300">
                  价格行为学形态识别 ({digest.patterns.length})
                </div>
                {digest.patterns.length === 0 ? (
                  <div className="text-[11px] text-slate-500">当前窗口未触发显著反转/吞没形态</div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {digest.patterns.slice(-8).map((pat, idx) => (
                      <span
                        key={`${pat.index}-${idx}`}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          pat.direction === 'bullish'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : pat.direction === 'bearish'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {pat.name} (#{pat.index})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Raw LLM Prompt Digest */}
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-300">
                  结构化 Prompt 注入载荷 (Token 压缩比 &gt; 10x)
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[10px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {digest.llmPromptMarkdown}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
