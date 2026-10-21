/**
 * CsLabManuscriptEditor — Microsoft Word 级论文编辑器
 *
 * 特性：
 * 1. 真实 A4 纸张页面视图（794px 宽度、物理级投影、边距刻度与视区自适应）。
 * 2. 经典 Word Ribbon 选项卡栏（开始 / 插入 / 排版与视图）。
 * 3. 物理厘米标尺（带版心指示、左/右页边距阴影）。
 * 4. 显式分离「保存 (Ctrl+S)」与「另存为 (Ctrl+Shift+S)」。
 * 5. Word 标准底部状态栏（页码估算、中英文字数、字符数、胶囊数、保存状态、缩放滑块）。
 * 6. 支持把数据表单元格（application/x-cslab-ref）直接拖入正文生成活体胶囊。
 */

import * as React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Save,
  Download,
  Ruler as RulerIcon,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ChevronDown,
  Link2,
} from 'lucide-react'
import type { CsLabCapsule, CsLabManuscript } from '@profer/shared'
import { cn } from '@/lib/utils'
import {
  ScienceCapsuleNode,
  collectCapsulesFromDoc,
  markCapsulesStale,
} from './cslab-capsule-node'
import {
  CSLAB_CELL_MIME,
  buildCapsuleAttrs,
  hasDragType,
  readCellRef,
} from './cslab-dnd'
import {
  CSLAB_PERSONA_META,
  CSLAB_REVIEWER_PERSONAS,
  CsLabTrackChanges,
  CommentMark,
  DeletionMark,
  InsertionMark,
  TrackChangeBlockAttributes,
  buildLocalGrammarSuggestions,
  buildReviewerPromptText,
  collectSuggestions,
  parseReviewerJson,
  type CsLabCollectedSuggestion,
  type CsLabReviewCommandInput,
} from './cslab-track-changes-extension'
import { CsLabReviewMarginalia } from './CsLabReviewMarginalia'
import type { CsLabSuggestionPersona } from '@profer/shared'

interface CsLabManuscriptEditorProps {
  labId: string
  manuscript: CsLabManuscript
  staleCapsuleIds: Set<string>
  saving: boolean
  onEditorReady: (editor: Editor | null) => void
  onCapsuleClick: (capsuleId: string) => void
  onSave: (docJson: unknown, title: string, capsules: CsLabCapsule[]) => Promise<void>
  onSaveAs?: (docJson: unknown, title: string, capsules: CsLabCapsule[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  onTitleChange?: (title: string) => void
  onToast?: (kind: 'info' | 'success' | 'error', text: string) => void
}

type RibbonTab = 'home' | 'insert' | 'review' | 'view'

function RibbonButton({
  active,
  onClick,
  title,
  shortcut,
  disabled,
  children,
}: {
  active?: boolean
  onClick: () => void
  title: string
  shortcut?: string
  disabled?: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${title} (${shortcut})` : title}
      aria-label={title}
      className={cn(
        'flex h-7 items-center justify-center rounded px-2 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'bg-cslab-accent/15 text-cslab-accent shadow-xs'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
      )}
    >
      {children}
    </button>
  )
}

function RibbonDivider(): React.ReactElement {
  return <div className="mx-1 h-5 w-px self-center bg-zinc-200 dark:bg-zinc-800" />
}

export function CsLabManuscriptEditor({
  labId,
  manuscript,
  staleCapsuleIds,
  saving,
  onEditorReady,
  onCapsuleClick,
  onSave,
  onSaveAs,
  onDirtyChange,
  onTitleChange,
  onToast,
}: CsLabManuscriptEditorProps): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState<RibbonTab>('home')
  const [title, setTitle] = React.useState(manuscript.title)
  const [dirty, setDirty] = React.useState(false)
  const [showRuler, setShowRuler] = React.useState(true)
  const [zoom, setZoom] = React.useState(100)
  const [lastSavedTime, setLastSavedTime] = React.useState<number | null>(manuscript.updatedAt || null)
  const [showMarginalia, setShowMarginalia] = React.useState(true)
  const [reviewPersona, setReviewPersona] =
    React.useState<Exclude<CsLabSuggestionPersona, 'human'>>('Methodology_Reviewer')
  const [reviewBusy, setReviewBusy] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<CsLabCollectedSuggestion[]>([])
  const [reviewMenuOpen, setReviewMenuOpen] = React.useState(false)
  const [capsuleMenuOpen, setCapsuleMenuOpen] = React.useState(false)

  const lastDirtyRef = React.useRef<boolean | null>(null)
  const lastTitleRef = React.useRef<string | null>(null)

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: '在此键入正文内容，或从右侧数据表中直接拖拽单元格嵌入活体胶囊…',
        }),
        ScienceCapsuleNode,
        InsertionMark,
        DeletionMark,
        CommentMark,
        TrackChangeBlockAttributes,
        CsLabTrackChanges,
      ],
      content: manuscript.docJson as never,
      editorProps: {
        attributes: {
          class:
            'cslab-prose min-h-[820px] font-serif text-[15px] leading-[1.8] text-zinc-900 dark:text-zinc-100 focus:outline-none selection:bg-cslab-accent/20',
        },
        handleDOMEvents: {
          dragenter(_view, event) {
            if (!hasDragType(event.dataTransfer, CSLAB_CELL_MIME)) return false
            event.preventDefault()
            return false
          },
          dragover(_view, event) {
            if (!hasDragType(event.dataTransfer, CSLAB_CELL_MIME)) return false
            event.preventDefault()
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
            return false
          },
        },
        handleDrop(view, event) {
          const cellRef = readCellRef(event.dataTransfer)
          if (!cellRef) return false
          event.preventDefault()

          const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
          const nodeType = view.state.schema.nodes.scienceCapsule
          if (!nodeType) return false

          const position = coords ? coords.pos : view.state.selection.from
          view.dispatch(view.state.tr.insert(position, nodeType.create(buildCapsuleAttrs(cellRef))))
          setDirty(true)
          return true
        },
      },
      onUpdate: () => {
        setDirty(true)
      },
    },
    [manuscript.uri],
  )

  React.useEffect(() => {
    onEditorReady(editor ?? null)
    return () => onEditorReady(null)
  }, [editor, onEditorReady])

  React.useEffect(() => {
    if (!editor) return
    markCapsulesStale(editor, staleCapsuleIds)
  }, [editor, staleCapsuleIds])

  // 审稿建议随文档实时重算（Marks/块属性是唯一事实源）。
  React.useEffect(() => {
    if (!editor) {
      setSuggestions([])
      return
    }
    const update = (): void => setSuggestions(collectSuggestions(editor))
    update()
    editor.on('update', update)
    return () => {
      editor.off('update', update)
    }
  }, [editor])

  const applySuggestions = React.useCallback(
    (items: CsLabReviewCommandInput[]): void => {
      if (!editor || items.length === 0) {
        onToast?.('info', '没有可施加的审稿建议')
        return
      }
      const applied = editor.chain().focus().applyReviewSuggestions(items).run()
      setSuggestions(collectSuggestions(editor))
      if (applied) {
        setDirty(true)
        onToast?.('success', `已生成 ${items.length} 条修订标记，可在正文/旁注中逐条接受或拒绝`)
      } else {
        onToast?.('error', '原文片段未在单段内精确命中，未产生任何修订（不做模糊替换）')
      }
    },
    [editor, onToast],
  )

  const handleAiReview = React.useCallback(
    async (persona: Exclude<CsLabSuggestionPersona, 'human'>): Promise<void> => {
      if (!editor || reviewBusy) return
      const text = editor.getText({ blockSeparator: '\n' })
      if (!text.trim()) {
        onToast?.('error', '正文为空，无法审阅')
        return
      }
      setReviewBusy(true)
      try {
        const result = await window.electronAPI.cslab.reviewManuscript({
          labId,
          manuscriptUri: manuscript.uri,
          persona,
          text,
        })
        if (!result.ok) {
          onToast?.('error', result.message)
          return
        }
        if (result.suggestions.length === 0) {
          onToast?.('info', result.message)
          return
        }
        applySuggestions(
          result.suggestions.map((suggestion) => ({
            kind: suggestion.kind,
            quote: suggestion.quote,
            replacement: suggestion.replacement,
            comment: suggestion.comment,
            persona: suggestion.persona,
          })),
        )
        onToast?.('success', result.message)
      } catch (error) {
        onToast?.('error', error instanceof Error ? error.message : 'AI 审稿失败')
      } finally {
        setReviewBusy(false)
      }
    },
    [applySuggestions, editor, labId, manuscript.uri, onToast, reviewBusy],
  )

  const handleLocalCheck = React.useCallback((): void => {
    if (!editor) return
    const items = buildLocalGrammarSuggestions(editor)
    if (items.length === 0) {
      onToast?.('success', '本地规则体检未发现明显问题')
      return
    }
    applySuggestions(items)
  }, [applySuggestions, editor, onToast])

  const handleCopyPrompt = React.useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(buildReviewerPromptText(reviewPersona))
      onToast?.('success', '审稿指令已复制，可粘贴到任意对话窗口执行')
    } catch {
      onToast?.('error', '剪贴板不可用，请手动复制')
    }
  }, [onToast, reviewPersona])

  const handlePasteSuggestions = React.useCallback(async (): Promise<void> => {
    try {
      const raw = await navigator.clipboard.readText()
      const items = parseReviewerJson(raw, reviewPersona)
      if (items.length === 0) {
        onToast?.('error', '剪贴板中没有可解析的审稿 JSON')
        return
      }
      applySuggestions(items)
    } catch {
      onToast?.('error', '读取剪贴板失败')
    }
  }, [applySuggestions, onToast, reviewPersona])

  const handleAcceptSuggestion = React.useCallback(
    (id: string): void => {
      if (!editor) return
      editor.chain().focus().acceptSuggestion(id).run()
      setSuggestions(collectSuggestions(editor))
      setDirty(true)
    },
    [editor],
  )

  const handleRejectSuggestion = React.useCallback(
    (id: string): void => {
      if (!editor) return
      editor.chain().focus().rejectSuggestion(id).run()
      setSuggestions(collectSuggestions(editor))
      setDirty(true)
    },
    [editor],
  )

  React.useEffect(() => {
    if (lastDirtyRef.current === dirty) return
    lastDirtyRef.current = dirty
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  React.useEffect(() => {
    if (lastTitleRef.current === title) return
    lastTitleRef.current = title
    onTitleChange?.(title)
  }, [title, onTitleChange])

  React.useEffect(() => {
    setTitle(manuscript.title)
    setDirty(false)
    setLastSavedTime(manuscript.updatedAt || null)
  }, [manuscript.uri, manuscript.title, manuscript.updatedAt])

  // ===== 保存与另存为 =====

  const handleSave = React.useCallback(async (): Promise<void> => {
    if (!editor || saving) return
    const docJson = editor.getJSON()
    const capsules = collectCapsulesFromDoc(docJson, labId)
    await onSave(docJson, title.trim() || '未命名文稿', capsules)
    setDirty(false)
    setLastSavedTime(Date.now())
  }, [editor, labId, onSave, saving, title])

  const handleSaveAs = React.useCallback(async (): Promise<void> => {
    if (!editor || saving) return
    const docJson = editor.getJSON()
    const capsules = collectCapsulesFromDoc(docJson, labId)
    if (onSaveAs) {
      await onSaveAs(docJson, title.trim() || '未命名文稿', capsules)
      setDirty(false)
      setLastSavedTime(Date.now())
    } else {
      await onSave(docJson, title.trim() || '未命名文稿', capsules)
      setDirty(false)
      setLastSavedTime(Date.now())
    }
  }, [editor, labId, onSave, onSaveAs, saving, title])

  // ===== 快捷键捕获 (Ctrl+S / Ctrl+Shift+S) =====

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's'
      if (!isSave) return

      event.preventDefault()
      event.stopPropagation()

      if (event.shiftKey) {
        void handleSaveAs()
      } else {
        void handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleSave, handleSaveAs])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const target = (event.target as HTMLElement).closest('[data-capsule-id]')
    const capsuleId = target?.getAttribute('data-capsule-id')
    if (capsuleId) onCapsuleClick(capsuleId)
  }

  // ===== 统计指标估算 =====

  const stats = React.useMemo(() => {
    if (!editor) return { words: 0, chars: 0, paragraphs: 1, pages: 1 }
    const text = editor.state.doc.textContent || ''
    const chars = text.length
    // 中文按单字、英文按空格分词统计
    const words = (text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9_-]+/g) || []).length
    const paragraphs = editor.state.doc.childCount || 1
    // A4 标准纸张一页约 800-1000 字
    const pages = Math.max(1, Math.ceil(chars / 850))
    return { words, chars, paragraphs, pages }
  }, [editor, dirty])

  const formatLastSaved = (time: number | null): string => {
    if (!time) return '未保存'
    const date = new Date(time)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F3F2EE] select-text dark:bg-[#151518]">
      {/* ===== Microsoft Word 顶部 Ribbon 功能区 ===== */}
      <header className="flex shrink-0 flex-col border-b border-[#DDDCD5] bg-[#FBFBFA] shadow-xs dark:border-[#2A2A2E] dark:bg-[#1E1E22]">
        {/* Ribbon 选项卡标题栏 */}
        <div className="flex h-8 items-center justify-between border-b border-zinc-200/80 px-3 dark:border-zinc-800">
          <div className="flex items-center gap-1">
            <span className="mr-2 inline-flex items-center gap-1 font-serif text-[12px] font-semibold tracking-wider text-cslab-accent uppercase">
              <FileText size={13} />
              CSLab Word
            </span>
            {(['home', 'insert', 'review', 'view'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'relative h-8 px-3 text-[12px] font-medium transition-colors',
                  activeTab === tab
                    ? 'font-semibold text-zinc-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cslab-accent dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
                )}
              >
                {{ home: '开始', insert: '插入', review: '审稿', view: '排版与视图' }[tab]}
              </button>
            ))}
          </div>

          {/* 快速保存 / 另存为操作组 */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                disabled={!editor || reviewBusy}
                onClick={() => {
                  setCapsuleMenuOpen(false)
                  setReviewMenuOpen((value) => !value)
                }}
                className="inline-flex h-6 items-center gap-1 rounded border border-cslab-accent/40 bg-cslab-accent/10 px-2 text-[11px] font-medium text-cslab-accent transition-colors hover:bg-cslab-accent/15 disabled:cursor-not-allowed disabled:opacity-50"
                title="选择 AI 审稿专家，对正文生成修订与旁注"
              >
                {reviewBusy ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}
                AI 审稿专家体检
                <ChevronDown size={10} />
              </button>
              {reviewMenuOpen && (
                <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-lg border border-cslab-border bg-cslab-elevated py-1 shadow-subtle">
                  {CSLAB_REVIEWER_PERSONAS.map((persona) => {
                    const meta = CSLAB_PERSONA_META[persona]
                    return (
                      <button
                        key={persona}
                        type="button"
                        onClick={() => {
                          setReviewMenuOpen(false)
                          setReviewPersona(persona)
                          void handleAiReview(persona)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ background: meta.color }}
                        />
                        {meta.title}
                      </button>
                    )
                  })}
                  <div className="my-1 h-px bg-cslab-border" />
                  <button
                    type="button"
                    onClick={() => {
                      setReviewMenuOpen(false)
                      handleLocalCheck()
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <CheckCircle2 size={10} />
                    本地确定性体检
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                disabled={manuscript.capsules.length === 0}
                onClick={() => {
                  setReviewMenuOpen(false)
                  setCapsuleMenuOpen((value) => !value)
                }}
                className="inline-flex h-6 items-center gap-1 rounded border border-zinc-300 bg-white px-2 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                title="查看已保存胶囊的数据血缘"
              >
                <Link2 size={10} />
                胶囊血缘
                <ChevronDown size={10} />
              </button>
              {capsuleMenuOpen && (
                <div className="absolute right-0 top-full z-40 mt-1 max-h-64 w-60 overflow-auto rounded-lg border border-cslab-border bg-cslab-elevated py-1 shadow-subtle">
                  {manuscript.capsules.map((capsule) => (
                    <button
                      key={capsule.id}
                      type="button"
                      onClick={() => {
                        setCapsuleMenuOpen(false)
                        onCapsuleClick(capsule.id)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <Link2 size={10} className="shrink-0 text-cslab-accent" />
                      <span className="min-w-0 flex-1 truncate">{capsule.label}</span>
                      <span className="shrink-0 font-mono tabular-nums text-cslab-muted">
                        {capsule.value}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || !editor}
              title="保存到工作区 (Ctrl+S)"
              className="inline-flex h-6 items-center gap-1.5 rounded bg-cslab-accent px-2.5 text-[11px] font-medium text-white shadow-xs transition-colors hover:bg-cslab-accentHover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              保存
            </button>
            <button
              type="button"
              onClick={() => void handleSaveAs()}
              disabled={saving || !editor}
              title="另存为外部文件 (.docx / .md) (Ctrl+Shift+S)"
              className="inline-flex h-6 items-center gap-1.5 rounded border border-zinc-300 bg-white px-2.5 text-[11px] font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <Download size={11} />
              另存为…
            </button>
          </div>
        </div>

        {/* Ribbon 工具操作台 */}
        <div className="flex h-10 items-center gap-1 overflow-x-auto px-3 py-1 text-zinc-700 dark:text-zinc-300">
          {activeTab === 'home' && (
            <>
              {/* 格式刷 / 字体 */}
              <RibbonButton
                title="加粗"
                shortcut="Ctrl+B"
                active={editor?.isActive('bold')}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold size={13} />
              </RibbonButton>
              <RibbonButton
                title="斜体"
                shortcut="Ctrl+I"
                active={editor?.isActive('italic')}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic size={13} />
              </RibbonButton>
              <RibbonButton
                title="删除线"
                active={editor?.isActive('strike')}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                <Strikethrough size={13} />
              </RibbonButton>
              <RibbonButton
                title="行内代码"
                active={editor?.isActive('code')}
                onClick={() => editor?.chain().focus().toggleCode().run()}
              >
                <Code size={13} />
              </RibbonButton>

              <RibbonDivider />

              {/* 标题层次 */}
              <RibbonButton
                title="正文段落"
                active={editor?.isActive('paragraph')}
                onClick={() => editor?.chain().focus().setParagraph().run()}
              >
                <span className="text-[11px]">正文</span>
              </RibbonButton>
              <RibbonButton
                title="一级标题 (Heading 1)"
                active={editor?.isActive('heading', { level: 1 })}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                <Heading1 size={13} />
              </RibbonButton>
              <RibbonButton
                title="二级标题 (Heading 2)"
                active={editor?.isActive('heading', { level: 2 })}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 size={13} />
              </RibbonButton>
              <RibbonButton
                title="三级标题 (Heading 3)"
                active={editor?.isActive('heading', { level: 3 })}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                <Heading3 size={13} />
              </RibbonButton>

              <RibbonDivider />

              {/* 列表与引用 */}
              <RibbonButton
                title="无序列表"
                active={editor?.isActive('bulletList')}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List size={13} />
              </RibbonButton>
              <RibbonButton
                title="有序列表"
                active={editor?.isActive('orderedList')}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered size={13} />
              </RibbonButton>
              <RibbonButton
                title="引用块"
                active={editor?.isActive('blockquote')}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              >
                <Quote size={13} />
              </RibbonButton>
              <RibbonButton
                title="分割线"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              >
                <Minus size={13} />
              </RibbonButton>
            </>
          )}

          {activeTab === 'insert' && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded bg-cslab-accent/10 px-2.5 py-1 text-[11px] font-medium text-cslab-accent">
                <Sparkles size={12} />
                活体数据胶囊：直接从右侧数据表拖入任意单元格即可插入
              </span>
              <RibbonDivider />
              <RibbonButton
                title="插入横向分割线"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              >
                <Minus size={13} />
                <span className="ml-1 text-[11px]">横线</span>
              </RibbonButton>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                {CSLAB_REVIEWER_PERSONAS.map((persona) => {
                  const meta = CSLAB_PERSONA_META[persona]
                  const selected = reviewPersona === persona
                  return (
                    <button
                      key={persona}
                      type="button"
                      onClick={() => setReviewPersona(persona)}
                      className={cn(
                        'h-6 rounded px-2 text-[11px] transition-colors',
                        selected
                          ? 'text-white'
                          : 'text-cslab-muted hover:bg-cslab-surface hover:text-cslab-text',
                      )}
                      style={selected ? { background: meta.color } : undefined}
                      title={meta.title}
                    >
                      {meta.title}
                    </button>
                  )
                })}
              </div>
              <RibbonDivider />
              <button
                type="button"
                disabled={reviewBusy || !editor}
                onClick={() => void handleAiReview(reviewPersona)}
                className="inline-flex h-6 items-center gap-1 rounded bg-cslab-accent px-2 text-[11px] font-medium text-white transition-colors hover:bg-cslab-accentHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewBusy ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}
                AI 审稿
              </button>
              <button
                type="button"
                onClick={handleLocalCheck}
                className="inline-flex h-6 items-center gap-1 rounded border border-cslab-border px-2 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
                title="确定性的重复标点/重复字/超长句检查"
              >
                本地体检
              </button>
              <button
                type="button"
                onClick={() => void handleCopyPrompt()}
                className="inline-flex h-6 items-center gap-1 rounded border border-cslab-border px-2 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
                title="复制审稿指令，粘贴到任意对话窗口执行"
              >
                复制指令
              </button>
              <button
                type="button"
                onClick={() => void handlePasteSuggestions()}
                className="inline-flex h-6 items-center gap-1 rounded border border-cslab-border px-2 text-[11px] text-cslab-muted transition-colors hover:bg-cslab-surface hover:text-cslab-text"
                title="从剪贴板读取 AI 返回的审稿 JSON 并施加"
              >
                粘贴建议
              </button>
              <RibbonDivider />
              <RibbonButton
                title="显示/隐藏旁注"
                active={showMarginalia}
                onClick={() => setShowMarginalia((value) => !value)}
              >
                <span className="text-[11px]">旁注</span>
              </RibbonButton>
              <RibbonButton
                title="接受全部修订"
                disabled={suggestions.length === 0}
                onClick={() => {
                  editor?.chain().focus().acceptAllSuggestions().run()
                  setSuggestions(collectSuggestions(editor ?? null))
                  setDirty(true)
                }}
              >
                <CheckCircle2 size={12} />
                <span className="ml-1 text-[11px]">全部接受</span>
              </RibbonButton>
              <RibbonButton
                title="拒绝全部修订"
                disabled={suggestions.length === 0}
                onClick={() => {
                  editor?.chain().focus().rejectAllSuggestions().run()
                  setSuggestions(collectSuggestions(editor ?? null))
                  setDirty(true)
                }}
              >
                <AlertCircle size={12} />
                <span className="ml-1 text-[11px]">全部拒绝</span>
              </RibbonButton>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRuler(!showRuler)}
                className={cn(
                  'flex h-7 items-center gap-1.5 rounded px-2 text-[12px] transition-colors',
                  showRuler
                    ? 'bg-cslab-accent/15 text-cslab-accent'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                )}
              >
                <RulerIcon size={13} />
                <span>标尺显示</span>
              </button>
              <RibbonDivider />
              <span className="text-[11px] text-zinc-500">页面缩放：</span>
              {[75, 90, 100, 110, 125].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setZoom(preset)}
                  className={cn(
                    'h-6 rounded px-2 text-[11px] font-medium transition-colors',
                    zoom === preset
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                  )}
                >
                  {preset}%
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ===== 物理标尺 (cm 刻度) ===== */}
      {showRuler && (
        <div className="flex shrink-0 items-center justify-center border-b border-[#DDDCD5] bg-[#EBE9E3] py-0.5 select-none dark:border-[#2A2A2E] dark:bg-[#1A1A1D]">
          <div
            style={{ width: `${Math.round((794 * zoom) / 100)}px` }}
            className="relative flex h-5 items-center justify-between overflow-hidden rounded-xs border border-zinc-300 bg-white px-8 text-[9px] font-mono text-zinc-400 shadow-2xs dark:border-zinc-700 dark:bg-[#202024]"
          >
            {/* 左页边距阴影 */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-zinc-100/80 border-r border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700" />
            {/* 刻度标记 0 ~ 16 cm */}
            {Array.from({ length: 17 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[8px] leading-none text-zinc-500">{i}</span>
                <span className="h-1.5 w-px bg-zinc-300 dark:bg-zinc-600" />
              </div>
            ))}
            {/* 右页边距阴影 */}
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-zinc-100/80 border-l border-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700" />
          </div>
        </div>
      )}

      {/* ===== A4 纸张排版主桌面容器 ===== */}
      <div
        data-cslab-scroll
        className="min-h-0 flex-1 overflow-auto px-4 py-8"
        onClick={handleClick}
      >
        <div className="flex min-h-full justify-center">
          {/* A4 实体纸张白板 */}
          <div
            style={{
              width: `${Math.round((794 * zoom) / 100)}px`,
              minHeight: `${Math.round((1123 * zoom) / 100)}px`,
              transformOrigin: 'top center',
            }}
            className="flex flex-col rounded-sm border border-[#D5D3CC] bg-white px-14 py-12 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] transition-all dark:border-[#333338] dark:bg-[#1E1E22] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            {/* 论文页眉：可编辑论文大标题 */}
            <div className="mb-6 border-b border-zinc-200/90 pb-4 dark:border-zinc-800">
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setDirty(true)
                }}
                placeholder="键入论文标题…"
                aria-label="论文标题"
                className="w-full bg-transparent font-serif text-2xl font-bold tracking-tight text-zinc-900 placeholder:text-zinc-300 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-600"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                <span>CDUT Science · 学术论文活体数据绑定文档</span>
                <span className="font-mono">{manuscript.uri.split('/').pop()}</span>
              </div>
            </div>

            {/* TipTap 正文容器 */}
            <div className="min-h-0 flex-1">
              <EditorContent editor={editor} />
            </div>

            {/* A4 页面底部装订线装饰 */}
            <div className="mt-12 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-[10px] text-zinc-400 dark:border-zinc-800/80">
              <span>第 1 页</span>
              <span>成都理工大学 · CDUT Studio 科研工作台</span>
            </div>
          </div>

          {/* 审稿旁注：与纸张同处一个滚动容器，位置用 translateY 调整 */}
          <CsLabReviewMarginalia
            editor={editor ?? null}
            suggestions={suggestions}
            active={showMarginalia && suggestions.length > 0}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
          />
        </div>
      </div>

      {/* ===== Microsoft Word 经典底部状态栏 ===== */}
      <footer className="flex h-6 shrink-0 items-center justify-between border-t border-[#DDDCD5] bg-[#F7F6F2] px-4 text-[11px] text-zinc-500 select-none dark:border-[#2A2A2E] dark:bg-[#1A1A1D] dark:text-zinc-400">
        <div className="flex items-center gap-4">
          <span>第 1 页，共 {stats.pages} 页</span>
          <span className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
          <span>{stats.words.toLocaleString()} 词</span>
          <span>{stats.chars.toLocaleString()} 字符</span>
          <span className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
          <span className="inline-flex items-center gap-1 font-medium text-cslab-accent">
            <Sparkles size={11} />
            {manuscript.capsules.length} 个活体胶囊
          </span>
          {suggestions.length > 0 && (
            <>
              <span className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
              <span className="tabular-nums text-[10px] text-cslab-muted">
                {suggestions.length} 条审稿意见
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* 保存状态提示 */}
          <div className="flex items-center gap-1.5">
            {saving ? (
              <>
                <Loader2 size={11} className="animate-spin text-cslab-accent" />
                <span className="text-cslab-accent">正在保存…</span>
              </>
            ) : dirty ? (
              <>
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-600 dark:text-amber-400">有未保存修改 (Ctrl+S)</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={11} className="text-emerald-600" />
                <span className="text-zinc-400">已保存至沙箱 ({formatLastSaved(lastSavedTime)})</span>
              </>
            )}
          </div>

          <span className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />

          {/* 缩放控制器 */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              title="缩小"
              className="rounded p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ZoomOut size={12} />
            </button>
            <span className="w-9 text-center font-mono text-[10px]">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              title="放大"
              className="rounded p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ZoomIn size={12} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
