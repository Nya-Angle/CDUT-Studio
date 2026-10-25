/**
 * CdutQuickBar — CDUT 专区底部 4 大高频场景横向胶囊按钮条
 *
 * 严格采用「左图标 + 右标题文字」格式，彻底移除原有长句描述，
 * 采用现代微质感胶囊按钮，横向居中排列，点击触发顶层抽屉卡片。
 */

import * as React from 'react'
import {
  Building2,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

/** 高频场景描述符（供按钮条与顶部抽屉卡片共用） */
export interface CdutQuickFeature {
  id: string
  icon: LucideIcon
  title: string
  desc: string
}

/** 4 大高频场景清单 */
export const CDUT_QUICK_FEATURES: CdutQuickFeature[] = [
  {
    id: 'today-schedule',
    icon: CalendarDays,
    title: '今日课表',
    desc: '查看今日课程、节次、教室与任课教师安排。',
  },
  {
    id: 'grade-gpa',
    icon: GraduationCap,
    title: '成绩与 GPA',
    desc: '历学期成绩单透视、学分与绩点加权分析。',
  },
  {
    id: 'empty-classroom',
    icon: Building2,
    title: '自习空教室',
    desc: '成都/宜宾校区按教学楼与节次检索空闲自习室。',
  },
  {
    id: 'final-exam',
    icon: ClipboardList,
    title: '期末考场',
    desc: '期末考试时间、考场教室、座位号与准考证号。',
  },
]

interface CdutQuickBarProps {
  onSelect: (feature: CdutQuickFeature) => void
}

export function CdutQuickBar({ onSelect }: CdutQuickBarProps): React.ReactElement {
  return (
    <div data-tour="cdut-quickbar" className="flex flex-wrap items-center justify-center gap-3">
      {CDUT_QUICK_FEATURES.map((feature) => (
        <button
          key={feature.id}
          data-tour-quick-feature={feature.id}
          type="button"
          onClick={() => onSelect(feature)}
          className="flex items-center gap-2 rounded-full border border-surface-border/80 bg-card/80 px-4 py-2 text-xs font-medium shadow-sm transition-all hover:bg-primary/10 hover:text-primary"
        >
          <feature.icon size={15} />
          <span>{feature.title}</span>
        </button>
      ))}
    </div>
  )
}
