import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SuperPowersProps } from "../schema";
import { fadeInUp, fadeIn, staggerDelay } from "../animations";

export const TDDScene: React.FC<SuperPowersProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  successColor,
  dangerColor,
  tddTitle,
  tddPhases,
  reviewQuote,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const phasesStart = Math.round(fps * 1.2);
  const phaseInterval = Math.round(fps * 1.5);

  const currentPhaseIndex = Math.min(
    tddPhases.length - 1,
    Math.floor(Math.max(0, frame - phasesStart) / phaseInterval)
  );

  const reviewStart = Math.round(durationInFrames * 0.55);
  const reviewAnim = fadeInUp(frame, fps, reviewStart, 50);

  const quoteStart = Math.round(durationInFrames * 0.75);
  const quoteAnim = spring({
    frame: frame - quoteStart,
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 500,
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
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 20, color: "#f97316", letterSpacing: 8, marginBottom: 14, fontWeight: 700 }}>
            STAGE 05
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: textColor, textShadow: `0 0 30px ${accentColor}33` }}>
            {tddTitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
          {tddPhases.map((phase, i) => {
            const phaseDelay = phasesStart + i * phaseInterval;
            const isReached = frame >= phaseDelay;
            const isCurrent = i === currentPhaseIndex && isReached;

            const phaseAnim = spring({
              frame: frame - phaseDelay,
              fps,
              config: { damping: 14, stiffness: 180 },
            });

            const pulseActive = isCurrent ? 1 + Math.sin(frame / fps * Math.PI * 4) * 0.03 : 1;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "22px 28px",
                  borderRadius: 18,
                  background: isCurrent ? `${phase.color}15` : isReached ? `${phase.color}08` : "rgba(255,255,255,0.02)",
                  border: `2px solid ${isReached ? `${phase.color}55` : "rgba(255,255,255,0.05)"}`,
                  opacity: interpolate(phaseAnim, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(phaseAnim, [0, 1], [0.8, pulseActive])})`,
                  boxShadow: isCurrent ? `0 0 30px ${phase.color}22` : "none",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: isReached ? `linear-gradient(135deg, ${phase.color}44, ${phase.color}22)` : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    flexShrink: 0,
                  }}
                >
                  {phase.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: isReached ? textColor : "#555" }}>
                    {phase.label}
                  </div>
                  <div style={{ fontSize: 18, color: phase.color, letterSpacing: 3, fontWeight: 700, marginTop: 4, opacity: isReached ? 1 : 0.3 }}>
                    {i < 2 ? "RED PHASE" : "GREEN PHASE"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ opacity: reviewAnim.opacity, transform: `translateY(${reviewAnim.y}px)`, marginBottom: 20 }}>
          <div style={{ textAlign: "center", fontSize: 20, color: dangerColor, letterSpacing: 8, fontWeight: 700, marginBottom: 16 }}>
            STAGE 06 · DOUBLE REVIEW
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {["规格符合度", "代码质量"].map((label, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 32px",
                  borderRadius: 14,
                  border: `1px solid ${dangerColor}44`,
                  background: `${dangerColor}0a`,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#ddd",
                  opacity: fadeIn(frame, reviewStart + 10 + staggerDelay(i, 12), 12),
                }}
              >
                🔍 {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: dangerColor,
              opacity: interpolate(quoteAnim, [0, 1], [0, 1]),
              transform: `scale(${interpolate(quoteAnim, [0, 1], [0.8, 1])})`,
              textShadow: `0 0 30px ${dangerColor}44`,
              lineHeight: 1.5,
            }}
          >
            {reviewQuote}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
