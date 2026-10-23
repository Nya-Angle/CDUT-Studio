/** P06 实机首败的默认回归：启动恢复失写时旧授权必须拒止，磁盘状态如实保留。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { chmodSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { TemplateVersion } from '@profer/shared'

const config = mkdtempSync(join(tmpdir(), 'review-startup-io-'))
process.env.PROFER_CONFIG_DIR = config
afterAll(() => rmSync(config, { recursive: true, force: true }))
const { saveDraft, publishTemplate } = await import('./template-store')
const { createCaseFromTemplate } = await import('./application-service')
const { createReviewOwnedAgentSession } = await import('../agent-session-manager')
const { preparePiReviewRunV2, getPiReviewBindingForSession } = await import('./pi-case-review-service')
const { checkAssignment, createAssignment } = await import('./review-agent-assignment')
const { getRunV2, markStaleRunsInterrupted } = await import('./run-store-v2')

async function fixture() {
  const caseId = `startup-${randomUUID()}`
  const template: TemplateVersion = { templateId: caseId, version: 1, schemaVersion: 2,
    name: '合成启动恢复', objectType: 'person', displayName: { template: '{{title}}' }, fields: [],
    sections: [{ id: 'all', name: '核验', order: 0, required: false,
      criteria: [{ id: 'check', title: '合成核验', requirement: '核对合成材料', execution: 'semantic', targetScope: 'case' }] }],
    materialSlots: [], policyVersionIds: [], policyRefs: [],
    stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }],
    outputs: [], status: 'draft', createdAt: new Date().toISOString() }
  saveDraft(template); publishTemplate(caseId, 1)
  const created = await createCaseFromTemplate(caseId, 1, { title: '合成恢复案卷', fieldValues: {}, subjects: [] },
    { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }, caseId)
  if (!created.ok) throw new Error(created.message)
  const owner = createReviewOwnedAgentSession({ caseId, title: '合成 owner', channelId: 'synthetic-channel', modelId: 'synthetic-model' })
  const prepared = preparePiReviewRunV2({ caseId, sessionId: owner.id, turnId: randomUUID() })
  const dir = join(config, 'review-cases', caseId, 'runs-v2'), path = join(dir, prepared.runId + '.json')
  const permission = () => checkAssignment({ assignmentId: prepared.assignmentId, sessionId: owner.id, action: 'submit-result', turnTriggeredBy: 'user' }).ok
  return { caseId, owner, prepared, dir, path, permission }
}

describe('P06 启动恢复 I/O 故障隔离', () => {
  test('恢复原文件与目录同时不可写时，磁盘仍 running，旧工具与 binding 必须拒绝', async () => {
    const f = await fixture()
    expect(f.permission()).toBeTrue()
    const original = readFileSync(f.path)
    chmodSync(f.dir, 0o500); chmodSync(f.path, 0o400)
    try {
      expect(markStaleRunsInterrupted(f.caseId)).toBe(0)
      expect(readFileSync(f.path).equals(original)).toBeTrue()
      expect(getRunV2(f.caseId, f.prepared.runId)?.status).toBe('running')
      expect(f.permission()).toBeFalse()
      expect(getPiReviewBindingForSession(f.owner.id)).toBeUndefined()
    } finally { chmodSync(f.dir, 0o700); chmodSync(f.path, 0o600) }
  })

  test('原文件只读但目录可写时，恢复通过原子替换持久 failed，旧授权拒绝', async () => {
    const f = await fixture()
    chmodSync(f.path, 0o400)
    try {
      expect(markStaleRunsInterrupted(f.caseId)).toBe(1)
      expect(getRunV2(f.caseId, f.prepared.runId)?.status).toBe('failed')
      expect(f.permission()).toBeFalse()
    } finally { chmodSync(f.path, 0o600) }
  })

  test('修复目录写入后可再次持久化 interrupted；新轮次和普通指派仍可用', async () => {
    const f = await fixture()
    chmodSync(f.dir, 0o500); chmodSync(f.path, 0o400)
    try { expect(markStaleRunsInterrupted(f.caseId)).toBe(0) }
    finally { chmodSync(f.dir, 0o700); chmodSync(f.path, 0o600) }
    expect(markStaleRunsInterrupted(f.caseId)).toBe(1)
    expect(getRunV2(f.caseId, f.prepared.runId)?.status).toBe('failed')
    expect(f.permission()).toBeFalse()
    const next = preparePiReviewRunV2({ caseId: f.caseId, sessionId: f.owner.id, turnId: randomUUID() })
    expect(next.runId).not.toBe(f.prepared.runId)
    expect(checkAssignment({ assignmentId: next.assignmentId, sessionId: f.owner.id, action: 'submit-result', turnTriggeredBy: 'user' }).ok).toBeTrue()
    const ordinary = createAssignment({ sessionId: 'synthetic-ordinary', turnId: 'ordinary-turn', caseId: f.caseId, actions: ['list'] })
    expect(checkAssignment({ assignmentId: ordinary.id, sessionId: ordinary.sessionId, action: 'list', turnTriggeredBy: 'user' }).ok).toBeTrue()
  })
})
