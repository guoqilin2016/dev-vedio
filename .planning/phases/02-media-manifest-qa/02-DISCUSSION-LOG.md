# Phase 2: Media Manifest 与 QA 门禁 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** Media Manifest 与 QA 门禁
**Areas discussed:** 参考视频选题、主定位、受众、事实口径、Phase 2 验证方式

---

## 参考视频选题

| Option | Description | Selected |
|--------|-------------|----------|
| 继续只用旧视频做 Phase 2 验证 | 只在现有视频上收敛 manifest 和 QA，不新增 topic pressure | |
| 新增“飞书 CLI”参考视频 (Recommended) | 用外部资料驱动的新选题来验证 manifest / QA 是否能支撑真实新增视频 | ✓ |
| 直接并行做多个新 topic | 同时压多个题材，扩大验证面，但实现噪音更高 | |

**User's choice:** 采用推荐默认项 `新增“飞书 CLI”参考视频`。  
**Notes:** 这样能更真实地暴露当前媒体生产链路的问题，而不是只在旧成片上做局部修补。

---

## 主定位

| Option | Description | Selected |
|--------|-------------|----------|
| Agent 入口 | 强调飞书把 AI Agent 接进协作系统，适合观点型传播 | ✓ |
| 效率实操 | 强调文档、日历、多维表格等具体收益，偏结果演示 | |
| 开发者评测 | 强调 CLI、OAuth、token-mode、预设工具集等技术细节 | |

**User's choice:** 采用推荐默认项 `Agent 入口`。  
**Notes:** 这能兼顾传播性与外部资料可信度，也最贴合视频号的 feed 场景。

---

## 目标受众

| Option | Description | Selected |
|--------|-------------|----------|
| 泛 AI 用户 | 少讲术语，多讲“AI 真的开始替你做工作” | ✓ |
| 开发者 | 可以更强调 MCP、CLI 配置、授权与集成 | |
| 办公效率人群 | 更强调飞书日历、文档、表格、任务等办公动作 | |

**User's choice:** 采用推荐默认项 `泛 AI 用户`。  
**Notes:** 这意味着脚本需要减少 CLI 参数教学，多做工作结果 proof。

---

## 事实口径

| Option | Description | Selected |
|--------|-------------|----------|
| 按推文强结论直接讲 | 传播最猛，但容易越过官方公开文档边界 | |
| 推文 + 官方双层口径 (Recommended) | 讲清本地 OpenAPI MCP/CLI 与远程官方文档的边界差异 | ✓ |
| 只按官方最保守口径讲 | 风险最低，但会削弱视频冲击力 | |

**User's choice:** 结合外部资料核对后，采用推荐默认项 `推文 + 官方双层口径`。  
**Notes:** 这样既保留观点力度，也不把“本地能力广覆盖”误说成“远程模式全部官方公开支持”。

---

## Phase 2 的验证方式

| Option | Description | Selected |
|--------|-------------|----------|
| 只重构脚本，不绑定具体视频 | 更抽象，但难验证真实新增视频流程 | |
| 用飞书 CLI 视频做 manifest / QA 试金石 (Recommended) | 新 topic 直接走一遍 voiceover → subtitle → duration → preflight → render 链路 | ✓ |
| 先做完整模板运行时 | 超出本 phase 范围 | |

**User's choice:** 采用推荐默认项 `用飞书 CLI 视频做 manifest / QA 试金石`。  
**Notes:** 这不会把 Phase 2 扩大成模板抽象阶段，但能让后续计划直接围绕真实生产链路拆分。

## the agent's Discretion

- manifest 的目录结构、schema 命名和输出格式
- preflight QA 集成在 CLI、API 还是两侧同时支持
- 是否先让一个旧视频和一个新视频共同接入，证明兼容性

## Deferred Ideas

- 用这条视频直接顺手完成全套最终成片
- 做事实级逐场景引用校验
- 一次性迁移全部历史视频到新 manifest 体系
