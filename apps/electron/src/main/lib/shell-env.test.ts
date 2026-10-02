import { describe, expect, test } from 'bun:test'
import { buildShellEnvInvocation, getShellEnv } from './shell-env'

describe('shell environment loading', () => {
  test('uses a non-interactive login shell invocation', () => {
    const invocation = buildShellEnvInvocation()

    expect(invocation.args[0]).toBe('-l')
    expect(invocation.args[1]).toBe('-c')
    expect(invocation.args).not.toContain('-i')
    expect(invocation.args[2]).toContain(invocation.marker)
    expect(invocation.args[2]).toContain('env')
  })

  // 该用例断言 macOS 的 /bin/zsh 行为（测试名即"macOS zsh"），非 darwin 宿主没有该 shell，
  // 跳过而不是误报（与 packaging-guards.test.ts:206 的平台守卫同款做法）。
  test.skipIf(process.platform !== 'darwin')('loads environment from macOS zsh without interactive zle initialization', async () => {
    const env = await getShellEnv('/bin/zsh')

    expect(env.PATH).toBeString()
    expect(env.SHELL).toBe('/bin/zsh')
  })
})
