import React from "react";
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { AgentSkillsProps } from "../schema";
import { fadeInUp, lineGrow } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const PipelineScene: React.FC<AgentSkillsProps> = ({
  pipelineTitle,
  pipelineSubtitle,
  pipelineSteps,
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

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 50,
          right: 50,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* 标题 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            textAlign: "center",
            background: `linear-gradient(135deg, ${accentColor}, ${highlightColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: titleFade.opacity,
            transform: `translateY(${titleFade.y}px)`,
            ...textWrap,
          }}
        >
          {pipelineTitle}
        </div>

        <div
          style={{
            fontSize: 24,
            color: mutedTextColor,
            textAlign: "center",
            opacity: subFade.opacity,
            transform: `translateY(${subFade.y}px)`,
            marginBottom: 8,
            ...textWrap,
          }}
        >
          {pipelineSubtitle}
        </div>

        {/* 管道节点 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pipelineSteps.map((step, index) => {
            const delay = 12 + index * 10;
            const sp = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.5 },
            });
            const opacity = interpolate(sp, [0, 1], [0, 1]);
            const x = interpolate(sp, [0, 1], [60, 0]);
            const connectorGrow = index < pipelineSteps.length - 1
              ? lineGrow(frame, fps, delay + 8, 0.3)
              : 0;

            return (
              <React.Fragment key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `1px solid ${step.color}50`,
                    background: `${step.color}10`,
                    opacity,
                    transform: `translateX(${x}px)`,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{step.icon}</span>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: step.color,
                      letterSpacing: 4,
                      flexShrink: 0,
                      width: 90,
                    }}
                  >
                    {step.phase}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "ui-monospace, SFMono-Regular, monospace",
                      color: textColor,
                      flexShrink: 0,
                      width: 160,
                    }}
                  >
                    {step.command}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: mutedTextColor,
                      flex: "1 1 0",
                      minWidth: 0,
                      ...textWrap,
                    }}
                  >
                    {step.principle}
                  </div>
                </div>

                {/* 连接线 */}
                {index < pipelineSteps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 12,
                      marginLeft: 40,
                      background: `linear-gradient(180deg, ${step.color}, ${pipelineSteps[index + 1]?.color ?? step.color})`,
                      opacity: connectorGrow,
                      borderRadius: 999,
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
