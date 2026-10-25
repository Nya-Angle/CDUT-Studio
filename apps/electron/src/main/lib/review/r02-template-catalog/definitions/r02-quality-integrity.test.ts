import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { TemplateVersion } from '@profer/shared'
import { validateTemplate } from '../../template-store'

const definitionsDir = import.meta.dir
const repoRoot = resolve(definitionsDir, '../../../../../../../..')
const documentDir = join(repoRoot, 'docs/design/review-agent/business-templates/R02')
const definitions = readdirSync(definitionsDir)
  .filter((name) => /^(?:S0[1-8]|T0[1-8])-T\d{2}\.ts$/.test(name))
  .sort()

describe('R02 非校方研究候选的跨批次质量合同', () => {
  test('Given 31+ 批候选 When 汇总 Then ID 唯一、143 份成对存在且 T02-T08 不伪造原件', async () => {
    expect(definitions).toHaveLength(143)
    expect(new Set(definitions).size).toBe(definitions.length)
    expect(definitions).not.toContain('T02-T08.ts')
    for (const filename of definitions) {
      expect(existsSync(join(documentDir, filename.replace(/\.ts$/, '.md')))).toBeTrue()
    }
  })

  test('Given R02 模板 When 读取定义 Then 一律保留非官方研究、无政策冒名及无自动通过', async () => {
    for (const filename of definitions) {
      const module = await import('./' + filename) as {
        templateVersion?: TemplateVersion
        r02Metadata?: { templateId: string; officialSchoolTemplate: false }
      }
      const template = module.templateVersion
      if (!template) throw new Error(`R02 缺少 templateVersion 导出：${filename}`)
      expect(template?.templateId).toBe(filename.slice(0, -3))
      expect(template?.status).toBe('draft')
      expect(template?.sourceNote?.startsWith('R02_RESEARCH_TEMPLATE_NONOFFICIAL:')).toBeTrue()
      expect(template?.policyVersionIds).toEqual([])
      expect(template?.autoPassPolicy?.enabled).toBeFalse()
      // 使用主应用实际模板校验器复核全部 143 份定义，而不只做静态字段检查。
      expect(validateTemplate(template).filter((issue) => issue.level === 'error'), filename).toEqual([])
      if (module.r02Metadata) {
        expect(module.r02Metadata.templateId).toBe(template?.templateId)
        expect(module.r02Metadata.officialSchoolTemplate).toBeFalse()
      }
      expect(template?.sections?.flatMap((section) => section.criteria).length).toBeGreaterThan(0)
    }
  })

  test('Given 声明来源哈希的研究候选 When 核对当前 MD Then 文件字节必须一致', async () => {
    for (const filename of definitions) {
      const module = await import('./' + filename) as {
        r02Metadata?: { sourceDocumentPath?: string; sourceDocumentSha256?: string }
      }
      const path = module.r02Metadata?.sourceDocumentPath
      const declared = module.r02Metadata?.sourceDocumentSha256
      if (!path || !declared) continue
      const realPath = resolve(repoRoot, path)
      expect(existsSync(realPath)).toBeTrue()
      const actual = createHash('sha256').update(readFileSync(realPath)).digest('hex')
      expect(actual).toBe(declared)
    }
  })
})
