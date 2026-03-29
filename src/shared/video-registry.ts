import { z } from "zod";

export const SubtitleModeSchema = z.enum([
  "none",
  "landscape-bottom",
  "single-line-bottom",
]);

export const SafeAreaProfileSchema = z.object({
  id: z.string().min(1),
  topPx: z.number().int().nonnegative(),
  bottomPx: z.number().int().nonnegative(),
  leftPx: z.number().int().nonnegative(),
  rightPx: z.number().int().nonnegative(),
  subtitleBottomPx: z.number().int().nonnegative(),
});

export const TemplateCapabilitySchema = z.object({
  hookSlot: z.boolean(),
  coverSlot: z.boolean(),
  proofSlot: z.boolean(),
});

export const VideoPackageItemSchema = z.enum([
  "video",
  "cover",
  "title",
  "description",
  "hashtags",
]);

export const VideoPlatformProfileSchema = z.object({
  platform: z.string().min(1),
  titleMaxChars: z.number().int().positive(),
  descriptionMaxChars: z.number().int().positive(),
  coverAspectRatio: z.string().min(1),
  defaultPackageItems: z.array(VideoPackageItemSchema).min(1),
});

export const VideoOutputSchema = z.object({
  video: z.string().min(1),
  cover: z.string().min(1).nullable(),
});

export const VideoTemplateRegistryEntrySchema = z.object({
  compositionId: z.string().min(1),
  stillId: z.string().min(1).nullable(),
  templateType: z.string().min(1),
  aspectRatio: z.string().min(1),
  safeAreaProfile: SafeAreaProfileSchema,
  subtitleMode: SubtitleModeSchema,
  supports: TemplateCapabilitySchema,
  output: VideoOutputSchema,
  platformProfiles: z.object({
    videoChannel: VideoPlatformProfileSchema,
  }),
});

export type VideoPlatformProfile = z.infer<typeof VideoPlatformProfileSchema>;
export type VideoTemplateRegistryEntry = z.infer<
  typeof VideoTemplateRegistryEntrySchema
>;

const landscapeSafeArea = SafeAreaProfileSchema.parse({
  id: "landscape-default",
  topPx: 80,
  bottomPx: 140,
  leftPx: 120,
  rightPx: 120,
  subtitleBottomPx: 100,
});

const shortVideoSafeArea = SafeAreaProfileSchema.parse({
  id: "short-video-mobile",
  topPx: 0,
  bottomPx: 420,
  leftPx: 40,
  rightPx: 40,
  subtitleBottomPx: 380,
});

const videoChannelProfile = VideoPlatformProfileSchema.parse({
  platform: "videoChannel",
  titleMaxChars: 16,
  descriptionMaxChars: 20,
  coverAspectRatio: "3:4",
  defaultPackageItems: ["video", "cover", "title", "description", "hashtags"],
});

const createEntry = (
  entry: VideoTemplateRegistryEntry,
): VideoTemplateRegistryEntry => VideoTemplateRegistryEntrySchema.parse(entry);

export const videoTemplateRegistry = [
  createEntry({
    compositionId: "HelloWorld",
    stillId: null,
    templateType: "demo",
    aspectRatio: "16:9",
    safeAreaProfile: landscapeSafeArea,
    subtitleMode: "none",
    supports: {
      hookSlot: false,
      coverSlot: false,
      proofSlot: false,
    },
    output: {
      video: "out/HelloWorld.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "TextPresentation",
    stillId: null,
    templateType: "landscape-presentation",
    aspectRatio: "16:9",
    safeAreaProfile: landscapeSafeArea,
    subtitleMode: "landscape-bottom",
    supports: {
      hookSlot: true,
      coverSlot: false,
      proofSlot: true,
    },
    output: {
      video: "out/TextPresentation.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "NitrogenAI",
    stillId: null,
    templateType: "landscape-presentation",
    aspectRatio: "16:9",
    safeAreaProfile: landscapeSafeArea,
    subtitleMode: "landscape-bottom",
    supports: {
      hookSlot: true,
      coverSlot: false,
      proofSlot: true,
    },
    output: {
      video: "out/NitrogenAI.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "OpenClawAI",
    stillId: null,
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/OpenClawAI.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "ClawSkills",
    stillId: null,
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/ClawSkills.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "SuperPowers",
    stillId: null,
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/SuperPowers.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "PuaSkill",
    stillId: null,
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/PuaSkill.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "AgencyAgents",
    stillId: null,
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/AgencyAgents.mp4",
      cover: null,
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "AutoResearch",
    stillId: "AutoResearchCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/AutoResearch.mp4",
      cover: "out/AutoResearch-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "GSDIntro",
    stillId: "GSDIntroCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/GSDIntro.mp4",
      cover: "out/GSDIntro-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "WeChatClawBot",
    stillId: "WeChatClawBotCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/WeChatClawBot.mp4",
      cover: "out/WeChatClawBot-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "PencilDev",
    stillId: "PencilDevCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/PencilDev.mp4",
      cover: "out/PencilDev-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "AIHarnessEngineer",
    stillId: "AIHarnessEngineerCover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/AIHarnessEngineer.mp4",
      cover: "out/AIHarnessEngineer-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
  createEntry({
    compositionId: "FeishuCLI",
    stillId: "FeishuCLICover",
    templateType: "vertical-7-scene",
    aspectRatio: "9:16",
    safeAreaProfile: shortVideoSafeArea,
    subtitleMode: "single-line-bottom",
    supports: {
      hookSlot: true,
      coverSlot: true,
      proofSlot: true,
    },
    output: {
      video: "out/FeishuCLI.mp4",
      cover: "out/FeishuCLI-cover.png",
    },
    platformProfiles: {
      videoChannel: videoChannelProfile,
    },
  }),
] as const satisfies readonly VideoTemplateRegistryEntry[];

export const listVideoTemplates = (): VideoTemplateRegistryEntry[] =>
  [...videoTemplateRegistry];

export const getVideoTemplateByCompositionId = (
  compositionId: string,
): VideoTemplateRegistryEntry | undefined =>
  videoTemplateRegistry.find((entry) => entry.compositionId === compositionId);

export const getVideoTemplateByStillId = (
  stillId: string,
): VideoTemplateRegistryEntry | undefined =>
  videoTemplateRegistry.find((entry) => entry.stillId === stillId);

export const getPlatformProfile = (
  compositionId: string,
  platform: "videoChannel" = "videoChannel",
): VideoPlatformProfile | undefined =>
  getVideoTemplateByCompositionId(compositionId)?.platformProfiles[platform];
