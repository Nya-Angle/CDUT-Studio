/** 审核设置复用首次准备组件；只保存审核模型选择，不创建第二套渠道配置。 */
import { ReviewFirstUseReadiness } from '@/components/onboarding/ReviewFirstUseReadiness'

export function ReviewSettingsPanel({ onSaved }: { onSaved: () => void }): JSX.Element {
  return <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-8">
    <header className="mb-4">
      <h2 className="text-lg font-semibold">审核设置</h2>
      <p className="mt-1 text-sm text-muted-foreground">默认沿用应用已配置的模型渠道。只有需要为审核指定其他模型时，才在这里选择；渠道和密钥仍在应用模型设置中管理。</p>
    </header>
    <ReviewFirstUseReadiness onSaved={onSaved} />
  </div>
}
