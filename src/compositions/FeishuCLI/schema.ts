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

export const FeishuCLISubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#4de2ff"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(7, 12, 26, 0.86)"),
});

export const FeishuCLIAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.14),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const ProofCardSchema = z.object({
  title: z.string(),
  detail: z.string(),
  tag: z.string(),
});

const CalendarSlotSchema = z.object({
  label: z.string(),
  status: z.enum(["busy", "free", "hold"]),
});

const TableRowSchema = z.object({
  item: z.string(),
  owner: z.string(),
  status: z.string(),
  priority: z.string(),
});

export const FeishuCLISchema = z.object({
  coverLabel: z.string().default("FEISHU CLI"),
  coverTitle: z.string().default("飞书开始给 Agent 开门"),
  coverSubtitle: z.string().default("Docs · Calendar · Bitable"),
  coverStrip: z.string().default("OpenAPI MCP | Local CLI | Workflows"),

  hookTitle: z.string().default("AI 开始接管飞书里的真实工作"),
  hookSubtitle: z
    .string()
    .default("写文档 · 查日程 · 建会议 · 整理多维表格"),
  hookCommand: z.string().default("lark-mcp mcp -t docs,calendar,bitable"),
  hookStats: z
    .array(z.string())
    .length(3)
    .default(["DOCS", "CALENDAR", "BITABLE"]),

  positionTitle: z.string().default("飞书不是多一个 AI 功能"),
  positionBody: z
    .string()
    .default("它正在变成 Agent 真正能调用的协作入口"),
  positionChips: z
    .array(z.string())
    .length(4)
    .default(["Messages", "Docs", "Tasks", "Calendar"]),

  docTitle: z.string().default("Proof 1 · Markdown 直接落成飞书文档"),
  docPrompt: z
    .string()
    .default("把产品周报整理成飞书文档，并生成可协作版本"),
  docCards: z.array(ProofCardSchema).length(3).default([
    {
      title: "原始资料",
      detail: "Markdown、网页摘要、结构化内容",
      tag: "INPUT",
    },
    {
      title: "Agent 动作",
      detail: "导入、格式化、整理标题与要点",
      tag: "ACTION",
    },
    {
      title: "结果页",
      detail: "团队能直接查看、评论、继续编辑",
      tag: "OUTPUT",
    },
  ]),

  calendarTitle: z.string().default("Proof 2 · 一句话安排日程"),
  calendarPrompt: z
    .string()
    .default("下周三下午约产品和销售开评审，先查忙闲再建会"),
  calendarSlots: z.array(CalendarSlotSchema).length(6).default([
    { label: "13:00", status: "busy" },
    { label: "14:00", status: "free" },
    { label: "15:00", status: "free" },
    { label: "16:00", status: "hold" },
    { label: "17:00", status: "busy" },
    { label: "18:00", status: "free" },
  ]),
  calendarSteps: z
    .array(z.string())
    .length(3)
    .default(["查忙闲", "选时间", "创建会议"]),

  bitableTitle: z.string().default("Proof 3 · 资料直接进多维表格 / 看板"),
  bitableRows: z.array(TableRowSchema).length(4).default([
    { item: "客户 A", owner: "Lena", status: "跟进中", priority: "High" },
    { item: "客户 B", owner: "Ming", status: "待联系", priority: "Mid" },
    { item: "客户 C", owner: "Yan", status: "已报价", priority: "High" },
    { item: "客户 D", owner: "Bo", status: "待确认", priority: "Low" },
  ]),

  nuanceTitle: z.string().default("口径要稳：远程公开更保守，本地 CLI 覆盖更广"),
  remoteBullets: z
    .array(z.string())
    .length(3)
    .default(["公开口径先看 Docs", "更多场景继续开放", "不能说成全远程都已开完"]),
  localBullets: z
    .array(z.string())
    .length(4)
    .default([
      "文档",
      "消息 / 群聊",
      "多维表格",
      "任务 / 日历",
    ]),

  ctaTitle: z.string().default("未来竞争不是谁更会聊天"),
  ctaBody: z.string().default("而是谁能让 Agent 在协作系统里稳定做事"),
  ctaTags: z
    .array(z.string())
    .length(5)
    .default([
      "#飞书CLI",
      "#Feishu",
      "#OpenAPIMCP",
      "#AIAgent",
      "#AI办公",
    ]),

  backgroundColor: z.string().default("#08101f"),
  textColor: z.string().default("#f8fbff"),
  mutedTextColor: z.string().default("#95a8c7"),
  accentColor: z.string().default("#3370ff"),
  highlightColor: z.string().default("#4de2ff"),
  successColor: z.string().default("#22c55e"),
  warningColor: z.string().default("#f59e0b"),
  panelColor: z.string().default("rgba(13, 22, 42, 0.78)"),

  subtitle: FeishuCLISubtitleConfigSchema.default(
    FeishuCLISubtitleConfigSchema.parse({}),
  ),
  audio: FeishuCLIAudioConfigSchema.default(
    FeishuCLIAudioConfigSchema.parse({}),
  ),

  voiceoverScripts: z.array(z.string()).length(7).default([
    "你以为 AI 还只是坐在聊天框里回答问题吗？... 现在它已经开始接管飞书里的真实工作了。写文档，查日程，建会议，整理多维表格，这些动作，已经可以通过飞书官方 OpenAPI MCP 和 CLI 接进本地 Agent 工作流。",
    "所以这条视频先给结论。飞书不是又加了一个 AI 功能，而是在把自己变成 Agent 真正能调用的协作入口。过去很多 AI 工具只是会说，现在开始有人把文档、消息、日历、任务和表格这些真实工作，接给 Agent 去做。",
    "第一个 proof 最好理解。你把 Markdown、网页资料或者一段结构化内容交给 Agent，它不只是总结给你看，而是可以直接导进飞书文档，生成可协作、可分享、可继续编辑的结果。这时候 AI 的价值，已经不是回答你，而是在替你产出团队能直接用的文档。",
    "第二个 proof 更像真正的工作流。一句话安排日程，Agent 先查忙闲，再创建会议，再把时间和参会人整理回飞书。这个动作特别关键，因为它说明 AI 不再只是会聊天，而是开始处理带权限、带状态、带协作对象的真实动作。",
    "第三个 proof 是多维表格和看板。你给一堆资料、一份项目清单，或者一组客户线索，Agent 可以把它们整理成字段、状态和优先级，直接落进飞书的表格和看板里。普通聊天工具到这一步就停了，但协作系统一旦被接通，AI 才真正进入执行层。",
    "当然，这里必须讲严谨。不能把它说成飞书所有能力都已经远程零门槛开放。更准确的说法是，官方远程公开口径目前更保守，Docs 是最明确的场景；但本地 OpenAPI MCP 和 CLI 的工具覆盖已经非常广，文档、消息、多维表格、任务、日历这些能力，已经足够让 Agent 真正干活。",
    "所以这波最值得关注的，不是飞书多了一个 AI 按钮，而是它开始给 Agent 开门。未来真正的竞争，可能不再是谁更会聊天，而是谁能让 Agent 在协作系统里稳定做事。谁先把入口、权限和工作流接起来，谁就更接近下一代生产力。",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).length(7).optional(),
});

export type FeishuCLIProps = z.infer<typeof FeishuCLISchema>;
export type FeishuCLIProofCard = z.infer<typeof ProofCardSchema>;
export type FeishuCLICalendarSlot = z.infer<typeof CalendarSlotSchema>;
export type FeishuCLITableRow = z.infer<typeof TableRowSchema>;
