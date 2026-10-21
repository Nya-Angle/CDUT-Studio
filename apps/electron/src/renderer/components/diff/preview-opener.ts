/**
 * preview-opener — 统一的文件预览入口（右侧边栏化）
 *
 * 所有文件打开入口（文件树、课件列表、消息内文件芯片、引用锚点、Agent 自动预览）
 * 统一收敛到 openSidebarFilePreview：把文件写入会话级 previewFileMapAtom，
 * 并把右侧边栏切到「预览」视图。**绝不向顶栏插入任何 Tab**。
 *
 * 两条宿主：
 * - Agent 模式：RightSidePanel 切至 'preview' 视图并展开（activate !== false 时）；
 * - AI 速课堂（CDUT 专区 · ai-class）：自动展开速课堂右侧预览栏。
 *
 * 严格只读：所有预览文件强制 readOnly = true，不再支持写回。
 */

import * as React from 'react'
import { getDefaultStore, useStore } from 'jotai'
import { previewFileMapAtom, type PreviewFile } from '@/atoms/preview-atoms'
import { agentSessionsAtom } from '@/atoms/agent-atoms'
import { canOpenOrdinaryWorkTab, ensureOrdinaryWorkTabOwner, revokedAgentSessionIdsAtom } from '@/lib/agent-tab-access'
import {
  agentDiffPanelTabAtom,
  agentSessionPathMapAtom,
  agentSidePanelOpenAtom,
} from '@/atoms/agent-atoms'
import { activeViewAtom } from '@/atoms/active-view'
import { cdutSubViewAtom } from '@/atoms/cdut-account-atoms'
import { studyRightPanelCollapsedAtom } from '@/atoms/study-atoms'
import { isAbsoluteFilePath } from '@/lib/file-utils'

/** Jotai store 类型（从 useStore 推导，避免直接 import 内部 Store 类型） */
type JotaiStore = ReturnType<typeof useStore>

function normalizePreviewPath(filePath: string): string {
  if (!/^[A-Za-z]:[\\/]/.test(filePath)) return filePath
  const normalized = filePath
    .replace(/\\/g, '/')
    .replace(/^([A-Za-z]:)\/+/, '$1/')
  return normalized.replace(
    /^([A-Za-z]:\/Users\/[^/]+)\.(profer(?:-dev)?|proma(?:-dev)?)(?=\/|$)/i,
    '$1/.$2',
  )
}

function joinPreviewPath(basePath: string, filePath: string): string {
  return normalizePreviewPath(`${basePath.replace(/[\\/]+$/, '')}/${filePath.replace(/^[\\/]+/, '')}`)
}

/** 将所有预览入口的相对路径归一为真实绝对路径，保证默认应用探测使用同一目标。 */
function normalizePreviewFile(store: JotaiStore, sessionId: string, file: PreviewFile): PreviewFile {
  if (isAbsoluteFilePath(file.filePath)) {
    const filePath = normalizePreviewPath(file.filePath)
    return filePath === file.filePath ? file : { ...file, filePath }
  }

  const sessionPath = store.get(agentSessionPathMapAtom).get(sessionId) ?? ''
  const basePath = file.basePaths?.find(Boolean) ?? file.dirPath ?? sessionPath
  if (!basePath || !file.filePath) return file

  return {
    ...file,
    filePath: joinPreviewPath(basePath, file.filePath),
    dirPath: file.dirPath ?? basePath,
  }
}

export interface SidebarPreviewOptions {
  /** activate=false 时只更新预览内容不展开侧栏（如 Agent 静默自动预览） */
  activate?: boolean
}

/**
 * 在右侧边栏打开（或刷新）一个文件预览。
 *
 * @returns 归一化后的绝对文件路径
 */
export function openSidebarFilePreview(
  store: JotaiStore,
  sessionId: string,
  file: PreviewFile,
  options: SidebarPreviewOptions = {},
): string {
  // 侧栏与兼容入口共用归属门禁，审核 owner 和已撤销会话不能进入普通预览。
  if (store.get(revokedAgentSessionIdsAtom).has(sessionId)
    || !canOpenOrdinaryWorkTab(store.get(agentSessionsAtom), sessionId)) return ''
  const normalizedFile = normalizePreviewFile(store, sessionId, file)
  // 严格只读：文件预览不允许写回临时/源文件；Git Diff 视图同样只读。
  const readOnlyFile: PreviewFile = { ...normalizedFile, readOnly: true }
  store.set(previewFileMapAtom, (prev) => {
    const m = new Map(prev)
    m.set(sessionId, readOnlyFile)
    return m
  })

  const inAiClass =
    store.get(activeViewAtom) === 'cdut-zone' && store.get(cdutSubViewAtom) === 'ai-class'
  if (inAiClass) {
    // 速课堂：自动展开右侧预览栏
    store.set(studyRightPanelCollapsedAtom, false)
  } else {
    // Agent 模式：右侧边栏切换到预览视图并按需展开
    store.set(agentDiffPanelTabAtom, (prev) => {
      if (prev.get(sessionId) === 'preview') return prev
      const m = new Map(prev)
      m.set(sessionId, 'preview')
      return m
    })
    if (options.activate !== false) store.set(agentSidePanelOpenAtom, true)
  }

  return readOnlyFile.filePath
}

/** 兼容别名：旧调用点仍以 openFilePreviewTab 命名调用（不再创建 Tab）。 */
export function openFilePreviewTab(
  store: JotaiStore,
  sessionId: string,
  file: PreviewFile,
  options: SidebarPreviewOptions = {},
): string {
  return openSidebarFilePreview(store, sessionId, file, options)
}

/** Async version for early normal-session events: one Main-authorized lookup, never trust unknown event metadata. */
export async function openFilePreviewTabAuthorized(
  store: JotaiStore,
  sessionId: string,
  file: PreviewFile,
  options: { activate?: boolean } = {},
  isCurrent: () => boolean = () => true,
  load: (id: string) => Promise<import('@profer/shared').AgentSessionMeta | null> =
    (id) => window.electronAPI.getAgentSessionMeta(id),
): Promise<string> {
  if (!await ensureOrdinaryWorkTabOwner(store, sessionId, load, isCurrent)) return ''
  if (!isCurrent()) return ''
  return openFilePreviewTab(store, sessionId, file, options)
}

/** 模块级入口（与 usePanelAutoLayout 的模块级函数同一模式），供非 React 上下文调用。 */
export function openFilePreviewTabForSession(
  sessionId: string,
  file: PreviewFile,
  options?: SidebarPreviewOptions,
): string {
  return openSidebarFilePreview(getDefaultStore(), sessionId, file, options)
}

export function useOpenPreview() {
  const store = useStore()

  return React.useCallback(
    (sessionId: string, file: PreviewFile) => {
      void openFilePreviewTabAuthorized(store, sessionId, file)
    },
    [store],
  )
}
