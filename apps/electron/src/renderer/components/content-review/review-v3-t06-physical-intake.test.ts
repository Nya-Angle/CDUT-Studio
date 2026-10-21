import { expect, test } from 'bun:test'
import { executeT06PhysicalImport, planT06PhysicalImport, previewT06PhysicalImport,
  type T06PhysicalSelection, type T06PhysicalWriterPorts } from './review-v3-t06-physical-intake'

const selected: T06PhysicalSelection = {
  selectionId: 'main-issued-zip-1', previewFingerprint: 'frozen-inventory-1', sourceKind: 'zip',
  entries: [
    { entryId: 'file-a', relativePath: '申报甲/计划书.pdf', byteLength: 12 },
    { entryId: 'file-b', relativePath: '申报甲/照片.png', byteLength: 9 },
    { entryId: 'file-c', relativePath: '申报乙/材料.docx', byteLength: 15 },
  ],
}
test('T06 physical preview separates real archive files by one folder per case', () => {
  const result = previewT06PhysicalImport(selected)
  expect(result.errors).toEqual([])
  expect(result.groups).toHaveLength(2)
  expect(result.groups.map(x => x.entries.length)).toEqual([2, 1])
  expect(result.unassignedCount).toBe(0)
})

test('T06 wrapper-folder removal must be explicit and root files are not silently attributed', () => {
  const wrapped = { ...selected, sourceKind: 'folder' as const, entries: selected.entries.map(e => ({ ...e, relativePath: '本次申请/' + e.relativePath })) }
  expect(previewT06PhysicalImport(wrapped).groups).toHaveLength(1)
  expect(previewT06PhysicalImport(wrapped, { stripCommonRoot: true }).groups).toHaveLength(2)
  const flat = { ...selected, entries: [{ entryId: 'x', relativePath: '未命名.pdf', byteLength: 5 }] }
  expect(previewT06PhysicalImport(flat).unassignedCount).toBe(1)
  expect(previewT06PhysicalImport(flat, { rootFileGroups: { x: '组织丙' } }).groups[0]?.name).toBe('组织丙')
})

test('T06 rejects duplicate path tokens and file traversal before any commit', () => {
  const bad = { ...selected, entries: [
    selected.entries[0]!, { entryId: 'duplicate', relativePath: '申报甲/计划书.PDF', byteLength: 3 },
    { entryId: 'walk', relativePath: '../else.pdf', byteLength: 10 },
  ] }
  const preview = previewT06PhysicalImport(bad)
  expect(preview.errors).toHaveLength(2)
  expect(planT06PhysicalImport(preview, {}, {
    requestId: 'r', templateId: 't', templateVersion: 1, batchName: 'batch', knownCaseIds: [],
  }).request).toBeUndefined()
})

test('T06 requires applicant for new case and exact template-compatible case for binding', () => {
  const preview = previewT06PhysicalImport(selected)
  const base = { requestId: 'r', templateId: 't', templateVersion: 1, batchName: 'batch', knownCaseIds: ['already'] }
  const missing = planT06PhysicalImport(preview, {
    'group:申报甲': { action: 'create', title: '申请甲', applicant: '' },
    'group:申报乙': { action: 'existing', caseId: 'not-a-case' },
  }, base)
  expect(missing.request).toBeUndefined()
  const accepted = planT06PhysicalImport(preview, {
    'group:申报甲': { action: 'create', title: '申请甲', applicant: '组织甲' },
    'group:申报乙': { action: 'existing', caseId: 'already' },
  }, base)
  expect(accepted.errors).toEqual([])
  expect(accepted.request?.groups.map(x => x.action)).toEqual(['create', 'existing'])
  expect(accepted.request?.groups[0]?.entryIds).toEqual(['file-a', 'file-b'])
})

test('T06 100 cases / 500 files produce 100 independent groups', () => {
  const entries = Array.from({ length: 500 }, (_, i) => ({
    entryId: 'id-' + i, relativePath: '项目' + Math.floor(i / 5) + '/材料' + i + '.pdf', byteLength: 25,
  }))
  const result = previewT06PhysicalImport({ ...selected, entries })
  expect(result.errors).toEqual([])
  expect(result.groups).toHaveLength(100)
  expect(result.groups.every(x => x.entries.length === 5)).toBe(true)
})

test('T06 executor only batches fully imported cases, keeping partial cases recoverable', async () => {
  const preview = previewT06PhysicalImport(selected)
  const request = planT06PhysicalImport(preview, {
    'group:申报甲': { action: 'create', title: '甲', applicant: '甲组织' },
    'group:申报乙': { action: 'create', title: '乙', applicant: '乙组织' },
  }, { requestId: 'req-1', templateId: 't', templateVersion: 1, batchName: 'group', knownCaseIds: [] }).request!
  const applied: string[] = []
  const ports: T06PhysicalWriterPorts = {
    async createCase(x) { applied.push('create:' + x.title); return 'case-' + x.title },
    async importEntry(x) {
      if (x.entryId === 'file-c') throw new Error('原件登记失败')
      applied.push('material:' + x.entryId)
      return { entryId: x.entryId, documentVersionId: 'docv-' + x.entryId }
    },
    async createBatch(x) {
      applied.push('batch:' + x.caseIds.join(','))
      return 'batch-1'
    },
  }
  const result = await executeT06PhysicalImport(request, ports)
  expect(result.cases.map(x => x.status)).toEqual(['done', 'failed'])
  expect(result.cases[1]?.caseId).toBe('case-乙')
  expect(result.batchId).toBe('batch-1')
  expect(applied[applied.length - 1]).toBe('batch:case-甲')
})

test('T06 does not report a successful batch when no file was imported', async () => {
  const preview = previewT06PhysicalImport(selected)
  const request = planT06PhysicalImport(preview, {
    'group:申报甲': { action: 'create', title: '甲', applicant: '组织' },
    'group:申报乙': { action: 'exclude' },
  }, { requestId: 'req-2', templateId: 't', templateVersion: 1, batchName: '批次', knownCaseIds: [] }).request!
  const result = await executeT06PhysicalImport(request, {
    async createCase() { return 'new-case' },
    async importEntry() { throw new Error('bytes inaccessible') },
    async createBatch() { throw new Error('must never create batch') },
  })
  expect(result.batchId).toBeUndefined()
  expect(result.cases[0]?.documents).toEqual([])
  expect(result.cases[0]?.status).toBe('failed')
})

test('T06 CSV roster only suggests unique external IDs, never infers from applicant names', async () => {
  const { suggestT06PhysicalManifest } = await import('./review-v3-t06-physical-manifest')
  const preview = previewT06PhysicalImport(selected)
  const matches = suggestT06PhysicalManifest(preview, [
    { line: 2, externalId: '申报甲', caseId: '', applicant: '甲组织', title: '计划甲', files: '' },
    { line: 3, externalId: '申报乙', caseId: '', applicant: '乙组织', title: '计划乙', files: '' },
  ], [])
  expect(matches.ambiguous).toEqual([])
  expect(matches.unmatched).toEqual([])
  expect(matches.suggestions['group:申报甲']).toEqual({ action: 'create', title: '计划甲', applicant: '甲组织' })
  const ambiguous = suggestT06PhysicalManifest(preview, [
    { line: 2, externalId: '申报甲', caseId: '', applicant: '甲组织', title: '甲', files: '' },
    { line: 3, externalId: '申报甲', caseId: '', applicant: '另一个申请', title: '同编号', files: '' },
  ], [])
  expect(ambiguous.ambiguous).toContain('申报甲')
  expect(ambiguous.suggestions['group:申报甲']).toBeUndefined()
})
