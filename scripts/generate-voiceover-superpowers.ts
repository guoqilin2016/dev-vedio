/**
 * 配音生成脚本 (SuperPowers - AI编程范式转移)
 * 使用方法: npx tsx scripts/generate-voiceover-superpowers.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const defaultScripts = [
  "AI编程的范式转移！... SuperPowers已经在GitHub狂揽84000颗Star... Fork超过6600次... 还在飙升中！... 一句话概括... 它给AI编程助手装上了一整套... 真正的软件工程流程！",
  "大多数AI编程助手是什么逻辑？... 你说一句需求... 它直接开始写代码... 结果呢？... 代码能跑... 但项目很快乱成一团... 因为它根本没有工程思维！",
  "SuperPowers做了一件狠狠的事！... 强制AI按照真正的软件工程军规来工作！... 核心逻辑极其优雅... 7阶段强制流水线... 缺一不可！",
  "先用苏格拉底式追问逼你把需求说清楚... 再自动生成设计文档... 设计通过后才开始拆任务... 每个任务精确到文件路径和代码片段！",
  "然后严格执行TDD红绿重构... 先写测试... 看它失败... 再写代码... 看它通过... 跳过测试的代码直接删掉重来！... 每个任务完成后触发双阶段代码审查... Critical问题不解决不许前进！",
  "最后多Agent并行协作... 主Agent调度子Agent分头执行... 跑完自动开PR！... 已支持Claude Code... Cursor... Codex... Gemini CLI全平台... 零配置安装... 技能自动触发！",
  "今天的AI只是你的副驾驶... SuperPowers要让它成为整个工程团队！... 评论区告诉我... 你觉得AI编程的未来是什么？... 关注不迷路... 我们下期见！",
];

const config = {
  voice: "zh-CN-YunxiNeural",
  rate: "+5%",
  pitch: "+0Hz",
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 SuperPowers 配音...\n");

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `superpowers-scene${i + 1}.mp3`);
    const relativePath = `audio/superpowers-scene${i + 1}.mp3`;

    console.log(`📝 场景 ${i + 1}: "${script.substring(0, 40)}..."`);

    try {
      execSync("which edge-tts", { stdio: "pipe" });
    } catch {
      console.error("\n❌ edge-tts 未安装！请先运行: pip install edge-tts\n");
      process.exit(1);
    }

    try {
      const processedText = script
        .replace(/\.\.\./g, "，")
        .replace(/"/g, '\\"');

      const command = `edge-tts --voice "${config.voice}" --rate="${config.rate}" --pitch="${config.pitch}" --text "${processedText}" --write-media "${outputFile}"`;

      execSync(command, { stdio: "pipe" });

      console.log(`   ✅ 已生成: ${relativePath}`);
      generatedFiles.push(relativePath);
    } catch (error) {
      console.error(`   ❌ 生成失败: ${error}`);
    }
  }

  console.log("\n✨ SuperPowers 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));
  console.log("\n下一步: npx tsx scripts/sync-subtitle-superpowers.ts");
}

generateVoiceover().catch(console.error);
