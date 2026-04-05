import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { SceneTransition } from "../../components/Transitions";
import {
  KaraokeSubtitle,
  SubtitleLine,
  generateSubtitleLines,
} from "../../components/KaraokeSubtitle";
import type { AIHedgeFundProps } from "./schema";
import { HookScene } from "./Scenes/HookScene";
import { PainScene } from "./Scenes/PainScene";
import { CoreScene } from "./Scenes/CoreScene";
import { TeamScene } from "./Scenes/TeamScene";
import { DebateScene } from "./Scenes/DebateScene";
import { VerifyScene } from "./Scenes/VerifyScene";
import { CTAScene } from "./Scenes/CTAScene";

const SCENE_COUNT = 7;
const DEFAULT_SCENE_DURATION = 450;

const getSceneDuration = (durations: number[], index: number) => {
  const value = durations[index];
  return typeof value === "number" && !Number.isNaN(value)
    ? value
    : DEFAULT_SCENE_DURATION;
};

const SCENES: React.FC<AIHedgeFundProps>[] = [
  HookScene,
  PainScene,
  CoreScene,
  TeamScene,
  DebateScene,
  VerifyScene,
  CTAScene,
];

export const AIHedgeFund: React.FC<AIHedgeFundProps> = (props) => {
  const {
    sceneDurations,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    audio,
    accentColor,
    highlightColor,
    backgroundColor,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDurationList = useMemo(() => {
    if (sceneDurations?.length === SCENE_COUNT) {
      return sceneDurations;
    }
    return Array.from({ length: SCENE_COUNT }, () => DEFAULT_SCENE_DURATION);
  }, [sceneDurations]);

  const sceneStartFrames = useMemo(() => {
    const starts: number[] = [0];
    for (let index = 0; index < SCENE_COUNT - 1; index++) {
      starts.push(starts[index] + getSceneDuration(sceneDurationList, index));
    }
    return starts;
  }, [sceneDurationList]);

  const totalDurationInFrames = useMemo(
    () => sceneDurationList.reduce((sum, d) => sum + d, 0),
    [sceneDurationList],
  );

  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) {
      return [];
    }
    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }
    return voiceoverScripts.map((script, index) => {
      const sceneStart = sceneStartFrames[index] ?? 0;
      const duration = getSceneDuration(sceneDurationList, index);
      return generateSubtitleLines(
        script,
        sceneStart + Math.round(fps * 0.3),
        duration - Math.round(fps * 1),
        fps,
      );
    });
  }, [
    fps,
    precomputedSubtitles,
    sceneDurationList,
    sceneStartFrames,
    subtitle.enabled,
    voiceoverScripts,
  ]);

  const progressWidthPct = interpolate(
    frame,
    [0, Math.max(1, totalDurationInFrames - 1)],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const sceneProps: AIHedgeFundProps = {
    ...props,
    backgroundColor: "transparent",
  };

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {audio.backgroundMusic ? (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={audio.backgroundMusicVolume}
          loop
        />
      ) : null}

      {audio.voiceoverEnabled
        ? (audio.voiceoverAudioFiles ?? []).slice(0, SCENE_COUNT).map((audioFile, index) => (
            <Sequence
              key={`voice-${audioFile}`}
              from={(sceneStartFrames[index] ?? 0) + Math.round(fps * 0.3)}
              durationInFrames={getSceneDuration(sceneDurationList, index)}
              premountFor={Math.round(fps * 0.5)}
            >
              <Audio src={staticFile(audioFile)} volume={audio.voiceoverVolume} />
            </Sequence>
          ))
        : null}

      {SCENES.map((SceneComponent, index) => (
        <Sequence
          key={`scene-${index + 1}`}
          from={sceneStartFrames[index] ?? 0}
          durationInFrames={getSceneDuration(sceneDurationList, index)}
          premountFor={Math.round(fps * 0.5)}
        >
          <SceneTransition type="fade" durationInFrames={12}>
            <SceneBackground
              backgroundColor={backgroundColor}
              accentColor={accentColor}
              particles={{ count: 25, color: accentColor }}
              hud={{ color: highlightColor, animation: "pulse" }}
            >
              <SceneComponent {...sceneProps} />
            </SceneBackground>
          </SceneTransition>
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 405,
          left: 80,
          right: 80,
          height: 3,
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressWidthPct}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${highlightColor})`,
            boxShadow: `0 0 12px ${accentColor}`,
            borderRadius: 999,
          }}
        />
      </div>

      {subtitle.enabled && subtitleLines.length > 0 ? (
        <KaraokeSubtitle
          lines={subtitleLines}
          fontSize={subtitle.fontSize}
          textColor={subtitle.textColor}
          highlightColor={subtitle.highlightColor}
          backgroundColor={subtitle.backgroundColor}
          position={subtitle.position}
          style={{ bottom: 250 }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export default AIHedgeFund;
