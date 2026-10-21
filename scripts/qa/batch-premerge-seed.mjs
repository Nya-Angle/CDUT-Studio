/**
 * Synthetic fixtures for PR #1 Electron renderer QA. Never point this at a real profile.
 * This is fixture seeding, not a real Pi run or school approval.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
const root = process.env.PROFER_CONFIG_DIR
if (!root || !resolve(root).includes('batch-premerge-qa-')) throw new Error('Refusing to seed a non-QA profile')
if (existsSync(join(root, 'review-batches'))) throw new Error('QA profile must start clean')
mkdirSync(root, { recursive: true })
const now = '2026-10-11T12:00:00.000Z'
writeFileSync(join(root, 'settings.json'), JSON.stringify({
  onboardingCompleted: true, coachTourVersion: 9999, reviewAgentAutoApproval: false,
}, null, 2))
const templateId = 'qa-review-template'
// 使用完整的合成模板，让队列确实进入模型配置检查，而不是提前因模板缺失失败。
const templateDir = join(root, 'review-templates', templateId, 'versions')
mkdirSync(templateDir, { recursive: true })
writeFileSync(join(templateDir, '1.json'), JSON.stringify({
  templateId, version: 1, schemaVersion: 2, name: 'QA 合成审核模板',
  sourceNote: 'QA_SYNTHETIC_ONLY', objectType: 'person', displayName: { template: 'QA 合成案卷' },
  fields: [], materialSlots: [], policyVersionIds: [],
  stages: [{ id: 'qa-review', name: '合成审核', kind: 'auto-check', executorRole: 'reviewer' }],
  outputs: [], autoPassPolicy: { enabled: false }, status: 'published', createdAt: now, publishedAt: now,
}, null, 2))
const cases = [
  ['qa-history-case', 'QA 补件回流案'],
  ['qa-failure-case', 'QA 缺模型渠道案'],
]
for (const [id, title] of cases) {
  const dir = join(root, 'review-cases', id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'state.v2.json'), JSON.stringify({
    caseV2: {
      id, templateId, templateVersion: 1, title, objectType: 'person',
      caseFields: {}, subjects: [], documents: [], stage: 'reviewing',
      revision: 0, createdAt: now, updatedAt: now,
    },
    observations: [], evidenceLinks: [], dispositions: [], tasks: [],
    decisions: [], supplements: [], appeals: [], receiptLog: [],
  }, null, 2))
}
function batch(id, name, caseId, createdAt, opts = {}) {
  const path = join(root, 'review-batches', id)
  mkdirSync(path, { recursive: true })
  writeFileSync(join(path, 'batch.json'), JSON.stringify({
    batch: { id, name, templateId, templateVersion: 1,
      policyVersionLock: [], caseIds: [caseId], createdAt },
    status: 'queued', cases: [{ caseId, status: 'queued' }], round: 1, ...opts,
  }, null, 2))
}
batch('qa-history-batch', 'QA 补件历史', 'qa-history-case', '2026-10-11T12:01:00.000Z', {
  automation: { mode: 'auto-return', grantedBy: 'local-reviewer', grantedAt: now,
    revision: 1, templateId, templateVersion: 1 },
  automationReceipts: [{ caseId: 'qa-history-case', runId: 'old-run',
    action: 'return', status: 'applied', message: 'QA 旧轮次',
    at: now, requestId: 'old-action-1', policyRevision: 1 }],
})
batch('qa-failure-batch', 'QA 队列失败', 'qa-failure-case', '2026-10-11T12:00:00.000Z')
console.log(JSON.stringify({ fixture: 'synthetic-only', root, caseCount: cases.length, batchCount: 2 }))
