/**
 * 覆盖账本单测（A08/K06：材料账本 + 检查账本 + 全部符合判定）
 */
import { describe, expect, test } from 'bun:test'
import type { CheckResult, DocumentVersion, RuleSpec } from '@profer/shared'
import { buildCheckLedger, buildDocumentLedger, combineCoverage } from './coverage-ledger'
import { NullOcrPort, describePreview } from './ocr-port'

const doc = (versionId: string, fileName: string, usage: DocumentVersion['usage'], unusedReason?: string): DocumentVersion =>
  ({ versionId, fileName, usage, unusedReason, documentId: versionId, contentHash: 'h', role: 'evidence', mimeType: 'text/plain', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'parsed', blocks: [] }) as DocumentVersion

const rule = (id: string, scope: 'subject' | 'group'): RuleSpec =>
  ({ id, policyVersionId: 'p', title: id, when: { field: 'x', op: 'exists' }, requirement: '', targetScope: scope, execution: 'deterministic', onFail: 'reject', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 1, confirmation: 'confirmed' }) as RuleSpec

const result = (ruleId: string, subjectIds: string[], status: CheckResult['status']): CheckResult =>
  ({ checkId: `chk-${ruleId}-${subjectIds.join()}`, ruleId, target: { scope: subjectIds.length > 1 ? 'group' : 'subject', subjectIds }, status, reason: '', sourceRefs: [], executedBy: 'deterministic', executedAt: new Date().toISOString() }) as CheckResult

describe('材料账本（M2）', () => {
  test('Given 已读/部分读/未读混合 When 投影 Then 全部入账且带原因（不消失）', () => {
    const ledger = buildDocumentLedger([
      doc('v1', '申报.md', 'read'),
      doc('v2', '扫描件.pdf', 'partially-read', '无文本层'),
      doc('v3', '损坏.doc', 'unread', '解析失败'),
    ])
    expect(ledger).toHaveLength(3)
    expect(ledger.find((entry) => entry.documentVersionId === 'v2')?.reason).toContain('无文本层')
  })

  test('历史解析失败材料即使 usage=read 也按未读入账并说明原因', () => {
    const failed = { ...doc('v4', '损坏.pdf', 'read'), parseStatus: 'failed' as const, parseError: '文件无法解码' }
    expect(buildDocumentLedger([failed])).toEqual([{
      documentVersionId: 'v4',
      fileName: '损坏.pdf',
      status: 'unread',
      reason: '自动解析失败；空占位块不代表读过原件。解析原因：文件无法解码',
    }])
    expect(combineCoverage([failed], [], [], []).allClearVerdictAllowed).toBeFalse()
  })

  test('解析失败材料带审核员原件核对凭据时按已读入账', () => {
    const manuallyChecked = {
      ...doc('v5', '扫描件.pdf', 'read'),
      parseStatus: 'failed' as const,
      manualReadReceipt: { actorId: 'reviewer', reason: '已逐页核对原件', at: '' },
    }
    expect(buildDocumentLedger([manuallyChecked])).toEqual([{
      documentVersionId: 'v5',
      fileName: '扫描件.pdf',
      status: 'read',
      reason: '审核员已核对原件：已逐页核对原件',
    }])
  })
})

describe('检查账本（M2）', () => {
  test('Given 2 条 subject 规则×2 主体、仅 3 条结果 When 核对 Then 缺失记 not-executed', () => {
    const rules = [rule('r1', 'subject'), rule('r2', 'subject')]
    const results = [result('r1', ['s1'], 'compliant'), result('r1', ['s2'], 'non-compliant'), result('r2', ['s1'], 'compliant')]
    const ledger = buildCheckLedger(rules, ['s1', 's2'], results)
    expect(ledger).toHaveLength(4)
    expect(ledger.find((entry) => entry.ruleId === 'r2' && entry.targetKey === 's2')?.status).toBe('not-executed')
  })

  test('同一案卷内的分项规则只为所属分项建立计划检查', () => {
    const sectionRule = { ...rule('r-study', 'subject'), sectionId: 'study' }
    const ledger = buildCheckLedger([sectionRule], ['s-study', 's-service'], [result('r-study', ['s-study'], 'compliant')], undefined, {
      study: ['s-study'],
      service: ['s-service'],
    })
    expect(ledger).toEqual([{ ruleId: 'r-study', targetKey: 's-study', status: 'compliant' }])
  })
})

describe('combineCoverage（全部符合判定，A08）', () => {
  test('Given 检查发现违规 When 组合 Then 完成检查不表示全部符合', () => {
    const summary = combineCoverage([doc('v', '申报.md', 'read')], [rule('r', 'subject')], ['s'], [result('r', ['s'], 'non-compliant')])
    expect(summary.completedChecks).toBe(1)
    expect(summary.allClearVerdictAllowed).toBeFalse()
  })

  test('Given 材料仅登记或没有适用检查 When 组合 Then 不宣称全部符合', () => {
    expect(combineCoverage([doc('v', '待处理.png', 'registered')], [rule('r', 'subject')], ['s'], [result('r', ['s'], 'compliant')]).allClearVerdictAllowed).toBeFalse()
    expect(combineCoverage([], [], [], []).allClearVerdictAllowed).toBeFalse()
    expect(combineCoverage([], [rule('r', 'subject')], ['s'], [result('r', ['s'], 'not-applicable')]).allClearVerdictAllowed).toBeFalse()
  })
  test('Given 存在未读材料与未执行检查 When 组合 Then 阻止"全部符合"并列出 blockers', () => {
    const docs = [doc('v1', '申报.md', 'read'), doc('v2', '扫描件.pdf', 'unread', '无文本层')]
    const summary = combineCoverage(docs, [rule('r1', 'subject')], ['s1'], [])
    expect(summary.allClearVerdictAllowed).toBeFalse()
    expect(summary.blockers.some((line) => line.includes('未完整读取'))).toBeTrue()
    expect(summary.blockers.some((line) => line.includes('未执行'))).toBeTrue()
    expect(summary.pendingChecks).toBe(1)
  })

  test('Given 全部已读且检查全执行无待确认 When 组合 Then 允许全部符合', () => {
    const docs = [doc('v1', '申报.md', 'read')]
    const summary = combineCoverage(docs, [rule('r1', 'subject')], ['s1'], [result('r1', ['s1'], 'compliant')])
    expect(summary.allClearVerdictAllowed).toBeTrue()
    expect(summary.effectiveVerdicts).toBe(1)
    expect(summary.blockers).toEqual([])
  })

  test('系统执行失败不计为已完成检查', () => {
    const summary = combineCoverage([doc('v1', '申报.md', 'read')], [rule('r1', 'subject')], ['s1'], [result('r1', ['s1'], 'execution-failed')])
    expect(summary.completedChecks).toBe(0)
    expect(summary.effectiveVerdicts).toBe(0)
    expect(summary.pendingChecks).toBe(1)
    expect(summary.allClearVerdictAllowed).toBeFalse()
  })

  test('案卷级结果不能冒充两名主体各自的检查结果', () => {
    const broad = { ...result('r', ['s1', 's2'], 'compliant'), target: { scope: 'case' as const, subjectIds: ['s1', 's2'] } }
    const summary = combineCoverage([], [rule('r', 'subject')], ['s1', 's2'], [broad])
    expect(summary.plannedChecks).toBe(2)
    expect(summary.completedChecks).toBe(0)
    expect(summary.pendingChecks).toBe(2)
    expect(summary.blockers.join()).toContain('无法与计划唯一对应')
  })

  test('一项主体计划收到两个结果时不选最后写入的合规结果', () => {
    const one = result('r', ['s'], 'non-compliant')
    const two = { ...result('r', ['s'], 'compliant'), checkId: 'another-check' }
    const summary = combineCoverage([], [rule('r', 'subject')], ['s'], [one, two])
    expect(summary.completedChecks).toBe(0)
    expect(summary.effectiveVerdicts).toBe(0)
    expect(summary.allClearVerdictAllowed).toBeFalse()
  })

  test('不同计划项的重复 checkId 不能作为两项已覆盖结果', () => {
    const repeated = [result('r', ['s1'], 'compliant'), { ...result('r', ['s2'], 'compliant'), checkId: 'chk-r-s1' }]
    const summary = combineCoverage([], [rule('r', 'subject')], ['s1', 's2'], repeated)
    expect(summary.completedChecks).toBe(0)
    expect(summary.blockers.join()).toContain('无法与计划唯一对应')
  })

  test('同名但政策版本不同的规则不得仅按 ruleId 共用一个结论', () => {
    const rules = [rule('same', 'subject'), { ...rule('same', 'subject'), policyVersionId: 'another-policy' }]
    const summary = combineCoverage([], rules, ['s'], [result('same', ['s'], 'compliant')])
    expect(summary.plannedChecks).toBe(2)
    expect(summary.completedChecks).toBe(0)
    expect(summary.allClearVerdictAllowed).toBeFalse()
  })

  test('合法空发现但原件与规则覆盖完整可以符合；额外假结果则阻断', () => {
    const valid = result('r', ['s'], 'compliant')
    const ok = combineCoverage([doc('v', '材料.txt', 'read')], [rule('r', 'subject')], ['s'], [valid])
    expect(ok.allClearVerdictAllowed).toBeTrue()
    const forged = { ...result('foreign', ['s'], 'compliant'), checkId: 'foreign-id' }
    const suspicious = combineCoverage([doc('v', '材料.txt', 'read')], [rule('r', 'subject')], ['s'], [valid, forged])
    expect(suspicious.allClearVerdictAllowed).toBeFalse()
  })

  test('不适用必须具备理由，未知状态和空主体都不能宣称已覆盖', () => {
    const noReason = result('r', ['s'], 'not-applicable')
    const ledger = buildCheckLedger([rule('r', 'subject')], ['s'], [noReason])
    expect(ledger[0]?.status).toBe('not-executed')
    expect(combineCoverage([], [rule('r', 'subject')], [], []).allClearVerdictAllowed).toBeFalse()
  })
})

describe('OCR 端口与预览（M2）', () => {
  test('Given NullOcrPort When 识别 Then 如实拒绝并说明原因（不冒充已读）', async () => {
    const port = new NullOcrPort()
    expect(port.available).toBeFalse()
    await expect(port.recognize({ documentVersionId: 'v', pageAssetPath: '/tmp/x.png', language: 'chi_sim' })).rejects.toThrow('OCR 不可用')
  })

  test('Given 图片/非图片 When 描述预览 Then 图片直显、其余 needs-renderer（诚实标注）', () => {
    expect(describePreview('v1', 'a.png', 'image/png', 1).preview).toBe('image')
    expect(describePreview('v2', 'b.pdf', 'application/pdf', 1).preview).toBe('needs-renderer')
  })
})

describe('组规则展开（G12/误判 5）', () => {
  const groupRule = { id: 'r-group', targetScope: 'group', severity: 'high', statement: '每条活动记录需完整', checks: [] } as unknown as Parameters<typeof buildCheckLedger>[0][number]
  const hit = (groupValue: string) => ({ checkId: 'c-' + groupValue, ruleId: 'r-group', status: 'compliant', target: { scope: 'group', subjectIds: [groupValue] }, at: '', engine: 'mock' }) as unknown as CheckResult

  test('Given 组规则与三个组值 When 只回填两个组结果 Then 第三组 not-executed（逐组展开不折叠）', () => {
    const ledger = buildCheckLedger([groupRule], ['s1'], [hit('g1'), hit('g2')], { 'r-group': ['g1', 'g2', 'g3'] })
    expect(ledger).toHaveLength(3)
    expect(ledger.find((entry) => entry.targetKey === 'g3')?.status).toBe('not-executed')
    expect(ledger.find((entry) => entry.targetKey === 'g1')?.status).toBe('compliant')
  })

  test('无 groupBy 的组规则使用整个作用域作为聚合键', () => {
    const ledger = buildCheckLedger([groupRule], ['s1'], [hit('g1')])
    expect(ledger).toHaveLength(1)
    expect(ledger[0]!.status).toBe('not-executed')
  })

  test('真实组级聚合结果以适用主体列表匹配覆盖计划', () => {
    const planned = rule('r-group-real', 'group')
    const aggregateResult = result('r-group-real', ['s1', 's2'], 'compliant')
    const ledger = buildCheckLedger([planned], ['s1', 's2'], [aggregateResult])
    expect(ledger).toEqual([{ ruleId: 'r-group-real', targetKey: 'group', status: 'compliant' }])
  })

  test('Given combineCoverage 带组值 When 存在未执行组 Then allClear 被阻断', () => {
    const summary = combineCoverage([], [groupRule], ['s1'], [hit('g1')], { 'r-group': ['g1', 'g2'] })
    expect(summary.allClearVerdictAllowed).toBeFalse()
    expect(summary.blockers.join()).toContain('未执行')
  })
})
