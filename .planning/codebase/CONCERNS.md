# Codebase Concerns

**Analysis Date:** 2026-03-21

## Tech Debt

**Composition registry drift:**
- Issue: `src/server/services/renderer.ts` 只硬编码返回 `HelloWorld` 和 `TextPresentation`，但 `src/Root.tsx` 实际注册了 `HelloWorld`、`TextPresentation`、`NitrogenAI`、`OpenClawAI`、`ClawSkills`、`SuperPowers`、`PuaSkill`、`AgencyAgents`、`AutoResearch`。
- Files: `src/server/services/renderer.ts`, `src/Root.tsx`
- Impact: API 能力和实际 Remotion 入口失配，新增 composition 时需要同时改两处，且很容易漏改。
- Fix approach: 把 composition 注册信息抽成共享注册表，或在 `src/server/services/renderer.ts` 中直接通过 Remotion introspection 获取可用列表。

**根注册文件过于庞大且手工维护成本高:**
- Issue: `src/Root.tsx` 当前 846 行，内联了所有 composition 的 `defaultProps`、字幕数据、音频文件、场景时长和配色。
- Files: `src/Root.tsx`
- Impact: 任意一个视频配置变更都会放大 review 面积和合并冲突概率，局部改动也容易影响其他 composition。
- Fix approach: 为每个 composition 建独立注册配置模块，只在 `src/Root.tsx` 组装 `<Composition />` 列表。

**配音与字幕脚本高度重复:**
- Issue: 8 个配音脚本和 8 个字幕同步脚本重复了目录创建、音频遍历、`edge-tts` 调用、`music-metadata` 解析和输出逻辑。
- Files: `scripts/generate-voiceover.ts`, `scripts/generate-voiceover-openclaw.ts`, `scripts/generate-voiceover-clawskills.ts`, `scripts/generate-voiceover-superpowers.ts`, `scripts/generate-voiceover-puaskill.ts`, `scripts/generate-voiceover-agencyagents.ts`, `scripts/generate-voiceover-autoresearch.ts`, `scripts/generate-voiceover-nitrogen.ts`, `scripts/sync-subtitle.ts`, `scripts/sync-subtitle-openclaw.ts`, `scripts/sync-subtitle-clawskills.ts`, `scripts/sync-subtitle-superpowers.ts`, `scripts/sync-subtitle-puaskill.ts`, `scripts/sync-subtitle-agencyagents.ts`, `scripts/sync-subtitle-autoresearch.ts`, `scripts/sync-subtitle-nitrogen.ts`
- Impact: 同一个 bug 或流程调整需要复制到 16 个文件，脚本行为会逐步漂移。
- Fix approach: 抽出共享库到 `scripts/` 下的公共模块，单个视频脚本只保留脚本内容和文件名配置。

**TTS API 宣称支持的 provider 多于实际实现:**
- Issue: `src/server/routes/tts.ts` 接受 `edge-tts`、`openai`、`azure`、`custom`，但 `src/server/services/tts.ts` 只实现了 `edge-tts`，其余 provider 返回未实现错误。
- Files: `src/server/routes/tts.ts`, `src/server/services/tts.ts`
- Impact: API 合同误导调用方，集成方无法从 schema 判断真实可用能力。
- Fix approach: 缩小 schema 到已实现 provider，或者补齐 `openai`、`azure`、`custom` 分支。

**文档质量要求与仓库实际工具链不一致:**
- Issue: `AGENTS.md` 要求编译检查、单元测试通过、覆盖率 ≥90%，但 `package.json` 只有 `typecheck`，未提供测试脚本、覆盖率脚本或 lint 脚本。
- Files: `AGENTS.md`, `package.json`
- Impact: 质量门禁只能停留在文档层面，无法通过命令或 CI 强制执行。
- Fix approach: 增加测试与 lint 工具链并写回 `package.json`，或者收敛 `AGENTS.md` 到仓库真实能力。

**生成产物与源码/版本资产混放:**
- Issue: 生成音频位于 `public/audio`，生成字幕 JSON 位于 `src/data`；其中一部分已提交，另一部分当前处于未跟踪状态。
- Files: `public/audio`, `src/data`, `package.json`
- Impact: 工作区容易长期变脏，不同开发机之间的资源基线不一致，渲染问题难以复现。
- Fix approach: 为生成物建立统一策略，要么全部改为可重建且不提交，要么明确提交规则并提供同步脚本。

## Known Bugs

**数字人和 HeyGen 返回的 `videoUrl` 与静态目录不匹配:**
- Symptoms: `src/server/services/digital-human.ts` 和 `src/server/services/heygen.ts` 将文件写入 `public/videos`，却返回 `/videos/<file>`；`src/server/index.ts` 又把 `/videos` 静态映射到 `out`。
- Files: `src/server/index.ts`, `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`
- Trigger: 调用 `/api/digital-human` 或 `/api/heygen` 后直接访问响应中的 `videoUrl`。
- Workaround: 目前只能依赖返回的 `videoPath` 手动从磁盘取文件，或自行把文件挪到 `out`；API 返回的 URL 不能直接作为下载地址使用。

**渲染 API 会拒绝大部分已注册的 composition:**
- Symptoms: `/api/render` 在真正渲染前会先校验 composition 是否在 `getAvailableCompositions()` 返回列表中，而该列表当前只包含两个 ID。
- Files: `src/server/routes/render.ts`, `src/server/services/renderer.ts`, `src/Root.tsx`
- Trigger: 用 API 请求 `NitrogenAI`、`OpenClawAI`、`ClawSkills`、`SuperPowers`、`PuaSkill`、`AgencyAgents` 或 `AutoResearch`。
- Workaround: 只能绕过 API，直接使用 `package.json` 中的 CLI 渲染脚本。

## Security Considerations

**TTS 路由存在 shell 注入面:**
- Risk: `src/server/services/tts.ts` 将请求体里的 `text`、`voice` 和输出路径拼成 shell 字符串后交给 `execSync` 执行。
- Files: `src/server/routes/tts.ts`, `src/server/services/tts.ts`
- Current mitigation: 只对 `text` 中的双引号做了转义；没有移除 shell 命令替换和其他元字符，也没有对白名单 voice 做限制。
- Recommendations: 改用 `spawn`/`execFile` 传参，限制 `voice` 为固定列表，并拒绝带路径分隔符的文件名。

**存在路径穿越与任意文件读写风险:**
- Risk: `outputFileName`、`audioPath`、`audioFiles` 都直接参与 `path.join()`，没有做 `..`、绝对路径或 basename 校验。
- Files: `src/shared/types.ts`, `src/server/routes/digital-human.ts`, `src/server/routes/heygen.ts`, `src/server/routes/tts.ts`, `src/server/services/renderer.ts`, `src/server/services/tts.ts`, `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`
- Current mitigation: 输入文件只做了 `fs.existsSync()` 检查，输出文件没有限制必须留在目标目录内。
- Recommendations: 对所有输入/输出路径做标准化和根目录约束，拒绝绝对路径、`..` 和任意目录跳转。

**所有高成本接口默认无鉴权、无限流:**
- Risk: `src/server/index.ts` 只挂载了 `express.json()`，未检测到任何认证、中间件鉴权、速率限制或配额控制。
- Files: `src/server/index.ts`, `src/server/routes/render.ts`, `src/server/routes/tts.ts`, `src/server/routes/digital-human.ts`, `src/server/routes/heygen.ts`
- Current mitigation: Not detected.
- Recommendations: 至少为渲染、TTS、D-ID、HeyGen 路由增加认证、速率限制、审计日志和作业配额。

**API Key 允许通过 query/body 传入:**
- Risk: `/api/heygen/avatars` 支持通过 query string 传 `apiKey`，数字人相关路由也允许在请求体中传第三方密钥。
- Files: `src/server/routes/heygen.ts`, `src/server/routes/digital-human.ts`
- Current mitigation: 也支持从环境变量读取，但没有禁止 request 级别 secrets。
- Recommendations: 改为仅服务端环境变量或受控鉴权头，避免 query string 暴露敏感信息到日志、代理和浏览器历史。

## Performance Bottlenecks

**CPU 密集和阻塞式任务直接跑在 API 进程内:**
- Problem: Remotion 渲染和 TTS 生成都在请求生命周期内同步执行；TTS 还使用阻塞式 `execSync`。
- Files: `src/server/index.ts`, `src/server/services/renderer.ts`, `src/server/services/tts.ts`
- Cause: 没有作业队列、worker 进程或并发控制。
- Improvement path: 将渲染和 TTS 转成异步作业模型，使用独立 worker 处理，并给 API 返回 job ID。

**批量数字人任务完全串行:**
- Problem: `generateBatchDigitalHumanVideos()` 和 `generateBatchHeyGenVideos()` 一次只处理一个场景，并在任务间固定 sleep。
- Files: `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`
- Cause: `for` 循环串行执行，同时分别固定等待 2 秒和 5 秒。
- Improvement path: 把外部 API 调用改为可控并发，增加指数退避、取消和重试策略。

**生成产物缺少回收机制:**
- Problem: 渲染输出和音频文件持续写入本地目录，当前工作区 `out/` 已累积到 121M，`public/audio` 已累积到 4.1M。
- Files: `.gitignore`, `src/server/services/renderer.ts`, `src/server/services/tts.ts`, `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`, `public/audio`, `out`
- Cause: 未检测到清理脚本、保留策略或远程对象存储。
- Improvement path: 增加清理命令、TTL 策略或外部存储层，避免长期占满本地磁盘。

## Fragile Areas

**音频、字幕、时长依赖手工回写:**
- Files: `src/Root.tsx`, `scripts/sync-subtitle.ts`, `scripts/sync-subtitle-openclaw.ts`, `scripts/sync-subtitle-clawskills.ts`, `scripts/sync-subtitle-superpowers.ts`, `scripts/sync-subtitle-puaskill.ts`, `scripts/sync-subtitle-agencyagents.ts`, `scripts/sync-subtitle-autoresearch.ts`, `scripts/sync-subtitle-nitrogen.ts`
- Why fragile: 同步脚本输出的 `durationInFrames`、`sceneDurations` 和字幕 JSON 需要人工回填到 `src/Root.tsx`，漏改任意一项都会造成字幕或音频错位。
- Safe modification: 每次更新配音后都在同一个变更里同步执行字幕脚本、更新 `src/Root.tsx`、打开 Studio 预览并至少渲染一次目标 composition。
- Test coverage: 仓库内未检测到自动校验 `voiceoverAudioFiles`、`precomputedSubtitles`、`sceneDurations` 和 `durationInFrames` 一致性的测试。

**服务端静态目录与 Remotion 资源目录耦合松散:**
- Files: `src/server/index.ts`, `src/compositions/TextPresentation/index.tsx`, `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`
- Why fragile: API 下载路径和 Remotion `staticFile()` 使用的 `public/` 资源路径不是同一套契约，稍改一侧就会让另一侧失效。
- Safe modification: 先统一资源根目录、公开 URL 和 Remotion 引用格式，再调整数字人/视频叠加链路。
- Test coverage: 未检测到覆盖“生成资源 -> API 暴露 -> Remotion 消费”的集成测试。

## Scaling Limits

**渲染服务目前是单进程单节点模型:**
- Current capacity: `package.json` 通过 `tsx src/server/index.ts` 或 `tsx watch src/server/index.ts` 启动单个 Node 进程处理所有请求。
- Limit: 多个长时渲染、TTS、远程视频轮询会争用同一进程的 CPU 和内存，没有背压或排队机制。
- Scaling path: 把 API 层与 worker 层拆开，并为重任务引入持久化 job queue。

**远程视频下载采用整块读入内存:**
- Current capacity: `downloadVideo()` 在 `src/server/services/digital-human.ts` 和 `src/server/services/heygen.ts` 中都先 `arrayBuffer()` 再一次性写盘。
- Limit: 更大的视频或更高并发会直接抬高内存峰值和请求时长。
- Scaling path: 改为流式下载写盘，并把轮询状态持久化到后台任务。

## Dependencies at Risk

**Remotion 生态与 `zod` 版本不一致:**
- Risk: 运行 `npm run build` 时，Remotion 明确提示已安装 `zod` 为 `3.22.3`，而当前依赖解析要求 `4.3.6`。
- Impact: 目前构建虽然成功，但后续升级或渲染链路可能出现不稳定、难定位的错误。
- Migration plan: 对齐 `package.json` 中 Remotion 相关版本，并按 Remotion 提示固定兼容的 `zod` 版本。
- Files: `package.json`, `package-lock.json`

**TTS 依赖全局 Python CLI，而不是项目内依赖:**
- Risk: TTS 服务和所有配音脚本都假设系统已安装 `edge-tts`，但 `package.json` 没有声明这类运行时依赖。
- Impact: 在新机器、CI 或容器环境里，TTS 接口和脚本会直接失败。
- Migration plan: 把环境准备写入自动化 bootstrap，或替换为项目内可控的库/容器镜像。
- Files: `src/server/services/tts.ts`, `scripts/generate-voiceover.ts`, `scripts/generate-voiceover-openclaw.ts`, `scripts/generate-voiceover-clawskills.ts`, `scripts/generate-voiceover-superpowers.ts`, `scripts/generate-voiceover-puaskill.ts`, `scripts/generate-voiceover-agencyagents.ts`, `scripts/generate-voiceover-autoresearch.ts`, `scripts/generate-voiceover-nitrogen.ts`, `package.json`

## Missing Critical Features

**仓库内未检测到自动化测试体系:**
- Problem: 未检测到仓库自有的 `*.test.*`、`*.spec.*` 或 `__tests__` 目录，`package.json` 也没有 `test` 相关脚本。
- Blocks: 无法对渲染 API、字幕同步逻辑和第三方服务适配做稳定回归。

**未检测到 lint/format 质量门禁:**
- Problem: 未检测到仓库自有 ESLint、Prettier、Biome、Jest 或 Vitest 配置；`package.json` 也没有 lint 脚本。
- Blocks: 风格一致性、潜在错误和未使用代码只能靠人工 review。

**未检测到生成资源清理或归档命令:**
- Problem: `package.json` 没有清理 `out`、`public/audio`、`public/videos` 的命令，`.gitignore` 也只忽略了 `out/*.mp4` 一部分输出。
- Blocks: 长期运行后磁盘占用、工作区噪音和“哪份资源是权威版本”都难以管理。

## Test Coverage Gaps

**服务端 API 合同没有自动化保护:**
- What's not tested: `src/server/routes/render.ts`、`src/server/routes/tts.ts`、`src/server/routes/digital-human.ts`、`src/server/routes/heygen.ts` 的参数校验、错误归一化、URL 返回和 composition 校验逻辑。
- Files: `src/server/routes/render.ts`, `src/server/routes/tts.ts`, `src/server/routes/digital-human.ts`, `src/server/routes/heygen.ts`, `src/server/services/renderer.ts`, `src/server/services/tts.ts`, `src/server/services/digital-human.ts`, `src/server/services/heygen.ts`
- Risk: 破坏性改动会在上线后才暴露，尤其是 URL 契约和第三方服务错误处理。
- Priority: High

**字幕与音频同步链路没有回归校验:**
- What's not tested: `scripts/sync-subtitle-*.ts` 生成的字幕 JSON 与 `src/Root.tsx` 中音频文件、场景时长和总时长是否一致。
- Files: `src/Root.tsx`, `scripts/sync-subtitle.ts`, `scripts/sync-subtitle-openclaw.ts`, `scripts/sync-subtitle-clawskills.ts`, `scripts/sync-subtitle-superpowers.ts`, `scripts/sync-subtitle-puaskill.ts`, `scripts/sync-subtitle-agencyagents.ts`, `scripts/sync-subtitle-autoresearch.ts`, `scripts/sync-subtitle-nitrogen.ts`, `src/data`
- Risk: 字幕错位、配音截断或尾帧黑场只能在人工预览时发现。
- Priority: High

**Composition 可渲染性没有端到端检查:**
- What's not tested: `src/Root.tsx` 中每个 composition 是否都能通过 CLI/API 找到并用当前资源成功渲染。
- Files: `src/Root.tsx`, `src/compositions`, `src/server/services/renderer.ts`, `package.json`
- Risk: 新增 composition、资源缺失或注册漂移会在真正渲染时才暴露。
- Priority: High

---

*Concerns audit: 2026-03-21*
