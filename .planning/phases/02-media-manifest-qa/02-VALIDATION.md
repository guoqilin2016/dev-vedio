---
phase: "02"
slug: media-manifest-qa
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-29
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/shared/media-manifest.test.ts src/shared/preflight-qa.test.ts` |
| **Full suite command** | `npm run typecheck && npm run test` |
| **Estimated runtime** | ~35 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/shared/media-manifest.test.ts src/shared/preflight-qa.test.ts`
- **After every plan wave:** Run `npm run typecheck && npm run test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 35 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | MEDIA-01 | unit | `npx vitest run src/shared/media-manifest.test.ts` | ❌ new | ⬜ pending |
| 02-01-02 | 01 | 1 | MEDIA-01 | integration | `npx tsx scripts/build-media-manifest.ts --id AIHarnessEngineer` | ❌ new | ⬜ pending |
| 02-01-03 | 01 | 1 | MEDIA-01 | unit | `npx vitest run src/shared/media-manifest.test.ts` | ❌ new | ⬜ pending |
| 02-02-01 | 02 | 2 | MEDIA-02 | unit | `npx vitest run src/shared/preflight-qa.test.ts` | ❌ new | ⬜ pending |
| 02-02-02 | 02 | 2 | MEDIA-02, MEDIA-03 | integration | `npm run typecheck && npx vitest run src/shared/preflight-qa.test.ts src/server/**/*.test.ts` | ❌ partial | ⬜ pending |
| 02-02-03 | 02 | 2 | MEDIA-03 | manual+integration | `curl -s -X POST http://localhost:3000/api/render -H 'content-type: application/json' -d '{...}'` | ❌ env | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.
- New tests required during execution:
  - `src/shared/media-manifest.test.ts`
  - `src/shared/preflight-qa.test.ts`
  - `src/server/**/*.test.ts` only if route / renderer guard behavior needs direct regression coverage

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Render is blocked when catalog duration and manifest total diverge | MEDIA-02, MEDIA-03 | 需要跑真实 render 入口并观察返回 shape | 先生成 manifest，再故意改错一个 duration，调用 `/api/render`，确认返回 failure 且错误信息包含 scene 或字段名 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or existing infrastructure
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all required new tests
- [x] No watch-mode flags
- [x] Feedback latency < 35s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** planned 2026-03-29
