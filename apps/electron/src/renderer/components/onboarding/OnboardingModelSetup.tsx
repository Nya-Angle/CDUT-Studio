/**
 * OnboardingModelSetup - 首次引导中的模型配置环节
 *
 * 直接复用「设置 → 模型配置」页（ChannelSettings），保证引导与实际配置体验一致，
 * 不再维护单独的临时表单。点击「完成并继续」前会确认已保存可用的模型。
 */

import * as React from 'react'
import { ChevronRight, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@profer/ui/primitives/button'
import { ChannelSettings } from '@/components/settings/ChannelSettings'

interface OnboardingModelSetupProps {
  /** 配置完成或跳过，进入诗意插页 */
  onDone: () => void
}

export function OnboardingModelSetup({ onDone }: OnboardingModelSetupProps): React.ReactElement {
  const [checking, setChecking] = React.useState(false)

  /** 离开前确认渠道已真正落盘，避免「填完表单但没点创建」被静默跳过 */
  const handleContinue = async (): Promise<void> => {
    setChecking(true)
    try {
      const channels = await window.electronAPI.listChannels()
      const hasUsableModel = channels.some(
        (channel) => channel.enabled && channel.models.some((model) => model.enabled),
      )
      if (!hasUsableModel) {
        toast.warning('尚未保存可用的模型：请填写渠道信息并点击表单右上角「创建」，或直接跳过')
        return
      }
      onDone()
    } catch {
      // 读取失败时放行，避免用户被卡在引导里
      onDone()
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex w-full max-w-4xl min-h-0 flex-1 flex-col animate-in fade-in-0 duration-500">
      <div className="mb-5 shrink-0 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>最后一步 · 配置模型</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          配置你的第一个模型
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          与「设置 → 模型配置」使用同一套界面；填写后点右上角「创建」保存，稍后也可随时回来修改
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md scrollbar-thin sm:p-6">
        <ChannelSettings />
      </div>

      <div className="mt-5 flex shrink-0 flex-col items-center gap-2">
        <Button
          className="h-11 w-full max-w-sm gap-1.5 text-sm font-semibold"
          disabled={checking}
          onClick={handleContinue}
        >
          {checking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>正在确认…</span>
            </>
          ) : (
            <>
              <span>完成并继续</span>
              <ChevronRight className="size-4" />
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full max-w-sm text-xs text-muted-foreground hover:text-foreground"
          disabled={checking}
          onClick={onDone}
        >
          稍后配置（跳过）
        </Button>
      </div>
    </div>
  )
}
