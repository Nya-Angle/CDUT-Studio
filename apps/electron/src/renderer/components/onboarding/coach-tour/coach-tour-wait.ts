/**
 * coach-tour-wait — 引导步骤的业务状态等待状态机
 *
 * 只做三件事：
 *  1. Agent / 速课堂：等待「先出现 running、后回到 idle」的完整回合，避免上一步刚结束被误判完成；
 *  2. 桌宠：轮询主进程聊天状态，同样要求先见 running 再见 idle；
 *  3. 其余：CDUT 登录态、CSLab 验密、任意选择器出现。
 *
 * 任何等待都有超时；超时只上报 timeout，不自动关闭引导。
 */

import * as React from 'react'
import type { CoachTourWait } from './coach-tour-steps'

export type CoachTourWaitStatus = 'idle' | 'waiting' | 'done' | 'timeout'

export type AgentTurnPhase = 'awaiting-send' | 'running' | 'done'

/** Agent 回合状态机（纯函数，便于单测） */
export function reduceAgentTurn(
  phase: AgentTurnPhase,
  running: boolean,
  backgroundWaiting: boolean,
): AgentTurnPhase {
  if (phase === 'done') return 'done'
  if (phase === 'awaiting-send') return running ? 'running' : 'awaiting-send'
  return !running && !backgroundWaiting ? 'done' : 'running'
}

/** 进入步骤时刻记录的 Agent 流式基线 */
export interface AgentStreamBaseline {
  startedAt: number
  contentLen: number
}

/**
 * 快发快回兜底（纯函数，便于单测）：
 * 用户在等待启用之前就发送且回复已完整结束——running 上升沿发生在两次渲染之间被错过，
 * 状态机永远停在 awaiting-send。以「进入步骤时刻」为基线，只要之后出现过更新的回合
 * （startedAt 前移）或同回合内容增长且已收敛，即判定本轮回复完成。
 * 用户未发送时基线不变，不会误判。
 */
export function agentWaitShouldCompleteByBaseline(
  baseline: AgentStreamBaseline,
  current: { startedAt?: number; contentLen?: number },
): boolean {
  const startedAt = current.startedAt ?? 0
  if (startedAt > baseline.startedAt) return true
  return startedAt === baseline.startedAt && (current.contentLen ?? 0) > baseline.contentLen
}

/**
 * 桌宠快发快回兜底（纯函数，便于单测）：
 * 700ms 轮询间隔可能错过秒发短指令的完整回合；以进入步骤时刻的 lastDoneAt 为基线，
 * 只要之后出现过更新的完成时间即判定本轮完成。用户未发送时 lastDoneAt 不变，不会误判。
 */
export function petWaitShouldCompleteByBaseline(
  baselineDoneAt: number,
  lastDoneAt: number | null,
): boolean {
  return lastDoneAt !== null && lastDoneAt > baselineDoneAt
}

const DEFAULT_TIMEOUT_MS: Record<CoachTourWait['kind'], number> = {
  'agent-idle': 240_000,
  'cdut-active': 60_000,
  'pet-idle': 180_000,
  'cslab-verified': 180_000,
  selector: 120_000,
}

interface UseCoachTourWaitArgs {
  /** 准备阶段完成后才允许开始等待 */
  enabled: boolean
  stepKey: string
  waitFor?: CoachTourWait
  sessionId: string | null
  running: boolean
  backgroundWaiting: boolean
  /** 当前会话流式正文长度（快发快回基线兜底用） */
  contentLength?: number
  /** 当前会话最近一轮回合开始时间（快发快回基线兜底用） */
  startedAt?: number
  cdutActive: boolean
  cslabVerified: boolean
}

interface UseCoachTourWaitResult {
  status: CoachTourWaitStatus
  message: string
}

const MESSAGES: Partial<Record<CoachTourWait['kind'], string>> = {
  'agent-idle': '正在等待模型完整回复…',
  'cdut-active': '正在等待特区账户认证完成…',
  'pet-idle': '正在等待砚小龙完成任务…',
  'cslab-verified': '正在等待本机门禁解锁…',
  selector: '正在等待界面就绪…',
}

export function useCoachTourWait({
  enabled,
  stepKey,
  waitFor,
  sessionId,
  running,
  backgroundWaiting,
  contentLength,
  startedAt,
  cdutActive,
  cslabVerified,
}: UseCoachTourWaitArgs): UseCoachTourWaitResult {
  const [status, setStatus] = React.useState<CoachTourWaitStatus>('idle')
  const agentPhaseRef = React.useRef<AgentTurnPhase>('awaiting-send')
  /** 进入步骤时刻的 Agent 流式基线（快发快回兜底） */
  const agentBaselineRef = React.useRef<AgentStreamBaseline | null>(null)
  /** 进入步骤时刻的桌宠 lastDoneAt 基线（快发快回兜底；null 表示尚未快照） */
  const petBaselineDoneRef = React.useRef<number | null>(null)
  /** 最新流式元数据镜像（render 期更新，供切步效应无闭包过期地读取） */
  const streamMetaRef = React.useRef<{ startedAt?: number; contentLen: number }>({
    contentLen: 0,
  })
  streamMetaRef.current = { startedAt, contentLen: contentLength ?? 0 }

  // 切步或切换会话即重置，并记录此刻的 Agent 流式基线——此刻新回复必然尚未开始
  React.useEffect(() => {
    agentPhaseRef.current = 'awaiting-send'
    agentBaselineRef.current = {
      startedAt: streamMetaRef.current.startedAt ?? 0,
      contentLen: streamMetaRef.current.contentLen,
    }
    petBaselineDoneRef.current = null
    setStatus('idle')
  }, [stepKey, sessionId])

  const kind = waitFor?.kind

  // 桌宠基线：进入 pet-idle 步骤瞬间快照主进程 lastDoneAt（早于用户可能的秒发完成）
  React.useEffect(() => {
    if (kind !== 'pet-idle') return
    let cancelled = false
    void window.electronAPI.yanhuExpress
      .petGetChatStatus()
      .then((snapshot) => {
        if (!cancelled) petBaselineDoneRef.current = snapshot.lastDoneAt ?? 0
      })
      .catch(() => {
        /* 快照失败时基线保持 null，仅走正常上升沿路径 */
      })
    return () => {
      cancelled = true
    }
  }, [kind, stepKey])

  // Agent / 速课堂：观察 running 的完整上升沿与下降沿，附快发快回基线兜底
  React.useEffect(() => {
    if (!enabled || kind !== 'agent-idle') return
    let next = reduceAgentTurn(agentPhaseRef.current, running, backgroundWaiting)
    const baseline = agentBaselineRef.current
    if (
      next === 'awaiting-send' && !running && !backgroundWaiting && baseline
      && agentWaitShouldCompleteByBaseline(baseline, streamMetaRef.current)
    ) {
      next = 'done'
    }
    agentPhaseRef.current = next
    setStatus(next === 'done' ? 'done' : 'waiting')
    // contentLength / startedAt 必须入依赖：模型秒回时 running 的上升沿与下降沿可能落在两次渲染之间，
    // 只有内容或回合时间变化能让本 effect 重跑，基线兜底才不会漏判
  }, [enabled, kind, running, backgroundWaiting, sessionId, startedAt, contentLength])

  // CDUT 登录态
  React.useEffect(() => {
    if (!enabled || kind !== 'cdut-active') return
    setStatus(cdutActive ? 'done' : 'waiting')
  }, [enabled, kind, cdutActive])

  // CSLab 验密
  React.useEffect(() => {
    if (!enabled || kind !== 'cslab-verified') return
    setStatus(cslabVerified ? 'done' : 'waiting')
  }, [enabled, kind, cslabVerified])

  // 桌宠：轮询主进程聊天状态，附快发快回基线兜底
  React.useEffect(() => {
    if (!enabled || kind !== 'pet-idle') return
    let cancelled = false
    let phase: 'awaiting-send' | 'running' = 'awaiting-send'
    const tick = async (): Promise<void> => {
      try {
        const result = await window.electronAPI.yanhuExpress.petGetChatStatus()
        if (cancelled) return
        if (phase === 'awaiting-send' && result.running) {
          phase = 'running'
        } else if (phase === 'running' && !result.running) {
          setStatus('done')
        } else if (phase === 'awaiting-send' && !result.running) {
          // 秒发短指令可能在 700ms 轮询间隔内完成整轮回合（错过 running 上升沿）：
          // 以进入步骤时刻的 lastDoneAt 基线兜底，出现更新的完成时间即判定本轮结束
          const baseline = petBaselineDoneRef.current
          if (baseline !== null && petWaitShouldCompleteByBaseline(baseline, result.lastDoneAt)) {
            setStatus('done')
          }
        }
      } catch {
        /* 轮询失败保持等待，由超时兜底 */
      }
    }
    void tick()
    const timer = window.setInterval(() => void tick(), 700)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [enabled, kind, stepKey])

  // 任意选择器出现
  React.useEffect(() => {
    if (!enabled || kind !== 'selector' || !waitFor || waitFor.kind !== 'selector') return
    const selector = waitFor.selector
    let cancelled = false
    const tick = (): void => {
      if (cancelled) return
      const el = document.querySelector<HTMLElement>(selector)
      if (el && el.getClientRects().length > 0) {
        setStatus('done')
        window.clearInterval(timer)
      }
    }
    const timer = window.setInterval(tick, 250)
    tick()
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [enabled, kind, waitFor])

  // 超时兜底
  React.useEffect(() => {
    if (!enabled || !waitFor || status !== 'waiting') return
    const timeout = waitFor.timeoutMs ?? DEFAULT_TIMEOUT_MS[waitFor.kind]
    const timer = window.setTimeout(() => setStatus('timeout'), timeout)
    return () => window.clearTimeout(timer)
  }, [enabled, waitFor, status])

  return {
    status,
    message: status === 'timeout'
      ? '等待超时，可点击下一步继续'
      : (kind ? MESSAGES[kind] ?? '' : ''),
  }
}
