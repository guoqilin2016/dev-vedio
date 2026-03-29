import { z } from "zod";

export const AIHarnessEngineerSubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#00e5ff"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(7, 10, 16, 0.85)"),
});

export const AIHarnessEngineerAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.16),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2.0).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const SceneCardSchema = z.object({
  label: z.string(),
  title: z.string(),
  summary: z.string(),
  chips: z.array(z.string()).default([]),
});

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

export const AIHarnessEngineerSchema = z.object({
  coverLabel: z.string().default("HARNESS ENGINEERING"),
  coverTitle: z.string().default("Prompt 之后"),
  coverSubtitle: z.string().default("AI 新工程角色"),

  sceneCards: z.array(SceneCardSchema).length(7).default([
    {
      label: "SCENE 01",
      title: "Prompt 不够了",
      summary: "价值开始从写提示词，转向让代理稳定干活。",
      chips: ["Prompt", "Agents", "Shift"],
    },
    {
      label: "SCENE 02",
      title: "Demo 能跑，生产跑不动",
      summary: "权限、上下文、回放和观测，才是生产真正的门槛。",
      chips: ["Runtime", "Replay", "Observability"],
    },
    {
      label: "SCENE 03",
      title: "什么是 Harness",
      summary: "Harness 是代理外面的整套运行系统，不是单个框架。",
      chips: ["Context", "Tools", "Evals"],
    },
    {
      label: "SCENE 04",
      title: "OpenAI 已经下场",
      summary: "Harness Engineering 已经被写进产品与工程叙事。",
      chips: ["Codex", "App Server", "Feedback Loops"],
    },
    {
      label: "SCENE 05",
      title: "能力已经被拆开",
      summary: "规划、执行、审批、记忆和边界，正在模块化。",
      chips: ["Subagents", "Human-in-loop", "Memory"],
    },
    {
      label: "SCENE 06",
      title: "谁会先吃到红利",
      summary: "能让代理稳定交付的人，会先获得新一轮杠杆。",
      chips: ["Workflow", "Sandbox", "Guardrails"],
    },
    {
      label: "SCENE 07",
      title: "现在就该补的能力",
      summary: "下一阶段的关键，不是更会炫技，而是更会系统化。",
      chips: ["Evals", "Controls", "Reliability"],
    },
  ]),

  backgroundColor: z.string().default("#0a0d14"),
  textColor: z.string().default("#ffffff"),
  mutedTextColor: z.string().default("#93a4bc"),
  accentColor: z.string().default("#00e5ff"),
  highlightColor: z.string().default("#4d7cff"),
  successColor: z.string().default("#34d399"),
  warningColor: z.string().default("#f59e0b"),
  panelColor: z.string().default("rgba(9, 17, 29, 0.78)"),

  subtitle: AIHarnessEngineerSubtitleConfigSchema.default(
    AIHarnessEngineerSubtitleConfigSchema.parse({}),
  ),
  audio: AIHarnessEngineerAudioConfigSchema.default(
    AIHarnessEngineerAudioConfigSchema.parse({}),
  ),

  voiceoverScripts: z.array(z.string()).default([
    "你以为 AI 时代最值钱的是提示词吗？... 但 2026 年开始冒头的，可能已经不是 Prompt Engineer。越来越值钱的，是能让代理稳定干活的人。",
    "很多 agent demo 看起来都很强，可一进真实环境就出问题。权限不清楚，上下文漂移，失败没法回放，行为也看不见。企业真正缺的，不是会演示的 AI，而是可靠代理。",
    "所以什么叫 Harness？... 它不是单个框架，也不只是多接几个工具。Harness 是代理外面的整套运行系统，负责上下文、记忆、权限、评测、观测和执行环境。",
    "这不是社区自嗨。OpenAI 已经公开在讲 Harness Engineering，还把重点放在设计环境、指定意图和反馈回路。连 Codex 的 App Server 也在说明，真正重要的，已经是代理运行外壳。",
    "再看 LangChain 这类文档，harness 的能力已经被拆开了。规划、文件系统、子代理、执行、人类审批、skills、memory，全都在模块化。MCP 也在强调边界和用户同意。行业正在从怎么提问，走到怎么把代理系统搭对。",
    "所以未来更值钱的，不只是会写 prompt 的人。真正吃到红利的，是能让代理稳定交付结果的人。如果你已经在做 workflow、sandbox、evals、guardrails、observability，你其实已经在往这个方向走了。",
    "所以别再只盯着花哨 demo 了。下一阶段真正稀缺的，是把 AI 变成可靠系统。少一点提示词神话，多补运行环境、权限控制、评测和可见性。",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).length(7).optional(),
});

export type AIHarnessEngineerProps = z.infer<typeof AIHarnessEngineerSchema>;
export type AIHarnessEngineerSceneCard = z.infer<typeof SceneCardSchema>;
