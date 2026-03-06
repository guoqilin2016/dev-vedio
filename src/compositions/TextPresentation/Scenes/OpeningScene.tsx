import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCounter } from "../../../components/Transitions";
import { TextPresentationProps } from "../schema";
import { fadeInUp } from "./animations";

export const OpeningScene: React.FC<TextPresentationProps> = ({
  backgroundColor,
  accentColor,
  openingStyle,
  counterValue,
  counterSuffix,
  highlightColor,
  openingIcon,
  textColor,
  hookTitle,
  hookSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim1 = fadeInUp(frame, 0, fps);
  const anim2 = fadeInUp(frame, 0, fps, 15);
  const anim3 = fadeInUp(frame, 0, fps, 30);

  // 图标脉冲动画
  const iconPulse = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const iconScale = interpolate(iconPulse, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        flexDirection: "column",
        padding: 80,
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 开场内容 - 根据样式切换 */}
      {openingStyle === "counter" ? (
        /* 数据高亮 - 动态计数器 */
        <div
          style={{
            transform: `translateY(${anim1.y}px)`,
            opacity: anim1.opacity,
            letterSpacing: -2,
          }}
        >
          <AnimatedCounter
            targetValue={counterValue}
            duration={90}
            suffix={counterSuffix}
            fontSize={120}
            color={highlightColor}
          />
        </div>
      ) : (
        /* 图标 + 震撼标题模式 */
        <div
          style={{
            fontSize: 120,
            transform: `translateY(${anim1.y}px) scale(${iconScale})`,
            opacity: anim1.opacity,
            filter: `drop-shadow(0 0 30px ${highlightColor}66)`,
          }}
        >
          {openingIcon}
        </div>
      )}

      {/* 标题 */}
      <h1
        style={{
          fontSize: openingStyle === "title" ? 64 : 56,
          fontWeight: "bold",
          color: textColor,
          margin: "20px 0 0 0",
          transform: `translateY(${anim2.y}px)`,
          opacity: anim2.opacity,
          textAlign: "center",
          textShadow: openingStyle === "title" ? `0 0 40px ${highlightColor}44` : "none",
        }}
      >
        {hookTitle}
      </h1>

      {/* 副标题 */}
      <p
        style={{
          fontSize: 32,
          color: accentColor,
          marginTop: 20,
          transform: `translateY(${anim3.y}px)`,
          opacity: anim3.opacity,
          textAlign: "center",
        }}
      >
        {hookSubtitle}
      </p>
    </AbsoluteFill>
  );
};
