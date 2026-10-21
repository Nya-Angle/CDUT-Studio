/**
 * 审核专区熔断器：子模块渲染异常必须被拦截并给出可复位降级界面，而不是白屏。
 */
import { describe, expect, test } from 'bun:test'
import { CdutZoneErrorBoundary } from './CdutZoneErrorBoundary'

describe('审核专区异常熔断', () => {
  test('捕获到渲染异常时进入降级状态并保留错误对象', () => {
    const error = new Error('审核面板渲染失败')
    const state = CdutZoneErrorBoundary.getDerivedStateFromError(error)
    expect(state.hasError).toBe(true)
    expect(state.error).toBe(error)
  })

  test('不同异常都会重新进入降级状态（不会卡在旧错误）', () => {
    const first = CdutZoneErrorBoundary.getDerivedStateFromError(new Error('a'))
    const second = CdutZoneErrorBoundary.getDerivedStateFromError(new Error('b'))
    expect(first.error?.message).toBe('a')
    expect(second.error?.message).toBe('b')
  })

  test('初始状态为正常，重新挂载不会带着旧错误', () => {
    // setState 在未挂载实例上是 no-op，无法在无 DOM 环境下模拟复位；
    // 这里验证真正影响重挂载的性质：初始状态必须是干净的。
    const instance = new CdutZoneErrorBoundary({ children: null })
    expect(instance.state).toEqual({ hasError: false, error: null })
  })
})
