import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { currentMaterialRecognizedFacts } from './review-material-facts'

const aggregate = (): CaseAggregateV2 => ({
  caseV2: {
    id: 'case-1', templateId: 'template-1', templateVersion: 1,
    documents: [
      { versionId: 'doc-current', documentId: 'doc', contentHash: 'x', role: 'evidence',
        fileName: '证明.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '',
        parseRevision: 2, parseStatus: 'parsed', blocks: [], usage: 'read', active: true },
      { versionId: 'doc-old', documentId: 'old', contentHash: 'y', role: 'evidence',
        fileName: '旧证明.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '',
        parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'read', active: false },
    ],
  },
  observations: [], sourceValidityRevocations: [],
} as unknown as CaseAggregateV2)

const source = (version = 'doc-current', revision = 2) => ({
  caseId: 'case-1', documentVersionId: version, parseRevision: revision,
  location: { kind: 'file' },
})

describe('证明材料识别事实投影', () => {
  test('本轮 AI 事实可按真实原件显示待核实，不伪造成旧证明卡已识别状态', () => {
    const facts = currentMaterialRecognizedFacts(aggregate(), 'doc-current', [{
      subjectId: 'subject-1', fieldKey: 'level', value: { kind: 'text', value: '一等奖' },
      confirmed: false, extractedBy: 'ai', sourceRefs: [source()],
    }], false)
    expect(facts).toEqual([{ subjectId: 'subject-1', fieldKey: 'level', value: '一等奖', confirmed: false }])
  })

  test('过期 Run、旧解析版本、已退役原件和跨案引用均不可显示为当前事实', () => {
    const ai = [{ subjectId: 's', fieldKey: 'level', value: '一等奖', sourceRefs: [source()] }]
    expect(currentMaterialRecognizedFacts(aggregate(), 'doc-current', ai, true)).toEqual([])
    expect(currentMaterialRecognizedFacts(aggregate(), 'doc-current', [{ ...ai[0], sourceRefs: [source('doc-current', 1)] }], false)).toEqual([])
    expect(currentMaterialRecognizedFacts(aggregate(), 'doc-old', [{ ...ai[0], sourceRefs: [source('doc-old', 1)] }], false)).toEqual([])
    expect(currentMaterialRecognizedFacts(aggregate(), 'doc-current', [{ ...ai[0], sourceRefs: [{ ...source(), caseId: 'other-case' }] }], false)).toEqual([])
  })

  test('已撤销事实不能恢复为已确认；当前有效人工事实可以显示', () => {
    const state = aggregate()
    state.observations = [
      { id: 'revoked', subjectId: 's', fieldKey: 'level', value: { kind: 'text', value: '旧事实' },
        confirmed: false, extractedBy: 'ai', sourceRefs: [source()], createdAt: '' },
      { id: 'current', subjectId: 's', fieldKey: 'level', value: { kind: 'text', value: '有效事实' },
        confirmed: true, extractedBy: 'user', sourceRefs: [source()], createdAt: '' },
    ] as CaseAggregateV2['observations']
    state.sourceValidityRevocations = [{ documentVersionId: 'doc-current', reason: 'reclassify',
      at: '', observationIds: ['revoked'], previouslyConfirmedObservationIds: [],
      evidenceLinkIds: [], previouslyConfirmedEvidenceLinkIds: [] }]
    expect(currentMaterialRecognizedFacts(state, 'doc-current', [], false)).toEqual([
      { subjectId: 's', fieldKey: 'level', value: '有效事实', confirmed: true },
    ])
  })
})
