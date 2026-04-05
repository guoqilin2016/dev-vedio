import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { CodexECCProps } from "./schema";
import { getCoverTitleStyle } from "./cover-layout";

export const CodexECCCover: React.FC<CodexECCProps> = ({
  coverLabel,
  coverTitle,
  coverSubtitle,
  coverMetrics,
  backgroundColor,
  textColor,
  mutedTextColor,
  accentColor,
  highlightColor,
  warningColor,
  panelColor,
}) => {
  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 26,
        speed: 0.28,
        color: highlightColor,
        opacity: 0.24,
        connectLines: false,
      }}
      glow={{
        orbs: [
          {
            x: "24%",
            y: "18%",
            color: accentColor,
            radius: 340,
            opacity: 0.16,
            pulseSpeed: 0.5,
            pulseAmount: 0.15,
          },
          {
            x: "78%",
            y: "70%",
            color: highlightColor,
            radius: 260,
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
          padding: "54px 44px 42px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 14,
            color: accentColor,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          {coverLabel}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 182,
              height: 182,
              borderRadius: 36,
              border: `1px solid ${accentColor}44`,
              background: "linear-gradient(180deg, rgba(255,123,66,0.16), rgba(45,212,255,0.12))",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                fontSize: 46,
                lineHeight: 1,
                fontWeight: 900,
                color: warningColor,
                textAlign: "center",
              }}
            >
              入口战
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                color: mutedTextColor,
                fontWeight: 700,
                letterSpacing: 2,
            }}
          >
              WORKFLOW
            </div>
          </div>

          <div style={{ flex: 1, marginLeft: 26, minWidth: 0 }}>
            <div style={getCoverTitleStyle(coverTitle)}>
              {coverTitle}
            </div>
            <div
              style={{
                fontSize: 42,
                lineHeight: 1.22,
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
            borderRadius: 28,
            border: `1px solid ${highlightColor}33`,
            background: panelColor,
            padding: "26px 28px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {coverMetrics.map((metric, index) => (
              <div
                key={`${metric}-${index}`}
                style={{
                  borderRadius: 20,
                  padding: "18px 16px",
                  border: `1px solid ${index === 2 ? accentColor : highlightColor}33`,
                  background: "rgba(255,255,255,0.03)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: index === 2 ? 38 : 30,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    color: index === 2 ? accentColor : textColor,
                    fontFamily: index === 2 ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
                  }}
                >
                  {metric}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    color: mutedTextColor,
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  {index === 0 ? "DATE" : index === 1 ? "HEAT" : "SHIFT"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {["Workflow > IDE", "Plugin > Platform", "System > Entry"].map((line) => (
            <div
              key={line}
              style={{
                flex: 1,
                borderRadius: 999,
                border: `1px solid ${accentColor}33`,
                background: "rgba(255,255,255,0.04)",
                padding: "12px 14px",
                textAlign: "center",
                fontSize: 17,
                fontWeight: 800,
                color: mutedTextColor,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};

export default CodexECCCover;
