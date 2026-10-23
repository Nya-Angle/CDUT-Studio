import { afterAll, describe, expect, test } from 'bun:test'
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import { probeSystemTesseract } from './system-tesseract-ocr-adapter'

const fakeBin = mkdtempSync(join(tmpdir(), 'review-fake-tesseract-'))
afterAll(() => rmSync(fakeBin, { recursive: true, force: true }))

describe('系统 Tesseract 探测', () => {
  test('等待语言清单进程结束，准确报告缺少中文语言包', async () => {
    const executable = join(fakeBin, 'tesseract')
    writeFileSync(executable, '#!/bin/sh\nif [ "$1" = "--version" ]; then echo "tesseract 5.5.0"; exit 0; fi\nsleep 0.05\necho "List of available languages (1):"\necho "eng"\n')
    chmodSync(executable, 0o755)
    const originalPath = process.env.PATH
    process.env.PATH = `${fakeBin}${delimiter}${originalPath ?? ''}`
    try {
      const status = await probeSystemTesseract()
      expect(status).toEqual({ available: false, reason: '系统 tesseract 缺少 chi_sim 中文语言包' })
    } finally {
      process.env.PATH = originalPath
    }
  })
})
