import { describe, expect, it } from "vitest";
import { CodexECCSchema } from "./schema";
import { getCoverTitleStyle } from "./cover-layout";

describe("CodexECC cover layout", () => {
  it("forces the cover title to stay on a single line", () => {
    const style = getCoverTitleStyle("Codex 塞进 Claude Code");

    expect(style.whiteSpace).toBe("nowrap");
    expect(style.wordBreak).toBe("keep-all");
    expect(style.fontSize).toBeLessThanOrEqual(54);
  });

  it("keeps the default visible copy free of ECC wording", () => {
    const props = CodexECCSchema.parse({});
    const visibleText = [
      props.coverLabel,
      props.coverTitle,
      props.coverSubtitle,
      ...props.coverMetrics,
      props.hookTitle,
      props.hookSubtitle,
      ...props.hookBadges,
      props.shiftTitle,
      ...props.shiftLayers.flatMap((item) => [
        item.title,
        item.detail,
        item.emphasis,
      ]),
      props.evidenceTitle,
      ...props.evidenceCards.flatMap((item) => [
        item.tag,
        item.title,
        item.detail,
        item.footnote,
      ]),
      props.eccTitle,
      ...props.eccStats.flatMap((item) => [
        item.value,
        item.label,
        item.detail,
      ]),
      ...props.eccPillars,
      props.stackTitle,
      ...props.stackRows.flatMap((item) => [
        item.stage,
        item.plugin,
        item.ecc,
        item.verdict,
      ]),
      props.riskTitle,
      ...props.riskCards.flatMap((item) => [
        item.title,
        item.detail,
        item.metric,
      ]),
      props.riskSnapshot.label,
      props.riskSnapshot.value,
      props.riskSnapshot.detail,
      props.ctaTitle,
      props.ctaBody,
      props.ctaSlogan,
      ...props.ctaTags,
      ...props.voiceoverScripts,
    ].join(" ");

    expect(visibleText).not.toMatch(/\bECC\b/i);
  });
});
