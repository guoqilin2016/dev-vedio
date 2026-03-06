import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

interface TransitionProps {
  children: React.ReactNode;
  type?: "fade" | "slide-left" | "slide-right" | "slide-up" | "zoom";
  durationInFrames?: number;
}

/**
 * 场景转场动画组件
 */
export const SceneTransition: React.FC<TransitionProps> = ({
  children,
  type = "fade",
  durationInFrames = 15,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: totalDuration } = useVideoConfig();

  // 计算淡入淡出
  const fadeIn = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [totalDuration - durationInFrames, totalDuration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // 计算滑动/缩放
  const getTransform = () => {
    const slideIn = interpolate(frame, [0, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const slideOut = interpolate(
      frame,
      [totalDuration - durationInFrames, totalDuration],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    switch (type) {
      case "slide-left":
        return `translateX(${(slideIn - slideOut) * 100}px)`;
      case "slide-right":
        return `translateX(${(-slideIn + slideOut) * 100}px)`;
      case "slide-up":
        return `translateY(${(slideIn - slideOut) * 50}px)`;
      case "zoom":
        const scaleIn = interpolate(frame, [0, durationInFrames], [0.9, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scaleOut = interpolate(
          frame,
          [totalDuration - durationInFrames, totalDuration],
          [1, 1.1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        return `scale(${Math.min(scaleIn, 1) * Math.min(scaleOut, 1.1)})`;
      default:
        return "none";
    }
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: getTransform(),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * 单个进度点组件 - 用于独立计算 spring 动画
 */
interface ProgressDotProps {
  index: number;
  currentScene: number;
  accentColor: string;
  backgroundColor: string;
}

const ProgressDot: React.FC<ProgressDotProps> = ({
  index,
  currentScene,
  accentColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 是否为当前场景
  const isCurrentScene = index === currentScene;
  const isPastScene = index < currentScene;
  const isActive = isCurrentScene || isPastScene;

  // 基于帧的 spring 动画替代 CSS transition
  // 当成为当前场景时，宽度从 10 动画到 30
  const widthSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 }, // snappy 配置
  });

  // 计算宽度：当前场景为 30，其他为 10
  const width = isCurrentScene
    ? interpolate(widthSpring, [0, 1], [10, 30], { extrapolateRight: "clamp" })
    : 10;

  return (
    <div
      style={{
        width,
        height: 10,
        borderRadius: 5,
        backgroundColor: isActive ? accentColor : backgroundColor,
        boxShadow: isCurrentScene ? `0 0 10px ${accentColor}` : "none",
      }}
    />
  );
};

/**
 * 进度指示器组件
 */
interface ProgressIndicatorProps {
  currentScene: number;
  totalScenes: number;
  accentColor?: string;
  backgroundColor?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentScene,
  totalScenes,
  accentColor = "#ffd700",
  backgroundColor = "rgba(255,255,255,0.2)",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 12,
        zIndex: 50,
      }}
    >
      {Array.from({ length: totalScenes }).map((_, index) => (
        <ProgressDot
          key={index}
          index={index}
          currentScene={currentScene}
          accentColor={accentColor}
          backgroundColor={backgroundColor}
        />
      ))}
    </div>
  );
};

/**
 * 场景编号指示器
 */
interface SceneNumberProps {
  current: number;
  total: number;
  accentColor?: string;
}

export const SceneNumber: React.FC<SceneNumberProps> = ({
  current,
  total,
  accentColor = "#ffd700",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        right: 40,
        fontSize: 18,
        color: accentColor,
        fontFamily: "system-ui, sans-serif",
        fontWeight: "bold",
        opacity: 0.8,
        zIndex: 50,
      }}
    >
      {current + 1} / {total}
    </div>
  );
};

/**
 * 动态计数器组件
 */
interface AnimatedCounterProps {
  targetValue: number;
  duration?: number; // 帧数
  suffix?: string;
  fontSize?: number;
  color?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  duration = 60,
  suffix = "",
  fontSize = 120,
  color = "#ffd700",
}) => {
  const frame = useCurrentFrame();

  // 使用缓动函数让计数更自然
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 缓动：先快后慢
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const currentValue = Math.round(easedProgress * targetValue);

  // 格式化数字（添加逗号分隔）
  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + "亿";
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(0) + "万";
    }
    return num.toLocaleString();
  };

  return (
    <span
      style={{
        fontSize,
        fontWeight: "900",
        color,
        fontFamily: "system-ui, sans-serif",
        textShadow: `0 0 60px ${color}66`,
      }}
    >
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
};

export default SceneTransition;
