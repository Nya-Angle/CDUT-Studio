import { describe, expect, test } from 'bun:test'
import { parseAgentMarkdownBlocks } from '@/components/ai-elements/agent-block-copy'
import { StreamBlockAutomaton, toAgentMarkdownBlock } from './stream-block-automaton'

describe('StreamBlockAutomaton 基础分块', () => {
  test('已出现的后续段落确认前一段闭合，尾部保留正在打字的第二段', () => {
    const automaton = new StreamBlockAutomaton()
    const first = automaton.feed('第一段\n\n第二段已出现', false)

    expect(first.closedBlocks.map((block) => block.source)).toEqual(['第一段'])
    expect(first.activeTail).toBe('第二段已出现')
    expect(first.activeTailKind).toBe('markdown')

    const second = automaton.feed('第一段\n\n第二段已出现\n\n第三段', false)
    expect(second.closedBlocks.map((block) => block.id)).toEqual(['0', '1'])
    expect(second.closedBlocks[0]!.source).toBe('第一段')
    expect(second.closedBlocks[1]!.source).toBe('第二段已出现')
    expect(second.activeTail).toBe('第三段')
  })

  test('未闭合的代码围栏内部空行不会提前拆分', () => {
    const automaton = new StreamBlockAutomaton()
    const partial = '```ts\nconst a = 1\n\nconst b = 2'
    const first = automaton.feed(partial, false)

    expect(first.closedBlocks).toHaveLength(0)
    expect(first.activeTailKind).toBe('code')
    expect(first.activeTail).toContain('const a = 1')
    expect(first.activeTail).toContain('const b = 2')

    const closed = automaton.feed(`${partial}\n\n\nstill\n\`\`\`\n`, false)
    expect(closed.closedBlocks).toHaveLength(1)
    expect(closed.closedBlocks[0]!.kind).toBe('code')
    expect(closed.closedBlocks[0]!.source).toBe(`${partial}\n\n\nstill\n\`\`\``)
    expect(closed.activeTail).toBe('')
  })

  test('波浪线围栏与长度不足的 closer 不闭合', () => {
    const automaton = new StreamBlockAutomaton()
    const text = '~~~~js\ninside\n~~~\nstill code\n~~~~\n\n\nafter'

    const beforeCloser = automaton.feed('~~~~js\ninside\n~~~\nstill code', false)
    expect(beforeCloser.closedBlocks).toHaveLength(0)
    expect(beforeCloser.activeTailKind).toBe('code')

    const afterCloser = automaton.feed(text, false)
    expect(afterCloser.closedBlocks.map((block) => block.kind)).toEqual(['code'])
    expect(afterCloser.closedBlocks[0]!.source).toBe('~~~~js\ninside\n~~~\nstill code\n~~~~')
  })

  test('Setext 下划线挂起到下一分块确认，随后与段落合并为单块', () => {
    const automaton = new StreamBlockAutomaton()
    const suspended = automaton.feed('Title\n\n', false)

    expect(suspended.closedBlocks).toHaveLength(0)
    expect(suspended.activeTail).toBe('Title\n\n')

    const merged = automaton.feed('Title\n\n===\n\nNext', false)
    expect(merged.closedBlocks.map((block) => block.kind)).toEqual(['markdown'])
    expect(merged.closedBlocks[0]!.source).toBe('Title\n\n===')
    expect(merged.activeTail).toBe('Next')
  })

  test('64KB 高水位熔断会切出闭合块并让尾部回落', () => {
    const automaton = new StreamBlockAutomaton()
    const oversized = 'x'.repeat(70 * 1024)
    const result = automaton.feed(oversized, false)

    expect(result.closedBlocks.length).toBeGreaterThan(0)
    expect(result.activeTail.length).toBeLessThan(70 * 1024)
    expect(result.closedBlocks[0]!.source.length).toBe(64 * 1024)
    expect(result.activeTail).toBe(oversized.slice(64 * 1024))
  })

  test('流结束级联拆卸把所有悬挂尾部一次性弹出', () => {
    const automaton = new StreamBlockAutomaton()
    const result = automaton.feed('a\n\n```js\nconst x = 1', true)

    expect(result.closedBlocks.map((block) => block.source)).toEqual(['a', '```js\nconst x = 1'])
    expect(result.closedBlocks[1]!.kind).toBe('code')
    expect(result.activeTail).toBe('')
  })

  test('终态之后再进入流式会重置上一轮历史块', () => {
    const automaton = new StreamBlockAutomaton()
    const done = automaton.feed('a\n\nb', true)
    expect(done.closedBlocks.map((block) => block.source)).toEqual(['a', 'b'])

    const restarted = automaton.feed('c', false)
    expect(restarted.closedBlocks).toHaveLength(0)
    expect(restarted.activeTail).toBe('c')
  })

  test('表格识别为 table 块并参与复制层映射', () => {
    const automaton = new StreamBlockAutomaton()
    const result = automaton.feed('| A | B |\n| --- | --- |\n| 1 | 2 |\n\nnext', false)

    expect(result.closedBlocks).toHaveLength(1)
    expect(result.closedBlocks[0]!.kind).toBe('table')
    expect(toAgentMarkdownBlock(result.closedBlocks[0]!).kind).toBe('table')
    expect(result.activeTail).toBe('next')
  })
})

describe('StreamBlockAutomaton 与全量解析器终态对齐', () => {
  const samples = [
    '第一段很长\n仍是第一段\n\n## 标题\n\n```ts\nconst value = 1\nconsole.log(value)\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |',
    '- parent\n  - child\n  - child2\n- sibling\n\nnext',
    '> line one\n> line two\n\n> line three\n\nnext',
    '# H1\n\n---\n\nparagraph',
    '1.\n2) item\n3.\n\nnext',
  ]

  for (const sample of samples) {
    test(`终态块边界与 parseAgentMarkdownBlocks 一致：${sample.slice(0, 12)}`, () => {
      const automaton = new StreamBlockAutomaton()
      const result = automaton.feed(sample, true)
      const expected = parseAgentMarkdownBlocks(sample)

      expect(result.closedBlocks.map((block) => block.source)).toEqual(expected.map((block) => block.source))
      expect(result.activeTail).toBe('')
    })
  }
})
