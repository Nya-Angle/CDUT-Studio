/**
 * F04 trusted directory adapter. Enumerate an OS-selected directory without
 * following symlinks and capture SHA-256 of every readable original.
 *
 * Main may use this to build an immutable preview manifest. It deliberately
 * does not create a Case/DocumentVersion or invoke an IPC handler.
 */
import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { lstat, open, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { identifyF04PhysicalSelectionFromDigests, type F04PhysicalEntryDigest, type F04PhysicalSelectionIdentity } from './review-v3-f04-intake-identity'

export interface F04FolderOriginal extends F04PhysicalEntryDigest {
  /** Main-only, must never be sent in a Renderer preview. */
  absolutePath: string
}

export interface F04FolderSnapshot {
  originals: F04FolderOriginal[]
  identity: F04PhysicalSelectionIdentity
  warnings: string[]
}

/** 512 MiB/file and 2000 accepted files match the current physical picker. */
export async function snapshotF04Folder(
  trustedRoot: string,
  options: { maxEntries?: number; maxEntryBytes?: number } = {},
): Promise<F04FolderSnapshot> {
  const maxEntries = options.maxEntries ?? 2000
  const maxEntryBytes = options.maxEntryBytes ?? 512 * 1024 * 1024
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 ||
      !Number.isSafeInteger(maxEntryBytes) || maxEntryBytes < 1) throw new Error('F04_LIMIT_INVALID')
  const rootInfo = await lstat(trustedRoot)
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) throw new Error('F04_FOLDER_INVALID')
  const originals: F04FolderOriginal[] = []
  const warnings: string[] = []
  let overLimit = false

  const visit = async (directory: string): Promise<void> => {
    const children = (await readdir(directory)).sort((a, b) => a.localeCompare(b, 'en'))
    for (const name of children) {
      if (name.startsWith('.')) continue
      const absolutePath = join(directory, name)
      const path = relative(trustedRoot, absolutePath).split(sep).join('/')
      if (/[\u0000-\u001f\u007f<>:"|?*]/.test(path) || name.endsWith('.') || name.endsWith(' ')) {
        warnings.push(`${path}：跨平台不安全的文件名，未导入`)
        continue
      }
      let info: Awaited<ReturnType<typeof lstat>>
      try { info = await lstat(absolutePath) } catch {
        warnings.push(`${path}：无法读取文件属性`)
        continue
      }
      if (info.isSymbolicLink()) {
        warnings.push(`${path}：符号链接未导入，防止越出所选文件夹`)
        continue
      }
      if (info.isDirectory()) { await visit(absolutePath); continue }
      if (!info.isFile()) { warnings.push(`${path}：非普通文件未导入`); continue }
      if (info.size === 0 || info.size > maxEntryBytes) {
        warnings.push(`${path}：空文件或超过单文件上限，未导入`)
        continue
      }
      if (originals.length >= maxEntries) { overLimit = true; continue }
      let handle: Awaited<ReturnType<typeof open>> | undefined
      try {
        // Open the exact file we inspected. NOFOLLOW prevents a symlink swap
        // from redirecting the read outside the selected directory on POSIX.
        handle = await open(absolutePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0))
        const opened = await handle.stat()
        if (!opened.isFile() || opened.dev !== info.dev || opened.ino !== info.ino) {
          throw new Error('文件在预览期间被替换')
        }
        const digest = createHash('sha256')
        let length = 0
        for await (const bytes of handle.createReadStream({ autoClose: false })) {
          length += bytes.length
          if (length > maxEntryBytes) throw new Error('文件读取中超过上限')
          digest.update(bytes)
        }
        const readEnd = await handle.stat()
        const after = await lstat(absolutePath)
        if (!after.isFile() || after.isSymbolicLink() || after.size !== info.size || length !== info.size ||
            after.mtimeMs !== info.mtimeMs || readEnd.ino !== opened.ino ||
            after.ino !== opened.ino || readEnd.mtimeMs !== opened.mtimeMs) {
          throw new Error('文件在预览期间发生变化')
        }
        originals.push({ absolutePath, relativePath: path, byteLength: length, rawSha256: digest.digest('hex') })
      } catch (error) {
        warnings.push(`${path}：${error instanceof Error ? error.message : String(error)}`)
      } finally {
        await handle?.close()
      }
    }
  }
  await visit(trustedRoot)
  if (overLimit) warnings.push(`原件数超过 ${maxEntries} 条，超出部分未导入`)
  if (originals.length === 0) throw new Error('F04_NO_READABLE_ORIGINALS: ' + warnings.join('；'))
  return { originals, identity: identifyF04PhysicalSelectionFromDigests('folder', originals), warnings }
}
