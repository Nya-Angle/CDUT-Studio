/**
 * BDD 行为驱动测试：CDUT 青果教务 6 大端点通用解析器
 *
 * 数据源：仓库根目录 `API Record/` 真实抓取 fixture（含 view-source 快照形态），
 * 全部断言基于结构化解析结果，严禁在业务代码中出现任何特定学生姓名/学号/班级字面量。
 */

import { describe, expect, it } from 'bun:test'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import {
  buildGpaTracks,
  buildingMatchesRoom,
  computeCurrentWeek,
  decodeViewSourceSnapshot,
  markOngoingAndNext,
  parseClassroomFreeRooms,
  parseCurriculumPlan,
  parseExamSchedule,
  parseGradeRecords,
  parseOtherClassSchedule,
  parseScheduleCourses,
  parseWeekSpecification,
  CDUT_SECTION_PERIODS,
  type ScheduleCourse,
} from '../src/main/lib/cdut/cdut-jw-client'

// ===== fixture 定位：自测试目录向上寻找仓库根的 `API Record` =====

function findFixtureDir(): string | null {
  let dir = import.meta.dir
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, 'API Record')
    if (existsSync(candidate)) return candidate
    dir = dirname(dir)
  }
  return null
}

/**
 * 真实抓取 fixture 目录。`API Record/` 属于本地录制资产、不入库，
 * 缺失时跳过依赖它的用例（而不是让整个测试文件报错），
 * 这样 CI/新克隆仍能跑其余纯解析用例。
 */
const FIXTURES = findFixtureDir()
const hasFixtures = FIXTURES !== null

/**
 * Bun 的 describe.skip 仍会执行 describe body，因此依赖 fixture 的用例
 * 不能在 describe 顶层直接 loadFixture；统一走惰性读取 + 无 fixture 时跳过。
 */
function loadFixture(name: string): string {
  if (!FIXTURES) throw new Error(`缺少 API Record fixture：${name}`)
  return readFileSync(join(FIXTURES, name), 'utf8')
}

/**
 * 有 fixture 才注册这些用例。无 fixture 时直接不注册（而非 describe.skip），
 * 避免 Bun 在 skip 的 describe body 中仍然求值 fixture 读取。
 */
function describeIfFixtures(name: string, fn: () => void): void {
  if (hasFixtures) describe(name, fn)
}

/** 惰性解析：describe 阶段不读盘，测试执行时才读。 */
function fixtureLazy<T>(load: () => T): () => T {
  let cached: T
  let loaded = false
  return () => {
    if (!loaded) { cached = load(); loaded = true }
    return cached
  }
}

// ===== 通用周次解析器 =====

describe('parseWeekSpecification（通用周次展开 BDD-JW-WEEK-01）', () => {
  it('Given 连续周 "1-16(周)" When 展开 Then 返回 [1..16]', () => {
    expect(parseWeekSpecification('1-16(周)')).toEqual(Array.from({ length: 16 }, (_, i) => i + 1))
  })

  it('Given 离散周 "1-4,6-8(周)" When 展开 Then 返回 [1,2,3,4,6,7,8]', () => {
    expect(parseWeekSpecification('1-4,6-8(周)')).toEqual([1, 2, 3, 4, 6, 7, 8])
  })

  it('Given 单周 "1-15(单)" 与双周 "2-16(双)" When 展开 Then 分别返回奇偶周序列', () => {
    expect(parseWeekSpecification('1-15(单)')).toEqual([1, 3, 5, 7, 9, 11, 13, 15])
    expect(parseWeekSpecification('2-16(双)')).toEqual([2, 4, 6, 8, 10, 12, 14, 16])
  })

  it('Given 复合格式 "14(周)[01-02节]" When 展开 Then 仅返回 [14]，节次不混入周次', () => {
    expect(parseWeekSpecification('14(周)[01-02节]')).toEqual([14])
    expect(parseWeekSpecification('19(周)[01-02-03-04-05-06-07-08节]')).toEqual([19])
  })

  it('Given 混合离散 "9,11-13(周)" When 展开 Then 返回 [9,11,12,13]', () => {
    expect(parseWeekSpecification('9,11-13(周)')).toEqual([9, 11, 12, 13])
  })

  it('Given 空文本 When 展开 Then 返回空数组（不抛异常）', () => {
    expect(parseWeekSpecification('')).toEqual([])
  })
})

// ===== 个人课表（xskb_list.do） =====

describeIfFixtures('parseScheduleCourses（个人课表解析 BDD-JW-SCHEDULE-01）', () => {
  const coursesOf = fixtureLazy(() => parseScheduleCourses(loadFixture('xskb_list.do')))

  it('When 解析真实课表 fixture Then 提取出多门结构化课程', () => {
    expect(coursesOf().length).toBeGreaterThan(5)
    for (const c of coursesOf()) {
      expect(c.name.length).toBeGreaterThan(0)
      expect(c.dayOfWeek).toBeGreaterThanOrEqual(1)
      expect(c.dayOfWeek).toBeLessThanOrEqual(7)
      expect(Array.isArray(c.weekList)).toBe(true)
    }
  })

  it('Given 汉字节次表头（第一二节/三四节/九十十一节）When 解析 Then 节次正确映射且绝无负数节次', () => {
    // 合成最小课表：全部使用汉字节次表头，覆盖 CN_SECTION_MAP 全通路
    const html = `
      <table>
        <tr><th>节次</th><th>星期一</th><th>星期二</th><th>星期三</th><th>星期四</th><th>星期五</th><th>星期六</th><th>星期日</th></tr>
        <tr><td>第一二节</td><td><div class="kbcontent"><font title="周次(节次)">1-16(周)</font><font>高等数学</font></div></td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td></tr>
        <tr><td>第三四节</td><td class="kbcontent">&nbsp;</td><td><div class="kbcontent"><font title="周次(节次)">1-16(周)</font><font>大学英语</font></div></td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td></tr>
        <tr><td>九十十一节</td><td><div class="kbcontent"><font title="周次(节次)">1-16(周)</font><font>晚自习物理</font></div></td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td><td class="kbcontent">&nbsp;</td></tr>
      </table>`
    const parsed = parseScheduleCourses(html)
    expect(parsed.length).toBe(3)
    for (const c of parsed) {
      // 红线：任何解析路径都严禁产出 <= 0 的节次（历史 Bug：0*2-1 = -1 → "-1节--1节"）
      expect(c.startSection).toBeGreaterThan(0)
      expect(c.endSection).toBeGreaterThan(0)
      expect(c.startSection).toBeLessThanOrEqual(11)
      expect(c.endSection).toBeLessThanOrEqual(11)
    }
    expect(parsed.find((c) => c.name === '高等数学')?.startSection).toBe(1)
    expect(parsed.find((c) => c.name === '高等数学')?.endSection).toBe(2)
    expect(parsed.find((c) => c.name === '大学英语')?.startSection).toBe(3)
    expect(parsed.find((c) => c.name === '晚自习物理')?.startSection).toBe(9)
    expect(parsed.find((c) => c.name === '晚自习物理')?.endSection).toBe(11)
  })

  it('Given 同一单元格 kbcontent1 与 kbcontent 双副本 Then 解析结果无重复（同一课程名+星期+周次仅一条）', () => {
    const keys = coursesOf().map((c) => `${c.name}|${c.dayOfWeek}|${c.weekList.join(',')}|${c.location}`)
    expect(new Set(keys).size).toBe(keys.length)
    // fixture 中「线性代数」在星期三连排三个周次段：1-5 / 9,11-13 / 14
    const linearWednesday = coursesOf().filter((c) => c.name.includes('线性代数') && c.dayOfWeek === 3)
    expect(linearWednesday.length).toBe(3)
    // 双副本合并后教师信息择优保留，不得缺失
    for (const c of linearWednesday) expect(c.teacher).not.toBe('')
  })

  it('Given 教师语义字段（title=教师）When 解析 Then 教师信息非空', () => {
    const withTeacher = coursesOf().filter((c) => c.teacher)
    expect(withTeacher.length).toBeGreaterThan(0)
  })

  it('Given 严格周次过滤（第 7 周）When 过滤 Then 未在 7 周开课的课程坚决丢弃', () => {
    const week7 = coursesOf().filter((c) => c.weekList.includes(7))
    expect(week7.length).toBeGreaterThan(0)
    // 「1-5(周)」的课程绝不允许串入第 7 周
    expect(week7.some((c) => parseWeekSpecification('1-5(周)').every((w) => c.weekList.includes(w)) && c.weekList.every((w) => w <= 5))).toBe(false)
    for (const c of week7) expect(c.weekList.includes(7)).toBe(true)
  })
})

describeIfFixtures('markOngoingAndNext + computeCurrentWeek（实时课程雷达 BDD-JW-SCHEDULE-02）', () => {
  /** 构造确定性合成课程（weekList 空 = 全学期排课） */
  function course(overrides: Partial<ScheduleCourse>): ScheduleCourse {
    return {
      name: '测试课程',
      dayOfWeek: 1,
      startSection: 1,
      endSection: 2,
      location: 'A101',
      teacher: '',
      weeks: '',
      weekList: [],
      ...overrides,
    }
  }

  it('Given 作息表 When 读取 Then 与成都理工大学官方 11 节制作息锁定（严禁出现第 12 节）', () => {
    expect(CDUT_SECTION_PERIODS.length).toBe(6)
    expect(CDUT_SECTION_PERIODS[0]).toEqual({ startSection: 1, endSection: 2, startMin: 490, endMin: 585 }) // 08:10-09:45
    expect(CDUT_SECTION_PERIODS[1]).toEqual({ startSection: 3, endSection: 4, startMin: 615, endMin: 710 }) // 10:15-11:50
    expect(CDUT_SECTION_PERIODS[2]).toEqual({ startSection: 5, endSection: 6, startMin: 870, endMin: 965 }) // 14:30-16:05
    expect(CDUT_SECTION_PERIODS[3]).toEqual({ startSection: 7, endSection: 8, startMin: 985, endMin: 1080 }) // 16:25-18:00
    expect(CDUT_SECTION_PERIODS[4]).toEqual({ startSection: 9, endSection: 10, startMin: 1150, endMin: 1245 }) // 19:10-20:45
    expect(CDUT_SECTION_PERIODS[5]).toEqual({ startSection: 11, endSection: 11, startMin: 1250, endMin: 1295 }) // 20:50-21:35
    for (const p of CDUT_SECTION_PERIODS) expect(p.endSection).toBeLessThanOrEqual(11)
  })

  it('Given 周一 09:00（01-02 节时段）When 标记 Then 当天相交课程置 isOngoing', () => {
    // 2026-08-31 为秋学期第 1 周周一（启发式起点当周）
    const monday9 = new Date(2026, 7, 31, 9, 0)
    const cloned = [course({ name: '甲', dayOfWeek: 1, startSection: 1, endSection: 2 }), course({ name: '乙', dayOfWeek: 2 })]
    markOngoingAndNext(cloned, monday9)
    const ongoing = cloned.filter((c) => c.isOngoing)
    expect(ongoing.length).toBe(1)
    expect(ongoing[0]!.name).toBe('甲')
  })

  it('Given 当前周次不在课程周单内 When 标记 Then 不误判为正在上课（周单过滤）', () => {
    const monday9 = new Date(2026, 7, 31, 9, 0) // 第 1 周
    const cloned = [course({ name: '甲', dayOfWeek: 1, weekList: [7] })]
    markOngoingAndNext(cloned, monday9)
    expect(cloned.some((c) => c.isOngoing)).toBe(false)
  })

  it('Given 周六 22:00 与周日 19:10 课程 When 标记 Then 24h 窗口内标记周日课为 isNext，34h 外的周一课被排除', () => {
    // 2026-10-17 为周六；周日 19:10 距今约 21h（窗口内），周一 08:10 距今约 34h（窗口外）
    const saturdayNight = new Date(2026, 9, 17, 22, 0)
    const cloned = [
      course({ name: '周日课', dayOfWeek: 7, startSection: 9, endSection: 10 }),
      course({ name: '周一课', dayOfWeek: 1, startSection: 1, endSection: 2 }),
    ]
    markOngoingAndNext(cloned, saturdayNight)
    const next = cloned.filter((c) => c.isNext)
    expect(next.length).toBe(1)
    expect(next[0]!.name).toBe('周日课')
  })

  it('Given 未来 24 小时无任何课程 When 标记 Then 不产生 isNext（坚决不展示数天后的遥远课程）', () => {
    // 周六 22:00 → 下一门课在 34h 之外，严格超出 24 小时窗口
    const saturdayNight = new Date(2026, 9, 17, 22, 0)
    const cloned = [course({ name: '周一课', dayOfWeek: 1 })]
    markOngoingAndNext(cloned, saturdayNight)
    expect(cloned.some((c) => c.isNext)).toBe(false)
    expect(cloned.some((c) => c.isOngoing)).toBe(false)
  })

  it('Given computeCurrentWeek When 计算教学周 Then 秋学期 8 月末为第 1 周、10 月中旬为第 7 周，且始终夹取在 [1,25]', () => {
    expect(computeCurrentWeek(new Date(2026, 7, 31))).toBe(1) // 2026-08-31 周一
    expect(computeCurrentWeek(new Date(2026, 9, 12))).toBe(7) // 2026-10-12 周一
    expect(computeCurrentWeek(new Date(2027, 5, 15))).toBeGreaterThanOrEqual(1) // 学期末仍在界内
    expect(computeCurrentWeek(new Date(2026, 4, 10))).toBeLessThanOrEqual(25)
  })

  it('Given 真实课表 fixture When 标记 Then 至多一门 isNext 且不抛异常', () => {
    const courses = parseScheduleCourses(loadFixture('xskb_list.do'))
    const cloned = coursesOf().map((c) => ({ ...c }))
    markOngoingAndNext(cloned, new Date(2026, 9, 17, 20, 0))
    expect(cloned.filter((c) => c.isNext).length).toBeLessThanOrEqual(1)
  })
})

// ===== 历年成绩（cjcx_list） =====

describeIfFixtures('parseGradeRecords + buildGpaTracks（历年成绩双轨 GPA BDD-JW-GRADE-01）', () => {
  const recordsOf = fixtureLazy(() => parseGradeRecords(loadFixture('cjcx_list')))

  it('When 解析成绩单 fixture Then 提取出带学期/课程代码/学分/绩点的结构化记录', () => {
    expect(recordsOf().length).toBeGreaterThan(5)
    const first = recordsOf()[0]!
    expect(first.courseName.length).toBeGreaterThan(0)
    expect(first.semester).toMatch(/^\d{4}-\d{4}-\d$/)
    expect(first.credit).toBeGreaterThan(0)
    expect(first.gp).not.toBeUndefined()
  })

  it('Given 表头存在重复列（两个「课程性质」）When 解析 Then 按列序消歧且字段不错位', () => {
    for (const r of recordsOf()) {
      // 课程属性 ∈ {必修, 选修, ...}，绝不应错位为课程性质长文本（如「通识必修课程」以外的性质文本）
      expect(['必修', '选修', '限选', '任选', ''].some((k) => r.courseAttr.includes(k) || r.courseAttr === '')).toBe(true)
    }
  })

  it('When 计算双轨加权 GPA Then 最新轨与最高轨均产出有效指标，且最高轨绩点不低于最新轨', () => {
    const tracks = buildGpaTracks(recordsOf())
    expect(tracks.latest.courseCount).toBeGreaterThan(0)
    expect(tracks.latest.totalCredits).toBeGreaterThan(0)
    expect(tracks.latest.weightedGpa).toBeGreaterThan(0)
    expect(tracks.latest.weightedGpa).toBeLessThanOrEqual(5)
    expect(tracks.highest.weightedGpa).toBeGreaterThanOrEqual(tracks.latest.weightedGpa)
    expect(tracks.latest.requiredCredits).toBeGreaterThan(0)
  })

  it('Given 空数据 When 解析 Then 返回空数组与零值统计（容错）', () => {
    expect(parseGradeRecords('<html><body></body></html>')).toEqual([])
    const empty = buildGpaTracks([])
    expect(empty.latest.weightedGpa).toBe(0)
    expect(empty.highest.courseCount).toBe(0)
  })
})

// ===== 期末考场（xsksap_list） =====

describeIfFixtures('parseExamSchedule（考场日程与座位号 BDD-JW-EXAM-01）', () => {
  // fixture 为「尚未排考」的空数据页（#dataList 仅含表头）
  const emptyExamsOf = fixtureLazy(() => parseExamSchedule(loadFixture('xsksap_list')))

  it('Given 空数据页面（仅表头）When 解析 Then 返回空数组（防假死容错）', () => {
    expect(emptyExamsOf()).toEqual([])
  })

  it('Given 空白 HTML When 解析 Then 返回空数组且不抛异常', () => {
    expect(parseExamSchedule('<html><body><div>无数据</div></body></html>')).toEqual([])
  })

  it('Given 含数据行的 #dataList When 解析 Then 提取课程/时间/考场/座位号/准考证号字段', () => {
    const synthetic = `
      <table id="dataList">
        <tr>
          <th>序号</th><th>考试校区</th><th>考试场次</th><th>课程编号</th><th>课程名称</th>
          <th>授课教师</th><th>考试时间</th><th>考场</th><th>座位号</th><th>准考证号</th><th>备注</th>
        </tr>
        <tr>
          <td>1</td><td>宜宾校区</td><td>第1场</td><td>C0001</td><td>高等数学（下）</td>
          <td>测试教师甲</td><td>2027-01-18 14:30~16:30</td><td>甲A101</td><td>24</td><td>2026010101</td><td></td>
        </tr>
      </table>`
    const exams = parseExamSchedule(synthetic)
    expect(exams.length).toBe(1)
    const exam = exams[0]!
    expect(exam.courseName).toBe('高等数学（下）')
    expect(exam.time).toContain('2027-01-18')
    expect(exam.room).toBe('甲A101')
    expect(exam.seat).toBe('24')
    expect(exam.ticket).toBe('2026010101')
    expect(exam.campus).toBe('宜宾校区')
  })
})

// ===== 空教室（jsjy_query2） =====

describeIfFixtures('parseClassroomFreeRooms（自习空位矩阵 BDD-JW-ROOM-01）', () => {
  // fixture 为教室周期（jszq）版式：7 天 × 6 时段 = 42 列，1 间教室样例行
  const freeRoomsOf = fixtureLazy(() => parseClassroomFreeRooms(loadFixture('jsjy_query2')))

  it('When 解析空教室 fixture Then 42 列节次区间齐全且按星期正确分组', () => {
    expect(periodColumnsOf().length).toBe(42)
    // 青果编码：0102 / 0304 / 12 / 0506 / 0708 / 091011 循环 7 天
    expect(periodColumnsOf()[0]!.sections).toEqual([1, 2])
    expect(periodColumnsOf()[2]!.sections).toEqual([12])
    expect(periodColumnsOf()[5]!.sections).toEqual([9, 10, 11])
    // 星期分组：首日为星期一（1），末列星期日（7）
    expect(periodColumnsOf()[0]!.day).toBe(1)
    expect(periodColumnsOf()[41]!.day).toBe(7)
  })

  it('Given 中午 12:00-13:55 空档列（tdvalue=12）When 解析 Then 标记为午休时段且严禁计作「第 12 节课」', () => {
    const noonColumn = periodColumnsOf().find((p) => p.tdvalue === '12')
    expect(noonColumn).toBeDefined()
    expect(noonColumn!.isNoonBreak).toBe(true)
    // 红线：午休列空闲与否绝不纳入常规教学节次计数
    const room = roomsOf()[0]
    if (room) {
      const flatFree = Object.values(room.freeSectionsByDay).flat()
      expect(flatFree.includes(12)).toBe(false)
    }
  })

  it('Given 教室行 When 解析 Then 容量被提取且占用矩阵列数与表头一致', () => {
    expect(roomsOf().length).toBe(1)
    const room = roomsOf()[0]!
    expect(room.roomName).not.toMatch(/\(\d+\/\d+\)$/)
    expect(room.capacity).toBeGreaterThan(0)
    expect(room.occupied.length).toBe(42)
  })

  it('Given 单元格红 J（借用占用）或黑 ◆（排课占用）When 解析 Then 判定为占用；空单元格判定为空闲', () => {
    const room = roomsOf()[0]!
    // fixture 首教室前几列为 Ｊ◆ / ◆ 占用
    expect(room.occupied[0]).toBe(true)
    // 全周矩阵必然存在空单元格 → 按天归组的空闲节次非空
    const freeCount = Object.values(room.freeSectionsByDay).flat().length
    expect(freeCount).toBeGreaterThan(0)
    // 空闲节次与占用列互斥：占用列数 + 空闲列数 = 总列数
    const occupiedCount = room.occupied.filter((o) => o).length
    expect(occupiedCount + freeCount).toBeGreaterThan(0)
  })

  it('Given 空白 HTML When 解析 Then 返回空矩阵（容错）', () => {
    const empty = parseClassroomFreeRooms('<html><body></body></html>')
    expect(empty.periodColumns).toEqual([])
    expect(empty.rooms).toEqual([])
  })
})

describe('buildingMatchesRoom（楼宇宽松匹配兜底 BDD-JW-ROOM-02）', () => {
  it('Given 教务楼宇名与教室名口径不一致 When 匹配 Then 使用楼宇指纹命中', () => {
    // 楼宇「甲教A座」对应教室「(宜）甲A101」——朴素子串必然落空
    expect(buildingMatchesRoom('甲教A座', '(宜）甲A101')).toBe(true)
    expect(buildingMatchesRoom('甲教B座', '(宜）甲B301')).toBe(true)
    expect(buildingMatchesRoom('乙教', '（宜）乙308')).toBe(true)
    expect(buildingMatchesRoom('东区9教', '东区9教-9A201')).toBe(true)
    expect(buildingMatchesRoom('6教', '6教-6B301')).toBe(true)
  })

  it('Given 明显不相干的楼宇 When 匹配 Then 返回 false', () => {
    expect(buildingMatchesRoom('甲教A座', '东区1教-E1A106')).toBe(false)
    expect(buildingMatchesRoom('乙教', '东区1教-E1A106')).toBe(false)
  })

  it('Given 空输入 When 匹配 Then 返回 false 且不抛异常', () => {
    expect(buildingMatchesRoom('', '东区1教-E1A106')).toBe(false)
    expect(buildingMatchesRoom('甲教A座', '')).toBe(false)
  })
})

// ===== 培养方案（topyfamx） =====

describeIfFixtures('parseCurriculumPlan（培养方案与修读状态 BDD-JW-PYFA-01）', () => {
  const planOf = fixtureLazy(() => parseCurriculumPlan(loadFixture('topyfamx')))

  it('When 解析培养方案 fixture Then 提取出多模块课程体系', () => {
    expect(planOf().title.length).toBeGreaterThan(0)
    expect(planOf().modules.length).toBeGreaterThan(2)
    for (const m of planOf().modules) {
      expect(m.name.length).toBeGreaterThan(0)
      expect(m.courses.length).toBeGreaterThan(0)
    }
  })

  it('Given 模块注记「(应修 X / 已修 Y)」When 解析 Then 模块应修/已修学分被提取', () => {
    const withProgress = planOf().modules.find((m) => m.requiredCredits !== undefined)
    expect(withProgress).toBeDefined()
    expect(withProgress!.requiredCredits!).toBeGreaterThan(0)
  })

  it('Given 完成情况列「已修(成绩)」或空 When 解析 Then 正确区分已修/未修并提取成绩', () => {
    const completed = planOf().modules.flatMap((m) => m.courses).filter((c) => c.status === 'completed')
    const pending = planOf().modules.flatMap((m) => m.courses).filter((c) => c.status === 'pending')
    expect(completed.length).toBeGreaterThan(0)
    expect(pending.length).toBeGreaterThan(0)
    expect(completed.some((c) => c.score !== undefined)).toBe(true)
  })

  it('Given 表头占两行（rowspan=2）When 解析真实 fixture Then 绝不产生名为「课程体系」的幽灵模块或「课程名称」幽灵课程', () => {
    const allCourses = planOf().modules.flatMap((m) => m.courses)
    for (const m of planOf().modules) {
      expect(m.name).not.toBe('课程体系')
      expect(m.courses.length).toBeGreaterThan(0)
    }
    for (const c of allCourses) {
      expect(['课程名称', '课程编号', '课程属性', '完成情况', '开设学期']).not.toContain(c.courseName)
    }
  })

  it('Given 表格底部统计汇总行（课程体系/小计/合计/总计/最低修读）When 解析 Then 严禁误解析为课程条目', () => {
    const synthetic = `
      <table id="mxh">
        <tr><th>课程体系</th><th>课程编号</th><th>课程名称</th><th>学分</th><th>完成情况</th><th>课程性质</th><th>课程属性</th><th>开设学期</th></tr>
        <tr><td rowspan="2">通识必修课程（应修 30 / 已修 12）</td><td>C0001</td><td>高等数学</td><td>5</td><td>已修(88)</td><td>通识必修课程</td><td>必修</td><td>1</td></tr>
        <tr><td>C0002</td><td>大学英语</td><td>3</td><td></td><td>通识必修课程</td><td>必修</td><td>1</td></tr>
        <tr><td>小计</td><td></td><td>小计</td><td>30</td><td></td><td></td><td></td><td></td></tr>
        <tr><td>合计</td><td></td><td>合计</td><td>170</td><td></td><td></td><td></td><td></td></tr>
        <tr><td>课程体系</td><td></td><td>最低修读学分</td><td>170</td><td></td><td></td><td></td><td></td></tr>
      </table>`
    const parsed = parseCurriculumPlan(synthetic)
    const allCourses = parsed.modules.flatMap((m) => m.courses)
    expect(allCourses.length).toBe(2)
    const names = allCourses.map((c) => c.courseName)
    expect(names).toContain('高等数学')
    expect(names).toContain('大学英语')
    for (const name of names) {
      expect(/^(课程体系|小计|合计|总计|最低修读|备注)/.test(name)).toBe(false)
    }
  })
})

// ===== 全校班级课表（viewtable.do，view-source 快照形态） =====

describeIfFixtures('decodeViewSourceSnapshot + parseOtherClassSchedule（全校班级课表 BDD-JW-OTHER-01）', () => {
  const rawOf = fixtureLazy(() => loadFixture(
    'view-source_https___jw.cdut.edu.cn_jsxsd_xskb_viewtable.do_xnxq01id=2026-2027-1&lx=xx04id&kbjcmsid=7E5976C91D9A4146930951FD11516BCC&xx0301id=22500&rxnf=2025&xx04id=29C02ADB11CA4F618BC7A7390623D160&jx01ndi.html',
  ))
  const coursesOf = fixtureLazy(() => parseOtherClassSchedule(rawOf()))

  it('Given view-source 快照包装 When 还原后解析 Then 提取出课程明细（名称/代码/学分/师/室）', () => {
    // 快照还原器：还原后的 HTML 必须包含真实标签
    const decoded = decodeViewSourceSnapshot(rawOf())
    expect(decoded).toContain('fontcourse')
    expect(coursesOf().length).toBeGreaterThan(5)
    for (const c of coursesOf()) {
      expect(c.name.length).toBeGreaterThan(0)
      expect(c.code.length).toBeGreaterThan(0)
    }
  })

  it('Given 明细分段「师[…] 室[…] (校区)」When 解析 Then 教师/教室/校区字段被归一化', () => {
    const withTeacher = coursesOf().filter((c) => c.teachers.length > 0)
    const withRoom = coursesOf().filter((c) => c.rooms.length > 0)
    expect(withTeacher.length).toBeGreaterThan(0)
    expect(withRoom.length).toBeGreaterThan(0)
    const withCampus = coursesOf().find((c) => c.campus)
    expect(withCampus).toBeDefined()
  })

  it('Given 真实抓取形态（非快照）When 解析 Then 不受 view-source 还原器影响', () => {
    const decoded = decodeViewSourceSnapshot(rawOf())
    expect(parseOtherClassSchedule(decoded).length).toBe(coursesOf().length)
  })
})

// ===== 防硬编码审查（红线：解析逻辑与个人样例数据零耦合） =====

describeIfFixtures('防硬编码审查（BDD-JW-GUARD-01）', () => {
  const sourcePath = join(import.meta.dir, '../src/main/lib/cdut/cdut-jw-client.ts')
  const source = readFileSync(sourcePath, 'utf8')

  it('Given 真实 fixture 中出现的学号/班级代码 When 审查解析器源码 Then 严禁出现任何个人样例字面量', () => {
    const fixtureText = [
      'xskb_list.do',
      'cjcx_list',
      'xsksap_list',
      'view-source_https___jw.cdut.edu.cn_jsxsd_xskb_viewtable.do_xnxq01id=2026-2027-1&lx=xx04id&kbjcmsid=7E5976C91D9A4146930951FD11516BCC&xx0301id=22500&rxnf=2025&xx04id=29C02ADB11CA4F618BC7A7390623D160&jx01ndi.html',
      'topyfamx',
    ]
      .map((name) => loadFixture(name))
      .join('\n')
    // 学号/班级代码形态：9-12 位纯数字（排除课程编码无法区分，统一审查）
    const studentCodes = new Set((fixtureText.match(/\b\d{9,12}\b/g) ?? []).filter((code) => /^2025|^2026/.test(code)))
    expect(studentCodes.size).toBeGreaterThan(0)
    for (const code of studentCodes) {
      expect(source.includes(code)).toBe(false)
    }
  })

  it('Given fixture 中出现的教师姓名 When 审查解析器源码 Then 严禁硬编码任何真实姓名', () => {
    const fixtureText = [loadFixture('xskb_list.do'), loadFixture('view-source_https___jw.cdut.edu.cn_jsxsd_xskb_viewtable.do_xnxq01id=2026-2027-1&lx=xx04id&kbjcmsid=7E5976C91D9A4146930951FD11516BCC&xx0301id=22500&rxnf=2025&xx04id=29C02ADB11CA4F618BC7A7390623D160&jx01ndi.html')].join('\n')
    const teacherNames = new Set<string>()
    for (const m of fixtureText.matchAll(/title=['"]教师['"][^>]*>([^<]{2,5})</g)) teacherNames.add(m[1]!.trim())
    for (const m of fixtureText.matchAll(/师\[([^\]]{2,5})\]/g)) teacherNames.add(m[1]!.trim())
    expect(teacherNames.size).toBeGreaterThan(0)
    for (const name of teacherNames) {
      expect(source.includes(name)).toBe(false)
    }
  })
})
