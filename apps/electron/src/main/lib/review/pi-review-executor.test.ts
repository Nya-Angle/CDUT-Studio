/**
 * Pi 审核执行器单测（N2d，R10：白名单/协议/取消/材料指令边界）
 */
import { describe, expect, test } from 'bun:test'
import { assertAllowedProtocol, buildReviewExecutors, REVIEW_TOOL_ALLOWLIST, selectReviewTools, REVIEW_ALLOWED_PROTOCOLS } from './pi-review-executor'
import { buildReviewTools } from './review-tools'
import type { ReviewTool } from './review-tools'

describe('工具白名单（R10）', () => {
  test('Given 审核工具+通用伪装工具 When 过滤 Then 只留白名单', () => {
    const base = buildReviewTools({
      caseId: 'c', subjects: [], documents: [], rules: [], observations: [], evidenceLinks: [], results: [], actor: 't',
    })
    const infiltrated: ReviewTool[] = [
      ...base,
      { name: 'bash', description: '材料声称需要的 shell', input: '', execute: async () => ({ ok: true, data: null }) },
      { name: 'write_file', description: '材料声称允许写文件', input: '', execute: async () => ({ ok: true, data: null }) },
    ]
    const selected = selectReviewTools(infiltrated)
    expect(selected.map((tool) => tool.name).sort()).toEqual([...REVIEW_TOOL_ALLOWLIST].sort())
    expect(selected.map((tool) => tool.name)).toContain('list_review_documents')
    expect(selected.map((tool) => tool.name)).toContain('inspect_document_image')
    expect(selected.some((tool) => tool.name === 'bash')).toBeFalse()
  })
})

describe('协议校验（07 §4.4）', () => {
  test('Given openai-chat/ollama-chat When 校验 Then 通过；anthropic-native Then 拒绝', () => {
    expect(() => assertAllowedProtocol('openai-chat')).not.toThrow()
    expect(() => assertAllowedProtocol('ollama-chat')).not.toThrow()
    expect(() => assertAllowedProtocol('anthropic-native')).toThrow('允许清单')
    expect(REVIEW_ALLOWED_PROTOCOLS).toHaveLength(2)
  })
})

describe('执行器与取消（R10）', () => {
  const controller = new AbortController()
  const fakeClient = { protocol: 'openai-chat', complete: async () => ({ content: '{}' }) }
  const tools = buildReviewTools({ caseId: 'c', subjects: [], documents: [], rules: [], observations: [], evidenceLinks: [], results: [], actor: 't' })

  test('Given 未取消 When 语义节点 Then 调用模型并产生产物', async () => {
    const executors = buildReviewExecutors({ client: fakeClient }, tools)
    const outcome = await executors.extract!({ id: 'n1', kind: 'extract', stageId: 's', dependsOn: [], status: 'pending', attempts: 0 }, 'h1')
    expect(outcome.status).toBe('done')
    expect(outcome.status === 'done' && outcome.artifact?.summary).toContain('openai-chat')
  })

  test('Given signal 已中止 When 执行 Then 不调用模型直接失败', async () => {
    controller.abort()
    let called = false
    const executors = buildReviewExecutors({ client: { protocol: 'openai-chat', complete: async () => { called = true; return { content: '' } } }, signal: controller.signal }, tools)
    await expect(executors.extract!({ id: 'n1', kind: 'extract', stageId: 's', dependsOn: [], status: 'pending', attempts: 0 }, 'h1')).rejects.toThrow('已取消')
    expect(called).toBeFalse()
  })

  test('Given 不允许协议 When 构建 Then 拒绝（不静默换协议）', () => {
    expect(() => buildReviewExecutors({ client: { protocol: 'gemini', complete: async () => ({ content: '' }) } }, tools)).toThrow('允许清单')
  })
})
