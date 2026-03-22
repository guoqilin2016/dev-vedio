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
import { GSDIntroProps } from "./schema";
import { HookScene } from "./Scenes/HookScene";
import { PainScene } from "./Scenes/PainScene";
import { CreatorScene } from "./Scenes/CreatorScene";
import { CoreScene } from "./Scenes/CoreScene";
import { WorkflowScene } from "./Scenes/WorkflowScene";
import { ImpactScene } from "./Scenes/ImpactScene";
import { CTAScene } from "./Scenes/CTAScene";
import {
  KaraokeSubtitle,
  SubtitleLine,
  SubtitleWord,
} from "../../components/KaraokeSubtitle";
import { SceneTransition } from "../../components/Transitions";

const SCENE_COUNT = 7;

const SCENES: React.FC<GSDIntroProps>[] = [
  HookScene,
  PainScene,
  CreatorScene,
  CoreScene,
  WorkflowScene,
  ImpactScene,
  CTAScene,
];

function generateSubtitleLines(
  scripts: string[],
  sceneStarts: number[],
  sceneDurs: number[],
  fps: number,
): SubtitleLine[] {
  const lines: SubtitleLine[] = [];
  const voiceDelay = Math.round(fps * 0.3);

  scripts.forEach((script, i) => {
    const start = (sceneStarts[i] ?? 0) + voiceDelay;
    const dur = Math.max(1, (sceneDurs[i] ?? 0) - voiceDelay);
    const chars = script.split("");
    const totalChars = chars.length;
    if (totalChars === 0) {
      return;
    }

    let currentFrame = start;
    let currentWord = "";
    let wordStartFrame = currentFrame;
    const words: SubtitleWord[] = [];

    const flushWord = () => {
      if (currentWord.length > 0) {
        const wordDur = Math.max(
          2,
          Math.round((currentWord.length / totalChars) * dur),
        );
        words.push({
          text: currentWord,
          startFrame: wordStartFrame,
          endFrame: Math.min(wordStartFrame + wordDur, start + dur),
        });
        currentFrame = wordStartFrame + wordDur;
        wordStartFrame = currentFrame;
        currentWord = "";
      }
    };

    for (const char of chars) {
      if (/[，。！？、：；]/.test(char)) {
        flushWord();
        words.push({
          text: char,
          startFrame: currentFrame,
          endFrame: Math.min(currentFrame + 2, start + dur),
        });
        currentFrame += 2;
        wordStartFrame = currentFrame;
      } else {
        currentWord += char;
        if (currentWord.length >= 4) {
          flushWord();
        }
      }
    }
    flushWord();

    if (words.length > 0) {
      lines.push({
        words,
        startFrame: words[0].startFrame,
        endFrame: words[words.length - 1].endFrame,
      });
    }
  });

  return lines;
}

export const GSDIntro: React.FC<GSDIntroProps> = (props) => {
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

  const defaultSceneDuration = Math.floor(durationInFrames / SCENE_COUNT);

  const sceneStartFrames = useMemo(() => {
    if (sceneDurations && sceneDurations.length === SCENE_COUNT) {
      const starts: number[] = [0];
      for (let i = 0; i < SCENE_COUNT - 1; i++) {
        starts.push(starts[i] + sceneDurations[i]);
      }
      return starts;
    }
    return Array.from(
      { length: SCENE_COUNT },
      (_, i) => i * defaultSceneDuration,
    );
  }, [sceneDurations, defaultSceneDuration]);

  const getSceneDuration = (index: number) => {
    if (sceneDurations && sceneDurations[index]) {
      return sceneDurations[index];
    }
    return defaultSceneDuration;
  };

  const sceneDurationList = useMemo(() => {
    return Array.from({ length: SCENE_COUNT }, (_, i) => {
      if (sceneDurations && sceneDurations[i]) {
        return sceneDurations[i];
      }
      return defaultSceneDuration;
    });
  }, [sceneDurations, defaultSceneDuration]);

  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) {
      return [];
    }

    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }

    if (!voiceoverScripts || voiceoverScripts.length === 0) {
      return [];
    }

    return generateSubtitleLines(
      voiceoverScripts,
      sceneStartFrames,
      sceneDurationList,
      fps,
    );
  }, [
    subtitle.enabled,
    precomputedSubtitles,
    voiceoverScripts,
    sceneStartFrames,
    sceneDurationList,
    fps,
  ]);

  const voiceoverOffset = Math.round(fps * 0.3);

  const currentSceneIndex = useMemo(() => {
    for (let i = SCENE_COUNT - 1; i >= 0; i--) {
      if (frame >= sceneStartFrames[i]) {
        return i;
      }
    }
    return 0;
  }, [frame, sceneStartFrames]);

  const transitionDuration = 12;

  return (
    <AbsoluteFill>
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
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return Math.min(fadeInVol, fadeOutVol) * audio.backgroundMusicVolume;
          }}
          loop
        />
      )}

      {audio.voiceoverEnabled &&
        Array.from({ length: SCENE_COUNT }, (_, index) => (
          <Sequence
            key={`vo-${index}`}
            from={sceneStartFrames[index] + voiceoverOffset}
            durationInFrames={getSceneDuration(index)}
            premountFor={Math.round(fps * 0.5)}
          >
            <Audio
              src={staticFile(`audio/gsd-scene${index + 1}.mp3`)}
              volume={audio.voiceoverVolume}
            />
          </Sequence>
        ))}

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
            height: `${((currentSceneIndex + 1) / SCENE_COUNT) * 100}%`,
            backgroundColor: accentColor,
            borderRadius: 2,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
      </div>

      {subtitle.enabled && subtitleLines.length > 0 && (
        <KaraokeSubtitle
          lines={subtitleLines}
          fontSize={subtitle.fontSize}
          textColor={subtitle.textColor}
          highlightColor={subtitle.highlightColor}
          backgroundColor={subtitle.backgroundColor}
          position={subtitle.position}
          style={{ bottom: 380 }}
        />
      )}
    </AbsoluteFill>
  );
};

export default GSDIntro;
