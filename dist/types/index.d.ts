declare type ScaleStringType = "auto" | "origin" | "fitWidth" | "fitHeight";
declare type ScaleType = ScaleStringType | number;
interface OptionModel {
    value: ScaleType;
    label: string;
}
declare type ScrollMode = "vertical" | "horizontal";
interface PageSize {
    vWidth: number;
    vHeight: number;
    width: number;
    height: number;
    scale: number;
}
export { PageSize, ScaleType, ScrollMode, OptionModel };
