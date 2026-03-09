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

const ChatBubble: React.FC<{
  text: string;
  isAI?: boolean;
  frame: number;
  fps: number;
  delay: number;
  accentColor: string;
}> = ({ text, isAI, frame, fps, delay, accentColor }) => {
  const anim = fadeInUp(frame, fps, delay, 30);
  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
        alignSelf: isAI ? "flex-start" : "flex-end",
        maxWidth: "80%",
        padding: "16px 24px",
        borderRadius: 20,
        borderBottomLeftRadius: isAI ? 4 : 20,
        borderBottomRightRadius: isAI ? 20 : 4,
        background: isAI
          ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`
          : "rgba(255,255,255,0.1)",
        border: `1px solid ${isAI ? accentColor + "44" : "rgba(255,255,255,0.15)"}`,
        fontSize: 22,
        color: isAI ? accentColor : "#e0e0e0",
        lineHeight: 1.5,
      }}
    >
      {isAI && (
        <div style={{ fontSize: 12, color: accentColor, marginBottom: 6, letterSpacing: 2 }}>
          AI AGENT
        </div>
      )}
      {text}
    </div>
  );
};

const TaskCard: React.FC<{
  icon: string;
  label: string;
  status: string;
  frame: number;
  fps: number;
  delay: number;
  accentColor: string;
}> = ({ icon, label, status, frame, fps, delay, accentColor }) => {
  const anim = fadeInUp(frame, fps, delay, 20);
  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        border: `1px solid ${accentColor}22`,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, color: "#e0e0e0" }}>{label}</div>
      </div>
      <div
        style={{
          fontSize: 14,
          color: accentColor,
          padding: "4px 12px",
          borderRadius: 20,
          border: `1px solid ${accentColor}44`,
        }}
      >
        {status}
      </div>
    </div>
  );
};

export const HopeTruth1Scene: React.FC<OpenClawAIProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  hope1Title,
  hope1Number,
  hope1Content,
  hope1Highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const numberAnim = fadeInUp(frame, fps, 0, 40);
  const titleAnim = fadeInUp(frame, fps, 8, 40);

  const chatStart = Math.round(fps * 1.5);
  const taskStart = Math.round(durationInFrames * 0.5);

  const highlightAnim = spring({
    frame: frame - Math.round(durationInFrames * 0.75),
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
      {/* 背景辐射 */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}0a 0%, transparent 70%)`,
          transform: "translateX(-50%)",
        }}
      />

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
          {hope1Number}
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: accentColor,
            opacity: 0.5,
          }}
        />
        <div style={{ fontSize: 16, color: accentColor, letterSpacing: 3 }}>
          TRUTH
        </div>
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
          textShadow: `0 0 30px ${accentColor}33`,
        }}
      >
        {hope1Title}
      </div>

      {/* 说明文字 */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          fontSize: 24,
          color: "#999",
          opacity: fadeIn(frame, 15, 15),
          lineHeight: 1.6,
        }}
      >
        {hope1Content}
      </div>

      {/* 聊天演示区 */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <ChatBubble
          text="帮我整理今天的邮件，回复紧急的"
          frame={frame}
          fps={fps}
          delay={chatStart}
          accentColor={accentColor}
        />
        <ChatBubble
          text="已接管邮箱，发现3封紧急邮件，正在自动处理..."
          isAI
          frame={frame}
          fps={fps}
          delay={chatStart + 20}
          accentColor={accentColor}
        />
      </div>

      {/* 任务执行面板 */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: fadeIn(frame, taskStart, 15),
        }}
      >
        <div style={{ fontSize: 14, color: accentColor, letterSpacing: 2, marginBottom: 8 }}>
          TASK QUEUE
        </div>
        {[
          { icon: "📧", label: "邮件筛选与回复", status: "✓ 完成" },
          { icon: "🌐", label: "浏览器数据采集", status: "运行中" },
          { icon: "📊", label: "报告自动生成", status: "排队中" },
        ].map((task, i) => (
          <TaskCard
            key={i}
            {...task}
            frame={frame}
            fps={fps}
            delay={taskStart + i * 12}
            accentColor={accentColor}
          />
        ))}
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
          💡 {hope1Highlight}
        </div>
      </div>
    </AbsoluteFill>
  );
};
