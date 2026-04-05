# 2026-04-05 调研结论视频化计划（ECC 技能）

## 目标

- 把前序关于 “Codex 插件进入 Claude Code” 的深度调研结论，结合 ECC 的方法论与能力结构，制作成一支竖屏短视频。
- 交付完整视频资产：composition、封面、配音、字幕、发布文案。
- 跑完类型检查、测试、媒体预检与视频渲染，确保能直接使用。

## 完成标准

- 新视频已接入 `src/compositions/`、`src/Root.tsx`、导出脚本和注册清单。
- 已生成 7 段配音、字幕 JSON、封面 PNG 和主视频 MP4。
- 已生成对应发布文案文件。
- `npm run typecheck`、`npm test`、媒体预检和目标渲染命令均通过。

## 阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 1 | 读取 ECC 相关技能与现有视频模板 | 已完成 |
| 2 | 设计叙事结构并创建新视频 composition | 已完成 |
| 3 | 生成配音、同步字幕、回填真实时长 | 已完成 |
| 4 | 运行验证、渲染并整理发布文案 | 已完成 |

# 2026-04-05 公众号主题深度调研计划

## 目标

- 读取用户提供的公众号文章，提炼核心主题、关键论点和待验证问题。
- 从 Twitter、YouTube 以及其他公开渠道补充相关研究资料、观点、数据和案例。
- 输出一份带来源的深度调研摘要，区分事实、推断和建议。

## 完成标准

- 已获取并概括公众号文章的主要内容。
- 已覆盖至少 3 类外部渠道，其中必须包含 Twitter 和 YouTube。
- 关键判断均有来源支撑，过时信息会单独标注。
- 最终结论能帮助用户快速理解该主题的现实进展、争议点和后续关注方向。

## 阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 1 | 读取现有计划与上下文，避免覆盖旧任务记录 | 已完成 |
| 2 | 获取公众号文章正文并提炼核心主题 | 进行中 |
| 3 | 检索 Twitter、YouTube 与其他公开来源 | 待开始 |
| 4 | 汇总证据，形成深度调研输出 | 待开始 |

## 风险与应对

- 公众号页面可能存在抓取限制：优先尝试直接抓取，失败时改用搜索缓存和转载渠道交叉还原。
- 社交平台观点噪音较大：优先引用作者本人、官方账号、演讲、技术文档与高质量媒体采访。
- 某些数字可能已过时：统一标注时间，并尽量补最近 6-12 个月的更新材料。

# 视觉升级 + 动画统一 实施计划

## 现状诊断

### 动画系统碎片化
- 7 个文件各自维护 `animations.ts`，核心函数重复 80%+
- 6 个竖屏共享的函数：`fadeInUp`, `fadeIn`, `scaleIn`, `glitchOffset`, `numberCountUp`, `staggerDelay`, `cardSlideIn`
- **签名冲突**：`progressBar` 参数顺序不同（OpenClaw 系 vs PuaSkill 系）；`pulseGlow` 默认 speed 不同
- `TextPresentation` 的 `fadeInUp/fadeIn` 签名完全不兼容（多一个 `startFrame` 参数）

### 视觉效果单一
- 所有背景：纯 CSS `radial-gradient` + `repeating-linear-gradient` 扫描线
- 装饰：4 角 HUD 边框 + emoji `drop-shadow`，4 个竖屏视频几乎一模一样
- **零粒子、零 3D、零高级光效**
- 唯一差异：OpenClawAI 有警告色闪烁，其他 4 个竖屏共享同一套模板

---

## 阶段一：动画统一（预计工作量：中）

### 1.1 创建共享动画库
**文件**: `src/shared/animations.ts`

导出所有已验证的通用动画函数，统一签名：

```
fadeInUp(frame, fps, delay=0, distance=60)
fadeIn(frame, delay=0, duration=15)
fadeOut(frame, totalFrames, duration=10)
scaleIn(frame, fps, delay=0)
slideFromLeft(frame, fps, delay=0, width=1080)
slideFromRight(frame, fps, delay=0, width=1080)
glitchOffset(frame, intensity=1)
scanLineOpacity(frame, y, speed=2)
typewriterLength(frame, text, fps, delay=0, charsPerSecond=18)
numberCountUp(frame, fps, target, durationSec=2, delay=0)
pulseGlow(frame, fps, speed=1)          ← 统一默认值为 1
progressBar(frame, fps, durationSec=3, delay=0)  ← 统一返回 [0, 100]
staggerDelay(index, baseDelay=8)
cardSlideIn(frame, fps, delay=0)
shimmer(frame, fps, delay=0)
```

### 1.2 创建竖屏专用动画扩展
**文件**: `src/shared/animations-vertical.ts`

导出竖屏视频特有的动画（re-export 通用库 + 扩展）：
```
pipelineNodeReveal(frame, fps, index, baseDelay=0)
lineGrow(frame, fps, delay=0, durationSec=0.4)
chatBubbleIn(frame, fps, delay=0)
pressureReveal(frame, fps, index, baseDelay=0)
shakeEffect(frame, intensity=1)
nodeReveal(frame, fps, index, baseDelay=0)
pipelineGrow(frame, fps, index, baseDelay=0)
loopRotate(frame, fps, index, total, baseDelay=0)
```

### 1.3 迁移各 composition
- 将每个 composition 的 `animations.ts` 改为 re-export from shared
- 保留 composition 特有的函数在本地文件中
- 修复 `progressBar` 调用方（PuaSkill/AgencyAgents/AutoResearch 的参数顺序需要调整）
- 修复 `pulseGlow` 调用方（PuaSkill/AgencyAgents/AutoResearch 传 speed 显式值替代依赖默认值）

### 1.4 TextPresentation 兼容
- 保留其独有的 `fadeInUp(frame, startFrame, fps, delay)` 签名不动
- 只在其文件中标注 `@deprecated` 注释，新视频不使用此签名

---

## 阶段二：视觉升级（预计工作量：大）

### 2.1 粒子背景系统
**文件**: `src/components/ParticleBackground.tsx`

React + Remotion 纯组件实现（无 canvas，确保 Remotion 渲染兼容）：
- **浮动光点**：20-40 个小圆点，使用 `interpolate` + 正弦函数缓慢移动
- **连线网络**（可选）：距离小于阈值的光点之间画线
- **颜色继承**：从 composition 的 `accentColor` 派生
- 参数：`particleCount`, `speed`, `color`, `opacity`, `connectLines`

### 2.2 光晕脉冲系统
**文件**: `src/components/GlowOrb.tsx`

替代当前的 `radial-gradient` 静态光晕：
- 使用 `spring()` 驱动的呼吸动画
- 支持多光源叠加
- 参数：`color`, `x`, `y`, `radius`, `pulseSpeed`, `opacity`

### 2.3 HUD 边框升级
**文件**: `src/components/HudFrame.tsx`

将 4 角 HUD 从内联样式抽为组件：
- 支持 **扫描动画**（光线沿边框移动）
- 支持 **呼吸闪烁**
- 参数：`color`, `cornerSize`, `strokeWidth`, `animationType: "pulse" | "scan" | "static"`

### 2.4 数据流/能量线效果
**文件**: `src/components/DataStream.tsx`

垂直/水平方向的数据流动画：
- 小光点沿固定路径流动
- 用于场景间转场或背景装饰
- 参数：`direction: "vertical" | "horizontal"`, `color`, `density`, `speed`

### 2.5 升级后的场景背景模板
**文件**: `src/components/SceneBackground.tsx`

组合以上组件的 **一体化背景**：
```tsx
<SceneBackground
  backgroundColor="#070810"
  accentColor="#8b5cf6"
  particles={{ count: 30, speed: 0.5 }}
  glow={{ orbs: [{ x: "50%", y: "40%", color: accentColor }] }}
  scanlines={true}
  hud={{ cornerSize: 60, animation: "scan" }}
/>
```

---

## 阶段三：补齐基建（预计工作量：小）

### 3.1 封面 Still 标准化
- 给 OpenClawAI、ClawSkills、SuperPowers、PuaSkill、AgencyAgents 补上 `Cover.tsx`
- 在 `Root.tsx` 注册 Still
- 在 `package.json` 添加 render:*:cover scripts

### 3.2 渲染 API 修复
- `src/server/services/renderer.ts` 的 `getAvailableCompositions()` 改为从 bundle 动态获取

### 3.3 文档更新
- `AGENTS.md` 更新动画 API 文档（指向 shared 路径）
- `AGENTS.md` 更新视觉组件文档

---

## 执行顺序

| 步骤 | 内容 | 依赖 | 预估 |
|------|------|------|------|
| 1 | 创建 `src/shared/animations.ts` | 无 | 快 |
| 2 | 创建 `src/shared/animations-vertical.ts` | 步骤 1 | 快 |
| 3 | 迁移 6 个竖屏 composition 的 animations 引用 | 步骤 1-2 | 中 |
| 4 | `npm run typecheck` 验证 | 步骤 3 | 快 |
| 5 | 创建 `ParticleBackground` 组件 | 无 | 中 |
| 6 | 创建 `GlowOrb` 组件 | 无 | 快 |
| 7 | 创建 `HudFrame` 组件 | 无 | 快 |
| 8 | 创建 `SceneBackground` 组合组件 | 步骤 5-7 | 快 |
| 9 | 选一个 composition 试点替换背景 | 步骤 8 | 中 |
| 10 | 推广到其他 composition | 步骤 9 | 大 |
| 11 | 封面 Still 批量补齐 | 无 | 中 |
| 12 | 渲染 API 修复 | 无 | 快 |
| 13 | 文档更新 | 全部 | 快 |
| 14 | `npm run typecheck` + Studio 预览 | 全部 | 验证 |
