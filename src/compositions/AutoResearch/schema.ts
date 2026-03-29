import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#22d65e"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(5, 10, 16, 0.85)"),
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

const LoopStepSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  desc: z.string(),
});

const ProjectFileSchema = z.object({
  name: z.string(),
  desc: z.string(),
  icon: z.string(),
  color: z.string(),
  editable: z.boolean().default(false),
});

const ExperimentStepSchema = z.object({
  step: z.string(),
  icon: z.string(),
  color: z.string(),
});

const BenchmarkSchema = z.object({
  smallModel: z.string(),
  largeModel: z.string(),
  result: z.string(),
});

export const AutoResearchSchema = z.object({
  hookLine1: z.string().default("卡帕西又出手了"),
  hookLine2: z.string().default("AI自己搞科研的时代来了"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),
  githubStars: z.number().default(44000),
  codeLines: z.number().default(630),
  fileCount: z.number().default(3),

  painTitle: z.string().default("你还在手动调参？"),
  painPoints: z.array(z.string()).default([
    "手动改一行代码跑一次实验",
    "熬夜盯Loss曲线",
    "反复微调超参数",
    "实验记录散落各处",
    "跑完一轮要等半天",
  ]),
  painQuote: z.string().default("人肉科研，效率低得可怕"),

  coreTitle: z.string().default("AI自我进化实验室"),
  coreSubtitle: z.string().default("无人值守 · 闭环进化"),
  loopSteps: z.array(LoopStepSchema).default([
    { name: "写代码", icon: "💻", color: "#22d65e", desc: "AI修改train.py" },
    { name: "跑训练", icon: "🔥", color: "#f59e0b", desc: "固定5分钟训练" },
    { name: "看结果", icon: "📊", color: "#10b4e8", desc: "检查val_bpb指标" },
    { name: "改代码", icon: "🔄", color: "#a855f7", desc: "保留最优/丢弃差的" },
  ]),

  minimalTitle: z.string().default("极简即暴力"),
  minimalSubtitle: z.string().default("630行代码 · 单张GPU"),
  projectFiles: z.array(ProjectFileSchema).default([
    { name: "prepare.py", desc: "数据准备和评估工具", icon: "📦", color: "#10b4e8", editable: false },
    { name: "train.py", desc: "模型+训练循环 (AI修改)", icon: "🔥", color: "#ef4444", editable: true },
    { name: "program.md", desc: "AI的指令文件 (人类编写)", icon: "📝", color: "#22d65e", editable: true },
  ]),

  smartTitle: z.string().default("智商碾压"),
  experimentLoop: z.array(ExperimentStepSchema).default([
    { step: "修改架构/超参", icon: "✏️", color: "#a855f7" },
    { step: "训练5分钟", icon: "⏱️", color: "#f59e0b" },
    { step: "对比val_bpb", icon: "📉", color: "#10b4e8" },
    { step: "保留/丢弃", icon: "✅", color: "#22d65e" },
  ]),
  benchmark: BenchmarkSchema.default({
    smallModel: "0.8B",
    largeModel: "1.6B",
    result: "AI跑出的小模型反超人类微调大模型",
  }),

  paradigmTitle: z.string().default("科研范式地震"),
  paradigmQuote: z.string().default("我去蒸了个桑拿，回来AI已经跑完实验了"),
  paradigmBefore: z.string().default("人类研究AI"),
  paradigmAfter: z.string().default("AI研究AI"),
  programMdPreview: z.array(z.string()).default([
    "# AutoResearch Program",
    "",
    "## Goal",
    "  Minimize val_bpb on FineWeb-Edu",
    "",
    "## Rules",
    "  1. Only modify train.py",
    "  2. Each run = 5 min wall clock",
    "  3. Keep or discard based on metric",
  ]),

  ctaLine1: z.string().default("今天的程序员在写代码"),
  ctaLine2: z.string().default("明天的程序员在指挥AI写代码"),
  ctaContent: z.string().default("评论区告诉我，你觉得AI自主科研的时代还有多远？"),
  ctaSlogan: z.string().default("关注不迷路 · 我们下期见"),

  backgroundColor: z.string().default("#050a10"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#22d65e"),
  highlightColor: z.string().default("#10b4e8"),
  secondaryColor: z.string().default("#f59e0b"),
  warningColor: z.string().default("#ef4444"),

  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),

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

export type AutoResearchProps = z.infer<typeof AutoResearchSchema>;
export type LoopStep = z.infer<typeof LoopStepSchema>;
export type ProjectFile = z.infer<typeof ProjectFileSchema>;
export type ExperimentStep = z.infer<typeof ExperimentStepSchema>;
export type Benchmark = z.infer<typeof BenchmarkSchema>;
