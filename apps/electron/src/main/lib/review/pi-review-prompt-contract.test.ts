import { describe, expect, test } from 'bun:test'
import { piObservationFieldContract } from './pi-review-prompt-contract'

describe('审核提示词的字段契约', () => {
  test('模板无字段时要求 observations 为空，并禁止自造 fieldKey', () => {
    const text = piObservationFieldContract({ fields: [] }, 'case-abc')
    expect(text).toContain('observations 必须省略或为 []')
    expect(text).toContain('不要为对象键、场景、条件、材料名')
  })

  test('模板有字段时逐条列出 key/kind/作用域', () => {
    const text = piObservationFieldContract({
      fields: [
        { key: 'studentName', label: '学生姓名', kind: 'text', required: true, visibility: 'public' },
        { key: 'academicYear', label: '学年', kind: 'text', required: true, visibility: 'public', scope: 'case' },
        { key: 'awardDate', label: '获奖日期', kind: 'date', required: false, visibility: 'public', sectionId: 'awards' },
      ],
    } as never, 'case-abc')
    expect(text).toContain('studentName | text | subject')
    expect(text).toContain('academicYear | text | case（subjectId 必须是 case-abc）')
    expect(text).toContain('awardDate | date | subject（subjectId 必须属于本案、匹配分项） | sectionId=awards')
    expect(text).toContain('禁止添加任何未列出的 fieldKey')
  })

  test('契约里出现的就是模板真值，不额外增删字段', () => {
    const text = piObservationFieldContract({
      fields: [{ key: 'onlyOne', label: '唯一字段', kind: 'text', required: false, visibility: 'public' }],
    } as never, 'case-x')
    const bulletLines = text.split('\n').filter((line) => line.startsWith('- '))
    expect(bulletLines).toHaveLength(1)
    expect(bulletLines[0]).toContain('onlyOne')
  })
})
