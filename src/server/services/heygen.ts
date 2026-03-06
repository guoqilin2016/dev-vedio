/**
 * HeyGen API 服务 - 生成数字人视频
 * 
 * HeyGen 可以将音频 + 头像图片生成口型同步的数字人视频
 * 
 * 使用前需要：
 * 1. 注册 HeyGen 账号: https://www.heygen.com/
 * 2. 获取 API Key
 * 3. 设置环境变量 HEYGEN_API_KEY
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

// HeyGen API 配置
const HEYGEN_API_BASE = "https://api.heygen.com";

export interface HeyGenConfig {
  apiKey?: string;
  avatarId?: string; // HeyGen 头像 ID
  voiceId?: string; // HeyGen 声音 ID（如果使用内置声音）
}

export interface GenerateVideoRequest {
  audioPath?: string; // 本地音频文件路径
  audioUrl?: string; // 或者提供音频 URL
  text?: string; // 或者提供文本（使用 HeyGen TTS）
  config: HeyGenConfig;
  outputFileName?: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  videoPath?: string;
  videoUrl?: string;
  videoId?: string;
  error?: string;
  durationMs?: number;
}

// 默认配置
const DEFAULT_CONFIG: HeyGenConfig = {
  apiKey: process.env.HEYGEN_API_KEY,
  // 使用 HeyGen 默认头像（可以通过 API 获取列表）
  avatarId: "Angela-inblackskirt-20220820",
};

/**
 * 上传音频文件到 HeyGen
 */
async function uploadAudioToHeyGen(
  audioPath: string,
  apiKey: string
): Promise<string | null> {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const formData = new FormData();
    formData.append("file", new Blob([audioBuffer]), path.basename(audioPath));

    const response = await fetch(`${HEYGEN_API_BASE}/v1/asset`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("HeyGen audio upload failed:", error);
      return null;
    }

    const data = await response.json();
    return data.data?.id || data.data?.url;
  } catch (error) {
    console.error("Upload audio error:", error);
    return null;
  }
}

/**
 * 创建数字人视频
 */
async function createTalkingVideo(
  audioAssetId: string | null,
  audioUrl: string | null,
  text: string | null,
  avatarId: string,
  apiKey: string,
  voiceId?: string
): Promise<string | null> {
  try {
    // 构建请求体
    const videoInput: any = {
      character: {
        type: "avatar",
        avatar_id: avatarId,
        avatar_style: "normal",
      },
    };

    // 根据输入类型设置声音
    if (audioAssetId) {
      videoInput.voice = {
        type: "audio",
        audio_asset_id: audioAssetId,
      };
    } else if (audioUrl) {
      videoInput.voice = {
        type: "audio",
        audio_url: audioUrl,
      };
    } else if (text) {
      videoInput.voice = {
        type: "text",
        input_text: text,
        voice_id: voiceId || "zh-CN-XiaoxiaoNeural",
      };
    }

    const response = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [videoInput],
        dimension: {
          width: 1280,
          height: 720,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("HeyGen create video failed:", error);
      return null;
    }

    const data = await response.json();
    return data.data?.video_id;
  } catch (error) {
    console.error("Create video error:", error);
    return null;
  }
}

/**
 * 等待视频生成完成
 */
async function waitForVideoReady(
  videoId: string,
  apiKey: string,
  maxWaitMs: number = 300000 // 5分钟
): Promise<string | null> {
  const startTime = Date.now();
  const pollInterval = 5000; // 5秒轮询一次

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const response = await fetch(
        `${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );

      if (!response.ok) {
        console.error("HeyGen get video status failed");
        return null;
      }

      const data = await response.json();
      const status = data.data?.status;

      console.log(`  视频状态: ${status}`);

      if (status === "completed") {
        return data.data?.video_url;
      } else if (status === "failed") {
        console.error("HeyGen video generation failed:", data.data?.error);
        return null;
      }

      // 等待后继续轮询
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error("Poll status error:", error);
      return null;
    }
  }

  console.error("HeyGen video generation timeout");
  return null;
}

/**
 * 下载视频文件
 */
async function downloadVideo(
  videoUrl: string,
  outputPath: string
): Promise<boolean> {
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error("Download video error:", error);
    return false;
  }
}

/**
 * 生成数字人视频
 */
export async function generateHeyGenVideo(
  request: GenerateVideoRequest
): Promise<GenerateVideoResponse> {
  const startTime = Date.now();
  const config = { ...DEFAULT_CONFIG, ...request.config };

  // 验证 API Key
  if (!config.apiKey) {
    return {
      success: false,
      error: "HeyGen API Key not configured. Set HEYGEN_API_KEY environment variable.",
    };
  }

  // 确保输出目录存在
  const videoDir = path.join(process.cwd(), "public", "videos");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log("🎭 开始使用 HeyGen 生成数字人视频...");

  try {
    let audioAssetId: string | null = null;
    let audioUrl: string | null = request.audioUrl || null;

    // 如果提供了本地音频文件，先上传
    if (request.audioPath && fs.existsSync(request.audioPath)) {
      console.log("📤 上传音频...");
      audioAssetId = await uploadAudioToHeyGen(request.audioPath, config.apiKey);
      if (!audioAssetId) {
        return {
          success: false,
          error: "Failed to upload audio to HeyGen",
          durationMs: Date.now() - startTime,
        };
      }
    }

    // 创建视频任务
    console.log("🎬 创建视频任务...");
    const avatarId = config.avatarId || DEFAULT_CONFIG.avatarId!;
    const videoId = await createTalkingVideo(
      audioAssetId,
      audioUrl,
      request.text || null,
      avatarId,
      config.apiKey,
      config.voiceId
    );

    if (!videoId) {
      return {
        success: false,
        error: "Failed to create HeyGen video",
        durationMs: Date.now() - startTime,
      };
    }

    // 等待视频生成
    console.log("⏳ 等待视频生成...");
    const videoUrl2 = await waitForVideoReady(videoId, config.apiKey);
    if (!videoUrl2) {
      return {
        success: false,
        error: "HeyGen video generation failed or timeout",
        durationMs: Date.now() - startTime,
      };
    }

    // 下载视频
    console.log("📥 下载视频...");
    const hash = crypto
      .createHash("md5")
      .update(request.audioPath || request.text || Date.now().toString())
      .digest("hex")
      .slice(0, 8);
    const outputFileName = request.outputFileName || `heygen-${hash}.mp4`;
    const outputPath = path.join(videoDir, outputFileName);

    const downloaded = await downloadVideo(videoUrl2, outputPath);
    if (!downloaded) {
      return {
        success: false,
        error: "Failed to download video",
        durationMs: Date.now() - startTime,
      };
    }

    console.log("✅ HeyGen 数字人视频生成完成！");
    return {
      success: true,
      videoPath: outputPath,
      videoUrl: `/videos/${outputFileName}`,
      videoId,
      durationMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * 获取可用的头像列表
 */
export async function getHeyGenAvatars(apiKey: string): Promise<any[]> {
  try {
    const response = await fetch(`${HEYGEN_API_BASE}/v2/avatars`, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data?.avatars || [];
  } catch (error) {
    console.error("Get avatars error:", error);
    return [];
  }
}

/**
 * 批量生成数字人视频
 */
export async function generateBatchHeyGenVideos(
  audioFiles: string[],
  config: HeyGenConfig
): Promise<GenerateVideoResponse[]> {
  const results: GenerateVideoResponse[] = [];

  for (let i = 0; i < audioFiles.length; i++) {
    console.log(`\n📹 生成场景 ${i + 1} 的数字人视频...`);
    const result = await generateHeyGenVideo({
      audioPath: audioFiles[i],
      config,
      outputFileName: `heygen-scene${i + 1}.mp4`,
    });
    results.push(result);

    // 添加延迟避免 API 限流
    if (i < audioFiles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  return results;
}
