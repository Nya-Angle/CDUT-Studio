/** F01 首次审核准备：复用全局渠道与 Main 审核端口，不创建新配置权威。 */
import * as React from 'react'
import type { Channel, ReviewModelGatewayStatus } from '@profer/shared'
import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import {
  eligibleReviewChannels, interpretReviewTextProbe, isReviewSelectionAvailable,
  selectionKey, type ReviewModelSelection, type ReviewTextProbe,
} from './review-first-use-readiness'

interface Props {
  onSaved?: () => void
  onConfigureChannels?: () => void
}
type ProbeState = ReviewTextProbe | { status: 'running' }

export function ReviewFirstUseReadiness({ onSaved, onConfigureChannels }: Props): React.ReactElement {
  const [channels, setChannels] = React.useState<Channel[]>([])
  const [selection, setSelection] = React.useState<ReviewModelSelection>(null)
  const [savedSelection, setSavedSelection] = React.useState<ReviewModelSelection>(null)
  const [gateway, setGateway] = React.useState<ReviewModelGatewayStatus | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [probe, setProbe] = React.useState<ProbeState | null>(null)
  const probeGeneration = React.useRef(0)

  const reload = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    probeGeneration.current += 1
    setProbe(null)
    try {
      const [newChannels, settings, status] = await Promise.all([
        window.electronAPI.listChannels(), window.reviewAPI.getModuleSettingsV2(), window.reviewAPI.getModelGatewayStatus(),
      ])
      setChannels(newChannels)
      setSelection(settings.agentModelSelection)
      setSavedSelection(settings.agentModelSelection)
      setGateway(status)
    } catch (cause) {
      setError(`读取已有配置失败：${cause instanceof Error ? cause.message : String(cause)}`)
    } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { void reload() }, [reload])
  const options = React.useMemo(() => eligibleReviewChannels(channels), [channels])
  const dirty = selectionKey(selection) !== selectionKey(savedSelection)
  const selectedAvailable = isReviewSelectionAvailable(channels, selection)
  const savedAvailable = isReviewSelectionAvailable(channels, savedSelection)

  const save = async (): Promise<void> => {
    if (!selectedAvailable) return
    setSaving(true)
    setError(null)
    probeGeneration.current += 1
    setProbe(null)
    try {
      const result = await window.reviewAPI.saveModuleSettingsV2({ agentModelSelection: selection })
      setSelection(result.agentModelSelection)
      setSavedSelection(result.agentModelSelection)
      setGateway(await window.reviewAPI.getModelGatewayStatus())
      onSaved?.()
    } catch (cause) {
      setError(`保存审核模型失败：${cause instanceof Error ? cause.message : String(cause)}`)
    } finally { setSaving(false) }
  }

  const testTextAndJson = async (): Promise<void> => {
    if (dirty || !savedAvailable || !gateway?.available || saving) return
    const generation = ++probeGeneration.current
    const route = gateway
    setProbe({ status: 'running' })
    setError(null)
    try {
      // 真实审核模型请求，由 Main 保管密钥。没有案卷写入或正式规则发布。
      const result = await window.reviewAPI.requestT01ModelDraft({
        system: '这是用户主动发起的连接自检。只输出严格 JSON：{"ready":"CDUT_REVIEW_PROBE"}。禁止 Markdown 和额外文字。',
        user: '请严格返回系统指示的 JSON 自检对象，不引用真实政策或材料。',
      })
      if (generation === probeGeneration.current) setProbe(interpretReviewTextProbe(result, route))
    } catch (cause) {
      if (generation === probeGeneration.current) {
        setProbe({ status: 'failed', reason: cause instanceof Error ? cause.message : String(cause) })
      }
    }
  }

  return (
    <section aria-label="审核首次使用准备" className="mx-auto w-full max-w-2xl space-y-4 rounded-2xl bg-card/85 p-5 shadow-lg ring-1 ring-border/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">材料审核 · 模型准备</h3>
          <p className="mt-1 text-sm text-muted-foreground">沿用应用已有渠道和密钥。这里只选择审核出口，不创建第二套配置。</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => void reload()} disabled={loading || saving || probe?.status === 'running'}>
          <RefreshCw size={14} className={loading ? 'mr-1 animate-spin' : 'mr-1'} /> 刷新
        </Button>
      </div>

      <div className="space-y-2">
        <label htmlFor="review-first-use-model" className="text-sm font-medium">审核使用的模型</label>
        <select
          id="review-first-use-model" value={selectionKey(selection)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          disabled={loading || saving || probe?.status === 'running'}
          onChange={(event) => {
            const found = options.flatMap((channel) => channel.models.filter((model) => model.enabled !== false)
              .map((model) => ({ channelId: channel.id, modelId: model.id })))
              .find((item) => selectionKey(item) === event.target.value)
            setSelection(found ?? null)
            probeGeneration.current += 1
            setProbe(null)
          }}
        >
          <option value="">自动使用第一个已启用的兼容渠道</option>
          {!selectedAvailable && selection && <option value={selectionKey(selection)}>先前选择已禁用或删除，必须重新选择</option>}
          {options.map((channel) => <optgroup key={channel.id} label={channel.name}>
            {channel.models.filter((model) => model.enabled !== false).map((model) =>
              <option key={`${channel.id}/${model.id}`} value={selectionKey({ channelId: channel.id, modelId: model.id })}>{model.name || model.id}</option>)}
          </optgroup>)}
        </select>
        <p className="text-xs leading-5 text-muted-foreground">默认模式取兼容渠道的第一项，不一定等于普通 Agent 的首选模型。所选渠道失效后不会自动切换外部服务。</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" disabled={loading || saving || !dirty || !selectedAvailable} onClick={() => void save()}>{saving ? '保存中…' : '保存审核模型'}</Button>
          {onConfigureChannels && <Button type="button" size="sm" variant="outline" onClick={onConfigureChannels}>打开现有模型配置</Button>}
        </div>
      </div>

      <div className="rounded-xl bg-muted/45 px-4 py-3 text-sm" aria-live="polite">
        <div className="flex items-center gap-2 font-medium">
          {gateway?.available && !dirty && savedAvailable ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-amber-600" />}
          {loading ? '正在读取配置' : gateway?.available && !dirty && savedAvailable ? '配置检查：存在可用出口' : '配置尚未就绪'}
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {dirty ? '请先保存所选模型，再检查实际出口。' : !savedAvailable ? '当前保存的审核模型已不可用，请重新选择。'
            : gateway?.available ? `${gateway.channelName ?? '未知渠道'} · ${gateway.modelId ?? '尚未确定模型'} · ${gateway.protocol}（仅配置检查）`
              : gateway?.reason ?? '尚未取得出口状态。'}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" size="sm" variant="outline" disabled={loading || saving || dirty || !savedAvailable || !gateway?.available || probe?.status === 'running'} onClick={() => void testTextAndJson()}>
            {probe?.status === 'running' && <LoaderCircle className="mr-1 animate-spin" size={14} />}
            {probe?.status === 'running' ? '正在请求模型…' : '实测文本与 JSON 响应'}
          </Button>
          <span className="text-xs text-muted-foreground">会产生一次真实模型请求及可能的费用</span>
        </div>
        {probe?.status === 'passed' && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
          请求成功，JSON 校验通过 · {probe.channelName} / {probe.modelId}。{probe.identityConfirmed ? '模型标识与配置吻合。' : '回传型号与配置不一致，具体型号尚未核实。'}
        </p>}
        {probe?.status === 'failed' && <p role="alert" className="mt-2 text-xs text-destructive">自检未通过：{probe.reason}。请检查渠道、配额和网络后重试。</p>}
        <p className="mt-2 text-xs text-muted-foreground">图片识别、工具调用、严格结构化输出、OCR/Office 随包能力：尚未检测，不能由本次 JSON 响应推定支持。</p>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <p className="text-xs leading-5 text-muted-foreground">六类内置业务示例是模拟材料，不是学校正式制度。无模型时可配置模板和登记材料，依赖模型的步骤仍须标为未执行。</p>
    </section>
  )
}
