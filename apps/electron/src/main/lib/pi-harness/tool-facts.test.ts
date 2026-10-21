import { describe, expect, test } from 'bun:test'
import { createToolFact } from './tool-facts'

const context = { goalId: 'goal', turnId: 'turn', taskId: 'task' }

describe('Pi Harness tool facts', () => {
  test('records a bounded file mutation fact without persisting file contents', () => {
    const fact = createToolFact(context, {
      toolUseId: 'write-1', toolName: 'Write', input: { file_path: 'src\\secret.ts', content: 'api_key=sk_should_not_appear' }, result: 'Wrote 100 bytes',
    })!
    expect(fact).toMatchObject({ kind: 'file_mutation', outcome: 'success', subject: { path: 'src/secret.ts' }, fingerprint: 'write-1' })
    expect(JSON.stringify(fact)).not.toContain('sk_should_not_appear')
    expect(JSON.stringify(fact)).not.toContain('api_key=')
  })

  test('classifies test command success and failure by actual exit evidence', () => {
    const success = createToolFact(context, {
      toolName: 'Bash', input: { command: 'bun test src/a.test.ts' }, result: '12 pass\nexit code 0',
    })!
    const failure = createToolFact(context, {
      toolName: 'Bash', input: { command: 'bun test src/a.test.ts' }, result: '1 fail\n退出码 1',
    })!
    expect(success).toMatchObject({ kind: 'verification_command', outcome: 'success', subject: { category: 'test', exitCode: 0 } })
    expect(failure).toMatchObject({ kind: 'verification_command', outcome: 'failure', subject: { category: 'test', exitCode: 1 } })
  })

  test('prefers structured process evidence over contradictory tool result text', () => {
    const fact = createToolFact(context, {
      toolName: 'Bash',
      input: { command: 'bun test src/a.test.ts' },
      result: '12 pass\nexit code 0',
      executionResult: {
        stdout: 'partial output',
        stderr: '',
        exitCode: null,
        signal: 'SIGKILL',
        timedOut: true,
        aborted: false,
        durationMs: 50,
        shell: '/bin/bash',
        cwd: '/workspace',
        truncated: false,
      },
    })!

    expect(fact).toMatchObject({
      kind: 'verification_command',
      outcome: 'failure',
      subject: {
        category: 'test',
        executionEvidence: 'structured_execution',
        signal: 'SIGKILL',
        timedOut: true,
        shell: '/bin/bash',
      },
    })
    expect(fact.subject).not.toHaveProperty('exitCode')
  })

  test('persists structured command failure classification without command output', () => {
    const fact = createToolFact(context, {
      toolName: 'Bash',
      input: { command: 'bun test src/a.test.ts' },
      result: 'Bash 启动失败',
      executionResult: {
        stdout: '',
        stderr: 'spawn ENOENT',
        exitCode: null,
        signal: null,
        timedOut: false,
        aborted: false,
        durationMs: 3,
        shell: '/definitely/missing/profer-bash',
        cwd: '/workspace',
        truncated: false,
        errorKind: 'shell_not_found',
        errorCode: 'ENOENT',
      },
      isError: true,
    })!

    expect(fact).toMatchObject({
      kind: 'verification_command',
      outcome: 'failure',
      subject: {
        executionEvidence: 'structured_execution',
        errorKind: 'shell_not_found',
        errorCode: 'ENOENT',
      },
    })
    expect(JSON.stringify(fact)).not.toContain('spawn ENOENT')
  })

  test('accepts structured exit zero as process success for a finite verification command', () => {
    const fact = createToolFact(context, {
      toolName: 'Bash',
      input: { command: 'bun run typecheck' },
      result: 'human-readable output without exit marker',
      executionResult: {
        stdout: '',
        stderr: '',
        exitCode: 0,
        signal: null,
        timedOut: false,
        aborted: false,
        durationMs: 25,
        shell: '/bin/bash',
        cwd: '/workspace',
        truncated: false,
      },
    })!

    expect(fact).toMatchObject({
      kind: 'verification_command',
      outcome: 'success',
      subject: { category: 'typecheck', exitCode: 0, executionEvidence: 'structured_execution' },
    })
  })

  test('accepts a successful finite Pi tool result without a textual exit marker', () => {
    const fact = createToolFact(context, {
      toolName: 'Bash', input: { command: 'bun test src/a.test.ts' }, result: [{ type: 'text', text: '1 pass' }], isError: false,
    })!
    expect(fact).toMatchObject({
      kind: 'verification_command',
      outcome: 'success',
      subject: { category: 'test', executionEvidence: 'tool_result_success' },
    })
    expect(fact.subject).not.toHaveProperty('exitCode')
  })

  test('keeps external calls non-verifying even when their tool result is not an error', () => {
    const fact = createToolFact(context, { toolName: 'BrowserClick', input: {}, result: 'ok' })!
    expect(fact).toMatchObject({ kind: 'external_or_unknown', outcome: 'unknown' })
  })

  test('审核域工具记为 review_operation 且按结构化结果给出真实 outcome', () => {
    // 真实案卷读取结果（review_read_documents）：成功批次
    const read = createToolFact(context, {
      toolUseId: 'chatcmpl-tool-a46e656b26e652fb',
      toolName: 'review_read_documents',
      input: { documents: [{ documentVersionId: 'doc-1-v1' }] },
      result: [{ type: 'text', text: JSON.stringify({ results: [{ ok: true, documentVersionId: 'doc-1-v1' }], acceptedCount: 1, rejectedCount: 0 }) }],
    })!
    expect(read).toMatchObject({
      kind: 'review_operation',
      outcome: 'success',
      fingerprint: 'chatcmpl-tool-a46e656b26e652fb',
    })
    expect(read.summary).toBe('review_read_documents success')
    // 不持久化材料正文，只保留结果摘要哈希
    expect(JSON.stringify(read)).not.toContain('doc-1-v1')

    // 整批读取被拒（业务失败但不是协议错误）
    const rejected = createToolFact(context, {
      toolName: 'review_read_documents',
      input: {},
      result: [{ type: 'text', text: JSON.stringify({ results: [{ ok: false, error: '文档不存在' }] }) }],
    })!
    expect(rejected).toMatchObject({ kind: 'review_operation', outcome: 'failure' })

    // 提交结果被拒
    const submitRejected = createToolFact(context, {
      toolName: 'review_submit_result',
      input: {},
      result: JSON.stringify({ ok: false, rejected: [{ ruleId: 'r1' }] }),
    })!
    expect(submitRejected).toMatchObject({ kind: 'review_operation', outcome: 'failure' })

    // 协议层错误
    const protocolError = createToolFact(context, {
      toolName: 'review_inspect_document_image',
      input: {},
      result: 'boom',
      isError: true,
    })!
    expect(protocolError).toMatchObject({ kind: 'review_operation', outcome: 'failure' })
  })
})
