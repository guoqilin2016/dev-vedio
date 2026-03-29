import * as fs from "fs";
import * as path from "path";
import { parseFile } from "music-metadata";
import {
  buildMediaManifest,
  getCompositionMediaSlug,
  getMediaManifestPath,
  getSubtitleDataPath,
  type MediaAudioInfo,
} from "../src/shared/media-manifest";

interface TimingRule {
  minSceneDuration: number;
  bufferFrames: number;
}

const defaultTimingRule: TimingRule = {
  minSceneDuration: 90,
  bufferFrames: 30,
};

const timingRules: Record<string, TimingRule> = {
  AIHarnessEngineer: defaultTimingRule,
};

const getArgValue = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
};

const getRequiredCompositionId = (): string => {
  const compositionId = getArgValue("--id");
  if (!compositionId) {
    throw new Error("Missing required flag: --id <compositionId>");
  }
  return compositionId;
};

const getAudioDuration = async (filePath: string): Promise<number> => {
  const metadata = await parseFile(filePath);
  return metadata.format.duration || 0;
};

const collectAudioInfos = async (
  compositionId: string,
  cwd: string,
): Promise<MediaAudioInfo[]> => {
  const slug = getCompositionMediaSlug(compositionId);
  const audioDir = path.join(cwd, "public", "audio");
  const files = fs
    .readdirSync(audioDir)
    .filter((file) => file.startsWith(`${slug}-scene`) && file.endsWith(".mp3"))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  if (files.length === 0) {
    throw new Error(`No scene audio files found for ${compositionId} under public/audio`);
  }

  const infos: MediaAudioInfo[] = [];
  for (const file of files) {
    const durationSec = await getAudioDuration(path.join(audioDir, file));
    infos.push({
      file: `audio/${file}`,
      durationSec,
      durationFrames: Math.round(durationSec * 30),
    });
  }

  return infos;
};

const ensureSubtitleData = (compositionId: string, cwd: string): string => {
  const subtitlePath = getSubtitleDataPath(compositionId, cwd);
  if (!fs.existsSync(subtitlePath)) {
    throw new Error(`Subtitle data file not found: ${subtitlePath}`);
  }

  const subtitleContent = JSON.parse(fs.readFileSync(subtitlePath, "utf-8"));
  if (!Array.isArray(subtitleContent) || subtitleContent.length === 0) {
    throw new Error(`Subtitle data file is empty: ${subtitlePath}`);
  }

  return path.relative(cwd, subtitlePath);
};

const buildSceneDurations = (
  compositionId: string,
  audioInfos: MediaAudioInfo[],
): number[] => {
  const rule = timingRules[compositionId] ?? defaultTimingRule;
  return audioInfos.map((audioInfo) =>
    Math.max(rule.minSceneDuration, audioInfo.durationFrames + rule.bufferFrames),
  );
};

async function main() {
  const cwd = process.cwd();
  const compositionId = getRequiredCompositionId();
  const audioInfos = await collectAudioInfos(compositionId, cwd);
  const subtitleDataFile = ensureSubtitleData(compositionId, cwd);
  const sceneDurations = buildSceneDurations(compositionId, audioInfos);
  const manifest = buildMediaManifest({
    compositionId,
    audioInfos,
    sceneDurations,
    subtitleDataFile,
  });

  const outputPath = getMediaManifestPath(compositionId, cwd);
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

  console.log(`MEDIA_MANIFEST_OK ${compositionId}`);
  console.log(`output=${outputPath}`);
  console.log(`totalDurationInFrames=${manifest.totalDurationInFrames}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`MEDIA_MANIFEST_FAILED ${message}`);
  process.exit(1);
});
