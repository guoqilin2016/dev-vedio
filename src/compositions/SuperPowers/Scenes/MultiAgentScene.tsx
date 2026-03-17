import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SuperPowersProps } from "../schema";
import { fadeInUp, fadeIn, pulseGlow, staggerDelay, cardSlideIn } from "../animations";

export const MultiAgentScene: React.FC<SuperPowersProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  platforms,
  multiAgentTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);

  const masterStart = Math.round(fps * 1);
  const masterAnim = spring({
    frame: frame - masterStart,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const subAgentStart = Math.round(fps * 2);
  const subAgents = [
    { name: "子Agent A", task: "模块开发", icon: "🔧" },
    { name: "子Agent B", task: "测试编写", icon: "🧪" },
    { name: "子Agent C", task: "文档生成", icon: "📝" },
  ];

  const platformStart = Math.round(fps * 4.5);
  const badgeStart = Math.round(durationInFrames * 0.7);
  const badgeAnim = fadeInUp(frame, fps, badgeStart, 40);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${accentColor}0c 0%, transparent 50%)` }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 20, color: "#10b981", letterSpacing: 8, marginBottom: 14, fontWeight: 700 }}>
            STAGE 07 · DELIVERY
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: textColor, textShadow: `0 0 30px ${accentColor}33` }}>
            {multiAgentTitle}
          </div>
        </div>

        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${accentColor}44, ${accentColor}22)`,
            border: `3px solid ${accentColor}66`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(masterAnim, [0, 1], [0, 1]),
            transform: `scale(${interpolate(masterAnim, [0, 1], [0.3, 1])})`,
            boxShadow: `0 0 ${30 + glow * 20}px ${accentColor}33`,
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 48 }}>🧠</div>
          <div style={{ fontSize: 18, color: accentColor, fontWeight: 700, marginTop: 4 }}>
            主 Agent
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            marginBottom: 30,
          }}
        >
          {subAgents.map((agent, i) => {
            const anim = cardSlideIn(frame, fps, subAgentStart + staggerDelay(i, 12));
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  opacity: anim.opacity,
                  transform: `translateX(${anim.x}px) scale(${anim.scale})`,
                }}
              >
                <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${accentColor}44, ${accentColor}11)`, margin: "0 auto 8px", opacity: fadeIn(frame, subAgentStart + staggerDelay(i, 12) - 5, 10) }} />
                <div style={{ padding: "22px 14px", borderRadius: 18, background: `${highlightColor}08`, border: `1px solid ${highlightColor}22` }}>
                  <div style={{ fontSize: 44 }}>{agent.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: textColor, marginTop: 8 }}>{agent.name}</div>
                  <div style={{ fontSize: 20, color: highlightColor, marginTop: 4 }}>{agent.task}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: "center", fontSize: 20, color: "#666", letterSpacing: 5, marginBottom: 14, opacity: fadeIn(frame, platformStart, 15) }}>
            SUPPORTED PLATFORMS
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            {platforms.map((platform, i) => {
              const anim = cardSlideIn(frame, fps, platformStart + staggerDelay(i, 10));
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 22px",
                    borderRadius: 14,
                    border: `1px solid ${platform.color}33`,
                    background: `${platform.color}08`,
                    opacity: anim.opacity,
                    transform: `translateX(${anim.x}px) scale(${anim.scale})`,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{platform.icon}</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: platform.color }}>{platform.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ opacity: badgeAnim.opacity, transform: `translateY(${badgeAnim.y}px)`, display: "flex", gap: 20 }}>
          {["零配置安装", "技能自动触发"].map((text, i) => (
            <div
              key={i}
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#10b981",
                padding: "12px 30px",
                borderRadius: 30,
                border: `2px solid #10b98144`,
                background: "#10b9810a",
                textShadow: `0 0 20px #10b98144`,
              }}
            >
              ⚡ {text}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
