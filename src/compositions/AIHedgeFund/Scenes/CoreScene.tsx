import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { AIHedgeFundProps } from "../schema";
import { fadeInUp, staggerDelay } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const CoreScene: React.FC<AIHedgeFundProps> = ({
  coreTitle,
  coreFlowNodes,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  secondaryColor,
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
    fontSize: 52,
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

  const borderForIndex = (i: number): string => {
    if (i === 0) {
      return accentColor;
    }
    if (i === coreFlowNodes.length - 1) {
      return highlightColor;
    }
    return secondaryColor;
  };

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
          alignItems: "stretch",
          gap: 28,
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
            CORE
          </div>
          <div style={titleStyle}>{coreTitle}</div>
        </div>

        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Web 应用界面截图 */}
          <div
            style={{
              width: "100%",
              minWidth: 0,
              borderRadius: 12,
              border: `1px solid ${highlightColor}50`,
              background: panelColor,
              padding: 8,
              boxSizing: "border-box",
              overflow: "hidden",
              marginBottom: 16,
              opacity: fadeInUp(frame, fps, 10).opacity,
              transform: `translateY(${fadeInUp(frame, fps, 10).y}px)`,
            }}
          >
            <Img
              src={staticFile("images/ai-hedge-fund-webapp.png")}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </div>

          {coreFlowNodes.map((nodeText, index) => {
            const nodeDelay = staggerDelay(index, 15);
            const nodeFade = fadeInUp(frame, fps, nodeDelay);
            const nodeSpring = spring({
              frame: frame - nodeDelay,
              fps,
              config: { damping: 100, stiffness: 200, mass: 0.5 },
            });
            const nodeScale = interpolate(nodeSpring, [0, 1], [0.98, 1]);
            const showLine = index < coreFlowNodes.length - 1;
            const nextDelay = staggerDelay(index + 1, 15);
            const lineFade = fadeInUp(frame, fps, nextDelay);
            const lineOpacity = showLine ? lineFade.opacity : 0;

            return (
              <React.Fragment key={`${nodeText}-${index}`}>
                <div
                  style={{
                    width: "100%",
                    minWidth: 0,
                    borderRadius: 12,
                    border: `1px solid ${borderForIndex(index)}`,
                    background: panelColor,
                    padding: 16,
                    boxSizing: "border-box",
                    fontSize: 26,
                    fontWeight: 700,
                    color: textColor,
                    opacity: nodeFade.opacity,
                    transform: `translateY(${nodeFade.y}px) scale(${nodeScale})`,
                    ...textWrap,
                  }}
                >
                  {nodeText}
                </div>
                {showLine ? (
                  <div
                    style={{
                      width: 2,
                      height: 30,
                      backgroundColor: secondaryColor,
                      flexShrink: 0,
                      opacity: lineOpacity,
                    }}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
