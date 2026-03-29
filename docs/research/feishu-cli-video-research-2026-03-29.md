# 飞书 CLI / OpenAPI MCP 视频调研摘要

**日期：** 2026-03-29  
**主题：** 基于 2026-03-28 推文与官方资料，确定“飞书 CLI”主题短视频的内容边界、传播角度与风险口径。

## 结论先行

- 这条视频最稳的主结论不是“飞书已经把所有能力都无差别开放给任何 Agent”，而是：
  - **飞书已经把官方 OpenAPI MCP / CLI 做成了可被本地 AI Agent 接入的工作入口，文档、消息、多维表格、日历、任务等协作能力开始真正进入 Agent 工作流。**
- 如果要做面向泛 AI 用户的传播视频，最佳角度不是“安装教程”，而是：
  - **飞书正在成为国内最适合 AI Agent 落地协作工作的入口。**
- 视频里必须明确区分两层口径：
  - **推文与本地工具层：** 能力面广，适合展示“Agent 直接操飞书工作流”。
  - **官方远程 MCP 文档层：** 当前公开口径更保守，明确写的是先支持 Docs 场景，更多场景后续开放。

## 推文核心信息

2026-03-28，[@op7418](https://x.com/op7418/status/2037838579372896631) 发布关于“飞书开源 CLI 工具”的推文。推文主张主要包括：

- 任何本地 AI Agent 产品都可以调用飞书能力。
- 典型场景包括：
  - 创建和美化飞书文档
  - 查看和编辑日历
  - 创建和管理群消息
  - 创建多维表格与看板
  - 处理任务、云空间、聊天与群管理
- 作者特别强调了几个“Agent 友好”点：
  - JSON 输出
  - Dry Run
  - 快速授权登录
  - 本地工具可直接接入

## 官方资料确认到的内容

### 1. 官方仓库确认：这是飞书官方 OpenAPI MCP 工具

飞书官方仓库 [`larksuite/lark-openapi-mcp`](https://github.com/larksuite/lark-openapi-mcp) README 明确写明：

- 这是 **飞书/Lark 官方 OpenAPI MCP 工具**
- 用于让 AI 助手直接调用飞书开放平台接口
- 支持以应用身份或用户身份调用
- 可在 Trae、Cursor、Claude 等 AI 工具中集成

CLI 参考文档显示，它包含以下核心命令与参数：

- `login`
- `logout`
- `mcp`
- `--oauth`
- `--token-mode`
- `-t` 指定启用工具集
- `-m` 选择 `stdio / streamable / sse`

这说明推文所说的“CLI 工具”并不是纯概念，而是有明确命令行入口与 MCP 服务模式的正式工具。

### 2. 官方文档确认：远程模式与本地模式要分开讲

飞书开放平台 MCP 概览文档（最后更新于 2026-01-19）明确区分了两种模式：

- **远程调用模式（推荐）**
  - 当前公开口径先支持 **Docs**
  - 官方写明更多场景会继续开放
- **本地调用模式（不推荐，但能力更广）**
  - 支持飞书服务端 OpenAPI 能力
  - 由开发者自行部署飞书 MCP 服务

这意味着：

- 如果视频讲“已经官方支持一切远程场景”，会过界。
- 如果视频讲“本地 Agent 通过官方 OpenAPI MCP/CLI 接进飞书工作流，并且能力覆盖面已经非常广”，这是更稳的说法。

### 3. 官方预设与工具列表确认：至少文档、IM、多维表格、任务、日历已明确在工具面上出现

官方预设工具集文档显示，`preset.default` 和其他预设已经覆盖：

- 文档
- 消息 / 群聊
- 多维表格
- 任务
- 日历

官方完整工具列表则显示，`lark-mcp` 并不只是 Docs demo，而是映射了大量 OpenAPI 业务域。

因此，视频里的“能力面很广”可以讲，但表述应更像：

- **官方 MCP/CLI 已经具备非常宽的工具覆盖面**

而不是：

- “所有能力都已经零门槛稳定开放”

## 官方资料暴露出的限制与风险

这些点适合放进脚本的“理性校正”层，避免像纯宣传片：

- 当前官方 FAQ 明确提到：
  - 默认工具太多时，AI 工具可能因上下文限制找不到工具
  - 需要通过 `-t` 精简工具集
  - 某些场景需要明确使用 `user_access_token`
  - 文件 / 图片上传下载当前不支持
  - 直接在终端执行 `lark-mcp` 默认无输出，因为是 STDIO 模式
- 官方 README 也明确写了：
  - **云文档直接编辑暂不支持，仅支持导入和读取**
  - **文件上传下载暂不支持**

所以视频最好的做法不是只讲“无敌”，而是讲：

- **飞书在 Agent 接入这件事上已经领先，但要想跑顺，依然需要理解 token、preset 和调用边界。**

## 最适合短视频的证据链

面向泛 AI 用户时，最有传播力的不是参数表，而是三个“工作真的被接管”的瞬间：

### 证据 1：Markdown / 资料 → 飞书文档

价值点：

- 用户能直观理解“AI 不只是回答问题，而是在替你产出协作文档”
- 与官方 Docs 场景公开口径一致，风险最低

### 证据 2：一句话安排日程 → 查忙闲 → 建会议

价值点：

- 能直观体现“Agent 不再停在聊天，而是开始处理真实协作动作”
- 适合做强 opening proof

风险提醒：

- 需要在口径上强调这是基于开放能力与用户授权完成，不要说成“默认全自动无条件可用”

### 证据 3：文档 / 数据 → 多维表格 / 看板

价值点：

- 这是最能体现飞书和一般聊天工具差异的地方
- “数据协作 + 看板”很适合做视觉高潮

## 推荐视频方向

### 推荐定位

**飞书不是又做了一个 AI 功能，而是在把自己变成 AI Agent 的协作入口。**

### 推荐受众

**泛 AI 用户**

原因：

- 它比“开发者教程”覆盖面更大
- 也比“飞书办公技巧”更有观点价值
- 适合视频号的 feed 场景

### 推荐结构

1. Hook：AI 现在不只会聊天，已经开始接管飞书里的真实工作
2. 结论：飞书正在成为国内最适合 Agent 落地协作工作的入口
3. Proof 1：文档
4. Proof 2：日历 / 忙闲
5. Proof 3：多维表格 / 看板
6. 校正：远程官方口径仍偏保守，但本地 OpenAPI MCP/CLI 已经很强
7. CTA：真正的竞争不再是“谁更会聊天”，而是谁能让 Agent 真做事

## 不建议采用的方向

- **纯安装教程**
  - 信息密度高，但传播性差
- **纯参数评测**
  - 适合长文，不适合视频号短视频
- **无保留吹成“全能力官方一键可用”**
  - 容易被官方文档反证

## 对本仓库视频制作的直接影响

- 这条视频必须是 **结果导向 opening**
  - 前 1 到 2 秒直接打“AI 开始接管飞书工作了”
- 必须使用 **多视觉模块轮换**
  - 文档界面
  - 日历 / 忙闲网格
  - 多维表格 / 看板
  - CLI / MCP / 授权桥接层
- 旁白中应避免高风险绝对化表述：
  - 避免“全部都完全开放了”
  - 改为“官方 OpenAPI MCP/CLI 已经把大量协作能力接进本地 Agent 工作流”

## 主要来源

- 推文：[@op7418 on X](https://x.com/i/status/2037838579372896631)
- 官方仓库：[larksuite/lark-openapi-mcp](https://github.com/larksuite/lark-openapi-mcp)
- 官方 README（中文）：[README_ZH.md](https://github.com/larksuite/lark-openapi-mcp/blob/main/README_ZH.md)
- 官方 CLI 参考：[cli.md](https://github.com/larksuite/lark-openapi-mcp/blob/main/docs/reference/cli/cli.md)
- 官方工具预设文档：[presets-zh.md](https://github.com/larksuite/lark-openapi-mcp/blob/main/docs/reference/tool-presets/presets-zh.md)
- 官方工具列表：[tools-zh.md](https://github.com/larksuite/lark-openapi-mcp/blob/main/docs/reference/tool-presets/tools-zh.md)
- 官方 MCP 概览：[MCP overview](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mcp_integration/mcp_introduction)
- 官方 FAQ / 使用问题：[FAQs - MCP](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mcp_integration/use_cases)
- 官方示例仓库：[lark-samples/mcp_quick_demo](https://github.com/larksuite/lark-samples/tree/main/mcp_quick_demo)
