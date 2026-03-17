import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { fadeInUp, fadeIn, pressureReveal, pulseGlow } from "../animations";

export const MethodScene: React.FC<PuaSkillProps> = ({
  backgroundColor,
  textColor,
  methodColor,
  methodSteps,
  methodTitle,
  methodSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const subtitleAnim = fadeInUp(frame, fps, 10, 40);
  const stepsStart = Math.round(fps * 1.2);
  const glow = pulseGlow(frame, fps, 2);

  const sloganStart = Math.round(durationInFrames * 0.78);
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 60% 40%, ${methodColor}0c 0%, transparent 50%)` }} />

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
          <div style={{ fontSize: 20, color: methodColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            METHODOLOGY
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: textColor, textShadow: `0 0 40px ${methodColor}44` }}>
            {methodTitle}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.y}px)`,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 26,
              color: "#999",
              padding: "10px 30px",
              borderRadius: 20,
              border: `1px solid ${methodColor}22`,
              background: `${methodColor}08`,
            }}
          >
            {methodSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {methodSteps.map((step, i) => {
            const nodeAnim = pressureReveal(frame, fps, i, stepsStart);
            const isActive = frame > stepsStart + i * 18 + 15;

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    width: 920,
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: isActive ? `${step.color}10` : "transparent",
                    border: isActive ? `1px solid ${step.color}22` : "1px solid transparent",
                    opacity: nodeAnim.opacity,
                    transform: `translateY(${nodeAnim.y}px) scale(${nodeAnim.scale})`,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: isActive
                        ? `linear-gradient(135deg, ${step.color}44, ${step.color}22)`
                        : `${step.color}11`,
                      border: `2px solid ${step.color}${isActive ? "88" : "33"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      flexShrink: 0,
                      boxShadow: isActive ? `0 0 20px ${step.color}33` : "none",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: textColor }}>
                      {step.name}
                    </div>
                    <div style={{ fontSize: 22, color: "#999", marginTop: 2 }}>
                      {step.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: step.color,
                      fontFamily: "monospace",
                      opacity: 0.5 + glow * 0.3,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {i < methodSteps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 8,
                      background: `linear-gradient(180deg, ${step.color}44, ${methodSteps[i + 1].color}44)`,
                      opacity: fadeIn(frame, stepsStart + i * 18 + 10, 8),
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 36,
              fontWeight: 900,
              color: methodColor,
              opacity: interpolate(sloganAnim, [0, 1], [0, 1]),
              transform: `scale(${interpolate(sloganAnim, [0, 1], [0.8, 1])})`,
              textShadow: `0 0 30px ${methodColor}44`,
              padding: "14px 36px",
              borderRadius: 16,
              border: `2px solid ${methodColor}44`,
              background: `${methodColor}0a`,
            }}
          >
            PUA让AI不敢放弃 · 方法论让AI有能力不放弃
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
