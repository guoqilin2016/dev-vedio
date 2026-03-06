import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { RenderRequest, RenderResponse } from "../../shared/types";

// 缓存 bundled 结果
let bundleLocation: string | null = null;

async function getBundleLocation(): Promise<string> {
  if (bundleLocation) {
    return bundleLocation;
  }

  console.log("📦 Bundling Remotion project...");
  const entryPoint = path.join(process.cwd(), "src/index.ts");

  bundleLocation = await bundle({
    entryPoint,
    onProgress: (progress) => {
      if (progress % 20 === 0) {
        console.log(`  Bundle progress: ${progress}%`);
      }
    },
  });

  console.log("✅ Bundle complete");
  return bundleLocation;
}

export async function renderVideo(
  request: RenderRequest
): Promise<RenderResponse> {
  const startTime = Date.now();

  try {
    const bundleLocation = await getBundleLocation();

    // 选择 composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: request.compositionId,
      inputProps: request.inputProps,
    });

    // 生成输出文件名
    const outputFileName =
      request.outputFileName || `${request.compositionId}-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), "out", outputFileName);

    console.log(`🎬 Rendering "${request.compositionId}" to ${outputPath}...`);

    // 渲染视频
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: request.inputProps,
      onProgress: ({ progress }) => {
        const percent = Math.round(progress * 100);
        if (percent % 25 === 0) {
          console.log(`  Render progress: ${percent}%`);
        }
      },
    });

    const durationMs = Date.now() - startTime;
    console.log(`✅ Render complete in ${durationMs}ms`);

    return {
      success: true,
      outputPath,
      durationMs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Render failed: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
      durationMs: Date.now() - startTime,
    };
  }
}

// 获取可用的 composition 列表
export async function getAvailableCompositions(): Promise<string[]> {
  // 这里可以通过 bundle 动态获取，但简单起见直接返回硬编码列表
  return ["HelloWorld", "TextPresentation"];
}

// 清除 bundle 缓存（用于开发时热重载）
export function clearBundleCache(): void {
  bundleLocation = null;
  console.log("🗑️ Bundle cache cleared");
}
