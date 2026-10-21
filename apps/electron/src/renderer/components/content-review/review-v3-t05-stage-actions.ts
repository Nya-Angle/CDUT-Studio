/**
 * F11 阶段操作的只读展示门禁。
 *
 * Main 的 allowedActions 是能力投影，不是授权令牌；真正写入时 Main 仍会重核。
 * 缺失能力投影或缺失动作资格字段时一律不调用旧阶段命令降级提交。
 */
export type T05StageAction =
  | 'stage-pass'
  | 'return-for-supplement'
  | 'return-to-previous-stage'
  | 'final-reject'

export interface T05StageActionCapability {
  mode: 'local-business' | 'technical-pre-review'
  actorRole: 'reviewer' | 'teacher'
  eligibleTaskIds: string[]
  hasCurrentRun: boolean
  allowedActions?: T05StageAction[]
  blockers?: string[]
}

export interface T05StageActionState {
  enabled: boolean
  reasons: string[]
}

export function getT05StageActionState(input: {
  capability?: T05StageActionCapability
  connected: boolean
  task?: { id: string; assigneeRole: string; status: string }
  action: T05StageAction
  unresolvedSupplementCount: number
}): T05StageActionState {
  const { capability, connected, task, action, unresolvedSupplementCount } = input
  const reasons: string[] = []
  if (!connected) reasons.push('可信 Main 阶段写入尚未接通')
  if (!capability) {
    reasons.push('无法读取 Main 的当前阶段能力，已停止旧式提交回退')
    return { enabled: false, reasons }
  }
  if (capability.mode !== 'local-business') reasons.push('当前为技术预审，不能形成业务阶段决定')
  if (!task || task.status !== 'open' || task.assigneeRole !== capability.actorRole ||
    !capability.eligibleTaskIds.includes(task.id)) {
    reasons.push('当前角色没有获指派的开放阶段任务')
  }
  if (unresolvedSupplementCount > 0) reasons.push(`仍有 ${unresolvedSupplementCount} 个补件请求未完成核对`)
  if (!Array.isArray(capability.allowedActions)) {
    reasons.push('Main 尚未提供按动作的资格投影，不能按旧逻辑推定可通过')
  } else if (!capability.allowedActions.includes(action)) {
    reasons.push(...(capability.blockers?.length ? capability.blockers : ['Main 判定当前操作尚不具备条件']))
  }
  if (action !== 'return-for-supplement' && !capability.hasCurrentRun) {
    reasons.push('该操作需要与当前案卷一致的真实 ReviewRun；缺材料时可先选择补件')
  }
  return { enabled: reasons.length === 0, reasons: [...new Set(reasons)] }
}
