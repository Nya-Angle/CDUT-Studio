# Adapter Change Request — mandatory protocol

A/B submit `CHANGE_REQUEST { id, C0_base_sha, owner, files, DTO_before, DTO_after, schema_version, transport_vs_persistence, authorization_impact, migration_or_reject, targeted_tests, rollback }` in a reviewable issue/PR note.

Dev-C decides *APPROVED* or *REJECTED* before touching a frozen path. Approved change is implemented once by Dev-C on the C integration branch, with schema fingerprint change and focused negative tests; A/B each rebase cleanly on an agreed integration commit, rerun own adapter tests and main/CAS gates. Rejected proposal must not fork the C0 schema. Rollback restores the previous immutable C0 SHA and the prior adapter mapping; no silent lowering of Source/Run/Plan version checks.

Until C0_FROZEN_GO, A/B may only investigate read-only or prepare fixtures. Avoid whole-file cherry-pick of P06/D4 into shared Main/Preload.
