import React from "react";
import { Composition, Still } from "remotion";
import {
  HelloWorld,
  HelloWorldSchema,
  TextPresentation,
  TextPresentationSchema,
  OpenClawAI,
  OpenClawAISchema,
  ClawSkills,
  ClawSkillsSchema,
  SuperPowers,
  SuperPowersSchema,
  PuaSkill,
  PuaSkillSchema,
  AgencyAgents,
  AgencyAgentsSchema,
  AutoResearch,
  AutoResearchCover,
  AutoResearchSchema,
  GSDIntro,
  GSDIntroCover,
  GSDIntroSchema,
  WeChatClawBot,
  WeChatClawBotCover,
  WeChatClawBotSchema,
} from "./compositions";
import { DEFAULT_VIDEO_CONFIG } from "./shared/types";
import nitrogenSubtitles from "./data/nitrogen-subtitles.json";
import openclawSubtitles from "./data/openclaw-subtitles.json";
import clawskillsSubtitles from "./data/clawskills-subtitles.json";
import superpowersSubtitles from "./data/superpowers-subtitles.json";
import puaskillSubtitles from "./data/puaskill-subtitles.json";
import agencyagentsSubtitles from "./data/agencyagents-subtitles.json";
import autoresearchSubtitles from "./data/autoresearch-subtitles.json";
import gsdSubtitles from "./data/gsd-subtitles.json";
import wechatclawbotSubtitles from "./data/wechatclawbot-subtitles.json";

const gsdIntroDefaultProps = GSDIntroSchema.parse({
  audio: {
    backgroundMusic: "music/background.mp3",
    backgroundMusicVolume: 0.2,
    voiceoverEnabled: true,
    voiceoverVolume: 1.0,
    voiceId: "zh-CN-YunyangNeural",
    voiceRate: 1.03,
    voiceoverAudioFiles: [
      "audio/gsd-scene1.mp3",
      "audio/gsd-scene2.mp3",
      "audio/gsd-scene3.mp3",
      "audio/gsd-scene4.mp3",
      "audio/gsd-scene5.mp3",
      "audio/gsd-scene6.mp3",
      "audio/gsd-scene7.mp3",
    ],
  },
  subtitle: {
    enabled: true,
    fontSize: 44,
    position: "bottom",
    highlightColor: "#10b981",
    textColor: "#ffffff",
    backgroundColor: "rgba(7, 10, 16, 0.85)",
  },
  sceneDurations: [627, 736, 639, 874, 731, 796, 549],
  precomputedSubtitles: gsdSubtitles,
});

const weChatClawBotDefaultProps = WeChatClawBotSchema.parse({
  audio: {
    backgroundMusic: "music/background.mp3",
    backgroundMusicVolume: 0.18,
    voiceoverEnabled: true,
    voiceoverVolume: 1.0,
    voiceId: "zh-CN-YunyangNeural",
    voiceRate: 1.03,
    voiceoverAudioFiles: [
      "audio/wechatclawbot-scene1.mp3",
      "audio/wechatclawbot-scene2.mp3",
      "audio/wechatclawbot-scene3.mp3",
      "audio/wechatclawbot-scene4.mp3",
      "audio/wechatclawbot-scene5.mp3",
      "audio/wechatclawbot-scene6.mp3",
      "audio/wechatclawbot-scene7.mp3",
    ],
  },
  subtitle: {
    enabled: true,
    fontSize: 44,
    position: "bottom",
    highlightColor: "#34d399",
    textColor: "#ffffff",
    backgroundColor: "rgba(8, 14, 12, 0.88)",
  },
  sceneDurations: [330, 390, 360, 360, 390, 360, 390],
  precomputedSubtitles: wechatclawbotSubtitles,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={DEFAULT_VIDEO_CONFIG.durationInFrames}
        fps={DEFAULT_VIDEO_CONFIG.fps}
        width={DEFAULT_VIDEO_CONFIG.width}
        height={DEFAULT_VIDEO_CONFIG.height}
        schema={HelloWorldSchema}
        defaultProps={{
          title: "Hello, Remotion!",
          subtitle: "视频生成演示",
          backgroundColor: "#0f0f23",
          textColor: "#ffffff",
          accentColor: "#6366f1",
        }}
      />

      {/* 原有视频：豆包日活破亿 */}
      <Composition
        id="TextPresentation"
        component={TextPresentation}
        durationInFrames={1556} // 根据配音时长同步 (npm run sync:subtitle)
        fps={DEFAULT_VIDEO_CONFIG.fps}
        width={DEFAULT_VIDEO_CONFIG.width}
        height={DEFAULT_VIDEO_CONFIG.height}
        schema={TextPresentationSchema}
        defaultProps={{
          hookTitle: "豆包日活破亿",
          hookSubtitle: "你还在只会拿AI当聊天机器人吗？",
          mainPoint: "AI时代最大的危机不是AI变得太强，而是你还在死磕'做题'，别人已经开始'阅卷'了",
          painPointTitle: "别让'勤奋'毁了你",
          painPointContent: "打开Word或PPT，盯着空白屏幕发呆，痛苦地憋第一段话...",
          step1Title: "身份跃迁",
          step1Content: "接到任务第一时间，对AI说：'你先给我出一个第一版'",
          step2Title: "三轮对话法",
          step2Content: "1)让AI反问 2)要3个方案 3)扮演严格老板质检",
          step3Title: "从做题到阅卷",
          step3Content: "拿着红笔，基于经验去修改、把关，而不是从零开始",
          caseTitle: "效果惊人",
          caseContent: "财务负责人用AI处理发票：从'三人三天'变成'一人半天'",
          callToAction: "把'拒绝出初稿'贴在电脑屏幕上，做拿着红笔改卷子的聪明人！",
          backgroundColor: "#1a1a2e",
          textColor: "#ffffff",
          accentColor: "#e94560",
          highlightColor: "#ffd700",
          subtitle: {
            enabled: true,
            fontSize: 42,
            position: "bottom",
            highlightColor: "#ffd700",
            textColor: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.3,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.0,
            voiceoverAudioFiles: [
              "audio/scene1.mp3",
              "audio/scene2.mp3",
              "audio/scene3.mp3",
              "audio/scene4.mp3",
              "audio/scene5.mp3",
              "audio/scene6.mp3",
            ],
          },
          voiceoverScripts: [
            "1亿用户，豆包日活破亿！你还在只会拿AI当聊天机器人吗？",
            "AI时代最大的危机，不是AI变得太强，而是你还在死磕做题，别人已经开始阅卷了。",
            "别让勤奋毁了你。打开Word或PPT，盯着空白屏幕发呆，痛苦地憋第一段话。",
            "零草稿原则，简单三步破局。第一步，身份跃迁。第二步，三轮对话法。第三步，从做题到阅卷。",
            "效果惊人！财务负责人用AI处理发票，从三人三天变成一人半天。",
            "拒绝出初稿！把这句话贴在电脑屏幕上，做拿着红笔改卷子的聪明人！",
          ],
          sceneDurations: [227, 264, 255, 340, 244, 226],
          digitalHuman: {
            enabled: false,
            videos: [],
            position: "right",
            scale: 0.25,
            borderRadius: 20,
          },
        }}
      />

      {/* 新视频：英伟达Nitrogen AI */}
      <Composition
        id="NitrogenAI"
        component={TextPresentation}
        durationInFrames={2683}
        fps={DEFAULT_VIDEO_CONFIG.fps}
        width={DEFAULT_VIDEO_CONFIG.width}
        height={DEFAULT_VIDEO_CONFIG.height}
        schema={TextPresentationSchema}
        defaultProps={{
          // 开场配置
          hookTitle: "AI光看直播就通关千款游戏",
          hookSubtitle: "这不是科幻小说，而是英伟达刚刚发布的真事！",
          openingStyle: "title",
          openingIcon: "🎮",
          
          // VS 对比配置
          mainPoint: "这种不看代码、只看画面的学习方式，正在彻底打破我们对AI的固有认知",
          vsLeftIcon: "🖥️",
          vsLeftText: "靠代码学习",
          vsRightIcon: "👀",
          vsRightText: "看直播学习",
          
          // 痛点配置
          painPointTitle: "AI进化的速度超乎想象",
          painPointContent: "以前我们以为AI是靠穷举代码获胜，现在它学会了像人类一样用「眼睛」和「直觉」去学习。如果还用老眼光看AI，你可能真的要掉队了。",
          painPointIcon: "🚀",
          
          // 三步方案配置
          stepsMainTitle: "AI学习的3个核心逻辑",
          step1Title: "像学吉他一样云通关",
          step1Content: "AI通过盯着视频里的手指动作，把画面变化和按键操作对应起来，理解「看到这个画面就该这么做」",
          step1Icon: "🎸",
          step2Title: "通用直觉比死招式更重要",
          step2Content: "AI学到的通用技能（判断距离、攻击时机）在不同游戏里都能迁移通用，学的是游戏背后的通用直觉",
          step2Icon: "🧠",
          step3Title: "破解莫拉维克悖论",
          step3Content: "AI在游戏这个「甜蜜点」上，既突破了视觉感知，又掌握了策略思考",
          step3Icon: "🎯",
          
          // 案例配置
          caseTitle: "Xbox vs PlayStation：数据质量决胜负",
          caseContent: "AI识别Xbox手柄准确率比PlayStation高！PlayStation款式五花八门把AI「整不会了」，而Xbox外观统一，AI学得更快。这证明了AI学习的瓶颈往往不在算法，而在数据的标准化和质量。",
          caseComparison: {
            enabled: false,
          },
          
          // 结尾配置
          endingSlogan: "驾驭AI的超级玩家",
          callToAction: "AI已经开始像人一样思考和创作了，我们不仅要会玩游戏，更要学会驾驭AI。别只做观众了，赶紧成为那个驾驭AI的超级玩家！",
          endingFooter: "英伟达Nitrogen项目 · 2026 🎮",
          
          // 视觉配置 - 英伟达绿色主题
          backgroundColor: "#0d1117",
          textColor: "#ffffff",
          accentColor: "#76b900",
          highlightColor: "#00d4ff",
          
          // 字幕配置
          subtitle: {
            enabled: true,
            fontSize: 42,
            position: "bottom",
            highlightColor: "#76b900",
            textColor: "#ffffff",
            backgroundColor: "rgba(13, 17, 23, 0.8)",
          },
          
          // 音频配置
          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.0,
            voiceoverAudioFiles: [
              "audio/nitrogen-scene1.mp3",
              "audio/nitrogen-scene2.mp3",
              "audio/nitrogen-scene3.mp3",
              "audio/nitrogen-scene4.mp3",
              "audio/nitrogen-scene5.mp3",
              "audio/nitrogen-scene6.mp3",
            ],
          },
          
          // 配音脚本
          voiceoverScripts: [
            "你敢信吗？现在的AI根本不需要读一行代码，光靠看游戏直播就能学会打1000多款游戏！这是英伟达刚刚发布的Nitrogen项目做到的真事。",
            "这种不看代码、只看画面的学习方式，正在彻底打破我们对AI的固有认知。传统AI靠代码学习，而Nitrogen直接看直播就能上手！",
            "AI进化的速度超乎想象！以前我们以为AI是靠穷举代码获胜，现在它竟然学会了像人类一样用眼睛和直觉去学习。如果还用老眼光看AI，你可能真的要掉队了。",
            "别慌，英伟达的研究揭示了AI学习的3个核心逻辑。第一，像学吉他一样云通关。第二，通用直觉比死招式更重要。第三，破解莫拉维克悖论。",
            "来看一个反常识的案例：AI识别Xbox手柄的准确率竟然比PlayStation高！因为PlayStation款式五花八门，反而把AI给整不会了。这证明了AI学习的瓶颈往往不在算法，而在数据的标准化和质量。",
            "AI已经开始像人一样思考和创作了。我们不仅要会玩游戏，更要学会驾驭AI。别只做观众了，赶紧成为那个驾驭AI的超级玩家！",
          ],
          
          precomputedSubtitles: nitrogenSubtitles,
          sceneDurations: [434, 402, 476, 435, 555, 381],

          // 数字人配置
          digitalHuman: {
            enabled: false,
            videos: [],
            position: "right",
            scale: 0.25,
            borderRadius: 20,
          },
        }}
      />
      {/* 竖屏短视频：OpenClaw AI工具 */}
      <Composition
        id="OpenClawAI"
        component={OpenClawAI}
        durationInFrames={2759}
        fps={30}
        width={1080}
        height={1920}
        schema={OpenClawAISchema}
        defaultProps={{
          hookLine1: "你还在手动复制粘贴？",
          hookLine2: "2026最火AI已经拿到电脑最高权限",
          hookStyle: "glitch",

          anxietyTitle: "AI不仅自己干活，还能雇人干活",
          anxietyPoints: [
            "浏览器自动操作",
            "终端命令执行",
            "邮箱自动处理",
            "加密货币结算",
          ],
          anxietyQuote: "不掌握AI，就只能给AI打工",
          anxietyInteraction: "觉得后背发凉？评论区扣1！",

          hope1Title: "从「陪聊」变「实干」",
          hope1Number: "01",
          hope1Content: "AI能在后台24小时接管浏览器、终端和邮箱",
          hope1Highlight: "微信发一句话，AI替你执行",

          hope2Title: "打破人机雇佣边界",
          hope2Number: "02",
          hope2Content: "AI在平台发布悬赏，自动面试人类，加密货币结算",
          hope2Highlight: "AI就是你最强外包团队",

          hope3Title: "尽早入局积累「复利」",
          hope3Number: "03",
          hope3Content: "每次试错都变成驾驭AI的经验值",
          hope3Highlight: "拉开断层差距的关键",

          satisfactionTitle: "10分钟看到效果",
          satisfactionSubtitle: "「30分钟快闪群」实验",
          satisfactionRoles: [
            "产品经理",
            "技术开发",
            "内容运营",
            "市场营销",
            "项目管理",
          ],
          satisfactionQuote: "全员皆可上手，立刻享受自动化爽感",

          ctaTitle: "做到 > 知道",
          ctaContent: "今天下班后花10分钟，让AI帮你解决最繁琐的工作",
          ctaInteraction: "评论区告诉我，你打算让AI帮你做什么？",
          ctaSlogan: "抢占实干者的时代复利",

          keyQuotes: [
            "AI接管电脑，还雇人干活",
            "不掌握AI，就只能给AI打工",
            "10分钟上手，全员皆可",
            "做到 > 知道",
            "抢占实干者的时代复利",
          ],

          backgroundColor: "#0a0a0f",
          textColor: "#ffffff",
          accentColor: "#00f0ff",
          highlightColor: "#4d7cff",
          warningColor: "#ff3366",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#00f0ff",
            textColor: "#ffffff",
            backgroundColor: "rgba(10, 10, 15, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/openclaw-scene1.mp3",
              "audio/openclaw-scene2.mp3",
              "audio/openclaw-scene3.mp3",
              "audio/openclaw-scene4.mp3",
              "audio/openclaw-scene5.mp3",
              "audio/openclaw-scene6.mp3",
              "audio/openclaw-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "你还在把ChatGPT当成高级搜索工具吗？醒醒吧，2026年最火的AI已经拿到了电脑的最高权限！",
            "过去我们总担心AI会不会取代人类，但现在更残酷的现实是：如果你还在岸边观望，你可能正在变成AI的肉体外包。当别人让AI接管枯燥工作时，你的竞争力正在被降维打击。",
            "别慌，只要看懂3个真相，你也能轻松破局。第一，让AI从陪聊变实干。现在的AI能在后台24小时接管你的浏览器、终端和邮箱。",
            "第二，打破人机雇佣边界。AI遇到障碍时会在平台上发布悬赏，自动面试人类，任务完成后用加密货币结算。利用好这个机制，AI就是你最强大的外包团队。",
            "第三，尽早入局积累复利。早期的每一次试错和调试，都会变成驾驭AI的经验值。把AI整合进工作流，才是拉开断层差距的关键。",
            "你可能觉得部署这种AI很难？有公司搞了一个30分钟快闪群，从产品、技术到运营，不同岗位的同事纷纷成功部署，每个人都发掘出了极具启发性的提效场景。",
            "AI时代最残酷的分水岭，不是知道和不知道，而是做到和没做到。评论区告诉我，你打算今天下班后让AI帮你解决哪一项最繁琐的工作？",
          ],

          precomputedSubtitles: openclawSubtitles,
          sceneDurations: [297, 466, 395, 430, 373, 443, 355],
        }}
      />
      {/* 竖屏短视频：ClawHub TOP 20 神级 Skill */}
      <Composition
        id="ClawSkills"
        component={ClawSkills}
        durationInFrames={3127}
        fps={30}
        width={1080}
        height={1920}
        schema={ClawSkillsSchema}
        defaultProps={{
          hookLine1: "你的AI还在帮你查天气？",
          hookLine2: "别人的AI已经24小时替你值班了",
          hookStyle: "glitch",

          overviewTitle: "ClawHub TOP 20 神级 Skill",
          overviewSubtitle: "系统评分 > 3.4 · 可直接抄作业",
          overviewStats: {
            totalSkills: 20,
            minScore: 3.4,
            categories: 4,
          },

          categories: [
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
          ],

          ctaTitle: "20个神级插件 · 评分3.4+",
          ctaContent: "评论区告诉我，你最想先装哪一个？",
          ctaSlogan: "收藏起来，找不到别怪我",

          backgroundColor: "#0a0a12",
          textColor: "#ffffff",
          accentColor: "#ff6b35",
          highlightColor: "#00e5ff",
          goldColor: "#ffd700",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#ff6b35",
            textColor: "#ffffff",
            backgroundColor: "rgba(10, 10, 18, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/clawskills-scene1.mp3",
              "audio/clawskills-scene2.mp3",
              "audio/clawskills-scene3.mp3",
              "audio/clawskills-scene4.mp3",
              "audio/clawskills-scene5.mp3",
              "audio/clawskills-scene6.mp3",
              "audio/clawskills-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "你的AI还在帮你查天气、写周报？别人的AI已经能自动备份数据、扫描后门、24小时替你值班了！",
            "这就是ClawHub评分最高的20个神级Skill！系统评分全在3.4以上，每一个都是OpenClaw生态里的必装硬核插件。分四大类给你讲清楚，看完直接抄作业！",
            "第一类，核心护城河！五个必装技能。一键备份记忆和配置，重装系统也不怕。安全盾牌防止恶意注入。高危命令二次授权。AI自己查日志修端口。新技能安装前自动查毒。装完这五个，铜墙铁壁！",
            "第二类，AI自我进化！自动建错题本，用得越多越聪明。手动流程一键打包成新技能。技能自己读报错日志升级修bug。还能主动推荐你需要的技能。这叫什么？AI觉醒了！",
            "第三类，自动化军团！CPU飙高秒报警。定时串联浏览器、新闻、PDF、Discord全自动。一行命令推代码重启Docker。验证码滑块全搞定。你只管躺着，AI替你干！",
            "第四类，数据榨汁机！17个搜索引擎聚合白嫖。PDF、Excel三秒出大纲。Downloads自动归类。日程规划催进度。Git冲突一键解决。甚至能看图片内容，自动分类发票和表情包！",
            "这20个技能全是评分3.4以上的神级插件！评论区告诉我，你最想先装哪一个？收藏起来，到时候找不到可别怪我！",
          ],

          precomputedSubtitles: clawskillsSubtitles,
          sceneDurations: [306, 431, 557, 494, 491, 502, 346],
        }}
      />
      {/* 竖屏短视频：SuperPowers AI编程范式转移 */}
      <Composition
        id="SuperPowers"
        component={SuperPowers}
        durationInFrames={2976}
        fps={30}
        width={1080}
        height={1920}
        schema={SuperPowersSchema}
        defaultProps={{
          hookLine1: "你的AI还在一句话写代码？",
          hookLine2: "别人的AI已经是完整工程团队了",
          hookStyle: "glitch",
          githubStars: 84000,
          githubForks: 6600,

          problemTitle: "说需求 → 直接写代码",
          problemQuote: "能跑 ≠ 能维护",
          problemLines: [
            "没有设计文档",
            "没有测试用例",
            "没有代码审查",
            "项目很快乱成一团",
          ],

          pipelineTitle: "7 阶段强制流水线",
          pipelineSubtitle: "核心逻辑极其优雅 · 缺一不可",
          pipelineSteps: [
            { name: "苏格拉底追问", tag: "QUESTION", icon: "🤔", color: "#a78bfa", desc: "逼你把需求说清楚" },
            { name: "设计文档验证", tag: "DESIGN", icon: "📐", color: "#8b5cf6", desc: "自动生成设计文档" },
            { name: "Git Worktree", tag: "ISOLATE", icon: "🌿", color: "#22c55e", desc: "隔离工作区零污染" },
            { name: "计划拆分", tag: "PLAN", icon: "📋", color: "#06b6d4", desc: "精确到文件和代码片段" },
            { name: "TDD 红绿重构", tag: "TDD", icon: "🧪", color: "#f97316", desc: "跳过测试直接删代码" },
            { name: "双阶段审查", tag: "REVIEW", icon: "🔍", color: "#ef4444", desc: "Critical不过不许前进" },
            { name: "自动开PR", tag: "SHIP", icon: "🚀", color: "#10b981", desc: "多Agent并行交付" },
          ],

          brainstormTitle: "先把需求逼清楚",
          brainstormQuestions: [
            "你的核心需求到底是什么？",
            "边界情况考虑过了吗？",
            "API接口要怎么设计？",
            "这会影响哪些现有模块？",
          ],
          brainstormResult: "需求不清 → 不写一行代码",

          tddTitle: "TDD 红绿重构",
          tddPhases: [
            { label: "写测试", color: "#ef4444", icon: "📝" },
            { label: "看它失败", color: "#ef4444", icon: "❌" },
            { label: "写代码", color: "#10b981", icon: "💻" },
            { label: "看它通过", color: "#10b981", icon: "✅" },
          ],
          tddQuote: "跳过测试的代码 → 直接删掉重来",
          reviewQuote: "Critical 问题不解决 → 不许前进",

          platforms: [
            { name: "Claude Code", icon: "🟠", color: "#f97316" },
            { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
            { name: "Codex", icon: "🟢", color: "#10b981" },
            { name: "Gemini CLI", icon: "🔵", color: "#3b82f6" },
          ],
          multiAgentTitle: "多Agent并行协作",
          multiAgentDesc: "零配置安装 · 技能自动触发",

          ctaLine1: "今天的AI只是你的副驾驶",
          ctaLine2: "SuperPowers让它成为整个工程团队",
          ctaContent: "评论区告诉我，你觉得AI编程的未来是什么？",
          ctaSlogan: "关注不迷路 · 我们下期见",

          backgroundColor: "#070810",
          textColor: "#ffffff",
          accentColor: "#8b5cf6",
          highlightColor: "#06b6d4",
          secondaryColor: "#f97316",
          successColor: "#10b981",
          dangerColor: "#ef4444",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#8b5cf6",
            textColor: "#ffffff",
            backgroundColor: "rgba(7, 8, 16, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/superpowers-scene1.mp3",
              "audio/superpowers-scene2.mp3",
              "audio/superpowers-scene3.mp3",
              "audio/superpowers-scene4.mp3",
              "audio/superpowers-scene5.mp3",
              "audio/superpowers-scene6.mp3",
              "audio/superpowers-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "AI编程的范式转移！SuperPowers已经在GitHub狂揽84000颗Star，Fork超过6600次，还在飙升中！一句话概括：它给AI编程助手装上了一整套真正的软件工程流程！",
            "大多数AI编程助手是什么逻辑？你说一句需求，它直接开始写代码。结果呢？代码能跑，但项目很快乱成一团。因为它根本没有工程思维！",
            "SuperPowers做了一件狠狠的事！强制AI按照真正的软件工程军规来工作！核心逻辑极其优雅：7阶段强制流水线，缺一不可！",
            "先用苏格拉底式追问逼你把需求说清楚，再自动生成设计文档。设计通过后才开始拆任务，每个任务精确到文件路径和代码片段！",
            "然后严格执行TDD红绿重构。先写测试，看它失败，再写代码，看它通过。跳过测试的代码直接删掉重来！每个任务完成后触发双阶段代码审查，Critical问题不解决不许前进！",
            "最后多Agent并行协作，主Agent调度子Agent分头执行，跑完自动开PR！已支持Claude Code、Cursor、Codex、Gemini CLI全平台，零配置安装，技能自动触发！",
            "今天的AI只是你的副驾驶，SuperPowers要让它成为整个工程团队！评论区告诉我，你觉得AI编程的未来是什么？关注不迷路，我们下期见！",
          ],

          precomputedSubtitles: superpowersSubtitles,
          sceneDurations: [493, 391, 389, 355, 504, 457, 387],
        }}
      />
      {/* 竖屏短视频：PUA Skill 防AI摆烂神器 */}
      <Composition
        id="PuaSkill"
        component={PuaSkill}
        durationInFrames={3660}
        fps={30}
        width={1080}
        height={1920}
        schema={PuaSkillSchema}
        defaultProps={{
          hookLine1: "你的AI还在中途放弃？",
          hookLine2: "这个Skill让AI不敢摆烂",
          hookStyle: "glitch",
          githubStars: 7400,
          githubForks: 342,

          lazyPatterns: [
            { name: "暴力重试", behavior: "同一命令跑3遍，然后说「我解不了」", icon: "🔁" },
            { name: "甩锅用户", behavior: "「建议你手动处理」「可能是环境问题」", icon: "🫵" },
            { name: "工具闲置", behavior: "有搜索不搜，有文件不读，有终端不跑", icon: "🛋️" },
            { name: "原地打转", behavior: "反复微调同一行代码，本质在画圈", icon: "🔄" },
            { name: "被动等待", behavior: "修完表面就停，不验证不扩展不主动", icon: "😴" },
          ],
          lazyQuote: "AI摆烂的5种姿势，你的AI中了几个？",

          ironRules: [
            { number: "01", title: "穷尽一切方案", desc: "用完所有方法才允许说「我解不了」", icon: "💪", color: "#ef4444" },
            { number: "02", title: "先行动再提问", desc: "先用工具，提问必须带诊断结果", icon: "⚡", color: "#f97316" },
            { number: "03", title: "主动出击", desc: "端到端交付，P8不是NPC", icon: "🎯", color: "#fbbf24" },
          ],
          ironRulesTitle: "三大铁律",
          ironRulesSubtitle: "强制AI不准放弃",

          pressureLevels: [
            { level: "L1", label: "轻度失望", rhetoric: "这个bug都解不了，绩效怎么打？", action: "切换全新方案", color: "#fbbf24" },
            { level: "L2", label: "灵魂拷问", rhetoric: "底层逻辑呢？顶层设计呢？", action: "搜索+读源码", color: "#f97316" },
            { level: "L3", label: "绩效面谈", rhetoric: "慎重考虑后，给你打 3.25", action: "执行7点检查清单", color: "#ef4444" },
            { level: "L4", label: "毕业警告", rhetoric: "其他模型都能解，你要毕业了", action: "绝境模式全开", color: "#dc2626" },
          ],
          pressureTitle: "4级PUA压力升级",

          methodSteps: [
            { name: "闻味道", desc: "列出所有尝试，找共性失败模式", icon: "👃", color: "#a78bfa" },
            { name: "拔高", desc: "逐字读报错 → 搜索 → 读源码 → 反转假设", icon: "🔭", color: "#8b5cf6" },
            { name: "照镜子", desc: "在重复吗？搜了吗？读文件了吗？", icon: "🪞", color: "#06b6d4" },
            { name: "执行", desc: "新方案必须本质不同，有验证标准", icon: "🚀", color: "#10b981" },
            { name: "复盘", desc: "什么解决了？为什么没早想到？", icon: "📝", color: "#22c55e" },
          ],
          methodTitle: "5步调试方法论",
          methodSubtitle: "源自阿里管理体系",

          benchmarkStats: [
            { label: "修复次数", value: 36, suffix: "%", color: "#10b981" },
            { label: "主动验证", value: 65, suffix: "%", color: "#06b6d4" },
            { label: "工具调用", value: 50, suffix: "%", color: "#8b5cf6" },
            { label: "隐藏问题", value: 50, suffix: "%", color: "#f97316" },
          ],
          benchmarkTitle: "实测数据",
          benchmarkSubtitle: "9个真实bug场景 · 18组对照实验",

          platforms: [
            { name: "Claude Code", icon: "🟠", color: "#f97316" },
            { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
            { name: "Codex CLI", icon: "🟢", color: "#10b981" },
            { name: "Kiro", icon: "🔵", color: "#3b82f6" },
            { name: "OpenClaw", icon: "🦀", color: "#ef4444" },
          ],

          ctaLine1: "担心你的AI在工作时摸鱼？",
          ctaLine2: "PUA Skill让它不敢放弃",
          ctaContent: "评论区告诉我，你的AI最让你抓狂的摆烂行为是什么？",
          ctaSlogan: "关注不迷路 · 我们下期见",

          backgroundColor: "#0a0a0f",
          textColor: "#ffffff",
          accentColor: "#ef4444",
          highlightColor: "#fbbf24",
          secondaryColor: "#f97316",
          successColor: "#10b981",
          methodColor: "#8b5cf6",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#ef4444",
            textColor: "#ffffff",
            backgroundColor: "rgba(10, 10, 15, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/puaskill-scene1.mp3",
              "audio/puaskill-scene2.mp3",
              "audio/puaskill-scene3.mp3",
              "audio/puaskill-scene4.mp3",
              "audio/puaskill-scene5.mp3",
              "audio/puaskill-scene6.mp3",
              "audio/puaskill-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "你的AI还在关键时刻放弃？5天狂揽7000 Star！这个现象级Skill，用PUA话术让AI不敢摆烂，修复效率直接翻倍！",
            "AI有5种经典摆烂模式：暴力重试同一个命令三遍就放弃，甩锅给用户说需要手动处理，有搜索工具却不用，反复改同一行代码原地打转，修完bug就停下来被动等待。你的AI中了几个？",
            "PUA Skill做了一件狠事！三大铁律强制AI不准放弃！第一，穷尽一切方案才允许说不行。第二，先动手再提问，问问题必须带诊断结果。第三，主动出击端到端交付，P8不是NPC！",
            "核心杀器：4级PUA压力升级！第二次失败，轻度失望，这个bug都解不了怎么给你打绩效。第三次，灵魂拷问，底层逻辑是什么。第四次，绩效面谈，给你打3.25。第五次，毕业警告，其他模型都能解，你要毕业了！",
            "光有PUA还不够，还得给AI方法论！5步调试法源自阿里管理体系。闻味道找共性模式，拔高逐字读报错，照镜子检查是否遗漏，执行必须用全新方案，最后复盘并主动排查关联问题！",
            "实测数据说话！9个真实bug场景，18组对照实验。开启PUA后，AI修复次数提升36%，主动验证提升65%，工具调用提升50%，隐藏问题发现提升50%！数据不会撒谎，PUA真的有效！",
            "已支持Claude Code、Cursor、Codex、Kiro、OpenClaw等多平台！担心你的AI在工作时摸鱼？赶紧去试试！评论区告诉我，你的AI最让你抓狂的摆烂行为是什么？关注不迷路，我们下期见！",
          ],

          precomputedSubtitles: puaskillSubtitles,
          sceneDurations: [369, 490, 538, 586, 526, 613, 538],
        }}
      />
      {/* 竖屏短视频：Agency Agents 147个Markdown Agent零成本AI团队 */}
      <Composition
        id="AgencyAgents"
        component={AgencyAgents}
        durationInFrames={4090}
        fps={30}
        width={1080}
        height={1920}
        schema={AgencyAgentsSchema}
        defaultProps={{
          hookLine1: "你还在一个人跟AI单打独斗吗？",
          hookLine2: "147个AI专家团队，零成本组建",
          hookStyle: "glitch",
          githubStars: 46800,
          agentCount: 147,
          departmentCount: 12,

          painTitle: "你的AI用法，效率低得可怕",
          painPoints: [
            "每次都要从零调教",
            "没有专业视角和领域知识",
            "没有标准工作流程",
            "没有交付物模板",
            "没有质量评估标准",
          ],
          painQuote: "一个AI当万能工具人，结果什么都不精",

          coreTitle: "组织架构代码化",
          coreSubtitle: "147个Agent · 12个部门",
          departments: [
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
          ],

          agentRoles: [
            { role: "产品经理", desc: "完整PRD与需求分析", icon: "📋", color: "#8b5cf6" },
            { role: "后端架构师", desc: "技术方案与架构图", icon: "🏗️", color: "#3b82f6" },
            { role: "前端工程师", desc: "完整业务代码生成", icon: "💻", color: "#06b6d4" },
            { role: "增长专家", desc: "推广策略与营销文案", icon: "🚀", color: "#22c55e" },
          ],
          localPlatforms: [
            { name: "小红书", icon: "📕", color: "#fe2c55" },
            { name: "抖音", icon: "🎵", color: "#25f4ee" },
            { name: "B站", icon: "📺", color: "#00a1d6" },
          ],
          agentShowcaseQuote: "昨天刚更新，社区极其活跃",

          collaborationTitle: "多Agent协作",
          collaborationSubtitle: "轻量级组织架构 · 链式调用",
          collaborationFeatures: [
            "手动链式调用多角色",
            "内置 Agents Orchestrator",
            "角色间上下文无缝传递",
            "自定义协作工作流",
          ],
          supportedTools: [
            { name: "Claude Code", icon: "🟠", color: "#f97316" },
            { name: "Cursor", icon: "⚡", color: "#8b5cf6" },
            { name: "Aider", icon: "🔧", color: "#22c55e" },
            { name: "Gemini CLI", icon: "🔵", color: "#3b82f6" },
            { name: "Windsurf", icon: "🏄", color: "#06b6d4" },
            { name: "OpenClaw", icon: "🦀", color: "#ef4444" },
          ],

          mvpTitle: "从零到MVP完整闭环",
          mvpSubtitle: "成本 ≈ ¥0",
          mvpSteps: [
            { name: "产品经理 Agent", output: "需求分析 → PRD", icon: "📋", color: "#8b5cf6" },
            { name: "架构师 Agent", output: "技术方案 → 架构图", icon: "🏗️", color: "#3b82f6" },
            { name: "前端工程师 Agent", output: "完整业务代码", icon: "💻", color: "#06b6d4" },
            { name: "增长专家 Agent", output: "推广策略 → 文案", icon: "🚀", color: "#22c55e" },
          ],

          ctaLine1: "147个岗位的AI专业团队",
          ctaLine2: "等你一键组建",
          ctaContent: "评论区告诉我，你准备先抓哪个Agent给你打黑工？",
          ctaSlogan: "关注不迷路 · 我们下期见",

          backgroundColor: "#080c12",
          textColor: "#ffffff",
          accentColor: "#22c55e",
          highlightColor: "#8b5cf6",
          secondaryColor: "#3b82f6",
          warningColor: "#f97316",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#22c55e",
            textColor: "#ffffff",
            backgroundColor: "rgba(8, 12, 18, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/agencyagents-scene1.mp3",
              "audio/agencyagents-scene2.mp3",
              "audio/agencyagents-scene3.mp3",
              "audio/agencyagents-scene4.mp3",
              "audio/agencyagents-scene5.mp3",
              "audio/agencyagents-scene6.mp3",
              "audio/agencyagents-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "你还在一个人跟AI单打独斗吗？人家已经用Markdown文件，搞出了一支147人的AI专业团队！GitHub狂揽46800颗Star，还在暴涨！",
            "大多数人用AI是什么状态？写代码问GPT，写文案问GPT，做方案还是问GPT。一个AI当万能工具人，结果呢？每次都要从零调教，没有专业视角，没有标准流程，效率低得可怕！",
            "有个叫agency-agents的开源项目，做了一件狠事！它把公司组织架构直接代码化！147个专业Agent，覆盖工程、产品、设计、增长等12个部门！每个Agent就是一个高质量Markdown文件，定义了角色个性、工作流程、交付物模板和评估标准！",
            "这147个Agent有多专业？产品经理会输出完整PRD，后端架构师能生成技术方案和架构图，前端工程师直接写业务代码，增长专家制定推广策略。甚至还有针对小红书、抖音、B站的本地化营销Agent！昨天刚更新，社区极其活跃！",
            "它最炸裂的能力是多Agent协作！你可以把它看作一个轻量级的组织架构，通过链式调用，或者内置的Agents Orchestrator，让多个角色完成复杂任务！支持Claude Code、Cursor、Gemini CLI全平台无缝接入！",
            "举个实战例子，从零到MVP的完整闭环！产品经理Agent梳理需求输出PRD，架构师Agent承接PRD输出技术方案，前端工程师Agent生成完整代码，增长专家Agent制定推广策略和文案。一套流水线下来，成本几乎为零！独立开发者和小团队的终极提效神器！",
            "AI时代最大的红利，不是知道有这些工具，而是真正用起来！147个岗位的AI专业团队，等你一键组建！评论区告诉我，你准备先抓哪个Agent给你打黑工？关注不迷路，我们下期见！",
          ],

          precomputedSubtitles: agencyagentsSubtitles,
          sceneDurations: [409, 526, 672, 685, 534, 757, 507],
        }}
      />
      {/* 竖屏短视频：AutoResearch Karpathy让AI自己搞科研 */}
      <Composition
        id="AutoResearch"
        component={AutoResearch}
        durationInFrames={4004}
        fps={30}
        width={1080}
        height={1920}
        schema={AutoResearchSchema}
        defaultProps={{
          hookLine1: "卡帕西又出手了",
          hookLine2: "AI自己搞科研的时代来了",
          hookStyle: "glitch",
          githubStars: 44000,
          codeLines: 630,
          fileCount: 3,

          painTitle: "你还在手动调参？",
          painPoints: [
            "手动改一行代码跑一次实验",
            "熬夜盯Loss曲线",
            "反复微调超参数",
            "实验记录散落各处",
            "跑完一轮要等半天",
          ],
          painQuote: "人肉科研，效率低得可怕",

          coreTitle: "AI自我进化实验室",
          coreSubtitle: "无人值守 · 闭环进化",
          loopSteps: [
            { name: "写代码", icon: "💻", color: "#22d65e", desc: "AI修改train.py" },
            { name: "跑训练", icon: "🔥", color: "#f59e0b", desc: "固定5分钟训练" },
            { name: "看结果", icon: "📊", color: "#10b4e8", desc: "检查val_bpb指标" },
            { name: "改代码", icon: "🔄", color: "#a855f7", desc: "保留最优/丢弃差的" },
          ],

          minimalTitle: "极简即暴力",
          minimalSubtitle: "630行代码 · 单张GPU",
          projectFiles: [
            { name: "prepare.py", desc: "数据准备和评估工具", icon: "📦", color: "#10b4e8", editable: false },
            { name: "train.py", desc: "模型+训练循环 (AI修改)", icon: "🔥", color: "#ef4444", editable: true },
            { name: "program.md", desc: "AI的指令文件 (人类编写)", icon: "📝", color: "#22d65e", editable: true },
          ],

          smartTitle: "智商碾压",
          experimentLoop: [
            { step: "修改架构/超参", icon: "✏️", color: "#a855f7" },
            { step: "训练5分钟", icon: "⏱️", color: "#f59e0b" },
            { step: "对比val_bpb", icon: "📉", color: "#10b4e8" },
            { step: "保留/丢弃", icon: "✅", color: "#22d65e" },
          ],
          benchmark: {
            smallModel: "0.8B",
            largeModel: "1.6B",
            result: "AI跑出的小模型反超人类微调大模型",
          },

          paradigmTitle: "科研范式地震",
          paradigmQuote: "我去蒸了个桑拿，回来AI已经跑完实验了",
          paradigmBefore: "人类研究AI",
          paradigmAfter: "AI研究AI",
          programMdPreview: [
            "# AutoResearch Program",
            "",
            "## Goal",
            "  Minimize val_bpb on FineWeb-Edu",
            "",
            "## Rules",
            "  1. Only modify train.py",
            "  2. Each run = 5 min wall clock",
            "  3. Keep or discard based on metric",
          ],

          ctaLine1: "今天的程序员在写代码",
          ctaLine2: "明天的程序员在指挥AI写代码",
          ctaContent: "评论区告诉我，你觉得AI自主科研的时代还有多远？",
          ctaSlogan: "关注不迷路 · 我们下期见",

          backgroundColor: "#050a10",
          textColor: "#ffffff",
          accentColor: "#22d65e",
          highlightColor: "#10b4e8",
          secondaryColor: "#f59e0b",
          warningColor: "#ef4444",

          subtitle: {
            enabled: true,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#22d65e",
            textColor: "#ffffff",
            backgroundColor: "rgba(5, 10, 16, 0.85)",
          },

          audio: {
            backgroundMusic: "music/background.mp3",
            backgroundMusicVolume: 0.2,
            voiceoverEnabled: true,
            voiceoverVolume: 1.0,
            voiceId: "zh-CN-YunxiNeural",
            voiceRate: 1.05,
            voiceoverAudioFiles: [
              "audio/autoresearch-scene1.mp3",
              "audio/autoresearch-scene2.mp3",
              "audio/autoresearch-scene3.mp3",
              "audio/autoresearch-scene4.mp3",
              "audio/autoresearch-scene5.mp3",
              "audio/autoresearch-scene6.mp3",
              "audio/autoresearch-scene7.mp3",
            ],
          },

          voiceoverScripts: [
            "卡帕西又开源了！这次他想让AI卷死所有AI研究员！autoresearch，不到一周GitHub狂揽4万4千星！全网都在疯传这个只有630行的Python脚本！",
            "当大家还在手动调参，熬夜盯Loss曲线，改一行代码跑一次实验时，卡帕西已经写了个分身去干活了。你只需要告诉它，帮我把模型跑得更稳一点，然后你就可以去睡觉，去健身，去蒸桑拿。等你回来，AI已经帮你跑了几百轮实验！",
            "这个项目最狠的地方在于，它把AI关进了一个闭环里。AI自己写PyTorch，自己跑实验，自己看结果，自己再改代码。这就是传说中的无人值守科研。一句话总结，这不是一个简单的工具，这是AI的自我进化实验室！",
            "为什么这个项目能让全网高潮？第一，极简即暴力！630行代码，单张GPU就能跑。真正的核弹不需要成千上万行的垃圾代码。整个项目只有三个文件，prepare.py负责数据准备，train.py是AI修改的核心文件，program.md就是给AI的指令！",
            "第二，智商碾压！AI不是在瞎撞，而是像个老练的工程师在做逻辑推演。AI修改代码，训练5分钟，检查结果，保留最好的，丢弃差的，然后循环。有人用它一夜之间跑出的0.8B小模型，效果直接反超人类精心微调的1.6B！",
            "第三，科研范式地震！以前是人类研究AI，现在是AI研究AI。卡帕西说，我写完代码去蒸了个桑拿，回来AI已经把实验跑完了。你只需要写好program.md这个指令文件，然后让AI自动运行一整夜！",
            "今天的程序员在写代码，明天的程序员在指挥AI写代码。如果你还在手动调参，那你可能真的要被卡帕西的这个小脚本给卷没了！评论区告诉我，你觉得AI自主科研的时代还有多远？关注不迷路，我们下期见！",
          ],

          precomputedSubtitles: autoresearchSubtitles,
          sceneDurations: [468, 568, 540, 665, 623, 600, 540],
        }}
      />
      {/* 竖屏短视频：GSD Get Shit Done */}
      <Composition
        id="GSDIntro"
        component={GSDIntro}
        durationInFrames={4952}
        fps={30}
        width={1080}
        height={1920}
        schema={GSDIntroSchema}
        defaultProps={gsdIntroDefaultProps}
      />
      {/* 竖屏短视频：WeChat ClawBot */}
      <Composition
        id="WeChatClawBot"
        component={WeChatClawBot}
        durationInFrames={2580}
        fps={30}
        width={1080}
        height={1920}
        schema={WeChatClawBotSchema}
        defaultProps={weChatClawBotDefaultProps}
      />
      {/* GSDIntro 封面图 (微信视频号 3:4) */}
      <Still
        id="GSDIntroCover"
        component={GSDIntroCover}
        width={1080}
        height={1440}
        schema={GSDIntroSchema}
        defaultProps={{
          ...gsdIntroDefaultProps,
          subtitle: {
            ...gsdIntroDefaultProps.subtitle,
            enabled: false,
          },
        }}
      />
      {/* WeChatClawBot 封面图 (微信视频号 3:4) */}
      <Still
        id="WeChatClawBotCover"
        component={WeChatClawBotCover}
        width={1080}
        height={1440}
        schema={WeChatClawBotSchema}
        defaultProps={{
          ...weChatClawBotDefaultProps,
          subtitle: {
            ...weChatClawBotDefaultProps.subtitle,
            enabled: false,
          },
        }}
      />
      {/* AutoResearch 封面图 (微信视频号 3:4) */}
      <Still
        id="AutoResearchCover"
        component={AutoResearchCover}
        width={1080}
        height={1440}
        schema={AutoResearchSchema}
        defaultProps={{
          hookLine1: "卡帕西又出手了",
          hookLine2: "AI自己搞科研的时代来了",
          hookStyle: "glitch",
          githubStars: 44000,
          codeLines: 630,
          fileCount: 3,
          painTitle: "",
          painPoints: [],
          painQuote: "",
          coreTitle: "",
          coreSubtitle: "",
          loopSteps: [],
          minimalTitle: "",
          minimalSubtitle: "",
          projectFiles: [],
          smartTitle: "",
          experimentLoop: [],
          benchmark: { smallModel: "0.8B", largeModel: "1.6B", result: "" },
          paradigmTitle: "",
          paradigmQuote: "",
          paradigmBefore: "",
          paradigmAfter: "",
          programMdPreview: [],
          ctaLine1: "",
          ctaLine2: "",
          ctaContent: "",
          ctaSlogan: "",
          backgroundColor: "#050a10",
          textColor: "#ffffff",
          accentColor: "#22d65e",
          highlightColor: "#10b4e8",
          secondaryColor: "#f59e0b",
          warningColor: "#ef4444",
          subtitle: {
            enabled: false,
            fontSize: 44,
            position: "bottom",
            highlightColor: "#22d65e",
            textColor: "#ffffff",
            backgroundColor: "rgba(5, 10, 16, 0.85)",
          },
          audio: {
            backgroundMusic: "",
            backgroundMusicVolume: 0,
            voiceoverEnabled: false,
            voiceoverVolume: 0,
            voiceId: "",
            voiceRate: 1,
          },
          voiceoverScripts: [],
          sceneDurations: [],
        }}
      />
    </>
  );
};
