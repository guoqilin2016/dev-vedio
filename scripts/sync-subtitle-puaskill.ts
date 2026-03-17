/**
 * 字幕同步脚本 (PuaSkill - PUA防AI摆烂神器)
 * 使用方法: npx tsx scripts/sync-subtitle-puaskill.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";

const SCENE_COUNT = 7;

const defaultScripts = [
  "你的AI还在关键时刻放弃？5天狂揽7000 Star！这个现象级Skill，用PUA话术让AI不敢摆烂，修复效率直接翻倍！",
  "AI有5种经典摆烂模式：暴力重试同一个命令三遍就放弃，甩锅给用户说需要手动处理，有搜索工具却不用，反复改同一行代码原地打转，修完bug就停下来被动等待。你的AI中了几个？",
  "PUA Skill做了一件狠事！三大铁律强制AI不准放弃！第一，穷尽一切方案才允许说不行。第二，先动手再提问，问问题必须带诊断结果。第三，主动出击端到端交付，P8不是NPC！",
  "核心杀器：4级PUA压力升级！第二次失败，轻度失望，这个bug都解不了怎么给你打绩效。第三次，灵魂拷问，底层逻辑是什么。第四次，绩效面谈，给你打3.25。第五次，毕业警告，其他模型都能解，你要毕业了！",
  "光有PUA还不够，还得给AI方法论！5步调试法源自阿里管理体系。闻味道找共性模式，拔高逐字读报错，照镜子检查是否遗漏，执行必须用全新方案，最后复盘并主动排查关联问题！",
  "实测数据说话！9个真实bug场景，18组对照实验。开启PUA后，AI修复次数提升36%，主动验证提升65%，工具调用提升50%，隐藏问题发现提升50%！数据不会撒谎，PUA真的有效！",
  "已支持Claude Code、Cursor、Codex、Kiro、OpenClaw等多平台！担心你的AI在工作时摸鱼？赶紧去试试！评论区告诉我，你的AI最让你抓狂的摆烂行为是什么？关注不迷路，我们下期见！",
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
  console.log("🔄 开始同步 PuaSkill 字幕和配音...\n");

  const audioDir = path.join(process.cwd(), "public", "audio");
  const fps = 30;
  const sceneDelay = 9;

  const audioInfos: AudioInfo[] = [];

  for (let i = 0; i < SCENE_COUNT; i++) {
    const audioFile = path.join(audioDir, `puaskill-scene${i + 1}.mp3`);
    if (fs.existsSync(audioFile)) {
      const duration = await getAudioDuration(audioFile);
      console.log(`📊 场景 ${i + 1}: ${duration.toFixed(2)}秒 (${Math.round(duration * fps)}帧)`);
      audioInfos.push({
        file: `audio/puaskill-scene${i + 1}.mp3`,
        duration,
        durationFrames: Math.round(duration * fps),
      });
    } else {
      console.log(`⚠️ 场景 ${i + 1}: 音频文件不存在，使用默认10秒`);
      audioInfos.push({
        file: `audio/puaskill-scene${i + 1}.mp3`,
        duration: 10,
        durationFrames: 300,
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

    const subtitleStart = currentFrame + sceneDelay;
    const subtitleDuration = info.durationFrames;
    const words = generateSubtitleLine(
      defaultScripts[i],
      subtitleStart,
      subtitleDuration
    );

    subtitleLines.push({
      words,
      startFrame: subtitleStart,
      endFrame: subtitleStart + subtitleDuration,
    });

    sceneDurations.push(sceneDuration);
    currentFrame += sceneDuration;
  }

  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  const outputPath = path.join(process.cwd(), "src", "data", "puaskill-subtitles.json");
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(subtitleLines, null, 2));
  console.log(`\n✅ 字幕数据已写入: ${outputPath}`);

  console.log("\n📋 请更新 Root.tsx 中 PuaSkill 的配置:\n");
  console.log(`  durationInFrames: ${totalDuration},`);
  console.log(`  sceneDurations: [${sceneDurations.join(", ")}],`);
  console.log(`\n  // 添加 import:`);
  console.log(`  import puaskillSubtitles from "./data/puaskill-subtitles.json";`);
  console.log(`  // 在 defaultProps 中添加:`);
  console.log(`  precomputedSubtitles: puaskillSubtitles,`);
  console.log(`\n✨ PuaSkill 字幕同步完成！总时长: ${(totalDuration / fps).toFixed(1)}秒 (${totalDuration}帧)`);
}

syncSubtitles().catch(console.error);
