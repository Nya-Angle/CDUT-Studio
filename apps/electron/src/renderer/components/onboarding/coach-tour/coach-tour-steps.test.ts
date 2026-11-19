import { describe, expect, test } from 'bun:test'
import { COACH_TOUR_STEPS, CURRENT_COACH_TOUR_VERSION } from './coach-tour-steps'

describe('COACH_TOUR_STEPS 数据合法性', () => {
  test('步骤 key 唯一', () => {
    const keys = COACH_TOUR_STEPS.map((step) => step.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  test('除最后一步外都必须有锚点选择器', () => {
    COACH_TOUR_STEPS.slice(0, -1).forEach((step) => {
      expect(step.selectors.length + (step.unionSelectors?.length ?? 0)).toBeGreaterThan(0)
    })
  })

  test('等待型步骤必须声明 waitFor', () => {
    COACH_TOUR_STEPS.filter((step) => step.advanceOn === 'wait').forEach((step) => {
      expect(step.waitFor).toBeDefined()
    })
  })

  test('选择器等待必须提供 selector', () => {
    COACH_TOUR_STEPS.forEach((step) => {
      if (step.waitFor?.kind === 'selector') {
        expect(step.waitFor.selector.length).toBeGreaterThan(0)
      }
    })
  })

  test('CDUT 子页面步骤必须停留在 cdut-zone', () => {
    COACH_TOUR_STEPS.filter((step) => step.cdutSubView).forEach((step) => {
      expect(step.view).toBe('cdut-zone')
    })
  })

  test('版本号已升级', () => {
    expect(CURRENT_COACH_TOUR_VERSION).toBeGreaterThanOrEqual(8)
  })

  test('速课堂工件步骤必须等待对应工件视图', () => {
    COACH_TOUR_STEPS.filter((step) => step.key.startsWith('ai-class-') && step.prepare).forEach(
      (step) => {
        expect(step.prepare?.readySelector).toBeDefined()
      },
    )
  })

  test('科研步骤不得以未就绪的工作台作为就绪条件', () => {
    COACH_TOUR_STEPS.forEach((step) => {
      const readySelector = step.prepare?.readySelector?.trim()
      if (readySelector !== '[data-tour="cslab-workspace"]') return
      // 工作台一挂载就存在，必须叠加 data-cslab-ready="true" 才代表资产首批加载完成
      throw new Error(`${step.key} 使用了未就绪的工作台选择器`)
    })
  })
})
