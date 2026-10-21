import { existsSync, realpathSync, statSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'

/**
 * Remote WS file preview is deliberately stricter than the desktop IPC policy.
 * A remote client may choose a file path but never expands its own authorization roots.
 */
export interface RemoteFileAccessContext {
  directoryRoots: string[]
  exactFiles: string[]
  /** Additional private-subtree fence, applied to raw candidates AND realpath targets. */
  denyPath?: (path: string) => boolean
}

function realpathIfFile(path: string): string | null {
  try {
    const resolved = realpathSync(resolve(path))
    return statSync(resolved).isFile() ? resolved : null
  } catch {
    return null
  }
}

function realpathIfExisting(path: string): string | null {
  try {
    return existsSync(path) ? realpathSync(resolve(path)) : null
  } catch {
    return null
  }
}

function isInsideDirectory(path: string, root: string): boolean {
  return path === root || path.startsWith(root + sep)
}

/**
 * Resolve an existing file only when it belongs to a server-derived workspace
 * root or equals a server-derived explicitly attached file. Symlink targets are
 * checked after realpath resolution, so an in-root symlink cannot escape.
 */
export function resolveAuthorizedRemoteFilePath(
  filePath: string,
  context: RemoteFileAccessContext,
): string | null {
  if (!filePath || typeof filePath !== 'string') return null

  const directoryRoots = context.directoryRoots
    .map(realpathIfExisting)
    .filter((root): root is string => root !== null)
  const exactFiles = new Set(
    context.exactFiles
      .map(realpathIfFile)
      .filter((path): path is string => path !== null),
  )

  const candidates = isAbsolute(filePath)
    ? [filePath]
    : directoryRoots.map((root) => resolve(root, filePath))

  for (const candidate of candidates) {
    if (context.denyPath?.(resolve(candidate))) continue
    const resolved = realpathIfFile(candidate)
    if (!resolved || context.denyPath?.(resolved)) continue
    if (exactFiles.has(resolved) || directoryRoots.some((root) => isInsideDirectory(resolved, root))) {
      return resolved
    }
  }

  return null
}

/**
 * Pocket's legacy Chat commands must not treat the whole app config directory as an
 * attachment library. Only a real file inside the dedicated attachments root is valid.
 * Returns a root-relative path for the existing attachment service APIs.
 */
export function resolveAuthorizedRemoteChatAttachmentPath(
  localPath: string,
  attachmentsRoot: string,
): string | null {
  if (!localPath || typeof localPath !== 'string') return null
  const root = realpathIfExisting(attachmentsRoot)
  if (!root) return null
  const candidate = isAbsolute(localPath) ? resolve(localPath) : resolve(attachmentsRoot, localPath)
  const real = realpathIfFile(candidate)
  if (!real || !isInsideDirectory(real, root)) return null
  const rel = relative(root, real)
  return rel && !isAbsolute(rel) && !rel.split(sep).includes('..') ? rel : null
}

/**
 * Known review-private Agent layouts under the config root. Caller supplies the
 * Main owner/tombstone predicate; this helper does not grant access to any file.
 * Check both candidate and canonical target to close direct and symlink aliases.
 */
export function isReviewPrivateConfigPath(
  filePath: string,
  configDir: string,
  isReviewOwnerId: (sessionId: string) => boolean,
): boolean {
  const rel = relative(resolve(configDir), resolve(filePath))
  if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) return false
  const parts = rel.split(sep)
  // The monotonic owner deny journal contains only UUIDs, but its identities
  // must not be exposed or mutated through ordinary file/preview entry points.
  if (parts.length === 1 && parts[0] === 'review-owner-ids.log') return true
  if (parts[0] === 'agent-workspaces' && parts.length >= 3) {
    // agent-workspaces/<workspaceSlug>/<sessionId>/...
    return isReviewOwnerId(parts[2]!)
  }
  if (parts[0] === 'agent-checkpoints' && parts.length >= 2) {
    return isReviewOwnerId(parts[1]!)
  }
  if (parts[0] === 'agent-sessions' && parts.length >= 2) {
    const name = parts[1] === 'remote-uploads' ? parts[2] : parts[1]
    const uuid = name?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?=\.|-|$)/i)?.[0]
    return Boolean(uuid && isReviewOwnerId(uuid))
  }
  return false
}
