import { z } from "zod";

export const SubtitleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fontSize: z.number().default(44),
  position: z.enum(["top", "center", "bottom"]).default("bottom"),
  highlightColor: z.string().default("#ff6b35"),
  textColor: z.string().default("#ffffff"),
  backgroundColor: z.string().default("rgba(10, 10, 18, 0.85)"),
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

const SkillItemSchema = z.object({
  name: z.string(),
  desc: z.string(),
  icon: z.string(),
});

const CategorySchema = z.object({
  title: z.string(),
  tag: z.string(),
  icon: z.string(),
  color: z.string(),
  skills: z.array(SkillItemSchema),
});

export const ClawSkillsSchema = z.object({
  hookLine1: z.string().default("你的AI还在帮你查天气？"),
  hookLine2: z.string().default("别人的AI已经24小时替你值班了"),
  hookStyle: z.enum(["glitch", "typewriter"]).default("glitch"),

  overviewTitle: z.string().default("ClawHub TOP 20 神级 Skill"),
  overviewSubtitle: z.string().default("系统评分 > 3.4 · 可直接抄作业"),
  overviewStats: z.object({
    totalSkills: z.number().default(20),
    minScore: z.number().default(3.4),
    categories: z.number().default(4),
  }).default({}),

  categories: z.array(CategorySchema).default([
    {
      title: "核心增强与护城河",
      tag: "CORE SHIELD",
      icon: "🛡️",
      color: "#00e5ff",
      skills: [
        { name: "openclaw-backup", desc: "一键灾备，重装不失忆", icon: "💾" },
        { name: "openclaw-shield", desc: "防Prompt注入安全盾", icon: "🔒" },
        { name: "ops-guardrails", desc: "高危命令二次授权", icon: "🚧" },
        { name: "openclaw-cli", desc: "AI自查日志修端口", icon: "⌨️" },
        { name: "skill-guard", desc: "新技能安装前查毒", icon: "🔍" },
      ],
    },
    {
      title: "AI进化与自我繁衍",
      tag: "AI EVOLUTION",
      icon: "🧬",
      color: "#a855f7",
      skills: [
        { name: "self-improving", desc: "自动建错题本越用越聪明", icon: "📈" },
        { name: "skill-builder", desc: "手动流程打包成新技能", icon: "🏗️" },
        { name: "self-evolving", desc: "技能自动升级修bug", icon: "🔄" },
        { name: "skill-scanner", desc: "主动推荐你需要的技能", icon: "🎯" },
      ],
    },
    {
      title: "自动化与浏览器控制",
      tag: "AUTOMATION",
      icon: "🤖",
      color: "#22c55e",
      skills: [
        { name: "auto-monitor", desc: "CPU飙高服务挂秒报警", icon: "📡" },
        { name: "auto-workflow", desc: "串联任务定时自动跑", icon: "⚡" },
        { name: "browser-auto", desc: "后台静默操控网页", icon: "🌐" },
        { name: "lu-auto-deploy", desc: "一行命令推代码重启", icon: "🚀" },
        { name: "ai-web-auto", desc: "验证码滑块全搞定", icon: "🧩" },
      ],
    },
    {
      title: "生产力与数据提取",
      tag: "PRODUCTIVITY",
      icon: "💼",
      color: "#f59e0b",
      skills: [
        { name: "multi-search", desc: "17引擎聚合搜索白嫖", icon: "🔎" },
        { name: "file-summary", desc: "PDF/Excel三秒出大纲", icon: "📄" },
        { name: "file-organizer", desc: "Downloads自动归类", icon: "📁" },
        { name: "productivity-os", desc: "日程规划催进度", icon: "📅" },
        { name: "git-cli", desc: "Git冲突一键搞定", icon: "🔀" },
        { name: "visual-sorter", desc: "看图片内容自动分类", icon: "👁️" },
      ],
    },
  ]),

  ctaTitle: z.string().default("20个神级插件 · 评分3.4+"),
  ctaContent: z.string().default("评论区告诉我，你最想先装哪一个？"),
  ctaSlogan: z.string().default("收藏起来，找不到别怪我"),

  backgroundColor: z.string().default("#0a0a12"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#ff6b35"),
  highlightColor: z.string().default("#00e5ff"),
  goldColor: z.string().default("#ffd700"),

  subtitle: SubtitleConfigSchema.default({}),
  audio: AudioConfigSchema.default({}),

  voiceoverScripts: z.array(z.string()).default([
    "你的AI还在帮你查天气、写周报？别人的AI已经能自动备份数据、扫描后门、24小时替你值班了！",
    "这就是ClawHub评分最高的20个神级Skill！系统评分全在3.4以上，每一个都是OpenClaw生态里的必装硬核插件。分四大类给你讲清楚，看完直接抄作业！",
    "第一类，核心护城河！五个必装技能。一键备份记忆和配置，重装系统也不怕。安全盾牌防止恶意注入。高危命令二次授权。AI自己查日志修端口。新技能安装前自动查毒。装完这五个，铜墙铁壁！",
    "第二类，AI自我进化！自动建错题本，用得越多越聪明。手动流程一键打包成新技能。技能自己读报错日志升级修bug。还能主动推荐你需要的技能。这叫什么？AI觉醒了！",
    "第三类，自动化军团！CPU飙高秒报警。定时串联浏览器、新闻、PDF、Discord全自动。一行命令推代码重启Docker。验证码滑块全搞定。你只管躺着，AI替你干！",
    "第四类，数据榨汁机！17个搜索引擎聚合白嫖。PDF、Excel三秒出大纲。Downloads自动归类。日程规划催进度。Git冲突一键解决。甚至能看图片内容，自动分类发票和表情包！",
    "这20个技能全是评分3.4以上的神级插件！评论区告诉我，你最想先装哪一个？收藏起来，到时候找不到可别怪我！",
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

export type ClawSkillsProps = z.infer<typeof ClawSkillsSchema>;
export type SkillItem = z.infer<typeof SkillItemSchema>;
export type Category = z.infer<typeof CategorySchema>;
