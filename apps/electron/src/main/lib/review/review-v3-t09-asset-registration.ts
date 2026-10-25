/**
 * T09 学生回件附件的真实登记（OFF-05）。
 *
 * 单独抽出以便：
 * 1. Main IPC 与测试共用同一条真实写入路径（不是伪造 deps）；
 * 2. 两种案卷（原生 V3 / 模板 V2）使用同一展示名与材料槽契约；
 * 3. 临时文件只作中转，finally 即时清理，权威原件留在材料存储。
 */
import { randomUUID } from 'node:crypto'
import { unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor } from '@profer/shared'
import { readAggregate } from './case-store-v2'
import { isNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3 } from './native-workspace-case-v3'
import { registerMaterial } from './material-service'
import { t09AssetTempRoot } from './review-v3-t09-main-service'

const LOCAL_ACTOR: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

export interface T09AssetRegistrationResult {
  versionId: string
  revision: number
}

export interface T09AssetRegistrationInput {
  caseId: string
  /** 离线包里的用户原始展示名（不是临时文件 UUID 前缀） */
  displayName: string
  bytes: Uint8Array
  /** 补件请求声明的工作槽；必须存在且由 Main 从案卷读取，不接受 Renderer 自选 */
  materialSlotId?: string
  authorizeAtCommit?: () => void
}

/** 清理临时文件名中的危险字符，但保留原扩展名便于解析。 */
function safeTempName(displayName: string): string {
  const cleaned = displayName.replace(/[^A-Za-z0-9._-]/g, '_').slice(-120)
  return cleaned || 'offline-asset.bin'
}

export async function registerT09StudentAsset(input: T09AssetRegistrationInput): Promise<T09AssetRegistrationResult> {
  if (!input.displayName?.trim()) throw new Error('离线附件缺少原文件名')
  if (!(input.bytes instanceof Uint8Array) || input.bytes.byteLength === 0) throw new Error('离线附件为空')
  const current = readAggregate(input.caseId)
  if (!current) throw new Error(`案卷不存在: ${input.caseId}`)

  const tempPath = join(t09AssetTempRoot(), `${randomUUID()}-${safeTempName(input.displayName)}`)
  writeFileSync(tempPath, input.bytes)
  try {
    input.authorizeAtCommit?.()
    if (isNativeWorkspaceCaseV3(current)) {
      const document = await registerNativeWorkspaceMaterialV3(
        input.caseId, tempPath, 'evidence', LOCAL_ACTOR, input.authorizeAtCommit,
        input.materialSlotId,
        { fileName: input.displayName },
      )
      const after = readAggregate(input.caseId)
      const found = after?.caseV2.documents.find((item) => item.documentId === document.id && item.active !== false)
      if (!after || !found) throw new Error('附件已登记但找不到对应原件版本')
      return { versionId: found.versionId, revision: after.caseV2.revision }
    }
    const written = await registerMaterial(input.caseId, {
      requestId: `t09-asset-${randomUUID().replace(/-/g, '')}`,
      actor: LOCAL_ACTOR,
      expectedRevision: current.caseV2.revision,
      payload: {
        sourcePath: tempPath,
        role: 'evidence',
        ...(input.materialSlotId ? { materialSlotId: input.materialSlotId } : {}),
        fileName: input.displayName,
      },
    }, input.authorizeAtCommit)
    if (!written.ok) throw new Error(written.message)
    if (!written.entity) throw new Error('附件已登记但未返回版本记录')
    const after = readAggregate(input.caseId)
    if (!after) throw new Error('附件登记后案卷不可读')
    return { versionId: written.entity.versionId, revision: after.caseV2.revision }
  } finally {
    try { unlinkSync(tempPath) } catch { /* 清理失败不掩盖写入结果 */ }
  }
}
