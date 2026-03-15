/**
 * 字幕同步脚本 (SuperPowers - AI编程范式转移)
 * 使用方法: npx tsx scripts/sync-subtitle-superpowers.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

const SCENE_COUNT = 7;

const defaultScripts = [
  "AI编程的范式转移！SuperPowers已经在GitHub狂揽84000颗Star，Fork超过6600次，还在飙升中！一句话概括：它给AI编程助手装上了一整套真正的软件工程流程！",
  "大多数AI编程助手是什么逻辑？你说一句需求，它直接开始写代码。结果呢？代码能跑，但项目很快乱成一团。因为它根本没有工程思维！",
  "SuperPowers做了一件狠狠的事！强制AI按照真正的软件工程军规来工作！核心逻辑极其优雅：7阶段强制流水线，缺一不可！",
  "先用苏格拉底式追问逼你把需求说清楚，再自动生成设计文档。设计通过后才开始拆任务，每个任务精确到文件路径和代码片段！",
  "然后严格执行TDD红绿重构。先写测试，看它失败，再写代码，看它通过。跳过测试的代码直接删掉重来！每个任务完成后触发双阶段代码审查，Critical问题不解决不许前进！",
  "最后多Agent并行协作，主Agent调度子Agent分头执行，跑完自动开PR！已支持Claude Code、Cursor、Codex、Gemini CLI全平台，零配置安装，技能自动触发！",
  "今天的AI只是你的副驾驶，SuperPowers要让它成为整个工程团队！评论区告诉我，你觉得AI编程的未来是什么？关注不迷路，我们下期见！",
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
  console.log("🔄 开始同步 SuperPowers 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9;

  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < SCENE_COUNT; i++) {
    const audioFile = path.join(audioDir, `superpowers-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/superpowers-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/superpowers-scene${i + 1}.mp3`,
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

  const subtitleJsonPath = path.join(process.cwd(), "src", "data", "superpowers-subtitles.json");
  fs.writeFileSync(subtitleJsonPath, JSON.stringify(subtitleData, null, 2));
  console.log(`📄 字幕数据已保存到: src/data/superpowers-subtitles.json\n`);

  console.log("📋 请更新 Root.tsx 中的 SuperPowers 配置:\n");
  console.log(`durationInFrames={${currentFrame}}`);
  console.log(`sceneDurations: ${JSON.stringify(sceneDurations)}`);
  console.log(`\n导入字幕数据:`);
  console.log(`import superpowersSubtitles from "./data/superpowers-subtitles.json";`);
  console.log(`precomputedSubtitles: superpowersSubtitles,`);
}

syncSubtitles().catch(console.error);
