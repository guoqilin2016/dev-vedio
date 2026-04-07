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

export const AgentSkillsSubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#34A853"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(7, 10, 20, 0.86)"),
});

export const AgentSkillsAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.16),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const PainPointSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const PipelineStepSchema = z.object({
  phase: z.string(),
  command: z.string(),
  principle: z.string(),
  color: z.string(),
  icon: z.string(),
});

const ExcuseRebuttalSchema = z.object({
  excuse: z.string(),
  rebuttal: z.string(),
  ruleName: z.string(),
});

const SkillCategorySchema = z.object({
  phase: z.string(),
  color: z.string(),
  icon: z.string(),
  skillCount: z.number(),
  skills: z.array(z.string()),
});

const GooglePrincipleSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  area: z.string(),
  color: z.string(),
});

const PlatformSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const AgentSkillsSchema = z.object({
  // 封面配置
  coverLabel: z.string().default("AGENT SKILLS"),
  coverTitle: z.string().default("19 个 Google 级工程技能"),
  coverSubtitle: z.string().default("给 AI 编程助手装上工程规范"),
  coverMetrics: z.array(z.string()).length(3).default([
    "4,600+ Stars",
    "19 Skills",
    "7 Commands",
  ]),

  // Hook 场景
  hookTitle: z.string().default("AGENT SKILLS"),
  hookStarCount: z.string().default("4,600+"),
  hookSubtitle: z.string().default("19 个技能 × 7 个命令 × Google 工程文化"),
  hookRepoName: z.string().default("addyosmani/agent-skills"),
  hookRepoDesc: z.string().default("Production-grade engineering skills for AI coding agents."),
  hookAuthor: z.string().default("Addy Osmani"),
  hookAuthorTitle: z.string().default("Google Chrome · Engineering Manager"),

  // 痛点场景
  painTitle: z.string().default("你的 AI 还在裸奔写代码？"),
  painPoints: z.array(PainPointSchema).length(5).default([
    { icon: "❌", title: "跳过规范", description: "不写 spec 直接写代码" },
    { icon: "❌", title: "不写测试", description: "能跑就行，没有测试" },
    { icon: "❌", title: "无代码审查", description: "写完直接合并，不 review" },
    { icon: "❌", title: "忽略安全", description: "安全检查？什么安全检查？" },
    { icon: "❌", title: "无性能意识", description: "先上线再说，优化以后再说" },
  ]),
  painQuote: z.string().default("能跑 ≠ 能维护，AI 追求「完成」而非「正确」"),

  // 管道场景
  pipelineTitle: z.string().default("7 命令覆盖完整生命周期"),
  pipelineSubtitle: z.string().default("每个命令自动激活对应技能"),
  pipelineSteps: z.array(PipelineStepSchema).length(7).default([
    { phase: "DEFINE", command: "/spec", principle: "先规范后编码", color: "#4285F4", icon: "📋" },
    { phase: "PLAN", command: "/plan", principle: "小的可验证任务", color: "#34A853", icon: "📐" },
    { phase: "BUILD", command: "/build", principle: "每次一个切片", color: "#FBBC04", icon: "🔨" },
    { phase: "VERIFY", command: "/test", principle: "测试即证据", color: "#EA4335", icon: "🧪" },
    { phase: "REVIEW", command: "/review", principle: "提升代码健康度", color: "#4285F4", icon: "🔍" },
    { phase: "SIMPLIFY", command: "/code-simplify", principle: "清晰胜过聪明", color: "#34A853", icon: "✂️" },
    { phase: "SHIP", command: "/ship", principle: "越快越安全", color: "#FBBC04", icon: "🚀" },
  ]),

  // 反合理化场景
  antiRatTitle: z.string().default("AI 找借口？直接打回"),
  antiRatSubtitle: z.string().default("每个技能都内置反合理化表格"),
  excuseRebuttals: z.array(ExcuseRebuttalSchema).length(4).default([
    { excuse: "后面再加测试", rebuttal: "不测试就不能合并", ruleName: "碧昂斯规则" },
    { excuse: "这个太简单不需要设计", rebuttal: "所有项目必须有设计文档", ruleName: "Spec First" },
    { excuse: "看起来对就行", rebuttal: "必须有运行时证据", ruleName: "验证至上" },
    { excuse: "改太多太危险", rebuttal: "先理解再删除", ruleName: "切斯特顿栅栏" },
  ]),
  antiRatQuote: z.string().default("「感觉对了」永远不够 — 必须有证据"),

  // 19 技能分类场景
  skillsTitle: z.string().default("19 个技能 · 6 大分类"),
  skillsSubtitle: z.string().default("全链路覆盖"),
  skillCategories: z.array(SkillCategorySchema).length(6).default([
    { phase: "Define", color: "#4285F4", icon: "💡", skillCount: 2, skills: ["idea-refine", "spec-driven"] },
    { phase: "Plan", color: "#34A853", icon: "📐", skillCount: 1, skills: ["task-breakdown"] },
    { phase: "Build", color: "#FBBC04", icon: "🔨", skillCount: 5, skills: ["incremental", "TDD", "context", "frontend", "API design"] },
    { phase: "Verify", color: "#EA4335", icon: "🧪", skillCount: 2, skills: ["browser test", "debugging"] },
    { phase: "Review", color: "#4285F4", icon: "🔍", skillCount: 4, skills: ["code quality", "security", "performance", "simplification"] },
    { phase: "Ship", color: "#34A853", icon: "🚀", skillCount: 5, skills: ["git workflow", "CI/CD", "deprecation", "docs", "launch"] },
  ]),

  // Skill 解剖 + Google 哲学场景
  anatomyTitle: z.string().default("Process, Not Prose"),
  anatomySubtitle: z.string().default("可执行的工作流 · 不是参考文档"),
  skillStructure: z.array(z.string()).length(6).default([
    "Overview",
    "When to Use",
    "Process",
    "Rationalizations",
    "Red Flags",
    "Verification",
  ]),
  googlePrinciples: z.array(GooglePrincipleSchema).length(4).default([
    { name: "海勒姆定律", nameEn: "Hyrum's Law", area: "API 设计", color: "#4285F4" },
    { name: "切斯特顿栅栏", nameEn: "Chesterton's Fence", area: "代码简化", color: "#34A853" },
    { name: "碧昂斯规则", nameEn: "Beyoncé Rule", area: "测试", color: "#FBBC04" },
    { name: "左移理念", nameEn: "Shift Left", area: "CI/CD", color: "#EA4335" },
  ]),
  platforms: z.array(PlatformSchema).default([
    { name: "Claude Code", icon: "🟠", color: "#f97316" },
    { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
    { name: "Gemini CLI", icon: "🔵", color: "#3b82f6" },
    { name: "Windsurf", icon: "🏄", color: "#06b6d4" },
    { name: "Codex", icon: "🟢", color: "#10b981" },
  ]),

  // CTA 场景
  ctaTitle: z.string().default("别让 AI 写垃圾代码了"),
  ctaBody: z.string().default("19 个技能 · 7 个命令 · 免费开源"),
  ctaSlogan: z.string().default("Google 级工程规范，现在免费给你用"),
  ctaTags: z.array(z.string()).default([
    "#AIAgent",
    "#GitHub",
    "#AI编程",
    "#Google",
    "#开源项目",
    "#工程规范",
  ]),

  // 配色
  backgroundColor: z.string().default("#070a14"),
  textColor: z.string().default("#e0e0e0"),
  mutedTextColor: z.string().default("#8a9ab5"),
  accentColor: z.string().default("#4285F4"),
  highlightColor: z.string().default("#34A853"),
  secondaryColor: z.string().default("#FBBC04"),
  dangerColor: z.string().default("#EA4335"),
  panelColor: z.string().default("rgba(10, 18, 32, 0.85)"),
  goldColor: z.string().default("#ffd700"),

  // 字幕/音频
  subtitle: AgentSkillsSubtitleConfigSchema.default(
    AgentSkillsSubtitleConfigSchema.parse({}),
  ),
  audio: AgentSkillsAudioConfigSchema.default(
    AgentSkillsAudioConfigSchema.parse({}),
  ),

  // 配音脚本
  voiceoverScripts: z.array(z.string()).default([
    "Google前端教父Addy Osmani刚发布了一套AI编程军规！19个工程技能加7个命令...把Google的工程文化直接灌进你的AI Agent！GitHub已经拿下4600颗Star！",
    "你的AI编程助手还在裸奔吗...跳过规范直接写代码...不写测试能跑就行...无代码审查直接合并...AI Agent默认走最短路径...结果代码能跑但项目很快乱成一团...Addy开发这个项目就是为了解决这个问题",
    "核心逻辑极其优雅...7个斜杠命令覆盖完整软件开发生命周期...先写规范...拆解任务...增量构建...用测试证明...代码审查...简化代码...安全上线...每个命令自动激活对应技能...缺一不可",
    "最狠的设计在这里...每个技能都内置了一张反合理化表格...专治AI的各种借口...AI说后面再加测试...碧昂斯规则...不测试就不能合并...AI说看起来对就行...必须有运行时证据...感觉对了永远不够",
    "19个技能分为6大类...Define阶段打磨想法写规范...Plan拆解可验证任务...Build增量实现加TDD加API设计...Verify浏览器测试加调试...Review代码质量加安全加性能...Ship阶段Git工作流加CICD加发布清单...全链路覆盖",
    "每个技能都遵循统一结构...不是参考文档...而是可执行的工作流...核心设计理念来自Google工程文化...海勒姆定律指导API设计...切斯特顿栅栏约束代码简化...碧昂斯规则强制测试...支持Claude Code Cursor Gemini CLI全平台",
    "免费开源...一行命令就能装...别让你的AI继续写垃圾代码了...19个工程技能加7个命令...Google级别的工程规范现在免费给你用...评论区告诉我你觉得你的AI最缺哪项工程技能...关注不迷路我们下期见",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).length(7).optional(),
});

export type AgentSkillsProps = z.infer<typeof AgentSkillsSchema>;
