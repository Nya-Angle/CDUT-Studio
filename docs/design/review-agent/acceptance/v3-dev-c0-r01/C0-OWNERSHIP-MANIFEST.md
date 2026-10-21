# C0 frozen-file ownership (owner of edits, not feature completion)

| Concrete path / file pattern | Sole editing owner | Dev-A / Dev-B access |
|---|---|---|
| `packages/shared/src/types/review-v3-c0.ts` and `packages/shared/src/types/index.ts` | **Dev-C (frozen)** | imports only; approved Change Request |
| `apps/electron/src/main/lib/review/review-ipc.ts` | **Dev-C (integration)** | interface request only |
| `apps/electron/src/main/lib/review/review-c0-authority.ts` and `review-ipc-actor-guard.ts` | **Dev-C (security)** | interface request only |
| `apps/electron/src/main/lib/review/review-c0-case-service.ts`, `application-service.ts`, `case-store-v2.ts` | **Dev-C (CaseAggregate/CAS)** | no other current writer |
| `apps/electron/src/main/lib/review/workspace-service-v2.ts`, `workspace-business-service-v2.ts`, `batch-store.ts`, `run-store-v2.ts` | **Dev-C** | events or read-only snapshots |
| `apps/electron/src/main/lib/review/pi-case-review-service.ts` | **Dev-C integration** | A/B adapters via request |
| `apps/electron/src/preload/index.ts`, `apps/electron/src/renderer/components/content-review/**` | **Dev-C** | shared facade requests only |
| `apps/electron/src/main/lib/review/review-pi-owner-adapter*.ts`, `review-execution-event-adapter*.ts` (new paths) | **Dev-A** | Dev-C accepts proposals |
| `apps/electron/src/main/lib/review/review-source-version-adapter*.ts`, `review-template-plan-adapter*.ts`, `review-intake-adapter*.ts` (new paths) | **Dev-B** | Dev-C accepts Plan/Source |
| `docs/design/review-agent/acceptance/v3-dev-c0-r01/**` | **Dev-C** | consumption only |

Name collisions or changes to the listed shared files default to **Dev-C-owned** until an approved Change Request. No Agent or Renderer may directly write the current CaseAggregate/Run/Decision outside the designated business owner. Schema version: `review-c0/1`.
