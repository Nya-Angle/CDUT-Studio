import { describe,expect,test } from 'bun:test'
import {createT01Scenario} from './review-v3-t01-business-presets'
import {exportT01Template,importT01Template} from './review-v3-t01-template-portability'

describe('T01 exported configuration',()=>{
  const source=()=>createT01Scenario('laboratory','original-template','2026-10-21T00:00:00.000Z')
  test('exported data imports as a new independently editable draft',()=>{
    const original=source()
    const text=exportT01Template(original)
    const clone=importT01Template(text,'copy-template','2026-10-22T00:00:00.000Z')
    expect(clone.templateId).toBe('copy-template')
    expect(clone.status).toBe('draft')
    expect(clone.version).toBe(1)
    expect(clone.fields).toEqual(original.fields)
    expect(clone.materialSlots).toEqual(original.materialSlots)
    expect(clone.stages).toEqual(original.stages)
    expect(clone.rubric).toBeUndefined()
  })
  test('cannot import arbitrary JSON or a case report as template',()=>{
    expect(()=>importT01Template('{}','bad','2026-10-22T00:00:00.000Z')).toThrow('T01_IMPORT_FORMAT')
    expect(()=>importT01Template(JSON.stringify({format:'review-t01-template/1',template:{name:'not template'}}),'bad','2026-10-22T00:00:00.000Z')).toThrow('T01_IMPORT_TEMPLATE_INVALID')
  })
  test('published-looking imported records are downgraded to drafts',()=>{
    const original={...source(),status:'published' as const,publishedAt:'2026-10-21T01:00:00.000Z'}
    const clone=importT01Template(exportT01Template(original),'safe','2026-10-22T00:00:00.000Z')
    expect(clone.status).toBe('draft')
    expect(clone.publishedAt).toBeUndefined()
    expect(clone.sourceNote).toContain('外部导入草稿')
  })
})
