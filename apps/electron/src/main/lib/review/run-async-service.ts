/**
 * V2 运行装配与异步运行管理（08 设计 §5：从 RUN_REVIEW_V2 handler 抽出，IPC 与 Agent 工具共用）
 *
 * - assembleAndRunReview：装配渠道 client + OCR 端口后同步执行全图（原 handler 逻辑）
 * - startReviewRunAsync：预分配 runId、落盘 queued、后台执行；运行管理器保留 promise
 * - 取消：cancelRunV2（进程内注册表）+ 外部 signal 穿透 chatCompletion
 * - 发起者：initiatedBy 落盘到运行记录（时间线可辨人工/AI）
 */
import type { Actor, ReviewRunV2 } from '@profer/shared'
import { cancelRunV2, isRunCancelled, runReviewCaseV2 } from './run-service-v2'
import { getRunV2, saveRunV2 } from './run-store-v2'
import type { CommandSourceMeta } from './case-store-v2'
import { getConfigDir } from '../config-paths'
import { createPiReviewModelClient } from './pi-review-agent-client'
import { join } from 'node:path'
import type { ReviewImageInspector } from './v2-executor-factory'

/** 异步运行登记表项：进程内保留后台 promise 与取消控制器 */
interface ActiveRun {
  caseId: string
  runId: string
  promise: Promise<ReviewRunV2>
  controller: AbortController
  startedAt: number
}

/** 进程内运行登记表：key = runId（同案去重与取消都查这里） */
const activeRuns = new Map<string, ActiveRun>()

/** 组装模型 client + OCR 端口（渠道/OCR 装配的唯一出口，IPC 与 Agent 工具薄委托） */
async function assembleReviewClient(caseId: string): Promise<{ client: import('./pi-review-executor').ReviewModelClient; ocrPort: import('./system-tesseract-ocr-adapter').SystemTesseractOcrPort; imageInspector: ReviewImageInspector }> {
  const { resolveReviewGatewayChannel, REVIEW_RUN_TIMEOUT_MS, chatCompletionWithMeta, reviewPromptWithImages } = require('./review-model-gateway') as typeof import('./review-model-gateway')

  const resolved = resolveReviewGatewayChannel()
  if (!resolved) throw new Error('未配置可用模型渠道，无法执行真实审核（请在设置中配置渠道）')
  const model = resolved.channel.models?.find((candidate) => candidate.enabled !== false)?.id ?? resolved.channel.models?.[0]?.id
  if (!model) throw new Error(`审核渠道「${resolved.channel.name}」没有已配置模型`)
  const { PiAgentAdapter } = require('../adapters/pi-agent-adapter') as typeof import('../adapters/pi-agent-adapter')
  const { getSdkConfigDir } = require('../config-paths') as typeof import('../config-paths')
  const { SystemTesseractOcrPort } = require('./system-tesseract-ocr-adapter') as typeof import('./system-tesseract-ocr-adapter')
  const adapter = new PiAgentAdapter()
  return {
    client: createPiReviewModelClient({
      channel: resolved.channel,
      apiKey: resolved.apiKey,
      model,
      baseUrl: resolved.channel.baseUrl,
      timeoutMs: REVIEW_RUN_TIMEOUT_MS,
      cwd: join(getConfigDir(), 'review-cases', caseId),
      piAgentDir: getSdkConfigDir(),
      query: (input) => adapter.query(input),
      abort: (sessionId) => adapter.abort(sessionId),
    }),
    imageInspector: async ({ prompt, system, dataUrl, signal }) => {
      const response = await chatCompletionWithMeta(resolved.channel, [
        { role: 'system', content: system },
        { role: 'user', content: reviewPromptWithImages(prompt, [dataUrl]) },
      ], { timeoutMs: REVIEW_RUN_TIMEOUT_MS, signal, retryWithoutImages: false, maxTokens: 1_000 })
      return {
        content: response.text,
        imagesDropped: response.imagesDropped,
        channel: resolved.channel.name,
        model,
        protocol: 'openai-chat',
        ...(response.usage ? { usage: response.usage } : {}),
      }
    },
    ocrPort: await SystemTesseractOcrPort.create(),
  }
}

/** 同步执行一次真实审核（原 RUN_REVIEW_V2 handler 逻辑；调用方自行处理长等待） */
export async function assembleAndRunReview(caseId: string, options: { signal?: AbortSignal; initiatedBy?: Actor } = {}): Promise<ReviewRunV2> {
  const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
  const { getTemplate } = require('./template-store') as typeof import('./template-store')
  const { assembleV2Executors } = require('./v2-executor-factory') as typeof import('./v2-executor-factory')

  const aggregate = getCaseV2Aggregate(caseId)
  if (!aggregate) throw new Error(`案卷聚合不存在: ${caseId}`)
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template) throw new Error(`模板不存在: ${aggregate.caseV2.templateId}@${aggregate.caseV2.templateVersion}`)
  const { client, ocrPort, imageInspector } = await assembleReviewClient(caseId)
  const executors = await assembleV2Executors(aggregate, template, { client, ocrPort, imageInspector, signal: options.signal })
  return runReviewCaseV2(aggregate.caseV2, template, executors, {
    initiatedBy: options.initiatedBy ?? { actorId: 'local-user', actorSource: 'local', role: 'reviewer' },
    cancelled: options.signal ? () => options.signal!.aborted : undefined,
    observationSnapshot: aggregate.observations as unknown as Array<Record<string, unknown>>,
    evidenceSnapshot: aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>,
  })
}

/** 运行去重：同案已有排队/运行中的任务时拒绝重复启动 */
export function findActiveRunForCase(caseId: string): { runId: string } | undefined {
  for (const active of activeRuns.values()) {
    if (active.caseId === caseId) return { runId: active.runId }
  }
  return undefined
}

export interface StartRunAsyncResult {
  caseId: string
  runId: string
  status: 'queued'
  startedAt: string
  /** 建议下次查询间隔（毫秒）：真实审核全图 60-150 秒 */
  nextPollAfterMs: number
}

/**
 * 异步启动真实审核（08 设计 §5）：
 * 预分配 runId → 立即落盘 queued + initiatedBy → 后台执行并登记 promise。
 * 调用方（IPC 或 Agent 工具）拿 runId 轮询 getRunV2 即可，不挂长连接。
 */
export function startReviewRunAsync(caseId: string, initiatedBy: Actor, source?: CommandSourceMeta, input?: { runId?: string }): StartRunAsyncResult {
  const { getCaseV2Aggregate } = require('./application-service') as typeof import('./application-service')
  const { getTemplate } = require('./template-store') as typeof import('./template-store')
  const { assembleV2Executors } = require('./v2-executor-factory') as typeof import('./v2-executor-factory')
  const { resolveReviewGatewayChannel, REVIEW_RUN_TIMEOUT_MS } = require('./review-model-gateway') as typeof import('./review-model-gateway')

  if (findActiveRunForCase(caseId)) throw new Error(`案卷已有进行中的审核运行（去重；可先查询状态或取消）`)
  const aggregate = getCaseV2Aggregate(caseId)
  if (!aggregate) throw new Error(`案卷聚合不存在: ${caseId}`)
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template) throw new Error(`模板不存在: ${aggregate.caseV2.templateId}@${aggregate.caseV2.templateVersion}`)
  if (!resolveReviewGatewayChannel()) throw new Error('未配置可用模型渠道，无法执行真实审核（请在设置中配置渠道）')

  const runId = input?.runId ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const startedAt = new Date().toISOString()

  // queued 占位运行立即落盘：发起者身份与输入 manifest 一并记录
  const queuedRun: ReviewRunV2 = {
    id: runId,
    caseId: aggregate.caseV2.id,
    templateId: aggregate.caseV2.templateId,
    templateVersion: aggregate.caseV2.templateVersion,
    inputManifest: { hash: '', templateVersion: aggregate.caseV2.templateVersion, policyVersions: [], documentVersions: [], observationIds: aggregate.observations.map((item) => item.id), evidenceLinkIds: aggregate.evidenceLinks.map((item) => item.id) },
    status: 'queued',
    checkpoints: [],
    checks: [],
    opinions: [],
    coverage: { documents: [], plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
    diagnostics: [],
    startedAt,
    initiatedBy,
  }
  void source
  saveRunV2(queuedRun)

  const controller = new AbortController()
  const promise = (async (): Promise<ReviewRunV2> => {
    try {
      const { client, ocrPort, imageInspector } = await assembleReviewClient(caseId)
      const executors = await assembleV2Executors(aggregate, template, { client, ocrPort, imageInspector, signal: controller.signal })
      return await runReviewCaseV2(aggregate.caseV2, template, executors, {
        runId,
        initiatedBy,
        observationSnapshot: aggregate.observations as unknown as Array<Record<string, unknown>>,
        evidenceSnapshot: aggregate.evidenceLinks as unknown as Array<Record<string, unknown>>,
        cancelled: () => isRunCancelled(runId) || controller.signal.aborted,
      })
    } catch (error) {
      const current = getRunV2(caseId, runId)
      if (current && (current.status === 'queued' || current.status === 'running')) {
        saveRunV2({
          ...current,
          status: controller.signal.aborted || isRunCancelled(runId) ? 'cancelled' : 'failed',
          error: error instanceof Error ? error.message : String(error),
          diagnostics: [...current.diagnostics, error instanceof Error ? error.message : String(error)],
          completedAt: new Date().toISOString(),
        })
      }
      throw error
    } finally {
      setTimeout(() => activeRuns.delete(runId), 5_000).unref?.()
    }
  })()
  activeRuns.set(runId, { caseId, runId, promise, controller, startedAt: Date.now() })
  void promise.catch(() => { /* 失败已在运行文件落盘 failed；登记表清理后丢弃 */ })

  return { caseId, runId, status: 'queued', startedAt, nextPollAfterMs: Math.min(REVIEW_RUN_TIMEOUT_MS, 15_000) }
}

/** 取消运行：进程内注册表 + 运行图注册表 + 后台 AbortController 三处同时生效 */
export function cancelAsyncRun(runId: string): boolean {
  const active = activeRuns.get(runId)
  if (!active) {
    // 非活跃（已完成/不存在）：仍转发给运行图注册表，状态机自行判定
    cancelRunV2(runId)
    return false
  }
  cancelRunV2(runId)
  active.controller.abort()
  return true
}

/** 取运行（供查询工具：caseId+runId 归属校验后读取持久文件） */
export function getRunById(caseId: string, runId: string): ReviewRunV2 | undefined {
  return getRunV2(caseId, runId)
}
