/**
 * AI 问渠学堂 · 课堂教学页 UI 升级器（顶栏重写 + Nya Player）
 *
 * 零外部依赖：仅引用同目录的 Base64 图标常量，确保可被 `build:yanhu-preload` 独立打包。
 * UI 源码严格来自用户提供的模板（`implementation_plan.md`），禁止自建配色或精简控件。
 */

import { CDUT_STUDIO_LOGO_DATA_URL } from './wqxt-logo-data-url'

/** 顶栏宿主节点 ID */
export const WQXT_EDU_HEADER_ID = '__profer-wqxt-edu-header'
/** Nya Player 宿主节点 ID */
export const WQXT_NYA_PLAYER_ID = '__profer-nya-player'
/** 升级器样式节点 ID */
export const WQXT_UPGRADE_STYLE_ID = '__profer-wqxt-upgrade-css'
/** 学习资源下载卡片宿主 ID */
export const WQXT_RESOURCE_PANEL_ID = '__profer-wqxt-resource-panel'
/** 底部 CDUT Studio 底栏宿主 ID */
export const WQXT_FOOTER_ID = '__profer-wqxt-footer'
/** 扫码观看全局模态层 ID */
export const WQXT_QR_MODAL_ID = '__profer-qr-modal'
/** AI 问渠助手 Dock 胶囊 ID */
export const WQXT_AI_DOCK_ID = '__profer-ai-dock-btn'
/** AI 问渠助手留白窗体 ID */
export const WQXT_AI_PANEL_ID = '__profer-ai-panel'

/**
 * 升级器作用域 CSS：逐字取自模板。
 * 所有规则均以 `#__profer-wqxt-edu-header` / `#__profer-nya-player` / `.profer-*` 宿主前缀限定。
 */
export const WQXT_UPGRADE_CSS = `
/* ===== 宿主容器复写 ===== */
div.header-info.profer-wqxt-header-upgraded {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 76px !important;
  margin: 0 0 14px 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  overflow: visible !important;
  display: block !important;
}
div.header-info.profer-wqxt-header-upgraded > :not(#__profer-wqxt-edu-header) {
  display: none !important;
}

.main_resize_con > :not(#cmcPlayer_container):not(#__profer-nya-player) {
  display: none !important;
}
#cmcPlayer_container.profer-nya-upgraded {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  min-height: 480px !important;
  overflow: visible !important;
}
#cmcPlayer_container.profer-nya-upgraded > :not(#__profer-nya-player) {
  display: none !important;
}

/* ===== 1. 顶部导航卡片容器 (#__profer-wqxt-edu-header) ===== */
#__profer-wqxt-edu-header {
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --brand-gradient: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
  --text-main: #0F172A;
  --text-sub: #475569;
  --text-muted: #94A3B8;
  --bg-card: rgba(255, 255, 255, 0.95);
  --border-color: #E2E8F0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 14px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
  --radius: 14px;

  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  width: 100%;
  min-height: 76px;
  padding: 14px 24px;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}
#__profer-wqxt-edu-header * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#__profer-wqxt-edu-header .brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
  justify-self: start;
}
#__profer-wqxt-edu-header .brand-logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.18);
  flex-shrink: 0;
}
#__profer-wqxt-edu-header .brand-logo-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
#__profer-wqxt-edu-header .brand-text-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
#__profer-wqxt-edu-header .brand-main-row {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
#__profer-wqxt-edu-header .brand-title {
  font-weight: 800;
  font-size: 20px;
  color: var(--text-main);
  letter-spacing: -0.2px;
}
#__profer-wqxt-edu-header .brand-divider {
  color: #CBD5E1;
  font-weight: 300;
  font-size: 16px;
  user-select: none;
}
#__profer-wqxt-edu-header .brand-sub {
  font-size: 20px;
  font-weight: 700;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.3px;
}
#__profer-wqxt-edu-header .brand-sub-row {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.3px;
  white-space: nowrap;
}
#__profer-wqxt-edu-header .course-main-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  justify-self: center;
  width: 100%;
  max-width: 960px;
}
#__profer-wqxt-edu-header .course-title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
#__profer-wqxt-edu-header .status-badge-replay {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #6366F1;
  background: #EEF2FF;
  border: 1px solid #C7D2FE;
  border-radius: 6px;
  line-height: 1;
  flex-shrink: 0;
}
#__profer-wqxt-edu-header .status-badge-replay::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #6366F1;
}
#__profer-wqxt-edu-header .course-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#__profer-wqxt-edu-header .course-meta-list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
#__profer-wqxt-edu-header .meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: var(--text-sub);
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
#__profer-wqxt-edu-header .meta-chip:hover {
  background: #F1F5F9;
  color: var(--text-main);
}
#__profer-wqxt-edu-header .meta-chip svg {
  width: 16px;
  height: 16px;
  color: #64748B;
  flex-shrink: 0;
}
#__profer-wqxt-edu-header .action-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  justify-self: end;
}
#__profer-wqxt-edu-header .action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-sub);
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
#__profer-wqxt-edu-header .action-btn svg {
  width: 17px;
  height: 17px;
  color: #64748B;
  transition: transform 0.2s ease, color 0.2s ease;
}
#__profer-wqxt-edu-header .action-btn:hover,
#__profer-wqxt-edu-header .action-btn.is-active {
  color: var(--primary);
  border-color: #C7D2FE;
  background: #FAFAFF;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.08);
}
#__profer-wqxt-edu-header .action-btn:hover svg,
#__profer-wqxt-edu-header .action-btn.is-active svg {
  color: var(--primary);
  transform: scale(1.1);
}
#__profer-wqxt-edu-header .qr-popover-wrapper {
  position: relative;
}

/* ===== 扫码观看全局模态层（点击触发，脱离顶栏层叠上下文，杜绝悬停抖动） ===== */
#__profer-qr-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: none;
  align-items: center;
  justify-content: center;
}
#__profer-qr-modal.is-open {
  display: flex;
  animation: __profer-qr-fade 0.25s ease both;
}
@keyframes __profer-qr-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
#__profer-qr-modal .qr-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
}
#__profer-qr-modal .qr-modal-card {
  position: relative;
  width: 340px;
  max-width: calc(100vw - 40px);
  padding: 26px 24px 22px;
  background: #FFFFFF;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  box-shadow: 0 24px 64px -12px rgba(15, 23, 42, 0.35), 0 8px 24px -8px rgba(15, 23, 42, 0.2);
  text-align: center;
  transform: scale(0.95);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
}
#__profer-qr-modal.is-open .qr-modal-card {
  transform: scale(1);
  animation: __profer-qr-pop 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes __profer-qr-pop {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
#__profer-qr-modal .qr-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #94A3B8;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}
#__profer-qr-modal .qr-modal-close:hover {
  color: #0F172A;
  background: #F1F5F9;
}
#__profer-qr-modal .qr-modal-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: left;
}
#__profer-qr-modal .qr-modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%);
  color: #4F46E5;
  flex-shrink: 0;
}
#__profer-qr-modal .qr-modal-icon svg {
  width: 20px;
  height: 20px;
}
#__profer-qr-modal .qr-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.3;
}
#__profer-qr-modal .qr-modal-desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748B;
  line-height: 1.4;
}
#__profer-qr-modal .qr-modal-img-wrap {
  width: 220px;
  height: 220px;
  margin: 20px auto 0;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#__profer-qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  background: #FFFFFF;
  display: block;
}
#__profer-qr-modal .qr-modal-hint {
  margin: 14px 0 0;
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.5;
}

/* 窄屏：顶栏三段式自动折行 */
@media (max-width: 1100px) {
  #__profer-wqxt-edu-header {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 14px 18px;
  }
  #__profer-wqxt-edu-header .brand-section {
    justify-self: start;
    border-right: none;
    padding-right: 0;
  }
  #__profer-wqxt-edu-header .course-main-section {
    justify-self: stretch;
    align-items: flex-start;
    max-width: none;
  }
  #__profer-wqxt-edu-header .course-title-wrap,
  #__profer-wqxt-edu-header .course-meta-list {
    justify-content: flex-start;
  }
  #__profer-wqxt-edu-header .action-section {
    justify-self: start;
  }
}

/* ===== 2. Nya Player 播放器主容器 (#__profer-nya-player) ===== */
#__profer-nya-player {
  --primary-color: #248ef1;
  --primary-hover: #1c7ed6;
  --text-main: #ffffff;
  --text-sub: #cbd5e1;
  --bg-glass: rgba(15, 23, 42, 0.75);
  --bg-panel: rgba(20, 26, 38, 0.95);
  --border-glass: rgba(255, 255, 255, 0.12);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border-glass);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-family);
  color: var(--text-main);
  user-select: none;
}
#__profer-nya-player * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
}
#__profer-nya-player.web-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  border-radius: 0 !important;
  z-index: 99999 !important;
}
#__profer-nya-player .video-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
#__profer-nya-player video {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
  outline: none;
  pointer-events: none !important;
  transition: filter 0.2s ease, transform 0.2s ease;
}
#__profer-nya-player .subtitle-overlay {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 22px;
  font-weight: 500;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  text-align: center;
  z-index: 6;
  pointer-events: none;
  display: none;
  backdrop-filter: blur(4px);
}
#__profer-nya-player .center-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}
#__profer-nya-player .replay-modal {
  display: none;
  pointer-events: auto;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: var(--bg-glass);
  padding: 20px 32px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}
#__profer-nya-player .replay-modal:hover {
  transform: scale(1.05);
  background: rgba(30, 41, 59, 0.9);
}
#__profer-nya-player .center-badge {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
#__profer-nya-player .center-badge.animate-pulse {
  opacity: 1;
  transform: scale(1.2);
}
#__profer-nya-player .buffer-spinner {
  display: none;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: __profer_nya_spin 0.8s linear infinite;
}
@keyframes __profer_nya_spin {
  to { transform: rotate(360deg); }
}
#__profer-nya-player .control-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 16px 12px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.88) 100%);
  z-index: 20;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
#__profer-nya-player.idle-cursor .control-layer {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}
#__profer-nya-player.idle-cursor,
#__profer-nya-player.idle-cursor .video-viewport {
  cursor: none;
}
#__profer-nya-player .progress-wrap {
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
#__profer-nya-player .progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  transition: height 0.15s ease;
}
#__profer-nya-player .progress-wrap:hover .progress-track {
  height: 7px;
}
#__profer-nya-player .progress-buffer-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 4px;
  pointer-events: none;
}
#__profer-nya-player .progress-current-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: var(--primary-color);
  border-radius: 4px;
  pointer-events: none;
}
#__profer-nya-player .progress-thumb {
  position: absolute;
  top: 50%;
  left: 0%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  pointer-events: none;
}
#__profer-nya-player .progress-wrap:hover .progress-thumb {
  transform: translate(-50%, -50%) scale(1);
}
#__profer-nya-player .progress-preview-tooltip {
  position: absolute;
  bottom: 28px;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  background: var(--bg-panel);
  padding: 5px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-glass);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  z-index: 30;
}
#__profer-nya-player .progress-preview-tooltip img {
  width: 160px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
  background: #000;
  display: none;
}
#__profer-nya-player .preview-time-tag {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
#__profer-nya-player .controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  margin-top: 4px;
}
#__profer-nya-player .controls-left,
#__profer-nya-player .controls-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
#__profer-nya-player .ctrl-btn {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  transition: background 0.2s, transform 0.1s;
}
#__profer-nya-player .ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
#__profer-nya-player .ctrl-btn:active {
  transform: scale(0.92);
}
#__profer-nya-player .ctrl-btn svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}
#__profer-nya-player .time-display {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  font-variant-numeric: tabular-nums;
  margin-left: 4px;
}
#__profer-nya-player .time-current {
  color: #fff;
}
#__profer-nya-player .panel-trigger {
  position: relative;
}
#__profer-nya-player .flyout-panel {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: var(--bg-panel);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 10px;
  display: none;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  z-index: 40;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}
#__profer-nya-player .panel-trigger:hover .flyout-panel,
#__profer-nya-player .panel-trigger:focus-within .flyout-panel {
  display: flex;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
#__profer-nya-player .volume-panel {
  align-items: center;
  width: 38px;
  height: 140px;
  padding: 12px 0;
}
#__profer-nya-player .volume-slider-track {
  position: relative;
  width: 4px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
}
#__profer-nya-player .volume-slider-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  background: var(--primary-color);
  border-radius: 3px;
}
#__profer-nya-player .volume-slider-thumb {
  position: absolute;
  left: 50%;
  bottom: 80%;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, 50%);
}
#__profer-nya-player .speed-panel {
  width: 90px;
  gap: 4px;
}
#__profer-nya-player .speed-option {
  padding: 6px 0;
  text-align: center;
  font-size: 13px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-sub);
  transition: background 0.15s, color 0.15s;
}
#__profer-nya-player .speed-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
#__profer-nya-player .speed-option.active {
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(36, 142, 241, 0.15);
}
#__profer-nya-player .settings-panel {
  width: 240px;
  gap: 12px;
  padding: 14px;
}
#__profer-nya-player .settings-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
#__profer-nya-player .settings-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}
#__profer-nya-player .segmented-control {
  display: flex;
  background: rgba(0, 0, 0, 0.35);
  border-radius: var(--radius-sm);
  padding: 2px;
}
#__profer-nya-player .segment-btn {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-sub);
  font-size: 12px;
  padding: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
#__profer-nya-player .segment-btn.active {
  background: var(--primary-color);
  color: #fff;
  font-weight: 500;
}
#__profer-nya-player .slider-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}
#__profer-nya-player .slider-row input[type="range"] {
  flex: 1;
  height: 4px;
  accent-color: var(--primary-color);
  cursor: pointer;
}
#__profer-nya-player .reset-btn {
  color: var(--primary-color);
  font-size: 11px;
  cursor: pointer;
  border: none;
  background: none;
}
#__profer-nya-player .subtitle-panel {
  width: 180px;
  gap: 8px;
  padding: 12px;
}
#__profer-nya-player .context-menu {
  position: absolute;
  display: none;
  background: var(--bg-panel);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  padding: 6px;
  min-width: 190px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  z-index: 100;
}
#__profer-nya-player .menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-sub);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
#__profer-nya-player .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
#__profer-nya-player .menu-divider {
  height: 1px;
  background: var(--border-glass);
  margin: 4px 0;
}
/* 循环播放开启态：整行与右侧状态文案高亮品牌蓝 */
#__profer-nya-player #__profer-nya-menu-loop #__profer-nya-loop-state {
  color: var(--text-sub);
  font-weight: 600;
  transition: color 0.18s ease;
}
#__profer-nya-player #__profer-nya-menu-loop.is-loop-on,
#__profer-nya-player #__profer-nya-menu-loop.is-loop-on #__profer-nya-loop-state {
  color: var(--primary-color);
}

/* ===== 3. 课堂内页全宽与双窗布局 ===== */
/* 3.1 解除原站 .living-page-content 锁宽与缩小断点 */
.living-page-wrapper {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}
.living-page-content {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 12px 16px 24px !important;
  box-sizing: border-box !important;
}
.living-page-content .header-info {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 76px !important;
  margin: 0 0 14px 0 !important;
  padding: 0 !important;
  display: block !important;
}

/* 3.2 主内容网格：左视频 + 右 PPT 50%:50%（align-items: start 切断左右互相反向拉伸） */
.living-page-content .content-info {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
  column-gap: 16px !important;
  row-gap: 16px !important;
  align-items: start !important;
  width: 100% !important;
  position: relative !important;
}
.living-page-content .content-info > .content-left-gap {
  display: none !important;
}
.living-page-content .content-info > .content-right,
#contentRight {
  display: contents !important;
}

/* 3.3 左窗：视频画面（16:9 盒模型 + 58px 底栏，严格由列宽推导高度） */
.living-page-content .content-info > .content-left {
  grid-column: 1 / 2 !important;
  grid-row: 1 / 2 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  align-self: start !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08) !important;
}
/* 单流兜底：判定必须挂在共同父容器 .content-info 上（PPT/双流节点是 .content-left 的兄弟分支） */
.living-page-content .content-info:not(:has(#ppt_container)):not(:has(.stu_screen_con)) > .content-left {
  grid-column: 1 / -1 !important;
}
.living-page-content .content-left .video_lay {
  position: relative !important;
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
  height: auto !important;
  min-height: 0 !important;
  flex: 0 0 auto !important;
  overflow: hidden !important;
  background: #000000 !important;
}
.living-page-content .content-left .player-wrapper {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  flex: none !important;
}
/* 抵消原站 480px 防塌陷与 syncHostSize 写入的内联高度，保证左右两窗等高 */
.living-page-content .content-left #cmcPlayer_container,
.living-page-content .content-left .main_resize_con {
  min-height: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
/* 外层已整体圆角裁切，播放器自身圆角归零，避免底部出现圆角黑边 */
.living-page-content .content-left #__profer-nya-player:not(.web-fullscreen) {
  border-radius: 0 !important;
}

/* 3.4 左窗底部工具 / 弹幕栏（.content-left 是纵向 flex，不得使用 grid 定位） */
.living-page-content .content-left .tool-wrapper {
  width: 100% !important;
  height: 58px !important;
  min-height: 58px !important;
  flex: 0 0 58px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
}
.living-page-content .content-left .tool-wrapper .btn_studyNavigate,
.living-page-content .content-left .tool-wrapper .btn_studyNavigate1 {
  height: 38px !important;
  min-height: 38px !important;
  width: auto !important;
  padding: 0 14px !important;
  font-size: 14px !important;
  border-radius: 8px !important;
}
.living-page-content .content-left .tool-wrapper .danmu-send .el-input,
.living-page-content .content-left .tool-wrapper .danmu-send .el-input .el-input__inner {
  height: 38px !important;
  line-height: 38px !important;
  font-size: 14px !important;
}
.living-page-content .content-left .tool-wrapper .danmu-send .btn {
  height: 38px !important;
  line-height: 38px !important;
  width: 96px !important;
  font-size: 14px !important;
  border-radius: 0 8px 8px 0 !important;
}
/* 左侧竖排抽屉标签：绝对定位于 .video_lay 左侧，消除 30px 白边并严格受限于 16:9 高度 */
.living-page-content .content-left .sideComponentWrap {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  height: 100% !important;
  margin-left: 0 !important;
  background: transparent !important;
  z-index: 30 !important;
  pointer-events: none !important;
}
.living-page-content .content-left .sideComponentWrap > * {
  pointer-events: auto !important;
}
.living-page-content .sideComponentWrap .side_tab_wrap .side_tab .tab_span {
  font-size: 13px !important;
  line-height: 1.4 !important;
}

/* 3.5 右窗：PPT 画面（16:9 盒模型 + 58px 底栏，#ppt_canvas 脱离文档流切断 ResizeObserver 死循环） */
.living-page-content #ppt_container,
.living-page-content #contentRight > .ppt_wrap {
  grid-column: 2 / 3 !important;
  grid-row: 1 / 2 !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  align-self: start !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  background: #0f172a !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08) !important;
}
/* 批注弹窗态 .notePPT_edit_container 必须保持 1135×640 的原始画板尺寸，不参与大窗拉伸 */
.living-page-content #ppt_container .ppt_container:not(.notePPT_edit_container),
.living-page-content #contentRight > .ppt_wrap .ppt_container:not(.notePPT_edit_container) {
  flex: 0 0 auto !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}
.living-page-content #ppt_container .ppt_container:not(.notePPT_edit_container) .ppt_img_con,
.living-page-content #contentRight > .ppt_wrap .ppt_container:not(.notePPT_edit_container) .ppt_img_con {
  position: relative !important;
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
  height: auto !important;
  min-height: 0 !important;
  min-width: 0 !important;
  flex: 0 0 auto !important;
  overflow: hidden !important;
}
.living-page-content #ppt_container .ppt_container:not(.notePPT_edit_container) #ppt_canvas,
.living-page-content #contentRight > .ppt_wrap .ppt_container:not(.notePPT_edit_container) #ppt_canvas {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}
.living-page-content #ppt_container .ppt_opr_con,
.living-page-content #contentRight > .ppt_wrap .ppt_opr_con {
  flex: 0 0 58px !important;
  width: 100% !important;
  height: 58px !important;
  min-height: 58px !important;
}
/* PPT 原生全屏态兼容 */
.living-page-content #ppt_container:fullscreen .ppt_container:not(.notePPT_edit_container) {
  height: 100vh !important;
}
.living-page-content #ppt_container:fullscreen .ppt_container:not(.notePPT_edit_container) .ppt_img_con {
  aspect-ratio: auto !important;
  height: calc(100vh - 58px) !important;
  flex: 1 1 auto !important;
}
/* 三路画面课程（主视频 + PPT + 第二机位 .stu_screen_con）：有 PPT 时隐藏第二机位与右上角切换按钮 */
.living-page-content #contentRight:has(#ppt_container) > .stu_screen_con,
.living-page-content #contentRight:has(.ppt_wrap) > .stu_screen_con,
.living-page-content #ppt_container > .change-item,
.living-page-content #contentRight > .ppt_wrap > .change-item,
.living-page-content #contentRight > .stu_screen_con > .change-item {
  display: none !important;
}
/* 无 PPT 的纯双机位课程：将 .stu_screen_con 作为右窗展示 */
.living-page-content #contentRight:not(:has(#ppt_container)):not(:has(.ppt_wrap)) > .stu_screen_con {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  grid-column: 2 / 3 !important;
  grid-row: 1 / 2 !important;
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
  height: auto !important;
  min-height: 0 !important;
  align-self: start !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  background: #0f172a !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08) !important;
}

/* 3.6 下方右列：Tab 切换 / 笔记 / 互动聊天 / 学习日志 */
.living-page-content #contentRight > .portalroom-tab-switch {
  grid-column: 2 / 3 !important;
  grid-row: 2 / 3 !important;
  width: 100% !important;
  font-size: 15px !important;
  margin-bottom: -16px !important;
  border-radius: 14px 14px 0 0 !important;
  padding: 0 16px !important;
  border: 1px solid #e2e8f0 !important;
  border-bottom: none !important;
}
.living-page-content #contentRight > .tool_wrap {
  grid-column: 2 / 3 !important;
  grid-row: 3 / 4 !important;
  position: relative !important;
  width: 100% !important;
  min-height: 300px !important;
  height: auto !important;
  box-sizing: border-box !important;
  border-radius: 14px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06) !important;
  background: #ffffff !important;
  padding-bottom: 78px !important;
  font-size: 15px !important;
  line-height: 24px !important;
}
.living-page-content #contentRight > .chart {
  grid-column: 2 / 3 !important;
  grid-row: 3 / 4 !important;
  width: 100% !important;
  min-height: 300px !important;
  border-radius: 14px !important;
}
.living-page-content #contentRight > .editor_wrap {
  grid-column: 2 / 3 !important;
  grid-row: 3 / 4 !important;
  position: relative !important;
  top: auto !important;
  bottom: auto !important;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  min-height: 360px !important;
  margin-bottom: 78px !important;
  z-index: 1001 !important;
  border-radius: 14px 14px 0 0 !important;
  font-size: 15px !important;
  line-height: 24px !important;
}

/* 3.6.1 标记跳过：仅顶层窗体居中悬浮并置于最顶层，严禁污染内部子节点 */
.living-page-content .markSkipInfo_lay,
.living-page-content #contentRight > .markSkipInfo_lay,
.living-page-content div[class*="markSkip"]:not([class*="markSkip"] *):not(.markSkipInfo_lay *),
.living-page-content div[class*="mark_skip"]:not([class*="mark_skip"] *):not(.markSkipInfo_lay *) {
  position: fixed !important;
  z-index: 99999 !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  max-width: 90vw !important;
  max-height: 85vh !important;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3) !important;
  /* 顶层壳体本身不拦截点击，避免常驻/透明窗体吞掉整页交互 */
  pointer-events: none !important;
}
/* 仅真实控件恢复交互，内部装饰性容器继续保持穿透 */
.living-page-content .markSkipInfo_lay button,
.living-page-content .markSkipInfo_lay input,
.living-page-content .markSkipInfo_lay textarea,
.living-page-content .markSkipInfo_lay select,
.living-page-content .markSkipInfo_lay label,
.living-page-content .markSkipInfo_lay a,
.living-page-content .markSkipInfo_lay [contenteditable="true"],
.living-page-content .markSkipInfo_lay [role="button"],
.living-page-content .markSkipInfo_lay [class*="btn"],
.living-page-content .markSkipInfo_lay [class*="button"],
.living-page-content .markSkipInfo_lay [class*="close"],
.living-page-content div[class*="markSkip"] button,
.living-page-content div[class*="markSkip"] input,
.living-page-content div[class*="markSkip"] textarea,
.living-page-content div[class*="markSkip"] select,
.living-page-content div[class*="markSkip"] label,
.living-page-content div[class*="markSkip"] a,
.living-page-content div[class*="markSkip"] [contenteditable="true"],
.living-page-content div[class*="markSkip"] [role="button"],
.living-page-content div[class*="markSkip"] [class*="btn"],
.living-page-content div[class*="markSkip"] [class*="button"],
.living-page-content div[class*="markSkip"] [class*="close"] {
  pointer-events: auto !important;
}
/* 内部子元素严格保持原站正常的 relative / block / flex 流式排版 */
.living-page-content .markSkipInfo_lay *,
.living-page-content div[class*="markSkip"] * {
  box-sizing: border-box;
}

/* 3.7 笔记区字号与按钮放大（原站 <=1679px 会缩小到 9.99999px） */
.living-page-content #contentRight > .tool_wrap .wrap_tit,
.living-page-content #contentRight > .tool_wrap .tit_span {
  font-size: 16px !important;
  line-height: 22px !important;
  height: 22px !important;
}
.living-page-content #contentRight > .tool_wrap .note_opt,
.living-page-content #contentRight > .tool_wrap .content_opt,
.living-page-content #contentRight > .tool_wrap .empty_p {
  font-size: 15px !important;
  line-height: 24px !important;
}
.living-page-content #contentRight > .tool_wrap .log_time {
  font-size: 13px !important;
  line-height: 20px !important;
  height: 20px !important;
}
.living-page-content #contentRight > .tool_wrap .btn_wrap {
  height: 78px !important;
  padding: 0 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.living-page-content #contentRight > .tool_wrap img {
  max-width: 140px !important;
  height: auto !important;
}
.living-page-content #contentRight > .tool_wrap .edit_btn {
  width: 200px !important;
  height: 44px !important;
  min-height: 44px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
}

/* 3.8 下方左列：学习资源下载区 */
#__profer-wqxt-resource-panel {
  grid-column: 1 / 2 !important;
  grid-row: 2 / 4 !important;
  align-self: stretch !important;
  position: relative !important;
  width: 100% !important;
  min-height: 300px !important;
  height: auto !important;
  box-sizing: border-box !important;
  border-radius: 14px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06) !important;
  background: #ffffff !important;
  padding: 20px 22px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  color: #0f172a !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
}
#__profer-wqxt-resource-panel * {
  box-sizing: border-box !important;
}
#__profer-wqxt-resource-panel .resource-panel-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding-bottom: 12px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}
#__profer-wqxt-resource-panel .resource-panel-title-wrap {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}
#__profer-wqxt-resource-panel .resource-panel-icon {
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%) !important;
  color: #4f46e5 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
}
#__profer-wqxt-resource-panel .resource-panel-icon svg {
  width: 18px !important;
  height: 18px !important;
}
#__profer-wqxt-resource-panel .resource-panel-title {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  line-height: 1.3 !important;
  margin: 0 !important;
}
#__profer-wqxt-resource-panel .resource-panel-desc {
  font-size: 12px !important;
  color: #64748b !important;
  margin: 2px 0 0 0 !important;
  line-height: 1.4 !important;
}
#__profer-wqxt-resource-panel .resource-card-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  flex: 1 1 auto !important;
}
#__profer-wqxt-resource-panel .resource-card-item {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 14px 16px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  transition: all 0.2s ease !important;
}
#__profer-wqxt-resource-panel .resource-card-item:hover {
  background: #f1f5f9 !important;
  border-color: #cbd5e1 !important;
}
#__profer-wqxt-resource-panel .resource-card-item-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
#__profer-wqxt-resource-panel .resource-card-title-group {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
#__profer-wqxt-resource-panel .resource-card-title {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  margin: 0 !important;
}
#__profer-wqxt-resource-panel .resource-badge {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #4f46e5 !important;
  background: #eef2ff !important;
  border: 1px solid #c7d2fe !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
  line-height: 1 !important;
}
#__profer-wqxt-resource-panel .resource-card-desc {
  font-size: 12px !important;
  color: #64748b !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}
#__profer-wqxt-resource-panel .resource-status {
  font-size: 12px !important;
  color: #475569 !important;
  line-height: 1.3 !important;
  display: none;
}
#__profer-wqxt-resource-panel .resource-status.active {
  display: block !important;
}
#__profer-wqxt-resource-panel .resource-actions {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin-top: 2px !important;
}
#__profer-wqxt-resource-panel .resource-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 7px 13px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #334155 !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  line-height: 1.2 !important;
  user-select: none !important;
}
#__profer-wqxt-resource-panel .resource-btn:hover {
  color: #4f46e5 !important;
  border-color: #a5b4fc !important;
  background: #fafafa !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.08) !important;
}
#__profer-wqxt-resource-panel .resource-btn:active {
  transform: scale(0.98) !important;
}
#__profer-wqxt-resource-panel .resource-btn.primary {
  background: #4f46e5 !important;
  color: #ffffff !important;
  border-color: #4f46e5 !important;
}
#__profer-wqxt-resource-panel .resource-btn.primary:hover {
  background: #4338ca !important;
  border-color: #4338ca !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25) !important;
}
#__profer-wqxt-resource-panel .resource-btn:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 3.9 页面底部通栏：CDUT Studio 官方底栏 */
#__profer-wqxt-footer {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 60px !important;
  margin: 20px 0 16px 0 !important;
  padding: 12px 24px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(226, 232, 240, 0.85) !important;
  border-radius: 14px !important;
  box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.08) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
}
#__profer-wqxt-footer * {
  box-sizing: border-box !important;
}
#__profer-wqxt-footer .footer-content {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  user-select: none !important;
}
#__profer-wqxt-footer .footer-logo-badge {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  background: #ffffff !important;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.16) !important;
  flex-shrink: 0 !important;
}
#__profer-wqxt-footer .footer-logo-badge img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  display: block !important;
}
#__profer-wqxt-footer .footer-brand-title {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  letter-spacing: 0.3px !important;
}

/* ===== 4. AI 问渠助手：悬浮 Dock 胶囊与大尺寸留白窗体 ===== */
#__profer-ai-dock-btn {
  position: fixed !important;
  right: 24px !important;
  bottom: 24px !important;
  z-index: 9999 !important;
  width: auto !important;
  max-width: fit-content !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 11px 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.65) !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%) !important;
  color: #FFFFFF !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.2px !important;
  box-shadow: 0 12px 30px -6px rgba(79, 70, 229, 0.45), 0 4px 12px rgba(15, 23, 42, 0.12) !important;
  cursor: pointer !important;
  overflow: hidden !important;
  isolation: isolate !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif !important;
  user-select: none !important;
}
#__profer-ai-dock-btn::before {
  content: "" !important;
  position: absolute !important;
  inset: -2px !important;
  z-index: -1 !important;
  background: linear-gradient(110deg, transparent 32%, rgba(255, 255, 255, 0.55) 50%, transparent 68%) !important;
  background-size: 220% 100% !important;
  animation: __profer-ai-sheen 3.6s linear infinite !important;
  pointer-events: none !important;
}
#__profer-ai-dock-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 16px 38px -6px rgba(79, 70, 229, 0.55), 0 6px 16px rgba(15, 23, 42, 0.14) !important;
}
#__profer-ai-dock-btn.is-active {
  transform: translateY(1px) scale(0.98) !important;
  filter: saturate(1.15) !important;
}
#__profer-ai-dock-btn svg {
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0 !important;
}
@keyframes __profer-ai-sheen {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

#__profer-ai-panel {
  position: fixed !important;
  right: 24px !important;
  bottom: 92px !important;
  z-index: 9998 !important;
  width: 560px !important;
  max-width: calc(100vw - 40px) !important;
  height: 75vh !important;
  max-height: 800px !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
  background: rgba(255, 255, 255, 0.78) !important;
  backdrop-filter: blur(20px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 20px !important;
  box-shadow: 0 28px 72px -16px rgba(15, 23, 42, 0.38), 0 10px 28px -8px rgba(79, 70, 229, 0.22) !important;
  display: none !important;
  transform-origin: right bottom !important;
  overflow: hidden !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif !important;
  color: #0F172A !important;
}
#__profer-ai-panel.is-open {
  display: flex !important;
  animation: __profer-ai-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both !important;
}
@keyframes __profer-ai-in {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
#__profer-ai-panel .ai-panel-header {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 14px 16px !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7) !important;
  background: rgba(255, 255, 255, 0.55) !important;
  flex-shrink: 0 !important;
}
#__profer-ai-panel .ai-panel-logo {
  width: 34px !important;
  height: 34px !important;
  border-radius: 9px !important;
  overflow: hidden !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.18) !important;
  flex-shrink: 0 !important;
}
#__profer-ai-panel .ai-panel-logo img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  display: block !important;
}
#__profer-ai-panel .ai-panel-title-col {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  min-width: 0 !important;
}
#__profer-ai-panel .ai-panel-title {
  margin: 0 !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #0F172A !important;
  line-height: 1.3 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
#__profer-ai-panel .ai-panel-status {
  display: inline-flex !important;
  align-items: center !important;
  gap: 7px !important;
  padding: 3px 9px !important;
  border-radius: 999px !important;
  background: rgba(79, 70, 229, 0.08) !important;
  border: 1px solid rgba(79, 70, 229, 0.2) !important;
  color: #4F46E5 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  width: fit-content !important;
}
#__profer-ai-panel .ai-panel-status-dot {
  width: 6px !important;
  height: 6px !important;
  border-radius: 50% !important;
  background: #4F46E5 !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
  animation: __profer-ai-pulse 1.8s ease-in-out infinite !important;
}
@keyframes __profer-ai-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
#__profer-ai-panel .ai-panel-actions {
  margin-left: auto !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  flex-shrink: 0 !important;
}
#__profer-ai-panel .ai-panel-min,
#__profer-ai-panel .ai-panel-close {
  width: 30px !important;
  height: 30px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 8px !important;
  background: transparent !important;
  color: #64748B !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}
#__profer-ai-panel .ai-panel-min:hover,
#__profer-ai-panel .ai-panel-close:hover {
  background: rgba(15, 23, 42, 0.06) !important;
  color: #0F172A !important;
}
#__profer-ai-panel .ai-panel-min svg,
#__profer-ai-panel .ai-panel-close svg {
  width: 15px !important;
  height: 15px !important;
}
#__profer-ai-panel .ai-panel-body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 16px !important;
  padding: 28px 32px !important;
  text-align: center !important;
}
#__profer-ai-panel .ai-panel-badge-icon {
  width: 76px !important;
  height: 76px !important;
  border-radius: 22px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #4F46E5 !important;
  background: linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%) !important;
  box-shadow: inset 0 0 0 1px rgba(199, 210, 254, 0.9), 0 12px 28px -10px rgba(79, 70, 229, 0.35) !important;
}
#__profer-ai-panel .ai-panel-badge-icon svg {
  width: 38px !important;
  height: 38px !important;
}
#__profer-ai-panel .ai-panel-main-title {
  margin: 0 !important;
  font-size: 19px !important;
  font-weight: 800 !important;
  color: #0F172A !important;
  line-height: 1.35 !important;
}
#__profer-ai-panel .ai-panel-notice {
  margin: 0 !important;
  max-width: 400px !important;
  font-size: 14px !important;
  line-height: 1.75 !important;
  color: #475569 !important;
  background: rgba(255, 255, 255, 0.66) !important;
  border: 1px dashed rgba(148, 163, 184, 0.5) !important;
  border-radius: 14px !important;
  padding: 16px 18px !important;
  box-sizing: border-box !important;
}
#__profer-ai-panel .ai-panel-notice strong {
  color: #4F46E5 !important;
  font-weight: 700 !important;
}
#__profer-ai-panel .ai-panel-skeleton {
  width: 100% !important;
  margin-top: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  opacity: 0.6 !important;
}
#__profer-ai-panel .ai-panel-skeleton-row {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}
#__profer-ai-panel .ai-panel-model-select {
  height: 36px !important;
  padding: 0 12px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 12px !important;
  color: #64748B !important;
  background: rgba(248, 250, 252, 0.9) !important;
  border: 1px solid #E2E8F0 !important;
  border-radius: 10px !important;
  cursor: not-allowed !important;
  width: fit-content !important;
}
#__profer-ai-panel .ai-panel-prompt-slot {
  flex: 1 1 auto !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 14px !important;
  font-size: 13px !important;
  color: #94A3B8 !important;
  background: rgba(248, 250, 252, 0.9) !important;
  border: 1px solid #E2E8F0 !important;
  border-radius: 12px !important;
  cursor: not-allowed !important;
}
#__profer-ai-panel .ai-panel-send-slot {
  width: 44px !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  background: #CBD5E1 !important;
  color: #FFFFFF !important;
  cursor: not-allowed !important;
  flex-shrink: 0 !important;
}
#__profer-ai-panel .ai-panel-send-slot svg {
  width: 18px !important;
  height: 18px !important;
}
@media (prefers-color-scheme: dark) {
  #__profer-ai-panel {
    background: rgba(15, 23, 42, 0.82) !important;
    border-color: rgba(148, 163, 184, 0.28) !important;
    color: #E2E8F0 !important;
  }
  #__profer-ai-panel .ai-panel-header {
    background: rgba(15, 23, 42, 0.6) !important;
    border-bottom-color: rgba(148, 163, 184, 0.22) !important;
  }
  #__profer-ai-panel .ai-panel-title,
  #__profer-ai-panel .ai-panel-main-title {
    color: #F8FAFC !important;
  }
  #__profer-ai-panel .ai-panel-notice {
    background: rgba(30, 41, 59, 0.72) !important;
    border-color: rgba(148, 163, 184, 0.35) !important;
    color: #CBD5E1 !important;
  }
  #__profer-ai-panel .ai-panel-model-select,
  #__profer-ai-panel .ai-panel-prompt-slot {
    background: rgba(30, 41, 59, 0.72) !important;
    border-color: rgba(148, 163, 184, 0.3) !important;
    color: #94A3B8 !important;
  }
}
@media (max-width: 640px) {
  #__profer-ai-panel {
    right: 12px !important;
    bottom: 82px !important;
    width: calc(100vw - 24px) !important;
    height: calc(100vh - 120px) !important;
    max-height: none !important;
  }
  #__profer-ai-dock-btn {
    right: 12px !important;
    bottom: 12px !important;
  }
}

/* 3.10 窄屏响应式处理 */
@media (max-width: 1100px) {
  .living-page-content .content-info {
    grid-template-columns: 1fr !important;
  }
  .living-page-content .content-info > .content-left {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
  .living-page-content #ppt_container,
  .living-page-content #contentRight > .ppt_wrap {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
  #__profer-wqxt-resource-panel {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
  .living-page-content #contentRight > .portalroom-tab-switch {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
  .living-page-content #contentRight > .tool_wrap,
  .living-page-content #contentRight > .chart,
  .living-page-content #contentRight > .editor_wrap {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
}
`.trim()

/** 顶栏 HTML：逐字取自模板，仅注入 Base64 图标 */
function buildHeaderHtml(): string {
  return `<header class="edu-header-container" id="${WQXT_EDU_HEADER_ID}">
  <div class="brand-section">
    <div class="brand-logo-badge">
      <img src="${CDUT_STUDIO_LOGO_DATA_URL}" alt="CDUT Studio" draggable="false" />
    </div>
    <div class="brand-text-col">
      <div class="brand-main-row">
        <span class="brand-title">CDUT Studio</span>
        <span class="brand-divider">|</span>
        <span class="brand-sub">AI 问渠学堂</span>
      </div>
      <div class="brand-sub-row">Powered by 雫窝中央实验室 · 2026</div>
    </div>
  </div>

  <div class="course-main-section">
    <div class="course-title-wrap">
      <span class="status-badge-replay" id="__profer-status-badge">回放</span>
      <h1 class="course-title" id="__profer-course-title" title="">加载课程中...</h1>
    </div>
    <div class="course-meta-list">
      <span class="meta-chip" id="__profer-chip-teacher" title="授课教师">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span id="__profer-meta-teacher">-</span>
      </span>
      <span class="meta-chip" id="__profer-chip-address" title="授课地点">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span id="__profer-meta-address">-</span>
      </span>
      <span class="meta-chip" id="__profer-chip-time" title="授课时间">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span id="__profer-meta-time">-</span>
      </span>
    </div>
  </div>

  <div class="action-section">
    <button class="action-btn" id="__profer-btn-collect" aria-label="收藏">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <span id="__profer-label-collect">收藏</span>
    </button>

    <button class="action-btn" id="__profer-btn-good" aria-label="点赞">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
      <span id="__profer-label-good">点赞</span>
    </button>

    <div class="qr-popover-wrapper" id="__profer-qr-wrapper">
      <button class="action-btn" id="__profer-btn-qr" aria-label="扫码观看">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>扫码观看</span>
      </button>
    </div>
  </div>
</header>`
}

/** 扫码观看全局模态层 HTML：独立挂载于 body，彻底脱离顶栏层叠上下文 */
function buildQrModalHtml(): string {
  return `<div class="qr-modal" id="${WQXT_QR_MODAL_ID}" aria-hidden="true">
  <div class="qr-modal-backdrop" id="__profer-qr-backdrop"></div>
  <div class="qr-modal-card" role="dialog" aria-modal="true" aria-label="扫码观看">
    <button class="qr-modal-close" id="__profer-qr-close" type="button" aria-label="关闭">×</button>
    <div class="qr-modal-head">
      <div class="qr-modal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </div>
      <div>
        <h3 class="qr-modal-title">扫码观看</h3>
        <p class="qr-modal-desc">微信 / 手机扫码同步观看</p>
      </div>
    </div>
    <div class="qr-modal-img-wrap">
      <img id="__profer-qr-img" src="" alt="扫码观看二维码" />
    </div>
    <p class="qr-modal-hint">打开微信扫一扫，即可在手机上继续观看本堂课</p>
  </div>
</div>`
}

/** AI 问渠助手悬浮 Dock 胶囊 HTML */
function buildAiDockHtml(): string {
  return `<button class="ai-dock-btn" id="${WQXT_AI_DOCK_ID}" type="button" aria-label="打开 AI 问渠助手">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"></path>
    <path d="M18.5 14l.9 2.4 2.6.9-2.6.9-.9 2.4-.9-2.4-2.6-.9 2.6-.9z"></path>
  </svg>
  <span>AI 问渠助手</span>
</button>`
}

/** AI 问渠助手大尺寸毛玻璃留白窗体 HTML */
function buildAiPanelHtml(): string {
  return `<div class="ai-panel" id="${WQXT_AI_PANEL_ID}" aria-hidden="true">
  <div class="ai-panel-header">
    <span class="ai-panel-logo">
      <img src="${CDUT_STUDIO_LOGO_DATA_URL}" alt="CDUT Studio" draggable="false" />
    </span>
    <div class="ai-panel-title-col">
      <h3 class="ai-panel-title">CDUT Studio AI 助手</h3>
      <span class="ai-panel-status"><span class="ai-panel-status-dot"></span>对齐测试中</span>
    </div>
    <div class="ai-panel-actions">
      <button class="ai-panel-min" id="__profer-ai-min" type="button" aria-label="最小化">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button class="ai-panel-close" id="__profer-ai-close" type="button" aria-label="关闭">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="6" y1="6" x2="18" y2="18"></line>
          <line x1="18" y1="6" x2="6" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
  <div class="ai-panel-body">
    <div class="ai-panel-badge-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.5l1.9 5.2 5.2 1.9-5.2 1.9-1.9 5.2-1.9-5.2L5 9.6l5.2-1.9z"></path>
        <path d="M18.8 15l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"></path>
      </svg>
    </div>
    <h2 class="ai-panel-main-title">雫窝中央实验室 · 大模型对齐测试中</h2>
    <p class="ai-panel-notice"><strong>雫窝正在对大模型接入进行安全对齐和实验室测试，当前版本暂不开放捏~</strong></p>
    <div class="ai-panel-skeleton">
      <div class="ai-panel-skeleton-row">
        <div class="ai-panel-model-select">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l9 5-9 5-9-5z"></path>
            <path d="M3 12l9 5 9-5"></path>
            <path d="M3 17l9 5 9-5"></path>
          </svg>
          <span>模型选择（待接入）</span>
          <span>▾</span>
        </div>
      </div>
      <div class="ai-panel-skeleton-row">
        <div class="ai-panel-prompt-slot">输入你的问题，等待大模型接入…</div>
        <div class="ai-panel-send-slot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9"></polygon>
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>`
}

/** Nya Player HTML：按模板 class 结构完整构建，弹幕相关节点一律不存在 */
function buildPlayerHtml(): string {
  return `<div id="${WQXT_NYA_PLAYER_ID}">
  <div class="video-viewport">
    <div class="center-overlay">
      <div class="buffer-spinner" id="__profer-buffer-spinner"></div>
      <div class="center-badge" id="__profer-center-badge">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><polygon points="8,5 19,12 8,19"></polygon></svg>
      </div>
      <div class="replay-modal" id="__profer-replay-modal">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span style="font-size: 13px; color: #fff;">重新播放</span>
      </div>
    </div>
    <div class="subtitle-overlay" id="subtitle-box"></div>
  </div>

  <div class="control-layer">
    <div class="progress-wrap" id="progress-wrap">
      <div class="progress-track">
        <div class="progress-buffer-bar" id="progress-buffer"></div>
        <div class="progress-current-bar" id="progress-current"></div>
        <div class="progress-thumb" id="progress-thumb"></div>
      </div>
      <div class="progress-preview-tooltip" id="preview-tooltip">
        <img id="preview-img" alt="视频预览" />
        <span class="preview-time-tag" id="preview-time">00:00</span>
      </div>
    </div>

    <div class="controls-row">
      <div class="controls-left">
        <button class="ctrl-btn" id="play-btn" aria-label="播放/暂停">
          <svg viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19"></polygon></svg>
        </button>
        <span class="time-display"><span class="time-current" id="time-current">00:00</span> / <span id="time-total">00:00</span></span>
        <div class="panel-trigger" id="volume-trigger">
          <button class="ctrl-btn" id="mute-btn" aria-label="静音">
            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
          </button>
          <div class="flyout-panel volume-panel">
            <div class="volume-slider-track" id="volume-track">
              <div class="volume-slider-fill" id="volume-fill"></div>
              <div class="volume-slider-thumb" id="volume-thumb"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls-right">
        <div class="panel-trigger" id="speed-trigger">
          <button class="ctrl-btn" id="speed-btn" aria-label="倍速"><span id="speed-label" style="font-size: 14px; font-weight: 600;">1.0X</span></button>
          <div class="flyout-panel speed-panel" id="speed-panel">
            <div class="speed-option" data-rate="3">3.0X</div>
            <div class="speed-option" data-rate="2">2.0X</div>
            <div class="speed-option" data-rate="1.5">1.5X</div>
            <div class="speed-option" data-rate="1.25">1.25X</div>
            <div class="speed-option active" data-rate="1">1.0X</div>
            <div class="speed-option" data-rate="0.75">0.75X</div>
          </div>
        </div>
        <div class="panel-trigger" id="subtitle-trigger">
          <button class="ctrl-btn" id="subtitle-btn" aria-label="字幕">
            <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-8 10H7v-2h4v2zm6 0h-4v-2h4v2z"></path></svg>
          </button>
          <div class="flyout-panel subtitle-panel">
            <div class="slider-row"><span>字号</span><input type="range" id="sub-size-slider" min="14" max="36" value="22" /></div>
          </div>
        </div>
        <div class="panel-trigger" id="settings-trigger">
          <button class="ctrl-btn" id="settings-btn" aria-label="设置">
            <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"></path></svg>
          </button>
          <div class="flyout-panel settings-panel">
            <div class="settings-group">
              <div class="settings-title">画面比例</div>
              <div class="segmented-control">
                <button class="segment-btn active" data-fit="contain">等比</button>
                <button class="segment-btn" data-fit="cover">裁剪</button>
                <button class="segment-btn" data-fit="fill">满屏</button>
              </div>
            </div>
            <div class="settings-group">
              <div class="settings-title">画面调节</div>
              <div class="slider-row"><span>亮度</span><input type="range" id="filter-bright" min="50" max="150" value="100" /></div>
              <div class="slider-row"><span>对比度</span><input type="range" id="filter-contrast" min="50" max="150" value="100" /></div>
              <button class="reset-btn" id="filter-reset">恢复默认</button>
            </div>
          </div>
        </div>
        <button class="ctrl-btn" id="screenshot-btn" aria-label="截图">
          <svg viewBox="0 0 24 24"><path d="M9 3l-1.83 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"></path></svg>
        </button>
        <button class="ctrl-btn" id="pip-btn" aria-label="画中画">
          <svg viewBox="0 0 24 24"><path d="M19 11h-8v6h8v-6zm4 8V5c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 0H3V5h18v14z"></path></svg>
        </button>
        <button class="ctrl-btn" id="web-fullscreen-btn" aria-label="网页全屏">
          <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
        </button>
        <button class="ctrl-btn" id="fullscreen-btn" aria-label="全屏">
          <svg id="__profer-fs-enter" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
          <svg id="__profer-fs-exit" viewBox="0 0 24 24" style="display:none"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v5h5v-2H8V8zm6 11h2v-3h3v-2h-5v5zm5-11h-3v2h3v3h2V8h-2z"></path></svg>
        </button>
      </div>
    </div>
  </div>

  <div class="context-menu" id="__profer-nya-context-menu">
    <div class="menu-item" style="color: var(--primary-color); font-weight: 600;">
      <span>Nya Player</span>
      <span style="font-size: 10px; opacity: 0.8;">v5.0</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" id="__profer-nya-menu-loop">
      <span>循环播放</span>
      <span id="__profer-nya-loop-state" style="opacity: 0.6;">关</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" style="pointer-events: none; opacity: 0.5;">
      <span>快捷键: 空格暂停 / ← → 定位</span>
    </div>
  </div>
</div>`
}

/** 学习资源下载区 HTML：自上而下包含 PPT、智能摘要、语音转录三大卡片 */
function buildResourcePanelHtml(): string {
  return `<section class="resource-panel-container" id="${WQXT_RESOURCE_PANEL_ID}">
  <div class="resource-panel-header">
    <div class="resource-panel-title-wrap">
      <div class="resource-panel-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
      <div>
        <h2 class="resource-panel-title">学习资源下载</h2>
        <p class="resource-panel-desc">课件幻灯片、智能要点摘要与中英双语语音转录</p>
      </div>
    </div>
  </div>

  <div class="resource-card-list">
    <!-- 1. 课件 PPT -->
    <div class="resource-card-item" id="__profer-resource-card-ppt">
      <div class="resource-card-item-header">
        <div class="resource-card-title-group">
          <h3 class="resource-card-title">课堂课件 PPT</h3>
          <span class="resource-badge">高清幻灯片</span>
        </div>
      </div>
      <p class="resource-card-desc">自动提取本节授课 PPT 页面，支持导出为幻灯片原件、打印 PDF 或离线 HTML 讲义。</p>
      <div class="resource-status" id="__profer-ppt-status"></div>
      <div class="resource-actions">
        <button class="resource-btn primary" id="__profer-btn-ppt-pptx" aria-label="导出 PPTX 原文件">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <span>导出 PPTX</span>
        </button>
        <button class="resource-btn" id="__profer-btn-ppt-pdf" aria-label="打印或另存为 PDF">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>打印 / PDF</span>
        </button>
        <button class="resource-btn" id="__profer-btn-ppt-html" aria-label="下载 HTML 离线讲义">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>HTML 讲义</span>
        </button>
      </div>
    </div>

    <!-- 2. 智能摘要 -->
    <div class="resource-card-item" id="__profer-resource-card-summary">
      <div class="resource-card-item-header">
        <div class="resource-card-title-group">
          <h3 class="resource-card-title">课程智能摘要</h3>
          <span class="resource-badge">AI 核心提炼</span>
        </div>
      </div>
      <p class="resource-card-desc">包含内容核心摘要、专业关键词、分章节段落总结及重难点自测 Q&A。</p>
      <div class="resource-status" id="__profer-summary-status"></div>
      <div class="resource-actions">
        <button class="resource-btn primary" id="__profer-btn-summary-md" aria-label="导出智能摘要 Markdown">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 12 12 15 15"></polyline><line x1="12" y1="12" x2="12" y2="21"></line></svg>
          <span>导出智能摘要 (.md)</span>
        </button>
      </div>
    </div>

    <!-- 3. 语音转录 -->
    <div class="resource-card-item" id="__profer-resource-card-transcript">
      <div class="resource-card-item-header">
        <div class="resource-card-title-group">
          <h3 class="resource-card-title">课堂语音转录</h3>
          <span class="resource-badge">双语全文</span>
        </div>
      </div>
      <p class="resource-card-desc">全量解析课堂视频音频识别记录，按精确时间戳对齐中英双语全文内容。</p>
      <div class="resource-status" id="__profer-transcript-status"></div>
      <div class="resource-actions">
        <button class="resource-btn primary" id="__profer-btn-transcript-md" aria-label="导出双语语音转录 Markdown">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          <span>导出双语转录 (.md)</span>
        </button>
      </div>
    </div>
  </div>
</section>`
}

/** 底部 CDUT Studio 通栏底栏 HTML */
function buildFooterHtml(): string {
  return `<footer class="profer-wqxt-footer-card" id="${WQXT_FOOTER_ID}">
  <div class="footer-content">
    <div class="footer-logo-badge">
      <img src="${CDUT_STUDIO_LOGO_DATA_URL}" alt="CDUT Studio" draggable="false" />
    </div>
    <span class="footer-brand-title">CDUT Studio</span>
  </div>
</footer>`
}

/**
 * 构建注入主世界的升级运行时源码。
 *
 * 约束：源码内不得使用反引号或 \${，以便安全嵌入净化脚本模板；
 * sync() 幂等：只在缺失时创建节点，文本仅在变化时写入，避免自触发 MutationObserver。
 */
export function buildWqxtUpgradeRuntimeScript(): string {
  const cssJson = JSON.stringify(WQXT_UPGRADE_CSS)
  const headerHtmlJson = JSON.stringify(buildHeaderHtml())
  const qrModalHtmlJson = JSON.stringify(buildQrModalHtml())
  const aiDockHtmlJson = JSON.stringify(buildAiDockHtml())
  const aiPanelHtmlJson = JSON.stringify(buildAiPanelHtml())
  const playerHtmlJson = JSON.stringify(buildPlayerHtml())
  const resourcePanelHtmlJson = JSON.stringify(buildResourcePanelHtml())
  const footerHtmlJson = JSON.stringify(buildFooterHtml())
  return `;(function () {
  'use strict';
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (location.hostname.toLowerCase() !== 'classroom.wqxt.cdut.edu.cn') return;

    // 幂等重入：同一文档内二次注入（preload + dom-ready 补偿）直接复用既有闭包，
    // 避免重复挂载 document 级快捷键监听导致「按一次切两次」
    var existingUpgrader = window.__proferWqxtUpgrader;
    if (existingUpgrader && typeof existingUpgrader.sync === 'function') {
      existingUpgrader.sync();
      return;
    }

    var HEADER_ID = ${JSON.stringify(WQXT_EDU_HEADER_ID)};
    var PLAYER_ID = ${JSON.stringify(WQXT_NYA_PLAYER_ID)};
    var RESOURCE_PANEL_ID = ${JSON.stringify(WQXT_RESOURCE_PANEL_ID)};
    var FOOTER_ID = ${JSON.stringify(WQXT_FOOTER_ID)};
    var QR_MODAL_ID = ${JSON.stringify(WQXT_QR_MODAL_ID)};
    var AI_DOCK_ID = ${JSON.stringify(WQXT_AI_DOCK_ID)};
    var AI_PANEL_ID = ${JSON.stringify(WQXT_AI_PANEL_ID)};
    var STYLE_ID = ${JSON.stringify(WQXT_UPGRADE_STYLE_ID)};
    var CSS_TEXT = ${cssJson};
    var HEADER_HTML = ${headerHtmlJson};
    var QR_MODAL_HTML = ${qrModalHtmlJson};
    var AI_DOCK_HTML = ${aiDockHtmlJson};
    var AI_PANEL_HTML = ${aiPanelHtmlJson};
    var PLAYER_HTML = ${playerHtmlJson};
    var RESOURCE_PANEL_HTML = ${resourcePanelHtmlJson};
    var FOOTER_HTML = ${footerHtmlJson};

    // 收藏 / 点赞选择器链：按优先级逐个探测，顶层未命中再扫描整个 document
    var COLLECT_SELECTORS = ['.collect_span.opr_btn', '.collect_span', '.opr_btn.collect', '[class*="collect_span"]', '[class*="btn_collect"]'];
    var GOOD_SELECTORS = ['.good_span.opr_btn', '.good_span', '.opr_btn.good', '[class*="good_span"]', '[class*="btn_good"]', '[class*="like"]'];

    var playerEl = null;
    var videoEl = null;
    var videoOriginalParent = null;
    var videoOriginalNext = null;
    var keydownAttached = false;
    var hideTimer = null;
    var qrPollTimer = null;
    var headerPollTimer = null;
    var seeking = false;
    var lastClickToggleAt = 0;
    var subPreviewTimer = null;
    var subtitleVisible = false;
    var lastPlaying = null;
    var lastMuted = null;
    var pptObserver = null;
    var pptTimer = null;
    var pptRaf = null;
    var pptTarget = null;
    var pptLastW = 0;
    var pptLastH = 0;

    var SVG_PLAY = '<svg viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19"></polygon></svg>';
    var SVG_PAUSE = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>';
    var SVG_VOLUME = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>';
    var SVG_MUTED = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path><path d="M21 8l-6 8M15 8l6 8" stroke="#fff" stroke-width="2" fill="none"></path></svg>';

    function isLivingRoom() {
      var path = location.pathname.replace(/\\/+$/, '');
      var hash = location.hash || '';
      var hashPath = hash.replace(/^#\\/?/, '').split('?')[0].replace(/\\/+$/, '');
      if (path !== '/livingroom' && hashPath !== 'livingroom') return false;
      var query = location.search || (hash.indexOf('?') === -1 ? '' : hash.slice(hash.indexOf('?')));
      return /[?&]course_id=\\d+/i.test(query);
    }

    function byId(id) { return document.getElementById(id); }
    function setText(el, value) { if (el && el.textContent !== value) el.textContent = value; }
    function setShown(el, shown) { if (el) el.style.display = shown ? '' : 'none'; }
    function readText(selector, root) {
      var node = (root || document).querySelector(selector);
      return node && node.textContent ? node.textContent.trim() : '';
    }

    function ensureStyle() {
      if (document.getElementById(STYLE_ID)) return;
      var parent = document.head || document.documentElement;
      if (!parent) return;
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS_TEXT;
      parent.appendChild(style);
    }

    function removeStyle() {
      var style = document.getElementById(STYLE_ID);
      if (style && style.parentNode) style.parentNode.removeChild(style);
    }

    /** 按选择器链优先级探测原站节点：优先 div.header-info，未命中自动回退整份文档 */
    function findOriginal(selectors) {
      var host = document.querySelector('div.header-info');
      var i;
      var node;
      for (i = 0; i < selectors.length; i++) {
        node = host ? host.querySelector(selectors[i]) : null;
        if (node) return node;
      }
      for (i = 0; i < selectors.length; i++) {
        node = document.querySelector(selectors[i]);
        if (node) return node;
      }
      return null;
    }

    /** 按四级顺序提取站点真实字幕文本；全部未命中返回空串（不回退假文案） */
    function findOriginalSubtitleText() {
      // 1. 原生 textTracks 激活 cue（最可靠）
      if (videoEl && videoEl.textTracks && videoEl.textTracks.length > 0) {
        for (var t = 0; t < videoEl.textTracks.length; t++) {
          var cues = videoEl.textTracks[t].activeCues;
          if (cues && cues.length > 0 && cues[0].text) return String(cues[0].text).trim();
        }
      }
      // 2. 站点 Vue v-if 槽位：#cmcPlayer_container 与 .main_resize_con 的直接子节点
      //    （.main_resize_con 下 .danmu-container 与 #cmcPlayer_container 之间可能挂载字幕层）
      var hosts = [document.getElementById('cmcPlayer_container'), document.querySelector('.main_resize_con')];
      for (var h = 0; h < hosts.length; h++) {
        var host = hosts[h];
        if (!host) continue;
        var kids = host.children;
        for (var i = 0; i < kids.length; i++) {
          var kid = kids[i];
          if (!kid) continue;
          if (kid.id === 'cmcPlayer_container' || kid.id === 'cmc_cmcPlayer_container' || kid.id === PLAYER_ID) continue;
          if (kid.classList && kid.classList.contains('danmu-container')) continue;
          var kidCls = ' ' + (kid.className || '') + ' ';
          if (/(?:cmc-rightkey|control-content|cmc-expand)/.test(kidCls)) continue;
          var txt = (kid.textContent || '').trim();
          if (txt) return txt;
        }
      }
      // 3. CMCPlayer 内容区内的字幕层（排除视频/水印/重播/缓冲/错误层）
      var playerContent = document.querySelector('#cmc_cmcPlayer_container .player-content');
      if (playerContent) {
        var pKids = playerContent.children;
        for (var j = 0; j < pKids.length; j++) {
          var pc = pKids[j];
          if (!pc) continue;
          var cls = ' ' + (pc.className || '') + ' ';
          if (/(?:cmc-video|cmc-expand|cmc-replay|cmc-buffer|cmc-error)/.test(cls)) continue;
          var pTxt = (pc.textContent || '').trim();
          if (pTxt) return pTxt;
        }
      }
      // 4. 兜底：页面内真实字幕浮层，严格排除右键菜单与控制栏
      var candidates = document.querySelectorAll('[class*="subtitle"]:not(.cmc-subtitlepanel):not(.subtitle-panel)');
      for (var k = 0; k < candidates.length; k++) {
        var node = candidates[k];
        if (playerEl && playerEl.contains(node)) continue;
        if (node.closest && (node.closest('.cmc-rightkey') || node.closest('.control-content'))) continue;
        var cTxt = (node.textContent || '').trim();
        if (cTxt) return cTxt;
      }
      return '';
    }

    // ---------- 顶栏 ----------
    function upgradeHeader() {
      var host = document.querySelector('div.header-info');
      if (!host) return false;
      if (!host.classList.contains('profer-wqxt-header-upgraded')) {
        host.classList.add('profer-wqxt-header-upgraded');
      }
      if (!document.getElementById(HEADER_ID)) {
        var wrap = document.createElement('div');
        wrap.innerHTML = HEADER_HTML.trim();
        var node = wrap.firstElementChild;
        if (!node) return false;
        host.appendChild(node);
        bindHeader(node);
      }
      return true;
    }

    function bindHeader(node) {
      if (node.__proferHeaderBound) return;
      node.__proferHeaderBound = true;
      var collect = node.querySelector('#__profer-btn-collect');
      if (collect) collect.addEventListener('click', function () {
        triggerOriginalAction(COLLECT_SELECTORS);
      });
      var good = node.querySelector('#__profer-btn-good');
      if (good) good.addEventListener('click', function () {
        triggerOriginalAction(GOOD_SELECTORS);
      });
      var qrBtn = node.querySelector('#__profer-btn-qr');
      if (qrBtn) qrBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        var modal = byId(QR_MODAL_ID);
        if (modal && modal.classList.contains('is-open')) closeQrModal();
        else openQrModal();
      });
    }

    function syncActionButton(selector, btnId, labelId, fallbackLabel) {
      var original = findOriginal(selector);
      var btn = byId(btnId);
      var label = byId(labelId);
      if (!original) { setShown(btn, false); return; }
      setShown(btn, true);
      var text = (original.textContent || '').trim() || fallbackLabel;
      setText(label, text);
      var classes = ' ' + (original.className || '') + ' ';
      var active = /(?:^| )(?:active|is-active|selected|collected|liked)(?: |$)/.test(classes);
      if (btn && btn.classList.contains('is-active') !== active) btn.classList.toggle('is-active', active);
    }

    function syncQr(host) {
      var img = byId('__profer-qr-img');
      var qrNode = host.querySelector('img.qrCode_img') || document.querySelector('img.qrCode_img');
      var src = qrNode ? (qrNode.getAttribute('src') || '') : '';
      if (img && src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      var wrapper = byId('__profer-qr-wrapper');
      var hasQr = !!(host.querySelector('.QRcode_span') || document.querySelector('.QRcode_span') || qrNode);
      if (wrapper) setShown(wrapper, hasQr);
    }

    function triggerQr() {
      var span = findOriginal(['.QRcode_span']);
      if (!span) return;
      var types = ['mouseenter', 'mouseover', 'click'];
      for (var i = 0; i < types.length; i++) {
        try {
          span.dispatchEvent(new MouseEvent(types[i], { bubbles: true, cancelable: true }));
        } catch (e) {}
      }
      if (qrPollTimer) clearInterval(qrPollTimer);
      var tries = 0;
      qrPollTimer = setInterval(function () {
        tries++;
        var host = document.querySelector('div.header-info');
        if (host) syncQr(host);
        if (tries >= 10) { clearInterval(qrPollTimer); qrPollTimer = null; }
      }, 300);
    }

    function syncHeader() {
      var host = document.querySelector('div.header-info');
      var node = byId(HEADER_ID);
      if (!host || !node) return;

      var status = readText('.course-info__header-livingstatus', host) || '回放';
      setText(byId('__profer-status-badge'), status);

      var titleNode = host.querySelector('p.course_name');
      var title = '';
      if (titleNode) title = (titleNode.getAttribute('title') || '').trim() || (titleNode.textContent || '').trim();
      if (title && status && title.indexOf(status) === 0) title = title.slice(status.length).trim();
      title = title || '加载课程中...';
      var titleEl = byId('__profer-course-title');
      setText(titleEl, title);
      if (titleEl && titleEl.getAttribute('title') !== title) titleEl.setAttribute('title', title);

      var teacher = readText('.teacher_span', host);
      if (teacher && teacher.slice(-2) !== '老师') teacher = teacher + ' 老师';
      var address = readText('.address_span', host);
      var time = readText('.time_span', host);

      setText(byId('__profer-meta-teacher'), teacher || '-');
      setText(byId('__profer-meta-address'), address || '-');
      setText(byId('__profer-meta-time'), time || '-');
      setShown(byId('__profer-chip-teacher'), !!teacher);
      setShown(byId('__profer-chip-address'), !!address);
      setShown(byId('__profer-chip-time'), !!time);

      syncActionButton(COLLECT_SELECTORS, '__profer-btn-collect', '__profer-label-collect', '收藏');
      syncActionButton(GOOD_SELECTORS, '__profer-btn-good', '__profer-label-good', '点赞');
      syncQr(host);
    }

    // ---------- 收藏 / 点赞：完整鼠标事件链路与异步状态轮询 ----------
    /** 目标元素及其内部图标节点派发 mousedown -> mouseup -> click，穿透 Vue 原生委托监听 */
    function emitMouseSequence(target) {
      var types = ['mousedown', 'mouseup', 'click'];
      for (var i = 0; i < types.length; i++) {
        target.dispatchEvent(new MouseEvent(types[i], {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0
        }));
      }
    }

    function triggerOriginalAction(selectors) {
      var original = findOriginal(selectors);
      if (!original) return;
      // 优先命中内部子节点（svg / path / use / i / span），事件冒泡回原节点上的监听器；
      // 仅派发一次，避免 original.click() 再触发一次导致收藏/点赞被连点两次
      var inner = original.querySelector('use, path, svg, i, span');
      try {
        emitMouseSequence(inner || original);
      } catch (e) {
        try { original.click(); } catch (e2) {}
      }
      syncHeader();
      startHeaderPoll();
    }

    /** 点击后 1.5 秒短轮询（200ms/次），捕获 Vue 异步请求成功后的类名与计数更新 */
    function startHeaderPoll() {
      if (headerPollTimer) { clearInterval(headerPollTimer); headerPollTimer = null; }
      var elapsed = 0;
      headerPollTimer = setInterval(function () {
        elapsed += 200;
        syncHeader();
        if (elapsed >= 1500) {
          clearInterval(headerPollTimer);
          headerPollTimer = null;
        }
      }, 200);
    }

    // ---------- 全局浮层挂载（扫码模态层 / AI 助手） ----------
    function appendToBody(html, id) {
      var existing = byId(id);
      if (existing) return existing;
      if (!document.body) return null;
      var wrap = document.createElement('div');
      wrap.innerHTML = html.trim();
      var node = wrap.firstElementChild;
      if (!node) return null;
      document.body.appendChild(node);
      return node;
    }

    function ensureQrModal() {
      var node = appendToBody(QR_MODAL_HTML, QR_MODAL_ID);
      if (!node) return null;
      if (!node.__proferQrBound) {
        node.__proferQrBound = true;
        node.addEventListener('click', function (event) {
          var target = event.target;
          if (!target) return;
          if (target === node || (target.classList && target.classList.contains('qr-modal-backdrop'))) {
            closeQrModal();
          }
        });
        var close = node.querySelector('#__profer-qr-close');
        if (close) close.addEventListener('click', function () { closeQrModal(); });
      }
      return node;
    }

    function openQrModal() {
      var node = ensureQrModal();
      if (!node) return;
      node.classList.add('is-open');
      node.setAttribute('aria-hidden', 'false');
      triggerQr();
    }

    function closeQrModal() {
      var node = byId(QR_MODAL_ID);
      if (!node) return;
      if (node.classList.contains('is-open')) node.classList.remove('is-open');
      node.setAttribute('aria-hidden', 'true');
      if (qrPollTimer) { clearInterval(qrPollTimer); qrPollTimer = null; }
    }

    function ensureAiAssistant() {
      var dock = appendToBody(AI_DOCK_HTML, AI_DOCK_ID);
      var panel = appendToBody(AI_PANEL_HTML, AI_PANEL_ID);
      if (dock && !dock.__proferAiBound) {
        dock.__proferAiBound = true;
        dock.addEventListener('click', function (event) {
          event.stopPropagation();
          var current = byId(AI_PANEL_ID);
          if (current && current.classList.contains('is-open')) closeAiPanel();
          else openAiPanel();
        });
      }
      if (panel && !panel.__proferAiBound) {
        panel.__proferAiBound = true;
        panel.addEventListener('click', function (event) { event.stopPropagation(); });
        var min = panel.querySelector('#__profer-ai-min');
        if (min) min.addEventListener('click', closeAiPanel);
        var close = panel.querySelector('#__profer-ai-close');
        if (close) close.addEventListener('click', closeAiPanel);
      }
    }

    function openAiPanel() {
      var panel = byId(AI_PANEL_ID);
      if (!panel) panel = appendToBody(AI_PANEL_HTML, AI_PANEL_ID);
      var dock = byId(AI_DOCK_ID);
      if (panel) {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      if (dock) dock.classList.add('is-active');
    }

    function closeAiPanel() {
      var panel = byId(AI_PANEL_ID);
      var dock = byId(AI_DOCK_ID);
      if (panel) {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      if (dock) dock.classList.remove('is-active');
    }

    // ---------- 播放器 ----------
    function upgradePlayer() {
      var host = document.getElementById('cmcPlayer_container') || document.querySelector('.main_resize_con');
      if (!host) return false;
      if (!host.classList.contains('profer-nya-upgraded')) host.classList.add('profer-nya-upgraded');
      // 模板 CSS 的防塌陷规则挂在 #cmcPlayer_container 上；回退宿主时用内联 min-height 兜底
      if (host.id !== 'cmcPlayer_container' && host.style.minHeight !== '480px') host.style.minHeight = '480px';
      syncHostSize(host);
      if (!document.getElementById(PLAYER_ID)) {
        var wrap = document.createElement('div');
        wrap.innerHTML = PLAYER_HTML.trim();
        var node = wrap.firstElementChild;
        if (!node) return false;
        host.appendChild(node);
        bindPlayer(node);
      }
      playerEl = byId(PLAYER_ID);
      syncVideo();
      return true;
    }

    function syncHostSize(host) {
      var source = document.getElementById('cmc_cmcPlayer_container');
      if (!source || !host) return;
      var height = source.style.height || '';
      // 只同步高度兜底防塌陷；宽度交给 width:100% + aspect-ratio 自适应，避免窄窗口被 min-width 撑出横向滚动
      if (/^\\d+px$/.test(height) && host.style.minHeight !== height) host.style.minHeight = height;
    }

    function bindPlayer(node) {
      if (node.__proferPlayerBound) return;
      node.__proferPlayerBound = true;

      var viewport = node.querySelector('.video-viewport');
      if (viewport) {
        viewport.addEventListener('click', function (event) {
          if (event.detail > 1) return;
          togglePlay();
          lastClickToggleAt = Date.now();
        });
        viewport.addEventListener('dblclick', function () {
          // 双击不应改变播放态：回滚紧随其前的单击切换，再进入系统全屏
          if (Date.now() - lastClickToggleAt < 700) togglePlay();
          toggleSystemFullscreen();
        });
      }

      var playBtn = node.querySelector('#play-btn');
      if (playBtn) playBtn.addEventListener('click', togglePlay);
      var muteBtn = node.querySelector('#mute-btn');
      if (muteBtn) muteBtn.addEventListener('click', toggleMute);
      var replay = node.querySelector('#__profer-replay-modal');
      if (replay) replay.addEventListener('click', function () {
        if (!videoEl) return;
        videoEl.currentTime = 0;
        replay.style.display = 'none';
        videoEl.play().catch(function () {});
      });

      bindProgress(node);
      bindVolume(node);

      var speedPanel = node.querySelector('#speed-panel');
      if (speedPanel) {
        var options = speedPanel.querySelectorAll('.speed-option');
        for (var i = 0; i < options.length; i++) {
          options[i].addEventListener('click', function () {
            var rate = parseFloat(this.getAttribute('data-rate')) || 1;
            if (videoEl) videoEl.playbackRate = rate;
            setText(byId('speed-label'), rate.toFixed(rate % 1 === 0 ? 1 : 2) + 'X');
            for (var j = 0; j < options.length; j++) options[j].classList.toggle('active', options[j] === this);
          });
        }
      }

      var subtitleBtn = node.querySelector('#subtitle-btn');
      if (subtitleBtn) subtitleBtn.addEventListener('click', toggleSubtitle);
      var sizeSlider = node.querySelector('#sub-size-slider');
      if (sizeSlider) sizeSlider.addEventListener('input', function () {
        var box = byId('subtitle-box');
        if (box) box.style.fontSize = this.value + 'px';
        flashSubtitlePreview('字幕字号预览', true);
      });

      var settings = node.querySelectorAll('.segment-btn');
      for (var s = 0; s < settings.length; s++) {
        settings[s].addEventListener('click', function () {
          var fit = this.getAttribute('data-fit') || 'contain';
          playerEl.__proferFit = fit;
          if (videoEl) videoEl.style.objectFit = fit;
          for (var k = 0; k < settings.length; k++) settings[k].classList.toggle('active', settings[k] === this);
          wake();
        });
      }

      var bright = node.querySelector('#filter-bright');
      var contrast = node.querySelector('#filter-contrast');
      function applyFilter() {
        if (!videoEl) return;
        var b = bright ? bright.value : '100';
        var c = contrast ? contrast.value : '100';
        videoEl.style.filter = 'brightness(' + b + '%) contrast(' + c + '%)';
      }
      if (bright) bright.addEventListener('input', applyFilter);
      if (contrast) contrast.addEventListener('input', applyFilter);
      var reset = node.querySelector('#filter-reset');
      if (reset) reset.addEventListener('click', function () {
        if (bright) bright.value = 100;
        if (contrast) contrast.value = 100;
        playerEl.__proferFit = 'contain';
        if (videoEl) { videoEl.style.objectFit = 'contain'; videoEl.style.filter = 'brightness(100%) contrast(100%)'; }
        for (var k = 0; k < settings.length; k++) settings[k].classList.toggle('active', settings[k].getAttribute('data-fit') === 'contain');
        wake();
      });

      node.querySelector('#screenshot-btn').addEventListener('click', screenshot);
      node.querySelector('#pip-btn').addEventListener('click', togglePip);
      node.querySelector('#web-fullscreen-btn').addEventListener('click', toggleWebFullscreen);
      node.querySelector('#fullscreen-btn').addEventListener('click', toggleSystemFullscreen);

      if (!window.__proferNyaFsListener) {
        window.__proferNyaFsListener = true;
        document.addEventListener('fullscreenchange', syncFullscreenUI, true);
      }
      syncFullscreenUI();

      if (!window.__proferNyaDocListeners) {
        window.__proferNyaDocListeners = true;
        document.addEventListener('mousedown', onDocumentMousedownCapture, true);
      }

      var loopItem = node.querySelector('#__profer-nya-menu-loop');
      if (loopItem) loopItem.addEventListener('click', function (event) {
        event.stopPropagation();
        if (!videoEl) return;
        videoEl.loop = !videoEl.loop;
        syncLoopState();
      });

      node.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        var menu = byId('__profer-nya-context-menu');
        if (!menu) return;
        syncLoopState();
        var rect = node.getBoundingClientRect();
        var left = Math.min(event.clientX - rect.left, rect.width - 210);
        var top = Math.min(event.clientY - rect.top, rect.height - 150);
        menu.style.left = Math.max(8, left) + 'px';
        menu.style.top = Math.max(8, top) + 'px';
        menu.style.display = 'block';
        menu.dataset.open = '1';
      });
      node.addEventListener('mousemove', wake);
      wake();
    }

    /**
     * 全局 mousedown 捕获：仅当点击发生在菜单外部时才收起。
     * 菜单内点击（循环播放等）绝不触发隐藏，保证菜单常显可继续操作。
     */
    function onDocumentMousedownCapture(event) {
      var menu = byId('__profer-nya-context-menu');
      if (!menu || menu.dataset.open !== '1') return;
      var target = event.target;
      if (target && (target === menu || (menu.contains && menu.contains(target)))) return;
      hideContextMenu();
    }

    function syncLoopState() {
      var item = byId('__profer-nya-menu-loop');
      var state = byId('__profer-nya-loop-state');
      var on = !!(videoEl && videoEl.loop);
      if (item) item.classList.toggle('is-loop-on', on);
      if (state) setText(state, on ? '开' : '关');
    }

    function hideContextMenu() {
      var menu = byId('__profer-nya-context-menu');
      if (menu && menu.dataset.open === '1') { menu.style.display = 'none'; menu.dataset.open = '0'; }
    }

    function syncVideo() {
      if (!playerEl) return;
      var viewport = playerEl.querySelector('.video-viewport');
      // 优先限定在左窗主播放器宿主内查找，避免在三画面课程中误抓取 #cmcPlayer_container_2 的第二机位视频流
      var candidate =
        document.querySelector('#cmcPlayer_container video#cmc_player_video') ||
        document.querySelector('.main_resize_con video#cmc_player_video') ||
        document.querySelector('.content-left video#cmc_player_video') ||
        document.querySelector('video#cmc_player_video');
      // 当存在 PPT 且第二机位被隐藏时，静默暂停第二机位视频，防止后台双音轨或空耗解码器
      if (document.getElementById('ppt_container')) {
        var secondaryVideo = document.querySelector('#cmcPlayer_container_2 video, .stu_screen_con video');
        if (secondaryVideo && secondaryVideo !== candidate) {
          secondaryVideo.muted = true;
          if (!secondaryVideo.paused) {
            try { secondaryVideo.pause(); } catch (e) {}
          }
        }
      }
      if (!candidate || !viewport) return;
      if (candidate !== videoEl) {
        // 站点重建视频节点时，清掉仍留在视口内的旧实例，避免画面/声音双轨叠加
        if (videoEl && videoEl.parentNode === viewport) viewport.removeChild(videoEl);
        videoEl = candidate;
      }
      if (videoEl.parentNode !== viewport) {
        if (!videoOriginalParent) {
          videoOriginalParent = videoEl.parentNode;
          videoOriginalNext = videoEl.nextSibling;
        }
        viewport.appendChild(videoEl);
      }
      videoEl.style.width = '100%';
      videoEl.style.height = '100%';
      videoEl.style.pointerEvents = 'none';
      videoEl.style.objectFit = playerEl.__proferFit || 'contain';

      if (!videoEl.__proferVideoBound) {
        videoEl.__proferVideoBound = true;
        videoEl.addEventListener('loadedmetadata', function () { updateTime(); updateProgress(); });
        videoEl.addEventListener('durationchange', function () { updateTime(); updateProgress(); });
        videoEl.addEventListener('timeupdate', function () { updateTime(); updateProgress(); syncSubtitle(); });
        videoEl.addEventListener('progress', updateBuffer);
        videoEl.addEventListener('play', function () { syncPlayState(); showReplay(false); });
        videoEl.addEventListener('pause', syncPlayState);
        videoEl.addEventListener('volumechange', function () { syncPlayState(); syncVolumeUI(); });
        videoEl.addEventListener('waiting', function () { setShown(byId('__profer-buffer-spinner'), true); });
        videoEl.addEventListener('canplay', function () { setShown(byId('__profer-buffer-spinner'), false); });
        videoEl.addEventListener('playing', function () { setShown(byId('__profer-buffer-spinner'), false); });
        videoEl.addEventListener('ended', function () { showReplay(true); syncPlayState(); });
      }
      syncSubtitle();
      updateTime();
      updateProgress();
      updateBuffer();
      syncPlayState();
      syncVolumeUI();
      syncLoopState();
    }

    /** 无真实字幕帧时的 1.5 秒轻提示（开启字幕 / 字号预览），到期后回到真实同步结果 */
    function flashSubtitlePreview(text, force) {
      if (!subtitleVisible && !force) return;
      var box = byId('subtitle-box');
      if (!box) return;
      if (subPreviewTimer) { clearTimeout(subPreviewTimer); subPreviewTimer = null; }
      if (findOriginalSubtitleText()) { syncSubtitle(); return; }
      setText(box, text);
      box.style.display = 'block';
      subPreviewTimer = setTimeout(function () {
        subPreviewTimer = null;
        syncSubtitle();
      }, 1500);
    }

    function syncSubtitle() {
      var box = byId('subtitle-box');
      if (!box) return;
      if (!subtitleVisible) {
        // 字号预览可在字幕关闭时短暂展示，定时器未到期前不被 timeupdate 立即收起
        if (subPreviewTimer) return;
        if (box.style.display !== 'none') box.style.display = 'none';
        return;
      }
      var text = findOriginalSubtitleText();
      if (subPreviewTimer) {
        // 预览期间一旦出现真实字幕，立即让真实字幕接管并取消提示定时器
        if (!text) return;
        clearTimeout(subPreviewTimer);
        subPreviewTimer = null;
      }
      setText(box, text);
      var target = text ? 'block' : 'none';
      if (box.style.display !== target) box.style.display = target;
    }

    function formatTime(value) {
      if (!isFinite(value) || value < 0) value = 0;
      var total = Math.floor(value);
      var h = Math.floor(total / 3600);
      var m = Math.floor((total % 3600) / 60);
      var s = total % 60;
      var mm = (m < 10 ? '0' : '') + m;
      var ss = (s < 10 ? '0' : '') + s;
      return h > 0 ? h + ':' + mm + ':' + ss : mm + ':' + ss;
    }

    function updateTime() {
      if (!videoEl) return;
      setText(byId('time-current'), formatTime(videoEl.currentTime));
      setText(byId('time-total'), formatTime(videoEl.duration));
    }

    function updateProgress() {
      if (!videoEl) return;
      var duration = videoEl.duration || 0;
      var percent = duration > 0 ? (videoEl.currentTime / duration) * 100 : 0;
      var current = byId('progress-current');
      var thumb = byId('progress-thumb');
      if (current) current.style.width = percent + '%';
      if (thumb) thumb.style.left = percent + '%';
    }

    function updateBuffer() {
      if (!videoEl) return;
      var duration = videoEl.duration || 0;
      var buffered = 0;
      try {
        if (videoEl.buffered && videoEl.buffered.length > 0) buffered = videoEl.buffered.end(videoEl.buffered.length - 1);
      } catch (e) {}
      var percent = duration > 0 ? (buffered / duration) * 100 : 0;
      var bar = byId('progress-buffer');
      if (bar) bar.style.width = percent + '%';
    }

    function syncPlayState() {
      var btn = byId('play-btn');
      var playing = videoEl ? !videoEl.paused : false;
      if (btn && lastPlaying !== playing) {
        btn.innerHTML = playing ? SVG_PAUSE : SVG_PLAY;
        lastPlaying = playing;
      }
      var badge = byId('__profer-center-badge');
      if (badge && lastPlaying === null) badge.classList.remove('animate-pulse');
      showReplay(videoEl ? videoEl.ended : false);
    }

    function syncVolumeUI() {
      if (!videoEl) return;
      var value = videoEl.muted ? 0 : videoEl.volume;
      var fill = byId('volume-fill');
      var thumb = byId('volume-thumb');
      if (fill) fill.style.height = Math.round(value * 100) + '%';
      if (thumb) thumb.style.bottom = Math.round(value * 100) + '%';
      var btn = byId('mute-btn');
      var muted = value <= 0;
      if (btn && lastMuted !== muted) {
        btn.innerHTML = muted ? SVG_MUTED : SVG_VOLUME;
        lastMuted = muted;
      }
    }

    function showReplay(show) {
      var modal = byId('__profer-replay-modal');
      if (modal) modal.style.display = show ? 'flex' : 'none';
    }

    function wake() {
      if (!playerEl) return;
      playerEl.classList.remove('idle-cursor');
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        if (!playerEl || !videoEl) return;
        var menu = byId('__profer-nya-context-menu');
        if (videoEl.paused || (menu && menu.dataset.open === '1')) return;
        playerEl.classList.add('idle-cursor');
      }, 3000);
    }

    function togglePlay() {
      if (!videoEl) return;
      if (videoEl.paused) videoEl.play().catch(function () {});
      else videoEl.pause();
      pulseBadge();
      wake();
    }

    function pulseBadge() {
      var badge = byId('__profer-center-badge');
      if (!badge) return;
      badge.classList.add('animate-pulse');
      setTimeout(function () { badge.classList.remove('animate-pulse'); }, 500);
    }

    function seekBy(delta) {
      if (!videoEl) return;
      var duration = videoEl.duration || 0;
      videoEl.currentTime = Math.max(0, Math.min(duration, videoEl.currentTime + delta));
      updateTime();
      updateProgress();
    }

    function bindProgress(node) {
      var wrap = node.querySelector('#progress-wrap');
      if (!wrap) return;
      var tooltip = node.querySelector('#preview-tooltip');
      var previewTime = node.querySelector('#preview-time');
      var previewImg = node.querySelector('#preview-img');

      function timeFromEvent(event) {
        var rect = wrap.getBoundingClientRect();
        var ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        var duration = videoEl && videoEl.duration ? videoEl.duration : 0;
        return { ratio: ratio, time: ratio * duration };
      }

      function updatePreview(event) {
        if (!tooltip) return;
        var point = timeFromEvent(event);
        tooltip.style.display = 'flex';
        tooltip.style.left = (point.ratio * 100) + '%';
        setText(previewTime, formatTime(point.time));
        var original = document.querySelector('.progress-time img');
        var src = original ? (original.getAttribute('src') || '') : '';
        if (previewImg) {
          if (src && previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
          previewImg.style.display = src ? 'block' : 'none';
        }
      }

      wrap.addEventListener('pointerdown', function (event) {
        if (!videoEl || !videoEl.duration) return;
        seeking = true;
        videoEl.pause();
        videoEl.currentTime = timeFromEvent(event).time;
        updatePreview(event);
        try { wrap.setPointerCapture(event.pointerId); } catch (e) {}
      });
      wrap.addEventListener('pointermove', function (event) {
        updatePreview(event);
        if (seeking && videoEl) {
          videoEl.currentTime = timeFromEvent(event).time;
          updateTime();
          updateProgress();
        }
      });
      wrap.addEventListener('pointerup', function () {
        if (!seeking) return;
        seeking = false;
        if (videoEl) videoEl.play().catch(function () {});
        wake();
      });
      wrap.addEventListener('pointerleave', function () {
        if (tooltip) tooltip.style.display = 'none';
        if (!seeking) return;
      });
    }

    function bindVolume(node) {
      var track = node.querySelector('#volume-track');
      if (!track) return;
      function apply(event) {
        if (!videoEl) return;
        var rect = track.getBoundingClientRect();
        var value = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
        videoEl.volume = value;
        videoEl.muted = value === 0;
        syncVolumeUI();
        wake();
      }
      track.addEventListener('pointerdown', function (event) {
        apply(event);
        try { track.setPointerCapture(event.pointerId); } catch (e) {}
      });
      track.addEventListener('pointermove', function (event) {
        if (event.buttons) apply(event);
      });
    }

    function toggleMute() {
      if (!videoEl) return;
      videoEl.muted = !videoEl.muted;
      syncVolumeUI();
      wake();
    }

    function toggleSubtitle() {
      subtitleVisible = !subtitleVisible;
      // 联动站点原生字幕开关（.cmc-subtitlepanel .text-switch），否则站点字幕流不会启动
      var sw = document.querySelector('.cmc-subtitlepanel .text-switch') ||
               document.querySelector('#cmcPlayer_container .text-switch');
      if (sw) { try { sw.click(); } catch (e) {} }
      if (subtitleVisible) flashSubtitlePreview('字幕已开启', false);
      else {
        // 关闭字幕：取消进行中的提示并立即收起浮层
        if (subPreviewTimer) { clearTimeout(subPreviewTimer); subPreviewTimer = null; }
        syncSubtitle();
      }
      var btn = byId('subtitle-btn');
      if (btn) btn.classList.toggle('is-active', subtitleVisible);
      wake();
    }

    function toggleWebFullscreen() {
      if (!playerEl) return;
      var enabled = !playerEl.classList.contains('web-fullscreen');
      playerEl.classList.toggle('web-fullscreen', enabled);
      document.body.style.overflow = enabled ? 'hidden' : '';
      wake();
    }

    /** 依据 document.fullscreenElement 切换进入/退出全屏图标与按钮激活态 */
    function syncFullscreenUI() {
      var full = !!(document.fullscreenElement && document.fullscreenElement === playerEl);
      var enter = byId('__profer-fs-enter');
      var exit = byId('__profer-fs-exit');
      if (enter) enter.style.display = full ? 'none' : '';
      if (exit) exit.style.display = full ? '' : 'none';
      var btn = byId('fullscreen-btn');
      if (btn) btn.classList.toggle('is-active', full);
    }

    function toggleSystemFullscreen() {
      if (!playerEl) return;
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(function () {});
      } else if (playerEl.requestFullscreen) {
        playerEl.requestFullscreen().catch(function () {});
      }
      wake();
    }

    function togglePip() {
      if (!videoEl) return;
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(function () {});
      } else if (videoEl.requestPictureInPicture) {
        videoEl.requestPictureInPicture().catch(function () {});
      }
    }

    function screenshot() {
      if (!videoEl || !videoEl.videoWidth) return;
      var canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      var link = document.createElement('a');
      link.download = 'nya-player-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function onDocumentKeydown(event) {
      var code = event.code;
      // Escape 优先收起全局浮层与右键菜单：即使当前无播放器实例也必须生效
      if (code === 'Escape') {
        closeQrModal();
        closeAiPanel();
        hideContextMenu();
      }
      var target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) return;
      if (!playerEl || !videoEl) return;
      var active = document.activeElement;
      var engaged = playerEl.matches(':hover') || (active && playerEl.contains(active)) || document.fullscreenElement === playerEl;
      if (!engaged) return;
      if (code === 'Space' || code === 'KeyK') { event.preventDefault(); togglePlay(); }
      else if (code === 'ArrowLeft') { event.preventDefault(); seekBy(-5); }
      else if (code === 'ArrowRight') { event.preventDefault(); seekBy(5); }
      else if (code === 'ArrowUp') { event.preventDefault(); videoEl.volume = Math.min(1, videoEl.volume + 0.05); syncVolumeUI(); }
      else if (code === 'ArrowDown') { event.preventDefault(); videoEl.volume = Math.max(0, videoEl.volume - 0.05); syncVolumeUI(); }
      else if (code === 'KeyF') { event.preventDefault(); toggleSystemFullscreen(); }
      else if (code === 'KeyW') { event.preventDefault(); toggleWebFullscreen(); }
      else if (code === 'KeyM') { event.preventDefault(); toggleMute(); }
      else if (code === 'KeyC') { event.preventDefault(); toggleSubtitle(); }
      else if (code === 'Escape') {
        if (playerEl.classList.contains('web-fullscreen')) {
          playerEl.classList.remove('web-fullscreen');
          document.body.style.overflow = '';
        }
        hideContextMenu();
      }
    }

    function ensureKeydown() {
      if (keydownAttached) return;
      keydownAttached = true;
      document.addEventListener('keydown', onDocumentKeydown, true);
    }

    // ---------- PPT Canvas 高清重绘同步 ----------
    function findVueInstance(el) {
      var node = el;
      while (node && node !== document.body) {
        if (node.__vue__) return node.__vue__;
        if (node.__vueParentComponent) {
          var inst = node.__vueParentComponent;
          return inst.proxy || inst.ctx || inst;
        }
        node = node.parentElement;
      }
      return null;
    }

    function callInitCanvas(el) {
      var vm = findVueInstance(el);
      if (!vm) return false;
      if (typeof vm.initCanvas === 'function') {
        try { vm.initCanvas(); return true; } catch (e) {}
      }
      var methods = vm.$options && vm.$options.methods;
      if (methods && typeof methods.initCanvas === 'function') {
        try { methods.initCanvas.call(vm); return true; } catch (e) {}
      }
      return false;
    }

    function redrawPpt() {
      var ppt = document.getElementById('ppt');
      if (!ppt) return;
      var w = ppt.offsetWidth || ppt.clientWidth;
      var h = ppt.offsetHeight || ppt.clientHeight;
      if (w < 8 || h < 8) return;
      var vm = findVueInstance(ppt);
      // 手绘批注态禁止重绘：initCanvas 内部的 controlCanvas('clear') 会清空用户笔迹
      if (vm && vm.draw) return;
      var canvas = document.getElementById('ppt_canvas');
      var cw = canvas ? canvas.width : 0;
      var ch = canvas ? canvas.height : 0;
      if (Math.abs(w - cw) < 4 && Math.abs(h - ch) < 4 && Math.abs(w - pptLastW) < 8 && Math.abs(h - pptLastH) < 8) return;
      // pptList 首帧为空时不得写入尺寸缓存，等待接口返回后由巡检再次命中
      if (vm && (!vm.pptList || !vm.pptList.length) && !(vm.$parent && vm.$parent.noteImgSrc)) return;
      pptLastW = w;
      pptLastH = h;
      if (!callInitCanvas(ppt)) {
        try { window.dispatchEvent(new Event('resize')); } catch (e) {}
      }
    }

    function schedulePptRedraw() {
      if (pptRaf) return;
      var raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
      pptRaf = raf(function () { pptRaf = null; redrawPpt(); });
    }

    function ensurePptSync() {
      var ppt = document.getElementById('ppt');
      if (ppt && ppt !== pptTarget) {
        pptTarget = ppt;
        pptLastW = 0;
        pptLastH = 0;
        if (pptObserver) {
          try { pptObserver.disconnect(); } catch (e) {}
          pptObserver = null;
        }
        try {
          pptObserver = new ResizeObserver(schedulePptRedraw);
          pptObserver.observe(ppt);
        } catch (e) {
          pptObserver = null;
        }
        schedulePptRedraw();
      }
      if (!pptTimer) {
        pptTimer = setInterval(function () {
          if (document.getElementById('ppt')) schedulePptRedraw();
        }, 1000);
      }
    }

    // ---------- 学习资源下载区与底栏 ----------
    function escapeHtml(str) {
      return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function triggerDownload(blob, filename) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { URL.revokeObjectURL(a.href); } catch (e) {}
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 1000);
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(function () {});
      }
      return Promise.resolve();
    }

    function setResourceStatus(statusEl, text, isError) {
      if (!statusEl) return;
      if (!text) {
        statusEl.textContent = '';
        statusEl.classList.remove('active');
        return;
      }
      statusEl.textContent = text;
      statusEl.style.color = isError ? '#ef4444' : '#4f46e5';
      statusEl.classList.add('active');
    }

    function getCourseTitle(vm) {
      var title = '';
      if (vm) {
        title = (vm.courseName || '') + (vm.subTitle ? ' - ' + vm.subTitle : '');
      }
      if (!title) {
        var heading = document.getElementById('__profer-course-title');
        title = heading ? (heading.getAttribute('title') || heading.textContent || '').trim() : '';
      }
      if (!title || title === '加载课程中...') title = document.title || '问渠学堂课堂';
      return title.trim();
    }

    function buildLectureHtml(title, slideList) {
      var html = '<!DOCTYPE html><html><head><meta charset="utf-8">';
      html += '<title>' + escapeHtml(title) + ' (' + slideList.length + '页)</title>';
      html += '<style>';
      html += 'body { font-family: system-ui, -apple-system, sans-serif; background: #f0f2f5; margin: 0; padding: 20px; color: #333; }';
      html += '.toolbar { position: sticky; top: 0; background: #fff; padding: 12px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; z-index: 100; border-radius: 8px; margin-bottom: 20px; max-width: 960px; margin-left: auto; margin-right: auto; }';
      html += '.btn { background: #1890ff; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }';
      html += '.slide-card { background: #fff; max-width: 960px; margin: 0 auto 24px; padding: 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); page-break-inside: avoid; }';
      html += '.slide-header { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: bold; color: #555; border-bottom: 1px solid #eee; padding-bottom: 8px; }';
      html += '.slide-img { width: 100%; height: auto; display: block; border: 1px solid #eee; }';
      html += '.slide-ocr { margin-top: 10px; font-size: 13px; color: #666; white-space: pre-wrap; background: #fafafa; padding: 8px 12px; border-radius: 4px; }';
      html += '@media print { body { background: #fff; padding: 0; } .toolbar { display: none; } .slide-card { box-shadow: none; margin: 0 0 12px; padding: 0; page-break-after: always; } }';
      html += '</style></head><body>';
      html += '<div class="toolbar">';
      html += '<div><strong>' + escapeHtml(title) + '</strong>（共 ' + slideList.length + ' 页高清 PPT）</div>';
      html += '<button class="btn" onclick="window.print()">🖨️ 打印 / 另存为 PDF</button>';
      html += '</div>';
      for (var i = 0; i < slideList.length; i++) {
        var s = slideList[i];
        html += '<div class="slide-card">';
        html += '<div class="slide-header"><span>第 ' + (i + 1) + ' / ' + slideList.length + ' 页</span><span>视频时间点：' + escapeHtml(s.switchTime) + '</span></div>';
        html += '<img class="slide-img" src="' + escapeHtml(s.imgSrc) + '" />';
        if (s.text) html += '<div class="slide-ocr"><strong>页面文字：</strong>' + escapeHtml(s.text) + '</div>';
        html += '</div>';
      }
      html += '</body></html>';
      return html;
    }

    function printLectureHtml(htmlContent) {
      var iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      var doc = iframe.contentWindow && iframe.contentWindow.document;
      if (!doc) doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(function () {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
        } catch (e) {}
        setTimeout(function () {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 60000);
      }, 500);
    }

    async function exportCoursewarePpt(type) {
      var btnPptx = byId('__profer-btn-ppt-pptx');
      var btnPdf = byId('__profer-btn-ppt-pdf');
      var btnHtml = byId('__profer-btn-ppt-html');
      var statusEl = byId('__profer-ppt-status');

      if (btnPptx) btnPptx.disabled = true;
      if (btnPdf) btnPdf.disabled = true;
      if (btnHtml) btnHtml.disabled = true;

      setResourceStatus(statusEl, '🔍 正在检查与提取课件数据...');

      try {
        var allEls = document.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
          var el = allEls[i];
          if (el.__vue__) {
            if (el.__vue__.searchTimer) {
              clearInterval(el.__vue__.searchTimer);
              el.__vue__.searchTimer = null;
            }
            if ('exportLoading' in el.__vue__) {
              el.__vue__.exportLoading = false;
              el.__vue__.exportVisible = false;
            }
          }
        }

        var params = new URLSearchParams(location.search.indexOf('?') >= 0 ? location.search : (location.hash.split('?')[1] || ''));
        var courseId = params.get('course_id') || params.get('id');
        var subId = params.get('sub_id');
        var roomVm = null;

        for (var j = 0; j < allEls.length; j++) {
          var el2 = allEls[j];
          if (el2.__vue__ && 'pptList' in el2.__vue__.$data && 'sub_id' in el2.__vue__.$data) {
            roomVm = el2.__vue__;
            courseId = courseId || roomVm.course_id;
            subId = subId || roomVm.sub_id;
            break;
          }
        }

        var slides = [];
        if (roomVm && roomVm.pptList && roomVm.pptList.length > 0) {
          for (var k = 0; k < roomVm.pptList.length; k++) {
            var item = roomVm.pptList[k];
            slides.push({
              imgSrc: item.imgSrc || item.s_imgSrc,
              text: item.noteText || '',
              switchTime: item.switchTime || '00:00:00'
            });
          }
        }

        if (slides.length === 0 && courseId && subId) {
          setResourceStatus(statusEl, '🔍 正在从接口分页拉取课件数据...');
          var page = 1;
          var perPage = 50;
          while (true) {
            var url = '/pptnote/v1/schedule/search-ppt?course_id=' + encodeURIComponent(courseId) + '&sub_id=' + encodeURIComponent(subId) + '&page=' + page + '&per_page=' + perPage;
            var res = await fetch(url).then(function (r) { return r.json(); }).catch(function () { return null; });
            if (!res || res.code !== 0 || !Array.isArray(res.list) || res.list.length === 0) break;

            for (var m = 0; m < res.list.length; m++) {
              var sItem = res.list[m];
              if (sItem.created_sec >= 0 && sItem.content) {
                var parsed = typeof sItem.content === 'string' ? JSON.parse(sItem.content) : sItem.content;
                slides.push({
                  imgSrc: parsed.pptimgurl || parsed.pptthumb,
                  text: parsed.content || '',
                  switchTime: formatSec(sItem.created_sec)
                });
              }
            }
            if (slides.length >= (res.total || 0) || res.list.length < perPage) break;
            page++;
          }
        }

        if (slides.length === 0 && roomVm && roomVm.liveInfo && roomVm.liveInfo.resource_id) {
          setResourceStatus(statusEl, '🔍 正在从 AI 拆条接口拉取课件数据...');
          var aiUrl = '/spidermaterial/spider-material/web/aitask/async/getPPTData?id=' + encodeURIComponent(roomVm.liveInfo.resource_id);
          var aiRes = await fetch(aiUrl).then(function (r) { return r.json(); }).catch(function () { return null; });
          if (aiRes && aiRes.state === 200 && Array.isArray(aiRes.data)) {
            for (var n = 0; n < aiRes.data.length; n++) {
              var aItem = aiRes.data[n];
              slides.push({
                imgSrc: aItem.imgurl,
                text: aItem.describe || '',
                switchTime: formatSec(Math.floor((aItem.timestamp || 0) / 1000))
              });
            }
          }
        }

        if (slides.length === 0) {
          setResourceStatus(statusEl, '⚠️ 未找到本节课的 PPT 课件数据。', true);
          return;
        }

        var courseTitle = getCourseTitle(roomVm);
        var safeTitle = courseTitle.replace(/[\\\\/:*?\"<>|]/g, '_');

        if (type === 'html') {
          var lectureHtml = buildLectureHtml(courseTitle, slides);
          var blob = new Blob([lectureHtml], { type: 'text/html;charset=utf-8' });
          triggerDownload(blob, safeTitle + '_讲义.html');
          setResourceStatus(statusEl, '✅ 已成功导出 ' + slides.length + ' 页 HTML 离线讲义！');
        } else if (type === 'pdf') {
          setResourceStatus(statusEl, '🖨️ 正在调起系统打印（可选择另存为 PDF）...');
          var pdfHtml = buildLectureHtml(courseTitle, slides);
          printLectureHtml(pdfHtml);
          setResourceStatus(statusEl, '🖨️ 系统打印已就绪（共 ' + slides.length + ' 页）');
        } else if (type === 'pptx') {
          if (!window.PptxGenJS) {
            setResourceStatus(statusEl, '正在加载 PPTX 合成引擎...');
            await new Promise(function (resolve, reject) {
              var s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
              s.onload = resolve;
              s.onerror = reject;
              document.head.appendChild(s);
            });
          }

          var pptx = new window.PptxGenJS();
          pptx.layout = 'LAYOUT_16x9';
          pptx.title = courseTitle;

          for (var p = 0; p < slides.length; p++) {
            setResourceStatus(statusEl, '正在合成第 ' + (p + 1) + ' / ' + slides.length + ' 页...');
            var sSlide = slides[p];
            var slideObj = pptx.addSlide();

            var base64 = await new Promise(function (resolve) {
              var img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = function () {
                try {
                  var canvas = document.createElement('canvas');
                  canvas.width = img.naturalWidth || 1280;
                  canvas.height = img.naturalHeight || 720;
                  var ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  resolve(canvas.toDataURL('image/jpeg', 0.92));
                } catch (e) {
                  resolve(null);
                }
              };
              img.onerror = function () { resolve(null); };
              img.src = sSlide.imgSrc;
            });

            if (base64) {
              slideObj.addImage({ data: base64, x: 0, y: 0, w: '100%', h: '100%' });
            } else {
              slideObj.addImage({ path: sSlide.imgSrc, x: 0, y: 0, w: '100%', h: '100%' });
            }

            if (sSlide.text || sSlide.switchTime) {
              slideObj.addNotes('【视频时间点：' + sSlide.switchTime + '】\\n' + (sSlide.text || ''));
            }
          }

          setResourceStatus(statusEl, '正在打包生成 .pptx 文件...');
          await pptx.writeFile({ fileName: safeTitle + '.pptx' });
          setResourceStatus(statusEl, '🎉 已成功导出 ' + slides.length + ' 页 .pptx 幻灯片！');
        }
      } catch (err) {
        setResourceStatus(statusEl, '❌ 课件导出失败: ' + (err && err.message ? err.message : String(err)), true);
      } finally {
        if (btnPptx) btnPptx.disabled = false;
        if (btnPdf) btnPdf.disabled = false;
        if (btnHtml) btnHtml.disabled = false;
      }
    }

    async function exportSummaryToMd() {
      var btn = byId('__profer-btn-summary-md');
      var statusEl = byId('__profer-summary-status');
      if (btn) btn.disabled = true;
      setResourceStatus(statusEl, '正在读取课程智能摘要...');

      try {
        var roomVm = null;
        var abstractVm = null;
        var allEls = document.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
          var el = allEls[i];
          var vm = el.__vue__;
          if (!vm) continue;
          if ('pptList' in vm.$data && 'liveInfo' in vm.$data) roomVm = vm;
          if ('contentSummary' in vm.$data && 'keyReview' in vm.$data) abstractVm = vm;
        }

        if (abstractVm && abstractVm.searchTimer) {
          clearInterval(abstractVm.searchTimer);
          abstractVm.searchTimer = null;
          abstractVm.loading = false;
        }

        var data = {
          contentSummary: abstractVm ? (abstractVm.contentSummary || '') : '',
          keyWords: abstractVm ? (abstractVm.keyWords || []) : [],
          paragraph: abstractVm ? (abstractVm.paragraph || []) : [],
          keyReview: abstractVm ? (abstractVm.keyReview || []) : []
        };

        if (!data.contentSummary && !data.keyWords.length && !data.paragraph.length && !data.keyReview.length) {
          var params = new URLSearchParams(location.search.indexOf('?') >= 0 ? location.search : (location.hash.split('?')[1] || ''));
          var subId = (roomVm && roomVm.liveInfo && roomVm.liveInfo.sub_id) || (roomVm && roomVm.sub_id) || params.get('sub_id');
          var courseId = (roomVm && roomVm.course_id) || params.get('course_id') || params.get('id');
          var resourceGuid = roomVm && roomVm.liveInfo && roomVm.liveInfo.resource_guid;

          if (!resourceGuid && courseId && subId) {
            var subRes = await fetch('/courseapi/v3/portal-home-setting/get-sub-info?course_id=' + encodeURIComponent(courseId) + '&sub_id=' + encodeURIComponent(subId)).then(function (r) { return r.json(); }).catch(function () { return null; });
            resourceGuid = subRes && subRes.data && subRes.data.resource_guid;
          }

          if (subId && resourceGuid) {
            var res = await fetch('/courseapi/v2/intelligent-summary/detail?sub_id=' + encodeURIComponent(subId) + '&resource_guid=' + encodeURIComponent(resourceGuid)).then(function (r) { return r.json(); }).catch(function () { return null; });
            var items = (res && res.result && res.result.data) || [];
            for (var j = 0; j < items.length; j++) {
              var item = items[j];
              if (item.type === 'Summarization') data.contentSummary = item.content || '';
              if (item.type === 'Keywords') data.keyWords = item.content || [];
              if (item.type === 'AutoChapters') {
                var chapters = item.content || [];
                data.paragraph = [];
                for (var c = 0; c < chapters.length; c++) {
                  var p = chapters[c];
                  data.paragraph.push({
                    Headline: p.Headline || '',
                    Summary: p.Summary || '',
                    formatStart: formatSec((p.Start || 0) / 1000)
                  });
                }
              }
              if (item.type === 'Q&A') {
                var qas = item.content || [];
                data.keyReview = [];
                for (var q = 0; q < qas.length; q++) {
                  var qa = qas[q];
                  data.keyReview.push({
                    Question: qa.Question || '',
                    Answer: qa.Answer || '',
                    formatStart: qa.start ? formatSec(qa.start / 1000) : '00:00:00'
                  });
                }
              }
            }
          }
        }

        var courseTitle = getCourseTitle(roomVm);
        var safeTitle = courseTitle.replace(/[\\\\/:*?\"<>|]/g, '_');

        var B = String.fromCharCode(96);
        var mdLines = [];
        mdLines.push('# ' + courseTitle);
        mdLines.push('');
        mdLines.push('## 一、内容摘要');
        mdLines.push('');
        mdLines.push(data.contentSummary ? '> ' + data.contentSummary : '_暂无内容摘要_');
        mdLines.push('');
        mdLines.push('## 二、内容关键字');
        mdLines.push('');
        if (data.keyWords && data.keyWords.length) {
          var kwList = [];
          for (var k = 0; k < data.keyWords.length; k++) kwList.push(B + data.keyWords[k] + B);
          mdLines.push(kwList.join(' · '));
        } else {
          mdLines.push('_暂无关键字_');
        }
        mdLines.push('');
        mdLines.push('## 三、段落总结');
        mdLines.push('');
        if (data.paragraph && data.paragraph.length) {
          for (var pIdx = 0; pIdx < data.paragraph.length; pIdx++) {
            var para = data.paragraph[pIdx];
            mdLines.push('### ' + (pIdx + 1) + '. ' + B + '[' + para.formatStart + ']' + B + ' ' + (para.Headline || ''));
            mdLines.push('');
            mdLines.push((para.Summary || ''));
            mdLines.push('');
          }
        } else {
          mdLines.push('_暂无段落总结_');
          mdLines.push('');
        }
        mdLines.push('## 四、重点回顾');
        mdLines.push('');
        if (data.keyReview && data.keyReview.length) {
          for (var rIdx = 0; rIdx < data.keyReview.length; rIdx++) {
            var qr = data.keyReview[rIdx];
            mdLines.push('### Q' + (rIdx + 1) + '. ' + B + '[' + qr.formatStart + ']' + B + ' ' + (qr.Question || ''));
            mdLines.push('');
            mdLines.push('- **答**：' + (qr.Answer || ''));
            mdLines.push('');
          }
        } else {
          mdLines.push('_暂无重点回顾_');
        }

        var md = mdLines.join('\\n');
        var blob = new Blob(['\ufeff', md], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(blob, safeTitle + '_智能摘要.md');
        copyText(md);
        setResourceStatus(statusEl, '✅ 智能摘要已导出 (.md) 并复制到剪贴板！');
      } catch (err) {
        setResourceStatus(statusEl, '❌ 智能摘要导出失败: ' + (err && err.message ? err.message : String(err)), true);
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    async function exportTranscriptToMd() {
      var btn = byId('__profer-btn-transcript-md');
      var statusEl = byId('__profer-transcript-status');
      if (btn) btn.disabled = true;
      setResourceStatus(statusEl, '正在读取课堂视频语音转录...');

      try {
        var roomVm = null;
        var abstractVm = null;
        var allEls = document.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
          var el = allEls[i];
          var vm = el.__vue__;
          if (!vm) continue;
          if ('originTransContent' in vm.$data && 'sub_id' in vm.$data) roomVm = vm;
          if ('contentSummary' in vm.$data && '_asr' in vm.$data) abstractVm = vm;
        }

        var params = new URLSearchParams(location.search.indexOf('?') >= 0 ? location.search : (location.hash.split('?')[1] || ''));
        var subId = (roomVm && roomVm.sub_id) || params.get('sub_id');

        var list = [];
        if (roomVm && roomVm.originTransContent && roomVm.originTransContent.length > 0) {
          list = roomVm.originTransContent;
        }

        if (list.length === 0 && subId) {
          setResourceStatus(statusEl, '🔍 正在请求语音识别接口...');
          var res = await fetch('/courseapi/v3/web-socket/search-trans-result?sub_id=' + encodeURIComponent(subId) + '&format=json').then(function (r) { return r.json(); }).catch(function () { return null; });
          var first = res && res.list && res.list[0];
          if (res && res.code === 0 && first && first.all_content && first.all_content.length) {
            var startAt = Number((roomVm && roomVm.liveInfo && roomVm.liveInfo.start_at) || 0);
            var delay = Number((window.CONFIG && window.CONFIG.VIDEO_DELAY) || 0);

            if (first.trans_type === 'ai') {
              for (var tIdx = 0; tIdx < first.all_content.length; tIdx++) {
                var t = first.all_content[tIdx];
                if (!t.time) continue;
                var sec = startAt ? (new Date(t.time.trim()).getTime() / 1000 - startAt + delay) : 0;
                list.push({
                  markTime: startAt ? formatSec(sec) : t.time.trim(),
                  zhtext: t.zhtext || '',
                  entext: t.entext || ''
                });
              }
            } else {
              for (var oIdx = 0; oIdx < first.all_content.length; oIdx++) {
                var ot = first.all_content[oIdx];
                if (!ot.Text && !ot.TransText) continue;
                list.push({
                  markTime: formatSec(ot.BeginSec),
                  zhtext: ot.Text || '',
                  entext: ot.TransText || ''
                });
              }
            }
          }
        }

        if (list.length === 0 && abstractVm && abstractVm._asr && abstractVm._asr.length > 0) {
          for (var aIdx = 0; aIdx < abstractVm._asr.length; aIdx++) {
            var a = abstractVm._asr[aIdx];
            list.push({
              markTime: a.formatStart || formatSec(a.start),
              zhtext: a.statement || '',
              entext: ''
            });
          }
        }

        if (list.length === 0) {
          setResourceStatus(statusEl, '⚠️ 当前课节未查询到语音识别数据。', true);
          return;
        }

        var courseTitle = getCourseTitle(roomVm);
        var safeTitle = courseTitle.replace(/[\\\\/:*?\"<>|]/g, '_');

        var stripHtml = function (str) {
          return (str || '').replace(/<[^>]+>/g, '').trim();
        };

        var mdLines = [];
        mdLines.push('# ' + courseTitle + ' - 语音识别（中英双语全文）');
        mdLines.push('');
        mdLines.push('> 共计 **' + list.length + '** 条语音转写记录');
        mdLines.push('');
        mdLines.push('---');
        mdLines.push('');

        var B = String.fromCharCode(96);
        for (var idx = 0; idx < list.length; idx++) {
          var item = list[idx];
          var zh = stripHtml(item.zhtext);
          var en = stripHtml(item.entext);
          var time = item.markTime || '00:00:00';

          mdLines.push('### ' + B + '[' + time + ']' + B + ' #' + (idx + 1));
          if (zh) mdLines.push('- **中文**：' + zh);
          if (en) mdLines.push('- **English**：' + en);
          mdLines.push('');
        }

        var md = mdLines.join('\\n');
        var blob = new Blob(['\ufeff', md], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(blob, safeTitle + '_语音识别中英双语.md');
        copyText(md);
        setResourceStatus(statusEl, '✅ 共 ' + list.length + ' 条双语语音记录已导出 (.md) 并复制到剪贴板！');
      } catch (err) {
        setResourceStatus(statusEl, '❌ 语音识别记录导出失败: ' + (err && err.message ? err.message : String(err)), true);
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function upgradeResourcePanel() {
      var contentInfo = document.querySelector('.living-page-content .content-info');
      if (!contentInfo) return false;
      if (!document.getElementById(RESOURCE_PANEL_ID)) {
        var wrap = document.createElement('div');
        wrap.innerHTML = RESOURCE_PANEL_HTML.trim();
        var node = wrap.firstElementChild;
        if (!node) return false;
        contentInfo.appendChild(node);
        bindResourcePanel(node);
      }
      return true;
    }

    function bindResourcePanel(node) {
      if (node.__proferResourcePanelBound) return;
      node.__proferResourcePanelBound = true;

      var btnPptPptx = node.querySelector('#__profer-btn-ppt-pptx');
      if (btnPptPptx) btnPptPptx.addEventListener('click', function () { exportCoursewarePpt('pptx'); });
      var btnPptPdf = node.querySelector('#__profer-btn-ppt-pdf');
      if (btnPptPdf) btnPptPdf.addEventListener('click', function () { exportCoursewarePpt('pdf'); });
      var btnPptHtml = node.querySelector('#__profer-btn-ppt-html');
      if (btnPptHtml) btnPptHtml.addEventListener('click', function () { exportCoursewarePpt('html'); });

      var btnSummaryMd = node.querySelector('#__profer-btn-summary-md');
      if (btnSummaryMd) btnSummaryMd.addEventListener('click', function () { exportSummaryToMd(); });

      var btnTranscriptMd = node.querySelector('#__profer-btn-transcript-md');
      if (btnTranscriptMd) btnTranscriptMd.addEventListener('click', function () { exportTranscriptToMd(); });
    }

    function upgradeFooter() {
      var livingPage = document.querySelector('.living-page-content') || document.querySelector('.living-page-wrapper');
      if (!livingPage) return false;
      if (!document.getElementById(FOOTER_ID)) {
        var wrap = document.createElement('div');
        wrap.innerHTML = FOOTER_HTML.trim();
        var node = wrap.firstElementChild;
        if (!node) return false;
        livingPage.appendChild(node);
      }
      return true;
    }

    function destroy() {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (qrPollTimer) { clearInterval(qrPollTimer); qrPollTimer = null; }
      if (headerPollTimer) { clearInterval(headerPollTimer); headerPollTimer = null; }
      if (subPreviewTimer) { clearTimeout(subPreviewTimer); subPreviewTimer = null; }
      if (pptObserver) {
        try { pptObserver.disconnect(); } catch (e) {}
        pptObserver = null;
      }
      if (pptTimer) { clearInterval(pptTimer); pptTimer = null; }
      if (pptRaf) {
        try { (window.cancelAnimationFrame || clearTimeout)(pptRaf); } catch (e) {}
        pptRaf = null;
      }
      pptTarget = null;
      pptLastW = 0;
      pptLastH = 0;
      if (keydownAttached) {
        document.removeEventListener('keydown', onDocumentKeydown, true);
        keydownAttached = false;
      }
      if (videoEl && videoOriginalParent && videoOriginalParent.isConnected) {
        try {
          videoOriginalParent.insertBefore(videoEl, videoOriginalNext && videoOriginalNext.parentNode === videoOriginalParent ? videoOriginalNext : null);
        } catch (e) {}
      }
      videoEl = null;
      playerEl = null;
      videoOriginalParent = null;
      videoOriginalNext = null;
      lastPlaying = null;
      lastMuted = null;
      subtitleVisible = false;
      var playerNode = byId(PLAYER_ID);
      if (playerNode && playerNode.parentNode) playerNode.parentNode.removeChild(playerNode);
      var headerNode = byId(HEADER_ID);
      if (headerNode && headerNode.parentNode) headerNode.parentNode.removeChild(headerNode);
      var panelNode = byId(RESOURCE_PANEL_ID);
      if (panelNode && panelNode.parentNode) panelNode.parentNode.removeChild(panelNode);
      var footerNode = byId(FOOTER_ID);
      if (footerNode && footerNode.parentNode) footerNode.parentNode.removeChild(footerNode);
      var qrModalNode = byId(QR_MODAL_ID);
      if (qrModalNode && qrModalNode.parentNode) qrModalNode.parentNode.removeChild(qrModalNode);
      var aiDockNode = byId(AI_DOCK_ID);
      if (aiDockNode && aiDockNode.parentNode) aiDockNode.parentNode.removeChild(aiDockNode);
      var aiPanelNode = byId(AI_PANEL_ID);
      if (aiPanelNode && aiPanelNode.parentNode) aiPanelNode.parentNode.removeChild(aiPanelNode);
      var host = document.querySelector('div.header-info');
      if (host) host.classList.remove('profer-wqxt-header-upgraded');
      var playerHost = document.getElementById('cmcPlayer_container') || document.querySelector('.main_resize_con');
      if (playerHost) {
        playerHost.classList.remove('profer-nya-upgraded');
        playerHost.style.minHeight = '';
        playerHost.style.minWidth = '';
      }
      removeStyle();
    }

    function sync() {
      if (!isLivingRoom()) { destroy(); return; }
      ensureStyle();
      upgradeHeader();
      ensureQrModal();
      ensureAiAssistant();
      syncHeader();
      upgradePlayer();
      ensurePptSync();
      upgradeResourcePanel();
      upgradeFooter();
      ensureKeydown();
    }

    window.__proferWqxtUpgrader = { sync: sync, destroy: destroy };
    sync();
  } catch (e) {}
})();`
}
