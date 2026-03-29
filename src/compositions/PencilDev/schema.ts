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

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#bef264"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(5, 8, 22, 0.85)"),
});

export const AudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.2),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const OldToolCardSchema = z.object({
  name: z.string(),
  ghostColor: z.string(),
});

const WorkflowWindowSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const IdeColumnSchema = z.object({
  label: z.string(),
  detail: z.string(),
});

const AgentCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

const ProtocolNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const EvidenceCardSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const PencilDevSchema = z.object({
  // Cover (PencilDevCover)
  coverLabel: z.string().default("PENCIL.DEV"),
  coverTitle: z.string().default("Figma 我真不开了"),
  coverSubtitle: z.string().default("主力设计软件，已经换了"),
  coverStrip: z.string().default("IDE 内设计 | Agent 共创 | PDF 导出"),

  // Scene 1 — HookScene
  hookTopTag: z.string().default("PENCIL.DEV"),
  hookMainLine: z.string().default("Figma / PS / AI 我真不开了"),
  hookSubLine: z.string().default("我的主力设计软件，已经换了"),
  hookOldTools: z.array(OldToolCardSchema).default([
    { name: "Figma", ghostColor: "#fb7185" },
    { name: "Photoshop", ghostColor: "#fb7185" },
    { name: "Illustrator", ghostColor: "#fb7185" },
  ]),
  hookPencilLabel: z.string().default("Pencil.dev"),

  // Scene 2 — PainScene
  painTopTag: z.string().default("CONTEXT SWITCH"),
  painWindows: z.array(WorkflowWindowSchema).default([
    { title: "设计工具", detail: "画布与组件" },
    { title: "AI 对话框", detail: "提示与迭代" },
    { title: "导出面板", detail: "格式与尺寸" },
    { title: "代码预览", detail: "设计与实现对齐" },
  ]),
  painSwitchLabel: z.string().default("切换成本"),
  painQuote: z.string().default("问题不是设计变难，而是切换太多"),

  // Scene 3 — CoreScene
  coreTopTag: z.string().default("DESIGN INSIDE IDE"),
  coreLeftColumn: IdeColumnSchema.default({
    label: "左栏",
    detail: "设计图层 / Agent 列表",
  }),
  coreCenterColumn: IdeColumnSchema.default({
    label: "中栏",
    detail: "矢量画布 / 组件预览",
  }),
  coreRightColumn: IdeColumnSchema.default({
    label: "右栏",
    detail: "AI 协作 / 代码同步 / 属性",
  }),
  coreEmphasis: z.string().default("Design + Code + AI"),

  // Scene 4 — AgentScene
  agentTopTag: z.string().default("AGENT TEAM"),
  agentCanvasLabel: z.string().default("同一份设计稿"),
  agentCards: z.array(AgentCardSchema).default([
    { title: "Layout Agent", subtitle: "版式与栅格" },
    { title: "Brand Agent", subtitle: "品牌与语义" },
    { title: "Detail Agent", subtitle: "细节与组件" },
    { title: "Export Agent", subtitle: "导出与交付" },
  ]),
  agentQuote: z.string().default("像科幻片，但不是摆拍"),

  // Scene 5 — ProofScene
  proofTopTag: z.string().default("MCP · SKILL · AGENT"),
  proofTitle: z.string().default("为什么我说它是顶级模板"),
  proofCenterNodeId: z.string().default("Pencil"),
  proofNodes: z.array(ProtocolNodeSchema).default([
    { id: "Pencil", label: "Pencil" },
    { id: "MCP", label: "MCP" },
    { id: "Skill", label: "Skill" },
    { id: "Agent", label: "Agent" },
    { id: "Logs", label: "Logs" },
  ]),
  proofIntegrationLine: z.string().default("不是一个功能点强，是整套系统感很强"),
  proofLogPreview: z.array(z.string()).default([
    "> agent.trace: read .pen",
    "> mcp.tool: export_preview",
    "> skill: brand_tokens_apply",
  ]),

  // Scene 6 — DailyUseScene
  dailyTopTag: z.string().default("MAIN TOOL"),
  dailyTitle: z.string().default("真正让我留下来的，是主力感"),
  dailyEvidence: z.array(EvidenceCardSchema).default([
    { title: "近 1 个月深度使用", detail: "主力软件，不是尝鲜" },
    { title: "几个项目 + 日常小设计", detail: "真实交付与随手改" },
    { title: "和 Agent 共改设计", detail: "速度非常快" },
  ]),
  dailyPdfBadge: z.string().default("PDF EXPORT"),
  dailyTimelineLabel: z.string().default("持续使用 · 持续进化"),

  // Scene 7 — CTAScene
  ctaTopTag: z.string().default("SAVE THIS"),
  ctaMainLine: z.string().default("设计工作流，已经换代了"),
  ctaSubLine: z.string().default("Pencil.dev 不是外挂，它像新的主工作台"),
  ctaClosing: z.string().default("先收藏"),
  ctaTags: z.array(z.string()).default([
    "#PencilDev",
    "#AIDesign",
    "#AgentWorkflow",
  ]),

  // Theme (spec §2)
  backgroundColor: z.string().default("#050816"),
  textColor: z.string().default("#ffffff"),
  mutedTextColor: z.string().default("#94a3b8"),
  accentColor: z.string().default("#22d3ee"),
  highlightColor: z.string().default("#bef264"),
  secondaryColor: z.string().default("#818cf8"),
  successColor: z.string().default("#34d399"),
  dangerColor: z.string().default("#fb7185"),
  warningColor: z.string().default("#f59e0b"),
  panelColor: z.string().default("rgba(15, 23, 42, 0.82)"),

  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),

  voiceoverScripts: z.array(z.string()).default([
    "说出来你可能不信，我现在做设计，真的已经很久没打开 Figma、Photoshop、Illustrator 了。不是因为我不用设计了，而是因为 Pencil.dev 已经把这套工作流换掉了。",
    "以前做设计很自然，就是打开设计软件，开聊天窗口，开素材窗口，来回导出，来回复制，再回头改。问题是到了今天，这种不断切换上下文、不断搬运内容的工作流，已经开始显得笨了。",
    "Pencil.dev 最厉害的地方，不是它又做了一个画图软件，而是它把设计、代码和 AI 重新放回了同一个工作台里。你不用再一直跨应用跳来跳去，设计这件事开始真正长进 IDE 里。",
    "第一次看到它的 Agent Team 并行设计，我是真的有点被震住了。那种感觉很像科幻片，不是一个 AI 在慢慢帮你补图，而是一组不同角色同时在围着同一份设计工作。",
    "但我真正服气，不是因为画面酷，而是因为我认真跑了几个测试项目，又深入看了很多大模型对话日志之后，发现它在 MCP、Skill、Agent 这几个概念上的整合，真的已经是顶级模板了。",
    "真正让我留下来的原因很简单，它已经变成我近一个月最常用的设计软件了。我拿它写了几个项目，平时的小设计也在用，还能直接和 agent 一起改图，速度非常快。最近它又更新了 PDF 导出，这种持续进化，说明它不是玩具。",
    "如果你现在还把 AI 设计理解成开 Figma、开聊天窗口、再来回搬运，那这套工作流你最好重新看一遍。不是说旧工具没用，而是新的主力工作台已经出现了。先收藏。",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).optional(),
}).refine(
  (data) =>
    data.proofNodes.some((node) => node.id === data.proofCenterNodeId),
  {
    message: "proofCenterNodeId must match an id in proofNodes",
    path: ["proofCenterNodeId"],
  },
);

export type PencilDevProps = z.infer<typeof PencilDevSchema>;
export type PencilDevOldToolCard = z.infer<typeof OldToolCardSchema>;
export type PencilDevWorkflowWindow = z.infer<typeof WorkflowWindowSchema>;
export type PencilDevIdeColumn = z.infer<typeof IdeColumnSchema>;
export type PencilDevAgentCard = z.infer<typeof AgentCardSchema>;
export type PencilDevProtocolNode = z.infer<typeof ProtocolNodeSchema>;
export type PencilDevEvidenceCard = z.infer<typeof EvidenceCardSchema>;
