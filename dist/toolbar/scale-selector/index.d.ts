import { FC } from "react";
import { ScaleType } from "../../types";
export interface OptionModel {
    value: ScaleType | number;
    label: string;
}
interface ScaleSelectorProps {
}
declare const ScaleSelector: FC<ScaleSelectorProps>;
export default ScaleSelector;
