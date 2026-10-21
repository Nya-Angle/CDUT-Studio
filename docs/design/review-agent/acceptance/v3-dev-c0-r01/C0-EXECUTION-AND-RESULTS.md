# C0 R01 reproducibility & remaining gates

## Actual operations
- Fixed main input: `8989941b6fb5651564e32d11c4215b6a6d5a5209`; #140 evidence `7f954661b3dbca7f0707832c2d097d9c68a965b4`.
- GitHub connector branch/ref API used to create `feat/v3-dev-c-c0-contract-r01` at the fixed M SHA, with no local existing worktree touched.
- Original working-tree `git status --porcelain`, `git worktree list`: **NOT_OBSERVABLE** remotely. Local container cannot resolve github.com; Bun unavailable. Remote CI (if triggered) is independent.

## Reproduce in a clean local worktree
```bash
git fetch origin
git worktree add ../review-v3-c0 feat/v3-dev-c-c0-contract-r01
cd ../review-v3-c0
git status --porcelain; git rev-parse HEAD; git worktree list --porcelain
export HOME="$(mktemp -d)"
export PROFER_CONFIG_DIR="$(mktemp -d)"
bun --version
bun install --frozen-lockfile
bun run typecheck
bun run check:boundaries
bun test --isolate packages/shared/src/types/review-v3-c0.test.ts apps/electron/src/main/lib/review/review-c0-ipc.test.ts
bun test --isolate apps/electron/src/main/lib/review/case-store-v2.test.ts apps/electron/src/main/lib/review/review-ipc-actor-guard.test.ts apps/electron/src/main/lib/review/review-ipc-path.test.ts
```

Preserve exact stdout, stderr and exit codes, first failure and fixes; do not count earlier #139 239 scoped tests as fresh C0 PASS. Synthetic handler test does NOT equal real Electron Renderer exploit or school Credential. Missing local target/CI tests mandate `C0_NOT_FROZEN`.

## Explicitly unresolved (NOT fixed by C0)
ARCH-003 D4/P06 archive validity; ARCH-007/008 batch exact Run finalizer; cross-file intents/Outbox and cross-PID; Owner L1-07 revocation; school-teacher live Credential and authorized school writes; target Electron GUI/Provider/Gold; future C1–C5. No start of C1 here.
