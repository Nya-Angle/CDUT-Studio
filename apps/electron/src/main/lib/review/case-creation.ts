/**
 * 空案卷创建（IPC CREATE_CASE 实现）
 *
 * 与 case-store 解耦：case-store 只管持久化，这里负责业务默认值。
 */

import { getConfigDir } from '../config-paths'
import type { ReviewCase, ReviewCaseType } from '@profer/shared'
import { saveCase } from './case-store'

/** 新案卷默认标题前缀 */
const UNTITLED_PREFIX = '未命名案卷'

/**
 * 创建空案卷并持久化。
 *
 * @throws input.title 等字段非法时由 saveCase 的安全校验兜底（案卷 ID 服务端生成，不受用户输入影响）
 */
export function createEmptyCase(input: {
  title: string
  type: ReviewCaseType
  applicant: string
  academicYear: string
  /** 审核领域包 ID（P1/D14）；缺省时由解析函数回落综测包 */
  domainPackId?: string
  /** 项目创建时固定使用的已发布模板版本。 */
  reviewTemplate?: { templateId: string; version: number }
}): ReviewCase {
  const now = new Date().toISOString()
  const reviewCase: ReviewCase = {
    id: `case-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim() || UNTITLED_PREFIX,
    type: input.type,
    applicant: input.applicant.trim(),
    academicYear: input.academicYear.trim(),
    createdAt: now,
    updatedAt: now,
    documents: [],
    rulePacks: [],
    items: [],
    evidences: [],
    isDemo: false,
    ...(input.domainPackId ? { domainPackId: input.domainPackId } : {}),
    ...(input.reviewTemplate ? { reviewTemplate: input.reviewTemplate } : {}),
  }
  saveCase(reviewCase)
  console.log(`[审核专区] 已创建案卷: ${reviewCase.id}（${reviewCase.title}）`)
  return reviewCase
}

// getConfigDir 仅用于保证配置目录在创建案卷前已存在（saveCase 内部同样会建目录）
void getConfigDir
