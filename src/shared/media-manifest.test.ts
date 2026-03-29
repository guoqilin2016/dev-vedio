import { describe, expect, it } from "vitest";
import {
  MediaManifestSchema,
  buildMediaManifest,
  getCompositionMediaSlug,
  getMediaManifestPath,
} from "./media-manifest";

describe("MediaManifestSchema", () => {
  it("builds a valid manifest for AIHarnessEngineer", () => {
    const manifest = buildMediaManifest({
      compositionId: "AIHarnessEngineer",
      audioInfos: [
        {
          file: "audio/aiharnessengineer-scene1.mp3",
          durationSec: 16.15,
          durationFrames: 485,
        },
        {
          file: "audio/aiharnessengineer-scene2.mp3",
          durationSec: 19.1,
          durationFrames: 573,
        },
      ],
      sceneDurations: [515, 603],
      subtitleDataFile: "src/data/aiharnessengineer-subtitles.json",
      generatedAt: "2026-03-29T00:00:00.000Z",
    });

    const parsed = MediaManifestSchema.safeParse(manifest);

    expect(parsed.success).toBe(true);
    expect(manifest.stillId).toBe("AIHarnessEngineerCover");
    expect(manifest.output.video).toBe("out/AIHarnessEngineer.mp4");
    expect(manifest.totalDurationInFrames).toBe(1118);
    expect(manifest.sceneCount).toBe(2);
  });

  it("keeps output paths sourced from registry and catalog-derived ids", () => {
    const manifest = buildMediaManifest({
      compositionId: "AIHarnessEngineer",
      audioInfos: [
        {
          file: "audio/aiharnessengineer-scene1.mp3",
          durationSec: 10,
          durationFrames: 300,
        },
      ],
      sceneDurations: [330],
      subtitleDataFile: "src/data/aiharnessengineer-subtitles.json",
      generatedAt: "2026-03-29T00:00:00.000Z",
    });

    expect(manifest.output.video).toBe("out/AIHarnessEngineer.mp4");
    expect(manifest.output.cover).toBe("out/AIHarnessEngineer-cover.png");
    expect(getCompositionMediaSlug("AIHarnessEngineer")).toBe(
      "aiharnessengineer",
    );
    expect(getMediaManifestPath("AIHarnessEngineer")).toContain(
      "aiharnessengineer-media-manifest.json",
    );
  });

  it("throws when sceneDurations length does not match sceneCount", () => {
    expect(() =>
      buildMediaManifest({
        compositionId: "AIHarnessEngineer",
        audioInfos: [
          {
            file: "audio/aiharnessengineer-scene1.mp3",
            durationSec: 10,
            durationFrames: 300,
          },
          {
            file: "audio/aiharnessengineer-scene2.mp3",
            durationSec: 11,
            durationFrames: 330,
          },
        ],
        sceneDurations: [330],
        subtitleDataFile: "src/data/aiharnessengineer-subtitles.json",
      }),
    ).toThrow("Scene duration count mismatch");
  });
});
