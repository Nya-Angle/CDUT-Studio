/**
 * coach-tour-atoms — 界面蒙层引导（CoachTour）触发状态
 *
 * 顶栏右上角「界面引导」按钮将 coachTourOpenAtom 置为 true，
 * App 顶层渲染 CoachTourOverlay；完成或跳过（Esc）后重置为 false。
 *
 * 纯会话内状态，不写持久化；「首次进入后自动接力播放」需要
 * settings 持久化字段，另行接入。
 */
import { atom } from 'jotai'

/** 是否展示界面蒙层引导 */
export const coachTourOpenAtom = atom(false)

/** 当前引导步骤的 Key（无引导时为 null） */
export const coachTourCurrentStepKeyAtom = atom<string | null>(null)
