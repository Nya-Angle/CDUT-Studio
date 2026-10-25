import { afterEach, expect, test } from 'bun:test'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Principal, T08Audience, T08ReportProjection } from '@profer/shared'
import { calculateT08ProjectionHash, makeT08ReportSnapshot, persistT08ReportSnapshot } from './review-v3-report-service'
import {
  accessibleT08Audiences, archiveAuthorizedT08ReportV3, assertT08AudienceAccess,
  deriveT08AssignedLocalReportPrincipal, exportAuthorizedT08ReportArchiveV3, exportAuthorizedT08ReportV3,
  getAuthorizedT08ReportArchiveV3, getAuthorizedT08ReportPreviewV3, listAuthorizedT08ReportArchivesV3,
  mayReadT08Audience,
} from './review-v3-t08-report-access'

const roots: string[] = []
function root(): string {
  const dir = mkdtempSync(join(tmpdir(), 'f02-t08-'))
  roots.push(dir)
  return dir
}
afterEach(() => { for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true }) })

function principal(role: Principal['role'], source: Principal['source'], assurance: Principal['assurance'],
  caseIds = ['case-f02'], actions = ['report:read:student'], credentialReference?: string): Principal {
  return {
    principalId: 'principal-f02', role, source, assurance, sessionId: 'main-session-f02',
    scope: { caseIds, actions }, ...(credentialReference ? { credentialReference } : {}),
  }
}

function snapshot(audience: T08Audience, reportId: string) {
  const reportJson = JSON.stringify({ caseId: 'case-f02', audience, historical: false, run: {
    id: 'run-f02', status: 'completed', inputHash: 'hash-f02', templateId: 'template-f02', templateVersion: 1,
  } })
  const report = { caseId: 'case-f02', runId: 'run-f02', audience, status: 'completed', stale: false,
    markdown: `# ${audience} 报告`, json: reportJson, rows: [] }
  const base = {
    schema: 'review-v3-t08-report-projection/1' as const,
    caseId: 'case-f02', caseTitle: '安全测试案卷', caseRevision: 1,
    runId: 'run-f02', audience, inputHash: 'hash-f02',
    templateId: 'template-f02', templateVersion: 1, templateDigest: null,
    decisionIds: [], decisionDigest: 'none', historical: false,
    renderVersion: 't08-report-renderer/2' as const, report,
  }
  const projection: T08ReportProjection = { ...base, projectionHash: calculateT08ProjectionHash(base) }
  return makeT08ReportSnapshot(projection, { reportId })
}

test('F02: 本机申请人/Agent 指派只可读取申请人版，修改受众或自称本地 reviewer 无法升权', () => {
  const applicant = principal('student', 'local', 'local-device')
  const agent = deriveT08AssignedLocalReportPrincipal('assignment-f02', 'case-f02')
  expect(accessibleT08Audiences(applicant, 'case-f02')).toEqual(['student'])
  expect(accessibleT08Audiences(agent, 'case-f02')).toEqual(['student'])
  for (const role of ['reviewer', 'organizer'] as const) {
    expect(() => assertT08AudienceAccess(applicant, 'case-f02', role)).toThrow('REPORT_ACCESS_DENIED')
    expect(() => assertT08AudienceAccess(agent, 'case-f02', role)).toThrow('REPORT_ACCESS_DENIED')
  }
  expect(accessibleT08Audiences(principal('reviewer', 'local', 'local-device', ['case-f02'], [
    'report:read:reviewer', 'report:read:organizer',
  ]), 'case-f02')).toEqual([])
  expect(() => getAuthorizedT08ReportPreviewV3(applicant, {
    caseId: 'case-f02', runId: 'run-f02', audience: 'reviewer',
  })).toThrow('REPORT_ACCESS_DENIED')
  expect(() => archiveAuthorizedT08ReportV3(agent, {
    caseId: 'case-f02', runId: 'run-f02', audience: 'reviewer',
  })).toThrow('REPORT_ACCESS_DENIED')
  expect(() => deriveT08AssignedLocalReportPrincipal('', 'case-f02')).toThrow('REPORT_ACCESS_DENIED')
})

test('F02: 已核验校方角色仍须匹配受众权限、凭据与精确案卷范围', () => {
  const grants = ['report:read:student', 'report:read:reviewer', 'report:read:organizer']
  const verifiedReviewer = principal('reviewer', 'school', 'verified-school', ['case-f02'], grants, 'main-only-credential')
  const verifiedOrganizer = principal('school-admin', 'school', 'verified-school', ['case-f02'], grants, 'main-only-credential')
  expect(accessibleT08Audiences(verifiedReviewer, 'case-f02')).toEqual(['student', 'reviewer'])
  expect(accessibleT08Audiences(verifiedOrganizer, 'case-f02')).toEqual(['student', 'reviewer', 'organizer'])
  expect(mayReadT08Audience(verifiedReviewer, 'case-other', 'reviewer')).toBe(false)
  expect(mayReadT08Audience(principal('school-admin', 'school', 'local-device', ['case-f02'], grants, 'pretend'), 'case-f02', 'organizer')).toBe(false)
  expect(mayReadT08Audience(principal('school-admin', 'school', 'verified-school', ['case-f02'], grants), 'case-f02', 'organizer')).toBe(false)
  expect(mayReadT08Audience(principal('school-admin', 'school', 'verified-school', ['case-f02'], ['report:read:student'], 'main-only-credential'), 'case-f02', 'organizer')).toBe(false)
  expect(mayReadT08Audience(principal('student', 'local', 'local-device', ['case-other']), 'case-f02', 'student')).toBe(false)
})

test('F02: 历史内部报告不向申请人列举、读取、另存；合法校方只能读取已授权受众', async () => {
  const dir = root()
  persistT08ReportSnapshot(snapshot('student', 'student-report'), dir)
  persistT08ReportSnapshot(snapshot('reviewer', 'reviewer-report'), dir)
  persistT08ReportSnapshot(snapshot('organizer', 'organizer-report'), dir)
  const applicant = principal('student', 'local', 'local-device')
  const reviewer = principal('reviewer', 'school', 'verified-school', ['case-f02'], [
    'report:read:reviewer',
  ], 'main-only-credential')

  expect(listAuthorizedT08ReportArchivesV3(applicant, 'case-f02', dir).map((r) => r.reportId))
    .toEqual(['student-report'])
  expect(getAuthorizedT08ReportArchiveV3(applicant, { caseId: 'case-f02', reportId: 'student-report' }, dir).audience).toBe('student')
  expect(() => getAuthorizedT08ReportArchiveV3(applicant, { caseId: 'case-f02', reportId: 'reviewer-report' }, dir))
    .toThrow('REPORT_ACCESS_DENIED')
  expect(listAuthorizedT08ReportArchivesV3(reviewer, 'case-f02', dir).map((r) => r.reportId))
    .toEqual(['reviewer-report'])
  expect(getAuthorizedT08ReportArchiveV3(reviewer, { caseId: 'case-f02', reportId: 'reviewer-report' }, dir).audience)
    .toBe('reviewer')
  expect(() => getAuthorizedT08ReportArchiveV3(reviewer, { caseId: 'case-f02', reportId: 'organizer-report' }, dir))
    .toThrow('REPORT_ACCESS_DENIED')

  let destinationCalled = false
  await expect(exportAuthorizedT08ReportArchiveV3(applicant, {
    caseId: 'case-f02', reportId: 'reviewer-report', format: 'md',
  }, { rootDir: dir, chooseDestination: async () => { destinationCalled = true; return undefined } }))
    .rejects.toThrow('REPORT_ACCESS_DENIED')
  expect(destinationCalled).toBe(false)
  expect(existsSync(join(dir, 'review-cases', 'case-f02', 'reports-v3', 'reviewer-report', 'local-save-records'))).toBe(false)
  const receipt = await exportAuthorizedT08ReportArchiveV3(reviewer, {
    caseId: 'case-f02', reportId: 'reviewer-report', format: 'md',
  }, { rootDir: dir, chooseDestination: async () => undefined })
  expect(receipt.status).toBe('cancelled')
  expect(receipt.audience).toBe('reviewer')
})

test('F02: 当前报告导出先授权再核验 Run；无权受众不写不可变归档', async () => {
  const dir = root()
  const applicant = principal('student', 'local', 'local-device')
  await expect(exportAuthorizedT08ReportV3(applicant, {
    caseId: 'case-f02', runId: 'run-f02', audience: 'reviewer', format: 'md', expectedProjectionHash: 'anything',
  }, { rootDir: dir, chooseDestination: async () => undefined })).rejects.toThrow('REPORT_ACCESS_DENIED')
  expect(existsSync(join(dir, 'review-cases'))).toBe(false)
  expect(() => getAuthorizedT08ReportArchiveV3(applicant, { caseId: 'case-other', reportId: 'reviewer-report' }, dir))
    .toThrow('REPORT_ACCESS_DENIED')
})
