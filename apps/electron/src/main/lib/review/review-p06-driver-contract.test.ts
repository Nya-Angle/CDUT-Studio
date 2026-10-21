/** The local P06 electron driver must remain parseable and explicit about its gates.
 * This does NOT execute the Electron/Pi/provider real-world test.
 */
import { describe, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const contract = await import(new URL('../../../../../../scripts/qa/review-background-p06-contract.mjs', import.meta.url).href) as {
  roundOwnerId(caseId: string, runId: string, owners: Array<{ id: string; owner: { kind: string; caseId: string } }>, assignments: Array<{ caseId: string; activeRunId: string; sessionId: string; revokedAt?: string }>): string
  verifyOwnerTransition(mode: string, firstId: string, secondId: string, before: string[], after: string[]): boolean
  providerWitness(messages: unknown[]): { assistantReplies: number; toolCalls: string[] }
}
const owners = [{ id: 'synthetic-old', owner: { kind: 'review-case', caseId: 'case-a' } },
  { id: 'synthetic-new', owner: { kind: 'review-case', caseId: 'case-a' } }]
const grant = (sessionId: string) => ({ caseId: 'case-a', activeRunId: 'run-second', sessionId })

describe('P06-S02 验收驱动合同（静态与纯函数，不冒称实机）', () => {
  test('Node parses the standalone CDP replay script without loading credentials', () => {
    const path = resolve(import.meta.dir, '../../../../../../scripts/qa/review-background-p06.mjs')
    expect(() => execFileSync('node', ['--check', path], { stdio: 'pipe', timeout: 10000 })).not.toThrow()
    const source = readFileSync(path, 'utf8')
    expect(source).toContain('P06-S02-E01')
    expect(source).toContain('P06-S02-E02')
    expect(source).toContain('runTwice')
    expect(source).toContain('p06-summary.json')
    expect(source).toContain('waitProvider')
    expect(source).toContain('真实界面停止收尾并可重新审核')
  })

  test('同 owner update 与唯一新 owner restart 的实际绑定可通过', () => {
    const old = contract.roundOwnerId('case-a', 'run-second', owners, [grant('synthetic-old')])
    expect(contract.verifyOwnerTransition('update', 'synthetic-old', old, ['synthetic-old'], ['synthetic-old'])).toBeTrue()
    const next = contract.roundOwnerId('case-a', 'run-second', owners, [grant('synthetic-new')])
    expect(contract.verifyOwnerTransition('restart', 'synthetic-old', next, ['synthetic-old'], ['synthetic-old', 'synthetic-new'])).toBeTrue()
  })

  test('旧 owner 仍存在但 update 实际绑定新 owner 必须拒绝', () => {
    const next = contract.roundOwnerId('case-a', 'run-second', owners, [grant('synthetic-new')])
    expect(() => contract.verifyOwnerTransition('update', 'synthetic-old', next, ['synthetic-old'], owners.map(x => x.id))).toThrow('未实际复用')
  })

  test('多出一个未使用 owner 不能掩盖 restart 实际复用旧 owner', () => {
    const old = contract.roundOwnerId('case-a', 'run-second', owners, [grant('synthetic-old')])
    expect(() => contract.verifyOwnerTransition('restart', 'synthetic-old', old, ['synthetic-old'], owners.map(x => x.id))).toThrow('未实际绑定')
  })

  test('指派缺失、撤销、重复或 owner 跨案时不产生归属证明', () => {
    expect(() => contract.roundOwnerId('case-a', 'run-second', owners, [])).toThrow('唯一有效')
    expect(() => contract.roundOwnerId('case-a', 'run-second', owners, [{ ...grant('synthetic-old'), revokedAt: 'synthetic-date' }])).toThrow('唯一有效')
    expect(() => contract.roundOwnerId('case-a', 'run-second', owners, [grant('synthetic-old'), grant('synthetic-new')])).toThrow('唯一有效')
    expect(() => contract.roundOwnerId('case-a', 'run-second', [{ ...owners[0]!, owner: { kind: 'review-case', caseId: 'case-b' } }], [grant('synthetic-old')])).toThrow('本案审核 owner')
  })

  test('只看到 ACK、空 assistant 或旧非 assistant 数据不能冒充 provider 回复', () => {
    expect(contract.providerWitness([{ type: 'assistant', message: { usage: { input_tokens: 0, output_tokens: 0 }, content: [] } }]).assistantReplies).toBe(0)
    expect(contract.providerWitness([{ type: 'user', message: { usage: { input_tokens: 20 }, content: [] } }]).assistantReplies).toBe(0)
    expect(contract.providerWitness([{ type: 'assistant', message: { usage: { input_tokens: 20, output_tokens: 4 }, content: [{ type: 'tool_use', name: 'review_read_documents' }] } }])).toEqual({ assistantReplies: 1, toolCalls: ['review_read_documents'] })
  })
})
