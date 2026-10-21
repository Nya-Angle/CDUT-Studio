/** Main window is transport provenance, never a teacher or school credential. */
import type { IpcMainInvokeEvent } from 'electron'
import { createHash } from 'node:crypto'
import {
  REVIEW_C0_SCHEMA_VERSION, C0ContractError, assertC0CaseAuthorization,
  type AuthorizedCaseCommand, type C0CaseAction, type Principal, type Actor,
} from '@profer/shared'
import { assertMainWindowSender } from '../ipc-sender-guard'
import { getMainWindow } from '../main-window-state'
import { assertSafeReviewStorageId } from './review-storage-id'

const COMMAND_TYPE: Record<C0CaseAction, string> = {
  CREATE_CASE_V2: 'CreateCaseFromTemplate',
  UPDATE_FIELDS_V2: 'UpdateFields',
  CORRECT_OBSERVATION_V2: 'CorrectObservation',
  SET_EVIDENCE_LINK_V2: 'SetEvidenceLink',
}

/** The same trusted Main frame rule covers V3 native and old compatibility IPC. */
export function assertC0ReviewMainSender(event: IpcMainInvokeEvent): void {
  try { assertMainWindowSender(event, getMainWindow) }
  catch { throw new C0ContractError('SENDER_UNTRUSTED', 'Not the live main window') }
  if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame) {
    throw new C0ContractError('SENDER_UNTRUSTED', 'Main frame required')
  }
}

export function deriveC0LocalPrincipal(
  event: IpcMainInvokeEvent,
  caseId: string,
  action: C0CaseAction,
): Principal {
  assertSafeReviewStorageId(caseId, 'caseId')
  assertC0ReviewMainSender(event)
  return {
    principalId: 'local-reviewer',
    source: 'local',
    role: 'reviewer',
    sessionId: `local-main-webcontents:${event.sender.id}`,
    assurance: 'local-device',
    scope: { caseIds: [caseId], actions: [action] },
  }
}

function assertRendererActorIsLegacyLocal(intent: Record<string, unknown>): void {
  if (!Object.prototype.hasOwnProperty.call(intent, 'actor')) return
  const actor = intent.actor
  if (!actor || typeof actor !== 'object' || Array.isArray(actor)) {
    throw new C0ContractError('ACTOR_UNTRUSTED', 'Renderer Actor is not a credential')
  }
  const claim = actor as Record<string, unknown>
  if (claim.actorSource !== 'local' || claim.role !== 'reviewer') {
    throw new C0ContractError('ACTOR_UNTRUSTED', 'School/teacher/system Actor must not come from Renderer')
  }
}

/** Used by all four real Main IPC writes; ignores even a local claimed actorId. */
export function bindC0LocalCaseCommand<T>(
  event: IpcMainInvokeEvent,
  caseId: string,
  action: C0CaseAction,
  unknownIntent: unknown,
): AuthorizedCaseCommand<T> {
  const principal = deriveC0LocalPrincipal(event, caseId, action)
  if (!unknownIntent || typeof unknownIntent !== 'object' || Array.isArray(unknownIntent)) {
    throw new C0ContractError('CONTRACT_INVALID', 'Missing case command')
  }
  const intent = unknownIntent as Record<string, unknown>
  assertRendererActorIsLegacyLocal(intent)
  if ('caseId' in intent && intent.caseId !== caseId) {
    throw new C0ContractError('CASE_SCOPE_FORBIDDEN', 'Nested caseId mismatch')
  }
  const requestId = intent.requestId
  const revision = intent.expectedRevision
  if (typeof requestId !== 'string' || !requestId.trim() ||
    (typeof revision !== 'number' || !Number.isSafeInteger(revision) || revision < 0) || intent.payload === undefined) {
    throw new C0ContractError('CONTRACT_INVALID', 'Missing request/revision/payload')
  }
  const hash = createHash('sha256')
    .update(`${COMMAND_TYPE[action]}|${JSON.stringify(intent.payload)}`, 'utf8')
    .digest('hex')
  if (intent.payloadHash !== undefined && intent.payloadHash !== hash) {
    throw new C0ContractError('CONTRACT_INVALID', 'Payload hash mismatch')
  }
  const command: AuthorizedCaseCommand<T> = {
    schemaVersion: REVIEW_C0_SCHEMA_VERSION, caseId,
    requestId, expectedRevision: Number(revision), payloadHash: hash,
    payload: intent.payload as T, principal,
  }
  assertC0CaseAuthorization(command, action)
  return command
}

/** Existing create-case V2 has an implicit revision=0 and deterministic ID. */
export function bindC0LocalCreateIntent(
  event: IpcMainInvokeEvent,
  input: { caseId: string; payload: unknown; actor?: Actor; requestId?: string; expectedRevision?: number },
): AuthorizedCaseCommand<unknown> {
  const caseId = input?.caseId
  assertSafeReviewStorageId(caseId, 'caseId')
  if (input.expectedRevision !== undefined && input.expectedRevision !== 0) {
    throw new C0ContractError('REVISION_CONFLICT', 'New case starts at revision 0')
  }
  if (input.requestId !== undefined && input.requestId !== `create-${caseId}`) {
    throw new C0ContractError('CONTRACT_INVALID', 'Legacy CreateCaseV2 requestId must be deterministic')
  }
  return bindC0LocalCaseCommand(event, caseId, 'CREATE_CASE_V2', {
    requestId: `create-${caseId}`, expectedRevision: 0,
    payload: input.payload,
    ...(Object.prototype.hasOwnProperty.call(input, 'actor') ? { actor: input.actor } : {}),
  })
}
