import { describe, expect, test } from 'bun:test'
import {
  JOURNAL_PRESETS,
  axisFraction,
  computePlotLayout,
  createPlotDocument,
  defaultAxisConfig,
  niceTicks,
  normalizePlotDocument,
  parseScientificText,
  scaleInverse,
  scaleValue,
} from './cslab-plot-doc'
import { hasEditableText, hasEmbeddedImage, renderPlotSvg } from './cslab-plot-svg'

describe('出版绘图数学', () => {
  test('Given 0-10 区间 When 生成刻度 Then 使用 1/2/5 步长', () => {
    expect(niceTicks(0, 10, 5)).toEqual([0, 2, 4, 6, 8, 10])
  })

  test('Given 对数刻度 When 换算与反算 Then 往返一致', () => {
    const scaled = scaleValue(100, 'log10')
    expect(scaled).toBeCloseTo(2, 10)
    expect(scaleInverse(scaled!, 'log10')).toBeCloseTo(100, 10)
    expect(scaleValue(-1, 'log10')).toBeNull()
    expect(scaleValue(0, 'reciprocal')).toBeNull()
  })

  test('Given 轴打断 When 映射数值 Then 断点区间返回 null', () => {
    const axis = { ...defaultAxisConfig('x'), min: 0, max: 10, breaks: [{ from: 4, to: 6 }] }
    expect(axisFraction(axis, 2, 0, 10)).toBeCloseTo(0.25, 6)
    expect(axisFraction(axis, 5, 0, 10)).toBeNull()
    expect(axisFraction(axis, 8, 0, 10)).toBeCloseTo(0.75, 6)
  })

  test('Given 科学文本 When 解析 Then 上下标与希腊字母正确', () => {
    const parsed = parseScientificText('$\\text{TiO}_2$')
    expect(parsed.tokens).toEqual([
      { text: 'TiO', script: 'normal' },
      { text: '2', script: 'sub' },
    ])
    const theta = parseScientificText('$2\\theta$ (deg)')
    expect(theta.tokens[0]?.text).toContain('2θ')
  })

  test('Given Nature 预设 When 创建文档 Then 单栏宽度为 89mm', () => {
    const document = createPlotDocument({ id: 'plot-1', labId: 'lab-1', title: 'XRD', presetId: 'nature' })
    expect(JOURNAL_PRESETS.nature.singleColumnMm).toBe(89)
    expect(document.sizeMm.width).toBe(89)
    const layout = computePlotLayout(document, JOURNAL_PRESETS.nature)
    expect(layout.plotArea.width).toBeGreaterThan(50)
    expect(layout.facets).toHaveLength(1)
  })

  test('Given 带曲线文档 When 生成 SVG Then 文字可编辑且不含位图', () => {
    const document = normalizePlotDocument({
      ...createPlotDocument({ id: 'plot-2', labId: 'lab-1', title: 'TiO2 XRD', presetId: 'nature' }),
      layers: [
        {
          id: 'layer-1',
          name: '图层 1',
          series: [
            {
              id: 'series-1',
              name: 'TiO_2',
              x: [10, 20, 30, 40],
              y: [1, 5, 3, 2],
              color: '#1f77b4',
              lineWidth: 0.6,
              lineStyle: 'solid',
              marker: 'none',
              yAxis: 0,
              visible: true,
              alpha: 1,
            },
          ],
          xAxis: { ...defaultAxisConfig('2θ', 'deg'), min: 10, max: 40 },
          yAxes: [defaultAxisConfig('强度', 'a.u.'), defaultAxisConfig('')],
          annotations: [],
          visible: true,
          opacity: 1,
        },
      ],
    })
    const svg = renderPlotSvg(document, JOURNAL_PRESETS.nature)
    expect(svg).toContain('<svg')
    expect(svg).toContain('viewBox="0 0 89')
    expect(hasEditableText(svg)).toBe(true)
    expect(hasEmbeddedImage(svg)).toBe(false)
    expect(svg).toContain('tspan')
  })
})
