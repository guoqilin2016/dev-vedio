# Requirements: AI 技术短视频工厂

**Defined:** 2026-03-22
**Core Value:** 把 AI 技术热点文案快速转成高辨识度、信息密度高、能提升前三秒停留的短视频成品与发布素材。

## v1 Requirements

### Content Brief

- [x] **BRIEF-01**: 创作者可以为每条视频定义结构化 brief，至少包含主题、核心结论、关键事实、来源链接、CTA 和视觉主题
- [x] **BRIEF-02**: 创作者提交 brief 时，系统会校验关键字段完整性，拒绝缺少核心事实或来源的输入
- [x] **BRIEF-03**: 同一份 brief 可以同时驱动视频脚本、封面文案、标题和描述生成，避免不同产物各写各的

### Registry & Render Contract

- [x] **REG-01**: 创作者可以从统一注册表查看所有可用视频模板、封面 still、输出路径和模板类型
- [x] **REG-02**: 所有已注册 composition 都能通过同一套注册表被 CLI 和 API 正确发现与渲染
- [ ] **REG-03**: 创作者可以基于“模板 + brief”触发一次完整视频 package 生成，而不是分别手动维护多个入口

### Media Sync & QA

- [x] **MEDIA-01**: 创作者可以通过统一命令生成 voiceover、字幕数据、scene durations 和总时长元数据
- [x] **MEDIA-02**: 在正式渲染前，系统会自动检查音频文件、字幕覆盖、scene durations 和总帧数是否一致
- [x] **MEDIA-03**: 当媒体数据不一致或缺失时，系统会明确阻止渲染并给出可定位的问题说明

### Template & Hook

- [ ] **TEMP-01**: 创作者可以使用可复用的 7 场景竖屏模板生成技术短视频，而不需要复制整个 composition 目录
- [ ] **TEMP-02**: 创作者可以为视频配置首屏 hook、核心数字或核心承诺，并确保其在前 3 到 5 秒内被兑现
- [ ] **TEMP-03**: 创作者可以在模板层复用统一的主题 token、安全区规则和共享动画 API
- [ ] **TEMP-04**: 创作者可以从同一模板数据导出视频封面 still，并保证封面与视频首屏风格一致

### Publishing Package

- [ ] **PACK-01**: 创作者完成一次渲染后，可以同时获得成片、封面图、16 字以内标题、视频描述和 hashtags
- [ ] **PACK-02**: 生成的标题、封面文案和描述必须来自同一事实源，不能与视频内容产生关键信息漂移
- [ ] **PACK-03**: 发布素材先生成统一版通用结果，供创作者人工微调后分发到不同平台

## v2 Requirements

### Visual Differentiation

- **VIS-01**: 创作者可以调用一组可复用的技术视觉模块，如 GitHub 卡片、终端面板、benchmark 对比和架构流
- **VIS-02**: 创作者可以为同一条视频生成多组封面 / 标题 / Hook 变体预览，用于人工挑选更强 opening
- **VIS-03**: 系统可以基于结构化事实自动提炼 AI 技术内容爆点，生成更贴合技术圈表达的标题和封面候选

### Platform Specialization

- **PLAT-01**: 创作者可以针对视频号、抖音、B 站、小红书、快手分别生成平台定制版标题和描述
- **PLAT-02**: 创作者可以针对不同平台导出差异化封面裁切和文案排版方案

### Operations

- **OPS-01**: 创作者可以批量管理渲染任务、查看状态并在失败后重试
- **OPS-02**: 系统可以管理成片、封面、音频和 manifest 的生命周期，避免输出目录持续失控增长

## Out of Scope

| Feature | Reason |
|---------|--------|
| 自动抓取或批量解析推特/X 文案 | 本轮先采用人工筛选和粘贴输入，避免把重点从视频质量转向内容采集 |
| 自动发布到各视频平台 | 发布链路复杂且不是当前最高杠杆点，先把成片和发布素材做好 |
| 完整拖拽式时间线编辑器 | 会把项目从代码驱动流水线拉向重型视频编辑器，超出当前范围 |
| 扩大数字人 / AI 分身能力 | 对当前 AI 技术解说视频的 ROI 不稳定，不是提升前三秒停留的首要手段 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BRIEF-01 | Phase 1 | Complete |
| BRIEF-02 | Phase 1 | Complete |
| BRIEF-03 | Phase 1 | Complete |
| REG-01 | Phase 1 | Complete |
| REG-02 | Phase 1 | Complete |
| REG-03 | Phase 4 | Pending |
| MEDIA-01 | Phase 2 | Complete |
| MEDIA-02 | Phase 2 | Complete |
| MEDIA-03 | Phase 2 | Complete |
| TEMP-01 | Phase 3 | Pending |
| TEMP-02 | Phase 3 | Pending |
| TEMP-03 | Phase 3 | Pending |
| TEMP-04 | Phase 3 | Pending |
| PACK-01 | Phase 4 | Pending |
| PACK-02 | Phase 4 | Pending |
| PACK-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-29 after Phase 2 completion*
