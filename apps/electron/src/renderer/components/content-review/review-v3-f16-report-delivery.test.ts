import { expect, test } from 'bun:test'
import type { CaseAggregateV2, ReviewRunV2 } from '@profer/shared'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import { makeT08CaseReport, type T08Report } from './review-v3-t08-case-report'
import { encodeF16ReportBundle, encodeF16ReportWorkbook, f16SafeSpreadsheetSheet, f16TextBytes, makeF16DeliveryManifest } from './review-v3-f16-report-delivery'

function reportFixture(audience: T08Report['audience'] = 'student', stale = false): T08Report {
  const kind: NonNullable<T08Report['kind']> = stale ? 'historical' : 'preliminary'
  return { caseId: 'case-1', runId: 'run-history', audience, status: 'awaiting-decision', stale, kind,
    markdown: '# 申请人报告',
    rows: [],
    json: JSON.stringify({
      schema: 'review-v3-t08-report/2',
      reportKind: kind,
      caseId: 'case-1',
      audience,
      historical: stale,
      run: {
        id: 'run-history', status: 'awaiting-decision', templateId: 'template-1', templateVersion: 2, inputHash: 'hash-1',
        coverage: { plannedChecks: 0, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 0 },
      },
      sources: [], decision: null, decisions: [], subjects: [], supplements: [],
    }),
  }
}

test('F16 package manifest binds a real schema /2 report Run/audience and SHA-256 of its actual exported bytes', async () => {
  const report = reportFixture('student', true)
  const manifest = await makeF16DeliveryManifest(report, [
    { name: 'report.md', bytes: f16TextBytes('abc') },
    { name: 'report.json', bytes: f16TextBytes('{"sample":true}') },
  ], '2026-10-21T00:00:00.000Z')
  expect(manifest.schema).toBe('review-v3-f16-local-delivery/2')
  // 本地只读适配器独立命名，不能与 Main 的 review-v3-f16-delivery/2 混同。
  expect(manifest.schema).not.toBe('review-v3-f16-delivery/2')
  expect(manifest.kind).toBe('read-only-report')
  expect(manifest.runId).toBe('run-history')
  expect(manifest.audience).toBe('student')
  expect(manifest.reportKind).toBe('historical')
  expect(manifest.inputHash).toBe('hash-1')
  expect(manifest.template).toBe('template-1@2')
  expect(manifest.historical).toBe(true)
  expect(manifest.exportedAt).toBe('2026-10-21T00:00:00.000Z')
  expect(manifest.files[0]).toEqual({ name: 'report.md', size: 3,
    sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' })
  expect(manifest.notice).toContain('不是数字签名')
  expect(manifest.notice).toContain('所选报告/Run/受众')
  // schema /2 没有 Main 授权回执或归档代次证据；清单必须保持 unknown/缺省，不能伪造授权或 0 代。
  expect(manifest.audienceAuthorization).toBe('unknown')
  expect('audienceAuthorized' in manifest).toBe(false)
  expect('archiveCycle' in manifest).toBe(false)
})

test('F16 manifest consumes a report produced by the shared schema /2 projection', async () => {
  const aggregate = {
    caseV2: { id: 'case-real', documents: [], subjects: [] }, decisions: [], dispositions: [], supplements: [],
  } as unknown as CaseAggregateV2
  const run = {
    id: 'run-real', caseId: 'case-real', templateId: 'template-real', templateVersion: 1,
    inputManifest: { hash: 'hash-real', documentVersions: [] }, status: 'completed',
    coverage: { effectiveVerdicts: 0, plannedChecks: 0, pendingChecks: 0 }, checks: [], opinions: [],
  } as unknown as ReviewRunV2
  const report = makeT08CaseReport({ aggregate, run, audience: 'reviewer', stale: false })
  expect(JSON.parse(report.json).schema).toBe('review-v3-t08-report/2')
  const manifest = await makeF16DeliveryManifest(report, [
    { name: 'report.md', bytes: f16TextBytes(report.markdown) },
    { name: 'report.json', bytes: f16TextBytes(report.json) },
  ], '2026-10-21T00:00:00.000Z')
  expect(manifest.inputHash).toBe('hash-real')
  expect(manifest.runId).toBe('run-real')
  expect(manifest.audience).toBe('reviewer')
  expect(manifest.reportKind).toBe('preliminary')
  expect(manifest.audienceAuthorization).toBe('unknown')
  expect('archiveCycle' in manifest).toBe(false)
})

test('F16 refuses missing files, duplicate names, unsafe paths and mismatched Run/audience/report kind', async () => {
  const report = reportFixture('reviewer')
  await expect(makeF16DeliveryManifest(report, [])).rejects.toThrow('没有可导出')
  await expect(makeF16DeliveryManifest(report, [
    { name: 'report.md', bytes: f16TextBytes('a') }, { name: 'REPORT.MD', bytes: f16TextBytes('b') },
  ])).rejects.toThrow('重复')
  await expect(makeF16DeliveryManifest(report, [{ name: '../source.pdf', bytes: f16TextBytes('x') }])).rejects.toThrow('非法')
  await expect(makeF16DeliveryManifest({ ...report, runId: 'different-run' }, [
    { name: 'report.md', bytes: f16TextBytes('x') },
  ])).rejects.toThrow('不一致')
  await expect(makeF16DeliveryManifest({ ...report, audience: 'student' }, [
    { name: 'report.md', bytes: f16TextBytes('x') },
  ])).rejects.toThrow('不一致')
  await expect(makeF16DeliveryManifest({ ...report, kind: 'decided' }, [
    { name: 'report.md', bytes: f16TextBytes('x') },
  ])).rejects.toThrow('不一致')
  await expect(makeF16DeliveryManifest({
    ...report, json: JSON.stringify({ ...JSON.parse(report.json), schema: 'review-v3-t08-report/9' }),
  }, [
    { name: 'report.md', bytes: f16TextBytes('x') },
  ])).rejects.toThrow('schema')
})

test('F16 keeps spreadsheet values as text and neutralizes formula-like source strings', () => {
  const original = { name: '检查与来源', rows: [['说明', '来源'], ['=1+1', '@SUM(A1:A2)'], ['普通字段', '+cmd']] }
  const cleaned = f16SafeSpreadsheetSheet(original)
  expect(cleaned.rows[1]).toEqual(["'=1+1", "'@SUM(A1:A2)"])
  expect(cleaned.rows[2]).toEqual(['普通字段', "'+cmd"])
  expect(original.rows[1]?.[0]).toBe('=1+1')
})

test('F16 actually creates readable ZIP with matching digest, no source originals or reply actions', async () => {
  const report = reportFixture()
  const files = [{ name: 'report.md', bytes: f16TextBytes(report.markdown) },
    { name: 'report.json', bytes: f16TextBytes(report.json) }]
  const bytes = await encodeF16ReportBundle(report, files)
  const zip = await JSZip.loadAsync(bytes)
  expect(Object.keys(zip.files).sort()).toEqual(['README.txt', 'manifest.json', 'report.json', 'report.md'])
  expect(await zip.file('report.md')!.async('string')).toBe('# 申请人报告')
  expect(await zip.file('report.json')!.async('string')).toBe(report.json)
  const manifest = JSON.parse(await zip.file('manifest.json')!.async('string')) as {
    schema: string; audienceAuthorization: string; files: Array<{ name: string; sha256: string }>
  }
  expect(manifest.schema).toBe('review-v3-f16-local-delivery/2')
  expect(manifest.audienceAuthorization).toBe('unknown')
  expect(manifest.files.length).toBe(2)
  const actual = await crypto.subtle.digest('SHA-256', Uint8Array.from(files[0]!.bytes))
  expect(manifest.files[0]!.sha256).toBe([...new Uint8Array(actual)].map((b) => b.toString(16).padStart(2, '0')).join(''))
  expect(await zip.file('README.txt')!.async('string')).toContain('不构成业务审批')
  await expect(encodeF16ReportBundle(report, [
    { name: 'report.md', bytes: f16TextBytes('其他运行的报告') }, files[1]!,
  ])).rejects.toThrow('不一致')
})

test('F16 /2 manifest neither promotes renderer-supplied role/grant nor invents archive cycle 0', async () => {
  const report = reportFixture('reviewer')
  const projection = JSON.parse(report.json) as Record<string, unknown>
  // 即使 /2 JSON 被塞入旧字段或 Renderer 自报角色，也不能当成 Main 授权或归档证据。
  projection.actorRole = 'organizer'
  projection.audienceGranted = true
  projection.archiveCycle = { archiveCycle: 0 }
  const manifest = await makeF16DeliveryManifest({ ...report, json: JSON.stringify(projection) }, [
    { name: 'report.md', bytes: f16TextBytes(report.markdown) },
  ], '2026-10-21T00:00:00.000Z')
  expect(manifest.audience).toBe('reviewer')
  expect(manifest.audienceAuthorization).toBe('unknown')
  expect('audienceAuthorized' in manifest).toBe(false)
  expect('archiveCycle' in manifest).toBe(false)
  expect(manifest.notice).toContain('受众授权')
  expect(manifest.notice).not.toContain('学校已授权')
})

test('F16 legacy /1 archive cycle is retained only when explicitly recorded; authorization stays unknown', async () => {
  const base = reportFixture('student', true)
  const projection = JSON.parse(base.json) as Record<string, unknown>
  projection.schema = 'review-v3-t08-report/1'
  delete projection.reportKind
  projection.archiveCycle = { archiveCycle: 2 }
  projection.audienceGranted = true
  const legacy: T08Report = { ...base, kind: undefined, json: JSON.stringify(projection) }
  const manifest = await makeF16DeliveryManifest(legacy, [
    { name: 'report.md', bytes: f16TextBytes(legacy.markdown) },
  ], '2026-10-21T00:00:00.000Z')
  expect(manifest.schema).toBe('review-v3-f16-local-delivery/2')
  expect(manifest.archiveCycle).toBe(2)
  expect(manifest.reportKind).toBeUndefined()
  expect(manifest.audienceAuthorization).toBe('unknown')
})

test('F16 creates a real multi-sheet XLSX from projected data and does not encode a source formula', async () => {
  const report: T08Report = { caseId: 'a', runId: 'r', audience: 'student', status: 'completed', stale: false,
    kind: 'preliminary', markdown: '',
    rows: [{ kind: 'check', id: 'c1', status: 'pending', detail: '=HYPERLINK("https://example.com")', source: '不可见' }],
    json: JSON.stringify({
      schema: 'review-v3-t08-report/2', reportKind: 'preliminary', caseId: 'a', audience: 'student', historical: false,
      run: { id: 'r', status: 'completed', templateId: 't', templateVersion: 1, inputHash: 'h', coverage: {
        plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1,
      } }, sources: [], decision: null, decisions: [], subjects: [], supplements: [],
    }),
  }
  const workbook = XLSX.read(await encodeF16ReportWorkbook(report), { type: 'array' })
  expect(workbook.SheetNames).toEqual(['报告概览', '检查与来源', '原件版本', '事项字段', '补件清单'])
  const detail = workbook.Sheets['检查与来源']!['D2']!
  expect(detail.t).toBe('s')
  expect(detail.f).toBeUndefined()
  expect(detail.v).toContain('HYPERLINK')
})
