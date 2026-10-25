/** T08 pure report projection is shared so Main can create the trusted, audience-filtered snapshot. */
export {
  resolveT08Source, makeT08CaseReport, t08ReportTable, t08ReportWorkbookSheets, t08AssistantContext,
} from '@profer/shared'
export type {
  T08Audience, T08ResolvedSource, T08Report, T08WorkbookSheet,
  T08ReportProjection, T08ReportSnapshot, T08ReportArchiveSummary,
  T08ReportExportFormat, T08ReportExportReceipt,
} from '@profer/shared'
