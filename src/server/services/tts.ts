import path from "path";
import fs from "fs";
import crypto from "crypto";

// TTS 配置接口
export interface TTSConfig {
  provider?: "edge-tts" | "openai" | "azure" | "custom";
  voice?: string;
  rate?: number; // 语速 0.5-2.0
  pitch?: number; // 音调 0.5-2.0
  apiKey?: string;
  apiEndpoint?: string;
}

// TTS 请求
export interface TTSRequest {
  text: string;
  outputFileName?: string;
  config?: TTSConfig;
}

// TTS 响应
export interface TTSResponse {
  success: boolean;
  audioPath?: string;
  duration?: number; // 音频时长（秒）
  error?: string;
}

// 默认配置
const DEFAULT_TTS_CONFIG: TTSConfig = {
  provider: "edge-tts",
  voice: "zh-CN-YunxiNeural", // 微软 Edge TTS 中文男声
  rate: 1.0,
  pitch: 1.0,
};

// 生成文件名哈希（用于缓存）
function generateCacheKey(text: string, config: TTSConfig): string {
  const content = JSON.stringify({ text, config });
  return crypto.createHash("md5").update(content).digest("hex");
}

// 使用 Edge TTS（通过 edge-tts 命令行工具）
async function generateWithEdgeTTS(
  text: string,
  outputPath: string,
  config: TTSConfig
): Promise<TTSResponse> {
  const { execSync } = await import("child_process");

  try {
    const voice = config.voice || "zh-CN-YunxiNeural";
    const rate = config.rate ? `${config.rate > 1 ? "+" : ""}${Math.round((config.rate - 1) * 100)}%` : "+0%";
    const pitch = config.pitch ? `${config.pitch > 1 ? "+" : ""}${Math.round((config.pitch - 1) * 100)}Hz` : "+0Hz";

    // 使用 edge-tts 命令行工具
    const command = `edge-tts --voice "${voice}" --rate="${rate}" --pitch="${pitch}" --text "${text.replace(/"/g, '\\"')}" --write-media "${outputPath}"`;

    execSync(command, { stdio: "pipe" });

    return {
      success: true,
      audioPath: outputPath,
    };
  } catch (error) {
    return {
      success: false,
      error: `Edge TTS failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// 主 TTS 生成函数
export async function generateTTS(request: TTSRequest): Promise<TTSResponse> {
  const config = { ...DEFAULT_TTS_CONFIG, ...request.config };

  // 确保输出目录存在
  const audioDir = path.join(process.cwd(), "public", "audio");
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // 生成输出文件名
  const cacheKey = generateCacheKey(request.text, config);
  const outputFileName = request.outputFileName || `tts-${cacheKey}.mp3`;
  const outputPath = path.join(audioDir, outputFileName);

  // 检查缓存
  if (fs.existsSync(outputPath)) {
    console.log(`🔊 Using cached TTS: ${outputFileName}`);
    return {
      success: true,
      audioPath: outputPath,
    };
  }

  console.log(`🎙️ Generating TTS for: "${request.text.substring(0, 50)}..."`);

  switch (config.provider) {
    case "edge-tts":
      return generateWithEdgeTTS(request.text, outputPath, config);

    case "openai":
      // TODO: 实现 OpenAI TTS
      return {
        success: false,
        error: "OpenAI TTS not implemented yet",
      };

    case "azure":
      // TODO: 实现 Azure TTS
      return {
        success: false,
        error: "Azure TTS not implemented yet",
      };

    default:
      return {
        success: false,
        error: `Unknown TTS provider: ${config.provider}`,
      };
  }
}

// 批量生成 TTS（用于多个场景）
export async function generateBatchTTS(
  requests: TTSRequest[]
): Promise<TTSResponse[]> {
  const results: TTSResponse[] = [];

  for (const request of requests) {
    const result = await generateTTS(request);
    results.push(result);
  }

  return results;
}

// 获取可用的声音列表
export function getAvailableVoices(): { id: string; name: string; language: string }[] {
  return [
    // 中文声音
    { id: "zh-CN-YunxiNeural", name: "云希 (男)", language: "zh-CN" },
    { id: "zh-CN-XiaoxiaoNeural", name: "晓晓 (女)", language: "zh-CN" },
    { id: "zh-CN-YunyangNeural", name: "云扬 (男)", language: "zh-CN" },
    { id: "zh-CN-XiaoyiNeural", name: "晓艺 (女)", language: "zh-CN" },
    { id: "zh-CN-YunjianNeural", name: "云健 (男)", language: "zh-CN" },
    // 英文声音
    { id: "en-US-GuyNeural", name: "Guy (Male)", language: "en-US" },
    { id: "en-US-JennyNeural", name: "Jenny (Female)", language: "en-US" },
    { id: "en-US-AriaNeural", name: "Aria (Female)", language: "en-US" },
  ];
}
