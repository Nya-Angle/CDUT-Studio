import { describe, expect, test } from 'bun:test'
import type { MaterialSlotSpec } from '../types/review-v2'
import { classifyMaterialLocally } from './material-classifier'

const slot = (id: string, name: string, hints?: MaterialSlotSpec['classificationHints']): MaterialSlotSpec => ({
  id, name, purpose: `收取${name}`, requiredElements: [], acceptedKinds: ['pdf', 'office', 'image'],
  minCount: 0, maxCount: 5, allowReuseAcrossSubjects: false,
  ...(hints ? { classificationHints: hints } : {}),
})

describe('低成本材料分类：角色与模板槽位互不冒充', () => {
  test('Given 申报表 When 提取标题与字段 Then 只给申报材料高置信候选', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '2026奖学金申请表.docx', parseStatus: 'parsed',
      blocks: [{ text: '申请人 申请理由 本人申请国家奖学金', kind: 'table-cell' }],
    } })
    expect(result.status).toBe('high')
    expect(result.candidates[0]?.role).toBe('application')
  })

  test('Given 评奖通知正文也有申请二字 Then 不把政策说明误判为申请表', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '2026年奖学金评选细则与工作通知.pdf', parseStatus: 'parsed',
      blocks: [{ text: '第一条 适用范围。学生应按申请条件提交申请表。' }],
    } })
    expect(result.status).toBe('high')
    expect(result.candidates[0]?.role).toBe('rule')
  })

  test('Given 获奖证书与模板槽位 Then 复用别名进行细分类', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '全国材料设计竞赛获奖证书.pdf', parseStatus: 'parsed',
      blocks: [{ text: '获奖等级：二等奖；颁发单位：中国材料学会', kind: 'table-cell' }],
    }, template: { materialSlots: [
      slot('M001', '学生申请表'),
      slot('M002', '竞赛获奖证明', { aliases: ['获奖证书'], positiveKeywords: ['获奖等级'] }),
      slot('M003', '学业成绩单'),
    ] } })
    expect(result.candidates[0]?.role).toBe('evidence')
    expect(result.candidates[0]?.slotId).toBe('M002')
    expect(result.candidates[0]?.reasons.some(reason => reason.includes('获奖证书'))).toBe(true)
  })

  test('同义词回归：获奖证书自动绑定荣誉证书槽位，无需模板逐项手写别名', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '获奖证书-2026.pdf', parseStatus: 'parsed',
      blocks: [{ text: '兹证明获得荣誉证书与获奖等级，颁发单位为主办方' }],
    }, template: { materialSlots: [slot('award', '荣誉证书')] } })
    expect(result.status).toBe('high')
    expect(result.candidates[0]?.role).toBe('evidence')
    expect(result.candidates[0]?.slotId).toBe('award')
    expect(result.candidates[0]?.reasons).toContain('文件名匹配“获奖证书”')
  })

  test('槽位先排除类别和文件格式不兼容的候选，不能让错误第一名挤掉正确槽', () => {
    const incompatibleRole = { ...slot('wrong-role', '荣誉证书'), acceptedRoles: ['application' as const] }
    const incompatibleKind = { ...slot('wrong-kind', '荣誉证书'), acceptedKinds: ['sheet' as const] }
    const correct = { ...slot('correct', '荣誉证书'), acceptedRoles: ['evidence' as const] }
    const result = classifyMaterialLocally({ document: {
      fileName: '获奖证书-2026.pdf', parseStatus: 'parsed',
      blocks: [{ text: '荣誉证书，二等奖' }],
    }, template: { materialSlots: [incompatibleRole, incompatibleKind, correct] } })
    expect(result.status).toBe('high')
    expect(result.candidates[0]?.slotId).toBe('correct')
  })

  test('不能把所有带“证书”二字的材料误绑到荣誉证书', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '专业资格证书.pdf', parseStatus: 'parsed',
      blocks: [{ text: '专业资格证书，有效期至 2028 年' }],
    }, template: { materialSlots: [slot('award', '荣誉证书')] } })
    expect(result.candidates[0]?.slotId).toBeUndefined()
  })

  test('两个都兼容且几乎同名的槽位互相竞争时，不能随便把首位当作正确答案', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '获奖证书.pdf', parseStatus: 'parsed', blocks: [{ text: '荣誉证书，二等奖' }],
    }, template: { materialSlots: [slot('A', '荣誉证书'), slot('B', '荣誉证书')] } })
    expect(result.candidates[0]?.role).toBe('evidence')
    expect(result.candidates[0]?.slotId).toBeUndefined()
  })

  test('Given 没有文本的扫描件 Then 显式等待已有 OCR 而不凭扩展名硬分', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: 'IMG_1025.png', mimeType: 'image/png', parseStatus: 'partial',
      blocks: [{ text: '', kind: 'image' }],
    } })
    expect(result.status).toBe('needs-ocr')
    expect(result.candidates).toHaveLength(0)
  })

  test('Given 同案相同字节的人工改类 Then 能复用但不表示审批可信', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '任意新文件名.pdf', byteHash: 'a'.repeat(64), parseStatus: 'parsed', blocks: [],
    }, template: { materialSlots: [slot('M002', '竞赛获奖证明')] },
      confirmedExamples: [{ byteHash: 'a'.repeat(64), classificationCorrection: {
      role: 'evidence', materialSlotId: 'M002', at: '2026-10-25T00:00:00Z',
    } }] })
    expect(result.source).toBe('same-byte-confirmation')
    expect(result.candidates[0]?.slotId).toBe('M002')
  })

  test('Given 当前材料已经人工确认 Then 机器不再覆盖', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '奖学金申请表.pdf', parseStatus: 'parsed',
      classificationCorrection: { role: 'rule', at: '2026-10-25T00:00:00Z' },
      blocks: [{ text: '申请表' }],
    } })
    expect(result.status).toBe('manual-confirmed')
    expect(result.candidates[0]?.role).toBe('rule')
  })

  test('Given 人工已确认角色但尚未绑定槽位 Then 可建议槽位而不改写角色', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '获奖证书.pdf', parseStatus: 'parsed',
      classificationCorrection: { role: 'application', at: '2026-10-25T00:00:00Z' },
      blocks: [{ text: '颁发单位' }],
    }, template: { materialSlots: [slot('M2', '获奖证书'), slot('M3', '成绩单')] } })
    expect(result.status).toBe('manual-confirmed')
    expect(result.candidates[0]?.role).toBe('application')
    expect(result.candidates[0]?.slotId).toBe('M2')
  })

  test('Given 模板已经更换 Then 同哈希经验不会复用旧模板的槽位 ID', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '成绩证明.pdf', byteHash: 'b'.repeat(64), blocks: [],
    }, template: { materialSlots: [slot('NEW', '新模板成绩材料')] }, confirmedExamples: [{
      byteHash: 'b'.repeat(64), classificationCorrection: { role: 'evidence', materialSlotId: 'OLD', at: '2026-10-25T00:00:00Z' },
    }] })
    expect(result.candidates[0]?.role).toBe('evidence')
    expect(result.candidates[0]?.slotId).toBeUndefined()
  })

  test('Given 内容缺乏明确语义 Then 保持 unknown，不制造材料槽位', () => {
    const result = classifyMaterialLocally({ document: {
      fileName: '文档001.txt', parseStatus: 'parsed', blocks: [{ text: '姓名 学号 日期' }],
    }, template: { materialSlots: [slot('M1', '申请表'), slot('M2', '证明材料')] } })
    expect(result.status).toBe('unknown')
    expect(result.candidates).toHaveLength(0)
  })
})
