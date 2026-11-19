#!/usr/bin/env node
/** 验证 Windows unpacked 包内随包 CLI 的文件名与内容契约。 */

const fs = require('node:fs')
const path = require('node:path')

const WINDOWS_CLI_NAME = 'profer.exe'
// electron-builder.yml 的 win.extraResources 会把 MinGit 复制到 resources/bin/git，
// 该目录与 CLI 同级，是 Windows 开箱即用所需的合法内嵌运行时。
const BUNDLED_GIT_DIR_NAME = 'git'
const BUNDLED_GIT_EXE = path.join(BUNDLED_GIT_DIR_NAME, 'cmd', 'git.exe')

function verifyPackagedWindowsCli(binDir) {
  if (!fs.existsSync(binDir)) {
    throw new Error(`Windows 随包 CLI 目录不存在: ${binDir}`)
  }

  const entries = fs.readdirSync(binDir, { withFileTypes: true })
  const actual = entries.map((entry) => entry.name).sort().join(', ') || '<空>'
  const cliEntry = entries.find((entry) => entry.name === WINDOWS_CLI_NAME)
  if (!cliEntry) {
    throw new Error(
      `Windows 随包 CLI 目录必须包含 ${WINDOWS_CLI_NAME}，实际为: ${actual}`,
    )
  }

  const unexpected = entries
    .map((entry) => entry.name)
    .filter((name) => name !== WINDOWS_CLI_NAME && name !== BUNDLED_GIT_DIR_NAME)
  if (unexpected.length > 0) {
    throw new Error(
      `Windows 随包 CLI 目录只能包含 ${WINDOWS_CLI_NAME} 与内置 MinGit 目录 ${BUNDLED_GIT_DIR_NAME}，实际为: ${actual}`,
    )
  }

  const cliPath = path.join(binDir, cliEntry.name)
  if (!cliEntry.isFile()) {
    throw new Error(`Windows 随包 CLI 必须是普通文件: ${cliPath}`)
  }
  if (fs.statSync(cliPath).size <= 0) {
    throw new Error(`Windows 随包 CLI 不能为空: ${cliPath}`)
  }

  const gitEntry = entries.find((entry) => entry.name === BUNDLED_GIT_DIR_NAME)
  if (gitEntry) {
    const gitExePath = path.join(binDir, BUNDLED_GIT_EXE)
    if (!gitEntry.isDirectory()) {
      throw new Error(`内置 MinGit 必须是目录: ${path.join(binDir, BUNDLED_GIT_DIR_NAME)}`)
    }
    if (!fs.existsSync(gitExePath) || fs.statSync(gitExePath).size <= 0) {
      throw new Error(`内置 MinGit 缺少可执行文件或为空: ${gitExePath}`)
    }
  }

  return cliPath
}

module.exports = { WINDOWS_CLI_NAME, verifyPackagedWindowsCli }

if (require.main === module) {
  const appRoot = path.resolve(__dirname, '..')
  const binDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(appRoot, 'out', 'win-unpacked', 'resources', 'bin')
  try {
    const cliPath = verifyPackagedWindowsCli(binDir)
    console.log(`[packaged-cli-contract] ${cliPath} OK`)
  } catch (error) {
    console.error(`[packaged-cli-contract] ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
