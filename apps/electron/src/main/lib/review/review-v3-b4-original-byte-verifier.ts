/**
 * B4 raw historical original proof, deliberately separate from publication.
 *
 * Inputs must be the actual byte payload of a Git blob, never just SHA values
 * copied from a manifest. This only proves historical byte identity.
 */
import { createHash } from 'node:crypto'

export interface B4OriginalBytePin {
  templateId: string
  /** The Git object requested and received from historical repository data. */
  observedGitBlob: string
  /** Optional independently pinned Git object SHA from the source manifest. */
  expectedGitBlob?: string | null
  declaredSourceSha256: string
}
export interface B4OriginalByteResult {
  templateId: string
  gitBlob: string
  sha256: string
  expectedGitBlobPinned: boolean
  byteCount: number
  status: 'HISTORICAL_ORIGINAL_BYTES_MATCH_CANDIDATE_ONLY'
  publicationAllowed: false
  policyApproval: 'NOT_VERIFIED'
  independentGold: 'NOT_AUTHORIZED_OR_NOT_RUN'
}
const sha40 = /^[a-f0-9]{40}$/
const sha64 = /^[a-f0-9]{64}$/
const deny = (reason: string): never => { throw new Error('B4_ORIGINAL_BYTES_' + reason) }

/** Git blob identity is SHA1("blob " + byteLength + NUL + bytes). */
export function verifyB4OriginalGitBytes(
  bytes: Uint8Array,
  pin: B4OriginalBytePin,
): B4OriginalByteResult {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0 ||
      !pin || !/^[a-z0-9-]{1,128}$/.test(pin.templateId) ||
      !sha40.test(pin.observedGitBlob) ||
      (pin.expectedGitBlob != null && !sha40.test(pin.expectedGitBlob)) ||
      !sha64.test(pin.declaredSourceSha256)) deny('INVALID_INPUT')
  const byteSha = createHash('sha256').update(bytes).digest('hex')
  const gitSha = createHash('sha1')
    .update('blob ' + String(bytes.byteLength) + '\0')
    .update(bytes).digest('hex')
  if (gitSha !== pin.observedGitBlob ||
      (pin.expectedGitBlob != null && gitSha !== pin.expectedGitBlob) ||
      byteSha !== pin.declaredSourceSha256) deny('CONTENT_MISMATCH')
  return {
    templateId: pin.templateId, gitBlob: gitSha, sha256: byteSha,
    expectedGitBlobPinned: pin.expectedGitBlob != null,
    byteCount: bytes.byteLength,
    status: 'HISTORICAL_ORIGINAL_BYTES_MATCH_CANDIDATE_ONLY',
    publicationAllowed: false, policyApproval: 'NOT_VERIFIED',
    independentGold: 'NOT_AUTHORIZED_OR_NOT_RUN',
  }
}
