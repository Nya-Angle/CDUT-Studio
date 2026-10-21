/** 审核设置复用首次准备组件；其在工作台中的入口由共享导航 Owner 接入。 */
import { ReviewFirstUseReadiness } from '@/components/onboarding/ReviewFirstUseReadiness'

export function ReviewSettingsPanel({ onSaved }: { onSaved: () => void }): JSX.Element {
  return <div className="mx-auto w-full max-w-3xl px-4 pb-8"><ReviewFirstUseReadiness onSaved={onSaved} /></div>
}
