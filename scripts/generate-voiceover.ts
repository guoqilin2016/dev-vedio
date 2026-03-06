/**
 * 配音生成脚本
 * 使用方法: npx tsx scripts/generate-voiceover.ts
 * 
 * 这个脚本会为 TextPresentation 的所有场景生成配音音频
 * 
 * 使用更自然的配音参数：
 * - 稍微放慢语速 (-5%)
 * - 使用更自然的声音 (YunyangNeural - 新闻播报风格，更专业)
 * - 在关键词处添加停顿
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// 配音脚本 - 添加 SSML 风格的停顿标记
// 使用 ... 表示短停顿，会被转换为逗号
const defaultScripts = [
  "1亿用户... 豆包日活破亿！你还在... 只会拿AI当聊天机器人吗？",
  "AI时代最大的危机... 不是AI变得太强... 而是你还在死磕做题... 别人已经开始阅卷了。",
  "别让勤奋毁了你。打开Word或PPT... 盯着空白屏幕发呆... 痛苦地憋第一段话...",
  "零草稿原则... 简单三步破局。第一步... 身份跃迁。第二步... 三轮对话法。第三步... 从做题到阅卷。",
  "效果惊人！财务负责人用AI处理发票... 从三人三天... 变成一人半天。",
  "拒绝出初稿！把这句话贴在电脑屏幕上... 做拿着红笔改卷子的聪明人！",
];

// 配置 - 更年轻活泼的设置
const config = {
  // 可选声音：
  // - zh-CN-YunxiNeural: 活泼男声
  // - zh-CN-YunyangNeural: 新闻播报风格男声（专业）
  // - zh-CN-XiaoxiaoNeural: 温暖女声（年轻活泼）
  // - zh-CN-XiaoyiNeural: 活泼女声
  voice: "zh-CN-XiaoxiaoNeural", // 使用年轻活泼的女声
  rate: "+5%", // 稍微加快语速，更有活力
  pitch: "+5Hz", // 稍微提高音调，更年轻
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成配音...\n");

  // 确保输出目录存在
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `scene${i + 1}.mp3`);
    const relativePath = `audio/scene${i + 1}.mp3`;

    console.log(`📝 场景 ${i + 1}: "${script.substring(0, 30)}..."`);

    try {
      // 检查 edge-tts 是否安装
      execSync("which edge-tts", { stdio: "pipe" });
    } catch {
      console.error(
        "\n❌ edge-tts 未安装！请先运行: pip install edge-tts\n"
      );
      process.exit(1);
    }

    try {
      // 处理文本：将 ... 转换为逗号停顿
      const processedText = script
        .replace(/\.\.\./g, "，") // 将 ... 转换为逗号（自然停顿）
        .replace(/"/g, '\\"'); // 转义引号
      
      // 使用 edge-tts 生成音频
      const command = `edge-tts --voice "${config.voice}" --rate="${config.rate}" --pitch="${config.pitch}" --text "${processedText}" --write-media "${outputFile}"`;
      
      execSync(command, { stdio: "pipe" });
      
      console.log(`   ✅ 已生成: ${relativePath}`);
      generatedFiles.push(relativePath);
    } catch (error) {
      console.error(`   ❌ 生成失败: ${error}`);
    }
  }

  console.log("\n✨ 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));

  // 生成配置代码片段
  console.log("\n📋 在 Root.tsx 或 API 调用中使用以下配置:\n");
  console.log("```json");
  console.log(
    JSON.stringify(
      {
        audio: {
          voiceoverEnabled: true,
          voiceoverVolume: 1.0,
          voiceoverAudioFiles: generatedFiles,
        },
      },
      null,
      2
    )
  );
  console.log("```\n");
}

generateVoiceover().catch(console.error);
