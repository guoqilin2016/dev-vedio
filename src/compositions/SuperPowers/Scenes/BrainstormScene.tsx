import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SuperPowersProps } from "../schema";
import { fadeInUp, chatBubbleIn, fadeIn, staggerDelay } from "../animations";

export const BrainstormScene: React.FC<SuperPowersProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  brainstormTitle,
  brainstormQuestions,
  brainstormResult,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const chatStart = Math.round(fps * 1);
  const designDocStart = Math.round(fps * 5);
  const designDocAnim = fadeInUp(frame, fps, designDocStart, 50);

  const resultStart = Math.round(durationInFrames * 0.75);
  const resultAnim = spring({
    frame: frame - resultStart,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, ${accentColor}0c 0%, transparent 50%)` }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 30,
          }}
        >
          <div style={{ fontSize: 20, color: accentColor, letterSpacing: 8, fontWeight: 700, marginBottom: 12 }}>
            STAGE 01-02
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: textColor, textShadow: `0 0 30px ${accentColor}33` }}>
            {brainstormTitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 24 }}>
          {brainstormQuestions.map((q, i) => {
            const anim = chatBubbleIn(frame, fps, chatStart + staggerDelay(i, 18));
            const isAI = i % 2 === 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isAI ? "flex-start" : "flex-end",
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px) scale(${anim.scale})`,
                }}
              >
                <div style={{ maxWidth: "85%", display: "flex", alignItems: "flex-start", gap: 12, flexDirection: isAI ? "row" : "row-reverse" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isAI ? `linear-gradient(135deg, ${accentColor}44, ${accentColor}22)` : `linear-gradient(135deg, ${highlightColor}44, ${highlightColor}22)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {isAI ? "🤖" : "👤"}
                  </div>
                  <div
                    style={{
                      padding: "16px 22px",
                      borderRadius: 18,
                      borderTopLeftRadius: isAI ? 4 : 18,
                      borderTopRightRadius: isAI ? 18 : 4,
                      background: isAI ? `${accentColor}12` : `${highlightColor}12`,
                      border: `1px solid ${isAI ? accentColor : highlightColor}22`,
                      fontSize: 30,
                      color: "#ddd",
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {q}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ opacity: designDocAnim.opacity, transform: `translateY(${designDocAnim.y}px)`, marginBottom: 24 }}>
          <div style={{ borderRadius: 16, border: `1px solid ${accentColor}22`, overflow: "hidden" }}>
            <div style={{ height: 34, background: `${accentColor}15`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📐</span>
              <span style={{ fontSize: 15, color: accentColor, fontWeight: 600 }}>design-doc.md</span>
            </div>
            <div style={{ padding: "14px 18px", background: "#0d0d1a" }}>
              {["## 需求分析", "- 核心功能: ...", "- 边界情况: ...", "## API 设计", "- POST /api/..."].map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 17,
                    fontFamily: "monospace",
                    color: line.startsWith("##") ? accentColor : "#777",
                    lineHeight: 2,
                    fontWeight: line.startsWith("##") ? 700 : 400,
                    opacity: fadeIn(frame, designDocStart + 5 + i * 4, 8),
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 42,
              fontWeight: 900,
              color: accentColor,
              opacity: interpolate(resultAnim, [0, 1], [0, 1]),
              transform: `scale(${interpolate(resultAnim, [0, 1], [0.8, 1])})`,
              padding: "16px 44px",
              borderRadius: 16,
              border: `2px solid ${accentColor}44`,
              background: `${accentColor}0a`,
              letterSpacing: 2,
              textShadow: `0 0 30px ${accentColor}44`,
            }}
          >
            {brainstormResult}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
