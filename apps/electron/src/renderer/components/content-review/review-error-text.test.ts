import { describe, expect, test } from 'bun:test'
import { humanizeReviewError } from './review-error-text'

describe('审核错误人话化', () => {
  test('身份不符给出可执行的切换指引', () => {
    expect(humanizeReviewError(new Error('T05_ACTOR_NOT_ASSIGNED_TO_STAGE'))).toContain('切换')
  })

  test('缺少运行结果时提示先做检查', () => {
    expect(humanizeReviewError('没有与当前原件一致的有效审核运行')).toContain('重新检查')
  })

  test('缺材料给出上传指引', () => {
    expect(humanizeReviewError(new Error('缺少必需材料：实验计划（需 1，现有 0）'))).toContain('上传')
  })

  test('未识别的错误原样透出，不掩盖真实原因', () => {
    expect(humanizeReviewError(new Error('某个未知错误 XYZ'))).toBe('某个未知错误 XYZ')
  })

  test('非 Error 输入也能安全处理', () => {
    expect(humanizeReviewError(undefined)).toBe('')
    expect(humanizeReviewError(42)).toBe('42')
  })
})
