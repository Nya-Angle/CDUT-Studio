/**
 * Onboarding 视图组件
 *
 * 首次启动时显示的全屏欢迎界面。
 *
 * 流程（Windows 10 首次启动式收尾）：
 *  Step 0：开屏水波纹动画（CDUT Studio 从水面具现，自动进入下一步）
 *  Step 1：欢迎
 *  Step 2：核心功能导览（6 张特性卡片）
 *  Step 3：迁移数据指引（从其他设备 / 其他用户导入配置）
 *  Step 4：审核准备（复用全局渠道，显式选择模型、按需真实自检）
 *  Step 5：诗意插页（海内存知己，天涯若比邻）——独立整屏，如同 Windows 10 首启
 *  Step 6：品牌收尾（CDUT Studio / 欢迎您！），点击进入主界面
 *
 * 说明：Windows 执行环境已改为静默自适应（Git Bash > 内置 BusyBox > WSL > 原生 PowerShell），
 * 首启不再需要环境检测页；环境自检仍可从「设置 → 关于」随时发起。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { cn } from '@/lib/utils'
import { ChevronRight, HardDriveDownload, Users } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { migrationImportDialogOpenAtom } from '@/atoms/migration-atoms'
import { settingsOpenAtom, settingsTabAtom } from '@/atoms/settings-tab'
import { IntroWaterRipple } from './IntroWaterRipple'
import { IntroFluidBackground } from './IntroFluidBackground'
import { FeatureTour } from './FeatureTour'

type OnboardingStep = 'intro' | 'welcome' | 'featureTour' | 'migration' | 'poetry' | 'ready'

interface OnboardingViewProps {
  onComplete: (openTutorial?: boolean) => void
  /** 供主界面测试入口复用首次引导页；默认仍从开屏开始。 */
  initialStep?: OnboardingStep
  /** 测试重放完成时不写入用户的首次 onboarding 状态。 */
  persistCompletion?: boolean
}

/** 诗意插页自动停留时长（毫秒）；点击/按键可提前继续。 */
const POETRY_INTERLUDE_MS = 4200

export function OnboardingView({
  onComplete,
  initialStep = 'intro',
  persistCompletion = true,
}: OnboardingViewProps) {
  const [step, setStep] = useState<OnboardingStep>(initialStep)
  const setMigrationImportDialogOpen = useSetAtom(migrationImportDialogOpenAtom)
  const setSettingsOpen = useSetAtom(settingsOpenAtom)
  const setSettingsTab = useSetAtom(settingsTabAtom)

  const handleFinish = async (openTutorial?: boolean) => {
    if (persistCompletion) {
      const settings = await window.electronAPI.getSettings()
      if (!settings.onboardingCompleted) {
        try {
          const events = await window.electronAPI.listCalendarEvents()
          const demoTitle = '随便安排的一件事'
          if (!events.some((event) => event.title === demoTitle)) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            await window.electronAPI.createCalendarEvent({
              title: demoTitle,
              notes: '首次引导中的示例日程，没有实际安排。',
              startAt: today.getTime(),
              allDay: true,
            })
          }
        } catch (error) {
          console.error('[Onboarding] 创建示例日程失败:', error)
        }
      }
      await window.electronAPI.updateSettings({ onboardingCompleted: true })
    }
    onComplete(openTutorial)
  }

  const handleOpenMigration = () => {
    setMigrationImportDialogOpen(true)
  }

  return (
    <div className={cn(
      'flex h-screen w-screen overflow-hidden flex-col items-center justify-center',
      step === 'intro'
        ? 'bg-black'
        : 'bg-gradient-to-br from-background via-background to-muted/20 p-8',
    )}>
      {step === 'intro' && (
        <IntroWaterRipple
          onDone={() => {
            // 开屏结束后先进入欢迎页；用户再按需浏览功能导览或导入配置。
            setStep('welcome')
          }}
        />
      )}

      {step === 'welcome' && (
        <>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">欢迎使用 CDUT Studio</h1>
            <p className="text-lg text-muted-foreground">
              Pi 单内核驱动的下一代桌面 AI，让通用 Agent 触手可及
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              校园特区 · 材料审核 · 内置浏览器，开箱即用
            </p>
          </div>

          <div className="w-full max-w-2xl mt-8 flex flex-col items-center gap-2">
            <Button className="w-full h-12 text-base" onClick={() => setStep('featureTour')}>
              <>
                了解 CDUT Studio 能做什么
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            </Button>
            <p className="text-xs text-muted-foreground/60">
              这些内容之后也能在设置中找到，不用担心错过
            </p>
          </div>
        </>
      )}

      {step === 'featureTour' && (
        <FeatureTour
          finishLabel="下一步：导入数据"
          onNext={() => setStep('migration')}
          onSkip={() => setStep('migration')}
        />
      )}

      {step === 'migration' && (
        <>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">导入已有数据</h2>
            <p className="text-lg text-muted-foreground">
              自己或身边的人已经在用 CDUT Studio？可直接导入现有配置，无需从零开始
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOpenMigration}
                className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/15 p-4 flex items-center gap-3 hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HardDriveDownload size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">从其他设备迁移</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    导入自己其他设备上的完整配置（含模型渠道与偏好）。
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                    在原设备导出 .profer-backup 文件，再双击导入即可。
                  </p>
                </div>
              </button>
              <button
                onClick={handleOpenMigration}
                className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/15 p-4 flex items-center gap-3 hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">导入其他用户的配置</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    从同事或团队成员处导入环境，凭据会被自动剥离。
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                    先导出 .profer-share 文件，再双击导入即可。
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="w-full max-w-2xl mt-8 flex flex-col items-center gap-2">
            <Button className="w-full h-12 text-base" onClick={() => setStep('poetry')}>
              <>
                继续
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            </Button>
            <p className="text-xs text-muted-foreground/60">
              也可以之后随时在设置 → 数据管理中导入配置
            </p>
          </div>
        </>
      )}

      {step === 'poetry' && <PoetryInterlude onDone={() => setStep('ready')} />}

      {step === 'ready' && <WelcomeFinale onEnter={() => handleFinish()} />}
    </div>
  )
}

/**
 * PoetryInterlude — 诗意插页：整屏只呈现「海内存知己，天涯若比邻」。
 *
 * 沿用开屏与功能导览的液态玻璃背景，构成一次电影感的停顿；
 * 停留数秒后自动继续（与 Windows 10 首次启动一致），点击/按键可立即跳过。
 */
function PoetryInterlude({ onDone }: { onDone: () => void }): React.ReactElement {
  const doneRef = useRef(false)
  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }, [onDone])

  useEffect(() => {
    const timer = window.setTimeout(finish, POETRY_INTERLUDE_MS)
    return () => window.clearTimeout(timer)
  }, [finish])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight' || event.key === 'Escape') {
        event.preventDefault()
        finish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [finish])

  const gradientText = {
    backgroundImage: 'linear-gradient(180deg, #fff 0%, #f1f2f5 42%, #c5c8ce 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as const

  return (
    <section
      className="relative -m-8 flex h-screen w-screen cursor-pointer select-none items-center justify-center overflow-hidden bg-black"
      onClick={finish}
      role="presentation"
      aria-label="海内存知己，天涯若比邻"
    >
      {/* 复用液态玻璃背景：与开屏、功能导览一脉相承的电影感停顿 */}
      <IntroFluidBackground durationMs={6000} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_52%,transparent_44%,rgba(0,0,0,.34)_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {['海内存知己', '天涯若比邻'].map((line) => (
          <p
            key={line}
            className="font-sans text-[clamp(30px,5.4vw,62px)] font-semibold leading-tight tracking-[0.12em] drop-shadow-[0_14px_38px_rgba(0,0,0,.62)]"
            style={gradientText}
          >
            {line}
          </p>
        ))}
        <p className="mt-4 font-mono text-[11px] tracking-[0.34em] text-white/40">
          —— 王勃《送杜少府之任蜀州》
        </p>
      </div>

      <span className="absolute bottom-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-white/30" aria-hidden="true">
        Click to continue
      </span>
    </section>
  )
}

/** WelcomeFinale — 品牌收尾：CDUT Studio / 欢迎您！，点击进入主界面。 */
function WelcomeFinale({ onEnter }: { onEnter: () => void }): React.ReactElement {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">CDUT Studio</h1>
        <p className="mt-5 text-2xl font-semibold text-foreground/90 sm:text-3xl">欢迎您！</p>
        <p className="mt-4 text-sm text-muted-foreground">
          一切已就绪，开始你的第一个任务吧
        </p>
      </div>

      <div className="w-full max-w-2xl flex justify-center">
        <Button className="w-full h-12 text-base" onClick={onEnter}>
          <>
            进入 CDUT Studio
            <ChevronRight className="ml-1 h-4 w-4" />
          </>
        </Button>
      </div>
    </>
  )
}
