import { isKLineLanguage, shouldRenderKLineCodeBlock } from '@profer/shared'

// 注意：graph / flowchart / flowchart-elk 不在此列。它们同时是常见英文/代码词，
// 仅凭首行以其开头极易误判普通代码块。改用 MERMAID_DIRECTED_PATTERN 要求其后必须
// 跟方向关键字（mermaid 强制语法），既精确又零漏报。
const MERMAID_START_KEYWORDS = [
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'stateDiagram-v2',
  'erDiagram',
  'journey',
  'gantt',
  'pie',
  'gitGraph',
  'mindmap',
  'timeline',
  'quadrantChart',
  'xychart-beta',
  'block',
  'block-beta',
  'packet',
  'packet-beta',
  'architecture',
  'architecture-beta',
  'sankey',
  'sankey-beta',
  'requirementDiagram',
  'kanban',
  'radar-beta',
  'treeView-beta',
  'treemap',
  'venn-beta',
  'ishikawa-beta',
  'wardley-beta',
  'C4Context',
  'C4Container',
  'C4Component',
  'C4Dynamic',
  'C4Deployment',
] as const

const MERMAID_START_PATTERN = new RegExp(
  `^(?:${MERMAID_START_KEYWORDS.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'i',
)
// graph / flowchart / flowchart-elk 后必须跟方向（TB/TD/BT/RL/LR），是 mermaid 强制语法。
// 这样 "graph of results"、"flowchart for the pipeline" 等普通文本不会被误判为图。
const MERMAID_DIRECTED_PATTERN = /^(?:flowchart-elk|flowchart|graph)\s+(?:TB|TD|BT|RL|LR)\b/i
const LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-\S+/i
const MERMAID_LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-(?:mermaid|mmd)(?:\s|$)/i
const MERMAID_DIRECTIVE_PATTERN = /^%%\{[\s\S]*\}%%$/
const MERMAID_COMMENT_PATTERN = /^%%(?!\{)/

export function isMermaidLanguage(language: string): boolean {
  return /^(?:mermaid|mmd)$/i.test(language.trim())
}

export function looksLikeMermaidDefinition(code: string): boolean {
  for (const line of code.trimStart().split(/\r?\n/)) {
    const candidate = line.trim()
    if (!candidate || MERMAID_DIRECTIVE_PATTERN.test(candidate) || MERMAID_COMMENT_PATTERN.test(candidate)) continue
    return MERMAID_DIRECTED_PATTERN.test(candidate) || MERMAID_START_PATTERN.test(candidate)
  }
  return false
}

export function shouldInspectMermaidCodeBlock(className: string | undefined): boolean {
  if (className && MERMAID_LANGUAGE_CLASS_PATTERN.test(className)) return true
  if (className && LANGUAGE_CLASS_PATTERN.test(className)) return false
  return true
}

export function shouldRenderMermaidCodeBlock(className: string | undefined, code: string): boolean {
  if (className && MERMAID_LANGUAGE_CLASS_PATTERN.test(className)) return true
  if (className && LANGUAGE_CLASS_PATTERN.test(className)) return false
  return looksLikeMermaidDefinition(code)
}

// ===== 对话流 ```mindmap 思维导图代码块识别 =====

const MINDMAP_LANGUAGE_CLASS_PATTERN = /(?:^|\s)language-mindmap(?:\s|$)/i

/** 语言标识是否为 mindmap */
export function isMindMapLanguage(language: string): boolean {
  return /^mindmap$/i.test(language.trim())
}

/**
 * 判定代码块是否应交给专用思维导图渲染器（对话流只读预览 + 全屏可拖拽大图）。
 *
 * 仅两类命中，避免与 Mermaid 生态冲突：
 *   1. 显式标注 `language-mindmap`；
 *   2. 未标注任何语言且首行即为 `mindmap` 关键字。
 * 显式标注 `language-mermaid`（mermaid 自带 mindmap 图）仍交由 MermaidBlock 渲染。
 */
export function shouldRenderMindMapCodeBlock(className: string | undefined, code: string): boolean {
  if (className && MINDMAP_LANGUAGE_CLASS_PATTERN.test(className)) return true
  if (className && LANGUAGE_CLASS_PATTERN.test(className)) return false
  const firstLine = code.trimStart().split(/\r?\n/, 1)[0] ?? ''
  return /^mindmap\b/i.test(firstLine.trim())
}

export { isKLineLanguage, shouldRenderKLineCodeBlock }
