import { afterEach, describe, expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

interface PackagingHostModule {
  assertBuilderPackagingHost: (args: string[], hostPlatform?: string) => void
  assertPackagingHost: (targetPlatform: string, hostPlatform?: string) => void
  getRequestedPlatform: (args: string[]) => string | undefined
  getRequestedPlatforms: (args: string[]) => string[]
}

interface PackagedCliContractModule {
  verifyPackagedWindowsCli: (binDir: string) => string
}

interface MacSignatureModule {
  PRODUCT_APP_NAME: string
  findMacAppBundle: (outputDir: string) => string | null
  expectedDesignatedRequirement: (bundleId: string) => string
  parseDesignatedRequirement: (codesignOutput: string) => string | null
  assertMacSignatureContract: (appPath: string) => { bundleId: string; designatedRequirement: string }
}

const {
  assertBuilderPackagingHost,
  assertPackagingHost,
  getRequestedPlatform,
  getRequestedPlatforms,
} = require('./packaging-host.cjs') as PackagingHostModule
const { verifyPackagedWindowsCli } = require('./packaged-cli-contract.cjs') as PackagedCliContractModule
const {
  PRODUCT_APP_NAME,
  findMacAppBundle,
  expectedDesignatedRequirement,
  parseDesignatedRequirement,
  assertMacSignatureContract,
} = require('./macos-signature.cjs') as MacSignatureModule

const temporaryRoots: string[] = []

function createTemporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'profer-packaging-guard-'))
  temporaryRoots.push(root)
  return root
}

function createBinDir(): string {
  const binDir = join(createTemporaryRoot(), 'bin')
  mkdirSync(binDir)
  return binDir
}

function getTopLevelSection(config: string, key: string): string {
  const normalized = config.replace(/\r\n/g, '\n')
  const marker = `${key}:\n`
  const start = normalized.indexOf(marker)
  if (start < 0) throw new Error(`配置缺少 ${key} 段`)
  const remainder = normalized.slice(start + marker.length)
  const nextSection = remainder.search(/^[A-Za-z][A-Za-z0-9_-]*:/m)
  return nextSection < 0 ? remainder : remainder.slice(0, nextSection)
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe('Windows 打包宿主门禁', () => {
  test('Given macOS 或 Linux 宿主 When 请求 Windows 打包 Then 在构建前明确失败', () => {
    expect(() => assertPackagingHost('win', 'darwin')).toThrow('Windows 打包必须在 Windows 宿主上运行')
    expect(() => assertPackagingHost('win', 'linux')).toThrow('Windows 打包必须在 Windows 宿主上运行')
  })

  test('Given Windows 宿主 When 请求 Windows 打包 Then 允许继续', () => {
    expect(() => assertPackagingHost('win', 'win32')).not.toThrow()
    expect(getRequestedPlatform(['--x64', '--win'])).toBe('win')
    expect(() => assertBuilderPackagingHost(['--win', '--x64'], 'win32')).not.toThrow()
  })

  test('Given 组合平台参数 When 其中包含 Windows Then 不允许用参数顺序绕过门禁', () => {
    expect(getRequestedPlatforms(['--mac', '--win'])).toEqual(['mac', 'win'])
    expect(() => assertBuilderPackagingHost(['--mac', '--win'], 'darwin'))
      .toThrow('Windows 打包必须在 Windows 宿主上运行')
    expect(() => assertBuilderPackagingHost(['-mw'], 'darwin'))
      .toThrow('Windows 打包必须在 Windows 宿主上运行')
    expect(() => assertBuilderPackagingHost(['--win=nsis'], 'darwin'))
      .toThrow('Windows 打包必须在 Windows 宿主上运行')
  })
})

describe('Windows 随包 CLI 契约', () => {
  test('Given 目录只有非空 profer.exe When 验证 Then 通过', () => {
    const binDir = createBinDir()
    const cliPath = join(binDir, 'profer.exe')
    writeFileSync(cliPath, 'windows-cli')

    expect(verifyPackagedWindowsCli(binDir)).toBe(cliPath)
  })

  test('Given CLI 缺失或只有无扩展名文件 When 验证 Then 拒绝', () => {
    const missingBinDir = join(createTemporaryRoot(), 'bin')
    expect(() => verifyPackagedWindowsCli(missingBinDir)).toThrow('目录不存在')

    const wrongBinDir = createBinDir()
    writeFileSync(join(wrongBinDir, 'profer'), 'mac-cli')
    expect(() => verifyPackagedWindowsCli(wrongBinDir)).toThrow('必须包含 profer.exe')
  })

  test('Given 两种宿主 CLI 并存或 exe 为空 When 验证 Then 拒绝', () => {
    const mixedBinDir = createBinDir()
    writeFileSync(join(mixedBinDir, 'profer'), 'mac-cli')
    writeFileSync(join(mixedBinDir, 'profer.exe'), 'windows-cli')
    expect(() => verifyPackagedWindowsCli(mixedBinDir)).toThrow('只能包含 profer.exe')

    const emptyBinDir = createBinDir()
    writeFileSync(join(emptyBinDir, 'profer.exe'), '')
    expect(() => verifyPackagedWindowsCli(emptyBinDir)).toThrow('不能为空')
  })

  test('Given 随包内置 MinGit When 验证 Then 接受与 profer.exe 同级的 git 目录', () => {
    const binDir = createBinDir()
    writeFileSync(join(binDir, 'profer.exe'), 'windows-cli')
    mkdirSync(join(binDir, 'git', 'cmd'), { recursive: true })
    writeFileSync(join(binDir, 'git', 'cmd', 'git.exe'), 'min-git')

    expect(verifyPackagedWindowsCli(binDir)).toBe(join(binDir, 'profer.exe'))
  })

  test('Given 内置 MinGit 不完整或存在其它文件 When 验证 Then 拒绝', () => {
    const brokenGitBinDir = createBinDir()
    writeFileSync(join(brokenGitBinDir, 'profer.exe'), 'windows-cli')
    mkdirSync(join(brokenGitBinDir, 'git', 'cmd'), { recursive: true })
    expect(() => verifyPackagedWindowsCli(brokenGitBinDir)).toThrow('内置 MinGit 缺少可执行文件')

    const strayFileBinDir = createBinDir()
    writeFileSync(join(strayFileBinDir, 'profer.exe'), 'windows-cli')
    writeFileSync(join(strayFileBinDir, 'profer-cli.exe'), 'stray')
    expect(() => verifyPackagedWindowsCli(strayFileBinDir)).toThrow('只能包含 profer.exe')
  })
})

describe('平台打包入口配置', () => {
  test('Given 当前品牌打包配置 When Windows workflow 检查主程序和安装包 Then 文件名与实际产物一致', () => {
    const appDir = resolve(import.meta.dir, '..')
    const config = readFileSync(join(appDir, 'electron-builder.yml'), 'utf8')
    const workflow = readFileSync(join(appDir, '..', '..', '.github', 'workflows', 'release.yml'), 'utf8')
    const productName = config.match(/^productName:\s*(.+)$/m)?.[1]?.trim()
    const artifactName = getTopLevelSection(config, 'nsis').match(/artifactName:\s*(.+)/)?.[1]?.trim()
    expect(productName).toBeDefined()
    expect(artifactName).toBeDefined()
    const installer = artifactName!.replace('${version}', '$version').replace('${ext}', 'exe')
    expect(workflow).toContain(`out/win-unpacked/${productName}.exe`)
    expect(workflow).toContain(`"${installer}"`)
    expect(workflow).toContain(`"${installer}.blockmap"`)
    expect(workflow).not.toContain('out/win-unpacked/Profer.exe')
    expect(PRODUCT_APP_NAME).toBe(`${productName}.app`)
  })

  test('Given electron-builder 配置 When 选择平台 Then 只复制对应 CLI 文件名', () => {
    const appDir = resolve(import.meta.dir, '..')
    const config = readFileSync(join(appDir, 'electron-builder.yml'), 'utf8').replace(/\r\n/g, '\n')
    const commonResources = getTopLevelSection(config, 'extraResources')
    const macConfig = getTopLevelSection(config, 'mac')
    const linuxConfig = getTopLevelSection(config, 'linux')
    const winConfig = getTopLevelSection(config, 'win')

    expect(commonResources).not.toContain('resources/bin')
    expect(macConfig).toContain('from: resources/bin/profer\n      to: bin/profer')
    expect(linuxConfig).toContain('from: resources/bin/profer\n      to: bin/profer')
    expect(winConfig).toContain('from: resources/bin/profer.exe\n      to: bin/profer.exe')
  })

  test('Given electron-builder 配置 When 打包 macOS Then 挂上签名补签钩子', () => {
    const appDir = resolve(import.meta.dir, '..')
    const config = readFileSync(join(appDir, 'electron-builder.yml'), 'utf8').replace(/\r\n/g, '\n')
    // afterSign 必须在 DMG/ZIP 打包之前执行，否则归档里仍是不可验证的包。
    expect(config).toContain('afterSign: scripts/after-sign-mac.cjs')
    expect(config).toContain('afterPack: scripts/after-pack.cjs')
  })

  test('Given 发布脚本 When 校验 macOS 产物 Then 使用共享签名契约而非 spctl', () => {
    const appDir = resolve(import.meta.dir, '..')
    const repoRoot = resolve(appDir, '..', '..')
    const pushScript = readFileSync(join(repoRoot, 'scripts', 'push-mac-release.cjs'), 'utf8')
    const packageJson = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
      version: string
    }
    // ad-hoc 签名下 spctl 评估必然 rejected，且 Squirrel.Mac 安装更新不依赖 spctl。
    expect(pushScript).not.toMatch(/run\(`spctl/)
    expect(pushScript).toMatch(/assertMacSignatureContract\(appPath\)/)
    expect(pushScript).toContain("require('../apps/electron/scripts/macos-signature.cjs')")
    // 增量下载索引缺失会让每次更新退化为全量下载。
    expect(pushScript).toContain('zip.blockmap')
    expect(packageJson.scripts['verify:mac-signature']).toBe('node scripts/verify-macos-signature.cjs')
    const changelog = JSON.parse(
      readFileSync(join(appDir, 'resources', 'CHANGELOG.json'), 'utf8'),
    ) as { releases: Array<{ version: string }> }
    expect(changelog.releases[0].version).toBe(packageJson.version)
  })

  test('Given Windows 发布脚本 When 启动构建 Then 宿主门禁总是最先执行', () => {
    const appDir = resolve(import.meta.dir, '..')
    const packageJson = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }
    for (const scriptName of [
      'dist:win',
      'dist:win-github',
      'dist:win-commercial',
      'release:verify:windows',
    ]) {
      expect(packageJson.scripts[scriptName]).toStartWith('bun run verify:packaging-host:win &&')
    }
  })
})

describe('macOS 签名契约', () => {
  test('Given 改名后 App 和旧品牌残留 When 查找解包目录 Then 只选当前产品且支持嵌套目录', () => {
    const root = createTemporaryRoot()
    mkdirSync(join(root, 'Profer.app'))
    expect(findMacAppBundle(root)).toBeNull()

    const nested = join(root, 'mac-arm64', PRODUCT_APP_NAME)
    mkdirSync(nested, { recursive: true })
    expect(findMacAppBundle(root)).toBe(nested)

    const direct = join(root, PRODUCT_APP_NAME)
    mkdirSync(direct)
    expect(findMacAppBundle(root)).toBe(direct)
    expect(findMacAppBundle(join(root, 'missing-output'))).toBeNull()
  })

  test('Given bundle id When 构造 designated requirement Then 只锚定 identifier', () => {
    // 钉死 identifier 是 ad-hoc 下唯一能跨版本稳定的形式；换成 cdhash 会让每次构建的
    // DR 都不同，Squirrel.Mac 就会拒绝安装新包。
    expect(expectedDesignatedRequirement('com.profer.app')).toBe('identifier "com.profer.app"')
    expect(() => expectedDesignatedRequirement('')).toThrow('bundle identifier')
  })

  test('Given codesign 输出 When 解析 Then 兼容显式与缺省派生两种 DR 写法', () => {
    const explicit = [
      'Executable=/Applications/Profer.app/Contents/MacOS/Profer',
      'designated => identifier "com.profer.app"',
    ].join('\n')
    expect(parseDesignatedRequirement(explicit)).toBe('identifier "com.profer.app"')

    // ad-hoc 未显式指定 -r 时，codesign 派生的 DR 是 cdhash，且行首带 `#`。
    const derived = [
      'Executable=/Applications/Profer.app/Contents/MacOS/Profer',
      '# designated => cdhash H"5c22a19a764af33c82dfc3e3191db283a5b8e376"',
    ].join('\n')
    expect(parseDesignatedRequirement(derived)).toBe(
      'cdhash H"5c22a19a764af33c82dfc3e3191db283a5b8e376"',
    )

    expect(parseDesignatedRequirement('Executable=/tmp/nothing\n')).toBeNull()
  })

  test('Given 未签名的 App 产物 When 断言契约 Then 失败并指出 DR 不符', () => {
    if (process.platform !== 'darwin') return
    // 空目录没有 Info.plist，必须在读取 bundle id 阶段就明确失败，而不是静默通过。
    const emptyApp = join(createTemporaryRoot(), 'Profer.app')
    mkdirSync(join(emptyApp, 'Contents'), { recursive: true })
    expect(() => assertMacSignatureContract(emptyApp)).toThrow('Info.plist')
    expect(() => assertMacSignatureContract(join(createTemporaryRoot(), 'Missing.app')))
      .toThrow('不存在')
  })
})

/** 读取 PNG 头部 IHDR 中的宽高（纯字节解析，无需额外依赖）。 */
function readPngSize(pngPath: string): { width: number; height: number } {
  const buf = readFileSync(pngPath)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

/** 校验 Windows ICO 文件头并返回内嵌图像数量；非法头返回 -1。 */
function readIcoImageCount(icoPath: string): number {
  const buf = readFileSync(icoPath)
  const validHeader = buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00
  return validHeader ? buf.readUInt16LE(4) : -1
}

describe('核心静态资产与打包配置完整性门禁', () => {
  test('Given 应用打包依赖 When 检查核心打包配置与关键资源 Then 配置文件和图标必须存在且非空', () => {
    const appDir = resolve(import.meta.dir, '..')
    const repoRoot = resolve(appDir, '..', '..')

    // 1. electron-builder.yml 核心打包契约文件
    const builderConfigPath = join(appDir, 'electron-builder.yml')
    expect(existsSync(builderConfigPath)).toBe(true)
    const builderContent = readFileSync(builderConfigPath, 'utf8')
    expect(builderContent.length).toBeGreaterThan(1000)
    expect(builderContent).toContain('appId:')
    expect(builderContent).toContain('productName:')
    expect(builderContent).toContain('directories:')
    expect(builderContent).toContain('win:')
    expect(builderContent).toContain('nsis:')

    // 2. 关键应用图标与品牌矢量素材
    const icoPath = join(appDir, 'resources', 'icon.ico')
    const pngPath = join(appDir, 'resources', 'icon.png')
    const icnsPath = join(appDir, 'resources', 'icon.icns')
    const svgPath = join(appDir, 'resources', 'CDUT_Studio.svg')
    expect(existsSync(icoPath)).toBe(true)
    expect(statSync(icoPath).size).toBeGreaterThan(10000)
    // Windows 应用图标必须是合法的多分辨率 ICO（00 00 01 00 头且至少含一张图）
    expect(readIcoImageCount(icoPath)).toBeGreaterThan(0)
    expect(existsSync(pngPath)).toBe(true)
    expect(statSync(pngPath).size).toBeGreaterThan(10000)
    // 应用图标必须是 1024x1024 正方形，防止“保比例 + 补边”环节出错产出非方形图标
    expect(readPngSize(pngPath)).toEqual({ width: 1024, height: 1024 })
    expect(existsSync(icnsPath)).toBe(true)
    expect(existsSync(svgPath)).toBe(true)

    // 3. 根目录与模块关键配置文件
    expect(existsSync(join(repoRoot, 'package.json'))).toBe(true)
    expect(existsSync(join(repoRoot, 'bun.lock'))).toBe(true)
    expect(existsSync(join(appDir, 'package.json'))).toBe(true)
    expect(existsSync(join(appDir, 'tsconfig.json'))).toBe(true)
    expect(existsSync(join(appDir, 'vite.config.ts'))).toBe(true)
  })
})

describe('内置技能库（default-skills）完整性与安全水位门禁', () => {
  const EXPECTED_DEFAULT_SKILLS = [
    'automation',
    'brainstorming',
    'docx',
    'executing-plans',
    'find-skills',
    'guizang-ppt-skill',
    'in-app-browser',
    'lark-delivery',
    'pdf',
    'pptx',
    'profer-coach',
    'session-cleaner',
    'skill-creator',
    'tool-builder',
    'user-sense',
    'writing-plans',
    'xlsx',
  ] as const

  test('Given 内置技能库 When 检查 default-skills 目录 Then 17 个关键技能及其 SKILL.md 必须完整存在且非空', () => {
    const appDir = resolve(import.meta.dir, '..')
    const defaultSkillsDir = join(appDir, 'default-skills')

    expect(existsSync(defaultSkillsDir)).toBe(true)

    for (const skillName of EXPECTED_DEFAULT_SKILLS) {
      const skillDir = join(defaultSkillsDir, skillName)
      expect(existsSync(skillDir)).toBe(true)
      const skillMd = join(skillDir, 'SKILL.md')
      expect(existsSync(skillMd)).toBe(true)
      const content = readFileSync(skillMd, 'utf8')
      expect(content.trim().length).toBeGreaterThan(50)
      expect(content).toContain('name:')
    }
  })

  test('Given 重型文档技能 When 检查核心执行脚本与 XML 规范 Then 核心脚本与 Schemas 必须完整存在', () => {
    const appDir = resolve(import.meta.dir, '..')
    const defaultSkillsDir = join(appDir, 'default-skills')

    // 深度验证 Office 技能的 schemas 与脚本，杜绝被误删掏空
    const criticalPaths = [
      join(defaultSkillsDir, 'docx', 'scripts', 'office', 'pack.py'),
      join(defaultSkillsDir, 'docx', 'scripts', 'office', 'schemas', 'ISO-IEC29500-4_2016', 'wml.xsd'),
      join(defaultSkillsDir, 'pptx', 'scripts', 'office', 'pack.py'),
      join(defaultSkillsDir, 'pptx', 'scripts', 'office', 'schemas', 'ISO-IEC29500-4_2016', 'pml.xsd'),
      join(defaultSkillsDir, 'xlsx', 'scripts', 'office', 'pack.py'),
      join(defaultSkillsDir, 'xlsx', 'scripts', 'office', 'schemas', 'ISO-IEC29500-4_2016', 'sml.xsd'),
      join(defaultSkillsDir, 'skill-creator', 'scripts', 'quick_validate.py'),
      join(defaultSkillsDir, 'session-cleaner', 'references', 'cli-usage.md'),
    ]

    for (const p of criticalPaths) {
      expect(existsSync(p)).toBe(true)
      expect(statSync(p).size).toBeGreaterThan(0)
    }
  })

  test('Given 技能同步源 When 统计 default-skills 资源文件数 Then 文件总数必须达到安全水位（>=200）', () => {
    const appDir = resolve(import.meta.dir, '..')
    const defaultSkillsDir = join(appDir, 'default-skills')

    function countFiles(dir: string): number {
      let count = 0
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
          count += countFiles(full)
        } else if (entry.isFile()) {
          count++
        }
      }
      return count
    }

    const totalFiles = countFiles(defaultSkillsDir)
    // 历史上包含全套 schemas 时约 240 个文件；若被批量删除或掏空，会远低于此安全阈值
    expect(totalFiles).toBeGreaterThanOrEqual(200)
  })
})

