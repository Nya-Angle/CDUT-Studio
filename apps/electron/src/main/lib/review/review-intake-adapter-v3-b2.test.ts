import { describe, expect, test } from 'bun:test'
import { ReviewB2StagingService, type B2MainContext } from './review-intake-adapter-v3-b2'

const a: B2MainContext = { senderId: 10, frameId: 2, ownerId: 'owner-a',
  ownerGeneration: 1, caseCandidateId: 'case-a' }
const input = (overrides: Partial<{
  requestId: string; fileName: string; physicalSourceKey: string; bytes: Uint8Array;
  role: 'application' | 'supporting' | 'unassigned'; subjectId: string | null;
}> = {}) => ({
  requestId: 'req-1', fileName: 'proof.pdf', physicalSourceKey: 'picker-file-id-1',
  bytes: Buffer.from('synthetic-source-v1'),
  role: 'supporting' as const, subjectId: 'subject-1', ...overrides,
})
describe('B2 scoped staging (Main-issued token integration still pending)', () => {
  test('B-IN-02: consumes token once; sender, frame, owner, case, timeout fail closed', () => {
    let tick = 1000
    const store = new ReviewB2StagingService(() => tick)
    const one = store.grant(a, 100)
    expect(() => store.stage({ ...a, senderId: 11 }, one.token, input())).toThrow('B2_TOKEN_SCOPE_MISMATCH')
    expect(() => store.stage({ ...a, frameId: 4 }, one.token, input())).toThrow('B2_TOKEN_SCOPE_MISMATCH')
    expect(() => store.stage({ ...a, ownerId: 'owner-b' }, one.token, input())).toThrow('B2_TOKEN_SCOPE_MISMATCH')
    expect(() => store.stage({ ...a, caseCandidateId: 'case-b' }, one.token, input())).toThrow('B2_TOKEN_SCOPE_MISMATCH')
    const staged = store.stage(a, one.token, input())
    expect(staged.rawSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(() => store.stage(a, one.token, input())).toThrow('B2_TOKEN_INVALID_OR_CONSUMED')
    expect(store.read(a, staged.candidateId).toString()).toBe('synthetic-source-v1')
    expect(() => store.read({ ...a, caseCandidateId: 'case-b' }, staged.candidateId)).toThrow('B2_MATERIAL_SCOPE_MISMATCH')
    const expiring = store.grant(a, 10)
    tick = 1010
    expect(() => store.stage(a, expiring.token, input({ requestId: 'req-next' }))).toThrow('B2_TOKEN_INVALID_OR_CONSUMED')
  })
  test('B-IN-02: request replay idempotent, changed bytes collide', () => {
    const store = new ReviewB2StagingService()
    const first = store.stage(a, store.grant(a).token, input())
    const again = store.stage(a, store.grant(a).token, input())
    expect(first).toEqual(again)
    expect(() => store.stage(a, store.grant(a).token, input({ bytes: Buffer.from('altered') })))
      .toThrow('B2_REQUEST_ID_COLLISION')
    const buffer = store.read(a, first.candidateId)
    buffer[0] = 0
    expect(store.read(a, first.candidateId).toString()).toBe('synthetic-source-v1')
  })
  test('B-DOC-02: same stem + bytes but different physical source is a distinct document version', () => {
    const store = new ReviewB2StagingService()
    const original = store.stage(a, store.grant(a).token, input())
    const differentSource = store.stage(a, store.grant(a).token,
      input({ requestId: 'req-2', physicalSourceKey: 'picker-file-id-2' }))
    expect(original.rawSha256).toBe(differentSource.rawSha256)
    expect(original.documentVersionId).not.toBe(differentSource.documentVersionId)
  })
  test('B-IN-03: import is not review batch and cannot be assembled across owner', () => {
    const store = new ReviewB2StagingService()
    const one = store.stage(a, store.grant(a).token, input())
    const batch = store.previewImportBatch(a, [one.candidateId])
    expect(batch.kind).toBe('import')
    expect(batch.status).toBe('staged')
    expect(batch.materialIds).toEqual([one.materialId])
    expect(() => store.previewImportBatch(a, [one.candidateId, one.candidateId])).toThrow('B2_DUPLICATE_CANDIDATE')
    expect(() => store.previewImportBatch({ ...a, ownerId: 'stranger' }, [one.candidateId]))
      .toThrow('B2_MATERIAL_SCOPE_MISMATCH')
  })
  test('B-IN-02: revoke prevents read, staging and post-await continuation', () => {
    const store = new ReviewB2StagingService()
    const first = store.stage(a, store.grant(a).token, input())
    const pending = store.grant(a)
    store.revoke(a)
    expect(() => store.read(a, first.candidateId)).toThrow('B2_OWNER_INVALID_OR_REVOKED')
    expect(() => store.stage(a, pending.token, input({ requestId: 'other' })))
      .toThrow('B2_OWNER_INVALID_OR_REVOKED')
    expect(() => store.assertStillGranted(a)).toThrow('B2_OWNER_INVALID_OR_REVOKED')
    const next = { ...a, ownerGeneration: 2 }
    expect(store.grant(next).token).toMatch(/^[a-f0-9]{64}$/)
    expect(() => store.read(next, first.candidateId)).toThrow('B2_MATERIAL_SCOPE_MISMATCH')
  })
  test('B-IN-01: no path, Windows device, NUL, backslash or control-character display name', () => {
    const store = new ReviewB2StagingService()
    for (const name of ['../escape.pdf', 'C:\\foo.pdf', 'CON.txt', 'NUL', 'bad/name.txt', 'trailing.',
      'null' + String.fromCharCode(0) + '.txt']) {
      expect(() => store.stage(a, store.grant(a).token, input({
        fileName: name, requestId: 'name-' + Buffer.from(name).toString('hex'),
      }))).toThrow('B2_MATERIAL_INVALID')
    }
    const good = store.stage(a, store.grant(a).token,
      input({ fileName: '科研材料（正式）.pdf', requestId: 'unicode-safe' }))
    expect(good.fileName).toBe('科研材料（正式）.pdf')
  })

})
