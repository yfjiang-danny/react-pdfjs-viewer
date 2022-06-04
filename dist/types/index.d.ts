declare type ScaleStringType = "auto" | "fitWidth" | "fitHeight";
declare type ScaleType = ScaleStringType | number;
interface PageSize {
    width: number;
    height: number;
    scale: number;
}
export { PageSize, ScaleType };
