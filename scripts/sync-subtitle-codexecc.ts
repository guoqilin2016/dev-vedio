import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";
import { CodexECCSchema } from "../src/compositions/CodexECC/schema";

const SCENE_COUNT = 7;
const COMPOSITION_PREFIX = "codexecc";
const defaultScripts = CodexECCSchema.parse({}).voiceoverScripts;

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
    for (let index = 0; index < lines.length; index++) {
      const match = lines[index].match(
        /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/,
      );

      if (!match) {
        continue;
      }

      const startMs =
        Number(match[1]) * 3600000 +
        Number(match[2]) * 60000 +
        Number(match[3]) * 1000 +
        Number(match[4]);
      const endMs =
        Number(match[5]) * 3600000 +
        Number(match[6]) * 60000 +
        Number(match[7]) * 1000 +
        Number(match[8]);
      const text = lines.slice(index + 1).join(" ").trim();

      if (text) {
        cues.push({ startMs, endMs, text });
      }
      break;
    }
  }

  return cues;
}

function enforceMonotonicWords(words: SubtitleWord[]): SubtitleWord[] {
  const out: SubtitleWord[] = [];
  let prevEnd = Number.NEGATIVE_INFINITY;

  for (const word of words) {
    const startFrame = Math.max(word.startFrame, prevEnd);
    let endFrame = Math.max(word.endFrame, startFrame);
    if (endFrame <= startFrame) {
      endFrame = startFrame + 2;
    }
    out.push({ text: word.text, startFrame, endFrame });
    prevEnd = endFrame;
  }

  return out;
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

function buildWords(text: string, startFrame: number, endFrame: number): SubtitleWord[] {
  if (endFrame <= startFrame) {
    endFrame = startFrame + 2;
  }

  const words: SubtitleWord[] = [];
  const chars = text.split("");
  const visibleChars =
    chars.filter((char) => !/[\s，。！？、：；,.!?]/.test(char)).length || chars.length;

  let currentFrame = startFrame;
  let currentWord = "";
  let wordStartFrame = currentFrame;

  const flushWord = () => {
    if (!currentWord) {
      return;
    }
    const wordVisibleLength = currentWord.replace(/[\s]/g, "").length || 1;
    const wordDuration = Math.max(
      2,
      Math.round((wordVisibleLength / visibleChars) * (endFrame - startFrame)),
    );
    words.push({
      text: currentWord,
      startFrame: wordStartFrame,
      endFrame: Math.min(wordStartFrame + wordDuration, endFrame),
    });
    currentFrame = wordStartFrame + wordDuration;
    wordStartFrame = currentFrame;
    currentWord = "";
  };

  for (const char of chars) {
    if (/[\s，。！？、：；,.!?]/.test(char)) {
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
      continue;
    }

    currentWord += char;
    if (currentWord.length >= 4) {
      flushWord();
    }
  }

  flushWord();
  return words;
}

async function syncSubtitles() {
  console.log("🔄 开始同步 CodexECC 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9;
  const minSceneDuration = 90;
  const buffer = 30;

  const audioInfos: AudioInfo[] = [];

  for (let index = 0; index < SCENE_COUNT; index++) {
    const audioFile = path.join(audioDir, `${COMPOSITION_PREFIX}-scene${index + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${index + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/${COMPOSITION_PREFIX}-scene${index + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${index + 1}: 音频文件不存在，使用默认 5 秒`);
      audioInfos.push({
        file: `audio/${COMPOSITION_PREFIX}-scene${index + 1}.mp3`,
        duration: 5,
        durationFrames: 150,
      });
    }
  }

  let currentFrame = 0;
  const subtitleLines: SubtitleLine[] = [];
  const sceneDurations: number[] = [];

  for (let index = 0; index < audioInfos.length; index++) {
    const audioInfo = audioInfos[index];
    const sceneDuration = Math.max(minSceneDuration, audioInfo.durationFrames + buffer);
    const sceneStartFrame = currentFrame;
    const audioStartFrame = sceneStartFrame + sceneDelay;
    const vttFile = path.join(audioDir, `${COMPOSITION_PREFIX}-scene${index + 1}.vtt`);

    let words: SubtitleWord[] = [];

    if (fs.existsSync(vttFile)) {
      const cues = parseVtt(fs.readFileSync(vttFile, "utf-8")).sort(
        (a, b) => a.startMs - b.startMs,
      );
      console.log(`   🎯 场景 ${index + 1}: ${cues.length} 个精确时间段`);

      let lastWordEnd = audioStartFrame;

      cues.forEach((cue) => {
        let cueStartFrame = audioStartFrame + Math.round((cue.startMs / 1000) * fps);
        let cueEndFrame = audioStartFrame + Math.round((cue.endMs / 1000) * fps);
        if (cueEndFrame < cueStartFrame) {
          cueEndFrame = cueStartFrame + 2;
        }
        const effectiveStart = Math.max(cueStartFrame, lastWordEnd);
        const effectiveEnd = Math.max(cueEndFrame, effectiveStart + 2);
        const segmentWords = buildWords(cue.text, effectiveStart, effectiveEnd);
        words.push(...segmentWords);
        if (segmentWords.length > 0) {
          lastWordEnd = segmentWords[segmentWords.length - 1].endFrame;
        }
      });

      words = enforceMonotonicWords(words);
    } else {
      console.log(`   ⚠️ 场景 ${index + 1}: VTT 不存在，使用字符等比分配`);
      words = enforceMonotonicWords(
        buildWords(
          defaultScripts[index] ?? "",
          audioStartFrame,
          audioStartFrame + audioInfo.durationFrames,
        ),
      );
    }

    if (words.length > 0) {
      subtitleLines.push({
        words,
        startFrame: words[0].startFrame,
        endFrame: words[words.length - 1].endFrame,
      });
    }

    sceneDurations.push(sceneDuration);
    currentFrame += sceneDuration;
  }

  const totalDuration = sceneDurations.reduce((sum, duration) => sum + duration, 0);
  const outputPath = path.join(
    process.cwd(),
    "src",
    "data",
    `${COMPOSITION_PREFIX}-subtitles.json`,
  );

  fs.writeFileSync(outputPath, JSON.stringify(subtitleLines, null, 2));

  console.log(`\n✅ 字幕数据已写入: ${outputPath}`);
  console.log(`\n  durationInFrames: ${totalDuration}`);
  console.log(`  sceneDurations: [${sceneDurations.join(", ")}]`);
  console.log(`\n✨ CodexECC 字幕同步完成，总时长 ${(totalDuration / fps).toFixed(1)} 秒`);
}

syncSubtitles().catch(console.error);
