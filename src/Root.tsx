import React from "react";
import { Composition } from "remotion";
import {
  HelloWorld,
  HelloWorldSchema,
  TextPresentation,
  TextPresentationSchema,
  OpenClawAI,
  OpenClawAISchema,
} from "./compositions";
import { DEFAULT_VIDEO_CONFIG } from "./shared/types";
import nitrogenSubtitles from "./data/nitrogen-subtitles.json";
import openclawSubtitles from "./data/openclaw-subtitles.json";

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
        durationInFrames={2848}
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
          sceneDurations: [300, 466, 431, 441, 369, 462, 379],
        }}
      />
    </>
  );
};
