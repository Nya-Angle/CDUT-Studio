/** T09 student export permission regression: only a matching published template can make fields public. */
import { describe, expect, test } from 'bun:test'
import type { CaseAggregateV2, TemplateVersion } from '@profer/shared'
import { t09PublishedStudentVisibility } from './review-v3-t09-main-service'
import { projectForRole } from './offline-roundtrip'

const aggregate = {
  caseV2: {
    id: 'case-t09-public', templateId: 'tpl-t09-public', templateVersion: 2,
    title: 'case', stage: 'submitted',
    caseFields: {
      applicant: { kind: 'string', value: 'visible' },
      internalNote: { kind: 'string', value: 'secret' },
      neverDeclared: { kind: 'string', value: 'unknown' },
    },
    subjects: [], documents: [],
  },
  decisions: [], supplements: [], dispositions: [], ratings: [],
} as unknown as CaseAggregateV2

const published = {
  templateId: 'tpl-t09-public', version: 2, status: 'published',
  fields: [
    { key: 'applicant', visibility: 'public' },
    { key: 'internalNote', visibility: 'internal' },
  ],
} as unknown as TemplateVersion

describe('T09 student offline visibility Main boundary', () => {
  test('unknown and internal case values are omitted even with populated case data', () => {
    const fields = t09PublishedStudentVisibility(aggregate, published)
    const result = projectForRole(aggregate, 'student', fields, 'local-student')
    expect(result.fields).toEqual({ applicant: 'visible' })
    expect(result.fields).not.toHaveProperty('internalNote')
    expect(result.fields).not.toHaveProperty('neverDeclared')
  })
  test('rejects unpublished or wrong-version template instead of falling back to renderer declarations', () => {
    expect(() => t09PublishedStudentVisibility(aggregate, { ...published, status: 'draft' })).toThrow('T09_PUBLIC_TEMPLATE_NOT_PUBLISHED')
    expect(() => t09PublishedStudentVisibility(aggregate, { ...published, version: 1 })).toThrow('T09_PUBLIC_TEMPLATE_NOT_PUBLISHED')
    expect(() => t09PublishedStudentVisibility(aggregate, undefined)).toThrow('T09_PUBLIC_TEMPLATE_NOT_PUBLISHED')
  })
})
