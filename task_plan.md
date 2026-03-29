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
