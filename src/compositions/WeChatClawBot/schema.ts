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

export const WeChatClawBotSubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#8df06d"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(8, 14, 12, 0.88)"),
});

export const WeChatClawBotAudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.2),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1),
  voiceId: z.string().default("zh-CN-YunyangNeural"),
  voiceRate: z.number().min(0.5).max(2).default(1.03),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

const SignalCardSchema = z.object({
  tag: z.string(),
  title: z.string(),
  detail: z.string(),
});

const GatewayNodeSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const UseCaseSchema = z.object({
  title: z.string(),
  detail: z.string(),
  metric: z.string(),
});

const FeatureSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

const RiskSchema = z.object({
  title: z.string(),
  detail: z.string(),
});

export const WeChatClawBotSchema = z.object({
  coverLabel: z.string().default("WECHAT x OPENCLAW"),
  coverEmoji: z.string().default("💬🦞"),
  coverStats: z.array(z.string()).default(["1B+", "24/7", "3 SIGNALS"]),
  coverTitle: z.string().default("聊天框正在变成AI操作台"),
  coverSubtitle: z.string().default("官方信号看到哪一步"),
  coverStrip: z.string().default("ClawBot | Gateway | Skills"),

  hookTitle: z.string().default("微信聊天框，正在变成 OpenClaw 的操作台"),
  hookSubtitle: z.string().default("一句话扫链、查项目、准备下单"),
  hookPrompt: z.string().default("扫描 bsc 新币"),
  hookReply: z.string().default("收到，正在扫描 BSC 新币并返回热门项目。"),
  hookStats: z.array(z.string()).default(["聊天入口", "Agent 执行", "实时回传"]),

  signalTitle: z.string().default("先说结论：这是接入信号，不是全国通告"),
  signalCards: z.array(SignalCardSchema).default([
    {
      tag: "SCREENSHOT",
      title: "真实聊天演示",
      detail: "微信 ClawBot 截图已展示扫 BSC 新币、准备 BTC 订单。",
    },
    {
      tag: "DOCS",
      title: "官方多通道架构",
      detail: "OpenClaw 文档写明 Chat Channels 统一通过 Gateway 接入。",
    },
    {
      tag: "TENCENT",
      title: "微信场景部署文章",
      detail: "腾讯云在 2026-03-03 连续发布微信小程序与企业微信相关内容。",
    },
  ]),

  gatewayTitle: z.string().default("核心不是“微信会思考”，而是“微信成了前台入口”"),
  gatewayNodes: z.array(GatewayNodeSchema).default([
    { title: "微信聊天", detail: "用户只发自然语言命令" },
    { title: "Gateway", detail: "把消息路由到统一 Agent 通道" },
    { title: "OpenClaw", detail: "负责模型、工具、记忆与任务编排" },
    { title: "Skills", detail: "扫链、查数、下单准备、问答等能力模块" },
  ]),

  useCaseTitle: z.string().default("从截图能看到，最先落地的是三类高频动作"),
  useCasePrompt: z.string().default("帮我买入 btc 100u"),
  useCaseReply: z.string().default("已拉取 BTC 价格并整理出本次市价单信息。"),
  useCases: z.array(UseCaseSchema).default([
    {
      title: "链上扫描",
      detail: "快速扫描 BSC 新币、迁移项目和合约安全信息。",
      metric: "BSC / Solana",
    },
    {
      title: "交易准备",
      detail: "先查价格、换算数量、拼装市价单摘要，再回到聊天框。",
      metric: "100 USDT → BTC",
    },
    {
      title: "项目问答",
      detail: "把复杂资料拆成一屏能看懂的结构化回复。",
      metric: "项目详情 / 风险点",
    },
  ]),

  ecosystemTitle: z.string().default("生态侧也已经把微信插件补到了能跑"),
  ecosystemFeatures: z.array(FeatureSchema).default([
    { title: "私聊 / 群聊", detail: "社区插件支持消息收发与会话记忆。" },
    { title: "二维码登录", detail: "首次登录走扫码流程，更接近真实微信入口。" },
    { title: "多账号", detail: "同一套 Agent 可配置多个微信账户。" },
    { title: "文本 / 图片", detail: "不仅回文字，也能处理图像消息。" },
  ]),

  riskTitle: z.string().default("真正决定能否扩大，不是炫技，而是边界"),
  riskPoints: z.array(RiskSchema).default([
    {
      title: "权限分层",
      detail: "涉及资金、审批、导出数据，必须按角色和部门限制能力。",
    },
    {
      title: "日志审计",
      detail: "关键动作要有可追踪记录，不能只靠模型“自觉”。",
    },
    {
      title: "人类复核",
      detail: "Agent 可以辅助，不应该在高风险场景直接授权拍板。",
    },
  ]),

  ctaTitle: z.string().default("真正的变化，不是 AI 会聊天"),
  ctaBody: z.string().default("而是聊天框，开始变成操作台。"),
  ctaSlogan: z.string().default("入口留在微信，Agent 才更容易走进工作流"),
  ctaTags: z.array(z.string()).default([
    "#OpenClaw",
    "#ClawBot",
    "#微信AI",
    "#AIAgent",
    "#自动化",
  ]),

  backgroundColor: z.string().default("#07110d"),
  textColor: z.string().default("#f6fff8"),
  accentColor: z.string().default("#86ef6c"),
  highlightColor: z.string().default("#00d1ff"),
  warningColor: z.string().default("#ff7a59"),
  successColor: z.string().default("#22c55e"),
  goldColor: z.string().default("#fbbf24"),

  subtitle: WeChatClawBotSubtitleConfigSchema.default(
    WeChatClawBotSubtitleConfigSchema.parse({}),
  ),
  audio: WeChatClawBotAudioConfigSchema.default(
    WeChatClawBotAudioConfigSchema.parse({}),
  ),

  voiceoverScripts: z.array(z.string()).default([
    "你以为微信还只是聊天工具吗？最新流出的 ClawBot 演示里，用户在微信发一句扫描 BSC 新币，Agent 就会开始扫链。再发一句帮我买入 BTC 100u，它还能先拉价格，再把下单信息整理回来。聊天框，正在变成 AI 的操作入口。",
    "但先把话说严谨。这更像微信入口接入 OpenClaw 的强烈信号，不等于微信已经全面官宣、全面开放。为什么这么判断？因为我们现在能同时看到三类证据。真实演示截图，OpenClaw 的聊天通道架构，还有腾讯云围绕微信场景的连续部署内容。",
    "OpenClaw 官方文档已经把逻辑说透了。它不是重新造一个聊天软件，而是通过 Gateway 接到你已经在用的聊天入口里。也就是说，微信、飞书、Telegram 这些前台入口背后，都可以接同一套 Agent 能力和 Skill 引擎。",
    "那微信里到底能干嘛？从你给的截图看，至少有三类高频动作。第一，链上扫描，像 BSC 新币、项目迁移、合约安全检查。第二，交易准备，比如先查 BTC 价格、换算数量、生成市价单摘要。第三，深度问答，把一个项目的详情和风险点直接整理回聊天窗口。",
    "更关键的是，社区插件已经把这件事补到能跑。openclaw-wechat 公开写明，支持私聊、群聊、二维码登录、多账号，以及文本和图片消息。这说明，微信接 OpenClaw 不只是概念图，而是已经有人把链路在生态里真实跑通了。",
    "但真正决定这件事能不能大规模落地的，不是炫技，而是边界。腾讯云关于企业微信机器人的文章反复强调一句话。Agent 可以辅助，但不该直接授权。涉及交易、资金、审批这类场景，权限、审计日志、人类复核，一个都不能少。",
    "所以这波最值得关注的，不是 AI 会聊天，而是聊天框开始变成操作台。一旦入口留在微信，OpenClaw 这样的 Agent 就更容易进入日常工作流。你现在看到的，也许还只是早期版本，但方向已经非常明确了。",
  ]),

  precomputedSubtitles: z.array(SubtitleLineSchema).optional(),
  sceneDurations: z.array(z.number()).optional(),
});

export type WeChatClawBotProps = z.infer<typeof WeChatClawBotSchema>;
export type WeChatClawBotSignalCard = z.infer<typeof SignalCardSchema>;
export type WeChatClawBotGatewayNode = z.infer<typeof GatewayNodeSchema>;
export type WeChatClawBotUseCase = z.infer<typeof UseCaseSchema>;
export type WeChatClawBotFeature = z.infer<typeof FeatureSchema>;
export type WeChatClawBotRisk = z.infer<typeof RiskSchema>;
