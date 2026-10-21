import { describe, expect, test } from 'bun:test'
import { Script } from 'node:vm'
import { buildT09OfflineFormHtml } from './review-v3-t09-offline-form'

describe('T09 离线回件文件界面', () => {
  test('学生补件任务渲染为无需联网的表单，材料文本不能注入 script', () => {
    const source = {
      type: 'task', format: 'cdut-review-offline/1', packageId: 't09-task-1', caseId: 'case-1',
      hash: 'fake-hash-for-render-only', baseRevision: 1, lock: { templateId: 't1', templateVersion: 1 },
      recipient: { role: 'student', actorId: 'a1', actorSource: 'local' },
      publicContext: { title: '</script><script>alert(1)</script>', fields: {} },
      task: { kind: 'student-reply', supplementId: 's1', reason: '补交申请表', requiredElements: [] },
    }
    const html = buildT09OfflineFormHtml(JSON.stringify(source))
    expect(html).toContain('保存回件文件')
    expect(html).toContain('.cdutreply')
    expect(html).not.toContain('</script><script>alert(1)</script>')
    const executable = html.match(/<script>\s*([\s\S]*?)<\/script><\/body>/)?.[1]
    expect(executable).toBeDefined()
    expect(() => new Script(executable!)).not.toThrow()
    expect((html.match(/<script\b/g) ?? []).length).toBe(2)
  })
})
