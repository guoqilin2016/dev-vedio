import * as fs from "fs";
import * as os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { buildMediaManifest, getMediaManifestPath } from "./media-manifest";
import { runMediaPreflight } from "./preflight-qa";

const tempDirs: string[] = [];

const fixtureAudioFrames = [361, 433, 432, 451, 569, 506, 393];
const fixtureSceneDurations = [391, 463, 462, 481, 599, 536, 423];

const createFixture = (overrides?: {
  removeAudio?: number;
  removeSubtitle?: boolean;
  emptySubtitle?: boolean;
  sceneDurations?: number[];
  totalDurationInFrames?: number;
}) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "preflight-qa-"));
  tempDirs.push(cwd);

  fs.mkdirSync(path.join(cwd, "public", "audio"), { recursive: true });
  fs.mkdirSync(path.join(cwd, "src", "data"), { recursive: true });

  const audioFiles = fixtureAudioFrames.map(
    (_duration, index) => `audio/aiharnessengineer-scene${index + 1}.mp3`,
  );

  audioFiles.forEach((audioFile, index) => {
    if (overrides?.removeAudio === index + 1) {
      return;
    }
    fs.writeFileSync(
      path.join(cwd, "public", audioFile.replace(/^audio\//, "audio/")),
      "fake-audio",
    );
  });

  const subtitlePath = path.join(cwd, "src", "data", "aiharnessengineer-subtitles.json");
  if (!overrides?.removeSubtitle) {
    fs.writeFileSync(
      subtitlePath,
      JSON.stringify(overrides?.emptySubtitle ? [] : [{ words: [], startFrame: 0, endFrame: 10 }]),
    );
  }

  const manifest = buildMediaManifest({
    compositionId: "AIHarnessEngineer",
    audioInfos: fixtureAudioFrames.map((durationFrames, index) => ({
      file: audioFiles[index],
      durationSec: durationFrames / 30,
      durationFrames,
    })),
    sceneDurations: fixtureSceneDurations,
    subtitleDataFile: "src/data/aiharnessengineer-subtitles.json",
    generatedAt: "2026-03-29T00:00:00.000Z",
  });

  const serializedManifest = {
    ...manifest,
    sceneDurations: overrides?.sceneDurations ?? manifest.sceneDurations,
    totalDurationInFrames:
      overrides?.totalDurationInFrames ?? manifest.totalDurationInFrames,
  };
  const manifestPath = getMediaManifestPath("AIHarnessEngineer", cwd);
  fs.writeFileSync(manifestPath, JSON.stringify(serializedManifest, null, 2));

  return { cwd, manifestPath };
};

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("runMediaPreflight", () => {
  it("passes when manifest, audio and subtitle data are aligned", () => {
    const fixture = createFixture();
    const report = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: fixture.cwd,
    });

    expect(report.ok).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it("reports missing-audio when a scene audio file is missing", () => {
    const fixture = createFixture({ removeAudio: 2 });
    const report = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: fixture.cwd,
    });

    expect(report.ok).toBe(false);
    expect(report.issues.some((issue) => issue.code === "missing-audio")).toBe(true);
  });

  it("reports missing-subtitle when subtitle data file is missing or empty", () => {
    const missingFixture = createFixture({ removeSubtitle: true });
    const emptyFixture = createFixture({ emptySubtitle: true });

    const missingReport = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: missingFixture.cwd,
    });
    const emptyReport = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: emptyFixture.cwd,
    });

    expect(missingReport.issues.some((issue) => issue.code === "missing-subtitle")).toBe(
      true,
    );
    expect(emptyReport.issues.some((issue) => issue.code === "missing-subtitle")).toBe(
      true,
    );
  });

  it("reports scene-duration-mismatch when sceneDurations length differs", () => {
    const fixture = createFixture({ sceneDurations: [391] });
    const report = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: fixture.cwd,
      manifestPath: fixture.manifestPath,
    });

    expect(report.issues.some((issue) => issue.code === "scene-duration-mismatch")).toBe(
      true,
    );
  });

  it("reports total-duration-mismatch and catalog-duration-mismatch when totals drift", () => {
    const fixture = createFixture({ totalDurationInFrames: 999 });
    const report = runMediaPreflight({
      compositionId: "AIHarnessEngineer",
      cwd: fixture.cwd,
      manifestPath: fixture.manifestPath,
    });

    expect(report.issues.some((issue) => issue.code === "total-duration-mismatch")).toBe(
      true,
    );
    expect(
      report.issues.some((issue) => issue.code === "catalog-duration-mismatch"),
    ).toBe(true);
  });
});
