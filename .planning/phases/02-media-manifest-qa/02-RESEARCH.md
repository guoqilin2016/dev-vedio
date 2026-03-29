# Phase 2: Media Manifest 与 QA 门禁 - Research

**Researched:** 2026-03-29
**Domain:** Remotion 短视频工厂中的媒体时序真相、统一 manifest 与预渲染 QA 门禁
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Phase 2 要以“飞书 CLI / OpenAPI MCP”作为新的 reference video 主题，作为 media manifest 与 QA gate 的验证样本。
- 这条视频的主定位固定为“飞书正在成为国内最适合 AI Agent 落地协作工作的入口”。
- 目标受众固定为泛 AI 用户，不做纯开发者教程。
- 视频默认采用“结论 + 证明”的 feed-first 叙事，而不是安装教程或参数评测。
- 旁白与包装文案必须明确区分本地 OpenAPI MCP / CLI 与官方远程 MCP 文档的边界。
- 前三个 proof 模块优先级固定为：文档导入 / 生成、日历忙闲 / 安排行程、多维表格 / 看板。
- Phase 2 的 media manifest 必须成为 reference video 的单一事实源，至少覆盖 composition id、still id、scene voiceover scripts、scene audio file paths、subtitle data path、scene durations、total duration / total frames、output targets。
- 系统必须提供统一命令生成 voiceover、字幕数据、scene durations 和总时长元数据，而不是继续靠脚本输出和人工复制。
- preflight QA 必须在 render 前阻断音频缺失、字幕缺失 / 为空、scene durations 与音频不一致、total frames 与 scene durations 汇总不一致，并给出定位式报错。

### the agent's Discretion
- manifest 的具体 schema、目录结构与 JSON 文件命名
- 统一命令是否采用“通用核心 + topic wrapper”
- preflight QA 是只在 CLI 可用，还是同时接入 API render 入口
- 是否先拿一个旧视频做兼容样本，再让飞书 CLI topic 成为新增样本

### Deferred Ideas (OUT OF SCOPE)
- 在 Phase 2 直接完成飞书 CLI 视频的最终成片
- 做逐 scene 的事实引用校验
- 一次性迁移全部历史视频

</user_constraints>

<research_summary>
## Summary

Phase 2 最稳的技术路径是把当前“每条视频一个 generate 脚本 + 一个 sync 脚本 + Root 手填 durations”的松散流程，收敛成 **source file → media manifest → preflight QA → render** 的四段式链路。  

现有代码已经具备 3 个关键基础：

1. `video-registry` 与 `catalog` 已经统一了 composition / still / output 的发现合同。
2. `music-metadata` 已经在同步脚本里被验证可用于读取真实音频时长。
3. `renderVideo()` / `/api/render` 已经是天然的 preflight 注入点。

因此 Phase 2 不需要先改模板运行时，也不需要先让 `Root.tsx` 动态加载 manifest。更合理的顺序是：

- 先定义一个 **typed media manifest**，统一描述场景脚本、音频、字幕和时长真相。
- 再提供 **统一 builder 命令**，负责生成 / 回填这些元数据。
- 最后在 render 前加入 **preflight QA gate**，如果 catalog / Root 里的时长还没跟 manifest 对齐，就明确阻断，而不是继续渲染错误视频。

这条路径直接满足 `MEDIA-01/02/03`，同时不越界到 Phase 3 的模板运行时重构。

**Primary recommendation:** Phase 2 使用“shared manifest schema + generic build-media-manifest command + shared preflight validator + render/API gate”方案，先让新增 topic 与旧视频都能被相同的媒体真相机制约束。
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | current project `3.22.3` | 定义 manifest 与 preflight 结果合同 | 当前项目已用它统一 brief / registry / render contract |
| `music-metadata` | current project `11.11.1` | 读取真实音频时长 | 已在多个字幕同步脚本中被验证可用 |
| `tsx` | current project scripts already use it | 运行 Node/TS 脚本 | 当前脚本体系已采用 `tsx` |
| `vitest` | already installed in Phase 1 | 校验 manifest / QA 逻辑 | 适合 shared contract 层的快速反馈 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@remotion/renderer` | current project | 渲染前选择 composition 与读取 catalog duration | 供 preflight 对比 runtime registration 与 manifest |
| `express` | current project `5.2.1` | 在 API render 前挂载 QA gate | 保持 CLI 与 API 一致行为 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| JSON manifest 文件 | 继续让 sync 脚本只打印日志，再手改 `Root.tsx` | 无法形成 machine-readable 的单一真相源 |
| Render 时静默 warning | 只在 CLI 输出提醒 | 不满足 MEDIA-03，错误会继续流入成片 |
| 一次性改所有 topic | 先兼容一个旧视频 + 一个新增 topic | 更符合 brownfield 约束，能逐步推广 |

</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Source Descriptor → Media Manifest
**What:** 将“这条视频有哪些 voiceover script、期望输出到哪里、scene 数量是多少”整理成 source descriptor，再由 builder 读取音频与字幕，输出 manifest JSON。  
**When to use:** 需要统一生成音频路径、字幕路径、scene durations 和 total frames。  
**Example target shape:**
```typescript
const MediaManifestSchema = z.object({
  compositionId: z.string(),
  stillId: z.string().nullable(),
  sceneCount: z.number().int().positive(),
  sceneDurations: z.array(z.number().int().positive()),
  totalDurationInFrames: z.number().int().positive(),
  audioFiles: z.array(z.string()),
  subtitleDataFile: z.string(),
  output: z.object({
    video: z.string(),
    cover: z.string().nullable(),
  }),
});
```

### Pattern 2: Generic Builder With Topic Wrappers
**What:** 核心 builder 逻辑放在共享脚本里，topic-specific npm scripts 只负责传入 composition/topic id。  
**When to use:** 当前仓库已有大量 `generate-voiceover-*`、`sync-subtitle-*` 脚本，不适合一次性删掉。  
**Recommendation:** Phase 2 新增一个 `build-media-manifest.ts` 通用入口，再为旧视频和新 topic 提供轻量 wrapper 命令。

### Pattern 3: Preflight As Hard Gate
**What:** 在正式 render 前执行统一的 manifest 校验，不通过就直接返回失败。  
**When to use:** 当 `Root.tsx` / `catalog` 仍保留人工 durations 时，必须在 render 前拦住漂移。  
**Check set:**
- audio file exists
- subtitle JSON exists and non-empty
- sceneDurations length matches scene count
- sceneDurations approximately match audio durations + agreed buffer rule
- totalDurationInFrames equals sum(sceneDurations)
- catalog duration equals manifest totalDurationInFrames

### Anti-Patterns to Avoid
- **Print-only sync:** 脚本只在终端输出 `durationInFrames`，但不写 manifest 文件。
- **QA as warning:** 检查发现不一致后仅 `console.warn()`，继续 render。
- **Per-topic schema drift:** 每条视频各自定义不同的 media JSON 结构。
- **Manifest owns visual props:** 在 Phase 2 让 manifest 去接管主题色、hook slot、scene card 文案，会越界到 Phase 3。

</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 音频时长读取 | 手写 ffprobe / shell parsing | `music-metadata` | 仓库已在 TS 环境中稳定使用 |
| 校验输出 shape | 自定义 loose object | `zod` manifest / issue schema | 更容易给出定位式报错 |
| topic 发现 | 手写数组再复制到脚本 | 复用 `video-registry` / `catalog` | Phase 1 已经统一了模板发现 |
| QA 集成 | 让 route 和 CLI 各自实现一套逻辑 | shared `preflight` module | 避免 API / CLI 报错行为再次漂移 |

</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Manifest 只存输出结果，不存生成前提
**What goes wrong:** JSON 里只有 `sceneDurations` 和 `totalFrames`，没有 `audioFiles`、`subtitleDataFile`、scene count。  
**Why it happens:** 只把 manifest 当最终数字快照。  
**How to avoid:** 让 manifest 同时记录输入依赖和输出结果。

### Pitfall 2: QA 不校验 catalog / Root 的 duration 漂移
**What goes wrong:** manifest 是对的，但 `catalog.ts` / `Root.tsx` 还是旧数字，render 出来的成片仍会错。  
**Why it happens:** 只检查文件存在，不检查 runtime duration。  
**How to avoid:** preflight 明确对比 `catalog durationInFrames` 与 `manifest totalDurationInFrames`。

### Pitfall 3: 一开始就迁移全部旧视频
**What goes wrong:** Phase 2 任务面过大，执行时被历史差异拖住。  
**How to avoid:** 先选一个旧视频 + 一个新增 topic 做双样本验证。

### Pitfall 4: 把飞书 CLI 视频做成技术教程
**What goes wrong:** 传播性掉下去，还会把大量 Phase 2 精力浪费在参数与安装细节。  
**How to avoid:** Phase 2 只把它作为 reference media source，保持“结论 + proof”口径。

</common_pitfalls>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| 每条视频脚本输出一组日志，再人工抄回配置 | 把 media truth 写成可读 JSON / manifest | 更适合自动校验与 API 集成 |
| 只有 composition discoverability | composition + still + media manifest + preflight gate | 短视频工厂真正具备生产流水线属性 |
| QA 发生在 render 后 | QA 前置到 render 前 | 避免浪费渲染时间并减少错误成片 |

</sota_updates>

## Validation Architecture

### Recommended Validation Split

- **Wave 0 / shared contracts:** 为 manifest schema 和 preflight 逻辑补单元测试
- **Plan 02-01:** 用测试锁定 manifest 生成结果、scene count、duration 汇总、文件路径输出
- **Plan 02-02:** 用测试锁定 preflight issue shape 和 renderer / route 阻断行为

### Minimum Automated Checks

- `npx vitest run src/shared/media-manifest.test.ts`
- `npx vitest run src/shared/preflight-qa.test.ts`
- `npm run typecheck && npm run test`

### Required Manual Check

- 运行一次统一 manifest 生成命令，确认它真的写出 JSON 文件，而不是只打印到终端
- 在 manifest 与 catalog duration 人为制造不一致时，确认 render 被明确阻断

### Nyquist Verdict

Phase 2 适合设置为 `nyquist_compliant: true`，因为所有核心 requirement 都可映射到可执行的 contract test 或可重复的 preflight check。
