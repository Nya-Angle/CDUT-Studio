import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'bun:test'
import type { CaseAggregateV2 } from '@profer/shared'
import { resolveCaseDocumentPreviewPath } from './document-preview-path'

const roots: string[] = []
function makeRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'review-preview-'))
  roots.push(root)
  return root
}
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }) })

function aggregate(assetPath: string): CaseAggregateV2 {
  return {
    caseV2: {
      id: 'case-preview', templateId: 'template', templateVersion: 1, title: '预览测试', objectType: 'document',
      caseFields: {}, subjects: [], stage: 'draft', revision: 0, createdAt: '', updatedAt: '',
      documents: [{ documentId: 'doc-1', versionId: 'doc-1-v1', contentHash: 'hash', role: 'evidence', fileName: '原件.pdf', mimeType: 'application/pdf', sizeBytes: 1, assetPath, parseRevision: 1, parseStatus: 'parsed', blocks: [], usage: 'registered' }],
    },
    observations: [], evidenceLinks: [], dispositions: [], tasks: [], decisions: [], supplements: [], appeals: [], receiptLog: [],
  }
}

describe('审核原件预览路径', () => {
  test('返回案卷目录中的登记原件', () => {
    const root = makeRoot()
    mkdirSync(join(root, 'source-docs'), { recursive: true })
    const source = join(root, 'source-docs', 'original.pdf')
    writeFileSync(source, 'pdf')
    expect(resolveCaseDocumentPreviewPath(root, aggregate('source-docs/original.pdf'), 'doc-1-v1')).toBe(source)
  })

  test('拒绝未登记材料、越界路径和指向案卷外的符号链接', () => {
    const root = makeRoot()
    const outside = join(root, '..', 'outside-review-preview.txt')
    writeFileSync(outside, 'secret')
    mkdirSync(join(root, 'source-docs'), { recursive: true })
    symlinkSync(outside, join(root, 'source-docs', 'linked.txt'))
    expect(resolveCaseDocumentPreviewPath(root, aggregate('../outside-review-preview.txt'), 'doc-1-v1')).toBeNull()
    expect(resolveCaseDocumentPreviewPath(root, aggregate('source-docs/linked.txt'), 'doc-1-v1')).toBeNull()
    expect(resolveCaseDocumentPreviewPath(root, aggregate('source-docs/original.pdf'), 'missing-v1')).toBeNull()
    rmSync(outside, { force: true })
  })
})
