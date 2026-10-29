/**
 * AI 问渠学堂课堂教学页升级器单元测试
 *
 * 覆盖：宿主 ID 常量、模板 CSS 关键声明与作用域隔离、Nya Player 硬性约束
 * （字幕常驻 / 滤镜与倍速对齐 / 快捷键补齐 / 去弹幕 / 即时二维码同步）。
 */

import { describe, expect, test } from 'bun:test'
import {
  WQXT_AI_DOCK_ID,
  WQXT_AI_PANEL_ID,
  WQXT_EDU_HEADER_ID,
  WQXT_FOOTER_ID,
  WQXT_NYA_PLAYER_ID,
  WQXT_QR_MODAL_ID,
  WQXT_RESOURCE_PANEL_ID,
  WQXT_UPGRADE_CSS,
  WQXT_UPGRADE_STYLE_ID,
  buildWqxtUpgradeRuntimeScript,
} from './wqxt-livingroom-upgrader'

describe('升级器常量', () => {
  test('宿主与样式节点 ID 符合约定', () => {
    expect(WQXT_EDU_HEADER_ID).toBe('__profer-wqxt-edu-header')
    expect(WQXT_NYA_PLAYER_ID).toBe('__profer-nya-player')
    expect(WQXT_UPGRADE_STYLE_ID).toBe('__profer-wqxt-upgrade-css')
    expect(WQXT_RESOURCE_PANEL_ID).toBe('__profer-wqxt-resource-panel')
    expect(WQXT_FOOTER_ID).toBe('__profer-wqxt-footer')
  })

  test('新增全局浮层 ID 符合约定', () => {
    expect(WQXT_QR_MODAL_ID).toBe('__profer-qr-modal')
    expect(WQXT_AI_DOCK_ID).toBe('__profer-ai-dock-btn')
    expect(WQXT_AI_PANEL_ID).toBe('__profer-ai-panel')
  })
})

describe('WQXT_UPGRADE_CSS', () => {
  test('顶栏沿用模板视觉令牌（浅色毛玻璃卡片，不是深色渐变）', () => {
    expect(WQXT_UPGRADE_CSS).toContain('--bg-card: rgba(255, 255, 255, 0.95)')
    expect(WQXT_UPGRADE_CSS).toContain('--primary: #4F46E5')
    expect(WQXT_UPGRADE_CSS).toContain(
      '--brand-gradient: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
    )
    expect(WQXT_UPGRADE_CSS).toContain('.meta-chip')
    expect(WQXT_UPGRADE_CSS).toContain('#__profer-qr-modal')
    expect(WQXT_UPGRADE_CSS).not.toContain('.qr-card-popover')
    expect(WQXT_UPGRADE_CSS).toContain('backdrop-filter: blur(16px)')
  })

  test('宿主防塌陷与旧弹幕容器隐藏规则齐全', () => {
    expect(WQXT_UPGRADE_CSS).toContain('min-height: 480px !important')
    expect(WQXT_UPGRADE_CSS).toContain('aspect-ratio: 16 / 9')
    expect(WQXT_UPGRADE_CSS).toContain(
      '.main_resize_con > :not(#cmcPlayer_container):not(#__profer-nya-player)',
    )
    expect(WQXT_UPGRADE_CSS).toContain('#cmcPlayer_container.profer-nya-upgraded > :not(#__profer-nya-player)')
  })

  test('无未限定宿主的全局通配规则（允许 livingroom 页面独占的 .living-page-* / .content-info / #contentRight）', () => {
    expect(WQXT_UPGRADE_CSS).not.toMatch(/(^|\n)\s*\*\s*\{/)
    expect(WQXT_UPGRADE_CSS).not.toMatch(/(^|\n)\s*body\s*\{/)
    expect(WQXT_UPGRADE_CSS).not.toContain('display: flex;\n  min-height: 100vh')
  })
})

describe('课堂内页全宽与双窗布局', () => {
  test('解除原站锁宽并放大顶栏为三段式全宽 Grid', () => {
    expect(WQXT_UPGRADE_CSS).toContain('.living-page-content')
    expect(WQXT_UPGRADE_CSS).toContain('grid-template-columns: auto minmax(0, 1fr) auto')
    expect(WQXT_UPGRADE_CSS).toContain('min-height: 76px')
    expect(WQXT_UPGRADE_CSS).toContain('justify-self: center')
    expect(WQXT_UPGRADE_CSS).toContain('justify-self: end')
  })

  test('品牌区与课程信息区字号放大到 20px / 15px / 48px 徽章', () => {
    expect(WQXT_UPGRADE_CSS).toContain('font-size: 20px')
    expect(WQXT_UPGRADE_CSS).toContain('font-size: 15px')
    expect(WQXT_UPGRADE_CSS).toContain('width: 48px')
    expect(WQXT_UPGRADE_CSS).toContain('width: 17px')
  })

  test('主内容为双列等宽 Grid，并拆分 #contentRight', () => {
    expect(WQXT_UPGRADE_CSS).toContain(
      'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important',
    )
    expect(WQXT_UPGRADE_CSS).toContain('display: contents !important')
    expect(WQXT_UPGRADE_CSS).toContain(
      '.living-page-content .content-info:not(:has(#ppt_container)):not(:has(.stu_screen_con)) > .content-left',
    )
  })

  test('左窗工具栏不得使用 Grid 定位，抽屉标签抵消 -30px 悬挂', () => {
    expect(WQXT_UPGRADE_CSS).toContain('.living-page-content .content-left .tool-wrapper')
    expect(WQXT_UPGRADE_CSS).toContain('flex: 0 0 58px !important')
    expect(WQXT_UPGRADE_CSS).toContain('margin-left: 0 !important')
    expect(WQXT_UPGRADE_CSS).not.toContain('.content-info > .tool-wrapper')
    expect(WQXT_UPGRADE_CSS).not.toContain('.content-info > .sideComponentWrap')
  })

  test('左窗工具栏与笔记区使用原站真实类名', () => {
    expect(WQXT_UPGRADE_CSS).toContain('.danmu-send .el-input')
    expect(WQXT_UPGRADE_CSS).toContain('.danmu-send .btn')
    expect(WQXT_UPGRADE_CSS).toContain('.btn_studyNavigate1')
    expect(WQXT_UPGRADE_CSS).toContain('.wrap_tit')
    expect(WQXT_UPGRADE_CSS).toContain('.btn_wrap')
    expect(WQXT_UPGRADE_CSS).not.toContain('.tool_wrap .title')
  })

  test('PPT 右窗严格限定且保护批注弹窗态，#ppt_canvas 脱离文档流防 ResizeObserver 死循环', () => {
    expect(WQXT_UPGRADE_CSS).toContain('#ppt_container')
    expect(WQXT_UPGRADE_CSS).toContain('grid-column: 2 / 3 !important')
    expect(WQXT_UPGRADE_CSS).toContain('height: 58px !important')
    expect(WQXT_UPGRADE_CSS).toContain('notePPT_edit_container')
    expect(WQXT_UPGRADE_CSS).toContain('#ppt_canvas')
    expect(WQXT_UPGRADE_CSS).toContain('align-items: start !important')
    expect(WQXT_UPGRADE_CSS).toContain('flex: 0 0 auto !important')
    expect(WQXT_UPGRADE_CSS).toContain(
      '.living-page-content #contentRight:has(#ppt_container) > .stu_screen_con',
    )
    expect(WQXT_UPGRADE_CSS).not.toContain('.living-page-wrapper .ppt_wrap')
    expect(WQXT_UPGRADE_CSS).not.toContain('.living-page-content #ppt {\n  width: 100% !important;\n  height: 100% !important;')
  })

  test('下方笔记与学习资源下载区为 50%:50% 左右对称布局，底栏通栏居中', () => {
    // 右列：笔记 / 互动 / 学习日志
    expect(WQXT_UPGRADE_CSS).toContain('#contentRight > .portalroom-tab-switch')
    expect(WQXT_UPGRADE_CSS).toContain('grid-column: 2 / 3 !important')
    expect(WQXT_UPGRADE_CSS).toContain('#contentRight > .tool_wrap')
    expect(WQXT_UPGRADE_CSS).toContain('#contentRight > .chart')
    expect(WQXT_UPGRADE_CSS).toContain('#contentRight > .editor_wrap')
    expect(WQXT_UPGRADE_CSS).toContain('margin-bottom: -16px !important')
    expect(WQXT_UPGRADE_CSS).toContain('width: 200px !important')

    // 左列：学习资源下载区
    expect(WQXT_UPGRADE_CSS).toContain('#__profer-wqxt-resource-panel')
    expect(WQXT_UPGRADE_CSS).toContain('grid-column: 1 / 2 !important')
    expect(WQXT_UPGRADE_CSS).toContain('grid-row: 2 / 4 !important')

    // 底部：CDUT Studio 官方底栏
    expect(WQXT_UPGRADE_CSS).toContain('#__profer-wqxt-footer')
    expect(WQXT_UPGRADE_CSS).toContain('min-height: 60px !important')
    expect(WQXT_UPGRADE_CSS).toContain('.footer-brand-title')
  })

  test('标记跳过窗体脱离 Grid 流并顶层居中，通配选择器精准排除内部子节点', () => {
    // 不再作为第 3 行网格项挤压布局
    expect(WQXT_UPGRADE_CSS).not.toContain(
      '#contentRight > .editor_wrap,\n.living-page-content #contentRight > .markSkipInfo_lay',
    )
    // 顶层固定居中 + 最高层级
    expect(WQXT_UPGRADE_CSS).toContain('.living-page-content .markSkipInfo_lay')
    expect(WQXT_UPGRADE_CSS).toContain('z-index: 99999 !important')
    expect(WQXT_UPGRADE_CSS).toContain('transform: translate(-50%, -50%) !important')
    expect(WQXT_UPGRADE_CSS).toContain('max-height: 85vh !important')
    // 通配选择器仅命中顶层窗体，严禁把标题/按钮等子节点逐个居中
    expect(WQXT_UPGRADE_CSS).toContain(
      'div[class*="markSkip"]:not([class*="markSkip"] *):not(.markSkipInfo_lay *)',
    )
    expect(WQXT_UPGRADE_CSS).toContain(
      'div[class*="mark_skip"]:not([class*="mark_skip"] *):not(.markSkipInfo_lay *)',
    )
    // 顶层壳体不吞点击，仅真实控件恢复交互
    expect(WQXT_UPGRADE_CSS).toContain('pointer-events: none !important')
    expect(WQXT_UPGRADE_CSS).toContain('pointer-events: auto !important')
  })

  test('AI 留白窗体：右下角大尺寸毛玻璃卡片与 Dock 胶囊', () => {
    expect(WQXT_UPGRADE_CSS).toContain('#__profer-ai-dock-btn')
    expect(WQXT_UPGRADE_CSS).toContain('#__profer-ai-panel')
    expect(WQXT_UPGRADE_CSS).toContain('width: 560px !important')
    expect(WQXT_UPGRADE_CSS).toContain('height: 75vh !important')
    expect(WQXT_UPGRADE_CSS).toContain('backdrop-filter: blur(20px)')
    expect(WQXT_UPGRADE_CSS).toContain('bottom: 24px !important')
    expect(WQXT_UPGRADE_CSS).toContain('@media (prefers-color-scheme: dark)')
  })
})

describe('buildWqxtUpgradeRuntimeScript', () => {
  const script = buildWqxtUpgradeRuntimeScript()

  test('挂载全局升级器入口并主动同步一次', () => {
    expect(script).toContain('__proferWqxtUpgrader')
    expect(script).toContain('sync: sync')
    expect(script).toContain('destroy: destroy')
  })

  test('顶栏品牌文案与官方图标内联数据', () => {
    expect(script).toContain('CDUT Studio')
    expect(script).toContain('AI 问渠学堂')
    expect(script).toContain('Powered by 雫窝中央实验室 · 2026')
    expect(script).toContain('data:image/png;base64,')
  })

  test('字幕常驻：无假演示文案、字幕按钮与字号滑块（14–36px）', () => {
    expect(script).not.toContain('实时字幕演示')
    expect(script).toContain('subtitle-btn')
    expect(script).toContain('#sub-size-slider')
    expect(script).toContain('min=\\"14\\" max=\\"36\\" value=\\"22\\"')
    // 无原生字幕源时也必须保留字幕控件，不得隐藏字幕按钮
    expect(script).toContain('subtitle-trigger')
    expect(script).not.toContain("setShown(subtitle")
  })

  test('真实字幕提取与原生开关联动（排除右键菜单/控制栏）', () => {
    expect(script).toContain('text-switch')
    expect(script).toContain('textTracks')
    expect(script).toContain('activeCues')
    expect(script).toContain('cmc-rightkey')
    expect(script).toContain('main_resize_con')
    expect(script).toContain('字幕已开启')
    expect(script).toContain('字幕字号预览')
  })

  test('真全屏：状态图标切换与双击手势', () => {
    expect(script).toContain('fullscreenchange')
    expect(script).toContain('__profer-fs-exit')
    expect(script).toContain('syncFullscreenUI')
    expect(script).toContain('lastClickToggleAt')
    expect(script).not.toContain('clickTimer')
  })

  test('滤镜滑块范围 50–150，直接拼接 brightness/contrast 百分比', () => {
    expect(script).toContain('#filter-bright')
    expect(script).toContain('#filter-contrast')
    expect(script).toContain('min=\\"50\\" max=\\"150\\" value=\\"100\\"')
    expect(script).toContain("'brightness(' + b + '%) contrast(' + c + '%)'")
    expect(script).toContain('#filter-reset')
  })

  test('倍速选项与原模板顺序一致（3.0X → 0.75X）', () => {
    const labels = ['3.0X', '2.0X', '1.5X', '1.25X', '0.75X']
    for (const label of labels) expect(script).toContain(label)
    expect(script.indexOf('3.0X')).toBeLessThan(script.indexOf('2.0X'))
    expect(script.indexOf('2.0X')).toBeLessThan(script.indexOf('1.5X'))
    expect(script.indexOf('1.5X')).toBeLessThan(script.indexOf('1.25X'))
    expect(script.indexOf('1.25X')).toBeLessThan(script.indexOf('0.75X'))
  })

  test('快捷键补齐（无 KeyD）', () => {
    for (const code of ['Space', 'KeyK', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyF', 'KeyW', 'KeyM', 'KeyC']) {
      expect(script).toContain(`'${code}'`)
    }
  })

  test('控制能力齐全：截屏 / 画中画 / 网页全屏 / 系统全屏 / 循环播放', () => {
    expect(script).toContain('requestPictureInPicture')
    expect(script).toContain('requestFullscreen')
    expect(script).toContain('web-fullscreen')
    expect(script).toContain('toDataURL')
    expect(script).toContain('videoEl.loop')
    expect(script).toContain('循环播放')
    expect(script).toContain('Nya Player')
  })

  test('纳管原视频节点（优先限定主播放器宿主，隔离第二机位 #cmcPlayer_container_2）', () => {
    expect(script).toContain('#cmcPlayer_container video#cmc_player_video')
    expect(script).toContain('#cmcPlayer_container_2 video')
    expect(script).toContain('video#cmc_player_video')
    expect(script).toContain('pointerEvents')
  })

  test('扫码观看改为全局模态层：点击展开、蒙层/关闭/Escape 收起，二维码即时同步', () => {
    expect(script).toContain('qrCode_img')
    expect(script).toContain('__profer-qr-img')
    expect(script).toContain('__profer-qr-modal')
    expect(script).toContain('qr-modal-backdrop')
    expect(script).toContain('__profer-qr-close')
    expect(script).toContain('openQrModal')
    expect(script).toContain('closeQrModal')
    expect(script).toContain('ensureQrModal')
    expect(script).toContain('syncQr')
  })

  test('右键菜单：菜单内点击绝不收起，循环播放常显可切换并高亮状态', () => {
    expect(script).toContain('menu.contains(target)')
    expect(script).toContain('onDocumentMousedownCapture')
    expect(script).toContain('syncLoopState')
    expect(script).toContain('is-loop-on')
    expect(script).toContain("videoEl.loop = !videoEl.loop")
  })

  test('收藏与点赞：多级选择器链、完整鼠标事件序列与 1.5 秒短轮询', () => {
    for (const selector of [
      '.collect_span.opr_btn',
      '.opr_btn.collect',
      '[class*="collect_span"]',
      '[class*="btn_collect"]',
      '.good_span.opr_btn',
      '.opr_btn.good',
      '[class*="good_span"]',
      '[class*="btn_good"]',
    ]) {
      expect(script).toContain(selector)
    }
    expect(script).toContain('findOriginal')
    expect(script).toContain("document.querySelector(selectors[i])")
    expect(script).toContain("['mousedown', 'mouseup', 'click']")
    expect(script).toContain('headerPollTimer')
    expect(script).toContain('elapsed >= 1500')
    expect(script).toContain('}, 200)')
  })

  test('AI 助手 Dock 与留白窗体：展开/收起交互与指定文案', () => {
    expect(script).toContain('__profer-ai-dock-btn')
    expect(script).toContain('__profer-ai-panel')
    expect(script).toContain('AI 问渠助手')
    expect(script).toContain('对齐测试中')
    expect(script).toContain('雫窝中央实验室 · 大模型对齐测试中')
    expect(script).toContain('雫窝正在对大模型接入进行安全对齐和实验室测试，当前版本暂不开放捏~')
    expect(script).toContain('openAiPanel')
    expect(script).toContain('closeAiPanel')
    expect(script).toContain('is-active')
    expect(script).toContain('__profer-ai-min')
    expect(script).toContain('__profer-ai-close')
  })

  test('新播放器不得包含任何弹幕元素、逻辑或统计菜单', () => {
    for (const banned of [
      '#danmu-layer',
      '#danmu-input',
      '#danmu-toggle-btn',
      'danmu-input-box',
      'sendDanmu',
      'KeyD',
      'Stats for Nerds',
    ]) {
      expect(script).not.toContain(banned)
    }
  })

  test('运行时脚本无语法错误且不引用外部特权', () => {
    expect(script).not.toContain('@profer/shared')
    expect(script).not.toContain('require(')
    expect(script).not.toContain('electron')
    expect(() => new Function(script)).not.toThrow()
  })

  test('PPT Canvas 高清重绘同步：ResizeObserver + 批注态保护 + 销毁清理', () => {
    expect(script).toContain('ensurePptSync')
    expect(script).toContain('redrawPpt')
    expect(script).toContain('initCanvas')
    expect(script).toContain('ResizeObserver')
    expect(script).toContain('__vue__')
    expect(script).toContain('ppt_canvas')
    expect(script).toContain('vm.draw')
    expect(script).toContain('pptList')
    expect(script).toContain('pptObserver.disconnect')
  })

  test('学习资源下载区：自上而下三大模块（PPT、智能摘要、语音转录）', () => {
    expect(script).toContain('upgradeResourcePanel')
    expect(script).toContain('__profer-wqxt-resource-panel')
    expect(script).toContain('课堂课件 PPT')
    expect(script).toContain('课程智能摘要')
    expect(script).toContain('课堂语音转录')
    expect(script).toContain('__profer-btn-ppt-pptx')
    expect(script).toContain('__profer-btn-ppt-pdf')
    expect(script).toContain('__profer-btn-ppt-html')
    expect(script).toContain('__profer-btn-summary-md')
    expect(script).toContain('__profer-btn-transcript-md')
  })

  test('课件导出：支持 PPTX（PptxGenJS）、PDF 打印通道、HTML 离线讲义', () => {
    expect(script).toContain('exportCoursewarePpt')
    expect(script).toContain('buildLectureHtml')
    expect(script).toContain('printLectureHtml')
    expect(script).toContain('pptxgenjs')
    expect(script).toContain('PptxGenJS')
    expect(script).toContain('addNotes')
  })

  test('智能摘要与语音转录：一键导出结构化 Markdown 文件并复制剪贴板', () => {
    expect(script).toContain('exportSummaryToMd')
    expect(script).toContain('exportTranscriptToMd')
    expect(script).toContain('intelligent-summary/detail')
    expect(script).toContain('search-trans-result')
    expect(script).toContain('_智能摘要.md')
    expect(script).toContain('_语音识别中英双语.md')
    expect(script).toContain('triggerDownload')
    expect(script).toContain('copyText')
  })

  test('CDUT Studio 官方底栏：居中 Logo 徽章与品牌文字', () => {
    expect(script).toContain('upgradeFooter')
    expect(script).toContain('__profer-wqxt-footer')
    expect(script).toContain('footer-logo-badge')
    expect(script).toContain('footer-brand-title')
    expect(script).toContain('CDUT Studio')
  })
})
