import * as React from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Atom,
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cpu,
  Database,
  ExternalLink,
  FileCheck,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers,
  Pause,
  Play,
  Puzzle,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@profer/ui/primitives/button'
import { IntroFluidBackground } from './IntroFluidBackground'

export interface FeatureSlide {
  id: string
  badge: string
  title: string
  subtitle: string
  summary: string
  example: string
  tags: string[]
}

const TOUR_INTERVAL_MS = 6500
const TOUR_TRANSITION_MS = 280

export const FEATURE_TOUR_SLIDES: FeatureSlide[] = [
  {
    id: 'pi-agent',
    badge: 'NEXT-GEN DESKTOP AI',
    title: 'Pi 全能 Agent',
    subtitle: '单内核驱动 · 自主思考与任务交付',
    summary: '以 Pi 单内核统一调度深层推理、系统终端与全能工具链。每一个复杂任务均由独立沙箱承载，上下文清晰纯净。',
    example: '分析 @2026年科研经费支出.xlsx，筛查跨期异常并生成可视化审计卡片',
    tags: ['单内核架构', '思考链可视化', '自动化工具调用', '独立沙箱会话'],
  },
  {
    id: 'cdut-zone',
    badge: 'CAMPUS INTELLIGENCE',
    title: 'CDUT 校园特区',
    subtitle: '成理统一身份认证 · 校园数字化直联',
    summary: '深度打通成理统一身份认证与数字化校园网络，教务课表、成绩单、考务信息与全校实时空教室一键直达桌面。',
    example: '查一下今天下午 6 教和 9 教有哪些空闲考研自习室',
    tags: ['CAS 统一认证', '智慧课表同步', '实时空教室', '考务档案检索'],
  },
  {
    id: 'ai-class',
    badge: 'DEEP SCHOLARLY READING',
    title: 'AI 速课堂 · 沉浸精读',
    subtitle: '长文献全本挂载 · 零幻觉多跳事实抽取',
    summary: '专为全本大部头原著与长篇文献设计，挂载全量原文，支持跨章节多跳事实抽取与严格反虚构边界拒止，杜绝学术幻觉。',
    example: '《红楼梦》贾宝玉在全书中总共挨了几次打？动手人与具体缘由分别是什么？',
    tags: ['87万字长文本', '跨章节多跳抽取', '反虚构拒止', '原文事实溯源'],
  },
  {
    id: 'yanhu-web',
    badge: 'AUTONOMOUS WEB AGENT',
    title: '智联万站 · 砚小龙',
    subtitle: '桌面伙伴协同 · 内置 Chromium 无头浏览器',
    summary: '桌面智能伙伴“砚小龙”与内置无头浏览器深度联动。自主规划巡航路线、检索知网文献、成理官网导航与跨站办事。',
    example: '访问百度搜索成都理工大学官网并进入，提取当周最新科研通知',
    tags: ['内置浏览器', '砚小龙桌宠', '自主网页巡航', '结构化 DOM 解析'],
  },
  {
    id: 'material-review',
    badge: 'PRECISION AUDIT WORKBENCH',
    title: '材料审核专区',
    subtitle: '三栏同色联动 · 跨文档矛盾智能核验',
    summary: '独创三栏联动工作台：左栏对照评审细则，中栏核对申报文本，右栏定位风险卡片，同色高亮跨文件矛盾出处。',
    example: '对照国家重点研发计划评分细则，核对申报材料中的预算执行与自筹配套证明',
    tags: ['三栏联动工作台', '同色高亮追踪', '跨文件矛盾定位', '合规风险预警'],
  },
  {
    id: 'cdut-science',
    badge: 'SCIENTIFIC COMPUTING',
    title: 'CDUT Science 工作台',
    subtitle: '数据铁笼 · 曲线逆向数字化 · 3D 晶胞视口',
    summary: '理工科专项工作台：数据铁笼、Parquet 谱图联动、曲线逆向数字化 (Digitizer) 与 3D 晶体分子视口，支持出版级绘图。',
    example: '剖切金红石 TiO₂ (110) 晶面超胞，并一键数字化提取论文实验曲线',
    tags: ['3D 晶胞分子视口', '逆向曲线数字化', 'Science 双Y轴图版', 'Parquet 数据铁笼'],
  },
  {
    id: 'automation',
    badge: 'WORKFLOW AUTOMATION',
    title: '规划与任务自动化',
    subtitle: '后台定时守护 · Cron 任务编排与交付简报',
    summary: '让工作流在后台自主流转。支持任务看板、依赖编排与 Cron 定时守护，无需人工值守，定期自动生成进展成果。',
    example: '每周一上午 9 点汇总工作区内代码提交与测试报告，自动生成项目进展简报',
    tags: ['Cron 定时任务', '无人值守后台流转', '回归测试矩阵', '自动化成果简报'],
  },
  {
    id: 'skills-ecosystem',
    badge: 'EXPANDABLE ECOSYSTEM',
    title: '技能库与环境迁移',
    subtitle: '经验资产沉淀 · 跨设备备份与脱敏共享',
    summary: '将日常专业经验固化为可复用的 Agent Skill；一键打包或导入团队环境配置，所有敏感凭据在本地加密或脱敏。',
    example: '将本次材料审核的提问策略打包为一个专属 Skill，并导出 .profer-share 共享给课题组',
    tags: ['自定义 Skill 沉淀', '一键备份迁移', '团队凭据脱敏', '跨设备环境还原'],
  },
]

interface FeatureTourProps {
  onNext: () => void
  onSkip: () => void
  finishLabel: string
}

export function FeatureTour({ onNext, onSkip, finishLabel }: FeatureTourProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [animating, setAnimating] = React.useState(false)
  const lastNavTimeRef = React.useRef(0)
  const transitionTimerRef = React.useRef<number | null>(null)

  const isLast = activeIndex === FEATURE_TOUR_SLIDES.length - 1
  const activeSlide = FEATURE_TOUR_SLIDES[activeIndex]!

  const navigate = React.useCallback(
    (nextIndex: number) => {
      const now = Date.now()
      if (now - lastNavTimeRef.current < 120) return
      lastNavTimeRef.current = now

      if (nextIndex < 0 || nextIndex >= FEATURE_TOUR_SLIDES.length || nextIndex === activeIndex) return
      setAnimating(true)
      setActiveIndex(nextIndex)
      setProgress(0)
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = window.setTimeout(() => {
        transitionTimerRef.current = null
        setAnimating(false)
      }, TOUR_TRANSITION_MS)
    },
    [activeIndex],
  )

  const previous = React.useCallback(() => {
    navigate(Math.max(0, activeIndex - 1))
  }, [activeIndex, navigate])

  const next = React.useCallback(() => {
    if (isLast) {
      onNext()
      return
    }
    navigate(activeIndex + 1)
  }, [activeIndex, isLast, navigate, onNext])

  // 自动播放与进度条动画
  React.useEffect(() => {
    if (isLast || isPaused || isHovered) return

    const interval = 50
    const step = (interval / TOUR_INTERVAL_MS) * 100

    const timer = window.setInterval(() => {
      // updater 保持纯函数：只累加进度，推进由下方 effect 统一处理
      setProgress((prev) => Math.min(100, prev + step))
    }, interval)

    return () => window.clearInterval(timer)
  }, [activeIndex, isHovered, isLast, isPaused])

  // 进度走满后翻页（独立于 updater，避免严格模式下副作用被重复执行而连跳两页）
  React.useEffect(() => {
    if (progress < 100 || isLast || isPaused || isHovered) return
    setProgress(0)
    next()
  }, [progress, isLast, isPaused, isHovered, next])

  // 卸载时清理翻页动画计时器
  React.useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
        transitionTimerRef.current = null
      }
    }
  }, [])

  // 键盘快捷键监听
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (isInput) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previous()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === ' ' || event.key === 'Enter') {
        if (event.key === ' ') {
          event.preventDefault()
          setIsPaused((p) => !p)
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        onSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, onSkip, previous])

  return (
    <section
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-black text-white"
      aria-label="CDUT Studio 功能导览"
    >
      {/* 动态 GPU 液态背景 */}
      <IntroFluidBackground durationMs={20000} repeat />

      {/* 渐变遮罩：确保左右区域文字与演示面板对比度均匀透亮 */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_50%,rgba(0,0,0,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      {/* 顶部导航与跳过 */}
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-6 sm:px-12 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 border border-white/15">
            <Sparkles className="size-4 text-emerald-400" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-[0.22em] text-white/80">
            CDUT STUDIO / 导览体验
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60">
            0{activeIndex + 1} / 0{FEATURE_TOUR_SLIDES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPaused((p) => !p)}
            className="h-8 gap-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
            title={isPaused ? '继续自动播放（空格键）' : '暂停自动播放（空格键）'}
          >
            {isPaused ? <Play className="size-3.5 text-emerald-400" /> : <Pause className="size-3.5" />}
            <span>{isPaused ? '继续' : '暂停'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="h-8 gap-1 text-xs text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="跳过介绍"
          >
            <span>跳过导览</span>
            <X className="size-3.5" />
          </Button>
        </div>
      </header>

      {/* 顶部自适应进度条 */}
      <div className="relative z-10 h-0.5 w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-75 ease-linear"
          style={{ width: `${isLast ? 100 : progress}%` }}
        />
      </div>

      {/* 主展示区：左右分栏布局 */}
      <main className="relative z-10 flex flex-1 items-center overflow-y-auto px-6 py-6 sm:px-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* 左侧说明区 (5 列) */}
          <div
            className={cn(
              'flex flex-col items-start transition-all duration-300 lg:col-span-5',
              animating ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0',
            )}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 tracking-wider">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeSlide.badge}
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {activeSlide.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-emerald-300/90 sm:text-base">
              {activeSlide.subtitle}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
              {activeSlide.summary}
            </p>

            {/* 特性标签 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {activeSlide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 示例交互指令 */}
            <div className="mt-7 w-full rounded-xl border border-white/15 bg-white/[0.05] p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400/90">
                <ArrowUpRight className="size-3.5" />
                <span>典型指令示例</span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm font-mono text-white/90 selection:bg-emerald-500 selection:text-black">
                “{activeSlide.example}”
              </p>
            </div>
          </div>

          {/* 右侧交互演示卡片区 (7 列) */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={cn(
                'relative w-full rounded-2xl border border-white/15 bg-black/40 p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300',
                animating ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100',
              )}
            >
              <DemoStage payloadId={activeSlide.id} />
            </div>
          </div>
        </div>
      </main>

      {/* 底部控制栏 */}
      <footer className="relative z-10 flex h-16 shrink-0 items-center justify-between border-t border-white/10 px-6 sm:px-12 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={previous}
          disabled={activeIndex === 0}
          className="text-xs text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="mr-1 size-4" />
          上一步
        </Button>

        {/* 步骤指示器 */}
        <div className="flex items-center gap-2" role="tablist" aria-label="功能导览进度">
          {FEATURE_TOUR_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={`查看第 ${index + 1} 项：${slide.title}`}
              aria-selected={index === activeIndex}
              onClick={() => navigate(index)}
              className={cn(
                'group relative flex h-6 items-center px-1 transition-all',
              )}
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-7 bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]'
                    : 'w-2 bg-white/30 group-hover:bg-white/60',
                )}
              />
            </button>
          ))}
        </div>

        <Button
          onClick={next}
          className="h-9 bg-white px-4 text-xs font-semibold text-black hover:bg-white/90 shadow-lg"
        >
          {isLast ? finishLabel : '继续'}
          {isLast ? <Check className="ml-1 size-4" /> : <ChevronRight className="ml-1 size-4" />}
        </Button>
      </footer>
    </section>
  )
}

/** 动态演示舞台组件，根据各功能特性分发高拟真模拟 UI */
function DemoStage({ payloadId }: { payloadId: string }): React.ReactElement {
  switch (payloadId) {
    case 'pi-agent':
      return <PiAgentDemo />
    case 'cdut-zone':
      return <CdutZoneDemo />
    case 'ai-class':
      return <AiClassDemo />
    case 'yanhu-web':
      return <YanhuWebDemo />
    case 'material-review':
      return <MaterialReviewDemo />
    case 'cdut-science':
      return <CdutScienceDemo />
    case 'automation':
      return <AutomationDemo />
    case 'skills-ecosystem':
      return <SkillsEcosystemDemo />
    default:
      return <div className="p-8 text-center text-white/50">演示内容就绪中...</div>
  }
}

// -------------------------------------------------------------
// 1. Pi 全能 Agent 演示
// -------------------------------------------------------------
function PiAgentDemo(): React.ReactElement {
  const [tab, setTab] = React.useState<'thinking' | 'terminal' | 'report'>('thinking')

  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      {/* 状态顶栏 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-white/80">Pi-Kernel 3.8 / 独立沙箱会话</span>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/5 p-0.5 border border-white/10">
          {(['thinking', 'terminal', 'report'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-md px-2.5 py-1 transition-all',
                tab === t ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/50 hover:text-white/80',
              )}
            >
              {t === 'thinking' ? '思考链' : t === 'terminal' ? '执行终端' : '交付报告'}
            </button>
          ))}
        </div>
      </div>

      {/* 模拟对话输入 */}
      <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/10 flex items-start gap-2">
        <Bot className="size-4 text-emerald-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-white/60 text-[11px]">User prompt:</p>
          <p className="text-white/90 font-mono">
            分析 @2026年科研经费支出.xlsx，筛查跨期异常并生成可视化审计卡片
          </p>
        </div>
      </div>

      {/* 视图内容切换 */}
      {tab === 'thinking' && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-3 text-white/85 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300">
            <Cpu className="size-3.5" />
            <span>&lt;think&gt; 深度推理链路中...</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px] text-white/80 pl-2 border-l border-emerald-500/30">
            <p className="text-white/90">1. 解析 Excel 表格 `2026年首季科研经费支出.xlsx`（包含 1,420 条财务流水）</p>
            <p className="text-white/90">2. 对照重点研发计划财务规范：识别差旅费跨期报销（3 笔，共计 ¥12,400）</p>
            <p className="text-emerald-300">3. 自动生成审计修正意见并构建可视化分布图表...</p>
          </div>
        </div>
      )}

      {tab === 'terminal' && (
        <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-emerald-400">
          <p className="text-white/50">$ python run_audit.py --file=./expenditures.xlsx --strict</p>
          <p className="text-white/70">[INFO] Reading workbook: 1420 rows, 18 columns</p>
          <p className="text-amber-400">[WARN] 3 cross-period entries detected in Q1 (Row #108, #429, #912)</p>
          <p className="text-emerald-300">[OK] Emitted audit_report.md & distribution_plot.png</p>
          <p className="text-white/40">[EXEC] Exit code 0, elapsed 420ms</p>
        </div>
      )}

      {tab === 'report' && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
            <p className="text-[10px] text-white/50">已核验总额</p>
            <p className="mt-1 font-mono text-base font-bold text-white">¥452,000</p>
            <p className="text-[10px] text-emerald-400">100% 覆盖</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
            <p className="text-[10px] text-amber-300">跨期异常项</p>
            <p className="mt-1 font-mono text-base font-bold text-amber-300">3 笔</p>
            <p className="text-[10px] text-amber-400">¥12,400</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
            <p className="text-[10px] text-white/50">合规审计得分</p>
            <p className="mt-1 font-mono text-base font-bold text-emerald-400">98.4</p>
            <p className="text-[10px] text-white/60">等第：优秀</p>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// 2. CDUT 校园特区演示
// -------------------------------------------------------------
function CdutZoneDemo(): React.ReactElement {
  const [activeSub, setActiveSub] = React.useState<'schedule' | 'classrooms' | 'grades'>('schedule')

  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">成都理工大学 · 智慧校园统一身份直联</span>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/30">
          已连接 (CAS)
        </span>
      </div>

      {/* 子功能切换 */}
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setActiveSub('schedule')}
          className={cn(
            'flex-1 rounded-lg border py-1.5 text-center transition-all',
            activeSub === 'schedule'
              ? 'border-emerald-400/40 bg-emerald-500/20 text-white font-medium'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08]',
          )}
        >
          今日课表
        </button>
        <button
          type="button"
          onClick={() => setActiveSub('classrooms')}
          className={cn(
            'flex-1 rounded-lg border py-1.5 text-center transition-all',
            activeSub === 'classrooms'
              ? 'border-emerald-400/40 bg-emerald-500/20 text-white font-medium'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08]',
          )}
        >
          空教室检索
        </button>
        <button
          type="button"
          onClick={() => setActiveSub('grades')}
          className={cn(
            'flex-1 rounded-lg border py-1.5 text-center transition-all',
            activeSub === 'grades'
              ? 'border-emerald-400/40 bg-emerald-500/20 text-white font-medium'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08]',
          )}
        >
          考务与成绩
        </button>
      </div>

      {activeSub === 'schedule' && (
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-white/90">《现代地球化学原理》</p>
              <p className="text-[11px] text-white/50 mt-0.5">09:50 - 11:30 · 九教 9A204 · 陈教授</p>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
              进行中
            </span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-white/90">《深地探测与空间遥感》</p>
              <p className="text-[11px] text-white/50 mt-0.5">14:00 - 15:40 · 六教 6B301 · 李副教授</p>
            </div>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/50">未开始</span>
          </div>
        </div>
      )}

      {activeSub === 'classrooms' && (
        <div className="space-y-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-300">六教 6B301</span>
              <p className="text-[11px] text-white/60 mt-0.5">多媒体大教室 · 考研自习推荐</p>
            </div>
            <span className="font-mono text-emerald-400 font-bold">空闲 · 余 42 座</span>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-300">九教 9C102</span>
              <p className="text-[11px] text-white/60 mt-0.5">阶梯自习室 · 全天开放</p>
            </div>
            <span className="font-mono text-emerald-400 font-bold">空闲 · 余 56 座</span>
          </div>
        </div>
      )}

      {activeSub === 'grades' && (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 space-y-2">
          <div className="flex justify-between items-center text-white/80">
            <span>当前学期已归档课程</span>
            <span className="font-mono font-bold text-white">4 门</span>
          </div>
          <div className="flex justify-between items-center text-white/80">
            <span>平均学分绩点 (GPA)</span>
            <span className="font-mono font-bold text-emerald-400">3.82 / 4.0</span>
          </div>
          <div className="flex justify-between items-center text-white/80">
            <span>下场统考倒计时</span>
            <span className="font-mono text-amber-300">距期末评测 12 天</span>
          </div>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// 3. AI 速课堂 · 文献精读演示
// -------------------------------------------------------------
function AiClassDemo(): React.ReactElement {
  const [caseType, setCaseType] = React.useState<'q1' | 'q2'>('q1')

  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">演示课堂 · 红楼梦精读</span>
        </div>
        <span className="font-mono text-[10px] text-white/50">
          全本 120 回 · 87 万字原文挂载
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCaseType('q1')}
          className={cn(
            'flex-1 rounded-lg border p-2 text-left transition-all',
            caseType === 'q1'
              ? 'border-emerald-400/40 bg-emerald-500/20 text-white'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08]',
          )}
        >
          <p className="font-medium">用例 1 · 多跳事实抽取</p>
          <p className="text-[10px] text-white/50 mt-0.5">贾宝玉总共挨了几次打？</p>
        </button>
        <button
          type="button"
          onClick={() => setCaseType('q2')}
          className={cn(
            'flex-1 rounded-lg border p-2 text-left transition-all',
            caseType === 'q2'
              ? 'border-amber-400/40 bg-amber-500/20 text-white'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08]',
          )}
        >
          <p className="font-medium">用例 2 · 反虚构学术拒止</p>
          <p className="text-[10px] text-white/50 mt-0.5">薛宝钗随贾政知府断案？</p>
        </button>
      </div>

      {caseType === 'q1' ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-2">
          <div className="flex items-center justify-between text-emerald-300 font-medium">
            <span>精准提取 3 处核心事件</span>
            <span className="text-[10px] rounded bg-emerald-500/20 px-1.5 py-0.5">跨回目原文定位</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-white/80">
            <p>
              <strong className="text-white">① 第33回：</strong>贾政痛笞宝玉（因金钏投井及忠顺王府琪官出逃）。
            </p>
            <p>
              <strong className="text-white">② 第25回：</strong>赵姨娘唆使贾环借推油灯烫伤宝玉面部。
            </p>
            <p>
              <strong className="text-white">③ 第3回：</strong>初见黛玉因其无玉，登时摔玉自打。
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-2">
          <div className="flex items-center justify-between text-amber-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              恪守学术边界 · 拒止虚构
            </span>
            <span className="text-[10px] rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">
              反幻觉引擎生效
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-white/85">
            经全文检索，原著中薛宝钗为薛家闺秀，从未跟随贾政出仕为官，原著中亦无任何出任知府学政或断案情节。该问题属于虚构假设，系统坚守学术真实，拒绝无中生有。
          </p>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// 4. 智联万站与内置浏览器演示
// -------------------------------------------------------------
function YanhuWebDemo(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      {/* 浏览器地址栏仿真 */}
      <div className="flex items-center gap-2 rounded-lg bg-black/60 p-2 border border-white/10">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-red-500/80" />
          <span className="size-2 rounded-full bg-amber-500/80" />
          <span className="size-2 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/70 truncate">
          https://www.cdut.edu.cn/kxyj/tzgg.htm
        </div>
        <RefreshCw className="size-3 text-white/40" />
      </div>

      {/* 砚小龙与任务状态 */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-start gap-3">
        <div className="size-9 rounded-xl bg-emerald-400/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
          <Sparkles className="size-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">桌宠砚小龙 · 巡航抓取中</span>
            <span className="text-[10px] font-mono text-emerald-300">DOM 解析完成</span>
          </div>
          <p className="text-[11px] text-white/70 mt-1">
            “主人，已为您从成理官网提取最新科研与学术会议通知，整理完毕！”
          </p>
        </div>
      </div>

      {/* 抓取结果清单 */}
      <div className="space-y-1.5">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 flex items-center justify-between">
          <span className="text-white/90 truncate">关于申报 2026 年度成理青年科技创新基金的通知</span>
          <span className="text-[10px] text-white/40 font-mono shrink-0 ml-2">科技处 · 04-22</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 flex items-center justify-between">
          <span className="text-white/90 truncate">深地能源与地球物理前沿系列学术讲座第 48 期</span>
          <span className="text-[10px] text-white/40 font-mono shrink-0 ml-2">国际会议厅</span>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 5. 材料审核专区演示
// -------------------------------------------------------------
function MaterialReviewDemo(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <FileCheck className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">材料审核专区 · 三栏同色联动审计</span>
        </div>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-500/30">
          发现 1 处严重矛盾
        </span>
      </div>

      {/* 三栏缩影示意 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 左栏：依据 */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 flex flex-col justify-between">
          <p className="text-[10px] text-white/50 font-medium">【左栏 · 依据】</p>
          <div className="rounded border border-amber-400/40 bg-amber-500/10 p-1.5 mt-1">
            <p className="text-[10px] text-amber-200">《评审细则》4.2 条</p>
            <p className="text-[10px] text-white/80 mt-0.5">自筹配套资金比例不得低于 1:1</p>
          </div>
        </div>

        {/* 中栏：材料 */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 flex flex-col justify-between">
          <p className="text-[10px] text-white/50 font-medium">【中栏 · 申报书】</p>
          <div className="rounded border border-amber-400/40 bg-amber-500/10 p-1.5 mt-1">
            <p className="text-[10px] text-amber-200">申报书附表 3.1</p>
            <p className="text-[10px] text-white/80 mt-0.5">专项120万，自筹仅承诺60万</p>
          </div>
        </div>

        {/* 右栏：研判卡 */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/15 p-2 flex flex-col justify-between">
          <p className="text-[10px] text-amber-300 font-semibold">【右栏 · AI 研判】</p>
          <div className="mt-1">
            <span className="rounded bg-red-500/20 px-1 py-0.5 text-[9px] text-red-300">
              一票否决风险
            </span>
            <p className="text-[10px] text-white/90 mt-1">资金配套缺口 60 万，已同色高亮跨文件两处冲突。</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white/[0.04] p-2 border border-white/10 text-[11px] text-white/70">
        💡 点击任何研判问题卡，系统将以相同高亮色联动聚焦左中右三栏原稿，极大降低人工复核成本。
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 6. CDUT Science 工作台演示
// -------------------------------------------------------------
function CdutScienceDemo(): React.ReactElement {
  const [sciTab, setSciTab] = React.useState<'3d' | 'digitize' | 'plot'>('3d')

  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <FlaskConical className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">CDUT Science 科研工作台</span>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/5 p-0.5 border border-white/10">
          {(['3d', 'digitize', 'plot'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSciTab(mode)}
              className={cn(
                'rounded px-2 py-0.5 text-[10px] transition-all',
                sciTab === mode ? 'bg-white/20 text-white font-medium' : 'text-white/50 hover:text-white',
              )}
            >
              {mode === '3d' ? '3D晶胞' : mode === 'digitize' ? '曲线逆向' : '出版图版'}
            </button>
          ))}
        </div>
      </div>

      {sciTab === '3d' && (
        <div className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2">
          <div className="flex justify-between items-center text-white/80">
            <span className="font-mono text-emerald-300">SrTiO₃ 钙钛矿晶胞 (Pm-3m)</span>
            <span className="text-[10px] text-white/40">3D Mol* 视口</span>
          </div>
          <div className="h-20 rounded-lg bg-gradient-to-r from-cyan-950/40 via-emerald-950/40 to-blue-950/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
            <Atom className="size-10 text-emerald-400/60 animate-spin" style={{ animationDuration: '16s' }} />
            <span className="absolute bottom-1 right-2 text-[10px] text-white/40 font-mono">
              (110) 晶面剖切超胞
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-white/60">
            <span>B-DNA 1BNA 双螺旋</span>
            <span>金红石 TiO₂ (2×2×3)</span>
          </div>
        </div>
      )}

      {sciTab === 'digitize' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white/90">科研图表逆向标定提取</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
              Parquet 自动导出
            </span>
          </div>
          <p className="text-[11px] text-white/70">
            从低清论文截图或实验报告中自动拾取曲线像素坐标，一键生成数字化数值表。
          </p>
          <div className="font-mono text-[10px] text-emerald-400/90 rounded bg-black/50 p-1.5 border border-white/5">
            X 轴 [20.0° - 80.0° 2θ] | Y 轴 [0 - 1250 a.u.] -&gt; 提取 12 个特征峰位 [OK]
          </div>
        </div>
      )}

      {sciTab === 'plot' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white/90">Science 双 Y 轴出版级图版</span>
            <span className="text-[10px] text-white/50">Origin 级规格</span>
          </div>
          <div className="flex justify-between text-[11px] text-white/70">
            <span>左轴：合成实验 Cu Kα 衍射谱</span>
            <span className="text-cyan-300">右轴：理论计算 PXRD 峰</span>
          </div>
          <p className="text-[10px] text-white/50">
            预置国际顶级学术期刊配色模板，支持一键导出矢量 PDF 与 600 DPI 印刷级图版。
          </p>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// 7. 规划与任务自动化演示
// -------------------------------------------------------------
function AutomationDemo(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">后台无人值守 · 自动化编排</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-300">活跃守护中</span>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">科研项目每周日志与测试自动巡检</span>
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70">
            Cron: 0 9 * * 1
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>拉取工作区最新 Git 提交与实验记录</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>运行单元测试回归矩阵 (19/19 Pass)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>聚合分析指标并生成 Markdown 周报交付件</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-white/10 text-[10px] text-white/50">
          <span>下一次自动执行：周一 09:00</span>
          <span className="text-emerald-400">连续 12 周自动执行无故障</span>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 8. 技能库与环境迁移演示
// -------------------------------------------------------------
function SkillsEcosystemDemo(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Puzzle className="size-4 text-emerald-400" />
          <span className="font-semibold text-white/90">技能库沉淀与跨设备无缝迁移</span>
        </div>
        <span className="font-mono text-[10px] text-white/60">可随处迁移</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
            <Database className="size-3.5" />
            <span>整机备份 (.profer-backup)</span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed">
            将模型渠道、Agent 预设、学术配置打包为加密归档，换电脑双击即刻还原。
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
            <Share2 className="size-3.5" />
            <span>团队共享 (.profer-share)</span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed">
            自动剥离 API Key 与账户密码等私密凭据，安全分享环境给课题组或同学。
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span className="text-white/80">已沉淀 14 项专项学术 Skill</span>
        </div>
        <span className="text-[10px] text-white/50">开箱即用</span>
      </div>
    </div>
  )
}
