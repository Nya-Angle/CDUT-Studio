/** F02：T08/F16 的 Main-only 访问门禁。窗口来源不是学校身份，报告受众也不是权限声明。 */
import type { IpcMainInvokeEvent } from 'electron'
import type { Principal, T08Audience, T08ReportArchiveSummary, T08ReportExportFormat } from '@profer/shared'
import { assertC0ReviewMainSender } from './review-c0-authority'
import { assertSafeReviewStorageId } from './review-storage-id'
import {
  archiveT08ReportV3, exportT08ReportArchiveV3, exportT08ReportV3, getT08ReportArchiveV3,
  getT08ReportPreviewV3, listT08ReportArchivesV3,
  type T08ReportServiceDependencies,
} from './review-v3-report-service'

const AUDIENCES = ['student', 'reviewer', 'organizer'] as const
type PreviewInput = { caseId: string; runId: string; audience: T08Audience }
type ArchiveInput = { caseId: string; reportId: string }

/** 本地桌面仅有申请人版报告能力；这不认证学生身份，也不授予跨用户/校方权限。 */
export function deriveT08LocalReportPrincipal(event: IpcMainInvokeEvent, caseId: string): Principal {
  assertC0ReviewMainSender(event)
  assertSafeReviewStorageId(caseId, 'caseId')
  return {
    principalId: 'local-device-report-reader', source: 'local', role: 'student',
    sessionId: `local-main-webcontents:${event.sender.id}`, assurance: 'local-device',
    scope: { caseIds: [caseId], actions: ['report:read:student'] },
  }
}

/** 只有已核验、绑定到单案的 Agent 指派才能生成申请人版归档；绝无校方角色继承。 */
export function deriveT08AssignedLocalReportPrincipal(assignmentId: string, caseId: string): Principal {
  assertSafeReviewStorageId(caseId, 'caseId')
  if (typeof assignmentId !== 'string' || !assignmentId.trim()) throw new Error('REPORT_ACCESS_DENIED：缺少受控指派')
  return {
    principalId: 'local-assignment:' + assignmentId, source: 'local', role: 'student',
    sessionId: 'agent-assignment:' + assignmentId, assurance: 'local-device',
    scope: { caseIds: [caseId], actions: ['report:read:student'] },
  }
}

/**
 * 将来接入学校身份时，由可信 Main SchoolPort 注入经过真实会话校验的 Principal。
 * Renderer、受众下拉框、Agent role、CAS 登录成功本身都不能构造 verified-school。
 * credentialReference 是 Main 内部证据引用，不能接受前端传入的同名字段。
 */
export function mayReadT08Audience(principal: Principal | null | undefined, caseId: string, audience: T08Audience): boolean {
  if (!principal || typeof caseId !== 'string' || !caseId.trim() || !AUDIENCES.includes(audience) ||
    !principal.principalId?.trim() || !principal.sessionId?.trim() ||
    !Array.isArray(principal.scope?.caseIds) || !principal.scope.caseIds.includes(caseId) ||
    !Array.isArray(principal.scope?.actions) || !principal.scope.actions.includes('report:read:' + audience)) return false

  if (audience === 'student') {
    return (principal.source === 'local' && principal.assurance === 'local-device' && principal.role === 'student') ||
      (principal.source === 'school' && principal.assurance === 'verified-school' && !!principal.credentialReference?.trim())
  }
  if (principal.source !== 'school' || principal.assurance !== 'verified-school' ||
    !principal.credentialReference?.trim()) return false
  if (audience === 'reviewer') return principal.role === 'reviewer' || principal.role === 'teacher' || principal.role === 'school-admin'
  return principal.role === 'school-admin'
}

export function accessibleT08Audiences(principal: Principal | null | undefined, caseId: string): T08Audience[] {
  assertSafeReviewStorageId(caseId, 'caseId')
  return AUDIENCES.filter((audience) => mayReadT08Audience(principal, caseId, audience))
}

export function assertT08AudienceAccess(principal: Principal | null | undefined, caseId: string, audience: T08Audience): void {
  assertSafeReviewStorageId(caseId, 'caseId')
  if (!mayReadT08Audience(principal, caseId, audience)) {
    throw new Error('REPORT_ACCESS_DENIED：当前会话无权读取此案卷的' + audience + '报告')
  }
}

function assertCaseReportAccess(principal: Principal | null | undefined, caseId: string): void {
  if (!accessibleT08Audiences(principal, caseId).length) {
    throw new Error('REPORT_ACCESS_DENIED：当前会话无权列举此案卷报告')
  }
}

export function getAuthorizedT08ReportPreviewV3(principal: Principal, input: PreviewInput) {
  assertT08AudienceAccess(principal, input?.caseId, input?.audience)
  return getT08ReportPreviewV3(input)
}

export function listAuthorizedT08ReportArchivesV3(principal: Principal, caseId: string, rootDir?: string): T08ReportArchiveSummary[] {
  assertCaseReportAccess(principal, caseId)
  // 不向申请人透露内部档案的存在、元数据、绝对路径或归档完整性错误。
  return listT08ReportArchivesV3(caseId, rootDir).filter((item) => item.valid && mayReadT08Audience(principal, caseId, item.audience))
}

export function getAuthorizedT08ReportArchiveV3(principal: Principal, input: ArchiveInput, rootDir?: string) {
  assertCaseReportAccess(principal, input?.caseId)
  const snapshot = getT08ReportArchiveV3(input, rootDir)
  assertT08AudienceAccess(principal, input.caseId, snapshot.audience)
  return snapshot
}

export async function exportAuthorizedT08ReportV3(
  principal: Principal, input: PreviewInput & { format: T08ReportExportFormat; expectedProjectionHash: string },
  dependencies?: T08ReportServiceDependencies,
) {
  assertT08AudienceAccess(principal, input?.caseId, input?.audience)
  // 默认报告服务的历史 local-reviewer 落款不得被套用到新申请人版快照。
  return exportT08ReportV3(input, {
    ...dependencies,
    createdBy: {
      actorId: principal.principalId,
      actorSource: principal.source === 'school' ? 'school' : 'local',
      role: principal.role,
    },
  })
}

export async function exportAuthorizedT08ReportArchiveV3(
  principal: Principal, input: ArchiveInput & { format: T08ReportExportFormat },
  dependencies?: T08ReportServiceDependencies,
) {
  // 必须在打开系统保存对话框、写回执或写外部文件之前校验历史快照自己的受众。
  getAuthorizedT08ReportArchiveV3(principal, input, dependencies?.rootDir)
  return exportT08ReportArchiveV3(input, dependencies)
}

export function archiveAuthorizedT08ReportV3(
  principal: Principal, input: PreviewInput, dependencies?: T08ReportServiceDependencies,
) {
  assertT08AudienceAccess(principal, input?.caseId, input?.audience)
  return archiveT08ReportV3(input, dependencies)
}
