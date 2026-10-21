/**
 * N5/N6 单测（R08：定稿锁定/重开；R11：outbox 重启幂等/冲突持久）
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewBatch, ReviewCaseV2 } from '@profer/shared'
import { createAggregate, readAggregate, submitCommand } from './case-store-v2'
import { createBatchV2, finalizeBatch, listBatchStatesV2, pushViaOutbox, recoverPendingPushesDetailed, recoverPendingPushes, readBatchStateV2, readFinalizedSnapshot, reopenBatch, updateCaseStatus, runBatchQueue, retryBatchCases, recoverInterruptedBatch } from './batch-store'
import type { BatchStateV2 } from '@profer/shared'
type Entry = BatchStateV2['cases'][number]
import { MockSchoolAdapter } from './external-ports'
import type { SchoolPort, PushPayload } from './external-ports'

const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-batch-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR
afterAll(() => rmSync(CONFIG_DIR, { recursive: true, force: true }))

const batch = (id: string): ReviewBatch => ({ id, name: `批次${id}`, templateId: 't', templateVersion: 1, policyVersionLock: [{ policyVersionId: 'p', version: 1 }], caseIds: ['c1', 'c2'], createdAt: new Date().toISOString() })

async function seedFinalCase(caseId: string, options: { final?: boolean; supplement?: boolean; appeal?: boolean } = {}): Promise<void> {
  const caseV2: ReviewCaseV2 = {
    id: caseId, templateId: 't', templateVersion: 1, title: caseId,
    objectType: 'person', caseFields: {}, subjects: [], documents: [],
    stage: 'reviewing', revision: 0, createdAt: '2026-10-10T00:00:00Z', updatedAt: '2026-10-10T00:00:00Z',
  }
  await createAggregate(caseId, caseV2)
  const result = await submitCommand(caseId, {
    requestId: `seed-final-${caseId}`,
    actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
    expectedRevision: 0,
    type: 'TestSeedDecision',
    payload: {},
  }, () => ({
    summary: '验收测试：预置正式决定和待处理事项',
    mutate: (agg) => {
      agg.caseV2.stage = 'decided'
      if (options.final !== false) {
        agg.decisions.push({
          id: `decision-${caseId}`,
          actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
          stageId: 'final', scope: { kind: 'case', ids: [] }, result: 'pass',
          reason: '单案审核正式完成', basedOnRunId: 'test-run', basedOnRevision: 0,
          at: '2026-10-10T00:00:00Z', finality: 'final',
        })
      }
      if (options.supplement) agg.supplements.push({
        id: `sup-${caseId}`, caseId, originFindingKeys: [], requiredElements: ['身份材料'],
        reason: '补件尚未处理', responsibleRole: 'student', status: 'open',
        responses: [], createdAt: '2026-10-10T00:00:00Z',
      })
      if (options.appeal) agg.appeals.push({
        id: `appeal-${caseId}`, caseId, againstDecisionId: `decision-${caseId}`,
        appellant: { actorId: 'student', actorSource: 'local' },
        statement: '请求复核', newEvidenceDocumentVersionIds: [],
        status: 'in-review', createdAt: '2026-10-10T00:00:00Z',
      })
    },
  }))
  expect(result.ok).toBeTrue()
}

describe('批次状态机（R08）', () => {
  test('Given 多个已保存批次 When 查询目录 Then 返回全部批次并按创建时间倒序', () => {
    createBatchV2({ ...batch('list-old'), createdAt: '2026-10-01T00:00:00.000Z' })
    createBatchV2({ ...batch('list-new'), createdAt: '2026-10-02T00:00:00.000Z' })
    const listedIds = listBatchStatesV2().map((state) => state.batch.id)
    expect(listedIds.indexOf('list-new')).toBeLessThan(listedIds.indexOf('list-old'))
  })

  test('Given 案卷尚未处理或失败 When 定稿 Then 拒绝且保留未定稿状态', () => {
    for (const status of ['queued', 'failed', 'paused'] as const) {
      const id = `unfinished-${status}`
      createBatchV2(batch(id))
      updateCaseStatus(id, 'c1', status)
      updateCaseStatus(id, 'c2', 'done')
      expect(() => finalizeBatch(id, {})).toThrow('未完成')
      expect(readBatchStateV2(id)?.status).toBe('draft')
    }
    expect(() => createBatchV2({ ...batch('empty'), caseIds: [] })).toThrow('必须选择有效案卷')
    expect(readBatchStateV2('empty')).toBeUndefined()
  })
  test('Given 创建+单案失败+重试 When 操作 Then 案卷级状态独立（坏案不阻塞全批）', () => {
    createBatchV2(batch('b1'))
    updateCaseStatus('b1', 'c1', 'failed', '坏文件')
    const state = readBatchStateV2('b1')!
    expect(state.cases.find((entry: Entry) => entry.caseId === 'c1')?.status).toBe('failed')
    expect(state.cases.find((entry: Entry) => entry.caseId === 'c2')?.status).toBe('queued') // c2 不受影响
    const retried = updateCaseStatus('b1', 'c1', 'queued')
    expect(retried.cases.find((entry: Entry) => entry.caseId === 'c1')?.status).toBe('queued')
  })

  test('Given 所有案卷均有正式终态 When 定稿 Then 快照 hash 锁定；再变更被拒；重开=新轮次', async () => {
    await seedFinalCase('b2-c1')
    await seedFinalCase('b2-c2')
    createBatchV2({ ...batch('b2'), caseIds: ['b2-c1', 'b2-c2'] })
    updateCaseStatus('b2', 'b2-c1', 'done')
    updateCaseStatus('b2', 'b2-c2', 'done')
    const finalized = finalizeBatch('b2', { ranking: [{ caseId: 'b2-c1', rank: 1 }] })
    expect(finalized.status).toBe('finalized')
    expect(finalized.finalizedSnapshotHash).toHaveLength(64)
    expect(readFinalizedSnapshot('b2')).toEqual({ ranking: [{ caseId: 'b2-c1', rank: 1 }] })
    expect(() => finalizeBatch('b2', { ranking: [] })).toThrow('重开')
    expect(() => updateCaseStatus('b2', 'c1', 'queued')).toThrow('重开')
    const reopened = reopenBatch('b2', 'b2-r2', '评分复核')
    expect(reopened.round).toBe(2)
    expect(reopened.status).toBe('draft')
    expect(reopened.reopenedFromBatchId).toBe('b2')
    // 原定稿不改写
    expect(readBatchStateV2('b2')?.finalizedSnapshotHash).toBe(finalized.finalizedSnapshotHash)
  })

  test('Given 队列全部 done 但无任何正式业务决定 When 直接调用底层 finalizeBatch Then 禁止绕过', () => {
    const id = 'finalization-no-decision'
    createBatchV2(batch(id))
    updateCaseStatus(id, 'c1', 'done')
    updateCaseStatus(id, 'c2', 'done')
    expect(() => finalizeBatch(id, { arbitrary: 'unsafe' })).toThrow('正式业务终态')
    expect(readBatchStateV2(id)?.status).not.toBe('finalized')
  })

  test('Given 进入 decided 但最终决定不存在 When 定稿 Then 不把已审完冒充正式决定', async () => {
    const caseId = 'finalization-stage-only'
    await seedFinalCase(caseId, { final: false })
    const id = 'finalization-stage-only-batch'
    createBatchV2({ ...batch(id), caseIds: [caseId] })
    updateCaseStatus(id, caseId, 'done')
    expect(() => finalizeBatch(id, {})).toThrow('最终业务决定')
  })

  test('Given 正式决定已写入但补件或申诉还未结束 When 定稿 Then 阻止冻结', async () => {
    for (const type of ['supplement', 'appeal'] as const) {
      const caseId = `finalization-${type}-case`
      await seedFinalCase(caseId, { [type]: true })
      const id = `finalization-${type}-batch`
      createBatchV2({ ...batch(id), caseIds: [caseId] })
      updateCaseStatus(id, caseId, 'done')
      expect(() => finalizeBatch(id, {})).toThrow(type === 'supplement' ? '补件' : '申诉')
      expect(readBatchStateV2(id)?.status).not.toBe('finalized')
    }
  })

  test('Given 批次路径使用穿越、绝对路径或分隔符 When 创建/读取/重开 Then 拒绝', async () => {
    for (const badId of ['../evil', '..', '.', '/tmp/evil', 'a/b', 'a\\\\b', 'good..bad', '%2Fbad', '', ' space', 'x'.repeat(129)]) {
      expect(() => createBatchV2(batch(badId))).toThrow('非法批次 ID')
      expect(() => readBatchStateV2(badId)).toThrow('非法批次 ID')
    }
    await seedFinalCase('finalization-safe-reopen')
    const id = 'finalization-safe-batch'
    createBatchV2({ ...batch(id), caseIds: ['finalization-safe-reopen'] })
    updateCaseStatus(id, 'finalization-safe-reopen', 'done')
    finalizeBatch(id, {})
    expect(() => reopenBatch(id, '../escape', '用户输入')).toThrow('非法批次 ID')
    expect(readBatchStateV2(id)?.status).toBe('finalized')
  })

  test('Given 有运行中案卷 When 定稿 Then 拒绝', () => {
    createBatchV2(batch('b3'))
    updateCaseStatus('b3', 'c1', 'running')
    expect(() => finalizeBatch('b3', {})).toThrow('运行中')
  })
})

describe('批次中断恢复与定向重试（B 切片）', () => {
  test('Given 上次进程中断的 running 案卷 When 显式恢复 Then 失败标记等待人工确认，其他状态不变', () => {
    createBatchV2({ ...batch('recover-orphan'), caseIds: ['c1', 'c2', 'c3'] })
    const state = readBatchStateV2('recover-orphan')!
    state.status = 'running'
    state.cases = [
      { caseId: 'c1', status: 'running' },
      { caseId: 'c2', status: 'done' },
      { caseId: 'c3', status: 'failed', error: '此前失败' },
    ]
    const { saveBatchStateV2 } = require('./batch-store') as typeof import('./batch-store')
    saveBatchStateV2(state)
    const recovered = recoverInterruptedBatch('recover-orphan')
    expect(recovered.status).toBe('queued')
    expect(recovered.cases[0]?.status).toBe('failed')
    expect(recovered.cases[0]?.error).toContain('中断')
    expect(recovered.cases[1]?.status).toBe('done')
    expect(recovered.cases[2]?.error).toBe('此前失败')
  })

  test('Given 失败和成功共存 When 选择单个失败案卷重试 Then 只执行选中的失败项', async () => {
    createBatchV2({ ...batch('retry-specific'), caseIds: ['c1', 'c2', 'c3'] })
    updateCaseStatus('retry-specific', 'c1', 'failed', '解析失败')
    updateCaseStatus('retry-specific', 'c2', 'failed', '服务异常')
    updateCaseStatus('retry-specific', 'c3', 'done')
    retryBatchCases('retry-specific', ['c1'])
    const executed: string[] = []
    const result = await runBatchQueue('retry-specific', { runCase: async (id) => { executed.push(id); return { status: 'completed' } } })
    expect(executed).toEqual(['c1'])
    expect(result.cases.find((x) => x.caseId === 'c2')?.status).toBe('failed')
    expect(result.cases.find((x) => x.caseId === 'c3')?.status).toBe('done')
  })

  test('Given done 但检查账本缺失 When 手动重试 Then 允许重新审核技术异常案卷', () => {
    const id = 'retry-invalid-done'
    createBatchV2({ ...batch(id), caseIds: ['no-usable-run'] })
    updateCaseStatus(id, 'no-usable-run', 'done')
    const state = retryBatchCases(id, ['no-usable-run'])
    expect(state.cases[0]?.status).toBe('queued')
  })

  test('Given done 且审核记录有效 When 请求重试 Then 不允许重复审核成功案卷', async () => {
    const id = 'retry-valid-done'
    const caseId = 'retry-valid-done-case'
    createBatchV2({ ...batch(id), caseIds: [caseId] })
    updateCaseStatus(id, caseId, 'done')
    const { saveRunV2 } = await import('./run-store-v2')
    saveRunV2({
      id: 'run-valid-done', caseId, templateId: 't', templateVersion: 1,
      inputManifest: { hash: 'valid-hash', templateVersion: 1, policyVersions: [{ policyVersionId: 'p', version: 1 }],
        documentVersions: [], observationIds: [], evidenceLinkIds: [], effectiveRuleIds: ['rule-1'] },
      status: 'completed', checkpoints: [],
      checks: [{ checkId: 'c1', ruleId: 'rule-1', status: 'compliant', reason: '符合', target: { scope: 'case', subjectIds: [] },
        sourceRefs: [], executedBy: 'deterministic', executedAt: '' }],
      opinions: [],
      coverage: { documents: [], plannedChecks: 1, completedChecks: 1, effectiveVerdicts: 1, pendingChecks: 0 },
      diagnostics: [], startedAt: '2026-10-10T00:00:00Z', completedAt: '2026-10-10T00:00:01Z',
    })
    expect(() => retryBatchCases(id, [caseId])).toThrow('不可重试')
    expect(readBatchStateV2(id)?.cases[0]?.status).toBe('done')
  })

  test('Given 非失败状态或非法案卷 When 批量重试 Then 全部校验通过前不落盘', () => {
    createBatchV2(batch('retry-atomic'))
    updateCaseStatus('retry-atomic', 'c1', 'failed', '之前错误')
    updateCaseStatus('retry-atomic', 'c2', 'queued') // 待执行项不可用“重试失败项”绕过状态门槛
    expect(() => retryBatchCases('retry-atomic', ['c1', 'c2'])).toThrow('不可重试')
    expect(() => retryBatchCases('retry-atomic', ['not-in-batch'])).toThrow('不属于')
    expect(() => retryBatchCases('retry-atomic', ['c1', 'c1'])).toThrow('不能重复')
    expect(readBatchStateV2('retry-atomic')?.cases[0]?.status).toBe('failed')
  })

  test('Given 运行进程仍在执行 When 尝试按崩溃恢复 Then 拒绝中断恢复', async () => {
    createBatchV2({ ...batch('active-run'), caseIds: ['c1'] })
    let signal!: () => void
    let release!: () => void
    const entered = new Promise<void>((resolve) => { signal = resolve })
    const block = new Promise<void>((resolve) => { release = resolve })
    const pending = runBatchQueue('active-run', { runCase: async () => { signal(); await block; return { status: 'completed' } } })
    await entered
    expect(() => recoverInterruptedBatch('active-run')).toThrow('仍在当前进程')
    expect(() => retryBatchCases('active-run', ['c1'])).toThrow('执行中')
    release()
    await pending
    expect(readBatchStateV2('active-run')?.cases[0]?.status).toBe('done')
  })
})

describe('持久 outbox（R11）', () => {
  test('Given 推送成功 When 同 actionId 重放 Then 返回原回执（不重复执行）', async () => {
    const mock = new MockSchoolAdapter()
    const payload = { caseId: 'c1', actionId: 'act-r11', actionKind: 'decision' as const, baseExternalRevision: 0, body: { result: 'pass' } }
    const first = await pushViaOutbox(mock, payload)
    expect(first.status).toBe('accepted')
    const second = await pushViaOutbox(mock, payload)
    expect(second.receipt?.id).toBe(first.receipt?.id) // 持久化原回执
    expect(second.attempts).toBe(1) // 未重试端口
  })

  test('Given 端口冲突 When 推送 Then conflict 持久化；重放返回同回执', async () => {
    const mock = new MockSchoolAdapter()
    mock.seedRevision('c9', 5)
    const payload = { caseId: 'c9', actionId: 'act-conflict', actionKind: 'roster' as const, baseExternalRevision: 3, body: {} }
    const first = await pushViaOutbox(mock, payload)
    expect(first.status).toBe('conflict')
    const second = await pushViaOutbox(mock, payload)
    expect(second.status).toBe('conflict')
    expect(second.receipt?.id).toBe(first.receipt?.id)
  })

  test('Given 同 actionId 不同载荷 When 推送 Then 拒绝', async () => {
    const mock = new MockSchoolAdapter()
    await pushViaOutbox(mock, { caseId: 'c1', actionId: 'act-drift', actionKind: 'decision', baseExternalRevision: 0, body: { result: 'pass' } })
    await expect(pushViaOutbox(mock, { caseId: 'c1', actionId: 'act-drift', actionKind: 'decision', baseExternalRevision: 0, body: { result: 'reject' } })).rejects.toThrow('不同载荷')
  })
})

describe('Outbox 中断恢复与 WAL（第二轮可靠性收口）', () => {
  test('Given 首次推送失败 When 重启扫描 Then 重放持久化的完整原载荷并记录终态回执', async () => {
    const payload = {
      actionId: 'outbox-resume-original', caseId: 'c-outbox-resume',
      actionKind: 'supplement' as const, baseExternalRevision: 7,
      body: { requiredElements: ['成绩单', '获奖证书'], detail: { oldHash: 'sha256:abc', note: '精确恢复' } },
    }
    let attempts = 0
    const submissions: typeof payload[] = []
    const port: SchoolPort = {
      kind: 'mock',
      push: async (data) => {
        attempts++
        submissions.push(structuredClone(data) as typeof payload)
        if (attempts === 1) throw new Error('模拟发送后网络断开')
        return { id: 'receipt-resume', actionId: data.actionId, caseId: data.caseId,
          externalSystem: 'mock-school', expectedExternalRevision: data.baseExternalRevision,
          payloadHash: '', status: 'accepted',
        }
      },
    }
    const first = await pushViaOutbox(port, payload)
    expect(first.status).toBe('pending')
    expect(first.attempts).toBe(1)
    const persisted = JSON.parse(readFileSync(join(CONFIG_DIR, 'sync-outbox', `${payload.actionId}.json`), 'utf-8'))
    expect(persisted.payload).toEqual(payload)
    expect(persisted.payloadHash).toHaveLength(64)

    const recovery = await recoverPendingPushesDetailed(port)
    expect(recovery.needsManualReplay.some((r) => r.actionId === payload.actionId)).toBeFalse()
    expect(recovery.recovered.find((r) => r.actionId === payload.actionId)?.status).toBe('accepted')
    expect(recovery.recovered.find((r) => r.actionId === payload.actionId)?.attempts).toBe(2)
    expect(submissions).toEqual([payload, payload])
    const countBefore = attempts
    await recoverPendingPushes(port)
    expect(attempts).toBe(countBefore)
  })

  test('Given 旧版 pending 只有哈希 When 自动恢复 Then 不得发送占位载荷；需人工核对后原调用方重放', async () => {
    const payload = {
      actionId: 'outbox-legacy-pending', caseId: 'c-legacy',
      actionKind: 'decision' as const, baseExternalRevision: 1, body: { decisionId: 'd-1', result: 'pass' },
    }
    const { createHash } = await import('node:crypto')
    const payloadHash = createHash('sha256').update(JSON.stringify(payload), 'utf-8').digest('hex')
    mkdirSync(join(CONFIG_DIR, 'sync-outbox'), { recursive: true })
    const path = join(CONFIG_DIR, 'sync-outbox', `${payload.actionId}.json`)
    writeFileSync(path, JSON.stringify({ actionId: payload.actionId, payloadHash, status: 'pending', attempts: 1, createdAt: '2026-01-01' }))
    let calls = 0
    const port: SchoolPort = {
      kind: 'mock',
      push: async (data) => {
        calls++
        return { id: 'legacy-receipt', actionId: data.actionId, caseId: data.caseId,
          externalSystem: 'mock-school', expectedExternalRevision: data.baseExternalRevision,
          payloadHash: '', status: 'accepted' }
      },
    }
    const report = await recoverPendingPushesDetailed(port)
    expect(calls).toBe(0)
    expect(report.needsManualReplay.find((r) => r.actionId === payload.actionId)?.reason).toContain('未保存原始载荷')
    expect((JSON.parse(readFileSync(path, 'utf8')) as { attempts: number }).attempts).toBe(1)
    const explicitlyReplayed = await pushViaOutbox(port, payload)
    expect(explicitlyReplayed.status).toBe('accepted')
    expect(explicitlyReplayed.attempts).toBe(2)
    expect(calls).toBe(1)
  })

  test('Given outbox 持久化数据被篡改 When 恢复 Then 不会将伪造数据发给外部端口', async () => {
    const payload = {
      actionId: 'outbox-corrupt-data', caseId: 'c-secure',
      actionKind: 'roster' as const, baseExternalRevision: 3, body: { studentIds: ['stu-1'] },
    }
    const failPort: SchoolPort = { kind: 'mock', push: async () => { throw new Error('offline') } }
    expect((await pushViaOutbox(failPort, payload)).status).toBe('pending')
    const path = join(CONFIG_DIR, 'sync-outbox', `${payload.actionId}.json`)
    const saved = JSON.parse(readFileSync(path, 'utf8'))
    saved.payload.body.studentIds = ['attacker']
    writeFileSync(path, JSON.stringify(saved))
    let calls = 0
    const port: SchoolPort = {
      kind: 'mock',
      push: async () => { calls++; throw new Error('not expected') },
    }
    const report = await recoverPendingPushesDetailed(port)
    expect(calls).toBe(0)
    expect(report.needsManualReplay.find((r) => r.actionId === payload.actionId)?.reason).toContain('校验失败')
    await expect(pushViaOutbox(port, payload)).rejects.toThrow('校验失败')
  })

  test('Given 校方仅返回 awaiting-receipt When 恢复 Then 保持 pending 并复用原 actionId', async () => {
    const payload = { actionId: 'outbox-awaiting-receipt', caseId: 'c-awaiting', actionKind: 'decision' as const,
      baseExternalRevision: 0, body: { result: 'pass' } }
    let calls = 0
    const sent: string[] = []
    const port: SchoolPort = { kind: 'mock', push: async (input) => {
      calls++
      sent.push(input.actionId)
      return { id: `pending-r-${calls}`, actionId: input.actionId, caseId: input.caseId,
        externalSystem: 'mock-school', expectedExternalRevision: input.baseExternalRevision,
        payloadHash: '', status: calls === 1 ? 'awaiting-receipt' : 'accepted' }
    }}
    const first = await pushViaOutbox(port, payload)
    expect(first.status).toBe('pending')
    expect(first.receipt?.status).toBe('awaiting-receipt')
    const report = await recoverPendingPushesDetailed(port)
    expect(report.recovered.find((x) => x.actionId === payload.actionId)?.status).toBe('accepted')
    expect(sent).toEqual([payload.actionId, payload.actionId])
    expect((await recoverPendingPushes(port)).some((item) => item.actionId === payload.actionId)).toBeFalse()
  })

  test('Given 恶意 actionId 和并发调用 When 推送 Then 拒绝路径穿越和双重执行', async () => {
    const port = new MockSchoolAdapter()
    for (const actionId of ['../outside', '..', 'x/y', 'x\\\\y', '/tmp/push', '', 'a'.repeat(130)]) {
      await expect(pushViaOutbox(port, { actionId, caseId: 'c1', actionKind: 'decision',
        baseExternalRevision: 0, body: { result: 'pass' } })).rejects.toThrow('非法 outbox actionId')
    }
    let release!: () => void
    let started!: () => void
    const entered = new Promise<void>((resolve) => { started = resolve })
    const held = new Promise<void>((resolve) => { release = resolve })
    let calls = 0
    const blockingPort: SchoolPort = { kind: 'mock', push: async (data) => {
      calls++
      started()
      await held
      return { id: 'r-once', actionId: data.actionId, caseId: data.caseId,
        externalSystem: 'mock-school', expectedExternalRevision: data.baseExternalRevision,
        payloadHash: '', status: 'accepted' }
    }}
    const data = { actionId: 'outbox-concurrent', caseId: 'case-concurrent',
      actionKind: 'decision' as const, baseExternalRevision: 0, body: { result: 'pass' } }
    const pending = pushViaOutbox(blockingPort, data)
    await entered
    await expect(pushViaOutbox(blockingPort, data)).rejects.toThrow('并发')
    const report = await recoverPendingPushesDetailed(blockingPort)
    expect(report.skippedActive).toContain(data.actionId)
    release()
    expect((await pending).status).toBe('accepted')
    expect(calls).toBe(1)
  })
})

describe('批次队列执行（G06/G11 真实队列）', () => {
  test('Given 注入假 runCase When 执行 Then 逐案状态流转且坏案不阻塞', async () => {
    createBatchV2(batch('bq1'))
    await import('./case-store-v2').then(async (store) => {
      void store
    })
    const state = await runBatchQueue('bq1', {
      runCase: async (caseId: string) => {
        if (caseId === 'c1') throw new Error('解析失败（坏案）')
        return { status: 'completed' }
      },
    })
    const c1 = state.cases.find((entry) => entry.caseId === 'c1')!
    const c2 = state.cases.find((entry) => entry.caseId === 'c2')!
    expect(c1.status).toBe('failed')
    expect(c1.error).toContain('坏案')
    expect(c2.status).toBe('done') // 坏案不阻塞全批
  })

  test('Given 已定稿批次 When 执行 Then 拒绝（重开才能跑）', async () => {
    await seedFinalCase('bq2-case1')
    await seedFinalCase('bq2-case2')
    createBatchV2({ ...batch('bq2'), caseIds: ['bq2-case1', 'bq2-case2'] })
    updateCaseStatus('bq2', 'bq2-case1', 'done')
    updateCaseStatus('bq2', 'bq2-case2', 'done')
    finalizeBatch('bq2', {})
    await expect(runBatchQueue('bq2', { runCase: async () => ({ status: 'completed' }) })).rejects.toThrow('重开')
  })

  test('Given 未注入 runCase When 执行 Then 拒绝（不隐式默认执行器）', async () => {
    createBatchV2(batch('bq3'))
    await expect(runBatchQueue('bq3')).rejects.toThrow('注入')
  })

  test('Given 没有执行器 When 启动失败 Then 批次不遗留 running 状态', async () => {
    createBatchV2(batch('bq-no-executor'))
    await expect(runBatchQueue('bq-no-executor')).rejects.toThrow('注入')
    expect(readBatchStateV2('bq-no-executor')?.status).toBe('draft')
  })

  test('Given 同一批次已经运行 When 重复点击启动 Then 防止并发双跑', async () => {
    createBatchV2({ ...batch('bq-concurrent'), caseIds: ['c1'] })
    let release!: () => void
    let started!: () => void
    const entered = new Promise<void>((resolve) => { started = resolve })
    const blocker = new Promise<void>((resolve) => { release = resolve })
    let calls = 0
    const first = runBatchQueue('bq-concurrent', {
      runCase: async () => { calls++; started(); await blocker; return { status: 'completed' } },
    })
    await entered
    await expect(runBatchQueue('bq-concurrent', {
      runCase: async () => { calls++; return { status: 'completed' } },
    })).rejects.toThrow('正在执行')
    release()
    await first
    expect(calls).toBe(1)
    expect(readBatchStateV2('bq-concurrent')?.cases[0]?.status).toBe('done')
  })
})

describe('outbox 发送前持久化（复查 §5.5）', () => {
  test('Given 延迟响应的端口 When 推送中 Then pending 已先落盘（中断现场可恢复）', async () => {
    const { readFileSync, existsSync } = await import('node:fs')
    const { join } = await import('node:path')
    const mock = new MockSchoolAdapter()
    const slowPort: SchoolPort = { ...mock, push: async (payload: PushPayload) => { await new Promise((resolve) => setTimeout(resolve, 60)); return mock.push(payload) } }
    const payload = { caseId: 'c1', actionId: 'act-pending-first', actionKind: 'decision' as const, baseExternalRevision: 0, body: { result: 'pass' } }
    const promise = pushViaOutbox(slowPort, payload)
    await new Promise((resolve) => setTimeout(resolve, 15))
    const outboxFile = join(CONFIG_DIR, 'sync-outbox', 'act-pending-first.json')
    expect(existsSync(outboxFile)).toBeTrue() // 发送前已落盘
    expect(JSON.parse(readFileSync(outboxFile, 'utf-8')).status).toBe('pending')
    const final = await promise
    expect(final.status).toBe('accepted')
  })
})
