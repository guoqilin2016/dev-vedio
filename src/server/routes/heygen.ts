import { Router, Request, Response } from "express";
import { z } from "zod";
import path from "path";
import fs from "fs";
import {
  generateHeyGenVideo,
  generateBatchHeyGenVideos,
  getHeyGenAvatars,
} from "../services/heygen";

const router = Router();

// 请求验证 Schema
const GenerateRequestSchema = z.object({
  audioPath: z.string().optional(),
  audioUrl: z.string().url().optional(),
  text: z.string().optional(),
  config: z
    .object({
      apiKey: z.string().optional(),
      avatarId: z.string().optional(),
      voiceId: z.string().optional(),
    })
    .optional(),
  outputFileName: z.string().optional(),
});

const BatchGenerateRequestSchema = z.object({
  audioFiles: z.array(z.string().min(1)).min(1),
  config: z
    .object({
      apiKey: z.string().optional(),
      avatarId: z.string().optional(),
    })
    .optional(),
});

// POST /api/heygen - 生成单个数字人视频
router.post("/", async (req: Request, res: Response) => {
  try {
    const parseResult = GenerateRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: parseResult.error.errors,
      });
      return;
    }

    const { audioPath, audioUrl, text, config, outputFileName } = parseResult.data;

    // 如果提供了本地音频路径，检查文件是否存在
    let fullAudioPath: string | undefined;
    if (audioPath) {
      fullAudioPath = path.join(process.cwd(), "public", audioPath);
      if (!fs.existsSync(fullAudioPath)) {
        res.status(400).json({
          success: false,
          error: `Audio file not found: ${audioPath}`,
        });
        return;
      }
    }

    const result = await generateHeyGenVideo({
      audioPath: fullAudioPath,
      audioUrl,
      text,
      config: config || {},
      outputFileName,
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/heygen/batch - 批量生成数字人视频
router.post("/batch", async (req: Request, res: Response) => {
  try {
    const parseResult = BatchGenerateRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: parseResult.error.errors,
      });
      return;
    }

    const { audioFiles, config } = parseResult.data;

    // 转换为完整路径并检查文件是否存在
    const fullPaths: string[] = [];
    for (const audioFile of audioFiles) {
      const fullPath = path.join(process.cwd(), "public", audioFile);
      if (!fs.existsSync(fullPath)) {
        res.status(400).json({
          success: false,
          error: `Audio file not found: ${audioFile}`,
        });
        return;
      }
      fullPaths.push(fullPath);
    }

    const results = await generateBatchHeyGenVideos(fullPaths, config || {});

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/heygen/avatars - 获取可用头像列表
router.get("/avatars", async (req: Request, res: Response) => {
  const apiKey = (req.query.apiKey as string) || process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    res.status(400).json({
      success: false,
      error: "API Key required. Provide as query param or set HEYGEN_API_KEY env var.",
    });
    return;
  }

  try {
    const avatars = await getHeyGenAvatars(apiKey);
    res.json({
      success: true,
      avatars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/heygen/status - 检查 HeyGen API 配置状态
router.get("/status", (_req: Request, res: Response) => {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  res.json({
    configured: !!apiKey,
    message: apiKey 
      ? "HeyGen API is configured" 
      : "HeyGen API Key not set. Please set HEYGEN_API_KEY environment variable.",
    documentation: "https://docs.heygen.com/",
  });
});

export default router;
