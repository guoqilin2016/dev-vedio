/**
 * 字幕同步脚本
 * 根据配音音频的实际时长自动计算字幕时间
 * 
 * 使用方法: npx tsx scripts/sync-subtitle.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

// 默认配音脚本（与 generate-voiceover.ts 保持一致）
const defaultScripts = [
  "1亿用户，豆包日活破亿！你还在只会拿AI当聊天机器人吗？",
  "AI时代最大的危机，不是AI变得太强，而是你还在死磕做题，别人已经开始阅卷了。",
  "别让勤奋毁了你。打开Word或PPT，盯着空白屏幕发呆，痛苦地憋第一段话。",
  "零草稿原则，简单三步破局。第一步，身份跃迁。第二步，三轮对话法。第三步，从做题到阅卷。",
  "效果惊人！财务负责人用AI处理发票，从三人三天变成一人半天。",
  "拒绝出初稿！把这句话贴在电脑屏幕上，做拿着红笔改卷子的聪明人！",
];

interface AudioInfo {
  file: string;
  duration: number; // 秒
  durationFrames: number; // 30fps 下的帧数
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
  audioFile: string;
  audioDuration: number;
}

async function getAudioDuration(filePath: string): Promise<number> {
  try {
    const metadata = await parseFile(filePath);
    return metadata.format.duration || 0;
  } catch (error) {
    console.error(`无法读取音频文件: ${filePath}`, error);
    return 5; // 默认5秒
  }
}

function generateSubtitleLine(
  text: string,
  startFrame: number,
  durationFrames: number,
  fps: number = 30
): SubtitleWord[] {
  // 按字符分割（中文不需要按空格分）
  const chars = text.split("");
  const totalChars = chars.length;

  let currentFrame = startFrame;
  const words: SubtitleWord[] = [];

  // 将连续的中文字符合并为词组，标点单独处理
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
      // 标点符号单独处理，时间很短
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
      // 每3-4个字符形成一个词组
      if (currentWord.length >= 4) {
        flushWord();
      }
    }
  }

  // 处理剩余的字符
  flushWord();

  return words;
}

async function syncSubtitles() {
  console.log("🔄 开始同步字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9; // 每个场景开始后0.3秒才开始播放配音

  // 读取所有音频文件的时长
  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < 6; i++) {
    const audioFile = path.join(audioDir, `scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒`);
      audioInfos.push({
        file: `audio/scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/scene${i + 1}.mp3`,
        duration: 5,
        durationFrames: 150,
      });
    }
  }

  // 计算每个场景的开始帧（考虑音频时长）
  // 场景时长 = max(音频时长 + 缓冲, 最小场景时长)
  const minSceneDuration = 150; // 最小5秒
  const buffer = 30; // 1秒缓冲

  let currentFrame = 0;
  const subtitleLines: SubtitleLine[] = [];

  for (let i = 0; i < audioInfos.length; i++) {
    const audio = audioInfos[i];
    const script = defaultScripts[i];

    // 计算场景时长
    const sceneDuration = Math.max(
      minSceneDuration,
      audio.durationFrames + buffer
    );

    // 字幕开始帧（场景开始后 + 延迟）
    const subtitleStart = currentFrame + sceneDelay;

    // 生成字幕词组
    const words = generateSubtitleLine(
      script,
      subtitleStart,
      audio.durationFrames,
      fps
    );

    subtitleLines.push({
      words,
      startFrame: subtitleStart,
      endFrame: subtitleStart + audio.durationFrames,
      audioFile: audio.file,
      audioDuration: audio.duration,
    });

    currentFrame += sceneDuration;
  }

  // 输出配置
  console.log("\n✨ 同步完成！\n");
  console.log(`总视频时长: ${(currentFrame / fps).toFixed(2)}秒 (${currentFrame}帧)\n`);

  // 生成可用于组件的配置
  const config = {
    totalDurationFrames: currentFrame,
    fps,
    scenes: subtitleLines.map((line, i) => ({
      index: i + 1,
      audioFile: line.audioFile,
      audioDuration: line.audioDuration,
      startFrame: line.startFrame - sceneDelay,
      subtitleStartFrame: line.startFrame,
      subtitleEndFrame: line.endFrame,
    })),
  };

  // 保存配置文件
  const configPath = path.join(process.cwd(), "public", "subtitle-config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`📄 配置已保存到: public/subtitle-config.json\n`);

  // 同时生成字幕数据文件（供组件直接使用）
  const subtitleData = subtitleLines.map((line) => ({
    words: line.words,
    startFrame: line.startFrame,
    endFrame: line.endFrame,
  }));

  const subtitlePath = path.join(process.cwd(), "public", "subtitle-data.json");
  fs.writeFileSync(subtitlePath, JSON.stringify(subtitleData, null, 2));
  console.log(`📄 字幕数据已保存到: public/subtitle-data.json\n`);

  // 输出建议的 Root.tsx 配置
  console.log("📋 建议更新 Root.tsx 中的 durationInFrames:\n");
  console.log(`durationInFrames={${currentFrame}}`);
}

syncSubtitles().catch(console.error);
