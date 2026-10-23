/**
 * T06 batch intake manifest. Pure client-side preview only: assignments become
 * existing case IDs, never material uploads or new CaseAggregate writes.
 */
export interface BatchManifestRow {
  line: number
  caseId: string
  externalId: string
  applicant: string
  title: string
  files: string
}

export interface BatchManifestParse {
  rows: BatchManifestRow[]
  errors: string[]
}

export interface BatchAssignment {
  row: BatchManifestRow
  caseId: string
  status: 'ready' | 'unassigned' | 'duplicate' | 'name-conflict' | 'excluded'
  detail: string
}

export interface BatchManifestCandidate {
  caseId: string
  applicant?: string
}

const HEADERS: Record<keyof Omit<BatchManifestRow, 'line'>, string[]> = {
  caseId: ['caseid', 'case_id', '案卷id', '案卷编号', '项目id', '项目编号'],
  externalId: ['externalid', 'external_id', '学号', '外部编号', '申请编号'],
  applicant: ['applicant', '姓名', '申报人', '申请人'],
  title: ['title', '标题', '项目名称'],
  files: ['files', '材料', '材料文件', '文件清单'],
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '')
}

function parseDelimited(text: string, delimiter: ',' | '\t'): { cells: string[][]; lines: number[]; errors: string[] } {
  const cells: string[][] = []
  const lines: number[] = []
  const errors: string[] = []
  let record: string[] = []
  let field = ''
  let quoted = false
  let startLine = 1
  let line = 1
  const source = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    if (c === '"') {
      if (quoted && source[i + 1] === '"') { field += '"'; i++ }
      else if (quoted) quoted = false
      else if (!field.trim()) quoted = true
      else field += '"'
    } else if (c === delimiter && !quoted) {
      record.push(field.trim()); field = ''
    } else if (c === '\n') {
      line++
      if (quoted) { field += '\n'; continue }
      record.push(field.trim())
      if (record.some((value) => value.length > 0)) { cells.push(record); lines.push(startLine) }
      record = []; field = ''; startLine = line
    } else {
      field += c
    }
  }
  if (quoted) errors.push('导入表中存在未闭合的引号，请修正后重试')
  record.push(field.trim())
  if (record.some((value) => value.length > 0)) { cells.push(record); lines.push(startLine) }
  return { cells, lines, errors }
}

/** Parse CSV/TSV manifest. This intentionally does not infer identity from names or filenames. */
export function parseBatchManifest(text: string, filename = ''): BatchManifestParse {
  const delimiter: ',' | '\t' = filename.toLowerCase().endsWith('.tsv')
    ? '\t' : (text.split(/\r?\n/, 1)[0]?.includes('\t') ? '\t' : ',')
  const parsed = parseDelimited(text, delimiter)
  if (parsed.errors.length) return { rows: [], errors: parsed.errors }
  const [headers, ...records] = parsed.cells
  if (!headers?.length) return { rows: [], errors: ['文件为空'] }
  const normalized = headers.map(normalizeHeader)
  const index = (key: keyof Omit<BatchManifestRow, 'line'>): number =>
    normalized.findIndex((value) => HEADERS[key].some((alias) => normalizeHeader(alias) === value))
  const indexes = {
    caseId: index('caseId'), externalId: index('externalId'), applicant: index('applicant'),
    title: index('title'), files: index('files'),
  }
  if (Object.values(indexes).every((value) => value < 0)) {
    return { rows: [], errors: ['未识别清单列。请包含「案卷ID / 申请编号 / 申报人」等表头'] }
  }
  const rows = records.map((cells, i) => ({
    line: parsed.lines[i + 1] ?? (i + 2),
    caseId: cells[indexes.caseId] ?? '',
    externalId: cells[indexes.externalId] ?? '',
    applicant: cells[indexes.applicant] ?? '',
    title: cells[indexes.title] ?? '',
    files: cells[indexes.files] ?? '',
  }))
  return { rows, errors: [] }
}

function sameApplicant(first: string, second: string): boolean {
  return first.trim().replace(/\s+/g, '').toLocaleLowerCase() === second.trim().replace(/\s+/g, '').toLocaleLowerCase()
}

/**
 * Only exact caseId can auto-bind. A user-selected override is explicit.
 * Conflicts/duplicates have to be resolved or excluded before committing.
 */
export function previewBatchAssignment(
  rows: BatchManifestRow[],
  eligibleCases: BatchManifestCandidate[],
  overrides: Readonly<Record<number, string>> = {},
  excluded: ReadonlySet<number> = new Set(),
): BatchAssignment[] {
  const eligible = new Map(eligibleCases.map((item) => [item.caseId, item]))
  const results = rows.map((row): BatchAssignment => {
    if (excluded.has(row.line)) return { row, caseId: '', status: 'excluded', detail: '已显式排除' }
    const manuallySelected = Object.prototype.hasOwnProperty.call(overrides, row.line)
    const caseId = (manuallySelected ? (overrides[row.line] ?? '') : row.caseId).trim()
    const match = eligible.get(caseId)
    if (!caseId || !match) {
      return { row, caseId: '', status: 'unassigned', detail: caseId ? '案卷不存在或模板版本不匹配；请手动选择' : '缺少案卷 ID；请手动选择' }
    }
    if (!manuallySelected && row.applicant.trim() && match.applicant?.trim()
      && !sameApplicant(row.applicant, match.applicant)) {
      return { row, caseId, status: 'name-conflict', detail: '申报人不一致；请人工确认绑定' }
    }
    return { row, caseId, status: 'ready', detail: manuallySelected ? '人工确认绑定' : '案卷 ID 精确匹配' }
  })
  const counts = new Map<string, number>()
  for (const item of results) if (item.caseId) counts.set(item.caseId, (counts.get(item.caseId) ?? 0) + 1)
  return results.map((item) =>
    item.caseId && (counts.get(item.caseId) ?? 0) > 1
      ? { ...item, status: 'duplicate', detail: '同一案卷被清单多个记录重复绑定；请更正或排除' } : item)
}

/** Escape a single spreadsheet cell before CSV export. */
export function csvCell(value: unknown): string {
  const text = String(value ?? '')
  const safe = /^[=+\-@\t\r]/.test(text) ? "'" + text : text
  return '"' + safe.replace(/"/g, '""') + '"'
}

export function buildBatchSummaryCsv(
  rows: Array<{ caseId: string; title: string; applicant: string; status: string; route: string; completed: number | string; planned: number | string; pending: number | string; error: string }>,
): string {
  return [
    ['案卷ID', '项目', '申报人', '执行状态', '分流', '已完成检查', '计划检查', '待确认检查', '异常原因'].map(csvCell).join(','),
    ...rows.map((row) => [row.caseId, row.title, row.applicant, row.status, row.route, row.completed, row.planned, row.pending, row.error].map(csvCell).join(',')),
  ].join('\r\n')
}
