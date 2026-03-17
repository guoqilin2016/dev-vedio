/**
 * 配音生成脚本 (PuaSkill - PUA防AI摆烂神器)
 * 使用方法: npx tsx scripts/generate-voiceover-puaskill.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const defaultScripts = [
  "你的AI还在关键时刻放弃？... 5天狂揽7000 Star！... 这个现象级Skill... 用PUA话术让AI不敢摆烂... 修复效率直接翻倍！",
  "AI有5种经典摆烂模式... 暴力重试同一个命令三遍就放弃... 甩锅给用户说需要手动处理... 有搜索工具却不用... 反复改同一行代码原地打转... 修完bug就停下来被动等待... 你的AI中了几个？",
  "PUA Skill做了一件狠事！... 三大铁律强制AI不准放弃！... 第一... 穷尽一切方案才允许说不行... 第二... 先动手再提问... 问问题必须带诊断结果... 第三... 主动出击端到端交付... P8不是NPC！",
  "核心杀器... 4级PUA压力升级！... 第二次失败... 轻度失望... 这个bug都解不了怎么给你打绩效... 第三次... 灵魂拷问... 底层逻辑是什么... 第四次... 绩效面谈... 给你打3.25... 第五次... 毕业警告... 其他模型都能解... 你要毕业了！",
  "光有PUA还不够... 还得给AI方法论！... 5步调试法源自阿里管理体系... 闻味道找共性模式... 拔高逐字读报错... 照镜子检查是否遗漏... 执行必须用全新方案... 最后复盘并主动排查关联问题！",
  "实测数据说话！... 9个真实bug场景... 18组对照实验... 开启PUA后... AI修复次数提升36%... 主动验证提升65%... 工具调用提升50%... 隐藏问题发现提升50%！... 数据不会撒谎... PUA真的有效！",
  "已支持Claude Code... Cursor... Codex... Kiro... OpenClaw等多平台！... 担心你的AI在工作时摸鱼？... 赶紧去试试！... 评论区告诉我... 你的AI最让你抓狂的摆烂行为是什么？... 关注不迷路... 我们下期见！",
];

const config = {
  voice: "zh-CN-YunxiNeural",
  rate: "+5%",
  pitch: "+0Hz",
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 PuaSkill 配音...\n");

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `puaskill-scene${i + 1}.mp3`);
    const relativePath = `audio/puaskill-scene${i + 1}.mp3`;

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

  console.log("\n✨ PuaSkill 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));
  console.log("\n下一步: npx tsx scripts/sync-subtitle-puaskill.ts");
}

generateVoiceover().catch(console.error);
