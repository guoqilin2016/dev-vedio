import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { cardSlideIn, progressBar, staggerDelay } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

const CONTEXT_BAR_TARGET = 35;

const PillarIcon: React.FC<{
  index: number;
  accentColor: string;
  terminalGreen: string;
}> = ({ index, accentColor, terminalGreen }) => {
  const box: React.CSSProperties = {
    width: 60,
    height: 60,
    borderRadius: 10,
    border: `2px solid ${accentColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  };

  if (index === 0) {
    return (
      <div style={box}>
        <div style={{ position: "relative", width: 36, height: 36 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 28,
              height: 18,
              border: `2px solid ${accentColor}`,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 8,
              width: 28,
              height: 18,
              border: `2px solid ${accentColor}`,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 16,
              width: 28,
              height: 18,
              border: `2px solid ${accentColor}`,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div style={box}>
        <div style={{ display: "flex", flexDirection: "row", gap: 6, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                backgroundColor: accentColor,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "flex-end", height: 32 }}>
        <div
          style={{
            width: 14,
            height: 32,
            border: `1px solid ${accentColor}88`,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "30%",
              backgroundColor: terminalGreen,
            }}
          />
        </div>
        <div
          style={{
            width: 14,
            height: 32,
            border: `1px solid ${accentColor}88`,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: terminalGreen,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const CoreScene: React.FC<GSDIntroProps> = ({
  coreTitle,
  pillars,
  backgroundColor,
  textColor,
  accentColor,
  successColor,
  terminalGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardBase = Math.round(fps * 0.35);
  const contextBarDelay = Math.round(fps * 0.55);
  const contextBarFill =
    (progressBar(frame, fps, 1.1, contextBarDelay) / 100) * CONTEXT_BAR_TARGET;

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 36,
        speed: 0.4,
        color: accentColor,
        opacity: 0.38,
      }}
      hud={{ color: accentColor, animation: "pulse" }}
      scanlines={false}
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
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          ARCHITECTURE
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.12,
            marginBottom: 28,
            maxWidth: 980,
          }}
        >
          {coreTitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 920,
            marginBottom: 28,
          }}
        >
          {pillars.map((pillar, index) => {
            const delay = cardBase + staggerDelay(index, 12);
            const anim = cardSlideIn(frame, fps, delay);
            return (
              <div
                key={`${pillar.title}-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                  padding: 24,
                  borderRadius: 16,
                  backgroundColor: "#0d0d1a",
                  border: `1px solid ${accentColor}33`,
                  opacity: anim.opacity,
                  transform: `translateX(${anim.x}px) scale(${anim.scale})`,
                }}
              >
                <PillarIcon index={index} accentColor={accentColor} terminalGreen={terminalGreen} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: 6,
                    }}
                  >
                    {pillar.title}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#999",
                      marginBottom: 4,
                      lineHeight: 1.35,
                    }}
                  >
                    {pillar.desc}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#666",
                      lineHeight: 1.4,
                    }}
                  >
                    {pillar.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ width: "100%", maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: successColor }}>Context: 30–40%</span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              border: `1px solid ${successColor}33`,
            }}
          >
            <div
              style={{
                width: `${contextBarFill}%`,
                height: "100%",
                borderRadius: 6,
                backgroundColor: successColor,
                boxShadow: `0 0 16px ${successColor}66`,
              }}
            />
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};
