/**
 * Shared type definitions for proma
 */

// Placeholder types - will be expanded as needed
export interface Workspace {
  id: string
  name: string
  path: string
}

// 运行时相关类型
export * from './runtime'

// 渠道（AI 供应商）相关类型
export * from './channel'

// 代理配置相关类型
export * from './proxy'

// Chat 相关类型
export * from './chat'

// Agent 相关类型
export * from './agent'
export * from './remote-sync'
export * from './agent-preview'
export * from './global-skill'
export * from './browser'
export * from './pi-harness'
export * from './ppt-deck'

// Lark 集成相关类型
export * from './lark'

// 推理 profile 相关类型
export * from './reasoning-profile'

// DeepSeek 官方短名 ↔ 正式 ID 别名
export * from './deepseek-model-alias'

// Agent Provider 适配器接口
export * from './agent-provider'

// 环境检测相关类型
export * from './environment'

// 第三方安装包（Git、Node.js 等）相关类型
export * from './installer'

// GitHub Release 相关类型
export * from './github'

// 版本更新日志（CHANGELOG）相关类型
export * from './changelog'

// 系统提示词相关类型
export * from './system-prompt'
export * from './agent-preset'
export * from './agent-preset-policy'

// Chat 工具（function calling）相关类型
export * from './chat-tool'

// 飞书集成相关类型
export * from './feishu'

// 钉钉集成相关类型
export * from './dingtalk'

// 微信集成相关类型
export * from './wechat'

// 定时任务（Automation）相关类型
export * from './automation'
export * from './recommendation'

// 论文知识库（Paper Knowledge Base）相关类型
export * from './knowledge-base'

// 本地任务与日程（Planning）相关类型
export * from './planning'

// 内容审核专区（Content Review）相关类型
export * from './review'
export * from './review-v2'
export * from './review-v2-contracts'
export * from './review-authoring-v1'
export * from './review-d2'
export * from './review-d3'

// CDUT 专区特区账户相关类型
export * from './cdut'

// AI 速课堂（学习资料大纲与学生认知档案）相关类型
export * from './study'

// 下一代高精 PDF 解析引擎（全要素文档 AST 契约）
export * from './pdf'

// Review V3 C0 frozen cross-track contracts (no second Case store).
export * from './review-v3-c0'

// Review V3 signed CR-A-001 proposal-only event transport; C0/1 stays frozen.
export * from './review-v3-execution'

// Review V3 C-owned durable Run evidence snapshot; not a Decision/Gold ACK.
export * from './review-v3-run'

// CDUT Science (CSLab) 相关类型
export * from './cslab'
export * from './cslab-origin-types'
export * from './cslab-vesta-types'
