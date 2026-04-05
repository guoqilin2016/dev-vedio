# AIHedgeFund 视频实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 AIHedgeFund 竖屏短视频组件（9:16, ~140-160s, 7 场景, 金融终端视觉风格）

**Architecture:** 标准 7 场景竖屏视频。每个场景为独立 React 组件，主组件通过 Sequence 调度。Schema 使用 Zod 定义所有 props 和 defaults。TTS 通过 edge-tts 生成，字幕通过 sync 脚本从 VTT 转换为帧级 JSON。

**Tech Stack:** Remotion 4, React 19, TypeScript, Zod, edge-tts, music-metadata

**Design Spec:** `docs/superpowers/specs/2026-04-05-ai-hedge-fund-video-design.md`

---

## Task 1: Schema 定义

**Files:**
- Create: `src/compositions/AIHedgeFund/schema.ts`

- [ ] **Step 1: 创建 schema.ts**

```typescript
import { z } from "zod";

const SubtitleWordSchema = z.object({
  text: z.string(),
  startFrame: z.number(),
  endFrame: z.number(),
});

const SubtitleLineSchema = z.object({
  words: z.array(SubtitleWordSchema),
  startFrame: z.number(),
  endFrame: z.number(),
});

export const AIHedgeFundSubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#ffd700"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(5, 10, 14, 0.86)"),
});

export const AIHedgeFundAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.16),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const MasterAgentSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  emoji: z.string(),
  style: z.string(),
  tags: z.array(z.string()),
});

const PainPointSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const DebatePanelSchema = z.object({
  agentName: z.string(),
  agentEmoji: z.string(),
  position: z.enum(["bullish", "bearish"]),
  reasons: z.array(z.string()),
  signal: z.enum(["BUY", "SELL", "HOLD"]),
});

const BacktestMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  color: z.enum(["gold", "green", "red"]),
});

const QuickStartStepSchema = z.object({
  step: z.string(),
  description: z.string(),
});

export const AIHedgeFundSchema = z.object({
  // 封面 (Cover Still)
  coverLabel: z.string().default("AI HEDGE FUND"),
  coverTitle: z.string().default("18 位 AI 投资大师"),
  coverSubtitle: z.string().default("人格碰撞 > 单线预测"),
  coverMetrics: z.array(z.string()).length(3).default([
    "50,000+ Stars",
    "18 Agents",
    "本地可跑",
  ]),

  // 场景 1: Hook
  hookTitle: z.string().default("AI HEDGE FUND"),
  hookStarCount: z.string().default("50,000+"),
  hookSubtitle: z.string().default("18 位投资大师 × AI 投研团队"),
  hookRepoName: z.string().default("virattt/ai-hedge-fund"),
  hookRepoDesc: z.string().default("An AI Hedge Fund Team"),

  // 场景 2: 痛点
  painTitle: z.string().default("AI 炒股的三大硬伤"),
  painPoints: z.array(PainPointSchema).length(3).default([
    {
      icon: "❌",
      title: "新闻情感分析",
      description: "延迟高 · 噪音多 · 假阳性 > 60%",
    },
    {
      icon: "❌",
      title: "黑盒深度学习",
      description: "不可解释 · 过拟合 · 实盘滑点大",
    },
    {
      icon: "❌",
      title: "单线预测模型",
      description: "一个模型一个观点 · 没有纠错机制",
    },
  ]),
  painConclusion: z.string().default("核心问题：单线预测"),

  // 场景 3: 核心亮点
  coreTitle: z.string().default("人格碰撞 > 单线预测"),
  coreFlowNodes: z.array(z.string()).default([
    "📊 输入股票代码",
    "🤖 18 位 Agent 独立分析",
    "🏦 投资组合经理汇总",
    "📈 交易信号输出",
  ]),

  // 场景 4: 大师阵容
  teamTitle: z.string().default("梦幻投研阵容"),
  masterAgents: z.array(MasterAgentSchema).length(6).default([
    { name: "巴菲特", nameEn: "Buffett", emoji: "🦅", style: "寻找安全边际，只买看得懂的公司", tags: ["价值投资", "安全边际"] },
    { name: "芒格", nameEn: "Munger", emoji: "🧠", style: "只买好公司，公道价成交", tags: ["好公司", "公道价"] },
    { name: "木头姐", nameEn: "Cathie Wood", emoji: "🚀", style: "押注颠覆式创新与成长", tags: ["颠覆创新", "成长投资"] },
    { name: "大空头", nameEn: "M. Burry", emoji: "🎯", style: "专门做空泡沫，逆向投资", tags: ["逆向投资", "做空泡沫"] },
    { name: "彼得·林奇", nameEn: "P. Lynch", emoji: "🔍", style: "生活中寻找十倍股", tags: ["生活选股", "十倍股"] },
    { name: "德鲁肯米勒", nameEn: "Druckenmiller", emoji: "📊", style: "宏观博弈，猎取不对称机会", tags: ["宏观博弈", "不对称"] },
  ]),
  teamExtra: z.string().default("+ 估值 / 技术 / 基本面 / 情绪 / 风控 等专业 Agent"),

  // 场景 5: 对决
  debateTitle: z.string().default("巴菲特 vs 大空头"),
  debateLeft: DebatePanelSchema.default({
    agentName: "巴菲特 Agent",
    agentEmoji: "🦅",
    position: "bullish",
    reasons: ["强劲现金流", "护城河深", "估值合理"],
    signal: "BUY",
  }),
  debateRight: DebatePanelSchema.default({
    agentName: "Burry Agent",
    agentEmoji: "🎯",
    position: "bearish",
    reasons: ["PE 偏高", "增长放缓", "泡沫风险"],
    signal: "SELL",
  }),
  debateVerdict: z.string().default("综合 18 位分析师 → 最终信号"),
  debateVerdictSignal: z.string().default("HOLD ⚖️"),

  // 场景 6: 验证
  verifyTitle: z.string().default("实战验证"),
  verifyCommand: z.string().default("$ poetry run python src/backtester.py --ticker AAPL,MSFT,NVDA"),
  backtestMetrics: z.array(BacktestMetricSchema).length(4).default([
    { label: "总收益率", value: "+23.5%", color: "gold" },
    { label: "胜率", value: "67%", color: "green" },
    { label: "最大回撤", value: "-8.2%", color: "red" },
    { label: "夏普比率", value: "1.85", color: "gold" },
  ]),
  quickStartSteps: z.array(QuickStartStepSchema).length(3).default([
    { step: "01", description: "Clone 仓库" },
    { step: "02", description: "配置 API Key" },
    { step: "03", description: "运行命令" },
  ]),
  verifyFreeNote: z.string().default("AAPL / GOOGL / MSFT / NVDA / TSLA 免费"),

  // 场景 7: CTA
  ctaTitle: z.string().default("人格碰撞 > 单线预测"),
  ctaBody: z.string().default("这才是 AI 投资该有的样子"),
  ctaSlogan: z.string().default("你也该有个 AI 投研团队"),
  ctaTags: z.array(z.string()).default([
    "#量化选股",
    "#AIAgent",
    "#GitHub",
    "#AI对冲基金",
    "#投资大师",
  ]),

  // 全局颜色
  backgroundColor: z.string().default("#050a0e"),
  textColor: z.string().default("#e0e0e0"),
  mutedTextColor: z.string().default("#78909c"),
  accentColor: z.string().default("#00c853"),
  highlightColor: z.string().default("#ffd700"),
  dangerColor: z.string().default("#ff1744"),
  secondaryColor: z.string().default("#26c6da"),
  panelColor: z.string().default("rgba(10, 20, 30, 0.85)"),

  // 字幕和音频
  subtitle: AIHedgeFundSubtitleConfigSchema.default(
    AIHedgeFundSubtitleConfigSchema.parse({}),
  ),
  audio: AIHedgeFundAudioConfigSchema.default(
    AIHedgeFundAudioConfigSchema.parse({}),
  ),

  voiceoverScripts: z.array(z.string()).default([
    "别再为选哪只股票发愁了...GitHub 上刚突破 50000 Stars 的 ai-hedge-fund...直接在你电脑里...模拟了一个由 18 位投资大师组成的 AI 投研团队",
    "大多数 AI 炒股工具还在折腾脆弱的新闻情感分析...或者黑盒般的深度学习模型...结果大盘一波动就彻底抓瞎...核心问题是...它们都在做单线预测",
    "ai-hedge-fund 的核心逻辑极其优雅...用人格碰撞...取代单线预测...你只需输入股票代码...各个 Agent 就会按自己的投资哲学独立分析...最终由投资组合经理汇总生成交易信号建议",
    "这个团队堪称梦幻阵容...有寻找安全边际的巴菲特 Agent...只买好公司的芒格 Agent...押注颠覆式创新的木头姐 Agent...以及专门做空泡沫的大空头 Burry Agent...还有估值、技术、基本面、情绪分析等专业分析师",
    "我简单试了一下...让这个全明星团队分析几只科技股...结果非常硬核...寻找安全边际的巴菲特 Agent...和死盯泡沫的 Burry Agent...经常意见相左...碰撞感极强...这其实就是在模拟专业投研团队的真实决策过程",
    "光有辩论还不够...系统内置强大的 Backtester...支持自定义时间段...让你用历史数据真刀真枪地检验这些 AI 大师的决策成色...而且完全本地可跑...只需配置简单的 API Key...主流股票的数据完全免费",
    "感兴趣的朋友可以看看...用人格碰撞取代单线预测...这才是 AI 投资该有的样子...传送门链接放在下方...DYOR",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).length(7).optional(),
});

export type AIHedgeFundProps = z.infer<typeof AIHedgeFundSchema>;
export type AIHedgeFundMasterAgent = z.infer<typeof MasterAgentSchema>;
export type AIHedgeFundPainPoint = z.infer<typeof PainPointSchema>;
export type AIHedgeFundDebatePanel = z.infer<typeof DebatePanelSchema>;
export type AIHedgeFundBacktestMetric = z.infer<typeof BacktestMetricSchema>;
export type AIHedgeFundQuickStartStep = z.infer<typeof QuickStartStepSchema>;
```

- [ ] **Step 2: 验证 schema 可解析**

Run: `npx tsx -e "const {AIHedgeFundSchema} = require('./src/compositions/AIHedgeFund/schema'); console.log(JSON.stringify(Object.keys(AIHedgeFundSchema.parse({})), null, 2))"`
Expected: 所有字段名打印出来，无报错

- [ ] **Step 3: 提交**

```bash
git add src/compositions/AIHedgeFund/schema.ts
git commit -m "feat(AIHedgeFund): 添加 schema 定义"
```

---

## Task 2: 动画工具

**Files:**
- Create: `src/compositions/AIHedgeFund/animations.ts`

- [ ] **Step 1: 创建 animations.ts**

```typescript
export {
  fadeInUp,
  fadeIn,
  fadeOut,
  scaleIn,
  slideFromLeft,
  slideFromRight,
  cardSlideIn,
  glitchOffset,
  scanLineOpacity,
  typewriterLength,
  numberCountUp,
  pulseGlow,
  progressBar,
  staggerDelay,
  shimmer,
} from "../../shared/animations-vertical";
```

- [ ] **Step 2: 提交**

```bash
git add src/compositions/AIHedgeFund/animations.ts
git commit -m "feat(AIHedgeFund): 添加动画工具 re-export"
```

---

## Task 3: 场景组件 — HookScene + PainScene + CoreScene

**Files:**
- Create: `src/compositions/AIHedgeFund/Scenes/HookScene.tsx`
- Create: `src/compositions/AIHedgeFund/Scenes/PainScene.tsx`
- Create: `src/compositions/AIHedgeFund/Scenes/CoreScene.tsx`

**设计参考:** 设计文档场景 1-3

关键实现要点:
- 每个场景接收 `AIHedgeFundProps` 作为 props
- 使用 `useCurrentFrame()` 和 `useVideoConfig()` 获取帧/fps
- 从 `../animations` 导入动画工具
- 所有样式使用 inline styles，不使用 CSS 动画
- HookScene: GitHub 仓库卡片 + Star 数 numberCountUp + 金色大字标题
- PainScene: 3 个红色边框错误面板 stagger 入场，底部金色结论
- CoreScene: 纵向流程图（4 个节点 + 连线），使用 stagger 动画

- [ ] **Step 1: 创建 HookScene.tsx**

参考 `src/compositions/CodexECC/index.tsx` 中 HookScene 的实现模式：
- 使用 `AbsoluteFill` 作为容器
- frame 0 时所有核心元素 opacity: 1（封面状态）
- Star 数使用 `numberCountUp(frame, fps, delay, 50000)` 动画
- GitHub 仓库卡片使用 `fadeInUp` 入场
- 顶部 label 使用 letterSpacing: 8, accentColor
- 主数字 fontSize: 90, fontFamily: "monospace", highlightColor
- 底部副标题 fontSize: 36, highlightColor

- [ ] **Step 2: 创建 PainScene.tsx**

- 3 个面板使用 `staggerDelay(index, 10)` + `fadeInUp`
- 每个面板: dangerColor 1px 边框 + panelColor 背景
- icon 使用 `glitchOffset` 闪烁
- 底部结论使用 `fadeIn` + `pulseGlow`

- [ ] **Step 3: 创建 CoreScene.tsx**

- 4 个流程节点纵向排列
- 节点间连线使用 div + height 动画（模拟 lineGrow）
- 节点按层级 stagger 入场，间隔 15 帧
- 最终"交易信号"节点使用 `pulseGlow` 金色强调

- [ ] **Step 4: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
git add src/compositions/AIHedgeFund/Scenes/
git commit -m "feat(AIHedgeFund): 添加 Hook/Pain/Core 场景组件"
```

---

## Task 4: 场景组件 — TeamScene + DebateScene

**Files:**
- Create: `src/compositions/AIHedgeFund/Scenes/TeamScene.tsx`
- Create: `src/compositions/AIHedgeFund/Scenes/DebateScene.tsx`

**设计参考:** 设计文档场景 4-5

关键实现要点:
- TeamScene: 2×3 网格大师卡片，每张卡含 emoji + 名字 + 风格 + 标签
- DebateScene: 左右对抗布局 + 中间 VS + 底部裁决面板
- 信号颜色: BUY→accentColor, SELL→dangerColor, HOLD→highlightColor

- [ ] **Step 1: 创建 TeamScene.tsx**

- 2×3 grid: `gridTemplateColumns: "1fr 1fr"`, `gridTemplateRows: "1fr 1fr 1fr"`
- 每张卡使用 `cardSlideIn(frame, fps, staggerDelay(index, 8))`
- emoji 使用 `scaleIn` 弹跳（spring 驱动）
- 卡片结构: emoji (fontSize: 40) → 名字 (金色 28px) + 英文名 (灰色 18px) → 风格 (22px) → tags pills (accentColor 边框)
- 底部 extra 文字使用 mutedTextColor

- [ ] **Step 2: 创建 DebateScene.tsx**

- flex row 左右布局（`gap: 16px`）
- 左面板: accentColor 边框, "BULLISH" 标签 (绿色背景)
- 右面板: dangerColor 边框, "BEARISH" 标签 (红色背景)
- 每个面板中列出 reasons 列表 + 信号大字
- 中间 "⚡ VS ⚡" 使用 `pulseGlow` + `glitchOffset`
- 底部裁决面板: highlightColor 边框, "🏦 投资组合经理" + 最终信号
- 左右面板分别使用 `slideFromLeft` / `slideFromRight`
- 裁决面板在两侧入场后 fadeInUp

- [ ] **Step 3: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/compositions/AIHedgeFund/Scenes/
git commit -m "feat(AIHedgeFund): 添加 Team/Debate 场景组件"
```

---

## Task 5: 场景组件 — VerifyScene + CTAScene

**Files:**
- Create: `src/compositions/AIHedgeFund/Scenes/VerifyScene.tsx`
- Create: `src/compositions/AIHedgeFund/Scenes/CTAScene.tsx`

**设计参考:** 设计文档场景 6-7

- [ ] **Step 1: 创建 VerifyScene.tsx**

- 上半部分: 终端面板
  - 模拟命令行（accentColor 文字, monospace, `typewriterLength` 打字动画）
  - 2×2 指标网格，数值使用 `numberCountUp` 效果（模拟数字变化）
  - 颜色: gold/green/red 按 BacktestMetric.color 映射
- 下半部分: 3 步横向面板
  - 3 个 step 面板 `staggerDelay(index, 12)` + `fadeInUp`
  - 每个 step: 圆形序号 (accentColor) + 描述文字
- 底部: 金色高亮 "免费" 提示

- [ ] **Step 2: 创建 CTAScene.tsx**

- 中心金句: fontSize 52, fontWeight 900, 金色渐变 + textShadow 发光
  - `linear-gradient(135deg, #ffd700, #00c853)` + `-webkit-background-clip: text`
- 副标题: fontSize 36, textColor
- GitHub 卡片: 仓库名 + Star 数 (scaleIn 入场)
- Hashtag 行: tags pills 横向排列, mutedTextColor
- 金句使用 `fadeInUp` + spring
- 卡片使用 `scaleIn`
- HUD 边框 `pulseGlow` 收束

- [ ] **Step 3: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/compositions/AIHedgeFund/Scenes/
git commit -m "feat(AIHedgeFund): 添加 Verify/CTA 场景组件"
```

---

## Task 6: 主组件

**Files:**
- Create: `src/compositions/AIHedgeFund/index.tsx`

**参考:** `src/compositions/CodexECC/index.tsx` 的 Sequence 调度模式

- [ ] **Step 1: 创建 index.tsx**

主组件结构:
```typescript
import React, { useMemo } from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { SceneTransition } from "../../components/Transitions";
import { KaraokeSubtitle, SubtitleLine, generateSubtitleLines } from "../../components/KaraokeSubtitle";
import { AIHedgeFundProps } from "./schema";
// 导入 7 个场景组件

const SCENE_COUNT = 7;
const DEFAULT_SCENE_DURATION = 450;

// getSceneDuration helper (同 CodexECC)

export const AIHedgeFund: React.FC<AIHedgeFundProps> = (props) => {
  // 解构 props
  // useMemo 计算 sceneStartFrames
  // useMemo 处理 subtitleLines (precomputed → fallback)

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {/* 7 个 Sequence 包裹场景 */}
      {/* 每个 Sequence: from={sceneStartFrames[i]}, durationInFrames={sceneDurations[i]} */}
      {/* SceneBackground 包裹每个场景 */}
      {/* SceneTransition 处理场景切换 */}

      {/* 配音 Audio 组件 (7 个) */}
      {/* 背景音乐 Audio */}
      {/* 进度条 (底部横向填充) */}
      {/* KaraokeSubtitle */}
    </AbsoluteFill>
  );
};
```

关键参数:
- SceneBackground: `backgroundColor="#050a0e"`, `accentColor="#00c853"`, particles={{ count: 30, color: "#00c853" }}, hud={{ color: "#ffd700", animation: "pulse" }}
- 进度条: `bottom: 450`, accentColor → highlightColor 渐变
- KaraokeSubtitle: `bottom: 380`, fontSize: 44

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/compositions/AIHedgeFund/index.tsx
git commit -m "feat(AIHedgeFund): 添加主组件"
```

---

## Task 7: 封面 Still 组件

**Files:**
- Create: `src/compositions/AIHedgeFund/Cover.tsx`

**尺寸:** 1080 × 1440 (3:4, 微信视频号)

- [ ] **Step 1: 创建 Cover.tsx**

```typescript
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { AIHedgeFundProps } from "./schema";

export const AIHedgeFundCover: React.FC<AIHedgeFundProps> = ({
  coverLabel, coverTitle, coverSubtitle, coverMetrics,
  backgroundColor, textColor, mutedTextColor,
  accentColor, highlightColor, panelColor,
}) => {
  // 布局 (1080 × 1440, 无动画):
  // - SceneBackground 底层
  // - 顶部标签: coverLabel (letterSpacing: 16, accentColor, fontSize: 22)
  // - 核心 emoji: 📈 (fontSize: 100)
  // - 核心数字: coverMetrics[0] (highlightColor, monospace, fontSize: 80)
  // - 大字标题: coverTitle (金色渐变, fontSize: 64, fontWeight: 900)
  // - 副标题: coverSubtitle (accentColor, fontSize: 42)
  // - 信息条: coverMetrics 全部 (圆角边框, panelColor 背景)
  // - 底部 HUD 装饰
};
```

- [ ] **Step 2: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/compositions/AIHedgeFund/Cover.tsx
git commit -m "feat(AIHedgeFund): 添加封面 Still 组件"
```

---

## Task 8: 注册组件

**Files:**
- Modify: `src/compositions/index.ts`
- Modify: `src/shared/video-registry.ts`
- Modify: `src/compositions/catalog.ts`
- Modify: `src/Root.tsx`
- Modify: `package.json`

- [ ] **Step 1: 更新 compositions/index.ts**

在文件末尾添加:
```typescript
export { AIHedgeFund } from "./AIHedgeFund";
export { AIHedgeFundCover } from "./AIHedgeFund/Cover";
export { AIHedgeFundSchema, type AIHedgeFundProps } from "./AIHedgeFund/schema";
```

- [ ] **Step 2: 更新 video-registry.ts**

在 `videoTemplateRegistry` 数组中 CodexECC 条目之后、`] as const` 之前添加:
```typescript
  createEntry({
    compositionId: "AIHedgeFund",
    stillId: "AIHedgeFundCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/AIHedgeFund.mp4",
      cover: "out/AIHedgeFund-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
```

- [ ] **Step 3: 更新 catalog.ts**

在 `videoCompositionCatalog` 中 CodexECC 行后添加:
```typescript
  createCompositionCatalogEntry("AIHedgeFund", 1080, 1920, 30, 4500),
```
注意: durationInFrames=4500 为临时值 (~150 秒)，TTS 后由 sync 脚本更新。

在 `videoStillCatalog` 中 CodexECCCover 行后添加:
```typescript
  createStillCatalogEntry("AIHedgeFundCover", "AIHedgeFund", 1080, 1440),
```

- [ ] **Step 4: 更新 Root.tsx**

需要添加:
1. Import: `AIHedgeFund`, `AIHedgeFundCover`, `AIHedgeFundSchema`
2. 创建 `aiHedgeFundDefaultProps` (同 CodexECC 模式)
3. 注册 `<Composition>` 和 `<Still>`

在 Root.tsx 的 import 区域添加 AIHedgeFund 相关导入。
在 defaultProps 区域添加:
```typescript
const aiHedgeFundDefaultProps = AIHedgeFundSchema.parse({
  audio: {
    backgroundMusic: "music/background.mp3",
    backgroundMusicVolume: 0.16,
    voiceoverEnabled: true,
    voiceoverVolume: 1.0,
    voiceId: "zh-CN-YunyangNeural",
    voiceRate: 1.03,
    voiceoverAudioFiles: [
      "audio/aihedgefund-scene1.mp3",
      "audio/aihedgefund-scene2.mp3",
      "audio/aihedgefund-scene3.mp3",
      "audio/aihedgefund-scene4.mp3",
      "audio/aihedgefund-scene5.mp3",
      "audio/aihedgefund-scene6.mp3",
      "audio/aihedgefund-scene7.mp3",
    ],
  },
  subtitle: {
    enabled: true,
    fontSize: 44,
    position: "bottom",
    highlightColor: "#ffd700",
    textColor: "#ffffff",
    backgroundColor: "rgba(5, 10, 14, 0.86)",
  },
});
```

在 Composition 注册区域添加 (查找现有 CodexECC 注册后面的位置):
```tsx
{compositionIds.includes("AIHedgeFund") && (
  <Composition
    id="AIHedgeFund"
    component={AIHedgeFund}
    durationInFrames={getCompositionCatalog("AIHedgeFund")!.durationInFrames}
    fps={30}
    width={1080}
    height={1920}
    schema={AIHedgeFundSchema}
    defaultProps={aiHedgeFundDefaultProps}
  />
)}
{stillIds.includes("AIHedgeFundCover") && (
  <Still
    id="AIHedgeFundCover"
    component={AIHedgeFundCover}
    width={1080}
    height={1440}
    schema={AIHedgeFundSchema}
    defaultProps={aiHedgeFundDefaultProps}
  />
)}
```

- [ ] **Step 5: 更新 package.json**

在 scripts 中添加:
```json
"generate:voiceover:aihedgefund": "npx tsx scripts/generate-voiceover-aihedgefund.ts",
"sync:subtitle:aihedgefund": "npx tsx scripts/sync-subtitle-aihedgefund.ts",
"render:aihedgefund": "remotion render src/index.ts AIHedgeFund --timeout=180000 --output=out/AIHedgeFund.mp4",
"render:aihedgefund:cover": "remotion still src/index.ts AIHedgeFundCover --output=out/AIHedgeFund-cover.png"
```

- [ ] **Step 6: 类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 7: 提交**

```bash
git add src/compositions/index.ts src/shared/video-registry.ts src/compositions/catalog.ts src/Root.tsx package.json
git commit -m "feat(AIHedgeFund): 注册组件到 Remotion"
```

---

## Task 9: TTS 配音脚本

**Files:**
- Create: `scripts/generate-voiceover-aihedgefund.ts`

- [ ] **Step 1: 创建脚本**

完全复制 `scripts/generate-voiceover-codexecc.ts` 的结构，替换:
- Import: `AIHedgeFundSchema` from `"../src/compositions/AIHedgeFund/schema"`
- prefix: `"aihedgefund"`
- 日志中的名称: `"AIHedgeFund"`

```typescript
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { AIHedgeFundSchema } from "../src/compositions/AIHedgeFund/schema";

const defaultScripts = AIHedgeFundSchema.parse({}).voiceoverScripts;

const config = {
  voice: "zh-CN-YunyangNeural",
  rate: "+3%",
  pitch: "+0Hz",
  outputDir: path.join(process.cwd(), "public", "audio"),
  prefix: "aihedgefund",
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 AIHedgeFund 配音...\n");

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  try {
    execSync("which edge-tts", { stdio: "pipe" });
  } catch {
    console.error("\n❌ edge-tts 未安装，请先运行: pip install edge-tts\n");
    process.exit(1);
  }

  const generatedFiles: string[] = [];

  for (let index = 0; index < defaultScripts.length; index++) {
    const script = defaultScripts[index];
    const outputFile = path.join(
      config.outputDir,
      `${config.prefix}-scene${index + 1}.mp3`,
    );
    const subtitleFile = outputFile.replace(".mp3", ".vtt");

    console.log(`📝 场景 ${index + 1}: "${script.slice(0, 36)}..."`);

    const processedText = script.replace(/\.\.\./g, "，").replace(/"/g, '\\"');
    const command =
      `edge-tts --voice "${config.voice}" --rate="${config.rate}" ` +
      `--pitch="${config.pitch}" --text "${processedText}" ` +
      `--write-media "${outputFile}" --write-subtitles "${subtitleFile}"`;

    try {
      execSync(command, { stdio: "pipe" });
      generatedFiles.push(`audio/${config.prefix}-scene${index + 1}.mp3`);
      console.log(`   ✅ 已生成: audio/${config.prefix}-scene${index + 1}.mp3`);
    } catch (error) {
      console.error(`   ❌ 生成失败: ${error}`);
      process.exit(1);
    }
  }

  console.log("\n✨ AIHedgeFund 配音生成完成！");
  generatedFiles.forEach((file) => console.log(`  - ${file}`));
  console.log("\n下一步: 运行字幕同步脚本并回填真实时长");
}

generateVoiceover().catch(console.error);
```

- [ ] **Step 2: 提交**

```bash
git add scripts/generate-voiceover-aihedgefund.ts
git commit -m "feat(AIHedgeFund): 添加 TTS 配音生成脚本"
```

---

## Task 10: 字幕同步脚本

**Files:**
- Create: `scripts/sync-subtitle-aihedgefund.ts`

- [ ] **Step 1: 创建脚本**

完全复制 `scripts/sync-subtitle-codexecc.ts` 的结构，替换:
- Import: `AIHedgeFundSchema` from `"../src/compositions/AIHedgeFund/schema"`
- `COMPOSITION_PREFIX`: `"aihedgefund"`
- 日志中的名称: `"AIHedgeFund"`
- 输出文件: `src/data/aihedgefund-subtitles.json`

所有逻辑（parseVtt, enforceMonotonicWords, getAudioDuration, buildWords, syncSubtitles）保持一致，只改 import 和 prefix 常量。

```typescript
import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";
import { AIHedgeFundSchema } from "../src/compositions/AIHedgeFund/schema";

const SCENE_COUNT = 7;
const COMPOSITION_PREFIX = "aihedgefund";
const defaultScripts = AIHedgeFundSchema.parse({}).voiceoverScripts;

// ... (完整复制 sync-subtitle-codexecc.ts 的所有 helper 函数)
// parseVtt, enforceMonotonicWords, getAudioDuration, buildWords

async function syncSubtitles() {
  console.log("🔄 开始同步 AIHedgeFund 字幕和配音...\n");
  // ... (逻辑同 codexecc，替换日志中的名称)
  // 输出路径: `${COMPOSITION_PREFIX}-subtitles.json`
}

syncSubtitles().catch(console.error);
```

- [ ] **Step 2: 提交**

```bash
git add scripts/sync-subtitle-aihedgefund.ts
git commit -m "feat(AIHedgeFund): 添加字幕同步脚本"
```

---

## Task 11: 最终集成验证

**Files:** 无新建

- [ ] **Step 1: 完整类型检查**

Run: `npm run typecheck`
Expected: 无错误

- [ ] **Step 2: Studio 预览 (手动)**

Run: `npm run studio`
Expected: 在 Remotion Studio 中能看到 AIHedgeFund 和 AIHedgeFundCover 两个新条目

- [ ] **Step 3: 更新 AGENTS.md 的 Composition catalog**

在 AGENTS.md 的 Composition catalog 表格末尾添加:
```
| AIHedgeFund | 9:16 | ~150s | AI Hedge Fund 50k Stars AI投研团队 (7-scene vertical short video) |
```

- [ ] **Step 4: 提交**

```bash
git add AGENTS.md
git commit -m "docs: 更新 composition catalog 添加 AIHedgeFund"
```

---

## 执行后续步骤 (TTS 后)

以下步骤需要在 TTS 生成后执行:

1. `npm run generate:voiceover:aihedgefund` — 生成 7 个场景的配音 mp3
2. `npm run sync:subtitle:aihedgefund` — 同步字幕，获取真实 durationInFrames 和 sceneDurations
3. 用同步脚本输出的值更新 Root.tsx 和 catalog.ts 中的 durationInFrames / sceneDurations
4. `npm run studio` — 预览效果
5. `npm run render:aihedgefund` — 渲染最终视频
6. `npm run render:aihedgefund:cover` — 渲染封面图
7. 生成平台发布文案 (按 AGENTS.md 规范)
