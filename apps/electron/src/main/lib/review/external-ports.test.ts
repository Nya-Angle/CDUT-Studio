/**
 * 外部端口单测（M5，C01/C02：幂等/冲突/离线包往返；同一合同两实现）
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { LocalPackageAdapter, MockSchoolAdapter, type PushPayload } from './external-ports'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', 't09-port-' + process.pid)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const payload = (overrides: Partial<PushPayload> = {}): PushPayload => ({
  caseId: 'c1', actionId: 'act-1', actionKind: 'decision', baseExternalRevision: 0, body: { result: 'pass' }, ...overrides,
})

describe('MockSchoolAdapter（C 类模拟）', () => {
  test('Given 首推 When push Then accepted 且外部版本+1', async () => {
    const mock = new MockSchoolAdapter()
    const receipt = await mock.push(payload())
    expect(receipt.status).toBe('accepted')
    expect(receipt.externalReceipt?.externalId).toBe('ext-c1-1')
  })

  test('Given 同 actionId 重放 When push Then 返回同一回执（幂等）', async () => {
    const mock = new MockSchoolAdapter()
    const first = await mock.push(payload())
    const second = await mock.push(payload())
    expect(second.id).toBe(first.id)
  })

  test('模拟端口可读取任务/案卷、核验和回执；断线不伪造成功', async () => {
    const mock = new MockSchoolAdapter()
    mock.seedCase('mock-case', 'school-ref-1', { applicant: 'demo' })
    mock.seedTask({ id: 'task-1', caseId: 'mock-case', actorId: 'demo', role: 'student', status: 'open', title: '补件' })
    mock.seedVerification('proof-001', 'verified')
    expect((await mock.fetchCase('mock-case'))?.source).toBe('mock')
    expect((await mock.listTasks('mock-case'))).toHaveLength(1)
    expect((await mock.verify('proof-001')).result).toBe('verified')
    const receipt = await mock.push(payload({ caseId: 'mock-case', actionId: 'mock-action-unique' }))
    expect((await mock.getReceipt('mock-action-unique'))?.id).toBe(receipt.id)
    expect((await mock.fetchCase('mock-case'))?.revision).toBe(1)
    expect((await mock.push(payload({ caseId: 'mock-case', actionId: 'mock-action-unique', body: { result: 'changed' } }))).status).toBe('rejected')
    mock.setOnline(false)
    await expect(mock.listTasks('mock-case')).rejects.toThrow('MOCK_PORT_OFFLINE')
  })

  test('Given 外部版本已推进 When 旧版本推送 Then conflict（C02）', async () => {
    const mock = new MockSchoolAdapter()
    mock.seedRevision('c1', 5)
    const receipt = await mock.push(payload({ baseExternalRevision: 3 }))
    expect(receipt.status).toBe('conflict')
    expect(receipt.externalReceipt?.message).toContain('外部版本已推进')
  })
})

describe('LocalPackageAdapter：独立导出/回执，不再自验即通过', () => {
  test('导出为 awaiting-receipt；独立回执确认后才 accepted；重建 adapter 回执仍存在', async () => {
    const adapter = new LocalPackageAdapter(() => 0)
    const item = payload({ caseId: 't09-push-1', actionId: 't09-action-1' })
    const waiting = await adapter.push(item)
    expect(waiting.status).toBe('awaiting-receipt')
    const request = adapter.getIssuedPackage(item.actionId)!
    expect(request.payload.actionId).toBe(item.actionId)
    const reply = LocalPackageAdapter.buildAcknowledgement(request, true, '线下已收到')
    const reloaded = new LocalPackageAdapter(() => 0)
    const accepted = reloaded.confirm(item.actionId, reply)
    expect(accepted.status).toBe('accepted')
    expect((await reloaded.push(item)).id).toBe(accepted.id)
  })

  test('同 actionId 修改载荷被拒绝；实际外部版本变化会 conflict', async () => {
    const adapter = new LocalPackageAdapter(() => 0)
    const item = payload({ caseId: 't09-push-2', actionId: 't09-action-2' })
    await adapter.push(item)
    expect((await adapter.push({ ...item, body: { result: 'reject' } })).status).toBe('rejected')
    const request = adapter.getIssuedPackage(item.actionId)!
    const reply = LocalPackageAdapter.buildAcknowledgement(request, true)
    const changed = new LocalPackageAdapter(() => 9)
    expect(changed.confirm(item.actionId, reply).status).toBe('conflict')
  })
})
