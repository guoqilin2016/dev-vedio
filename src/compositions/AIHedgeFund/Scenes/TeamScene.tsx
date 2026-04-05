import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { AIHedgeFundProps } from "../schema";
import {
  cardSlideIn,
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerDelay,
} from "../animations";

const textWrap: React.CSSProperties = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  maxWidth: "100%",
};

export const TeamScene: React.FC<AIHedgeFundProps> = ({
  teamTitle,
  masterAgents,
  teamExtra,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleFade = fadeInUp(frame, fps, 0);
  const extraOpacity = fadeIn(frame, 60);

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
          justifyContent: "flex-start",
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
            TEAM
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
            {teamTitle}
          </div>
        </div>

        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 16,
            alignContent: "start",
          }}
        >
          {masterAgents.map((agent, index) => {
            const delay = staggerDelay(index, 8);
            const card = cardSlideIn(frame, fps, delay);
            const emojiScale = scaleIn(frame, fps, delay + 5);
            const borderColor = index % 2 === 0 ? accentColor : highlightColor;

            return (
              <div
                key={`${agent.nameEn}-${index}`}
                style={{
                  minWidth: 0,
                  borderRadius: 12,
                  border: `1px solid ${borderColor}`,
                  background: panelColor,
                  padding: 16,
                  boxSizing: "border-box",
                  opacity: card.opacity,
                  transform: `translateX(${card.x}px) scale(${card.scale})`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      lineHeight: 1,
                      transform: `scale(${emojiScale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    {agent.emoji}
                  </div>
                  <div
                    style={{
                      color: highlightColor,
                      fontSize: 26,
                      fontWeight: 800,
                      textAlign: "center",
                      ...textWrap,
                    }}
                  >
                    {agent.name}
                  </div>
                  <div
                    style={{
                      color: mutedTextColor,
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                      ...textWrap,
                    }}
                  >
                    {agent.nameEn}
                  </div>
                  <div
                    style={{
                      color: textColor,
                      fontSize: 18,
                      fontWeight: 500,
                      textAlign: "center",
                      ...textWrap,
                    }}
                  >
                    {agent.style}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 8,
                      maxWidth: "100%",
                    }}
                  >
                    {agent.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          border: `1px solid ${accentColor}`,
                          fontSize: 14,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 8,
                          color: textColor,
                          boxSizing: "border-box",
                          maxWidth: "100%",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: 20,
            color: mutedTextColor,
            textAlign: "center",
            opacity: extraOpacity,
            ...textWrap,
          }}
        >
          {teamExtra}
        </div>
      </div>
    </AbsoluteFill>
  );
};
