import React from "react";
import { AbsoluteFill } from "remotion";
import { WeChatClawBotProps } from "./schema";

export const WeChatClawBotCover: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  textColor,
  accentColor,
  highlightColor,
  goldColor,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        color: textColor,
        overflow: "hidden",
        fontFamily: "\"PingFang SC\", \"SF Pro Display\", system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 32% 20%, ${accentColor}30, transparent 34%), radial-gradient(circle at 72% 26%, ${highlightColor}26, transparent 30%), linear-gradient(180deg, ${backgroundColor}, #02060d 75%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(180deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 5px)",
          opacity: 0.45,
        }}
      />

      {[
        { top: 48, left: 48 },
        { top: 48, right: 48 },
        { bottom: 48, left: 48 },
        { bottom: 48, right: 48 },
      ].map((corner, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: 68,
            height: 68,
            ...corner,
            opacity: 0.6,
            borderTop: index < 2 ? `3px solid ${accentColor}` : undefined,
            borderBottom: index >= 2 ? `3px solid ${accentColor}` : undefined,
            borderLeft: index % 2 === 0 ? `3px solid ${accentColor}` : undefined,
            borderRight: index % 2 === 1 ? `3px solid ${accentColor}` : undefined,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 16,
            color: accentColor,
            fontWeight: 800,
            marginBottom: 26,
          }}
        >
          WECHAT CLAWBOT
        </div>
        <div
          style={{
            fontSize: 100,
            marginBottom: 16,
          }}
        >
          02
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 1,
            fontWeight: 900,
            color: goldColor,
            fontFamily: "monospace",
            marginBottom: 18,
            textShadow: `0 0 28px ${goldColor}44`,
          }}
        >
          SIGNALS
        </div>
        <div
          style={{
            fontSize: 60,
            lineHeight: 1.18,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          微信聊天框
          <br />
          OpenClaw 信号
        </div>
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.4,
            color: highlightColor,
            fontWeight: 700,
            textShadow: `0 0 22px ${highlightColor}33`,
          }}
        >
          Public demos · WeChat plugin
          <br />
          Gateway ecosystem clue
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default WeChatClawBotCover;
