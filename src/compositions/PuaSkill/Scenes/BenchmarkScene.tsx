import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PuaSkillProps } from "../schema";
import { fadeInUp, fadeIn, numberCountUp, pulseGlow, staggerDelay, progressBar } from "../animations";

export const BenchmarkScene: React.FC<PuaSkillProps> = ({
  backgroundColor,
  textColor,
  successColor,
  benchmarkStats,
  benchmarkTitle,
  benchmarkSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);
  const titleAnim = fadeInUp(frame, fps, 0, 60);
  const subtitleAnim = fadeInUp(frame, fps, 10, 40);

  const statsStart = Math.round(fps * 1.5);

  const scenariosStart = Math.round(fps * 4.5);
  const scenariosAnim = fadeInUp(frame, fps, scenariosStart, 40);

  const scenarios = [
    { name: "API ConnectionError", without: 7, withPua: 8, improvement: "+14%" },
    { name: "SQLite 数据库锁", without: 6, withPua: 9, improvement: "+50%" },
    { name: "循环导入链", without: 12, withPua: 16, improvement: "+33%" },
    { name: "CSV编码陷阱", without: 8, withPua: 11, improvement: "+38%" },
  ];

  const sloganStart = Math.round(durationInFrames * 0.82);
  const sloganAnim = spring({
    frame: frame - sloganStart,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${successColor}0c 0%, transparent 50%)` }} />

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
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 20, color: successColor, letterSpacing: 10, marginBottom: 14, fontWeight: 700 }}>
            BENCHMARK
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: textColor, textShadow: `0 0 40px ${successColor}44` }}>
            {benchmarkTitle}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.y}px)`,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 24,
              color: "#999",
              padding: "8px 24px",
              borderRadius: 16,
              border: `1px solid ${successColor}22`,
              background: `${successColor}08`,
            }}
          >
            {benchmarkSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28, justifyContent: "center" }}>
          {benchmarkStats.map((stat, i) => {
            const delay = statsStart + staggerDelay(i, 12);
            const statAnim = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 150 },
            });
            const count = numberCountUp(frame, fps, stat.value, 1.5, delay);
            const bar = progressBar(frame, fps, delay + 8, 1.2);

            return (
              <div
                key={i}
                style={{
                  width: 460,
                  padding: "20px 24px",
                  borderRadius: 18,
                  background: `${stat.color}08`,
                  border: `1px solid ${stat.color}22`,
                  opacity: interpolate(statAnim, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(statAnim, [0, 1], [0.8, 1])})`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: "#ddd" }}>{stat.label}</span>
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      color: stat.color,
                      fontFamily: "monospace",
                      textShadow: `0 0 20px ${stat.color}44`,
                    }}
                  >
                    +{count}{stat.suffix}
                  </span>
                </div>
                <div style={{ width: "100%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                  <div
                    style={{
                      width: `${bar * (stat.value / 65) * 100}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`,
                      boxShadow: `0 0 8px ${stat.color}44`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            opacity: scenariosAnim.opacity,
            transform: `translateY(${scenariosAnim.y}px)`,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 18, color: "#666", letterSpacing: 5, marginBottom: 12, textAlign: "center" }}>
            DEBUGGING PERSISTENCE · SCENARIOS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scenarios.map((s, i) => {
              const lineOp = fadeIn(frame, scenariosStart + staggerDelay(i, 8), 10);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 18px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    opacity: lineOp,
                  }}
                >
                  <span style={{ fontSize: 22, color: "#bbb", fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <span style={{ fontSize: 20, color: "#666" }}>{s.without}步</span>
                    <span style={{ fontSize: 16, color: "#555" }}>→</span>
                    <span style={{ fontSize: 20, color: successColor, fontWeight: 700 }}>{s.withPua}步</span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: successColor,
                        fontFamily: "monospace",
                        textShadow: `0 0 10px ${successColor}44`,
                      }}
                    >
                      {s.improvement}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: successColor,
              opacity: interpolate(sloganAnim, [0, 1], [0, 1]),
              transform: `scale(${interpolate(sloganAnim, [0, 1], [0.8, 1])})`,
              textShadow: `0 0 30px ${successColor}44`,
            }}
          >
            数据不会撒谎 · PUA 真的有效
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
