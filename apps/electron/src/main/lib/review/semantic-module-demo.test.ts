import { describe, expect, test } from 'bun:test'
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { DemoModule, DemoTemplate, DemoTransaction } from './semantic-module-demo'
import {
  applyDemoTransaction, checkDemoCoverage, emptyDemoState, previewDemo, projectSimpleDemoDraft, validateDemoState,
} from './semantic-module-demo'
import { publishTemplate, saveDraft, validateTemplate } from './template-store'
import { resolveEffectiveRules } from './effective-rules'
import { emptyAggregate } from './case-store-v2'

const synthetic = { kind: 'synthetic' as const, note: '合成业务数据，仅供 D0.5 技术验证，不代表任何学校规定' }
const task = (id: string, requirement: string) => ({
  id, title: id, requirement, completion: '记录逐项状态、证据位置及不能判断的原因',
  limits: '不得作出行政审批决定',
})
function moduleOf(moduleId: string, requirement: string): DemoModule {
  return {
    moduleId, version: 1, name: moduleId, purpose: '独立完成局部核对',
    scope: '本次审核的已确定对象', source: synthetic,
    limits: '通过局部核对不代表整案具备业务资格',
    tasks: [task('check', requirement)],
  }
}
function templateOf(templateId = 'text-proof'): DemoTemplate {
  return {
    templateId, version: 1, name: '普通文本审核（合成）',
    purpose: '检查一份文本是否包含必要章节', limits: '只输出材料预审意见，禁止自动审批',
    source: synthetic, modules: [], localTasks: [],
  }
}
function setup(modules: DemoModule[], template: DemoTemplate) {
  return applyDemoTransaction(emptyDemoState(), {
    expectedRevision: 0,
    operations: [
      ...modules.map((mod) => ({ op: 'create-module' as const, module: mod })),
      { op: 'create-template' as const, template },
    ],
  })
}

describe('D0.5 Agent-first 轻量语义模块（BDD）', () => {
  test('Given 简单文本责任 When Agent 批量建模 Then 可投影到现有 TemplateVersion/RuleSpec 而无节点图', () => {
    const module = moduleOf('text-structure', '核对摘要、正文、参考文献三部分，并指出实际缺失位置')
    const template = { ...templateOf(), modules: [{ id: 'text', moduleId: 'text-structure', version: 1 }] }
    const state = setup([module], template)
    const preview = previewDemo(state, 'text-proof', 1)
    expect(preview.blocked).toBeFalse()
    expect(preview.tasks).toHaveLength(1)
    expect(preview.tasks[0]?.requirement).toContain('摘要、正文、参考文献')
    const draft = projectSimpleDemoDraft(state, 'text-proof', 1)
    expect(draft.status).toBe('draft')
    expect(draft.outputs[0]?.kind).toBe('item-feedback')
    expect(draft.outputs.some((it) => it.kind === 'approval')).toBeFalse()
    expect(validateTemplate(draft).filter((it) => it.level === 'error')).toEqual([])
    const aggregate = emptyAggregate({
      id: 'simple-text', templateId: draft.templateId, templateVersion: draft.version,
      title: '合成文档', objectType: 'document', caseFields: {}, subjects: [], documents: [],
      stage: 'submitted', revision: 0, createdAt: '', updatedAt: '',
    })
    const rules = resolveEffectiveRules(aggregate, draft).map((it) => it.rule)
    expect(rules).toHaveLength(1)
    expect(rules[0]?.execution).toBe('semantic')
    expect(rules[0]?.requirement).toContain(preview.tasks[0]!.checkId)
    expect(rules[0]?.confirmation).toBe('confirmed') // 模板结构，不等同校规权威已确认
  })

  test('Given 固定引用 When 新建模块版本与局部切换 Then 原模块、旧引用和历史预览不变', () => {
    const module = moduleOf('source-consistency', '核对文本作者名称')
    const template = { ...templateOf(), modules: [{ id: 'identity', moduleId: module.moduleId, version: 1 }] }
    const original = setup([module], template)
    const before = previewDemo(original, template.templateId, 1)
    const updated = applyDemoTransaction(original, {
      expectedRevision: 1,
      operations: [
        { op: 'revise-module', moduleId: module.moduleId, fromVersion: 1, toVersion: 2, changes: { tasks: [task('check', '核对文本作者姓名及签署日期')] } },
        { op: 'replace-module-use', templateId: template.templateId, version: 1, use: { id: 'identity', moduleId: module.moduleId, version: 2 } },
      ],
    })
    expect(original.modules).toHaveLength(1)
    expect(original.templates[0]?.modules[0]?.version).toBe(1)
    expect(previewDemo(original, template.templateId, 1).fingerprint).toBe(before.fingerprint)
    expect(previewDemo(updated, template.templateId, 1).tasks[0]?.requirement).toContain('签署日期')
    expect(updated.modules.find((it) => it.version === 1)?.tasks[0]?.requirement).toBe('核对文本作者名称')
    expect(() => applyDemoTransaction(updated, { expectedRevision: 1, operations: [{ op: 'patch-template', templateId: template.templateId, version: 1, changes: { name: '覆盖' } }] })).toThrow('VERSION_CONFLICT')
  })

  test('Given 错误引用、环和越权参数 When 事务写入 Then 原子拒绝、不提升 revision', () => {
    const original = setup([moduleOf('core-review', '核对本次材料')], templateOf())
    const wrong: DemoTransaction = {
      expectedRevision: 1, operations: [
        { op: 'add-module-use', templateId: 'text-proof', version: 1, use: { id: 'missing', moduleId: 'not-found', version: 2 } },
      ],
    }
    expect(() => applyDemoTransaction(original, wrong)).toThrow('VALIDATION_FAILED')
    expect(original.revision).toBe(1)
    expect(original.templates[0]?.modules).toEqual([])
    expect(() => applyDemoTransaction(original, {
      expectedRevision: 1, operations: [
        { op: 'add-module-use', templateId: 'text-proof', version: 1, use: { id: 'params', moduleId: 'core-review', version: 1, bindings: { secret: '绕过正式审核' } } },
      ],
    })).toThrow('不允许传入未开放参数')
    const self = moduleOf('recursive', '递归节点')
    self.references = [{ id: 'self', moduleId: 'recursive', version: 1 }]
    expect(() => applyDemoTransaction(original, { expectedRevision: 1, operations: [{ op: 'create-module', module: self }] })).toThrow('循环')
    const official = moduleOf('official-claim', '假设校规必须通过')
    official.source = { kind: 'official-policy', note: '无可验证来源' }
    expect(() => applyDemoTransaction(original, { expectedRevision: 1, operations: [{ op: 'create-module', module: official }] })).toThrow('不支持在 D0.5 中认证正式校规')
  })

  test('Given 特殊校园卡双分支 When 未知/家属/服务人员切换 Then 不互相引入资格规则', () => {
    const relation = moduleOf('relation-evidence', '核对申请人、持卡人与关联人的关系证明；关系不等于代办许可')
    const proxy = moduleOf('agent-authorization', '核对代理人是否有权代办当前对象及该办理事项；只报告授权范围')
    const card: DemoTemplate = {
      ...templateOf('special-campus-card'), name: '特殊校园卡资格预审（合成）',
      scenarios: ['family', 'temporary-service'],
      modules: [
        { id: 'family-relation', moduleId: 'relation-evidence', version: 1, scenario: 'family' },
        { id: 'family-proxy', moduleId: 'agent-authorization', version: 1, scenario: 'family' },
        { id: 'temporary-proxy', moduleId: 'agent-authorization', version: 1, scenario: 'temporary-service' },
      ],
      localTasks: [task('authority', '校园卡资格批准状态须由校方有效依据确认，不能只凭亲属或用工事实推定')],
    }
    const state = setup([relation, proxy], card)
    const unknown = previewDemo(state, card.templateId, 1)
    expect(unknown.blocked).toBeTrue()
    expect(unknown.issues.join()).toContain('需要明确业务情景')
    const family = previewDemo(state, card.templateId, 1, 'family')
    const temporary = previewDemo(state, card.templateId, 1, 'temporary-service')
    expect(family.blocked).toBeFalse()
    expect(family.tasks).toHaveLength(3)
    expect(temporary.tasks).toHaveLength(2)
    expect(family.tasks.some((it) => it.requirement.includes('关系证明'))).toBeTrue()
    expect(temporary.tasks.some((it) => it.requirement.includes('关系证明'))).toBeFalse()
    expect(() => projectSimpleDemoDraft(state, card.templateId, 1)).toThrow('复杂业务情景只能预览')
  })

  test('Given 同档案件查阅和复制 When 两个实例引用同一授权模块 Then 每项的覆盖和权限相互隔离', () => {
    const auth = moduleOf('agent-authorization', '核查授权凭证仅覆盖 {{action}} 操作，不得借另一操作的许可推定本操作已授权')
    auth.parameters = [{ key: 'action', description: '当前档案件的独立申请操作' }]
    const archive: DemoTemplate = {
      ...templateOf('archive-access'), name: '档案利用申请（合成）',
      modules: [
        { id: 'read', moduleId: 'agent-authorization', version: 1, objectKey: 'item-1/read', bindings: { action: '查阅' } },
        { id: 'copy', moduleId: 'agent-authorization', version: 1, objectKey: 'item-1/copy', bindings: { action: '复制' } },
      ],
    }
    const state = setup([auth], archive)
    const preview = previewDemo(state, archive.templateId, 1)
    expect(preview.blocked).toBeFalse()
    expect(preview.tasks).toHaveLength(2)
    const read = preview.tasks.find((it) => it.objectKey === 'item-1/read')!
    const copy = preview.tasks.find((it) => it.objectKey === 'item-1/copy')!
    expect(read.checkId).not.toBe(copy.checkId)
    expect(read.requirement).toContain('查阅')
    expect(copy.requirement).toContain('复制')
    const receipt = checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries: [
      { checkId: read.checkId, status: 'compliant', sourceIds: ['synthetic-document:authorization-read'], reason: '仅授权查阅' },
      { checkId: copy.checkId, status: 'awaiting-confirmation', reason: '复制授权缺少可靠凭证' },
    ] })
    expect(receipt.complete).toBeTrue() // 记录齐全，不代表两个操作均已获准
    expect(() => projectSimpleDemoDraft(state, archive.templateId, 1)).toThrow('复杂业务情景只能预览')
  })

  test('Given 审核覆盖账本 When 缺少某个责任或无引证就宣称符合 Then 拒绝完成', () => {
    const state = setup([moduleOf('text-structure', '核对正文')], { ...templateOf(), modules: [{ id: 'text', moduleId: 'text-structure', version: 1 }] })
    const preview = previewDemo(state, 'text-proof', 1)
    expect(checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries: [] }).problems.join()).toContain('审核责任漏项')
    expect(checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries: [{ checkId: preview.tasks[0]!.checkId, status: 'compliant', reason: '自称完成' }] }).problems.join()).toContain('缺少真实来源引用')
    expect(checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries: [{ checkId: preview.tasks[0]!.checkId, status: 'execution-failed', reason: '无法读取' }] }).complete).toBeFalse()
    expect(checkDemoCoverage(preview, { fingerprint: preview.fingerprint, entries: [{ checkId: preview.tasks[0]!.checkId, status: 'not-applicable', reason: '' }] }).complete).toBeFalse()
    expect(validateDemoState(state)).toEqual([])
  })

  test('Given D0.5 合成草稿 When 经现有模板服务发布 Then 必须拒绝，不会变成学校规则', () => {
    const folder = mkdtempSync(join(tmpdir(), 'd05-review-'))
    const oldDir = process.env.PROFER_CONFIG_DIR
    process.env.PROFER_CONFIG_DIR = folder
    try {
      const state = setup([moduleOf('text-structure', '核对正文')], {
        ...templateOf(), modules: [{ id: 'text', moduleId: 'text-structure', version: 1 }],
      })
      const draft = projectSimpleDemoDraft(state, 'text-proof', 1)
      saveDraft(draft)
      expect(() => publishTemplate(draft.templateId, draft.version)).toThrow('D0.5 演示草稿不得发布')
    } finally {
      if (oldDir === undefined) delete process.env.PROFER_CONFIG_DIR
      else process.env.PROFER_CONFIG_DIR = oldDir
      rmSync(folder, { recursive: true, force: true })
    }
  })

  test('Given 同一审核责任 When 调整无关检查顺序 Then 投影后的规则 ID 不漂移', () => {
    const module = moduleOf('text-structure', '核对章节')
    module.tasks.push(task('language', '核对语句是否清晰'))
    const template = { ...templateOf(), modules: [{ id: 'text', moduleId: module.moduleId, version: 1 }] }
    const old = setup([module], template)
    const before = projectSimpleDemoDraft(old, template.templateId, 1)
    const next = applyDemoTransaction(old, {
      expectedRevision: 1,
      operations: [{
        op: 'revise-module', moduleId: module.moduleId, fromVersion: 1, toVersion: 2,
        changes: { tasks: [...module.tasks].reverse() },
      }, {
        op: 'replace-module-use', templateId: template.templateId, version: 1,
        use: { id: 'text', moduleId: module.moduleId, version: 2 },
      }],
    })
    const after = projectSimpleDemoDraft(next, template.templateId, 1)
    const beforeIds = before.sections![0]!.criteria.map((it) => it.id).sort()
    const afterIds = after.sections![0]!.criteria.map((it) => it.id).sort()
    expect(afterIds).toEqual(beforeIds)
  })

  test('Given 复合语义模块 When 引用子模块并局部补充责任 Then 预览展开稳定子责任而不规定执行顺序', () => {
    const child = moduleOf('relation-proof', '核对当前对象的授权关系')
    const group = moduleOf('composite-authority', '核对被委托人的办理目的')
    group.references = [{ id: 'relation', moduleId: 'relation-proof', version: 1 }]
    const template = {
      ...templateOf(), modules: [{ id: 'authority', moduleId: 'composite-authority', version: 1 }],
    }
    const original = setup([child, group], template)
    const edited = applyDemoTransaction(original, {
      expectedRevision: 1, operations: [{
        op: 'upsert-local-task', templateId: template.templateId, version: 1,
        task: task('text-scope', '只核对用户明确提出的文本范围，不进行正式审批'),
      }],
    })
    expect(original.templates[0]?.localTasks).toHaveLength(0)
    const preview = previewDemo(edited, template.templateId, 1)
    expect(preview.blocked).toBeFalse()
    expect(preview.tasks).toHaveLength(3)
    expect(preview.tasks.map((it) => it.checkId)).toContain('module/authority/relation/check')
    expect(preview.tasks.find((it) => it.checkId === 'module/authority/relation/check')?.moduleRef?.moduleId).toBe('relation-proof')
  })

  test('Given 合成 fixture When Agent 从命令行预览并提交批量编辑 Then 状态版本真实落盘且可以投影旧模板', () => {
    const fixtureDir = resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures')
    const cliPath = resolve(import.meta.dir, '../../../../scripts/review-semantic-demo.ts')
    const folder = mkdtempSync(join(tmpdir(), 'd05-cli-'))
    const statePath = join(folder, 'state.json')
    const execute = (commandPath: string): Record<string, any> => {
      const result = Bun.spawnSync({
        cmd: [process.execPath, cliPath, statePath, commandPath],
        env: { ...process.env, PROFER_CONFIG_DIR: folder },
      })
      if (result.exitCode !== 0) throw new Error(result.stderr.toString())
      return JSON.parse(result.stdout.toString()) as Record<string, any>
    }
    try {
      copyFileSync(join(fixtureDir, 'd05-synthetic-state.json'), statePath)
      const family = execute(join(fixtureDir, 'd05-preview-card-family.json'))
      expect(family.blocked).toBeFalse()
      expect(family.tasks).toHaveLength(3)
      const archive = execute(join(fixtureDir, 'd05-preview-archive.json'))
      expect(archive.tasks.map((it: { objectKey?: string }) => it.objectKey)).toContain('item-1/copy')
      const edited = execute(join(fixtureDir, 'd05-agent-edit.json'))
      expect(edited.revision).toBe(2)
      const commandPath = join(folder, 'project.json')
      writeFileSync(commandPath, JSON.stringify({ kind: 'project', templateId: 'text-review', version: 1 }))
      const projected = execute(commandPath)
      expect(projected.sections[0].criteria[0].requirement).toContain('标题、摘要、正文及结论')
      expect(projected.status).toBe('draft')
    } finally {
      rmSync(folder, { recursive: true, force: true })
    }
  })

  test('回归 1：无条件顶层引用含 family 子模块时，必须检测隐藏分支并阻止投影', () => {
    const child = moduleOf('family-proof', '核对家属关系')
    const group = moduleOf('composite', '核对共同材料')
    group.references = [{ id: 'family-only', moduleId: child.moduleId, version: 1, scenario: 'family' }]
    const template = { ...templateOf(), modules: [{ id: 'root', moduleId: group.moduleId, version: 1 }] }
    // 未声明情景的整个模板引用树应在创建/保存时被拒绝，不能漏掉未激活的子责任。
    expect(() => setup([child, group], template)).toThrow('引用未知情景')
    const valid = setup([child, group], { ...template, scenarios: ['family', 'temporary-service'] })
    expect(previewDemo(valid, template.templateId, 1, 'family').tasks).toHaveLength(2)
    expect(previewDemo(valid, template.templateId, 1, 'temporary-service').tasks).toHaveLength(1)
    expect(previewDemo(valid, template.templateId, 1).blocked).toBeTrue()
    expect(() => projectSimpleDemoDraft(valid, template.templateId, 1)).toThrow('复杂业务情景只能预览')
    const legacy = structuredClone(valid)
    delete legacy.templates[0]!.scenarios
    const preview = previewDemo(legacy, template.templateId, 1)
    expect(preview.blocked).toBeTrue()
    expect(preview.issues.join()).toContain('引用未知情景')
    expect(() => projectSimpleDemoDraft(legacy, template.templateId, 1)).toThrow('family-only 存在条件情景')
  })

  test('回归 1：无条件复合模块隐藏逐对象作用范围或未知条件字段，投影必须拒绝', () => {
    const child = moduleOf('operation-proof', '核对复制授权')
    const parent = moduleOf('group-proof', '核对共同前提')
    parent.references = [{ id: 'copy', moduleId: child.moduleId, version: 1, objectKey: 'item-1/copy' }]
    const template = { ...templateOf(), modules: [{ id: 'root', moduleId: parent.moduleId, version: 1 }] }
    const state = setup([child, parent], template)
    expect(previewDemo(state, template.templateId, 1).blocked).toBeFalse()
    expect(() => projectSimpleDemoDraft(state, template.templateId, 1)).toThrow('逐对象作用范围')
    const unsafeState = structuredClone(state)
    Object.assign(unsafeState.modules.find((it) => it.moduleId === 'group-proof')!.references![0]!, { when: { field: 'role', op: 'eq', value: 'family' } })
    expect(() => projectSimpleDemoDraft(unsafeState, template.templateId, 1)).toThrow('未映射的结构化属性：when')
    // 无条件嵌套依然允许投影：不能因修复而禁止真正的复合模块。
    const unconditional = structuredClone(state)
    delete unconditional.modules.find((it) => it.moduleId === 'group-proof')!.references![0]!.objectKey
    expect(projectSimpleDemoDraft(unconditional, template.templateId, 1).sections![0]!.criteria).toHaveLength(2)
  })

  test('回归 1：父子条件互相排斥时要显式报错，而非悄悄遗漏责任', () => {
    const child = moduleOf('child-review', '核对家属关系')
    const parent = moduleOf('parent-review', '核对本次资格')
    parent.references = [{ id: 'child', moduleId: child.moduleId, version: 1, scenario: 'temporary-service' }]
    const stateTemplate = { ...templateOf(), scenarios: ['family', 'temporary-service'],
      modules: [{ id: 'root', moduleId: parent.moduleId, version: 1, scenario: 'family' }] }
    expect(() => setup([parent, child], stateTemplate)).toThrow('子情景与父情景冲突')
  })

  test('回归 2：相同 checkId 修改审核要求后，旧 fingerprint 的合格回执必须过期', () => {
    const mod = moduleOf('identity-proof', '核对申请人姓名')
    const template = { ...templateOf(), modules: [{ id: 'identity', moduleId: mod.moduleId, version: 1 }] }
    const old = setup([mod], template)
    const oldPreview = previewDemo(old, template.templateId, 1)
    const oldReceipt = {
      fingerprint: oldPreview.fingerprint,
      entries: [{ checkId: oldPreview.tasks[0]!.checkId, status: 'compliant' as const, reason: '仅核对姓名',
        sourceIds: ['synthetic-document:name'] }],
    }
    expect(checkDemoCoverage(oldPreview, oldReceipt).complete).toBeTrue()
    const modified = applyDemoTransaction(old, { expectedRevision: 1, operations: [
      { op: 'revise-module', moduleId: mod.moduleId, fromVersion: 1, toVersion: 2,
        changes: { tasks: [task('check', '核对姓名及签署日期')] } },
      { op: 'replace-module-use', templateId: template.templateId, version: 1,
        use: { id: 'identity', moduleId: mod.moduleId, version: 2 } },
    ] })
    const now = previewDemo(modified, template.templateId, 1)
    expect(now.tasks[0]?.checkId).toBe(oldPreview.tasks[0]?.checkId)
    expect(now.fingerprint).not.toBe(oldPreview.fingerprint)
    const rejected = checkDemoCoverage(now, oldReceipt)
    expect(rejected.complete).toBeFalse()
    expect(rejected.problems.join()).toContain('fingerprint 不匹配')
    expect(checkDemoCoverage(now, { fingerprint: now.fingerprint, entries: oldReceipt.entries }).complete).toBeTrue()
    expect(checkDemoCoverage(now, { entries: oldReceipt.entries } as any).complete).toBeFalse()
  })

  test('嵌套参数优先级：子引用显式值 > 父模块继承值 > 子模块默认值', () => {
    const child = moduleOf('child-task', '核对 {{action}} 期限')
    child.parameters = [{ key: 'action', description: '目标操作', defaultValue: '默认复制' }]
    const parent = moduleOf('parent-task', '核对 {{action}} 许可')
    parent.parameters = [{ key: 'action', description: '目标操作' }]
    parent.references = [{ id: 'nested', moduleId: child.moduleId, version: 1 }]
    const template = { ...templateOf(), modules: [{ id: 'root', moduleId: parent.moduleId, version: 1, bindings: { action: '查阅' } }] }
    const state = setup([child, parent], template)
    const inherited = previewDemo(state, template.templateId, 1)
    expect(inherited.blocked).toBeFalse()
    expect(inherited.tasks.find((it) => it.checkId.endsWith('/nested/check'))?.requirement).toContain('查阅')
    expect(inherited.tasks.find((it) => it.checkId.endsWith('/nested/check'))?.requirement).not.toContain('默认复制')

    const explicit = structuredClone(state)
    explicit.modules.find((it) => it.moduleId === parent.moduleId)!.references![0]!.bindings = { action: '摘录' }
    const nested = previewDemo(explicit, template.templateId, 1)
    expect(nested.blocked).toBeFalse()
    expect(nested.tasks.find((it) => it.checkId.endsWith('/nested/check'))?.requirement).toContain('摘录')

    const defaultOnly = structuredClone(state)
    defaultOnly.templates[0]!.modules[0]!.bindings = { action: '查阅' }
    defaultOnly.modules.find((it) => it.moduleId === parent.moduleId)!.references![0]!.bindings = {}
    // 模块未明确传入时不覆盖从父级继承的值。
    expect(previewDemo(defaultOnly, template.templateId, 1).blocked).toBeFalse()
  })
})
