/**
 * CsLabPreparationView — CDUT Science 实验室选择页
 *
 * 数据 100% 来自主进程真实沙箱（lab.manifest.json），不再使用任何硬编码实验室。
 * 视觉遵循暖调编辑式极简（羊皮纸底、赤陶强调、发丝细边框、克制的阴影）。
 */

import * as React from 'react'
import { useSetAtom } from 'jotai'
import { ArrowUpRight, Loader2, Lock, Plus, Search, Sparkles, X } from 'lucide-react'
import type { CsLabLab } from '@profer/shared'
import { detectIsMac, detectIsWindows } from '@profer/ui'
import { cn } from '@/lib/utils'
import { resolveWindowControlsRightInset } from '@/lib/window-controls-layout'
import { activeViewAtom } from '@/atoms/active-view'
import {
  cslabActiveLabIdAtom,
  cslabAssetsAtom,
  cslabAuthAtom,
  cslabSnapshotAtom,
} from '@/atoms/cslab-atoms'
import { CsLabCreateLabDialog } from './CsLabCreateLabDialog'

const STATUS_STYLES: Record<CsLabLab['status'], { dot: string; text: string }> = {
  运行中: { dot: 'bg-[#6E8B6A]', text: 'text-[#5C7358]' },
  调试中: { dot: 'bg-cslab-accent', text: 'text-cslab-accent' },
  筹建中: { dot: 'bg-cslab-muted/60', text: 'text-cslab-muted' },
}

export function CsLabPreparationView(): React.ReactElement {
  const setActiveView = useSetAtom(activeViewAtom)
  const setAuth = useSetAtom(cslabAuthAtom)
  const setActiveLabId = useSetAtom(cslabActiveLabIdAtom)
  const setSnapshot = useSetAtom(cslabSnapshotAtom)
  const setAssets = useSetAtom(cslabAssetsAtom)
  const isWindows = React.useMemo(() => detectIsWindows(), [])
  const isMac = React.useMemo(() => detectIsMac(), [])

  const [labs, setLabs] = React.useState<CsLabLab[]>([])
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [openingId, setOpeningId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [demoLoading, setDemoLoading] = React.useState(false)

  const refresh = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      setLabs(await window.electronAPI.cslab.listLabs())
    } catch (err) {
      setError(err instanceof Error ? err.message : '实验室列表读取失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const filteredLabs = React.useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return labs
    return labs.filter((lab) =>
      [lab.name, lab.code, lab.description, ...lab.tags].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [labs, query])

  const handleOpen = async (lab: CsLabLab): Promise<void> => {
    if (openingId) return
    setOpeningId(lab.id)
    setError(null)
    try {
      const snapshot = await window.electronAPI.cslab.openLab(lab.id)
      const assets = await window.electronAPI.cslab.listAssets(lab.id)
      setSnapshot(snapshot)
      setAssets(assets)
      setActiveLabId(lab.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : '实验室打开失败')
    } finally {
      setOpeningId(null)
    }
  }

  const handleCreated = async (lab: CsLabLab): Promise<void> => {
    await refresh()
    await handleOpen(lab)
  }

  const handleCreateDemo = async (): Promise<void> => {
    if (demoLoading) return
    setDemoLoading(true)
    setError(null)
    try {
      const result = await window.electronAPI.cslab.createDemoLab()
      await handleCreated(result.lab)
    } catch (err) {
      setError(err instanceof Error ? err.message : '演示实验室创建失败')
    } finally {
      setDemoLoading(false)
    }
  }

  // 锁定必须同时清空主进程内存会话，否则再次进入会被自动放行
  const handleLock = async (): Promise<void> => {
    try {
      await window.electronAPI.cslab.lockSession()
    } catch {
      // 主进程不可用时仍锁定本地视图，避免停留在业务界面
    } finally {
      setAuth({ isInitialized: true, isVerified: false, hydrated: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header
        className="relative z-20 flex h-14 shrink-0 items-center justify-between"
        style={{
          paddingLeft: isMac ? 96 : 32,
          paddingRight: isWindows ? resolveWindowControlsRightInset(true) + 12 : 32,
        }}
      >
        <div
          className="titlebar-drag-region absolute inset-y-0 left-0"
          style={{ right: isWindows ? resolveWindowControlsRightInset(true) : 0 }}
          aria-hidden="true"
        />
        <span className="pointer-events-none relative text-[10px] font-medium uppercase tracking-[0.28em] text-cslab-muted">
          CSLab · Preparation
        </span>
        <div className="titlebar-no-drag relative flex items-center gap-1">
          <button
            type="button"
            onClick={() => void handleLock()}
            title="重新锁定实验室"
            aria-label="重新锁定实验室"
            className="rounded-lg p-2 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            <Lock size={14} />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('conversations')}
            className="rounded-lg px-3 py-1.5 text-xs text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
          >
            退出
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 pb-16 pt-6 sm:px-10 sm:pt-10">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="font-serif text-5xl font-medium tracking-tight text-cslab-text sm:text-6xl">
              CDUT Science
            </h1>
            <p className="mt-3 font-serif text-lg text-cslab-muted sm:text-xl">
              课题级科研工作台
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-cslab-muted">
              每个实验室是一个独立沙箱：仪器原始数据只读入笼、论文数据胶囊与底层数据双向联动、
              Word 文稿无损同步。选择一间实验室，或新建你的第一个课题。
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-cslab-border bg-cslab-elevated px-4 py-3 shadow-subtle transition-shadow focus-within:border-cslab-accent/40">
            <Search size={16} className="shrink-0 text-cslab-muted" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索实验室、编号或研究方向…"
              aria-label="搜索实验室"
              className="w-full bg-transparent text-sm text-cslab-text placeholder:text-cslab-muted/70 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="清空搜索"
                className="shrink-0 rounded-full p-1 text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="mt-7 flex items-baseline justify-between border-b border-cslab-border/70 pb-2.5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-cslab-muted">
              全部实验室
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] tabular-nums text-cslab-muted">
                {filteredLabs.length} 间
              </span>
              <button
                type="button"
                onClick={() => void handleCreateDemo()}
                disabled={demoLoading || !!openingId}
                className="inline-flex items-center gap-1 rounded-full border border-cslab-border px-2.5 py-1 text-[11px] font-medium text-cslab-muted transition-colors hover:border-cslab-accent/40 hover:text-cslab-accent disabled:cursor-wait disabled:opacity-60"
              >
                {demoLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                演示实验室
              </button>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-cslab-accent px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-cslab-accentHover"
              >
                <Plus size={12} />
                新建
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-xs text-cslab-muted">
              <Loader2 size={14} className="animate-spin" />
              正在读取实验室沙箱…
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-cslab-border px-6 py-12 text-center">
              <p className="font-serif text-base text-cslab-text">
                {labs.length === 0 ? '还没有实验室' : '没有找到匹配的实验室'}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-cslab-muted">
                {labs.length === 0
                  ? '新建一间实验室，开始建立你的数据铁笼与活体论文。'
                  : '尝试更换关键词，或清空搜索查看全部实验室。'}
              </p>
              {labs.length === 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cslab-accent px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cslab-accentHover"
                  >
                    <Plus size={13} />
                    新建实验室
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCreateDemo()}
                    disabled={demoLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cslab-border px-3.5 py-1.5 text-xs font-medium text-cslab-muted transition-colors hover:border-cslab-accent/40 hover:text-cslab-accent disabled:opacity-60"
                  >
                    {demoLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    一键创建演示实验室
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {filteredLabs.map((lab) => {
                const status = STATUS_STYLES[lab.status]
                const opening = openingId === lab.id
                return (
                  <li key={lab.id}>
                    <button
                      type="button"
                      disabled={!!openingId}
                      onClick={() => void handleOpen(lab)}
                      className="group w-full rounded-xl border border-cslab-border bg-cslab-bg px-5 py-4 text-left transition-all duration-200 hover:border-cslab-accent/40 hover:bg-cslab-surface disabled:cursor-wait"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h3 className="font-serif text-[17px] font-medium tracking-tight text-cslab-text transition-colors group-hover:text-cslab-accent">
                              {lab.name}
                            </h3>
                            <span className="text-[10px] uppercase tracking-[0.12em] text-cslab-muted">
                              {lab.code}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-1 text-[13px] leading-relaxed text-cslab-muted">
                            {lab.description}
                          </p>
                        </div>
                        {opening ? (
                          <Loader2 size={15} className="mt-1 shrink-0 animate-spin text-cslab-accent" />
                        ) : (
                          <ArrowUpRight
                            size={15}
                            className="mt-1 shrink-0 text-cslab-border transition-colors group-hover:text-cslab-accent"
                          />
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        {lab.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-cslab-border px-2 py-0.5 text-[11px] text-cslab-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-cslab-muted">
                          <span className={cn('size-1.5 rounded-full', status.dot)} />
                          <span className={status.text}>{lab.status}</span>
                          <span className="text-cslab-border">·</span>
                          <span className="tabular-nums">{lab.members} 名研究员</span>
                        </span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="mt-10 text-center text-[11px] leading-relaxed text-cslab-muted">
            实验室沙箱默认位于 ~/.cdutai/cslab-workspaces/ · 数据仅保存在本机
          </p>
        </div>
      </div>

      <CsLabCreateLabDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(lab) => void handleCreated(lab)}
      />
    </div>
  )
}
