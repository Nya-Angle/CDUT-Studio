/** R02 T03-B：材料授权状态未知时提示但不阻断本地审核流程。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  assertReviewPreuploadAllowed, REVIEW_PREUPLOAD_OFFLINE_NOTICE,
  reviewPreuploadDecisionAllows, type ReviewPreuploadDecision,
} from './review-preupload-gate'

// 使测试明确覆盖“授权源未接线”的产品状态。
process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK = '1'
const root = mkdtempSync(join(tmpdir(), 'review-preupload-p0-'))
process.env.PROFER_CONFIG_DIR = join(root, 'config')
afterAll(() => {
  delete process.env.PROFER_REVIEW_TEST_PREUPLOAD_BLOCK
  rmSync(root, { recursive: true, force: true })
})

describe('T03-B 审核材料授权提示', () => {
  test('授权源未知时所有审核入口只提示，不抛出阻断错误', () => {
    for (const operation of [
      'create-case', 'picker', 'drop', 'clipboard', 'zip', 'restore',
      'read', 'persist', 'parse', 'ocr', 'index', 'model',
    ] as const) {
      expect(() => assertReviewPreuploadAllowed(operation)).not.toThrow()
    }
    expect(REVIEW_PREUPLOAD_OFFLINE_NOTICE).toContain('请确认这些材料适合在当前设备和所选模型渠道中处理')
    expect(REVIEW_PREUPLOAD_OFFLINE_NOTICE).not.toContain('无法判断材料是否涉敏')
    expect(REVIEW_PREUPLOAD_OFFLINE_NOTICE).not.toContain('系统未接收材料')
  })

  test('授权判定纯函数仍保持保守语义，供未来可信授权源复用', () => {
    const approval: ReviewPreuploadDecision = {
      classification: 'ordinary', environment: 'local-controlled', authorization: 'confirmed',
      externalModelAuthorized: false, expiresAt: Date.now() + 5000,
    }
    expect(reviewPreuploadDecisionAllows(undefined, 'read', {})).toBeFalse()
    expect(reviewPreuploadDecisionAllows({ ...approval, authorization: 'unknown' }, 'read', {})).toBeFalse()
    expect(reviewPreuploadDecisionAllows({ ...approval, authorization: 'denied' }, 'read', {})).toBeFalse()
    expect(reviewPreuploadDecisionAllows({ ...approval, classification: 'unknown' }, 'read', {})).toBeFalse()
    expect(reviewPreuploadDecisionAllows({ ...approval, expiresAt: 1 }, 'read', {})).toBeFalse()
    expect(reviewPreuploadDecisionAllows(approval, 'read', {})).toBeTrue()
    expect(reviewPreuploadDecisionAllows(approval, 'model', { modelDestination: 'https://example.invalid' })).toBeFalse()
    expect(reviewPreuploadDecisionAllows({ ...approval, externalModelAuthorized: true,
      modelDestination: 'https://permitted.invalid' }, 'model', { modelDestination: 'https://different.invalid' })).toBeFalse()
  })

  test('材料选择与建案不再因未知授权状态在 Main 预检阶段失败', async () => {
    writeFileSync(join(root, 'safe-synthetic.txt'), 'Synthetic test content only.')
    const { buildT06SelectionFromPath } = await import('./review-v3-t06-main-service')
    const selection = await buildT06SelectionFromPath(root, 'folder')
    expect(selection.sourceKind).toBe('folder')
    const { createNativeWorkspaceCaseV3 } = await import('./native-workspace-case-v3')
    const created = await createNativeWorkspaceCaseV3({
      title: 'Synthetic local intake', type: '自定义审核', applicant: 'Synthetic applicant',
      domainPackId: 'contract-review', reviewTemplate: null,
    })
    expect(created.view.title).toBe('Synthetic local intake')
    expect(() => assertReviewPreuploadAllowed('model', { modelDestination: 'openai:https://example.invalid/v1' })).not.toThrow()
  })
})
