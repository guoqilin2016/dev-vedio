import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { fadeInUp, fadeIn, pulseGlow, shakeEffect } from "../animations";

export const PressureScene: React.FC<PuaSkillProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  pressureLevels,
  pressureTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);

  const levelInterval = Math.round(fps * 2.5);
  const levelsStart = Math.round(fps * 1.2);

  const currentLevelIndex = Math.min(
    pressureLevels.length - 1,
    Math.floor(Math.max(0, frame - levelsStart) / levelInterval)
  );

  const dangerIntensity = interpolate(
    currentLevelIndex,
    [0, pressureLevels.length - 1],
    [0.05, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const shake = currentLevelIndex >= 2 ? shakeEffect(frame, currentLevelIndex * 0.3) : { x: 0, y: 0 };

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
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}${Math.round(dangerIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
          transform: `translate(${shake.x}px, ${shake.y}px)`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 20, color: accentColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            PRESSURE ESCALATION
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: textColor, textShadow: `0 0 40px ${accentColor}44` }}>
            {pressureTitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pressureLevels.map((level, i) => {
            const levelDelay = levelsStart + i * levelInterval;
            const isReached = frame >= levelDelay;
            const isCurrent = i === currentLevelIndex && isReached;

            const levelAnim = spring({
              frame: frame - levelDelay,
              fps,
              config: { damping: 14, stiffness: 180 },
            });

            const pulseActive = isCurrent ? 1 + Math.sin(frame / fps * Math.PI * 4) * 0.02 : 1;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 18,
                  background: isCurrent
                    ? `${level.color}15`
                    : isReached
                      ? `${level.color}08`
                      : "rgba(255,255,255,0.02)",
                  border: `2px solid ${isReached ? `${level.color}66` : "rgba(255,255,255,0.05)"}`,
                  opacity: interpolate(levelAnim, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(levelAnim, [0, 1], [0.8, pulseActive])})`,
                  boxShadow: isCurrent ? `0 0 30px ${level.color}22` : "none",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: isReached
                      ? `linear-gradient(135deg, ${level.color}55, ${level.color}22)`
                      : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 900, color: isReached ? "#fff" : "#555", fontFamily: "monospace" }}>
                    {level.level}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: isReached ? level.color : "#555" }}>
                    {level.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: isReached ? "#ddd" : "#444",
                      marginTop: 4,
                      fontStyle: "italic",
                      opacity: fadeIn(frame, levelDelay + 10, 12),
                    }}
                  >
                    「{level.rhetoric}」
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      color: level.color,
                      marginTop: 6,
                      opacity: fadeIn(frame, levelDelay + 18, 10),
                      fontWeight: 600,
                    }}
                  >
                    → {level.action}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              opacity: fadeIn(frame, levelsStart + levelInterval * 3 + 15, 15),
            }}
          >
            {pressureLevels.map((level, i) => (
              <div
                key={i}
                style={{
                  width: interpolate(i, [0, 3], [60, 140]),
                  height: 6,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
                  boxShadow: `0 0 8px ${level.color}44`,
                  opacity: 0.5 + glow * 0.3,
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#666",
              letterSpacing: 6,
              marginTop: 12,
              opacity: fadeIn(frame, levelsStart + levelInterval * 3 + 20, 15),
            }}
          >
            PRESSURE LEVEL ▸▸▸▸
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
