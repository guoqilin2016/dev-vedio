import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OpenClawAIProps } from "../schema";
import { glitchOffset, fadeInUp, typewriterLength, pulseGlow } from "../animations";

export const HookScene: React.FC<OpenClawAIProps> = ({
  hookLine1,
  hookLine2,
  hookStyle,
  backgroundColor,
  textColor,
  accentColor,
  warningColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitch = glitchOffset(frame, 1.5);
  const glow = pulseGlow(frame, fps, 3);

  const line1Anim = fadeInUp(frame, fps, 0, 80);
  const line2Anim = fadeInUp(frame, fps, Math.round(fps * 1.2), 60);

  const bgFlash = interpolate(
    frame,
    [0, 3, 6, 8],
    [0, 0.3, 0, 0.15],
    { extrapolateRight: "clamp" }
  );

  const revealLength = hookStyle === "typewriter"
    ? typewriterLength(frame, hookLine1, fps, 5, 24)
    : hookLine1.length;

  const displayLine1 = hookStyle === "typewriter"
    ? hookLine1.slice(0, revealLength)
    : hookLine1;

  const borderPulse = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
    delay: Math.round(fps * 0.5),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 背景闪烁 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: warningColor,
          opacity: bgFlash,
        }}
      />

      {/* 扫描线 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 240, 255, 0.03) 2px,
            rgba(0, 240, 255, 0.03) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* HUD 角框 */}
      {[
        { top: 40, left: 40 },
        { top: 40, right: 40 },
        { bottom: 40, left: 40 },
        { bottom: 40, right: 40 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 60,
            height: 60,
            opacity: interpolate(borderPulse, [0, 1], [0, 0.6]),
            borderTop: i < 2 ? `2px solid ${accentColor}` : "none",
            borderBottom: i >= 2 ? `2px solid ${accentColor}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${accentColor}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${accentColor}` : "none",
          }}
        />
      ))}

      {/* 主标题行1 - 带故障效果 */}
      <div
        style={{
          position: "relative",
          transform: `translateY(${line1Anim.y}px) translateX(${glitch.x}px) skewX(${glitch.skew}deg)`,
          opacity: line1Anim.opacity,
        }}
      >
        {/* 红色偏移层 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontSize: 56,
            fontWeight: 900,
            color: warningColor,
            textAlign: "center",
            transform: `translateX(${glitch.x > 0 ? 3 : -3}px)`,
            opacity: Math.abs(glitch.x) > 1 ? 0.7 : 0,
            mixBlendMode: "screen",
          }}
        >
          {displayLine1}
        </div>
        {/* 主文字 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            padding: "0 60px",
            lineHeight: 1.4,
            textShadow: `0 0 ${20 + glow * 20}px ${accentColor}88`,
          }}
        >
          {displayLine1}
          {hookStyle === "typewriter" && revealLength < hookLine1.length && (
            <span
              style={{
                opacity: frame % 16 < 8 ? 1 : 0,
                color: accentColor,
              }}
            >
              |
            </span>
          )}
        </div>
      </div>

      {/* 副标题行2 */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: accentColor,
          textAlign: "center",
          marginTop: 40,
          padding: "0 80px",
          lineHeight: 1.5,
          opacity: line2Anim.opacity,
          transform: `translateY(${line2Anim.y}px)`,
          textShadow: `0 0 30px ${accentColor}66`,
        }}
      >
        {hookLine2}
      </div>

      {/* 底部警示条 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 80,
          right: 80,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${warningColor}, transparent)`,
          opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
