import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const src = join(import.meta.dirname, '..', 'resources')
const dest = join(import.meta.dirname, '..', 'dist', 'resources')

if (!existsSync(src)) {
  console.error('resources/ not found')
  process.exit(1)
}

mkdirSync(join(import.meta.dirname, '..', 'dist'), { recursive: true })

try {
  cpSync(src, dest, { recursive: true, force: true })
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
    const target = join(dest, 'd4-unified', path)
    mkdirSync(dirname(target), { recursive: true })
    cpSync(join(root, path), target)
  }
  console.log('resources → dist/resources')
} catch (err) {
  console.error('copy failed:', err)
  process.exit(1)
}
