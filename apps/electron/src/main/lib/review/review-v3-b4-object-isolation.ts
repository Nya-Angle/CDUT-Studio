/**
 * B4 R15 technical preview: each Check binds independently to the exact
 * object and subject. This is NOT evidence of permission, policy applicability
 * or a real CurrentCase. Only Main/C can commit authorized decisions.
 */
import {
  compileReviewB1Plan, type B1AuthorDocument,
} from './review-template-plan-adapter-v3-b1'

export interface B4ObjectIsolationBinding {
  checkKey: string
  targetKey: string
  objectKey: string
  subjectId: string
  sourceVersionIds: string[]
  technicalApplicability: 'applicable'|'not-applicable'|'unknown'
  schoolAuthorization: 'NOT_VERIFIED'
  authorizationGranted: false
}
export interface B4CandidateIsolation {
  schemaVersion: 'review-v3-b4-object-isolation/1'
  candidateOnly: true
  publicationAllowed: false
  planFingerprint: string
  checkedTargetKeys: string[]
  bindings: B4ObjectIsolationBinding[]
}

function deny(name:string):never {
  throw new Error('B4_OBJECT_ISOLATION_'+name)
}
/**
 * Require explicit expected Check × target identities. This prevents an author
 * from silently omitting one affected room/person/release action and claiming
 * full coverage from the remaining targets.
 */
export function inspectB4CandidateObjectIsolation(
  draft:B1AuthorDocument,checkKey:string,expectedTargetKeys:readonly string[],
):B4CandidateIsolation{
  if(!draft||draft.status!=='candidate-held'||!draft.templateId?.trim()||
    !/^[A-Za-z][A-Za-z0-9._:/-]{0,127}$/.test(checkKey)||
    !Array.isArray(expectedTargetKeys)||expectedTargetKeys.length<2||
    expectedTargetKeys.some(key=>typeof key!=='string'||!key.trim())||
    new Set(expectedTargetKeys).size!==expectedTargetKeys.length)
    deny('BAD_REQUEST')
  const descriptor=compileReviewB1Plan(draft)
  if(descriptor.publicationAllowed!==false)deny('UNEXPECTED_PUBLICATION')
  const checkBindings=descriptor.bindingDetails.filter(x=>x.checkKey===checkKey)
  if(checkBindings.length!==expectedTargetKeys.length)deny('INCOMPLETE_TARGET_COVERAGE')
  const seen=new Set<string>()
  const byTarget=new Map(checkBindings.map(x=>[x.targetKey,x]))
  const bindings:B4ObjectIsolationBinding[]=[]
  for(const targetKey of expectedTargetKeys){
    const exact=byTarget.get(targetKey)
    if(!exact||seen.has(targetKey))deny('MISSING_TARGET')
    seen.add(targetKey)
    // All three applicability states are only technical, never a school PASS.
    bindings.push({
      checkKey:exact.checkKey,targetKey,objectKey:exact.objectKey,
      subjectId:exact.subjectId,sourceVersionIds:[...exact.sourceVersionIds],
      technicalApplicability:exact.applicability,
      schoolAuthorization:'NOT_VERIFIED',authorizationGranted:false,
    })
  }
  if(seen.size!==byTarget.size || new Set(bindings.map(x=>x.objectKey)).size!==bindings.length ||
    new Set(bindings.map(x=>x.subjectId)).size!==bindings.length)
    deny('CROSS_OBJECT_COLLISION')
  return {
    schemaVersion:'review-v3-b4-object-isolation/1',candidateOnly:true,
    publicationAllowed:false,planFingerprint:descriptor.canonicalPlan.fingerprint,
    checkedTargetKeys:[...expectedTargetKeys],bindings,
  }
}
