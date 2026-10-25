/**
 * coach-tour-position — CoachTour 的纯几何逻辑
 *
 * 从 Overlay 组件中抽出，不依赖 React/DOM，便于 bun test 固化
 * 方位回退与视口钳制规则（改 UI 布局时不至于悄悄崩掉）。
 */

export interface AnchorRect {
  left: number
  top: number
  width: number
  height: number
}

export interface CardSize {
  width: number
  height: number
}

export interface ViewportSize {
  width: number
  height: number
}

export type CoachTourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto'

const SPOTLIGHT_PADDING = 8
const CARD_GAP = 14
const VIEWPORT_MARGIN = 12

/**
 * 计算气泡位置：
 * 1. 锚点缺失 → 默认视口居中（若明确偏好 left / right 则贴合对应侧边，避免遮挡中央内容）
 * 2. 锚点近乎全屏（≥80% 面积）→ 卡在其下缘居中（遮罩环贴着屏幕边缘，气泡放底部不挡内容）
 * 3. 偏好方位空间不足时按 bottom → top → right → left 回退
 * 4. 最后钳制进视口安全边距
 */
export function computeCardPosition(
  rect: AnchorRect | null,
  card: CardSize,
  placement: CoachTourPlacement,
  viewport: ViewportSize,
): { left: number; top: number } {
  const vw = viewport.width
  const vh = viewport.height
  if (!rect) {
    if (placement === 'left') {
      return {
        left: VIEWPORT_MARGIN + 24,
        top: Math.max(VIEWPORT_MARGIN, (vh - card.height) / 2),
      }
    }
    if (placement === 'right') {
      return {
        left: Math.max(VIEWPORT_MARGIN, vw - card.width - VIEWPORT_MARGIN - 24),
        top: Math.max(VIEWPORT_MARGIN, (vh - card.height) / 2),
      }
    }
    return {
      left: Math.max(VIEWPORT_MARGIN, (vw - card.width) / 2),
      top: Math.max(VIEWPORT_MARGIN, (vh - card.height) / 2),
    }
  }

  if (rect.width * rect.height >= vw * vh * 0.8) {
    return {
      left: clamp((vw - card.width) / 2, VIEWPORT_MARGIN, vw - card.width - VIEWPORT_MARGIN),
      top: clamp(vh - card.height - VIEWPORT_MARGIN * 2, VIEWPORT_MARGIN, vh - card.height - VIEWPORT_MARGIN),
    }
  }

  const padded = {
    left: rect.left - SPOTLIGHT_PADDING,
    top: rect.top - SPOTLIGHT_PADDING,
    right: rect.left + rect.width + SPOTLIGHT_PADDING,
    bottom: rect.top + rect.height + SPOTLIGHT_PADDING,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  }

  const fits = {
    bottom: vh - padded.bottom - CARD_GAP - card.height >= VIEWPORT_MARGIN,
    top: padded.top - CARD_GAP - card.height >= VIEWPORT_MARGIN,
    right: vw - padded.right - CARD_GAP - card.width >= VIEWPORT_MARGIN,
    left: padded.left - CARD_GAP - card.width >= VIEWPORT_MARGIN,
  }

  let finalPlacement: 'top' | 'bottom' | 'left' | 'right'
  if (placement !== 'auto' && fits[placement]) {
    finalPlacement = placement
  } else if (fits.bottom) {
    finalPlacement = 'bottom'
  } else if (fits.top) {
    finalPlacement = 'top'
  } else if (fits.right) {
    finalPlacement = 'right'
  } else if (fits.left) {
    finalPlacement = 'left'
  } else {
    finalPlacement = 'bottom'
  }

  let rawLeft = 0
  let rawTop = 0
  switch (finalPlacement) {
    case 'bottom':
      rawLeft = padded.centerX - card.width / 2
      rawTop = padded.bottom + CARD_GAP
      break
    case 'top':
      rawLeft = padded.centerX - card.width / 2
      rawTop = padded.top - CARD_GAP - card.height
      break
    case 'right':
      rawLeft = padded.right + CARD_GAP
      rawTop = padded.centerY - card.height / 2
      break
    case 'left':
      rawLeft = padded.left - CARD_GAP - card.width
      rawTop = padded.centerY - card.height / 2
      break
  }

  return {
    left: clamp(rawLeft, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vw - card.width - VIEWPORT_MARGIN)),
    top: clamp(rawTop, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vh - card.height - VIEWPORT_MARGIN)),
  }
}

/** 联合多个矩形取外接矩形（用于 unionSelectors） */
export function unionRects(rects: AnchorRect[]): AnchorRect | null {
  if (rects.length === 0) return null
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  for (const r of rects) {
    if (r.left < left) left = r.left
    if (r.top < top) top = r.top
    const rRight = r.left + r.width
    const rBottom = r.top + r.height
    if (rRight > right) right = rRight
    if (rBottom > bottom) bottom = rBottom
  }
  return { left, top, width: right - left, height: bottom - top }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
