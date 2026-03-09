# Repository Agent Guide

This file is for agentic coding assistants working in this repo.
Keep changes small, follow existing patterns, and prefer explicit scripts.

## Project summary

- Remotion-based video generation project with an Express API.
- TypeScript, CommonJS modules, strict type checking.
- Render outputs are written to `out/`.

## Key paths

- `src/index.ts`: Remotion entry.
- `src/Root.tsx`: Composition registration.
- `src/compositions/`: Video templates.
- `src/server/`: Express API.
- `src/shared/types.ts`: Shared types and Zod schemas.
- `public/music/`, `public/audio/`: Assets and generated audio.
- `out/`: Rendered videos (generated).

## Commands (build, lint, test)

Install:

```bash
npm install
```

Dev (Studio + API):

```bash
npm run dev
```

Studio only:

```bash
npm run studio
```

API server:

```bash
npm run server:dev
npm run server:start
```

Build bundle:

```bash
npm run build
```

Render outputs:

```bash
npm run render
npm run render:presentation
npm run render:nitrogen
npm run render:openclaw
```

Custom render example:

```bash
npx remotion render src/index.ts HelloWorld --output=out/custom.mp4 --props='{"title":"Custom"}'
```

Type check:

```bash
npm run typecheck
```

Lint:

- No lint script configured in `package.json`.

Tests:

- No test runner or test scripts configured in `package.json`.
- No Jest/Vitest config detected.

Single test:

- Not available until a test runner is added.
- If you add one, document the exact single-test command here.

## Environment variables

- `DID_API_KEY`: required for digital human generation.

## Code style and conventions

Formatting:

- 2-space indentation.
- Semicolons.
- Double quotes for strings.
- Trailing commas in multi-line objects and arrays.

Imports:

- External packages first, then local imports.
- Use relative imports for local modules.
- Path alias: `@/*` maps to `src/*` (see `tsconfig.json`).

Naming:

- React components: PascalCase.
- Variables and functions: camelCase.
- Constants: UPPER_SNAKE_CASE.
- Files: PascalCase for components, kebab-case for route modules.

TypeScript:

- `strict: true` and `noEmit` for type checks.
- Avoid `any`; model data via types and Zod schemas.
- Keep props serializable (Remotion compositions).

Remotion patterns:

- Register compositions in `src/Root.tsx`.
- Define `schema` for each composition and keep `defaultProps` aligned.
- Composition IDs are part of the API contract; change carefully.

API patterns:

- Express routers live in `src/server/routes/`.
- Services live in `src/server/services/`.
- Validate input with Zod `safeParse` and return 400 on failure.
- Return JSON with `success` and `error` when applicable.

Error handling:

- Use `try/catch` in async route handlers.
- Normalize errors with `error instanceof Error ? error.message : "Unknown error"`.
- Avoid swallowing errors; return a 500 with a clear message.

Logging:

- Use `console.log`/`console.error` for progress and errors.
- Keep logs short and actionable.

Assets and outputs:

- Put background music in `public/music/`.
- TTS audio outputs in `public/audio/`.
- Rendered videos go to `out/`.

## Data and scripts

- Subtitle JSON lives under `src/data/`.
- Utility scripts live in `scripts/` and are run via npm scripts.

## Cursor / Copilot rules

- No `.cursor/rules/` or `.cursorrules` found.
- No `.github/copilot-instructions.md` found.
- Reference: `docs/review-gate-v2-rule-cn.md` describes a Cursor rule users may opt into.

## Video generation workflow (end-to-end)

When creating a new video composition from scratch, follow this proven pipeline:

### 1. Composition architecture

- Each video lives under `src/compositions/<VideoName>/` with its own `schema.ts`, `animations.ts`, `index.tsx`, and `Scenes/` directory.
- Export from `src/compositions/index.ts` and register in `src/Root.tsx`.
- For vertical short videos (9:16), use `width: 1080, height: 1920`.
- For horizontal videos (16:9), use `width: 1920, height: 1080`.

### 2. Scene design pattern

- Each scene is a standalone React component receiving the full props type.
- Use `useCurrentFrame()` and `useVideoConfig()` for all timing.
- Create shared animation utilities in `animations.ts` (fadeInUp, fadeIn, glitchOffset, typewriter, progressBar, etc.).
- Use `spring()` for natural motion, `interpolate()` for linear mappings.
- **Never use CSS transitions/animations** — they won't render correctly in Remotion.
- For staggered items, use a `staggerDelay(index, baseDelay)` helper.

### 3. TTS voiceover pipeline

Script naming: `scripts/generate-voiceover-<name>.ts`

- Use `edge-tts` (must be installed: `pip install edge-tts`).
- Recommended voice: `zh-CN-YunxiNeural` (calm male, good for tech content).
- Use `...` in script text for natural pauses (converted to `，` before TTS).
- Output files: `public/audio/<name>-scene<N>.mp3`.
- Audio file paths in Root.tsx: `audio/<name>-scene<N>.mp3` (relative to `public/`).

### 4. Subtitle sync pipeline

Script naming: `scripts/sync-subtitle-<name>.ts`

- Reads actual audio duration from generated mp3 files using `music-metadata`.
- Generates frame-level word timing data.
- Outputs JSON to `src/data/<name>-subtitles.json`.
- Prints `durationInFrames` and `sceneDurations` to update Root.tsx.
- **Always run this after generating voiceover** — the composition's `durationInFrames` and `sceneDurations` must match real audio lengths.

### 5. Render pipeline

```bash
# Step 1: Generate voiceover audio
npm run generate:voiceover:<name>

# Step 2: Sync subtitles (updates JSON + prints config)
npm run sync:subtitle:<name>

# Step 3: Update Root.tsx with printed durationInFrames, sceneDurations, precomputedSubtitles

# Step 4: Preview in Studio
npm run studio

# Step 5: Render to MP4
npm run render:<name>
```

### 6. Lessons learned

- **Duration must match audio**: Initial `durationInFrames` estimate will differ from actual TTS audio length. Always sync after TTS generation.
- **Scene durations come from audio**: `sceneDurations` array = each scene's audio length + buffer. Never hardcode these.
- **Precomputed subtitles are essential**: Dynamic subtitle generation without audio timing data produces inaccurate karaoke highlights. Always use `precomputedSubtitles` from the sync script.
- **Zero external asset dependency is achievable**: All UI elements (terminals, browsers, dashboards, chat bubbles, progress bars) can be built with React + inline styles + emoji. No screenshots or external images needed.
- **Keep animations simple but layered**: Combine fadeInUp + glitch + scanlines + HUD borders for "tech feel" without complex dependencies.
- **Vertical video (9:16) layout tips**: Use larger font sizes (44-56px for titles), more vertical spacing, and full-width content areas. Subtitles need bigger fontSize (44px+) for mobile readability.

## Composition catalog

| ID | Format | Duration | Description |
|----|--------|----------|-------------|
| HelloWorld | 16:9 | 5s | Simple demo |
| TextPresentation | 16:9 | ~52s | 豆包日活破亿 (6-scene presentation) |
| NitrogenAI | 16:9 | ~89s | 英伟达Nitrogen AI (6-scene presentation) |
| OpenClawAI | 9:16 | ~95s | AI工具短视频 (7-scene vertical short video) |

## Notes for agents

- Prefer updating existing compositions instead of adding new ones without schema.
- Keep API and composition changes in sync (IDs, props, schemas).
- Update this file when new scripts or lint/test tooling are added.
- When creating a new video, follow the "Video generation workflow" section above.
- Always run `npm run typecheck` after changes to catch type errors early.
