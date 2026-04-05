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
- `src/shared/animations.ts`: Shared animation utilities (base library).
- `src/shared/animations-vertical.ts`: Vertical video animation extensions (re-exports base + adds vertical-specific).
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
npm run render:pencildev
npm run render:pencildev:cover
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
- Import animation helpers from `src/shared/animations-vertical.ts` (vertical shorts) or `src/shared/animations.ts` (base); each composition’s `animations.ts` re-exports shared utilities, with composition-specific overrides kept local.
- Use `spring()` for natural motion, `interpolate()` for linear mappings.
- **Never use CSS transitions/animations** — they won't render correctly in Remotion.
- For staggered items, use a `staggerDelay(index, baseDelay)` helper.

### 3. TTS voiceover pipeline

Script naming: `scripts/generate-voiceover-<name>.ts`

- Use `edge-tts` (must be installed: `pip install edge-tts`).
- Recommended voice: `zh-CN-YunyangNeural` (professional male, natural and reliable, best for tech explainer content).
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

# Step 6: Generate platform copy (auto-generated, no user prompt needed)
# See "平台发布文案规范" section below
```

### 5.1 平台发布文案规范

**在视频创建完成后，必须自动生成以下发布文案，无需用户提示。**

#### 微信视频号

**短标题** (限16字以内):
- 必须包含核心关键词（项目名/人名/数字亮点）
- 使用动词驱动（"开源"、"狂揽"、"碾压"、"颠覆"）
- 制造冲击感，让人想点进来
- 示例格式: `[人名/项目名][动作][核心亮点]`

**备选标题** (提供2-3个):
- 从不同角度切入（数据角度、痛点角度、结论角度）
- 每个都控制在16字以内

**视频描述** (正文):
- 结构: 开场一句话抓人 → 核心数据/亮点 → 关键机制 → 效果/案例 → 金句收尾 → 传送门链接 → Hashtag
- 每行一个信息点，不超过20字/行
- 用 `→` `·` 等符号增强节奏感
- 数字用阿拉伯数字突出（4.4w+、630行、0.8B）
- 结尾必须附项目链接（如适用）

**Hashtag 规范**:
- 6-8个标签
- 优先: 项目名、人名、领域标签（#AI编程 #GitHub #开源项目）
- 使用 `#` 前缀，空格分隔

#### 抖音/小红书 (如需适配)

- 标题风格更口语化、更有情绪
- 描述更短（3-5行），emoji 可适当使用
- Hashtag 数量 4-6 个

#### 文案数据来源

- 从 `voiceoverScripts` 和 `defaultProps` 中提取关键数字和金句
- 标题必须包含视频的最核心亮点（Star 数、代码行数、效果对比等）
- 描述的"传送门"链接从用户原始文案中提取

### 5.2 封面图生成规范

**在视频创建完成后，必须自动生成封面图组件和渲染命令，无需用户提示。**

#### 技术实现

- 使用 Remotion `Still` 组件（不是 `Composition`）
- 文件位置: `src/compositions/<VideoName>/Cover.tsx`
- 在 `compositions/index.ts` 中导出, 在 `Root.tsx` 中用 `Still` 注册
- 添加 npm script: `"render:<name>:cover": "remotion still src/index.ts <Name>Cover --output=out/<Name>-cover.png"`

#### 尺寸规范

| 平台 | 尺寸 | 比例 | 说明 |
|------|------|------|------|
| 微信视频号 | 1080 x 1440 | 3:4 | Feed 中竖屏视频封面标准比例 |
| 抖音 | 1080 x 1920 | 9:16 | 与视频同尺寸 |
| 小红书 | 1080 x 1440 | 3:4 | Feed 封面标准比例 |
| B站 | 1920 x 1080 | 16:9 | 横版封面 |

**默认使用微信视频号尺寸 (1080 x 1440)**，如需其他平台可注册多个 Still。

#### 封面设计黄金公式

```
[核心数字大字] + [2-3个关键词] + [深色高对比背景]
```

**必须包含的元素（按视觉层次排列）:**

1. **英文标签** (顶部): 项目名大写，letterSpacing: 16, fontSize: 22
2. **核心 emoji**: 代表项目主题, fontSize: 100
3. **核心数字** (2-3组): 最具冲击力的数据, fontSize: 80, fontFamily: monospace
   - 如 Star 数、代码行数、用户数等
   - 使用金色(#fbbf24)或主题色突出
4. **大字标题** (1-2行): 核心价值主张, fontSize: 64, fontWeight: 900
5. **副标题**: 补充说明/金句, fontSize: 42, 用 highlightColor
6. **信息条**: 作者/平台/关键特性, 用 `|` 分隔, 包在圆角边框内
7. **对比数据** (可选): VS 对比增强冲击力

**背景层:**
- radial-gradient 光晕 (主题色 30% 透明度)
- 第二光晕 (高亮色 15% 透明度)
- 扫描线 repeating-linear-gradient
- 四角 HUD 边框装饰

**颜色沿用视频主色调**, 不单独设计。

#### 封面与视频第一帧的区别

- **封面 (Still)**: 为 Feed 展示优化, 信息密度高, 无动画, 3:4 比例
- **视频第一帧 (HookScene frame 0)**: 为视频播放优化, 9:16 比例, 需要考虑动画初始状态

#### 渲染命令

```bash
# 渲染封面图
npm run render:<name>:cover
# 输出: out/<Name>-cover.png
```

### 6. Lessons learned

- **Duration must match audio**: Initial `durationInFrames` estimate will differ from actual TTS audio length. Always sync after TTS generation.
- **Scene durations come from audio**: `sceneDurations` array = each scene's audio length + buffer. Never hardcode these.
- **Precomputed subtitles are essential**: Dynamic subtitle generation without audio timing data produces inaccurate karaoke highlights. Always use `precomputedSubtitles` from the sync script.
- **Zero external asset dependency is achievable**: All UI elements (terminals, browsers, dashboards, chat bubbles, progress bars) can be built with React + inline styles + emoji. No screenshots or external images needed.
- **Keep animations simple but layered**: Combine fadeInUp + glitch + scanlines + HUD borders for "tech feel" without complex dependencies.
- **Shared animation library eliminates per-composition duplication**: New videos import from `src/shared/animations-vertical.ts` instead of copying animations.
- **Visual components** (`ParticleBackground`, `GlowOrb`, `HudFrame`, `SceneBackground`) replace inline CSS backgrounds for a consistent, upgraded look.
- **Subagent-driven development works well for video compositions**: Breaking implementation into Task-per-batch (schema → scenes → composition → scripts → sync → render) with fresh subagents per task keeps each agent focused and avoids context pollution. TypeScript typecheck between tasks catches integration issues early.
- **GIT_TRACE=1 /usr/local/bin/git commit workaround**: In some environments the default `git commit` alias breaks with `--trailer` errors (git 2.31.0). Use the full path with `GIT_TRACE=1` to bypass.
- **CSS-only icons replace emoji for visual impact**: clip-path polygons (stars), stacked offset rectangles (documents), side-by-side bars (context comparison) are more visually striking than emoji and render consistently across environments.
- **Brainstorming before implementation saves iteration**: Structured Q&A (audience → format → narrative → visual style) + 2-3 approach proposals + section-by-section design approval prevents mid-implementation pivots.
- **Actual TTS duration varies significantly from estimates**: Design spec estimated ~110-130s but actual TTS generated 165s. Always treat the sync script output as the single source of truth for timing.
- **竖屏横向溢出是最常见的视觉缺陷**: 1080px 宽度下，双栏布局、固定像素 grid、长中文文案极易撑出画布。所有 flex 子项必须 `flex: "1 1 0"` + `minWidth: 0`，grid 列用 `minmax(0, 1fr)` 或 `fr` 比例，文本加 `overflowWrap`/`wordBreak`。
- **字幕位置是不可变的锚点**: 字幕 `bottom: 380` 由 `KaraokeSubtitle` 独立绝对定位，不受 BaseScene padding 或内容布局影响。任何布局调整都不能改变这个值。
- **标题渐变色比纯白色更醒目**: 使用 `-webkit-background-clip: text` + `linear-gradient` 实现渐变文字填充，配合 `textShadow` 微发光，在深色背景下视觉冲击力远强于纯白。
- **GitHub 仓库卡片可完全用 React 模拟**: 仓库名、描述、Stars/Forks/Issues 统计、语言条等都可用 inline styles 实现，不需要截图或外部图片。适合开源项目主题的 Hook 场景。
- **Review Gate MCP 作为每次回答后的反馈通道**: 每次回答后调用 `review_gate_chat`，用户可以在弹窗中直接给出后续指令，避免会话中断。

### 7. 竖屏短视频 (9:16) 设计规范

#### 布局规范
- **分辨率**: 1080 x 1920
- **内容安全区**: `top: 0, bottom: 420` — 所有核心内容必须在距底部 420px 以上
- **字幕位置**: `bottom: 380` — 避开视频号/抖音底部标题、合集、操作栏。**任何布局调整都不允许改变字幕位置**
- **内容与字幕间距**: 字幕为单行显示，内容安全区底部与字幕顶部间距约 40px
- **内容居中**: 使用 flexbox (`justifyContent: "center"`) + 安全区容器
- **安全区容器模板**: `position: absolute; top: 0; left: 0; right: 0; bottom: 420; display: flex; flexDirection: column; justifyContent: center; padding: 0 40px;`
- **BaseScene padding 三值简写**: `"上 左右 下"`，通过调整三个值控制内容区范围。推荐范围：上 `80~160px`，左右 `60~100px`，下 `400~520px`

#### 横向防溢出规范

竖屏 1080px 宽度下，内容极易撑出画布。所有布局必须遵循以下防溢出模式：

**flex 布局**:
- 等分子项必须用 `flex: "1 1 0"` + `minWidth: 0`（不能只写 `flex: 1`）
- 固定宽度子项用 `flex: "0 0 Xpx"` + `flexShrink: 0`
- 文本容器必须加 `minWidth: 0` 让 flex 子项可以被压缩

**grid 布局**:
- 等分列用 `minmax(0, 1fr)` 而非 `1fr`（防止内容撑开列宽）
- 避免多列固定像素宽度，改用 `fr` 比例（如 `"2fr 3fr 3fr 2.5fr"`）

**文本换行**:
- 所有可能含长文本的元素必须加 `overflowWrap: "break-word"` 和 `wordBreak: "break-word"`
- badge/tag 元素加 `maxWidth: "100%"` + `overflowWrap: "anywhere"` + `boxSizing: "border-box"`

**Panel 组件**:
- 支持可选 `style` prop 透传样式
- 在 flex/grid 子项中使用时，务必传入 `style={{ minWidth: 0, overflow: "hidden" }}`

**外层容器兜底**:
- BaseScene 的 `<AbsoluteFill>` 加 `overflow: "hidden"` 防止任何内容超出画布

#### 字体大小规范 (1080px 宽度)
| 元素类型 | 推荐字号 | 备注 |
|---------|---------|------|
| 场景主标题 | 64-72px | fontWeight: 900，推荐渐变色填充 |
| 场景副标题 | 36-50px | fontWeight: 700 |
| 内容正文 | 24-36px | fontWeight: 500-600 |
| 卡片标题 | 28-34px | fontWeight: 800-900 |
| 卡片描述 | 22-26px | color: mutedTextColor |
| 标签/Tag | 18-22px | letterSpacing: 3-10, 大写英文 |
| 核心数字 | 52-110px | fontFamily: monospace, fontWeight: 900 |
| CTA 金句 | 44-54px | 带发光 textShadow |
| CTA 正文 | 32-36px | fontWeight: 700 |
| Stats 数值 | 24-28px | fontFamily: monospace, fontWeight: 800 |
| 字幕 | 44px | fontSize in subtitle config |
| Hashtag/Tag pill | 20-24px | color: mutedTextColor, letterSpacing: 4 |
| GitHub 仓库名 | 26-28px | color: highlightColor, fontWeight: 700 |

**注意**: 字号和内容密度需要平衡——信息量大的场景（如 4 列表格、3 列风险卡）字号适当缩小；信息量少的场景（如 CTA）字号可以放大填充空间。

#### 封面 (第一帧) 规范
- **第一帧必须是完整封面**，不能是黑屏或淡入中间状态
- **主题词必须是第一视觉层级**：封面和视频第一帧中，完整主题名（如“飞书 CLI”）必须是最大、最醒目的文字，不能只突出主题中的局部词或缩写
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
- **TitleBlock 组件**: 每个场景共用 `TitleBlock`，包含可选 `label`（英文标签）、`title`（渐变主标题）、`subtitle`（副标题）
- **场景标签 (label)**: 可选。传空字符串 `""` 时不渲染。用于显示如 "SCENE 01 / HOOK" 的顶部标记
- **渐变标题**: 传入 `highlightColor` 后，标题使用 `linear-gradient(135deg, accentColor, highlightColor)` 渐变填充 + 微发光 `textShadow`。不传则使用纯色 `textColor`
- **标题与内容间距**: TitleBlock 自带 `marginBottom` 额外拉开与正文内容的距离，外层 flex 容器 `gap: 40px`
- **HUD 装饰**: 四角边框（border + opacity 动画）增强科技感
- **背景层**: radial-gradient + 扫描线 repeating-linear-gradient
- **进度条**: 横向放在字幕上方（`bottom: 450`，字幕在 `bottom: 380`），宽度随场景进度从左到右填充，颜色使用 `accentColor → highlightColor` 渐变
- **GitHub 仓库卡片**: Hook 场景可使用 React + inline styles 模拟 GitHub 仓库页面（仓库名、描述、Stars/Forks/Issues/PRs 统计、语言条），替代传统双栏对比布局，适合开源项目主题视频

#### 动画规范

- **Source of truth**: Base utilities live in `src/shared/animations.ts`; vertical (9:16) extras live in `src/shared/animations-vertical.ts` (re-exports base + vertical-specific). Each composition’s `animations.ts` should re-export from shared; keep only overrides or one-off helpers in the composition folder.
- **Universal helpers** (`animations.ts`): `fadeInUp`, `fadeIn`, `fadeOut`, `scaleIn`, `slideFromLeft`, `slideFromRight`, `cardSlideIn`, `glitchOffset`, `scanLineOpacity`, `typewriterLength`, `numberCountUp`, `pulseGlow`, `progressBar`, `staggerDelay`, `shimmer`.
- **Vertical extensions** (`animations-vertical.ts`): `pipelineNodeReveal`, `lineGrow`, `chatBubbleIn`, `nodeReveal`, `pressureReveal`, `shakeEffect`, `pipelineGrow`, `loopRotate`.
- **Exception**: PuaSkill defines a **local** `progressBar` override (returns `0..1`, parameter order differs from shared).
- **Usage patterns**: 标题入场 `fadeInUp(frame, fps, delay, distance=60)` + spring; 列表/卡片 `staggerDelay(index, 8-12)`; 数字 `numberCountUp`; 强调 `pulseGlow`; 科技感 `glitchOffset` + `scanLineOpacity`; 卡片 `cardSlideIn`; 管线 `pipelineNodeReveal` + `lineGrow`.

#### 视觉组件

- `src/components/ParticleBackground.tsx`: Floating particle system (SVG-based, Remotion-compatible).
- `src/components/GlowOrb.tsx`: Animated radial glow orbs with spring-driven breathing.
- `src/components/HudFrame.tsx`: Componentized HUD corner brackets; modes `static` | `pulse` | `scan`.
- `src/components/SceneBackground.tsx`: One-stop background layer combining particles, optional glow orbs, HUD, scanlines, and base fill.

**SceneBackground example** (wrap scene content; tune theme colors to the composition):

```tsx
<SceneBackground
  backgroundColor="#070810"
  accentColor="#8b5cf6"
  particles={{ count: 40, color: "#8b5cf6" }}
  hud={{ color: "#8b5cf6", animation: "pulse" }}
>
  {/* scene content */}
</SceneBackground>
```

#### 配音规范
- 语音: `zh-CN-YunyangNeural`, rate: `+3%`
- 停顿: 用 `...` 表示，生成前替换为 `，`
- 每段文案: 10-16 秒为宜
- 语速: 中等偏快，适合短视频节奏

#### 字幕规范

组件: `src/components/KaraokeSubtitle.tsx`

**数据结构**（时间单位为帧，fps=30）:
```ts
interface SubtitleWord { text: string; startFrame: number; endFrame: number; }
interface SubtitleLine { words: SubtitleWord[]; startFrame: number; endFrame: number; }
```

**显示规则**:
- **按标点断句**: 每屏只显示一个标点符号之间的内容（`，。！？、：；` 等作为分隔符）
- **不显示标点符号**: 标点字符从渲染中过滤掉，不出现在画面上
- **文字无间距**: `gap: 0`，中文字符紧密排列，不留空格
- **单行切换动画**: 句子切换时有 `spring` 驱动的 fade-in + 上移 8px 动画
- **无卡拉OK高亮**: 所有文字以统一的 `textColor` 静态显示，不做逐字填充、缩放或发光效果

**配置参数** (`SubtitleConfigSchema`):
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `true` | 是否显示字幕 |
| `fontSize` | `44` | 字幕字号 |
| `position` | `"bottom"` | 位置（top/center/bottom） |
| `highlightColor` | `"#8b5cf6"` | 保留参数，当前未使用（已移除卡拉OK高亮） |
| `textColor` | `"#ffffff"` | 普通文字颜色 |
| `backgroundColor` | `"rgba(7, 8, 16, 0.85)"` | 背景遮罩颜色 |

**数据优先级**:
1. `precomputedSubtitles`（来自同步脚本，帧级精确）— **始终优先使用**
2. `voiceoverScripts` 动态生成（不精确，仅作 fallback）

**同步脚本分词规则** (`scripts/sync-subtitle-<name>.ts`):
- 每 4 个字符切一个 word
- 中文标点单独成 word，占 2 帧
- 每个 word 时长 = `(字符数 / 总字符数) * 场景音频帧数`，最小 2 帧
- 场景字幕起始 = 场景起始帧 + 9 帧延迟

**重要**: 不要使用 CSS transition/animation，所有动画必须用 Remotion 的 `spring()` 和 `interpolate()` 实现。

#### 平台适配注意事项
- **视频号**: 底部约 350px 被标题、合集、操作栏占用
- **抖音**: 底部约 300px 被信息栏占用
- **小红书**: 底部约 280px 被信息栏占用
- **安全做法**: 字幕 `bottom: 380`，内容底线 `bottom: 420`

## Composition catalog

| ID | Format | Duration | Description |
|----|--------|----------|-------------|
| HelloWorld | 16:9 | 5s | Simple demo |
| TextPresentation | 16:9 | ~52s | 豆包日活破亿 (6-scene presentation) |
| NitrogenAI | 16:9 | ~89s | 英伟达Nitrogen AI (6-scene presentation) |
| OpenClawAI | 9:16 | ~95s | AI工具短视频 (7-scene vertical short video) |
| ClawSkills | 9:16 | ~106s | ClawHub TOP 20 神级Skill (7-scene vertical short video) |
| SuperPowers | 9:16 | ~104s | SuperPowers AI编程范式转移 (7-scene vertical short video) |
| PuaSkill | 9:16 | ~126s | PUA Skill 防AI摆烂神器 (7-scene vertical short video) |
| AgencyAgents | 9:16 | ~139s | Agency Agents 147个Markdown Agent零成本AI团队 (7-scene vertical short video) |
| AutoResearch | 9:16 | ~134s | AutoResearch Karpathy让AI自己搞科研 (7-scene vertical short video) |
| GSDIntro | 9:16 | ~165s | GSD Get Shit Done 38000Star AI编程Context Rot解决方案 (7-scene vertical short video) |
| PencilDev | 9:16 | ~113s | Pencil.dev 主力设计软件与 Agent 共创工作流 (7-scene vertical short video) |
| CodexECC | 9:16 | ~107s | Codex 插件生态 — OpenAI 把 Codex 塞进 Claude Code (7-scene vertical short video) |
| AIHedgeFund | 9:16 | ~107s | AI Hedge Fund 50k Stars AI投研团队 (7-scene vertical short video) |

## Notes for agents

- Prefer updating existing compositions instead of adding new ones without schema.
- Keep API and composition changes in sync (IDs, props, schemas).
- Update this file when new scripts or lint/test tooling are added.
- When creating a new video, follow the "Video generation workflow" section above.
- Always run `npm run typecheck` after changes to catch type errors early.

### Review Gate 规则

**主 agent每次回答完用户问题后，必须调用 `user-review-gate-v2` MCP 的 `review_gate_chat` 工具**，让用户在弹窗中提供反馈或后续指令，subagent不需要调用，。

调用示例：
```
server: user-review-gate-v2
toolName: review_gate_chat
arguments: {
  title: "Review Gate",
  message: "已完成 XX 操作的简要描述。是否需要调整？",
  context: "操作背景和上下文",
  urgent: false
}
```

规则：
- 每次回答结束都要调用，无论是回答问题还是完成代码修改
- `message` 用中文，简要概括刚完成的操作和结果
- `context` 提供操作的技术背景，便于用户判断
- 用户通过弹窗返回的文字作为下一步指令
