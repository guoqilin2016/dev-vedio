import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TextPresentationProps } from "../schema";
import { fadeIn, fadeInUp } from "./animations";

export const PainPointScene: React.FC<TextPresentationProps> = ({
  backgroundColor,
  painPointIcon,
  accentColor,
  painPointTitle,
  textColor,
  painPointContent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0;
  
  const anim1 = fadeInUp(frame, startFrame, fps);
  const anim2 = fadeInUp(frame, startFrame, fps, 15);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #2d1f3d 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        flexDirection: "column",
        padding: 80,
      }}
    >
      {/* 警告图标 */}
      <div
        style={{
          fontSize: 100,
          opacity: anim1.opacity,
          transform: `translateY(${anim1.y}px) scale(${interpolate(
            spring({
              frame: frame - startFrame,
              fps,
              config: { damping: 10, stiffness: 100 },
            }),
            [0, 1],
            [0.5, 1]
          )})`,
        }}
      >
        {painPointIcon}
      </div>

      {/* 标题 */}
      <h2
        style={{
          fontSize: 64,
          fontWeight: "bold",
          color: accentColor,
          margin: "30px 0 0 0",
          opacity: anim1.opacity,
          transform: `translateY(${anim1.y}px)`,
        }}
      >
        {painPointTitle}
      </h2>

      {/* 痛点描述 */}
      <div
        style={{
          fontSize: 36,
          color: textColor,
          marginTop: 40,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.8,
          opacity: anim2.opacity,
          transform: `translateY(${anim2.y}px)`,
        }}
      >
        {painPointContent}
      </div>

      {/* 痛苦的Word界面示意 */}
      <div
        style={{
          marginTop: 50,
          width: 400,
          height: 250,
          background: "#2a2a3a",
          borderRadius: 8,
          padding: 20,
          opacity: fadeIn(frame, startFrame, 30),
          border: "2px solid #444",
        }}
      >
        <div style={{ color: "#666", fontSize: 16, marginBottom: 10 }}>
          Word文档
        </div>
        <div style={{ color: "#444", fontSize: 18, lineHeight: 2 }}>
          █<br />
          █<br />█
        </div>
        <div
          style={{
            color: accentColor,
            fontSize: 24,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          | 光标闪烁...
        </div>
      </div>
    </AbsoluteFill>
  );
};
