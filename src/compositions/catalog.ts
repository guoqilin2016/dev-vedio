import {
  getVideoTemplateByCompositionId,
  getVideoTemplateByStillId,
  videoTemplateRegistry,
  type VideoTemplateRegistryEntry,
} from "../shared/video-registry";

export interface VideoCompositionCatalogEntry {
  id: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  registryEntry: VideoTemplateRegistryEntry;
}

export interface VideoStillCatalogEntry {
  id: string;
  compositionId: string;
  width: number;
  height: number;
  registryEntry: VideoTemplateRegistryEntry;
}

const requireCompositionRegistryEntry = (
  compositionId: string,
): VideoTemplateRegistryEntry => {
  const entry = getVideoTemplateByCompositionId(compositionId);
  if (!entry) {
    throw new Error(`Missing registry entry for composition "${compositionId}"`);
  }
  return entry;
};

const requireStillRegistryEntry = (
  stillId: string,
): VideoTemplateRegistryEntry => {
  const entry = getVideoTemplateByStillId(stillId);
  if (!entry) {
    throw new Error(`Missing registry entry for still "${stillId}"`);
  }
  return entry;
};

const createCompositionCatalogEntry = (
  id: string,
  width: number,
  height: number,
  fps: number,
  durationInFrames: number,
): VideoCompositionCatalogEntry => ({
  id,
  width,
  height,
  fps,
  durationInFrames,
  registryEntry: requireCompositionRegistryEntry(id),
});

const createStillCatalogEntry = (
  id: string,
  compositionId: string,
  width: number,
  height: number,
): VideoStillCatalogEntry => ({
  id,
  compositionId,
  width,
  height,
  registryEntry: requireStillRegistryEntry(id),
});

export const videoCompositionCatalog = [
  createCompositionCatalogEntry("HelloWorld", 1920, 1080, 30, 150),
  createCompositionCatalogEntry("TextPresentation", 1920, 1080, 30, 1556),
  createCompositionCatalogEntry("NitrogenAI", 1920, 1080, 30, 2683),
  createCompositionCatalogEntry("OpenClawAI", 1080, 1920, 30, 2759),
  createCompositionCatalogEntry("ClawSkills", 1080, 1920, 30, 3127),
  createCompositionCatalogEntry("SuperPowers", 1080, 1920, 30, 2976),
  createCompositionCatalogEntry("PuaSkill", 1080, 1920, 30, 3660),
  createCompositionCatalogEntry("AgencyAgents", 1080, 1920, 30, 4175),
  createCompositionCatalogEntry("AutoResearch", 1080, 1920, 30, 4004),
  createCompositionCatalogEntry("GSDIntro", 1080, 1920, 30, 4952),
  createCompositionCatalogEntry("WeChatClawBot", 1080, 1920, 30, 4406),
  createCompositionCatalogEntry("PencilDev", 1080, 1920, 30, 3376),
  createCompositionCatalogEntry("AIHarnessEngineer", 1080, 1920, 30, 3355),
  createCompositionCatalogEntry("FeishuCLI", 1080, 1920, 30, 4529),
] as const;

export const videoStillCatalog = [
  createStillCatalogEntry("GSDIntroCover", "GSDIntro", 1080, 1440),
  createStillCatalogEntry("WeChatClawBotCover", "WeChatClawBot", 1080, 1440),
  createStillCatalogEntry("PencilDevCover", "PencilDev", 1080, 1440),
  createStillCatalogEntry(
    "AIHarnessEngineerCover",
    "AIHarnessEngineer",
    1080,
    1440,
  ),
  createStillCatalogEntry("FeishuCLICover", "FeishuCLI", 1080, 1440),
  createStillCatalogEntry("AutoResearchCover", "AutoResearch", 1080, 1440),
] as const;

export const getCompositionCatalogEntry = (
  id: string,
): VideoCompositionCatalogEntry | undefined =>
  videoCompositionCatalog.find((entry) => entry.id === id);

export const getStillCatalogEntry = (
  id: string,
): VideoStillCatalogEntry | undefined =>
  videoStillCatalog.find((entry) => entry.id === id);

export const getCatalogCompositionIds = (): string[] =>
  videoCompositionCatalog.map((entry) => entry.id);

export const getCatalogStillIds = (): string[] =>
  videoStillCatalog.map((entry) => entry.id);

export const getCatalogRegistryIds = (): string[] =>
  videoTemplateRegistry.map((entry) => entry.compositionId);
