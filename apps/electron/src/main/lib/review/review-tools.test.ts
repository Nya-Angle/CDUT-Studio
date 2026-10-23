/**
 * 审核业务工具集单测（M3：受控写入/确定引擎接线/非法输入拒绝）
 */
import { describe, expect, test } from 'bun:test'
import type { DocumentVersion, ReviewSubject, RuleSpec } from '@profer/shared'
import { buildReviewTools, type ReviewToolContext } from './review-tools'

const context: ReviewToolContext = {
  caseId: 'c1',
  subjects: [{ id: 's1', type: 'item', title: '省赛一等奖', fields: { declaredScore: { kind: 'number', value: 6 }, category: { kind: 'text', value: 'competition' } }, sourceRefs: [], correction: 'ai-extracted', status: 'identified' }],
  documents: [{ documentId: 'd1', versionId: 'd1-v1', fileName: '证书.pdf', role: 'evidence', blocks: [{ blockId: 'b1', text: '省赛一等奖证书 6分；复核记分 3分', kind: 'text', location: { kind: 'paragraph', index: 0 } }], contentHash: 'h', mimeType: 'application/pdf', sizeBytes: 1, assetPath: '', parseRevision: 1, parseStatus: 'parsed', usage: 'read' }],
  rules: [{ id: 'r1', policyVersionId: 'p', title: '竞赛组上限', when: { field: 'category', op: 'eq', value: 'competition' }, requirement: '', targetScope: 'group', execution: 'deterministic', calculation: { valueFrom: 'confirmedLevelScore', aggregate: 'sum', cap: { value: '10.00', unit: 'point' }, allocation: 'score-desc-then-subject-id' }, onFail: 'reject', onUnknown: 'needs-confirmation', sourceRefIds: [], priority: 1, confirmation: 'confirmed' }],
  observations: [],
  evidenceLinks: [],
  results: [],
  actor: 'tester',
} as unknown as ReviewToolContext

const num = (value: number) => ({ kind: 'number' as const, value })

describe('审核业务工具集（M3）', () => {
  test('Given read_subject_field When 缺失字段 Then 返回 unknown 不当空串', async () => {
    const tools = buildReviewTools(context)
    const read = tools.find((tool) => tool.name === 'read_subject_field')!
    const known = await read.execute({ subjectId: 's1', fieldKey: 'declaredScore' })
    expect(known).toEqual({ ok: true, data: { known: true, value: 6, kind: 'number' } })
    const unknown = await read.execute({ subjectId: 's1', fieldKey: 'ghost' })
    expect(unknown).toEqual({ ok: true, data: { known: false, value: null } })
  })

  test('Given search_document_text When 检索 Then 命中块带引用坐标', async () => {
    const tools = buildReviewTools(context)
    const search = tools.find((tool) => tool.name === 'search_document_text')!
    const hits = (await search.execute({ keyword: '省赛一等奖' })) as { ok: true; data: { hits: Array<{ blockId: string }> } }
    expect(hits.data.hits[0]!.blockId).toBe('b1')
  })

  test('案卷材料目录与指定块读取通过能力库返回真实位置', async () => {
    const tools = buildReviewTools(context)
    const listed = await tools.find((tool) => tool.name === 'list_review_documents')!.execute({})
    expect(listed).toMatchObject({ ok: true, data: { documents: [{ documentVersionId: 'd1-v1', fileName: '证书.pdf', textBlockCount: 1 }] } })
    const read = await tools.find((tool) => tool.name === 'read_document')!.execute({ documentVersionId: 'd1-v1', blockIds: ['b1'] })
    expect(read).toMatchObject({ ok: true, data: { blocks: [{ blockId: 'b1', location: { kind: 'paragraph', index: 0 }, text: '省赛一等奖证书 6分；复核记分 3分' }] } })
  })

  test('批量搜索、事实记录和检查提交在一次工具调用中保留逐项校验', async () => {
    const local: ReviewToolContext = {
      ...context,
      subjects: context.subjects.map((subject) => ({ ...subject, fields: { ...subject.fields } })),
      observations: [], evidenceLinks: [], results: [],
      rules: [{ ...context.rules[0]!, execution: 'semantic' }],
    }
    const tools = buildReviewTools(local)
    const search = tools.find((tool) => tool.name === 'search_document_text_batch')!
    const searched = await search.execute({ keywords: ['省赛一等奖', '不存在'] }) as { ok: true; data: { results: Array<{ keyword: string; data?: { hits: Array<{ blockId: string }> } }> } }
    expect(searched.data.results[0]?.data?.hits[0]?.blockId).toBe('b1')
    expect(searched.data.results[1]?.data?.hits).toHaveLength(0)

    const record = tools.find((tool) => tool.name === 'record_observations')!
    const recorded = await record.execute({ observations: [
      { subjectId: 's1', fieldKey: 'confirmedLevelScore', kind: 'number', value: 6, documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书 6分' },
      { subjectId: 'missing', fieldKey: 'confirmedLevelScore', kind: 'number', value: 6, documentVersionId: 'd1-v1', blockId: 'b1' },
    ] }) as { ok: true; data: { results: Array<{ ok: boolean }> } }
    expect(recorded.data.results.map((result) => result.ok)).toEqual([true, false])
    expect(local.observations).toHaveLength(1)

    const submit = tools.find((tool) => tool.name === 'submit_checks')!
    const submitted = await submit.execute({ checks: [
      { ruleId: 'r1', subjectIds: ['s1'], status: 'compliant', reason: '材料支持结论', sourceRefs: [{ documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书' }] },
      { ruleId: 'missing', subjectIds: ['s1'], status: 'awaiting-confirmation', reason: '待确认' },
    ] }) as { ok: true; data: { results: Array<{ ok: boolean }> } }
    expect(submitted.data.results.map((result) => result.ok)).toEqual([true, false])
    expect(local.results).toHaveLength(1)
  })

  test('Given record_observation When AI 提取 Then 受控写入并建立 supersedes 链（后续值可追溯）', async () => {
    const tools = buildReviewTools(context)
    const record = tools.find((tool) => tool.name === 'record_observation')!
    expect((await record.execute({ subjectId: 's1', fieldKey: 'confirmedLevelScore', kind: 'number', value: 6, documentVersionId: 'd1-v1', blockId: 'b1', quote: '不存在的原文' })).ok).toBeFalse()
    const first = await record.execute({ subjectId: 's1', fieldKey: 'confirmedLevelScore', kind: 'number', value: 6, documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书 6分' })
    expect(first.ok).toBeTrue()
    const second = await record.execute({ subjectId: 's1', fieldKey: 'confirmedLevelScore', kind: 'number', value: 3, documentVersionId: 'd1-v1', blockId: 'b1', quote: '复核记分 3分' })
    expect(second.ok).toBeTrue()
    expect(context.observations).toHaveLength(2)
    expect(context.observations[1]!.supersedesObservationId).toBe(context.observations[0]!.id)
  })

  test('案卷级数字字段可以用带原文的材料事实提取并再次读取', async () => {
    const local: ReviewToolContext = {
      ...context,
      fields: [{ key: 'budget', label: '申请经费', kind: 'number', required: false, visibility: 'internal', scope: 'case', unit: '元' }],
      caseFields: {},
      documents: [{ ...context.documents[0]!, blocks: [
        ...context.documents[0]!.blocks,
        { blockId: 'budget-block', text: '申请经费：1,680 元', kind: 'text', location: { kind: 'paragraph', index: 1 } },
      ] }],
      observations: [], evidenceLinks: [], results: [],
    }
    const tools = buildReviewTools(local)
    const record = tools.find((tool) => tool.name === 'record_observation')!
    const recorded = await record.execute({ subjectId: 'c1', fieldKey: 'budget', kind: 'number', value: 1680, documentVersionId: 'd1-v1', blockId: 'budget-block', quote: '申请经费：1,680 元' })
    expect(recorded.ok).toBeTrue()
    expect(local.observations[0]?.subjectId).toBe('c1')
    const read = tools.find((tool) => tool.name === 'read_subject_field')!
    expect(await read.execute({ subjectId: 'c1', fieldKey: 'budget' })).toEqual({ ok: true, data: { known: true, value: 1680, kind: 'number' } })
  })

  test('Agent 不能覆盖确定性规则的程序计算结果', async () => {
    const tools = buildReviewTools(context)
    const submit = tools.find((tool) => tool.name === 'submit_check')!
    context.subjects[0]!.fields.confirmedLevelScore = num(6)
    const outcome = await submit.execute({ ruleId: 'r1', scope: 'group', subjectIds: ['s1'], status: 'compliant', reason: '按确认分计' })
    expect(outcome.ok).toBeFalse()
    expect(context.results).toHaveLength(0)
  })

  test('Given 非法规则/状态 When 提交 Then 如实拒绝（不静默通过）', async () => {
    const tools = buildReviewTools(context)
    const submit = tools.find((tool) => tool.name === 'submit_check')!
    expect((await submit.execute({ ruleId: 'ghost', status: 'compliant' })).ok).toBeFalse()
    expect((await submit.execute({ ruleId: 'r1', status: 'magic-status' })).ok).toBeFalse()
  })

  test('语义规则的通过/不通过结论必须带有效材料块引用', async () => {
    const tools = buildReviewTools({ ...context, rules: [{ ...context.rules[0]!, execution: 'semantic' }] })
    const submit = tools.find((tool) => tool.name === 'submit_check')!
    expect((await submit.execute({ ruleId: 'r1', subjectIds: ['s1'], status: 'compliant', reason: '无引用' })).ok).toBeFalse()
    expect((await submit.execute({ ruleId: 'r1', subjectIds: ['s1'], status: 'compliant', reason: '有引用', sourceRefs: [{ documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书' }] })).ok).toBeTrue()
  })

  test('未完整读取规则材料时拒绝确定结论，读完后允许带引用提交', async () => {
    const policyDoc = {
      ...context.documents[0]!, documentId: 'policy', versionId: 'policy-v1', fileName: 'rules.md', role: 'rule' as const,
      blocks: [{ blockId: 'policy-p1', text: '合成测试材料不得据此确定积分', kind: 'text' as const, location: { kind: 'paragraph' as const, index: 0 } }],
    }
    const local: ReviewToolContext = {
      ...context,
      documents: [...context.documents, policyDoc],
      rules: [{ ...context.rules[0]!, execution: 'semantic' }],
      observations: [], evidenceLinks: [], results: [],
    }
    const tools = buildReviewTools(local)
    const submit = tools.find((tool) => tool.name === 'submit_check')!
    const input = { ruleId: 'r1', subjectIds: ['s1'], status: 'compliant', reason: '证据足够', sourceRefs: [{ documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书' }] }

    const blocked = await submit.execute(input)
    expect(blocked).toMatchObject({ ok: false, error: expect.stringContaining('必须完整读取所有 role=rule') })
    expect(local.results).toHaveLength(0)

    const read = await tools.find((tool) => tool.name === 'read_documents')!.execute({ documents: [{ documentVersionId: 'policy-v1' }] })
    expect(read).toMatchObject({ ok: true, data: { acceptedCount: 1, results: [{ ok: true, data: { fullyRead: true } }] } })
    expect((await submit.execute(input)).ok).toBeTrue()
    expect(local.results).toHaveLength(1)
  })

  test('同一成果名称跨分项重复出现时，要求人工决定分配口径', async () => {
    const baseSubject = context.subjects[0]!
    const local: ReviewToolContext = {
      ...context,
      subjects: [
        { ...baseSubject, id: 'individual-1', sectionId: 'individual', fields: { ...baseSubject.fields, achievementName: { kind: 'text', value: '合成竞赛团队成果' } } },
        { ...baseSubject, id: 'team-1', sectionId: 'team', fields: { ...baseSubject.fields, achievementName: { kind: 'text', value: '合成竞赛团队成果' } } },
      ],
      fields: [{ key: 'achievementName', label: '成果名称', kind: 'text', required: true, visibility: 'internal' }],
      rules: [{ ...context.rules[0]!, id: 'team-split', title: '分项与成员拆分', requirement: '一个材料支持多个事项时检查是否为同一成果的重复申报；成员分配口径由负责人确认。', targetScope: 'group', sectionId: 'team', execution: 'semantic' }],
      observations: [], evidenceLinks: [], results: [],
    }
    const submit = buildReviewTools(local).find((tool) => tool.name === 'submit_check')!
    const blocked = await submit.execute({ ruleId: 'team-split', scope: 'group', subjectIds: ['team-1'], status: 'compliant', reason: '无重复', sourceRefs: [{ documentVersionId: 'd1-v1', blockId: 'b1', quote: '省赛一等奖证书' }] })
    expect(blocked).toMatchObject({ ok: false, error: expect.stringContaining('疑似同一成果跨分项重复申报') })
    expect((await submit.execute({ ruleId: 'team-split', scope: 'group', subjectIds: ['team-1'], status: 'awaiting-confirmation', reason: '同名成果跨分项，成员分配口径待负责人确认' })).ok).toBeTrue()
  })

  test('Given link_evidence When 绑定 Then candidate 状态进入上下文', async () => {
    const tools = buildReviewTools(context)
    const link = tools.find((tool) => tool.name === 'link_evidence')!
    const outcome = (await link.execute({ documentVersionId: 'd1-v1', subjectIds: ['s1'], supportsFact: '省赛一等奖' })) as { ok: true; data: { links: number } }
    expect(outcome.ok).toBeTrue()
    expect(context.evidenceLinks).toHaveLength(1)
    expect(context.evidenceLinks[0]!.status).toBe('candidate')
  })
})
