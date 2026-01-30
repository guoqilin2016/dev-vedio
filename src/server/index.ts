import express from "express";
import path from "path";
import renderRoutes from "./routes/render";

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());

// 静态文件服务 - 提供渲染输出的视频文件
app.use("/videos", express.static(path.join(process.cwd(), "out")));

// API 路由
app.use("/api/render", renderRoutes);

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
      "GET /videos/:filename": "获取渲染后的视频文件",
      "GET /health": "健康检查",
    },
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📹 Video output available at http://localhost:${PORT}/videos/`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/render`);
  console.log(`  GET  http://localhost:${PORT}/api/render/compositions`);
  console.log(`  GET  http://localhost:${PORT}/health`);
});

export default app;
