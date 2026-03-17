import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { fadeInUp, pressureReveal, pulseGlow } from "../animations";

export const ThreeRulesScene: React.FC<PuaSkillProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  ironRules,
  ironRulesTitle,
  ironRulesSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const subtitleAnim = fadeInUp(frame, fps, 10, 40);
  const rulesStart = Math.round(fps * 1.2);
  const glow = pulseGlow(frame, fps, 2);

  const sloganStart = Math.round(durationInFrames * 0.75);
  const sloganAnim = spring({
    frame: frame - sloganStart,
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${accentColor}0c 0%, transparent 50%)` }} />

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
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 20, color: accentColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            IRON RULES
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: textColor, textShadow: `0 0 40px ${accentColor}44` }}>
            {ironRulesTitle}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.y}px)`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 26,
              color: "#999",
              padding: "10px 30px",
              borderRadius: 20,
              border: `1px solid ${accentColor}22`,
              background: `${accentColor}08`,
            }}
          >
            {ironRulesSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {ironRules.map((rule, i) => {
            const nodeAnim = pressureReveal(frame, fps, i, rulesStart);
            const isActive = frame > rulesStart + i * 18 + 15;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "28px 28px",
                  borderRadius: 20,
                  background: isActive
                    ? `linear-gradient(135deg, ${rule.color}12, ${rule.color}06)`
                    : "rgba(255,255,255,0.02)",
                  border: `2px solid ${isActive ? `${rule.color}55` : "rgba(255,255,255,0.05)"}`,
                  opacity: nodeAnim.opacity,
                  transform: `translateY(${nodeAnim.y}px) scale(${nodeAnim.scale})`,
                  boxShadow: isActive ? `0 0 30px ${rule.color}15` : "none",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: isActive
                      ? `linear-gradient(135deg, ${rule.color}44, ${rule.color}22)`
                      : `${rule.color}11`,
                    border: `2px solid ${rule.color}${isActive ? "88" : "33"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 20px ${rule.color}33` : "none",
                  }}
                >
                  {rule.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 18,
                        color: rule.color,
                        fontFamily: "monospace",
                        fontWeight: 900,
                        opacity: 0.6 + glow * 0.3,
                      }}
                    >
                      #{rule.number}
                    </span>
                    <span style={{ fontSize: 38, fontWeight: 900, color: textColor }}>
                      {rule.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 24, color: "#999", marginTop: 6 }}>
                    {rule.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 40,
              fontWeight: 900,
              color: accentColor,
              opacity: interpolate(sloganAnim, [0, 1], [0, 1]),
              transform: `scale(${interpolate(sloganAnim, [0, 1], [0.8, 1])})`,
              textShadow: `0 0 30px ${accentColor}44`,
              letterSpacing: 2,
            }}
          >
            P8 不是 NPC
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
