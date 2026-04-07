import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeIn, fadeInUp, scaleIn } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const CTAScene: React.FC<AgentSkillsProps> = ({
  ctaTitle,
  ctaBody,
  ctaSlogan,
  ctaTags,
  hookStarCount,
  hookRepoName,
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
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.97, 1]);

  const bodyFade = fadeInUp(frame, fps, 12);
  const sloganFade = fadeInUp(frame, fps, 22);
  const cardScale = scaleIn(frame, fps, 30);
  const tagsOpacity = fadeIn(frame, 40, 18);

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
          alignItems: "center",
          gap: 22,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 主标题 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.15,
            background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${accentColor}50`,
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px) scale(${titleScale})`,
            transformOrigin: "center center",
            ...textWrap,
          }}
        >
          {ctaTitle}
        </div>

        {/* 副标题 */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: textColor,
            textAlign: "center",
            opacity: bodyFade.opacity,
            transform: `translateY(${bodyFade.y}px)`,
            ...textWrap,
          }}
        >
          {ctaBody}
        </div>

        {/* 金句 */}
        <div
          style={{
            fontSize: 28,
            color: highlightColor,
            textAlign: "center",
            opacity: sloganFade.opacity,
            transform: `translateY(${sloganFade.y}px)`,
            ...textWrap,
          }}
        >
          {ctaSlogan}
        </div>

        {/* GitHub 卡片 */}
        <div
          style={{
            background: panelColor,
            border: `1px solid ${accentColor}`,
            borderRadius: 14,
            padding: 22,
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            marginTop: 16,
            transform: `scale(${cardScale})`,
            transformOrigin: "center center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>📦</span>
            <span style={{ color: accentColor, fontSize: 24, fontWeight: 700, ...textWrap }}>
              {hookRepoName}
            </span>
          </div>
          <div
            style={{
              color: highlightColor,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: 22,
              marginTop: 12,
              ...textWrap,
            }}
          >
            ⭐ {hookStarCount} Stars · 免费开源
          </div>
        </div>

        {/* Hashtags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            width: "100%",
            minWidth: 0,
            marginTop: 6,
            opacity: tagsOpacity,
          }}
        >
          {ctaTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              style={{
                background: panelColor,
                border: `1px solid ${mutedTextColor}40`,
                borderRadius: 16,
                padding: "5px 14px",
                fontSize: 18,
                color: mutedTextColor,
                boxSizing: "border-box",
                maxWidth: "100%",
                ...textWrap,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
