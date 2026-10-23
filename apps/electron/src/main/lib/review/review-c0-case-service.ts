/** Main-authorized wrapper around the existing V2 Aggregate/CAS/Receipt writer.
 * Does not create a CaseV3 store. Renderer cannot call this without Main IPC.
 */
import {
  assertC0CaseAuthorization, type AuthorizedCaseCommand,
  type Principal, type Actor,
} from '@profer/shared'
import { payloadHash, readAggregate, CommandValidationError } from './case-store-v2'
import { getTemplate } from './template-store'
import {
  createCaseFromTemplate, updateFields, upsertCaseSubject, correctObservation, setEvidenceLink,
  type CreateCasePayload, type UpdateFieldsPayload, type UpsertCaseSubjectPayload,
  type CorrectObservationPayload, type SetEvidenceLinkPayload,
} from './application-service'

function actorOf(principal: Principal): Actor {
  return { actorId: principal.principalId, actorSource: 'local', role: 'reviewer' }
}

export async function createCaseC0(
  command: AuthorizedCaseCommand<CreateCasePayload>,
  templateId: string, version: number,
) {
  assertC0CaseAuthorization(command, 'CREATE_CASE_V2')
  if (command.expectedRevision !== 0 || command.requestId !== `create-${command.caseId}`) {
    throw new CommandValidationError('VALIDATION_FAILED', 'Legacy create identity/revision mismatch')
  }
  if (payloadHash('CreateCaseFromTemplate', command.payload) !== command.payloadHash) {
    throw new CommandValidationError('VALIDATION_FAILED', 'Create payload hash mismatch')
  }
  const replayOrReject = (prior: NonNullable<ReturnType<typeof readAggregate>>) => {
    const receipt = prior.receiptLog.find((r) => r.requestId === command.requestId)
    // The historical V2 receipt hashes only the payload, not the template
    // binding. Enforce both dimensions here: never replay onto another template.
    if (prior.caseV2.templateId === templateId &&
      prior.caseV2.templateVersion === version &&
      receipt?.type === 'CreateCaseFromTemplate' &&
      receipt.payloadHash === command.payloadHash) {
      return { ok: true as const, receipt, aggregate: prior, entity: prior.caseV2 }
    }
    throw new CommandValidationError('REQUEST_ID_COLLISION',
      'REQUEST_ID_COLLISION: case or template already exists with a different create request')
  }
  const prior = readAggregate(command.caseId)
  if (prior) return replayOrReject(prior)
  try {
    return await createCaseFromTemplate(templateId, version, command.payload, actorOf(command.principal), command.caseId)
  } catch (error) {
    // A second identical concurrent create may have passed the first read and
    // lost V2's per-case createAggregate lock. Replay only the *exact* winner;
    // all other failures retain their original fail-closed behavior.
    if (error instanceof CommandValidationError && error.code === 'INVALID_TRANSITION') {
      const winner = readAggregate(command.caseId)
      if (winner) return replayOrReject(winner)
    }
    throw error
  }
}

/**
 * 字段写入的类型权威来自**已发布**模板版本。
 *
 * 此前的实现从不传 template，`updateFields` 便退化成「一律当文本」，
 * 数字、日期等字段被静默当字符串写入——这正是 T08 报告的非 text 字段缺陷。
 *
 * 规则：
 * - 案卷绑定版本的模板存在且已发布 → 用它的 FieldSpec 校验 kind/scope/选项并按类型写入；
 * - 模板存在但未发布 → 拒绝（草稿的字段定义随时会变，不能作为类型权威）；
 * - 完全没有模板记录（历史/合成案卷）→ 保持原有文本回退，避免破坏既有数据。
 */
export function updateFieldsC0(command: AuthorizedCaseCommand<UpdateFieldsPayload>) {
  assertC0CaseAuthorization(command, 'UPDATE_FIELDS_V2')
  const aggregate = readAggregate(command.caseId)
  let template = aggregate
    ? getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
    : undefined
  if (aggregate && template && template.status !== 'published') {
    throw new CommandValidationError('INVALID_TRANSITION',
      '案卷绑定的模板版本尚未发布，字段类型无权威来源，暂不允许写入')
  }
  if (!aggregate) template = undefined
  return updateFields(command.caseId, {
    requestId: command.requestId, expectedRevision: command.expectedRevision,
    payload: command.payload, actor: actorOf(command.principal),
  }, template)
}
export function upsertCaseSubjectC0(command: AuthorizedCaseCommand<UpsertCaseSubjectPayload>) {
  assertC0CaseAuthorization(command, 'UPSERT_CASE_SUBJECT_V2')
  const aggregate = readAggregate(command.caseId)
  if (!aggregate) throw new CommandValidationError('NOT_FOUND', '案卷聚合不存在')
  const template = getTemplate(aggregate.caseV2.templateId, aggregate.caseV2.templateVersion)
  if (!template || template.status !== 'published') {
    throw new CommandValidationError('DEPENDENCY_UNRESOLVED', '案卷绑定的模板不存在或未发布，不能写入申报事项')
  }
  return upsertCaseSubject(command.caseId, {
    requestId: command.requestId, expectedRevision: command.expectedRevision,
    payload: command.payload, actor: actorOf(command.principal),
  }, template)
}

export function correctObservationC0(command: AuthorizedCaseCommand<CorrectObservationPayload>) {
  assertC0CaseAuthorization(command, 'CORRECT_OBSERVATION_V2')
  return correctObservation(command.caseId, {
    requestId: command.requestId, expectedRevision: command.expectedRevision,
    payload: command.payload, actor: actorOf(command.principal),
  })
}
export function setEvidenceLinkC0(command: AuthorizedCaseCommand<SetEvidenceLinkPayload>) {
  assertC0CaseAuthorization(command, 'SET_EVIDENCE_LINK_V2')
  return setEvidenceLink(command.caseId, {
    requestId: command.requestId, expectedRevision: command.expectedRevision,
    payload: command.payload, actor: actorOf(command.principal),
  })
}
