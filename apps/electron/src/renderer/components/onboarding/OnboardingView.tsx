/**
 * Onboarding 视图组件
 *
 * 首次启动时显示的全屏欢迎界面与功能导览。
 *
 * 流程：
 *  Step 0：开屏水波纹动画（IntroWaterRipple，从水面具现品牌，自动或点击进入下一步）
 *  Step 1：欢迎概览页（展示核心四大支柱，提供完整导览与快速跳过双入口）
 *  Step 2：核心功能导览（FeatureTour，8 组高拟真交互式演示舞台，支持暂停/切换/全键盘导航）
 *  Step 3：迁移数据指引（从其他设备 / 团队导入配置）
 *  Step 4：模型配置（预置厂商快捷配置，可测试连通性并设为默认，也可跳过）
 *  Step 5：诗意插页（海内存知己，天涯若比邻——独立整屏电影感沉浸）
 *  Step 6：品牌收尾（CDUT Studio / 欢迎您！，进入主界面并自动平滑接力）
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Atom,
  Bot,
  ChevronRight,
  FileCheck,
  GraduationCap,
  HardDriveDownload,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import { migrationImportDialogOpenAtom } from '@/atoms/migration-atoms'
import { IntroWaterRipple } from './IntroWaterRipple'
import { IntroFluidBackground } from './IntroFluidBackground'
import { FeatureTour } from './FeatureTour'
import { OnboardingModelSetup } from './OnboardingModelSetup'

type OnboardingStep = 'intro' | 'welcome' | 'featureTour' | 'migration' | 'modelSetup' | 'poetry' | 'ready'

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

  // 迁移页继续：已有可用渠道时直接进入诗意插页，否则补上模型配置环节
  const handleMigrationContinue = async () => {
    try {
      const channels = await window.electronAPI.listChannels()
      const hasUsableChannel = channels.some(
        (channel) => channel.enabled && channel.models.some((model) => model.enabled),
      )
      setStep(hasUsableChannel ? 'poetry' : 'modelSetup')
    } catch {
      // 读取失败时仍进入配置页，避免用户被卡住
      setStep('modelSetup')
    }
  }

  const isFullScreenDark = step === 'intro' || step === 'featureTour' || step === 'poetry'

  return (
    <div
      className={cn(
        'relative flex h-screen w-screen overflow-hidden flex-col items-center justify-center select-none transition-colors duration-500',
        isFullScreenDark
          ? 'bg-black p-0'
          : 'bg-gradient-to-br from-background via-background to-muted/30 p-6 sm:p-10',
      )}
    >
      {step === 'intro' && (
        <IntroWaterRipple
          onDone={() => {
            setStep('welcome')
          }}
        />
      )}

      {step === 'welcome' && (
        <div className="flex w-full max-w-4xl flex-col items-center animate-in fade-in-0 duration-500">
          {/* 标头区域 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <Sparkles className="size-3.5" />
              <span>CDUT Studio 智能终端</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              欢迎使用 CDUT Studio
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Pi 单内核驱动的下一代桌面通用 AI，让推理、学术与校园事务触手可及
            </p>
          </div>

          {/* 四大核心支柱卡片 */}
          <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Pi 全能 Agent</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">单内核推理 · 终端执行 · 独立沙箱会话</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">CDUT 校园特区</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">成理统一身份直联 · 课表/成绩/空教室</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">材料审核专区</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">三栏同色联动 · 跨文档资金与规则合规核验</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-card/90">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <Atom className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">CDUT Science 工作台</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">数据铁笼 · 3D分子晶胞 · 曲线逆向数字化</p>
                </div>
              </div>
            </div>
          </div>

          {/* 决策操作区 */}
          <div className="mt-9 flex w-full max-w-md flex-col items-center gap-3">
            <Button
              className="w-full h-12 text-sm sm:text-base font-semibold shadow-md gap-2"
              onClick={() => setStep('featureTour')}
            >
              <span>开始功能导览（全景体验核心特性）</span>
              <ChevronRight className="size-4" />
            </Button>

            <Button
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setStep('migration')}
            >
              <span>跳过导览（直接导入配置或进入）</span>
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {step === 'featureTour' && (
        <FeatureTour
          finishLabel="下一步：导入数据"
          onNext={() => setStep('migration')}
          onSkip={() => setStep('migration')}
        />
      )}

      {step === 'migration' && (
        <div className="flex w-full max-w-3xl flex-col items-center animate-in fade-in-0 duration-500">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              导入已有数据与配置
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              自己或课题组成员已经在用 CDUT Studio？可直接导入配置，无需从零开始
            </p>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleOpenMigration}
              className="group rounded-2xl border border-border/80 bg-card/60 p-5 flex flex-col items-start text-left backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-lg"
            >
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <HardDriveDownload size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground mt-4">从其他设备迁移</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                导入原设备导出的完整配置镜像（含模型渠道、提示词预设与个人偏好）。
              </p>
              <span className="mt-3 text-[11px] font-mono text-primary/80">
                支持 .profer-backup 归档文件
              </span>
            </button>

            <button
              onClick={handleOpenMigration}
              className="group rounded-2xl border border-border/80 bg-card/60 p-5 flex flex-col items-start text-left backdrop-blur-md transition-all hover:border-primary/50 hover:bg-card/90 hover:shadow-lg"
            >
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground mt-4">导入团队共享配置</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                从课题组或同事处导入环境配置，所有敏感 API Key 与账号密码已自动脱敏剥离。
              </p>
              <span className="mt-3 text-[11px] font-mono text-primary/80">
                支持 .profer-share 分享包
              </span>
            </button>
          </div>

          <div className="w-full max-w-sm mt-8 flex flex-col items-center gap-2">
            <Button className="w-full h-11 text-sm font-semibold gap-1.5" onClick={handleMigrationContinue}>
              <span>继续</span>
              <ChevronRight className="size-4" />
            </Button>
            <p className="text-xs text-muted-foreground/60 text-center">
              也可以随时在「设置 → 数据管理」中导入或备份配置
            </p>
          </div>
        </div>
      )}

      {step === 'modelSetup' && <OnboardingModelSetup onDone={() => setStep('poetry')} />}

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
      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowRight' ||
        event.key === 'Escape'
      ) {
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
      className="relative flex h-screen w-screen cursor-pointer select-none items-center justify-center overflow-hidden bg-black"
      onClick={finish}
      role="presentation"
      aria-label="海内存知己，天涯若比邻"
    >
      {/* 复用液态玻璃背景 */}
      <IntroFluidBackground durationMs={6000} />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_52%,transparent_44%,rgba(0,0,0,.34)_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center animate-in fade-in-0 duration-700">
        {['海内存知己', '天涯若比邻'].map((line) => (
          <p
            key={line}
            className="font-sans text-[clamp(32px,5.4vw,64px)] font-semibold leading-tight tracking-[0.14em] drop-shadow-[0_14px_38px_rgba(0,0,0,.75)]"
            style={gradientText}
          >
            {line}
          </p>
        ))}
        <p className="mt-4 font-mono text-[11px] tracking-[0.34em] text-white/40">
          —— 王勃《送杜少府之任蜀州》
        </p>
      </div>

      <span
        className="absolute bottom-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-white/30"
        aria-hidden="true"
      >
        Click or press any key to continue
      </span>
    </section>
  )
}

/** WelcomeFinale — 品牌收尾：CDUT Studio / 欢迎您！，点击进入主界面。 */
function WelcomeFinale({ onEnter }: { onEnter: () => void }): React.ReactElement {
  return (
    <div className="flex w-full max-w-lg flex-col items-center text-center animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-inner">
        <Sparkles className="size-8" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
        CDUT Studio
      </h1>
      <p className="mt-3 text-2xl sm:text-3xl font-semibold text-foreground/90">欢迎您！</p>
      <p className="mt-3 text-sm text-muted-foreground">
        一切准备就绪，开启你的第一个通用 Agent 任务
      </p>

      <div className="w-full mt-9">
        <Button className="w-full h-12 text-base font-semibold shadow-lg gap-2" onClick={onEnter}>
          <span>进入 CDUT Studio</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
