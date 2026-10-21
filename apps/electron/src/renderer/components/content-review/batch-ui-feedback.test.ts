import { describe, expect, test } from 'bun:test'
import type { BatchStateV2, BatchTriageRoute } from '@profer/shared'
import { batchAutomationDisplay, reviewBusinessError, summarizeBatchExecution } from './batch-ui-feedback'

describe('21 号本地 UI QA：反馈语义', () => {
  test('Electron IPC 包装信息不显示给用户，但保留真实业务拒绝原因', () => {
    expect(reviewBusinessError(new Error("Error invoking remote method 'review-v2:batch-action': Error: 全局 AI 代批授权未开启")))
      .toBe('全局 AI 代批授权未开启')
    expect(reviewBusinessError(new Error("Error invoking remote method 'review-v2:batch-action': Error: 案卷仍待补件")))
      .toBe('案卷仍待补件')
    expect(reviewBusinessError(new Error('业务内容不完整'))).toBe('业务内容不完整')
    expect(reviewBusinessError(null)).toBe('null')
  })

  test('补件完成后重新入队只展示本轮待审核，旧自动退回成为历史记录', () => {
    const receipt = {
      caseId: 'case-c', runId: 'old-run', action: 'return' as const, status: 'applied' as const,
      message: '已退回', at: '', requestId: 'action-1', policyRevision: 1,
    }
    expect(batchAutomationDisplay('done', 'awaiting-supplement', 'old-run', receipt, '等待补件')).toEqual({
      label: '已自动退回补件（业务已写入）',
    })
    expect(batchAutomationDisplay('queued', 'reviewing', 'old-run', receipt, '待执行/处理中')).toEqual({
      label: '待本轮重新审核', history: '上次动作：自动退回补件（历史记录）',
    })
    expect(batchAutomationDisplay('done', 'reviewing', 'new-run', receipt, '待人工判断')).toEqual({
      label: '待人工判断', history: '上次动作：自动退回补件（历史记录）',
    })
  })

  test('检查成功和业务批准不同；队列完成提示必须显示失败和待人工数', () => {
    const state = {
      batch: { id: 'qa-batch', caseIds: ['pass', 'manual', 'supplement', 'error'], templateId: 't', templateVersion: 1, policyVersionLock: [], name: 'test', createdAt: '' },
      status: 'queued', round: 1,
      cases: [{ caseId: 'pass', status: 'done' }, { caseId: 'manual', status: 'done' },
        { caseId: 'supplement', status: 'done' }, { caseId: 'error', status: 'failed' }],
    } as BatchStateV2
    const routes = new Map<string, BatchTriageRoute>([
      ['pass', 'already-decided'], ['manual', 'manual-review'], ['supplement', 'auto-return-candidate'],
      ['error', 'technical-exception'],
    ])
    expect(summarizeBatchExecution(state, routes)).toEqual({
      completed: 3, failed: 1, pending: 0, needsHuman: 2, technical: 0,
    })
    // 全部执行失败时，没有已完成案卷需要分流，待人工数可直接确定为零。
    expect(summarizeBatchExecution({ ...state, cases: [{ caseId: 'error', status: 'failed' }] }, new Map())).toEqual({
      completed: 0, failed: 1, pending: 0, needsHuman: 0, technical: 0,
    })
  })
})
