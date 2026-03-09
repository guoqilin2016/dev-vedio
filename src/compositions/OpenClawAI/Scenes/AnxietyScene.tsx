import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OpenClawAIProps } from "../schema";
import {
  fadeInUp,
  fadeIn,
  staggerDelay,
  pulseGlow,
  progressBar,
  typewriterLength,
} from "../animations";

const TerminalLine: React.FC<{
  text: string;
  frame: number;
  fps: number;
  delay: number;
  color: string;
  prefix?: string;
}> = ({ text, frame, fps, delay, color, prefix = "$" }) => {
  const len = typewriterLength(frame, text, fps, delay, 30);
  const opacity = fadeIn(frame, delay, 8);
  return (
    <div style={{ opacity, fontFamily: "monospace", fontSize: 22, lineHeight: 1.8 }}>
      <span style={{ color: "#00f0ff" }}>{prefix} </span>
      <span style={{ color }}>{text.slice(0, len)}</span>
      {len < text.length && (
        <span style={{ opacity: frame % 12 < 6 ? 1 : 0, color: "#00f0ff" }}>▊</span>
      )}
    </div>
  );
};

const BrowserTab: React.FC<{
  title: string;
  frame: number;
  fps: number;
  delay: number;
  accentColor: string;
}> = ({ title, frame, fps, delay, accentColor }) => {
  const anim = fadeInUp(frame, fps, delay, 30);
  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: "16px 24px",
        border: `1px solid ${accentColor}33`,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
        }}
      />
      <span style={{ color: "#ccc", fontSize: 20, fontFamily: "monospace" }}>{title}</span>
    </div>
  );
};

export const AnxietyScene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  warningColor,
  anxietyTitle,
  anxietyPoints,
  anxietyQuote,
  anxietyInteraction,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);

  const titleAnim = fadeInUp(frame, fps, 0, 50);

  const terminalCommands = [
    "openclaw --takeover browser",
    "scanning tasks... 3 pending",
    "autopilot: email → filter → reply",
    "hiring human via rent-a-human.io",
    "payment: 0.05 ETH → wallet_x7f2",
  ];

  const phase1End = Math.round(durationInFrames * 0.35);
  const phase2Start = Math.round(durationInFrames * 0.3);
  const phase3Start = Math.round(durationInFrames * 0.65);

  const terminalOpacity = fadeIn(frame, Math.round(fps * 1.5), 15);
  const browserOpacity = fadeIn(frame, phase2Start, 15);

  const quoteScale = spring({
    frame: frame - phase3Start,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const progressValue = progressBar(frame, fps, durationInFrames / fps, 0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 背景网格 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${accentColor}08 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 顶部标题栏 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          padding: "0 60px",
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.y}px)`,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: warningColor,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          ⚠ WARNING
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: textColor,
            lineHeight: 1.4,
            textShadow: `0 0 20px ${warningColor}44`,
          }}
        >
          {anxietyTitle}
        </div>
      </div>

      {/* 终端模拟区 */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 50,
          right: 50,
          opacity: terminalOpacity,
          background: "rgba(0, 10, 20, 0.9)",
          borderRadius: 16,
          border: `1px solid ${accentColor}44`,
          padding: 24,
          boxShadow: `0 0 40px ${accentColor}11`,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27c93f" }} />
        </div>
        {terminalCommands.map((cmd, i) => (
          <TerminalLine
            key={i}
            text={cmd}
            frame={frame}
            fps={fps}
            delay={Math.round(fps * 1.5) + staggerDelay(i, Math.round(fps * 0.8))}
            color={i >= 3 ? warningColor : "#e0e0e0"}
            prefix={i >= 3 ? "!" : "$"}
          />
        ))}
      </div>

      {/* 浏览器操作模拟 */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 50,
          right: 50,
          opacity: browserOpacity,
        }}
      >
        <div style={{ fontSize: 16, color: accentColor, marginBottom: 16, letterSpacing: 2 }}>
          AUTOPILOT ACTIVE
        </div>
        {anxietyPoints.map((point, i) => (
          <BrowserTab
            key={i}
            title={point}
            frame={frame}
            fps={fps}
            delay={phase2Start + staggerDelay(i, 10)}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: "absolute",
          bottom: 400,
          left: 60,
          right: 60,
        }}
      >
        <div
          style={{
            height: 4,
            backgroundColor: `${accentColor}22`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressValue}%`,
              height: "100%",
              backgroundColor: accentColor,
              borderRadius: 2,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>
      </div>

      {/* 核心金句 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: warningColor,
            opacity: interpolate(quoteScale, [0, 1], [0, 1]),
            transform: `scale(${interpolate(quoteScale, [0, 1], [0.8, 1])})`,
            textShadow: `0 0 40px ${warningColor}66`,
            lineHeight: 1.5,
          }}
        >
          {anxietyQuote}
        </div>
      </div>

      {/* 互动提示 */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 24,
          color: accentColor,
          opacity: fadeIn(frame, phase3Start + 15, 15) * (0.6 + glow * 0.4),
        }}
      >
        {anxietyInteraction}
      </div>
    </AbsoluteFill>
  );
};
