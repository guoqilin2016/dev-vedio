import { Router, Request, Response } from "express";
import { z } from "zod";
import { generateTTS, generateBatchTTS, getAvailableVoices } from "../services/tts";

const router = Router();

// 请求验证 Schema
const TTSRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  outputFileName: z.string().optional(),
  config: z
    .object({
      provider: z.enum(["edge-tts", "openai", "azure", "custom"]).optional(),
      voice: z.string().optional(),
      rate: z.number().min(0.5).max(2.0).optional(),
      pitch: z.number().min(0.5).max(2.0).optional(),
      apiKey: z.string().optional(),
      apiEndpoint: z.string().optional(),
    })
    .optional(),
});

const BatchTTSRequestSchema = z.object({
  requests: z.array(TTSRequestSchema).min(1).max(20),
});

// POST /api/tts - 生成单个 TTS
router.post("/", async (req: Request, res: Response) => {
  try {
    const parseResult = TTSRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: parseResult.error.errors,
      });
      return;
    }

    const result = await generateTTS(parseResult.data);

    if (result.success) {
      res.json({
        ...result,
        // 返回相对路径供前端使用
        audioUrl: result.audioPath
          ? `/audio/${result.audioPath.split("/").pop()}`
          : undefined,
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// POST /api/tts/batch - 批量生成 TTS
router.post("/batch", async (req: Request, res: Response) => {
  try {
    const parseResult = BatchTTSRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: parseResult.error.errors,
      });
      return;
    }

    const results = await generateBatchTTS(parseResult.data.requests);

    res.json({
      success: true,
      results: results.map((r) => ({
        ...r,
        audioUrl: r.audioPath
          ? `/audio/${r.audioPath.split("/").pop()}`
          : undefined,
      })),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// GET /api/tts/voices - 获取可用声音列表
router.get("/voices", (_req: Request, res: Response) => {
  res.json({
    success: true,
    voices: getAvailableVoices(),
  });
});

export default router;
