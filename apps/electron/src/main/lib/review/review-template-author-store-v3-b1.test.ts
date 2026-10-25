import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  saveB1AuthorRevision, readB1AuthorRevision, freezeB1Candidate, readB1FrozenCandidate,
} from './review-template-author-store-v3-b1'
import type { B1AuthorDocument } from './review-template-plan-adapter-v3-b1'

const oldConfig = process.env.PROFER_CONFIG_DIR
const home = mkdtempSync(join(tmpdir(), 'review-v3-b1-author-'))
process.env.PROFER_CONFIG_DIR = home
afterAll(() => {
  if (oldConfig === undefined) delete process.env.PROFER_CONFIG_DIR
  else process.env.PROFER_CONFIG_DIR = oldConfig
  rmSync(home, { force: true, recursive: true })
})
const synthetic = (templateId: string): B1AuthorDocument => ({
  schemaVersion: 'review-b1/1', templateId, templateVersion: '1',
  status: 'candidate-held', name: 'A new unknown workflow', purpose: 'Synthetic request only',
  fields: [{ key: 'reason', label: 'Reason', type: 'text', required: true, sourceId: 'user' }],
  sources: [{ sourceId: 'user', kind: 'user-declared', documentVersionId: 'usr-v1',
    locator: 'author-wizard:reason', recordedBy: 'local-author' }],
  targets: [{ targetKey: 'target', objectKey: 'organization', subjectId: 'subject',
    scenario: 'generic-object', fieldValues: { reason: 'test' } }],
  modules: [{ moduleId: 'author-defined', version: '1', dependsOn: [], checks: [{
    checkKey: 'reason-check', requirement: 'Reason must be provided',
    sourceIds: ['user'], targetKeys: ['target'],
    responsibility: 'request owner', condition: { kind: 'always' },
  }] }],
  stages: [{ stageId: 'review', role: 'reviewer', mode: 'manual' }],
  outputs: [{ outputId: 'report', kind: 'summary' }],
})

describe('B1 Author revisions and immutable candidate vault', () => {
  test('incomplete draft survives append-only save; cannot freeze before all checks mapped', () => {
    const doc = synthetic('user-custom-51')
    doc.modules = []
    const saved = saveB1AuthorRevision(doc, 0, 'local-author')
    expect(saved.revision).toBe(1)
    expect(readB1AuthorRevision(doc.templateId)?.document.modules).toEqual([])
    expect(() => freezeB1Candidate(doc.templateId, 1)).toThrow('B1_AUTHOR_INVALID')
    const full = synthetic(doc.templateId)
    const second = saveB1AuthorRevision(full, 1, 'local-author')
    expect(second.revision).toBe(2)
    expect(second.parentDigest).toBe(saved.digest)
    expect(() => saveB1AuthorRevision(full, 1, 'local-author')).toThrow('B1_AUTHOR_REVISION_CONFLICT')
    const frozen = freezeB1Candidate(full.templateId, 2)
    expect(frozen.descriptor.canonicalPlan.bindings).toHaveLength(1)
    expect(frozen.status).toBe('candidate-held')
    const replay = freezeB1Candidate(full.templateId, 2)
    expect(replay).toEqual(frozen)
    expect(readB1FrozenCandidate(full.templateId, frozen.descriptor.canonicalPlan.fingerprint)).toEqual(frozen)
    expect(() => freezeB1Candidate(full.templateId, 1)).toThrow('B1_AUTHOR_REVISION_STALE')
    expect(readB1AuthorRevision(full.templateId, 1)?.document.modules).toHaveLength(0)
  })
  test('original revision tampering is detected; author-only docs do not overwrite prior Plan', () => {
    const original = synthetic('author-tamper')
    saveB1AuthorRevision(original, 0, 'local-author')
    const file = join(home,'review-v3-author-candidate','author-tamper','revisions','1.json')
    const altered = JSON.parse(readFileSync(file,'utf8'))
    altered.document.modules[0].checks[0].requirement = 'silent removal of obligation'
    writeFileSync(file, JSON.stringify(altered))
    expect(() => readB1AuthorRevision('author-tamper')).toThrow('B1_HISTORY_BROKEN')
    expect(() => saveB1AuthorRevision(original, 1, 'local-author')).toThrow('B1_HISTORY_BROKEN')
  })
  test('freeze and draft save serialize through one author lock; busy writer cannot freeze stale candidate', () => {
    const doc = synthetic('author-freeze-cas')
    saveB1AuthorRevision(doc, 0, 'trusted-author')
    const lock = join(home, 'review-v3-author-candidate', doc.templateId, 'author.lock')
    writeFileSync(lock, 'another writer owns author revision CAS', { flag: 'wx' })
    try {
      expect(() => freezeB1Candidate(doc.templateId, 1)).toThrow()
      expect(() => saveB1AuthorRevision(doc, 1, 'trusted-author')).toThrow()
    } finally {
      rmSync(lock, { force: true })
    }
    const version2 = saveB1AuthorRevision(doc, 1, 'trusted-author')
    expect(version2.revision).toBe(2)
    expect(() => freezeB1Candidate(doc.templateId, 1)).toThrow('B1_AUTHOR_REVISION_STALE')
    const frozen = freezeB1Candidate(doc.templateId, 2)
    expect(frozen.revision).toBe(2)
    expect(frozen.status).toBe('candidate-held')
  })

  test('candidate status cannot be elevated through author API', () => {
    const doc = synthetic('author-published-spoof')
    ;(doc as {status: string}).status = 'published'
    expect(() => saveB1AuthorRevision(doc,0,'unverified-author')).toThrow('B1_DRAFT_STRUCTURE_INVALID')
  })
})
