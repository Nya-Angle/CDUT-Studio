/**
 * 完整综测模板与虚构样例（N1b，05 §5.1 第 2 条：首条纵向流程）
 *
 * 虚构政策「示例大学学生综合测评办法（演示）」：四条规则语义完整——
 * P1 证书等级分值映射（国家级一等 8 / 二等 6 / 三等 4；校级一等 5 / 二等 3 / 三等 2）
 * P2 同一活动（eventId）多证只计最高等级（键内择高）
 * P3 竞赛类组上限 10 分，超出的按分数降序舍弃（截断记 0 入账）
 * P4 必需材料：申报表 + 至少一份含（姓名/等级/日期/颁发单位）的证明
 * 本政策明确标注虚构演示；真实使用要求负责人确认为本校现行规定。
 */

import type { PolicyRecord, TemplateVersion } from '@profer/shared'
import { canonicalContentHash, getPolicy, publishPolicy, savePolicyDraft } from '../policy-store'

export const FIXTURE_POLICY_ID = 'policy-comprehensive-assessment-demo'

/** 虚构政策全文（结构化规则语义以文本+RuleSpec 双表达；规则确认在 RuleSpec.confirmation 上） */
export const FIXTURE_POLICY_CONTENT = `【虚构演示】示例大学学生综合测评办法（演示版 v1）

P1 证书等级分值映射：竞赛类证书按"级别-等级"计分：国家级一等 8 分、二等 6 分、三等 4 分；校级一等 5 分、二等 3 分、三等 2 分。不在映射内的等级不计分并生成待确认。
P2 同一活动择高：同一活动编号（eventId）的多份证书只计最高等级对应分值，其余证书标注"同活动择高舍弃"。
P3 竞赛类组上限：竞赛类事项合计上限 10 分；超出上限的部分按分数降序舍弃，被舍弃部分记 0 分入账。
P4 必需材料：申报表 1 份；证明材料至少 1 份且需含姓名、等级、日期、颁发单位四要素；缺要素进入待补件。

本文件为演示用虚构政策，不作为任何真实学校的规定。`

/** 生成完整综测模板 + 虚构政策（幂等：已存在同版本不覆盖） */
export function buildComprehensiveFixture(): { policy: PolicyRecord; template: TemplateVersion } {
  const contentHash = canonicalContentHash(FIXTURE_POLICY_CONTENT)
  const policy: PolicyRecord = {
    policyId: FIXTURE_POLICY_ID,
    version: 1,
    title: '示例大学学生综合测评办法（虚构演示）',
    contentHash,
    content: FIXTURE_POLICY_CONTENT,
    origin: { kind: 'owner-statement', text: '演示负责人录入（虚构样例）', enteredBy: 'fixture', enteredAt: '2026-10-04T00:00:00.000Z' },
    status: 'draft',
    confirmations: [{ actorId: 'fixture-owner', role: 'template-owner', at: '2026-10-04T00:00:00.000Z', note: '虚构样例确认（演示数据）' }],
    // Keep the structured policy ledger consistent with the four clauses above.
    // These are deliberately semantic: no score is calculated from unconfirmed facts.
    compiledRules: [
      {
        id: 'P1', policyVersionId: `${FIXTURE_POLICY_ID}@1`, title: '证书等级分值映射',
        when: { all: [] }, requirement: '按政策原文核对证书级别与等级对应分值；不在已声明映射中的等级进入待确认，不得猜测。',
        targetScope: 'subject', execution: 'semantic', semanticOutputEnum: ['compliant', 'non-compliant'],
        onFail: 'manual-review', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 1, confirmation: 'confirmed',
      },
      {
        id: 'P2', policyVersionId: `${FIXTURE_POLICY_ID}@1`, title: '同一活动择高',
        when: { all: [] }, requirement: '按 eventId 识别同一活动的多份证书，只计最高等级；其余记录择高舍弃。',
        targetScope: 'group', groupBy: ['eventId'], execution: 'semantic', semanticOutputEnum: ['compliant', 'non-compliant'],
        onFail: 'manual-review', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 2, confirmation: 'confirmed',
      },
      {
        id: 'P3', policyVersionId: `${FIXTURE_POLICY_ID}@1`, title: '竞赛类组上限',
        when: { all: [] }, requirement: '核对竞赛类事项合计上限 10 分，并逐项解释超出部分的处理；缺少确认输入时进入待确认。',
        targetScope: 'group', groupBy: ['category'], execution: 'semantic', semanticOutputEnum: ['compliant', 'non-compliant'],
        onFail: 'manual-review', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 3, confirmation: 'confirmed',
      },
      {
        id: 'P4', policyVersionId: `${FIXTURE_POLICY_ID}@1`, title: '必需材料与四要素',
        when: { all: [] }, requirement: '核对申报表及证明材料，并逐项检查姓名、等级、日期、颁发单位；缺少材料或要素时进入待补件。',
        targetScope: 'case', execution: 'semantic', semanticOutputEnum: ['compliant', 'non-compliant'],
        onFail: 'supplement', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 4, confirmation: 'confirmed',
      },
    ],
  }

  const template: TemplateVersion = {
    templateId: 'comprehensive-assessment-v2',
    version: 2,
    schemaVersion: 2,
    name: '学生综合测评（完整版）',
    objectType: 'person',
    displayName: { template: '{{studentName}} · {{academicYear}}' },
    fields: [
      { key: 'studentName', label: '学生姓名', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'studentId', label: '学号', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'academicYear', label: '学年', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'applicant', label: '申请人', kind: 'text', required: true, visibility: 'public', scope: 'case' },
      { key: 'category', label: '指标类别', kind: 'enum', required: true, visibility: 'public', options: [{ value: 'competition', label: '竞赛' }, { value: 'activity', label: '活动' }, { value: 'honor', label: '荣誉' }] },
      { key: 'level', label: '申报等级', kind: 'enum', required: true, visibility: 'public', options: [{ value: 'national-1', label: '国家级一等' }, { value: 'national-2', label: '国家级二等' }, { value: 'school-1', label: '校级一等' }, { value: 'school-2', label: '校级二等' }] },
      { key: 'declaredScore', label: '申报分数', kind: 'number', required: true, visibility: 'public' },
      { key: 'activityDate', label: '活动日期', kind: 'date', required: true, visibility: 'public' },
      { key: 'eventId', label: '活动编号', kind: 'text', required: true, visibility: 'public' },
      { key: 'confirmedLevelScore', label: '确认分值', kind: 'number', required: false, visibility: 'internal' },
    ],
    materialSlots: [
      { id: 'application-form', name: '综合测评申报表', purpose: '申报事项与等级', acceptedKinds: ['pdf', 'office', 'text'], acceptedRoles: ['application'], minCount: 1, maxCount: 1, requiredElements: ['姓名', '学号', '事项', '等级', '日期'], allowReuseAcrossSubjects: false },
      { id: 'certificates', name: '证明材料', purpose: '等级/日期/颁发单位核验（P4 四要素）', acceptedKinds: ['pdf', 'image', 'office', 'text'], acceptedRoles: ['evidence'], minCount: 1, maxCount: 20, requiredElements: ['姓名', '等级', '日期', '颁发单位'], allowReuseAcrossSubjects: false },
    ],
    policyVersionIds: [FIXTURE_POLICY_ID],
    policyRefs: [{ policyId: FIXTURE_POLICY_ID, version: 1, contentHash }],
    rubric: undefined,
    stages: [
      { id: 'auto-check', name: '自动核对', kind: 'auto-check', executorRole: 'system', nextStageId: 'first-review' },
      { id: 'first-review', name: '初审', kind: 'manual-review', executorRole: 'reviewer', nextStageId: 'final-review', returnToStageId: 'auto-check' },
      { id: 'final-review', name: '终审', kind: 'manual-review', executorRole: 'teacher', returnToStageId: 'first-review' },
    ],
    outputs: [
      { id: 'item-feedback', kind: 'item-feedback', audience: 'student' },
      { id: 'score-sheet', kind: 'score-sheet', audience: 'teacher' },
      { id: 'internal-report', kind: 'roster', audience: 'organizer' },
    ],
    autoPassPolicy: { enabled: false },
    domainPackId: 'comprehensive-assessment',
    status: 'draft',
    createdAt: '2026-10-04T00:00:00.000Z',
  }
  return { policy, template }
}

/** 幂等落盘：政策草稿 + 综测 v2 模板草稿（已存在则不动用户改动） */
export function seedComprehensiveFixture(store: {
  getTemplate(id: string, version?: number): TemplateVersion | undefined
  saveDraft(template: TemplateVersion): TemplateVersion
}): void {
  const { policy, template } = buildComprehensiveFixture()
  if (!getPolicy(policy.policyId, policy.version)) savePolicyDraft(policy)
  if (!store.getTemplate(template.templateId, template.version)) store.saveDraft(template)
}

/** 演示一键发布（供测试与"体验示例"入口）：发布政策 + 发布模板 v2 */
export function publishComprehensiveFixture(store: {
  getTemplate(id: string, version?: number): TemplateVersion | undefined
  saveDraft(template: TemplateVersion): TemplateVersion
  publish(templateId: string, version: number): TemplateVersion
}): void {
  seedComprehensiveFixture(store)
  publishPolicy(FIXTURE_POLICY_ID, 1)
  store.publish('comprehensive-assessment-v2', 2)
}
