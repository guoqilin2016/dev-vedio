import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const AntiRatScene: React.FC<AgentSkillsProps> = ({
  antiRatTitle,
  antiRatSubtitle,
  excuseRebuttals,
  antiRatQuote,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  dangerColor,
  secondaryColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const subFade = fadeInUp(frame, fps, 8);
  const quoteFade = fadeInUp(frame, fps, 60);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 50,
          right: 50,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 标题 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            textAlign: "center",
            background: `linear-gradient(135deg, ${dangerColor}, ${secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px)`,
            ...textWrap,
          }}
        >
          {antiRatTitle}
        </div>

        <div
          style={{
            fontSize: 24,
            color: mutedTextColor,
            textAlign: "center",
            opacity: subFade.opacity,
            transform: `translateY(${subFade.y}px)`,
            ...textWrap,
          }}
        >
          {antiRatSubtitle}
        </div>

        {/* 借口 vs 反驳 卡片 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {excuseRebuttals.map((item, index) => {
            const delay = staggerDelay(index, 12) + 14;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);
            const scale = interpolate(sp, [0, 1], [0.9, 1]);

            return (
              <div
                key={index}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${highlightColor}30`,
                  background: panelColor,
                  padding: "16px 20px",
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  minWidth: 0,
                }}
              >
                {/* 借口 */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: `${dangerColor}20`,
                      color: dangerColor,
                      fontSize: 16,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    AI 说
                  </div>
                  <div style={{ fontSize: 24, color: textColor, fontWeight: 600, flex: "1 1 0", minWidth: 0, ...textWrap }}>
                    「{item.excuse}」
                  </div>
                </div>
                {/* 反驳 */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div
                    style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: `${highlightColor}20`,
                      color: highlightColor,
                      fontSize: 16,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {item.ruleName}
                  </div>
                  <div style={{ fontSize: 22, color: highlightColor, fontWeight: 700, flex: "1 1 0", minWidth: 0, ...textWrap }}>
                    {item.rebuttal}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部金句 */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
            color: secondaryColor,
            opacity: quoteFade.opacity,
            transform: `translateY(${quoteFade.y}px)`,
            ...textWrap,
          }}
        >
          {antiRatQuote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
