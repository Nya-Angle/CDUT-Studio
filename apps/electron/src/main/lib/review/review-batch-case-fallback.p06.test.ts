import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'
import { assembleV2Executors } from './v2-executor-factory'

describe('P06 live batch semantic outcome with zero subjects', () => {
  for (const scope of ['case', 'group'] as const) {
    test(`${scope} tool result remains complete without subject IDs`, async () => {
      const checks = await execute(scope, true)
      expect(checks).toHaveLength(1)
      expect(checks[0]?.status).toBe('awaiting-confirmation')
    })
  }
  test('unsubmitted case result still fails closed', async () => {
    const checks = await execute('case', false)
    expect(checks).toHaveLength(1)
    expect(checks[0]?.status).toBe('execution-failed')
  })
})

async function execute(scope: 'case' | 'group', submit: boolean) {
  const aggregate: CaseAggregateV2 = {
    caseV2: { id: 'synthetic-batch-no-subjects', templateId: 'synthetic-template', templateVersion: 1,
      title: '合成预算检查', objectType: 'person', caseFields: {}, subjects: [], documents: [],
      stage: 'submitted', revision: 0, createdAt: '2026-10-15T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z' },
    observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
  }
  const template: TemplateVersion = {
    templateId: 'synthetic-template', version: 1, schemaVersion: 2, name: '合成模板', objectType: 'person',
    displayName: { template: '{{title}}' }, fields: [], materialSlots: [], policyVersionIds: [], outputs: [],
    sections: [{ id: 'all', name: '合成检查', order: 0, required: false,
      criteria: [{ id: 'budget', title: '预算', requirement: '合成测试缺少证据时待确认', execution: 'semantic', targetScope: scope }] }],
    stages: [{ id: 'auto', name: '核验', kind: 'auto-check', executorRole: 'reviewer' }],
    status: 'published', createdAt: '2026-10-15T00:00:00Z',
  }
  const executors = await assembleV2Executors(aggregate, template, { client: {
    runtime: 'pi', protocol: 'openai-chat',
    async complete(input) {
      if (submit) {
        const tool = input.tools?.find(tool => tool.name === 'submit_check')
        if (!tool) throw new Error('real review tool missing')
        const result = await tool.execute({ ruleId: 'section-all-budget', scope, subjectIds: [], status: 'awaiting-confirmation', reason: '合成待确认', sourceRefs: [] })
        if (!result.ok) throw new Error(String(result.error))
      }
      return { content: '{"opinion":"合成验收"}' }
    },
  } })
  const result = await executors.summarize({ id: 'summary', kind: 'summarize', stageId: 'auto', dependsOn: [], status: 'pending', attempts: 0 }, 'synthetic-hash')
  if (result.status !== 'done') throw new Error('not done')
  return result.artifact?.checks ?? []
}
