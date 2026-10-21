import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { nativeManualSourcesFromAggregate } from './NativeManualItemDialog'

const base = (): CaseAggregateV2 => ({
  caseV2: {
    id: 'case-native-ui',
    title: 'Physical case',
    stage: 'draft',
    documents: [{
      documentId: 'doc-1', versionId: 'version-current-1', role: 'application', active: true,
      fileName: 'application.txt', parseRevision: 1, parseStatus: 'parsed',
      blocks: [{ blockId: 'parser-block-1', text: 'Original paragraph', kind: 'text',
        location: { kind: 'paragraph', index: 0 } }],
    }, {
      documentId: 'doc-old', versionId: 'version-retired', role: 'application', active: false,
      fileName: 'old.txt', parseRevision: 1, parseStatus: 'parsed', blocks: [],
    }, {
      documentId: 'doc-evidence', versionId: 'version-evidence', role: 'evidence', active: true,
      fileName: 'evidence.txt', parseRevision: 1, parseStatus: 'parsed', blocks: [],
    }],
  },
  receiptLog: [{ type: 'CreateNativeWorkspaceCaseV3', revision: 0 }],
} as unknown as CaseAggregateV2)

describe('C1-R09 native human Item visible-source selector', () => {
  test('exposes only current application-role physical versions, keeping parser block identities', () => {
    const result = nativeManualSourcesFromAggregate(base(), 'case-native-ui')
    expect(result.reason).toBeNull()
    expect(result.sources).toHaveLength(1)
    expect(result.sources[0]).toMatchObject({
      documentId: 'doc-1', versionId: 'version-current-1', fileName: 'application.txt',
      blocks: [{ blockId: 'parser-block-1', text: 'Original paragraph' }],
    })
  })

  test('does not expose migrated legacy, cross-case, archived, or frozen Plan records', () => {
    const legacy = base()
    legacy.receiptLog[0]!.type = 'EnsureReviewWorkspaceAggregate'
    expect(nativeManualSourcesFromAggregate(legacy, 'case-native-ui').sources).toEqual([])
    expect(nativeManualSourcesFromAggregate(base(), 'another-case').sources).toEqual([])
    const archived = base()
    archived.caseV2.stage = 'archived'
    expect(nativeManualSourcesFromAggregate(archived, 'case-native-ui').sources).toEqual([])
    const frozen = base()
    frozen.canonicalPlan = { planId: 'immutable-plan' } as never
    expect(nativeManualSourcesFromAggregate(frozen, 'case-native-ui').sources).toEqual([])
    const noSource = base()
    noSource.caseV2.documents = noSource.caseV2.documents.filter(d => d.role === 'evidence')
    expect(nativeManualSourcesFromAggregate(noSource, 'case-native-ui').reason)
      .toContain('系统文件选择器')
  })

  test('corrupt native document list never becomes a valid material selection', () => {
    const corrupt = base()
    corrupt.caseV2.documents = null as never
    expect(nativeManualSourcesFromAggregate(corrupt, 'case-native-ui').sources).toEqual([])
    expect(nativeManualSourcesFromAggregate(corrupt, 'case-native-ui').reason).toContain('不可读')
  })
})
