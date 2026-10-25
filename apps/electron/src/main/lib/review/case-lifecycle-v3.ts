/**
 * C-owned reversible CurrentCase archive / restore.
 *
 * The existing state.v2.json remains the only business writer. Archive and
 * receipt commit in one CAS transaction; V1 case.json is never removed or
 * treated as a second authoritative Case. Real Main callers must derive Actor
 * from the live Main sender, never from a renderer JSON payload.
 */
import type { Actor, ReviewCommandResult } from '@profer/shared'
import { CommandValidationError, submitCommand } from './case-store-v2'
import { assertSafeReviewStorageId } from './review-storage-id'
import { listRunsV2 } from './run-store-v2'

interface CaseLifecycleCommand {
  requestId: string
  expectedRevision: number
  actor: Actor
  payload: { reason: string }
}
const check = (caseId: string, command: CaseLifecycleCommand): void => {
  assertSafeReviewStorageId(caseId, 'caseId')
  if (!command || typeof command.requestId !== 'string' ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(command.requestId) ||
      !Number.isSafeInteger(command.expectedRevision) || command.expectedRevision < 0 ||
      !command.actor || command.actor.actorSource !== 'local' ||
      command.actor.role !== 'reviewer' ||
      !command.actor.actorId || !command.payload ||
      typeof command.payload.reason !== 'string' ||
      command.payload.reason.trim().length < 2 ||
      command.payload.reason.length > 1000) {
    throw new CommandValidationError('VALIDATION_FAILED', '案卷归档/恢复命令缺少可信人员、修订号或有效理由')
  }
}

/** Performs non-destructive archive; original documents, receipts, runs stay. */
export async function archiveReviewCaseV3(
  caseId: string, command: CaseLifecycleCommand,
): Promise<ReviewCommandResult> {
  check(caseId, command)
  return submitCommand(caseId, { ...command, type: 'ArchiveReviewCaseV3' }, (snapshot) => {
    // Do not hide an in-flight Pi/graph review by making its Case disappear.
    // I/O and host cancellation need C2/C4's eventual shared durable lease.
    const active = listRunsV2(caseId).find(run => run.status === 'running' || run.status === 'queued')
    if (active) {
      throw new CommandValidationError('INVALID_TRANSITION',
        `案卷仍有进行中的审核 ${active.id}，请先停止并完成归档，再移除案卷`)
    }
    if (snapshot.caseV2.stage === 'archived') {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷已经归档')
    }
    if (snapshot.caseArchive && !snapshot.caseArchive.restoredAt) {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷归档账与业务状态矛盾，禁止覆盖')
    }
    return {
      summary: '案卷软归档（保留原件、历史运行与所有业务回执）',
      mutate: draft => {
        if (snapshot.caseArchive?.restoredAt) {
          draft.caseArchiveHistory = [...(snapshot.caseArchiveHistory ?? []), snapshot.caseArchive]
        }
        draft.caseArchive = {
          previousStage: snapshot.caseV2.stage,
          archivedAt: new Date().toISOString(),
          archivedBy: command.actor.actorId,
          reason: command.payload.reason.trim(),
        }
        draft.caseV2.stage = 'archived'
      },
    }
  })
}

/** Explicit restore; never implied by a read or a V1 renderer projection. */
export async function restoreReviewCaseV3(
  caseId: string, command: CaseLifecycleCommand,
): Promise<ReviewCommandResult> {
  check(caseId, command)
  return submitCommand(caseId, { ...command, type: 'RestoreReviewCaseV3' }, (snapshot) => {
    if (snapshot.caseV2.stage !== 'archived' || !snapshot.caseArchive ||
      snapshot.caseArchive.restoredAt || snapshot.caseArchive.previousStage === 'archived') {
      throw new CommandValidationError('INVALID_TRANSITION', '案卷没有可恢复的有效归档检查点')
    }
    return {
      summary: '案卷恢复为草稿阶段（历史运行及决定需要重新核验）',
      mutate: draft => {
        // A restore is never a re-approval. Old Runs and Decisions stay
        // historical; revision bumps invalidate their previous input binding.
        draft.caseV2.stage = 'draft'
        draft.caseArchive = {
          ...snapshot.caseArchive!,
          restoredAt: new Date().toISOString(),
          restoredBy: command.actor.actorId,
          restoreReason: command.payload.reason.trim(),
        }
      },
    }
  })
}
