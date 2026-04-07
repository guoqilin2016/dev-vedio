import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, numberCountUp } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

const parseStarTarget = (s: string): number => {
  const n = parseInt(s.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 4600;
};

export const HookScene: React.FC<AgentSkillsProps> = ({
  hookTitle,
  hookStarCount,
  hookSubtitle,
  hookRepoName,
  hookRepoDesc,
  hookAuthor,
  hookAuthorTitle,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coverPhase = frame < 5;

  const targetStars = parseStarTarget(hookStarCount);
  const animatedCount = numberCountUp(frame, fps, targetStars, 2, 5);
  const starLabel = coverPhase
    ? `${hookStarCount} Stars`
    : `${animatedCount.toLocaleString("en-US")}+ Stars`;

  const starSpring = spring({
    frame: coverPhase ? 24 : frame - 5,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  const starScale = coverPhase ? 1 : interpolate(starSpring, [0, 1], [0.94, 1]);

  const repoFade = fadeInUp(frame, fps, 8);
  const authorFade = fadeInUp(frame, fps, 18);
  const subFade = fadeInUp(frame, fps, 28);
  const badgeFade = fadeInUp(frame, fps, 36);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 60,
          right: 60,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 主标题 — 第一视觉层级 */}
        <div
          style={{
            fontSize: 72,
            letterSpacing: 10,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 60px ${accentColor}50, 0 0 120px ${highlightColor}30`,
            ...textWrap,
          }}
        >
          {hookTitle}
        </div>

        {/* Star 数字 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            color: highlightColor,
            textShadow: `0 0 30px ${highlightColor}45`,
            transform: `scale(${starScale})`,
            transformOrigin: "center center",
            ...textWrap,
            textAlign: "center",
            marginTop: -6,
          }}
        >
          {starLabel}
        </div>

        {/* GitHub 仓库卡片 */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 14,
            border: `1px solid ${accentColor}60`,
            background: panelColor,
            padding: "22px 24px",
            boxSizing: "border-box",
            opacity: repoFade.opacity,
            transform: `translateY(${repoFade.y}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>📦</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: accentColor, ...textWrap }}>
              {hookRepoName}
            </span>
          </div>
          <div style={{ fontSize: 22, color: textColor, marginBottom: 14, ...textWrap }}>
            {hookRepoDesc}
          </div>
          <div style={{ fontSize: 18, color: mutedTextColor, ...textWrap }}>
            ⭐ {hookStarCount} | 🍴 482 Forks | 📄 MIT License
          </div>
        </div>

        {/* 作者身份 */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 12,
            border: `1px solid ${highlightColor}40`,
            background: panelColor,
            padding: "16px 20px",
            boxSizing: "border-box",
            opacity: authorFade.opacity,
            transform: `translateY(${authorFade.y}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: textColor, ...textWrap }}>
              {hookAuthor}
            </div>
            <div style={{ fontSize: 20, color: mutedTextColor, ...textWrap }}>
              {hookAuthorTitle}
            </div>
          </div>
        </div>

        {/* 副标题 */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            textAlign: "center",
            background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${accentColor}30`,
            opacity: subFade.opacity,
            transform: `translateY(${subFade.y}px)`,
            ...textWrap,
          }}
        >
          {hookSubtitle}
        </div>

        {/* 19 Skills + 7 Commands 标签 */}
        <div
          style={{
            display: "flex",
            gap: 16,
            opacity: badgeFade.opacity,
            transform: `translateY(${badgeFade.y}px)`,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["19 Skills", "7 Commands", "Google Engineering"].map((label, i) => (
            <div
              key={label}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: `1px solid ${[accentColor, highlightColor, "#FBBC04"][i]}60`,
                background: `${[accentColor, highlightColor, "#FBBC04"][i]}15`,
                color: [accentColor, highlightColor, "#FBBC04"][i],
                fontSize: 20,
                fontWeight: 700,
                ...textWrap,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
