/**
 * 配音生成脚本 (Nitrogen AI)
 * 使用方法: npx tsx scripts/generate-voiceover-nitrogen.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// 配音脚本 - Nitrogen AI
const defaultScripts = [
  "你敢信吗？... 现在的AI根本不需要读一行代码... 光靠看游戏直播就能学会打一千多款游戏！... 这是英伟达刚刚发布的Nitrogen项目做到的真事。",
  "这种不看代码... 只看画面的学习方式... 正在彻底打破我们对AI的固有认知... 传统AI靠代码学习... 而Nitrogen直接看直播就能上手！",
  "AI进化的速度超乎想象！... 以前我们以为AI是靠穷举代码获胜... 现在它竟然学会了像人类一样用眼睛和直觉去学习... 如果还用老眼光看AI... 你可能真的要掉队了。",
  "别慌... 英伟达的研究揭示了AI学习的三个核心逻辑... 第一，像学吉他一样云通关... 第二，通用直觉比死招式更重要... 第三，破解莫拉维克悖论。",
  "来看一个反常识的案例... AI识别Xbox手柄的准确率竟然比PlayStation高！... 因为PlayStation款式五花八门... 反而把AI给整不会了... 这证明了AI学习的瓶颈往往不在算法... 而在数据的标准化和质量。",
  "AI已经开始像人一样思考和创作了... 我们不仅要会玩游戏... 更要学会驾驭AI... 别只做观众了... 赶紧成为那个驾驭AI的超级玩家！",
];

// 配置
const config = {
  voice: "zh-CN-YunxiNeural", // 活泼男声，适合科技/游戏话题
  rate: "+0%", // 正常语速
  pitch: "+0Hz", // 正常音调
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 Nitrogen AI 配音...\n");

  // 确保输出目录存在
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `nitrogen-scene${i + 1}.mp3`);
    const relativePath = `audio/nitrogen-scene${i + 1}.mp3`;

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

  console.log("\n✨ Nitrogen AI 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));
}

generateVoiceover().catch(console.error);
