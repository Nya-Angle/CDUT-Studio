/**
 * D0.5 Agent 可调用的结构化编辑入口（独立技术 Demo）。
 * 用法：bun apps/electron/scripts/review-semantic-demo.ts <state.json> <command.json>
 * command.kind: apply | preview | project | project-draft | list
 * 文件内容被当作数据处理，不作为任何 Pi 系统指令执行。
 */
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { getTemplate, saveDraft, validateTemplate } from '../src/main/lib/review/template-store'
import {
  applyDemoTransaction, emptyDemoState, previewDemo, projectSimpleDemoDraft, validateDemoState,
  type DemoState, type DemoTransaction,
} from '../src/main/lib/review/semantic-module-demo'

type DemoCommand =
  | ({ kind: 'apply' } & DemoTransaction)
  | { kind: 'preview'; templateId: string; version: number; scenario?: string }
  | { kind: 'project'; templateId: string; version: number }
  | { kind: 'project-draft'; templateId: string; version: number; confirmDemoWrite: true }
  | { kind: 'list' }

function readState(path: string): DemoState {
  if (!existsSync(path)) return emptyDemoState()
  const result = JSON.parse(readFileSync(path, 'utf8')) as DemoState
  if (!result || !Array.isArray(result.modules) || !Array.isArray(result.templates)) throw new Error('状态文件结构无效')
  const problems = validateDemoState(result)
  if (problems.length) throw new Error('状态文件校验失败：' + problems.join('；'))
  return result
}

function atomicWrite(path: string, value: DemoState): void {
  mkdirSync(dirname(path), { recursive: true })
  const temp = path + '.tmp-' + process.pid
  try {
    writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' })
    renameSync(temp, path)
  } finally {
    if (existsSync(temp)) unlinkSync(temp)
  }
}

function main(): void {
  if (!process.argv[2] || !process.argv[3]) {
    throw new Error('用法：bun apps/electron/scripts/review-semantic-demo.ts <state.json> <command.json>')
  }
  const path = resolve(process.argv[2])
  const cmd = JSON.parse(readFileSync(resolve(process.argv[3]), 'utf8')) as DemoCommand
  if (cmd.kind === 'apply') {
    mkdirSync(dirname(path), { recursive: true })
    // 仅防止本地 CLI 多进程同时写入造成丢失更新；不把 demo 锁当正式事务服务。
    const lock = path + '.lock'
    const fd = openSync(lock, 'wx')
    try {
      const next = applyDemoTransaction(readState(path), cmd)
      atomicWrite(path, next)
      console.log(JSON.stringify({ ok: true, revision: next.revision, modules: next.modules.length, templates: next.templates.length }, null, 2))
    } finally {
      closeSync(fd)
      unlinkSync(lock)
    }
    return
  }
  const state = readState(path)
  switch (cmd.kind) {
    case 'list':
      console.log(JSON.stringify({
        revision: state.revision,
        modules: state.modules.map((it) => ({ id: it.moduleId, version: it.version, name: it.name })),
        templates: state.templates.map((it) => ({ id: it.templateId, version: it.version, name: it.name })),
      }, null, 2))
      return
    case 'preview':
      console.log(JSON.stringify(previewDemo(state, cmd.templateId, cmd.version, cmd.scenario), null, 2))
      return
    case 'project':
      console.log(JSON.stringify(projectSimpleDemoDraft(state, cmd.templateId, cmd.version), null, 2))
      return
    case 'project-draft': {
      if (cmd.confirmDemoWrite !== true || !process.env.PROFER_CONFIG_DIR) {
        throw new Error('写入正式模板草稿库必须明确 confirmDemoWrite=true 并使用隔离 PROFER_CONFIG_DIR')
      }
      const draft = projectSimpleDemoDraft(state, cmd.templateId, cmd.version)
      const errors = validateTemplate(draft).filter((it) => it.level === 'error')
      if (errors.length) throw new Error('投影未通过原模板校验：' + errors.map((it) => it.message).join('；'))
      if (getTemplate(draft.templateId, draft.version)) throw new Error('目标模板版本已存在，拒绝覆盖')
      const saved = saveDraft(draft)
      console.log(JSON.stringify({ ok: true, templateId: saved.templateId, version: saved.version, status: saved.status }))
      return
    }
    default:
      throw new Error('不支持的命令类型')
  }
}

try {
  main()
} catch (error) {
  console.error('[D0.5 Demo] ' + (error instanceof Error ? error.message : String(error)))
  process.exitCode = 1
}
