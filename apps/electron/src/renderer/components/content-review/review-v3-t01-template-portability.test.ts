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
  test('TAR-19：导入清空外部 policyVersionIds/policyRefs，不继承本机政策声明',()=>{
    const original={...source(),policyVersionIds:['external-policy'],
      policyRefs:[{policyId:'external-policy',version:3,contentHash:'a'.repeat(64)}]}
    const clone=importT01Template(exportT01Template(original),'policy-cleared','2026-10-22T00:00:00.000Z')
    expect(clone.policyVersionIds).toEqual([])
    expect(clone.policyRefs).toEqual([])
    expect(clone.sourceNote).toContain('政策引用已清空')
  })
  test('TAR-19：导入对字段/分项/数值条件做深层校验，不是只看顶层数组',()=>{
    const brokenField={...source(),fields:[{...source().fields[0]!,kind:'not-a-kind'}]}
    expect(()=>importT01Template(JSON.stringify({format:'review-t01-template/1',template:brokenField}),'bad-field','2026-10-22T00:00:00.000Z'))
      .toThrow('T01_IMPORT_FIELDS_INVALID')
    const base=source()
    const section={id:'decl',name:'申报',order:0,required:true,criteria:[{id:'c1',title:'t',requirement:'',
      execution:'semantic',targetScope:'case'}]}
    const brokenSection={...base,sections:[section]}
    expect(()=>importT01Template(JSON.stringify({format:'review-t01-template/1',template:brokenSection}),'bad-section','2026-10-22T00:00:00.000Z'))
      .toThrow('T01_IMPORT_SECTIONS_INVALID')
    const badConstraint={...base,sections:[{...section,criteria:[{...section.criteria[0]!,requirement:'r',
      execution:'deterministic',deterministicConstraint:{schemaVersion:1,kind:'field-number-limit',fieldKey:'amount',
        fieldScope:'case',operator:'gte',threshold:'ten'}}]}]}
    expect(()=>importT01Template(JSON.stringify({format:'review-t01-template/1',template:badConstraint}),'bad-constraint','2026-10-22T00:00:00.000Z'))
      .toThrow('T01_IMPORT_CRITERIA_INVALID')
    expect(()=>importT01Template('{not json','bad-json','2026-10-22T00:00:00.000Z')).toThrow('T01_IMPORT_JSON')
  })
  test('TAR-19：导入保留数值条件但清空负责人确认，等待本地重新签署',()=>{
    const base=source()
    const section={id:'decl',name:'申报',order:0,required:true,criteria:[{id:'c1',title:'金额上限',requirement:'金额不得超限',
      execution:'deterministic',targetScope:'case',deterministicConstraint:{schemaVersion:1,kind:'field-number-limit',
        fieldKey:'amount',fieldScope:'case',operator:'lte',threshold:100,
        ownerStatement:{kind:'owner-statement',text:'制度依据',enteredBy:'外部作者',enteredAt:'2026-01-01T00:00:00Z'}}}]}
    const clone=importT01Template(JSON.stringify({format:'review-t01-template/1',template:{...base,sections:[section]}}),
      'constraint-kept','2026-10-22T00:00:00.000Z')
    const criterion=clone.sections?.[0]?.criteria[0] as { deterministicConstraint?: { kind?: string; ownerStatement?: unknown } } | undefined
    const constraint=criterion?.deterministicConstraint
    expect(constraint?.kind).toBe('field-number-limit')
    expect(constraint?.ownerStatement).toBeUndefined()
  })
  test('published-looking imported records are downgraded to drafts',()=>{
    const original={...source(),status:'published' as const,publishedAt:'2026-10-21T01:00:00.000Z'}
    const clone=importT01Template(exportT01Template(original),'safe','2026-10-22T00:00:00.000Z')
    expect(clone.status).toBe('draft')
    expect(clone.publishedAt).toBeUndefined()
    expect(clone.sourceNote).toContain('外部导入草稿')
  })
})
