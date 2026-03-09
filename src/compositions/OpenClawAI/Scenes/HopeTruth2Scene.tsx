import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OpenClawAIProps } from "../schema";
import { fadeInUp, fadeIn, staggerDelay, numberCountUp, pulseGlow } from "../animations";

const PlatformCard: React.FC<{
  title: string;
  status: string;
  reward: string;
  frame: number;
  fps: number;
  delay: number;
  accentColor: string;
  warningColor: string;
}> = ({ title, status, reward, frame, fps, delay, accentColor, warningColor }) => {
  const anim = fadeInUp(frame, fps, delay, 30);
  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${accentColor}22`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#e0e0e0" }}>{title}</div>
        <div
          style={{
            fontSize: 14,
            color: status === "已完成" ? "#27c93f" : warningColor,
            padding: "4px 12px",
            borderRadius: 20,
            border: `1px solid ${status === "已完成" ? "#27c93f44" : warningColor + "44"}`,
          }}
        >
          {status}
        </div>
      </div>
      <div
        style={{
          fontSize: 16,
          color: accentColor,
          marginTop: 12,
          fontFamily: "monospace",
        }}
      >
        赏金: {reward}
      </div>
    </div>
  );
};

export const HopeTruth2Scene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  warningColor,
  hope2Title,
  hope2Number,
  hope2Content,
  hope2Highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 1.5);
  const numberAnim = fadeInUp(frame, fps, 0, 40);
  const titleAnim = fadeInUp(frame, fps, 8, 40);

  const platformStart = Math.round(fps * 2);
  const flowStart = Math.round(durationInFrames * 0.45);

  const ethCount = numberCountUp(frame, fps, 250, 2, flowStart);

  const highlightAnim = spring({
    frame: frame - Math.round(durationInFrames * 0.75),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const flowSteps = [
    { icon: "🤖", label: "AI发布任务" },
    { icon: "→", label: "" },
    { icon: "👤", label: "人类接单" },
    { icon: "→", label: "" },
    { icon: "✅", label: "验收通过" },
    { icon: "→", label: "" },
    { icon: "💰", label: "自动结算" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 编号标签 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: numberAnim.opacity,
          transform: `translateY(${numberAnim.y}px)`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: accentColor,
            opacity: 0.3,
            fontFamily: "monospace",
          }}
        >
          {hope2Number}
        </div>
        <div style={{ width: 40, height: 2, backgroundColor: accentColor, opacity: 0.5 }} />
        <div style={{ fontSize: 16, color: accentColor, letterSpacing: 3 }}>TRUTH</div>
      </div>

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 60,
          right: 60,
          fontSize: 42,
          fontWeight: 900,
          color: textColor,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.y}px)`,
          lineHeight: 1.4,
        }}
      >
        {hope2Title}
      </div>

      {/* 说明文字 */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          fontSize: 22,
          color: "#999",
          opacity: fadeIn(frame, 15, 15),
          lineHeight: 1.6,
        }}
      >
        {hope2Content}
      </div>

      {/* 平台任务列表 */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 14, color: accentColor, letterSpacing: 2, marginBottom: 4 }}>
          RENT-A-HUMAN DASHBOARD
        </div>
        {[
          { title: "线下库存核实", status: "进行中", reward: "0.03 ETH" },
          { title: "验证码人工破解", status: "已完成", reward: "0.01 ETH" },
          { title: "实地照片采集", status: "招标中", reward: "0.05 ETH" },
        ].map((task, i) => (
          <PlatformCard
            key={i}
            {...task}
            frame={frame}
            fps={fps}
            delay={platformStart + staggerDelay(i, 15)}
            accentColor={accentColor}
            warningColor={warningColor}
          />
        ))}
      </div>

      {/* 工作流箭头 */}
      <div
        style={{
          position: "absolute",
          top: 780,
          left: 50,
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: fadeIn(frame, flowStart, 15),
        }}
      >
        {flowSteps.map((step, i) => {
          const stepDelay = flowStart + staggerDelay(i, 6);
          const stepOpacity = fadeIn(frame, stepDelay, 8);
          const isArrow = step.label === "";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: stepOpacity,
              }}
            >
              <span
                style={{
                  fontSize: isArrow ? 20 : 32,
                  color: isArrow ? accentColor : textColor,
                }}
              >
                {step.icon}
              </span>
              {!isArrow && (
                <span style={{ fontSize: 13, color: "#888" }}>{step.label}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 结算计数器 */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fadeIn(frame, flowStart + 20, 15),
        }}
      >
        <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>累计结算</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: accentColor,
            fontFamily: "monospace",
            textShadow: `0 0 30px ${accentColor}${Math.round(glow * 60 + 20).toString(16)}`,
          }}
        >
          {(ethCount / 100).toFixed(2)} ETH
        </div>
      </div>

      {/* 底部高亮金句 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 32,
            fontWeight: 800,
            color: highlightColor,
            opacity: interpolate(highlightAnim, [0, 1], [0, 1]),
            transform: `scale(${interpolate(highlightAnim, [0, 1], [0.9, 1])})`,
            padding: "12px 32px",
            borderRadius: 12,
            background: `${highlightColor}11`,
            border: `1px solid ${highlightColor}33`,
            textShadow: `0 0 20px ${highlightColor}44`,
          }}
        >
          🚀 {hope2Highlight}
        </div>
      </div>
    </AbsoluteFill>
  );
};
