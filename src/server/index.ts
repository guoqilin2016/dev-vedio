import express from "express";
import path from "path";
import renderRoutes from "./routes/render";
import ttsRoutes from "./routes/tts";
import digitalHumanRoutes from "./routes/digital-human";
import heygenRoutes from "./routes/heygen";

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());

// 静态文件服务
app.use("/videos", express.static(path.join(process.cwd(), "out")));
app.use("/audio", express.static(path.join(process.cwd(), "public", "audio")));
app.use("/music", express.static(path.join(process.cwd(), "public", "music")));

// API 路由
app.use("/api/render", renderRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/digital-human", digitalHumanRoutes);
app.use("/api/heygen", heygenRoutes);

// 健康检查
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// 根路径
app.get("/", (_req, res) => {
  res.json({
    name: "Remotion Video Render API",
    version: "1.0.0",
    endpoints: {
      "POST /api/render": "渲染视频",
      "GET /api/render/compositions": "获取可用的 composition 列表",
      "POST /api/render/clear-cache": "清除 bundle 缓存",
      "POST /api/tts": "生成 TTS 配音",
      "POST /api/tts/batch": "批量生成 TTS 配音",
      "GET /api/tts/voices": "获取可用声音列表",
      "GET /videos/:filename": "获取渲染后的视频文件",
      "GET /audio/:filename": "获取 TTS 音频文件",
      "GET /music/:filename": "获取背景音乐文件",
      "GET /health": "健康检查",
    },
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📹 Video output available at http://localhost:${PORT}/videos/`);
  console.log(`🔊 Audio files available at http://localhost:${PORT}/audio/`);
  console.log(`🎵 Music files available at http://localhost:${PORT}/music/`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/render`);
  console.log(`  POST http://localhost:${PORT}/api/tts`);
  console.log(`  GET  http://localhost:${PORT}/api/tts/voices`);
  console.log(`  GET  http://localhost:${PORT}/health`);
});

export default app;
