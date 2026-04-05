# AI Hedge Fund 短视频设计文档

> Composition ID: `AIHedgeFund`
> 格式: 9:16 竖屏 (1080 × 1920)
> 目标时长: ~140-160 秒 (TTS 后以实际音频为准)
> FPS: 30

## 1. 项目概述

为 GitHub 开源项目 [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) (50k+ Stars) 制作竖屏短视频。该项目用 18 个 AI Agent 模拟投资大师和专业分析师组成的对冲基金团队，核心理念是"用人格碰撞取代单线预测"。

### 1.1 目标受众

**程序员中的投资爱好者** — 既懂技术架构（多 Agent、LangGraph）又关心投资逻辑和回测效果。

### 1.2 核心叙事钩子

**"50k Stars 现象"角度** — 从 GitHub 热度数据切入，逐层拆解为什么这个项目这么火，它到底解决了什么问题。

### 1.3 发布平台

微信视频号（主）、抖音、小红书、B 站

## 2. 视觉风格

### 2.1 色彩方案 — 金融终端风

```
backgroundColor: "#050a0e"     // 深色终端背景
accentColor:     "#00c853"     // 终端绿 (信号/边框/正值)
highlightColor:  "#ffd700"     // 金色 (数字/标题/强调)
dangerColor:     "#ff1744"     // 警告红 (痛点/看空/风险)
secondaryColor:  "#26c6da"     // 冰蓝 (辅助信息/流程线)
mutedTextColor:  "#78909c"     // 灰蓝 (次要文字)
textColor:       "#e0e0e0"     // 正文白
cardBg:          "rgba(10, 20, 30, 0.85)" // 面板背景
```

### 2.2 设计语言

- **面板 (Panel)**: 暗色半透明卡片 + 1px 边框 (绿色或金色)，圆角 12px
- **数字**: 全部 monospace 字体 + 金色, `fontWeight: 900`
- **标题**: 金色渐变 (`linear-gradient(135deg, #ffd700, #00c853)`) + `-webkit-background-clip: text`
- **HUD 边框**: 四角交易终端边框装饰（绿色或金色）
- **背景层**: radial-gradient 暗金色光晕 + 扫描线
- **特殊元素**: 交易信号标签 (BUY 绿 / SELL 红 / HOLD 金)

### 2.3 字体规范

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 场景主标题 | 64-72px | 900 | 金色渐变 |
| 场景副标题 | 36-44px | 700 | textColor |
| 核心数字 (Stars) | 80-100px | 900 | #ffd700, monospace |
| 卡片标题 | 28-34px | 800 | #ffd700 |
| 卡片正文 | 22-26px | 500 | #e0e0e0 |
| 英文标签 | 18-22px | 800 | #00c853, letterSpacing: 8 |
| 信号标签 | 24-28px | 900 | 红/绿/金 |
| CTA 金句 | 48-54px | 900 | 金色渐变 + textShadow |

## 3. 场景设计 (7 场景)

### 场景 1: Hook — "50k Stars 的 AI 对冲基金"

**时长预估**: ~18 秒

**配音文案**:
> 别再为选哪只股票发愁了...GitHub 上刚突破 50000 Stars 的 ai-hedge-fund...直接在你电脑里...模拟了一个由 18 位投资大师组成的 AI 投研团队

**视觉布局**:
- **顶部**: 英文标签 `AI HEDGE FUND` (letterSpacing: 16, 终端绿)
- **中间偏上**: Star 数 `50,000+` 金色超大字号 (80-100px, monospace)，numberCountUp 动画
- **中间**: GitHub 仓库卡片 (React 模拟)
  - 仓库名: `virattt/ai-hedge-fund`
  - 描述: "An AI Hedge Fund Team"
  - 统计: ⭐ 50k+ | 📦 Python | 📄 MIT
- **底部**: "18 位投资大师 × AI 投研团队" 金色文字

**动画**:
- Frame 0 封面: Star 数 + 标题 + 仓库卡片全部可见 (opacity: 1)
- Frame 5+: Star 数 numberCountUp (0 → 50000)
- Frame 10+: 仓库卡片 fadeInUp + spring
- 背景: 暗金色 radial-gradient 光晕 + 扫描线

### 场景 2: 痛点 — "大多数 AI 炒股工具都不靠谱"

**时长预估**: ~20 秒

**配音文案**:
> 大多数 AI 炒股工具还在折腾脆弱的新闻情感分析...或者黑盒般的深度学习模型...结果大盘一波动就彻底抓瞎...核心问题是...它们都在做单线预测

**视觉布局**:
- **TitleBlock**: label="SCENE 02 / PROBLEMS", title="AI 炒股的三大硬伤"
- **3 个错误面板** (从上到下 stagger 入场):
  - `❌ 新闻情感分析` — "延迟高 · 噪音多 · 假阳性 > 60%"，红色边框
  - `❌ 黑盒深度学习` — "不可解释 · 过拟合 · 实盘滑点大"，红色边框
  - `❌ 单线预测模型` — "一个模型一个观点 · 没有纠错机制"，红色边框
- **底部**: 金色强调文字 "核心问题：单线预测"

**动画**:
- 3 个面板 staggerDelay(index, 10) + fadeInUp
- 每个面板入场时 ❌ 图标有 glitch 闪烁
- 底部文字最后 fadeIn + pulseGlow

### 场景 3: 核心亮点 — "人格碰撞 > 单线预测"

**时长预估**: ~22 秒

**配音文案**:
> ai-hedge-fund 的核心逻辑极其优雅...用人格碰撞...取代单线预测...你只需输入股票代码...各个 Agent 就会按自己的投资哲学独立分析...最终由投资组合经理汇总生成交易信号建议

**视觉布局**:
- **TitleBlock**: label="SCENE 03 / CORE", title="人格碰撞 > 单线预测"
- **架构流程图** (React 组件, 纵向布局, 适配竖屏):
  - **顶部节点**: `📊 输入股票代码` (终端绿边框)
  - **中间层**: 3×2 小型 Agent 节点网格 (不同颜色标签, 简化展示)
  - **汇聚节点**: `🏦 投资组合经理` (金色边框, 突出)
  - **底部节点**: `📈 交易信号` (金色, 最终输出)
  - 节点间连线: 冰蓝色, 带流动动画 (shimmer)

**动画**:
- 流程图节点按层级 stagger 入场 (顶→中→底)
- 连接线 lineGrow 动画
- 最终"交易信号"节点 pulseGlow 强调

### 场景 4: 深入 1 — "18 位投资大师 Agent"

**时长预估**: ~22 秒

**配音文案**:
> 这个团队堪称梦幻阵容...有寻找安全边际的巴菲特 Agent...只买好公司的芒格 Agent...押注颠覆式创新的木头姐 Agent...以及专门做空泡沫的大空头 Burry Agent...还有估值、技术、基本面、情绪分析等专业分析师

**视觉布局**:
- **TitleBlock**: label="SCENE 04 / TEAM", title="梦幻投研阵容"
- **2×3 大师卡片网格**:
  | 位置 | 名称 | 英文 | 风格标签 | emoji |
  |------|------|------|----------|-------|
  | 1 | 巴菲特 | Buffett | 价值投资 · 安全边际 | 🦅 |
  | 2 | 芒格 | Munger | 好公司 · 公道价 | 🧠 |
  | 3 | 木头姐 | Cathie Wood | 颠覆创新 · 成长投资 | 🚀 |
  | 4 | 大空头 | M. Burry | 逆向投资 · 做空泡沫 | 🎯 |
  | 5 | 彼得·林奇 | P. Lynch | 生活选股 · 十倍股 | 🔍 |
  | 6 | 德鲁肯米勒 | Druckenmiller | 宏观博弈 · 不对称机会 | 📊 |
- **底部补充**: "+ 估值 / 技术 / 基本面 / 情绪 / 风控 等专业 Agent"

**动画**:
- 6 张卡片 staggerDelay(index, 8) + cardSlideIn
- 每张卡 emoji 有 scaleIn 弹跳

### 场景 5: 深入 2 — "大师对决"

**时长预估**: ~24 秒

**配音文案**:
> 我简单试了一下...让这个全明星团队分析几只科技股...结果非常硬核...寻找安全边际的巴菲特 Agent...和死盯泡沫的 Burry Agent...经常意见相左...碰撞感极强...这其实就是在模拟专业投研团队的真实决策过程

**视觉布局**:
- **TitleBlock**: label="SCENE 05 / DEBATE", title="巴菲特 vs 大空头"
- **左右对抗布局**:
  - 左面板 (绿色边框, "BULLISH"):
    - 🦅 巴菲特 Agent
    - "强劲现金流"
    - "护城河深"
    - "估值合理"
    - 信号: `BUY` 🟢
  - 右面板 (红色边框, "BEARISH"):
    - 🎯 Burry Agent
    - "PE 偏高"
    - "增长放缓"
    - "泡沫风险"
    - 信号: `SELL` 🔴
  - 中间: `⚡ VS ⚡` 闪烁动画
- **底部裁决面板** (金色边框):
  - 🏦 投资组合经理
  - "综合 18 位分析师 → 最终信号"
  - `HOLD ⚖️`

**动画**:
- 左右面板同时 slideFromLeft / slideFromRight
- VS 标记 pulseGlow + glitchOffset
- 裁决面板最后 fadeInUp + spring

### 场景 6: 深入 3 — "回测验证 + 本地运行"

**时长预估**: ~24 秒

**配音文案**:
> 光有辩论还不够...系统内置强大的 Backtester...支持自定义时间段...让你用历史数据真刀真枪地检验这些 AI 大师的决策成色...而且完全本地可跑...只需配置简单的 API Key...主流股票的数据完全免费

**视觉布局**:
- **TitleBlock**: label="SCENE 06 / VERIFY", title="实战验证"
- **上半部分 — 回测终端面板**:
  - 模拟命令行: `$ poetry run python src/backtester.py --ticker AAPL,MSFT,NVDA`
  - 结果指标面板 (2×2 网格):
    - 总收益率: `+23.5%` (金色)
    - 胜率: `67%` (绿色)
    - 最大回撤: `-8.2%` (红色)
    - 夏普比率: `1.85` (金色)
  - 注: 数字为示意值, 实际视频可用更合理的演示数据
- **下半部分 — 3 步上手**:
  - `01` Clone 仓库 → `02` 配置 API Key → `03` 运行命令
  - 横向 3 个小面板, 终端绿字体
  - 金色高亮: "AAPL / GOOGL / MSFT / NVDA / TSLA 免费"

**动画**:
- 命令行 typewriterLength 打字动画
- 指标数据 numberCountUp
- 3 步面板 stagger 入场

### 场景 7: CTA — "你也该有个 AI 投研团队"

**时长预估**: ~18 秒

**配音文案**:
> 感兴趣的朋友可以看看...用人格碰撞取代单线预测...这才是 AI 投资该有的样子...传送门链接放在下方...DYOR

**视觉布局**:
- **金句** (超大号, 金色渐变, 居中): "人格碰撞 > 单线预测"
- **副标题**: "这才是 AI 投资该有的样子"
- **GitHub 传送门卡片**: 仓库名 + Star 数 + 链接
- **Hashtag 行**: `#量化选股 #AIAgent #GitHub`

**动画**:
- 金句 fadeInUp + spring + textShadow 发光
- 传送门卡片 scaleIn
- HUD 边框脉冲收束
- 粒子背景向中心收束

## 4. 技术架构

### 4.1 文件结构

```
src/compositions/AIHedgeFund/
├── schema.ts          # Zod schema + 类型定义
├── animations.ts      # 动画工具 (re-export shared + 本地)
├── index.tsx          # 主组件 (7 场景调度)
├── Cover.tsx          # 封面 Still 组件 (1080×1440)
└── Scenes/
    ├── HookScene.tsx      # 场景 1
    ├── PainScene.tsx      # 场景 2
    ├── CoreScene.tsx      # 场景 3
    ├── TeamScene.tsx      # 场景 4
    ├── DebateScene.tsx    # 场景 5
    ├── VerifyScene.tsx    # 场景 6
    └── CTAScene.tsx       # 场景 7
```

### 4.2 Schema 核心类型

```typescript
// 大师 Agent 卡片
interface MasterAgent {
  name: string;        // 中文名
  nameEn: string;      // 英文名
  emoji: string;       // 代表性 emoji
  style: string;       // 投资风格一句话
  tags: string[];      // 标签数组
}

// 辩论面板数据
interface DebatePanel {
  agentName: string;
  position: "bullish" | "bearish";
  reasons: string[];
  signal: "BUY" | "SELL" | "HOLD";
}

// 回测结果指标
interface BacktestMetric {
  label: string;
  value: string;
  color: "gold" | "green" | "red";
}

// 痛点卡片
interface PainPoint {
  icon: string;
  title: string;
  description: string;
}
```

### 4.3 依赖关系

- 复用: `SceneBackground`, `KaraokeSubtitle`, `HudFrame`, `ParticleBackground`, `GlowOrb`
- 复用: `src/shared/animations-vertical.ts` (fadeInUp, staggerDelay, numberCountUp, etc.)
- 新增: 无需新的共享组件, 所有金融终端元素为本地组件

### 4.4 注册

- `src/compositions/index.ts`: 导出 `AIHedgeFund`, `AIHedgeFundCover`, `AIHedgeFundSchema`
- `src/Root.tsx`: 注册 Composition (1080×1920×30fps) + Still (1080×1440)
- `src/compositions/catalog.ts`: 添加 catalog entry
- `src/shared/video-registry.ts`: 添加 registry entry

## 5. TTS 与字幕

### 5.1 配音配置

- 语音: `zh-CN-YunyangNeural`
- 语速: `rate: +3%`
- 停顿: `...` → `，`
- 脚本: `scripts/generate-voiceover-aihedgefund.ts`
- 输出: `public/audio/aihedgefund-scene{1-7}.mp3`

### 5.2 字幕同步

- 脚本: `scripts/sync-subtitle-aihedgefund.ts`
- 输出: `src/data/aihedgefund-subtitles.json`
- 同步后更新 Root.tsx 的 `durationInFrames` 和 `sceneDurations`

## 6. 封面设计 (Still)

### 6.1 尺寸

1080 × 1440 (3:4, 微信视频号标准)

### 6.2 视觉元素

- **顶部标签**: `AI HEDGE FUND` (letterSpacing: 16, 终端绿)
- **核心 emoji**: 📈 (fontSize: 100)
- **核心数字**: `50,000+ Stars` (金色, monospace, fontSize: 80)
- **大字标题**: "18 位 AI 投资大师" (fontSize: 64, 金色渐变)
- **副标题**: "人格碰撞 > 单线预测" (fontSize: 42, 终端绿)
- **信息条**: `GitHub | Python | 本地可跑 | 免费` (圆角边框)
- **背景**: radial-gradient 暗金色光晕 + 扫描线 + HUD 边框

### 6.3 渲染命令

```bash
npm run render:aihedgefund:cover
# 输出: out/AIHedgeFund-cover.png
```

## 7. 发布文案 (视频完成后生成)

按 AGENTS.md 规范, 视频完成后自动生成:
- 微信视频号: 短标题 (≤16字) + 备选标题 + 描述 + Hashtag
- 抖音/小红书: 口语化标题 + 短描述 + Hashtag

核心关键词: 50k Stars, 18 位投资大师, 人格碰撞, 巴菲特 vs 大空头, 本地可跑, 回测验证

## 8. 渲染流水线

```bash
# Step 1: 生成 TTS 配音
npm run generate:voiceover:aihedgefund

# Step 2: 同步字幕 (更新 JSON + 打印配置)
npm run sync:subtitle:aihedgefund

# Step 3: 用打印的值更新 Root.tsx (durationInFrames, sceneDurations, precomputedSubtitles)

# Step 4: Studio 预览
npm run studio

# Step 5: 渲染视频
npm run render:aihedgefund

# Step 6: 渲染封面
npm run render:aihedgefund:cover

# Step 7: 生成发布文案
```
