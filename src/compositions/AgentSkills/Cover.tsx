import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import type { AgentSkillsProps } from "./schema";

export const AgentSkillsCover: React.FC<AgentSkillsProps> = ({
  coverLabel,
  coverTitle,
  coverSubtitle,
  coverMetrics,
  backgroundColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <SceneBackground
        backgroundColor={backgroundColor}
        accentColor={accentColor}
        particles={{ count: 30, color: accentColor }}
        hud={{ color: highlightColor, animation: "static" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "60px 60px",
            gap: 24,
          }}
        >
          {/* 主标题 — 第一视觉层级 */}
          <div
            style={{
              fontSize: 80,
              letterSpacing: 12,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.1,
              background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 0 60px ${accentColor}50, 0 0 120px ${highlightColor}30`,
            }}
          >
            {coverLabel}
          </div>

          {/* 核心 emoji */}
          <div style={{ fontSize: 80 }}>⚙️</div>

          {/* 核心数字 */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              fontFamily: "monospace",
              color: highlightColor,
              textShadow: `0 0 30px ${highlightColor}60`,
            }}
          >
            {coverMetrics[0]}
          </div>

          {/* 大字标题 */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              textAlign: "center",
              background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 0 40px ${highlightColor}40`,
              lineHeight: 1.2,
            }}
          >
            {coverTitle}
          </div>

          {/* 副标题 */}
          <div
            style={{
              fontSize: 42,
              color: highlightColor,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {coverSubtitle}
          </div>

          {/* 底部信息条 */}
          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "12px 24px",
              border: `1px solid ${mutedTextColor}40`,
              borderRadius: 12,
              backgroundColor: panelColor,
            }}
          >
            {coverMetrics.map((metric, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ color: mutedTextColor }}>|</div>}
                <div style={{ color: mutedTextColor, fontSize: 18, fontWeight: 600 }}>
                  {metric}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </SceneBackground>
    </AbsoluteFill>
  );
};
