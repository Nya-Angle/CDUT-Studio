// 独立 Bun 进程捕获真实收尾 rejection，避免测试运行器先中止异步测试而丢失事实记录。
import { chmodSync,mkdtempSync,rmSync,writeFileSync } from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {randomUUID} from 'node:crypto';
const repo=process.env.REVIEW_ACCEPTANCE_ROOT!;const report=process.env.REVIEW_RISK_REPORT!;
if(!repo||!report)throw new Error('必须指定隔离验收路径');
const directory=mkdtempSync(join(tmpdir(),'review-settle-risk-'));process.env.PROFER_CONFIG_DIR=directory;
const main=(path:string)=>import(join(repo,'apps/electron/src/main/lib',path));
const manager=await main('agent-session-manager.ts');
const save=(id:string,result:Record<string,unknown>)=>writeFileSync(report,JSON.stringify({id,...result},null,2)+'\n');
try {

    const { saveDraft, publishTemplate } = await main('review/template-store.ts')
    const { createCaseFromTemplate } = await main('review/application-service.ts')
    const { preparePiReviewRunV2 } = await main('review/pi-case-review-service.ts')
    const { admitPreparedPiReviewTurn } = await main('review/review-pi-admission.ts')
    const { listAssignments } = await main('review/review-agent-assignment.ts')
    const id = 'case-audit-write-failure'
    saveDraft({ templateId: id, version: 1, schemaVersion: 2, name: '合成收尾异常', objectType: 'person', displayName: { template: '{{title}}' },
      fields: [], sections: [{ id: 'all', name: '核验', order: 0, required: false, criteria: [{ id: 'check', title: '合成核验', requirement: '核对合成文字', execution: 'semantic', targetScope: 'case' }] }],
      materialSlots: [], policyVersionIds: [], policyRefs: [], stages: [{ id: 'review', name: '审核', kind: 'manual-review', executorRole: 'reviewer' }], outputs: [], status: 'draft', createdAt: new Date().toISOString() })
    publishTemplate(id, 1)
    const created = await createCaseFromTemplate(id, 1, { title: '合成收尾异常', fieldValues: {}, subjects: [] }, { actorId: 'audit', actorSource: 'local', role: 'reviewer' }, id)
    if (!created.ok) throw new Error('合成案卷初始化失败')
    const owner = manager.createReviewOwnedAgentSession({ caseId: id, title: '合成收尾异常', channelId: 'synthetic-channel', modelId: 'synthetic-model' })
    const turnId = randomUUID()
    const prepared = preparePiReviewRunV2({ caseId: id, sessionId: owner.id, turnId })
    const binding = { caseId: id, sessionId: owner.id, runId: prepared.runId, assignmentId: prepared.assignmentId }
    const assignmentPath = join(directory, 'review-agent-assignments.json')
    let unhandled = false
    const listener = () => { unhandled = true }
    process.on('unhandledRejection', listener)
    let release!: () => void
    const admission = admitPreparedPiReviewTurn({ sessionId: owner.id, userMessage: prepared.userMessage,
      channelId: 'synthetic-channel', modelId: 'synthetic-model', agentRuntime: 'pi', triggeredBy: 'user', uuid: turnId }, binding,
      async (input: { onRunOutcome?: (result: { status: string; error: string }) => void }, owned: () => void) => {
        owned()
        await new Promise<void>(resolve => { release = resolve })
        input.onRunOutcome?.({ status: 'failed', error: '合成运行正常收尾' })
      })
    await admission
    chmodSync(assignmentPath, 0o400)
    release()
    await Bun.sleep(150)
    const revoked = !!listAssignments().find((a: { id: string }) => a.id === binding.assignmentId)?.revokedAt
    chmodSync(assignmentPath, 0o600)
    process.off('unhandledRejection', listener)
    save('AUDIT-P01-P06-SETTLE-01', { unhandledRejection: unhandled, grantRevoked: revoked, expected: '持久化错误被捕获且清理不因异常跳过', result: !unhandled && revoked ? 'PASS' : 'FAIL' })
    if(unhandled || !revoked) process.exitCode=1
}finally{rmSync(directory,{recursive:true,force:true})}
