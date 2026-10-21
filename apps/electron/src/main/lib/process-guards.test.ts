/**
 * 主进程兜底：子系统的遗漏异常必须留痕，且不得终止进程。
 */
import { afterEach, describe, expect, test } from 'bun:test'
import {
  installProcessGuards, readProcessGuardEntries, recordProcessFailure, resetProcessGuardsForTest,
} from './process-guards'

afterEach(() => { resetProcessGuardsForTest() })

describe('主进程全局兜底', () => {
  test('安装幂等：重复调用只装一次', () => {
    expect(installProcessGuards()).toBe(true)
    expect(installProcessGuards()).toBe(false)
  })

  test('未处理的 Promise 拒绝被记录且进程存活', () => {
    installProcessGuards()
    // 直接调用记录函数：Bun 测试运行器会把真实的未处理拒绝判为测试失败，
    // 这里验证的是「记录路径」本身不会抛错、不会退出。
    const entry = recordProcessFailure('unhandledRejection', new Error('审核后台链路失败'))
    expect(entry.kind).toBe('unhandledRejection')
    expect(entry.message).toContain('审核后台链路失败')
    expect(readProcessGuardEntries().some((item) => item.message.includes('审核后台链路失败'))).toBe(true)
  })

  test('同一错误重复出现时按指纹累计次数（避免刷屏）', () => {
    installProcessGuards()
    const make = () => new Error('规则计算崩溃')
    recordProcessFailure('uncaughtException', make())
    recordProcessFailure('uncaughtException', make())
    const last = recordProcessFailure('uncaughtException', make())
    expect(last.repeat).toBe(3)
    expect(last.kind).toBe('uncaughtException')
  })

  test('记录数量有上限，异常风暴不会吃满内存', () => {
    installProcessGuards()
    for (let i = 0; i < 80; i += 1) recordProcessFailure('uncaughtException', new Error('storm-' + i))
    expect(readProcessGuardEntries().length).toBeLessThanOrEqual(50)
  })

  test('记录为只读副本，调用方改不动内部状态', () => {
    installProcessGuards()
    recordProcessFailure('uncaughtException', new Error('x'))
    const snapshot = readProcessGuardEntries()
    snapshot[0]!.message = 'tampered'
    expect(readProcessGuardEntries()[0]?.message).toBe('x')
  })
})
