import { describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Electron 统一由 bunfig [test].preload 注册完整替身，不能在本文件用局部 mock.module 覆盖缺失的具名导出。
// 隔离配置根目录：安装目标必须落在临时目录，绝不能写真实 ~/.cdutai-dev/skins。
const configRoot = mkdtempSync(join(tmpdir(), 'cdut-skin-manager-config-'))
process.env.PROFER_CONFIG_DIR = configRoot

const { installSkinFromFolder } = await import('./skin-manager-service')

/** 写入一个最小可安装皮肤包；返回包根目录。 */
function writePackage(id: string, options: { css?: string; assetName?: string; previewBytes?: number } = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'cdut-skin-package-'))
  writeFileSync(
    join(root, 'manifest.json'),
    JSON.stringify({ id, name: `Skin ${id}`, tone: 'dark' }, null, 2),
    'utf8',
  )
  const assetName = options.assetName
  writeFileSync(
    join(root, 'skin.css'),
    options.css ?? (assetName ? `:root { --background: #111; }\n.shell-bg { background-image: url("assets/${assetName}"); }` : ':root { --background: #111; }'),
    'utf8',
  )
  if (assetName) {
    mkdirSync(join(root, 'assets'), { recursive: true })
    writeFileSync(join(root, 'assets', assetName), Buffer.from([0x89, 0x50, 0x4e, 0x47]))
  }
  if (options.previewBytes !== undefined) {
    writeFileSync(join(root, 'preview.png'), Buffer.alloc(options.previewBytes, 0x89))
  }
  return root
}

describe('皮肤安装的 Windows 保留设备名防护', () => {
  test.each(['con', 'prn', 'aux', 'nul', 'com1', 'lpt9'])(
    'Given skin id %s When installing Then the package is rejected for cross-platform safety',
    (id) => {
      const root = writePackage(id)
      try {
        const result = installSkinFromFolder(root)
        expect(result.ok).toBe(false)
        expect(result.message).toContain('Windows 保留设备名')
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    },
  )

  test('Given assets/con.png When installing Then it is rejected because Windows also blocks reserved names with extensions', () => {
    const root = writePackage('reserved-asset-skin', { assetName: 'con.png' })
    try {
      const result = installSkinFromFolder(root)
      expect(result.ok).toBe(false)
      expect(result.message).toContain('Windows 保留设备名')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('Given a normal skin When installing Then reserved-name guard does not block it', () => {
    const root = writePackage('fine-skin', { assetName: 'wallpaper.png' })
    try {
      const result = installSkinFromFolder(root)
      expect(result.ok).toBe(true)
      expect(result.skin?.id).toBe('fine-skin')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('皮肤预览图体积上限', () => {
  test('Given preview.png 超过 2 MB When installing Then it is rejected', () => {
    // 预览图位于包根目录（不是 assets/），旧实现只受整包 5 MB 约束
    const root = writePackage('oversized-preview-skin', { previewBytes: 3 * 1024 * 1024 })
    try {
      const result = installSkinFromFolder(root)
      expect(result.ok).toBe(false)
      expect(result.message).toContain('预览图不能超过 2 MB')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('Given preview.png 在限额内 When installing Then it is accepted', () => {
    const root = writePackage('normal-preview-skin', { previewBytes: 64 * 1024 })
    try {
      const result = installSkinFromFolder(root)
      expect(result.ok).toBe(true)
      expect(result.skin?.id).toBe('normal-preview-skin')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
