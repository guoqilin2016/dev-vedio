import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { AIHedgeFundProps, AIHedgeFundBacktestMetric } from "../schema";
import { fadeIn, fadeInUp, staggerDelay, typewriterLength } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

const metricValueColor = (m: AIHedgeFundBacktestMetric): string => {
  if (m.color === "green") return "#00c853";
  if (m.color === "red") return "#ff1744";
  return "#ffd700";
};

export const VerifyScene: React.FC<AIHedgeFundProps> = ({
  verifyTitle,
  verifyCommand,
  backtestMetrics,
  quickStartSteps,
  verifyFreeNote,
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
  const cmdLen = typewriterLength(frame, verifyCommand, fps, 5);
  const cmdVisible = verifyCommand.slice(0, cmdLen);

  const noteOpacity = fadeIn(frame, 55, 18);

  const titleStyle: React.CSSProperties = {
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1.08,
    background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: `0 0 30px ${highlightColor}40`,
    opacity: titleFade.opacity,
    transform: `translateY(${titleFade.y}px)`,
    transformOrigin: "top left",
    ...textWrap,
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
          justifyContent: "flex-start",
          gap: 20,
          boxSizing: "border-box",
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, width: "100%" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: accentColor,
              fontWeight: 800,
              ...textWrap,
            }}
          >
            VERIFY
          </div>
          <div style={titleStyle}>{verifyTitle}</div>
        </div>

        {/* CLI 运行截图 */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 12,
            border: `1px solid ${accentColor}`,
            background: panelColor,
            padding: 8,
            boxSizing: "border-box",
            overflow: "hidden",
            opacity: fadeInUp(frame, fps, 5).opacity,
            transform: `translateY(${fadeInUp(frame, fps, 5).y}px)`,
          }}
        >
          <Img
            src={staticFile("images/ai-hedge-fund-cli.png")}
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </div>

        {/* 回测结果截图 */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 12,
            border: `1px solid ${highlightColor}60`,
            background: panelColor,
            padding: 8,
            boxSizing: "border-box",
            overflow: "hidden",
            opacity: fadeInUp(frame, fps, 20).opacity,
            transform: `translateY(${fadeInUp(frame, fps, 20).y}px)`,
          }}
        >
          <Img
            src={staticFile("images/ai-hedge-fund-backtest.png")}
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            width: "100%",
            minWidth: 0,
          }}
        >
          {quickStartSteps.map((step, index) => {
            const stagger = staggerDelay(index, 12);
            const stepFade = fadeInUp(frame, fps, 35 + stagger);
            return (
              <div
                key={`${step.step}-${index}`}
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  background: panelColor,
                  borderRadius: 8,
                  padding: 12,
                  boxSizing: "border-box",
                  opacity: stepFade.opacity,
                  transform: `translateY(${stepFade.y}px)`,
                }}
              >
                <div
                  style={{
                    color: accentColor,
                    fontSize: 22,
                    fontWeight: 900,
                    ...textWrap,
                  }}
                >
                  {step.step}
                </div>
                <div
                  style={{
                    color: textColor,
                    fontSize: 18,
                    marginTop: 6,
                    ...textWrap,
                  }}
                >
                  {step.description}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            color: highlightColor,
            fontSize: 20,
            fontWeight: 700,
            textAlign: "center",
            opacity: noteOpacity,
            ...textWrap,
          }}
        >
          {verifyFreeNote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
