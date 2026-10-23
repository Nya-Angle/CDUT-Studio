import { bindLocalReviewerCommand, bindLocalSubmitterCommand, deriveLocalSupplementResolverActor } from './review-ipc-actor-guard'
import { bindC0LocalCaseCommand, bindC0LocalCreateIntent, assertC0ReviewMainSender } from './review-c0-authority'
import { assertSafeReviewStorageId } from './review-storage-id'
import { registerCMainV3AuthorPlanIpc } from './review-v3-main-author-plan-ipc'
/**
 * 内容审核专区 - IPC 处理器注册
 *
 * 对应共享通道常量：packages/shared/src/types/review.ts 的 REVIEW_IPC_CHANNELS。
 * preload 侧桥接：apps/electron/src/preload/index.ts 的 reviewAPI。
 *
 * 设计决策（docs/plans/2026-10-02-content-review-demo-implementation.md D2）：
 * 独立注册函数 registerReviewIpc()，由 main/ipc.ts 的 registerIpcHandlers() 调用一次，
 * 避免向 7700+ 行的 ipc.ts 继续追加业务逻辑。
 */

import { app, dialog, ipcMain } from 'electron'
import { assertMainWindowSender } from '../ipc-sender-guard'
import { getMainWindow } from '../main-window-state'
import {
  REVIEW_MODEL_PROVIDERS,
  REVIEW_IPC_CHANNELS,
  type AssistantChatRequest,
  type ExportReportResult,
  type ImportDocumentsResult,
  type GenerateRuleOutlineRequest,
  type ReviewCase,
  type ReviewCaseType,
  type ReviewItem,
  type ReviewModelGatewayStatus,
  type ReviewModuleSettingsV2,
  type ReviewRun,
  type RuleOutlineItem,
  type SourceDocument,
  type UpdateCaseSettingsRequest,
  type UpdateRuleOutlineRequest,
  type UpdateReviewItemRequest,
} from '@profer/shared'
import {
  deleteCase,
  getCase,
  getReviewCasesDir,
  listCases,
  listRuns,
  loadDemoCase,
  saveCase,
  updateCase,
} from './case-store'
import { parseFileIntoSourceDocument } from './document-service'
import {
  extractItems,
  generateRuleOutline,
  reviewAssistantChat,
  runAiReview,
} from './ai-review-service'
import { startReviewRun } from './run-service'
import { exportReport } from './report-service'
import { getReviewModelGatewayStatus } from './review-model-gateway'
import {
  createNativeWorkspaceCaseV3, isNativeWorkspaceCaseV3, updateNativeWorkspaceSettingsV3,
  registerNativeWorkspaceMaterialV3, removeNativeWorkspaceDocumentsV3, reorderNativeWorkspaceDocumentsV3,
  updateNativeWorkspaceReviewItemV3, createNativeReviewItemV3,
} from './native-workspace-case-v3'
import { importDocumentFromPath, importDocumentsIntoCase, removeDocumentsFromCase, reorderDocumentsInCase } from './case-import'
import { invalidateDerivedReviewInputs } from './input-invalidation'
import { ensureWorkspaceAggregateV2, syncWorkspaceProjectionV2 } from './workspace-service-v2'
import { readAggregate } from './case-store-v2'
import { resolveCaseDocumentPreviewPath } from './document-preview-path'

/** 来源角色枚举（IMPORT_DOCUMENT 入参白名单） */
const SOURCE_ROLES: ReadonlySet<string> = new Set(['rule', 'application', 'evidence'])

/** 审核类型枚举（CREATE_CASE 入参白名单） */
const CASE_TYPES: ReadonlySet<string> = new Set(['综合测评', '活动申请', '自定义审核'])

/** 收窄字符串入参（非字符串 → 中文错误，IPC 边界上类型注解不生效） */
function requireString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`参数 ${name} 缺失或类型非法`)
  }
  return value
}

/**
 * AUTH-06 / 旧写通道兼容边界：冻结 CanonicalPlan 的案卷已由 T05/T07 新权威
 * 通道办理，旧 CAST_RATING / 合成 stage-decision 不得再改写该案卷的新权威状态。
 */
function assertLegacyChannelNotSuperseded(caseId: string, channel: string): void {
  const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
  if (getCaseV2Aggregate(caseId)?.canonicalPlan) {
    throw new Error(`${channel} 已被冻结 CanonicalPlan 的新权威通道取代；旧兼容写不得改写新权威`)
  }
  // 已进入批次评分的案卷，评分权威是 T07 评分轮次；旧 CAST_RATING 平行写会
  // 产生两套票面，必须在入口明确拒绝而不是静默分叉。
  if (channel !== REVIEW_IPC_CHANNELS.CAST_RATING_V2) return
  const { listBatchStatesV2 } = require('./batch-store') as typeof import('./batch-store')
  const active = listBatchStatesV2().find((state) => state.batch.caseIds.includes(caseId))
  if (active) {
    throw new Error(`该案卷属于批次 ${active.batch.id}，评分必须走 T07 评分通道；旧 CAST_RATING 不得并行记分`)
  }
}

/**
 * 注册内容审核专区全部 IPC 处理器。
 *
 * 由 registerIpcHandlers() 在应用启动时调用一次（幂等由外层守卫保证）。
 */
export function registerReviewIpc(): void {
  // Dev-C C-MAIN-WIRE: real Main channels, fail closed without independent
  // B1 current author grant and an authorized published school Plan issuer.
  registerCMainV3AuthorPlanIpc()

  // 启动恢复：上次进程遗留的 queued/running 运行标 interrupted（08 设计 §5）
  try {
    const { markStaleRunsInterrupted } = require('./run-store-v2') as typeof import('./run-store-v2')
    const recovered = markStaleRunsInterrupted()
    if (recovered > 0) console.log(`[审核V2] 启动恢复：${recovered} 个中断运行已标记（可续跑）`)
  } catch (error) {
    console.warn('[审核V2] 启动恢复检查失败:', error)
  }
  // ===== 案卷管理 =====

  /** 载入演示案卷（首次复制进配置目录，之后读存储） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.LOAD_DEMO_CASE, async (): Promise<ReviewCase> => {
    const reviewCase = loadDemoCase()
    await ensureWorkspaceAggregateV2(reviewCase.id)
    return reviewCase
  })

  /** 列出已存储案卷（摘要） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_CASES, () => {
    return listCases()
  })

  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_RUNS, (_event, caseId: string): ReviewRun[] => {
    if (typeof caseId !== 'string' || !caseId) throw new Error('参数 caseId 非法')
    return listRuns(caseId)
  })

  /** 读取单个案卷 */
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_CASE, (_event, caseId: string): ReviewCase | undefined => {
    return getCase(caseId)
  })

  /** 创建空案卷 */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.CREATE_CASE,
    async (
      event,
      input: {
        title: string
        type: ReviewCaseType
        applicant: string
        /** 通用 V3 草稿案卷可省略；综测等按学年组织评审的领域仍必须提供。 */
        academicYear?: string
        domainPackId?: string
        reviewTemplate?: { templateId: string; version: number } | null
      },
    ): Promise<ReviewCase> => {
      assertC0ReviewMainSender(event)
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      if (!CASE_TYPES.has(input.type)) throw new Error(`参数 type 非法：${String(input.type)}`)
      // 明示未知领域由 C native creator 拒绝；不静默安装缺省审核政策
      if (input.domainPackId !== undefined && typeof input.domainPackId !== 'string') {
        throw new Error('参数 domainPackId 类型非法')
      }
      if (input.reviewTemplate !== undefined && input.reviewTemplate !== null) {
        const { templateId, version } = input.reviewTemplate
        if (typeof templateId !== 'string' || !templateId || !Number.isInteger(version) || version < 1) {
          throw new Error('参数 reviewTemplate 非法')
        }
        const { getTemplate } = require('./template-store') as typeof import('./template-store')
        const template = getTemplate(templateId, version)
        if (!template || template.status !== 'published') throw new Error('只能使用已发布的审核模板创建项目')
      }
      // C-owned native-first V2 writer, single atomic Case + create Receipt.
      // No legacy case.json is ever written; the V1-shaped result is view-only.
      const created = await createNativeWorkspaceCaseV3({
        title: requireString(input.title, 'title'),
        type: input.type,
        applicant: requireString(input.applicant, 'applicant'),
        // 学年按领域判定（见 createNativeWorkspaceCaseV3），此处不再全局强制
        ...(input.academicYear === undefined
          ? {}
          : { academicYear: requireString(input.academicYear, 'academicYear') }),
        ...(input.domainPackId ? { domainPackId: input.domainPackId } : {}),
        ...(input.reviewTemplate !== undefined ? { reviewTemplate: input.reviewTemplate } : {}),
      }, undefined, () => assertC0ReviewMainSender(event))
      return created.view
    },
  )

  /** 更新案卷设置（领域包 / 标题 / 类型 / 待审主体文档） */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.UPDATE_CASE_SETTINGS,
    async (event, input: UpdateCaseSettingsRequest): Promise<ReviewCase> => {
      assertC0ReviewMainSender(event)
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      const caseId = requireString(input.caseId, 'caseId')
      // A frozen native Plan may only change through a C-owned versioned ACK
      // command; mutating legacy settings first would leave two contrary
      // template/source truths if a later projection rejects the write.
      const aggregate = readAggregate(caseId)
      if (isNativeWorkspaceCaseV3(aggregate)) {
        // Native-only business settings never write a V1 shadow.
        return updateNativeWorkspaceSettingsV3(caseId, input, undefined, () => assertC0ReviewMainSender(event))
      }
      if (aggregate && !aggregate.receiptLog?.some(receipt => receipt.type === 'EnsureReviewWorkspaceAggregate')) {
        throw new Error('原生审核案卷禁止通过旧版案卷写入口修改；请使用可信 V2 业务命令')
      }
      if (aggregate?.canonicalPlan || aggregate?.d2RuntimePlan) {
        if (input.reviewTemplate !== undefined || input.domainPackId !== undefined ||
          input.manualRules !== undefined || input.subjectDocumentIds !== undefined) {
          throw new Error('审核计划已冻结；修改模板、规则或材料范围须使用原生 V2 升版与确认命令')
        }
      }
      const reviewCase = getCase(caseId)
      if (!reviewCase) throw new Error(`案卷不存在: ${caseId}`)
      if (input.type !== undefined && !CASE_TYPES.has(input.type)) {
        throw new Error(`参数 type 非法：${String(input.type)}`)
      }
      if (input.domainPackId !== undefined && typeof input.domainPackId !== 'string') {
        throw new Error('参数 domainPackId 类型非法')
      }
      if (input.title !== undefined && typeof input.title !== 'string') {
        throw new Error('参数 title 类型非法')
      }
      let reviewTemplate: ReviewCase['reviewTemplate'] | null | undefined
      if (input.reviewTemplate !== undefined) {
        if (input.reviewTemplate === null) {
          reviewTemplate = null
        } else {
          const selected = input.reviewTemplate
          if (!selected || typeof selected !== 'object'
            || typeof selected.templateId !== 'string'
            || !Number.isInteger(selected.version) || selected.version < 1) {
            throw new Error('审核模板参数非法')
          }
          const { getTemplate, isSafeTemplateId } = require('./template-store') as typeof import('./template-store')
          if (!isSafeTemplateId(selected.templateId)) throw new Error('审核模板参数非法')
          const template = getTemplate(selected.templateId, selected.version)
          if (!template || template.status !== 'published') {
            throw new Error('只能载入已发布的审核模板版本')
          }
          reviewTemplate = { templateId: selected.templateId, version: selected.version }
        }
      }
      let manualRules: ReviewCase['manualRules'] | undefined
      if (input.manualRules !== undefined) {
        if (!Array.isArray(input.manualRules) || input.manualRules.length > 100) {
          throw new Error('手写规则必须是 100 条以内的列表')
        }
        const seenRuleIds = new Set<string>()
        manualRules = input.manualRules.map((rule, index) => {
          if (!rule || typeof rule !== 'object'
            || typeof rule.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(rule.id)
            || seenRuleIds.has(rule.id)
            || typeof rule.title !== 'string' || rule.title.trim().length === 0 || rule.title.length > 160
            || typeof rule.requirement !== 'string' || rule.requirement.trim().length === 0 || rule.requirement.length > 8000) {
            throw new Error(`第 ${index + 1} 条手写规则无效`)
          }
          seenRuleIds.add(rule.id)
          return { id: rule.id, title: rule.title.trim(), requirement: rule.requirement.trim() }
        })
      }
      // 待审主体文档：逐个校验是否属于本卷，防止悬空 ID 让三栏联动指向不存在的文档
      let subjectDocumentIds: string[] | undefined
      if (input.subjectDocumentIds !== undefined) {
        if (!Array.isArray(input.subjectDocumentIds) || input.subjectDocumentIds.some((id) => typeof id !== 'string')) {
          throw new Error('参数 subjectDocumentIds 类型非法')
        }
        const known = new Set(reviewCase.documents.map((doc) => doc.id))
        subjectDocumentIds = input.subjectDocumentIds.filter((id) => known.has(id))
        if (subjectDocumentIds.length !== input.subjectDocumentIds.length) {
          throw new Error('待审主体文档包含不属于本案卷的文档 ID')
        }
      }
      // M0/H05：设置变更走逐案串行写队列（读最新 → 定向 patch → revision+1），
      // 避免校验期间的其他写回（导入/大纲/识别）被整案快照覆盖
      const updated = await updateCase(
        caseId,
        (fresh) => {
          const domainPackChanged = input.domainPackId !== undefined
            && (fresh.domainPackId ?? 'comprehensive-assessment') !== input.domainPackId
          const subjectDocumentsChanged = subjectDocumentIds !== undefined
            && JSON.stringify(fresh.subjectDocumentIds ?? []) !== JSON.stringify(subjectDocumentIds)
          return {
            ...invalidateDerivedReviewInputs(fresh, { domainPackChanged, subjectDocumentsChanged }),
            ...(input.title !== undefined ? { title: input.title.trim() || fresh.title } : {}),
            ...(input.type !== undefined ? { type: input.type } : {}),
            ...(input.domainPackId !== undefined ? { domainPackId: input.domainPackId } : {}),
            ...(subjectDocumentIds !== undefined ? { subjectDocumentIds } : {}),
            ...(reviewTemplate !== undefined ? { reviewTemplate: reviewTemplate ?? undefined } : {}),
            ...(manualRules !== undefined ? { manualRules } : {}),
          }
        },
        { reason: `更新案卷审核设置${input.domainPackId ? `（领域包 ${input.domainPackId}）` : ''}` },
      )
      await syncWorkspaceProjectionV2(caseId)
      return updated
    },
  )

  ipcMain.handle(REVIEW_IPC_CHANNELS.UPDATE_RULE_OUTLINE, async (_event, input: UpdateRuleOutlineRequest): Promise<ReviewCase> => {
    if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
    const caseId = requireString(input.caseId, 'caseId')
    if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
      throw new Error('NATIVE_RULE_OUTLINE_SOURCE_REQUIRED: 原生规则摘要必须先与原件版本、来源锚点和正式规则提案建立绑定')
    const rulePackId = requireString(input.rulePackId, 'rulePackId')
    const ruleId = requireString(input.ruleId, 'ruleId')
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.length > 160) throw new Error('规则名称不能为空且不能超过 160 字')
    if (typeof input.summary !== 'string' || input.summary.length > 8000) throw new Error('规则摘要不能超过 8000 字')
    const updated = await updateCase(caseId, (fresh) => {
      const pack = fresh.rulePacks.find((item) => item.id === rulePackId)
      if (!pack || !pack.outline.some((item) => item.id === ruleId)) throw new Error('规则摘要不存在或已被移除，请刷新后重试')
      return {
        ...fresh,
        rulePacks: fresh.rulePacks.map((item) => item.id === rulePackId
          ? { ...item, outline: item.outline.map((rule) => rule.id === ruleId ? { ...rule, title: input.title.trim(), summary: input.summary.trim() } : rule) }
          : item),
      }
    }, { reason: `手动调整规则摘要 ${ruleId}` })
    await syncWorkspaceProjectionV2(caseId)
    return updated
  })

  ipcMain.handle(REVIEW_IPC_CHANNELS.UPDATE_REVIEW_ITEM, async (_event, input: UpdateReviewItemRequest): Promise<ReviewCase> => {
    if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
    const caseId = requireString(input.caseId, 'caseId')
    const itemId = requireString(input.itemId, 'itemId')
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.length > 160) throw new Error('申报事项名称不能为空且不能超过 160 字')
    if (typeof input.category !== 'string' || !input.category.trim() || input.category.length > 80) throw new Error('申报事项类别不能为空且不能超过 80 字')
    if (typeof input.declaredScore !== 'number' || !Number.isFinite(input.declaredScore) || input.declaredScore < 0 || input.declaredScore > 1000000) throw new Error('申报分值必须是 0 至 1000000 之间的数字')
    for (const [field, value, maxLength] of [
      ['level', input.level, 100],
      ['activityDate', input.activityDate, 80],
      ['organizer', input.organizer, 200],
    ] as const) {
      if (value !== undefined && (typeof value !== 'string' || value.length > maxLength)) throw new Error(`申报事项${field}字段无效`)
    }
    if (isNativeWorkspaceCaseV3(readAggregate(caseId))) {
      assertC0ReviewMainSender(_event)
      return updateNativeWorkspaceReviewItemV3(caseId, input, undefined, () => assertC0ReviewMainSender(_event))
    }
    const updated = await updateCase(caseId, (fresh) => {
      if (!fresh.items.some((item) => item.id === itemId)) throw new Error('申报事项已不存在，请刷新后重试')
      return {
        ...fresh,
        items: fresh.items.map((item) => item.id === itemId ? {
          ...item,
          title: input.title.trim(),
          category: input.category.trim(),
          declaredScore: input.declaredScore,
          ...(input.level?.trim() ? { level: input.level.trim() } : { level: undefined }),
          ...(input.activityDate?.trim() ? { activityDate: input.activityDate.trim() } : { activityDate: undefined }),
          ...(input.organizer?.trim() ? { organizer: input.organizer.trim() } : { organizer: undefined }),
          status: 'confirmed',
          identifiedBy: 'manual',
        } : item),
      }
    }, { reason: `人工修正申报事项 ${itemId}` })
    await syncWorkspaceProjectionV2(caseId)
    return updated
  })

  /**
   * Only C's Main grants actor and serialized source-authentication. The
   * Renderer supplies an opaque requestId (idempotency only), never a
   * trusted SourceIdentity, Case writer, SchoolPort authority or Actor.
   */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.CREATE_NATIVE_REVIEW_ITEM_V3,
    async (event, input: import('@profer/shared').CreateNativeReviewItemV3Request): Promise<ReviewCase> => {
      assertC0ReviewMainSender(event)
      if (!input || typeof input !== 'object' || Array.isArray(input))
        throw new Error('原生人工事项输入非法')
      if (Object.prototype.hasOwnProperty.call(input, 'actor') ||
          Object.prototype.hasOwnProperty.call(input, 'principal') ||
          Object.prototype.hasOwnProperty.call(input, 'sourceIdentity'))
        throw new Error('ACTOR_UNTRUSTED: Renderer 不得指定 Main 身份或来源证书')
      requireString(input.caseId, 'caseId')
      return createNativeReviewItemV3(input, undefined,
        () => assertC0ReviewMainSender(event))
    },
  )

  ipcMain.handle(REVIEW_IPC_CHANNELS.CONFIRM_RULE_PACK, async (_event, input: { caseId: string; rulePackId: string }): Promise<ReviewCase> => {
    const caseId = requireString(input?.caseId, 'caseId')
    if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
      throw new Error('NATIVE_RULE_CONFIRMATION_REQUIRED: 规则包确认必须使用 C-owned 原件验证和计划发布事务')
    const rulePackId = requireString(input?.rulePackId, 'rulePackId')
    const { confirmRulePackInCase } = require('./case-import') as typeof import('./case-import')
    return confirmRulePackInCase(caseId, rulePackId)
  })

  /** 导入文件到案卷（系统选择框 → 解析为 SourceDocument 并写回案卷） */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT,
    async (_event, input: { caseId: string; role: SourceDocument['role']; requestId?: string }): Promise<ImportDocumentsResult> => {
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      if (!SOURCE_ROLES.has(input.role)) throw new Error(`参数 role 非法：${String(input.role)}`)
      const caseId = requireString(input.caseId, 'caseId')
      if (isNativeWorkspaceCaseV3(readAggregate(caseId))) {
        assertC0ReviewMainSender(_event)
        const { BrowserWindow, dialog } = require('electron') as typeof import('electron')
        const parent = BrowserWindow.fromWebContents(_event.sender) ?? undefined
        const options = { properties: ['openFile', 'multiSelections'] as Array<'openFile' | 'multiSelections'> }
        const picked = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options)
        assertC0ReviewMainSender(_event) // window/Frame may have changed while picker was open
        if (picked.canceled) return { documents: [], failures: [], canceled: true }
        const documents: SourceDocument[] = []
        const failures: ImportDocumentsResult['failures'] = []
        for (const sourcePath of picked.filePaths) {
          try {
            const document = await registerNativeWorkspaceMaterialV3(caseId, sourcePath, input.role, undefined, () => assertC0ReviewMainSender(_event))
            assertC0ReviewMainSender(_event)
            documents.push(document)
          } catch (error) {
            failures.push({
              fileName: require('node:path').basename(sourcePath),
              message: error instanceof Error ? error.message : String(error),
            })
          }
        }
        return { documents, failures, canceled: false }
      }
      const { BrowserWindow } = require('electron') as typeof import('electron')
      const sender = _event.sender
      return importDocumentsIntoCase({
        caseId: requireString(input.caseId, 'caseId'),
        role: input.role,
        parentWindow: BrowserWindow.fromWebContents(_event.sender) ?? undefined,
        requestId: typeof input.requestId === 'string' ? input.requestId : undefined,
        onProgress: (progress) => {
          if (!sender.isDestroyed()) sender.send(REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_PROGRESS, progress)
        },
      })
    },
  )

  /** 开发版 UI 自动化/模型验收入口；正式构建仍只允许由系统文件选择框授权路径。 */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_FROM_PATH,
    async (_event, input: { caseId: string; sourcePath: string; role: SourceDocument['role']; requestId?: string }): Promise<SourceDocument> => {
      if (app.isPackaged) throw new Error('路径直导仅在开发版可用')
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      if (!SOURCE_ROLES.has(input.role)) throw new Error(`参数 role 非法：${String(input.role)}`)
      const sourcePath = requireString(input.sourcePath, 'sourcePath')
      const caseId = requireString(input.caseId, 'caseId')
      if (isNativeWorkspaceCaseV3(readAggregate(caseId))) {
        assertC0ReviewMainSender(_event)
        const result = await registerNativeWorkspaceMaterialV3(caseId, sourcePath, input.role)
        assertC0ReviewMainSender(_event)
        return result
      }
      const sender = _event.sender
      return importDocumentFromPath({
        caseId: requireString(input.caseId, 'caseId'),
        sourcePath,
        role: input.role,
        requestId: typeof input.requestId === 'string' ? input.requestId : undefined,
        onProgress: (progress) => {
          if (!sender.isDestroyed()) sender.send(REVIEW_IPC_CHANNELS.IMPORT_DOCUMENT_PROGRESS, progress)
        },
      })
    },
  )

  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_IMAGE_PREVIEW_PATH, (_event, input: { caseId: string; documentId: string; blockId: string }): string | null => {
    if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
    const caseId = requireString(input.caseId, 'caseId')
    const documentId = requireString(input.documentId, 'documentId')
    const blockId = requireString(input.blockId, 'blockId')
    const reviewCase = getCase(caseId)
    const document = reviewCase?.documents.find((item) => item.id === documentId)
    const block = document?.blocks.find((item) => item.id === blockId)
    if (!reviewCase || !document || !block || block.kind !== 'image') return null

    const { existsSync, realpathSync, statSync } = require('node:fs') as typeof import('node:fs')
    const { isAbsolute, join, relative, resolve, sep } = require('node:path') as typeof import('node:path')
    const caseRoot = resolve(getReviewCasesDir(), caseId)
    const assetPath = block.imageAssetPath ?? join('source-docs', `${document.id}-${document.fileName}`)
    const candidate = isAbsolute(assetPath) ? resolve(assetPath) : resolve(caseRoot, assetPath)
    try {
      if (!existsSync(candidate)) return null
      const rootReal = realpathSync(caseRoot)
      const assetReal = realpathSync(candidate)
      const insidePath = relative(rootReal, assetReal)
      if (!insidePath || insidePath === '..' || insidePath.startsWith(`..${sep}`) || isAbsolute(insidePath)) return null
      const info = statSync(assetReal)
      if (!info.isFile() || info.size > 50 * 1024 * 1024) return null
      return assetReal
    } catch {
      return null
    }
  })

  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_WORKSPACE_DOCUMENT_PREVIEW_PATH, (_event, input: { caseId: string; documentVersionId: string }): string | null => {
    if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
    const caseId = requireString(input.caseId, 'caseId')
    const documentVersionId = requireString(input.documentVersionId, 'documentVersionId')
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(caseId)) throw new Error('参数 caseId 非法')
    const { readAggregate } = require('./case-store-v2') as typeof import('./case-store-v2')
    const aggregate = readAggregate(caseId)
    const caseRoot = require('node:path').resolve(getReviewCasesDir(), caseId) as string
    return resolveCaseDocumentPreviewPath(caseRoot, aggregate, documentVersionId)
  })

  /** 从当前审核输入中移除一份或某一角色的全部材料；保留案卷内原件。 */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.REMOVE_DOCUMENTS,
    (_event, input: { caseId: string; role: SourceDocument['role']; documentIds?: string[] }): Promise<ReviewCase> => {
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      if (!SOURCE_ROLES.has(input.role)) throw new Error(`参数 role 非法：${String(input.role)}`)
      if (input.documentIds !== undefined && (!Array.isArray(input.documentIds) || input.documentIds.some((id) => typeof id !== 'string'))) {
        throw new Error('参数 documentIds 类型非法')
      }
      const caseId = requireString(input.caseId, 'caseId')
      if (isNativeWorkspaceCaseV3(readAggregate(caseId))) {
        assertC0ReviewMainSender(_event)
        return removeNativeWorkspaceDocumentsV3(caseId, input.role, input.documentIds, undefined, () => assertC0ReviewMainSender(_event))
      }
      return removeDocumentsFromCase({
        caseId,
        role: input.role,
        ...(input.documentIds !== undefined ? { documentIds: input.documentIds.map((id) => requireString(id, 'documentId')) } : {}),
      })
    },
  )

  /** 更新同一材料栏的呈现与审核顺序。 */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.REORDER_DOCUMENTS,
    (_event, input: { caseId: string; role: SourceDocument['role']; documentIds: string[] }): Promise<ReviewCase> => {
      if (!input || typeof input !== 'object') throw new Error('参数 input 缺失或类型非法')
      if (!SOURCE_ROLES.has(input.role)) throw new Error(`参数 role 非法：${String(input.role)}`)
      if (!Array.isArray(input.documentIds) || input.documentIds.some((id) => typeof id !== 'string')) {
        throw new Error('参数 documentIds 类型非法')
      }
      const caseId = requireString(input.caseId, 'caseId')
      if (isNativeWorkspaceCaseV3(readAggregate(caseId))) {
        assertC0ReviewMainSender(_event)
        return reorderNativeWorkspaceDocumentsV3(caseId, input.role, input.documentIds, undefined, () => assertC0ReviewMainSender(_event))
      }
      return reorderDocumentsInCase({
        caseId,
        role: input.role,
        documentIds: input.documentIds.map((id) => requireString(id, 'documentId')),
      })
    },
  )

  /** 查询最近一次运行及输入有效性（M0/H09：恢复 + 过期标记） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.LATEST_RUN, (_event, caseId: string) => {
    if (typeof caseId !== 'string' || caseId.length === 0) throw new Error('参数 caseId 非法')
    // 惰性引入避免与 run-service 的模块初始化顺序耦合（与 GET_RUN 同款做法）
    const { getLatestRunStatus } = require('./run-service') as typeof import('./run-service')
    return getLatestRunStatus(caseId)
  })

  // ===== V2 通道（M5：全部薄委托，服务层见 review-v2 系列文件） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_TEMPLATES_V2, () => {
    const { listTemplates } = require('./template-store') as typeof import('./template-store')
    return listTemplates()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_TEMPLATE_VERSIONS_V2, () => {
    const { listTemplateVersions } = require('./template-store') as typeof import('./template-store')
    return listTemplateVersions()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_ARCHIVED_TEMPLATES_V2, () => {
    const { listArchivedTemplates } = require('./template-store') as typeof import('./template-store')
    return listArchivedTemplates()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.REORDER_TEMPLATES_V2, (_e, templateIds: string[]) => {
    if (!Array.isArray(templateIds) || templateIds.some((id) => typeof id !== 'string')) throw new Error('模板顺序参数非法')
    const { reorderTemplates } = require('./template-store') as typeof import('./template-store')
    return reorderTemplates(templateIds)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.REMOVE_TEMPLATE_V2, (_e, templateId: string) => {
    if (typeof templateId !== 'string' || !templateId) throw new Error('参数 templateId 非法')
    const { removeTemplateFromLibrary } = require('./template-store') as typeof import('./template-store')
    removeTemplateFromLibrary(templateId)
    return true
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RESTORE_TEMPLATE_V2, (_e, templateId: string) => {
    if (typeof templateId !== 'string' || !templateId) throw new Error('参数 templateId 非法')
    const { restoreTemplateToLibrary } = require('./template-store') as typeof import('./template-store')
    return restoreTemplateToLibrary(templateId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_TEMPLATE_V2, (_e, templateId: string, version?: number) => {
    if (typeof templateId !== 'string' || !templateId) throw new Error('参数 templateId 非法')
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    return getTemplate(templateId, version)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.PUBLISH_TEMPLATE_V2, (_e, templateId: string, version: number) => {
    if (typeof templateId !== 'string' || !templateId || !Number.isFinite(version)) throw new Error('参数非法')
    const { publishTemplate } = require('./template-store') as typeof import('./template-store')
    return publishTemplate(templateId, version)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_RUNS_V2, (_e, caseId: string) => {
    assertSafeReviewStorageId(caseId, 'caseId')
    const { listRunsV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
    const { reconcilePiReviewRunsWithReadReceipts } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
    return reconcilePiReviewRunsWithReadReceipts(caseId, listRunsV2(caseId))
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_RUN_V2, (_e, input: { caseId: string; runId: string }) => {
    assertSafeReviewStorageId(input?.caseId, 'caseId')
    assertSafeReviewStorageId(input?.runId, 'runId')
    const { getRunV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
    return getRunV2(input.caseId, input.runId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.CANCEL_RUN_V2, (_e, runId: string) => {
    if (typeof runId !== 'string' || !runId) throw new Error('参数 runId 非法')
    const { cancelRunV2 } = require('./run-service-v2') as typeof import('./run-service-v2')
    cancelRunV2(runId)
    return true
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.MIGRATE_CASE_V2, async (_e, caseId: string) => {
    if (typeof caseId !== 'string' || !caseId) throw new Error('参数 caseId 非法')
    const { getCase } = require('./case-store') as typeof import('./case-store')
    const { migrateCaseToV2 } = require('./migration') as typeof import('./migration')
    const current = readAggregate(caseId)
    if (isNativeWorkspaceCaseV3(current) && current) {
      return { migrated: true, note: '原生 V2 案卷不需要 V1 迁移或旧版影子文件', caseV2: current.caseV2 }
    }
    const v1 = getCase(caseId)
    if (!v1) throw new Error(`案卷不存在: ${caseId}`)
    const result = migrateCaseToV2(v1)
    if (result.caseV2) await ensureWorkspaceAggregateV2(caseId)
    return result
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.BOOT_CHECK_V2, () => {
    const { runBootCheckV2 } = require('./boot-check') as typeof import('./boot-check')
    return runBootCheckV2()
  })

  // ===== N1d：V2 应用命令（薄委托 application-service / fixture） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.SEED_FIXTURE_V2, () => {
    const { seedComprehensiveFixture, publishComprehensiveFixture } = require('./fixtures/comprehensive-fixture') as typeof import('./fixtures/comprehensive-fixture')
    const { getTemplate, saveDraft, publishTemplate } = require('./template-store') as typeof import('./template-store')
    seedComprehensiveFixture({ getTemplate, saveDraft })
    publishComprehensiveFixture({ getTemplate, saveDraft, publish: publishTemplate })
    return true
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.CREATE_CASE_V2, (event, input: { caseId: string; templateId: string; version: number; payload: unknown; actor?: import('@profer/shared').Actor; requestId?: string; expectedRevision?: number }) => {
    if (!input?.templateId) throw new Error('参数非法')
    assertSafeReviewStorageId(input?.caseId, 'caseId')
    const command = bindC0LocalCreateIntent(event, input)
    const { createCaseC0 } = require('./review-c0-case-service') as typeof import('./review-c0-case-service')
    return createCaseC0(command as Parameters<typeof createCaseC0>[0], input.templateId, input.version)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_AGGREGATE_V2, (_e, caseId: string) => {
    assertSafeReviewStorageId(caseId, 'caseId')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    return getCaseV2Aggregate(caseId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.UPDATE_FIELDS_V2, (event, input: { caseId: string; command: import('@profer/shared').ReviewCommandV2<unknown> }) => {
    const command = bindC0LocalCaseCommand(event, input?.caseId, 'UPDATE_FIELDS_V2', input?.command)
    const { updateFieldsC0 } = require('./review-c0-case-service') as typeof import('./review-c0-case-service')
    return updateFieldsC0(command as Parameters<typeof updateFieldsC0>[0])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.EXPORT_REPORT_V2, (_e, caseId: string) => {
    if (typeof caseId !== 'string' || !caseId) throw new Error('参数 caseId 非法')
    // 薄委托共享导出服务（08 设计：IPC 与 Agent 工具同服务函数）
    const { exportCaseReport } = require('./report-export-v2-service') as typeof import('./report-export-v2-service')
    return exportCaseReport(caseId)
  })
  // ===== C1：审核操作可信指派（显式指派是 Agent 写权限唯一来源） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.ASSIGNMENT_CREATE_V2, (_e, input: { sessionId: string; turnId: string; caseId?: string; templateId?: string; templateVersion?: number; actions: string[]; workRole?: 'reviewer' | 'student' }) => {
    if (!input || typeof input !== 'object' || !input.sessionId || !input.turnId) throw new Error('指派必须绑定会话与用户轮次')
    const { assertOrdinaryAgentSession } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    assertOrdinaryAgentSession(input.sessionId)
    const { createAssignment } = require('./review-agent-assignment') as typeof import('./review-agent-assignment')
    return createAssignment({ sessionId: input.sessionId, turnId: input.turnId, caseId: input.caseId, templateId: input.templateId, templateVersion: input.templateVersion, actions: input.actions as never, workRole: input.workRole })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.ASSIGNMENT_REVOKE_V2, (_e, assignmentId: string) => {
    if (typeof assignmentId !== 'string' || !assignmentId) throw new Error('参数 assignmentId 非法')
    const { revokeAssignment, listAssignments } = require('./review-agent-assignment') as typeof import('./review-agent-assignment')
    const { assertOrdinaryAgentSession } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    const assignment = listAssignments().find((item) => item.id === assignmentId)
    if (assignment) assertOrdinaryAgentSession(assignment.sessionId)
    return revokeAssignment(assignmentId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.ASSIGNMENT_LIST_V2, (_e, sessionId?: string) => {
    const { listAssignments } = require('./review-agent-assignment') as typeof import('./review-agent-assignment')
    const { isReviewOwnedOrDeletedAgentSessionId } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    return listAssignments(sessionId).filter((item) => !isReviewOwnedOrDeletedAgentSessionId(item.sessionId))
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.CASE_TIMELINE_V2, (_e, input: { caseId: string; filterOperator?: 'human' | 'agent' | 'mock' | 'school' | 'system' | 'unknown' }) => {
    if (!input || typeof input !== 'object' || typeof input.caseId !== 'string' || !input.caseId) throw new Error('参数 caseId 非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const { buildCaseTimeline } = require('./case-timeline') as typeof import('./case-timeline')
    const { listRunsV2 } = require('./run-store-v2') as typeof import('./run-store-v2')
    const { reconcilePiReviewRunsWithReadReceipts } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error(`案卷聚合不存在: ${input.caseId}`)
    const runs = reconcilePiReviewRunsWithReadReceipts(input.caseId, listRunsV2(input.caseId))
    return buildCaseTimeline(aggregate, runs, input.filterOperator)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_RUN_OBSERVATIONS_V2, (_e, caseId: string) => {
    assertSafeReviewStorageId(caseId, 'caseId')
    const { listRunsV2, readArtifact } = require('./run-store-v2') as typeof import('./run-store-v2')
    const runs = listRunsV2(caseId).filter((run) => run.status === 'completed' || run.status === 'partially-completed')
    if (runs.length === 0) return []
    // 取最近完成运行的 extract 产物观察（真实模型抽取结果，含 sourceRefs 与 confirmed 标记）
    const runId = runs[0]!.id
    const artifact = readArtifact<{ observations?: Array<{ subjectId: string; fieldKey: string; value: unknown; sourceRefs?: Array<{ documentVersionId: string; quote?: string }>; extractedBy?: string; confirmed?: boolean; confidence?: number }> }>(caseId, runId, 'node-auto-check-extract')
    return (artifact?.observations ?? []) as Array<Record<string, unknown>>
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_WORKSPACE_RUN_VALIDITY_V2, (_e, input: { caseId: string; runId: string }) => {
    if (!input?.caseId || !input?.runId) throw new Error('参数非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const { isWorkspaceRunStaleV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    const aggregate = getCaseV2Aggregate(input.caseId)
    return !aggregate || isWorkspaceRunStaleV2(aggregate, input.runId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.UPSERT_CASE_SUBJECT_V2, (event, input: { caseId: string; command: import('@profer/shared').ReviewCommandV2<unknown> }) => {
    const command = bindC0LocalCaseCommand(event, input?.caseId, 'UPSERT_CASE_SUBJECT_V2', input?.command)
    const { upsertCaseSubjectC0 } = require('./review-c0-case-service') as typeof import('./review-c0-case-service')
    return upsertCaseSubjectC0(command as Parameters<typeof upsertCaseSubjectC0>[0])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.CORRECT_OBSERVATION_V2, (event, input: { caseId: string; command: import('@profer/shared').ReviewCommandV2<unknown> }) => {
    const command = bindC0LocalCaseCommand(event, input?.caseId, 'CORRECT_OBSERVATION_V2', input?.command)
    const { correctObservationC0 } = require('./review-c0-case-service') as typeof import('./review-c0-case-service')
    return correctObservationC0(command as Parameters<typeof correctObservationC0>[0])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.SET_EVIDENCE_LINK_V2, (event, input: { caseId: string; command: import('@profer/shared').ReviewCommandV2<unknown> }) => {
    const command = bindC0LocalCaseCommand(event, input?.caseId, 'SET_EVIDENCE_LINK_V2', input?.command)
    const { setEvidenceLinkC0 } = require('./review-c0-case-service') as typeof import('./review-c0-case-service')
    return setEvidenceLinkC0(command as Parameters<typeof setEvidenceLinkC0>[0])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RECORD_WORKSPACE_DISPOSITION_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { recordWorkspaceDispositionV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    return recordWorkspaceDispositionV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof recordWorkspaceDispositionV2>[1])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.OPEN_WORKSPACE_SUPPLEMENT_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { openWorkspaceSupplementV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    return openWorkspaceSupplementV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof openWorkspaceSupplementV2>[1])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.ACKNOWLEDGE_WORKSPACE_MATERIAL_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { acknowledgeWorkspaceMaterialV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    return acknowledgeWorkspaceMaterialV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof acknowledgeWorkspaceMaterialV2>[1])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.DECIDE_WORKSPACE_CASE_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { decideWorkspaceCaseV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    return decideWorkspaceCaseV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof decideWorkspaceCaseV2>[1])
  })
  // ===== T07 独立评委评分（Local-L04 桥接：Main 派生 actor + 持久化修订号） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.T07_GET_VIEW, (event, input: {
    batchId: string; claim?: { role: 'judge' | 'organizer'; reviewerId?: string }
    safeMaterials?: import('./review-v3-t07-rating-workflow').T07SafeCaseMaterial[]
  }) => {
    assertC0ReviewMainSender(event)
    if (!input || typeof input.batchId !== 'string' || !input.batchId) throw new Error('参数 batchId 非法')
    const { getT07View } = require('./review-v3-t07-main-service') as typeof import('./review-v3-t07-main-service')
    // Integration: t07 service final signature is (batchId, claim); safeMaterials are folded into the service view.
    return getT07View(input.batchId, input.claim)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T07_APPLY_ACTION, (event, input: {
    batchId: string; claim?: { role: 'judge' | 'organizer'; reviewerId?: string }
    action: import('./review-v3-t07-rating-workflow').T07Action
    expectedRevision: number
    initialState?: import('./review-v3-t07-rating-workflow').T07State
    safeMaterials?: import('./review-v3-t07-rating-workflow').T07SafeCaseMaterial[]
  }) => {
    assertC0ReviewMainSender(event)
    if (!input || typeof input.batchId !== 'string' || !input.batchId) throw new Error('参数 batchId 非法')
    if (!input.action || typeof input.action.type !== 'string') throw new Error('参数 action 非法')
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) {
      throw new Error('参数 expectedRevision 非法')
    }
    const { applyT07MainAction } = require('./review-v3-t07-main-service') as typeof import('./review-v3-t07-main-service')
    // The offlineActionId audit key is assigned only by the trusted T09 Main import,
    // never from an ordinary Renderer-issued T07 scoring action.
    const action = input.action.type === 'submit'
      ? (({ offlineActionId: _ignored, ...rest }) => rest)(input.action)
      : input.action
    return applyT07MainAction({
      batchId: input.batchId, claim: input.claim, action,
      expectedRevision: input.expectedRevision,
      ...(input.initialState ? { initialState: input.initialState } : {}),
      ...(input.safeMaterials ? { safeMaterials: input.safeMaterials } : {}),
    })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T07_INIT_STATE, (event, input: {
    batchId: string; claim?: { role: 'judge' | 'organizer'; reviewerId?: string }
  }) => {
    assertC0ReviewMainSender(event)
    if (!input || typeof input.batchId !== 'string' || !input.batchId) throw new Error('参数 batchId 非法')
    // 轮次必须由 Main 从「已锁定批次 + 已发布模板的自带评分量表」派生，
    // 绝不接受渲染层传入的量表或状态（演示量表不能代替业务规则）。
    const { readBatchStateV2 } = require('./batch-store') as typeof import('./batch-store')
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    const { createT07RoundFromPublishedTemplate } = require('./review-v3-t07-round-setup') as typeof import('./review-v3-t07-round-setup')
    const { initT07MainState } = require('./review-v3-t07-main-service') as typeof import('./review-v3-t07-main-service')
    const batch = readBatchStateV2(input.batchId)?.batch
    if (!batch) throw new Error('批次不存在')
    const template = getTemplate(batch.templateId, batch.templateVersion)
    const state = createT07RoundFromPublishedTemplate(batch, template)
    return initT07MainState({ batchId: input.batchId, claim: input.claim, state })
  })
  // ===== T09 离线包（Local-L04 桥接：签发 / 预览 / 幂等导入） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.T09_ISSUE_STUDENT, (event, input: {
    caseId: string; supplementId: string; recipientId: string
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || !input.supplementId || !input.recipientId) throw new Error('参数非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error('案卷不存在')
    // 学生包只能包含可信已发布模板明确标为 public 的字段。
    // Renderer 传来的字段可见性绝不是授权来源，忽略旧版 DTO 的同名属性。
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
    const { issueT09StudentPackage, t09PublishedStudentVisibility } = require('./review-v3-t09-main-service') as typeof import('./review-v3-t09-main-service')
    const fieldVisibility = t09PublishedStudentVisibility(aggregate, template)
    return issueT09StudentPackage({
      aggregate, supplementId: input.supplementId, recipientId: input.recipientId, fieldVisibility,
    })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T09_ISSUE_JUDGE, (event, input: {
    caseId: string; batchId: string; assignmentId: string
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || !input.batchId || !input.assignmentId) throw new Error('评委任务参数非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error('案卷不存在')
    const { issueT09JudgePackage } = require('./review-v3-t09-judge-adapter') as typeof import('./review-v3-t09-judge-adapter')
    return issueT09JudgePackage({ aggregate, batchId: input.batchId, assignmentId: input.assignmentId })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T09_PREVIEW_REPLY, (event, input: {
    caseId: string; packageJson: string
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || typeof input.packageJson !== 'string') throw new Error('参数非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error('案卷不存在')
    const { readT09File } = require('./review-v3-t09-offline-codec') as typeof import('./review-v3-t09-offline-codec')
    const parsed = readT09File(input.packageJson)
    if (parsed.type !== 'reply') throw new Error('T09_NOT_A_REPLY_PACKAGE')
    if (parsed.reply.kind === 'judge-rating-reply') {
      const { previewT09JudgePackage } = require('./review-v3-t09-judge-adapter') as typeof import('./review-v3-t09-judge-adapter')
      return previewT09JudgePackage({ aggregate, packageJson: input.packageJson })
    }
    const { previewT09Package } = require('./review-v3-t09-main-service') as typeof import('./review-v3-t09-main-service')
    const { task, ...rest } = previewT09Package({ aggregate, packageJson: input.packageJson })
    return rest
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T09_IMPORT_REPLY, async (event, input: {
    caseId: string; packageJson: string
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || typeof input.packageJson !== 'string') throw new Error('参数非法')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const { readT09File } = require('./review-v3-t09-offline-codec') as typeof import('./review-v3-t09-offline-codec')
    const parsed = readT09File(input.packageJson)
    if (parsed.type !== 'reply') throw new Error('T09_NOT_A_REPLY_PACKAGE')
    if (parsed.reply.kind === 'judge-rating-reply') {
      const aggregate = getCaseV2Aggregate(input.caseId)
      if (!aggregate) throw new Error('案卷不存在')
      const { importT09JudgePackage } = require('./review-v3-t09-judge-adapter') as typeof import('./review-v3-t09-judge-adapter')
      // Main asks for explicit local approval only AFTER receipt, CAS recovery,
      // and payload preflight checks. Duplicate/conflict imports do not prompt.
      const confirmLocalOrganizer = (): boolean => dialog.showMessageBoxSync({
        type: 'warning',
        buttons: ['取消导入', '确认导入到本机评分'],
        defaultId: 0,
        cancelId: 0,
        noLink: true,
        title: '确认离线评委评分',
        message: '将独立评委评分导入本机批次？',
        detail: '离线包内评委身份是声明，不能证明校方身份。请核对签发任务、评委与评分后再确认。',
      }) === 1
      const { applyT07MainAction } = require('./review-v3-t07-main-service') as typeof import('./review-v3-t07-main-service')
      return importT09JudgePackage({
        aggregate, packageJson: input.packageJson,
        deps: {
          confirmLocalOrganizer,
          submitRating: async ({ batchId, reviewerId, expectedRevision, action }) => {
            assertC0ReviewMainSender(event)
            const result = applyT07MainAction({
              batchId, claim: { role: 'judge', reviewerId }, expectedRevision, action,
            })
            return { revision: result.revision }
          },
        },
      })
    }
    const { respondSupplementV2 } = require('./stage-workflow') as typeof import('./stage-workflow')
    const { importT09Package } = require('./review-v3-t09-main-service') as typeof import('./review-v3-t09-main-service')
    const { registerT09StudentAsset } = require('./review-v3-t09-asset-registration') as typeof import('./review-v3-t09-asset-registration')
    const result = await importT09Package({
      caseId: input.caseId, packageJson: input.packageJson,
      deps: {
        readAggregate: (caseId) => getCaseV2Aggregate(caseId),
        // OFF-05：保留离线包原文件名，并按补件请求的材料槽归属真实登记；
        // 原生/模板两种案卷走同一 helper，临时文件在里面即时清理。
        registerAsset: async (caseId, name, _mimeType, bytes, meta) => registerT09StudentAsset({
          caseId,
          displayName: meta?.displayName || name,
          bytes,
          ...(meta?.materialSlotId ? { materialSlotId: meta.materialSlotId } : {}),
          authorizeAtCommit: () => assertC0ReviewMainSender(event),
        }),
        respondSupplement: async (caseId, supplementId, note, documentVersionIds, expectedRevision, meta) => {
          const aggregate = getCaseV2Aggregate(caseId)
          if (!aggregate) return { ok: false, message: '案卷不存在' }
          if (!meta?.actionId) throw new Error('T09 导入缺少 actionId，不能建立幂等回执')
          // OFF-02：expectedRevision 由导入服务按「预览版本 + 本 action 附件登记推进」
          // 计算，这里不再重读最新 revision；外部并发由 submitCommand 的 CAS 拒绝。
          // requestId 以 actionId 为幂等锚点：崩溃重放不产生第二份答复，也可按
          // receiptLog 回查该 action 是否已真实写入（verifyApplied）。
          const written = await respondSupplementV2(caseId, {
            requestId: `t09-${meta.actionId}`, actor: { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
            expectedRevision,
            payload: { supplementId, note, documentVersionIds },
          })
          return { ok: written.ok, message: written.ok ? undefined : `${written.code}: ${written.message}` }
        },
        verifyApplied: ({ caseId, actionId }) => {
          // 事务回执与业务写入同一事务落盘：存在该 action 的 RespondSupplement
          // 回执即证明上次写入已生效，可恢复为 duplicate，不再重发业务写。
          const aggregate = getCaseV2Aggregate(caseId)
          if (!aggregate) return undefined
          const receipt = aggregate.receiptLog.find((item) =>
            item.requestId === `t09-${actionId}` && item.type === 'RespondSupplement')
          if (!receipt) return { applied: false }
          return { applied: true, revision: receipt.revision }
        },
      },
    })
    return result
  })
  // ===== T05 可信阶段事务（Local-L04 R02，CR-T05-04）=====
  // ===== T06 物理入库（Local-L04 R02 桥接：真实选择器 + 幂等提交）=====
  // ===== T01 受控模型起草（Local-L04 R02 桥接：渠道与凭据不出 Main）=====
  // ===== 已发布模板规则运行（ARCH-CLOSURE-R01：冻结计划 → 确定性检查 → 真实 Run）=====
  // ===== 未匹配业务 → 可编辑模板草稿（M4 公共兜底最小桥接）=====
  ipcMain.handle(REVIEW_IPC_CHANNELS.FALLBACK_TEMPLATE_DRAFT_V3, async (event, input: {
    document: import('./review-template-plan-adapter-v3-b1').B1AuthorDocument
    templateId: string
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.document || typeof input.templateId !== 'string' || !input.templateId.trim()) {
      throw new Error('参数非法：需要候选文档与模板 ID')
    }
    const { fallbackDraftFromB1 } = require('./review-v3-fallback-template-draft') as typeof import('./review-v3-fallback-template-draft')
    const result = fallbackDraftFromB1(input.document, input.templateId.trim())
    // 只保存草稿；发布仍走既有 PUBLISH_TEMPLATE_V2 与 T01 负责人确认
    const { saveDraft } = require('./template-store') as typeof import('./template-store')
    const saved = saveDraft(result.template)
    return { template: saved, sourceCandidates: result.sourceCandidates, notes: result.notes }
  })
  // ===== 50 套 D4 候选 → 演示模板发布 =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.D4_DEMO_PUBLISH_V3, (event) => {
    assertC0ReviewMainSender(event)
    const { publishD4Templates } = require('./review-v3-d4-demo-publish') as typeof import('./review-v3-d4-demo-publish')
    return publishD4Templates()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.TEMPLATE_RULE_RUN_V3, async (event, input: {
    caseId: string; phase?: 'submission' | 'decision'
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId) throw new Error('参数 caseId 非法')
    if (input.phase && input.phase !== 'submission' && input.phase !== 'decision') throw new Error('参数 phase 非法')
    const { runTemplateRuleReview } = require('./review-v3-main-template-run') as typeof import('./review-v3-main-template-run')
    return runTemplateRuleReview({
      caseId: input.caseId,
      ...(input.phase ? { phase: input.phase } : {}),
    })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T01_MODEL_DRAFT, async (event, input: { system?: string; user?: string }) => {
    assertC0ReviewMainSender(event)
    if (typeof input?.system !== 'string' || typeof input?.user !== 'string') throw new Error('参数非法')
    const { requestT01ModelDraft } = require('./review-v3-t01-model-draft-service') as typeof import('./review-v3-t01-model-draft-service')
    return requestT01ModelDraft({ system: input.system, user: input.user })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_CASE_STORAGE_ISSUES_V3, (event) => {
    assertC0ReviewMainSender(event)
    const { listCaseStorageIssues } = require('./case-store-v2') as typeof import('./case-store-v2')
    return listCaseStorageIssues()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T06_PICK_PHYSICAL_SOURCE, async (event, input: { sourceKind?: string }) => {
    assertC0ReviewMainSender(event)
    if (input?.sourceKind !== 'folder' && input?.sourceKind !== 'zip') throw new Error('来源类型非法')
    const { pickT06PhysicalSource } = require('./review-v3-t06-main-service') as typeof import('./review-v3-t06-main-service')
    return pickT06PhysicalSource(input.sourceKind)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T06_COMMIT_PHYSICAL_IMPORT, async (event, input: unknown) => {
    assertC0ReviewMainSender(event)
    const request = input as import('./review-v3-t06-main-service').T06PhysicalCommitRequest
    if (!request?.requestId || !request.selectionId || !Array.isArray(request.groups)) throw new Error('参数非法')
    const { commitT06PhysicalImport } = require('./review-v3-t06-main-service') as typeof import('./review-v3-t06-main-service')
    return commitT06PhysicalImport(request)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T05_STAGE_CAPABILITY, (event, input: {
    caseId: string; claim?: { role?: string }
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId) throw new Error('参数 caseId 非法')
    const { readT05StageCapability } = require('./review-v3-t05-main-service') as typeof import('./review-v3-t05-main-service')
    return readT05StageCapability(input.caseId, input.claim)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.T05_RECORD_STAGE_DECISION, (event, input: {
    caseId: string; templateId: string; version: number; expectedRevision: number
    taskId: string; action: string; reason: string
    supplementRequiredElements?: string[]; supplementReason?: string
    requestId: string; claim?: { role?: string }
  }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || !input.templateId || !input.taskId) throw new Error('参数非法')
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) throw new Error('参数 expectedRevision 非法')
    if (!input.reason?.trim()) throw new Error('阶段决定必须填写理由')
    const { recordT05StageDecision } = require('./review-v3-t05-main-service') as typeof import('./review-v3-t05-main-service')
    return recordT05StageDecision({
      caseId: input.caseId, templateId: input.templateId, version: input.version,
      expectedRevision: input.expectedRevision, taskId: input.taskId,
      action: input.action as import('./review-v3-t05-local-stage-plan').T05LocalStageAction,
      reason: input.reason,
      ...(input.supplementRequiredElements ? { supplementRequiredElements: input.supplementRequiredElements } : {}),
      ...(input.supplementReason ? { supplementReason: input.supplementReason } : {}),
      requestId: input.requestId, claim: input.claim,
    })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RECORD_WORKSPACE_SUBJECT_ADJUDICATION_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { recordWorkspaceSubjectAdjudicationV2 } = require('./workspace-business-service-v2') as typeof import('./workspace-business-service-v2')
    return recordWorkspaceSubjectAdjudicationV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof recordWorkspaceSubjectAdjudicationV2>[1])
  })

  // ===== N3b：业务闭环命令（薄委托 stage-workflow） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.RECORD_STAGE_DECISION_V2, (event, input: { caseId: string; command: Record<string, unknown>; templateId: string; version: number }) => {
    assertC0ReviewMainSender(event)
    assertLegacyChannelNotSuperseded(input?.caseId, REVIEW_IPC_CHANNELS.RECORD_STAGE_DECISION_V2)
    const { recordStageDecision } = require('./stage-workflow') as typeof import('./stage-workflow')
    const { getTemplate } = require('./template-store') as typeof import('./template-store')
    const template = getTemplate(input.templateId, input.version)
    if (!template) throw new Error(`模板不存在: ${input.templateId}@${input.version}`)
    return recordStageDecision(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof recordStageDecision>[1], template)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RESOLVE_SUPPLEMENT_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { resolveSupplementV2 } = require('./stage-workflow') as typeof import('./stage-workflow')
    const command = bindLocalReviewerCommand(input.command)
    // RUN-17：补件判定人由 Main 按 origin task 派生，不接受 renderer 自填角色。
    // 本地 teacher 只是“本机试办”标签，不是学校授权；伪造 teacher claim 仍会被
    // stage-workflow 的 assigneeRole/assigneeActorId 校验拒绝。
    const aggregate = readAggregate(input.caseId)
    const payload = command.payload as { supplementId?: unknown } | undefined
    const supplementId = typeof payload?.supplementId === 'string' ? payload.supplementId : ''
    return resolveSupplementV2(input.caseId, {
      ...(command as unknown as Parameters<typeof resolveSupplementV2>[1]),
      actor: deriveLocalSupplementResolverActor(aggregate, supplementId),
    })
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RESPOND_SUPPLEMENT_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    if (!input?.caseId || typeof input.caseId !== 'string') throw new Error('补件案卷 ID 非法')
    const { respondSupplementV2 } = require('./stage-workflow') as typeof import('./stage-workflow')
    // 本地学生回件只能进入学生答复通道，真实校方身份须由独立 SchoolPort 验证。
    const command = bindLocalSubmitterCommand(input.command)
    return respondSupplementV2(input.caseId, command as unknown as Parameters<typeof respondSupplementV2>[1])
  })
  // ===== G02：V2 批次复用 Pi 审核 Agent 与同一审核工具链 =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.RUN_BATCH_V2, async (_e, batchId: string) => {
    if (typeof batchId !== 'string' || !batchId) throw new Error('参数 batchId 非法')
    const { runBatchQueue } = require('./batch-store') as typeof import('./batch-store')
    const { assembleAndRunReview } = require('./run-async-service') as typeof import('./run-async-service')
    const completed = await runBatchQueue(batchId, {
      runCase: async (caseId: string) => {
        const run = await assembleAndRunReview(caseId)
        return { status: run.status }
      },
    })
    if (completed.automation && completed.automation.mode !== 'assist') {
      const { runBatchAutomation } = require('./batch-automation-service') as typeof import('./batch-automation-service')
      await runBatchAutomation(batchId)
    }
    const { readBatchStateV2 } = require('./batch-store') as typeof import('./batch-store')
    return readBatchStateV2(batchId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RUN_REVIEW_V2, async (_e, caseId: string) => {
    assertSafeReviewStorageId(caseId, 'caseId')
    // 薄委托共享运行服务（08 设计：IPC 与 Agent 工具同服务函数；人工发起 local-user）
    const { assembleAndRunReview } = require('./run-async-service') as typeof import('./run-async-service')
    return assembleAndRunReview(caseId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.PREPARE_PI_REVIEW_V2, (_event, input: { caseId: string; sessionId: string; turnId: string; resumeRunId?: string; inheritReadReceipts?: boolean }) => {
    if (!input || typeof input.caseId !== 'string' || typeof input.sessionId !== 'string' || typeof input.turnId !== 'string'
      || (input.resumeRunId !== undefined && typeof input.resumeRunId !== 'string')
      || (input.inheritReadReceipts !== undefined && typeof input.inheritReadReceipts !== 'boolean')) {
      throw new Error('审核案卷、Pi 会话和用户消息标识均为必填')
    }
    const { getAgentSessionMeta, assertOrdinaryAgentSession } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    assertOrdinaryAgentSession(input.sessionId)
    const session = getAgentSessionMeta(input.sessionId)
    if (!session) throw new Error('项目 Pi 会话不存在')
    if (session.agentRuntime && session.agentRuntime !== 'pi') throw new Error('审核工作台只能使用项目 Pi Agent')
    const presetId = session.presetReference?.presetId ?? session.presetId
    if (presetId !== 'review-operator') throw new Error('审核会话必须使用审核操作员预设')
    const { preparePiReviewRunV2 } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
    return preparePiReviewRunV2(input)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_PI_REVIEW_SESSION_V2, (_event, caseId: string) => {
    if (typeof caseId !== 'string' || !caseId) throw new Error('参数 caseId 非法')
    const { getPiReviewSessionForCase } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
    const { isReviewOwnedOrDeletedAgentSessionId } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    const sessionId = getPiReviewSessionForCase(caseId)
    return sessionId && !isReviewOwnedOrDeletedAgentSessionId(sessionId) ? sessionId : null
  })
  // 后台启动/停止只接受当前主窗口，内部归属与指派均由 Main 建立。
  ipcMain.handle(REVIEW_IPC_CHANNELS.START_BACKGROUND_PI_REVIEW_V2, (event, input: import('@profer/shared').ReviewBackgroundPiStartRequest) => {
    assertMainWindowSender(event, getMainWindow)
    const { startBackgroundPiReview } = require('./review-pi-run-bridge') as typeof import('./review-pi-run-bridge')
    return startBackgroundPiReview(input, event.sender)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.STOP_BACKGROUND_PI_REVIEW_V2, (event, input: { caseId: string; runId: string }) => {
    assertMainWindowSender(event, getMainWindow)
    const { stopBackgroundPiReview } = require('./review-pi-run-bridge') as typeof import('./review-pi-run-bridge')
    return stopBackgroundPiReview(input)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_BACKGROUND_PI_REVIEW_STATE_V2, (_event, caseId: string) => {
    assertSafeReviewStorageId(caseId, 'caseId')
    const { getBackgroundPiReviewState } = require('./review-background-state') as typeof import('./review-background-state')
    return getBackgroundPiReviewState(caseId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.ABORT_PI_REVIEW_V2, (_event, input: { caseId: string; sessionId: string; assignmentId: string; runId: string }) => {
    if (!input?.caseId || !input.sessionId || !input.assignmentId || !input.runId) throw new Error('审核取消参数不完整')
    const { assertOrdinaryAgentSession } = require('../agent-session-manager') as typeof import('../agent-session-manager')
    assertOrdinaryAgentSession(input.sessionId)
    const { getPiReviewBindingForSession, finishPiReviewRunV2 } = require('./pi-case-review-service') as typeof import('./pi-case-review-service')
    const binding = getPiReviewBindingForSession(input.sessionId)
    if (!binding || binding.caseId !== input.caseId || binding.runId !== input.runId || binding.assignmentId !== input.assignmentId) return false
    const { revokeAssignment } = require('./review-agent-assignment') as typeof import('./review-agent-assignment')
    finishPiReviewRunV2(binding, { status: 'failed', error: 'Pi 审核启动失败，授权已撤销' })
    revokeAssignment(binding.assignmentId)
    return true
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.CAST_RATING_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    assertLegacyChannelNotSuperseded(input?.caseId, REVIEW_IPC_CHANNELS.CAST_RATING_V2)
    const { castRating } = require('./rating-service') as typeof import('./rating-service')
    return castRating(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof castRating>[1])
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.RESOLVE_APPEAL_V2, (event, input: { caseId: string; command: Record<string, unknown> }) => {
    assertC0ReviewMainSender(event)
    const { resolveAppealV2 } = require('./stage-workflow') as typeof import('./stage-workflow')
    return resolveAppealV2(input.caseId, bindLocalReviewerCommand(input.command) as unknown as Parameters<typeof resolveAppealV2>[1])
  })
  // F13 本地申诉独立于历史 V2 handler：全部角色与复审指派由 Main 核实。
  ipcMain.handle(REVIEW_IPC_CHANNELS.F13_SUBMIT_LOCAL_APPEAL, (event,
    input: import('./review-v3-f13-main-service').F13SubmitAppealCommand) => {
    assertC0ReviewMainSender(event)
    const { submitLocalF13Appeal } = require('./review-v3-f13-main-service') as typeof import('./review-v3-f13-main-service')
    return submitLocalF13Appeal(input)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.F13_REVIEW_LOCAL_APPEAL, (event,
    input: import('./review-v3-f13-main-service').F13ReviewAppealCommand) => {
    assertC0ReviewMainSender(event)
    const { reviewLocalF13Appeal } = require('./review-v3-f13-main-service') as typeof import('./review-v3-f13-main-service')
    return reviewLocalF13Appeal(input)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.F13_WITHDRAW_LOCAL_APPEAL, (event,
    input: import('./review-v3-f13-main-service').F13WithdrawAppealCommand) => {
    assertC0ReviewMainSender(event)
    const { withdrawLocalF13Appeal } = require('./review-v3-f13-main-service') as typeof import('./review-v3-f13-main-service')
    return withdrawLocalF13Appeal(input)
  })

  // ===== N4b：模板向导（无代码创建：政策先行 → 模板草稿 → 发布走 PUBLISH_TEMPLATE_V2） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.CREATE_POLICY_V2, (_e, input: { policyId: string; title: string; content: string; enteredBy: string }) => {
    if (!input?.policyId || !input?.content) throw new Error('参数非法')
    const { canonicalContentHash, compileOwnerRules, publishPolicy, savePolicyDraft } = require('./policy-store') as typeof import('./policy-store')
    const record = {
      policyId: input.policyId, version: 1, title: input.title, contentHash: canonicalContentHash(input.content), content: input.content,
      compiledRules: compileOwnerRules(input.content, input.policyId, 1),
      origin: { kind: 'owner-statement' as const, text: '向导录入', enteredBy: String(input.enteredBy ?? 'local-user'), enteredAt: new Date().toISOString() },
      status: 'draft' as const,
      confirmations: [{ actorId: String(input.enteredBy ?? 'local-user'), role: 'template-owner' as const, at: new Date().toISOString(), note: '向导录入确认' }],
    }
    savePolicyDraft(record)
    publishPolicy(input.policyId, 1)
    return { policyId: input.policyId, version: 1, contentHash: record.contentHash }
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.SAVE_TEMPLATE_DRAFT_V2, (_e, template: import('@profer/shared').TemplateVersion) => {
    if (!template?.templateId) throw new Error('参数非法')
    const { saveDraft } = require('./template-store') as typeof import('./template-store')
    return saveDraft(template)
  })

  // ===== N5b：批次管理（薄委托 batch-store） =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.CREATE_BATCH_V2, (_e, input: { batch: import('@profer/shared').ReviewBatch }) => {
    const { createBatchV2Validated } = require('./batch-store') as typeof import('./batch-store')
    // BATCH-09：Main 逐案核模板版本与政策锁，不信任渲染层筛选结果。
    return createBatchV2Validated(input.batch)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_BATCH_V2, (_e, batchId: string) => {
    const { readBatchStateV2 } = require('./batch-store') as typeof import('./batch-store')
    return readBatchStateV2(batchId)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_BATCHES_V2, () => {
    const { listBatchStatesV2 } = require('./batch-store') as typeof import('./batch-store')
    return listBatchStatesV2()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.BATCH_ACTION_V2, (_e, input: { action: 'finalize' | 'reopen' | 'retry' | 'recover' | 'configure-automation' | 'finalize-completed'; batchId: string; newBatchId?: string; reason?: string; snapshot?: Record<string, unknown>; caseIds?: string[]; mode?: import('@profer/shared').BatchAutomationMode; confirmed?: boolean }) => {
    if (!input || typeof input.batchId !== 'string' || !input.batchId) throw new Error('无效批次操作')
    const { reopenBatch, retryBatchCases, recoverInterruptedBatch } = require('./batch-store') as typeof import('./batch-store')
    // Legacy free-form renderer snapshots are NOT authoritative decisions.
    // Use the central verified finalization service instead.
    if (input.action === 'finalize') throw new Error('原始快照定稿入口已禁用，请使用核验并定稿')
    if (input.action === 'reopen') return reopenBatch(input.batchId, input.newBatchId ?? `${input.batchId}-r${Date.now().toString(36)}`, input.reason ?? '人工重开')
    if (input.action === 'retry') return retryBatchCases(input.batchId, input.caseIds ?? [])
    if (input.action === 'recover') return recoverInterruptedBatch(input.batchId)
    if (input.action === 'configure-automation') {
      const { configureBatchAutomation } = require('./batch-store') as typeof import('./batch-store')
      if (!input.mode) throw new Error('需要指定批次自动化策略')
      return configureBatchAutomation(input.batchId, input.mode, input.confirmed === true)
    }
    if (input.action === 'finalize-completed') {
      const { finalizeCompletedBatch } = require('./batch-automation-service') as typeof import('./batch-automation-service')
      return finalizeCompletedBatch(input.batchId)
    }
    throw new Error('未知批次操作')
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.BATCH_AUTO_PROCESS_V2, (_e, batchId: string) => {
    if (typeof batchId !== 'string' || !batchId) throw new Error('参数 batchId 非法')
    const { runBatchAutomation } = require('./batch-automation-service') as typeof import('./batch-automation-service')
    return runBatchAutomation(batchId)
  })
  // Local-human batch group operation. The backend recomputes the preview and
  // reruns each case's existing transaction guards; the renderer supplies no actor.
  ipcMain.handle(REVIEW_IPC_CHANNELS.BATCH_GROUP_PREVIEW_V2, (_e, input: import('@profer/shared').BatchGroupActionRequest) => {
    const { previewBatchGroupAction } = require('./batch-group-action-service') as typeof import('./batch-group-action-service')
    return previewBatchGroupAction(input)
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.BATCH_GROUP_APPLY_V2, (_e, input: import('@profer/shared').BatchGroupApplyRequest) => {
    const { applyBatchGroupAction } = require('./batch-group-action-service') as typeof import('./batch-group-action-service')
    return applyBatchGroupAction(input)
  })

  ipcMain.handle(REVIEW_IPC_CHANNELS.LIST_CASES_V2, () => {
    const { listAggregatesV2 } = require('./case-store-v2') as typeof import('./case-store-v2')
    return listAggregatesV2()
  })

  // ===== G01：材料登记与提交 =====
  ipcMain.handle(REVIEW_IPC_CHANNELS.PICK_REGISTER_MATERIAL_V2, async (_e, input: { caseId: string; role: 'application' | 'evidence' | 'rule' | 'attachment'; materialSlotId?: string }) => {
    assertC0ReviewMainSender(_e)
    if (!input?.caseId) throw new Error('参数 caseId 非法')
        const { BrowserWindow, dialog } = require('electron') as typeof import('electron')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const aggregate = getCaseV2Aggregate(input.caseId)
    if (!aggregate) throw new Error(`案卷不存在: ${input.caseId}`)
    // 逐文件读取聚合 revision 串行登记（事务天然串行；对话框一次性返回多选）
    const actor = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
    const { registerMaterial } = require('./material-service') as typeof import('./material-service')
    const options = { properties: ['openFile', 'multiSelections'] as Array<'openFile' | 'multiSelections'> }
    // Picker is scoped to the invoking trusted Main window, not an arbitrary
    // focused window that might belong to another session.
    const win = BrowserWindow.fromWebContents(_e.sender) ?? undefined
    const result = win ? await dialog.showOpenDialog(win, options) : await dialog.showOpenDialog(options)
    assertC0ReviewMainSender(_e)
    if (result.canceled) return []
    const versionIds: string[] = []
    for (const sourcePath of result.filePaths) {
      const fresh = getCaseV2Aggregate(input.caseId)!
      const outcome = (await registerMaterial(input.caseId, {
        requestId: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        actor,
        expectedRevision: fresh.caseV2.revision,
        payload: { sourcePath, role: input.role, materialSlotId: input.materialSlotId },
      }, () => assertC0ReviewMainSender(_e))) as { ok: boolean; message?: string }
      if (!outcome.ok) throw new Error(outcome.message ?? '登记失败')
      const updated = getCaseV2Aggregate(input.caseId)!
      versionIds.push(updated.caseV2.documents[updated.caseV2.documents.length - 1]!.versionId)
    }
    return versionIds
  })
  // 拖拽登记：渲染层经 webUtils.getPathForFile 拿到本地路径后逐个登记（同一事务链）
  ipcMain.handle(REVIEW_IPC_CHANNELS.REGISTER_MATERIAL_PATH_V2, async (_e, input: { caseId: string; sourcePath: string; role: 'application' | 'evidence' | 'rule' | 'attachment'; materialSlotId?: string; fileName?: string; replacesVersionIds?: string[] }) => {
    assertC0ReviewMainSender(_e)
    if (!input || typeof input.sourcePath !== 'string' || !input.sourcePath) throw new Error('参数 sourcePath 非法')
    // ASSET-05：展示名与显式替换意图在两种案卷上必须同一契约；先校验再分流。
    if (input.fileName !== undefined) {
      const { basename } = require('node:path') as typeof import('node:path')
      if (typeof input.fileName !== 'string' || !input.fileName || basename(input.fileName) !== input.fileName) throw new Error('参数 fileName 非法')
    }
    if (input.replacesVersionIds !== undefined && (!Array.isArray(input.replacesVersionIds) || input.replacesVersionIds.some((value) => typeof value !== 'string'))) throw new Error('参数 replacesVersionIds 非法')
    // Electron's existing webUtils.getPathForFile resolves the dropped OS
    // file in Preload. Route native V3 cases through the SAME C-owned physical
    // material importer as the system file picker (no second Case or storage).
    if (isNativeWorkspaceCaseV3(readAggregate(input.caseId))) {
      if (input.role !== 'application' && input.role !== 'evidence' && input.role !== 'rule')
        throw new Error('原生案卷材料角色不支持：' + input.role)
      const document = await registerNativeWorkspaceMaterialV3(
        input.caseId, input.sourcePath, input.role, undefined,
        () => assertC0ReviewMainSender(_e),
        input.materialSlotId,
        {
          ...(input.fileName ? { fileName: input.fileName } : {}),
          ...(input.replacesVersionIds ? { replacesVersionIds: input.replacesVersionIds } : {}),
        },
      )
      // 两个分支统一返回 DocumentVersion.versionId；documentId 不是调用方可用的版本号。
      const after = readAggregate(input.caseId)
      const version = after?.caseV2.documents.find((item) => item.documentId === document.id && item.active !== false)
      if (!version) throw new Error('原生材料已登记但找不到对应原件版本')
      return version.versionId
    }
    const { registerMaterial } = require('./material-service') as typeof import('./material-service')
    const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
    const fresh = getCaseV2Aggregate(input.caseId)
    if (!fresh) throw new Error(`案卷不存在: ${input.caseId}`)
    const actor = { actorId: 'local-user', actorSource: 'local' as const, role: 'reviewer' as const }
    const outcome = await registerMaterial(input.caseId, {
      requestId: `reg-drop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actor,
      expectedRevision: fresh.caseV2.revision,
      payload: {
        sourcePath: input.sourcePath,
        role: input.role,
        materialSlotId: input.materialSlotId,
        ...(input.fileName ? { fileName: input.fileName } : {}),
        ...(input.replacesVersionIds ? { replacesVersionIds: input.replacesVersionIds } : {}),
      },
    }, () => assertC0ReviewMainSender(_e))
    if (!outcome.ok) throw new Error(outcome.message ?? '登记失败')
    return outcome.entity?.versionId ?? outcome.aggregate.caseV2.documents.at(-1)?.versionId
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.SUBMIT_CASE_V2, (_e, caseId: string) => {
    if (typeof caseId !== 'string' || !caseId) throw new Error('参数 caseId 非法')
    const { submitCaseV2 } = require('./stage-workflow') as typeof import('./stage-workflow')
    return submitCaseV2(caseId)
  })

  /** Legacy UI "remove": never destroy a Case that already owns V2 receipts. */
  ipcMain.handle(REVIEW_IPC_CHANNELS.DELETE_CASE, async (event, caseId: string): Promise<void> => {
    assertC0ReviewMainSender(event)
    assertSafeReviewStorageId(caseId, 'caseId')
    const existing = readAggregate(caseId)
    if (existing) {
      if (!existing.caseV2 || existing.caseV2.id !== caseId ||
          !Number.isSafeInteger(existing.caseV2.revision) || !Array.isArray(existing.receiptLog)) {
        throw new Error('案卷 V2 状态损坏，已拒绝移除；请先恢复原生业务账本')
      }
      const { archiveReviewCaseV3 } = require('./case-lifecycle-v3') as typeof import('./case-lifecycle-v3')
      const { createHash } = require('node:crypto') as typeof import('node:crypto')
      // A stable key *per archive cycle*: replay while archived returns the
      // same durable Receipt, but an explicit restore starts a new cycle.
      // History grows on the next archive; restoredAt bridges that transition
      // so the cycle number stays stable before and after the new archive.
      // Derive this solely from Main-read business state, never Renderer JSON.
      const completedCycles = existing.caseArchiveHistory?.length ?? 0
      if (!Number.isSafeInteger(completedCycles) || completedCycles < 0 ||
          (existing.caseArchiveHistory !== undefined && !Array.isArray(existing.caseArchiveHistory))) {
        throw new Error('案卷归档历史损坏，已拒绝移除')
      }
      const archiveCycle = completedCycles + (existing.caseArchive?.restoredAt ? 1 : 0)
      const result = await archiveReviewCaseV3(caseId, {
        requestId: 'legacy-remove-' + createHash('sha256').update(JSON.stringify([caseId, archiveCycle])).digest('hex'),
        expectedRevision: existing.caseV2.revision,
        actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
        payload: { reason: '用户在原工作台将案卷移入归档' },
      })
      if (!result.ok) throw new Error(`${result.code}: ${result.message}`)
      return
    }
    // V1-only folders may still be removed; an unreadable state.v2.json is
    // independently fenced by deleteCase() and can never be deleted as V1.
    deleteCase(caseId)
  })

  /** Explicit native restore. Renderer may express intent, never Actor or requestId. */
  ipcMain.handle(REVIEW_IPC_CHANNELS.RESTORE_CASE_V3, async (event, input: {
    caseId: string; expectedRevision: number; reason: string
  }): Promise<import('@profer/shared').ReviewCommandResult> => {
    assertC0ReviewMainSender(event)
    if (!input || typeof input !== 'object' || Array.isArray(input) ||
        Object.prototype.hasOwnProperty.call(input, 'actor') ||
        Object.prototype.hasOwnProperty.call(input, 'requestId')) {
      throw new Error('ACTOR_UNTRUSTED: 恢复请求只能传递用户意图，不能声明 Actor 或幂等凭据')
    }
    assertSafeReviewStorageId(input.caseId, 'caseId')
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0 ||
        typeof input.reason !== 'string' || input.reason.trim().length < 2 ||
        input.reason.length > 1000) {
      throw new Error('VALIDATION_FAILED: 恢复请求缺少有效修订号或恢复理由')
    }
    const existing = readAggregate(input.caseId)
    if (!existing?.caseV2 || existing.caseV2.id !== input.caseId ||
        !Number.isSafeInteger(existing.caseV2.revision) ||
        !Array.isArray(existing.receiptLog) || !existing.caseArchive ||
        typeof existing.caseArchive.archivedAt !== 'string' ||
        (existing.caseArchiveHistory !== undefined && !Array.isArray(existing.caseArchiveHistory))) {
      throw new Error('INVALID_TRANSITION: 案卷不存在可验证的原生归档检查点')
    }
    const { createHash } = require('node:crypto') as typeof import('node:crypto')
    const { restoreReviewCaseV3 } = require('./case-lifecycle-v3') as typeof import('./case-lifecycle-v3')
    // Stable throughout one restored checkpoint; new archives necessarily
    // advance history and produce a different Main-derived receipt key.
    const restoreIdentity = JSON.stringify([
      input.caseId, existing.caseArchiveHistory?.length ?? 0, existing.caseArchive.archivedAt,
    ])
    const outcome = await restoreReviewCaseV3(input.caseId, {
      requestId: 'native-restore-' + createHash('sha256').update(restoreIdentity).digest('hex'),
      expectedRevision: input.expectedRevision,
      actor: { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' },
      payload: { reason: input.reason.trim() },
    })
    if (!outcome.ok) throw new Error(`${outcome.code}: ${outcome.message}`)
    return outcome
  })

  // ===== AI 生成（左/中栏）=====

  /** 生成规则大纲（左栏；无出口时降级返回 fixture 大纲） */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.GENERATE_RULE_OUTLINE,
    async (_event, request: GenerateRuleOutlineRequest): Promise<RuleOutlineItem[]> => {
      const caseId = requireString(request?.caseId, 'caseId')
      if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
        throw new Error('NATIVE_OUTLINE_STAGING_REQUIRED: 原生案卷规则识别必须通过来源锚点绑定的候选区执行')
      const outline = await generateRuleOutline(request)
      await syncWorkspaceProjectionV2(request.caseId)
      return outline
    },
  )

  /** 识别可审核条目（中栏；无出口时降级返回已有条目） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.EXTRACT_ITEMS, async (_event, caseId: string): Promise<ReviewItem[]> => {
    caseId = requireString(caseId, 'caseId')
    if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
      throw new Error('NATIVE_SUBJECT_STAGING_REQUIRED: 原生事项识别需先通过 V2 来源候选核对后写入')
    const items = await extractItems(caseId)
    await syncWorkspaceProjectionV2(caseId)
    return items
  })

  // ===== 审核运行（右栏）=====

  /**
   * 执行审核运行。
   *
   * 引擎选择：网关可用 → 'ai'（内部失败仍会降级 mock）；
   * 网关不可用 → 直接走确定性模拟引擎（决策 D6，保证离线可演示）。
   */
  ipcMain.handle(REVIEW_IPC_CHANNELS.RUN_REVIEW, (_event, caseId: string): Promise<ReviewRun> => {
    caseId = requireString(caseId, 'caseId')
    if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
      throw new Error('NATIVE_C2_RUN_REQUIRED: 原生案卷不得使用旧模拟运行冒充正式 ReviewRun')
    const engine = getReviewModelGatewayStatus().available ? 'ai' : 'mock-engine'
    return startReviewRun(caseId, engine)
  })

  /** 查询单次运行状态 */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.GET_RUN,
    (_event, input: { caseId: string; runId: string }): ReviewRun | undefined => {
      return startReviewRunLookup(input)
    },
  )

  // ===== 审核助手 =====

  /** 助手对话（无出口时降级静态解答 degraded:true） */
  ipcMain.handle(
    REVIEW_IPC_CHANNELS.ASSISTANT_CHAT,
    (_event, request: AssistantChatRequest): Promise<{ content: string; references: string[]; degraded: boolean }> => {
      if (!request || typeof request !== 'object') throw new Error('参数 request 缺失或类型非法')
      if (!Array.isArray(request.history)) throw new Error('参数 history 必须是消息数组')
      // 只允许 user/assistant 角色（阻断渲染层伪造 system 消息的提示词注入面）
      const history = request.history.filter(
        (message) => !!message && (message.role === 'user' || message.role === 'assistant'),
      )
      return reviewAssistantChat({ ...request, history })
    },
  )

  // ===== 报告与网关自检 =====

  /** 导出预审报告（JSON + Markdown） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.EXPORT_REPORT, (_event, caseId: string): Promise<ExportReportResult> => {
    caseId = requireString(caseId, 'caseId')
    if (isNativeWorkspaceCaseV3(readAggregate(caseId)))
      throw new Error('NATIVE_C2_REPORT_REQUIRED: 原生案卷不能导出旧模拟运行的正式预审报告')
    return exportReport(caseId)
  })

  /** 查询当前可用模型出口（白名单自检） */
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_MODEL_GATEWAY_STATUS, (): ReviewModelGatewayStatus => {
    return getReviewModelGatewayStatus()
  })

  /** 审核模块使用自己的 Agent 模型选择；密钥仍由全局渠道配置管理。 */
  ipcMain.handle(REVIEW_IPC_CHANNELS.GET_MODULE_SETTINGS_V2, (): ReviewModuleSettingsV2 => {
    const { getReviewModuleSettings } = require('./module-settings-store') as typeof import('./module-settings-store')
    return getReviewModuleSettings()
  })
  ipcMain.handle(REVIEW_IPC_CHANNELS.SAVE_MODULE_SETTINGS_V2, (_event, input: ReviewModuleSettingsV2): ReviewModuleSettingsV2 => {
    if (!input || typeof input !== 'object' || !('agentModelSelection' in input)) throw new Error('审核设置参数非法')
    const selection = input.agentModelSelection
    if (selection !== null) {
      if (!selection || typeof selection !== 'object'
        || typeof selection.channelId !== 'string' || !selection.channelId
        || typeof selection.modelId !== 'string' || !selection.modelId) {
        throw new Error('审核模型选择参数非法')
      }
      const { listChannels } = require('../channel-manager') as typeof import('../channel-manager')
      const channel = listChannels().find((candidate) => candidate.id === selection.channelId)
      if (!channel || channel.enabled !== true || !(REVIEW_MODEL_PROVIDERS as readonly string[]).includes(channel.provider)) {
        throw new Error('审核渠道不可用，请选择已启用的 OpenAI 兼容或本地模型渠道')
      }
      if (!channel.models?.some((model) => model.id === selection.modelId && model.enabled !== false)) {
        throw new Error('审核模型不可用，请选择该渠道中已启用的模型')
      }
    }
    const { saveReviewModuleSettings } = require('./module-settings-store') as typeof import('./module-settings-store')
    return saveReviewModuleSettings({ agentModelSelection: selection })
  })

  console.log('[审核专区] IPC 处理器注册完成')
}

/** GET_RUN 的实现（独立函数，避免 handler 内联依赖） */
function startReviewRunLookup(input: { caseId: string; runId: string }): ReviewRun | undefined {
  // 延迟 import 避免与 startReviewRun 的命名耦合；直接复用 run-service 查询
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- 主进程内同步查询，无需动态加载
  const { getRun } = require('./run-service') as typeof import('./run-service')
  return getRun(input.caseId, input.runId)
}

// saveCase 供后续"案卷修正写回"迭代使用；runAiReview 由 run-service 调用，此处不直接使用
void saveCase
void runAiReview
