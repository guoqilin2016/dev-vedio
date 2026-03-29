import * as fs from "fs";
import path from "path";
import { z } from "zod";
import { getCompositionCatalogEntry } from "../compositions/catalog";
import {
  MediaManifestSchema,
  getMediaManifestPath,
  type MediaManifest,
} from "./media-manifest";

export const PreflightIssueSchema = z.object({
  severity: z.enum(["error", "warning"]).default("error"),
  code: z.string().min(1),
  compositionId: z.string().min(1),
  sceneIndex: z.number().int().positive().nullable(),
  field: z.string().min(1),
  message: z.string().min(1),
});

export const PreflightReportSchema = z.object({
  ok: z.boolean(),
  compositionId: z.string().min(1),
  manifestPath: z.string().min(1),
  issues: z.array(PreflightIssueSchema),
});

export type PreflightIssue = z.infer<typeof PreflightIssueSchema>;
export type PreflightReport = z.infer<typeof PreflightReportSchema>;

export interface RunMediaPreflightArgs {
  compositionId: string;
  cwd?: string;
  manifestPath?: string;
}

const createIssue = (
  compositionId: string,
  code: string,
  field: string,
  message: string,
  sceneIndex: number | null = null,
): PreflightIssue =>
  PreflightIssueSchema.parse({
    severity: "error",
    code,
    compositionId,
    sceneIndex,
    field,
    message,
  });

const resolveAbsolutePath = (cwd: string, rawPath: string): string => {
  if (path.isAbsolute(rawPath)) {
    return rawPath;
  }
  if (rawPath.startsWith("audio/")) {
    return path.join(cwd, "public", rawPath.replace(/^audio\//, "audio/"));
  }
  return path.join(cwd, rawPath);
};

const loadManifest = (manifestPath: string): MediaManifest => {
  const content = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  return MediaManifestSchema.parse(content);
};

export const summarizePreflightIssues = (issues: PreflightIssue[]): string =>
  issues
    .map((issue) => {
      const sceneText =
        typeof issue.sceneIndex === "number" ? `scene ${issue.sceneIndex}` : "global";
      return `[${issue.code}] ${sceneText} ${issue.field}: ${issue.message}`;
    })
    .join("; ");

export const runMediaPreflight = ({
  compositionId,
  cwd = process.cwd(),
  manifestPath = getMediaManifestPath(compositionId, cwd),
}: RunMediaPreflightArgs): PreflightReport => {
  const issues: PreflightIssue[] = [];
  let manifest: MediaManifest | null = null;

  if (!fs.existsSync(manifestPath)) {
    issues.push(
      createIssue(
        compositionId,
        "missing-manifest",
        "manifestPath",
        `Media manifest not found: ${manifestPath}`,
      ),
    );
  } else {
    try {
      manifest = loadManifest(manifestPath);
    } catch (error) {
      issues.push(
        createIssue(
          compositionId,
          "invalid-manifest",
          "manifestPath",
          error instanceof Error ? error.message : "Invalid media manifest",
        ),
      );
    }
  }

  if (manifest) {
    manifest.audioFiles.forEach((audioFile, index) => {
      const absolutePath = resolveAbsolutePath(cwd, audioFile);
      if (!fs.existsSync(absolutePath)) {
        issues.push(
          createIssue(
            compositionId,
            "missing-audio",
            "audioFiles",
            `Audio file not found: ${audioFile}`,
            index + 1,
          ),
        );
      }
    });

    const subtitlePath = resolveAbsolutePath(cwd, manifest.subtitleDataFile);
    if (!fs.existsSync(subtitlePath)) {
      issues.push(
        createIssue(
          compositionId,
          "missing-subtitle",
          "subtitleDataFile",
          `Subtitle data file not found: ${manifest.subtitleDataFile}`,
        ),
      );
    } else {
      const subtitleContent = JSON.parse(fs.readFileSync(subtitlePath, "utf-8"));
      if (!Array.isArray(subtitleContent) || subtitleContent.length === 0) {
        issues.push(
          createIssue(
            compositionId,
            "missing-subtitle",
            "subtitleDataFile",
            `Subtitle data file is empty: ${manifest.subtitleDataFile}`,
          ),
        );
      }
    }

    if (manifest.sceneDurations.length !== manifest.sceneCount) {
      issues.push(
        createIssue(
          compositionId,
          "scene-duration-mismatch",
          "sceneDurations",
          `sceneDurations length ${manifest.sceneDurations.length} does not match sceneCount ${manifest.sceneCount}`,
        ),
      );
    }

    const summedDuration = manifest.sceneDurations.reduce(
      (sum, duration) => sum + duration,
      0,
    );
    if (summedDuration !== manifest.totalDurationInFrames) {
      issues.push(
        createIssue(
          compositionId,
          "total-duration-mismatch",
          "totalDurationInFrames",
          `totalDurationInFrames ${manifest.totalDurationInFrames} does not equal summed sceneDurations ${summedDuration}`,
        ),
      );
    }

    const catalogEntry = getCompositionCatalogEntry(compositionId);
    if (catalogEntry && catalogEntry.durationInFrames !== manifest.totalDurationInFrames) {
      issues.push(
        createIssue(
          compositionId,
          "catalog-duration-mismatch",
          "durationInFrames",
          `catalog duration ${catalogEntry.durationInFrames} does not match manifest total ${manifest.totalDurationInFrames}`,
        ),
      );
    }
  }

  return PreflightReportSchema.parse({
    ok: issues.length === 0,
    compositionId,
    manifestPath,
    issues,
  });
};
