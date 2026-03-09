import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { OpenClawAIProps } from "./schema";
import {
  KaraokeSubtitle,
  SubtitleLine,
  generateSubtitleLines,
} from "../../components/KaraokeSubtitle";
import { SceneTransition } from "../../components/Transitions";

import { HookScene } from "./Scenes/HookScene";
import { AnxietyScene } from "./Scenes/AnxietyScene";
import { HopeTruth1Scene } from "./Scenes/HopeTruth1Scene";
import { HopeTruth2Scene } from "./Scenes/HopeTruth2Scene";
import { HopeTruth3Scene } from "./Scenes/HopeTruth3Scene";
import { SatisfactionScene } from "./Scenes/SatisfactionScene";
import { CTAScene } from "./Scenes/CTAScene";

const SCENE_COUNT = 7;
const DEFAULT_SCENE_DURATION = 270; // 9s at 30fps

const SCENES = [
  HookScene,
  AnxietyScene,
  HopeTruth1Scene,
  HopeTruth2Scene,
  HopeTruth3Scene,
  SatisfactionScene,
  CTAScene,
];

export const OpenClawAI: React.FC<OpenClawAIProps> = (props) => {
  const {
    sceneDurations,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    audio,
    accentColor,
  } = props;

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneStartFrames = useMemo(() => {
    if (sceneDurations && sceneDurations.length === SCENE_COUNT) {
      const starts: number[] = [0];
      for (let i = 0; i < SCENE_COUNT - 1; i++) {
        starts.push(starts[i] + sceneDurations[i]);
      }
      return starts;
    }
    return Array.from({ length: SCENE_COUNT }, (_, i) => i * DEFAULT_SCENE_DURATION);
  }, [sceneDurations]);

  const getSceneDuration = (index: number) => {
    if (sceneDurations && sceneDurations[index]) {
      return sceneDurations[index];
    }
    return DEFAULT_SCENE_DURATION;
  };

  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) return [];

    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }

    if (!voiceoverScripts) return [];

    return voiceoverScripts.map((script, index) => {
      const sceneStart = sceneStartFrames[index] ?? 0;
      const duration = getSceneDuration(index);
      const subtitleStart = sceneStart + Math.round(fps * 0.3);
      const subtitleDuration = duration - Math.round(fps * 1);
      return generateSubtitleLines(script, subtitleStart, subtitleDuration, fps);
    });
  }, [voiceoverScripts, subtitle.enabled, precomputedSubtitles, sceneStartFrames, fps]);

  const voiceoverFiles = audio.voiceoverAudioFiles || [];

  const currentSceneIndex = useMemo(() => {
    for (let i = SCENES.length - 1; i >= 0; i--) {
      if (frame >= sceneStartFrames[i]) return i;
    }
    return 0;
  }, [frame, sceneStartFrames]);

  const transitionDuration = 12;

  return (
    <AbsoluteFill>
      {/* 背景音乐 */}
      {audio.backgroundMusic && (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={(f) => {
            const fadeInVol = interpolate(f, [0, fps * 2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOutVol = interpolate(
              f,
              [durationInFrames - fps * 2, durationInFrames],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return Math.min(fadeInVol, fadeOutVol) * audio.backgroundMusicVolume;
          }}
          loop
        />
      )}

      {/* 场景配音 */}
      {audio.voiceoverEnabled &&
        voiceoverFiles.map((audioFile, index) => (
          <Sequence
            key={`vo-${index}`}
            from={sceneStartFrames[index] + Math.round(fps * 0.3)}
            durationInFrames={getSceneDuration(index)}
            premountFor={Math.round(fps * 0.5)}
          >
            <Audio src={staticFile(audioFile)} volume={audio.voiceoverVolume} />
          </Sequence>
        ))}

      {/* 场景序列 */}
      {SCENES.map((SceneComponent, index) => (
        <Sequence
          key={`scene-${index}`}
          from={sceneStartFrames[index]}
          durationInFrames={getSceneDuration(index)}
          premountFor={Math.round(fps * 0.5)}
        >
          <SceneTransition type="fade" durationInFrames={transitionDuration}>
            <SceneComponent {...props} />
          </SceneTransition>
        </Sequence>
      ))}

      {/* 竖屏进度条 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          width: 3,
          height: 100,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${((currentSceneIndex + 1) / SCENES.length) * 100}%`,
            backgroundColor: accentColor,
            borderRadius: 2,
            boxShadow: `0 0 8px ${accentColor}`,
            transition: "height 0.3s",
          }}
        />
      </div>

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
    </AbsoluteFill>
  );
};

export default OpenClawAI;
