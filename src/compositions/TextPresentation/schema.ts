import { z } from "zod";

// 字幕配置 Schema
export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(42),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#ffd700"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(0, 0, 0, 0.6)"),
});

// 音频配置 Schema
export const AudioConfigSchema = z.object({
  // 背景音乐
  backgroundMusic: z.string().optional(), // 音乐文件路径，如 "music/background.mp3"
  backgroundMusicVolume: z.number().min(0).max(1).default(0.3),
  
  // TTS 配音
  voiceoverEnabled: z.boolean().default(true),
  voiceoverVolume: z.number().min(0).max(1).default(1.0),
  voiceId: z.string().default("zh-CN-YunxiNeural"),
  voiceRate: z.number().min(0.5).max(2.0).default(1.0),
  
  // 配音音频文件路径（每个场景一个）
  // 如果提供了这些路径，将直接使用这些音频文件
  // 如果没有提供，需要先通过 TTS API 生成
  voiceoverAudioFiles: z.array(z.string()).optional(), // 如 ["audio/scene1.mp3", "audio/scene2.mp3"]
});

export const TextPresentationSchema = z.object({
  // 开场
  hookTitle: z.string().default("豆包日活破亿"),
  hookSubtitle: z.string().default("你还在只会拿AI当聊天机器人吗？"),
  // 开场样式: counter(数字计数器) | title(纯标题)
  openingStyle: z.enum(["counter", "title"]).default("counter"),
  // 开场图标（当 openingStyle 为 title 时使用）
  openingIcon: z.string().default("🎮"),
  // 计数器目标值（当 openingStyle 为 counter 时使用）
  counterValue: z.number().default(100000000),
  counterSuffix: z.string().default("+"),
  
  // 核心观点
  mainPoint: z.string().default("AI时代最大的危机不是AI变得太强，而是你还在死磕'做题'，别人已经开始'阅卷'了"),
  // VS 对比配置
  vsLeftIcon: z.string().default("✍️"),
  vsLeftText: z.string().default("死磕「做题」"),
  vsRightIcon: z.string().default("📋"),
  vsRightText: z.string().default("开始「阅卷」"),
  
  // 痛点场景
  painPointTitle: z.string().default("别让'勤奋'毁了你"),
  painPointContent: z.string().default("打开Word或PPT，盯着空白屏幕发呆，痛苦地憋第一段话..."),
  // 痛点图标
  painPointIcon: z.string().default("⚠️"),
  
  // 解决方案步骤
  step1Title: z.string().default("身份跃迁"),
  step1Content: z.string().default("接到任务第一时间，对AI说：'你先给我出一个第一版'"),
  
  step2Title: z.string().default("三轮对话法"),
  step2Content: z.string().default("1)让AI反问 2)要3个方案 3)扮演严格老板质检"),
  
  step3Title: z.string().default("从做题到阅卷"),
  step3Content: z.string().default("拿着红笔，基于经验去修改、把关，而不是从零开始"),
  
  // 三步方案的总标题
  stepsMainTitle: z.string().default("零草稿原则 · 简单3步破局"),
  // 步骤图标
  step1Icon: z.string().default("🚀"),
  step2Icon: z.string().default("🔄"),
  step3Icon: z.string().default("✅"),
  
  // 案例
  caseTitle: z.string().default("效果惊人"),
  caseContent: z.string().default("财务负责人用AI处理发票：从'三人三天'变成'一人半天'"),
  // 案例对比配置（可选，如果不提供则使用纯文字描述模式）
  caseComparison: z.object({
    enabled: z.boolean().default(true),
    beforeLabel: z.string().default("Before"),
    beforeValue: z.string().default("3人×3天"),
    beforeIcon: z.string().default("😫"),
    afterLabel: z.string().default("After"),
    afterValue: z.string().default("1人×0.5天"),
    afterIcon: z.string().default("🚀"),
  }).default({
    enabled: true,
    beforeLabel: "Before",
    beforeValue: "3人×3天",
    beforeIcon: "😫",
    afterLabel: "After",
    afterValue: "1人×0.5天",
    afterIcon: "🚀",
  }),
  
  // 结尾号召
  // 核心口号（大标题）
  endingSlogan: z.string().default("拒绝出初稿"),
  // 详细行动号召
  callToAction: z.string().default("把'拒绝出初稿'贴在电脑屏幕上，做拿着红笔改卷子的聪明人！"),
  // 底部装饰文字
  endingFooter: z.string().default("2026年，做拿着红笔改卷子的聪明人 🎯"),
  
  // 视觉配置
  backgroundColor: z.string().default("#1a1a2e"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#e94560"),
  highlightColor: z.string().default("#ffd700"),
  
  // 字幕配置
  subtitle: SubtitleConfigSchema.default(SubtitleConfigSchema.parse({})),
  
  // 音频配置
  audio: AudioConfigSchema.default(AudioConfigSchema.parse({})),
  
  // 各场景的配音文本（用于 TTS 生成和字幕显示）
  voiceoverScripts: z.array(z.string()).default([
    "1亿用户，豆包日活破亿！你还在只会拿AI当聊天机器人吗？",
    "AI时代最大的危机，不是AI变得太强，而是你还在死磕做题，别人已经开始阅卷了。",
    "别让勤奋毁了你。打开Word或PPT，盯着空白屏幕发呆，痛苦地憋第一段话。",
    "零草稿原则，简单三步破局。第一步，身份跃迁。第二步，三轮对话法。第三步，从做题到阅卷。",
    "效果惊人！财务负责人用AI处理发票，从三人三天变成一人半天。",
    "拒绝出初稿！把这句话贴在电脑屏幕上，做拿着红笔改卷子的聪明人！",
  ]),
  
  // 预计算的字幕数据（通过 npm run sync:subtitle 生成）
  // 如果提供了这个数据，将使用它而不是动态计算
  precomputedSubtitles: z.array(z.object({
    words: z.array(z.object({
      text: z.string(),
      startFrame: z.number(),
      endFrame: z.number(),
    })),
    startFrame: z.number(),
    endFrame: z.number(),
  })).optional(),
  
  // 各场景的时长（帧数），用于同步配音
  // 如果提供了这个数据，将使用它而不是固定的 180 帧
  sceneDurations: z.array(z.number()).optional(),
  
  // 数字人配置
  digitalHuman: z.object({
    enabled: z.boolean().default(false),
    // 数字人视频文件路径（每个场景一个）
    videos: z.array(z.string()).optional(), // 如 ["videos/digital-human-scene1.mp4"]
    // 数字人视频位置
    position: z.enum(["left", "right", "center", "corner"]).default("right"),
    // 数字人视频大小（相对于画面宽度的比例）
    scale: z.number().min(0.1).max(0.5).default(0.25),
    // 圆角（像素）
    borderRadius: z.number().default(20),
  }).default({
    enabled: false,
    position: "right",
    scale: 0.25,
    borderRadius: 20,
  }),
});

export type TextPresentationProps = z.infer<typeof TextPresentationSchema>;
export type SubtitleConfig = z.infer<typeof SubtitleConfigSchema>;
export type AudioConfig = z.infer<typeof AudioConfigSchema>;
