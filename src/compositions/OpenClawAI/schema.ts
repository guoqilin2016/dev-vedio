import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(48),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#00f0ff"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(0, 0, 0, 0.7)"),
});

export const AudioConfigSchema = z.object({
  backgroundMusic: z.string().optional(),
  backgroundMusicVolume: z.number().min(0).max(1).default(0.25),
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunxiNeural"),
  voiceRate: z.number().min(0.5).max(2.0).default(1.05),
  voiceoverAudioFiles: z.array(z.string()).optional(),
});

export const OpenClawAISchema = z.object({
  // ===== 钩子场景 (0-3s) =====
  hookLine1: z.string().default("你还在手动复制粘贴？"),
  hookLine2: z.string().default("2026最火AI已经拿到电脑最高权限"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),

  // ===== 焦虑层 (3-17s) =====
  anxietyTitle: z.string().default("AI不仅自己干活，还能雇人干活"),
  anxietyPoints: z.array(z.string()).default([
    "浏览器自动操作",
    "终端命令执行",
    "邮箱自动处理",
    "加密货币结算",
  ]),
  anxietyQuote: z.string().default("不掌握AI，你就只能给AI打工"),
  anxietyInteraction: z.string().default("觉得后背发凉？评论区扣1！"),

  // ===== 希望层: 真相1 (17-27s) =====
  hope1Title: z.string().default("从「陪聊」变「实干」"),
  hope1Number: z.string().default("01"),
  hope1Content: z.string().default("AI能在后台24小时接管浏览器、终端和邮箱"),
  hope1Highlight: z.string().default("微信发一句话，AI替你执行"),

  // ===== 希望层: 真相2 (27-37s) =====
  hope2Title: z.string().default("打破人机雇佣边界"),
  hope2Number: z.string().default("02"),
  hope2Content: z.string().default("AI在平台发布悬赏，自动面试人类，加密货币结算"),
  hope2Highlight: z.string().default("AI就是你最强外包团队"),

  // ===== 希望层: 真相3 (37-47s) =====
  hope3Title: z.string().default("尽早入局积累「复利」"),
  hope3Number: z.string().default("03"),
  hope3Content: z.string().default("每次试错都变成驾驭AI的经验值"),
  hope3Highlight: z.string().default("拉开断层差距的关键"),

  // ===== 满足层 (47-57s) =====
  satisfactionTitle: z.string().default("10分钟看到效果"),
  satisfactionSubtitle: z.string().default("「30分钟快闪群」实验"),
  satisfactionRoles: z.array(z.string()).default([
    "产品经理",
    "技术开发",
    "内容运营",
    "市场营销",
    "项目管理",
  ]),
  satisfactionQuote: z.string().default("全员皆可上手，立刻享受自动化爽感"),

  // ===== 行动号召 (57-65s) =====
  ctaTitle: z.string().default("做到 > 知道"),
  ctaContent: z.string().default("今天下班后花10分钟，让AI帮你解决最繁琐的工作"),
  ctaInteraction: z.string().default("评论区告诉我，你打算让AI帮你做什么？"),
  ctaSlogan: z.string().default("抢占实干者的时代复利"),

  // ===== 全局金句 =====
  keyQuotes: z.array(z.string()).default([
    "AI接管电脑，还雇人干活",
    "不掌握AI，就只能给AI打工",
    "10分钟上手，全员皆可",
    "做到 > 知道",
    "抢占实干者的时代复利",
  ]),

  // ===== 视觉配置 =====
  backgroundColor: z.string().default("#0a0a0f"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#00f0ff"),
  highlightColor: z.string().default("#4d7cff"),
  warningColor: z.string().default("#ff3366"),

  // ===== 字幕 =====
  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),

  // ===== 音频 =====
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),

  // ===== 配音脚本 =====
  voiceoverScripts: z.array(z.string()).default([
    "你还在把ChatGPT当成高级搜索工具吗？醒醒吧，2026年最火的AI已经拿到了电脑的最高权限！",
    "过去我们总担心AI会不会取代人类，但现在更残酷的现实是：如果你还在岸边观望，你可能正在变成AI的肉体外包。当别人让AI接管枯燥工作时，你的竞争力正在被降维打击。",
    "别慌，只要看懂3个真相，你也能轻松破局。第一，让AI从陪聊变实干。现在的AI能在后台24小时接管你的浏览器、终端和邮箱。",
    "第二，打破人机雇佣边界。AI遇到障碍时会在平台上发布悬赏，自动面试人类，任务完成后用加密货币结算。利用好这个机制，AI就是你最强大的外包团队。",
    "第三，尽早入局积累复利。早期的每一次试错和调试，都会变成驾驭AI的经验值。把AI整合进工作流，才是拉开断层差距的关键。",
    "你可能觉得部署这种AI很难？有公司搞了一个30分钟快闪群，从产品、技术到运营，不同岗位的同事纷纷成功部署，每个人都发掘出了极具启发性的提效场景。",
    "AI时代最残酷的分水岭，不是知道和不知道，而是做到和没做到。评论区告诉我，你打算今天下班后让AI帮你解决哪一项最繁琐的工作？",
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

export type OpenClawAIProps = z.infer<typeof OpenClawAISchema>;
export type SubtitleConfig = z.infer<typeof SubtitleConfigSchema>;
export type AudioConfig = z.infer<typeof AudioConfigSchema>;
