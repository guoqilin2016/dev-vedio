import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Category, ClawSkillsProps } from "../schema";
import { fadeInUp, fadeIn, cardSlideIn, staggerDelay, pulseGlow } from "../animations";

const SkillCard: React.FC<{
  name: string;
  desc: string;
  icon: string;
  index: number;
  frame: number;
  fps: number;
  delay: number;
  catColor: string;
  goldColor: string;
}> = ({ name, desc, icon, index, frame, fps, delay, catColor, goldColor }) => {
  const anim = cardSlideIn(frame, fps, delay);
  const glow = pulseGlow(frame, fps, 1.5 + index * 0.3);

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: `translateX(${anim.x}px) scale(${anim.scale})`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        borderRadius: 14,
        background: `linear-gradient(135deg, ${catColor}0c, ${catColor}04)`,
        border: `1px solid ${catColor}28`,
        boxShadow: `0 0 ${8 + glow * 8}px ${catColor}08`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${catColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#e8e8e8",
            fontFamily: "monospace",
            letterSpacing: 0.5,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 17, color: "#999", marginTop: 3, lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: goldColor,
          padding: "3px 8px",
          borderRadius: 8,
          border: `1px solid ${goldColor}33`,
          fontWeight: 700,
          fontFamily: "monospace",
          flexShrink: 0,
        }}
      >
        3.4+
      </div>
    </div>
  );
};

interface CategorySceneProps extends ClawSkillsProps {
  categoryIndex: number;
}

export const CategoryScene: React.FC<CategorySceneProps> = (props) => {
  const { categories, backgroundColor, textColor, goldColor, categoryIndex } = props;
  const category: Category = categories[categoryIndex];

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const glow = pulseGlow(frame, fps, 2);

  const tagAnim = fadeInUp(frame, fps, 0, 30);
  const titleAnim = fadeInUp(frame, fps, 6, 50);
  const cardsStart = Math.round(fps * 1);

  const highlightStart = Math.round(durationInFrames * 0.8);
  const highlightAnim = spring({
    frame: frame - highlightStart,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const sideBarHeight = interpolate(
    frame,
    [0, durationInFrames * 0.3],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${category.color}0c 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          width: 3,
          height: 120,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${sideBarHeight}%`,
            backgroundColor: category.color,
            borderRadius: 2,
            boxShadow: `0 0 12px ${category.color}`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 70,
          left: 50,
          right: 50,
          opacity: tagAnim.opacity,
          transform: `translateY(${tagAnim.y}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 16px",
            borderRadius: 20,
            border: `1px solid ${category.color}44`,
            background: `${category.color}0c`,
          }}
        >
          <span style={{ fontSize: 14, color: category.color, letterSpacing: 3, fontWeight: 700 }}>
            {category.tag}
          </span>
          <span
            style={{
              fontSize: 12,
              color: goldColor,
              padding: "2px 8px",
              borderRadius: 10,
              background: `${goldColor}15`,
            }}
          >
            {category.skills.length} SKILLS
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 50,
          right: 50,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.y}px)`,
        }}
      >
        <span style={{ fontSize: 52 }}>{category.icon}</span>
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: textColor,
            lineHeight: 1.3,
            textShadow: `0 0 30px ${category.color}33`,
          }}
        >
          {category.title}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 280,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {category.skills.map((skill, i) => (
          <SkillCard
            key={i}
            name={skill.name}
            desc={skill.desc}
            icon={skill.icon}
            index={i}
            frame={frame}
            fps={fps}
            delay={cardsStart + staggerDelay(i, 12)}
            catColor={category.color}
            goldColor={goldColor}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 50,
          right: 50,
          height: 2,
          borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${category.color}66, transparent)`,
          opacity: interpolate(highlightAnim, [0, 1], [0, 0.8]),
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 16,
          color: category.color,
          opacity: interpolate(highlightAnim, [0, 1], [0, 0.6 + glow * 0.4]),
          letterSpacing: 3,
        }}
      >
        {categoryIndex + 1} / 4
      </div>
    </AbsoluteFill>
  );
};
