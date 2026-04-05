import { CSSProperties } from "react";

const getCoverTitleFontSize = (title: string): number => {
  const length = title.trim().length;

  if (length >= 22) {
    return 50;
  }

  if (length >= 18) {
    return 54;
  }

  if (length >= 14) {
    return 58;
  }

  return 64;
};

const getCoverTitleLetterSpacing = (title: string): string => {
  const length = title.trim().length;

  if (length >= 22) {
    return "-2px";
  }

  if (length >= 18) {
    return "-1px";
  }

  return "0px";
};

export const getCoverTitleStyle = (title: string): CSSProperties => ({
  fontSize: getCoverTitleFontSize(title),
  lineHeight: 1,
  fontWeight: 900,
  marginBottom: 14,
  textShadow: "0 0 26px rgba(255, 123, 66, 0.2)",
  whiteSpace: "nowrap",
  wordBreak: "keep-all",
  letterSpacing: getCoverTitleLetterSpacing(title),
  maxWidth: "100%",
});

