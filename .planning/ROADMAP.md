# Roadmap: AI 技术短视频工厂

## Overview

这个 brownfield 里程碑不重写 Remotion 主干，而是按“事实源与注册表 → 媒体时序与 QA → 模板与首屏 Hook → 发布素材整包”的顺序收敛现有流水线。这样可以先稳定 source-of-truth 和媒体真相，再把 7 场景竖屏模板、封面 still 与统一发布包装建立在同一套 contract 上，避免继续在 composition、脚本和人工回填之间漂移。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: 内容事实契约与注册表** - 把 brief、模板登记和渲染发现入口收敛为单一真相。 (completed 2026-03-29)
- [x] **Phase 2: Media Manifest 与 QA 门禁** - 统一 voiceover、字幕、scene durations 与预渲染阻断检查。 (completed 2026-03-29)
- [x] **Phase 3: 模板运行时与 Hook 封面** - 抽出可复用的 7 场景竖屏模板、首屏 Hook、安全区和封面 still。 (administratively closed 2026-03-29)
- [x] **Phase 4: 统一发布素材整包输出** - 从同一事实源一次生成成片、封面、标题、描述与 hashtags。 (administratively closed 2026-03-29)

## Phase Details

### Phase 1: 内容事实契约与注册表
**Goal**: 创作者可以用结构化 brief 和统一注册表管理视频事实源、模板入口和渲染发现合同。
**Depends on**: Nothing (first phase)
**Requirements**: BRIEF-01, BRIEF-02, BRIEF-03, REG-01, REG-02
**Success Criteria** (what must be TRUE):
  1. 创作者可以为单条视频创建结构化 brief，包含主题、核心结论、关键事实、来源链接、CTA 和视觉主题。
  2. 当 brief 缺少核心事实或来源时，系统会拒绝输入并明确指出缺失字段。
  3. 创作者可以从统一注册表查看所有可用视频模板、封面 still、输出路径和模板类型。
  4. 同一份 brief 会作为视频脚本、封面文案、标题和描述的单一事实源，且同一批已注册 composition 能被 CLI 和 API 一致发现。
**Plans**: 3 plans

Plans:
- [x] 01-01: 定义 VideoBrief schema、校验规则和事实源加载约定
- [x] 01-02: 收敛 composition、still、输出路径和模板类型的统一 registry
- [x] 01-03: 打通 Root/CLI/API 的统一发现合同并绑定 brief 输入

### Phase 2: Media Manifest 与 QA 门禁
**Goal**: 创作者可以一键生成媒体时序真相，并在正式渲染前自动发现和阻断音频、字幕与时长问题。
**Depends on**: Phase 1
**Requirements**: MEDIA-01, MEDIA-02, MEDIA-03
**Success Criteria** (what must be TRUE):
  1. 创作者可以通过统一命令生成 voiceover、字幕数据、scene durations 和总时长元数据。
  2. 系统会在正式渲染前自动检查音频文件、字幕覆盖、scene durations 和总帧数是否一致。
  3. 当媒体数据不一致或缺失时，渲染会被明确阻止，并返回可定位到具体资源或时序字段的问题说明。
**Plans**: 2 plans

Plans:
- [x] 02-01: 构建 media manifest 生成链路并收敛 voiceover/subtitle/duration 元数据
- [x] 02-02: 增加 preflight QA、失败阻断和定位式报错

### Phase 3: 模板运行时与 Hook 封面
**Goal**: 创作者可以不复制整套 composition 目录，就用复用模板产出前三秒更抓人的 7 场景竖屏技术短视频和封面。
**Depends on**: Phase 2
**Requirements**: TEMP-01, TEMP-02, TEMP-03, TEMP-04
**Success Criteria** (what must be TRUE):
  1. 创作者可以使用可复用的 7 场景竖屏模板生成技术短视频，而不需要复制整个 composition 目录。
  2. 创作者可以配置首屏 hook、核心数字或核心承诺，并在视频前 3 到 5 秒内明确看到其兑现。
  3. 创作者可以在模板层复用统一的主题 token、安全区规则和共享动画 API。
  4. 创作者可以从同一模板数据导出封面 still，且封面与视频首屏保持一致的风格和关键信息。
**Plans**: 3 plans

Plans:
- [x] 03-01: 抽象 7 场景模板运行时、主题 token 和共享动画入口（administratively closed）
- [x] 03-02: 实现首屏 hook 槽位、封面 still 和安全区约束（administratively closed）
- [x] 03-03: 适配现有竖屏 composition 到模板层并保留 brownfield 兼容性（administratively closed）

### Phase 4: 统一发布素材整包输出
**Goal**: 创作者可以基于“模板 + brief”一次生成完整发布 package，并拿到与视频事实同源的包装素材。
**Depends on**: Phase 3
**Requirements**: REG-03, PACK-01, PACK-02, PACK-03
**Success Criteria** (what must be TRUE):
  1. 创作者可以基于“模板 + brief”触发一次完整视频 package 生成，而不是分别手动维护多个入口。
  2. 一次渲染完成后，创作者可以同时获得成片、封面图、16 字以内标题、视频描述和 hashtags。
  3. 生成的标题、封面文案和描述与视频内容共享同一事实源，不会在关键数字、结论或链接上产生漂移。
  4. 系统先输出统一版通用发布素材，供创作者人工微调后分发到不同平台。
**Plans**: 2 plans

Plans:
- [x] 04-01: 实现 publishing composer 与统一标题/描述/hashtags 规则（administratively closed）
- [x] 04-02: 接通 package orchestrator，输出成片、封面和文案 manifest（administratively closed）

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 内容事实契约与注册表 | 3/3 | Complete   | 2026-03-29 |
| 2. Media Manifest 与 QA 门禁 | 2/2 | Complete | 2026-03-29 |
| 3. 模板运行时与 Hook 封面 | 3/3 | Closed | 2026-03-29 |
| 4. 统一发布素材整包输出 | 2/2 | Closed | 2026-03-29 |

## Closure Note

本项目已于 2026-03-29 手动标记为完成。本次收口采用 administrative close 方式结束 Phase 3 与 Phase 4，表示主项目不再按原 roadmap 继续推进，而不是表示这两期范围已完整实现。
