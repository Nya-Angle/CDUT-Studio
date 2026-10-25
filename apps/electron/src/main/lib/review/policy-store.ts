/**
 * 政策仓库（N1b，docs/design/review-agent/07 §2.2；05 §2.1 误判 8 修正）
 *
 * 存储：{configDir}/review-policies/{policyId}/versions/{version}.json（不可变发布版）
 * - 模板引用必须精确到 policyId+version+contentHash（validatePolicyRef 校验）
 * - 发布要求：至少一条确认记录（负责人确认，非 AI 自动）
 * - 纯 Node（bun test 直跑），无数据库
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import type { PolicyRecord, PolicyRef } from '@profer/shared'
import { getConfigDir } from '../config-paths'

const SAFE_POLICY_ID = /^[\p{L}\p{N}_-]{1,120}$/u

/** 政策 ID 与模板 ID 同样不允许路径分隔符/点号，防止 `../` 规范化逃逸配置目录。 */
export function isSafePolicyId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_POLICY_ID.test(value)
}

function assertPolicyIdentity(policyId: string, version?: number): void {
  if (!isSafePolicyId(policyId)) throw new Error('政策 ID 不合法：只允许字母、数字、下划线和短横线')
  if (version !== undefined && (!Number.isSafeInteger(version) || version < 1)) throw new Error('政策版本不合法')
}

function policiesRoot(): string {
  const dir = join(getConfigDir(), 'review-policies')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function policyPath(policyId: string, version: number): string {
  assertPolicyIdentity(policyId, version)
  return join(policiesRoot(), policyId, 'versions', `${version}.json`)
}

/** 规范化内容 SHA-256（固定键序由调用方保证内容本身稳定） */
export function canonicalContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex')
}

function writeAtomic(filePath: string, data: unknown): void {
  const tmp = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, filePath)
}

/** 保存政策草稿（status 强制 draft；不得覆盖已发布版本） */
export function savePolicyDraft(record: PolicyRecord): PolicyRecord {
  assertPolicyIdentity(record.policyId, record.version)
  if (record.status !== 'draft') throw new Error('savePolicyDraft 只接受草稿状态政策')
  const existing = getPolicy(record.policyId, record.version)
  if (existing && existing.status === 'published') throw new Error(`政策版本 ${record.version} 已发布不可覆盖；请提升版本号`)
  // 内容 hash 与内容一致性校验（引用一致性的根基）
  const actualHash = canonicalContentHash(record.content)
  if (record.contentHash !== actualHash) {
    throw new Error(`政策内容 hash 不一致：声明 ${record.contentHash.slice(0, 12)}…，实际 ${actualHash.slice(0, 12)}…`)
  }
  const filePath = policyPath(record.policyId, record.version)
  mkdirSync(join(policiesRoot(), record.policyId, 'versions'), { recursive: true })
  writeAtomic(filePath, record)
  return record
}

export function getPolicy(policyId: string, version?: number): PolicyRecord | undefined {
  if (!isSafePolicyId(policyId)) return undefined
  if (version !== undefined && (!Number.isSafeInteger(version) || version < 1)) return undefined
  const dir = join(policiesRoot(), policyId, 'versions')
  if (!existsSync(dir)) return undefined
  const versions = readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => Number(name.replace('.json', '')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)
  const target = version ?? versions[0]
  if (target === undefined || !existsSync(policyPath(policyId, target))) return undefined
  try {
    return JSON.parse(readFileSync(policyPath(policyId, target), 'utf-8')) as PolicyRecord
  } catch (error) {
    console.warn(`[政策仓库] 解析失败: ${policyId}@${target}`, error)
    return undefined
  }
}

export function listPolicies(): PolicyRecord[] {
  const root = policiesRoot()
  if (!existsSync(root)) return []
  const out: PolicyRecord[] = []
  for (const entry of readdirSync(root)) {
    const latest = getPolicy(entry)
    if (latest) out.push(latest)
  }
  return out.sort((a, b) => a.policyId.localeCompare(b.policyId))
}

/** 发布：至少一条确认记录；published 不可变（07 §2.2） */
export function publishPolicy(policyId: string, version: number): PolicyRecord {
  assertPolicyIdentity(policyId, version)
  const record = getPolicy(policyId, version)
  if (!record) throw new Error(`政策不存在: ${policyId}@${version}`)
  if (record.status === 'published') return record
  if (record.confirmations.length === 0) {
    throw new Error('政策发布前至少需要一条负责人确认记录（AI 起草不自动确认）')
  }
  const published: PolicyRecord = { ...record, status: 'published', publishedAt: new Date().toISOString() }
  writeAtomic(policyPath(policyId, version), published)
  console.log(`[政策仓库] 已发布: ${policyId}@${version}`)
  return published
}

export interface PolicyRefCheck {
  ok: boolean
  reason?: string
}

/** 校验模板的政策引用：存在 + 已发布 + 内容 hash 一致（07 §2.2 发布检查项） */
export function validatePolicyRef(ref: PolicyRef): PolicyRefCheck {
  if (!isSafePolicyId(ref.policyId)) return { ok: false, reason: '政策引用 ID 不合法' }
  if (!Number.isSafeInteger(ref.version) || ref.version < 1) return { ok: false, reason: '政策引用版本不合法' }
  const record = getPolicy(ref.policyId, ref.version)
  if (!record) return { ok: false, reason: `政策不存在: ${ref.policyId}@${ref.version}` }
  if (record.status !== 'published') return { ok: false, reason: `政策 ${ref.policyId}@${ref.version} 尚未发布` }
  if (record.contentHash !== ref.contentHash) {
    return { ok: false, reason: `政策 ${ref.policyId}@${ref.version} 内容 hash 与模板引用不一致` }
  }
  return { ok: true }
}

// ===== G02/G10：负责人规则文本 → 结构化 RuleSpec（简单行编译） =====

/**
 * 将负责人逐行规则编译为 RuleSpec：
 * - 每个非空行一条规则；支持 "[严重度] 编号 说明" 或裸说明（自动编号）
 * - 这是**确定性文本编译**，不做语义理解；复杂条件仍由负责人在政策原文中说明
 */
export function compileOwnerRules(text: string, policyId = '', version = 1): import('@profer/shared').RuleSpec[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const severityMap: Record<string, 'high' | 'medium' | 'low'> = { 高: 'high', 中: 'medium', 低: 'low', high: 'high', medium: 'medium', low: 'low' }
  return lines.map((line, index) => {
    let severity: 'high' | 'medium' | 'low' = 'medium'
    let statement = line
    const bracket = line.match(/^\[(高|中|低|high|medium|low)\]\s*(.+)$/i)
    if (bracket) {
      severity = severityMap[bracket[1]!.toLowerCase()] ?? 'medium'
      statement = bracket[2]!
    }
    const idMatch = statement.match(/^(?:([A-Z]{1,4}\d{1,3})|第\s*(\d+)\s*条)[：:.、]?\s*(.+)$/)
    const id = idMatch?.[1] ?? (idMatch?.[2] ? `R${idMatch[2]}` : `R${index + 1}`)
    return {
      id,
      policyVersionId: `${policyId}@${version}`,
      title: id,
      when: { field: undefined, op: 'exists' } as never,
      requirement: idMatch?.[3] ?? statement,
      targetScope: 'case' as const,
      execution: 'semantic' as const,
      semanticOutputEnum: ['compliant', 'non-compliant'],
      onFail: 'manual-review' as const,
      onUnknown: 'needs-confirmation' as const,
      sourceRefIds: [],
      priority: index + 1,
      confirmation: 'confirmed' as const,
    }
  })
}
