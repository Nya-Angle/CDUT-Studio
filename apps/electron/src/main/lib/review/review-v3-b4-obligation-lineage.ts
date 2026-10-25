/**
 * B4 technical candidate lineage validator. This is intentionally incapable of
 * approving policies, independent Gold, or a formal Review V3 Plan.
 *
 * Verification covers the original D4 frozen Git blob -> workspace task ->
 * sourceBinding -> source locator chain. It does NOT verify that an archived
 * Markdown obligation equals current school rules, nor claim author/publisher ACL.
 */
export interface B4ArchiveSource {
  sourceId: string
  sourceKind: string
  documentVersionId: string | null
  locator: string | null
  verification: string
  sourceApplicability: string
}
export interface B4ArchiveCheck {
  checkId: string
  taskId: string | null
  taskTitle: string | null
  module: string | null
  origin: string
  bindingState: string
  sourceIds: string[]
  sources: B4ArchiveSource[]
  genericScope: unknown
  caseScopeJustification: string | null
  applicabilityNote: string | null
  publicationAllowed: false
  policyApproval: 'NOT_VERIFIED'
  goldStatus: 'NOT_AUTHORIZED_OR_NOT_RUN'
}
export interface B4ArchiveTemplate {
  templateId: string
  templateVersion: number
  workspacePath: string
  workspaceGitBlobSha: string
  gitBlobObserved: string
  sourceVersion: string
  sourceSha256: string
  manifestPath: string
  historicalIntegrationStatus: string
  publication: 'candidate-held'
  obligationCount: number
  workspacesBindings: number
  expectedTasks: number
  obligations: B4ArchiveCheck[]
}
export interface B4Archive {
  schemaVersion: 'review-v3-b4-obligation-archive/1'
  frozenSourceGitSha: string
  domain: string
  templateCount: number
  technicalState: 'UNREVIEWED_EXTRACT'
  publicationAllowed: false
  policyApproval: 'NOT_VERIFIED'
  independentGold: 'NOT_AUTHORIZED_OR_NOT_RUN'
  issues: { unbound: number; missingSources: number; orphan: number; shaMismatch: number; other: number }
  templates: B4ArchiveTemplate[]
}
export interface B4TechnicalResult {
  domain: string
  frozenSourceGitSha: string
  templateCount: number
  workspaceChecks: number
  workspaceBound: number
  unscopedChecks: number
  unknownApplicability: number
  policyValidated: 0
  goldValidated: 0
  publicationAllowed: false
  technicalLineage: 'WORKSPACE_TRACEABLE_NOT_POLICY_VERIFIED'
}
const sha40 = /^[a-f0-9]{40}$/
const sha64 = /^[a-f0-9]{64}$/
const deny = (reason:string):never => {throw new Error('B4_LINEAGE_'+reason)}
const isObject=(v:unknown):v is Record<string,unknown> =>
  !!v&&typeof v==='object'&&!Array.isArray(v)
const safe=(v:unknown):v is string=>typeof v==='string'&&v.trim().length>0

/** Requires every archived D4 Check to be task-matched and have source IDs.
 * Unresolved business object scopes remain in the result; never auto-promote.
 */
export function validateB4TechnicalArchive(data:unknown): B4TechnicalResult {
  // Distinct guards preserve TypeScript's narrowing of untrusted JSON across
  // the full header predicate. No unchecked B4 cast or policy promotion.
  if(!isObject(data)) throw new Error('B4_LINEAGE_ARCHIVE_HEADER')
  if(!Array.isArray(data.templates)) throw new Error('B4_LINEAGE_ARCHIVE_HEADER')
  if(data.schemaVersion!=='review-v3-b4-obligation-archive/1' ||
    !sha40.test(String(data.frozenSourceGitSha)) || !/^G0[1-8]$/.test(String(data.domain)) ||
    !Array.isArray(data.templates) || data.templates.length!==data.templateCount ||
    data.technicalState!=='UNREVIEWED_EXTRACT' || data.publicationAllowed!==false ||
    data.policyApproval!=='NOT_VERIFIED' || data.independentGold!=='NOT_AUTHORIZED_OR_NOT_RUN' ||
    !isObject(data.issues) ||
    Object.values(data.issues).some(v=>v!==0)) deny('ARCHIVE_HEADER')
  let total=0,unscoped=0,unknown=0
  const templateIds=new Set<string>()
  for(const template of data.templates){
    if(!isObject(template) || !safe(template.templateId) ||
       templateIds.has(template.templateId) || !Number.isSafeInteger(template.templateVersion) ||
       template.publication!=='candidate-held' ||
       !sha40.test(String(template.workspaceGitBlobSha)) ||
       template.gitBlobObserved!==template.workspaceGitBlobSha ||
       !sha64.test(String(template.sourceSha256)) ||
       !safe(template.workspacePath)||!safe(template.manifestPath)||!safe(template.sourceVersion) ||
       !Array.isArray(template.obligations) ||
       template.obligations.length!==template.obligationCount ||
       template.workspacesBindings!==template.obligationCount ||
       template.expectedTasks!==template.obligationCount) deny('TEMPLATE_LINEAGE')
    templateIds.add(template.templateId)
    const ids=new Set<string>()
    const prefix=template.templateId+'@'+String(template.templateVersion)+':'
    for(const row of template.obligations){
      if(!isObject(row)|| !safe(row.checkId)|| !row.checkId.startsWith(prefix) ||
         ids.has(row.checkId)||!safe(row.taskId)||!safe(row.taskTitle)||!safe(row.module)||
         row.bindingState!=='WORKSPACE_BOUND' ||
         !Array.isArray(row.sourceIds)||!row.sourceIds.length||
         !Array.isArray(row.sources)||row.sourceIds.length!==row.sources.length ||
         row.publicationAllowed!==false||row.policyApproval!=='NOT_VERIFIED'||
         row.goldStatus!=='NOT_AUTHORIZED_OR_NOT_RUN') deny('CHECK_LINEAGE')
      ids.add(row.checkId);total++
      const sources=new Set<string>()
      for(let s=0;s<row.sources.length;s++){
        const source=row.sources[s]
        if(!isObject(source) || !safe(source.sourceId) || source.sourceId!==row.sourceIds[s] ||
           sources.has(source.sourceId) || source.sourceKind==='missing' ||
           !safe(source.documentVersionId)||!safe(source.locator) ||
           !safe(source.verification)||!safe(source.sourceApplicability)) deny('SOURCE_LINEAGE')
        sources.add(source.sourceId)
        if(source.sourceApplicability==='unknown')unknown++
      }
      if(!row.genericScope&&!row.caseScopeJustification)unscoped++
    }
  }
  return {
    domain:data.domain as string,frozenSourceGitSha:data.frozenSourceGitSha as string,
    templateCount:templateIds.size,workspaceChecks:total,workspaceBound:total,
    unscopedChecks:unscoped,unknownApplicability:unknown,
    policyValidated:0,goldValidated:0,publicationAllowed:false,
    technicalLineage:'WORKSPACE_TRACEABLE_NOT_POLICY_VERIFIED',
  }
}
export function sumB4Technical(results:B4TechnicalResult[]) {
  const domains=new Set<string>()
  let templates=0,checks=0,unscoped=0,unknown=0
  for(const r of results){
    if(domains.has(r.domain)||r.publicationAllowed!==false||r.policyValidated!==0||
      r.goldValidated!==0||r.technicalLineage!=='WORKSPACE_TRACEABLE_NOT_POLICY_VERIFIED') deny('AGGREGATE')
    domains.add(r.domain);templates+=r.templateCount
    checks+=r.workspaceChecks;unscoped+=r.unscopedChecks;unknown+=r.unknownApplicability
  }
  return {domains:domains.size,templates,checks,unscoped,unknown,
    candidateOnly:true as const,policyPublicationAllowed:false as const}
}
