/**
 * 官方转场组件 - 基于 @remotion/transitions
 * 支持多种转场效果和 Light Leaks 光晕
 */
import React from "react";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { LightLeak } from "@remotion/light-leaks";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

// ============ 类型定义 ============

export type TransitionType =
  | "none"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "wipe"
  | "flip";

export type TimingType = "linear" | "spring";

export interface SceneConfig {
  /** 场景组件 */
  component: React.ReactNode;
  /** 场景时长（帧数） */
  durationInFrames: number;
  /** 进入此场景的转场类型 */
  transitionType?: TransitionType;
  /** 转场时长（帧数） */
  transitionDuration?: number;
  /** 转场时间函数 */
  timingType?: TimingType;
  /** 是否使用 Light Leak 叠加效果（在场景开头） */
  useLightLeak?: boolean;
  /** Light Leak 时长（帧数） */
  lightLeakDuration?: number;
  /** Light Leak 种子（影响图案） */
  lightLeakSeed?: number;
  /** Light Leak 色调偏移 (0-360) */
  lightLeakHueShift?: number;
}

interface OfficialTransitionSeriesProps {
  /** 场景配置数组 */
  scenes: SceneConfig[];
  /** 默认转场类型 */
  defaultTransitionType?: TransitionType;
  /** 默认转场时长（帧数） */
  defaultTransitionDuration?: number;
  /** 默认时间函数 */
  defaultTimingType?: TimingType;
}

// ============ 转场效果工厂 ============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPresentation(type: TransitionType): any {
  switch (type) {
    case "fade":
      return fade();
    case "slide-left":
      return slide({ direction: "from-left" });
    case "slide-right":
      return slide({ direction: "from-right" });
    case "slide-up":
      return slide({ direction: "from-top" });
    case "slide-down":
      return slide({ direction: "from-bottom" });
    case "wipe":
      return wipe({ direction: "from-left" });
    case "flip":
      return flip({ direction: "from-left" });
    case "none":
    default:
      return null;
  }
}

function getTiming(type: TimingType, durationInFrames: number) {
  switch (type) {
    case "spring":
      return springTiming({
        config: { damping: 200 }, // smooth 配置
        durationInFrames,
      });
    case "linear":
    default:
      return linearTiming({ durationInFrames });
  }
}

// ============ 带 Light Leak 的场景包装器 ============

interface SceneWithLightLeakProps {
  children: React.ReactNode;
  useLightLeak?: boolean;
  lightLeakDuration?: number;
  lightLeakSeed?: number;
  lightLeakHueShift?: number;
  sceneDuration: number;
}

const SceneWithLightLeak: React.FC<SceneWithLightLeakProps> = ({
  children,
  useLightLeak = false,
  lightLeakDuration = 30,
  lightLeakSeed = 0,
  lightLeakHueShift = 0,
  sceneDuration,
}) => {
  return (
    <AbsoluteFill>
      {children}
      {useLightLeak && (
        <Sequence from={0} durationInFrames={lightLeakDuration}>
          <LightLeak
            durationInFrames={lightLeakDuration}
            seed={lightLeakSeed}
            hueShift={lightLeakHueShift}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// ============ 主转场系列组件 ============

export const OfficialTransitionSeries: React.FC<
  OfficialTransitionSeriesProps
> = ({
  scenes,
  defaultTransitionType = "fade",
  defaultTransitionDuration = 15,
  defaultTimingType = "linear",
}) => {
  const { fps } = useVideoConfig();

  // 构建 TransitionSeries 的子元素
  const elements: React.ReactNode[] = [];

  scenes.forEach((scene, index) => {
    const isFirstScene = index === 0;
    const transitionType = scene.transitionType ?? defaultTransitionType;
    const transitionDuration =
      scene.transitionDuration ?? defaultTransitionDuration;
    const timingType = scene.timingType ?? defaultTimingType;

    // 如果不是第一个场景，添加转场效果
    if (!isFirstScene && transitionType !== "none") {
      const presentation = getPresentation(transitionType);
      if (presentation) {
        elements.push(
          <TransitionSeries.Transition
            key={`transition-${index}`}
            presentation={presentation}
            timing={getTiming(timingType, transitionDuration)}
          />
        );
      }
    }

    // 添加场景（可能包含 Light Leak）
    const lightLeakDuration = scene.lightLeakDuration ?? Math.round(fps * 1);
    elements.push(
      <TransitionSeries.Sequence
        key={`scene-${index}`}
        durationInFrames={scene.durationInFrames}
      >
        <SceneWithLightLeak
          useLightLeak={scene.useLightLeak}
          lightLeakDuration={lightLeakDuration}
          lightLeakSeed={scene.lightLeakSeed ?? index}
          lightLeakHueShift={scene.lightLeakHueShift ?? 0}
          sceneDuration={scene.durationInFrames}
        >
          {scene.component}
        </SceneWithLightLeak>
      </TransitionSeries.Sequence>
    );
  });

  return <TransitionSeries>{elements}</TransitionSeries>;
};

// ============ 简化版本：带 Light Leaks 的场景序列 ============

interface SimpleLightLeakSeriesProps {
  /** 场景组件数组 */
  children: React.ReactNode[];
  /** 每个场景的时长数组 */
  durations: number[];
  /** Light Leak 时长（帧数） */
  lightLeakDuration?: number;
  /** Light Leak 色调偏移 (0-360)，可以是数字或数组 */
  hueShift?: number | number[];
  /** 转场类型 */
  transitionType?: TransitionType;
  /** 转场时长（帧数） */
  transitionDuration?: number;
}

export const SimpleLightLeakSeries: React.FC<SimpleLightLeakSeriesProps> = ({
  children,
  durations,
  lightLeakDuration = 30,
  hueShift = 0,
  transitionType = "fade",
  transitionDuration = 15,
}) => {
  const elements: React.ReactNode[] = [];

  React.Children.forEach(children, (child, index) => {
    const duration = durations[index] || 180;
    const currentHueShift = Array.isArray(hueShift)
      ? hueShift[index] ?? 0
      : hueShift;

    // 不是第一个场景时添加转场
    if (index > 0) {
      const presentation = getPresentation(transitionType);
      if (presentation) {
        elements.push(
          <TransitionSeries.Transition
            key={`transition-${index}`}
            presentation={presentation}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        );
      }
    }

    // 场景内部添加 Light Leak（仅对非第一个场景）
    const showLightLeak = index > 0;
    elements.push(
      <TransitionSeries.Sequence
        key={`scene-${index}`}
        durationInFrames={duration}
      >
        <SceneWithLightLeak
          useLightLeak={showLightLeak}
          lightLeakDuration={lightLeakDuration}
          lightLeakSeed={index}
          lightLeakHueShift={currentHueShift}
          sceneDuration={duration}
        >
          {child}
        </SceneWithLightLeak>
      </TransitionSeries.Sequence>
    );
  });

  return <TransitionSeries>{elements}</TransitionSeries>;
};

// ============ 简化版本：带淡入淡出的场景序列 ============

interface SimpleFadeSeriesProps {
  /** 场景组件数组 */
  children: React.ReactNode[];
  /** 每个场景的时长数组 */
  durations: number[];
  /** 转场时长（帧数） */
  transitionDuration?: number;
}

export const SimpleFadeSeries: React.FC<SimpleFadeSeriesProps> = ({
  children,
  durations,
  transitionDuration = 15,
}) => {
  const elements: React.ReactNode[] = [];

  React.Children.forEach(children, (child, index) => {
    // 不是第一个场景时添加淡入淡出
    if (index > 0) {
      elements.push(
        <TransitionSeries.Transition
          key={`transition-${index}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />
      );
    }

    elements.push(
      <TransitionSeries.Sequence
        key={`scene-${index}`}
        durationInFrames={durations[index] || 180}
      >
        {child}
      </TransitionSeries.Sequence>
    );
  });

  return <TransitionSeries>{elements}</TransitionSeries>;
};

// ============ 工具函数 ============

/**
 * 计算使用转场后的总时长
 * 转场会缩短总时长，因为两个场景在转场期间同时播放
 */
export function calculateTotalDuration(
  sceneDurations: number[],
  transitionDurations: number[]
): number {
  const totalSceneDuration = sceneDurations.reduce((sum, d) => sum + d, 0);
  const totalTransitionDuration = transitionDurations.reduce(
    (sum, d) => sum + d,
    0
  );
  return totalSceneDuration - totalTransitionDuration;
}

/**
 * 从场景配置计算总时长
 */
export function calculateDurationFromScenes(
  scenes: SceneConfig[],
  defaultTransitionDuration: number = 15
): number {
  let total = 0;

  scenes.forEach((scene, index) => {
    total += scene.durationInFrames;

    // 转场会缩短时长（Light Leak 不会）
    if (index > 0 && !scene.useLightLeak) {
      const transitionDuration =
        scene.transitionDuration ?? defaultTransitionDuration;
      total -= transitionDuration;
    }
  });

  return total;
}

export default OfficialTransitionSeries;
