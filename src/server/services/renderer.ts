import { bundle } from "@remotion/bundler";
import {
  getCompositions,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import path from "path";
import {
  buildDiscoveryPayload,
  resolveRenderInput,
} from "../../shared/render-contract";
import {
  runMediaPreflight,
  summarizePreflightIssues,
} from "../../shared/preflight-qa";
import {
  type DiscoverableComposition,
  RenderRequest,
  RenderResponse,
} from "../../shared/types";

// 缓存 bundled 结果
let bundleLocation: string | null = null;

const OUT_DIR = path.join(process.cwd(), "out");

/**
 * Resolve a user-provided output name to an absolute path under `out/`.
 * Rejects traversal (../, nested paths) via basename + resolved-prefix check.
 */
function resolveSafeOutputPath(
  outputFileName: string | undefined,
  defaultBaseName: string,
): string {
  const outResolved = path.resolve(OUT_DIR);
  const raw =
    typeof outputFileName === "string" && outputFileName.trim() !== ""
      ? outputFileName.trim().replace(/\\/g, "/")
      : "";
  let base = raw ? path.basename(raw) : defaultBaseName;
  if (!base || base === "." || base === "..") {
    base = defaultBaseName;
  }
  if (base.includes("\0")) {
    base = defaultBaseName;
  }
  const resolved = path.resolve(outResolved, base);
  const guardPrefix = outResolved + path.sep;
  if (resolved !== outResolved && !resolved.startsWith(guardPrefix)) {
    throw new Error("Invalid outputFileName: must stay inside the out directory");
  }
  return resolved;
}

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
  request: RenderRequest,
): Promise<RenderResponse> {
  const startTime = Date.now();

  try {
    const serveUrl = await getBundleLocation();
    const resolvedRequest = resolveRenderInput(request);

    if (resolvedRequest.registryEntry.subtitleMode !== "none") {
      const preflightReport = runMediaPreflight({
        compositionId: request.compositionId,
      });

      if (!preflightReport.ok) {
        const issueSummary = summarizePreflightIssues(preflightReport.issues);
        console.error(`❌ Preflight failed: ${issueSummary}`);
        return {
          success: false,
          error: `Media preflight failed for ${request.compositionId}: ${issueSummary}`,
          details: preflightReport.issues,
          durationMs: Date.now() - startTime,
        };
      }
    }

    // 选择 composition
    const composition = await selectComposition({
      serveUrl,
      id: request.compositionId,
      inputProps: resolvedRequest.inputProps,
    });

    const defaultBaseName =
      path.basename(resolvedRequest.registryEntry.output.video) ||
      `${request.compositionId}-${Date.now()}.mp4`;
    const outputPath = resolveSafeOutputPath(
      request.outputFileName,
      defaultBaseName,
    );

    console.log(`🎬 Rendering "${request.compositionId}" to ${outputPath}...`);

    // 渲染视频
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: resolvedRequest.inputProps,
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

// 获取可用的 composition 元数据（bundle 内存在且已在 catalog/registry 中登记）
export async function getAvailableCompositions(): Promise<
  DiscoverableComposition[]
> {
  const serveUrl = await getBundleLocation();
  const compositions = await getCompositions(serveUrl, {
    inputProps: {},
    logLevel: "error",
  });
  return buildDiscoveryPayload(compositions.map((composition) => composition.id));
}

// 清除 bundle 缓存（用于开发时热重载）
export function clearBundleCache(): void {
  bundleLocation = null;
  console.log("🗑️ Bundle cache cleared");
}
