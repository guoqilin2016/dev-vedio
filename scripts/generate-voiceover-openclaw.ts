/**
 * 配音生成脚本 (OpenClaw AI)
 * 使用方法: npx tsx scripts/generate-voiceover-openclaw.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const defaultScripts = [
  "你还在把ChatGPT当成高级搜索工具吗？... 醒醒吧... 2026年最火的AI... 已经拿到了电脑的最高权限！",
  "过去我们总担心AI会不会取代人类... 但现在更残酷的现实是... 如果你还在岸边观望... 你可能正在变成AI的肉体外包... 当别人让AI接管枯燥工作时... 你的竞争力正在被降维打击。",
  "别慌... 只要看懂三个真相... 你也能轻松破局... 第一... 让AI从陪聊变实干... 现在的AI能在后台24小时接管你的浏览器... 终端和邮箱。",
  "第二... 打破人机雇佣边界... AI遇到障碍时会在平台上发布悬赏... 自动面试人类... 任务完成后用加密货币结算... 利用好这个机制... AI就是你最强大的外包团队。",
  "第三... 尽早入局积累复利... 早期的每一次试错和调试... 都会变成驾驭AI的经验值... 把AI整合进工作流... 才是拉开断层差距的关键。",
  "你可能觉得部署这种AI很难... 有公司搞了一个30分钟快闪群... 从产品... 技术到运营... 不同岗位的同事纷纷成功部署... 每个人都发掘出了极具启发性的提效场景。",
  "AI时代最残酷的分水岭... 不是知道和不知道... 而是做到和没做到... 评论区告诉我... 你打算今天下班后让AI帮你解决哪一项最繁琐的工作？",
];

const config = {
  voice: "zh-CN-YunxiNeural",
  rate: "+5%",
  pitch: "+0Hz",
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 OpenClaw AI 配音...\n");

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `openclaw-scene${i + 1}.mp3`);
    const relativePath = `audio/openclaw-scene${i + 1}.mp3`;

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

  console.log("\n✨ OpenClaw AI 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));
  console.log("\n下一步: npx tsx scripts/sync-subtitle-openclaw.ts");
}

generateVoiceover().catch(console.error);
