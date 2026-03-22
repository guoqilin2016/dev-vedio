# GSD Intro Video — Design Spec

**Date**: 2026-03-22
**Status**: Approved
**Composition ID**: `GSDIntro`
**Cover Still ID**: `GSDIntroCover`

---

## 1. Overview

基于 @heyrimsha 的推文（2026.3.17, 857赞/1814收藏/9.5万浏览）制作一个 GSD（Get Shit Done）的科普介绍短视频。面向全平台（视频号/抖音/B站/小红书/快手）的技术爱好者群体，以"痛点驱动"的叙事方式讲解 GSD 是什么、为什么重要、怎么用。

### Key Decisions

| 决策 | 选择 |
|---|---|
| 目标受众 | 广泛技术爱好者/科技博主粉丝 |
| 视频格式 | 竖屏 9:16 (1080 x 1920) |
| 叙事角度 | 痛点驱动型（context rot → GSD 方案） |
| 视觉风格 | 绿色终端风 |
| 预估时长 | ~110-130 秒 |
| 场景数量 | 7 |

---

## 2. Color Scheme (绿色终端风)

```
backgroundColor: "#070a10"    // 深黑偏蓝底色
accentColor:     "#10b981"    // 翡翠绿（主色，终端感）
highlightColor:  "#06b6d4"    // 青色（辅助高亮）
successColor:    "#22c55e"    // 亮绿（成功/数据）
dangerColor:     "#ef4444"    // 红色（痛点/警告）
warningColor:    "#f59e0b"    // 琥珀（中等质量）
goldColor:       "#fbbf24"    // 金色（Star 数据）
terminalGreen:   "#4ade80"    // 终端绿（代码/命令行文字）
```

Background layers:
- `radial-gradient` 暗绿光晕 (accentColor 30% opacity)
- 扫描线 `repeating-linear-gradient`
- 粒子系统 (color: accentColor)
- HUD 四角装饰 (color: accentColor, animation: "pulse")

---

## 3. Technical Config

| 属性 | 值 |
|---|---|
| Width | 1080 |
| Height | 1920 |
| FPS | 30 |
| Voice | zh-CN-YunyangNeural |
| Voice Rate | +3% |
| Audio Prefix | `gsd` |
| Audio Path Pattern | `audio/gsd-scene{N}.mp3` |
| Subtitle JSON | `src/data/gsd-subtitles.json` |

---

## 4. Scene Design (7 Scenes)

### Scene 1: HookScene — "你的 AI 越写越垃圾？"

**Duration**: ~12s

**Voiceover Script**:
> 你有没有发现...用 AI 写代码，前面写得特别好，但越到后面...越离谱？变量名乱取，需求忘一半，代码开始自己跟自己打架。这不是你的问题，这是 AI 的通病，叫 Context Rot...上下文腐烂。今天介绍一个 38000 Star 的开源神器...专治这个病。

**Visual Design**:
- 顶部英文标签: `GET SHIT DONE` (letterSpacing: 10, fontSize: 22)
- 中心大字: "你的 AI 越写越垃圾？" (fontSize: 62, fontWeight: 900)
- 副标题: "38,000+ Star 的开源神器专治这个病" (fontSize: 36)
- 底部金色数据: `38,000+` (numberCountUp, goldColor, monospace, fontSize: 80)
- 仿终端窗口闪烁效果 (terminalGreen)
- 第一帧为完整封面状态（coverPhase: frame < 3, 所有元素 opacity: 1）
- 背景: SceneBackground + 绿色粒子

**Animations**: fadeInUp (title), numberCountUp (stars), glitchOffset (terminal), scanLineOpacity

---

### Scene 2: PainScene — Context Rot 可视化

**Duration**: ~15s

**Voiceover Script**:
> AI 有个致命弱点...它的上下文窗口是有限的。当对话历史，调试记录，文件内容...把窗口塞满之后，信噪比急剧下降。0 到 30%...巅峰状态。30 到 50%...开始赶进度。50 到 70%...偷工减料。70% 以上...直接开始胡说八道。这就是为什么你的 AI...写到一半就变了。

**Visual Design**:
- 顶部标签: `CONTEXT ROT` (letterSpacing: 8)
- 中心元素: 竖向进度条动画 (0% → 100%)，从绿到红渐变
- 四个质量等级卡片 (staggerDelay 逐个入场):
  - `0-30%` successColor: "巅峰质量"
  - `30-50%` warningColor: "开始赶进度"
  - `50-70%` `#f97316`: "偷工减料"
  - `70%+` dangerColor: "胡说八道"
- 进度条模拟 context 填充过程
- 背景扫描线加速暗示焦虑感

**Animations**: fadeInUp (title), staggerDelay(index, 10) for cards, progressBar for context fill, pulseGlow on danger zone

---

### Scene 3: CreatorScene — 音乐制作人的传奇

**Duration**: ~14s

**Voiceover Script**:
> 解决这个问题的人...不是什么大厂工程师，是一个住在哥斯达黎加的...House 音乐制作人。他叫 Lex Christopherson...GitHub 名字叫 glittercowboy。他说...我不写代码，Claude Code 帮我写。但我需要一个系统...让 AI 从头到尾都靠谱。于是 GSD 诞生了...Get Shit Done。

**Visual Design**:
- 顶部标签: `CREATOR` (letterSpacing: 8)
- 人物信息卡片（终端窗口样式，黑底绿字）:
  - `> user: glittercowboy`
  - `> location: Costa Rica`
  - `> background: House Music Producer`
  - `> stars: 38,000+` (numberCountUp, goldColor)
- GitHub 风格头像: 绿色边框圆角矩形 + `GC` 首字母 monospace 大字
- CSS 绘制五角星 (金色填充 + 发光 boxShadow)
- CSS 绘制音符形状（绿色圆 + 竖线 + 横线）
- 底部引用: "I don't write code — Claude Code does." (italics, highlightColor)
- `GSD` ASCII 字样 fadeIn

**Animations**: typewriterLength for terminal lines, numberCountUp for stars, fadeIn for quote, cardSlideIn for info card

---

### Scene 4: CoreScene — 三大核心架构

**Duration**: ~18s

**Voiceover Script**:
> GSD 的核心思路很简单...把 Context 当稀缺资源来管理。三个关键设计...第一，规范驱动。先写 Spec 再写代码，所有需求拆成原子级任务。第二，波次并行。没有依赖的任务同时执行，有依赖的排队等待...像流水线一样。第三，隔离上下文。每个任务...都在全新的 200K 上下文窗口里执行。做完就丢掉。主会话...永远保持 30 到 40%。

**Visual Design**:
- 顶部标签: `ARCHITECTURE` (letterSpacing: 8)
- 中心标题: "三大核心设计" (fontSize: 56)
- 三列架构卡片 (staggerDelay 逐个滑入):
  1. **规范驱动** — 图标: 绿色边框文件堆叠图 (3层偏移矩形 + `SPEC` 文字 + 终端光标)
     - 描述: `PROJECT.md → ROADMAP.md → PLAN.md`
  2. **波次并行** — 图标: 动态波次流程图 (3方块并行 → 连线 → 2方块 → 1方块)
     - 描述: "无依赖任务同时执行"
  3. **隔离上下文** — 图标: 双窗口对比图 (Main 30% vs Subagent 200K)
     - 描述: "每个任务全新上下文窗口"
- 底部: 稳定进度条 `context: 30-40%` (successColor)
- HUD 四角装饰 pulse 动画

**Animations**: fadeInUp (title), staggerDelay(index, 12) for cards, cardSlideIn, progressBar, pipelineNodeReveal for wave diagram

---

### Scene 5: WorkflowScene — 一条命令启动

**Duration**: ~16s

**Voiceover Script**:
> 用起来更简单...一条命令安装。然后 6 步循环...new-project，AI 面试你，搞清楚你要什么。discuss-phase...锁定产品决策。plan-phase...自动研究加规划。execute-phase...波次并行执行，每个任务自动 git commit。verify-work...自动化验收。complete-milestone...归档发布。全程你可以...去喝杯咖啡。

**Visual Design**:
- 顶部标签: `WORKFLOW` (letterSpacing: 8)
- 顶部仿终端命令行: `$ npx get-shit-done-cc@latest` (typewriter 效果, terminalGreen)
- 中心 6 步纵向管线图 (pipelineNodeReveal):
  1. `/gsd:new-project` → "AI 面试你"
  2. `/gsd:discuss-phase` → "锁定决策"
  3. `/gsd:plan-phase` → "研究+规划"
  4. `/gsd:execute-phase` → "并行执行"
  5. `/gsd:verify-work` → "自动验收"
  6. `/gsd:complete-milestone` → "归档发布"
- 每个节点: 绿色圆点 + 终端提示符 `>_` 样式
- 节点间: lineGrow 连线 + 绿色发光脉冲尾迹

**Animations**: typewriterLength (install command), pipelineNodeReveal for nodes, lineGrow for connections, staggerDelay(index, 8)

---

### Scene 6: ImpactScene — 数据与社会证明

**Duration**: ~16s

**Voiceover Script**:
> 效果怎么样？38000 个 GitHub Star，每周增长 4500。Amazon，Google，Shopify，Webflow 的工程师...都在用。有人实测...2 到 3 天的活，压缩到 1 天。有人把 6 个月的研究项目...几天做完。支持 6 种运行时...Claude Code，Gemini CLI，OpenCode，Codex，Copilot，Antigravity。MIT 开源，完全免费。

**Visual Design**:
- 顶部标签: `IMPACT` (letterSpacing: 8)
- 核心数据仪表盘 (2x2 grid):
  - `38,000+` Stars (goldColor, fontSize: 72, numberCountUp)
  - `4,500/week` 增速 (successColor)
  - `80+` 贡献者 (highlightColor)
  - `6` 运行时 (accentColor)
- 公司名行: 终端高亮框 `[ Amazon ]` `[ Google ]` `[ Shopify ]` `[ Webflow ]` (绿色边框)
- 用户评价气泡 (chatBubbleIn):
  - "2-3 天的活压缩到 1 天" (左侧绿色竖线装饰)
  - "6 个月的研究几天做完" (左侧绿色竖线装饰)
- 底部: `MIT License · 完全免费` (accentColor)

**Animations**: numberCountUp for all stats, staggerDelay(index, 8) for company badges, chatBubbleIn for quotes, fadeInUp for MIT badge

---

### Scene 7: CTAScene — 行动号召

**Duration**: ~12s

**Voiceover Script**:
> 如果你也在用 AI 写代码...一定要试试这个。一条命令搞定...npx get-shit-done-cc@latest。GitHub 搜 GSD 或者 Get Shit Done。让你的 AI...从头到尾都靠谱。关注我，下期继续分享...最前沿的 AI 工具。

**Visual Design**:
- 顶部标签: `GET STARTED` (letterSpacing: 8)
- 上方金句: "让你的 AI 从头到尾都靠谱" (fontSize: 50, fontWeight: 900, pulseGlow, textShadow)
- 中心超大终端框:
  ```
  $ npx get-shit-done-cc@latest
  ```
  (terminalGreen, fontSize: 32, monospace, 闪烁光标 + 发光 textShadow)
- GitHub URL: `github.com/gsd-build/get-shit-done` (highlightColor)
- 下方标签行: `#GSD  #AIcoding  #ClaudeCode  #开源` (fontSize: 22, letterSpacing: 4)
- 关注引导文字 + 动画

**Animations**: fadeInUp (quote), scaleIn (terminal), pulseGlow (quote + command), fadeIn (tags)

---

## 5. Cover Design (Cover.tsx)

| 属性 | 值 |
|---|---|
| Still ID | `GSDIntroCover` |
| 尺寸 | 1080 x 1440 (3:4) |

**Layout**:
- 顶部: `GET SHIT DONE` (letterSpacing: 16, fontSize: 22, accentColor)
- 中心: CSS 终端窗口 (黑底绿字), 内含 `$ npx get-shit-done-cc@latest`
- 核心数字: `38,000+` Stars (goldColor, monospace, fontSize: 80)
- 副标题: "一个音乐制作人写的 AI 编程神器" (fontSize: 42, highlightColor)
- 信息条: `Amazon · Google · Shopify · Webflow` (边框圆角)
- 底部: `MIT 开源 | 一条命令安装 | 6种运行时`
- 背景: radial-gradient 绿色光晕 + 扫描线 + HUD 四角

---

## 6. File Structure

```
src/compositions/GSDIntro/
├── schema.ts
├── index.tsx
├── animations.ts
├── Cover.tsx
└── Scenes/
    ├── HookScene.tsx
    ├── PainScene.tsx
    ├── CreatorScene.tsx
    ├── CoreScene.tsx
    ├── WorkflowScene.tsx
    ├── ImpactScene.tsx
    └── CTAScene.tsx

scripts/
├── generate-voiceover-gsd.ts
└── sync-subtitle-gsd.ts

src/data/
└── gsd-subtitles.json

public/audio/
├── gsd-scene1.mp3 ~ gsd-scene7.mp3
└── gsd-scene1.vtt ~ gsd-scene7.vtt
```

---

## 7. Delivery Pipeline

```bash
npm run generate:voiceover:gsd    # 1. TTS 生成
npm run sync:subtitle:gsd         # 2. 字幕同步 (输出 durationInFrames + sceneDurations)
# 3. 更新 Root.tsx
npm run studio                    # 4. 预览
npm run render:gsd                # 5. 渲染视频
npm run render:gsd:cover          # 6. 渲染封面
# 7. 自动生成平台发布文案
```

---

## 8. Source Material

### Tweet Reference
- Author: @heyrimsha (Rimsha Bhardwaj)
- Date: 2026-03-17
- Engagement: 857 likes / 1814 bookmarks / ~95K views
- Content: GSD introduction focusing on context rot solution

### Key Data Points
- GitHub Stars: 38,000+ (weekly growth: 4,500)
- Contributors: 80+
- Runtimes: 6 (Claude Code, OpenCode, Gemini CLI, Codex, Copilot, Antigravity)
- Companies using: Amazon, Google, Shopify, Webflow
- Creator: Lex Christopherson (glittercowboy), Costa Rica, music producer
- License: MIT (free)
- Install: `npx get-shit-done-cc@latest`
- User results: 2-3 day work compressed to ~1 day; 6-month research done in days

### Context Rot Quality Table
| Context Usage | Quality |
|---|---|
| 0-30% | Peak quality |
| 30-50% | Starting to rush |
| 50-70% | Cutting corners |
| 70%+ | Hallucinations, forgotten context |

### GSD Three Pillars
1. Spec-driven Planning (PROJECT.md → ROADMAP.md → PLAN.md)
2. Wave-based Parallel Execution (dependency graph → waves → parallel)
3. Isolated Subagent Contexts (main 30-40% → subagents fresh 200K each)

### 6-Step Workflow
1. `/gsd:new-project` — AI interviews you
2. `/gsd:discuss-phase` — Lock product decisions
3. `/gsd:plan-phase` — Research + plan + verify
4. `/gsd:execute-phase` — Wave parallel execution + atomic commits
5. `/gsd:verify-work` — Automated acceptance testing
6. `/gsd:complete-milestone` — Archive and release
