import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import type { ReviewAuthoringWorkspaceV1 } from '@profer/shared'
import {
  compileReviewAuthoringCandidateV1, validateReviewAuthoringV1, verifyReviewAuthoringManifestV1,
} from './review-authoring-v1'
import {
  diffReviewAuthoringRevisionsV1, getReviewAuthoringRevisionV1, saveReviewAuthoringRevisionV1,
} from './review-authoring-store-v1'
import { publishTemplate, saveDraft, saveAuthoringCandidateDraft } from './template-store'

const synthetic = { kind: 'synthetic' as const, note: '仅供 D1 验证，非任何学校现行政策' }
const task = (requirement: string) => ({
  id: 'check', title: '核对章节', requirement,
  completion: '记录检查状态、出处与待确认项', limits: '不得作行政批准',
})
function basic(): ReviewAuthoringWorkspaceV1 {
  return {
    schemaVersion: 1, workspaceId: 'simple-d1', revision: 1,
    definitions: {
      modules: [{
        moduleId: 'text-structure', version: 1, name: '普通文本核对', purpose: '核对文章必要章节',
        scope: '提交的当前文章', limits: '不是学校审批', source: synthetic,
        tasks: [task('核对摘要、正文和结论；不可读时不能判定合格')],
      }],
      templates: [{
        templateId: 'simple-text', version: 1, name: '普通文本审核', purpose: '判断文本章节是否符合作者要求',
        limits: '只提供修改意见', source: synthetic,
        modules: [{ id: 'text', moduleId: 'text-structure', version: 1 }], localTasks: [],
      }],
    },
    sources: [{
      sourceId: 'request', kind: 'user-request', label: '委托人明确要求', note: '仅适用于本次文本审阅',
      verification: 'unverified', applicability: 'request-scope',
    }],
    sourceBindings: [{ checkId: 'simple-text@1:module/text/check', sourceIds: ['request'] }],
  }
}

describe('D1 作者态真实映射与来源治理（BDD）', () => {
  test('Given 作者态 JSON When Agent 通过 CLI 验证和编译 Then 返回生效规则映射而不发布', () => {
    const json = resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures/d1-authoring-text-v1.json')
    const cli = resolve(import.meta.dir, '../../../../scripts/review-authoring-v1.ts')
    const run = (args: string[]) => {
      const result = Bun.spawnSync({
        cmd: [process.execPath, cli, ...args],
        env: { ...process.env, PROFER_CONFIG_DIR: join(tmpdir(), 'd1-cli-isolated') },
      })
      if (result.exitCode !== 0) throw new Error(result.stderr.toString())
      return JSON.parse(result.stdout.toString()) as Record<string, any>
    }
    expect(run(['validate', json]).ok).toBeTrue()
    const candidate = run(['candidate', json, 'text-review', '1'])
    expect(candidate.manifest.mapping).toHaveLength(1)
    expect(candidate.template.status).toBe('draft')
    expect(candidate.manifest.publicationAllowed).toBeFalse()
  })

  test('Given D1 编译候选 When Agent 经 candidate-save CLI 首次保存 Then 服务端资格强制封存', () => {
    const fixture = resolve(import.meta.dir, '../../../../../../docs/design/review-agent/fixtures/d1-authoring-text-v1.json')
    const cli = resolve(import.meta.dir, '../../../../scripts/review-authoring-v1.ts')
    const folder = mkdtempSync(join(tmpdir(), 'd1-candidate-cli-'))
    try {
      const result = Bun.spawnSync({
        cmd: [process.execPath, cli, 'candidate-save', fixture, 'text-review', '1'],
        env: { ...process.env, PROFER_CONFIG_DIR: folder },
      })
      expect(result.exitCode).toBe(0)
      if (result.exitCode !== 0) throw new Error(result.stderr.toString())
      const response = JSON.parse(result.stdout.toString()) as { saved: boolean; publicationEligible: boolean }
      expect(response.saved).toBeTrue()
      expect(response.publicationEligible).toBeFalse()
      const control = JSON.parse(readFileSync(join(folder, 'review-template-controls', 'text-review', '1.json'), 'utf8')) as { classification: string }
      expect(control.classification).toBe('candidate-held')
      const second = Bun.spawnSync({
        cmd: [process.execPath, cli, 'candidate-save', fixture, 'text-review', '1'],
        env: { ...process.env, PROFER_CONFIG_DIR: folder },
      })
      expect(second.exitCode).not.toBe(0) // 相同 ID/版本不能隐式覆盖已登记的候选。
    } finally {
      rmSync(folder, { recursive: true, force: true })
    }
  })

  test('Given 自然语言责任 When 编译候选 Then 每条标准都与原 RuleSpec 同一真值且有来源映射', () => {
    const workspace = basic()
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    const result = compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)
    expect(result.preview.blocked).toBeFalse()
    expect(result.manifest.status).toBe('review-candidate')
    expect(result.manifest.publicationAllowed).toBeFalse()
    expect(result.manifest.mapping).toHaveLength(1)
    expect(result.manifest.mapping[0]?.checkId).toBe('module/text/check')
    expect(result.manifest.mapping[0]?.ruleId).toBe('section-semantic-tasks-' + result.manifest.mapping[0]?.criterionId)
    expect(result.manifest.mapping[0]?.sourceIds).toEqual(['request'])
    expect(result.manifest.mapping[0]?.sourceKinds).toEqual(['user-request'])
    expect(verifyReviewAuthoringManifestV1(result.template, result.manifest, basic())).toEqual([])
  })

  test('Given 运行候选被改写 When 重新核验 Then 不得再复用旧有效规则映射', () => {
    const result = compileReviewAuthoringCandidateV1(basic(), 'simple-text', 1)
    result.template.sections![0]!.criteria[0]!.requirement = '只核对摘要；擅自忽略正文'
    expect(verifyReviewAuthoringManifestV1(result.template, result.manifest, basic()).join('；')).toContain('模板内容或版本与作者态 manifest 不符')
    expect(verifyReviewAuthoringManifestV1(result.template, result.manifest, basic()).join('；')).toContain('生效规则集与作者态 manifest 不符')
  })

  test('Given manifest 来源映射被修改 When 对照不可变作者态 Then 不能把未知来源伪装成原始来源', () => {
    const workspace = basic()
    const candidate = compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)
    const altered = structuredClone(candidate.manifest)
    altered.mapping[0]!.sourceIds = ['another-source']
    expect(verifyReviewAuthoringManifestV1(candidate.template, altered, workspace).join('；')).toContain('责任来源映射与作者态不一致')
    const changedWorkspace = structuredClone(workspace)
    changedWorkspace.sources[0]!.note = '来源后续被修改'
    expect(verifyReviewAuthoringManifestV1(candidate.template, candidate.manifest, changedWorkspace).join('；')).toContain('作者态定义或来源绑定已变化')
  })

  test('Given 未映射的结构化条件或被修改的预览指纹 When 核验 Then 必须拒绝静默降级', () => {
    const original = basic()
    const unsafe = structuredClone(original)
    Object.assign(unsafe.definitions.modules[0]!.tasks[0]!, { condition: { role: 'family' } })
    expect(validateReviewAuthoringV1(unsafe).join('；')).toContain('未映射结构化字段：condition')
    expect(() => compileReviewAuthoringCandidateV1(unsafe, 'simple-text', 1)).toThrow('AUTHORING_INVALID')
    const candidate = compileReviewAuthoringCandidateV1(original, 'simple-text', 1)
    const changed = structuredClone(candidate.manifest)
    changed.previewFingerprint = 'outdated-preview-fingerprint'
    expect(verifyReviewAuthoringManifestV1(candidate.template, changed, original).join('；')).toContain('责任包指纹')
    const unrecognized = structuredClone(original)
    Object.assign(unrecognized.advanced ??= {}, { mustCheckAuthority: true })
    expect(validateReviewAuthoringV1(unrecognized).join('；')).toContain('未映射结构化字段')
  })

  test('Given 缺来源绑定或引用错误 When 静态验证 Then 不以隐式来源生成规则', () => {
    const workspace = basic()
    workspace.sourceBindings = []
    expect(validateReviewAuthoringV1(workspace).join('；')).toContain('审核责任缺少来源绑定')
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('AUTHORING_INVALID')
    workspace.sourceBindings = [{ checkId: 'simple-text@1:module/text/check', sourceIds: ['not-exists'] }]
    expect(validateReviewAuthoringV1(workspace).join('；')).toContain('不存在的来源')
  })

  test('Given 跨校制度与本校未核政策 When 申请编译 Then 未授权规则不能被提升为可执行审查标准', () => {
    const workspace = basic()
    workspace.sources[0] = {
      sourceId: 'request', kind: 'cross-school-reference', label: '他校制度样例',
      note: '用于分析而非当前学校强制依据', verification: 'content-checked', applicability: 'reference-only',
      reference: { documentVersionId: 'unrelated-school-document-v1', locator: '§3' },
    }
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('UNVERIFIED_AUTHORITY')
    workspace.sources[0] = { ...workspace.sources[0]!, kind: 'policy-candidate', applicability: 'unknown' }
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('UNVERIFIED_AUTHORITY')
    workspace.sources[0]!.applicability = 'request-scope'
    expect(validateReviewAuthoringV1(workspace).join('；')).toContain('制度候选不得直接宣称适用于本案')
  })

  test('Given 高级证据或条件结构 When 旧 RuleSpec 没有无损映射 Then 明确拒绝，允许只有基础语义的模板', () => {
    const workspace = basic()
    workspace.advanced = { claimKeys: ['claim-person'] }
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('UNMAPPABLE_ADVANCED')
    workspace.advanced = undefined
    const nested = workspace.definitions.modules[0]!
    nested.references = [{ id: 'nested', moduleId: nested.moduleId, version: 1 }]
    expect(validateReviewAuthoringV1(workspace).join('；')).toContain('循环')
  })

  test('Given 校园卡双分支和档案逐操作 When 映射作者态 Then 可以验证来源覆盖，但不能错误投影成无条件审核', () => {
    const workspace = basic()
    const templates = workspace.definitions.templates
    templates[0]!.scenarios = ['family', 'temporary-service']
    templates[0]!.modules = [
      { id: 'family', moduleId: 'text-structure', version: 1, scenario: 'family' },
      { id: 'service', moduleId: 'text-structure', version: 1, scenario: 'temporary-service' },
    ]
    workspace.sourceBindings = [
      { checkId: 'simple-text@1:module/family/check', sourceIds: ['request'] },
      { checkId: 'simple-text@1:module/service/check', sourceIds: ['request'] },
    ]
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('复杂业务情景只能预览')
    templates[0]!.scenarios = undefined
    templates[0]!.modules = [
      { id: 'read', moduleId: 'text-structure', version: 1, objectKey: 'item-1/read' },
      { id: 'copy', moduleId: 'text-structure', version: 1, objectKey: 'item-1/copy' },
    ]
    workspace.sourceBindings = [
      { checkId: 'simple-text@1:module/read/check', sourceIds: ['request'] },
      { checkId: 'simple-text@1:module/copy/check', sourceIds: ['request'] },
    ]
    expect(validateReviewAuthoringV1(workspace)).toEqual([])
    expect(() => compileReviewAuthoringCandidateV1(workspace, 'simple-text', 1)).toThrow('逐对象作用范围')
  })
})

describe('D1 作者态修订存储与候选发布隔离', () => {
  const previous = process.env.PROFER_CONFIG_DIR
  const home = mkdtempSync(join(tmpdir(), 'review-d1-test-'))
  process.env.PROFER_CONFIG_DIR = home
  afterAll(() => {
    if (previous === undefined) delete process.env.PROFER_CONFIG_DIR
    else process.env.PROFER_CONFIG_DIR = previous
    rmSync(home, { recursive: true, force: true })
  })

  test('Given 草稿连续两次修改 When 记录版本 Then 草稿修订号与发布模板版本不同、历史可读', () => {
    const draft = basic()
    const first = saveReviewAuthoringRevisionV1(draft, 0, 'author-agent')
    expect(first.workspace.revision).toBe(1)
    expect(first.parentDigest).toBeUndefined()
    const changed = structuredClone(draft)
    changed.revision = 2
    changed.definitions.modules[0]!.tasks[0]!.requirement += '；还要明确文章标题'
    const second = saveReviewAuthoringRevisionV1(changed, 1, 'author-agent')
    expect(second.parentDigest).toBe(first.digest)
    expect(getReviewAuthoringRevisionV1('simple-d1')?.workspace.revision).toBe(2)
    expect(getReviewAuthoringRevisionV1('simple-d1', 1)?.workspace.definitions.modules[0]?.tasks[0]?.requirement).not.toContain('标题')
    expect(diffReviewAuthoringRevisionsV1(draft, changed).changedModules).toContain('text-structure@1')
    expect(() => saveReviewAuthoringRevisionV1(changed, 1, 'another-agent')).toThrow('AUTHORING_REVISION_CONFLICT')
    const old = getReviewAuthoringRevisionV1('simple-d1', 1)!
    const path = join(home, 'review-authoring-v1', 'simple-d1', 'revisions', '1.json')
    const altered = JSON.parse(readFileSync(path, 'utf8')) as typeof old
    altered.workspace.definitions.modules[0]!.tasks[0]!.requirement = '历史被改写'
    writeFileSync(path, JSON.stringify(altered))
    expect(() => getReviewAuthoringRevisionV1('simple-d1', 1)).toThrow('内容摘要不匹配')
  })

  test('Given 已登记的 D1 候选 When 草稿删除/替换说明字段并再次保存 Then 发布服务仍拒绝', () => {
    const workspace = basic()
    workspace.definitions.templates[0]!.templateId = 'candidate-immutable-gate'
    workspace.sourceBindings[0]!.checkId = 'candidate-immutable-gate@1:module/text/check'
    const candidate = compileReviewAuthoringCandidateV1(workspace, 'candidate-immutable-gate', 1)
    saveDraft(candidate.template)
    // 模拟普通编辑器直接删掉候选标签，同时改写标题与正文。
    const stripped = structuredClone(candidate.template)
    delete stripped.sourceNote
    stripped.name = '伪装普通草稿'
    stripped.sections![0]!.criteria[0]!.title = '看似普通的审核要求'
    saveDraft(stripped)
    expect(() => publishTemplate(stripped.templateId, 1)).toThrow('模板发布资格未获允许')
    // 第二次把标记替换为无关文本，也不能重新取得资格。
    saveDraft({ ...stripped, sourceNote: '用户随意输入的说明文字' })
    expect(() => publishTemplate(stripped.templateId, 1)).toThrow('模板发布资格未获允许')
    // 直接在首次登记前剥除说明，结构本身仍会被识别为 D1 候选。
    const firstSave = { ...stripped, templateId: 'first-save-stripped' }
    saveDraft(firstSave)
    expect(() => publishTemplate(firstSave.templateId, 1)).toThrow('模板发布资格未获允许')
  })

  test('Given D1 专用服务登记 When 候选首次保存前连所有可识别的展示标记都被删掉 Then 仍不能获得发布权', () => {
    const workspace = basic()
    workspace.definitions.templates[0]!.templateId = 'candidate-forced-hold'
    workspace.sourceBindings[0]!.checkId = 'candidate-forced-hold@1:module/text/check'
    const candidate = compileReviewAuthoringCandidateV1(workspace, 'candidate-forced-hold', 1)
    const altered = structuredClone(candidate.template)
    delete altered.sourceNote
    altered.sections![0]!.id = 'custom-section'
    altered.sections![0]!.criteria[0]!.id = 'plain-check'
    saveAuthoringCandidateDraft(altered)
    // 持久化后继续将其修改成普通文字，也不能降级候选发布阻断。
    saveDraft({ ...altered, name: '普通草稿标题' })
    expect(() => publishTemplate('candidate-forced-hold', 1)).toThrow('模板发布资格未获允许')
  })

  test('Given 模板资格侧记录不存在 When 首次发布 Then 缺失资格不能默认放行', () => {
    const workspace = basic()
    workspace.definitions.templates[0]!.templateId = 'qualification-absent'
    workspace.sourceBindings[0]!.checkId = 'qualification-absent@1:module/text/check'
    const candidate = compileReviewAuthoringCandidateV1(workspace, 'qualification-absent', 1)
    saveDraft(candidate.template)
    const qualificationPath = join(home, 'review-template-controls', 'qualification-absent', '1.json')
    unlinkSync(qualificationPath)
    expect(() => publishTemplate('qualification-absent', 1)).toThrow('不得正式发布')
  })

  test('Given 父摘要链被篡改 When 读历史或继续编辑 Then 明确拒绝而不产生新修订', () => {
    const name = 'parent-chain-d1'
    const draft = { ...basic(), workspaceId: name }
    const one = saveReviewAuthoringRevisionV1(draft, 0, 'test')
    const secondDraft = { ...structuredClone(draft), revision: 2 }
    const two = saveReviewAuthoringRevisionV1(secondDraft, 1, 'test')
    const thirdDraft = { ...structuredClone(draft), revision: 3 }
    const three = saveReviewAuthoringRevisionV1(thirdDraft, 2, 'test')
    expect(two.parentDigest).toBe(one.digest)
    expect(three.parentDigest).toBe(two.digest)
    const path = join(home, 'review-authoring-v1', name, 'revisions', '3.json')
    const broken = JSON.parse(readFileSync(path, 'utf8')) as typeof three
    broken.parentDigest = 'forged-parent-digest'
    writeFileSync(path, JSON.stringify(broken))
    expect(() => getReviewAuthoringRevisionV1(name)).toThrow('AUTHORING_HISTORY_BROKEN: 父版本摘要链不匹配')
    expect(() => getReviewAuthoringRevisionV1(name, 3)).toThrow('父版本摘要链不匹配')
    expect(() => saveReviewAuthoringRevisionV1({ ...draft, revision: 4 }, 3, 'test')).toThrow('父版本摘要链不匹配')
    // 恢复当前父指纹后，篡改更早的父链同样不可绕过递归验证。
    broken.parentDigest = two.digest
    writeFileSync(path, JSON.stringify(broken))
    const parentPath = join(home, 'review-authoring-v1', name, 'revisions', '2.json')
    const brokenParent = JSON.parse(readFileSync(parentPath, 'utf8')) as typeof two
    brokenParent.parentDigest = 'forged-grandparent'
    writeFileSync(parentPath, JSON.stringify(brokenParent))
    expect(() => getReviewAuthoringRevisionV1(name, 3)).toThrow('父版本摘要链不匹配')
  })

  test('Given 历史缺失或首版本伪造父摘要 When 读取最新草稿 Then 不默默忽略损坏', () => {
    const name = 'missing-parent-d1'
    const draft = { ...basic(), workspaceId: name }
    saveReviewAuthoringRevisionV1(draft, 0, 'test')
    saveReviewAuthoringRevisionV1({ ...draft, revision: 2 }, 1, 'test')
    const base = join(home, 'review-authoring-v1', name, 'revisions')
    const first = join(base, '1.json')
    const parsed = JSON.parse(readFileSync(first, 'utf8')) as ReturnType<typeof saveReviewAuthoringRevisionV1>
    parsed.parentDigest = 'invalid-first-parent'
    writeFileSync(first, JSON.stringify(parsed))
    expect(() => getReviewAuthoringRevisionV1(name, 1)).toThrow('父版本摘要链不匹配')
    delete parsed.parentDigest
    writeFileSync(first, JSON.stringify(parsed))
    unlinkSync(first)
    expect(() => getReviewAuthoringRevisionV1(name)).toThrow('AUTHORING_HISTORY_BROKEN: 历史修订缺失')
  })

  test('Given D1 已编译候选 When 经老模板服务试图发布 Then 必须拒绝', () => {
    const result = compileReviewAuthoringCandidateV1(basic(), 'simple-text', 1)
    saveDraft(result.template)
    expect(() => publishTemplate('simple-text', 1)).toThrow('D1 作者态候选尚未经过制度治理')
    expect(result.template.status).toBe('draft')
  })
})
