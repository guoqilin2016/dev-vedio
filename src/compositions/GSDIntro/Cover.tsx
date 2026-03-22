import React from "react";
import { AbsoluteFill } from "remotion";
import { GSDIntroProps } from "./schema";

export const GSDIntroCover: React.FC<GSDIntroProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  hookStars,
  ctaSlogan,
}) => {
  const starsK = hookStars >= 1000 ? `${Math.round(hookStars / 1000)}k+` : String(hookStars);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, ${accentColor}30 0%, transparent 55%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 70%, ${highlightColor}15 0%, transparent 40%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${accentColor}06 2px, ${accentColor}06 4px)`,
          pointerEvents: "none",
        }}
      />

      {[
        { top: 50, left: 50 },
        { top: 50, right: 50 },
        { bottom: 50, left: 50 },
        { bottom: 50, right: 50 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 70,
            height: 70,
            opacity: 0.6,
            borderTop: i < 2 ? `3px solid ${accentColor}` : "none",
            borderBottom: i >= 2 ? `3px solid ${accentColor}` : "none",
            borderLeft: i % 2 === 0 ? `3px solid ${accentColor}` : "none",
            borderRight: i % 2 === 1 ? `3px solid ${accentColor}` : "none",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 48px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: accentColor,
            letterSpacing: 16,
            fontWeight: 800,
            marginBottom: 36,
            textShadow: `0 0 24px ${accentColor}88`,
          }}
        >
          GET SHIT DONE
        </div>

        <div
          style={{
            fontSize: 96,
            marginBottom: 28,
            filter: `drop-shadow(0 0 36px ${accentColor}aa)`,
          }}
        >
          ⚡
        </div>

        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#fbbf24",
            fontFamily: "monospace",
            textShadow: "0 0 40px #fbbf2466",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          {starsK}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: textColor,
            opacity: 0.85,
            marginBottom: 48,
          }}
        >
          GitHub Stars
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.25,
            textShadow: `0 0 20px ${highlightColor}44`,
          }}
        >
          {ctaSlogan}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default GSDIntroCover;
