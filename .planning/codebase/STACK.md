# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript 5.9.3 - 应用代码位于 `src/`，自动化脚本位于 `scripts/`，由 `package.json` 与 `package-lock.json` 声明。

**Secondary:**
- JSON - 组合字幕与配置数据位于 `src/data/*.json`、`public/subtitle-config.json`、`public/subtitle-data.json`、`public/video-configs/nitrogen-ai.json`。
- Markdown - 项目说明位于 `README.md`、`AGENTS.md`、`public/music/README.md`。

## Runtime

**Environment:**
- Node.js CommonJS 运行时，仓库声明在 `package.json` 的 `"type": "commonjs"`，TypeScript 编译目标定义在 `tsconfig.json` 的 `"target": "ES2022"` 与 `"module": "commonjs"`。
- 当前工作区检测到 Node.js `v24.9.0` 与 Python `3.10.15`；仓库根目录未检测到 `.nvmrc` 或 `.python-version`。

**Package Manager:**
- `npm`，当前工作区检测到版本 `11.6.0`。
- Lockfile: `package-lock.json` 存在，`lockfileVersion` 为 `3`。

## Frameworks

**Core:**
- Remotion `4.0.435` - 视频组合注册与渲染入口位于 `src/index.ts`、`src/Root.tsx`、`src/compositions/`。
- Express `5.2.1` - API 服务入口位于 `src/server/index.ts`，路由位于 `src/server/routes/`。
- Zod `3.22.3` - 输入校验位于 `src/shared/types.ts`、`src/server/routes/tts.ts`、`src/server/routes/digital-human.ts`、`src/server/routes/heygen.ts`。

**Build/Dev:**
- `tsx` `4.21.0` - 本地运行 TypeScript 服务与脚本，命令定义在 `package.json`。
- `concurrently` `9.2.1` - 并行启动 Remotion Studio 与 Express API，命令位于 `package.json` 的 `dev`。
- TypeScript `5.9.3` - 严格类型检查由 `npm run typecheck` 驱动。

## Key Dependencies

**Critical:**
- `remotion` `4.0.435` - 组合组件、帧动画和静态资源引用，使用位置包括 `src/Root.tsx`、`src/components/KaraokeSubtitle.tsx`、`src/compositions/*`。
- `@remotion/bundler` `4.0.435` - 服务端打包入口，使用于 `src/server/services/renderer.ts`。
- `@remotion/renderer` `4.0.435` - 服务端选择 composition 并输出媒体文件，使用于 `src/server/services/renderer.ts`。
- `express` `5.2.1` - HTTP API 与静态文件服务，使用于 `src/server/index.ts`。
- `zod` `3.22.3` - 请求体与 composition props 校验，使用于 `src/shared/types.ts` 与多个 schema 文件。

**Infrastructure:**
- `music-metadata` `11.11.1` - 读取音频时长，使用于 `scripts/sync-subtitle.ts` 及多份 `scripts/sync-subtitle-*.ts`。
- `@remotion/captions` `4.0.435` - 官方字幕组件辅助能力，使用于 `src/components/OfficialCaptions.tsx`。
- `@remotion/transitions` `4.0.435` 与 `@remotion/light-leaks` `4.0.435` - 官方转场与视觉效果，使用于 `src/components/OfficialTransitions.tsx`。
- `youtube-transcript` `1.2.1` - 已安装于 `package.json`，当前在 `src/` 与 `scripts/` 中未检测到直接导入。

## Build and Development Commands

**Install:**
- `npm install` - 安装根依赖，定义于 `README.md`。

**Development:**
- `npm run dev` - 并行启动 `npm run studio` 与 `npm run server:dev`，定义于 `package.json`。
- `npm run studio` - 启动 Remotion Studio，入口为 `src/index.ts`。
- `npm run server:dev` - 通过 `tsx watch` 启动 `src/server/index.ts`。
- `npm run server:start` - 通过 `tsx` 启动 `src/server/index.ts`。

**Build / Render:**
- `npm run build` - 通过 `remotion bundle` 输出到 `build/`。
- `npm run render` - 渲染 `HelloWorld` 到 `out/HelloWorld.mp4`。
- `npm run render:presentation` - 渲染 `TextPresentation` 到 `out/TextPresentation.mp4`。
- `npm run render:nitrogen` - 渲染 `NitrogenAI` 到 `out/NitrogenAI.mp4`。
- `npm run render:openclaw` - 渲染 `OpenClawAI` 到 `out/OpenClawAI.mp4`。
- `npm run render:clawskills` - 渲染 `ClawSkills` 到 `out/ClawSkills.mp4`。
- `npm run render:superpowers` - 渲染 `SuperPowers` 到 `out/SuperPowers.mp4`。
- `npm run render:puaskill` - 渲染 `PuaSkill` 到 `out/PuaSkill.mp4`。
- `npm run render:agencyagents` - 渲染 `AgencyAgents` 到 `out/AgencyAgents.mp4`。

**Asset / Subtitle Pipelines:**
- `npm run generate:voiceover` 与多份 `generate:voiceover:*` - 通过 `scripts/generate-voiceover*.ts` 生成 `public/audio/*.mp3`。
- `npm run sync:subtitle` 与多份 `sync:subtitle:*` - 通过 `scripts/sync-subtitle*.ts` 读取 `public/audio/*.mp3` 并输出字幕 JSON。
- `npm run generate:digital-human` - 通过 `scripts/generate-digital-human.ts` 调用 D-ID。
- `npm run generate:heygen` - 通过 `scripts/generate-heygen.ts` 调用 HeyGen。
- `npm run typecheck` - 执行 `tsc --noEmit`。

## Configuration

**Environment:**
- 环境变量读取点位于 `src/server/index.ts` 的 `PORT`、`src/server/services/digital-human.ts` 的 `DID_API_KEY`、`src/server/services/heygen.ts` 的 `HEYGEN_API_KEY`。
- 根目录未检测到 `.env`、`.env.*`、`.nvmrc`、`.python-version`。
- TTS 工作流依赖本机 `edge-tts` 命令，安装提示位于 `README.md` 与 `scripts/generate-voiceover.ts`。

**Build:**
- `tsconfig.json` - TypeScript 严格模式、`@/*` 路径别名、`react-jsx` JSX 运行时。
- `remotion.config.ts` - 设置输出图片格式为 `jpeg`，并开启覆盖输出。
- `package.json` - 命令、依赖、模块制式与仓库元数据。
- `package-lock.json` - 依赖锁定文件。

## Resource Directories

**Source and Runtime Data:**
- `src/compositions/` - 各视频模板与场景实现。
- `src/data/` - 预计算字幕 JSON，如 `src/data/openclaw-subtitles.json`。
- `src/shared/` - 共享类型与 Zod schema，见 `src/shared/types.ts`。

**Public Assets and Generated Media:**
- `public/audio/` - TTS 生成音频与场景配音成品。
- `public/music/` - 背景音乐与来源说明，见 `public/music/README.md`。
- `public/videos/` - D-ID / HeyGen 服务写入的数字人视频输出目录，创建逻辑位于 `src/server/services/digital-human.ts` 与 `src/server/services/heygen.ts`。
- `public/video-configs/` - 人工维护的视频配置 JSON，如 `public/video-configs/nitrogen-ai.json`。
- `public/subtitle-config.json`、`public/subtitle-data.json` - `scripts/sync-subtitle.ts` 生成的公共字幕配置。

**Render and Clip Outputs:**
- `out/` - Remotion 渲染输出目录，Express 在 `src/server/index.ts` 中将其映射到 `/videos`。
- `clips/` - `scripts/translate-subtitles.ts` 使用的字幕输入输出目录。

## Platform Requirements

**Development:**
- 需要 Node.js 环境以运行 `remotion`、`express`、`tsx` 与 TypeScript 工具链。
- 需要本机可执行的 `edge-tts` 命令以支持 `scripts/generate-voiceover*.ts` 与 `src/server/services/tts.ts`。
- 需要 Python / `pip` 以安装 `edge-tts`，安装说明位于 `README.md`。

**Production:**
- 当前仓库提供本地 Node 进程方式运行 `src/server/index.ts`，并通过本地文件系统输出媒体文件。
- 未检测到 `Dockerfile`、`docker-compose*.yml`、`.github/workflows/` 或其他部署编排文件。

---

*Stack analysis: 2026-03-21*
