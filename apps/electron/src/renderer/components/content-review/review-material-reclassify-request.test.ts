/**
 * 材料改类请求构造回归测试。
 *
 * 目的：抓住“D2 冻结时 fallback 纠错提案漏传 materialSlotId”的回归——
 * 人工选择的槽位必须与直接改类携带同一值；空值不得作为非法字段发给 Main。
 */
import { describe, expect, test } from 'bun:test'
import {
  buildReclassifyMaterialRequest,
  buildRemediationProposalRequest,
  normalizeMaterialSlotInput,
} from './ReviewMaterialControls'

describe('材料改类请求构造', () => {
  test('人工选定槽位时，直接改类与 D2 纠错提案携带同一槽位', () => {
    const direct = buildReclassifyMaterialRequest({
      caseId: 'case-1', documentVersionId: 'doc-1-v1', role: 'evidence', materialSlotId: 'slot-cert',
    })
    const proposal = buildRemediationProposalRequest({
      caseId: 'case-1', expectedRevision: 7, documentVersionId: 'doc-1-v1', role: 'evidence',
      materialSlotId: 'slot-cert', reason: '人工将材料改为证明材料',
    })
    expect(direct.materialSlotId).toBe('slot-cert')
    // 回归点：漏传会让 D2 纠错把材料放到“无槽位”，人工选择被静默丢弃。
    expect(proposal.materialSlotId).toBe('slot-cert')
    expect(proposal.expectedRevision).toBe(7)
    expect(proposal.requestId.startsWith('drag-reclassify-propose-')).toBe(true)
  })

  test('只换槽位（角色不变）也必须带槽位（不 trim 合法 ID）', () => {
    const request = buildReclassifyMaterialRequest({
      caseId: 'case-1', documentVersionId: 'doc-1-v1', role: 'application', materialSlotId: 'slot-other',
    })
    expect(request.role).toBe('application')
    expect(request.materialSlotId).toBe('slot-other')
  })

  test('未提供槽位时不带该字段；Main 会据此清空槽位（不是保持）', () => {
    for (const materialSlotId of [undefined, null, '']) {
      expect(normalizeMaterialSlotInput(materialSlotId)).toBeUndefined()
      const direct = buildReclassifyMaterialRequest({ caseId: 'c', documentVersionId: 'd', role: 'rule', materialSlotId })
      const proposal = buildRemediationProposalRequest({
        caseId: 'c', expectedRevision: 1, documentVersionId: 'd', role: 'rule', materialSlotId, reason: '人工更正',
      })
      expect('materialSlotId' in direct).toBe(false)
      expect('materialSlotId' in proposal).toBe(false)
      // 语义说明：省略字段在 Main 侧等价于 materialSlotId=null → 清空槽位。
      // 本测试只覆盖请求构造；hook 内部是否把槽位传入两处调用属于交互测试，本轮未做。
    }
  })
})
