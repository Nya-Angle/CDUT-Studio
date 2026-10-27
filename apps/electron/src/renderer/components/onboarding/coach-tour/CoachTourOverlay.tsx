/**
 * CoachTourOverlay — 界面蒙层引导（Coach Tour）
 *
 * 核心交互与安全准则：
 *  - 全局：灰色阴影蒙版区域禁用一切交互（拦截点击与拖拽，不穿透到底层 DOM，不触发跳步）；
 *  - 第一步：不提供下一步与跳过按钮，引导用户点击新建会话开启新任务，创建后自动前进；
 *  - 第二步：用户点击发送并回复完成前，下一步按钮不解锁；发送后遮盖输入框、点亮模型回复区域；
 *  - 第三步：进入 CDUT 校园特区禁止跳过；
 *  - 第四步：校内专用通道，引导用户点击体验全部 4 个快捷通道，弹出右侧组件时将其纳入高亮，
 *    用户点击蒙版可关闭组件，3 秒无操作自动关闭；体验完 4 项后解锁下一步；
 *  - 第五步：在问题填入前，输入框保持可见但禁用交互；
 *  - 第六步：智联万站发送前深色蒙版遮盖网页部分，仅凸显砚小龙；成理官网加载完成后提前解锁；
 *  - 第 15~17 步：高亮区域禁止交互，用户自主点击下一步继续；
 *  - 3D 模型步骤：放行 3D 视口内部鼠标手势，允许用户亲自旋转、平移与缩放探索；
 *  - 最终步：呈现 CDUT Studio 徽标、5 位核心开发者头像浮现动画与祝福寄语。
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useAtom, useAtomValue, useSetAtom, useStore } from 'jotai'
import { CheckCircle2, Crosshair, X } from 'lucide-react'
import { toast } from 'sonner'
import { coachTourCurrentStepKeyAtom, coachTourOpenAtom } from '@/atoms/coach-tour-atoms'
import { activeViewAtom, type ActiveView } from '@/atoms/active-view'
import {
  agentSessionStreamingStateAtomFamily,
  currentAgentSessionIdAtom,
} from '@/atoms/agent-atoms'
import { cdutAccountAtom, cdutSubViewAtom } from '@/atoms/cdut-account-atoms'
import { cslabAuthAtom } from '@/atoms/cslab-atoms'
import { useGlobalOverlay } from '@/atoms/overlay-atoms'
import { Button } from '@profer/ui/primitives/button'
import { Z_LAYER } from '@profer/ui'
import { cn } from '@/lib/utils'
import {
  COACH_TOUR_STEPS,
  CURRENT_COACH_TOUR_VERSION,
  type CoachTourStep,
} from './coach-tour-steps'
import { computeCardPosition, unionRects, type AnchorRect, type CardSize } from './coach-tour-position'
import { claimCoachTourOwnership } from './coach-tour-owner'
import { useCoachTourRunner } from './coach-tour-runner'
import { useCoachTourWait } from './coach-tour-wait'
import { CdutLogo } from '@/components/shared/CdutLogo'

import team1 from '@assets/team/team-1.jpg'
import team2 from '@assets/team/team-2.gif'
import team3 from '@assets/team/team-3.png'
import team4 from '@assets/team/team-4.png'
import team5 from '@assets/team/team-5.jpg'

/** 核心开发团队 5 位成员头像 */
const TEAM_AVATARS = [
  { src: team1, name: '核心开发成员 1' },
  { src: team2, name: '核心开发成员 2' },
  { src: team3, name: '核心开发成员 3' },
  { src: team4, name: '核心开发成员 4' },
  { src: team5, name: '核心开发成员 5' },
] as const

/** 未测量前的气泡估算尺寸 */
const FALLBACK_CARD_SIZE: CardSize = { width: 350, height: 190 }
const MOVE_TRANSITION =
  'left 0.32s cubic-bezier(0.22,1,0.36,1), top 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1), height 0.32s cubic-bezier(0.22,1,0.36,1)'

/** 收集某选择器下所有可见且非零尺寸的元素矩形 */
function collectVisibleRects(selector: string): AnchorRect[] {
  const rects: AnchorRect[] = []
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    if (rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none') {
      rects.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
    }
  }
  return rects
}

/** 解析步骤锚点：unionSelectors 取多容器外接矩形，否则按 selectors 依次寻找可见元素 */
function findStepRect(step: CoachTourStep, overrideSelectors?: string[]): AnchorRect | null {
  const selectors = overrideSelectors ?? step.selectors
  if (!overrideSelectors && step.unionSelectors && step.unionSelectors.length > 0) {
    return unionRects(step.unionSelectors.flatMap(collectVisibleRects))
  }
  const found: AnchorRect[] = []
  for (const selector of selectors) {
    const [first] = collectVisibleRects(selector)
    if (first) {
      if (step.key === 'cdut-login' && selectors.length > 1) {
        found.push(first)
      } else {
        return first
      }
    }
  }
  if (found.length > 0) {
    return unionRects(found)
  }
  return null
}

/** 把 Tab/Shift+Tab 循环限制在气泡内部，焦点不逃逸到被遮罩的真实 UI */
function trapTabKey(event: KeyboardEvent, card: HTMLElement | null): void {
  if (!card) return
  const focusables = Array.from(
    card.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0)
  if (focusables.length === 0) {
    event.preventDefault()
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (!first || !last) return
  const active = document.activeElement
  if (event.shiftKey && (active === first || !card.contains(active))) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || !card.contains(active))) {
    event.preventDefault()
    first.focus()
  }
}

/** 把聚光灯几何钳制进视口 */
function clampFrameToViewport(rect: AnchorRect): { left: number; top: number; width: number; height: number } {
  const pad = 8
  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = Math.min(Math.max(rect.left - pad, 0), vw)
  const top = Math.min(Math.max(rect.top - pad, 0), vh)
  const right = Math.max(Math.min(rect.left + rect.width + pad, vw), left)
  const bottom = Math.max(Math.min(rect.top + rect.height + pad, vh), top)
  return { left, top, width: right - left, height: bottom - top }
}

/** 动态透明事件阻断遮罩 */
function DynamicElementShield({ selector }: { selector: string }): React.ReactElement | null {
  const [shieldRect, setShieldRect] = React.useState<AnchorRect | null>(null)
  React.useEffect(() => {
    let raf = 0
    const tick = () => {
      const el = document.querySelector<HTMLElement>(selector)
      if (el) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          setShieldRect({ left: r.left, top: r.top, width: r.width, height: r.height })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [selector])

  if (!shieldRect) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto absolute cursor-not-allowed z-10 bg-transparent"
      style={{
        left: shieldRect.left,
        top: shieldRect.top,
        width: shieldRect.width,
        height: shieldRect.height,
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      onMouseDown={(e) => e.stopPropagation()}
    />
  )
}

export function CoachTourOverlay(): React.ReactElement | null {
  const store = useStore()
  const [open, setOpen] = useAtom(coachTourOpenAtom)
  const setTourCurrentStepKey = useSetAtom(coachTourCurrentStepKeyAtom)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [rect, setRect] = React.useState<AnchorRect | null>(null)
  const [pulseRects, setPulseRects] = React.useState<AnchorRect[]>([])
  const [cardSize, setCardSize] = React.useState<CardSize>(FALLBACK_CARD_SIZE)
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })
  const cardRef = React.useRef<HTMLDivElement>(null)
  /** 打开引导时用户所在的主内容区视图，退出时恢复 */
  const restoreViewRef = React.useRef<ActiveView | null>(null)
  /** 交互步骤中已排定的自动前进定时器，防止连点锚点跳两步 */
  const advanceTimerRef = React.useRef<number | null>(null)

  const totalSteps = COACH_TOUR_STEPS.length
  const step = COACH_TOUR_STEPS[stepIndex]
  const isLast = stepIndex === totalSteps - 1
  const sessionId = useAtomValue(currentAgentSessionIdAtom)
  const streamState = useAtomValue(
    agentSessionStreamingStateAtomFamily(sessionId ?? '__coach-tour-none__'),
  )
  const cdutAccount = useAtomValue(cdutAccountAtom)
  const cslabAuth = useAtomValue(cslabAuthAtom)

  // 同步全局引导步骤原子状态，供各子业务组件按步特化禁用
  React.useEffect(() => {
    setTourCurrentStepKey(open ? step?.key ?? null : null)
  }, [open, step?.key, setTourCurrentStepKey])

  // 智联万站步骤需让原生网页视图正常呈现，用户才能看到砚小龙驱动百度搜索与官网跳转的实时过程
  const isYanhuStep = step?.cdutSubView === 'yanhu-express'
  useGlobalOverlay(open && !isYanhuStep)

  const runner = useCoachTourRunner(open, step)
  const wait = useCoachTourWait({
    enabled: open && runner.phase === 'ready' && (step?.advanceOn === 'wait' || Boolean(step?.waitFor)),
    stepKey: step?.key ?? '',
    waitFor: step?.waitFor,
    sessionId,
    running: streamState?.running ?? false,
    backgroundWaiting: streamState?.backgroundWaiting ?? false,
    contentLength: streamState?.content.length,
    startedAt: streamState?.startedAt,
    cdutActive: cdutAccount.status === 'active',
    cslabVerified: cslabAuth.isVerified,
  })

  // ===== 第一步状态管控：创建新会话后自动进入下一步 =====
  const initialWelcomeSessionIdRef = React.useRef(sessionId)
  React.useEffect(() => {
    if (!open || step?.key !== 'welcome-agent') {
      initialWelcomeSessionIdRef.current = sessionId
      return
    }
    if (sessionId && sessionId !== initialWelcomeSessionIdRef.current) {
      setStepIndex((cur) => cur + 1)
    }
  }, [open, step?.key, sessionId])

  // ===== 第二步状态管控：发送前锁定输入框，发送后锁定回复并点亮回复区域 =====
  const [calculusSent, setCalculusSent] = React.useState(false)
  const [calculusDone, setCalculusDone] = React.useState(false)

  React.useEffect(() => {
    if (!open || step?.key !== 'calculus') {
      setCalculusSent(false)
      setCalculusDone(false)
      return
    }
    if (streamState?.running) {
      setCalculusSent(true)
    }
  }, [open, step?.key, streamState?.running])

  React.useEffect(() => {
    if (!open || step?.key !== 'calculus') return
    if (calculusSent && !streamState?.running && (streamState?.content?.length ?? 0) > 0) {
      setCalculusDone(true)
    } else if (wait.status === 'done') {
      setCalculusDone(true)
    }
  }, [open, step?.key, calculusSent, streamState?.running, streamState?.content?.length, wait.status])

  // ===== 第四步状态管控：跟踪 4 个快捷通道点击，右侧 Sheet 交互与 3s 自动关闭 =====
  const [clickedQuickFeatures, setClickedQuickFeatures] = React.useState<Set<string>>(new Set())
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open || step?.key !== 'cdut-login') {
      setClickedQuickFeatures(new Set())
      setIsSheetOpen(false)
      return
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const btn = target?.closest('[data-tour-quick-feature]')
      const featureId = btn?.getAttribute('data-tour-quick-feature')
      if (featureId) {
        setClickedQuickFeatures((prev) => {
          const nextSet = new Set(prev)
          nextSet.add(featureId)
          return nextSet
        })
      }
    }
    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [open, step?.key])

  // 侦测右侧 Sheet 是否弹出
  React.useEffect(() => {
    if (!open || step?.key !== 'cdut-login') {
      setIsSheetOpen(false)
      return
    }
    let raf = 0
    const checkSheet = () => {
      const sheet = document.querySelector<HTMLElement>('[data-tour="cdut-feature-sheet"]')
      const openNow = Boolean(sheet && sheet.getClientRects().length > 0)
      setIsSheetOpen(openNow)
      raf = requestAnimationFrame(checkSheet)
    }
    raf = requestAnimationFrame(checkSheet)
    return () => cancelAnimationFrame(raf)
  }, [open, step?.key])

  // 右侧 Sheet 持续 3 秒后若未关闭则自动关闭
  React.useEffect(() => {
    if (!open || step?.key !== 'cdut-login' || !isSheetOpen) return
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cdut:close-feature-sheet'))
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [open, step?.key, isSheetOpen])

  // 关闭右侧 Sheet（蒙版点击事件回调）
  const handleCloseSheet = React.useCallback(() => {
    if (step?.key === 'cdut-login' && isSheetOpen) {
      window.dispatchEvent(new CustomEvent('cdut:close-feature-sheet'))
    }
  }, [step?.key, isSheetOpen])

  // ===== 动态选择器与智联万站蒙版 =====
  const activeSelectors = React.useMemo(() => {
    if (!step) return []
    if (step.key === 'calculus' && calculusSent) {
      return ['[data-tour="agent-messages-container"]', '[data-tour="chat-message-list"]', '[data-agent-session-id]']
    }
    if (step.key === 'cdut-login' && isSheetOpen) {
      return ['[data-tour="cdut-quickbar"]', '[data-tour="cdut-feature-sheet"]']
    }
    
    return step.selectors
  }, [step, calculusSent, isSheetOpen])

  const prepareReady = runner.phase === 'ready'
  const stepRef = React.useRef<CoachTourStep | undefined>(step)
  stepRef.current = step
  const isClickToAdvance = step?.advanceOn === 'click-anchor'
  const interactive = isClickToAdvance && rect !== null && prepareReady

  React.useEffect(() => {
    if (!open) return
    const handleResize = (): void => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [open])

  // 打开时：回到第一步 + 记住当前视图
  React.useEffect(() => {
    if (!open) return
    setStepIndex(0)
    restoreViewRef.current = store.get(activeViewAtom)
  }, [open, store])

  // 关闭即视为看过：恢复原视图 + 写入引导版本
  const close = React.useCallback(() => {
    setOpen(false)
    setStepIndex(0)
    setTourCurrentStepKey(null)
    if (stepRef.current?.restoreViewOnExit !== false && restoreViewRef.current) {
      store.set(activeViewAtom, restoreViewRef.current)
    }
    restoreViewRef.current = null
    window.electronAPI.updateSettings({ coachTourVersion: CURRENT_COACH_TOUR_VERSION }).catch((error) => {
      console.error('[CoachTour] 持久化引导版本失败:', error)
    })
  }, [setOpen, setTourCurrentStepKey, store])

  const finish = React.useCallback(() => {
    close()
    toast.success('引导完成，随时可从顶栏指南针按钮重播')
  }, [close])

  // 跨窗口单例
  React.useEffect(() => {
    if (!open) return
    const claim = claimCoachTourOwnership(() => close())
    if (!claim) {
      toast.info('另一个窗口正在播放界面引导')
      close()
      return
    }
    return () => claim.release()
  }, [open, close])

  const next = React.useCallback(() => {
    if (isLast) {
      finish()
      return
    }
    setStepIndex((current) => current + 1)
  }, [finish, isLast])

  const previousDebounceRef = React.useRef(0)
  const previous = React.useCallback(() => {
    const now = Date.now()
    if (now - previousDebounceRef.current < 150) return
    previousDebounceRef.current = now
    setStepIndex((current) => Math.max(0, current - 1))
  }, [])

  // 等待型步骤：业务状态完成后自动前进（第二步和速课堂第1问除外）
  React.useEffect(() => {
    if (!open || step?.advanceOn !== 'wait' || wait.status !== 'done') return
    if (step.key === 'calculus' || step.key === 'ai-class-q1') return
    const timer = window.setTimeout(next, 600)
    return () => window.clearTimeout(timer)
  }, [open, step, wait.status, next])

  // 轮播型步骤
  React.useEffect(() => {
    if (!open || !step?.autoAdvanceMs || step.advanceOn === 'wait') return
    if (runner.phase !== 'ready') return
    const timer = window.setTimeout(next, step.autoAdvanceMs)
    return () => window.clearTimeout(timer)
  }, [open, step, runner.phase, next])

  React.useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current)
        advanceTimerRef.current = null
      }
    }
  }, [stepIndex, open])

  // 交互步骤：侦测点击锚点
  React.useEffect(() => {
    if (!open || !interactive || !rect) return
    const pad = 14
    const zone = {
      left: rect.left - pad,
      top: rect.top - pad,
      right: rect.left + rect.width + pad,
      bottom: rect.top + rect.height + pad,
    }
    const handleClick = (event: MouseEvent): void => {
      const inZone =
        event.clientX >= zone.left &&
        event.clientX <= zone.right &&
        event.clientY >= zone.top &&
        event.clientY <= zone.bottom
      if (!inZone || advanceTimerRef.current !== null) return
      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = null
        next()
      }, step?.settleMs ?? 350)
    }
    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [open, interactive, rect, next, step])

  // 桌宠步骤保活
  React.useEffect(() => {
    if (!open || step?.key !== 'yanhu') return
    return () => {
      void window.electronAPI.yanhuExpress.petTourRelease().catch(() => undefined)
    }
  }, [open, step?.key])

  // 视图切换
  React.useEffect(() => {
    if (!open || !step?.view) return
    if (store.get(activeViewAtom) !== step.view) {
      store.set(activeViewAtom, step.view)
    }
  }, [open, step, store])

  React.useEffect(() => {
    if (!open || !step || step.cdutSubView === undefined) return
    if (store.get(cdutSubViewAtom) !== step.cdutSubView) {
      store.set(cdutSubViewAtom, step.cdutSubView)
    }
  }, [open, step, store])

  // 持续 rAF 跟踪锚点位置
  React.useEffect(() => {
    if (!open || !step) return
    let raf = 0
    let lastKey = ''
    const tick = (): void => {
      const found = findStepRect(step, activeSelectors)
      const pulses =
        step.key === 'calculus' && calculusSent
          ? []
          : (step.pulseSelectors?.flatMap(collectVisibleRects) ?? [])
      const key = [
        found
          ? `${found.left.toFixed(1)}|${found.top.toFixed(1)}|${found.width.toFixed(1)}|${found.height.toFixed(1)}`
          : 'none',
        ...pulses.map(
          (item) =>
            `${item.left.toFixed(1)}|${item.top.toFixed(1)}|${item.width.toFixed(1)}|${item.height.toFixed(1)}`,
        ),
      ].join(';')
      if (key !== lastKey) {
        lastKey = key
        setRect(found)
        setPulseRects(pulses)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open, step, activeSelectors, calculusSent])

  React.useLayoutEffect(() => {
    if (!open) return
    const card = cardRef.current
    if (!card) return
    const { offsetWidth, offsetHeight } = card
    if (offsetWidth > 0 && offsetHeight > 0 && (offsetWidth !== cardSize.width || offsetHeight !== cardSize.height)) {
      setCardSize({ width: offsetWidth, height: offsetHeight })
    }
  }, [open, stepIndex, rect, cardSize])

  React.useEffect(() => {
    if (!open) return
    cardRef.current?.focus()
  }, [open, stepIndex])

  // 键盘快捷键响应
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      } else if (event.key === 'ArrowRight') {
        // 第一步、第二步、第四步未完成、第 6 步问答未结束时禁止右箭头跳步
        if (
          step?.key === 'welcome-agent' ||
          (step?.key === 'calculus' && !calculusDone) ||
          (step?.key === 'cdut-login' && clickedQuickFeatures.size < 4) ||
          (step?.key === 'ai-class-q1' && wait.status !== 'done')
        ) {
          return
        }
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previous()
      } else if (event.key === 'Tab') {
        trapTabKey(event, cardRef.current)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, close, next, previous, step?.key, calculusDone, clickedQuickFeatures.size, wait.status])

  if (!open || !step) return null

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cardPosition = computeCardPosition(rect, cardSize, step.placement, viewport)
  const transition = reduceMotion ? 'none' : MOVE_TRANSITION
  const frame = rect ? clampFrameToViewport(rect) : null

  // 按钮锁定逻辑
  const isCalculusLocked = step.key === 'calculus' && !calculusDone
  const isQuickBarLocked = step.key === 'cdut-login' && clickedQuickFeatures.size < 4
  const isAiClassQ1Locked = step.key === 'ai-class-q1' && wait.status !== 'done'
  const isNextButtonLocked = isCalculusLocked || isQuickBarLocked || isAiClassQ1Locked

  // 15~17 步高亮区域禁止所有交互
  const isStep15To17Disabled = ['table-1', 'table-2', 'geo-dem'].includes(step.key)

  return createPortal(
    <div className={`pointer-events-none fixed inset-0 ${Z_LAYER.overlay}`}>
      {/* 
        【核心安全原则】：灰色阴影蒙版区域禁用一切交互。
        - 当有聚光灯矩形时：通过四周挡板（CaptureAround）拦截底层 DOM 点击与拖拽；
        - 当无矩形时（全屏深色）：全屏遮罩拦截所有事件。
        - 第四步特殊处理：点击蒙版区域关闭右侧组件。
      */}
      {rect ? (
        <CaptureAround rect={rect} onMaskClick={handleCloseSheet} />
      ) : (
        <div
          className="pointer-events-auto absolute inset-0 bg-black/55"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleCloseSheet()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          aria-hidden="true"
        />
      )}

      {/* 呼吸光圈提示（如发送按钮） */}
      {pulseRects.map((pulse, index) => {
        const pulseFrame = clampFrameToViewport(pulse)
        return (
          <div
            key={`pulse-${index}`}
            aria-hidden="true"
            className="coach-tour-pulse-ring pointer-events-none absolute rounded-lg"
            style={{
              left: pulseFrame.left,
              top: pulseFrame.top,
              width: pulseFrame.width,
              height: pulseFrame.height,
            }}
          />
        )
      })}

      {/* 聚光灯镂空框（内部保持 pointer-events-none，允许真实操作） */}
      {frame && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-xl"
          style={{
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height,
            boxShadow:
              '0 0 0 2px rgba(255,255,255,0.85), 0 0 24px rgba(255,255,255,0.22), 0 0 0 9999px rgba(0,0,0,0.55)',
            transition,
          }}
        />
      )}

      {/* 15~17 步高亮区域禁止一切交互的透明遮罩 */}
      {isStep15To17Disabled && frame && (
        <div
          aria-hidden="true"
          className="pointer-events-auto absolute rounded-xl z-10 cursor-not-allowed bg-transparent"
          style={{
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height,
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}

      {/* 第 5 步（ai-class-enter）：输入框不遮挡但禁用一切互动 */}
      {step.key === 'ai-class-enter' && (
        <DynamicElementShield selector='[data-tour="ai-class-chat"] [data-input-mode="agent"]' />
      )}

      {/* 交互步骤的脉冲高亮环 */}
      {frame && interactive && (
        <div
          aria-hidden="true"
          className="coach-tour-pulse-ring pointer-events-none absolute rounded-xl"
          style={{
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height,
            transition,
          }}
        />
      )}

      {/* 引导气泡卡片 */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`界面引导，第 ${stepIndex + 1} 步，共 ${totalSteps} 步`}
        tabIndex={-1}
        style={{ left: cardPosition.left, top: cardPosition.top, transition }}
        className={cn(
          'pointer-events-auto absolute z-[100] w-[350px] max-w-[calc(100vw-24px)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl outline-none',
          !reduceMotion && 'animate-in fade-in-0 zoom-in-95 duration-200',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {/* 第 28 步：引导窗上方显现 CDUT Studio Logo */}
        {step.key === 'outro' && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-background/95 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-500 whitespace-nowrap">
            <CdutLogo className="h-5 w-auto" />
            <span className="font-semibold text-xs tracking-wider bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CDUT Studio
            </span>
          </div>
        )}

        <div
          key={step.key}
          className={cn(!reduceMotion && 'animate-in fade-in-0 slide-in-from-bottom-1 duration-200')}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
                {String(stepIndex + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-semibold">{step.title}</h3>
            </div>
            <button
              type="button"
              aria-label="退出引导"
              onClick={close}
              className="rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>

          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>

          {/* 第二步特定指引态 */}
          {step.key === 'calculus' && (
            <div className="mt-2.5 rounded-lg border border-border/70 bg-muted/40 p-2.5 text-xs">
              {!calculusSent ? (
                <div className="flex items-center gap-2 text-amber-500 font-medium">
                  <span className="inline-block size-2 animate-ping rounded-full bg-amber-500" />
                  请点击右下角发送按钮
                </div>
              ) : !calculusDone ? (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
                  模型正在生成回答中，请稍候（输入框已锁定）…
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-500 font-medium">
                  <CheckCircle2 size={14} />
                  回答已生成完成，点击「下一步」继续
                </div>
              )}
            </div>
          )}

          {/* 第四步通道体验进度卡片 */}
          {step.key === 'cdut-login' && (
            <div className="mt-2.5 rounded-lg border border-border/70 bg-muted/40 p-2.5 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span>校内专用通道体验</span>
                <span
                  className={cn(
                    'font-mono font-bold',
                    clickedQuickFeatures.size >= 4 ? 'text-emerald-500' : 'text-amber-500',
                  )}
                >
                  {clickedQuickFeatures.size} / 4
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { id: 'today-schedule', name: '今日课表' },
                  { id: 'grade-gpa', name: '成绩与GPA' },
                  { id: 'empty-classroom', name: '自习空教室' },
                  { id: 'final-exam', name: '期末考场' },
                ].map((item) => {
                  const clicked = clickedQuickFeatures.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center justify-between rounded px-2 py-1 text-[11px] transition-colors',
                        clicked ? 'bg-primary/15 text-primary font-medium' : 'bg-background/80 text-muted-foreground',
                      )}
                    >
                      <span>{item.name}</span>
                      {clicked ? <CheckCircle2 size={12} /> : <span className="text-[10px] opacity-60">未点击</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 第 28 步：开发团队 5 位成员头像与寄语浮现动画 */}
          {step.key === 'outro' && (
            <div className="mt-3 flex flex-col items-center gap-2.5 pt-2.5 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center justify-center gap-2.5">
                {TEAM_AVATARS.map((avatar, idx) => (
                  <div
                    key={idx}
                    style={{ animationDelay: `${idx * 100 + 150}ms` }}
                    className="group relative size-9 rounded-full border-2 border-primary/40 p-0.5 shadow-sm transition-all duration-300 hover:scale-115 hover:border-primary animate-in zoom-in-50 fade-in fill-mode-both"
                    title={avatar.name}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-primary tracking-wide text-center animate-in fade-in slide-in-from-bottom-1 duration-700 delay-500 fill-mode-both">
                全体开发成员祝您在 CDUT Studio 有一段美好的时光！
              </p>
            </div>
          )}

          {interactive && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-primary">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
              点击高亮区域继续
            </p>
          )}

          {!interactive && runner.phase === 'preparing' && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-muted-foreground/60" aria-hidden="true" />
              {runner.message}
            </p>
          )}
          {runner.phase === 'error' && (
            <p className="mt-2 text-[11px] leading-relaxed text-[#B4472F]">{runner.message}</p>
          )}
          {step.key !== 'calculus' && step.advanceOn === 'wait' && wait.status === 'waiting' && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-muted-foreground/60" aria-hidden="true" />
              {wait.message}
            </p>
          )}
          {wait.status === 'timeout' && (
            <p className="mt-2 text-[11px] leading-relaxed text-[#B4472F]">{wait.message}</p>
          )}

          {/* 气泡专属快捷操作 */}
          {step.action === 'demo-digitize' && (
            <Button
              type="button"
              size="sm"
              className="mt-3 h-8 w-full gap-1.5 text-xs font-semibold"
              disabled={!rect}
              onClick={() => window.dispatchEvent(new CustomEvent('cslab:demo-digitize'))}
            >
              <Crosshair size={13} />
              一键演示标定
            </Button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          {totalSteps <= 7 ? (
            <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              {COACH_TOUR_STEPS.map((s, index) => (
                <span
                  key={s.key}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    index === stepIndex ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/25',
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2" aria-hidden="true">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted-foreground/20">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${Math.round(((stepIndex + 1) / totalSteps) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {stepIndex > 0 && (
              <Button type="button" variant="ghost" size="sm" className="h-7 px-2.5 text-xs" onClick={previous}>
                上一步
              </Button>
            )}
            {/* 智联万站 · 砚小龙允许用户在中途跳过，进入下一个模块演示 */}
            {step.key === 'yanhu' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={next}
              >
                跳过本步
              </Button>
            )}
            {/* 第一步：不提供下一步与跳过按钮，只能点击新建会话 */}
            {step.key === 'welcome-agent' ? (
              <span className="text-[11px] text-muted-foreground/80 pr-1 font-medium">请点击新建会话继续</span>
            ) : isClickToAdvance && interactive && !step.disallowSkip ? (
              <Button type="button" variant="ghost" size="sm" className="h-7 px-2.5 text-xs" onClick={next}>
                跳过本步
              </Button>
            ) : isClickToAdvance && interactive && step.disallowSkip ? (
              <span className="text-[11px] text-muted-foreground/80 pr-1 font-medium">
                {step.key === 'new-session' ? '请点击新建会话' : '请点击侧栏进入'}
              </span>
            ) : (
              <Button
                type="button"
                size="sm"
                className="h-7 px-2.5 text-xs"
                disabled={isNextButtonLocked}
                onClick={next}
              >
                {isLast ? '完成' : isNextButtonLocked ? '等待完成' : '下一步'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * 聚光灯四周挡板：
 * 锚点四周四块区域拦截误点与穿透交互，且绝不触发跳步。
 * 镂空区不放任何遮罩，真实 UI（按钮、手势、3D 渲染画布）原样生效。
 */
function CaptureAround({
  rect,
  onMaskClick,
}: {
  rect: AnchorRect
  onMaskClick?: () => void
}): React.ReactElement {
  const pad = 8
  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = Math.max(0, rect.left - pad)
  const top = Math.max(0, rect.top - pad)
  const right = Math.min(vw, rect.left + rect.width + pad)
  const bottom = Math.min(vh, rect.top + rect.height + pad)
  const panels: Array<{ key: string; left: number; top: number; width: number; height: number }> = [
    { key: 'top', left: 0, top: 0, width: vw, height: top },
    { key: 'bottom', left: 0, top: bottom, width: vw, height: Math.max(0, vh - bottom) },
    { key: 'left', left: 0, top, width: left, height: Math.max(0, bottom - top) },
    { key: 'right', left: right, top, width: Math.max(0, vw - right), height: Math.max(0, bottom - top) },
  ]
  return (
    <>
      {panels
        .filter((panel) => panel.width > 0 && panel.height > 0)
        .map((panel) => (
          <div
            key={panel.key}
            aria-hidden="true"
            className="pointer-events-auto absolute"
            style={{ left: panel.left, top: panel.top, width: panel.width, height: panel.height }}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onMaskClick?.()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          />
        ))}
    </>
  )
}
