/**
 * B1 no-code author source-reference edits. All operations return a fresh
 * candidate document and preserve exact Check × target × source connections.
 * They do not publish a template or mutate a CurrentCase.
 */
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'

type Identity = 'source' | 'field' | 'target'
const codeError = (name:string):never => { throw new Error('B1_AUTHOR_EDIT_' + name) }
const validId = (id:string):boolean => /^[A-Za-z][A-Za-z0-9._:/-]{0,127}$/.test(id)

export function renameB1AuthorIdentity(
  original:B1AuthorDocument, type:Identity, from:string, to:string,
):B1AuthorDocument {
  const copy=structuredClone(original)
  if(!validId(to)) codeError('ID_INVALID')
  const entities=type==='source'?copy.sources:type==='field'?copy.fields:copy.targets
  const identity=(entry:any):string=>type==='source'?entry.sourceId:type==='field'?entry.key:entry.targetKey
  if(!entities.some(entity=>identity(entity)===from)) codeError('SOURCE_ID_NOT_FOUND')
  if(to!==from && entities.some(entity=>identity(entity)===to)) codeError('DUPLICATE_ID')
  if(to===from) return copy
  if(type==='source') {
    copy.sources.find(x=>x.sourceId===from)!.sourceId=to
    for(const field of copy.fields)if(field.sourceId===from)field.sourceId=to
    for(const module of copy.modules)for(const check of module.checks)
      check.sourceIds=check.sourceIds.map(id=>id===from?to:id)
  } else if(type==='field') {
    copy.fields.find(x=>x.key===from)!.key=to
    for(const target of copy.targets)if(Object.prototype.hasOwnProperty.call(target.fieldValues,from)){
      target.fieldValues[to]=target.fieldValues[from]!
      delete target.fieldValues[from]
    }
    for(const module of copy.modules)for(const check of module.checks)
      if(check.condition.kind==='field-equals' && check.condition.fieldKey===from)
        check.condition.fieldKey=to
  } else {
    copy.targets.find(x=>x.targetKey===from)!.targetKey=to
    for(const module of copy.modules)for(const check of module.checks)
      check.targetKeys=check.targetKeys.map(id=>id===from?to:id)
  }
  return copy
}

export function deleteB1AuthorIdentity(
  original:B1AuthorDocument, type:Identity, key:string,
):B1AuthorDocument {
  const copy=structuredClone(original)
  if(type==='source') {
    if(!copy.sources.some(x=>x.sourceId===key)) codeError('SOURCE_ID_NOT_FOUND')
    if(copy.fields.some(x=>x.sourceId===key) ||
      copy.modules.some(m=>m.checks.some(c=>c.sourceIds.includes(key))))
      codeError('REFERENCE_IN_USE')
    copy.sources=copy.sources.filter(x=>x.sourceId!==key)
  } else if(type==='field') {
    if(!copy.fields.some(x=>x.key===key)) codeError('SOURCE_ID_NOT_FOUND')
    if(copy.modules.some(m=>m.checks.some(c=>c.condition.kind==='field-equals' &&
      c.condition.fieldKey===key))) codeError('REFERENCE_IN_USE')
    copy.fields=copy.fields.filter(x=>x.key!==key)
    for(const target of copy.targets)delete target.fieldValues[key]
  } else {
    if(!copy.targets.some(x=>x.targetKey===key)) codeError('SOURCE_ID_NOT_FOUND')
    if(copy.modules.some(m=>m.checks.some(c=>c.targetKeys.includes(key))))
      codeError('REFERENCE_IN_USE')
    copy.targets=copy.targets.filter(x=>x.targetKey!==key)
  }
  return copy
}

/**
 * Changing a historical Check key is NOT a harmless label edit. It removes the
 * previous Check identity and adds another. The UI must explicitly confirm it,
 * and the later C-owned UpgradePlan still requires durable removal ACK.
 */
export function renameB1AuthorCheckKey(
  original:B1AuthorDocument,from:string,to:string,
):B1AuthorDocument {
  if(!original||original.schemaVersion!=='review-b1/1'||original.status!=='candidate-held')
    codeError('NOT_CANDIDATE')
  if(!validId(to))codeError('ID_INVALID')
  const next=structuredClone(original)
  const matches=next.modules.flatMap(module=>module.checks).filter(check=>check.checkKey===from)
  if(matches.length!==1)codeError('CHECK_ID_NOT_UNIQUE_OR_MISSING')
  if(from===to)return next
  if(next.modules.some(module=>module.checks.some(check=>check.checkKey===to)))
    codeError('DUPLICATE_CHECK_ID')
  matches[0]!.checkKey=to
  return next
}

export function renameB1TrialKey(
  original:Record<string,Record<string,string|number|boolean|null>>,
  type:'field'|'target',from:string,to:string,
):typeof original {
  const copy=structuredClone(original)
  if(type==='target' && Object.prototype.hasOwnProperty.call(copy,from)){
    copy[to]=copy[from]!
    delete copy[from]
  }
  if(type==='field')for(const values of Object.values(copy))
    if(Object.prototype.hasOwnProperty.call(values,from)){
      values[to]=values[from]!
      delete values[from]
    }
  return copy
}

/** UI guard: snapshot of the actually persisted source, never trial/sample values. */
export function b1AuthorHasUnsavedEdits(
  current:B1AuthorDocument, saved:B1AuthorDocument|null,
):boolean {
  return saved===null || JSON.stringify(current)!==JSON.stringify(saved)
}

/** Allocate a new key after deletions/renames without colliding with older IDs. */
export function nextB1AuthorId(existing:readonly string[],prefix:string):string {
  if(!/^[A-Za-z][A-Za-z0-9._:/-]{0,80}$/.test(prefix)) codeError('ID_INVALID')
  const used=new Set(existing)
  for(let n=1;n<=10000;n++){
    const result=prefix+'-'+n
    if(!used.has(result) && validId(result))return result
  }
  return codeError('ID_SPACE_EXHAUSTED')
}
