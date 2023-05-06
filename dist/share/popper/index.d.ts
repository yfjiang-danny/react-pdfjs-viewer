import { FC } from "react";
export declare type Placement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end";
interface PopoverProps {
    anchorEl?: HTMLElement | (() => HTMLElement) | null | undefined;
}
declare const Popover: FC<PopoverProps>;
export default Popover;
