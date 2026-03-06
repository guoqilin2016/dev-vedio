/**
 * 数字人服务 - 集成 D-ID API
 * 
 * D-ID 可以将音频 + 人脸图片生成口型同步的数字人视频
 * 
 * 使用前需要：
 * 1. 注册 D-ID 账号: https://www.d-id.com/
 * 2. 获取 API Key
 * 3. 设置环境变量 DID_API_KEY
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

// D-ID API 配置
const DID_API_BASE = "https://api.d-id.com";

export interface DigitalHumanConfig {
  apiKey?: string; // D-ID API Key
  sourceImageUrl?: string; // 人脸图片 URL
  sourceImagePath?: string; // 本地人脸图片路径
  voiceId?: string; // D-ID 内置声音 ID（可选）
}

export interface GenerateVideoRequest {
  audioPath: string; // 本地音频文件路径
  config: DigitalHumanConfig;
  outputFileName?: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  videoPath?: string;
  videoUrl?: string;
  error?: string;
  durationMs?: number;
}

// 默认配置
const DEFAULT_CONFIG: DigitalHumanConfig = {
  apiKey: process.env.DID_API_KEY,
  // 默认使用 D-ID 提供的示例人脸
  sourceImageUrl: "https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg",
};

/**
 * 上传音频文件到 D-ID
 */
async function uploadAudioToDID(
  audioPath: string,
  apiKey: string
): Promise<string | null> {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString("base64");
    const fileName = path.basename(audioPath);

    const response = await fetch(`${DID_API_BASE}/audios`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio: `data:audio/mp3;base64,${audioBase64}`,
        source_url: fileName,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("D-ID audio upload failed:", error);
      return null;
    }

    const data = await response.json();
    return data.id || data.url;
  } catch (error) {
    console.error("Upload audio error:", error);
    return null;
  }
}

/**
 * 创建数字人视频
 */
async function createTalkingVideo(
  audioUrl: string,
  sourceImageUrl: string,
  apiKey: string
): Promise<string | null> {
  try {
    const response = await fetch(`${DID_API_BASE}/talks`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: sourceImageUrl,
        script: {
          type: "audio",
          audio_url: audioUrl,
        },
        config: {
          stitch: true, // 拼接视频，去除水印区域
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("D-ID create talk failed:", error);
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Create talk error:", error);
    return null;
  }
}

/**
 * 等待视频生成完成
 */
async function waitForVideoReady(
  talkId: string,
  apiKey: string,
  maxWaitMs: number = 120000
): Promise<string | null> {
  const startTime = Date.now();
  const pollInterval = 3000; // 3秒轮询一次

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const response = await fetch(`${DID_API_BASE}/talks/${talkId}`, {
        headers: {
          Authorization: `Basic ${apiKey}`,
        },
      });

      if (!response.ok) {
        console.error("D-ID get talk status failed");
        return null;
      }

      const data = await response.json();

      if (data.status === "done") {
        return data.result_url;
      } else if (data.status === "error") {
        console.error("D-ID video generation error:", data.error);
        return null;
      }

      // 等待后继续轮询
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error("Poll status error:", error);
      return null;
    }
  }

  console.error("D-ID video generation timeout");
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
export async function generateDigitalHumanVideo(
  request: GenerateVideoRequest
): Promise<GenerateVideoResponse> {
  const startTime = Date.now();
  const config = { ...DEFAULT_CONFIG, ...request.config };

  // 验证 API Key
  if (!config.apiKey) {
    return {
      success: false,
      error: "D-ID API Key not configured. Set DID_API_KEY environment variable.",
    };
  }

  // 确保输出目录存在
  const videoDir = path.join(process.cwd(), "public", "videos");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  console.log("🎭 开始生成数字人视频...");

  try {
    // 1. 上传音频
    console.log("📤 上传音频...");
    const audioUrl = await uploadAudioToDID(request.audioPath, config.apiKey);
    if (!audioUrl) {
      return {
        success: false,
        error: "Failed to upload audio to D-ID",
        durationMs: Date.now() - startTime,
      };
    }

    // 2. 创建视频任务
    console.log("🎬 创建视频任务...");
    const sourceImage = config.sourceImageUrl || DEFAULT_CONFIG.sourceImageUrl!;
    const talkId = await createTalkingVideo(audioUrl, sourceImage, config.apiKey);
    if (!talkId) {
      return {
        success: false,
        error: "Failed to create D-ID talk",
        durationMs: Date.now() - startTime,
      };
    }

    // 3. 等待视频生成
    console.log("⏳ 等待视频生成...");
    const videoUrl = await waitForVideoReady(talkId, config.apiKey);
    if (!videoUrl) {
      return {
        success: false,
        error: "D-ID video generation failed or timeout",
        durationMs: Date.now() - startTime,
      };
    }

    // 4. 下载视频
    console.log("📥 下载视频...");
    const hash = crypto.createHash("md5").update(request.audioPath).digest("hex").slice(0, 8);
    const outputFileName = request.outputFileName || `digital-human-${hash}.mp4`;
    const outputPath = path.join(videoDir, outputFileName);

    const downloaded = await downloadVideo(videoUrl, outputPath);
    if (!downloaded) {
      return {
        success: false,
        error: "Failed to download video",
        durationMs: Date.now() - startTime,
      };
    }

    console.log("✅ 数字人视频生成完成！");
    return {
      success: true,
      videoPath: outputPath,
      videoUrl: `/videos/${outputFileName}`,
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
 * 批量生成数字人视频（为每个场景）
 */
export async function generateBatchDigitalHumanVideos(
  audioFiles: string[],
  config: DigitalHumanConfig
): Promise<GenerateVideoResponse[]> {
  const results: GenerateVideoResponse[] = [];

  for (let i = 0; i < audioFiles.length; i++) {
    console.log(`\n📹 生成场景 ${i + 1} 的数字人视频...`);
    const result = await generateDigitalHumanVideo({
      audioPath: audioFiles[i],
      config,
      outputFileName: `digital-human-scene${i + 1}.mp4`,
    });
    results.push(result);

    // 添加延迟避免 API 限流
    if (i < audioFiles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}
