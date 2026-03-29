import { runMediaPreflight, summarizePreflightIssues } from "../src/shared/preflight-qa";

const getArgValue = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
};

async function main() {
  const compositionId = getArgValue("--id");
  const manifestPath = getArgValue("--manifest");

  if (!compositionId && !manifestPath) {
    throw new Error("Missing required flag: --id <compositionId> or --manifest <path>");
  }

  const resolvedCompositionId = compositionId ?? "unknown";
  const report = runMediaPreflight({
    compositionId: resolvedCompositionId,
    manifestPath,
  });

  if (report.ok) {
    console.log(`PRECHECK_OK ${report.compositionId}`);
    return;
  }

  report.issues.forEach((issue) => {
    const sceneText =
      typeof issue.sceneIndex === "number" ? issue.sceneIndex : "global";
    console.error(
      `[${issue.code}] scene=${sceneText} field=${issue.field} message=${issue.message}`,
    );
  });
  console.error(summarizePreflightIssues(report.issues));
  process.exit(1);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`PRECHECK_FAILED ${message}`);
  process.exit(1);
});
