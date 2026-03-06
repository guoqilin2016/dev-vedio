import React from "react";
import { Composition } from "remotion";
import { HelloWorld, HelloWorldSchema, TextPresentation, TextPresentationSchema } from "./compositions";
import { DEFAULT_VIDEO_CONFIG } from "./shared/types";
import nitrogenSubtitles from "./data/nitrogen-subtitles.json";

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
    </>
  );
};
