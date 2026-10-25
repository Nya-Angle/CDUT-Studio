/**
 * Renderer-only synthetic trial values. No stage in this adapter issues a
 * SourceIdentity, publishes a policy, or mutates the saved author document.
 * Save/freeze must use original author source, never these temporary facts.
 */
import type {
  B1AuthorDocument, B1Field, B1Target,
} from '../../../main/lib/review/review-template-plan-adapter-v3-b1'

export type B1TrialValue = string | number | boolean | null
export type B1TrialValues = Record<string, Record<string, B1TrialValue>>
export function parseB1TrialInput(field: B1Field, raw: string): B1TrialValue {
  if (raw === '') return null
  switch(field.type) {
    case 'text': return raw
    case 'date':
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(raw) ||
        !Number.isFinite(Date.parse(raw + 'T00:00:00Z')) ||
        new Date(raw + 'T00:00:00Z').toISOString().slice(0,10) !== raw) {
        throw new Error('B1_TRIAL_DATE_INVALID')
      }
      return raw
    case 'enum':
      if (!field.enumValues?.includes(raw)) throw new Error('B1_TRIAL_ENUM_INVALID')
      return raw
    case 'number': {
      const number = Number(raw)
      if (!Number.isFinite(number)) throw new Error('B1_TRIAL_NUMBER_INVALID')
      return number
    }
    case 'boolean':
      if (raw === 'true') return true
      if (raw === 'false') return false
      throw new Error('B1_TRIAL_BOOLEAN_INVALID')
    case 'evidence':
      throw new Error('B1_TRIAL_EVIDENCE_REQUIRES_REAL_SOURCE')
  }
  throw new Error('B1_TRIAL_TYPE_UNSUPPORTED')
}
export function prepareB1TechnicalTrial(
  source: B1AuthorDocument, trial: B1TrialValues,
): B1AuthorDocument {
  const copy = structuredClone(source)
  const fields = new Map(copy.fields.map(field => [field.key,field]))
  const targets = new Map(copy.targets.map(t => [t.targetKey,t]))
  for (const [targetKey, values] of Object.entries(trial)) {
    const target:B1Target | undefined = targets.get(targetKey)
    if (!target) throw new Error('B1_TRIAL_UNKNOWN_TARGET')
    for (const [fieldKey,value] of Object.entries(values)) {
      const field = fields.get(fieldKey)
      if (!field) throw new Error('B1_TRIAL_UNKNOWN_FIELD')
      if (field.type === 'evidence' && value !== null) {
        throw new Error('B1_TRIAL_EVIDENCE_REQUIRES_REAL_SOURCE')
      }
      // Strict type+enum validation is performed by the B1 plan compiler.
      target.fieldValues[fieldKey] = value
    }
  }
  return copy
}
export function exportB1AuthorCandidate(draft: B1AuthorDocument): string {
  if (draft.schemaVersion !== 'review-b1/1' || draft.status !== 'candidate-held') {
    throw new Error('B1_EXPORT_NOT_CANDIDATE')
  }
  return JSON.stringify({
    format: 'review-b1-candidate-export/1',
    publicationAllowed: false,
    trustTier: 'unverified-user-authoring',
    candidate: structuredClone(draft),
  }, null, 2) + '\n'
}
