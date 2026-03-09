import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { OpenClawAIProps } from "../schema";
import { fadeInUp, fadeIn, progressBar, staggerDelay, pulseGlow } from "../animations";

export const HopeTruth3Scene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  warningColor,
  hope3Title,
  hope3Number,
  hope3Content,
  hope3Highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 1.5);
  const numberAnim = fadeInUp(frame, fps, 0, 40);
  const titleAnim = fadeInUp(frame, fps, 8, 40);

  const xpBarStart = Math.round(fps * 2);
  const gapStart = Math.round(durationInFrames * 0.55);

  const xpProgress = progressBar(frame, fps, 4, xpBarStart);

  const xpMilestones = [
    { pct: 20, label: "第一次试错", icon: "🔧" },
    { pct: 45, label: "调试踩坑", icon: "🐛" },
    { pct: 70, label: "工作流整合", icon: "⚡" },
    { pct: 95, label: "驾驭AI", icon: "🏆" },
  ];

  const workflowItems = [
    { icon: "📋", label: "任务规划" },
    { icon: "🤖", label: "AI执行" },
    { icon: "📊", label: "数据整理" },
    { icon: "📧", label: "自动通知" },
    { icon: "✅", label: "验收交付" },
  ];

  const highlightAnim = spring({
    frame: frame - Math.round(durationInFrames * 0.75),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const gapWidth = interpolate(
    frame - gapStart,
    [0, fps * 2],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

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
          {hope3Number}
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
        {hope3Title}
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
        {hope3Content}
      </div>

      {/* 经验值进度条 */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 50,
          right: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 16, color: accentColor, letterSpacing: 2 }}>EXP LEVEL</span>
          <span style={{ fontSize: 16, color: accentColor, fontFamily: "monospace" }}>
            {Math.round(xpProgress)}%
          </span>
        </div>

        {/* XP 条 */}
        <div
          style={{
            height: 24,
            backgroundColor: `${accentColor}15`,
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            border: `1px solid ${accentColor}33`,
          }}
        >
          <div
            style={{
              width: `${xpProgress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${accentColor}, ${highlightColor})`,
              borderRadius: 12,
              boxShadow: `0 0 20px ${accentColor}66`,
            }}
          />
        </div>

        {/* 里程碑标记 */}
        <div style={{ position: "relative", height: 80, marginTop: 16 }}>
          {xpMilestones.map((m, i) => {
            const isReached = xpProgress >= m.pct;
            const milestoneOpacity = fadeIn(
              frame,
              xpBarStart + staggerDelay(i, Math.round(fps * 0.8)),
              10
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${m.pct}%`,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  opacity: milestoneOpacity,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    filter: isReached ? "none" : "grayscale(1) opacity(0.3)",
                  }}
                >
                  {m.icon}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: isReached ? accentColor : "#555",
                    marginTop: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 工作流集成图 */}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 50,
          right: 50,
          opacity: fadeIn(frame, Math.round(durationInFrames * 0.35), 15),
        }}
      >
        <div style={{ fontSize: 16, color: accentColor, letterSpacing: 2, marginBottom: 20 }}>
          WORKFLOW INTEGRATION
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 16px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            border: `1px solid ${accentColor}22`,
          }}
        >
          {workflowItems.map((item, i) => {
            const itemDelay = Math.round(durationInFrames * 0.35) + staggerDelay(i, 8);
            const itemOpacity = fadeIn(frame, itemDelay, 10);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  opacity: itemOpacity,
                }}
              >
                <div style={{ fontSize: 28 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 差距拉开动画 */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 50,
          right: 50,
          opacity: fadeIn(frame, gapStart, 15),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: "#666" }}>普通人</div>
            <div style={{ fontSize: 28, marginTop: 4 }}>🚶</div>
          </div>
          <div
            style={{
              flex: 1,
              height: 2,
              margin: "0 20px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: `${100 - gapWidth}%`,
                height: 2,
                background: `linear-gradient(90deg, #666, ${accentColor})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${gapWidth}%`,
                top: -10,
                fontSize: 14,
                color: warningColor,
                opacity: gapWidth > 50 ? 1 : 0,
                whiteSpace: "nowrap",
              }}
            >
              断层差距
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: accentColor }}>早期入局者</div>
            <div style={{ fontSize: 28, marginTop: 4 }}>🚀</div>
          </div>
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
          🎯 {hope3Highlight}
        </div>
      </div>
    </AbsoluteFill>
  );
};
