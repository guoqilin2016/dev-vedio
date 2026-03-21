# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- React 组件、Remotion 场景和 composition 文件使用 PascalCase，如 `src/components/KaraokeSubtitle.tsx`、`src/compositions/OpenClawAI/Scenes/HookScene.tsx`、`src/compositions/TextPresentation/index.tsx`。
- 目录入口统一使用 `index.ts` 或 `index.tsx`，如 `src/index.ts`、`src/compositions/index.ts`、`src/components/index.ts`。
- Express 路由模块与自动化脚本使用 kebab-case，如 `src/server/routes/digital-human.ts`、`scripts/generate-voiceover-openclaw.ts`、`scripts/sync-subtitle-openclaw.ts`。

**Functions:**
- 普通函数与服务函数使用 camelCase，如 `generateSubtitleLines`、`generateTTS`、`renderVideo`、`clearBundleCache`。
- React 组件和 Scene 组件使用 PascalCase，并以具名导出声明，如 `OpenClawAI`、`HookScene`、`KaraokeSubtitle`。

**Variables:**
- 局部变量、props 解构和辅助常量使用 camelCase，如 `sceneStartFrames`、`voiceoverFiles`、`parseResult`、`currentSceneIndex`。
- 真正常量使用 `UPPER_SNAKE_CASE` 或全大写 schema 常量，如 `DEFAULT_VIDEO_CONFIG`、`SCENE_COUNT`、`PUNCTUATION_REGEX`。

**Types:**
- 接口、类型别名、Props 类型使用 PascalCase，如 `RenderRequest`、`TTSResponse`、`OpenClawAIProps`、`SubtitleLine`。
- Zod schema 统一以 `Schema` 后缀命名，如 `RenderRequestSchema`、`TextPresentationSchema`、`SubtitleConfigSchema`。

## Code Style

**Formatting:**
- 根目录未检测到 `.prettierrc*`、`biome.json` 或格式化脚本；`package.json` 也未定义 `lint`/`format` 命令。
- 代表性源码 `src/Root.tsx`、`src/server/routes/render.ts`、`src/components/KaraokeSubtitle.tsx`、`scripts/sync-subtitle-openclaw.ts` 保持 2 空格缩进、分号结尾。
- `src/` 下 TypeScript/TSX 主要使用双引号；脚本层存在个别混用单引号的遗留写法，如 `scripts/translate-subtitles.ts`，说明字符串风格靠人工维持，没有自动统一。

**Linting:**
- 未检测到 `eslint.config.*`、`.eslintrc*`、`biome.json` 或任何 lint 脚本。
- 当前唯一稳定的自动化静态门槛是 `package.json` 中的 `npm run typecheck`，对应 `tsc --noEmit`。

## Import Organization

**Order:**
1. 第三方依赖先导入，如 `react`、`remotion`、`express`、`zod`。
2. 再导入同层或上层本地模块，如 `./schema`、`../../components/KaraokeSubtitle`、`../services/renderer`。
3. Scene 列表或 barrel 导入通常与工具导入分组书写，如 `src/compositions/TextPresentation/index.tsx`、`src/compositions/OpenClawAI/index.tsx`。

**Path Aliases:**
- `tsconfig.json` 配置了 `@/* -> src/*`。
- 全仓库源码未检测到 `@/` 实际用法；当前惯例是继续使用相对路径，如 `../../components/KaraokeSubtitle`、`./routes/render`。

## Type And Schema Usage

**Boundary validation:**
- 对外输入边界使用 Zod 校验。共享 API 合同放在 `src/shared/types.ts`，路由局部请求 schema 放在对应路由文件，如 `src/server/routes/tts.ts`、`src/server/routes/digital-human.ts`、`src/server/routes/heygen.ts`。
- Composition props 统一在各自 `schema.ts` 中声明，并从 schema 推导类型，如 `src/compositions/OpenClawAI/schema.ts`、`src/compositions/AgencyAgents/schema.ts`。

**Type derivation:**
- Composition 输入类型通过 `z.infer<typeof ...Schema>` 派生，如 `src/compositions/TextPresentation/schema.ts`、`src/compositions/PuaSkill/schema.ts`。
- 服务层和共享模块在 schema 之外仍大量使用显式接口，如 `src/shared/types.ts`、`src/server/services/tts.ts`。

**Schema/defaultProps alignment:**
- `src/Root.tsx` 为每个 `Composition` 同时绑定 `schema` 和 `defaultProps`，这里是 runtime 合同的人工同步点。
- 预计算字幕 JSON 依赖 `tsconfig.json` 中的 `resolveJsonModule`，并在 `src/Root.tsx` 通过 `import ... from "./data/*.json"` 注入到 `precomputedSubtitles`。

**Practical rule for new code:**
- 新增 API、脚本输入或 composition props 时，先在边界定义 schema，再导出推导类型；不要直接用裸 `any` 或未校验的 `req.body`。

## Error Handling

**Patterns:**
- Express 路由统一使用 `safeParse` 校验请求体，失败时返回 `400` 和结构化错误信息，见 `src/server/routes/render.ts`、`src/server/routes/tts.ts`。
- 异步路由统一包裹 `try/catch`，错误消息规范化为 `error instanceof Error ? error.message : "Unknown error"`，见 `src/server/routes/render.ts`、`src/server/routes/tts.ts`、`src/server/routes/heygen.ts`。
- 服务函数更偏向返回 `{ success, error }` 结果对象，而不是把所有错误都向上抛出，见 `src/server/services/renderer.ts`、`src/server/services/tts.ts`、`src/server/services/digital-human.ts`。
- CLI 脚本遇到缺少依赖或前置条件时会直接 `process.exit(1)`，如 `scripts/generate-voiceover-openclaw.ts`、`scripts/generate-digital-human.ts`。

## Logging

**Framework:** `console`

**Patterns:**
- 统一使用 `console.log` / `console.error`，没有结构化日志库。
- 日志偏进度提示和操作反馈，常带 emoji 前缀，如 `src/server/index.ts`、`src/server/services/renderer.ts`、`scripts/generate-voiceover-openclaw.ts`。
- 长流程任务会打印阶段性状态和建议下一步命令，如 `scripts/sync-subtitle-openclaw.ts`、`scripts/generate-heygen.ts`。

## Comments

**When to Comment:**
- 代码中的中文注释主要用于标记区块、解释时序/动画意图或说明 API 端点职责，见 `src/Root.tsx`、`src/server/index.ts`、`src/components/KaraokeSubtitle.tsx`。
- 复杂的帧数计算或字幕拆分逻辑会加短注释解释公式和缓冲区含义，见 `src/components/KaraokeSubtitle.tsx`、`scripts/sync-subtitle-openclaw.ts`。

**JSDoc/TSDoc:**
- 业务源码几乎不用 JSDoc/TSDoc。
- 脚本文件偶尔有文件头注释说明用途和运行方式，如 `scripts/generate-voiceover-openclaw.ts`、`scripts/sync-subtitle-openclaw.ts`。

## Function Design

**Size:**
- 小型 helper 通常保持单一职责，放在 `animations.ts` 或组件文件底部，如 `src/compositions/OpenClawAI/animations.ts`、`src/components/KaraokeSubtitle.tsx`。
- 顶层编排文件可以很大，尤其 `src/Root.tsx` 已达 971 行；大型 Scene 也常在 250-350 行范围，如 `src/compositions/OpenClawAI/Scenes/HopeTruth3Scene.tsx`、`src/compositions/OpenClawAI/Scenes/AnxietyScene.tsx`。

**Parameters:**
- Scene 组件通常直接接收整套 props 类型，如 `React.FC<OpenClawAIProps>`、`React.FC<TextPresentationProps>`，以便每个场景都能读取完整配置。
- 服务函数更偏窄接口输入，如 `renderVideo(request: RenderRequest)`、`generateTTS(request: TTSRequest)`。

**Return Values:**
- 动画和字幕 helper 返回 plain object、number 或数组，如 `fadeInUp`、`generateSubtitleLines`。
- 服务层异步函数返回显式 `Promise<T>`，路由层通过早返回处理失败分支。

## Module Design

**Exports:**
- `src/compositions/index.ts`、`src/components/index.ts` 使用 barrel file 汇总对外导出。
- 单个组件/路由模块常同时保留具名导出和 `export default`，如 `src/compositions/OpenClawAI/index.tsx`、`src/server/routes/render.ts`、`src/components/KaraokeSubtitle.tsx`。

**Barrel Files:**
- 组件层和 composition 层使用 barrel file 组织导出。
- `src/server/` 没有统一 barrel；路由和服务通过相对路径直连。

## Remotion Conventions

**Composition structure:**
- 复杂视频模板目录普遍遵循 `schema.ts` + `index.tsx` + `animations.ts` + `Scenes/` 结构，如 `src/compositions/OpenClawAI/`、`src/compositions/AgencyAgents/`、`src/compositions/AutoResearch/`。
- `src/index.ts` 只负责 `registerRoot(RemotionRoot)`；`src/Root.tsx` 是 composition 注册表和默认 props 的集中入口。

**Timing and sequencing:**
- 顶层 composition 组件使用 `useCurrentFrame()`、`useVideoConfig()` 和 `useMemo()` 计算 `sceneStartFrames`、字幕数据与当前场景索引，见 `src/compositions/TextPresentation/index.tsx`、`src/compositions/OpenClawAI/index.tsx`。
- 实际场景切换通过 `Sequence` 组织，音频资源通过 `Audio` / `Video` / `staticFile` 挂载，见 `src/compositions/TextPresentation/index.tsx`。

**Animation style:**
- 主流动画写法使用 Remotion 原语 `spring()`、`interpolate()`、`Easing`，并抽到 `animations.ts` 复用，见 `src/compositions/OpenClawAI/animations.ts`。
- 共享字幕动画也完全基于帧驱动计算，见 `src/components/KaraokeSubtitle.tsx`。
- 当前存在一个偏离主流写法的例外：`src/compositions/OpenClawAI/index.tsx` 的竖屏进度条使用了 `transition: "height 0.3s"`；新代码更应延续其余文件中的帧驱动模式。

**Assets and generated artifacts:**
- 音频素材和脚本输出落在 `public/audio/`，背景音乐放在 `public/music/`，见 `public/music/README.md`。
- 字幕同步脚本会写入 `src/data/*.json` 或 `public/subtitle-*.json`，如 `scripts/sync-subtitle-openclaw.ts`、`public/subtitle-config.json`、`public/subtitle-data.json`。
- Render 输出目录是 `out/`，对应 `src/server/index.ts` 的静态服务和 `package.json` 中的 `render:*` 脚本。

---

*Convention analysis: 2026-03-21*
