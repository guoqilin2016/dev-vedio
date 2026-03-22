import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { fadeInUp, glitchOffset, numberCountUp } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

export const HookScene: React.FC<GSDIntroProps> = ({
  hookTitle,
  hookSubtitle,
  hookStars,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  goldColor,
  terminalGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coverPhase = frame < 3;

  const glitch = glitchOffset(frame, 1.2);
  const useGlitch = !coverPhase && frame > 10;

  const subtitleAnim = fadeInUp(frame, fps, Math.round(fps * 0.8), 50);
  const subtitleOpacity = coverPhase ? 1 : subtitleAnim.opacity;
  const subtitleY = coverPhase ? 0 : subtitleAnim.y;

  const statsStart = Math.round(fps * 1.4);
  const starK = Math.max(1, hookStars / 1000);
  const countedK = coverPhase
    ? Math.floor(starK)
    : numberCountUp(frame, fps, starK, 1.6, statsStart);
  const statsAnim = fadeInUp(frame, fps, statsStart, 36);
  const statsOpacity = coverPhase ? 1 : statsAnim.opacity;
  const statsY = coverPhase ? 0 : statsAnim.y;

  const cursorBlink =
    Math.floor(frame / Math.max(1, Math.round(fps * 0.4))) % 2 === 0 ? 1 : 0;

  const titleSpring = spring({
    frame: coverPhase ? 30 : frame,
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const titleScale = coverPhase ? 1 : interpolate(titleSpring, [0, 1], [0.96, 1]);

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 40,
        speed: 0.45,
        color: terminalGreen,
        opacity: 0.4,
      }}
      glow={{
        orbs: [
          {
            x: "50%",
            y: "38%",
            color: accentColor,
            radius: 520,
            opacity: 0.14,
            pulseSpeed: 0.55,
            pulseAmount: 0.22,
          },
          {
            x: "20%",
            y: "65%",
            color: terminalGreen,
            radius: 280,
            opacity: 0.08,
            pulseSpeed: 0.7,
            pulseAmount: 0.18,
          },
        ],
      }}
      scanlines
      hud={{ color: accentColor, animation: "pulse" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: accentColor,
            letterSpacing: 10,
            fontWeight: 800,
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          GET SHIT DONE
        </div>

        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginBottom: 20,
            transform: useGlitch
              ? `translateX(${glitch.x}px) skewX(${glitch.skew}deg) scale(${titleScale})`
              : `scale(${titleScale})`,
          }}
        >
          {useGlitch && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 62,
                fontWeight: 900,
                color: accentColor,
                transform: `translateX(${glitch.x > 0 ? 4 : -4}px)`,
                opacity: Math.abs(glitch.x) > 0.5 ? 0.65 : 0,
                mixBlendMode: "screen",
                pointerEvents: "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {hookTitle}
            </div>
          )}
          <div
            style={{
              position: "relative",
              fontSize: 62,
              fontWeight: 900,
              color: textColor,
              lineHeight: 1.15,
              whiteSpace: "pre-wrap",
            }}
          >
            {hookTitle}
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 18,
                marginLeft: 6,
                verticalAlign: "middle",
                backgroundColor: terminalGreen,
                opacity: cursorBlink,
                boxShadow: `0 0 12px ${terminalGreen}`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 36,
            color: highlightColor,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.35,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginBottom: 36,
            maxWidth: 920,
          }}
        >
          {hookSubtitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: statsOpacity,
            transform: `translateY(${statsY}px)`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: goldColor,
              clipPath: STAR_CLIP,
              boxShadow: `0 0 24px ${goldColor}, 0 0 48px ${goldColor}66`,
            }}
          />
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: goldColor,
              fontFamily: "monospace",
              letterSpacing: -2,
              textShadow: `0 0 28px ${goldColor}99`,
            }}
          >
            {countedK}k+
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};
