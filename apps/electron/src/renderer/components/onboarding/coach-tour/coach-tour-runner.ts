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

/** 步骤切换后仍在执行的准备动作统一以此中止，避免旧指令在后续步骤「补执行」 */
class TourCancelledError extends Error {
  constructor() {
    super('引导步骤已切换')
    this.name = 'TourCancelledError'
  }
}

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
  /** 准备动作执行令牌：切步/关闭即自增，旧一轮异步动作据此静默中止 */
  const runTokenRef = React.useRef(0)

  const waitForAck = React.useCallback(
    async (
      id: number,
      timeoutMs: number,
      isStale?: () => boolean,
    ): Promise<{ ok: boolean; error?: string } | null> => {
      const startedAt = Date.now()
      while (Date.now() - startedAt < timeoutMs) {
        if (isStale?.()) throw new TourCancelledError()
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
        | { kind: 'open-academic-search'; query: string }
        | { kind: 'refresh-assets' },
      attempts = 2,
      timeoutMs = 8000,
      expectedLabId?: string | null,
      isStale?: () => boolean,
    ): Promise<void> => {
      if (isStale?.()) throw new TourCancelledError()
      // 重播/刷新后 ref 可能为空，回退到当前激活实验室，避免指令落到错误工作台
      const labId = expectedLabId ?? demoLabIdRef.current ?? store.get(cslabActiveLabIdAtom)
      // 必须等工作台挂载且资产首批加载完成，否则指令会被工作台当作「目标不存在」丢弃
      const workspaceSelector = labId
        ? `[data-tour="cslab-workspace"][data-cslab-lab-id="${labId}"][data-cslab-ready="true"]`
        : '[data-tour="cslab-workspace"][data-cslab-ready="true"]'
      await waitForSelector(workspaceSelector, READY_SELECTOR_TIMEOUT)
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (isStale?.()) throw new TourCancelledError()
        commandSeqRef.current += 1
        const id = commandSeqRef.current
        store.set(cslabTourCommandAtom, { ...payload, id } as CsLabTourCommand)
        const ack = await waitForAck(id, timeoutMs, isStale)
        if (ack?.ok) return
        if (ack && !ack.ok) throw new Error(ack.error || '科研工作台执行引导指令失败')
      }
      throw new Error('科研工作台未响应引导指令，请稍后点击「跳过本步」')
    },
    [store, waitForAck],
  )

  const fillComposer = React.useCallback(
    async (text: string, composerSelector: string, isStale?: () => boolean): Promise<void> => {
      await waitForSelector(composerSelector, READY_SELECTOR_TIMEOUT)
      if (isStale?.()) throw new TourCancelledError()
      const sessionId = store.get(currentAgentSessionIdAtom)
      if (!sessionId) throw new Error('未找到可用的 Agent 会话')
      store.set(agentComposerInjectionAtom, { sessionId, text, nonce: Date.now() })
      toast.info('问题已填入输入框，请点击发送')
    },
    [store],
  )

  /** 速课堂工件页签：等页签挂载 → 点击 → 等对应工件视图真正可见，失败重试到 8s */
  const switchAiClassTab = React.useCallback(
    async (
      tab: 'mindmap' | 'flashcard' | 'quiz',
      viewSelector: string,
      isStale?: () => boolean,
    ): Promise<void> => {
      const tabSelector = `[data-tour-tab="${tab}"]`
      await waitForSelector(tabSelector, 8000)
      const deadline = Date.now() + 8000
      while (Date.now() < deadline) {
        if (isStale?.()) throw new TourCancelledError()
        document.querySelector<HTMLElement>(tabSelector)?.click()
        await sleep(300)
        const view = document.querySelector<HTMLElement>(viewSelector)
        if (view && view.getClientRects().length > 0) return
      }
      throw new Error('学习工件未能在预期时间内打开，请点击「跳过本步」继续')
    },
    [],
  )

  const runTrigger = React.useCallback(
    async (trigger: CoachTourTrigger, isStale: () => boolean): Promise<void> => {
      if (isStale()) throw new TourCancelledError()
      switch (trigger) {
        case 'ensure-draft-session': {
          if (store.get(currentAgentSessionIdAtom)) return
          await createAgent({ draft: true })
          return
        }
        case 'fill-calculus':
          await fillComposer(PROMPT_CALCULUS, '[data-input-mode="agent"]', isStale)
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
          if (isStale()) throw new TourCancelledError()
          if (!result.documentIngested) {
            toast.warning('演示资料未找到，《红楼梦》课堂仍可进入，但回答可能缺少原文依据')
          }
          enterAiClass(result.session.sessionId, result.session.courseName)
          return
        }
        case 'switch-tab-mindmap':
          await switchAiClassTab('mindmap', '[data-tour="ai-class-mindmap-view"]', isStale)
          return
        case 'switch-tab-flashcard':
          await switchAiClassTab('flashcard', '[data-tour="ai-class-flashcard-view"]', isStale)
          return
        case 'switch-tab-quiz':
          await switchAiClassTab('quiz', '[data-tour="ai-class-quiz-view"]', isStale)
          return
        case 'fill-honglou-q1':
          await fillComposer(
            PROMPT_HONGLOU_Q1,
            '[data-tour="ai-class-chat"] [data-input-mode="agent"]',
            isStale,
          )
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
          if (isStale()) throw new TourCancelledError()
          if (status.isVerified) return
          // 已设过密码（sessionVerified 仅存内存，重启后必然为 false）：先试演示密码，
          // 失败则把演示密码预填到输入框并明确提示用户改成自己的密码，绝不空等验密超时
          if (status.isInitialized) {
            const result = await window.electronAPI.cslab.verifyPassword(DEMO_CSLAB_PASSWORD)
            if (isStale()) throw new TourCancelledError()
            if (result.success) return
            // 不阻断步骤：预填演示密码并提示用户改成自己的密码，验密成功后 waitFor 会自动继续
            setNativeInputValue('[data-tour="cslab-auth-password"]', DEMO_CSLAB_PASSWORD)
            toast.warning('本机已设置过访问密码，演示密码未通过，请输入你的密码解锁后自动继续')
            return
          }
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
          if (isStale()) throw new TourCancelledError()
          await window.electronAPI.cslab.openLab(result.lab.id)
          demoLabIdRef.current = result.lab.id
          store.set(cslabActiveLabIdAtom, result.lab.id)
          // 已有同名实验室时 createDemoLab 会补入新资产，等工作台就绪后强制刷新一次列表
          await sendCsLabCommand({ kind: 'refresh-assets' }, 2, 8000, result.lab.id, isStale)
          return
        }
        case 'open-table-1':
          await sendCsLabCommand(
            { kind: 'open-table-at-index', index: 0 },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-table-2':
          await sendCsLabCommand(
            { kind: 'open-table-at-index', index: 1 },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-geo-dem':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'biogeo_basin_dem.asc' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-digitizer-figure':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'standard_calibration_curve.png' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-mol-gold':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'b_dna_double_helix.pdb' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-mol-srtio3':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'perovskite_cubic.cif' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-mol-garnet':
          await sendCsLabCommand(
            { kind: 'open-asset-by-title', title: 'rutile_tio2.cif' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-publication-plot':
          await sendCsLabCommand(
            { kind: 'open-plot', plotId: 'flagship-xrd-dual' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        case 'open-science-agent-window': {
          const labId = demoLabIdRef.current ?? store.get(cslabActiveLabIdAtom)
          if (!labId) throw new Error('演示实验室尚未打开，无法唤起科学助理')
          await window.electronAPI.cslab.openAgentWindow({ labId })
          return
        }
        case 'open-academic-search':
          await sendCsLabCommand(
            { kind: 'open-academic-search', query: 'Attention Is All You Need' },
            2,
            8000,
            demoLabIdRef.current,
            isStale,
          )
          return
        default: {
          // 编译期穷尽检查：新增触发器却漏写分支时 typecheck 直接失败
          const exhaustive: never = trigger
          return exhaustive
        }
      }
    },
    [createAgent, enterAiClass, fillComposer, sendCsLabCommand, store, switchAiClassTab],
  )

  // 触发函数依赖导航 Hook，其引用可能随侧栏状态变化；用 ref 保证「每步只执行一次」
  const runTriggerRef = React.useRef(runTrigger)
  runTriggerRef.current = runTrigger

  React.useEffect(() => {
    if (!open || !step) {
      runTokenRef.current += 1
      setState({ phase: 'idle', message: '', key: null })
      return
    }
    // 每次准备都有独立令牌：切步 / 关闭后旧动作立即失效，不再向工作台补发指令
    const token = runTokenRef.current + 1
    runTokenRef.current = token
    const isStale = (): boolean => runTokenRef.current !== token
    const stepKey = step.key
    const prepare = step.prepare
    const hasPrepare = Boolean(prepare?.triggers?.length || prepare?.readySelector)
    // 无准备动作的步骤直接就绪，避免按钮闪一下「准备中…」
    setState({
      phase: hasPrepare ? 'preparing' : 'ready',
      message: hasPrepare ? '正在准备演示环境…' : '',
      key: stepKey,
    })
    let timer: number | null = null
    const run = async (): Promise<void> => {
      try {
        for (const trigger of prepare?.triggers ?? []) {
          if (isStale()) return
          await runTriggerRef.current(trigger, isStale)
        }
        if (prepare?.readySelector) {
          if (isStale()) return
          await waitForSelector(
            prepare.readySelector,
            prepare.timeoutMs ?? READY_SELECTOR_TIMEOUT * 6,
          )
        }
        if (!isStale()) setState({ phase: 'ready', message: '', key: stepKey })
      } catch (error) {
        if (error instanceof TourCancelledError || isStale()) return
        const message = error instanceof Error ? error.message : '演示准备失败'
        setState({ phase: 'error', message, key: stepKey })
        toast.error(message)
      }
    }
    // 整体兜底：触发器内部 IPC 卡住时也要能退出「正在准备演示环境…」
    if (hasPrepare) {
      const overallMs = (prepare?.timeoutMs ?? READY_SELECTOR_TIMEOUT * 6) + 30_000
      timer = window.setTimeout(() => {
        if (isStale()) return
        runTokenRef.current += 1
        const message = '引导准备超时，可点击「跳过本步」继续'
        setState({ phase: 'error', message, key: stepKey })
        toast.error(message)
      }, overallMs)
    }
    void run()
    return () => {
      runTokenRef.current += 1
      if (timer !== null) window.clearTimeout(timer)
    }
  }, [open, step?.key])

  // 切步后的首帧：旧步骤状态尚未被 effect 替换，先按 preparing 处理
  if (step && state.key !== step.key) {
    return { phase: 'preparing', message: '正在准备演示环境…' }
  }
  return { phase: state.phase, message: state.message }
}
