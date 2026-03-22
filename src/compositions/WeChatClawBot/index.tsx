import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  KaraokeSubtitle,
  SubtitleLine,
  SubtitleWord,
} from "../../components/KaraokeSubtitle";
import { SceneTransition } from "../../components/Transitions";
import { WeChatClawBotProps } from "./schema";

const SCENE_COUNT = 7;

const SAFE_AREA_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 420,
  padding: "0 44px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const PUNCTUATION_REGEX = /[，。！？、：；,.!?]/;

const fadeIn = (frame: number, delay: number, duration: number) => {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

const fadeInUp = (frame: number, delay: number, duration: number, distance = 40) => {
  const opacity = fadeIn(frame, delay, duration);
  return {
    opacity,
    y: interpolate(opacity, [0, 1], [distance, 0]),
  };
};

const scaleIn = (frame: number, fps: number, delay = 0) => {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      stiffness: 130,
    },
  });
};

const staggerDelay = (index: number, gap: number) => index * gap;

const typewriterLength = (frame: number, text: string, delay: number, speed = 2) => {
  return Math.max(0, Math.min(text.length, Math.floor((frame - delay) / speed)));
};

const buildSubtitleLines = (
  scripts: string[],
  sceneStarts: number[],
  sceneDurations: number[],
  fps: number,
): SubtitleLine[] => {
  const lines: SubtitleLine[] = [];
  const voiceDelay = Math.round(fps * 0.3);

  scripts.forEach((script, index) => {
    const start = (sceneStarts[index] ?? 0) + voiceDelay;
    const duration = Math.max(1, (sceneDurations[index] ?? 0) - voiceDelay - 12);
    const chars = script.replace(/\s+/g, "").split("");
    const totalChars = chars.filter((char) => !PUNCTUATION_REGEX.test(char)).length || chars.length;
    const words: SubtitleWord[] = [];

    let currentFrame = start;
    let currentWord = "";
    let wordStartFrame = currentFrame;

    const flushWord = () => {
      if (!currentWord) {
        return;
      }
      const visibleChars = currentWord.replace(/\s+/g, "").length;
      const wordDuration = Math.max(
        2,
        Math.round((visibleChars / totalChars) * duration),
      );
      words.push({
        text: currentWord,
        startFrame: wordStartFrame,
        endFrame: Math.min(wordStartFrame + wordDuration, start + duration),
      });
      currentFrame = wordStartFrame + wordDuration;
      wordStartFrame = currentFrame;
      currentWord = "";
    };

    chars.forEach((char) => {
      if (PUNCTUATION_REGEX.test(char)) {
        flushWord();
        words.push({
          text: char,
          startFrame: currentFrame,
          endFrame: Math.min(currentFrame + 2, start + duration),
        });
        currentFrame += 2;
        wordStartFrame = currentFrame;
        return;
      }

      currentWord += char;
      if (currentWord.length >= 4) {
        flushWord();
      }
    });

    flushWord();

    if (words.length > 0) {
      lines.push({
        words,
        startFrame: words[0].startFrame,
        endFrame: words[words.length - 1].endFrame,
      });
    }
  });

  return lines;
};

const SceneShell: React.FC<{
  backgroundColor: string;
  accentColor: string;
  highlightColor: string;
  children: React.ReactNode;
}> = ({ backgroundColor, accentColor, highlightColor, children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        color: "#ffffff",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 18%, ${accentColor}30 0%, transparent 48%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 18% 82%, ${highlightColor}18 0%, transparent 32%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${accentColor}10 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}10 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
          opacity: 0.22,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${accentColor}07 3px, ${accentColor}07 6px)`,
          opacity: 0.75,
        }}
      />

      {[
        { top: 34, left: 34 },
        { top: 34, right: 34 },
        { bottom: 34, left: 34 },
        { bottom: 34, right: 34 },
      ].map((position, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            ...position,
            width: 56,
            height: 56,
            opacity: 0.6,
            borderTop: index < 2 ? `2px solid ${accentColor}` : "none",
            borderBottom: index >= 2 ? `2px solid ${accentColor}` : "none",
            borderLeft: index % 2 === 0 ? `2px solid ${accentColor}` : "none",
            borderRight: index % 2 === 1 ? `2px solid ${accentColor}` : "none",
          }}
        />
      ))}

      {children}
    </AbsoluteFill>
  );
};

const SectionTag: React.FC<{ label: string; color: string; frame: number; delay: number }> = ({
  label,
  color,
  frame,
  delay,
}) => {
  const anim = fadeInUp(frame, delay, 12, 18);
  return (
    <div
      style={{
        fontSize: 16,
        letterSpacing: 6,
        fontWeight: 800,
        color,
        marginBottom: 18,
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
      }}
    >
      {label}
    </div>
  );
};

const PhoneMock: React.FC<{
  frame: number;
  fps: number;
  accentColor: string;
  userText: string;
  replyText: string;
}> = ({ frame, fps, accentColor, userText, replyText }) => {
  const shellScale = scaleIn(frame, fps, 6);
  const replyLen = typewriterLength(frame, replyText, 28, 1.4);

  return (
    <div
      style={{
        alignSelf: "center",
        width: 520,
        maxWidth: "100%",
        borderRadius: 38,
        padding: 18,
        background: "linear-gradient(180deg, rgba(245,245,245,0.96), rgba(226,232,240,0.96))",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: `0 20px 80px ${accentColor}22`,
        transform: `scale(${interpolate(shellScale, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 10px 16px",
          color: "#101010",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        <span>微信 ClawBot</span>
        <span
          style={{
            fontSize: 14,
            backgroundColor: "#d1d5db",
            borderRadius: 999,
            padding: "4px 10px",
          }}
        >
          AI
        </span>
      </div>

      <div
        style={{
          minHeight: 420,
          borderRadius: 28,
          padding: 22,
          backgroundColor: "#ececec",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "78%",
            padding: "18px 22px",
            borderRadius: 22,
            borderBottomRightRadius: 6,
            backgroundColor: "#97f35f",
            color: "#0d1117",
            fontSize: 28,
            lineHeight: 1.35,
            fontWeight: 600,
          }}
        >
          {userText}
        </div>

        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "86%",
            padding: "18px 22px",
            borderRadius: 22,
            borderBottomLeftRadius: 6,
            backgroundColor: "#ffffff",
            color: "#151515",
            fontSize: 24,
            lineHeight: 1.45,
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 2,
              fontWeight: 800,
              color: accentColor,
              marginBottom: 8,
            }}
          >
            AGENT RESPONSE
          </div>
          {replyText.slice(0, replyLen)}
          {replyLen < replyText.length ? (
            <span style={{ opacity: frame % 12 < 6 ? 1 : 0 }}>▍</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ChipRow: React.FC<{ items: string[]; accentColor: string; frame: number; delay: number }> = ({
  items,
  accentColor,
  frame,
  delay,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        justifyContent: "center",
      }}
    >
      {items.map((item, index) => {
        const anim = fadeInUp(frame, delay + staggerDelay(index, 5), 10, 16);
        return (
          <div
            key={item}
            style={{
              padding: "12px 18px",
              borderRadius: 999,
              border: `1px solid ${accentColor}44`,
              backgroundColor: `${accentColor}12`,
              color: "#ecfdf5",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              opacity: anim.opacity,
              transform: `translateY(${anim.y}px)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

const HookScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  hookTitle,
  hookSubtitle,
  hookPrompt,
  hookReply,
  hookStats,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coverPhase = frame < 3;
  const titleAnim = coverPhase ? { opacity: 1, y: 0 } : fadeInUp(frame, 0, 14, 40);
  const subtitleAnim = coverPhase ? { opacity: 1, y: 0 } : fadeInUp(frame, 8, 12, 28);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="WECHAT ENTRY" color={accentColor} frame={frame} delay={0} />

        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.12,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            textShadow: `0 0 24px ${highlightColor}33`,
            marginBottom: 18,
          }}
        >
          {hookTitle}
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.4,
            color: accentColor,
            opacity: subtitleAnim.opacity,
            transform: `translateY(${subtitleAnim.y}px)`,
            marginBottom: 38,
          }}
        >
          {hookSubtitle}
        </div>

        <PhoneMock
          frame={frame}
          fps={fps}
          accentColor={accentColor}
          userText={hookPrompt}
          replyText={hookReply}
        />

        <div style={{ height: 28 }} />

        <ChipRow items={hookStats} accentColor={accentColor} frame={frame} delay={18} />
      </div>
    </SceneShell>
  );
};

const SignalScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  warningColor,
  signalTitle,
  signalCards,
}) => {
  const frame = useCurrentFrame();
  const titleAnim = fadeInUp(frame, 0, 12, 36);
  const countScale = scaleIn(frame, 30, 4);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="FACT CHECK" color={warningColor} frame={frame} delay={0} />

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            marginBottom: 20,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: accentColor,
              fontFamily: "monospace",
              transform: `scale(${interpolate(countScale, [0, 1], [0.65, 1])})`,
            }}
          >
            3
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#cbd5e1",
              lineHeight: 1.4,
            }}
          >
            个交叉信号
          </div>
        </div>

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            color: textColor,
            marginBottom: 26,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
          }}
        >
          {signalTitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {signalCards.map((card, index) => {
            const anim = fadeInUp(frame, 10 + staggerDelay(index, 6), 10, 24);
            return (
              <div
                key={card.tag}
                style={{
                  padding: "22px 24px",
                  borderRadius: 24,
                  border: `1px solid ${accentColor}30`,
                  backgroundColor: "rgba(7, 17, 13, 0.58)",
                  boxShadow: `0 18px 36px rgba(0, 0, 0, 0.18)`,
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px)`,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "6px 12px",
                    borderRadius: 999,
                    backgroundColor: `${accentColor}14`,
                    color: accentColor,
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: 2,
                    marginBottom: 12,
                  }}
                >
                  {card.tag}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: textColor,
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1.55,
                    color: "#d4d4d8",
                  }}
                >
                  {card.detail}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 24,
            fontWeight: 700,
            color: warningColor,
            lineHeight: 1.5,
          }}
        >
          结论：有强信号，但不能直接说“已经全面官宣落地”。
        </div>
      </div>
    </SceneShell>
  );
};

const GatewayScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  gatewayTitle,
  gatewayNodes,
}) => {
  const frame = useCurrentFrame();
  const titleAnim = fadeInUp(frame, 0, 12, 36);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="GATEWAY MODEL" color={accentColor} frame={frame} delay={0} />

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 18,
          }}
        >
          {gatewayTitle}
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#d4d4d8",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          OpenClaw 文档把 Chat Channels 直接列成独立层。入口留在聊天软件里，
          Agent 的编排、工具和记忆统一留在 OpenClaw 后台。
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {gatewayNodes.map((node, index) => {
            const anim = fadeInUp(frame, 10 + staggerDelay(index, 6), 10, 22);
            return (
              <React.Fragment key={node.title}>
                <div
                  style={{
                    padding: "20px 22px",
                    borderRadius: 22,
                    border: `1px solid ${accentColor}30`,
                    background: `linear-gradient(135deg, ${accentColor}10, rgba(255,255,255,0.03))`,
                    opacity: anim.opacity,
                    transform: `translateY(${anim.y}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: 8,
                    }}
                  >
                    {node.title}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      lineHeight: 1.55,
                      color: "#d4d4d8",
                    }}
                  >
                    {node.detail}
                  </div>
                </div>
                {index < gatewayNodes.length - 1 ? (
                  <div
                    style={{
                      alignSelf: "center",
                      fontSize: 28,
                      color: accentColor,
                      opacity: fadeIn(frame, 14 + staggerDelay(index, 6), 8),
                    }}
                  >
                    ↓
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const UseCaseScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  useCaseTitle,
  useCasePrompt,
  useCaseReply,
  useCases,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleAnim = fadeInUp(frame, 0, 12, 36);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="USE CASES" color={accentColor} frame={frame} delay={0} />

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 26,
          }}
        >
          {useCaseTitle}
        </div>

        <PhoneMock
          frame={frame}
          fps={fps}
          accentColor={accentColor}
          userText={useCasePrompt}
          replyText={useCaseReply}
        />

        <div style={{ height: 24 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 14,
          }}
        >
          {useCases.map((item, index) => {
            const anim = fadeInUp(frame, 18 + staggerDelay(index, 5), 10, 18);
            return (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 20px",
                  borderRadius: 20,
                  border: `1px solid ${accentColor}28`,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px)`,
                }}
              >
                <div
                  style={{
                    minWidth: 110,
                    fontSize: 18,
                    fontWeight: 800,
                    color: accentColor,
                    letterSpacing: 1,
                  }}
                >
                  {item.metric}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: 6,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      lineHeight: 1.5,
                      color: "#d4d4d8",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const EcosystemScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  warningColor,
  ecosystemTitle,
  ecosystemFeatures,
}) => {
  const frame = useCurrentFrame();
  const titleAnim = fadeInUp(frame, 0, 12, 36);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="ECOSYSTEM" color={accentColor} frame={frame} delay={0} />

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 22,
          }}
        >
          {ecosystemTitle}
        </div>

        <div
          style={{
            borderRadius: 28,
            border: `1px solid ${accentColor}2a`,
            backgroundColor: "rgba(4, 10, 9, 0.58)",
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: textColor,
              }}
            >
              openclaw-wechat
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: accentColor,
              }}
            >
              COMMUNITY PLUGIN
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#d4d4d8",
              lineHeight: 1.55,
            }}
          >
            GitHub README 已公开列出安装命令、配置项、扫码登录、多账号和消息能力。
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {ecosystemFeatures.map((feature, index) => {
            const anim = fadeInUp(frame, 14 + staggerDelay(index, 5), 10, 20);
            return (
              <div
                key={feature.title}
                style={{
                  padding: "20px 18px",
                  borderRadius: 22,
                  border: `1px solid ${accentColor}28`,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: textColor,
                    marginBottom: 8,
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "#d4d4d8",
                  }}
                >
                  {feature.detail}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            lineHeight: 1.5,
            color: warningColor,
            fontWeight: 700,
          }}
        >
          要点：社区链路已跑通，不代表“官方全面开放”这一步已经走完。
        </div>
      </div>
    </SceneShell>
  );
};

const RiskScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  warningColor,
  riskTitle,
  riskPoints,
}) => {
  const frame = useCurrentFrame();
  const titleAnim = fadeInUp(frame, 0, 12, 36);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <SectionTag label="RISK CONTROL" color={warningColor} frame={frame} delay={0} />

        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            color: textColor,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.y}px)`,
            marginBottom: 26,
          }}
        >
          {riskTitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {riskPoints.map((risk, index) => {
            const anim = fadeInUp(frame, 10 + staggerDelay(index, 6), 10, 22);
            return (
              <div
                key={risk.title}
                style={{
                  padding: "22px 24px",
                  borderRadius: 24,
                  border: `1px solid ${warningColor}32`,
                  backgroundColor: "rgba(21, 10, 8, 0.5)",
                  opacity: anim.opacity,
                  transform: `translateY(${anim.y}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: warningColor,
                    marginBottom: 10,
                  }}
                >
                  {risk.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1.55,
                    color: "#f4f4f5",
                  }}
                >
                  {risk.detail}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 26,
            padding: "20px 22px",
            borderRadius: 24,
            backgroundColor: `${accentColor}10`,
            border: `1px solid ${accentColor}28`,
            fontSize: 26,
            lineHeight: 1.5,
            color: textColor,
            fontWeight: 700,
          }}
        >
          重点不是让 Agent 直接拍板，而是让它先辅助、再交给人类确认。
        </div>
      </div>
    </SceneShell>
  );
};

const CTAScene: React.FC<WeChatClawBotProps> = ({
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  ctaTitle,
  ctaBody,
  ctaSlogan,
  ctaTags,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleScale = scaleIn(frame, fps, 0);
  const bodyAnim = fadeInUp(frame, 12, 12, 30);
  const sloganAnim = fadeInUp(frame, 24, 12, 24);

  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <div
          style={{
            alignSelf: "center",
            padding: "10px 18px",
            borderRadius: 999,
            border: `1px solid ${accentColor}44`,
            backgroundColor: `${accentColor}10`,
            color: accentColor,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 4,
            marginBottom: 26,
          }}
        >
          FINAL TAKE
        </div>

        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 900,
            textAlign: "center",
            color: textColor,
            transform: `scale(${interpolate(titleScale, [0, 1], [0.78, 1])})`,
            textShadow: `0 0 28px ${highlightColor}33`,
          }}
        >
          {ctaTitle}
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 44,
            lineHeight: 1.28,
            fontWeight: 800,
            textAlign: "center",
            color: accentColor,
            opacity: bodyAnim.opacity,
            transform: `translateY(${bodyAnim.y}px)`,
          }}
        >
          {ctaBody}
        </div>

        <div
          style={{
            marginTop: 26,
            padding: "22px 26px",
            borderRadius: 28,
            border: `1px solid ${accentColor}32`,
            backgroundColor: "rgba(255,255,255,0.03)",
            fontSize: 26,
            lineHeight: 1.6,
            textAlign: "center",
            color: "#e7fbe8",
            opacity: sloganAnim.opacity,
            transform: `translateY(${sloganAnim.y}px)`,
          }}
        >
          {ctaSlogan}
        </div>

        <div style={{ height: 34 }} />

        <ChipRow items={ctaTags} accentColor={accentColor} frame={frame} delay={28} />
      </div>
    </SceneShell>
  );
};

const SCENES: React.FC<WeChatClawBotProps>[] = [
  HookScene,
  SignalScene,
  GatewayScene,
  UseCaseScene,
  EcosystemScene,
  RiskScene,
  CTAScene,
];

export const WeChatClawBot: React.FC<WeChatClawBotProps> = (props) => {
  const {
    sceneDurations,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    audio,
    accentColor,
    backgroundColor,
  } = props;

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const defaultSceneDuration = Math.floor(durationInFrames / SCENE_COUNT);

  const sceneStartFrames = useMemo(() => {
    if (sceneDurations && sceneDurations.length === SCENE_COUNT) {
      const starts: number[] = [0];
      for (let i = 0; i < SCENE_COUNT - 1; i++) {
        starts.push(starts[i] + sceneDurations[i]);
      }
      return starts;
    }

    return Array.from({ length: SCENE_COUNT }, (_, index) => index * defaultSceneDuration);
  }, [sceneDurations, defaultSceneDuration]);

  const sceneDurationList = useMemo(() => {
    return Array.from({ length: SCENE_COUNT }, (_, index) => {
      if (sceneDurations && sceneDurations[index]) {
        return sceneDurations[index];
      }
      return defaultSceneDuration;
    });
  }, [sceneDurations, defaultSceneDuration]);

  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) {
      return [];
    }

    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }

    if (!voiceoverScripts || voiceoverScripts.length === 0) {
      return [];
    }

    return buildSubtitleLines(voiceoverScripts, sceneStartFrames, sceneDurationList, fps);
  }, [
    subtitle.enabled,
    precomputedSubtitles,
    voiceoverScripts,
    sceneStartFrames,
    sceneDurationList,
    fps,
  ]);

  const currentSceneIndex = useMemo(() => {
    for (let i = SCENE_COUNT - 1; i >= 0; i--) {
      if (frame >= sceneStartFrames[i]) {
        return i;
      }
    }
    return 0;
  }, [frame, sceneStartFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {audio.backgroundMusic ? (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={(currentFrame) => {
            const fadeInVolume = interpolate(currentFrame, [0, fps * 2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOutVolume = interpolate(
              currentFrame,
              [durationInFrames - fps * 2, durationInFrames],
              [1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return Math.min(fadeInVolume, fadeOutVolume) * audio.backgroundMusicVolume;
          }}
          loop
        />
      ) : null}

      {audio.voiceoverEnabled
        ? (audio.voiceoverAudioFiles ?? []).map((audioFile, index) => (
            <Sequence
              key={audioFile}
              from={sceneStartFrames[index] + Math.round(fps * 0.3)}
              durationInFrames={sceneDurationList[index] ?? defaultSceneDuration}
              premountFor={Math.round(fps * 0.5)}
            >
              <Audio src={staticFile(audioFile)} volume={audio.voiceoverVolume} />
            </Sequence>
          ))
        : null}

      {SCENES.map((SceneComponent, index) => (
        <Sequence
          key={`scene-${index}`}
          from={sceneStartFrames[index]}
          durationInFrames={sceneDurationList[index] ?? defaultSceneDuration}
          premountFor={Math.round(fps * 0.4)}
        >
          <SceneTransition type="fade" durationInFrames={10}>
            <SceneComponent {...props} />
          </SceneTransition>
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          top: 42,
          right: 24,
          width: 4,
          height: 110,
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${((currentSceneIndex + 1) / SCENE_COUNT) * 100}%`,
            background: `linear-gradient(180deg, ${accentColor}, ${props.highlightColor})`,
            borderRadius: 999,
            boxShadow: `0 0 18px ${accentColor}`,
          }}
        />
      </div>

      {subtitle.enabled && subtitleLines.length > 0 ? (
        <KaraokeSubtitle
          lines={subtitleLines}
          fontSize={subtitle.fontSize}
          textColor={subtitle.textColor}
          highlightColor={subtitle.highlightColor}
          backgroundColor={subtitle.backgroundColor}
          position={subtitle.position}
          style={{ bottom: 380 }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export default WeChatClawBot;
