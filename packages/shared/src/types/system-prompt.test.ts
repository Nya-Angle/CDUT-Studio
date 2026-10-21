/**
 * 内置默认提示词身份纯正性单测。
 *
 * 约束：全系统唯一身份为「CDUT Studio Agent」，桌面应用唯一命名为「CDUT Studio」，
 * 严禁再出现任何「Profer」字眼或「也叫/别名」式的身份分裂表述。
 */

import { describe, expect, test } from 'bun:test'
import { BUILTIN_DEFAULT_PROMPT, BUILTIN_DEFAULT_PROMPT_STRING } from './system-prompt'

describe('内置默认提示词身份纯正性', () => {
  test('Given 内置提示词正文 When 检索 When 断言 Then 不含任何 Profer 字眼', () => {
    expect(BUILTIN_DEFAULT_PROMPT_STRING.includes('Profer')).toBe(false)
    expect(BUILTIN_DEFAULT_PROMPT_STRING.toLowerCase().includes('profer')).toBe(false)
  })

  test('Given 内置提示词正文 When 断言唯一身份 Then 明确锚定为 CDUT Studio Agent', () => {
    expect(BUILTIN_DEFAULT_PROMPT_STRING).toContain('CDUT Studio Agent')
    expect(BUILTIN_DEFAULT_PROMPT_STRING).toContain('CDUT Studio desktop app')
  })

  test('Given 内置提示词正文 When 断言 Then 不存在「也叫/别名」式身份分裂', () => {
    expect(BUILTIN_DEFAULT_PROMPT_STRING).not.toContain('也叫')
    expect(BUILTIN_DEFAULT_PROMPT_STRING).not.toMatch(/别名/)
  })

  test('Given 内置提示词元数据 When 断言名称 Then 使用 CDUT Studio 命名', () => {
    expect(BUILTIN_DEFAULT_PROMPT.name).toContain('CDUT Studio')
    expect(BUILTIN_DEFAULT_PROMPT.name.includes('Profer')).toBe(false)
  })
})
