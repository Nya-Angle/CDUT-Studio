/**
 * F18：可替换 SchoolPort 的能力协商与字段/状态映射。
 * 学校没有授权的 API 不能被模拟成真实接口；未知数据绝不推断为通过或 0 分。
 */
import type { ExternalCaseSnapshot, SchoolPort, SchoolReadPort } from './external-ports'

export interface IntegrationProfile {
  id: string
  /** school 表示真实业务阶段由外部系统主持，本地只能提交待确认建议。 */
  workflowOwner: 'local' | 'school'
  /** 规范字段 → 外部系统字段；不在映射中的字段保持 unknown。 */
  fieldMapping: Record<string, string>
  /** 规范业务状态 → 实际外部状态值。未知状态不能默认为完成。 */
  statusMapping: Record<string, string>
}

export interface SchoolPortActionPlan {
  source: SchoolPort['kind']
  mode: 'local-decision' | 'offline-handoff' | 'proposal-awaiting-receipt' | 'unavailable'
  canFetchCase: boolean
  canReadTasks: boolean
  canVerify: boolean
  canClaimSchoolIdentity: boolean
  explanation: string
}

function hasReadCapabilities(port: SchoolPort): port is SchoolReadPort {
  return typeof (port as Partial<SchoolReadPort>).capabilities === 'function'
}

/** UI/工作流使用同一决策：能力缺失即禁用，不将本地/Mock 身份升级为学校身份。 */
export function negotiateSchoolPort(port: SchoolPort, profile: IntegrationProfile): SchoolPortActionPlan {
  const capability = hasReadCapabilities(port) ? port.capabilities() : undefined
  const realAuthenticatedIdentity = port.kind === 'school' && capability?.identity === true
  const base = {
    source: port.kind,
    canFetchCase: Boolean(capability && typeof (port as SchoolReadPort).fetchCase === 'function'),
    canReadTasks: Boolean(capability?.tasks),
    canVerify: Boolean(capability?.verification),
    canClaimSchoolIdentity: realAuthenticatedIdentity,
  }
  if (port.kind === 'offline-package') return {
    ...base, mode: 'offline-handoff', explanation: '仅生成离线交接包；收到独立回执前不能宣称业务已受理',
  }
  if (profile.workflowOwner === 'local') return {
    ...base, mode: 'local-decision', explanation: '本地业务决定仍走现有案卷命令；外部数据仅作授权范围内的参考',
  }
  if (!capability?.push || (port.kind === 'school' && !realAuthenticatedIdentity)) return {
    ...base, mode: 'unavailable', explanation: '外部流程拥有审批权，但写入或可信身份能力尚未获得授权',
  }
  return {
    ...base, mode: 'proposal-awaiting-receipt',
    explanation: port.kind === 'mock'
      ? '模拟端口只能演练建议与回执，不构成学校正式审批'
      : '只能提交业务建议并等待外部回执，不在本地直接推进校方阶段',
  }
}

export type MappedField = { state: 'available'; value: unknown; externalKey: string } | { state: 'unknown'; reason: string }
export interface MappedExternalCase {
  caseId: string
  externalId: string
  revision: number
  source: ExternalCaseSnapshot['source']
  fields: Record<string, MappedField>
  unmappedExternalKeys: string[]
}

/** 将已收到的字段显式映射；缺字段/undefined 不补假成绩、不制造默认事实。 */
export function mapExternalCase(snapshot: ExternalCaseSnapshot, profile: IntegrationProfile,
  canonicalFields: string[]): MappedExternalCase {
  const fields: Record<string, MappedField> = {}
  const consumed = new Set<string>()
  for (const canonicalKey of canonicalFields) {
    const externalKey = profile.fieldMapping[canonicalKey]
    if (externalKey && Object.prototype.hasOwnProperty.call(snapshot.fields, externalKey) &&
      snapshot.fields[externalKey] !== undefined && snapshot.fields[externalKey] !== null) {
      fields[canonicalKey] = { state: 'available', value: snapshot.fields[externalKey], externalKey }
      consumed.add(externalKey)
    } else {
      fields[canonicalKey] = { state: 'unknown', reason: externalKey ? '外部接口未返回该字段' : '尚未配置字段映射' }
    }
  }
  return {
    caseId: snapshot.caseId, externalId: snapshot.externalId, revision: snapshot.revision,
    source: snapshot.source, fields,
    unmappedExternalKeys: Object.keys(snapshot.fields).filter((key) => !consumed.has(key)),
  }
}

/** 未配置过的校方状态原样保留并标未知，不能强行映射为本地 approved。 */
export function mapExternalStatus(status: string, profile: IntegrationProfile):
  { state: 'mapped'; canonical: string } | { state: 'unknown'; external: string } {
  const found = Object.entries(profile.statusMapping).find(([, external]) => external === status)
  return found ? { state: 'mapped', canonical: found[0] } : { state: 'unknown', external: status }
}
