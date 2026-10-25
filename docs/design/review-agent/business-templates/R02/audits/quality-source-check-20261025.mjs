/**
 * R02 运行定义只读质量扫描。
 *
 * 不安装模板、不创建案卷、不联系模型或学校系统。
 * 用 Node 24 的内置 TypeScript 类型擦除装载定义；对 S08 在内存里替换
 * template-store 的校验依赖（其定义对象仍由原模块表达式构建）。
 *
 * 调用：node --experimental-strip-types <本文件> [--json]
 */
import { readdirSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..')
const definitionDir = join(root, 'apps/electron/src/main/lib/review/r02-template-catalog/definitions')
const documentDir = join(root, 'docs/design/review-agent/business-templates/R02')
const names = readdirSync(definitionDir).filter((name) => /^[ST]\d{2}-T\d{2}\.ts$/.test(name)).sort()
const issues = []
const stats = { definitions: names.length, loaded: 0, fields: 0, materials: 0, criteria: 0, zeroExplicitRequired: 0, zeroDataCheck: 0 }
const push = (id, severity, code, evidence) => issues.push({ templateId: id, severity, code, evidence })
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const duplicates = (values) => values.filter((v, index) => values.indexOf(v) !== index)
const references = (ast) => {
  if (!ast || typeof ast !== 'object') return []
  if (Array.isArray(ast)) return ast.flatMap(references)
  if (typeof ast.field === 'string') return [ast.field]
  return [...references(ast.all), ...references(ast.any), ...references(ast.not)]
}

async function loadDefinition(name) {
  const file = join(definitionDir, name)
  let source = readFileSync(file, 'utf8')
  // S08 作者在模块初始化时跑模板仓库校验，Node 无 Bun workspace 依赖。
  // 此处仅对原定义对象做独立结构扫描，不声称执行了 validateTemplate。
  source = source.replace(
    /^import\s*\{\s*validateTemplate\s*\}\s*from\s*['"]\.\.\/\.\.\/template-store['"]\s*;?\s*$/m,
    'const validateTemplate = () => []',
  )
  const js = stripTypeScriptTypes(source, { mode: 'strip' })
  const module = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))
  const candidates = Object.values(module).filter((value) => value && typeof value === 'object' &&
    typeof value.templateId === 'string' && Array.isArray(value.fields) &&
    Array.isArray(value.materialSlots) && Array.isArray(value.sections))
  const template = module.templateVersion ?? module.template ?? candidates[0]
  if (!template || !Array.isArray(template.sections)) throw new Error('找不到 TemplateVersion 对象')
  if (candidates.some((other) => other !== template && JSON.stringify(other) !== JSON.stringify(template))) {
    push(name.slice(0, -3), 'P1', 'DIFFERENT_EXPORTED_TEMPLATES', '同一 TS 导出了不同内容的模板对象')
  }
  return { template, metadata: module.r02Metadata, uniformExport: Boolean(module.templateVersion) }
}

for (const name of names) {
  const id = name.slice(0, -3)
  let record
  try { record = await loadDefinition(name) }
  catch (error) { push(id, 'P1', 'LOAD_FAILED', String(error)); continue }
  const { template, metadata, uniformExport } = record
  stats.loaded += 1
  const fields = template.fields ?? []
  const materials = template.materialSlots ?? []
  const sections = template.sections ?? []
  const criteria = sections.flatMap((section) => section.criteria ?? [])
  stats.fields += fields.length
  stats.materials += materials.length
  stats.criteria += criteria.length
  if (!materials.some((slot) => slot.minCount > 0)) stats.zeroExplicitRequired++
  if (!criteria.some((criterion) => criterion.dataCheck)) stats.zeroDataCheck++

  if (template.templateId !== id) push(id, 'P1', 'TEMPLATE_ID_MISMATCH', String(template.templateId))
  if (!uniformExport) push(id, 'P2', 'NONUNIFORM_EXPORT', '没有统一命名导出 templateVersion')
  if (template.status !== 'draft' || template.autoPassPolicy?.enabled !== false ||
      (template.policyVersionIds ?? []).length !== 0 ||
      !template.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')) {
    push(id, 'P0', 'NONOFFICIAL_SAFETY_INVARIANT',
      `status=${template.status}, autoPass=${template.autoPassPolicy?.enabled}, policyIds=${template.policyVersionIds?.length}, sourceNote=${String(template.sourceNote).slice(0, 45)}`)
  }
  if (duplicates(fields.map((f) => f.key.toLowerCase())).length) push(id, 'P1', 'DUPLICATE_FIELDS', '字段 ID 忽略大小写后重复')
  if (duplicates(materials.map((m) => m.id.toLowerCase())).length) push(id, 'P1', 'DUPLICATE_MATERIALS', '材料 ID 忽略大小写后重复')
  if (duplicates(sections.map((s) => s.id)).length) push(id, 'P1', 'DUPLICATE_SECTIONS', '分项 ID 重复')
  const fKeys = new Set(fields.map((f) => f.key))
  const mKeys = new Set(materials.map((m) => m.id))
  const sKeys = new Set(sections.map((s) => s.id))
  const cKeys = new Set(sections.flatMap((s) => (s.criteria ?? []).map((c) => s.id + ':' + c.id.toLowerCase())))
  if (cKeys.size !== criteria.length) push(id, 'P1', 'DUPLICATE_CRITERIA', '同一分项的规则 ID 重复')
  if (criteria.length === 0) push(id, 'P1', 'NO_RULE_CRITERIA', '没有运行定义审核标准')
  for (const f of fields) {
    if (f.sectionId && !sKeys.has(f.sectionId)) push(id, 'P1', 'FIELD_SECTION_MISSING', `${f.key} -> ${f.sectionId}`)
    for (const ref of references(f.conditionRequired)) {
      if (!fKeys.has(ref)) push(id, 'P1', 'FIELD_CONDITION_MISSING', `${f.key} -> ${ref}`)
    }
  }
  for (const slot of materials) {
    if (slot.sectionId && !sKeys.has(slot.sectionId)) push(id, 'P1', 'MATERIAL_SECTION_MISSING', `${slot.id} -> ${slot.sectionId}`)
    if (!Number.isInteger(slot.minCount) || !Number.isInteger(slot.maxCount) ||
        slot.minCount < 0 || slot.minCount > slot.maxCount) {
      push(id, 'P1', 'MATERIAL_COUNT_INVALID', `${slot.id}: [${slot.minCount},${slot.maxCount}]`)
    }
    for (const ref of references(slot.requiredWhen)) {
      if (!fKeys.has(ref)) push(id, 'P1', 'MATERIAL_CONDITION_MISSING', `${slot.id} -> ${ref}`)
    }
  }
  for (const section of sections) {
    if (section.required && !(section.criteria ?? []).length) push(id, 'P1', 'REQUIRED_SECTION_EMPTY', section.id)
  }
  for (const criterion of criteria) {
    if (criterion.dataCheck && !mKeys.has(criterion.dataCheck.materialSlotId)) {
      push(id, 'P1', 'RULE_MATERIAL_MISSING', `${criterion.id} -> ${criterion.dataCheck.materialSlotId}`)
    }
    if (criterion.dataCheck && criterion.execution !== 'deterministic') {
      push(id, 'P1', 'RULE_EXECUTION_MISMATCH', criterion.id)
    }
  }
  if (metadata) {
    if (metadata.templateId !== id || metadata.officialSchoolTemplate !== false) {
      push(id, 'P1', 'METADATA_ID_OFFICIAL_MISMATCH', '研究元数据 ID/非官方标记错误')
    }
    for (const item of metadata.criteria ?? []) {
      if (!cKeys.has(`${item.sectionId}:${String(item.criterionId).toLowerCase()}`)) {
        push(id, 'P1', 'METADATA_RULE_DANGLING', `${item.sectionId}:${item.criterionId}`)
      }
    }
    if (metadata.sourceDocumentPath && metadata.sourceDocumentSha256) {
      const sourcePath = resolve(root, metadata.sourceDocumentPath)
      try {
        const actual = hash(readFileSync(sourcePath))
        if (actual !== metadata.sourceDocumentSha256) {
          push(id, 'P1', 'SOURCE_HASH_MISMATCH', `研究元数据 SHA ${metadata.sourceDocumentSha256} != 文件 SHA ${actual}`)
        }
      } catch {
        push(id, 'P1', 'SOURCE_DOCUMENT_NOT_FOUND', metadata.sourceDocumentPath)
      }
    }
  }
  try { readFileSync(join(documentDir, id + '.md')) }
  catch { push(id, 'P1', 'REVIEW_DOCUMENT_MISSING', id + '.md') }
}

const counts = Object.fromEntries([...new Set(issues.map((issue) => issue.code))].sort().map((code) =>
  [code, issues.filter((issue) => issue.code === code).length]))
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ snapshot: stats, counts, issues }, null, 2))
} else {
  console.log(JSON.stringify({ snapshot: stats, counts, examples: issues.slice(0, 40) }, null, 2))
}
process.exitCode = issues.some((issue) => issue.severity === 'P0' || issue.code === 'LOAD_FAILED') ? 1 : 0
