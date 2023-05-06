import Tippy from "@tippyjs/react";
import React, { FC, JSXElementConstructor, ReactElement } from "react";
import Button from "../../share/button";
import "./index.less";

export type ToolTypes = "property"

interface ToolProps {
    className?: string;
    children: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    onItemClick?(type: ToolTypes): void;
}

const Tool: FC<ToolProps> = ({ className, children, onItemClick }) => {
    return (
        <Tippy
            content={
                <div className="tool-modal">
                    <Button className="tool-button" onClick={() => onItemClick?.("property")} >
                        <span>文档属性</span>
                    </Button>
                </div>
            }
            interactive
            trigger="click"
            className="tool-tippy"
        >
            {children}
        </Tippy>
    );
};

export default Tool;
