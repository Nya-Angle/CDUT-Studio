/** 独立负例：期望保护成立，原冻结实现违反期望时真实失败。仅操作 mkdtemp 合成数据。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const repo = process.env.REVIEW_ACCEPTANCE_ROOT!
const report = process.env.REVIEW_RISK_REPORT!
if (!repo || !report) throw new Error('必须显式指定验收工作树和报告路径')
const directory = mkdtempSync(join(tmpdir(), 'review-cumulative-risk-'))
process.env.PROFER_CONFIG_DIR = directory
afterAll(() => rmSync(directory, { recursive: true, force: true }))
const facts: Array<Record<string, unknown>> = []
const save = (id: string, result: Record<string, unknown>) => {
  facts.push({ id, at: new Date().toISOString(), ...result })
  writeFileSync(report, JSON.stringify(facts, null, 2) + '\n')
}
const main = (path: string) => import(join(repo, 'apps/electron/src/main/lib', path))
const manager = await main('agent-session-manager.ts')
const { isReviewPrivateDesktopPath } = await main('review-private-file-access.ts')
const { mayPublishAgentEventToRemote } = await main('remote-service.ts')

describe('P01～P06-S02 独立保护负例', () => {
  test('索引从不含新 owner 的备份恢复后仍必须拒绝私有会话及文件', () => {
    manager.createAgentSession('合成普通会话', 'synthetic-channel', undefined, 'synthetic-model', 'pi')
    const owner = manager.createReviewOwnedAgentSession({ caseId: 'case-audit-index', title: '合成内部审核', channelId: 'synthetic-channel', modelId: 'synthetic-model' })
    const indexPath = join(directory, 'agent-sessions.json')
    const backup = JSON.parse(readFileSync(indexPath + '.bak', 'utf8'))
    expect(backup.sessions.some((s: { id: string }) => s.id === owner.id)).toBeFalse()
    const marker = 'SYNTHETIC_REVIEW_PRIVATE_MARKER'
    writeFileSync(join(directory, 'agent-sessions', owner.id + '.jsonl'), JSON.stringify({ id: 'audit-message', role: 'assistant', content: marker }) + '\n')
    let blockedBefore = false
    try { manager.assertOrdinaryAgentSession(owner.id) } catch { blockedBefore = true }
    expect(blockedBefore).toBeTrue()
    // 模拟主索引损坏；让生产 safe-file 自己恢复真实 .bak。
    writeFileSync(indexPath, '{broken synthetic index')
    let blockedAfter = false
    try { manager.assertOrdinaryAgentSession(owner.id) } catch { blockedAfter = true }
    const readableAfter = manager.getAgentSessionSDKMessages(owner.id).length > 0
    const eventPublishedAfter = mayPublishAgentEventToRemote(owner.id, { kind: 'sdk_message' })
    const privatePathBlockedAfter = isReviewPrivateDesktopPath(join(directory, 'agent-workspaces', 'default', owner.id, 'synthetic.txt'))
    save('AUDIT-P03-P05-INDEX-01', { blockedBefore, blockedAfter, metadataMissingAfter: !manager.getAgentSessionMeta(owner.id), readableAfter,
      eventPublishedAfter, privatePathBlockedAfter, expected: '普通入口/事件/私有路径仍拒绝', result: blockedAfter && !eventPublishedAfter && privatePathBlockedAfter ? 'PASS' : 'FAIL' })
    expect(blockedAfter).toBeTrue()
    expect(eventPublishedAfter).toBeFalse()
    expect(privatePathBlockedAfter).toBeTrue()
  })

  test('运行释放时授权文件写入失败必须被观察且不跳过清理', async () => {
    const { saveDraft, publishTemplate } = await main('review/template-store.ts')
    const { createCaseFromTemplate } = await main('review/application-service.ts')
    const { preparePiReviewRunV2 } = await main('review/pi-case-review-service.ts')
    const { admitPreparedPiReviewTurn } = await main('review/review-pi-admission.ts')
    const { listAssignments } = await main('review/review-agent-assignment.ts')
    const id = 'case-audit-write-failure'
    saveDraft({ templateId: id, version: 1, schemaVersion: 2, name: '合成收尾异常', objectType: 'person', displayName: { template: '{{title}}' },
      fields: [], sections: [{ id: 'all', name: '核验', order: 0, required: false, criteria: [{ id: 'check', title: '合成核验', requirement: '核对合成文字', execution: 'semantic', targetScope: 'case' }] }],
      materialSlots: [], policyVersionIds: [], policyRefs: [], stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }], outputs: [], status: 'draft', createdAt: new Date().toISOString() })
    publishTemplate(id, 1)
    const created = await createCaseFromTemplate(id, 1, { title: '合成收尾异常', fieldValues: {}, subjects: [] }, { actorId: 'audit', actorSource: 'local', role: 'reviewer' }, id)
    if (!created.ok) throw new Error('合成案卷初始化失败')
    const owner = manager.createReviewOwnedAgentSession({ caseId: id, title: '合成收尾异常', channelId: 'synthetic-channel', modelId: 'synthetic-model' })
    const turnId = randomUUID()
    const prepared = preparePiReviewRunV2({ caseId: id, sessionId: owner.id, turnId })
    const binding = { caseId: id, sessionId: owner.id, runId: prepared.runId, assignmentId: prepared.assignmentId }
    const assignmentPath = join(directory, 'review-agent-assignments.json')
    let unhandled = false
    const listener = () => { unhandled = true }
    process.on('unhandledRejection', listener)
    let release!: () => void
    const admission = admitPreparedPiReviewTurn({ sessionId: owner.id, userMessage: prepared.userMessage,
      channelId: 'synthetic-channel', modelId: 'synthetic-model', agentRuntime: 'pi', triggeredBy: 'user', uuid: turnId }, binding,
      async (input: { onRunOutcome?: (result: { status: string; error: string }) => void }, owned: () => void) => {
        owned()
        await new Promise<void>(resolve => { release = resolve })
        input.onRunOutcome?.({ status: 'failed', error: '合成运行正常收尾' })
      })
    await admission
    chmodSync(assignmentPath, 0o400)
    release()
    await Bun.sleep(150)
    const revoked = !!listAssignments().find((a: { id: string }) => a.id === binding.assignmentId)?.revokedAt
    chmodSync(assignmentPath, 0o600)
    process.off('unhandledRejection', listener)
    save('AUDIT-P01-P06-SETTLE-01', { unhandledRejection: unhandled, grantRevoked: revoked, expected: '持久化错误被捕获且清理不因异常跳过', result: !unhandled && revoked ? 'PASS' : 'FAIL' })
    expect(unhandled).toBeFalse()
    expect(revoked).toBeTrue()
  })

  test('旧页面 Controller 慢返回不能覆盖重新进入后的新轮次', async () => {
    const { createStore } = require(join(repo, 'node_modules/jotai'))
    const { createReviewActionsController } = await import(join(repo, 'apps/electron/src/renderer/components/content-review/review-actions-controller.ts'))
    const atoms = await import(join(repo, 'apps/electron/src/renderer/atoms/review-atoms.ts'))
    const caseId = 'case-audit-remount'
    const source = { id: caseId, title: '合成重新进入', type: '自定义审核', applicant: '合成测试甲', academicYear: '2026', createdAt: '', updatedAt: '', documents: [], items: [], rulePacks: [], manualRules: [], evidenceLinks: [] }
    const aggregate = { caseV2: { id: caseId, templateId: 'synthetic', templateVersion: 1, title: source.title, objectType: 'person', caseFields: {}, subjects: [], documents: [], stage: 'submitted', revision: 0, createdAt: '', updatedAt: '' }, observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [] }
    const base = { caseId, templateId: 'synthetic', templateVersion: 1, inputManifest: { hash: 'h', templateVersion: 1, policyVersions: [], documentVersions: [], observationIds: [], evidenceLinkIds: [] }, checkpoints: [], checks: [], opinions: [], coverage: { documents: [], plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1 }, diagnostics: [], startedAt: '' }
    const old = { ...base, id: 'run-pi-old-page', status: 'failed', error: '合成旧页错误' }
    const next = { ...base, id: 'run-pi-new-page', status: 'running' }
    let current = old
    let delayed = false
    let requested = false
    let release!: (value: unknown[]) => void
    const gate = new Promise<unknown[]>(resolve => { release = resolve })
    const api = { getCase: async () => source, listCases: async () => [], getLatestRun: async () => ({ run: null, inputStale: false }),
      getAggregateV2: async () => aggregate, getTemplateV2: async () => ({ materialSlots: [], fields: [], sections: [] }),
      getWorkspaceRunValidityV2: async () => false, getRunObservationsV2: async () => [],
      listRunsV2: async () => { if (delayed) { delayed = false; requested = true; return gate } return [current] },
      getBackgroundPiReviewStateV2: async () => ({ caseId, runId: current.id, runStatus: current.status, phase: current.status === 'running' ? 'accepted' : 'incomplete' }) }
    const store = createStore()
    const previousPage = createReviewActionsController(store, api)
    await previousPage.selectCase(caseId)
    delayed = true
    const late = previousPage.refreshBackgroundReview(caseId)
    while (!requested) await Bun.sleep(0)
    current = next
    const reopenedPage = createReviewActionsController(store, api)
    await reopenedPage.refreshBackgroundReview(caseId)
    expect(store.get(atoms.reviewWorkspaceRunsByCaseAtom)[caseId]?.id).toBe(next.id)
    release([old])
    await late
    const actualRun = store.get(atoms.reviewWorkspaceRunsByCaseAtom)[caseId]?.id
    const actualState = store.get(atoms.reviewExecutionByCaseAtom)[caseId]?.status
    save('AUDIT-P06-REMOUNT-01', { expectedRun: next.id, actualRun, expectedState: 'running', actualState,
      result: actualRun === next.id && actualState === 'running' ? 'PASS' : 'FAIL', scope: '真实 Controller/Jotai，受控旧 IPC 回复，不是真实模型注入' })
    expect(actualRun).toBe(next.id)
    expect(actualState).toBe('running')
  })

  test('RightPanel 的 Workspace refresh 慢回复不能绕过 Controller 屏障写旧 run', async () => {
    const React = require(join(repo, 'node_modules/react'))
    const { renderToString } = require(join(repo, 'node_modules/react-dom/server'))
    const { createStore, Provider } = await import(join(repo, 'node_modules/jotai/esm/index.mjs'))
    const atoms = await import(join(repo, 'apps/electron/src/renderer/atoms/review-atoms.ts'))
    const { useReviewWorkspaceActions } = await import(join(repo, 'apps/electron/src/renderer/components/content-review/use-review-workspace-actions.ts'))
    const store = createStore()
    const caseId = 'case-audit-workspace'
    const previous = { id: 'run-pi-workspace-old', status: 'cancelled' }
    const next = { id: 'run-pi-workspace-next', status: 'running' }
    store.set(atoms.selectedCaseIdAtom, caseId)
    let release!: (value: unknown[]) => void
    const gate = new Promise<unknown[]>(resolve => { release = resolve })
    const originalWindow = globalThis.window
    let apiReads = 0
    globalThis.window = { reviewAPI: { getAggregateV2: async () => { apiReads++; return { caseV2: { id: caseId } } },
      listRunsV2: async () => gate, getRunObservationsV2: async () => [], getWorkspaceRunValidityV2: async () => false } } as never
    let actions: { refresh(): Promise<unknown> } | undefined
    const Probe = () => { actions = useReviewWorkspaceActions(); return null }
    try {
      renderToString(React.createElement(Provider, { store }, React.createElement(Probe)))
      const pending = actions!.refresh()
      expect(apiReads).toBeGreaterThan(0)
      store.set(atoms.reviewWorkspaceRunsByCaseAtom, { [caseId]: next })
      release([previous])
      await pending
      const actual = store.get(atoms.reviewWorkspaceRunsByCaseAtom)[caseId]?.id
      save('AUDIT-P06-WORKSPACE-WRITER-01', { expectedRun: next.id, actualRun: actual, apiReads,
        result: actual === next.id ? 'PASS' : 'FAIL', scope: '真实 Hook/React SSR/Jotai，受控 IPC；非 Electron GUI' })
      expect(actual).toBe(next.id)
    } finally { globalThis.window = originalWindow }
  })
})
