/**
 * 特殊代码块识别（MindMap / KLine / Mermaid）与 BlockRendererRegistry 单测
 */

import { describe, expect, test } from 'bun:test'
import {
  shouldRenderMermaidCodeBlock,
  shouldRenderMindMapCodeBlock,
  isMindMapLanguage,
  isKLineLanguage,
  shouldRenderKLineCodeBlock,
  BlockRendererRegistry,
  Z_LAYER,
  Z_INDEX,
} from './index'

describe('shouldRenderMindMapCodeBlock（思维导图代码块识别）', () => {
  test('显式 language-mindmap 命中', () => {
    expect(shouldRenderMindMapCodeBlock('language-mindmap', 'anything')).toBe(true)
  })

  test('显式 language-mermaid 不命中（交由 MermaidBlock 渲染）', () => {
    expect(shouldRenderMindMapCodeBlock('language-mermaid', 'mindmap\n  a')).toBe(false)
  })

  test('未标语言且首行为 mindmap 关键字时命中', () => {
    expect(shouldRenderMindMapCodeBlock(undefined, 'mindmap\n  root\n    a')).toBe(true)
    expect(shouldRenderMindMapCodeBlock(undefined, '  mindmap\n a')).toBe(true)
  })

  test('未标语言的普通代码不误判', () => {
    expect(shouldRenderMindMapCodeBlock(undefined, 'const x = 1')).toBe(false)
    expect(shouldRenderMindMapCodeBlock('language-js', 'mindmap')).toBe(false)
  })

  test('isMindMapLanguage 判定', () => {
    expect(isMindMapLanguage('mindmap')).toBe(true)
    expect(isMindMapLanguage('MINDMAP')).toBe(true)
    expect(isMindMapLanguage('mermaid')).toBe(false)
  })

  test('不应与既有 Mermaid 识别冲突（language-mermaid + mindmap 仍走 Mermaid）', () => {
    const code = 'mindmap\n  root((x))\n    child'
    expect(shouldRenderMermaidCodeBlock('language-mermaid', code)).toBe(true)
    expect(shouldRenderMindMapCodeBlock('language-mermaid', code)).toBe(false)
  })
})

describe('shouldRenderKLineCodeBlock & BlockRendererRegistry（K线图识别与统一分发）', () => {
  test('isKLineLanguage 识别 kline / candlestick / ohlc / stock-kline', () => {
    expect(isKLineLanguage('kline')).toBe(true)
    expect(isKLineLanguage('candlestick')).toBe(true)
    expect(isKLineLanguage('ohlc')).toBe(true)
    expect(isKLineLanguage('stock-kline')).toBe(true)
    expect(isKLineLanguage('python')).toBe(false)
  })

  test('显式 language-kline 与未标注语言头部嗅探', () => {
    expect(shouldRenderKLineCodeBlock('language-kline', 'symbol: SH600519')).toBe(true)
    expect(
      shouldRenderKLineCodeBlock(undefined, 'symbol: SH600519\nmode: live\nperiod: 1d'),
    ).toBe(true)
    expect(shouldRenderKLineCodeBlock('language-ts', 'symbol: SH600519')).toBe(false)
  })

  test('BlockRendererRegistry 正确分发 kline / mindmap / mermaid，且支持 kline 流式渐进渲染', () => {
    const klineResolved = BlockRendererRegistry.resolve(
      'language-kline',
      'mode: live\nsymbol: SH600519\nname: 贵州茅台\nperiod: 1d',
      { isStreaming: true },
    )
    expect(klineResolved?.kind).toBe('kline')

    const mindmapStreaming = BlockRendererRegistry.resolve(
      'language-mindmap',
      'mindmap\n  root((A))\n    B',
      { isStreaming: true },
    )
    expect(mindmapStreaming).toBeNull()

    const mindmapClosed = BlockRendererRegistry.resolve(
      'language-mindmap',
      'mindmap\n  root((A))\n    B',
      { isStreaming: false },
    )
    expect(mindmapClosed?.kind).toBe('mindmap')

    const mermaidClosed = BlockRendererRegistry.resolve(
      'language-mermaid',
      'flowchart TD\n  A --> B',
      { isStreaming: false },
    )
    expect(mermaidClosed?.kind).toBe('mermaid')
  })
})

describe('全局渲染图层标准阶梯（§4.2）', () => {
  test('阶梯取值单调有序且语义完整', () => {
    expect(Z_INDEX.canvas).toBeLessThan(Z_INDEX.toolbar)
    expect(Z_INDEX.toolbar).toBeLessThan(Z_INDEX.chrome)
    expect(Z_INDEX.chrome).toBeLessThan(Z_INDEX.shellContent)
    expect(Z_INDEX.shellResizer).toBeLessThan(Z_INDEX.dialog)
    expect(Z_INDEX.dialog).toBeLessThan(Z_INDEX.confirm)
    expect(Z_INDEX.confirm).toBeLessThan(Z_INDEX.fullscreen)
    expect(Z_INDEX.fullscreen).toBeLessThan(Z_INDEX.lightbox)
    expect(Z_INDEX.lightbox).toBeLessThan(Z_INDEX.menu)
    expect(Z_INDEX.menu).toBeLessThan(Z_INDEX.tooltip)
  })

  test('类名与数值一一对应', () => {
    expect(Z_LAYER.dialog).toBe(`z-[${Z_INDEX.dialog}]`)
    expect(Z_LAYER.confirm).toBe(`z-[${Z_INDEX.confirm}]`)
    expect(Z_LAYER.fullscreen).toBe(`z-[${Z_INDEX.fullscreen}]`)
    expect(Z_LAYER.lightbox).toBe(`z-[${Z_INDEX.lightbox}]`)
    expect(Z_LAYER.tooltip).toBe(`z-[${Z_INDEX.tooltip}]`)
  })
})
