/** D4 冻结目录的客户端/CLI 共用加载器；校验原始 Git blob，禁止浮动来源。 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ReviewAuthoringWorkspaceV1 } from '@profer/shared'
import { validateReviewAuthoringV1 } from './review-authoring-v1'

export interface D4UnifiedEntry {
  domain: string
  sourcePR: number
  sourceHeadSha: string
  templateId: string
  templateVersion: number
  workspacePath: string
  workspaceGitBlobSha: string
  manifestPath: string
  sourceVersion: string
  sourceSha256: string | null
  previousDomainStatus: string
  integrationStatus: string
  publication: string
  clientLoadMode: string
}
export interface D4UnifiedCatalog {
  schemaVersion: number
  catalogId: string
  technicalBaseSha: string
  templateCount: number
  domainCounts: Record<string, number>
  publicationAllowed: false
  templates: D4UnifiedEntry[]
}
const CATALOG_PATH = 'docs/design/review-agent/acceptance/d4-unified-r01/catalog.json'
// 源码测试与 Electron 构建均读取同一组冻结输入；发行包只读取随包资源。
const SOURCE_ROOT = [resolve(__dirname, '../resources/d4-unified'),
  resolve(__dirname, 'resources/d4-unified'), resolve(__dirname, '../../../..'),
  resolve(__dirname, '../../..'), resolve(__dirname, '../../../../../..')]
  .find(root => existsSync(resolve(root, CATALOG_PATH)))
const INDEX = SOURCE_ROOT ? resolve(SOURCE_ROOT, CATALOG_PATH) : ''
const EXPECTED: Record<string, number> = { G01: 5, G02: 3, G03: 10, G04: 8, G05: 6, G06: 9, G07: 7, G08: 2 }
const COMMON = 'a7a6a11d4840ad64cfc858c17b35f35180adf063'
export const resolveD4SourcePath = (relative: string): string => {
  if (!relative.startsWith('docs/design/review-agent/acceptance/d4-g') ||
      !relative.match(/^docs\/design\/review-agent\/acceptance\/d4-g0[1-8]-build\/[a-zA-Z0-9/_-]+\.(json|md)$/)) {
    throw new Error('D4_CATALOG_UNSAFE_PATH: ' + relative)
  }
  if (!SOURCE_ROOT) throw new Error('D4_RESOURCES_MISSING: 请执行 build:resources')
  return resolve(SOURCE_ROOT, relative)
}
const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T
function gitBlobSha(path: string): string {
  const bytes = readFileSync(path)
  return createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex')
}
export function loadD4UnifiedCatalog(): D4UnifiedCatalog {
  const catalog = readJson<D4UnifiedCatalog>(INDEX)
  if (catalog.schemaVersion !== 1 || catalog.technicalBaseSha !== COMMON ||
      catalog.publicationAllowed !== false || catalog.templateCount !== 50 ||
      catalog.templates?.length !== 50) throw new Error('D4_CATALOG_INVALID_HEADER')
  const seen = new Set<string>()
  const counts: Record<string, number> = {}
  for (const entry of catalog.templates) {
    const key = entry.templateId + '@' + entry.templateVersion
    if (seen.has(key) || !/^g0[1-8]$/.test(entry.domain.toLowerCase()) ||
        !/^[0-9a-f]{40}$/.test(entry.workspaceGitBlobSha) ||
        !/^[0-9a-f]{40}$/.test(entry.sourceHeadSha) ||
        !/^[0-9a-f]{64}$/.test(entry.sourceSha256 ?? '') ||
        entry.publication !== 'candidate-held' || entry.integrationStatus !== 'NOT_RUN' ||
        !Number.isSafeInteger(entry.templateVersion) || entry.templateVersion < 1 ||
        !entry.workspacePath.includes('/d4-' + entry.domain.toLowerCase() + '-build/') ||
        !entry.manifestPath.includes('/d4-' + entry.domain.toLowerCase() + '-build/')) {
      throw new Error('D4_CATALOG_INVALID_ENTRY: ' + key)
    }
    seen.add(key)
    counts[entry.domain] = (counts[entry.domain] ?? 0) + 1
    resolveD4SourcePath(entry.workspacePath)
    resolveD4SourcePath(entry.manifestPath)
  }
  if (Object.keys(EXPECTED).some(domain =>
    counts[domain] !== EXPECTED[domain] || catalog.domainCounts[domain] !== EXPECTED[domain])) {
    throw new Error('D4_CATALOG_DOMAIN_COUNTS_MISMATCH')
  }
  return catalog
}
export function loadD4UnifiedWorkspace(entry: D4UnifiedEntry): ReviewAuthoringWorkspaceV1 {
  const path = resolveD4SourcePath(entry.workspacePath)
  if (gitBlobSha(path) !== entry.workspaceGitBlobSha) throw new Error('D4_WORKSPACE_BLOB_CHANGED: ' + entry.templateId)
  const w = readJson<ReviewAuthoringWorkspaceV1>(path)
  if (w.schemaVersion !== 1 || w.definitions.templates.length !== 1 ||
      w.definitions.templates[0]?.templateId !== entry.templateId ||
      w.definitions.templates[0]?.version !== entry.templateVersion) {
    throw new Error('D4_WORKSPACE_IDENTITY_MISMATCH: ' + entry.templateId)
  }
  const problems = validateReviewAuthoringV1(w)
  if (problems.length) throw new Error('D4_D1_INVALID ' + entry.templateId + ': ' + problems.join('; '))
  return w
}
