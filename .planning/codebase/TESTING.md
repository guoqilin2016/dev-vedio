# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**
- 未在 `package.json` 中检测到 `test` 脚本。
- 未检测到 `jest.config.*`、`vitest.config.*`、`playwright.config.*`；仓库当前没有应用级测试运行器配置。

**Assertion Library:**
- 未检测到 Jest、Vitest、Testing Library、Supertest 或其他断言/测试库依赖。

**Run Commands:**
```bash
npm run typecheck       # 当前唯一自动化静态检查；2026-03-21 实测退出码为 0
npm run studio          # 手动在 Remotion Studio 预览 composition
npm run server:dev      # 手动验证 Express API
npm run render:openclaw # 手动做端到端渲染烟雾检查
```

## Test File Organization

**Location:**
- 在排除 `node_modules`、`.opencode`、`out` 后，仓库未检测到任何 repo-owned `*.test.*` 或 `*.spec.*` 文件。

**Naming:**
- 不适用；当前没有业务测试文件可归纳命名规则。

**Structure:**
```text
No test directories or repo-owned test files detected under `src/`, `scripts/`, `public/` or project root.
```

## Test Structure

**Suite Organization:**
```typescript
Not applicable: no application test suites detected.
```

**Patterns:**
- Setup pattern: 未检测到。
- Teardown pattern: 未检测到。
- Assertion pattern: 未检测到。

## Mocking

**Framework:** Not detected

**Patterns:**
```typescript
Not applicable: no mocks, stubs, spies, or test helpers are defined in the repository.
```

**What to Mock:**
- `src/server/services/renderer.ts` 中的 `@remotion/bundler` 与 `@remotion/renderer` 调用属于高成本外部边界，后续若补测试应优先 mock。
- `src/server/services/tts.ts` 与 `scripts/generate-voiceover-*.ts` 依赖 `child_process.execSync` 和本地文件系统，后续测试应隔离 `child_process`、`fs`。
- `scripts/sync-subtitle-*.ts` 依赖 `music-metadata.parseFile` 读取真实音频元数据，后续测试应 mock 音频时长。
- `src/server/services/digital-human.ts`、`src/server/services/heygen.ts` 存在外部 HTTP 调用和轮询逻辑，后续测试应把网络层替换成假响应。

**What NOT to Mock:**
- `src/components/KaraokeSubtitle.tsx` 导出的 `generateSubtitleLines`、`generateSubtitlesFromScripts` 是纯文本/帧数逻辑，适合直接做纯单元测试。
- `src/compositions/*/animations.ts` 中的帧驱动函数，如 `src/compositions/OpenClawAI/animations.ts`，适合直接断言返回值区间与关键帧输出。

## Fixtures and Factories

**Test Data:**
```typescript
Current state: no `__fixtures__`, `__mocks__`, factory helpers, or shared test data modules detected.
```

**Location:**
- 未检测到任何测试夹具目录。
- 现有最接近“固定样本数据”的内容是 `src/data/*.json`、`public/video-configs/nitrogen-ai.json` 和 `public/subtitle-config.json`，但它们当前用于运行时/脚本流程，不是测试夹具。

## Coverage

**Requirements:** None enforced
- `AGENTS.md` 里写有“单元测试通过（覆盖率 ≥90%）”的流程要求，但仓库当前没有任何覆盖率工具、测试脚本或 CI 来测量它。
- 由于没有 repo-owned 测试文件，当前覆盖率只能判定为“未建立量化机制”；不能从仓库事实推出实际百分比。

**View Coverage:**
```bash
Not available: `package.json` has no coverage command and the repo has no coverage config.
```

## Test Types

**Unit Tests:**
- 未使用。
- 最适合最先补齐的纯函数入口是 `src/components/KaraokeSubtitle.tsx` 和各 composition 的 `animations.ts`，因为它们不依赖网络、Remotion bundling 或外部进程。

**Integration Tests:**
- 未使用。
- 最高价值的集成入口是 `src/server/index.ts` 挂载出的路由：`src/server/routes/render.ts`、`src/server/routes/tts.ts`、`src/server/routes/digital-human.ts`、`src/server/routes/heygen.ts`。

**E2E Tests:**
- 未使用。
- 当前只存在人工 E2E 流程：`npm run studio` 预览、`npm run render:*` 生成视频、以及对 `src/server/index.ts` 暴露的 HTTP 接口做手工请求。

## Current Quality Gates

**Automated today:**
- `package.json` 的 `npm run typecheck` 是唯一仓库内定义的自动化检查。
- 2026-03-21 实测 `npm run typecheck` 通过。

**Missing today:**
- 无 `lint` 脚本。
- 无 `test` 脚本。
- 无覆盖率脚本。
- 未检测到 `.github/workflows/` 或其他 CI 配置文件。

## Recommended Entry Points

**1. Pure helper tests first**
- 从 `src/components/KaraokeSubtitle.tsx` 开始，覆盖中文标点拆分、`startFrame`/`endFrame` 分配、空白文本与长文本边界。
- 接着补 `src/compositions/OpenClawAI/animations.ts`、`src/compositions/ClawSkills/animations.ts`、`src/compositions/SuperPowers/animations.ts` 的关键帧输出测试。

**2. API contract tests second**
- 对 `src/server/routes/render.ts` 和 `src/server/routes/tts.ts` 加请求校验测试，优先断言 `400` 响应形状、`details` 字段和 `Unknown error` fallback。
- 对 `src/server/routes/digital-human.ts`、`src/server/routes/heygen.ts` 补输入校验与服务失败分支测试。

**3. Service boundary tests third**
- `src/server/services/tts.ts` 需要覆盖缓存命中、provider 分支和未实现 provider 的失败返回。
- `src/server/services/renderer.ts` 需要覆盖 bundle 缓存命中、渲染成功返回与异常返回。

**4. Script regression checks last**
- `scripts/sync-subtitle-openclaw.ts` 及其同类脚本最适合做“给定音频时长，产出 sceneDurations 与 subtitle JSON”的回归测试。
- 这些脚本现在存在明显重复；若要系统化测试，先抽公共逻辑到 `src/shared/` 或 `scripts/lib/` 会更容易维护。

## Common Patterns

**Async Testing:**
```typescript
Not applicable in current repo state: no async test pattern exists yet.
```

**Error Testing:**
```typescript
Not applicable in current repo state: no error assertion pattern exists yet.
```

---

*Testing analysis: 2026-03-21*
