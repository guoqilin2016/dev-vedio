# Repository Agent Guide

This file is for agentic coding assistants working in this repo.
Keep changes small, follow existing patterns, and prefer explicit scripts.

## Project summary

- Remotion-based video generation project with an Express API.
- TypeScript, CommonJS modules, strict type checking.
- Render outputs are written to `out/`.

## Key paths

- `src/index.ts`: Remotion entry.
- `src/Root.tsx`: Composition registration.
- `src/compositions/`: Video templates.
- `src/server/`: Express API.
- `src/shared/types.ts`: Shared types and Zod schemas.
- `public/music/`, `public/audio/`: Assets and generated audio.
- `out/`: Rendered videos (generated).

## Commands (build, lint, test)

Install:

```bash
npm install
```

Dev (Studio + API):

```bash
npm run dev
```

Studio only:

```bash
npm run studio
```

API server:

```bash
npm run server:dev
npm run server:start
```

Build bundle:

```bash
npm run build
```

Render outputs:

```bash
npm run render
npm run render:presentation
npm run render:nitrogen
npm run render:openclaw
```

Custom render example:

```bash
npx remotion render src/index.ts HelloWorld --output=out/custom.mp4 --props='{"title":"Custom"}'
```

Type check:

```bash
npm run typecheck
```

Lint:

- No lint script configured in `package.json`.

Tests:

- No test runner or test scripts configured in `package.json`.
- No Jest/Vitest config detected.

Single test:

- Not available until a test runner is added.
- If you add one, document the exact single-test command here.

## Environment variables

- `DID_API_KEY`: required for digital human generation.

## Code style and conventions

Formatting:

- 2-space indentation.
- Semicolons.
- Double quotes for strings.
- Trailing commas in multi-line objects and arrays.

Imports:

- External packages first, then local imports.
- Use relative imports for local modules.
- Path alias: `@/*` maps to `src/*` (see `tsconfig.json`).

Naming:

- React components: PascalCase.
- Variables and functions: camelCase.
- Constants: UPPER_SNAKE_CASE.
- Files: PascalCase for components, kebab-case for route modules.

TypeScript:

- `strict: true` and `noEmit` for type checks.
- Avoid `any`; model data via types and Zod schemas.
- Keep props serializable (Remotion compositions).

Remotion patterns:

- Register compositions in `src/Root.tsx`.
- Define `schema` for each composition and keep `defaultProps` aligned.
- Composition IDs are part of the API contract; change carefully.

API patterns:

- Express routers live in `src/server/routes/`.
- Services live in `src/server/services/`.
- Validate input with Zod `safeParse` and return 400 on failure.
- Return JSON with `success` and `error` when applicable.

Error handling:

- Use `try/catch` in async route handlers.
- Normalize errors with `error instanceof Error ? error.message : "Unknown error"`.
- Avoid swallowing errors; return a 500 with a clear message.

Logging:

- Use `console.log`/`console.error` for progress and errors.
- Keep logs short and actionable.

Assets and outputs:

- Put background music in `public/music/`.
- TTS audio outputs in `public/audio/`.
- Rendered videos go to `out/`.

## Data and scripts

- Subtitle JSON lives under `src/data/`.
- Utility scripts live in `scripts/` and are run via npm scripts.

## Cursor / Copilot rules

- No `.cursor/rules/` or `.cursorrules` found.
- No `.github/copilot-instructions.md` found.
- Reference: `docs/review-gate-v2-rule-cn.md` describes a Cursor rule users may opt into.

## Video generation workflow (end-to-end)

When creating a new video composition from scratch, follow this proven pipeline:

### 1. Composition architecture

- Each video lives under `src/compositions/<VideoName>/` with its own `schema.ts`, `animations.ts`, `index.tsx`, and `Scenes/` directory.
- Export from `src/compositions/index.ts` and register in `src/Root.tsx`.
- For vertical short videos (9:16), use `width: 1080, height: 1920`.
- For horizontal videos (16:9), use `width: 1920, height: 1080`.

### 2. Scene design pattern

- Each scene is a standalone React component receiving the full props type.
- Use `useCurrentFrame()` and `useVideoConfig()` for all timing.
- Create shared animation utilities in `animations.ts` (fadeInUp, fadeIn, glitchOffset, typewriter, progressBar, etc.).
- Use `spring()` for natural motion, `interpolate()` for linear mappings.
- **Never use CSS transitions/animations** — they won't render correctly in Remotion.
- For staggered items, use a `staggerDelay(index, baseDelay)` helper.

### 3. TTS voiceover pipeline

Script naming: `scripts/generate-voiceover-<name>.ts`

- Use `edge-tts` (must be installed: `pip install edge-tts`).
- Recommended voice: `zh-CN-YunxiNeural` (calm male, good for tech content).
- Use `...` in script text for natural pauses (converted to `，` before TTS).
- Output files: `public/audio/<name>-scene<N>.mp3`.
- Audio file paths in Root.tsx: `audio/<name>-scene<N>.mp3` (relative to `public/`).

### 4. Subtitle sync pipeline

Script naming: `scripts/sync-subtitle-<name>.ts`

- Reads actual audio duration from generated mp3 files using `music-metadata`.
- Generates frame-level word timing data.
- Outputs JSON to `src/data/<name>-subtitles.json`.
- Prints `durationInFrames` and `sceneDurations` to update Root.tsx.
- **Always run this after generating voiceover** — the composition's `durationInFrames` and `sceneDurations` must match real audio lengths.

### 5. Render pipeline

```bash
# Step 1: Generate voiceover audio
npm run generate:voiceover:<name>

# Step 2: Sync subtitles (updates JSON + prints config)
npm run sync:subtitle:<name>

# Step 3: Update Root.tsx with printed durationInFrames, sceneDurations, precomputedSubtitles

# Step 4: Preview in Studio
npm run studio

# Step 5: Render to MP4
npm run render:<name>
```

### 6. Lessons learned

- **Duration must match audio**: Initial `durationInFrames` estimate will differ from actual TTS audio length. Always sync after TTS generation.
- **Scene durations come from audio**: `sceneDurations` array = each scene's audio length + buffer. Never hardcode these.
- **Precomputed subtitles are essential**: Dynamic subtitle generation without audio timing data produces inaccurate karaoke highlights. Always use `precomputedSubtitles` from the sync script.
- **Zero external asset dependency is achievable**: All UI elements (terminals, browsers, dashboards, chat bubbles, progress bars) can be built with React + inline styles + emoji. No screenshots or external images needed.
- **Keep animations simple but layered**: Combine fadeInUp + glitch + scanlines + HUD borders for "tech feel" without complex dependencies.

### 7. 竖屏短视频 (9:16) 设计规范

#### 布局规范
- **分辨率**: 1080 x 1920
- **内容安全区**: `top: 0, bottom: 500` — 所有核心内容必须在距底部 500px 以上
- **字幕位置**: `bottom: 380` — 避开视频号/抖音底部标题、合集、操作栏
- **内容与字幕间距**: 至少 120px
- **内容居中**: 使用 flexbox (`justifyContent: "center"`) + 安全区容器
- **安全区容器模板**: `position: absolute; top: 0; left: 0; right: 0; bottom: 500; display: flex; flexDirection: column; justifyContent: center; padding: 0 40px;`

#### 字体大小规范 (1080px 宽度)
| 元素类型 | 推荐字号 | 备注 |
|---------|---------|------|
| 场景主标题 | 56-66px | fontWeight: 900 |
| 场景副标题 | 42-50px | fontWeight: 700 |
| 内容正文 | 28-36px | fontWeight: 500-600 |
| 卡片标题 | 30-42px | fontWeight: 800 |
| 卡片描述 | 18-24px | color: #777-#999 |
| 标签/Tag | 14-20px | letterSpacing: 3-10, 大写英文 |
| 核心数字 | 56-110px | fontFamily: monospace, fontWeight: 900 |
| CTA 金句 | 40-54px | 带发光 textShadow |
| 字幕 | 44px | fontSize in subtitle config |
| Hashtag | 20-24px | color: #444, letterSpacing: 4 |

#### 封面 (第一帧) 规范
- **第一帧必须是完整封面**，不能是黑屏或淡入中间状态
- 核心元素（Logo、标题、关键数据）在 frame 0 时 opacity: 1, scale: 1
- 使用 `coverPhase = frame < 3` 判断，覆盖动画初始状态
- 数字类元素显示最终值（如 "84k+"），不要从 0 开始动画
- 背景渐变/光效从 frame 0 就要可见
- 动画效果（glitch、spring）从 frame 5-10 后再开始

#### 颜色方案模板
```
深色科技风:
  backgroundColor: "#070810"  // 深色背景
  accentColor: "#8b5cf6"      // 主色（紫色）
  highlightColor: "#06b6d4"   // 高亮（青色）
  successColor: "#10b981"     // 成功（绿色）
  dangerColor: "#ef4444"      // 危险/警告（红色）
  secondaryColor: "#f97316"   // 次要强调（橙色）
  goldColor: "#ffd700"        // 金色（评分/星级）

暗色赛博风（OpenClawAI）:
  backgroundColor: "#0a0a0f"
  accentColor: "#00f0ff"
  highlightColor: "#4d7cff"

暖色科技风（ClawSkills）:
  backgroundColor: "#0a0a12"
  accentColor: "#ff6b35"
  highlightColor: "#00e5ff"
  goldColor: "#ffd700"
```

#### 场景设计模式
- **7 场景结构**: Hook → 痛点 → 核心亮点 → 深入1 → 深入2 → 深入3 → CTA
- **每个场景都有**: 顶部英文标签（letterSpacing: 8+）+ 中文大标题 + 内容区 + 底部金句/进度
- **HUD 装饰**: 四角边框（border + opacity 动画）增强科技感
- **背景层**: radial-gradient + 扫描线 repeating-linear-gradient
- **进度条**: 右侧竖条 (width: 3, height: 100) 显示当前场景进度

#### 动画规范
- 标题入场: `fadeInUp(frame, fps, delay, distance=60)` + spring
- 列表/卡片: `staggerDelay(index, 8-12)` 错峰入场
- 数字: `numberCountUp(frame, fps, target, durationSec)` 递增
- 强调: `pulseGlow(frame, fps, speed)` 脉冲发光
- 科技感: `glitchOffset(frame, intensity)` + `scanLineOpacity`
- 卡片: `cardSlideIn(frame, fps, delay)` 滑入 + 缩放
- 管线: `pipelineNodeReveal` + `lineGrow` 节点依次展开

#### 配音规范
- 语音: `zh-CN-YunxiNeural`, rate: `+5%`
- 停顿: 用 `...` 表示，生成前替换为 `，`
- 每段文案: 10-16 秒为宜
- 语速: 中等偏快，适合短视频节奏

#### 平台适配注意事项
- **视频号**: 底部约 350px 被标题、合集、操作栏占用
- **抖音**: 底部约 300px 被信息栏占用
- **小红书**: 底部约 280px 被信息栏占用
- **安全做法**: 字幕 `bottom: 380`，内容底线 `bottom: 500`

## Composition catalog

| ID | Format | Duration | Description |
|----|--------|----------|-------------|
| HelloWorld | 16:9 | 5s | Simple demo |
| TextPresentation | 16:9 | ~52s | 豆包日活破亿 (6-scene presentation) |
| NitrogenAI | 16:9 | ~89s | 英伟达Nitrogen AI (6-scene presentation) |
| OpenClawAI | 9:16 | ~95s | AI工具短视频 (7-scene vertical short video) |
| ClawSkills | 9:16 | ~106s | ClawHub TOP 20 神级Skill (7-scene vertical short video) |
| SuperPowers | 9:16 | ~104s | SuperPowers AI编程范式转移 (7-scene vertical short video) |

## Notes for agents

- Prefer updating existing compositions instead of adding new ones without schema.
- Keep API and composition changes in sync (IDs, props, schemas).
- Update this file when new scripts or lint/test tooling are added.
- When creating a new video, follow the "Video generation workflow" section above.
- Always run `npm run typecheck` after changes to catch type errors early.
