import { expect, test } from 'bun:test'
import type { CaseAggregateV2, ReviewRunV2 } from '@profer/shared'
import { buildF17AssistantContext, extractF17Citations, resolveF17Citation } from './review-v3-f17-grounding'

const docs = [
  { versionId: 'app-v1', role: 'application', fileName: '申请表.docx', text: '项目人数十八人，负责人张某' },
  { versionId: 'proof-v1', role: 'evidence', fileName: '证明.pdf', text: '证明材料记载项目人数为十八人' },
  { versionId: 'rule-v1', role: 'rule', fileName: '活动规则.pdf', text: '场地人数不得超过二十人' },
  { versionId: 'foreign', role: 'evidence', fileName: '未纳入本次Run.pdf', text: '不可发送的其他资料' },
] as const

const aggregate = {
  caseV2: {
    id: 'case-f17', documents: docs.map((doc) => ({
      ...doc, parseRevision: 2, documentId: doc.versionId,
      blocks: [{ blockId: 'block-1', text: doc.text, kind: 'text', location: { kind: 'paragraph', index: 0 } }],
    })),
  },
} as unknown as CaseAggregateV2
const run = {
  id: 'run-f17', caseId: 'case-f17', inputManifest: {
    hash: 'f17-manifest', documentVersions: docs.slice(0, 3).map(item => ({ versionId: item.versionId })),
  },
  checks: [], opinions: [], status: 'completed', coverage: { plannedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
} as unknown as ReviewRunV2

test('F17 sends source fragments from three roles of the exact Run, never unrelated material', () => {
  const context = buildF17AssistantContext(aggregate, run, '项目人数和证明是否符合规则？')
  expect(context).toContain('申请表.docx')
  expect(context).toContain('证明材料记载')
  expect(context).toContain('场地人数不得')
  expect(context).not.toContain('不可发送的其他资料')
  const tokens = extractF17Citations(context)
  expect(tokens).toHaveLength(3)
  expect(tokens.every(token => resolveF17Citation(token, aggregate, run))).toBe(true)
})

test('F17 citation rejects fabricated, foreign and obsolete Run/version/block identifiers', () => {
  const context = buildF17AssistantContext(aggregate, run, '人数')
  const token = extractF17Citations(context)[0]!
  expect(resolveF17Citation(token, aggregate, run)).not.toBeNull()
  expect(resolveF17Citation(token.replace('run-f17', 'run-other'), aggregate, run)).toBeNull()
  expect(resolveF17Citation(token.replace('block-1', 'nonexistent'), aggregate, run)).toBeNull()
  expect(resolveF17Citation(token.replace('|2|', '|3|'), aggregate, run)).toBeNull()
  expect(resolveF17Citation(token, { ...aggregate, caseV2: { ...aggregate.caseV2, id: 'other-case' } }, run)).toBeNull()
  expect(resolveF17Citation(token, aggregate, { ...run, id: 'new-run' })).toBeNull()
  expect(resolveF17Citation('[F17:run-f17|foreign|2|block-1]', aggregate, run)).toBeNull()
})

test('F17 explicitly discloses missing original text and refuses mismatched case', () => {
  const empty = { ...aggregate, caseV2: { ...aggregate.caseV2, documents: [] } }
  expect(buildF17AssistantContext(empty, run, '请问证明？')).toContain('没有可读取的原文文本块')
  expect(() => buildF17AssistantContext(aggregate, { ...run, caseId: 'other-case' }, '请问证明？'))
    .toThrow('其他案卷')
})
