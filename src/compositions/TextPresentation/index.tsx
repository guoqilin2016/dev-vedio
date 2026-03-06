import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  Video,
  staticFile,
} from "remotion";
import { TextPresentationProps } from "./schema";
import {
  KaraokeSubtitle,
  SubtitleLine,
  generateSubtitleLines,
} from "../../components/KaraokeSubtitle";
import {
  SceneTransition,
  ProgressIndicator,
} from "../../components/Transitions";

// Import Scenes
import { OpeningScene } from "./Scenes/OpeningScene";
import { ComparisonScene } from "./Scenes/ComparisonScene";
import { PainPointScene } from "./Scenes/PainPointScene";
import { StepsScene } from "./Scenes/StepsScene";
import { CaseScene } from "./Scenes/CaseScene";
import { EndingScene } from "./Scenes/EndingScene";

export const TextPresentation: React.FC<TextPresentationProps> = (props) => {
  const {
    sceneDurations,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    audio,
    highlightColor,
    digitalHuman,
  } = props;

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 场景配置 - 使用传入的时长或默认值
  const defaultSceneDuration = 180; // 默认每个场景6秒 (30fps * 6)
  
  // 计算每个场景的开始帧
  const sceneStartFrames = useMemo(() => {
    if (sceneDurations && sceneDurations.length === 6) {
      const starts: number[] = [0];
      for (let i = 0; i < 5; i++) {
        starts.push(starts[i] + sceneDurations[i]);
      }
      return starts;
    }
    return [0, 1, 2, 3, 4, 5].map((i) => i * defaultSceneDuration);
  }, [sceneDurations]);

  // 获取每个场景的时长
  const getSceneDuration = (index: number) => {
    if (sceneDurations && sceneDurations[index]) {
      return sceneDurations[index];
    }
    return defaultSceneDuration;
  };

  // 生成字幕数据 - 优先使用预计算的数据
  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) return [];
    
    // 如果有预计算的字幕数据，直接使用
    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }
    
    // 否则动态生成
    if (!voiceoverScripts) return [];

    return voiceoverScripts.map((script, index) => {
      const sceneStart = sceneStartFrames[index];
      const duration = getSceneDuration(index);
      const subtitleStart = sceneStart + Math.round(fps * 0.3); // 0.3秒后开始
      const subtitleDuration = duration - Math.round(fps * 1); // 留1秒缓冲

      return generateSubtitleLines(script, subtitleStart, subtitleDuration, fps);
    });
  }, [voiceoverScripts, subtitle.enabled, precomputedSubtitles, sceneStartFrames, fps]);

  // 配音音频文件
  const voiceoverFiles = audio.voiceoverAudioFiles || [];

  // 场景组件列表
  const scenes = [
    OpeningScene,
    ComparisonScene,
    PainPointScene,
    StepsScene,
    CaseScene,
    EndingScene
  ];

  // 计算当前场景索引
  const currentSceneIndex = useMemo(() => {
    for (let i = scenes.length - 1; i >= 0; i--) {
      if (frame >= sceneStartFrames[i]) {
        return i;
      }
    }
    return 0;
  }, [frame, sceneStartFrames, scenes.length]);

  // 转场动画时长（帧数）
  const transitionDuration = 15;

  // 渲染当前场景
  return (
    <AbsoluteFill>
      {/* 背景音乐 - 带淡入淡出 */}
      {audio.backgroundMusic && (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={(f) => {
            // 淡入（前2秒）
            const fadeInVol = interpolate(f, [0, fps * 2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // 淡出（后2秒）
            const fadeOutVol = interpolate(
              f,
              [durationInFrames - fps * 2, durationInFrames],
              [1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            return Math.min(fadeInVol, fadeOutVol) * audio.backgroundMusicVolume;
          }}
          loop
        />
      )}

      {/* 场景配音音频 */}
      {audio.voiceoverEnabled &&
        voiceoverFiles.map((audioFile, index) => (
          <Sequence
            key={`voiceover-${index}`}
            from={sceneStartFrames[index] + Math.round(fps * 0.3)} // 0.3秒延迟开始
            durationInFrames={getSceneDuration(index)}
          >
            <Audio
              src={staticFile(audioFile)}
              volume={audio.voiceoverVolume}
            />
          </Sequence>
        ))}

      {/* 场景序列 - 带转场动画 */}
      {scenes.map((SceneComponent, index) => (
        <Sequence
          key={`scene-${index}`}
          from={sceneStartFrames[index]}
          durationInFrames={getSceneDuration(index)}
        >
          <SceneTransition type="fade" durationInFrames={transitionDuration}>
            <SceneComponent {...props} />
          </SceneTransition>
        </Sequence>
      ))}

      {/* 进度指示器 */}
      <ProgressIndicator
        currentScene={currentSceneIndex}
        totalScenes={scenes.length}
        accentColor={highlightColor}
      />

      {/* 卡拉OK字幕 */}
      {subtitle.enabled && subtitleLines.length > 0 && (
        <KaraokeSubtitle
          lines={subtitleLines}
          fontSize={subtitle.fontSize}
          textColor={subtitle.textColor}
          highlightColor={subtitle.highlightColor}
          backgroundColor={subtitle.backgroundColor}
          position={subtitle.position}
        />
      )}

      {/* 数字人视频叠加 */}
      {digitalHuman.enabled &&
        digitalHuman.videos &&
        digitalHuman.videos.map((videoPath, index) => {
          // 计算数字人视频位置
          const getPositionStyle = (): React.CSSProperties => {
            const margin = 40;
            switch (digitalHuman.position) {
              case "left":
                return { left: margin, top: "50%", transform: "translateY(-50%)" };
              case "center":
                return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
              case "corner":
                return { right: margin, bottom: margin + 100 }; // 留出字幕空间
              case "right":
              default:
                return { right: margin, top: "50%", transform: "translateY(-50%)" };
            }
          };

          return (
            <Sequence
              key={`digital-human-${index}`}
              from={sceneStartFrames[index]}
              durationInFrames={getSceneDuration(index)}
            >
              <div
                style={{
                  position: "absolute",
                  ...getPositionStyle(),
                  width: `${digitalHuman.scale * 100}%`,
                  borderRadius: digitalHuman.borderRadius,
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  border: "3px solid rgba(255,255,255,0.2)",
                }}
              >
                <Video
                  src={staticFile(videoPath)}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};

export default TextPresentation;
