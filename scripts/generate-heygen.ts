/**
 * HeyGen 数字人视频生成脚本
 * 使用方法: HEYGEN_API_KEY=your_key npx tsx scripts/generate-heygen.ts
 * 
 * 这个脚本会为所有场景的配音生成口型同步的数字人视频
 */

import * as fs from "fs";
import * as path from "path";
import { generateBatchHeyGenVideos, getHeyGenAvatars } from "../src/server/services/heygen";

async function main() {
  console.log("🎭 HeyGen 数字人视频生成脚本\n");

  // 检查 API Key
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    console.error("❌ 错误: 请设置 HEYGEN_API_KEY 环境变量");
    console.log("\n使用方法:");
    console.log("  HEYGEN_API_KEY=your_api_key npx tsx scripts/generate-heygen.ts");
    console.log("\n获取 API Key:");
    console.log("  1. 访问 https://www.heygen.com/");
    console.log("  2. 注册账号并获取 API Key");
    process.exit(1);
  }

  // 获取可用头像列表
  console.log("📋 获取可用头像列表...");
  const avatars = await getHeyGenAvatars(apiKey);
  if (avatars.length > 0) {
    console.log(`  找到 ${avatars.length} 个头像`);
    console.log("  推荐头像:");
    avatars.slice(0, 5).forEach((avatar: any) => {
      console.log(`    - ${avatar.avatar_id}: ${avatar.avatar_name}`);
    });
  }

  // 获取所有配音文件
  const audioDir = path.join(process.cwd(), "public", "audio");
  const audioFiles: string[] = [];

  for (let i = 1; i <= 6; i++) {
    const audioPath = path.join(audioDir, `scene${i}.mp3`);
    if (fs.existsSync(audioPath)) {
      audioFiles.push(audioPath);
    } else {
      console.log(`⚠️ 场景 ${i} 的配音文件不存在，跳过`);
    }
  }

  if (audioFiles.length === 0) {
    console.error("❌ 没有找到配音文件。请先运行 npm run generate:voiceover");
    process.exit(1);
  }

  console.log(`\n📹 准备为 ${audioFiles.length} 个场景生成数字人视频...\n`);
  console.log("⚠️ 注意: HeyGen 视频生成可能需要几分钟，请耐心等待...\n");

  // 可选：自定义头像 ID
  const config = {
    apiKey,
    // avatarId: "Angela-inblackskirt-20220820", // 可以换成其他头像
  };

  const results = await generateBatchHeyGenVideos(audioFiles, config);

  console.log("\n📊 生成结果:");
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`  ✅ 场景 ${index + 1}: ${result.videoUrl}`);
    } else {
      console.log(`  ❌ 场景 ${index + 1}: ${result.error}`);
    }
  });

  // 统计
  const successCount = results.filter((r) => r.success).length;
  console.log(`\n✨ 完成！成功生成 ${successCount}/${results.length} 个视频`);

  if (successCount > 0) {
    console.log("\n📋 在 Root.tsx 或 API 调用中使用以下配置:");
    console.log("```json");
    console.log(
      JSON.stringify(
        {
          digitalHuman: {
            enabled: true,
            videos: results
              .filter((r) => r.success)
              .map((r) => r.videoUrl?.replace("/videos/", "videos/")),
            position: "right",
            scale: 0.25,
          },
        },
        null,
        2
      )
    );
    console.log("```");
  }
}

main().catch(console.error);
