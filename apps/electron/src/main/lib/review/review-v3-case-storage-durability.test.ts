/**
 * B4：材料身份（ASSET-05/06）与主账恢复链（ASSET-12/17）。
 *
 * 使用真实原生案卷、真实磁盘事务与真实材料登记，不伪造聚合文件。
 */
import { afterAll, describe, expect, test } from 'bun:test'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Actor } from '@profer/shared'
import {
  createNativeWorkspaceCaseV3, registerNativeWorkspaceMaterialV3,
  nativeWorkspaceProjectionV3, updateNativeWorkspaceSettingsV3,
} from './native-workspace-case-v3'
import { listCaseStorageIssues, readAggregate } from './case-store-v2'
import { getReviewCasesDir, listCases } from './case-store'
import { registerMaterial } from './material-service'

const root = join(import.meta.dir, '../../../../../../work/tmp', `case-storage-durability-${Date.now()}`)
process.env.PROFER_CONFIG_DIR = root
mkdirSync(root, { recursive: true })
afterAll(() => rmSync(root, { force: true, recursive: true }))

const actor: Actor = { actorId: 'local-reviewer', actorSource: 'local', role: 'reviewer' }

describe('材料身份与主账恢复（ASSET-05/06/12/17）', () => {
  test('ASSET-05：原生登记保留展示名与显式替换，返回可读的版本结果', async () => {
    const created = await createNativeWorkspaceCaseV3(
      { title: '身份案卷', type: '综合测评', applicant: '甲', academicYear: '2026' }, actor)
    const caseId = created.view.id
    const source = join(root, '申请表.pdf')
    writeFileSync(source, '第一版申请书')

    await registerNativeWorkspaceMaterialV3(caseId, source, 'application', actor, undefined, 'application-form', {
      fileName: '申请表.pdf',
    })
    const first = readAggregate(caseId)!
    const firstDoc = first.caseV2.documents.find((document) => document.fileName === '申请表.pdf' && document.active !== false)!
    expect(firstDoc.role).toBe('application')
    expect(firstDoc.materialSlotId).toBe('application-form')

    writeFileSync(source, '第二版申请书')
    await registerNativeWorkspaceMaterialV3(caseId, source, 'application', actor, undefined, 'application-form', {
      fileName: '申请表.pdf',
      replacesVersionIds: [firstDoc.versionId],
    })
    const second = readAggregate(caseId)!
    const oldVersion = second.caseV2.documents.find((document) => document.versionId === firstDoc.versionId)!
    const newVersion = second.caseV2.documents.find((document) => document.fileName === '申请表.pdf' && document.active !== false)!
    expect(oldVersion.active).toBe(false)
    expect(newVersion.versionId).not.toBe(firstDoc.versionId)
    expect(newVersion.supersedesVersionId).toBe(firstDoc.versionId)
    expect(newVersion.materialSlotId).toBe('application-form')
  })

  test('ASSET-06：管理列表材料数按聚合有效材料统计，不沿用被裁剪的三栏投影', async () => {
    const created = await createNativeWorkspaceCaseV3(
      { title: '附件计数案卷', type: '综合测评', applicant: '乙', academicYear: '2026' }, actor)
    const caseId = created.view.id
    const attachment = join(root, 'attachment.txt')
    writeFileSync(attachment, '附件材料')
    const current = readAggregate(caseId)!
    const registered = await registerMaterial(caseId, {
      requestId: 'attachment-count', actor, expectedRevision: current.caseV2.revision,
      payload: { sourcePath: attachment, role: 'attachment' },
    })
    expect(registered.ok).toBe(true)
    const aggregate = readAggregate(caseId)!
    const projection = nativeWorkspaceProjectionV3(aggregate)
    const summary = listCases().find((item) => item.id === caseId)
    expect(summary?.documentCount).toBe(aggregate.caseV2.documents.filter((document) => document.active !== false).length)
    expect(summary?.documentCount).toBeGreaterThan(projection?.documents.length ?? 0)
  })

  test('ASSET-17/12：主账损坏时从上一有效副本只读恢复，并进入诊断索引', async () => {
    const created = await createNativeWorkspaceCaseV3(
      { title: '恢复案卷', type: '综合测评', applicant: '丙', academicYear: '2026' }, actor)
    const caseId = created.view.id
    await updateNativeWorkspaceSettingsV3(caseId, { caseId, title: '恢复案卷 v2' }, actor)
    await updateNativeWorkspaceSettingsV3(caseId, { caseId, title: '恢复案卷 v3' }, actor)
    const latest = readAggregate(caseId)!
    const statePath = join(getReviewCasesDir(), caseId, 'state.v2.json')
    const previousPath = statePath + '.previous.json'
    expect(existsSync(previousPath)).toBe(true)
    const previous = JSON.parse(readFileSync(previousPath, 'utf-8')) as { caseV2: { revision: number } }
    expect(previous.caseV2.revision).toBe(latest.caseV2.revision - 1)

    writeFileSync(statePath, '{broken json')
    const recovered = readAggregate(caseId)
    expect(recovered?.caseV2.id).toBe(caseId)
    expect(recovered?.caseV2.revision).toBe(previous.caseV2.revision)
    const issues = listCaseStorageIssues()
    const issue = issues.find((item) => item.caseId === caseId)
    expect(issue?.code).toBe('invalid-main-json')
    expect(issue?.canReadFromBackup).toBe(true)
    // 恢复只发生在读取层：主文件仍保持损坏证据，等待显式修复/回写。
    expect(readFileSync(statePath, 'utf-8')).toBe('{broken json')
  })
})
