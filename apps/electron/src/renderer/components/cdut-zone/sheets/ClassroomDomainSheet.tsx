/**
 * ClassroomDomainSheet — CDUT 专区「自习空教室」抽屉业务卡片
 *
 * 核心交互：
 *   - 校区选择器（成都校区 / 宜宾校区）；
 *   - 常用教学楼快速标签（东区1教、9教、6教、甲教、乙教等）；
 *   - 节次时间段筛选（上午 1-2节、3-4节；下午 5-8节；晚自习 9-10节；全天）；
 *   - 空闲教室卡片网格（教室编号、座位容量、空调支持、空闲节次明细）；
 *   - 兼容实时教务与演示数据无缝回退。
 */

import * as React from 'react'
import {
  Building2,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Wind,
} from 'lucide-react'
import type { CdutDomainToolResult } from '@profer/shared'
import { cn } from '@/lib/utils'

interface ClassroomItem {
  roomName: string
  capacity: number
  availableSections: number[]
  hasAirConditioner: boolean
}

/**
 * 动态楼宇条目（唯一来源：教务 jsjy_processAjax 实时发现的真实楼宇 + jxlbh 代码）。
 * 严禁再维护任何硬编码楼宇清单——虚构楼名属于演示假数据，会让筛选与真实教务口径不符。
 */
interface BuildingItem {
  name: string
  code: string
}

/**
 * 精确对应成都理工大学官方作息的节次筛选选项（11 节制，严禁出现第 12 节课）。
 * 中午 12:00-13:55 为午休空档，不作为可选教学节次。
 */
const TIME_SLOTS: { id: string; label: string; sections?: number[] }[] = [
  { id: 'p12', label: '01-02节 (08:10-09:45)', sections: [1, 2] },
  { id: 'p34', label: '03-04节 (10:15-11:50)', sections: [3, 4] },
  { id: 'p56', label: '05-06节 (14:30-16:05)', sections: [5, 6] },
  { id: 'p78', label: '07-08节 (16:25-18:00)', sections: [7, 8] },
  { id: 'p910', label: '09-10节 (19:10-20:45)', sections: [9, 10] },
  { id: 'p11', label: '11节 (20:50-21:35)', sections: [11] },
  { id: 'all', label: '全天时段', sections: undefined },
]

/** 从查询结果 JSON 中提取动态楼宇清单（旧版式 / Demo 数据无此字段时返回空数组） */
function normalizeBuildings(rawJson: unknown): BuildingItem[] {
  if (!rawJson || typeof rawJson !== 'object') return []
  const list = (rawJson as Record<string, unknown>).buildings
  if (!Array.isArray(list)) return []
  const result: BuildingItem[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const b = item as Record<string, unknown>
    const name = String(b.name ?? '').trim()
    const code = String(b.code ?? '').trim()
    if (name && code) result.push({ name, code })
  }
  return result
}

/** 规范化空闲教室列表 */
function normalizeClassrooms(rawJson: unknown): ClassroomItem[] {
  if (!rawJson || typeof rawJson !== 'object') return []
  const obj = rawJson as Record<string, unknown>

  // 1. 标准结构: obj.emptyRooms
  if (Array.isArray(obj.emptyRooms)) {
    return obj.emptyRooms.map((r) => {
      const item = r as Record<string, unknown>
      return {
        roomName: String(item.roomName || '未知教室'),
        capacity: Number(item.capacity || 0),
        availableSections: Array.isArray(item.availableSections)
          ? (item.availableSections as number[])
          : [],
        hasAirConditioner: Boolean(item.hasAirConditioner),
      }
    })
  }

  // 2. 简易数组: ['东区1教-E1A106']
  if (Array.isArray(obj)) {
    return obj.map((r) => {
      if (typeof r === 'string') {
        return {
          roomName: r,
          capacity: 120,
          availableSections: [1, 2, 3, 4, 5, 6, 7, 8],
          hasAirConditioner: true,
        }
      }
      const item = r as Record<string, unknown>
      return {
        roomName: String(item.roomName || item.name || '未知教室'),
        capacity: Number(item.capacity || 0),
        availableSections: Array.isArray(item.availableSections)
          ? (item.availableSections as number[])
          : [],
        hasAirConditioner: Boolean(item.hasAirConditioner),
      }
    })
  }

  return []
}

export function ClassroomDomainSheet(): React.ReactElement {
  const [campus, setCampus] = React.useState<'chengdu' | 'yibin'>('chengdu')
  const [building, setBuilding] = React.useState<string>('') // 空串 = 全部教学楼（选中楼宇时由教务服务端按 jxlbh 权威筛选）
  const [timeSlotId, setTimeSlotId] = React.useState<string>('p12')
  const [acOnly, setAcOnly] = React.useState(false)
  // 动态楼宇清单：来自教务实时发现，优先于静态兜底清单
  const [dynamicBuildings, setDynamicBuildings] = React.useState<BuildingItem[]>([])

  const [loading, setLoading] = React.useState(true)
  const [result, setResult] = React.useState<CdutDomainToolResult | null>(null)

  const queryClassrooms = React.useCallback(async () => {
    setLoading(true)
    try {
      const selectedSlot = TIME_SLOTS.find((s) => s.id === timeSlotId)
      const res = await window.electronAPI.cdutZone.callDomainTool({
        domain: 'classrooms',
        params: {
          action: 'query_empty_classrooms',
          campus,
          building,
          timeSlots: selectedSlot?.sections,
        },
      })
      setResult(res)
      const buildings = normalizeBuildings(res?.json)
      if (buildings.length > 0) setDynamicBuildings(buildings)
    } catch (err) {
      setResult({
        success: false,
        markdown: `查询失败: ${err instanceof Error ? err.message : String(err)}`,
        json: null,
        isDemo: true,
      })
    } finally {
      setLoading(false)
    }
  }, [campus, building, timeSlotId])

  // 校区切换：回退全部教学楼并清空上一校区的动态楼宇清单，待新一轮查询刷新
  const handleCampusChange = (c: 'chengdu' | 'yibin') => {
    setCampus(c)
    setBuilding('')
    setDynamicBuildings([])
  }
  React.useEffect(() => {
    void queryClassrooms()
  }, [queryClassrooms])

  const classrooms = React.useMemo(() => {
    const list = normalizeClassrooms(result?.json)
    if (acOnly) return list.filter((r) => r.hasAirConditioner)
    return list
  }, [result?.json, acOnly])

  // 楼宇 chips 唯一来源：教务实时发现的动态清单。
  // 严禁回退到硬编码楼名（属演示假数据，且与真实教务楼宇口径不一致会导致筛选落空）。
  const buildingNames: string[] = dynamicBuildings.map((b) => b.name)

  return (
    <div className="flex h-full flex-col">
      {/* 顶部状态与刷新 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result?.isDemo ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <Sparkles className="size-3" />
              仿真演示数据
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              实时自习雷达
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void queryClassrooms()}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
          <span>查询空位</span>
        </button>
      </div>

      {/* 演示模式说明条 */}
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p>自习空教室处于演示模式（未真实登录校内统一身份认证），暂无法实时获取真实排课雷达数据。实际使用时连接个人真实账户即可正常查询。</p>
      </div>

      {/* 筛选控制器卡片 */}
      <div className="mb-4 space-y-3 rounded-xl border border-surface-border/60 bg-card p-3.5 shadow-xs">
        {/* 校区选择 */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">校区选择</span>
          <div className="flex rounded-lg bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={() => handleCampusChange('chengdu')}
              className={cn(
                'rounded-md px-3 py-1 text-xs transition-colors',
                campus === 'chengdu'
                  ? 'bg-card font-medium text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              成都校区
            </button>
            <button
              type="button"
              onClick={() => handleCampusChange('yibin')}
              className={cn(
                'rounded-md px-3 py-1 text-xs transition-colors',
                campus === 'yibin'
                  ? 'bg-card font-medium text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              宜宾校区
            </button>
          </div>
        </div>

        {/* 教学楼胶囊（首项为「全部」；楼名全部来自教务实时下发） */}
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">教学楼</span>
          <div className="flex flex-wrap gap-1.5">
            {['', ...buildingNames].map((b) => (
              <button
                key={b || 'all'}
                type="button"
                onClick={() => setBuilding(b)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs transition-colors',
                  building === b
                    ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {b || '全部教学楼'}
              </button>
            ))}
          </div>
          {buildingNames.length === 0 && (
            <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground/80">
              {loading ? '正在向教务拉取真实教学楼列表…' : '未获取到真实教学楼列表：请登录特区账户后重试（不提供任何虚构楼名）'}
            </p>
          )}
        </div>

        {/* 时段与空调 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-border/40 pt-2.5">
          <div className="flex flex-wrap items-center gap-1">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setTimeSlotId(slot.id)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[11px] transition-colors',
                  timeSlotId === slot.id
                    ? 'bg-secondary font-medium text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground select-none">
            <input
              type="checkbox"
              checked={acOnly}
              onChange={(e) => setAcOnly(e.target.checked)}
              className="size-3.5 rounded border-muted-foreground/30 accent-primary"
            />
            <Wind className="size-3 text-blue-500" />
            <span>仅看空调房</span>
          </label>
        </div>
      </div>

      {/* 匹配结果列表 */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>当前楼栋空闲教室</span>
        <span>匹配到 {classrooms.length} 间</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-xs">正在探测指定教学楼空闲状态...</p>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-surface-border/60 bg-muted/10 p-6 text-center text-muted-foreground">
            <Building2 className="size-8 opacity-30" />
            <p className="mt-2 text-xs">当前时段未探测到符合条件的空闲教室</p>
            <p className="mt-1 text-[11px] text-muted-foreground/75">
              建议切换其他节次或尝试周边邻近教学楼
            </p>
          </div>
        ) : (
          classrooms.map((room, idx) => (
            <div
              key={`${room.roomName}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-card p-3 shadow-xs transition hover:border-surface-border hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-semibold text-foreground">
                    {room.roomName}
                  </span>
                  {room.hasAirConditioner && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-600 dark:text-blue-400">
                      <Wind className="size-2.5" />
                      空调
                    </span>
                  )}
                </div>

                {room.availableSections.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>空闲节次：</span>
                    {room.availableSections.map((sec) => (
                      <span
                        key={sec}
                        className="rounded bg-muted/60 px-1 py-0.2 text-[10px] text-foreground"
                      >
                        第{sec}节
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 pl-3 text-right">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="size-3.5" />
                  <span className="text-sm font-bold text-foreground">
                    {room.capacity ? room.capacity : '—'}
                  </span>
                  <span className="text-[10px]">座</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">可自习</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
