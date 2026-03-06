export {
  KaraokeSubtitle,
  generateSubtitleLines,
  generateSubtitlesFromScripts,
  type SubtitleWord,
  type SubtitleLine,
  type SceneScript,
} from "./KaraokeSubtitle";

export {
  SceneTransition,
  ProgressIndicator,
  SceneNumber,
  AnimatedCounter,
} from "./Transitions";

// 官方字幕组件 (基于 @remotion/captions)
export {
  OfficialCaptions,
  convertFramesToCaptions,
  generateCaptionsFromScript,
} from "./OfficialCaptions";

// 官方转场组件 (基于 @remotion/transitions + @remotion/light-leaks)
export {
  OfficialTransitionSeries,
  SimpleLightLeakSeries,
  SimpleFadeSeries,
  calculateTotalDuration,
  calculateDurationFromScenes,
  type TransitionType,
  type TimingType,
  type SceneConfig,
} from "./OfficialTransitions";
