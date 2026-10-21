/** T01 作者侧版本派生。发布版和参考配置的确认只属于原始规则版本。 */
import type { TemplateVersion } from '@profer/shared'
import { resetT01ImportedConfirmations } from './review-v3-t01-typed-criteria'

/** 新版本可以复用结构，但必须由负责人重新确认数值规则。 */
export function forkT01TemplateVersion(source: TemplateVersion, version: number, createdAt: string): TemplateVersion {
  if (!Number.isSafeInteger(version) || version <= source.version) throw new Error('T01_VERSION_NOT_NEWER')
  const { publishedAt: _publishedAt, ...rest } = source
  return resetT01ImportedConfirmations({ ...rest, version, status: 'draft', createdAt })
}

/** 拷贝配置绝不继承原模板的发布状态与数值规则确认。 */
export function copyT01TemplateConfiguration(source: TemplateVersion, templateId: string, createdAt: string): TemplateVersion {
  const { publishedAt: _publishedAt, ...rest } = source
  return resetT01ImportedConfirmations({
    ...rest, templateId, version: 1, name: `${source.name}（我的配置）`,
    status: 'draft', catalogKind: 'custom', createdAt,
  })
}
