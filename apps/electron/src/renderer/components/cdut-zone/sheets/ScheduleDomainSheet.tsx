/**
 * ScheduleDomainSheet — CDUT 专区「今日课表 / 学期日程」抽屉业务卡片
 *
 * 核心交互：
 *   - Tab 双模式：「我的个人课表」/「全校班级课表」；
 *   - 周次筛选 + 星期标签切换；当前周启用「正在上课 / 下节课预告」呼吸光晕雷达卡；
 *   - 班级模糊搜索（班号或名称）+ 最近常看班级快选 Chip；
 *   - 支持真实青果教务实时同步与高仿真演示数据透明回退（带环境徽标）。
 */

import * as React from 'react'
import {
  CalendarDays,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react'
import type { BeijingTimeInfo, CdutDomainToolResult } from '@profer/shared'
import { computeBeijingTeachingWeek, evaluateCourseLiveStatus, getBeijingTimeInfo } from '@profer/shared'
import { cn } from '@/lib/utils'
import { formatBeijingClock } from '@/lib/beijing-greeting'

interface ScheduleCourseItem {
  name: string
  dayOfWeek: number
  periodText: string
  startSection: number
  endSection: number
  location: string
  teacher: string
  weeks: string
  /** 通用周次展开列表（空数组 = 全学期排课） */
  weekList: number[]
  isOngoing?: boolean
  isNext?: boolean
}

interface OtherClassCourseItem {
  name: string
  code: string
  credit: string
  teachers: string[]
  rooms: string[]
  classNames: string[]
  campus: string
  remark: string
}

const WEEKDAYS = [
  { id: 1, label: '周一' },
  { id: 2, label: '周二' },
  { id: 3, label: '周三' },
  { id: 4, label: '周四' },
  { id: 5, label: '周五' },
  { id: 6, label: '周六' },
  { id: 7, label: '周日' },
] as const

/** 最近常看班级历史（本地优先，不入库、纯配置化 localStorage 快照） */
const RECENT_CLASSES_KEY = 'cdut-recent-classes'
const RECENT_CLASSES_MAX = 6

function loadRecentClasses(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_CLASSES_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string').slice(0, RECENT_CLASSES_MAX) : []
  } catch {
    return []
  }
}

function saveRecentClass(className: string): void {
  try {
    const next = [className, ...loadRecentClasses().filter((c) => c !== className)].slice(0, RECENT_CLASSES_MAX)
    window.localStorage.setItem(RECENT_CLASSES_KEY, JSON.stringify(next))
  } catch {
    // 本地快照失败不阻塞查询
  }
}

function deleteRecentClass(className: string): string[] {
  try {
    const next = loadRecentClasses().filter((c) => c !== className)
    window.localStorage.setItem(RECENT_CLASSES_KEY, JSON.stringify(next))
  } catch {
    // 本地快照失败不阻塞界面
  }
  return loadRecentClasses()
}

/** 北京时间实时时钟与原子信息（秒级跳动；与宿主时区无关，绝对标准 Asia/Shanghai） */
function useBeijingNow(): { text: string; info: BeijingTimeInfo } {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return React.useMemo(() => ({ text: formatBeijingClock(now), info: getBeijingTimeInfo(now) }), [now])
}

/** 规范化个人课表课程数据（兼容实时解析与 Demo 假数据两种 JSON 结构） */
function normalizeCourses(rawJson: unknown): ScheduleCourseItem[] {
  if (!rawJson || typeof rawJson !== 'object') return []
  const obj = rawJson as Record<string, unknown>
  const list = Array.isArray(obj.courses) ? obj.courses : []
  const result: ScheduleCourseItem[] = []

  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const c = item as Record<string, unknown>
    const name = String(c.name || c.courseName || '').trim()
    if (!name) continue

    const dayOfWeek = Number(c.dayOfWeek || c.weekday || 1)
    const startSection = Number(c.startSection || c.period || 1)
    const endSection = Number(c.endSection || (c.period ? Number(c.period) + 1 : 2))
    const location = String(c.location || c.classroom || '待定').trim()
    const teacher = String(c.teacher || '任课教师').trim()
    const weeks = String(c.weeks || '').trim()
    const weekList = Array.isArray(c.weekList) ? (c.weekList as unknown[]).filter((w): w is number => typeof w === 'number') : []

    result.push({
      name,
      dayOfWeek,
      periodText: `第 ${startSection}-${endSection} 节`,
      startSection,
      endSection,
      location,
      teacher,
      weeks,
      weekList,
    })
  }

  return result
}

/** 规范化全校班级课表数据 */
function normalizeOtherClassCourses(rawJson: unknown): OtherClassCourseItem[] {
  if (!rawJson || typeof rawJson !== 'object') return []
  const obj = rawJson as Record<string, unknown>
  const list = Array.isArray(obj.courses) ? obj.courses : []
  const result: OtherClassCourseItem[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const c = item as Record<string, unknown>
    const name = String(c.name || '').trim()
    if (!name) continue
    result.push({
      name,
      code: String(c.code || ''),
      credit: String(c.credit || ''),
      teachers: Array.isArray(c.teachers) ? (c.teachers as unknown[]).filter((t): t is string => typeof t === 'string') : [],
      rooms: Array.isArray(c.rooms) ? (c.rooms as unknown[]).filter((r): r is string => typeof r === 'string') : [],
      classNames: Array.isArray(c.classNames) ? (c.classNames as unknown[]).filter((k): k is string => typeof k === 'string') : [],
      campus: String(c.campus || ''),
      remark: String(c.remark || ''),
    })
  }
  return result
}

/**
 * 独立顶部横幅雷达卡片：与周次切换器严格正交，常驻展示。
 *   - 正在上课 / 下节课预告（未来 24 小时内，由北京时间纯函数按分钟实时重算）；
 *   - 未来 24 小时无课程时渲染友好空闲文案，坚决不展示数天后的遥远课程。
 */
function RadarBanner({
  ongoing,
  next,
}: {
  ongoing: ScheduleCourseItem | null
  next: ScheduleCourseItem | null
}): React.ReactElement {
  const target = ongoing ?? next
  const isOngoing = ongoing !== null

  if (!target) {
    return (
      <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">实时课程雷达</span>
          <span className="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">未来24小时内</span>
        </div>
        <p className="mt-1.5 text-sm font-medium text-foreground">☕ 未来24小时暂无课程，尽情享受自由时光吧~</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-3.5 shadow-xs',
        isOngoing
          ? 'border-primary/40 bg-gradient-to-r from-primary/10 via-background to-primary/5'
          : 'border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-background to-sky-500/5',
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('relative flex size-2.5', isOngoing && 'animate-pulse')}>
          <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', isOngoing ? 'bg-primary' : 'bg-sky-500')} />
          <span className={cn('relative inline-flex size-2.5 rounded-full', isOngoing ? 'bg-primary' : 'bg-sky-500')} />
        </span>
        <span className={cn('text-xs font-bold', isOngoing ? 'text-primary' : 'text-sky-600 dark:text-sky-400')}>
          {isOngoing ? '正在上课' : '下节课预告（未来24小时内）'}
        </span>
        <span className="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">{target.periodText}</span>
      </div>
      <h4 className="mt-1.5 text-sm font-semibold text-foreground">{target.name}</h4>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin size={11} className="text-emerald-500" />
          {target.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <User size={11} className="text-indigo-500" />
          {target.teacher}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={11} className="text-amber-500" />
          {WEEKDAYS.find((d) => d.id === target.dayOfWeek)?.label ?? ''}
        </span>
      </div>
    </div>
  )
}

export function ScheduleDomainSheet(): React.ReactElement {
  const [tab, setTab] = React.useState<'mine' | 'other'>('mine')
  // 周次默认值按北京时间估算当前教学周，避免离线/冷启动时错误显示第 1 周
  const [week, setWeek] = React.useState<number>(1)
  // 用户是否手动切换过周次（自动识别的当前教学周仅作首次默认值，绝不覆盖用户选择）
  const weekTouchedRef = React.useRef(false)
  // 星期默认值锁定北京时间（与宿主系统时区无关）
  const [selectedDay, setSelectedDay] = React.useState<number>(1)
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<CdutDomainToolResult | null>(null)
  // SWR 陈旧数据：抽屉打开先读离线缓存秒开渲染，网络成功后热更新并原子落盘
  const [cachedData, setCachedData] = React.useState<CdutDomainToolResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // 全校班级课表查询
  const [classQuery, setClassQuery] = React.useState('')
  const [recentClasses, setRecentClasses] = React.useState<string[]>(() => loadRecentClasses())
  const [otherLoading, setOtherLoading] = React.useState(false)
  const [otherData, setOtherData] = React.useState<CdutDomainToolResult | null>(null)
  const [otherError, setOtherError] = React.useState<string | null>(null)

  const beijing = useBeijingNow()

  // SWR 第一步：抽屉打开立即读取课表离线缓存，完成前台初次秒开渲染。
  // 防御式调用：主进程未随渲染层一起更新时 readDomainCache 可能不存在，
  // 直接调用会同步抛 TypeError 打断整个组件渲染（历史 Bug：入口一片空白且无加载动画）。
  React.useEffect(() => {
    let alive = true
    const api = window.electronAPI?.cdutZone
    if (typeof api?.readDomainCache !== 'function') return
    api
      .readDomainCache('schedule')
      .then((cached) => {
        if (!alive || !cached || typeof cached !== 'object') return
        const payload = (cached as { data?: unknown }).data
        if (payload && typeof payload === 'object' && typeof (payload as CdutDomainToolResult).json !== 'undefined') {
          setCachedData(payload as CdutDomainToolResult)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // 全学期课表拉取（不传 week，周次由客户端按 weekList 过滤，保证 24h 雷达横跨周界）
  const fetchSchedule = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const res = await window.electronAPI.cdutZone.callDomainTool({
        domain: 'schedule',
        params: {
          action: 'get_my_schedule',
          isCurrentWeek: true,
        },
      })
      setData(res)
      // SWR 第二步：网络成功后原子写入离线缓存，下次打开秒开（同样防御式调用）
      const api = window.electronAPI?.cdutZone
      if (typeof api?.writeDomainCache === 'function') {
        void api.writeDomainCache({ name: 'schedule', payload: res }).catch(() => {})
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取课表日程失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOtherClass = React.useCallback(async (query: string): Promise<void> => {
    const trimmed = query.trim()
    if (!trimmed) return
    setOtherLoading(true)
    setOtherError(null)
    try {
      const res = await window.electronAPI.cdutZone.callDomainTool({
        domain: 'schedule',
        params: { action: 'query_other_schedule', className: trimmed },
      })
      setOtherData(res)
      saveRecentClass(trimmed)
      setRecentClasses(loadRecentClasses())
    } catch (err) {
      setOtherError(err instanceof Error ? err.message : '班级课表查询失败')
    } finally {
      setOtherLoading(false)
    }
  }, [])

  /** 搜索历史单条删除 */
  const handleDeleteRecent = React.useCallback((className: string): void => {
    setRecentClasses(deleteRecentClass(className))
  }, [])

  React.useEffect(() => {
    if (tab === 'mine') void fetchSchedule()
  }, [tab, fetchSchedule])

  // 全学期课程（雷达横幅与周次网格共用同一份数据源）
  const courses = React.useMemo(() => normalizeCourses((data ?? cachedData)?.json), [data, cachedData])

  // 实时雷达：以北京星期 + 当日分钟为依赖按分钟重算，秒级时钟仅驱动文案，避免每秒克隆全量课程
  const radar = React.useMemo(
    () => evaluateCourseLiveStatus(courses, beijing.info),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 秒级 info 对象无需参与依赖，分钟级字段变化即重算
    [courses, beijing.info.dayOfWeek, beijing.info.minutesOfDay],
  )
  const markedCourses = radar.markedCourses

  // 当前教学周自动识别：主进程返回 currentWeek 时，仅在用户未手动切周的情况下默认选中
  React.useEffect(() => {
    if (weekTouchedRef.current) return
    const rawJson = (data ?? cachedData)?.json
    const currentWeek = rawJson && typeof rawJson === 'object' ? (rawJson as Record<string, unknown>).currentWeek : undefined
    if (typeof currentWeek === 'number' && currentWeek >= 1) setWeek(currentWeek)
  }, [data, cachedData])

  // 周次网格：严格客户端过滤（weekList 空 = 全学期排课），使用雷达重算后的课程标记
  const weekCourses = React.useMemo(
    () => markedCourses.filter((c) => c.weekList.length === 0 || c.weekList.includes(week)),
    [markedCourses, week],
  )
  const filteredCourses = React.useMemo(() => {
    return weekCourses.filter((c) => c.dayOfWeek === selectedDay)
  }, [weekCourses, selectedDay])

  const otherCourses = React.useMemo(() => normalizeOtherClassCourses(otherData?.json), [otherData])

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Tab 切换：我的个人课表 / 全校班级课表 */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex rounded-lg bg-muted/60 p-0.5">
          {(
            [
              { id: 'mine', label: '我的个人课表' },
              { id: 'other', label: '全校班级课表' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'rounded-md px-3 py-1 text-xs transition-colors',
                tab === item.id
                  ? 'bg-card font-semibold text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {(data ?? cachedData)?.isDemo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            <Sparkles size={11} />
            高仿真演示数据
          </span>
        )}
        {/* 实时北京时间时钟药丸（无论宿主时区，恒为绝对标准 Asia/Shanghai） */}
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <Clock className="size-3.5 animate-pulse" />
          <span className="font-mono tabular-nums">北京时间 {beijing.text}</span>
        </div>
      </div>

      {tab === 'mine' ? (
        <>
          {/* 独立下节课预告专区：常驻横幅雷达卡片，位于周次选择器正上方，与周次切换严格正交 */}
          {!error && courses.length > 0 && <RadarBanner ongoing={radar.ongoing} next={radar.next} />}
          {/* 陈旧缓存已在渲染（后台静默重验证）时给出轻量提示，避免用户误以为数据未刷新 */}
          {loading && courses.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Loader2 size={11} className="animate-spin" />
              <span>正在同步最新课表…</span>
            </div>
          )}

          {/* 顶栏控件：周次选择器 + 刷新 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">当前周次：</label>
              <select
                value={week}
                onChange={(e) => {
                  weekTouchedRef.current = true
                  setWeek(Number(e.target.value))
                }}
                className="h-8 rounded-lg border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground shadow-xs outline-none focus:border-primary"
              >
                {Array.from({ length: 25 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    第 {w} 周 {w === 1 ? '(当前学期启动)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => void fetchSchedule()}
              disabled={loading}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw size={13} className={cn(loading && 'animate-spin')} />
              <span>刷新</span>
            </button>
          </div>

          {/* 星期横向标签栏 */}
          <div className="grid grid-cols-7 gap-1.5 rounded-xl bg-muted/40 p-1">
            {WEEKDAYS.map((item) => {
              const isSelected = selectedDay === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDay(item.id)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg py-1.5 transition-all text-xs',
                    isSelected
                      ? 'bg-background font-semibold text-primary shadow-xs'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
                  )}
                >
                  <span>{item.label}</span>
                  <span className="mt-0.5 text-[10px] opacity-75">
                    {weekCourses.filter((c) => c.dayOfWeek === item.id).length} 节
                  </span>
                </button>
              )
            })}
          </div>

          {/* 课程列表卡片流 */}
          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
            {loading && courses.length === 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 size={13} className="animate-spin text-primary" />
                  <span>正在同步成理青果课表日程…</span>
                </div>
                {/* 骨架屏：保证加载期始终有明确的可视反馈，杜绝「一片空白」 */}
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card p-4">
                    <div className="h-3.5 w-24 rounded bg-muted" />
                    <div className="mt-2.5 h-4 w-40 rounded bg-muted" />
                    <div className="mt-3 flex gap-4 border-t border-border/40 pt-2.5">
                      <div className="h-3 w-28 rounded bg-muted" />
                      <div className="h-3 w-20 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                {error}
              </div>
            ) : (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 text-muted-foreground text-center p-6">
                    <CalendarDays size={24} className="text-muted-foreground/60" />
                    <p className="text-xs font-medium">当天暂无排课安排</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      好好享受静谧自习或科研时光，可前往「自习空教室」寻找安适学习位点。
                    </p>
                  </div>
                ) : (
                  filteredCourses.map((c, idx) => (
                    <div
                      key={`${c.name}-${c.startSection}-${idx}`}
                      className={cn(
                        'relative overflow-hidden rounded-xl border bg-card p-4 shadow-xs transition-all hover:shadow-sm',
                        c.isOngoing
                          ? 'border-primary/50 ring-1 ring-primary/25'
                          : c.isNext
                            ? 'border-sky-500/40'
                            : 'border-border/70 hover:border-primary/40',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                              <Clock size={11} />
                              {c.periodText}
                            </span>
                            {c.weeks && (
                              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                {c.weeks}
                              </span>
                            )}
                            {c.isOngoing && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                                <Radio size={10} />
                                进行中
                              </span>
                            )}
                          </div>
                          <h4 className="pt-1 text-sm font-semibold text-foreground">{c.name}</h4>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-emerald-500" />
                          <span>{c.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-indigo-500" />
                          <span>{c.teacher}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* 班级模糊搜索 + 最近常看快选 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={classQuery}
                  onChange={(e) => setClassQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void fetchOtherClass(classQuery)
                  }}
                  placeholder="输入班级名称（如 智能2班）或班号（如 2025191101）"
                  className="h-9 w-full rounded-lg border border-border/80 bg-background pl-8 pr-8 text-xs text-foreground shadow-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                />
                {classQuery && (
                  <button
                    type="button"
                    onClick={() => setClassQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                    title="清空"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => void fetchOtherClass(classQuery)}
                disabled={otherLoading || !classQuery.trim()}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {otherLoading ? <Loader2 size={13} className="animate-spin" /> : <Users size={13} />}
                查询课表
              </button>
            </div>

            {recentClasses.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">最近常看：</span>
                {recentClasses.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setClassQuery(c)
                        void fetchOtherClass(c)
                      }}
                      className={cn(
                        'cursor-pointer',
                        classQuery === c && 'font-medium text-foreground',
                      )}
                    >
                      {c}
                    </button>
                    {/* 单条删除：仅移除该条历史，不影响其它快选 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteRecent(c)
                      }}
                      title="删除该条搜索历史"
                      className="rounded-full p-0.5 text-muted-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 班级课表结果 */}
          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
            {otherLoading ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 size={20} className="animate-spin text-primary" />
                <p className="text-xs">正在检索全校班级课表…</p>
              </div>
            ) : otherError ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                {otherError}
              </div>
            ) : !otherData ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 text-center text-muted-foreground p-6">
                <GraduationCap size={24} className="text-muted-foreground/60" />
                <p className="text-xs font-medium">输入班级名称或班号，一键查询任意班级课表</p>
                <p className="text-[11px] text-muted-foreground/80">仅支持班级课表查询，教师/教室课表不对学生开放</p>
              </div>
            ) : otherCourses.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 text-center text-muted-foreground p-6">
                <CalendarDays size={22} className="text-muted-foreground/60" />
                <p className="text-xs font-medium">未检索到与「{classQuery}」匹配的班级课表</p>
                <p className="text-[11px] text-muted-foreground/80">请确认班级名称或班号后重试</p>
              </div>
            ) : (
              otherCourses.map((c, idx) => (
                <div
                  key={`${c.code}-${c.name}-${idx}`}
                  className="rounded-xl border border-border/70 bg-card p-3.5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{c.name}</h4>
                    {c.credit && (
                      <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        {c.credit} 学分
                      </span>
                    )}
                  </div>
                  {c.code && <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{c.code}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                    {c.teachers.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <User size={11} className="text-indigo-500" />
                        {c.teachers.join('、')}
                      </span>
                    )}
                    {c.rooms.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} className="text-emerald-500" />
                        {c.rooms.join('；')}
                      </span>
                    )}
                    {c.classNames.length > 0 && <span>教学班：{c.classNames.join('、')}</span>}
                    {c.campus && <span>{c.campus}</span>}
                  </div>
                  {c.remark && <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground/80">备注：{c.remark}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
