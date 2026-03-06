import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TextPresentationProps } from "../schema";
import { fadeIn, fadeInUp } from "./animations";

export const CaseScene: React.FC<TextPresentationProps> = ({
  backgroundColor,
  highlightColor,
  caseTitle,
  caseComparison,
  accentColor,
  textColor,
  caseContent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0;
  
  const anim1 = fadeInUp(frame, startFrame, fps);
  const anim2 = fadeInUp(frame, startFrame, fps, 20);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${backgroundColor} 0%, #1f1f35 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        flexDirection: "column",
        padding: 80,
      }}
    >
      {/* 案例标题 */}
      <div
        style={{
          fontSize: 36,
          color: highlightColor,
          fontWeight: "bold",
          marginBottom: 30,
          opacity: anim1.opacity,
          transform: `translateY(${anim1.y}px)`,
        }}
      >
        💡 {caseTitle}
      </div>

      {/* 对比展示 - 根据配置决定是否显示 */}
      {caseComparison && caseComparison.enabled ? (
        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "center",
            opacity: anim2.opacity,
            transform: `translateY(${anim2.y}px)`,
          }}
        >
          {/* 之前 */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#888", marginBottom: 20 }}>
              {caseComparison.beforeLabel}
            </div>
            <div
              style={{ fontSize: 72, fontWeight: "bold", color: "#ff6b6b" }}
            >
              {caseComparison.beforeValue}
            </div>
            <div style={{ fontSize: 48, marginTop: 10 }}>{caseComparison.beforeIcon}</div>
          </div>

          {/* 箭头 */}
          <div style={{ fontSize: 48, color: accentColor }}>→</div>

          {/* 之后 */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#888", marginBottom: 20 }}>
              {caseComparison.afterLabel}
            </div>
            <div
              style={{ fontSize: 72, fontWeight: "bold", color: "#00ff88" }}
            >
              {caseComparison.afterValue}
            </div>
            <div style={{ fontSize: 48, marginTop: 10 }}>{caseComparison.afterIcon}</div>
          </div>
        </div>
      ) : null}

      {/* 案例描述 */}
      <div
        style={{
          fontSize: caseComparison && caseComparison.enabled ? 28 : 36,
          color: textColor,
          marginTop: caseComparison && caseComparison.enabled ? 50 : 0,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.8,
          opacity: fadeIn(frame, startFrame, caseComparison && caseComparison.enabled ? 40 : 20),
        }}
      >
        {caseContent}
      </div>
    </AbsoluteFill>
  );
};
