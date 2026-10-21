import { describe, expect, test } from 'bun:test'
import { getT05StageActionState, type T05StageActionCapability } from './review-v3-t05-stage-actions'

const capability: T05StageActionCapability = {
  mode: 'local-business', actorRole: 'reviewer', eligibleTaskIds: ['task-1'],
  hasCurrentRun: true, allowedActions: ['stage-pass', 'final-reject', 'return-for-supplement'],
  blockers: [],
}
const task = { id: 'task-1', status: 'open', assigneeRole: 'reviewer' }
const state = (overrides: Partial<Parameters<typeof getT05StageActionState>[0]> = {}) =>
  getT05StageActionState({ capability, task, connected: true, unresolvedSupplementCount: 0, action: 'stage-pass', ...overrides })

describe('F11 可信阶段操作展示门禁', () => {
  test('Given 完整 Main 能力和已指派任务 When 选择允许动作 Then 可以调用可信端口', () => {
    expect(state()).toEqual({ enabled: true, reasons: [] })
  })

  test('Given Main 能力缺失或旧形状 When 提交 Then 关闭旧命令回退', () => {
    expect(state({ capability: undefined }).enabled).toBe(false)
    expect(state({ capability: { ...capability, allowedActions: undefined } }).reasons.join()).toContain('动作的资格')
    expect(state({ connected: false }).enabled).toBe(false)
  })

  test('Given 非业务案卷或不匹配任务 When 审核员提交 Then 不允许操作', () => {
    expect(state({ capability: { ...capability, mode: 'technical-pre-review' } }).enabled).toBe(false)
    expect(state({ task: { ...task, assigneeRole: 'teacher' } }).enabled).toBe(false)
    expect(state({ task: { ...task, status: 'completed' } }).enabled).toBe(false)
  })

  test('Given Run 尚未完成 When 缺件 Then 仅 Main 允许的补件动作可以继续', () => {
    const beforeRun = { ...capability, hasCurrentRun: false, allowedActions: ['return-for-supplement' as const] }
    expect(state({ capability: beforeRun }).enabled).toBe(false)
    expect(state({ capability: beforeRun, action: 'return-for-supplement' }).enabled).toBe(true)
    expect(state({ capability: beforeRun, action: 'final-reject' }).enabled).toBe(false)
  })

  test('Given Run 检查不合规 When 阶段通过 Then 展示 Main 阻断，但允许有依据的拒绝', () => {
    const blocked = { ...capability, allowedActions: ['final-reject' as const], blockers: ['存在未解释的非合规项'] }
    expect(state({ capability: blocked }).reasons.join()).toContain('非合规')
    expect(state({ capability: blocked, action: 'final-reject' }).enabled).toBe(true)
  })

  test('Given 补件未逐项核对 When 选择任何阶段决定 Then 不提前放行', () => {
    expect(state({ unresolvedSupplementCount: 2 }).reasons.join()).toContain('2 个补件请求')
  })

  test('Given Main 不允许退回前级 When 用户选择该动作 Then 不凭 Run 自行推断允许', () => {
    expect(state({ action: 'return-to-previous-stage' }).enabled).toBe(false)
  })
})
