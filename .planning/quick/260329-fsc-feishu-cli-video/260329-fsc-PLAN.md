# Quick Task 260329-fsc: 交付飞书 CLI / OpenAPI MCP 主题短视频

**Created:** 2026-03-29  
**Status:** Completed

## Goal

基于已完成的飞书 CLI 调研，按完整视频生产链路交付一条可发布的竖屏短视频，覆盖旁白、配音、字幕、封面、成片与发布文案。

## Scope

- 产出 7 段结构的飞书 CLI 主题视频
- 新增独立 composition、cover、渲染命令与媒体清单
- 生成实际配音文件、字幕数据和最终 MP4 / PNG 输出
- 补齐 quick task 总结与项目状态记录

## Tasks

### Task 1

- **files**: `docs/feishu-cli-video-plan.md`, `docs/feishu-cli-voiceover-script.md`, `docs/feishu-cli-copy.md`
- **action**: 收敛视频结论、场景结构、完整旁白和发布文案
- **verify**: 口径与既有调研一致，避免绝对化表述
- **done**: 文案可直接进入配音和画面实现

### Task 2

- **files**: `src/compositions/FeishuCLI/*`, `src/compositions/index.ts`, `src/compositions/catalog.ts`, `src/shared/video-registry.ts`, `src/Root.tsx`, `package.json`
- **action**: 新增飞书 CLI composition、封面与项目注册
- **verify**: composition 和 still 能被 Root、registry 和 catalog 一致发现
- **done**: 可以通过 npm script 直接渲染封面和视频

### Task 3

- **files**: `scripts/generate-voiceover-feishucli.ts`, `scripts/sync-subtitle-feishucli.ts`, `src/data/feishucli-subtitles.json`, `src/data/feishucli-media-manifest.json`
- **action**: 生成配音、同步字幕、写入媒体清单并跑预检
- **verify**: 音频、字幕、总时长和 manifest 一致
- **done**: `media:check:feishucli` 通过

### Task 4

- **files**: `out/FeishuCLI.mp4`, `out/FeishuCLI-cover.png`, `.planning/quick/260329-fsc-feishu-cli-video/260329-fsc-SUMMARY.md`, `.planning/STATE.md`
- **action**: 渲染封面和成片，记录结果并回填状态
- **verify**: 成片、封面存在且可读取；类型检查通过
- **done**: 飞书 CLI 视频处于可交付状态
