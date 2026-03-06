import { Router, Request, Response } from "express";
import { z } from "zod";
import path from "path";
import fs from "fs";
import {
  generateDigitalHumanVideo,
  generateBatchDigitalHumanVideos,
} from "../services/digital-human";

const router = Router();

// 请求验证 Schema
const GenerateRequestSchema = z.object({
  audioPath: z.string().min(1),
  config: z
    .object({
      apiKey: z.string().optional(),
      sourceImageUrl: z.string().url().optional(),
    })
    .optional(),
  outputFileName: z.string().optional(),
});

const BatchGenerateRequestSchema = z.object({
  audioFiles: z.array(z.string().min(1)).min(1),
  config: z
    .object({
      apiKey: z.string().optional(),
      sourceImageUrl: z.string().url().optional(),
    })
    .optional(),
});

// POST /api/digital-human - 生成单个数字人视频
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

    const { audioPath, config, outputFileName } = parseResult.data;

    // 检查音频文件是否存在
    const fullAudioPath = path.join(process.cwd(), "public", audioPath);
    if (!fs.existsSync(fullAudioPath)) {
      res.status(400).json({
        success: false,
        error: `Audio file not found: ${audioPath}`,
      });
      return;
    }

    const result = await generateDigitalHumanVideo({
      audioPath: fullAudioPath,
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

// POST /api/digital-human/batch - 批量生成数字人视频
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

    const results = await generateBatchDigitalHumanVideos(
      fullPaths,
      config || {}
    );

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

// GET /api/digital-human/status - 检查 D-ID API 配置状态
router.get("/status", (_req: Request, res: Response) => {
  const apiKey = process.env.DID_API_KEY;
  
  res.json({
    configured: !!apiKey,
    message: apiKey 
      ? "D-ID API is configured" 
      : "D-ID API Key not set. Please set DID_API_KEY environment variable.",
    documentation: "https://docs.d-id.com/",
  });
});

export default router;
