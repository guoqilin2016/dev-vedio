import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneBackground } from "../../components/SceneBackground";
import { SceneTransition } from "../../components/Transitions";
import {
  KaraokeSubtitle,
  SubtitleLine,
  generateSubtitleLines,
} from "../../components/KaraokeSubtitle";
import {
  CodexECCProps,
  CodexECCECCStat,
  CodexECCEvidenceCard,
  CodexECCRiskCard,
  CodexECCShiftLayer,
  CodexECCStackRow,
} from "./schema";

const SCENE_COUNT = 7;
const DEFAULT_SCENE_DURATION = 450;

const getSceneDuration = (durations: number[], index: number) => {
  const value = durations[index];
  return typeof value === "number" && !Number.isNaN(value)
    ? value
    : DEFAULT_SCENE_DURATION;
};

const Label: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      fontSize: 20,
      letterSpacing: 8,
      color,
      fontWeight: 800,
    }}
  >
    {text}
  </div>
);

// 长标题在竖屏安全区内可靠换行，避免撑破横向布局
const titleClampStyle: React.CSSProperties = {
  maxWidth: "100%",
  width: "100%",
  overflowWrap: "break-word",
  wordBreak: "break-word",
};

const TitleBlock: React.FC<{
  label: string;
  title: string;
  subtitle: string;
  accentColor: string;
  highlightColor?: string;
  textColor: string;
  mutedTextColor: string;
}> = ({ label, title, subtitle, accentColor, highlightColor, textColor, mutedTextColor }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      minWidth: 0,
      width: "100%",
      maxWidth: 860,
      alignSelf: "stretch",
      marginBottom: 24,
    }}
  >
    {label ? <Label text={label} color={accentColor} /> : null}
    <div
      style={{
        fontSize: 65,
        lineHeight: 1.06,
        fontWeight: 900,
        background: highlightColor
          ? `linear-gradient(135deg, ${accentColor}, ${highlightColor})`
          : undefined,
        WebkitBackgroundClip: highlightColor ? "text" : undefined,
        WebkitTextFillColor: highlightColor ? "transparent" : undefined,
        color: highlightColor ? undefined : textColor,
        textShadow: highlightColor ? `0 0 40px ${accentColor}33` : undefined,
        ...titleClampStyle,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 36,
        lineHeight: 1.5,
        color: mutedTextColor,
        fontWeight: 600,
        ...titleClampStyle,
      }}
    >
      {subtitle}
    </div>
  </div>
);

const Panel: React.FC<{
  children: React.ReactNode;
  panelColor: string;
  borderColor: string;
  style?: React.CSSProperties;
}> = ({ children, panelColor, borderColor, style }) => (
  <div
    style={{
      borderRadius: 28,
      border: `1px solid ${borderColor}`,
      background: panelColor,
      boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
      padding: "24px 26px",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const BaseScene: React.FC<{
  accentColor: string;
  backgroundColor: string;
  highlightColor: string;
  children: React.ReactNode;
}> = ({ accentColor, backgroundColor, highlightColor, children }) => (
  <SceneBackground
    backgroundColor={backgroundColor}
    accentColor={accentColor}
    particles={{
      count: 34,
      speed: 0.3,
      color: highlightColor,
      opacity: 0.24,
      connectLines: false,
    }}
    glow={{
      orbs: [
        {
          x: "22%",
          y: "18%",
          color: accentColor,
          radius: 320,
          opacity: 0.14,
          pulseSpeed: 0.45,
          pulseAmount: 0.16,
        },
        {
          x: "82%",
          y: "72%",
          color: highlightColor,
          radius: 260,
          opacity: 0.14,
          pulseSpeed: 0.55,
          pulseAmount: 0.16,
        },
      ],
    }}
    hud={{ color: accentColor, animation: "pulse" }}
  >
    <AbsoluteFill
      style={{
        fontFamily: "\"PingFang SC\", \"SF Pro Display\", system-ui, sans-serif",
        padding: "100px 80px 440px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  </SceneBackground>
);

const GitHubRepoCard: React.FC<{
  accentColor: string;
  highlightColor: string;
  textColor: string;
  mutedTextColor: string;
  panelColor: string;
  rise: number;
}> = ({ accentColor, highlightColor, textColor, mutedTextColor, panelColor, rise }) => {
  const repoStats = [
    { icon: "\u2B50", label: "Stars", value: "1.2k" },
    { icon: "\uD83C\uDF74", label: "Forks", value: "86" },
    { icon: "\u26A0\uFE0F", label: "Issues", value: "58" },
    { icon: "\uD83D\uDD00", label: "PRs", value: "40" },
  ];

  const languages = [
    { name: "TypeScript", pct: 68, color: "#3178c6" },
    { name: "Python", pct: 22, color: "#3572A5" },
    { name: "Shell", pct: 10, color: "#89e051" },
  ];

  return (
    <div
      style={{
        borderRadius: 24,
        border: `1px solid ${highlightColor}33`,
        background: panelColor,
        boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${highlightColor}08`,
        padding: "28px 32px",
        boxSizing: "border-box",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        opacity: rise,
        transform: `translateY(${interpolate(rise, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* 顶栏：仓库图标 + 路径 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          {"\uD83D\uDCC2"}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28, color: highlightColor, fontWeight: 700 }}>openai</span>
            <span style={{ fontSize: 28, color: mutedTextColor }}>/</span>
            <span style={{ fontSize: 28, color: highlightColor, fontWeight: 700 }}>codex-plugin-cc</span>
          </div>
          <div style={{ fontSize: 20, color: mutedTextColor, marginTop: 4, letterSpacing: 1 }}>
            Public &middot; 2026-03-30 &middot; MIT License
          </div>
        </div>
      </div>

      {/* 描述 */}
      <div
        style={{
          fontSize: 28,
          lineHeight: 1.55,
          color: textColor,
          fontWeight: 600,
          marginBottom: 30,
          overflowWrap: "break-word",
          wordBreak: "break-word",
          paddingLeft: 6,
          borderLeft: `3px solid ${accentColor}`,
        }}
      >
        Codex plugin for Claude Code — review, rescue, and adversarial&#x2011;review workflows
      </div>

      {/* Stats 行 */}
      <div style={{ display: "flex", gap: 18, marginBottom: 22, flexWrap: "wrap" }}>
        {repoStats.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: textColor, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {s.value}
            </span>
            <span style={{ fontSize: 20, color: mutedTextColor }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* 语言条 */}
      <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 10, marginBottom: 12 }}>
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.pct}%`,
              background: lang.color,
              height: "100%",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {languages.map((lang) => (
          <div key={lang.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: lang.color }} />
            <span style={{ fontSize: 20, color: mutedTextColor }}>{lang.name} {lang.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HookScene: React.FC<CodexECCProps> = ({
  hookTitle,
  hookSubtitle,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ fps, frame, config: { damping: 14, stiffness: 110 } });

  return (
    <BaseScene
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          gap: 40,
        }}
      >
        <TitleBlock
          label=""
          title={hookTitle}
          subtitle={hookSubtitle}
          accentColor={accentColor}
          highlightColor={highlightColor}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />

        <GitHubRepoCard
          accentColor={accentColor}
          highlightColor={highlightColor}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
          panelColor={panelColor}
          rise={rise}
        />

        {/* 项目简介摘要 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            minWidth: 0,
            opacity: interpolate(rise, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(rise, [0, 1], [20, 0])}px)`,
          }}
        >
          {[
            { label: "切入方式", text: "不切平台，直接进入别人的主工作台", color: accentColor },
            { label: "核心价值", text: "争的不是模型，是工作流入口", color: highlightColor },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 24px",
                borderRadius: 16,
                border: `1px solid ${item.color}33`,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontSize: 20, letterSpacing: 4, color: item.color, fontWeight: 800, flexShrink: 0 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.5, color: textColor, fontWeight: 600, overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseScene>
  );
};

const ShiftScene: React.FC<CodexECCProps> = ({
  shiftTitle,
  shiftLayers,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <BaseScene
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          gap: 40,
        }}
      >
        <TitleBlock
          label=""
          title="争的不是模型，是工作流入口"
          subtitle={shiftTitle}
          accentColor={accentColor}
          highlightColor={highlightColor}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {shiftLayers.map((layer: CodexECCShiftLayer, index: number) => {
            const appear = spring({
              fps,
              frame: frame - index * 5,
              config: { damping: 16, stiffness: 120 },
            });
            return (
              <div
                key={layer.title}
                style={{
                  transform: `translateX(${interpolate(appear, [0, 1], [54, 0])}px)`,
                  opacity: appear,
                }}
              >
                <Panel
                  panelColor={panelColor}
                  borderColor={index >= 2 ? `${highlightColor}44` : `${accentColor}33`}
                  style={{ minWidth: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      gap: 14,
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: index >= 2 ? highlightColor : accentColor,
                        letterSpacing: 3,
                      }}
                    >
                      0{index + 1}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                      <div style={{ fontSize: 34, fontWeight: 900, color: textColor, overflowWrap: "break-word", wordBreak: "break-word" }}>
                        {layer.title}
                      </div>
                      <div style={{ fontSize: 26, lineHeight: 1.45, color: mutedTextColor, overflowWrap: "break-word", wordBreak: "break-word" }}>
                        {layer.detail}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: 999,
                        border: `1px solid ${highlightColor}33`,
                        color: highlightColor,
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: 2,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {layer.emphasis}
                    </div>
                  </div>
                </Panel>
              </div>
            );
          })}
        </div>
      </div>
    </BaseScene>
  );
};

const EvidenceScene: React.FC<CodexECCProps> = ({
  evidenceTitle,
  evidenceCards,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <BaseScene
    accentColor={accentColor}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <TitleBlock
        label=""
        title={evidenceTitle}
        subtitle="不是一条推文的热闹，而是三层基础设施同时成形。"
        accentColor={accentColor}
        highlightColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {evidenceCards.map((card: CodexECCEvidenceCard, index: number) => (
          <Panel
            key={`${card.tag}-${index}`}
            panelColor={panelColor}
            borderColor={index % 2 === 0 ? `${accentColor}44` : `${highlightColor}44`}
            style={{ minWidth: 0, overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  letterSpacing: 4,
                  color: index % 2 === 0 ? accentColor : highlightColor,
                  fontWeight: 800,
                }}
              >
                {card.tag}
              </div>
              <div style={{ fontSize: 32, lineHeight: 1.24, fontWeight: 900, color: textColor, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {card.title}
              </div>
              <div style={{ fontSize: 26, lineHeight: 1.52, color: mutedTextColor, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {card.detail}
              </div>
              <div style={{ fontSize: 20, color: "#cbd5e1", fontWeight: 700, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {card.footnote}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  </BaseScene>
);

const ECCScene: React.FC<CodexECCProps> = ({
  eccTitle,
  eccStats,
  eccPillars,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <BaseScene
    accentColor={accentColor}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <TitleBlock
        label=""
        title={eccTitle}
        subtitle="这已经不是单个插件，而是一整套工作流操作层。"
        accentColor={accentColor}
        highlightColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {eccStats.map((stat: CodexECCECCStat, index: number) => (
          <Panel
            key={`${stat.label}-${index}`}
            panelColor={panelColor}
            borderColor={index === 0 || index === 3 ? `${highlightColor}44` : `${accentColor}44`}
            style={{ minWidth: 0, overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 60,
                  lineHeight: 1,
                  fontWeight: 900,
                  color: index === 0 || index === 3 ? highlightColor : accentColor,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: textColor, overflowWrap: "break-word" }}>{stat.label}</div>
              <div style={{ fontSize: 24, lineHeight: 1.5, color: mutedTextColor, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {stat.detail}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: "100%", minWidth: 0 }}>
        {eccPillars.map((pillar) => (
          <div
            key={pillar}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: `1px solid ${accentColor}33`,
              background: "rgba(255,255,255,0.04)",
              fontSize: 24,
              fontWeight: 800,
              color: accentColor,
              maxWidth: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              boxSizing: "border-box",
            }}
          >
            {pillar}
          </div>
        ))}
      </div>
    </div>
  </BaseScene>
);

const StackScene: React.FC<CodexECCProps> = ({
  stackTitle,
  stackRows,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <BaseScene
    accentColor={accentColor}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <TitleBlock
        label=""
        title={stackTitle}
        subtitle="单点命令很有用，但真正的护城河是整套闭环。"
        accentColor={accentColor}
        highlightColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />

      <Panel panelColor={panelColor} borderColor={`${highlightColor}33`} style={{ minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr 3fr 2.5fr",
            gap: 14,
            paddingBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 12,
          }}
        >
          {["阶段", "当前表现", "下一步演化", "结果"].map((column, index) => (
            <div
              key={column}
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: index === 1 ? accentColor : index === 2 ? highlightColor : "#cbd5e1",
                letterSpacing: 2,
                minWidth: 0,
                overflowWrap: "break-word",
              }}
            >
              {column}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stackRows.map((row: CodexECCStackRow) => (
            <div
              key={row.stage}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 3fr 3fr 2.5fr",
                gap: 14,
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: textColor, minWidth: 0, overflowWrap: "break-word" }}>{row.stage}</div>
              <div style={{ fontSize: 24, lineHeight: 1.45, color: accentColor, fontWeight: 700, minWidth: 0, overflowWrap: "break-word" }}>
                {row.plugin}
              </div>
              <div
                style={{ fontSize: 24, lineHeight: 1.45, color: highlightColor, fontWeight: 700, minWidth: 0, overflowWrap: "break-word" }}
              >
                {row.ecc}
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.5, color: mutedTextColor, minWidth: 0, overflowWrap: "break-word" }}>{row.verdict}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </BaseScene>
);

const RiskScene: React.FC<CodexECCProps> = ({
  riskTitle,
  riskCards,
  riskSnapshot,
  backgroundColor,
  accentColor,
  highlightColor,
  dangerColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <BaseScene
    accentColor={accentColor}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <TitleBlock
        label=""
        title={riskTitle}
        subtitle="这不是方向有问题，而是工程质量还没完全追上热度。"
        accentColor={accentColor}
        highlightColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />

      <Panel panelColor={panelColor} borderColor={`${dangerColor}44`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 18,
          }}
        >
          {riskCards.map((risk: CodexECCRiskCard) => (
            <div
              key={risk.metric}
              style={{
                borderRadius: 22,
                border: `1px solid ${dangerColor}33`,
                background: "rgba(255,255,255,0.03)",
                padding: "16px 16px 18px",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 20, color: dangerColor, fontWeight: 800, letterSpacing: 3 }}>
                {risk.metric}
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.28, color: textColor, fontWeight: 900, marginTop: 10, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {risk.title}
              </div>
              <div style={{ fontSize: 24, lineHeight: 1.48, color: mutedTextColor, marginTop: 10, overflowWrap: "break-word", wordBreak: "break-word" }}>
                {risk.detail}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "16px 18px",
            borderRadius: 20,
            background: "linear-gradient(90deg, rgba(255,123,66,0.12), rgba(45,212,255,0.10))",
            border: `1px solid ${highlightColor}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 0" }}>
            <div style={{ fontSize: 20, color: highlightColor, fontWeight: 800, letterSpacing: 3 }}>
              {riskSnapshot.label}
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.45, color: mutedTextColor, marginTop: 8, overflowWrap: "break-word", wordBreak: "break-word" }}>
              {riskSnapshot.detail}
            </div>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: textColor,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              flexShrink: 0,
            }}
          >
            {riskSnapshot.value}
          </div>
        </div>
      </Panel>
    </div>
  </BaseScene>
);

const CTAScene: React.FC<CodexECCProps> = ({
  ctaTitle,
  ctaBody,
  ctaSlogan,
  ctaTags,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <BaseScene
    accentColor={accentColor}
    backgroundColor={backgroundColor}
    highlightColor={highlightColor}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <TitleBlock
        label=""
        title={ctaTitle}
        subtitle={ctaSlogan}
        accentColor={accentColor}
        highlightColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />

      <Panel panelColor={panelColor} borderColor={`${accentColor}44`} style={{ minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            fontSize: 36,
            lineHeight: 1.62,
            color: textColor,
            fontWeight: 700,
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {ctaBody}
        </div>
      </Panel>

      <div
        style={{
          fontSize: 50,
          lineHeight: 1.25,
          fontWeight: 900,
          color: highlightColor,
          textShadow: `0 0 26px ${highlightColor}33`,
          maxWidth: "100%",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {ctaSlogan}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: "100%", minWidth: 0 }}>
        {ctaTags.map((tag) => (
          <div
            key={tag}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: `1px solid ${highlightColor}44`,
              background: "rgba(255,255,255,0.04)",
              fontSize: 24,
              fontWeight: 800,
              color: mutedTextColor,
              maxWidth: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              boxSizing: "border-box",
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  </BaseScene>
);

const SCENES: React.FC<CodexECCProps>[] = [
  HookScene,
  ShiftScene,
  EvidenceScene,
  ECCScene,
  StackScene,
  RiskScene,
  CTAScene,
];

export const CodexECC: React.FC<CodexECCProps> = (props) => {
  const {
    sceneDurations,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    audio,
    accentColor,
    highlightColor,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDurationList = useMemo(() => {
    if (sceneDurations?.length === SCENE_COUNT) {
      return sceneDurations;
    }
    return Array.from({ length: SCENE_COUNT }, () => DEFAULT_SCENE_DURATION);
  }, [sceneDurations]);

  const sceneStartFrames = useMemo(() => {
    const starts: number[] = [0];
    for (let index = 0; index < SCENE_COUNT - 1; index++) {
      starts.push(starts[index] + getSceneDuration(sceneDurationList, index));
    }
    return starts;
  }, [sceneDurationList]);

  const subtitleLines = useMemo<SubtitleLine[]>(() => {
    if (!subtitle.enabled) {
      return [];
    }
    if (precomputedSubtitles && precomputedSubtitles.length > 0) {
      return precomputedSubtitles;
    }
    return voiceoverScripts.map((script, index) => {
      const sceneStart = sceneStartFrames[index] ?? 0;
      const duration = getSceneDuration(sceneDurationList, index);
      return generateSubtitleLines(
        script,
        sceneStart + Math.round(fps * 0.3),
        duration - Math.round(fps * 1),
        fps,
      );
    });
  }, [
    fps,
    precomputedSubtitles,
    sceneDurationList,
    sceneStartFrames,
    subtitle.enabled,
    voiceoverScripts,
  ]);

  const currentSceneIndex = useMemo(() => {
    for (let index = SCENE_COUNT - 1; index >= 0; index--) {
      if (frame >= sceneStartFrames[index]) {
        return index;
      }
    }
    return 0;
  }, [frame, sceneStartFrames]);

  return (
    <AbsoluteFill>
      {audio.backgroundMusic ? (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={audio.backgroundMusicVolume}
          loop
        />
      ) : null}

      {audio.voiceoverEnabled
        ? (audio.voiceoverAudioFiles ?? []).slice(0, SCENE_COUNT).map((audioFile, index) => (
            <Sequence
              key={`voice-${audioFile}`}
              from={(sceneStartFrames[index] ?? 0) + Math.round(fps * 0.3)}
              durationInFrames={getSceneDuration(sceneDurationList, index)}
              premountFor={Math.round(fps * 0.5)}
            >
              <Audio src={staticFile(audioFile)} volume={audio.voiceoverVolume} />
            </Sequence>
          ))
        : null}

      {SCENES.map((SceneComponent, index) => (
        <Sequence
          key={`scene-${index + 1}`}
          from={sceneStartFrames[index] ?? 0}
          durationInFrames={getSceneDuration(sceneDurationList, index)}
          premountFor={Math.round(fps * 0.5)}
        >
          <SceneTransition type="fade" durationInFrames={12}>
            <SceneComponent {...props} />
          </SceneTransition>
        </Sequence>
      ))}

      {/* 横向进度条，位于字幕上方 */}
      <div
        style={{
          position: "absolute",
          bottom: 550,
          left: 80,
          right: 80,
          height: 4,
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentSceneIndex + 1) / SCENE_COUNT) * 100}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${highlightColor})`,
            boxShadow: `0 0 12px ${accentColor}`,
            borderRadius: 999,
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

export default CodexECC;
