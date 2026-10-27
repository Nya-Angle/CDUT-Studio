/**
 * coach-tour-runner — 引导步骤的自动准备动作执行器
 *
 * 把「建会话 / 登录 / 建课堂 / 开实验室 / 打开资产」等副作用从 Overlay 中剥离，
 * 统一提供 preparing → ready / error 三段状态；失败只上报，不抛到 React 边界。
 */

import * as React from 'react'
import { useStore } from 'jotai'
import { toast } from 'sonner'
import {
  agentComposerInjectionAtom,
  currentAgentSessionIdAtom,
} from '@/atoms/agent-atoms'
import { cdutAccountAtom } from '@/atoms/cdut-account-atoms'
import { cslabActiveLabIdAtom } from '@/atoms/cslab-atoms'
import { cslabTourAckAtom, cslabTourCommandAtom, type CsLabTourCommand } from '@/atoms/cslab-tour-atoms'
import { useCreateSession } from '@/hooks/useCreateSession'
import { useEnterCdutAiClass } from '@/hooks/useEnterCdutAiClass'
import {
  DEMO_CSLAB_PASSWORD,
  DEMO_CDUT_ACCOUNT,
  PROMPT_CALCULUS,
  PROMPT_HONGLOU_Q1,
  PROMPT_YANHU,
  type CoachTourStep,
  type CoachTourTrigger,
} from './coach-tour-steps'

export type CoachTourRunPhase = 'idle' | 'preparing' | 'ready' | 'error'

interface RunnerState {
  phase: CoachTourRunPhase
  message: string
  /** 该状态所属步骤 key：切步瞬间强制回到 preparing，避免旧步骤的 ready 污染新步骤 */
  key: string | null
}

const READY_SELECTOR_TIMEOUT = 10_000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function waitForSelector(selector: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el && el.getClientRects().length > 0) return
    await sleep(200)
  }
  throw new Error('目标界面未在预期时间内出现')
}

/** 受控 input 必须走「原型 value setter + input 事件」，否则 React 不感知 */
function setNativeInputValue(selector: string, value: string): boolean {
  const el = document.querySelector<HTMLInputElement>(selector)
  if (!el) return false
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  return true
}

export function useCoachTourRunner(
  open: boolean,
  step: CoachTourStep | undefined,
): { phase: CoachTourRunPhase; message: string } {
  const store = useStore()
  const { createAgent } = useCreateSession()
  const enterAiClass = useEnterCdutAiClass()
  const [state, setState] = React.useState<RunnerState>({ phase: 'idle', message: '', key: null })
  const commandSeqRef = React.useRef(0)
  /** 当前演示实验室 id：资产指令必须落到同一个实验室，避免切换实验室时的旧回调竞态 */
  const demoLabIdRef = React.useRef<string | null>(null)

  const waitForAck = React.useCallback(
    async (id: number, timeoutMs: number): Promise<{ ok: boolean; error?: string } | null> => {
      const startedAt = Date.now()
      while (Date.now() - startedAt < timeoutMs) {
        const ack = store.get(cslabTourAckAtom)
        if (ack?.id === id) return ack
        await sleep(120)
      }
      return null
    },
    [store],
  )

  const sendCsLabCommand = React.useCallback(
    async (
      payload:
        | { kind: 'open-table-at-index'; index: number }
        | { kind: 'open-asset-by-title'; title: string }
        | { kind: 'open-plot'; plotId: string }
        | { kind: 'refresh-assets' },
      attempts = 3,
      timeoutMs = 3000,
      expectedLabId?: string | null,
    ): Promise<void> => {
      // 命令必须在工作台挂载完成后下发，否则 atom 指令会被漏掉
      const workspaceSelector = expectedLabId
        ? `[data-tour="cslab-workspace"][data-cslab-lab-id="${expectedLabId}"]`
        : '[data-tour="cslab-workspace"]'
      await waitForSelector(workspaceSelector, READY_SELECTOR_TIMEOUT)
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        commandSeqRef.current += 1
        const id = commandSeqRef.current
        store.set(cslabTourCommandAtom, { ...payload, id } as CsLabTourCommand)
        const ack = await waitForAck(id, timeoutMs)
        if (ack?.ok) return
        if (ack && !ack.ok) throw new Error(ack.error || '科研工作台执行引导指令失败')
      }
      throw new Error('科研工作台未响应引导指令')
    },
    [store, waitForAck],
  )

  const fillComposer = React.useCallback(
    async (text: string, composerSelector: string): Promise<void> => {
      await waitForSelector(composerSelector, READY_SELECTOR_TIMEOUT)
      const sessionId = store.get(currentAgentSessionIdAtom)
      if (!sessionId) throw new Error('未找到可用的 Agent 会话')
      store.set(agentComposerInjectionAtom, { sessionId, text, nonce: Date.now() })
      toast.info('问题已填入输入框，请点击发送')
    },
    [store],
  )

  const runTrigger = React.useCallback(
    async (trigger: CoachTourTrigger): Promise<void> => {
      switch (trigger) {
        case 'ensure-draft-session': {
          if (store.get(currentAgentSessionIdAtom)) return
          await createAgent({ draft: true })
          return
        }
        case 'fill-calculus':
          await fillComposer(PROMPT_CALCULUS, '[data-input-mode="agent"]')
          return
        case 'login-demo': {
          if (store.get(cdutAccountAtom).status === 'active') return
          await waitForSelector('[data-tour="cdut-login-username"]', READY_SELECTOR_TIMEOUT)
          setNativeInputValue('[data-tour="cdut-login-username"]', DEMO_CDUT_ACCOUNT.username)
          setNativeInputValue('[data-tour="cdut-login-password"]', DEMO_CDUT_ACCOUNT.password)
          const result = await window.electronAPI.cdutZone.login({
            username: DEMO_CDUT_ACCOUNT.username,
            password: DEMO_CDUT_ACCOUNT.password,
            rememberPassword: false,
          })
          if (!result.success) throw new Error(result.error || '演示账号登录失败')
          return
        }
        case 'ensure-demo-ai-class': {
          const result = await window.electronAPI.cdutAiClass.ensureDemoSession()
          if (!result.documentIngested) {
            toast.warning('演示资料未找到，《红楼梦》课堂仍可进入，但回答可能缺少原文依据')
          }
          enterAiClass(result.session.sessionId, result.session.courseName)
          return
        }
        case 'switch-tab-mindmap': {
          const btn = document.querySelector<HTMLElement>('[data-tour-tab="mindmap"]')
          btn?.click()
          return
        }
        case 'switch-tab-flashcard': {
          const btn = document.querySelector<HTMLElement>('[data-tour-tab="flashcard"]')
          btn?.click()
          return
        }
        case 'switch-tab-quiz': {
          const btn = document.querySelector<HTMLElement>('[data-tour-tab="quiz"]')
          btn?.click()
          return
        }
        case 'fill-honglou-q1':
          await fillComposer(PROMPT_HONGLOU_Q1, '[data-tour="ai-class-chat"] [data-input-mode="agent"]')
          return
                case 'prepare-pet-demo': {
          await waitForSelector('[data-tour="yanhu-express-stage"]', READY_SELECTOR_TIMEOUT)
          // 引导蒙层会隐藏原生网页视图，这里用舞台 DOM 矩形为桌宠提供有效视口
          const stage = document.querySelector<HTMLElement>('[data-tour="yanhu-express-stage"]')
          if (stage) {
            const rect = stage.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
              await window.electronAPI.yanhuExpress.petSyncViewport({
                x: Math.round(rect.left),
                y: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              })
            }
          }
          await window.electronAPI.yanhuExpress.petTourPresent()
          const startedAt = Date.now()
          let ready = false
          while (Date.now() - startedAt < 12_000) {
            const status = await window.electronAPI.yanhuExpress.petGetChatStatus()
            if (status.ready) {
              ready = true
              break
            }
            await sleep(300)
          }
          if (!ready) throw new Error('砚小龙窗口未就绪，请确认智联万站已打开')
          await window.electronAPI.yanhuExpress.petTourFill(PROMPT_YANHU)
          toast.info('指令已填入砚小龙卡片，请点击发送')
          return
        }
        case 'apply-demo-cslab-password': {
          const status = await window.electronAPI.cslab.getAuthStatus()
          if (status.isVerified || status.isInitialized) return
          await waitForSelector('[data-tour="cslab-auth-password"]', READY_SELECTOR_TIMEOUT)
          setNativeInputValue('[data-tour="cslab-auth-password"]', DEMO_CSLAB_PASSWORD)
          setNativeInputValue('[data-tour="cslab-auth-password-confirm"]', DEMO_CSLAB_PASSWORD)
          // 等待 React 受控状态刷新，按钮解除 disabled 后再提交
          const submit = document.querySelector<HTMLButtonElement>('[data-tour="cslab-auth-submit"]')
          const startedAt = Date.now()
          while (submit?.disabled && Date.now() - startedAt < 2000) {
            await sleep(50)
          }
          submit?.click()
          return
        }
        case 'open-demo-lab': {
          const result = await window.electronAPI.cslab.createDemoLab()
          await window.electronAPI.cslab.openLab(result.lab.id)
          demoLabIdRef.current = result.lab.id
          store.set(cslabActiveLabIdAtom, result.lab.id)
          // 已有同名实验室时 createDemoLab 会补入新资产，强制工作台刷新一次列表
          await sendCsLabCommand({ kind: 'refresh-assets' }, 3, 3000, result.lab.id)
          return
        }
        case 'open-table-1':
          await sendCsLabCommand(
            { kind: 'open-table-at-index', index: 0 },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-table-2':
          await sendCsLabCommand(
            { kind: 'open-table-at-index', index: 1 },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-digitizer-figure':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'standard_calibration_curve.png' },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-mol-gold':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'b_dna_double_helix.pdb' },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-mol-srtio3':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'perovskite_cubic.cif' },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-mol-garnet':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'rutile_tio2.cif' },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        case 'open-publication-plot':
          await sendCsLabCommand(
            { kind: 'open-plot', plotId: 'flagship-xrd-dual' },
            3,
            3000,
            demoLabIdRef.current,
          )
          return
        default:
          return
      }
    },
    [createAgent, enterAiClass, fillComposer, sendCsLabCommand, store],
  )

  // 触发函数依赖导航 Hook，其引用可能随侧栏状态变化；用 ref 保证「每步只执行一次」
  const runTriggerRef = React.useRef(runTrigger)
  runTriggerRef.current = runTrigger

  React.useEffect(() => {
    if (!open || !step) {
      setState({ phase: 'idle', message: '', key: null })
      return
    }
    let cancelled = false
    const stepKey = step.key
    setState({ phase: 'preparing', message: '正在准备演示环境…', key: stepKey })
    const prepare = step.prepare
    const run = async (): Promise<void> => {
      try {
        for (const trigger of prepare?.triggers ?? []) {
          if (cancelled) return
          await runTriggerRef.current(trigger)
        }
        if (prepare?.readySelector) {
          if (cancelled) return
          await waitForSelector(
            prepare.readySelector,
            prepare.timeoutMs ?? READY_SELECTOR_TIMEOUT * 6,
          )
        }
        if (!cancelled) setState({ phase: 'ready', message: '', key: stepKey })
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : '演示准备失败'
        setState({ phase: 'error', message, key: stepKey })
        toast.error(message)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [open, step?.key])

  // 切步后的首帧：旧步骤状态尚未被 effect 替换，先按 preparing 处理
  if (step && state.key !== step.key) {
    return { phase: 'preparing', message: '正在准备演示环境…' }
  }
  return { phase: state.phase, message: state.message }
}
