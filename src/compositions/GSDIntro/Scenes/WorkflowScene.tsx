import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GSDIntroProps } from "../schema";
import { lineGrow, pipelineNodeReveal, staggerDelay, typewriterLength } from "../animations";
import { SceneBackground } from "../../../components/SceneBackground";

export const WorkflowScene: React.FC<GSDIntroProps> = ({
  installCommand,
  workflowSteps,
  backgroundColor,
  accentColor,
  terminalGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typeDelay = Math.round(fps * 0.25);
  const typedLen = typewriterLength(frame, installCommand, fps, typeDelay, 22);
  const typedCmd = installCommand.slice(0, typedLen);

  const stepsStart = Math.round(fps * 0.85);
  const dotSize = 12;
  const lineHeight = 28;

  return (
    <SceneBackground
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      particles={{
        count: 32,
        speed: 0.38,
        color: accentColor,
        opacity: 0.34,
      }}
      scanlines
      hud={false}
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
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          WORKFLOW
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 920,
            marginBottom: 28,
            padding: "18px 22px",
            borderRadius: 14,
            backgroundColor: "#000000",
            border: `1px solid ${terminalGreen}44`,
            boxShadow: `0 0 24px ${accentColor}18`,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: 700,
              color: terminalGreen,
              wordBreak: "break-all",
              lineHeight: 1.35,
            }}
          >
            <span style={{ color: `${terminalGreen}aa` }}>$ </span>
            {typedCmd}
            {typedLen < installCommand.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 22,
                  marginLeft: 4,
                  verticalAlign: "text-bottom",
                  backgroundColor: terminalGreen,
                  opacity: Math.floor(frame / Math.max(1, Math.round(fps * 0.35))) % 2,
                }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 880,
          }}
        >
          {workflowSteps.map((step, index) => {
            const nodeDelay = stepsStart + staggerDelay(index, 8);
            const nodeAnim = pipelineNodeReveal(frame, fps, 0, nodeDelay);
            const lineDelay = nodeDelay + Math.round(fps * 0.32);
            const lineProgress =
              index < workflowSteps.length - 1 ? lineGrow(frame, fps, lineDelay, 0.35) : 0;

            return (
              <React.Fragment key={`${step.command}-${index}`}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 16,
                    width: "100%",
                    maxWidth: 820,
                    opacity: nodeAnim.opacity,
                    transform: `translateY(${nodeAnim.y}px) scale(${nodeAnim.scale})`,
                  }}
                >
                  <div
                    style={{
                      width: dotSize,
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                        boxShadow: `0 0 14px ${accentColor}, 0 0 28px ${accentColor}66`,
                      }}
                    />
                    {index < workflowSteps.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          height: lineHeight,
                          marginTop: 0,
                          backgroundColor: accentColor,
                          transformOrigin: "top center",
                          transform: `scaleY(${lineProgress})`,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 0, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 24,
                        fontWeight: 700,
                        color: terminalGreen,
                        marginBottom: 4,
                        wordBreak: "break-all",
                      }}
                    >
                      {`/gsd:${step.command}`}
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 500,
                        color: "#aaa",
                        lineHeight: 1.35,
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </SceneBackground>
  );
};
