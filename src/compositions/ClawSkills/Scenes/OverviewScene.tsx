import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ClawSkillsProps } from "../schema";
import { fadeInUp, fadeIn, numberCountUp, pulseGlow, staggerDelay } from "../animations";

export const OverviewScene: React.FC<ClawSkillsProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  goldColor,
  overviewTitle,
  overviewSubtitle,
  overviewStats,
  categories,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const subtitleAnim = fadeInUp(frame, fps, 12, 40);

  const statsStart = Math.round(fps * 1.2);
  const catStart = Math.round(fps * 2.5);

  const totalCount = numberCountUp(frame, fps, overviewStats.totalSkills, 1.5, statsStart);
  const scoreDisplay = numberCountUp(frame, fps, 34, 1.5, statsStart);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${accentColor}12 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.y}px)`,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: accentColor,
            letterSpacing: 8,
            marginBottom: 16,
            fontWeight: 700,
          }}
        >
          CLAWHUB LEADERBOARD
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 900,
            color: textColor,
            lineHeight: 1.3,
            padding: "0 60px",
            textShadow: `0 0 40px ${accentColor}44`,
          }}
        >
          {overviewTitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtitleAnim.opacity,
          transform: `translateY(${subtitleAnim.y}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 22,
            color: goldColor,
            padding: "8px 28px",
            borderRadius: 30,
            border: `1px solid ${goldColor}44`,
            background: `${goldColor}0a`,
          }}
        >
          {overviewSubtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 400,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {[
          { value: totalCount.toString(), label: "技能总数", color: accentColor },
          { value: `${(scoreDisplay / 10).toFixed(1)}`, label: "最低评分", color: goldColor },
          { value: overviewStats.categories.toString(), label: "大类", color: highlightColor },
        ].map((stat, i) => {
          const anim = fadeInUp(frame, fps, statsStart + staggerDelay(i, 8), 30);
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: anim.opacity,
                transform: `translateY(${anim.y}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: stat.color,
                  fontFamily: "monospace",
                  textShadow: `0 0 20px ${stat.color}44`,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 18, color: "#888", marginTop: 8 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 600,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {categories.map((cat, i) => {
          const anim = fadeInUp(frame, fps, catStart + staggerDelay(i, 10), 30);
          return (
            <div
              key={i}
              style={{
                opacity: anim.opacity,
                transform: `translateY(${anim.y}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 24px",
                borderRadius: 16,
                background: `${cat.color}0a`,
                border: `1px solid ${cat.color}33`,
              }}
            >
              <span style={{ fontSize: 36 }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: textColor }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: 14, color: cat.color, letterSpacing: 2, marginTop: 4 }}>
                  {cat.tag} · {cat.skills.length} SKILLS
                </div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${cat.color}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 900,
                  color: cat.color,
                  fontFamily: "monospace",
                }}
              >
                {cat.skills.length}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 18,
          color: "#555",
          opacity: fadeIn(frame, catStart + 50, 20),
          letterSpacing: 2,
        }}
      >
        SCROLL FOR DETAILS ↓
      </div>
    </AbsoluteFill>
  );
};
