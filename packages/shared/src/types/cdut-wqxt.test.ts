/**
 * AI 问渠学堂页面 URL 判定契约单元测试
 *
 * 覆盖：课堂教学页（`_id` / `&sub_id` / 附加参数 / hash 路由）、课堂选择页根地址、其他页面与非法输入。
 */

import { describe, expect, test } from 'bun:test'
import { isWqxtLivingRoomUrl, isWqxtSelectionUrl, resolveWqxtPageType } from './cdut'

describe('isWqxtLivingRoomUrl', () => {
  test('识别 course_id + _id 的教学页', () => {
    expect(isWqxtLivingRoomUrl('https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123_id=456')).toBe(true)
  })

  test('识别 course_id + sub_id 及附加参数的教学页', () => {
    expect(
      isWqxtLivingRoomUrl('https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123&sub_id=456&foo=1'),
    ).toBe(true)
  })

  test('识别 hash 路由形态的教学页', () => {
    expect(isWqxtLivingRoomUrl('https://classroom.wqxt.cdut.edu.cn/#/livingroom?course_id=123')).toBe(true)
  })

  test('缺少 course_id 的教学页、其他域名与非法输入均不命中', () => {
    expect(isWqxtLivingRoomUrl('https://classroom.wqxt.cdut.edu.cn/livingroom')).toBe(false)
    expect(isWqxtLivingRoomUrl('https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=abc')).toBe(false)
    expect(isWqxtLivingRoomUrl('https://bsdt.cdut.edu.cn/livingroom?course_id=123')).toBe(false)
    expect(isWqxtLivingRoomUrl('')).toBe(false)
    expect(isWqxtLivingRoomUrl('not a url')).toBe(false)
  })
})

describe('isWqxtSelectionUrl', () => {
  test('根地址与 index.html 均视为课堂选择页', () => {
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn')).toBe(true)
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn/')).toBe(true)
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn/index.html')).toBe(true)
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn/#/')).toBe(true)
  })

  test('教学页、其他校内页面与非法输入不算课堂选择页', () => {
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123')).toBe(false)
    expect(isWqxtSelectionUrl('https://classroom.wqxt.cdut.edu.cn/course')).toBe(false)
    expect(isWqxtSelectionUrl('https://bsdt.cdut.edu.cn/')).toBe(false)
    expect(isWqxtSelectionUrl('not a url')).toBe(false)
  })
})

describe('resolveWqxtPageType', () => {
  test('按 livingroom / selection / other 顺序解析', () => {
    expect(resolveWqxtPageType('https://classroom.wqxt.cdut.edu.cn/livingroom?course_id=123_id=456')).toBe(
      'livingroom',
    )
    expect(resolveWqxtPageType('https://classroom.wqxt.cdut.edu.cn/')).toBe('selection')
    expect(resolveWqxtPageType('https://bsdt.cdut.edu.cn/')).toBe('other')
    expect(resolveWqxtPageType('')).toBe('other')
  })
})
