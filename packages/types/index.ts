type ScaleStringType = "auto" | "origin" | "fitWidth" | "fitHeight";
type ScaleType = ScaleStringType | number;

type ScrollMode = "vertical" | "horizontal";

interface PageSize {
  width: number;
  height: number;
  scale: number;
}

export { PageSize, ScaleType, ScrollMode };
