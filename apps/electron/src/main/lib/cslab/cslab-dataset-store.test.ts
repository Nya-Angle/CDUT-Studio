/**
 * 数字化图表落盘测试
 *
 * 覆盖：多曲线按主 X 轴插值对齐、fig/table 双资产、Parquet 预览与血缘边。
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { CsLabLab } from '@profer/shared'

const PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl9sAAAAASUVORK5CYII='

const CALIBRATION = {
  x: {
    ticks: [
      { px: 0, py: 100, value: 0 },
      { px: 100, py: 0, value: 10 },
    ],
    scale: 'auto' as const,
  },
  y: {
    ticks: [
      { px: 0, py: 100, value: 0 },
      { px: 0, py: 0, value: 10 },
    ],
    scale: 'auto' as const,
  },
}

let rootDir = ''
let lab: CsLabLab

beforeAll(async () => {
  rootDir = mkdtempSync(join(tmpdir(), 'cslab-dataset-'))
  process.env.PROFER_CONFIG_DIR = rootDir
  const { createLab } = await import('./cslab-manager')
  lab = createLab({ name: '数字化图表保存测试' })
})

afterAll(async () => {
  const { closeAllCsLabDatabases } = await import('./cslab-db')
  closeAllCsLabDatabases()
  try {
    rmSync(rootDir, { recursive: true, force: true })
  } catch {
    // Windows 句柄延迟释放。
  }
})

describe('persistDigitizedFigure', () => {
  test('多曲线按主 X 轴插值对齐并保存 fig + table', async () => {
    const { persistDigitizedFigure } = await import('./cslab-dataset-store')
    const { getAssetTable, listAssets } = await import('./cslab-iron-cage')
    const { getCsLabDatabase, listEdgesFrom } = await import('./cslab-db')
    const { resolveLabDir } = await import('./cslab-paths')

    const sourceUri = `cdut://${lab.id}/lit/source-paper`
    const result = await persistDigitizedFigure({
      labId: lab.id,
      title: '界面阻抗曲线',
      sourceUri,
      imageDataUrl: PNG_DATA_URL,
      calibration: CALIBRATION,
      series: [
        {
          label: 'A',
          points: [
            [2, 2],
            [0, 0],
            [1, 1],
          ],
        },
        {
          label: 'B',
          points: [
            [0, 10],
            [2, 12],
          ],
        },
      ],
    })

    expect(result.figUri).toContain(`cdut://${lab.id}/fig/`)
    expect(result.tableUri).toContain(`cdut://${lab.id}/table/`)
    expect(result.rowCount).toBe(3)
    expect(result.message).toContain('2 条曲线')

    const payload = await getAssetTable(lab.id, result.tableUri)
    expect(payload).toBeTruthy()
    expect(payload?.columns.map((column) => column.label)).toEqual(['X', 'A', 'B'])
    expect(payload?.rows).toHaveLength(3)
    expect(payload?.rows[0]).toEqual([0, 0, 10])
    expect(payload?.rows[1]).toEqual([1, 1, 11])
    expect(payload?.rows[2]).toEqual([2, 2, 12])

    const assets = listAssets(lab.id)
    expect(assets.find((asset) => asset.uri === result.figUri)?.layerType).toBe('fig')
    expect(assets.find((asset) => asset.uri === result.tableUri)?.layerType).toBe('table')

    // 表实体字节数必须等于真实 Parquet 体积，而不是框选图的图片大小。
    const figAsset = assets.find((asset) => asset.uri === result.figUri)
    const tableAsset = assets.find((asset) => asset.uri === result.tableUri)
    const parquetPath = join(resolveLabDir(lab.id), tableAsset!.relPath!)
    expect(tableAsset?.bytes).toBe(statSync(parquetPath).size)
    expect(tableAsset?.bytes).not.toBe(figAsset?.bytes)

    const db = getCsLabDatabase(join(resolveLabDir(lab.id), 'db', 'central_meta.sqlite'))
    expect(listEdgesFrom(db, sourceUri).some((edge) => edge.toUri === result.figUri)).toBe(true)
    expect(
      listEdgesFrom(db, result.figUri).some(
        (edge) => edge.toUri === result.tableUri && edge.relation === 'derived_from',
      ),
    ).toBe(true)
  })

  test('无有效曲线或点数不足时拒绝保存', async () => {
    const { persistDigitizedFigure } = await import('./cslab-dataset-store')

    await expect(
      persistDigitizedFigure({
        labId: lab.id,
        title: '空图',
        sourceUri: '',
        imageDataUrl: PNG_DATA_URL,
        calibration: CALIBRATION,
        series: [],
      }),
    ).rejects.toThrow('没有可保存的数字化曲线')

    await expect(
      persistDigitizedFigure({
        labId: lab.id,
        title: '单点图',
        sourceUri: '',
        imageDataUrl: PNG_DATA_URL,
        calibration: CALIBRATION,
        series: [{ label: 'A', points: [[0, 0]] }],
      }),
    ).rejects.toThrow('没有可保存的数字化曲线')
  })

  test('JPEG dataURL 也可保存（仍以图表资产登记）', async () => {
    const { persistDigitizedFigure } = await import('./cslab-dataset-store')
    const { listAssets } = await import('./cslab-iron-cage')

    const jpegDataUrl = 'data:image/jpeg;base64,aGVsbG8='
    const result = await persistDigitizedFigure({
      labId: lab.id,
      title: 'JPEG 图表',
      sourceUri: '',
      imageDataUrl: jpegDataUrl,
      calibration: CALIBRATION,
      series: [{ label: 'A', points: [[0, 0], [1, 1]] }],
    })

    const fig = listAssets(lab.id).find((asset) => asset.uri === result.figUri)
    expect(fig?.format).toBe('png')
    expect(result.rowCount).toBe(2)
  })
})

describe('exportAssetTableToFile', () => {
  test('CSV 走 RowGroup 流式写出并保留 BOM 与列序', async () => {
    const { persistDigitizedFigure } = await import('./cslab-dataset-store')
    const { exportAssetTableToFile } = await import('./cslab-iron-cage')

    const result = await persistDigitizedFigure({
      labId: lab.id,
      title: 'CSV 导出',
      sourceUri: '',
      imageDataUrl: PNG_DATA_URL,
      calibration: CALIBRATION,
      series: [
        { label: 'A', points: [[0, 0], [1, 1], [2, 2]] },
        { label: 'B', points: [[0, 10], [1, 11], [2, 12]] },
      ],
    })

    const csvPath = join(rootDir, 'export-test.csv')
    const exported = await exportAssetTableToFile(lab.id, result.tableUri, 'csv', csvPath)
    expect(exported.success).toBe(true)
    expect(exported.format).toBe('csv')

    const text = readFileSync(csvPath, 'utf8')
    expect(text.charCodeAt(0)).toBe(0xfeff)
    const lines = text.replace(/^\uFEFF/, '').trimEnd().split('\n')
    expect(lines[0]).toBe('x,y1,y2')
    expect(lines[1]).toBe('0,0,10')
    expect(lines[3]).toBe('2,2,12')
  })

  test('Parquet 导出为原始只读副本', async () => {
    const { persistDigitizedFigure } = await import('./cslab-dataset-store')
    const { exportAssetTableToFile } = await import('./cslab-iron-cage')

    const result = await persistDigitizedFigure({
      labId: lab.id,
      title: 'Parquet 导出',
      sourceUri: '',
      imageDataUrl: PNG_DATA_URL,
      calibration: CALIBRATION,
      series: [{ label: 'A', points: [[0, 0], [1, 1]] }],
    })

    const parquetPath = join(rootDir, 'export-test.parquet')
    const exported = await exportAssetTableToFile(lab.id, result.tableUri, 'parquet', parquetPath)
    expect(exported.success).toBe(true)
    expect(statSync(parquetPath).size).toBeGreaterThan(0)
  })
})
