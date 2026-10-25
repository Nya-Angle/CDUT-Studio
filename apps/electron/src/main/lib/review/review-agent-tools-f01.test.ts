/** F01：真实工具入口安全合同，使用临时本地账本，不请求模型或 Electron GUI。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { randomUUID } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Actor, TemplateVersion } from '@profer/shared'
import { buildReviewOpsTools } from '../adapters/pi-review-ops-tools'
import { createAssignment } from './review-agent-assignment'
import { createCaseFromTemplate } from './application-service'
import { listAggregatesV2, readAggregate } from './case-store-v2'
import { getRunV2, saveRunV2 } from './run-store-v2'
import { publishTemplate, saveDraft } from './template-store'

const configDir = mkdtempSync(join(tmpdir(), 'review-f01-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

type ToolResult = { isError?: boolean; details?: Record<string, unknown> }
type TestTool = { name: string; execute: (id: string, input: any) => Promise<ToolResult> }
const sdk = { defineTool: <T>(definition: T): T => definition } as unknown as typeof import('@earendil-works/pi-coding-agent')
const actor: Actor = { actorId: 'f01-local', actorSource: 'local', role: 'reviewer' }

function tools(sessionId: string, executionTurnId: string, triggeredBy: 'user' | 'automation' = 'user') {
  const definitions = buildReviewOpsTools(sdk, {
    sessionId, executionTurnId, triggeredBy, allowedRoots: [configDir],
  }) as unknown as TestTool[]
  return (name: string, input: Record<string, unknown>): Promise<ToolResult> => {
    const tool = definitions.find((item) => item.name === name)
    if (!tool) throw new Error(`工具缺失: ${name}`)
    return tool.execute(`f01-${name}`, input)
  }
}

async function fixture() {
  const id = randomUUID().slice(0, 10)
  const sessionId = `f01-session-${id}`
  const templateId = `f01-template-${id}`
  const template: TemplateVersion = {
    templateId, version: 1, schemaVersion: 2, name: 'F01 权限用例',
    objectType: 'person', displayName: { template: '{{title}}' },
    fields: [], sections: [], materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString(),
  }
  saveDraft(template)
  publishTemplate(templateId, 1)
  const caseId = `f01-${id}`
  const foreignCaseId = `f01-other-${id}`
  for (const idOfCase of [caseId, foreignCaseId]) {
    const outcome = await createCaseFromTemplate(templateId, 1, {
      title: `案卷 ${idOfCase}`, fieldValues: {}, subjects: [],
    }, actor, idOfCase)
    if (!outcome.ok) throw new Error(outcome.message)
  }
  const assignment = createAssignment({
    sessionId, turnId: `ui-grant-${id}`, caseId, actions: ['list', 'cancel-run'],
  })
  return { sessionId, templateId, caseId, foreignCaseId, assignment }
}

describe('F01 Agent 工具最小权限闭环', () => {
  test('没有指派不能读案卷与枚举；绑定指派只能看本案，跨案读取被拒', async () => {
    const f = await fixture()
    const call = tools(f.sessionId, 'host-user-turn-1')
    expect((await call('review_get_case', { caseId: f.caseId })).isError).toBeTrue()
    expect((await call('review_list_cases', {})).isError).toBeTrue()
    const mine = await call('review_get_case', { assignmentId: f.assignment.id, caseId: f.caseId })
    expect(mine.isError).not.toBe(true)
    expect(mine.details?.caseId).toBe(f.caseId)
    expect((await call('review_get_case', { assignmentId: f.assignment.id, caseId: f.foreignCaseId })).isError).toBeTrue()
    const listed = await call('review_list_cases', { assignmentId: f.assignment.id })
    expect((listed.details?.cases as Array<{ caseId: string }>).map((item) => item.caseId)).toEqual([f.caseId])
  })

  test('旧轮次与非用户轮次不得复用指派，即使同一 sessionId', async () => {
    const f = await fixture()
    const input = { assignmentId: f.assignment.id, caseId: f.caseId }
    const first = await tools(f.sessionId, 'host-turn-1')('review_get_case', input)
    expect(first.isError).not.toBe(true)
    const another = await tools(f.sessionId, 'host-turn-2')('review_get_case', input)
    expect(another.isError).toBeTrue()
    expect(String(another.details?.error)).toContain('TURN_MISMATCH')
    const automated = await tools(f.sessionId, 'host-turn-1', 'automation')('review_get_case', input)
    expect(automated.isError).toBeTrue()
    expect((await tools('different-session', 'host-turn-1')('review_get_case', input)).isError).toBeTrue()
  })

  test('取消 Run 前验证 caseId/runId 归属，错误目标不改变运行', async () => {
    const f = await fixture()
    const runId = `run-f01-${randomUUID().slice(0, 12)}`
    saveRunV2({
      id: runId, caseId: f.foreignCaseId, templateId: f.templateId, templateVersion: 1,
      inputManifest: { hash: '', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] },
      status: 'queued', checkpoints: [], checks: [], opinions: [], diagnostics: [],
      coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
      startedAt: new Date().toISOString(),
    })
    const outcome = await tools(f.sessionId, 'cancel-turn')('review_cancel_run', {
      assignmentId: f.assignment.id, caseId: f.caseId, runId,
    })
    expect(outcome.isError).toBeTrue()
    expect(getRunV2(f.foreignCaseId, runId)?.status).toBe('queued')

    const readGrant = createAssignment({
      sessionId: f.sessionId, turnId: `status-${randomUUID()}`,
      caseId: f.caseId, actions: ['get-run-status'],
    })
    const readStatus = await tools(f.sessionId, 'status-turn')('review_get_run_status', {
      assignmentId: readGrant.id, caseId: f.foreignCaseId, runId,
    })
    expect(readStatus.isError).toBeTrue()
    const noBoundCase = createAssignment({
      sessionId: f.sessionId, turnId: `unbound-${randomUUID()}`, templateId: f.templateId,
      templateVersion: 1, actions: ['cancel-run', 'list'],
    })
    expect((await tools(f.sessionId, 'unbound-turn')('review_cancel_run', {
      assignmentId: noBoundCase.id, caseId: f.foreignCaseId, runId,
    })).isError).toBeTrue()
  })

  test('requestId 相同只创建一个案卷；同 ID 不同载荷拒绝，重启式重建工具仍能重试', async () => {
    const f = await fixture()
    const assignment = createAssignment({
      sessionId: f.sessionId, turnId: `create-turn-${randomUUID()}`, templateId: f.templateId,
      templateVersion: 1, actions: ['create-case'],
    })
    const input = {
      assignmentId: assignment.id, requestId: `f01-request-${randomUUID()}`,
      templateId: f.templateId, templateVersion: 1, title: '幂等测试案卷', subjects: [],
    }
    const before = listAggregatesV2().length
    const created = await tools(f.sessionId, 'create-turn')('review_create_case', input)
    expect(created.isError).not.toBe(true)
    const retried = await tools(f.sessionId, 'create-turn')('review_create_case', input)
    expect(retried.details?.caseId).toBe(created.details?.caseId)
    expect(retried.details?.idempotentReplay).toBeTrue()
    expect(listAggregatesV2()).toHaveLength(before + 1)
    expect(readAggregate(String(created.details?.caseId))?.receiptLog.filter((r) => r.type === 'CreateCaseFromTemplate')).toHaveLength(1)
    const changed = await tools(f.sessionId, 'create-turn')('review_create_case', { ...input, title: '请求 ID 碰撞' })
    expect(changed.isError).toBeTrue()
    expect(String(changed.details?.error)).toContain('REQUEST_ID_COLLISION')
    expect((await tools(f.sessionId, 'create-turn')('review_create_case', { ...input, requestId: `other-${randomUUID()}` })).isError).toBeTrue()
  })

  test('并发提交同一 requestId 只有一个实际案卷，两个调用均得到同一 caseId', async () => {
    const f = await fixture()
    const assignment = createAssignment({
      sessionId: f.sessionId, turnId: `parallel-${randomUUID()}`, templateId: f.templateId,
      templateVersion: 1, actions: ['create-case'],
    })
    const input = {
      assignmentId: assignment.id, requestId: `parallel-${randomUUID()}`,
      templateId: f.templateId, templateVersion: 1, title: '并发幂等案卷',
    }
    const call = tools(f.sessionId, 'parallel-turn')
    const [first, second] = await Promise.all([
      call('review_create_case', input), call('review_create_case', input),
    ])
    expect(first.isError).not.toBe(true)
    expect(second.isError).not.toBe(true)
    expect(first.details?.caseId).toBe(second.details?.caseId)
    expect(readAggregate(String(first.details?.caseId))?.receiptLog.filter((r) => r.type === 'CreateCaseFromTemplate')).toHaveLength(1)
  })
})
