import type { ReviewPiRunProgress } from '@profer/shared'

export function reviewPiProgressLabel(progress: ReviewPiRunProgress | undefined): string | undefined {
  if (!progress) return undefined
  switch (progress.phase) {
    case 'preparing': return '正在准备审核'
    case 'reading-material': return progress.fileName ? `正在读取材料：${progress.fileName}` : '正在读取材料'
    case 'analyzing': return '正在分析材料'
    case 'submitting-results': return '正在保存阶段结果'
    case 'outputting-results': return '正在整理审核结论'
  }
}
