import { describe, expect, test } from 'bun:test'
import {
  aslsBaseline,
  fitPeaks,
  gaussian,
  smoothSeries,
} from './cslab-fitting'

function syntheticDoublePeak(): { x: number[]; y: number[] } {
  const x: number[] = []
  const y: number[] = []
  let seed = 123456789
  const random = (): number => {
    seed = (1103515245 * seed + 12345) % 2147483648
    return seed / 2147483648
  }
  for (let i = 0; i <= 1500; i += 1) {
    const value = 10 + i * 0.02
    const signal = gaussian(value, 20, 100, 1.2) + gaussian(value, 24, 80, 1.8)
    const noise = (random() - 0.5) * 2 * 0.05 * 100
    x.push(value)
    y.push(signal + noise)
  }
  return { x, y }
}

describe('曲线拟合', () => {
  test('Given 双高斯重叠谱 When 拟合 Then 峰参数回收率超过 98%', () => {
    const { x, y } = syntheticDoublePeak()
    const result = fitPeaks({
      x,
      y,
      peaks: [
        { center: 19.6, height: 90, fwhm: 1.0 },
        { center: 24.4, height: 70, fwhm: 2.1 },
      ],
      model: 'gaussian',
      baseline: 'constant',
    })

    expect(result.converged).toBe(true)
    expect(result.peaks).toHaveLength(2)
    // 5% 高斯白噪声下 R² 约 0.95；关键看峰参数回收率 > 98%
    expect(result.rSquared).toBeGreaterThan(0.94)

    const centers = result.peaks.map((peak) => peak.center).sort((left, right) => left - right)
    expect(Math.abs(centers[0]! - 20) / 20).toBeLessThan(0.02)
    expect(Math.abs(centers[1]! - 24) / 24).toBeLessThan(0.02)
    const widths = result.peaks.map((peak) => peak.fwhm).sort((left, right) => left - right)
    expect(Math.abs(widths[0]! - 1.2) / 1.2).toBeLessThan(0.02)
    expect(Math.abs(widths[1]! - 1.8) / 1.8).toBeLessThan(0.02)
    const fractionSum = result.peaks.reduce((sum, peak) => sum + peak.areaFraction, 0)
    expect(fractionSum).toBeCloseTo(1, 3)
  })

  test('Given 缓慢抬升背景 When AsLS 基线 Then 基线低于峰顶且随数据抬升', () => {
    const y = Array.from({ length: 400 }, (_value, index) => 20 + index * 0.05 + gaussian(index, 200, 30, 8))
    const baseline = aslsBaseline(y, 1e5, 0.01)
    expect(baseline[0]).toBeLessThan(25)
    expect(baseline[399]).toBeGreaterThan(baseline[0]!)
    expect(baseline[200]).toBeLessThan(y[200]!)
  })

  test('Given 含噪曲线 When Savitzky-Golay 平滑 Then 峰位基本不变', () => {
    const { x, y } = syntheticDoublePeak()
    const smoothed = smoothSeries({ x, y, kind: 'savgol', window: 11, order: 2 })
    expect(smoothed).toHaveLength(y.length)
    const originalIndex = y.indexOf(Math.max(...y))
    const smoothedIndex = smoothed.indexOf(Math.max(...smoothed))
    expect(Math.abs(x[originalIndex]! - x[smoothedIndex]!)).toBeLessThan(0.2)
  })

  test('Given 未锁定峰 When 拟合 Then 面积占比之和为 1', () => {
    const { x, y } = syntheticDoublePeak()
    const result = fitPeaks({
      x,
      y,
      peaks: [
        { center: 20, height: 100, fwhm: 1.2 },
        { center: 24, height: 80, fwhm: 1.8 },
      ],
      model: 'pseudo_voigt',
      baseline: 'linear',
    })
    const sum = result.peaks.reduce((total, peak) => total + peak.areaFraction, 0)
    expect(sum).toBeCloseTo(1, 6)
  })
})
