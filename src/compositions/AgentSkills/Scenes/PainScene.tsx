import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const PainScene: React.FC<AgentSkillsProps> = ({
  painTitle,
  painPoints,
  painQuote,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  dangerColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const quoteFade = fadeInUp(frame, fps, 50);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          right: 60,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 标题 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            textAlign: "center",
            background: `linear-gradient(135deg, ${dangerColor}, #ff6b6b)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${dangerColor}40`,
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px)`,
            ...textWrap,
          }}
        >
          {painTitle}
        </div>

        {/* 痛点列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {painPoints.map((point, index) => {
            const delay = staggerDelay(index, 10) + 8;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);
            const x = interpolate(sp, [0, 1], [-40, 0]);

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: `1px solid ${dangerColor}30`,
                  background: panelColor,
                  opacity,
                  transform: `translateX(${x}px)`,
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{point.icon}</span>
                <div style={{ flex: "1 1 0", minWidth: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: dangerColor, ...textWrap }}>
                    {point.title}
                  </div>
                  <div style={{ fontSize: 22, color: mutedTextColor, marginTop: 4, ...textWrap }}>
                    {point.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 痛点金句 */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            textAlign: "center",
            color: textColor,
            opacity: quoteFade.opacity,
            transform: `translateY(${quoteFade.y}px)`,
            padding: "14px 20px",
            borderRadius: 12,
            border: `1px solid ${dangerColor}40`,
            background: `${dangerColor}10`,
            ...textWrap,
          }}
        >
          {painQuote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
