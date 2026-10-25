/**
 * 文件名强线索回归（纯本地、无磁盘/隐私）：
 * 用本机合成案卷 case-7a65d898 的 25 个真实文件名与人工列出的角色期望，
 * 验证“无正文的图片/PDF 也能凭足够明确的文件名先定角色”。
 *
 * 注意：角色可判 ≠ 正文已识读；正文事实仍需 OCR/阅读。
 */
import { describe, expect, test } from 'bun:test'
import { classifyMaterialLocally, type MaterialRole } from './material-classifier'

const CASE: Array<[string, MaterialRole]> = [
  ['00_申请材料目录.docx', 'application'],
  ['01_活动申请表.docx', 'application'],
  ['02_活动实施方案.docx', 'application'],
  ['03_参加人员名单.xlsx', 'application'],
  ['04_安全责任承诺书.pdf', 'evidence'],
  ['05_实验室风险评估表.xlsx', 'application'],
  ['06_安全培训完成情况.xlsx', 'evidence'],
  ['07_设备使用与操作人员清单.xlsx', 'application'],
  ['08_场地预约确认单.pdf', 'evidence'],
  ['09_二级单位审批意见.pdf', 'evidence'],
  ['10_活动预算明细.xlsx', 'application'],
  ['11_耗材供应商报价单.pdf', 'evidence'],
  ['12_耗材采购申请.docx', 'application'],
  ['13_指导教师与现场负责人说明.docx', 'application'],
  ['14_应急联系人表.xlsx', 'application'],
  ['15_团体意外险凭证.pdf', 'evidence'],
  ['16_安全告知书签收汇总.pdf', 'evidence'],
  ['17_活动宣传海报.png', 'evidence'],
  ['18_活动介绍演示稿.pptx', 'application'],
  ['19_场地平面布置图.png', 'application'],
  ['20_设备操作培训记录.xlsx', 'evidence'],
  ['21_变更沟通记录.eml', 'evidence'],
  ['22_实验室准入须知.pdf', 'rule'],
  ['23_上一年度活动总结.pdf', 'evidence'],
  ['24_现场值守排班表.docx', 'application'],
]

const doc = (fileName: string) => ({
  fileName,
  // 模拟“没有可用正文”：图片/扫描 PDF 只有原件，不臆造文本块。
  parseStatus: /\.(png|jpg|jpeg|pdf)$/i.test(fileName) ? 'partial' as const : 'parsed' as const,
  blocks: [],
})

describe('强文件名线索定角色（无正文）', () => {
  test.each(CASE)('%s → %s', (fileName, expected) => {
    const result = classifyMaterialLocally({ document: doc(fileName) })
    expect(result.status).toBe('high')
    expect(result.candidates[0]?.role).toBe(expected)
    expect(result.candidates[0]?.reasons.join('')).toContain('文件名明确为')
  })

  test('通用文件名没有本地证据时仍交 OCR/后续兜底', () => {
    const result = classifyMaterialLocally({ document: doc('generic-scan.pdf') })
    expect(result.status).toBe('needs-ocr')
    expect(result.candidates).toHaveLength(0)
  })

  test('文件名不含强线索的普通表格不会被“含表”泛化误判', () => {
    const result = classifyMaterialLocally({ document: doc('data-table.pdf') })
    expect(result.status).toBe('needs-ocr')
    expect(result.candidates).toHaveLength(0)
  })
})
