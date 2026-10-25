/** R02 候选只能进入作者态；这里真实调用模板存储，不用模拟发布接口。 */
import { afterAll, expect, test } from 'bun:test'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TemplateVersion } from '@profer/shared'

const isolatedConfig = mkdtempSync(join(tmpdir(), 'r02-template-compat-'))
process.env.PROFER_CONFIG_DIR = isolatedConfig
afterAll(() => rmSync(isolatedConfig, { recursive: true, force: true }))

const { saveAuthoringCandidateDraft, getTemplate, isTemplateCandidateHeld, publishTemplate, listTemplates } =
  await import('../../template-store')

test('143 份 R02 定义能实际登记及回读作者态，无法越过正式发布门槛', async () => {
  const files = readdirSync(import.meta.dir)
    .filter((name) => /^(?:S0[1-8]|T0[1-8])-T\d{2}\.ts$/.test(name)).sort()
  expect(files).toHaveLength(143)
  for (const file of files) {
    const { templateVersion } = await import('./' + file) as { templateVersion: TemplateVersion }
    expect(saveAuthoringCandidateDraft(templateVersion).status, file).toBe('draft')
    expect(getTemplate(templateVersion.templateId, templateVersion.version)?.name, file).toBe(templateVersion.name)
    expect(isTemplateCandidateHeld(templateVersion.templateId, templateVersion.version), file).toBeTrue()
    expect(() => publishTemplate(templateVersion.templateId, templateVersion.version), file)
      .toThrow('模板发布资格未获允许')
  }
  expect(listTemplates().filter((template) => template.status === 'published')).toHaveLength(0)
})
