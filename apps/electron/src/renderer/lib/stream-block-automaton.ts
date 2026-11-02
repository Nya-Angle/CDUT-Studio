/**
 * 流式 Markdown 前缀单调块闭合状态机。
 *
 * 目标：把持续增长的累积文本切分为「已闭合块」与「未闭合尾部」，
 * 已闭合块一旦产出便不再变化，供上层用 React.memo 永久冻结；
 * 尾部通常只有几十字符，交给轻量 Markdown 渲染。
 *
 * 设计约束：
 * - 只扫描新增的完整行（indexOf('\n')），不对全量文本反复 split；
 * - 块边界语义与 agent-block-copy.ts 的 parseAgentMarkdownBlocks 保持一致；
 * - 代码围栏、自定义成对标签、Setext 标题处于挂起窗口时不提前闭合；
 * - 64KB 高水位熔断，防止异常流把主线程/内存拖死。
 */

import {
  HEADING_RE,
  QUOTE_RE,
  SETEXT_HEADING_RE,
  TABLE_SEPARATOR_RE,
  THEMATIC_BREAK_RE,
  isBlank,
  isFenceCloser,
  leadingIndent,
  parseFenceOpener,
  parseListMarker,
  type AgentMarkdownBlock,
  type FenceOpener,
  type ListMarker,
} from '@/components/ai-elements/agent-block-copy'

export type StreamBlockKind = 'markdown' | 'table' | 'code' | 'custom_tag'

export interface StreamBlock {
  readonly id: string
  readonly source: string
  readonly kind: StreamBlockKind
}

export interface AutomatonFeedResult {
  readonly closedBlocks: readonly StreamBlock[]
  readonly activeTail: string
  readonly activeTailKind: 'markdown' | 'code' | 'custom_tag'
}

type OpenBlockType = 'paragraph' | 'fence' | 'table' | 'list' | 'quote' | 'heading' | 'custom_tag'

const MAX_SUSPENSION_BYTES = 64 * 1024

/** HTML 中不需要等待闭合标签的 void 元素，避免把它们误判为挂起块。 */
const VOID_TAG_NAMES = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

const OPEN_TAG_RE = /^[ \t]*<([A-Za-z][\w-]*)(?:\s[^>]*)?>/

function parseOpenTag(line: string): { name: string } | null {
  const match = OPEN_TAG_RE.exec(line)
  if (!match) return null
  if (match[0].trimEnd().endsWith('/>')) return null
  const name = match[1]!.toLowerCase()
  if (VOID_TAG_NAMES.has(name)) return null
  return { name }
}

function isStreamBlockStartLine(line: string): boolean {
  return Boolean(
    parseFenceOpener(line) ||
    parseOpenTag(line) ||
    HEADING_RE.test(line) ||
    QUOTE_RE.test(line) ||
    parseListMarker(line) ||
    THEMATIC_BREAK_RE.test(line),
  )
}

export class StreamBlockAutomaton {
  private closedBlocks: StreamBlock[] = []
  private nextId = 0
  private lineStart = 0
  private blockStart = -1
  private openType: OpenBlockType | null = null
  private blockKind: StreamBlockKind = 'markdown'
  private fence: FenceOpener | null = null
  private customTagName: string | null = null
  private lastNonBlankEnd = 0
  private paragraphLineCount = 0
  private lastLineHadPipe = false
  private firstListMarker: ListMarker | null = null

  /** 已遇到空行，等待下一行确认是 Setext 标题还是新块。 */
  private suspended = false

  private lastText = ''
  private cachedText = ''
  private cachedDone = false
  private cachedResult: AutomatonFeedResult = { closedBlocks: [], activeTail: '', activeTailKind: 'markdown' }

  /**
   * 喂入全量累积字符串。
   * 上游输入通常只增长；状态机记录已消费偏移，避免重复扫描历史行。
   */
  public feed(accumulatedText: string, isStreamDone: boolean): AutomatonFeedResult {
    // 同一组件实例在终态之后再次进入流式（重新生成/重新打字）时，必须丢弃上一轮状态。
    if (this.cachedDone && !isStreamDone) this.reset()

    // 文本被替换或回退（重试、消息切换）同样需要丢弃历史块，保证前缀单调性。
    if (this.lastText && (accumulatedText.length < this.lastText.length || !accumulatedText.startsWith(this.lastText))) {
      this.reset()
    }

    if (accumulatedText === this.cachedText && isStreamDone === this.cachedDone) {
      return this.cachedResult
    }

    this.scanCompleteLines(accumulatedText)

    if (isStreamDone) {
      // 终态冲刷前先让 partial line 完成挂起确认，避免 "a\n\nb" 被合并成一个块。
      this.resolveSuspensionWithPartial(accumulatedText)
      this.flushRemainder(accumulatedText)
      this.lastText = accumulatedText
      this.cachedText = accumulatedText
      this.cachedDone = true
      this.cachedResult = { closedBlocks: this.closedBlocks, activeTail: '', activeTailKind: 'markdown' }
      return this.cachedResult
    }

    this.resolveSuspensionWithPartial(accumulatedText)
    this.enforceHighWaterMark(accumulatedText)
    this.lastText = accumulatedText

    const tailStart = this.blockStart >= 0 ? this.blockStart : this.lineStart
    const activeTail = accumulatedText.slice(tailStart)
    const result: AutomatonFeedResult = {
      closedBlocks: this.closedBlocks,
      activeTail: activeTail.trim() ? activeTail : '',
      activeTailKind: this.tailKind(),
    }
    this.cachedText = accumulatedText
    this.cachedDone = false
    this.cachedResult = result
    return result
  }

  public reset(): void {
    this.closedBlocks = []
    this.nextId = 0
    this.lineStart = 0
    this.blockStart = -1
    this.openType = null
    this.blockKind = 'markdown'
    this.fence = null
    this.customTagName = null
    this.lastNonBlankEnd = 0
    this.paragraphLineCount = 0
    this.lastLineHadPipe = false
    this.firstListMarker = null
    this.suspended = false
    this.lastText = ''
    this.cachedText = ''
    this.cachedDone = false
    this.cachedResult = { closedBlocks: [], activeTail: '', activeTailKind: 'markdown' }
  }

  private scanCompleteLines(text: string): void {
    let pos = this.lineStart
    while (true) {
      const newlineIndex = text.indexOf('\n', pos)
      if (newlineIndex < 0) break
      const lineEnd = newlineIndex + 1
      this.handleLine(text, text.slice(pos, newlineIndex), pos, lineEnd)
      pos = lineEnd
      this.lineStart = pos
    }
  }

  private handleLine(text: string, line: string, lineStart: number, lineEnd: number): void {
    if (this.openType === 'fence') {
      if (this.fence && isFenceCloser(line, this.fence)) {
        this.emit(text, this.blockStart, lineEnd, 'code')
        this.clearOpen()
      } else if (!isBlank(line)) {
        this.lastNonBlankEnd = lineEnd
      }
      return
    }

    if (this.openType === 'custom_tag') {
      if (!isBlank(line)) this.lastNonBlankEnd = lineEnd
      if (this.customTagName && line.toLowerCase().includes(`</${this.customTagName}>`)) {
        this.emit(text, this.blockStart, lineEnd, 'custom_tag')
        this.clearOpen()
      }
      return
    }

    if (isBlank(line)) {
      if (this.openType === 'table') {
        this.emit(text, this.blockStart, this.lastNonBlankEnd, 'table')
        this.clearOpen()
      } else if (this.openType) {
        this.suspended = true
      }
      return
    }

    if (this.suspended) {
      this.handleSuspendedLine(text, line, lineStart, lineEnd)
      return
    }

    if (!this.openType) {
      this.startBlock(text, line, lineStart, lineEnd)
      return
    }

    switch (this.openType) {
      case 'paragraph':
        this.handleParagraphContinuation(text, line, lineStart, lineEnd)
        return
      case 'quote':
        if (QUOTE_RE.test(line)) this.lastNonBlankEnd = lineEnd
        else this.restartBlock(text, line, lineStart, lineEnd)
        return
      case 'list':
        this.handleListContinuation(text, line, lineStart, lineEnd)
        return
      case 'table':
        if (line.includes('|')) this.lastNonBlankEnd = lineEnd
        else this.restartBlock(text, line, lineStart, lineEnd)
        return
      case 'heading':
        return
    }
  }

  private startBlock(text: string, line: string, lineStart: number, lineEnd: number): void {
    const fence = parseFenceOpener(line)
    if (fence) {
      this.beginBlock('fence', 'code', lineStart, lineEnd)
      this.fence = fence
      return
    }

    const tag = parseOpenTag(line)
    if (tag) {
      this.beginBlock('custom_tag', 'custom_tag', lineStart, lineEnd)
      this.customTagName = tag.name
      if (line.toLowerCase().includes(`</${tag.name}>`)) {
        this.emit(text, this.blockStart, lineEnd, 'custom_tag')
        this.clearOpen()
      }
      return
    }

    if (HEADING_RE.test(line) || THEMATIC_BREAK_RE.test(line)) {
      this.emit(text, lineStart, lineEnd, 'markdown')
      return
    }

    if (QUOTE_RE.test(line)) {
      this.beginBlock('quote', 'markdown', lineStart, lineEnd)
      return
    }

    const marker = parseListMarker(line)
    if (marker) {
      this.beginBlock('list', 'markdown', lineStart, lineEnd)
      this.firstListMarker = marker
      return
    }

    this.beginBlock('paragraph', 'markdown', lineStart, lineEnd)
    this.paragraphLineCount = 1
    this.lastLineHadPipe = line.includes('|')
  }

  private beginBlock(type: OpenBlockType, kind: StreamBlockKind, start: number, end: number): void {
    this.openType = type
    this.blockKind = kind
    this.blockStart = start
    this.lastNonBlankEnd = end
    this.suspended = false
    this.paragraphLineCount = 0
    this.lastLineHadPipe = false
    this.firstListMarker = null
  }

  private handleParagraphContinuation(text: string, line: string, lineStart: number, lineEnd: number): void {
    // 段落只有一行时，下一行若形如 ===/---，按 Setext 标题处理（与全量解析器一致）。
    if (this.paragraphLineCount === 1 && SETEXT_HEADING_RE.test(line)) {
      this.lastNonBlankEnd = lineEnd
      this.emit(text, this.blockStart, lineEnd, 'markdown')
      this.clearOpen()
      return
    }

    // 首行含 | 且下一行是表格分隔行 → 把当前段落重分类为表格。
    if (this.paragraphLineCount === 1 && this.lastLineHadPipe && TABLE_SEPARATOR_RE.test(line)) {
      this.openType = 'table'
      this.blockKind = 'table'
      this.lastNonBlankEnd = lineEnd
      return
    }

    if (isStreamBlockStartLine(line)) {
      this.restartBlock(text, line, lineStart, lineEnd)
      return
    }

    this.lastNonBlankEnd = lineEnd
    this.paragraphLineCount += 1
    this.lastLineHadPipe = line.includes('|')
  }

  private handleListContinuation(text: string, line: string, lineStart: number, lineEnd: number): void {
    const first = this.firstListMarker
    if (!first) {
      this.restartBlock(text, line, lineStart, lineEnd)
      return
    }

    const marker = parseListMarker(line)
    if (marker) {
      if (marker.indent >= first.contentIndent) {
        this.lastNonBlankEnd = lineEnd
      } else {
        this.restartBlock(text, line, lineStart, lineEnd)
      }
      return
    }

    if (leadingIndent(line) >= first.contentIndent) {
      this.lastNonBlankEnd = lineEnd
      return
    }

    if (!first.empty && !isStreamBlockStartLine(line)) {
      this.lastNonBlankEnd = lineEnd
      return
    }

    this.restartBlock(text, line, lineStart, lineEnd)
  }

  private handleSuspendedLine(text: string, line: string, lineStart: number, lineEnd: number): void {
    const type = this.openType
    this.suspended = false

    if (type === 'paragraph') {
      if (SETEXT_HEADING_RE.test(line)) {
        // 计划要求：段落 + 空行 + ===/--- 合并为单块，保留原始空行，不篡改内容。
        this.lastNonBlankEnd = lineEnd
        this.emit(text, this.blockStart, lineEnd, 'markdown')
        this.clearOpen()
        return
      }
      this.restartBlock(text, line, lineStart, lineEnd)
      return
    }

    if (type === 'quote') {
      if (QUOTE_RE.test(line)) {
        this.lastNonBlankEnd = lineEnd
        return
      }
      this.restartBlock(text, line, lineStart, lineEnd)
      return
    }

    if (type === 'list' && this.firstListMarker) {
      const first = this.firstListMarker
      const marker = parseListMarker(line)
      if (marker) {
        if (marker.indent >= first.contentIndent) {
          this.lastNonBlankEnd = lineEnd
          return
        }
        this.restartBlock(text, line, lineStart, lineEnd)
        return
      }
      if (leadingIndent(line) >= first.contentIndent) {
        this.lastNonBlankEnd = lineEnd
        return
      }
      this.restartBlock(text, line, lineStart, lineEnd)
      return
    }

    this.restartBlock(text, line, lineStart, lineEnd)
  }

  /** 闭合当前块，并以新行开启下一块。 */
  private restartBlock(text: string, line: string, lineStart: number, lineEnd: number): void {
    this.closeOpen(text)
    this.startBlock(text, line, lineStart, lineEnd)
  }

  private closeOpen(text: string): void {
    if (this.blockStart >= 0) this.emit(text, this.blockStart, this.lastNonBlankEnd, this.blockKind)
    this.clearOpen()
  }

  private clearOpen(): void {
    this.openType = null
    this.blockStart = -1
    this.blockKind = 'markdown'
    this.fence = null
    this.customTagName = null
    this.lastNonBlankEnd = 0
    this.paragraphLineCount = 0
    this.lastLineHadPipe = false
    this.firstListMarker = null
    this.suspended = false
  }

  private emit(text: string, start: number, end: number, kind: StreamBlockKind): void {
    if (start < 0 || end <= start) return
    const source = text.slice(start, end).replace(/\n$/, '')
    if (!source.trim()) return
    this.closedBlocks = this.closedBlocks.concat({ id: String(this.nextId++), source, kind })
  }

  private tailKind(): 'markdown' | 'code' | 'custom_tag' {
    if (this.openType === 'fence') return 'code'
    if (this.openType === 'custom_tag') return 'custom_tag'
    return 'markdown'
  }

  /**
   * 挂起窗口的提前确认：
   * 尾部的 partial line 若不是 Setext 下划线（首字符不是 = 或 -），
   * 说明之前遇到空行后不会再有标题下划线，可以立刻闭合挂起块。
   */
  private resolveSuspensionWithPartial(text: string): void {
    if (!this.suspended || !this.openType) return
    const partial = text.slice(this.lineStart)
    const trimmed = partial.trimStart()
    if (!trimmed) return
    const first = trimmed[0]
    if (first === '=' || first === '-') return

    if (this.openType === 'list' && this.firstListMarker) {
      if (leadingIndent(partial) >= this.firstListMarker.contentIndent) return
      this.closeOpen(text)
      return
    }

    if (this.openType === 'quote' && QUOTE_RE.test(partial)) return

    this.closeOpen(text)
  }

  /**
   * 64KB 高水位熔断：异常流（例如遗漏闭合反引号）下强制把超长尾部切成闭合块，
   * 保证 activeTail 不会无限增长。循环处理可覆盖极端超长输入。
   */
  private enforceHighWaterMark(text: string): void {
    while (true) {
      const tailStart = this.blockStart >= 0 ? this.blockStart : this.lineStart
      if (text.length - tailStart <= MAX_SUSPENSION_BYTES) return

      const limit = tailStart + MAX_SUSPENSION_BYTES
      const newlineIndex = text.lastIndexOf('\n', limit)
      let nextLineStart: number
      let sourceEnd: number
      if (newlineIndex > tailStart) {
        nextLineStart = newlineIndex + 1
        sourceEnd = newlineIndex
      } else {
        nextLineStart = limit
        sourceEnd = limit
      }

      this.emit(text, tailStart, sourceEnd, this.blockKind)
      this.clearOpen()
      this.firstListMarker = null
      this.lineStart = nextLineStart
    }
  }

  /** 流结束：无视挂起，把剩余内容一次性归入闭合块。 */
  private flushRemainder(text: string): void {
    const tailStart = this.blockStart >= 0 ? this.blockStart : this.lineStart
    const source = text.slice(tailStart).replace(/\n+$/, '')
    if (source.trim()) {
      this.closedBlocks = this.closedBlocks.concat({ id: String(this.nextId++), source, kind: this.blockKind })
    }
    this.clearOpen()
    this.lineStart = text.length
  }
}

/** UI 复制层仍只认识 markdown/table；code/custom_tag 按普通 markdown 块参与复制。 */
export function toAgentMarkdownBlock(block: StreamBlock): AgentMarkdownBlock {
  return {
    id: block.id,
    source: block.source,
    kind: block.kind === 'table' ? 'table' : 'markdown',
  }
}
