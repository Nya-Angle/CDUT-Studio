/** 用户可排序/移出模板库的轻量目录索引；模板版本本体保持不可变和可追溯。 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getConfigDir } from '../config-paths'

interface TemplateCatalog {
  schemaVersion: 1 | 2
  order: string[]
  archived: string[]
}

function catalogPath(): string {
  return join(getConfigDir(), 'review-templates', 'catalog.json')
}

function readCatalog(): TemplateCatalog {
  const path = catalogPath()
  if (!existsSync(path)) return { schemaVersion: 2, order: [], archived: [] }
  try {
    const value = JSON.parse(readFileSync(path, 'utf8')) as Partial<TemplateCatalog>
    return {
      schemaVersion: value.schemaVersion === 2 ? 2 : 1,
      order: Array.isArray(value.order) ? value.order.filter((id): id is string => typeof id === 'string') : [],
      archived: Array.isArray(value.archived) ? value.archived.filter((id): id is string => typeof id === 'string') : [],
    }
  } catch (error) {
    console.warn('[审核模板] 模板目录索引无法读取，将按默认顺序恢复:', error)
    return { schemaVersion: 2, order: [], archived: [] }
  }
}

function writeCatalog(catalog: TemplateCatalog): void {
  const path = catalogPath()
  mkdirSync(join(getConfigDir(), 'review-templates'), { recursive: true })
  const temp = `${path}.tmp`
  writeFileSync(temp, JSON.stringify(catalog, null, 2), 'utf8')
  renameSync(temp, path)
}

export function initializeTemplateCatalog(defaultOrder: string[], initiallyArchived: string[] = []): void {
  const path = catalogPath()
  if (!existsSync(path)) {
    writeCatalog({ schemaVersion: 2, order: [...new Set(defaultOrder)], archived: [...new Set(initiallyArchived)] })
    return
  }
  const catalog = readCatalog()
  const order = [...catalog.order, ...defaultOrder.filter((id) => !catalog.order.includes(id))]
  // Version 1 was the first user-editable catalog. Upgrade it once so historic, thin
  // compatibility templates are hidden while preserving any later explicit restore.
  const archived = catalog.schemaVersion === 1
    ? [...new Set([...catalog.archived, ...initiallyArchived])]
    : catalog.archived
  if (catalog.schemaVersion !== 2 || order.length !== catalog.order.length || archived.length !== catalog.archived.length) {
    writeCatalog({ schemaVersion: 2, order, archived })
  }
}

export function isTemplateArchived(templateId: string): boolean {
  return readCatalog().archived.includes(templateId)
}

export function orderTemplateIds(ids: string[]): string[] {
  const catalog = readCatalog()
  const rank = new Map(catalog.order.map((id, index) => [id, index]))
  return [...ids].sort((a, b) => (rank.get(a) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b) ?? Number.MAX_SAFE_INTEGER) || a.localeCompare(b))
}

export function reorderTemplateCatalog(ids: string[]): void {
  const catalog = readCatalog()
  const unique = [...new Set(ids)]
  if (unique.length !== ids.length) throw new Error('模板顺序包含重复模板')
  const archived = new Set(catalog.archived)
  if (unique.some((id) => archived.has(id))) throw new Error('已移出模板库的模板不能调整顺序')
  const previousVisible = catalog.order.filter((id) => !archived.has(id))
  const omitted = previousVisible.filter((id) => !unique.includes(id))
  writeCatalog({ ...catalog, order: [...unique, ...omitted, ...catalog.order.filter((id) => archived.has(id))] })
}

export function archiveTemplateInCatalog(templateId: string): void {
  const catalog = readCatalog()
  if (!catalog.archived.includes(templateId)) writeCatalog({ ...catalog, archived: [...catalog.archived, templateId] })
}

export function restoreTemplateInCatalog(templateId: string): void {
  const catalog = readCatalog()
  const archived = catalog.archived.filter((id) => id !== templateId)
  const order = catalog.order.includes(templateId) ? catalog.order : [...catalog.order, templateId]
  writeCatalog({ ...catalog, order, archived })
}

export function listArchivedTemplateIds(): string[] {
  return readCatalog().archived
}
