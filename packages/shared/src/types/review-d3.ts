/**
 * D3 跨工作区共享模块最小固定契约。
 * D1 workspace revision 是可编辑草稿；D3 (moduleId, version, digest) 是冻结复用资产。
 * 这些资产只约束制作、技术预审与追溯，不授予学校制度或行政审批权。
 */
import type { ReviewAuthoringModuleV1, ReviewAuthoringWorkspaceV1 } from './review-authoring-v1'

export interface ReviewD3ModuleLock {
  moduleId: string
  version: number
  digest: string
}

export interface ReviewD3FrozenModule {
  schemaVersion: 1
  status: 'shared-frozen'
  module: ReviewAuthoringModuleV1
  digest: string
  dependencies: ReviewD3ModuleLock[]
  /** 校验过的合成测试 / 模块预审资产的定位；不表示真实业务审核已经合格。 */
  exampleIds: string[]
}

export interface ReviewD3TransferBundle {
  schemaVersion: 1
  status: 'technical-authoring-only'
  publicationAllowed: false
  workspace: ReviewAuthoringWorkspaceV1
  /** 所有锁定版本的定义与递归依赖均内联，可离线进入新配置目录。 */
  frozen: ReviewD3FrozenModule[]
  /** 整份交付包内容完整性；不是可信数字签名。 */
  fingerprint: string
}

export interface ReviewD3Usage {
  workspaceId: string
  templateId: string
  templateVersion: number
  moduleId: string
  moduleVersion: number
  digest: string
  usePath: string
}
