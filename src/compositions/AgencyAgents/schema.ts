import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#22c55e"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(8, 12, 18, 0.85)"),
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

const DepartmentSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const AgentRoleSchema = z.object({
  role: z.string(),
  desc: z.string(),
  icon: z.string(),
  color: z.string(),
});

const PlatformLogoSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const MVPStepSchema = z.object({
  name: z.string(),
  output: z.string(),
  icon: z.string(),
  color: z.string(),
});

const PlatformSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const AgencyAgentsSchema = z.object({
  hookLine1: z.string().default("你还在一个人跟AI单打独斗吗？"),
  hookLine2: z.string().default("147个AI专家团队，零成本组建"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),
  githubStars: z.number().default(46800),
  agentCount: z.number().default(147),
  departmentCount: z.number().default(12),

  painTitle: z.string().default("你的AI用法，效率低得可怕"),
  painPoints: z.array(z.string()).default([
    "每次都要从零调教",
    "没有专业视角和领域知识",
    "没有标准工作流程",
    "没有交付物模板",
    "没有质量评估标准",
  ]),
  painQuote: z.string().default("一个AI当万能工具人，结果什么都不精"),

  coreTitle: z.string().default("组织架构代码化"),
  coreSubtitle: z.string().default("147个Agent · 12个部门"),
  departments: z.array(DepartmentSchema).default([
    { name: "工程", icon: "⚙️", color: "#3b82f6" },
    { name: "产品", icon: "📋", color: "#8b5cf6" },
    { name: "设计", icon: "🎨", color: "#ec4899" },
    { name: "增长", icon: "📈", color: "#22c55e" },
    { name: "数据", icon: "📊", color: "#06b6d4" },
    { name: "安全", icon: "🔒", color: "#ef4444" },
    { name: "运维", icon: "🛠️", color: "#f97316" },
    { name: "QA", icon: "✅", color: "#10b981" },
    { name: "内容", icon: "✏️", color: "#a855f7" },
    { name: "HR", icon: "👥", color: "#f59e0b" },
    { name: "财务", icon: "💰", color: "#fbbf24" },
    { name: "法务", icon: "⚖️", color: "#6366f1" },
  ]),

  agentRoles: z.array(AgentRoleSchema).default([
    { role: "产品经理", desc: "完整PRD与需求分析", icon: "📋", color: "#8b5cf6" },
    { role: "后端架构师", desc: "技术方案与架构图", icon: "🏗️", color: "#3b82f6" },
    { role: "前端工程师", desc: "完整业务代码生成", icon: "💻", color: "#06b6d4" },
    { role: "增长专家", desc: "推广策略与营销文案", icon: "🚀", color: "#22c55e" },
  ]),
  localPlatforms: z.array(PlatformLogoSchema).default([
    { name: "小红书", icon: "📕", color: "#fe2c55" },
    { name: "抖音", icon: "🎵", color: "#000000" },
    { name: "B站", icon: "📺", color: "#00a1d6" },
  ]),
  agentShowcaseQuote: z.string().default("昨天刚更新，社区极其活跃"),

  collaborationTitle: z.string().default("多Agent协作"),
  collaborationSubtitle: z.string().default("轻量级组织架构 · 链式调用"),
  collaborationFeatures: z.array(z.string()).default([
    "手动链式调用多角色",
    "内置 Agents Orchestrator",
    "角色间上下文无缝传递",
    "自定义协作工作流",
  ]),
  supportedTools: z.array(PlatformSchema).default([
    { name: "Claude Code", icon: "🟠", color: "#f97316" },
    { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
    { name: "Aider", icon: "🔧", color: "#22c55e" },
    { name: "Gemini CLI", icon: "🔵", color: "#3b82f6" },
    { name: "Windsurf", icon: "🏄", color: "#06b6d4" },
    { name: "OpenClaw", icon: "🦀", color: "#ef4444" },
  ]),

  mvpTitle: z.string().default("从零到MVP完整闭环"),
  mvpSubtitle: z.string().default("成本 ≈ ¥0"),
  mvpSteps: z.array(MVPStepSchema).default([
    { name: "产品经理 Agent", output: "需求分析 → PRD", icon: "📋", color: "#8b5cf6" },
    { name: "架构师 Agent", output: "技术方案 → 架构图", icon: "🏗️", color: "#3b82f6" },
    { name: "前端工程师 Agent", output: "完整业务代码", icon: "💻", color: "#06b6d4" },
    { name: "增长专家 Agent", output: "推广策略 → 文案", icon: "🚀", color: "#22c55e" },
  ]),

  ctaLine1: z.string().default("147个岗位的AI专业团队"),
  ctaLine2: z.string().default("等你一键组建"),
  ctaContent: z.string().default("评论区告诉我，你准备先抓哪个Agent给你打黑工？"),
  ctaSlogan: z.string().default("关注不迷路 · 我们下期见"),

  backgroundColor: z.string().default("#080c12"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#22c55e"),
  highlightColor: z.string().default("#8b5cf6"),
  secondaryColor: z.string().default("#3b82f6"),
  warningColor: z.string().default("#f97316"),

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

export type AgencyAgentsProps = z.infer<typeof AgencyAgentsSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type AgentRole = z.infer<typeof AgentRoleSchema>;
export type PlatformLogo = z.infer<typeof PlatformLogoSchema>;
export type MVPStep = z.infer<typeof MVPStepSchema>;
export type Platform = z.infer<typeof PlatformSchema>;
