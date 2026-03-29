import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#8b5cf6"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(7, 8, 16, 0.85)"),
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

const PipelineStepSchema = z.object({
  name: z.string(),
  tag: z.string(),
  icon: z.string(),
  color: z.string(),
  desc: z.string(),
});

const PlatformSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const SuperPowersSchema = z.object({
  hookLine1: z.string().default("你的AI还在一句话写代码？"),
  hookLine2: z.string().default("别人的AI已经是完整工程团队了"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),
  githubStars: z.number().default(84000),
  githubForks: z.number().default(6600),

  problemTitle: z.string().default("说需求 → 直接写代码"),
  problemQuote: z.string().default("能跑 ≠ 能维护"),
  problemLines: z.array(z.string()).default([
    "没有设计文档",
    "没有测试用例",
    "没有代码审查",
    "项目很快乱成一团",
  ]),

  pipelineTitle: z.string().default("7 阶段强制流水线"),
  pipelineSubtitle: z.string().default("核心逻辑极其优雅 · 缺一不可"),
  pipelineSteps: z.array(PipelineStepSchema).default([
    { name: "苏格拉底追问", tag: "QUESTION", icon: "🤔", color: "#a78bfa", desc: "逼你把需求说清楚" },
    { name: "设计文档验证", tag: "DESIGN", icon: "📐", color: "#8b5cf6", desc: "自动生成设计文档" },
    { name: "Git Worktree", tag: "ISOLATE", icon: "🌿", color: "#22c55e", desc: "隔离工作区零污染" },
    { name: "计划拆分", tag: "PLAN", icon: "📋", color: "#06b6d4", desc: "精确到文件和代码片段" },
    { name: "TDD 红绿重构", tag: "TDD", icon: "🧪", color: "#f97316", desc: "跳过测试直接删代码" },
    { name: "双阶段审查", tag: "REVIEW", icon: "🔍", color: "#ef4444", desc: "Critical不过不许前进" },
    { name: "自动开PR", tag: "SHIP", icon: "🚀", color: "#10b981", desc: "多Agent并行交付" },
  ]),

  brainstormTitle: z.string().default("先把需求逼清楚"),
  brainstormQuestions: z.array(z.string()).default([
    "你的核心需求到底是什么？",
    "边界情况考虑过了吗？",
    "API接口要怎么设计？",
    "这会影响哪些现有模块？",
  ]),
  brainstormResult: z.string().default("需求不清 → 不写一行代码"),

  tddTitle: z.string().default("TDD 红绿重构"),
  tddPhases: z.array(z.object({
    label: z.string(),
    color: z.string(),
    icon: z.string(),
  })).default([
    { label: "写测试", color: "#ef4444", icon: "📝" },
    { label: "看它失败", color: "#ef4444", icon: "❌" },
    { label: "写代码", color: "#10b981", icon: "💻" },
    { label: "看它通过", color: "#10b981", icon: "✅" },
  ]),
  tddQuote: z.string().default("跳过测试的代码 → 直接删掉重来"),
  reviewQuote: z.string().default("Critical 问题不解决 → 不许前进"),

  platforms: z.array(PlatformSchema).default([
    { name: "Claude Code", icon: "🟠", color: "#f97316" },
    { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
    { name: "Codex", icon: "🟢", color: "#10b981" },
    { name: "Gemini CLI", icon: "🔵", color: "#3b82f6" },
  ]),
  multiAgentTitle: z.string().default("多Agent并行协作"),
  multiAgentDesc: z.string().default("零配置安装 · 技能自动触发"),

  ctaLine1: z.string().default("今天的AI只是你的副驾驶"),
  ctaLine2: z.string().default("SuperPowers让它成为整个工程团队"),
  ctaContent: z.string().default("评论区告诉我，你觉得AI编程的未来是什么？"),
  ctaSlogan: z.string().default("关注不迷路 · 我们下期见"),

  backgroundColor: z.string().default("#070810"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#8b5cf6"),
  highlightColor: z.string().default("#06b6d4"),
  secondaryColor: z.string().default("#f97316"),
  successColor: z.string().default("#10b981"),
  dangerColor: z.string().default("#ef4444"),

  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),

  voiceoverScripts: z.array(z.string()).default([
    "AI编程的范式转移！SuperPowers已经在GitHub狂揽84000颗Star，Fork超过6600次，还在飙升中！一句话概括：它给AI编程助手装上了一整套真正的软件工程流程！",
    "大多数AI编程助手是什么逻辑？你说一句需求，它直接开始写代码。结果呢？代码能跑，但项目很快乱成一团。因为它根本没有工程思维！",
    "SuperPowers做了一件狠狠的事！强制AI按照真正的软件工程军规来工作！核心逻辑极其优雅：7阶段强制流水线，缺一不可！",
    "先用苏格拉底式追问逼你把需求说清楚，再自动生成设计文档。设计通过后才开始拆任务，每个任务精确到文件路径和代码片段！",
    "然后严格执行TDD红绿重构。先写测试，看它失败，再写代码，看它通过。跳过测试的代码直接删掉重来！每个任务完成后触发双阶段代码审查，Critical问题不解决不许前进！",
    "最后多Agent并行协作，主Agent调度子Agent分头执行，跑完自动开PR！已支持Claude Code、Cursor、Codex、Gemini CLI全平台，零配置安装，技能自动触发！",
    "今天的AI只是你的副驾驶，SuperPowers要让它成为整个工程团队！评论区告诉我，你觉得AI编程的未来是什么？关注不迷路，我们下期见！",
  ]),

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

export type SuperPowersProps = z.infer<typeof SuperPowersSchema>;
export type PipelineStep = z.infer<typeof PipelineStepSchema>;
export type Platform = z.infer<typeof PlatformSchema>;
