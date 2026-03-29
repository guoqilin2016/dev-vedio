import path from "path";
import { z } from "zod";
import { getCompositionCatalogEntry } from "../compositions/catalog";
import { getVideoTemplateByCompositionId } from "./video-registry";

export const SceneMediaArtifactSchema = z.object({
  sceneIndex: z.number().int().positive(),
  audioFile: z.string().min(1),
  audioDurationSec: z.number().nonnegative(),
  audioDurationInFrames: z.number().int().nonnegative(),
  sceneDurationInFrames: z.number().int().positive(),
});

export const MediaManifestIssueSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  field: z.string().min(1),
  sceneIndex: z.number().int().positive().nullable(),
});

export const MediaManifestSchema = z.object({
  compositionId: z.string().min(1),
  stillId: z.string().nullable(),
  sceneCount: z.number().int().positive(),
  subtitleDataFile: z.string().min(1),
  audioFiles: z.array(z.string().min(1)).min(1),
  sceneDurations: z.array(z.number().int().positive()).min(1),
  totalDurationInFrames: z.number().int().positive(),
  scenes: z.array(SceneMediaArtifactSchema).min(1),
  output: z.object({
    video: z.string().min(1),
    cover: z.string().nullable(),
  }),
  generatedAt: z.string().min(1),
});

export type SceneMediaArtifact = z.infer<typeof SceneMediaArtifactSchema>;
export type MediaManifest = z.infer<typeof MediaManifestSchema>;
export type MediaManifestIssue = z.infer<typeof MediaManifestIssueSchema>;

export interface MediaAudioInfo {
  file: string;
  durationSec: number;
  durationFrames: number;
}

export interface BuildMediaManifestArgs {
  compositionId: string;
  audioInfos: MediaAudioInfo[];
  sceneDurations: number[];
  subtitleDataFile: string;
  generatedAt?: string;
}

const slugifyCompositionId = (compositionId: string): string =>
  compositionId.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();

export const getCompositionMediaSlug = (compositionId: string): string =>
  slugifyCompositionId(compositionId);

export const getMediaManifestPath = (
  compositionId: string,
  cwd: string = process.cwd(),
): string =>
  path.join(
    cwd,
    "src",
    "data",
    `${getCompositionMediaSlug(compositionId)}-media-manifest.json`,
  );

export const getSubtitleDataPath = (
  compositionId: string,
  cwd: string = process.cwd(),
): string =>
  path.join(
    cwd,
    "src",
    "data",
    `${getCompositionMediaSlug(compositionId)}-subtitles.json`,
  );

export const buildMediaManifest = ({
  compositionId,
  audioInfos,
  sceneDurations,
  subtitleDataFile,
  generatedAt = new Date().toISOString(),
}: BuildMediaManifestArgs): MediaManifest => {
  const registryEntry = getVideoTemplateByCompositionId(compositionId);
  if (!registryEntry) {
    throw new Error(`Unknown composition in registry: ${compositionId}`);
  }

  const catalogEntry = getCompositionCatalogEntry(compositionId);
  if (!catalogEntry) {
    throw new Error(`Unknown composition in catalog: ${compositionId}`);
  }

  if (audioInfos.length === 0) {
    throw new Error(`No audioInfos provided for ${compositionId}`);
  }

  if (audioInfos.length !== sceneDurations.length) {
    throw new Error(
      `Scene duration count mismatch for ${compositionId}: audioInfos=${audioInfos.length}, sceneDurations=${sceneDurations.length}`,
    );
  }

  const scenes = audioInfos.map((audioInfo, index) =>
    SceneMediaArtifactSchema.parse({
      sceneIndex: index + 1,
      audioFile: audioInfo.file,
      audioDurationSec: audioInfo.durationSec,
      audioDurationInFrames: audioInfo.durationFrames,
      sceneDurationInFrames: sceneDurations[index],
    }),
  );

  const totalDurationInFrames = sceneDurations.reduce(
    (sum, duration) => sum + duration,
    0,
  );

  return MediaManifestSchema.parse({
    compositionId,
    stillId: registryEntry.stillId,
    sceneCount: scenes.length,
    subtitleDataFile,
    audioFiles: audioInfos.map((audioInfo) => audioInfo.file),
    sceneDurations,
    totalDurationInFrames,
    scenes,
    output: {
      video: registryEntry.output.video,
      cover: registryEntry.output.cover,
    },
    generatedAt,
    // Force catalog lookup now so missing registration fails early.
    _catalogDuration: catalogEntry.durationInFrames,
  });
};
