# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Dual-entry TypeScript application with a shared Remotion render core and an Express orchestration layer.

**Key Characteristics:**
- Use `src/index.ts` and `src/Root.tsx` as the single Remotion entry tree for Studio, CLI renders, and server-side rendering.
- Organize video features by composition under `src/compositions/<Feature>/`, with each feature owning its schema, animation helpers, and scene components.
- Keep the HTTP layer in `src/server/routes/` thin; delegate rendering, TTS, and digital-human work to `src/server/services/`.
- Feed compositions with checked-in subtitle JSON from `src/data/*.json`, generated media under `public/`, and runtime output under `out/`.
- Treat Express as a consumer of the Remotion app, not a separate render implementation: `src/server/services/renderer.ts` bundles `src/index.ts` and renders registered compositions.

## Layers

**Remotion Bootstrap Layer:**
- Purpose: Register composition IDs, schemas, dimensions, durations, and default props.
- Location: `src/index.ts`, `src/Root.tsx`
- Contains: `registerRoot(RemotionRoot)`, `<Composition />` declarations, imports from `src/compositions/index.ts`, subtitle JSON imports from `src/data/*.json`, shared defaults from `src/shared/types.ts`
- Depends on: `remotion`, `src/compositions/index.ts`, `src/shared/types.ts`, `src/data/*.json`
- Used by: `npm run studio`, `remotion render ...`, `src/server/services/renderer.ts`

**Composition Feature Layer:**
- Purpose: Implement each video template as an isolated feature module.
- Location: `src/compositions/HelloWorld/`, `src/compositions/TextPresentation/`, `src/compositions/OpenClawAI/`, `src/compositions/ClawSkills/`, `src/compositions/SuperPowers/`, `src/compositions/PuaSkill/`, `src/compositions/AgencyAgents/`, `src/compositions/AutoResearch/`
- Contains: `schema.ts`, `index.tsx`, optional `animations.ts`, and `Scenes/*.tsx`
- Depends on: `remotion`, `zod`, shared components from `src/components/`
- Used by: `src/Root.tsx`

**Shared Presentation Layer:**
- Purpose: Provide reusable rendering primitives shared across compositions.
- Location: `src/components/`, `src/shared/`
- Contains: subtitle rendering in `src/components/KaraokeSubtitle.tsx`, transition helpers in `src/components/Transitions.tsx` and `src/components/OfficialTransitions.tsx`, caption helpers in `src/components/OfficialCaptions.tsx`, render request types in `src/shared/types.ts`
- Depends on: `remotion`, `@remotion/transitions`, `@remotion/captions`, `zod`
- Used by: composition modules and render routes

**API Layer:**
- Purpose: Expose HTTP endpoints for rendering and media generation, and serve generated assets.
- Location: `src/server/index.ts`, `src/server/routes/*.ts`
- Contains: Express app setup, JSON middleware, static file mounts, route registration, health check, root endpoint
- Depends on: `express`, route modules, Node `path`
- Used by: `npm run server:dev`, `npm run server:start`, `npm run dev`

**Service / Integration Layer:**
- Purpose: Encapsulate Remotion rendering, TTS generation, and third-party video integrations.
- Location: `src/server/services/*.ts`
- Contains: Remotion bundling/rendering in `src/server/services/renderer.ts`, edge-tts execution in `src/server/services/tts.ts`, D-ID integration in `src/server/services/digital-human.ts`, HeyGen integration in `src/server/services/heygen.ts`
- Depends on: `@remotion/bundler`, `@remotion/renderer`, Node `fs/path/crypto/child_process`, remote APIs via `fetch`
- Used by: `src/server/routes/*.ts`

**Prepared Content / Asset Layer:**
- Purpose: Store generated or curated inputs consumed by Remotion and Express.
- Location: `src/data/`, `public/audio/`, `public/music/`, `public/video-configs/`, `public/videos/`, `out/`
- Contains: precomputed subtitles such as `src/data/openclaw-subtitles.json`, voiceover MP3 files such as `public/audio/openclaw-scene1.mp3`, background music in `public/music/background.mp3`, JSON presets such as `public/video-configs/nitrogen-ai.json`, digital-human outputs under `public/videos/`, rendered MP4 files under `out/`
- Depends on: generation scripts in `scripts/`, runtime static serving in `src/server/index.ts`
- Used by: `src/Root.tsx`, composition components, Express static mounts

## Data Flow

**Studio / CLI Composition Flow:**

1. `package.json` scripts such as `studio`, `render:openclaw`, and `render:autoresearch` point Remotion to `src/index.ts`.
2. `src/index.ts` calls `registerRoot(RemotionRoot)`, making `src/Root.tsx` the composition registry.
3. `src/Root.tsx` imports feature components and schemas from `src/compositions/index.ts`, binds IDs such as `HelloWorld`, `TextPresentation`, `NitrogenAI`, `OpenClawAI`, `ClawSkills`, `SuperPowers`, `PuaSkill`, `AgencyAgents`, and `AutoResearch`, and injects feature-specific `defaultProps`.
4. Each composition `index.tsx` converts props into `Sequence` timelines, `Audio` tracks, subtitles via `src/components/KaraokeSubtitle.tsx`, and optional overlays such as the `digitalHuman` videos used by `src/compositions/TextPresentation/index.tsx`.
5. Static assets are resolved with `staticFile(...)` from `public/`, while precomputed subtitle timing is read from `src/data/*.json`.

**API Render Flow:**

1. `src/server/index.ts` mounts `POST /api/render` from `src/server/routes/render.ts`.
2. `src/server/routes/render.ts` validates input with `RenderRequestSchema` from `src/shared/types.ts`.
3. The route calls `getAvailableCompositions()` and `renderVideo()` from `src/server/services/renderer.ts`.
4. `src/server/services/renderer.ts` bundles `src/index.ts` once, selects the requested composition from the bundled Remotion app, then calls `renderMedia(...)`.
5. Rendered video files are written to `out/` and exposed through the static mount `GET /videos/*` configured in `src/server/index.ts`.

**Audio / Subtitle Preparation Flow:**

1. Script entry points in `scripts/` generate MP3 voiceovers into `public/audio/`, for example `scripts/generate-voiceover-openclaw.ts`.
2. Subtitle sync scripts read the generated audio duration, compute frame-aligned word timing, and emit JSON timing data.
3. The base `TextPresentation` flow writes helper artifacts to `public/subtitle-config.json` and `public/subtitle-data.json` from `scripts/sync-subtitle.ts`.
4. Feature-specific sync scripts such as `scripts/sync-subtitle-openclaw.ts` and `scripts/sync-subtitle-autoresearch.ts` write checked-in subtitle data into `src/data/*.json`.
5. `src/Root.tsx` imports those JSON files and passes them as `precomputedSubtitles` in composition `defaultProps`.

**State Management:**
- Use props plus frame-derived calculations; no global state container is present.
- Compute timeline state locally with `useMemo`, `useCurrentFrame()`, and `useVideoConfig()` inside composition modules such as `src/compositions/TextPresentation/index.tsx` and `src/compositions/OpenClawAI/index.tsx`.

## Key Abstractions

**Composition Contract:**
- Purpose: Define the public shape of a renderable video template.
- Examples: `src/Root.tsx`, `src/compositions/TextPresentation/schema.ts`, `src/compositions/OpenClawAI/schema.ts`
- Pattern: Every exposed composition has an `id`, React component, `schema`, duration/fps/size, and `defaultProps` registered in `src/Root.tsx`.

**Feature Composition Module:**
- Purpose: Package one video template with all of its runtime concerns.
- Examples: `src/compositions/TextPresentation/`, `src/compositions/OpenClawAI/`, `src/compositions/AgencyAgents/`, `src/compositions/AutoResearch/`
- Pattern: `schema.ts` defines validated props, `index.tsx` assembles the timeline, `animations.ts` centralizes feature-specific motion helpers, and `Scenes/*.tsx` hold scene-level layouts.

**Timeline Segmentation by Scene:**
- Purpose: Translate script sections into independent visual/audio segments.
- Examples: `src/compositions/TextPresentation/index.tsx`, `src/compositions/OpenClawAI/index.tsx`, `src/compositions/AutoResearch/index.tsx`
- Pattern: Maintain `sceneDurations`, derive `sceneStartFrames`, then render `Sequence` blocks per scene.

**Subtitle Timing Model:**
- Purpose: Represent word-level karaoke timing independently from UI.
- Examples: `src/components/KaraokeSubtitle.tsx`, `src/data/openclaw-subtitles.json`, `src/data/autoresearch-subtitles.json`
- Pattern: A subtitle line is an object containing `words[]`, `startFrame`, and `endFrame`; feature schemas expose `precomputedSubtitles` as optional props.

**Route / Service Split:**
- Purpose: Keep transport logic separate from rendering and integration logic.
- Examples: `src/server/routes/render.ts` + `src/server/services/renderer.ts`, `src/server/routes/tts.ts` + `src/server/services/tts.ts`
- Pattern: Routes validate and format HTTP responses; services return domain-level success/error payloads.

**Composition Catalog Exposure:**
- Purpose: Decide which composition IDs the HTTP render API accepts.
- Examples: `src/Root.tsx`, `src/server/services/renderer.ts`
- Pattern: Remotion registration lives in `src/Root.tsx`, while `/api/render/compositions` and the existence check use `getAvailableCompositions()` in `src/server/services/renderer.ts`.

## Entry Points

**Remotion Entry:**
- Location: `src/index.ts`
- Triggers: `npm run studio`, all `remotion render ...` scripts, `src/server/services/renderer.ts`
- Responsibilities: Register the Remotion root component.

**Composition Registry:**
- Location: `src/Root.tsx`
- Triggers: Any Studio preview, CLI render, or API render that loads the Remotion bundle
- Responsibilities: Register all composition IDs, wire schemas and default props, import precomputed subtitle data, and define canonical output dimensions per composition.

**Express Server Entry:**
- Location: `src/server/index.ts`
- Triggers: `npm run server:dev`, `npm run server:start`, the `dev` concurrent workflow
- Responsibilities: Start the API server, mount static asset directories, register HTTP routes, expose health and root metadata endpoints.

**Offline Media Preparation Scripts:**
- Location: `scripts/*.ts`, `scripts/merge-bilingual-subs.py`
- Triggers: `npm run generate:voiceover*`, `npm run sync:subtitle*`, direct `tsx` or Python execution
- Responsibilities: Generate TTS audio, derive subtitle timing JSON, call digital-human providers, and produce supporting media/config artifacts.

## Error Handling

**Strategy:** Validate early in routes, catch async failures at route and service boundaries, and return structured `{ success, error }` payloads.

**Patterns:**
- Use `safeParse(...)` with Zod before delegating work in `src/server/routes/render.ts`, `src/server/routes/tts.ts`, `src/server/routes/digital-human.ts`, and `src/server/routes/heygen.ts`.
- Return `400` for validation failures and missing local audio files, and `500` for service failures.
- Normalize thrown values with `error instanceof Error ? error.message : "Unknown error"` in route handlers and services.
- Make service functions such as `renderVideo(...)`, `generateTTS(...)`, `generateDigitalHumanVideo(...)`, and `generateHeyGenVideo(...)` return success/error result objects rather than throwing raw transport details to the caller.

## Cross-Cutting Concerns

**Logging:** Use `console.log` and `console.error` throughout `src/server/services/*.ts`, `src/server/index.ts`, and `scripts/*.ts` for progress and failure reporting.
**Validation:** Use Zod schemas in `src/shared/types.ts` and each `src/compositions/*/schema.ts`; routes add request-level validation with route-local schemas where needed.
**Authentication:** No user/session authentication layer is present. External provider access relies on environment variables consumed in `src/server/services/digital-human.ts` and `src/server/services/heygen.ts`.

---

*Architecture analysis: 2026-03-21*
