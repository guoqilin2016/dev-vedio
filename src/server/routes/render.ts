import { Router, Request, Response } from "express";
import { RenderRequestSchema } from "../../shared/types";
import {
  renderVideo,
  getAvailableCompositions,
  clearBundleCache,
} from "../services/renderer";

const router = Router();

// POST /api/render - 渲染视频
router.post("/", async (req: Request, res: Response) => {
  try {
    // 验证请求参数
    const parseResult = RenderRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: parseResult.error.errors,
      });
      return;
    }

    const request = parseResult.data;

    // 检查 composition 是否存在
    const availableCompositions = await getAvailableCompositions();
    if (!availableCompositions.includes(request.compositionId)) {
      res.status(400).json({
        success: false,
        error: `Composition "${request.compositionId}" not found`,
        availableCompositions,
      });
      return;
    }

    // 渲染视频
    const result = await renderVideo(request);

    if (result.success) {
      res.json(result);
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

// GET /api/render/compositions - 获取可用的 composition 列表
router.get("/compositions", async (_req: Request, res: Response) => {
  try {
    const compositions = await getAvailableCompositions();
    res.json({
      success: true,
      compositions,
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

// POST /api/render/clear-cache - 清除 bundle 缓存
router.post("/clear-cache", (_req: Request, res: Response) => {
  clearBundleCache();
  res.json({
    success: true,
    message: "Bundle cache cleared",
  });
});

export default router;
