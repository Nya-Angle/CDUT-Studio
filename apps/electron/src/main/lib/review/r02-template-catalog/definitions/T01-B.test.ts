import { describe, expect, test } from "bun:test"
import { validateTemplate } from "../../template-store"
import { T01T06_TEMPLATE, r02Metadata as metaT01T06 } from "./T01-T06"
import { T01T07_TEMPLATE, r02Metadata as metaT01T07 } from "./T01-T07"
import { T01T08_TEMPLATE, r02Metadata as metaT01T08 } from "./T01-T08"
import { T01T09_TEMPLATE, r02Metadata as metaT01T09 } from "./T01-T09"

const cases = [
  { template: T01T06_TEMPLATE, metadata: metaT01T06, id: "T01-T06", name: "课程考核方式、考核方案调整审核" },
  { template: T01T07_TEMPLATE, metadata: metaT01T07, id: "T01-T07", name: "教师成绩录入延期申请审核" },
  { template: T01T08_TEMPLATE, metadata: metaT01T08, id: "T01-T08", name: "教师发起的课程成绩更正材料审核" },
  { template: T01T09_TEMPLATE, metadata: metaT01T09, id: "T01-T09", name: "实验教学、实习与实践教学安排变更审核" },
] as const

describe("R02 T01-B native template definitions", () => {
  test("IDs and official names are correct and unique", () => {
    expect(new Set(cases.map(x => x.id)).size).toBe(cases.length)
    expect(new Set(cases.map(x => x.name)).size).toBe(cases.length)
    for (const entry of cases) {
      expect(entry.template.templateId).toBe(entry.id)
      expect(entry.template.name).toBe(entry.name)
      expect(entry.template.schemaVersion).toBe(2)
      expect(entry.template.catalogKind).toBe("builtin")
      expect(entry.template.status).toBe("draft")
      expect(entry.template.description).toContain("本地研究模板 · 非校方正式模板")
      expect(entry.template.sourceNote?.startsWith("R02_RESEARCH_TEMPLATE_NONOFFICIAL:")).toBe(true)
    }
  })

  test("TemplateVersion validation has no errors and all references are stable", () => {
    for (const entry of cases) {
      const issues = validateTemplate(entry.template)
      expect(issues.filter(issue => issue.level === "error")).toEqual([])
      const sectionIds = new Set((entry.template.sections ?? []).map(section => section.id))
      const fieldKeys = entry.template.fields.map(field => field.key)
      const slotIds = entry.template.materialSlots.map(slot => slot.id)
      const criterionIds = (entry.template.sections ?? []).flatMap(section => section.criteria.map(criterion => criterion.id))
      expect(new Set(fieldKeys).size).toBe(fieldKeys.length)
      expect(new Set(slotIds).size).toBe(slotIds.length)
      expect(new Set(criterionIds).size).toBe(criterionIds.length)
      for (const field of entry.template.fields) if (field.sectionId) expect(sectionIds.has(field.sectionId)).toBe(true)
      for (const slot of entry.template.materialSlots) if (slot.sectionId) expect(sectionIds.has(slot.sectionId)).toBe(true)
      for (const section of entry.template.sections ?? []) {
        for (const criterion of section.criteria) {
          expect(criterion.id).toMatch(/^R\d{3}$/)
          expect(["semantic", "manual"]).toContain(criterion.execution)
          for (const ref of criterion.requirement.match(/\bF\d{3}\b/g) ?? []) expect(fieldKeys).toContain(ref)
          for (const ref of criterion.requirement.match(/\bM\d{3}\b/g) ?? []) expect(slotIds).toContain(ref)
        }
      }
    }
  })

  test("source metadata covers every criterion and every SRC ID; source hash is traceable", () => {
    for (const entry of cases) {
      const { metadata } = entry
      expect(metadata.templateId).toBe(entry.id)
      expect(metadata.name).toBe(entry.name)
      expect(metadata.officialSchoolTemplate).toBe(false)
      expect(metadata.sourceDocumentPath).toContain(`research-original/${entry.id}.md`)
      expect(metadata.reviewedDocumentPath).toContain(`R02/${entry.id}.md`)
      expect(metadata.sourceDocumentSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(metadata.sourceDocumentBytes).toBeGreaterThan(0)
      expect(metadata.policyEvidenceStatus).toBe("PARTIAL")
      const templateCriteria = new Set((entry.template.sections ?? []).flatMap(section => section.criteria.map(criterion => `${section.id}:${criterion.id}`)))
      expect(Number(metadata.criteria.length)).toBe(templateCriteria.size)
      for (const mapped of metadata.criteria) {
        expect(templateCriteria.has(`${mapped.sectionId}:${mapped.criterionId}`)).toBe(true)
        expect(["VERIFIED", "PARTIAL", "UNCONFIRMED"]).toContain(mapped.evidenceStatus)
        for (const srcId of mapped.sourceIds) expect(metadata.sources.some(source => source.id === srcId)).toBe(true)
      }
    }
  })

  test("stage graph is reachable and acyclic, including return targets", () => {
    for (const entry of cases) {
      const stages = entry.template.stages
      const byId = new Map(stages.map(stage => [stage.id, stage] as const))
      expect(new Set(stages.map(stage => stage.id)).size).toBe(stages.length)
      expect(stages.length).toBeGreaterThan(0)
      expect(stages.every(stage => stage.workflowOwner === "local")).toBe(true)
      for (const stage of stages) {
        if (stage.nextStageId) expect(byId.has(stage.nextStageId)).toBe(true)
        if (stage.returnToStageId) expect(byId.has(stage.returnToStageId)).toBe(true)
      }
      const seen = new Set<string>()
      let current: string | undefined = stages[0]?.id
      while (current) {
        expect(seen.has(current)).toBe(false)
        seen.add(current)
        current = byId.get(current)?.nextStageId
      }
      expect(seen.size).toBe(stages.length)
      expect(stages[stages.length - 1]?.executorRole).toMatch(/^(reviewer|teacher)$/)
    }
  })

  test("unconfirmed policies cannot auto-pass or produce formal approval output", () => {
    for (const entry of cases) {
      expect(entry.template.autoPassPolicy).toEqual({ enabled: false })
      expect(entry.template.policyVersionIds).toEqual([])
      expect(entry.template.outputs.some(output => output.kind === "approval")).toBe(false)
      expect((entry.template.sections ?? []).flatMap(section => section.criteria).every(criterion => criterion.execution !== "deterministic")).toBe(true)
      expect(entry.metadata.policyEvidenceStatus).not.toBe("VERIFIED")
    }
  })
})
