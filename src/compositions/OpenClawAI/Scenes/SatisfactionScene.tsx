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

const RoleCard: React.FC<{
  role: string;
  frame: number;
  fps: number;
  delay: number;
  index: number;
  accentColor: string;
}> = ({ role, frame, fps, delay, index, accentColor }) => {
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const icons = ["💼", "⚙️", "✏️", "📢", "📋"];
  const icon = icons[index % icons.length];

  return (
    <div
      style={{
        opacity: interpolate(sp, [0, 1], [0, 1]),
        transform: `scale(${interpolate(sp, [0, 1], [0.5, 1])}) translateY(${interpolate(sp, [0, 1], [20, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 24px",
        background: `linear-gradient(135deg, ${accentColor}0a, ${accentColor}05)`,
        borderRadius: 14,
        border: `1px solid ${accentColor}33`,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ fontSize: 22, color: "#e0e0e0", fontWeight: 600 }}>{role}</span>
      <span
        style={{
          marginLeft: "auto",
          fontSize: 14,
          color: "#27c93f",
          padding: "3px 10px",
          borderRadius: 12,
          border: "1px solid #27c93f44",
        }}
      >
        ✓ 已部署
      </span>
    </div>
  );
};

export const SatisfactionScene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  satisfactionTitle,
  satisfactionSubtitle,
  satisfactionRoles,
  satisfactionQuote,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 50);
  const subtitleAnim = fadeInUp(frame, fps, 10, 40);

  const roleStart = Math.round(fps * 2);
  const successCount = numberCountUp(
    frame,
    fps,
    satisfactionRoles.length,
    2,
    roleStart
  );

  const quoteStart = Math.round(durationInFrames * 0.65);
  const quoteAnim = spring({
    frame: frame - quoteStart,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
          transform: "translateX(-50%)",
        }}
      />

      {/* 标题区 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          right: 60,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: accentColor,
            letterSpacing: 4,
            marginBottom: 16,
            opacity: titleAnim.opacity,
          }}
        >
          DEPLOYMENT SUCCESS
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 900,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            lineHeight: 1.3,
          }}
        >
          {satisfactionTitle}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#888",
            marginTop: 16,
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.y}px)`,
          }}
        >
          {satisfactionSubtitle}
        </div>
      </div>

      {/* 成功部署计数 */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          opacity: fadeIn(frame, Math.round(fps * 1.5), 15),
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: accentColor,
            fontFamily: "monospace",
            textShadow: `0 0 30px ${accentColor}44`,
          }}
        >
          {successCount}
        </span>
        <span style={{ fontSize: 24, color: "#888" }}>/ {satisfactionRoles.length} 岗位成功部署</span>
      </div>

      {/* 角色卡片列表 */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {satisfactionRoles.map((role, i) => (
          <RoleCard
            key={i}
            role={role}
            frame={frame}
            fps={fps}
            delay={roleStart + staggerDelay(i, 12)}
            index={i}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* 自动化效果展示 */}
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 50,
          right: 50,
          opacity: fadeIn(frame, Math.round(durationInFrames * 0.5), 15),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "20px 0",
          }}
        >
          {[
            { label: "效率提升", value: "300%", icon: "📈" },
            { label: "部署耗时", value: "10min", icon: "⏱️" },
            { label: "满意度", value: "98%", icon: "😊" },
          ].map((stat, i) => {
            const statDelay = Math.round(durationInFrames * 0.5) + staggerDelay(i, 10);
            const statAnim = fadeInUp(frame, fps, statDelay, 20);
            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  opacity: statAnim.opacity,
                  transform: `translateY(${statAnim.y}px)`,
                }}
              >
                <div style={{ fontSize: 32 }}>{stat.icon}</div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: accentColor,
                    fontFamily: "monospace",
                    marginTop: 8,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部金句 */}
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
            fontSize: 32,
            fontWeight: 800,
            color: highlightColor,
            opacity: interpolate(quoteAnim, [0, 1], [0, 1]),
            transform: `scale(${interpolate(quoteAnim, [0, 1], [0.9, 1])})`,
            textShadow: `0 0 30px ${highlightColor}44`,
            lineHeight: 1.5,
          }}
        >
          ✨ {satisfactionQuote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
