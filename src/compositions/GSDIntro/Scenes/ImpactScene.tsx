import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { chatBubbleIn, fadeInUp, numberCountUp, staggerDelay } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

function parseStarsK(stars: string): { targetK: number; suffix: string } {
  const normalized = stars.replace(/,/g, "").trim();
  const lower = normalized.toLowerCase();
  const plus = normalized.endsWith("+") ? "+" : "";
  const base = normalized.replace(/\+$/, "");
  const numMatch = base.match(/(\d+(?:\.\d+)?)\s*k/i);
  if (numMatch) {
    const n = parseFloat(numMatch[1]);
    return { targetK: Math.round(n), suffix: `${plus ? "+" : ""}` };
  }
  const digits = base.match(/(\d+)/);
  if (!digits) {
    return { targetK: 0, suffix: stars.includes("+") ? "+" : "" };
  }
  const n = parseInt(digits[1], 10);
  if (n >= 1000) {
    return { targetK: Math.floor(n / 1000), suffix: `k${plus}` };
  }
  return { targetK: n, suffix: plus };
}

export const ImpactScene: React.FC<GSDIntroProps> = ({
  impactStars,
  impactGrowth,
  impactContributors,
  impactRuntimes,
  impactCompanies,
  impactQuotes,
  backgroundColor,
  accentColor,
  highlightColor,
  successColor,
  goldColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridStart = Math.round(fps * 0.35);
  const { targetK, suffix } = parseStarsK(impactStars);
  const starsCount = numberCountUp(frame, fps, targetK, 1.4, gridStart + staggerDelay(0, 8));
  const starsDisplay =
    targetK > 0 ? `${starsCount}k${suffix.includes("k") ? suffix.replace(/^k/, "") : suffix}` : impactStars;

  const cells: {
    key: string;
    value: string;
    displayValue?: string;
    label: string;
    color: string;
    index: number;
  }[] = [
    {
      key: "stars",
      value: impactStars,
      displayValue: starsDisplay,
      label: "GitHub Stars",
      color: goldColor,
      index: 0,
    },
    {
      key: "growth",
      value: impactGrowth,
      label: "Weekly growth",
      color: successColor,
      index: 1,
    },
    {
      key: "contributors",
      value: impactContributors,
      label: "Contributors",
      color: highlightColor,
      index: 2,
    },
    {
      key: "runtimes",
      value: impactRuntimes,
      label: "Runtimes",
      color: accentColor,
      index: 3,
    },
  ];

  const badgesAnim = fadeInUp(frame, fps, Math.round(fps * 1.15), 48);
  const quotesStart = Math.round(fps * 1.45);

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 34,
        speed: 0.36,
        color: accentColor,
        opacity: 0.32,
      }}
      hud={false}
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
            color: goldColor,
            letterSpacing: 8,
            fontWeight: 800,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          IMPACT
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            width: "100%",
            maxWidth: 920,
            marginBottom: 28,
          }}
        >
          {cells.map((cell) => {
            const delay = gridStart + staggerDelay(cell.index, 8);
            const anim = fadeInUp(frame, fps, delay, 36);
            const showVal = cell.displayValue ?? cell.value;
            return (
              <div
                key={cell.key}
                style={{
                  padding: "20px 18px",
                  borderRadius: 16,
                  backgroundColor: "#0d0d1a",
                  border: `1px solid ${cell.color}22`,
                  textAlign: "center",
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: cell.key === "runtimes" ? 72 : 60,
                    fontWeight: 900,
                    color: cell.color,
                    lineHeight: 1.05,
                    marginBottom: 8,
                  }}
                >
                  {showVal}
                </div>
                <div style={{ fontSize: 18, color: "#666", fontWeight: 600 }}>{cell.label}</div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            width: "100%",
            maxWidth: 920,
            marginBottom: 26,
            opacity: badgesAnim.opacity,
            transform: `translateY(${badgesAnim.y}px)`,
          }}
        >
          {impactCompanies.map((name) => (
            <div
              key={name}
              style={{
                fontFamily: "monospace",
                fontSize: 20,
                fontWeight: 600,
                color: accentColor,
                border: `1px solid ${accentColor}66`,
                borderRadius: 8,
                padding: "6px 16px",
                backgroundColor: `${accentColor}14`,
              }}
            >
              {`[ ${name} ]`}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 920,
            marginBottom: 24,
          }}
        >
          {impactQuotes.map((quote, index) => {
            const qDelay = quotesStart + staggerDelay(index, 10);
            const bubble = chatBubbleIn(frame, fps, qDelay);
            return (
              <div
                key={`${quote.slice(0, 24)}-${index}`}
                style={{
                  borderLeft: `3px solid ${accentColor}`,
                  paddingLeft: 16,
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#ccc",
                  lineHeight: 1.4,
                  opacity: bubble.opacity,
                  transform: `translateY(${bubble.y}px) scale(${bubble.scale})`,
                }}
              >
                {quote}
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: accentColor,
            border: `1px solid ${accentColor}`,
            borderRadius: 10,
            padding: "10px 22px",
            backgroundColor: `${accentColor}0f`,
          }}
        >
          MIT License · 完全免费
        </div>
      </div>
    </SceneBackground>
  );
};
