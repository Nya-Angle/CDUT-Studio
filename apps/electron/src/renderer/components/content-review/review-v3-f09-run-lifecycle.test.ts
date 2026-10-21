import { describe, expect, test } from 'bun:test'
import type { ReviewBackgroundPiRunState, ReviewRunV2 } from '@profer/shared'
import { projectF09RunLifecycle } from './review-v3-f09-run-lifecycle'

const caseId = 'f09-case'
function run(status: ReviewRunV2['status']): ReviewRunV2 {
  return {
    id: 'run-pi-f09', caseId, status, templateId: 'template', templateVersion: 1,
    inputManifest: { hash: 'same-input', templateVersion: 1, policyVersions: [],
      documentVersions: [], observationIds: [], evidenceLinkIds: [] },
    checkpoints: [], checks: [], opinions: [], diagnostics: [], startedAt: '2026-10-21T00:00:00Z',
    coverage: { documents: [], plannedChecks: 10, completedChecks: 6, effectiveVerdicts: 4, pendingChecks: 4 },
  }
}
function state(status: ReviewRunV2['status'], phase: ReviewBackgroundPiRunState['phase']): ReviewBackgroundPiRunState {
  return { caseId, runId: 'run-pi-f09', phase, runStatus: status }
}

describe('F09：真实运行状态与用户下一步操作', () => {
  test('Given running 文件但没有 Main 执行受理 When 展示 Then 不显示已启动且不能停止未知执行权', () => {
    const view = projectF09RunLifecycle(state('running', 'preparing'), run('running'), null)
    expect(view.title).toBe('等待执行器受理')
    expect(view.canStart).toBeFalse()
    expect(view.canStop).toBeFalse()
  })

  test('Given Main 已受理 When 轮询 Then 显示真实覆盖而非模型进度，并可请求停止', () => {
    const view = projectF09RunLifecycle(state('running', 'accepted'), run('running'), null)
    expect(view.title).toBe('Pi 正在审核')
    expect(view.coverage).toEqual({ completed: 6, planned: 10, pending: 4, percent: 60 })
    expect(view.canStop).toBeTrue()
    expect(view.canStart).toBeFalse()
  })

  test('Given 部分完成且仍有语义执行失败 When 继续 Then 提示 Main 决定是否复用旧 Run', () => {
    const previous = run('partially-completed')
    previous.checks = [{ checkId: 'c', ruleId: 'r', target: { scope: 'case', subjectIds: [] },
      status: 'execution-failed', reason: '模型未提交', sourceRefs: [], executedBy: 'semantic', executedAt: '2026-10-21T00:00:00Z' }]
    const view = projectF09RunLifecycle(state('partially-completed', 'incomplete'), previous, false)
    expect(view.startLabel).toBe('继续未完成检查')
    expect(view.executionFailures).toBe(1)
    expect(view.nextStep).toContain('Main 核对')
  })

  test('Given 补件使原输入变更 When 查询过期 Then 不承诺同一 Run 继续', () => {
    const view = projectF09RunLifecycle(state('partially-completed', 'incomplete'), run('partially-completed'), true)
    expect(view.title).toBe('原运行已过期')
    expect(view.startLabel).toBe('按新输入审核')
    expect(view.nextStep).toContain('旧决定不得自动沿用')
  })

  test('Given 取消或中断 When 重开页面 Then 显示恢复建议，绝不假装完成', () => {
    expect(projectF09RunLifecycle(state('cancelled', 'incomplete'), run('cancelled'), false).title).toBe('审核已停止')
    const failed = projectF09RunLifecycle({ ...state('failed', 'incomplete'), error: '冷重启中断' }, run('failed'), false)
    expect(failed.title).toBe('执行失败或中断')
    expect(failed.explanation).toContain('冷重启')
    expect(failed.startLabel).toBe('重试审核')
  })

  test('Given 技术完成但仍有待处理检查 When 展示 Then 不冒充学校正式通过', () => {
    const view = projectF09RunLifecycle(state('completed', 'finished'), run('completed'), false)
    expect(view.title).toBe('技术审核已结束')
    expect(view.explanation).toContain('不代表业务审批通过')
    expect(view.nextStep).toContain('人工工作台')
  })

  test('Given 状态与 Run 身份不一致 When 展示 Then 不允许继续、停止', () => {
    const view = projectF09RunLifecycle({ ...state('running', 'accepted'), runId: 'other-run' }, run('running'), null)
    expect(view.title).toBe('运行身份待核验')
    expect(view.canStart).toBeFalse()
    expect(view.canStop).toBeFalse()
  })

  test('Given 版本核验暂不可用 When 展示 Then 不臆断旧结果仍然有效', () => {
    const view = projectF09RunLifecycle(state('partially-completed', 'incomplete'), run('partially-completed'), null)
    expect(view.title).toBe('输入版本待核验')
    expect(view.nextStep).toContain('Main 检查')
  })
})
