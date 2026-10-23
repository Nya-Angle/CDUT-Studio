import { expect, test } from 'bun:test'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import type { T08Report } from './review-v3-t08-case-report'
import { encodeF16ReportBundle, encodeF16ReportWorkbook, f16SafeSpreadsheetSheet, f16TextBytes, makeF16DeliveryManifest } from './review-v3-f16-report-delivery'

function reportFixture(audience: T08Report['audience'] = 'student', stale = false): T08Report {
  return { caseId: 'case-1', runId: 'run-history', audience, status: 'awaiting-decision', stale,
    markdown: '# 申请人报告',
    json: JSON.stringify({ caseId: 'case-1', audience, historical: stale, run: {
      id: 'run-history', status: 'awaiting-decision', templateId: 'template-1', templateVersion: 2, inputHash: 'hash-1',
    } }),
  } as T08Report
}

test('F16 package manifest binds report Run/audience and SHA-256 of its actual exported bytes', async () => {
  const report = reportFixture('student', true)
  const manifest = await makeF16DeliveryManifest(report, [
    { name: 'report.md', bytes: f16TextBytes('abc') },
    { name: 'report.json', bytes: f16TextBytes('{"sample":true}') },
  ], '2026-10-21T00:00:00.000Z')
  expect(manifest.schema).toBe('review-v3-f16-delivery/1')
  expect(manifest.kind).toBe('read-only-report')
  expect(manifest.runId).toBe('run-history')
  expect(manifest.audience).toBe('student')
  expect(manifest.inputHash).toBe('hash-1')
  expect(manifest.template).toBe('template-1@2')
  expect(manifest.historical).toBe(true)
  expect(manifest.exportedAt).toBe('2026-10-21T00:00:00.000Z')
  expect(manifest.files[0]).toEqual({ name: 'report.md', size: 3,
    sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' })
  expect(manifest.notice).toContain('不是数字签名')
})

test('F16 refuses missing files, duplicate names and unsafe archive paths', async () => {
  const report = reportFixture('reviewer')
  await expect(makeF16DeliveryManifest(report, [])).rejects.toThrow('没有可导出')
  await expect(makeF16DeliveryManifest(report, [
    { name: 'report.md', bytes: f16TextBytes('a') }, { name: 'REPORT.MD', bytes: f16TextBytes('b') },
  ])).rejects.toThrow('重复')
  await expect(makeF16DeliveryManifest(report, [{ name: '../source.pdf', bytes: f16TextBytes('x') }])).rejects.toThrow('非法')
  await expect(makeF16DeliveryManifest({ ...report, runId: 'different-run' }, [
    { name: 'report.md', bytes: f16TextBytes('x') },
  ])).rejects.toThrow('不一致')
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
  const manifest = JSON.parse(await zip.file('manifest.json')!.async('string')) as { files: Array<{ name: string; sha256: string }> }
  expect(manifest.files.length).toBe(2)
  const actual = await crypto.subtle.digest('SHA-256', Uint8Array.from(files[0]!.bytes))
  expect(manifest.files[0]!.sha256).toBe([...new Uint8Array(actual)].map((b) => b.toString(16).padStart(2, '0')).join(''))
  expect(await zip.file('README.txt')!.async('string')).toContain('不构成业务审批')
  await expect(encodeF16ReportBundle(report, [
    { name: 'report.md', bytes: f16TextBytes('其他运行的报告') }, files[1]!,
  ])).rejects.toThrow('不一致')
})

test('F16 creates a real multi-sheet XLSX from projected data and does not encode a source formula', async () => {
  const report = { caseId: 'a', runId: 'r', audience: 'student', status: 'completed', stale: false,
    rows: [{ kind: 'check', id: 'c1', status: 'pending', detail: '=HYPERLINK("https://example.com")', source: '不可见' }],
    json: JSON.stringify({ run: { templateId: 't', templateVersion: 1, inputHash: 'h', coverage: {
      plannedChecks: 1, completedChecks: 0, effectiveVerdicts: 0, pendingChecks: 1,
    } }, sources: [], decision: null, subjects: [], supplements: [] }),
  } as T08Report
  const workbook = XLSX.read(await encodeF16ReportWorkbook(report), { type: 'array' })
  expect(workbook.SheetNames).toEqual(['报告概览', '检查与来源', '原件版本', '事项字段', '补件清单'])
  const detail = workbook.Sheets['检查与来源']!['D2']!
  expect(detail.t).toBe('s')
  expect(detail.f).toBeUndefined()
  expect(detail.v).toContain('HYPERLINK')
})
