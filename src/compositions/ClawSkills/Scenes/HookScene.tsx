import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ClawSkillsProps } from "../schema";
import { glitchOffset, fadeInUp, pulseGlow } from "../animations";

export const HookScene: React.FC<ClawSkillsProps> = ({
  hookLine1,
  hookLine2,
  backgroundColor,
  textColor,
  accentColor,
  goldColor,
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
    [0, 0.25, 0, 0.12],
    { extrapolateRight: "clamp" }
  );

  const borderPulse = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
    delay: Math.round(fps * 0.5),
  });

  const lobsterScale = spring({
    frame: frame - Math.round(fps * 0.3),
    fps,
    config: { damping: 8, stiffness: 120 },
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: accentColor,
          opacity: bgFlash,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 107, 53, 0.03) 2px,
            rgba(255, 107, 53, 0.03) 4px
          )`,
          pointerEvents: "none",
        }}
      />

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

      <div
        style={{
          fontSize: 120,
          opacity: interpolate(lobsterScale, [0, 1], [0, 1]),
          transform: `scale(${interpolate(lobsterScale, [0, 1], [0.2, 1])})`,
          marginBottom: 30,
          filter: `drop-shadow(0 0 30px ${accentColor}66)`,
        }}
      >
        🦞
      </div>

      <div
        style={{
          position: "relative",
          transform: `translateY(${line1Anim.y}px) translateX(${glitch.x}px) skewX(${glitch.skew}deg)`,
          opacity: line1Anim.opacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontSize: 52,
            fontWeight: 900,
            color: accentColor,
            textAlign: "center",
            transform: `translateX(${glitch.x > 0 ? 3 : -3}px)`,
            opacity: Math.abs(glitch.x) > 1 ? 0.7 : 0,
            mixBlendMode: "screen",
          }}
        >
          {hookLine1}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            padding: "0 60px",
            lineHeight: 1.4,
            textShadow: `0 0 ${20 + glow * 20}px ${accentColor}88`,
          }}
        >
          {hookLine1}
        </div>
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: goldColor,
          textAlign: "center",
          marginTop: 40,
          padding: "0 80px",
          lineHeight: 1.5,
          opacity: line2Anim.opacity,
          transform: `translateY(${line2Anim.y}px)`,
          textShadow: `0 0 30px ${goldColor}66`,
        }}
      >
        {hookLine2}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 80,
          right: 80,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
