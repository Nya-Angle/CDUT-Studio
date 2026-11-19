import * as React from 'react'
import { useAtom, useStore } from 'jotai'
import { AppShell } from './components/app-shell/AppShell'
import { PlanningReminderRail } from './components/planning/PlanningReminderRail'
import { TutorialBanner } from './components/tutorial/TutorialBanner'
import { TooltipProvider } from '@profer/ui/primitives/tooltip'
import { Z_LAYER } from '@profer/ui'
import { useCreateSession } from './hooks/useCreateSession'
import { environmentCheckDialogOpenAtom } from './atoms/environment'
import { openTutorialTab } from './lib/tab-activation'
import { replayIntroOpenAtom, replayWelcomeTourAtom } from './atoms/intro-atoms'
import { IntroWaterRipple } from './components/onboarding/IntroWaterRipple'
import { CoachTourOverlay } from './components/onboarding/coach-tour/CoachTourOverlay'
import { coachTourOpenAtom } from './atoms/coach-tour-atoms'
import { CURRENT_COACH_TOUR_VERSION } from './components/onboarding/coach-tour/coach-tour-steps'
import { useBulletinStartupTrigger } from './hooks/useBulletinStartupTrigger'
import { getSettingsCoalesced } from './lib/startup-ipc-cache'
import type { AppShellContextType } from './contexts/AppShellContext'

/** 懒加载非首屏组件——减少首次渲染的 JS 解析量 */
const OnboardingView = React.lazy(() => import('./components/onboarding/OnboardingView').then(m => ({ default: m.OnboardingView })))
const EnvironmentCheckDialog = React.lazy(() => import('./components/environment/EnvironmentCheckDialog').then(m => ({ default: m.EnvironmentCheckDialog })))
const MigrationImportDialog = React.lazy(() => import('./components/migration/MigrationImportDialog').then(m => ({ default: m.MigrationImportDialog })))
const SettingsDialog = React.lazy(() => import('./components/settings/SettingsDialog').then(m => ({ default: m.SettingsDialog })))
const BulletinDialog = React.lazy(() => import('./components/bulletin/BulletinDialog').then(m => ({ default: m.BulletinDialog })))

const EMPTY_APP_SHELL_CONTEXT: AppShellContextType = {}

export default function App(): React.ReactElement {
  const store = useStore()
  const [isLoading, setIsLoading] = React.useState(true)
  const [showOnboarding, setShowOnboarding] = React.useState(false)
  const [showWelcomeTourReplay, setShowWelcomeTourReplay] = useAtom(replayWelcomeTourAtom)

  // 初始化：检查是否需要显示 Onboarding
  // 平台差异已收敛为静默自适应执行环境（Windows: Git Bash > 内置 BusyBox > WSL > PowerShell），
  // 首启不再需要环境检测页；环境自检仍可从「设置 → 关于」随时发起。
  React.useEffect(() => {
    const initialize = async () => {
      try {
        const settings = await getSettingsCoalesced()
        if (!settings.onboardingCompleted) {
          setShowOnboarding(true)
        } else if ((settings.coachTourVersion ?? 0) < CURRENT_COACH_TOUR_VERSION) {
          // 界面引导版本化接力：Onboarding 已完成的用户（含升级后版本偏低的老用户）
          // 等主界面首帧稳定后自动播放一次；退出时写入版本，不会重复出现。
          window.setTimeout(() => store.set(coachTourOpenAtom, true), 800)
        }
      } catch (error) {
        console.error('[App] 初始化失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  // 等 React 真正提交掉“正在初始化...”后，再允许主进程撤掉原生启动页并淡出主窗口进入动画。
  React.useEffect(() => {
    if (!isLoading) {
      window.electronAPI.notifyRendererReady()
      ;(window as Window & { __dismissCdutEntryOverlay?: () => void }).__dismissCdutEntryOverlay?.()
    }
  }, [isLoading])

  // 打开教程 Tab：统一入口负责切回对话视图并同步副作用
  const handleOpenTutorial = React.useCallback((): void => {
    openTutorialTab(store)
  }, [store])

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">正在初始化...</p>
        </div>
      </div>
    )
  }

  // 主界面「首次欢迎导览」重放：完整走一遍首启流程（欢迎 → 功能导览 → 导入数据 → 诗意插页 → 欢迎您）；
  // persistCompletion=false，不写 onboardingCompleted，可反复重放。
  if (showWelcomeTourReplay) {
    return (
      <TooltipProvider delayDuration={200}>
        <React.Suspense fallback={null}>
          <OnboardingView
            initialStep="welcome"
            persistCompletion={false}
            onComplete={() => setShowWelcomeTourReplay(false)}
          />
        </React.Suspense>
      </TooltipProvider>
    )
  }

  // 显示首次 onboarding 界面
  if (showOnboarding) {
    return (
      <TooltipProvider delayDuration={200}>
        <React.Suspense fallback={null}>
          <OnboardingRoute
            onExit={() => setShowOnboarding(false)}
            onOpenTutorial={handleOpenTutorial}
          />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <MigrationImportDialog />
        </React.Suspense>
      </TooltipProvider>
    )
  }

  // 显示主界面
  return (
    <TooltipProvider delayDuration={200}>
      <PlanningReminderRail />
      <AppShell contextValue={EMPTY_APP_SHELL_CONTEXT} />
      <React.Suspense fallback={null}>
        <SettingsDialog />
      </React.Suspense>
      <TutorialBanner />
      <GlobalEnvironmentCheckDialog />
      <React.Suspense fallback={null}>
        <MigrationImportDialog />
      </React.Suspense>
      <IntroReplayOverlay />
      <CoachTourOverlay />
      <BulletinStartupTrigger />
      <React.Suspense fallback={null}>
        <BulletinDialog />
      </React.Suspense>
    </TooltipProvider>
  )
}

/**
 * OnboardingRoute —— 仅在校首次引导期挂载的引导入口。
 *
 * `useCreateSession`（内部经 `useOpenSession` 订阅 tabs / agentSessions / 模型等多个 atom）
 * 被收敛到本子树：引导结束后本组件即卸载，App 根组件不再订阅这些无关 atom，
 * 从根本上消除「App re-render #41」式的根组件高频重渲染。
 */
function OnboardingRoute({
  onExit,
  onOpenTutorial,
}: {
  onExit: () => void
  onOpenTutorial: () => void
}): React.ReactElement {
  const store = useStore()
  const { createAgent } = useCreateSession()

  const handleComplete = React.useCallback(
    async (openTutorial?: boolean): Promise<void> => {
      onExit()
      if (openTutorial) {
        onOpenTutorial()
        return
      }
      try {
        await createAgent()
        // Onboarding 接力：进入主界面后自动播放一次界面蒙层引导；
        // 等首帧渲染稳定再启动，保证锚点（输入区/模型选择器）已挂载。
        window.setTimeout(() => store.set(coachTourOpenAtom, true), 600)
      } catch (error) {
        console.error('[App] 创建 Agent 会话失败:', error)
      }
    },
    [createAgent, store, onExit, onOpenTutorial],
  )

  return <OnboardingView onComplete={handleComplete} />
}

/**
 * 全屏开屏动画重播遮罩：
 * 设置「首次欢迎导览 → 重新播放」→ replayIntroOpenAtom=true → 渲染 IntroWaterRipple，
 * 水波纹结束后接力整段首次欢迎导览（见 showWelcomeTourReplay 分支）。
 * 不改动 onboardingCompleted，纯重播用途。
 */
function IntroReplayOverlay(): React.ReactElement | null {
  const [open, setOpen] = useAtom(replayIntroOpenAtom)
  const [, setShowWelcomeTourReplay] = useAtom(replayWelcomeTourAtom)
  if (!open) return null
  return (
    <div
      className={`fixed inset-0 ${Z_LAYER.overlay}`}
      role="dialog"
      aria-modal="true"
      aria-label="CDUT Studio 开屏动画"
      data-profer-intro-overlay
    >
      <IntroWaterRipple
        onDone={() => {
          setOpen(false)
          // 接力首次欢迎导览，不触碰 onboardingCompleted。
          setShowWelcomeTourReplay(true)
        }}
      />
    </div>
  )
}

/**
 * 全局环境检测 Dialog，由错误卡片的 recovery action 按钮打开。
 */
function GlobalEnvironmentCheckDialog(): React.ReactElement {
  const [open, setOpen] = useAtom(environmentCheckDialogOpenAtom)
  return <EnvironmentCheckDialog open={open} onOpenChange={setOpen} />
}

/**
 * 公告栏启动触发器：无渲染组件，仅消费启动 Hook（含 CoachTour 排定竞态保护）。
 */
function BulletinStartupTrigger(): null {
  useBulletinStartupTrigger()
  return null
}
