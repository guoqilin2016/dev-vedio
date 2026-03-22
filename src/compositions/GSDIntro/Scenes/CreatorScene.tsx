import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { fadeIn, fadeInUp, numberCountUp, pulseGlow, typewriterLength } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

const CPS = 20;
const LINE_GAP = 8;

function lineRevealEnd(start: number, text: string, fps: number): number {
  return start + Math.ceil((text.length / CPS) * fps) + LINE_GAP;
}

export const CreatorScene: React.FC<GSDIntroProps> = ({
  creatorHandle,
  creatorLocation,
  creatorBackground,
  creatorQuote,
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

  const d0 = Math.round(fps * 0.28);
  const line1 = `> user: ${creatorHandle}`;
  const line2 = `> location: ${creatorLocation}`;
  const line3 = `> background: ${creatorBackground}`;
  const line4Prefix = "> stars: ";

  const end1 = lineRevealEnd(d0, line1, fps);
  const end2 = lineRevealEnd(end1, line2, fps);
  const end3 = lineRevealEnd(end2, line3, fps);
  const line4TypingStart = end3;

  const len1 = typewriterLength(frame, line1, fps, d0, CPS);
  const len2 = typewriterLength(frame, line2, fps, end1, CPS);
  const len3 = typewriterLength(frame, line3, fps, end2, CPS);
  const len4p = typewriterLength(frame, line4Prefix, fps, line4TypingStart, CPS);

  const prefixDone = len4p >= line4Prefix.length;
  const starsCountStart = line4TypingStart + Math.round(fps * 0.32);
  const displayedStars = numberCountUp(frame, fps, hookStars, 2.2, starsCountStart);

  const cursorBlink =
    Math.floor(frame / Math.max(1, Math.round(fps * 0.38))) % 2 === 0 ? 1 : 0;

  let cursorLine: 1 | 2 | 3 | 4 = 1;
  if (len1 < line1.length || frame < end1) {
    cursorLine = 1;
  } else if (len2 < line2.length || frame < end2) {
    cursorLine = 2;
  } else if (len3 < line3.length || frame < end3) {
    cursorLine = 3;
  } else {
    cursorLine = 4;
  }

  const quoteAnim = fadeInUp(frame, fps, end3 + Math.round(fps * 0.5), 48);

  const gsdDelay = Math.round(fps * 4.5);
  const gsdOpacity = fadeIn(frame, gsdDelay, 22);
  const gsdGlow = pulseGlow(frame, fps, 2.2);
  const gsdShadowStrength = interpolate(gsdGlow, [0.5, 1], [0.35, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{ count: 32, speed: 0.38, color: accentColor, opacity: 0.36 }}
      glow={{
        orbs: [
          {
            x: "45%",
            y: "42%",
            color: accentColor,
            radius: 500,
            opacity: 0.12,
            pulseSpeed: 0.58,
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
          padding: "0 36px",
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
          CREATOR
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 28,
            width: "100%",
            maxWidth: 980,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 620,
              borderRadius: 14,
              overflow: "hidden",
              border: `2px solid ${terminalGreen}`,
              backgroundColor: "#0d0d1a",
              boxShadow: `0 0 40px ${accentColor}22`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                backgroundColor: "rgba(0,0,0,0.45)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  color: "#8892a6",
                  letterSpacing: 1,
                }}
              >
                profile
              </span>
            </div>
            <div
              style={{
                padding: "18px 20px 22px",
                fontFamily: "monospace",
                fontSize: 26,
                lineHeight: 1.55,
                color: terminalGreen,
              }}
            >
              <div>
                {line1.slice(0, len1)}
                {cursorLine === 1 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 18,
                      marginLeft: 4,
                      verticalAlign: "middle",
                      backgroundColor: terminalGreen,
                      opacity: cursorBlink,
                    }}
                  />
                ) : null}
              </div>
              <div style={{ marginTop: 6 }}>
                {line2.slice(0, len2)}
                {cursorLine === 2 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 18,
                      marginLeft: 4,
                      verticalAlign: "middle",
                      backgroundColor: terminalGreen,
                      opacity: cursorBlink,
                    }}
                  />
                ) : null}
              </div>
              <div style={{ marginTop: 6 }}>
                {line3.slice(0, len3)}
                {cursorLine === 3 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 18,
                      marginLeft: 4,
                      verticalAlign: "middle",
                      backgroundColor: terminalGreen,
                      opacity: cursorBlink,
                    }}
                  />
                ) : null}
              </div>
              <div style={{ marginTop: 6, color: goldColor }}>
                {line4Prefix.slice(0, len4p)}
                {!prefixDone && cursorLine === 4 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 18,
                      marginLeft: 4,
                      verticalAlign: "middle",
                      backgroundColor: terminalGreen,
                      opacity: cursorBlink,
                    }}
                  />
                ) : null}
                {prefixDone ? (
                  <>
                    {displayedStars.toLocaleString("en-US")}+
                    {cursorLine === 4 ? (
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 18,
                          marginLeft: 6,
                          verticalAlign: "middle",
                          backgroundColor: terminalGreen,
                          opacity: cursorBlink,
                        }}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              paddingTop: 8,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: `3px solid ${terminalGreen}`,
                backgroundColor: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontSize: 36,
                fontWeight: 800,
                color: textColor,
                boxShadow: `0 0 24px ${accentColor}44`,
              }}
            >
              GC
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                backgroundColor: goldColor,
                clipPath: STAR_CLIP,
                boxShadow: `0 0 22px ${goldColor}, 0 0 40px ${goldColor}77`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: 600,
            color: highlightColor,
            textAlign: "center",
            lineHeight: 1.45,
            maxWidth: 900,
            opacity: quoteAnim.opacity,
            transform: `translateY(${quoteAnim.y}px)`,
            marginBottom: 20,
          }}
        >
          {creatorQuote}
        </div>

        <div
          style={{
            fontSize: 72,
            fontFamily: "monospace",
            fontWeight: 900,
            color: accentColor,
            letterSpacing: 12,
            opacity: gsdOpacity,
            textShadow: `0 0 ${24 + gsdShadowStrength * 28}px ${accentColor}, 0 0 ${8 + gsdShadowStrength * 12}px ${terminalGreen}88`,
          }}
        >
          GSD
        </div>
      </div>
    </SceneBackground>
  );
};
