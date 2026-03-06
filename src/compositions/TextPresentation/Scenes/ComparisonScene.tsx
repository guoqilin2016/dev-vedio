import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TextPresentationProps } from "../schema";
import { fadeIn, fadeInUp } from "./animations";

export const ComparisonScene: React.FC<TextPresentationProps> = ({
  backgroundColor,
  vsLeftIcon,
  vsLeftText,
  accentColor,
  vsRightIcon,
  highlightColor,
  vsRightText,
  textColor,
  mainPoint,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0; // Relative to scene start
  
  const anim2 = fadeInUp(frame, startFrame, fps, 20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 100,
      }}
    >
      {/* 左边 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: `translateY(-50%) translateX(${interpolate(
            fadeIn(frame, startFrame),
            [0, 1],
            [-100, 0]
          )}px)`,
          opacity: fadeIn(frame, startFrame),
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{vsLeftIcon}</div>
        <div style={{ fontSize: 36, color: "#888", fontWeight: "bold" }}>
          {vsLeftText}
        </div>
      </div>

      {/* VS 标记 */}
      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: accentColor,
          opacity: fadeIn(frame, startFrame, 15),
        }}
      >
        VS
      </div>

      {/* 右边 */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: `translateY(-50%) translateX(${interpolate(
            fadeIn(frame, startFrame, 10),
            [0, 1],
            [100, 0]
          )}px)`,
          opacity: fadeIn(frame, startFrame, 10),
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{vsRightIcon}</div>
        <div
          style={{ fontSize: 36, color: highlightColor, fontWeight: "bold" }}
        >
          {vsRightText}
        </div>
      </div>

      {/* 核心观点文字 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${anim2.y}px)`,
          opacity: anim2.opacity,
          fontSize: 28,
          color: textColor,
          textAlign: "center",
          maxWidth: 1000,
          lineHeight: 1.6,
        }}
      >
        {mainPoint}
      </div>
    </AbsoluteFill>
  );
};
