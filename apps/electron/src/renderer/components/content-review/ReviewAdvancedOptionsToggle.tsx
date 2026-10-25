/**
 * 「显示高级审核选项」开关：仅在模板匹配页底部提供（唯一入口）。
 * 状态仍按 ReviewModuleSettingsV2.showAdvancedOptions 后台持久化；
 * 审核设置页不再重复放置该开关。
 *
 * 只控制显示，不取消任何后端校验；持久化复用 ReviewModuleSettingsV2.showAdvancedOptions
 * （默认 false，旧配置缺字段同样视为 false）。保存时保留现有审核模型选择，
 * 保存失败回滚开关并提示，不静默假装成功。
 */
import * as React from 'react'
import { atom, useAtomValue, useStore } from 'jotai'
import { toast } from 'sonner'
import { Switch } from '@profer/ui/primitives/switch'

/** 唯一共享状态：两个入口读写同一个 atom，不落地 localStorage。 */
export const reviewAdvancedOptionsAtom = atom(false)
const advancedHydrationAtom = atom<'idle' | 'loading' | 'ready'>('idle')
/** 用户本次会话已手动切换：后续异步读取不得覆盖刚点击的结果。 */
const advancedUserTouchedAtom = atom(false)

export interface AdvancedReviewOptionsState {
  show: boolean
  busy: boolean
  setShow: (next: boolean) => Promise<void>
}

export function useAdvancedReviewOptions(): AdvancedReviewOptionsState {
  const store = useStore()
  const show = useAtomValue(reviewAdvancedOptionsAtom)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    // 多入口同时挂载时只发起一次读取；读取结果不覆盖用户已点击的值。
    if (store.get(advancedHydrationAtom) !== 'idle') return
    store.set(advancedHydrationAtom, 'loading')
    void window.reviewAPI.getModuleSettingsV2()
      .then((settings) => {
        if (store.get(advancedUserTouchedAtom)) return
        store.set(reviewAdvancedOptionsAtom, settings?.showAdvancedOptions === true)
      })
      .catch(() => { /* 读取失败保持默认关闭，不阻塞页面 */ })
      .finally(() => { store.set(advancedHydrationAtom, 'ready') })
  }, [store])

  const setShow = React.useCallback(async (next: boolean): Promise<void> => {
    const previous = store.get(reviewAdvancedOptionsAtom)
    store.set(advancedUserTouchedAtom, true)
    store.set(reviewAdvancedOptionsAtom, next)
    setBusy(true)
    try {
      const current = await window.reviewAPI.getModuleSettingsV2()
      const saved = await window.reviewAPI.saveModuleSettingsV2({
        // 保留现有模型选择，只改显示开关
        agentModelSelection: current?.agentModelSelection ?? null,
        showAdvancedOptions: next,
      })
      if (typeof saved?.showAdvancedOptions !== 'boolean') {
        // 旧 Main 的 handler 会丢掉该字段：不能假装保存成功
        store.set(reviewAdvancedOptionsAtom, previous)
        toast.error('当前运行的审核设置尚未支持该选项（保存未生效）。请重启应用后再试。')
        return
      }
      store.set(reviewAdvancedOptionsAtom, saved.showAdvancedOptions === true)
      toast.success(next ? '已显示高级审核选项' : '已隐藏高级审核选项')
    } catch (error) {
      store.set(reviewAdvancedOptionsAtom, previous)
      toast.error(`保存高级选项失败，已恢复原状态：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setBusy(false)
    }
  }, [store])

  return { show, busy, setShow }
}

/** 模板匹配页底部开关；默认关闭，不要求任何确认声明。 */
export function ReviewAdvancedOptionsToggle({ className }: { className?: string }): React.ReactElement {
  const { show, busy, setShow } = useAdvancedReviewOptions()
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-1.5 ${className ?? ''}`}>
      <label htmlFor="review-advanced-options" className="cursor-pointer text-sm">高级选项</label>
      <Switch
        id="review-advanced-options"
        aria-label="高级选项"
        checked={show}
        disabled={busy}
        onCheckedChange={(checked) => void setShow(checked === true)}
      />
    </div>
  )
}
