import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { fadeInUp, fadeIn, pulseGlow, staggerDelay } from "../animations";

export const LazyPatternsScene: React.FC<PuaSkillProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  lazyPatterns,
  lazyQuote,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);

  const terminalStart = Math.round(fps * 0.8);
  const terminalOpacity = fadeIn(frame, terminalStart, 15);

  const fakeLog = [
    "$ ai debug --fix auth-module",
    "> Attempt 1: Trying fix...",
    "> ❌ Failed: Cannot resolve dependency",
    "> Attempt 2: Trying same fix...",
    "> ❌ Failed: Cannot resolve dependency",
    "> Attempt 3: Trying same fix...",
    "> ❌ Failed: Cannot resolve dependency",
    "",
    '> 🤖 "I cannot solve this problem."',
    '> 🤖 "I suggest you handle this manually."',
  ];

  const codeLines = Math.min(
    fakeLog.length,
    Math.floor(((frame - terminalStart) / fps) * 5)
  );

  const patternsStart = Math.round(fps * 4);
  const patternsAnim = fadeInUp(frame, fps, patternsStart, 40);

  const quoteStart = Math.round(durationInFrames * 0.78);
  const quoteAnim = fadeInUp(frame, fps, quoteStart, 50);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${accentColor}0a 0%, transparent 50%)` }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 420,
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
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 20, color: accentColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            THE PROBLEM
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: textColor, lineHeight: 1.3 }}>
            AI的5种摆烂模式
          </div>
        </div>

        <div style={{ opacity: terminalOpacity, marginBottom: 22 }}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${accentColor}22`,
              boxShadow: `0 0 30px ${accentColor}0a`,
            }}
          >
            <div
              style={{
                height: 34,
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
              <span style={{ fontSize: 12, color: "#555", marginLeft: 8 }}>ai-debug.log</span>
            </div>
            <div style={{ background: "#0d0d1a", padding: "12px 16px", minHeight: 180 }}>
              {fakeLog.slice(0, codeLines).map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 16,
                    fontFamily: "monospace",
                    lineHeight: 1.8,
                    color: line.includes("❌")
                      ? accentColor
                      : line.includes("🤖")
                        ? "#f59e0b"
                        : line.startsWith("$")
                          ? "#22c55e"
                          : "#888",
                    opacity: fadeIn(frame, terminalStart + Math.round(i * (fps / 5)), 8),
                  }}
                >
                  {line || "\u00A0"}
                </div>
              ))}
              <div style={{ width: 8, height: 16, backgroundColor: "#22c55e", opacity: glow > 0.5 ? 1 : 0, marginTop: 2 }} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
            opacity: patternsAnim.opacity,
            transform: `translateY(${patternsAnim.y}px)`,
          }}
        >
          {lazyPatterns.map((pattern, i) => {
            const lineAnim = fadeIn(frame, patternsStart + staggerDelay(i, 10), 12);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: `${accentColor}08`,
                  border: `1px solid ${accentColor}15`,
                  opacity: lineAnim,
                }}
              >
                <div style={{ fontSize: 28, flexShrink: 0 }}>{pattern.icon}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: accentColor }}>{pattern.name}</span>
                  <span style={{ fontSize: 22, color: "#999", marginLeft: 12 }}>{pattern.behavior}</span>
                </div>
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
              fontSize: 40,
              fontWeight: 900,
              color: accentColor,
              padding: "14px 40px",
              borderRadius: 16,
              border: `2px solid ${accentColor}44`,
              background: `${accentColor}0a`,
              textShadow: `0 0 30px ${accentColor}44`,
            }}
          >
            {lazyQuote}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
