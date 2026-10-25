/**
 * 通用化能力测试（P0/P1/P2）：领域包、多待审文件、跨文档比对、Vision 附件
 *
 * 被测：`ai-review-service` 的真实路径（通过 mock 网关注入模型输出），
 *   以及 `@profer/shared` 的领域包纯函数。
 *
 * 隔离策略：
 * - `PROFER_CONFIG_DIR` 指向 work/tmp 下唯一目录（与 case-store.test 同款做法）
 * - mock `./review-model-gateway`：
 *     · `resolveReviewGatewayChannel()` 返回伪渠道（让真实路径成立）
 *     · `chatCompletionWithMeta` 记录收到的 messages 并返回预设 JSON
 *     · `extractJson` 用真实实现（通过 importOriginal 透传，保证解析链被测到）
 *
 * 覆盖点：
 * - 领域包：未知 kind 收敛到 'other'；严重度按包内默认值回落；标签查询
 * - 领域 prompt：合同领域包的类别/类型注入 system prompt（不再写死综测）
 * - 多待审文件：两份 application 文档同时进入模型上下文（含文件分隔标记）
 * - 跨文档比对：cross-document-mismatch 的 counterpartAnchor 被正确解析
 * - Vision：图片块转 data URL 内容部件随请求送出；模型拒绝图片时降级并标注
 * - 子代理报告的旧问题：锚点缺失不再导致整单降级
 */
import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReviewCase, SourceDocument } from '@profer/shared'
import {
  BUILTIN_DOMAIN_PACK_IDS,
  FALLBACK_FINDING_KIND,
  findingKindLabel,
  findingKindSeverity,
  isKnownFindingKind,
  resolveDomainPack,
} from '@profer/shared'
// 真实网关命名空间：mock 工厂内展开用（工厂里 require() 取不到 ESM 命名导出）
import * as realGateway from './review-model-gateway'
import type { ReviewChatResult } from './review-model-gateway'

// ===== 隔离配置根 =====
const CONFIG_DIR = join(import.meta.dir, '../../../../../../work/tmp', `profer-test-generic-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = CONFIG_DIR

// ===== 网关 mock 状态 =====
/** mock 网关注入的模型回复（每次调用前设置） */
let nextReply = ''
/** mock 网关是否抛错（模拟模型调用失败） */
let nextError: Error | null = null
/** mock 网关是否报告图片被剔除 */
let nextImagesDropped = false
/** 记录最后一次收到的消息（断言多文档/图片是否送达） */
let lastMessages: Array<{ role: string; content: unknown }> = []
/** 记录调用次数 */
let callCount = 0

mock.module('./review-model-gateway', () => {
  return {
    // extractJson 等纯函数用真实实现（顶层 import 已捕获真实命名空间）
    ...realGateway,
    resolveReviewGatewayChannel: () => ({
      channel: {
        id: 'chan-mock',
        name: 'mock 渠道',
        provider: 'custom',
        baseUrl: 'http://127.0.0.1:1/v1',
        apiKey: '',
        models: [{ id: 'mock-model', name: 'mock', enabled: true }],
        enabled: true,
        createdAt: 0,
        updatedAt: 0,
      },
      apiKey: '',
    }),
    chatCompletion: async (
      _channel: unknown,
      messages: Array<{ role: string; content: unknown }>,
    ): Promise<string> => {
      callCount += 1
      lastMessages = messages
      if (nextError) throw nextError
      return nextReply
    },
    chatCompletionWithMeta: async (
      _channel: unknown,
      messages: Array<{ role: string; content: unknown }>,
    ): Promise<ReviewChatResult> => {
      callCount += 1
      lastMessages = messages
      if (nextError) throw nextError
      return { text: nextReply, imagesDropped: nextImagesDropped }
    },
  }
})

// 动态 import：确保 mock 先生效（bun 的 mock.module 对后续 import 生效）
const { saveCase } = await import('./case-store')
const { runAiReview, extractItems, generateRuleOutline } = await import('./ai-review-service')

// ===== 测试数据构造 =====

/** 造一份最小可审案卷：一份依据 + N 份待审 + 可选图片证明 */
function buildCase(options: {
  domainPackId?: string
  subjectCount?: number
  withImage?: boolean
  /** 用例后缀：保证每个用例的案卷目录独立（图片文件不跨用例残留） */
  suffix?: string
}): ReviewCase {
  const now = new Date().toISOString()
  const caseId =
    `case-generic-${options.subjectCount ?? 1}-${options.withImage ? 'img' : 'txt'}-` +
    `${options.domainPackId ?? 'default'}${options.suffix ? `-${options.suffix}` : ''}`
  const documents: SourceDocument[] = [
    {
      id: 'doc-rule',
      fileName: '审查要点.txt',
      role: 'rule',
      mimeType: 'text/plain',
      sizeBytes: 10,
      parseStatus: 'parsed',
      blocks: [{ id: 'blk-rule-001', kind: 'paragraph', text: '必须约定违约责任。', page: 1 }],
      origin: 'upload',
      importedAt: now,
    },
  ]
  for (let index = 0; index < (options.subjectCount ?? 1); index += 1) {
    documents.push({
      id: `doc-sub-${index + 1}`,
      fileName: `待审文件${index + 1}.txt`,
      role: 'application',
      mimeType: 'text/plain',
      sizeBytes: 10,
      parseStatus: 'parsed',
      blocks: [
        { id: `blk-sub${index + 1}-001`, kind: 'paragraph', text: `第${index + 1}份文件条款正文。`, page: 1 },
      ],
      origin: 'upload',
      importedAt: now,
    })
  }
  if (options.withImage) {
    documents.push({
      id: 'doc-img',
      fileName: '证书.png',
      role: 'evidence',
      mimeType: 'image/png',
      sizeBytes: 68,
      parseStatus: 'partial',
      parseError: '图片内容需经多模态模型识别',
      blocks: [
        {
          id: 'blk-img-001',
          kind: 'image',
          text: '',
          page: 1,
          imageAlt: '',
          imageAssetPath: 'source-docs/证书.png',
        },
      ],
      origin: 'upload',
      importedAt: now,
    })
  }

  const reviewCase: ReviewCase = {
    id: caseId,
    title: '通用化测试案卷',
    type: '自定义审核',
    applicant: '测试方',
    academicYear: '2026',
    createdAt: now,
    updatedAt: now,
    documents,
    rulePacks: [
      {
        id: 'pack-1',
        documentId: 'doc-rule',
        name: '审查要点',
        publisher: '测试',
        academicYear: '2026',
        version: 'v1',
        outline: [
          {
            id: 'outline-1',
            category: '违约责任',
            title: '必须约定违约责任',
            summary: '合同应包含违约责任条款',
            anchors: [{ documentId: 'doc-rule', blockId: 'blk-rule-001', precision: 'block' }],
            generatedBy: 'ai',
          },
        ],
        confirmed: true,
      },
    ],
    items: [
      {
        id: 'item-1',
        title: '待审条款一',
        category: '其他',
        declaredScore: 0,
        anchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
        evidenceDocumentIds: [],
        status: 'identified',
        identifiedBy: 'ai',
      },
    ],
    evidences: options.withImage
      ? [
          {
            documentId: 'doc-img',
            recognizedFacts: '（图片待模型识别）',
            parseStatus: 'unclear',
            linkedItemIds: [],
          },
        ]
      : [],
    isDemo: false,
    ...(options.domainPackId ? { domainPackId: options.domainPackId } : {}),
  }
  saveCase(reviewCase)
  return reviewCase
}

/** 读取 mock 收到的最后一条消息的可读文本（断言 prompt 内容用） */
function lastUserText(): string {
  const user = [...lastMessages].reverse().find((message) => message.role === 'user')
  const content = user?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const textPart = content.find(
      (part): part is { type: 'text'; text: string } =>
        !!part && typeof part === 'object' && (part as { type?: string }).type === 'text',
    )
    return textPart?.text ?? ''
  }
  return ''
}

/** 读取 mock 收到的最后一条 user 消息里的图片部件数量 */
function lastUserImageCount(): number {
  const user = [...lastMessages].reverse().find((message) => message.role === 'user')
  const content = user?.content
  if (!Array.isArray(content)) return 0
  return content.filter(
    (part) => !!part && typeof part === 'object' && (part as { type?: string }).type === 'image_url',
  ).length
}

/** 读取 system prompt 文本 */
function systemText(): string {
  const system = lastMessages.find((message) => message.role === 'system')
  return typeof system?.content === 'string' ? system.content : ''
}

beforeAll(() => {
  mkdirSync(join(CONFIG_DIR, 'review-cases'), { recursive: true })
})

afterAll(() => {
  rmSync(CONFIG_DIR, { recursive: true, force: true })
})

// ===== 1. 领域包纯函数 =====

describe('领域包（review-domain-packs）', () => {
  test('Given 未提供领域包 ID When 解析 Then 回落综测包（历史案卷行为不变）', () => {
    const pack = resolveDomainPack(undefined)
    expect(pack.id).toBe(BUILTIN_DOMAIN_PACK_IDS.comprehensiveAssessment)
    expect(pack.findingKinds.map((spec) => spec.id)).toContain('level-conflict')
  })

  test('Given 未知领域包 ID When 解析 Then 回落缺省包而不抛错', () => {
    expect(resolveDomainPack('not-a-real-pack').id).toBe(BUILTIN_DOMAIN_PACK_IDS.comprehensiveAssessment)
  })

  test('Given 合同领域包 When 查询类型 Then 含合同语义类型且不含量化场景的等级冲突', () => {
    const pack = resolveDomainPack(BUILTIN_DOMAIN_PACK_IDS.contractReview)
    const ids = pack.findingKinds.map((spec) => spec.id)
    expect(ids).toContain('missing-clause')
    expect(ids).toContain('unclear-liability')
    expect(ids).toContain('cross-document-mismatch')
    expect(pack.ruleCategories).toContain('违约责任')
  })

  test('Given 未知问题类型 When 查询标签与严重度 Then 标签回落原字符串、严重度回落 yellow', () => {
    const pack = resolveDomainPack(BUILTIN_DOMAIN_PACK_IDS.contractReview)
    expect(isKnownFindingKind(pack, 'made-up-kind')).toBe(false)
    expect(findingKindLabel(pack, 'made-up-kind')).toBe('made-up-kind')
    expect(findingKindSeverity(pack, 'made-up-kind')).toBe('yellow')
  })

  test('Given 包内已知类型 When 查询严重度 Then 返回包内默认值（不一律 yellow）', () => {
    const pack = resolveDomainPack(BUILTIN_DOMAIN_PACK_IDS.contractReview)
    expect(findingKindSeverity(pack, 'missing-clause')).toBe('red')
    expect(findingKindSeverity(pack, 'unbalanced-obligation')).toBe('yellow')
  })
})

describe('规则大纲结构化约束真实协议', () => {
  test('prompt 请求 constraint，并严格丢弃不可安全执行的 score-value 与非法日期', async () => {
    const reviewCase = buildCase({ suffix: 'rule-constraints' })
    reviewCase.documents[0]!.blocks = [{ id: 'blk-rule-001', kind: 'paragraph', text: '国家级一等奖 8 分，省级二等奖 4 分；所有竞赛类加分累计不超过 10 分；须提供获奖证书；原则上具有较高影响力。', page: 1 }]
    saveCase(reviewCase)
    nextReply = JSON.stringify([
      { category: '等级分值', title: '竞赛等级映射', summary: '国家级一等奖 8 分，省级二等奖 4 分', constraint: { kind: 'level-mapping', levels: { '国家级一等奖': 8, '省级二等奖': 4 } }, anchors: [] },
      { category: '分值上限', title: '累计上限', summary: '竞赛类加分累计不超过 10 分', constraint: { kind: 'max-score', value: 10 }, anchors: [] },
      { category: '材料要求', title: '获奖证书', summary: '须提供获奖证书', constraint: { kind: 'required-evidence', requiredEvidenceTypes: ['获奖证书'] }, anchors: [] },
      { category: '语义规则', title: '影响力', summary: '原则上具有较高影响力', constraint: null, anchors: [] },
      { category: '分值', title: '缺少适用范围的固定分值', summary: '不得全局应用', constraint: { kind: 'score-value', value: 4 }, anchors: [] },
      { category: '时间', title: '非法日期', summary: '日期需校验', constraint: { kind: 'date-range', dateFrom: '2026-99-99' }, anchors: [] },
    ])

    const outline = await generateRuleOutline({ caseId: reviewCase.id, rulePackId: 'pack-1' })
    expect(outline[0]?.constraint).toEqual({ kind: 'level-mapping', levels: { '国家级一等奖': 8, '省级二等奖': 4 } })
    expect(outline[1]?.constraint).toEqual({ kind: 'max-score', value: 10 })
    expect(outline[2]?.constraint).toEqual({ kind: 'required-evidence', requiredEvidenceTypes: ['获奖证书'] })
    expect(outline[3]?.constraint).toBeUndefined()
    expect(outline[4]?.constraint).toBeUndefined()
    expect(outline[5]?.constraint).toBeUndefined()
    const system = String(lastMessages.find((message) => message.role === 'system')?.content ?? '')
    expect(system).toContain('constraint')
    expect(system).toContain('level-mapping')
    expect(system).toContain('不得猜测')
  })
})

// ===== 2. 领域化 prompt 与发现解析 =====

describe('runAiReview 领域化（P1）', () => {
  test('Given 合同领域包 When 审核 Then system prompt 注入合同类别与类型（不再写死综测）', async () => {
    const reviewCase = buildCase({ domainPackId: BUILTIN_DOMAIN_PACK_IDS.contractReview })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'missing-clause',
        severity: 'red',
        title: '缺少违约责任条款',
        detail: '依据要求必须约定违约责任，待审文件未包含。',
        suggestionText: '补充违约责任条款。',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
        ruleAnchors: [{ documentId: 'doc-rule', blockId: 'blk-rule-001', precision: 'block' }],
      },
    ])

    const outcome = await runAiReview(reviewCase)

    expect(outcome.engine).toBe('ai')
    expect(outcome.findings).toHaveLength(1)
    expect(outcome.findings[0]!.kind).toBe('missing-clause')
    const prompt = systemText()
    expect(prompt).toContain('contract clause')
    expect(prompt).toContain('违约责任')
    expect(prompt).not.toContain('学生综合素质测评')
  })

  test('Given 模型输出领域外的类型 When 解析 Then 收敛到兜底类型 other（不丢结论）', async () => {
    const reviewCase = buildCase({ domainPackId: BUILTIN_DOMAIN_PACK_IDS.contractReview })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'totally-unknown-kind',
        severity: 'red',
        title: '某种问题',
        detail: '说明',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    const outcome = await runAiReview(reviewCase)

    expect(outcome.findings).toHaveLength(1)
    expect(outcome.findings[0]!.kind).toBe(FALLBACK_FINDING_KIND)
    // 模型显式给的 severity 合法 → 保留 red
    expect(outcome.findings[0]!.severity).toBe('red')
  })

  test('Given 模型未给 severity 且类型属包内黄的 When 解析 Then 用包内默认严重度（非硬编码 yellow）', async () => {
    const reviewCase = buildCase({ domainPackId: BUILTIN_DOMAIN_PACK_IDS.contractReview })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'unclear-payment',
        title: '付款条件不明',
        detail: '说明',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    const outcome = await runAiReview(reviewCase)
    expect(outcome.findings[0]!.severity).toBe('yellow')
  })
})

// ===== 3. 多待审文件（P2/D16） =====

describe('多待审文件（P2）', () => {
  test('Given 两份待审文件 When 审核 Then 两份块文本都进入模型上下文且带文件分隔标记', async () => {
    const reviewCase = buildCase({ subjectCount: 2 })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'info-incomplete',
        severity: 'yellow',
        title: '示例问题',
        detail: '说明',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    await runAiReview(reviewCase)

    const text = lastUserText()
    expect(text).toContain('待审文件1.txt')
    expect(text).toContain('待审文件2.txt')
    expect(text).toContain('blk-sub1-001')
    expect(text).toContain('blk-sub2-001')
    expect(text).toContain('跨文件比对')
  })

  test('Given 显式声明 subjectDocumentIds When 审核 Then 待审主体以声明为准', async () => {
    const reviewCase = buildCase({ subjectCount: 2 })
    const declared: ReviewCase = { ...reviewCase, subjectDocumentIds: ['doc-sub-2'] }
    saveCase(declared)
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'info-incomplete',
        severity: 'yellow',
        title: '示例问题',
        detail: '说明',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-2', blockId: 'blk-sub2-001', precision: 'block' },
      },
    ])

    await runAiReview(declared)

    const text = lastUserText()
    // 只声明第二份 → 待审文件小节只含第二份块，且无多文件分隔标记。
    // 注意：【待审条目】JSON 里 item-1 的 anchor 仍指向 doc-sub-1，属正确行为（条目是既有数据，不受主体声明影响）。
    const subjectSection = text.slice(text.indexOf('【待审文件】'), text.indexOf('【证明识别结果】'))
    expect(subjectSection).toContain('blk-sub2-001')
    expect(subjectSection).not.toContain('blk-sub1-001')
    expect(subjectSection).not.toContain('待审文件1.txt')
  })

  test('Given 两份待审文件 When AI 报跨文件矛盾 Then counterpartAnchor 被保留供联动高亮', async () => {
    const reviewCase = buildCase({ subjectCount: 2 })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'cross-document-mismatch',
        severity: 'red',
        title: '两份文件金额不一致',
        detail: '第一份写 10 万，第二份写 20 万。',
        suggestionText: '核对并统一金额。',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
        counterpartAnchor: { documentId: 'doc-sub-2', blockId: 'blk-sub2-001', precision: 'block' },
      },
    ])

    const outcome = await runAiReview(reviewCase)

    expect(outcome.findings[0]!.kind).toBe('cross-document-mismatch')
    expect(outcome.findings[0]!.counterpartAnchor).toEqual({
      documentId: 'doc-sub-2',
      blockId: 'blk-sub2-001',
      precision: 'block',
    })
  })

  test('Given 案卷无待审文件 When 审核 Then 如实失败而不产出任何结论（M0/H04）', async () => {
    const reviewCase = buildCase({ subjectCount: 0 })
    nextError = null
    nextImagesDropped = false
    nextReply = '[]'

    await expect(runAiReview(reviewCase)).rejects.toThrow('待审文件')
  })
})

// ===== 4. Vision 图片通路（P0/D13） =====

describe('Vision 图片通路（P0）', () => {
  test('Given 案卷含图片证明 When 审核 Then 图片以 data URL 内容部件随请求送出', async () => {
    const reviewCase = buildCase({ withImage: true, suffix: 'with-asset' })
    // 写入真实图片文件（1x1 PNG），供 collectVisionImages 读取
    const assetDir = join(CONFIG_DIR, 'review-cases', reviewCase.id, 'source-docs')
    mkdirSync(assetDir, { recursive: true })
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
      'base64',
    )
    writeFileSync(join(assetDir, '证书.png'), png)

    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'info-incomplete',
        severity: 'yellow',
        title: '图片已读',
        detail: '依据图片内容判定。',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    await runAiReview(reviewCase)

    expect(lastUserImageCount()).toBe(1)
    expect(lastUserText()).toContain('随附图片')
    // 图片数据本身不应出现在文本里（只作为 image_url 部件）
    expect(lastUserText()).not.toContain('iVBORw0KGgo')
  })

  test('Given 模型不支持图片 When 审核 Then 去图重试成功并在结论里显式标注', async () => {
    const reviewCase = buildCase({ withImage: true, suffix: 'dropped' })
    const assetDir = join(CONFIG_DIR, 'review-cases', reviewCase.id, 'source-docs')
    mkdirSync(assetDir, { recursive: true })
    writeFileSync(
      join(assetDir, '证书.png'),
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
        'base64',
      ),
    )

    nextError = null
    nextImagesDropped = true
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'info-incomplete',
        severity: 'yellow',
        title: '无图判定',
        detail: '仅按文本判定。',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    const outcome = await runAiReview(reviewCase)

    expect(outcome.findings[0]!.detail).toContain('未包含图片内容')
  })

  test('Given 图片文件缺失 When 审核 Then 不因读图失败而中断审核', async () => {
    // 独立案卷目录且不写图片文件 → 走"读图失败记警告并跳过"分支
    const reviewCase = buildCase({ withImage: true, suffix: 'no-asset' })
    // 故意不写图片文件 → collectVisionImages 记 warning 并跳过
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'info-incomplete',
        severity: 'yellow',
        title: '仍出结论',
        detail: '说明',
        suggestionText: '建议',
        subjectAnchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
      },
    ])

    const outcome = await runAiReview(reviewCase)
    expect(outcome.engine).toBe('ai')
    expect(outcome.findings).toHaveLength(1)
    expect(lastUserImageCount()).toBe(0)
  })
})

// ===== 5. 条目识别多文档 =====

describe('extractItems 多待审文件（P2）', () => {
  test('Given 两份待审文件 When 识别条目 Then 两份文件内容都送入模型', async () => {
    const reviewCase = buildCase({ subjectCount: 2 })
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        id: 'item-ai-1',
        title: '第一份文件的事项',
        category: '其他',
        declaredScore: 0,
        anchor: { documentId: 'doc-sub-1', blockId: 'blk-sub1-001', precision: 'block' },
        evidenceDocumentIds: [],
      },
    ])

    const items = await extractItems(reviewCase.id)

    expect(items).toHaveLength(1)
    const text = lastUserText()
    expect(text).toContain('待审文件1.txt')
    expect(text).toContain('待审文件2.txt')
    expect(systemText()).toContain('2 份待审文件')
  })

  test('Given 无待审文件 When 识别条目 Then 明确失败且保留既有条目', async () => {
    const reviewCase = buildCase({ subjectCount: 0 })
    nextError = null
    await expect(extractItems(reviewCase.id)).rejects.toThrow('没有待审文件')
  })
})

// ===== 6. 旧问题回归：锚点缺失不再导致整单降级 =====

describe('锚点宽进严出（回归）', () => {
  test('Given 模型未给任何锚点 When 审核 Then 结论保留并兜底到文件级锚点', async () => {
    const reviewCase = buildCase({})
    nextError = null
    nextImagesDropped = false
    nextReply = JSON.stringify([
      {
        itemId: 'item-1',
        kind: 'non-compliant',
        title: '缺锚点的问题',
        detail: '说明',
        suggestionText: '建议',
      },
    ])

    const outcome = await runAiReview(reviewCase)

    expect(outcome.engine).toBe('ai')
    expect(outcome.findings).toHaveLength(1)
    const finding = outcome.findings[0]!
    expect(finding.subjectAnchor.documentId).not.toBe('')
    expect(finding.ruleAnchors.length).toBeGreaterThan(0)
    expect(finding.subjectAnchor.precision).toBe('document')
  })

  test('Given 真实案卷模型调用失败 When 审核 Then 如实报错且不生成模拟结论', async () => {
    const reviewCase = buildCase({})
    nextError = new Error('模拟的网络错误')
    await expect(runAiReview(reviewCase)).rejects.toThrow('未生成模拟结论')
    expect(callCount).toBeGreaterThan(0)
    nextError = null
  })

  test('Given 演示案卷模型调用失败 When 审核 Then 仍允许显式模拟结果', async () => {
    const reviewCase = { ...buildCase({}), isDemo: true }
    nextError = new Error('模拟的网络错误')
    expect((await runAiReview(reviewCase)).engine).toBe('mock-engine')
    nextError = null
  })

  test('Given 图片与文本证明同时存在 When 审核 Then 文本证明和来源注册表也进入多模态请求', async () => {
    const reviewCase = buildCase({ withImage: true, suffix: 'mixed-proof' })
    const assetDir = join(CONFIG_DIR, 'review-cases', reviewCase.id, 'source-docs')
    mkdirSync(assetDir, { recursive: true })
    writeFileSync(join(assetDir, '证书.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64'))
    reviewCase.documents.push({ ...reviewCase.documents[0]!, id: 'doc-text-proof', role: 'evidence', fileName: '电子证明.txt', blocks: [{ id: 'blk-proof', kind: 'paragraph', text: '核验码 QA-MIXED-PROOF-4488', page: 1 }] })
    nextError = null
    nextImagesDropped = false
    nextReply = '[]'
    const outcome = await runAiReview(reviewCase)
    expect(lastUserText()).toContain('QA-MIXED-PROOF-4488')
    expect(lastUserText()).toContain('来源注册表')
    expect(lastUserText()).toContain('doc-text-proof')
    expect(lastUserImageCount()).toBe(1)
    expect(outcome.findings).toHaveLength(0)
    expect(outcome.coverage.ruleUncoveredItemIds).toHaveLength(0)
  })

  test('Given 真实案卷识别服务失败 When 识别 Then 保留原条目并返回明确失败', async () => {
    const reviewCase = buildCase({ suffix: 'extract-failure' })
    nextError = new Error('识别端点不可用')
    await expect(extractItems(reviewCase.id)).rejects.toThrow('已有条目未改动')
    nextError = null
  })
})
