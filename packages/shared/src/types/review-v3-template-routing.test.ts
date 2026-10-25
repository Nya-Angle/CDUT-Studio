import { describe, expect, test } from 'bun:test'
import {
  createGenericModelDeepMatcher, filterTemplateCatalog, parseTemplateDeepMatchResponse,
  rankTemplateCandidates, reviewV3MaterialFileKind, reviewV3SlotAcceptsFile, type TemplateRouteCatalogEntry,
} from './review-v3-template-routing'

const catalog: TemplateRouteCatalogEntry[] = [
  { templateId: 'student-status', templateVersion: '2', name: '学籍信息更正', aliases: ['学籍修改'], keywords: ['学籍', '身份信息', '更正', '修改'] },
  { templateId: 'campus-mail', templateVersion: '1', name: '公共邮箱开通', aliases: ['部门邮箱'], keywords: ['公共邮箱', '部门邮箱', '开通', '授权'] },
  { templateId: 'held-template', templateVersion: '1', name: '候选模板', availability: 'candidate-held', keywords: ['候选', '模板'] },
]

describe('Review V3 template matching and deep-match contract', () => {
  test('exact explicit declaration wins over weaker keyword candidates', () => {
    const matches = rankTemplateCandidates('申请事项：学籍信息更正\n申请人需要提交身份信息', catalog)
    expect(matches).toHaveLength(1)
    expect(matches[0]).toMatchObject({ templateId: 'student-status', tier: 'exact', confidence: 1 })
  })

  test('keyword layer returns ranked candidates with explainable signals', () => {
    const matches = rankTemplateCandidates('公共邮箱需要开通，后续授权由部门管理员确认。', catalog)
    expect(matches[0]?.templateId).toBe('campus-mail')
    expect(matches[0]?.tier).toBe('keyword')
    expect(matches[0]?.matchedSignals.length).toBeGreaterThanOrEqual(2)
    expect(matches[0]?.reason).toContain('业务关键词命中')
  })

  test('generic form fields alone do not create a false business match', () => {
    const matches = rankTemplateCandidates('学生姓名、学号、班级、联系电话', catalog)
    expect(matches).toHaveLength(0)
  })

  test('search includes keywords and aliases and ranks title/ID ahead of keyword hits', () => {
    const matches = filterTemplateCatalog(catalog, '部门邮箱')
    expect(matches.map(item => item.templateId)).toContain('campus-mail')
    expect(filterTemplateCatalog(catalog, 'student-status')[0]?.templateId).toBe('student-status')
  })

  test('deep matcher ignores hallucinated and held template identifiers', () => {
    const result = parseTemplateDeepMatchResponse(JSON.stringify({
      scope: 'matched',
      matches: [
        { templateId: 'not-in-catalog', templateVersion: '1', confidence: 1, reason: 'invented' },
        { templateId: 'held-template', templateVersion: '1', confidence: 1, reason: 'held' },
        { templateId: 'campus-mail', templateVersion: '1', confidence: 0.88, reason: '业务对象与动作一致' },
      ],
      reason: 'test',
    }), catalog)
    expect(result.scope).toBe('matched')
    expect(result.matches).toEqual([{ templateId: 'campus-mail', templateVersion: '1', confidence: 0.88, reason: '业务对象与动作一致' }])
  })

  test('out-of-scope is explicit; missing or uncertain model response is not treated as unsupported', () => {
    expect(parseTemplateDeepMatchResponse('{"scope":"out-of-scope","matches":[]}', catalog).scope).toBe('out-of-scope')
    expect(parseTemplateDeepMatchResponse('{"scope":"uncertain","matches":[]}', catalog).scope).toBe('uncertain')
  })

  test('generic model port returns the same contract that a future JEV adapter must implement', async () => {
    const port = createGenericModelDeepMatcher(async () => JSON.stringify({
      scope: 'matched',
      matches: [{ templateId: 'campus-mail', templateVersion: '1', confidence: 0.9, reason: '邮箱办理' }],
      reason: 'only matching item',
    }))
    expect(port.provider).toBe('generic-model')
    const result = await port.match({ caseEvidence: '部门邮箱开通', templates: catalog })
    expect(result.matches[0]?.templateId).toBe('campus-mail')
  })
})

describe('Review V3 template material kinds',()=>{
  test('identifies common uploaded file extensions (not backslash paths only)',()=>{
    expect(reviewV3MaterialFileKind('证明.pdf')).toBe('pdf')
    expect(reviewV3MaterialFileKind('附件.JPG')).toBe('image')
    expect(reviewV3MaterialFileKind('综测成绩.xlsx')).toBe('sheet')
    expect(reviewV3MaterialFileKind('申请.docx')).toBe('office')
    expect(reviewV3MaterialFileKind('说明.md')).toBe('text')
    expect(reviewV3MaterialFileKind('无扩展名')).toBeUndefined()
  })
  test('rejects incompatible material from a restricted template slot',()=>{
    const slot={acceptedKinds:['sheet'] as Array<'sheet'>}
    expect(reviewV3SlotAcceptsFile(slot,'申请.docx')).toBe(false)
    expect(reviewV3SlotAcceptsFile(slot,'明细.xlsx')).toBe(true)
  })
})
