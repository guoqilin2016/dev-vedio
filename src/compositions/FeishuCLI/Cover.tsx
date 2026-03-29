import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { FeishuCLIProps } from "./schema";

export const FeishuCLICover: React.FC<FeishuCLIProps> = ({
  coverLabel,
  coverTitle,
  coverSubtitle,
  coverStrip,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  panelColor,
}) => {
  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 26,
        speed: 0.26,
        color: highlightColor,
        opacity: 0.24,
        connectLines: false,
      }}
      glow={{
        orbs: [
          {
            x: "28%",
            y: "18%",
            color: accentColor,
            radius: 330,
            opacity: 0.17,
            pulseSpeed: 0.5,
            pulseAmount: 0.14,
          },
          {
            x: "78%",
            y: "68%",
            color: highlightColor,
            radius: 250,
            opacity: 0.14,
            pulseSpeed: 0.52,
            pulseAmount: 0.14,
          },
        ],
      }}
      hud={{ color: accentColor, animation: "static" }}
    >
      <AbsoluteFill
        style={{
          fontFamily: "\"PingFang SC\", \"SF Pro Display\", system-ui, sans-serif",
          color: textColor,
          padding: "54px 46px 44px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 14,
            color: accentColor,
            marginBottom: 24,
          }}
        >
          {coverLabel}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 34,
              background: "linear-gradient(180deg, rgba(51,112,255,0.2), rgba(77,226,255,0.12))",
              border: `1px solid ${accentColor}33`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 76,
                lineHeight: 1,
                fontWeight: 900,
                color: "#fbbf24",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              3
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: mutedTextColor, fontWeight: 700 }}>
              PROOFS
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 104,
                lineHeight: 0.92,
                fontWeight: 900,
                color: "#f8fbff",
                letterSpacing: 2,
                textShadow: `0 0 40px ${highlightColor}55`,
                marginBottom: 12,
              }}
            >
              飞书 CLI
            </div>
            <div
              style={{
                fontSize: 56,
                lineHeight: 1.08,
                fontWeight: 900,
                marginBottom: 14,
                color: textColor,
              }}
            >
              Agent 开始进入
              <br />
              协作工作流
            </div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.25,
                color: highlightColor,
                fontWeight: 800,
              }}
            >
              {coverSubtitle}
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 26,
            border: `1px solid ${accentColor}33`,
            background: panelColor,
            padding: "26px 28px",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["主题", "飞书 CLI"],
              ["场景", "Docs / Calendar"],
              ["结果", "Bitable / Workflow"],
            ].map(([label, value], index) => (
              <div
                key={label}
                style={{
                  padding: "16px 18px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${index === 1 ? highlightColor : accentColor}33`,
                }}
              >
                <div style={{ fontSize: 18, color: mutedTextColor, marginBottom: 10 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: 999,
            border: `1px solid ${highlightColor}33`,
            background: "rgba(255,255,255,0.03)",
            padding: "14px 22px",
            textAlign: "center",
            fontSize: 24,
            color: highlightColor,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          {coverStrip}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};

export default FeishuCLICover;
