import { interpolate, spring } from "remotion";

export const fadeInUp = (frame: number, startFrame: number, fps: number, delay: number = 0) => {
  const animFrame = frame - startFrame - delay;
  const sp = spring({
    frame: animFrame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  return {
    opacity: interpolate(sp, [0, 1], [0, 1]),
    y: interpolate(sp, [0, 1], [40, 0]),
  };
};

export const fadeIn = (frame: number, startFrame: number, delay: number = 0) => {
  const animFrame = frame - startFrame - delay;
  return interpolate(animFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
