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

## Notes for agents

- Prefer updating existing compositions instead of adding new ones without schema.
- Keep API and composition changes in sync (IDs, props, schemas).
- Update this file when new scripts or lint/test tooling are added.
