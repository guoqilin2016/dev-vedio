import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TextPresentationProps } from "../schema";
import { fadeInUp } from "./animations";

export const StepsScene: React.FC<TextPresentationProps> = ({
  backgroundColor,
  highlightColor,
  stepsMainTitle,
  step1Icon,
  step1Title,
  step1Content,
  step2Icon,
  step2Title,
  step2Content,
  step3Icon,
  step3Title,
  step3Content,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0;
  
  const titleAnim = fadeInUp(frame, startFrame, fps);

  const steps = [
    {
      icon: step1Icon,
      title: step1Title,
      content: step1Content,
      color: "#00d9ff",
    },
    {
      icon: step2Icon,
      title: step2Title,
      content: step2Content,
      color: "#ffd700",
    },
    {
      icon: step3Icon,
      title: step3Title,
      content: step3Content,
      color: "#00ff88",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 60,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: highlightColor,
          marginBottom: 40,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.y}px)`,
        }}
      >
        {stepsMainTitle}
      </h2>

      {/* 三个步骤卡片 */}
      <div
        style={{
          display: "flex",
          gap: 30,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {steps.map((step, index) => {
          const stepAnim = fadeInUp(frame, startFrame, fps, 20 + index * 15);
          return (
            <div
              key={index}
              style={{
                width: 320,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                borderRadius: 16,
                padding: 30,
                border: `2px solid ${step.color}44`,
                opacity: stepAnim.opacity,
                transform: `translateY(${stepAnim.y}px)`,
              }}
            >
              {/* 步骤编号 */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: step.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: backgroundColor,
                  marginBottom: 20,
                }}
              >
                {index + 1}
              </div>

              {/* 图标 */}
              <div style={{ fontSize: 48, marginBottom: 15 }}>{step.icon}</div>

              {/* 标题 */}
              <h3
                style={{
                  fontSize: 24,
                  color: step.color,
                  margin: "0 0 10px 0",
                }}
              >
                {step.title}
              </h3>

              {/* 内容 */}
              <p
                style={{
                  fontSize: 18,
                  color: textColor,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.content}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
