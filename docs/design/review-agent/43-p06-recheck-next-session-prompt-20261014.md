# 43｜P06-RECHECK 下一独立会话正式提示词（2026-10-14）

> 复制下方整段到新会话即可。**42 号交接书为执行依据**，此提示词不替代 29 号主台账和真实 GitHub HEAD/CI。

```text
宝宝，我们正式接手 cdut-studio-review-agent 项目的 P06-RECHECK 独立复验阶段。

公开测试仓库：https://github.com/Fuck-GH-Admin/cdut-studio-review-agent
工作分支：feat/review-owned-background-sessions
对应 PR：https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/21

第一步必须完整读取该分支中的：
- docs/design/review-agent/42-p06-recheck-independent-takeover-handoff-20261014.md
- docs/design/review-agent/43-p06-recheck-next-session-prompt-20261014.md
- docs/design/review-agent/41-p06-fix03-settlement-io-resilience-20261014.md
- docs/design/review-agent/40-p06-fix02-renderer-write-fence-20261014.md
- docs/design/review-agent/39-p06-fix01-owner-index-recovery-20261013.md
- docs/design/review-agent/38-p01-p06-s02-cumulative-risk-audit-20261013.md
- docs/design/review-agent/37-p06-s02-local-acceptance-20261013.md
- docs/design/review-agent/29-background-session-preflight-audit.md
- docs/design/review-agent/30-background-session-handoff.md
- docs/design/review-agent/31-background-session-continuation-prompts.md

不要只看 main，不要照旧聊天摘要假设阶段尚未执行。交接冻结时远程 HEAD 是 f7562c0bb825e87c7f3123dc0530b5df2b751439，四套 GitHub CI SUCCESS；正式开工必须重新查当前 HEAD、最近提交、源码、PR Draft 状态及当前 SHA 对应的真实 CI。若云端同时有其他 agent 修改，按现有提交恢复进度，禁止覆盖、force push 或重复重做。

已完成事实：
P06-FIX-01：owner 回滚安全修复，9/9 受控 PASS，代码 c8c84681。
P06-FIX-02：跨 Controller/Hook 共享 Jotai 写入防回退，5/5 受控 PASS，代码 414f2066。
P06-FIX-03：指派撤销 I/O/Promise 收尾 fail-closed，7/7 受控 PASS，代码 b5f9db17。
37 号原真实 Electron E01/E02 2/2 PASS，E05 FAIL；38 号原累计保护负例 0/4 PASS / 4 FAIL。原始失败记录不能改写。

你的目标不是再次修 FIX-01/02/03，而是严格执行 42 号 P06-RECHECK 的 R0→R1→R2→R3→R4：
1. 以新的隔离工作树/输出目录对当前 SHA 精确重放 38 号四项原保护探针。检查 INDEX-01、REMOUNT-01、WORKSPACE-WRITER-01、SETTLE-01 是否在真实原调用链被有效触发且受保护。旧注入由于原子写法变化而不再命中时，标无效或需要等效故障注入，不能当作安全 PASS。每项保存真实 SHA、环境、命令、退出码、原日志、JSON、失败证据和哈希。
2. 用真实授权 Pi、隔离 Electron profile、合成案卷复验 37 号 E05：旧请求开始→离开/卸载页面→新轮 Main accepted/running→重新进入→释放旧回复，检查新旧 Main/Jotai 一致性与旧通知不回写。不能用仅 Mock/SSR 冒充真实 E05 PASS。
3. 逐项补 E03（真实 stop-in-flight 的 busy 拒绝与释放后 restart）、E04（获授权的可控旧 executor 迟到回调）和 E06（普通 Pi/Claude/批量/预览等兼容矩阵）。无法安全触达的保持 NOT-RUN 或 BLOCKED，不要编造。
4. 发现真实缺陷时最小修复，固定当前源码 SHA，添加能够证明调用已发生的正负例；重新跑全仓、typecheck、边界、Electron 构建和当前提交的所有真实 CI。新代码没通过 CI 不可标 PASS。
5. 将结果同步写入 29 唯一台账、30/31 和 PR #21 描述，并形成独立 RECHECK 报告；保留 37/38 的首败和 39/40/41 的历史受控证据。每个门禁明确 PASS / FAIL / PARTIAL / NOT-RUN / BLOCKED 与证据路径，不能用旧 SHA 的 CI 冒充新 HEAD。

固定约束：P05 生产中心 Relay BLOCKED、Pocket 独立补丁 TARGET NOT-RUN；P04 永久 tombstone 与 FIX-01 owner journal 禁止无安全依据的 GC/TTL；P06-S02 当前 NOT ACCEPTED、P06 PARTIAL、LIVE-07 PARTIAL；P07/P08 不启动。只写当前公开测试分支，原项目仓库和 main 不改。PR #21 保持 Draft/Open，不合并、不解除 Draft。禁止上传 API key、真实档案、原始 transcript、私有内部 owner ID。

自主推进全部具备条件的小批次，不需要每一步等用户重复确认；因缺少本地 Electron、provider 凭据或目标仓库权限无法执行时，完成所有可做的源码/受控/证据工作，准确留 NOT-RUN，明确下一个本地 agent 要执行的命令与证据要求。务必在最终报告附：HEAD SHA、修改文件、真正执行的测试数量、原始日志和 CI 链接、剩余风险、是否允许进入后续阶段。
```

## 新会话最低交付标准

- 不声称“正在工作”却没有真实运行或提交。先验证分支和证据，再执行。
- 如果四项保护重放现已全部有效通过，但真实 E05 未验，则最多能签收对应受控部分，**不能签收 P06**。
- 如全部可执行项完成，输出下一独立阶段的明确编号与门禁，而不是默认开展 P07。
