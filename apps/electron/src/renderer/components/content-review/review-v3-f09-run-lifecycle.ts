/**
 * F09：从 Main 已持久化的 Run 和受理状态生成用户可读的执行进度。
 * 本投影没有启动权、审批权或写入权，也不根据 Spinner 猜测后台是否正在运行。
 */
import type { ReviewBackgroundPiRunState, ReviewRunV2 } from '@profer/shared'

export interface F09RunLifecycleView {
  title: string
  explanation: string
  nextStep: string
  startLabel: string
  canStart: boolean
  canStop: boolean
  /** 来自持久化检查覆盖账本，不能当作模型 token 或阶段百分比。 */
  coverage: { completed: number; planned: number; pending: number; percent: number | null }
  executionFailures: number
}

export function projectF09RunLifecycle(
  state: ReviewBackgroundPiRunState | null,
  run: ReviewRunV2 | null,
  stale: boolean | null,
): F09RunLifecycleView {
  const planned = Math.max(0, run?.coverage.plannedChecks ?? 0)
  const completed = Math.min(planned, Math.max(0, run?.coverage.completedChecks ?? 0))
  const pending = Math.max(0, run?.coverage.pendingChecks ?? 0)
  const coverage = { completed, planned, pending, percent: planned ? Math.round(completed / planned * 100) : null }
  const executionFailures = run?.checks.filter(check => check.status === 'execution-failed').length ?? 0
  const result = (title: string, explanation: string, nextStep: string, startLabel: string,
    canStart: boolean, canStop = false): F09RunLifecycleView => ({
    title, explanation, nextStep, startLabel, canStart, canStop, coverage, executionFailures,
  })

  if (!state || !run) return result('尚未开始',
    '尚无当前 Pi 审核记录；开始后由 Main 创建案卷专属会话和真实 Run。',
    '确认模板、事项、原件和模型后，可以一次启动技术审核。', '开始自动审核', true)

  if (state.runId !== run.id || run.caseId !== state.caseId) return result('运行身份待核验',
    'Main 受理状态与持久化运行身份尚未一致，不能据此确认执行进度。',
    '刷新案卷状态；若仍不一致，由 Main 检查运行绑定。', '等待状态同步', false)

  if (state.phase === 'preparing' && (run.status === 'queued' || run.status === 'running')) return result(
    '等待执行器受理', 'Main 已建立运行记录，但尚未确认 Pi 已取得真实执行权。',
    '请等待受理或错误回执；不能将预写的 running 当作实际执行成功。', '等待受理', false)

  if (state.phase === 'accepted' && (run.status === 'running' || run.status === 'queued')) return result(
    'Pi 正在审核', 'Main 已受理执行；检查结果按实际提交逐项进入 Run 账本。',
    '可以切换案卷；需要停止时会先等待执行权释放。', '正在执行', false, true)

  if (run.status === 'running' || run.status === 'queued') return result('运行状态待核验',
    '本地文件仍为执行中，但目前没有可信的 Main 受理回执。',
    '请刷新或等待启动恢复；不要重复启动同案运行。', '等待状态同步', false)

  if (stale === null) return result('输入版本待核验',
    '尚未取得 Main 对案卷最新输入与历史 Run 的一致性判断。',
    '请刷新版本状态；提交后仍须由 Main 检查是否能安全续跑。', '由 Main 核验后审核', true)

  if (stale === true) return result('原运行已过期',
    '案卷输入或其依据已经变化；历史检查保留，但不能作为当前输入的完整结论。',
    '启动新一轮审核。Main 可继承经验证仍相同的原件读取凭据，旧决定不得自动沿用。', '按新输入审核', true)

  switch (run.status) {
    case 'partially-completed':
      return result('审核部分完成',
        executionFailures ? `已有部分检查持久化，仍有 ${executionFailures} 项执行失败。` : '部分内容已完成，其余仍需检查或人工处理。',
        executionFailures
          ? '可以尝试继续未完成的语义检查；Main 核对同一会话、有效指派和输入版本后决定沿用旧 Run 还是创建新 Run。'
          : '核对待确认项目与覆盖范围，必要时启动新一轮审核。',
        executionFailures ? '继续未完成检查' : '再次审核', true)
    case 'cancelled':
      return result('审核已停止', '原执行权已释放；先前持久化的检查和历史记录仍保留。',
        '再次开始会由 Main 核对输入并创建可用的新运行，不会自动提交旧业务动作。', '停止后重新开始', true)
    case 'failed':
      return result('执行失败或中断', state.error ?? run.error ?? '本轮未达到技术完成状态。',
        '检查失败原因；再次开始前 Main 将核对当前输入和已有运行。', '重试审核', true)
    case 'awaiting-input':
      return result('等待补充输入', '有检查需要材料或事实确认，不能视为已完成。',
        '先补件或确认事实，再继续审核；旧 Run 作为历史保留。', '补充后继续', true)
    case 'awaiting-decision':
      return result('等待人工处理', '自动步骤不能代替审核员或学校有权审批。',
        '先处理人工待办；必要时再发起新的技术审核。', '再次审核', true)
    case 'paused':
      return result('运行已暂停', '已持久化的进度保留，当前没有执行中的 Pi 任务。',
        '检查暂停原因，确认后由 Main 决定续审还是新建 Run。', '继续审核', true)
    case 'completed':
      return result('技术审核已结束', '自动执行结束不意味着所有检查符合，更不代表业务审批通过。',
        pending ? `还有 ${pending} 项待核对，请进入人工工作台。` : '请检查结论、来源并完成需要的人工业务步骤。',
        '发起新一轮', true)
  }
}
