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

  test('去掉 Electron IPC 外壳与内部错误码，保留 Main 写好的原因', () => {
    const raw = "Error invoking remote method 'review-v3:local-d4-attach-plan': Error: " +
      'LOCAL_D4_TEMPLATE_ALREADY_BOUND: 当前案卷已绑定「综合测评模板」，不能再用这套审核方案覆盖。请新建一个未绑定模板的案卷后再试。'
    const text = humanizeReviewError(new Error(raw))
    expect(text).toContain('当前案卷已绑定「综合测评模板」')
    expect(text).not.toContain('Error invoking remote method')
    expect(text).not.toContain('LOCAL_D4_TEMPLATE_ALREADY_BOUND')
  })

  test('裸技术预审错误码翻译成用户能懂的结论', () => {
    expect(humanizeReviewError(new Error('AGENT_DECISION_DISABLED: D2 模板失去受控候选资格')))
      .toContain('只能用于尚未绑定模板的新案卷')
    expect(humanizeReviewError(new Error('AGENT_DECISION_DISABLED')))
      .toContain('不能代替学校正式审批')
  })

  test('其他内部错误码不再直接展示给用户', () => {
    expect(humanizeReviewError(new Error('LOCAL_D4_EXISTING_ITEMS: 请为该任务新建草稿案卷'))).toContain('新建一个草稿案卷')
    expect(humanizeReviewError(new Error('OUT_OF_TOOL_BUDGET: 超出预算'))).toBe('超出预算')
  })

  test('非 Error 输入也能安全处理', () => {
    expect(humanizeReviewError(undefined)).toBe('')
    expect(humanizeReviewError(42)).toBe('42')
  })
})
