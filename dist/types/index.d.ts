declare type ScaleStringType = "auto" | "origin" | "fitWidth" | "fitHeight";
declare type ScaleType = ScaleStringType | number;
declare type ScrollMode = "vertical" | "horizontal";
interface PageSize {
    width: number;
    height: number;
    scale: number;
}
export { PageSize, ScaleType, ScrollMode };
