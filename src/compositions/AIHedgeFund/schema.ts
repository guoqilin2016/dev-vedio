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
  coverLabel: z.string().default("AI HEDGE FUND"),
  coverTitle: z.string().default("18 位 AI 投资大师"),
  coverSubtitle: z.string().default("人格碰撞 > 单线预测"),
  coverMetrics: z.array(z.string()).length(3).default([
    "50,000+ Stars",
    "18 Agents",
    "本地可跑",
  ]),

  hookTitle: z.string().default("AI HEDGE FUND"),
  hookStarCount: z.string().default("50,000+"),
  hookSubtitle: z.string().default("18 位投资大师 × AI 投研团队"),
  hookRepoName: z.string().default("virattt/ai-hedge-fund"),
  hookRepoDesc: z.string().default("An AI Hedge Fund Team"),

  painTitle: z.string().default("AI 炒股的三大硬伤"),
  painPoints: z.array(PainPointSchema).length(3).default([
    { icon: "❌", title: "新闻情感分析", description: "延迟高 · 噪音多 · 假阳性 > 60%" },
    { icon: "❌", title: "黑盒深度学习", description: "不可解释 · 过拟合 · 实盘滑点大" },
    { icon: "❌", title: "单线预测模型", description: "一个模型一个观点 · 没有纠错机制" },
  ]),
  painConclusion: z.string().default("核心问题：单线预测"),

  coreTitle: z.string().default("人格碰撞 > 单线预测"),
  coreFlowNodes: z.array(z.string()).default([
    "📊 输入股票代码",
    "🤖 18 位 Agent 独立分析",
    "🏦 投资组合经理汇总",
    "📈 交易信号输出",
  ]),

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

  backgroundColor: z.string().default("#050a0e"),
  textColor: z.string().default("#e0e0e0"),
  mutedTextColor: z.string().default("#78909c"),
  accentColor: z.string().default("#00c853"),
  highlightColor: z.string().default("#ffd700"),
  dangerColor: z.string().default("#ff1744"),
  secondaryColor: z.string().default("#26c6da"),
  panelColor: z.string().default("rgba(10, 20, 30, 0.85)"),

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
