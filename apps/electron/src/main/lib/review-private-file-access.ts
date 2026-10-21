/**
 * Main-owned path exclusion for review-case Agent sessions. This is a DENY-only
 * fence, layered underneath ordinary desktop/preview root authorization.
 * Raw paths and canonical paths are both examined to block symlink aliases.
 */
import { realpathSync, renameSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { getConfigDir, getAgentWorkspacesDir } from './config-paths'
import { isReviewPrivateConfigPath } from './remote-file-access'

export function isReviewPrivateDesktopPath(path: string): boolean {
  if (typeof path !== 'string' || !path) return false
  const candidate = resolve(path)
  // Keep this pure preview-path module loadable in Bun/renderer-independent
  // utilities. Resolve the authoritative Main index only when a candidate
  // actually matches a review-capable private layout, not at import time.
  const deny = (target: string) => isReviewPrivateConfigPath(
    target, getConfigDir(), (id) => {
      const { isReviewOwnedOrDeletedAgentSessionId } = require('./agent-session-manager') as typeof import('./agent-session-manager')
      return isReviewOwnedOrDeletedAgentSessionId(id)
    },
  )
  if (deny(candidate)) return true
  // A new destination may not exist yet. Resolve its closest existing parent,
  // so a symlinked directory cannot smuggle a rename into a private subtree.
  let parent = candidate
  let suffix = ''
  while (true) {
    try {
      return deny(resolve(realpathSync(parent), suffix))
    } catch {
      const next = dirname(parent)
      if (next === parent) return false
      suffix = join(basename(parent), suffix)
      parent = next
    }
  }
}

/** Privileged file mutations cannot remove an entire workspace container. */
export function isUnsafeAgentWorkspaceMutationPath(path: string): boolean {
  if (isReviewPrivateDesktopPath(path)) return true
  const root = resolve(getAgentWorkspacesDir())
  const rel = relative(root, resolve(path))
  if (rel === '') return true
  if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) return false
  return rel.split(sep).length === 1
}

/** Directory reads must avoid exposing private child names, not only file bytes. */
export function filterOrdinaryDesktopFileEntries<T extends { path: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) => !isReviewPrivateDesktopPath(entry.path))
}

/**
 * Execute the actual filesystem mutation only after checking BOTH source and
 * final destination. IPC callers must still enforce their ordinary root /
 * session authorization before invoking this deny-only guard.
 */
export function renameOrdinaryAgentFileEntry(sourcePath: string, targetPath: string): void {
  if (isUnsafeAgentWorkspaceMutationPath(sourcePath) || isUnsafeAgentWorkspaceMutationPath(targetPath)) {
    throw new Error('审核内部或共享容器路径不可操作')
  }
  renameSync(sourcePath, targetPath)
}
