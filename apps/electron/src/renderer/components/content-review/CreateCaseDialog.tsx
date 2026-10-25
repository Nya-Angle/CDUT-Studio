/**
 * CreateCaseDialog — 新建案卷对话框（左栏「案卷管理」入口）
 *
 * 字段：标题 / 申请人 / 适用学年 / 审核类型 / 审核领域包。
 * - 审核类型取值与主进程 review-ipc.ts 的 CASE_TYPES 白名单一致（ReviewCaseType）
 * - 领域包来自 BUILTIN_DOMAIN_PACKS，随 CREATE_CASE 一次传入（缺省不写字段，由 resolveDomainPack 回落综测包）
 */

import * as React from 'react'
import { toast } from 'sonner'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@profer/ui/primitives/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@profer/ui/primitives/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@profer/ui/primitives/dropdown-menu'
import { Input } from '@profer/ui/primitives/input'
import { Label } from '@profer/ui/primitives/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@profer/ui/primitives/select'
import { BUILTIN_DOMAIN_PACKS, DEFAULT_DOMAIN_PACK_ID, resolveDomainPack } from '@profer/shared'
import type { ReviewCase, ReviewCaseType, TemplateVersion } from '@profer/shared'
import { cn } from '@/lib/utils'
import type { CreateCaseInput } from './use-review-actions'

/** 审核类型选项（与主进程 CASE_TYPES 白名单一致） */
const CASE_TYPE_OPTIONS: ReviewCaseType[] = ['综合测评', '活动申请', '自定义审核']

/** 缺省适用学年：9 月及以后算新学年（如 2026-09 → 2026-2027） */
function defaultAcademicYear(): string {
  const now = new Date()
  const startYear = now.getMonth() + 1 >= 9 ? now.getFullYear() : now.getFullYear() - 1
  return `${startYear}-${startYear + 1}`
}

interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: TemplateVersion[]
  /** 提交建卷；返回 null 表示失败（错误已由动作层写入错误条） */
  onCreate: (input: CreateCaseInput) => Promise<ReviewCase | null>
}

export function CreateCaseDialog({ open, onOpenChange, templates, onCreate }: CreateCaseDialogProps): React.ReactElement {
  const [title, setTitle] = React.useState('')
  const [applicant, setApplicant] = React.useState('')
  const [academicYear, setAcademicYear] = React.useState(defaultAcademicYear)
  const [caseType, setCaseType] = React.useState<ReviewCaseType>('综合测评')
  const [domainPackId, setDomainPackId] = React.useState<string>(DEFAULT_DOMAIN_PACK_ID)
  const [templateKey, setTemplateKey] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const selectedTemplate = templates.find((template) => `${template.templateId}@${template.version}` === templateKey)
  // 学年属于综测或显式声明该字段的模板，不应成为所有组织/项目的业务必填。
  // Main 目前仍全局强制此字段；解除 Main 约束由本地 L 线完成。
  const yearField = selectedTemplate?.fields.find((field) => field.key === 'academicYear' && (field.scope ?? 'case') === 'case')
  const showAcademicYear = caseType === '综合测评' || !!yearField
  const yearRequired = caseType === '综合测评' || yearField?.required === true

  // 每次打开重置为缺省值，避免带上一次输入
  React.useEffect(() => {
    if (!open) return
    setTitle('')
    setApplicant('')
    setAcademicYear(defaultAcademicYear())
    setCaseType('综合测评')
    setDomainPackId(DEFAULT_DOMAIN_PACK_ID)
    setTemplateKey('')
    setSubmitting(false)
  }, [open])

  // An unbound draft is an intentional native-first state. Do not force
  // the sole published template back onto an explicitly blank selection.
  const selectedPack = resolveDomainPack(domainPackId)
  const canSubmit = title.trim().length > 0 && applicant.trim().length > 0 && (!yearRequired || academicYear.trim().length > 0) && !submitting

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const created = await onCreate({
        title: title.trim(),
        type: caseType,
        applicant: applicant.trim(),
        academicYear: showAcademicYear ? academicYear.trim() : '',
        domainPackId,
        reviewTemplate: selectedTemplate ? { templateId: selectedTemplate.templateId, version: selectedTemplate.version } : null,
      })
      if (!created) return
      toast.success(`已创建审核项目：${created.title}`, {
        description: selectedTemplate
          ? '已选择模板版本；仍需独立核验来源和确认正式审核计划。'
          : '已创建未绑定正式政策的草稿；可先导入材料、人工登记待审事项。',
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>新建审核项目</DialogTitle>
          <DialogDescription>
            可先建立未绑定正式政策的原生草稿，或选择已经发布的模板版本。学年仅在综测或模板需要时填写；建案不会自动发布政策或批准审核。
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-1.5">
            <Label htmlFor="review-case-title">案卷标题</Label>
            <Input
              id="review-case-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="如：2026 年秋季学期综合素质测评"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review-create-template">审核模板（可暂不选择）</Label>
            <select
              id="review-create-template"
              aria-label="新建项目使用的审核模板"
              value={templateKey}
              onChange={(event) => setTemplateKey(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              disabled={templates.length === 0}
            >
              <option value="">先创建原生草稿（暂不绑定正式模板）</option>
              {templates.map((template) => (
                <option key={`${template.templateId}@${template.version}`} value={`${template.templateId}@${template.version}`}>
                  {template.name} · v{template.version}
                </option>
              ))}
            </select>
            {selectedTemplate
              ? <p className="text-xs text-muted-foreground">{selectedTemplate.description || '项目创建后将按此模板加载审核标准、分项和材料要求。'}</p>
              : <p className="text-xs text-muted-foreground">此草稿暂不安装正式 CanonicalPlan；材料与人工事项可先记录，自动审核须等已核验的计划和执行授权。</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="review-case-applicant">申请主体</Label>
              <Input
                id="review-case-applicant"
                value={applicant}
                onChange={(event) => setApplicant(event.target.value)}
                placeholder="如：学生、团队或实验室"
              />
            </div>
            {showAcademicYear && <div className="space-y-1.5">
              <Label htmlFor="review-case-year">适用学年{yearRequired ? ' *' : '（可选）'}</Label>
              <Input
                id="review-case-year"
                value={academicYear}
                required={yearRequired}
                onChange={(event) => setAcademicYear(event.target.value)}
                placeholder="如：2025-2026"
              />
            </div>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review-case-type">审核类型</Label>
            <Select value={caseType} onValueChange={(value) => setCaseType(value as ReviewCaseType)}>
              <SelectTrigger id="review-case-type">
                <SelectValue placeholder="选择审核类型" />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>审核领域包</Label>
            {/* 用下拉菜单而非 Select：需要在选项里同时展示包名与一句话说明 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-surface-border/60 bg-input/40 px-3 text-sm shadow-xs transition-[border-color,box-shadow,background-color] duration-150 hover:border-surface-border-strong hover:bg-input-hover/50 focus:border-focus focus:bg-input focus:outline-none focus:ring-4 focus:ring-focus/15"
                >
                  <span className="truncate">{selectedPack.name}</span>
                  <ChevronDown size={16} className="shrink-0 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[380px]">
                <DropdownMenuLabel>审核领域包（决定规则类别与问题类型）</DropdownMenuLabel>
                {BUILTIN_DOMAIN_PACKS.map((pack) => (
                  <DropdownMenuItem
                    key={pack.id}
                    onSelect={() => setDomainPackId(pack.id)}
                    className="flex items-start gap-2"
                  >
                    <Check
                      size={14}
                      className={cn('mt-0.5 shrink-0', pack.id === domainPackId ? 'opacity-100' : 'opacity-0')}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{pack.name}</span>
                      <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{pack.description}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs leading-4 text-muted-foreground">{selectedPack.description}</p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
              取消
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? '创建中…' : '创建项目'}
            </Button>
          </DialogFooter>
          {!canSubmit && !submitting && (
            <p className="text-right text-xs text-muted-foreground">项目标题、申请主体{yearRequired ? '、适用学年' : ''}为必填项；未选模板将创建原生草稿。</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
