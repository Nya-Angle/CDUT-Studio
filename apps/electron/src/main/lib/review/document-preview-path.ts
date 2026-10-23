import { existsSync, realpathSync, statSync } from 'node:fs'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import type { CaseAggregateV2 } from '@profer/shared'

/** Resolve an original case material only when it remains inside that case's asset directory. */
export function resolveCaseDocumentPreviewPath(
  caseRoot: string,
  aggregate: CaseAggregateV2 | undefined,
  documentVersionId: string,
): string | null {
  const document = aggregate?.caseV2.documents.find((item) => item.versionId === documentVersionId)
  if (!document?.assetPath) return null

  try {
    const rootReal = realpathSync(resolve(caseRoot))
    const candidate = isAbsolute(document.assetPath)
      ? resolve(document.assetPath)
      : resolve(rootReal, document.assetPath)
    if (!existsSync(candidate)) return null
    const assetReal = realpathSync(candidate)
    const insidePath = relative(rootReal, assetReal)
    if (!insidePath || insidePath === '..' || insidePath.startsWith(`..${sep}`) || isAbsolute(insidePath)) return null
    const info = statSync(assetReal)
    if (!info.isFile() || info.size > 50 * 1024 * 1024) return null
    return assetReal
  } catch {
    return null
  }
}
