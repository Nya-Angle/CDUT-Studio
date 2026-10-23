import type { ReviewSubject, RuleSpec } from '@profer/shared'

/** 返回规则可检查的事项；带分项的规则不能越界读取其他分项事项。 */
export function subjectsForRule(subjects: ReviewSubject[], rule: RuleSpec): ReviewSubject[] {
  return rule.sectionId ? subjects.filter((subject) => subject.sectionId === rule.sectionId) : subjects
}
