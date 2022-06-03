type ScaleStringType = "auto" | "fitWidth" | "fitHeight";
type ScaleType = ScaleStringType | number;

interface PageSize {
    width: number;
    height: number;
    scale: number;
}

export { PageSize, ScaleType }