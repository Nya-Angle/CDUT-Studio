/**
 * expanded-sidebar.tsx — 展开态完整侧边栏
 *
 * 从 LeftSidebar 抽离的展开态视图。通过 SidebarModel 读取状态与 handler。
 */

import * as React from 'react'
import { PanelLeftClose, Plus, Search, FolderOpen, Archive, ArchiveRestore, Settings, Bot, GraduationCap, Atom } from 'lucide-react'
import { useAtomValue, useSetAtom } from 'jotai'
import { cn } from '@/lib/utils'
import { activeViewAtom } from '@/atoms/active-view'
import { archivedUnreadAtom } from '@/atoms/sidebar-atoms'
import { CdutMark } from '@/components/shared/CdutLogo'
import { Tooltip, TooltipTrigger, TooltipContent } from '@profer/ui/primitives/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@profer/ui/primitives/popover'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { SidebarWindowDragStrip, SIDEBAR_DRAG_STRIP_HEIGHT, AutomationSidebarEntry, SkillsSidebarEntry, renderWorkspaceSortIcon } from './navigation-items'
import { ConversationItem, AgentSessionItem, RelatedChildSessionItem, AgentProjectGroupItem, PINNED_SESSION_MAX_HEIGHT, getSessionLeftAccent } from './session-items'
import { WORKSPACE_SORT_LABEL } from './sidebar-utils'
import { getRelatedSessionSummary, getSessionTreeStatus, treeContainsSessionId } from './session-tree'
import { getActiveAccelerator, getAcceleratorDisplay } from '@/lib/shortcut-registry'
import type { SidebarModel } from './use-left-sidebar'

export function ExpandedSidebar({ s }: { s: SidebarModel }): React.ReactElement {
  const setActiveView = useSetAtom(activeViewAtom)
  const archivedUnread = useAtomValue(archivedUnreadAtom)
  const setArchivedUnread = useSetAtom(archivedUnreadAtom)
  const {
    isMac,
    setSidebarCollapsed,
    isClassic,
    mode,
    conversations,
    agentSessions,
    handleNewAgentSession,
    handleNewConversation,
    setSearchDialogOpen,
    automationCount,
    handleOpenAutomations,
    activeView,
    capabilities,
    handleOpenSkills,
    pinnedConversations,
    conversationDraftMap,
    activeSessionId,
    streamingIds,
    handleSelectConversation,
    handleRequestDelete,
    handleRename,
    handleRegenerateConversationTitle,
    handleTogglePin,
    handleToggleArchive,
    pinnedAgentSessionTrees,
    agentGlobalSessionTrees,
    agentIndicatorMap,
    expandedRelatedParentIds,
    agentDraftIds,
    workspaceNameMap,
    handleSelectAgentSession,
    handleRequestMove,
    handleAgentRename,
    handleAgentRegenerateTitle,
    handleMarkUnread,
    regeneratingTitleIds,
    handleTogglePinAgent,
    handleToggleArchiveAgent,
    handleToggleRelatedParent,
    relativeTimeNow,
    workspaceSortMode,
    handleCycleWorkspaceSort,
    authStatus,
    accountCaps,
    handleStartCreateProject,
    creatingProject,
    setCreatingProject,
    newProjectName,
    setNewProjectName,
    newProjectInputRef,
    handleCreateProjectKeyDown,
    agentProjectGroups,
    progressiveCount,
    currentWorkspaceId,
    expandedExtraCountMap,
    collapsedWorkspaceIds,
    dragProjectId,
    projectDropIndicator,
    handleShowMoreSessions,
    handleCollapseExtraSessions,
    handleSelectProject,
    handleToggleProjectCollapse,
    createAgentSessionInWorkspace,
    handleProjectDragStart,
    handleProjectDragOver,
    handleProjectDragLeave,
    handleProjectDrop,
    handleProjectDragEnd,
    setSettingsOpen,
    handleWorkspaceRename,
    handleRequestDeleteWorkspace,
    handleToggleWorkspaceArchive,
    archivedWorkspaces,
    canDeleteWorkspace,
    workspaceSwitchTs,
    progressiveConversationGroups,
    progressiveAgentSessionGroups,
    archivedConversationCount,
    archivedAgentSessionCount,
    viewMode,
    setViewMode,
    userProfile,
    hasEnvironmentIssues,
  } = s
  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <SidebarWindowDragStrip
        height={isMac ? SIDEBAR_DRAG_STRIP_HEIGHT.expandedMac : SIDEBAR_DRAG_STRIP_HEIGHT.expanded}
      />

      {/* macOS 需要避开左上角红绿灯；边栏覆盖全局标题栏拖拽层，因此留白自身也要可拖拽。 */}
      <div className={cn('w-full flex-shrink-0 titlebar-drag-region', isMac ? 'h-[30px]' : 'h-1')} />

      {/* 顶部 Header：最左上角 Logo 图标 + Welcome 字样，右侧协调收起按钮 */}
      <div className="titlebar-drag-region flex items-center justify-between px-3 pt-1.5 pb-1">
        <div className="flex items-center gap-2 min-w-0 select-none">
          <CdutMark className="size-5 shrink-0" alt="CDUT Logo" />
          <span className="text-[13px] font-semibold text-foreground/85 tracking-tight truncate">CDUT Studio | Welcome ~</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className={cn(
                'sidebar-collapse-button size-8 flex-shrink-0 flex items-center justify-center rounded-[8px] text-foreground/40 titlebar-no-drag',
                isClassic
                  ? 'bg-muted hover:bg-foreground/[0.08] hover:text-foreground/60 transition-colors'
                  : 'bg-primary/5 hover:bg-primary/10 hover:text-foreground/60 transition-[background-color,border-color,color] duration-150 border border-border/60 hover:border-border'
              )}
            >
              <PanelLeftClose size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">收起侧边栏 ({navigator.platform.includes('Mac') ? '⌘B' : 'Ctrl+B'})</TooltipContent>
        </Tooltip>
      </div>

      {/* 顶级开关区：Agent / CDUT 专区 / CDUT Science 轻量清凉扁平矩形组 */}
      <div className="px-3 pt-1 pb-1 select-none titlebar-no-drag cursor-default">
        <div className="flex flex-col gap-0 w-full overflow-hidden select-none cursor-default">
          {/* 1. Agent */}
          <button
            type="button"
            data-profer-navigation-region="mode-switcher-agent"
            onClick={() => {
              if (activeView !== 'conversations') {
                setActiveView('conversations')
              }
            }}
            className={cn(
              'group relative flex h-9 w-full items-center justify-start gap-2.5 px-3.5 !cursor-default rounded-none border-b border-border select-none titlebar-no-drag focus:outline-none overflow-hidden',
              activeView === 'conversations'
                ? 'text-foreground font-medium'
                : 'text-foreground/60 hover:text-foreground active:text-foreground'
            )}
          >
            {/* 处于激活状态的常驻微底色：两端纯透明，中间微显 */}
            {activeView === 'conversations' && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent"
              />
            )}

            {/* 鼠标移入/按下时的底色：两端纯透明，中间渐显；进场 75ms 极柔，退场 0 延迟瞬断 */}
            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 pointer-events-none opacity-0 transition-none group-hover:transition-opacity group-hover:duration-75 group-hover:ease-out group-hover:opacity-100 group-active:opacity-100 group-active:transition-none',
                activeView === 'conversations'
                  ? 'bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-foreground/[0.035] to-transparent'
              )}
            />

            <Bot
              size={15}
              className={cn(
                'relative z-10 shrink-0 transition-none group-hover:transition-colors group-hover:duration-75',
                activeView === 'conversations'
                  ? 'text-foreground'
                  : 'text-foreground/45 group-hover:text-foreground'
              )}
            />
            <span className="relative z-10 text-[13px]">Agent</span>
          </button>

          {/* 2. CDUT 专区 */}
          <button
            type="button"
            data-profer-navigation-region="mode-switcher-cdut"
            onClick={() => {
              if (activeView !== 'cdut-zone') {
                setActiveView('cdut-zone')
              }
            }}
            className={cn(
              'group relative flex h-9 w-full items-center justify-start gap-2.5 px-3.5 !cursor-default rounded-none border-b border-border select-none titlebar-no-drag focus:outline-none overflow-hidden',
              activeView === 'cdut-zone'
                ? 'text-foreground font-medium'
                : 'text-foreground/60 hover:text-foreground active:text-foreground'
            )}
          >
            {activeView === 'cdut-zone' && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent"
              />
            )}

            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 pointer-events-none opacity-0 transition-none group-hover:transition-opacity group-hover:duration-75 group-hover:ease-out group-hover:opacity-100 group-active:opacity-100 group-active:transition-none',
                activeView === 'cdut-zone'
                  ? 'bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-foreground/[0.035] to-transparent'
              )}
            />

            <GraduationCap
              size={15}
              className={cn(
                'relative z-10 shrink-0 transition-none group-hover:transition-colors group-hover:duration-75',
                activeView === 'cdut-zone'
                  ? 'text-foreground'
                  : 'text-foreground/45 group-hover:text-foreground'
              )}
            />
            <span className="relative z-10 text-[13px]">CDUT 专区</span>
          </button>

          {/* 3. CDUT Science */}
          <button
            type="button"
            data-tour="cdut-science-entry"
            data-profer-navigation-region="mode-switcher-cdut-science"
            onClick={() => {
              if (activeView !== 'cdut-science') {
                setActiveView('cdut-science')
              }
            }}
            className={cn(
              'group relative flex h-9 w-full items-center justify-start gap-2.5 px-3.5 !cursor-default rounded-none border-none select-none titlebar-no-drag focus:outline-none overflow-hidden',
              activeView === 'cdut-science'
                ? 'text-foreground font-medium'
                : 'text-foreground/60 hover:text-foreground active:text-foreground'
            )}
          >
            {activeView === 'cdut-science' && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent"
              />
            )}

            <div
              aria-hidden="true"
              className={cn(
                'absolute inset-0 pointer-events-none opacity-0 transition-none group-hover:transition-opacity group-hover:duration-75 group-hover:ease-out group-hover:opacity-100 group-active:opacity-100 group-active:transition-none',
                activeView === 'cdut-science'
                  ? 'bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-foreground/[0.035] to-transparent'
              )}
            />

            <Atom
              size={15}
              className={cn(
                'relative z-10 shrink-0 transition-none group-hover:transition-colors group-hover:duration-75',
                activeView === 'cdut-science'
                  ? 'text-foreground'
                  : 'text-foreground/45 group-hover:text-foreground'
              )}
            />
            <span className="relative z-10 text-[13px]">CDUT Science</span>
          </button>
        </div>
      </div>

      {/* 新对话/新会话按钮 + 搜索按钮 */}
      <div className="px-3 pt-2 flex items-center gap-1.5">
        <button
          data-profer-navigation-item="new-session"
          onClick={mode === 'agent' ? handleNewAgentSession : handleNewConversation}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium text-foreground/70 bg-primary/5 hover:bg-primary/10 hover:text-foreground transition-[background-color,border-color,color] duration-150 titlebar-no-drag border border-border/60 hover:border-border"
        >
          <Plus size={14} />
          <span>{mode === 'agent' ? '新会话' : '新对话'}</span>
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSearchDialogOpen(true)}
              className="flex-shrink-0 size-[36px] flex items-center justify-center rounded-[10px] text-foreground/40 bg-primary/5 hover:bg-primary/10 hover:text-foreground/60 transition-[background-color,border-color,color] duration-150 titlebar-no-drag border border-border/60 hover:border-border"
            >
              <Search size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">搜索 ({getAcceleratorDisplay(getActiveAccelerator('global-search'))})</TooltipContent>
        </Tooltip>
      </div>

      {/* 自动任务入口：作为任务中心入口放在置顶区上方，不参与置顶列表层级 */}
      <div className="px-3 pt-2 pb-0.5">
        <AutomationSidebarEntry
          count={automationCount}
          active={activeView === 'planning'}
          onClick={handleOpenAutomations}
        />
      </div>

      {/* Agent 技能入口：Skills / MCP 能力中心，仅 Agent 模式可见 */}
      {mode === 'agent' && (
        <div className="px-3 pb-0.5">
          <SkillsSidebarEntry
            count={capabilities?.skills.length ?? 0}
            updateCount={capabilities?.skills.filter((s) => s.hasUpdate).length ?? 0}
            active={activeView === 'agent-skills'}
            onClick={handleOpenSkills}
          />
        </div>
      )}

      {/* 已归档列表入口：紧随 Agent 技能（Agent 模式）/ 自动任务（Chat 模式）之下、会话列表之上。
          后台静默自动归档时点亮即时通讯风格的红色未读圆点，点开归档视图后立即熄灭 */}
      <div className="px-3 pb-0.5">
        <button
          type="button"
          onClick={() => {
            setArchivedUnread(false)
            setViewMode(viewMode === 'archived' ? 'active' : 'archived')
          }}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-medium transition-colors duration-150 titlebar-no-drag border',
            viewMode === 'archived'
              ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
              : 'bg-primary/5 border-border/60 text-foreground/70 hover:bg-primary/10 hover:text-foreground hover:border-primary/30',
          )}
          aria-label={viewMode === 'archived' ? '返回活跃列表' : '打开已归档列表'}
        >
          <Archive size={14} className="shrink-0 text-primary/70" />
          <span className="flex-1 text-left truncate">
            {viewMode === 'archived' ? '返回活跃列表' : '已归档列表'}
            {viewMode === 'active' && archivedConversationCount + archivedAgentSessionCount > 0
              ? ` (${archivedConversationCount + archivedAgentSessionCount})`
              : ''}
          </span>
          {archivedUnread && viewMode !== 'archived' && (
            <span
              className="size-2.5 shrink-0 rounded-full bg-rose-500 ring-2 ring-background animate-pulse"
              aria-label="有新的自动归档"
            />
          )}
        </button>
      </div>

      {/* Chat 模式 active 视图：置顶 + 对话历史，结构与 Agent active 视图保持一致 */}
      {mode === 'chat' && viewMode === 'active' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {pinnedConversations.length > 0 && (
            <div className="pt-2 pb-1 flex-shrink-0 titlebar-no-drag">
              <div className="pl-[18px] pr-3.5 pb-1 text-[13px] font-medium leading-[18px] text-foreground/40 select-none">
                置顶
              </div>
              <div
                className="sidebar-session-scroll overflow-y-auto scrollbar-thin"
                style={{ maxHeight: PINNED_SESSION_MAX_HEIGHT }}
              >
                <div className="px-2">
                  <div className="ml-4 flex flex-col gap-0.5">
                    {pinnedConversations.map((conv) => (
                      <ConversationItem
                        key={`pinned-${conv.id}`}
                        conversation={conv}
                        active={conv.id === activeSessionId}
                        streaming={streamingIds.has(conv.id)}
                        showPinIcon={false}
                        hasDraft={conversationDraftMap.has(conv.id)}
                        relativeTimeNow={relativeTimeNow}
                        onSelect={handleSelectConversation}
                        onRequestDelete={handleRequestDelete}
                        onRename={handleRename}
                        onRegenerateTitle={handleRegenerateConversationTitle}
                        onTogglePin={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-2 pt-2 pb-1 flex-shrink-0">
            <span className="ml-[4px] px-1.5 text-[13px] font-medium leading-[18px] text-foreground/40 select-none">对话</span>
          </div>

          <div className="sidebar-session-scroll flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin min-h-0 titlebar-no-drag">
            {progressiveConversationGroups.map((group) => (
              <div key={group.label} className="mb-1">
                <div className="ml-[4px] px-1.5 pt-2 pb-1 text-[11px] font-medium text-foreground/40 select-none">
                  {group.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      active={conv.id === activeSessionId}
                      streaming={streamingIds.has(conv.id)}
                      showPinIcon={!!conv.pinned}
                      hasDraft={conversationDraftMap.has(conv.id)}
                      relativeTimeNow={relativeTimeNow}
                      onSelect={handleSelectConversation}
                      onRequestDelete={handleRequestDelete}
                      onRename={handleRename}
                      onRegenerateTitle={handleRegenerateConversationTitle}
                      onTogglePin={handleTogglePin}
                      onToggleArchive={handleToggleArchive}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : mode === 'agent' && viewMode === 'active' ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="sidebar-session-scroll flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin min-h-0 titlebar-no-drag">
            {/* 1. 全局独立会话（不指定工作区） */}
            <div className="mb-3">
              <div className="flex items-center justify-between px-2 pt-2 pb-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/40 select-none">会话</span>
                <span className="text-[10px] tabular-nums text-foreground/50">{agentGlobalSessionTrees.length}</span>
              </div>
              {agentGlobalSessionTrees.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {agentGlobalSessionTrees.slice(0, progressiveCount).map((item) => {
                    const childCount = item.childSessions.length
                    const rowStatus = getSessionTreeStatus(item, agentIndicatorMap)
                    const treeActive = treeContainsSessionId(item, activeSessionId)
                    const activeChildVisible = item.childSessions.some((child) => child.id === activeSessionId)
                    const expandedChildren = expandedRelatedParentIds.has(item.session.id) || activeChildVisible

                    return (
                      <div key={item.session.id} className="flex flex-col gap-0.5">
                        <AgentSessionItem
                          session={item.session}
                          active={treeActive}
                          indicatorStatus={rowStatus}
                          showPinIcon={!!item.session.pinned}
                          hasDraft={agentDraftIds.has(item.session.id)}
                          delegationSummary={childCount > 0
                            ? {
                              ...getRelatedSessionSummary(item.childSessions),
                              expanded: expandedChildren,
                              onToggle: () => handleToggleRelatedParent(item.session.id),
                            }
                            : undefined}
                          leftAccent={getSessionLeftAccent(rowStatus)}
                          relativeTimeNow={relativeTimeNow}
                          onSelect={handleSelectAgentSession}
                          onRequestDelete={handleRequestDelete}
                          onRequestMove={handleRequestMove}
                          onRename={handleAgentRename}
                          onRegenerateTitle={handleAgentRegenerateTitle}
                          regeneratingTitle={regeneratingTitleIds.has(item.session.id)}
                          onTogglePin={handleTogglePinAgent}
                          onToggleArchive={handleToggleArchiveAgent}
                          onMarkUnread={handleMarkUnread}
                        />

                        {childCount > 0 && expandedChildren && (
                          <div className="ml-3 border-l border-foreground/10 pl-2 flex flex-col gap-0.5">
                            {item.childSessions.map((childSession) => (
                              <RelatedChildSessionItem
                                key={childSession.id}
                                session={childSession}
                                activeSessionId={activeSessionId}
                                agentIndicatorMap={agentIndicatorMap}
                                hasDraft={agentDraftIds.has(childSession.id)}
                                relativeTimeNow={relativeTimeNow}
                                onSelect={handleSelectAgentSession}
                                onRequestDelete={handleRequestDelete}
                                onRequestMove={handleRequestMove}
                                onRename={handleAgentRename}
                                onRegenerateTitle={handleAgentRegenerateTitle}
                                regeneratingTitle={regeneratingTitleIds.has(childSession.id)}
                                onTogglePin={handleTogglePinAgent}
                                onToggleArchive={handleToggleArchiveAgent}
                                onMarkUnread={handleMarkUnread}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="px-2 py-1 text-[11px] text-foreground/50 italic select-none">
                  暂无独立会话
                </div>
              )}
            </div>

            {/* 2. 项目列表（各工作区会话） */}
            <div>
              <div className="flex items-center justify-between px-2 pt-1 pb-1">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/40 select-none">项目</span>
                <div className="flex items-center gap-0.5">
                  {/* 已收纳工作区入口 */}
                  {archivedWorkspaces.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="size-6 flex items-center justify-center rounded-md text-foreground/35 hover:bg-foreground/[0.06] hover:text-foreground/60 transition-colors titlebar-no-drag"
                          aria-label={`查看已收纳工作区（${archivedWorkspaces.length}）`}
                        >
                          <Archive size={13} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-56 p-1">
                        <div className="px-2 py-1 text-[11px] font-medium text-foreground/40">
                          已收纳工作区 ({archivedWorkspaces.length})
                        </div>
                        {archivedWorkspaces.map((ws) => (
                          <div
                            key={ws.id}
                            className="group/archived flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-foreground/70 hover:bg-foreground/[0.05]"
                          >
                            <FolderOpen size={13} className="flex-shrink-0 text-foreground/35" />
                            <span className="flex-1 min-w-0 truncate">{ws.name}</span>
                            <button
                              type="button"
                              aria-label={`取出「${ws.name}」`}
                              title="取出工作区"
                              onClick={() => { void handleToggleWorkspaceArchive(ws.id) }}
                              className="flex-shrink-0 rounded p-0.5 text-foreground/35 transition-colors hover:text-foreground/80 titlebar-no-drag"
                            >
                              <ArchiveRestore size={13} />
                            </button>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                  {/* 项目排序切换 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={handleCycleWorkspaceSort}
                        className="size-6 flex items-center justify-center rounded-md text-foreground/35 hover:bg-foreground/[0.06] hover:text-foreground/60 transition-colors titlebar-no-drag"
                        aria-label={`项目排序：当前${WORKSPACE_SORT_LABEL[workspaceSortMode]}排序，点击切换`}
                      >
                        {renderWorkspaceSortIcon(workspaceSortMode)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      当前{WORKSPACE_SORT_LABEL[workspaceSortMode]}排序，点击切换排序方式
                    </TooltipContent>
                  </Tooltip>
                  {/* 新建项目 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={handleStartCreateProject}
                        className="size-6 flex items-center justify-center rounded-md text-foreground/40 hover:bg-foreground/[0.06] hover:text-foreground/60 transition-colors titlebar-no-drag"
                        aria-label="新建项目"
                      >
                        <Plus size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">新建项目</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {creatingProject && (
                <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded-md bg-foreground/[0.04]">
                  <FolderOpen size={14} className="flex-shrink-0 text-foreground/40" />
                  <input
                    ref={newProjectInputRef}
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={handleCreateProjectKeyDown}
                    onBlur={() => {
                      setCreatingProject(false)
                      setNewProjectName('')
                    }}
                    placeholder="项目名称..."
                    className="flex-1 min-w-0 bg-transparent text-[13px] text-foreground border-b border-primary/50 outline-none px-0.5"
                    maxLength={50}
                  />
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                {agentProjectGroups.slice(0, progressiveCount).map((group) => (
                  <AgentProjectGroupItem
                    key={group.workspace.id}
                    group={group}
                    currentWorkspaceId={currentWorkspaceId}
                    expanded={(expandedExtraCountMap.get(group.workspace.id) ?? 0) > 0}
                    extraCount={expandedExtraCountMap.get(group.workspace.id) ?? 0}
                    collapsed={collapsedWorkspaceIds.has(group.workspace.id)}
                    activeSessionId={activeSessionId}
                    agentIndicatorMap={agentIndicatorMap}
                    agentDraftIds={agentDraftIds}
                    expandedRelatedParentIds={expandedRelatedParentIds}
                    relativeTimeNow={relativeTimeNow}
                    dragging={dragProjectId === group.workspace.id}
                    dropPosition={projectDropIndicator?.id === group.workspace.id ? projectDropIndicator.position : null}
                    onShowMore={handleShowMoreSessions}
                    onCollapseExtra={handleCollapseExtraSessions}
                    onSelectProject={handleSelectProject}
                    onToggleProjectCollapse={handleToggleProjectCollapse}
                    onNewSession={createAgentSessionInWorkspace}
                    onDragStart={handleProjectDragStart}
                    onDragOver={handleProjectDragOver}
                    onDragLeave={handleProjectDragLeave}
                    onDrop={handleProjectDrop}
                    onDragEnd={handleProjectDragEnd}
                    onToggleArchiveWorkspace={(workspaceId) => { void handleToggleWorkspaceArchive(workspaceId) }}
                    onRenameWorkspace={handleWorkspaceRename}
                    onRequestDeleteWorkspace={handleRequestDeleteWorkspace}
                    canDeleteWorkspace={canDeleteWorkspace(group.workspace)}
                    onSelectSession={handleSelectAgentSession}
                    onRequestDelete={handleRequestDelete}
                    onRequestMove={handleRequestMove}
                    onRename={handleAgentRename}
                    onRegenerateTitle={handleAgentRegenerateTitle}
                    onTogglePin={handleTogglePinAgent}
                    onToggleArchive={handleToggleArchiveAgent}
                    onToggleRelatedParent={handleToggleRelatedParent}
                    onMarkUnread={handleMarkUnread}
                    workspaceSwitchTs={workspaceSwitchTs}
                    locked={s.isAiClassWorkspaceLocked(group.workspace)}
                    onLockedInteract={s.handleAiClassLockedInteract}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 归档视图标题栏 */}
          {viewMode === 'archived' && (
            <div className="px-6 pt-3 pb-1">
              <div className="text-[12px] font-medium text-foreground/40">
                已归档{mode === 'agent' ? '会话' : '对话'}
              </div>
            </div>
          )}

          {/* 归档视图：单列表布局 */}
          <div className="sidebar-session-scroll flex-1 overflow-y-auto px-3 pt-2 pb-3 scrollbar-thin titlebar-no-drag">
            {mode === 'chat' ? (
              /* Chat 归档：对话按日期分组 */
              progressiveConversationGroups.map((group) => (
                <div key={group.label} className="mb-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-foreground/40 select-none">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        active={conv.id === activeSessionId}
                        streaming={streamingIds.has(conv.id)}
                        showPinIcon={!!conv.pinned}
                        hasDraft={conversationDraftMap.has(conv.id)}
                        relativeTimeNow={relativeTimeNow}
                        onSelect={handleSelectConversation}
                        onRequestDelete={handleRequestDelete}
                        onRename={handleRename}
                        onRegenerateTitle={handleRegenerateConversationTitle}
                        onTogglePin={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Agent 模式归档：Agent 会话按日期分组 */
              progressiveAgentSessionGroups.map((group) => (
                <div key={group.label} className="mb-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-foreground/40 select-none">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((session) => (
                      <AgentSessionItem
                        key={session.id}
                        session={session}
                        active={session.id === activeSessionId}
                        indicatorStatus={agentIndicatorMap.get(session.id) ?? 'idle'}
                        showPinIcon={!!session.pinned}
                        hasDraft={agentDraftIds.has(session.id)}
                        leftAccent={getSessionLeftAccent(agentIndicatorMap.get(session.id) ?? 'idle')}
                        workspaceName={session.workspaceId ? workspaceNameMap.get(session.workspaceId) : undefined}
                        relativeTimeNow={relativeTimeNow}
                        onSelect={handleSelectAgentSession}
                        onRequestDelete={handleRequestDelete}
                        onRequestMove={handleRequestMove}
                        onRename={handleAgentRename}
                        onRegenerateTitle={handleAgentRegenerateTitle}
                        regeneratingTitle={regeneratingTitleIds.has(session.id)}
                        onTogglePin={handleTogglePinAgent}
                        onToggleArchive={handleToggleArchiveAgent}
                        onMarkUnread={handleMarkUnread}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* 底部：用户资料 + 设置入口（已归档入口已上移至技能区下方） */}
      <div className="px-3 pb-3 space-y-1.5">

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] transition-colors titlebar-no-drag text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
        >
          <UserAvatar avatar={userProfile.avatar} size={28} />
          <span className="flex-1 text-sm truncate text-left">{userProfile.userName}</span>
          <div className="relative flex-shrink-0 text-foreground/40">
            <Settings size={16} />
            {hasEnvironmentIssues && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
