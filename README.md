# Remotion 视频生成项目

基于 Remotion 的通用视频模板项目，支持命令行渲染和 API 服务两种方式。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

同时启动 Remotion Studio 和 API 服务：

```bash
npm run dev
```

- Remotion Studio: http://localhost:3000
- API 服务: http://localhost:3001

### 仅启动 Remotion Studio

```bash
npm run studio
```

### 仅启动 API 服务

```bash
npm run server:dev    # 开发模式（热重载）
npm run server:start  # 生产模式
```

## 命令行渲染

```bash
# 渲染默认示例视频
npm run render

# 自定义渲染参数
npx remotion render src/index.ts HelloWorld --output=out/custom.mp4 --props='{"title": "自定义标题"}'
```

## API 接口

### 渲染视频

```bash
POST /api/render
Content-Type: application/json

{
  "compositionId": "HelloWorld",
  "inputProps": {
    "title": "我的标题",
    "subtitle": "副标题",
    "backgroundColor": "#1a1a2e",
    "textColor": "#ffffff",
    "accentColor": "#e94560"
  },
  "outputFileName": "my-video.mp4"
}
```

### 获取可用模板列表

```bash
GET /api/render/compositions
```

### 清除缓存

```bash
POST /api/render/clear-cache
```

### 获取渲染后的视频

```bash
GET /videos/{filename}
```

## 项目结构

```
├── src/
│   ├── compositions/          # 视频模板
│   │   ├── index.ts           # 模板导出
│   │   └── HelloWorld/        # 示例模板
│   │       ├── index.tsx      # 模板组件
│   │       └── schema.ts      # 参数 Schema
│   ├── server/                # Express API
│   │   ├── index.ts           # 服务入口
│   │   ├── routes/            # API 路由
│   │   └── services/          # 业务逻辑
│   ├── shared/                # 共享代码
│   │   └── types.ts           # 类型定义
│   ├── index.ts               # Remotion 入口
│   └── Root.tsx               # Remotion 根组件
├── public/                    # 静态资源
├── out/                       # 渲染输出
├── remotion.config.ts         # Remotion 配置
├── tsconfig.json
└── package.json
```

## 添加新模板

1. 在 `src/compositions/` 下创建新文件夹
2. 创建 `schema.ts` 定义输入参数
3. 创建 `index.tsx` 实现视频组件
4. 在 `src/compositions/index.ts` 导出
5. 在 `src/Root.tsx` 注册 Composition
6. 在 `src/server/services/renderer.ts` 的 `getAvailableCompositions()` 中添加

## 技术栈

- [Remotion](https://www.remotion.dev/) - React 视频渲染框架
- [Express.js](https://expressjs.com/) - API 服务
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Zod](https://zod.dev/) - 参数验证
