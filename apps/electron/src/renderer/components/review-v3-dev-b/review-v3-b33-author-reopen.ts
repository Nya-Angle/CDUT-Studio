/** R33: create only a pristine B1 ID lookup, never hydrate untrusted stored author. */
import { emptyB1AuthorDocument } from './ReviewV3AuthorWizard'
import { isB1PristineReopenLookup } from './review-v3-author-resume'
import type { B1AuthorDocument } from '../../../main/lib/review/review-template-plan-adapter-v3-b1'
export function prepareB33PristineReopenLookup(templateId:string):B1AuthorDocument{
 if(typeof templateId!=='string'||!/^[A-Za-z][A-Za-z0-9._-]{0,79}$/.test(templateId)||
    templateId==='.'||templateId==='..')
  throw new Error('B_R33_AUTHOR_REOPEN_TEMPLATE_ID_INVALID')
 const blank=emptyB1AuthorDocument()
 const query:B1AuthorDocument={...structuredClone(blank),templateId}
 if(!isB1PristineReopenLookup(query,0,null,blank))
  throw new Error('B_R33_AUTHOR_REOPEN_NOT_PRISTINE')
 return query
}
