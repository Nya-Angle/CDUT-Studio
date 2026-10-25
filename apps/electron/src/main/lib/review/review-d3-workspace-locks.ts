/**
 * D3 workspace locks: local identity checks on every authoring validation;
 * optional installed-library checks at D1/D2 compile time.
 * Does NOT grant policy authority. Unlocked modules remain editable drafts.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewAuthoringWorkspaceV1, ReviewD3FrozenModule, ReviewD3ModuleLock } from '@profer/shared'
import { resolveConfigDir } from '../config-paths'

const SAFE = /^[a-z][a-z0-9-]{0,79}$/
const HASH = /^[0-9a-f]{64}$/
const key = (id: string, version: number): string => id + '@' + version
const digest = (value: unknown): string => createHash('sha256').update(JSON.stringify(value)).digest('hex')

export function validateD3WorkspaceLocks(workspace: ReviewAuthoringWorkspaceV1, installed = false): string[] {
  const locks = workspace.sharedModuleLocks ?? []
  if (!Array.isArray(locks)) return ['D3_LOCK_INVALID: sharedModuleLocks 必须为数组']
  const errors: string[] = []
  const known = new Map<string, ReviewD3ModuleLock>()
  const modules = new Map(workspace.definitions.modules.map((module) => [key(module.moduleId,module.version),module]))
  for (const lock of locks) {
    if (!lock || typeof lock.moduleId !== 'string' || !SAFE.test(lock.moduleId) ||
        !Number.isSafeInteger(lock.version) || lock.version < 1 || !HASH.test(lock.digest)) {
      errors.push('D3_LOCK_INVALID: 共享资产锁标识、版本或摘要不合法')
      continue
    }
    const k = key(lock.moduleId,lock.version)
    if (known.has(k)) { errors.push('D3_LOCK_DUPLICATE: ' + k); continue }
    known.set(k,lock)
    const module = modules.get(k)
    if (!module) { errors.push('D3_LOCK_MISSING_MODULE: ' + k); continue }
    if (digest(module) !== lock.digest) errors.push('D3_LOCK_DIGEST: 本地定义偏离已固定资产 ' + k)
  }
  if (installed) for (const module of workspace.definitions.modules) {
    if (!SAFE.test(module.moduleId) || !Number.isSafeInteger(module.version) || module.version < 1) continue
    const k = key(module.moduleId,module.version)
    const frozenFile = join(resolveConfigDir(), 'review-d3-frozen-modules', module.moduleId, module.version + '.json')
    if (existsSync(frozenFile) && !known.has(k)) {
      errors.push('D3_LOCK_UNDECLARED: 当前环境存在同名冻结模块，工作区却未声明冻结身份 ' + k)
    }
  }
  for (const lock of known.values()) {
    const k = key(lock.moduleId,lock.version)
    const module = modules.get(k)
    if (!module) continue
    // A frozen module's dependencies must be frozen as well, and included in this workspace.
    for (const use of module.references ?? []) {
      if (!known.has(key(use.moduleId,use.version))) {
        errors.push('D3_LOCK_DEPENDENCY_MISSING: ' + key(use.moduleId,use.version) + ' ← ' + k)
      }
    }
    if (!installed) continue
    const file = join(resolveConfigDir(), 'review-d3-frozen-modules', lock.moduleId, lock.version + '.json')
    if (!existsSync(file)) { errors.push('D3_LOCK_NOT_INSTALLED: ' + k); continue }
    let record: ReviewD3FrozenModule
    try { record = JSON.parse(readFileSync(file,'utf8')) as ReviewD3FrozenModule }
    catch { errors.push('D3_LOCK_CORRUPTED: ' + k); continue }
    if (record?.status !== 'shared-frozen' || record.schemaVersion !== 1 ||
        record.module?.moduleId !== lock.moduleId || record.module.version !== lock.version ||
        digest(record.module) !== lock.digest || record.digest !== lock.digest ||
        !Array.isArray(record.dependencies)) {
      errors.push('D3_LOCK_REGISTRY_MISMATCH: ' + k)
      continue
    }
    const declared = new Map(record.dependencies.map((item) => [key(item.moduleId,item.version),item.digest]))
    const required = new Set((module.references ?? []).map((use) => key(use.moduleId,use.version)))
    if (declared.size !== record.dependencies.length || declared.size !== required.size ||
        [...required].some((child) => !declared.has(child) || declared.get(child) !== known.get(child)?.digest)) {
      errors.push('D3_LOCK_DEPENDENCY_DIGEST: ' + k)
    }
  }
  return [...new Set(errors)]
}
