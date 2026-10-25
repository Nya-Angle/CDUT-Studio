# Review V3 Dev-C C1+ — real development checkpoint / safe handoff

**Track**: V3-DEV-C-C1PLUS-R01 · **implementation status**: C1 PARTIAL; C2–C5 NOT STARTED · **Release**: NO-GO  
**Repository**: `Fuck-GH-Admin/cdut-studio-review-agent`  
**Parent**: [C0 Draft PR #141](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/141), **exact immutable base** `5682057c7232c914e72fdae525ce95fd33f32b53`; C0 contract `review-c0/1`.  
**Branch**: `feat/v3-dev-c-business-r01`; [Draft PR #144](https://github.com/Fuck-GH-Admin/cdut-studio-review-agent/pull/144), **base branch** `feat/v3-dev-c-c0-contract-r01`. This branch is intentionally independent; do not merge main.  
**Design evidence**: Draft #140 `7f954661b3dbca7f0707832c2d097d9c68a965b4`. Audit #133–139 fixed in #140/01; notably #139 L1-01/02/03 synthetic red cases do **not** prove a normal live GUI exploit.  
**Source anchors**: M `8989941b6fb5651564e32d11c4215b6a6d5a5209`; D4 `c2f965d29022a42b3c32d6a4cb73aa8fd542329b`; P06 R03 `db0284879f75ce123b5d83cb6577a3cc7ad057da`; R02 `c23789882aabf18689c314c77c270ac4a8ae4729`; #97 `b68443b23293b4714e61a3b81383d3d3a56434fc`. No whole-branch import.

## Actual C1 production changes committed to Dev-C branch

1. `workspace-service-v2.ts`: native `CaseAggregate` lookup has priority over V1, including a same-ID legacy file; V1 migration receipt distinguishes legacy projection. After a D2/CanonicalPlan bind, V1 projection cannot overwrite frozen Subjects/rules/template. Archive transitions revoke obsolete source validity in same aggregate CAS/Receipt and do not recreate archived links.
2. `source-current-validity-v3.ts` + `review-v2-contracts.ts`: source retirement retains original Observation values/refs/Receipts, records which confirmed facts and links were revoked, demotes current confirmations, and catches stale legacy states at read/decision boundary. Missing source for earlier un-attributed confirmations fails closed after retirement.
3. `material-service.ts`: replacement rejects missing/inactive specified predecessor, deactivates old material and revokes dependent current fact/link in the same case aggregate write; no claim of cross-file/asset atomicity.
4. `run-service-v2.ts`: input hash now includes each material's active flag, so retiring a material invalidates an earlier Run rather than merely altering UI usage.
5. `application-service.ts`: current evidence creation/reconfirmation refuses unknown/archived documents and unknown Subjects, manual SourceRef must match current case/current version; after archive un-attributed fact cannot be unconditionally reconfirmed.
6. `workspace-business-service-v2.ts`: high-level current-Run boundary rejects stale source evidence; frozen CanonicalPlan cases are held from legacy-run formal decision until an authenticated C2 Run writer exists.
7. `material-lifecycle-v3.ts`: a native aggregate ArchiveMaterialVersion typed CAS command (not yet public IPC) with documented reason, exact request replay, historical manualReadReceipt retention and stale evidence rejection.
8. `plan-binding-v3.ts`: explicit internal-only CanonicalPlan initial bind and version upgrade ACK via V2 CAS, records old immutable Plan and receipt. **The Dev-B publisher/provenance verifier is NOT yet integrated**. Test callbacks are synthetic and cannot authorize production template publication.

Tests committed: `source-current-validity-v3.test.ts`, `material-lifecycle-v3.test.ts`, `plan-binding-v3.test.ts`, additions to `workspace-service-v2.test.ts`. **Do not count as PASS until executed on the exact commit.** Major non-C1 legacy paths and IPC write matrix remain outside this patch.

## Trust boundaries / remaining work (in order)

- C1 unfinished: enumerate every V1 `CREATE_CASE` / `case.json` new-case write and transition UI/Main to native C0 command; keep old case.json read-only shadow. Retain V1 user workflows via typed Main intents; finish genuine plan-bound API replace/archive→readiness→decide (with accepted Run), source/ReadReceipt validity and legal new-version re-confirmation; negative/positive tests at business service rather than test-only D2 deletion or synthetic Run.
- C2: one Dev-C ReviewRun writer using Dev-A signed attempt/generation/manifest/sequence/tool receipt events and Dev-B Plan/Source; Check×target/unknown/coverage/read ledger; assert 9-of-9/arithmetics. Never turn graph/direct finish or `run@rev` into approval.
- C3: independent `ReviewBatchAttempt`, exact entry Run+Decision.basedOnRunId and manifest/hash/revision checks at **final persisted write**; normal auto/group/retry and low-level/Main reject cases #139 L1-03, same case dual batch, legacy done without Run blocked.
- C4: durable cross-object commit-intent/journal/recovery with multi-PID fencing; Outbox simulated/provider/external tiers, receipt reconciliation on ambiguous timeout; trusted teacher/gated appeal/ratings and immutable business history; ENOSPC only on isolated fault volume.
- C5: V1 legacy shadow/read-only migration + explicit adoption/tombstone/rollback; one three-column workspace and four distinct technical/business/approval/source-validity states; integrate A/B/C under one SHA, replay 72/20/71, then real Electron/Office/Provider/SchoolPort/Gold distinct gates.
- Absolute prohibitions: no separate current Case/Run/Decision writer, no renderer-provided teacher, no fake SchoolPort ACK, no implicit latestRun for historical batches, no whole `review-ipc.ts` copy or branch merge, no Gold/policy fabrication.

## Exact repeatable verification (run in isolated local clone/worktree)

```bash
git fetch origin feat/v3-dev-c-c0-contract-r01 feat/v3-dev-c-business-r01
git worktree add ../review-v3-dev-c feat/v3-dev-c-business-r01
cd ../review-v3-dev-c
git status --porcelain
git rev-parse HEAD
git worktree list --porcelain
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate apps/electron/src/main/lib/review/source-current-validity-v3.test.ts apps/electron/src/main/lib/review/material-lifecycle-v3.test.ts apps/electron/src/main/lib/review/plan-binding-v3.test.ts apps/electron/src/main/lib/review/workspace-service-v2.test.ts
bun test --isolate apps/electron/src/main/lib/review/case-store-v2.test.ts apps/electron/src/main/lib/review/material-service.test.ts apps/electron/src/main/lib/review/review-c0-ipc.test.ts packages/shared/src/types/review-v3-c0.test.ts
bun test --isolate --timeout 30000
```

Preserve for **this exact head** `stdout/stderr` and exit code per command, SHA256(log), first failure/repro hash, correction commit and persisted data hashes. Remote GitHub connector permits submissions but local Bun and working tree were **NOT_OBSERVABLE** in this execution session; PR CI may validate later. If PR CI fails, treat FAIL, fix and rerun rather than borrowing earlier C0/legacy PASS. If CI passes, it is still only scoped offline Gate O evidence, not Gate E/L/P.

## Files/Owners, interface requests and rollback

C0 `C0-OWNERSHIP-MANIFEST.md` remains the sole cross-track owner. C alone edits `packages/shared`, `review-ipc.ts`, Case/Run/Batch/Decision/Preload/Renderer integration; A/B can only request exact versioned adapters (C0 `C0-ADAPTER-CHANGE-REQUEST.md`), never create parallel write truth. Dev-B must provide a verifiably immutable, published Plan descriptor and SourceIdentity/obligation coverage; Dev-A must provide authorized event envelopes. Contract version bump requires Change Request, bilateral tests and rollback. New `plan-binding-v3.ts` is internal-only and accepts no renderer-origin verification callbacks.

Rollback before deployment: revert the Dev-C PR commits on this dependent branch and return to exact C0 code SHA; do not delete existing receipts/material archives. Do not downgrade migrated data/externally-acknowledged actions automatically. Legacy writes must remain disabled once an old case is adopted as native.

## Required status ledgers

- `72-capability-runtime-status.csv`: 72/72 accounted for, C1 touching select CASE capabilities only as PARTIAL, others NOT_STARTED.
- `20-arch-risk-closure.csv`: 20/20, ARCH-001/002/003 C1 PARTIAL, ARCH-004 C0 partial limited to trusted local Main; rest open.
- `71-original-product-gates.csv`: 71/71 original gates, **none PASS**.
- `07-journey-status.csv`: A–G, B/G PARTIAL and rest NOT_STARTED.

**Gate verdict**: C0 contract `FROZEN_GO` for offline local development ONLY. Dev-C C1 `PARTIAL / NOT_FULLY_VERIFIED`. Integrated Gate O `NOT_RUN` (three-track SHA not assembled). Target Gate E `NOT_RUN`, authorized Gate L `BLOCKED_NO_AUTH`, original product Gate P `NOT_RUN`, Release `NO-GO`.


## C1-R06 native-first workbench engineering checkpoint (2026-10-19)

**Exact production checkpoint before this docs update:** `21f4927e93eed9c39e8e15c75ff67415ecbe1d11`. **C1_PARTIAL / Gate O NOT_ATTESTED / Release NO-GO**. This is real C-owned code and tests on Draft #144, not a specification-only phase. No C0 `review-c0/1` semantic change, no I/A/B file delegation, no second Case writer.

### Real modified entry chain

1. New `native-workspace-case-v3.ts` is C's native-first `CREATE_CASE` implementation. Main-generated random case ID + original local Actor → exactly one `state.v2.json` with `CreateNativeWorkspaceCaseV3` Receipt at revision 0; **no `case.json` and no `case.v2.json`**. Main sender/frame revalidates inside the serialized `createAggregate` commit. The old Renderer `CREATE_CASE` API shape is preserved.
2. `case-store.ts::getCase/listCases` derive an **in-memory, read-only** V1-shaped view from native `CaseAggregateV2`, without creating or mutating a V1 file. Native identity must match the requested directory; invalid/cross-ID state remains hidden. `MIGRATE_CASE_V2` returns the native aggregate instead of creating a migration shadow. `ensureWorkspaceAggregateV2` returns existing native state without a legacy projection write. Previously migrated genuine V1 cases still use the legacy compatibility branch, and a stale V1 shadow cannot overwrite a native Case.
3. `UPDATE_CASE_SETTINGS` detects genuine native origin and redirects basic title/type/domain/template intents to one C-owned `submitCommand` CAS+Receipt. Bound `CanonicalPlan`/`D2RuntimePlan` cannot be silently replaced; modifying native manual rules or material scope requires future typed business commands. A **candidate/draft/unmapped template remains pending**, never silently published or installed as an official Plan.
4. The existing three-column `IMPORT_DOCUMENT` uses the true invoking Main-window OS picker for native cases and C `registerMaterial` (actual file bytes, SHA256, current DocumentVersion, receipt). Developer-only `IMPORT_DOCUMENT_FROM_PATH` is separately gated by `!app.isPackaged`; it is **not** a production file-capability entitlement. Native remove/reorder use dedicated same-aggregate CAS commands; physical files, old versions and source revocation records remain. All native commands perform a **commit-time revalidation** of the actual Main window/frame after dialog/parser awaits. Old V1-only paths retain their old implementation, no mass deletion/auto-migration.
5. `PICK_REGISTER_MATERIAL_V2` is scoped to the invoking Main window (not `getFocusedWindow`) and rechecks sender after dialog and during `RegisterMaterial`. **Native `REGISTER_MATERIAL_PATH_V2` fails closed with `SOURCE_CAPABILITY_REQUIRED`** because a Renderer-supplied absolute path is not proof of an OS-selected/drop capability. Integrating B2 physical bytes/capability as a trusted Native drop remains unimplemented; don't relabel the rejected legacy text path as authorized. Explicit Main OS picker works, but actual Electron Gate E is still required.
6. The projection does **not** mislabel V2-only `attachment` materials as evidence or invent AI-extracted subjects/validated policy checks. Current three-column legacy rule generation/AI item edits/export still contain V1 mutator dependencies and are **not declared complete or silently faked**. Native-only restore is again selectable through the read-only view. Full C1 requires converting those remaining commands to typed V2 writers with authorized Plan/Source scope.

### Exact test files and proofs to obtain

- `review-v3-legacy-entry-gates.test.ts`: actual Main handler native create, no V1 shadow, no duplicate migration, native basic settings, archive/restore round-trip, trusted sender/frame negatives; development-only physical text original into V2 material, two-source reordering/retirement, source validity revocation; unsealed Renderer path and spoof negatives; malformed V2 summary isolation.
- `native-workspace-case-v3.test.ts`: native Case creation/reopen/read-only projection, V1 low-level write rejection, deliberate Main revoke precisely at native create/settings/material/remove commit, authentic physical bytes, custom unbound template does **not** become published policy.
- `review-actions-controller.test.ts`: native-only restore refreshes selected three-column Case through V2-derived read projection, not a V1 ghost.
- `case-lifecycle-v3.test.ts` and earlier legacy Main tests: archive/reopen/re-archive idempotency and historical receipt preservation.
- Required targeted Gate O first: `bun run typecheck`; `bun run check:boundaries`; `bun test --isolate apps/electron/src/main/lib/review/native-workspace-case-v3.test.ts apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/main/lib/review/case-lifecycle-v3.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts`; then full `bun test --isolate --timeout 30000`, Main/Preload/Renderer builds and standard workflows. Capture exact checkout SHA, exit code, first failure and rollback; do not claim a PASS from queued CI or old source.

### Explicit still-open hard problems

- C1 native-only three-column **write-complete** RulePack/AI item/evidence/report integration, credible source/subject projection, native trusted drag capability, full material attachment role, explicit Plan publisher/provenance, all old mutator transformations.
- Native create request/reply lost-response recovery and ImportBatch cross-call durable idempotency; `randomUUID` prevents Case ID collision but does **not** prove same user request dedup after crash.
- Multi-PID Case/Run/Host/physical-copy atomicity, ENOSPC recoverable intent, durable OS capability after await (C-Tx/C4); physical asset may remain if aggregate write fails. A/B/I technical proposals are not C durable Run/Decision ACK.
- Full native Electron/picker/parser/Office and user workflow Gate E not run; school/Gold/Provider Gate L blocked without authorization; 71 product gates and 7 journeys not accepted. Separate safe staging/read-only preview from formal InstallPlan/ReviewRun release.

**Rollback:** reverse C1-R06 #144 commits using normal Git revert on an isolated C branch, keep all live state.v2.json/receipts/material assets intact; do not run V1-first replay over cases with a native origin Receipt. Reversion of a code feature is not permission to down-migrate existing native business state.


## C1-R07 native workbench draft, source-anchored Subject and formal Plan fence (2026-10-19)

**Fixed code HEAD before this document update:** `fb2cbee548d8adc3bd370dcbe1d394a87d33bd78`; Draft PR #144, not merged. **C1 PARTIAL / exact Gate O NOT_ATTESTED / Release NO-GO.** This adds real production code and real regression sources after R06, not merely task planning.

**Single-authority business changes:**

- `packages/shared/src/types/review-v2.ts` adds **optional** `ReviewCaseV2.nativeWorkspaceDraft`: local `manualRules` authored text (not `RuleSpec`/SchoolPort/published policy) and `subjectDocumentVersionIds` pinned to the exact active physical source version. No breaking C0 Main Principal/schema change; no second `case.json` or authority writer.
- `native-workspace-case-v3.ts` now accepts native `UPDATE_CASE_SETTINGS` manual-rule and subject-file selection in one Main-authorized CAS+Receipt. It validates 100-rule limit, rule identity/length/duplicate ID, same-case active application documents and cross-case/stale versions, rechecks material scope at serialized commit, and holds changes when CanonicalPlan/D2RuntimePlan exists, state is not `draft`, or current confirmed facts/evidence would become unsupported. Projection maps version IDs back to current legacy IDs only when the same physical version remains active; a retired/replaced source is **not** silently reselected.
- A native `ReviewSubject` projects into a legacy three-column `ReviewItem` only with explicit numeric declaredScore, nonempty category and a same-case/source-version/parse-revision grounded `SourceRef`. A file-level source remains file-level; only a real indexed paragraph becomes block anchor. Never invent score 0, precise coordinates, AI OCR, approved school standard, or evidence relationships. `UPDATE_REVIEW_ITEM` for existing valid native subjects now uses one C CAS/Receipt, main sender revalidation, draft-stage/frozen-plan/confirmed-observation blockers. New subject extraction/candidate acceptance awaits B/C trusted staging, not synthesized V1 fixtures.
- Native `UPDATE_RULE_OUTLINE`, `CONFIRM_RULE_PACK`, `GENERATE_RULE_OUTLINE`, `EXTRACT_ITEMS`, old `RUN_REVIEW` and old `EXPORT_REPORT` are explicitly held with actionable `NATIVE_...` error codes. This is a **declared product gap**, not successful native AI/execution. Genuine migrated V1 cases retain existing handlers.
- `plan-binding-v3.ts::checkPlan` now rejects binding/upgrading a formal CanonicalPlan while unadopted manual draft rules exist, a selected version is no longer current, or immutable Plan bindings omit a selected version. Only the later C-published provenance/InstallPlan flow can resolve these author intents; synthetic `verifiedFixtureOnly` still **must not** be used as a production verifier.
- Native-origin detection validates parseable JSON structure (documents, blocks, subjects, source refs and draft) before projecting. Corrupted state is hidden/blocked without V1 fallback, auto-repair or forensic data destruction. Explicit unknown domain IDs refuse silent comprehensive-assessment fallback in **new** native Cases.

**Actual test additions (committed; no claim of PASS):** `native-workspace-case-v3.test.ts` native settings persisted drafts, same-ID physical version selection, wrong/duplicate IDs, invalid rules, retirement preserves pinned history, sourced V2 subject correction and forged cross-case source, Main post-await revocation, corrupted-but-parseable state and unknown domain. `review-v3-legacy-entry-gates.test.ts` updated existing Main IPC expectation for now-supported manual rule drafts, plus negative checks that all held AI/Run/export interfaces leave the original aggregate unchanged and write no V1 shadow. `plan-binding-v3.test.ts` new source coverage / pending manual rules / current-version Plan bind cases.

**Next required execution in isolated exact HEAD checkout:**

```bash
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate apps/electron/src/main/lib/review/native-workspace-case-v3.test.ts apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/main/lib/review/plan-binding-v3.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts
bun test --isolate --timeout 30000
```

Preserve SHA, test exit codes, first real error and repro fixture. No runner logs/green checks for fixed R07 code at time of writing. GitHub queued workflows must **not** be counted as passed. Gate E Electron OS picker/drag, Gate L authorized campus proof, Gate P 71 product gates, I1 acceptance are separate; NO-GO.

**Still open:** true Plan publisher/provenance verification from B, Main-minted B2 drag bytes/capability; source-bound native rule outline staging/confirmation; V2 Subject creation/candidate acceptance from AI; C2 durable ReviewRun and ReadReceipt/Check/Business ACK; native report/export grounded in formal Run; cross-PID/ENOSPC asset durability, native create lost-response idempotency; concentrated UI/Gate E/UAT. Do not present held interfaces as a completed workbench or silently downgrade workflow quality.

**Rollback:** reverting #144 C1-R07 code is allowed on the isolated development branch; preserve current `state.v2.json`, all Receipt logs, source versions and physical bytes. Do not run V1-first rewrite on Cases whose native create Receipt exists. No I technical lease expansion or new C baseline promotion in this checkpoint.


## C1-R08 — Main-grounded human Subject command (2026-10-19)

**Code checkpoint before this document commit**: `be7f6f3f70a51230d175cd2f237f0e7d119bea01`, Draft PR #144, not merged. **Engineering work is committed but latest Gate O has no actual runner result.** No source-only B2 inputs have been promoted to CurrentCase, and no new I write authority exists.

### Decision: C can advance manual Subject intake; automated B staging still gated

Dev-B #142 current observed source SHA `9952348d413cac58da3db2b99c14dae2405a6120`, PR CI queued/pending, B-CR-001 remains `APPROVED_SLICED_SPEC / IMPLEMENTATION_PENDING`. Dev-B's ZIP checkpoint, InputLedger and handoff are `input-only-unapplied`, **not** parser-verified current documents, immutable school policies or Main-minted grant tokens. Integrator-I #147 is still on the earlier frozen C source and has no lease to touch C-owned business writers or IPC. Thus automatically converting B candidates into native CurrentCase/CanonicalPlan is **not yet authorized or verified**.

### Genuine C-only R08 production implementation

1. New shared `CreateNativeReviewItemV3Request` and `CREATE_NATIVE_REVIEW_ITEM_V3` channel in `packages/shared/src/types/review.ts`: `caseId`, opaque retry `requestId`, `expectedRevision`, exact `documentVersionId`, optional exact `sourceBlockId`, and a human-claimed title/category/score. Renderer actor/school authority or forged SourceIdentity are not accepted.
2. `native-workspace-case-v3.ts::createNativeReviewItemV3` uses a **single** `submitCommand` CAS+durable Receipt on the existing C CaseAggregate, with stable subject ID derived from `(caseId, requestId)` for replay. It checks genuine native-origin receipt, editable draft state, absence of bound formal Plan, local actor, actual current application-role `DocumentVersion`, stored parsed block existence, case identity and revision. Exact parser location is used if available; otherwise the reference is explicitly **file-level**. A manually stated score is never an AI observation, Check result, policy score or Decision. Replay reuses the original Receipt and does not create a duplicate Subject; same requestId/different payload, stale revision, retired version, cross-case/fake block and post-await Main revocation all fail closed.
3. `review-ipc.ts` derives authority from the live Main sender/frame, blocks `actor/principal/sourceIdentity` injected by Renderer and rechecks sender inside the serialized command. `preload/index.ts` exposes the typed API, and `review-actions-controller.ts` has `createNativeReviewItem` which reads current V2 revision, sends an opaque requestId, refreshes native aggregate and three-column in-memory projection. **A dedicated visible manual-entry dialog/button is NOT part of this R08 slice**; do not claim UI UAT completed.
4. Physical source bytes must already have passed C's existing trusted local OS picker path into the V2 document ledger. File-level human declaration is not pretending to be parser precision, and AI/ZIP automatic Subject acceptance remains gated pending B signed technical evidence and C Main authorization.

### Committed regression source, proof requirements and explicit blockers

- `native-workspace-case-v3.test.ts` extends genuine local text-file material registration with exact parsed block, receipt+stable replay, change collision, cross-case version, forged block, stale revision, simulated Main loss, archived source and fallback file-level SourceRef.
- `review-v3-legacy-entry-gates.test.ts` tests actual Main handler senderFrame/Actor/SourceIdentity negatives, old V1 `case.json` absence, trusted local actor receipt and idempotent replay.
- `review-actions-controller.test.ts` checks C1 native-origin gate, current revision binding and refresh; migrated legacy case cannot call native creation path.
- Gate O command set (isolated exact HEAD required):

```bash
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate apps/electron/src/main/lib/review/native-workspace-case-v3.test.ts apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/main/lib/review/plan-binding-v3.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts
bun test --isolate --timeout 30000
bun run --filter='@profer/electron' build:main
bun run --filter='@profer/electron' build:preload
bun run --filter='@profer/electron' build:renderer
```

Do not mark any command passed without captured stdout/stderr, exit codes, first failure and exact SHA. Observed latest source `be7f6f3` PR CI run `39264195233` job `118099389091` was **queued**, with no completed steps; other runs also pending/queued. Treat infrastructure as `GATE_O_BLOCKED_QUEUE`, not a successful test and not a source failure. Gate E/L/P remain unverified.

**Next:** after real CI and quality fixes, create the visible manual item-entry component with currently registered document/block selectors and role labels; then C/Main B2 physical capability, parser-verified candidate staging and formal `ApplyMaterial/InstallPlan`. Long-running C2 Run/Check/ReadReceipt/Business ACK and concentrated Electron verification remain separate. No fake Gold, SchoolPort approval or official policy publication.

**Rollback:** revert C-owned R08 code on the Draft C branch only, preserving durable case storage and receipt history; no V1-first replay or deletion of native source versions. Changes to shared DTO must be versioned and verified jointly before any I promotion.


## C1-R09 — Visible native manual-item entry in the actual three-column workbench (2026-10-19)

**Source checkpoint before this doc update**: `2b1cca8f1a7720e891d27690e5bbafd34d35ad90` on C's Draft PR #144, unmerged. **C1 is still PARTIAL; exact Gate O not passed; Gate E/L/P not passed; Release NO-GO.**

### Real C-owned product code (not a plan-only deliverable)

1. New `apps/electron/src/renderer/components/content-review/NativeManualItemDialog.tsx` is mounted from the **existing real** `CaseManagerBar.tsx::ReviewContextBar` as the visible **人工登记事项** entry. The button is enabled only for the selected native-first, unfrozen draft Case with a loaded V2 aggregate. No unrelated window/legacy Case can invoke the native writer.
2. Dialog **read-only** material discovery calls the existing Main `getAggregateV2(caseId)`; it offers only that Case's active **application** `DocumentVersion` and exact registered parser `blockId`. Retired source, evidence-role attachment, unbound/cross-case, legacy-origin or frozen Plan cannot be offered. Users may choose a real parser block, or explicitly choose **file-level** precision (no fabricated page/paragraph position). It displays the physical filename + version and labels the amount as **人工申报分值（未认定）**. Required title, category, score, optional level/activityDate/organizer have size/number constraints.
3. The form's submission goes exclusively through C's existing `ReviewActions.createNativeReviewItem` → trusted Preload/Main → `createNativeReviewItemV3` (same Case CAS+Receipt). No direct filesystem / policy / formal Run or Plan writer from Renderer. On success the selected case, native aggregate and three-column view refresh. On failure dialog remains open and error is visible, not misreported as approved.
4. A **selected-case switch** invalidates the old dialog; the action separately checks the captured Case ID **both before and after the awaited aggregate read**, so an old form cannot write into a newly selected Case. An unchanged form reuses a stable `requestId` after a lost Main reply, allowing the C durable receipt to replay without a duplicate Subject; form changes or reopening use a new request identity.
5. `native-workspace-case-v3.ts` now also persists the **parser-verified exact blockId** as a separate Subject field when the parser has no geometric `SourceLocation`. Projection matches that ID only against the current physical DocumentVersion's registered blocks and can highlight the exact real block, while `SourceRef.location` honestly remains `{kind:'file'}` when no precise locator exists. No invented OCR coordinate, authoritative score or school approval.

### Committed regression code

- `NativeManualItemDialog.test.ts`: source selection excludes retired versions, evidence roles, frozen Plan, migrated legacy and wrong Case; malformed source ledger remains blocked.
- `review-actions-controller.test.ts`: case switch during source read cannot issue stale cross-case Subject write; stable retry requestId is forwarded after a simulated lost reply, and UI case projection refreshes.
- `native-workspace-case-v3.test.ts`: selection of an actual parser block with missing geometric location preserves true block identity and retains explicitly file-level SourceRef; existing R08 same-ID receipt/physical source/actor forgery tests stay intact.
- Exact Gate O commands in isolated checkout:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate apps/electron/src/renderer/components/content-review/NativeManualItemDialog.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts apps/electron/src/main/lib/review/native-workspace-case-v3.test.ts apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/main/lib/review/plan-binding-v3.test.ts
bun test --isolate --timeout 30000
bun run --filter='@profer/electron' build:main
bun run --filter='@profer/electron' build:preload
bun run --filter='@profer/electron' build:renderer
```

**Evidence limit**: fixed R09 source PR CI run `39267842729` was `QUEUED`, as were Review Baseline `39267842941`, D1 `39267842868`, D2 `39267843075`, Review Batch `39267842971`. Earlier C runs have cancelled jobs; neither queue nor cancelled status yields a test result. No live Electron dialog interaction, keyboard/screen-reader, actual OS picker, multi-window revocation, or Office/ZIP 100-case validation has been witnessed. The added tests are **written, not executed**. Do not claim Gate O/E.

### Scope and remaining work

The new UI is **manual registration only**. Dev-B #142 offers input-only ZIP ledger / candidate metadata, not an authorized `ApplyMaterial` or published Plan; no unverified B input has been imported into C's Case. I #147 has a new I-only correction after a genuine first CI typecheck failure, but Gate O at its new SHA is not yet proven and no I write lease expands. Existing C2 formal ReviewRun, ReadReceipt, verified Check and Decision ACK, B publisher/provenance, signed SourceIdentity, native trusted drop, durable ImportBatch and cross-PID disk recovery all remain open.

**Rollback**: revert only R09 component/controller/typed adapter and corresponding tests on #144 in an isolated worktree, never delete live `state.v2.json`, materials, Subjects or receipts. Users who have already created native Subjects must retain their historical rows; no fallback to legacy `case.json` writers or automatic official policy installation.


## C2-R00 — C-owned technical Run admission + Host event durability groundwork (2026-10-19)

**Fixed C2 code/test checkpoint before this document update:** `14619201d835f637fe8a88a2ea1919574a09eec5`; engineering Draft PR #144 remains unmerged. **C2 TECHNICAL_JOURNAL_SOURCE_COMMITTED / GATE_O_NOT_ATTESTED; formal Run writer/ACK NOT IMPLEMENTED; release NO-GO.** This is a true code-and-tests slice, deliberately not a second implementation of ReviewRun or a synthetic credential issuer.

### Why this slice was selected after R09

Recent owner-state checks: #143 Dev-A A4-R08 builds physical SDK dispatch-intent/abort fence and real Linux PID-kill test source, but no verified native per-request Pi SDK receipt; #142 Dev-B B1-B4 offers real ZIP/source ledger and 50 candidate templates, but Main physical trust and current Case ApplyMaterial/Gold remain unimplemented. I1 #147 combines earlier locked A/B/C technical slices; an actual earlier PR CI typecheck found two I-owned errors (fixed in `89f7a0188bb396a84386dac77fa59ca67e99d60a`), but current SHA Gate O still pending. C is uniquely responsible for the formal Run/Plan/Case writer. Completing the *internal* admission/journal transaction reduces future A/I interface risk without prematurely accepting unverified Host events.

### New actual C-owned code

- `packages/shared/src/types/review-v2-contracts.ts`: backward-compatible optional `CaseAggregateV2.v3TechnicalExecution`. It retains the C0 `RunEvidenceIdentity`, precise admission revision, **frozen input SHA-256**, serial `V3ExecutionProposal` payloads + exact hashes, timestamps and a technical terminal status. **It does not create/alter `ReviewRunV2`, `CheckResult`, `Observation`, `ReadReceipt`, `BusinessDecision`, `OutboxReceipt`, or school-side acknowledgments.** No C0 version or old schema replaced.
- `review-v3-technical-ledger.ts::admitV3TechnicalRun`: C Main-only internal function with mandatory synchronous trusted attestation callback, submitted as one `AdmitV3TechnicalRun` CAS/Receipt. Checks archive state; a pre-existing immutable CanonicalPlan, exact bound template/version/fingerprint; real active selected DocumentVersions; unique complete plan check keys; C0 evidence identity and **Run revision after the admission transaction**. A single journal prevents ambiguous second-run reuse until a separate explicit attempt transition is implemented. Does not launch or claim any Provider call.
- `recordV3TechnicalProposal`: mandatory C Main-only current Host verification callback, with actual trusted `V3VerifiedHostReceipt` registry and Owner grant. Re-validates canonical Run/Plan and active physical source at serialized commit. Calls the already separately verified pure `validateV3ExecutionProposal` for strict eventId, Host kind/body, contiguous sequence and precise Check×target identity. Stores technical proposal and business command Receipt **atomically in the same single aggregate**. Repeated identical requestId returns original Receipt, changed payload/requestId collision rejects. A terminal is only `completed-technical|partial|cancelled|...`, never a Case approval or formal completed Run.
- **Crash/staleness discipline**: Admission freezes canonical hash of all business inputs and material metadata, excluding only C2 journal contents and transaction revision/time. Any business change, even an off-ledger mutation without version bump, rejects new Host proposals. An explicit Receipt scan disallows unrelated business commands since admission. Recorded event sequence, eventId, Run binding and number of corresponding CAS receipts must remain consistent; malformed/corrupt journals fail closed without auto-repair. A Read event raw SHA-256 must also equal the active V2 DocumentVersion byteHash when present. Journal capped at 4096 technical events pending formal checkpoint design. No automatic recycle of an admitted Run ID.
- `review-v3-technical-ledger.test.ts`: C2 source tests seed isolated genuine V2 aggregate states; cover missing Main attestation, one-time durable admission, identical lost-response replay, Host check+terminal serial writes, post-terminal rejection, unauthorized forged Host/grant, changed event digest, CAS conflicts, stale input after unrelated business write, off-ledger source material tamper, corrupt receipt chain and physical byteHash mismatch. **All these are committed test cases, not executed results.**

### Important intentionally missing proof

This C2-R00 code is a **technical proposal-only ledger**: no exposed Renderer API or production Main handler. A trusted test callback is deliberately NOT a real Pi SDK/SchoolPort proof. It cannot transform Dev-A synthetic SDK events, Dev-B input-only source declarations, I1 synthetic Host tests or locally injected callback data into accepted official Checks/ReadReceipts/Decisions. The C Main production ingress still needs a real Owner/session/Host physical-receipt registry, source parser relation, independently verified Plan publication, immutable inputManifest computation and actual approved Main registration, followed by C durable **formal ReviewRun** writer/read view and explicit terminal/Business ACK. It also needs cross-PID locking, disk EIO/ENOSPC and data limits/performance evidence (C-Tx), concentrated real Electron Gate E and authorized school Gate L/P.

### Exact-HEAD local/CI verification required

```bash
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate apps/electron/src/main/lib/review/review-v3-technical-ledger.test.ts apps/electron/src/main/lib/review/review-v3-execution-contract.test.ts apps/electron/src/main/lib/review/native-workspace-case-v3.test.ts apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/renderer/components/content-review/NativeManualItemDialog.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts
bun test --isolate --timeout 30000
bun run --filter='@profer/electron' build:main
bun run --filter='@profer/electron' build:preload
bun run --filter='@profer/electron' build:renderer
```

Use exact C2 final SHA for job/run IDs and collected output; preserve first failure and exit code. The connected container session has no private full checkout/Bun execution evidence. CI `queued/pending` is neither failure nor success. No claim of Gate O/E/L/P PASS.

**Integrator-I status:** I test-only lease active as previously signed; I Main read-only port lease conditional/inactive; I business writer DENIED. This journal must NOT be transplanted into I1 old C anchor, and must NOT be advertised as a signed C2 Run endpoint before a new exact C SHA has real Gate O and C authorizes a new integration anchor.

**Rollback:** revert C2 code+DTO in a C-isolated Draft branch, but do not delete already persisted `state.v2.json`, material bytes, native Subjects, admission receipts or audit events; preserve a read-only forensic copy. Old valid aggregates without `v3TechnicalExecution` remain readable (optional field).


## C1-R10b — Native unbound-draft create-flow repair alongside C2-R00 (2026-10-19)

**Fixed production/test source checkpoint before this docs commit:** `4edd1ddfc899fa7eb622e946412a0ec21c938e06`; Draft PR #144, unmerged, exact Gate O not attested.

**Observed blocking bug:** R09 had a real native manual-item form but `CreateCaseDialog.tsx` required `selectedTemplate` to be non-null, so if the 50 B4 domain templates remained correctly `candidate-held` and no real policy was published, the end user could not even create a new V3 case to reach C1. Silently promoting B candidate templates to satisfy the form would violate B-CR-001/Policy Gate L.

**Actual fix in five C-owned production paths:** `CreateCaseDialog.tsx` allows a title/applicant-only, explicitly unbound native draft and makes the dropdown optional; no force-autoselect of the only published template. A deliberate empty choice is sent as `reviewTemplate: null` through `review-actions-controller.ts`, typed `preload/index.ts`, trusted Main `review-ipc.ts`, then `native-workspace-case-v3.ts`. **Explicit null is distinct from absent value:** C Main *guarantees* `templateId='pending-template-v3', templateVersion=0` and no `CanonicalPlan`; it must not secretly map a published default template into the Case. Explicit published choices still undergo real `getTemplate(id,version).status === 'published'` validation. `CaseManagerBar.tsx` displays the pending status truthfully rather than claiming an inferred default is already installed. No V1 `case.json`, no school policy/Gold, no legitimate Run approval is introduced.

**New real Main-handler regression** in `review-v3-legacy-entry-gates.test.ts` creates a native draft with `reviewTemplate:null`, asserts pending template/version 0, absent Plan/legacy shadow, durable Create Receipt and selector visibility. Previous R06–R09 manual-source Main/UI tests still apply.

**Concentrated Gate O evidence required (same exact final SHA):** all commands in C2-R00/R09 above plus
```bash
bun test --isolate apps/electron/src/main/lib/review/review-v3-legacy-entry-gates.test.ts apps/electron/src/renderer/components/content-review/review-actions-controller.test.ts
bun run --filter='@profer/electron' build:renderer
```
After passing Gate O, Gate E should exercise unbound draft with 0 published templates, then real OS picker/import, source-bound human item, archive/restore, duplicate lost-response and case-switch. This sequence is **not yet verified** here. C1 still `PARTIAL`, C2 still technical ledger only, Gate E/L/P `NO_GO`.

**Rollback:** revert C1-R10b UI/preload/Main semantics together rather than leave a mismatched `null` contract; retain persisted pending native Cases/Receipt/history. No I lease changes.
