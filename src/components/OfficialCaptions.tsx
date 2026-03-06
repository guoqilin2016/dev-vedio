/**
 * 官方字幕组件 - 基于 @remotion/captions
 * 使用 TikTok 风格分页和词高亮
 */
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  useDelayRender,
  spring,
  interpolate,
} from "remotion";
import type { Caption, TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";

// ============ 类型定义 ============

interface OfficialCaptionsProps {
  /** 字幕 JSON 文件路径（放在 public 目录下） */
  captionsFile?: string;
  /** 或直接传入 Caption 数组 */
  captions?: Caption[];
  /** 字幕切换间隔（毫秒），越大每页显示越多词 */
  switchEveryMs?: number;
  /** 字体大小 */
  fontSize?: number;
  /** 普通文字颜色 */
  textColor?: string;
  /** 高亮文字颜色 */
  highlightColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 位置 */
  position?: "top" | "center" | "bottom";
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// ============ 词高亮组件 ============

interface CaptionPageProps {
  page: TikTokPage;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  backgroundColor: string;
}

const CaptionPage: React.FC<CaptionPageProps> = ({
  page,
  fontSize,
  textColor,
  highlightColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 当前时间（相对于 Sequence 开始）
  const currentTimeMs = (frame / fps) * 1000;
  // 转换为绝对时间
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <div
      style={{
        backgroundColor,
        padding: "16px 32px",
        borderRadius: 12,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 4,
        maxWidth: "90%",
      }}
    >
      {page.tokens.map((token, index) => {
        const isActive =
          token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
        const isPast = absoluteTimeMs >= token.toMs;

        // 基于帧的 spring 动画
        const tokenFrame = Math.max(
          0,
          (absoluteTimeMs - token.fromMs) / 1000 * fps
        );
        const scaleSpring = spring({
          frame: tokenFrame,
          fps,
          config: { damping: 20, stiffness: 200 },
        });

        const scale = isActive
          ? interpolate(scaleSpring, [0, 1], [1, 1.1], {
              extrapolateRight: "clamp",
            })
          : 1;

        return (
          <span
            key={`${token.fromMs}-${index}`}
            style={{
              fontSize,
              fontWeight: "bold",
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: isActive || isPast ? highlightColor : textColor,
              textShadow: isActive
                ? `0 0 20px ${highlightColor}`
                : "0 2px 4px rgba(0,0,0,0.5)",
              transform: `scale(${scale})`,
              whiteSpace: "pre", // 保留空格
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};

// ============ 主字幕组件 ============

export const OfficialCaptions: React.FC<OfficialCaptionsProps> = ({
  captionsFile,
  captions: propCaptions,
  switchEveryMs = 1200,
  fontSize = 42,
  textColor = "#ffffff",
  highlightColor = "#ffd700",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  position = "bottom",
  style,
}) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(
    propCaptions || null
  );
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => (captionsFile ? delayRender() : null));

  // 如果提供了文件路径，异步加载字幕
  const fetchCaptions = useCallback(async () => {
    if (!captionsFile || !handle) return;

    try {
      const response = await fetch(staticFile(captionsFile));
      const data = await response.json();
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [captionsFile, handle, continueRender, cancelRender]);

  useEffect(() => {
    if (captionsFile) {
      fetchCaptions();
    }
  }, [captionsFile, fetchCaptions]);

  // 使用 propCaptions 更新
  useEffect(() => {
    if (propCaptions) {
      setCaptions(propCaptions);
    }
  }, [propCaptions]);

  // 创建 TikTok 风格分页
  const pages = useMemo(() => {
    if (!captions) return [];

    const { pages: tikTokPages } = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: switchEveryMs,
    });

    return tikTokPages;
  }, [captions, switchEveryMs]);

  // 计算位置样式
  const positionStyle: React.CSSProperties = {
    top: position === "top" ? 80 : position === "center" ? "50%" : undefined,
    bottom: position === "bottom" ? 80 : undefined,
    transform: position === "center" ? "translateY(-50%)" : undefined,
  };

  if (!captions || pages.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        ...positionStyle,
        ...style,
      }}
    >
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (switchEveryMs / 1000) * fps
        );
        const durationInFrames = Math.round(endFrame - startFrame);

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={durationInFrames}
          >
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: "0 40px",
              }}
            >
              <CaptionPage
                page={page}
                fontSize={fontSize}
                textColor={textColor}
                highlightColor={highlightColor}
                backgroundColor={backgroundColor}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ============ 工具函数 ============

/**
 * 将 frame-based 的字幕数据转换为官方 Caption 格式
 */
export function convertFramesToCaptions(
  lines: Array<{
    words: Array<{ text: string; startFrame: number; endFrame: number }>;
    startFrame: number;
    endFrame: number;
  }>,
  fps: number
): Caption[] {
  const captions: Caption[] = [];

  for (const line of lines) {
    for (const word of line.words) {
      captions.push({
        text: word.text,
        startMs: (word.startFrame / fps) * 1000,
        endMs: (word.endFrame / fps) * 1000,
        timestampMs: (word.startFrame / fps) * 1000,
        confidence: 1,
      });
    }
  }

  return captions;
}

/**
 * 从脚本文本和时间信息生成 Caption 数组
 */
export function generateCaptionsFromScript(
  text: string,
  startMs: number,
  durationMs: number
): Caption[] {
  // 按字符分割（中文），或按空格分割（英文）
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  const words = isChinese
    ? text.split("").filter((c) => c.trim())
    : text.split(/\s+/).filter((w) => w.length > 0);

  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  const captions: Caption[] = [];

  let currentMs = startMs;

  for (const word of words) {
    const wordDuration = Math.round((word.length / totalChars) * durationMs);

    captions.push({
      text: isChinese ? word : ` ${word}`, // 英文前加空格
      startMs: currentMs,
      endMs: currentMs + wordDuration,
      timestampMs: currentMs,
      confidence: 1,
    });

    currentMs += wordDuration;
  }

  return captions;
}

export default OfficialCaptions;
