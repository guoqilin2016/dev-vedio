/**
 * 配音生成脚本 (ClawSkills - 20个神级Skill)
 * 使用方法: npx tsx scripts/generate-voiceover-clawskills.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const defaultScripts = [
  "你的AI还在帮你查天气... 写周报？... 别人的AI已经能自动备份数据... 扫描后门... 24小时替你值班了！",
  "这就是ClawHub评分最高的20个神级Skill！... 系统评分全在3.4以上... 每一个都是OpenClaw生态里的必装硬核插件... 分四大类给你讲清楚... 看完直接抄作业！",
  "第一类... 核心护城河！... 五个必装技能... 一键备份记忆和配置... 重装系统也不怕... 安全盾牌防止恶意注入... 高危命令二次授权... AI自己查日志修端口... 新技能安装前自动查毒... 装完这五个... 铜墙铁壁！",
  "第二类... AI自我进化！... 自动建错题本... 用得越多越聪明... 手动流程一键打包成新技能... 技能自己读报错日志升级修bug... 还能主动推荐你需要的技能... 这叫什么？... AI觉醒了！",
  "第三类... 自动化军团！... CPU飙高秒报警... 定时串联浏览器... 新闻... PDF... Discord全自动... 一行命令推代码重启Docker... 验证码滑块全搞定... 你只管躺着... AI替你干！",
  "第四类... 数据榨汁机！... 17个搜索引擎聚合白嫖... PDF... Excel三秒出大纲... Downloads自动归类... 日程规划催进度... Git冲突一键解决... 甚至能看图片内容... 自动分类发票和表情包！",
  "这20个技能全是评分3.4以上的神级插件！... 评论区告诉我... 你最想先装哪一个？... 收藏起来... 到时候找不到可别怪我！",
];

const config = {
  voice: "zh-CN-YunxiNeural",
  rate: "+5%",
  pitch: "+0Hz",
  outputDir: path.join(process.cwd(), "public", "audio"),
};

async function generateVoiceover() {
  console.log("🎙️ 开始生成 ClawSkills 配音...\n");

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const generatedFiles: string[] = [];

  for (let i = 0; i < defaultScripts.length; i++) {
    const script = defaultScripts[i];
    const outputFile = path.join(config.outputDir, `clawskills-scene${i + 1}.mp3`);
    const relativePath = `audio/clawskills-scene${i + 1}.mp3`;

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

  console.log("\n✨ ClawSkills 配音生成完成！\n");
  console.log("生成的文件:");
  generatedFiles.forEach((f) => console.log(`  - ${f}`));
  console.log("\n下一步: npx tsx scripts/sync-subtitle-clawskills.ts");
}

generateVoiceover().catch(console.error);
