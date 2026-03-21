# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```text
dev-vedio/
├── .planning/codebase/      # Generated codebase maps for later planning/execution
├── clips/                   # External clip and subtitle artifacts kept alongside the repo
├── docs/                    # Project/process documentation
├── out/                     # Rendered MP4 output from Remotion and render API
├── public/                  # Runtime-static assets and generated media
├── scripts/                 # Offline media-preparation and integration scripts
├── src/                     # Remotion app, composition features, shared UI, and Express API
├── AGENTS.md                # Repo-specific agent instructions
├── package.json             # Command entry points and dependencies
├── remotion.config.ts       # Remotion CLI output settings
├── README.md                # High-level usage and workflow notes
└── tsconfig.json            # TypeScript compiler configuration
```

## Directory Purposes

**`src/`:**
- Purpose: Hold all runtime TypeScript source for both video rendering and the API server.
- Contains: `src/index.ts`, `src/Root.tsx`, composition features, shared components, server routes/services, shared types, checked-in subtitle data
- Key files: `src/index.ts`, `src/Root.tsx`, `src/compositions/index.ts`, `src/server/index.ts`, `src/shared/types.ts`

**`src/compositions/`:**
- Purpose: Feature-root for each video template.
- Contains: One directory per composition plus the export barrel `src/compositions/index.ts`
- Key files: `src/compositions/TextPresentation/index.tsx`, `src/compositions/OpenClawAI/schema.ts`, `src/compositions/ClawSkills/animations.ts`, `src/compositions/AgencyAgents/index.tsx`, `src/compositions/AutoResearch/index.tsx`

**`src/compositions/<Feature>/`:**
- Purpose: Keep one video’s runtime contract and scene logic together.
- Contains: `schema.ts`, `index.tsx`, optional `animations.ts`, and `Scenes/*.tsx`
- Key files: `src/compositions/TextPresentation/schema.ts`, `src/compositions/OpenClawAI/Scenes/HookScene.tsx`, `src/compositions/PuaSkill/Scenes/BenchmarkScene.tsx`, `src/compositions/SuperPowers/Scenes/PipelineScene.tsx`

**`src/components/`:**
- Purpose: Reusable Remotion UI primitives used across multiple compositions.
- Contains: subtitles, transitions, official caption/transition wrappers, and the export barrel
- Key files: `src/components/KaraokeSubtitle.tsx`, `src/components/Transitions.tsx`, `src/components/OfficialCaptions.tsx`, `src/components/OfficialTransitions.tsx`

**`src/server/`:**
- Purpose: Express-side HTTP entry point and transport/service split.
- Contains: `index.ts`, `routes/*.ts`, `services/*.ts`
- Key files: `src/server/index.ts`, `src/server/routes/render.ts`, `src/server/services/renderer.ts`, `src/server/services/tts.ts`

**`src/shared/`:**
- Purpose: Store types and schemas shared between the server and render entry points.
- Contains: render request/response types and defaults
- Key files: `src/shared/types.ts`

**`src/data/`:**
- Purpose: Store precomputed subtitle timing JSON imported directly by `src/Root.tsx`.
- Contains: feature-specific subtitle artifacts such as `src/data/nitrogen-subtitles.json`, `src/data/openclaw-subtitles.json`, `src/data/clawskills-subtitles.json`, `src/data/superpowers-subtitles.json`, `src/data/puaskill-subtitles.json`, `src/data/agencyagents-subtitles.json`, `src/data/autoresearch-subtitles.json`
- Key files: `src/data/openclaw-subtitles.json`, `src/data/autoresearch-subtitles.json`

**`public/`:**
- Purpose: Hold assets and generated media resolved at runtime through `staticFile(...)` or served by Express static middleware.
- Contains: audio under `public/audio/`, music under `public/music/`, JSON helper artifacts such as `public/subtitle-config.json`, preset JSON under `public/video-configs/`, provider-generated talking-head videos under `public/videos/`
- Key files: `public/music/background.mp3`, `public/subtitle-config.json`, `public/subtitle-data.json`, `public/video-configs/nitrogen-ai.json`

**`scripts/`:**
- Purpose: Host one-off or repeatable media-preparation tasks outside the runtime app.
- Contains: base TextPresentation scripts, per-feature voiceover/subtitle scripts, provider utilities, and subtitle translation helpers
- Key files: `scripts/generate-voiceover.ts`, `scripts/sync-subtitle.ts`, `scripts/generate-voiceover-openclaw.ts`, `scripts/sync-subtitle-openclaw.ts`, `scripts/generate-digital-human.ts`, `scripts/generate-heygen.ts`, `scripts/merge-bilingual-subs.py`

**`out/`:**
- Purpose: Default render target for MP4 output.
- Contains: generated render files such as those targeted by `render`, `render:openclaw`, `render:agencyagents`, and `render:autoresearch`
- Key files: Not checked in as stable source files

**`clips/`:**
- Purpose: Store standalone clip/subtitle artifacts that are separate from the Remotion runtime tree.
- Contains: `.mp4`, `.vtt`, and `.srt` files such as `clips/01_引言.mp4` and `clips/full_video_bilingual.srt`
- Key files: `clips/01_引言.mp4`, `clips/full_video_bilingual.srt`

**`docs/`:**
- Purpose: Hold project/process documentation not executed at runtime.
- Contains: review-gate documentation
- Key files: `docs/review-gate-v2-rule-cn.md`

## Key File Locations

**Entry Points:**
- `package.json`: Defines the main operational commands: `dev`, `studio`, `server:dev`, `server:start`, `render:*`, `generate:voiceover:*`, `sync:subtitle:*`, and `typecheck`.
- `src/index.ts`: Remotion entry file passed to Studio, CLI render, and the server renderer.
- `src/Root.tsx`: Central composition registry and default prop source.
- `src/server/index.ts`: Express API startup and static mount entry.
- `scripts/generate-voiceover*.ts`: Voiceover generation entry points.
- `scripts/sync-subtitle*.ts`: Subtitle timing generation entry points.

**Configuration:**
- `package.json`: Project scripts and dependency graph.
- `tsconfig.json`: Strict TypeScript configuration with the alias `@/* -> src/*`.
- `remotion.config.ts`: Sets Remotion CLI defaults via `Config.setVideoImageFormat("jpeg")` and `Config.setOverwriteOutput(true)`.
- `AGENTS.md`: Repo-specific coding and workflow rules.
- `README.md`: User-facing setup and workflow reference.

**Core Logic:**
- `src/compositions/index.ts`: Barrel exporting all composition components and schemas.
- `src/compositions/<Feature>/index.tsx`: Per-feature timeline assembly.
- `src/compositions/<Feature>/schema.ts`: Per-feature prop validation contract.
- `src/components/KaraokeSubtitle.tsx`: Shared word-level subtitle rendering model.
- `src/components/Transitions.tsx`: Shared scene transition and progress primitives.
- `src/server/services/renderer.ts`: Remotion bundling and output rendering.
- `src/server/services/tts.ts`: Edge TTS integration and caching-by-hash output naming.

**Testing:**
- Not detected. No test directory, test runner config, or test scripts are present in `package.json`.

## Naming Conventions

**Files:**
- Use PascalCase for reusable React component files and composition feature directories, for example `src/components/KaraokeSubtitle.tsx`, `src/compositions/OpenClawAI/`, and `src/compositions/AutoResearch/`.
- Use lowercase generic filenames for feature-internal anchors: `index.tsx`, `schema.ts`, and `animations.ts`.
- Use kebab-case for backend route/service modules and utility scripts, for example `src/server/routes/digital-human.ts`, `src/server/services/digital-human.ts`, and `scripts/sync-subtitle-openclaw.ts`.
- Use kebab-case or feature-name prefixes for generated data/assets, for example `src/data/openclaw-subtitles.json`, `public/audio/openclaw-scene1.mp3`, and `public/video-configs/nitrogen-ai.json`.

**Directories:**
- Put each video feature in its own PascalCase directory under `src/compositions/`.
- Use the capitalized subdirectory name `Scenes/` inside composition features for scene-level components.
- Keep infrastructure directories lowercase, for example `src/server/routes/`, `src/server/services/`, `src/shared/`, `public/audio/`, and `public/music/`.

## Where to Add New Code

**New Feature:**
- Primary code: Create `src/compositions/<FeatureName>/` with at minimum `schema.ts` and `index.tsx`; add `animations.ts` and `Scenes/*.tsx` if the feature is multi-scene.
- Registration: Export the feature from `src/compositions/index.ts` and register it in `src/Root.tsx`.
- API discoverability: If the render API must accept the new composition, update `getAvailableCompositions()` in `src/server/services/renderer.ts`.
- Prepared data: Put checked-in precomputed subtitle JSON in `src/data/<feature>-subtitles.json` if `src/Root.tsx` should import it directly.
- Generated media: Put generated voiceover files in `public/audio/`; render outputs belong in `out/`.
- Tests: No established location is present in the current codebase.

**New Component/Module:**
- Shared render-time UI: `src/components/`
- Shared cross-layer types/schemas: `src/shared/`
- HTTP route handlers: `src/server/routes/`
- Backend business/integration logic: `src/server/services/`

**Utilities:**
- Offline media and maintenance helpers: `scripts/`
- Runtime-static presets and helper JSON: `public/video-configs/` or `public/*.json`
- Documentation or process notes: `docs/`

## Special Directories

**`out/`:**
- Purpose: Render output target for Remotion CLI and API renders.
- Generated: Yes
- Committed: No tracked files detected in the current repository state

**`public/audio/`:**
- Purpose: Store generated scene voiceovers and audio files served by Express and loaded by Remotion.
- Generated: Yes
- Committed: Yes for many existing `.mp3` files; additional files are also present in the working tree

**`public/videos/`:**
- Purpose: Store generated digital-human videos for optional overlay in compositions such as `src/compositions/TextPresentation/index.tsx`.
- Generated: Yes
- Committed: No tracked files detected in the current repository state

**`src/data/`:**
- Purpose: Store subtitle timing JSON imported by source code.
- Generated: Yes, by subtitle sync scripts
- Committed: Yes for several subtitle JSON files; additional files are also present in the working tree

**`clips/`:**
- Purpose: Hold standalone clip and subtitle artifacts outside the Remotion runtime tree.
- Generated: Mixed / not established by the explored runtime scripts
- Committed: Yes

---

*Structure analysis: 2026-03-21*
