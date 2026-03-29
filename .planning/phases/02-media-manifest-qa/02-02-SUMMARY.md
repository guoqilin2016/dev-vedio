---
phase: 02-media-manifest-qa
plan: 02
subsystem: qa-gate
tags: [preflight, renderer, api, blocking, validation]
requires:
  - phase: 02-01
    provides: machine-readable media manifest and shared timing schema
provides:
  - Shared preflight QA rules and issue schema
  - CLI media check command with non-zero exit on failure
  - Render/API hard block when manifest drifts
affects: [phase-2, api, renderer, production-safety]
tech-stack:
  added: []
  patterns: [shared preflight validator, fail-fast render gate, issue-coded diagnostics]
key-files:
  created:
    - src/shared/preflight-qa.ts
    - src/shared/preflight-qa.test.ts
    - scripts/preflight-media.ts
  modified:
    - package.json
    - src/shared/types.ts
    - src/server/services/renderer.ts
    - src/server/routes/render.ts
key-decisions:
  - "preflight 先作为 render 前硬门禁引入，不把问题降级成 warning。"
  - "失败响应必须携带 issue code、field 和 scene 信息，避免只给通用错误句。"
patterns-established:
  - "Pattern: media QA 先跑 shared validator，再由 CLI 和 API 共用结果。"
  - "Pattern: 真实接口阻断用受控数据漂移验证，而不是只看单元测试。"
requirements-completed: [MEDIA-02, MEDIA-03]
duration: 22min
completed: 2026-03-29
---

# Phase 2: Media Manifest 与 QA 门禁 Summary

**render 现在会在正式输出前做媒体一致性检查，manifest 有问题时会直接停并返回定位信息**

## Performance

- **Duration:** 22 min
- **Started:** 2026-03-29T09:06:00+08:00
- **Completed:** 2026-03-29T09:28:00+08:00
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- 新增共享 `preflight-qa` 规则，覆盖缺音频、缺字幕、scene count 漂移、总时长漂移和 catalog 漂移
- 新增 `media:check` / `media:check:aiharnessengineer` 命令，失败时会返回非零退出码
- `render` API 已接入硬阻断，真实请求在 manifest 被故意改坏时会直接失败并返回 issue details

## Task Commits

本次按 inline execute-phase 完成，未单独切原子 git commit；原因是仓库存在大量并行中的未提交改动。所有任务都已通过本地验证代替 commit spot-check。

1. **Task 1: 定义共享 preflight QA issue schema 与校验规则** - not committed (validated with `npx vitest run src/shared/preflight-qa.test.ts`)
2. **Task 2: 增加统一 preflight 命令并输出定位式结果** - not committed (validated with `npm run media:check:aiharnessengineer`)
3. **Task 3: 把 preflight QA 接进 renderer 和 render route 的失败阻断** - not committed (validated with real `curl POST /api/render` failure path)

## Files Created/Modified
- `src/shared/preflight-qa.ts` - issue schema、report schema、shared validator
- `src/shared/preflight-qa.test.ts` - 缺音频 / 缺字幕 / 时长漂移测试
- `scripts/preflight-media.ts` - CLI precheck command
- `package.json` - 新增 `media:check` 与 topic wrapper
- `src/shared/types.ts` - render failure details 类型
- `src/server/services/renderer.ts` - render 前 QA gate
- `src/server/routes/render.ts` - 返回 issue details

## Decisions Made
- 只对有字幕 / 媒体管线的 composition 强制执行 preflight，避免 demo 模板被无意义地卡住。
- 真实接口验证采用“故意改坏 manifest -> 调 API -> 确认被拦住 -> 立即恢复”的方式，确保门禁不是假逻辑。

## Deviations from Plan

### Auto-fixed Issues

**1. [Blocking] preflight 的通过样本必须与 catalog 中的真实总时长对齐**
- **Found during:** `src/shared/preflight-qa.test.ts`
- **Issue:** 最初测试样本只构造了 2 个 scene，导致 preflight 正确报出 `catalog-duration-mismatch`
- **Fix:** 将测试样本改为与 `AIHarnessEngineer` 的真实 7 段时长保持一致
- **Files modified:** `src/shared/preflight-qa.test.ts`
- **Verification:** `npx vitest run src/shared/preflight-qa.test.ts`

---

**Total deviations:** 1 auto-fixed (1 blocking)  
**Impact on plan:** 这是测试口径修正，没有扩大范围。

## Issues Encountered

- 真实 API 阻断会先触发 Remotion bundle，再在 render 前失败；这没有影响正确性，但后续可以继续优化成更早失败。

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 的 3 个 requirement 已经都有对应实现和验证
- Phase 3 可以直接建立在 manifest + QA gate 的稳定流水线上抽模板

---
*Phase: 02-media-manifest-qa*
*Completed: 2026-03-29*
