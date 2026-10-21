/**
 * CSLab 科学工具集集成测试（含 create_structure 与 focus_structure 及提示词注入）
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CsLabLab } from '@profer/shared'

let rootDir = ''
let lab: CsLabLab
let fakeSessionId = ''

const SAMPLE_CIF = `data_SrTiO3
_cell_length_a 3.905
_cell_length_b 3.905
_cell_length_c 3.905
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'P m -3 m'
loop_
_atom_site_label
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Sr 0 0 0
Ti 0.5 0.5 0.5
O 0.5 0.5 0
`

beforeAll(async () => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-tools-test-'))
  process.env.PROFER_CONFIG_DIR = rootDir
  const { createLab } = await import('./cslab-manager')
  const { createAgentSession, updateAgentSessionMeta } = await import('../agent-session-manager')
  lab = createLab({ name: 'Origin × VESTA 测试实验室', description: '科学工具单元测试' })
  const meta = createAgentSession('测试会话')
  fakeSessionId = meta.id
  updateAgentSessionMeta(fakeSessionId, { cslabLabId: lab.id })
})

afterAll(async () => {
  const { resolveLabDir } = await import('./cslab-paths')
  const { unlockFile } = await import('./cslab-hash')
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  try {
    const figures = join(resolveLabDir(lab.id), 'vault', 'figures')
    for (const entry of readdirSync(figures)) await unlockFile(join(figures, entry))
  } catch {
    // 忽略
  }
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // 忽略
  }
})

describe('CSLab 科学工具集', () => {
  test('Given CIF 文本 When cslab_create_structure Then 成功入笼并生成 mol 资产 URI', async () => {
    const { buildCsLabScienceTools } = await import('./cslab-scientific-tools')
    const fakeSdk = {
      defineTool: (def: unknown) => def,
    } as any

    const tools = buildCsLabScienceTools(fakeSdk, { sessionId: fakeSessionId })
    const createTool = tools.find((t) => t.name === 'cslab_create_structure')
    expect(createTool).toBeDefined()

    const result = (await createTool!.execute('call-1', {
      title: '钛酸锶钙钛矿',
      format: 'cif',
      content: SAMPLE_CIF,
    })) as any

    expect(result.isError).toBeFalsy()
    expect(result.details.uri).toContain('mol')
    expect(result.details.title).toContain('钛酸锶')
    expect(result.details.format).toBe('cif')
  })

  test('Given 资产 URI When cslab_focus_structure Then 发出聚焦指令并返回 focused 状态', async () => {
    const { buildCsLabScienceTools } = await import('./cslab-scientific-tools')
    const fakeSdk = {
      defineTool: (def: unknown) => def,
    } as any

    const tools = buildCsLabScienceTools(fakeSdk, { sessionId: fakeSessionId })
    const focusTool = tools.find((t) => t.name === 'cslab_focus_structure')
    expect(focusTool).toBeDefined()

    const result = (await focusTool!.execute('call-2', {
      uri: `lab://${lab.id}/mol/fake-123`,
      supercell: { na: 2, nb: 2, nc: 2 },
      highlightPolyhedra: true,
    })) as any

    expect(result.isError).toBeFalsy()
    expect(result.details.status).toBe('focused')
  })

  test('Given 绑定实验室会话 When buildSystemPrompt Then 注入包含双引擎规范且禁止手搓 3D 的系统提示词', async () => {
    const { buildSystemPrompt } = await import('../agent-prompt-builder')
    const { getCsLabPromptLabInfo } = await import('./cslab-science')

    const labInfo = await getCsLabPromptLabInfo(lab.id)
    expect(labInfo).toBeDefined()
    expect(labInfo!.labName).toBe('Origin × VESTA 测试实验室')

    const prompt = buildSystemPrompt({
      cslabLabBound: true,
      cslabLabInfo: labInfo,
    })

    expect(prompt).toContain('<cslab_science>')
    expect(prompt).toContain('Origin × VESTA')
    expect(prompt).toContain('VESTA 3D Crystal & Molecular Engine')
    expect(prompt).toContain('cslab_create_structure')
    expect(prompt).toContain('cslab_focus_structure')
    expect(prompt).toContain('CRITICAL NEGATIVE CONSTRAINT')
    expect(prompt).toContain('NEVER attempt to write Python scripts')
  })
})
