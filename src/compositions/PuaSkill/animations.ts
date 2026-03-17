import { interpolate, spring, Easing } from "remotion";

export const fadeInUp = (
  frame: number,
  fps: number,
  delay: number = 0,
  distance: number = 60
) => {
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });
  return {
    opacity: interpolate(sp, [0, 1], [0, 1]),
    y: interpolate(sp, [0, 1], [distance, 0]),
  };
};

export const fadeIn = (frame: number, delay: number = 0, duration: number = 15) => {
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const scaleIn = (frame: number, fps: number, delay: number = 0) => {
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  return interpolate(sp, [0, 1], [0.3, 1]);
};

export const glitchOffset = (frame: number, intensity: number = 1) => {
  const seed = Math.sin(frame * 127.1 + frame * 311.7);
  const shouldGlitch = Math.abs(seed) > 0.85;
  if (!shouldGlitch) return { x: 0, y: 0, skew: 0 };
  return {
    x: (Math.sin(frame * 43.7) * 8 + Math.cos(frame * 67.3) * 4) * intensity,
    y: (Math.cos(frame * 23.1) * 3) * intensity,
    skew: Math.sin(frame * 97.3) * 2 * intensity,
  };
};

export const pulseGlow = (frame: number, fps: number, speed: number = 2) => {
  const cycle = (frame / fps) * speed * Math.PI * 2;
  return 0.5 + 0.5 * Math.sin(cycle);
};

export const numberCountUp = (
  frame: number,
  fps: number,
  target: number,
  durationSec: number = 2,
  delay: number = 0
) => {
  const progress = interpolate(
    frame - delay,
    [0, durationSec * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );
  return Math.floor(progress * target);
};

export const staggerDelay = (index: number, baseDelay: number = 8) => {
  return index * baseDelay;
};

export const cardSlideIn = (
  frame: number,
  fps: number,
  delay: number = 0
) => {
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 180, mass: 0.6 },
  });
  return {
    opacity: interpolate(sp, [0, 1], [0, 1]),
    x: interpolate(sp, [0, 1], [120, 0]),
    scale: interpolate(sp, [0, 1], [0.9, 1]),
  };
};

export const pressureReveal = (
  frame: number,
  fps: number,
  index: number,
  baseDelay: number = 0
) => {
  const delay = baseDelay + index * 18;
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.5 },
  });
  return {
    opacity: interpolate(sp, [0, 1], [0, 1]),
    scale: interpolate(sp, [0, 1], [0.4, 1]),
    y: interpolate(sp, [0, 1], [30, 0]),
  };
};

export const shakeEffect = (frame: number, intensity: number = 1) => {
  const shake = Math.sin(frame * 47.3) * Math.cos(frame * 31.7);
  return {
    x: shake * 3 * intensity,
    y: Math.cos(frame * 23.1) * 2 * intensity,
  };
};

export const progressBar = (
  frame: number,
  fps: number,
  delay: number = 0,
  durationSec: number = 1.5
) => {
  return interpolate(frame - delay, [0, durationSec * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
};
