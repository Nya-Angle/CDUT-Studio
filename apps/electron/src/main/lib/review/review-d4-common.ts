/** COMMON-01/02: bounded generic-object scenario compilation, no additional agent or DSL. */
import {createHash} from 'node:crypto'
import type {ReviewAuthoringWorkspaceV1,D2ScenarioSelection,D2RuleBinding} from '@profer/shared'
import {previewDemo,type DemoTaskPreview} from './semantic-module-demo'
const sha=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex')
export type GenericEntry={task:DemoTaskPreview;instanceCheckId:string;applicability:D2RuleBinding['applicability']}
export function compileD4Generic(
  workspace:ReviewAuthoringWorkspaceV1,selection:D2ScenarioSelection,
):{entries:GenericEntry[];fingerprint:string}{
  const template=workspace.definitions.templates.find(t=>t.templateId===selection.templateId&&t.version===selection.version)
  if(!template)throw Error('D2_TEMPLATE_MISMATCH')
  const axes=template.genericScenarioAxes
  if(!!template.scenarios?.length!==!!axes)throw Error('D2_GENERIC_AXES_REQUIRED')
  if(!selection.targets.length||selection.targets.length>100||
     selection.targets.some(t=>t.kind!=='generic-object')||
     selection.scenario||selection.scenarios||selection.scenarioObjectKey)
    throw Error('D2_GENERIC_SELECTION_INVALID')
  const sources=new Map(workspace.sources.map(s=>[s.sourceId,s]))
  const links=new Map(workspace.sourceBindings.map(b=>[b.checkId,b]))
  const records=new Map<string,GenericEntry>(),fingerprints:string[]=[]
  const keys=new Set(selection.targets.map(t=>t.objectKey))
  for(const use of template.modules)if(use.objectKey&&!keys.has(use.objectKey))
    throw Error('D2_SCOPE_MISSING: '+use.objectKey)
  function checkSource(id:string,version:string){
    if(!sources.get(id)?.reference?.documentVersionId||
       sources.get(id)!.reference!.documentVersionId!==version)
      throw Error('D2_GENERIC_CONDITION_SOURCE_INVALID: '+id+'/'+version)
  }
  for(const target of selection.targets){
    const branches:Array<{id:string|undefined;app:D2RuleBinding['applicability']}>=[]
    if(axes){
      if(!target.scenario||!axes.primary.includes(target.scenario)||
         target.scenarioSource?.decidedBy!=='reviewer')throw Error('D2_GENERIC_PRIMARY_INVALID')
      checkSource(target.scenarioSource.sourceId,target.scenarioSource.sourceVersionId)
      if(!Array.isArray(target.conditions)||target.conditions.length!==axes.conditions.length||
         new Set(target.conditions.map(c=>c.id)).size!==target.conditions.length||
         target.conditions.some(c=>!axes.conditions.includes(c.id)))
        throw Error('D2_GENERIC_CONDITIONS_INCOMPLETE')
      branches.push({id:target.scenario,app:'applicable'})
      for(const c of target.conditions){
        if(!['applicable','not-applicable','unknown'].includes(c.applicability)||
           c.decidedBy!==(c.applicability==='unknown'?'undetermined':'reviewer'))
          throw Error('D2_GENERIC_CONDITION_DECISION_INVALID')
        checkSource(c.sourceId,c.sourceVersionId)
        branches.push({id:c.id,app:c.applicability})
      }
    }else{
      if(target.scenario||target.scenarioSource||target.conditions?.length)
        throw Error('D2_GENERIC_SCENARIO_UNDECLARED')
      branches.push({id:undefined,app:'applicable'})
    }
    for(const branch of branches){
      const preview=previewDemo({revision:workspace.revision,modules:workspace.definitions.modules,
        templates:workspace.definitions.templates},selection.templateId,selection.version,branch.id)
      if(preview.blocked)throw Error('D2_PREVIEW_BLOCKED: '+preview.issues.join('; '))
      fingerprints.push(sha({object:target.objectKey,branch,preview:preview.fingerprint}))
      for(const task of preview.tasks){
        const link=links.get(selection.templateId+'@'+selection.version+':'+task.checkId)
        if(!link)throw Error('D2_SOURCE_MISSING: '+task.checkId)
        if(task.objectKey&&task.objectKey!==target.objectKey)continue
        if(link.genericScope){
          if(!link.genericScope.businessTypes.includes(target.businessType!))continue
          const instanceCheckId=task.checkId+'#'+target.objectKey
          if(!records.has(instanceCheckId))records.set(instanceCheckId,{
            task:{...task,objectKey:target.objectKey},instanceCheckId,applicability:branch.app})
        }else if(task.objectKey)throw Error('D2_GENERIC_SCOPE_REQUIRED: '+task.checkId)
        else if(link.caseScopeJustification){
          if(!records.has(task.checkId))records.set(task.checkId,{
            task,instanceCheckId:task.checkId,applicability:undefined})
        }else throw Error('D2_GENERIC_UNSCOPED_CHECK: '+task.checkId)
      }
    }
  }
  if(![...records.values()].some(e=>e.task.objectKey))throw Error('D2_GENERIC_ZERO_TASKS')
  return {entries:[...records.values()],fingerprint:sha(fingerprints)}
}
