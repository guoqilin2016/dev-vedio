import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps, QualityLevel } from "../schema";
import { cardSlideIn, progressBar, staggerDelay } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

function parseQualityRange(range: string): { min: number; max: number } {
  const trimmed = range.trim();
  const plus = trimmed.match(/^(\d+)%\+$/);
  if (plus) {
    return { min: Number(plus[1]), max: 100 };
  }
  const dash = trimmed
    .replace(/\u2013/g, "-")
    .replace(/–/g, "-")
    .replace(/%/g, "");
  const m = dash.match(/^(\d+)\s*-\s*(\d+)$/);
  if (m) {
    return { min: Number(m[1]), max: Number(m[2]) };
  }
  return { min: 0, max: 100 };
}

function isBandActive(
  barPct: number,
  index: number,
  total: number,
  min: number,
  max: number,
): boolean {
  if (index === total - 1) {
    return barPct >= min && barPct <= max;
  }
  return barPct >= min && barPct < max;
}

export const PainScene: React.FC<GSDIntroProps> = ({
  painTitle,
  painSubtitle,
  qualityLevels,
  backgroundColor,
  textColor,
  accentColor,
  successColor,
  warningColor,
  dangerColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barDelay = Math.round(fps * 0.35);
  const barDurationSec = 3.8;
  const barPct = progressBar(frame, fps, barDurationSec, barDelay);

  const scanAccel = interpolate(frame, [0, 12 * fps], [1, 4.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOffset = (frame * scanAccel * 3) % 48;

  const levels: QualityLevel[] = qualityLevels;

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{ count: 28, speed: 0.35, color: dangerColor, opacity: 0.28 }}
      glow={{
        orbs: [
          {
            x: "50%",
            y: "45%",
            color: dangerColor,
            radius: 480,
            opacity: 0.1,
            pulseSpeed: 0.65,
          },
        ],
      }}
      scanlines={false}
      hud={{ color: dangerColor, animation: "pulse" }}
    >
      <AbsoluteFillScanOverlay offset={scanOffset} color={dangerColor} />

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
          padding: "0 32px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: dangerColor,
            letterSpacing: 8,
            fontWeight: 800,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          CONTEXT ROT
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.12,
            marginBottom: 12,
            maxWidth: 980,
          }}
        >
          {painTitle}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#999",
            textAlign: "center",
            marginBottom: 36,
            maxWidth: 920,
          }}
        >
          {painSubtitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 36,
            width: "100%",
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontFamily: "monospace",
                fontWeight: 800,
                color: textColor,
                marginBottom: 12,
                textShadow: `0 0 12px ${warningColor}66`,
              }}
            >
              {Math.round(barPct)}%
            </div>
            <div
              style={{
                position: "relative",
                width: 60,
                height: 400,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: `2px solid rgba(255,255,255,0.12)`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${barPct}%`,
                  borderRadius: 12,
                  background: `linear-gradient(to top, ${successColor}, ${warningColor}, ${dangerColor})`,
                  boxShadow: `0 0 24px ${dangerColor}55`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 14,
              flex: 1,
              maxWidth: 420,
            }}
          >
            {levels.map((level, index) => {
              const delay = staggerDelay(index, 10);
              const anim = cardSlideIn(frame, fps, Math.round(fps * 0.4) + delay);
              const { min, max } = parseQualityRange(level.range);
              const active = isBandActive(barPct, index, levels.length, min, max);
              return (
                <div
                  key={`${level.range}-${level.label}`}
                  style={{
                    opacity: anim.opacity,
                    transform: `translateX(${anim.x}px) scale(${anim.scale})`,
                    padding: "14px 16px",
                    borderRadius: 12,
                    backgroundColor: active ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.25)",
                    borderLeft: `4px solid ${level.color}`,
                    boxShadow: active
                      ? `0 0 20px ${level.color}44, inset 0 0 0 1px ${level.color}33`
                      : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 22,
                      fontWeight: 800,
                      color: level.color,
                      marginBottom: 4,
                    }}
                  >
                    {level.range}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: textColor,
                    }}
                  >
                    {level.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};

const AbsoluteFillScanOverlay: React.FC<{
  offset: number;
  color: string;
}> = ({ offset, color }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `repeating-linear-gradient(
        0deg,
        ${color}14,
        ${color}14 1px,
        transparent 1px,
        transparent 4px
      )`,
      backgroundPosition: `0 ${offset}px`,
    }}
  />
);
