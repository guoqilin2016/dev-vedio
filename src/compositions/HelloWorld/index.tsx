import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HelloWorldProps } from "./schema";

export const HelloWorld: React.FC<HelloWorldProps> = ({
  title = "Hello, Remotion!",
  subtitle = "视频生成演示",
  backgroundColor = "#0f0f23",
  textColor = "#ffffff",
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 标题动画
  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // 副标题动画（延迟出现）
  const subtitleSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const subtitleY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  // 背景装饰动画
  const rotation = interpolate(frame, [0, durationInFrames], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
          transform: `rotate(${rotation}deg)`,
          filter: "blur(60px)",
        }}
      />

      {/* 标题 */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: "bold",
          color: textColor,
          margin: 0,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textShadow: `0 4px 30px ${accentColor}66`,
        }}
      >
        {title}
      </h1>

      {/* 副标题 */}
      <p
        style={{
          fontSize: 36,
          color: accentColor,
          margin: 0,
          marginTop: 20,
          transform: `translateY(${subtitleY}px)`,
          opacity: Math.max(0, subtitleOpacity),
          letterSpacing: 4,
        }}
      >
        {subtitle}
      </p>

      {/* 底部装饰线 */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: interpolate(frame, [30, 60], [0, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 3,
          backgroundColor: accentColor,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};

export default HelloWorld;
