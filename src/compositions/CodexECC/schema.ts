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

export const CodexECCSubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#2dd4ff"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(8, 14, 28, 0.86)"),
});

export const CodexECCAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.16),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const ShiftLayerSchema = z.object({
  title: z.string(),
  detail: z.string(),
  emphasis: z.string(),
});

const EvidenceCardSchema = z.object({
  tag: z.string(),
  title: z.string(),
  detail: z.string(),
  footnote: z.string(),
});

const ECCStatSchema = z.object({
  value: z.string(),
  label: z.string(),
  detail: z.string(),
});

const StackRowSchema = z.object({
  stage: z.string(),
  plugin: z.string(),
  ecc: z.string(),
  verdict: z.string(),
});

const RiskCardSchema = z.object({
  title: z.string(),
  detail: z.string(),
  metric: z.string(),
});

const RiskSnapshotSchema = z.object({
  label: z.string(),
  value: z.string(),
  detail: z.string(),
});

export const CodexECCSchema = z.object({
  coverLabel: z.string().default("CODEX x CLAUDE CODE"),
  coverTitle: z.string().default("Codex 塞进 Claude Code"),
  coverSubtitle: z.string().default("真正值钱的是工作流生态"),
  coverMetrics: z.array(z.string()).length(3).default([
    "2026/03/30",
    "1万级热度",
    "入口争夺",
  ]),

  hookTitle: z.string().default("把 Codex 塞进 Claude Code"),
  hookSubtitle: z.string().default("不抢平台，先抢工作流入口"),
  hookBadges: z.array(z.string()).default([
    "/codex:review",
    "/adversarial-review",
    "/codex:rescue",
  ]),

  shiftTitle: z.string().default("竞争焦点已经上移"),
  shiftLayers: z.array(ShiftLayerSchema).length(4).default([
    {
      title: "模型能力",
      detail: "先比谁更会写、更会推理、更会读代码。",
      emphasis: "MODELS",
    },
    {
      title: "工具入口",
      detail: "终端和 IDE 仍重要，但越来越容易被复制。",
      emphasis: "TOOLS",
    },
    {
      title: "工作流入口",
      detail: "开发者不想切平台，只想降低摩擦与回滚成本。",
      emphasis: "WORKFLOW",
    },
    {
      title: "插件生态",
      detail: "真正沉淀的是分发、权限、复用、更新与团队协同。",
      emphasis: "ECOSYSTEM",
    },
  ]),

  evidenceTitle: z.string().default("官方、文档、社区，证据已经齐了"),
  evidenceCards: z.array(EvidenceCardSchema).length(4).default([
    {
      tag: "LAUNCH",
      title: "2026/03/30 官方开源",
      detail: "OpenAI 公开 codex-plugin-cc，直接进入 Claude Code 工作流。",
      footnote: "GitHub",
    },
    {
      tag: "DOCS",
      title: "Codex 把插件写成正式能力层",
      detail: "插件被定义为 skills、apps、MCP 的可复用工作流封装。",
      footnote: "OpenAI Docs",
    },
    {
      tag: "MARKET",
      title: "Claude Code 把 marketplace 做成基础设施",
      detail: "发现、版本、自动更新和分发都已经文档化。",
      footnote: "Anthropic Docs",
    },
    {
      tag: "CLONE",
      title: "社区已经开始照着抄",
      detail: "Hacker News 已出现 Gemini CLI 的 Claude Code 适配版本。",
      footnote: "HN",
    },
  ]),

  eccTitle: z.string().default("下一步会从插件走向系统层"),
  eccStats: z.array(ECCStatSchema).length(4).default([
    {
      value: "REVIEW",
      label: "第二审查",
      detail: "关键改动前，把另一套模型拉进来交叉检查。",
    },
    {
      value: "RESCUE",
      label: "任务接手",
      detail: "长任务后台跑，主会话继续推进，不用干等。",
    },
    {
      value: "MARKET",
      label: "市场分发",
      detail: "能力开始被发现、安装、版本化和自动更新。",
    },
    {
      value: "MCP",
      label: "工具接入",
      detail: "认证、本地环境和工具链开始一起被复用。",
    },
  ]),
  eccPillars: z.array(z.string()).default([
    "第二视角",
    "异步执行",
    "市场分发",
    "工具接入",
  ]),

  stackTitle: z.string().default("真正的差距，是从点状能力走向系统闭环"),
  stackRows: z.array(StackRowSchema).length(4).default([
    {
      stage: "代码复查",
      plugin: "单轮 review",
      ecc: "双模型交叉审查",
      verdict: "关键改动前先拿第二意见",
    },
    {
      stage: "任务接手",
      plugin: "单次 rescue",
      ecc: "异步长任务处理",
      verdict: "复杂任务不再堵死主会话",
    },
    {
      stage: "扩展方式",
      plugin: "单个插件命令",
      ecc: "插件 + 市场 + 工具接入",
      verdict: "能力开始网络化",
    },
    {
      stage: "治理能力",
      plugin: "基础 gate",
      ecc: "权限 + 规则 + 回放",
      verdict: "真正沉淀的是团队工作流",
    },
  ]),

  riskTitle: z.string().default("价值被验证，但成熟度还在补课"),
  riskCards: z.array(RiskCardSchema).length(3).default([
    {
      title: "大改动可能超时",
      detail: "30+ 文件的大 diff 下，后台任务可能超过 300 秒还回不来。",
      metric: "Issue #122",
    },
    {
      title: "大 diff 可能撑爆输入",
      detail: "对抗性复查在大改动下可能碰到缓冲区和输入上限。",
      metric: "Issue #11",
    },
    {
      title: "权限边界可能不一致",
      detail: "项目级 deny 规则可能没有被插件完整继承。",
      metric: "Issue #75",
    },
  ]),
  riskSnapshot: RiskSnapshotSchema.default({
    label: "截至 2026/04/05",
    value: "58 Issues / 40 PRs",
    detail: "热度很高，也说明它仍处于高速修补期。",
  }),

  ctaTitle: z.string().default("模型会换，入口先占住"),
  ctaBody: z.string().default(
    "别只盯模型排名。真正拉开差距的，是谁先把审查、接手、工具接入和团队规则串成闭环。",
  ),
  ctaSlogan: z.string().default("先占工作流入口，再谈模型站队"),
  ctaTags: z.array(z.string()).default([
    "#Codex",
    "#ClaudeCode",
    "#AICoding",
    "#PluginEcosystem",
    "#工作流",
  ]),

  backgroundColor: z.string().default("#0b1020"),
  textColor: z.string().default("#f8fafc"),
  mutedTextColor: z.string().default("#9db0c8"),
  accentColor: z.string().default("#ff7b42"),
  highlightColor: z.string().default("#2dd4ff"),
  successColor: z.string().default("#34d399"),
  warningColor: z.string().default("#fbbf24"),
  dangerColor: z.string().default("#ff5d7a"),
  panelColor: z.string().default("rgba(10, 18, 34, 0.78)"),

  subtitle: CodexECCSubtitleConfigSchema.default(
    CodexECCSubtitleConfigSchema.parse({}),
  ),
  audio: CodexECCAudioConfigSchema.default(
    CodexECCAudioConfigSchema.parse({}),
  ),

  voiceoverScripts: z.array(z.string()).default([
    "OpenAI 居然把 Codex 做成插件，直接塞进了 Claude Code。 这不是功能小更新，而是一次态度变化。 OpenAI 不再等开发者切平台，而是主动钻进已经成型的工作流。",
    "这件事最重要的结论，不是谁模型更强，而是谁更贴近你的日常流程。 竞争焦点，正在从模型和 IDE，转到工作流入口和插件生态。",
    "证据也很完整。 2026 年 3 月 30 日官方开源插件，OpenAI 文档把插件写成正式能力层，Anthropic 文档把 marketplace 写成分发基础设施。 连社区都开始照着适配 Gemini 版本。",
    "再往前看一步，这条路线不会停在一个插件。 真正会继续长出来的，是第二审查、任务接手、市场分发和工具接入。 也就是说，竞争开始从点状功能，走向系统能力。",
    "所以真正值钱的，不再只是一个 review 命令。 更重要的，是把审查、接手、工具接入、团队规则和知识沉淀，慢慢连成同一套闭环。",
    "当然，现实也没那么完美。 截止 2026 年 4 月 5 日，这个插件仓库已经积累了几十个开放问题和合并请求。 大改动超时，权限边界不一致，review gate 循环消耗，这些都说明价值是真的，成熟度还在补课。",
    "所以别再只问该选 Claude 还是 Codex。 下一阶段真正拉开差距的，是谁先占住自己的工作流入口。 模型可以换，插件可以换，但你掌控流程的能力，才是长期护城河。",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).length(7).optional(),
});

export type CodexECCProps = z.infer<typeof CodexECCSchema>;
export type CodexECCShiftLayer = z.infer<typeof ShiftLayerSchema>;
export type CodexECCEvidenceCard = z.infer<typeof EvidenceCardSchema>;
export type CodexECCECCStat = z.infer<typeof ECCStatSchema>;
export type CodexECCStackRow = z.infer<typeof StackRowSchema>;
export type CodexECCRiskCard = z.infer<typeof RiskCardSchema>;
