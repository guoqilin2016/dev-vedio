import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#ef4444"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(10, 10, 15, 0.85)"),
});

export const AudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.2),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunxiNeural"),
  voiceRate: z.number().min(0.5).max(2.0).default(1.05),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const LazyPatternSchema = z.object({
  name: z.string(),
  behavior: z.string(),
  icon: z.string(),
});

const PressureLevelSchema = z.object({
  level: z.string(),
  label: z.string(),
  rhetoric: z.string(),
  action: z.string(),
  color: z.string(),
});

const IronRuleSchema = z.object({
  number: z.string(),
  title: z.string(),
  desc: z.string(),
  icon: z.string(),
  color: z.string(),
});

const MethodStepSchema = z.object({
  name: z.string(),
  desc: z.string(),
  icon: z.string(),
  color: z.string(),
});

const BenchmarkStatSchema = z.object({
  label: z.string(),
  value: z.number(),
  suffix: z.string(),
  color: z.string(),
});

const PlatformSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const PuaSkillSchema = z.object({
  hookLine1: z.string().default("你的AI还在中途放弃？"),
  hookLine2: z.string().default("这个Skill让AI不敢摆烂"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),
  githubStars: z.number().default(7400),
  githubForks: z.number().default(342),

  lazyPatterns: z.array(LazyPatternSchema).default([
    { name: "暴力重试", behavior: "同一命令跑3遍，然后说「我解不了」", icon: "🔁" },
    { name: "甩锅用户", behavior: "「建议你手动处理」「可能是环境问题」", icon: "🫵" },
    { name: "工具闲置", behavior: "有搜索不搜，有文件不读，有终端不跑", icon: "🛋️" },
    { name: "原地打转", behavior: "反复微调同一行代码，本质在画圈", icon: "🔄" },
    { name: "被动等待", behavior: "修完表面就停，不验证不扩展不主动", icon: "😴" },
  ]),
  lazyQuote: z.string().default("AI摆烂的5种姿势，你的AI中了几个？"),

  ironRules: z.array(IronRuleSchema).default([
    { number: "01", title: "穷尽一切方案", desc: "用完所有方法才允许说「我解不了」", icon: "💪", color: "#ef4444" },
    { number: "02", title: "先行动再提问", desc: "先用工具，提问必须带诊断结果", icon: "⚡", color: "#f97316" },
    { number: "03", title: "主动出击", desc: "端到端交付，P8不是NPC", icon: "🎯", color: "#fbbf24" },
  ]),
  ironRulesTitle: z.string().default("三大铁律"),
  ironRulesSubtitle: z.string().default("强制AI不准放弃"),

  pressureLevels: z.array(PressureLevelSchema).default([
    { level: "L1", label: "轻度失望", rhetoric: "这个bug都解不了，绩效怎么打？", action: "切换全新方案", color: "#fbbf24" },
    { level: "L2", label: "灵魂拷问", rhetoric: "底层逻辑呢？顶层设计呢？", action: "搜索+读源码", color: "#f97316" },
    { level: "L3", label: "绩效面谈", rhetoric: "慎重考虑后，给你打 3.25", action: "执行7点检查清单", color: "#ef4444" },
    { level: "L4", label: "毕业警告", rhetoric: "其他模型都能解，你要毕业了", action: "绝境模式全开", color: "#dc2626" },
  ]),
  pressureTitle: z.string().default("4级PUA压力升级"),

  methodSteps: z.array(MethodStepSchema).default([
    { name: "闻味道", desc: "列出所有尝试，找共性失败模式", icon: "👃", color: "#a78bfa" },
    { name: "拔高", desc: "逐字读报错 → 搜索 → 读源码 → 反转假设", icon: "🔭", color: "#8b5cf6" },
    { name: "照镜子", desc: "在重复吗？搜了吗？读文件了吗？", icon: "🪞", color: "#06b6d4" },
    { name: "执行", desc: "新方案必须本质不同，有验证标准", icon: "🚀", color: "#10b981" },
    { name: "复盘", desc: "什么解决了？为什么没早想到？", icon: "📝", color: "#22c55e" },
  ]),
  methodTitle: z.string().default("5步调试方法论"),
  methodSubtitle: z.string().default("源自阿里管理体系"),

  benchmarkStats: z.array(BenchmarkStatSchema).default([
    { label: "修复次数", value: 36, suffix: "%", color: "#10b981" },
    { label: "主动验证", value: 65, suffix: "%", color: "#06b6d4" },
    { label: "工具调用", value: 50, suffix: "%", color: "#8b5cf6" },
    { label: "隐藏问题", value: 50, suffix: "%", color: "#f97316" },
  ]),
  benchmarkTitle: z.string().default("实测数据"),
  benchmarkSubtitle: z.string().default("9个真实bug场景 · 18组对照实验"),

  platforms: z.array(PlatformSchema).default([
    { name: "Claude Code", icon: "🟠", color: "#f97316" },
    { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
    { name: "Codex CLI", icon: "🟢", color: "#10b981" },
    { name: "Kiro", icon: "🔵", color: "#3b82f6" },
    { name: "OpenClaw", icon: "🦀", color: "#ef4444" },
  ]),

  ctaLine1: z.string().default("担心你的AI在工作时摸鱼？"),
  ctaLine2: z.string().default("PUA Skill让它不敢放弃"),
  ctaContent: z.string().default("评论区告诉我，你的AI最让你抓狂的摆烂行为是什么？"),
  ctaSlogan: z.string().default("关注不迷路 · 我们下期见"),

  backgroundColor: z.string().default("#0a0a0f"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#ef4444"),
  highlightColor: z.string().default("#fbbf24"),
  secondaryColor: z.string().default("#f97316"),
  successColor: z.string().default("#10b981"),
  methodColor: z.string().default("#8b5cf6"),

  subtitle: SubtitleConfigSchema.default({}),
  audio: AudioConfigSchema.default({}),

  voiceoverScripts: z.array(z.string()).default([]),

  precomputedSubtitles: z.array(z.object({
    words: z.array(z.object({
      text: z.string(),
      startFrame: z.number(),
      endFrame: z.number(),
    })),
    startFrame: z.number(),
    endFrame: z.number(),
  })).optional(),

  sceneDurations: z.array(z.number()).optional(),
});

export type PuaSkillProps = z.infer<typeof PuaSkillSchema>;
export type LazyPattern = z.infer<typeof LazyPatternSchema>;
export type PressureLevel = z.infer<typeof PressureLevelSchema>;
export type IronRule = z.infer<typeof IronRuleSchema>;
export type MethodStep = z.infer<typeof MethodStepSchema>;
export type BenchmarkStat = z.infer<typeof BenchmarkStatSchema>;
export type Platform = z.infer<typeof PlatformSchema>;
