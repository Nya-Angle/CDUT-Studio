/**
 * 智联万站 · 无视感知 DOM 蒸馏与 BID 双射单元测试
 *
 * 覆盖：四级剪枝（0 面积 / 不可视 / aria-hidden 100% 裁剪）、交互候选集过滤、
 * BID 连续标定的单射与满射、Region 分块序列化、AXTree 语义增强。
 */

import { describe, expect, test } from 'bun:test'
import type { YanhuBidNode, YanhuDistilledPage } from '@profer/shared'
import {
  assignBids,
  buildYanhuCollectorScript,
  computePageFingerprint,
  enrichRolesFromAx,
  filterActionableElements,
  NAV_REGION_FOLD_THRESHOLD,
  serializePageDigest,
  YANHU_ACCESSIBLE_NAME_SNIPPET,
  YanhuDomDistillationEngine,
  type YanhuCollectedPage,
  type YanhuRawElement,
} from './yanhu-dom-distillation'
import { buildHardwareClickTargetScript } from './yanhu-browser-tools'

function makeElement(overrides: Partial<YanhuRawElement> = {}): YanhuRawElement {
  return {
    tag: 'button',
    role: 'button',
    name: '查询',
    bounds: { x: 10, y: 20, width: 80, height: 32 },
    visible: true,
    ariaHidden: false,
    occluded: false,
    region: '表单区',
    actionable: true,
    ...overrides,
  }
}

describe('filterActionableElements（第二级布局与可视性剪枝）', () => {
  test('无名称 / aria-hidden 的隐藏节点仍被剔除', () => {
    const elements: YanhuRawElement[] = [
      makeElement({ name: '可见' }),
      makeElement({ bounds: { x: 0, y: 0, width: 0, height: 0 }, actionable: true, name: '' }),
      makeElement({ ariaHidden: true, name: '无障碍隐藏' }),
      makeElement({ visible: false, name: '', actionable: true }),
    ]
    const result = filterActionableElements(elements)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('可见')
  })

  test('未渲染元素一律不进入 BID 台账（渲染红线）', () => {
    const elements: YanhuRawElement[] = [
      makeElement({
        name: '教务管理系统',
        visible: false,
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        collapsed: true,
      }),
    ]
    // 未渲染控件点击必被网页驳回（No-Op），还会因「解封」打乱页面状态，故绝不分配 BID。
    // 其存在改由 unrendered 汇总在 PageDigest 中以纯文本提示。
    expect(filterActionableElements(elements)).toHaveLength(0)
  })

  test('仅保留具备交互能力的元素', () => {
    const elements: YanhuRawElement[] = [
      makeElement({ actionable: true, name: '按钮' }),
      makeElement({ actionable: false, role: 'heading', name: '标题文本' }),
    ]
    const result = filterActionableElements(elements)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('按钮')
  })
})

describe('assignBids（定义 2 双射编号映射）', () => {
  test('按前序遍历连续标定 1..n，满足单射与满射', () => {
    const elements = [
      makeElement({ name: 'A' }),
      makeElement({ name: 'B' }),
      makeElement({ name: 'C' }),
    ]
    const records = assignBids(elements)
    expect(records.map((r) => r.bid)).toEqual([1, 2, 3])
    // 单射：编号唯一
    expect(new Set(records.map((r) => r.bid)).size).toBe(records.length)
    // 名称与顺序保持一致（前序遍历）
    expect(records.map((r) => r.name)).toEqual(['A', 'B', 'C'])
  })

  test('空候选集返回空映射', () => {
    expect(assignBids([])).toEqual([])
  })
})

describe('serializePageDigest（第四级 Region 分块序列化）', () => {
  test('按区域分组并内联 BID 编号与选项', () => {
    const records = assignBids([
      makeElement({ name: '办事大厅', role: 'link', region: '顶栏快捷操作' }),
      makeElement({
        tag: 'select',
        role: 'combobox',
        name: '开课学年学期',
        region: '核心业务 - 成绩查询',
        options: [
          { value: '2025-2026-1', text: '2025-2026-1', selected: false },
          { value: '2025-2026-2', text: '2025-2026-2', selected: true },
        ],
      }),
      makeElement({ name: '执行查询', region: '核心业务 - 成绩查询' }),
    ])
    const digest = serializePageDigest({ url: 'https://jw.cdut.edu.cn', title: '成绩查询', records })
    expect(digest).toContain('=== [PageDigest: 成绩查询] ===')
    expect(digest).toContain('[Region: 顶栏快捷操作]')
    expect(digest).toContain('[Region: 核心业务 - 成绩查询]')
    expect(digest).toContain('[BID: 1] link "办事大厅"')
    expect(digest).toContain('[BID: 2] combobox "开课学年学期"')
    expect(digest).toContain('current: "2025-2026-2"')
  })

  test('标注被遮挡节点', () => {
    const records = assignBids([makeElement({ name: '被遮挡', occluded: true })])
    const digest = serializePageDigest({ url: 'u', title: 't', records })
    expect(digest).toContain('[Occluded]')
  })

  test('未渲染元素只做汇总提示，不占用任何 BID', () => {
    const records = assignBids([makeElement({ name: '执行查询' })])
    const digest = serializePageDigest({
      url: 'u',
      title: 't',
      records,
      unrendered: { count: 37, regions: ['业务表单', '导航菜单'] },
    })
    expect(digest).toContain('未渲染元素 37 个')
    expect(digest).toContain('业务表单、导航菜单')
    expect(digest).not.toContain('[Collapsed]')
    // 未渲染元素不参与双射编号，可用 BID 数量仍等于真实渲染元素数
    expect(digest).toContain('BIDs: 1')
  })

  test('无未渲染元素时不输出汇总行（不制造噪音）', () => {
    const records = assignBids([makeElement({ name: '执行查询' })])
    const digest = serializePageDigest({ url: 'u', title: 't', records })
    expect(digest).not.toContain('未渲染元素')
  })

  test('空页面给出提示', () => {
    const digest = serializePageDigest({ url: 'u', title: 't', records: [] })
    expect(digest).toContain('暂无可交互控件')
  })
})

/**
 * 企业级表单封装的容器级标签（data-caption）。
 *
 * 锁死致命故障：EMAP「请假开始时间 / 请假结束时间」这类日期时间控件，其 <input> 自身没有
 * 任何 ARIA / label / title / placeholder，中文标签挂在祖先 div 的 data-caption 上。
 * 采集端靠「空间近邻猜测」拿到了名字，而定位端没有该能力 → 名称恒不匹配 →
 * 点击与填写双双报「未能在页面中定位」，模型转去猜像素坐标。
 */
describe('容器级标签载体（data-caption）与两端名称推导一致性', () => {
  function deriveName(el: Record<string, unknown>, doc: Record<string, unknown> = {}): string {
    const runner = new Function('el', 'doc', `${YANHU_ACCESSIBLE_NAME_SNIPPET}\nreturn __yanhuDeriveName(el, doc);`)
    return String(runner(el, doc))
  }

  function plainNode(tag: string, attrs: Record<string, string>, parent: unknown = null): Record<string, unknown> {
    return {
      nodeType: 1,
      tagName: tag,
      getAttribute: (n: string) => attrs[n] ?? '',
      innerText: attrs.__text ?? '',
      textContent: attrs.__text ?? '',
      id: attrs.id ?? '',
      closest: () => null,
      parentElement: parent,
    }
  }

  test('Given 输入框自身无任何标签 When 祖先容器带 data-caption Then 推导出该中文标签', () => {
    // 模拟 <div xtype="datetime" data-caption="请假开始时间"><input type="text"></div>
    const holder = plainNode('DIV', { 'data-caption': '请假开始时间' })
    const input = plainNode('INPUT', { type: 'text' }, holder)
    expect(deriveName(input)).toBe('请假开始时间')
  })

  test('Given 输入框自身有 placeholder When 祖先也有 data-caption Then 以更精确的 placeholder 为准', () => {
    const holder = plainNode('DIV', { 'data-caption': '请假开始时间' })
    const input = plainNode('INPUT', { type: 'text', placeholder: '请选择开始时间' }, holder)
    expect(deriveName(input)).toBe('请选择开始时间')
  })

  test('Given 按钮自带内联文本 When 处于带 caption 的容器内 Then 不覆盖按钮自身文本', () => {
    const holder = plainNode('DIV', { 'data-caption': '请假开始时间' })
    const button = plainNode('BUTTON', { __text: '选择时间' }, holder)
    expect(deriveName(button)).toBe('选择时间')
  })

  test('Given 定位端脚本 When 构建 Then 同样注入该名称推导（两端同源，杜绝名称不匹配）', () => {
    const record: YanhuBidNode = {
      bid: 8,
      role: 'textbox',
      tag: 'input',
      name: '请假开始时间',
      bounds: { x: 480, y: 300, width: 220, height: 30 },
    }
    const finderScript = buildHardwareClickTargetScript(record)
    expect(finderScript).toContain('data-caption')
    expect(finderScript).toContain('__yanhuDeriveName')
  })
})

/**
 * 语义区域归属（Region4Web 解构）。
 *
 * 锁死历史故障：企业级表单惯用 <table> 做栅格布局，若一律标成「数据表格」，
 * 模型会把表单字段误判为列表筛选器而不敢操作；同理 listBox / gridCell 这类
 * 表单控件内部命名被裸子串命中也会造成同一误判。
 */
describe('语义区域归属（布局表格 vs 数据表格）', () => {
  /** 在指定容器内放一个可见文本输入框，返回采集结果的 region */
  function regionOfInputInside(container: Record<string, unknown>): string {
    const cell: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'TD',
      className: '',
      id: '',
      getAttribute: () => '',
      querySelector: () => null,
      parentElement: container,
    }
    const input: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'INPUT',
      getAttribute: (n: string) => (n === 'type' ? 'text' : ''),
      getBoundingClientRect: () => ({ left: 480, top: 300, width: 200, height: 30 }),
      getClientRects: () => [{ width: 200, height: 30 }],
      innerText: '',
      textContent: '',
      className: '',
      id: '',
      parentElement: cell,
      onclick: null,
      labels: undefined,
    }
    const doc = {
      body: { querySelectorAll: () => [input] },
      querySelectorAll: () => [],
      title: 'region',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://xgfw.cdut.edu.cn/x' })
    return String(result.elements[0]?.region ?? '')
  }

  function tableWith(fieldTypes: string[], className = 'jqx-grid-table'): Record<string, unknown> {
    return {
      nodeType: 1,
      tagName: 'TABLE',
      className,
      id: '',
      getAttribute: () => '',
      querySelector: () => null,
      querySelectorAll: (sel: string) =>
        String(sel).indexOf('input') >= 0
          ? fieldTypes.map((t) => ({
              nodeType: 1,
              // select / textarea 对应真实标签名，其余按 input 处理（type 即传入值）
              tagName: t === 'select' ? 'SELECT' : t === 'textarea' ? 'TEXTAREA' : 'INPUT',
              getAttribute: (n: string) => (n === 'type' ? t : ''),
            }))
          : [],
      parentElement: null,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 300 }),
    }
  }

  test('Given 表格内含文本输入框 When 归属区域 Then 判为表单区（而非数据表格）', () => {
    expect(regionOfInputInside(tableWith(['text']))).toBe('表单区')
  })

  test('Given 表格内含 select / textarea When 归属区域 Then 同样判为表单区', () => {
    expect(regionOfInputInside(tableWith(['select']))).toBe('表单区')
    expect(regionOfInputInside(tableWith(['textarea']))).toBe('表单区')
  })

  test('Given 表格内只有文本与链接（无输入控件）When 归属区域 Then 仍判为数据表格', () => {
    expect(regionOfInputInside(tableWith([]))).toBe('数据表格')
  })

  test('Given 表格内只有 type=hidden 的输入 When 归属区域 Then 不误判为表单区', () => {
    expect(regionOfInputInside(tableWith(['hidden', 'hidden']))).toBe('数据表格')
  })

  test('Given 表格内只有 EMAP 组件线索（无原生控件）When 归属区域 Then 仍判为表单区', () => {
    const withClue = (clue: string): Record<string, unknown> => {
      const table = tableWith([])
      table.querySelector = (sel: string) => (String(sel).indexOf(clue) >= 0 ? { nodeType: 1 } : null)
      return table
    }
    // 金智 EMAP 栅格表格里往往只有 div 组件 + hidden，若只看原生控件会被误判成「数据表格」
    expect(regionOfInputInside(withClue('[data-caption]'))).toBe('表单区')
    expect(regionOfInputInside(withClue('[xtype]'))).toBe('表单区')
    expect(regionOfInputInside(withClue('[role="tree"]'))).toBe('表单区')
    expect(regionOfInputInside(withClue('.bh-form-group'))).toBe('表单区')
  })

  test('Given 容器类名是 listBox / gridCell（表单控件内部命名）When 归属区域 Then 不误判为数据表格', () => {
    const listBox = {
      nodeType: 1,
      tagName: 'DIV',
      className: 'jqx-listBox gridCell',
      id: '',
      getAttribute: () => '',
      querySelector: () => null,
      parentElement: null,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 200 }),
    }
    expect(regionOfInputInside(listBox)).toBe('主要内容')
  })

  test('Given 容器类名确为数据列表 When 归属区域 Then 判为数据表格', () => {
    const dataTable = {
      nodeType: 1,
      tagName: 'DIV',
      className: 'data-table',
      id: '',
      getAttribute: () => '',
      querySelector: () => null,
      parentElement: null,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 300 }),
    }
    expect(regionOfInputInside(dataTable)).toBe('数据表格')
  })
})

/**
 * 显示文本口径（#1 取值 / #3 命名）与浮层叶子选项纳管（#2）。
 *
 * 锁死历史事故：容器名曾是「全部子孙文本拼接」（模型花大量推理去猜它是什么）；
 * 非输入型控件（自定义下拉 / 树选择）的当前选中值从未进入台账，模型无法核对选区是否写入。
 */
describe('显示文本口径与浮层选项纳管', () => {
  /** 构造最小元素桩：支持「自身直接文本」与「子元素」两种来源 */
  function node(
    tag: string,
    text = '',
    children: Array<Record<string, unknown>> = [],
    attrs: Record<string, string> = {},
  ): Record<string, unknown> {
    const descendants: Array<Record<string, unknown>> = []
    const walk = (list: Array<Record<string, unknown>>): void => {
      for (const child of list) {
        descendants.push(child)
        walk((child.children as Array<Record<string, unknown>>) ?? [])
      }
    }
    walk(children)
    const isDescendantOf = (candidate: Record<string, unknown>, ancestor: Record<string, unknown>): boolean => {
      let cur: Record<string, unknown> | null = candidate
      while (cur) {
        if (cur === ancestor) return true
        cur = (cur.parentElement as Record<string, unknown> | null) ?? null
      }
      return false
    }
    const self: Record<string, unknown> = {
      nodeType: 1,
      tagName: tag,
      getAttribute: (n: string) => attrs[n] ?? '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 120, height: 28 }),
      getClientRects: () => [{ width: 120, height: 28 }],
      // 浮层选择器匹配：由桩数据显式声明命中的选择器（逗号拼接的选择器串按子串判定）
      matches: (sel: string) => {
        const declared = attrs.__match ?? ''
        if (!declared) return false
        return declared.split('|').some((one) => one && String(sel).indexOf(one) >= 0)
      },
      contains: (other: unknown) => isDescendantOf(other as Record<string, unknown>, self),
      className: attrs.class ?? '',
      onclick: null,
      id: attrs.id ?? '',
      closest: () => null,
      parentElement: null,
      children,
      childNodes: [...(text ? [{ nodeType: 3, nodeValue: text }] : []), ...children],
      querySelectorAll: (sel: string) => (sel === '*' ? descendants : []),
      innerText: text,
      textContent: `${text} ${children.map((c) => String(c.textContent ?? '')).join(' ')}`.trim(),
    }
    // 补齐父链：浮层判定（popupRootOf / contains）需要真实的祖先关系
    for (const child of children) {
      if (child.parentElement == null) child.parentElement = self
    }
    return self
  }

  function deriveName(el: Record<string, unknown>): string {
    const runner = new Function('el', 'doc', `${YANHU_ACCESSIBLE_NAME_SNIPPET}\nreturn __yanhuDeriveName(el, doc);`)
    return String(runner(el, {}))
  }

  /** 运行采集脚本：主台账元素 + 可选的若干可见浮层 */
  function collect(
    target: Record<string, unknown>,
    popup?: Record<string, unknown> | Array<Record<string, unknown>>,
  ) {
    const popups = Array.isArray(popup) ? popup : popup ? [popup] : []
    const doc = {
      body: { querySelectorAll: () => [target, ...popups] },
      querySelectorAll: (sel: string) => (popups.length > 0 && String(sel).indexOf('.jqx-listbox') >= 0 ? popups : []),
      title: 'render-gate',
      defaultView: {
        getComputedStyle: (node: Record<string, unknown>) => ({
          display: node.__display ?? 'block',
          visibility: 'visible',
          opacity: '1',
          cursor: node.__cursor ?? 'auto',
        }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    return runner(doc, doc.defaultView, { href: 'https://xgfw.cdut.edu.cn/x' }) as {
      elements: Array<{ role: string; name: string; value?: string; region?: string }>
    }
  }

  test('Given 容器有自身直接文本 When 推导名字 Then 只取该短文本（不拼接子孙）', () => {
    const container = node('DIV', '请选择...', [node('SPAN', '吉林省'), node('SPAN', '贵州省')])
    expect(deriveName(container)).toBe('请选择...')
  })

  test('Given 容器自身无文本（a/i/span 结构）When 推导名字 Then 回退首个带文本的叶子后代', () => {
    const link = node('A', '', [node('I', ''), node('SPAN', '我要请假')], { href: '#' })
    expect(deriveName(link)).toBe('我要请假')
  })

  test('Given 祖先有 data-caption 且控件自身有显示文本 When 推导名字 Then 以显示文本为准（不回归）', () => {
    const holder = node('DIV', '', [node('INPUT', '', [], { 'data-caption': '请假开始时间' })], {})
    const input = (holder.children as Array<Record<string, unknown>>)[0]!
    input.nodeType = 1
    expect(deriveName(input)).toBe('请假开始时间')
  })

  test('Given 非输入型控件（自定义下拉）When 采集 Then 补上当前显示值，供模型核对选区', () => {
    const select = node('DIV', '香港特别行政区', [node('SPAN', '')], { 'aria-label': '出校去向' })
    select.__cursor = 'pointer'
    const result = collect(select)
    expect(result.elements[0]?.name).toBe('出校去向')
    expect(result.elements[0]?.value).toBe('香港特别行政区')
  })

  test('Given 显示值与名字相同 When 采集 Then 不重复投递 value（避免台账噪音）', () => {
    const trigger = node('BUTTON', '我要请假', [])
    trigger.__cursor = 'pointer'
    const result = collect(trigger)
    expect(result.elements[0]?.name).toBe('我要请假')
    expect(result.elements[0]?.value).toBeUndefined()
  })

  test('Given 控件只有泛化占位符且祖辈有 data-caption When 采集 Then 业务标签作名、占位符退化为当前值', () => {
    const holder = node('DIV', '', [node('DIV', '请选择...', [], {})], { 'data-caption': '出校去向' })
    const widget = (holder.children as Array<Record<string, unknown>>)[0]!
    widget.__cursor = 'pointer'
    const result = collect(widget)
    // 页面上十几个未填写的下拉文本都是「请选择...」：若让它当名字，模型只能盲猜 [BID]
    expect(result.elements[0]?.name).toBe('出校去向')
    expect(result.elements[0]?.value).toBe('请选择...')
  })

  test('Given 占位符含具体字段名词（请选择日期）When 采集 Then 保留 placeholder 不回退标签', () => {
    const holder = node('DIV', '', [node('INPUT', '', [], { placeholder: '请选择日期' })], {
      'data-caption': '申请日期',
    })
    const input = (holder.children as Array<Record<string, unknown>>)[0]!
    expect(deriveName(input)).toBe('请选择日期')
  })

  test('Given 浮层嵌套（外层弹窗含内层列表容器）When 采集 Then 选项只出现一份', () => {
    const optionA = node('DIV', '吉林省')
    const optionB = node('DIV', '贵州省')
    const inner = node('DIV', '', [optionA, optionB], { __match: '[id*="innerListBox"]' })
    const outer = node('DIV', '', [inner], { __match: '.jqx-dropdownlist-popup' })
    const trigger = node('BUTTON', '选择省份', [])
    trigger.__cursor = 'pointer'
    const result = collect(trigger, [outer, inner])
    const names = result.elements.map((item) => item.name)
    // 历史事故：同一份省份被采集两遍，第二份还撞上限被腰斩，模型误以为是「两级级联」
    expect(names.filter((name) => name === '吉林省').length).toBe(1)
    expect(names.filter((name) => name === '贵州省').length).toBe(1)
  })

  test('Given 控件自身就命中浮层选择器（如 .bh-select-dropdown 触发器）When 采集 Then 它必须仍在主台账拿到 [BID]', () => {
    // 历史事故：`jqx-dropdownlist-state-normal` 这类控件自身类名就含 "dropdown"，
    // 旧判定让触发器自己成了「浮层根」，而浮层端只发后代不发根 → 触发器凭空消失。
    // 实测后果：出校去向 / 请假类型 / 冲突课程集体失去 [BID]，台账从 50 项腰斩到 22 项。
    const trigger = node('DIV', '请选择...', [], {
      __match: '.bh-select-dropdown',
      'data-caption': '出校去向',
      role: 'button',
    })
    trigger.__cursor = 'pointer'
    const result = collect(trigger)
    expect(result.elements.length).toBe(1)
    expect(result.elements[0]?.role).toBe('button')
    expect(result.elements[0]?.name).toBe('出校去向')
  })

  test('Given 浮层内有叶子选项 When 采集 Then 追加为可点 [BID]，且既有元素编号不变', () => {
    const trigger = node('BUTTON', '我要请假', [])
    trigger.__cursor = 'pointer'
    const optionA = node('DIV', '吉林省')
    const optionB = node('DIV', '贵州省')
    const popup = node('DIV', '', [optionA, optionB], { __match: '.jqx-listbox' })
    popup.__cursor = 'auto'
    const result = collect(trigger, popup)
    const names = result.elements.map((item) => `${item.role}:${item.name}`)

    // 既有元素编号完全不变（浮层选项一律追加在末尾，绝不插队）
    expect(result.elements[0]?.name).toBe('我要请假')
    expect(names).toContain('option:吉林省')
    expect(names).toContain('option:贵州省')
    expect(result.elements.findIndex((item) => item.role === 'option')).toBeGreaterThan(0)
    // 聚合容器本身不应被投递成「名字=子孙拼接」的 BID
    expect(names.some((entry) => entry.includes('吉林省 贵州省'))).toBe(false)
  })
})

describe('enrichRolesFromAx（AXTree 语义增强）', () => {
  test('用 AX 树补全 generic 节点的明确角色', () => {
    const records = assignBids([makeElement({ role: 'generic', name: '提交申请' })])
    const ax = [{ role: { value: 'button' }, name: { value: '提交申请' } }]
    const enriched = enrichRolesFromAx(records, ax)
    expect(enriched[0]?.role).toBe('button')
  })

  test('忽略 ignored 节点与歧义名称', () => {
    const records = assignBids([makeElement({ role: 'generic', name: '重名' })])
    const ax = [
      { role: { value: 'button' }, name: { value: '重名' } },
      { role: { value: 'link' }, name: { value: '重名' } },
      { role: { value: 'button' }, name: { value: '忽略我' }, ignored: true },
    ]
    const enriched = enrichRolesFromAx(records, ax)
    expect(enriched[0]?.role).toBe('generic')
  })
})

describe('多层嵌套框架（frameset / iframe）与超长网页穿透', () => {
  test('assignBids 正确保留 framePath 字段', () => {
    const elements = [
      makeElement({ name: '课表查询', framePath: 'leftFrame' }),
      makeElement({ name: '学期选择', framePath: 'mainFrame' }),
    ]
    const records = assignBids(elements)
    expect(records[0]?.framePath).toBe('leftFrame')
    expect(records[1]?.framePath).toBe('mainFrame')
  })

  test('serializePageDigest 呈现 [Frame: frameName | Region] 语义结构', () => {
    const records = assignBids([
      makeElement({ name: '本学期课表', role: 'link', region: '导航菜单', framePath: 'leftFrame' }),
      makeElement({ name: '学期成绩查询', role: 'link', region: '导航菜单', framePath: 'leftFrame' }),
      makeElement({
        name: '开课学年学期',
        tag: 'select',
        role: 'combobox',
        region: '核心业务区',
        framePath: 'mainFrame',
        options: [
          { value: '2025-2026-1', text: '2025-2026-1', selected: false },
          { value: '2025-2026-2', text: '2025-2026-2', selected: true },
        ],
      }),
      makeElement({ name: '执行查询', role: 'button', region: '核心业务区', framePath: 'mainFrame' }),
    ])

    const digest = serializePageDigest({
      url: 'https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx',
      title: '教务网络管理系统',
      records,
    })

    expect(digest).toContain('=== [PageDigest: 教务网络管理系统] ===')
    expect(digest).toContain('[Frame: leftFrame | 导航菜单]')
    expect(digest).toContain('[BID: 1] link "本学期课表"')
    expect(digest).toContain('[BID: 2] link "学期成绩查询"')
    expect(digest).toContain('[Frame: mainFrame | 核心业务区]')
    expect(digest).toContain('[BID: 3] combobox "开课学年学期"')
    expect(digest).toContain('[BID: 4] button "执行查询"')
  })

  test('buildYanhuCollectorScript 成功穿透 frameset 子文档并累积物理屏幕坐标', () => {
    // 构造模拟全局环境：顶层为 <frameset>（body 为 null），包含 leftFrame 与 mainFrame
    const leftFrameDoc = {
      body: {
        querySelectorAll: () => [
          {
            tagName: 'A',
            getAttribute: (n: string) => (n === 'href' ? '#' : ''),
            getBoundingClientRect: () => ({ left: 12, top: 24, width: 120, height: 28 }),
            innerText: '本学期课表',
          },
        ],
      },
      querySelectorAll: () => [],
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 200,
        innerHeight: 800,
      },
    }

    const mainFrameDoc = {
      body: {
        querySelectorAll: () => [
          {
            tagName: 'BUTTON',
            getAttribute: () => '',
            // 模拟超长网页下方元素（纵向 1500px，超出 800px 视口高度）
            getBoundingClientRect: () => ({ left: 30, top: 1500, width: 80, height: 32 }),
            innerText: '深层保存按钮',
          },
        ],
      },
      querySelectorAll: () => [],
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 1000,
        innerHeight: 800,
      },
    }

    const mockTopDoc = {
      body: null, // frameset 页面无 body
      documentElement: {
        querySelectorAll: () => [],
      },
      querySelectorAll: (sel: string) => {
        if (sel === 'frame, iframe') {
          return [
            {
              getAttribute: (n: string) => (n === 'name' ? 'leftFrame' : ''),
              name: 'leftFrame',
              getBoundingClientRect: () => ({ left: 0, top: 60, width: 200, height: 800 }),
              contentDocument: leftFrameDoc,
            },
            {
              getAttribute: (n: string) => (n === 'name' ? 'mainFrame' : ''),
              name: 'mainFrame',
              getBoundingClientRect: () => ({ left: 200, top: 60, width: 1000, height: 800 }),
              contentDocument: mainFrameDoc,
            },
          ]
        }
        return []
      },
      title: '青果教务系统主框架',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 1200,
        innerHeight: 860,
      },
    }

    const script = buildYanhuCollectorScript()
    // 通过包装器注入 mock document / window 并执行 IIFE
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(mockTopDoc, mockTopDoc.defaultView, { href: 'https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx' })

    expect(result.elements).toHaveLength(2)

    // leftFrame 中的链接：x = 0 + 12 = 12, y = 60 + 24 = 84
    const linkEl = result.elements[0]
    expect(linkEl.name).toBe('本学期课表')
    expect(linkEl.role).toBe('link')
    expect(linkEl.framePath).toBe('leftFrame')
    expect(linkEl.region).toBe('导航菜单')
    expect(linkEl.bounds).toEqual({ x: 12, y: 84, width: 120, height: 28 })

    // mainFrame 中的超长深层按钮：x = 200 + 30 = 230, y = 60 + 1500 = 1560
    const btnEl = result.elements[1]
    expect(btnEl.name).toBe('深层保存按钮')
    expect(btnEl.role).toBe('button')
    expect(btnEl.framePath).toBe('mainFrame')
    expect(btnEl.region).toBe('核心业务区')
    expect(btnEl.bounds).toEqual({ x: 230, y: 1560, width: 80, height: 32 })
    // 超长网页视口外部未被误判为遮挡或丢弃
    expect(btnEl.occluded).toBe(false)
  })
})

describe('交互能力感知扩展（cursor: pointer 启发式召回）', () => {
  test('cursor:pointer 的软交互卡片被采集为可交互元素', () => {
    const cardEl = {
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 20, top: 30, width: 200, height: 40 }),
      innerText: '可点击卡片',
      className: 'notice-card',
      id: '',
      parentElement: null,
    }
    const doc = {
      body: { querySelectorAll: () => [cardEl] },
      querySelectorAll: () => [],
      title: 'cursor 测试',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'pointer' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/xsMainV.htmlx' })

    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].actionable).toBe(true)
    expect(result.elements[0].name).toBe('可点击卡片')
  })

  test('默认 auto 光标的普通文本 div 不被误采为可交互', () => {
    const plainEl = {
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 20 }),
      innerText: '普通说明文本',
      className: '',
      id: '',
      parentElement: null,
    }
    const doc = {
      body: { querySelectorAll: () => [plainEl] },
      querySelectorAll: () => [],
      title: 'plain',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
  })
})

describe('Region4Web 语义分块增强（类名 / ID 线索）', () => {
  function runWithContainer(containerClass: string): { region: string } {
    const container = {
      nodeType: 1,
      tagName: 'DIV',
      className: containerClass,
      id: '',
      getAttribute: () => '',
      querySelector: () => null,
      parentElement: null,
    }
    const linkEl = {
      nodeType: 1,
      tagName: 'A',
      className: '',
      id: '',
      getAttribute: (n: string) => (n === 'href' ? '#' : ''),
      getBoundingClientRect: () => ({ left: 10, top: 10, width: 100, height: 24 }),
      innerText: '成绩查询',
      parentElement: container,
    }
    const doc = {
      body: { querySelectorAll: () => [linkEl] },
      querySelectorAll: () => [],
      title: 'region',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/xsMainV.htmlx' })
    expect(result.elements).toHaveLength(1)
    return { region: result.elements[0].region }
  }

  test('div.main-nav 容器内的链接被解构为「导航菜单」', () => {
    expect(runWithContainer('main-nav').region).toBe('导航菜单')
  })

  test('div.menu-list 容器内亦被解构为「导航菜单」', () => {
    expect(runWithContainer('menu-list').region).toBe('导航菜单')
  })

  test('div.form-filter 容器被解构为「业务表单」', () => {
    expect(runWithContainer('form-filter').region).toBe('业务表单')
  })
})

describe('匿名 <frameset> 三级鲁棒穿透', () => {
  test('无 name 的匿名子框架经 win.frames[i].document 触达并采集', () => {
    const anonFrameDoc = {
      body: {
        querySelectorAll: () => [
          {
            nodeType: 1,
            tagName: 'BUTTON',
            getAttribute: () => '',
            getBoundingClientRect: () => ({ left: 5, top: 5, width: 60, height: 24 }),
            innerText: '匿名框架按钮',
            parentElement: null,
          },
        ],
      },
      querySelectorAll: () => [],
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 600,
        innerHeight: 500,
      },
    }
    const anonWindow = { document: anonFrameDoc }
    const anonFrame = {
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 600, height: 500 }),
      // 无 contentDocument / contentWindow，仅能通过 win.frames[i] 触达
    }
    const topDoc = {
      body: null,
      documentElement: { querySelectorAll: () => [] },
      querySelectorAll: (sel: string) => (sel === 'frame, iframe' ? [anonFrame] : []),
      title: '匿名 frameset',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 1200,
        innerHeight: 800,
        frames: [anonWindow],
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(topDoc, topDoc.defaultView, { href: 'https://jw.cdut.edu.cn/xsMainV.htmlx' })

    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].name).toBe('匿名框架按钮')
    expect(result.elements[0].framePath).toBe('frame_0')
    expect(result.elements[0].bounds).toEqual({ x: 5, y: 5, width: 60, height: 24 })
  })
})

describe('未渲染元素不再分配 BID（渲染红线）', () => {
  /** 构造单元素文档桩（隐藏元素的采集行为验证） */
  function singleElementDoc(
    el: Record<string, unknown>,
    style: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      body: { querySelectorAll: () => [el] },
      querySelectorAll: () => [],
      title: 'render-gate',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto', ...style }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
  }

  test('display:none 的有名可交互链接不被采集，仅计入未渲染汇总', () => {
    const hiddenEl = {
      nodeType: 1,
      tagName: 'A',
      getAttribute: (n: string) => (n === 'href' ? '#' : ''),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
      innerText: '教务管理系统',
      className: '',
      id: '',
      parentElement: null,
      onclick: null,
    }
    const doc = singleElementDoc(hiddenEl, { display: 'none' })
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
    expect(result.unrendered.count).toBe(1)
    expect(Array.isArray(result.unrendered.regions)).toBe(true)
  })

  test('content-visibility:hidden 子树内的元素（无布局盒）不被采集', () => {
    // 该元素自身计算样式完全正常、尺寸也非零，唯独 getClientRects() 为空——
    // 这正是 content-visibility:hidden / 未挂载子树在浏览器中的真实表现。
    const ghostEl = {
      nodeType: 1,
      tagName: 'A',
      getAttribute: (n: string) => (n === 'href' ? '#' : ''),
      getBoundingClientRect: () => ({ left: 10, top: 10, width: 80, height: 24 }),
      getClientRects: () => [],
      innerText: '未渲染的入口',
      className: '',
      id: '',
      parentElement: null,
      onclick: null,
    }
    const doc = singleElementDoc(ghostEl, {})
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
    expect(result.unrendered.count).toBe(1)
  })

  test('无名称的隐藏元素既不被采集，也不计入未渲染汇总（避免噪音计数）', () => {
    const hiddenEl = {
      nodeType: 1,
      tagName: 'A',
      getAttribute: (n: string) => (n === 'href' ? '#' : ''),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
      innerText: '',
      className: '',
      id: '',
      parentElement: null,
      onclick: null,
    }
    const doc = singleElementDoc(hiddenEl, { display: 'none' })
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
    expect(result.unrendered.count).toBe(0)
  })

  test('真实渲染的可见元素仍被正常采集（红线不误杀）', () => {
    const visibleEl = {
      nodeType: 1,
      tagName: 'A',
      getAttribute: (n: string) => (n === 'href' ? '#' : ''),
      getBoundingClientRect: () => ({ left: 10, top: 20, width: 90, height: 28 }),
      getClientRects: () => [{ width: 90, height: 28 }],
      innerText: '我要请假',
      className: '',
      id: '',
      parentElement: null,
      onclick: null,
    }
    const doc = singleElementDoc(visibleEl, {})
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].name).toBe('我要请假')
    expect(result.elements[0].collapsed).toBeUndefined()
    expect(result.unrendered.count).toBe(0)
  })

  test('视觉隐藏的原生单选改绑到可见 <label> 上（因私请假 / 是否出校 能被 DOM 命中）', () => {
    // 自定义单选：原生 input 被隐藏成 0×0，真正承载视觉与交互的是外层 <label>。
    const labelNode: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'LABEL',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 480, top: 268, width: 120, height: 20 }),
      innerText: '因私请假',
      textContent: '因私请假',
      className: '',
      id: '',
      parentElement: null,
    }
    const hiddenRadio: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'INPUT',
      getAttribute: (n: string) => (n === 'type' ? 'radio' : ''),
      getBoundingClientRect: () => ({ left: 484, top: 270, width: 0, height: 0 }),
      getClientRects: () => [],
      innerText: '',
      textContent: '',
      className: '',
      id: '',
      parentElement: labelNode,
      onclick: null,
      labels: undefined,
    }
    const doc = singleElementDoc(hiddenRadio, {})
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://xgfw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].role).toBe('radio')
    expect(result.elements[0].name).toBe('因私请假')
    expect(result.elements[0].tag).toBe('label')
    // 几何取「可见代理」，因此点击目标是一个真实渲染在屏幕上的 120×20 盒子
    expect(result.elements[0].bounds).toEqual({ x: 480, y: 268, width: 120, height: 20 })
    expect(result.elements[0].visible).toBe(true)
  })

  test('祖先只有面板级大容器时不做代理重绑定（宁可不采，也不把 BID 绑到容器上）', () => {
    const bigWrapper: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 600 }),
      innerText: '请假信息',
      textContent: '请假信息',
      className: '',
      id: '',
      parentElement: null,
    }
    const hiddenRadio: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'INPUT',
      getAttribute: (n: string) => (n === 'type' ? 'radio' : ''),
      getBoundingClientRect: () => ({ left: 10, top: 10, width: 0, height: 0 }),
      getClientRects: () => [],
      innerText: '',
      textContent: '',
      className: '',
      id: '',
      parentElement: bigWrapper,
      onclick: null,
      labels: undefined,
    }
    const doc = singleElementDoc(hiddenRadio, {})
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://xgfw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
    expect(result.unrendered.count).toBe(1)
  })

  test('原生 type=hidden 的控件不参与代理重绑定（避免 CSRF 隐藏域等噪音）', () => {
    const labelNode: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'LABEL',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 480, top: 268, width: 120, height: 20 }),
      innerText: '隐藏域',
      textContent: '隐藏域',
      className: '',
      id: '',
      parentElement: null,
    }
    const hiddenField: Record<string, unknown> = {
      nodeType: 1,
      tagName: 'INPUT',
      getAttribute: (n: string) => (n === 'type' ? 'hidden' : ''),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
      getClientRects: () => [],
      innerText: '',
      textContent: '',
      className: '',
      id: '',
      parentElement: labelNode,
      onclick: null,
      labels: undefined,
    }
    const doc = singleElementDoc(hiddenField, {})
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://xgfw.cdut.edu.cn/x' })

    expect(result.elements).toHaveLength(0)
  })
})

describe('静态导航树行内紧凑编码（全量保留 BID，杜绝模型盲视）', () => {
  test('导航项超过阈值时改为多列紧凑行，BID 100% 保留且主内容区仍全量保留', () => {
    const navRecords = assignBids(
      Array.from({ length: NAV_REGION_FOLD_THRESHOLD + 5 }, (_, i) =>
        makeElement({ name: `菜单-${i}`, role: 'link', region: '导航菜单' }),
      ),
    )
    const mainRecords = assignBids([makeElement({ name: '执行查询', region: '业务表单' })])
    const digest = serializePageDigest({
      url: 'https://jw.cdut.edu.cn/xsMainV.htmlx',
      title: '教务',
      records: [...navRecords, ...mainRecords],
    })

    expect(digest).toContain('[Region: 导航菜单]')
    // 不再粗暴折叠丢弃菜单项
    expect(digest).not.toContain('已折叠')
    // 关键：全部菜单项 [BID] 完整保留，模型可一步识别并点击
    expect(digest).toContain('[1] 菜单-0')
    expect(digest).toContain('[20] 菜单-19')
    // 行内紧凑：同一行承载多个菜单项
    expect(digest).toContain('[1] 菜单-0 | [2] 菜单-1 | [3] 菜单-2 | [4] 菜单-3')
    // 主内容区不被折叠
    expect(digest).toContain('[Region: 业务表单]')
    expect(digest).toContain('执行查询')
  })

  test('leftFrame 框架路径即使区域名非「导航」也触发行内紧凑编码', () => {
    const records = assignBids(
      Array.from({ length: NAV_REGION_FOLD_THRESHOLD + 1 }, (_, i) =>
        makeElement({ name: `菜单项-${i}`, role: 'link', region: '主要内容', framePath: 'leftFrame' }),
      ),
    )
    const digest = serializePageDigest({ url: 'u', title: 't', records })
    expect(digest).toContain('[Frame: leftFrame | 主要内容]')
    expect(digest).toContain('[1] 菜单项-0')
    expect(digest).not.toContain('已折叠')
  })

  test('少量导航项仍按纵向列表逐项输出', () => {
    const records = assignBids([
      makeElement({ name: '菜单A', role: 'link', region: '导航菜单' }),
      makeElement({ name: '菜单B', role: 'link', region: '导航菜单' }),
    ])
    const digest = serializePageDigest({ url: 'u', title: 't', records })
    expect(digest).not.toContain('已折叠')
    expect(digest).toContain('[BID: 1] link "菜单A"')
  })
})

describe('深层 iframe 课表穿透直提（结构化 Markdown）', () => {
  test('buildYanhuCollectorScript 识别 kbtable 并提取为 Markdown', () => {
    const cell = (text: string) => ({ textContent: text })
    const row = (texts: string[]) => ({
      querySelectorAll: (sel: string) => (sel === 'th,td' ? texts.map(cell) : []),
    })
    const kbTable = {
      className: 'kbtable',
      id: '',
      textContent: '星期一 星期二 星期三 第一节 高等数学 大学英语',
      querySelector: () => null,
      querySelectorAll: (sel: string) =>
        sel === 'tr'
          ? [row(['节次', '星期一', '星期二']), row(['第一节', '高等数学', '大学英语'])]
          : sel === 'th'
            ? [cell('节次'), cell('星期一'), cell('星期二')]
            : sel === 'td'
              ? []
              : [],
    }
    const doc = {
      body: { querySelectorAll: () => [] },
      querySelectorAll: (sel: string) => (sel === 'table' ? [kbTable] : []),
      title: '课表',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/jsxsd/xskb/xskb_list.do' })

    expect(result.dataTables).toHaveLength(1)
    expect(result.dataTables[0]).toContain('| 节次 | 星期一 | 星期二 |')
    expect(result.dataTables[0]).toContain('| 第一节 | 高等数学 | 大学英语 |')
  })

  test('serializePageDigest 优先前置输出结构化数据表格', () => {
    const digest = serializePageDigest({
      url: 'u',
      title: '课表查询',
      records: [],
      dataTables: ['| 节次 | 星期一 |\n| --- | --- |\n| 第一节 | 高等数学 |'],
    })
    expect(digest).toContain('[结构化数据表格（全框架穿透直提）]')
    expect(digest).toContain('| 第一节 | 高等数学 |')
  })
})

describe('通用业务数据表格直提（成绩 / 考务等）', () => {
  function runWithTable(table: unknown) {
    const doc = {
      body: { querySelectorAll: () => [] },
      querySelectorAll: (sel: string) => (sel === 'table' ? [table] : []),
      title: '成绩查询',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    return runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/jsxsd/kscj/cjcx_list' })
  }

  test('含 th 表头的成绩表被自动提取为 Markdown（无 kbtable 类名 / 无星期字段）', () => {
    const cell = (text: string) => ({ textContent: text })
    const row = (texts: string[]) => ({
      querySelectorAll: (sel: string) => (sel === 'th,td' ? texts.map(cell) : []),
    })
    const scoreTable = {
      className: 'Nsb_r_list',
      id: 'dataList',
      textContent: '课程名称 成绩 高等数学 优秀',
      querySelector: () => null,
      querySelectorAll: (sel: string) =>
        sel === 'tr'
          ? [row(['课程名称', '成绩']), row(['高等数学', '优秀'])]
          : sel === 'th'
            ? [cell('课程名称'), cell('成绩')]
            : sel === 'td'
              ? [cell('高等数学'), cell('优秀')]
              : [],
    }
    const result = runWithTable(scoreTable)
    expect(result.dataTables).toHaveLength(1)
    expect(result.dataTables[0]).toContain('| 课程名称 | 成绩 |')
    expect(result.dataTables[0]).toContain('| 高等数学 | 优秀 |')
  })

  test('考核安排表（多行多列 td 网格）被自动提取', () => {
    const cell = (text: string) => ({ textContent: text })
    const row = (texts: string[]) => ({
      querySelectorAll: (sel: string) => (sel === 'th,td' ? texts.map(cell) : []),
    })
    const examTable = {
      className: '',
      id: '',
      textContent: '考试科目 考试时间 考试地点 大学物理 2026-01-10 教一 301 线性代数 2026-01-12 教二 202',
      querySelector: () => null,
      querySelectorAll: (sel: string) =>
        sel === 'tr'
          ? [row(['科目', '时间', '地点']), row(['大学物理', '2026-01-10', '教一 301']), row(['线性代数', '2026-01-12', '教二 202'])]
          : sel === 'th'
            ? []
            : sel === 'td'
              ? [
                  cell('科目'),
                  cell('时间'),
                  cell('地点'),
                  cell('大学物理'),
                  cell('2026-01-10'),
                  cell('教一 301'),
                  cell('线性代数'),
                  cell('2026-01-12'),
                  cell('教二 202'),
                ]
              : [],
    }
    const result = runWithTable(examTable)
    expect(result.dataTables).toHaveLength(1)
    expect(result.dataTables[0]).toContain('| 科目 | 时间 | 地点 |')
    expect(result.dataTables[0]).toContain('| 大学物理 | 2026-01-10 | 教一 301 |')
  })

  test('纯布局小表（无 th、单行）不被误提为数据表格', () => {
    const cell = (text: string) => ({ textContent: text })
    const row = (texts: string[]) => ({
      querySelectorAll: (sel: string) => (sel === 'th,td' ? texts.map(cell) : []),
    })
    const layoutTable = {
      className: 'layout',
      id: '',
      textContent: '布局占位',
      querySelector: () => null,
      querySelectorAll: (sel: string) =>
        sel === 'tr' ? [row(['布局占位'])] : sel === 'th' ? [] : sel === 'td' ? [cell('布局占位')] : [],
    }
    const result = runWithTable(layoutTable)
    expect(result.dataTables).toHaveLength(0)
  })
})

describe('「可点击容器」直接子项拆分（根除菜单项漏采与聚合名称误导）', () => {
  test('cursor:pointer 菜单容器的短文本子项被拆为独立可交互 BID，容器聚合名不再占位', () => {
    const makeSpan = (text: string, left: number) => ({
      nodeType: 1,
      tagName: 'SPAN',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left, top: 10, width: 60, height: 24 }),
      innerText: text,
      textContent: text,
      childNodes: [{ nodeType: 3, nodeValue: text }],
      children: [] as unknown[],
      className: '',
      id: '',
      onclick: null,
      parentElement: null,
    })
    const container = {
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 40 }),
      innerText: '学生管理 成长计划',
      textContent: '学生管理 成长计划',
      childNodes: [] as unknown[],
      children: [makeSpan('学生管理', 0), makeSpan('成长计划', 80)],
      className: 'menu',
      id: '',
      onclick: null,
      parentElement: null,
    }
    const doc = {
      body: { querySelectorAll: () => [container] },
      querySelectorAll: () => [],
      title: '菜单拆分测试',
      defaultView: {
        // 容器为 pointer 软点击，子项本身非 pointer（点击事件委托在容器上）
        getComputedStyle: (el: unknown) => ({
          display: 'block',
          visibility: 'visible',
          opacity: '1',
          cursor: el === container ? 'pointer' : 'auto',
        }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://bsdt.cdut.edu.cn/xsMainV.htmlx' })

    const names = result.elements.map((e: { name: string }) => e.name)
    // 两个子项各自拿到独立 BID
    expect(names).toContain('学生管理')
    expect(names).toContain('成长计划')
    // 容器聚合名不再作为独立 BID
    expect(names).not.toContain('学生管理 成长计划')
    expect(result.elements).toHaveLength(2)
    const item = result.elements.find((e: { name: string }) => e.name === '成长计划')
    expect(item?.role).toBe('button')
    expect(item?.actionable).toBe(true)
  })

  test('长文本子项的卡片不被拆分（避免把卡片炸成噪声 BID）', () => {
    const longText = '这是一段明显超过二十四个字符阈值的卡片正文描述，不应被拆为独立可点击项。'
    const makeChild = (text: string, top: number) => ({
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top, width: 300, height: 30 }),
      innerText: text,
      textContent: text,
      childNodes: [{ nodeType: 3, nodeValue: text }],
      children: [] as unknown[],
      className: '',
      id: '',
      onclick: null,
      parentElement: null,
    })
    const titleChild = makeChild('课程名', 0)
    const bodyChild = makeChild(longText, 40)
    const card = {
      nodeType: 1,
      tagName: 'DIV',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 120 }),
      innerText: `课程名 ${longText}`,
      textContent: `课程名 ${longText}`,
      childNodes: [] as unknown[],
      children: [titleChild, bodyChild],
      className: 'card',
      id: '',
      onclick: null,
      parentElement: null,
    }
    const doc = {
      body: { querySelectorAll: () => [card] },
      querySelectorAll: () => [],
      title: '卡片测试',
      defaultView: {
        // 仅卡片本身为 pointer；子项非 pointer，故只有「短文本」限制决定是否拆分
        getComputedStyle: (el: unknown) => ({
          display: 'block',
          visibility: 'visible',
          opacity: '1',
          cursor: el === card ? 'pointer' : 'auto',
        }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://bsdt.cdut.edu.cn/xsMainV.htmlx' })
    // 长文本子项超阈值被过滤，可拆子项不足 2 个 → 未触发拆分，卡片本身仍作为单个可点击项保留
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].name).toContain('课程名')
  })
})

describe('渲染内容指纹（URL / 框架不变、仅渲染内容变时仍可检出）', () => {
  function buildPage(nodes: YanhuDistilledPage['nodes'], extras: Partial<YanhuDistilledPage> = {}): YanhuDistilledPage {
    return {
      url: 'https://x/y',
      title: 't',
      digestText: '',
      bidCount: nodes.length,
      nodes,
      timestamp: 0,
      ...extras,
    }
  }

  test('BID 完全一致但渲染文本摘要哈希变化时，指纹必须改变', () => {
    const nodes = [
      { bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 10, height: 10 } },
    ]
    const before = computePageFingerprint(buildPage(nodes, { textDigest: 'aaa' }))
    const after = computePageFingerprint(buildPage(nodes, { textDigest: 'bbb' }))
    expect(before).not.toBe(after)
  })

  test('PageDigest 输出渲染内容摘要，让内容变化对模型可见', () => {
    const text = serializePageDigest({
      url: 'https://x/y',
      title: 't',
      records: [],
      textSample: '提交成功，等待辅导员审批',
    })
    expect(text).toContain('[渲染内容摘要（可见文本，已截断）]')
    expect(text).toContain('提交成功，等待辅导员审批')
  })

  test('采集脚本回传可见渲染文本的摘要与哈希', () => {
    const doc = {
      body: { querySelectorAll: () => [], innerText: '  学号 20201234   状态：待审批  ' },
      querySelectorAll: () => [],
      title: 't',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const runner = new Function('document', 'window', 'location', `return ${buildYanhuCollectorScript()}`)
    const result = runner(doc, doc.defaultView, { href: 'https://x/y' })
    expect(typeof result.textDigest).toBe('string')
    expect(result.textDigest.length).toBeGreaterThan(0)
    expect(result.textSample).toContain('学号 20201234')
  })
})

describe('computePageFingerprint（页面结构指纹）', () => {
  function buildPage(nodes: YanhuDistilledPage['nodes'], url = 'https://jw.cdut.edu.cn/x'): YanhuDistilledPage {
    return { url, title: 't', digestText: '', bidCount: nodes.length, nodes, timestamp: 0 }
  }

  test('结构完全一致时指纹相同', () => {
    const a = buildPage([{ bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 1, height: 1 } }])
    const b = buildPage([{ bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 1, height: 1 } }])
    expect(computePageFingerprint(a)).toBe(computePageFingerprint(b))
  })

  test('结构变化或 URL 变化时指纹不同', () => {
    const a = buildPage([{ bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 1, height: 1 } }])
    const changed = buildPage([
      { bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 1, height: 1 } },
      { bid: 2, role: 'link', name: '首页', tag: 'a', bounds: { x: 0, y: 0, width: 1, height: 1 } },
    ])
    expect(computePageFingerprint(a)).not.toBe(computePageFingerprint(changed))
    expect(computePageFingerprint(a)).not.toBe(computePageFingerprint(buildPage(a.nodes, 'https://jw.cdut.edu.cn/y')))
  })

  test('多要素指纹：BID 控件未变但数据表格内容变化时指纹改变（根除假「无变化」）', () => {
    const nodes: YanhuDistilledPage['nodes'] = [
      { bid: 1, role: 'button', name: '查询', tag: 'button', bounds: { x: 0, y: 0, width: 1, height: 1 } },
    ]
    const before = buildPage(nodes)
    before.dataTables = ['| 课程 | 成绩 |\n| --- | --- |\n| 高等数学 | 90 |']
    const after = buildPage(nodes)
    after.dataTables = ['| 课程 | 成绩 |\n| --- | --- |\n| 高等数学 | 95 |']
    expect(computePageFingerprint(before)).not.toBe(computePageFingerprint(after))
  })

  test('勾选 / 选中态变化时指纹必须改变（勾选态由 value 承载，根除 read_page 误判「无变化」）', () => {
    const unchecked = buildPage([
      { bid: 1, role: 'checkbox', name: '同意条款', tag: 'input', value: '未勾选', bounds: { x: 0, y: 0, width: 1, height: 1 } },
    ])
    const checked = buildPage([
      { bid: 1, role: 'checkbox', name: '同意条款', tag: 'input', value: '已勾选', bounds: { x: 0, y: 0, width: 1, height: 1 } },
    ])
    expect(computePageFingerprint(unchecked)).not.toBe(computePageFingerprint(checked))
  })
})

describe('YanhuDomDistillationEngine（增量投递与 BID 历史回退）', () => {
  function makeCollected(names: string[], url = 'https://jw.cdut.edu.cn/xsMainV.htmlx'): YanhuCollectedPage {
    return {
      url,
      title: '教务',
      elements: names.map((name, i) =>
        makeElement({ name, role: 'link', bounds: { x: i, y: i, width: 80, height: 24 } }),
      ),
    }
  }

  test('markDirty 后 lastValidIndex 仍支持 BID 历史反查（消除 BID 失效冗余重读）', () => {
    const engine = new YanhuDomDistillationEngine()
    engine.distill('tab-1', makeCollected(['菜单A', '菜单B']))
    const record = engine.resolveBidWithFallback('tab-1', 2)
    expect(record?.name).toBe('菜单B')

    engine.markDirty('tab-1')
    expect(engine.getCached('tab-1')).toBeNull()

    const fallback = engine.resolveBidWithFallback('tab-1', 2)
    expect(fallback?.name).toBe('菜单B')
    expect(fallback?.stale).toBe(true)
  })

  test('从未标定的 BID 不产生回退', () => {
    const engine = new YanhuDomDistillationEngine()
    engine.distill('tab-1', makeCollected(['菜单A']))
    expect(engine.resolveBidWithFallback('tab-1', 99)).toBeNull()
  })

  test('Git-Diff 局部增量：仅新增少量可用项时输出紧凑增量而非全量 PageDigest', () => {
    const engine = new YanhuDomDistillationEngine()
    const first = engine.distill('tab-1', makeCollected(['菜单A', '菜单B']))
    const firstDelivery = engine.recordDelivery('tab-1', first)
    expect(firstDelivery.unchanged).toBe(false)
    expect(firstDelivery.diffText).toBeNull()

    const second = engine.distill('tab-1', makeCollected(['菜单A', '菜单B', '课程成绩查询', '等级考试成绩']))
    const secondDelivery = engine.recordDelivery('tab-1', second)
    expect(secondDelivery.unchanged).toBe(false)
    expect(secondDelivery.diffText).toContain('=== [PageDigest: 局部更新] ===')
    expect(secondDelivery.diffText).toContain('[新展开 2 个可用项]')
    expect(secondDelivery.diffText).toContain('课程成绩查询')
    expect(secondDelivery.diffText).toContain('等级考试成绩')
  })

  test('新增项过多或表格变化时退回全量（diffText 为 null）', () => {
    const engine = new YanhuDomDistillationEngine()
    const first = engine.distill('tab-2', makeCollected(['A']))
    engine.recordDelivery('tab-2', first)

    const many = makeCollected(Array.from({ length: 12 }, (_, i) => `新项-${i}`))
    const second = engine.distill('tab-2', many)
    expect(engine.recordDelivery('tab-2', second).diffText).toBeNull()

    const tableBase = engine.distill('tab-2', makeCollected(['A']))
    engine.recordDelivery('tab-2', tableBase)
    const tablePage = engine.distill('tab-2', {
      ...makeCollected(['A', 'B']),
      dataTables: ['| 课程 | 成绩 |\n| --- | --- |\n| 高等数学 | 90 |'],
    })
    expect(engine.recordDelivery('tab-2', tablePage).diffText).toBeNull()
  })

  test('结构完全一致时 recordDelivery 判定 unchanged', () => {
    const engine = new YanhuDomDistillationEngine()
    const page = engine.distill('tab-3', makeCollected(['菜单A']))
    engine.recordDelivery('tab-3', page)
    expect(engine.recordDelivery('tab-3', page).unchanged).toBe(true)
  })
})

describe('日历弹窗节点信息隔离（BUG-48）', () => {
  test('弹窗内散碎日期数字节点不进入候选集，弹窗外的日期输入框仍被采集', () => {
    const popupEl = {
      nodeType: 1,
      tagName: 'DIV',
      className: 'jqx-calendar',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
      innerText: '',
      textContent: '',
      parentElement: null,
    }
    const dayCell = {
      nodeType: 1,
      tagName: 'TD',
      className: 'jqx-calendar-cell',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 10, top: 10, width: 20, height: 20 }),
      innerText: '15',
      textContent: '15',
      parentElement: popupEl,
    }
    const dayCellNoClass = {
      nodeType: 1,
      tagName: 'DIV',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 40, top: 10, width: 20, height: 20 }),
      innerText: '16',
      textContent: '16',
      parentElement: popupEl,
    }
    const dateInput = {
      nodeType: 1,
      tagName: 'INPUT',
      className: '',
      id: '',
      getAttribute: (n: string) => (n === 'type' ? 'text' : n === 'placeholder' ? '开始时间' : ''),
      getBoundingClientRect: () => ({ left: 300, top: 40, width: 180, height: 32 }),
      innerText: '',
      textContent: '',
      value: '',
      parentElement: null,
    }
    const doc = {
      body: { querySelectorAll: () => [popupEl, dayCell, dayCellNoClass, dateInput] },
      querySelectorAll: () => [],
      title: '请假申请',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const script = buildYanhuCollectorScript()
    const runner = new Function('document', 'window', 'location', `return ${script}`)
    const result = runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/xsMainV.htmlx' })

    // 弹窗容器与内部散碎数字节点全部隐身
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].tag).toBe('input')
    expect(result.elements[0].name).toBe('开始时间')
    expect(result.elements.some((e: { name: string }) => e.name === '15' || e.name === '16')).toBe(false)
  })
})

describe('Shadow DOM 穿透采集（现代 Web Components 感知）', () => {
  function runWithHost(host: unknown) {
    const doc = {
      body: { querySelectorAll: (sel: string) => (sel === '*' ? [host] : []) },
      querySelectorAll: () => [],
      title: 'shadow',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const runner = new Function('document', 'window', 'location', `return ${buildYanhuCollectorScript()}`)
    return runner(doc, doc.defaultView, { href: 'https://bsdt.cdut.edu.cn/' })
  }

  test('shadowRoot 内的真实控件被采集为独立 BID（不再因 shadow 边界而失明）', () => {
    const innerBtn = {
      nodeType: 1,
      tagName: 'BUTTON',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 5, top: 5, width: 60, height: 24 }),
      innerText: '提交申请',
      textContent: '提交申请',
      parentElement: null,
      onclick: null,
    }
    const shadowRoot = { querySelectorAll: (sel: string) => (sel === '*' ? [innerBtn] : []), host: null }
    const host = {
      nodeType: 1,
      tagName: 'MY-BUTTON',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 30 }),
      innerText: '',
      textContent: '',
      parentElement: null,
      shadowRoot,
    }
    const result = runWithHost(host)
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].name).toBe('提交申请')
    expect(result.elements[0].role).toBe('button')
    // 影子宿主自身（无名装饰节点）不得占位
    expect(result.elements.some((e: { tag: string }) => e.tag === 'my-button')).toBe(false)
  })

  test('closed 模式 shadowRoot 探测返回 null 时不抛错、正常完成采集', () => {
    const host = {
      nodeType: 1,
      tagName: 'MY-CLOSED',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 30 }),
      innerText: '',
      textContent: '',
      parentElement: null,
      shadowRoot: null,
    }
    const result = runWithHost(host)
    expect(result.elements).toHaveLength(0)
  })
})

describe('结构化空间命名（杜绝网格 / 多列 Flex 跨列串扰）', () => {
  function runWithColumns(formA: unknown, formB: unknown, all: unknown[]) {
    const doc = {
      body: { querySelectorAll: (sel: string) => (sel === '*' ? all : []) },
      querySelectorAll: () => [],
      title: 'grid-form',
      defaultView: {
        // 两个 form-item 容器均被判定为 flex 行（结构化字段作用域）
        getComputedStyle: (el: unknown) =>
          el === formA || el === formB
            ? { display: 'flex', visibility: 'visible', opacity: '1', cursor: 'auto' }
            : { display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' },
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const runner = new Function('document', 'window', 'location', `return ${buildYanhuCollectorScript()}`)
    return runner(doc, doc.defaultView, { href: 'https://jw.cdut.edu.cn/' })
  }

  test('无名输入框仅在自身字段作用域内投影标签，不会被相邻列标签抢占', () => {
    const makeLabel = (text: string, parent: unknown, left: number) => ({
      nodeType: 1,
      tagName: 'SPAN',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left, top: 50, width: 60, height: 20 }),
      innerText: text,
      textContent: text,
      children: [] as unknown[],
      parentElement: parent,
    })
    const makeInput = (parent: unknown, left: number) => ({
      nodeType: 1,
      tagName: 'INPUT',
      className: '',
      id: '',
      getAttribute: (n: string) => (n === 'type' ? 'text' : ''),
      getBoundingClientRect: () => ({ left, top: 45, width: 300, height: 30 }),
      innerText: '',
      textContent: '',
      value: '',
      parentElement: parent,
    })
    const formA = {
      nodeType: 1,
      tagName: 'DIV',
      className: 'form-item',
      id: '',
      getAttribute: () => '',
      innerText: '',
      textContent: '',
      parentElement: null,
      querySelectorAll: () => [] as unknown[],
    }
    const formB = {
      nodeType: 1,
      tagName: 'DIV',
      className: 'form-item',
      id: '',
      getAttribute: () => '',
      innerText: '',
      textContent: '',
      parentElement: null,
      querySelectorAll: () => [] as unknown[],
    }
    const labelA = makeLabel('姓名', formA, 0)
    const inputA = makeInput(formA, 65)
    const labelB = makeLabel('学号', formB, 210)
    const inputB = makeInput(formB, 265)
    // 每个字段容器只暴露自身标签作为候选
    ;(formA as { querySelectorAll: (s: string) => unknown[] }).querySelectorAll = (s: string) =>
      s.indexOf('label') >= 0 ? [labelA] : []
    ;(formB as { querySelectorAll: (s: string) => unknown[] }).querySelectorAll = (s: string) =>
      s.indexOf('label') >= 0 ? [labelB] : []

    const result = runWithColumns(formA, formB, [formA, formB, labelA, inputA, labelB, inputB])
    const elA = result.elements.find((e: { bounds: { x: number } }) => e.bounds.x === 65)
    const elB = result.elements.find((e: { bounds: { x: number } }) => e.bounds.x === 265)
    // 关键：输入框 A 的几何中心更靠近「学号」，但结构化作用域约束下仍绑定自身列标签「姓名」
    expect(elA?.name).toBe('姓名')
    expect(elB?.name).toBe('学号')
  })
})

describe('DOM Clobbering 原型隔离防御（BDD-PARSE-01）', () => {
  function runWith(doc: Record<string, unknown>, location: unknown): {
    url: string
    title: string
    elements: Array<{ name: string }>
    error?: string
  } {
    const runner = new Function('document', 'window', 'location', `return ${buildYanhuCollectorScript()}`)
    return runner(doc, doc.defaultView, location)
  }

  test('页面含 name="title" / id="location" 污染时脚本不抛 TypeError，仍安全解析 PageDigest 与真实 URL', () => {
    const clobberedTitle = { tagName: 'FORM', name: 'title', id: 'title' }
    const linkEl = {
      nodeType: 1,
      tagName: 'A',
      className: '',
      id: '',
      getAttribute: (n: string) => (n === 'href' ? '/jsxsd/framework/xsMainV.htmlx' : ''),
      getBoundingClientRect: () => ({ left: 10, top: 20, width: 100, height: 24 }),
      innerText: '学生管理',
    }
    const doc: Record<string, unknown> = {
      body: { querySelectorAll: (sel: string) => (sel === '*' ? [linkEl] : []) },
      querySelectorAll: () => [],
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'pointer' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    // 模拟被 <form name="title"> 污染的 document.title（返回元素对象而非字符串）
    Object.defineProperty(doc, 'title', { get: () => clobberedTitle })

    const result = runWith(doc, { href: 'https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx' })
    expect(result.error).toBeUndefined()
    expect(result.url).toBe('https://jw.cdut.edu.cn/jsxsd/framework/xsMainV.htmlx')
    expect(result.title).toBe('')
    expect(result.elements.length).toBeGreaterThanOrEqual(1)
    expect(result.elements[0]!.name).toBe('学生管理')
  })

  test('location 被污染（href 非字符串）时安全返回空 URL，绝不抛出 TypeError', () => {
    const doc: Record<string, unknown> = {
      body: { querySelectorAll: () => [] },
      querySelectorAll: () => [],
      title: '正常标题',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
        innerWidth: 800,
        innerHeight: 600,
      },
    }
    const result = runWith(doc, { href: { tagName: 'IMG' } })
    expect(result.error).toBeUndefined()
    expect(result.url).toBe('')
    expect(result.title).toBe('正常标题')
  })
})

describe('闭合 Shadow DOM 宿主探测（CDP 深度补漏标记）', () => {
  function runWithHost(host: unknown): { closedShadowHosts?: string[] } {
    const doc = {
      body: { querySelectorAll: (sel: string) => (sel === '*' ? [host] : []) },
      querySelectorAll: () => [],
      title: 'closed-shadow',
      defaultView: {
        getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', cursor: 'auto' }),
        innerWidth: 1200,
        innerHeight: 800,
      },
    }
    const runner = new Function('document', 'window', 'location', `return ${buildYanhuCollectorScript()}`)
    return runner(doc, doc.defaultView, { href: 'https://bsdt.cdut.edu.cn/' })
  }

  test('自定义元素拿不到 shadowRoot 时被探测打标并回传 closedShadowHosts', () => {
    const host = {
      nodeType: 1,
      tagName: 'X-CLOSED-WIDGET',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 30 }),
      innerText: '',
      shadowRoot: null,
      attachShadow: () => ({}),
    }
    const result = runWithHost(host)
    expect(result.closedShadowHosts).toContain('x-closed-widget')
  })

  test('普通（非自定义）元素不会被误判为闭合 Shadow DOM 宿主', () => {
    const host = {
      nodeType: 1,
      tagName: 'DIV',
      className: '',
      id: '',
      getAttribute: () => '',
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 30 }),
      innerText: '',
      shadowRoot: null,
      attachShadow: () => ({}),
    }
    const result = runWithHost(host)
    expect(result.closedShadowHosts ?? []).toHaveLength(0)
  })
})

