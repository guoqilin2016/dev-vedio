import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AIHedgeFundProps } from "../schema";
import { fadeInUp, numberCountUp } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

const parseStarTarget = (hookStarCount: string): number => {
  const digits = hookStarCount.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : 50000;
};

const formatStarCount = (value: number): string =>
  `${value.toLocaleString("en-US")}+`;

/** Smooth handoff from “cover hold” (opacity 1) into delayed fadeInUp without a one-frame pop. */
const blendHoldIntoFade = (
  frame: number,
  holdStart: number,
  holdEnd: number,
  fade: { opacity: number; y: number },
): { opacity: number; y: number } => {
  const hold = interpolate(frame, [holdStart, holdEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: fade.opacity + hold * (1 - fade.opacity),
    y: fade.y * (1 - hold),
  };
};

export const HookScene: React.FC<AIHedgeFundProps> = ({
  hookTitle,
  hookStarCount,
  hookSubtitle,
  hookRepoName,
  hookRepoDesc,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const targetStars = parseStarTarget(hookStarCount);
  const coverPhase = frame < 5;
  const animatedCount = numberCountUp(frame, fps, targetStars, 2, 5);
  const starLabel = coverPhase ? hookStarCount : formatStarCount(animatedCount);

  const starSpring = spring({
    frame: coverPhase ? 24 : frame - 5,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  const starScale = coverPhase ? 1 : interpolate(starSpring, [0, 1], [0.94, 1]);

  const repoFade = fadeInUp(frame, fps, 10);
  const repo = blendHoldIntoFade(frame, 10, 22, repoFade);

  const archFade = fadeInUp(frame, fps, 25);
  const arch = blendHoldIntoFade(frame, 25, 35, archFade);

  const subFade = fadeInUp(frame, fps, 35);
  const sub = blendHoldIntoFade(frame, 35, 45, subFade);

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 60,
          right: 60,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          boxSizing: "border-box",
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 52,
            letterSpacing: 14,
            fontWeight: 900,
            ...textWrap,
            textAlign: "center",
            marginBottom: -12,
            background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${highlightColor}40, 0 0 80px ${accentColor}20`,
          }}
        >
          {hookTitle}
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            color: highlightColor,
            textShadow: `0 0 40px ${highlightColor}55`,
            ...textWrap,
            textAlign: "center",
            transform: `scale(${starScale})`,
            transformOrigin: "center center",
          }}
        >
          {starLabel}
        </div>

        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 12,
            border: `1px solid ${accentColor}`,
            background: panelColor,
            padding: "20px 22px",
            boxSizing: "border-box",
            opacity: repo.opacity,
            transform: `translateY(${repo.y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: highlightColor,
              marginBottom: 10,
              ...textWrap,
            }}
          >
            {hookRepoName}
          </div>
          <div
            style={{
              fontSize: 22,
              color: textColor,
              marginBottom: 14,
              ...textWrap,
            }}
          >
            {hookRepoDesc}
          </div>
          <div
            style={{
              fontSize: 18,
              color: mutedTextColor,
              ...textWrap,
            }}
          >
            ⭐ 50k+ | 📦 Python | 📄 MIT
          </div>
        </div>

        <div
          style={{
            width: "100%",
            minWidth: 0,
            borderRadius: 12,
            border: `1px solid ${highlightColor}40`,
            background: panelColor,
            padding: 12,
            boxSizing: "border-box",
            opacity: arch.opacity,
            transform: `translateY(${arch.y}px)`,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("images/ai-hedge-fund-arch.png")}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: highlightColor,
            textAlign: "center",
            opacity: sub.opacity,
            transform: `translateY(${sub.y}px)`,
            ...textWrap,
          }}
        >
          {hookSubtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
