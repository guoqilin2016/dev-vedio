import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SuperPowersProps } from "../schema";
import { fadeInUp, fadeIn, pulseGlow, staggerDelay } from "../animations";

export const ProblemScene: React.FC<SuperPowersProps> = ({
  backgroundColor,
  textColor,
  dangerColor,
  problemTitle,
  problemQuote,
  problemLines,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);

  const terminalStart = Math.round(fps * 1);
  const terminalOpacity = fadeIn(frame, terminalStart, 15);

  const fakeCode = [
    "$ cursor generate --feature login",
    "> Generating code...",
    "> Creating auth.ts...",
    "> Creating login.tsx...",
    "> Done! 4 files created.",
    "",
    "$ npm run build",
    "> ERROR: Cannot find module './utils'",
    "> ERROR: Type 'string' not assignable",
    "> WARNING: 23 unused imports",
    "> Build failed with 7 errors",
  ];

  const codeLines = Math.min(
    fakeCode.length,
    Math.floor(((frame - terminalStart) / fps) * 6)
  );

  const warningStart = Math.round(fps * 4);
  const warningsAnim = fadeInUp(frame, fps, warningStart, 40);

  const quoteStart = Math.round(durationInFrames * 0.72);
  const quoteAnim = fadeInUp(frame, fps, quoteStart, 50);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${dangerColor}0a 0%, transparent 50%)` }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 20, color: dangerColor, letterSpacing: 10, marginBottom: 16, fontWeight: 700 }}>
            THE PROBLEM
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: textColor, lineHeight: 1.3 }}>
            {problemTitle}
          </div>
        </div>

        <div style={{ opacity: terminalOpacity, marginBottom: 30 }}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${dangerColor}22`,
              boxShadow: `0 0 30px ${dangerColor}0a`,
            }}
          >
            <div
              style={{
                height: 36,
                background: "#1a1a2e",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 8,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#555", marginLeft: 8 }}>terminal</span>
            </div>
            <div style={{ background: "#0d0d1a", padding: "16px 18px", minHeight: 240 }}>
              {fakeCode.slice(0, codeLines).map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 18,
                    fontFamily: "monospace",
                    lineHeight: 1.9,
                    color: line.startsWith("> ERROR")
                      ? dangerColor
                      : line.startsWith("> WARNING")
                        ? "#f59e0b"
                        : line.startsWith("$")
                          ? "#22c55e"
                          : "#888",
                    opacity: fadeIn(frame, terminalStart + Math.round(i * (fps / 6)), 8),
                  }}
                >
                  {line || "\u00A0"}
                </div>
              ))}
              <div style={{ width: 8, height: 18, backgroundColor: "#22c55e", opacity: glow > 0.5 ? 1 : 0, marginTop: 4 }} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 30,
            opacity: warningsAnim.opacity,
            transform: `translateY(${warningsAnim.y}px)`,
          }}
        >
          {problemLines.map((line, i) => {
            const lineAnim = fadeIn(frame, warningStart + staggerDelay(i, 10), 12);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: lineAnim }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: dangerColor, boxShadow: `0 0 8px ${dangerColor}`, flexShrink: 0 }} />
                <span style={{ fontSize: 32, color: "#ccc", fontWeight: 600 }}>{line}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: quoteAnim.opacity,
            transform: `translateY(${quoteAnim.y}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 48,
              fontWeight: 900,
              color: dangerColor,
              padding: "18px 48px",
              borderRadius: 16,
              border: `2px solid ${dangerColor}44`,
              background: `${dangerColor}0a`,
              textShadow: `0 0 30px ${dangerColor}44`,
            }}
          >
            {problemQuote}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
