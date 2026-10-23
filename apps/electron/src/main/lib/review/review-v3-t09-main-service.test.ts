/** T09 桥接：签发 → 预览 → 导入（附件先登记原件 + 本 action 推进 revision 后 CAS）+ 崩溃续跑。 */
import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CaseAggregateV2 } from '@profer/shared'

const configDir = mkdtempSync(join(tmpdir(), 't09-'))
process.env.PROFER_CONFIG_DIR = configDir
afterAll(() => rmSync(configDir, { recursive: true, force: true }))

const { issueT09StudentPackage, previewT09Package, importT09Package, t09AssetTempRoot, pruneT09AssetTempRoot } =
  await import('./review-v3-t09-main-service')
const { answerT09Task, packT09Asset } = await import('./review-v3-t09-offline-codec')

const caseId = 'case-t09-unit'

interface HarnessDocument { versionId: string; documentId: string; active: boolean; role: string }
interface HarnessReceipt { requestId: string; type: string; revision: number }

/**
 * 真实 Main 语义的最小案卷：附件登记与补件答复各是一次事务，
 * 每次都把 revision +1；外部写入也必须推进 revision。
 */
function harness(initialRevision = 3) {
  const state = {
    revision: initialRevision,
    supplementStatus: 'open' as 'open' | 'responded' | 'satisfied',
    documents: [] as HarnessDocument[],
    receipts: [] as HarnessReceipt[],
    registerCalls: [] as string[],
    registerMetas: [] as Array<{ displayName: string; materialSlotId?: string }>,
    respondCalls: [] as Array<{ expectedRevision: number; versionIds: string[] }>,
    failNextRespond: undefined as undefined | 'throw' | 'conflict',
    failRegisterAt: undefined as number | undefined,
    registerAttempts: 0,
  }
  const snapshot = (revision = state.revision): CaseAggregateV2 => ({
    caseV2: {
      id: caseId, revision, templateId: 'tpl', templateVersion: 1, title: 'T09 案卷',
      caseFields: {}, documents: state.documents.map((document) => ({ ...document })), subjects: [],
      stage: 'awaiting-supplement',
    },
    supplements: [{ id: 'sup-1', status: state.supplementStatus, reason: '缺材料',
      materialSlotId: 'proof-slot', requiredElements: ['补充证明'], responsibleRole: 'student', responses: [] }],
    decisions: [], observations: [], evidenceLinks: [], tasks: [],
    receiptLog: state.receipts.map((receipt) => ({ ...receipt })),
  } as unknown as CaseAggregateV2)
  const externalWrite = (): void => { state.revision += 1 }
  const deps = {
    readAggregate: (id: string) => (id === caseId ? snapshot() : undefined),
    registerAsset: async (_caseId: string, name: string, _mime: string, _bytes: Uint8Array,
      meta?: { actionId: string; index: number; displayName: string; materialSlotId?: string }) => {
      state.registerAttempts += 1
      if (state.failRegisterAt === state.registerAttempts) {
        state.failRegisterAt = undefined
        throw new Error('材料登记失败（模拟）')
      }
      state.registerCalls.push(name)
      state.registerMetas.push({ displayName: meta?.displayName ?? name,
        ...(meta?.materialSlotId ? { materialSlotId: meta.materialSlotId } : {}) })
      state.revision += 1
      const document: HarnessDocument = { versionId: `ver-${state.revision}`, documentId: `doc-${state.revision}`,
        active: true, role: 'evidence' }
      state.documents.push(document)
      void meta
      return { versionId: document.versionId, revision: state.revision }
    },
    respondSupplement: async (_caseId: string, _supplementId: string, _note: string,
      versionIds: string[], expectedRevision: number, meta?: { actionId: string }) => {
      state.respondCalls.push({ expectedRevision, versionIds: [...versionIds] })
      if (state.failNextRespond === 'throw') { state.failNextRespond = undefined; throw new Error('进程中断（模拟）') }
      if (state.failNextRespond === 'conflict') { state.failNextRespond = undefined; return { ok: false, message: 'VERSION_CONFLICT: 模拟并发' } }
      if (expectedRevision !== state.revision) {
        return { ok: false, message: `VERSION_CONFLICT: 期望 ${expectedRevision} 当前 ${state.revision}` }
      }
      state.revision += 1
      state.receipts.push({ requestId: `t09-${meta?.actionId}`, type: 'RespondSupplement', revision: state.revision })
      state.supplementStatus = 'responded'
      return { ok: true }
    },
    verifyApplied: ({ actionId }: { caseId: string; supplementId: string; actionId: string; requestHash: string }) => {
      const receipt = state.receipts.find((item) => item.requestId === `t09-${actionId}`)
      return { applied: !!receipt, revision: receipt?.revision }
    },
  }
  return { state, snapshot, externalWrite, deps }
}

function makeReply(assets: Array<{ name: string; bytes: Buffer }>) {
  const issued = issueT09StudentPackage({ aggregate: harness().snapshot(), supplementId: 'sup-1', recipientId: 'local-student' })
  const task = JSON.parse(issued.json)
  return answerT09Task(task, {
    kind: 'student-reply', supplementId: 'sup-1', note: '已补交',
    assets: assets.map((asset) => packT09Asset({ name: asset.name, mimeType: 'text/plain', bytes: asset.bytes })),
  })
}

describe('T09 离线包桥接', () => {
  test('签发 → 应答 → 预览 ready', () => {
    const issued = issueT09StudentPackage({ aggregate: harness().snapshot(), supplementId: 'sup-1', recipientId: 'local-student' })
    expect(issued.packageId).toBeTruthy()

    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, {
      kind: 'student-reply', supplementId: 'sup-1', note: '已补交',
      assets: [packT09Asset({ name: 'a.txt', mimeType: 'text/plain', bytes: Buffer.from('补交材料') })],
    })

    const { preview } = previewT09Package({ aggregate: harness().snapshot(), packageJson: JSON.stringify(reply) })
    expect(preview.status).toBe('ready')
  })

  test('两份附件：逐份登记推进 revision，答复使用登记后的准确版本 CAS', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'a.txt', bytes: Buffer.from('first') }, { name: 'b.txt', bytes: Buffer.from('second') }])

    const result = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(result.status).toBe('accepted')
    // 预览版本 3 → 登记两份附件后为 5：答复必须用 5，而不是旧预览版本 3。
    expect(h.state.registerCalls).toEqual(['a.txt', 'b.txt'])
    // OFF-05：Main 把补件请求的槽位与离线包原名传给真实登记端口。
    expect(h.state.registerMetas).toEqual([
      { displayName: 'a.txt', materialSlotId: 'proof-slot' },
      { displayName: 'b.txt', materialSlotId: 'proof-slot' },
    ])
    expect(h.state.respondCalls).toHaveLength(1)
    expect(h.state.respondCalls[0]!.expectedRevision).toBe(5)
    expect(h.state.respondCalls[0]!.versionIds).toEqual(['ver-4', 'ver-5'])
    expect(h.state.revision).toBe(6)
  })

  test('附件登记之间出现外部并发写入：拒绝且不答复，保留已登记附件供续跑', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'c1.txt', bytes: Buffer.from('one') }, { name: 'c2.txt', bytes: Buffer.from('two') }])
    let mutated = false
    const deps = {
      ...h.deps,
      registerAsset: async (...args: Parameters<typeof h.deps.registerAsset>) => {
        const registered = await h.deps.registerAsset(...args)
        if (!mutated) { mutated = true; h.externalWrite() } // 外部操作穿插在两次登记之间
        return registered
      },
    }
    const result = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps })
    expect(result.status).toBe('rejected')
    expect(h.state.respondCalls).toHaveLength(0)
    expect(h.state.registerCalls).toEqual(['c1.txt'])
  })

  test('答复前出现外部并发写入：CAS 失败拒绝，不覆盖外部改动', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'd.txt', bytes: Buffer.from('x') }])
    const deps = {
      ...h.deps,
      registerAsset: async (...args: Parameters<typeof h.deps.registerAsset>) => {
        const registered = await h.deps.registerAsset(...args)
        h.externalWrite() // 登记后、答复前被其它操作推进
        return registered
      },
    }
    const result = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps })
    expect(result.status).toBe('rejected')
    expect(h.state.supplementStatus).toBe('open')
    expect(h.state.receipts).toHaveLength(0)
  })

  test('相同 actionId 重复导入返回 duplicate，不重复写业务', async () => {
    const h = harness()
    const reply = makeReply([])
    const first = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    const second = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(first.status).toBe('accepted')
    expect(second.status).toBe('duplicate')
    expect(h.state.respondCalls).toHaveLength(1)
  })

  test('补件已关闭时预览为 conflict', () => {
    const h = harness()
    const issued = issueT09StudentPackage({ aggregate: h.snapshot(), supplementId: 'sup-1', recipientId: 'local-student' })
    const task = JSON.parse(issued.json)
    const reply = answerT09Task(task, { kind: 'student-reply', supplementId: 'sup-1', note: '已补交', assets: [] })
    h.state.supplementStatus = 'satisfied' // 签发后补件被审核员判定满足
    const { preview } = previewT09Package({ aggregate: h.snapshot(), packageJson: JSON.stringify(reply) })
    expect(preview.status).toBe('conflict')
  })

  test('OFF-02：预览后案卷 revision 前进，导入拒绝且不写业务', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'e.txt', bytes: Buffer.from('x') }])
    h.externalWrite() // 预览时是 3，真正写入前已被其他操作推进到 4
    const result = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(result.status).toBe('conflict')
    expect(h.state.registerCalls).toHaveLength(0)
    expect(h.state.respondCalls).toHaveLength(0)
  })

  test('进程中断后续跑：按 staging 的准确 revision 复用附件，不重复登记', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'f1.txt', bytes: Buffer.from('one') }, { name: 'f2.txt', bytes: Buffer.from('two') }])
    h.state.failNextRespond = 'throw' // 两份附件登记完成、答复写入时进程中断
    await expect(importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })).rejects.toThrow('进程中断')
    expect(h.state.registerCalls).toEqual(['f1.txt', 'f2.txt'])
    expect(h.state.revision).toBe(5)

    const resumed = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(resumed.status).toBe('accepted')
    // 附件不再重复登记；答复使用 staging 记录的 5 做 CAS
    expect(h.state.registerCalls).toEqual(['f1.txt', 'f2.txt'])
    expect(h.state.respondCalls).toHaveLength(2)
    expect(h.state.respondCalls[1]!.expectedRevision).toBe(5)
    expect(h.state.revision).toBe(6)
  })

  test('续跑前出现外部并发写入：拒绝，不把别人的改动当成自己的推进', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'g1.txt', bytes: Buffer.from('one') }, { name: 'g2.txt', bytes: Buffer.from('two') }])
    h.state.failNextRespond = 'throw'
    await expect(importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })).rejects.toThrow('进程中断')
    h.externalWrite() // 外部写入把 5 推到 6
    const resumed = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(resumed.status).toBe('rejected')
    expect(h.state.registerCalls).toHaveLength(2)
    expect(h.state.respondCalls).toHaveLength(1) // 只有中断前那次尝试
  })

  test('答复已落盘但 staging 未及标记：按事务回执核验为 duplicate，不重放', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'h1.txt', bytes: Buffer.from('one') }])
    // 手动模拟「写入成功但进程在标记 applied 前中断」
    const deps = {
      ...h.deps,
      respondSupplement: async (...args: Parameters<typeof h.deps.respondSupplement>) => {
        const result = await h.deps.respondSupplement(...args)
        throw new Error('进程在标记 applied 前中断（模拟）')
      },
    }
    await expect(importT09Package({ caseId, packageJson: JSON.stringify(reply), deps })).rejects.toThrow('标记 applied 前中断')
    expect(h.state.receipts).toHaveLength(1)
    const before = h.state.respondCalls.length
    const resumed = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(resumed.status).toBe('duplicate')
    expect(h.state.respondCalls).toHaveLength(before)
    expect(h.state.revision).toBe(5)
  })

  test('OFF-03：业务成功但 receipts.json 丢失，仍按 actionId 恢复 duplicate', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'i1.txt', bytes: Buffer.from('y') }])
    const first = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(first.status).toBe('accepted')
    const receipts = join(process.env.PROFER_CONFIG_DIR!, 'review-offline', caseId, 'receipts.json')
    expect(existsSync(receipts)).toBe(true)
    rmSync(receipts) // 模拟回执落盘前崩溃/文件丢失
    const writesBefore = h.state.registerCalls.length + h.state.respondCalls.length
    const recovered = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(recovered.status).toBe('duplicate')
    // 未再登记材料、未再答复
    expect(h.state.registerCalls.length + h.state.respondCalls.length).toBe(writesBefore)
  })

  test('附件登记失败：不写答复，重试不重复已成功附件', async () => {
    const h = harness()
    const reply = makeReply([{ name: 'j1.txt', bytes: Buffer.from('one') }, { name: 'j2.txt', bytes: Buffer.from('two') }])
    h.state.failRegisterAt = 2 // 第二份附件登记失败，第一份已成功
    await expect(importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })).rejects.toThrow('材料登记失败')
    expect(h.state.respondCalls).toHaveLength(0)
    const resumed = await importT09Package({ caseId, packageJson: JSON.stringify(reply), deps: h.deps })
    expect(resumed.status).toBe('accepted')
    // 第一份附件已登记成功，重试只补登记第二份，不复制第一份
    expect(h.state.registerCalls).toEqual(['j1.txt', 'j2.txt'])
    expect(h.state.registerAttempts).toBe(3)
    expect(h.state.respondCalls[0]!.expectedRevision).toBe(5)
  })

  test('OFF-06：过期临时附件被回收，新文件保留', () => {
    const root = t09AssetTempRoot()
    const oldFile = join(root, 'old-orphan.bin')
    writeFileSync(oldFile, 'x')
    const past = new Date(Date.now() - 3_600_000)
    utimesSync(oldFile, past, past)
    const freshFile = join(root, 'fresh-orphan.bin')
    writeFileSync(freshFile, 'y')
    const removed = pruneT09AssetTempRoot(60_000)
    expect(removed).toBeGreaterThanOrEqual(1)
    expect(existsSync(oldFile)).toBe(false)
    expect(existsSync(freshFile)).toBe(true)
  })
})
