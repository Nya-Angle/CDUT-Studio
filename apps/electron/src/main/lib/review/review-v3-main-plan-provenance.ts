/**
 * Dev-C C2-R05 — physically re-verified, Main-only published Plan source.
 *
 * This is a trusted CONSUMER, NOT a template or school-policy publisher.
 * Dev-B B1 candidate-held descriptors never pass as published evidence. A
 * separate privileged Main policy authority MUST provide an independently
 * verified publication record, including its issuer and immutable source SHA.
 * It cannot be synthesized from Renderer text, an author draft or a Plan DTO.
 *
 * Publication artifact bytes are pinned to the authority's raw SHA256, read
 * from a Main-configured directory on EVERY verification; no in-memory Plan
 * certificate survives revoke, tampering, missing evidence or cold restart.
 * The real B/school authority and original-material publisher remain separate
 * production prerequisites. This module does not register IPC or grant ACK.
 */
import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { isAbsolute, join, relative, sep } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import {
  assertC0CanonicalPlan, type CanonicalPlan, type CaseAggregateV2,
  type RunEvidenceIdentity, C0ContractError,
} from '@profer/shared'
import { assertC2PhysicalOriginalBytes } from './review-v3-main-trust-port'

export interface C2MainPublishedPlanRecord {
  readonly schemaVersion: 'review-v3-plan-publication/1'
  readonly publicationId: string
  readonly issuerAuthorityId: string
  /** Git provenance, not a signature on its own. */
  readonly publishedSourceCommit: string
  readonly status: 'published' | 'candidate-held' | 'revoked'
  readonly fingerprint: string
  readonly artifactSha256: string
}

export interface C2MainPublishedPlanSource {
  /** A pinned, privileged, existing root. Never derive it from a request. */
  readonly artifactRoot: string
  /** Independent live publication registry or signed policy verifier. */
  getCurrentPublication(plan: CanonicalPlan): C2MainPublishedPlanRecord | undefined
  /** Independently authenticate publisher/issuer, publication status and source. */
  assertAuthorizedPublication(record: C2MainPublishedPlanRecord): void
}

type PublishedArtifact = {
  schemaVersion: 'review-v3-published-plan-artifact/1'
  publicationId: string
  canonicalPlan: CanonicalPlan
}

const sha = (s: unknown): s is string =>
  typeof s === 'string' && /^[a-f0-9]{64}$/.test(s)
const goodId = (s: unknown): s is string =>
  typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,127}$/.test(s)
const deny = (reason: string): never => {
  throw new C0ContractError('RECOVERY_REQUIRED', reason)
}

/** Deliberately neither caches nor installs/creates a publication record. */
export class C2MainPublishedPlanProvenance {
  private readonly root: string

  constructor(private readonly source: C2MainPublishedPlanSource) {
    if (!source || !isAbsolute(source.artifactRoot ?? '') ||
        typeof source.getCurrentPublication !== 'function' ||
        typeof source.assertAuthorizedPublication !== 'function') {
      throw new C0ContractError('ACTOR_UNTRUSTED',
        'Independent Main published-Plan authority and absolute pinned root required')
    }
    this.root = source.artifactRoot
  }

  /** Suitable only as C1 bindCanonicalPlanV3's Main-injected verifier. */
  assertPublishedCanonicalPlan(plan: CanonicalPlan): void {
    assertC0CanonicalPlan(plan)
    if (!sha(plan.fingerprint)) deny('Published Plan fingerprint is not sha256')
    const record = this.source.getCurrentPublication(plan)
    if (!record || record.schemaVersion !== 'review-v3-plan-publication/1' ||
        record.status !== 'published' || !goodId(record.publicationId) ||
        !goodId(record.issuerAuthorityId) ||
        !/^[a-f0-9]{40}$/.test(record.publishedSourceCommit) ||
        record.fingerprint !== plan.fingerprint || !sha(record.artifactSha256)) {
      return deny('Published Plan current source record is missing, untrusted or revoked')
    }
    // This callback must independently attest the issuer from a C/Main trust
    // root. It MUST NOT be implemented as a test-style no-op in production.
    this.source.assertAuthorizedPublication(record)
    let bytes: Buffer
    try {
      if (!lstatSync(this.root).isDirectory()) deny('Published root is not a directory')
      const realRoot = realpathSync(this.root)
      const path = join(this.root, plan.fingerprint + '.json')
      // The final component must be a regular file, never a symlink.
      if (!lstatSync(path).isFile()) deny('Published Plan physical artifact is not a file')
      const realFile = realpathSync(path)
      const rel = relative(realRoot, realFile)
      if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
        deny('Published Plan artifact escapes pinned root')
      }
      bytes = readFileSync(path)
    } catch {
      return deny('Published Plan physical artifact missing or path untrusted')
    }
    if (bytes.length === 0 || bytes.length > 2 * 1024 * 1024 ||
        createHash('sha256').update(bytes).digest('hex') !== record.artifactSha256) {
      deny('Published Plan artifact changed or exceeds protected size limit')
    }
    let artifact: PublishedArtifact
    try { artifact = JSON.parse(bytes.toString('utf8')) as PublishedArtifact }
    catch { return deny('Published Plan JSON invalid') }
    if (!artifact || artifact.schemaVersion !== 'review-v3-published-plan-artifact/1' ||
        artifact.publicationId !== record.publicationId ||
        !artifact.canonicalPlan || !isDeepStrictEqual(artifact.canonicalPlan, plan)) {
      deny('Published Plan exact physical artifact does not match bound Plan')
    }
    assertC0CanonicalPlan(artifact.canonicalPlan)
  }

  /** Use this in C1 bind/upgrade CAS; Plan-only verification is insufficient. */
  assertPublishedPlanForCase(plan: CanonicalPlan, aggregate: CaseAggregateV2): void {
    if (plan.templateId !== aggregate.caseV2.templateId ||
        plan.templateVersion !== String(aggregate.caseV2.templateVersion)) {
      deny('Published Plan is for a different Case template')
    }
    this.assertPublishedCanonicalPlan(plan)
    const originalVersionIds = new Set(plan.bindings.flatMap(binding => binding.sourceVersionIds))
    if (originalVersionIds.size === 0) {
      deny('Published Plan binds no physical Case source')
    }
    for (const versionId of originalVersionIds) {
      assertC2PhysicalOriginalBytes(aggregate, versionId)
    }
  }

  /** Reverify publisher AND Case-controlled originals at each Run boundary. */
  assertPublishedPlan(aggregate: CaseAggregateV2, run: RunEvidenceIdentity): void {
    const plan = aggregate.canonicalPlan
    if (!plan || aggregate.caseV2.id !== run.caseId ||
        plan.fingerprint !== run.planFingerprint ||
        plan.templateVersion !== run.templateVersion ||
        plan.templateId !== aggregate.caseV2.templateId ||
        run.sourceVersionIds.length === 0) {
      return deny('Run and current Case published Plan are not exactly bound')
    }
    this.assertPublishedPlanForCase(plan, aggregate)
    const bindings = plan.bindings
    const checkKeys = new Set(bindings.map(binding => binding.checkKey))
    const versions = new Set(bindings.flatMap(binding => binding.sourceVersionIds))
    if (!bindings.length || checkKeys.size !== run.checkKeys.length ||
        run.checkKeys.some(key => !checkKeys.has(key)) ||
        versions.size !== run.sourceVersionIds.length ||
        run.sourceVersionIds.some(id => !versions.has(id)) ||
        new Set(run.sourceVersionIds).size !== run.sourceVersionIds.length) {
      deny('Published Plan binding set does not match frozen Run manifest')
    }
    for (const versionId of versions) {
      assertC2PhysicalOriginalBytes(aggregate, versionId)
    }
  }
}
