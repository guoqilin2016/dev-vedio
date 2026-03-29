# AI 技术短视频工厂

## What This Is

这是一个面向技术自媒体创作者的代码驱动短视频生产系统，服务于微信视频号、抖音、B 站、小红书、快手等平台上的 AI 编程与 AI 工具内容创作。当前仓库已经具备脚本、配音、字幕同步、Remotion 渲染的基础流水线；这一轮的目标是在现有能力上继续提升视频的吸引力、模板复用性，以及发布素材的完整度。

## Core Value

把 AI 技术热点文案快速转成高辨识度、信息密度高、能提升前三秒停留的短视频成品与发布素材。

## Requirements

### Validated

- ✓ 现有系统可以通过 Remotion Studio、CLI 和 Express API 渲染多个视频 composition（含横屏与竖屏）— existing
- ✓ 现有系统可以通过脚本生成 TTS 配音，并输出到 `public/audio/` 供成片复用 — existing
- ✓ 现有系统可以根据配音时长同步字幕并生成预计算字幕数据，支持字幕与旁白对齐 — existing
- ✓ 现有系统已经具备面向 AI / 开源项目解读的多场景视频模板能力，能够产出带背景音乐、字幕和转场的技术内容短视频 — existing
- ✓ 已建立结构化 `VideoBrief` 合同，能够统一表达 hook、proof、封面标题、短标题、短描述、CTA 与来源链接 — validated in Phase 1
- ✓ 已建立统一模板 registry，集中暴露 composition、cover still、输出路径、safe area、subtitle mode 与视频号预算 — validated in Phase 1
- ✓ Render API 与 Root discoverability 已接到共享合同，`/api/render/compositions` 能返回结构化模板元数据 — validated in Phase 1

### Active

- [x] 本次项目已手动收口，当前不再推进原 roadmap 中的后续 phase
- [x] 已交付多条完整技术短视频样本，并验证“调研 → 文案 → 配音 → 字幕 → 渲染”的主链路可稳定运行
- [x] 未完成的模板化与整包发布能力转为后续可重开事项，不再作为当前项目完成阻塞

### Out of Scope

- 自动抓取或批量解析推特/X 文案 — 本轮先使用人工筛选并粘贴文案，避免采集链路分散注意力
- 自动发布到视频号、抖音、B 站、小红书、快手 — 本轮先聚焦内容生成与包装，不直接接入发布链路
- 为每个平台生成完全独立的标题、描述、封面策略 — v1 先产出统一版本，后续再考虑平台化细分

## Context

- 当前项目是 brownfield 代码库，已完成 codebase mapping，参考 `.planning/codebase/` 下的架构、栈、规范、测试与风险文档
- 当前系统已形成基础生产流水线：`脚本/文案 -> TTS -> 字幕同步 -> Remotion 渲染`
- 现有 composition 以 AI 编程、AI 工具、开源项目解读为主题，风格偏科技感、信息密度高、字幕和旁白强绑定
- 当前视觉资产多数基于 CSS、渐变、emoji 与自定义 scene 组件实现，存在“能用但不够惊艳”的问题
- 多个 composition 已形成 7 场景竖屏模式，但模板化程度不足，新增视频仍偏复制式开发
- 用户核心场景是高频生产技术内容短视频，希望把传统 3 到 5 小时的视频制作流程压缩到 30 分钟内出片
- 当前用户最看重的成效不是平台自动化，而是视频本身更抓人，尤其是前三秒停留、封面与首屏钩子的吸引力

## Constraints

- **Tech stack**: 继续基于 Remotion + TypeScript + Express 现有架构演进 — 现有代码、模板和渲染流程已经建立，重写成本高
- **Brownfield**: 需要在现有 composition 和脚本体系上渐进式重构 — 不能为了模板化破坏已能出片的流程
- **Input model**: v1 文案输入采用人工筛选后粘贴 — 这是当前最小可行输入方式，能保持实现聚焦
- **Packaging**: v1 先输出统一版标题、描述、封面 — 先保证素材完整，再考虑平台差异化
- **Success metric**: 本轮优先优化前三秒停留而非自动发布链路 — 要先把“点进来愿不愿意继续看”做到位
- **Quality**: 成片需要保证字幕与旁白一致、背景音乐清晰、封面可用、标题不超过 16 字、类型检查为零错误 — 这是用户定义的完成标准

## Current State

- 主项目已于 2026-03-29 按请求手动标记为完成
- Phase 1 与 Phase 2 已实际完成；Phase 3 与 Phase 4 以 administrative close 收口，不继续执行
- 当前仓库保留为可继续迭代的视频生产底座，但不再视为本轮未完成项目

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 先用人工粘贴推特/X 文案作为输入 | 先聚焦视频质量与生产链路，不把范围扩展到采集系统 | — Pending |
| 本轮优先优化前三秒停留 | 当前最核心目标是让视频更吸引用户，而不是先做更深的自动化 | — Pending |
| 发布素材先输出统一版标题、描述、封面 | 先建立稳定产出标准，再考虑平台差异化变体 | — Pending |
| 本轮不做自动发布 | 发布链路不是当前最高杠杆点，避免项目范围失控 | — Pending |
| 以模板化和共享动画收敛现有 composition 分叉 | 这是让后续高频出片可持续的基础能力 | — Pending |

---
*Last updated: 2026-03-29 after project closure*
