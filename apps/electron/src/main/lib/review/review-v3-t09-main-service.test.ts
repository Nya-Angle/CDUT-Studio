/** T09 桥接：签发 → 预览 → 导入（附件先登记原件）+ actionId 幂等。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const configDir = mkdtempSync(join(tmpdir(), 't09-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { issueT09StudentPackage, previewT09Package, importT09Package } =
  await import('./review-v3-t09-main-service')
const { answerT09Task, packT09Asset } = await import('./review-v3-t09-offline-codec')

const caseId = 'case-t09-unit'
function aggregate(revision = 3, supplementStatus = 'open') {
  return {
    caseV2: {
      id: caseId, revision, templateId: 'tpl', templateVersion: 1, title: 'T09 案卷',
      caseFields: {}, documents: [], subjects: [], stage: 'awaiting-supplement',
    },
    supplements: [{ id: 'sup-1', status: supplementStatus, reason: '缺材料',
      requiredElements: ['补充证明'], responsibleRole: 'student', responses: [] }],
    decisions: [], observations: [], evidenceLinks: [], tasks: [], receiptLog: [],
  } as never
}

describe('T09 离线包桥接', () => {
  test('签发 → 应答 → 预览 ready', () => {
    const issued = issueT09StudentPackage({ aggregate: aggregate(), supplementId: 'sup-1', recipientId: 'local-student' })
    expect(issued.packageId).toBeTruthy()

    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, {
      kind: 'student-reply', supplementId: 'sup-1', note: '已补交',
      assets: [packT09Asset({ name: 'a.txt', mimeType: 'text/plain', bytes: Buffer.from('补交材料') })],
    })

    const { preview } = previewT09Package({ aggregate: aggregate(), packageJson: JSON.stringify(reply) })
    expect(preview.status).toBe('ready')
  })

  test('导入时附件先登记为原件，再答复补件', async () => {
    const issued = issueT09StudentPackage({ aggregate: aggregate(), supplementId: 'sup-1', recipientId: 'local-student' })
    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, {
      kind: 'student-reply', supplementId: 'sup-1', note: '已补交',
      assets: [packT09Asset({ name: 'a.txt', mimeType: 'text/plain', bytes: Buffer.from('补交材料') })],
    })

    const order: string[] = []
    const result = await importT09Package({
      caseId, packageJson: JSON.stringify(reply),
      deps: {
        readAggregate: () => aggregate(),
        registerAsset: async (_c, _n, _m, bytes) => { order.push('register:' + bytes.byteLength); return 'ver-1' },
        respondSupplement: async (_c, _s, _n, ids) => { order.push('respond:' + ids.join(',')); return { ok: true } },
      },
    })
    expect(result.status).toBe('accepted')
    // 顺序必须：先登记原件，后答复补件
    expect(order[0]).toStartWith('register:')
    expect(order[1]).toBe('respond:ver-1')
  })

  test('相同 actionId 重复导入返回 duplicate，不重复写业务', async () => {
    const issued = issueT09StudentPackage({ aggregate: aggregate(), supplementId: 'sup-1', recipientId: 'local-student' })
    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, { kind: 'student-reply', supplementId: 'sup-1', note: '已补交', assets: [] })
    let writes = 0
    const deps = {
      readAggregate: () => aggregate(),
      registerAsset: async () => { writes += 1; return 'ver-x' },
      respondSupplement: async () => { writes += 1; return { ok: true } },
    }
    const first = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps })
    const second = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps })
    expect(first.status).toBe('accepted')
    expect(second.status).toBe('duplicate')
    expect(writes).toBe(1)
  })

  test('补件已关闭时预览为 conflict', () => {
    const issued = issueT09StudentPackage({ aggregate: aggregate(), supplementId: 'sup-1', recipientId: 'local-student' })
    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, { kind: 'student-reply', supplementId: 'sup-1', note: '已补交', assets: [] })
    const { preview } = previewT09Package({ aggregate: aggregate(3, 'satisfied'), packageJson: JSON.stringify(reply) })
    expect(preview.status).toBe('conflict')
  })
})
