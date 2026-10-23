/**
 * 案卷存储（case-store）测试
 *
 * 被测：assertSafeId / saveCase / getCase / listCases / deleteCase / loadDemoCase。
 *
 * 隔离策略：PROFER_CONFIG_DIR 指向唯一临时目录（基于 Date.now 保证跨进程不撞车）。
 * config-paths.getConfigDir() 在每次调用时才读环境变量（模块加载不读），
 * 因此本文件顶部的赋值在任何 test() 执行前生效即可；静态 import case-store 安全。
 *
 * 覆盖点：
 * - assertSafeId：合法 id 通过；../evil、a/b、空串、.. 全部 throw
 * - saveCase → getCase 往返一致（用 buildDemoCase 改 id）
 * - 落盘路径 {getReviewCasesDir}/{id}/case.json 存在，且同目录无 .tmp 残片（原子写）
 * - listCases 包含刚存的案卷
 * - deleteCase 后 getCase 返回 undefined
 * - loadDemoCase：两次调用同 id，第二次不重复写入（updatedAt/mtime 不变）
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewCase } from '@profer/shared'
import {
  CaseRevisionConflictError,
  computeCaseInputHash,
  updateCase,
  DEMO_CASE_ID,
  assertSafeId,
  deleteCase,
  getCase,
  getReviewCasesDir,
  listCases,
  loadDemoCase,
  saveCase,
} from './case-store'
import { buildDemoCase } from './demo-fixtures/demo-case-fixture'

// ===== 隔离配置根（必须在任何 case-store 函数调用前生效）=====
// getConfigDir() 是运行时读 env，故此赋值先于全部 test() 即可。
// 配置根由本文件位置上溯到仓库根再拼 work/tmp（与 document-service.test 同款，避免写死本机绝对路径）。
const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-case-store-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR

afterAll(() => {
  // 测试配置目录整体清理，不在 work/tmp 留残留
  rmSync(CONFIG_DIR, { recursive: true, force: true })
})

/** 测试用案卷 ID（合法字符集内） */
const TEST_CASE_ID = 'case-test-001'

/** 由 fixture 派生的测试案卷（改 id，避免污染 demo 案卷语义） */
function buildTestCase(): ReviewCase {
  return { ...buildDemoCase(), id: TEST_CASE_ID }
}

describe('assertSafeId', () => {
  test('Given 合法 id When 校验 Then 不抛出', () => {
    // 字母 / 数字 / 连字符 / 下划线均合法
    expect(() => assertSafeId('case-ok_1')).not.toThrow()
    expect(() => assertSafeId('demo-zhangsan-2026')).not.toThrow()
    expect(() => assertSafeId('A1_b2-c3')).not.toThrow()
  })

  test('Given 路径穿越或非法字符 id When 校验 Then 全部 throw（中文错误）', () => {
    for (const badId of ['../evil', 'a/b', '', '..']) {
      expect(() => assertSafeId(badId)).toThrow('无效的 ID')
    }
    // 补充：空格与点号同样被拒（SAFE_ID_RE 只允许 [a-zA-Z0-9_-]）
    expect(() => assertSafeId('x y')).toThrow()
    expect(() => assertSafeId('x.y')).toThrow()
  })
})

describe('saveCase / getCase', () => {
  test('Given 改过 id 的 demo 案卷 When 保存后读回 Then 往返一致', () => {
    const source = buildTestCase()
    saveCase(source)

    const loaded = getCase(TEST_CASE_ID)
    expect(loaded).toBeDefined()
    // JSON 往返：对象深比较（无 Date 等非 JSON 类型，直接 toEqual 安全）
    expect(loaded).toEqual(source)
    expect(loaded!.id).toBe(TEST_CASE_ID)
    expect(loaded!.items).toHaveLength(6)
    expect(loaded!.documents).toHaveLength(6)
  })

  test('Given 已保存案卷 When 检查落盘 Then case.json 存在且同目录无 .tmp 残片（原子写）', () => {
    saveCase(buildTestCase())

    const caseDir = join(getReviewCasesDir(), TEST_CASE_ID)
    const caseFile = join(caseDir, 'case.json')
    expect(existsSync(caseFile)).toBe(true)

    // 文件本身是合法 JSON
    const parsed = JSON.parse(readFileSync(caseFile, 'utf-8')) as ReviewCase
    expect(parsed.id).toBe(TEST_CASE_ID)

    // 原子写约束：写 .tmp 再 rename，正常完成后同目录不得残留任何 .tmp
    const entries = readdirSync(caseDir)
    expect(entries.filter((name) => name.endsWith('.tmp'))).toEqual([])
  })

  test('Given 已保存案卷 When 列出案卷 Then 包含刚存的案卷且摘要字段正确', () => {
    saveCase(buildTestCase())

    const summaries = listCases()
    const matched = summaries.find((summary) => summary.id === TEST_CASE_ID)

    expect(matched).toBeDefined()
    expect(matched!.title).toBe('综测加分审核演示案卷（模拟）· 张三（模拟）')
    expect(matched!.documentCount).toBe(6)
    expect(matched!.applicant).toBe('张三（模拟）')
    // 从未运行过审核 → lastRunStatus 为空
    expect(matched!.lastRunStatus).toBeUndefined()
  })

  test('Given 已保存案卷 When 删除 Then getCase 返回 undefined 且目录消失', () => {
    saveCase(buildTestCase())
    expect(getCase(TEST_CASE_ID)).toBeDefined()

    deleteCase(TEST_CASE_ID)

    expect(getCase(TEST_CASE_ID)).toBeUndefined()
    expect(existsSync(join(getReviewCasesDir(), TEST_CASE_ID))).toBe(false)
  })

  test('Given 不存在的案卷 id When 删除 Then 静默不抛出（幂等）', () => {
    expect(() => deleteCase('case-never-existed-xyz')).not.toThrow()
  })
})

describe('loadDemoCase', () => {
  test('Given 首次载入 When 连续调用两次 Then 同一 id 且第二次不重复写入', () => {
    const first = loadDemoCase()
    expect(first.id).toBe(DEMO_CASE_ID)
    expect(first.id).toBe('demo-zhangsan-2026')

    const caseFile = join(getReviewCasesDir(), DEMO_CASE_ID, 'case.json')
    expect(existsSync(caseFile)).toBe(true)
    const mtimeBefore = statSync(caseFile).mtimeMs
    const entriesBefore = readdirSync(join(getReviewCasesDir(), DEMO_CASE_ID))

    // 间隔片刻再调用，若重复写入则 mtime 必变
    const second = loadDemoCase()
    const mtimeAfter = statSync(caseFile).mtimeMs
    const entriesAfter = readdirSync(join(getReviewCasesDir(), DEMO_CASE_ID))

    expect(second.id).toBe(first.id)
    // 已存在 → 直接读盘返回，updatedAt（fixture 内容）与磁盘 mtime 均不变
    expect(second.updatedAt).toBe(first.updatedAt)
    expect(mtimeAfter).toBe(mtimeBefore)
    expect(entriesAfter).toEqual(entriesBefore)
    // 目录内只有 case.json（无 .tmp）
    expect(entriesAfter.filter((name) => name.endsWith('.tmp'))).toEqual([])
  })

  test('Given 已载入的 demo 案卷 When 列出案卷 Then 只含 demo 一条（无测试案卷残留）', () => {
    loadDemoCase()
    const summaries = listCases()
    const demoSummaries = summaries.filter((summary) => summary.isDemo === true)

    expect(demoSummaries.map((summary) => summary.id)).toEqual([DEMO_CASE_ID])
  })
})

// ===== M0 批1：updateCase 串行/修订冲突 + 输入指纹（H05/H06） =====

describe('updateCase（M0/H05）', () => {
  test('Given 已存案卷 When 定向更新 Then revision+1 且字段落盘', async () => {
    saveCase(buildTestCase())
    const updated = await updateCase(TEST_CASE_ID, (fresh) => ({ ...fresh, title: '改后标题' }), { reason: '测试' })
    expect(updated.revision).toBe(1)
    expect(updated.title).toBe('改后标题')
    expect(getCase(TEST_CASE_ID)?.title).toBe('改后标题')
  })

  test('Given expectedRevision 过期 When 更新 Then 抛修订冲突并携带当前值', async () => {
    saveCase({ ...buildTestCase(), title: '并发前' })
    const current = getCase(TEST_CASE_ID)!
    await updateCase(TEST_CASE_ID, (fresh) => ({ ...fresh, title: '别人先改了' }))
    try {
      await updateCase(TEST_CASE_ID, () => getCase(TEST_CASE_ID)!, { expectedRevision: current.revision ?? 0 })
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(CaseRevisionConflictError)
      const conflict = error as CaseRevisionConflictError
      expect(conflict.currentRevision).toBe((current.revision ?? 0) + 1)
    }
  })

  test('Given 两个并发更新 When 同案写队列 Then 两个定向 patch 都保留（不丢字段）', async () => {
    saveCase(buildTestCase())
    // 模拟识别与导入交错：一个改 items、一个加 documents
    const [a, b] = await Promise.all([
      updateCase(TEST_CASE_ID, (fresh) => ({ ...fresh, items: [{ ...fresh.items[0]!, id: 'item-new' }] })),
      updateCase(TEST_CASE_ID, (fresh) => ({ ...fresh, documents: [...fresh.documents, { ...fresh.documents[0]!, id: 'doc-new' }] })),
    ])
    const final = getCase(TEST_CASE_ID)!
    expect(final.items.some((item) => item.id === 'item-new')).toBeTrue()
    expect(final.documents.some((doc) => doc.id === 'doc-new')).toBeTrue()
    // 两次定向更新各 +1：串行队列保证修订号单调
    expect(final.revision).toBe(2)
    expect(final.revision).toBe(b.revision)
  })
})

describe('computeCaseInputHash（M0/H06）', () => {
  test('Given 同文档数/事项数但字段值不同 When 计算指纹 Then 哈希不同（K06）', () => {
    const base = buildTestCase()
    const modified: ReviewCase = {
      ...base,
      items: base.items.map((item, index) => (index === 0 ? { ...item, activityDate: '2026-01-02' } : item)),
    }
    // 同数量同 updatedAt：旧指纹（updatedAt+数量）无法检出，新指纹必须不同
    expect(computeCaseInputHash(base)).not.toBe(computeCaseInputHash(modified))
  })

  test('Given 内容相同 When 计算指纹 Then 稳定一致', () => {
    const base = buildTestCase()
    expect(computeCaseInputHash(base)).toBe(computeCaseInputHash(buildTestCase()))
  })

  test('Given 案件模板或手写规则变化 When 计算指纹 Then 审核输入标记为新版本', () => {
    const base = buildTestCase()
    expect(computeCaseInputHash(base)).not.toBe(computeCaseInputHash({
      ...base,
      reviewTemplate: { templateId: 'local-template', version: 2 },
      manualRules: [{ id: 'rule-1', title: '时间范围', requirement: '活动必须处于申报周期内。' }],
    }))
  })

  test('Given 与审核无关的元数据变化（updatedAt/revision） When 计算指纹 Then 不变', () => {
    const base = buildTestCase()
    const touched: ReviewCase = { ...base, updatedAt: '2030-01-01T00:00:00.000Z', revision: 99 }
    expect(computeCaseInputHash(base)).toBe(computeCaseInputHash(touched))
  })
})
