import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TextPresentationProps } from "../schema";
import { fadeIn, fadeInUp } from "./animations";

export const EndingScene: React.FC<TextPresentationProps> = ({
  accentColor,
  backgroundColor,
  highlightColor,
  endingSlogan,
  textColor,
  callToAction,
  endingFooter,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = 0;
  
  const anim1 = fadeInUp(frame, startFrame, fps);
  const pulseScale = interpolate(
    spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 5, stiffness: 50 },
    }),
    [0, 1],
    [1, 1.05]
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${accentColor}22 0%, ${backgroundColor} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        flexDirection: "column",
        padding: 80,
      }}
    >
      {/* 核心口号 */}
      <div
        style={{
          fontSize: 80,
          fontWeight: "900",
          color: highlightColor,
          textAlign: "center",
          transform: `scale(${pulseScale})`,
          opacity: anim1.opacity,
          textShadow: `0 0 80px ${highlightColor}66`,
          letterSpacing: 4,
        }}
      >
        {endingSlogan}
      </div>

      {/* 行动号召 */}
      <div
        style={{
          fontSize: 32,
          color: textColor,
          marginTop: 50,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.8,
          opacity: fadeIn(frame, startFrame, 20),
        }}
      >
        {callToAction}
      </div>

      {/* 底部装饰 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 24,
          color: accentColor,
          opacity: fadeIn(frame, startFrame, 40),
        }}
      >
        {endingFooter}
      </div>
    </AbsoluteFill>
  );
};
