/**
 * CsLabPreparationView — CDUT Science 实验室选择页
 *
 * 数据 100% 来自主进程真实沙箱（lab.manifest.json），不再使用任何硬编码实验室。
 * 视觉遵循暖调编辑式极简（羊皮纸底、赤陶强调、发丝细边框、克制的阴影）。
 */

import * as React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  Loader2,
  Lock,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { matchLabFuzzy, type CsLabLab } from '@profer/shared'
import { detectIsMac, detectIsWindows } from '@profer/ui'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@profer/ui/primitives/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@profer/ui/primitives/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@profer/ui/primitives/alert-dialog'
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
import { CsLabRenameLabDialog } from './CsLabRenameLabDialog'
import { CsLabDeleteLabDialog } from './CsLabDeleteLabDialog'

const STATUS_STYLES: Record<CsLabLab['status'], { dot: string; text: string }> = {
  运行中: { dot: 'bg-[#6E8B6A]', text: 'text-[#5C7358]' },
  调试中: { dot: 'bg-cslab-accent', text: 'text-cslab-accent' },
  筹建中: { dot: 'bg-cslab-muted/60', text: 'text-cslab-muted' },
  已归档: { dot: 'bg-cslab-muted/40', text: 'text-cslab-muted' },
}

type LabFilter = 'all' | 'active' | 'archived'

const FILTER_LABELS: Record<LabFilter, string> = {
  all: '全部',
  active: '进行中',
  archived: '已归档',
}

/** 置顶优先（最近置顶在前），其余按 updatedAt 倒序。 */
function sortLabs(list: CsLabLab[]): CsLabLab[] {
  return [...list].sort((a, b) => {
    const pinnedDelta = Number(!!b.pinned) - Number(!!a.pinned)
    if (pinnedDelta !== 0) return pinnedDelta
    if (a.pinned && b.pinned) return (b.pinnedAt ?? 0) - (a.pinnedAt ?? 0)
    return b.updatedAt - a.updatedAt
  })
}

export function CsLabPreparationView(): React.ReactElement {
  const setActiveView = useSetAtom(activeViewAtom)
  const setAuth = useSetAtom(cslabAuthAtom)
  const activeLabId = useAtomValue(cslabActiveLabIdAtom)
  const setActiveLabId = useSetAtom(cslabActiveLabIdAtom)
  const setSnapshot = useSetAtom(cslabSnapshotAtom)
  const setAssets = useSetAtom(cslabAssetsAtom)
  const isWindows = React.useMemo(() => detectIsWindows(), [])
  const isMac = React.useMemo(() => detectIsMac(), [])

  const [labs, setLabs] = React.useState<CsLabLab[]>([])
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState<LabFilter>('all')
  const [loading, setLoading] = React.useState(true)
  const [openingId, setOpeningId] = React.useState<string | null>(null)
  const [actionBusyId, setActionBusyId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [renameTarget, setRenameTarget] = React.useState<CsLabLab | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<CsLabLab | null>(null)
  const [resetTarget, setResetTarget] = React.useState<CsLabLab | null>(null)
  const [resetting, setResetting] = React.useState(false)

  const refresh = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      setLabs(sortLabs(await window.electronAPI.cslab.listLabs()))
    } catch (err) {
      setError(err instanceof Error ? err.message : '实验室列表读取失败')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const counts = React.useMemo(
    () => ({
      all: labs.length,
      active: labs.filter((lab) => !lab.archived).length,
      archived: labs.filter((lab) => !!lab.archived).length,
    }),
    [labs],
  )

  const filteredLabs = React.useMemo(() => {
    const scoped = labs.filter((lab) => {
      if (filter === 'active') return !lab.archived
      if (filter === 'archived') return !!lab.archived
      return true
    })
    const keyword = query.trim()
    if (!keyword) return scoped
    return scoped
      .map((lab) => ({ lab, match: matchLabFuzzy(lab, keyword) }))
      .filter((entry) => entry.match.matched)
      .sort(
        (a, b) =>
          b.match.score - a.match.score ||
          Number(!!b.lab.pinned) - Number(!!a.lab.pinned) ||
          b.lab.updatedAt - a.lab.updatedAt,
      )
      .map((entry) => entry.lab)
  }, [filter, labs, query])

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

  const handleResetDemo = async (): Promise<void> => {
    if (!resetTarget || resetting) return
    setResetting(true)
    setError(null)
    try {
      const result = await window.electronAPI.cslab.resetDemoLab(resetTarget.id)
      setResetTarget(null)
      await refresh()
      if (activeLabId === resetTarget.id) {
        setActiveLabId(null)
        setSnapshot(null)
        setAssets([])
      }
      setLabs((previous) => sortLabs([...previous.filter((lab) => lab.id !== result.lab.id), result.lab]))
    } catch (err) {
      setError(err instanceof Error ? err.message : '演示数据恢复失败')
    } finally {
      setResetting(false)
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

  /** 统一处理置顶 / 归档等返回更新后清单的操作。 */
  const runLabMutation = async (
    labId: string,
    mutate: () => Promise<CsLabLab>,
  ): Promise<void> => {
    if (actionBusyId) return
    setActionBusyId(labId)
    setError(null)
    try {
      const updated = await mutate()
      setLabs((previous) =>
        sortLabs(previous.map((lab) => (lab.id === updated.id ? updated : lab))),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : '实验室操作失败')
    } finally {
      setActionBusyId(null)
    }
  }

  const handleRenamed = (updated: CsLabLab): void => {
    setLabs((previous) =>
      sortLabs(previous.map((lab) => (lab.id === updated.id ? updated : lab))),
    )
  }

  const handleDeleted = (labId: string): void => {
    setLabs((previous) => previous.filter((lab) => lab.id !== labId))
    // 删除活跃实验室时同步置空，避免主视图继续请求已删除的沙箱。
    if (activeLabId === labId) {
      setActiveLabId(null)
      setSnapshot(null)
      setAssets([])
    }
  }

  const renderMenuItems = (
    MenuItem: typeof ContextMenuItem | typeof DropdownMenuItem,
    MenuSeparator: typeof ContextMenuSeparator | typeof DropdownMenuSeparator,
    lab: CsLabLab,
  ): React.ReactNode => (
    <>
      <MenuItem
        className="text-xs py-1 [&>svg]:size-3.5"
        onSelect={() => {
          void runLabMutation(lab.id, () => window.electronAPI.cslab.togglePinLab(lab.id))
        }}
      >
        {lab.pinned ? <PinOff size={14} /> : <Pin size={14} />}
        {lab.pinned ? '取消置顶' : '置顶实验室'}
      </MenuItem>
      <MenuItem
        className="text-xs py-1 [&>svg]:size-3.5"
        onSelect={() => setRenameTarget(lab)}
      >
        <Pencil size={14} />
        重命名实验室
      </MenuItem>
      <MenuItem
        className="text-xs py-1 [&>svg]:size-3.5"
        onSelect={() => {
          void runLabMutation(lab.id, () => window.electronAPI.cslab.toggleArchiveLab(lab.id))
        }}
      >
        {lab.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
        {lab.archived ? '解除归档' : '归档实验室'}
      </MenuItem>
      {lab.demoKind && (
        <MenuItem
          className="text-xs py-1 [&>svg]:size-3.5"
          onSelect={() => setResetTarget(lab)}
        >
          <RotateCcw size={14} />
          恢复初始演示数据
        </MenuItem>
      )}
      <MenuSeparator className="my-0.5" />
      <MenuItem
        className="text-xs py-1 [&>svg]:size-3.5 text-destructive focus:text-destructive"
        onSelect={() => setDeleteTarget(lab)}
      >
        <Trash2 size={14} />
        删除实验室
      </MenuItem>
    </>
  )

  const emptyTitle =
    labs.length === 0
      ? '还没有实验室'
      : query.trim()
        ? '没有找到匹配的实验室'
        : filter === 'archived'
          ? '还没有归档的实验室'
          : '没有进行中的实验室'

  const emptyHint =
    labs.length === 0
      ? '新建一间实验室，开始建立你的数据铁笼与活体论文。'
      : query.trim()
        ? '尝试更换关键词，或清空搜索查看全部实验室。'
        : filter === 'archived'
          ? '在实验室卡片的菜单中选择「归档实验室」即可收纳到这里。'
          : '切换到「全部」或「已归档」查看其他实验室。'

  return (
    <div data-tour="cslab-preparation" className="flex h-full min-h-0 flex-col overflow-hidden">
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
              placeholder="搜索实验室、编号或研究方向（支持拼音首字母）…"
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

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-cslab-border/70 pb-2.5">
            <div role="tablist" aria-label="实验室状态过滤" className="flex items-center gap-1">
              {(Object.keys(FILTER_LABELS) as LabFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] transition-colors',
                    filter === key
                      ? 'bg-cslab-accent/10 font-medium text-cslab-accent'
                      : 'text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text',
                  )}
                >
                  {FILTER_LABELS[key]}
                  <span className="ml-1 tabular-nums">{counts[key]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
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
              <p className="font-serif text-base text-cslab-text">{emptyTitle}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-cslab-muted">{emptyHint}</p>
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
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          data-tour={lab.demoKind ? 'cslab-demo-lab' : `cslab-lab-${lab.id}`}
                          data-demo-kind={lab.demoKind}
                          aria-disabled={!!openingId || undefined}
                          onClick={() => {
                            if (!openingId) void handleOpen(lab)
                          }}
                          onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') return
                            event.preventDefault()
                            if (!openingId) void handleOpen(lab)
                          }}
                          className={cn(
                            'group relative w-full rounded-xl border border-cslab-border bg-cslab-bg px-5 py-4 text-left transition-all duration-200 hover:border-cslab-accent/40 hover:bg-cslab-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cslab-accent/40',
                            openingId && 'cursor-wait opacity-80',
                            !openingId && 'cursor-pointer',
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                {lab.pinned && (
                                  <Pin
                                    size={13}
                                    className="shrink-0 self-center text-cslab-accent"
                                    aria-label="已置顶"
                                  />
                                )}
                                <h3 className="font-serif text-[17px] font-medium tracking-tight text-cslab-text transition-colors group-hover:text-cslab-accent">
                                  {lab.name}
                                </h3>
                                <span className="text-[10px] uppercase tracking-[0.12em] text-cslab-muted">
                                  {lab.code}
                                </span>
                                {lab.demoKind && (
                                  <span className="rounded-full border border-cslab-accent/40 bg-cslab-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-cslab-accent">
                                    演示
                                  </span>
                                )}
                                {lab.archived && (
                                  <span className="rounded-full border border-cslab-border px-1.5 py-0.5 text-[10px] text-cslab-muted">
                                    已归档
                                  </span>
                                )}
                              </div>
                              <p className="mt-1.5 line-clamp-1 text-[13px] leading-relaxed text-cslab-muted">
                                {lab.description}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    aria-label={`${lab.name} 的操作菜单`}
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) => event.stopPropagation()}
                                    className="rounded-md p-1 text-cslab-muted opacity-0 transition-all hover:bg-cslab-surface hover:text-cslab-text group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cslab-accent/40 data-[state=open]:opacity-100"
                                  >
                                    <MoreHorizontal size={15} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 min-w-0 p-0.5">
                                  {renderMenuItems(
                                    DropdownMenuItem,
                                    DropdownMenuSeparator,
                                    lab,
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {opening ? (
                                <Loader2 size={15} className="animate-spin text-cslab-accent" />
                              ) : (
                                <ArrowUpRight
                                  size={15}
                                  className="text-cslab-border transition-colors group-hover:text-cslab-accent"
                                />
                              )}
                            </div>
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
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-44 min-w-0 p-0.5">
                        {renderMenuItems(ContextMenuItem, ContextMenuSeparator, lab)}
                      </ContextMenuContent>
                    </ContextMenu>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="mt-10 text-center text-[11px] leading-relaxed text-cslab-muted">
            实验室沙箱默认位于 ~/.cdutai/cslab-workspaces/ · 数据仅保存在本机
          </p>
          <p className="mt-1 text-center text-[10px] leading-relaxed text-cslab-muted/70">
            Powered by 雫窝中央实验室 · 2026
          </p>
        </div>
      </div>

      <CsLabCreateLabDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(lab) => void handleCreated(lab)}
      />
      <CsLabRenameLabDialog
        lab={renameTarget}
        onClose={() => setRenameTarget(null)}
        onRenamed={handleRenamed}
      />
      <CsLabDeleteLabDialog
        lab={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
      <AlertDialog open={!!resetTarget} onOpenChange={(open) => { if (!open) setResetTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>恢复初始演示数据？</AlertDialogTitle>
            <AlertDialogDescription>
              将清理「{resetTarget?.name}」的沙箱并重新写入官方演示样本，实验室会产生新的 ID，
              已绑定该实验室的历史会话将被解绑。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={resetting}
              onClick={(event) => {
                event.preventDefault()
                void handleResetDemo()
              }}
            >
              {resetting ? <Loader2 size={12} className="mr-1 animate-spin" /> : null}
              确认恢复
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
