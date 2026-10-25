import {describe,expect,test} from 'bun:test'
import JSZip from 'jszip'
import {validateTemplate} from '../../../main/lib/review/template-store'
import {T01_STANDARD_EXAMPLES,createT01ExamplePack,exampleT01PackFiles,checkT01ExampleForm} from './review-v3-t01-example-packs'
import { readT01NumberLimit } from './review-v3-t01-typed-criteria'

describe('T01 six physical acceptance packs',()=>{
  test('all six contain uploadable text originals with distinct outcomes and no forged authority',()=>{
    expect(T01_STANDARD_EXAMPLES).toHaveLength(6)
    for(const id of T01_STANDARD_EXAMPLES){
      const pack=createT01ExamplePack(id)
      expect(validateTemplate(pack.template).filter(x=>x.level==='error')).toEqual([])
      expect(pack.template.status).toBe('draft')
      expect(pack.template.policyVersionIds).toEqual([])
      expect(pack.policyText).toContain('虚构')
      expect(pack.cases.map(c=>c.id)).toEqual(['conforming','violating','missing'])
      expect(checkT01ExampleForm(pack,pack.cases[0]!).status).toBe('ready-for-human-review')
      expect(checkT01ExampleForm(pack,pack.cases[2]!).status).toBe('incomplete')
      expect(pack.cases[0]?.documents.length).toBe(2)
      expect(pack.cases[2]?.documents.length).toBe(1)
      const files=exampleT01PackFiles(id)
      expect(files.some(f=>f.path==='SIMULATED-POLICY.md')).toBe(true)
      expect(files.some(f=>f.path==='template-draft.json')).toBe(true)
      expect(files.some(f=>f.path==='expectations.json')).toBe(true)
      expect(files.filter(f=>f.path.endsWith('.md')).length).toBeGreaterThanOrEqual(6)
      expect(new Set(files.map(f=>f.path)).size).toBe(files.length)
      for(const file of files)expect(new TextEncoder().encode(file.content).length).toBeGreaterThan(0)
    }
  })
  test('ZIP has actual parseable file bytes and expected manifest references',async()=>{
    const zip=new JSZip()
    for(const file of exampleT01PackFiles('expense'))zip.file(file.path,file.content)
    const data=await zip.generateAsync({type:'uint8array'})
    const archive=await JSZip.loadAsync(data)
    const manifest=JSON.parse(await archive.file('expectations.json')!.async('string')) as Array<{id:string;documents:Array<{path:string}>}>
    expect(manifest).toHaveLength(3)
    for(const entry of manifest)for(const document of entry.documents){
      expect((await archive.file(document.path)!.async('string')).length).toBeGreaterThan(20)
    }
    expect(await archive.file('SIMULATED-POLICY.md')!.async('string')).toContain('虚构')
  })
  test('虚构门槛在模板草稿中是真正待确认的规则，不是限制违规案卷录入的表单 max',()=>{
    const expected = [
      ['activity','participants','lte',40], ['activity','budget','lte',5000],
      ['scholarship','grade','gte',80], ['expense','amount','lte',1000],
    ] as const
    for (const [scenario, fieldKey, operator, threshold] of expected) {
      const template=createT01ExamplePack(scenario).template
      const rule=template.sections?.flatMap(section=>section.criteria)
        .map(criterion=>readT01NumberLimit(criterion)).find(constraint=>constraint?.fieldKey===fieldKey)
      expect(rule).toMatchObject({fieldKey,operator,threshold})
      expect(rule?.ownerStatement).toBeUndefined()
      expect(template.fields.find(field=>field.key===fieldKey)?.max).toBeUndefined()
    }
  })
})
