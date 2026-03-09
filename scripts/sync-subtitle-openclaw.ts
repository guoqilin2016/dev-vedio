/**
 * 字幕同步脚本 (OpenClaw AI)
 * 使用方法: npx tsx scripts/sync-subtitle-openclaw.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

const SCENE_COUNT = 7;

const defaultScripts = [
  "你还在把ChatGPT当成高级搜索工具吗？醒醒吧，2026年最火的AI已经拿到了电脑的最高权限！",
  "过去我们总担心AI会不会取代人类，但现在更残酷的现实是：如果你还在岸边观望，你可能正在变成AI的肉体外包。当别人让AI接管枯燥工作时，你的竞争力正在被降维打击。",
  "别慌，只要看懂3个真相，你也能轻松破局。第一，让AI从陪聊变实干。现在的AI能在后台24小时接管你的浏览器、终端和邮箱。",
  "第二，打破人机雇佣边界。AI遇到障碍时会在平台上发布悬赏，自动面试人类，任务完成后用加密货币结算。利用好这个机制，AI就是你最强大的外包团队。",
  "第三，尽早入局积累复利。早期的每一次试错和调试，都会变成驾驭AI的经验值。把AI整合进工作流，才是拉开断层差距的关键。",
  "你可能觉得部署这种AI很难？有公司搞了一个30分钟快闪群，从产品、技术到运营，不同岗位的同事纷纷成功部署，每个人都发掘出了极具启发性的提效场景。",
  "AI时代最残酷的分水岭，不是知道和不知道，而是做到和没做到。评论区告诉我，你打算今天下班后让AI帮你解决哪一项最繁琐的工作？",
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
  console.log("🔄 开始同步 OpenClaw AI 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9; // 0.3s

  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < SCENE_COUNT; i++) {
    const audioFile = path.join(audioDir, `openclaw-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/openclaw-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/openclaw-scene${i + 1}.mp3`,
        duration: 5,
        durationFrames: 150,
      });
    }
  }

  const minSceneDuration = 90; // 最小3秒
  const buffer = 30; // 1秒缓冲

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

  const subtitleJsonPath = path.join(process.cwd(), "src", "data", "openclaw-subtitles.json");
  fs.writeFileSync(subtitleJsonPath, JSON.stringify(subtitleData, null, 2));
  console.log(`📄 字幕数据已保存到: src/data/openclaw-subtitles.json\n`);

  console.log("📋 请更新 Root.tsx 中的 OpenClawAI 配置:\n");
  console.log(`durationInFrames={${currentFrame}}`);
  console.log(`sceneDurations: ${JSON.stringify(sceneDurations)}`);
  console.log(`\n导入字幕数据:`);
  console.log(`import openclawSubtitles from "./data/openclaw-subtitles.json";`);
  console.log(`precomputedSubtitles: openclawSubtitles,`);
}

syncSubtitles().catch(console.error);
