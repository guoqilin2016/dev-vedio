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

## TTS 配音 API

### 安装 edge-tts（TTS 引擎）

```bash
pip install edge-tts
```

### 生成配音

```bash
POST /api/tts
Content-Type: application/json

{
  "text": "你好，这是一段测试配音",
  "config": {
    "voice": "zh-CN-YunxiNeural",
    "rate": 1.0
  }
}
```

### 获取可用声音列表

```bash
GET /api/tts/voices
```

### 可用的中文声音

- `zh-CN-YunxiNeural` - 云希 (男)
- `zh-CN-XiaoxiaoNeural` - 晓晓 (女)
- `zh-CN-YunyangNeural` - 云扬 (男)
- `zh-CN-XiaoyiNeural` - 晓艺 (女)

## 字幕和音频功能

TextPresentation 模板支持：

- **卡拉OK字幕**：逐字高亮显示
- **TTS 配音**：自动生成语音
- **背景音乐**：可配置音量的循环播放

### 配置示例

```json
{
  "subtitle": {
    "enabled": true,
    "fontSize": 42,
    "position": "bottom",
    "highlightColor": "#ffd700"
  },
  "audio": {
    "backgroundMusic": "music/background.mp3",
    "backgroundMusicVolume": 0.3
  }
}
```

### 添加背景音乐

1. 从 [Pixabay Music](https://pixabay.com/music/) 下载免版权音乐
2. 将 MP3 文件放到 `public/music/` 目录
3. 在 props 中指定路径：`"backgroundMusic": "music/your-file.mp3"`

详细说明见 `public/music/README.md`

## 数字人（Digital Human）

支持集成 D-ID API 生成口型同步的数字人视频。

### 配置 D-ID API

1. 注册 D-ID 账号: https://www.d-id.com/
2. 获取 API Key
3. 设置环境变量:
```bash
export DID_API_KEY=your_api_key
```

### 生成数字人视频

```bash
DID_API_KEY=your_key npm run generate:digital-human
```

### 配置示例

```json
{
  "digitalHuman": {
    "enabled": true,
    "videos": [
      "videos/digital-human-scene1.mp4",
      "videos/digital-human-scene2.mp4"
    ],
    "position": "right",
    "scale": 0.25,
    "borderRadius": 20
  }
}
```

### API 接口

```bash
# 检查 D-ID 配置状态
GET /api/digital-human/status

# 生成单个数字人视频
POST /api/digital-human
{
  "audioPath": "audio/scene1.mp3",
  "config": {
    "sourceImageUrl": "https://your-image-url.jpg"
  }
}

# 批量生成
POST /api/digital-human/batch
{
  "audioFiles": ["audio/scene1.mp3", "audio/scene2.mp3"]
}
```

## 项目结构

```
├── src/
│   ├── components/            # 共享组件
│   │   └── KaraokeSubtitle.tsx # 卡拉OK字幕
│   ├── compositions/          # 视频模板
│   │   ├── index.ts           # 模板导出
│   │   ├── HelloWorld/        # 示例模板
│   │   └── TextPresentation/  # 演示模板（含字幕/音频）
│   ├── server/                # Express API
│   │   ├── index.ts           # 服务入口
│   │   ├── routes/            # API 路由
│   │   │   ├── render.ts      # 渲染接口
│   │   │   └── tts.ts         # TTS 接口
│   │   └── services/          # 业务逻辑
│   │       ├── renderer.ts    # 视频渲染
│   │       └── tts.ts         # TTS 服务
│   ├── shared/                # 共享代码
│   │   └── types.ts           # 类型定义
│   ├── index.ts               # Remotion 入口
│   └── Root.tsx               # Remotion 根组件
├── public/
│   ├── audio/                 # TTS 音频输出
│   └── music/                 # 背景音乐
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
