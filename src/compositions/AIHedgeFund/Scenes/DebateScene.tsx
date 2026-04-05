import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AIHedgeFundProps } from "../schema";
import {
  fadeInUp,
  glitchOffset,
  pulseGlow,
  slideFromLeft,
  slideFromRight,
} from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

const BULL_BADGE_BG = "#00c853";
const BEAR_BADGE_BG = "#ff1744";

export const DebateScene: React.FC<AIHedgeFundProps> = ({
  debateTitle,
  debateLeft,
  debateRight,
  debateVerdict,
  debateVerdictSignal,
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  dangerColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const leftX = slideFromLeft(frame, fps, 10);
  const rightX = slideFromRight(frame, fps, 10);
  const pulse = pulseGlow(frame, fps, 1.5);
  const glitch = glitchOffset(frame, 3);
  const vsGlow = 0.55 + 0.45 * pulse;

  const verdictFade = fadeInUp(frame, fps, 35);
  const verdictSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  const verdictScale = interpolate(verdictSpring, [0, 1], [0.96, 1]);

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
          alignItems: "stretch",
          gap: 20,
          boxSizing: "border-box",
          fontFamily: '"PingFang SC", "SF Pro Display", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: accentColor,
              fontWeight: 800,
              ...textWrap,
            }}
          >
            DEBATE
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.08,
              background: `linear-gradient(135deg, ${highlightColor}, ${accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 0 28px ${highlightColor}40`,
              opacity: titleFade.opacity,
              transform: `translateY(${titleFade.y}px)`,
              ...textWrap,
            }}
          >
            {debateTitle}
          </div>
        </div>

        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              borderRadius: 12,
              border: `1px solid ${accentColor}`,
              background: panelColor,
              padding: 20,
              boxSizing: "border-box",
              transform: `translateX(${leftX}px)`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: BULL_BADGE_BG,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              BULLISH
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{debateLeft.agentEmoji}</span>
              <span
                style={{
                  color: accentColor,
                  fontSize: 22,
                  fontWeight: 800,
                  ...textWrap,
                }}
              >
                {debateLeft.agentName}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
                minWidth: 0,
              }}
            >
              {debateLeft.reasons.map((reason, i) => (
                <div
                  key={`${reason}-${i}`}
                  style={{
                    fontSize: 20,
                    color: textColor,
                    fontWeight: 600,
                    ...textWrap,
                  }}
                >
                  <span style={{ color: accentColor, fontWeight: 900, marginRight: 6 }}>✓</span>
                  {reason}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: accentColor,
                ...textWrap,
              }}
            >
              {debateLeft.signal}
            </div>
          </div>

          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              padding: "0 4px",
            }}
          >
            <div
              style={{
                color: highlightColor,
                fontSize: 24,
                fontWeight: 900,
                textAlign: "center",
                opacity: vsGlow,
                textShadow: `0 0 ${12 + 20 * pulse}px ${highlightColor}66`,
                transform: `translate(${glitch.x}px, ${glitch.y}px) skewX(${glitch.skew}deg)`,
                ...textWrap,
              }}
            >
              ⚡ VS ⚡
            </div>
          </div>

          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              borderRadius: 12,
              border: `1px solid ${dangerColor}`,
              background: panelColor,
              padding: 20,
              boxSizing: "border-box",
              transform: `translateX(${rightX}px)`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: BEAR_BADGE_BG,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              BEARISH
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{debateRight.agentEmoji}</span>
              <span
                style={{
                  color: dangerColor,
                  fontSize: 22,
                  fontWeight: 800,
                  ...textWrap,
                }}
              >
                {debateRight.agentName}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
                minWidth: 0,
              }}
            >
              {debateRight.reasons.map((reason, i) => (
                <div
                  key={`${reason}-${i}`}
                  style={{
                    fontSize: 20,
                    color: textColor,
                    fontWeight: 600,
                    ...textWrap,
                  }}
                >
                  <span style={{ color: dangerColor, fontWeight: 900, marginRight: 6 }}>✗</span>
                  {reason}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: dangerColor,
                ...textWrap,
              }}
            >
              {debateRight.signal}
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${highlightColor}`,
            background: panelColor,
            padding: 16,
            boxSizing: "border-box",
            minWidth: 0,
            opacity: verdictFade.opacity,
            transform: `translateY(${verdictFade.y}px) scale(${verdictScale})`,
            transformOrigin: "center bottom",
          }}
        >
          <div
            style={{
              color: highlightColor,
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 10,
              ...textWrap,
            }}
          >
            🏦 投资组合经理
          </div>
          <div
            style={{
              color: textColor,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 12,
              ...textWrap,
            }}
          >
            {debateVerdict}
          </div>
          <div
            style={{
              color: highlightColor,
              fontSize: 32,
              fontWeight: 900,
              ...textWrap,
            }}
          >
            {debateVerdictSignal}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
