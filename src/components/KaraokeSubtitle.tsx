import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SubtitleWord {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface SubtitleLine {
  words: SubtitleWord[];
  startFrame: number;
  endFrame: number;
}

interface KaraokeSubtitleProps {
  lines: SubtitleLine[];
  fontSize?: number;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  position?: "top" | "center" | "bottom";
  style?: React.CSSProperties;
}

// 单个词的组件，用于计算独立的 spring 动画
const KaraokeWord: React.FC<{
  word: SubtitleWord;
  fontSize: number;
  textColor: string;
  highlightColor: string;
}> = ({ word, fontSize, textColor, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 计算当前词的高亮进度
  const progress = interpolate(
    frame,
    [word.startFrame, word.endFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 是否已经播放过
  const isPlayed = frame >= word.endFrame;
  // 是否正在播放
  const isPlaying = frame >= word.startFrame && frame < word.endFrame;

  // 基于帧的 spring 缩放动画 (替代 CSS transition)
  // 使用 snappy 配置：快速响应，最小弹跳
  const scaleIn = spring({
    frame: frame - word.startFrame,
    fps,
    config: { damping: 20, stiffness: 200 }, // snappy 配置
  });

  const scaleOut = spring({
    frame: frame - word.endFrame,
    fps,
    config: { damping: 200 }, // smooth 配置，无弹跳
  });

  // 计算最终缩放值：进入时放大到 1.1，结束后回到 1.0
  const scale = isPlaying
    ? interpolate(scaleIn, [0, 1], [1, 1.1])
    : isPlayed
      ? interpolate(scaleOut, [0, 1], [1.1, 1], { extrapolateRight: "clamp" })
      : 1;

  return (
    <span
      style={{
        fontSize,
        fontWeight: "bold",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        display: "inline-block",
        color: isPlayed || isPlaying ? highlightColor : textColor,
        textShadow: isPlaying
          ? `0 0 20px ${highlightColor}`
          : "0 2px 4px rgba(0,0,0,0.5)",
        // 使用基于帧的 spring 动画
        transform: `scale(${scale})`,
      }}
    >
      {/* 背景文字 */}
      <span style={{ opacity: isPlaying ? 0.3 : isPlayed ? 0 : 1 }}>
        {word.text}
      </span>

      {/* 高亮层 - 逐字填充效果 */}
      {(isPlaying || isPlayed) && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: highlightColor,
            clipPath: isPlaying
              ? `inset(0 ${(1 - progress) * 100}% 0 0)`
              : "none",
            textShadow: `0 0 10px ${highlightColor}`,
          }}
        >
          {word.text}
        </span>
      )}
    </span>
  );
};

export const KaraokeSubtitle: React.FC<KaraokeSubtitleProps> = ({
  lines,
  fontSize = 42,
  textColor = "#ffffff",
  highlightColor = "#ffd700",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  position = "bottom",
  style,
}) => {
  const frame = useCurrentFrame();

  // 找到当前应该显示的字幕行
  const currentLine = lines.find(
    (line) => frame >= line.startFrame && frame <= line.endFrame
  );

  if (!currentLine) {
    return null;
  }

  // 计算位置
  const positionStyle: React.CSSProperties = {
    top: position === "top" ? 80 : position === "center" ? "50%" : undefined,
    bottom: position === "bottom" ? 80 : undefined,
    transform: position === "center" ? "translateY(-50%)" : undefined,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 40px",
        zIndex: 100,
        ...positionStyle,
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: "16px 32px",
          borderRadius: 12,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          maxWidth: "90%",
        }}
      >
        {currentLine.words.map((word, index) => (
          <KaraokeWord
            key={index}
            word={word}
            fontSize={fontSize}
            textColor={textColor}
            highlightColor={highlightColor}
          />
        ))}
      </div>
    </div>
  );
};

// 辅助函数：从文本和时间信息生成字幕数据
export function generateSubtitleLines(
  text: string,
  startFrame: number,
  durationFrames: number,
  fps: number = 30
): SubtitleLine {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  
  let currentFrame = startFrame;
  const subtitleWords: SubtitleWord[] = [];

  words.forEach((word) => {
    // 根据字符比例分配时间
    const wordDuration = Math.round(
      (word.length / totalChars) * durationFrames
    );
    
    subtitleWords.push({
      text: word,
      startFrame: currentFrame,
      endFrame: currentFrame + wordDuration,
    });
    
    currentFrame += wordDuration;
  });

  return {
    words: subtitleWords,
    startFrame,
    endFrame: startFrame + durationFrames,
  };
}

// 辅助函数：从场景脚本生成完整字幕
export interface SceneScript {
  text: string;
  sceneStartFrame: number;
  sceneDuration: number;
}

export function generateSubtitlesFromScripts(
  scripts: SceneScript[],
  fps: number = 30
): SubtitleLine[] {
  return scripts.map((script) => {
    // 给每个场景的字幕留出淡入时间
    const subtitleStart = script.sceneStartFrame + Math.round(fps * 0.5); // 0.5秒后开始
    const subtitleDuration = script.sceneDuration - Math.round(fps * 1); // 留1秒缓冲
    
    return generateSubtitleLines(script.text, subtitleStart, subtitleDuration, fps);
  });
}

export default KaraokeSubtitle;
