import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const src = join(import.meta.dirname, '..', 'resources')
const dest = join(import.meta.dirname, '..', 'dist', 'resources')
const forceCopy = process.argv.includes('--force')

if (!existsSync(src)) {
  console.error('resources/ not found')
  process.exit(1)
}

let copiedCount = 0
let skippedCount = 0

function copyFileIfChanged(srcFile: string, destFile: string): void {
  const srcStat = statSync(srcFile)
  if (!forceCopy && existsSync(destFile)) {
    const destStat = statSync(destFile)
    if (destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs) {
      skippedCount++
      return
    }
  }
  mkdirSync(dirname(destFile), { recursive: true })
  copyFileSync(srcFile, destFile)
  copiedCount++
}

function syncDirIncremental(srcDir: string, destDir: string): void {
  mkdirSync(destDir, { recursive: true })
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)
    if (entry.isDirectory()) {
      syncDirIncremental(srcPath, destPath)
    } else if (entry.isFile()) {
      copyFileIfChanged(srcPath, destPath)
    }
  }
}

mkdirSync(join(import.meta.dirname, '..', 'dist'), { recursive: true })

try {
  syncDirIncremental(src, dest)
  // 随包保留原始字节与路径，客户端仍校验 catalog 中的 Git blob。
  const root = resolve(import.meta.dirname, '../../..')
  const catalogPath = 'docs/design/review-agent/acceptance/d4-unified-r01/catalog.json'
  const catalog = JSON.parse(readFileSync(join(root, catalogPath), 'utf8'))
  const paths = new Set<string>([catalogPath])
  for (const entry of catalog.templates) {
    paths.add(entry.workspacePath)
    paths.add(entry.manifestPath)
    const base = entry.workspacePath.replace(/\/workspace(?:\/workspace)?\.json$/, '')
    for (const name of ['selection.json', 'synthetic-selection.json', 'fixtures/selection.json', 'fixtures/selections.json', 'fixtures/controlled-registry.json']) {
      if (existsSync(join(root, base, name))) paths.add(`${base}/${name}`)
    }
  }
  for (const path of paths) {
    const srcFile = join(root, path)
    const target = join(dest, 'd4-unified', path)
    copyFileIfChanged(srcFile, target)
  }
  console.log(`resources → dist/resources (复制 ${copiedCount} 个, 跳过未变更 ${skippedCount} 个)`)
} catch (err) {
  console.error('copy failed:', err)
  process.exit(1)
}
