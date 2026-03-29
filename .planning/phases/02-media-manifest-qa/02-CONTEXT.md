# Phase 2: Media Manifest 与 QA 门禁 - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 的边界不是直接做“飞书 CLI”新模板，也不是现在就抽象完整模板运行时，而是把一条新的 reference video 真正接进统一媒体生产链路：让 voiceover、subtitle、scene durations、总时长、render 入口和预渲染阻断检查都收敛到同一份 media manifest。  

本 phase 使用“飞书 CLI / OpenAPI MCP”视频作为新的验证样本，目的不是先追求更多模板数量，而是先证明：当我们新增一个外部资料驱动的技术短视频时，媒体时序真相可以被一键生成，错误也会在渲染前被明确拦住。

</domain>

<decisions>
## Implementation Decisions

### 参考视频选题与口径
- **D-01:** Phase 2 以“飞书 CLI / OpenAPI MCP”作为新的 reference video 主题，作为 media manifest 与 QA gate 的验证样本。
- **D-02:** 这条视频的主定位固定为：**飞书正在成为国内最适合 AI Agent 落地协作工作的入口。**
- **D-03:** 目标受众固定为：**泛 AI 用户**，不是纯开发者教程观众。
- **D-04:** 视频默认不走“安装教程”或“参数评测”路线，而走“结论 + 证明”的 feed-first 叙事。

### 事实口径与证据边界
- **D-05:** 旁白与包装文案必须明确区分两层口径：
  - **本地 OpenAPI MCP / CLI 层：** 能力覆盖面广，可承载文档、消息、多维表格、任务、日历等协作场景。
  - **官方远程 MCP 文档层：** 当前公开口径更保守，Docs 是最明确的已公开场景，更多场景后续开放。
- **D-06:** 这条视频禁止使用“全部能力都已经零门槛稳定开放”这类绝对化表达；推荐表达为：
  - “官方 OpenAPI MCP/CLI 已经把大量协作能力接进本地 Agent 工作流”
  - “飞书正在从协作工具变成 Agent 可调用的工作入口”
- **D-07:** 这条视频的前三个 proof 模块优先级固定为：
  - 文档导入 / 生成
  - 日历忙闲 / 安排行程
  - 多维表格 / 看板

### 对 Phase 2 产物的要求
- **D-08:** Phase 2 的 media manifest 必须成为这条 reference video 的单一事实源，至少能表达：
  - composition id
  - still id（如存在）
  - scene voiceover scripts
  - scene audio file paths
  - subtitle data path
  - scene durations
  - total duration / total frames
  - output targets
- **D-09:** Phase 2 的生成命令需要支持“从主题视频的媒体源数据出发，一次性产出并回填 manifest 所需元数据”，而不是继续由 `Root.tsx`、脚本输出和人工复制各自维护。
- **D-10:** Phase 2 的 preflight QA 必须在正式 render 前阻断以下问题：
  - 音频文件缺失
  - 字幕文件缺失或为空
  - scene durations 与音频长度不一致
  - total frames 与 scene durations 汇总不一致
- **D-11:** QA 报错必须是定位式的，至少要指出是哪个 scene、哪个文件或哪一类元数据不一致。

### 视觉与生产约束
- **D-12:** 这条 reference video 默认采用“结果导向 opening + 多视觉模块轮换”：
  - CLI / 授权桥接
  - 文档结果页
  - 日历忙闲视图
  - 多维表格 / 看板
- **D-13:** Phase 2 不需要先抽象这些视觉模块为全局模板能力，只要 media manifest / QA 流程能稳定支撑新视频接入即可。

### the agent's Discretion
- media manifest 的具体文件位置、命名方式与 Zod schema 设计
- 统一命令是走“通用入口 + 主题参数”还是“主题脚本封装通用核心”
- preflight QA 结果的输出格式（CLI 文本、JSON 或两者同时）
- 是否先为一个现有视频和飞书 CLI 新视频同时接入 manifest，以证明兼容旧模板

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/PROJECT.md` — 当前项目的短视频生产目标与 brownfield 约束
- `.planning/REQUIREMENTS.md` — `MEDIA-01/02/03` 的正式要求映射
- `.planning/ROADMAP.md` — Phase 2 目标、成功标准与 `02-01 ~ 02-02` 的计划拆分
- `.planning/STATE.md` — 当前主线已经完成 Phase 1，Phase 2 为当前焦点

### Topic research and factual boundary
- `docs/research/feishu-cli-video-research-2026-03-29.md` — 飞书 CLI / OpenAPI MCP 的推文、官方文档、官方仓库与示例汇总，以及视频口径边界

### Existing contracts and reference packaging
- `src/shared/video-brief.ts` — 已定义的 hook / proof / cover / feed contract，后续 manifest 需要与其配套
- `src/shared/video-registry.ts` — 现有 composition / still / platform registry 入口
- `src/shared/render-contract.ts` — Root / API / renderer 间当前共享的渲染合同

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/generate-voiceover-*.ts` — 已存在多条视频各自独立的 voiceover 生成脚本
- `scripts/sync-subtitle-*.ts` — 已存在多条视频各自独立的字幕同步脚本
- `src/data/*.json` — 当前字幕数据已在文件层存在，可作为 manifest 的回填目标
- `src/components/KaraokeSubtitle.tsx` — 当前字幕展示组件已稳定存在

### Established Patterns
- 新视频当前仍采用“每条视频一套 generate + sync + render 命令”的模式
- `src/compositions/catalog.ts` 与 `src/shared/video-registry.ts` 已统一 composition / still 发现，但媒体时序元数据还没统一
- `src/Root.tsx` 仍保存很多人工回填的时长与默认 props 信息

### Integration Points
- `package.json` — 统一命令入口的首要落点
- `scripts/generate-voiceover.ts` 与 `scripts/sync-subtitle.ts` — 可作为 Phase 2 抽象的潜在基础入口
- `src/Root.tsx` — 需要逐步减少对人工时长回填的依赖
- `src/server/services/renderer.ts` 与 `src/server/routes/render.ts` — preflight QA 的自然接入点

</code_context>

<specifics>
## Specific Ideas

- “飞书 CLI”这条视频建议采用 7 场景结构：
  - Hook：AI 不只是聊天，已经开始接管飞书里的真实工作
  - Positioning：飞书不是多一个 AI 功能，而是在变成 Agent 工作入口
  - Proof 1：本地内容 / Markdown → 飞书文档
  - Proof 2：一句话安排日程 → 查忙闲 → 建会议
  - Proof 3：文档 / 数据 → 多维表格 / 仪表盘
  - Nuance：远程官方口径仍保守，本地 OpenAPI MCP/CLI 更接近“广覆盖”
  - CTA：未来竞争不是谁更会聊，而是谁能让 Agent 真做事
- 对 Phase 2 来说，这条视频的价值在于它会天然压测：
  - 多段音频
  - 多场景字幕
  - 真实时长回填
  - cover + main video 双输出

</specifics>

<deferred>
## Deferred Ideas

- 在 Phase 2 同时做“飞书 CLI”视频的最终完整成片交付 — 这取决于计划拆分，不在讨论阶段锁死
- 给 manifest 增加“事实引用逐 scene 校验”能力 — 这更像后续 factual QA / publishing QA，不属于本 phase 成功标准
- 把所有历史视频一次性迁移到新 manifest 体系 — 更适合分 wave 渐进接入

</deferred>

---

*Phase: 02-media-manifest-qa*
*Context gathered: 2026-03-29*
