/**
 * OnboardingModelSetup - 首次引导中的模型配置卡片
 *
 * 预置主流厂商快捷选项，填入 API Key 后可直接测试连通性、保存并设为全局默认；
 * 也可随时跳过，稍后在「设置 → 模型渠道」中补配。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Cpu,
  Eye,
  EyeOff,
  Loader2,
  Moon,
  Plug,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@profer/ui/primitives/button'
import { Input } from '@profer/ui/primitives/input'
import { PROVIDER_DEFAULT_URLS } from '@profer/shared'
import type { ProviderType } from '@profer/shared'
import { cn } from '@/lib/utils'
import { channelsAtom, channelsLoadedAtom, selectedModelAtom } from '@/atoms/conversation-atoms'
import {
  agentChannelIdAtom,
  agentChannelIdsAtom,
  agentModelIdAtom,
} from '@/atoms/agent-atoms'

interface ProviderPreset {
  key: string
  label: string
  provider: ProviderType
  baseUrl: string
  models: string[]
  description: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    key: 'deepseek',
    label: 'DeepSeek 官方',
    provider: 'deepseek',
    baseUrl: PROVIDER_DEFAULT_URLS.deepseek,
    models: ['deepseek-chat', 'deepseek-reasoner'],
    description: '国内直连 · 推荐',
    icon: Sparkles,
    accent: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    key: 'openai',
    label: 'OpenAI',
    provider: 'openai',
    baseUrl: PROVIDER_DEFAULT_URLS.openai,
    models: ['gpt-4o-mini', 'gpt-4o'],
    description: '全球通用',
    icon: Bot,
    accent: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'zhipu',
    label: '智谱 GLM',
    provider: 'zhipu',
    baseUrl: PROVIDER_DEFAULT_URLS.zhipu,
    models: ['glm-4-flash', 'glm-4-plus'],
    description: '国内直连',
    icon: Cpu,
    accent: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  },
  {
    key: 'qwen',
    label: '通义千问',
    provider: 'qwen',
    baseUrl: PROVIDER_DEFAULT_URLS.qwen,
    models: ['qwen-plus', 'qwen-max'],
    description: '阿里云百炼',
    icon: Cloud,
    accent: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  },
  {
    key: 'kimi-api',
    label: '月之暗面 Kimi',
    provider: 'kimi-api',
    baseUrl: PROVIDER_DEFAULT_URLS['kimi-api'],
    models: ['moonshot-v1-8k'],
    description: '长上下文',
    icon: Moon,
    accent: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
  },
  {
    key: 'custom',
    label: '自定义 OpenAI 兼容',
    provider: 'custom',
    baseUrl: '',
    models: [],
    description: 'OpenAI 兼容',
    icon: Plug,
    accent: 'bg-primary/10 text-primary',
  },
]

type Status = 'idle' | 'testing' | 'saving' | 'success' | 'error'

interface OnboardingModelSetupProps {
  /** 配置成功或用户点击跳过后进入诗意插页 */
  onDone: () => void
}

export function OnboardingModelSetup({ onDone }: OnboardingModelSetupProps): React.ReactElement {
  const setChannels = useSetAtom(channelsAtom)
  const setChannelsLoaded = useSetAtom(channelsLoadedAtom)
  const setSelectedModel = useSetAtom(selectedModelAtom)
  const setAgentChannelId = useSetAtom(agentChannelIdAtom)
  const setAgentModelId = useSetAtom(agentModelIdAtom)
  const setAgentChannelIds = useSetAtom(agentChannelIdsAtom)

  const [providerKey, setProviderKey] = React.useState('deepseek')
  const [apiKey, setApiKey] = React.useState('')
  const [baseUrl, setBaseUrl] = React.useState(PROVIDER_DEFAULT_URLS.deepseek)
  const [modelId, setModelId] = React.useState('deepseek-chat')
  const [showKey, setShowKey] = React.useState(false)
  const [status, setStatus] = React.useState<Status>('idle')
  const [message, setMessage] = React.useState('')

  const preset = PROVIDER_PRESETS.find((item) => item.key === providerKey) ?? PROVIDER_PRESETS[0]!
  const busy = status === 'testing' || status === 'saving'
  const locked = busy || status === 'success'

  const resetFeedback = () => {
    if (status === 'error' || status === 'idle') {
      setStatus('idle')
      setMessage('')
    }
  }

  const handleSelectProvider = (next: ProviderPreset) => {
    if (locked) return
    setProviderKey(next.key)
    setBaseUrl(next.baseUrl)
    setModelId(next.models[0] ?? '')
    resetFeedback()
  }

  const handleSave = async () => {
    const trimmedKey = apiKey.trim()
    const effectiveBaseUrl = preset.key === 'custom' ? baseUrl.trim() : preset.baseUrl
    const trimmedModelId = modelId.trim()

    if (!trimmedKey) {
      setStatus('error')
      setMessage('请先填写 API Key')
      toast.error('请先填写 API Key')
      return
    }
    if (!effectiveBaseUrl) {
      setStatus('error')
      setMessage('请填写 Base URL')
      toast.error('请填写 Base URL')
      return
    }
    if (!trimmedModelId) {
      setStatus('error')
      setMessage('请填写或选择模型 ID')
      toast.error('请填写或选择模型 ID')
      return
    }

    setStatus('testing')
    setMessage('')
    try {
      const testResult = await window.electronAPI.testChannelDirect({
        provider: preset.provider,
        baseUrl: effectiveBaseUrl,
        apiKey: trimmedKey,
      })
      if (!testResult.success) {
        const reason = testResult.message || '连通性测试失败'
        setStatus('error')
        setMessage(reason)
        toast.error(`连通性测试失败：${reason}`)
        return
      }

      setStatus('saving')
      const candidateModels =
        preset.key === 'custom'
          ? [{ id: trimmedModelId, name: trimmedModelId, enabled: true }]
          : preset.models.map((id) => ({ id, name: id, enabled: true }))

      const channel = await window.electronAPI.createChannel({
        name: preset.label,
        provider: preset.provider,
        baseUrl: effectiveBaseUrl,
        apiKey: trimmedKey,
        models: candidateModels,
        enabled: true,
      })

      await window.electronAPI
        .updateSettings({
          agentChannelId: channel.id,
          agentModelId: trimmedModelId,
          agentChannelIds: [channel.id],
        })
        .catch(console.error)

      const fresh = await window.electronAPI.listChannels().catch(() => [channel])
      setChannels(fresh)
      setChannelsLoaded(true)
      setAgentChannelId(channel.id)
      setAgentModelId(trimmedModelId)
      setAgentChannelIds([channel.id])
      setSelectedModel({ channelId: channel.id, modelId: trimmedModelId })

      setStatus('success')
      setMessage('连通性验证通过，已设为默认模型')
      toast.success('模型配置完成，已设为默认')
    } catch (error) {
      const reason = error instanceof Error ? error.message : '保存模型配置失败'
      setStatus('error')
      setMessage(reason)
      toast.error(reason)
    }
  }

  return (
    <div className="flex w-full max-w-4xl flex-col items-center animate-in fade-in-0 duration-500">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>最后一步 · 配置模型</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          配置你的第一个模型
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          选择常用厂商并填入 API Key 即可开始使用；稍后也可在「设置 → 模型渠道」中修改
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-3">
        {PROVIDER_PRESETS.map((item) => {
          const Icon = item.icon
          const selected = item.key === providerKey
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={selected}
              disabled={locked}
              onClick={() => handleSelectProvider(item)}
              className={cn(
                'group flex items-start gap-3 rounded-xl border p-3 text-left backdrop-blur-md transition-all',
                selected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : 'border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card/90',
                locked && !selected && 'opacity-60',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg',
                  item.accent,
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 w-full rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              接口端点（Base URL）
            </label>
            <Input
              value={baseUrl}
              readOnly={preset.key !== 'custom'}
              disabled={locked}
              placeholder="https://your-endpoint/v1"
              onChange={(event) => {
                setBaseUrl(event.target.value)
                resetFeedback()
              }}
              className="font-mono text-xs"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              API Key
            </label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                disabled={locked}
                placeholder="粘贴你的 API Key"
                autoComplete="off"
                onChange={(event) => {
                  setApiKey(event.target.value)
                  resetFeedback()
                }}
                className="pr-9 font-mono text-xs"
              />
              <button
                type="button"
                aria-label={showKey ? '隐藏 API Key' : '显示 API Key'}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowKey((value) => !value)}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            默认模型
          </label>
          {preset.key === 'custom' ? (
            <Input
              value={modelId}
              disabled={locked}
              placeholder="例如 gpt-4o-mini"
              onChange={(event) => {
                setModelId(event.target.value)
                resetFeedback()
              }}
              className="font-mono text-xs"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {preset.models.map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={locked}
                  onClick={() => {
                    setModelId(id)
                    resetFeedback()
                  }}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors',
                    id === modelId
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                    locked && id !== modelId && 'opacity-60',
                  )}
                >
                  {id}
                </button>
              ))}
            </div>
          )}
        </div>

        {status !== 'idle' && message && (
          <div
            className={cn(
              'mt-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
              status === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : status === 'error'
                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                  : 'border-border/60 bg-muted/30 text-muted-foreground',
            )}
          >
            {status === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : status === 'error' ? (
              <XCircle className="mt-0.5 size-4 shrink-0" />
            ) : (
              <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            className="gap-1.5"
            disabled={busy || status === 'success'}
            onClick={handleSave}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{status === 'testing' ? '正在测试连通性…' : '正在保存…'}</span>
              </>
            ) : (
              <span>{status === 'error' ? '重试' : '测试并保存'}</span>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-2">
        <Button
          className="h-11 w-full gap-1.5 text-sm font-semibold"
          disabled={status !== 'success'}
          onClick={onDone}
        >
          <span>完成并继续</span>
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          className="w-full text-xs text-muted-foreground hover:text-foreground"
          onClick={onDone}
        >
          稍后配置（跳过）
        </Button>
      </div>
    </div>
  )
}
