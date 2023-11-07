import Tippy from "@tippyjs/react";
import React, { FC, JSXElementConstructor, ReactElement, useRef } from "react";
import { Instance } from "tippy.js";
import Button from "../../share/button";
import "./index.less";

export type ToolTypes = "property";

interface ToolProps {
  className?: string;
  children: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  onItemClick?(type: ToolTypes): void;
}

const Tool: FC<ToolProps> = ({ className, children, onItemClick }) => {
  const instanceRef = useRef<Instance | null>(null);

  return (
    <Tippy
      onMount={(instance) => {
        instanceRef.current = instance;
      }}
      content={
        <div className="tool-modal">
          <Button
            className="tool-button"
            onClick={() => {
              instanceRef.current && instanceRef.current.hide();
              setTimeout(() => {
                onItemClick?.("property");
              }, 0);
            }}
          >
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
