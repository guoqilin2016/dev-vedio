import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { glitchOffset, fadeInUp, pulseGlow, numberCountUp } from "../animations";

export const HookScene: React.FC<PuaSkillProps> = ({
  hookLine1,
  hookLine2,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  githubStars,
  githubForks,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitch = glitchOffset(frame, 1.5);
  const glow = pulseGlow(frame, fps, 3);
  const coverPhase = frame < 3;

  const logoAnim = spring({
    frame,
    fps,
    config: { damping: 6, stiffness: 200 },
  });

  const line2Anim = fadeInUp(frame, fps, Math.round(fps * 1.2), 60);

  const statsStart = Math.round(fps * 1.8);
  const starCount = numberCountUp(frame, fps, githubStars / 1000, 1.8, statsStart);
  const forkCount = numberCountUp(frame, fps, githubForks, 1.8, statsStart + 8);
  const statsAnim = fadeInUp(frame, fps, statsStart, 40);

  const borderPulse = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

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
          background: `radial-gradient(ellipse at 50% 40%, ${accentColor}22 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${accentColor}04 2px, ${accentColor}04 4px)`,
          pointerEvents: "none",
        }}
      />

      {[
        { top: 40, left: 40 },
        { top: 40, right: 40 },
        { bottom: 40, left: 40 },
        { bottom: 40, right: 40 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 60,
            height: 60,
            opacity: coverPhase ? 0.6 : interpolate(borderPulse, [0, 1], [0.3, 0.6]),
            borderTop: i < 2 ? `2px solid ${accentColor}` : "none",
            borderBottom: i >= 2 ? `2px solid ${accentColor}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${accentColor}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${accentColor}` : "none",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            fontSize: 140,
            opacity: coverPhase ? 1 : interpolate(logoAnim, [0, 1], [0.8, 1]),
            transform: coverPhase
              ? "scale(1)"
              : `scale(${interpolate(logoAnim, [0, 1], [0.9, 1])})`,
            marginBottom: 10,
            filter: `drop-shadow(0 0 50px ${accentColor}aa)`,
          }}
        >
          😤
        </div>

        <div
          style={{
            fontSize: 28,
            color: accentColor,
            letterSpacing: 18,
            fontWeight: 800,
            opacity: 1,
            marginBottom: 50,
            textShadow: `0 0 30px ${accentColor}88`,
          }}
        >
          PUA SKILL
        </div>

        <div
          style={{
            position: "relative",
            transform: frame > 10
              ? `translateX(${glitch.x}px) skewX(${glitch.skew}deg)`
              : undefined,
            opacity: 1,
          }}
        >
          {frame > 10 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                fontSize: 66,
                fontWeight: 900,
                color: accentColor,
                textAlign: "center",
                transform: `translateX(${glitch.x > 0 ? 3 : -3}px)`,
                opacity: Math.abs(glitch.x) > 1 ? 0.7 : 0,
                mixBlendMode: "screen",
              }}
            >
              {hookLine1}
            </div>
          )}
          <div
            style={{
              fontSize: 66,
              fontWeight: 900,
              color: textColor,
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: `0 0 ${20 + glow * 20}px ${accentColor}88`,
            }}
          >
            {hookLine1}
          </div>
        </div>

        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: highlightColor,
            textAlign: "center",
            marginTop: 40,
            lineHeight: 1.4,
            opacity: coverPhase ? 1 : line2Anim.opacity,
            transform: coverPhase ? undefined : `translateY(${line2Anim.y}px)`,
            textShadow: `0 0 30px ${highlightColor}66`,
          }}
        >
          {hookLine2}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 80,
            marginTop: 60,
            opacity: coverPhase ? 1 : statsAnim.opacity,
            transform: coverPhase ? undefined : `translateY(${statsAnim.y}px)`,
          }}
        >
          {[
            { value: coverPhase ? "7.4k+" : `${(starCount / 10).toFixed(1)}k+`, label: "Stars", icon: "⭐", color: "#fbbf24" },
            { value: coverPhase ? "342" : `${forkCount}`, label: "Forks", icon: "🔱", color: highlightColor },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: stat.color,
                  fontFamily: "monospace",
                  textShadow: `0 0 25px ${stat.color}44`,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 22, color: "#666", marginTop: 4, letterSpacing: 3 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 20,
            color: "#555",
            letterSpacing: 4,
            opacity: coverPhase ? 1 : fadeInUp(frame, fps, Math.round(fps * 2.5), 30).opacity,
          }}
        >
          5天现象级 · github.com/tanweai/pua
        </div>
      </div>
    </AbsoluteFill>
  );
};
