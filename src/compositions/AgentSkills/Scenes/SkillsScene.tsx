import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const SkillsScene: React.FC<AgentSkillsProps> = ({
  skillsTitle,
  skillsSubtitle,
  skillCategories,
  backgroundColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const subFade = fadeInUp(frame, fps, 8);

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
          gap: 16,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 标题 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            textAlign: "center",
            color: textColor,
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px)`,
            ...textWrap,
          }}
        >
          {skillsTitle}
        </div>

        <div
          style={{
            fontSize: 24,
            color: mutedTextColor,
            textAlign: "center",
            opacity: subFade.opacity,
            transform: `translateY(${subFade.y}px)`,
            marginBottom: 6,
            ...textWrap,
          }}
        >
          {skillsSubtitle}
        </div>

        {/* 6 大分类卡片 — 2列 × 3行 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 12,
          }}
        >
          {skillCategories.map((cat, index) => {
            const delay = staggerDelay(index, 10) + 12;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);
            const scale = interpolate(sp, [0, 1], [0.85, 1]);

            return (
              <div
                key={index}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${cat.color}40`,
                  background: panelColor,
                  padding: "16px 16px 14px",
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                {/* 阶段标签 */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{cat.icon}</span>
                  <div style={{ fontSize: 26, fontWeight: 900, color: cat.color, ...textWrap }}>
                    {cat.phase}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: 20,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: cat.color,
                      flexShrink: 0,
                    }}
                  >
                    ×{cat.skillCount}
                  </div>
                </div>

                {/* 技能列表 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {cat.skills.map((skill, si) => (
                    <div
                      key={si}
                      style={{
                        fontSize: 18,
                        color: mutedTextColor,
                        paddingLeft: 8,
                        borderLeft: `2px solid ${cat.color}40`,
                        ...textWrap,
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
