/**
 * T02 source-scoped OCR evidence. Read-only, no fabricated confirmation or
 * approval: Main/L is responsible for signed candidate reads and persistence.
 */
import * as React from 'react'
import type { T02StagedVisualOcrPreview } from '../../../main/lib/review/review-v3-t02-staged-visual-ocr'

export function ReviewV3T02VisualOcrPanel({
  result,
}: { result: T02StagedVisualOcrPreview }): React.ReactElement {
  const [visible, setVisible] = React.useState(30)
  return (
    <section className="space-y-2 rounded-lg border border-border/70 bg-card p-3" aria-label="原件 OCR 覆盖">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <strong>物理原件 OCR 预览</strong>
        <span className="text-muted-foreground">识别引擎：{result.ocrEngine ?? '不可用'}</span>
        <span>已获取 OCR 内容的图像 {result.inspectedImages}</span>
        <span>仍待识别 {result.imagesAwaitingInspection}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        版本 {result.documentVersionId} · 候选材料预览，不是已确认的事实、正式 DocumentVersion 或业务审核决定。
        所有 OCR 字句都需要结合原图核验。
      </p>
      {result.warnings.length > 0 && (
        <ul className="list-inside list-disc text-xs text-muted-foreground">
          {result.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
        </ul>
      )}
      {result.ocrText.length === 0 ? (
        <p className="text-sm text-muted-foreground">没有可供人工核对的 OCR 文字；仍需查看原始扫描件或图片。</p>
      ) : (
        <ol className="space-y-1">
          {result.ocrText.slice(0, visible).map(item => (
            <li key={item.sourceBlockKey} className="rounded bg-muted/30 px-2 py-1.5">
              <p className="text-xs text-muted-foreground">
                第 {item.page} 页 · 来源块 {item.sourceBlockKey}
                {' · '}OCR 置信度 {item.confidence === null ? '未知' : (item.confidence * 100).toFixed(0) + '%'}
                {item.bbox && (
                  <span> · 原图区域（左/上/右/下）{item.bbox.map(value => (value * 100).toFixed(1) + '%').join(' / ')}</span>
                )}
              </p>
              <p className="whitespace-pre-wrap break-words text-sm">{item.text}</p>
            </li>
          ))}
        </ol>
      )}
      {visible < result.ocrText.length && (
        <button type="button" className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setVisible(count => count + 50)}>
          再显示 {Math.min(50, result.ocrText.length - visible)} 条
        </button>
      )}
    </section>
  )
}
