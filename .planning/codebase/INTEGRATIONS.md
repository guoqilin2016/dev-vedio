# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Video Avatar APIs:**
- D-ID - 数字人口型同步视频生成，调用代码位于 `src/server/services/digital-human.ts`，脚本入口位于 `scripts/generate-digital-human.ts`。
  - SDK/Client: Node 原生 `fetch`，未检测到官方 SDK 包。
  - Auth: `DID_API_KEY`，也可由请求体 `config.apiKey` 覆盖。
  - Outgoing endpoints: `https://api.d-id.com/audios`、`https://api.d-id.com/talks`、`https://api.d-id.com/talks/{talkId}`。
- HeyGen - 数字人视频生成与头像查询，调用代码位于 `src/server/services/heygen.ts`，脚本入口位于 `scripts/generate-heygen.ts`。
  - SDK/Client: Node 原生 `fetch` + `FormData`，未检测到官方 SDK 包。
  - Auth: `HEYGEN_API_KEY`，也可由请求体 `config.apiKey` 或查询参数 `apiKey` 覆盖。
  - Outgoing endpoints: `https://api.heygen.com/v1/asset`、`https://api.heygen.com/v2/video/generate`、`https://api.heygen.com/v1/video_status.get`、`https://api.heygen.com/v2/avatars`。

**Translation Helpers:**
- Google Translate Web Endpoint - 双语字幕脚本调用的免费 HTTP 端点，使用代码位于 `scripts/translate-subtitles.ts`。
  - SDK/Client: Node `https` 模块。
  - Auth: 无。
  - Outgoing endpoint: `https://translate.googleapis.com/translate_a/t`。

**Local CLI Integrations:**
- `edge-tts` - 本地命令行 TTS 提供方，服务端封装位于 `src/server/services/tts.ts`，脚本封装位于 `scripts/generate-voiceover.ts` 与多个 `scripts/generate-voiceover-*.ts`。
  - SDK/Client: 子进程调用 `edge-tts` 命令。
  - Auth: 当前代码未读取专用密钥；依赖本机已安装 CLI。
- `music-metadata` - 本地音频元数据解析，不访问外部网络，使用于 `scripts/sync-subtitle.ts` 与多个 `scripts/sync-subtitle-*.ts`。

## Data Storage

**Databases:**
- Not detected.

**File Storage:**
- Local filesystem only.
- 渲染视频输出到 `out/`，由 `src/server/services/renderer.ts` 写入。
- TTS 音频输出到 `public/audio/`，由 `src/server/services/tts.ts` 与 `scripts/generate-voiceover*.ts` 写入。
- 字幕 JSON 输出到 `src/data/` 或 `public/subtitle-*.json`，由 `scripts/sync-subtitle*.ts` 写入。
- 数字人视频输出到 `public/videos/`，由 `src/server/services/digital-human.ts` 与 `src/server/services/heygen.ts` 写入。
- 字幕翻译脚本在 `clips/` 中读取与写入 `.srt` 文件，代码位于 `scripts/translate-subtitles.ts`。

**Caching:**
- TTS 以文本和配置的 MD5 哈希为键缓存 MP3 文件，逻辑位于 `src/server/services/tts.ts`。
- Remotion bundle 使用进程内变量 `bundleLocation` 缓存，逻辑位于 `src/server/services/renderer.ts`。

## Authentication & Identity

**Auth Provider:**
- 对外 HTTP API 未检测到用户认证、会话、Token 校验或 RBAC 中间件；`src/server/index.ts` 仅注册 JSON 中间件和静态文件服务。
  - Implementation: 所有路由默认公开访问，输入校验依赖 Zod。

**External Service Authentication:**
- D-ID 使用 `Authorization: Basic ${apiKey}`，实现位于 `src/server/services/digital-human.ts`。
- HeyGen 使用 `X-Api-Key` 请求头，实现位于 `src/server/services/heygen.ts`。

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- 使用 `console.log` / `console.error` 输出处理进度、轮询状态和错误，分布于 `src/server/services/*.ts` 与 `scripts/*.ts`。

## CI/CD & Deployment

**Hosting:**
- Not detected.

**CI Pipeline:**
- Not detected；仓库未检测到 `.github/workflows/`。

## Environment Configuration

**Required env vars:**
- `DID_API_KEY` - D-ID 数字人生成，读取于 `src/server/services/digital-human.ts` 与 `src/server/routes/digital-human.ts`。
- `HEYGEN_API_KEY` - HeyGen 数字人生成，读取于 `src/server/services/heygen.ts` 与 `src/server/routes/heygen.ts`。

**Optional env vars:**
- `PORT` - Express 监听端口，读取于 `src/server/index.ts`，默认 `3001`。

**Secrets location:**
- 仅检测到通过 `process.env` 读取；根目录未检测到 `.env` 或 `.env.*` 文件。
- D-ID 与 HeyGen 也支持在请求体或查询参数中直接传入 API Key，入口分别位于 `src/server/routes/digital-human.ts` 与 `src/server/routes/heygen.ts`。

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.
- D-ID 与 HeyGen 任务完成状态通过轮询实现，不使用 webhook；轮询逻辑位于 `src/server/services/digital-human.ts` 与 `src/server/services/heygen.ts`。

## Input / Output Boundaries

**Incoming HTTP APIs:**
- `POST /api/render` - 请求体由 `RenderRequestSchema` 校验，定义位于 `src/shared/types.ts`，实现位于 `src/server/routes/render.ts`。
- `GET /api/render/compositions` - 返回可用 composition 列表，实现位于 `src/server/routes/render.ts`。
- `POST /api/tts` 与 `POST /api/tts/batch` - 请求体由 `src/server/routes/tts.ts` 中的 Zod schema 校验，输出 JSON 中附带 `/audio/<filename>`。
- `GET /api/tts/voices` - 返回内置声音列表，数据定义位于 `src/server/services/tts.ts`。
- `POST /api/digital-human` 与 `POST /api/digital-human/batch` - 输入为相对 `public/` 的音频路径，路由位于 `src/server/routes/digital-human.ts`。
- `GET /api/digital-human/status` - 返回 D-ID 配置状态。
- `POST /api/heygen` 与 `POST /api/heygen/batch` - 输入支持本地 `audioPath`、外部 `audioUrl` 或直接 `text`，路由位于 `src/server/routes/heygen.ts`。
- `GET /api/heygen/avatars` 与 `GET /api/heygen/status` - 读取 HeyGen 头像与配置状态。

**Static Output Exposure:**
- `src/server/index.ts` 将 `/videos` 映射到 `out/`。
- `src/server/index.ts` 将 `/audio` 映射到 `public/audio/`。
- `src/server/index.ts` 将 `/music` 映射到 `public/music/`。
- `src/server/services/digital-human.ts` 与 `src/server/services/heygen.ts` 将成品视频写入 `public/videos/`，同时返回 `/videos/<filename>` 形式的 URL。

**Scripted File Boundaries:**
- `scripts/generate-voiceover.ts` 与多个 `scripts/generate-voiceover-*.ts` 将内嵌文案数组转换为 `public/audio/*.mp3`。
- `scripts/sync-subtitle.ts` 读取 `public/audio/scene*.mp3`，输出 `public/subtitle-config.json` 与 `public/subtitle-data.json`。
- `scripts/sync-subtitle-openclaw.ts`、`scripts/sync-subtitle-clawskills.ts`、`scripts/sync-subtitle-superpowers.ts`、`scripts/sync-subtitle-puaskill.ts`、`scripts/sync-subtitle-agencyagents.ts`、`scripts/sync-subtitle-autoresearch.ts` 将音频时长同步为 `src/data/*-subtitles.json`。
- `scripts/generate-digital-human.ts` 与 `scripts/generate-heygen.ts` 读取 `public/audio/*.mp3`，下载远程生成结果到 `public/videos/`。
- `scripts/translate-subtitles.ts` 读取 `clips/subtitles_zh.zh.srt`，输出 `clips/full_video_bilingual.srt` 与章节双语字幕文件。

## Third-Party Boundaries Not Wired to Runtime APIs

**Human-operated asset sources:**
- `public/music/README.md` 记录了 Pixabay、Chosic、Freesound 的人工下载流程；当前代码未检测到对这些站点的程序化调用。

**Declared but not implemented providers:**
- `src/server/services/tts.ts` 暴露了 `"openai"`、`"azure"`、`"custom"` provider 枚举，但当前实现仅支持 `"edge-tts"`。

---

*Integration audit: 2026-03-21*
