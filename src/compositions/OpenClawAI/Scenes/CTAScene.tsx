import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OpenClawAIProps } from "../schema";
import { fadeInUp, fadeIn, pulseGlow } from "../animations";

export const CTAScene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  warningColor,
  ctaTitle,
  ctaContent,
  ctaInteraction,
  ctaSlogan,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);

  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const contentAnim = fadeInUp(frame, fps, Math.round(fps * 1.2), 50);

  const interactionStart = Math.round(durationInFrames * 0.45);
  const interactionAnim = fadeInUp(frame, fps, interactionStart, 40);

  const sloganStart = Math.round(durationInFrames * 0.7);
  const sloganAnim = spring({
    frame: frame - sloganStart,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const pulseScale = 1 + Math.sin(frame / fps * Math.PI * 3) * 0.02;

  const vsOpacity = fadeIn(frame, 5, 20);
  const vsGlitch = frame % 60 < 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 背景放射 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${accentColor}0c 0%, transparent 60%)`,
        }}
      />

      {/* 四角装饰 */}
      {[
        { top: 30, left: 30 },
        { top: 30, right: 30 },
        { bottom: 30, left: 30 },
        { bottom: 30, right: 30 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 50,
            height: 50,
            opacity: 0.4 + glow * 0.3,
            borderTop: i < 2 ? `2px solid ${accentColor}` : "none",
            borderBottom: i >= 2 ? `2px solid ${accentColor}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${accentColor}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${accentColor}` : "none",
          }}
        />
      ))}

      {/* 核心对比: 做到 > 知道 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            opacity: vsOpacity,
            transform: vsGlitch ? "translateX(3px)" : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: accentColor,
                textShadow: `0 0 40px ${accentColor}66`,
                opacity: interpolate(titleReveal, [0, 1], [0, 1]),
                transform: `scale(${interpolate(titleReveal, [0, 1], [0.3, 1])})`,
              }}
            >
              做到
            </span>
            <span
              style={{
                fontSize: 48,
                color: warningColor,
                fontWeight: 900,
                opacity: interpolate(titleReveal, [0, 1], [0, 1]),
              }}
            >
              &gt;
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: "#555",
                opacity: interpolate(titleReveal, [0, 1], [0, 0.5]),
                textDecoration: "line-through",
                textDecorationColor: warningColor,
              }}
            >
              知道
            </span>
          </div>
        </div>
      </div>

      {/* 游泳比喻 */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: "#aaa",
            lineHeight: 1.8,
            opacity: contentAnim.opacity,
            transform: `translateY(${contentAnim.y}px)`,
          }}
        >
          {ctaContent}
        </div>
      </div>

      {/* 分水岭示意 */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 80,
          right: 80,
          opacity: fadeIn(frame, Math.round(fps * 2.5), 15),
        }}
      >
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${warningColor}, ${accentColor})`,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 14,
              color: warningColor,
              letterSpacing: 4,
              whiteSpace: "nowrap",
            }}
          >
            ─── 分水岭 ───
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 18, color: "#555" }}>围观者</div>
          <div style={{ fontSize: 18, color: accentColor, fontWeight: 700 }}>实干者</div>
        </div>
      </div>

      {/* 互动号召 */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 50px",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: accentColor,
            opacity: interactionAnim.opacity,
            transform: `translateY(${interactionAnim.y}px) scale(${pulseScale})`,
            padding: "20px 32px",
            borderRadius: 20,
            border: `2px solid ${accentColor}55`,
            background: `${accentColor}08`,
            lineHeight: 1.6,
          }}
        >
          💬 {ctaInteraction}
        </div>
      </div>

      {/* 底部口号 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: highlightColor,
            opacity: interpolate(sloganAnim, [0, 1], [0, 1]),
            transform: `scale(${interpolate(sloganAnim, [0, 1], [0.8, 1])})`,
            letterSpacing: 4,
            textShadow: `0 0 40px ${highlightColor}66`,
          }}
        >
          🏆 {ctaSlogan}
        </div>
      </div>
    </AbsoluteFill>
  );
};
