/**
 * 字幕同步脚本 (GSD - Get Shit Done)
 * 使用 edge-tts 生成的 VTT 文件获取精确句级时间戳
 * 使用方法: npx tsx scripts/sync-subtitle-gsd.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

const SCENE_COUNT = 7;
const COMPOSITION_PREFIX = "gsd";

const defaultScripts = [
  "你有没有发现，用AI写代码，前面写得特别好，但越到后面，越离谱？变量名乱取，需求忘一半，代码开始自己跟自己打架。这不是你的问题，这是AI的通病，叫Context Rot，上下文腐烂。今天介绍一个38000 Star的开源神器，专治这个病。",
  "AI有个致命弱点，它的上下文窗口是有限的。当对话历史，调试记录，文件内容，把窗口塞满之后，信噪比急剧下降。0到30%，巅峰状态。30到50%，开始赶进度。50到70%，偷工减料。70%以上，直接开始胡说八道。这就是为什么你的AI，写到一半就变了。",
  "解决这个问题的人，不是什么大厂工程师，是一个住在哥斯达黎加的House音乐制作人。他叫Lex Christopherson，GitHub名字叫glittercowboy。他说，我不写代码，Claude Code帮我写。但我需要一个系统，让AI从头到尾都靠谱。于是GSD诞生了，Get Shit Done。",
  "GSD的核心思路很简单，把Context当稀缺资源来管理。三个关键设计。第一，规范驱动。先写Spec再写代码，所有需求拆成原子级任务。第二，波次并行。没有依赖的任务同时执行，有依赖的排队等待，像流水线一样。第三，隔离上下文。每个任务，都在全新的200K上下文窗口里执行。做完就丢掉。主会话，永远保持30到40%。",
  "用起来更简单，一条命令安装。然后6步循环，new-project，AI面试你，搞清楚你要什么。discuss-phase，锁定产品决策。plan-phase，自动研究加规划。execute-phase，波次并行执行，每个任务自动git commit。verify-work，自动化验收。complete-milestone，归档发布。全程你可以，去喝杯咖啡。",
  "效果怎么样？38000个GitHub Star，每周增长4500。Amazon，Google，Shopify，Webflow的工程师，都在用。有人实测，2到3天的活，压缩到1天。有人把6个月的研究项目，几天做完。支持6种运行时，Claude Code，Gemini CLI，OpenCode，Codex，Copilot，Antigravity。MIT开源，完全免费。",
  "如果你也在用AI写代码，一定要试试这个。一条命令搞定，npx get-shit-done-cc@latest。GitHub搜GSD或者Get Shit Done。让你的AI，从头到尾都靠谱。关注我，下期继续分享，最前沿的AI工具。",
];

interface AudioInfo {
  file: string;
  duration: number;
  durationFrames: number;
}

interface VttCue {
  startMs: number;
  endMs: number;
  text: string;
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

function parseVtt(content: string): VttCue[] {
  const cues: VttCue[] = [];
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    for (let j = 0; j < lines.length; j++) {
      const match = lines[j].match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );
      if (match) {
        const startMs =
          +match[1] * 3600000 + +match[2] * 60000 + +match[3] * 1000 + +match[4];
        const endMs =
          +match[5] * 3600000 + +match[6] * 60000 + +match[7] * 1000 + +match[8];
        const text = lines
          .slice(j + 1)
          .join(" ")
          .trim();
        if (text) cues.push({ startMs, endMs, text });
        break;
      }
    }
  }
  return cues;
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

function generateWordsFromCue(
  text: string,
  startFrame: number,
  endFrame: number,
): SubtitleWord[] {
  const durationFrames = endFrame - startFrame;
  const chars = text.split("");
  const totalChars = chars.length;
  if (totalChars === 0) return [];

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
        endFrame: Math.min(wordStartFrame + wordDuration, endFrame),
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
          endFrame: Math.min(currentFrame + 2, endFrame),
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
  console.log(`🔄 开始同步 GSD 字幕和配音 (VTT精确模式)...\n`);

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9;

  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < SCENE_COUNT; i++) {
    const audioFile = path.join(audioDir, `${COMPOSITION_PREFIX}-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/${COMPOSITION_PREFIX}-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认5秒`);
      audioInfos.push({
        file: `audio/${COMPOSITION_PREFIX}-scene${i + 1}.mp3`,
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
    const info = audioInfos[i];
    const sceneDuration = Math.max(minSceneDuration, info.durationFrames + buffer);
    const sceneStartFrame = currentFrame;
    const audioStartFrame = sceneStartFrame + sceneDelay;

    const vttFile = path.join(audioDir, `${COMPOSITION_PREFIX}-scene${i + 1}.vtt`);
    let allWords: SubtitleWord[] = [];

    if (fs.existsSync(vttFile)) {
      const vttContent = fs.readFileSync(vttFile, "utf-8");
      const cues = parseVtt(vttContent);
      console.log(`   🎯 VTT: ${cues.length} 个精确时间段`);

      for (const cue of cues) {
        const cueStartFrame = audioStartFrame + Math.round((cue.startMs / 1000) * fps);
        const cueEndFrame = audioStartFrame + Math.round((cue.endMs / 1000) * fps);
        const words = generateWordsFromCue(cue.text, cueStartFrame, cueEndFrame);
        allWords.push(...words);
      }
    } else {
      console.log(`   ⚠️ VTT 不存在，使用字符等比分配`);
      allWords = generateWordsFromCue(
        defaultScripts[i]!,
        audioStartFrame,
        audioStartFrame + info.durationFrames
      );
    }

    if (allWords.length > 0) {
      subtitleLines.push({
        words: allWords,
        startFrame: allWords[0].startFrame,
        endFrame: allWords[allWords.length - 1].endFrame,
      });
    }

    sceneDurations.push(sceneDuration);
    currentFrame += sceneDuration;
  }

  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  const outputPath = path.join(process.cwd(), "src", "data", `${COMPOSITION_PREFIX}-subtitles.json`);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(subtitleLines, null, 2));
  console.log(`\n✅ 字幕数据已写入: ${outputPath}`);

  console.log("\n📋 请更新 Root.tsx 中 GSDIntro 的配置:\n");
  console.log(`  durationInFrames: ${totalDuration},`);
  console.log(`  sceneDurations: [${sceneDurations.join(", ")}],`);
  console.log(`\n  // 添加 import:`);
  console.log(`  import gsdSubtitles from "./data/${COMPOSITION_PREFIX}-subtitles.json";`);
  console.log(`  // 在 defaultProps 中添加:`);
  console.log(`  precomputedSubtitles: gsdSubtitles,`);
  console.log(`\n✨ GSD 字幕同步完成！总时长: ${(totalDuration / fps).toFixed(1)}秒 (${totalDuration}帧)`);
}

syncSubtitles().catch(console.error);
