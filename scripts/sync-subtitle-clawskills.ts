/**
 * 字幕同步脚本 (ClawSkills - 20个神级Skill)
 * 使用方法: npx tsx scripts/sync-subtitle-clawskills.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

const SCENE_COUNT = 7;

const defaultScripts = [
  "你的AI还在帮你查天气、写周报？别人的AI已经能自动备份数据、扫描后门、24小时替你值班了！",
  "这就是ClawHub评分最高的20个神级Skill！系统评分全在3.4以上，每一个都是OpenClaw生态里的必装硬核插件。分四大类给你讲清楚，看完直接抄作业！",
  "第一类，核心护城河！五个必装技能。一键备份记忆和配置，重装系统也不怕。安全盾牌防止恶意注入。高危命令二次授权。AI自己查日志修端口。新技能安装前自动查毒。装完这五个，铜墙铁壁！",
  "第二类，AI自我进化！自动建错题本，用得越多越聪明。手动流程一键打包成新技能。技能自己读报错日志升级修bug。还能主动推荐你需要的技能。这叫什么？AI觉醒了！",
  "第三类，自动化军团！CPU飙高秒报警。定时串联浏览器、新闻、PDF、Discord全自动。一行命令推代码重启Docker。验证码滑块全搞定。你只管躺着，AI替你干！",
  "第四类，数据榨汁机！17个搜索引擎聚合白嫖。PDF、Excel三秒出大纲。Downloads自动归类。日程规划催进度。Git冲突一键解决。甚至能看图片内容，自动分类发票和表情包！",
  "这20个技能全是评分3.4以上的神级插件！评论区告诉我，你最想先装哪一个？收藏起来，到时候找不到可别怪我！",
];

interface AudioInfo {
  file: string;
  duration: number;
  durationFrames: number;
}

interface SubtitleWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface SubtitleLine {
  words: SubtitleWord[];
  startFrame: number;
  endFrame: number;
}

async function getAudioDuration(filePath: string): Promise<number> {
  try {
    const metadata = await parseFile(filePath);
    return metadata.format.duration || 0;
  } catch (error) {
    console.error(`无法读取音频文件: ${filePath}`, error);
    return 5;
  }
}

function generateSubtitleLine(
  text: string,
  startFrame: number,
  durationFrames: number,
): SubtitleWord[] {
  const chars = text.split("");
  const totalChars = chars.length;

  let currentFrame = startFrame;
  const words: SubtitleWord[] = [];

  let currentWord = "";
  let wordStartFrame = currentFrame;

  const flushWord = () => {
    if (currentWord.length > 0) {
      const wordDuration = Math.max(
        2,
        Math.round((currentWord.length / totalChars) * durationFrames)
      );
      words.push({
        text: currentWord,
        startFrame: wordStartFrame,
        endFrame: wordStartFrame + wordDuration,
      });
      currentFrame = wordStartFrame + wordDuration;
      wordStartFrame = currentFrame;
      currentWord = "";
    }
  };

  for (const char of chars) {
    if (/[\s，。！？、：；""''（）]/.test(char)) {
      flushWord();
      if (!/\s/.test(char)) {
        words.push({
          text: char,
          startFrame: currentFrame,
          endFrame: currentFrame + 2,
        });
        currentFrame += 2;
        wordStartFrame = currentFrame;
      }
    } else {
      currentWord += char;
      if (currentWord.length >= 4) {
        flushWord();
      }
    }
  }

  flushWord();
  return words;
}

async function syncSubtitles() {
  console.log("🔄 开始同步 ClawSkills 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9;

  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < SCENE_COUNT; i++) {
    const audioFile = path.join(audioDir, `clawskills-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/clawskills-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/clawskills-scene${i + 1}.mp3`,
        duration: 5,
        durationFrames: 150,
      });
    }
  }

  const minSceneDuration = 90;
  const buffer = 30;

  let currentFrame = 0;
  const subtitleLines: SubtitleLine[] = [];
  const sceneDurations: number[] = [];

  for (let i = 0; i < audioInfos.length; i++) {
    const audio = audioInfos[i];
    const script = defaultScripts[i];

    const sceneDuration = Math.max(
      minSceneDuration,
      audio.durationFrames + buffer
    );
    sceneDurations.push(sceneDuration);

    const subtitleStart = currentFrame + sceneDelay;

    const words = generateSubtitleLine(
      script,
      subtitleStart,
      audio.durationFrames,
    );

    subtitleLines.push({
      words,
      startFrame: subtitleStart,
      endFrame: subtitleStart + audio.durationFrames,
    });

    currentFrame += sceneDuration;
  }

  console.log("\n✨ 同步完成！\n");
  console.log(`总视频时长: ${(currentFrame / fps).toFixed(2)}秒 (${currentFrame}帧)\n`);

  const subtitleData = subtitleLines.map((line) => ({
    words: line.words,
    startFrame: line.startFrame,
    endFrame: line.endFrame,
  }));

  const subtitleJsonPath = path.join(process.cwd(), "src", "data", "clawskills-subtitles.json");
  fs.writeFileSync(subtitleJsonPath, JSON.stringify(subtitleData, null, 2));
  console.log(`📄 字幕数据已保存到: src/data/clawskills-subtitles.json\n`);

  console.log("📋 请更新 Root.tsx 中的 ClawSkills 配置:\n");
  console.log(`durationInFrames={${currentFrame}}`);
  console.log(`sceneDurations: ${JSON.stringify(sceneDurations)}`);
  console.log(`\n导入字幕数据:`);
  console.log(`import clawskillsSubtitles from "./data/clawskills-subtitles.json";`);
  console.log(`precomputedSubtitles: clawskillsSubtitles,`);
}

syncSubtitles().catch(console.error);
