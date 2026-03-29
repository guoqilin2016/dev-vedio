import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
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
import { FeishuCLIProps } from "./schema";

const SCENE_COUNT = 7;
const DEFAULT_SCENE_DURATION = 450;

const SAFE_AREA_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 420,
  padding: "0 48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",
};

const getSceneDuration = (durations: number[], index: number) => {
  const value = durations[index];
  return typeof value === "number" && !Number.isNaN(value)
    ? value
    : DEFAULT_SCENE_DURATION;
};

const Window: React.FC<{
  title: string;
  accentColor: string;
  panelColor: string;
  children: React.ReactNode;
}> = ({ title, accentColor, panelColor, children }) => {
  return (
    <div
      style={{
        borderRadius: 30,
        border: `1px solid ${accentColor}33`,
        background: panelColor,
        boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${accentColor}22`,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
            <div
              key={color}
              style={{
                width: 11,
                height: 11,
                borderRadius: 999,
                background: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#b8c9e6",
            letterSpacing: 1,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  );
};

const Tag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      padding: "10px 16px",
      borderRadius: 999,
      border: `1px solid ${color}44`,
      color,
      fontSize: 18,
      fontWeight: 800,
      background: "rgba(255,255,255,0.03)",
    }}
  >
    {text}
  </div>
);

const TitleBlock: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
}> = ({ kicker, title, subtitle, accentColor, textColor, mutedTextColor }) => (
  <div style={{ marginBottom: 28 }}>
    <div
      style={{
        fontSize: 18,
        letterSpacing: 8,
        color: accentColor,
        fontWeight: 800,
        marginBottom: 14,
      }}
    >
      {kicker}
    </div>
    <div
      style={{
        fontSize: 62,
        lineHeight: 1.08,
        fontWeight: 900,
        color: textColor,
      }}
    >
      {title}
    </div>
    {subtitle ? (
      <div
        style={{
          marginTop: 16,
          fontSize: 30,
          lineHeight: 1.45,
          color: mutedTextColor,
          fontWeight: 600,
          maxWidth: 900,
        }}
      >
        {subtitle}
      </div>
    ) : null}
  </div>
);

const SceneShell: React.FC<{
  backgroundColor: string;
  accentColor: string;
  highlightColor: string;
  children: React.ReactNode;
}> = ({ backgroundColor, accentColor, highlightColor, children }) => (
  <SceneBackground
    backgroundColor={backgroundColor}
    accentColor={accentColor}
    particles={{
      count: 34,
      speed: 0.32,
      color: highlightColor,
      opacity: 0.24,
      connectLines: false,
    }}
    glow={{
      orbs: [
        {
          x: "28%",
          y: "18%",
          color: accentColor,
          radius: 320,
          opacity: 0.16,
          pulseSpeed: 0.45,
          pulseAmount: 0.16,
        },
        {
          x: "78%",
          y: "70%",
          color: highlightColor,
          radius: 240,
          opacity: 0.12,
          pulseSpeed: 0.5,
          pulseAmount: 0.16,
        },
      ],
    }}
    hud={{ color: accentColor, animation: "pulse" }}
  >
    <AbsoluteFill
      style={{
        fontFamily: "\"PingFang SC\", \"SF Pro Display\", system-ui, sans-serif",
      }}
    >
      {children}
    </AbsoluteFill>
  </SceneBackground>
);

const HookScene: React.FC<FeishuCLIProps> = ({
  hookTitle,
  hookSubtitle,
  hookCommand,
  hookStats,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => {
  return (
    <SceneShell
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      highlightColor={highlightColor}
    >
      <div style={SAFE_AREA_STYLE}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: highlightColor,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            SCENE 01 · HOOK
          </div>
          <div
            style={{
              fontSize: 132,
              lineHeight: 0.88,
              fontWeight: 900,
              color: textColor,
              textShadow: `0 0 42px ${highlightColor}55`,
              marginBottom: 10,
            }}
          >
            飞书 CLI
          </div>
          <div
            style={{
              fontSize: 48,
              lineHeight: 1.08,
              fontWeight: 900,
              color: textColor,
              maxWidth: 920,
            }}
          >
            AI 开始接管飞书里的真实工作
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 26,
              lineHeight: 1.45,
              color: mutedTextColor,
              fontWeight: 600,
              maxWidth: 900,
            }}
          >
            写文档 · 查日程 · 建会议 · 整理多维表格
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Window title="LOCAL CLI" accentColor={accentColor} panelColor={panelColor}>
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 24,
                color: "#d3e2ff",
                lineHeight: 1.7,
              }}
            >
              <div style={{ color: highlightColor }}>$ {hookCommand}</div>
              <div>connect docs ✔</div>
              <div>connect calendar ✔</div>
              <div>connect bitable ✔</div>
              <div style={{ color: "#8be28b" }}>agent ready</div>
            </div>
          </Window>
          <Window title="WORKFLOW" accentColor={accentColor} panelColor={panelColor}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "写文档",
                "查忙闲",
                "建会议",
                "整理表格",
              ].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${index % 2 === 0 ? accentColor : highlightColor}33`,
                    fontSize: 24,
                    color: textColor,
                    fontWeight: 700,
                  }}
                >
                  <span>{item}</span>
                  <span style={{ color: index % 2 === 0 ? accentColor : highlightColor }}>
                    AGENT
                  </span>
                </div>
              ))}
            </div>
          </Window>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          {hookStats.map((item) => (
            <Tag key={item} text={item} color={highlightColor} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const PositionScene: React.FC<FeishuCLIProps> = ({
  positionTitle,
  positionBody,
  positionChips,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => {
  return (
    <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
      <div style={SAFE_AREA_STYLE}>
        <TitleBlock
          kicker="SCENE 02 · POSITION"
          title={positionTitle}
          subtitle={positionBody}
          accentColor={accentColor}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        <div
          style={{
            borderRadius: 30,
            border: `1px solid ${accentColor}33`,
            background: panelColor,
            padding: "28px 26px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: mutedTextColor, marginBottom: 12 }}>过去</div>
              <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2 }}>
                AI 会说
                <br />
                但不落地
              </div>
            </div>
            <div style={{ fontSize: 52, color: highlightColor, fontWeight: 900 }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: mutedTextColor, marginBottom: 12 }}>现在</div>
              <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2 }}>
                Agent 能进
                <br />
                协作工作流
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          {positionChips.map((chip) => (
            <Tag key={chip} text={chip} color={chip === "Docs" ? highlightColor : accentColor} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const DocsScene: React.FC<FeishuCLIProps> = ({
  docTitle,
  docPrompt,
  docCards,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
    <div style={SAFE_AREA_STYLE}>
      <TitleBlock
        kicker="SCENE 03 · DOCS"
        title={docTitle}
        subtitle={docPrompt}
        accentColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        {docCards.map((card, index) => (
          <div
            key={card.title}
            style={{
              borderRadius: 26,
              border: `1px solid ${index === 1 ? highlightColor : accentColor}33`,
              background: panelColor,
              padding: "24px 22px",
              minHeight: 260,
            }}
          >
            <div style={{ fontSize: 18, color: index === 1 ? highlightColor : accentColor, fontWeight: 800, letterSpacing: 3 }}>
              {card.tag}
            </div>
            <div style={{ fontSize: 32, lineHeight: 1.2, fontWeight: 900, marginTop: 18, color: textColor }}>
              {card.title}
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.55, color: mutedTextColor, fontWeight: 600, marginTop: 14 }}>
              {card.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  </SceneShell>
);

const CalendarScene: React.FC<FeishuCLIProps> = ({
  calendarTitle,
  calendarPrompt,
  calendarSlots,
  calendarSteps,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
    <div style={SAFE_AREA_STYLE}>
      <TitleBlock
        kicker="SCENE 04 · CALENDAR"
        title={calendarTitle}
        subtitle={calendarPrompt}
        accentColor={accentColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20 }}>
        <Window title="FREE / BUSY" accentColor={accentColor} panelColor={panelColor}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {calendarSlots.map((slot) => {
              const color =
                slot.status === "free"
                  ? "#22c55e"
                  : slot.status === "hold"
                    ? "#f59e0b"
                    : "#ef4444";
              const label =
                slot.status === "free"
                  ? "空闲"
                  : slot.status === "hold"
                    ? "待定"
                    : "占用";
              return (
                <div
                  key={slot.label}
                  style={{
                    padding: "18px 14px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${color}44`,
                  }}
                >
                  <div style={{ fontSize: 20, color: mutedTextColor, marginBottom: 10 }}>
                    {slot.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color }}>{label}</div>
                </div>
              );
            })}
          </div>
        </Window>
        <Window title="AGENT ACTIONS" accentColor={accentColor} panelColor={panelColor}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {calendarSteps.map((step, index) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 18px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    background: index === 2 ? highlightColor : accentColor,
                    color: "#051122",
                    fontSize: 22,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: textColor }}>{step}</div>
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  </SceneShell>
);

const BitableScene: React.FC<FeishuCLIProps> = ({
  bitableTitle,
  bitableRows,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
    <div style={SAFE_AREA_STYLE}>
      <TitleBlock
        kicker="SCENE 05 · BITABLE"
        title={bitableTitle}
        subtitle="资料、线索、项目状态，被直接整理成字段和看板列"
        accentColor={highlightColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />
      <Window title="BITABLE BOARD" accentColor={accentColor} panelColor={panelColor}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 10,
            marginBottom: 12,
            color: mutedTextColor,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <div>事项</div>
          <div>负责人</div>
          <div>状态</div>
          <div>优先级</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bitableRows.map((row, index) => (
            <div
              key={`${row.item}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 10,
                alignItems: "center",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                padding: "16px 14px",
                fontSize: 22,
                color: textColor,
                fontWeight: 700,
              }}
            >
              <div>{row.item}</div>
              <div style={{ color: mutedTextColor }}>{row.owner}</div>
              <div style={{ color: index % 2 === 0 ? "#22c55e" : highlightColor }}>
                {row.status}
              </div>
              <div style={{ color: row.priority === "High" ? "#f59e0b" : mutedTextColor }}>
                {row.priority}
              </div>
            </div>
          ))}
        </div>
      </Window>
    </div>
  </SceneShell>
);

const NuanceScene: React.FC<FeishuCLIProps> = ({
  nuanceTitle,
  remoteBullets,
  localBullets,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
  panelColor,
}) => (
  <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
    <div style={SAFE_AREA_STYLE}>
      <TitleBlock
        kicker="SCENE 06 · NUANCE"
        title={nuanceTitle}
        subtitle="讲传播，也要讲边界"
        accentColor={accentColor}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Window title="REMOTE PUBLIC DOCS" accentColor={accentColor} panelColor={panelColor}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {remoteBullets.map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: textColor,
                  fontWeight: 700,
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </Window>
        <Window title="LOCAL OPENAPI MCP / CLI" accentColor={highlightColor} panelColor={panelColor}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {localBullets.map((item) => (
              <div
                key={item}
                style={{
                  padding: "18px 16px",
                  borderRadius: 18,
                  border: `1px solid ${highlightColor}33`,
                  background: "rgba(77,226,255,0.08)",
                  fontSize: 24,
                  fontWeight: 800,
                  color: textColor,
                  textAlign: "center",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  </SceneShell>
);

const CTAScene: React.FC<FeishuCLIProps> = ({
  ctaTitle,
  ctaBody,
  ctaTags,
  backgroundColor,
  accentColor,
  highlightColor,
  textColor,
  mutedTextColor,
}) => (
  <SceneShell backgroundColor={backgroundColor} accentColor={accentColor} highlightColor={highlightColor}>
    <div style={{ ...SAFE_AREA_STYLE, alignItems: "center", textAlign: "center" }}>
      <div
        style={{
          fontSize: 20,
          letterSpacing: 10,
          color: accentColor,
          fontWeight: 900,
          marginBottom: 18,
        }}
      >
        SCENE 07 · CTA
      </div>
      <div
        style={{
          fontSize: 68,
          lineHeight: 1.08,
          fontWeight: 900,
          color: textColor,
          maxWidth: 900,
        }}
      >
        {ctaTitle}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 36,
          lineHeight: 1.45,
          color: mutedTextColor,
          fontWeight: 700,
          maxWidth: 860,
        }}
      >
        {ctaBody}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
        {ctaTags.map((tag) => (
          <Tag key={tag} text={tag} color={tag === "#AIAgent" ? highlightColor : accentColor} />
        ))}
      </div>
    </div>
  </SceneShell>
);

export const FeishuCLI: React.FC<FeishuCLIProps> = (props) => {
  const {
    audio,
    subtitle,
    voiceoverScripts,
    precomputedSubtitles,
    sceneDurations,
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
  }, [fps, precomputedSubtitles, sceneDurationList, sceneStartFrames, subtitle.enabled, voiceoverScripts]);

  const scenes = [
    <HookScene key="hook" {...props} />,
    <PositionScene key="position" {...props} />,
    <DocsScene key="docs" {...props} />,
    <CalendarScene key="calendar" {...props} />,
    <BitableScene key="bitable" {...props} />,
    <NuanceScene key="nuance" {...props} />,
    <CTAScene key="cta" {...props} />,
  ];

  return (
    <AbsoluteFill>
      {audio.backgroundMusic ? (
        <Audio
          src={staticFile(audio.backgroundMusic)}
          volume={audio.backgroundMusicVolume}
        />
      ) : null}

      {audio.voiceoverEnabled && audio.voiceoverAudioFiles
        ? audio.voiceoverAudioFiles.map((file, index) => (
            <Sequence key={file} from={sceneStartFrames[index] ?? 0}>
              <Audio src={staticFile(file)} volume={audio.voiceoverVolume} />
            </Sequence>
          ))
        : null}

      {scenes.map((scene, index) => (
        <Sequence
          key={`scene-${index}`}
          from={sceneStartFrames[index] ?? 0}
          durationInFrames={getSceneDuration(sceneDurationList, index)}
        >
          {index === 0 ? scene : (
            <SceneTransition type="slide-up">
              {scene}
            </SceneTransition>
          )}
        </Sequence>
      ))}

      {subtitle.enabled ? (
        <KaraokeSubtitle
          lines={subtitleLines}
          fontSize={subtitle.fontSize}
          textColor={subtitle.textColor}
          highlightColor={subtitle.highlightColor}
          backgroundColor={subtitle.backgroundColor}
          position={subtitle.position}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export default FeishuCLI;
