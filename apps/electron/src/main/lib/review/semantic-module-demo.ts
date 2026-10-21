/**
 * D0.5 Agent-first 语义模块试验：只组织审核责任，不调度 Pi 的工具步骤。
 * 这是制作侧 Demo 契约，不是已发布的 D1 Schema 或校方规则系统。
 */
import { createHash } from 'node:crypto'
import type { CheckStatus, TemplateVersion } from '@profer/shared'

export type DemoSourceKind = 'synthetic' | 'user-request' | 'cross-school-reference' | 'official-policy'
export interface DemoSource {
  kind: DemoSourceKind
  note: string
}
export interface DemoResponsibility {
  id: string
  title: string
  requirement: string
  completion: string
  limits?: string
}
export interface DemoParameter {
  key: string
  description: string
  defaultValue?: string
}
export interface DemoModuleUse {
  id: string
  moduleId: string
  version: number
  scenario?: string
  objectKey?: string
  bindings?: Record<string, string>
}
export interface DemoModule {
  moduleId: string
  version: number
  name: string
  purpose: string
  scope: string
  source: DemoSource
  limits: string
  tasks: DemoResponsibility[]
  parameters?: DemoParameter[]
  references?: DemoModuleUse[]
}
export interface DemoTemplate {
  templateId: string
  version: number
  name: string
  purpose: string
  limits: string
  source: DemoSource
  scenarios?: string[]
  modules: DemoModuleUse[]
  localTasks: DemoResponsibility[]
}
export interface DemoState {
  revision: number
  modules: DemoModule[]
  templates: DemoTemplate[]
}
export type DemoEdit =
  | { op: 'create-module'; module: DemoModule }
  | { op: 'revise-module'; moduleId: string; fromVersion: number; toVersion: number; changes: Partial<Omit<DemoModule, 'moduleId' | 'version'>> }
  | { op: 'create-template'; template: DemoTemplate }
  | { op: 'patch-template'; templateId: string; version: number; changes: Partial<Pick<DemoTemplate, 'name' | 'purpose' | 'limits' | 'source' | 'scenarios'>> }
  | { op: 'add-module-use'; templateId: string; version: number; use: DemoModuleUse }
  | { op: 'replace-module-use'; templateId: string; version: number; use: DemoModuleUse }
  | { op: 'remove-module-use'; templateId: string; version: number; useId: string }
  | { op: 'upsert-local-task'; templateId: string; version: number; task: DemoResponsibility }
export interface DemoTransaction {
  expectedRevision: number
  operations: DemoEdit[]
}
export interface DemoTaskPreview {
  checkId: string
  title: string
  requirement: string
  completion: string
  limits: string
  objectKey?: string
  source: DemoSource
  moduleRef?: { moduleId: string; version: number; usePath: string }
}
export interface DemoPreview {
  templateId: string
  version: number
  scenario?: string
  blocked: boolean
  issues: string[]
  tasks: DemoTaskPreview[]
  fingerprint: string
}
export interface DemoCoverageEntry {
  checkId: string
  status: CheckStatus
  sourceIds?: string[]
  reason: string
}

/** 一组回执只属于一个固定的生效审核任务包；不接受裸检查数组。 */
export interface DemoCoverageReceipt {
  fingerprint: string
  entries: DemoCoverageEntry[]
}

const SAFE_ID = /^[a-z][a-z0-9-]{0,79}$/
const MODULE_KEY = (moduleId: string, version: number): string => moduleId + '@' + version
const TEMPLATE_KEY = (templateId: string, version: number): string => templateId + '@' + version

export function emptyDemoState(): DemoState {
  return { revision: 0, modules: [], templates: [] }
}

function copy<T>(value: T): T {
  return structuredClone(value)
}

function idError(id: string, label: string, issues: string[]): void {
  if (!SAFE_ID.test(id)) issues.push(label + ' ID 非法：' + id)
}

function checkSource(source: DemoSource, at: string, issues: string[]): void {
  if (!source?.note?.trim()) issues.push(at + ' 缺少来源性质说明')
  // Demo 无权校验学校制度是否现行有效，禁止在制作阶段把此类声明升级成正式依据。
  if (source?.kind === 'official-policy') issues.push(at + ' 不支持在 D0.5 中认证正式校规，请留待有权限的制度治理流程')
  if (!['synthetic', 'user-request', 'cross-school-reference', 'official-policy'].includes(source?.kind)) {
    issues.push(at + ' 来源类型无效')
  }
}

function checkTasks(tasks: DemoResponsibility[], at: string, issues: string[]): void {
  const ids = new Set<string>()
  for (const task of tasks) {
    idError(task.id, at + ' 责任', issues)
    if (ids.has(task.id)) issues.push(at + ' 审核责任 ID 重复：' + task.id)
    ids.add(task.id)
    if (!task.title?.trim() || !task.requirement?.trim() || !task.completion?.trim()) {
      issues.push(at + ' 审核责任须包含标题、必核事项、完成标准：' + task.id)
    }
  }
}

function checkUses(uses: DemoModuleUse[], at: string, modules: Map<string, DemoModule>, issues: string[]): void {
  const ids = new Set<string>()
  for (const use of uses) {
    idError(use.id, at + ' 引用', issues)
    if (ids.has(use.id)) issues.push(at + ' 引用实例重复：' + use.id)
    ids.add(use.id)
    const ref = modules.get(MODULE_KEY(use.moduleId, use.version))
    if (!ref) {
      issues.push(at + ' 缺少固定版本引用：' + MODULE_KEY(use.moduleId, use.version))
      continue
    }
    const parameters = new Set((ref.parameters ?? []).map((param) => param.key))
    for (const key of Object.keys(use.bindings ?? {})) {
      if (!parameters.has(key)) issues.push(at + ' 不允许传入未开放参数：' + key)
    }
    for (const param of ref.parameters ?? []) {
      if (!use.bindings?.[param.key] && !param.defaultValue) {
        issues.push(at + ' 缺少参数：' + use.id + '.' + param.key)
      }
    }
  }
}

/**
 * 全量遍历模板引用树：不根据当前场景过滤节点。
 * 此遍历只用于静态安全校验和无条件投影检查，与 Pi 实际工具执行顺序无关。
 */
function visitTemplateUses(
  template: DemoTemplate,
  modules: Map<string, DemoModule>,
  onUse: (use: DemoModuleUse, path: string, inheritedScenario?: string) => void,
): void {
  const walk = (use: DemoModuleUse, path: string, ancestorScenario: string | undefined, ancestors: Set<string>): void => {
    const at = path + '/' + use.id
    onUse(use, at, ancestorScenario)
    const key = MODULE_KEY(use.moduleId, use.version)
    if (ancestors.has(key)) return // 环另由 validateDemoState 报错；不能在此无限递归
    const mod = modules.get(key)
    if (!mod) return
    const nextAncestors = new Set(ancestors)
    nextAncestors.add(key)
    for (const nested of mod.references ?? []) walk(nested, at, use.scenario ?? ancestorScenario, nextAncestors)
  }
  for (const use of template.modules) walk(use, 'module', undefined, new Set())
}

const PROJECTABLE_USE_KEYS = new Set(['id', 'moduleId', 'version', 'bindings', 'scenario', 'objectKey'])
const PROJECTABLE_MODULE_KEYS = new Set(['moduleId', 'version', 'name', 'purpose', 'scope', 'source', 'limits', 'tasks', 'parameters', 'references'])
const PROJECTABLE_TEMPLATE_KEYS = new Set(['templateId', 'version', 'name', 'purpose', 'limits', 'source', 'scenarios', 'modules', 'localTasks'])

/** 不根据一次预览结果判断可投影性：未激活的分支也不能从无条件快照中消失。 */
function assertUnconditionalProjection(template: DemoTemplate, modules: Map<string, DemoModule>): void {
  const errors: string[] = []
  if ((template.scenarios?.length ?? 0) > 0) errors.push('模板存在业务情景')
  for (const key of Object.keys(template)) if (!PROJECTABLE_TEMPLATE_KEYS.has(key)) errors.push('模板未识别的结构化属性：' + key)
  visitTemplateUses(template, modules, (use, path) => {
    if (use.scenario !== undefined) errors.push(path + ' 存在条件情景')
    if (use.objectKey !== undefined) errors.push(path + ' 存在逐对象作用范围')
    for (const key of Object.keys(use)) if (!PROJECTABLE_USE_KEYS.has(key)) errors.push(path + ' 存在未映射的结构化属性：' + key)
    const mod = modules.get(MODULE_KEY(use.moduleId, use.version))
    if (!mod) {
      errors.push(path + ' 引用的模块版本不存在')
      return
    }
    for (const key of Object.keys(mod)) if (!PROJECTABLE_MODULE_KEYS.has(key)) errors.push(path + ' 模块存在未映射的结构化属性：' + key)
  })
  if (errors.length) throw new Error('复杂业务情景只能预览，D0.5 不允许丢失审核责任：' + errors.join('；'))
}

/** 只做可确定的 ID、版本、环、参数与来源性质检查；不冒充自然语言政策冲突裁决。 */
export function validateDemoState(state: DemoState): string[] {
  const issues: string[] = []
  if (!Number.isSafeInteger(state.revision) || state.revision < 0) issues.push('修订号无效')
  const modules = new Map<string, DemoModule>()
  const templates = new Set<string>()
  for (const mod of state.modules) {
    const key = MODULE_KEY(mod.moduleId, mod.version)
    idError(mod.moduleId, '模块', issues)
    if (!Number.isSafeInteger(mod.version) || mod.version < 1) issues.push('模块版本须为正整数：' + key)
    if (modules.has(key)) issues.push('模块固定版本重复：' + key)
    modules.set(key, mod)
    if (!mod.name?.trim() || !mod.purpose?.trim() || !mod.scope?.trim() || !mod.limits?.trim()) {
      issues.push('模块缺少名称、目标、适用范围或禁区：' + key)
    }
    checkSource(mod.source, key, issues)
    checkTasks(mod.tasks, key, issues)
    const names = new Set<string>()
    for (const param of mod.parameters ?? []) {
      if (!/^[a-z][a-z0-9]*$/.test(param.key) || names.has(param.key) || !param.description?.trim()) {
        issues.push(key + ' 参数名称重复/非法或无说明：' + param.key)
      }
      names.add(param.key)
    }
  }
  for (const mod of state.modules) {
    checkUses(mod.references ?? [], MODULE_KEY(mod.moduleId, mod.version), modules, issues)
  }
  for (const template of state.templates) {
    const key = TEMPLATE_KEY(template.templateId, template.version)
    idError(template.templateId, '模板', issues)
    if (!Number.isSafeInteger(template.version) || template.version < 1 || templates.has(key)) {
      issues.push('模板版本非法或重复：' + key)
    }
    templates.add(key)
    if (!template.name?.trim() || !template.purpose?.trim() || !template.limits?.trim()) {
      issues.push('模板缺少名称、审核目的或权限边界：' + key)
    }
    checkSource(template.source, key, issues)
    checkTasks(template.localTasks, key, issues)
    checkUses(template.modules, key, modules, issues)
    const scenarios = new Set(template.scenarios ?? [])
    if (scenarios.size !== (template.scenarios ?? []).length || [...scenarios].some((it) => !SAFE_ID.test(it))) {
      issues.push(key + ' 情景 ID 重复或非法')
    }
    // 连复合模块的未激活子分支也必须核验，不能因 preview 当前情景不同而漏检。
    visitTemplateUses(template, modules, (use, path, ancestorScenario) => {
      if (use.scenario !== undefined && !scenarios.has(use.scenario)) {
        issues.push(key + ' ' + path + ' 引用未知情景：' + use.scenario)
      }
      if (ancestorScenario && use.scenario && ancestorScenario !== use.scenario) {
        issues.push(key + ' ' + path + ' 子情景与父情景冲突，不可能被激活')
      }
    })
  }

  // 模块引用图可以嵌套，但不得循环；并不对应 Pi 工具执行图。
  const visiting = new Set<string>(), visited = new Set<string>()
  const visit = (key: string): void => {
    if (visiting.has(key)) { issues.push('模块引用存在循环：' + key); return }
    if (visited.has(key)) return
    const mod = modules.get(key)
    if (!mod) return
    visiting.add(key)
    for (const use of mod.references ?? []) visit(MODULE_KEY(use.moduleId, use.version))
    visiting.delete(key)
    visited.add(key)
  }
  for (const key of modules.keys()) visit(key)
  return issues
}

/** 原子批量修改：任何操作或最终结构失败，原对象保持不变；revision 用作乐观锁。 */
export function applyDemoTransaction(state: DemoState, tx: DemoTransaction): DemoState {
  if (state.revision !== tx.expectedRevision) throw new Error('VERSION_CONFLICT: 当前修订号为 ' + state.revision)
  if (!tx.operations.length) throw new Error('空事务不允许提升修订号')
  const next = copy(state)
  const findTemplate = (id: string, version: number): DemoTemplate => {
    const template = next.templates.find((it) => it.templateId === id && it.version === version)
    if (!template) throw new Error('模板不存在：' + TEMPLATE_KEY(id, version))
    return template
  }
  for (const op of tx.operations) {
    switch (op.op) {
      case 'create-module':
        if (next.modules.some((m) => MODULE_KEY(m.moduleId, m.version) === MODULE_KEY(op.module.moduleId, op.module.version))) {
          throw new Error('固定模块版本已存在，必须创建新版本')
        }
        next.modules.push(copy(op.module))
        break
      case 'revise-module': {
        const source = next.modules.find((m) => m.moduleId === op.moduleId && m.version === op.fromVersion)
        if (!source || op.toVersion <= op.fromVersion) throw new Error('只能从已有模块派生更高版本')
        if (next.modules.some((m) => m.moduleId === op.moduleId && m.version === op.toVersion)) throw new Error('目标模块版本已存在')
        next.modules.push({ ...copy(source), ...copy(op.changes), moduleId: op.moduleId, version: op.toVersion })
        break
      }
      case 'create-template':
        if (next.templates.some((t) => TEMPLATE_KEY(t.templateId, t.version) === TEMPLATE_KEY(op.template.templateId, op.template.version))) {
          throw new Error('模板版本已存在')
        }
        next.templates.push(copy(op.template))
        break
      case 'patch-template':
        Object.assign(findTemplate(op.templateId, op.version), copy(op.changes))
        break
      case 'add-module-use':
        findTemplate(op.templateId, op.version).modules.push(copy(op.use))
        break
      case 'replace-module-use': {
        const template = findTemplate(op.templateId, op.version)
        const index = template.modules.findIndex((use) => use.id === op.use.id)
        if (index < 0) throw new Error('待替换的模块实例不存在：' + op.use.id)
        template.modules[index] = copy(op.use)
        break
      }
      case 'remove-module-use': {
        const template = findTemplate(op.templateId, op.version)
        if (!template.modules.some((use) => use.id === op.useId)) throw new Error('待删除的模块实例不存在：' + op.useId)
        template.modules = template.modules.filter((use) => use.id !== op.useId)
        break
      }
      case 'upsert-local-task': {
        const template = findTemplate(op.templateId, op.version)
        template.localTasks = [...template.localTasks.filter((task) => task.id !== op.task.id), copy(op.task)]
        break
      }
    }
  }
  next.revision++
  const issues = validateDemoState(next)
  if (issues.length) throw new Error('VALIDATION_FAILED: ' + issues.join('；'))
  return next
}

function interpolate(value: string, bindings: Record<string, string>, issues: string[], path: string): string {
  return value.replace(/\{\{([a-z][a-z0-9]*)\}\}/g, (_match, key: string) => {
    if (bindings[key] === undefined || !bindings[key].trim()) {
      issues.push(path + ' 参数未绑定：' + key)
      return '[未绑定:' + key + ']'
    }
    return bindings[key]
  })
}

/** 预览只展开当前已明确情景的审核责任，缺情景/参数阻断，不默认当作 false。 */
export function previewDemo(state: DemoState, templateId: string, version: number, scenario?: string): DemoPreview {
  const issues = validateDemoState(state)
  const template = state.templates.find((it) => it.templateId === templateId && it.version === version)
  if (!template) throw new Error('模板不存在：' + TEMPLATE_KEY(templateId, version))
  const scenarios = template.scenarios ?? []
  if (scenarios.length && !scenario) issues.push('本模板需要明确业务情景，未知不可视为不适用')
  if (scenario && !scenarios.includes(scenario)) issues.push('业务情景不在模板定义中：' + scenario)
  const moduleMap = new Map(state.modules.map((mod) => [MODULE_KEY(mod.moduleId, mod.version), mod]))
  const tasks: DemoTaskPreview[] = []
  const visited = new Set<string>()
  const activeModules = new Set<string>()
  const appendTask = (task: DemoResponsibility, checkId: string, scope: string, limits: string, source: DemoSource, bindings: Record<string, string>, moduleRef?: DemoTaskPreview['moduleRef'], objectKey?: string): void => {
    const at = moduleRef?.usePath ?? 'template'
    const result: DemoTaskPreview = {
      checkId, title: interpolate(task.title, bindings, issues, at),
      requirement: interpolate(task.requirement, bindings, issues, at),
      completion: interpolate(task.completion, bindings, issues, at),
      limits: interpolate((limits + '\n' + (task.limits ?? '')).trim(), bindings, issues, at),
      source,
      ...(objectKey ? { objectKey } : {}),
      ...(moduleRef ? { moduleRef } : {}),
    }
    // 每个 check 有自身的审核范围，不用同一事实覆盖另一档案件/操作。
    result.requirement = '适用范围：' + scope + (objectKey ? '；审核对象：' + objectKey : '') + '\n' + result.requirement
    tasks.push(result)
  }
  const expand = (use: DemoModuleUse, path: string, inheritedBindings: Record<string, string> = {}, inheritedObjectKey?: string): void => {
    if (use.scenario && use.scenario !== scenario) return
    const moduleKey = MODULE_KEY(use.moduleId, use.version)
    const mod = moduleMap.get(moduleKey)
    if (!mod) return
    if (activeModules.has(moduleKey)) {
      issues.push(path + '/' + use.id + ' 模块引用循环，不能展开')
      return
    }
    // 参数优先级：当前引用的显式绑定 > 父模块继承值 > 子模块默认值。
    const bindings: Record<string, string> = {}
    for (const param of mod.parameters ?? []) if (param.defaultValue !== undefined) bindings[param.key] = param.defaultValue
    Object.assign(bindings, inheritedBindings, use.bindings ?? {})
    const objectKey = use.objectKey ?? inheritedObjectKey
    const usePath = path + '/' + use.id
    activeModules.add(moduleKey)
    for (const task of mod.tasks) {
      const checkId = usePath + '/' + task.id
      if (visited.has(checkId)) issues.push('审核责任重复：' + checkId)
      visited.add(checkId)
      appendTask(task, checkId, mod.scope, mod.limits + '\n' + template.limits, mod.source, bindings, { moduleId: mod.moduleId, version: mod.version, usePath }, objectKey)
    }
    for (const nested of mod.references ?? []) expand(nested, usePath, bindings, objectKey)
    activeModules.delete(moduleKey)
  }
  for (const task of template.localTasks) appendTask(task, 'local/' + task.id, template.purpose, template.limits, template.source, {})
  for (const use of template.modules) expand(use, 'module')
  const fingerprint = createHash('sha256').update(JSON.stringify({ templateId, version, scenario, tasks, issues })).digest('hex')
  return { templateId, version, ...(scenario ? { scenario } : {}), blocked: issues.length > 0, issues, tasks, fingerprint }
}

/**
 * 只把静态、无条件的 Demo 展开为现有 TemplateVersion 草稿。
 * 已选择的 C/A 业务情景仍仅是预览，不能偷换为普遍有效的正式发布模板。
 */
export function projectSimpleDemoDraft(state: DemoState, templateId: string, version: number): TemplateVersion {
  const source = state.templates.find((it) => it.templateId === templateId && it.version === version)
  if (!source) throw new Error('模板不存在')
  assertUnconditionalProjection(source, new Map(state.modules.map((mod) => [MODULE_KEY(mod.moduleId, mod.version), mod])))
  const preview = previewDemo(state, templateId, version)
  if (preview.blocked || !preview.tasks.length || preview.tasks.some((it) => it.objectKey)) throw new Error('审核责任未通过预览校验')
  return {
    templateId, version, schemaVersion: 2, name: source.name,
    description: '[D0.5 DEMO / 非校规] ' + source.purpose,
    sourceNote: 'D0.5_DEMO_ONLY: 合成/用户任务技术演示；不得发布或冒充正式行政政策。',
    catalogKind: 'custom', objectType: 'document', displayName: { template: source.name },
    fields: [], materialSlots: [], policyVersionIds: [],
    sections: [{
      id: 'semantic-tasks', name: '语义审核责任', required: true, order: 0,
      criteria: preview.tasks.map((task) => ({
        id: 'demo-' + createHash('sha256').update(task.checkId).digest('hex').slice(0, 16),
        title: task.checkId + ' · ' + task.title,
        requirement: task.requirement + '\n完成标准：' + task.completion + '\n禁区：' + task.limits
          + '\n来源性质：' + task.source.kind + ' / ' + task.source.note
          + '\n责任追溯：' + task.checkId,
        execution: 'semantic' as const, targetScope: 'case' as const,
      })),
    }],
    stages: [{ id: 'review', name: 'Agent 材料预审', kind: 'auto-check', executorRole: 'system' }],
    outputs: [{ id: 'feedback', kind: 'item-feedback', audience: 'reviewer' }],
    status: 'draft', createdAt: new Date().toISOString(),
  }
}

/**
 * 独立于 Pi 的合成回执检查。指纹不匹配（包括缺失）时绝不认定当前覆盖，
 * 即使 checkId 恰好相同。D1/D2 仍需绑定真实输入哈希和 SourceRef。
 */
export function checkDemoCoverage(preview: DemoPreview, receipt: DemoCoverageReceipt): { complete: boolean; problems: string[] } {
  const problems = [...preview.issues]
  if (!receipt || receipt.fingerprint !== preview.fingerprint) {
    problems.push('生效任务包 fingerprint 不匹配或缺失；旧版本审核回执不能复用')
  }
  const entries = Array.isArray(receipt?.entries) ? receipt.entries : []
  if (!Array.isArray(receipt?.entries)) problems.push('覆盖回执缺少检查记录数组')
  const known = new Set(preview.tasks.map((task) => task.checkId))
  const seen = new Set<string>()
  for (const entry of entries) {
    if (!known.has(entry.checkId)) problems.push('未知检查 ID：' + entry.checkId)
    if (seen.has(entry.checkId)) problems.push('重复检查回执：' + entry.checkId)
    seen.add(entry.checkId)
    if (['compliant', 'non-compliant'].includes(entry.status) && !(entry.sourceIds?.length)) {
      problems.push('确定性意见缺少真实来源引用：' + entry.checkId)
    }
    if (['awaiting-supplement', 'awaiting-confirmation', 'not-applicable', 'not-executed', 'execution-failed'].includes(entry.status) && !entry.reason?.trim()) {
      problems.push('待核/不适用/失败状态缺少说明：' + entry.checkId)
    }
    if (['not-executed', 'execution-failed'].includes(entry.status)) problems.push('仍有未完成或失败检查：' + entry.checkId)
  }
  for (const task of preview.tasks) if (!seen.has(task.checkId)) problems.push('审核责任漏项：' + task.checkId)
  if (preview.blocked) problems.push('情景或组合校验尚未通过')
  return { complete: problems.length === 0, problems }
}
