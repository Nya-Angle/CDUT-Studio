/**
 * @profer/ui/block-registry — 特殊可视化代码块统一注册与分发中心 (BlockRendererRegistry)
 *
 * 设计目的：
 *   1. 将「思维导图 (MindMap)」、「股票 K 线图 (KLine)」、「流程图 (Mermaid)」等特殊图示
 *      从会话渲染器硬编码 if-else 中解耦为独立可插拔的模块组件；
 *   2. 支持流式增量渲染（`supportsStreaming: true`，如 K 线图在大模型逐行输出 OHLCV 时实时生长）；
 *   3. 客户端任意区域（会话消息流、富文本预览编辑器、独立看盘/速课堂工作台）均可直接按模块调用
 *      或通过本注册表统一分发。
 */

import * as React from 'react'
import {
  isKLineLanguage,
  parseKLineBlockText,
  parseMindMapText,
  shouldRenderKLineCodeBlock,
} from '@profer/shared'
import { MermaidBlock } from '../mermaid-block/index.ts'
import {
  isMermaidLanguage,
  isMindMapLanguage,
  shouldInspectMermaidCodeBlock,
  shouldRenderMermaidCodeBlock,
  shouldRenderMindMapCodeBlock,
} from '../mermaid-detection.ts'
import { MindMapBlock } from '../mindmap-renderer/index.ts'
import { KLineBlock } from '../kline-renderer/index.ts'

export type SpecialBlockKind = 'kline' | 'mindmap' | 'mermaid'

export interface SpecialBlockRendererProps {
  code: string
  className?: string
  isStreaming?: boolean
  onOverlayLifecycleChange?: (active: boolean) => void
}

export interface SpecialBlockDescriptor {
  kind: SpecialBlockKind
  /** 是否支持在大模型流式输出（围栏尚未闭合）时渐进式实时渲染 */
  supportsStreaming: boolean
  /** 判定当前代码块是否命中该特殊渲染器 */
  match: (className: string | undefined, code: string, isStreaming?: boolean) => boolean
  /** 渲染对应的独立组件 */
  render: (props: SpecialBlockRendererProps) => React.ReactElement | null
}

const BUILTIN_DESCRIPTORS: SpecialBlockDescriptor[] = [
  {
    kind: 'kline',
    supportsStreaming: true,
    match: (className, code) => {
      if (!shouldRenderKLineCodeBlock(className, code)) return false
      return Boolean(parseKLineBlockText(code))
    },
    render: ({ code, isStreaming, onOverlayLifecycleChange }) => (
      <KLineBlock
        code={code}
        isStreaming={isStreaming}
        onOverlayLifecycleChange={onOverlayLifecycleChange}
      />
    ),
  },
  {
    kind: 'mindmap',
    supportsStreaming: false,
    match: (className, code) => {
      if (shouldRenderMindMapCodeBlock(className, code)) {
        return Boolean(parseMindMapText(code))
      }
      // 防御性语法侦测：LLM 偶尔将 mindmap 缩进语法包进 ```mermaid 围栏
      if (shouldInspectMermaidCodeBlock(className) && /^\s*mindmap\b/m.test(code)) {
        return Boolean(parseMindMapText(code))
      }
      return false
    },
    render: ({ code, isStreaming, onOverlayLifecycleChange }) => (
      <MindMapBlock
        code={code}
        isStreaming={isStreaming}
        onOverlayLifecycleChange={onOverlayLifecycleChange}
      />
    ),
  },
  {
    kind: 'mermaid',
    supportsStreaming: false,
    match: (className, code) => {
      if (!shouldInspectMermaidCodeBlock(className)) return false
      return shouldRenderMermaidCodeBlock(className, code)
    },
    render: ({ code }) => <MermaidBlock code={code} />,
  },
]

const customDescriptors: SpecialBlockDescriptor[] = []

export const BlockRendererRegistry = {
  /** 注册自定义可视化代码块渲染器（高优先级插在队首） */
  register(descriptor: SpecialBlockDescriptor): () => void {
    customDescriptors.unshift(descriptor)
    return () => {
      const idx = customDescriptors.indexOf(descriptor)
      if (idx >= 0) customDescriptors.splice(idx, 1)
    }
  },

  /** 获取当前全部已注册的特殊渲染器描述符 */
  getAll(): readonly SpecialBlockDescriptor[] {
    return [...customDescriptors, ...BUILTIN_DESCRIPTORS]
  },

  /**
   * 解析并匹配特殊代码块渲染器
   * @param className `language-xxx` 类名
   * @param rawCode 代码块文本内容
   * @param options `{ isStreaming, onOverlayLifecycleChange }`
   */
  resolve(
    className: string | undefined,
    rawCode: string,
    options?: {
      isStreaming?: boolean
      onOverlayLifecycleChange?: (active: boolean) => void
    },
  ): { kind: SpecialBlockKind; element: React.ReactElement } | null {
    const normalizedCode = rawCode.replace(/\r\n?/g, '\n').replace(/\n$/, '')
    const isStreaming = options?.isStreaming ?? false

    for (const desc of this.getAll()) {
      if (isStreaming && !desc.supportsStreaming) continue
      if (desc.match(className, normalizedCode, isStreaming)) {
        const element = desc.render({
          code: normalizedCode,
          className,
          isStreaming,
          onOverlayLifecycleChange: options?.onOverlayLifecycleChange,
        })
        if (element) {
          return { kind: desc.kind, element }
        }
      }
    }
    return null
  },
}

export { isKLineLanguage, shouldRenderKLineCodeBlock, isMindMapLanguage, isMermaidLanguage }
