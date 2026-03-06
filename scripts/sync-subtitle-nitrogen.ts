/**
 * 字幕同步脚本 (Nitrogen AI)
 * 使用方法: npx tsx scripts/sync-subtitle-nitrogen.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

// 配音脚本 - 与 generate-voiceover-nitrogen.ts 保持一致（移除停顿标记用于字幕）
const defaultScripts = [
  "你敢信吗？现在的AI根本不需要读一行代码，光靠看游戏直播就能学会打1000多款游戏！这是英伟达刚刚发布的Nitrogen项目做到的真事。",
  "这种不看代码、只看画面的学习方式，正在彻底打破我们对AI的固有认知。传统AI靠代码学习，而Nitrogen直接看直播就能上手！",
  "AI进化的速度超乎想象！以前我们以为AI是靠穷举代码获胜，现在它竟然学会了像人类一样用眼睛和直觉去学习。如果还用老眼光看AI，你可能真的要掉队了。",
  "别慌，英伟达的研究揭示了AI学习的3个核心逻辑。第一，像学吉他一样云通关。第二，通用直觉比死招式更重要。第三，破解莫拉维克悖论。",
  "来看一个反常识的案例：AI识别Xbox手柄的准确率竟然比PlayStation高！因为PlayStation款式五花八门，反而把AI给整不会了。这证明了AI学习的瓶颈往往不在算法，而在数据的标准化和质量。",
  "AI已经开始像人一样思考和创作了。我们不仅要会玩游戏，更要学会驾驭AI。别只做观众了，赶紧成为那个驾驭AI的超级玩家！",
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
  console.log("🔄 开始同步 Nitrogen AI 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9; // 每个场景开始后0.3秒才开始播放配音

  // 读取所有音频文件的时长
  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < 6; i++) {
    const audioFile = path.join(audioDir, `nitrogen-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒`);
      audioInfos.push({
        file: `audio/nitrogen-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/nitrogen-scene${i + 1}.mp3`,
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
  const sceneDurations: number[] = [];

  for (let i = 0; i < audioInfos.length; i++) {
    const audio = audioInfos[i];
    const script = defaultScripts[i];

    // 计算场景时长
    const sceneDuration = Math.max(
      minSceneDuration,
      audio.durationFrames + buffer
    );
    sceneDurations.push(sceneDuration);

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

  // 同时生成字幕数据文件（供组件直接使用）
  const subtitleData = subtitleLines.map((line) => ({
    words: line.words,
    startFrame: line.startFrame,
    endFrame: line.endFrame,
  }));

  const subtitlePath = path.join(process.cwd(), "public", "subtitle-data-nitrogen.json");
  fs.writeFileSync(subtitlePath, JSON.stringify(subtitleData, null, 2));
  console.log(`📄 字幕数据已保存到: public/subtitle-data-nitrogen.json\n`);

  // 输出建议的 Root.tsx 配置
  console.log("📋 建议更新 Root.tsx 中的配置:\n");
  console.log(`durationInFrames={${currentFrame}}`);
  console.log(`sceneDurations: ${JSON.stringify(sceneDurations)}`);
}

syncSubtitles().catch(console.error);
