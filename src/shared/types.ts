import { z } from "zod";
import { VideoBriefSchema, type VideoBrief } from "./video-brief";
import { type PreflightIssue } from "./preflight-qa";
import {
  SafeAreaProfileSchema,
  SubtitleModeSchema,
  TemplateCapabilitySchema,
  VideoOutputSchema,
  VideoPlatformProfileSchema,
} from "./video-registry";

// 通用视频渲染请求
export interface RenderRequest {
  compositionId: string;
  inputProps: Record<string, unknown>;
  brief?: VideoBrief;
  outputFileName?: string;
}

// 渲染响应
export interface RenderResponse {
  success: boolean;
  outputPath?: string;
  error?: string;
  details?: PreflightIssue[];
  durationMs?: number;
}

export interface DiscoverableComposition {
  compositionId: string;
  stillId: string | null;
  templateType: string;
  aspectRatio: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  safeAreaProfile: z.infer<typeof SafeAreaProfileSchema>;
  subtitleMode: z.infer<typeof SubtitleModeSchema>;
  supports: z.infer<typeof TemplateCapabilitySchema>;
  output: z.infer<typeof VideoOutputSchema>;
  platformProfiles: {
    videoChannel: z.infer<typeof VideoPlatformProfileSchema>;
  };
}

export interface CompositionDiscoveryResponse {
  success: boolean;
  compositions: DiscoverableComposition[];
  error?: string;
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
  inputProps: z.record(z.string(), z.unknown()).default({}),
  brief: VideoBriefSchema.optional(),
  outputFileName: z.string().optional(),
});

export const DiscoverableCompositionSchema = z.object({
  compositionId: z.string().min(1),
  stillId: z.string().nullable(),
  templateType: z.string().min(1),
  aspectRatio: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  fps: z.number().int().positive(),
  durationInFrames: z.number().int().positive(),
  safeAreaProfile: SafeAreaProfileSchema,
  subtitleMode: SubtitleModeSchema,
  supports: TemplateCapabilitySchema,
  output: VideoOutputSchema,
  platformProfiles: z.object({
    videoChannel: VideoPlatformProfileSchema,
  }),
});

export const CompositionDiscoveryResponseSchema = z.object({
  success: z.boolean(),
  compositions: z.array(DiscoverableCompositionSchema),
  error: z.string().optional(),
});
