/**
 * Minimal tool admission boundary for an already assigned direct Pi case review.
 * Reuses existing direct review tools and the existing local-file preview renderer.
 * Does not expose arbitrary MCP tools, filesystem paths or generic chat actions.
 */
import { realpathSync, statSync } from 'node:fs'
import { basename, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { Type } from 'typebox'
import type { ToolDefinition } from '@earendil-works/pi-coding-agent'
import { executeAgentPreviewTool } from '../agent-preview-tools'
import { getConfigDir } from '../config-paths'
import { readAggregate } from './case-store-v2'
import {
  getPiReviewBindingForSession,
  recordPiReviewPreviewByPath,
  type PiReviewBinding,
} from './pi-case-review-service'
import { assertSafeReviewStorageId } from './review-storage-id'

const DIRECT_OPS = [
  'review_read_documents',
  'review_inspect_document_image',
  'review_submit_result',
] as const

type InspectOriginal = typeof executeAgentPreviewTool

function errorResult(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
    details: { error: message },
    isError: true,
  }
}

function verifyCurrentBinding(binding: PiReviewBinding): void {
  const current = getPiReviewBindingForSession(binding.sessionId)
  if (!current || current.caseId !== binding.caseId || current.runId !== binding.runId
    || current.assignmentId !== binding.assignmentId) {
    throw new Error('审核指派已经变化，本次原件读取已取消')
  }
}

const STRICT_RUNTIME_TOOL_NAMES = new Set<string>([
  ...DIRECT_OPS,
  'review_inspect_original',
  'CompactContext',
])

/** Host-side permission gate for direct review turns; no user-facing technical prompt. */
export function isAuthorizedDirectReviewTool(binding: PiReviewBinding, toolName: string): boolean {
  if (!STRICT_RUNTIME_TOOL_NAMES.has(toolName)) return false
  try {
    verifyCurrentBinding(binding)
    return true
  } catch {
    return false
  }
}

function caseRoot(binding: PiReviewBinding): string {
  assertSafeReviewStorageId(binding.caseId, 'caseId')
  return realpathSync(join(getConfigDir(), 'review-cases', binding.caseId))
}

function originalForCurrentBinding(binding: PiReviewBinding, documentVersionId: string): { filePath: string; root: string } {
  verifyCurrentBinding(binding)
  const aggregate = readAggregate(binding.caseId)
  const document = aggregate?.caseV2.documents.find(item => item.versionId === documentVersionId && item.active !== false)
  if (!document?.assetPath) throw new Error('材料版本不存在、未激活或原件路径缺失')
  const root = caseRoot(binding)
  const filePath = realpathSync(resolve(root, document.assetPath))
  const rel = relative(root, filePath)
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error('原件不在当前案卷授权目录内')
  }
  if (!statSync(filePath).isFile()) throw new Error('原件不是普通文件')
  return { filePath, root }
}

/**
 * Reject missing/duplicate direct operations and keep the exact three,
 * plus one case-version-id original inspection tool. The Pi review profile
 * adds CompactContext by itself; all other builtin/product/MCP tools are dropped.
 *
 * inspectOriginal is an injectable dependency for deterministic tests; the
 * production default is the pre-existing file preview implementation.
 */
export function selectDirectReviewStrictTools(
  available: readonly ToolDefinition[],
  binding: PiReviewBinding,
  inspectOriginal: InspectOriginal = executeAgentPreviewTool,
): ToolDefinition[] {
  const selected = DIRECT_OPS.map(name => {
    const found = available.filter(tool => tool.name === name)
    if (found.length !== 1) throw new Error(`审核工具清单异常：${name} (${found.length})`)
    return found[0]!
  })
  const inspect = {
    name: 'review_inspect_original',
    label: '核验本案材料原件',
    description: '按已登记 documentVersionId 查看本案原件视觉页面（尤其是扫描 PDF）。不接收文件系统路径。scope=all 可能受到单次渲染预算限制，失败时应分页或转人工核验；视觉预览不自动生成可引用的文字出处。',
    parameters: Type.Object({
      documentVersionId: Type.String({ minLength: 1 }),
      scope: Type.Optional(Type.Union([Type.Literal('overview'), Type.Literal('page'), Type.Literal('all')])),
      page: Type.Optional(Type.Integer({ minimum: 1 })),
    }),
    async execute(_toolCallId: string, args: { documentVersionId: string; scope?: 'overview' | 'page' | 'all'; page?: number }) {
      try {
        if (!args || typeof args.documentVersionId !== 'string') return errorResult('缺少材料版本 ID')
        if (args.scope && !['overview', 'page', 'all'].includes(args.scope)) return errorResult('原件预览范围无效')
        if (args.scope === 'page' && (!Number.isInteger(args.page) || (args.page ?? 0) < 1)) {
          return errorResult('页码必须是从 1 开始的整数')
        }
        if (args.scope !== 'page' && args.page !== undefined) return errorResult('页码仅可用于 scope=page')
        const { filePath, root } = originalForCurrentBinding(binding, args.documentVersionId)
        const scope = args.scope ?? 'overview'
        const inspected = await inspectOriginal({
          filePath,
          mode: 'visual',
          scope,
          ...(args.page !== undefined ? { page: args.page } : {}),
        }, {
          agentCwd: '',
          allowedRoots: [root],
        })
        // The viewer can await rendering. Re-check after the await to avoid a
        // stale turn writing its receipt into a later run for the same session.
        verifyCurrentBinding(binding)
        if ('error' in inspected.details) {
          return { ...inspected, isError: true }
        }
        const visualImageCount = inspected.details.visual?.images?.length ?? 0
        if (visualImageCount > 0) {
          recordPiReviewPreviewByPath(
            binding, filePath, `核验本案原件 ${basename(filePath)}（${scope}）`,
            { scope, visualImageCount },
          )
        }
        return inspected
      } catch (cause) {
        return errorResult(cause instanceof Error ? cause.message : String(cause))
      }
    },
  } as unknown as ToolDefinition
  return [...selected, inspect]
}
