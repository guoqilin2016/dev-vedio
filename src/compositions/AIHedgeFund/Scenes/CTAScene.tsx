import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { AIHedgeFundProps } from "../schema";
import { fadeIn, fadeInUp, scaleIn } from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const CTAScene: React.FC<AIHedgeFundProps> = ({
  ctaTitle,
  ctaBody,
  ctaSlogan,
  ctaTags,
  hookStarCount,
  hookRepoName,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteFade = fadeInUp(frame, fps, 0);
  const quoteSpring = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  const quoteScale = interpolate(quoteSpring, [0, 1], [0.97, 1]);

  const subtitleFade = fadeInUp(frame, fps, 12);
  const sloganFade = fadeInUp(frame, fps, 20);
  const cardScale = scaleIn(frame, fps, 30);
  const tagsOpacity = fadeIn(frame, 40, 18);

  const quoteStyle: React.CSSProperties = {
    fontSize: 52,
    fontWeight: 900,
    textAlign: "center",
    lineHeight: 1.12,
    background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 40px #ffd70060, 0 0 80px #ffd70030",
    opacity: quoteFade.opacity,
    transform: `translateY(${quoteFade.y}px) scale(${quoteScale})`,
    transformOrigin: "center center",
    ...textWrap,
  };

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          right: 60,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          boxSizing: "border-box",
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        <div style={{ width: "100%", minWidth: 0, display: "flex", justifyContent: "center" }}>
          <div style={quoteStyle}>{ctaTitle}</div>
        </div>

        <div
          style={{
            color: textColor,
            fontSize: 36,
            fontWeight: 700,
            textAlign: "center",
            opacity: subtitleFade.opacity,
            transform: `translateY(${subtitleFade.y}px)`,
            width: "100%",
            ...textWrap,
          }}
        >
          {ctaBody}
        </div>

        <div
          style={{
            color: accentColor,
            fontSize: 28,
            textAlign: "center",
            opacity: sloganFade.opacity,
            transform: `translateY(${sloganFade.y}px)`,
            width: "100%",
            ...textWrap,
          }}
        >
          {ctaSlogan}
        </div>

        <div
          style={{
            background: panelColor,
            border: `1px solid ${highlightColor}`,
            borderRadius: 12,
            padding: 20,
            marginTop: 30,
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            transform: `scale(${cardScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }} aria-hidden>
              📦
            </span>
            <span
              style={{
                color: highlightColor,
                fontSize: 24,
                fontWeight: 700,
                ...textWrap,
              }}
            >
              {hookRepoName}
            </span>
          </div>
          <div
            style={{
              color: highlightColor,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: 20,
              marginTop: 12,
              ...textWrap,
            }}
          >
            ⭐ {hookStarCount} Stars
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            width: "100%",
            minWidth: 0,
            marginTop: 8,
            opacity: tagsOpacity,
          }}
        >
          {ctaTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              style={{
                background: panelColor,
                border: `1px solid ${mutedTextColor}`,
                borderRadius: 16,
                padding: "4px 12px",
                fontSize: 18,
                color: mutedTextColor,
                boxSizing: "border-box",
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
