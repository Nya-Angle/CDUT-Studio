/**
 * Dev-C C1 native V2 CaseAggregate material retirement.
 * This is an INTERNAL business command, not a new public renderer write IPC.
 * Main must supply trusted Principal before exposing typed intents.
 */
import type { Actor, DocumentVersion, ReviewCommandResult } from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'
import { revokeCurrentSourceValidity } from './source-current-validity-v3'

export interface ArchiveMaterialVersionPayload {
  documentVersionId: string
  reason: string
}

/** Archive a CURRENT version without removing bytes, read receipts or source history. */
export function archiveMaterialVersionV3(
  caseId: string,
  command: { requestId: string; actor: Actor; expectedRevision: number; payload: ArchiveMaterialVersionPayload },
): Promise<ReviewCommandResult<DocumentVersion>> {
  return submitCommand<ArchiveMaterialVersionPayload, DocumentVersion>(caseId,
    { ...command, type: 'ArchiveMaterialVersion' }, (aggregate, payload) => {
      if (aggregate.caseV2.stage === 'archived') {
        throw new CommandValidationError('INVALID_TRANSITION', '已关闭案卷不能操作材料')
      }
      const prior = aggregate.caseV2.documents.find((doc) => doc.versionId === payload.documentVersionId)
      if (!prior) throw new CommandValidationError('NOT_FOUND', '材料版本不存在')
      if (prior.active === false) throw new CommandValidationError('INVALID_TRANSITION', '材料版本已归档')
      if (!payload.reason?.trim()) throw new CommandValidationError('VALIDATION_FAILED', '归档材料必须记录原因')
      return {
        summary: `归档当前材料 ${prior.versionId}：${payload.reason.trim()}`,
        mutate: (draft) => {
          draft.caseV2.documents = draft.caseV2.documents.map((doc) =>
            doc.versionId === prior.versionId ? { ...doc, active: false } : doc)
          revokeCurrentSourceValidity(draft, new Set([prior.versionId]), 'archive')
          return draft.caseV2.documents.find((doc) => doc.versionId === prior.versionId)!
        },
      }
    })
}
