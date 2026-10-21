/**
 * 审核操作可信指派卡片（C1：显式指派入口）
 *
 * - 「交给 Agent」按钮：为当前案卷创建结构化指派（sessionId/turnId/案卷/动作范围/工作角色）
 * - 指派列表：状态（有效/已撤销）+ 撤销按钮
 * - 会话绑定：使用当前应用会话上下文（无多会话场景用 local 单例会话标识）
 */
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@profer/ui/primitives/button'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@profer/ui/primitives/alert-dialog'

interface AssignmentRow {
  id: string
  sessionId: string
  caseId?: string
  actions: string[]
  workRole: string
  createdAt: string
  revokedAt?: string
}

/** 本地单用户场景的会话标识（多会话接入后由会话上下文替换） */
const LOCAL_SESSION_ID = 'local-main'

export function ReviewAssignmentCard({ caseId }: { caseId: string }): JSX.Element {
  const [rows, setRows] = useState<AssignmentRow[]>([])
  const [creating, setCreating] = useState(false)
  // C2：AI 代批（默认关；开启需风险确认；隐蔽放折叠区）
  const [autoApprovalOpen, setAutoApprovalOpen] = useState(false)
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const load = useCallback(async (): Promise<void> => {
    try {
      const list = await window.reviewAPI.listAssignmentsV2(LOCAL_SESSION_ID)
      setRows((list ?? []) as unknown as AssignmentRow[])
    } catch (error) {
      console.error('[V2] 指派列表加载失败', error)
    }
  }, [])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    void window.electronAPI.getSettings().then((settings) => setAutoApprovalEnabled(settings.reviewAgentAutoApproval === true)).catch(() => {})
  }, [])

  const createAssignment = useCallback(async (): Promise<void> => {
    setCreating(true)
    try {
      const created = await window.reviewAPI.createAssignmentV2({
        sessionId: LOCAL_SESSION_ID,
        turnId: `turn-${Date.now().toString(36)}`,
        caseId,
        actions: ['list', 'create-case', 'register-material', 'submit-case', 'start-run', 'get-run-status', 'cancel-run', 'export-report'],
        workRole: 'reviewer',
      })
      toast.success(`已指派给 Agent：${created.id}（操作范围：查询/建案/登记/提交/运行/导出；不含决定类）`)
      await load()
    } catch (error) {
      toast.error(`指派失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setCreating(false)
    }
  }, [caseId, load])

  const revoke = useCallback(async (assignmentId: string): Promise<void> => {
    try {
      const ok = await window.reviewAPI.revokeAssignmentV2(assignmentId)
      if (ok) { toast.success(`已撤销指派 ${assignmentId}（新写入将被拒；已完成动作保留）`) } else { toast.error('撤销失败（可能已撤销）') }
      await load()
    } catch (error) {
      toast.error(`撤销失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }, [load])

  /** 开关切换：统一走专用确认通道（通用设置通道已剥离此字段） */
  const setAutoApproval = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      const settings = await window.electronAPI.setReviewAgentAutoApproval({ enabled, grantedBy: 'local-user' })
      setAutoApprovalEnabled(settings.reviewAgentAutoApproval === true)
      toast.success(enabled ? 'AI 代批已开启（本操作已留痕）' : 'AI 代批已关闭')
    } catch (error) {
      toast.error(`设置失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  const activeCount = rows.filter((row) => !row.revokedAt && row.caseId === caseId).length

  return (
    <div className="space-y-2 rounded-lg border-t pt-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Agent 指派（显式授权）</p>
        <Button size="sm" variant="outline" disabled={creating || activeCount > 0} onClick={() => void createAssignment()}>
          {activeCount > 0 ? `已有 ${activeCount} 个有效指派` : creating ? '指派中…' : '交给 Agent'}
        </Button>
      </div>
      {rows.length === 0 && <p className="text-sm leading-5 text-muted-foreground">尚无指派。Agent 只有在你显式指派后才能操作此案卷（查询/建案/登记/提交/运行/导出；决定类始终需人工）。</p>}
      {/* C2：高级区（默认折叠——隐蔽开关要求） */}
      <div className="rounded bg-muted/20">
        <button type="button" className="w-full px-2 py-1 text-left text-xs text-muted-foreground hover:text-foreground" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? '▾' : '▸'} 高级
        </button>
        {showAdvanced && (
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-sm">AI 代批（Agent 代替你做阶段决定）</span>
            <Button size="sm" variant={autoApprovalEnabled ? 'destructive' : 'outline'} onClick={() => setAutoApprovalOpen(true)}>
              {autoApprovalEnabled ? '已开启（点击关闭）' : '关闭'}
            </Button>
          </div>
        )}
      </div>
      {rows.filter((row) => row.caseId === caseId).map((row) => (
        <div key={row.id} className="flex items-center justify-between rounded bg-muted/40 px-2.5 py-2 text-sm">
          <div className="min-w-0 flex-1">
            <span className="font-medium">{row.id}</span>
            <span className="mx-1">·</span>
            <span>{row.revokedAt ? '已撤销' : '有效'}</span>
            <span className="ml-1 text-muted-foreground">（{row.actions.length} 项动作 · {row.workRole} · {row.createdAt.slice(11, 19)}）</span>
          </div>
          {!row.revokedAt && <Button size="sm" variant="ghost" onClick={() => void revoke(row.id)}>撤销</Button>}
        </div>
      ))}
      <AlertDialog open={autoApprovalOpen} onOpenChange={setAutoApprovalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{autoApprovalEnabled ? '关闭 AI 代批？' : '开启 AI 代批？'}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                {autoApprovalEnabled ? (
                  <p>关闭后，Agent 将不能再代替你做出阶段通过/补件判定等决定（已完成的决定保留在时间线）。</p>
                ) : (
                  <>
                    <p>开启后，被你指派的 Agent 将可以代替你做出以下决定并记入案卷时间线：</p>
                    <ul className="list-inside list-disc text-xs text-muted-foreground">
                      <li>阶段通过 / 退回补件 / 退回上一阶段 / 最终驳回 / 撤回</li>
                      <li>补件判定（满足 / 不足 / 取消）</li>
                    </ul>
                    <p className="font-medium text-destructive">由此产生的审核责任由你承担。开启操作会记录时间与操作者；Agent 无法自行开启此开关。</p>
                    <p className="text-xs text-muted-foreground">模板指定的终审角色门控（teacher 终审、judge 评分等）不因开启而越过。</p>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => void setAutoApproval(!autoApprovalEnabled)}>
              {autoApprovalEnabled ? '确认关闭' : '我已知晓风险，确认开启'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
