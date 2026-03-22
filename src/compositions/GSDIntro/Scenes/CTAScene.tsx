import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { fadeIn, fadeInUp, pulseGlow, scaleIn } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

export const CTAScene: React.FC<GSDIntroProps> = ({
  ctaSlogan,
  ctaCommand,
  ctaGithub,
  ctaTags,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  terminalGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sloganAnim = fadeInUp(frame, fps, Math.round(fps * 0.2), 52);
  const terminalDelay = Math.round(fps * 0.55);
  const terminalScale = scaleIn(frame, fps, terminalDelay);
  const glow = pulseGlow(frame, fps, 1.2);
  const followDelay = Math.round(fps * 1.8);
  const followOpacity = fadeIn(frame, followDelay, Math.round(fps * 0.5));

  const cursorBlink =
    Math.floor(frame / Math.max(1, Math.round(fps * 0.4))) % 2 === 0 ? 1 : 0;

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 38,
        speed: 0.42,
        color: accentColor,
        opacity: 0.36,
      }}
      glow={{
        orbs: [
          {
            x: "50%",
            y: "42%",
            color: accentColor,
            radius: 520,
            opacity: 0.14,
            pulseSpeed: 0.55,
            pulseAmount: 0.24,
          },
        ],
      }}
      scanlines={false}
      hud={false}
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
            letterSpacing: 8,
            fontWeight: 800,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          GET STARTED
        </div>

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 32,
            maxWidth: 980,
            opacity: sloganAnim.opacity,
            transform: `translateY(${sloganAnim.y}px)`,
            textShadow: `0 0 ${20 + glow * 28}px ${accentColor}99, 0 0 ${40 + glow * 20}px ${accentColor}44`,
          }}
        >
          {ctaSlogan}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 920,
            padding: 32,
            borderRadius: 16,
            backgroundColor: "#0d0d1a",
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 40px ${accentColor}33`,
            transform: `scale(${terminalScale})`,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 30,
              fontWeight: 700,
              color: terminalGreen,
              wordBreak: "break-all",
              lineHeight: 1.4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: `${terminalGreen}aa` }}>$ </span>
            <span>{ctaCommand}</span>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 24,
                marginLeft: 6,
                backgroundColor: terminalGreen,
                opacity: cursorBlink,
                boxShadow: `0 0 10px ${terminalGreen}`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: highlightColor,
            marginTop: 24,
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          {ctaGithub}
        </div>

        <div
          style={{
            fontSize: 22,
            color: "#444",
            letterSpacing: 4,
            marginTop: 20,
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.5,
          }}
        >
          {ctaTags.join(" ")}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#666",
            fontWeight: 600,
            marginTop: 36,
            opacity: followOpacity,
          }}
        >
          关注我 · 下期继续分享
        </div>
      </div>
    </SceneBackground>
  );
};
