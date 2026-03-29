import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#10b981"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(7, 10, 16, 0.85)"),
});

export const AudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.2),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2.0).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const QualityLevelSchema = z.object({
  range: z.string(),
  label: z.string(),
  color: z.string(),
});

const PillarSchema = z.object({
  title: z.string(),
  desc: z.string(),
  detail: z.string(),
});

const WorkflowStepSchema = z.object({
  command: z.string(),
  label: z.string(),
});

export const GSDIntroSchema = z.object({
  hookTitle: z.string().default("你的 AI 越写越垃圾？"),
  hookSubtitle: z.string().default("38,000+ Star 的开源神器专治这个病"),
  hookStars: z.number().default(38000),

  painTitle: z.string().default("Context Rot · 上下文腐烂"),
  painSubtitle: z.string().default("AI 的致命弱点"),
  qualityLevels: z.array(QualityLevelSchema).default([
    { range: "0–30%", label: "巅峰状态", color: "#22c55e" },
    { range: "30–50%", label: "开始赶进度", color: "#fbbf24" },
    { range: "50–70%", label: "偷工减料", color: "#f97316" },
    { range: "70%+", label: "胡说八道", color: "#ef4444" },
  ]),

  creatorName: z.string().default("Lex Christopherson"),
  creatorHandle: z.string().default("glittercowboy"),
  creatorLocation: z.string().default("Costa Rica"),
  creatorBackground: z.string().default("House Music Producer"),
  creatorQuote: z.string().default("I don't write code — Claude Code does."),

  coreTitle: z.string().default("三大核心设计"),
  pillars: z.array(PillarSchema).default([
    {
      title: "规范驱动",
      desc: "先写 Spec 再写代码",
      detail: "所有需求拆成原子级任务",
    },
    {
      title: "波次并行",
      desc: "无依赖同时执行",
      detail: "有依赖排队等待，像流水线一样",
    },
    {
      title: "隔离上下文",
      desc: "每任务全新 200K 窗口",
      detail: "做完就丢掉，主会话保持 30–40%",
    },
  ]),

  installCommand: z.string().default("npx get-shit-done-cc@latest"),
  workflowSteps: z.array(WorkflowStepSchema).default([
    { command: "new-project", label: "AI 面试你，搞清楚你要什么" },
    { command: "discuss-phase", label: "锁定产品决策" },
    { command: "plan-phase", label: "自动研究加规划" },
    { command: "execute-phase", label: "波次并行执行，每任务自动 git commit" },
    { command: "verify-work", label: "自动化验收" },
    { command: "complete-milestone", label: "归档发布" },
  ]),

  impactStars: z.string().default("38,000+"),
  impactGrowth: z.string().default("4,500/week"),
  impactContributors: z.string().default("80+"),
  impactRuntimes: z.string().default("6"),
  impactCompanies: z.array(z.string()).default([
    "Amazon",
    "Google",
    "Shopify",
    "Webflow",
  ]),
  impactQuotes: z.array(z.string()).default([
    "2–3 天的活，压缩到 1 天",
    "6 个月的研究项目，几天做完",
  ]),

  ctaSlogan: z.string().default("让你的 AI 从头到尾都靠谱"),
  ctaCommand: z.string().default("npx get-shit-done-cc@latest"),
  ctaGithub: z.string().default("GitHub 搜 GSD / Get Shit Done"),
  ctaTags: z.array(z.string()).default([
    "#GSD",
    "#GetShitDone",
    "#AI编程",
    "#ClaudeCode",
    "#开源",
  ]),

  backgroundColor: z.string().default("#070a10"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#10b981"),
  highlightColor: z.string().default("#06b6d4"),
  successColor: z.string().default("#22c55e"),
  dangerColor: z.string().default("#ef4444"),
  warningColor: z.string().default("#f59e0b"),
  goldColor: z.string().default("#fbbf24"),
  terminalGreen: z.string().default("#4ade80"),

  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),

  voiceoverScripts: z.array(z.string()).default([
    "你有没有发现，用AI写代码，前面写得特别好，但越到后面，越离谱？变量名乱取，需求忘一半，代码开始自己跟自己打架。这不是你的问题，这是AI的通病，叫Context Rot，上下文腐烂。今天介绍一个38000 Star的开源神器，专治这个病。",
    "AI有个致命弱点，它的上下文窗口是有限的。当对话历史，调试记录，文件内容，把窗口塞满之后，信噪比急剧下降。0到30%，巅峰状态。30到50%，开始赶进度。50到70%，偷工减料。70%以上，直接开始胡说八道。这就是为什么你的AI，写到一半就变了。",
    "解决这个问题的人，不是什么大厂工程师，是一个住在哥斯达黎加的House音乐制作人。他叫Lex Christopherson，GitHub名字叫glittercowboy。他说，我不写代码，Claude Code帮我写。但我需要一个系统，让AI从头到尾都靠谱。于是GSD诞生了，Get Shit Done。",
    "GSD的核心思路很简单，把Context当稀缺资源来管理。三个关键设计。第一，规范驱动。先写Spec再写代码，所有需求拆成原子级任务。第二，波次并行。没有依赖的任务同时执行，有依赖的排队等待，像流水线一样。第三，隔离上下文。每个任务，都在全新的200K上下文窗口里执行。做完就丢掉。主会话，永远保持30到40%。",
    "用起来更简单，一条命令安装。然后6步循环，new-project，AI面试你，搞清楚你要什么。discuss-phase，锁定产品决策。plan-phase，自动研究加规划。execute-phase，波次并行执行，每个任务自动git commit。verify-work，自动化验收。complete-milestone，归档发布。全程你可以，去喝杯咖啡。",
    "效果怎么样？38000个GitHub Star，每周增长4500。Amazon，Google，Shopify，Webflow的工程师，都在用。有人实测，2到3天的活，压缩到1天。有人把6个月的研究项目，几天做完。支持6种运行时，Claude Code，Gemini CLI，OpenCode，Codex，Copilot，Antigravity。MIT开源，完全免费。",
    "如果你也在用AI写代码，一定要试试这个。一条命令搞定，npx get-shit-done-cc@latest。GitHub搜GSD或者Get Shit Done。让你的AI，从头到尾都靠谱。关注我，下期继续分享，最前沿的AI工具。",
  ]),

  precomputedSubtitles: z
    .array(
      z.object({
        words: z.array(
          z.object({
            text: z.string(),
            startFrame: z.number(),
            endFrame: z.number(),
          }),
        ),
        startFrame: z.number(),
        endFrame: z.number(),
      }),
    )
    .optional(),

  sceneDurations: z.array(z.number()).optional(),
});

export type GSDIntroProps = z.infer<typeof GSDIntroSchema>;
export type QualityLevel = z.infer<typeof QualityLevelSchema>;
export type Pillar = z.infer<typeof PillarSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
