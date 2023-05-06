import { FC, JSXElementConstructor, ReactElement } from "react";
import "./index.less";
export declare type ToolTypes = "property";
interface ToolProps {
    className?: string;
    children: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    onItemClick?(type: ToolTypes): void;
}
declare const Tool: FC<ToolProps>;
export default Tool;
