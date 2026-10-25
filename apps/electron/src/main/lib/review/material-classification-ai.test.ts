import { describe, expect, test } from 'bun:test'
import { buildMaterialAiPrompt, parseMaterialAiResponse } from './material-classification-ai'

const slots = [{ id: 'M001', name: '竞赛获奖证明', purpose: '竞赛奖项证明材料', requiredElements: ['奖项级别'] }]

describe('低置信度 AI 分类兜底只建议不写案卷', () => {
  test('Given 原件与当前槽位 When 生成提示 Then 只传截断文本/白名单槽位，不传路径或源文件字节', () => {
    const prompt = buildMaterialAiPrompt({
      fileName: '2026年获奖证明.pdf', mimeType: 'application/pdf',
      blocks: [{ text: '获奖证书'.repeat(5000) }],
    }, slots)
    const value = JSON.parse(prompt) as { excerpts: string; slots: typeof slots; roles: Record<string, string> }
    expect(value.excerpts.length).toBeLessThanOrEqual(2600)
    expect(value.slots[0]?.id).toBe('M001')
    expect(Object.keys(value.roles)).toEqual(['rule', 'application', 'evidence'])
    expect(prompt).not.toContain('assetPath')
  })

  test('Given 正常模型 JSON When 校验 Then 给出受控角色与当前模板槽位', () => {
    const result = parseMaterialAiResponse('```json\n{"role":"evidence","materialSlotId":"M001","rationale":"文内含奖项级别"}\n```', slots, 500)
    expect(result).toEqual({ status: 'proposed', role: 'evidence', materialSlotId: 'M001',
      materialSlotName: '竞赛获奖证明', rationale: '文内含奖项级别', submittedChars: 500 })
  })

  test('角色已由本地确定时，短模型提示只允许补槽而不能重判角色', () => {
    const value = JSON.parse(buildMaterialAiPrompt({
      fileName: '获奖证书.pdf', mimeType: 'application/pdf', blocks: [{ text: '二等奖，颁发单位' }],
    }, slots, 'evidence')) as { task: string; output: { role: string }; slots: typeof slots }
    expect(value.task).toContain('不得改变角色')
    expect(value.output.role).toBe('evidence | null')
    expect(value.slots.map(slot => slot.id)).toEqual(['M001'])
  })

  test('Given 伪造模板 ID When 校验 Then 丢弃槽位但不冒充学校审定', () => {
    const result = parseMaterialAiResponse('{"role":"rule","materialSlotId":"FAKE","rationale":"通知"}', slots, 150)
    expect(result.role).toBe('rule')
    expect(result.materialSlotId).toBeUndefined()
  })

  test('Given 模型编造其他角色或非 JSON When 校验 Then 返回待人工确认', () => {
    expect(parseMaterialAiResponse('{"role":"teacher","materialSlotId":"M001"}', slots, 10).status).toBe('unresolved')
    expect(parseMaterialAiResponse('不要审核', slots, 10).status).toBe('unresolved')
  })
})
