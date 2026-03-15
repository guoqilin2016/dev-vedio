import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SuperPowersProps } from "../schema";
import { fadeInUp, pipelineNodeReveal, lineGrow, pulseGlow } from "../animations";

export const PipelineScene: React.FC<SuperPowersProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  pipelineTitle,
  pipelineSubtitle,
  pipelineSteps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const subtitleAnim = fadeInUp(frame, fps, 10, 40);
  const stepsStart = Math.round(fps * 1.2);
  const glow = pulseGlow(frame, fps, 2);

  const nodeSize = 52;
  const nodeGap = 12;

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
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 20, color: accentColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            CORE ARCHITECTURE
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: textColor, textShadow: `0 0 40px ${accentColor}44` }}>
            {pipelineTitle}
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
              border: `1px solid ${accentColor}22`,
              background: `${accentColor}08`,
            }}
          >
            {pipelineSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {pipelineSteps.map((step, i) => {
            const nodeAnim = pipelineNodeReveal(frame, fps, i, stepsStart);
            const lineDelay = stepsStart + i * 10 + 6;
            const line = i < pipelineSteps.length - 1 ? lineGrow(frame, fps, lineDelay) : 0;
            const isActive = frame > stepsStart + i * 10 + 15;

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    width: 920,
                    opacity: nodeAnim.opacity,
                    transform: `translateY(${nodeAnim.y}px) scale(${nodeAnim.scale})`,
                  }}
                >
                  <div
                    style={{
                      width: nodeSize,
                      height: nodeSize,
                      borderRadius: 14,
                      background: isActive
                        ? `linear-gradient(135deg, ${step.color}44, ${step.color}22)`
                        : `${step.color}11`,
                      border: `2px solid ${step.color}${isActive ? "88" : "33"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      flexShrink: 0,
                      boxShadow: isActive ? `0 0 20px ${step.color}33` : "none",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: 14,
                          color: step.color,
                          letterSpacing: 3,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 6,
                          background: `${step.color}12`,
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: textColor, marginTop: 2 }}>
                      {step.name}
                    </div>
                    <div style={{ fontSize: 20, color: "#777", marginTop: 1 }}>
                      {step.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: step.color,
                      fontFamily: "monospace",
                      opacity: 0.5 + glow * 0.3,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {i < pipelineSteps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: nodeGap,
                      background: `linear-gradient(180deg, ${step.color}44, ${pipelineSteps[i + 1].color}44)`,
                      opacity: line,
                      alignSelf: "center",
                      marginLeft: -434 + nodeSize / 2,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
