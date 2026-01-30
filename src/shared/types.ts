import { z } from "zod";

// 通用视频渲染请求
export interface RenderRequest {
  compositionId: string;
  inputProps: Record<string, unknown>;
  outputFileName?: string;
}

// 渲染响应
export interface RenderResponse {
  success: boolean;
  outputPath?: string;
  error?: string;
  durationMs?: number;
}

// 视频配置
export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}

// 默认视频配置
export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 150, // 5 seconds at 30fps
};

// Zod schema for validation
export const RenderRequestSchema = z.object({
  compositionId: z.string().min(1),
  inputProps: z.record(z.unknown()).default({}),
  outputFileName: z.string().optional(),
});
