import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const AnatomyScene: React.FC<AgentSkillsProps> = ({
  anatomyTitle,
  anatomySubtitle,
  skillStructure,
  googlePrinciples,
  platforms,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const subFade = fadeInUp(frame, fps, 8);
  const principleTitleFade = fadeInUp(frame, fps, 50);
  const platformFade = fadeInUp(frame, fps, 70);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 50,
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
            fontSize: 48,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            color: highlightColor,
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px)`,
            ...textWrap,
          }}
        >
          {anatomyTitle}
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
          {anatomySubtitle}
        </div>

        {/* SKILL.md 结构展示 — 模拟代码编辑器 */}
        <div
          style={{
            borderRadius: 14,
            border: `1px solid ${accentColor}40`,
            background: "rgba(0,0,0,0.4)",
            padding: "16px 20px",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 16, color: mutedTextColor, marginBottom: 10, letterSpacing: 2 }}>
            SKILL.md
          </div>
          {skillStructure.map((item, index) => {
            const delay = staggerDelay(index, 6) + 14;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 180, mass: 0.4 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);

            const sectionColors = [accentColor, highlightColor, "#FBBC04", "#EA4335", accentColor, highlightColor];

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: index < skillStructure.length - 1 ? `1px solid rgba(255,255,255,0.06)` : "none",
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: sectionColors[index % sectionColors.length],
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "ui-monospace, SFMono-Regular, monospace",
                    color: sectionColors[index % sectionColors.length],
                    ...textWrap,
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>

        {/* Google 工程文化原则 */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: textColor,
            textAlign: "center",
            opacity: principleTitleFade.opacity,
            transform: `translateY(${principleTitleFade.y}px)`,
            ...textWrap,
          }}
        >
          Google 工程文化
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 10,
          }}
        >
          {googlePrinciples.map((p, index) => {
            const delay = staggerDelay(index, 8) + 54;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);

            return (
              <div
                key={index}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${p.color}40`,
                  background: `${p.color}10`,
                  padding: "12px 14px",
                  opacity,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: p.color, ...textWrap }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 16, color: mutedTextColor, marginTop: 2, ...textWrap }}>
                  {p.nameEn} · {p.area}
                </div>
              </div>
            );
          })}
        </div>

        {/* 平台支持 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            opacity: platformFade.opacity,
            transform: `translateY(${platformFade.y}px)`,
          }}
        >
          {platforms.map((plat, index) => (
            <div
              key={index}
              style={{
                padding: "6px 14px",
                borderRadius: 16,
                border: `1px solid ${plat.color}50`,
                background: `${plat.color}10`,
                color: plat.color,
                fontSize: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{plat.icon}</span>
              {plat.name}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
