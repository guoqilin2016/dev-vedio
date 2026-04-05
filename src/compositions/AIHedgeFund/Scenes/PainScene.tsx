import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { AIHedgeFundProps } from "../schema";
import { fadeIn, fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const PainScene: React.FC<AIHedgeFundProps> = ({
  painTitle,
  painPoints,
  painConclusion,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  dangerColor,
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

  const titleStyle: React.CSSProperties = {
    fontSize: 56,
    fontWeight: 900,
    lineHeight: 1.08,
    background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: `0 0 30px ${highlightColor}40`,
    opacity: titleFade.opacity,
    transform: `translateY(${titleFade.y}px) scale(${titleScale})`,
    transformOrigin: "top left",
    ...textWrap,
  };

  const conclusionOpacity = fadeIn(frame, 40, 18);

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
          justifyContent: "flex-start",
          gap: 24,
          boxSizing: "border-box",
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, width: "100%" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: accentColor,
              fontWeight: 800,
              ...textWrap,
            }}
          >
            PROBLEMS
          </div>
          <div style={titleStyle}>{painTitle}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {painPoints.map((point, index) => {
            const delay = staggerDelay(index, 10);
            const panelFade = fadeInUp(frame, fps, delay);
            const panelSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 100, stiffness: 200, mass: 0.5 },
            });
            const panelScale = interpolate(panelSpring, [0, 1], [0.98, 1]);
            return (
              <div
                key={`${point.title}-${index}`}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${dangerColor}`,
                  background: panelColor,
                  padding: "16px 18px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 14,
                  minWidth: 0,
                  opacity: panelFade.opacity,
                  transform: `translateY(${panelFade.y}px) scale(${panelScale})`,
                }}
              >
                <div style={{ fontSize: 28, flex: "0 0 auto", lineHeight: 1 }}>{point.icon}</div>
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: dangerColor,
                      ...textWrap,
                    }}
                  >
                    {point.title}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: textColor,
                      fontWeight: 500,
                      ...textWrap,
                    }}
                  >
                    {point.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: highlightColor,
            textAlign: "center",
            opacity: conclusionOpacity,
            ...textWrap,
          }}
        >
          {painConclusion}
        </div>
      </div>
    </AbsoluteFill>
  );
};
